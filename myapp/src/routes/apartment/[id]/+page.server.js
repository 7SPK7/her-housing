import { fetchHousingData } from "$lib/data";
import { generateSentimentForPlace } from "$lib/sentiment";
import { calculateCommute } from "../../../lib/commute.js";
import { safeScore } from "../../../lib/safety.js";

export async function load({ params }) {
    let dataRaw = await fetchHousingData(1);
    let data = dataRaw["data"];

    const place = data[params.id];

    console.log(place["seoName"].split("Now")[0])
    const sentiment = await generateSentimentForPlace(place["seoName"].split("Now Accepting")[0]);
    // console.log(sentiment);
    let [pros, cons] = [["No user feedback received"], ["No user feedback received"]];
    try {
        [pros, cons] = sentiment.split("Cons:");


        pros = pros.split('\n').filter((x) => x.trim() != "");
        cons = cons.split('\n').filter((x) => x.trim() != "");
    } catch (ex) {
        console.error("cannot do thing");
    }

    let imageUrl;

    if (place["media"] == null) {
        imageUrl = "none.jpg";
    } else {
        imageUrl = place["media"]["mainPhoto"]["source"];
    }

    const address = place["geography"]["streetAddress"];
    const description = place["propertyType"];
    const rentPrice = place["floorPlanSummary"]["price"]["formatted"];

    const latitude = place["geography"]["latitude"];
    const longitude = place["geography"]["longitude"];
    const safety = await safeScore(latitude, longitude);

    const commuteTime = await calculateCommute(place["geography"]["streetAddress"] + " Blacksburg, Virginia");

    const amenities = place["amenityGroups"].map((entry) => {
        return {name: entry["categoryName"], items: entry["items"]};
    });

    return { pros, cons, imageUrl, address, description, rentPrice, safety, commuteTime, amenities };
}
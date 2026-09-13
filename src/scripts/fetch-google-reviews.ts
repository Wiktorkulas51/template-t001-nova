// Pobiera opinie z Google Places API i zapisuje do src/data/sections/testimonials.json
// Usage: GOOGLE_PLACES_API_KEY=... GOOGLE_PLACE_ID=... npx tsx src/scripts/fetch-google-reviews.ts

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const TESTIMONIALS_PATH = join(ROOT, "data", "sections", "testimonials.json");

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

// Minimum rating of reviews that go into testimonials.json (lower ones are ignored)
const MIN_RATING = 4.0;

type GoogleReview = {
  text?: {
    text?: string;
  };
  authorAttribution?: {
    displayName?: string;
    photoUri?: string;
  };
  rating?: number;
  publishTime?: string;
};

type GooglePlaceResponse = {
  reviews?: GoogleReview[];
};

if (!API_KEY || !PLACE_ID) {
  console.error("Błąd: ustaw GOOGLE_PLACES_API_KEY i GOOGLE_PLACE_ID w env");
  process.exit(1);
}

// Placeholder, actually pulls from the Google Places API and normalizes to the testimonials.json format.
async function main() {
  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=reviews&key=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Places API zwróciło ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as GooglePlaceResponse;
    const rawReviews = data.reviews ?? [];

    // We skip reviews below the MIN_RATING threshold so as not to spoil the average rating on the site
    const filteredReviews = rawReviews.filter((review) => (review.rating ?? 0) >= MIN_RATING);
    const skippedCount = rawReviews.length - filteredReviews.length;

    const testimonials = filteredReviews.slice(0, 10).map((review) => {
      const authorName = review.authorAttribution?.displayName || "Anonim";

      return {
        quote: review.text?.text || "",
        author: authorName,
        role: "Klient",
        avatar:
          review.authorAttribution?.photoUri ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`,
        rating: review.rating,
        date: review.publishTime,
      };
    });

    const output = {
      title: "Opinie klientów",
      description: "Co mówią o nas klienci",
      testimonials,
    };

    writeFileSync(TESTIMONIALS_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf-8");
    console.log(`Pobrano ${testimonials.length} opinii (pominięto ${skippedCount} poniżej progu ${MIN_RATING}).`);
  } catch (error) {
    console.error("Błąd podczas pobierania opinii:", error);
    process.exit(1);
  }
}

void main();

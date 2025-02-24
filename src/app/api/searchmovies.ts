// pages/api/search-movie.ts
import { NextApiRequest, NextApiResponse } from "next";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Make the request to TMDB API server-side
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&with_original_language=ta`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: "Failed to fetch movies" });
    }

    const data = await response.json();
    return res.status(200).json(data.results);
  } catch (error) {
    console.error("Error fetching data from TMDB:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

import { genreInstance, movieInstance } from "@crapstar/crapstar-dal";

export type Movie = {
  id: number;
  title: string;
  description: string;
  year: number;
  poster_url?: string;
  genres: Genre[];
};

export type Genre = {
  id: number;
  name: string;
};

export type MovieInstanceWithGenres = movieInstance & {
  genres: genreInstance[];
};

export type RequestableEmotionType = "current_emotions" | "future_emotions";

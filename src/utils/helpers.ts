import * as _ from "lodash";

import {
  Genre,
  Movie,
  MovieInstanceWithGenres,
  RequestableEmotionType,
} from "../models/models";
import { Express } from "../models/express";
import dal from "../dal";
import { genreInstance, movieInstance } from "@crapstar/crapstar-dal";

export const getEmotionIdsFromReq = (
  req: Express.Request,
  queryName: RequestableEmotionType
): number[] =>
  (req.query[queryName] ? JSON.parse(req.query[queryName] as string) : []).map(
    (idStr: string) => parseInt(idStr)
  );

export const checkIfEmotionIdsArrayHasAtLeastOneElement = (
  emotionIds: number[]
): boolean => !!emotionIds.length;

export const checkIfEmotionIdsExistInDB = async (
  ...emotionIdsArrays: Array<number[]>
): Promise<boolean> => {
  const emotionIdsArraysInDB = await Promise.all(
    emotionIdsArrays.map((ids) => dal.Emotion.findAll({ where: { id: ids } }))
  );
  return emotionIdsArrays.every(
    (ids, index) =>
      ids.length === emotionIdsArraysInDB.length &&
      _.xor(
        ids,
        emotionIdsArraysInDB[index].map((emotion) => emotion.id)
      ).length === 0
  );
};

export const mapMovieInstanceWithGenresToMovie = (
  movieInstanceWithGenres: MovieInstanceWithGenres
): Movie => ({
  id: movieInstanceWithGenres.id,
  title: movieInstanceWithGenres.title,
  description: movieInstanceWithGenres.description,
  year: movieInstanceWithGenres.year,
  poster_url: movieInstanceWithGenres.poster_url || undefined,
  genres: movieInstanceWithGenres.genres.map((g) => mapGenreInstanceToGenre(g)),
});

export const mapGenreInstanceToGenre = (
  genreInstance: genreInstance
): Genre => ({ id: genreInstance.id, name: genreInstance.name });

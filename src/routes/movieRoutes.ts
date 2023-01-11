import { Router } from "express";

import { errorWrapper, jsonify } from "../utils/express";
import { Express, GetMovieResponse } from "../models/express";

import { getMovieLambda } from "../lambdas/getMovieLambda";
import {
  checkIfEmotionIdsArrayHasAtLeastOneElement,
  checkIfEmotionIdsExistInDB,
  getEmotionIdsFromReq,
} from "../utils/helpers";

const router = Router();

const getMovie = async (req: Express.Request): Promise<GetMovieResponse> => {
  const currentEmotionIds = getEmotionIdsFromReq(req, "current_emotions");
  const futureEmotionIds = getEmotionIdsFromReq(req, "future_emotions");

  const doEmotionIdsHaveAtLeastOneElement =
    checkIfEmotionIdsArrayHasAtLeastOneElement(currentEmotionIds) &&
    checkIfEmotionIdsArrayHasAtLeastOneElement(futureEmotionIds);

  if (!doEmotionIdsHaveAtLeastOneElement) {
    return {
      status: "invalid-data",
    };
  }

  const emotionIdsExistInDb = await checkIfEmotionIdsExistInDB(
    currentEmotionIds,
    futureEmotionIds
  );

  if (!emotionIdsExistInDb) {
    return {
      status: "invalid-data",
    };
  }

  const movie = await getMovieLambda(currentEmotionIds, futureEmotionIds);

  if (!movie) {
    return {
      status: "not-found",
    };
  }

  return {
    status: "ok",
    movie,
  };
};

router.get("/", errorWrapper(jsonify(getMovie)));

export default router;

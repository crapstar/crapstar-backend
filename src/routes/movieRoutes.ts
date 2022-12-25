import { Router } from "express";

import { errorWrapper, jsonify } from "../utils/express";
import { Express } from "../models/express";
import dal from "../dal";

const router = Router();

const getMovie = async (req: Express.Request) => {
  // TODO get movie from lambda

  const movie = await dal.Movie.findByPk(1);
  return {
    status: "ok",
    movie,
  };
};

router.get("/", errorWrapper(jsonify(getMovie)));

export default router;

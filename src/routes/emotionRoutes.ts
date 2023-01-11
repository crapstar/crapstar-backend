import { Router } from "express";

import dal from "../dal";

import { errorWrapper, jsonify } from "../utils/express";

const router = Router();

const getEmotionList = async () => {
  const emotions = await dal.Emotion.findAll();
  return {
    status: "ok",
    emotions,
  };
};

router.get("/list", errorWrapper(jsonify(getEmotionList)));

export default router;

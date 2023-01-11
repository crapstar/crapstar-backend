import { Router } from "express";

import { errorWrapper, jsonify } from "../utils/express";
import { Express } from "../models/express";

const router = Router();

const getQuestionnaire = async (req: Express.Request) => {
  console.log(req);
  return {
    status: "ok",
    word: "NICE",
  };
};

router.get("/", errorWrapper(jsonify(getQuestionnaire)));

export default router;

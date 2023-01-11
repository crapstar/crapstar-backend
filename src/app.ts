import express from "express";

import { getEnvValue } from "./utils/config";

import emotionRoutes from "./routes/emotionRoutes";
import movieRoutes from "./routes/movieRoutes";

const app = express();
const port = getEnvValue("PORT", "number");

app.use("/emotion", emotionRoutes);
app.use("/movie", movieRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

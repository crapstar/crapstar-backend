import express from "express";

import questionnaireRoutes from "./routes/questionnaireRoutes";
import movieRoutes from "./routes/movieRoutes";

const app = express();
const port = 3000;

// Routes:
// Questions endpoint
// Movie endpoint

app.use("/questionnaire", questionnaireRoutes);
app.use("/movie", movieRoutes);

app.listen(port, () => {
  console.log(`Example app listening on ports ${port}`);
});

// import {
//   AddLayerVersionPermissionCommand,
//   AddLayerVersionPermissionCommandInput,
// } from "@aws-sdk/client-lambda";

import dal from "../dal";
// import lambda from "../lambda";

import { mapMovieInstanceWithGenresToMovie } from "../utils/helpers";
import { Movie, MovieInstanceWithGenres } from "../models/models";

// const params: AddLayerVersionPermissionCommandInput = {
//   Action: "action",
//   LayerName: "layerName",
//   Principal: "principal",
//   StatementId: "statementId",
//   VersionNumber: 1,
// };
// const command = new AddLayerVersionPermissionCommand(params);

export const getMovieLambda = async (
  currentEmotionIds: number[],
  futureEmotionIds: number[]
): Promise<Movie | null> => {
  // const data = await lambda.send(command);
  // console.log("__data", data);
  console.log("__currentEmotionIds", currentEmotionIds);
  console.log("__futureEmotionIds", futureEmotionIds);
  const movie = await (<Promise<MovieInstanceWithGenres>>(
    dal.Movie.findByPk(1, { include: { model: dal.Genre } })
  ));
  return !movie ? null : mapMovieInstanceWithGenresToMovie(movie);
};

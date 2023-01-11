import { LambdaClient } from "@aws-sdk/client-lambda";

import { getEnvValue } from "./utils/config";

// a client can be shared by different commands.
const lambda = new LambdaClient({
  region: getEnvValue("AWS_REGION", "string"),
});

export default lambda;

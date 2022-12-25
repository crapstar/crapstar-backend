import { Dal } from "@crapstar/crapstar-dal";
import { getEnvValue } from "./utils/config";

const dal = new Dal({
  port: getEnvValue("MAIN_DB_POST", "number"),
  database: getEnvValue("MAIN_DB_DATABASE", "string"),
  replication: {
    write: {
      host: getEnvValue("MAIN_DB_HOST", "string"),
    },
    read: getEnvValue("MAIN_DB_READ_HOSTS", "string")
      ?.split(",")
      .map((s) => ({
        host: s,
      })),
  },
  user: getEnvValue("MAIN_DB_USER", "string"),
  password: getEnvValue("MAIN_DB_PASSWORD", "string"),
  pool: {
    max: 50,
  },
});

export default dal;

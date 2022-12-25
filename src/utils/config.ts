type EnvValueType = "number" | "string" | "boolean";

type GetEnvValue<T extends EnvValueType> = T extends "number"
  ? number
  : T extends "string"
  ? string
  : T extends boolean
  ? boolean
  : undefined;

export const getEnvValue = <T extends EnvValueType>(
  key: string,
  type: T
): GetEnvValue<T> => {
  const value = process.env[key];
  if (typeof value === "undefined") {
    return undefined as GetEnvValue<T>;
  }
  switch (type) {
    case "number":
      return parseFloat(value) as GetEnvValue<T>;
    case "string":
      return value as GetEnvValue<T>;
    case "boolean":
      return !!value as GetEnvValue<T>;
    default:
      return undefined as GetEnvValue<T>;
  }
};

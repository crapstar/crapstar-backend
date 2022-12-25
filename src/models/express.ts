import express from "express";

export declare namespace Express {
  export interface Request extends express.Request {}
  export interface Response extends express.Response {}
  export interface NextFunction extends express.NextFunction {}
}

type ErrorMessage = "not-found" | "invalid-data" | "unauthorized";

export interface IGenericErrorResponse<T extends ErrorMessage> {
  status: T;
  message?: string;
}

export type IGenericOkResponse = {
  status: "ok";
};

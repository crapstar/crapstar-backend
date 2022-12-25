import { Request, Response, NextFunction } from "express";

type ErrorWrapper = (req: Request, res: Response, next: NextFunction) => void;

export function errorWrapper(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): ErrorWrapper {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const routePromise = fn(req, res, next);
      if (!routePromise || !routePromise.catch) {
        throw new Error("Wrapped function is not a promise " + req.originalUrl);
      } else {
        routePromise.catch((err) => next(err));
      }
    } catch (err) {
      next(err);
    }
  };
}

export function jsonify<T extends { status: string }>(
  apiFunc: (req: Request) => Promise<T>
): (req: Request, res: Response, _: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, _: NextFunction) => {
    const ret = await apiFunc(req);
    res.status(200).json(ret);
  };
}

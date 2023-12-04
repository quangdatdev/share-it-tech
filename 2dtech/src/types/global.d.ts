import { Params } from "itty-router";

declare global {
  interface Request {
    params?: Params;
  }
}

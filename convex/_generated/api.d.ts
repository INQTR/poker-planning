/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as canvas from "../canvas.js";
import type * as cleanup from "../cleanup.js";
import type * as constants from "../constants.js";
import type * as crons from "../crons.js";
import type * as demo from "../demo.js";
import type * as maintenance from "../maintenance.js";
import type * as model_canvas from "../model/canvas.js";
import type * as model_cleanup from "../model/cleanup.js";
import type * as model_demo from "../model/demo.js";
import type * as model_rooms from "../model/rooms.js";
import type * as model_timer from "../model/timer.js";
import type * as model_users from "../model/users.js";
import type * as model_votes from "../model/votes.js";
import type * as rooms from "../rooms.js";
import type * as scales from "../scales.js";
import type * as timer from "../timer.js";
import type * as users from "../users.js";
import type * as votes from "../votes.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  canvas: typeof canvas;
  cleanup: typeof cleanup;
  constants: typeof constants;
  crons: typeof crons;
  demo: typeof demo;
  maintenance: typeof maintenance;
  "model/canvas": typeof model_canvas;
  "model/cleanup": typeof model_cleanup;
  "model/demo": typeof model_demo;
  "model/rooms": typeof model_rooms;
  "model/timer": typeof model_timer;
  "model/users": typeof model_users;
  "model/votes": typeof model_votes;
  rooms: typeof rooms;
  scales: typeof scales;
  timer: typeof timer;
  users: typeof users;
  votes: typeof votes;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

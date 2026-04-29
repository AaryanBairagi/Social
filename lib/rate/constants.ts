export const RATE_LIMITS = {
  MESSAGE: { windowMs: 10 * 1000, max: 20 },       // 20 msgs / 10 sec
  POST: { windowMs: 60 * 1000, max: 5 },           // 5 posts / min
  COMMENT: { windowMs: 60 * 1000, max: 10 },       // 10 comments / min
  CONNECTION: { windowMs: 60 * 1000, max: 10 },    // 10 reqs / min
};
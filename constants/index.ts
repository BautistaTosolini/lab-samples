export const COOKIE_NAME = 'AuthToken';
export const MAX_AGE = 3 * 24 * 60 * 60; //JWT Token duration
export const PER_PAGE = parseInt(process.env.PER_PAGE!) || 25; //How much samples per fetch
/**
 * @typedef {Object} Contributor
 * @property {string} id
 * @property {string} nameEn
 * @property {string} nameSi
 * @property {string|null} nameIt
 * @property {string|null} image
 * @property {string|null} bioEn
 * @property {string|null} bioSi
 * @property {string|null} bioIt
 * @property {Date|string} createdAt
 * @property {Date|string} updatedAt
 */

/**
 * @typedef {Contributor & { contributions: import('./song').Contribution[] }} ContributorWithSongs
 */

export {};
  

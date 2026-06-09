/**
 * @typedef {Object} Song
 * @property {string} id
 * @property {string} titleEn
 * @property {string} titleSi
 * @property {string|null} titleIt
 * @property {string} slug
 * @property {string|null} coverImage
 * @property {string|null} youtubeUrl
 * @property {string|null} spotifyUrl
 * @property {string|null} genre
 * @property {number|null} releaseYear
 * @property {boolean} isFeatured
 * @property {Date|string} createdAt
 * @property {Date|string} updatedAt
 */

/**
 * @typedef {string} ContribRole
 */

/**
 * @typedef {Object} Contribution
 * @property {string} id
 * @property {string} songId
 * @property {string} contributorId
 * @property {ContribRole} role
 * @property {Date|string} createdAt
 * @property {Date|string} updatedAt
 * @property {Song} [song]
 * @property {import('./contributor').Contributor} [contributor]
 */

/**
 * @typedef {Song & { contributions: Contribution[] }} SongWithContributions
 */

export {};
  

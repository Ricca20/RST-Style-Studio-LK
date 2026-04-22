/**
 * @typedef {'PENDING'|'REVIEWED'|'ACCEPTED'|'REJECTED'} QuotationStatus
 */

/**
 * @typedef {Object} QuotationService
 * @property {string} id
 * @property {string} nameEn
 * @property {string} nameSi
 * @property {string|null} nameIt
 * @property {string|null} descriptionEn
 * @property {string|null} descriptionSi
 * @property {string|null} descriptionIt
 * @property {string|null} icon
 * @property {boolean} isActive
 * @property {number|null} basePrice
 */

/**
 * @typedef {Object} QuotationRequest
 * @property {string} id
 * @property {QuotationStatus} status
 * @property {string} name
 * @property {string} phone
 * @property {string|null} email
 * @property {string} serviceType
 * @property {boolean} isSinhala
 * @property {boolean} needsMelody
 * @property {boolean} needsInstruments
 * @property {boolean} needsMusicVideo
 * @property {number} estimatedBudget
 * @property {Date|string} createdAt
 * @property {Date|string} updatedAt
 */

/**
 * @typedef {Object} QuotationFormData
 * @property {string} name
 * @property {string} phone
 * @property {string} [email]
 * @property {string} serviceType
 * @property {boolean} isSinhala
 * @property {boolean} needsMelody
 * @property {boolean} needsInstruments
 * @property {boolean} needsMusicVideo
 */

/**
 * @typedef {Object} QuotationOptions
 * @property {boolean} isSinhala
 * @property {boolean} needsMelody
 * @property {boolean} needsInstruments
 * @property {boolean} needsMusicVideo
 */

export {};
  

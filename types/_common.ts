/**
 * Id
 * @pattern [0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}
 */
export type Id = string;

/**
 * Nonce value, prefer to use ULIDs here for better feature support.
 * @minLength 1
 * @maxLength 36
 */
export type Nonce = string;

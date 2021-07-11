/**
 * Id
 * @pattern [0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}
 */
export type Id = string;

/**
 * Nonce value, prefer to use ULIDs here for better feature support.
 * 
 * Used to prevent double requests to create objects.
 * 
 * @minLength 1
 * @maxLength 36
 */
export type Nonce = string;

/**
 * Autumn file ID, [learn more](https://example.com/TODO).
 * @minLength 1
 * @maxLength 128
 */
export type AutumnId = string;

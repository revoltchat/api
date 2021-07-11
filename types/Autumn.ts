/**
 * Attachment ID
 * @minLength 1
 * @maxLength 128
 */
export type AttachmentId = string;

export type AttachmentMetadata = (
    { type: 'File' } |
    { type: 'Text' } |
    { type: 'Audio' } |
    { type: 'Image', width: number, height: number } |
    { type: 'Video', width: number, height: number }
);

/**
 * Attachment tag
 */
export type AttachmentTag = 'attachments' | 'avatars' | 'backgrounds' | 'icons' | 'banners';

export type Attachment = {
    _id: AttachmentId

    tag: AttachmentTag

    /**
     * File size (in bytes)
     */
    size: number

    /**
     * File name
     */
    filename: string

    /**
     * Metadata
     */
    metadata: AttachmentMetadata

    /**
     * Content type
     */
    content_type: string
}

/**
 * File serving parameters
 */
export interface SizeOptions {
    /**
     * Width of resized image
     */
    width?: number

    /**
     * Height of resized image
     */
    height?: number

    /**
     * Width and height of resized image
     */
    size?: number

    /**
     * Maximum resized image side length
     */
    max_side?: number
}

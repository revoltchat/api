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
    content_type: string,
};

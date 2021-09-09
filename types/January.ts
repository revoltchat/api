/**
 * An embedded image
 */
export type EmbedImage = {
    url: string
    
    width: number

    height: number

    size: 'Large' | 'Preview'
}

/**
 * An embedded video
 */
export type EmbedVideo = {
    url: string

    width: number

    height: number
}

/**
 * A special 3rd party embed
 */
export type EmbedSpecial = (
    { type: 'None' } |
    { type: 'YouTube', id: string, timestamp?: string } |
    { type: 'Twitch', content_type: 'Channel' | 'Video' | 'Clip', id: string } |
    { type: 'Spotify', content_type: string, id: string } |
    { type: 'Soundcloud' } |
    { type: 'Bandcamp', content_type: 'Album' | 'Track', id: string }
)

/**
 * Message embed
 */
export type Embed = (
    {
        type: 'None'
    } | {
        type: 'Website'

        url?: string

        special?: EmbedSpecial

        title?: string

        description?: string

        image?: EmbedImage

        video?: EmbedVideo

        site_name?: string

        icon_url?: string

        colour?: string
    } | ({
        type: 'Image'
    } & EmbedImage)
);

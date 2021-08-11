import type { Attachment } from "./Autumn";
import type { Username } from "./Users";
import type { Id } from "./_common";

export interface Bot {
    /**
     * Bot ID
     * 
     * This matches the bot's User ID.
     */
    _id: Id

    /**
     * Bot owner's User ID
     */
    owner: Id

    /**
     * Bot authentication token
     */
    token: string

    /**
     * Whether the bot can be added by anyone
     */
    public: boolean

    /**
     * Interactions endpoint URL
     * 
     * Required for dynamic interactions such as bot commands and message actions. Events will be sent over HTTP and a response may be generated directly.
     */
    interactions_url?: string
}

export interface PublicBot {
    /**
     * Bot ID
     */
    _id: Id

    /**
     * Bot username
     */
    username: Username

    /**
     * Bot avatar
     */
    avatar?: Attachment

    /**
     * Bot description, taken from profile text
     */
    description?: string
}

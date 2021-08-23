import type { Attachment } from "./Autumn"
import type { Id, Nonce } from "./_common"
import type { Embed } from "./January"

/**
 * Last message sent in channel
 */
export type LastMessage = {
    /**
     * Message ID
     */
    _id: Id

    /**
     * Author ID
     */
    author: Id

    /**
     * Short content of message
     * @maxLength 128
     */
    short: string
}

/**
 * Saved Messages channel has only one participant, the user who created it.
 */
export type SavedMessagesChannel = {
    /**
     * Channel Id
     */
    _id: Id

    channel_type: 'SavedMessages'

    /**
     * User Id
     */
    user: Id
}

export type DirectMessageChannel = {
    /**
     * Channel Id
     */
    _id: Id

    channel_type: 'DirectMessage'
    
    /**
     * Whether this DM is active
     */
    active: boolean

    /**
     * List of user IDs who are participating in this DM
     */
    recipients: Id[]

    last_message?: LastMessage
}

export type GroupChannel = {
    /**
     * Channel Id
     */
    _id: Id,

    channel_type: 'Group',

    /**
     * List of user IDs who are participating in this group
     */
    recipients: Id[],

    /**
     * Group name
     */
    name: string,

    /**
     * User ID of group owner
     */
    owner: Id,

    /**
     * Group description
     */
    description?: string,

    last_message?: LastMessage,

    /**
     * Group icon
     */
    icon?: Attachment,

    /**
     * Permissions given to group members
     */
    permissions?: number

    /**
     * Whether this channel is marked as not safe for work
     */
    nsfw?: boolean
}

export type ServerChannel = {
    /**
     * Channel Id
     */
    _id: Id

    /**
     * Server Id
     */
    server: Id

    /**
     * Channel name
     */
    name: string

    /**
     * Channel description
     */
    description?: string

    icon?: Attachment

    /**
     * Permissions given to all users
     */
    default_permissions?: number

    /**
     * Permissions given to roles
     */
    role_permissions?: {
        [key: string]: number
    }

    /**
     * Whether this channel is marked as not safe for work
     */
    nsfw?: boolean
}

export type TextChannel = ServerChannel & {
    channel_type: 'TextChannel'

    last_message?: string
}

export type VoiceChannel = ServerChannel & {
    channel_type: 'VoiceChannel'
}

export type Channel = (SavedMessagesChannel | DirectMessageChannel | GroupChannel | TextChannel | VoiceChannel) & { nonce?: string }

export type Message = {
    /**
     * Message Id
     */
    _id: Id

    nonce?: Nonce

    /**
     * Channel Id
     */
    channel: Id

    /**
     * Author Id
     */
    author: Id

    /**
     * Message content, can be an object *only* if sent by the system user.
     */
    content: string | SystemMessage

    /**
     * Message attachments
     */
    attachments?: Attachment[]

    /**
     * Unix timestamp of when message was last edited
     */
    edited?: { $date: string }

    /**
     * Message link embeds
     */
    embeds?: Embed[]

    /**
     * Array of user IDs mentioned in message
     */
    mentions?: Id[]

    /**
     * Array of message IDs replied to
     */
    replies?: Id[]
}

export type SystemMessage =
    | { type: "text"; content: string }
    | { type: "user_added"; id: Id; by: Id }
    | { type: "user_remove"; id: Id; by: Id }
    | { type: "user_joined"; id: Id }
    | { type: "user_left"; id: Id }
    | { type: "user_kicked"; id: Id }
    | { type: "user_banned"; id: Id }
    | { type: "channel_renamed"; name: string, by: Id }
    | { type: "channel_description_changed"; by: Id }
    | { type: "channel_icon_changed"; by: Id };

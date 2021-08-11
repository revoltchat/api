import type { Attachment } from './Autumn';
import type { Id } from './_common';

/**
 * Username
 * @minLength 2
 * @maxLength 32
 * @pattern ^[a-zA-Z0-9_.]+$
 */
export type Username = string;

/**
 * Your relationship with the user
 */
export enum RelationshipStatus {
    None = "None",
    User = "User",
    Friend = "Friend",
    Outgoing = "Outgoing",
    Incoming = "Incoming",
    Blocked = "Blocked",
    BlockedOther = "BlockedOther"
}

export type RelationshipOnly = {
    status: RelationshipStatus
};

export type Relationship = RelationshipOnly & {
    /**
     * Other user's ID
     */
    _id: Id
};

/**
 * User presence
 */
export enum Presence {
    Online = "Online",
    Idle = "Idle",
    Busy = "Busy",
    Invisible = "Invisible"
}

/**
 * User status
 */
export type Status = {
    /**
     * Custom status text
     * @minLength 1
     * @maxLength 128
     */
    text?: string

    presence?: Presence
}

export enum Badges {
    Developer = 1,
    Translator = 2,
    Supporter = 4,
    ResponsibleDisclosure = 8,
    RevoltTeam = 16,
    EarlyAdopter = 256,
}

/**
 * Bot information
 */
export interface BotInformation {
    /**
     * The User ID of the owner of this bot
     */
    owner: Id
}

export interface User {
    /**
     * User ID
     */
    _id: Id

    username: Username

    /**
     * User avatar
     */
    avatar?: Attachment

    /**
     * Relationships with other known users
     * Only present if fetching self
     */
    relations?: Relationship[]

    /**
     * Bitfield of user's badges
     */
    badges?: number

    status?: Status

    /**
     * Relationship to user
     */
    relationship?: RelationshipStatus

    /**
     * Whether the user is online
     */
    online?: boolean

    /**
     * User flags
     * 
     * `0x1`: Account is suspended
     * `0x2`: Account was deleted
     * `0x4`: Account is banned
     */
    flags?: number

    /**
     * Bot information, present if user is a bot.
     */
    bot?: BotInformation
}

export interface Profile {
    /**
     * Profile content
     * @minLength 0
     * @maxLength 2000
     */
    content?: string

    /**
     * Profile background
     */
    background?: Attachment
}

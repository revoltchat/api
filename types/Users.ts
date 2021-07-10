import type { Attachment } from './Autumn';
import type { Id } from './_common';

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

export type Relationship = {
    /**
     * Other user's ID
     */
    _id: Id

    status: Relationship
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

export interface User {
    /**
     * User ID
     */
    _id: Id

    /**
     * @minLength 2
     * @maxLength 32
     * @pattern ^[a-zA-Z0-9_.]+$
     */
    username: string

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
    relationship?: Relationship

    /**
     * Whether the user is online
     */
    online?: boolean
}

export interface Profile {
    /**
     * @minLength 0
     * @maxLength 2000
     */
    content?: string

    background?: Attachment
}

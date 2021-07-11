import type { Attachment } from './Autumn';
import type { Id } from './_common';

export type MemberCompositeKey = {
    server: Id,
    user: Id
}

export type Member = {
    _id: MemberCompositeKey,
    
    nickname?: string,
    avatar?: Attachment,

    roles?: Id[]
}

export type Ban = {
    _id: MemberCompositeKey,
    reason?: string
}

/**
 * Tuple consisting of server and channel permissions in that order
 */
export type PermissionTuple = [
    number,
    number
]

export type Role = {
    name: string,
    permissions: PermissionTuple,
    colour?: string
}

export type Category = {
    id: Id,
    title: string,
    channels: string[]
}

export type SystemMessageChannels = {
    /** Channel ID where user join events should be sent */
    user_joined?: Id,
    /** Channel ID where user leave events should be sent */
    user_left?: Id,
    /** Channel ID where user kick events should be sent */
    user_kicked?: Id,
    /** Channel ID where user ban events should be sent */
    user_banned?: Id,
}

export type Server = {
    /**
     * Server ID
     */
    _id: Id,
    nonce?: string,
    owner: string,

    name: string,
    description?: string,

    channels: string[],
    categories?: Category[],
    system_messages?: SystemMessageChannels,

    roles?: { [key: string]: Role },
    default_permissions: PermissionTuple,

    icon?: Attachment,
    banner?: Attachment
}

import type { Attachment } from './Autumn';
import type { Id, OverrideField } from './_common';

export type MemberCompositeKey = {
    server: Id

    user: Id
}

export type Member = {
    _id: MemberCompositeKey
    
    nickname?: string

    avatar?: Attachment

    roles?: Id[]
}

export type Ban = {
    _id: MemberCompositeKey
    reason?: string
}

/**
 * Valid HTML colour
 * 
 * Warning: This is untrusted input, do not simply insert this anywhere.
 * 
 * **Example usage:**
 * ```js
 * document.body.style.color = role.colour;
 * ```
 * 
 * @minLength 1
 * @maxLength 32
 */
export type Colour = string;

export type Role = {
    /**
     * Role name
     * @minLength 1
     * @maxLength 32
     **/
    name: string

    permissions: OverrideField

    colour?: Colour

    /**
     * Whether to display this role separately on the members list
     */
    hoist?: boolean

    /**
     * Role ranking
     * 
     * A role with a smaller number will have permissions over roles with larger numbers.
     */
    rank?: number
}

export type RoleInformation = Pick<Role, 'name' | 'colour' | 'hoist' | 'rank'>

export type Category = {
    id: Id

    title: string

    channels: string[]
}

export type SystemMessageChannels = {
    /** Channel ID where user join events should be sent */
    user_joined?: Id
    /** Channel ID where user leave events should be sent */
    user_left?: Id
    /** Channel ID where user kick events should be sent */
    user_kicked?: Id
    /** Channel ID where user ban events should be sent */
    user_banned?: Id
}

export type Server = {
    /**
     * Server ID
     */
    _id: Id

    /**
     * User ID of server owner
     */
    owner: Id

    /**
     * Server name
     */
    name: string

    /**
     * Server description
     */
    description?: string

    /**
     * Array of server channel IDs
     */
    channels: Id[]

    /**
     * Array of server categories
     */
    categories?: Category[]

    /**
     * System message channels
     * 
     * Each type of system message will be sent into the respective channel ID.
     */
    system_messages?: SystemMessageChannels

    /**
     * Server roles
     */
    roles?: { [key: string]: Role }

    /**
     * Default permissions for all members
     */
    default_permissions: number

    /**
     * Server icon
     */
    icon?: Attachment

    /**
     * Server banner
     */
    banner?: Attachment

    /**
     * Whether this server is marked as not safe for work
     */
    nsfw?: boolean

    /**
     * Server flags
     * 
     * `1`: Official Revolt server
     * `2`: Verified community server
     */
    flags?: number

    /**
     * Whether to collect analytics on this server
     * Enabled if server is discoverable
     */
    analytics?: boolean

    /**
     * Whether this server is discoverable
     */
    discoverable?: boolean
}

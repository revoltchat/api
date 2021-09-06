import { body, noContent, parameter, ref, success } from "../openapi/generators.js";
import { group, resource, route, routeAuthenticated, tag } from "../openapi/paths.js";
import { schema } from "../typescript.js";

group("Servers");

//#region Server Information
tag("Server Information", "Query and fetch servers on Revolt");

const serverParams = {
    parameters: [
        await parameter('server', 'Server ID', ref("Id"))
    ]
}

resource('/servers/:server', {
    get: routeAuthenticated(
        "Fetch Server",
        "Retrieve a server.",
        {
            ...serverParams,
            ...await success(
                "Retrieved server.",
                ref("Server")
            )
        }
    ),
    patch: routeAuthenticated(
        "Edit Server",
        "Edit a server object.",
        {
            ...serverParams,
            ...await body("Requested changes to server object.", schema`
                import type { Category, SystemMessageChannels } from './Servers';
                import type { AutumnId } from './_common';

                interface ${'EditServer'} {
                    /**
                     * Server name
                     * @minLength 1
                     * @maxLength 32
                     **/
                    name?: string;

                    /**
                     * Server description
                     * @minLength 0
                     * @maxLength 1024
                     **/
                    description?: string;

                    icon?: AutumnId;

                    banner?: AutumnId;

                    /**
                     * Server categories
                     */
                    categories?: Category[];

                    /**
                     * System message channels
                     */
                    system_messages?: SystemMessageChannels;

                    /**
                     * Whether this server is not safe for work
                     */
                    nsfw?: boolean;

                    /**
                     * Field to remove from channel object
                     */
                    remove?: 'Icon' | 'Banner' | 'Description';
                }
            `),
            ...await noContent("Succesfully changed channel object.")
        }
    ),
    delete: routeAuthenticated(
        "Delete / Leave Server",
        "Deletes a server if owner otherwise leaves.",
        {
            ...serverParams,
            ...await noContent("Deleted Server")
        }
    )
});

resource('/servers/create', {
    post: routeAuthenticated(
        "Create Server",
        "Create a new server.",
        {
            ...await body("Server Data", schema`
                import { Id, Nonce } from './_common';

                interface ${'ServerData'} {
                    /**
                     * Server name
                     * @minLength 1
                     * @maxLength 32
                     */
                    name: string;

                    /**
                     * Server description
                     * @minLength 0
                     * @maxLength 1024
                     */
                    description?: string;

                    /**
                     * Whether this server is not safe for work
                     */
                    nsfw?: boolean;

                    nonce: Nonce;
                }
            `),
            ...await success('Server', ref("Server"))
        }
    )
});

resource('/servers/:server/channels', {
    post: routeAuthenticated(
        "Create Channel",
        "Create a new Text or Voice channel.",
        {
            ...serverParams,
            ...await body("Channel Data", schema`
                import { Id, Nonce } from './_common';

                interface ${'ChannelData'} {
                    /**
                     * Channel type
                     */
                    type: 'Text' | 'Voice';

                    /**
                     * Channel name
                     * @minLength 1
                     * @maxLength 32
                     */
                    name: string;

                    /**
                     * Channel description
                     * @minLength 0
                     * @maxLength 1024
                     */
                    description?: string;

                    /**
                     * Whether this channel is not safe for work
                     */
                    nsfw?: boolean;

                    nonce: Nonce;
                }
            `),
            ...success("Channel", ref("Channel"))
        }
    )
});

resource('/servers/:server/invites', {
    get: routeAuthenticated(
        "Fetch Invites",
        "Fetch all server invites.",
        {
            ...serverParams,
            ...success("Server Invites", schema`
                import { Id } from './_common';

                type ${'ServerInvites'} = {
                    /**
                     * Invite Code
                     */
                    code: string;

                    /**
                     * ID of the user who created this invite.
                     */
                    creator: Id;

                    /**
                     * ID of the channel this invite is for.
                     */
                    channel: Id;
                }
            `)
        }
    )
});

resource('/servers/:server/ack', {
    put: routeAuthenticated(
        "Mark Server As Read",
        "Mark all channels in a server as read.",
        {
            ...serverParams,
            ...await noContent("Marked as read.")
        }
    ),
});
//#endregion

//#region Server Members
tag("Server Members", "Find and edit server members");

const memberParams = {
    parameters: [
        await parameter('server', 'Server ID', ref("Id")),
        await parameter('member', 'Member ID', ref("Id"))
    ]
}

resource('/servers/:server/members/:member', {
    get: routeAuthenticated(
        "Fetch Member",
        "Retrieve a member.",
        {
            ...memberParams,
            ...await success(
                "Retrieved member.",
                ref("Member")
            )
        }
    ),
    patch: routeAuthenticated(
        "Edit Member",
        "Edit a member object.",
        {
            ...serverParams,
            ...await body("Requested changes to member object.", schema`
                import type { AutumnId, Id } from './_common';

                interface ${'EditMember'} {
                    /**
                     * Member nickname
                     * @minLength 1
                     * @maxLength 32
                     **/
                    nickname?: string;

                    avatar?: AutumnId;

                    /**
                     * Array of role IDs
                     */
                    roles?: Id[];

                    /**
                     * Field to remove from channel object
                     */
                    remove?: 'Nickname' | 'Avatar';
                }
            `),
            ...await noContent("Succesfully changed member object.")
        }
    ),
    delete: routeAuthenticated(
        "Kick Member",
        "Removes a member from the server.",
        await noContent("Removed Member")
    )
});

resource('/servers/:server/members', {
    get: route(
        "Fetch Members",
        "Fetch all server members.",
        {
            ...serverParams,
            ...await success(
                "Server Members",
                schema`
                    import { Member } from './Servers';
                    import { User } from './Users';

                    interface ${'ServerMembers'} {
                        members: Member[],
                        users: User[]
                    }
                `
            )
        }
    )
});

resource('/servers/:server/bans/:member', {
    put: routeAuthenticated(
        "Ban User",
        "Ban a user by their ID.",
        {
            ...memberParams,
            ...await body("Ban Data", schema`
                interface ${'BanData'} {
                    /**
                     * Ban reason
                     * @minLength 1
                     * @maxLength 1024
                     */
                    reason?: string
                }
            `),
            ...await noContent("Banned user.")
        }
    ),
    delete: routeAuthenticated(
        "Unban User",
        "Removes a user's ban.",
        {
            ...memberParams,
            ...await noContent("Unbanned user.")
        }
    )
});

resource('/servers/:server/bans', {
    get: routeAuthenticated(
        "Fetch Bans",
        "Fetch all bans on server.",
        {
            ...serverParams,
            ...await success("Bans", schema`
                import type { Id } from './_common';
                import type { Ban } from './Servers';
                import type { Username } from './Users';
                import type { Attachment } from './Autumn';

                type ${'ServerBans'} = {
                    /**
                     * Just enough user information to list bans.
                     */
                    users: {
                        _id: Id
                        username: Username
                        avatar?: Attachment
                    }[]

                    /**
                     * Ban List
                     */
                    bans: Ban[]
                };
            `)
        }
    )
});
//#endregion

//#region Server Permissions
tag("Server Permissions", "Manage permissions for servers");

const roleParams = {
    parameters: [
        await parameter('server', 'Server ID', ref("Id")),
        await parameter('role', 'Role ID', ref("Id"))
    ]
}

const serverPermissions = await body("Server Permissions", schema`
    interface ${'ServerPermissions'} {
        /**
         * Permission values
         */
        permissions: {
            /**
             * Server permission
             */
            server: number,

            /**
             * Channel permission
             */
            channel: number
        }
    }
`)

resource('/servers/:server/permissions/:role', {
    put: routeAuthenticated(
        "Set Role Permission",
        "Sets permissions for the specified role in this server.",
        {
            ...roleParams,
            ...serverPermissions,
            ...await noContent("Successfully updated permissions.")
        }
    )
});

resource('/servers/:server/permissions/default', {
    put: routeAuthenticated(
        "Set Default Permission",
        "Sets permissions for the default role in this server.",
        {
            ...serverParams,
            ...serverPermissions,
            ...await noContent("Successfully updated permissions.")
        }
    )
});

resource('/servers/:server/roles', {
    post: routeAuthenticated(
        "Create Role",
        "Creates a new server role.",
        {
            ...serverParams,
            ...await body("Role Data", schema`
                interface ${'RoleData'} {
                    /**
                     * Role name
                     * @minLength 1
                     * @maxLength 32
                     */
                    name: string;
                }
            `),
            ...await success("New Role", schema`
                import { Id } from './_common';
                import { PermissionTuple } from './Servers';

                interface ${'NewRole'} {
                    /**
                     * Role ID
                     */
                    id: Id;

                    permissions: PermissionTuple;
                }
            `)
        }
    )
});

resource('/servers/:server/roles/:role', {
    patch: routeAuthenticated(
        "Edit Role",
        "Edit a role object.",
        {
            ...roleParams,
            ...await body("Requested changes to role object.", schema`
                import type { RoleInformation, Colour } from './Servers';

                type ${'EditRole'} = RoleInformation & {
                    /**
                     * Field to remove from role object
                     */
                    remove?: 'Colour';
                }
            `),
            ...await noContent("Succesfully changed role object.")
        }
    ),
    delete: routeAuthenticated(
        "Delete Role",
        "Deletes a server role by ID.",
        {
            ...roleParams,
            ...await noContent("Successfully deleted role.")
        }
    )
});
//#endregion

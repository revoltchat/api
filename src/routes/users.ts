import { body, parameter, ref, success } from "../openapi/generators.js";
import { group, resource, routeAuthenticated, tag } from "../openapi/paths.js";
import { schema } from "../typescript.js";

group("Users");

//#region User Information
tag("User Information", "Query and fetch users on Revolt");

resource('/users/:user', {
    get: routeAuthenticated(
        "Fetch User",
        "Retrieve a user's information.",
        {
            parameters: [
                await parameter('user', 'User ID', ref("Id"))
            ],
            ...await success(
                "User information.",
                ref("User")
            )
        }
    )
});

resource('/users/@me', {
    patch: routeAuthenticated(
        "Edit User",
        "Edit your user object.",
        {
            ...await body("Requested changes to user object.", schema`
                import type { Status } from './Users';
                import type { AutumnId } from './_common';

                interface ${'EditUser'} {
                    status: Status;

                    /**
                     * User profile data
                     **/
                    profile: {
                        /**
                         * Text to set as user profile description
                         * @maxLength 2000
                         */
                        content: string;

                        background: AutumnId;
                    }

                    avatar: AutumnId;

                    /**
                     * Field to remove from user object
                     */
                    remove: 'ProfileContent' | 'ProfileBackground' | 'StatusText' | 'Avatar';
                }
            `),
            ...await success("Succesfully changed user object.")
        }
    )
});

resource('/users/@me/username', {
    patch: routeAuthenticated(
        "Change Username",
        "Change your username.",
        {
            ...await body("Requested change to username.", schema`
                interface ${'ChangeUsername'} {
                    /**
                     * New username
                     * @minLength 2
                     * @maxLength 32
                     * @pattern ^[a-zA-Z0-9_.]+$
                     */
                    username: string;

                    /**
                     * Current account password
                     * @minLength 8
                     * @maxLength 1024
                     */
                    password: string;
                }
            `),
            ...await success("Succesfully changed user object.")
        }
    )
});

resource('/users/:user/profile', {
    get: routeAuthenticated(
        "Fetch User Profile",
        "Retrieve a user's profile data.",
        {
            parameters: [
                await parameter('user', 'User ID', ref("Id"))
            ],
            ...await success(
                "User profile.",
                ref("Profile")
            )
        }
    )
});

resource('/users/:user/default_avatar', {
    get: routeAuthenticated(
        "Fetch Default Avatar",
        "This returns a default avatar based on the given id.",
        {
            parameters: [
                await parameter('user', 'User ID', ref("Id"))
            ],
            responses: {
                '200': {
                    description: "Default avatar in PNG format",
                    content: {
                        "image/png": {
                            schema: {
                                type: 'string',
                                format: 'binary'
                            }
                        }
                    }
                }
            }
        }
    )
});

resource('/users/:user/mutual', {
    get: routeAuthenticated(
        "Fetch Mutual Friends",
        "Retrieve a list of mutual friends with another user.",
        {
            parameters: [
                await parameter('user', 'User ID', ref("Id"))
            ],
            ...await success(
                "Mutual friends.",
                schema`
                    interface ${'MutualFriends'} {
                        /**
                         * Array of user IDs who both you and the other user are friends with.
                         */
                        users: string[]
                    }
                `
            )
        }
    )
});
//#endregion

//#region Direct Messaging
tag("Direct Messaging", "Direct message other users on Revolt");

resource('/users/dms', {
    get: routeAuthenticated(
        "Fetch Direct Message Channels",
        "This fetches your direct messages, including any DM and group DM conversations.",
        await success(
            "Your DM conversations.",
            schema`
                import type { DirectMessageChannel, GroupChannel } from "./Channels";
                /**
                 * Channel objects.
                 */
                type ${'FetchDMs'} = (DirectMessageChannel | GroupChannel)[];
            `
        )
    )
});

resource('/users/:user/dm', {
    get: routeAuthenticated(
        "Open Direct Message",
        "Open a DM with another user.",
        {
            parameters: [
                await parameter('user', 'User ID', ref('Id'))
            ],
            ...await success(
                "DM channel with user.",
                ref("DirectMessageChannel")
            )
        }
    )
});
//#endregion

//#region Relationships
tag("Relationships", "Manage your friendships and block list on the platform");

resource('/users/relationships', {
    get: routeAuthenticated(
        "Fetch Relationships",
        "Fetch all of your relationships with other users.",
        await success(
            "Array of relationships.",
            schema`
                import type { Relationship } from "./Users";
                type ${'FetchRelationships'} = Relationship[];
            `
        )
    )
});

resource('/users/:user/relationship', {
    get: routeAuthenticated(
        "Fetch Relationship",
        "Fetch your relationship with another other user.",
        {
            parameters: [
                await parameter('user', 'User ID', ref('Id'))
            ],
            ...await success(
                "Your relationship with the user.",
                ref("RelationshipOnly")
            )
        }
    )
});

resource('/users/:user/friend', {
    put: routeAuthenticated(
        "Send Friend Request / Accept Request",
        "Send a friend request to another user or accept another user's friend request.",
        {
            parameters: [
                await parameter('user', 'User ID', ref('Id'))
            ],
            ...await success(
                "Sent friend request / added user as friend.",
                ref("RelationshipOnly")
            )
        }
    ),
    delete: routeAuthenticated(
        "Deny Friend Request / Remove Friend",
        "Denies another user's friend request or removes an existing friend.",
        {
            parameters: [
                await parameter('user', 'User ID', ref('Id'))
            ],
            ...await success(
                "Deleted friend request / removed user from friends.",
                ref("RelationshipOnly")
            )
        }
    )
});

resource('/users/:user/block', {
    put: routeAuthenticated(
        "Block User",
        "Block another user.",
        {
            parameters: [
                await parameter('user', 'User ID', ref('Id'))
            ],
            ...await success(
                "Blocked user.",
                ref("RelationshipOnly")
            )
        }
    ),
    delete: routeAuthenticated(
        "Unblock User",
        "Unblock another user.",
        {
            parameters: [
                await parameter('user', 'User ID', ref('Id'))
            ],
            ...await success(
                "Unblocked user.",
                ref("RelationshipOnly")
            )
        }
    )
});
//#endregion

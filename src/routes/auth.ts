import { body, noContent, parameter, ref, success } from "../openapi/generators.js";
import { group, resource, route, routeAuthenticated, tag } from "../openapi/paths.js";
import { schema } from "../typescript.js";

group("Auth");

//#region Account
tag("Account", "Manage your account.");

resource('/account', {
    get: routeAuthenticated(
        "Fetch Account",
        "Fetch account information.",
        await success("Account Information", ref("Account")),
        true
    )
});

resource('/account/create', {
    post: route(
        "Create Account",
        "Create a new account.",
        {
            ...await body("Create Data", schema`
                interface ${'CreateData'} {
                    /**
                     * Valid email address
                     */
                    email: string;

                    /**
                     * Password
                     * @minLength 8
                     * @maxLength 1024
                     */
                    password: string;

                    /**
                     * Invite Code
                     */
                    invite?: string;

                    /**
                     * Captcha verification code
                     */
                    captcha?: string;
                }
            `),
            ...await noContent("Created account.")
        }
    )
});

resource('/account/reverify', {
    post: route(
        "Resend Verification",
        "Resend account creation verification email.",
        {
            ...await body("Resend Data", schema`
                interface ${'ResendData'} {
                    /**
                     * Email
                     */
                    email: string;

                    /**
                     * Captcha verification token
                     */
                    captcha?: string;
                }
            `),
            ...await noContent("Resent verification.")
        }
    )
});

resource('/account/verify/:code', {
    post: route(
        "Verify Email",
        "Verifies an email with code.",
        {
            parameters: [
                await parameter("code", "Verification Code", ref("Id"))
            ],
            ...await noContent("Verified email.")
        }
    )
});

resource('/account/reset_password', {
    post: route(
        "Send Password Reset",
        "Send password reset email.",
        {
            ...await body("Reset Data", schema`
                interface ${'ResetData'} {
                    /**
                     * Email
                     */
                    email: string;

                    /**
                     * Captcha verification token
                     */
                    captcha?: string;
                }
            `),
            ...await noContent("Sent password reset.")
        }
    ),
    patch: route(
        "Password Reset",
        "Confirm password reset.",
        {
            ...await body("Reset Data", schema`
                interface ${'ResetData'} {
                    /**
                     * Password
                     * @minLength 8
                     * @maxLength 1024
                     */
                    password: string;

                    /**
                     * Password reset token
                     */
                    token: string;
                }
            `),
            ...await noContent("Password was changed.")
        }
    )
});

resource('/account/change/password', {
    post: routeAuthenticated(
        "Change Password",
        "Change account password.",
        {
            ...await body("Change Data", schema`
                interface ${'ChangeData'} {
                    /**
                     * Password
                     * @minLength 8
                     * @maxLength 1024
                     */
                    password: string;

                    /**
                     * Current Password
                     * @minLength 8
                     * @maxLength 1024
                     */
                    current_password: string;
                }
            `),
            ...await noContent("Password changed.")
        },
        true
    )
});

resource('/account/change/email', {
    post: routeAuthenticated(
        "Change Email",
        "Change account email.",
        {
            ...await body("Change Data", schema`
                interface ${'ChangeData'} {
                    /**
                     * Current Password
                     * @minLength 8
                     * @maxLength 1024
                     */
                    current_password: string;

                    /**
                     * Valid email
                     */
                    email: string;
                }
            `),
            ...await noContent("Email changed.")
        },
        true
    )
});
//#endregion

//#region Session
tag("Session", "Create and manage sessions.");

resource('/session/login', {
    post: route(
        "Login",
        "Login to an account.",
        {
            ...await body("Login Data", schema`
                interface ${'LoginData'} {
                    /**
                     * Valid email address
                     */
                    email: string;

                    /**
                     * Password
                     * @minLength 8
                     * @maxLength 1024
                     */
                    password?: string;

                    /**
                     * Security Key Challenge
                     */
                    challenge?: string;

                    /**
                     * Session Friendly Name
                     * @minLength 0
                     * @maxLength 72
                     */
                    friendly_name?: string;

                    /**
                     * Captcha verification code
                     */
                    captcha?: string;
                }
            `),
            ...await success("Logged in.", ref("Session"))
        }
    )
});

resource('/session/logout', {
    post: routeAuthenticated(
        "Logout",
        "Close current session.",
        {
            parameters: [
                await parameter("session", "Session ID", ref("Id"))
            ],
            ...await noContent("Logged out.")
        },
        true
    )
});

resource('/session/:session', {
    patch: routeAuthenticated(
        "Edit Session",
        "Edit session information.",
        {
            parameters: [
                await parameter("session", "Session ID", ref("Id"))
            ],
            ...await body("Edit Data", schema`
                interface ${'SessionEditData'} {
                    /**
                     * Session Friendly Name
                     * @minLength 0
                     * @maxLength 72
                     */
                    friendly_name: string;
                }
            `),
            ...await noContent("Edited session.")
        },
        true
    ),
    delete: routeAuthenticated(
        "Delete Session",
        "Delete a specific session.",
        {
            parameters: [
                await parameter("session", "Session ID", ref("Id"))
            ],
            ...await noContent("Deleted session.")
        },
        true
    )
});

resource('/session/all', {
    get: routeAuthenticated(
        "Fetch Sessions",
        "Fetch all sessions.",
        await success("Sessions", schema`
            import type { Id } from './_common';
            import type { SessionInfo } from './Auth';

            type ${'Sessions'} = SessionInfo[];
        `),
        true
    ),
    delete: routeAuthenticated(
        "Delete All Sessions",
        "Delete all active sesssions.",
        {
            parameters: [
                {
                    name: 'revoke_self',
                    in: 'query',
                    description: "Whether to revoke current session too.",
                    schema: {
                        type: 'boolean'
                    }
                }
            ],
            ...await noContent("Deleted session.")
        },
        true
    )
});
//#endregion
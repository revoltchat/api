import { body, parameter, ref, success } from "../openapi/generators.js";
import { group, resource, route, routeAuthenticated, tag } from "../openapi/paths.js";
import { schema } from "../typescript.js";

group("Auth");

//#region Auth
tag("Auth", "Authenticate with Revolt");

resource('/auth/create', {
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
            ...await success("Created account.", schema`
                import { Id } from './_common';

                interface ${'CreateResponse'} {
                    /**
                     * User ID
                     */
                    user_id: Id;
                }
            `)
        }
    )
});

resource('/auth/resend', {
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
            ...await success("Resent verification.")
        }
    )
});

resource('/auth/login', {
    post: route(
        "Login",
        "Create a new session.",
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
                    password: string;

                    /**
                     * Device Name
                     * @minLength 0
                     * @maxLength 72
                     */
                    device_name?: string;

                    /**
                     * Captcha verification code
                     */
                    captcha?: string;
                }
            `),
            ...await success("Logged in.", schema`
                import { Id } from './_common';

                interface ${'LoginResponse'} {
                    /**
                     * Session ID
                     */
                    id: Id;

                    /**
                     * User ID
                     */
                    user_id: Id;

                    /**
                     * Session Token
                     */
                    session_token: string;
                }
            `)
        }
    )
});

resource('/auth/send_reset', {
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
            ...await success("Sent password reset.")
        }
    )
});

resource('/auth/reset', {
    post: route(
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
            ...await success("Password was reset.")
        }
    )
});

resource('/auth/user', {
    get: routeAuthenticated(
        "Fetch Account",
        "Fetch account information.",
        await success("Account Information", ref("Account"))
    )
});

resource('/auth/check', {
    get: routeAuthenticated(
        "Check Auth",
        "Check if we are authenticated.",
        await success("User is authenticated.")
    )
});

resource('/auth/change/password', {
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
                     * Password
                     * @minLength 8
                     * @maxLength 1024
                     */
                    new_password: string;
                }
            `),
            ...await success("Password changed.")
        }
    )
});

resource('/auth/change/email', {
    post: routeAuthenticated(
        "Change Email",
        "Change account email.",
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
                     * Valid email
                     */
                    new_email: string;
                }
            `),
            ...await success("Email changed.")
        }
    )
});

resource('/auth/sessions/:session', {
    delete: routeAuthenticated(
        "Delete Session",
        "Delete existing session.",
        {
            parameters: [
                await parameter("session", "Session ID", ref("Id"))
            ],
            ...await success("Deleted session.")
        }
    )
});

resource('/auth/sessions', {
    get: routeAuthenticated(
        "Fetch Sessions",
        "Fetch all sessions.",
        await success("Sessions", schema`
            import { Id } from './_common';

            type ${'Sessions'} = {
                /**
                 * Session ID
                 */
                id: Id

                /**
                 * Session device name
                 */
                friendly_name: string
            }[];
        `)
    )
});

resource('/auth/logout', {
    get: routeAuthenticated(
        "Logout",
        "Delete current session.",
        await success("Logged out.")
    )
});
//#endregion
import type { Id } from "./_common";

export interface Account {
    /**
     * User ID
     */
    _id: Id;

    /**
     * User Email
     */
    email: string;
}

export interface Session {
    /**
     * Session ID
     */
    _id?: Id;

    /**
     * User ID
     */
    user_id: Id;

    /**
     * @maxLength 64
     */
    token: string;

    /**
     * Device name
     */
    name: string;

    /**
     * Web Push subscription
     */
    subscription?: string;
}

export interface SessionInfo {
    /**
     * Session ID
     */
    _id: Id;

    /**
     * Device name
     */
    name: string;
}

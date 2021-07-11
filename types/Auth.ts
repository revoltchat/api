import type { Id } from "./_common";

export interface Account {
    /**
     * User ID
     */
    id: Id;

    /**
     * User Email
     */
    email: string;
}

export interface Session {
    /**
     * Session ID
     */
    id?: Id;

    /**
     * User ID
     */
    user_id: Id;

    /**
     * @maxLength 64
     */
    session_token: string;
}

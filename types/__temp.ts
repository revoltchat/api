
                import type { Status } from './Users';
                import type { AutumnId } from './_common';

                interface EditUser {
                    status?: Status;

                    /**
                     * User profile data
                     **/
                    profile?: {
                        /**
                         * Text to set as user profile description
                         * @maxLength 2000
                         */
                        content?: string;

                        background?: AutumnId;
                    }

                    avatar?: AutumnId;

                    /**
                     * Field to remove from user object
                     */
                    remove?: 'ProfileContent' | 'ProfileBackground' | 'StatusText' | 'Avatar';
                }
            
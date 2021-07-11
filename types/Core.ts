export interface RevoltConfiguration {
    /**
     * Revolt API version string
     */
    revolt: string

    /**
     * Available features exposed by the API
     */
    features: {
        /**
         * Whether users can register
         */
        registration: boolean

        /**
         * hCaptcha options
         */
        captcha: {
            /**
             * Whether hCaptcha is enabled
             */
            enabled: boolean

            /**
             * hCaptcha site key
             */
            key: string
        }

        /**
         * Whether email verification is enabled
         */
        email: boolean

        /**
         * Whether an invite code is required to register
         */
        invite_only: string

        /**
         * Autumn (file server) options
         */
        autumn: {
            /**
             * Whether file uploads are enabled
             */
            enabled: boolean

            /**
             * Autumn API URL
             */
            url: string
        }
        
        /**
         * January (proxy server) options
         */
        january: {
            /**
             * Whether link embeds are enabled
             */
            enabled: boolean,

            /**
             * January API URL
             */
            url: string
        }

        /**
         * Legacy voice server options
         */
        voso: {
            /**
             * Whether voice is available (using voso)
             */
            enabled: boolean

            /**
             * Voso API URL
             */
            url: string

            /**
             * Voso WebSocket URL
             */
            ws: string
        }
    }

    /**
     * WebSocket URL
     */
    ws: string

    /**
     * URL to web app associated with this instance
     */
    app: string

    /**
     * Web Push VAPID key
     */
    vapid: string
}

export interface OnboardingInformation {
    onboarding: boolean
}

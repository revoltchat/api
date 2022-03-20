export * from './types';

import type { Session } from './types';
import type { APIRoutes } from './routes';
import Axios, { AxiosRequestConfig } from 'axios';

import { pathResolve, queryParams } from './params';

/**
 * Get the specific path name of any given path.
 * @param anyPath Any path
 * @returns Specific path
 */
export function getPathName(anyPath: string) {
    const segments = anyPath.split('/');

    const list = (pathResolve as unknown as Record<string, (string | [string])[]>)[(segments.length - 1).toString()] ?? [];
    for (const entry of list) {
        let i = 1;
        let copy = [...segments];
        for (i;i<segments.length;i++) {
            if (Array.isArray(entry[i - 1])) {
                copy[i] = entry[i - 1];
                continue;
            }
            else if (entry[i - 1] !== segments[i]) break;
        }

        if (i === segments.length) return copy.join('/');
    }
}

type Methods = APIRoutes['method'];
type PickRoutes<Method extends Methods> = APIRoutes & { method: Method };

type GetRoutes = PickRoutes<'get'>;
type PatchRoutes = PickRoutes<'patch'>;
type PutRoutes = PickRoutes<'put'>;
type DeleteRoutes = PickRoutes<'delete'>;
type PostRoutes = PickRoutes<'post'>;

/**
 * Client configuration options
 */
export interface Options {
    /**
     * Base URL of the Revolt node
     */
    baseURL: string;
    /**
     * Authentication used for requests
     */
    authentication: Session | string | undefined;
}

/**
 * Revolt API Client
 */
export class RevoltAPI {
    private baseURL: string;
    private authentication: Session | string | undefined;

    constructor({ baseURL, authentication }: Partial<Options> = { }) {
        this.baseURL = baseURL ?? 'https://api.revolt.chat';
        this.authentication = authentication;
    }

    /**
     * Generate config to pass through to API.
     */
    get config(): AxiosRequestConfig {
        return {
            baseURL: this.baseURL,
            headers: typeof this.authentication === 'string'
                ? { 'X-Bot-Token': this.authentication }
                : typeof this.authentication === 'object'
                ? { 'X-Session-Token': this.authentication.token }
                : undefined
        };
    }

    /**
     * Send any arbitrary request.
     * @param method HTTP Method
     * @param path Path
     * @param params Body or Query Parameters
     * @param config Axios configuration
     * @returns Typed Response Data
     */
    req<Method extends Methods, Routes extends PickRoutes<Method>, Path extends Routes['path'], Route extends Routes & { path: Path }>(method: Method, path: Path, params: Route['params'], config?: AxiosRequestConfig): Promise<Route['response']> {
        let query, body;
        let named = getPathName(path);

        // If we are aware of this route, then match the parameters given.
        if (named && typeof params === 'object') {
            const route = queryParams[named as keyof typeof queryParams];
            const allowed_query = (route as unknown as Record<Method, string[]>)[method];

            // Map each parameter to the correct object.
            for (const parameter of Object.keys(params)) {
                if (allowed_query.includes(parameter)) {
                    query = {
                        ...(query ?? {}),
                        [parameter]: (params as Record<any, any>)[parameter]
                    };
                } else {
                    body = {
                        ...(body ?? {}),
                        [parameter]: (params as Record<any, any>)[parameter]
                    };
                }
            }
        }

        return Axios(path, {
            ...this.config,
            ...config,
            method,
            params: query,
            data: body
        })
        .then(res => res.data);
    }

    /**
     * Send HTTP GET request.
     * @param path Path
     * @param params Body or Query Parameters
     * @param config Axios configuration
     * @returns Typed Response Data
     */
    get<Path extends GetRoutes['path'], Route extends GetRoutes & { path: Path }>(path: Path, params: Route['params'], config?: AxiosRequestConfig): Promise<Route['response']>;

    /**
     * Send HTTP GET request.
     * @param path Path
     * @returns Typed Response Data
     */
    get<Path extends (GetRoutes & { params: undefined })['path'], Route extends GetRoutes & { path: Path }>(path: Path): Promise<Route['response']>;

    get(path: any, params?: any, config?: AxiosRequestConfig): Promise<any> {
        return this.req('get', path, params, config);
    }

    /**
     * Send HTTP GET request.
     * @param path Path
     * @param params Body or Query Parameters
     * @param config Axios configuration
     * @returns Typed Response Data
     */
    patch<Path extends PatchRoutes['path'], Route extends PatchRoutes & { path: Path }>(path: Path, params: Route['params'], config?: AxiosRequestConfig): Promise<Route['response']>;

    /**
     * Send HTTP PATCH request.
     * @param path Path
     * @returns Typed Response Data
     */
    patch<Path extends (PatchRoutes & { params: undefined })['path'], Route extends PatchRoutes & { path: Path }>(path: Path): Promise<Route['response']>;

    patch(path: any, params?: any, config?: AxiosRequestConfig): Promise<any> {
        return this.req('patch', path, params, config);
    }

    /**
     * Send HTTP PUT request.
     * @param path Path
     * @param params Body or Query Parameters
     * @param config Axios configuration
     * @returns Typed Response Data
     */
    put<Path extends PutRoutes['path'], Route extends PutRoutes & { path: Path }>(path: Path, params: Route['params'], config?: AxiosRequestConfig): Promise<Route['response']>;
    
    /**
     * Send HTTP PUT request.
     * @param path Path
     * @returns Typed Response Data
     */
    put<Path extends (PutRoutes & { params: undefined })['path'], Route extends PutRoutes & { path: Path }>(path: Path): Promise<Route['response']>;

    put(path: any, params?: any, config?: AxiosRequestConfig): Promise<any> {
        return this.req('put', path, params, config);
    }

    /**
     * Send HTTP DELETE request.
     * @param path Path
     * @param params Body or Query Parameters
     * @param config Axios configuration
     * @returns Typed Response Data
     */
    delete<Path extends DeleteRoutes['path'], Route extends DeleteRoutes & { path: Path }>(path: Path, config?: AxiosRequestConfig): Promise<Route['response']>;
    
    /**
     * Send HTTP DELETE request.
     * @param path Path
     * @returns Typed Response Data
     */
    delete<Path extends (DeleteRoutes & { params: undefined })['path'], Route extends DeleteRoutes & { path: Path }>(path: Path): Promise<Route['response']>;

    delete(path: any, config?: AxiosRequestConfig): Promise<any> {
        return this.req('delete', path, undefined, config);
    }

    /**
     * Send HTTP POST request.
     * @param path Path
     * @param params Body or Query Parameters
     * @param config Axios configuration
     * @returns Typed Response Data
     */
    post<Path extends PostRoutes['path'], Route extends PostRoutes & { path: Path }>(path: Path, params: Route['params'], config?: AxiosRequestConfig): Promise<Route['response']>;
    
    /**
     * Send HTTP POST request.
     * @param path Path
     * @returns Typed Response Data
     */
    post<Path extends (PostRoutes & { params: undefined })['path'], Route extends PostRoutes & { path: Path }>(path: Path): Promise<Route['response']>;

    post(path: any, params?: any, config?: AxiosRequestConfig): Promise<any> {
        return this.req('post', path, params, config);
    }
}

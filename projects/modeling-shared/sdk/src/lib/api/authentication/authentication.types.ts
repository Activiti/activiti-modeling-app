/*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export type AuthenticationProperties = BasicAuthenticationProperties | BearerAuthenticationProperties | ClientCredentialsAuthenticationProperties;

export interface BasicAuthenticationProperties {
    authenticationType: 'basic';
    username: string;
    password: string;
}

export interface BearerAuthenticationProperties {
    authenticationType: 'bearer';
    token: string;
}

export interface ClientCredentialsAuthenticationProperties {
    authenticationType: 'client_credentials';
    clientId: string;
    clientSecret: string;
    endpoint: string;
    scope: string;
}

export enum AuthenticationTypes {
    BASIC = 'basic',
    BEARER = 'bearer',
    CLIENT_CREDENTIALS = 'client_credentials'
}

export type AuthenticationType = 'basic' | 'bearer' | 'client_credentials';

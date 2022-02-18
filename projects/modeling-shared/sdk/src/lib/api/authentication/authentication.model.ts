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

import { AuthenticationProperties, AuthenticationType, AuthenticationTypes } from './authentication.types';

export class AuthenticationContent {
    id: string;
    name: string;
    authProperties: AuthenticationProperties;
    description?: string;

    constructor(authenticationContent: string) {
        const authenticationContentJson = JSON.parse(authenticationContent);

        this.id = authenticationContentJson?.id || '';
        this.name = authenticationContentJson?.name || '';
        this.description = authenticationContentJson?.description || '';
        this.authProperties = authenticationContentJson?.authProperties;
    }

    hasAuthProperties(): boolean {
        return !!this?.authProperties;
    }

    getAuthProperties(): AuthenticationProperties {
        return this.authProperties;
    }

    getAuthProperty(property: string): any {
        return this.authProperties[property];
    }

    hasAuthProperty(property: string): boolean {
        return !!this.authProperties[property];
    }

    getAuthType(): AuthenticationType {
        return this.authProperties?.authenticationType;
    }

    getAuthName(): string {
        return this.name || '';
     }

    getAuthDescription(): string {
        return this.description || '';
    }

    isBasicAuth(): boolean {
        return this.getAuthType() === AuthenticationTypes.BASIC;
    }

    isBearerAuth(): boolean {
        return this.getAuthType() === AuthenticationTypes.BEARER;
    }

    isClientCredentialsAuth(): boolean {
        return this.getAuthType() === AuthenticationTypes.CLIENT_CREDENTIALS;
    }
}

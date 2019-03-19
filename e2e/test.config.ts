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

import { TestConfig } from './test.config.interface';
import * as appConfigJson from '../src/app.config.json';
const apsConfigJson = <any>appConfigJson;

// ==================
require('dotenv').config();
const env = process.env;

function getConfig(rootPath: string, apsConfig): TestConfig {
    return {
        main: {
            default_timeout: parseInt(env.DEFAULT_TIMEOUT, 10) || 20000,
            presence_timeout: parseInt(env.PRESENCE_TIMEOUT, 10) || 60000,
            rootPath: rootPath
        },
        ama: {
            url: env.E2E_HOST || 'http://localhost',
            port: env.E2E_PORT || '4100',
            backendConfig: {
                authType: apsConfig.authType,
                oauth2: apsConfig.oauth2,
                bpmHost: apsConfig.bpmHost
            },
            user: env.E2E_USERNAME,
            password: env.E2E_PASSWORD,
            unauthorized_user: env.E2E_UNAUTHORIZED_USER,
            unauthorized_user_password: env.E2E_UNAUTHORIZED_USER_PASSWORD,
            appTitle: apsConfig.application.name
        }
    };
}
// ==================

export const testConfig = getConfig(__dirname, apsConfigJson);

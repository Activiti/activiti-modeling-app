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

import * as appConfigJson from '../src/app.config.json';
import { getConfig } from 'ama-testing/e2e';
const apsConfigJson = <any>appConfigJson;
require('dotenv').config();
const env = process.env;

export const testConfig = getConfig(__dirname, apsConfigJson, env.E2E_HOST, env.E2E_PORT);

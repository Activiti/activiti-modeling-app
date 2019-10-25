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

import * as AlfrescoApi from 'alfresco-js-api-node';
import { Backend, ModelCrud } from '../api.interfaces';
import { TestConfig} from '../../config/test.config.interface';
import { ACMProject } from './project';
import { ACMProcess } from './models/process';
import { ACMConnector } from './models/connector';
import { ACMDecisionTable } from './models/decision-table';
import { ACMForm } from './models/form';
import { ACMUi } from './models/ui';
import { ACMData } from './models/data';
import { Logger } from '../../util/logger';


export class ACMBackend implements Backend {

    public api: AlfrescoApi;
    public project: ACMProject;
    public process: ModelCrud;
    public connector: ModelCrud;
    public form: ModelCrud;
    public decisionTable: ModelCrud;
    public ui: ModelCrud;
    public dataObject: ModelCrud;

    constructor(public config: TestConfig) {
        this.api = new AlfrescoApi({
            authType: config.ama.backendConfig.authType,
            oauth2: config.ama.backendConfig.oauth2
        });
    }

    async setUp() {
        await this.login();

        this.project = new ACMProject(this);
        this.process = new ACMProcess(this);
        this.connector = new ACMConnector(this);
        this.decisionTable = new ACMDecisionTable(this);
        this.form = new ACMForm(this);
        this.ui = new ACMUi(this);
        this.dataObject = new ACMData(this);

        return this;
    }

    async tearDown() {
        await this.api.logout();
        return this;
    }

    private async login() {
        try {
            await this.api.login(this.config.ama.user, this.config.ama.password);
        } catch (error) {
            Logger.error(error);
        }
    }
}

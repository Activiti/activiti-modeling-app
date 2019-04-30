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

import { Component } from '@angular/core';
import { ComponentRegisterService } from '@alfresco/adf-extensions';
import { ProjectSettingsConnectorTabKey } from 'ama-sdk';

interface Tab {
    label: string;
    key: string;
}

@Component({
    templateUrl: './project-settings.component.html'
})
export class ProjectSettingsComponent {

    private _tabs: Tab[] = [
        { label: 'APP.PROJECT.SETTINGS.CONNECTORS_TAB_LABEL', key: ProjectSettingsConnectorTabKey }
    ];

    constructor(private componentRegister: ComponentRegisterService) {}

    get tabs(): Tab[] {
        return this._tabs.filter(tab => this.componentRegister.hasComponentById(tab.key));
    }
}

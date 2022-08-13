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

import { Injectable } from '@angular/core';
import { Project, AmaApi, MODEL_TYPE } from '@alfresco-dbp/modeling-shared/sdk';
import { Observable } from 'rxjs';

@Injectable()
export class ProjectTreeSearchService {

    typeIconMap = {
         'process' : 'device_hub',
         'connector' : 'link',
         'model' : 'view_quilt',
         'form' : 'subject',
         'decision' : 'border_all',
         'ui': 'view_quilt',
         'file': 'description',
         'script': 'extension',
         'trigger': 'play_circle_filled',
         'custom-form-widget' : 'widgets',
         'data' : 'integration_instructions',
         'authentication': 'lock'
    };

    constructor(private amaApi: AmaApi) {}

    fetchProject(projectId: string): Observable<Partial<Project>> {
        return this.amaApi.Project.get(projectId);
    }

    searchByName(projectId: string, partialName: string)  {
        return this.amaApi.Project.searchProjectModelByName(projectId, partialName);
    }

    getIconByType(elementType: MODEL_TYPE): string {
        return this.typeIconMap[elementType.toLowerCase()];
    }
}

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
import { Observable, forkJoin } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { ProcessInfo, ProcessDropdownStructure, EntityProperty, Process } from './../api/types';
import { AmaApi } from '../api/api.interface';

@Injectable({
    providedIn: 'root',
}) export class ProcessService {

    constructor(
        private amaApi: AmaApi
    ) { }

    getProcesses(projectId: string): Observable<ProcessDropdownStructure> {
        return this.amaApi.Process.getList(projectId).pipe(
            concatMap(processes => {
                const observables: Observable<string>[] = [];
                for (const process of processes) {
                    observables.push(this.amaApi.Process.export(process.id));
                }
                // eslint-disable-next-line
                return forkJoin(...observables).pipe(
                    map((processContents: string[]) => this.createProcessesModelProcessDefinitionIdStructure(processes, processContents))
                );
            })
        );
    }

    getVariablesFromProcessDefinitionId(projectId: string, processDefinitionId: string): Observable<EntityProperty[]> {
        return this.getProcesses(projectId).pipe(
            map(dropdown => {
                const processModels = Object.values(dropdown);
                let variables: EntityProperty[];
                processModels.forEach(processModelInfo => {
                    processModelInfo.forEach(processInfo => {
                        if (processInfo.processDefinitionId === processDefinitionId) {
                            variables = processInfo.processProperties;
                            return;
                        }
                    });
                    if (variables) {
                        return;
                    }
                });
                return variables;
            })
        );
    }

    private createProcessesModelProcessDefinitionIdStructure(models: Process[], processContent: string[]): ProcessDropdownStructure {
        const structure: ProcessDropdownStructure = {};
        for (let i = 0; i < models.length; i++) {
            structure[models[i].name] = this.getProcessInfoFromContent(models[i], processContent[i]);
        }
        return structure;
    }

    private getProcessInfoFromContent(processModel: Process, content: string): ProcessInfo[] {
        const processInfo: ProcessInfo[] = [];

        const parser = new DOMParser();
        const parsedXml: Document = parser.parseFromString(content, 'text/xml');

        let processTag = 'bpmn2:process';
        let process = parsedXml.getElementsByTagName(processTag);
        if (!process || !process.length) {
            processTag = 'process';
            process = parsedXml.getElementsByTagName(processTag);
        }

        if (process && process.length) {
            for (let i = 0; i < process.length; i++) {
                const processDefinition = parsedXml.getElementsByTagName(processTag).item(i);
                processInfo.push({
                    processName: processDefinition.getAttribute('name') ? processDefinition.getAttribute('name') : processModel.name + '-' + processDefinition.getAttribute('id'),
                    processDefinitionId: processDefinition.getAttribute('id'),
                    processProperties: processModel.extensions &&
                        processModel.extensions[processDefinition.getAttribute('id')] &&
                        processModel.extensions[processDefinition.getAttribute('id')].properties ?
                        Object.values(processModel.extensions[processDefinition.getAttribute('id')].properties)
                        : []
                });
            }
        }
        return processInfo;
    }
}

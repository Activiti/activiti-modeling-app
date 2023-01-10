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
import { ElementHelper } from '../../bpmn-js/element.helper';
import { BpmnProperty } from '@alfresco-dbp/modeling-shared/sdk';
import { CandidateStartersSettings } from '../../../components/candidate-starters-dialog/candidate-starters-dialog.component';

@Injectable()
export class CandidateStartersService {

    getCandidateStarters(element: Bpmn.DiagramElement): CandidateStartersSettings {
        const users = ElementHelper.getProperty(element, BpmnProperty.candidateStarterUsers);
        const groups = ElementHelper.getProperty(element, BpmnProperty.candidateStarterGroups);

        return {
            candidateStarterUsers: this.convertStringToArray(users),
            candidateStarterGroups: this.convertStringToArray(groups)
        };
    }

    private convertStringToArray(value: string): string | string[] | undefined {
        return !value ? value : value.split(',');
    }
}

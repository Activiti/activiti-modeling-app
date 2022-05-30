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

import {
    BpmnProperty,
    DECISION_TABLE_INPUT_PARAM_NAME,
    DECISION_TASK_IMPLEMENTATION,
    SCRIPT_INPUT_PARAM_NAME,
    SCRIPT_TASK_IMPLEMENTATION,
    selectSelectedProcess,
    UpdateServiceParametersAction
} from '@alfresco-dbp/modeling-shared/sdk';
import { Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import { isEventSubProcess } from 'bpmn-js/lib/util/DiUtil';
import { filter, take } from 'rxjs/operators';
import { SelectModelerElementAction } from '../../store/process-editor.actions';

export function CustomReplaceMenuProvider(popupMenu, bpmnReplace, modeling, angularInjector: Injector) {

    this.store = angularInjector.get(Store);

    this._replaceServiceTask = (event, definition) => {
        const element = definition.element;

        const replacedElement = bpmnReplace.replaceElement(element, { type: definition.target.type });
        modeling.updateProperties(replacedElement, { [BpmnProperty.implementation]: definition.target.implementation });

        this.setupScriptExtensions(replacedElement, definition.target.extensionName);

        const { id, type, name, category } = replacedElement;
        this.store.dispatch(new SelectModelerElementAction({ id, type, name, category }));
    };

    this.setupScriptExtensions = (shape, extensionName) => {
        const shapeImplementation = shape.businessObject.implementation;
        if (extensionName && (shapeImplementation === SCRIPT_TASK_IMPLEMENTATION || shapeImplementation === DECISION_TASK_IMPLEMENTATION )) {
            this.store.select(selectSelectedProcess).pipe(
                filter(model => !!model),
                take(1)
            ).subscribe(model =>
                this.store.dispatch(new UpdateServiceParametersAction(
                    model.id, this.getProcessIdFromExtensions(model.extensions), shape.businessObject.id, {}, { [extensionName]: {} }
                ))
            );
        }
    };

    this.getProcessIdFromExtensions = (extensions) => Object.keys(extensions)[0];

    this.getEntries = (element) => {
        if (
            isAny(element, [
                'bpmn:Task',
                'bpmn:ServiceTask',
                'bpmn:UserTask'
            ]) && !isEventSubProcess(element)
        ) {
            return {
                'append.bpmn-icon-script-activiti': {
                    id: 'replace-with-script-task',
                    className: 'bpmn-icon-script activiti',
                    title: 'Script Task',
                    label: 'Script Task',
                    target: {
                        type: 'bpmn:ServiceTask',
                        implementation: SCRIPT_TASK_IMPLEMENTATION,
                        extensionName: SCRIPT_INPUT_PARAM_NAME
                    },
                    element: element,
                    action: this._replaceServiceTask
                },
                'append.bpmn-icon-business-rule-activiti': {
                    id: 'replace-with-rule-task',
                    className: 'bpmn-icon-business-rule activiti',
                    title: 'Decision Table Task',
                    label: 'Decision Table Task',
                    target: {
                        type: 'bpmn:ServiceTask',
                        implementation: DECISION_TASK_IMPLEMENTATION,
                        extensionName: DECISION_TABLE_INPUT_PARAM_NAME
                    },
                    element: element,
                    action: this._replaceServiceTask
                }
            };
        }
        return [];
    };

    popupMenu.registerProvider('bpmn-replace', this);
}

CustomReplaceMenuProvider.$inject = ['popupMenu', 'bpmnReplace', 'modeling', 'angularInjector'];

export const CustomReplaceMenuProviderBpmnJsModule = {
    __init__: ['customReplaceMenuProvider'],
    customReplaceMenuProvider: ['type', CustomReplaceMenuProvider]
};

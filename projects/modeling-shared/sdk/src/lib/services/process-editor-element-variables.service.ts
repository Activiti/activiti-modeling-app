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

import { TranslationService } from '@alfresco/adf-core';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ElementVariable, ProcessEditorElementVariable, ProcessEditorElementWithVariables } from '../api/types';
import { VariableMappingBehavior } from '../interfaces/variable-mapping-type.interface';
import { BpmnElement } from '../process-editor/bpmn-element';
import { selectProcessMappingsFor } from '../process-editor/process-editor.selectors';
import { BpmnProperty } from '../process-editor/properties';
import { AmaState } from '../store/app.state';
import { ProcessEditorElementVariablesProvider, PROCESS_EDITOR_ELEMENT_VARIABLES_PROVIDERS } from './process-editor-element-variables-provider.service';
import { VariableMappingTypeService } from './variable-mapping-type.service';
@Injectable({
    providedIn: 'root'
})
export class ProcessEditorElementVariablesService {
    constructor(
        @Inject(PROCESS_EDITOR_ELEMENT_VARIABLES_PROVIDERS) private providers: ProcessEditorElementVariablesProvider[],
        private translateService: TranslationService,
        private store: Store<AmaState>
    ) { }

    getAvailableVariablesForElement(element: Bpmn.DiagramElement, visitedElements?: Bpmn.DiagramElement[]): Observable<ProcessEditorElementVariable[]> {
        const observables: Observable<ProcessEditorElementVariable[]>[] = [of([])];
        if (!visitedElements) {
            visitedElements = [];
            observables.push(this.getVariablesFromElement(this.getParentProcessFromElement(element)));
        }

        if (visitedElements.findIndex(visited => visited.id === element.id) === -1) {
            const handledElement = element.type === BpmnElement.Label ? element.labelTarget : element;
            visitedElements.push(handledElement);
            if (handledElement.type === BpmnElement.SequenceFlow) {
                observables.push(this.getAvailableVariablesForElement(handledElement.source, visitedElements));
            } else {
                observables.push(this.getVariablesFromElement(handledElement));
                (handledElement.incoming || []).forEach(incomingFlow => {
                    observables.push(this.getAvailableVariablesForElement(incomingFlow, visitedElements));
                });
            }
        }
        return combineLatest(observables).pipe(
            take(1),
            map(results => {
                let variables: ProcessEditorElementVariable[] = [];
                results.forEach(result => variables = variables.concat(result));
                return variables.filter(processElement => processElement.variables?.length > 0);
            })
        );
    }

    getVariablesList(variables: ProcessEditorElementVariable[]): ElementVariable[] {
        let vars: ElementVariable[] = [];
        if (variables) {
            variables
                .filter((variable) => variable.variables?.length > 0)
                .forEach((element) => vars = vars.concat(element.variables));
        }

        return vars;
    }

    private getVariablesFromElement(element: Bpmn.DiagramElement): Observable<ProcessEditorElementVariable[]> {
        let processId;
        try {
            processId = this.getParentProcessFromElement(element).id;
        } catch (exception) {
            processId = null;
        }

        return this.isMappingOutputsImplicitly(processId, element.id).pipe(
            switchMap(isMappingImplicit => {
                const observables: Observable<ElementVariable[]>[] = [];
                if (isMappingImplicit || element.type === BpmnElement.Process || element.type === BpmnElement.Participant) {
                    const providerType = this.getTypeFromBpmnDiagramElementType(element);
                    if (providerType) {
                        const availableProviders = this.providers.filter(provider => provider.getHandledTypes().findIndex(type => type === providerType) >= 0) || [];
                        availableProviders.forEach(provider => {
                            observables.push(provider.getOutputVariables(element));
                        });
                    }
                    if (observables.length > 0) {
                        return combineLatest(observables).pipe(
                            take(1),
                            map(results => {
                                const variables: ProcessEditorElementVariable[] = [];
                                results.forEach(result => variables.push(this.patchSourceIconAndTooltip(element, result)));
                                return variables;
                            })
                        );
                    }
                }
                return of([]);
            })
        );
    }

    private isMappingOutputsImplicitly(processId: string, elementId: string): Observable<boolean> {
        if (processId) {
            const mappings$ = this.store.select(selectProcessMappingsFor(processId, elementId));
            const mappingBehavior$ = mappings$.pipe(
                map(mappings => VariableMappingTypeService.getDefaultMappingBehavior(mappings)));
            return mappingBehavior$.pipe(map(mapBehavior => mapBehavior === VariableMappingBehavior.MAP_ALL || mapBehavior === VariableMappingBehavior.MAP_ALL_OUTPUTS));
        } else {
            return of(false);
        }
    }

    patchSourceIconAndTooltip(element: Bpmn.DiagramElement, variables: ElementVariable[]): ProcessEditorElementVariable {
        const source = {
            name: element.businessObject.name,
            type: this.getTypeFromBpmnDiagramElementType(element),
            subtype: element.businessObject.$type
        };
        const outputVariables = [];
        variables.forEach(variable => {
            const outVariable = { ...variable };
            outVariable.icon = this.getTypeIcon(outVariable.type, outVariable.aggregatedTypes);
            outVariable.tooltip = this.getVariableTooltip(outVariable, source);
            outputVariables.push(outVariable);
        });
        return {
            source,
            variables: outputVariables.sort(this.sortByName)
        };
    }

    private sortByName(a: ElementVariable, b: ElementVariable): number {
        const firstComparingString = a.label || a.name;
        const secondComparingString = b.label || b.name;
        return (firstComparingString > secondComparingString) ? 1 : -1;
    }

    private getTypeFromBpmnDiagramElementType(element: Bpmn.DiagramElement): ProcessEditorElementWithVariables {
        const type = element.type;
        switch (type) {
        case 'bpmn:Process':
            return ProcessEditorElementWithVariables.Process;
        case 'bpmn:StartEvent':
            return ProcessEditorElementWithVariables.StartEvent;
        case 'bpmn:CallActivity':
            return ProcessEditorElementWithVariables.CalledElement;
        case 'bpmn:UserTask':
            return ProcessEditorElementWithVariables.UserTask;
        case 'bpmn:ServiceTask': {
            const implementation = element.businessObject[BpmnProperty.implementation];
            switch (implementation) {
            case 'script.EXECUTE':
                return ProcessEditorElementWithVariables.ScriptTask;
            case 'dmn-connector.EXECUTE_TABLE':
                return ProcessEditorElementWithVariables.DecisionTable;
            case 'email-service.SEND':
                return ProcessEditorElementWithVariables.EmailServiceTask;
            case 'docgen-service.GENERATE':
                return ProcessEditorElementWithVariables.DocgenServiceTask;
            default:
                return ProcessEditorElementWithVariables.ServiceTask;
            }
        }
        case ProcessEditorElementWithVariables.Event:
            return ProcessEditorElementWithVariables.Event;
        case 'bpmn:Participant':
            return ProcessEditorElementWithVariables.Participant;
        case 'bpmn:IntermediateCatchEvent':
        case 'bpmn:IntermediateThrowEvent':
        case 'bpmn:ErrorEventDefinition':
        case 'bpmn:TimerEventDefinition':
        case 'bpmn:SignalEventDefinition':
        case 'bpmn:MessageEventDefinition':
        case 'bpmn:Message':
        case 'bpmn:EndEvent':
        case 'bpmn:BoundaryEvent':
        case 'bpmn:SequenceFlow':
        case 'bpmn:ExclusiveGateway':
        case 'bpmn:FormalExpression':
        case 'bpmn:ParallelGateway':
        case 'bpmn:InclusiveGateway':
        case 'bpmn:SubProcess':
        case 'bpmn:MultiInstanceLoopCharacteristics':
        case 'bpmn:Expression':
        case 'bpmn:DataOutput':
        case 'bpmn:Task':
        case 'bpmn:TextAnnotation':
        case 'bpmn:Collaboration':
        case 'bpmn:Lane':
        case 'bpmn:Error':
        case 'label':
        default:
            return null;
        }
    }

    private getParentProcessFromElement(element: Bpmn.DiagramElement): Bpmn.DiagramElement {
        switch (element.type) {
        case BpmnElement.Process:
            return element;
        case BpmnElement.Participant:
            return element.businessObject.processRef;
        case BpmnElement.UserTask:
        case BpmnElement.ServiceTask:
        case BpmnElement.StartEvent:
        case BpmnElement.EndEvent:
        case BpmnElement.BoundaryEvent:
        case BpmnElement.IntermediateCatchEvent:
        case BpmnElement.IntermediateThrowEvent:
        case BpmnElement.CallActivity:
        case BpmnElement.Label:
            if (element.businessObject.$parent?.$type === BpmnElement.SubProcess) {
                return element.parent.parent;
            } else {
                return element.parent;
            }
        case BpmnElement.SequenceFlow:
            return element.parent;
        default:
            throw new Error(`Process not found for element type ${element.type}`);
        }
    }

    getVariableTooltip(variable: ElementVariable, source: any, headerText = 'SDK.CONDITION.TOOLTIP.VARIABLE'): string {
        let tooltipText = '';
        const name = source?.name || '';
        if (source?.type === ProcessEditorElementWithVariables.Process) {
            tooltipText = this.translateService.instant('SDK.CONDITION.TOOLTIP.PROCESS_VARIABLE_TOOLTIP', { processName: name });
        } else {
            const taskType = source?.type ? this.translateService.instant('SDK.CONDITION.TYPES.' + source?.type) : '';
            tooltipText = this.translateService.instant('SDK.CONDITION.TOOLTIP.OUTPUT_VARIABLE_TOOLTIP', { taskName: name, taskType });
        }
        return `
            <div class="ama-variables-selector-tooltip">
                <h3 class="ama-variables-selector-tooltip-first-header">${this.translateService.instant(headerText)}</h3>
                <div class="ama-variables-selector-tooltip-text">
                    <p>${tooltipText.trim()}.</p>
                    <span>${variable.description ? '<p>' + variable.description + '</p>' : ''}</span>
                </div>
                <h3>${this.translateService.instant('SDK.CONDITION.TOOLTIP.PROPERTIES')}</h3>
                <div class="ama-variables-selector-tooltip-text">
                    <p>
                        <pre class="ama-variables-selector-variables-group-list-item-type">${this.getTypeIcon(variable.type, variable.aggregatedTypes)}</pre>
                        <span>${variable.aggregatedTypes || variable.type}</span>
                    </p>
                </div>
            </div>
        `;
    }

    getTypeIcon(type: string, aggregatedTypes: string[]): string {
        if (!aggregatedTypes || aggregatedTypes.length === 1) {
            switch (type) {
            case 'datetime':
                return 'dt';
            case 'folder':
                return 'fo';
            default:
                return type && type.length > 0 ? type.trim().substring(0, 1).toLowerCase() : '?';
            }
        } else {
            return 'm';
        }
    }
}

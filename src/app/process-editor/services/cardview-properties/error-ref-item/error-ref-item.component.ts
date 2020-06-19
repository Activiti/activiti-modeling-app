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

import { Component, Input, OnInit, Inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CardItemTypeService, CardViewUpdateService } from '@alfresco/adf-core';
import {
    ProcessModelerServiceToken, ProcessModelerService, AmaState, ConnectorError, Connector,
    selectProjectConnectorsArray,
    ConnectorContent
} from '@alfresco-dbp/modeling-shared/sdk';
import { ErrorRefItemModel } from './error-ref-item.model';
import { Store } from '@ngrx/store';
import { SelectModelerElementAction } from '../../../store/process-editor.actions';
import { Observable, Subject, forkJoin } from 'rxjs';
import { takeUntil, map, mergeMap } from 'rxjs/operators';
import { ProcessConnectorService } from '../../process-connector-service';

export interface ConnectorErrorGroups {
    name: string;
    errors: Bpmn.DiagramElement[];
}

@Component({
    selector: 'ama-process-error-ref',
    templateUrl: './error-ref-item.component.html',
    providers: [CardItemTypeService]
})
export class CardViewErrorRefItemComponent implements OnInit, OnDestroy {
    @Input() property: ErrorRefItemModel;

    private unsubscribe$ = new Subject<void>();
    private connector: Connector;

    errors: Bpmn.DiagramElement[] = [];
    diagramErrors: Bpmn.DiagramElement[] = [];
    selectedError: Bpmn.DiagramElement;
    attachedIsNotConnector = false;

    loading = false;

    isStartEvent = false;
    connectorErrorGroups$: Observable<ConnectorErrorGroups[]>;

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private store: Store<AmaState>,
        @Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService,
        private processConnectorService: ProcessConnectorService,
        private cdRef: ChangeDetectorRef
    ) { }

    get rootElements() {
        return this.processModelerService.getRootProcessElement().businessObject.$parent.rootElements;
    }

    private get bpmnFactory() {
        return this.processModelerService.getFromModeler('bpmnFactory');
    }

    get parentIsConnector() {
        return this.selectedError ? this.selectedError.id.startsWith('connector.') : false;
    }

    ngOnInit() {
        const attached = this.property.data.element.businessObject.attachedToRef;
        this.diagramErrors = this.rootElements.filter(element => element.$type === 'bpmn:Error');
        if (attached) {
            if (attached.$type === 'bpmn:ServiceTask' && attached.implementation) {
                this.loading = true;
                this.attachedIsNotConnector = true;
                this.getConnector(attached);
                this.getConnectorErrors(this.connector.id).pipe(takeUntil(this.unsubscribe$)).subscribe(connectorErrors => {
                    this.errors = this.errors.concat(this.transformConnectorErrorsToBpmnElements(this.connector.name, connectorErrors));
                    this.loading = false;
                    this.selectedError = this.initSelectedError(true);
                    this.cdRef.detectChanges();
                });
            } else {
                this.selectedError = this.initSelectedError();
                this.errors = this.diagramErrors;
            }
        } else {
            this.isStartEvent = true;
            this.selectedError = this.initSelectedError();
            this.errors = this.diagramErrors;
            this.connectorErrorGroups$ = this.getAllConnectorErrors();
        }
    }

    initSelectedError(isConnector?: boolean) {
        const errorDef = this.property.data.element.businessObject.eventDefinitions[0].errorRef;
        if (isConnector && errorDef) {
            return this.errors.find(error => errorDef.id === error.id);
        } else {
            return errorDef;
        }
    }

    createNewError() {
        const errorElement = this.bpmnFactory.create('bpmn:Error');
        errorElement.name = errorElement.id;
        errorElement.errorCode = errorElement.id;
        this.rootElements.push(errorElement);

        this.diagramErrors.push(errorElement);
        this.selectedError = errorElement;
        this.changeErrorRef();
    }

    changeErrorRef() {
        if (this.selectedError) {
            if (this.diagramErrors.filter(element => element.id === this.selectedError['id']).length === 0) {
                this.rootElements.push(this.selectedError);
            }
        }
        this.cardViewUpdateService.update(this.property, this.selectedError);
        const { id, type, name } = this.property.data.element;
        this.store.dispatch(new SelectModelerElementAction({ id, type, name }));
    }

    getConnector(attached: any) {
        this.store.select(selectProjectConnectorsArray).pipe(
            map(connectors =>
                connectors.filter((connector: Connector) =>
                    connector.name === attached.implementation.split('.')[0]))
        ).pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
            this.connector = res[0];
        });
    }

    getConnectorErrors(connectorId: string): Observable<ConnectorError[]> {
        return this.processConnectorService.getContent(connectorId).pipe(map(connector => connector.errors));
    }

    getAllConnectorErrors(): Observable<ConnectorErrorGroups[]> {
        return this.store.select(selectProjectConnectorsArray).pipe(
            mergeMap(connectors => {
                const connectorContentObservables: Observable<ConnectorContent>[] = [];
                connectors.forEach(connector => {
                    connectorContentObservables.push(this.processConnectorService.getContent(connector.id));
                });
                return forkJoin(...connectorContentObservables).pipe(
                    map((connectorDefinitions: ConnectorContent[]) => {
                        const connectorErrorGroups: ConnectorErrorGroups[] = [];
                        connectorDefinitions.forEach(connectorDefinition =>
                            connectorErrorGroups.push(
                                {
                                    name: connectorDefinition.name,
                                    errors: this.transformConnectorErrorsToBpmnElements(connectorDefinition.name, connectorDefinition.errors)
                                }
                            )
                        );
                        return connectorErrorGroups;
                    })
                );
            })
        );
    }

    private transformConnectorErrorsToBpmnElements(connectorName: string, connectorErrors: ConnectorError[]): Bpmn.DiagramElement[] {
        const bpmnErrors: Bpmn.DiagramElement[] = [];
        if (connectorErrors) {
            connectorErrors.forEach(connectorError => bpmnErrors.push(this.getErrorAsBpmnElement(connectorName, connectorError)));
        }
        return bpmnErrors;
    }

    getErrorAsBpmnElement(connectorName: string, error: ConnectorError): Bpmn.DiagramElement {
        const errorElement = this.bpmnFactory.create('bpmn:Error');
        errorElement.id = `connector.${connectorName}_${error.code}`;
        errorElement.name = error.name;
        errorElement.errorCode = error.code;
        return errorElement;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

}

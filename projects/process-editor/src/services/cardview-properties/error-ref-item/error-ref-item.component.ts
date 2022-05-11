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

import { Component, Input, OnInit, Inject, OnDestroy, ChangeDetectorRef, Optional, Injector, ViewEncapsulation } from '@angular/core';
import { CardItemTypeService, CardViewUpdateService } from '@alfresco/adf-core';
import {
    ProcessModelerServiceToken, ProcessModelerService, AmaState,
    ErrorProvidersToken, ExtensionErrorProviderInterface, selectSelectedProjectId, ExtensionErrorGroup, ExtensionError
} from '@alfresco-dbp/modeling-shared/sdk';
import { ErrorRefItemModel } from './error-ref-item.model';
import { Store } from '@ngrx/store';
import { SelectModelerElementAction } from '../../../store/process-editor.actions';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map, delay } from 'rxjs/operators';
import { ProcessErrorsService } from '../../process-errors.service';

export interface ErrorGroup {
    name: string;
    errors: Bpmn.BusinessObject[];
}

@Component({
    selector: 'ama-process-error-ref',
    templateUrl: './error-ref-item.component.html',
    styleUrls: ['./error-ref-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [CardItemTypeService]
})
export class CardViewErrorRefItemComponent implements OnInit, OnDestroy {

    @Input() property: ErrorRefItemModel;

    private unsubscribe$ = new Subject<void>();

    private errorProvider: any;

    errors: Bpmn.BusinessObject[] = [];
    diagramErrors: Bpmn.BusinessObject[] = [];
    selectedError: Bpmn.BusinessObject;
    attachedIsNotConnector = false;

    loading = false;
    isStartEvent = false;
    errorsGroups: ErrorGroup[] = [];
    foundExactImplementation = false;

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private store: Store<AmaState>,
        @Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService,
        private processErrorsService: ProcessErrorsService,
        private cdRef: ChangeDetectorRef,
        private injector: Injector,
        @Optional() @Inject(ErrorProvidersToken) private errorProviders?: ExtensionErrorProviderInterface[]
    ) { }

    get rootElements() {
        return this.processModelerService.getRootProcessElement().businessObject.$parent.rootElements;
    }

    private get bpmnFactory() {
        return this.processModelerService.getFromModeler('bpmnFactory');
    }

    get parentIsConnector() {
        return this.selectedError ? this.selectedError.id?.startsWith('connector.') : false;
    }

    ngOnInit() {
        this.loadErrorProvidersElements();
        const attached = this.property.data.element.businessObject.attachedToRef;
        this.diagramErrors = this.rootElements.filter(element => element.$type === 'bpmn:Error');
        if (attached) {
            if (attached.$type === 'bpmn:ServiceTask' && attached.implementation) {
                this.loading = true;
                this.attachedIsNotConnector = true;
                this.getAttachedErrorProvider(attached);
                this.loadErrorsGroupFromProvider(this.errorProvider).pipe(takeUntil(this.unsubscribe$)).subscribe((providerErrors: ErrorGroup[]) => {
                    this.foundExactImplementation = providerErrors.some(errorGroup => this.isGroupNameEqualsToAttached(errorGroup, attached));
                    if (this.foundExactImplementation) {
                        this.errors = this.errors.concat(providerErrors.find(errorGroup => this.isGroupNameEqualsToAttached(errorGroup, attached)).errors);
                    } else {
                        this.errorsGroups = providerErrors;
                    }
                    this.loading = false;
                    this.selectedError = this.initSelectedError();
                    this.cdRef.detectChanges();
                });
            } else {
                this.errors = this.diagramErrors;
                this.selectedError = this.initSelectedError();
            }
        } else {
            this.isStartEvent = true;
            this.errors = this.diagramErrors;
            this.selectedError = this.initSelectedError();
            this.loadAllErrorsGroups();
        }
    }

    initSelectedError() {
        const errorDef = this.property.data.element.businessObject.eventDefinitions[0].errorRef;
        if (errorDef) {
            const error = this.errors.find(e => errorDef.id === e.id);
            return error ? error : this.errorsGroups.map(group => group.errors.find(e => errorDef.id === e.id)).find(item => item != null);
        } else {
            return errorDef;
        }
    }

    createNewError() {
        const errorElement = this.processErrorsService.createProcessError();
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
        const { id, type, name, category } = this.property.data.element;
        this.store.dispatch(new SelectModelerElementAction({ id, type, name, category }));
    }

    getAttachedErrorProvider(attached: any) {
        this.errorProvider = this.getErrorProviderByName(attached.implementation.split('.')[0]) || this.getErrorProviderByName('connector');
    }

    private transformErrorsToBpmnElements(errorName: string, errors: ExtensionError[], type: string): Bpmn.BusinessObject[] {
        const bpmnErrors: Bpmn.BusinessObject[] = [];
        if (errors) {
            errors.forEach(errorItem => bpmnErrors.push(this.getErrorAsBpmnElement(errorName, errorItem, type)));
        }
        return bpmnErrors;
    }

    getErrorAsBpmnElement(errorName: string, error: ExtensionError, type: string): Bpmn.BusinessObject {
        const errorElement = this.bpmnFactory.create('bpmn:Error');
        errorElement.id = `${type}.${errorName}_${error.code}`;
        errorElement.name = error.name;
        errorElement.errorCode = error.code;
        return errorElement;
    }

    loadErrorsGroupFromProvider(provider: any): Observable<ErrorGroup[]> {
        return this.getErrorsFromProvider(provider);
    }

    loadAllErrorsGroups(): void {
        this.errorProviders?.forEach(provider => this.getErrorsFromProvider(provider).subscribe(
            res => this.errorsGroups = this.errorsGroups.concat(res)));
    }

    loadErrorProvidersElements() {
        this.store.select(selectSelectedProjectId).pipe(
            delay(0),
            takeUntil(this.unsubscribe$)
        ).subscribe(id => {
            this.errorProviders.forEach(provider => this.loadElements(provider, id));
        });
    }

    loadElements(provider: ExtensionErrorProviderInterface, projectId: string) {
        const handler = this.getErrorProviderHandler(provider);
        handler.prepareEntities(projectId);
    }

    getErrorProviderHandler(provider: ExtensionErrorProviderInterface): ExtensionErrorProviderInterface {
        return this.injector.get(provider);
    }

    getErrorsFromProvider(provider: ExtensionErrorProviderInterface): Observable<ErrorGroup[]> {
        return this.getErrorProviderHandler(provider).getErrors().pipe(
            delay(0),
            map((groups: ExtensionErrorGroup[]) => groups.map((group: ExtensionErrorGroup) => ({
                name: group.name,
                errors: this.transformErrorsToBpmnElements(group.name, group.errors, group.type)
            }))),
            takeUntil(this.unsubscribe$)
        );
    }

    getErrorProviderByName(name: string) {
        return this.errorProviders?.find((provider: any) => {
            const handler = this.getErrorProviderHandler(provider);
            return handler.modelType.toLowerCase().includes(name);
        });
    }

    isGroupNameEqualsToAttached(group, attached): boolean {
        return group.name === attached.implementation || group.name === attached.implementation.split('.')[0];
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}

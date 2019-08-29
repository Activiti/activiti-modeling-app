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

import { Component, Input, OnInit, Inject } from '@angular/core';
import { CardItemTypeService, CardViewUpdateService } from '@alfresco/adf-core';
import { ProcessModelerServiceToken, ProcessModelerService, AmaState } from 'ama-sdk';
import { ErrorRefItemModel } from './error-ref-item.model';
import { Store } from '@ngrx/store';
import { SelectModelerElementAction } from '../../../store/process-editor.actions';

@Component({
    selector: 'ama-process-error-ref',
    templateUrl: './error-ref-item.component.html',
    providers: [CardItemTypeService]
})
export class CardViewErrorRefItemComponent implements OnInit {
    @Input() property: ErrorRefItemModel;

    errors: Bpmn.DiagramElement[] = [];
    selectedError: Bpmn.DiagramElement;

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private store: Store<AmaState>,
        @Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService
    ) {}

    get rootElements() {
        return this.processModelerService.getRootProcessElement().businessObject.$parent.rootElements;
    }

    private get bpmnFactory() {
        return this.processModelerService.getFromModeler('bpmnFactory');
    }

    ngOnInit() {
        this.selectedError = this.property.data.element.businessObject.eventDefinitions[0].errorRef;
        this.errors = this.rootElements.filter(element => element.$type === 'bpmn:Error');
    }

    createNewError() {
        const errorElement = this.bpmnFactory.create('bpmn:Error');
        errorElement.name = errorElement.id;
        errorElement.errorCode = errorElement.id;
        this.rootElements.push(errorElement);

        this.errors.push(errorElement);
        this.selectedError = errorElement;
        this.changeErrorRef();
    }

    changeErrorRef() {
        this.cardViewUpdateService.update(this.property, this.selectedError);
        const { id, type, name } = this.property.data.element;
        this.store.dispatch(new SelectModelerElementAction({ id, type, name }));
    }
}

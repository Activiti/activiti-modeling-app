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

import { Component, OnInit, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { AmaState, EntityProperty } from '@alfresco-dbp/modeling-shared/sdk';
import { UpdateCalledElementAction } from '../../../../store/called-element.actions';
import { CalledElementTypes, CalledElementService } from '../called-element.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

export interface CalledElementModel {
    processVariables: EntityProperty[];
    processName: string;
    calledElement: string;
    calledElementType: string;
}

@Component({
    templateUrl: './called-element-dialog.component.html',
    styleUrls: ['./called-element-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CalledElementDialogComponent implements OnInit, OnDestroy {

    processId: string;
    processVariables: EntityProperty[] = [];

    currentActiveTab = 0;
    isCalledElementValid = false;
    expression = '';

    processFileUri: string;
    extendedProperties = {
        plain: true,
        excludedProcesses: []
    };

    onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        private store: Store<AmaState>,
        private calledElementService: CalledElementService,
        public dialog: MatDialogRef<CalledElementDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CalledElementModel) {
    }

    ngOnInit() {
        this.initDialog();
    }

    initDialog() {
        if (this.data.calledElementType === CalledElementTypes.Expression) {
            this.expression = this.data.calledElement;
            this.currentActiveTab = 1;
        } else {
            this.processId = this.data.calledElement;
        }

        this.processVariables = this.data.processVariables;
        this.extendedProperties.excludedProcesses = [this.data.processName];
    }

    onProcessChange(processId: string) {
        this.processId = processId;
        this.validateCalledElement();
    }

    onTabChange(event: MatTabChangeEvent) {
        this.currentActiveTab = event.index;
        this.validateCalledElement();
    }

    validateCalledElement() {
        switch (this.currentActiveTab) {
        case 0:
            this.isCalledElementValid = !!this.processId;
            break;
        case 1:
            this.isCalledElementValid = this.calledElementService.isExpressionValid(this.expression.trim());
        }
    }

    expressionChanged(newExpression: string) {
        this.expression = newExpression;
        this.validateCalledElement();
    }

    save() {
        this.dialog.close();
        const updatedCalledElement = this.currentActiveTab === 0 ? this.processId : this.expression.trim();
        this.store.dispatch(new UpdateCalledElementAction({ calledElement: updatedCalledElement }));
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}

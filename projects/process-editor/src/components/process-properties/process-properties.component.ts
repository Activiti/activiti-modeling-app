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

import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CardViewItem, CardViewUpdateService, UpdateNotification, CardItemTypeService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { selectSelectedElement } from '../../store/process-editor.selectors';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CardViewPropertiesFactory } from '../../services/cardview-properties/cardview-properties.factory';
import {
    PROCESS_EDITOR_CUSTOM_PROPERTY_HANDLERS,
    ProcessEditorCustomProperty,
    ProcessModelerServiceToken,
    ProcessModelerService
} from '@alfresco-dbp/modeling-shared/sdk';
import { ProcessEntitiesState } from '../../store/process-entities.state';
import { SelectedProcessElement } from '../../store/process-editor.state';

@Component({
    selector: 'ama-process-properties',
    templateUrl: './process-properties.component.html',
    styleUrls: ['./process-properties.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [CardViewUpdateService, CardItemTypeService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessPropertiesComponent implements OnInit, OnDestroy {
    onDestroy$: Subject<void> = new Subject<void>();
    properties$: Observable<CardViewItem[]>;

    constructor(
        private store: Store<ProcessEntitiesState>,
        @Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService,
        private cardViewFactory: CardViewPropertiesFactory,
        private cardViewUpdateService: CardViewUpdateService,
        private cardItemTypeService: CardItemTypeService,
        @Inject(PROCESS_EDITOR_CUSTOM_PROPERTY_HANDLERS) private customPropertyHandlers: ProcessEditorCustomProperty[]
    ) {}

    ngOnInit() {
        this.properties$ = this.store.select(selectSelectedElement).pipe(map(this.getPropertiesForShape.bind(this)));

        this.cardViewUpdateService.itemUpdated$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(this.updateElementProperty.bind(this));

        for (const handler of this.customPropertyHandlers) {
            this.cardItemTypeService.setComponentTypeResolver(handler.type, () => handler.implementationClass, true);
        }
    }

    private getPropertiesForShape(shape: SelectedProcessElement): CardViewItem[] {
        if (shape === null) {
            return [];
        }

        try {
            const element = this.processModelerService.getElement(shape.id);
            return this.cardViewFactory.createCardViewPropertiesFor(element);
        } catch {
            /* eslint-disable-next-line */
            console.warn(`Element with id ${shape.id} not found in process editor`);
            return [];
        }
    }

    private updateElementProperty(updateObject: UpdateNotification) {
        const shapeId = updateObject.target.data.id,
            propertyName = updateObject.target.key,
            value = updateObject.changed[propertyName];

        this.processModelerService.updateElementProperty(shapeId, propertyName, value);
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}

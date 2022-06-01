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

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Model, MODEL_TYPE } from '../../api/types';
import { ModelEditorComponent } from '../../model-editor/components/model-editor/model-editor.component';
import { CanComponentDeactivate } from '../../model-editor/router/guards/unsaved-page.guard';
import { TabModel } from '../../models/tab.model';
import { TabManagerService } from '../../services/tab-manager.service';
import { AmaState } from '../../store/app.state';
import { selectModelEntityByType } from '../../store/model-entity.selectors';


@Component({
    selector: 'modelingsdk-tab-manager',
    templateUrl: './tab-manager.component.html',
    styleUrls: ['./tab-manager.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'modelingsdk-tab-manager' }
})
export class TabManagerComponent implements OnInit, CanComponentDeactivate {

    modelId$: Observable<string>;
    modelEntity$: Observable<MODEL_TYPE>;
    modelIcon$: Observable<string>;
    currentTabs$: Observable<TabModel[]>;
    selectedTabIndex$: Observable<number>;

    @ViewChild('modelEditor')
    private modelEditor: ModelEditorComponent;

    constructor(private activatedRoute: ActivatedRoute,
                private tabManagerService: TabManagerService,
                private store: Store<AmaState>) {
        this.currentTabs$ = this.tabManagerService.tabs$;
        this.selectedTabIndex$ = this.tabManagerService.activeTab$;
    }

    public ngOnInit(): void {
        this.modelId$ = this.activatedRoute.params.pipe(map((params) => params.modelId));
        this.modelEntity$ = this.activatedRoute.data.pipe(map((data) => data.modelEntity));
        this.modelIcon$ = this.activatedRoute.data.pipe(map((data) => data.entityIcon));
        combineLatest([this.modelId$,this.modelEntity$]).pipe(
            mergeMap(([modelId, modelEntity]) => this.store.select(selectModelEntityByType(modelEntity, modelId)).pipe(distinctUntilChanged())),
            filter((model) => !!model),
            map((model) => <Model> {...model, type: model.type.toLocaleLowerCase()} ),
            withLatestFrom(this.modelIcon$)
        ).subscribe( ([model, modelIcon])=> this.tabManagerService.openTab(model, modelIcon));
    }

    canDeactivate(): Observable<boolean> {
        return this.modelEditor.canDeactivate();
    }

    onRemoveTab(tabIndex: number) {
        this.tabManagerService.removeTab(tabIndex);
    }

}

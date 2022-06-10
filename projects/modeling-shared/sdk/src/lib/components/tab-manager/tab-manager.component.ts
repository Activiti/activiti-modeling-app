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

import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Model, MODEL_TYPE } from '../../api/types';
import { ModelEditorComponent } from '../../model-editor/components/model-editor/model-editor.component';
import { CanComponentDeactivate } from '../../model-editor/router/guards/unsaved-page.guard';
import { TabModel } from '../../models/tab.model';
import { TabManagerService } from '../../services/tab-manager.service';
import { selectAppDirtyState } from '../../store/app.selectors';
import { AmaState } from '../../store/app.state';
import { selectModelEntityByType } from '../../store/model-entity.selectors';
import { ModelOpenedAction } from '../../store/project.actions';
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
    isDirtyState = false;

    @ViewChild('modelEditor')
    private modelEditor: ModelEditorComponent;

    constructor(private activatedRoute: ActivatedRoute,
        private tabManagerService: TabManagerService,
        private location: Location,
        private store: Store<AmaState>,
        private dialogService: DialogService,
        private router: Router) {
        this.currentTabs$ = this.tabManagerService.tabs$;
        this.selectedTabIndex$ = this.tabManagerService.activeTab$;
    }

    public ngOnInit(): void {
        this.modelId$ = this.activatedRoute.params.pipe(map((params) => params.modelId)).pipe(distinctUntilChanged());
        this.modelEntity$ = this.activatedRoute.data.pipe(map((data) => data.modelEntity)).pipe(take(1));
        this.modelIcon$ = this.activatedRoute.data.pipe(map((data) => data.entityIcon)).pipe(take(1));
        this.modelId$.pipe(
            withLatestFrom(this.modelEntity$),
            switchMap(([modelId, modelEntity]) => this.store.select(selectModelEntityByType(modelEntity, modelId))),
            filter((model) => !!model),
            map((model) => <Model>{ ...model, type: model.type.toLocaleLowerCase() }),
            withLatestFrom(this.modelIcon$),
            takeUntil(this.tabManagerService.resetTabs$)
        ).subscribe(([model, modelIcon]) => this.tabManagerService.openTab(model, modelIcon));

        this.store.select(selectAppDirtyState)
            .pipe(takeUntil(this.tabManagerService.resetTabs$))
            .subscribe((isDirtyState) => this.isDirtyState = isDirtyState);
    }

    canDeactivate(): Observable<boolean> {
        return this.modelEditor.canDeactivate();
    }

    onRemoveTab(tabIndex: number) {
        if (this.isDirtyState) {
            this.dialogService.confirm({
                title: 'SDK.MODEL_EDITOR.CONFiRM.TITLE',
                messages: ['SDK.MODEL_EDITOR.CONFiRM.MESSAGE']
            })
                .subscribe((choice) => {
                    if (choice) {
                        this.removeTabByIndex(tabIndex);
                    }
                });
        } else {
            this.removeTabByIndex(tabIndex);
        }
    }

    private removeTabByIndex(tabIndex: number) {
        this.tabManagerService.removeTabByIndex(tabIndex);
        if(this.tabManagerService.isNoTabOpened()) {
            const projectUrl = this.buildNextUrl();
            void this.router.navigate([projectUrl], {relativeTo: this.activatedRoute});
            this.tabManagerService.reset();
        }
    }

    onSelectedTabChanged(tabIndex: number) {
        const currentTab: TabModel = this.tabManagerService.getTabByIndex(tabIndex);
        if (currentTab) {
            this.store.dispatch(new ModelOpenedAction({ id: currentTab.tabData.modelId, type: currentTab.tabData.modelType }));
            const nextUrl = this.buildNextUrl(currentTab.tabData.modelType, currentTab.tabData.modelId);
            this.location.replaceState(nextUrl);
        }
    }

    private buildNextUrl(modelType?: string, modelId?: string): string {
        const splitUrl = this.location.path().split('/');
        splitUrl.splice(splitUrl.length - 2, 2);
        const addOnPieces = [];
        if (modelType) {
            addOnPieces.push(modelType);
        }
        if (modelId) {
            addOnPieces.push(modelId);
        }
        const reworkedUrl = addOnPieces.length > 0 ? splitUrl.concat(addOnPieces).join('/') : splitUrl.join('/');
        return reworkedUrl;
    }

}

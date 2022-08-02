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

import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, distinctUntilKeyChanged, filter, map, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { MODEL_TYPE } from '../../api/types';
import { ModelEditorComponent } from '../../model-editor/components/model-editor/model-editor.component';
import { CanComponentDeactivate, UnsavedPageGuard } from '../../model-editor/router/guards/unsaved-page.guard';
import { TabModel } from '../../models/tab.model';
import { TabManagerService } from '../../services/tab-manager.service';
import { SetAppDirtyStateAction } from '../../store/app.actions';
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
export class TabManagerComponent implements OnInit, CanComponentDeactivate, OnDestroy {

    modelId$: Observable<string>;
    modelEntity$: Observable<MODEL_TYPE>;
    modelIcon$: Observable<string>;
    selectedTabIndex$: Observable<number>;
    currentActiveTab: TabModel = null;
    selectedTabIndex = -1;

    private onDestroy$ = new Subject<void>();
    private deleteActivatedTab$ = new Subject<TabModel>();
    currentTabs$: Observable<TabModel[]> | Store<TabModel[]>;

    @ViewChild('modelEditor')
    private modelEditor: ModelEditorComponent;

    constructor(private activatedRoute: ActivatedRoute,
        private tabManagerService: TabManagerService,
        private location: Location,
        private store: Store<AmaState>,
        private router: Router,
        private unsavedChanges: UnsavedPageGuard) {

        this.currentTabs$ = this.tabManagerService.getTabs();

        this.tabManagerService.getActiveTab().pipe(
            distinctUntilKeyChanged('id'),
            withLatestFrom(this.currentTabs$),
            takeUntil(this.onDestroy$))
            .subscribe(([tab, currentTabs]) => {
                const newActiveTabIndex = currentTabs.findIndex((indexTab) => indexTab.id === tab.id);
                if(this.isLastTabChanged(tab, newActiveTabIndex, currentTabs)) {
                    this.onSelectedTabChanged(newActiveTabIndex);
                }
                this.currentActiveTab = tab;
                this.selectedTabIndex = newActiveTabIndex;
            });
    }

    private isLastTabChanged(tab: TabModel, newActiveTabIndex: number, currentTabs: TabModel[]) {
        return this.currentActiveTab && currentTabs.length === 1 && this.currentActiveTab.id !== tab.id && this.selectedTabIndex === newActiveTabIndex;
    }


    public ngOnInit(): void {
        this.modelId$ = this.activatedRoute.params.pipe(map((params) => params.modelId)).pipe(distinctUntilChanged());
        this.modelEntity$ = this.activatedRoute.data.pipe(map((data) => data.modelEntity)).pipe(take(1));
        this.modelIcon$ = this.activatedRoute.data.pipe(map((data) => data.entityIcon)).pipe(take(1));

        this.modelId$.pipe(
            withLatestFrom(this.currentTabs$, this.modelEntity$, this.modelIcon$),
            switchMap(([modelId, openedTabs, entityType, modelIcon]) => {
                const existingTab = openedTabs.find((tab: { id: any; }) => tab.id === modelId);
                if (existingTab) {
                    return of(existingTab);
                } else {
                    return this.createNewTab(modelId, entityType, modelIcon);
                }
            }),
            takeUntil(this.onDestroy$)
        ).subscribe((tab: TabModel) => this.tabManagerService.openTab(tab, this.currentActiveTab));
    }

    canDeactivate(): Observable<boolean> {
        return this.modelEditor.canDeactivate();
    }

    deleteDraftState() {
        this.modelEditor.deleteDraftState();
    }

    onRemoveTab(tab: TabModel) {
        if (tab.isDirty) {
            if(tab.id !== this.currentActiveTab.id) {
                this.tabManagerService.setTabActive(tab, this.currentActiveTab);
                this.deleteActivatedTab$.pipe(take(1)).subscribe((tabToDelete) => this.showConfirmDialogAndClose(tabToDelete));
            }else {
                this.showConfirmDialogAndClose(tab);
            }
        } else {
            this.removeTab(tab);
        }
    }

    private showConfirmDialogAndClose(tab: TabModel) {
        this.unsavedChanges.openDirtyStateDialog(this.modelEditor, tab.title).pipe(take(1), filter((choice) => choice))
            .subscribe(() => {
                this.deleteDraftState();
                this.removeTab(tab);
                this.store.dispatch(new SetAppDirtyStateAction(false));
            });
    }

    private removeTab(tab: TabModel) {
        this.tabManagerService.removeTab(tab);
    }

    private resetToProjectUrl() {
        const projectUrl = this.getProjectUrl();
        void this.router.navigate([...projectUrl], { relativeTo: this.activatedRoute });
        this.tabManagerService.reset();
    }

    private createNewTab(modelId: string, entityType: MODEL_TYPE, modelIcon: string) {
        return this.store.select(selectModelEntityByType(entityType, modelId)).pipe(
            filter((model) => !!model),
            map((model) => new TabModel(model.name, modelIcon, model.id, model.type.toLocaleLowerCase(), true, false)),
            distinctUntilKeyChanged('id'),
            tap((tab: TabModel) => this.tabManagerService.addTabToList(tab)),
            takeUntil(this.tabManagerService.resetTabs$)
        );
    }

    onSelectedTabChanged(tabIndex: number) {
        if (this.tabManagerService.isTabListEmpty()) {
            this.resetToProjectUrl();
        } else {
            const currentTab: TabModel = this.tabManagerService.getTabByIndex(tabIndex);
            if (currentTab) {
                this.store.dispatch(new ModelOpenedAction({ id: currentTab.id, type: currentTab.modelType }));
                const projectUrlPart = this.getProjectUrl();
                void this.router.navigate([...projectUrlPart, currentTab.modelType, currentTab.id], { relativeTo: this.activatedRoute, state: { avoidCheck: true } });
            }
        }
    }

    onTabChange() {
        this.deleteActivatedTab$.next(this.currentActiveTab);
    }

    private getProjectUrl(): string[] {
        const splitUrl = this.location.path().split('/');
        splitUrl.splice(splitUrl.length - 2, 2);
        return splitUrl;
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

}

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

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilKeyChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import { TabManagerEntityService } from '../components/tab-manager/tab-manager-entity.service';
import { TabModel } from '../models/tab.model';

@Injectable({
    providedIn: 'root'
})
export class TabManagerService {

    private resetTabs = new Subject<void>();
    public resetTabs$ = this.resetTabs.asObservable();
    private tabList: TabModel[] = [];
    private editorMap = new Map();

    constructor(private tabManagerEntityService: TabManagerEntityService) {
    }

    public removeTab(tab: TabModel) {
        if (tab.active) {
            this.setNewActiveTab(tab, this.tabList);
        }
        this.tabManagerEntityService.removeOneFromCache(tab);
    }

    public removeTabByModelId(modelId: string) {
        const deletedTab = this.tabList.find(tab => tab.id === modelId);
        this.removeTab(deletedTab);
    }

    public getTabs(): Observable<TabModel[]> {
        return this.tabManagerEntityService.entities$.pipe(tap(entities => this.tabList = entities), takeUntil(this.resetTabs$));
    }

    public isTabListEmpty(): boolean {
        return this.tabList && this.tabList.length === 0;
    }

    public hasTabListElements(numberOfElements: number): boolean {
        return this.tabList && this.tabList.length === numberOfElements;
    }

    public getTabByIndex(index: number): TabModel {
        return this.tabList[index];
    }

    public getActiveTab(): Observable<TabModel> {
        this.tabManagerEntityService.setFilter(true);
        return this.tabManagerEntityService.filteredEntities$.pipe(
            filter(tabActives => tabActives.length === 1),
            map(tabActives => tabActives[0]),
            distinctUntilKeyChanged('id'),
            takeUntil(this.resetTabs$));
    }

    private setNewActiveTab(tab: TabModel, openedTabs: TabModel[]) {
        const currentOpenTabIndex = openedTabs.findIndex((openedTab) => openedTab.id === tab.id);
        const nextTabIndex = this.getNextRelativeTabIndex(currentOpenTabIndex, openedTabs);
        if (nextTabIndex >= 0) {
            const nextActiveTab = openedTabs[nextTabIndex];
            nextActiveTab.active = true;
            this.tabManagerEntityService.updateOneInCache(tab);
        }
    }

    private getNextRelativeTabIndex(currentTabIndex: number, openedTabs: TabModel[]) {
        if (openedTabs.length === 1 && currentTabIndex === 0) {
            return -1;
        } else {
            return currentTabIndex - 1 >= 0 ? currentTabIndex - 1 : currentTabIndex + 1;
        }
    }

    public addTabToList(tab: TabModel) {
        this.tabManagerEntityService.addOneToCache(tab);
    }

    public openTab(tab: TabModel, currentActiveTab: TabModel) {
        if (currentActiveTab && tab.id !== currentActiveTab.id) {
            this.setTabActive(tab, currentActiveTab);
        }
    }

    public setTabActive(tab: TabModel, currentActiveTab: TabModel) {
        tab.active = true;
        currentActiveTab.active = false;
        this.tabManagerEntityService.updateManyInCache([tab, currentActiveTab]);
    }

    public reset() {
        this.resetTabs.next();
        this.resetTabs.complete();
        this.tabList = [];
        this.tabManagerEntityService.clearCache();
    }

    updateTabTitle(newTitle: string, modelId: string | number) {
        const tab = this.tabList?.find(openTab => openTab.id === modelId);
        if (tab && tab.title.toLocaleLowerCase() !== newTitle.toLocaleLowerCase()) {
            tab.title = newTitle;
        }
    }

    updateTabDirtyState(dirtyState: boolean, modelId: string | number) {
        const tab = this.tabList?.find(openTab => openTab.id === modelId);
        if (tab && tab.isDirty !== dirtyState) {
            tab.isDirty = dirtyState;
        }
    }

    registerEditor(editor) {
        if (!this.editorMap.get(editor.modelId)) {
            this.editorMap.set(editor.modelId, editor);
        }
    }

    getEditor(modelId: string) {
        return this.editorMap.get(modelId);
    }
}

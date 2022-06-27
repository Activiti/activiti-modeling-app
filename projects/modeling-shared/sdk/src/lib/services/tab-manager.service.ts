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
import { distinctUntilKeyChanged, filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { TabManagerEntityService } from '../components/tab-manager/tab-manager-entity.service';
import { TabModel } from '../models/tab.model';

@Injectable({
    providedIn: 'root'
})
export class TabManagerService {

    private resetTabs = new Subject<void>();
    public resetTabs$ = this.resetTabs.asObservable();

    constructor(private tabManagerEntityService: TabManagerEntityService) {
    }

    public removeTab(tab: TabModel, openedTabs: TabModel[]) {
        this.setNewActiveTab(tab, openedTabs);
        this.tabManagerEntityService.removeOneFromCache(tab);
    }

    public removeTabByModelId(modelId: string, openedTabs: TabModel[]) {
        const deletedTab = openedTabs.find(tab => tab.id === modelId);
        this.removeTab(deletedTab, openedTabs);
    }

    public getActiveTab(): Observable<[TabModel, TabModel[]]> {
        this.tabManagerEntityService.setFilter(true);
        return this.tabManagerEntityService.filteredEntities$.pipe(
            filter(tabActives => tabActives.length === 1),
            map(tabActives => tabActives[0]),
            distinctUntilKeyChanged('id'),
            withLatestFrom(this.tabManagerEntityService.entities$),
            takeUntil(this.resetTabs$));
    }

    private setNewActiveTab(tab: TabModel, openedTabs: TabModel[]){
        const currentOpenTabIndex = openedTabs.findIndex((openedTab) => openedTab.id === tab.id);
        if(currentOpenTabIndex-1 !== -1) {
            const nextActiveTab = openedTabs[currentOpenTabIndex-1];
            nextActiveTab.active = true;
            this.tabManagerEntityService.updateOneInCache(tab);
        }
    }

    public openTab(tab: TabModel, currentActiveTab: TabModel) {
        if (currentActiveTab && tab.id !== currentActiveTab.id) {
            this.setTabActive(tab, currentActiveTab);
        }
    }

    public setTabActive(tab: TabModel, currentActiveTab: TabModel){
        tab.active = true;
        currentActiveTab.active = false;
        this.tabManagerEntityService.updateManyInCache([tab, currentActiveTab]);
    }

    public reset() {
        this.resetTabs.next();
        this.tabManagerEntityService.clearCache();
    }

    updateTabTitle(newTitle: string, modelId: string | number) {
        this.tabManagerEntityService.updateOneInCache({ id: modelId+'', title: newTitle});
    }

}

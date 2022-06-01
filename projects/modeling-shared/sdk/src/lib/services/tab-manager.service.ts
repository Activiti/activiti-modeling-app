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
import { BehaviorSubject } from 'rxjs';
import { Model } from '../api/types';
import { TabModel } from '../models/tab.model';

@Injectable({
    providedIn: 'root'
})
export class TabManagerService {

    public tabs: TabModel[] = [
    ];

    private tabSub = new BehaviorSubject<TabModel[]>(this.tabs);
    public tabs$ = this.tabSub.asObservable();

    private activeTab = new BehaviorSubject<number>(0);
    public activeTab$ = this.activeTab.asObservable();

    public removeTab(index: number) {
        this.tabs.splice(index, 1);
        if (this.tabs.length > 0) {
            this.tabs[this.tabs.length - 1].active = true;
        }
        this.tabSub.next(this.tabs);
    }

    public openTab(model: Model, modelIcon: string) {
        const currentTabIndex = this.getTabIndexByModelId(model.id);
        if(currentTabIndex !== -1) {
            this.setActiveTab(currentTabIndex);
        } else {
            const openedTab = new TabModel(model.name, modelIcon, { modelId: model.id, modelType: model.type});
            openedTab.active = true;
            openedTab.tabId = this.tabs.push(openedTab);
            this.tabSub.next(this.tabs);
            this.setActiveTab(openedTab.tabId-1);
        }
    }

    private getTabIndexByModelId(modelId: string): number {
        return this.tabs.findIndex((tab) => tab.tabData.modelId === modelId);
    }

    private setActiveTab(tabIndex: number) {
        const currentActiveTabIndex = this.tabs.findIndex((tab) => !!tab && tab.active);
        if(currentActiveTabIndex !== tabIndex && currentActiveTabIndex !== -1) {
            this.tabs[currentActiveTabIndex].active = false;
            this.tabs[tabIndex].active = true;
            this.activeTab.next(tabIndex);
        } else {
            this.activeTab.next(currentActiveTabIndex);
        }
    }

}

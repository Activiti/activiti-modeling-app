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

import { MODEL_TYPE } from '../api/types';

export class TabModelData {
    modelId: string;
    modelType: MODEL_TYPE;
}

export class TabModel {
    public tabId: number;
    public title: string;
    public icon: string;
    public active: boolean;
    public tabData: TabModelData;

   constructor(title: string, icon: string, tabData: TabModelData) {
        this.tabData = tabData;
        this.title = title;
        this.icon = icon;
    }
}

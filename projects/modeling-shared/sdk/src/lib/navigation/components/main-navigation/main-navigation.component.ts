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

import { AppConfigService } from '@alfresco/adf-core';
import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit } from '@angular/core';
export interface NavigableItem {
    label: string;
    title: string;
    disabled: boolean;
    showSearchBar: boolean,
    route: {
        url: string;
    };
    actions?: {
        actionName: string;
        title: string;
        handler: string;
        icon: string;
    }[];
}

export interface NavigationData {
    process: NavigableItem[];
    contentModels?: NavigableItem[];
    dataModels?: NavigableItem[];
    hxpDocumentTypes?: NavigableItem[];
    hxpMixins?: NavigableItem[];
    hxpSchemas?: NavigableItem[];
}

@Component({
    templateUrl: './main-navigation.component.html',
    styleUrls: ['./main-navigation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNavigationComponent implements OnInit {
    navigation: NavigationData;
    constructor(private appConfig: AppConfigService) {}

    ngOnInit() {
        this.navigation = this.appConfig.get('studioLayoutNavigationData');
    }
}

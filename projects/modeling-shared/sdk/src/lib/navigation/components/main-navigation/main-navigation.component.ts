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

import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

export const navigationData = {
    process: [
        {
            header_label: 'NEW_STUDIO_DASHBOARD.NAVIGATION.FAVORITE_PROJECTS.HEADER_LABEL',
            label: 'NEW_STUDIO_DASHBOARD.NAVIGATION.FAVORITE_PROJECTS.LABEL',
            title: 'DASHBOARD.NAVIGATION.FAVORITE_PROJECTS.TOOLTIP',
            disabled: false,
            route: {
                url: '/dashboard/favorite-projects'
            },
            actions: [
                {
                    actionName: 'upload',
                    title: 'NEW_STUDIO_DASHBOARD.NAVIGATION.ALL_PROJECTS.ACTIONS.UPLOAD',
                    handler: 'IMPORT_PROJECT_DIALOG'
                },
                {
                    actionName: 'create',
                    title: 'NEW_STUDIO_DASHBOARD.NAVIGATION.ALL_PROJECTS.ACTIONS.CREATE',
                    handler: 'CREATE_PROJECT_DIALOG'
                }
            ]
        },
        {
            header_label: 'NEW_STUDIO_DASHBOARD.NAVIGATION.ALL_PROJECTS.HEADER_LABEL',
            label: 'NEW_STUDIO_DASHBOARD.NAVIGATION.ALL_PROJECTS.LABEL',
            title: 'DASHBOARD.NAVIGATION.ALL_PROJECTS.TOOLTIP',
            disabled: false,
            route: {
                url: '/dashboard/projects'
            },
            actions: [
                {
                    actionName: 'upload',
                    title: 'NEW_STUDIO_DASHBOARD.NAVIGATION.ALL_PROJECTS.ACTIONS.UPLOAD',
                    handler: 'IMPORT_PROJECT_DIALOG'
                },
                {
                    actionName: 'create',
                    title: 'NEW_STUDIO_DASHBOARD.NAVIGATION.ALL_PROJECTS.ACTIONS.CREATE',
                    handler: 'CREATE_PROJECT_DIALOG'
                }
            ]
        },
        {
            header_label: 'ADV_EXAMPLE_PROJECTS.NAVIGATION.HEADER_LABEL',
            label: 'ADV_EXAMPLE_PROJECTS.NAVIGATION.LABEL',
            title: 'ADV_EXAMPLE_PROJECTS.NAVIGATION.TOOLTIP',
            disabled: false,
            route: {
                url: '/example-projects'
            }
        }],
    contentModels: [
        {
            header_label: 'NEW_STUDIO_DASHBOARD.NAVIGATION.SHARED_MODELS.HEADER_LABEL',
            label: 'NEW_STUDIO_DASHBOARD.NAVIGATION.SHARED_MODELS.LABEL',
            title: 'NEW_STUDIO_DASHBOARD.NAVIGATION.SHARED_MODELS.TOOLTIP',
            disabled: false,
            route: {
                url: '/global-models'
            },
            actions: [
                {
                    actionName: 'create',
                    title: 'NEW_STUDIO_DASHBOARD.NAVIGATION.SHARED_MODELS.ACTIONS.CREATE',
                    handler: 'CREATE_GLOBAL_PROJECT_MODE'
                }
            ]
        }],
    dataModels: [
        {
            header_label: 'NEW_STUDIO_DASHBOARD.NAVIGATION.DATA_MODELS.HEADER_LABEL',
            label: 'NEW_STUDIO_DASHBOARD.NAVIGATION.DATA_MODELS.LABEL',
            title: 'NEW_STUDIO_DASHBOARD.NAVIGATION.DATA_MODELS.TOOLTIP',
            disabled: false,
            route: {
                url: '/global-data-models'
            },
            actions: [
                {
                    actionName: 'create',
                    title: 'NEW_STUDIO_DASHBOARD.NAVIGATION.DATA_MODELS.ACTIONS.CREATE',
                    handler: 'CREATE_GLOBAL_DATA_MODEL'
                }
            ]
        }]
};

@Component({
    templateUrl: './main-navigation.component.html',
    styleUrls: ['./main-navigation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNavigationComponent {
    navigation = navigationData;
}

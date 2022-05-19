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

import { PluginRoutesManagerService } from './plugin-routes-manager.service';
import { TestBed } from '@angular/core/testing';
import { RouterModule, Router, Route } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { MatButtonModule, MatButton } from '@angular/material/button';

describe('PluginRoutesManagerService', () => {

    const INJECTION_POINT = 'INJECTION_POINT',
        ANOTHER_INJECTION_POINT = 'ANOTHER_INJECTION_POINT';

    let projectsPath: Route;
    let dashboardPath: Route;
    let processesPath: Route;
    let connectorsPath: Route;
    let kittensPath: Route;

    let service: PluginRoutesManagerService;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                MatButtonModule
            ],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/' }
            ]
        });
    });

    beforeEach(() => {
        service = TestBed.inject(PluginRoutesManagerService);
        router = TestBed.inject(Router);

        projectsPath = { path: 'projects', data: {}, component: MatButton };
        dashboardPath = { path: 'dashboard', component: MatButton };
        processesPath = { path: 'processes', data: { injectTo: INJECTION_POINT }, component: MatButton };
        connectorsPath = { path: 'connectors', data: { injectTo: INJECTION_POINT }, component: MatButton };
        kittensPath = { path: 'kittens', data: { injectTo: ANOTHER_INJECTION_POINT }, component: MatButton };
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should remove all routes from the root, which has the data of { injectTo: ... }', () => {
        router.resetConfig([
            processesPath,
            projectsPath,
            kittensPath,
            dashboardPath
        ]);

        service.patchRoutes();

        expect(router.config.length).toBe(2);
        expect(router.config[0]).toEqual(projectsPath);
        expect(router.config[1]).toEqual(dashboardPath);
    });

    it('should inject the previously routes to their right destination', () => {
        router.resetConfig([
            processesPath,
            {
                path: 'project-editor',
                data: { hostFor: INJECTION_POINT },
                children: [
                    {
                        path: 'one-path',
                        component: MatButton
                    }
                ]
            },
            dashboardPath
        ]);

        service.patchRoutes();

        expect(router.config.length).toBe(2);
        expect(router.config[1]).toEqual(dashboardPath);
        expect(router.config[0].children.length).toBe(2);
        expect(router.config[0].children[0].path).toEqual('one-path');
        expect(router.config[0].children[1]).toEqual(processesPath);
    });

    it('should inject the previously routes to their right destination [root level, one host]', () => {
        router.resetConfig([
            processesPath,
            {
                path: 'project-editor',
                data: { hostFor: INJECTION_POINT },
                children: [
                    {
                        path: 'one-path',
                        component: MatButton
                    }
                ]
            },
            dashboardPath,
            kittensPath,
            connectorsPath
        ]);

        service.patchRoutes();

        expect(router.config.length).toBe(2);
        expect(router.config[1]).toEqual(dashboardPath);
        expect(router.config[0].children.length).toBe(3);
        expect(router.config[0].children[0].path).toEqual('one-path');
        expect(router.config[0].children[1]).toEqual(processesPath);
        expect(router.config[0].children[2]).toEqual(connectorsPath);
    });

    it('should inject the previously routes to their right destination [root level, multiple hosts]', () => {
        router.resetConfig([
            processesPath,
            {
                path: 'project-editor',
                data: { hostFor: INJECTION_POINT },
                children: [
                    {
                        path: 'one-path',
                        component: MatButton
                    }
                ]
            },
            {
                path: 'kittens-editor',
                data: { hostFor: ANOTHER_INJECTION_POINT },
                children: []
            },
            kittensPath,
            connectorsPath
        ]);

        service.patchRoutes();

        expect(router.config.length).toBe(2);
        expect(router.config[0].children.length).toBe(3);
        expect(router.config[0].children[0].path).toEqual('one-path');
        expect(router.config[0].children[1]).toEqual(processesPath);
        expect(router.config[0].children[2]).toEqual(connectorsPath);
        expect(router.config[1].children.length).toBe(1);
        expect(router.config[1].children[0]).toEqual(kittensPath);
    });

    it('should inject plugin routes into a deeper level also', () => {
        router.resetConfig([
            processesPath,
            {
                path: 'project-editor',
                children: [
                    {
                        path: 'another-level',
                        children: [
                            {
                                path: 'not-host-route',
                                component: MatButton
                            },
                            {
                                path: 'and-yet-another-level',
                                data: { hostFor: INJECTION_POINT },
                                children: [
                                    {
                                        path: 'one-path',
                                        component: MatButton
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]);

        service.patchRoutes();

        expect(router.config.length).toBe(1);
        const lowestLevelChildren = router.config[0].children[0].children[1].children;

        expect(lowestLevelChildren.length).toBe(2);
        expect(lowestLevelChildren[0].path).toEqual('one-path');
        expect(lowestLevelChildren[1]).toEqual(processesPath);
    });
});

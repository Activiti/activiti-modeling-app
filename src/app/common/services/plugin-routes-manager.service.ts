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
import { Router, Route } from '@angular/router';
const cloneDeep = require('lodash/cloneDeep');

const TARGET_PROPERTY = 'injectTo',
    HOST_PROPERTY = 'hostFor';

@Injectable({ providedIn: 'root' })
export class PluginRoutesManagerService {
    constructor(private router: Router) {}

    patchRoutes(): void {
        const pluginRoutes = this.router.config.filter(this.isPluginRoute),
            projectRoutes = this.router.config.filter(route => !this.isPluginRoute(route));

        const routes = this.injectPluginRoutes(projectRoutes, pluginRoutes);
        this.router.resetConfig(routes);
    }

    private injectPluginRoutes(routes: Route[], pluginRoutes: Route[]) {
        return routes.map(projectRoute => {
            const route = cloneDeep(projectRoute);
            const hostFor = route.data && route.data[HOST_PROPERTY];

            if (route.children) {
                route.children = this.injectPluginRoutes(route.children, pluginRoutes);
            }

            if (hostFor) {
                const pluginRoutesToInject = this.getRoutesForHost(hostFor, pluginRoutes);
                route.children = route.children.concat(pluginRoutesToInject);
            }

            return route;
        });
    }

    private isPluginRoute (route: Route) {
        return route.data && route.data[TARGET_PROPERTY];
    }

    private getRoutesForHost(hostFor: string, pluginRoutes: Route[]) {
        return pluginRoutes.filter(pluginRoute => {
            return pluginRoute.data[TARGET_PROPERTY] === hostFor;
        });
    }
}

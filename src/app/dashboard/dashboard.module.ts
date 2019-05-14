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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './router/dashboard-routing.module';

import { CoreModule } from '@alfresco/adf-core';
import { MomentModule } from 'ngx-moment';

import { DashboardNavigationComponent } from './components/dahboard-navigation/dashboard-navigation.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';

import { DashboardService } from './services/dashboard.service';
import { StoreModule } from '@ngrx/store';
import { dashboardReducer } from './store/reducers/dashboard.reducer';
import { DASHBOARD_STATE_NAME } from './store/selectors/dashboard.selectors';
import { EffectsModule } from '@ngrx/effects';
import { ProjectsEffects } from './store/effects/projects.effects';
import { SharedModule } from 'ama-sdk';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
    imports: [
        CommonModule,
        MomentModule,
        DashboardRoutingModule,
        MatPaginatorModule,
        CoreModule.forChild(),
        SharedModule,
        StoreModule.forFeature(DASHBOARD_STATE_NAME, dashboardReducer),
        EffectsModule.forFeature([ProjectsEffects])
    ],
    declarations: [
        DashboardNavigationComponent,
        ProjectsListComponent,
    ],
    exports: [DashboardRoutingModule],
    providers: [DashboardService]
})
export class DashboardModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './router/dashboard-routing.module';

import { CoreModule } from '@alfresco/adf-core';
import { MomentModule } from 'ngx-moment';

import { DashboardNavigationComponent } from './components/dahboard-navigation/dashboard-navigation.component';
import { ApplicationsListComponent } from './components/applications-list/applications-list.component';

import { DashboardService } from './services/dashboard.service';
import { StoreModule } from '@ngrx/store';
import { dashboardReducer } from './store/reducers/dashboard.reducer';
import { DASHBOARD_STATE_NAME } from './store/selectors/dashboard.selectors';
import { EffectsModule } from '@ngrx/effects';
import { ApplicationsEffects } from './store/effects/applications.effects';
import { SharedModule } from '../common/shared.module';

@NgModule({
    imports: [
        CommonModule,
        MomentModule,
        DashboardRoutingModule,
        CoreModule,
        SharedModule,
        StoreModule.forFeature(DASHBOARD_STATE_NAME, dashboardReducer),
        EffectsModule.forFeature([ApplicationsEffects])
    ],
    declarations: [
        DashboardNavigationComponent,
        ApplicationsListComponent,
    ],
    exports: [DashboardRoutingModule],
    providers: [DashboardService]
})
export class DashboardModule {}

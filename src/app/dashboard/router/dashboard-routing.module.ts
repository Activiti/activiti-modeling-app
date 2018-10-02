import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
// import { dashboardRoutes } from './dashboard.routes';
import { ApplicationsLoaderGuard } from './guards/applications-loader.guard';

@NgModule({
    imports: [
        // Impossible to lazily load ADF modules, that is why the hack
        RouterModule.forChild([])
        // RouterModule.forChild(dashboardRoutes)
    ],
    providers: [
        ApplicationsLoaderGuard
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardRoutingModule { }

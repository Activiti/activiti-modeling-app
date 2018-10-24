import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ApplicationLoaderGuard } from './guards/application-loader.guard';
import { ProcessesLoaderGuard } from './guards/processes-loader.guard';
import { SelectedApplicationSetterGuard } from './guards/selected-application-setter.guard';

@NgModule({
    imports: [
        // Impossible to lazily load ADF modules, that is why the hack
        RouterModule.forChild([])
        // RouterModule.forChild(applicationEditorRoutes)
    ],
    providers: [
        ApplicationLoaderGuard,
        ProcessesLoaderGuard,
        SelectedApplicationSetterGuard
    ],
    exports: [RouterModule]
})
export class ApplicationEditorRoutingModule {}

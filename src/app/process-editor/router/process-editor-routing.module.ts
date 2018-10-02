import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProcessLoaderGuard } from './guards/process-loader.guard';
import { UnsavedPageGuard } from '../../common/helpers/unsaved-page.guard';
import { ProcessDeactivateGuard } from './guards/process-deactivate.guard';

@NgModule({
    imports: [
        // Impossible to lazily load ADF modules, that is why the hack
        RouterModule.forChild([])
    ],
    providers: [ UnsavedPageGuard, ProcessLoaderGuard, ProcessDeactivateGuard ],
    exports: [ RouterModule ]
})
export class ProcessEditorRoutingModule {}

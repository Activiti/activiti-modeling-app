import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CoreModule } from '@alfresco/adf-core';
import { SharedModule } from '../common/shared.module';
import { ApplicationEditorRoutingModule } from './router/application-editor-routing.module';
import { ApplicationEffects } from './store/effects/application.effects';
import { ProcessesEffects } from './store/effects/processes.effects';
import { APPLICATION_EDITOR_STATE_NAME } from './store/selectors/application-editor.selectors';
import { applicationDataReducer as application } from './store/reducers/application-data.reducer';
import { applicationTreeReducer as tree } from './store/reducers/application-tree.reducer';
import { ApplicationContentComponent } from './components/application-content/application-content.component';
import { ApplicationNavigationComponent } from './components/application-navigation/application-navigation.component';
import { ApplicationTreeComponent } from './components/application-tree/application-tree.component';
import { UploadFileButtonComponent } from './components/upload-file-button/upload-file-button.component';
import { ApplicationTreeFilterComponent } from './components/application-tree/application-tree-module-filter/application-tree-filter.component';
import { ApplicationEditorService } from './services/application-editor.service';
import { ApplicationTreeHelper } from './components/application-tree/application-tree.helper';
import { ProcessesFilterDataAdapter } from './components/application-tree/data-adapters/processes-filter.data-adapter';
import { ApplicationTreeIconsComponent } from './components/application-tree/application-tree-icons/application-tree-icons.component';

@NgModule({
    imports: [
        CommonModule,
        ApplicationEditorRoutingModule,
        CoreModule,
        SharedModule,
        StoreModule.forFeature(APPLICATION_EDITOR_STATE_NAME, { application, tree }),
        EffectsModule.forFeature([ApplicationEffects, ProcessesEffects])
    ],
    declarations: [
        ApplicationContentComponent,
        ApplicationNavigationComponent,
        ApplicationTreeComponent,
        ApplicationTreeFilterComponent,
        UploadFileButtonComponent,
        ApplicationTreeIconsComponent
    ],
    exports: [ApplicationEditorRoutingModule],
    providers: [
        ApplicationEditorService,
        ApplicationTreeHelper,
        ProcessesFilterDataAdapter
    ]
})
export class ApplicationEditorModule {}

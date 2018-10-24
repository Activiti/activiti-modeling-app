import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonEditorModule } from 'ama-sdk';
import { CoreModule } from '@alfresco/adf-core';
import { ProcessVariablesComponent } from './process-variables.component';
import { PropertiesViwerComponent } from './properties-viewer/properties-viewer.component';
import { ProcessVariablesService } from './process-variables.service';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        JsonEditorModule
    ],
    declarations: [
        ProcessVariablesComponent,
        PropertiesViwerComponent
    ],
    entryComponents: [ProcessVariablesComponent],
    providers: [
        ProcessVariablesService
    ]
})
export class ProcessVariablesModule {}

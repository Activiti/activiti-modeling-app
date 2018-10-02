import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { JsonEditorComponent } from './components/json-editor/json-editor.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MonacoEditorModule.forRoot()
    ],
    declarations: [JsonEditorComponent],
    exports: [
        CommonModule,
        FormsModule,
        MonacoEditorModule,
        JsonEditorComponent
    ]
})
export class JsonEditorModule {}

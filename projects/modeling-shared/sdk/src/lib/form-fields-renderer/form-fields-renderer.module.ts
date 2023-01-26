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
import { FormFieldsRendererSmartComponent } from './components/form-fields-renderer.smart-component';
import { FormFieldsRendererService } from './service/form-fields-renderer.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormRendererFieldErrorMessagePipe } from './pipes/form-renderer-field-error-message.pipe';
import { FormRendererFieldHasErrorPipe } from './pipes/form-renderer-field-has-error.pipe';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    imports: [
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    declarations: [
        FormFieldsRendererSmartComponent,
        FormRendererFieldErrorMessagePipe,
        FormRendererFieldHasErrorPipe
    ],
    providers: [
        FormFieldsRendererService
    ],
    exports: [
        FormFieldsRendererSmartComponent
    ]
})
export class FormFieldsRendererModule {
}

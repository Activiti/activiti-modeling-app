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

/*
 * Public API Surface of ama-sdk
 */

export { CodeEditorModule } from './code-editor.module';
export { CodeEditorPosition, CodeEditorComponent } from './components/code-editor/code-editor.component';
export {
    CodeValidatorService,
    ValidationResponse
} from './services/code-validator.service';
export * from './services/code-editor-service.service';
export * from './helpers/file-uri';
export * from './code-editor.extensions';

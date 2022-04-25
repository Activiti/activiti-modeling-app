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

export * from './model-editor.module';
export * from './commands/public-api';
export * from './services/public-api';
export * from './router/guards/public-api';
export { MODEL_COMMAND_SERVICE_TOKEN } from './components/model-editor/model-editors.token';
export { ModelEditorProxyComponent, ModelEditorRouterData } from './components/model-editor-proxy/model-editor-proxy.component';
export * from './components/model-header-breadcrumb/model-header-breadcrumb-proxy.component';

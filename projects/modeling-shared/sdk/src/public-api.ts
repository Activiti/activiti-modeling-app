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

/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./lib/process-editor/bpmn.d.ts" />
/// <reference path="./lib/process-editor/diagram.d.ts" />

export * from './lib/environment/public-api';
export * from './lib/api/public-api';
export * from './lib/model-editor/public-api';
export * from './lib/code-editor/public-api';
export * from './lib/components/input-mapping-table/public-api';
export * from './lib/components/output-mapping-table/public-api';
export * from './lib/components/variable-mapping/public-api';
export * from './lib/components/mapping-dialog/public-api';
export * from './lib/components/process-name-selector/public-api';
export * from './lib/components/prefer-project-button/public-api';
export * from './lib/components/editor-footer/public-api';
export * from './lib/components/project-collaborators/public-api';
export * from './lib/process-editor/public-api';
export * from './lib/connector-editor/public-api';
export * from './lib/connector-editor/public-api';
export * from './lib/helpers/public-api';
export * from './lib/navigation/public-api';
export * from './lib/i18n/public-api';
export * from './lib/interfaces/public-api';
export * from './lib/process-editor/public-api';
export * from './lib/services/public-api';
export * from './lib/router/public-api';
export * from './lib/store/public-api';
export * from './lib/validators/public-api';
export * from './lib/variables/public-api';
export * from './lib/workbench-layout/public-api';
export * from './lib/project-editor/public-api';
export * from './lib/components/save-as-dialog/public-api';
export * from './lib/components/save-as-project-dialog/public-api';
export * from './lib/components/variable-selectors/public-api';
export * from './lib/components/tab-manager/public-api';

export * from './lib/api-implementations/acm-api/acm-api.module';
export * from './lib/api-implementations/acm-api/request-api.helper';
export * from './lib/api-implementations/acm-api/model-content-serializer';
export * from './lib/api-implementations/acm-api/model-data-extractor';
export * from './lib/api-implementations/acm-api/form-definition';

export * from './lib/services/process-editor-element-variables-provider.service';
export * from './lib/services/process-editor-element-variables.service';

export * from './lib/models/modeling-roles.enum';

// TODO: Remove it ===================================================
export * from './lib/api-implementations/acm-api/content-types';
export * from './lib/api-implementations/acm-api/form-definition';
// TODO: =============================================================

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

export type PROJECT_TYPE = 'project';
export type PROCESS_TYPE = 'process';
export type FORM_TYPE = 'form';
export type CONNECTOR_TYPE = 'connector';
export type DATA_TYPE = 'data';
export type DECISION_TABLE_TYPE = 'decision';
export type UI_TYPE = 'ui';
export type MODEL_TYPE = PROCESS_TYPE | FORM_TYPE | CONNECTOR_TYPE | DATA_TYPE | DECISION_TABLE_TYPE | UI_TYPE;

export const PROJECT: PROJECT_TYPE = 'project';
export const PROCESS: PROCESS_TYPE = 'process';
export const FORM: FORM_TYPE = 'form';
export const CONNECTOR: CONNECTOR_TYPE = 'connector';
export const DATA: DATA_TYPE = 'data';
export const DECISION_TABLE: DECISION_TABLE_TYPE = 'decision';
export const UI: UI_TYPE = 'ui';
export type FilterType = Process | Connector | Form | Data | DecisionTable | Ui;

export interface Project {
    type: PROJECT_TYPE;
    id: string;
    name: string;
    creationDate: Date;
    createdBy: string;
    lastModifiedDate: Date;
    lastModifiedBy: string;
    description: string;
    version: string;
}

export interface Release {
    id: string;
    name: string;
    creationDate: Date;
    createdBy: string;
    lastModifiedDate: Date;
    lastModifiedBy: string;
    version: string;
}

export interface MinimalModelSummary {
    name: string;
    description?: string;
}

export interface Model extends MinimalModelSummary {
    id: string;
    description: string;
    version: string;
    applicationId?: string; // To remove, since BE finally returns it
    projectId: string;
    type: string;
    creationDate: Date;
    createdBy: string;
    lastModifiedDate: Date;
    lastModifiedBy: string;
}

export interface Process extends Model {
    type: PROCESS_TYPE;
    parentId?: string;
    extensions?: ProcessExtensions;
}

export type ProcessVariableId = string;

export type MappingsType = 'variable' | 'value' | 'static_value';

export interface ServiceParameterMapping {
    [parameterId: string]: {
        type: MappingsType,
        value: string;
    };
}

export interface ServiceParameterMappings {
    inputs?: ServiceParameterMapping;
    outputs?: ServiceParameterMapping;
}

export interface ServicesParameterMappings {
    [serviceTaskId: string]: ServiceParameterMappings;
}

export interface ProcessExtensions {
    properties: EntityProperties;
    mappings: ServicesParameterMappings;
}

export interface EntityProperty {
    id: string;
    name: string;
    type: string;
    required?: boolean;
    value: string;
}

export interface EntityProperties {
    [propertiesId: string]: EntityProperty;
}


export type ProcessContent = string;

export interface Connector extends Model {
    type: CONNECTOR_TYPE;
    template?: string;
}

export interface ConnectorParameter {
    id: string;
    name: string;
    description?: string;
    type: string;
    required?: boolean;
}

export interface ConnectorContent {
    name: string;
    description?: string;
    actions?: ConnectorActionData;
    template?: string;
}

export interface ConnectorActionData {
    [actionId: string]: ConnectorAction;
}

export interface ConnectorAction {
    id: string;
    name: string;
    description?: string;
    inputs?: ConnectorParameter[];
    outputs?: ConnectorParameter[];
}

export interface Form extends Model {
    type: FORM_TYPE;
}

export interface FormContent {
    formRepresentation: FormRepresentation;
}

export interface FormRepresentation {
    id: string;
    name: string;
    description: string;
    version?: number;
    formDefinition?: FormDefinition;
}

export interface FormTab {
    id: string;
    title: string;
    visibilityCondition: string | null;
}

export interface FormOutcome {
    id: string;
    name: string;
}

export interface FormDefinition {
    tabs: FormTab[];
    fields: any[];
    outcomes: FormOutcome[];
    metadata: {};
    variables: EntityProperties[];
}

export interface UiPlugin {
    name: string;
    version: string;
    order: string;
}

export interface UiContent {
    id: string;
    name: string;
    description?: string;
    'adf-template': string;
    plugins: UiPlugin[];
    configs?: any;
}

export interface Ui extends Model {
    type: UI_TYPE;
}

export interface DataContent {
    id: string;
    name: string;
    description?: string;
}

export type DecisionTableContent = string;

export interface Data extends Model {
    type: DATA_TYPE;
}

export interface DecisionTable extends Model {
    type: DECISION_TABLE_TYPE;
}

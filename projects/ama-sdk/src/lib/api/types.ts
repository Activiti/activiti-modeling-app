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
export type CUSTOM_MODEL_TYPE = 'model';
export type PROCESS_TYPE = 'process';
export type FORM_TYPE = 'form';
export type CONNECTOR_TYPE = 'connector';
export type DATA_TYPE = 'data';
export type DECISION_TABLE_TYPE = 'decision';
export type UI_TYPE = 'ui';
export type FILE_TYPE = 'file';
export type SCRIPT_TYPE = 'script';
export type MODEL_TYPE = PROCESS_TYPE | FORM_TYPE | CONNECTOR_TYPE | DATA_TYPE | DECISION_TABLE_TYPE | UI_TYPE | FILE_TYPE | SCRIPT_TYPE;

export const PROJECT: PROJECT_TYPE = 'project';
export const CUSTOM_MODEL: CUSTOM_MODEL_TYPE = 'model';
export const PROCESS: PROCESS_TYPE = 'process';
export const FORM: FORM_TYPE = 'form';
export const CONNECTOR: CONNECTOR_TYPE = 'connector';
export const DATA: DATA_TYPE = 'data';
export const DECISION_TABLE: DECISION_TABLE_TYPE = 'decision';
export const UI: UI_TYPE = 'ui';
export const FILE: FILE_TYPE = 'file';
export const SCRIPT: SCRIPT_TYPE = 'script';

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

export type CustomModelStatus = 'ACTIVE' | 'DRAFT';
export const ACTIVE_STATUS: CustomModelStatus = 'ACTIVE';
export const INACTIVE_STATUS: CustomModelStatus = 'DRAFT';

export interface CustomModel {
    type: CUSTOM_MODEL_TYPE;
    name: string;
    namespacePrefix: string;
    description: string;
    author: string;
    namespaceUri: string;
    status: CustomModelStatus;
}

export interface CustomType {
    name: string;
    parentName: string;
    title: string;
    description?: string;
}

export interface CustomAspect {
    name: string;
    parentName: string;
    title: string;
    description?: string;
}

export interface ApiError {
    errorKey?: string;
    statusCode: number;
    briefSummary: string;
    stackTrace: string;
    descriptionURL: string;
    logId?: string;
}

export interface ApiErrorResponse {
    error: ApiError;
}

export interface ReleaseEntry {
    entry: Release;
}

export interface Release {
    id: string;
    name: string;
    creationDate: Date;
    createdBy: string;
    lastModifiedDate: Date;
    lastModifiedBy: string;
    version?: string;
    projectName?: string;
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

export interface Filter extends Model {
    icon?: string;
}

export interface Process extends Model {
    type: PROCESS_TYPE;
    extensions?: ProcessExtensionsContent;
}

export type ProcessVariableId = string;

export enum MappingType {
    variable = 'variable',
    value = 'value',
    static = 'static_value'
}
export type ConnectorActionInputParameter = string;
export type ConnectorActionOutputParameterName = string;

export interface ServiceInputParameterMapping {
    [parameterName: string]: {
        type: MappingType,
        value: ConnectorActionInputParameter;
    };
}

export interface ServiceOutputParameterMapping {
    [variableName: string]: {
        type: MappingType.variable,
        value: ConnectorActionOutputParameterName;
    };
}

export interface ServiceParameterMappings {
    inputs?: ServiceInputParameterMapping;
    outputs?: ServiceOutputParameterMapping;
}

export interface ServicesParameterMappings {
    [serviceTaskId: string]: ServiceParameterMappings;
}

export interface ServicesConstants {
    [serviceTaskId: string]: ServicesParameterConstants;
}

export interface ServicesParameterConstants {
    [type: string]: {
        value: string;
    };
}

export interface ProcessExtensionsContent {
    properties: EntityProperties;
    mappings: ServicesParameterMappings;
    constants: ServicesConstants;
}

export interface ProcessExtensions {
    id: string;
    extensions: ProcessExtensionsContent;
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
    actions?: ConnectorFeatureData;
    events?: ConnectorFeatureData;
    template?: string;
}

export interface ConnectorFeatureData {
    [actionId: string]: ConnectorFeature;
}

export interface ConnectorFeature {
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
    standAlone?: boolean;
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

export interface Pagination {
    count: number;
    hasMoreItems: boolean;
    maxItems: number;
    skipCount: number;
    totalItems: number;
}

export interface PaginatedEntries<T> {
    entries: T[];
    pagination: Pagination;
}

export interface PaginatedList<T> {
    list: {
        entries: Array<{ entry: T }>;
        pagination: Pagination;
    };
}

export interface ServerSideSorting {
    key: string;
    direction: string;
}

export interface SearchQuery {
    key: string;
    value: string;
}

export interface ErrorResponse {
    status: number;
    message: string;
 }

 export interface FileModel {
    content: ActivitiFileContent;
    model: ActivitiFile;
}

export type ActivitiFileContent = string;

export interface ActivitiFile extends Model {
    type: FILE_TYPE;
    extensions: FileExtensions;
}

export interface FileExtensions {
    id: string;
    uri: string;
    name?: string;
    content?: FileExtensionsContent;
    createdAt?: Date;
}

export interface FileExtensionsContent {
    mimeType?: string;
    mimeTypeName?: string;
    sizeInBytes?: number;
    encoding?: string;
}

export interface ScriptModel {
    content: ActivitiScriptContent;
    model: ActivitiScript;
}

export type ActivitiScriptContent = string;

export interface ActivitiScript extends Model {
    type: SCRIPT_TYPE;
    extensions: ScriptExtensions;
}

export interface ScriptExtensions {
    uri: string;
    name?: string;
    content?: ScriptExtensionsContent;
    createdAt?: Date;
    language: string;
    variables?: EntityProperty[];

}

export interface ScriptExtensionsContent {
    mimeType?: string;
    mimeTypeName?: string;
    sizeInBytes?: number;
    encoding?: string;
}
export interface MessagePayload {
    type: string;
    value: string | number | null;
    name: string;
}

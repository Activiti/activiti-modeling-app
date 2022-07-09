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

/* eslint-disable max-lines */

import { VariableMappingBehavior } from '../interfaces/variable-mapping-type.interface';

export type PROJECT_TYPE = 'project';
export type CUSTOM_MODEL_TYPE = 'model';
export type PROCESS_TYPE = 'process';
export type FORM_TYPE = 'form';
export type CONNECTOR_TYPE = 'connector';
export type DECISION_TABLE_TYPE = 'decision';
export type UI_TYPE = 'ui';
export type FILE_TYPE = 'file';
export type SCRIPT_TYPE = 'script';
export type TRIGGER_TYPE = 'trigger';
export type FORM_WIDGET_TYPE = 'custom-form-widget';
export type DATA_TYPE = 'data';
export type AUTHENTICATION_TYPE = 'authentication';
export type HXP_DOC_TYPE = 'hxp-document-type';
export type HXP_MIXIN = 'hxp-mixin';
export type HXP_SCHEMA = 'hxp-schema';
export type MODEL_TYPE = PROCESS_TYPE | FORM_TYPE | CONNECTOR_TYPE | DECISION_TABLE_TYPE | UI_TYPE | FILE_TYPE | SCRIPT_TYPE | TRIGGER_TYPE | CUSTOM_MODEL_TYPE
| FORM_WIDGET_TYPE | DATA_TYPE | AUTHENTICATION_TYPE | HXP_DOC_TYPE | HXP_MIXIN | HXP_SCHEMA;

export const PROJECT: PROJECT_TYPE = 'project';
export const CUSTOM_MODEL: CUSTOM_MODEL_TYPE = 'model';
export const PROCESS: PROCESS_TYPE = 'process';
export const FORM: FORM_TYPE = 'form';
export const CONNECTOR: CONNECTOR_TYPE = 'connector';
export const DECISION_TABLE: DECISION_TABLE_TYPE = 'decision';
export const UI: UI_TYPE = 'ui';
export const FILE: FILE_TYPE = 'file';
export const SCRIPT: SCRIPT_TYPE = 'script';
export const TRIGGER: TRIGGER_TYPE = 'trigger';
export const FORM_WIDGET: FORM_WIDGET_TYPE = 'custom-form-widget';
export const DATA: DATA_TYPE = 'data';
export const AUTHENTICATION: AUTHENTICATION_TYPE = 'authentication';
export const HXP_DOC_TYPE: HXP_DOC_TYPE = 'hxp-document-type';
export const HXP_MIXIN: HXP_MIXIN = 'hxp-mixin';
export const HXP_SCHEMA: HXP_SCHEMA = 'hxp-schema';

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
    favorite: boolean;
}

export type CustomModelStatus = 'ACTIVE' | 'DRAFT';
export const ACTIVE_STATUS: CustomModelStatus = 'ACTIVE';
export const INACTIVE_STATUS: CustomModelStatus = 'DRAFT';

export interface CustomTypePayload {
    name: string;
    parentName: string;
    title: string;
    description?: string;
}

export interface CustomAspectPayload {
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

export interface CollaboratorEntry {
    entry: Collaborator;
}

export interface Release {
    id: string;
    name: string;
    creationDate?: Date;
    createdBy?: string;
    lastModifiedDate?: Date;
    lastModifiedBy?: string;
    version?: string;
    projectName?: string;
    projectId?: string;
    imported?: boolean;
    comment?: string;
}

export interface Collaborator {
    createdBy: string;
    id: string;
    projectId: string;
    username: string;
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
    type: MODEL_TYPE;
    creationDate: Date;
    createdBy: string;
    lastModifiedDate: Date;
    lastModifiedBy: string;
    projectIds: string[];
    scope: ModelScope;
}

export enum ModelScope {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    PROJECT = 'PROJECT',
    GLOBAL = 'GLOBAL'
}

export interface Filter extends Model {
    icon?: string;
    category?: string;
}

export interface Process extends Model {
    type: PROCESS_TYPE;
    category: string;
    extensions?: ModelExtensions;
}

export type ProcessVariableId = string;

export enum MappingType {
    variable = 'variable',
    value = 'value',
    static = 'static_value'
}

export interface ServiceParameterMapping {
    [name: string]: {
        type: MappingType;
        value: any;
    };
}

export interface ServiceParameterMappings {
    inputs?: ServiceParameterMapping;
    outputs?: ServiceParameterMapping;
    mappingType?: VariableMappingBehavior;
}

export interface ServicesParameterMappings {
    [serviceTaskId: string]: ServiceParameterMappings;
}

export interface ServicesConstants {
    [serviceTaskId: string]: ServicesParameterConstants;
}

export interface ServicesParameterConstants {
    [type: string]: {
        value?: string;
    };
}

export enum AssignmentMode {
    candidates = 'candidates',
    assignee = 'assignee'
}

export enum AssignmentType {
    static = 'static',
    identity = 'identity',
    expression = 'expression'
}

export interface TaskAssignment {
    id: string;
    type: AssignmentType;
    assignment: AssignmentMode;
}

export interface TaskAssignmentContent {
    [serviceTaskId: string]: TaskAssignment;
}

export interface TaskTemplates {
    [userTaskId: string]: TaskTemplateMapping;
}

export enum TaskTemplateType {
    file = 'file',
    variable = 'variable'
}

export interface TaskTemplate {
    type: TaskTemplateType;
    value: string;
    from: string;
    subject: string;
}
export interface TaskTemplateMapping {
    assignee?: TaskTemplate;
    candidate?: TaskTemplate;
}

export interface TaskTemplateContent {
    tasks?: TaskTemplates;
    default?: TaskTemplateMapping;
}

export interface ProcessExtensionsContent {
    properties: EntityProperties;
    mappings: ServicesParameterMappings;
    constants: ServicesConstants;
    assignments?: TaskAssignmentContent;
    templates?: TaskTemplateContent;
}

export interface ProcessExtensions {
    id: string;
    extensions: ProcessExtensionsContent;
}

export interface ModelExtensions {
    [processID: string]: ProcessExtensionsContent;
}

export interface EntityProperty {
    id: string;
    name: string;
    label?: string;
    display?: boolean;
    displayName?: string;
    type: string;
    model?: JSONSchemaInfoBasics;
    required?: boolean;
    value?: string;
    description?: string;
    readOnly?: boolean;
    placeholder?: string;
    aggregatedTypes?: string[];
}

export interface EntityProperties {
    [propertiesId: string]: EntityProperty;
}

export type ProcessContent = string;

export interface Connector extends Model {
    type: CONNECTOR_TYPE;
    template?: string;
}

export interface ConnectorConfigParameter {
    name: string;
    description?: string;
    required?: boolean;
    secure?: boolean;
    value: string;
}

export interface ConnectorError {
    name: string;
    description?: string;
    code?: string;
}

export interface ConnectorParameter extends EntityProperty {
    mappingValueType?: string;
}
export interface ConnectorContent {
    name: string;
    description?: string;
    actions?: ConnectorFeatureData;
    events?: ConnectorFeatureData;
    config?: ConnectorConfigParameter[];
    errors?: ConnectorError[];
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
    model?: any;
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
    confirmMessage?: ConfirmMessage;
    standAlone?: boolean;
    contentForm?: boolean;
    contentType?: string;
    updateMetadataOnSubmit?: boolean;
    leftLabels?: boolean;
}

export interface FormTab {
    id: string;
    title: string;
    visibilityCondition: any;
}

export interface FormOutcome {
    id: string;
    name: string;
}

export interface FormDefinition {
    tabs: FormTab[];
    fields: any[];
    outcomes: FormOutcome[];
    metadata: any;
    variables: EntityProperties[];
    rules?: any;
}

export interface ConfirmMessage {
    show: boolean;
    message: string;
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
    extension?: UiContentExtension;
}

export interface UiContentExtension {
    $id: string;
    $name: string;
    $version: string;
    $vendor: string;
    $license: string;
    $description?: string;
    appConfig?: any;
    actions?: UiAction[];
    rules?: UiRule[];
    features?: UiFeatures;
}

export interface UiRule {
    type: UiRuleType;
    id?: string;
    value?: string;
    parameters?: Array<UiRule>;
}

export enum UiRuleType {
    NOT = 'core.not',
    EVERY = 'core.every',
    SOME = 'core.some',
    RULE = 'rule',
    VALUE = 'value',
    ARGUMENT = 'argument',
    OPERATOR = 'operator'
}

export interface UiAction {
    id: string;
    type: string;
    payload: any;
}

export interface UiFeatures {
    userActions?: UiFeature[];
    header?: UiFeature[];
    create?: UiFeature[];
    toolbar?: UiFeature[];
    contextMenu?: UiFeature[];
    viewer?: {
        openWith?: UiFeature[];
        toolbarActions?: UiFeature[];
        shared?: {
            toolbarActions?: UiFeature[];
        };
    };
    sidebar?: {
        toolbar: UiFeature[];
    };
}

export interface UiFeature {
    id: string;
    order?: number;
    disabled?: boolean;
    type?: string;
    title?: string;
    description?: string;
    icon?: string;
    children?: Array<UiFeature>;
    component?: string;
    data?: any;
    actions?: {
        click?: string;
        [key: string]: string;
    };
    rules?: {
        enabled?: string;
        visible?: string;
        [key: string]: string;
    };
}

export interface Ui extends Model {
    type: UI_TYPE;
}

export type DecisionTableContent = string;

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

export interface ServerSideSorting {
    key: string;
    direction: string;
}

export interface SearchQuery {
    key: string;
    value: string;
}

export interface FetchQueries {
    skipCount?: number;
    maxItems?: number;
}

export interface ErrorResponse {
    status: number;
    message: string;
    error: ErrorResponse;
}

export interface FileModel {
    content: ActivitiFileContent;
    model: ActivitiFile;
}

export type ActivitiFileContent = File;

export interface ActivitiFile extends Model {
    type: FILE_TYPE;
    extensions: FileExtensions;
}

export enum FileVisibility {
    Public = 'public',
    Private = 'private',
}

export interface FileExtensions {
    id: string;
    uri: string;
    name?: string;
    content?: FileExtensionsContent;
    createdAt?: Date;
    visibility?: FileVisibility;
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
    errors?: ScriptError[];
}

export interface ScriptError {
    name: string;
    code?: string;
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

export interface TriggerEvent {
    source: string;
    inputs: any;
}

export interface TriggerAction {
    source: string;
    payload: any;
}

export interface TriggerContent {
    id: string;
    name: string;
    description?: string;
    event?: TriggerEvent;
    action?: TriggerAction;
}

export interface Trigger extends Model {
    type: TRIGGER_TYPE;
}

export interface ContentModel extends Model {
    type: CUSTOM_MODEL_TYPE;
}

export type ContentModelXML = string;

export interface ProcessDropdownStructure {
    [processName: string]: ProcessInfo[];
}

export interface ProcessInfo {
    processName: string;
    processDefinitionId: string;
    processProperties: EntityProperty[];
}

export interface WidgetContent {
    id?: string;
    name: string;
    description: string;
    type: string;
    isCustomType: boolean;
    valueType: string;
    className: string;
    icon?: string;
}

export interface Widget extends Model {
    type: FORM_WIDGET_TYPE;
    extensions: WidgetContent;
}

export interface Authentication extends Model {
    type: AUTHENTICATION_TYPE;
}

export interface TriggerFeature {
    id: string;
    name: string;
    description?: string;
    inputs?: TriggerParameter[];
    outputs?: TriggerParameter[];
}

export interface TriggerParameter {
    id?: string;
    name: string;
    label?: string;
    description?: string;
    type: string;
    mappingValueType?: string;
    required?: boolean;
    readOnly?: boolean;
    value?: any;
}

export interface JSONSchemaInfoBasics {
    $id?: string;
    anyOf?: JSONSchemaInfoBasics[];
    allOf?: JSONSchemaInfoBasics[];
    oneOf?: JSONSchemaInfoBasics[];
    type?: string | string[] | JSONSchemaInfoBasics[];
    properties?: JSONSchemaPropertyBasics;
    items?: JSONSchemaInfoBasics;
    description?: string;
    $comment?: string;
    $ref?: string;
    $defs?: any;
    default?: any;
    enum?: any[];
    readOnly?: boolean;
    title?: string;
    required?: string[];
    const?: any;
    additionalProperties?: boolean | JSONSchemaInfoBasics;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    multipleOf?: number;
    minimum?: number;
    exclusiveMinimum?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    [key: string]: any;
}

export interface JSONSchemaPropertyBasics {
    [name: string]: JSONSchemaInfoBasics;
}

export enum ProcessEditorElementWithVariables {
    StartEvent = 'START_EVENT',
    Process = 'PROCESS',
    ServiceTask = 'SERVICE_TASK',
    CalledElement = 'CALLED_ELEMENT',
    ScriptTask = 'SCRIPT_TASK',
    DecisionTable = 'DECISION_TABLE',
    EmailServiceTask = 'EMAIL_SERVICE',
    DocgenServiceTask = 'DOCGEN_SERVICE',
    ContentServiceTask = 'CONTENT_SERVICE',
    UserTask = 'USER_TASK',
    Event = 'EVENT',
    Participant = 'PARTICIPANT',
    FormFields = 'FORM_FIELDS',
    FormVariables = 'FORM_VARIABLES'
}

export interface ProcessEditorElementVariable {
    source: {
        name: string;
        type?: ProcessEditorElementWithVariables;
        subtype?: string;
    };
    variables: ElementVariable[];
}

export interface ElementVariable extends EntityProperty {
    icon?: string;
    tooltip?: string;
    onlyForExpression?: boolean;
}

export interface Data extends Model {
    type: DATA_TYPE;
}

export enum ExpressionSyntax {
    JUEL= 'juel',
    NONE = 'none'
}

export interface ReleaseInfo {
    name: string;
    comment?: string;
}

export interface HxPDocumentType extends Model {
    type: HXP_DOC_TYPE;
}

export interface HxPMixin extends Model {
    type: HXP_MIXIN;
}

export interface HxPSchema extends Model {
    type: HXP_SCHEMA;
}

export type APPLICATION_TYPE = 'application';
export type PROCESS_TYPE = 'process';
export type FORM_TYPE = 'form';
export type CONNECTOR_TYPE = 'connector';
export type DATA_TYPE = 'data';
export type DECISION_TABLE_TYPE = 'decision-table';
export type PLUGIN_TYPE = 'plugin';
export type ARTIFACT_TYPE = PROCESS_TYPE | FORM_TYPE | CONNECTOR_TYPE | DATA_TYPE | DECISION_TABLE_TYPE | PLUGIN_TYPE;

export const APPLICATION: APPLICATION_TYPE = 'application';
export const PROCESS: PROCESS_TYPE = 'process';
export const FORM: FORM_TYPE = 'form';
export const CONNECTOR: CONNECTOR_TYPE = 'connector';
export const DATA: DATA_TYPE = 'data';
export const DECISION_TABLE: DECISION_TABLE_TYPE = 'decision-table';
export const PLUGIN: PLUGIN_TYPE = 'plugin';

export interface Application {
    type: APPLICATION_TYPE;
    id: string;
    name: string;
    creationDate: Date;
    createdBy: string;
    lastModifiedDate: Date;
    lastModifiedBy: string;
    description: string;
    version: string;
}

export interface Process {
    type: PROCESS_TYPE;
    id: string;
    name: string;
    creationDate: Date;
    createdBy: string;
    lastModifiedDate: Date;
    lastModifiedBy: string;
    description: string;
    version: string;
    parentId?: string;
    extensions?: ProcessExtensions;
}

export type ProcessVariableId = string;

export interface ServiceParameterMapping {
    [parameterId: string]: ProcessVariableId;
}

export interface ServiceParameterMappings {
    input?: ServiceParameterMapping;
    output?: ServiceParameterMapping;
}

export interface ServicesParameterMappings {
    [serviceTaskId: string]: ServiceParameterMappings;
}

export interface ProcessExtensions {
    properties: ProcessProperties;
    variablesMappings: ServicesParameterMappings;
}

export interface ProcessProperty {
    id: string;
    name: string;
    type: string;
    required: boolean;
    value: string;
}

export interface ProcessProperties {
    [propertiesId: string]: ProcessProperty;
}


export type ProcessDiagramData = string;

export interface Connector {
    type: CONNECTOR_TYPE;
    id: string;
    name: string;
    description: string;
    applicationId: string;
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
    actions?: ConnectorActionData[];
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

export interface FormContent {
    name: string;
    description?: string;
}

export interface Form {
    type: FORM_TYPE;
    id: string;
    name: string;
    description: string;
    applicationId: string;
}

export interface PluginContent {
    name: string;
    description?: string;
}

export interface Plugin {
    type: PLUGIN_TYPE;
    id: string;
    name: string;
    description: string;
    applicationId: string;
}

export interface DataContent {
    name: string;
    description?: string;
}

export interface DecisionTableContent {
    name: string;
    description?: string;
}

export interface Data {
    type: DATA_TYPE;
    id: string;
    name: string;
    description: string;
    applicationId: string;
}

export interface DecisionTable {
    type: DECISION_TABLE_TYPE;
    id: string;
    name: string;
    description: string;
    applicationId: string;
}

export type FilterType = Process | Connector | Form | Data | DecisionTable | Plugin;

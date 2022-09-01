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

import {
    ModelExtensions,
    EntityProperties,
    ServiceParameterMappings,
    TaskAssignmentContent,
    ServicesParameterConstants,
    TaskAssignment,
    ServicesConstants,
    TaskTemplateMapping,
    ProcessExtensionsContent
} from '../api/types';

export function createExtensionsObject(): ProcessExtensionsContent {
    return {
        constants: {},
        mappings: {},
        properties: {},
        assignments: {},
        templates: { tasks: {}, default: {} }
    };
}

export class ProcessExtensionsModel {

    extensions: ModelExtensions;

    constructor(extensions: ModelExtensions) {
        this.extensions = extensions;
    }

    setProperties(processId: string, properties: EntityProperties): ModelExtensions {
        const processExtensions = this.extensions[processId] ? this.extensions[processId] : createExtensionsObject();
        processExtensions.properties = properties;
        this.extensions[processId] = processExtensions;
        return this.extensions;
    }

    getProperties(processId: string): EntityProperties {
        return this.extensions[processId] ? this.extensions[processId].properties : {};
    }

    getAllProperties(): EntityProperties {
        let properties = {};

        Object.keys(this.extensions).map((extensionPropertyKey: string) => {
            if (extensionPropertyKey !== 'constants' && extensionPropertyKey !== 'mappings' && extensionPropertyKey !== 'properties') {
                properties = { ...properties, ...this.extensions[extensionPropertyKey].properties };
            }
        });

        return properties;
    }

    setMappings(processId: string, elementId: string, mappings: ServiceParameterMappings): ModelExtensions {
        const processExtensions = this.extensions[processId] ? this.extensions[processId] : createExtensionsObject();
        processExtensions.mappings[elementId] = mappings;
        this.extensions[processId] = processExtensions;
        return this.extensions;
    }

    getMappings(processId: string): ServiceParameterMappings {
        return this.extensions[processId] ? this.extensions[processId].mappings : {};
    }

    getAllMappings(): ServiceParameterMappings {
        let mappings = {};

        Object.keys(this.extensions).map((extensionPropertyKey: string) => {
            if (extensionPropertyKey !== 'constants' && extensionPropertyKey !== 'mappings' && extensionPropertyKey !== 'properties') {
                mappings = { ...mappings, ...this.extensions[extensionPropertyKey].mappings };
            }
        });

        return mappings;
    }

    setAssignments(processId: string, serviceId: string, assignment: TaskAssignment): ModelExtensions {
        const processExtensions = this.extensions[processId] ? this.extensions[processId] : createExtensionsObject();
        if (processExtensions.assignments === undefined) {
            processExtensions.assignments = {};
        }

        if (Object.values(assignment).length) {
            const currentAssignment = processExtensions.assignments[serviceId];
            if (this.checkAssignmentChange(assignment, currentAssignment)) {
                const existingAssignment = processExtensions.assignments[assignment.id];
                if (this.checkAssignmentCopied(existingAssignment, assignment)) {
                    assignment.id = serviceId;
                    assignment.type = existingAssignment.type;
                }
                processExtensions.assignments[serviceId] = assignment;
            }
        } else {
            delete processExtensions.assignments[serviceId];
        }
        this.extensions[processId] = processExtensions;
        return this.extensions;
    }

    private checkAssignmentCopied(existingAssignment, assignment): boolean {
        return !!existingAssignment &&
            existingAssignment.id === assignment.id &&
            existingAssignment.type === assignment.type;
    }

    private checkAssignmentChange(newAssignmentObj, currentAssignmentObj): boolean {
        return currentAssignmentObj === undefined ||
            newAssignmentObj.id !== currentAssignmentObj.id ||
            newAssignmentObj.assignment !== currentAssignmentObj.assignment ||
            newAssignmentObj.type !== currentAssignmentObj.type ||
            newAssignmentObj.mode !== currentAssignmentObj.mode;
    }

    getAssignments(processId: string): TaskAssignmentContent {
        return this.extensions[processId] ? this.extensions[processId].assignments : {};
    }

    setConstants(processId: string, elementId: string, constants: ServicesParameterConstants): ModelExtensions {
        const processExtensions = this.extensions[processId] ? this.extensions[processId] : createExtensionsObject();
        if (Object.values(constants).length) {
            processExtensions.constants[elementId] = constants;
        } else {
            delete processExtensions.constants[elementId];
        }
        this.extensions[processId] = processExtensions;
        return this.extensions;
    }

    getConstants(processId: string): ServicesConstants {
        return this.extensions[processId] ? this.extensions[processId].constants : {};
    }

    setTemplate(processId: string, userTaskId: string, taskTemplate: TaskTemplateMapping) {
        const processExtensions = this.extensions[processId] ? this.validateTemplateObject(this.extensions[processId]) : createExtensionsObject();

        if (userTaskId) {
            if (taskTemplate.assignee || taskTemplate.candidate) {
                processExtensions.templates.tasks[userTaskId] = taskTemplate;
            } else {
                delete processExtensions.templates.tasks[userTaskId];
            }
        } else {
            if (taskTemplate.assignee || taskTemplate.candidate) {
                processExtensions.templates.default = taskTemplate;
            } else {
                delete processExtensions.templates.default;
            }
        }

        this.extensions[processId] = processExtensions;
        return this.extensions;
    }

    getTemplates(processId: string) {
        return this.extensions[processId]?.templates ? this.extensions[processId].templates : {};
    }

    private validateTemplateObject(processExtensions: ProcessExtensionsContent): ProcessExtensionsContent {
        if (processExtensions.templates === undefined) {
            processExtensions.templates = { tasks: {}, default: {} };
        } else {
            if (processExtensions.templates.tasks === undefined) {
                processExtensions.templates.tasks = {};
            }
            if (processExtensions.templates.default === undefined) {
                processExtensions.templates.default = {};
            }
        }

        return processExtensions;
    }
}

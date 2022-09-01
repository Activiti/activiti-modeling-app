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

import { ProcessExtensionsModel } from './process-extensions.model';
import { AssignmentMode, AssignmentStrategyMode, AssignmentType, EntityProperties, EntityProperty, MappingType, ModelExtensions,
    ServiceParameterMapping, ServiceParameterMappings, ServicesParameterConstants, TaskAssignment, TaskTemplateMapping } from '../api/types';
import { VariableMappingBehavior } from '../interfaces/variable-mapping-type.interface';

describe('ProcessExtensionModel', () => {

    const fakeExtension: ModelExtensions = {
        'Process_kTestFm2': {
            'constants': {},
            'mappings': {
                'Task_0da4yvh': {
                    'outputs': {
                        'int_boundary_sub_var': {
                            'type': 'variable',
                            'value': 'StringCorr'
                        }
                    }
                }
            },
            'properties': {
                '173e5d72-279c-485c-b86d-84804a01f024': {
                    'id': '173e5d72-279c-485c-b86d-84804a01f024',
                    'name': 'int_boundary_sub_var',
                    'type': 'string',
                    'value': '',
                    'required': false
                },
                'a41ad7dc-8d94-45a0-bda8-80f9dda93951': {
                    'id': 'a41ad7dc-8d94-45a0-bda8-80f9dda93951',
                    'name': 'test',
                    'type': 'string',
                    'value': '',
                    'required': false
                }
            },
            'assignments': {
                'Task_0da4yvh': {
                    'type': 'identity',
                    'assignment': 'assignee',
                    'id': 'Task_0da4yvh'
                },
                'Task_1c5nd8z': {
                    'type': 'identity',
                    'assignment': 'assignee',
                    'id': 'Task_1c5nd8z'
                }
            }
        },
        'SubProcess_0wal67l': {
            'constants': {},
            'mappings': {},
            'properties': {
                '1231234124-124124124-1241-24-124124124': {
                    'id': '1231234124-124124124-1241-24-124124124',
                    'name': 'banana_var',
                    'type': 'string',
                    'value': '',
                    'required': false
                }
            },
            'assignments': {
                'Task_110130': {
                    'type': 'identity',
                    'assignment': 'assignee',
                    'id': 'Task_110130'
                }
            }
        }
    };

    const emptyModelExtension: ModelExtensions = {};

    let processExtension: ProcessExtensionsModel;

    beforeEach(() => {
        processExtension = null;
        processExtension = new ProcessExtensionsModel(fakeExtension);
    });

    it('It should create the extension structure when empty when a property is set', () => {
        const processExtensionEmpty: ProcessExtensionsModel = new ProcessExtensionsModel(emptyModelExtension);
        const fakeProperty: EntityProperty = <EntityProperty>{ id: 'fake-property' };
        const fakeProperties: EntityProperties = { 'fake-a': fakeProperty };
        processExtensionEmpty.setProperties('fake-process-id', fakeProperties);
        expect(processExtensionEmpty.getProperties('fake-process-id')).toEqual(fakeProperties);
    });

    it('It get the properties for a specific process id', () => {
        expect(processExtension.getProperties('Process_kTestFm2')).toBe(fakeExtension['Process_kTestFm2'].properties);
    });

    it('It get the properties for all the processes involved', () => {
        const checkProperties = { ...fakeExtension['Process_kTestFm2'].properties, ...fakeExtension['SubProcess_0wal67l'].properties };
        expect(processExtension.getAllProperties()).toEqual(checkProperties);
    });

    it('should return all the mappings', () => {
        const fakeAllMAppings = { ...fakeExtension['Process_kTestFm2'].mappings, ...fakeExtension['SubProcess_0wal67l'].mappings };
        expect(processExtension.getAllMappings()).toEqual(fakeAllMAppings);
    });

    it('It should set the mapping for an element of a process', () => {
        const input: ServiceParameterMapping = { 'fakeInput': { type: MappingType.static, value: '1' } };
        const output: ServiceParameterMapping = { 'fakeOutput': { type: MappingType.value, value: '0' } };
        const mapType: VariableMappingBehavior = VariableMappingBehavior.MAP_ALL;
        const fakeMapping: ServiceParameterMappings = { inputs: input, outputs: output, mappingType: mapType };
        processExtension.setMappings('fake_process', 'fake_element', fakeMapping);
        expect(processExtension.getMappings('fake_process')).toStrictEqual({ 'fake_element': fakeMapping });
    });

    it('It should set an assignment element for a process', () => {
        const fakeAssignment: TaskAssignment = {
            id: 'fake-assign-id-1', assignment: AssignmentMode.assignee, type: AssignmentType.static, mode: AssignmentStrategyMode.sequential
        };
        processExtension.setAssignments('fake-assign-process', 'fake-assign-service-id', fakeAssignment);
        expect(processExtension.getAssignments('fake-assign-process')).toStrictEqual({ 'fake-assign-service-id': fakeAssignment });
    });

    it('It should override the current assignment when a new one steps in for a service/the same process service combination', () => {
        const fakeAssignment: TaskAssignment = {
            id: 'fake-assign-id-1', assignment: AssignmentMode.assignee, type: AssignmentType.static, mode: AssignmentStrategyMode.sequential
        };
        const fakeAssignmentOverride: TaskAssignment = {
            id: 'fake-assign-id-2', assignment: AssignmentMode.candidates, type: AssignmentType.identity, mode: AssignmentStrategyMode.manual
        };
        processExtension.setAssignments('fake-assign-process', 'fake-assign-service-id', fakeAssignment);
        processExtension.setAssignments('fake-assign-process', 'fake-assign-service-id', fakeAssignmentOverride);
        expect(processExtension.getAssignments('fake-assign-process')).toStrictEqual({ 'fake-assign-service-id': fakeAssignmentOverride });
    });

    it('It should set a constant element for a process', () => {
        const fakeConstants: ServicesParameterConstants = { 'barman': { value: 'banana' } };
        processExtension.setConstants('fake-assign-process', 'fake-constant-service-id', fakeConstants);
        expect(processExtension.getConstants('fake-assign-process')).toStrictEqual({ 'fake-constant-service-id': fakeConstants });
    });

    it('It should set a task template even if it is empty in the config', () => {
        processExtension.extensions['fake-assign-process'].templates = undefined;
        const fakeTemplateMapping: TaskTemplateMapping = {};
        processExtension.setTemplate('fake-assign-process', 'fake-user-task-template', fakeTemplateMapping);
        expect(processExtension.getTemplates('fake-assign-process')).toStrictEqual({ tasks: {}, default: {} });
    });
});

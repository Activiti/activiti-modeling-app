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

import { BpmnElement, BpmnProperty } from '@alfresco-dbp/modeling-shared/sdk';
import * as updateShapeHandler from '../property-handlers/update-shape-property.handler';
import * as userTaskDefaultValuesHandler from './user-task.handler';

describe('UserTaskDefaultValuesHandler', () => {

    const eventBus = {
        on: jest.fn()
    };

    const elementRegistry = {
        get: jest.fn()
    };

    const mockParentProcess = {
        id: 'ProcessDefinitionId',
        type: BpmnElement.Process,
        businessObject: {
            name: 'My Process',
            $type: BpmnElement.Process,
            id: 'ProcessDefinitionId'
        }
    };

    const userTaskWithOutAssignee: Bpmn.DiagramElement = {
        id: 'UserTask',
        type: BpmnElement.UserTask,
        businessObject: {
            name: 'User task',
            $type: BpmnElement.UserTask,
            id: 'UserTask'
        },
        parent: mockParentProcess
    };

    const userTaskWithAssignee: Bpmn.DiagramElement = {
        id: 'UserTask',
        type: BpmnElement.UserTask,
        businessObject: {
            name: 'User task',
            assignee: 'hruser-1',
            $type: BpmnElement.UserTask,
            id: 'UserTask'
        },
        parent: mockParentProcess
    };

    const userTaskCandidateUser: Bpmn.DiagramElement = {
        id: 'UserTask',
        type: BpmnElement.UserTask,
        businessObject: {
            name: 'User task',
            assignee: '${initiator}',
            candidateUsers: 'hruser',
            $type: BpmnElement.UserTask,
            id: 'UserTask'
        },
        parent: mockParentProcess
    };

    const contextMock = {
        shape: {
            id: 'UserTask'
        }
    };

    const elementRegistryWithOutAssignee = {
        get: jest.fn().mockImplementation(() => userTaskWithOutAssignee)
    };

    const elementRegistryWithAssignee = {
        get: jest.fn().mockImplementation(() => userTaskWithAssignee)
    };

    const elementRegistryCandidateUser = {
        get: jest.fn().mockImplementation(() => userTaskCandidateUser)
    };

    it('should be defined', () => {
        const handler = new userTaskDefaultValuesHandler.UserTaskDefaultValuesHandler(eventBus, elementRegistry);
        expect(handler).not.toBe(undefined);
    });

    it('should update the user task with default assignee', () => {
        const updateShapeHandlerSpy = spyOn(updateShapeHandler, 'updateShapeProperty');
        userTaskDefaultValuesHandler.execute(contextMock, elementRegistryWithOutAssignee);
        expect(updateShapeHandlerSpy).toHaveBeenCalledWith(userTaskWithOutAssignee, BpmnProperty.assignee, '${initiator}');
    });

    it('should not update the user task with default assignee if it already has a assignee', () => {
        const updateShapeHandlerSpy = spyOn(updateShapeHandler, 'updateShapeProperty');
        userTaskDefaultValuesHandler.execute(contextMock, elementRegistryWithAssignee);
        expect(updateShapeHandlerSpy).not.toHaveBeenCalled();
    });

    it('should remove the default user if the task has a assignee', () => {
        const updateShapeHandlerSpy = spyOn(updateShapeHandler, 'updateShapeProperty');
        userTaskDefaultValuesHandler.execute(contextMock, elementRegistryCandidateUser);
        expect(updateShapeHandlerSpy).toHaveBeenCalledWith(userTaskCandidateUser, BpmnProperty.assignee, null);
    });

    it('should return true if business object has no assignment', () => {
        const result = userTaskDefaultValuesHandler.businessObjectHasNoAssignment(userTaskWithOutAssignee.businessObject);
        expect(result).toBe(true);
    });

    it('should return false if business object has assignment', () => {
        const result = userTaskDefaultValuesHandler.businessObjectHasNoAssignment(userTaskWithAssignee.businessObject);
        expect(result).toBe(false);
    });

    it('should return true if userTask has candidate assignment', () => {
        const result = userTaskDefaultValuesHandler.businessObjectHasCandidates(userTaskCandidateUser.businessObject);
        expect(result).toBe(true);
    });

    it('should return false if userTask has no candidate assignment', () => {
        const result = userTaskDefaultValuesHandler.businessObjectHasCandidates(userTaskWithAssignee.businessObject);
        expect(result).toBe(false);
    });

    it('should call updateShapeProperty when removeDefaultAssignee is invoked', () => {
        const updateShapeHandlerSpy = spyOn(updateShapeHandler, 'updateShapeProperty');
        userTaskDefaultValuesHandler.removeDefaultAssignee(userTaskCandidateUser);
        expect(updateShapeHandlerSpy).toHaveBeenCalledWith(userTaskCandidateUser, BpmnProperty.assignee, null);
    });
});

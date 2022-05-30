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

/* eslint-disable max-len */
import { ModelingType } from '../modeling-type.model';
import { jsonModelType } from './json.model.type';

export const executionModelType: ModelingType = {
    id: 'execution',
    properties: jsonModelType.properties,
    methods: [[
        {
            signature: 'getId',
            type: 'string',
            documentation: 'Unique id of this path of execution that can be used as a handle to provide external signals back into the engine after wait states.'
        },
        {
            signature: 'getProcessInstanceId',
            type: 'string',
            documentation: 'Reference to the overall process instance'
        },
        {
            signature: 'getRootProcessInstanceId',
            type: 'string',
            documentation: 'The \'root\' process instance. When using call activity for example, the processInstance set will not always be the root. This method returns the topmost process instance.'
        },
        {
            signature: 'getEventName',
            type: 'string',
            documentation: 'Will contain the event name in case this execution is passed in for an ExecutionListener.'
        },
        {
            signature: 'getProcessInstanceBusinessKey',
            type: 'string',
            documentation: 'The business key for the process instance this execution is associated with.'
        },
        {
            signature: 'getProcessDefinitionId',
            type: 'string',
            documentation: 'The process definition key for the process instance this execution is associated with.'
        },
        {
            signature: 'getParentId',
            type: 'string',
            documentation: 'Gets the id of the parent of this execution. If null, the execution represents a process-instance.'
        },
        {
            signature: 'getSuperExecutionId',
            type: 'string',
            documentation: 'Gets the id of the calling execution. If not null, the execution is part of a subprocess.'
        },
        {
            signature: 'getCurrentActivityId',
            type: 'string',
            documentation: 'Gets the id of the current activity.'
        },
        {
            signature: 'getTenantId',
            type: 'string',
            documentation: 'Returns the tenant id, if any is set before on the process definition or process instance.'
        },
        {
            signature: 'getParent',
            type: 'execution',
            documentation: 'returns the parent of this execution, or null if there no parent.'
        },
        {
            signature: 'isActive',
            type: 'boolean',
            documentation: 'returns whether this execution is currently active.'
        },
        {
            signature: 'isEnded',
            type: 'boolean',
            documentation: 'returns whether this execution has ended or not.'
        },
        {
            signature: 'isConcurrent',
            type: 'boolean',
            documentation: 'returns whether this execution is concurrent or not.'
        },
        {
            signature: 'isProcessInstanceType',
            type: 'boolean',
            documentation: 'returns whether this execution is a process instance or not.'
        },
        {
            signature: 'isScope',
            type: 'boolean',
            documentation: 'Returns whether this execution is a scope.'
        },
        {
            signature: 'isMultiInstanceRoot',
            type: 'boolean',
            documentation: 'Returns weather this execution is the root of a multi instance execution.'
        },
        {
            signature: 'getVariables',
            type: 'json',
            documentation: 'Returns all variables. This will include all variables of parent scopes too.'
        },
        {
            signature: 'getVariableInstances',
            type: 'json',
            documentation: 'Returns all variables, as instances of the VariableInstance interface, which gives more information than only the the value (type, execution id, etc.)'
        },
        {
            signature: 'getVariablesLocal',
            type: 'json',
            documentation: 'Returns the variable local to this scope only. So, in contrary to getVariables(), the variables from the parent scope won\'t be returned.'
        },
        {
            signature: 'getVariableInstancesLocal',
            type: 'json',
            documentation: 'Returns the variables local to this scope as instances of the VariableInstance interface, which provided additional information about the variable.'
        },
        {
            signature: 'getVariable',
            type: 'json',
            documentation: 'Returns the variable value for one specific variable. Will look in parent scopes when the variable does not exist on this particular scope.',
            parameters: [
                {
                    label: 'variableName',
                    documentation: 'The name of the variable which value is going to be returned'
                }
            ]
        },
        {
            signature: 'getVariableInstance',
            type: 'json',
            documentation: 'Similar to getVariable(String), but returns a VariableInstance instance, which contains more information than just the value.',
            parameters: [
                {
                    label: 'variableName',
                    documentation: 'The name of the variable which instance is going to be returned'
                }
            ]
        },
        {
            signature: 'getVariableLocal',
            type: 'json',
            documentation: 'Returns the value for the specific variable and only checks this scope and not any parent scope.',
            parameters: [
                {
                    label: 'variableName',
                    documentation: 'The name of the variable which value is going to be returned'
                }
            ]
        },
        {
            signature: 'getVariableInstanceLocal',
            type: 'json',
            documentation: 'Similar to getVariableLocal(String), but returns an instance of VariableInstance, which has some additional information beyond the value.',
            parameters: [
                {
                    label: 'variableName',
                    documentation: 'The name of the variable which instance is going to be returned'
                }
            ]
        },
        {
            signature: 'getVariableNames',
            type: 'string-array',
            documentation: 'Returns all the names of the variables for this scope and all parent scopes.'
        },
        {
            signature: 'getVariableNamesLocal',
            type: 'string-array',
            documentation: 'Returns all the names of the variables for this scope (no parent scopes).'
        },
        {
            signature: 'hasVariables',
            type: 'boolean',
            documentation: 'Returns whether this scope or any parent scope has variables.'
        },
        {
            signature: 'hasVariablesLocal',
            type: 'boolean',
            documentation: 'Returns whether this scope has variables.'
        },
        {
            signature: 'hasVariable',
            type: 'boolean',
            documentation: 'Returns whether this scope or any parent scope has a specific variable.',
            parameters: [
                {
                    label: 'variableName',
                    documentation: 'The name of the variable to test'
                }
            ]
        },
        {
            signature: 'hasVariableLocal',
            type: 'boolean',
            documentation: 'Returns whether this scope has a specific variable.',
            parameters: [
                {
                    label: 'variableName',
                    documentation: 'The name of the variable to test'
                }
            ]
        }
    ], jsonModelType.methods].flat()
};

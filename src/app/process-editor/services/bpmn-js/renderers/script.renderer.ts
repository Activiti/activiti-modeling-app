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

import inherits from 'inherits';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { SCRIPT_TASK_IMPLEMENTATION } from '@alfresco-dbp/modeling-shared/sdk';

export function ScriptRender(eventBus, bpmnRenderer) {
  BaseRenderer.call(this, eventBus, 1500);

  this.canRender = function(element) {
    return is(element, 'bpmn:ServiceTask') && element.businessObject.get('implementation') === SCRIPT_TASK_IMPLEMENTATION;
  };

  this.drawShape = function(parentGfx, element) {
    return bpmnRenderer.handlers['bpmn:ScriptTask'](parentGfx, element);
  };
}

inherits(ScriptRender, BaseRenderer);

ScriptRender.$inject = [ 'eventBus', 'bpmnRenderer' ];

export const ScriptRenderModule = {
  __init__: [ 'scriptRenderer' ],
  scriptRenderer: [ 'type', ScriptRender ]
};

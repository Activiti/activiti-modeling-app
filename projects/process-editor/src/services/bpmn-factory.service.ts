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

import { Injectable, Inject, Injector, Optional } from '@angular/core';
import * as bpmnPropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
import { BpmnFactory, ALFRESCO_BPMN_RENDERERS } from '@alfresco-dbp/modeling-shared/sdk';
/*
    Angular 6 --prod mode doesn't seem to work with the normal way of importing the bpmnjs library.
    Modify this import with care, double-checking the process editor works in --prod mode.
*/
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min';

import { ClipboardService } from './clipboard/clipboard.service';

import { emptyPaletteModule } from './palette/dummy-bpmn-palette.provider';
import { DecisionTableRenderModule } from './bpmn-js/renderers/decision-table.renderer';
import { ScriptRenderModule } from './bpmn-js/renderers/script.renderer';
import { UserTaskDefaultValuesBpmnJsModule } from './bpmn-js/default-values-handlers/user-task.handler';
import { CustomReplaceMenuProviderBpmnJsModule } from './replace-menu/custom-replace-menu.provider';
import { CallActivityDefaultValuesBpmnJsModule } from './bpmn-js/default-values-handlers/call-activity.handler';
import { CustomContextPadProviderBpmnJsModule } from './context-pad/custom-context-pad.provider';

const activitiModdleDescriptor = require('./activiti.json');
const redefineModdleDescriptor = require('./redefine-bpmn.json');

@Injectable()
export class BpmnFactoryService implements BpmnFactory {

    constructor(
        private clipboardService: ClipboardService,
        @Optional()
        @Inject(ALFRESCO_BPMN_RENDERERS) private bpmnRenderers: Diagram.BaseRenderer[],
        private injector: Injector) {
    }

    create(): Bpmn.Modeler {

        return new BpmnModeler({
            keyboard: { bindTo: document },
            additionalModules: [
                this.angularInjector,
                emptyPaletteModule,
                DecisionTableRenderModule,
                ScriptRenderModule,
                ...this.getBpmnRenderers(),
                { clipboard: ['value', this.clipboardService] },
                ...this.getBpmnPropertiesPanelConfig(),
                ...this.getDefaultValuesBpmnJsModules(),
                CustomReplaceMenuProviderBpmnJsModule,
                CustomContextPadProviderBpmnJsModule,
            ],
            moddleExtensions: { activiti: activitiModdleDescriptor, bpmn: redefineModdleDescriptor }
        });
    }

    private get angularInjector() {
        return {
            __init__: [ 'angularInjector' ],
            angularInjector: [ 'value', this.injector ]
        };
    }

    private getBpmnRenderers() {
        return this.bpmnRenderers || [];
    }

    protected getBpmnPropertiesPanelConfig() {
        return [
            bpmnPropertiesProviderModule
        ];
    }

    protected getDefaultValuesBpmnJsModules() {
        return [
            UserTaskDefaultValuesBpmnJsModule,
            CallActivityDefaultValuesBpmnJsModule
        ];
    }
}

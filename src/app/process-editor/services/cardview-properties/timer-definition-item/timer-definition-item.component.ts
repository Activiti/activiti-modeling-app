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

import { Component, Input, OnInit } from '@angular/core';
import { CardItemTypeService, CardViewUpdateService, AppConfigService } from '@alfresco/adf-core';

@Component({
    selector: 'ama-process-timer-definition',
    templateUrl: './timer-definition-item.component.html',
    providers: [CardItemTypeService]
})
export class CardViewTimerDefinitionItemComponent implements OnInit {
    @Input() property;

    timers = [];
    selectedTimer: Bpmn.DiagramElement;
    timerDefinition = '';
    timerType = '';

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private appConfigService: AppConfigService
    ) {}

    ngOnInit() {
        this.setTimerFromXML();
        this.timers = this.appConfigService.get('process-modeler.timer-types');
    }

    updateTimerDefinition() {
        if (this.timerDefinition) {
            this.cardViewUpdateService.update(this.property, {type: this.timerType, definition: this.timerDefinition});
        }
    }

    setTimerFromXML() {
        const timerEventDefinition = this.property.data.element.businessObject.eventDefinitions[0];

        if (timerEventDefinition.timeCycle) {
            this.timerType = 'timeCycle';
            this.timerDefinition = timerEventDefinition.timeCycle.body;
        } else if (timerEventDefinition.timeDuration) {
            this.timerType = 'timeDuration';
            this.timerDefinition = timerEventDefinition.timeDuration.body;
        } else if (timerEventDefinition.timeDate) {
            this.timerType = 'timeDate';
            this.timerDefinition = timerEventDefinition.timeDate.body;
        }
    }
}

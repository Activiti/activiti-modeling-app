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

import { Component, Inject, Input, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreadcrumbItem } from '../../../helpers/header-breadcrumbs/breadcrumb-helper.service';
import { BasicModelCommands } from '../../commands/commands.interface';
import { CommandButtonPriority, ShowCommandButton } from '../../services/command.model';
import { ModelCommandsService } from '../../services/model-commands.service';
import { MODEL_COMMAND_SERVICE_TOKEN } from '../model-editor/model-editors.token';

@Component({
    /* cspell: disable-next-line */
    selector: 'modelingsdk-model-header',
    templateUrl: './model-header.component.html'
})
export class ModelHeaderComponent implements OnInit {

    @Input()
    breadcrumbs$: Observable<BreadcrumbItem[]>;

    @Input()
    modelName: string;

    primaryButtons: ShowCommandButton[];
    secondaryButtons: ShowCommandButton[];

    constructor(@Inject(MODEL_COMMAND_SERVICE_TOKEN)
                private modelCommands: ModelCommandsService) {
    }

    ngOnInit() {
        this.primaryButtons = this.modelCommands.getCommandButtons(CommandButtonPriority.PRIMARY);
        this.secondaryButtons = this.modelCommands.getCommandButtons(CommandButtonPriority.SECONDARY);
    }

    showMenu() {
        const buttonsVisible$ = this.secondaryButtons.map(button => button.visible$);
        return combineLatest(buttonsVisible$).pipe(map(buttonsVisible => buttonsVisible.some(isVisible => isVisible)));
    }

    onClick(commandName: BasicModelCommands) {
        this.modelCommands.dispatchEvent(commandName);
    }
}

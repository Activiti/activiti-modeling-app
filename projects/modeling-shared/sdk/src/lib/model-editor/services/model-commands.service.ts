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

import { ModelButtonService } from './model-button.service';
import { Observable, zip } from 'rxjs';
import { take } from 'rxjs/operators';
import { ContentType } from '../../api-implementations/acm-api/content-types';
import { MODEL_TYPE } from '../../api/types';
import { BasicModelCommands, ModelCommand } from '../commands/commands.interface';
import { ModelCommandCallback, ModelCommandCallbackEvent } from './model-command-callback';
import { CommandButton, CommandButtonPriority, ShowCommandButton, CommandButtonRequest } from './command.model';

interface EventMethod {
    eventName: string;
    callback: ModelCommandCallback;
}

export class ModelCommandsService {
    protected eventTarget: EventTarget;

    protected modelType: MODEL_TYPE;
    protected modelContentType: ContentType;
    protected modelId$: Observable<string>;
    protected modelContent$: Observable<string>;
    protected modelMetadata$: Observable<Record<string, any>>;

    protected commands: EventMethod[] = [];
    protected modelButtonService: ModelButtonService = new ModelButtonService();

    constructor() {
        this.eventTarget = new EventTarget();
    }

    public init(modelType: MODEL_TYPE, modelContentType: ContentType, modelId$: Observable<string>, modelContent$: Observable<string>, modelMetadata$?: Observable<any>) {
        this.modelType = modelType;
        this.modelContentType = modelContentType;
        this.modelId$ = modelId$;
        this.modelContent$ = modelContent$;
        this.modelMetadata$ = modelMetadata$;
    }

    public dispatchEvent(value: BasicModelCommands) {
        this.eventTarget.dispatchEvent(
            new ModelCommandCallbackEvent(
                value,
                this.modelType,
                this.modelContentType,
                this.modelId$,
                this.modelContent$,
                this.modelMetadata$
            )
        );
    }

    private addEventListener(eventName: string, command: ModelCommand) {
        const callback = this.getCommandCallback(command);
        this.commands.push({ eventName, callback });
        this.eventTarget.addEventListener(eventName, callback);
    }

    public registerCommand(command: CommandButton) {
        this.addEventListener(command.commandName, command.action);
        this.modelButtonService.addButton(command);
    }

    public getBasicModelCommands(buttonRequest: CommandButtonRequest, modelType: MODEL_TYPE): CommandButton [] {
        const basicCommands = [];
        for (const command in buttonRequest) {
            if (!!command && buttonRequest.hasOwnProperty(command)) {
                basicCommands.push(this.modelButtonService.getCommandButtonFor(<BasicModelCommands>command, buttonRequest[command], modelType));
            }
        }
        return basicCommands;
    }

    public destroy() {
        this.commands.forEach(command => this.eventTarget.removeEventListener(command.eventName, command.callback));
    }

    private getCommandCallback(command: ModelCommand): ModelCommandCallback {
        return (event: ModelCommandCallbackEvent) => {
            const streams$ = [event.modelId$, event.modelContent$, ...(event.modelMetadata$ ? [event.modelMetadata$] : []) ];
            zip(...streams$).pipe(take(1))
                .subscribe(([modelId, content, metadata]) => command.execute(
                    event.modelType,
                    event.modelContentType,
                    modelId as string,
                    content as string,
                    metadata
                ));
        };
    }

    public getCommandButtons(priority?: CommandButtonPriority): ShowCommandButton[] {
        return this.modelButtonService.getCommandButtons(priority);
    }

    public setDisable(commandName: BasicModelCommands, value: boolean) {
        this.modelButtonService.setDisable(commandName, value);
    }

    public setVisible(commandName: BasicModelCommands, value: boolean) {
        this.modelButtonService.setVisible(commandName, value);
    }

}

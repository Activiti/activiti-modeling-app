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

import { Action, Store } from '@ngrx/store';
import { AmaState } from '../../store/app.state';

export interface ModelCommand {
    execute(modelId: string, content: string, metadata?: any): void;
}

export abstract class GenericSaveModelCommand implements ModelCommand {
    constructor(protected store: Store<AmaState>) {}

    protected abstract title: string;
    protected abstract ValidateAction: new(payload: any) => Action;
    protected abstract UpdateAction: new(payload: any) => Action;

    execute(modelId: string, content: string, metadata?: any) {
        const ValidateAction = this.ValidateAction;
        const UpdateAction = this.UpdateAction;

        this.store.dispatch(new ValidateAction({
            title: this.title,
            triggerId: modelId,
            triggerContent: JSON.parse(content),
            action: new UpdateAction(JSON.parse(content))
        }));
    }
}

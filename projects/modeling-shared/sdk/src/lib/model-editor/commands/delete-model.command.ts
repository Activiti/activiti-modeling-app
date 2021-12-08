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

import { OpenConfirmDialogAction } from '../../store/app.actions';
import { Store } from '@ngrx/store';
import { MODEL_TYPE } from '../../api/types';
import { AmaState } from '../../store/app.state';
import { ModelCommand, DeleteActionLike } from './commands.interface';
import { ContentType } from '../../api-implementations/acm-api/content-types';

export abstract class GenericDeleteModelCommand implements ModelCommand {
    constructor(protected store: Store<AmaState>, protected translationService: any) { }

    protected abstract DeleteAction: DeleteActionLike;

    execute(modelType: MODEL_TYPE, modelContentType: ContentType, modelId: string) {
        const DeleteAction = this.DeleteAction;
        this.store.dispatch(
            new OpenConfirmDialogAction({
                dialogData: { title: this.translationService.instant('SDK.MODEL_EDITOR.DIALOG.CONFIRM_DELETE_MODEL', { modelType }) },
                action: new DeleteAction(modelId)
            })
        );
    }
}

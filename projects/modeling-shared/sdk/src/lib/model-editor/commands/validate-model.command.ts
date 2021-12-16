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

import { Store } from '@ngrx/store';
import { ContentType } from '../../api-implementations/acm-api/content-types';
import { ModelContentSerializer } from '../../api-implementations/acm-api/model-content-serializer';
import { MODEL_TYPE } from '../../api/types';
import { AmaState } from '../../store/app.state';
import { ModelCommand, ValidateActionLike, ErrorActionLike, SuccessActionLike } from './commands.interface';
import { SnackbarInfoAction, SetApplicationLoadingStateAction } from '../../store/app.actions';

export abstract class GenericValidateModelCommand implements ModelCommand {
    constructor(
        protected store: Store<AmaState>,
        protected serializer: ModelContentSerializer,
        protected translationService: any
    ) {}

    protected abstract ValidateAction: ValidateActionLike;
    protected abstract SuccessAction: SuccessActionLike;
    protected abstract ErrorAction: ErrorActionLike;

    execute(modelType: MODEL_TYPE, modelContentType: ContentType, modelId: string, serializedModelContent: string, modelMetadata?: any) {
        const ValidateAction = this.ValidateAction;
        const SuccessAction = this.SuccessAction;
        const ErrorAction = this.ErrorAction;

        const modelContent = this.serializer.deserialize(serializedModelContent, modelContentType);

        this.store.dispatch(new SetApplicationLoadingStateAction(true));

        this.store.dispatch(new ValidateAction({
            title: this.translationService.instant('SDK.MODEL_EDITOR.DIALOG.CONFIRM_INVALID_MODEL_SAVE', { modelType }),
            modelId: modelId,
            modelContent,
            ...( modelMetadata ? { modelMetadata } : {} ),
            action: new SuccessAction([
                new SnackbarInfoAction('SDK.MODEL_EDITOR.DIALOG.VALID_MODEL', null, { modelType: this.capitalize(modelType) }),
                new SetApplicationLoadingStateAction(false)
            ]),
            errorAction: new ErrorAction('SDK.MODEL_EDITOR.DIALOG.INVALID_MODEL', { modelType: this.capitalize(modelType) })
        }));
    }

    private capitalize(word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
}

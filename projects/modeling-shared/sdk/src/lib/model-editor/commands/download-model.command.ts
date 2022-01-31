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
import { ModelCommand, DownloadActionLike, ValidateActionLike } from './commands.interface';

export abstract class GenericDownloadModelCommand implements ModelCommand {
    constructor(
        protected store: Store<AmaState>,
        protected serializer: ModelContentSerializer,
        protected translationService: any
    ) {}

    protected abstract ValidateAction: ValidateActionLike;
    protected abstract DownloadAction: DownloadActionLike;

    execute(modelType: MODEL_TYPE, modelContentType: ContentType, modelId: string, serializedModelContent: string, modelMetadata?: any) {
        const ValidateAction = this.ValidateAction;
        const DownloadAction = this.DownloadAction;

        const modelContent = this.serializer.deserialize(serializedModelContent, modelContentType);

        this.store.dispatch(new ValidateAction({
            title: this.translationService.instant('SDK.MODEL_EDITOR.DIALOG.CONFIRM_DOWNLOAD_MODEL', { modelType }),
            modelId: modelId,
            modelContent,
            ...( modelMetadata ? { modelMetadata } : {} ),
            action: new DownloadAction(modelId)
        }));
    }
}

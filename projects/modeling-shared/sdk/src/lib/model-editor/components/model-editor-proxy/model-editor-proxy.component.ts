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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MODEL_TYPE } from '../../../api/types';

interface ModelEditorRouterParams {
    projectId: string;
    modelId: string;
}

export interface ModelEditorRouterData {
    modelType: MODEL_TYPE;
}

@Component({
    template: `<modelingsdk-model-editor [modelId]="modelId$ | async" [modelType]="modelType$ | async"></modelingsdk-model-editor>`,
    encapsulation: ViewEncapsulation.None,
})
export class ModelEditorProxyComponent implements OnInit {
    modelId$: Observable<string>;
    modelType$: Observable<MODEL_TYPE>;

    constructor(private activatedroute: ActivatedRoute) {}

    public ngOnInit(): void {
        this.modelId$ = this.activatedroute.params.pipe(map((params: ModelEditorRouterParams) => params.modelId));
        this.modelType$ = this.activatedroute.data.pipe(map((data: ModelEditorRouterData) => data.modelType));
    }
}

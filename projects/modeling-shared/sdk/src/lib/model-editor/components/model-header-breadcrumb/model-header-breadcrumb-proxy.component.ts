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
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { MODEL_TYPE, UI } from '../../../api/types';
import { BreadCrumbHelperService, BreadcrumbItem } from '../../../helpers/public-api';
import { selectModelEntityByType } from '../../../store/model-entity.selectors';
import { selectModelEntity } from '../../../store/model.selectors';

interface ModelEditorRouterParams {
    projectId: string;
    modelId: string;
}

export interface ModelEditorRouterData {
    modelType: MODEL_TYPE;
}

@Component({
    templateUrl: './model-header-breadcrumb-proxy.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ModelHeaderBreadcrumbProxyComponent implements OnInit {
    modelId$: Observable<string>;
    modelType$: Observable<MODEL_TYPE>;

    breadcrumbs$: Observable<BreadcrumbItem[]>;

    private migratedModels = [UI];

    constructor(private activatedRoute: ActivatedRoute, private breadCrumbHelperService: BreadCrumbHelperService) { }

    public ngOnInit(): void {
        this.modelId$ = this.activatedRoute.params.pipe(map((params: ModelEditorRouterParams) => params.modelId));
        this.modelType$ = this.activatedRoute.data.pipe(map((data: ModelEditorRouterData) => data.modelType));

        this.breadcrumbs$ = combineLatest([this.modelType$, this.modelId$]).pipe(
            filter(([modelType, modelId]) => !!modelType && !!modelId),
            mergeMap(([modelType, modelId]) => {
                if (this.isMigratedModel(modelType)) {
                    return this.breadCrumbHelperService.getModelCrumbs(selectModelEntity(modelId));
                }else {
                    return this.breadCrumbHelperService.getModelCrumbs(selectModelEntityByType(modelType, modelId));
                }
            }));
    }

    private isMigratedModel(modelType) {
        return this.migratedModels.includes(modelType);
    }

}

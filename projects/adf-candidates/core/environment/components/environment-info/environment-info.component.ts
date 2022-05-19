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

import { Component, OnInit, ChangeDetectionStrategy, Inject, ViewEncapsulation } from '@angular/core';
import { ENVIRONMENT_SERVICE_TOKEN } from '../../services/environment.provider';
import { EnvironmentService, FeatureDescription } from '../../services/environment.service';

@Component({
    selector: 'adf-environment-info',
    templateUrl: './environment-info.component.html',
    styleUrls: ['./environment-info.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvironmentInfoComponent<T> implements OnInit {
    public features: (FeatureDescription & {active: boolean})[];

    constructor(@Inject(ENVIRONMENT_SERVICE_TOKEN) private environmentService: EnvironmentService<T>) {}

    ngOnInit(): void {
        this.features = this.environmentService.describeFeatures();
    }
}

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

import {
    Directive,
    Inject,
    Input,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import { ENVIRONMENT_SERVICE_TOKEN } from '../../services/environment.provider';
import { EnvironmentService } from '../../services/environment.service';

@Directive({ selector: '[adf-feature]' })
export class FeatureDirective<T> {
    private hasView = false;

    constructor(
        @Inject(ENVIRONMENT_SERVICE_TOKEN) private environmentService: EnvironmentService<T>,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) {}

    @Input('adf-feature') set adfFeature(featureName: keyof T) {
        if (this.environmentService.isFeatureActive(featureName) && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        } else {
            this.viewContainer.clear();
            this.hasView = false;
        }
    }
}

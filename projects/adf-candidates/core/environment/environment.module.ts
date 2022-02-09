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

import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvironmentInfoComponent } from './components/environment-info/environment-info.component';
import { FeatureDirective } from './directives/feature/feature.directive';
import { Environment, EnvironmentService, FeaturesInfo } from './services/environment.service';
import { createEnvironmentServices, ENVIRONMENT_SERVICE_TOKEN } from './services/environment.provider';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
    imports: [CommonModule, MatIconModule, MatExpansionModule ],
    declarations: [EnvironmentInfoComponent, FeatureDirective],
    exports: [EnvironmentInfoComponent, FeatureDirective]
})
export class EnvironmentModule {
    public static forRoot<T = any>(
        config: Environment<T>,
        featuresInfo: FeaturesInfo<T>,
        providerToken?: InjectionToken<EnvironmentService<T>>
    ): ModuleWithProviders<EnvironmentModule> {
        return {
            ngModule: EnvironmentModule,
            providers: [
                {
                    provide: ENVIRONMENT_SERVICE_TOKEN,
                    useFactory: createEnvironmentServices.bind(null, config, featuresInfo)
                },
                ...(providerToken ? [{ provide: providerToken, useExisting: ENVIRONMENT_SERVICE_TOKEN }] : [])
            ]
        };
    }
}

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
    Component,
    ComponentFactoryResolver,
    Inject,
    Input,
    OnChanges,
    ViewChild
} from '@angular/core';
import { MODEL_TYPE } from '../../../api/types';
import { DynamicComponentDirective } from './dynamic-component.directive';
import { ModelEditorType, MODEL_EDITORS_TOKEN } from './model-editors.token';

@Component({
    selector: 'modelingsdk-model-editor',
    template: '<ng-template modelingsdk-dynamic-component></ng-template>'
})
export class ModelEditorComponent implements OnChanges {
    @Input()
    modelId: string;

    @Input()
    modelType: MODEL_TYPE;

    @ViewChild(DynamicComponentDirective, { static: true })
    private content: DynamicComponentDirective;

    private loaded = false;
    private componentReference: any = null;

    constructor(
        private resolver: ComponentFactoryResolver,
        @Inject(MODEL_EDITORS_TOKEN) private modelEditors: ModelEditorType[]
    ) {}

    ngOnChanges() {
        if (this.loaded) {
            this.destroyComponent();
        }

        this.loadComponent();
        this.loaded = true;
    }

    private destroyComponent() {
        this.content.viewContainerRef.remove();
    }

    private loadComponent() {
        const factoryClass = this.getComponentByType(this.modelType);
        const factory = this.resolver.resolveComponentFactory(factoryClass);
        this.componentReference = this.content.viewContainerRef.createComponent(factory);
        this.componentReference.instance.modelId = this.modelId;
    }

    private getComponentByType(type: string) {
        return this.modelEditors
            .find(modelFetcher => modelFetcher.type === type)
            .componentClass;
    }
}

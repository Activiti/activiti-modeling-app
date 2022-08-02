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
    Type,
    ViewChild
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { MODEL_TYPE } from '../../../api/types';
import { CanComponentDeactivate } from '../../router/guards/unsaved-page.guard';
import { DynamicComponentDirective } from './dynamic-component.directive';
import { ModelEditorType, MODEL_EDITORS_TOKEN } from './model-editors.token';

@Component({
    selector: 'modelingsdk-model-editor',
    template: '<ng-template modelingsdk-dynamic-component></ng-template>'
})
export class ModelEditorComponent implements OnChanges, CanComponentDeactivate {
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
    }

    private destroyComponent() {
        this.content.viewContainerRef.remove();
    }

    private loadComponent() {
        const componentClass = this.getComponentByType(this.modelType);
        if (componentClass) {
            const componentFactory = this.resolver.resolveComponentFactory(componentClass);
            this.componentReference = this.content.viewContainerRef.createComponent(componentFactory);
            this.componentReference.instance.modelId = this.modelId;
            this.loaded = true;
        }
    }

    private getComponentByType(type: string): Type<any> | null | never  {
        try {
            return this.modelEditors
                .find(modelFetcher => modelFetcher.type === type)
                .componentClass;
        } catch (e) {
            if (e instanceof TypeError) {
                console.error(`There is no registered editor for model type: ${this.modelType}`);
                return null;
            }
            throw e;
        }
    }

    public canDeactivate(): Observable<boolean> {
        return this.componentReference.instance.canDeactivate?.() || of(true);
    }

    public deleteDraftState() {
        return this.componentReference.instance.deleteDraftState?.();
    }
}

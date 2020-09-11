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

import { InjectionToken, Type } from '@angular/core';

export interface GeneralTrigger {
    group: string;
    type: string;
    icon: string;
    title: string;
    clickable: boolean;
    draggable: boolean;
    svg?: string;
}
export interface ToolTrigger extends GeneralTrigger {
    group: 'tool';
}

export interface BpmnElementTrigger extends GeneralTrigger {
    group: 'element';
    options?: any;
}

export type BpmnTrigger = BpmnElementTrigger | ToolTrigger;

export interface PaletteSeparatorElement {
    group: 'separator';
}

export interface PaletteGroupElement {
    group: 'container';
    icon: string;
    title: string;
    children?: GeneralTrigger[];
}

export type PaletteElement = PaletteSeparatorElement | PaletteGroupElement | BpmnTrigger | GeneralTrigger;

export interface TriggerHandler {
    processEvent(event: any, element: GeneralTrigger): void;
}

export interface PaletteElementHandler {
    key: string;
    handler: TriggerHandler;
}

export const PaletteElementsToken = new InjectionToken<PaletteElement[][]>('palette-elements');
export const PaletteElementsHandlersToken = new InjectionToken<PaletteElementHandler[]>('palette-element-handlers');
export const PaletteElementIconsToken = new InjectionToken('palette-element-icons');
export function providePaletteHandler(key: string, handler: Type<TriggerHandler>) {
    return [
        handler,
        {
            provide: PaletteElementsHandlersToken,
            useValue: { key, handler },
            multi: true
        }
    ];
}

export function providePaletteElements(elements: PaletteElement[]) {
    return {
        provide: PaletteElementsToken,
        multi: true,
        useValue: elements
    };
}

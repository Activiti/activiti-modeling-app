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

import { Component, Inject, Optional, HostListener, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProcessModelerPaletteService } from '../../../services/palette/process-modeler-palette.service';
import {
    PaletteElement,
    PaletteElementsToken,
    ToolTrigger,
    BpmnTrigger,
    PaletteGroupElement,
    PaletteSeparatorElement,
    PaletteElementIconsToken
} from '@alfresco-dbp/modeling-shared/sdk';
import { OverlayRef } from '@angular/cdk/overlay';

@Component({
    templateUrl: './palette.component.html',
    selector: 'ama-process-palette'
})
export class PaletteComponent implements OnInit {

    public selectedTool: ToolTrigger;
    public paletteElements: PaletteElement[];
    public paletteElementIcons;
    public paletteIconSvg = {};
    public opened = true;
    public detach = false;
    overlayRef: OverlayRef;
    @ViewChild('drawer') templateContent: TemplateRef<any>;

    @HostListener('mousedown', ['$event'])
    onMouseDown(event) {
        event.stopPropagation();
    }

    constructor(
        private processModelerPaletteService: ProcessModelerPaletteService,
        private sanitizer: DomSanitizer,
        @Optional() @Inject(PaletteElementsToken) paletteElements: PaletteElement[],
        @Optional() @Inject(PaletteElementIconsToken) paletteElementIcons
    ) {
        this.paletteElements = (<any>paletteElements).flatten(1) || [];
        this.paletteElementIcons = paletteElementIcons || {};
    }

    ngOnInit() {
        this.buildPaletteIcons();
    }

    private buildPaletteIcons() {
        Object.keys(this.paletteElementIcons).forEach((type) => {
            this.paletteIconSvg[type] = this.sanitizer.bypassSecurityTrustHtml(this.paletteElementIcons[type]);
        });
    }

    public isSeparator(element: PaletteSeparatorElement) {
        return element.group === 'separator';
    }

    public hasChildren(element: PaletteGroupElement) {
        return element.group === 'container' && element.children && element.children.length;
    }

    public toggleOpen() {
        this.opened = !this.opened;
    }

    public onClick(paletteItem: BpmnTrigger, event: any) {
        if (!paletteItem.clickable) {
            return;
        }

        if (paletteItem.group === 'tool') {
            this.selectedTool = paletteItem;
        }

        this.delegateEvent(paletteItem, event);
    }

    public onDrag(paletteItem: BpmnTrigger, event: any) {
        if (!paletteItem.draggable) {
            return;
        }

        this.delegateEvent(paletteItem, event);
    }

    private delegateEvent(paletteItem: BpmnTrigger, event: any) {
        this.processModelerPaletteService.delegateEvent(paletteItem, event);
    }
}

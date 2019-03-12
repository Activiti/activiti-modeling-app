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

import { Component, Inject, Optional, HostListener, ViewChild, ElementRef, AfterViewInit, ViewContainerRef, TemplateRef } from '@angular/core';
import { ProcessModelerPaletteService } from '../../../services/palette/process-modeler-palette.service';
import { PaletteElement, CustomPaletteElementsToken, ToolTrigger } from 'ama-sdk';
import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
const paletteElements = require('../../../config/palette-elements.json');

@Component({
    templateUrl: './palette.component.html',
    selector: 'ama-process-palette'
})
export class PaletteComponent implements AfterViewInit {

    public selectedTool: ToolTrigger;
    public paletteElements: PaletteElement[];
    public opened = true;
    overlayRef: OverlayRef;
    overlayPosition: PositionStrategy;
    templatePortal: TemplatePortal;

    @ViewChild('submenu') submenuBtnRef: ElementRef;
    @ViewChild('drawer') templatePortalContent: TemplateRef<any>;
    content: ViewContainerRef;


    @HostListener('mousedown', ['$event'])
    onMouseDown(event) {
        event.stopPropagation();
    }

    constructor(
        private processModelerPaletteService: ProcessModelerPaletteService,
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        @Optional() @Inject(CustomPaletteElementsToken) customPaletteElements: PaletteElement[]
    ) {
        this.paletteElements = paletteElements.concat(customPaletteElements || []);
    }

    ngAfterViewInit() {
        this.overlayRef = this.overlay.create({
          positionStrategy: this.getOverlayPosition(),
          width: 200,
        });
    }

    getOverlayPosition(): PositionStrategy {
        this.overlayPosition = this.overlay.position()
          .connectedTo(
            this.submenuBtnRef,
            {originX: 'start', originY: 'bottom'},
            {overlayX: 'start', overlayY: 'bottom'}
          );

        return this.overlayPosition;
      }

    openSubmenu(item: any) {
        this.templatePortal = new TemplatePortal(this.templatePortalContent, this.viewContainerRef);
        this.templatePortal.context = {$implicit: item};
        if (!this.overlayRef.hasAttached()) {
            this.overlayRef.attach(this.templatePortal);
          } else {
            this.overlayRef.detach();
          }
        }

    public isSeparator(element: PaletteElement) {
        return element.group === 'separator';
    }

    public hasChildren(element: PaletteElement) {
        return element.group === 'container' && element.children && element.children.length;
    }

    public toggleOpen() {
        this.opened = !this.opened;
    }

    public onClick(paletteItem: PaletteElement, event: any) {
        if (!paletteItem.clickable) {
            return;
        }

        if (paletteItem.group === 'tool') {
            this.selectedTool = paletteItem;
        }

        this.delegateEvent(paletteItem, event);
        this.overlayRef.detach();
    }

    public onDrag(paletteItem: PaletteElement, event: any) {
        if (!paletteItem.draggable) {
            return;
        }

        this.delegateEvent(paletteItem, event);
        this.overlayRef.detach();
    }

    private delegateEvent(paletteItem: PaletteElement, event: any) {
        this.processModelerPaletteService.delegateEvent(paletteItem, event);
    }
}

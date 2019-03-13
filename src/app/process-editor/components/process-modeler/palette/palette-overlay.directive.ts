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

import { Directive, ElementRef, TemplateRef, AfterViewInit, Input, HostListener, ViewContainerRef } from '@angular/core';
import { OverlayRef, PositionStrategy, Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

 @Directive({
     selector: '[ama-palette-overlay]'
 })

 export class PaletteOverlayDirective implements AfterViewInit {
    overlayPosition: PositionStrategy;
    templatePortal: TemplatePortal;
    @Input() templatePortalContent: TemplateRef<any>;
    @Input() amaPaletteItem: any;
    @Input() amaPaletePortal: TemplatePortal;
    @Input() amaPaletteOverlayRef: OverlayRef;

     constructor(
        public submenuBtnRef: ElementRef,
        public amaPaleteContainerRef: ViewContainerRef,
        private overlay: Overlay
     ) {
     }

     ngAfterViewInit() {
        this.amaPaletteOverlayRef = this.overlay.create({
          positionStrategy: this.getOverlayPosition()
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

    @HostListener('click', ['$event']) onClick($event) {
        this.templatePortal = new TemplatePortal(this.templatePortalContent, this.amaPaleteContainerRef);
        this.templatePortal.context = {$implicit: this.amaPaletteItem};
        if (!this.amaPaletteOverlayRef.hasAttached()) {
            this.amaPaletteOverlayRef.attach(this.templatePortal);
        } else {
            this.amaPaletteOverlayRef.detach();
        }
    }
}

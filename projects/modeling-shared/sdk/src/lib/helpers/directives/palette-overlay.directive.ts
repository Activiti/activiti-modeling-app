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

import { Directive, ElementRef, TemplateRef, AfterViewInit, Input, HostListener, ViewContainerRef, OnDestroy } from '@angular/core';
import { OverlayRef, PositionStrategy, Overlay, ConnectionPositionPair } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
/* eslint-disable @angular-eslint/directive-selector */

@Directive({
    selector: '[ama-palette-overlay]'
})

export class PaletteOverlayDirective implements AfterViewInit, OnDestroy {
    overlayPosition: PositionStrategy;
    templatePortal: TemplatePortal;
    @Input() templatePortalContent: TemplateRef<any>;
    @Input() amaPaletteItem: any;
    @Input() amaPaletteOverlayRef: OverlayRef;

    constructor(
        public submenuBtnRef: ElementRef,
        public amaPaletteContainerRef: ViewContainerRef,
        private overlay: Overlay
    ) {
    }

    ngAfterViewInit() {
        this.amaPaletteOverlayRef = this.overlay.create({
            positionStrategy: this.getOverlayPosition(),
            scrollStrategy: this.overlay.scrollStrategies.reposition()
        });
    }

    getOverlayPosition(): PositionStrategy {
        this.overlayPosition = this.overlay
            .position()
            .flexibleConnectedTo(this.submenuBtnRef)
            .withPositions([new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'bottom' })]);

        return this.overlayPosition;
    }

    @HostListener('window:click', ['$event']) onWindowClick($event: Event) {
        if ($event.target === this.submenuBtnRef.nativeElement) {
            this.templatePortal = new TemplatePortal(this.templatePortalContent, this.amaPaletteContainerRef);
            this.templatePortal.context = {$implicit: this.amaPaletteItem};
            if (!this.amaPaletteOverlayRef.hasAttached()) {
                this.amaPaletteOverlayRef.attach(this.templatePortal);
            }
        } else if (this.amaPaletteOverlayRef.hasAttached() && !this.isNestedContainer($event.target)) {
            this.amaPaletteOverlayRef.detach();
        }
    }

    ngOnDestroy() {
        if (this.amaPaletteOverlayRef.hasAttached()) {
            this.amaPaletteOverlayRef.detach();
        }
    }

    private isNestedContainer(element: any): boolean {
        if (element.attributes?.nested) {
            return element.attributes.nested.value;
        }
        return false;
    }

}

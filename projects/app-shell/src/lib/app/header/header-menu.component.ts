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

import { Component, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'ama-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HeaderMenuComponent {

    @Input() showLanguagePicker = false;
    @Output() logout = new EventEmitter<void>();
    @Output() openSettings = new EventEmitter<void>();

    user: any = null;

    onOpenSettings() {
        this.openSettings.next();
    }
}

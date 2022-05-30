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

import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JSONSchemaInfoBasics } from '../../../api/types';
import { PropertyTypeDialogComponent } from '../property-type-dialog/property-type-dialog.component';
import { PropertyTypeSelectorSmartComponent } from '../property-type-selector/property-type-selector.smart-component';
import { PropertyTypeItem } from './models';

@Component({
    selector: 'modelingsdk-property-type-item-ui',
    templateUrl: './property-type-item.ui-component.html',
    styleUrls: ['./property-type-item.ui-component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PropertyTypeItemUiComponent {
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() change = new EventEmitter();
    @Input() items: PropertyTypeItem[];
    @Input() automationId: string;
    @ViewChild('childMenu', { static: true }) public childMenu;

    constructor(private dialog: MatDialog) { }

    onChange(event: PropertyTypeItem) {
        if (event.provider === PropertyTypeSelectorSmartComponent.PROVIDER_NAME) {
            this.onOpenModelDialog(event);
        } else {
            this.change.emit(event);
        }
    }

    private onOpenModelDialog(item: PropertyTypeItem) {
        const data = {
            value: this.deepCopy(item.value)
        };

        const dialogRef = this.dialog.open(PropertyTypeDialogComponent, {
            data,
            width: '900px'
        });

        dialogRef.afterClosed().subscribe((model: JSONSchemaInfoBasics) => {
            if (model) {
                item.value = model;
                this.change.emit(item);
            }
        });
    }

    private deepCopy(obj: any): any {
        let copy;

        if (null == obj || 'object' !== typeof obj) {
            return obj;
        }

        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        if (obj instanceof Array) {
            copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.deepCopy(obj[i]);
            }
            return copy;
        }

        if (obj instanceof Object) {
            copy = {};
            for (const attr in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, attr)) {
                    (<any>copy)[attr] = this.deepCopy(obj[attr]);
                }
            }
            return copy;
        }
    }
}

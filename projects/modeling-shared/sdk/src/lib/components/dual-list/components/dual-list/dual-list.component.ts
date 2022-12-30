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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DualListItem } from '../../interfaces/dual-list-item.interface';

@Component({
  selector: 'modelingsdk-dual-list',
  templateUrl: './dual-list.component.html',
  styleUrls: ['./dual-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DualListComponent implements OnChanges {

    @Input()
    availableItems: DualListItem[] = [];

    @Input()
    preselectedItems: DualListItem[] = [];

    @Output()
    selectedItemsChange = new EventEmitter<DualListItem[]>();

    selectedItems: DualListItem[] = [];
    unselectedItems: DualListItem[] = [];

    readonly selectIcon = 'add_circle_outline';
    readonly removeIcon = 'remove_circle_outline';

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.availableItems) {
            const unselectedItemsRecord: Record<string, DualListItem> = {};

            this.availableItems.forEach(item => unselectedItemsRecord[item.name] = item);
            this.unselectedItems = Object.values(unselectedItemsRecord) as DualListItem[];
        }

        if(changes.preselectedItems) {
            const selectedItemsRecord: Record<string, DualListItem> = {};

            this.preselectedItems.forEach(item => selectedItemsRecord[item.name] = item);
            this.selectedItems = Object.values(selectedItemsRecord) as DualListItem[];
        }
    }

    selectAll(): void {
        if (this.unselectedItems.length) {
            this.selectedItems = [...this.selectedItems, ...this.unselectedItems];
            this.unselectedItems = [];
            this.emitSelectedItems();
        }
    }

    unselectAll(): void {
        if (this.selectedItems.length) {
            this.unselectedItems = [...this.unselectedItems, ...this.selectedItems];
            this.selectedItems = [];
            this.emitSelectedItems();
        }
    }

    onSelectItem(selectedItem: DualListItem): void {
        this.selectedItems.push(selectedItem);
        this.unselectedItems = this.unselectedItems.filter((item: DualListItem) =>  item !== selectedItem);
        this.emitSelectedItems();
    }

    onUnselectItem(selectedItem: DualListItem): void {
        this.unselectedItems.push(selectedItem);
        this.selectedItems = this.selectedItems.filter((item: DualListItem) =>  item !== selectedItem);
        this.emitSelectedItems();
    }

    private emitSelectedItems(): void {
        this.selectedItemsChange.emit(this.selectedItems);
    }
}

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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { EntityMetadataMap } from '@ngrx/data';
import { ModelEditorModule } from '../../model-editor/model-editor.module';
import { TabManagerService } from '../../services/tab-manager.service';
import { TabManagerEntityService } from './tab-manager-entity.service';
import { TabManagerComponent } from './tab-manager.component';

export function activeTab(entities: { active: boolean }[]) {
    return entities.filter(e => e.active === true);
}

export const entityMetaData: EntityMetadataMap = {
    TabModel: {
        filterFn : activeTab
    }
};
@NgModule({
    imports: [
        CommonModule,
        MatTabsModule,
        MatIconModule,
        ModelEditorModule,
        MatButtonModule
    ],
    providers: [TabManagerService, TabManagerEntityService],
    declarations: [TabManagerComponent],
    exports: [TabManagerComponent]
})
export class TabManagerModule { }

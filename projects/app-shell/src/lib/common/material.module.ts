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

import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';

@NgModule({
    imports: [
        MatSlideToggleModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatSidenavModule,
        MatProgressBarModule,
        MatCardModule,
        MatListModule,
        MatMenuModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatTableModule,
        MatBadgeModule,
        MatIconModule
    ],
    exports: [
        MatSlideToggleModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatSidenavModule,
        MatProgressBarModule,
        MatCardModule,
        MatListModule,
        MatMenuModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatTableModule,
        MatBadgeModule,
        MatIconModule
    ],
    providers: [
        { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '0ms' } }
    ]
})
export class MaterialModule {
}

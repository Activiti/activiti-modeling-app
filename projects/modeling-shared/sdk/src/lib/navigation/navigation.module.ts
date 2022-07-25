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

import { CoreModule } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MainNavigationComponent } from './components/main-navigation/main-navigation.component';
import { MainNavigationHeaderComponent } from './components/main-header/main-navigation-header.component';
import { UserInfoMenuComponent } from './components/user-info-menu/user-info-menu.component';
import { StudioHeaderComponent } from './components/studio-header/studio-header.component';
import { SearchHeaderComponent } from './components/search-header/search-header.component';
import { PreferProjectButtonModule } from '../components/prefer-project-button/prefer-project-button.module';
import { ThemeMenuComponent } from './components/theme-menu/theme-menu.component';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        PreferProjectButtonModule,
        RouterModule.forChild([]),
        CoreModule.forChild()
    ],
    declarations: [
        MainNavigationComponent,
        MainNavigationHeaderComponent,
        UserInfoMenuComponent,
        StudioHeaderComponent,
        SearchHeaderComponent,
        ThemeMenuComponent
    ] ,
    exports: [
        MainNavigationComponent,
        MainNavigationHeaderComponent,
        UserInfoMenuComponent,
        StudioHeaderComponent,
        SearchHeaderComponent,
        ThemeMenuComponent
    ]
})
export class NavigationModule { }

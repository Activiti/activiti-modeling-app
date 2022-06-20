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
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { AmaRouterStateSerializer } from './router/router-state.serializer';

import { UiEffects } from './effects/ui.effects';
import { SnackbarEffects } from './effects/snackbar.effects';
import { DialogEffects } from './effects/dialog.effects';
import { SettingsEffects } from './effects/settings.effects';
import { AuthEffects } from './effects/auth.effects';
import { rootReducers } from './reducers/reducers';
import { INITIAL_STATE } from './states/app.state';
import { metaReducers } from './reducers/meta.reducers';
import { ChangeThemeEffects } from './effects/change-theme.effects';
import { TabEffects } from './effects/tab.effects';
import { EntityDataModule } from '@ngrx/data';
import { entityMetaData } from '@alfresco-dbp/modeling-shared/sdk';
@NgModule({
    imports: [
        StoreModule.forRoot(rootReducers, {
            initialState: INITIAL_STATE,
            metaReducers: metaReducers,
            runtimeChecks: {
                strictStateImmutability: false,
                strictActionImmutability: false
            }
        }),
        EffectsModule.forRoot([
            AuthEffects,
            SnackbarEffects,
            DialogEffects,
            SettingsEffects,
            ChangeThemeEffects,
            UiEffects,
            TabEffects
        ]),
        StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
        EntityDataModule.forRoot({entityMetadata: entityMetaData})
    ],
    providers: [{ provide: RouterStateSerializer, useClass: AmaRouterStateSerializer }]
})
export class AppStoreModule {}

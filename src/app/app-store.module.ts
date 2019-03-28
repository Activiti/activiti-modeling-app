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
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { AmaRouterStateSerializer } from './common/helpers/router-state.serializer';

import { UiEffects } from './store/effects/ui.effects';
import { SnackbarEffects } from './store/effects/snackbar.effects';
import { DialogEffects } from './store/effects/dialog.effects';
import { SettingsEffects } from './store/effects/settings.effects';

import { environment } from '../environments/environment';
import { AuthEffects } from './store/effects/auth.effects';
import { rootReducers } from './store/reducers/reducers';
import { INITIAL_STATE } from './store/states/app.state';
import { metaReducers } from './store/reducers/meta.reducers';
import { EntityEffects } from './store/effects/entity.effects';

@NgModule({
    imports: [
        StoreModule.forRoot(rootReducers, { initialState: INITIAL_STATE, metaReducers: metaReducers }),
        EffectsModule.forRoot([
            AuthEffects,
            SnackbarEffects,
            DialogEffects,
            SettingsEffects,
            UiEffects,
            EntityEffects
        ]),
        StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
        !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : []
    ],
    providers: [{ provide: RouterStateSerializer, useClass: AmaRouterStateSerializer }]
})
export class AppStoreModule {}

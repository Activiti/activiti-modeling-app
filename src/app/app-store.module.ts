import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { AmaRouterStateSerializer } from './common/helpers/router-state.serializer';

import { UiEffects } from './store/effects/ui.effects';
import { SnackbarEffects } from './store/effects/snackbar.effects';
import { DialogEffects } from './store/effects/dialog.effects';

import { environment } from '../environments/environment';
import { AuthEffects } from './store/effects/auth.effects';
import { rootReducers } from './store/reducers/reducers';
import { INITIAL_STATE } from './store/states/app.state';
import { metaReducers } from './store/reducers/meta.reducers';

@NgModule({
    imports: [
        StoreModule.forRoot(rootReducers, { initialState: INITIAL_STATE, metaReducers: metaReducers }),
        EffectsModule.forRoot([
            AuthEffects,
            SnackbarEffects,
            DialogEffects,
            UiEffects
        ]),
        StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
        !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : []
    ],
    providers: [{ provide: RouterStateSerializer, useClass: AmaRouterStateSerializer }]
})
export class AppStoreModule {}

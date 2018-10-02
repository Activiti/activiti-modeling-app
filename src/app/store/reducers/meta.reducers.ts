import { MetaReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { logoutMetaReducer } from './logout.meta.reducer';
import { storeFreeze } from 'ngrx-store-freeze';

export const metaReducers: MetaReducer<any>[] = [
    ...(!environment.production ? [storeFreeze] : []),
    logoutMetaReducer
];

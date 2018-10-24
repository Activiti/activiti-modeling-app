import { routerReducer } from '@ngrx/router-store';
import { appReducer } from './app.reducer';

export const rootReducers = {
    app: appReducer,
    router: routerReducer
};

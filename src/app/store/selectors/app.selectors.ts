import { createSelector } from '@ngrx/store';
import { AppState, selectApp } from 'ama-sdk';

export const selectMenuOpened = createSelector(selectApp, (state: AppState) => state.menuOpened);

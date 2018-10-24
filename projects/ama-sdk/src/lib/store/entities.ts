import { InjectionToken } from '@angular/core';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

export const getEntitiesState = createFeatureSelector<any>('entities');

export const ENTITIES_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<any>>('entities-reducer');
export const ENTITY_REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<any>>('entity-reducer');

export function entityReducerFactory(entityReducers: any[]): ActionReducerMap<any> {
    return entityReducers.reduce((reducers, entityReducer) => {
        return {
            ...reducers,
            ...entityReducer
        };
    }, {});
}

export function provideEntity(entityReducerObject: any) {
    return [
        { provide: ENTITY_REDUCERS_TOKEN, useValue: entityReducerObject, multi: true },
        { provide: ENTITIES_REDUCER_TOKEN, deps: [ ENTITY_REDUCERS_TOKEN ], useFactory: entityReducerFactory }
    ];
}

import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { ENTITIES_REDUCER_TOKEN, ENTITY_REDUCERS_TOKEN, entityReducerFactory } from './entities';

/*
    Experimental: It would be better to use it instead of the

    StoreModule.forFeature('entities', ENTITIES_REDUCER_TOKEN)
    and
    provideEntity({ plugins: pluginEntitiesReducer })

    in Editor module plugins

    But when using it, Angular error is thrown:
    Function calls are not supported in decorators but, ...
*/
@NgModule({
    imports: [ StoreModule.forFeature('entities', ENTITIES_REDUCER_TOKEN), ]
})
export class AmaStoreModule {
    static registerEntity(entityName: string, entityReducer): ModuleWithProviders {
        const entityReducerProvider = { [entityName]: entityReducer };
        return {
            ngModule: AmaStoreModule,
            providers: [
                { provide: ENTITY_REDUCERS_TOKEN, useValue: entityReducerProvider, multi: true },
                { provide: ENTITIES_REDUCER_TOKEN, deps: [ ENTITY_REDUCERS_TOKEN ], useFactory: entityReducerFactory }
            ]
        };
    }
}

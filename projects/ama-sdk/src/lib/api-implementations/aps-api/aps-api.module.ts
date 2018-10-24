import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APSApi } from './aps-api';
import { APSApplicationApi } from './application-api';
import { APSProcessApi } from './process-api';
import { APSConnectorApi } from './connector-api';
import { AmaApi } from '../../api/api.interface';
import { EntityFactory } from './entity.factory';
import { APSFormApi } from './form-api';
import { APSPluginApi } from './plugin-api';
import { APSDataApi } from './data-api';
import { APSDecisionTableApi } from './decision-table-api';
import { RequestApiHelper } from './request-api.helper';

@NgModule({
    imports: [CommonModule]
})
export class APSApiModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: APSApiModule,
            providers: [
                { provide: AmaApi, useClass: APSApi },
                EntityFactory,
                RequestApiHelper,
                APSApplicationApi,
                APSProcessApi,
                APSConnectorApi,
                APSFormApi,
                APSPluginApi,
                APSDataApi,
                APSDecisionTableApi
            ]
        };
    }
}

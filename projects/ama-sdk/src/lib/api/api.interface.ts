import { Injectable } from '@angular/core';
import { ApplicationApi } from './application-api.interface';
import { ProcessApi } from './process-api.interface';
import { ConnectorApi } from './connector-api.interface';
import { FormApi } from './form-api.interface';
import { PluginApi } from './plugin-api.interface';
import { DataApi } from './data-api.interface';
import { DecisionTableApi } from './decision-table-api.interface';

@Injectable()
export abstract class AmaApi {
    public Application: ApplicationApi;
    public Process: ProcessApi;
    public Connector: ConnectorApi;
    public Form: FormApi;
    public Plugin: PluginApi;
    public Data: DataApi;
    public DecisionTable: DecisionTableApi;
}

import { Injectable } from '@angular/core';
import { AmaApi } from '../../api/api.interface';
import { APSApplicationApi } from './application-api';
import { APSProcessApi } from './process-api';
import { APSConnectorApi } from './connector-api';
import { APSFormApi } from './form-api';
import { APSPluginApi } from './plugin-api';
import { APSDataApi } from './data-api';
import { APSDecisionTableApi } from './decision-table-api';

@Injectable()
export class APSApi implements AmaApi {
    constructor(
        public Application: APSApplicationApi,
        public Process: APSProcessApi,
        public Connector: APSConnectorApi,
        public Form: APSFormApi,
        public Plugin: APSPluginApi,
        public Data: APSDataApi,
        public DecisionTable: APSDecisionTableApi
    ) {}
}

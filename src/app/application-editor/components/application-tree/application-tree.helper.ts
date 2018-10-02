import { Injectable } from '@angular/core';
import { PROCESS, ARTIFACT_TYPE } from 'ama-sdk';
import { FilterDataAdaper } from './data-adapters/filter-data-adapter.interface';
import { ProcessesFilterDataAdapter } from './data-adapters/processes-filter.data-adapter';

export interface ArtifactTypeFilter {
    type: ARTIFACT_TYPE;
    name: string;
    icon: string;
}

@Injectable()
export class ApplicationTreeHelper {
    private _filters: ArtifactTypeFilter[];
    private filter2Adapter: { [type: string]: FilterDataAdaper };

    constructor(
        private processesFilterDataAdapter: ProcessesFilterDataAdapter
    ) {
        this._filters = [
            { type: PROCESS, name: 'APP.APPLICATION.TREE.PROCESSES', icon: 'device_hub' }
        ];

        this.filter2Adapter = {
            [PROCESS]: this.processesFilterDataAdapter
        };
    }

    getFilters(): ArtifactTypeFilter[] {
        return this._filters;
    }

    getDataAdapter(filterType: string): FilterDataAdaper {
        return this.filter2Adapter[filterType];
    }
}

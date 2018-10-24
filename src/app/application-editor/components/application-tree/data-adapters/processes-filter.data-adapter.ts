import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ShowProcessesAction } from '../../../store/actions/processes';
import {
    selectProcessesArray,
    selectProcessesLoading,
    selectOpenedFilters
} from '../../../store/selectors/application-tree.selectors';
import { Process, ARTIFACT_TYPE, PROCESS } from 'ama-sdk';
import { FilterDataAdaper } from './filter-data-adapter.interface';
import { map } from 'rxjs/operators';
import { AmaState } from 'ama-sdk';

@Injectable()
export class ProcessesFilterDataAdapter implements FilterDataAdaper {
    openedFilters$: Observable<ARTIFACT_TYPE[]>;

    constructor(private store: Store<AmaState>) {
        this.openedFilters$ = this.store.select(selectOpenedFilters);
    }

    get expanded(): Observable<boolean> {
        return this.openedFilters$.pipe(map(filters => filters.indexOf(PROCESS) !== -1));
    }

    get contents(): Observable<Partial<Process>[]> {
        return this.store.select(selectProcessesArray);
    }

    get loading(): Observable<boolean> {
        return this.store.select(selectProcessesLoading);
    }

    load(applicationId: string): void {
        this.store.dispatch(new ShowProcessesAction(applicationId));
    }
}

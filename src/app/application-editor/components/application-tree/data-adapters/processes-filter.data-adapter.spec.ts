import { Store } from '@ngrx/store';
import { ProcessesFilterDataAdapter } from './processes-filter.data-adapter';
import { TestBed, async } from '@angular/core/testing';
import { selectSelectedProcessId } from '../../../../store/selectors/app.selectors';
import { of } from 'rxjs';
import { selectOpenedFilters, selectProcessesLoading } from '../../../store/selectors/application-tree.selectors';
import { cold } from 'jasmine-marbles';
import { PROCESS } from 'ama-sdk';
import { AmaState } from 'ama-sdk';

describe('ProcessesFilterDataAdapter ', () => {
    let store: Store<AmaState>;
    let processFilterDataAdapter: ProcessesFilterDataAdapter;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            providers: [
                ProcessesFilterDataAdapter,
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectSelectedProcessId) {
                                return of({});
                            } else if (selector === selectOpenedFilters) {
                                return of([PROCESS]);
                            } else if (selector === selectProcessesLoading) {
                                return of(true);
                            }

                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        store = TestBed.get(Store);
        processFilterDataAdapter = TestBed.get(ProcessesFilterDataAdapter);
    });

    it('should test expanded getter', () => {
        processFilterDataAdapter.expanded.subscribe(expanded => {
            expect(expanded).toBe(true);
        });
    });

    it('should test loading getter', () => {
        const expected = cold('(x|)', { x: true });
        expect(processFilterDataAdapter.loading).toBeObservable(expected);
    });

    it('should test contents getter', () => {
        const expected = cold('(x|)', { x: {} });
        expect(processFilterDataAdapter.contents).toBeObservable(expected);
    });

    it('should test load function', () => {
        spyOn(store, 'dispatch');
        processFilterDataAdapter.load('id');

        expect(store.dispatch).toHaveBeenCalled();
    });
});

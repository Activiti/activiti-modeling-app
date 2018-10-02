import { TestBed, async } from '@angular/core/testing';
import { ApplicationTreeHelper, ArtifactTypeFilter } from './application-tree.helper';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProcessesFilterDataAdapter } from './data-adapters/processes-filter.data-adapter';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { PROCESS } from 'ama-sdk';


describe('ApplicationTreeHelper ', () => {
    let service: ApplicationTreeHelper;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            providers: [
                ApplicationTreeHelper,
                ProcessesFilterDataAdapter
                {
                    provide: Store, useValue: {select: jest.fn().mockReturnValue(of({}))}
                }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(ApplicationTreeHelper);
    });

    it ('getFilters should return the array of filters', () => {
        const filters: ArtifactTypeFilter[] = service.getFilters();

        expect(filters).toBeDefined();

        expect(filters.length).toBe(1);
        expect(filters[0].type).toBe(PROCESS);
    });

    it ('getDataAdapter should return a filterData adapter',  () => {
        const dataAdapter = service.getDataAdapter(PROCESS);

        expect(dataAdapter).toBeDefined();
        expect(dataAdapter.expanded.subscribe).toBeDefined();
        expect(dataAdapter.contents.subscribe).toBeDefined();
        expect(dataAdapter.loading.subscribe).toBeDefined();
        expect(dataAdapter.load).toBeDefined();
    });
});

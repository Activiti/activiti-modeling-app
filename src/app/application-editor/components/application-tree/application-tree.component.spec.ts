import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ApplicationTreeComponent } from './application-tree.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationTreeHelper } from './application-tree.helper';
import { ProcessesFilterDataAdapter } from './data-adapters/processes-filter.data-adapter';
import { of } from 'rxjs';
import { PROCESS, FORM } from 'ama-sdk';
import { selectSelectedAppId } from 'ama-sdk';
import { selectMenuOpened } from '../../../store/selectors/app.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ApplicationTreeFilterComponent ', () => {
    let fixture: ComponentFixture<ApplicationTreeComponent>;
    let component: ApplicationTreeComponent;
    let helper: ApplicationTreeHelper;
    const mockFilters = [
        { type: PROCESS, name: 'APP.APPLICATION.TREE.PROCESSES', icon: 'device_hub' },
        { type: FORM, name: 'APP.APPLICATION.TREE.FORMS', icon: 'subject' },
    ];

    const appId = 'appId';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            declarations: [ApplicationTreeComponent],
            providers: [
                ApplicationTreeHelper,
                ProcessesFilterDataAdapter
                {
                    provide: Store, useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectMenuOpened) {
                                return of(true);
                            } else if (selector === selectSelectedAppId) {
                                return of(appId);
                            }
                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                },
                {
                    provide: ApplicationTreeHelper, useValue:
                        {
                            getFilters: jest.fn().mockReturnValue(mockFilters),
                            getDataAdapter: jest.fn().mockReturnValue({
                                expanded: of(true),
                                loading: of(true),
                                content: of([]),
                                load: jest.fn()
                            })
                        }
                }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationTreeComponent);
        component = fixture.componentInstance;
        helper = TestBed.get(ApplicationTreeHelper);
    });


    it ('should create', () => {
        expect(component).toBeTruthy();
    });

    it ('application tree should contain all the expected filters', () => {
        fixture.detectChanges();

        const filters = fixture.nativeElement.querySelectorAll('ama-application-tree-filter');
        expect(filters.length).toBe(2);
    });

    it ('if filter is opened method getDataAdapter should be called with the filter type', () => {
        fixture.detectChanges();
        const filters = fixture.nativeElement.querySelectorAll('ama-application-tree-filter');

        filters[0].dispatchEvent(new Event('opened'));
        expect(helper.getDataAdapter).toHaveBeenCalledWith(mockFilters[0].type);
    });
});

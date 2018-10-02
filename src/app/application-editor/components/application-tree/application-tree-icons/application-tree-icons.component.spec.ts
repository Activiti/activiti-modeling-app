import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ApplicationTreeIconsComponent } from './application-tree-icons.component';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationTreeHelper, ArtifactTypeFilter } from '../application-tree.helper';
import { MatIconModule } from '@angular/material';
import { PROCESS, CONNECTOR, ARTIFACT_TYPE } from 'ama-sdk';
import { SetMenuAction, SET_MENU } from '../../../../store/actions';
import { OpenFilterAction, OPEN_FILTER } from '../../../store/actions/application';
import { AmaState } from 'ama-sdk';

class ApplicationTreeHelperMock {
    public calledWithType: ARTIFACT_TYPE;
    public loadMock = jest.fn();

    getFilters(): ArtifactTypeFilter[] {
        return [{ type: PROCESS, name: '', icon: 'device_hub' }, { type: CONNECTOR, name: '', icon: 'subject' }];
    }

    getDataAdapter(filterType: ARTIFACT_TYPE) {
        this.calledWithType = filterType;
        return {
            load: this.loadMock
        };
    }
}

describe('ApplicationTreeIconsComponent', () => {
    let fixture: ComponentFixture<ApplicationTreeIconsComponent>,
        component: ApplicationTreeIconsComponent,
        store: Store<AmaState>,
        applicationTreeHelper: ApplicationTreeHelperMock;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({}), TranslateModule.forRoot(), NoopAnimationsModule, MatIconModule],
            declarations: [ApplicationTreeIconsComponent],
            providers: [{ provide: ApplicationTreeHelper, useClass: ApplicationTreeHelperMock }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationTreeIconsComponent);
        component = fixture.componentInstance;
        store = TestBed.get(Store);
        applicationTreeHelper = TestBed.get(ApplicationTreeHelper);

        fixture.detectChanges();
    });

    it('should display the filter icons provided by the applicationTreeHelper', () => {
        const icons = fixture.debugElement.queryAll(By.css('[data-automation-class="application-tree-icon"]'));

        expect(icons.length).toBe(2);
    });

    it('should dispatch the right actions on the icon click', () => {
        spyOn(store, 'dispatch');

        const processIcon = fixture.debugElement.query(By.css('[data-automation-class="application-tree-icon"]'));
        processIcon.triggerEventHandler('click', {});

        const setMenuAction: SetMenuAction = store.dispatch.calls.argsFor(0)[0];
        expect(setMenuAction.type).toBe(SET_MENU);
        expect(setMenuAction.payload).toBe(true);

        const openFilterAction: OpenFilterAction = store.dispatch.calls.argsFor(1)[0];
        expect(openFilterAction.type).toBe(OPEN_FILTER);
        expect(openFilterAction.filterType).toBe(PROCESS);
    });

    it('should the getDataAdapter and load methods with the proper parameters', () => {
        const icons = fixture.debugElement.queryAll(By.css('[data-automation-class="application-tree-icon"]')),
            connectorIcon = icons[1];

        component.applicationId = 'app-id';

        connectorIcon.triggerEventHandler('click', {});

        expect(applicationTreeHelper.calledWithType).toBe(CONNECTOR);
        expect(applicationTreeHelper.loadMock).toHaveBeenCalledWith('app-id');
    });
});

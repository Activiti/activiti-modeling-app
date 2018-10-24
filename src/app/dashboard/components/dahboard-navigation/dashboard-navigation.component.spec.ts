import { DashboardNavigationComponent } from './dashboard-navigation.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { AmaState } from 'ama-sdk/src/public_api';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule, MatIconModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslationMock, TranslationService, AppConfigService } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { UploadApplicationAttemptAction, UPLOAD_APPLICATION_ATTEMPT } from '../../store/actions/applications';

describe ('Dashboard navigation Component', () => {
    let component: DashboardNavigationComponent;
    let fixture: ComponentFixture<DashboardNavigationComponent>;
    let store: Store<AmaState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                MatTooltipModule,
                MatIconModule,
                NoopAnimationsModule,
                RouterTestingModule
            ],
            declarations: [
                DashboardNavigationComponent
            ],
            providers: [
                {
                    provide: Store,
                    useValue: {dispatch: jest.fn(), select: jest.fn().mockReturnValue(of({}))}
                },
                { provide: TranslationService, useClass: TranslationMock },
                { provide: AppConfigService, useValue: {get: jest.fn('navigation').mockRejectedValue('{}')} }
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardNavigationComponent);
        store = TestBed.get(Store);
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    it('clicking on upload button should dispatch a UploadApplicationAttemptAction, and the fileImput should be cleaned', () => {
        const button = fixture.nativeElement.querySelector('.app-upload-btn');
        spyOn(component.fileInput.nativeElement, 'click');
        spyOn(store, 'dispatch');
        button.click();
        fixture.detectChanges();
        expect(component.fileInput.nativeElement.click).toHaveBeenCalled();

        component.fileInput.nativeElement.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalled();

        const uploadAction: UploadApplicationAttemptAction = store.dispatch.calls.argsFor(0)[0];
        const file = store.dispatch.calls.argsFor(0)[1];
        expect(uploadAction.type).toBe(UPLOAD_APPLICATION_ATTEMPT);
        expect(uploadAction.file).toBe(file);

        expect(component.fileInput.nativeElement.value).toBe('');
    });

});

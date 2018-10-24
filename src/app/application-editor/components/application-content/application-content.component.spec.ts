import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ApplicationContentComponent } from './application-content.component';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material';
import { ToolbarModule } from '@alfresco/adf-core';
import { ApplicationEditorState } from 'ama-sdk';
import { of } from 'rxjs';
import { ExportApplicationAction } from '../../store/actions/application';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('ApplicationContentComponent', () => {
    let fixture: ComponentFixture<ApplicationContentComponent>;
    let store: Store<ApplicationEditorState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatIconModule,  ToolbarModule, TranslateModule.forRoot()],
            declarations: [ApplicationContentComponent],
            providers: [{provide: Store, useValue: {dispatch: jest.fn(), select: jest.fn().mockReturnValue(of({}))}}]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationContentComponent);
        store = TestBed.get(Store);
        fixture.detectChanges();
    });

    it('download button exists', () => {
        const button = fixture.nativeElement.querySelector('.download-app-btn');

        expect(button === null).toBeFalsy();
    });

    it('clicking on download button should dispatch an ExportApplicationAction', () => {
        spyOn(store, 'dispatch');
        const button = fixture.debugElement.query(By.css('.download-app-btn'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();
        const exportAction: ExportApplicationAction = store.dispatch.calls.argsFor(0)[0];


        expect(exportAction.type).toBe('EXPORT_APPLICATION');
        expect(exportAction.payload).toEqual({});
    }

    );
});

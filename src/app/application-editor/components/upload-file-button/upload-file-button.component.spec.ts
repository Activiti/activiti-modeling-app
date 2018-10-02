import { UploadFileButtonComponent } from './upload-file-button.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule, MatIconModule } from '@angular/material';
import { Store } from '@ngrx/store';
import { PROCESS_FILE_FORMAT } from '../../../common/helpers/create-entries-names';
import { UploadProcessAttemptAction, UPLOAD_PROCESS_ATTEMPT } from '../../store/actions/processes';
import { AmaState } from 'ama-sdk';


describe('UploadFileButtonComponent', () => {
    let component: UploadFileButtonComponent;
    let fixture: ComponentFixture<UploadFileButtonComponent>;
    let store: Store<AmaState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                MatTooltipModule,
                MatIconModule
            ],
            declarations: [
                UploadFileButtonComponent
            ],
            providers: [
                {
                    provide: Store,
                    useValue: {dispatch: jest.fn()}
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadFileButtonComponent);
        store = TestBed.get(Store);
        component = fixture.componentInstance;
        component.applicationId = 'appId';
    });

    it('should test acceptedFileTypes getter if type is process', () => {
        component.type = 'process';
        const result = component.acceptedFileTypes;
        expect(result).toBe(PROCESS_FILE_FORMAT);
    });

    it('should test acceptedFileTypes getter if type is not process', () => {
        component.type = 'test';
        const result = component.acceptedFileTypes;
        expect(result).toBe(null);
    });

    it('clicking on the upload button should fire a click event on input field', () => {
        spyOn(component.fileInput.nativeElement, 'click');
        const button = fixture.nativeElement.querySelector('button');
        button.click();

        expect(component.fileInput.nativeElement.click).toHaveBeenCalled();
    });

    it('onUpload method should dispatch a UploadProcessAttemptAction if type is defined', () => {
        spyOn(store, 'dispatch');

        component.type = 'process';
        const inputField = fixture.nativeElement.querySelector('input');
        inputField.dispatchEvent(new Event('change'));

        const uploadAction: UploadProcessAttemptAction = store.dispatch.calls.argsFor(0)[0];
        expect(uploadAction.type).toBe(UPLOAD_PROCESS_ATTEMPT);
        expect(store.dispatch).toHaveBeenCalledWith(uploadAction);
        expect(inputField.value).toBe('');
    });

    it ('onUpload method should not dispatch any action if type is different than defined', () => {
        component.type = 'test';
        spyOn(store, 'dispatch');

        const inputField = fixture.nativeElement.querySelector('input');
        inputField.dispatchEvent(new Event('change'));
        expect(store.dispatch).not.toHaveBeenCalled();
    });
});

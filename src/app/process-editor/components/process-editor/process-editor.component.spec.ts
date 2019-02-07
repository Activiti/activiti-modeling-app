 /*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule, AmaState, SnackbarErrorAction } from 'ama-sdk';
import { CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ProcessEditorComponent } from './process-editor.component';
import { ProcessModelerService } from '../../services/process-modeler.service';
import { Component, Output, Input, EventEmitter } from '@angular/core';
import { CardViewPropertiesFactory } from '../../services/cardview-properties/cardview-properties.factory';
import { RouterTestingModule } from '@angular/router/testing';
import { mockProcess } from '../../store/process.mock';
import { DownloadProcessAction, ValidateProcessAttemptAction } from '../../store/process-editor.actions';


@Component({
    selector: 'ama-process-header',
    template: '<p>mock component</p>'
})
export class ProcessHeaderComponent {
    @Input() process;
    @Input() breadcrumbs$;
    @Output() save = new EventEmitter<any>();
    @Output() delete = new EventEmitter<any>();
    @Output() download = new EventEmitter<any>();
}

@Component({
    selector: 'ama-process-modeler',
    template: '<p>mock component</p>'
})
export class ProcessModelerComponent {
    @Input() source;
}

@Component({
    selector: 'ama-process-properties',
    template: '<p>mock component</p>'
})
export class ProcessPropertiesComponent {}



describe('ProcessEditorComponent', () => {
    let fixture: ComponentFixture<ProcessEditorComponent>;
    let component: ProcessEditorComponent;
    let processModelerService: ProcessModelerService;
    let store: Store<AmaState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                CoreModule,
                MatIconModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                RouterTestingModule
            ],
            providers: [
                CardViewPropertiesFactory,
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: ProcessModelerService,
                    useValue: {
                        export: jest.fn().mockReturnValue(of({})),
                        getRootProcessElement: jest.fn().mockReturnValue({
                            businessObject: {
                                get: jest.fn().mockReturnValue(true),
                                name: mockProcess.name
                            }
                        }),
                    }
                },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockReturnValue(of({})),
                        dispatch: jest.fn().mockReturnValue(of({}))
                    }
                }
            ],
            declarations: [
                ProcessEditorComponent,
                ProcessHeaderComponent,
                ProcessModelerComponent,
                ProcessPropertiesComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessEditorComponent);
        store = TestBed.get(Store);
        processModelerService = TestBed.get(ProcessModelerService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render component', () => {
        expect(component).not.toBeNull();
    });

    describe('downloadDiagram', () => {
        let downloadDiagram: jest.Mock;

        beforeEach(() => {
            downloadDiagram = <jest.Mock>processModelerService.export;
        });

        it('should dispatch ValidateProcessAttemptAction if export() is ok', async(() => {
            spyOn(store, 'dispatch');

            const processContent = '<some xml />';
            downloadDiagram.mockReturnValue(Promise.resolve(processContent));
            component.downloadDiagram(mockProcess);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const expected = new ValidateProcessAttemptAction({
                    title: 'APP.DIALOGS.CONFIRM.DOWNLOAD.PROCESS',
                    processId: mockProcess.id,
                    content: processContent,
                    action: new DownloadProcessAction(mockProcess)
                });

                expect(store.dispatch).toHaveBeenCalledWith(expected);
            });
        }));

        it('should dispatch SnackbarErrorAction if export() return an error', async(() => {
            spyOn(store, 'dispatch');

            downloadDiagram.mockReturnValue(Promise.reject());
            component.downloadDiagram(mockProcess);
            fixture.detectChanges();

            fixture.whenStable().catch(() => {
                const expected = new SnackbarErrorAction('APP.PROCESSES.ERRORS.DOWNLOAD_DIAGRAM');
                expect(store.dispatch).toHaveBeenCalledWith(expected);
            });
        }));
    });

    describe('saveDiagram', () => {
        let saveDiagram: jest.Mock;

        beforeEach(() => {
            saveDiagram = <jest.Mock>processModelerService.export;
        });

        it('should dispatch UpdateProcessAttemptAction if export() is ok', async(() => {
            spyOn(store, 'dispatch');

            const processContent = '<some xml />';
            saveDiagram.mockReturnValue(Promise.resolve(processContent));
            component.saveDiagram(mockProcess.id);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(store.dispatch).toHaveBeenCalled();
            });
        }));

        it('should dispatch SnackbarErrorAction if export() return an error', async(() => {
            spyOn(store, 'dispatch');

            saveDiagram.mockReturnValue(Promise.reject());
            component.saveDiagram(mockProcess.id);
            fixture.detectChanges();

            fixture.whenStable().catch(() => {
                const expected = new SnackbarErrorAction('APP.PROCESS_EDITOR.ERRORS.SAVE_DIAGRAM');
                expect(store.dispatch).toHaveBeenCalledWith(expected);
            });
        }));
    });

});

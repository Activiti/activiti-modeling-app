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

import { TestBed, async } from '@angular/core/testing';
import { ProcessDiagramLoaderService } from './process-diagram-loader.service';
import { ProcessModelerServiceImplementation } from './process-modeler.service';
import {
    ProcessModelerServiceToken,
    BpmnFactoryToken,
    ProcessModelerService,
    XmlParsingProblem,
    MESSAGE,
    SnackbarWarningAction,
    SnackbarErrorAction
} from 'ama-sdk';
import { Store } from '@ngrx/store';
import { BpmnFactoryMock } from './bpmn-js/bpmn-js.mock';
import { of, throwError } from 'rxjs';
import { getProcessLogInitiator } from './process-editor.constants';
import { SelectModelerElementAction } from '../store/process-editor.actions';
import { logError, logWarning } from 'ama-sdk';

describe('ProcessDiagramLoaderService', () => {

    let service: ProcessDiagramLoaderService,
        modelerService: ProcessModelerService,
        store: Store<any>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ProcessDiagramLoaderService,
                { provide: ProcessModelerServiceToken, useClass: ProcessModelerServiceImplementation },
                { provide: BpmnFactoryToken, useClass: BpmnFactoryMock },
                {
                    provide: Store,
                    useValue: {
                        dispatch: jest.fn()
                    }
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(ProcessDiagramLoaderService);
        modelerService = TestBed.get(ProcessModelerServiceToken);
        store = TestBed.get(Store);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should dispatch the right actions if no parsing error', (done) => {
        spyOn(modelerService, 'loadXml').and.returnValue(of(''));
        const expectedElement = { id: '', type: '', name: '' };
        spyOn(modelerService, 'getRootProcessElement').and.returnValue(expectedElement);

        service.load('<xml />').subscribe({complete: () => {
            expect(store.dispatch).toHaveBeenCalledWith(new SelectModelerElementAction(expectedElement));
            done();
        }});
    });

    it('should dispatch warnings in case of warnings', (done) => {
        const thrownError: XmlParsingProblem = { type: MESSAGE.WARN, messages: [ 'BIG ORANGE WARNING' ] };
        spyOn(modelerService, 'loadXml').and.returnValue(throwError(thrownError));

        service.load('<xml />').subscribe({complete: () => {
            const expectedLogAction = logWarning(getProcessLogInitiator(), [ 'BIG ORANGE WARNING' ]);
            expectedLogAction.log.datetime = (<any>expect).any(Date);

            expect(store.dispatch).toHaveBeenCalledTimes(2);
            expect(store.dispatch).toHaveBeenCalledWith(expectedLogAction);
            expect(store.dispatch).toHaveBeenCalledWith(new SnackbarWarningAction('PROCESS_EDITOR.ERRORS.PARSE_BPMN'));
            done();
        }});
    });

    it('should dispatch errors in case of errors', (done) => {
        const thrownError: XmlParsingProblem = { type: MESSAGE.ERROR, messages: [ 'BIG RED ERROR' ] };
        spyOn(modelerService, 'loadXml').and.returnValue(throwError(thrownError));

        service.load('<xml />').subscribe({complete: () => {
            const expectedLogAction = logError(getProcessLogInitiator(), [ 'BIG RED ERROR' ]);
            expectedLogAction.log.datetime = (<any>expect).any(Date);

            expect(store.dispatch).toHaveBeenCalledTimes(2);
            expect(store.dispatch).toHaveBeenCalledWith(expectedLogAction);
            expect(store.dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('PROCESS_EDITOR.ERRORS.PARSE_BPMN'));
            done();
        }});
    });
});

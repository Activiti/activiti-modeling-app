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

import { Action } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { LogFactoryService } from './log-factory.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { GeneralError } from '../interfaces/validation-errors.interface';
import { IErrorHandlerProps, IErrorResponse, ValidationService } from './validation.service';
import {
    OpenConfirmDialogAction,
    OpenInfoDialogAction,
    SetApplicationLoadingStateAction,
    SetLogHistoryVisibilityAction,
    SnackbarErrorAction,
    SnackbarInfoAction
} from '../store/app.actions';
import { PROJECT } from '../api/types';

const VALIDATE_SUCCESS_MOCK = 'Validate success mock';
class ValidateSuccessMockAction implements Action {
    readonly type = VALIDATE_SUCCESS_MOCK;
    constructor(public payload: Action[]) { }
}

const VALIDATE_FAILURE_MOCK = 'Validate failure mock';
class ValidateFailureMockAction implements Action {
    readonly type = VALIDATE_FAILURE_MOCK;
    constructor(public payload: Action[]) { }
}

describe('ValidationService', () => {

    describe('handleErrors', () => {
        let validationService: ValidationService;
        let errorHandlerPropsMock: IErrorHandlerProps;
        let LogService: LogFactoryService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    TranslateModule.forRoot()
                ],
                providers: [
                    TranslateService,
                    ValidationService,
                    {
                        provide: TranslationService,
                        useClass: TranslationMock
                    }
                ]
            });
            validationService = TestBed.inject(ValidationService);
            LogService = TestBed.inject(LogFactoryService);
            errorHandlerPropsMock = {
                error: { status: 400, message: JSON.stringify({ errors: [{ description: 'test' }] }), errors: [{ description: 'test' }] } as IErrorResponse,
                modelType: 'model',
                successAction: new ValidateSuccessMockAction([
                    new SnackbarInfoAction('Model Saved successfully.')
                ])
            };
        });

        it('should return EMPTY when response status is NOT 400', () => {
            errorHandlerPropsMock = {
                ...errorHandlerPropsMock,
                error: { status: 401, errors: [] } as IErrorResponse
            };
            const expected = cold('|');

            expect(validationService.handleErrors(errorHandlerPropsMock)).toBeObservable(expected);
        });

        it('should display confirmation dialog with error messages when response status is 400 and error action is UNDEFINED', () => {
            const expectedLogAction = LogService.logError({ key: 'Content Model Editor', displayName: 'ADV_PROJECT_MODEL_EDITOR.NAME' }, 'test');
            expectedLogAction.log.datetime = (<any>expect).any(Date);
            const expected = [
                new SetApplicationLoadingStateAction(false),
                new OpenConfirmDialogAction({
                    dialogData: {
                        title: 'APP.DIALOGS.CONFIRM.TITLE',
                        subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                        messages: ['test']
                    },
                    action: new ValidateSuccessMockAction([
                        new SnackbarInfoAction('Model Saved successfully.')
                    ]),
                }),
                expectedLogAction
            ];

            expect(validationService.handleErrors(errorHandlerPropsMock))
                .toEqual(expected);
        });

        it('should display confirmation dialog with correct error message when errors is a string and error action is UNDEFINED', () => {
            errorHandlerPropsMock = {
                ...errorHandlerPropsMock,
                error: { status: 400, message: JSON.stringify({ errors: 'generic error' }) , errors: [{description: 'generic error'}] } as IErrorResponse
            };
            const expectedLogAction = LogService.logError({ key: 'Content Model Editor', displayName: 'ADV_PROJECT_MODEL_EDITOR.NAME' }, 'generic error');
            expectedLogAction.log.datetime = (<any>expect).any(Date);
            const expected = [
                new SetApplicationLoadingStateAction(false),
                new OpenConfirmDialogAction({
                    dialogData: {
                        title: 'APP.DIALOGS.CONFIRM.TITLE',
                        subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                        messages: ['generic error']
                    },
                    action: new ValidateSuccessMockAction([
                        new SnackbarInfoAction('Model Saved successfully.')
                    ]),
                }),
                expectedLogAction
            ];

            expect(validationService.handleErrors(errorHandlerPropsMock))
                .toEqual(expected);
        });

        it('should display confirmation dialog with correct error message when errors is UNDEFINED and error action is UNDEFINED', () => {
            errorHandlerPropsMock = {
                ...errorHandlerPropsMock,
                error: { status: 400, message: JSON.stringify({ message: 'generic error message' }) , errors: [{ description: 'generic error message' }] } as IErrorResponse
            };
            const expectedLogAction = LogService.logError({ key: 'Content Model Editor', displayName: 'ADV_PROJECT_MODEL_EDITOR.NAME' }, 'generic error message');
            expectedLogAction.log.datetime = (<any>expect).any(Date);
            const expected = [
                new SetApplicationLoadingStateAction(false),
                new OpenConfirmDialogAction({
                    dialogData: {
                        title: 'APP.DIALOGS.CONFIRM.TITLE',
                        subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                        messages: ['generic error message']
                    },
                    action: new ValidateSuccessMockAction([
                        new SnackbarInfoAction('Model Saved successfully.')
                    ]),
                }),
                expectedLogAction
            ];

            expect(validationService.handleErrors(errorHandlerPropsMock))
                .toEqual(expected);
        });

        it('should display warnings in log history panel when there is only warnings in error response', () => {
            errorHandlerPropsMock = {
                ...errorHandlerPropsMock,
                errorAction: new ValidateFailureMockAction([
                    new SnackbarErrorAction('Error!')
                ]),
                error: { status: 400, message: JSON.stringify({ message: 'generic error message'}),
                         errors: [{ description: 'test warning message', warning: true }] } as IErrorResponse
            };
            const expectedLogAction = LogService.logWarning({ key: 'Content Model Editor', displayName: 'ADV_PROJECT_MODEL_EDITOR.NAME' }, 'test warning message');
            expectedLogAction.log.datetime = (<any>expect).any(Date);
            const expected = [
                new SetApplicationLoadingStateAction(false),
                new SetLogHistoryVisibilityAction(true),
                expectedLogAction
            ];

            expect(validationService.handleErrors(errorHandlerPropsMock))
                .toEqual(expected);
        });

        it('should display warnings in the log history panel and save the model when response has only warnings and error action is UNDEFINED', () => {
            errorHandlerPropsMock = {
                ...errorHandlerPropsMock,
                error: { status: 400, errors: [ {description: 'warning message', warning: true }] } as IErrorResponse
            };
            const expectedLogAction = LogService.logWarning({ key: 'Content Model Editor', displayName: 'ADV_PROJECT_MODEL_EDITOR.NAME' }, 'warning message');
            expectedLogAction.log.datetime = (<any>expect).any(Date);
            const expected = [
                new SetApplicationLoadingStateAction(false),
                new ValidateSuccessMockAction([
                    new SnackbarInfoAction('Model Saved successfully.')
                ]),
                expectedLogAction,
                new SetLogHistoryVisibilityAction(true)
            ];

            expect(validationService.handleErrors(errorHandlerPropsMock))
                .toEqual(expected);
        });

        it('should display error messages in log history panel when response status is 400 and error action is DEFINED', () => {
            errorHandlerPropsMock = {
                ...errorHandlerPropsMock,
                errorAction: new ValidateFailureMockAction([
                    new SnackbarErrorAction('Error!')
                ])
            };
            const expectedLogAction = LogService.logError({ key: 'Content Model Editor', displayName: 'ADV_PROJECT_MODEL_EDITOR.NAME' }, 'test');
            expectedLogAction.log.datetime = (<any>expect).any(Date);
            const expected = [
                new SetApplicationLoadingStateAction(false),
                new SetLogHistoryVisibilityAction(true),
                new ValidateFailureMockAction([
                    new SnackbarErrorAction('Error!')
                ]),
                expectedLogAction
            ];

            expect(validationService.handleErrors(errorHandlerPropsMock))
                .toEqual(expected);
        });

        it('should display error messages in log history panel when response status is 400 and errors is a string', () => {
            errorHandlerPropsMock = {
                ...errorHandlerPropsMock,
                error: { status: 400, message: JSON.stringify({ errors: 'generic error message' }),errors: [{ description: 'generic error message'}] } as IErrorResponse,
                errorAction: new ValidateFailureMockAction([
                    new SnackbarErrorAction('Error!')
                ])
            };
            const expectedLogAction = LogService.logError({ key: 'Content Model Editor', displayName: 'ADV_PROJECT_MODEL_EDITOR.NAME' }, 'generic error message');
            expectedLogAction.log.datetime = (<any>expect).any(Date);
            const expected = [
                new SetApplicationLoadingStateAction(false),
                new SetLogHistoryVisibilityAction(true),
                new ValidateFailureMockAction([
                    new SnackbarErrorAction('Error!')
                ]),
                expectedLogAction
            ];

            expect(validationService.handleErrors(errorHandlerPropsMock))
                .toEqual(expected);
        });

        it('should display error messages in dialog when model type is project', () => {
            errorHandlerPropsMock = {
                ...errorHandlerPropsMock,
                title: 'Validation errors found in project models',
                error: { status: 400, message: 'Validation errors found in project models', errors: [{ description: 'test' } as GeneralError] } as IErrorResponse,
                modelType: PROJECT
            };
            const expectedLogAction = LogService.logError({ key: 'Project Editor', displayName: 'Project Editor' }, 'test');
            expectedLogAction.log.datetime = (<any>expect).any(Date);
            const expected = [
                new SetLogHistoryVisibilityAction(true),
                new OpenInfoDialogAction({
                    dialogData: {
                        title: 'Validation errors found in project models',
                        subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                        messages: ['test']
                    }
                }),
                expectedLogAction
            ];

            expect(validationService.handleErrors(errorHandlerPropsMock))
                .toEqual(expected);
        });

        it('should display error messages in dialog and warnings in log history panel when model type is project', () => {
            errorHandlerPropsMock = {
                ...errorHandlerPropsMock,
                title: 'Validation errors found in project models',
                error: {
                    status: 400, message: 'Validation errors found in project models', errors: [
                        { description: 'test', warning: false } as GeneralError,
                        { description: 'warning message', warning: true } as GeneralError,
                    ]
                } as IErrorResponse,
                modelType: 'project'
            };
            const expectedErrorLogAction = LogService.logError({ key: 'Project Editor', displayName: 'Project Editor' }, 'test');
            const expectedWarningLogAction = LogService.logWarning({ key: 'Project Editor', displayName: 'Project Editor' }, 'warning message');
            expectedErrorLogAction.log.datetime = (<any>expect).any(Date);
            expectedWarningLogAction.log.datetime = (<any>expect).any(Date);
            const expected = [
                new SetLogHistoryVisibilityAction(true),
                new OpenInfoDialogAction({
                    dialogData: {
                        title: 'Validation errors found in project models',
                        subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                        messages: ['test']
                    }
                }),
                expectedErrorLogAction,
                expectedWarningLogAction
            ];

            expect(validationService.handleErrors(errorHandlerPropsMock))
                .toEqual(expected);
        });

        it('should display error messages in log history panel when model type is release', () => {
            errorHandlerPropsMock = {
                ...errorHandlerPropsMock,
                error: { status: 400, message: JSON.stringify({ message: 'error message'}), errors: [{ description: 'test' }] } as IErrorResponse,
                modelType: PROJECT
            };
            const expectedErrorLogAction = LogService.logError({ key: 'Project Editor', displayName: 'Project Editor' }, 'test');
            expectedErrorLogAction.log.datetime = (<any>expect).any(Date);
            const expected = [
                new SnackbarErrorAction('PROJECT_EDITOR.ERROR.RELEASE_PROJECT'),
                expectedErrorLogAction,
                new SetLogHistoryVisibilityAction(true)
            ];

            expect(validationService.handleReleaseErrors(errorHandlerPropsMock))
                .toEqual(expected);
        });

        it('should display error messages in log history panel when model type is release and errors array is empty', () => {
            errorHandlerPropsMock = {
                ...errorHandlerPropsMock,
                title: 'error message',
                error: { status: 400, message: 'error message', errors: [] } as IErrorResponse,
                modelType: PROJECT
            };
            const expectedErrorLogAction = LogService.logError({ key: 'Project Editor', displayName: 'Project Editor' }, 'error message');
            expectedErrorLogAction.log.datetime = (<any>expect).any(Date);
            const expected = [
                new SnackbarErrorAction('PROJECT_EDITOR.ERROR.RELEASE_PROJECT'),
                expectedErrorLogAction,
                new SetLogHistoryVisibilityAction(true),
            ];

            expect(validationService.handleReleaseErrors(errorHandlerPropsMock))
                .toEqual(expected);
        });

        it('should download the project and display warning messages in log history panel when model type is download project', () => {
            errorHandlerPropsMock = {
                ...errorHandlerPropsMock,
                error: {
                    status: 400, message: 'Validation errors found in project models', errors: [
                        { description: 'warning message', warning: true } as GeneralError,
                    ],
                } as IErrorResponse,
                modelType: null
            };
            const expectedWarningLogAction = LogService.logWarning({ key: 'Project Editor', displayName: 'Project Editor' }, 'warning message');
            expectedWarningLogAction.log.datetime = (<any>expect).any(Date);
            const expected = [
                new SetApplicationLoadingStateAction(false),
                new ValidateSuccessMockAction([
                    new SnackbarInfoAction('Model Saved successfully.')
                ]),
                expectedWarningLogAction,
                new SetLogHistoryVisibilityAction(true)
            ];

            expect(validationService.handleErrors(errorHandlerPropsMock))
                .toEqual(expected);
        });
    });
});

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
import { EMPTY, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LogFactoryService } from './log-factory.service';
import { LogMessageInitiator, LogAction } from '../store/public-api';
import { GeneralError } from '../interfaces/validation-errors.interface';
import {
    SnackbarErrorAction,
    OpenInfoDialogAction,
    OpenConfirmDialogAction,
    SetLogHistoryVisibilityAction,
    SetApplicationLoadingStateAction
} from '../store/app.actions';
import {
    UI,
    DATA,
    FORM,
    FILE,
    PROCESS,
    PROJECT,
    TRIGGER,
    CONNECTOR,
    HXP_MIXIN,
    HXP_SCHEMA,
    MODEL_TYPE,
    FORM_WIDGET,
    HXP_DOC_TYPE,
    DECISION_TABLE,
    AUTHENTICATION,
    CUSTOM_MODEL, SCRIPT, PROJECT_TYPE
} from '../api/types';

export interface IErrorResponse {
    errors?: GeneralError[];
    message: string;
    status: number;
}

type ModelType = MODEL_TYPE | PROJECT_TYPE;

export interface IErrorHandlerProps {
    error: IErrorResponse;
    modelType?: ModelType;
    successAction?: Action;
    errorAction?: Action;
    subTitle?: string;
    title?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ValidationService {
    private logInitiatorKey: string;
    private logInitiatorDisplayName: string;
    private errorMessage = '';

    constructor(private readonly logService: LogFactoryService) { }

    handleErrors(validationError: IErrorHandlerProps): Action[] | Observable<never> {
        const status = validationError.error.status;
        const errors = validationError.error.errors;
        const modelType = validationError.modelType;
        const title = validationError.title ?? 'APP.DIALOGS.CONFIRM.TITLE';
        this.errorMessage = validationError.error.message ?? 'SDK.MODEL_EDITOR.VALIDATION.DEFAULT_ERROR';
        const subTitle = validationError.subTitle ?? 'APP.DIALOGS.ERROR.SUBTITLE';

        if (status !== 400) {
            return EMPTY;
        }

        this.setLoggerProps(validationError.modelType);

        if (modelType === PROJECT ) {
            return this.handleProjectErrors(title, subTitle, errors);
         }

        if (validationError.errorAction) {
            return this.handleErrorActionLogs(validationError.errorAction, errors);
        }
        return this.handleSuccessActionLogs(title, subTitle, validationError.successAction, errors);
    }

    public handleReleaseErrors(validationError: IErrorHandlerProps): Action[] {
        this.errorMessage = validationError.error.message ?? 'SDK.MODEL_EDITOR.VALIDATION.DEFAULT_ERROR';
        this.setLoggerProps(validationError.modelType);
        return [
            new SnackbarErrorAction('PROJECT_EDITOR.ERROR.RELEASE_PROJECT'),
            this.logService.logError(this.getErrorLogInitiator(), this.generateErrorMessages(validationError.error.errors)),
            new SetLogHistoryVisibilityAction(true)
        ];
    }

    private handleProjectErrors(title: string, subTitle: string, errors: GeneralError[]): Action[] | Observable<never> {
        if (errors.length) {
            if (this.responseHasOnlyErrors(errors)) {
                return [
                    new SetLogHistoryVisibilityAction(true),
                    new OpenInfoDialogAction({
                        dialogData: {
                            title: title,
                            subtitle: subTitle,
                            messages: this.generateErrorMessages(errors)
                        }
                    }),
                    this.logErrors(errors)
                ];
            } else if (this.responseHasOnlyWarnings(errors)) {
                return [
                    new SetLogHistoryVisibilityAction(true),
                    this.logWarnings(errors)
                ];
            }
            return [
                new SetLogHistoryVisibilityAction(true),
                new OpenInfoDialogAction({
                    dialogData: {
                        title: title,
                        subtitle: subTitle,
                        messages: this.generateErrorMessages(errors)
                    }
                }),
                this.logErrors(errors),
                this.logWarnings(errors)
            ];
        }

        return EMPTY;
    }

    private handleErrorActionLogs(errorAction: Action, errors: GeneralError[]): Action[] {
        const actions = [
            new SetApplicationLoadingStateAction(false),
            new SetLogHistoryVisibilityAction(true)
        ];

        if (!errors.length || this.responseHasOnlyErrors(errors)) {
            return [
                ...actions,
                errorAction,
                this.logErrors(errors),
            ];
        } else if (this.responseHasOnlyWarnings(errors)) {
            return [
                ...actions,
                this.logWarnings(errors),
            ];
        }
        return [
            ...actions,
            errorAction,
            this.logWarnings(errors),
            this.logErrors(errors),
        ];
    }

    private handleSuccessActionLogs(title: string, subTitle: string, successAction: Action, errors: GeneralError[]): Action[] {
        if (this.responseHasOnlyWarnings(errors)) {
            return [
                new SetApplicationLoadingStateAction(false),
                successAction,
                this.logWarnings(errors),
                new SetLogHistoryVisibilityAction(true)
            ];
        }
        return [
            new SetApplicationLoadingStateAction(false),
            new OpenConfirmDialogAction({
                dialogData: {
                    title: title,
                    subtitle: subTitle,
                    messages: this.generateErrorMessages(errors)
                },
                action: successAction
            }),
            this.logErrors(errors)
        ];
    }

    private responseHasOnlyWarnings(errors: GeneralError[]): boolean {
        return Array.isArray(errors) && errors.length && errors.every(({ warning = false }) => warning);
    }

    private responseHasOnlyErrors(errors: GeneralError[]): boolean {
        return Array.isArray(errors) && errors.length && errors.every(({ warning = false }) => !warning);
    }

    private logErrors(errors: GeneralError[]): LogAction {
        return this.logService.logError(this.getErrorLogInitiator(),
            this.generateErrorMessages(errors));
    }

    private logWarnings(errors: GeneralError[]): LogAction {
        return this.logService.logWarning(this.getErrorLogInitiator(),
            errors.filter(({ warning = false }: GeneralError) => warning)
                .map(({ description = this.errorMessage }) => description));
    }

    private generateErrorMessages(errors: GeneralError[]): string[] {
        return errors.length ? errors.filter(({ warning }: GeneralError) => !warning)
            .map(({ description = this.errorMessage }) => description) : [this.errorMessage];
    }

    private getErrorLogInitiator(extra?: unknown): LogMessageInitiator {
        return {
            key: this.logInitiatorKey,
            displayName: this.logInitiatorDisplayName,
            ...(!!extra && { extra })
        };
    }

    private setLoggerProps(modelType: ModelType): void {
        switch (modelType) {
            case UI:
                this.logInitiatorKey = 'Ui Editor';
                this.logInitiatorDisplayName = 'ADV_UI_EDITOR.NAME';
                break;
            case PROCESS:
                this.logInitiatorKey = 'Process Editor';
                this.logInitiatorDisplayName = 'PROCESS_EDITOR.NAME';
                break;
            case FORM:
                this.logInitiatorKey = 'Form Editor';
                this.logInitiatorDisplayName = 'ADV_FORM_EDITOR.NAME';
                break;
            case FILE:
                this.logInitiatorKey = 'File Editor';
                this.logInitiatorDisplayName = 'ADV_FILE_EDITOR.NAME';
                break;
            case TRIGGER:
                this.logInitiatorKey = 'Trigger Editor';
                this.logInitiatorDisplayName = 'ADV_TRIGGER_EDITOR.NAME';
                break;
            case SCRIPT:
                this.logInitiatorKey = 'Script Editor';
                this.logInitiatorDisplayName = 'ADV_SCRIPT_EDITOR.NAME';
                break;
            case CONNECTOR:
                this.logInitiatorKey = 'Connector Editor';
                this.logInitiatorDisplayName = 'ADV_CONNECTOR_EDITOR.NAME';
                break;
            case FORM_WIDGET:
                this.logInitiatorKey = 'ADV_FORM_WIDGET_EDITOR.NAME';
                this.logInitiatorDisplayName = 'ADV_FORM_WIDGET_EDITOR.NAME';
                break;
            case DECISION_TABLE:
                this.logInitiatorKey = 'Decision table Editor';
                this.logInitiatorDisplayName = 'ADV_DECISION_TABLE_EDITOR.NAME';
                break;
            case AUTHENTICATION:
                this.logInitiatorKey = 'Authentication';
                this.logInitiatorDisplayName = 'ADV_AUTHENTICATION_EDITOR.NAME';
                break;
            case DATA:
                this.logInitiatorKey = 'Data Model Editor';
                this.logInitiatorDisplayName = 'ADV_DATA_MODEL_EDITOR.NAME';
                break;
            case HXP_DOC_TYPE:
                this.logInitiatorKey = 'HxP Document Type Editor';
                this.logInitiatorDisplayName = 'ADV_HXP_DOC_TYPE_EDITOR.NAME';
                break;
            case HXP_MIXIN:
                this.logInitiatorKey = 'HxP Mixin Editor';
                this.logInitiatorDisplayName = 'ADV_HXP_MIXIN_EDITOR.NAME';
                break;
            case HXP_SCHEMA:
                this.logInitiatorKey = 'HxP Schema Editor';
                this.logInitiatorDisplayName = 'ADV_HXP_SCHEMA_EDITOR.NAME';
                break;
            case CUSTOM_MODEL:
                this.logInitiatorKey = 'Content Model Editor';
                this.logInitiatorDisplayName = 'ADV_PROJECT_MODEL_EDITOR.NAME';
                break;
            default:
                this.logInitiatorKey = 'Project Editor';
                this.logInitiatorDisplayName = 'Project Editor';
                break;
        }
    }
}

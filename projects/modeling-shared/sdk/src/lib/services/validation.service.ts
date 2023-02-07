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
import { HttpErrorResponse } from '@angular/common/http';
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
    CUSTOM_MODEL, SCRIPT, PROJECT_MODEL, PROJECT_TYPE, RELEASE_TYPE, RELEASE, DOWNLOAD_PROJECT_TYPE, DOWNLOAD_PROJECT
} from '../api/types';

export interface IErrorResponse extends HttpErrorResponse {
    errors?: GeneralError[]
}

type ModelType = MODEL_TYPE | PROJECT_TYPE | RELEASE_TYPE | DOWNLOAD_PROJECT_TYPE;

export interface IErrorHandlerProps {
    response: IErrorResponse;
    modelType: ModelType;
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
    private title = 'APP.DIALOGS.CONFIRM.TITLE';
    private subTitle = 'APP.DIALOGS.ERROR.SUBTITLE';
    private errorMessage = 'SDK.MODEL_EDITOR.VALIDATION.DEFAULT_ERROR';
    private errors: GeneralError[] = [];

    constructor(private readonly logService: LogFactoryService) { }

    handleErrors({
        title,
        subTitle,
        modelType,
        errorAction,
        successAction,
        response: { status, message, errors }
    }: IErrorHandlerProps): Action[] | Observable<never> {

        if (status !== 400) {
            return EMPTY;
        }

        if (title) {
            this.setTitle(title);
        }

        if (subTitle) {
            this.setSubTitle(subTitle);
        }

        this.setLoggerProps(modelType);

        if (modelType === PROJECT || modelType === DOWNLOAD_PROJECT) {
            this.setTitle(message);
            this.setErrors(errors);
        }

        if (modelType === PROJECT) {
            return this.handleProjectErrors();
        }

        if (modelType === DOWNLOAD_PROJECT) {
            return this.handleSuccessActionLogs(successAction);
        }

        this.tryParseMessage(message);

        if (modelType === RELEASE) {
            return this.handleReleaseErrors();
        }

        if (errorAction) {
            return this.handleErrorActionLogs(errorAction);
        }

        return this.handleSuccessActionLogs(successAction);
    }

    private setTitle(title: string): void {
        this.title = title;
    }

    private setSubTitle(subTitle: string): void {
        this.subTitle = subTitle;
    }

    private setErrorMessage(errorMessage: string): void {
        this.errorMessage = errorMessage;
    }

    private setErrors(errors: GeneralError[]): void {
        this.errors = errors;
    }

    private tryParseMessage(msg: string): void {
        try {
            const { errors, message } = JSON.parse(msg);

            if (errors && typeof errors === 'string') {
                this.setErrorMessage(errors);
            } else if (message && typeof message === 'string') {
                this.setErrorMessage(message);
            }
            this.setErrors(errors);
        } catch (err) {
            console.error(err);
        }
    }

    private handleReleaseErrors(): Action[] {
        return [
            new SnackbarErrorAction('PROJECT_EDITOR.ERROR.RELEASE_PROJECT'),
            this.logService.logError(this.getErrorLogInitiator(), this.generateErrorMessages()),
            new SetLogHistoryVisibilityAction(true)
        ];
    }

    private handleProjectErrors(): Action[] | Observable<never> {
        if (Array.isArray(this.errors) && this.errors.length) {
            if (this.responseHasOnlyErrors(this.errors)) {
                return [
                    new SetLogHistoryVisibilityAction(true),
                    new OpenInfoDialogAction({
                        dialogData: {
                            title: this.title,
                            subtitle: this.subTitle,
                            messages: this.generateErrorMessages()
                        }
                    }),
                    this.logErrors()
                ];
            } else if (this.responseHasOnlyWarnings(this.errors)) {
                return [
                    new SetLogHistoryVisibilityAction(true),
                    this.logWarnings(this.errors)
                ];
            }
            return [
                new SetLogHistoryVisibilityAction(true),
                new OpenInfoDialogAction({
                    dialogData: {
                        title: this.title,
                        subtitle: this.subTitle,
                        messages: this.generateErrorMessages()
                    }
                }),
                this.logErrors(),
                this.logWarnings(this.errors)
            ];
        }

        return EMPTY;
    }

    private handleErrorActionLogs(errorAction: Action): Action[] {
        const actions = [
            new SetApplicationLoadingStateAction(false),
            new SetLogHistoryVisibilityAction(true)
        ];

        if (!Array.isArray(this.errors) || !this.errors.length || this.responseHasOnlyErrors(this.errors)) {
            return [
                ...actions,
                errorAction,
                this.logErrors(),
            ];
        } else if (this.responseHasOnlyWarnings(this.errors)) {
            return [
                ...actions,
                this.logWarnings(this.errors),
            ];
        }
        return [
            ...actions,
            errorAction,
            this.logWarnings(this.errors),
            this.logErrors(),
        ];
    }

    private handleSuccessActionLogs(successAction: Action): Action[] {
        if (this.responseHasOnlyWarnings(this.errors)) {
            return [
                new SetApplicationLoadingStateAction(false),
                successAction,
                this.logWarnings(this.errors),
                new SetLogHistoryVisibilityAction(true)
            ];
        }
        return [
            new SetApplicationLoadingStateAction(false),
            new OpenConfirmDialogAction({
                dialogData: {
                    title: this.title,
                    subtitle: this.subTitle,
                    messages: this.generateErrorMessages()
                },
                action: successAction
            }),
            this.logErrors()
        ];
    }

    private responseHasOnlyWarnings(errors: GeneralError[]): boolean {
        return Array.isArray(errors) && errors.length && errors.every(({ warning = false }) => warning);
    }

    private responseHasOnlyErrors(errors: GeneralError[]): boolean {
        return Array.isArray(errors) && errors.length && errors.every(({ warning = false }) => !warning);
    }

    private logErrors(): LogAction {
        return this.logService.logError(this.getErrorLogInitiator(),
            this.generateErrorMessages());
    }

    private logWarnings(errors: GeneralError[]): LogAction {
        return this.logService.logWarning(this.getErrorLogInitiator(),
            errors.filter(({ warning = false }: GeneralError) => warning)
                .map(({ description = this.errorMessage }) => description));
    }

    private generateErrorMessages(): string[] {
        return Array.isArray(this.errors) && this.errors.length ? this.errors.filter(({ warning }: GeneralError) => !warning)
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
            case PROJECT_MODEL:
            case CUSTOM_MODEL:
                this.logInitiatorKey = 'Content Model Editor';
                this.logInitiatorDisplayName = 'ADV_PROJECT_MODEL_EDITOR.NAME';
                break;
            case RELEASE:
            case PROJECT:
            case DOWNLOAD_PROJECT:
                this.logInitiatorKey = 'Project Editor';
                this.logInitiatorDisplayName = 'Project Editor';
                break;

            default:
                break;
        }
    }
}

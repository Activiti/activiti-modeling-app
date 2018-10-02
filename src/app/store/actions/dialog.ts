import { Action } from '@ngrx/store';
import { ConfirmDialogData } from '../../common/services/dialog.service';
import { TemplateRef } from '@angular/core';
import { MatDialogConfig } from '@angular/material';
import { ComponentType } from '@angular/cdk/portal';

export interface OpenConfirmDialogActionPayload {
    action: Action;
    dialogData: ConfirmDialogData;
}

export const OPEN_CONFIRM_DIALOG = 'OPEN_CONFIRM_DIALOG';
export class OpenConfirmDialogAction implements Action {
    readonly type = OPEN_CONFIRM_DIALOG;
    constructor(public payload: OpenConfirmDialogActionPayload) {}
}

export const OPEN_DIALOG = 'OPEN_DIALOG';
export class OpenDialogAction<T> implements Action {
    readonly type = OPEN_DIALOG;
    constructor(
        public dialogContent: ComponentType<T> | TemplateRef<T>,
        public dialogConfig?: MatDialogConfig
    ) {}
}

export const CLOSE_ALL_DIALOGS = 'CLOSE_ALL_DIALOGS';
export class CloseAllDialogsAction implements Action {
    readonly type = CLOSE_ALL_DIALOGS;
    constructor() {}
}

export interface EntityDialogForm {
    id?: string;
    name: string;
    description?: string;
    applicationId?: string;
}

export interface EntityDialogPayload {
    title: string;
    nameField: string;
    descriptionField: string;
    values?: EntityDialogForm;
    action: any;
}

export const OPEN_ENTITY_DIALOG = 'OPEN_ENTITY_DIALOG';
export class OpenEntityDialogAction implements Action {
    readonly type = OPEN_ENTITY_DIALOG;
    constructor(public payload: EntityDialogPayload) {}
}

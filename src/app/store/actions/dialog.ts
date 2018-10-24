import { Action } from '@ngrx/store';
import { TemplateRef } from '@angular/core';
import { MatDialogConfig } from '@angular/material';
import { ComponentType } from '@angular/cdk/portal';
import { EntityDialogPayload } from 'ama-sdk';

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

export const OPEN_ENTITY_DIALOG = 'OPEN_ENTITY_DIALOG';
export class OpenEntityDialogAction implements Action {
    readonly type = OPEN_ENTITY_DIALOG;
    constructor(public payload: EntityDialogPayload) {}
}

import { EntityDialogForm } from '../helpers/common';
import { Action } from '@ngrx/store';

export const CREATE_APPLICATION_ATTEMPT = 'CREATE_APPLICATION_ATTEMPT';
export class CreateApplicationAttemptAction implements Action {
    readonly type = CREATE_APPLICATION_ATTEMPT;
    constructor(public payload: Partial<EntityDialogForm>) {}
}

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

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable, RendererFactory2 } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import {
    OPEN_CONFIRM_DIALOG,
    OpenConfirmDialogAction,
    EntityDialogComponent,
    SetApplicationLoadingStateAction,
    MODELER_NAME_REGEX,
    CreateProjectAttemptAction,
    OPEN_DIALOG,
    OpenDialogAction,
    CLOSE_ALL_DIALOGS,
    CloseAllDialogsAction,
    OpenEntityDialogAction,
    OPEN_ENTITY_DIALOG,
    CreateProjectDialogAction,
    CREATE_PROJECT_DIALOG,
    IMPORT_PROJECT_DIALOG,
    ImportProjectDialogAction,
    OVERRIDE_PROJECT_NAME_DIALOG,
    OverrideProjectNameDialogAction,
    OverrideProjectAttemptAction,
    UploadProjectAttemptAction,
    OPEN_INFO_DIALOG,
    OpenInfoDialogAction,
    OPEN_SETTINGS_DIALOG,
    OpenAboutDialogAction,
    OPEN_ABOUT_DIALOG,
    EDIT_PROJECT_DIALOG,
    EditProjectDialogAction,
    EditProjectDialogComponent
} from '@alfresco-dbp/modeling-shared/sdk';
import { DialogService, DialogData } from '@alfresco-dbp/adf-candidates/core/dialog';
import { Action, Store } from '@ngrx/store';
import { SettingsDialogComponent } from '../../common/components/settings/settings-dialog.component';
import { AboutComponent } from '../../common/components/about/about.component';

@Injectable()
export class DialogEffects {
    private projectFileInput: HTMLInputElement;

    constructor(
        private store: Store<any>,
        private actions$: Actions,
        private dialogService: DialogService,
        rendererFactory: RendererFactory2
    ) {
        const renderer = rendererFactory.createRenderer(null, null);

        this.projectFileInput = renderer.createElement(
            'input'
        ) as HTMLInputElement;
        this.projectFileInput.classList.add('app-import-project');
        this.projectFileInput.type = 'file';
        this.projectFileInput.style.display = 'none';
        this.projectFileInput.setAttribute('multiple', '');
        this.projectFileInput.accept =
            'application/zip,application/x-zip,application/x-zip-compressed';
        this.projectFileInput.addEventListener('change', event =>
            this.importProject(event)
        );
        renderer.appendChild(document.body, this.projectFileInput);
    }


    openDialog = createEffect(() => this.actions$.pipe(
        ofType<OpenDialogAction<any>>(OPEN_DIALOG),
        map(action =>
            this.dialogService.openDialog(
                action.dialogContent,
                action.dialogConfig
            )
        )
    ), { dispatch: false });


    closeDialog = createEffect(() => this.actions$.pipe(
        ofType<CloseAllDialogsAction>(CLOSE_ALL_DIALOGS),
        map(() => this.dialogService.closeAll())
    ), { dispatch: false });


    confirmDialogEffect = createEffect(() => this.actions$.pipe(
        ofType<OpenConfirmDialogAction>(OPEN_CONFIRM_DIALOG),
        switchMap(action =>
            this.openConfirmDialog(
                action.payload.action,
                action.payload.dialogData
            )
        )
    ));


    infoDialogEffect = createEffect(() => this.actions$.pipe(
        ofType<OpenInfoDialogAction>(OPEN_INFO_DIALOG),
        map(action => this.dialogService.info(action.payload.dialogData))
    ), { dispatch: false });


    openEntityDialogEffect = createEffect(() => this.actions$.pipe(
        ofType<OpenEntityDialogAction>(OPEN_ENTITY_DIALOG),
        map(action => action.payload),
        map(data =>
            this.dialogService.openDialog(data.dialog ? data.dialog : EntityDialogComponent, { data })
        )
    ), { dispatch: false });


    settingsDialogEffect = createEffect(() => this.actions$.pipe(
        ofType<OpenInfoDialogAction>(OPEN_SETTINGS_DIALOG),
        map(() => this.dialogService.openDialog(SettingsDialogComponent))
    ), { dispatch: false });


    openAboutDialogEffect$ = createEffect(() => this.actions$.pipe(
        ofType<OpenAboutDialogAction>(OPEN_ABOUT_DIALOG),
        map(() => this.dialogService.openDialog(AboutComponent, { width: '700px'}))
    ), { dispatch: false });

    editProjectDialogEffect$ = createEffect(() => this.actions$.pipe(
        ofType<EditProjectDialogAction>(EDIT_PROJECT_DIALOG),
        map(action => action.payload),
        map(data =>
            this.dialogService.openDialog(data.dialog ? data.dialog : EditProjectDialogComponent, { data })
        )
    ), { dispatch: false });

    createProject$ = createEffect(() => this.actions$.pipe(
        ofType<CreateProjectDialogAction>(CREATE_PROJECT_DIALOG),
        map(
            () =>
                new EditProjectDialogAction({
                    title: 'DASHBOARD.NEW_MENU.CREATE_PROJECT_TITLE',
                    fields: [
                        {
                            key: 'name',
                            label: 'DASHBOARD.DIALOGS.PROJECT_NAME',
                            type: 'text',
                            validators: [
                                {
                                    type: 'required',
                                    value: true,
                                    error: 'SDK.CREATE_DIALOG.ERROR.REQUIRED'
                                },
                                {
                                    type: 'pattern',
                                    value: MODELER_NAME_REGEX,
                                    error: 'APP.DIALOGS.ERROR.GENERAL_NAME_VALIDATION'
                                }
                            ]
                        },
                        {
                            key: 'description',
                            label: 'DASHBOARD.DIALOGS.PROJECT_DESC',
                            type: 'textarea'
                        }
                    ],
                    submitText: 'DASHBOARD.DIALOGS.PROJECT_SUBMIT_TEXT',
                    action: CreateProjectAttemptAction
                })
        )
    ));


    overrideNameProject$ = createEffect(() => this.actions$.pipe(
        ofType<OverrideProjectNameDialogAction>(OVERRIDE_PROJECT_NAME_DIALOG),
        map(
            (action) =>
                new OpenEntityDialogAction({
                    title: 'DASHBOARD.NEW_MENU.OVERRIDE_PROJECT_TITLE',
                    fields: [
                        {
                            key: 'name',
                            label: 'DASHBOARD.DIALOGS.PROJECT_NAME',
                            type: 'text',
                            validators: [
                                {
                                    type: 'required',
                                    value: true,
                                    error: 'SDK.CREATE_DIALOG.ERROR.REQUIRED'
                                },
                                {
                                    type: 'pattern',
                                    value: MODELER_NAME_REGEX,
                                    error: 'APP.DIALOGS.ERROR.GENERAL_NAME_VALIDATION'
                                }
                            ]
                        },
                        {
                            key: 'description',
                            label: 'DASHBOARD.DIALOGS.PROJECT_DESC',
                            type: 'textarea'
                        }
                    ],
                    submitText: 'DASHBOARD.DIALOGS.PROJECT_SUBMIT_TEXT',
                    submitData: {
                        file: action.file
                    },
                    action: OverrideProjectAttemptAction
                })
        )
    ));


    importProject$ = createEffect(() => this.actions$.pipe(
        ofType<ImportProjectDialogAction>(IMPORT_PROJECT_DIALOG),
        map(() => this.projectFileInput.click())
    ), { dispatch: false });

    private openConfirmDialog(action: Action, dialogData: DialogData) {
        return this.dialogService
            .confirm(dialogData)
            .pipe(
                switchMap(confirmation =>
                    confirmation
                        ? [new SetApplicationLoadingStateAction(false), action]
                        : [new SetApplicationLoadingStateAction(false)]
                )
            );
    }

    private importProject(event: any): void {
        const input = <HTMLInputElement>event.currentTarget;

        if (input && input.files && input.files.length > 0) {
            this.store.dispatch(new UploadProjectAttemptAction(input.files[0]));
            event.target.value = '';
        }
    }
}

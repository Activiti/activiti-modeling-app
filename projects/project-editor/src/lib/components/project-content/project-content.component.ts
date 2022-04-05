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

import { Component, OnInit, Inject, Optional, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    ProjectEditorState,
    Project,
    selectProject,
    PROJECT_CONTEXT_MENU_OPTIONS,
    ProjectContextMenuOption,
    ProjectContextMenuActionClass,
    OpenSaveAsProjectDialogAction,
    SaveAsProjectAttemptAction,
    ExportProjectAction,
    ValidateProjectAttemptAction,
    ExportProjectAttemptAction,
    ExportProjectAttemptPayload } from '@alfresco-dbp/modeling-shared/sdk';
import { Observable, Subscription } from 'rxjs';

@Component({
    templateUrl: './project-content.component.html',
    styleUrls: ['./project-content.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProjectContentComponent implements OnInit {
    project$: Observable<Partial<Project>>;
    openedFilters$: Subscription;

    constructor(
        @Inject(PROJECT_CONTEXT_MENU_OPTIONS)
        @Optional() public buttons: ProjectContextMenuOption[],
        private store: Store<ProjectEditorState>) {}

    ngOnInit() {
        this.project$ = this.store.select(selectProject);
    }

    downloadApp(project: Partial<Project>) {
        const payload: ExportProjectAttemptPayload = {
            projectId: project.id,
            projectName: project.name,
            action: new ExportProjectAction({ projectId: project.id, projectName: project.name})
        };
        this.store.dispatch(new ExportProjectAttemptAction(payload));
    }

    validateApp(projectId: string): void {
        this.store.dispatch(new ValidateProjectAttemptAction(projectId));
    }

    saveAsProject(project: Partial<Project>) {
        this.store.dispatch(new OpenSaveAsProjectDialogAction({
            id: project.id,
            name: project.name,
            action: SaveAsProjectAttemptAction
        }));
    }

    handleClick(actionClass: ProjectContextMenuActionClass, projectId: string) {
        this.store.dispatch(new actionClass(projectId));
    }
}

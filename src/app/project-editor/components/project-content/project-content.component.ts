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

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProjectEditorState, Project, selectProject, OpenConfirmDialogAction } from 'ama-sdk';
import { Observable, Subscription } from 'rxjs';
import { ExportProjectAction, OpenProjectSettingsDialog } from '../../store/project-editor.actions';
import { ReleaseProjectAttemptAction } from '../../../dashboard/store/actions/projects';
import { Router } from '@angular/router';

@Component({
    templateUrl: './project-content.component.html'
})
export class ProjectContentComponent implements OnInit {
    project$: Observable<Partial<Project>>;
    openedFilters$: Subscription;

    constructor(private store: Store<ProjectEditorState>, private router: Router) {}

    ngOnInit() {
        this.project$ = this.store.select(selectProject);
    }

    downloadApp(project: Project) {
        const payload = {
            projectId: project.id,
            projectName: project.name
        };

        this.store.dispatch(new ExportProjectAction(payload));
    }

    openSettingsDialog(project: Project) {
        this.store.dispatch(new OpenProjectSettingsDialog(project));
    }

    releaseProject(projectId: string): void {
        this.store.dispatch(new OpenConfirmDialogAction({
            dialogData: { title: 'APP.DIALOGS.CONFIRM.RELEASE' },
            action: new ReleaseProjectAttemptAction(projectId)
        }));
    }

    seeReleasesForProject(projectId: string): void {
        this.router.navigate(['dashboard', 'projects', projectId, 'releases']);
    }
}

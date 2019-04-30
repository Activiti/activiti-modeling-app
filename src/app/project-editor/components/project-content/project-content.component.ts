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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProjectEditorState, Project, selectProject, LeaveProjectAction } from 'ama-sdk';
import { Observable, Subscription } from 'rxjs';
import { ExportProjectAction, OpenProjectSettingsDialog } from '../../store/project-editor.actions';

@Component({
    templateUrl: './project-content.component.html'
})
export class ProjectContentComponent implements OnInit, OnDestroy {
    project$: Observable<Partial<Project>>;
    openedFilters$: Subscription;

    constructor(private store: Store<ProjectEditorState>) {}

    ngOnInit() {
        this.project$ = this.store.select(selectProject);
    }

    ngOnDestroy() {
        this.store.dispatch(new LeaveProjectAction());
    }

    downloadApp(project) {
        const payload = {
            projectId: project.id,
            projectName: project.name
        };

        this.store.dispatch(new ExportProjectAction(payload));
    }

    openSettingsDialog(project: Project) {
        this.store.dispatch(new OpenProjectSettingsDialog(project));
    }
}

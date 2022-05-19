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

import { Component, ViewEncapsulation, ChangeDetectionStrategy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Project } from '../../../api/types';
import { ProjectContextMenuActionClass, ProjectContextMenuOption, PROJECT_CONTEXT_MENU_OPTIONS, PROJECT_MENU_HEADER_ACTIONS } from '../../../project-editor/project-context-menu';
import { LayoutService } from '../../../services/layout.service';
import { AmaState } from '../../../store/app.state';
import { AddToFavoritesProjectAttemptAction,
    ExportProjectAction,
    OpenSaveAsProjectDialogAction,
    RemoveFromFavoritesProjectAttemptAction,
    SaveAsProjectAttemptAction,
    ValidateProjectAttemptAction,
    ExportProjectAttemptAction,
    ExportProjectAttemptPayload
} from '../../../store/project.actions';
import { selectProject } from '../../../store/project.selectors';

@Component({
    templateUrl: './studio-header.component.html',
    styleUrls: ['./studio-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudioHeaderComponent {

    project$: Observable<Partial<Project>>;

    constructor(private store: Store<AmaState>,
                private router: Router,
                @Inject(PROJECT_CONTEXT_MENU_OPTIONS)
                @Optional() public buttons: ProjectContextMenuOption[],
                @Inject(PROJECT_MENU_HEADER_ACTIONS)
                @Optional() public headerButtons: ProjectContextMenuOption[],
                private layoutService: LayoutService) {
        this.project$ = this.store.select(selectProject);
        if (this.buttons) {
            this.buttons = this.filterObjectArray(this.buttons, this.headerButtons);
        }
    }

    private filterObjectArray(buttons, buttonsToFilter) {
        return buttons.filter( button =>
            buttonsToFilter.some( filterButton =>
                button.title !== filterButton.title
            )
        );
    }

    onBackArrowClick() {
        void this.router.navigate(['']);
    }

    onToggleLeftSideNav() {
        this.layoutService.toggleSideNav();
    }

    addRemoveFavoriteProject(item: Partial<Project>) {
        if (item?.favorite) {
            this.store.dispatch(new RemoveFromFavoritesProjectAttemptAction(item.id));
        } else {
            this.store.dispatch(new AddToFavoritesProjectAttemptAction(item.id));
        }
    }

    onValidateProject(projectId: string) {
        this.store.dispatch(new ValidateProjectAttemptAction(projectId));
    }

    handleClick(actionClass: ProjectContextMenuActionClass, projectId: string) {
        this.store.dispatch(new actionClass(projectId));
    }

    saveAsProject(project: Partial<Project>) {
        this.store.dispatch(new OpenSaveAsProjectDialogAction({
            id: project.id,
            name: project.name,
            action: SaveAsProjectAttemptAction
        }));
    }

    downloadProject(project: Partial<Project>) {
        const payload: ExportProjectAttemptPayload = {
            projectId: project.id,
            projectName: project.name,
            action: new ExportProjectAction({ projectId: project.id, projectName: project.name})
        };
        this.store.dispatch(new ExportProjectAttemptAction(payload));
    }
}

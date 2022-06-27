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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectContentComponent } from './project-content.component';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToolbarModule } from '@alfresco/adf-core';
import {
    ProjectEditorState, PROJECT_CONTEXT_MENU_OPTIONS, OpenSaveAsProjectDialogAction, SaveAsProjectAttemptAction, AmaApi, ExportProjectAction
} from '@alfresco-dbp/modeling-shared/sdk';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ProjectEditorService } from '../../services/project-editor.service';
import { mockProject } from './project-content.mock';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ExportProjectAttemptAction } from '../../store/project-editor.actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('ProjectContentComponent', () => {
    let fixture: ComponentFixture<ProjectContentComponent>;
    let store: Store<ProjectEditorState>;
    let projectEditorService: ProjectEditorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                RouterTestingModule,
                MatIconTestingModule,
                MatButtonModule,
                MatMenuModule,
                ToolbarModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule
            ],
            declarations: [ProjectContentComponent],
            providers: [
                AmaApi,
                ProjectEditorService,
                {
                    provide: Store,
                    useValue: {
                        dispatch: jest.fn(),
                        select: jest.fn().mockReturnValue(of(mockProject))
                    }
                },
                { provide: PROJECT_CONTEXT_MENU_OPTIONS, useValue: [] }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        projectEditorService = TestBed.inject(ProjectEditorService);
        fixture = TestBed.createComponent(ProjectContentComponent);
        store = TestBed.inject(Store);
        fixture.detectChanges();
    });

    it('download button exists', () => {
        const button = fixture.nativeElement.querySelector('[data-automation-id="project-download-button"]');
        expect(button === null).toBeFalsy();
    });

    it('clicking on download button should dispatch an ExportProjectAttemptAction', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        const button = fixture.debugElement.query(By.css('[data-automation-id="project-download-button"]'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();

        const exportActionAttempt: ExportProjectAttemptAction = dispatchSpy.calls.argsFor(0)[0];
        const payload = {
            projectId: 'mock-project-id',
            projectName: 'mock-project-name'
        };

        expect(exportActionAttempt.type).toBe('EXPORT_PROJECT_ATTEMPT');
        expect(exportActionAttempt.payload).toEqual({
            action: new ExportProjectAction(payload),
            ...payload
        });
    });

    it('clicking on save as button should dispatch an OpenSaveAsProjectDialogAction', () => {
        projectEditorService.fetchProject = jest.fn().mockReturnValue(of( mockProject ));

        const dispatchSpy = spyOn(store, 'dispatch');
        const menu = fixture.debugElement.query(By.css('[data-automation-id="project-context-mock-project-id"]'));
        menu.triggerEventHandler('click', {});
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('[data-automation-id="project-save-as-mock-project-id"]'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();

        const openSaveAsProjectDialogAction: OpenSaveAsProjectDialogAction = dispatchSpy.calls.argsFor(0)[0];
        const payload = {
            id: 'mock-project-id',
            name: 'mock-project-name'
        };

        expect(openSaveAsProjectDialogAction.type).toBe('OPEN_SAVE_AS_PROJECT_DIALOG');
        expect(openSaveAsProjectDialogAction.payload).toEqual({
            action: SaveAsProjectAttemptAction,
            ... payload
        });
    });
});

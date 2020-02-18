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
import { MatIconModule, MatButtonModule, MatMenuModule } from '@angular/material';
import { ToolbarModule } from '@alfresco/adf-core';
import { ProjectEditorState, PROJECT_CONTEXT_MENU_OPTIONS } from '@alfresco-dbp/modeling-shared/sdk';
import { of } from 'rxjs';
import { ExportProjectAction, ExportProjectAttemptAction } from '../../store/project-editor.actions';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

describe('ProjectContentComponent', () => {
    let fixture: ComponentFixture<ProjectContentComponent>;
    let store: Store<ProjectEditorState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                RouterTestingModule,
                MatIconModule,
                MatButtonModule,
                MatMenuModule,
                ToolbarModule,
                TranslateModule.forRoot()
            ],
            declarations: [ProjectContentComponent],
            providers: [
                {provide: Store, useValue: {dispatch: jest.fn(), select: jest.fn().mockReturnValue(of({}))}},
                { provide: PROJECT_CONTEXT_MENU_OPTIONS, useValue: []},
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectContentComponent);
        store = TestBed.get(Store);
        fixture.detectChanges();
    });

    it('download button exists', () => {
        const button = fixture.nativeElement.querySelector('[data-automation-id="project-download-button"]');
        expect(button === null).toBeFalsy();
    });

    it('clicking on download button should dispatch an ExportProjectAttemptAction', () => {
        spyOn(store, 'dispatch');
        const button = fixture.debugElement.query(By.css('[data-automation-id="project-download-button"]'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();

        const exportActionAttempt: ExportProjectAttemptAction = store.dispatch.calls.argsFor(0)[0];
        const payload = {
            projectId: undefined,
            projectName: undefined
        };

        expect(exportActionAttempt.type).toBe('EXPORT_PROJECT_ATTEMPT');
        expect(exportActionAttempt.payload).toEqual({
            action: new ExportProjectAction(payload),
            ...payload
        });
    }

    );
});

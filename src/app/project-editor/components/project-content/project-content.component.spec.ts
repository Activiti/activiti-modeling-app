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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ProjectContentComponent } from './project-content.component';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material';
import { ToolbarModule } from '@alfresco/adf-core';
import { ProjectEditorState } from 'ama-sdk';
import { of } from 'rxjs';
import { ExportProjectAction } from '../../store/project-editor.actions';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('ProjectContentComponent', () => {
    let fixture: ComponentFixture<ProjectContentComponent>;
    let store: Store<ProjectEditorState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatIconModule,  ToolbarModule, TranslateModule.forRoot()],
            declarations: [ProjectContentComponent],
            providers: [{provide: Store, useValue: {dispatch: jest.fn(), select: jest.fn().mockReturnValue(of({}))}}]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectContentComponent);
        store = TestBed.get(Store);
        fixture.detectChanges();
    });

    it('download button exists', () => {
        const button = fixture.nativeElement.querySelector('.download-app-btn');

        expect(button === null).toBeFalsy();
    });

    it('clicking on download button should dispatch an ExportProjectAction', () => {
        spyOn(store, 'dispatch');
        const button = fixture.debugElement.query(By.css('.download-app-btn'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();
        const exportAction: ExportProjectAction = store.dispatch.calls.argsFor(0)[0];


        expect(exportAction.type).toBe('EXPORT_PROJECT');
        expect(exportAction.payload).toEqual({});
    }

    );
});

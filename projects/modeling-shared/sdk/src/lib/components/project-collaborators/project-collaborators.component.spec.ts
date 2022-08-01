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

import { InitialUsernamePipe, TranslationMock, TranslationService } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectCollaboratorsComponent } from './project-collaborators.component';

describe('ProjectCollaboratorsComponent', () => {
    let component: ProjectCollaboratorsComponent;
    let fixture: ComponentFixture<ProjectCollaboratorsComponent>;

    const mockCollaborators = [
        {
            username: 'modeler',
            createdBy: 'modeler',
            id: '1',
            projectId: 'mock-id'
        },
        {
            username: 'superadmin',
            createdBy: 'modeler',
            id: '1',
            projectId: 'mock-id'
        }
    ];
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MatTooltipModule,
                MatIconModule,
                MatButtonModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule
            ],
            declarations: [
                ProjectCollaboratorsComponent,
                InitialUsernamePipe
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock }
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectCollaboratorsComponent);
        component = fixture.componentInstance;
        component.projectId = 'projectId';
        fixture.detectChanges();
    });

    it('should show the collaborators name initials if projects has less than 4 collaborators', () => {
        component.collaborators = mockCollaborators;
        fixture.detectChanges();
        const collaborator1: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="collaborator-initial-modeler"] [id="user-initials-image"]');
        expect(collaborator1.textContent).toBe('m');
        const collaborator2: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="collaborator-initial-superadmin"]');
        expect(collaborator2.textContent).toBe('s');
    });

    it('should show the + number of remaining collaborators if projects has more than 3 collaborators', () => {
        component.collaborators = [
            ...mockCollaborators,
            {
                username: 'hruser',
                createdBy: 'modeler',
                id: '1',
                projectId: 'mock-id'
            },
            {
                username: 'admin',
                createdBy: 'modeler',
                id: '1',
                projectId: 'mock-id'
            }
        ];
        fixture.detectChanges();
        component.ngOnInit();
        const collaborator1: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="collaborator-initial-modeler"]');
        expect(collaborator1.textContent).toBe('m');
        const collaborator2: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="collaborator-initial-superadmin"]');
        expect(collaborator2.textContent).toBe('s');
        const collaborator3: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="collaborator-initial-hruser"]');
        expect(collaborator3.textContent).toBe('h');
        const extraCollaborators: HTMLElement = fixture.nativeElement.querySelector('.ama-extra-collaborators');
        expect(extraCollaborators.textContent).toBe(' +1 ');
        const extraCollaboratorsToolTip = fixture.debugElement.query(By.css('.ama-extra-collaborators'));
        const tooltip = extraCollaboratorsToolTip.injector.get<MatTooltip>(MatTooltip);
        fixture.detectChanges();
        expect(extraCollaboratorsToolTip).toBeTruthy();
        expect(tooltip.message).toEqual('admin');
    });
});

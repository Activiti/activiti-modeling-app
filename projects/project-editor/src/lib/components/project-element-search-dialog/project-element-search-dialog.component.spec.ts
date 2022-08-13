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

import { AmaApi } from '@alfresco-dbp/modeling-shared/sdk';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ProjectTreeSearchService } from '../../services/project-tree-search.service';
import { ProjectElementSearchDialogComponent } from './project-element-search-dialog.component';

const mockSearchResults = {
    entries: [
        {
            createdBy: 'fake-user-1',
            creationDate: '2022-08-10T07:57:42.251+0000',
            id: '344c4f14-4397-402d-926e-397d6d8427ee',
            lastModifiedBy: 'fake-user-1',
            lastModifiedDate: '2022-08-10T07:57:42.254+0000',
            name: 'banana',
            projectIds: ['93633d24-9849-457b-bf39-925333243976'],
            scope: 'PROJECT',
            type: 'FORM',
            version: '0.0.1'
        },
        {
            createdBy: 'fake-user-2',
            creationDate: '2022-08-10T07:57:42.251+0000',
            id: '397d6d8427ee-4397-402d-926e-344c4f14',
            lastModifiedBy: 'fake-user-2',
            lastModifiedDate: '2022-08-10T07:57:42.254+0000',
            name: 'koala',
            projectIds: ['93633d24-9849-457b-bf39-925333243976'],
            scope: 'PROJECT',
            type: 'PROCESS',
            version: '0.0.1'
        }
    ]
};

describe('ProjectNavigationComponent', () => {

    let fixture: ComponentFixture<ProjectElementSearchDialogComponent>;
    let mockStore: MockStore;
    let projectTreeSearch: ProjectTreeSearchService;
    let router: Router;

    const mockDialog = {
        close: jest.fn()
    };

    function updateSearchField(value) {
        const editInput = fixture.debugElement.query(By.css(`#input-search-project-tree`));
        editInput.nativeElement.value = value;
        editInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
    }

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                NoopAnimationsModule,
                ReactiveFormsModule,
                FormsModule
            ],
            providers: [
                ProjectTreeSearchService,
                { provide: MatDialogRef, useValue: mockDialog },
                provideMockStore(),
                AmaApi
            ],
            declarations: [ProjectElementSearchDialogComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        mockStore = TestBed.inject(MockStore);
        jest.spyOn(mockStore, 'select').mockReturnValue(of('fake-project-id'));
        fixture = TestBed.createComponent(ProjectElementSearchDialogComponent);
        fixture.detectChanges();
        projectTreeSearch = TestBed.inject(ProjectTreeSearchService);
        router = TestBed.inject(Router);
    });

    it('should not fetch any result if only one letter is typed',() => {
        spyOn(projectTreeSearch, 'searchByName').and.stub();
        const inputSearch: HTMLInputElement = fixture.nativeElement.querySelector('#input-search-project-tree');
        expect(inputSearch).not.toBeNull();
        expect(inputSearch).toBeDefined();
        updateSearchField('a');
        fixture.whenStable();
        expect(projectTreeSearch.searchByName).not.toHaveBeenCalled();
    });

    it('should show the options once two letter has been typed', fakeAsync(() => {
        spyOn(projectTreeSearch, 'searchByName').and.returnValue(of(mockSearchResults));
        updateSearchField('ab');
        tick(500);
        fixture.detectChanges();
        expect(projectTreeSearch.searchByName).toHaveBeenCalledWith('fake-project-id', 'ab');
        const optionList = fixture.nativeElement.querySelectorAll('mat-option');
        expect(optionList.length).toBe(2);
    }));

    it('should perform one call if the user type two valid values in shot time', fakeAsync(() => {
        spyOn(projectTreeSearch, 'searchByName').and.returnValue(of(mockSearchResults));
        updateSearchField('ab');
        tick(300);
        updateSearchField('ca');
        tick(500);
        fixture.detectChanges();
        expect(projectTreeSearch.searchByName).toHaveBeenNthCalledWith(1, 'fake-project-id', 'ca');
        const optionList = fixture.nativeElement.querySelectorAll('mat-option');
        expect(optionList.length).toBe(2);
    }));

    it('should navigate to the element clicked', fakeAsync(() => {
        const chosenOption = mockSearchResults.entries[0];
        spyOn(router,'navigate').and.stub();
        spyOn(projectTreeSearch, 'searchByName').and.returnValue(of(mockSearchResults));
        updateSearchField('ab');
        tick(500);
        fixture.detectChanges();
        const optionList = fixture.nativeElement.querySelectorAll('mat-option');
        const optionOne: HTMLOptionElement = optionList[0];
        optionOne.click();
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith(['projects', 'fake-project-id', chosenOption.type.toLocaleLowerCase(), chosenOption.id], jasmine.any(Object));
    }));

});



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
import { ProcessHeaderComponent } from './process-header.component';
import { MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'ama-sdk';
import { CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { mockProcess } from '../../store/process.mock';
import { AmaTitleService } from 'ama-sdk';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProcessHeaderComponent', () => {
    let fixture: ComponentFixture<ProcessHeaderComponent>;
    let component: ProcessHeaderComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                CoreModule,
                MatIconModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                HttpClientTestingModule
            ],
            providers: [
                AmaTitleService,
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockReturnValue(of({}))
                    }
                }
            ],
            declarations: [ ProcessHeaderComponent ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.process = mockProcess;
    });

    it('should render component', () => {
        expect(component).not.toBeNull();
    });

    it('should render breadcrumbs', () => {
        const breadcrumbs = fixture.debugElement.query(By.css('amasdk-header-breadcrumbs'));
        expect(breadcrumbs).not.toBeNull();
    });

    it('should test download button', () => {
        spyOn(component.download, 'emit');

        const button = fixture.debugElement.query(By.css('[data-automation-id="process-editor-download-button"]'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();

        expect(component.download.emit).toHaveBeenCalledWith(mockProcess);
    });

    it('should test save button', () => {
        spyOn(component.save, 'emit');

        const button = fixture.debugElement.query(By.css('[data-automation-id="process-editor-save-button"]'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();

        expect(component.save.emit).toHaveBeenCalledWith(mockProcess.id);
    });

    it('should test delete button', () => {
        spyOn(component.delete, 'emit');

        const menuButton = fixture.debugElement.query(By.css('[data-automation-id="process-editor-menu-button"]'));
        menuButton.triggerEventHandler('click', {});
        fixture.detectChanges();

        const deleteButton = fixture.debugElement.query(By.css('[data-automation-id="process-editor-delete-button"]'));
        deleteButton.triggerEventHandler('click', {});
        fixture.detectChanges();

        expect(component.delete.emit).toHaveBeenCalledWith(mockProcess.id);
    });

});

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

import { SearchHeaderComponent } from './search-header.component';
import { SearchTextInputComponent, AppConfigService } from '@alfresco/adf-core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule, MatIconModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe ('Search Header Component', () => {
    let component: SearchHeaderComponent;
    let fixture: ComponentFixture<SearchHeaderComponent>;
    let element, debugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                MatTooltipModule,
                MatIconModule,
                NoopAnimationsModule,
                RouterTestingModule
            ],
            declarations: [
                SearchHeaderComponent,
                SearchTextInputComponent
            ],
            providers: [
                { provide: AppConfigService, useValue: {get: jest.fn('navigation').mockRejectedValue('{}')} },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchHeaderComponent);
        element = fixture.nativeElement;
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    it('should open the input box on click on the search button', () => {
        fixture.detectChanges();

        const searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));
        searchButton.triggerEventHandler('click', null);

        fixture.detectChanges();

        expect(element.querySelector('#adf-control-input')).not.toBeNull();
    });

    it('should call onSearchSubmit on enter from search input', async(() => {
        const onSearchSubmitSpy = spyOn(component, 'onSearchSubmit');
        fixture.detectChanges();

        const searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));
        searchButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        const input = debugElement.query(By.css('#adf-control-input'));
        input.triggerEventHandler('keyup.enter', { target: { value: 'MOCK-SEARCH'}});
        fixture.detectChanges();

        expect(onSearchSubmitSpy).toHaveBeenCalled();
    }));

    it('should send case insensitive value to searchProjects', async(() => {
        const searchProjectSpy = spyOn(component, 'searchProjects');
        fixture.detectChanges();

        const searchButton: DebugElement = debugElement.query(By.css('#adf-search-button'));
        searchButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        const input = debugElement.query(By.css('#adf-control-input'));
        input.triggerEventHandler('keyup.enter', { target: { value: 'MOCK-SEARCH'}});
        fixture.detectChanges();

        expect(searchProjectSpy).toHaveBeenCalledWith('mock-search');
    }));
});

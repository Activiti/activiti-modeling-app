 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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
import { ApplicationContentComponent } from './application-content.component';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material';
import { ToolbarModule } from '@alfresco/adf-core';
import { ApplicationEditorState } from 'ama-sdk';
import { of } from 'rxjs';
import { ExportApplicationAction } from '../../store/actions/application';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('ApplicationContentComponent', () => {
    let fixture: ComponentFixture<ApplicationContentComponent>;
    let store: Store<ApplicationEditorState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatIconModule,  ToolbarModule, TranslateModule.forRoot()],
            declarations: [ApplicationContentComponent],
            providers: [{provide: Store, useValue: {dispatch: jest.fn(), select: jest.fn().mockReturnValue(of({}))}}]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationContentComponent);
        store = TestBed.get(Store);
        fixture.detectChanges();
    });

    it('download button exists', () => {
        const button = fixture.nativeElement.querySelector('.download-app-btn');

        expect(button === null).toBeFalsy();
    });

    it('clicking on download button should dispatch an ExportApplicationAction', () => {
        spyOn(store, 'dispatch');
        const button = fixture.debugElement.query(By.css('.download-app-btn'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();
        const exportAction: ExportApplicationAction = store.dispatch.calls.argsFor(0)[0];


        expect(exportAction.type).toBe('EXPORT_APPLICATION');
        expect(exportAction.payload).toEqual({});
    }

    );
});

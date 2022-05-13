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
import { CardViewProcessVariablesItemComponent } from './process-variable-item.component';
import { Store } from '@ngrx/store';
import { ProcessEditorState } from '../../../store/process-editor.state';
import { OpenProcessVariablesDialogAction, OPEN_PROCESS_VARIABLES_DIALOG } from '../../../store/process-variables.actions';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { mockProcessId } from '../../../store/process.mock';

describe('ProcessVariableItemComponent', () => {
    let fixture: ComponentFixture<CardViewProcessVariablesItemComponent>;
    let component: CardViewProcessVariablesItemComponent;
    let store: Store<ProcessEditorState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{provide: Store, useValue: { dispatch: jest.fn()}}],
            declarations: [CardViewProcessVariablesItemComponent],
            imports: [TranslateModule.forRoot()],
            schemas: [ NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewProcessVariablesItemComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(Store);
        fixture.detectChanges();
    });

    it('template should have button', () => {
        const button = fixture.nativeElement.querySelector('button');
        expect (button === null).toBeFalsy();
        expect(button.innerHTML).toEqual('<mat-icon class="ama-variables-icon">layers</mat-icon>APP.DIALOGS.EDIT_PROPERTIES');
    });

    it('clicking on edit button should dispatch a OPEN_VARIABLES_DIALOG action', () => {
        component.property = { value: mockProcessId };
        const dispatchSpy = spyOn(store, 'dispatch');
        const button = fixture.nativeElement.querySelector('button');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const action: OpenProcessVariablesDialogAction = dispatchSpy.calls.argsFor(0)[0];
        expect(store.dispatch).toHaveBeenCalled();
        expect(action.type).toBe(OPEN_PROCESS_VARIABLES_DIALOG);
        expect(action.processId).toBe(mockProcessId);
    });
});

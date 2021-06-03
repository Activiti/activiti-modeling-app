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

import { Store } from '@ngrx/store';
import { ProcessEditorState } from '../../../store/process-editor.state';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CardViewProcessErrorsItemComponent } from './process-errors-item.component';
import { OpenProcessErrorsDialogAction, OPEN_PROCESS_ERRORS_DIALOG } from '../../../store/process-errors.actions';

describe('CardViewProcessErrorsItemComponent', () => {
    let fixture: ComponentFixture<CardViewProcessErrorsItemComponent>;
    let store: Store<ProcessEditorState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: Store, useValue: { dispatch: jest.fn() } }],
            declarations: [CardViewProcessErrorsItemComponent],
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(CardViewProcessErrorsItemComponent);
        store = TestBed.inject(Store);
        fixture.detectChanges();
    });

    it('clicking on process errors button should dispatch a OPEN_ERRORS_DIALOG action', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        const button = fixture.nativeElement.querySelector('button');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const action: OpenProcessErrorsDialogAction = dispatchSpy.calls.argsFor(0)[0];
        expect(store.dispatch).toHaveBeenCalled();
        expect(action.type).toBe(OPEN_PROCESS_ERRORS_DIALOG);
    });
});

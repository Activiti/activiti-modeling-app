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
import { CardViewProcessMessagesItemComponent } from './process-messages-item.component';
import {
    OPEN_PROCESS_MESSAGES_DIALOG,
    OpenProcessMessagesDialogAction
} from '../../../store/process-messages.actions';

describe('ProcessVariableItemComponent', () => {
    let fixture: ComponentFixture<CardViewProcessMessagesItemComponent>;
    let store: Store<ProcessEditorState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{provide: Store, useValue: { dispatch: jest.fn()}}],
            declarations: [CardViewProcessMessagesItemComponent],
            imports: [TranslateModule.forRoot()],
            schemas: [ NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(CardViewProcessMessagesItemComponent);
        store = TestBed.inject(Store);
        fixture.detectChanges();
    });

    it('clicking on process messages button should dispatch a OPEN_MESSAGES_DIALOG action', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        const button = fixture.nativeElement.querySelector('button');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const action: OpenProcessMessagesDialogAction = dispatchSpy.calls.argsFor(0)[0];
        expect(store.dispatch).toHaveBeenCalled();
        expect(action.type).toBe(OPEN_PROCESS_MESSAGES_DIALOG);
    });
});

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

import { NotificationService } from './notification.service';
import { TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { AmaState } from '../../store/app.state';
import { SnackbarErrorAction } from '../../store/app.actions';

describe('NotificationsService ', () => {
    let service: NotificationService;
    let store: Store<AmaState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            providers: [NotificationService, { provide: Store, useValue: { dispatch: jest.fn() } }]
        }).compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(NotificationService);
        store = TestBed.get(Store);
    });

    it('should dispatch SnackbarErrorAction when showError is called', () => {
        spyOn(store, 'dispatch');
        service.showError('my error');

        expect(store.dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('my error'));
   
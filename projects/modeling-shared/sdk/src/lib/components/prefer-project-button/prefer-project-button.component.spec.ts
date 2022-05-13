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

import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AmaState } from '../../store/app.state';
import { AddToFavoritesProjectAttemptAction, RemoveFromFavoritesProjectAttemptAction } from '../../store/project.actions';
import { PreferProjectButtonComponent } from './prefer-project-button.component';

describe('PreferProjectButton', () => {
    let component: PreferProjectButtonComponent;
    let fixture: ComponentFixture<PreferProjectButtonComponent>;
    let store: Store<AmaState>;

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
                PreferProjectButtonComponent
            ],
            providers: [
                {
                    provide: Store,
                    useValue: {dispatch: jest.fn()}
                },
                { provide: TranslationService, useClass: TranslationMock }
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PreferProjectButtonComponent);
        store = TestBed.inject(Store);
        component = fixture.componentInstance;
        component.projectId = 'projectId';
    });

    it('should show the star icon for preferred projects', () => {
        const changes: SimpleChanges = {
            isPreferred: {
                currentValue: true,
                firstChange: true,
                isFirstChange: () => true,
                previousValue: []
            }
        };
        component.ngOnChanges(changes);
        fixture.detectChanges();
        const star: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="projectId-toggle-prefer-project"] mat-icon');
        expect(star.textContent).toBe('star');
    });

    it('should show the star icon for preferred projects', () => {
        const changes: SimpleChanges = {
            isPreferred: {
                currentValue: false,
                firstChange: true,
                isFirstChange: () => true,
                previousValue: []
            }
        };
        component.ngOnChanges(changes);
        fixture.detectChanges();
        const star: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="projectId-toggle-prefer-project"] mat-icon');
        expect(star.textContent).toBe('star_border');
    });

    it('should dispatch remove favorite action when clicked an already favorite element', () => {
        component.isPreferred = true;
        fixture.detectChanges();
        const preferButton: HTMLButtonElement = fixture.nativeElement.querySelector('[data-automation-id="projectId-toggle-prefer-project"]');
        preferButton.click();
        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalledWith(new RemoveFromFavoritesProjectAttemptAction('projectId'));
    });

    it('should dispatch add favorite action when clicked an already favorite element', () => {
        component.isPreferred = false;
        fixture.detectChanges();
        const preferButton: HTMLButtonElement = fixture.nativeElement.querySelector('[data-automation-id="projectId-toggle-prefer-project"]');
        preferButton.click();
        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalledWith(new AddToFavoritesProjectAttemptAction('projectId'));
    });
});

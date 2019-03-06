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

import { PaletteComponent } from './palette.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule, MatCardModule } from '@angular/material';
import { By } from '@angular/platform-browser';

describe('Palette component', () => {
    let fixture: ComponentFixture<PaletteComponent>;
    let component: PaletteComponent;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                MatMenuModule,
                MatCardModule
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
            ],
            declarations: [PaletteComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PaletteComponent);
        component = fixture.componentInstance;
        component.paletteIcons = [
            {
                icon: 'test',
                title: '',
                children: null
            },
            {
                icon: 'test1',
                title: '',
                children: [
                    {
                        icon: 'submenu1',
                        title: ''
                    },
                    {
                        icon: 'submenu2',
                        title: ''
                    }
                ]
            }
        ];
        fixture.detectChanges();
    });

    it('should render component', () => {
        expect(component).not.toBeNull();
    });

    it('submenu should be displayed for items with children', () => {
        const secondButton = fixture.debugElement.query(By.css('.mat-card button' ));
        secondButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        const subMenu = fixture.debugElement.query(By.css('.mat-menu-panel'));

        expect(subMenu).not.toBeNull();
    });

    it('submenu should not be displayed for items without children', () => {
        const firstButton = fixture.debugElement.query(By.css('.mat-card .entry:first-child'));
        firstButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        const subMenu = fixture.debugElement.query(By.css('.mat-menu-panel'));

        expect(subMenu).toBeNull();
    });
});

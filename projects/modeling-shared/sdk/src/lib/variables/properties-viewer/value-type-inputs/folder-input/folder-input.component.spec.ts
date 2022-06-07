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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertiesViewerFolderInputComponent } from './folder-input.component';
import { CoreModule } from '@angular/flex-layout';
import { CodeEditorModule } from '../../../../code-editor/code-editor.module';
import { ExpressionCodeEditorComponent } from '../../../public-api';
import { UuidService } from '../../../../services/uuid.service';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';

describe('PropertiesViewerFolderInputComponent', () => {
    let component: PropertiesViewerFolderInputComponent;
    let fixture: ComponentFixture<PropertiesViewerFolderInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot(),
                CoreModule,
                CodeEditorModule
            ],
            declarations: [
                PropertiesViewerFolderInputComponent,
                ExpressionCodeEditorComponent
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: UuidService,
                    useValue: {
                        generate: () => 'generated-uuid'
                    }
                },
                DialogService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerFolderInputComponent);
        component = fixture.componentInstance;
    });

    describe('should stringify the input onInit', () => {
        it('null', () => {
            const value = null;
            component.value = value;
            component.ngOnInit();
            expect(component.strValue).toEqual('');
        });

        it('undefined', () => {
            const value = undefined;
            component.value = value;
            component.ngOnInit();
            expect(component.strValue).toEqual('');
        });

        it('object', () => {
            const value = { a: 'b' };
            component.value = value;
            component.ngOnInit();
            expect(component.strValue).toEqual(JSON.stringify(value, null, 4));
        });

        it('integer', () => {
            const value = 1;
            component.value = value;
            component.ngOnInit();
            expect(component.strValue).toEqual(JSON.stringify(value, null, 4));
        });

        it('string', () => {
            const value = 'a';
            component.value = value;
            component.ngOnInit();
            expect(component.strValue).toEqual('a');
        });

        it('boolean', () => {
            const value = true;
            component.value = value;
            component.ngOnInit();
            expect(component.strValue).toEqual(JSON.stringify(value, null, 4));
        });

        it('array', () => {
            const value = [1, 2, 3];
            component.value = value;
            component.ngOnInit();
            expect(component.strValue).toEqual(JSON.stringify(value, null, 4));
        });
    });

    describe('should emit the object parsed', () => {
        beforeEach(() => {
            spyOn(component.change, 'emit');
        });

        it('object', () => {
            component.onChange('{"a":"b"}');
            expect(component.change.emit).toHaveBeenCalledWith({ a: 'b' });
        });

        it('integer', () => {
            component.onChange('1');
            expect(component.change.emit).toHaveBeenCalledWith(1);
        });

        it('string', () => {
            component.onChange('"a"');
            expect(component.change.emit).toHaveBeenCalledWith('a');
        });

        it('boolean', () => {
            component.onChange('true');
            expect(component.change.emit).toHaveBeenCalledWith(true);
        });

        it('array', () => {
            component.onChange('[1, 2, 3]');
            expect(component.change.emit).toHaveBeenCalledWith([1, 2, 3]);
        });

        it('should not emit when the value is not a valid json', () => {
            component.onChange('this string is not inside quotes');
            expect(component.change.emit).not.toHaveBeenCalled();
        });
    });
});

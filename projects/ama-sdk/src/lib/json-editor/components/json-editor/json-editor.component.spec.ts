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
import { By } from '@angular/platform-browser';
import { JsonEditorComponent, EditorOptions } from './json-editor.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { FormsModule } from '@angular/forms';

describe('JsonEditorComponent', () => {
    let fixture: ComponentFixture<JsonEditorComponent>;
    let component: JsonEditorComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, MonacoEditorModule.forRoot()],
            declarations: [JsonEditorComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JsonEditorComponent);
        component = fixture.componentInstance;
        component.content = JSON.stringify({ foo: 'bar' });

        fixture.detectChanges();
    });

    it('should render the editor', () => {
        const editor = fixture.debugElement.query(By.css('.monaco-editor'));
        expect(editor).not.toBeNull();
    });

    describe('editorOptions', () => {
        it('should get back the default options', () => {
            expect(component.editorOptions).toEqual({
                language: 'json',
                scrollBeyondLastLine: false,
                contextmenu: false,
                formatOnPaste: true,
                formatOnType: true,
                minimap: {
                    enabled: false
                },
                theme: 'vs-light',
                automaticLayout: true
            });
        });

        it('should get back always the same object if the values match', () => {
            const options1 = component.editorOptions,
                options2 = component.editorOptions;

            expect(options1).toBe(options2);
        });

        it(`should get back another object if the values don't match`, () => {
            const options1: EditorOptions = component.editorOptions;

            component.vsTheme = 'vs-dark';
            const options2 = component.editorOptions;

            expect(options1).not.toBe(options2);
            expect(options1.theme).toBe('vs-light');
            expect(options2.theme).toBe('vs-dark');
        });
    });

    describe('onKeyUp', () => {
        let dummyEditor: any, storedCallback;

        beforeEach(() => {
            dummyEditor = <any>{
                dispose() {},
                onKeyUp(callback) {
                    storedCallback = callback;
                },
                triggerKeyUp() {
                    storedCallback();
                }
            };
        });

        it('should trigger an event on key up with the trimmed content', done => {
            const jsonString = JSON.stringify({ foo: 'bar' });
            component.content = '    ' + jsonString + '    ';
            component.onEditorInit(dummyEditor);

            component.changed.subscribe(value => {
                expect(value).toBe(jsonString);
                done();
            });

            dummyEditor.triggerKeyUp();
        });
    });
});

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
import { By } from '@angular/platform-browser';
import { CodeEditorComponent, CodeEditorPosition } from './code-editor.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of } from 'rxjs';
import { selectSelectedTheme } from '../../../store/app.selectors';
import { ThemingService } from '../../../services/theming.service';

describe('CodeEditorComponent', () => {
    let fixture: ComponentFixture<CodeEditorComponent>;
    let component: CodeEditorComponent;
    let vsCodeTheme$: BehaviorSubject<string>;

    beforeEach(() => {
        vsCodeTheme$ = new BehaviorSubject<string>('vs-light');

        TestBed.configureTestingModule({
            imports: [FormsModule, MonacoEditorModule.forRoot()],
            declarations: [CodeEditorComponent],
            providers: [
                { provide: ThemingService, useValue: { vsCodeTheme$ } },
                {
                    provide: Store, useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectSelectedTheme) {
                                return of({ name: 'Light', className: 'vs-light' });
                            }

                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                }
            ]
        });

        fixture = TestBed.createComponent(CodeEditorComponent);
        component = fixture.componentInstance;
        component.content = JSON.stringify({ foo: 'bar' });
        fixture.detectChanges();
    });

    it('should render the editor', () => {
        const editor = fixture.debugElement.query(By.css('.monaco-editor'));
        expect(editor).not.toBeNull();
    });

    it('should emit onInit when editor is ready', () => {
        spyOn(component.onInit, 'emit');
        const editor = {
            onKeyUp: jest.fn(),
            onDidChangeCursorPosition: jest.fn(),
            onDidBlurEditorWidget: jest.fn(),
            dispose: jest.fn()
        } as unknown as monaco.editor.ICodeEditor;

        component.onEditorInit(editor);

        expect(component.onInit.emit).toHaveBeenCalledWith(editor);
    });

    describe('editorOptions', () => {
        it('should get back the default options', () => {
            expect(component.editorOptions).toEqual({
                language: 'json',
                scrollBeyondLastLine: false,
                contextmenu: true,
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

        it(`should get back another object if the values don't match`, async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const options1: any = component.editorOptions;

            vsCodeTheme$.next('vs-dark');

            fixture.detectChanges();
            await fixture.whenStable();

            const options2: any = component.editorOptions;

            expect(options1.theme).toBe('vs-light');
            expect(options2.theme).toBe('vs-dark');
        });
    });

    describe('onKeyUp', () => {
        let dummyEditor: any, storedCallback, storedPositionCallback, blurEditorCallback;

        beforeEach(() => {
            dummyEditor = <any>{
                dispose() { },
                onKeyUp(callback) {
                    storedCallback = callback;
                },
                onDidChangeCursorPosition(callback) {
                    storedPositionCallback = callback;
                },
                onDidBlurEditorWidget(callback) {
                    blurEditorCallback = callback;
                },
                triggerKeyUp() {
                    storedCallback();
                },
                triggerPositionChange(position: CodeEditorPosition) {
                    storedPositionCallback({ position });
                },
                triggerBlurEditorWidget(content: string) {
                    blurEditorCallback(content);
                },
                getValue() {
                    return JSON.stringify({ foo: 'bar' });
                }
            };
        });

        it('should trigger an event on position change with the new positions', done => {
            /* cspell: disable-next-line */
            component.content = 'Lorem ipsum dolor sit amet';
            const expectedPosition: CodeEditorPosition = {
                lineNumber: 42,
                column: 24
            };
            component.onEditorInit(dummyEditor);

            component.positionChanged.subscribe(position => {
                expect(position).toBe(expectedPosition);
                done();
            });

            dummyEditor.triggerPositionChange(expectedPosition);
        });

        it('should trigger an event on widget blur with the content', done => {
            /* cspell: disable-next-line */
            component.content = 'Lorem ipsum dolor sit amet';
            component.onEditorInit(dummyEditor);

            component.changed.subscribe(content => {
                expect(content).toBe(component.content);
                done();
            });

            dummyEditor.triggerBlurEditorWidget(component.content);
        });

    });
});

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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DialogService } from '../../../dialogs/services/dialog.service';
import { UuidService } from '../../../services/uuid.service';
import { CodeEditorModule } from '../../code-editor.module';
import { ExpressionsEditorService } from '../../services/expressions-editor.service';
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { ExpressionCodeEditorComponent } from './expression-code-editor.component';

describe('ExpressionCodeEditorComponent', () => {
    let fixture: ComponentFixture<ExpressionCodeEditorComponent>;
    let component: ExpressionCodeEditorComponent;
    let uuidService: UuidService;
    let expressionsEditorService: ExpressionsEditorService;
    let dialogService: DialogService;

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [
                CodeEditorModule,
                NoopAnimationsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                DialogService,
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation(() => of({ className: 'vs-light' }))
                    }
                },
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: UuidService,
                    useValue: {
                        generate: () => 'generated-uuid'
                    }
                },
                {
                    provide: ExpressionsEditorService,
                    useValue: {
                        initExpressionEditor: jest.fn(),
                        colorizeElement: jest.fn(),
                    }
                }
            ],
            declarations: [ExpressionCodeEditorComponent, CodeEditorComponent]
        });

        fixture = TestBed.createComponent(ExpressionCodeEditorComponent);
        uuidService = TestBed.inject(UuidService);
        expressionsEditorService = TestBed.inject(ExpressionsEditorService);
        dialogService = TestBed.inject(DialogService);
        component = fixture.componentInstance;
        component.expression = '${a == b}';
        component.ngOnInit();
        fixture.detectChanges();
    });

    describe('onInit', () => {
        it('should not init language when it is set', () => {
            spyOn(uuidService, 'generate');
            spyOn(expressionsEditorService, 'initExpressionEditor');
            component.language = 'javascript';
            component.ngOnInit();
            expect(uuidService.generate).not.toHaveBeenCalled();
            expect(expressionsEditorService.initExpressionEditor).not.toHaveBeenCalled();
            expect(component.language).toEqual('javascript');

        });

        it('should init language when it is not set', () => {
            spyOn(uuidService, 'generate').and.returnValue('generated-uuid');
            spyOn(expressionsEditorService, 'initExpressionEditor');
            component.language = null;
            component.ngOnInit();
            expect(uuidService.generate).toHaveBeenCalled();
            expect(expressionsEditorService.initExpressionEditor).toHaveBeenCalled();
            expect(component.language).toEqual('expression-generated-uuid');
        });

        it('should create working expression with brackets when not removeEnclosingBrackets', () => {
            component.removeEnclosingBrackets = false;
            component.ngOnInit();
            expect(component.workingExpression).toEqual('${a == b}');
        });

        it('should create working expression without brackets when removeEnclosingBrackets', () => {
            component.removeEnclosingBrackets = true;
            component.ngOnInit();
            expect(component.workingExpression).toEqual('a == b');
        });

        it('should init fileUri when it is not set', () => {
            component.fileUri = null;
            component.language = 'expression-generated-uuid';
            component.ngOnInit();
            expect(component.fileUri).toEqual('expression://expression-generated-uuid:editor');
        });

        it('should not init fileUri when it is set', () => {
            component.fileUri = 'my://file:uri';
            component.ngOnInit();
            expect(component.fileUri).toEqual('my://file:uri');
        });

        it('should init editorOptions', () => {
            component.removeLineNumbers = false;
            component.lineWrapping = true;
            component.ngOnInit();
            expect(component.editorOptions.wordWrap).toEqual('on');
            expect(component.editorOptions.lineNumbers).toEqual('on');
        });
    });

    describe('ngAfterViewInit', () => {
        it('should colorize element when not enableInlineEditor', () => {
            spyOn(expressionsEditorService, 'colorizeElement');
            component.enableInlineEditor = false;
            component.ngAfterViewInit();
            expect(expressionsEditorService.colorizeElement).toHaveBeenCalled();
        });

        it('should not colorize element when enableInlineEditor', () => {
            spyOn(expressionsEditorService, 'colorizeElement');
            component.enableInlineEditor = true;
            component.ngAfterViewInit();
            expect(expressionsEditorService.colorizeElement).not.toHaveBeenCalled();
        });
    });

    describe('ngOnChanges', () => {
        beforeAll(() => {
            component.removeLineNumbers = true;
            component.lineWrapping = true;
            component.ngOnInit();
        });

        it('should init working expression and previewer on expression changes', () => {
            spyOn(expressionsEditorService, 'colorizeElement');

            component.enableInlineEditor = false;
            component.removeEnclosingBrackets = true;
            component.expression = '${c == d}';
            const changes: SimpleChanges = {
                expression: {
                    currentValue: '${c == d}',
                    firstChange: false,
                    isFirstChange: () => false,
                    previousValue: '${a == b}'
                }
            };

            component.ngOnChanges(changes);

            expect(component.workingExpression).toEqual('c == d');
            expect(expressionsEditorService.colorizeElement).toHaveBeenCalled();
        });

        it('should init language and previewer on language changes', () => {
            spyOn(expressionsEditorService, 'colorizeElement');
            spyOn(uuidService, 'generate').and.returnValue('generated-uuid');
            spyOn(expressionsEditorService, 'initExpressionEditor');

            component.enableInlineEditor = false;
            component.removeEnclosingBrackets = true;
            component.language = null;
            const changes: SimpleChanges = {
                language: {
                    currentValue: null,
                    firstChange: false,
                    isFirstChange: () => false,
                    previousValue: 'javascript'
                }
            };

            component.ngOnChanges(changes);

            expect(uuidService.generate).toHaveBeenCalled();
            expect(expressionsEditorService.initExpressionEditor).toHaveBeenCalled();
            expect(component.language).toEqual('expression-generated-uuid');
            expect(expressionsEditorService.colorizeElement).toHaveBeenCalled();
            expect(component.fileUri).toEqual('expression://expression-generated-uuid:editor');
        });

        it('should init working expression and previewer on removeEnclosingBrackets changes', () => {
            spyOn(expressionsEditorService, 'colorizeElement');

            component.enableInlineEditor = false;
            component.expression = '${a == b}';
            component.removeEnclosingBrackets = true;
            const changes: SimpleChanges = {
                removeEnclosingBrackets: {
                    currentValue: true,
                    firstChange: false,
                    isFirstChange: () => false,
                    previousValue: false
                }
            };

            component.ngOnChanges(changes);

            expect(component.workingExpression).toEqual('a == b');
            expect(expressionsEditorService.colorizeElement).toHaveBeenCalled();
        });

        it('should init language and previewer on variables changes', () => {
            spyOn(expressionsEditorService, 'colorizeElement');
            spyOn(uuidService, 'generate').and.returnValue('new-generated-uuid');
            spyOn(expressionsEditorService, 'initExpressionEditor');

            component.enableInlineEditor = false;
            component.removeEnclosingBrackets = true;
            component.language = 'expression-generated-uuid';
            component.variables = null;
            const changes: SimpleChanges = {
                variables: {
                    currentValue: null,
                    firstChange: false,
                    isFirstChange: () => false,
                    previousValue: []
                }
            };

            component.ngOnChanges(changes);

            expect(uuidService.generate).toHaveBeenCalled();
            expect(expressionsEditorService.initExpressionEditor).toHaveBeenCalled();
            expect(component.language).toEqual('expression-new-generated-uuid');
            expect(expressionsEditorService.colorizeElement).toHaveBeenCalled();
        });

        it('should init previewer on enableInlineEditor changes', () => {
            spyOn(expressionsEditorService, 'colorizeElement');

            component.enableInlineEditor = false;
            const changes: SimpleChanges = {
                enableInlineEditor: {
                    currentValue: false,
                    firstChange: false,
                    isFirstChange: () => false,
                    previousValue: true
                }
            };

            component.ngOnChanges(changes);

            expect(expressionsEditorService.colorizeElement).toHaveBeenCalled();
        });

        it('should init fileUri on fileUri changes', () => {
            component.fileUri = 'my://file:uri';
            component.removeEnclosingBrackets = true;
            component.language = 'expression-generated-uuid';
            const changes: SimpleChanges = {
                fileUri: {
                    currentValue: 'my://file:uri',
                    firstChange: false,
                    isFirstChange: () => false,
                    previousValue: 'expression://expression-generated-uuid:editor'
                }
            };

            component.ngOnChanges(changes);

            expect(component.fileUri).toEqual('my://file:uri');
        });

        it('should init editorOptions on removeLineNumbers changes', () => {
            expect(component.editorOptions.lineNumbers).toEqual('off');
            component.removeLineNumbers = false;
            const changes: SimpleChanges = {
                removeLineNumbers: {
                    currentValue: false,
                    firstChange: false,
                    isFirstChange: () => false,
                    previousValue: true
                }
            };
            component.ngOnChanges(changes);
            expect(component.editorOptions.lineNumbers).toEqual('on');
        });

        it('should init editorOptions on lineWrapping changes', () => {
            expect(component.editorOptions.wordWrap).toEqual('on');
            component.lineWrapping = false;
            const changes: SimpleChanges = {
                lineWrapping: {
                    currentValue: false,
                    firstChange: false,
                    isFirstChange: () => false,
                    previousValue: true
                }
            };
            component.ngOnChanges(changes);
            expect(component.editorOptions.wordWrap).toEqual('off');
        });
    });

    describe('Component outputs', () => {
        it('should emit bracketed expression if expression contains brackets and is expression language', () => {
            spyOn(component.expressionChange, 'emit');

            component.language = 'expression-generated-uuid';
            component.removeEnclosingBrackets = true;
            component.expression = '${a == b}';

            component.expChanged('${c == d}');

            expect(component.expressionChange.emit).toHaveBeenCalledWith('${c == d}');
        });

        it('should emit bracketed expression if expression does not contain brackets and is expression language', () => {
            spyOn(component.expressionChange, 'emit');

            component.language = 'expression-generated-uuid';
            component.removeEnclosingBrackets = true;
            component.expression = '${a == b}';

            component.expChanged('c == d');

            expect(component.expressionChange.emit).toHaveBeenCalledWith('${c == d}');
        });

        it('should emit undefined if expression is null', () => {
            spyOn(component.expressionChange, 'emit');

            component.language = 'expression-generated-uuid';
            component.removeEnclosingBrackets = true;
            component.expression = '${a == b}';

            component.expChanged(null);

            expect(component.expressionChange.emit).toHaveBeenCalledWith(undefined);
        });

        it('should emit empty string if expression is empty', () => {
            spyOn(component.expressionChange, 'emit');

            component.language = 'expression-generated-uuid';
            component.removeEnclosingBrackets = true;
            component.expression = '${a == b}';

            component.expChanged('');

            expect(component.expressionChange.emit).toHaveBeenCalledWith('');
        });

        it('should emit the expression string if it is not an expression language', () => {
            spyOn(component.expressionChange, 'emit');

            component.language = 'javascript';
            component.removeEnclosingBrackets = true;
            component.expression = '${a == b}';

            component.expChanged('let a=5;');

            expect(component.expressionChange.emit).toHaveBeenCalledWith('let a=5;');
        });
    });

    it('should open editor dialog', () => {
        spyOn(dialogService, 'openDialog').and.stub();

        component.enableDialogEditor = true;

        component.editInDialog();

        expect(dialogService.openDialog).toHaveBeenCalled();
    });
});

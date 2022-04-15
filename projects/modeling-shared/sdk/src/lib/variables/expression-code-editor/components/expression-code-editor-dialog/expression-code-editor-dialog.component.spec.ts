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

import { TranslationService, TranslationMock, CoreModule } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { UuidService } from '../../../../services/uuid.service';
import { ExpressionsEditorService } from '../../services/expressions-editor.service';
import { ExpressionCodeEditorComponent } from '../expression-code-editor/expression-code-editor.component';
import { ExpressionCodeEditorDialogComponent } from './expression-code-editor-dialog.component';
import { ExpressionSimulatorComponent } from '../expression-simulator/expression-simulator.component';

describe('ExpressionCodeEditorDialogComponent', () => {
    let fixture: ComponentFixture<ExpressionCodeEditorDialogComponent>;
    let component: ExpressionCodeEditorDialogComponent;
    const expressionUpdate$ = new Subject<string>();

    const mockDialog = {
        close: jest.fn()
    };

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                NoopAnimationsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                DialogService,
                { provide: MatDialogRef, useValue: mockDialog },
                {
                    provide: MAT_DIALOG_DATA, useValue: {
                        expression: '${a == b}',
                        vsTheme$: of('vs-light'),
                        language: 'javascript',
                        removeEnclosingBrackets: true,
                        variables: [],
                        fileUri: 'my://file:uri',
                        expressionUpdate$: expressionUpdate$
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
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation(() => of({ className: 'vs-light' }))
                    }
                },
                {
                    provide: ExpressionsEditorService,
                    useValue: {
                        initExpressionEditor: jest.fn(),
                        removeEditorLanguageSettings: jest.fn(),
                        colorizeElement: jest.fn(),
                    }
                }
            ],
            declarations: [ExpressionCodeEditorComponent, ExpressionCodeEditorDialogComponent, ExpressionSimulatorComponent]
        });

        fixture = TestBed.createComponent(ExpressionCodeEditorDialogComponent);
        component = fixture.componentInstance;
    });

    it('should close dialog without emitting data onClose', () => {
        spyOn(component.dialog, 'close');
        spyOn(component.data.expressionUpdate$, 'next');

        component.onClose();

        expect(component.dialog.close).toHaveBeenCalled();
        expect(component.data.expressionUpdate$.next).not.toHaveBeenCalled();
    });

    it('should close dialog emitting data onSave', () => {
        spyOn(component.dialog, 'close');
        spyOn(component.data.expressionUpdate$, 'next');

        component.onSave();

        expect(component.dialog.close).toHaveBeenCalled();
        expect(component.data.expressionUpdate$.next).toHaveBeenCalledWith('${a == b}');
    });
});

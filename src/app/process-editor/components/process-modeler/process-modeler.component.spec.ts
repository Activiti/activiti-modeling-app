import { ProcessModelerComponent } from './process-modeler.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MatTooltipModule, MatIconModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AmaState } from 'ama-sdk';
import { PROCESS_EDITOR_STATE_NAME, selectProcess } from '../../store/process-editor.selectors';
import { processEditorReducer } from '../../store/process-editor.reducer';
import { ProcessModelerService } from '../../services/process-modeler.service';
import { BpmnFactoryToken } from '../../services/bpmn-factory.token';
import { BpmnFactoryMock, getDiagramElementMock } from '../../services/bpmn-js/bpmn-js.mock';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { mockProcess } from '../../store/process.mock';

describe('ProcessModelerComponent', () => {
    let fixture: ComponentFixture<ProcessModelerComponent>;
    let component: ProcessModelerComponent;
    let store: Store<AmaState>;
    let processModelerService: ProcessModelerService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatTooltipModule,
                MatIconModule,
                StoreModule.forRoot({
                    [PROCESS_EDITOR_STATE_NAME]: processEditorReducer
                }),
                TranslateModule.forRoot(),
                NoopAnimationsModule
            ],
            providers: [
                ProcessModelerService,
                { provide: BpmnFactoryToken, useClass: BpmnFactoryMock },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectProcess) {
                                return of(mockProcess);
                            }

                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                }
            ],
            declarations: [ProcessModelerComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessModelerComponent);
        component = fixture.componentInstance;
        store = TestBed.get(Store);
        processModelerService = TestBed.get(ProcessModelerService);
        fixture.detectChanges();
    });

    it('should render component', () => {
        expect(component).not.toBeNull();
    });

    it('should render canvas element', () => {
        expect(component.canvas.nativeElement).not.toBeNull();
    });

    it('should init BPMN service', () => {
        spyOn(processModelerService, 'init');
        component.ngOnInit();

        expect(processModelerService.init).toHaveBeenCalled();
    });

    it('should test undo button', () => {
        spyOn(processModelerService, 'undo');

        const button = fixture.debugElement.query(By.css('[data-automation-class="undo-button"]'));
        expect(button).not.toBe(null);

        button.triggerEventHandler('click', null);
        expect(processModelerService.undo).toHaveBeenCalled();
    });

    it('should test redo button', () => {
        spyOn(processModelerService, 'redo');

        const button = fixture.debugElement.query(By.css('[data-automation-class="redo-button"]'));
        expect(button).not.toBe(null);

        button.triggerEventHandler('click', null);
        expect(processModelerService.redo).toHaveBeenCalled();
    });

    it('should test zoom in button', () => {
        spyOn(processModelerService, 'zoomIn');

        const button = fixture.debugElement.query(By.css('[data-automation-class="zoom-in-button"]'));
        expect(button).not.toBe(null);

        button.triggerEventHandler('click', null);
        expect(processModelerService.zoomIn).toHaveBeenCalled();
    });

    it('should test zoom out button', () => {
        spyOn(processModelerService, 'zoomOut');

        const button = fixture.debugElement.query(By.css('[data-automation-class="zoom-out-button"]'));
        expect(button).not.toBe(null);

        button.triggerEventHandler('click', null);
        expect(processModelerService.zoomOut).toHaveBeenCalled();
    });

    it('should load diagram after view init', () => {
        spyOn(processModelerService, 'render');
        spyOn(processModelerService, 'loadXml').and.returnValue(of('diagram'));

        component.ngAfterViewInit();
        fixture.detectChanges();

        component.source = 'diagram';

        expect(processModelerService.render).toHaveBeenCalled();
        expect(processModelerService.loadXml).toHaveBeenCalled();
    });

    it('should test createSelectedElement function', () => {
        const mockEvent = { element: getDiagramElementMock({ name: 'mock-element-name' }) };
        const selectedElement = component.createSelectedElement(mockEvent);

        expect(selectedElement).toEqual({
            id: 'mock-element-id',
            type: 'mock-element-type',
            name: 'mock-element-name'
        });
    });


});

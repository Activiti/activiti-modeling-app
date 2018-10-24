import { VariablesEffects } from './process-variables.effects';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MatMenuModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { LogService } from '@alfresco/adf-core';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { ProcessModelerService } from '../services/process-modeler.service';
import { BpmnFactoryToken } from '../services/bpmn-factory.token';
import { SetAppDirtyStateAction, DialogService, selectSelectedProcessId } from 'ama-sdk';
import { UpdateProcessVariablesAction } from './process-variables.actions';
import { hot, cold } from 'jasmine-marbles';

describe('Process variables effects', () => {
    let effects: VariablesEffects;
    let metadata: EffectsMetadata<VariablesEffects>;
    let actions$: Observable<any> = of();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule, NoopAnimationsModule, MatMenuModule],
            providers: [
                VariablesEffects,
                DialogService,
                provideMockActions(() => actions$),
                {
                    provide: Router,
                    useValue: { navigate: jest.fn() }
                },
                {
                    provide: LogService,
                    useValue: { error: jest.fn() }
                },
                {
                    provide: Store,
                    useValue: { select: jest.fn(selectSelectedProcessId).mockReturnValue(of('id')) }
                },
                {
                    provide:  BpmnFactoryToken,
                    useValue: {}
                },
                {
                    provide:  ProcessModelerService,
                    useValue: {
                        updateElementProperty: jest.fn(),
                        getRootProcessElement: jest.fn().mockReturnValue({ id: '' })
                    }
                }
            ]
        });

        effects = TestBed.get(VariablesEffects);
        metadata = getEffectsMetadata(effects);
    });

    it('openVariablesDialog effect should not dispatch an action', () => {
        expect(metadata.openVariablesDialogEffect).toEqual({ dispatch: false });
    });

    describe('updateProcessVariablesEffect', () => {
        it('updateProcessVariablesEffect effect should dispatch an action', () => {
            expect(metadata.updateProcessVariablesEffect).toEqual({ dispatch: true });
        });

        it('updateProcessVariablesEffect should dispatch SetAppDirtyStateAction', () => {
            actions$ = hot('a', { a: new UpdateProcessVariablesAction({
                'id': { id: 'dsd', name: 'name', value: 'test', type: 'string', required: true}
            })});
            const expected = cold('b', {
                b: new SetAppDirtyStateAction(true)
            });

            expect(effects.updateProcessVariablesEffect).toBeObservable(expected);
        });
    });

});

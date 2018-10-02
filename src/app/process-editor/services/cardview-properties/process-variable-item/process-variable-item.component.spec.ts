import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CardViewProcessVariablesItemComponent } from './process-variable-item.component';
import { Store } from '@ngrx/store';
import { ProcessEditorState } from '../../../store/process-editor.state';
import { CardItemTypeService } from '@alfresco/adf-core';
import { OpenVariablesDialogAction, OPEN_VARIABLES_DIALOG } from '../../../store/process-variables.actions';
import { TranslateModule } from '@ngx-translate/core';

describe('ProcessVariableItemComponent', () => {
    let fixture: ComponentFixture<CardViewProcessVariablesItemComponent>;
    let component: CardViewProcessVariablesItemComponent;
    let store: Store<ProcessEditorState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [CardItemTypeService, {provide: Store, useValue: { dispatch: jest.fn()}}],
            declarations: [CardViewProcessVariablesItemComponent],
            imports: [TranslateModule.forRoot()]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewProcessVariablesItemComponent);
        component = fixture.componentInstance;
        store = TestBed.get(Store);
        fixture.detectChanges();
    });

    it('template should have button', () => {
        const button = fixture.nativeElement.querySelector('button');
        expect (button === null).toBeFalsy();
        expect(button.innerHTML).toEqual('APP.DIALOGS.EDIT_PROPERTIES');
    });

    it('clicking on edit button should dispatch a OPEN_VARIABLES_DIALOG action', () => {
        spyOn(store, 'dispatch');
        const button = fixture.nativeElement.querySelector('button');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const action: OpenVariablesDialogAction = store.dispatch.calls.argsFor(0)[0];
        expect(store.dispatch).toHaveBeenCalled();
        expect(action.type).toBe(OPEN_VARIABLES_DIALOG);
    });
});

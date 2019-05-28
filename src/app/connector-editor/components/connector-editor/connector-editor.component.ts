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

import { Component, ChangeDetectorRef } from '@angular/core';
import { ComponentRegisterService } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { selectSelectedConnectorContent, selectConnectorLoadingState, selectSelectedConnectorId } from '../../store/connector-editor.selectors';
import { map, filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ChangeConnectorContent } from '../../store/connector-editor.actions';
import {
    AmaState,
    // connectorSchema,
    selectSelectedTheme,
    // ConnectorContent,
    // CodeValidatorService,
    // ValidationResponse,
    AdvancedConnectorEditorData,
    AdvancedConnectorEditorKey
} from 'ama-sdk';
const memoize = require('lodash/memoize');

@Component({
    templateUrl: './connector-editor.component.html'
})
export class ConnectorEditorComponent {
    disableSave = false;

    connectorId$: Observable<string>;
    vsTheme$: Observable<string>;
    editorContent$: Observable<string>;
    loadingState$: Observable<boolean>;
    componentKey = AdvancedConnectorEditorKey;

    boundOnChangeAttempt: any;
    getMemoizedDynamicComponentData: any;
    schemaUri: string;

    constructor(
        private store: Store<AmaState>,
        // private codeValidatorService: CodeValidatorService,
        private changeDetectorRef: ChangeDetectorRef,
        private componentRegister: ComponentRegisterService
    ) {
        this.vsTheme$ = this.getVsTheme();
        this.loadingState$ = this.store.select(selectConnectorLoadingState);
        this.connectorId$ = this.store.select(selectSelectedConnectorId);
        this.editorContent$ = this.store.select(selectSelectedConnectorContent).pipe(
            filter(content => !!content),
            map(content => JSON.stringify(content, undefined, 4).trim())
        );

        this.boundOnChangeAttempt = this.onChangeAttempt.bind(this);
        this.getMemoizedDynamicComponentData = memoize((connectorContent, onChangeAttempt) => {
            return { connectorContent, onChangeAttempt };
        });

        this.schemaUri = 'connectorSchema';
    }

    onTabChange(): void {
        this.disableSave = false;
    }

    isAdvancedEditorEmbedded(): boolean {
        return this.componentRegister.hasComponentById(this.componentKey);
    }

    getDynamicComponentData(editorContent: string): AdvancedConnectorEditorData {
        return this.getMemoizedDynamicComponentData(editorContent, this.boundOnChangeAttempt);
    }

    onChangeAttempt(connectorContentString: string): void {
       // this.disableSave = !this.validate(connectorContentString).valid;

        if (!this.disableSave) {
            this.editorContent$ = of(connectorContentString);
            this.store.dispatch(new ChangeConnectorContent());
        }

        this.changeDetectorRef.detectChanges();
    }

    // private validate(connectorContentString: string): ValidationResponse<ConnectorContent> {
    //     return this.codeValidatorService.validateJson<ConnectorContent>(connectorContentString, connectorSchema);
    // }

    private getVsTheme(): Observable<string> {
        return this.store
            .select(selectSelectedTheme)
            .pipe(map(theme => (theme.className === 'dark-theme' ? 'vs-dark' : 'vs-light')));
    }
}

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

import { element, by } from 'protractor';
import { GenericPage } from './common/generic.page';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class ProcessModelerComponent extends GenericPage {

    readonly processEditorModeler = element(by.css(`[data-automation-id="process-editor-modeler"]`));
    readonly canvas = element(by.className(`canvas-editor`));
    readonly userTask = element(by.css(`[data-automation-id="element::bpmn:UserTask"]`));
    readonly startEvent = element(by.css(`[data-automation-id="element::bpmn:StartEvent"]`));
    readonly intermediateThrowEvent = element(by.css(`[data-automation-id="element::bpmn:IntermediateThrowEvent"]`));
    readonly endEvent = element(by.css(`[data-automation-id="element::bpmn:EndEvent"]`));
    readonly serviceTask = element(by.css(`[data-automation-id="element::bpmn:ServiceTask"]`));
    readonly callActivity = element(by.css(`[data-automation-id="element::bpmn:CallActivity"]`));
    readonly decisionTask = element(by.css(`[data-automation-id="decision-task::decision-task"]`));
    readonly scriptTask = element(by.css(`[data-automation-id="script-task::script-task"]`));
    readonly subProcess = element(by.css(`[data-automation-id="element::bpmn:SubProcess"]`));
    readonly processStep = element(by.css(`[data-element-id*="ServiceTask"]`));
    readonly typeReplacePopup = element(by.css('.djs-popup.bpmn-replace'));
    readonly typeReplaceButton = element(by.css('[data-action="replace"]'));
    readonly appendTaskButton = element(by.css('[data-action="append.append-task"]'));
    readonly appendEndEventButton = element(by.css('[data-action="append.end-event"]'));

    async isLoaded() {
        await BrowserVisibility.waitUntilElementIsVisible(this.processEditorModeler);
        return true;
    }

    async isUnloaded() {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.processEditorModeler);
        return true;
    }

    async addServiceTask() {
        await super.dragAndDrop(this.serviceTask, this.canvas);
    }

    async addUserTask() {
        await super.dragAndDrop(this.userTask, this.canvas);
    }

    async addCallActivity() {
        await super.dragAndDrop(this.callActivity, this.canvas);
    }

    async addStartEvent(containerSelector: string) {
        await super.dragAndDrop(this.startEvent, element(by.css(containerSelector)), { x: 10, y: 10 });
    }

    async addEndEvent() {
        await super.dragAndDrop(this.endEvent, this.canvas);
    }

    async addBoundaryEvent(containerSelector: string = '.canvas-editor', position = { x: 10, y: 10 }) {
        await super.dragAndDrop(this.intermediateThrowEvent, element(by.css(containerSelector)), position);
    }

    async addSubProcess() {
        await super.dragAndDrop(this.subProcess, this.canvas);
    }

    async addDecisionTask() {
        await super.dragAndDrop(this.decisionTask, this.canvas);
    }

    async addScriptTask() {
        await super.dragAndDrop(this.scriptTask, this.canvas);
    }

    async appendTask() {
        await BrowserActions.click(this.appendTaskButton);
    }

    async appendEndEvent() {
        await BrowserActions.click(this.appendEndEventButton);
    }

    async selectServiceTask() {
        await BrowserActions.click(element(by.css(`[data-element-id*="ServiceTask"]`)));
    }

    async selectCallActivityTask() {
        await BrowserActions.click(element(by.css(`g[data-element-id*="Task"]`)));
    }

    async fitToScreen() {
        await BrowserActions.click(element(by.css(`[data-automation-class="fit-view-port-button"]`)));
    }

    async selectStartEvent() {
        await BrowserActions.click(element(by.css(`[data-element-id*="StartEvent"]`)));
    }

    async selectUserTask(id: string = 'UserTask') {
        await BrowserActions.click(element(by.css(`[data-element-id*="${id}"]`)));
    }

    async selectBoundaryEvent() {
        await BrowserActions.click(element.all(by.css(`[data-element-id*="BoundaryEvent"]`)).first());
    }

    async selectIntermediateEvent() {
        await BrowserActions.click(element.all(by.css(`[data-element-id*="IntermediateThrowEvent"]`)).first());
    }

    async changeElementType(type: string) {
        const selector = `[data-id="${type}"]`;

        await BrowserActions.click(this.typeReplaceButton);
        await BrowserActions.click(element(by.css(selector)));
        await BrowserVisibility.waitUntilElementIsNotVisible(this.typeReplacePopup);
    }

    async isElementSelected(editorElement: string): Promise<boolean> {
        const elementSelectedLocator = element(by.css(`[data-element-id*='${editorElement}'][class*='selected']`));
        try {
            return await BrowserVisibility.waitUntilElementIsVisible(elementSelectedLocator);
        } catch (error) {
            return false;
        }
    }

    async isElementNotSelected(editorElement: string): Promise<boolean> {
        const elementSelectedLocator = element(by.css(`[data-element-id*='${editorElement}'][class*='selected']`));
        try {
            return await BrowserVisibility.waitUntilElementIsNotVisible(elementSelectedLocator);
        } catch (error) {
            return false;
        }
    }

    async isServiceTaskSelected(): Promise<boolean> {
        return this.isElementSelected('ServiceTask');
    }

    async isServiceTaskNotSelected(): Promise<boolean> {
        return this.isElementNotSelected('ServiceTask');
    }

    async selectModelingCanvas(): Promise<void> {
        await BrowserActions.click(this.canvas);
    }
}

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

export class ProcessModelerComponent extends GenericPage {

    readonly processEditorModeler = element(by.css(`[data-automation-id="process-editor-modeler"]`));
    readonly canvas = element(by.className(`canvas-editor`));
    readonly paletteEntries = element(by.css(`[class*="palette-entries"]`));
    readonly userTask = element(by.css(`[data-action="create.user-task"]`));
    readonly serviceTask = element(by.css(`[data-action="create-service-task"]`));
    readonly callActivity = element(by.css(`[data-action="create.callActivity"]`));
    readonly dragElement = element(by.css(`.djs-drag-group`));

    readonly processStep = element(by.css(`[data-element-id*="ServiceTask"]`));

    async isLoaded() {
        await super.waitForElementToBeVisible(this.processEditorModeler);
        return true;
    }

    async isUnloaded() {
        await super.waitForElementToBeInVisible(this.processEditorModeler);
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

    async selectServiceTask() {
        await super.click(element(by.css(`[data-element-id*="ServiceTask"]`)));
    }

    async selectStartEvent() {
        await super.click(element(by.css(`[data-element-id*="StartEvent"]`)));
    }
}

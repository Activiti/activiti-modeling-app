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

import { element, by, browser, protractor } from 'protractor';
import { Logger } from '../util/logger';
import { GenericWebElement } from './common/generic.webelement';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class CodeEditorWidget extends GenericWebElement {

    readonly codeEditorTextArea = element(by.css(`.monaco-editor textarea`));

    async isTextEditorPresent() {
        await BrowserVisibility.waitUntilElementIsVisible(this.codeEditorTextArea);
    }

    async updateCodeEditorContent(content: string): Promise<void> {
        try {
            await browser.sleep(200);
            await browser.executeScript(`this.monaco.editor.getModels()[0].setValue('');`);
            await browser.sleep(200);
            await browser.executeScript('this.monaco.editor.getModels()[0].setValue(`' + content + '`);');
            await this.codeEditorTextArea.click();
            await this.codeEditorTextArea.sendKeys(protractor.Key.HOME);
        } catch (e) {
            Logger.error(`Updating editor content with '${content}' failed with thrown error: ${e.message}`);
            throw e;
        }
    }

    async getCodeEditorValue(modelUri: string = null) {
        await this.isTextEditorPresent();

        let script;
        if (modelUri) {
            script = `return this.monaco.editor.getModel('${modelUri}').getValue()`;
        } else {
            script = `
                var models = this.monaco.editor.getModels();
                return models[models.length-1].getValue()
            `;
        }

        return browser.executeScript<string>(script);
    }

    async enterBulkConfiguration(text): Promise<void> {
        await BrowserActions.clearSendKeys(this.codeEditorTextArea, protractor.Key.HOME);
        const script = `
                var models = this.monaco.editor.getModels();
                return models[models.length-1].setValue('` + JSON.stringify(text) + `')
            `;
        await browser.executeScript<string>(script);
        await this.codeEditorTextArea.click();
        await this.codeEditorTextArea.sendKeys(protractor.Key.HOME, protractor.Key.ENTER);
    }
}

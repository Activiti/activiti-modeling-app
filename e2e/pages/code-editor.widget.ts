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

import { element, by, browser } from 'protractor';
import { Logger } from 'ama-testing/e2e';
import { GenericWebElement } from './common/generic.webelement';

export class CodeEditorWidget extends GenericWebElement {

    readonly codeEditorTexarea = element(by.css(`.monaco-editor textarea`));

    async isTextEditorPresent() {
        await super.waitForElementToBeVisible(this.codeEditorTexarea);
    }

    async updateCodeEditorContent(content: string) {
        try {
            // Reset monaco editor's content, otherwise it gets crazy
            // Having multiple instance at the same time in DOM can break it???
            await browser.executeScript(`this.monaco.editor.getModels()[0].setValue('');`);
            await super.sendKeysIfPresent(this.codeEditorTexarea, content);
        } catch (e) {
            Logger.error(`Updating editor content with '${content}' failed with thrown error: ${e.message}`);
            throw e;
        }
    }

    async getCodeEditorValue(index: number = 0) {
        await this.isTextEditorPresent();
        return await browser.executeScript<string>('return this.monaco.editor.getModels()[' + index + '].getValue()');
    }
}

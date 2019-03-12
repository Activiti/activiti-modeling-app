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
import { UtilRandom } from '../../util/random';
import { GenericDialog } from '../common/generic.dialog';

export interface CreatedEntity {
    name: string;
    description: string;
}

export class CreateEntityDialog extends GenericDialog {

    readonly nameField = element(by.css(`input[data-automation-id='name-field']`));
    readonly descriptionField = element(by.css(`textarea[data-automation-id='desc-field']`));
    readonly submitButton = element(by.css(`button[data-automation-id='submit-button']`));

    constructor() {
        super('Create new ITEM');
    }

    async submit() {
        await super.click(this.submitButton);
    }

    async setEntityName(entityName) {
        await super.clear(this.nameField);
        await super.sendKeysIfVisible(this.nameField, entityName);
    }

    async setEntityDescription(entityDescription) {
        await super.clear(this.descriptionField);
        await super.sendKeysIfVisible(this.descriptionField, entityDescription);
    }

    async setEntityDetails(entityName: string = 'AMA_QA_' + UtilRandom.generateString(), entityDescription: string = UtilRandom.generateString()): Promise<CreatedEntity> {
        await this.isDialogDisplayed();
        await this.setEntityName(entityName);
        await this.setEntityDescription(entityDescription);
        await this.submit();
        await this.isDialogDismissed();
        return {
            name: entityName,
            description: entityDescription
        };
    }
}

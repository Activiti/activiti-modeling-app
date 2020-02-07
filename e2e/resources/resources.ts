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

export const Resources = {
    SIMPLE_PROJECT: {
        file_location: `project/uploaded-project.zip`,
        project_name: `uploaded-project`,
        process_name: `process-with-user-task`
    },

    SIMPLE_PROCESS: {
        file_location: `/resources/process/ama-qa-uploaded-process.bpmn20.xml`,
        process_name: `ama-qa-uploaded-process`
    },

    COMPLEX_CONNECTOR: {
        file_location: `/resources/connector/amauploadedconnector.json`,
        /* cspell: disable-next-line */
        connector_name: `amauploadedconnector`,
        action_id: `e4751f94-3595-4666-bee7-0f157a19cf89`,
        inputParam_id: `68b2787e-76da-4a29-ba16-f1894a5a83e7`,
        outputParam_id: `84deeffa-82da-46fa-871c-d5b48ec7a60f`
    },

    MESSAGE_EVENTS_PROJECTS: {
        file_location: `/resources/project/test-message-events.zip`,
        project_name: `test-message-events`
    },

    SIMPLE_FORM: {
        file_location: `/resources/form/ama-qa-uploaded-form.json`,
        form_name: `ama-qa-uploaded-form`
    },

    SIMPLE_DATA_OBJECT: {
        file_location: `/resources/data/ama-qa-uploaded-data-object.json`,
        dataObject_name: `ama-qa-uploaded-data-object`
    },

    SIMPLE_UI: {
        file_location: `/resources/ui/ama-qa-uploaded-ui.json`,
        ui_name: `ama-qa-uploaded-ui`
    },

    SIMPLE_DECISION_TABLE: {
        file_location: `/resources/decision-table/ama-qa-uploaded-decision-table.json`,
        decisionTable_name: `ama-qa-uploaded-decision-table`
    }
};

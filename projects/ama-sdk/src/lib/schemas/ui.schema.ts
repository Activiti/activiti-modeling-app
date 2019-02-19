/* tslint:disable */
export const uiSchema = {
    "$schema": "http://json-schema.org/schema",
    "title": "Ui schema",
    "type": "object",

    "definitions": {
        "plugins": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties" : false,
                "properties": {
                    "name": {
                        "type": "string",
                        "minLength": 1
                    },
                    "version": {
                        "type": "string",
                        "minLength": 1
                    },
                    "order": {
                        "type": "string",
                        "minLength": 1
                    }
                },
                "required": [ "name", "version", "order" ]
            }
        },
        "configs": {
            "type": "object"
        }
    },

    "properties": {
        "id": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "adf-template": {
            "type": "string",
            "enum": [ "content", "process", "" ]
        },
        "plugins": { "$ref": "#/definitions/plugins" },
        "configs": { "$ref": "#/definitions/configs" }

    },
    "required": [ "id", "name", "adf-template", "plugins" ]
};

/* tslint:disable */
export const connectorSchema = {
    "$schema": "http://json-schema.org/schema",
    "title": "Connector editor schema",
    "description": "Connector editor schema",
    "type": "object",

    "definitions": {
        "connector-parameters": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties" : false,
                "properties": {
                    "id": {
                        "type": "string",
                        "minLength": 1
                    },
                    "name": {
                        "type": "string",
                        "minLength": 1
                    },
                    "description": {
                        "type": "string"
                    },
                    "type": {
                        "type": "string",
                        "enum": [ "string", "integer", "boolean", "date" ]
                    },
                    "required": {
                        "type": "boolean"
                    }
                },
                "required": [ "id", "name", "type" ]
            }
        },
        "connector-action": {
            "type": "object",
            "additionalProperties" : false,
            "properties": {
                "id": {
                    "type": "string",
                    "minLength": 1
                },
                "name": {
                    "type": "string",
                    "minLength": 1
                },
                "description": {
                    "type": "string"
                },
                "inputs": { "$ref": "#/definitions/connector-parameters" },
                "outputs": { "$ref": "#/definitions/connector-parameters" }
            },
            "required": [ "id", "name" ]
        }
    },

    "additionalProperties" : false,
    "properties": {
        "name": {
            "description": "The connector's name",
            "type": "string",
            "pattern": "^[a-z0-9]{0,63}$"
        },
        "description": {
            "description": "The connector's description",
            "type": "string"
        },
        "actions" : {
            "type": "object",
            "additionalProperties": { "$ref": "#/definitions/connector-action" },
            "default": {}
        },
        "template": {
            "type": [ "null", "string" ]
        }

    },
    "required": [ "name" ]
};

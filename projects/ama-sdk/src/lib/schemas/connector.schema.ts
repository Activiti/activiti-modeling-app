/* tslint:disable */
export const connectorSchema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "description": "Connector editor schema",
    "additionalProperties": false,
    "title": "Connector editor schema",
    "type": "object",
    "definitions": {
        "connector-parameters": {
            "type": "array",
            "items": {
                "additionalProperties": false,
                "type": "object",
                "properties": {
                    "name": {
                        "minLength": 1,
                        "type": "string",
                        "pattern": "^[a-z0-9]([-a-z0-9]{0,24}[a-z0-9])?$"
                    },
                    "description": {
                        "type": "string"
                    },
                    "id": {
                        "minLength": 1,
                        "type": "string"
                    },
                    "type": {
                        "type": "string",
                        "enum": [
                            "string",
                            "integer",
                            "boolean",
                            "date"
                        ]
                    },
                    "required": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "id",
                    "name",
                    "type"
                ]
            }
        },
        "connector-action": {
            "additionalProperties": false,
            "type": "object",
            "properties": {
                "outputs": {
                    "$ref": "#/definitions/connector-parameters"
                },
                "inputs": {
                    "$ref": "#/definitions/connector-parameters"
                },
                "name": {
                    "minLength": 1,
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "id": {
                    "minLength": 1,
                    "type": "string"
                }
            },
            "required": [
                "id",
                "name"
            ]
        }
    },
    "properties": {
        "template": {
            "description": "The connector's template",
            "type": "string"
        },
        "name": {
            "minLength": 1,
            "pattern": "^[a-z0-9]([-a-z0-9]*[a-z0-9])?$",
            "description": "The connector's name",
            "type": "string",
            "maxLength": 26
        },
        "description": {
            "description": "The connector's description",
            "type": "string"
        },
        "id": {
            "description": "The connector id",
            "type": "string"
        },
        "actions": {
            "default": {},
            "additionalProperties": {
                "$ref": "#/definitions/connector-action"
            },
            "type": "object"
        }
    },
    "required": [
        "name"
    ]
};

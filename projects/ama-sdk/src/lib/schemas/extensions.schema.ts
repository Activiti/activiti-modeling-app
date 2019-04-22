/* tslint:disable */
export const extensionsSchema = {
    "$schema": "http://json-schema.org/schema",
    "title": "Process Extensions schema",
    "type": "object",

    "definitions": {
        "parameter-mapping": {
            "type": "object",
            "patternProperties": {
                ".+": {
                    "type": "object",
                    "additionalProperties" : false,
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": [ "variable", "value", "static_value" ]
                        },
                        "value": {
                            "type": "string"
                        }
                    },
                    "required": [ "type", "value" ]
                }
            }
        }
    },

    "additionalProperties" : false,
    "properties": {
        "properties": {
            "type": "object",
            "additionalProperties": false,
            "patternProperties": {
                ".+": {
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
                        "type": {
                            "type": "string",
                            "enum": [ "string", "integer", "boolean", "date" ]
                        },
                        "value": {
                            "type": [ "integer", "string", "boolean" ]
                        },
                        "required": {
                            "type": "boolean"
                        }
                    },
                    "required": [ "id", "type", "name", "value" ]
                }
            }
        },
        "mappings" : {
            "type": "object",
            "additionalProperties" : false,
            "patternProperties": {
                ".+": {
                    "type": "object",
                    "additionalProperties" : false,
                    "properties": {
                        "inputs": { "$ref": "#/definitions/parameter-mapping" },
                        "outputs": { "$ref": "#/definitions/parameter-mapping" }
                    }
                }
            }
        }
    }
};

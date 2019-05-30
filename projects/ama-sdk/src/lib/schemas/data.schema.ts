/* tslint:disable */
export const dataSchema = {
    "default": true,
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Core schema meta-schema",
    "type": [
        "object",
        "boolean"
    ],
    "definitions": {
        "nonNegativeIntegerDefault0": {
            "allOf": [
                {
                    "$ref": "#/definitions/nonNegativeInteger"
                },
                {
                    "default": 0
                }
            ]
        },
        "simpleTypes": {
            "enum": [
                "array",
                "boolean",
                "integer",
                "null",
                "number",
                "object",
                "string"
            ]
        },
        "schemaArray": {
            "minItems": 1,
            "type": "array",
            "items": {
                "$ref": "#"
            }
        },
        "nonNegativeInteger": {
            "type": "integer",
            "minimum": 0
        },
        "stringArray": {
            "default": [],
            "uniqueItems": true,
            "type": "array",
            "items": {
                "type": "string"
            }
        }
    },
    "properties": {
        "$schema": {
            "format": "uri",
            "type": "string"
        },
        "const": true,
        "minLength": {
            "$ref": "#/definitions/nonNegativeIntegerDefault0"
        },
        "pattern": {
            "format": "regex",
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "title": {
            "type": "string"
        },
        "type": {
            "anyOf": [
                {
                    "$ref": "#/definitions/simpleTypes"
                },
                {
                    "minItems": 1,
                    "uniqueItems": true,
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/simpleTypes"
                    }
                }
            ]
        },
        "required": {
            "$ref": "#/definitions/stringArray"
        },
        "exclusiveMaximum": {
            "type": "number"
        },
        "patternProperties": {
            "default": {},
            "propertyNames": {
                "format": "regex"
            },
            "additionalProperties": {
                "$ref": "#"
            },
            "type": "object"
        },
        "allOf": {
            "$ref": "#/definitions/schemaArray"
        },
        "default": true,
        "oneOf": {
            "$ref": "#/definitions/schemaArray"
        },
        "not": {
            "$ref": "#"
        },
        "else": {
            "$ref": "#"
        },
        "additionalItems": {
            "$ref": "#"
        },
        "contentEncoding": {
            "type": "string"
        },
        "maxProperties": {
            "$ref": "#/definitions/nonNegativeInteger"
        },
        "exclusiveMinimum": {
            "type": "number"
        },
        "definitions": {
            "default": {},
            "additionalProperties": {
                "$ref": "#"
            },
            "type": "object"
        },
        "if": {
            "$ref": "#"
        },
        "multipleOf": {
            "type": "number",
            "exclusiveMinimum": 0
        },
        "maxItems": {
            "$ref": "#/definitions/nonNegativeInteger"
        },
        "contentMediaType": {
            "type": "string"
        },
        "format": {
            "type": "string"
        },
        "anyOf": {
            "$ref": "#/definitions/schemaArray"
        },
        "readOnly": {
            "default": false,
            "type": "boolean"
        },
        "$comment": {
            "type": "string"
        },
        "then": {
            "$ref": "#"
        },
        "enum": {
            "minItems": 1,
            "uniqueItems": true,
            "type": "array",
            "items": true
        },
        "minProperties": {
            "$ref": "#/definitions/nonNegativeIntegerDefault0"
        },
        "dependencies": {
            "additionalProperties": {
                "anyOf": [
                    {
                        "$ref": "#"
                    },
                    {
                        "$ref": "#/definitions/stringArray"
                    }
                ]
            },
            "type": "object"
        },
        "minItems": {
            "$ref": "#/definitions/nonNegativeIntegerDefault0"
        },
        "contains": {
            "$ref": "#"
        },
        "examples": {
            "type": "array",
            "items": true
        },
        "propertyNames": {
            "$ref": "#"
        },
        "uniqueItems": {
            "default": false,
            "type": "boolean"
        },
        "maximum": {
            "type": "number"
        },
        "additionalProperties": {
            "$ref": "#"
        },
        "$ref": {
            "format": "uri-reference",
            "type": "string"
        },
        "minimum": {
            "type": "number"
        },
        "items": {
            "default": true,
            "anyOf": [
                {
                    "$ref": "#"
                },
                {
                    "$ref": "#/definitions/schemaArray"
                }
            ]
        },
        "maxLength": {
            "$ref": "#/definitions/nonNegativeInteger"
        },
        "properties": {
            "default": {},
            "additionalProperties": {
                "$ref": "#"
            },
            "type": "object"
        },
        "$id": {
            "format": "uri-reference",
            "type": "string"
        }
    },
    "$id": "http://json-schema.org/draft-07/schema#"
};

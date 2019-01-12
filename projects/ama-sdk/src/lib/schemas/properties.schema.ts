/* tslint:disable */
export const propertiesSchema = {
    "$schema": "http://json-schema.org/schema",
    "id": "properties.schema.json",
    "title": "Properties schema",
    "description": "Properties schema",
    "type": "object",
    "additionalProperties" : {
        "type": "object",
        "additionalProperties" : false,
        "properties": {
            "id": {
                "type": "string"
            },
            "name": {
                "type": "string",
                "minLength": 1
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
            },
            "value": {
                "type": "string"
            }

        },
        "required": [
            "id",
            "name",
            "type"
        ]
    }
};

/* tslint:disable */
export const dataSchema = {
    "$schema": "http://json-schema.org/schema",
    "title": "Data schema",
    "type": "object",

    "properties": {
        "id": {
            "description": "The data's id",
            "type": "string"
        },
        "name": {
            "description": "The Data's name",
            "type": "string"
        },
        "description": {
            "description": "The Data's description",
            "type": "string"
        }

    },
    "required": [ "id", "name" ]
};

/* tslint:disable */
export const formSchema = {
    "$schema": "http://json-schema.org/schema",
    "title": "Form schema",
    "type": "object",

    "properties": {
        "formRepresentation": {
            "type": "object",
            "properties": {
                "id": {
                    "description": "The data's id",
                    "type": "string"
                },
                "name": {
                    "description": "The Data's name",
                    "type": "string"
                }
            },
            "required": [ "id", "name" ]
        }
    },
    "required": [ "formRepresentation" ]
};

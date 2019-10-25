/* tslint:disable */
export const fileSchema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "description": "File definition json schema",
    "type": "object",
    "properties": {
        "name": {
            "minLength": 1,
            "description": "File name",
            "type": "string",
            "pattern": "^[a-z]([-a-z0-9]{0,24}[a-z0-9])?$"
        }
    },
    "required": [
        "name"
    ]
};

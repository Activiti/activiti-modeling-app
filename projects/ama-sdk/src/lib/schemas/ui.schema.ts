/* tslint:disable */
export const uiSchema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "description": "UI definition json schema",
    "type": "object",
    "properties": {
        "plugins": {
            "type": "array",
            "items": {
                "properties": {
                    "name": {
                        "description": "Name of the npm plugin",
                        "type": "string"
                    },
                    "version": {
                        "description": "Version npm plugin",
                        "type": "string"
                    },
                    "order": {
                        "description": "order of loading",
                        "type": "number"
                    }
                },
                "required": [
                    "name",
                    "version"
                ]
            }
        },
        "name": {
            "minLength": 1,
            "description": "UI name",
            "type": "string",
            "pattern": "^[a-zA-Z0-9_]{1,}$"
        },
        "description": {
            "description": "UI Description ",
            "type": "string"
        },
        "config": {
            "description": "Config to overwrite the app.config.json",
            "type": "object"
        },
        "adf-template": {
            "description": "Type of adf UI template",
            "type": "string",
            "enum": [
                "content",
                "process"
            ]
        }
    },
    "required": [
        "name",
        "adf-template"
    ]
};

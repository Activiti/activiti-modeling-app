/* tslint:disable */
export const decisionTableSchema = {
    "$schema": "http://json-schema.org/schema",
    "id": "decision-table.schema.json",
    "title": "Decision table schema",
    "description": "Decision table schema",
    "type": "object",

    "properties": {
        "id": {
            "description": "The Decision table's id",
            "type": "string"
        },
        "name": {
            "description": "The Decision table's name",
            "type": "string"
        },
        "description": {
            "description": "The Decision table's description",
            "type": "string"
        }

    },
    "required": [ "id", "name" ]
};

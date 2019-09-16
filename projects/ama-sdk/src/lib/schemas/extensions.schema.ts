/* tslint:disable */
export const extensionsSchema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "title": "Process extensions schema",
  "description": "Process extensions schema",
  "type": "object",
  "definitions": {
    "extensions": {
      "type": "object",
      "properties": {
        "properties": {
          "description": "The extensions properties",
          "type": "object",
          "additionalProperties": {
            "$ref": "#/definitions/properties"
          }
        },
        "mappings": {
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "propertyNames": {
              "type": "string",
              "enum": [
                "inputs",
                "outputs"
              ]
            },
            "additionalProperties": {
              "type": "object",
              "additionalProperties": {
                "type": "object",
                "$ref": "#/definitions/mappings"
              }
            }
          }
        },
        "constants": {
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "additionalProperties": {
              "type": "object",
              "$ref": "#/definitions/constants"
            }
          }
        }
      }
    },
    "properties": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "type": {
          "type": "string",
          "enum": [
            "date",
            "string",
            "integer",
            "boolean",
            "json",
            "file"
          ]
        },
        "required": {
          "type": "boolean"
        }
      },
      "allOf": [
        {
          "if": {
            "properties": {
              "type": {
                "const": "date"
              }
            }
          },
          "then": {
            "properties": {
              "value": {
                "type": "string",
                "pattern": "^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$"
              }
            }
          }
        },
        {
          "if": {
            "properties": {
              "type": {
                "const": "string"
              }
            }
          },
          "then": {
            "properties": {
              "value": {
                "type": "string"
              }
            }
          }
        },
        {
          "if": {
            "properties": {
              "type": {
                "const": "integer"
              }
            }
          },
          "then": {
            "properties": {
              "value": {
                "type": "integer"
              }
            }
          }
        },
        {
          "if": {
            "properties": {
              "type": {
                "const": "boolean"
              }
            }
          },
          "then": {
            "properties": {
              "value": {
                "type": "boolean"
              }
            }
          }
        },
        {
          "if": {
            "properties": {
              "type": {
                "const": "json"
              }
            }
          },
          "then": {
            "properties": {
              "value": {
                "type": "object"
              }
            }
          }
        },
        {
          "if": {
            "properties": {
              "type": {
                "const": "file"
              }
            }
          },
          "then": {
            "properties": {
              "value": {
                "type": "object"
              }
            }
          }
        }
      ],
      "required": [
        "id",
        "name",
        "type",
        "required"
      ]
    },
    "mappings": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "variable",
            "value"
          ]
        },
        "value": {
          "type": "string"
        }
      },
      "dependencies": {
        "type": [
          "value"
        ],
        "value": [
          "type"
        ]
      }
    },
    "constants": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string"
        }
      }
    }
  },
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "extensions": {
      "$ref": "#/definitions/extensions"
    }
  },
  "required": [
    "id"
  ]
}

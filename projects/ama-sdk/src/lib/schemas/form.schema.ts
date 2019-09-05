/* tslint:disable */
/* cSpell:disable */

export const formSchema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "description": "Form definition json schema",
    "type": "object",
    "properties": {
        "formRepresentation": {
            "$ref": "#/definitions/formRepresentationObject"
        }
    },
    "required": [
        "formRepresentation"
    ],
    "definitions": {
        "containerFieldsObject": {
            "title": "Containers and Group",
            "type": "object",
            "properties": {
                "type": {
                    "description": "At this level the form type can be a Container or Group which are the elements that contains the form elements",
                    "type": "string",
                    "enum": [
                        "container",
                        "group"
                    ]
                },
                "id": {
                    "description": "Field Container Id",
                    "type": "string"
                },
                "name": {
                    "description": "Field Container Name",
                    "type": "string"
                },
                "tab": {
                    "description": "Name of the tab where it belongs, if any is defined",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "numberOfColumns": {
                    "description": "Number of columns inside the container",
                    "type": "number"
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "fields": {
                    "anyOf": [
                        {
                            "patternProperties": {
                                "^[0-9]+$": {
                                    "type": "array",
                                    "items": {
                                        "if": {
                                            "properties": {
                                                "type": {
                                                    "enum": [
                                                        "datetime",
                                                        "select-folder",
                                                        "document",
                                                        "group",
                                                        "people",
                                                        "functional-group"
                                                    ]
                                                }
                                            }
                                        },
                                        "then": {
                                            "$ref": "#/definitions/formFieldsObject"
                                        },
                                        "else": {
                                            "if": {
                                                "properties": {
                                                    "type": {
                                                        "enum": [
                                                            "typeahead"
                                                        ]
                                                    }
                                                }
                                            },
                                            "then": {
                                                "$ref": "#/definitions/formFieldsTypeHeaddRepresentationObject"
                                            },
                                            "else": {
                                                "if": {
                                                    "properties": {
                                                        "type": {
                                                            "enum": [
                                                                "upload"
                                                            ]
                                                        }
                                                    }
                                                },
                                                "then": {
                                                    "$ref": "#/definitions/formFieldsAttachFileFieldRepresentationObject"
                                                },
                                                "else": {
                                                    "if": {
                                                        "properties": {
                                                            "type": {
                                                                "enum": [
                                                                    "amount"
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    "then": {
                                                        "$ref": "#/definitions/formFieldsAmountFieldRepresentationObject"
                                                    },
                                                    "else": {
                                                        "if": {
                                                            "properties": {
                                                                "type": {
                                                                    "enum": [
                                                                        "hyperlink"
                                                                    ]
                                                                }
                                                            }
                                                        },
                                                        "then": {
                                                            "$ref": "#/definitions/formFieldsHyperlinkRepresentationObject"
                                                        },
                                                        "else": {
                                                            "if": {
                                                                "properties": {
                                                                    "type": {
                                                                        "enum": [
                                                                            "readonly-text",
                                                                            "readonly"
                                                                        ]
                                                                    }
                                                                }
                                                            },
                                                            "then": {
                                                                "$ref": "#/definitions/formFieldsReadOnlyTestRepresentationObject"
                                                            },
                                                            "else": {
                                                                "if": {
                                                                    "properties": {
                                                                        "type": {
                                                                            "enum": [
                                                                                "text",
                                                                                "multi-line-text"
                                                                            ]
                                                                        }
                                                                    }
                                                                },
                                                                "then": {
                                                                    "$ref": "#/definitions/formFieldsTextObject"
                                                                },
                                                                "else": {
                                                                    "if": {
                                                                        "properties": {
                                                                            "type": {
                                                                                "enum": [
                                                                                    "integer"
                                                                                ]
                                                                            }
                                                                        }
                                                                    },
                                                                    "then": {
                                                                        "$ref": "#/definitions/formFieldsIntegerObject"
                                                                    },
                                                                    "else": {
                                                                        "if": {
                                                                            "properties": {
                                                                                "type": {
                                                                                    "enum": [
                                                                                        "boolean"
                                                                                    ]
                                                                                }
                                                                            }
                                                                        },
                                                                        "then": {
                                                                            "$ref": "#/definitions/formFieldsBooleanObject"
                                                                        },
                                                                        "else": {
                                                                            "if": {
                                                                                "properties": {
                                                                                    "type": {
                                                                                        "enum": [
                                                                                            "date"
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            },
                                                                            "then": {
                                                                                "$ref": "#/definitions/formFieldsDateObject"
                                                                            },
                                                                            "else": {
                                                                                "if": {
                                                                                    "properties": {
                                                                                        "type": {
                                                                                            "enum": [
                                                                                                "dropdown"
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                },
                                                                                "then": {
                                                                                    "$ref": "#/definitions/formFieldsDropDownRepresentationObject"
                                                                                },
                                                                                "else": {
                                                                                    "if": {
                                                                                        "properties": {
                                                                                            "type": {
                                                                                                "enum": [
                                                                                                    "radio-buttons"
                                                                                                ]
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    "then": {
                                                                                        "$ref": "#/definitions/formFieldsRadioButtonsObject"
                                                                                    },
                                                                                    "else": {
                                                                                        "type": "null"
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                "visibilityCondition": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/visibilityConditionObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                }
            },
            "required": [
                "id",
                "type",
                "name",
                "numberOfColumns",
                "fields"
            ],
            "additionalProperties": false
        },
        "containerDynamicTableObject": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "Field type",
                    "type": "string",
                    "enum": [
                        "dynamic-table"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "columnDefinitions": {
                    "$ref": "#/definitions/columnDefinitionsObject"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required",
                "columnDefinitions"
            ]
        },
        "formFieldsObject": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "datetime",
                        "select-folder",
                        "document",
                        "group",
                        "people",
                        "functional-group"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                },
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": "number"
                },
                "visibilityCondition": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/visibilityConditionObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "metaDataColumnDefinitions": {
                    "description": "Meta data column definitions !!!NEEDS REVIEW!!!",
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/metaDataColumnDefinitionsObject"
                    }
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ]
        },
        "formFieldsDateObject": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "date"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                },
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": [
                        "number",
                        "null"
                    ]
                },
                "placeholder": {
                    "description": "placeholder",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "visibilityCondition": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/visibilityConditionObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "minValue": {
                    "description": "minValue",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "maxValue": {
                    "description": "maxValue",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "dateDisplayFormat": {
                    "description": "dateDisplayFormat",
                    "type": [
                        "string",
                        "null"
                    ]
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ],
            "additionalProperties": false
        },
        "formFieldsBooleanObject": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "boolean"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                },
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": [
                        "number",
                        "null"
                    ]
                },
                "visibilityCondition": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/visibilityConditionObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ],
            "additionalProperties": false
        },
        "formFieldsTextObject": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "text",
                        "multi-line-text"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                },
                "placeholder": {
                    "description": "placeholder",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "regexPattern": {
                    "description": "Regular expr.",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": [
                        "number",
                        "null"
                    ]
                },
                "minLength": {
                    "description": "minLength ",
                    "type": [
                        "number",
                        "null"
                    ]
                },
                "maxLength": {
                    "description": "maxLength",
                    "type": "number"
                },
                "visibilityCondition": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/visibilityConditionObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ],
            "additionalProperties": false
        },
        "formFieldsIntegerObject": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "integer"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                },
                "placeholder": {
                    "description": "placeholder",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": "number"
                },
                "minValue": {
                    "description": "minValue ",
                    "type": [
                        "number",
                        "null"
                    ]
                },
                "maxValue": {
                    "description": "maxValue",
                    "type": [
                        "number",
                        "null"
                    ]
                },
                "visibilityCondition": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/visibilityConditionObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ],
            "additionalProperties": false
        },
        "formFieldsTypeHeaddRepresentationObject": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "Field type",
                    "type": "string",
                    "enum": [
                        "radio-buttons",
                        "typeahead"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                },
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": "number"
                },
                "options": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/optionsObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "hasEmptyValue": {
                    "description": "Indicates if options can be also empty",
                    "anyOf": [
                        {
                            "type": "boolean"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ]
        },
        "formFieldsRadioButtonsObject": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "Field type",
                    "type": "string",
                    "enum": [
                        "radio-buttons"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                },
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": "number"
                },
                "options": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/optionsObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "value": {
                    "description": "name preselected option",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "visibilityCondition": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/visibilityConditionObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "optionType": {
                    "description": "optionType rest or options",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "restUrl": {
                    "description": "restUrl",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "restResponsePath": {
                    "description": "restResponsePath",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "restIdProperty": {
                    "description": "restIdProperty",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "restLabelProperty": {
                    "description": "restLabelProperty",
                    "type": [
                        "string",
                        "null"
                    ]
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ],
            "additionalProperties": false
        },
        "formFieldsDropDownRepresentationObject": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "Field type",
                    "type": "string",
                    "enum": [
                        "dropdown"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                },
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": "number"
                },
                "options": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/optionsObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "visibilityCondition": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/visibilityConditionObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "optionType": {
                    "description": "optionType rest or options",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "restUrl": {
                    "description": "restUrl",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "value": {
                    "description": "name preselected option",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "restResponsePath": {
                    "description": "restResponsePath",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "restIdProperty": {
                    "description": "restIdProperty",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "restLabelProperty": {
                    "description": "restLabelProperty",
                    "type": [
                        "string",
                        "null"
                    ]
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ],
            "additionalProperties": false
        },
        "formFieldsAttachFileFieldRepresentationObject": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "upload"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                },
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": "number"
                },
                "visibilityCondition": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/visibilityConditionObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ],
            "additionalProperties": false
        },
        "formFieldsAmountFieldRepresentationObject": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "amount"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                },
                "minValue": {
                    "description": "minValue ",
                    "type": [
                        "number",
                        "null"
                    ]
                },
                "maxValue": {
                    "description": "maxValue",
                    "type": [
                        "number",
                        "null"
                    ]
                },
                "placeholder": {
                    "description": "placeholder",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "enableFractions": {
                    "description": "enableFractions",
                    "type": [
                        "boolean",
                        "null"
                    ]
                },
                "currency": {
                    "description": "currency",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": "number"
                },
                "visibilityCondition": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/visibilityConditionObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ],
            "additionalProperties": false
        },
        "formFieldsHyperlinkRepresentationObject": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "hyperlink"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": "number"
                },
                "hyperlinkUrl": {
                    "description": "Url hyperlink",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "displayText": {
                    "description": "Text",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "visibilityCondition": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/visibilityConditionObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "hyperlinkUrl"
            ],
            "additionalProperties": false
        },
        "formFieldsReadOnlyTestRepresentationObject": {
            "type": "object",
            "properties": {
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "readonly-text",
                        "readonly"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "value": {
                    "description": "text to display",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": "number"
                },
                "visibilityCondition": {
                    "description": "Tab visibility condition",
                    "anyOf": [
                        {
                            "$ref": "#/definitions/visibilityConditionObject"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                }
            },
            "required": [
                "type",
                "id",
                "name"
            ],
            "additionalProperties": false
        },
        "visibilityConditionObject": {
            "description": "Field visibility condition ca be based on others fields or variables",
            "type": "object",
            "properties": {
                "leftValue": {
                    "description": "The left value: the id of the field or the name of the process variable to compare",
                    "type": "string"
                },
                "leftType": {
                    "description": "The type of left value",
                    "type": "string",
                    "enum": [
                        "field",
                        "variable"
                    ]
                },
                "operator": {
                    "description": "The operation to be applied between left value and right value",
                    "type": "string",
                    "enum": [
                        "==",
                        "!=",
                        "<",
                        ">",
                        "<=",
                        ">=",
                        "empty",
                        "!empty"
                    ]
                },
                "rightValue": {
                    "description": "The right value: the bare value or the id of the field or the name of the process variable to compare",
                    "anyOf": [
                        {
                            "type": "null"
                        },
                        {
                            "type": "string"
                        },
                        {
                            "type": "number"
                        }
                    ]
                },
                "rightType": {
                    "description": "The type of right value",
                    "anyOf": [
                        {
                            "type": "null"
                        },
                        {
                            "type": "string",
                            "enum": [
                                "value",
                                "field",
                                "variable"
                            ]
                        }
                    ]
                },
                "nextConditionOperator": {
                    "description": "Operator for the next condition",
                    "type": "string",
                    "enum": [
                        "and-not",
                        "and",
                        "or",
                        "or-not",
                        "",
                        null
                    ]
                },
                "nextCondition": {
                    "description": "nextConditionm, would make more sense if visibilityCondition was an array this innested is impossible to check !!!NEEDS REVIEW!!!",
                    "anyOf": [
                        {
                            "type": "null"
                        },
                        {
                            "type": "object"
                        }
                    ]
                }
            }
        },
        "paramsObject": {
            "description": "Field visibility condition ca be based on others fields or variables",
            "type": "object",
            "properties": {
                "inputMask": {
                    "description": "input mask value",
                    "type": "string"
                },
                "inputMaskReversed": {
                    "description": "if the mask is reversed",
                    "type": "boolean"
                },
                "inputMaskPlaceholder": {
                    "items": {
                        "$ref": "#/definitions/inputMaskPlaceholderObject"
                    }
                },
                "fileSource": {
                    "items": {
                        "$ref": "#/definitions/fileSourceObject"
                    }
                }
            }
        },
        "formDefinitionObject": {
            "description": "Form Definition",
            "type": "object",
            "properties": {
                "fields": {
                    "description": "Form Definition",
                    "type": "array",
                    "items": {
                        "if": {
                            "properties": {
                                "type": {
                                    "enum": [
                                        "container",
                                        "group"
                                    ]
                                }
                            }
                        },
                        "then": {
                            "$ref": "#/definitions/containerFieldsObject"
                        },
                        "else": {
                            "$ref": "#/definitions/containerDynamicTableObject"
                        }
                    }
                },
                "outcomes": {
                    "description": "Possible Outcome of the Form (optional)",
                    "type": "array"
                },
                "variables": {
                    "description": "Possible Variable of the Form (optional)",
                    "$ref": "#/definitions/variablesObject"
                },
                "metadata": {
                    "description": "Property in the form {name1:value1, name2:value2}",
                    "type": "object"
                },
                "tabs": {
                    "description": "Tabs defined in the form",
                    "$ref": "#/definitions/tabsObject"
                }
            },
            "required": [
                "fields"
            ],
            "additionalProperties": false
        },
        "formRepresentationObject": {
            "description": "Form Representation",
            "type": "object",
            "properties": {
                "id": {
                    "description": "Form Id",
                    "type": "string"
                },
                "name": {
                    "description": "Form Name",
                    "type": "string"
                },
                "description": {
                    "description": "Form Description",
                    "type": "string"
                },
                "version": {
                    "description": "Form Version",
                    "type": "number"
                },
                "standAlone": {
                    "description": "Enable form on standalone tasks",
                    "type": "boolean"
                },
                "formDefinition": {
                    "$ref": "#/definitions/formDefinitionObject"
                }
            },
            "required": [
                "id",
                "name",
                "version",
                "formDefinition"
            ],
            "additionalProperties": false
        },
        "fileSourceObject": {
            "type": "object",
            "properties": {
                "serviceId": {
                    "description": "file source id",
                    "type": "string"
                },
                "name": {
                    "description": "file source name",
                    "type": "string"
                }
            }
        },
        "inputMaskPlaceholderObject": {
            "type": "object",
            "properties": {
                "description": {
                    "description": "description input mask placeholder",
                    "type": "string"
                },
                "type": {
                    "description": "type mask placeholder",
                    "type": "string"
                }
            }
        },
        "dropDownOptionsObject": {
            "title": "Each element in the drop down",
            "type": "object",
            "properties": {
                "name": {
                    "description": "option label",
                    "type": "string"
                },
                "id": {
                    "description": "option id",
                    "type": "string"
                }
            }
        },
        "metaDataColumnDefinitionsObject": {
            "type": "object",
            "properties": {
                "fileProperty": {
                    "description": "File property",
                    "type": "string"
                },
                "propertyType": {
                    "description": "property type",
                    "type": "string"
                },
                "formField": {
                    "$ref": "#/definitions/formFieldsObject"
                }
            }
        },
        "optionsObject": {
            "type": "array",
            "items": {
                "properties": {
                    "id": {
                        "description": "Id option",
                        "type": "string"
                    },
                    "name": {
                        "description": "Name option",
                        "type": "string"
                    }
                },
                "required": [
                    "id",
                    "name"
                ]
            }
        },
        "columnDefinitionsObject": {
            "type": "array",
            "items": {
                "properties": {
                    "id": {
                        "description": "Id option",
                        "type": "string"
                    },
                    "name": {
                        "description": "Name option",
                        "type": "string"
                    },
                    "type": {
                        "description": "Column type",
                        "type": "string"
                    },
                    "required": {
                        "description": "Indicates if is a Required field",
                        "type": "boolean"
                    },
                    "editable": {
                        "description": "Indicates if is a editable field",
                        "type": "boolean"
                    },
                    "sortable": {
                        "description": "Indicates if is sortable column",
                        "type": "boolean"
                    },
                    "visible": {
                        "description": "Indicates if is a visible field",
                        "type": "boolean"
                    }
                },
                "required": [
                    "id",
                    "name",
                    "type",
                    "required",
                    "editable",
                    "sortable",
                    "visible"
                ]
            }
        },
        "variablesObject": {
            "type": "array",
            "items": {
                "properties": {
                    "id": {
                        "description": "Id",
                        "type": "string"
                    },
                    "name": {
                        "description": "Variable name",
                        "type": "string"
                    },
                    "type": {
                        "description": "Column type",
                        "type": "string",
                        "enum": [
                            "string",
                            "integer",
                            "boolean",
                            "date",
                            "people",
                            "group",
                            "file",
                            "json"
                        ]
                    },
                    "value": {
                        "description": "Variable value"
                    }
                },
                "required": [
                    "name",
                    "type"
                ],
                "additionalProperties": false
            }
        },
        "tabsObject": {
            "type": "array",
            "items": {
                "properties": {
                    "id": {
                        "description": "Tab id",
                        "type": "string"
                    },
                    "title": {
                        "description": "Tab displayed name",
                        "type": "string"
                    },
                    "visibilityCondition": {
                        "description": "Tab visibility condition",
                        "anyOf": [
                            {
                                "$ref": "#/definitions/visibilityConditionObject"
                            },
                            {
                                "type": "null"
                            }
                        ]
                    }
                },
                "required": [
                    "id",
                    "title"
                ]
            }
        }
    }
};

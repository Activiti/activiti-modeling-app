/* tslint:disable */
export const formSchema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "description": "Form definition json schema",
    "type": "object",
    "definitions": {
        "formFieldsBooleanObject": {
            "additionalProperties": false,
            "type": "object",
            "properties": {
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
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "boolean"
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ]
        },
        "formFieldsTextObject": {
            "additionalProperties": false,
            "type": "object",
            "properties": {
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
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "regexPattern": {
                    "description": "Regular expr.",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "placeholder": {
                    "description": "placeholder",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "text",
                        "multi-line-text"
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                },
                "maxLength": {
                    "description": "maxLength",
                    "type": "number"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ]
        },
        "containerFieldsObject": {
            "additionalProperties": false,
            "title": "Containers and Group",
            "type": "object",
            "properties": {
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
                "name": {
                    "description": "Field Container Name",
                    "type": "string"
                },
                "id": {
                    "description": "Field Container Id",
                    "type": "string"
                },
                "type": {
                    "description": "At this level the form type can be a Container or Group which are the elements that contains the form elements",
                    "type": "string",
                    "enum": [
                        "container",
                        "group"
                    ]
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
                                        "else": {
                                            "else": {
                                                "else": {
                                                    "else": {
                                                        "else": {
                                                            "else": {
                                                                "else": {
                                                                    "else": {
                                                                        "else": {
                                                                            "else": {
                                                                                "else": {
                                                                                    "else": {
                                                                                        "type": "null"
                                                                                    },
                                                                                    "then": {
                                                                                        "$ref": "#/definitions/formFieldsRadioButtonsObject"
                                                                                    },
                                                                                    "if": {
                                                                                        "properties": {
                                                                                            "type": {
                                                                                                "enum": [
                                                                                                    "radio-buttons"
                                                                                                ]
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                },
                                                                                "then": {
                                                                                    "$ref": "#/definitions/formFieldsDropDownRepresentationObject"
                                                                                },
                                                                                "if": {
                                                                                    "properties": {
                                                                                        "type": {
                                                                                            "enum": [
                                                                                                "dropdown"
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            "then": {
                                                                                "$ref": "#/definitions/formFieldsDateObject"
                                                                            },
                                                                            "if": {
                                                                                "properties": {
                                                                                    "type": {
                                                                                        "enum": [
                                                                                            "date"
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            }
                                                                        },
                                                                        "then": {
                                                                            "$ref": "#/definitions/formFieldsBooleanObject"
                                                                        },
                                                                        "if": {
                                                                            "properties": {
                                                                                "type": {
                                                                                    "enum": [
                                                                                        "boolean"
                                                                                    ]
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    "then": {
                                                                        "$ref": "#/definitions/formFieldsIntegerObject"
                                                                    },
                                                                    "if": {
                                                                        "properties": {
                                                                            "type": {
                                                                                "enum": [
                                                                                    "integer"
                                                                                ]
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                "then": {
                                                                    "$ref": "#/definitions/formFieldsTextObject"
                                                                },
                                                                "if": {
                                                                    "properties": {
                                                                        "type": {
                                                                            "enum": [
                                                                                "text",
                                                                                "multi-line-text"
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            "then": {
                                                                "$ref": "#/definitions/formFieldsReadOnlyTestRepresentationObject"
                                                            },
                                                            "if": {
                                                                "properties": {
                                                                    "type": {
                                                                        "enum": [
                                                                            "readonly-text",
                                                                            "readonly"
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        "then": {
                                                            "$ref": "#/definitions/formFieldsHyperlinkRepresentationObject"
                                                        },
                                                        "if": {
                                                            "properties": {
                                                                "type": {
                                                                    "enum": [
                                                                        "hyperlink"
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    },
                                                    "then": {
                                                        "$ref": "#/definitions/formFieldsAmountFieldRepresentationObject"
                                                    },
                                                    "if": {
                                                        "properties": {
                                                            "type": {
                                                                "enum": [
                                                                    "amount"
                                                                ]
                                                            }
                                                        }
                                                    }
                                                },
                                                "then": {
                                                    "$ref": "#/definitions/formFieldsAttachFileFieldRepresentationObject"
                                                },
                                                "if": {
                                                    "properties": {
                                                        "type": {
                                                            "enum": [
                                                                "upload"
                                                            ]
                                                        }
                                                    }
                                                }
                                            },
                                            "then": {
                                                "$ref": "#/definitions/formFieldsTypeHeaddRepresentationObject"
                                            },
                                            "if": {
                                                "properties": {
                                                    "type": {
                                                        "enum": [
                                                            "typeahead"
                                                        ]
                                                    }
                                                }
                                            }
                                        },
                                        "then": {
                                            "$ref": "#/definitions/formFieldsObject"
                                        },
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
                                        }
                                    }
                                }
                            }
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
            ]
        },
        "formFieldsRadioButtonsObject": {
            "additionalProperties": false,
            "type": "object",
            "properties": {
                "restResponsePath": {
                    "description": "restResponsePath",
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
                "type": {
                    "description": "Field type",
                    "type": "string",
                    "enum": [
                        "radio-buttons"
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                },
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": "number"
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
                "restLabelProperty": {
                    "description": "restLabelProperty",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
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
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "restIdProperty": {
                    "description": "restIdProperty",
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
            ]
        },
        "paramsObject": {
            "description": "Field visibility condition ca be based on others fields or variables",
            "type": "object",
            "properties": {
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
                },
                "inputMask": {
                    "description": "input mask value",
                    "type": "string"
                }
            }
        },
        "formFieldsReadOnlyTestRepresentationObject": {
            "additionalProperties": false,
            "type": "object",
            "properties": {
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
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "readonly-text",
                        "readonly"
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "value": {
                    "description": "text to display",
                    "type": [
                        "string",
                        "null"
                    ]
                }
            },
            "required": [
                "type",
                "id",
                "name"
            ]
        },
        "formDefinitionObject": {
            "description": "Form Definition",
            "additionalProperties": false,
            "type": "object",
            "properties": {
                "variables": {
                    "description": "Possible Variable of the Form (optional)",
                    "$ref": "#/definitions/variablesObject"
                },
                "metadata": {
                    "description": "Property in the form {name1:value1, name2:value2}",
                    "type": "object"
                },
                "outcomes": {
                    "description": "Possible Outcome of the Form (optional)",
                    "type": "array"
                },
                "tabs": {
                    "description": "Tabs defined in the form",
                    "$ref": "#/definitions/tabsObject"
                },
                "fields": {
                    "description": "Form Definition",
                    "type": "array",
                    "items": {
                        "else": {
                            "$ref": "#/definitions/containerDynamicTableObject"
                        },
                        "then": {
                            "$ref": "#/definitions/containerFieldsObject"
                        },
                        "if": {
                            "properties": {
                                "type": {
                                    "enum": [
                                        "container",
                                        "group"
                                    ]
                                }
                            }
                        }
                    }
                },
                "standAlone": {
                    "description": "Shows/hides form in standAlone task",
                    "type": "boolean"
                }
            },
            "required": [
                "fields"
            ]
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
        "formFieldsAmountFieldRepresentationObject": {
            "additionalProperties": false,
            "type": "object",
            "properties": {
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
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "currency": {
                    "description": "currency",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
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
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "amount"
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ]
        },
        "formFieldsTypeHeaddRepresentationObject": {
            "type": "object",
            "properties": {
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": "number"
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
                "name": {
                    "description": "Field name",
                    "type": "string"
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
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "type": {
                    "description": "Field type",
                    "type": "string",
                    "enum": [
                        "radio-buttons",
                        "typeahead"
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ]
        },
        "formRepresentationObject": {
            "description": "Form Representation",
            "additionalProperties": false,
            "type": "object",
            "properties": {
                "formDefinition": {
                    "$ref": "#/definitions/formDefinitionObject"
                },
                "name": {
                    "description": "Form Name",
                    "type": "string"
                },
                "description": {
                    "description": "Form Description",
                    "type": "string"
                },
                "id": {
                    "description": "Form Id",
                    "type": "string"
                },
                "version": {
                    "description": "Form Version",
                    "type": "number"
                }
            },
            "required": [
                "id",
                "name",
                "version",
                "formDefinition"
            ]
        },
        "tabsObject": {
            "type": "array",
            "items": {
                "properties": {
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
                    "id": {
                        "description": "Tab id",
                        "type": "string"
                    },
                    "title": {
                        "description": "Tab displayed name",
                        "type": "string"
                    }
                },
                "required": [
                    "id",
                    "title"
                ]
            }
        },
        "formFieldsDateObject": {
            "additionalProperties": false,
            "type": "object",
            "properties": {
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": [
                        "number",
                        "null"
                    ]
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
                "dateDisplayFormat": {
                    "description": "dateDisplayFormat",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "placeholder": {
                    "description": "placeholder",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "date"
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ]
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
        "containerDynamicTableObject": {
            "type": "object",
            "properties": {
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "columnDefinitions": {
                    "$ref": "#/definitions/columnDefinitionsObject"
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "type": {
                    "description": "Field type",
                    "type": "string",
                    "enum": [
                        "dynamic-table"
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
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
        "formFieldsDropDownRepresentationObject": {
            "additionalProperties": false,
            "type": "object",
            "properties": {
                "restResponsePath": {
                    "description": "restResponsePath",
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
                "type": {
                    "description": "Field type",
                    "type": "string",
                    "enum": [
                        "dropdown"
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                },
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": "number"
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
                "restLabelProperty": {
                    "description": "restLabelProperty",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "name": {
                    "description": "Field name",
                    "type": "string"
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
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "restIdProperty": {
                    "description": "restIdProperty",
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
            ]
        },
        "fileSourceObject": {
            "type": "object",
            "properties": {
                "name": {
                    "description": "file source name",
                    "type": "string"
                },
                "serviceId": {
                    "description": "file source id",
                    "type": "string"
                }
            }
        },
        "formFieldsIntegerObject": {
            "additionalProperties": false,
            "type": "object",
            "properties": {
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
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "placeholder": {
                    "description": "placeholder",
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "integer"
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ]
        },
        "metaDataColumnDefinitionsObject": {
            "type": "object",
            "properties": {
                "propertyType": {
                    "description": "property type",
                    "type": "string"
                },
                "fileProperty": {
                    "description": "File property",
                    "type": "string"
                },
                "formField": {
                    "$ref": "#/definitions/formFieldsObject"
                }
            }
        },
        "formFieldsObject": {
            "type": "object",
            "properties": {
                "colspan": {
                    "description": "It reflect the HTML colspan property to expand on more columns ",
                    "type": "number"
                },
                "metaDataColumnDefinitions": {
                    "description": "Meta data column definitions !!!NEEDS REVIEW!!!",
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/metaDataColumnDefinitionsObject"
                    }
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
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
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
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ]
        },
        "formFieldsHyperlinkRepresentationObject": {
            "additionalProperties": false,
            "type": "object",
            "properties": {
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
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "hyperlink"
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
            ]
        },
        "visibilityConditionObject": {
            "description": "Field visibility condition ca be based on others fields or variables",
            "type": "object",
            "properties": {
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
                },
                "rightFormFieldId": {
                    "description": "right Form Field condition Id",
                    "anyOf": [
                        {
                            "type": "null"
                        },
                        {
                            "type": "string"
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
                "rightValue": {
                    "description": "right value",
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
                "rightRestResponseId": {
                    "description": "Name of the tab where it belongs, if any is defined",
                    "anyOf": [
                        {
                            "type": "null"
                        },
                        {
                            "type": "string"
                        }
                    ]
                },
                "leftFormFieldId": {
                    "description": "left Form Field condition Id",
                    "anyOf": [
                        {
                            "type": "null"
                        },
                        {
                            "type": "string"
                        }
                    ]
                },
                "leftRestResponseId": {
                    "description": "Name of the tab where it belongs, if any is defined",
                    "anyOf": [
                        {
                            "type": "null"
                        },
                        {
                            "type": "string"
                        }
                    ]
                },
                "operator": {
                    "description": "math operations",
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
                "rightType": {
                    "description": "right type",
                    "anyOf": [
                        {
                            "type": "null"
                        },
                        {
                            "type": "string"
                        }
                    ]
                }
            }
        },
        "optionsObject": {
            "type": "array",
            "items": {
                "properties": {
                    "name": {
                        "description": "Name option",
                        "type": "string"
                    },
                    "id": {
                        "description": "Id option",
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
                    "visible": {
                        "description": "Indicates if is a visible field",
                        "type": "boolean"
                    },
                    "editable": {
                        "description": "Indicates if is a editable field",
                        "type": "boolean"
                    },
                    "name": {
                        "description": "Name option",
                        "type": "string"
                    },
                    "id": {
                        "description": "Id option",
                        "type": "string"
                    },
                    "sortable": {
                        "description": "Indicates if is sortable column",
                        "type": "boolean"
                    },
                    "type": {
                        "description": "Column type",
                        "type": "string"
                    },
                    "required": {
                        "description": "Indicates if is a Required field",
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
                "additionalProperties": false,
                "properties": {
                    "name": {
                        "description": "Variable name",
                        "type": "string"
                    },
                    "id": {
                        "description": "Id",
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
                            "group"
                        ]
                    },
                    "value": {
                        "description": "Variable value"
                    }
                },
                "required": [
                    "name",
                    "type"
                ]
            }
        },
        "formFieldsAttachFileFieldRepresentationObject": {
            "additionalProperties": false,
            "type": "object",
            "properties": {
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
                "name": {
                    "description": "Field name",
                    "type": "string"
                },
                "id": {
                    "description": "Field Id",
                    "type": "string"
                },
                "type": {
                    "description": "Field Type",
                    "type": "string",
                    "enum": [
                        "upload"
                    ]
                },
                "params": {
                    "$ref": "#/definitions/paramsObject"
                },
                "required": {
                    "description": "Indicates if the field is required in the validation",
                    "type": "boolean"
                }
            },
            "required": [
                "type",
                "id",
                "name",
                "required"
            ]
        }
    },
    "properties": {
        "formRepresentation": {
            "$ref": "#/definitions/formRepresentationObject"
        }
    },
    "required": [
        "formRepresentation"
    ]
};

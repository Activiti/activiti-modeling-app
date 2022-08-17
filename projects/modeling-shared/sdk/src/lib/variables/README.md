# VariablesModule

This module holds all the logic related to variables used in different models (processes, connectors,...). Basically:

* [JSON Schema editor](./json-schema/doc/README.md): Provides support for defining variable types using a JSON Schema. It also provides a component to create a JSON schema that defines, for example, the variable type. This component can use a customization service in order to restrict options, change labels,... This is useful when we want to present the user an editor but we want to restrict the JSON schemas that can be produced.
* [Expression editor](./expression-code-editor/doc/README.md): Provides an expression editor that receives a set of variables and then, it can provide autocompletion hints when creating an expression as it knows the JSON schema associated to each variable. The expression editor can receive the expression syntax also for the autocompletion to work properly.
* [Variables definition](./properties-viewer/doc/README.md): Provides a component that can be reused in different models to define their variables (variable name, type, default value,...).
* [Inputs](./properties-viewer/value-type-inputs/doc/README.md): Provide appropriate user inputs for the different variable types (string, integer, date, array, complex objects,...). The inputs can receive the JSON schema associated to the type so it can display the corresponding inputs.

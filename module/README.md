A typescript library for reading, manipulating, and writing OpenAPI documents.

Install with `npm install oai-ts-core`.

## Overview

You can use this library to read an OpenAPI document, resulting in an instance
of a data model.  The data model can then be read or manipulated.  It can also
be validated.

The data model can be accessed directly, but there is also a robust visitor
pattern available for more advanced analysis or transformation of the model.

The next section (Quickstart) explains, in a nutshell, how to use the library
for standard/basic tasks.  The API section below contains more information,
necessary to fully leverage the capabilities of the library.

## Quickstart

The easiest way to get started is to use the library utility:

_Typescript:_

```Typescript
// Get the OpenAPI document from somewhere (can be a string or js object).
let openApiData: any = ...;
// Create an instance of the library utils class.
let library: OasLibraryUtils = new OasLibraryUtils();

// Use the library utils to create a data model instance from the given
// data.  This will convert from the source (string or js object) into
// an instance of the OpenAPI data model.
let document: Oas30Document = <Oas30Document> library.createDocument(openApiData);

// Here you can anayze or manipulate the model.
document.info.version = "1.7";
document.info.description = "Made some changes to the OpenAPI document!";

// Validate that your changes are OK.
let errors: OasValidationError[] = library.validate(document);

// And now write the node back out as a JSON string
let modifiedOpenApiData: string = JSON.stringify(library.writeNode(document));
```

_Browser (UMD):_

```JavaScript
var openApiData = ...; // Get your OpenAPI data somehow (can be string or JS object)
var library = new OAI.OasLibraryUtils();

var document = library.createDocument(openApiData);

document.info.version = "1.1";
document.info.description = "Made some changes to the OpenAPI document!";

var errors = library.validate(document);

var modifiedOpenApiData = JSON.stringify(library.writeNode(document));
```

## API

### Library Utils
The library comes with a util class that makes certain common tasks easier.
These tasks include:

* Creating a document (data model)
* Validating a model
* Write a model back to a JS object

#### Create Document
`OasLibraryUtils::createDocument(any): OasDocument`

Use this method to create an OpenAPI document (data model).  You can pass either
a string or a JS object into this method.  When passing a string, it can be 
either JSON formatted data representing an OpenAPI document *or* it can be a
valid OpenAPI version number such as "3.0.0".  In the latter case, a new empty
document of the appropriate version will be created and returned.  In all other
cases the source data will be parsed into a data model instance.

#### Write Node
`OasLibraryUtils::writeNode(OasNode): any`

Use this method to convert from a data model instance back to a JS object.  You
can pass any node from the data model tree into this method and the appropriate
JS object will be returned.  If you pass in the root document node, then the 
full OpenAPI JS object will be returned.  If, for example, you pass in only the
`document.info` child node, then a JS object representing on that portion of the
data model will be returned.

#### Validate
`OasLibraryUtils::validate(OasNode, boolean): OasValidationError[]`

Use this method to validate a document (or subsection of the document).  The
library includes all validation rules defined by the OpenAPI specification.
You can use this method to apply the appropriate rules to any section of the
data model.  The return result is an array of validation errors, or an empty
array if the document is fully valid.

Note that in addition to returning an array of errors, the errors will also
be stored on the model itself.  Any node that violates a validation rule
will have the error object added to an array of errors stored as a "node
attribute" with a key of "validation-errors".  You can check if an individual
node has any validation errors:

```Typescript
let node: OasNode = ...;
let errors: OasValidationError[] = node.n_attribute("validation-errors");
if (errors && errors.length > 0) {
    // The node failed validation!
}
````

#### Create a Node Path
`OasLibraryUtils::createNodePath(OasNode): OasNodePath`

For more information about node paths, see the "Node Paths" section below.


### The Data Model
This library has data model classes representing each of the objects defined
by the OpenAPI specification.  Overall, an instance of a data model is simply
a tree of nodes corresponding to the OpenAPI specification.  Each node in the
model is unique depending on its specification definition, in addition to 
sharing a common set of functionality:

* _Parent_: Every node has a reference to its parent node.
* _Owner Document_: Every node has a reference to its owning document.
* _Node Attributes_:  Every node has a set of transient attributes which
  are not serialized when converting back to a JS object.
* _Model ID_: Each node has a unique ID generating when the node is created.


### Node Paths
As mentioned, the OpenAPI library's data model is essentially a tree of nodes
of specific types, as defined by the specification.  An additional feature
of the library is the ability to identify any node in the model by its "node
path".  A node path is a bit like a simple XPath for an XML document.  You
can use a node path to quickly resolve a node.  Node paths are even (sort of)
human readable!

For example, you could quickly get a specific node in the standard OpenAPI
Pet Store example document with the following code:

```Typescript
let document: Oas30Document = ...;
let path: OasNodePath = new OasNodePath("/paths[/pet/{petId}]/get/responses[200]");
let resolvedNode: OasNode = path.resolve(document);
```

Additionally, you can easily create a node path from a given node in the 
data model by using the `createNodePath(OasNode)` method in the 
`OasLibraryUtils` class:

```Typescript
let library: OasLibraryUtils = new OasLibraryUtils();
let document: Oas30Document = ...;
let node: OasNode = document.paths.pathItem("/pet/{petId}").get.responses.response("200");
let path: OasNodePath = library.createNodePath(node);
```


### Visiting the Data Model
In addition to basic reading and writing of a data model, this library also
includes an implementation of the visitor pattern (useful for more advanced
analysis or transformation of the data model).

To use this feature, you must create a Typescript class that extends the 
`IOas30NodeVisitor` interface (for OpenAPI 3.0.0 documents).  You can then
either call `accept` on any node in the model (which will visit just that
one node) or else traverse the entire model (either up or down).  Some 
examples are below.

#### Visit a Single Node
```Typescript
let document: Oas30Document = getOrCreateDocument();
let visitor: IOas30NodeVisitor = new MyCustomVisitor();
// Visit ONLY the "Info" node.
OasVisitorUtil.visitNode(document.info, visitor);
```

#### Visit the Entire Document

```Typescript
let document: Oas30Document = getOrCreateDocument();
let visitor: IOas30NodeVisitor = new MyCustomVisitor();
OasVisitorUtil.visitTree(document, visitor);
```

#### Visit a Node And Its Parents
```Typescript
let document: Oas30Document = getOrCreateDocument();
let visitor: IOas30NodeVisitor = new MyCustomVisitor();
// Visit the Info node and then the Document (root) node
OasVisitorUtil.visitTree(document.info, visitor, OasTraverserDirection.up);
```

A typescript library for reading, manipulating, and writing OpenAPI documents.

Install with `npm install oai-ts-core`.

## API

### Create Document
`createDocument(src)`

Creates a document from a source.  The source parameter can be any of the following:

* _string_: if the string starts with a { then the source is assumed to be a properly
formatted OpenAPI document as a JSON string
* _string_: if the string is a valid OpenAPI version number (e.g. "2.0") then a new
empty document instance will be returned (of the appropriate version)
* _object_: an already-parsed OpenAPI document as a javascript object

The `createDocument` function will either throw an error (if the `src` is invalid in
some way) or return a newly created OpenAPI document.

### Read Node
`readNode(src, node)`

Reads a partial model from the given source.  The caller must specify what type of
node is represented by the source (it is impossible to determine that automatically).
The `src` may either be a JSON formatted string or an object.


### Write Node
`writeNode(node)`

Converts the given OAS model into a standard JS object.  Any OAS node can be
passed here allowing for serialization of either the full OpenAPI document or
any subsection of it.

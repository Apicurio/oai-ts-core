///<reference path="../node_modules/@types/jasmine/index.d.ts"/>
///<reference path="@types/karma-read-json/index.d.ts"/>

/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Oas20Document} from "../src/models/2.0/document.model";
import {OasLibraryUtils} from "../src/library.utils";
import {Oas20PathItem} from "../src/models/2.0/path-item.model";
import {Oas20SchemaDefinition} from "../src/models/2.0/schema.model";
import {OasSchemaFactory} from "../src/factories/schema.factory";


describe("Schema Factory (2.0)", () => {

    let library: OasLibraryUtils;
    let schemaFactory: OasSchemaFactory;
    let document: Oas20Document;

    beforeEach(() => {
        library = new OasLibraryUtils();
        schemaFactory = new OasSchemaFactory();
        document = <Oas20Document>library.createDocument("2.0");
    });

    it("Schema From Example (empty)", () => {
        let schema: Oas20SchemaDefinition = schemaFactory.createSchemaDefinitionFromExample(document, "Empty", {
        }) as Oas20SchemaDefinition;

        expect(library.writeNode(schema)).toEqual({
            "title": "Root Type for Empty",
            "description": "The root of the Empty type's schema.",
            "type": "object"
        });
    });

    it("Schema From Example (basic types)", () => {
        let schema: Oas20SchemaDefinition = schemaFactory.createSchemaDefinitionFromExample(document, "Basic", {
            "string-prop": "hello world",
            "int-prop": 17,
            "number-prop": 17.9,
            "boolean-prop": true
        }) as Oas20SchemaDefinition;

        expect(library.writeNode(schema)).toEqual({
            "title": "Root Type for Basic",
            "description": "The root of the Basic type's schema.",
            "type": "object",
            "properties": {
                "string-prop": {
                    "type": "string"
                },
                "int-prop": {
                    "type": "integer",
                    "format": "int32"
                },
                "number-prop": {
                    "type": "number",
                    "format": "double"
                },
                "boolean-prop": {
                    "type": "boolean"
                }
            }
        });
    });

    it("Schema From Example (type formats)", () => {
        let schema: Oas20SchemaDefinition = schemaFactory.createSchemaDefinitionFromExample(document, "Basic", {
            "string-prop": "hello world",
            "int-prop": 17,
            "large-int-prop": 223372036854775807,
            "date-prop": "2018-03-19",
            "dateTime-prop": "2018-03-19T12:33:00Z"
        }) as Oas20SchemaDefinition;

        expect(library.writeNode(schema)).toEqual({
            "title": "Root Type for Basic",
            "description": "The root of the Basic type's schema.",
            "type": "object",
            "properties": {
                "string-prop": {
                    "type": "string"
                },
                "int-prop": {
                    "type": "integer",
                    "format": "int32"
                },
                "large-int-prop": {
                    "type": "integer",
                    "format": "int64"
                },
                "date-prop": {
                    "type": "string",
                    "format": "date"
                },
                "dateTime-prop": {
                    "type": "string",
                    "format": "date-time"
                }
            }
        });
    });

    it("Schema From Example (string array)", () => {
        let schema: Oas20SchemaDefinition = schemaFactory.createSchemaDefinitionFromExample(document,
            "Array", [ "one", "two", "three" ]) as Oas20SchemaDefinition;

        expect(library.writeNode(schema)).toEqual({
            "title": "Root Type for Array",
            "description": "The root of the Array type's schema.",
            "type": "array",
            "items": {
                "type": "string"
            }
        });
    });


    it("Schema From Example (int32 array)", () => {
        let schema: Oas20SchemaDefinition = schemaFactory.createSchemaDefinitionFromExample(document,
            "Array", [ 1, 2, 3, 5, 7, 11 ]) as Oas20SchemaDefinition;

        expect(library.writeNode(schema)).toEqual({
            "title": "Root Type for Array",
            "description": "The root of the Array type's schema.",
            "type": "array",
            "items": {
                "type": "integer",
                "format": "int32"
            }
        });
    });

    it("Schema From Example (object array)", () => {
        let schema: Oas20SchemaDefinition = schemaFactory.createSchemaDefinitionFromExample(document, "Array", [
            {
                id: "item-1",
                name: "Item 1",
                description: "Description of item 1."
            },
            {
                id: "item-2",
                name: "Item 2",
                description: "Description of item 2."
            }
        ]) as Oas20SchemaDefinition;

        expect(library.writeNode(schema)).toEqual({
            "title": "Root Type for Array",
            "description": "The root of the Array type's schema.",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    },
                    "description": {
                        "type": "string"
                    }
                }
            }
        });
    });

    it("Schema From Example (complex object)", () => {
        let schema: Oas20SchemaDefinition = schemaFactory.createSchemaDefinitionFromExample(document, "ComplexObject", {
            "id": "home-1",
            "name": {
                "first": "Robert",
                "mi": "G",
                "last": "Cross"
            },
            "address": {
                "number": 46,
                "street": "Osborne Hill Rd.",
                "city": "Sandy Hook",
                "state": "CT",
                "zip": "06470"
            },
            "level1": {
                "level2": {
                    "level3": {
                        "p1": "1",
                        "p2": 10,
                        "p3": false
                    }
                }
            }
        }) as Oas20SchemaDefinition;

        //console.info(JSON.stringify(library.writeNode(schema), null, 3));

        expect(library.writeNode(schema)).toEqual({
            "title": "Root Type for ComplexObject",
            "description": "The root of the ComplexObject type's schema.",
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "name": {
                    "type": "object",
                    "properties": {
                        "first": {
                            "type": "string"
                        },
                        "mi": {
                            "type": "string"
                        },
                        "last": {
                            "type": "string"
                        }
                    }
                },
                "address": {
                    "type": "object",
                    "properties": {
                        "number": {
                            "type": "integer",
                            "format": "int32"
                        },
                        "street": {
                            "type": "string"
                        },
                        "city": {
                            "type": "string"
                        },
                        "state": {
                            "type": "string"
                        },
                        "zip": {
                            "type": "string"
                        }
                    }
                },
                "level1": {
                    "type": "object",
                    "properties": {
                        "level2": {
                            "type": "object",
                            "properties": {
                                "level3": {
                                    "type": "object",
                                    "properties": {
                                        "p1": {
                                            "type": "string"
                                        },
                                        "p2": {
                                            "type": "integer",
                                            "format": "int32"
                                        },
                                        "p3": {
                                            "type": "boolean"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    });

});

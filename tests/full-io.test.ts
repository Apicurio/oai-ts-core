///<reference path="../node_modules/@types/jasmine/index.d.ts"/>
///<reference path="@types/karma-read-json/index.d.ts"/>

/**
 * @license
 * Copyright 2016 JBoss Inc
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


/**
 * This function recursively sorts all objects by property name.  This is so that it is
 * easier to compare two objects.
 * @param original
 * @return {any}
 */
function sortObj(original: any): any {
    let sorted: any = {};
    Object.keys(original).sort().forEach(function(key) {
        let val: any = original[key];
        if (typeof val === 'object') {
            val = sortObj(val);
        }
        sorted[key] = val;
    });
    return sorted;
}

describe("Full I/O (2.0) - Basics", () => {

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Invalid spec version", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/invalid-version.json');
        expect(() => { library.createDocument(json); }).toThrowError("Unsupported OAS version: 1.1");
    });

    it("Simplest possible 2.0 spec", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple/simplest.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple Info object", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple/simple-info.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Info object with extensions", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple/simple-info-extensions.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple Tags list", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple/simple-tags.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple External Documentation", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple/simple-externalDocs.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple Security Definitions", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple/simple-securityDefinitions.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple Security Requirements", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple/simple-security.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Complete Security Definitions", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/complete/complete-securityDefinitions.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Complete Tags", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/complete/complete-tags.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Complete Pet Store", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/complete/pet-store.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);

        // let actual: any = sortObj(jsObj);
        // let expected: any = sortObj(json);
        //
        // console.info("--- ACTUAL ---")
        // console.info(JSON.stringify(actual));
        // console.info("--- EXPECTED ---")
        // console.info(JSON.stringify(expected));

        expect(jsObj).toEqual(json);
    });
});


describe("Paths I/O (2.0)", () => {

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Paths (GET)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-get.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (GET + Params)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-get-with-params.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (GET + Tags)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-get-with-tags.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Path + Params)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-path-with-params.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (All Ops)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-all-operations.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Ref)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-ref.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (External Docs)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-externalDocs.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Security)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-security.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Default Response)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-default-response.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Responses)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-responses.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Response w/ Headers)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-response-with-headers.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Response w/ Examples)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-response-with-examples.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Response w/ Schema)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-response-with-schema.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (With Extensions)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-with-extensions.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Responses w/ Extensions)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-responses-with-extensions.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Response w/ $ref)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-response-with-ref.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

});


describe("Definitions I/O (2.0)", () => {

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Primitive Sample", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/definitions/primitive.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Spec Example 1", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/definitions/spec-example-1.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Schema With XML", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/definitions/schema-with-xml.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Schema With Meta Data", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/definitions/schema-with-metaData.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Schema With 'allOf'", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/definitions/schema-with-allOf.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Schema With External Docs", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/definitions/schema-with-externalDocs.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Schema With Additional Properties", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/definitions/schema-with-additionalProperties.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Schema With Example", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/definitions/schema-with-example.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Schema With Composition", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/definitions/schema-with-composition.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Schema With Polymorphism", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/definitions/schema-with-polymorphism.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("JSON Schema :: Basic", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/definitions/json-schema-basic.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("JSON Schema :: Products", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/definitions/json-schema-products.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("JSON Schema :: fstab", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/definitions/json-schema-fstab.json' );
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

});


describe("Parameters I/O (2.0)", () => {

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Spec Example 1", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/parameters/spec-example-1.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Array Parameters (items)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/parameters/array-param.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

});


describe("Responses I/O (2.0)", () => {

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Spec Example 1", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/responses/spec-example-1.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

    it("Multiple Spec Examples", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/responses/response-spec-examples.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);
        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual(json);
    });

});

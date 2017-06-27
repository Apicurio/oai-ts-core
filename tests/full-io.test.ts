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
import {Oas30Document} from "../src/models/3.0/document.model";


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

/**
 * Full I/O Tests for Version 2.0 of the OpenAPI Specification.
 */
describe("Full I/O (2.0)", () => {

    let TESTS: any = [
        { name: "Simple (Easy 2.0 spec)",               test: "tests/fixtures/full-io/2.0/simple/simplest.json" },
        { name: "Simple (Info)",                        test: "tests/fixtures/full-io/2.0/simple/simple-info.json" },
        { name: "Simple (Info + extensions)",           test: "tests/fixtures/full-io/2.0/simple/simple-info-extensions.json" },
        { name: "Simple (Tags)",                        test: "tests/fixtures/full-io/2.0/simple/simple-tags.json" },
        { name: "Simple (External Docs)",               test: "tests/fixtures/full-io/2.0/simple/simple-externalDocs.json" },
        { name: "Simple (Security Definitions)",        test: "tests/fixtures/full-io/2.0/simple/simple-securityDefinitions.json" },
        { name: "Simple (Security Requirements)",       test: "tests/fixtures/full-io/2.0/simple/simple-security.json" },
        { name: "Paths (Empty)",                        test: "tests/fixtures/full-io/2.0/paths/paths-empty.json" },
        { name: "Paths (GET)",                          test: "tests/fixtures/full-io/2.0/paths/paths-get.json" },
        { name: "Paths (GET + Params)",                 test: "tests/fixtures/full-io/2.0/paths/paths-get-with-params.json" },
        { name: "Paths (GET + Tags)",                   test: "tests/fixtures/full-io/2.0/paths/paths-get-with-tags.json" },
        { name: "Paths (Path + Params)",                test: "tests/fixtures/full-io/2.0/paths/paths-path-with-params.json" },
        { name: "Paths (All Ops)",                      test: "tests/fixtures/full-io/2.0/paths/paths-all-operations.json" },
        { name: "Paths (Ref)",                          test: "tests/fixtures/full-io/2.0/paths/paths-ref.json" },
        { name: "Paths (External Docs)",                test: "tests/fixtures/full-io/2.0/paths/paths-externalDocs.json" },
        { name: "Paths (Security)",                     test: "tests/fixtures/full-io/2.0/paths/paths-security.json" },
        { name: "Paths (Default Response)",             test: "tests/fixtures/full-io/2.0/paths/paths-default-response.json" },
        { name: "Paths (Responses)",                    test: "tests/fixtures/full-io/2.0/paths/paths-responses.json" },
        { name: "Paths (Response w/ Headers)",          test: "tests/fixtures/full-io/2.0/paths/paths-response-with-headers.json" },
        { name: "Paths (Response w/ Examples)",         test: "tests/fixtures/full-io/2.0/paths/paths-response-with-examples.json" },
        { name: "Paths (Response w/ Schema)",           test: "tests/fixtures/full-io/2.0/paths/paths-response-with-schema.json" },
        { name: "Paths (With Extensions)",              test: "tests/fixtures/full-io/2.0/paths/paths-with-extensions.json" },
        { name: "Paths (Responses w/ Extensions)",      test: "tests/fixtures/full-io/2.0/paths/paths-responses-with-extensions.json" },
        { name: "Paths (Response w/ $ref)",             test: "tests/fixtures/full-io/2.0/paths/paths-response-with-ref.json" },
        { name: "Definitions (Primitives Sample)",      test: "tests/fixtures/full-io/2.0/definitions/primitive.json" },
        { name: "Definitions (Spec Example)",           test: "tests/fixtures/full-io/2.0/definitions/spec-example-1.json" },
        { name: "Definitions (Schema+XML)",             test: "tests/fixtures/full-io/2.0/definitions/schema-with-xml.json" },
        { name: "Definitions (Schema+Meta Data)",       test: "tests/fixtures/full-io/2.0/definitions/schema-with-metaData.json" },
        { name: "Definitions (Schema+'allOf')",         test: "tests/fixtures/full-io/2.0/definitions/schema-with-allOf.json" },
        { name: "Definitions (Schema+External Docs)",   test: "tests/fixtures/full-io/2.0/definitions/schema-with-externalDocs.json" },
        { name: "Definitions (Schema+Props)",           test: "tests/fixtures/full-io/2.0/definitions/schema-with-additionalProperties.json" },
        { name: "Definitions (Schema+Example)",         test: "tests/fixtures/full-io/2.0/definitions/schema-with-example.json" },
        { name: "Definitions (Schema+Composition)",     test: "tests/fixtures/full-io/2.0/definitions/schema-with-composition.json" },
        { name: "Definitions (Schema+Polymorphism)",    test: "tests/fixtures/full-io/2.0/definitions/schema-with-polymorphism.json" },
        { name: "Definitions (JSON Schema Basic)",      test: "tests/fixtures/full-io/2.0/definitions/json-schema-basic.json" },
        { name: "Definitions (JSON Schema Products)",   test: "tests/fixtures/full-io/2.0/definitions/json-schema-products.json" },
        { name: "Definitions (JSON Schema fstab)",      test: "tests/fixtures/full-io/2.0/definitions/json-schema-fstab.json" },
        { name: "Parameters (Spec Example)",            test: "tests/fixtures/full-io/2.0/parameters/spec-example-1.json" },
        { name: "Parameters (Array Params (items))",    test: "tests/fixtures/full-io/2.0/parameters/array-param.json" },
        { name: "Responses (Spec Example)",             test: "tests/fixtures/full-io/2.0/responses/spec-example-1.json" },
        { name: "Responses (Multiple Spec Examples)",   test: "tests/fixtures/full-io/2.0/responses/response-spec-examples.json" },
        { name: "Complete (Security Definitions)",      test: "tests/fixtures/full-io/2.0/complete/complete-securityDefinitions.json" },
        { name: "Complete (Tags)",                      test: "tests/fixtures/full-io/2.0/complete/complete-tags.json" },
        { name: "Complete (Pet Store)",                 test: "tests/fixtures/full-io/2.0/complete/pet-store.json" },
        { name: "Complete (api.meerkat)",               test: "tests/fixtures/full-io/2.0/complete/api.meerkat.com.br.json" },
        { name: "Complete (austin2015.apistrat)",       test: "tests/fixtures/full-io/2.0/complete/austin2015.apistrat.com.json" },
        { name: "Complete (developer.trade.gov)",       test: "tests/fixtures/full-io/2.0/complete/developer.trade.gov.json" },
        { name: "Complete (api.hairmare)",              test: "tests/fixtures/full-io/2.0/complete/subnet.api.hairmare.ch.json" },
        { name: "Complete (weatherbit.io)",             test: "tests/fixtures/full-io/2.0/complete/www.weatherbit.io.json" }
    ];

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Invalid spec version", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/invalid-version.json');
        expect(() => { library.createDocument(json); }).toThrowError("Unsupported OAS version: 1.1");
    });

    // All tests in the list above.
    TESTS.forEach( spec => {
        it(spec.name, () => {
            if (spec.debug) {
                console.info("*******  Running test: " + spec.name);
            }
            let json: any = readJSON(spec.test);
            let document: Oas20Document = <Oas20Document>library.createDocument(json);
            let jsObj: any = library.writeNode(document);
            if (spec.debug) {
                console.info("------- INPUT --------\n " + JSON.stringify(json, null, 2) + "\n-------------------");
                console.info("------- ACTUAL --------\n " + JSON.stringify(jsObj, null, 2) + "\n-------------------");
            }
            expect(jsObj).toEqual(json);
        });
    });

});


/**
 * Full I/O Tests for Version 3.0 of the OpenAPI Specification.
 */
describe("Full I/O (3.0)", () => {

    let TESTS: any = [
        { name: "Simple (Easy 3.0 spec)",               test: "tests/fixtures/full-io/3.0/simple/simplest.json" },
        { name: "Simple (Info)",                        test: "tests/fixtures/full-io/3.0/simple/simple-info.json" },
        { name: "Simple (Info + extensions)",           test: "tests/fixtures/full-io/3.0/simple/simple-info-extensions.json" },
        { name: "Simple (Servers)",                     test: "tests/fixtures/full-io/3.0/simple/simple-servers.json" },
        { name: "Simple (Security Requirements)",       test: "tests/fixtures/full-io/3.0/simple/simple-security.json" },
        { name: "Simple (Tags)",                        test: "tests/fixtures/full-io/3.0/simple/simple-tags.json" },
        { name: "Simple (External Docs)",               test: "tests/fixtures/full-io/3.0/simple/simple-externalDocs.json" },
        { name: "Complete (Tags)",                      test: "tests/fixtures/full-io/3.0/complete/complete-tags.json" },
        { name: "Paths (Empty)",                        test: "tests/fixtures/full-io/3.0/paths/paths-empty.json" },
        { name: "Paths (GET)",                          test: "tests/fixtures/full-io/3.0/paths/paths-get.json" },
        { name: "Paths ($ref)",                         test: "tests/fixtures/full-io/3.0/paths/paths-ref.json" },
        { name: "Paths (Extensions)",                   test: "tests/fixtures/full-io/3.0/paths/paths-with-extensions.json" },
        { name: "Paths (All Operations)",               test: "tests/fixtures/full-io/3.0/paths/paths-all-operations.json" },
        { name: "Paths (Servers)",                      test: "tests/fixtures/full-io/3.0/paths/paths-servers.json" },
        { name: "Paths (Parameters)",                   test: "tests/fixtures/full-io/3.0/paths/paths-parameters.json" },
        { name: "Paths (GET+Servers)",                  test: "tests/fixtures/full-io/3.0/paths/paths-get-servers.json" },
        { name: "Paths (GET+Security)",                 test: "tests/fixtures/full-io/3.0/paths/paths-get-security.json" },
        { name: "Paths (GET+Parameters)",               test: "tests/fixtures/full-io/3.0/paths/paths-get-parameters.json" },
        { name: "Paths (GET+RequestBody)",              test: "tests/fixtures/full-io/3.0/paths/paths-get-requestBody.json" },
        { name: "Paths (GET+RequestBody+Content)",      test: "tests/fixtures/full-io/3.0/paths/paths-get-requestBody-content.json" },
        { name: "Paths (GET+RequestBody+Examples)",     test: "tests/fixtures/full-io/3.0/paths/paths-get-requestBody.json" },
        { name: "Paths (GET+Responses)",                test: "tests/fixtures/full-io/3.0/paths/paths-get-responses.json" },
        { name: "Paths (GET+Response+Header)",          test: "tests/fixtures/full-io/3.0/paths/paths-get-response-headers.json" },
        { name: "Paths (GET+Response+Content)",         test: "tests/fixtures/full-io/3.0/paths/paths-get-response-content.json" },
        { name: "Paths (GET+Response+Links)",           test: "tests/fixtures/full-io/3.0/paths/paths-get-response-links.json" },
        { name: "Paths (GET+Callbacks)",                test: "tests/fixtures/full-io/3.0/paths/paths-get-callbacks.json" },
        { name: "Components (Empty)",                   test: "tests/fixtures/full-io/3.0/components/components-empty.json" },
        { name: "Components (Schemas)",                 test: "tests/fixtures/full-io/3.0/components/components-schemas.json" },
        { name: "Components (Responses)",               test: "tests/fixtures/full-io/3.0/components/components-responses.json" },
        { name: "Components (Parameters)",              test: "tests/fixtures/full-io/3.0/components/components-parameters.json" },
        { name: "Components (Examples)",                test: "tests/fixtures/full-io/3.0/components/components-examples.json" },
        { name: "Components (Request Bodies)",          test: "tests/fixtures/full-io/3.0/components/components-requestBodies.json" },
        { name: "Components (Headers)",                 test: "tests/fixtures/full-io/3.0/components/components-headers.json" },
        { name: "Components (Security Schemes)",        test: "tests/fixtures/full-io/3.0/components/components-securitySchemes.json" },
        { name: "Components (Links)",                   test: "tests/fixtures/full-io/3.0/components/components-links.json" },
        { name: "Components (Callbacks)",               test: "tests/fixtures/full-io/3.0/components/components-callbacks.json" },
        { name: "Schemas (Discriminator)",              test: "tests/fixtures/full-io/3.0/schemas/discriminator.json" },
    ];

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    // All tests in the list above.
    TESTS.forEach( spec => {
        it(spec.name, () => {
            if (spec.debug) {
                console.info("*******  Running test: " + spec.name);
            }
            let json: any = readJSON(spec.test);
            let document: Oas30Document = <Oas30Document>library.createDocument(json);
            let jsObj: any = library.writeNode(document);
            if (spec.debug) {
                console.info("------- INPUT --------\n " + JSON.stringify(json, null, 2) + "\n-------------------");
                console.info("------- ACTUAL --------\n " + JSON.stringify(jsObj, null, 2) + "\n-------------------");
            }
            expect(jsObj).toEqual(json);
        });
    });

});


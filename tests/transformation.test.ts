///<reference path="../node_modules/@types/jasmine/index.d.ts"/>
///<reference path="@types/karma-read-json/index.d.ts"/>

/**
 * @license
 * Copyright 2018 JBoss Inc
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

import {OasLibraryUtils} from "../src/library.utils";
import {Oas30Document} from "../src/models/3.0/document.model";
import {Oas20Document} from "../src/models/2.0/document.model";


export interface TestSpec {
    name: string;
    input: string;
    expected: string;
    debug?: boolean;
}

/**
 * Tests for the transformation of a 2.0 document into a 3.0 document.
 */
describe("Transformation", () => {

    let TESTS: TestSpec[] = [
        /** Simple Tests **/
        /** ************ **/
        {
            name: "Simple (Easy 2.0 spec)",
            input: "tests/fixtures/transformation/simple/simplest.input.json",
            expected: "tests/fixtures/transformation/simple/simplest.expected.json"
        },
        {
            name: "Simple (Info)",
            input: "tests/fixtures/transformation/simple/simple-info.input.json",
            expected: "tests/fixtures/transformation/simple/simple-info.expected.json"
        },
        {
            name: "Simple (Info+Extensions)",
            input: "tests/fixtures/transformation/simple/simple-info-extensions.input.json",
            expected: "tests/fixtures/transformation/simple/simple-info-extensions.expected.json"
        },
        {
            name: "Simple (Server)",
            input: "tests/fixtures/transformation/simple/simple-server.input.json",
            expected: "tests/fixtures/transformation/simple/simple-server.expected.json",
            debug: true
        },
        {
            name: "Simple (Server+Schemes)",
            input: "tests/fixtures/transformation/simple/simple-server-with-schemes.input.json",
            expected: "tests/fixtures/transformation/simple/simple-server-with-schemes.expected.json",
            debug: true
        },
        /** Paths Tests **/
        /** *********** **/
        {
            name: "Paths (GET)",
            input: "tests/fixtures/transformation/paths/paths-get.input.json",
            expected: "tests/fixtures/transformation/paths/paths-get.expected.json"
        },
        {
            name: "Paths (All Operations)",
            input: "tests/fixtures/transformation/paths/paths-all-operations.input.json",
            expected: "tests/fixtures/transformation/paths/paths-all-operations.expected.json"
        },
        {
            name: "Paths (Default Response)",
            input: "tests/fixtures/transformation/paths/paths-default-response.input.json",
            expected: "tests/fixtures/transformation/paths/paths-default-response.expected.json"
        },
        {
            name: "Paths (External Docs)",
            input: "tests/fixtures/transformation/paths/paths-externalDocs.input.json",
            expected: "tests/fixtures/transformation/paths/paths-externalDocs.expected.json"
        },
        {
            name: "Paths (GET+Params)",
            input: "tests/fixtures/transformation/paths/paths-get-with-params.input.json",
            expected: "tests/fixtures/transformation/paths/paths-get-with-params.expected.json"
        },
        {
            name: "Paths (GET+Tags)",
            input: "tests/fixtures/transformation/paths/paths-get-with-tags.input.json",
            expected: "tests/fixtures/transformation/paths/paths-get-with-tags.expected.json"
        },
        {
            name: "Paths (Path Params)",
            input: "tests/fixtures/transformation/paths/paths-path-with-params.input.json",
            expected: "tests/fixtures/transformation/paths/paths-path-with-params.expected.json"
        },
        {
            name: "Paths (Path Ref)",
            input: "tests/fixtures/transformation/paths/paths-ref.input.json",
            expected: "tests/fixtures/transformation/paths/paths-ref.expected.json"
        },
        {
            name: "Paths (Response+Examples)",
            input: "tests/fixtures/transformation/paths/paths-response-with-examples.input.json",
            expected: "tests/fixtures/transformation/paths/paths-response-with-examples.expected.json"
        },
        {
            name: "Paths (Response+Headers)",
            input: "tests/fixtures/transformation/paths/paths-response-with-headers.input.json",
            expected: "tests/fixtures/transformation/paths/paths-response-with-headers.expected.json"
        },
        {
            name: "Paths (Response+Ref)",
            input: "tests/fixtures/transformation/paths/paths-response-with-ref.input.json",
            expected: "tests/fixtures/transformation/paths/paths-response-with-ref.expected.json"
        },
        {
            name: "Paths (Response+Schema)",
            input: "tests/fixtures/transformation/paths/paths-response-with-schema.input.json",
            expected: "tests/fixtures/transformation/paths/paths-response-with-schema.expected.json"
        },
        {
            name: "Paths (Responses)",
            input: "tests/fixtures/transformation/paths/paths-responses.input.json",
            expected: "tests/fixtures/transformation/paths/paths-responses.expected.json"
        },
        {
            name: "Paths (Responses+Extensions)",
            input: "tests/fixtures/transformation/paths/paths-responses-with-extensions.input.json",
            expected: "tests/fixtures/transformation/paths/paths-responses-with-extensions.expected.json"
        },
        {
            name: "Paths (Security)",
            input: "tests/fixtures/transformation/paths/paths-security.input.json",
            expected: "tests/fixtures/transformation/paths/paths-security.expected.json"
        },
        {
            name: "Paths (Extensions)",
            input: "tests/fixtures/transformation/paths/paths-with-extensions.input.json",
            expected: "tests/fixtures/transformation/paths/paths-with-extensions.expected.json"
        },
        {
            name: "Paths (POST+FormData)",
            input: "tests/fixtures/transformation/paths/paths-post-with-formData.input.json",
            expected: "tests/fixtures/transformation/paths/paths-post-with-formData.expected.json"
        },
        {
            name: "Paths (POST+FormData+Multi)",
            input: "tests/fixtures/transformation/paths/paths-post-with-formData-multi.input.json",
            expected: "tests/fixtures/transformation/paths/paths-post-with-formData-multi.expected.json"
        },
        {
            name: "Paths (GET+Schemes)",
            input: "tests/fixtures/transformation/paths/paths-get-with-schemes.input.json",
            expected: "tests/fixtures/transformation/paths/paths-get-with-schemes.expected.json"
        },
        /** Responses Tests **/
        /** *************** **/
        {
            name: "Responses (Spec Examples)",
            input: "tests/fixtures/transformation/responses/response-spec-examples.input.json",
            expected: "tests/fixtures/transformation/responses/response-spec-examples.expected.json"
        },
        {
            name: "Responses (Example 1)",
            input: "tests/fixtures/transformation/responses/spec-example-1.input.json",
            expected: "tests/fixtures/transformation/responses/spec-example-1.expected.json"
        },
        /** Definition Tests **/
        /** **************** **/
        {
            name: "Definitions (JSON Schema::basic)",
            input: "tests/fixtures/transformation/definitions/json-schema-basic.input.json",
            expected: "tests/fixtures/transformation/definitions/json-schema-basic.expected.json"
        },
        {
            name: "Definitions (JSON Schema::fstab)",
            input: "tests/fixtures/transformation/definitions/json-schema-fstab.input.json",
            expected: "tests/fixtures/transformation/definitions/json-schema-fstab.expected.json"
        },
        {
            name: "Definitions (JSON Schema::products)",
            input: "tests/fixtures/transformation/definitions/json-schema-products.input.json",
            expected: "tests/fixtures/transformation/definitions/json-schema-products.expected.json"
        },
        {
            name: "Definitions (Primitive)",
            input: "tests/fixtures/transformation/definitions/primitive.input.json",
            expected: "tests/fixtures/transformation/definitions/primitive.expected.json"
        },
        {
            name: "Definitions (Additional Props)",
            input: "tests/fixtures/transformation/definitions/schema-with-additionalProperties.input.json",
            expected: "tests/fixtures/transformation/definitions/schema-with-additionalProperties.expected.json"
        },
        {
            name: "Definitions (All Of)",
            input: "tests/fixtures/transformation/definitions/schema-with-allOf.input.json",
            expected: "tests/fixtures/transformation/definitions/schema-with-allOf.expected.json"
        },
        {
            name: "Definitions (Composition)",
            input: "tests/fixtures/transformation/definitions/schema-with-composition.input.json",
            expected: "tests/fixtures/transformation/definitions/schema-with-composition.expected.json"
        },
        {
            name: "Definitions (Example)",
            input: "tests/fixtures/transformation/definitions/schema-with-example.input.json",
            expected: "tests/fixtures/transformation/definitions/schema-with-example.expected.json"
        },
        {
            name: "Definitions (Extension)",
            input: "tests/fixtures/transformation/definitions/schema-with-extension.input.json",
            expected: "tests/fixtures/transformation/definitions/schema-with-extension.expected.json"
        },
        {
            name: "Definitions (External Docs)",
            input: "tests/fixtures/transformation/definitions/schema-with-externalDocs.input.json",
            expected: "tests/fixtures/transformation/definitions/schema-with-externalDocs.expected.json"
        },
        {
            name: "Definitions (Meta Data)",
            input: "tests/fixtures/transformation/definitions/schema-with-metaData.input.json",
            expected: "tests/fixtures/transformation/definitions/schema-with-metaData.expected.json"
        },
        {
            name: "Definitions (Polymorphism)",
            input: "tests/fixtures/transformation/definitions/schema-with-polymorphism.input.json",
            expected: "tests/fixtures/transformation/definitions/schema-with-polymorphism.expected.json"
        },
        {
            name: "Definitions (XML)",
            input: "tests/fixtures/transformation/definitions/schema-with-xml.input.json",
            expected: "tests/fixtures/transformation/definitions/schema-with-xml.expected.json"
        },
        {
            name: "Definitions (Spec Example 1)",
            input: "tests/fixtures/transformation/definitions/spec-example-1.input.json",
            expected: "tests/fixtures/transformation/definitions/spec-example-1.expected.json"
        },
        /** Parameters Tests **/
        /** **************** **/
        {
            name: "Parameters (Single Array)",
            input: "tests/fixtures/transformation/parameters/single-array-param.input.json",
            expected: "tests/fixtures/transformation/parameters/single-array-param.expected.json"
        },
        {
            name: "Parameters (Array)",
            input: "tests/fixtures/transformation/parameters/array-param.input.json",
            expected: "tests/fixtures/transformation/parameters/array-param.expected.json"
        },
        {
            name: "Parameters (Spec Example)",
            input: "tests/fixtures/transformation/parameters/spec-example-1.input.json",
            expected: "tests/fixtures/transformation/parameters/spec-example-1.expected.json"
        },
        {
            name: "Parameters (Body Param)",
            input: "tests/fixtures/transformation/parameters/body-param.input.json",
            expected: "tests/fixtures/transformation/parameters/body-param.expected.json"
        },
        /** Security Schemes **/
        /** **************** **/
        {
            name: "Security Schemes (All)",
            input: "tests/fixtures/transformation/security/security-allSchemes.input.json",
            expected: "tests/fixtures/transformation/security/security-allSchemes.expected.json"
        },

    ];

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    // All tests in the list above.
    TESTS.forEach( spec => {
        it(spec.name, () => {
            if (spec.debug) {
                console.info("*******  Running input: " + spec.name);
            }
            let inputJso: any = readJSON(spec.input);
            let expectedJso: any = readJSON(spec.expected);

            expect(inputJso).toBeTruthy();
            expect(expectedJso).toBeTruthy();

            let input: Oas20Document = library.createDocument(inputJso) as Oas20Document;
            let actual: Oas30Document = library.transformDocument(input);
            let actualJso: any = library.writeNode(actual);
            if (spec.debug) {
                console.info("------- INPUT --------\n " + JSON.stringify(inputJso, null, 2) + "\n-------------------");
                console.info("------- ACTUAL --------\n " + JSON.stringify(actualJso, null, 2) + "\n-------------------");
                console.info("------- EXPECTED --------\n " + JSON.stringify(expectedJso, null, 2) + "\n-------------------");
            }
            expect(actualJso).toEqual(expectedJso);
        });
    });

});

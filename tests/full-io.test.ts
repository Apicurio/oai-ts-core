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
import {OasAllNodeVisitor} from "../src/visitors/visitor.base";
import {OasNode} from "../src/models/node.model";
import {OasVisitorUtil} from "../src/visitors/visitor.utils";


export interface TestSpec {
    name: string;
    test: string;
    extraProperties: number;
    debug?: boolean;
}

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

class ExtraPropertyDetectionVisitor extends OasAllNodeVisitor {

    public numDetected: number = 0;

    protected doVisitNode(node: OasNode): void {
        if (node.hasExtraProperties()) {
            this.numDetected += node.getExtraPropertyNames().length;
        }
    }

}

/**
 * Full I/O Tests for Version 2.0 of the OpenAPI Specification.
 */
describe("Full I/O (2.0)", () => {

    let TESTS: TestSpec[] = [
        { name: "Simple (Easy 2.0 spec)",               test: "tests/fixtures/full-io/2.0/simple/simplest.json",                                extraProperties: 0 },
        { name: "Simple (Info)",                        test: "tests/fixtures/full-io/2.0/simple/simple-info.json",                             extraProperties: 0 },
        { name: "Simple (Info + extensions)",           test: "tests/fixtures/full-io/2.0/simple/simple-info-extensions.json",                  extraProperties: 0 },
        { name: "Simple (Tags)",                        test: "tests/fixtures/full-io/2.0/simple/simple-tags.json",                             extraProperties: 0 },
        { name: "Simple (External Docs)",               test: "tests/fixtures/full-io/2.0/simple/simple-externalDocs.json",                     extraProperties: 0 },
        { name: "Simple (Security Definitions)",        test: "tests/fixtures/full-io/2.0/simple/simple-securityDefinitions.json",              extraProperties: 0 },
        { name: "Simple (Security Requirements)",       test: "tests/fixtures/full-io/2.0/simple/simple-security.json",                         extraProperties: 0 },
        { name: "Paths (Empty)",                        test: "tests/fixtures/full-io/2.0/paths/paths-empty.json",                              extraProperties: 0 },
        { name: "Paths (GET)",                          test: "tests/fixtures/full-io/2.0/paths/paths-get.json",                                extraProperties: 0 },
        { name: "Paths (GET + Params)",                 test: "tests/fixtures/full-io/2.0/paths/paths-get-with-params.json",                    extraProperties: 0 },
        { name: "Paths (GET + Tags)",                   test: "tests/fixtures/full-io/2.0/paths/paths-get-with-tags.json",                      extraProperties: 0 },
        { name: "Paths (Path + Params)",                test: "tests/fixtures/full-io/2.0/paths/paths-path-with-params.json",                   extraProperties: 0 },
        { name: "Paths (All Ops)",                      test: "tests/fixtures/full-io/2.0/paths/paths-all-operations.json",                     extraProperties: 0 },
        { name: "Paths (Ref)",                          test: "tests/fixtures/full-io/2.0/paths/paths-ref.json",                                extraProperties: 0 },
        { name: "Paths (External Docs)",                test: "tests/fixtures/full-io/2.0/paths/paths-externalDocs.json",                       extraProperties: 0 },
        { name: "Paths (Security)",                     test: "tests/fixtures/full-io/2.0/paths/paths-security.json",                           extraProperties: 0 },
        { name: "Paths (Default Response)",             test: "tests/fixtures/full-io/2.0/paths/paths-default-response.json",                   extraProperties: 0 },
        { name: "Paths (Responses)",                    test: "tests/fixtures/full-io/2.0/paths/paths-responses.json",                          extraProperties: 0 },
        { name: "Paths (Response w/ Headers)",          test: "tests/fixtures/full-io/2.0/paths/paths-response-with-headers.json",              extraProperties: 0 },
        { name: "Paths (Response w/ Examples)",         test: "tests/fixtures/full-io/2.0/paths/paths-response-with-examples.json",             extraProperties: 0 },
        { name: "Paths (Response w/ Schema)",           test: "tests/fixtures/full-io/2.0/paths/paths-response-with-schema.json",               extraProperties: 0 },
        { name: "Paths (With Extensions)",              test: "tests/fixtures/full-io/2.0/paths/paths-with-extensions.json",                    extraProperties: 0 },
        { name: "Paths (Responses w/ Extensions)",      test: "tests/fixtures/full-io/2.0/paths/paths-responses-with-extensions.json",          extraProperties: 0 },
        { name: "Paths (Response w/ $ref)",             test: "tests/fixtures/full-io/2.0/paths/paths-response-with-ref.json",                  extraProperties: 0 },
        { name: "Definitions (Primitives Sample)",      test: "tests/fixtures/full-io/2.0/definitions/primitive.json",                          extraProperties: 0 },
        { name: "Definitions (Spec Example)",           test: "tests/fixtures/full-io/2.0/definitions/spec-example-1.json",                     extraProperties: 0 },
        { name: "Definitions (Schema+XML)",             test: "tests/fixtures/full-io/2.0/definitions/schema-with-xml.json",                    extraProperties: 0 },
        { name: "Definitions (Schema+Meta Data)",       test: "tests/fixtures/full-io/2.0/definitions/schema-with-metaData.json",               extraProperties: 0 },
        { name: "Definitions (Schema+'allOf')",         test: "tests/fixtures/full-io/2.0/definitions/schema-with-allOf.json",                  extraProperties: 0 },
        { name: "Definitions (Schema+External Docs)",   test: "tests/fixtures/full-io/2.0/definitions/schema-with-externalDocs.json",           extraProperties: 0 },
        { name: "Definitions (Schema+Props)",           test: "tests/fixtures/full-io/2.0/definitions/schema-with-additionalProperties.json",   extraProperties: 0 },
        { name: "Definitions (Schema+Example)",         test: "tests/fixtures/full-io/2.0/definitions/schema-with-example.json",                extraProperties: 0 },
        { name: "Definitions (Schema+Extension)",       test: "tests/fixtures/full-io/2.0/definitions/schema-with-extension.json",              extraProperties: 0 },
        { name: "Definitions (Schema+Composition)",     test: "tests/fixtures/full-io/2.0/definitions/schema-with-composition.json",            extraProperties: 0 },
        { name: "Definitions (Schema+Polymorphism)",    test: "tests/fixtures/full-io/2.0/definitions/schema-with-polymorphism.json",           extraProperties: 0 },
        { name: "Definitions (JSON Schema Basic)",      test: "tests/fixtures/full-io/2.0/definitions/json-schema-basic.json",                  extraProperties: 0 },
        { name: "Definitions (JSON Schema Products)",   test: "tests/fixtures/full-io/2.0/definitions/json-schema-products.json",               extraProperties: 0 },
        { name: "Definitions (JSON Schema fstab)",      test: "tests/fixtures/full-io/2.0/definitions/json-schema-fstab.json",                  extraProperties: 0 },
        { name: "Parameters (Spec Example)",            test: "tests/fixtures/full-io/2.0/parameters/spec-example-1.json",                      extraProperties: 0 },
        { name: "Parameters (Array Params (items))",    test: "tests/fixtures/full-io/2.0/parameters/array-param.json",                         extraProperties: 0 },
        { name: "Responses (Spec Example)",             test: "tests/fixtures/full-io/2.0/responses/spec-example-1.json",                       extraProperties: 0 },
        { name: "Responses (Multiple Spec Examples)",   test: "tests/fixtures/full-io/2.0/responses/response-spec-examples.json",               extraProperties: 0 },
        { name: "Complete (Security Definitions)",      test: "tests/fixtures/full-io/2.0/complete/complete-securityDefinitions.json",          extraProperties: 0 },
        { name: "Complete (Tags)",                      test: "tests/fixtures/full-io/2.0/complete/complete-tags.json",                         extraProperties: 0 },
        { name: "Complete (Pet Store)",                 test: "tests/fixtures/full-io/2.0/complete/pet-store.json",                             extraProperties: 0 },
        { name: "Complete (api.meerkat)",               test: "tests/fixtures/full-io/2.0/complete/api.meerkat.com.br.json",                    extraProperties: 0 },
        { name: "Complete (austin2015.apistrat)",       test: "tests/fixtures/full-io/2.0/complete/austin2015.apistrat.com.json",               extraProperties: 0 },
        { name: "Complete (developer.trade.gov)",       test: "tests/fixtures/full-io/2.0/complete/developer.trade.gov.json",                   extraProperties: 0 },
        { name: "Complete (api.hairmare)",              test: "tests/fixtures/full-io/2.0/complete/subnet.api.hairmare.ch.json",                extraProperties: 0 },
        { name: "Complete (weatherbit.io)",             test: "tests/fixtures/full-io/2.0/complete/www.weatherbit.io.json",                     extraProperties: 0 },
        { name: "Extra Properties",                     test: "tests/fixtures/full-io/2.0/extra-properties/extra-properties.json",              extraProperties: 3 }
    ];

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Invalid spec version", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/invalid-version.json');
        expect(() => { library.createDocument(json); }).toThrowError("Unsupported OAS version: 1.1");
    });

    // it("Numeric spec version", () => {
    //     let json: any = readJSON('tests/fixtures/full-io/2.0/numeric-version.json');
    //     expect(() => { library.createDocument(json); }).toThrowError("Unsupported OAS version: 1.1");
    // });

    // All tests in the list above.
    TESTS.forEach( spec => {
        it(spec.name, () => {
            if (spec.debug) {
                console.info("*******  Running test: " + spec.name);
            }
            let json: any = readJSON(spec.test);
            let document: Oas20Document = library.createDocument(json) as Oas20Document;

            // Assert the # of extra properties is right.
            let viz: ExtraPropertyDetectionVisitor = new ExtraPropertyDetectionVisitor();
            OasVisitorUtil.visitTree(document, viz);
            expect(viz.numDetected).toEqual(spec.extraProperties);

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

    let TESTS: TestSpec[] = [
        { name: "Simple (Easy 3.0 spec)",               test: "tests/fixtures/full-io/3.0/simple/simplest.json",                            extraProperties: 0 },
        { name: "Simple (Info)",                        test: "tests/fixtures/full-io/3.0/simple/simple-info.json",                         extraProperties: 0 },
        { name: "Simple (Info + extensions)",           test: "tests/fixtures/full-io/3.0/simple/simple-info-extensions.json",              extraProperties: 0 },
        { name: "Simple (Servers)",                     test: "tests/fixtures/full-io/3.0/simple/simple-servers.json",                      extraProperties: 0 },
        { name: "Simple (Security Requirements)",       test: "tests/fixtures/full-io/3.0/simple/simple-security.json",                     extraProperties: 0 },
        { name: "Simple (Tags)",                        test: "tests/fixtures/full-io/3.0/simple/simple-tags.json",                         extraProperties: 0 },
        { name: "Simple (External Docs)",               test: "tests/fixtures/full-io/3.0/simple/simple-externalDocs.json",                 extraProperties: 0 },
        { name: "Complete (Tags)",                      test: "tests/fixtures/full-io/3.0/complete/complete-tags.json",                     extraProperties: 0 },
        { name: "Paths (Empty)",                        test: "tests/fixtures/full-io/3.0/paths/paths-empty.json",                          extraProperties: 0 },
        { name: "Paths (GET)",                          test: "tests/fixtures/full-io/3.0/paths/paths-get.json",                            extraProperties: 0 },
        { name: "Paths ($ref)",                         test: "tests/fixtures/full-io/3.0/paths/paths-ref.json",                            extraProperties: 0 },
        { name: "Paths (Extensions)",                   test: "tests/fixtures/full-io/3.0/paths/paths-with-extensions.json",                extraProperties: 0 },
        { name: "Paths (All Operations)",               test: "tests/fixtures/full-io/3.0/paths/paths-all-operations.json",                 extraProperties: 0 },
        { name: "Paths (Servers)",                      test: "tests/fixtures/full-io/3.0/paths/paths-servers.json",                        extraProperties: 0 },
        { name: "Paths (Parameters)",                   test: "tests/fixtures/full-io/3.0/paths/paths-parameters.json",                     extraProperties: 0 },
        { name: "Paths (GET+Servers)",                  test: "tests/fixtures/full-io/3.0/paths/paths-get-servers.json",                    extraProperties: 0 },
        { name: "Paths (GET+Security)",                 test: "tests/fixtures/full-io/3.0/paths/paths-get-security.json",                   extraProperties: 0 },
        { name: "Paths (GET+Parameters)",               test: "tests/fixtures/full-io/3.0/paths/paths-get-parameters.json",                 extraProperties: 0 },
        { name: "Paths (GET+RequestBody)",              test: "tests/fixtures/full-io/3.0/paths/paths-get-requestBody.json",                extraProperties: 0 },
        { name: "Paths (GET+RequestBody+Content)",      test: "tests/fixtures/full-io/3.0/paths/paths-get-requestBody-content.json",        extraProperties: 0 },
        { name: "Paths (GET+RequestBody+Examples)",     test: "tests/fixtures/full-io/3.0/paths/paths-get-requestBody.json",                extraProperties: 0 },
        { name: "Paths (GET+Responses)",                test: "tests/fixtures/full-io/3.0/paths/paths-get-responses.json",                  extraProperties: 0 },
        { name: "Paths (GET+Response+Header)",          test: "tests/fixtures/full-io/3.0/paths/paths-get-response-headers.json",           extraProperties: 0 },
        { name: "Paths (GET+Response+Content)",         test: "tests/fixtures/full-io/3.0/paths/paths-get-response-content.json",           extraProperties: 0 },
        { name: "Paths (GET+Response+Links)",           test: "tests/fixtures/full-io/3.0/paths/paths-get-response-links.json",             extraProperties: 0 },
        { name: "Paths (GET+Callbacks)",                test: "tests/fixtures/full-io/3.0/paths/paths-get-callbacks.json",                  extraProperties: 0 },
        { name: "Components (Empty)",                   test: "tests/fixtures/full-io/3.0/components/components-empty.json",                extraProperties: 0 },
        { name: "Components (Schemas)",                 test: "tests/fixtures/full-io/3.0/components/components-schemas.json",              extraProperties: 0 },
        { name: "Components (Schemas + extensions)",    test: "tests/fixtures/full-io/3.0/components/components-schemas-extensions.json",   extraProperties: 0 },
        { name: "Components (Responses)",               test: "tests/fixtures/full-io/3.0/components/components-responses.json",            extraProperties: 0 },
        { name: "Components (Parameters)",              test: "tests/fixtures/full-io/3.0/components/components-parameters.json",           extraProperties: 0 },
        { name: "Components (Examples)",                test: "tests/fixtures/full-io/3.0/components/components-examples.json",             extraProperties: 0 },
        { name: "Components (Request Bodies)",          test: "tests/fixtures/full-io/3.0/components/components-requestBodies.json",        extraProperties: 0 },
        { name: "Components (Headers)",                 test: "tests/fixtures/full-io/3.0/components/components-headers.json",              extraProperties: 0 },
        { name: "Components (Security Schemes)",        test: "tests/fixtures/full-io/3.0/components/components-securitySchemes.json",      extraProperties: 0 },
        { name: "Components (Links)",                   test: "tests/fixtures/full-io/3.0/components/components-links.json",                extraProperties: 0 },
        { name: "Components (Callbacks)",               test: "tests/fixtures/full-io/3.0/components/components-callbacks.json",            extraProperties: 0 },
        { name: "Schemas (Discriminator)",              test: "tests/fixtures/full-io/3.0/schemas/discriminator.json",                      extraProperties: 0 },
        { name: "Extra Properties",                     test: "tests/fixtures/full-io/3.0/extra-properties/extra-properties.json",          extraProperties: 3 }
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
            let document: Oas30Document = library.createDocument(json) as Oas30Document;

            // Assert the # of extra properties is right.
            let viz: ExtraPropertyDetectionVisitor = new ExtraPropertyDetectionVisitor();
            OasVisitorUtil.visitTree(document, viz);
            expect(viz.numDetected).toEqual(spec.extraProperties);

            let jsObj: any = library.writeNode(document);
            if (spec.debug) {
                console.info("------- INPUT --------\n " + JSON.stringify(json, null, 2) + "\n-------------------");
                console.info("------- ACTUAL --------\n " + JSON.stringify(jsObj, null, 2) + "\n-------------------");
            }
            expect(jsObj).toEqual(json);
        });
    });

});


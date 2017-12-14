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
import {Oas20Info} from "../src/models/2.0/info.model";
import {Oas20ResponseDefinition} from "../src/models/2.0/response.model";
import {OasLibraryUtils} from "../src/library.utils";
import {OasPathItem} from "../src/models/common/path-item.model";
import {OasOperation} from "../src/models/common/operation.model";
import {Oas30Document} from "../src/models/3.0/document.model";
import {Oas30Info} from "../src/models/3.0/info.model";

describe("Partial Read (2.0)", () => {

    let library: OasLibraryUtils;
    let document: Oas20Document;

    beforeEach(() => {
        library = new OasLibraryUtils();
        document = <Oas20Document> library.createDocument("2.0");
    });

    it("Info", () => {
        let json: any = readJSON('tests/fixtures/partial-read/2.0/info.json');
        let infoModel: Oas20Info = document.createInfo();
        library.readNode(json, infoModel);
        document.info = infoModel;

        let expectedObj: any = {
            swagger: "2.0",
            info: json
        }
        let actualObj: any = library.writeNode(document);
        expect(actualObj).toEqual(expectedObj);
    });

    it("Operation", () => {
        let json: any = readJSON('tests/fixtures/partial-read/2.0/path-get.json');
        document.paths = document.createPaths();
        let pathItem: OasPathItem = document.paths.addPathItem("/testPath", document.paths.createPathItem("/testPath"));
        let opModel: OasOperation = pathItem.createOperation("get");
        library.readNode(json, opModel);
        pathItem.get = opModel;

        let expectedObj: any = {
            swagger: "2.0",
            paths: {
                "/testPath": {
                    "get": json
                }
            }
        }
        let actualObj: any = library.writeNode(document);
        expect(actualObj).toEqual(expectedObj);
    });

    it("Response", () => {
        let json: any = readJSON('tests/fixtures/partial-read/2.0/response.json');
        document.responses = document.createResponsesDefinitions();
        let responseModel: Oas20ResponseDefinition = document.responses.addResponse("ExampleResponse", document.responses.createResponse("ExampleResponse"));
        library.readNode(json, responseModel);

        let expectedObj: any = {
            swagger: "2.0",
            responses: {
                "ExampleResponse": json
            }
        }
        let actualObj: any = library.writeNode(document);
        expect(actualObj).toEqual(expectedObj);
    });

});



describe("Partial Read (3.0)", () => {

    let library: OasLibraryUtils;
    let document: Oas30Document;

    beforeEach(() => {
        library = new OasLibraryUtils();
        document = <Oas30Document> library.createDocument("3.0.1");
    });

    it("Info", () => {
        let json: any = readJSON('tests/fixtures/partial-read/3.0/info.json');
        let infoModel: Oas30Info = document.createInfo();
        library.readNode(json, infoModel);
        document.info = infoModel;

        let expectedObj: any = {
            openapi: "3.0.1",
            info: json
        }
        let actualObj: any = library.writeNode(document);
        expect(actualObj).toEqual(expectedObj);
    });

    it("Components", () => {
        let json: any = readJSON('tests/fixtures/partial-read/3.0/components.json');
        document.components = document.createComponents();
        library.readNode(json, document.components);

        let expectedObj: any = {
            openapi: "3.0.1",
            components: json
        }
        let actualObj: any = library.writeNode(document);
        expect(actualObj).toEqual(expectedObj);
    });

});

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

describe("Partial Write (2.0)", () => {

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Info", () => {
        let json: any = readJSON('tests/fixtures/partial-write/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let expectedObj: any = json.info;
        let actualObj: any = library.writeNode(document.info);
        expect(actualObj).toEqual(expectedObj);
    });

    it("Paths", () => {
        let json: any = readJSON('tests/fixtures/partial-write/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let expectedObj: any = json.paths;
        let actualObj: any = library.writeNode(document.paths);
        expect(actualObj).toEqual(expectedObj);
    });

    it("Path Response", () => {
        let json: any = readJSON('tests/fixtures/partial-write/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let expectedObj: any = json.paths["/pet/{petId}"].get.responses["200"];
        let actualObj: any = library.writeNode(document.paths.pathItem("/pet/{petId}").get.responses.response("200"));
        expect(actualObj).toEqual(expectedObj);
    });

    it("Deleted Path", () => {
        let json: any = readJSON('tests/fixtures/partial-write/2.0/pet-store.json');
        let expected: any = readJSON('tests/fixtures/partial-write/2.0/deleted-path.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        document.paths.removePathItem("/pet/findByTags");

        let expectedObj: any = expected;
        let actualObj: any = library.writeNode(document.paths);
        expect(actualObj).toEqual(expectedObj);
    });

});



describe("Partial Write (3.0)", () => {

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Info", () => {
        let json: any = readJSON('tests/fixtures/partial-write/3.0/example.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let expectedObj: any = json.info;
        let actualObj: any = library.writeNode(document.info);
        expect(actualObj).toEqual(expectedObj);
    });

    it("Components", () => {
        let json: any = readJSON('tests/fixtures/partial-write/3.0/example.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let expectedObj: any = json.components;
        let actualObj: any = library.writeNode(document.components);
        expect(actualObj).toEqual(expectedObj);
    });

    it("Callback", () => {
        let json: any = readJSON('tests/fixtures/partial-write/3.0/example.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let expectedObj: any = json.components.callbacks["Callback1"];
        let actualObj: any = library.writeNode(document.components.callbacks["Callback1"]);
        expect(actualObj).toEqual(expectedObj);
    });

    it("Operation", () => {
        let json: any = readJSON('tests/fixtures/partial-write/3.0/example.json');
        let document: Oas30Document = <Oas30Document> library.createDocument(json);

        let expectedObj: any = json.paths["/foo"].get;
        let actualObj: any = library.writeNode(document.paths.pathItem("/foo").get);
        expect(actualObj).toEqual(expectedObj);
    });

});

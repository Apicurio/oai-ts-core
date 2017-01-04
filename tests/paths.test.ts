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
import {OasNodePath} from "../src/models/node-path";
import {OasNode} from "../src/models/node.model";

describe("Node Path (Create)", () => {

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Info", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document.info;
        let path: OasNodePath = library.createNodePath(node);

        let actual: string = path.toString();
        let expected: string = "/info";

        expect(actual).toEqual(expected);
    });

    it("Tag External Documentation", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document.tags[0].externalDocs;
        let path: OasNodePath = library.createNodePath(node);

        let actual: string = path.toString();
        let expected: string = "/tags[0]/externalDocs";

        expect(actual).toEqual(expected);
    });

    it("Path Item", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document.paths.pathItem("/pet");
        let path: OasNodePath = library.createNodePath(node);

        let actual: string = path.toString();
        let expected: string = "/paths[/pet]";

        expect(actual).toEqual(expected);
    });

    it("Path Response", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document.paths.pathItem("/pet/{petId}").get.responses.response("200");
        let path: OasNodePath = library.createNodePath(node);

        let actual: string = path.toString();
        let expected: string = "/paths[/pet/{petId}]/get/responses[200]";

        expect(actual).toEqual(expected);
    });

    it("Path Parameter Schema", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document.paths.pathItem("/user/{username}").put.parameters[1].schema;
        let path: OasNodePath = library.createNodePath(node);

        let actual: string = path.toString();
        let expected: string = "/paths[/user/{username}]/put/parameters[1]/schema";

        expect(actual).toEqual(expected);
    });

    it("Definition", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document.definitions.definition("Order");
        let path: OasNodePath = library.createNodePath(node);

        let actual: string = path.toString();
        let expected: string = "/definitions[Order]";

        expect(actual).toEqual(expected);
    });

    it("Definition Schema Property XML", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document.definitions.definition("Pet").properties["photoUrls"].xml;
        let path: OasNodePath = library.createNodePath(node);

        let actual: string = path.toString();
        let expected: string = "/definitions[Pet]/properties[photoUrls]/xml";

        expect(actual).toEqual(expected);
    });

    it("Security Scheme", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let node: OasNode = document.securityDefinitions.securityScheme("petstore_auth");
        let path: OasNodePath = library.createNodePath(node);

        let actual: string = path.toString();
        let expected: string = "/securityDefinitions[petstore_auth]";

        expect(actual).toEqual(expected);
    });

});


describe("Node Path (Resolve)", () => {

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Root", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let path: OasNodePath = new OasNodePath("/");
        let resolvedNode: OasNode = path.resolve(document);

        let expectedObj: any = json;
        let actualObj: any = library.writeNode(resolvedNode);
        expect(actualObj).toEqual(expectedObj);
    });

    it("Info", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let path: OasNodePath = new OasNodePath("/info");
        let resolvedNode: OasNode = path.resolve(document);

        let expectedObj: any = json.info;
        let actualObj: any = library.writeNode(resolvedNode);
        expect(actualObj).toEqual(expectedObj);
    });

    it("Definition Schema Property XML", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let path: OasNodePath = new OasNodePath("/definitions[Pet]/properties[photoUrls]/xml");
        let resolvedNode: OasNode = path.resolve(document);

        let expectedNode: OasNode = document.definitions.definition("Pet").properties["photoUrls"].xml;
        let actualNode: any = resolvedNode;
        expect(actualNode).toEqual(expectedNode);
    });

    it("Definition", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let path: OasNodePath = new OasNodePath("/definitions[Order]");
        let resolvedNode: OasNode = path.resolve(document);

        let expectedNode: OasNode = document.definitions.definition("Order");
        let actualNode: any = resolvedNode;
        expect(actualNode).toEqual(expectedNode);
    });

    it("Path Response", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let path: OasNodePath = new OasNodePath("/paths[/pet/{petId}]/get/responses[200]");
        let resolvedNode: OasNode = path.resolve(document);

        let expectedNode: OasNode = document.paths.pathItem("/pet/{petId}").get.responses.response("200");
        let actualNode: any = resolvedNode;
        expect(actualNode).toEqual(expectedNode);
    });

    it("Tag External Documentation", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let path: OasNodePath = new OasNodePath("/tags[0]/externalDocs");
        let resolvedNode: OasNode = path.resolve(document);

        let expectedNode: OasNode = document.tags[0].externalDocs;
        let actualNode: any = resolvedNode;
        expect(actualNode).toEqual(expectedNode);
    });

    it("Security Scheme", () => {
        let json: any = readJSON('tests/fixtures/paths/2.0/pet-store.json');
        let document: Oas20Document = <Oas20Document> library.createDocument(json);

        let path: OasNodePath = new OasNodePath("/securityDefinitions[petstore_auth]");
        let resolvedNode: OasNode = path.resolve(document);

        let expectedNode: OasNode = document.securityDefinitions.securityScheme("petstore_auth");
        let actualNode: any = resolvedNode;
        expect(actualNode).toEqual(expectedNode);
    });

});

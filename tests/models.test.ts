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
import {OasPathItem} from "../src/models/common/path-item.model";


describe("Models (2.0)", () => {

    let library: OasLibraryUtils;

    beforeEach(() => {
        library = new OasLibraryUtils();
    });

    it("Info", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/complete/pet-store.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);

        expect(library.writeNode(document.info)).toEqual({
            "description":"This is a sample server Petstore server via JSON.",
            "version":"1.0.0",
            "title":"Swagger Petstore (JSON)",
            "termsOfService":"http://helloreverb.com/terms/",
            "contact":{
                "email":"apiteam@wordnik.com"
            },
            "license":{
                "name":"Apache 2.0",
                "url":"http://www.apache.org/licenses/LICENSE-2.0.html"
            }
        });
    });

    it("Path Items", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/complete/pet-store.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);

        let pathItems: OasPathItem[] = document.paths.pathItems();
        expect(pathItems.length).toEqual(14);

        expect(pathItems[1].path()).toEqual("/pet/findByStatus");
    });


    it("Definition Schemas", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/complete/pet-store.json');
        let document: Oas20Document = <Oas20Document>library.createDocument(json);

        let definitions: Oas20SchemaDefinition[] = document.definitions.definitions();
        expect(definitions.length).toEqual(6);

        expect(definitions[2].definitionName()).toEqual("User");
        expect(definitions[4].definitionName()).toEqual("Pet");
        expect(definitions[5].definitionName()).toEqual("ApiResponse");
    });

});

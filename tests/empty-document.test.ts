///<reference path="../node_modules/@types/jasmine/index.d.ts"/>

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

describe("Empty Document Test (2.0)", () => {

    let library: OasLibraryUtils;
    let document: Oas20Document;

    beforeEach(() => {
        library = new OasLibraryUtils();
        document = <Oas20Document> library.createDocument("2.0");
    });

    it("Document not null", () => {
        expect(document).not.toBeNull();
    });

    it("Document with core meta-data", () => {
        document.host = "example.org";
        document.basePath = "/api";
        document.schemes = ["http", "https"];
        document.consumes = [ "application/xml", "application/json" ];
        document.produces = [ "application/xml", "application/json" ];

        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual({
            swagger: "2.0",
            host: "example.org",
            basePath: "/api",
            schemes: ["http", "https"],
            consumes: [ "application/xml", "application/json" ],
            produces: [ "application/xml", "application/json" ]

        });
    });

    it("Document with external docs", () => {
        document.host = "example.org";
        document.basePath = "/api";
        document.setExternalDocumentation("more info about the API", "http://example.org/docs/#api");

        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual({
            swagger: "2.0",
            host: "example.org",
            basePath: "/api",
            externalDocs: {
                description: "more info about the API",
                url: "http://example.org/docs/#api"
            }

        });
    });

    it("Document with simple info", () => {
        document.info = document.createInfo();
        document.info.title = "Document Title";
        document.info.description = "Document description.";
        document.info.version = "1.0";

        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual({
            swagger: "2.0",
            info: {
                title: "Document Title",
                description: "Document description.",
                version: "1.0"
            }
        });
    });

    it("Document with full info", () => {
        document.info = document.createInfo();
        document.info.title = "Document Title";
        document.info.description = "Document description.";
        document.info.termsOfService = "http://www.example.org/TOS";
        document.info.version = "1.0";

        document.info.contact = document.info.createContact();
        document.info.contact.name = "Contact Name";
        document.info.contact.url = "http://www.example.org/ContactUrl";
        document.info.contact.email = "contact@example.org";

        document.info.license = document.info.createLicense();
        document.info.license.name = "Apache 2.0";
        document.info.license.url = "http://www.apache.org/licenses/LICENSE-2.0";

        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual({
            swagger: "2.0",
            info: {
                title: "Document Title",
                description: "Document description.",
                termsOfService: "http://www.example.org/TOS",
                contact: {
                    name: "Contact Name",
                    url: "http://www.example.org/ContactUrl",
                    email: "contact@example.org"
                },
                license: {
                    name: "Apache 2.0",
                    url: "http://www.apache.org/licenses/LICENSE-2.0"
                },
                version: "1.0"
            }
        });
    });

    it("Document with tags", () => {
        document.info = document.createInfo();
        document.info.title = "Document Title",
        document.addTag("foo", "this is the foo tag");
        document.addTag("bar", "this is the bar tag");
        document.tags[0].setExternalDocumentation("More info about foo", "http://example.org/docs/#foo");

        let jsObj: any = library.writeNode(document);
        expect(jsObj).toEqual({
            swagger: "2.0",
            info: {
                title: "Document Title"
            },
            tags: [
                {
                    name: "foo",
                    description: "this is the foo tag",
                    externalDocs: {
                        description: "More info about foo",
                        url: "http://example.org/docs/#foo"
                    }
                },
                {
                    name: "bar",
                    description: "this is the bar tag"
                }
            ]
        });
    });

    it("Document with attributes", () => {
        document.host = "example.org";
        document.basePath = "/api";

        expect(document.n_attribute("Hello", "World")).toBeUndefined();
        expect(document.n_attribute("Hello")).toEqual("World");
        expect(document.n_attribute("foo")).toBeUndefined();
        expect(document.n_attribute("Hello", "Universe")).toEqual("World");
        expect(document.n_attribute("Hello")).toEqual("Universe");
    });

    it("Document with attributes", () => {
        document.host = "example.org";
        document.basePath = "/api";

        expect(document.n_attribute("Hello", "World")).toBeUndefined();
        expect(document.n_attribute("Hello")).toEqual("World");
        expect(document.n_attribute("foo")).toBeUndefined();
        expect(document.n_attribute("Hello", "Universe")).toEqual("World");
        expect(document.n_attribute("Hello")).toEqual("Universe");
    });

});

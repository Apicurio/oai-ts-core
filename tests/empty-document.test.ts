///<reference path="../node_modules/@types/jasmine/index.d.ts"/>

import {OasDocumentFactory} from "../src/main";
import {OasVisitorUtil} from "../src/visitors/visitor.utils";
import {Oas20Document} from "../src/models/2.0/document.model";

describe("Empty Document Test (2.0)", () => {

    let docFactory: OasDocumentFactory;
    let document: Oas20Document;

    beforeEach(() => {
        docFactory = new OasDocumentFactory();
        document = <Oas20Document> docFactory.createEmpty("2.0");
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

        let jsObj: any = OasVisitorUtil.model2js(document);
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

        let jsObj: any = OasVisitorUtil.model2js(document);
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

        let jsObj: any = OasVisitorUtil.model2js(document);
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

        let jsObj: any = OasVisitorUtil.model2js(document);
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

        let jsObj: any = OasVisitorUtil.model2js(document);
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

});

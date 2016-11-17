///<reference path="../node_modules/@types/jasmine/index.d.ts"/>

import {OasDocumentFactory} from "../src/main";
import {Oas20Document} from "../src/models/2.0/document.bean";
import {OasVisitorUtil} from "../src/visitors/visitor.utils";

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

});

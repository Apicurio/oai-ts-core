///<reference path="../node_modules/@types/jasmine/index.d.ts"/>

import {Oas20JS2ModelReader, Oas20JS2ModelReaderVisitor} from "../src/readers/js2model.reader";
import {OasDocumentFactory} from "../src/main";
import {Oas20Document} from "../src/models/2.0/document.model";
import {OasVisitorUtil} from "../src/visitors/visitor.utils";
import {Oas20Info} from "../src/models/2.0/info.model";
import {Oas20Operation} from "../src/models/2.0/operation.model";
import {Oas20PathItem} from "../src/models/2.0/path-item.model";
import {Oas20ResponseDefinition} from "../src/models/2.0/response.model";

declare var readJSON

describe("Partial Read (2.0)", () => {

    let docFactory: OasDocumentFactory;
    let document: Oas20Document;
    let docReader: Oas20JS2ModelReader;

    beforeEach(() => {
        docReader = new Oas20JS2ModelReader();
        docFactory = new OasDocumentFactory();
        document = <Oas20Document> docFactory.createEmpty("2.0");
    });

    it("Info", () => {
        let json: any = readJSON('tests/fixtures/partial-read/2.0/info.json');
        let infoModel: Oas20Info = document.createInfo();
        infoModel.accept(new Oas20JS2ModelReaderVisitor(docReader, json));
        document.info = infoModel;

        let expectedObj: any = {
            swagger: "2.0",
            info: json
        }
        let actualObj: any = OasVisitorUtil.model2js(document);
        expect(actualObj).toEqual(expectedObj);
    });

    it("Operation", () => {
        let json: any = readJSON('tests/fixtures/partial-read/2.0/path-get.json');
        document.paths = document.createPaths();
        let pathItem: Oas20PathItem = document.paths.addPathItem("/testPath", document.paths.createPathItem("/testPath"));
        let opModel: Oas20Operation = pathItem.createOperation("get");
        opModel.accept(new Oas20JS2ModelReaderVisitor(docReader, json));
        pathItem.get = opModel;

        let expectedObj: any = {
            swagger: "2.0",
            paths: {
                "/testPath": {
                    "get": json
                }
            }
        }
        let actualObj: any = OasVisitorUtil.model2js(document);
        expect(actualObj).toEqual(expectedObj);
    });

    it("Response", () => {
        let json: any = readJSON('tests/fixtures/partial-read/2.0/response.json');
        document.responses = document.createResponsesDefinitions();
        let responseModel: Oas20ResponseDefinition = document.responses.addResponse("ExampleResponse", document.responses.createResponse("ExampleResponse"));
        responseModel.accept(new Oas20JS2ModelReaderVisitor(docReader, json));

        let expectedObj: any = {
            swagger: "2.0",
            responses: {
                "ExampleResponse": json
            }
        }
        let actualObj: any = OasVisitorUtil.model2js(document);
        expect(actualObj).toEqual(expectedObj);
    });

});

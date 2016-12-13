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

describe("Partial Write (2.0)", () => {

    let docFactory: OasDocumentFactory;
    let document: Oas20Document;
    let docReader: Oas20JS2ModelReader;

    beforeEach(() => {
        docReader = new Oas20JS2ModelReader();
        docFactory = new OasDocumentFactory();
        document = <Oas20Document> docFactory.createEmpty("2.0");
    });

    it("Info", () => {
        let json: any = readJSON('tests/fixtures/partial-write/2.0/pet-store.json');
        let document: Oas20Document = docReader.read(json);

        let expectedObj: any = json.info;
        let actualObj: any = OasVisitorUtil.model2js(document.info);
        expect(actualObj).toEqual(expectedObj);
    });

    it("Paths", () => {
        let json: any = readJSON('tests/fixtures/partial-write/2.0/pet-store.json');
        let document: Oas20Document = docReader.read(json);

        let expectedObj: any = json.paths;
        let actualObj: any = OasVisitorUtil.model2js(document.paths);
        expect(actualObj).toEqual(expectedObj);
    });

    it("Path Response", () => {
        let json: any = readJSON('tests/fixtures/partial-write/2.0/pet-store.json');
        let document: Oas20Document = docReader.read(json);

        let expectedObj: any = json.paths["/pet/{petId}"].get.responses["200"];
        let actualObj: any = OasVisitorUtil.model2js(document.paths.pathItem("/pet/{petId}").get.responses.response("200"));
        expect(actualObj).toEqual(expectedObj);
    });

});

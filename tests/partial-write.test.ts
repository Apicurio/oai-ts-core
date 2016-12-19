///<reference path="../node_modules/@types/jasmine/index.d.ts"/>
///<reference path="@types/karma-read-json/index.d.ts"/>

import {Oas20Document} from "../src/models/2.0/document.model";
import {OasLibraryUtils} from "../src/library.utils";

describe("Partial Write (2.0)", () => {

    let library: OasLibraryUtils;
    let document: Oas20Document;

    beforeEach(() => {
        library = new OasLibraryUtils();
        document = <Oas20Document> library.createDocument("2.0");
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

});

///<reference path="../node_modules/@types/jasmine/index.d.ts"/>

import {OasVisitorUtil} from "../src/visitors/visitor.utils";
import {Oas20JS2ModelReader} from "../src/readers/js2model.reader";
import {Oas20Document} from "../src/models/2.0/document.model";

declare var readJSON

describe("Full I/O (2.0) - Basics", () => {

    let docReader: Oas20JS2ModelReader;

    beforeEach(() => {
        docReader = new Oas20JS2ModelReader();
    });

    it("Invalid spec version", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/invalid-version.json');
        expect(() => { docReader.read(json); }).toThrowError("Unsupported specification version: 1.1");
    });

    it("Simplest possible 2.0 spec", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simplest.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple Info object", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple-info.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Info object with extensions", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple-info-extensions.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple Tags list", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple-tags.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple External Documentation", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple-externalDocs.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple Security Definitions", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple-securityDefinitions.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple Security Requirements", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple-security.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Complete Security Definitions", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/complete-securityDefinitions.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

});


describe("Full I/O (2.0) - Paths", () => {

    let docReader: Oas20JS2ModelReader;

    beforeEach(() => {
        docReader = new Oas20JS2ModelReader();
    });

    it("Paths 001 (GET)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths-001-get.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

});
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
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple/simplest.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple Info object", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple/simple-info.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Info object with extensions", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple/simple-info-extensions.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple Tags list", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple/simple-tags.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple External Documentation", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple/simple-externalDocs.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple Security Definitions", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple/simple-securityDefinitions.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Simple Security Requirements", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/simple/simple-security.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Complete Security Definitions", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/complete/complete-securityDefinitions.json');
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

    it("Paths (GET)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-get.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (GET + Params)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-get-with-params.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Path + Params)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-path-with-params.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (All Ops)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-all-operations.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Ref)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-ref.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (External Docs)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-externalDocs.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Security)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-security.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Default Response)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-default-response.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Responses)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-responses.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Response w/ Headers)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-response-with-headers.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Response w/ Examples)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-response-with-examples.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths (Response w/ Schema)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths/paths-response-with-schema.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

});
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

    it("Paths 002 (GET + Params)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths-002-get-with-params.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths 003 (Path + Params)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths-003-path-with-params.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths 004 (All Ops)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths-004-all-operations.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths 005 (Ref)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths-005-ref.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths 006 (External Docs)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths-006-externalDocs.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths 007 (Security)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths-007-security.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths 008 (Default Response)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths-008-default-response.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths 009 (Responses)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths-009-responses.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths 010 (Response w/ Headers)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths-010-response-with-headers.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths 011 (Response w/ Examples)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths-011-response-with-examples.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

    it("Paths 012 (Response w/ Schema)", () => {
        let json: any = readJSON('tests/fixtures/full-io/2.0/paths-012-response-with-schema.json');
        let document: Oas20Document = docReader.read(json);
        let jsObj: any = OasVisitorUtil.model2js(document);
        expect(jsObj).toEqual(json);
    });

});
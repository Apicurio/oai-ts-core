import {Oas20Document} from "../models/2.0/document.model";
import {Oas20Info} from "../models/2.0/info.model";
import {Oas20Contact} from "../models/2.0/contact.model";
import {Oas20License} from "../models/2.0/license.model";
import {OasExtensibleNode} from "../models/enode.model";

/**
 * This class reads a javascript object and turns it into a OAS 2.0 model.  It is obviously
 * assumed that the javascript data actually does represent an OAS 2.0 document.
 */
export class Oas20JS2ModelReader {

    /**
     * Reads the given javascript data and returns an OAS 2.0 document.  Throws an error if
     * the root 'swagger' property is not found or if its value is not "2.0".
     * @param jsData
     */
    public read(jsData: any): Oas20Document {
        let docModel: Oas20Document = new Oas20Document();

        let swagger: string = jsData["swagger"];
        if (swagger != "2.0") {
            throw Error("Unsupported specification version: " + swagger);
        }

        let info: any = jsData["info"];
        if (info) {
            let infoModel: Oas20Info = docModel.createInfo();
            this.readInfo(info, infoModel);
            docModel.info = infoModel;
        }

        let host: string = jsData["host"];
        let basePath: string = jsData["host"];
        let schemes: string[] = jsData["host"];
        let consumes: string[] = jsData["host"];
        let produces: string[] = jsData["host"];

        if (host) { docModel.host = host; }
        if (basePath) { docModel.basePath = basePath; }
        if (schemes) { docModel.schemes = schemes; }
        if (consumes) { docModel.consumes = consumes; }
        if (produces) { docModel.produces = produces; }

        this.readExtensions(jsData, docModel);

        return docModel;
    }

    /**
     * Reads all of the extension nodes.  An extension node is characterized by a property
     * that begins with "x-".
     * @param jsData
     * @param model
     */
    public readExtensions(jsData:any, model: OasExtensibleNode): void {
        for (let key in jsData) {
            if (key.startsWith("x-")) {
                let val: any = jsData[key];
                model.addExtension(key, val);
            }
        }
    }

    /**
     * Reads a OAS 2.0 Info object from the given javascript data.
     * @param info
     * @param infoModel
     */
    private readInfo(info: any, infoModel: Oas20Info): void {
        let title: string = info["title"];
        let description: string = info["description"];
        let termsOfService: string = info["termsOfService"];
        let contact: Oas20Contact = info["contact"];
        let license: Oas20License = info["license"];
        let version: string = info["version"];

        if (title) { infoModel.title = title; }
        if (description) { infoModel.description = description; }
        if (termsOfService) { infoModel.termsOfService = termsOfService; }
        if (contact) {
            let contactModel: Oas20Contact = infoModel.createContact();
            this.readContact(contact, contactModel);
            infoModel.contact = contactModel;
        }
        if (license) {
            let licenseModel: Oas20License = infoModel.createLicense();
            this.readLicense(license, licenseModel);
            infoModel.license = licenseModel;
        }
        if (version) { infoModel.version = version; }

        this.readExtensions(info, infoModel);
    }

    /**
     * Reads a OAS 2.0 Contact object from the given javascript data.
     * @param info
     * @param infoModel
     */
    private readContact(contact: any, contactModel: Oas20Contact): void {
        let name: string = contact["name"];
        let url: string = contact["url"];
        let email: string = contact["email"];

        if (name) { contactModel.name = name; }
        if (url) { contactModel.url = url; }
        if (email) { contactModel.email = email; }

        this.readExtensions(contact, contactModel);
    }

    /**
     * Reads a OAS 2.0 License object from the given javascript data.
     * @param info
     * @param infoModel
     */
    private readLicense(license: any, licenseModel: Oas20License): void {
        let name: string = license["name"];
        let url: string = license["url"];

        if (name) { licenseModel.name = name; }
        if (url) { licenseModel.url = url; }

        this.readExtensions(license, licenseModel);
    }
}

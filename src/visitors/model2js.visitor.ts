
import {IOas20NodeVisitor} from "./visitor.iface";
import {Oas20Document} from "../models/2.0/document.bean";
import {Oas20Info} from "../models/2.0/info.bean";
import {Oas20Contact} from "../models/2.0/contact.bean";
import {Oas20License} from "../models/2.0/license.bean";
import {OasExtension} from "../models/extension.bean";

export class Oas20ModelToJSVisitor implements IOas20NodeVisitor {

    private result: any;
    private currentObj: any;

    /**
     * Returns the result that was built up during the visit of the model.
     * @return {any}
     */
    public getResult(): any {
        return this.removeNullProperties(this.result);
    }

    /**
     * Removes any property with a null value from the js object.  This is done recursively.
     * @param object
     */
    private removeNullProperties(object: any): any {
        if (object instanceof Array) {
            for (let item of <Array<any>> object) {
                this.removeNullProperties(item);
            }
        } else if (object instanceof Object) {
            for (let key in <Object> object) {
                if (object[key] == null) {
                    delete object[key];
                } else {
                    this.removeNullProperties(object[key]);
                }
            }
        }
        return object;
    }

    /**
     * Visits a node.
     * @param node
     */
    visitDocument(node: Oas20Document) {
        let root: any = {
            swagger: node.swagger,
            info: null,
            host: node.host,
            basePath: node.basePath,
            schemes: node.schemes,
            consumes: node.consumes,
            produces: node.produces
        };
        this.result = root;
        this.currentObj = root;
    }

    /**
     * Visits a node.
     * @param node
     */
    visitInfo(node: Oas20Info) {
        let info: any = {
            title: node.title,
            description: node.description,
            termsOfService: node.termsOfService,
            contact: null,
            license: null,
            version: node.version
        };
        this.result.info = info;
        this.currentObj = info;
    }

    /**
     * Visits a node.
     * @param node
     */
    visitContact(node: Oas20Contact) {
        let contact: any = {
            name: node.name,
            url: node.url,
            email: node.email
        };
        this.result.info.contact = contact;
        this.currentObj = contact;
    }

    /**
     * Visits a node.
     * @param node
     */
    visitLicense(node: Oas20License) {
        let license: any = {
            name: node.name,
            url: node.url,
        };
        this.result.info.license = license;
        this.currentObj = license;
    }

    /**
     * Visits a node.
     * @param node
     */
    visitExtension(node: OasExtension) {
        this.currentObj[node.name] = node.value;
    }

}
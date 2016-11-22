import {IOas20NodeVisitor} from "./visitor.iface";
import {Oas20Document} from "../models/2.0/document.model";
import {Oas20Info} from "../models/2.0/info.model";
import {Oas20Contact} from "../models/2.0/contact.model";
import {Oas20License} from "../models/2.0/license.model";
import {OasExtension} from "../models/extension.model";
import {Oas20Paths} from "../models/2.0/paths.model";
import {Oas20PathItem} from "../models/2.0/path-item.model";
import {Oas20Operation} from "../models/2.0/operation.model";
import {Oas20Parameter} from "../models/2.0/parameter.model";
import {Oas20Reference} from "../models/2.0/reference.model";
import {Oas20ExternalDocumentation} from "../models/2.0/external-documentation.model";
import {Oas20SecurityRequirement} from "../models/2.0/security-requirement.model";
import {Oas20Responses} from "../models/2.0/responses.model";
import {Oas20Response} from "../models/2.0/response.model";
import {Oas20Schema} from "../models/2.0/schema.model";
import {Oas20Headers} from "../models/2.0/headers.model";
import {Oas20Header} from "../models/2.0/header.model";
import {Oas20Example} from "../models/2.0/example.model";
import {Oas20Items} from "../models/2.0/items.model";
import {OasExtensibleNode} from "../models/enode.model";

export class Oas20ModelToJSVisitor implements IOas20NodeVisitor {

    private result: any;

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
     * Adds extensions to the js object.
     * @param node
     * @param json
     */
    private addExtensions(node: OasExtensibleNode, json: any) {
        if (node.extensions()) {
            for (let ext of node.extensions()) {
                json[ext.name] = ext.value;
            }
        }
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitDocument(node: Oas20Document): void {
        let root: any = {
            swagger: node.swagger,
            info: null,
            host: node.host,
            basePath: node.basePath,
            schemes: node.schemes,
            consumes: node.consumes,
            produces: node.produces
        };
        this.addExtensions(node, root);
        this.result = root;
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitInfo(node: Oas20Info): void {
        let info: any = {
            title: node.title,
            description: node.description,
            termsOfService: node.termsOfService,
            contact: null,
            license: null,
            version: node.version
        };
        this.addExtensions(node, info);
        this.result.info = info;
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitContact(node: Oas20Contact): void {
        let contact: any = {
            name: node.name,
            url: node.url,
            email: node.email
        };
        this.addExtensions(node, contact);
        this.result.info.contact = contact;
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitLicense(node: Oas20License): void {
        let license: any = {
            name: node.name,
            url: node.url,
        };
        this.addExtensions(node, license);
        this.result.info.license = license;
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitExtension(node: OasExtension): void {
        // this is done via a call from each of the visit methods to avoid needing context here
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitPaths(node: Oas20Paths): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitPathItem(node: Oas20PathItem): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitOperation(node: Oas20Operation): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitParameter(oas20Parameter: Oas20Parameter): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitReference(oas20Reference: Oas20Reference): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitExternalDocumentation(oas20ExternalDocumentation: Oas20ExternalDocumentation): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitSecurityRequirement(oas20SecurityRequirement: Oas20SecurityRequirement): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitResponses(oas20Responses: Oas20Responses): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitResponse(oas20Response: Oas20Response): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitSchema(oas20Schema: Oas20Schema): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitHeaders(oas20Headers: Oas20Headers): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitHeader(oas20Header: Oas20Header): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitExample(oas20Example: Oas20Example): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitItems(oas20Items: Oas20Items): void {
    }
}
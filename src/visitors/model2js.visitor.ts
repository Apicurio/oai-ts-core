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
import {Oas20Tag} from "../models/2.0/tag.model";
import {OasNode} from "../models/node.model";
import {Oas20SecurityDefinitions} from "../models/2.0/security-definitions.model";
import {Oas20SecurityScheme} from "../models/2.0/security-scheme.model";
import {Oas20Scopes} from "../models/2.0/scopes.model";

export class Oas20ModelToJSVisitor implements IOas20NodeVisitor {

    private result: any;
    private _modelIdToJS: any = <any>{};

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
    public visitDocument(node: Oas20Document): void {
        let root: any = {
            swagger: node.swagger,
            info: null,
            host: node.host,
            basePath: node.basePath,
            schemes: node.schemes,
            consumes: node.consumes,
            produces: node.produces,
            paths: null,
            security: null,
            tags: null,
            externalDocs: null
        };
        this.updateIndex(node, root);
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
        this.result.info = info;
        this.updateIndex(node, info);
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
        this.result.info.contact = contact;
        this.updateIndex(node, contact);
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
        this.result.info.license = license;
        this.updateIndex(node, license);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitExtension(node: OasExtension): void {
        let jsObject: any = this.lookup(node.parent().modelId());
        jsObject[node.name] = node.value;
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitPaths(node: Oas20Paths): void {
        let paths: any = null;
        if ((node.pathItemNames() && node.pathItemNames().length > 0) ||
            (node.extensions() && node.extensions().length > 0) )
        {
            paths = <any>{};
        }
        this.result.paths = paths;
        this.updateIndex(node, paths);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitPathItem(node: Oas20PathItem): void {
        let parentJS: any = this.lookup(node.parent().modelId());
        let pathItem: any = {
            "$ref" : node.$ref,
            "get" : null,
            "put" : null,
            "post" : null,
            "delete" : null,
            "options" : null,
            "head" : null,
            "patch" : null,
            "parameters" : null
        }
        parentJS[node.path()] = pathItem;
        this.updateIndex(node, pathItem);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitOperation(node: Oas20Operation): void {
        let parentJS: any = this.lookup(node.parent().modelId());
        let operation: any = {
            "tags" : node.tags,
            "summary" : node.summary,
            "description" : node.description,
            "externalDocs" : null,
            "operationId" : node.operationId,
            "consumes" : node.consumes,
            "produces" : node.produces,
            "parameters" : null,
            "responses" : null,
            "schemes" : node.schemes,
            "deprecated" : node.deprecated,
            "security" : null
        }
        parentJS[node.method()] = operation;
        this.updateIndex(node, operation);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitParameter(node: Oas20Parameter): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitReference(node: Oas20Reference): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitExternalDocumentation(node: Oas20ExternalDocumentation): void {
        let parentJS: any = this.lookup(node.parent().modelId());
        parentJS.externalDocs = {
            description: node.description,
            url: node.url
        }
        this.updateIndex(node, parentJS.externalDocs);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitSecurityRequirement(node: Oas20SecurityRequirement): void {
        let parentJS: any = this.lookup(node.parent().modelId());
        let securityRequirements: any[] = parentJS["security"];
        if (!securityRequirements) {
            securityRequirements = [];
            parentJS.security = securityRequirements;
        }
        let securityReq: any = <any>{};
        for (let name of node.securityRequirementNames()) {
            securityReq[name] = node.scopes(name);
        }
        securityRequirements.push(securityReq);
        this.updateIndex(node, securityReq);
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitResponses(node: Oas20Responses): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitResponse(node: Oas20Response): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitSchema(node: Oas20Schema): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitHeaders(node: Oas20Headers): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitHeader(node: Oas20Header): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitExample(node: Oas20Example): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitItems(node: Oas20Items): void {
    }

    /**
     * Visits a node.
     * @param node
     */
    public visitTag(node: Oas20Tag): void {
        if (!this.result.tags) {
            this.result.tags = [];
        }
        let tag: any = {
            name: node.name,
            description: node.description,
            externalDocs: null
        };
        this.result.tags.push(tag);
        this.updateIndex(node, tag);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {
        let parent: any = this.lookup(node.parent().modelId());
        let secDefs: any = <any>{};
        for (let name in node.securitySchemeNames()) {
            secDefs[name] = null;
        }
        parent.securityDefinitions = secDefs;
        this.updateIndex(node, secDefs);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitSecurityScheme(node: Oas20SecurityScheme): void {
        let parent: any = this.lookup(node.parent().modelId());
        let scheme: any = {
            type: node.type,
            description: node.description,
            name: node.name,
            in: node.in,
            flow: node.flow,
            authorizationUrl: node.authorizationUrl,
            tokenUrl: node.tokenUrl,
            scopes: null
        };
        parent[node.schemeName()] = scheme;
        this.updateIndex(node, scheme);
    }

    /**
     * Visits a node.
     * @param node
     */
    visitScopes(node: Oas20Scopes): void {
        let parent: any = this.lookup(node.parent().modelId());
        let scopes: any = <any>{};
        for (let scope of node.scopes()) {
            let desc: string = node.getScopeDescription(scope);
            scopes[scope] = desc;
        }
        parent.scopes = scopes;
        this.updateIndex(node, scopes);
    }

    /**
     * Indexes the javascript object by the ModelId of the model it was created from.  This allows
     * quick lookup (mapping) from the model to the JS object.
     * @param node
     * @param jsObject
     */
    private updateIndex(node: OasNode, jsObject: any) {
        this._modelIdToJS[node.modelId()] = jsObject;
    }

    /**
     * Lookup a JS object from the ID of the model it came from.
     * @param modelId
     * @return {any}
     */
    private lookup(modelId: number): any {
        let rval: any = this._modelIdToJS[modelId];
        return rval;
    }
}
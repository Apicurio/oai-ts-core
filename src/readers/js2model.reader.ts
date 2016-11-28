import {Oas20Document} from "../models/2.0/document.model";
import {Oas20Info} from "../models/2.0/info.model";
import {Oas20Contact} from "../models/2.0/contact.model";
import {Oas20License} from "../models/2.0/license.model";
import {OasExtensibleNode} from "../models/enode.model";
import {Oas20Tag} from "../models/2.0/tag.model";
import {Oas20ExternalDocumentation} from "../models/2.0/external-documentation.model";
import {Oas20SecurityRequirement} from "../models/2.0/security-requirement.model";
import {Oas20SecurityDefinitions} from "../models/2.0/security-definitions.model";
import {Oas20SecurityScheme} from "../models/2.0/security-scheme.model";
import {Oas20Scopes} from "../models/2.0/scopes.model";
import {Oas20PathItem} from "../models/2.0/path-item.model";
import {Oas20Paths} from "../models/2.0/paths.model";
import {Oas20Operation} from "../models/2.0/operation.model";

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
        let host: string = jsData["host"];
        let basePath: string = jsData["basePath"];
        let schemes: string[] = jsData["schemes"];
        let consumes: string[] = jsData["consumes"];
        let produces: string[] = jsData["produces"];
        let paths: any = jsData["paths"];
        // let definitions: any = jsData["definitions"];
        // let parameters: any = jsData["parameters"];
        // let responses: any = jsData["responses"];
        let securityDefinitions: any[] = jsData["securityDefinitions"];
        let security: any[] = jsData["security"];
        let tags: any = jsData["tags"];
        let externalDocs: any = jsData["externalDocs"];

        if (info) {
            let infoModel: Oas20Info = docModel.createInfo();
            this.readInfo(info, infoModel);
            docModel.info = infoModel;
        }
        if (host) { docModel.host = host; }
        if (basePath) { docModel.basePath = basePath; }
        if (schemes) { docModel.schemes = schemes; }
        if (consumes) { docModel.consumes = consumes; }
        if (produces) { docModel.produces = produces; }
        if (paths) {
            let pathsModel: Oas20Paths = docModel.createPaths();
            this.readPaths(paths, pathsModel);
            docModel.paths = pathsModel;
        }
        if (securityDefinitions) {
            let securityDefinitionsModel: Oas20SecurityDefinitions = docModel.createSecurityDefinitions();
            this.readSecurityDefinitions(securityDefinitions, securityDefinitionsModel);
            docModel.securityDefinitions = securityDefinitionsModel;
        }
        if (security) {
            let securityModels: Oas20SecurityRequirement[] = [];
            for (let sec of security) {
                let secModel: Oas20SecurityRequirement = docModel.createSecurityRequirement();
                this.readSecurityRequirement(sec, secModel);
                securityModels.push(secModel);
            }
            docModel.security = securityModels;
        }
        if (tags) {
            let tagModels: Oas20Tag[] = [];
            for (let tag of tags) {
                let tagModel: Oas20Tag = docModel.createTag();
                this.readTag(tag, tagModel);
                tagModels.push(tagModel);
            }
            docModel.tags = tagModels;
        }
        if (externalDocs) {
            let externalDocsModel: Oas20ExternalDocumentation = docModel.createExternalDocumentation();
            this.readExternalDocumentation(externalDocs, externalDocsModel);
            docModel.externalDocs = externalDocsModel;
        }

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

    /**
     * Reads a OAS 2.0 Tag object from the given javascript data.
     * @param tag
     * @param tagModel
     */
    private readTag(tag: any, tagModel: Oas20Tag): void {
        let name: string = tag["name"];
        let description: string = tag["description"];
        let externalDocs: any = tag["externalDocs"];

        if (name) { tagModel.name = name; }
        if (description) { tagModel.description = description; }
        if (externalDocs) {
            let externalDocsModel: Oas20ExternalDocumentation = tagModel.createExternalDocumentation();
            this.readExternalDocumentation(externalDocs, externalDocsModel);
            tagModel.externalDocs = externalDocsModel;
        }

        this.readExtensions(tag, tagModel);
    }

    /**
     * Reads an OAS 2.0 External Documentation object from the given javascript data.
     * @param externalDocs
     * @param externalDocsModel
     */
    private readExternalDocumentation(externalDocs: any, externalDocsModel: Oas20ExternalDocumentation): void {
        let description: string = externalDocs["description"];
        let url: any = externalDocs["url"];

        if (description) { externalDocsModel.description = description; }
        if (url) { externalDocsModel.url = url; }

        this.readExtensions(externalDocs, externalDocsModel);
    }

    /**
     * Reads an OAS 2.0 Security Requirement object from the given javascript data.
     * @param sec
     * @param secModel
     */
    private readSecurityRequirement(sec: any, secModel: Oas20SecurityRequirement): void {
        for (let name in sec) {
            secModel.addSecurityRequirementItem(name, sec[name]);
        }
    }

    /**
     * Reads an OAS 2.0 Security Definitions object from the given javascript data.
     * @param securityDefinitions
     * @param securityDefinitionsModel
     */
    private readSecurityDefinitions(securityDefinitions: any[], securityDefinitionsModel: Oas20SecurityDefinitions): void {
        for (let name in securityDefinitions) {
            let scheme: any = securityDefinitions[name];
            let schemeModel: Oas20SecurityScheme = securityDefinitionsModel.createSecurityScheme(name);
            this.readSecurityScheme(scheme, schemeModel);
        }
    }

    /**
     * Reads an OAS 2.0 Security Schema object from the given javascript data.
     * @param scheme
     * @param schemeModel
     */
    private readSecurityScheme(scheme: any, schemeModel: Oas20SecurityScheme): void {
        let type: string = scheme["type"];
        let description: string = scheme["description"];
        let name: string = scheme["name"];
        let _in: string = scheme["in"];
        let flow: string = scheme["flow"];
        let authorizationUrl: string = scheme["authorizationUrl"];
        let tokenUrl: string = scheme["tokenUrl"];
        let scopes: any = scheme["scopes"];

        if (type) { schemeModel.type = type; }
        if (description) { schemeModel.description = description; }
        if (name) { schemeModel.name = name; }
        if (_in) { schemeModel.in = _in; }
        if (flow) { schemeModel.flow = flow; }
        if (authorizationUrl) { schemeModel.authorizationUrl = authorizationUrl; }
        if (tokenUrl) { schemeModel.tokenUrl = tokenUrl; }
        if (scopes) {
            let scopesModel: Oas20Scopes = schemeModel.createScopes();
            this.readScopes(scopes, scopesModel);
            schemeModel.scopes = scopesModel;
        }

        this.readExtensions(scheme, schemeModel);
    }

    /**
     * Reads an OAS 2.0 Scopes object from the given javascript data.
     * @param scopes
     * @param scopesModel
     */
    private readScopes(scopes: any, scopesModel: Oas20Scopes): void {
        for (let scope in scopes) {
            let description: string = scopes[scope];
            scopesModel.addScope(scope, description);
        }
        this.readExtensions(scopes, scopesModel);
    }

    /**
     * Reads an OAS 2.0 Paths object from the given JS data.
     * @param paths
     * @param pathsModel
     */
    private readPaths(paths: any, pathsModel: Oas20Paths): void {
        for (let path in paths) {
            let pathItem: any = paths[path];
            let pathItemModel: Oas20PathItem = pathsModel.createPathItem(path);
            this.readPathItem(pathItem, pathItemModel);
            pathsModel.addPathItem(path, pathItemModel);
        }
        this.readExtensions(paths, pathsModel);
    }

    /**
     * Reads an OAS 2.0 PathItem object from the given JS data.
     * @param pathItem
     * @param pathItemModel
     */
    private readPathItem(pathItem: any, pathItemModel: Oas20PathItem): void {
        let $ref: string = pathItem["$ref"];
        let get: any = pathItem["get"];
        let put: any = pathItem["put"];
        let post: any = pathItem["post"];
        let _delete: any = pathItem["delete"];
        let options: any = pathItem["options"];
        let head: any = pathItem["head"];
        let patch: any = pathItem["patch"];
        let parameters: any[] = pathItem["parameters"];

        if ($ref) { pathItemModel.$ref = $ref; }
        if (get) {
            let opModel: Oas20Operation = pathItemModel.createOperation("get");
            this.readOperation(get, opModel);
            pathItemModel.get = opModel;
        }
        if (put) {
            let opModel: Oas20Operation = pathItemModel.createOperation("put");
            this.readOperation(put, opModel);
            pathItemModel.put = opModel;
        }
        if (post) {
            let opModel: Oas20Operation = pathItemModel.createOperation("post");
            this.readOperation(post, opModel);
            pathItemModel.post = opModel;
        }
        if (_delete) {
            let opModel: Oas20Operation = pathItemModel.createOperation("delete");
            this.readOperation(_delete, opModel);
            pathItemModel.delete = opModel;
        }
        if (options) {
            let opModel: Oas20Operation = pathItemModel.createOperation("options");
            this.readOperation(options, opModel);
            pathItemModel.options = opModel;
        }
        if (head) {
            let opModel: Oas20Operation = pathItemModel.createOperation("head");
            this.readOperation(head, opModel);
            pathItemModel.head = opModel;
        }
        if (patch) {
            let opModel: Oas20Operation = pathItemModel.createOperation("patch");
            this.readOperation(patch, opModel);
            pathItemModel.patch = opModel;
        }
        if (parameters) {
            // TODO read the parameters here!
        }

        this.readExtensions(pathItem, pathItemModel);
    }

    /**
     * Reads an OAS 2.0 Operation object from the given JS data.
     * @param operation
     * @param operationModel
     */
    private readOperation(operation: any, operationModel: Oas20Operation): void {
        let tags: string[] = operation["tags"];
        let summary: string = operation["summary"];
        let description: string = operation["description"];
        let externalDocs: Oas20ExternalDocumentation = operation["externalDocs"];
        let operationId: string = operation["operationId"];
        let consumes: string[] = operation["consumes"];
        let produces: string[] = operation["produces"];
        let parameters: any[] = operation["parameters"];
        let responses: any = operation["responses"];
        let schemes: string[] = operation["schemes"];
        let deprecated: boolean = operation["deprecated"];
        let security: any[] = operation["security"];

        if (tags) { operationModel.tags = tags; }
        if (summary) { operationModel.summary = summary; }
        if (description) { operationModel.description = description; }
        if (externalDocs) { operationModel.externalDocs = externalDocs; }
        if (operationId) { operationModel.operationId = operationId; }
        if (consumes) { operationModel.consumes = consumes; }
        if (produces) { operationModel.produces = produces; }
        if (parameters) {
            // TODO read the params here
        }
        if (responses) {
            // TODO read the responses here
        }
        if (schemes) { operationModel.schemes = schemes; }
        if (deprecated) { operationModel.deprecated = deprecated; }
        if (security) {
            // TODO read the security here
        }

        this.readExtensions(operation, operationModel);
    }
}

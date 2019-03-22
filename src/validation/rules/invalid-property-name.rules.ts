/**
 * @license
 * Copyright 2019 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Oas20ParameterDefinition} from "../../models/2.0/parameter.model";
import {Oas20Response, Oas20ResponseDefinition} from "../../models/2.0/response.model";
import {Oas20SecurityScheme} from "../../models/2.0/security-scheme.model";
import {Oas20SchemaDefinition} from "../../models/2.0/schema.model";
import {Oas20Example} from "../../models/2.0/example.model";
import {Oas20Scopes} from "../../models/2.0/scopes.model";
import {Oas20Document} from "../../models/2.0/document.model";
import {Oas20Operation} from "../../models/2.0/operation.model";
import {OasValidationRuleUtil, PathSegment} from "../validation"
import {OasPathItem} from "../../models/common/path-item.model";
import {Oas30Response, Oas30ResponseDefinition} from "../../models/3.0/response.model";
import {OasValidationRule} from "./common.rule";
import {Oas30Schema, Oas30SchemaDefinition} from "../../models/3.0/schema.model";
import {Oas30ParameterDefinition} from "../../models/3.0/parameter.model";
import {Oas30PathItem} from "../../models/3.0/path-item.model";
import {Oas30ExampleDefinition} from "../../models/3.0/example.model";
import {Oas30RequestBodyDefinition} from "../../models/3.0/request-body.model";
import {Oas30HeaderDefinition} from "../../models/3.0/header.model";
import {Oas30LinkDefinition} from "../../models/3.0/link.model";
import {Oas30CallbackDefinition} from "../../models/3.0/callback.model";
import {Oas30Encoding} from "../../models/3.0/encoding.model";
import {Oas30MediaType} from "../../models/3.0/media-type.model";


/**
 * Base class for all Invalid Property Name rules.
 */
export abstract class OasInvalidPropertyNameRule extends OasValidationRule {

    /**
     * Returns true if the definition name is valid.
     * @param name
     * @return {boolean}
     */
    protected isValidDefinitionName(name: string): boolean {
        // TODO should this be different for OAS 2.0 vs. 3.x??  Only 3.x dictates the format to some extent (I think).
        let definitionNamePattern: RegExp = /^[a-zA-Z0-9\.\-_]+$/;
        return definitionNamePattern.test(name);
    }

    /**
     * Returns true if the scope name is valid.
     * @param scope
     */
    protected isValidScopeName(scope: string): boolean {
        // TODO implement some reasonable rules for this
        return true;
    }

    /**
     * Finds all occurences of path segments that are empty.
     * i.e. they neither have a prefix nor a path variable within curly braces.
     *
     * @param pathSegments
     * @return {PathSegment[]}
     */
    protected findEmptySegmentsInPath(pathSegments: PathSegment[]): PathSegment[] {
        return pathSegments.filter(pathSegment => {
            return pathSegment.prefix === "" && pathSegment.formalName === undefined;
        });
    }

    /**
     * Finds path segments that are duplicates i.e. they have the same formal name used across multiple segments.
     * For example, in a path like /prefix/{var1}/{var1}, var1 is used in multiple segments.
     *
     * @param pathSegments
     * @return {PathSegment[]}
     */
    protected findDuplicateParametersInPath(pathSegments: PathSegment[]): string[] {
        const uniq: any = pathSegments
            .filter(pathSegment => {
                return pathSegment.formalName !== undefined;
            })
            .map(pathSegment => {
                return { parameter: pathSegment.formalName, count: 1 };
            })
            .reduce((parameterCounts, segmentEntry) => {
                parameterCounts[segmentEntry.parameter] = (parameterCounts[segmentEntry.parameter] || 0) + segmentEntry.count;
                return parameterCounts;
            }, {});
        return Object.keys(uniq).filter(a => uniq[a] > 1);
    }

}


/**
 * Implements the Empty Path Segment Rule.
 */
export class OasEmptyPathSegmentRule extends OasInvalidPropertyNameRule {

    public visitPathItem(node: OasPathItem): void {
        const pathTemplate: string = node.path();
        let pathSegments: PathSegment[];
        if (this.isPathWellFormed(pathTemplate) === true) {
            pathSegments = this.getPathSegments(pathTemplate);
            const emptySegments = this.findEmptySegmentsInPath(pathSegments);
            if (emptySegments.length > 0) {
                this.reportPathError(node, {
                    path: node.path()
                });
            }
        }
    }

}

/**
 * Implements the Duplicate Path Segment Rule.
 */
export class OasDuplicatePathSegmentRule extends OasInvalidPropertyNameRule {

    public visitPathItem(node: OasPathItem): void {
        const pathTemplate: string = node.path();
        let pathSegments: PathSegment[];
        if (this.isPathWellFormed(pathTemplate) === true) {
            pathSegments = this.getPathSegments(pathTemplate);
            const duplicateParameters: string[] = this.findDuplicateParametersInPath(pathSegments);
            if (duplicateParameters.length > 0) {
                this.reportPathError(node, {
                    path: node.path(),
                    duplicates: duplicateParameters.join(", ")
                });
            }
        }
    }

}

/**
 * Implements the Invalid Path Segment Rule.
 */
export class OasInvalidPathSegmentRule extends OasInvalidPropertyNameRule {

    public visitPathItem(node: OasPathItem): void {
        const pathTemplate: string = node.path();
        if (!this.isPathWellFormed(pathTemplate) === true) {
            this.reportPathError(node, {
                path: node.path()
            });
        }
    }

}


/**
 * Implements the Identical Path Template Rule.
 */
type IdenticalPathRecord = {
    identicalReported: boolean,
    pathSegments: PathSegment[],
    node: Oas30PathItem,
};
export class OasIdenticalPathTemplateRule extends OasInvalidPropertyNameRule {
    private indexedPathTemplates: any = {};

    /**
     * Utility function to find other paths that are semantically similar to the path that is being checked against.
     * Two paths that differ only in formal parameter name are considered identical.
     * For example, paths /test/{var1} and /test/{var2} are identical.
     * See OAS 3 Specification's Path Templates section for more details.
     *
     * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#path-templating-matching
     *
     * @param pathToCheck
     * @param pathIndex
     */
    private findIdenticalPaths(pathToCheck: string, pathIndex: any): string[] {
        const identicalPaths: string[] = [];
        const pathSegments: PathSegment[] = pathIndex[pathToCheck].pathSegments;
        Object.keys(pathIndex)
            .filter(checkAgainst => checkAgainst !== pathToCheck)
            .forEach(checkAgainst => {
                let segmentsIdential: boolean = true;
                const pathSegmentsToCheckAgainst: PathSegment[] = pathIndex[checkAgainst].pathSegments;
                if (pathSegments.length !== pathSegmentsToCheckAgainst.length) {
                    segmentsIdential = false;
                } else {
                    pathSegments.forEach((pathSegment, index) => {
                        segmentsIdential =
                            segmentsIdential && this.isSegmentIdentical(pathSegment, pathSegmentsToCheckAgainst[index]);
                    });
                }
                if (segmentsIdential === true) {
                    identicalPaths.push(checkAgainst);
                }
            });
        return identicalPaths;
    }

    /**
     * Utility function to test the equality of two path segments.
     * Segments are considered equal if they have same prefixes (if any) and same "normalized name".
     *
     * @param segment1
     * @param segment2
     * @return {boolean}
     */
    private isSegmentIdentical(segment1: PathSegment, segment2: PathSegment): boolean {
        if (segment1.prefix === segment2.prefix) {
            if (segment1.normalizedName === undefined && segment2.normalizedName === undefined) {
                return true;
            }
            if (
                (segment1.normalizedName === undefined && segment2.normalizedName !== undefined) ||
                (segment1.normalizedName !== undefined && segment2.normalizedName === undefined)
            ) {
                return false;
            }
            return segment1.normalizedName === segment2.normalizedName;
        }
        return false;
    }

    public visitPathItem(node: Oas30PathItem): void {
        const pathTemplate: string = node.path();
        if (this.isPathWellFormed(pathTemplate)) {
            let pathSegments: PathSegment[] = this.getPathSegments(pathTemplate);
            const currentPathRecord: IdenticalPathRecord = {
                identicalReported: false,
                pathSegments,
                node,
            };
            this.indexedPathTemplates[pathTemplate] = currentPathRecord;
            const identicalPaths: string[] = this.findIdenticalPaths(pathTemplate, this.indexedPathTemplates);
            if (identicalPaths.length > 0) {
                this.reportPathError(node, {path: node.path()});
                currentPathRecord.identicalReported = true;
                identicalPaths.forEach(path => {
                    const identicalPathRecord: IdenticalPathRecord = this.indexedPathTemplates[path];
                    if (identicalPathRecord.identicalReported === false) {
                        this.reportPathError(identicalPathRecord.node, {path: node.path()});
                        identicalPathRecord.identicalReported = true;
                    }
                });
            }
        }
    }

}

/**
 * Implements the Invalid Http Response Code Rule.
 */
export class OasInvalidHttpResponseCodeRule extends OasInvalidPropertyNameRule {

    public visitResponse(node: Oas20Response | Oas30Response): void {
        // The "default" response will have a statusCode of "null"
        if (this.hasValue(node.statusCode())) {
            this.reportIfInvalid(OasValidationRuleUtil.isValidHttpCode(node.statusCode()), node, "statusCode", {
                statusCode: node.statusCode()
            });
        }
    }

}

/**
 * Implements the Unmatched Example Type Rule.
 */
export class OasUnmatchedExampleTypeRule extends OasInvalidPropertyNameRule {

    public visitExample(node: Oas20Example): void {
        let produces: string[] = (node.ownerDocument() as Oas20Document).produces;
        let operation: Oas20Operation = node.parent().parent().parent() as Oas20Operation;
        if (this.hasValue(operation.produces)) {
            produces = operation.produces;
        }
        if (!this.hasValue(produces)) {
            produces = [];
        }

        let ctypes: string[] = node.exampleContentTypes();
        ctypes.forEach( ct => {
            this.reportIfInvalid(produces.indexOf(ct) !== -1, node, "produces", {
                contentType: ct
            });
        });
    }

}

/**
 * Implements the Invalid Schema Definition Name Rule.
 */
export class OasInvalidSchemaDefNameRule extends OasInvalidPropertyNameRule {

    public visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
        if (node.ownerDocument().is2xDocument()) {
            this.reportIfInvalid(this.isValidDefinitionName((<Oas20SchemaDefinition>node).definitionName()), node, "definitionName");
        } else {
            this.reportIfInvalid(this.isValidDefinitionName((<Oas30SchemaDefinition>node).name()), node, "name");
        }
    }

}

/**
 * Implements the Invalid Parameter Definition Name Rule.
 */
export class OasInvalidParameterDefNameRule extends OasInvalidPropertyNameRule {

    public visitParameterDefinition(node: Oas20ParameterDefinition | Oas30ParameterDefinition): void {
        this.reportIfInvalid(this.isValidDefinitionName(node.parameterName()), node, "parameterName");
    }

}

/**
 * Implements the Invalid Response Definition Name Rule.
 */
export class OasInvalidResponseDefNameRule extends OasInvalidPropertyNameRule {

    public visitResponseDefinition(node: Oas20ResponseDefinition | Oas30ResponseDefinition): void {
        this.reportIfInvalid(this.isValidDefinitionName(node.name()), node, "name");
    }

}

/**
 * Implements the Invalid Scope Name Rule.
 */
export class OasInvalidScopeNameRule extends OasInvalidPropertyNameRule {

    public visitScopes(node: Oas20Scopes): void {
        node.scopes().forEach( scope => {
            this.reportIfInvalid(this.isValidScopeName(scope), node, "scopes", {
                scope: scope
            });
        })
    }

}

/**
 * Implements the Invalid Security Scheme Name Rule.
 */
export class OasInvalidSecuritySchemeNameRule extends OasInvalidPropertyNameRule {

    public visitSecurityScheme(node: Oas20SecurityScheme): void {
        this.reportIfInvalid(this.isValidDefinitionName(node.schemeName()), node, "schemeName");
    }

}


/**
 * Implements the Invalid Example Definition Name Rule.
 */
export class OasInvalidExampleDefinitionNameRule extends OasInvalidPropertyNameRule {

    public visitExampleDefinition(node: Oas30ExampleDefinition): void {
        this.reportIfInvalid(this.isValidDefinitionName(node.name()), node, "name");
    }

}

/**
 * Implements the Invalid Request Body Definition Name Rule.
 */
export class OasInvalidRequestBodyDefinitionNameRule extends OasInvalidPropertyNameRule {

    public visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {
        this.reportIfInvalid(this.isValidDefinitionName(node.name()), node, "name");
    }

}

/**
 * Implements the Invalid Header Definition Name Rule.
 */
export class OasInvalidHeaderDefinitionNameRule extends OasInvalidPropertyNameRule {

    public visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        this.reportIfInvalid(this.isValidDefinitionName(node.name()), node, "name");
    }

}

/**
 * Implements the Invalid Link Definition Name Rule.
 */
export class OasInvalidLinkDefinitionNameRule extends OasInvalidPropertyNameRule {

    public visitLinkDefinition(node: Oas30LinkDefinition): void {
        this.reportIfInvalid(this.isValidDefinitionName(node.name()), node, "name");
    }

}

/**
 * Implements the Invalid Callback Definition Name Rule.
 */
export class OasInvalidCallbackDefinitionNameRule extends OasInvalidPropertyNameRule {

    public visitCallbackDefinition(node: Oas30CallbackDefinition): void {
        this.reportIfInvalid(this.isValidDefinitionName(node.name()), node, "name");
    }

}

/**
 * Implements the Unmatched Encoding Property Rule.
 */
export class OasUnmatchedEncodingPropertyRule extends OasInvalidPropertyNameRule {

    /**
     * Returns true if the given schema has a property defined with the given name.
     * @param {Oas30Schema} schema
     * @param {string} propertyName
     * @return {boolean}
     */
    private isValidSchemaProperty(schema: Oas30Schema, propertyName: string): boolean {
        if (this.isNullOrUndefined(schema)) {
            return false;
        }
        return !this.isNullOrUndefined(schema.property(propertyName));
    }

    public visitEncoding(node: Oas30Encoding): void {
        let name: string = node.name();
        let schema: Oas30Schema = (node.parent() as Oas30MediaType).schema;

        this.reportIfInvalid(this.isValidSchemaProperty(schema, name), node, name, {
            name: name
        });
    }

}

# OpenAPI Core Library (Typescript)

## What is it?
This project is a library, written in Typescript, to read and manipulate [OpenAPI](https://www.openapis.org/) 
specification documents.

You can use this library to read an OpenAPI document, resulting in an instance of a data 
model. The data model can then be read or manipulated. It can also be validated.

The data model can be accessed directly, but there is also a robust visitor pattern 
available for more advanced analysis or transformation of the model.

## Usage
For details on how to use the library, see the documentation included with the library on
npmjs.com:

  https://www.npmjs.com/package/oai-ts-core

This documentation can also be found in this repository here:

```
oai-ts-core/module/README.md
```

## Project Goals

### Purpose
The primary goal of this project is to be the official library to perform client operations on
OpenAPI documents.  Both for the purpose of analyzing/processing (including validation) a document 
as well as making changes to it.

The library should be usable as broadly as possible, both as a dependency of other Typescript or
Javascript projects, as well as usable directly within a browser (via a simple import).

### Usage Scenarios
TBD

### Dependencies
An important design decision is that this project does not have any runtime dependencies.  This
means that you can use the library directly in the browser without including any other libraries.
It also means you can use the project as a dependency in your projects without worrying about 
conflicts or dependency bloat.

## Project Status
Currently, the data model fully supports version 2.0 of the OpenAPI spec.  Barring oversights or
bugs, the full OpenAPI document can be read and written successfully.  In addition, the visitor
pattern has been fully implemented (along with both up and down traversing).

Work on validation has been started, but most of the validation rules defined by the specification
have not yet been implemented.  This is the primary area of work going forward, until version 3.0
of the OpenAPI specification is released (at which point support for 3.0 will need to be added).

Please refer to the github repository's Issues and other resources for more information on the
current status of the project.

## OpenAPI Versions
One of the design goals of this library is to simultaneously support multiple versions of the OpenAPI
specification.  Currently the only published version of the specification supported by the library
is [version 2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md).  As new
versions of the specification are released, the library will be updated to include support for them.

## Building the Library
This section explains how to build, package, test, and publish the library.  If you are a developer
looking to make changes, this is a great place to start.

### Pre-Requisites
In order to do any work with the library you will need to install node.  As of the time of this
writing, the versions of node and npm used were:

```
$ node -v
v5.6.0
$ npm -v
3.6.0
```

Make sure you download and install node/npm of at least the above versions.

### Clone and Configure
The first thing to do (obviously) is clone the repository.  Once you've cloned the git repository,
you must use npm to install all of the library's dependencies.  It is worth noting that the library
does not have any runtime dependencies, but it has several *build* dependencies (including typescript,
karma, jasmine, etc).  The following commands should help clone and configure:

```
git clone https://github.com/EricWittmann/oai-ts-core.git
cd oai-ts-core
npm i
```

The result of this should be a number of dependencies downloaded and stored in a new `node_modules`
directory.


### Test the Library
This library uses jasmine+karma for unit testing.  Give it a try by doing this:

```
npm test
```

You should see a number of unit tests get executed (you may need Google Chrome installed for
this to work).  They should all succeed and you should see a report at the end which looks 
something like this (trimmed for brevity):

```
SUMMARY
 0: Chrome 55.0.2883 (Windows 10 0.0.0): Executed 76 of 76 SUCCESS (0.628 secs / 0.524 secs)
                                                   all   0
  Empty Document Test (2.0)
    Document not null                               ✓    ✓
    Document with core meta-data                    ✓    ✓
    Document with external docs                     ✓    ✓
    Document with simple info                       ✓    ✓
    Document with full info                         ✓    ✓
...SNIP....
    Array Parameters (items)                        ✓    ✓
  Responses I/O (2.0)
    Spec Example 1                                  ✓    ✓
    Multiple Spec Examples                          ✓    ✓

=============================== Coverage summary ===============================
Statements   : 91.96% ( 2527/2748 )
Branches     : 77.98% ( 517/663 )
Functions    : 77.1% ( 505/655 )
Lines        : 92.68% ( 2254/2432 )
================================================================================
```

### Releasing a New Version
Once changes have been made and finalized, you're probably going to release a new version
of the library.  This is done by packaging the library into an npm compatible package and
releasing it (into npmjs.com).

#### Modify the Version
The first step is to increase the project's version number.  This can be done by modifing
the `package.json` file:

```json
{
  "name": "oai-ts-core",
  "version": "0.1.2",
  "description": "A library to read and write OpenAPI documents.",
  "license": "Apache-2.0"
}
```

Simply edit the `version` property, giving it the next logical value.  If the change is minor,
then modify the patch version.  If it's a more significant release, then modifying the major
or minor number may be appropriate.

#### Create the Package
Next, create the package (intended for release) by using npm.  The command to create the 
package is below:

```
npm run package
```

This command will result in a new `dist` directory being created.  Within this directory
you will find a number of files, all of which must be uploaded to npmjs.com as the new 
release of the library.

#### Publish to npmjs.com
Once everything has been packaged, you can simply use npm to publish the result into
npmjs.com:

```
npm publish ./dist
```

#### Tag the Release in Git
If everything went well, you have now built, tested, packaged, and released a new version of
the library into npmjs.com for other projects to use.  The final step is to tag the source
code with the version that was just released.  For example, if you have just published version
3.7.8 of the library, you would tag it in the repository with these commands:

```
git tag -a -m 'Release 3.7.8' 3.7.8
git push 3.7.8
```

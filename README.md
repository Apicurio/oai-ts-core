# OpenAPI Core Library (Typescript)

## What is it?
This project is a library, written in Typescript, to read and manipulate [OpenAPI](https://www.openapis.org/) 
specification documents.

You can use this library to read an OpenAPI document, resulting in an instance of a data 
model. The data model can then be read or manipulated. It can also be validated.

The data model can be accessed directly, but there is also a robust visitor pattern 
available for more advanced analysis or transformation of the model.

This project is licensed under the [Apache License 2.0](LICENSE).

## Usage
For details on how to use the library, see the documentation included with the library on
npmjs.com:

  [https://www.npmjs.com/package/oai-ts-core](https://www.npmjs.com/package/oai-ts-core)

This documentation can also be found in this repository here:

  [./module/README.md](https://github.com/Apicurio/oai-ts-core/blob/master/module/README.md)

## Project Goals

### Purpose
The primary goal of this project is to be the official library to perform client operations on
OpenAPI documents.  Both for the purpose of analyzing/processing (including validation) a document 
as well as making changes to it.

The library should be usable as broadly as possible, both as a dependency of other Typescript or
Javascript projects, as well as usable directly within a browser (via a simple import).

### Usage Scenarios
Some example usage scenarios for this library include:
 
* An editor which can be used to create new OpenAPI documents (or modify existing ones).
* Auto-generate documentation from an OpenAPI document.
* Transform OpenAPI documents into other versions/formats.
* Auto-generate API clients based on OpenAPI documents.

### Dependencies
An important design decision is that this project does not have any runtime dependencies.  This
means that you can use the library directly in the browser without including any other libraries.
It also means you can use the project as a dependency in your projects without worrying about 
conflicts or dependency bloat.

## Project Status
Currently, the data model fully supports versions 2.0 and 3.0.x of the OpenAPI spec.  Barring oversights
or bugs, the full OpenAPI document can be read and written successfully.  In addition, the visitor
pattern has been fully implemented (along with both up and down traversing).

Validation of the OpenAPI specification exists, with almost all of the rules outlined in the
spec having been implemented.

Please refer to the github repository's Issues and other resources for more information on the
current status of the project.

## OpenAPI Versions
One of the design goals of this library is to simultaneously support multiple versions of the OpenAPI
specification.  At the time of this writing, there are two versions of the OpenAPI specification:

* [OpenAPI Version 2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)
* [OpenAPI Version 3.0.1](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md)

Both of these versions are supported by the library.  As new versions of the specification are 
released, the library will be updated to include support for them.

## Building the Library
This section explains how to build, package, test, and publish the library.  If you are a developer
looking to make changes, this is a great place to start.

### Pre-Requisites
In order to do any work with the library you will need to install node.js.  As of the time of this
writing, the versions of node, npm. and yarn used were:

```
$ node -v
v5.6.0
$ npm -v
3.6.0
$ yarn --version
0.20.3
```

Make sure you download and install node/npm/yarn of at least the above versions.

### Clone and Configure
The first thing to do (obviously) is clone the repository.  Once you've cloned the git repository,
you must use yarn (or npm) to install all of the library's dependencies.  It is worth noting that the library
does not have any runtime dependencies, but it has several *build* dependencies (including typescript,
karma, jasmine, etc).  The following commands should help clone and configure:

```
git clone https://github.com/Apicurio/oai-ts-core.git
cd oai-ts-core
yarn install
```

The result of this should be a number of dependencies downloaded and stored in a new `node_modules`
directory.


### Test the Library
This library uses jasmine+karma for unit testing.  Give it a try by doing this:

```
yarn test
```

You should see a number of unit tests get executed (you may need Google Chrome installed for
this to work).  They should all succeed and you should see a report at the end which looks 
something like this (trimmed for brevity):

```
SUMMARY
 0: Chrome 58.0.3029 (Windows 10 0.0.0): Executed 136 of 136 (1 FAILED) (1.207 secs / 0.7 secs)
                                                   all   0
  Empty Document Test (2.0)
    Document not null                               ✓    ✓
    Document with core meta-data                    ✓    ✓
    Document with external docs                     ✓    ✓
    Document with simple info                       ✓    ✓
    Document with full info                         ✓    ✓
...SNIP....
    Mutually Exclusive (All)                        ✓    ✓ 
    Invalid Reference (All)                         ✓    ✓ 

=============================== Coverage summary ===============================
Statements   : 85.4% ( 5195/6083 )
Branches     : 72.27% ( 928/1284 )
Functions    : 73.21% ( 1093/1493 )
Lines        : 86.09% ( 4691/5449 )
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
  "version": "0.2.4",
  "description": "A library to read and write OpenAPI documents.",
  "license": "Apache-2.0"
}
```

Simply edit the `version` property, giving it the next logical value.  If the change is minor,
then modify the patch version.  If it's a more significant release, then modifying the major
or minor number may be appropriate.

#### Create the Package
Next, create the package (intended for release) by using yarn.  The command to create the 
package is below:

```
yarn run package
```

This command will result in a new `dist` directory being created.  Within this directory
you will find a number of files, all of which must be uploaded to npmjs.com as the new 
release of the library.

#### Publish to npmjs.com
Once everything has been packaged, you can simply use yarn/npm to publish the result into
npmjs.com:

```
yarn publish ./dist
```

#### Tag the Release in Git
If everything went well, you have now built, tested, packaged, and released a new version of
the library into npmjs.com for other projects to use.  The final step is to tag the source
code with the version that was just released.  For example, if you have just published version
0.2.4 of the library, you would tag it in the repository with these commands:

```
git tag -a -m 'Release 0.2.4' 0.2.4
git push origin 0.2.4
```

## Contribute Fixes and Features
This project is open source, and we welcome anybody who wants to participate and contribute!

### Get the code
The easiest way to get started with the code is to [create your own fork](http://help.github.com/forking/)
of this repository, and then clone your fork:

```bash
$ git clone git@github.com:<you>/oai-ts-core.git
$ cd oai-ts-core
$ git remote add upstream git://github.com/Apicurio/oai-ts-core.git
```

At any time, you can pull changes from the upstream and merge them onto your master:

```bash
$ git checkout master       # switches to the 'master' branch
$ git pull upstream master  # fetches all 'upstream' changes and merges 'upstream/master' onto your 'master' branch
$ git push origin           # pushes all the updates to your fork, which should be in-sync with 'upstream'
```

The general idea is to keep your 'master' branch in-sync with the 'upstream/master'.

### Track Your Change
If you want to fix a bug or make any changes, please log an issue in the github 
[Issue Tracker](https://github.com/Apicurio/oai-ts-core/issues) describing the bug or new 
feature. Then we highly recommend making the changes on a topic branch named with the issue 
number. For example, this command creates a branch for issue #7:

```bash
$ git checkout -b oai-ts-core-7
```

After you're happy with your changes and all unit tests run successfully, commit your changes 
on your topic branch. Then it's time to check for and pull any recent changes that were made in
the official repository since you created your branch:

```bash
$ git checkout master         # switches to the 'master' branch
$ git pull upstream master    # fetches all 'upstream' changes and merges 'upstream/master' onto your 'master' branch
$ git checkout oai-ts-core-7  # switches to your topic branch
$ git rebase master           # reapplies your changes on top of the latest in master
                              # (i.e., the latest from master will be the new base for your changes)
```

If the pull grabbed a lot of changes, you should rerun the tests to make sure your changes are 
still good.  You can then either [create patches](http://progit.org/book/ch5-2.html) (one file 
per commit, saved in `~/oai-ts-core-7`) with:

```bash
$ git format-patch -M -o ~/oai-ts-core-7 orgin/master
```

and upload them to the issue, or you can push your topic branch and its changes into your public 
fork repository with:

```bash
$ git push origin oai-ts-core-7         # pushes your topic branch into your public fork
```

and [generate a pull-request](http://help.github.com/pull-requests/) for your changes.  The latter
is definitely the preferred mechanism for submitting changes.

The reason we prefer pull-requests is that we can review the proposed changes, comment on them,
discuss them with you, and likely merge the changes right into the official repository.  No muss,
no fuss!

Please try to create one commit per feature or fix, generally the easiest way to do this is 
via [git squash](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#Squashing-Commits).
This makes reverting changes easier, and avoids needlessly polluting the repository history with 
checkpoint commits.

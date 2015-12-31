# Thrift Template for C++ Projects w/ a JS Frontend

## Getting Started

Before you do anything, start by forking this repo. Once you do that, you have a couple things that need doing.

* Creating thrift files to define the interface between your C++ backend and your JS frontend.
* Implementing your C++ backend
* Implementing your JS frontend

This section describes how to do that, as well as describing how to use/modify the Makefile for this project. In addition to this doc there are various comments scattered throughout the template that help explain what to modify. Besides the normal descriptive comments, there are also various `// TODO:`s scattered throughout to help highlight what needs to be done.

### Integrate Thrift Definition

To get started, you'll first want to figure out what your thrift IDL services and
structures should be. Once you've decided on the service and structures that you'd
like to expose, follow these steps:

1. Create any necessary thrift files in the idl/ directory; make sure that the name
   of the service corresponds to the name of the file that it is within.
2. Update the Makefile by updating the `_MAIN_IDL` & `_IDL` variables with the
   service file, and any supporting thrift files ie) files that define structs.
3. Run `make generate` to create the skeleton code for the main piece of your
   code.
4. Copy the skeleton file to backend/lib/main.cpp, but be sure to add the
   appropriate server setups to be compatible with JS. (There is an example in
   the default lib/main.cpp.
  * Proper Transport: THttpServerTransportFactory
  * Proper Protocol: TJSONProtocolFactory
5. Update frontend/index.html to use the appropriate generated scripts

If you have any questions about Thrift, checkout [the official docs](http://thrift.apache.org/).

### Implement Backend

The implementation of the backend is very project dependent, that being said there are a couple of steps that are fairly important:

1. As previously stated, copy over the skeleton file and make sure you use the proper transport and protocol.
2. You'll most likely want some sort of logger, there is a function defined in utils.h that allows you to initialize logging using [easylogging++](https://github.com/easylogging/easyloggingpp). Besides calling that function you'll also need to place a macro called `INITIALIZE_EASYLOGGINGPP` before your definition of main. The configurations for logging are specified in configs/level.conf and configs/general.conf. You can modify these to your heart's content.
3. If you want to add other c++ files, you should place any .cpp files in backend/lib and any .h files in backend/include. You'll also want to add those to the Makefile variables `SRC` and `_DEPS` respectively.

Enjoy writing your backend!

### Implement Frontend

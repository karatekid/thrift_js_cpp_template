# Thrift Template for C++ Projects w/ a JS Frontend

## Getting Started

To get started, you'll first want to figure out what your thrift IDL services and
should be. Once youv'e decided on the service and structures that you'd like to
expose, follow these steps:

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
5. Implement your custom behavior for the server, and integrate it with your
   frontend JS. Have fun!

### Enhance your project with good logging

Use easylogging++ to enhance your logging.

#include "easylogging++.h"
#include "utils.h"

#include "ExampleService.h"
#include <thrift/protocol/TJSONProtocol.h>
#include <thrift/server/TSimpleServer.h>
#include <thrift/transport/TServerSocket.h>
#include <thrift/transport/THttpServer.h>

using namespace ::apache::thrift;
using namespace ::apache::thrift::protocol;
using namespace ::apache::thrift::transport;
using namespace ::apache::thrift::server;

using boost::shared_ptr;

class ExampleServiceHandler : virtual public ExampleServiceIf {
 public:
  ExampleServiceHandler() {
    // Your initialization goes here
    LOG(DEBUG) << "Initializing Service Handler";
  }

  int32_t setExampleStruct(const  ::ExampleStruct& t) {
    // Your implementation goes here
    LOG(DEBUG) << "setExampleStruct w/ exampleField: " << t.exampleField;
    value = t;
    return 0;
  }

  void getExampleStruct( ::ExampleStruct& _return) {
    // Your implementation goes here
    LOG(DEBUG) << "getExampleStruct";
    _return = value;
    // Change the return value, to show effect
    _return.exampleField *= 2;
  }

 private:
  ::ExampleStruct value;

};

// Necessary for logging to work properly
INITIALIZE_EASYLOGGINGPP

int main(int argc, char **argv) {
  initializeLogging(argc, argv);
  CLOG(DEBUG, "main") << "Starting up server";
  int port = 9090;
  shared_ptr<ExampleServiceHandler> handler(new ExampleServiceHandler());
  shared_ptr<TProcessor> processor(new ExampleServiceProcessor(handler));
  shared_ptr<TServerTransport> serverTransport(new TServerSocket(port));
  shared_ptr<TTransportFactory> transportFactory(new THttpServerTransportFactory());
  shared_ptr<TProtocolFactory> protocolFactory(new TJSONProtocolFactory());

  TSimpleServer server(processor, serverTransport, transportFactory, protocolFactory);
  server.serve();
  return 0;
}


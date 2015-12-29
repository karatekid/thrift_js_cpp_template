requirejs.config({
    baseUrl: 'js/app',
    paths: {
        lib: '../lib',
    }
});
requirejs([
    'graph'
],
function (graph) {
var transport = new Thrift.Transport("http://localhost:9090");
var protocol  = new Thrift.Protocol(transport);
var client    = new ExampleClient(protocol);
var devInfo;
var doneDrawing = false;
var lastData = null;
var blackList = new Set();

function getTemplate() {
    try {
        var d = client.receiveTemplate();
        return d;
    } catch(NetworkError) {
      //Don't fail, mock currently for testing
      console.log("<WARNING>: Network Error.");
      throw NetworkError;
    }
}

});

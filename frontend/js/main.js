requirejs.config({
    baseUrl: 'js/app',
    paths: {
        lib: '../lib',
    }
});
requirejs([
    'ExampleKnockout',
    'graph'
],
function (ExampleKO, graph) {
var transport = new Thrift.Transport("http://localhost:9090");
var protocol  = new Thrift.Protocol(transport);
var client    = new ExampleServiceClient(protocol);
var exampleFieldHistory = [0];

function getExampleStruct() {
    try {
        var d = client.getExampleStruct();
        // Upate graph
        exampleFieldHistory.push(d.exampleField);
        graph.update(exampleFieldHistory);
        return d;
    } catch(NetworkError) {
        console.log("<WARNING>: Network Error.");
        alert("Can't connect to the thrift server, try running it.");
        throw NetworkError;
    }
}

// A global instance of the example struct
var exampleStruct = ko.mapping.fromJS(getExampleStruct(), ExampleKO.ExampleMapping);
// Apply the binding to the DOM
ko.applyBindings(exampleStruct, document.getElementById('example-div'));

// Functions that use the struct
function updateExampleStruct() {
    ko.mapping.fromJS(getExampleStruct(), exampleStruct);
}

function setExampleStruct() {
    try {
        client.setExampleStruct(ko.mapping.toJS(exampleStruct));
    } catch(NetworkError) {
        console.log("<WARNING>: Network Error.");
        alert("Can't connect to the thrift server, try running it.");
        throw NetworkError;
    }
}

// Register dom with functions
$("#set-btn").click(setExampleStruct);
$("#get-btn").click(updateExampleStruct);

});

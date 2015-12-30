define(function() {
// View Model
function ExampleVM(data) {
    var self = this;
    // Thrift object
    ko.mapping.fromJS(data, {}, self);
    // Additional fields
}

// Mapping
var ExampleMapping = {
    create: function(options) {
        return new ExampleVM(options.data);
    }
};

// Interface
return {
    ExampleMapping: ExampleMapping
};
});

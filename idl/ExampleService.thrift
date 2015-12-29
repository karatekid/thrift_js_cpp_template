include "ExampleStruct.thrift"

service ExampleService {
    // Example functions, named from clients perspective
    i32 setExampleStruct(1:ExampleStruct.ExampleStruct t),
    ExampleStruct.ExampleStruct getExampleStruct(),
}

include "template.thrift"

service Example {
    // Example functions
    i32 sendTemplate(1:template.TemplateStruct t),
    template.TemplateStruct receiveTemplate(),
    void reset()
}

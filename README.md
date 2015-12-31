# Thrift Template for C++ Projects w/ a JS Frontend

## Try it out

Trying this out should be fairly straightforward. The main dependency that
you'll have to install is [Thrift][thrift]. Once that is complete, all you need
to do is:

1. Run `make`
2. execute the newly compiled `run` executable
3. Open a browser to your local index.html

You can get and set the variable, when you get the variable it will return twice
what you have set it as. This is simply to show that the backend is doing
something. It will also graph the value every time that you get it. The graph
shows the X axis is seconds, this is purely to show formatting of the axis, it
is actually just which time that result was gathered.

Now that you see how it works, try making your own.

## Make it your own

Before you do anything, start by forking this repo. Once you do that, you have a
couple things that need doing.

* Creating thrift files to define the interface between your C++ backend and
  your JS frontend.
* Implementing your C++ backend
* Implementing your JS frontend

This section describes how to do that, as well as describing how to use/modify
the Makefile for this project. In addition to this doc there are various
comments scattered throughout the template that help explain what to modify.
Besides the normal descriptive comments, there are also various `// TODO:`s
scattered throughout to help highlight what needs to be done.

### Integrate Thrift Definition

To get started, you'll first want to figure out what your thrift IDL services
and structures should be. Once you've decided on the service and structures that
you'd like to expose, follow these steps:

1. Create any necessary thrift files in the idl/ directory; make sure that the
name of the service corresponds to the name of the file that it is within.
2. Update the Makefile by updating the `_MAIN_IDL` & `_IDL` variables with the
service file, and any supporting thrift files ie) files that define structs.
3. Run `make generate` to create the skeleton code for the main piece of your
code.
4. Copy the skeleton file to [backend/lib/main.cpp](backend/lib/main.cpp), but
be sure to add the appropriate server setups to be compatible with JS. (There is
an example in the default [main.cpp](backend/lib/main.cpp).
  * Proper Transport: THttpServerTransportFactory
  * Proper Protocol: TJSONProtocolFactory
5. Update [frontend/index.html](frontend/index.html) to use the appropriate
generated scripts

If you have any questions about Thrift, checkout [the official docs][thrift].

### Implement Backend

The implementation of the backend is very project dependent, that being said
there are a couple of steps that are fairly important:

1. As previously stated, copy over the skeleton file and make sure you use the
proper transport and protocol.
2. You'll most likely want some sort of logger, there is a function defined in
utils.h that allows you to initialize logging using [easylogging++][el]. Besides
calling that function you'll also need to place a macro called
`INITIALIZE_EASYLOGGINGPP` before your definition of main. The configurations
for logging are specified in configs/level.conf and configs/general.conf. You
can modify these to your heart's content.
3. If you want to add other c++ files, you should place any .cpp files in
[backend/lib](backend/lib) and any .h files in
[backend/include](backend/include). You'll also want to add those to the
[Makefile](Makefile) variables `SRC` and `_DEPS` respectively.

Enjoy writing your backend!

### Implement Frontend

The fronted relies on [Knockout.js][ko] to bind structures that you receive with
[Thrift][thrift] to the DOM. It does this by using the mapping plugin, which can
map JS objects to objects that are usable by Knockout. This makes the javascript
that you have to write fairly straightforward. Most of it has been implemented
already, if you want to add fields to your object that aren't part of your
thrift definition ie) fields that are derived from your model's fields, you'll
want to modify the [ExampleKnockout.js](frontend/js/app/ExampleKnockout.js) file
to update the `ExampleVM` (which stands for View Model) with additional fields.
While you're at it, you should probably update the filenames to correspond more
closely with your actual structures.  Besides, that there isn't much to the
basics of using [Knockout][ko], refer to the docs for more advanced uses.

The frontend example also comes with a use of [d3][d3], you can use it or not,
but I thought having an example use case could be helpful for various projects.
You can find it in [graph.js](frontend/js/app/graph.js).

The frontend also uses [require.js][require] to manage file dependencies between
all of the different frontend files. Unfortunately Thrift doesn't work very well
with require.js, so we cheat and throw some standard js files into
[index.html](frontend/index.html) so they have global scope, those files are:
* jquery
* bootstrap
* knockout
* underscore
* thrift Obviously, we could have better integration with require.js, but it
  hasn't been deemed necessary as of yet.

Enjoy making a cool frontend!

[thrift]: http://thrift.apache.org "Thrift page"
[ko]: http://knockoutjs.com/
[require]: http://requirejs.org/
[d3]: http://d3js.org/
[el]: https://github.com/easylogging/easyloggingpp

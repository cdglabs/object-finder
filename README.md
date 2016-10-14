# Object Finder

In a network of computers or objects, each of which provides some useful functionality, how might we describe a particular piece of functionality that we want to use so that a broker may automatically make bindings to an object (or set of objects) that provides it?

One possibility is to give a name each service, like interfaces in Java. But that requires advance planning -- all of the objects / computers have to agree on that name -- and it's inherently [anti-modular](http://gbracha.blogspot.com/2011/06/types-are-anti-modular.html).

It would be much better if we could somehow describe the behavior of these services in an abstract way, e.g., using something like what Alan Kay calls ["semantic types"](http://www.vpri.org/pdf/tr2007008_steps.pdf). But we don't have semantic types yet, so as a first approximation, I've done a little experiment in which a service is identified by a spec that consists of a set of unit tests. These unit tests specify the behavior of each of the desired operations, and how they should interact with each other. This builds on Ted Kaehler's [method finder](http://tedkaehler.weather-dimensions.com/us/ted/resume/resume-oct03.html); the difference is that in this case we're looking for a whole object, not just one method.

Here's what a spec looks like:

    var cryptoSpec = {
      operations: ['encrypt', 'decrypt'],
      test: function() {
        return this.encrypt('hello world') != 'hello world'
            && this.decrypt(this.encrypt('hello world')) == 'hello world';
      }
    }

The spec above describes an object that supports two operations, `encrypt` and `decrypt`. Note that it doesn't matter what these operations are actually called in the object that provides them -- in the spec, you're specifying what you want to call them and it's up to the system to make that work.

Given a spec and a list of available objects, the "broker" will try to find (sometimes synthesize) an object that satisfies the spec. My current implementation is very naive and clearly would not scale -- for each object that the broker knows about, it tries every possible binding of its methods to the operations in the spec -- but it has been useful to solidify some of my ideas about how such a discovery mechanism might work.

Supporting this kind of discovery is part of a larger goal to enable programmers to build new applications using existing applications or services as building blocks. There are many other interesting aspects of this problem that are worth thinking about, e.g., can we make bindings loosely so that when an object / service goes down, the same functionality can be provided by another object or a combination of objects? And if so, how do we deal with state?

(Our [Onward! 2014 paper](https://www.hesam.us/cs/callbymeaning/) explores a very different approach to discovery.)

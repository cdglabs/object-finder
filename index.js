var findImplementations = require('./findImplementations.js');

global.alert = function(msg) {
  // Emulate the world's most annoying function
  console.info("I'm super annoying!", msg);
}

// The goal in this experiment is to find (maybe even synthesize) an object that will do what you
// need. You specify your needs using a spec object that contains the names of the operations
// you're interested in, and a "unit test" that must be satisfied. E.g.,

var cryptoSpec = {
  operations: ['encrypt', 'decrypt'],
  test: function() {
    return this.encrypt('hello world') != 'hello world' &&
           this.decrypt(this.encrypt('hello world')) == 'hello world'
  }
}
console.info('spec: ', cryptoSpec)

// The spec above describes an object that supports two operations, encrypt and decrypt. Note that
// it doesn't really matter what these operations are actually called in the object that provides
// them -- in the spec, you're specifying what *you* want to call them and it's up to the system
// to make that work.

// Next, we set up a couple of mysterious objects whose functionality we know nothing about...

function addToEachCharacter(s, x) {
  var ans = []
  for (var idx = 0; idx < s.length; idx++) {
    var c = s.charCodeAt(idx)
    ans.push(String.fromCharCode(c + x))
  }
  return ans.join('')
}

var object1 = {
  // note that "dangerous" functions can be defanged as in Ted's method finder
  w: function(x) { alert(x) },
  x: function(a, b) { return a + b },
  y: function(c) { return -c },
  z: function(d) { return d + 1 }
}

var object2 = {
  foo: function(s) { return addToEachCharacter(s, -1) },
  bar: function(x) { return x + 1 },
  baz: function(s) { return addToEachCharacter(s, 1) },
  qux: function(a) { return a.toString() }
}

// Now we ask for all of the viable implementations of our spec in those objects:

var cryptoImpls = findImplementations(cryptoSpec, [object1, object2]);
console.info('found', cryptoImpls.length, 'viable candidates\n');

// And use all of them:

cryptoImpls.forEach(function(cryptoImpl, idx) {
  console.info('using candidate', idx + 1);
  var plaintext = 'this is a test';
  var encrypted = cryptoImpl.encrypt(plaintext);
  var decrypted = cryptoImpl.decrypt(encrypted);
  console.info('encrypt(' + plaintext + ') = ' + encrypted);
  console.info('decrypt(' + encrypted + ') = ' + decrypted + '\n');
});


function findImplementations(spec, objs) {
  return withDefangedDangerousFunctionsCall(function() {
    return objs
      .map(function(obj) { return findImplementationsFromOneObject(spec, obj); })
      .reduce(function(allImpls, impls) { return allImpls.concat(impls); });
  });
}

function findImplementationsFromOneObject(spec, obj) {
  var objPropertyNames = Object.keys(obj);
  var selectedPropertyIndices = repeat(0, spec.operations.length);
  var implementations = [];
  do {
    var candidate = makeCandidate(obj, objPropertyNames, selectedPropertyIndices, spec.operations);
    try {
      if (spec.test.call(candidate)) {
        implementations.push(candidate);
      }
    } catch (e) { }
  } while (increment(selectedPropertyIndices, objPropertyNames.length) == 0);
  return implementations;
}

function makeCandidate(obj, objPropertyNames, selectedPropertyIndices, operations) {
  var candidate = {};
  for (var idx = 0; idx < operations.length; idx++) {
    candidate[operations[idx]] = obj[objPropertyNames[selectedPropertyIndices[idx]]];
  }
  return candidate;
}

// Helpers

function withDefangedDangerousFunctionsCall(f) {
  var _alert = global.alert;
  global.alert = function() {};
  try {
    return f();
  } finally {
    global.alert = _alert;
  }
}

function repeat(x, n) {
  var ans = [];
  while (n-- > 0) {
    ans.push(x);
  }
  return ans;
}

function increment(digits, base) {
  var idx = 0;
  do {
    digits[idx]++;
    if (digits[idx] < base) {
      return 0;
    }
    digits[idx] -= base;
    idx++;
  } while (idx < digits.length);
  return 1;
}

// Exports

module.exports = findImplementations;


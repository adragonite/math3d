function isNumber(o) {
  return typeof o == "number" || (typeof o == "object" && o.constructor === Number);
}

function isNumberArray(arr) {
  return Array.isArray(arr) && arr.every(isNumber);
}

function doublesEqual(d1, d2) {
  var preciseness = 1e-13;
  return Math.abs(d1 - d2) < preciseness;
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (isNumber(a[i]) && isNumber(b[i])){
      if (!doublesEqual(a[i], b[i]))
        return false;
    } else if (a[i] !== b[i])
      return false;
  }
  return true;
}

module.exports.isNumber = isNumber;
module.exports.isNumberArray = isNumberArray;
module.exports.doublesEqual = doublesEqual;
module.exports.arraysEqual = arraysEqual;

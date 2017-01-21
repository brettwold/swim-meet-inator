var Utils = function () {};

Utils.prototype.trimQuotes = function(str) {
  return str.replace(/['"]+/g, '').trim();
}

module.exports = new Utils();

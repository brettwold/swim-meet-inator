var TimeUtils = function () {};

TimeUtils.prototype.getStringFromHundredths = function(time) {
  var hundredths = time;
  var seconds = Math.floor(hundredths / 100);
  var minutes = Math.floor(seconds / 60);
  var form = minutes+":"+this.padDigits(seconds-minutes*60, 2)+"."+("0"+(hundredths-seconds*100)).substr(-2);
  return form;
}

TimeUtils.prototype.getHundredthsFromString = function(timeStr) {
  var mins = 0;
  var tenths = 0;

  if(timeStr.indexOf(':') > -1) {
    var remain = timeStr.split(':');
    tenths += this.round(new Number(remain[0]) * 60 * 100, 0);
    timeStr = remain[1];
  }
  tenths += this.round(new Number(timeStr) * 100, 0);
  return tenths;
}

TimeUtils.prototype.round = function(value, exp) {
  if (typeof exp === 'undefined' || +exp === 0)
    return Math.round(value);

  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
    return NaN;

  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}

TimeUtils.prototype.padDigits = function(number, digits) {
  return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

module.exports = new TimeUtils();

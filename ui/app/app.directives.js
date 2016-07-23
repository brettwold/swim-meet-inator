angular.module('SwimResultinator')
  .directive('utcParser', function () {

      function link(scope, element, attrs, ngModel) {
          var parser = function (val) {
              val = moment.utc(val).format();
              return val;
          };

          var formatter = function (val) {
              if (!val) {
                  return val;
              }
              val = new Date(val);
              return val;
          };

          ngModel.$parsers.unshift(parser);
          ngModel.$formatters.unshift(formatter);
      }

      return {
          require: 'ngModel',
          link: link,
          restrict: 'A'
      }
  });

angular.module('SwimResultinator')
  .directive('lapTimeInput', function() {
    var tpl = '<div class="lap-time-input"> \
    <input ng-model="lap_time.minutes" type="number" class="form-time-control minutes" name="minutes" placeholder="00" min="0" max="30" step="1" size="2"> \
    <span class="form-time-control lap-time-sep">:</span> \
    <input ng-model="lap_time.seconds" type="number" class="form-time-control seconds" placeholder="00" min="0" max="59" step="1" size="2"> \
    <span class="form-time-control lap-time-sep">.</span> \
    <input ng-model="lap_time.hundreths" type="number" class="form-time-control hundreths" placeholder="00" min="0" max="99" step="1" size="2"> \
    </div>';

    return {
      restrict: 'A',
      template: tpl,
      replace: true,
      require: 'ngModel',
      scope: {
        ngModel: '='
      },
      link: function (scope, element, attrs, ngModel) {

        if (!ngModel) return;

        ngModel.$render = function() {
          var duration = moment.duration(parseInt(ngModel.$viewValue*10));
          scope.lap_time = {
            minutes: duration.minutes(),
            seconds: duration.seconds(),
            hundreths: Math.round(duration.milliseconds()/10)
          };
        };

        ngModel.$validators.check = function(modelValue, viewValue) {
          if(viewValue) {
            if(viewValue.minutes === undefined || viewValue.minutes > 15) {
              return false;
            }
            if(viewValue.seconds === undefined || viewValue.seconds > 59) {
              return false;
            }
            if(viewValue.hundreths === undefined || viewValue.hundreths > 99) {
              return false;
            }
          }
          return true;
        };

        function updateView(value) {
          ngModel.$viewValue = value;
          ngModel.$render();
        }

        function updateModel(value) {
          ngModel.$modelValue = value;
          scope.ngModel = value;
        }

        scope.$watchCollection('lap_time', function(newVal) {

          if(newVal && newVal.minutes !== undefined &&
             newVal.seconds !== undefined &&
              newVal.hundreths !== undefined) {

              if(newVal.minutes > 30) {
                newVal.minutes = 30;
              }

              if(newVal.seconds > 59) {
                newVal.seconds = 59;
              }

              if(newVal.hundreths > 99) {
                newVal.hundreths = 99;
              }

              console.log(newVal);
              var val = newVal.minutes*60*100 + newVal.seconds*100 + newVal.hundreths;
              updateModel(val);
          }
        });
      }
    };
  });

angular.module('SwimResultinator')
  .directive('displayTime', function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        padDigits = function(number, digits) {
          return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
        }

        if(attrs.displayTime !== undefined && attrs.displayTime != "") {
          var hundredths = parseInt(attrs.displayTime);
          var seconds = Math.floor(hundredths / 100);
          var minutes = Math.floor(seconds / 60);
          var form = minutes+":"+this.padDigits(seconds-minutes*60, 2)+"."+("0"+(hundredths-seconds*100)).substr(-2);
          element.text(form);
        } else {
          element.text("--:--.--");
        }
      }
    }
  });

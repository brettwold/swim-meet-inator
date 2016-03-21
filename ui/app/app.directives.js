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

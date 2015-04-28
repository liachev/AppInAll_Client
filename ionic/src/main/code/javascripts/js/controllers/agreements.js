angular.module('agreements.controllers', [])

.controller('AgreementsCtrl', ['$rootScope', '$state', '$log', '$window', function ($scope, $state, $log, $window) {
    $scope.title = "";
    $scope.text = "";
    $scope.signupData = $scope.signupData || {};

    $scope.getAgreement = function (name) {
        var agreements = new (Parse.Collection.getClass("Agreement"));
        var agreement = agreements.loadAgreementsWithTitle(name).then(function (results) {
            if (results.length == 1) {
                $scope.title = results[0].get("title");
                $scope.text = results[0].get("text");
            } else {
                $log.warn('[agreements.controllers] trying to get agreement "' + name + '"');
            }
        });

        $state.go('app.agreement');
    };

    $scope.agreedButtonClick = function(){
        if($scope.title == 'Terms of Use'){
            $scope.signupData.termsOfUseAgree = true;
            $scope.signupData.dateTerms = new Date();
        }
        if($scope.title == 'Privacy Policy'){
            $scope.signupData.privacyPolicyAgree = true;
            $scope.signupData.datePrivacy = new Date();
        }

        $window.history.back();
        $scope.signupData.isAgree = ($scope.signupData.termsOfUseAgree && $scope.signupData.privacyPolicyAgree);
    };
}]);
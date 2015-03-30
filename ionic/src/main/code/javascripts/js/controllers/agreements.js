angular.module('agreements.controllers', ['signup.controllers'])

    .controller('AgreementsCtrl', ['$rootScope', '$state', '$log', function ($scope, $state, $log) {
        $scope.title = "";
        $scope.text = "";

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
            //$scope.signupData.termsOfUseAgree = $scope.signupData.termsOfUseAgree || ($scope.title == 'Terms of Use');
            if($scope.title == 'Terms of Use'){
                $scope.signupData.termsOfUseAgree = true;
                $scope.signupData.dateTerms = new Date();
            }
            //$scope.signupData.privacyPolicyAgree = $scope.signupData.privacyPolicyAgree || ($scope.title == 'Privacy Policy');
            if($scope.title == 'Privacy Policy'){
                $scope.signupData.privacyPolicyAgree = true;
                $scope.signupData.datePrivacy = new Date();
            }
            $state.go('app.signup');
            $scope.signupData.isAgree = ($scope.signupData.termsOfUseAgree && $scope.signupData.privacyPolicyAgree);
        };
    }]);
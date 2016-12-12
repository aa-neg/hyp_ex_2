(function() {
    angular.module('emailSender').controller('homeController', function(
        $scope, $q, $http, apiBaseUrl, ngNotify, EmailService
        ) {

        $scope.details = {};

        $scope.progress = {
            sendingMail: false,
            progress: ''
        };

        $scope.validation = {}

        ngNotify.config({
            theme: 'pure',
            position: 'top',
            duration: 3000,
            button: true
        })

        $scope.emailValidation = (emailArray, detailProperty) => {
            //From angular input.js https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js
            let EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

            $scope.validation[detailProperty] = emailArray.every((email)=> {return EMAIL_REGEXP.test(email)});
        };

        $scope.emailEntries = (customEmail) => {
            let emailList = [];
            if (customEmail) {
                emailList.unshift(customEmail);
            }
            return emailList;
        };

        $scope.sendMail = (details, initialClient, backUpClient) => {
            if ($scope.emailForm.$invalid || Object.keys($scope.validation).every((emailValidated)=> {return !$scope.validation[emailValidated]})) {
                ngNotify.set("Please fill out all required fields with valid values.", 'warn');
                return;
            }

            $scope.progress.status = '';

            EmailService.send({
                client: initialClient,
                backUpClient: backUpClient,
                details: details
            })
            .then((results)=> {
                if (!results.success) {
                    angular.forEach(results.errors, (error)=> {
                        ngNotify.set(error, 'warn');
                    })
                    ngNotify.set("Error sending via "  +  initialClient  + " : " + error, 'warn');
                    return;
                }

                ngNotify.set(results.message, 'success');
                if (results.details) {
                    $scope.progress.status = results.details;
                }

                if (results.errors.length > 0) {
                     angular.forEach(results.errors, (error)=> {
                        ngNotify.set(error, 'warn');
                    })
                };
            })
        
        };

    });
})();

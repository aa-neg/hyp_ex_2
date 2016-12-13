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
            duration: 5000,
            button: true,
            sticky: true
        })

        $scope.emailValidation = (emailArray, detailProperty) => {
            //From angular input.js https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js
            let EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
            $scope.validation[detailProperty] = emailArray.every((email)=> {return EMAIL_REGEXP.test(email)});
        };

        //angular ui-select dynamic list.
        $scope.emailEntries = (customEmail) => {
            let emailList = [];
            if (customEmail) {
                emailList.unshift(customEmail);
            }
            return emailList;
        };

        let processErrors = (errorArray) => {
            angular.forEach(errorArray, (error)=> {
                ngNotify.set(error.message, 'warn');
            })
        }

        let invalidEmailInLists(validationDict) => {
            return Object.keys(validationDict)
            .every((emailValidated)=> {
                return validationDict[emailValidated]
            })
        }

        $scope.sendMail = (details, initialClient, backUpClient) => {
            if ($scope.emailForm.$invalid || invalidEmailInLists) {
                ngNotify.set("Please fill out all required fields with valid values.", 'warn');
                return;
            }

            $scope.progress.status = '';
            $scope.progress.message = '';
            $scope.progress.sendingMail = true;

            EmailService.send({
                client: initialClient,
                backUpClient: backUpClient,
                details: details
            })
            .then((results)=> {
                $scope.progress.sendingMail = false;
                if (results.errors.length > 0) {
                    processErrors(results.errors);
                    if (!results.success) {return}
                }

                ngNotify.set(results.message, 'success');
                $scope.progress.message = results.message;
                if (results.details) {
                    $scope.progress.status = results.details;
                }
            })
        
        };

    });
})();

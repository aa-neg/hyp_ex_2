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

        let processErrors = (errorArray, success) => {
            //Flatten the array
            angular.forEach(errorArray.reduce((a,b)=>{return a.concat(b)}, []), (error)=> {
                $scope.progress.issues += error.message;
                if (!success) {
                    ngNotify.set($scope.progress.issues , 'warn');
                }
            })
        }

        let validEmailInLists = (validationDict) => {
            return Object.keys(validationDict)
                .every((emailValidated)=> {
                    return (validationDict[emailValidated] == true);
                })
        }

        $scope.sendMail = (details) => {
            if ($scope.emailForm.$invalid || !validEmailInLists($scope.validation) 
                || !details.emailTo || details.emailTo.length == 0) {
                ngNotify.set("Please fill out all required fields with valid values.", 'warn');
                return;
            }

            $scope.progress.status = '';
            $scope.progress.issues = '';
            $scope.progress.sendingMail = true;

            EmailService.send({
                details: details
            })
            .then((results)=> {
                $scope.progress.sendingMail = false;
                if (results.errors.length > 0) {
                    processErrors(results.errors, results.success);
                } 

                if (results.success) {
                    ngNotify.set(results.message, 'success');
                }

                if (results.details && JSON.parse(results.details).message) {
                    $scope.progress.status = JSON.parse(results.details).message;
                }
            })
        };

    });
})();

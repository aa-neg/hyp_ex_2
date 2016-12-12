(function() {
    angular.module('emailSender').controller('homeController', function(
        $scope, $q, $http, apiBaseUrl, ngNotify
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

        //If we error and have a backUpClient we will attempt to resend via the backup.
        let errorHandling = (error, initialClient, backUpClient) => {
            $scope.progress.status = "Error sending via "  +  initialClient  + " : " + error;
            ngNotify.set("Error sending via "  +  initialClient  + " : " + error, 'warn');
            if (backUpClient) {
                ngNotify.set('Will attempt to resend via: ' + backUpClient, 'info');
                $scope.sendMail(details, backUpClient, null);
            } else {
                $scope.sendingMail = false;
            }
        };

        $scope.sendMail = (details, initialClient, backUpClient) => {
            console.log("here are our details. we will send back");

            console.log(details);
            console.log("our client and backup client");
            console.log(initialClient);
            console.log(backUpClient);

            if ($scope.emailForm.$invalid || Object.keys($scope.validation).every((emailValidated)=> {return !$scope.validation[emailValidated]})) {
                ngNotify.set("Please fill out all required fields with valid values.", 'warn');
            } else {
                console.log("success");
                // $scope.sendingMail = true;
                // $scope.progress.status = "Sending via " + initialClient  + " . . .";
                // $http.post(apiBaseUrl +  initialClient  + '/send', {details: details})
                // .then((results)=> {
                //     if (results.data.error) {
                //         errorHandling(results.data.error, initialClient, backUpClient);
                //     } else {
                //         $scope.sendingMail = false;
                //         ngNotify.set("Successfully sent via " + initialClient, 'success');
                //         if (results.data.result && results.data.result.message) {
                //             $scope.progress.status = initialClient + " response: " + result.data.result.message;
                //         } else {
                //             $scope.progress.status = "Successfully sent via " + initialClient;
                //         }
                //     }

                // }, (error)=> {
                //     errorHandling(error, initialClient, backUpClient);
                // })
            }

        };

    });
})();

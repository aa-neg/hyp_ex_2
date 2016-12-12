(function() {
    angular.module('emailSender').service('EmailService', function($http, apiBaseUrl, $q, ngNotify) {

        let service = {};

        service.send = function send(client, emailDetails, backUpclient) {
           return $http.post(
            apiBaseUrl + 'api/sendEmail',
            {
                details: emailDetails,
                client: client,
                backUpClient: backUpClient
            }
            )
            .then((results)=> {
                return results.data
            })
            .catch((error)=> {
                ngNotify.set("Issues sending email." + error, 'danger');
            }) 
        }

        return service;
    });
})();

(function() {
    angular.module('emailSender').service('EmailService', function($http, apiBaseUrl, $q, ngNotify) {

        let service = {};

        service.send = function send(parameters) {
           return $http.post(apiBaseUrl + 'api/sendEmail',parameters)
            .then((results)=> {
                console.log("backend response");
                console.log(results);
                return results.data
            })
            .catch((error)=> {
                ngNotify.set("Issues sending email." + error, 'danger');
            }) 
        }

        return service;
    });
})();

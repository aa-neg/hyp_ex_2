

describe('homeController', function() {
    let $scope;
    let homeController;
    let $q;
    let deferred;
    let $httpBackend
    let apiBaseUrl

    beforeEach(function() {
        window.angular.mock.module('emailSender');

        inject(function(_$rootScope_, $controller, APIRoutes, _$q_, _$httpBackend_, _apiBaseUrl_) {
            $q = _$q_;

            apiBaseUrl = _apiBaseUrl_

            deferred = _$q_.defer();

            $httpBackend = _$httpBackend_;

            $scope = _$rootScope_.$new()

            homeController = $controller('homeController', {
                APIRoutes: APIRoutes,
                $scope: $scope,
                $q: $q
            })
        })
    })

    it('Should exist', function(done) {
        this.timeout = 10000;
        expect(homeController).toBeDefined();

        $httpBackend.whenPOST(apiBaseUrl + '/mailgun/send').respond({
            errors: [],
            data: "mail sent!"
        });

        $scope.sendViaMailgun({details: "details"})
        .then((results)=> {
            console.log("here are our results");
            console.log(results);
            done();
        })

        deferred.resolve();

        $scope.$digest();
    }) 
})
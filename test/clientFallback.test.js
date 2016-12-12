

describe('homeController', function() {
    let $scope;
    let homeController;
    let $q;
    let deferred;
    let $httpBackend
    let apiBaseUrl

    beforeEach(function() {
        window.angular.mock.module('emailSender');

        inject(function(_$rootScope_, $controller, _$q_, _$httpBackend_, _apiBaseUrl_, _$http_, ngNotify) {
            $q = _$q_;

            apiBaseUrl = _apiBaseUrl_

            deferred = _$q_.defer();

            $httpBackend = _$httpBackend_;

            $scope = _$rootScope_.$new()
            console.log("what is ngnotify?");
            console.log(ngNotify)

            $scope.emailForm = {};

            homeController = $controller('homeController', {
                $scope: $scope,
                $q: $q,
                $http: _$http_,
                apiBaseUrl: _apiBaseUrl_,
                ngNotify: ngNotify
            })
            // homeController = _homeController_   
        })
    })

    it('Should exist', function(done) {
        this.timeout = 10000;
        console.log(homeController)
        $scope.emailForm.$invalid = false;
        $scope.validation = {
            attribute: true
        }
        // expect(homeController).toBeDefined();

        console.log("from our test!");
        console.log(apiBaseUrl + '/mailGun/send')
        $httpBackend
        .when('POST', apiBaseUrl + 'mailGun/send')
        .respond(200, {
            errors: [],
            data: "mail sent!"
        });

        // $httpBackend.expect('POST', 'http://localhost/sendGrid/send')
        // .respond(200, {
        //     errors: [],
        //     data: "mail sent!"
        // })

        $scope.sendMail({},  'mailGun', 'sendGrid');
        console.log("before our flush")
        $httpBackend.flush();
        // deferred.resolve();
        // $scope.$digest();

        console.log("after our flush");


        // done()



        

     

        
    }) 
})
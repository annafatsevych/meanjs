(function () {
  'use strict';

  describe('Freebies Route Tests', function () {
    // Initialize global variables
    var $scope,
      FreebiesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FreebiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FreebiesService = _FreebiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('freebies');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/freebies');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('freebies.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/freebies/client/views/list-freebies.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          FreebiesController,
          mockFreebie;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('freebies.view');
          $templateCache.put('modules/freebies/client/views/view-freebie.client.view.html', '');

          // create mock freebie
          mockFreebie = new FreebiesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Freebie about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          FreebiesController = $controller('FreebiesController as vm', {
            $scope: $scope,
            articleResolve: mockFreebie
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:freebieId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.articleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            freebieId: 1
          })).toEqual('/freebies/1');
        }));

        it('should attach an freebie to the controller scope', function () {
          expect($scope.vm.freebie._id).toBe(mockFreebie._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/freebies/client/views/view-freebie.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FreebiesController,
          mockFreebie;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('freebies.create');
          $templateCache.put('modules/freebies/client/views/form-freebie.client.view.html', '');

          // create mock freebie
          mockFreebie = new FreebiesService();

          // Initialize Controller
          FreebiesController = $controller('FreebiesController as vm', {
            $scope: $scope,
            articleResolve: mockFreebie
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.articleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/freebies/create');
        }));

        it('should attach an freebie to the controller scope', function () {
          expect($scope.vm.freebie._id).toBe(mockFreebie._id);
          expect($scope.vm.freebie._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/freebies/client/views/form-freebie.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FreebiesController,
          mockFreebie;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('freebies.edit');
          $templateCache.put('modules/freebies/client/views/form-freebie.client.view.html', '');

          // create mock freebie
          mockFreebie = new FreebiesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Freebie about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          FreebiesController = $controller('FreebiesController as vm', {
            $scope: $scope,
            articleResolve: mockFreebie
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:freebieId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.articleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            freebieId: 1
          })).toEqual('/freebies/1/edit');
        }));

        it('should attach an freebie to the controller scope', function () {
          expect($scope.vm.freebie._id).toBe(mockFreebie._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/freebies/client/views/form-freebie.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('freebies.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('freebies/');
          $rootScope.$digest();

          expect($location.path()).toBe('/freebies');
          expect($state.current.templateUrl).toBe('modules/freebies/client/views/list-freebies.client.view.html');
        }));
      });

    });
  });
}());

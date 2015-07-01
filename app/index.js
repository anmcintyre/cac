angular.module("cac", ['ngRoute', 'ngAnimate'])
	.constant("CAC_COUNTRIES", "http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=anmcintyre&style=full")
	.constant("CAC_NEIGHBORS", "http://api.geonames.org/neighboursJSON?username=anmcintyre&geonameId=")
	.constant("CAC_CAPITAL", "http://api.geonames.org/searchJSON?username=anmcintyre")
	.run(['$rootScope', '$location', '$timeout', function($rootScope, $location, $timeout){
	    $rootScope.$on('$routeChangeError', function() {
        	$location.path("/error");
	    });
	    $rootScope.$on('$routeChangeStart', function() {
	        $rootScope.isLoading = true;
	    });
	    $rootScope.$on('$routeChangeSuccess', function() {
	      	$timeout(function() {
	        	$rootScope.isLoading = false;
	      	}, 5000);
	    });	
	}])
	.factory("cacCountryData", ['$http', 'CAC_COUNTRIES', function($http, CAC_COUNTRIES) {
		return function(suffix){
			return $http({
				cache: true,
				method: "GET",
				url: CAC_COUNTRIES+suffix
			})
		}
    }])
	.factory('cacCountryNeighbors', ['$http', 'CAC_NEIGHBORS', function($http, CAC_NEIGHBORS) {
		return function(geoNameId){
			return $http({
				cache: true,
				method: "GET",
				url: CAC_NEIGHBORS+geoNameId
			})
		}	    
	}])    
	.factory('cacCountryCapital', ['$http', 'CAC_CAPITAL', function($http, CAC_CAPITAL){
		return function(capitalName, countryCode){
			return $http({
				cache: true,
				method: "GET",
				url: CAC_CAPITAL,
				params: {name_equals: capitalName,
						 country: countryCode,
						 featureCode: "PPLC"
				}
			})
		}
	}])
	.config(['$routeProvider', function($routeProvider) {
       $routeProvider.when('/', {
            templateUrl : 'home.html',
            controller : 'HomeCtrl'
        }).when('/countries', {
		    templateUrl : 'countries.html',
		    controller : 'CountriesCtrl',
        }).when('/countries/:country/capital', {
		    templateUrl : 'country.html',
		    controller : 'CountryCtrl',
        }).when('/error', {
    		template : '<p>Error - Page Not Found</p>'
		});
	}])
    .controller('HomeCtrl', ['$scope', function($scope) {
 		$scope.isLoading = false;
    }])
	.controller('CountriesCtrl', ['$scope', '$location', 'cacCountryData', function($scope, $location, cacCountryData) {
		cacCountryData("").then(function(data){
			$scope.countries = data.data.geonames;
			$scope.isLoading = false;
		});
		$scope.goToDetails = function(countryCode){
			$location.path('/countries/' + countryCode + '/capital');
		}
	}])
	.controller('CountryCtrl', ['$routeParams', '$scope', 'cacCountryData', 'cacCountryNeighbors', 'cacCountryCapital', function($routeParams, $scope, cacCountryData, cacCountryNeighbors, cacCountryCapital) {
		$scope.neighbors = [];
		$scope.cityPopulation="";
		var neighborsLoading = true;
		var capitalLoading = true;
	    cacCountryData("&country=" + $routeParams.country).then(function(data){
			$scope.country = data.data.geonames[0];
			cacCountryNeighbors($scope.country.geonameId).then(function(data){
				if (data.data.totalResultsCount !== 0)
					$scope.neighbors = data.data.geonames;
				neighborsLoading = false;
				$scope.isLoading = neighborsLoading && capitalLoading;
			}, function(){
				console.log("error message from cacCountryNeighbors");
				neighborsLoading = false;
				$scope.isLoading = neighborsLoading && capitalLoading;				
			});
			cacCountryCapital($scope.country.capital, $scope.country.countryCode).then(function(data){
				if (data.data.totalResultsCount !== 0)
					$scope.cityPopulation = data.data.geonames[0].population;
				capitalLoaded = false;
				$scope.isLoading = neighborsLoading && capitalLoading;			
			}, function(){
				console.log("error message from cacCountryCapital");
				capitalLoaded = false;
				$scope.isLoading = neighborsLoading && capitalLoading;				
			});
		})
	}]);

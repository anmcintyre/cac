var testData = {};
testData.fakeCountryData = {
	geonames: [
		{	continent: "EU",
			capital: "Andorra la Vella",
			languages: "ca",
			geonameId: 3041565,
			south: 42.42849259876837,
			isoAlpha3: "AND",
			north: 42.65604389629997,
			fipsCode: "AN",
			population: "84000",
			east: 1.7865427778319827,
			isoNumeric: "020",
			areaInSqKm: "468.0",
			countryCode: "AD",
			west: 1.4071867141112762,
			countryName: "Andorra",
			continentName: "Europe",
			currencyCode: "EUR"
		},
		{
			continent: "AS",
			capital: "Abu Dhabi",
			languages: "ar-AE,fa,en,hi,ur",
			geonameId: 290557,
			south: 22.633329391479492,
			isoAlpha3: "ARE",
			north: 26.08415985107422,
			fipsCode: "AE",
			population: "4975593",
			east: 56.38166046142578,
			isoNumeric: "784",
			areaInSqKm: "82880.0",
			countryCode: "AE",
			west: 51.58332824707031,
			countryName: "United Arab Emirates",
			continentName: "Asia",
			currencyCode: "AED"
		}
	]
}

describe("getAllCountries", function() {
    beforeEach(module('cac'));

    it('should return a list of countries when asked',
    inject(function(cacCountryData, $rootScope, $httpBackend) {
		var status = false;    	
        $httpBackend.expect('GET', 'http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=anmcintyre&style=full').respond(testData.fakeCountryData);
        cacCountryData("").success(function(data) {
        	if (data.geonames.length === testData.fakeCountryData.geonames.length)
            	status = true;
        });
        $rootScope.$digest();
        $httpBackend.flush();
        expect(status).toBe(true);
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should return a single country when asked',
    inject(function(cacCountryData, $rootScope, $httpBackend) {
		var status = false;    	
        $httpBackend.expect('GET', 'http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=anmcintyre&style=full&country=AD').respond(testData.fakeCountryData.geonames[0]);
        cacCountryData("&country=AD").success(function(data) {
        	if (data.countryCode === testData.fakeCountryData.geonames[0].countryCode)
            	status = true;
        });
        $rootScope.$digest();
        $httpBackend.flush();
        expect(status).toBe(true);
        $httpBackend.verifyNoOutstandingRequest();
    }));
});
describe("cacCountryNeighbors", function() {
    beforeEach(module('cac'));

    it('should return a list of countries when asked',
    inject(function(cacCountryNeighbors, $rootScope, $httpBackend) {
		var status = false;    	
        $httpBackend.expect('GET', 'http://api.geonames.org/neighboursJSON?username=anmcintyre&geonameId=3041565').respond(testData.fakeCountryData);
        cacCountryNeighbors(3041565).success(function(data) {
        	if (data.geonames.length === testData.fakeCountryData.geonames.length)
            	status = true;
        });
        $rootScope.$digest();
        $httpBackend.flush();
        expect(status).toBe(true);
        $httpBackend.verifyNoOutstandingRequest();
    }));
});
describe("cacCountryCapital", function() {
    beforeEach(module('cac'));

    it('should return a list of countries when asked',
    inject(function(cacCountryCapital, $rootScope, $httpBackend) {
		var status = false;    			         
        $httpBackend.expect('GET', 'http://api.geonames.org/searchJSON?username=anmcintyre&country=AT&featureCode=PPLC&name_equals=Austria').respond(testData.fakeCountryData.geonames[0]);
        cacCountryCapital("Austria", "AT").success(function(data) {        	
        	if (data.countryCode === testData.fakeCountryData.geonames[0].countryCode)
            	status = true;
        });
        $rootScope.$digest();
        $httpBackend.flush();
        expect(status).toBe(true);
        $httpBackend.verifyNoOutstandingRequest();
    }));
});   

describe("cac", function() {
    beforeEach(module("cac"));

    describe("/ route", function() {
        it('should load the template and controller',
        inject(function($location, $rootScope, $httpBackend, $route) {
        	$httpBackend.whenGET('home.html').respond('...');
            $rootScope.$apply(function() {
                $location.path('/');
            });
            expect($route.current.controller).toBe("HomeCtrl");
            expect($route.current.loadedTemplateUrl).toBe("home.html");

        	$httpBackend.flush();
            $httpBackend.verifyNoOutstandingRequest();
            $httpBackend.verifyNoOutstandingExpectation();             
        }));
    });

    describe("/countries route", function() {
        it('should load the template and controller',
        inject(function($location, $rootScope, $httpBackend, $route) {
        	$httpBackend.whenGET('countries.html').respond('...');
            $rootScope.$apply(function() {
                $location.path('/countries');
            });

            $httpBackend.flush();
            expect($route.current.controller).toBe("CountriesCtrl");
            expect($route.current.loadedTemplateUrl).toBe("countries.html");

            $httpBackend.verifyNoOutstandingRequest();
            $httpBackend.verifyNoOutstandingExpectation();            
        }));
    }); 

    describe("/countries/:country/capital route", function() {
        it('should load the template and controller',
        inject(function($location, $rootScope, $httpBackend, $route) {
        	$httpBackend.whenGET('country.html').respond('...');
            $rootScope.$apply(function() {
                $location.path('/countries/US/capital');
            });
            expect($route.current.controller).toBe("CountryCtrl");
            expect($route.current.loadedTemplateUrl).toBe("country.html");

            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingRequest();
            $httpBackend.verifyNoOutstandingExpectation();            
        }));
    }); 

   describe('HomeCtrl', function() {
        var scope;
        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            $controller('HomeCtrl', {
	            $scope : scope
	        });
        }));

        it('should should set isLoading to false', function() {
 			expect(scope.isLoading).toBe(false);  
        });
    });

    
    describe('CountriesCtrl', function() {
        var ctrl, scope, httpBackend;
        beforeEach(inject(function($controller, $rootScope, $httpBackend) {
            scope = $rootScope.$new();
            httpBackend = $httpBackend;

            createController = function(){
            	return $controller('CountriesCtrl', {
	                $scope : scope,
	                $http: httpBackend
	            });
            };
        }));

        it('should should set isLoading to false and set the countries', function() {
        	httpBackend.expect('GET', 'http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=anmcintyre&style=full').respond(testData.fakeCountryData);
        	createController();
        	httpBackend.flush();
 			expect(scope.isLoading).toBe(false);  
 			expect(scope.countries.length).toBe(testData.fakeCountryData.geonames.length);
        });
    });

    describe('CountryCtrl', function() {
        var scope, httpBackend, routeParams;
        beforeEach(inject(function($controller, $rootScope, $httpBackend, $routeParams) {
            scope = $rootScope.$new();
            httpBackend = $httpBackend;
            routeParams = $routeParams;
            routeParams.country="AD";

            createController = function(){
            	return $controller('CountryCtrl', {
	                $scope : scope,
	                $http: httpBackend,
	                $routeParms : routeParams
	            });
            };
        }));

        it('should should set isLoading to false and set the country, neighbors, and capital population', function() {
        	//Get specific Country
	        httpBackend.expect('GET', 'http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=anmcintyre&style=full&country=AD').respond({geonames : [ testData.fakeCountryData.geonames[0] ]});

	        //Get neighbors
        	httpBackend.expect('GET', 'http://api.geonames.org/neighboursJSON?username=anmcintyre&geonameId=3041565').respond(testData.fakeCountryData);

        	//Get Capital Data
       		httpBackend.expect('GET', 'http://api.geonames.org/searchJSON?username=anmcintyre&country=AD&featureCode=PPLC&name_equals=Andorra+la+Vella').respond({geonames : [ testData.fakeCountryData.geonames[0] ]});

	       	createController();
        	httpBackend.flush();
 			expect(scope.isLoading).toBe(false);  
 			expect(scope.country.countryName).toBe("Andorra");
			expect(scope.neighbors.length).toBe(testData.fakeCountryData.geonames.length);
 			expect(scope.cityPopulation).toBe('84000');
        });
    });

});
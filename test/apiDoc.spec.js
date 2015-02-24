var express = require('express');
var apiDoc = require('../.');

function getApiDocumentation(middlewareFunctions, requirePublic, route) {
	route = route || '/myGet';
	var mockHttp = getMockHttp(route, middlewareFunctions);
	var jsonSpy = sinon.spy();
	var routeHandlerToTest = apiDoc(mockHttp, {cache: false, showNonPublic: !requirePublic});
	var reqMock = {};
	var resMock = {
		json: jsonSpy
	};
	routeHandlerToTest(reqMock, resMock, sinon.spy());
	return jsonSpy.args[0][0];
}

function getMockHttp(route, middlewareFunctions) {
	var http = express();
	http.get.apply(http, [route].concat(middlewareFunctions));
	http.get = sinon.spy();
	return http;
}

describe('apiDoc', function () {
	describe('with a simple GET route', function () {
		var apiDocumentation;

		before(function () {
			apiDocumentation = getApiDocumentation([sinon.spy()]);
		});

		it('returns correct documentation', function () {
			expect(apiDocumentation).to.eql({
				'/myGet': {
					get: {}
				}
			});
		});
	});

	describe('with a simple GET route with route versions', function () {
		var apiDocumentation;

		before(function () {
			apiDocumentation = getApiDocumentation([sinon.spy()], false, '/api/expenses/:version(v3|v2|v1)');
		});

		it('returns correct documentation', function () {
			expect(apiDocumentation).to.eql({
				'/api/expenses/v3': {
					get: {}
				}
			});
		});
	});

	describe('with a GET route with a single .doc when not public', function () {
		var apiDocumentation;

		before(function () {
			function myCallback1() {
			}

			myCallback1.doc = {};
			apiDocumentation = getApiDocumentation([myCallback1], true);
		});

		it('returns correct documentation', function () {
			expect(apiDocumentation).to.eql({});
		});
	});
	describe('with a GET route with a single .doc when public', function () {
		var apiDocumentation;

		before(function () {
			function myCallback1() {
			}

			myCallback1.doc = {
				isPublic: true
			};
			apiDocumentation = getApiDocumentation([myCallback1], true);
		});

		it('returns correct documentation', function () {
			expect(apiDocumentation).to.eql({
				'/myGet': {
					get: {
						isPublic: true
					}
				}
			});
		});
	});
	describe('with a GET route with a single .doc when not public but showNonPublic', function () {
		var apiDocumentation;

		before(function () {
			function myCallback1() {
			}

			myCallback1.doc = {};
			apiDocumentation = getApiDocumentation([myCallback1]);
		});

		it('returns correct documentation', function () {
			expect(apiDocumentation).to.eql({
				'/myGet': {
					get: {}
				}
			});
		});
	});
	describe('with a GET route with a single .doc defined', function () {
		var apiDocumentation;

		before(function () {
			function myCallback1() {
			}

			myCallback1.doc = {
				produces: 'application/json',
				consumes: 'application/json',
				httpStatus: {
					"200": 'JSON',
					"401": 'Error1'
				}
			};
			apiDocumentation = getApiDocumentation([myCallback1]);
		});

		it('returns correct documentation', function () {
			expect(apiDocumentation).to.eql({
				'/myGet': {
					get: {
						produces: 'application/json',
						consumes: 'application/json',
						httpStatus: {
							"200": 'JSON',
							"401": 'Error1'
						}
					}
				}
			});
		});
	});

	describe('with a GET route with a two middlewares with .doc defined', function () {
		var apiDocumentation;

		before(function () {
			function myCallback1() {
			}

			myCallback1.doc = {
				consumes: 'application/json',
				httpStatus: {
					"200": 'JSON'
				}
			};
			function myCallback2() {
			}

			myCallback2.doc = {
				produces: 'application/json',
				httpStatus: {
					"300": 'My message',
					"500": 'Internal Error'
				}
			};
			apiDocumentation = getApiDocumentation([myCallback1, myCallback2]);
		});

		it('returns merged documentation', function () {
			expect(apiDocumentation).to.eql({
				'/myGet': {
					get: {
						produces: 'application/json',
						consumes: 'application/json',
						httpStatus: {
							"200": 'JSON',
							"300": 'My message',
							"500": 'Internal Error'
						}
					}
				}
			});
		});
	});
});
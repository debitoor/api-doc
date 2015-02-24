var apiDocCache = null;
var mergeDocs = require('./mergeDocs');
var schemagic = require('schemagic');
// options (object):
// - showNonPublic (boolean), default:true
// - cache: (boolean), default:true - should the api documentation be cached

module.exports = function (http, options) {
	if (!http) {
		throw new Error('You must pass express application to api-doc');
	}
	var useCache = options && options.cache === false ? false : true; //default: true
	returnApiDocumentationMiddleware.doc = {
		produces:'application/json',
		httpStatus:{
			"200":'JSON'
		},
		example: schemagic.apidoc.exampleJson
	};
	return returnApiDocumentationMiddleware;

	function returnApiDocumentationMiddleware(req, res, next) {
		if (!useCache || !apiDocCache) {
			populateApiDocCache();
		}
		return res.json(apiDocCache); //use cached version

		function populateApiDocCache() {
			var output = {};
			http._router.stack.forEach(function(layer) {
				if (layer.route) {
					var path = layer.route.path;
					path = path.replace(/:version\((v\d+)(?:\|v\d+)*\)/, '$1'); // 'version:(v3|v2|v1)' -> 'v3'
					var doc = getInlineDocumentationForHandlers(layer.route.stack);
					if (layer.route.methods && (options.showNonPublic || doc.isPublic)) {
						output[path] = output[path] || {};
						Object.keys(layer.route.methods).filter(isValidVerb).forEach(function(methodType) {
							output[path][methodType] = doc;
						});
					}
				}
			});

			apiDocCache = output;
		}
	}

	function isValidVerb(verb) {
		return verb in {'get': true, 'put': true, 'post': true, 'delete': true, 'patch': true};
	}

	function getInlineDocumentationForHandlers(routes) {
		return routes
			.map(function (handler) {
				return handler.handle.doc;
			})
			.filter(function (doc) {
				return doc;
			})
			.reduce(mergeDocs, {});
	}
};

module.exports.resetCache = function () {
	apiDocCache = null;
};

module.exports.mergeDocs = mergeDocs;
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
		produces: 'application/json',
		httpStatus: {
			"200": 'JSON'
		},
		example: schemagic.apidoc.exampleJson
	};
	return returnApiDocumentationMiddleware;

	function returnApiDocumentationMiddleware(req, res, next) {
		if (!useCache || !apiDocCache) {
			apiDocCache = getApiDocs(http, options);
		}
		return res.json(apiDocCache); //use cached version

	}
};

function getApiDocs(http, options) {
	if (!http) {
		throw new Error('You must pass express application to api-doc');
	}
	var output = {};
	http._router.stack.forEach(handleLayer.bind(null, ''));
	return output;

	function handleLayer(root, layer) {
		if (layer.route) {
			var path = layer.route.path;
			path = path.replace(/:version\((v\d+)(?:\|v\d+)*\)/, '$1'); // 'version:(v3|v2|v1)' -> 'v3'
			var doc = getInlineDocumentationForHandlers(layer.route.stack);
			if (layer.route.methods && (options.showNonPublic || doc.isPublic)) {
				output[root + path] = output[root + path] || {};
				Object.keys(layer.route.methods).filter(isValidVerb).forEach(function (methodType) {
					output[root + path][methodType] = process(doc);
				});
			}
		} else if (layer.handle && layer.handle.stack && layer.handle.stack.length) {
			var route = layer.handle.doc || normalize(layer.regexp.source);
			layer.handle.stack.forEach(handleLayer.bind(null, root + route));
		}
	}
}

function process(doc) {
	if (isexampleJson(doc.example)) {
		doc.produces = doc.consumes = 'application/json';
	} else if (isexampleJson(doc.exampleResult)) {
		doc.consumes = 'application/json';
	}
	if (doc.exampleResult && !doc.example) {
		doc.example = '//No need to pass any content in the body.';
	}
	return doc;

	function isexampleJson(example) {
		try {
			schemagic.parseExampleJson(example);
			return true;
		} catch (ex) {
			return false;
		}
	}
}

function normalize(regexp) {
	return regexp.replace(/^[^]/g, '').replace(/\\[/]/g, '/').replace('/?(?=\/|$)', '');
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


module.exports.resetCache = function () {
	apiDocCache = null;
};

module.exports.mergeDocs = mergeDocs;
module.exports.getApiDoc = getApiDocs;
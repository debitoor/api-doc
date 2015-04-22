var xtend = require('xtend');

//merged two .doc's for two middlewares
module.exports = function (doc1In, doc2In) {
	if(!doc1In){
		return doc2In || {};
	}
	if(!doc2In){
		return doc1In || {};
	}
	var doc1 = JSON.parse(JSON.stringify(doc1In)); //clone
	var doc2 = JSON.parse(JSON.stringify(doc2In));
	if (doc1.httpStatus && doc2.httpStatus) {
		//copy doc1 status codes onto doc2
		for(var code in doc1.httpStatus){
			if(doc2.httpStatus[code]){
				//code exists in both docs, join descriptive text
				doc2.httpStatus[code] += '. ' + doc1.httpStatus[code];
			} else {
				doc2.httpStatus[code] = doc1.httpStatus[code];
			}
		}
	}
	if (doc1.description && doc2.description) {
		doc2.description += '\n' + doc1.description;
	}
	var doc = xtend(doc1, doc2);
	return doc;
};
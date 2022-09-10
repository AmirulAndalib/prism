import { insertBefore } from '../shared/language-util.js';
import javascript from './prism-javascript.js';

export default /** @type {import("../types").LanguageProto<'mongodb'>} */ ({
	id: 'mongodb',
	require: javascript,
	grammar({ extend }) {
		let operators = [
			// query and projection
			'$eq', '$gt', '$gte', '$in', '$lt', '$lte', '$ne', '$nin', '$and', '$not', '$nor', '$or',
			'$exists', '$type', '$expr', '$jsonSchema', '$mod', '$regex', '$text', '$where', '$geoIntersects',
			'$geoWithin', '$near', '$nearSphere', '$all', '$elemMatch', '$size', '$bitsAllClear', '$bitsAllSet',
			'$bitsAnyClear', '$bitsAnySet', '$comment', '$elemMatch', '$meta', '$slice',

			// update
			'$currentDate', '$inc', '$min', '$max', '$mul', '$rename', '$set', '$setOnInsert', '$unset',
			'$addToSet', '$pop', '$pull', '$push', '$pullAll', '$each', '$position', '$slice', '$sort', '$bit',

			// aggregation pipeline stages
			'$addFields', '$bucket', '$bucketAuto', '$collStats', '$count', '$currentOp', '$facet', '$geoNear',
			'$graphLookup', '$group', '$indexStats', '$limit', '$listLocalSessions', '$listSessions', '$lookup',
			'$match', '$merge', '$out', '$planCacheStats', '$project', '$redact', '$replaceRoot', '$replaceWith',
			'$sample', '$set', '$skip', '$sort', '$sortByCount', '$unionWith', '$unset', '$unwind', '$setWindowFields',

			// aggregation pipeline operators
			'$abs', '$accumulator', '$acos', '$acosh', '$add', '$addToSet', '$allElementsTrue', '$and',
			'$anyElementTrue', '$arrayElemAt', '$arrayToObject', '$asin', '$asinh', '$atan', '$atan2',
			'$atanh', '$avg', '$binarySize', '$bsonSize', '$ceil', '$cmp', '$concat', '$concatArrays', '$cond',
			'$convert', '$cos', '$dateFromParts', '$dateToParts', '$dateFromString', '$dateToString', '$dayOfMonth',
			'$dayOfWeek', '$dayOfYear', '$degreesToRadians', '$divide', '$eq', '$exp', '$filter', '$first',
			'$floor', '$function', '$gt', '$gte', '$hour', '$ifNull', '$in', '$indexOfArray', '$indexOfBytes',
			'$indexOfCP', '$isArray', '$isNumber', '$isoDayOfWeek', '$isoWeek', '$isoWeekYear', '$last',
			'$last', '$let', '$literal', '$ln', '$log', '$log10', '$lt', '$lte', '$ltrim', '$map', '$max',
			'$mergeObjects', '$meta', '$min', '$millisecond', '$minute', '$mod', '$month', '$multiply', '$ne',
			'$not', '$objectToArray', '$or', '$pow', '$push', '$radiansToDegrees', '$range', '$reduce',
			'$regexFind', '$regexFindAll', '$regexMatch', '$replaceOne', '$replaceAll', '$reverseArray', '$round',
			'$rtrim', '$second', '$setDifference', '$setEquals', '$setIntersection', '$setIsSubset', '$setUnion',
			'$size', '$sin', '$slice', '$split', '$sqrt', '$stdDevPop', '$stdDevSamp', '$strcasecmp', '$strLenBytes',
			'$strLenCP', '$substr', '$substrBytes', '$substrCP', '$subtract', '$sum', '$switch', '$tan',
			'$toBool', '$toDate', '$toDecimal', '$toDouble', '$toInt', '$toLong', '$toObjectId', '$toString',
			'$toLower', '$toUpper', '$trim', '$trunc', '$type', '$week', '$year', '$zip', '$count', '$dateAdd',
			'$dateDiff', '$dateSubtract', '$dateTrunc', '$getField', '$rand', '$sampleRate', '$setField', '$unsetField',

			// aggregation pipeline query modifiers
			'$comment', '$explain', '$hint', '$max', '$maxTimeMS', '$min', '$orderby', '$query',
			'$returnKey', '$showDiskLoc', '$natural',
		];

		const builtinFunctions = [
			'ObjectId',
			'Code',
			'BinData',
			'DBRef',
			'Timestamp',
			'NumberLong',
			'NumberDecimal',
			'MaxKey',
			'MinKey',
			'RegExp',
			'ISODate',
			'UUID',
		];

		operators = operators.map((operator) => {
			return operator.replace('$', '\\$');
		});

		const operatorsSource = '(?:' + operators.join('|') + ')\\b';

		const mongodb = extend('javascript', {});

		insertBefore(mongodb, 'string', {
			'property': {
				pattern: /(?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)(?=\s*:)/,
				greedy: true,
				inside: {
					'keyword': RegExp('^([\'"])?' + operatorsSource + '(?:\\1)?$')
				}
			}
		});

		const string = /** @type {import('../types').GrammarToken} */ (mongodb['string']);
		string.inside = {
			url: {
				// url pattern
				pattern: /https?:\/\/[-\w@:%.+~#=]{1,256}\.[a-z0-9()]{1,6}\b[-\w()@:%+.~#?&/=]*/i,
				greedy: true
			},
			entity: {
				// ipv4
				pattern: /\b(?:(?:[01]?\d\d?|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d\d?|2[0-4]\d|25[0-5])\b/,
				greedy: true
			}
		};

		insertBefore(mongodb, 'constant', {
			'builtin': {
				pattern: RegExp('\\b(?:' + builtinFunctions.join('|') + ')\\b'),
				alias: 'keyword'
			}
		});

		return mongodb;
	}
});

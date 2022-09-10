import { insertBefore } from '../shared/language-util.js';
import scheme from './prism-scheme.js';

export default /** @type {import("../types").LanguageProto<'racket'>} */ ({
	id: 'racket',
	require: scheme,
	alias: 'rkt',
	grammar({ extend }) {
		const racket = extend('scheme', {
			'lambda-parameter': {
				// the racket lambda syntax is a lot more complex, so we won't even attempt to capture it.
				// this will just prevent false positives of the `function` pattern
				pattern: /([(\[]lambda\s+[(\[])[^()\[\]'\s]+/,
				lookbehind: true
			}
		});

		insertBefore(racket, 'string', {
			'lang': {
				pattern: /^#lang.+/m,
				greedy: true,
				alias: 'keyword'
			}
		});

		return racket;
	}
});

const Tapable = require('tapable');

console.log(Tapable);

class AsyncPlugin {
	apply(compiler) {
		compiler.plugin('emit', (...args) => {
			console.log('emited');
			console.log(`emited arguments: ${args}`);
		})
	}
}


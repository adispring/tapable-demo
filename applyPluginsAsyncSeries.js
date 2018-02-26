/* eslint no-shadow: 0 */
/** 
 * webpack compiler event hooks reference: https://webpack.js.org/api/compiler/#event-hooks
 * 'emit' is an async event hook, so we use 'emit' to illustrate applyPluginAsyncSeries.
 */

/**
 * Tapable.prototype.applyPluginsAsyncSeries = Tapable.prototype.applyPluginsAsync = function applyPluginsAsyncSeries(name) {
	var args = Array.prototype.slice.call(arguments, 1);
	var callback = args.pop();
	var plugins = this._plugins[name];
	if(!plugins || plugins.length === 0) return callback();
	var i = 0;
	var _this = this;
	args.push(copyProperties(callback, function next(err) {
		if(err) return callback(err);
		i++;
		if(i >= plugins.length) {
			return callback();
		}
		plugins[i].apply(_this, args);
	}));
	plugins[0].apply(this, args);
};
 */
const Tapable = require('tapable');

function Compiler() {
  Tapable.call(this);
}

Compiler.prototype = Object.create(Tapable.prototype);
Compiler.prototype.run = function() {
  console.log('Running Compiler');
  this.applyPluginsAsync('emit', compilation, err => {
		if (err) return;
		console.log('emit end.');
	});
}

const compiler = new Compiler();

function CustomPlugin(options) {
  this.name = options.name;
};

/*
Tapable.prototype.plugin = function plugin(name, fn) {
	if(Array.isArray(name)) {
		name.forEach(function(name) {
			this.plugin(name, fn);
		}, this);
		return;
	}
	if(!this._plugins[name]) this._plugins[name] = [fn];
	else this._plugins[name].push(fn);
};
*/

CustomPlugin.prototype.apply = function(compiler) {
  // 调用 compiler.plugin，将 CustomPlugin 实例的回调函数注册到
  // compiler 的 'emit' 事件上，compiler 是继承自 Tapable 的实例。
  compiler.plugin('emit', (...args) => {
    console.log(`hello, ${this.name}`);
    console.log(`emit arguments: ${args}`);
  });
};

const custom1Plugin = new CustomPlugin({ name: 'adi' });
const custom2Plugin = new CustomPlugin({ name: 'spring' });

/*
Tapable.prototype.apply = function apply() {
	for(var i = 0; i < arguments.length; i++) {
		arguments[i].apply(this);
	}
};
*/

compiler.apply(custom1Plugin, custom2Plugin);

// compiler.applyPlugins('emit', 'webpack', 'running');
compiler.run();
/* custom1Plugin.apply(compiler);*/

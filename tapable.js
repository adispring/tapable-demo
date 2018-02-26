/**  
 * Tapable Class
 */
function Tapable() {
	this._plugins = {};
}

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

Tapable.prototype.apply = function apply() {
	for(var i = 0; i < arguments.length; i++) {
		arguments[i].apply(this);
	}
};

Tapable.prototype.applyPlugins = function applyPlugins(name) {
	if(!this._plugins[name]) return;
	var args = Array.prototype.slice.call(arguments, 1);
	var plugins = this._plugins[name];
	for(var i = 0; i < plugins.length; i++)
		plugins[i].apply(this, args);
};

/** 
 * class Compiler extends Tapable
*/
function Compiler() {
  Tapable.call(this);
}

Compiler.prototype = Object.create(Tapable.prototype);
Compiler.prototype.run = function() {
  console.log('Running Compiler');
  this.applyPlugins('emit');
}

const compiler = new Compiler();

compiler.plugin('emit', () => console.log('emited'));
compiler.plugin('emit', () => console.log('emited2'));
compiler.applyPlugins('emit');

/**
 * Plugin Class
 * @param {object} options Plugin 配置项
 */
function CustomPlugin(options) {
  this.name = options.name;
};

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

compiler.apply(custom1Plugin, custom2Plugin);

// compiler.applyPlugins('emit', 'webpack', 'running');
compiler.run();


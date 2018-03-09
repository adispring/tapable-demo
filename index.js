/****************************************************
 * 1. Tapable 源码
 */

function Tapable() {
	// 存放事件和对应插件的内部对象
	this._plugins = {};
}

/**
 * 将回调函数 fn 注册到事件 ${name} 上
 * @param {string | array} name 注册事件
 * @param {function} fn 注册事件的回调函数
 */
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

/**
 * 批量注册插件
 * @param {array} arguments 插件列表
 */
Tapable.prototype.apply = function apply() {
	for(var i = 0; i < arguments.length; i++) {
		arguments[i].apply(this);
	}
};

/**
 * 触发事件
 * @param {string} name 事件名称
 */
Tapable.prototype.applyPlugins = function applyPlugins(name) {
	if(!this._plugins[name]) return;
	var args = Array.prototype.slice.call(arguments, 1);
	var plugins = this._plugins[name];
	for(var i = 0; i < plugins.length; i++)
		plugins[i].apply(this, args);
};


/****************************************************
 * 2. Compiler 源码 Demo
 * class Compiler extends Tapable
*/
class Compiler extends Tapable {
	constructor(options) {
		super(options)
	}
	run() {
  	console.log('Running Compiler');
	  this.applyPlugins('compilation');
    this.applyPlugins('emit');
	}
}

// function Compiler() {
//   Tapable.call(this);
// }

// Compiler.prototype = Object.create(Tapable.prototype);
// Compiler.prototype.run = function() {
// 	console.log('Running Compiler');
// 	this.applyPlugins('compilation');
//   this.applyPlugins('emit');
// }

const compiler = new Compiler();

compiler.plugin('emit', () => console.log('emited'));
compiler.plugin('compilation', compilation => console.log(`compilation produced by compiler: ${JSON.stringify(compilation, null, 2)}`));
compiler.applyPlugins('emit');
compiler.applyPlugins('compilation', { options: { name: 'compilation-demo'}, compiler })


/****************************************************
 * 3. 如何自定义一个插件
 */

function Custom0Plugin(options) {
  /** config plugin instance with options */
};

Custom0Plugin.prototype.apply = function(compiler) {
  compiler.plugin('eventHook', (...args) => {
    /** do sth when the registered event trigged */
  });
};

/**
 * 插件
 * @param {object} options 插件配置项
 */
function CustomPlugin(options) {
  this.name = options.name;
};

/**
 * 插件注册方法
 * @param {object} compiler 
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

const compiler2 = new Compiler();

compiler2.apply(custom1Plugin, custom2Plugin);

// compiler.applyPlugins('emit', 'webpack', 'running');
compiler2.run();

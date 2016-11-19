	__nest__ (
		__all__,
		'compat', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var common = {};
					if (!(window.transpiler)) {
						window.transpiler = 'Transcrypt';
						__nest__ (common, '', __init__ (__world__.common));
					}
					var _new = function (cls, arg) {
						return new cls (arg);
					};
					var _print = print;
					var stdlib = null;
					var JS = function (code) {
						window.eval (code);
					};
					__pragma__ ('<use>' +
						'common' +
					'</use>')
					__pragma__ ('<all>')
						__all__.JS = JS;
						__all__._new = _new;
						__all__._print = _print;
						__all__.stdlib = stdlib;
					__pragma__ ('</all>')
				}
			}
		}
	);

	__nest__ (
		__all__,
		'compat', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					print ('Hello from Transcrypt');
					var _new = function (cls, arg) {
						return new cls (arg);
					};
					var _print = print;
					var stdlib = null;
					__pragma__ ('<all>')
						__all__._new = _new;
						__all__._print = _print;
						__all__.stdlib = stdlib;
					__pragma__ ('</all>')
				}
			}
		}
	);

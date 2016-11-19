	__nest__ (
		__all__,
		'common', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var ՐՏ_print = __init__ (__world__.compat)._print;
					print ('>> Hello from <b>Python</b>!');
					print ((window.transpiler + ' running under ') + navigator.userAgent);
					print ((navigator.platform + ' ') + navigator.language);
					print ("<div id='__header__'><a href='index.html'>rapydscript</a> - " + "<a href='index_transcrypt.html'>transcrypt</a></div>");
					__pragma__ ('<use>' +
						'compat' +
					'</use>')
					__pragma__ ('<all>')
						__all__.ՐՏ_print = ՐՏ_print;
					__pragma__ ('</all>')
				}
			}
		}
	);

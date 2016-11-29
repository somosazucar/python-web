	__nest__ (
		__all__,
		'common', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var ՐՏ_print = __init__ (__world__.compat)._print;
					var start_ide = function () {
						print ('>>> Hello from <b>Python</b>!');
						print ((('<b>' + window.transpiler) + '</b> running under ') + navigator.userAgent);
						print ((navigator.platform + ' ') + navigator.language);
						print (((((((("<div id='__header__'>" + "<img src='") + window.colors.asset) + "'><br>") + '<b>Compilers:</b>') + "<ul><li><a href='index.html'>rapydscript</a></li>") + "<li><a href='index_transcrypt.html'>transcrypt</a></li>") + '</ul>') + '</div>');
					};
					window.start_ide = start_ide;
					__pragma__ ('<use>' +
						'compat' +
					'</use>')
					__pragma__ ('<all>')
						__all__.start_ide = start_ide;
						__all__.ՐՏ_print = ՐՏ_print;
					__pragma__ ('</all>')
				}
			}
		}
	);

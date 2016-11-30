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
						print ("<br><h1><a href='https://github.com/somosazucar/python-web'>" + 'Python Browser Compatibility Layer</a></h1>');
						print ("<br><img src='./docs/images/uroboros_head.png'>");
						print (((((((((((("<div id='__header__'>" + "<button style='padding: 10px; border-radius: 5px' ") + 'onclick=\'location.href="https://github.com/somosazucar/python-web/blob/master/src/main.py"\'>') + '⚙ View Source for this Example</button><br><br>') + "<iframe src='https://ghbtns.com/github-btn.html?user=somosazucar&repo=python-web&type=star&count=true&size=large' frameborder='0' scrolling='0' width='128px' height='30px'></iframe><br>") + "<br><img src='") + window.colors.asset) + "'><br>") + '<b>Compilers:</b>') + "<p><a href='index.html'>rapydscript</a></p>") + "<p><a href='index_transcrypt.html'>transcrypt</a></p>") + '</ul>') + '</div>');
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

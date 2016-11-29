from compat import _print as ՐՏ_print

def start_ide():
    print(">>> Hello from <b>Python</b>!")
    print("<b>" + window.transpiler + "</b> running under " + navigator.userAgent)
    print(navigator.platform + " " + navigator.language)

    print("<div id='__header__'>" +
          "<img src='" + window.colors.asset + "'><br>" +
          "<b>Compilers:</b>" +
          "<ul><li><a href='index.html'>rapydscript</a></li>" +
          "<li><a href='index_transcrypt.html'>transcrypt</a></li>" +
          "</ul>" +
          "</div>")

window.start_ide = start_ide

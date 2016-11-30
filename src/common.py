from compat import _print as ՐՏ_print

def start_ide():
    print(">>> Hello from <b>Python</b>!")
    print("<b>" + window.transpiler + "</b> running under " + navigator.userAgent)
    print(navigator.platform + " " + navigator.language)

    print("<br><h1><a href='https://github.com/somosazucar/python-web'>" +
          "Python Browser Compatibility Layer</a></h1>")

    print("<br><img src='./docs/images/uroboros_head.png'>")

    print("<div id='__header__'>" +
          "<button style='padding: 10px; border-radius: 5px' " +
          "onclick='location.href=\"https://github.com/somosazucar/python-web/blob/master/src/main.py\"'>" +
          "⚙ View Source for this Example</button><br><br>" +
          "<iframe src='https://ghbtns.com/github-btn.html?user=somosazucar&repo=python-web&type=fork&count=true&size=large' frameborder='0' scrolling='0' width='128px' height='30px'></iframe><br>" +
          "<br><img src='" + window.colors.asset + "'><br>" +
          "<b>Compilers:</b>" +
          "<p><a href='index.html'>rapydscript</a></p>" +
          "<p><a href='index_transcrypt.html'>transcrypt</a></p>" +
          "</ul>" +
          "</div>")


window.start_ide = start_ide

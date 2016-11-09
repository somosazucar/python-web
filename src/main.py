import random

from compat import _new

from compat import _print as ՐՏ_print
from compat import stdlib

print("<h1>Educa.Juegos</h1>")
print("<h2>Aprendemos jugando</h1>")
width, height = 400, 100

print("<a href='index_transcrypt.html'>transcrypt</a>")
print("<a href='index.html'>rapydscript</a>")

#
# Game objects
#

class Bola:
    def __init__(self, director):
        self.director = director
        self.to_delete = False
        self.sprite = director.game.circle(10, colors.vibe_light)
        self.sprite.x = width / 2
        self.sprite.y = height / 2
        self.sprite.vy = random.choice([-5, +5])
        self.sprite.vx = random.choice([-1, +1])
        self.recolor()

    def recolor(self):
        self.sprite.fillStyle = random.choice([colors.vibe_light, colors.vibe,
                                               colors.mute, colors.mute_light])

    def destroy(self):
        # self.director.actors.pop(self)
        # del(self)
        self.to_delete = True
        self.sprite.visible = False
        self.director.game.remove(self.sprite)
        self.sprite.destroy()

    def play(self):
        if self.sprite.visible:
            if self.sprite.y > height - self.sprite.height:
                self.sprite.vy *= -1
            if self.sprite.x > width - self.sprite.width:
                # self.sprite.vx *= -1
                self.destroy()
                return
            if self.sprite.y < 0:
                self.sprite.vy *= -1
            if self.sprite.x < 0:
                # self.sprite.vx *= -1
                self.destroy()
                return

            self.director.game.move(self.sprite)


class Director:
    def __init__(self):
        self.game = hexi(width, height, self.setup)
        self.game.fps = 25
        self.tick = False

        self.actors = []

    def setup(self):
        self.recolor()
        self.game.state = self.play
        # self.game.pointer.tap = self.make_bola
        if self.tick != False:
            self.tick = window.setInterval(self.make_bola, 250)

    def recolor(self):
        for actor in self.actors:
            actor.recolor()
        self.game.backgroundColor = colors.mute_dark
        self.rescale()

    def make_bola(self):
        self.actors.append(Bola(self))

    def play(self):
        for index in range(len(self.actors)):
            actor = self.actors[index]
            if actor.to_delete is False:
                actor.play()
            elif actor.to_delete is True:
                self.actors.pop(index)

    def pause(self):
        window.clearInterval(self.tick)
        self.game.pause()

    def resume(self):
        self.tick = window.setInterval(self.make_bola, 250)
        self.game.resume()

    def rescale(self):
        self.game.scaleToWindow(colors.mute)


def setup_styles():
    styles = document.styleSheets[document.styleSheets.length - 1]
    styles.insertRule("h1, h2 { color: " + colors.vibe_light + " }", 0)
    styles.insertRule("h1, h2 { text-align: center; }", 0)
    styles.insertRule("h1, h2 { font-family: 'Indie Flower'; }", 0)
    styles.insertRule("#__terminal__ { color: " + colors.vibe_light + " }", 0)
    styles.insertRule("#__terminal__ { font-family: 'Bitter'; }", 0)
    styles.insertRule("#__prompt__ { font-family: 'Bitter'; position:absolute; bottom: 0; right: 0}", 0)

    if window.educajuego:
        window.educajuego.recolor()

#
# Interface to Vibrant.js
#
class Palette:
    def __init__(self, asset, callback):
        self.callback = callback
        v = _new(Vibrant, asset)
        if v:
            v.getPalette(self.parse)

        self.vibe = "#335533"
        self.vibe_light = "#656565"
        self.vibe_dark = "#0f1f0f"
        self.mute = "#111111"
        self.mute_light = "#333333"
        self.mute_dark = "#222222"

    def parse(self, err, palette=""):
        self.palette = palette
        if palette:
            self.vibe = palette.Vibrant.getHex()
            self.vibe_light = palette.LightVibrant.getHex()
            self.vibe_dark = palette.DarkVibrant.getHex()
            self.mute = palette.Muted.getHex()
            self.mute_light = palette.LightMuted.getHex()
            self.mute_dark = palette.DarkMuted.getHex()

            if self.callback:
                self.callback()


# Entry point
def main():
    if window.educajuego:
        return

    setup_styles()

    educajuego = Director()
    educajuego.game.start()

    window.onblur = educajuego.pause
    window.onfocus = educajuego.resume
    window.onresize = educajuego.rescale

    window.educajuego = educajuego


colors = Palette('assets/hud.png', setup_styles)

main()

import random

from compat import _print as ՐՏ_print
from compat import stdlib
from compat import _new

width, height = 800, 300

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
        self.game.state = self.play
        # self.game.pointer.tap = self.make_bola
        if self.tick is False:
            self.tick = window.setInterval(self.make_bola, 250)

    def recolor(self):
        styles = document.styleSheets[document.styleSheets.length - 1]
        styles.insertRule("#__terminal__ { color: " + colors.vibe_light + " }", 0)
        for actor in self.actors:
            actor.recolor()
        self.game.backgroundColor = colors.mute_dark
        self.rescale()

    def make_bola(self):
        self.actors.append(Bola(self))

    def play(self):
        if self.bgcolor != colors.vibe_dark:
            self.bgcolor = colors.vibe_dark
            self.recolor()
        for index in range(len(self.actors)):
            actor = self.actors[index]
            if actor.to_delete is False:
                actor.play()
            elif actor.to_delete is True:
                self.actors.pop(index)

    def pause(self):
        if self.tick:
            window.clearInterval(self.tick)
            self.tick = False
        self.game.pause()

    def resume(self):
        if not self.tick:
            self.tick = window.setInterval(self.make_bola, 250)
        self.game.resume()

    def rescale(self):
        self.scale = self.game.scaleToWindow(self.bgcolor)


#
# Interface to Vibrant.js
#
class Palette:
    def __init__(self, asset):
        if asset:
            v = _new(Vibrant, asset)
            if v:
                v.getPalette(self.parse)
                self.asset = asset

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


# Entry point
def main():
    if window.educajuego:
        return

    if window.transpiler=='Transcrypt':
        colors = Palette('docs/images/monk_transcribing_logo.png')
    elif window.transpiler=='Rapydscript':
        colors = Palette('docs/images/rs_logo_tiny.png')
    else:
        colors = Palette()

    educajuego = Director()
    educajuego.game.start()

    window.onblur = educajuego.pause
    window.onfocus = educajuego.resume
    window.onresize = educajuego.rescale

    window.colors = colors
    window.educajuego = educajuego

    window.start_ide()

main()

	(function () {
		var random = {};
		__nest__ (random, '', __init__ (__world__.random));
		var ՐՏ_print = __init__ (__world__.compat)._print;
		var stdlib = __init__ (__world__.compat).stdlib;
		var _new = __init__ (__world__.compat)._new;
		var __left0__ = tuple ([800, 300]);
		var width = __left0__ [0];
		var height = __left0__ [1];
		var Bola = __class__ ('Bola', [object], {
			get __init__ () {return __get__ (this, function (self, director) {
				self.director = director;
				self.to_delete = false;
				self.sprite = director.game.circle (10, colors.vibe_light);
				self.sprite.x = width / 2;
				self.sprite.y = height / 2;
				self.sprite.vy = random.choice (list ([-(5), +(5)]));
				self.sprite.vx = random.choice (list ([-(1), +(1)]));
				self.recolor ();
			});},
			get recolor () {return __get__ (this, function (self) {
				self.sprite.fillStyle = random.choice (list ([colors.vibe_light, colors.vibe, colors.mute, colors.mute_light]));
			});},
			get destroy () {return __get__ (this, function (self) {
				self.to_delete = true;
				self.sprite.visible = false;
				self.director.game.remove (self.sprite);
				self.sprite.destroy ();
			});},
			get play () {return __get__ (this, function (self) {
				if (self.sprite.visible) {
					if (self.sprite.y > height - self.sprite.height) {
						self.sprite.vy *= -(1);
					}
					if (self.sprite.x > width - self.sprite.width) {
						self.destroy ();
						return ;
					}
					if (self.sprite.y < 0) {
						self.sprite.vy *= -(1);
					}
					if (self.sprite.x < 0) {
						self.destroy ();
						return ;
					}
					self.director.game.move (self.sprite);
				}
			});}
		});
		var Director = __class__ ('Director', [object], {
			get __init__ () {return __get__ (this, function (self) {
				self.game = hexi (width, height, self.setup);
				self.game.backgroundColor = 'ffffff';
				self.game.fps = 25;
				self.tick = false;
				self.actors = list ([]);
			});},
			get setup () {return __get__ (this, function (self) {
				self.game.state = self.play;
				if (self.tick === false) {
					self.tick = window.setInterval (self.make_bola, 250);
				}
			});},
			get recolor () {return __get__ (this, function (self) {
				var styles = document.styleSheets [document.styleSheets.length - 1];
				styles.insertRule (('#__terminal__ { color: ' + colors.vibe_light) + ' }', 0);
				self.game.backgroundColor = colors.mute_dark;
				var __iterable0__ = self.actors;
				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
					var actor = __iterable0__ [__index0__];
					actor.recolor ();
				}
				self.rescale ();
			});},
			get make_bola () {return __get__ (this, function (self) {
				self.actors.append (Bola (self));
			});},
			get play () {return __get__ (this, function (self) {
				if (self.bgcolor != colors.mute_dark) {
					self.bgcolor = colors.mute_dark;
					self.recolor ();
				}
				for (var index = 0; index < len (self.actors); index++) {
					var actor = self.actors [index];
					if (actor.to_delete === false) {
						actor.play ();
					}
					else {
						if (actor.to_delete === true) {
							self.actors.py_pop (index);
						}
					}
				}
			});},
			get pause () {return __get__ (this, function (self) {
				if (self.tick) {
					window.clearInterval (self.tick);
					self.tick = false;
				}
				self.game.pause ();
			});},
			get resume () {return __get__ (this, function (self) {
				if (!(self.tick)) {
					self.tick = window.setInterval (self.make_bola, 250);
				}
				self.game.resume ();
			});},
			get rescale () {return __get__ (this, function (self) {
				self.scale = self.game.scaleToWindow (colors.vibe_dark);
			});}
		});
		var Palette = __class__ ('Palette', [object], {
			get __init__ () {return __get__ (this, function (self, asset) {
				if (asset) {
					var v = _new (Vibrant, asset);
					if (v) {
						v.getPalette (self.parse);
						self.asset = asset;
					}
				}
				self.vibe = '#335533';
				self.vibe_light = '#656565';
				self.vibe_dark = '#0f1f0f';
				self.mute = '#111111';
				self.mute_light = '#333333';
				self.mute_dark = '#222222';
			});},
			get parse () {return __get__ (this, function (self, err, palette) {
				if (typeof palette == 'undefined' || (palette != null && palette .__class__ == __kwargdict__)) {;
					var palette = '';
				};
				self.palette = palette;
				if (palette) {
					self.vibe = palette.Vibrant.getHex ();
					self.vibe_light = palette.LightVibrant.getHex ();
					self.vibe_dark = palette.DarkVibrant.getHex ();
					self.mute = palette.Muted.getHex ();
					self.mute_light = palette.LightMuted.getHex ();
					self.mute_dark = palette.DarkMuted.getHex ();
				}
			});}
		});
		var main = function () {
			if (window.educajuego) {
				return ;
			}
			if (window.transpiler == 'Transcrypt') {
				var colors = Palette ('docs/images/monk_transcribing_logo.png');
			}
			else {
				if (window.transpiler == 'Rapydscript') {
					var colors = Palette ('docs/images/rs_logo_tiny.png');
				}
				else {
					var colors = Palette ();
				}
			}
			var educajuego = Director ();
			educajuego.game.start ();
			window.onblur = educajuego.pause;
			window.onfocus = educajuego.resume;
			window.onresize = educajuego.rescale;
			window.colors = colors;
			window.educajuego = educajuego;
			window.start_ide ();
		};
		main ();
		__pragma__ ('<use>' +
			'compat' +
			'random' +
		'</use>')
		__pragma__ ('<all>')
			__all__.Bola = Bola;
			__all__.Director = Director;
			__all__.Palette = Palette;
			__all__._new = _new;
			__all__.height = height;
			__all__.main = main;
			__all__.stdlib = stdlib;
			__all__.width = width;
			__all__.ՐՏ_print = ՐՏ_print;
		__pragma__ ('</all>')
	}) ();

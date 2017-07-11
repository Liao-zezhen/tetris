(function (window) {
	window.FrameUtil = Class.extend({
		init: function () {
			this.currentFrame = 0;
			this.sTime = new Date();
			this.sFrame = 0;
			this.realFps = 0;
		},
		update: function () {
			var t = new Date();
			this.currentFrame++;
			if (t - this.sTime >= 1000) {
				this.realFps = this.currentFrame - this.sFrame;
				this.sFrame = this.currentFrame;
				this.sTime = t;
			}
		}
	});
})(window);
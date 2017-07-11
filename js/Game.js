(function (window) {
	window.Game = Class.extend({
		init: function (params) {
			var self = this;
			this.canvas = document.getElementById(params.canvasId);
			this.ctx = this.canvas.getContext('2d');
			this.fps = params.fps;
			this.timer = null;

			// 静态资源管理。
			this.sr = new StaticResourceUtil();
			this.sr.loadImages('./r.json', function (alreadyLoadNum, allNum, imagesObj) {
				self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
				self.ctx.fillStyle = '#fff';
				self.ctx.fillText(alreadyLoadNum + 'of ' + allNum, 230, 30);
				if (alreadyLoadNum == allNum) {
					self.images = imagesObj;
					// 加载完静态资源后执行程序。
					self.run();
				}
			});
		},
		run: function () {
			var self = this;
			// 帧工具类。
			this.frameUtil = new FrameUtil();

			// 已推起来的方块集合。
			this.map = new Map();

			// 正在活动的方块集合。
			this.ab = new ActiveBlock();

			// 开启主程序。
			this.timer = setInterval(function () {
				self.mainLoop();
			}, 1000 / this.fps);
		},
		// 主程序。
		mainLoop: function () {
			this.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

			// 更新和绘制帧率和帧数。
			this.frameUtil.update();
			this.ctx.fillStyle = '#fff';
			this.ctx.fillText('FPS / ' + this.frameUtil.realFps, 230, 380);
			this.ctx.fillText('FNO / ' + this.frameUtil.currentFrame, 230, 400);

			// 绘制已推起来的方块集合里的方块细胞。
			this.map.renderAllBlocks();

			// 绘制正在活动的方块集合里的方块细胞。
			this.ab.renderAllBlocks();

			// 正在活动的方块集合整体向下移动。
			if (this.frameUtil.currentFrame % 30 == 0) {
				this.ab.goDown();
			}

		},
		stop: function () {
			clearInterval(this.timer);
		}
	});
})(window);
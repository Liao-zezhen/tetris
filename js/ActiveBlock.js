(function (window) {
	// 活动方块的形状集合。
	var type = {
		'I': [
			['0100', '0100', '0100', '0100'],
			['0000', '1111', '0000', '0000']
		],
		'L': [
			['0200', '0200', '0220', '0000'],
			['0000', '2220', '2000', '0000'],
			['2200', '0200', '0200', '0000'],
			['0020', '2220', '0000', '0000']
		],
		'J': [
			['0300', '0300', '3300', '0000'],
			['3000', '3330', '0000', '0000'],
			['0330', '0300', '0300', '0000'],
			['0000', '3330', '0030', '0000']
		],
		'Z': [
			['4400', '0440', '0000', '0000'],
			['0400', '4400', '4000', '0000']
		],
		'S': [
			['0550', '5500', '0000', '0000'],
			['0500', '0550', '0050', '0000']
		],
		'T': [
			['6660', '0600', '0000', '0000'],
			['0060', '0660', '0060', '0000'],
			['0600', '6660', '0000', '0000'],
			['6000', '6600', '6000', '0000']
		],
		'O': [
			['7700', '7700', '0000', '0000']
		]
	};
	window.ActiveBlock = Class.extend({
		init: function (row, col) {
			this.row = row || 0;
			this.col = col || 4;

			// 随机生成方块集合的形状和方向。
			var typeChar = 'ILJZSTO';
			this.randomTypeChar = typeChar.charAt(Math.round(Math.random() * 6));
			this.directionAmount = type[this.randomTypeChar].length;
			this.direction = Math.round(Math.random() * (this.directionAmount - 1));
			this.shapeMap = type[this.randomTypeChar][this.direction];

			// 方块细胞集合。
			this.shape = [
				[null, null, null, null],
				[null, null, null, null],
				[null, null, null, null],
				[null, null, null, null]
			];

			// 绑定事件。
			this.bindListener();

			// 根据方块集合生成方块细胞。
			this.createBlocksByMyMap();
		},
		// 根据方块集合写入方块细胞。
		createBlocksByMyMap: function () {
			var r, c, colorChar;
			for (r = 0; r < 4; r++) {
				for (c = 0; c < 4; c++) {
					colorChar = this.shapeMap[r].charAt(c);
					this.shape[r][c] = colorChar == '0' ? null : new CellBlock(this.row + r, this.col + c, colorChar);
				}
			}
		},
		// 绘制方块细胞集合里的方块细胞。
		renderAllBlocks: function () {
			var r, c;
			for (r = 0; r < 4; r++) {
				for (c = 0; c < 4; c++) {
					this.shape[r][c] && this.shape[r][c].render();
				}
			}
		},
		// 向下移动
		goDown: function () {
			var slice = [];
			for (var r = 1; r < 5; r++) {
				slice.push(game.map.existBlocksMap[this.row + r].substr(this.col + 3, 4));
			}
			if (compareMaps(slice, this.shapeMap)) {
				this.row++;
				this.createBlocksByMyMap();
				return true;
			} else {
				game.map.addShapeIntoMyMap(this);
				game.map.removeComplete();
				game.map.complete();

				game.ab = new ActiveBlock();
				return false;
			}
		},
		// 沉底。
		goBottom: function () {
			while (this.goDown()) {}
		},
		// 向左移动
		goLeft: function () {
			var slice = [];
			for (var r = 0; r < 4; r++) {
				slice.push(game.map.existBlocksMap[this.row + r].substr(this.col + 3 - 1, 4));
			}
			if (compareMaps(slice, this.shapeMap)) {
				this.col--;
				this.createBlocksByMyMap();
			}
		},
		// 向右移动
		goRight: function () {
			var slice = [];
			for (var r = 0; r < 4; r++) {
				slice.push(game.map.existBlocksMap[this.row + r].substr(this.col + 3 + 1, 4));
			}
			if (compareMaps(slice, this.shapeMap)) {
				this.col++;
				this.createBlocksByMyMap();
			}
		},
		// 变换方块集合的方向。
		changeDirection: function () {
			var stepShapeMap = type[this.randomTypeChar][(++this.direction) % this.directionAmount];
			var slice = [];
			for (var r = 0; r < 4; r++) {
				slice.push(game.map.existBlocksMap[this.row + r].substr(this.col + 3, 4));
			}
			if (compareMaps(stepShapeMap, slice)) {
				this.shapeMap = stepShapeMap;
				this.createBlocksByMyMap();
			} else {
				this.direction--;
			}
		},
		// 绑定事件。
		bindListener: function () {
			var self = this;
			// PC事件
			document.onkeydown = function (e) {
				switch (e.keyCode) {
					case 37:
						self.goLeft();
						break;
					case 38:
						self.changeDirection();
						break;
					case 39:
						self.goRight();
						break;
					case 40:
						self.goDown();
						console.log(1);
						break;
				}
			};
			// 手机端事件
			var	startX = 0,
				currX = 0,
				startY = 0,
				currY = 0,
				isStart = false;

			document.ontouchstart = function (e) {
				isStart = true;
				startX = e.changedTouches[0].pageX;
				startY = e.changedTouches[0].pageY;
				this.isMove = false;
				return false;
			};
			document.ontouchmove = function (e) {
				this.isMove = true;

				currX = e.changedTouches[0].pageX;
				currY = e.changedTouches[0].pageY;

				if (currY - startY >= 30 && isStart) {
					self.goDown();
					startY = currY;
				}
				if (currX - startX >= 50 && isStart) {
					self.goRight();
					startX = currX;
				}
				if (startX - currX >= 50 && isStart) {
					self.goLeft();
					startX = currX;
				}
			};
			document.ontouchend = function () {
				if (!this.isMove) {
					self.changeDirection();
				}
			};
		}
	});
	function compareMaps(map1, map2) {
		var r, c;
		for (r = 0; r < 4; r++) {
			for (c = 0; c < 4; c++) {
				// 两个位置都有数据的时候，则阻止后续执行。
				if (map1[r].charAt(c) != 0 && map2[r].charAt(c) != 0) {
					return false;
				}
			}
		}
		return true;
	}
})(window);
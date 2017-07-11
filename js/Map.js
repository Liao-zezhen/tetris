(function (window) {
	window.Map = Class.extend({
		init: function () {
			this.row = 20;
			this.col = 10;

			// 存放着已推起来的方块集合的抽象数据（简称“鸟瞰图”）。
			this.existBlocksMap = [
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxx0000000000xxx',
				'xxxxxxxxxxxxxxxx',
				'xxxxxxxxxxxxxxxx',
				'xxxxxxxxxxxxxxxx'
			];
			// 存放着已推起来的方块集合的真实数据。
			this.existBlocks = [
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null, null, null]
			];

			// 根据鸟瞰图写入真实的方块类。
			this.createBlocksByMyMap();
		},
		// 根据鸟瞰图写入真实的方块类。
		createBlocksByMyMap: function () {
			var r, c, colorChar;
			for (r = 0; r < this.row; r++) {
				for (c = 3; c < this.col + 3; c++) {
					colorChar = this.existBlocksMap[r].charAt(c);
					// 根据鸟瞰图的某个字符是否为零，来写入null或者方块细胞。
					this.existBlocks[r][c - 3] = colorChar == '0' ? null : new CellBlock(r, c - 3, colorChar);
				}
			}
		},
		// 分别绘制真实数据集合当中的方块细胞。
		renderAllBlocks: function () {
			var r, c;
			for (r = 0; r < this.row; r++) {
				for (c = 0; c < this.col; c++) {
					if (this.existBlocks[r][c]) {
						this.existBlocks[r][c].render();
					}
				}
			}
		},
		// 将活动集合与鸟瞰图融合。
		addShapeIntoMyMap: function (ab) {
			var c, r;
			for (r = 0; r < 4; r++) {
				for (c = 0; c < 4; c++) {
					if (ab.shapeMap[r].charAt(c) != 0) {
						this.existBlocksMap[ab.row + r] = strSplice(this.existBlocksMap[ab.row + r], ab.col + 3 + c, ab.shapeMap[r].charAt(c));
					}
				}
			}
			// 融合完毕后，重新根据新的鸟瞰图写入真实的方块类。
			this.createBlocksByMyMap();
		},
		// 满一行，清除当前行。
		removeComplete: function () {
			var r;
			for (r = this.row - 1; r >= 0; r--) {
				if (this.existBlocksMap[r].indexOf('0') == -1) {
					this.existBlocksMap.splice(r, 1);
					r++;
					this.existBlocksMap.unshift('xxx0000000000xxx');
				}
			}
			this.createBlocksByMyMap();
		},
		// 判断方块是否到顶了。
		complete: function () {
			var r,
				reg = /[^x0]/,
				amount = 0;
			for (r = 0; r < this.row; r++) {
				if (reg.test(this.existBlocksMap[r])) {
					amount++;
				}
			}
			// 到顶了，游戏结束。
			if (amount == this.row) {
				game.stop();
			}
		}
	});
	function strSplice(str, offset, value) {
		return str.substring(0, offset) + value + str.substring(offset + 1);
	}
})(window);
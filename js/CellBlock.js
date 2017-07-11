(function (window) {
	// 方块细胞。
	window.CellBlock = Class.extend({
		init: function (row, col, color) {
			this.row = row;
			this.col = col;
			this.color = color;
		},
		// 绘制方块细胞。
		render: function () {
			game.ctx.drawImage(game.images.cellBlock, 20 * (this.color - 1), 0, 20, 20, this.col * 20 + 13, this.row * 20 + 13, 20, 20);
		}
	});
})(window);
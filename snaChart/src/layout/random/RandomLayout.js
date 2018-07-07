/**
 * 随机布局
 * Created by zhongzh on 2017-09-24.
 */
define(function () {

    function randomLayout(data, centerX, centerY, width, height) {
        var nodes = data.nodes;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var sign = (Math.random() * 10 > 5) ? 1 : -1;
            node.x = centerX + Math.random() * width * 0.5 * sign;
            node.y = centerY + Math.random() * height * 0.5 * sign;
        }
    }

    function getLayout(data, topLeft, bottomRight) {
        var width = bottomRight.x - topLeft.x;
        var height = bottomRight.y - topLeft.y;
        var centerX = topLeft.x + width / 2;
        var centerY = topLeft.y + height / 2;
        randomLayout(data, centerX, centerY, width, height);
    }

    return {
        getLayout: getLayout
    }
});

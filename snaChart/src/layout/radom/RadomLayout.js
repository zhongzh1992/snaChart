/**
 * 随机布局
 * Created by zhongzh on 2017-09-24.
 */
define(function () {

    function radomLayout(data,centerX,centerY) {
        var nodes = data.nodes;
        for(var i=0;i<nodes.length;i++){
            var node = nodes[i];
            var sign = (Math.random() * 10 > 5) ? 1 : -1;
            node.x = centerX + Math.random() * 300 * sign;
            node.y = centerY + Math.random() * 300 * sign;
        }
    }

    function getLayout(data, topLeft, bottomRight) {
        var centerX = topLeft.x + (bottomRight.x - topLeft.x)/2;
        var centerY = topLeft.y + (bottomRight.y - topLeft.y)/2;
        radomLayout(data,centerX,centerY);
    }

    return {
        getLayout: getLayout
    }
});

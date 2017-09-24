/**
 * 圆形布局
 */
define(function () {

    function getLayout(data,topLeft, bottomRight) {
        var nodes = data.nodes;
        var width = bottomRight.x - topLeft.x;
        var height = bottomRight.y - topLeft.y;
        var nodeNum = nodes.length;
        var centerX = topLeft.x + width / 2;
        var centerY = topLeft.y + height / 2;
        var radius = Math.min(width, height) / 2 * 0.8;
        var gapDegree = 2 * Math.PI / nodeNum;
        if (nodeNum > 1) {
            for (var i = 0; i < nodeNum; i++) {
                var node = nodes[i];
                var degree = i * gapDegree;
                var x = centerX + Math.sin(degree) * radius;
                var y = centerY + Math.cos(degree) * radius;
                // result.nodes.push({id: node.id, x: x, y: y});
                node.x = x;
                node.y = y;
            }
        } else if(nodeNum == 1){
            var node = nodes[0];
            // result.nodes.push({id: node.id, x: centerX, y: centerY});
            node.x = centerX;
            node.y = centerY;
        }
    }

    return {
        getLayout: getLayout
    }

});
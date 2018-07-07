/**
 * Created by zhongzh on 2018/5/19 0019.
 */
define(function () {
    function scale(graphData, sTopLeft, sBottomRight, zoom, dataCenterX, dataCenterY, reserveRatio) {
        if (!zoom) {
            zoom = 1;
        }
        var realWidth = sBottomRight.x - sTopLeft.x;
        var realHeight = sBottomRight.y - sTopLeft.y;
        var realCenterX = sTopLeft.x + realWidth / 2;
        var realCenterY = sTopLeft.y + realHeight / 2;
        var region = getRegion(graphData, dataCenterX, dataCenterY);
        var topLeft = region.topLeft;
        var bottomRight = region.bottomRight;
        var w = bottomRight.x - topLeft.x;
        var h = bottomRight.y - topLeft.y;
        dataCenterX = topLeft.x + w / 2;
        dataCenterY = topLeft.y + h / 2;
        move(graphData, dataCenterX, dataCenterY, 0, 0);
        var scaleX;
        var scaleY;
        if (!reserveRatio) {
            if (w == 0 || h == 0) {
                scaleX = w != 0 ? realWidth / w : 1;
                scaleY = h != 0 ? realHeight / h : 1;
            } else {
                var scale = Math.min(realWidth / w, realHeight / h);
                scaleX = scale;
                scaleY = scale;
            }
        } else {
            scaleX = w != 0 ? realWidth / w : 1;
            scaleY = h != 0 ? realHeight / h : 1;
        }
        for (var i = 0; i < graphData.nodes.length; i++) {
            var node = graphData.nodes[i];
            node.x = node.x * scaleX * zoom;
            node.y = node.y * scaleY * zoom;
        }
        move(graphData, 0, 0, realCenterX, realCenterY);
    }

    function getRegion(input, dataCenterX, dataCenterY) {
        var minX = Infinity;
        var minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;
        for (var i = 0; i < input.nodes.length; i++) {
            var x = input.nodes[i].x;
            var y = input.nodes[i].y;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }
        var topLeft;
        var bottomRight;
        if (dataCenterX !== undefined && dataCenterY !== undefined) {
            var width = Math.max(dataCenterX - minX, maxX - dataCenterX) * 2;
            var height = Math.max(dataCenterY - minY, maxY - dataCenterY) * 2;
            topLeft = {x: dataCenterX - width / 2, y: dataCenterY - height / 2};
            bottomRight = {x: dataCenterX + width / 2, y: dataCenterY + height / 2};
        } else {
            topLeft = {x: minX, y: minY};
            bottomRight = {x: maxX, y: maxY};
        }
        return {
            topLeft: topLeft,
            bottomRight: bottomRight
        };
    }

    function move(data, sourceX, sourceY, targetX, targetY) {
        var offsetX = targetX - sourceX;
        var offsetY = targetY - sourceY;
        for (var i = 0; i < data.nodes.length; i++) {
            data.nodes[i].x = data.nodes[i].x + offsetX;
            data.nodes[i].y = data.nodes[i].y + offsetY;
        }
    }

    return {
        getLayout: scale
    };
});



/**
 * 网格布局
 */
define(function () {

    function getLayout(data, topLeft, bottomRight) {
        var nodes = data.nodes;
        var width = bottomRight.x - topLeft.x;
        var height = bottomRight.y - topLeft.y;
        var nodeNum = nodes.length;
        var cellEachRow = Math.ceil(Math.sqrt(nodeNum));
        var cellWidth = width / cellEachRow;
        var cellHeight = height / cellEachRow;

        for(var i=0; i<nodeNum; i++){
            var node = nodes[i];
            var row = Math.floor(i / cellEachRow);
            var col = i - row * cellEachRow;
            node.x =  (col + 0.5) * cellWidth + topLeft.x;
            node.y =  (row + 0.5) * cellHeight + topLeft.y;
        }
    }

    return {
        getLayout: getLayout
    }

});
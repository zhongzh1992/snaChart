/**
 * Created by zhongzh on 2017-09-24.
 */
define(function (require) {

    var Text = require('zrender/graphic/Text');
    var Group = require('zrender/container/Group');
    var CircleShape = require('zrender/graphic/shape/Circle');
    var Line = require('zrender/graphic/shape/Line');

    var Model = function (option) {
        this.elements = [];
        this.nodesMap = {};
    };

    Model.prototype.setModel = function (option) {
        this.nodesMap = createNodesMap(option.nodes);
        this.addShapeTextToModel(option.nodes);
        this.addShapeNodeToModel(option.nodes);
        this.addShapeEdgeToModel(option.edges);
    };

    Model.prototype.addShapeNodeToModel = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var shapeText = new Text({
                style: {
                    x: node.x,
                    y: node.y,
                    text: node.name,
                    width: 30,
                    height: 30,
                    textFill: '#c0f',
                    textFont: '18px Microsoft Yahei'
                },
                draggable: true
            });
            this.elements.push(shapeText);
        }
    };

    Model.prototype.addShapeEdgeToModel = function (edges) {
        for (var i = 0; i < edges.length; i++) {
            var edge = edges[i];
            var sourceX = this.nodesMap[edge.source].x;
            var sourceY =  this.nodesMap[edge.source].y;
            var targetX = this.nodesMap[edge.target].x;
            var targetY = this.nodesMap[edge.target].y;
            var shapeEdge = new Line({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                shape: {
                    x1: sourceX,
                    y1: sourceY,
                    x2: targetX,
                    y2: targetY
                },
                style: {
                    fill: null,
                    stroke: '#000',
                    lineWidth: 2
                },
                draggable: true
            });
            this.elements.push(shapeEdge);
        }
    };

    Model.prototype.addShapeTextToModel = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var shapeNode = new CircleShape({
                id: node.id,
                shape: {
                    cx: node.x,
                    cy: node.y,
                    r: 5
                },
                style: {
                    fill: 'blue'
                },
                draggable: true
            });
            this.elements.push(shapeNode);
        }
    };

    function createNodesMap(nodes) {
        var nodesMap = {};
        for(var i=0;i<nodes.length;i++){
            var node = nodes[i];
            nodesMap[node.id] = node;
        }
        return nodesMap;
    }

    /**
     *
     * @param option :{nodes:[{id:'0',x:100,y:100,name:'node0'}],edges:[]}
     */
    function getModel(option) {
        var model = new Model(option);
        model.setModel(option);
        return model.elements;
    }

    return {
        getModel: getModel
    };
});
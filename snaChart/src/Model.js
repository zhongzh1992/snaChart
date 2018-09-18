/**
 * Created by zhongzh on 2017-09-24.
 */
define(function (require) {

    var Text = require('zrender/graphic/Text');
    var Group = require('zrender/container/Group');
    var Circle = require('zrender/graphic/shape/Circle');
    var Line = require('zrender/graphic/shape/Line');

    var Model = function (data) {
        this.nodesElementsMap = {};
        this.circles = [];
        this.lines = [];
        this.texts = [];
    };

    Model.prototype.setModel = function (option) {
        this.addShapeNodesToModel(option.nodes);
        this.addShapeEdgeToModel(option.edges);
        this.addShapeTextToModel(option.nodes);
    };

    Model.prototype.addShapeTextToModel = function (nodes) {
        var PADDING = 10;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var shapeText = new Text({
                style: {
                    x: node.x,
                    y: node.y + PADDING,
                    text: node.name,
                    width: 30,
                    height: 30,
                    textFill: '#c0f',
                    textFont: '10px Microsoft Yahei'
                },
                draggable: false,
                zlevel: -1
            });
            this.texts.push(shapeText);
            var element = this.nodesElementsMap[node.id];
            (function (ele, text, padding) {
                watchNodesPositionChange(ele.position, 0, {
                    set: function (value) {
                        text.attr({style: {x: value}});
                    }
                });
                watchNodesPositionChange(ele.position, 1, {
                    set: function (value) {
                        text.attr({style: {y: value + padding}});
                    }
                })
            })(element, shapeText, PADDING);


        }
    };

    Model.prototype.addShapeEdgeToModel = function (edges) {
        var circles = this.nodesElementsMap;
        for (var i = 0; i < edges.length; i++) {
            var edge = edges[i];
            var sourceId = edge.source;
            var targetId = edge.target;
            var line = new Line({
                shape: {
                    x1: circles[sourceId].position[0],
                    y1: circles[sourceId].position[1],
                    x2: circles[targetId].position[0],
                    y2: circles[targetId].position[1]
                },
                style: {
                    stroke: "green",
                    lineWidth: 2
                },
                zlevel: -1
            });
            this.lines.push(line);

            (function (l, source, target) {
                watchNodesPositionChange(source.position, 0, {
                    set: function (value) {
                        l.attr({shape: {x1: value}});
                    }
                });
                watchNodesPositionChange(source.position, 1, {
                    set: function (value) {
                        l.attr({shape: {y1: value}});
                    }
                });
                watchNodesPositionChange(target.position, 0, {
                    set: function (value) {
                        l.attr({shape: {x2: value}});
                    }
                });
                watchNodesPositionChange(target.position, 1, {
                    set: function (value) {
                        l.attr({shape: {y2: value}});
                    }
                });
            })(line, circles[sourceId], circles[targetId]);
        }
    };

    Model.prototype.addShapeNodesToModel = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var shapeNode = new Circle({
                shape: {
                    r: 15
                },
                position: [node.x, node.y],
                style: {
                    fill: 'blue'
                },
                draggable: true
            });
            this.nodesElementsMap[node.id] = shapeNode;
            this.circles.push(shapeNode);
        }
    };

    function watchNodesPositionChange(obj, attrName, params) {
        var getFunc = params.get;
        var setFunc = params.set;
        var p = {attr: obj[attrName]};
        var descriptor = Object.getOwnPropertyDescriptor(obj, attrName);
        var prevSet = descriptor.set;
        var prevGet = descriptor.get;
        Object.defineProperty(obj, attrName, {
            get: function () {
                if (prevGet) {
                    prevGet(p.attr);
                }
                if (getFunc) {
                    getFunc(p.attr);
                }
                return (p.attr);
            },
            set: function (val) {
                if (prevSet) {
                    prevSet(val, p.attr);
                }
                if (setFunc) {
                    setFunc(val, p.attr);
                }
                p.attr = val;
            }
        })
    }

    function createNodesMap(nodes) {
        var nodesMap = {};
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            nodesMap[node.id] = node;
        }
        return nodesMap;
    }

    /**https://github.com/zhongzh1992/snaChart_repo.git
     * git@github.com:zhongzh1992/snaChart_repo.git
     *
     * @param option :{nodes:[{id:'0',x:100,y:100,name:'node0'}],edges:[]}
     */
    function getModel(option) {
        var model = new Model(option);
        model.setModel(option);
        return model.elements;
    }

    function addElements(zr, option) {
        var model = new Model(option);
        model.setModel(option);
        model.circles.forEach(function (circle) {
            zr.add(circle);
        });
        model.lines.forEach(function (line) {
            zr.add(line);
        });
        model.texts.forEach(function (text) {
            zr.add(text);
        });
    }

    return {
        getModel: getModel,
        addElements: addElements
    }
});
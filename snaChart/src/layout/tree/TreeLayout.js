/**
 * 树布局
 * Created by zhongzh on 2018/5/19 0019.
 */
define(function (require) {
    var ScaleLayout = require('../scale/ScaleLayout');

    function Edge(id, s, t, w) {
        this.id = id;
        this.weight = w;
        this.sourceId = s;
        this.targetId = t;
    }

    function Node(id) {
        this.id = id;
        this.x = -1.0;
        this.y = 0;
        this.weight = 1;
        this.parent = null;
        this.offset = 0;
        this.change = 0;
        this.shift = 0;
        this.number = 1;
        this.ancestor = this;
        this.thread = null;
        this.firstBrother = null;
        this.neighbours = [];
        this.children = [];
        this.flag = true;
    }

    Node.prototype.getFirstBro = function () {
        if (this.firstBrother == null && this.parent) {
            if (this.id !== this.parent.children[0].id) {
                this.firstBrother = this.parent.children[0];
            }
        }
        return this.firstBrother;
    };

    Node.prototype.getLeftChild = function () {
        var leftChild = null;
        if (this.thread) {
            leftChild = this.thread
        } else {
            if (this.children.length !== 0) {
                leftChild = this.children[0];
            }
        }
        return leftChild;
    };

    Node.prototype.getRightChild = function () {
        var rightChild = null;

        if (this.thread) {
            rightChild = this.thread
        } else {
            if (this.children.length !== 0) {
                rightChild = this.children[this.children.length - 1];
            }
        }

        return rightChild;
    };

    Node.prototype.getLBrother = function () {
        var node = null;

        if (this.parent) {
            var children = this.parent.children;
            for (var i = 0; i < children.length; i++) {
                if (this.id == children[i].id) {
                    return node;
                } else {
                    node = children[i];
                }
            }
        }

        return node;
    };

    function TreeLayout(data, topLeft, bottomRight) {
        this.nodesMap = {};
        this.nodeIndexMap = {};
        this.edgesMap = {};
        this.nodes = [];
        this.edges = [];
        this.rootId;
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;

        this.loadData(data);
    }

    TreeLayout.prototype.loadData = function loadData(data) {
        for (var i = 0; i < data.nodes.length; i++) {
            var nodeId = data.nodes[i].id;
            var node = new Node(nodeId);
            this.nodes.push(node);
            this.nodesMap[nodeId] = node;
            this.nodeIndexMap[nodeId] = i;
        }
        for (var i = 0; i < data.edges.length; i++) {
            var jsonEdge = data.edges[i];
            var edgeId = jsonEdge.id;
            var s = jsonEdge.source;
            var t = jsonEdge.target;
            var w = jsonEdge.weight ? jsonEdge.weight : 1;
            if (!s || !t) {
                window.alert("边的起始/终止节点id属性名不对！");
                return;
            }
            var edge = new Edge(edgeId, s, t, w);
            this.edges.push(edge);
            this.edgesMap[s + t] = edge;
            this.edgesMap[t + s] = edge;
            var srcNode = this.nodesMap[s];
            var tarNode = this.nodesMap[t];
            srcNode.neighbours.push(tarNode);
            tarNode.neighbours.push(srcNode);
        }
        this.rootId = data.rootId ? data.rootId : undefined;
    };

    /**
     * 将节点按其邻居节点构建成树形
     * @param nodeArr
     */
    TreeLayout.prototype.buildTree = function (nodeArr) {
        var nextNodeArr = [];
        for (var i = 0; i < nodeArr.length; i++) {
            var node = nodeArr[i];
            var neighbours = node.neighbours;
            for (var j = 0; j < neighbours.length; j++) {
                var neighbour = neighbours[j];
                if (neighbour.flag) {
                    var childNode = this.nodesMap[neighbour.id];
                    childNode.parent = node;
                    childNode.number = j + 1;
                    childNode.flag = false;
                    node.children.push(childNode);
                    nextNodeArr.push(neighbour);
                }
            }
        }
        if (nextNodeArr.length > 0) {
            this.buildTree(nextNodeArr);
        }
    };

    TreeLayout.prototype.setup = function (root) {
        var dt = this.firstwalk(root, 1.0);
        var min = this.secondwork(dt, 0, 0, -9999);
        if (min < 0) {
            this.thirdwork(dt, -min);
        }
        return dt;
    };

    TreeLayout.prototype.firstwalk = function firstwalk(root, distance) {
        if (root.children.length == 0) {
            var firstBor = root.getFirstBro();
            if (firstBor) {
                root.x = root.getLBrother().x + distance;
            } else {
                root.x = 0.0;
            }
        } else {
            var children = root.children;
            var defaultAncestor = children[0];
            for (var i = 0; i < children.length; i++) {
                this.firstwalk(children[i], 1.0);
                defaultAncestor = this.apportion(children[i], defaultAncestor, distance);
            }
            this.execShift(root);
            var midpoint = (children[0].x + children[children.length - 1].x) / 2;
            var lBrother = root.getLBrother();
            if (lBrother) {
                root.x = lBrother.x + distance;
                root.offset = root.x - midpoint;
            } else {
                root.x = midpoint;
            }
        }
        return root;
    };

    TreeLayout.prototype.secondwork = function secondwork(root, m, depth, min) {
        root.x += m;
        root.y = depth;
        min = (min == -9999 || root.x < min) ? root.x : min;
        for (var i = 0; i < root.children.length; i++) {
            var child = root.children[i];
            min = this.secondwork(child, m + root.offset, depth + 1, min);
        }
        return min;
    };

    TreeLayout.prototype.thirdwork = function thirdwork(root, n) {
        root.x += n;
        for (var i = 0; i < root.children.length; i++) {
            var child = root.children[i];
            thirdwork(child, n);
        }
    };

    TreeLayout.prototype.apportion = function apportion(v, defaultAncestor, distance) {
        var w = v.getLBrother();
        if (w != null) {
            var vir = v;
            var vor = v;
            var vil = w;
            this.setFirstBro(v);
            var vol = v.firstBrother;

            var sir = v.offset;
            var sor = v.offset;
            var sil = vil.offset;
            var sol = vol.offset;

            while (vil.getRightChild() && vir.getLeftChild()) {
                vil = vil.getRightChild();
                vir = vir.getLeftChild();
                vol = vol.getLeftChild();
                vor = vor.getRightChild();
                vor.ancestor = v;
                var shift = vil.x + sil - vir.x - sir + distance;
                if (shift > 0) {
                    this.moveSubtree(this.ancestor(vil, v, defaultAncestor), v, shift);
                    sir += shift;
                    sor += shift;
                }
                sil += vil.offset;
                sir += vir.offset;
                sol += vol.offset;
                sor += vor.offset;
            }
            if (vil.getRightChild() && !vor.getRightChild()) {
                vor.thread = vil.getRightChild();
                vor.offset += sil - sor;
            } else {
                if (vir.getLeftChild() && !vol.getLeftChild()) {
                    vol.thread = vir.getLeftChild();
                    vol.offset += sir - sol;
                }
                defaultAncestor = v;
            }
        }
        return defaultAncestor;
    };

    TreeLayout.prototype.moveSubtree = function moveSubtree(wl, wr, shift) {
        var subtrees = wr.number - wl.number;
        wr.change = wr.change - (shift / subtrees);
        wr.shift = wr.shift + shift;
        wl.change = wl.change + (shift / subtrees);
        wr.x += shift;
        wr.offset += shift;
    };

    TreeLayout.prototype.ancestor = function ancestor(vil, v, defaultAncestor) {
        var brothers = v.parent.children;
        var ancestor = defaultAncestor;
        for (var i = 0; i < brothers.length; i++) {
            if (brothers[i].id == vil.ancestor.id) {
                ancestor = vil.ancestor;
            }
        }
        return ancestor;
    };

    TreeLayout.prototype.execShift = function execShift(v) {
        var shift = 0;
        var change = 0;
        var children = v.children;
        var size = children.length;
        for (var i = 0; i < size; i++) {
            var node = children[size - 1 - i];
            node.x += shift;
            node.offset += shift;
            children[size - 1 - i] = node;
            change += node.change;
            shift += node.shift + change;
        }
    };

    TreeLayout.prototype.setFirstBro = function setFirstBro(node) {
        if (!node.firstBrother && node.parent) {
            var first = node.parent.children[0];
            if (node.id !== first.id) {
                node.firstBrother = first;
            }
        }
        for (var i = 0; i < node.children.length; i++) {
            setFirstBro(node.children[i]);
        }
    };

    TreeLayout.prototype.modifyNodePosition = function modifyNodePosition(data) {
        for (var i = 0; i < data.nodes.length; i++) {
            var node = data.nodes[i];
            node.x = this.nodesMap[node.id].x;
            node.y = this.nodesMap[node.id].y;
        }
    };

    TreeLayout.prototype.computeNodeDist = function computeNodeDist() {
        var rootNode = this.nodesMap[this.rootId];
        if (!rootNode) {
            window.alert("根节点设置有误！请传入正确的根节点id...");
            return;
        }
        rootNode.flag = false;
        var rooNodeArr = [rootNode];
        this.buildTree(rooNodeArr);
        this.setup(rootNode);
        var result = {nodes: this.nodes, edges: this.edges};
        ScaleLayout.getLayout(result, this.topLeft, this.bottomRight);
        return result;
    };

    function getLayout(data, topLeft, bottomRight) {
        var layout = new TreeLayout(data, topLeft, bottomRight);
        layout.computeNodeDist();
        layout.modifyNodePosition(data);
    }

    return {
        getLayout: getLayout
    };

});
/**
 * 连通分量
 * Created by zhongzh on 2018/7/6.
 */
define(function (require) {
        var Node = function (id) {
            this.id = id;

            this.children = [];
            this.isVisited = false;//初始值为false.表示未遍历
            this.neighbours = [];
        };

        var Edge = function (id, sourceId, targetId) {
            this.id = id;
            this.sourceId = sourceId;
            this.targetId = targetId;
        };


        var GroupDataHelper = function (data) {
            this.nodes = [];
            this.edges = [];
            this.nodesMap = {};

            this.groups = [];
            this.edgesMap = [];
        };

        /**
         * 加载数据
         * @param data
         */
        GroupDataHelper.prototype.loadData = function (data) {
            var nodes = data.nodes;
            var edges = data.edges;
            for (var i = 0; i < nodes.length; i++) {
                var id = nodes[i].id;
                var node = new Node(id);
                this.nodes.push(node);
                this.nodesMap[id] = node;
            }

            for (var j = 0; j < edges.length; j++) {
                var id = edges[j].id;
                var s = data.edges[j].source;
                var e = data.edges[j].target;
                var nodeS = this.nodesMap[s];
                var nodeE = this.nodesMap[e];
                if (!nodeS || !nodeE) {
                    continue;
                }
                var edge = new Edge(id, s, e);
                this.edges.push(edge);
                nodeS.neighbours.push(nodeE);
                nodeE.neighbours.push(nodeS);

                if (this.edgesMap[nodeS.id] == undefined) {
                    this.edgesMap[nodeS.id] = [];
                }
                if (this.edgesMap[nodeE.id] == undefined) {
                    this.edgesMap[nodeE.id] = [];
                }
                this.edgesMap[nodeS.id][nodeE.id] = edge;
                this.edgesMap[nodeE.id][nodeS.id] = edge;
            }
        };

        /**
         * 根据节点Id获取单个分组
         * @param nodeId
         * @returns {{nodes: Array, edges: Array}}
         */
        GroupDataHelper.prototype.getSingleGroupByNodeId = function (nodeId) {
            var group = {nodes: [], edges: []};
            var startNode = this.nodesMap[nodeId];
            group.nodes.push(startNode);
            this.travelGraphByBFS([startNode], group);
            return group;
        };

        /**
         * 根据连通划分分组
         * @returns {Array}
         */
        GroupDataHelper.prototype.divideGroupByConn = function () {
            var copyNodes = this.nodes;
            while (copyNodes.length > 0) {
                var startId = copyNodes[0].id;
                var group = this.getSingleGroupByNodeId(startId);
                this.groups.push(group);
                removeGroupFromNodes(group.nodes, copyNodes);
            }
            return this.groups;

            function removeGroupFromNodes(toDeleteNodes, nodes) {
                for (var i = 0; i < toDeleteNodes.length; i++) {
                    var node = toDeleteNodes[i];
                    var index = getIndex(nodes, node);
                    nodes.splice(index, 1);
                }
            }

            function getIndex(nodes, node) {
                var index = 0;
                for (var j = 0; j < nodes.length; j++) {
                    if (node.id == nodes[j].id) {
                        index = j;
                        break;
                    }
                }
                return index;
            }

        };

        /**
         * 广度搜索，得到一个连通分量
         * @param nodeArr
         * @param result
         */
        GroupDataHelper.prototype.travelGraphByBFS = function (nodeArr, group) {
            var nextNodeArr = [];
            for (var i = 0; i < nodeArr.length; i++) {
                var node = nodeArr[i];
                node.isVisited = true;
                var neighbours = node.neighbours;
                if (neighbours && neighbours.length > 0) {
                    for (var j = 0; j < neighbours.length; j++) {
                        var neighbour = neighbours[j];
                        if (neighbour.isVisited == false) {
                            var temp = this.nodesMap[neighbour.id];
                            group.nodes.push(temp);
                            group.edges.push(this.edgesMap[temp.id][node.id]);
                            neighbour.isVisited = true;
                            nextNodeArr.push(neighbour);
                        }
                    }
                }

            }
            //下一层
            if (nextNodeArr.length > 0) {
                this.travelGraphByBFS(nextNodeArr, group);
            } else {
                return;
            }

        };

        /**
         * 创建节点map
         * @param nodes
         * @returns {{}}
         */
        function createNodesMap(nodes) {
            var nodesMap = {};
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                nodesMap[node.id] = node;
            }
            return nodesMap;
        }

        /**
         * 通过节点ID获取该节点所在分组数据
         * @param nodeId
         * @param data
         * @returns {*}
         */
        function getGroupDataById(nodeId, data) {
            var groupDataHelper = new GroupDataHelper(data);
            groupDataHelper.loadData(data);
            var group = groupDataHelper.getSingleGroupByNodeId(nodeId);
            return group;
        }

        /**
         * 获取所有分组数据
         * @param data
         * @returns {*}
         */
        function getGroupData(data) {
            var groupDataHelper = new GroupDataHelper(data);
            groupDataHelper.loadData(data);
            var result = groupDataHelper.divideGroupByConn();
            return result;
        }

        /**
         * 最大分组数据
         * @param data
         * @returns {*}
         */
        function getLargestGroupData(data) {
            var groups = getGroupData(data);
            var max = -Infinity;
            var result = [];
            for (var i = 0; i < groups.length; i++) {
                var oGroup = groups[i];
                var nNodeNumber = oGroup.nodes.length;
                if (nNodeNumber > max) {
                    max = nNodeNumber;
                }
            }
            for (var i = 0; i < groups.length; i++) {
                var oGroup = groups[i];
                var nNodeNumber = oGroup.nodes.length;
                if (nNodeNumber == max) {
                    result.push(oGroup);
                }
            }
            return result;
        }

    });
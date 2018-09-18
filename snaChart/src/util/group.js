/**
 * Created by zhongzh on 2018/7/7 0007.
 */

/**
 * 并查集：查找前导节点
 * @param x
 * @returns {*}
 */
function find(x) {
    var r = x;
    while (pre[r] != r)
        r = pre[r];//找到他的前导结点
    var i = x, j;
    while (i != r)//路径压缩算法
    {
        j = pre[i];//记录x的前导结点
        pre[i] = r;//将i的前导结点设置为r根节点
        i = j;
    }
    return r;
}

/**
 * 并查集：合并路线
 * @param x
 * @param y
 */
function join(x, y) {
    var a = find(x);//x的根节点为a
    var b = find(y);//y的根节点为b
    if (a != b)//如果a,b不是相同的根节点，则说明ab不是连通的
    {
        pre[a] = b;//我们将ab相连 将a的前导结点设置为b
    }
}
/**
 * 获取分组
 * @param data
 */
function getGroups(data) {
	var i=0;
	var nodes = data.nodes.length;
	var edges = data.edges.length;
    //初始化前导节点
	for(var i=0;i<nodes.length;i++){
        var node = nodes[i];
        pre[node.index] = node.index;//前导节点初始为自己
    }
	//遍历边集合，合并
    for(i=0;i<edges.length;i++){
		var edge = edges[i];
		var sNode = nodesMap[edge.source];
		var tNode = nodesMap[edge.target];
		join(sNode.index,tNode.index);
	}
	//遍历点集合，设置分组ID
    for(i=0;i<nodes.length;i++){
        var node = nodes[i];
        node.groupId = find(node.index);
    }
}
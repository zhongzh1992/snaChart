/**
 * Created by zhongzh on 2017-09-17.
 * snaChart入口
 */
define(function (require) {

    var zrender = require('zrender');
    var Model = require('./Model');
    var CircleLayout = require('./layout/circle/CircleLayout');
    var GridLayout = require('./layout/grid/GridLayout');
    var TreeLayout = require('./layout/tree/TreeLayout');
    var RandomLayout = require('./layout/random/RandomLayout');

    function snaChart(dom, theme, opts) {
        this.opts = opts || {};
        this._theme = theme;
        this._dom = dom;
        this._zr = zrender.init(dom, {
            renderer: opts.renderer || 'canvas',
            devicePixelRatio: opts.devicePixelRatio,
            width: opts.width,
            height: opts.height
        });
    }

    snaChart.prototype.getDom = function () {
        return this._dom;
    };

    snaChart.prototype.getZr = function () {
        return this._zr;
    };

    snaChart.prototype.getOption = function () {
        return this.opts;
    };

    snaChart.prototype.setOption = function (option) {
        var data = option.data;
        var area = {
            topLeft: {x: 0, y: 0},
            bottomRight: {x: this.getWidth(), y: this.getHeight()}
        };
        this.applyLayout(data, area, option.layout.type);
        var model = Model.getModel(data);
        addElements(this._zr, model);

        function addElements(zr, model) {
            for (var i = 0; i < model.length; i++) {
                var ele = model[i];
                zr.add(ele);
            }
        }
    };

    snaChart.prototype.getWidth = function () {
        return this.opts.width ? this.opts.width : 500;
    };

    snaChart.prototype.getHeight = function () {
        return this.opts.height ? this.opts.height : 500;
    };

    snaChart.prototype.applyLayout = function (data, area, type, other) {
        switch (type) {
            case "grid":
                GridLayout.getLayout(data, area.topLeft, area.bottomRight);
                break;
            case "circle":
                CircleLayout.getLayout(data, area.topLeft, area.bottomRight);
                break;
            case "tree":
                TreeLayout.getLayout(data, area.topLeft, area.bottomRight);
                break;
            default:
                RandomLayout.getLayout(data, area.topLeft, area.bottomRight);
                break;
        }
    };

    return snaChart;
});
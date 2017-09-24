/**
 * Created by zhongzh on 2017-09-17.
 * snaChart入口
 */
define(function (require) {

    var zrender = require('zrender');
    var Model = require('./Model');

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

    };

    snaChart.prototype.getZr = function () {

    };

    snaChart.prototype.getOption = function () {

    };

    snaChart.prototype.setOption = function (option) {
        var model = Model.getModel(option);
        addElements(this._zr,model);

        function addElements(zr,model) {
            for(var i=0;i<model.length;i++){
                var ele = model[i];
                zr.add(ele);
            }
        }
    };

    snaChart.prototype.getWidth = function (option) {

    };

    snaChart.prototype.getHeight = function (option) {

    };

    return snaChart;
});
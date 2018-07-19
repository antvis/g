const Util = require('../../util/index');

module.exports = {
  canFill: false,
  canStroke: false,
  initAttrs(attrs) {
    this._attrs = {
      opacity: 1,
      fillOpacity: 1,
      strokeOpacity: 1
    };
    this.attr(Util.assign(this.getDefaultAttrs(), attrs));
    if (!this._attrs.id) {
      this._attrs.id = Util.uniqueId('g_');
    }
    return this;
  },
  getDefaultAttrs() {
    return {};
  },
  /**
   * 设置或者设置属性，有以下 4 种情形：
   *   - name 不存在, 则返回属性集合
   *   - name 为字符串，value 为空，获取属性值
   *   - name 为字符串，value 不为空，设置属性值，返回 this
   *   - name 为键值对，value 为空，设置属性值
   *
   * @param  {String | Object} name  属性名
   * @param  {*} value 属性值
   * @return {*} 属性值
   */
  attr(name, value) {
    const self = this;
    const attrs = self._attrs;
    if (arguments.length === 0) {
      return self._attrs;
    }
    if (Util.isObject(name)) {
      self._attrs = Util.assign(attrs, name);
      if ('fill' in name) {
        attrs.fillStyle = name.fill;
      }
      if ('stroke' in name) {
        attrs.strokeStyle = name.stroke;
      }
      if ('opacity' in name) {
        attrs.globalAlpha = name.opacity;
      }
      if ('clip' in name) {
        if (name.clip) {
          self._setClip(name.clip);
        }
      }
      if ('path' in name && self._afterSetAttrPath) {
        self._afterSetAttrPath(name.path);
      }
      if ('transform' in name) {
        if (!attrs.matrix) {
          attrs.matrix = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
        }
        self.transform(name.transform);
      }
      if ('rotate' in name) {
        if (!attrs.matrix) {
          attrs.matrix = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
        }
        self.rotateAtStart(name.rotate);
      }
      self.clearBBox();
      this._cfg.hasUpdate = true;
      return self;
    }
    if (arguments.length === 2) {
      self._attrs[name] = value;
      if (name === 'fill' || name === 'stroke') {
        self._attrs[name + 'Style'] = value;
      }
      if (name === 'opacity') {
        self._attrs.globalAlpha = value;
      }
      if (name === 'clip' && value) {
        self._setClip(value);
      }
      if (name === 'path' && self._afterSetAttrPath) {
        self._afterSetAttrPath(value);
      }
      if (name === 'transform') {
        if (!attrs.matrix) {
          attrs.matrix = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
        }
        self.transform(value);
      }
      if (name === 'rotate') {
        if (!attrs.matrix) {
          attrs.matrix = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
        }
        self.rotateAtStart(value);
      }
      self.clearBBox();
      this._cfg.hasUpdate = true;
      return self;
    }
    return self._attrs[name];
  },
  clearBBox() {
    this.setSilent('box', null);
  },
  hasFill() {
    return this.canFill && this._attrs.fillStyle;
  },
  hasStroke() {
    return this.canStroke && this._attrs.strokeStyle;
  },
  _setClip(item) {
    item._cfg.renderer = this._cfg.renderer;
    item._cfg.canvas = this._cfg.canvas;
    item._cfg.parent = this._cfg.parent;
    item.hasFill = function() { return true; };
  }
};
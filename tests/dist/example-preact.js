// node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var i;
var t;
var o;
var r;
var f = {};
var e = [];
var c = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
function s(n2, l3) {
  for (var u3 in l3)
    n2[u3] = l3[u3];
  return n2;
}
function a(n2) {
  var l3 = n2.parentNode;
  l3 && l3.removeChild(n2);
}
function v(n2, i3, t3, o4, r3) {
  var f3 = { type: n2, props: i3, key: t3, ref: o4, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: null == r3 ? ++u : r3 };
  return null == r3 && null != l.vnode && l.vnode(f3), f3;
}
function p(n2) {
  return n2.children;
}
function d(n2, l3) {
  this.props = n2, this.context = l3;
}
function _(n2, l3) {
  if (null == l3)
    return n2.__ ? _(n2.__, n2.__.__k.indexOf(n2) + 1) : null;
  for (var u3; l3 < n2.__k.length; l3++)
    if (null != (u3 = n2.__k[l3]) && null != u3.__e)
      return u3.__e;
  return "function" == typeof n2.type ? _(n2) : null;
}
function k(n2) {
  var l3, u3;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++)
      if (null != (u3 = n2.__k[l3]) && null != u3.__e) {
        n2.__e = n2.__c.base = u3.__e;
        break;
      }
    return k(n2);
  }
}
function b(n2) {
  (!n2.__d && (n2.__d = true) && t.push(n2) && !g.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || setTimeout)(g);
}
function g() {
  for (var n2; g.__r = t.length; )
    n2 = t.sort(function(n3, l3) {
      return n3.__v.__b - l3.__v.__b;
    }), t = [], n2.some(function(n3) {
      var l3, u3, i3, t3, o4, r3;
      n3.__d && (o4 = (t3 = (l3 = n3).__v).__e, (r3 = l3.__P) && (u3 = [], (i3 = s({}, t3)).__v = t3.__v + 1, j(r3, t3, i3, l3.__n, void 0 !== r3.ownerSVGElement, null != t3.__h ? [o4] : null, u3, null == o4 ? _(t3) : o4, t3.__h), z(u3, t3), t3.__e != o4 && k(t3)));
    });
}
function w(n2, l3, u3, i3, t3, o4, r3, c3, s2, a3) {
  var h, y2, d3, k3, b3, g3, w2, x = i3 && i3.__k || e, C2 = x.length;
  for (u3.__k = [], h = 0; h < l3.length; h++)
    if (null != (k3 = u3.__k[h] = null == (k3 = l3[h]) || "boolean" == typeof k3 ? null : "string" == typeof k3 || "number" == typeof k3 || "bigint" == typeof k3 ? v(null, k3, null, null, k3) : Array.isArray(k3) ? v(p, { children: k3 }, null, null, null) : k3.__b > 0 ? v(k3.type, k3.props, k3.key, null, k3.__v) : k3)) {
      if (k3.__ = u3, k3.__b = u3.__b + 1, null === (d3 = x[h]) || d3 && k3.key == d3.key && k3.type === d3.type)
        x[h] = void 0;
      else
        for (y2 = 0; y2 < C2; y2++) {
          if ((d3 = x[y2]) && k3.key == d3.key && k3.type === d3.type) {
            x[y2] = void 0;
            break;
          }
          d3 = null;
        }
      j(n2, k3, d3 = d3 || f, t3, o4, r3, c3, s2, a3), b3 = k3.__e, (y2 = k3.ref) && d3.ref != y2 && (w2 || (w2 = []), d3.ref && w2.push(d3.ref, null, k3), w2.push(y2, k3.__c || b3, k3)), null != b3 ? (null == g3 && (g3 = b3), "function" == typeof k3.type && k3.__k === d3.__k ? k3.__d = s2 = m(k3, s2, n2) : s2 = A(n2, k3, d3, x, b3, s2), "function" == typeof u3.type && (u3.__d = s2)) : s2 && d3.__e == s2 && s2.parentNode != n2 && (s2 = _(d3));
    }
  for (u3.__e = g3, h = C2; h--; )
    null != x[h] && ("function" == typeof u3.type && null != x[h].__e && x[h].__e == u3.__d && (u3.__d = _(i3, h + 1)), N(x[h], x[h]));
  if (w2)
    for (h = 0; h < w2.length; h++)
      M(w2[h], w2[++h], w2[++h]);
}
function m(n2, l3, u3) {
  for (var i3, t3 = n2.__k, o4 = 0; t3 && o4 < t3.length; o4++)
    (i3 = t3[o4]) && (i3.__ = n2, l3 = "function" == typeof i3.type ? m(i3, l3, u3) : A(u3, i3, i3, t3, i3.__e, l3));
  return l3;
}
function A(n2, l3, u3, i3, t3, o4) {
  var r3, f3, e4;
  if (void 0 !== l3.__d)
    r3 = l3.__d, l3.__d = void 0;
  else if (null == u3 || t3 != o4 || null == t3.parentNode)
    n:
      if (null == o4 || o4.parentNode !== n2)
        n2.appendChild(t3), r3 = null;
      else {
        for (f3 = o4, e4 = 0; (f3 = f3.nextSibling) && e4 < i3.length; e4 += 2)
          if (f3 == t3)
            break n;
        n2.insertBefore(t3, o4), r3 = o4;
      }
  return void 0 !== r3 ? r3 : t3.nextSibling;
}
function C(n2, l3, u3, i3, t3) {
  var o4;
  for (o4 in u3)
    "children" === o4 || "key" === o4 || o4 in l3 || H(n2, o4, null, u3[o4], i3);
  for (o4 in l3)
    t3 && "function" != typeof l3[o4] || "children" === o4 || "key" === o4 || "value" === o4 || "checked" === o4 || u3[o4] === l3[o4] || H(n2, o4, l3[o4], u3[o4], i3);
}
function $(n2, l3, u3) {
  "-" === l3[0] ? n2.setProperty(l3, u3) : n2[l3] = null == u3 ? "" : "number" != typeof u3 || c.test(l3) ? u3 : u3 + "px";
}
function H(n2, l3, u3, i3, t3) {
  var o4;
  n:
    if ("style" === l3)
      if ("string" == typeof u3)
        n2.style.cssText = u3;
      else {
        if ("string" == typeof i3 && (n2.style.cssText = i3 = ""), i3)
          for (l3 in i3)
            u3 && l3 in u3 || $(n2.style, l3, "");
        if (u3)
          for (l3 in u3)
            i3 && u3[l3] === i3[l3] || $(n2.style, l3, u3[l3]);
      }
    else if ("o" === l3[0] && "n" === l3[1])
      o4 = l3 !== (l3 = l3.replace(/Capture$/, "")), l3 = l3.toLowerCase() in n2 ? l3.toLowerCase().slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + o4] = u3, u3 ? i3 || n2.addEventListener(l3, o4 ? T : I, o4) : n2.removeEventListener(l3, o4 ? T : I, o4);
    else if ("dangerouslySetInnerHTML" !== l3) {
      if (t3)
        l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("href" !== l3 && "list" !== l3 && "form" !== l3 && "tabIndex" !== l3 && "download" !== l3 && l3 in n2)
        try {
          n2[l3] = null == u3 ? "" : u3;
          break n;
        } catch (n3) {
        }
      "function" == typeof u3 || (null != u3 && (false !== u3 || "a" === l3[0] && "r" === l3[1]) ? n2.setAttribute(l3, u3) : n2.removeAttribute(l3));
    }
}
function I(n2) {
  this.l[n2.type + false](l.event ? l.event(n2) : n2);
}
function T(n2) {
  this.l[n2.type + true](l.event ? l.event(n2) : n2);
}
function j(n2, u3, i3, t3, o4, r3, f3, e4, c3) {
  var a3, h, v3, y2, _2, k3, b3, g3, m3, x, A2, C2, $2, H2 = u3.type;
  if (void 0 !== u3.constructor)
    return null;
  null != i3.__h && (c3 = i3.__h, e4 = u3.__e = i3.__e, u3.__h = null, r3 = [e4]), (a3 = l.__b) && a3(u3);
  try {
    n:
      if ("function" == typeof H2) {
        if (g3 = u3.props, m3 = (a3 = H2.contextType) && t3[a3.__c], x = a3 ? m3 ? m3.props.value : a3.__ : t3, i3.__c ? b3 = (h = u3.__c = i3.__c).__ = h.__E : ("prototype" in H2 && H2.prototype.render ? u3.__c = h = new H2(g3, x) : (u3.__c = h = new d(g3, x), h.constructor = H2, h.render = O), m3 && m3.sub(h), h.props = g3, h.state || (h.state = {}), h.context = x, h.__n = t3, v3 = h.__d = true, h.__h = []), null == h.__s && (h.__s = h.state), null != H2.getDerivedStateFromProps && (h.__s == h.state && (h.__s = s({}, h.__s)), s(h.__s, H2.getDerivedStateFromProps(g3, h.__s))), y2 = h.props, _2 = h.state, v3)
          null == H2.getDerivedStateFromProps && null != h.componentWillMount && h.componentWillMount(), null != h.componentDidMount && h.__h.push(h.componentDidMount);
        else {
          if (null == H2.getDerivedStateFromProps && g3 !== y2 && null != h.componentWillReceiveProps && h.componentWillReceiveProps(g3, x), !h.__e && null != h.shouldComponentUpdate && false === h.shouldComponentUpdate(g3, h.__s, x) || u3.__v === i3.__v) {
            h.props = g3, h.state = h.__s, u3.__v !== i3.__v && (h.__d = false), h.__v = u3, u3.__e = i3.__e, u3.__k = i3.__k, u3.__k.forEach(function(n3) {
              n3 && (n3.__ = u3);
            }), h.__h.length && f3.push(h);
            break n;
          }
          null != h.componentWillUpdate && h.componentWillUpdate(g3, h.__s, x), null != h.componentDidUpdate && h.__h.push(function() {
            h.componentDidUpdate(y2, _2, k3);
          });
        }
        if (h.context = x, h.props = g3, h.__v = u3, h.__P = n2, A2 = l.__r, C2 = 0, "prototype" in H2 && H2.prototype.render)
          h.state = h.__s, h.__d = false, A2 && A2(u3), a3 = h.render(h.props, h.state, h.context);
        else
          do {
            h.__d = false, A2 && A2(u3), a3 = h.render(h.props, h.state, h.context), h.state = h.__s;
          } while (h.__d && ++C2 < 25);
        h.state = h.__s, null != h.getChildContext && (t3 = s(s({}, t3), h.getChildContext())), v3 || null == h.getSnapshotBeforeUpdate || (k3 = h.getSnapshotBeforeUpdate(y2, _2)), $2 = null != a3 && a3.type === p && null == a3.key ? a3.props.children : a3, w(n2, Array.isArray($2) ? $2 : [$2], u3, i3, t3, o4, r3, f3, e4, c3), h.base = u3.__e, u3.__h = null, h.__h.length && f3.push(h), b3 && (h.__E = h.__ = null), h.__e = false;
      } else
        null == r3 && u3.__v === i3.__v ? (u3.__k = i3.__k, u3.__e = i3.__e) : u3.__e = L(i3.__e, u3, i3, t3, o4, r3, f3, c3);
    (a3 = l.diffed) && a3(u3);
  } catch (n3) {
    u3.__v = null, (c3 || null != r3) && (u3.__e = e4, u3.__h = !!c3, r3[r3.indexOf(e4)] = null), l.__e(n3, u3, i3);
  }
}
function z(n2, u3) {
  l.__c && l.__c(u3, n2), n2.some(function(u4) {
    try {
      n2 = u4.__h, u4.__h = [], n2.some(function(n3) {
        n3.call(u4);
      });
    } catch (n3) {
      l.__e(n3, u4.__v);
    }
  });
}
function L(l3, u3, i3, t3, o4, r3, e4, c3) {
  var s2, h, v3, y2 = i3.props, p3 = u3.props, d3 = u3.type, k3 = 0;
  if ("svg" === d3 && (o4 = true), null != r3) {
    for (; k3 < r3.length; k3++)
      if ((s2 = r3[k3]) && "setAttribute" in s2 == !!d3 && (d3 ? s2.localName === d3 : 3 === s2.nodeType)) {
        l3 = s2, r3[k3] = null;
        break;
      }
  }
  if (null == l3) {
    if (null === d3)
      return document.createTextNode(p3);
    l3 = o4 ? document.createElementNS("http://www.w3.org/2000/svg", d3) : document.createElement(d3, p3.is && p3), r3 = null, c3 = false;
  }
  if (null === d3)
    y2 === p3 || c3 && l3.data === p3 || (l3.data = p3);
  else {
    if (r3 = r3 && n.call(l3.childNodes), h = (y2 = i3.props || f).dangerouslySetInnerHTML, v3 = p3.dangerouslySetInnerHTML, !c3) {
      if (null != r3)
        for (y2 = {}, k3 = 0; k3 < l3.attributes.length; k3++)
          y2[l3.attributes[k3].name] = l3.attributes[k3].value;
      (v3 || h) && (v3 && (h && v3.__html == h.__html || v3.__html === l3.innerHTML) || (l3.innerHTML = v3 && v3.__html || ""));
    }
    if (C(l3, p3, y2, o4, c3), v3)
      u3.__k = [];
    else if (k3 = u3.props.children, w(l3, Array.isArray(k3) ? k3 : [k3], u3, i3, t3, o4 && "foreignObject" !== d3, r3, e4, r3 ? r3[0] : i3.__k && _(i3, 0), c3), null != r3)
      for (k3 = r3.length; k3--; )
        null != r3[k3] && a(r3[k3]);
    c3 || ("value" in p3 && void 0 !== (k3 = p3.value) && (k3 !== l3.value || "progress" === d3 && !k3 || "option" === d3 && k3 !== y2.value) && H(l3, "value", k3, y2.value, false), "checked" in p3 && void 0 !== (k3 = p3.checked) && k3 !== l3.checked && H(l3, "checked", k3, y2.checked, false));
  }
  return l3;
}
function M(n2, u3, i3) {
  try {
    "function" == typeof n2 ? n2(u3) : n2.current = u3;
  } catch (n3) {
    l.__e(n3, i3);
  }
}
function N(n2, u3, i3) {
  var t3, o4;
  if (l.unmount && l.unmount(n2), (t3 = n2.ref) && (t3.current && t3.current !== n2.__e || M(t3, null, u3)), null != (t3 = n2.__c)) {
    if (t3.componentWillUnmount)
      try {
        t3.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u3);
      }
    t3.base = t3.__P = null;
  }
  if (t3 = n2.__k)
    for (o4 = 0; o4 < t3.length; o4++)
      t3[o4] && N(t3[o4], u3, "function" != typeof n2.type);
  i3 || null == n2.__e || a(n2.__e), n2.__e = n2.__d = void 0;
}
function O(n2, l3, u3) {
  return this.constructor(n2, u3);
}
n = e.slice, l = { __e: function(n2, l3, u3, i3) {
  for (var t3, o4, r3; l3 = l3.__; )
    if ((t3 = l3.__c) && !t3.__)
      try {
        if ((o4 = t3.constructor) && null != o4.getDerivedStateFromError && (t3.setState(o4.getDerivedStateFromError(n2)), r3 = t3.__d), null != t3.componentDidCatch && (t3.componentDidCatch(n2, i3 || {}), r3 = t3.__d), r3)
          return t3.__E = t3;
      } catch (l4) {
        n2 = l4;
      }
  throw n2;
} }, u = 0, i = function(n2) {
  return null != n2 && void 0 === n2.constructor;
}, d.prototype.setState = function(n2, l3) {
  var u3;
  u3 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = s({}, this.state), "function" == typeof n2 && (n2 = n2(s({}, u3), this.props)), n2 && s(u3, n2), null != n2 && this.__v && (l3 && this.__h.push(l3), b(this));
}, d.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), b(this));
}, d.prototype.render = p, t = [], g.__r = 0, r = 0;

// node_modules/preact/hooks/dist/hooks.module.js
var t2;
var u2;
var r2;
var o2;
var i2 = 0;
var c2 = [];
var f2 = [];
var e2 = l.__b;
var a2 = l.__r;
var v2 = l.diffed;
var l2 = l.__c;
var m2 = l.unmount;
function p2(t3, r3) {
  l.__h && l.__h(u2, t3, i2 || r3), i2 = 0;
  var o4 = u2.__H || (u2.__H = { __: [], __h: [] });
  return t3 >= o4.__.length && o4.__.push({ __V: f2 }), o4.__[t3];
}
function y(n2) {
  return i2 = 1, d2(z2, n2);
}
function d2(n2, r3, o4) {
  var i3 = p2(t2++, 2);
  return i3.t = n2, i3.__c || (i3.__ = [o4 ? o4(r3) : z2(void 0, r3), function(n3) {
    var t3 = i3.t(i3.__[0], n3);
    i3.__[0] !== t3 && (i3.__ = [t3, i3.__[1]], i3.__c.setState({}));
  }], i3.__c = u2), i3.__;
}
function b2() {
  for (var t3; t3 = c2.shift(); )
    if (t3.__P)
      try {
        t3.__H.__h.forEach(j2), t3.__H.__h.forEach(k2), t3.__H.__h = [];
      } catch (u3) {
        t3.__H.__h = [], l.__e(u3, t3.__v);
      }
}
l.__b = function(n2) {
  u2 = null, e2 && e2(n2);
}, l.__r = function(n2) {
  a2 && a2(n2), t2 = 0;
  var o4 = (u2 = n2.__c).__H;
  o4 && (r2 === u2 ? (o4.__h = [], u2.__h = [], o4.__.forEach(function(n3) {
    n3.__V = f2, n3.u = void 0;
  })) : (o4.__h.forEach(j2), o4.__h.forEach(k2), o4.__h = [])), r2 = u2;
}, l.diffed = function(t3) {
  v2 && v2(t3);
  var i3 = t3.__c;
  i3 && i3.__H && (i3.__H.__h.length && (1 !== c2.push(i3) && o2 === l.requestAnimationFrame || ((o2 = l.requestAnimationFrame) || function(n2) {
    var t4, u3 = function() {
      clearTimeout(r3), g2 && cancelAnimationFrame(t4), setTimeout(n2);
    }, r3 = setTimeout(u3, 100);
    g2 && (t4 = requestAnimationFrame(u3));
  })(b2)), i3.__H.__.forEach(function(n2) {
    n2.u && (n2.__H = n2.u), n2.__V !== f2 && (n2.__ = n2.__V), n2.u = void 0, n2.__V = f2;
  })), r2 = u2 = null;
}, l.__c = function(t3, u3) {
  u3.some(function(t4) {
    try {
      t4.__h.forEach(j2), t4.__h = t4.__h.filter(function(n2) {
        return !n2.__ || k2(n2);
      });
    } catch (r3) {
      u3.some(function(n2) {
        n2.__h && (n2.__h = []);
      }), u3 = [], l.__e(r3, t4.__v);
    }
  }), l2 && l2(t3, u3);
}, l.unmount = function(t3) {
  m2 && m2(t3);
  var u3, r3 = t3.__c;
  r3 && r3.__H && (r3.__H.__.forEach(function(n2) {
    try {
      j2(n2);
    } catch (n3) {
      u3 = n3;
    }
  }), u3 && l.__e(u3, r3.__v));
};
var g2 = "function" == typeof requestAnimationFrame;
function j2(n2) {
  var t3 = u2, r3 = n2.__c;
  "function" == typeof r3 && (n2.__c = void 0, r3()), u2 = t3;
}
function k2(n2) {
  var t3 = u2;
  n2.__c = n2.__(), u2 = t3;
}
function z2(n2, t3) {
  return "function" == typeof t3 ? t3(n2) : t3;
}

// node_modules/ustyler/esm/index.js
function ustyler(template) {
  const text = typeof template == "string" ? [template] : [template[0]];
  for (let i3 = 1, { length } = arguments; i3 < length; i3++)
    text.push(arguments[i3], template[i3]);
  const style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(text.join("")));
  return document.head.appendChild(style);
}

// tests/style.css
var style_default = ustyler`:host {
    --demo: tomato;
}

.button {
    width: 200px;
    height: 200px;
}
`;

// node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var o3 = 0;
function e3(_2, e4, n2, t3, f3) {
  var l3, s2, u3 = {};
  for (s2 in e4)
    "ref" == s2 ? l3 = e4[s2] : u3[s2] = e4[s2];
  var a3 = { type: _2, props: u3, key: n2, ref: l3, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: --o3, __source: f3, __self: t3 };
  if ("function" == typeof _2 && (l3 = _2.defaultProps))
    for (s2 in l3)
      void 0 === u3[s2] && (u3[s2] = l3[s2]);
  return l.vnode && l.vnode(a3), a3;
}

// tests/example-preact.jsx
function Component() {
  const [state] = y();
  return /* @__PURE__ */ e3(p, {
    children: /* @__PURE__ */ e3("button", {
      children: [
        "welcome! ",
        state
      ]
    })
  });
}
export {
  Component
};

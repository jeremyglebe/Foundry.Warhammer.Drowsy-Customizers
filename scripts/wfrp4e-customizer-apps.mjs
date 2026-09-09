//#region src/module/logging.ts
function e(e, ...t) {
	console.info(e, ...t);
}
function t(e, ...t) {
	console.warn(e, ...t);
}
//#endregion
//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function n(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var r = {}, i = [], a = () => {}, o = () => !1, s = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), c = (e) => e.startsWith("onUpdate:"), l = Object.assign, u = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, d = Object.prototype.hasOwnProperty, f = (e, t) => d.call(e, t), p = Array.isArray, m = (e) => C(e) === "[object Map]", h = (e) => C(e) === "[object Set]", g = (e) => C(e) === "[object Date]", _ = (e) => typeof e == "function", v = (e) => typeof e == "string", y = (e) => typeof e == "symbol", b = (e) => typeof e == "object" && !!e, x = (e) => (b(e) || _(e)) && _(e.then) && _(e.catch), S = Object.prototype.toString, C = (e) => S.call(e), w = (e) => C(e).slice(8, -1), ee = (e) => C(e) === "[object Object]", te = (e) => v(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ne = /* @__PURE__ */ n(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), re = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, T = /-\w/g, E = re((e) => e.replace(T, (e) => e.slice(1).toUpperCase())), ie = /\B([A-Z])/g, ae = re((e) => e.replace(ie, "-$1").toLowerCase()), D = re((e) => e.charAt(0).toUpperCase() + e.slice(1)), oe = re((e) => e ? `on${D(e)}` : ""), O = (e, t) => !Object.is(e, t), se = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, ce = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, le = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ue, de = () => ue ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function fe(e) {
	if (p(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = v(r) ? ge(r) : fe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (v(e) || b(e)) return e;
}
var pe = /;(?![^(]*\))/g, me = /:([^]+)/, he = /\/\*[^]*?\*\//g;
function ge(e) {
	let t = {};
	return e.replace(he, "").split(pe).forEach((e) => {
		if (e) {
			let n = e.split(me);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function k(e) {
	let t = "";
	if (v(e)) t = e;
	else if (p(e)) for (let n = 0; n < e.length; n++) {
		let r = k(e[n]);
		r && (t += r + " ");
	}
	else if (b(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var _e = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", ve = /* @__PURE__ */ n(_e);
_e + "";
function ye(e) {
	return !!e || e === "";
}
function be(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = xe(e[r], t[r]);
	return n;
}
function xe(e, t) {
	if (e === t) return !0;
	let n = g(e), r = g(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = y(e), r = y(t), n || r) return e === t;
	if (n = p(e), r = p(t), n || r) return n && r ? be(e, t) : !1;
	if (n = b(e), r = b(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !xe(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function Se(e, t) {
	return e.findIndex((e) => xe(e, t));
}
var Ce = (e) => !!(e && e.__v_isRef === !0), A = (e) => v(e) ? e : e == null ? "" : p(e) || b(e) && (e.toString === S || !_(e.toString)) ? Ce(e) ? A(e.value) : JSON.stringify(e, we, 2) : String(e), we = (e, t) => Ce(t) ? we(e, t.value) : m(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Te(t, r) + " =>"] = n, e), {}) } : h(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Te(e)) } : y(t) ? Te(t) : b(t) && !p(t) && !ee(t) ? String(t) : t, Te = (e, t = "") => y(e) ? `Symbol(${e.description ?? t})` : e, Ee, De = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Ee && (Ee.active ? (this.parent = Ee, this.index = (Ee.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) for (e = 0, t = this.scopes.length; e < t; e++) this.scopes[e].pause();
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) for (e = 0, t = this.scopes.length; e < t; e++) this.scopes[e].resume();
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = Ee;
			try {
				return Ee = this, e();
			} finally {
				Ee = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Ee, Ee = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Ee === this) Ee = this.prevScope;
			else {
				let e = Ee;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function Oe(e) {
	return new De(e);
}
function ke() {
	return Ee;
}
function Ae(e, t = !1) {
	Ee && Ee.cleanups.push(e);
}
var j, je = /* @__PURE__ */ new WeakSet(), Me = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ee && (Ee.active ? Ee.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, je.has(this) && (je.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ie(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ye(this), ze(this);
		let e = j, t = Ge;
		j = this, Ge = !0;
		try {
			return this.fn();
		} finally {
			Be(this), j = e, Ge = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Ue(e);
			this.deps = this.depsTail = void 0, Ye(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? je.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Ve(this) && this.run();
	}
	get dirty() {
		return Ve(this);
	}
}, Ne = 0, Pe, Fe;
function Ie(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Fe, Fe = e;
		return;
	}
	e.next = Pe, Pe = e;
}
function Le() {
	Ne++;
}
function Re() {
	if (--Ne > 0) return;
	if (Fe) {
		let e = Fe;
		for (Fe = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Pe;) {
		let t = Pe;
		for (Pe = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function ze(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Be(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Ue(r), We(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Ve(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (He(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function He(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Xe) || (e.globalVersion = Xe, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ve(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = j, r = Ge;
	j = e, Ge = !0;
	try {
		ze(e);
		let n = e.fn(e._value);
		(t.version === 0 || O(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		j = n, Ge = r, Be(e), e.flags &= -3;
	}
}
function Ue(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Ue(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function We(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Ge = !0, Ke = [];
function qe() {
	Ke.push(Ge), Ge = !1;
}
function Je() {
	let e = Ke.pop();
	Ge = e === void 0 ? !0 : e;
}
function Ye(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = j;
		j = void 0;
		try {
			t();
		} finally {
			j = e;
		}
	}
}
var Xe = 0, Ze = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Qe = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!j || !Ge || j === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== j) t = this.activeLink = new Ze(j, this), j.deps ? (t.prevDep = j.depsTail, j.depsTail.nextDep = t, j.depsTail = t) : j.deps = j.depsTail = t, $e(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = j.depsTail, t.nextDep = void 0, j.depsTail.nextDep = t, j.depsTail = t, j.deps === t && (j.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Xe++, this.notify(e);
	}
	notify(e) {
		Le();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Re();
		}
	}
};
function $e(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) $e(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var et = /* @__PURE__ */ new WeakMap(), tt = /* @__PURE__ */ Symbol(""), nt = /* @__PURE__ */ Symbol(""), rt = /* @__PURE__ */ Symbol("");
function it(e, t, n) {
	if (Ge && j) {
		let t = et.get(e);
		t || et.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Qe()), r.map = t, r.key = n), r.track();
	}
}
function at(e, t, n, r, i, a) {
	let o = et.get(e);
	if (!o) {
		Xe++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Le(), t === "clear") o.forEach(s);
	else {
		let i = p(e), a = i && te(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === rt || !y(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(rt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(tt)), m(e) && s(o.get(nt)));
				break;
			case "delete":
				i || (s(o.get(tt)), m(e) && s(o.get(nt)));
				break;
			case "set":
				m(e) && s(o.get(tt));
				break;
		}
	}
	Re();
}
function ot(e, t) {
	let n = et.get(e);
	return n && n.get(t);
}
function st(e) {
	let t = /* @__PURE__ */ M(e);
	return t === e ? t : (it(t, "iterate", rt), /* @__PURE__ */ Kt(e) ? t : t.map(Yt));
}
function ct(e) {
	return it(e = /* @__PURE__ */ M(e), "iterate", rt), e;
}
function lt(e, t) {
	return /* @__PURE__ */ Gt(e) ? Xt(/* @__PURE__ */ Wt(e) ? Yt(t) : t) : Yt(t);
}
var ut = {
	__proto__: null,
	[Symbol.iterator]() {
		return dt(this, Symbol.iterator, (e) => lt(this, e));
	},
	concat(...e) {
		return st(this).concat(...e.map((e) => p(e) ? st(e) : e));
	},
	entries() {
		return dt(this, "entries", (e) => (e[1] = lt(this, e[1]), e));
	},
	every(e, t) {
		return pt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return pt(this, "filter", e, t, (e) => e.map((e) => lt(this, e)), arguments);
	},
	find(e, t) {
		return pt(this, "find", e, t, (e) => lt(this, e), arguments);
	},
	findIndex(e, t) {
		return pt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return pt(this, "findLast", e, t, (e) => lt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return pt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return pt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ht(this, "includes", e);
	},
	indexOf(...e) {
		return ht(this, "indexOf", e);
	},
	join(e) {
		return st(this).join(e);
	},
	lastIndexOf(...e) {
		return ht(this, "lastIndexOf", e);
	},
	map(e, t) {
		return pt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return gt(this, "pop");
	},
	push(...e) {
		return gt(this, "push", e);
	},
	reduce(e, ...t) {
		return mt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return mt(this, "reduceRight", e, t);
	},
	shift() {
		return gt(this, "shift");
	},
	some(e, t) {
		return pt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return gt(this, "splice", e);
	},
	toReversed() {
		return st(this).toReversed();
	},
	toSorted(e) {
		return st(this).toSorted(e);
	},
	toSpliced(...e) {
		return st(this).toSpliced(...e);
	},
	unshift(...e) {
		return gt(this, "unshift", e);
	},
	values() {
		return dt(this, "values", (e) => lt(this, e));
	}
};
function dt(e, t, n) {
	let r = ct(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Kt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var ft = Array.prototype;
function pt(e, t, n, r, i, a) {
	let o = ct(e), s = o !== e && !/* @__PURE__ */ Kt(e), c = o[t];
	if (c !== ft[t]) {
		let t = c.apply(e, a);
		return s ? Yt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, lt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function mt(e, t, n, r) {
	let i = ct(e), a = i !== e && !/* @__PURE__ */ Kt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = lt(e, t)), n.call(this, t, lt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? lt(e, c) : c;
}
function ht(e, t, n) {
	let r = /* @__PURE__ */ M(e);
	it(r, "iterate", rt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ qt(n[0]) ? (n[0] = /* @__PURE__ */ M(n[0]), r[t](...n)) : i;
}
function gt(e, t, n = []) {
	qe(), Le();
	let r = (/* @__PURE__ */ M(e))[t].apply(e, n);
	return Re(), Je(), r;
}
var _t = /* @__PURE__ */ n("__proto__,__v_isRef,__isVue"), vt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(y));
function yt(e) {
	y(e) || (e = String(e));
	let t = /* @__PURE__ */ M(this);
	return it(t, "has", e), t.hasOwnProperty(e);
}
var bt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Rt : Lt : i ? It : Ft).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = p(e);
		if (!r) {
			let e;
			if (a && (e = ut[t])) return e;
			if (t === "hasOwnProperty") return yt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ N(e) ? e : n);
		if ((y(t) ? vt.has(t) : _t(t)) || (r || it(e, "get", t), i)) return o;
		if (/* @__PURE__ */ N(o)) {
			let e = a && te(t) ? o : o.value;
			return r && b(e) ? /* @__PURE__ */ Ht(e) : e;
		}
		return b(o) ? r ? /* @__PURE__ */ Ht(o) : /* @__PURE__ */ Bt(o) : o;
	}
}, xt = class extends bt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = p(e) && te(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Gt(i);
			if (!/* @__PURE__ */ Kt(n) && !/* @__PURE__ */ Gt(n) && (i = /* @__PURE__ */ M(i), n = /* @__PURE__ */ M(n)), !a && /* @__PURE__ */ N(i) && !/* @__PURE__ */ N(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : f(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ N(e) ? e : r);
		return e === /* @__PURE__ */ M(r) && (o ? O(n, i) && at(e, "set", t, n, i) : at(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = f(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && at(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!y(t) || !vt.has(t)) && it(e, "has", t), n;
	}
	ownKeys(e) {
		return it(e, "iterate", p(e) ? "length" : tt), Reflect.ownKeys(e);
	}
}, St = class extends bt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Ct = /* @__PURE__ */ new xt(), wt = /* @__PURE__ */ new St(), Tt = /* @__PURE__ */ new xt(!0), Et = (e) => e, Dt = (e) => Reflect.getPrototypeOf(e);
function Ot(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ M(i), o = m(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, u = i[e](...r), d = n ? Et : t ? Xt : Yt;
		return !t && it(a, "iterate", c ? nt : tt), l(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: s ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function kt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function At(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ M(r), a = /* @__PURE__ */ M(n);
			e || (O(n, a) && it(i, "get", n), it(i, "get", a));
			let { has: o } = Dt(i), s = t ? Et : e ? Xt : Yt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && it(/* @__PURE__ */ M(t), "iterate", tt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ M(n), i = /* @__PURE__ */ M(t);
			return e || (O(t, i) && it(r, "has", t), it(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ M(a), s = t ? Et : e ? Xt : Yt;
			return !e && it(o, "iterate", tt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return l(n, e ? {
		add: kt("add"),
		set: kt("set"),
		delete: kt("delete"),
		clear: kt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ M(this), r = Dt(n), i = /* @__PURE__ */ M(e), a = !t && !/* @__PURE__ */ Kt(e) && !/* @__PURE__ */ Gt(e) ? i : e;
			return r.has.call(n, a) || O(e, a) && r.has.call(n, e) || O(i, a) && r.has.call(n, i) || (n.add(a), at(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Kt(n) && !/* @__PURE__ */ Gt(n) && (n = /* @__PURE__ */ M(n));
			let r = /* @__PURE__ */ M(this), { has: i, get: a } = Dt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ M(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? O(n, s) && at(r, "set", e, n, s) : at(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ M(this), { has: n, get: r } = Dt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ M(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && at(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ M(this), t = e.size !== 0, n = e.clear();
			return t && at(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Ot(r, e, t);
	}), n;
}
function jt(e, t) {
	let n = At(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(f(n, r) && r in t ? n : t, r, i);
}
var Mt = { get: /* @__PURE__ */ jt(!1, !1) }, Nt = { get: /* @__PURE__ */ jt(!1, !0) }, Pt = { get: /* @__PURE__ */ jt(!0, !1) }, Ft = /* @__PURE__ */ new WeakMap(), It = /* @__PURE__ */ new WeakMap(), Lt = /* @__PURE__ */ new WeakMap(), Rt = /* @__PURE__ */ new WeakMap();
function zt(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return /* @__PURE__ */ Gt(e) ? e : Ut(e, !1, Ct, Mt, Ft);
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return Ut(e, !1, Tt, Nt, It);
}
// @__NO_SIDE_EFFECTS__
function Ht(e) {
	return Ut(e, !0, wt, Pt, Lt);
}
function Ut(e, t, n, r, i) {
	if (!b(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = zt(w(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Wt(e) {
	return /* @__PURE__ */ Gt(e) ? /* @__PURE__ */ Wt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Kt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function qt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function M(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ M(t) : e;
}
function Jt(e) {
	return !f(e, "__v_skip") && Object.isExtensible(e) && ce(e, "__v_skip", !0), e;
}
var Yt = (e) => b(e) ? /* @__PURE__ */ Bt(e) : e, Xt = (e) => b(e) ? /* @__PURE__ */ Ht(e) : e;
// @__NO_SIDE_EFFECTS__
function N(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function P(e) {
	return Zt(e, !1);
}
function Zt(e, t) {
	return /* @__PURE__ */ N(e) ? e : new Qt(e, t);
}
var Qt = class {
	constructor(e, t) {
		this.dep = new Qe(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ M(e), this._value = t ? e : Yt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Kt(e) || /* @__PURE__ */ Gt(e);
		e = n ? e : /* @__PURE__ */ M(e), O(e, t) && (this._rawValue = e, this._value = n ? e : Yt(e), this.dep.trigger());
	}
};
function F(e) {
	return /* @__PURE__ */ N(e) ? e.value : e;
}
var $t = {
	get: (e, t, n) => t === "__v_raw" ? e : F(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ N(i) && !/* @__PURE__ */ N(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function en(e) {
	return /* @__PURE__ */ Wt(e) ? e : new Proxy(e, $t);
}
// @__NO_SIDE_EFFECTS__
function tn(e) {
	let t = p(e) ? Array(e.length) : {};
	for (let n in e) t[n] = on(e, n);
	return t;
}
var nn = class {
	constructor(e, t, n) {
		this._object = e, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0, this._key = y(t) ? t : String(t), this._raw = /* @__PURE__ */ M(e);
		let r = !0, i = e;
		if (!p(e) || y(this._key) || !te(this._key)) do
			r = !/* @__PURE__ */ qt(i) || /* @__PURE__ */ Kt(i);
		while (r && (i = i.__v_raw));
		this._shallow = r;
	}
	get value() {
		let e = this._object[this._key];
		return this._shallow && (e = F(e)), this._value = e === void 0 ? this._defaultValue : e;
	}
	set value(e) {
		if (this._shallow && /* @__PURE__ */ N(this._raw[this._key])) {
			let t = this._object[this._key];
			if (/* @__PURE__ */ N(t)) {
				t.value = e;
				return;
			}
		}
		this._object[this._key] = e;
	}
	get dep() {
		return ot(this._raw, this._key);
	}
}, rn = class {
	constructor(e) {
		this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
};
// @__NO_SIDE_EFFECTS__
function an(e, t, n) {
	return /* @__PURE__ */ N(e) ? e : _(e) ? new rn(e) : b(e) && arguments.length > 1 ? on(e, t, n) : /* @__PURE__ */ P(e);
}
function on(e, t, n) {
	return new nn(e, t, n);
}
var sn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Qe(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Xe - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && j !== this) return Ie(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return He(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function cn(e, t, n = !1) {
	let r, i;
	return _(e) ? r = e : (r = e.get, i = e.set), new sn(r, i, n);
}
var ln = {}, un = /* @__PURE__ */ new WeakMap(), dn = void 0;
function fn(e, t = !1, n = dn) {
	if (n) {
		let t = un.get(n);
		t || un.set(n, t = []), t.push(e);
	}
}
function pn(e, t, n = r) {
	let { immediate: i, deep: o, once: s, scheduler: c, augmentJob: l, call: d } = n, f = (e) => o ? e : /* @__PURE__ */ Kt(e) || o === !1 || o === 0 ? mn(e, 1) : mn(e), m, h, g, v, y = !1, b = !1;
	if (/* @__PURE__ */ N(e) ? (h = () => e.value, y = /* @__PURE__ */ Kt(e)) : /* @__PURE__ */ Wt(e) ? (h = () => f(e), y = !0) : p(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Wt(e) || /* @__PURE__ */ Kt(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ N(e)) return e.value;
		if (/* @__PURE__ */ Wt(e)) return f(e);
		if (_(e)) return d ? d(e, 2) : e();
	})) : h = _(e) ? t ? d ? () => d(e, 2) : e : () => {
		if (g) {
			qe();
			try {
				g();
			} finally {
				Je();
			}
		}
		let t = dn;
		dn = m;
		try {
			return d ? d(e, 3, [v]) : e(v);
		} finally {
			dn = t;
		}
	} : a, t && o) {
		let e = h, t = o === !0 ? Infinity : o;
		h = () => mn(e(), t);
	}
	let x = ke(), S = () => {
		m.stop(), x && x.active && u(x.effects, m);
	};
	if (s && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(ln) : ln, w = (e) => {
		if (!(!(m.flags & 1) || !m.dirty && !e)) if (t) {
			let n = m.run();
			if (e || o || y || (b ? n.some((e, t) => O(e, C[t])) : O(n, C))) {
				g && g();
				let e = dn;
				dn = m;
				try {
					let e = [
						n,
						C === ln ? void 0 : b && C[0] === ln ? [] : C,
						v
					];
					C = n, d ? d(t, 3, e) : t(...e);
				} finally {
					dn = e;
				}
			}
		} else m.run();
	};
	return l && l(w), m = new Me(h), m.scheduler = c ? () => c(w, !1) : w, v = (e) => fn(e, !1, m), g = m.onStop = () => {
		let e = un.get(m);
		if (e) {
			if (d) d(e, 4);
			else for (let t of e) t();
			un.delete(m);
		}
	}, t ? i ? w(!0) : C = m.run() : c ? c(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function mn(e, t = Infinity, n) {
	if (t <= 0 || !b(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ N(e)) mn(e.value, t, n);
	else if (p(e)) for (let r = 0; r < e.length; r++) mn(e[r], t, n);
	else if (h(e) || m(e)) e.forEach((e) => {
		mn(e, t, n);
	});
	else if (ee(e)) {
		for (let r in e) mn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && mn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function hn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		_n(e, t, n);
	}
}
function gn(e, t, n, r) {
	if (_(e)) {
		let i = hn(e, t, n, r);
		return i && x(i) && i.catch((e) => {
			_n(e, t, n);
		}), i;
	}
	if (p(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(gn(e[a], t, n, r));
		return i;
	}
}
function _n(e, t, n, i = !0) {
	let a = t ? t.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = t && t.appContext.config || r;
	if (t) {
		let r = t.parent, i = t.proxy, a = `https://vuejs.org/error-reference/#runtime-${n}`;
		for (; r;) {
			let t = r.ec;
			if (t) {
				for (let n = 0; n < t.length; n++) if (t[n](e, i, a) === !1) return;
			}
			r = r.parent;
		}
		if (o) {
			qe(), hn(o, null, 10, [
				e,
				i,
				a
			]), Je();
			return;
		}
	}
	vn(e, n, a, i, s);
}
function vn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var yn = [], bn = -1, xn = [], Sn = null, Cn = 0, wn = /* @__PURE__ */ Promise.resolve(), Tn = null;
function En(e) {
	let t = Tn || wn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Dn(e) {
	let t = bn + 1, n = yn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = yn[r], a = Nn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function On(e) {
	if (!(e.flags & 1)) {
		let t = Nn(e), n = yn[yn.length - 1];
		!n || !(e.flags & 2) && t >= Nn(n) ? yn.push(e) : yn.splice(Dn(t), 0, e), e.flags |= 1, kn();
	}
}
function kn() {
	Tn ||= wn.then(Pn);
}
function An(e) {
	p(e) ? xn.push(...e) : Sn && e.id === -1 ? Sn.splice(Cn + 1, 0, e) : e.flags & 1 || (xn.push(e), e.flags |= 1), kn();
}
function jn(e, t, n = bn + 1) {
	for (; n < yn.length; n++) {
		let t = yn[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			yn.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function Mn(e) {
	if (xn.length) {
		let e = [...new Set(xn)].sort((e, t) => Nn(e) - Nn(t));
		if (xn.length = 0, Sn) {
			Sn.push(...e);
			return;
		}
		for (Sn = e, Cn = 0; Cn < Sn.length; Cn++) {
			let e = Sn[Cn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Sn = null, Cn = 0;
	}
}
var Nn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Pn(e) {
	try {
		for (bn = 0; bn < yn.length; bn++) {
			let e = yn[bn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), hn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; bn < yn.length; bn++) {
			let e = yn[bn];
			e && (e.flags &= -2);
		}
		bn = -1, yn.length = 0, Mn(e), Tn = null, (yn.length || xn.length) && Pn(e);
	}
}
var Fn = null, In = null;
function Ln(e) {
	let t = Fn;
	return Fn = e, In = e && e.type.__scopeId || null, t;
}
function I(e, t = Fn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Yi(-1);
		let i = Ln(t), a;
		try {
			a = e(...n);
		} finally {
			Ln(i), r._d && Yi(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function Rn(e, t) {
	if (Fn === null) return e;
	let n = ka(Fn), i = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [a, o, s, c = r] = t[e];
		a && (_(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && mn(o), i.push({
			dir: a,
			instance: n,
			value: o,
			oldValue: void 0,
			arg: s,
			modifiers: c
		}));
	}
	return e;
}
function zn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (qe(), gn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Je());
	}
}
function Bn(e, t) {
	if (pa) {
		let n = pa.provides, r = pa.parent && pa.parent.provides;
		r === n && (n = pa.provides = Object.create(r)), n[e] = t;
	}
}
function Vn(e, t, n = !1) {
	let r = ma();
	if (r || Zr) {
		let i = Zr ? Zr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && _(t) ? t.call(r && r.proxy) : t;
	}
}
function Hn() {
	return !!(ma() || Zr);
}
var Un = /* @__PURE__ */ Symbol.for("v-scx"), Wn = () => Vn(Un);
function Gn(e, t, n) {
	return Kn(e, t, n);
}
function Kn(e, t, n = r) {
	let { immediate: i, deep: o, flush: s, once: c } = n, u = l({}, n), d = t && i || !t && s !== "post", f;
	if (ba) {
		if (s === "sync") {
			let e = Wn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = a, e.resume = a, e.pause = a, e;
		}
	}
	let p = pa;
	u.call = (e, t, n) => gn(e, p, t, n);
	let m = !1;
	s === "post" ? u.scheduler = (e) => {
		ki(e, p && p.suspense);
	} : s !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : On(e);
	}), u.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = pn(e, t, u);
	return ba && (f ? f.push(h) : d && h()), h;
}
function qn(e, t, n) {
	let r = this.proxy, i = v(e) ? e.includes(".") ? Jn(r, e) : () => r[e] : e.bind(r, r), a;
	_(t) ? a = t : (a = t.handler, n = t);
	let o = _a(this), s = Kn(i, a.bind(r), n);
	return o(), s;
}
function Jn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Yn = /* @__PURE__ */ Symbol("_vte"), Xn = (e) => e.__isTeleport, Zn = /* @__PURE__ */ Symbol("_leaveCb");
function Qn(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, Qn(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function L(e, t) {
	return _(e) ? /* @__PURE__ */ l({ name: e.name }, t, { setup: e }) : e;
}
function $n() {
	let e = ma();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function er(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function tr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var nr = /* @__PURE__ */ new WeakMap();
function rr(e, t, n, i, a = !1) {
	if (p(e)) {
		e.forEach((e, r) => rr(e, t && (p(t) ? t[r] : t), n, i, a));
		return;
	}
	if (ar(i) && !a) {
		i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && rr(e, t, n, i.component.subTree);
		return;
	}
	let s = i.shapeFlag & 4 ? ka(i.component) : i.el, c = a ? null : s, { i: l, r: d } = e, m = t && t.r, h = l.refs === r ? l.refs = {} : l.refs, g = l.setupState, y = /* @__PURE__ */ M(g), b = g === r ? o : (e) => tr(h, e) ? !1 : f(y, e), x = (e, t) => !(t && tr(h, t));
	if (m != null && m !== d) {
		if (ir(t), v(m)) h[m] = null, b(m) && (g[m] = null);
		else if (/* @__PURE__ */ N(m)) {
			let e = t;
			x(m, e.k) && (m.value = null), e.k && (h[e.k] = null);
		}
	}
	if (_(d)) hn(d, l, 12, [c, h]);
	else {
		let t = v(d), r = /* @__PURE__ */ N(d);
		if (t || r) {
			let i = () => {
				if (e.f) {
					let n = t ? b(d) ? g[d] : h[d] : x(d) || !e.k ? d.value : h[e.k];
					if (a) p(n) && u(n, s);
					else if (p(n)) n.includes(s) || n.push(s);
					else if (t) h[d] = [s], b(d) && (g[d] = h[d]);
					else {
						let t = [s];
						x(d, e.k) && (d.value = t), e.k && (h[e.k] = t);
					}
				} else t ? (h[d] = c, b(d) && (g[d] = c)) : r && (x(d, e.k) && (d.value = c), e.k && (h[e.k] = c));
			};
			if (c) {
				let t = () => {
					i(), nr.delete(e);
				};
				t.id = -1, nr.set(e, t), ki(t, n);
			} else ir(e), i();
		}
	}
}
function ir(e) {
	let t = nr.get(e);
	t && (t.flags |= 8, nr.delete(e));
}
de().requestIdleCallback, de().cancelIdleCallback;
var ar = (e) => !!e.type.__asyncLoader, or = (e) => e.type.__isKeepAlive;
function sr(e, t) {
	lr(e, "a", t);
}
function cr(e, t) {
	lr(e, "da", t);
}
function lr(e, t, n = pa) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (dr(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) or(e.parent.vnode) && ur(r, t, n, e), e = e.parent;
	}
}
function ur(e, t, n, r) {
	let i = dr(t, e, r, !0);
	vr(() => {
		u(r[t], i);
	}, n);
}
function dr(e, t, n = pa, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			qe();
			let i = _a(n), a = gn(t, n, e, r);
			return i(), Je(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var fr = (e) => (t, n = pa) => {
	(!ba || e === "sp") && dr(e, (...e) => t(...e), n);
}, pr = fr("bm"), mr = fr("m"), hr = fr("bu"), gr = fr("u"), _r = fr("bum"), vr = fr("um"), yr = fr("sp"), br = fr("rtg"), xr = fr("rtc");
function Sr(e, t = pa) {
	dr("ec", e, t);
}
var Cr = /* @__PURE__ */ Symbol.for("v-ndc");
function R(e, t, n, r) {
	let i, a = n && n[r], o = p(e);
	if (o || v(e)) {
		let n = o && /* @__PURE__ */ Wt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Kt(e), s = /* @__PURE__ */ Gt(e), e = ct(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Xt(Yt(e[n])) : Yt(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (b(e)) if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
	else {
		let n = Object.keys(e);
		i = Array(n.length);
		for (let r = 0, o = n.length; r < o; r++) {
			let o = n[r];
			i[r] = t(e[o], o, r, a && a[r]);
		}
	}
	else i = [];
	return n && (n[r] = i), i;
}
function wr(e, t, n = {}, r, i) {
	if (Fn.ce || Fn.parent && ar(Fn.parent) && Fn.parent.ce) {
		let e = Object.keys(n).length > 0;
		return t !== "default" && (n.name = t), B(), H(z, null, [W("slot", n, r && r())], e ? -2 : 64);
	}
	let a = e[t];
	a && a._c && (a._d = !1), B();
	let o = a && Tr(a(n)), s = n.key || o && o.key, c = H(z, { key: (s && !y(s) ? s : `_${t}`) + (!o && r ? "_fb" : "") }, o || (r ? r() : []), o && e._ === 1 ? 64 : -2);
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), a && a._c && (a._d = !0), c;
}
function Tr(e) {
	return e.some((e) => Zi(e) ? !(e.type === Ui || e.type === z && !Tr(e.children)) : !0) ? e : null;
}
var Er = (e) => e ? ya(e) ? ka(e) : Er(e.parent) : null, Dr = /* @__PURE__ */ l(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Er(e.parent),
	$root: (e) => Er(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Rr(e),
	$forceUpdate: (e) => e.f ||= () => {
		On(e.update);
	},
	$nextTick: (e) => e.n ||= En.bind(e.proxy),
	$watch: (e) => qn.bind(e)
}), Or = (e, t) => e !== r && !e.__isScriptSetup && f(e, t), kr = {
	get({ _: e }, t) {
		if (t === "__v_skip") return !0;
		let { ctx: n, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (t[0] !== "$") {
			let e = s[t];
			if (e !== void 0) switch (e) {
				case 1: return i[t];
				case 2: return a[t];
				case 4: return n[t];
				case 3: return o[t];
			}
			else if (Or(i, t)) return s[t] = 1, i[t];
			else if (a !== r && f(a, t)) return s[t] = 2, a[t];
			else if (f(o, t)) return s[t] = 3, o[t];
			else if (n !== r && f(n, t)) return s[t] = 4, n[t];
			else Nr && (s[t] = 0);
		}
		let u = Dr[t], d, p;
		if (u) return t === "$attrs" && it(e.attrs, "get", ""), u(e);
		if ((d = c.__cssModules) && (d = d[t])) return d;
		if (n !== r && f(n, t)) return s[t] = 4, n[t];
		if (p = l.config.globalProperties, f(p, t)) return p[t];
	},
	set({ _: e }, t, n) {
		let { data: i, setupState: a, ctx: o } = e;
		return Or(a, t) ? (a[t] = n, !0) : i !== r && f(i, t) ? (i[t] = n, !0) : f(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (o[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(n[c] || e !== r && c[0] !== "$" && f(e, c) || Or(t, c) || f(o, c) || f(i, c) || f(Dr, c) || f(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? f(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Ar() {
	return jr("useSlots").slots;
}
function jr(e) {
	let t = ma();
	return t.setupContext ||= Oa(t);
}
function Mr(e) {
	return p(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var Nr = !0;
function Pr(e) {
	let t = Rr(e), n = e.proxy, r = e.ctx;
	Nr = !1, t.beforeCreate && Ir(t.beforeCreate, e, "bc");
	let { data: i, computed: o, methods: s, watch: c, provide: l, inject: u, created: d, beforeMount: f, mounted: m, beforeUpdate: h, updated: g, activated: v, deactivated: y, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: ee, renderTracked: te, renderTriggered: ne, errorCaptured: re, serverPrefetch: T, expose: E, inheritAttrs: ie, components: ae, directives: D, filters: oe } = t;
	if (u && Fr(u, r, null), s) for (let e in s) {
		let t = s[e];
		_(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		b(t) && (e.data = /* @__PURE__ */ Bt(t));
	}
	if (Nr = !0, o) for (let e in o) {
		let t = o[e], i = q({
			get: _(t) ? t.bind(n, n) : _(t.get) ? t.get.bind(n, n) : a,
			set: !_(t) && _(t.set) ? t.set.bind(n) : a
		});
		Object.defineProperty(r, e, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		});
	}
	if (c) for (let e in c) Lr(c[e], r, n, e);
	if (l) {
		let e = _(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Bn(t, e[t]);
		});
	}
	d && Ir(d, e, "c");
	function O(e, t) {
		p(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (O(pr, f), O(mr, m), O(hr, h), O(gr, g), O(sr, v), O(cr, y), O(Sr, re), O(xr, te), O(br, ne), O(_r, S), O(vr, w), O(yr, T), p(E)) if (E.length) {
		let t = e.exposed ||= {};
		E.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	ee && e.render === a && (e.render = ee), ie != null && (e.inheritAttrs = ie), ae && (e.components = ae), D && (e.directives = D), T && er(e);
}
function Fr(e, t, n = a) {
	p(e) && (e = Ur(e));
	for (let n in e) {
		let r = e[n], i;
		i = b(r) ? "default" in r ? Vn(r.from || n, r.default, !0) : Vn(r.from || n) : Vn(r), /* @__PURE__ */ N(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Ir(e, t, n) {
	gn(p(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Lr(e, t, n, r) {
	let i = r.includes(".") ? Jn(n, r) : () => n[r];
	if (v(e)) {
		let n = t[e];
		_(n) && Gn(i, n);
	} else if (_(e)) Gn(i, e.bind(n));
	else if (b(e)) if (p(e)) e.forEach((e) => Lr(e, t, n, r));
	else {
		let r = _(e.handler) ? e.handler.bind(n) : t[e.handler];
		_(r) && Gn(i, r, e);
	}
}
function Rr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => zr(c, e, o, !0)), zr(c, t, o)), b(t) && a.set(t, c), c;
}
function zr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && zr(e, a, n, !0), i && i.forEach((t) => zr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Br[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Br = {
	data: Vr,
	props: Kr,
	emits: Kr,
	methods: Gr,
	computed: Gr,
	beforeCreate: Wr,
	created: Wr,
	beforeMount: Wr,
	mounted: Wr,
	beforeUpdate: Wr,
	updated: Wr,
	beforeDestroy: Wr,
	beforeUnmount: Wr,
	destroyed: Wr,
	unmounted: Wr,
	activated: Wr,
	deactivated: Wr,
	errorCaptured: Wr,
	serverPrefetch: Wr,
	components: Gr,
	directives: Gr,
	watch: qr,
	provide: Vr,
	inject: Hr
};
function Vr(e, t) {
	return t ? e ? function() {
		return l(_(e) ? e.call(this, this) : e, _(t) ? t.call(this, this) : t);
	} : t : e;
}
function Hr(e, t) {
	return Gr(Ur(e), Ur(t));
}
function Ur(e) {
	if (p(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Wr(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Gr(e, t) {
	return e ? l(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Kr(e, t) {
	return e ? p(e) && p(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : l(/* @__PURE__ */ Object.create(null), Mr(e), Mr(t ?? {})) : t;
}
function qr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = l(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Wr(e[r], t[r]);
	return n;
}
function Jr() {
	return {
		app: null,
		config: {
			isNativeTag: o,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var Yr = 0;
function Xr(e, t) {
	return function(n, r = null) {
		_(n) || (n = l({}, n)), r != null && !b(r) && (r = null);
		let i = Jr(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: Yr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: ja,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && _(e.install) ? (a.add(e), e.install(c, ...t)) : _(e) && (a.add(e), e(c, ...t))), c;
			},
			mixin(e) {
				return i.mixins.includes(e) || i.mixins.push(e), c;
			},
			component(e, t) {
				return t ? (i.components[e] = t, c) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, c) : i.directives[e];
			},
			mount(a, o, l) {
				if (!s) {
					let u = c._ceVNode || W(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, ka(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (gn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = Zr;
				Zr = c;
				try {
					return e();
				} finally {
					Zr = t;
				}
			}
		};
		return c;
	};
}
var Zr = null, Qr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${E(t)}Modifiers`] || e[`${ae(t)}Modifiers`];
function $r(e, t, ...n) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || r, a = n, o = t.startsWith("update:"), s = o && Qr(i, t.slice(7));
	s && (s.trim && (a = n.map((e) => v(e) ? e.trim() : e)), s.number && (a = n.map(le)));
	let c, l = i[c = oe(t)] || i[c = oe(E(t))];
	!l && o && (l = i[c = oe(ae(t))]), l && gn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, gn(u, e, 6, a);
	}
}
var ei = /* @__PURE__ */ new WeakMap();
function ti(e, t, n = !1) {
	let r = n ? ei : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!_(e)) {
		let r = (e) => {
			let n = ti(e, t, !0);
			n && (s = !0, l(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (b(e) && r.set(e, null), null) : (p(a) ? a.forEach((e) => o[e] = null) : l(o, a), b(e) && r.set(e, o), o);
}
function ni(e, t) {
	return !e || !s(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), f(e, t[0].toLowerCase() + t.slice(1)) || f(e, ae(t)) || f(e, t));
}
function ri(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Ln(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = aa(u.call(t, e, d, f, m, p, h)), y = s;
		} else {
			let e = t;
			v = aa(e.length > 1 ? e(f, {
				attrs: s,
				slots: o,
				emit: l
			}) : e(f, null)), y = t.props ? s : ii(s);
		}
	} catch (t) {
		Gi.length = 0, _n(t, e, 1), v = W(Ui);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(c) && (y = ai(y, a)), b = ra(b, y, !1, !0));
	}
	return n.dirs && (b = ra(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Qn(b, n.transition), v = b, Ln(_), v;
}
var ii = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || s(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, ai = (e, t) => {
	let n = {};
	for (let r in e) (!c(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function oi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? si(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (ci(o, r, n) && !ni(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? o ? si(r, o, l) : !0 : !!o;
	return !1;
}
function si(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (ci(t, e, a) && !ni(n, a)) return !0;
	}
	return !1;
}
function ci(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && b(r) && b(i) ? !xe(r, i) : r !== i;
}
function li({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var di = {}, fi = () => Object.create(di), pi = (e) => Object.getPrototypeOf(e) === di;
function mi(e, t, n, r = !1) {
	let i = {}, a = fi();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), gi(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ Vt(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function hi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ M(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (ni(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) if (f(a, o)) u !== a[o] && (a[o] = u, l = !0);
				else {
					let t = E(o);
					i[t] = _i(c, s, t, u, e, !1);
				}
				else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		gi(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !f(t, a) && ((r = ae(a)) === a || !f(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = _i(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !f(t, e)) && (delete a[e], l = !0);
	}
	l && at(e.attrs, "set", "");
}
function gi(e, t, n, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let r in t) {
		if (ne(r)) continue;
		let l = t[r], u;
		a && f(a, u = E(r)) ? !o || !o.includes(u) ? n[u] = l : (c ||= {})[u] = l : ni(e.emitsOptions, r) || (!(r in i) || l !== i[r]) && (i[r] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ M(n), i = c || r;
		for (let r = 0; r < o.length; r++) {
			let s = o[r];
			n[s] = _i(a, t, s, i[s], e, !f(i, s));
		}
	}
	return s;
}
function _i(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = f(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && _(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = _a(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === ae(n)) && (r = !0));
	}
	return r;
}
var vi = /* @__PURE__ */ new WeakMap();
function yi(e, t, n = !1) {
	let a = n ? vi : t.propsCache, o = a.get(e);
	if (o) return o;
	let s = e.props, c = {}, u = [], d = !1;
	if (!_(e)) {
		let r = (e) => {
			d = !0;
			let [n, r] = yi(e, t, !0);
			l(c, n), r && u.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!s && !d) return b(e) && a.set(e, i), i;
	if (p(s)) for (let e = 0; e < s.length; e++) {
		let t = E(s[e]);
		bi(t) && (c[t] = r);
	}
	else if (s) for (let e in s) {
		let t = E(e);
		if (bi(t)) {
			let n = s[e], r = c[t] = p(n) || _(n) ? { type: n } : l({}, n), i = r.type, a = !1, o = !0;
			if (p(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = _(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				} else n === "String" && (o = !1);
			}
			else a = _(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || f(r, "default")) && u.push(t);
		}
	}
	let m = [c, u];
	return b(e) && a.set(e, m), m;
}
function bi(e) {
	return e[0] !== "$" && !ne(e);
}
var xi = (e) => e === "_" || e === "_ctx" || e === "$stable", Si = (e) => p(e) ? e.map(aa) : [aa(e)], Ci = (e, t, n) => {
	if (t._n) return t;
	let r = I((...e) => Si(t(...e)), n);
	return r._c = !1, r;
}, wi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (xi(n)) continue;
		let i = e[n];
		if (_(i)) t[n] = Ci(n, i, r);
		else if (i != null) {
			let e = Si(i);
			t[n] = () => e;
		}
	}
}, Ti = (e, t) => {
	let n = Si(t);
	e.slots.default = () => n;
}, Ei = (e, t, n) => {
	for (let r in t) (n || !xi(r)) && (e[r] = t[r]);
}, Di = (e, t, n) => {
	let r = e.slots = fi();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Ei(r, t, n), n && ce(r, "_", e, !0)) : wi(t, r);
	} else t && Ti(e, t);
}, Oi = (e, t, n) => {
	let { vnode: i, slots: a } = e, o = !0, s = r;
	if (i.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? o = !1 : Ei(a, t, n) : (o = !t.$stable, wi(t, a)), s = t;
	} else t && (Ti(e, t), s = { default: 1 });
	if (o) for (let e in a) !xi(e) && s[e] == null && delete a[e];
}, ki = Vi;
function Ai(e) {
	return ji(e);
}
function ji(e, t) {
	let n = de();
	n.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = a, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Qi(e, t) && (r = ye(e), he(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Hi:
				y(e, t, n, r);
				break;
			case Ui:
				b(e, t, n, r);
				break;
			case Wi:
				e ?? x(t, n, r, o);
				break;
			case z:
				ae(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? D(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, Se);
		}
		u != null && i ? rr(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && rr(e.ref, null, a, e, !0);
	}, y = (e, t, n, r) => {
		if (e == null) o(t.el = u(t.children), n, r);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, r) => {
		e == null ? o(t.el = d(t.children || ""), n, r) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) ee(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), T(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, ee = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && re(e.children, d, null, r, i, Mi(e, a), s, u), _ && zn(e, null, r, "created"), te(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !ne(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && la(f, r, e);
		}
		_ && zn(e, null, r, "beforeMount");
		let v = Pi(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && ki(() => {
			try {
				f && la(f, r, e), v && g.enter(d), _ && zn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, te = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Bi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				te(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, re = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) v(null, e[l] = s ? oa(e[l]) : aa(e[l]), t, n, r, i, a, o, s);
	}, T = (e, t, n, i, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || r, h = t.props || r, g;
		if (n && Ni(n, !1), (g = h.onVnodeBeforeUpdate) && la(g, n, t, e), f && zn(t, e, n, "beforeUpdate"), n && Ni(n, !0), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? E(e.dynamicChildren, d, l, n, i, Mi(t, a), o) : s || ue(e, t, l, null, n, i, Mi(t, a), o, !1), u > 0) {
			if (u & 16) ie(l, m, h, n, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], i = m[r], o = h[r];
					(o !== i || r === "value") && c(l, r, i, o, a, n);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !s && d == null && ie(l, m, h, n, a);
		((g = h.onVnodeUpdated) || f) && ki(() => {
			g && la(g, n, t, e), f && zn(t, e, n, "updated");
		}, i);
	}, E = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s];
			v(c, l, c.el && (c.type === z || !Qi(c, l) || c.shapeFlag & 198) ? m(c.el) : n, null, r, i, a, o, !0);
		}
	}, ie = (e, t, n, i, a) => {
		if (t !== n) {
			if (t !== r) for (let r in t) !ne(r) && !(r in n) && c(e, r, t[r], null, a, i);
			for (let r in n) {
				if (ne(r)) continue;
				let o = n[r], s = t[r];
				o !== s && r !== "value" && c(e, r, s, o, a, i);
			}
			"value" in n && c(e, "value", t.value, n.value, a);
		}
	}, ae = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), re(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (E(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Fi(e, t, !0)) : ue(e, t, n, f, i, a, s, c, l);
	}, D = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : oe(t, n, r, i, a, o, c) : O(e, t, c);
	}, oe = (e, t, n, r, i, a, o) => {
		let s = e.component = fa(e, r, i);
		if (or(e) && (s.ctx.renderer = Se), xa(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ce, o), !e.el) {
				let r = s.subTree = W(Ui);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ce(s, e, t, n, i, a, o);
	}, O = (e, t, n) => {
		let r = t.component = e.component;
		if (oi(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			le(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, ce = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Li(e);
					if (n) {
						t && (t.el = c.el, le(e, t, o)), n.asyncDep.then(() => {
							ki(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Ni(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && se(n), (d = t.props && t.props.onVnodeBeforeUpdate) && la(d, s, t, c), Ni(e, !0);
				let f = ri(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ye(p), e, i, a), t.el = f.el, u === null && li(e, f.el), r && ki(r, i), (d = t.props && t.props.onVnodeUpdated) && ki(() => la(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = ar(t);
				if (Ni(e, !1), l && se(l), !m && (o = c && c.onVnodeBeforeMount) && la(o, d, t), Ni(e, !0), s && A) {
					let t = () => {
						e.subTree = ri(e), A(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = ri(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && ki(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					ki(() => la(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && ar(d.vnode) && d.vnode.shapeFlag & 256) && e.a && ki(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Me(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => On(u), Ni(e, !0), l();
	}, le = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, hi(e, t.props, r, n), Oi(e, t.children, n), qe(), jn(e), Je();
	}, ue = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				pe(l, d, n, r, i, a, o, s, c);
				return;
			} else if (f & 256) {
				fe(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && ve(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? pe(l, d, n, r, i, a, o, s, c) : ve(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && re(d, n, r, i, a, o, s, c));
	}, fe = (e, t, n, r, a, o, s, c, l) => {
		e ||= i, t ||= i;
		let u = e.length, d = t.length, f = Math.min(u, d), p;
		for (p = 0; p < f; p++) {
			let r = t[p] = l ? oa(t[p]) : aa(t[p]);
			v(e[p], r, n, null, a, o, s, c, l);
		}
		u > d ? ve(e, a, o, !0, !1, f) : re(t, n, r, a, o, s, c, l, f);
	}, pe = (e, t, n, r, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let r = e[u], i = t[u] = l ? oa(t[u]) : aa(t[u]);
			if (Qi(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let r = e[f], i = t[p] = l ? oa(t[p]) : aa(t[p]);
			if (Qi(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, i = e < d ? t[e].el : r;
				for (; u <= p;) v(null, t[u] = l ? oa(t[u]) : aa(t[u]), n, i, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) he(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? oa(t[u]) : aa(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let r = e[u];
				if (y >= b) {
					he(r, a, o, !0);
					continue;
				}
				let i;
				if (r.key != null) i = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Qi(r, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? he(r, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(r, t[i], n, null, a, o, s, c, l), y++);
			}
			let w = x ? Ii(C) : i;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, i = t[e], f = t[e + 1], p = e + 1 < d ? f.el || zi(f) : r;
				C[u] === 0 ? v(null, i, n, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? me(i, n, p, 2) : _--);
			}
		}
	}, me = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			me(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, Se);
			return;
		}
		if (c === z) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) me(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Wi) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) if (r === 0) l.persisted && !a[Zn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), ki(() => l.enter(a), i));
		else {
			let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? s(a) : o(a, t, n);
			}, d = () => {
				let e = a._isLeaving || !!a[Zn];
				a._isLeaving && a[Zn](!0), l.persisted && !e ? u() : r(a, () => {
					u(), c && c();
				});
			};
			i ? i(a, u, d) : d();
		}
		else o(a, t, n);
	}, he = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (qe(), rr(s, null, n, e, !0), Je()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !ar(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && la(_, t, e), u & 6) _e(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && zn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, Se, r) : l && !l.hasOnce && (a !== z || d > 0 && d & 64) ? ve(l, t, n, !1, !0) : (a === z && d & 384 || !i && u & 16) && ve(c, t, n), r && ge(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && ki(() => {
			_ && la(_, t, e), h && zn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ge = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === z) {
			k(n, r);
			return;
		}
		if (t === Wi) {
			C(e);
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, k = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, _e = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Ri(c), Ri(l), r && se(r), i.stop(), a && (a.flags |= 8, he(o, e, t, n)), s && ki(s, t), ki(() => {
			e.isUnmounted = !0;
		}, t);
	}, ve = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) he(e[o], t, n, r, i);
	}, ye = (e) => {
		if (e.shapeFlag & 6) return ye(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Yn];
		return n ? h(n) : t;
	}, be = !1, xe = (e, t, n) => {
		let r;
		e == null ? t._vnode && (he(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, be ||= (be = !0, jn(r), Mn(), !1);
	}, Se = {
		p: v,
		um: he,
		m: me,
		r: ge,
		mt: oe,
		mc: re,
		pc: ue,
		pbc: E,
		n: ye,
		o: e
	}, Ce, A;
	return t && ([Ce, A] = t(Se)), {
		render: xe,
		hydrate: Ce,
		createApp: Xr(xe, Ce)
	};
}
function Mi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ni({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Pi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Fi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (p(r) && p(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = oa(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Fi(t, a)), a.type === Hi && (a.patchFlag === -1 && (a = i[e] = oa(a)), a.el = t.el), a.type === Ui && !a.el && (a.el = t.el);
	}
}
function Ii(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function Li(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Li(t);
}
function Ri(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function zi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? zi(t.subTree) : null;
}
var Bi = (e) => e.__isSuspense;
function Vi(e, t) {
	t && t.pendingBranch ? p(e) ? t.effects.push(...e) : t.effects.push(e) : An(e);
}
var z = /* @__PURE__ */ Symbol.for("v-fgt"), Hi = /* @__PURE__ */ Symbol.for("v-txt"), Ui = /* @__PURE__ */ Symbol.for("v-cmt"), Wi = /* @__PURE__ */ Symbol.for("v-stc"), Gi = [], Ki = null;
function B(e = !1) {
	Gi.push(Ki = e ? null : []);
}
function qi() {
	Gi.pop(), Ki = Gi[Gi.length - 1] || null;
}
var Ji = 1;
function Yi(e, t = !1) {
	Ji += e, e < 0 && Ki && t && (Ki.hasOnce = !0);
}
function Xi(e) {
	return e.dynamicChildren = Ji > 0 ? Ki || i : null, qi(), Ji > 0 && Ki && Ki.push(e), e;
}
function V(e, t, n, r, i, a) {
	return Xi(U(e, t, n, r, i, a, !0));
}
function H(e, t, n, r, i) {
	return Xi(W(e, t, n, r, i, !0));
}
function Zi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Qi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var $i = ({ key: e }) => e ?? null, ea = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : v(e) || /* @__PURE__ */ N(e) || _(e) ? {
	i: Fn,
	r: e,
	k: t,
	f: !!n
} : e);
function U(e, t = null, n = null, r = 0, i = null, a = e === z ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && $i(t),
		ref: t && ea(t),
		scopeId: In,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: Fn
	};
	return s ? (sa(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= v(n) ? 8 : 16), Ji > 0 && !o && Ki && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Ki.push(c), c;
}
var W = ta;
function ta(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Cr) && (e = Ui), Zi(e)) {
		let r = ra(e, t, !0);
		return n && sa(r, n), Ji > 0 && !a && Ki && (r.shapeFlag & 6 ? Ki[Ki.indexOf(e)] = r : Ki.push(r)), r.patchFlag = -2, r;
	}
	if (Aa(e) && (e = e.__vccOpts), t) {
		t = na(t);
		let { class: e, style: n } = t;
		e && !v(e) && (t.class = k(e)), b(n) && (/* @__PURE__ */ qt(n) && !p(n) && (n = l({}, n)), t.style = fe(n));
	}
	let o = v(e) ? 1 : Bi(e) ? 128 : Xn(e) ? 64 : b(e) ? 4 : _(e) ? 2 : 0;
	return U(e, t, n, r, i, o, a, !0);
}
function na(e) {
	return e ? /* @__PURE__ */ qt(e) || pi(e) ? l({}, e) : e : null;
}
function ra(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ca(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && $i(l),
		ref: t && t.ref ? n && a ? p(a) ? a.concat(ea(t)) : [a, ea(t)] : ea(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== z ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && ra(e.ssContent),
		ssFallback: e.ssFallback && ra(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && Qn(u, c.clone(u)), u;
}
function G(e = " ", t = 0) {
	return W(Hi, null, e, t);
}
function ia(e, t) {
	let n = W(Wi, null, e);
	return n.staticCount = t, n;
}
function K(e = "", t = !1) {
	return t ? (B(), H(Ui, null, e)) : W(Ui, null, e);
}
function aa(e) {
	return e == null || typeof e == "boolean" ? W(Ui) : p(e) ? W(z, null, e.slice()) : Zi(e) ? oa(e) : W(Hi, null, String(e));
}
function oa(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : ra(e);
}
function sa(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (p(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), sa(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !pi(t) ? t._ctx = Fn : r === 3 && Fn && (Fn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else _(t) ? (t = {
		default: t,
		_ctx: Fn
	}, n = 32) : (t = String(t), r & 64 ? (n = 16, t = [G(t)]) : n = 8);
	e.children = t, e.shapeFlag |= n;
}
function ca(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = k([t.class, r.class]));
		else if (e === "style") t.style = fe([t.style, r.style]);
		else if (s(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(p(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !c(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function la(e, t, n, r = null) {
	gn(e, t, 7, [n, r]);
}
var ua = Jr(), da = 0;
function fa(e, t, n) {
	let i = e.type, a = (t ? t.appContext : e.appContext) || ua, o = {
		uid: da++,
		vnode: e,
		type: i,
		parent: t,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new De(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: t ? t.provides : Object.create(a.provides),
		ids: t ? t.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: yi(i, a),
		emitsOptions: ti(i, a),
		emit: null,
		emitted: null,
		propsDefaults: r,
		inheritAttrs: i.inheritAttrs,
		ctx: r,
		data: r,
		props: r,
		attrs: r,
		slots: r,
		refs: r,
		setupState: r,
		setupContext: null,
		suspense: n,
		suspenseId: n ? n.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = $r.bind(null, o), e.ce && e.ce(o), o;
}
var pa = null, ma = () => pa || Fn, ha, ga;
{
	let e = de(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ha = t("__VUE_INSTANCE_SETTERS__", (e) => pa = e), ga = t("__VUE_SSR_SETTERS__", (e) => ba = e);
}
var _a = (e) => {
	let t = pa;
	return ha(e), e.scope.on(), () => {
		e.scope.off(), ha(t);
	};
}, va = () => {
	pa && pa.scope.off(), ha(null);
};
function ya(e) {
	return e.vnode.shapeFlag & 4;
}
var ba = !1;
function xa(e, t = !1, n = !1) {
	t && ga(t);
	let { props: r, children: i } = e.vnode, a = ya(e);
	mi(e, r, a, t), Di(e, i, n || t);
	let o = a ? Sa(e, t) : void 0;
	return t && ga(!1), o;
}
function Sa(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, kr);
	let { setup: r } = n;
	if (r) {
		qe();
		let n = e.setupContext = r.length > 1 ? Oa(e) : null, i = _a(e), a = hn(r, e, 0, [e.props, n]), o = x(a);
		if (Je(), i(), (o || e.sp) && !ar(e) && er(e), o) {
			if (a.then(va, va), t) return a.then((n) => {
				Ca(e, n, t);
			}).catch((t) => {
				_n(t, e, 0);
			});
			e.asyncDep = a;
		} else Ca(e, a, t);
	} else Ea(e, t);
}
function Ca(e, t, n) {
	_(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : b(t) && (e.setupState = en(t)), Ea(e, n);
}
var wa, Ta;
function Ea(e, t, n) {
	let r = e.type;
	if (!e.render) {
		if (!t && wa && !r.render) {
			let t = r.template || Rr(e).template;
			if (t) {
				let { isCustomElement: n, compilerOptions: i } = e.appContext.config, { delimiters: a, compilerOptions: o } = r;
				r.render = wa(t, l(l({
					isCustomElement: n,
					delimiters: a
				}, i), o));
			}
		}
		e.render = r.render || a, Ta && Ta(e);
	}
	{
		let t = _a(e);
		qe();
		try {
			Pr(e);
		} finally {
			Je(), t();
		}
	}
}
var Da = { get(e, t) {
	return it(e, "get", ""), e[t];
} };
function Oa(e) {
	return {
		attrs: new Proxy(e.attrs, Da),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function ka(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(en(Jt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Dr) return Dr[n](e);
		},
		has(e, t) {
			return t in e || t in Dr;
		}
	}) : e.proxy;
}
function Aa(e) {
	return _(e) && "__vccOpts" in e;
}
var q = (e, t) => /* @__PURE__ */ cn(e, t, ba), ja = "3.5.38", Ma = void 0, Na = typeof window < "u" && window.trustedTypes;
if (Na) try {
	Ma = /* @__PURE__ */ Na.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Pa = Ma ? (e) => Ma.createHTML(e) : (e) => e, Fa = "http://www.w3.org/2000/svg", Ia = "http://www.w3.org/1998/Math/MathML", La = typeof document < "u" ? document : null, Ra = La && /* @__PURE__ */ La.createElement("template"), za = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? La.createElementNS(Fa, e) : t === "mathml" ? La.createElementNS(Ia, e) : n ? La.createElement(e, { is: n }) : La.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => La.createTextNode(e),
	createComment: (e) => La.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => La.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
		else {
			Ra.innerHTML = Pa(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ra.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ba = /* @__PURE__ */ Symbol("_vtc");
function Va(e, t, n) {
	let r = e[Ba];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Ha = /* @__PURE__ */ Symbol("_vod"), Ua = /* @__PURE__ */ Symbol("_vsh"), Wa = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[Ha] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Ga(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Ga(e, !0), r.enter(e)) : r.leave(e, () => {
			Ga(e, !1);
		}) : Ga(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Ga(e, t);
	}
};
function Ga(e, t) {
	e.style.display = t ? e[Ha] : "none", e[Ua] = !t;
}
var Ka = /* @__PURE__ */ Symbol(""), qa = /(?:^|;)\s*display\s*:/;
function Ja(e, t, n) {
	let r = e.style, i = v(n), a = !1;
	if (n && !i) {
		if (t) if (v(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? Xa(r, t, "");
		}
		else for (let e in t) n[e] ?? Xa(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Xa(r, i, "") : eo(e, i, !v(t) && t ? t[i] : void 0, o) || Xa(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Ka];
			e && (n += ";" + e), r.cssText = n, a = qa.test(n);
		}
	} else t && e.removeAttribute("style");
	Ha in e && (e[Ha] = a ? r.display : "", e[Ua] && (r.display = "none"));
}
var Ya = /\s*!important$/;
function Xa(e, t, n) {
	if (p(n)) n.forEach((n) => Xa(e, t, n));
	else if (n ??= "", t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = $a(e, t);
		Ya.test(n) ? e.setProperty(ae(r), n.replace(Ya, ""), "important") : e[r] = n;
	}
}
var Za = [
	"Webkit",
	"Moz",
	"ms"
], Qa = {};
function $a(e, t) {
	let n = Qa[t];
	if (n) return n;
	let r = E(t);
	if (r !== "filter" && r in e) return Qa[t] = r;
	r = D(r);
	for (let n = 0; n < Za.length; n++) {
		let i = Za[n] + r;
		if (i in e) return Qa[t] = i;
	}
	return t;
}
function eo(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && v(r) && n === r;
}
var to = "http://www.w3.org/1999/xlink";
function no(e, t, n, r, i, a = ve(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(to, t.slice(6, t.length)) : e.setAttributeNS(to, t, n) : n == null || a && !ye(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : y(n) ? String(n) : n);
}
function ro(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Pa(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		(r !== i || !("_value" in e)) && (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = ye(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function io(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function ao(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var oo = /* @__PURE__ */ Symbol("_vei");
function so(e, t, n, r, i = null) {
	let a = e[oo] || (e[oo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = lo(t);
		r ? io(e, n, a[t] = mo(r, i), s) : o && (ao(e, n, o, s), a[t] = void 0);
	}
}
var co = /(?:Once|Passive|Capture)$/;
function lo(e) {
	let t;
	if (co.test(e)) {
		t = {};
		let n;
		for (; n = e.match(co);) e = e.slice(0, e.length - n[0].length), t[n[0].toLowerCase()] = !0;
	}
	return [e[2] === ":" ? e.slice(3) : ae(e.slice(2)), t];
}
var uo = 0, fo = /* @__PURE__ */ Promise.resolve(), po = () => uo ||= (fo.then(() => uo = 0), Date.now());
function mo(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (p(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && gn(e, t, 5, a);
			}
		} else gn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = po(), n;
}
var ho = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, go = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? Va(e, r, o) : t === "style" ? Ja(e, n, r) : s(t) ? c(t) || so(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : _o(e, t, r, o)) ? (ro(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && no(e, t, r, o, a, t !== "value")) : e._isVueCE && (vo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !v(r))) ? ro(e, E(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), no(e, t, r, o));
};
function _o(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && ho(t) && _(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return ho(t) && v(n) ? !1 : t in e;
}
function vo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = E(t);
	return Array.isArray(n) ? n.some((e) => E(e) === r) : Object.keys(n).some((e) => E(e) === r);
}
var yo = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return p(t) ? (e) => se(t, e) : t;
};
function bo(e) {
	e.target.composing = !0;
}
function xo(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var So = /* @__PURE__ */ Symbol("_assign");
function Co(e, t, n) {
	return t && (e = e.trim()), n && (e = le(e)), e;
}
var wo = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e[So] = yo(i);
		let a = r || i.props && i.props.type === "number";
		io(e, t ? "change" : "input", (t) => {
			t.target.composing || e[So](Co(e.value, n, a));
		}), (n || a) && io(e, "change", () => {
			e.value = Co(e.value, n, a);
		}), t || (io(e, "compositionstart", bo), io(e, "compositionend", xo), io(e, "change", xo));
	},
	mounted(e, { value: t }) {
		e.value = t ?? "";
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[So] = yo(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? le(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, To = {
	deep: !0,
	created(e, t, n) {
		e[So] = yo(n), io(e, "change", () => {
			let t = e._modelValue, n = ko(e), r = e.checked, i = e[So];
			if (p(t)) {
				let e = Se(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (h(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(Ao(e, r));
		});
	},
	mounted: Eo,
	beforeUpdate(e, t, n) {
		e[So] = yo(n), Eo(e, t, n);
	}
};
function Eo(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (p(t)) i = Se(t, r.props.value) > -1;
	else if (h(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = xe(t, Ao(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Do = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		let i = h(t);
		io(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? le(ko(e)) : ko(e));
			e[So](e.multiple ? i ? new Set(t) : t : t[0]), e._assigning = !0, En(() => {
				e._assigning = !1;
			});
		}), e[So] = yo(r);
	},
	mounted(e, { value: t }) {
		Oo(e, t);
	},
	beforeUpdate(e, t, n) {
		e[So] = yo(n);
	},
	updated(e, { value: t }) {
		e._assigning || Oo(e, t);
	}
};
function Oo(e, t) {
	let n = e.multiple, r = p(t);
	if (!(n && !r && !h(t))) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = ko(a);
			if (n) if (r) {
				let e = typeof o;
				e === "string" || e === "number" ? a.selected = t.some((e) => String(e) === String(o)) : a.selected = Se(t, o) > -1;
			} else a.selected = t.has(o);
			else if (xe(ko(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function ko(e) {
	return "_value" in e ? e._value : e.value;
}
function Ao(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var jo = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Mo = {
	stop: (e) => e.stopPropagation(),
	prevent: (e) => e.preventDefault(),
	self: (e) => e.target !== e.currentTarget,
	ctrl: (e) => !e.ctrlKey,
	shift: (e) => !e.shiftKey,
	alt: (e) => !e.altKey,
	meta: (e) => !e.metaKey,
	left: (e) => "button" in e && e.button !== 0,
	middle: (e) => "button" in e && e.button !== 1,
	right: (e) => "button" in e && e.button !== 2,
	exact: (e, t) => jo.some((n) => e[`${n}Key`] && !t.includes(n))
}, No = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Mo[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Po = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, Fo = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = ae(n.key);
		if (t.some((e) => e === r || Po[e] === r)) return e(n);
	}));
}, Io = /* @__PURE__ */ l({ patchProp: go }, za), Lo;
function Ro() {
	return Lo ||= Ai(Io);
}
var zo = ((...e) => {
	let t = Ro().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Vo(e);
		if (!r) return;
		let i = t._component;
		!_(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Bo(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Bo(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Vo(e) {
	return v(e) ? document.querySelector(e) : e;
}
//#endregion
//#region node_modules/pinia/dist/pinia.mjs
var Ho = typeof window < "u", Uo, Wo = (e) => Uo = e, Go = Symbol();
function Ko(e) {
	return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var qo;
(function(e) {
	e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(qo ||= {});
var Jo = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null };
function Yo(e, { autoBom: t = !1 } = {}) {
	return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["﻿", e], { type: e.type }) : e;
}
function Xo(e, t, n) {
	let r = new XMLHttpRequest();
	r.open("GET", e), r.responseType = "blob", r.onload = function() {
		ts(r.response, t, n);
	}, r.onerror = function() {
		console.error("could not download file");
	}, r.send();
}
function Zo(e) {
	let t = new XMLHttpRequest();
	t.open("HEAD", e, !1);
	try {
		t.send();
	} catch {}
	return t.status >= 200 && t.status <= 299;
}
function Qo(e) {
	try {
		e.dispatchEvent(new MouseEvent("click"));
	} catch {
		let t = new MouseEvent("click", {
			bubbles: !0,
			cancelable: !0,
			view: window,
			detail: 0,
			screenX: 80,
			screenY: 20,
			clientX: 80,
			clientY: 20,
			ctrlKey: !1,
			altKey: !1,
			shiftKey: !1,
			metaKey: !1,
			button: 0,
			relatedTarget: null
		});
		e.dispatchEvent(t);
	}
}
var $o = typeof navigator == "object" ? navigator : { userAgent: "" }, es = /Macintosh/.test($o.userAgent) && /AppleWebKit/.test($o.userAgent) && !/Safari/.test($o.userAgent), ts = Ho ? typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !es ? ns : "msSaveOrOpenBlob" in $o ? rs : is : () => {};
function ns(e, t = "download", n) {
	let r = document.createElement("a");
	r.download = t, r.rel = "noopener", typeof e == "string" ? (r.href = e, r.origin === location.origin ? Qo(r) : Zo(r.href) ? Xo(e, t, n) : (r.target = "_blank", Qo(r))) : (r.href = URL.createObjectURL(e), setTimeout(function() {
		URL.revokeObjectURL(r.href);
	}, 4e4), setTimeout(function() {
		Qo(r);
	}, 0));
}
function rs(e, t = "download", n) {
	if (typeof e == "string") if (Zo(e)) Xo(e, t, n);
	else {
		let t = document.createElement("a");
		t.href = e, t.target = "_blank", setTimeout(function() {
			Qo(t);
		});
	}
	else navigator.msSaveOrOpenBlob(Yo(e, n), t);
}
function is(e, t, n, r) {
	if (r ||= open("", "_blank"), r && (r.document.title = r.document.body.innerText = "downloading..."), typeof e == "string") return Xo(e, t, n);
	let i = e.type === "application/octet-stream", a = /constructor/i.test(String(Jo.HTMLElement)) || "safari" in Jo, o = /CriOS\/[\d]+/.test(navigator.userAgent);
	if ((o || i && a || es) && typeof FileReader < "u") {
		let t = new FileReader();
		t.onloadend = function() {
			let e = t.result;
			if (typeof e != "string") throw r = null, Error("Wrong reader.result type");
			e = o ? e : e.replace(/^data:[^;]*;/, "data:attachment/file;"), r ? r.location.href = e : location.assign(e), r = null;
		}, t.readAsDataURL(e);
	} else {
		let t = URL.createObjectURL(e);
		r ? r.location.assign(t) : location.href = t, r = null, setTimeout(function() {
			URL.revokeObjectURL(t);
		}, 4e4);
	}
}
var { assign: as } = Object;
function os() {
	let e = Oe(!0), t = e.run(() => /* @__PURE__ */ P({})), n = [], r = [], i = Jt({
		install(e) {
			Wo(i), i._a = e, e.provide(Go, i), e.config.globalProperties.$pinia = i, r.forEach((e) => n.push(e)), r = [];
		},
		use(e) {
			return this._a ? n.push(e) : r.push(e), this;
		},
		_p: n,
		_a: null,
		_e: e,
		_s: /* @__PURE__ */ new Map(),
		state: t
	});
	return i;
}
var ss = () => {};
function cs(e, t, n, r = ss) {
	e.add(t);
	let i = () => {
		e.delete(t) && r();
	};
	return !n && ke() && Ae(i), i;
}
function ls(e, ...t) {
	e.forEach((e) => {
		e(...t);
	});
}
var us = (e) => e(), ds = Symbol(), fs = Symbol();
function ps(e, t) {
	e instanceof Map && t instanceof Map ? t.forEach((t, n) => e.set(n, t)) : e instanceof Set && t instanceof Set && t.forEach(e.add, e);
	for (let n in t) {
		if (!t.hasOwnProperty(n)) continue;
		let r = t[n], i = e[n];
		Ko(i) && Ko(r) && e.hasOwnProperty(n) && !/* @__PURE__ */ N(r) && !/* @__PURE__ */ Wt(r) ? e[n] = ps(i, r) : e[n] = r;
	}
	return e;
}
var ms = Symbol();
function hs(e) {
	return !Ko(e) || !Object.prototype.hasOwnProperty.call(e, ms);
}
var { assign: gs } = Object;
function _s(e) {
	return !!(/* @__PURE__ */ N(e) && e.effect);
}
function vs(e, t, n, r) {
	let { state: i, actions: a, getters: o } = t, s = n.state.value[e], c;
	function l() {
		return s || (n.state.value[e] = i ? i() : {}), gs(/* @__PURE__ */ tn(n.state.value[e]), a, Object.keys(o || {}).reduce((t, r) => (t[r] = Jt(q(() => {
			Wo(n);
			let t = n._s.get(e);
			return o[r].call(t, t);
		})), t), {}));
	}
	return c = ys(e, l, t, n, r, !0), c;
}
function ys(e, t, n = {}, r, i, a) {
	let o, s = gs({ actions: {} }, n), c = { deep: !0 }, l, u, d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), p = r.state.value[e];
	!a && !p && (r.state.value[e] = {});
	let m;
	function h(t) {
		let n;
		l = u = !1, typeof t == "function" ? (t(r.state.value[e]), n = {
			type: qo.patchFunction,
			storeId: e,
			events: void 0
		}) : (ps(r.state.value[e], t), n = {
			type: qo.patchObject,
			payload: t,
			storeId: e,
			events: void 0
		});
		let i = m = Symbol();
		En().then(() => {
			m === i && (l = !0);
		}), u = !0, ls(d, n, r.state.value[e]);
	}
	let g = a ? function() {
		let { state: e } = n, t = e ? e() : {};
		this.$patch((e) => {
			gs(e, t);
		});
	} : ss;
	function _() {
		o.stop(), d.clear(), f.clear(), r._s.delete(e);
	}
	let v = (t, n = "") => {
		if (ds in t) return t[fs] = n, t;
		let i = function() {
			Wo(r);
			let n = Array.from(arguments), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
			function s(e) {
				a.add(e);
			}
			function c(e) {
				o.add(e);
			}
			ls(f, {
				args: n,
				name: i[fs],
				store: y,
				after: s,
				onError: c
			});
			let l;
			try {
				l = t.apply(this && this.$id === e ? this : y, n);
			} catch (e) {
				throw ls(o, e), e;
			}
			return l instanceof Promise ? l.then((e) => (ls(a, e), e)).catch((e) => (ls(o, e), Promise.reject(e))) : (ls(a, l), l);
		};
		return i[ds] = !0, i[fs] = n, i;
	}, y = /* @__PURE__ */ Bt({
		_p: r,
		$id: e,
		$onAction: cs.bind(null, f),
		$patch: h,
		$reset: g,
		$subscribe(t, n = {}) {
			let i = cs(d, t, n.detached, () => a()), a = o.run(() => Gn(() => r.state.value[e], (r) => {
				(n.flush === "sync" ? u : l) && t({
					storeId: e,
					type: qo.direct,
					events: void 0
				}, r);
			}, gs({}, c, n)));
			return i;
		},
		$dispose: _
	});
	r._s.set(e, y);
	let b = (r._a && r._a.runWithContext || us)(() => r._e.run(() => (o = Oe()).run(() => t({ action: v }))));
	for (let t in b) {
		let n = b[t];
		/* @__PURE__ */ N(n) && !_s(n) || /* @__PURE__ */ Wt(n) ? a || (p && hs(n) && (/* @__PURE__ */ N(n) ? n.value = p[t] : ps(n, p[t])), r.state.value[e][t] = n) : typeof n == "function" && (b[t] = v(n, t), s.actions[t] = n);
	}
	return gs(y, b), gs(/* @__PURE__ */ M(y), b), Object.defineProperty(y, "$state", {
		get: () => r.state.value[e],
		set: (e) => {
			h((t) => {
				gs(t, e);
			});
		}
	}), r._p.forEach((e) => {
		gs(y, o.run(() => e({
			store: y,
			app: r._a,
			pinia: r,
			options: s
		})));
	}), p && a && n.hydrate && n.hydrate(y.$state, p), l = !0, u = !0, y;
}
function bs(e, t, n) {
	let r, i = typeof t == "function";
	r = i ? n : t;
	function a(n, a) {
		let o = Hn();
		return n ||= o ? Vn(Go, null) : null, n && Wo(n), n = Uo, n._s.has(e) || (i ? ys(e, t, r, n) : vs(e, r, n)), n._s.get(e);
	}
	return a.$id = e, a;
}
function xs(e) {
	let t = /* @__PURE__ */ M(e), n = {};
	for (let r in t) {
		let i = t[r];
		i.effect ? n[r] = q({
			get: () => e[r],
			set(t) {
				e[r] = t;
			}
		}) : (/* @__PURE__ */ N(i) || /* @__PURE__ */ Wt(i)) && (n[r] = /* @__PURE__ */ an(e, r));
	}
	return n;
}
//#endregion
//#region src/types/wfrp4e/characteristics.ts
var J = {
	Agility: "ag",
	BallisticSkill: "bs",
	Dexterity: "dex",
	Fellowship: "fel",
	Initiative: "i",
	Intelligence: "int",
	Strength: "s",
	Toughness: "t",
	WeaponSkill: "ws",
	Willpower: "wp"
}, Ss = {
	[J.Agility]: "Agility",
	[J.BallisticSkill]: "Ballistic Skill",
	[J.Dexterity]: "Dexterity",
	[J.Fellowship]: "Fellowship",
	[J.Initiative]: "Initiative",
	[J.Intelligence]: "Intelligence",
	[J.Strength]: "Strength",
	[J.Toughness]: "Toughness",
	[J.WeaponSkill]: "Weapon Skill",
	[J.Willpower]: "Willpower"
}, Cs = {
	agility: J.Agility,
	"ballistic skill": J.BallisticSkill,
	dexterity: J.Dexterity,
	fellowship: J.Fellowship,
	initiative: J.Initiative,
	intelligence: J.Intelligence,
	strength: J.Strength,
	toughness: J.Toughness,
	"weapon skill": J.WeaponSkill,
	willpower: J.Willpower
};
function ws(e) {
	return e in Ss;
}
//#endregion
//#region src/functions/npc-builder/create-default-trait-config.ts
function Ts() {
	return {
		attackType: "melee",
		bonusCharacteristic: "",
		damage: !1,
		defaultDifficulty: "challenging",
		dice: "",
		rollable: !1,
		skill: "",
		sl: !0,
		specification: ""
	};
}
function Es(e, t) {
	return `${e}:${Ms(t)}`;
}
function Ds(e) {
	let t = e.level ?? 1;
	return Number.isFinite(t) ? Math.max(1, Math.floor(t)) * 5 : 5;
}
function Os(e) {
	return e.name;
}
function ks(e, t) {
	return e === "characteristic" ? t.allowBaseActorCharacteristics : e === "skill" ? t.allowBaseActorSkills : t.allowBaseActorTalents;
}
function As(e, t) {
	return {
		...Ts(),
		...e,
		...t
	};
}
function js(e, t) {
	return Ms(e) === Ms(t);
}
function Ms(e) {
	return e.trim().toLocaleLowerCase();
}
function Ns(e) {
	return Number.isFinite(e) ? Math.max(1, Math.floor(e)) : 1;
}
function Ps(e) {
	let t = 0;
	for (let n of e) t += n.count;
	return t;
}
function Fs(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = Ms(r);
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
//#endregion
//#region src/functions/npc-builder/skill-specialization.ts
function Is(e, t, n) {
	return `${e}:${Vs(t)}:${n}`;
}
function Ls(e, t) {
	let n = e.trim(), r = t.trim();
	return r ? `${n} (${r})` : n;
}
function Rs(e) {
	let t = /^(?<base>.+?)\s*\((?<specialization>[^)]+)\)\s*$/.exec(e.trim());
	if (!t?.groups) return null;
	let n = t.groups.base?.trim() ?? "", r = t.groups.specialization?.trim() ?? "";
	return !n || !r || zs(e) ? null : {
		baseName: n,
		originalName: e,
		specialization: r
	};
}
function zs(e) {
	let t = /^(?<base>.+?)\s*\((?<specialization>[^)]+)\)\s*$/.exec(e.trim());
	if (!t?.groups) return null;
	let n = t.groups.base?.trim() ?? "", r = t.groups.specialization?.trim() ?? "", i = Us(r);
	return !n || !r || !Hs(r, i) ? null : {
		baseName: n,
		options: i,
		originalName: e,
		specialization: r
	};
}
function Bs(e, t) {
	let n = /* @__PURE__ */ new Map();
	return t.map((t) => {
		let r = Vs(t), i = n.get(r) ?? 0;
		return n.set(r, i + 1), {
			occurrence: i,
			originalName: t,
			resolutionKey: Is(e, t, i)
		};
	});
}
function Vs(e) {
	return e.trim().replaceAll(/\s+/g, " ").toLocaleLowerCase();
}
function Hs(e, t) {
	return e.trim().toLocaleLowerCase() === "any" || t.length > 1;
}
function Us(e) {
	return e.split(/\s+or\s+/i).map((e) => e.trim()).filter(Boolean);
}
//#endregion
//#region src/functions/npc-builder/advancements/source-counts.ts
function Ws(e, t) {
	return t <= 0 ? [] : [{
		count: t,
		kind: "career",
		label: `${e} extra time`
	}];
}
function Gs(e, t) {
	let n = Math.max(0, Math.floor(t)), r = [];
	for (let t of e) {
		if (n <= 0) break;
		let e = Math.min(t.count, n);
		e > 0 && r.push({
			...t,
			count: e
		}), n -= e;
	}
	return r;
}
//#endregion
//#region src/functions/npc-builder/advancements/talent-maximums.ts
function Ks(e, t, n, r) {
	let i = Js(qs(e, r), n);
	return i.value === null ? t : Math.min(t, Math.max(0, i.value - e.baseAdvances));
}
function qs(e, t) {
	let n = t[Ms(e.name)];
	return {
		maximumFormula: e.talentMaximumFormula ?? n?.maximumFormula ?? "",
		maximumKey: e.talentMaximumKey ?? n?.maximumKey ?? ""
	};
}
function Js(e, t) {
	let n = e.maximumKey.trim().toLocaleLowerCase();
	if (!n) return {
		label: "Unknown",
		value: null
	};
	if (n === "none") return {
		label: "-",
		value: null
	};
	if (n === "custom") return Ys(e.maximumFormula, t);
	let r = Number(n);
	if (Number.isFinite(r)) {
		let e = Math.max(0, Math.floor(r));
		return {
			label: `${e}`,
			value: e
		};
	}
	if (ws(n)) {
		let e = t[n] ?? 0, r = Math.max(0, Math.floor(e / 10));
		return {
			label: `${Ss[n]} Bonus (${r})`,
			value: r
		};
	}
	return {
		label: e.maximumKey || "Unknown",
		value: null
	};
}
function Ys(e, t) {
	let n = e.trim(), r = Number(n);
	if (Number.isFinite(r)) {
		let e = Math.max(0, Math.floor(r));
		return {
			label: `${e}`,
			value: e
		};
	}
	let i = /@characteristics\.([a-z]+)\.bonus/i.exec(n)?.[1]?.toLocaleLowerCase();
	if (i && ws(i)) {
		let e = t[i] ?? 0, n = Math.max(0, Math.floor(e / 10));
		return {
			label: `${Ss[i]} Bonus (${n})`,
			value: n
		};
	}
	return {
		label: n || "Custom",
		value: null
	};
}
//#endregion
//#region src/functions/npc-builder/advancements/career-grants.ts
function Xs(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e.careers) {
		let i = Fs($s(r, t, e.skillGrantResolutions)), a = Ds(r) / 5, o = Math.max(0, Ns(r.quantity) - 1) * 5;
		for (let e of i) {
			let i = Es(t, e), s = n.get(i);
			if (s) {
				a > s.highestLevel && (s.highestLevel = a, s.highestLevelSource = Os(r)), o > 0 && s.extraSources.push({
					count: o,
					kind: "career",
					label: `${r.name} extra time`
				});
				continue;
			}
			n.set(i, {
				extraSources: Ws(r.name, o),
				highestLevel: a,
				highestLevelSource: Os(r),
				name: e
			});
		}
	}
	for (let r of n.values()) Qs(e, {
		careerValue: r.highestLevel * 5 + Ps(r.extraSources),
		kind: t,
		name: r.name,
		sources: [{
			count: r.highestLevel * 5,
			kind: "career",
			label: r.highestLevelSource
		}, ...r.extraSources]
	});
}
function Zs(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.careers) {
		let r = Fs($s(n, "talent", e.skillGrantResolutions)), i = Math.max(0, Ns(n.quantity) - 1);
		for (let e of r) {
			let r = Es("talent", e), a = t.get(r);
			if (a) {
				i > 0 && a.extraSources.push({
					count: i,
					kind: "career",
					label: `${n.name} extra time`
				});
				continue;
			}
			t.set(r, {
				extraSources: Ws(n.name, i),
				firstSource: n.name,
				name: e
			});
		}
	}
	for (let n of t.values()) Qs(e, {
		careerValue: 1 + Ps(n.extraSources),
		kind: "talent",
		name: n.name,
		sources: [{
			count: 1,
			kind: "career",
			label: n.firstSource
		}, ...n.extraSources]
	}, e.characteristicTotals);
}
function Qs(e, t, n = {}) {
	let r = Es(t.kind, t.name), i = e.entries.get(r);
	if (i) {
		let r = t.kind === "talent" && i.includedFromBase ? t.sources.slice(1) : t.sources, a = t.kind === "talent" ? Ks(i, Ps(r), n, e.talentMaximums) : t.careerValue;
		i.careerValue = a, i.includedFromCareer = !0, i.sources = [...i.sources.filter((e) => e.kind === "base"), ...Gs(r, a)];
		return;
	}
	let a = {
		baseAdvances: 0,
		baseValue: 0,
		careerValue: t.careerValue,
		current: t.careerValue,
		includedFromBase: !1,
		includedFromCareer: !0,
		includedFromCustom: !1,
		kind: t.kind,
		minimumCurrent: 0,
		minimumTotal: 0,
		name: t.name,
		sources: t.sources
	};
	t.kind === "talent" && (a.careerValue = Ks(a, t.careerValue, n, e.talentMaximums), a.current = a.careerValue, a.sources = Gs(t.sources, a.careerValue)), e.entries.set(r, { ...a });
}
function $s(e, t, n) {
	return t === "characteristic" ? e.grants.characteristics : t === "skill" ? Bs(e.uuid, e.grants.skills).map((e) => n[e.resolutionKey] || e.originalName) : e.grants.talents;
}
//#endregion
//#region src/functions/npc-builder/advancements/entry-context.ts
function ec(e, t) {
	let n = {};
	for (let r of e.values()) {
		if (r.kind !== "characteristic") continue;
		let e = Cs[Ms(r.name)];
		if (!e) continue;
		let i = t[Es(r.kind, r.name)] ?? 0, a = Math.max(r.minimumCurrent, Math.floor(r.careerValue + i));
		n[e] = Math.max(0, r.baseValue + a);
	}
	return n;
}
function tc(e, t, n) {
	return e.kind === "skill" ? nc(e, t, n) : e.kind === "talent" ? rc(e, t, n) : e;
}
function nc(e, t, n) {
	let r = ic(e) ?? ac(e.name, n.skillCharacteristics) ?? oc(e.name, n.baseActorDraftData);
	if (!r) return {
		...e,
		minimumCurrent: -e.baseValue,
		minimumTotal: 0
	};
	let i = t[r.characteristicKey] ?? 0, a = Math.max(0, e.baseAdvances), o = Math.floor(e.baseModifier ?? 0), s = [{
		count: i,
		kind: "characteristic",
		label: r.characteristicName
	}];
	return a > 0 && s.push({
		count: a,
		kind: "base",
		label: "Base skill advances"
	}), o !== 0 && s.push({
		count: o,
		kind: "base",
		label: "Stored modifier"
	}), {
		...e,
		baseValue: i + a + o,
		characteristicKey: r.characteristicKey,
		characteristicName: r.characteristicName,
		characteristicValue: i,
		minimumCurrent: -a,
		minimumTotal: i,
		sources: [...s, ...e.sources]
	};
}
function rc(e, t, n) {
	let r = qs(e, n.talentMaximums), i = Js(r, t);
	return {
		...e,
		minimumCurrent: -e.baseAdvances,
		minimumTotal: 0,
		talentMaximumFormula: r.maximumFormula,
		talentMaximumKey: r.maximumKey,
		talentMaximumLabel: i.label,
		talentMaximumValue: i.value
	};
}
function ic(e) {
	return !e.characteristicKey || !e.characteristicName ? null : {
		characteristicKey: e.characteristicKey,
		characteristicName: e.characteristicName,
		skillName: e.name
	};
}
function ac(e, t) {
	return t[Ms(e)] ?? null;
}
function oc(e, t) {
	let n = t.advancements.find((t) => t.kind === "skill" && js(t.name, e));
	return n?.characteristicKey ? {
		characteristicKey: n.characteristicKey,
		characteristicName: n.characteristicName ?? Ss[n.characteristicKey],
		skillName: e
	} : null;
}
//#endregion
//#region src/functions/npc-builder/advancements/derive-advancements.ts
function sc(e) {
	let t = fc(e.baseActorDraftData), n = {
		careers: e.careers,
		entries: t,
		skillGrantResolutions: e.skillGrantResolutions,
		talentMaximums: e.talentMaximums
	};
	Xs(n, "characteristic"), Xs(n, "skill");
	let r = ec(t, e.manualAdvancementDeltas);
	return Zs({
		...n,
		characteristicTotals: r
	}), pc(t, e.customAdvancements), [...t.values()].filter((t) => t.includedFromCareer || t.includedFromCustom || ks(t.kind, e.settings)).map((t) => {
		let n = tc(t, r, e), i = Es(t.kind, t.name), a = e.manualAdvancementDeltas[i] ?? 0, o = n.careerValue + a;
		return {
			...n,
			current: Math.max(n.minimumCurrent, Math.floor(o))
		};
	}).sort(mc);
}
function cc(e, t) {
	let n = Number.isFinite(t) ? t : 0;
	return Math.max(e.minimumCurrent, Math.floor(n)) - e.careerValue;
}
function lc(e, t) {
	let n = Number.isFinite(t) ? t : 0;
	return cc(e, Math.max(e.minimumTotal, Math.floor(n)) - e.baseValue);
}
function uc(e, t) {
	return {
		...e,
		...Object.fromEntries(t.map((e) => [Ms(e.skillName), e]))
	};
}
function dc(e, t) {
	return {
		...e,
		...Object.fromEntries(t.map((e) => [Ms(e.talentName), e]))
	};
}
function fc(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.advancements) {
		let e = Es(n.kind, n.name), r = {
			baseAdvances: n.baseAdvances,
			baseValue: n.current,
			careerValue: 0,
			current: 0,
			includedFromBase: !0,
			includedFromCareer: !1,
			includedFromCustom: !1,
			kind: n.kind,
			minimumCurrent: -n.current,
			minimumTotal: 0,
			name: n.name,
			sources: []
		};
		n.baseModifier !== void 0 && (r.baseModifier = n.baseModifier), n.characteristicKey && (r.characteristicKey = n.characteristicKey, r.characteristicName = n.characteristicName ?? Ss[n.characteristicKey]), n.kind === "talent" && n.baseAdvances > 0 && r.sources.push({
			count: n.baseAdvances,
			kind: "base",
			label: "Base"
		}), n.talentMaximumFormula && (r.talentMaximumFormula = n.talentMaximumFormula), n.talentMaximumKey && (r.talentMaximumKey = n.talentMaximumKey), t.set(e, r);
	}
	return t;
}
function pc(e, t) {
	for (let n of t) {
		let t = Es(n.kind, n.name), r = {
			count: n.advances,
			kind: "custom",
			label: "Dropped"
		}, i = e.get(t);
		if (i) {
			i.careerValue += n.advances, i.includedFromCustom = !0, i.sources.push(r), i.sourceUuid = i.sourceUuid ?? n.sourceUuid;
			continue;
		}
		e.set(t, {
			baseAdvances: 0,
			baseValue: 0,
			careerValue: n.advances,
			characteristicKey: n.characteristicKey,
			characteristicName: n.characteristicName,
			current: n.advances,
			includedFromBase: !1,
			includedFromCareer: !1,
			includedFromCustom: !0,
			kind: n.kind,
			minimumCurrent: 0,
			minimumTotal: 0,
			name: n.name,
			sourceUuid: n.sourceUuid,
			sources: [r],
			talentMaximumFormula: n.talentMaximumFormula,
			talentMaximumKey: n.talentMaximumKey
		});
	}
}
function mc(e, t) {
	return e.kind === t.kind ? e.name.localeCompare(t.name) : e.kind.localeCompare(t.kind);
}
//#endregion
//#region src/functions/npc-builder/advancements/advancement-actions.ts
function hc(e) {
	return e.kind === "talent" ? 1 : 5;
}
function gc(e) {
	return Math.max(e.minimumTotal, e.baseValue + e.current);
}
function _c(e, t) {
	return gc(e) + t * hc(e);
}
function vc(e) {
	return gc(e);
}
function yc(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" && vc(e) < t;
}
function bc(e) {
	return e.filter((e) => e.kind === "talent" && yc(e)).map((e) => ({
		kind: e.kind,
		name: e.name,
		total: e.talentMaximumValue
	}));
}
function xc(e, t) {
	let n = new Map(e.map((e) => [Cc(e), e])), r = [];
	for (let e of t) {
		let t = n.get(Cc(e));
		!t || t.current === e.current || r.push({
			current: e.current,
			kind: t.kind,
			name: t.name
		});
	}
	return r;
}
function Sc(e, t) {
	return e.find((e) => e.kind === t.kind && e.name === t.name) ?? null;
}
function Cc(e) {
	return `${e.kind}:${e.name}`;
}
//#endregion
//#region src/functions/npc-builder/xp-cost.ts
var wc = {
	characteristic: [
		25,
		30,
		40,
		50,
		70,
		90,
		120,
		150,
		190,
		230,
		280,
		330,
		390,
		450,
		520
	],
	skill: [
		10,
		15,
		20,
		30,
		40,
		60,
		80,
		110,
		140,
		180,
		220,
		270,
		320,
		380,
		440
	]
};
function Tc(e) {
	let t = {
		characteristics: {},
		skills: [],
		talents: []
	}, n = {
		characteristics: {},
		skills: [],
		talents: []
	};
	for (let r of e) {
		let e = Fc(r), i = e + r.current;
		if (r.kind === "characteristic") {
			let a = Cs[Ms(r.name)];
			a && (t.characteristics[a] = e, n.characteristics[a] = i);
		} else r.kind === "skill" ? (t.skills.push({
			name: r.name,
			value: e
		}), n.skills.push({
			name: r.name,
			value: i
		})) : (t.talents.push({
			name: r.name,
			value: e
		}), n.talents.push({
			name: r.name,
			value: i
		}));
	}
	return Ec(n, t);
}
function Ec(e, t) {
	let n = Ac(e, t), r = jc(e.skills, t.skills, wc.skill), i = Mc(e.talents, t.talents);
	return {
		characteristics: n,
		skills: r,
		talents: i,
		total: n + r + i
	};
}
function Dc(e) {
	let t = Math.max(0, Math.floor(e.current));
	return e.kind === "talent" ? kc(t) : Oc(t, e.kind === "characteristic" ? wc.characteristic : wc.skill);
}
function Oc(e, t) {
	let n = Math.max(0, Math.floor(e)), r = 0;
	for (let e = 0; e < n; e += 1) {
		let n = Math.min(Math.floor(e / 5), t.length - 1);
		r += t[n] ?? 0;
	}
	return r;
}
function kc(e, t = 0) {
	let n = Math.max(0, Math.floor(e)), r = Math.max(0, Math.floor(t)), i = 0;
	for (let e = 0; e < n; e += 1) i += (r + e + 1) * 100;
	return i;
}
function Ac(e, t) {
	let n = 0;
	for (let r of Object.keys(Ss)) {
		let i = r, a = Pc(e.characteristics[i] ?? 0, t.characteristics[i] ?? 0);
		n += Oc(a, wc.characteristic);
	}
	return n;
}
function jc(e, t, n) {
	let r = Nc(e), i = Nc(t), a = 0;
	for (let [e, t] of r) {
		let r = Pc(t, i.get(e) ?? 0);
		a += Oc(r, n);
	}
	return a;
}
function Mc(e, t) {
	let n = Nc(e), r = Nc(t), i = 0;
	for (let [e, t] of n) {
		let n = Pc(t, r.get(e) ?? 0);
		i += kc(n);
	}
	return i;
}
function Nc(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = Ms(n.name), r = Math.floor(n.value);
		e && t.set(e, (t.get(e) ?? 0) + r);
	}
	return t;
}
function Pc(e, t) {
	return Math.max(0, Math.floor(e) - Math.floor(t));
}
function Fc(e) {
	return e.kind === "characteristic" ? Math.floor(e.baseValue) : e.kind === "skill" ? Math.floor(e.baseAdvances + (e.baseModifier ?? 0)) : Math.floor(e.baseAdvances);
}
//#endregion
//#region src/state/npc-builder/advancements/index.ts
function Ic(e) {
	let { baseActorDraftData: t, careers: n, customAdvancements: r, manualAdvancementDeltas: i, settings: a, skillCharacteristics: o, skillGrantResolutions: s, talentMaximums: c } = e, l = q(() => sc({
		baseActorDraftData: t.value,
		careers: n.value,
		customAdvancements: r.value,
		manualAdvancementDeltas: i.value,
		settings: a.value,
		skillCharacteristics: o.value,
		skillGrantResolutions: s.value,
		talentMaximums: c.value
	})), u = q(() => Tc(l.value)), d = q(() => bc(l.value).length);
	function f(e) {
		let t = Es(e.kind, e.name);
		r.value.some((e) => Es(e.kind, e.name) === t) || r.value.push(e);
	}
	function p(e) {
		let t = Es(e.kind, e.name);
		r.value = r.value.filter((e) => Es(e.kind, e.name) !== t), delete i.value[t];
	}
	function m(e, t) {
		x(e, _c(e, t));
	}
	function h() {
		for (let e of bc(l.value)) {
			let t = Sc(l.value, e);
			t && x(t, e.total);
		}
	}
	function g(e, t) {
		let n = Math.max(0, Math.floor(Number.isFinite(t) ? t : 0)), r = e.run({ advancements: l.value }, n), i = xc(l.value, r.advancements);
		for (let e of i) {
			let t = Sc(l.value, e);
			t && b(t, e.current);
		}
	}
	function _(e) {
		return s.value[e] ?? "";
	}
	function v(e) {
		o.value = uc(o.value, e);
	}
	function y(e) {
		c.value = dc(c.value, e);
	}
	function b(e, t) {
		let n = Es(e.kind, e.name);
		i.value[n] = cc(e, t);
	}
	function x(e, t) {
		let n = Es(e.kind, e.name);
		i.value[n] = lc(e, t);
	}
	function S(e) {
		let t = Es(e.kind, e.name);
		delete i.value[t];
	}
	function C() {
		i.value = {};
	}
	function w(e, t) {
		let n = t.trim();
		if (!n) {
			delete s.value[e];
			return;
		}
		s.value[e] = n;
	}
	function ee(e) {
		let t = `${e}:`;
		for (let e of Object.keys(s.value)) e.startsWith(t) && delete s.value[e];
	}
	return {
		addCustomAdvancement: f,
		adjustAdvancementCurrent: m,
		applyAutoAdvance: g,
		advancements: l,
		estimatedNpcXp: u,
		getSkillGrantResolution: _,
		hydrateSkillCharacteristics: v,
		hydrateTalentMaximums: y,
		maximizableTalentCount: d,
		maximizeTalents: h,
		removeCustomAdvancement: p,
		removeSkillGrantResolutionsForCareer: ee,
		resetAdvancementCurrent: S,
		resetAllAdvancementCurrents: C,
		setAdvancementCurrent: b,
		setAdvancementTotal: x,
		setSkillGrantResolution: w
	};
}
//#endregion
//#region src/functions/npc-builder/draft-summary.ts
function Lc(e, t) {
	return e.find((e) => e.uuid === t) ?? null;
}
function Rc(e) {
	return e.at(-1) ?? null;
}
function zc(e) {
	let t = e.finalCareer?.name, n = e.settings.includeSpeciesInName && e.selectedBaseActor?.species ? e.selectedBaseActor.species : "";
	return t && n ? `${n} ${t}` : t || (e.selectedBaseActor ? `${e.selectedBaseActor.name} NPC` : "New NPC");
}
function Bc(e, t) {
	return e.trim() || t;
}
function Vc(e) {
	return e.finalCareer?.img || e.selectedBaseActor?.prototypeTokenImg || e.selectedBaseActor?.img || "";
}
function Hc(e, t) {
	return e || t;
}
function Uc(e) {
	let t = {
		characteristics: 0,
		skills: 0,
		talents: 0,
		trappings: 0
	};
	for (let n of e) t.characteristics += n.grants.characteristics.length * n.quantity, t.skills += n.grants.skills.length * n.quantity, t.talents += n.grants.talents.length * n.quantity, t.trappings += n.grants.trappings.length * n.quantity;
	return t;
}
//#endregion
//#region src/state/npc-builder/draft.ts
function Wc(e) {
	let { actorName: t, baseActors: n, careers: r, clearBaseDraftData: i, clearMountSelection: a, customAdvancements: o, customSpells: s, customTraits: c, customTrappings: l, detectedSpells: u, ignoredBaseTraitKeys: d, magicLoreResolutions: f, removeSkillGrantResolutionsForCareer: p, selectedBaseActorUuid: m, selectedPortraitPath: h, settings: g, skillGrantResolutions: _, spellSelectionOverrides: v } = e, y = q(() => Lc(n.value, m.value)), b = q(() => Rc(r.value)), x = q(() => zc({
		finalCareer: b.value,
		selectedBaseActor: y.value,
		settings: g.value
	})), S = q(() => Bc(t.value, x.value)), C = q(() => Vc({
		finalCareer: b.value,
		selectedBaseActor: y.value
	})), w = q(() => Hc(h.value, C.value)), ee = q(() => Uc(r.value));
	function te(e) {
		let t = r.value.find((t) => t.uuid === e.uuid);
		if (t) {
			t.quantity = Ns(t.quantity + 1);
			return;
		}
		r.value.push({
			...e,
			quantity: 1
		});
	}
	function ne(e) {
		return r.value.some((t) => t.uuid === e.uuid) ? !1 : (r.value.push({
			...e,
			quantity: 1
		}), !0);
	}
	function re(e, t) {
		let n = e + t, i = r.value[e];
		!i || n < 0 || n >= r.value.length || (r.value.splice(e, 1), r.value.splice(n, 0, i));
	}
	function T(e, t) {
		let n = r.value[e];
		!n || e === t || t < 0 || t >= r.value.length || (r.value.splice(e, 1), r.value.splice(t, 0, n));
	}
	function E(e) {
		let [t] = r.value.splice(e, 1);
		t && p(t.uuid);
	}
	function ie() {
		for (let e of r.value) p(e.uuid);
		r.value = [];
	}
	function ae() {
		t.value = "", ie(), o.value = [], c.value = [], l.value = [], s.value = [], u.value = [], d.value = {}, f.value = {}, h.value = "", _.value = {}, v.value = {}, m.value = "", i(), a();
	}
	function D(e) {
		n.value.some((t) => t.uuid === e.uuid) || n.value.push(e), oe(e.uuid);
	}
	function oe(e) {
		let t = e.trim();
		m.value !== t && (h.value = ""), m.value = t;
	}
	function O(e) {
		h.value = e;
	}
	function se(e, t) {
		let n = r.value[e];
		n && (n.quantity = Ns(t));
	}
	return {
		addCareer: te,
		addCareerIfMissing: ne,
		clearCareers: ie,
		finalActorName: S,
		finalCareer: b,
		finalPortraitPath: w,
		grantTotals: ee,
		moveCareer: re,
		moveCareerToIndex: T,
		removeCareer: E,
		resetDraft: ae,
		selectBaseActor: D,
		selectBaseActorUuid: oe,
		selectedBaseActor: y,
		selectPortrait: O,
		setCareerQuantity: se,
		suggestedActorName: x
	};
}
//#endregion
//#region src/state/npc-builder/hydration.ts
function Gc(e) {
	let { actorFolders: t, baseActorDraftData: n, baseActors: r, ignoredBaseTraitKeys: i, itemFolders: a, manualAdvancementDeltas: o, quickTraits: s, selectedBaseActorUuid: c, settings: l, traitConfigOverrides: u, trappingOverrides: d, trappingResolutionOverrides: f } = e;
	function p() {
		n.value = {
			advancements: [],
			optionalTraits: [],
			traits: [],
			trappings: []
		}, o.value = {}, i.value = {}, u.value = {}, d.value = {}, f.value = {};
	}
	function m(e) {
		n.value = {
			advancements: [...e.advancements],
			optionalTraits: [...e.optionalTraits],
			traits: [...e.traits],
			trappings: [...e.trappings]
		}, o.value = {}, i.value = {}, u.value = {}, d.value = {};
	}
	function h(e) {
		r.value = [...e].sort((e, t) => e.name.localeCompare(t.name)), c.value && !r.value.some((e) => e.uuid === c.value) && (c.value = "", p());
	}
	function g(e) {
		l.value = { ...e };
	}
	function _(e) {
		t.value = [...e].sort((e, t) => e.name.localeCompare(t.name)), l.value.baseActorFolderUuid && !t.value.some((e) => e.uuid === l.value.baseActorFolderUuid) && (l.value.baseActorFolderUuid = ""), l.value.outputActorFolderUuid && !t.value.some((e) => e.uuid === l.value.outputActorFolderUuid) && (l.value.outputActorFolderUuid = "");
	}
	function v(e) {
		a.value = [...e].sort((e, t) => e.name.localeCompare(t.name)), l.value.quickTraitFolderUuid && !a.value.some((e) => e.uuid === l.value.quickTraitFolderUuid) && (l.value.quickTraitFolderUuid = "");
	}
	function y(e) {
		s.value = [...e].sort((e, t) => e.name.localeCompare(t.name));
	}
	return {
		clearBaseDraftData: p,
		hydrateActorFolders: _,
		hydrateBaseActorDraftData: m,
		hydrateBaseActors: h,
		hydrateItemFolders: v,
		hydrateQuickTraits: y,
		hydrateSettings: g
	};
}
//#endregion
//#region src/state/npc-builder/mount.ts
function Kc(e) {
	let { baseActorCombatProfile: t, mountActorProfile: n, mountActors: r, selectedMountActorUuid: i } = e;
	function a() {
		i.value = "", n.value = null;
	}
	function o(e) {
		t.value = e;
	}
	function s(e) {
		n.value = e;
	}
	function c(e) {
		r.value = [...e].sort((e, t) => e.name.localeCompare(t.name)), i.value && !r.value.some((e) => e.uuid === i.value) && a();
	}
	function l(e) {
		r.value.some((t) => t.uuid === e.uuid) || (r.value = [...r.value, e].sort((e, t) => e.name.localeCompare(t.name))), u(e.uuid);
	}
	function u(e) {
		i.value = e, n.value = null;
	}
	return {
		clearMountSelection: a,
		hydrateBaseActorCombatProfile: o,
		hydrateMountActorProfile: s,
		hydrateMountActors: c,
		selectMountActor: l,
		selectMountActorUuid: u
	};
}
//#endregion
//#region src/functions/portrait-gallery/source-filters.ts
function qc(e) {
	return e.sourceFilter ? e.sourceFilter : e.sourceGroup ? {
		label: Xc(e.sourceGroup),
		value: e.sourceGroup
	} : null;
}
function Jc(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = qc(n);
		e && !t.has(e.value) && t.set(e.value, e);
	}
	return [...t.values()];
}
function Yc(e) {
	return {
		label: `Priority Folder: ${e.split("/").filter(Boolean).slice(-2).join("/") || e}`,
		value: `priority-folder:${e.toLocaleLowerCase()}`
	};
}
function Xc(e) {
	return {
		career: "Career",
		compendiums: "Compendiums",
		"dig-down": "Dig Down",
		"priority-folders": "Priority Folders",
		world: "World"
	}[e];
}
//#endregion
//#region src/functions/portrait-gallery/candidate-collection.ts
function Zc(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = tl(r.img);
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
function Qc(e) {
	let t = Zc($c([...e.assetCandidates, ...e.immediateCandidates]));
	return !e.selectedPortraitPath || t.some((t) => tl(t.img) === tl(e.selectedPortraitPath)) ? t : [{
		img: e.selectedPortraitPath,
		key: `selected:${e.selectedPortraitPath}`,
		label: "Selected portrait",
		source: "foundry-asset",
		sourceLabel: "Selected"
	}, ...t];
}
function $c(e) {
	return e.map((e, t) => ({
		candidate: e,
		index: t
	})).sort((e, t) => el(e.candidate) - el(t.candidate) || e.index - t.index).map(({ candidate: e }) => e);
}
function el(e) {
	return e.sourceFilter?.value.startsWith("priority-folder:") ? 0 : e.sourceGroup ? {
		career: 1,
		compendiums: 2,
		world: 3,
		"dig-down": 4
	}[e.sourceGroup] ?? 5 : 5;
}
function tl(e) {
	return e.trim().toLocaleLowerCase();
}
//#endregion
//#region src/functions/portrait-gallery/index.ts
var nl = new Set([
	"and",
	"any",
	"the",
	"with",
	"without",
	"of",
	"or",
	"npc"
]), rl = "portrait-gallery-filter:", il = "modules/wfrp4e-core/art/careers", al = [
	"modules/wfrp4e-core/art/bestiary",
	"modules/wfrp4e-core/tokens",
	"modules/wfrp4e-core/tokens/popout"
], ol = ["systems/wfrp4e/tokens/unknown.png"], sl = "application/x-wfrp4e-customizer-portrait-filter-tag";
function cl(e) {
	return El(Tl(e).filter((e) => e.length >= 3 && !nl.has(e)));
}
function ll(e) {
	return El(e.flatMap(cl));
}
function ul(e) {
	if (!Array.isArray(e)) return [];
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		if (typeof r != "string") continue;
		let e = r.trim().replaceAll("\\", "/").replace(/^\/+|\/+$/gu, ""), i = e.toLocaleLowerCase();
		e && !t.has(i) && (t.add(i), n.push(e));
	}
	return n;
}
function dl(e) {
	return ul([
		...e.hasCareer ? [il] : [],
		...al,
		...e.configuredFolders
	]);
}
function fl(e, t, n) {
	return e.filter((e) => (t[e] ?? "search") === n);
}
function pl(e, t) {
	let n = wl(e);
	return !!(n && t.some((e) => n.includes(e)));
}
function ml(e, t) {
	let n = Cl(e), r = qc(e), i = t.mustIncludeSources.length === 0 || r !== null && t.mustIncludeSources.includes(r.value), a = r !== null && t.mustExcludeSources.includes(r.value);
	return t.mustIncludeTerms.every((e) => n.includes(e)) && t.mustExcludeTerms.every((e) => !n.includes(e)) && i && !a;
}
function hl(e) {
	return `${rl}${e}`;
}
function gl(e) {
	return e.startsWith(rl) ? e.slice(24) : null;
}
function _l(e) {
	return e.hasEnabledSource && e.hasSubject && e.searchTerms.length > 0;
}
function vl(e) {
	return e ? e.maxDirectories <= 0 ? e.phase === "ready" ? 100 : 4 : Math.min(100, Math.round(e.directoriesVisited / e.maxDirectories * 100)) : 0;
}
function yl(e) {
	return e ? e.phase === "ready" ? `${e.candidatesFound} options found` : e.phase === "filesystem" ? e.maxDirectories <= 0 ? `${e.directoriesVisited} directories - ${e.currentLocation}` : `${e.directoriesVisited}/${e.maxDirectories} directories - ${e.currentLocation}` : e.currentLocation : "";
}
function bl(e) {
	return `${e.label}\n${e.img}`;
}
function xl(e) {
	return `Use ${e.label} (${Sl(e)})`;
}
function Sl(e) {
	return e.sourceLabel ?? {
		"base-actor": "Actor Portrait",
		"base-token": "Prototype Token",
		career: "Career",
		"foundry-asset": "Foundry",
		web: "Web"
	}[e.source];
}
function Cl(e) {
	return wl([
		e.label,
		e.img,
		e.sourceLabel ?? ""
	].filter(Boolean).join(" "));
}
function wl(e) {
	return e.trim().toLocaleLowerCase().replaceAll(/[_-]/g, " ").replaceAll(/[(),.:;[\]]/g, " ").replaceAll(/\s+/g, " ");
}
function Tl(e) {
	return wl(e).split(" ").filter(Boolean);
}
function El(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/state/portrait-gallery/filters.ts
function Dl() {
	let e = /* @__PURE__ */ P([]), t = /* @__PURE__ */ P({}), n = /* @__PURE__ */ P({});
	function r(t) {
		let r = new Set(e.value), i = cl(t).filter((e) => !r.has(e));
		i.length && (e.value = [...e.value, ...i]);
		for (let e of i) n.value[e] = "search";
	}
	function i() {
		e.value = [], t.value = {}, n.value = {};
	}
	function a(e, n) {
		n !== "removed" && (t.value[e] = n);
	}
	function o(t, r) {
		if (r === "removed" && e.value.includes(t)) {
			e.value = e.value.filter((e) => e !== t), delete n.value[t];
			return;
		}
		n.value[t] = r;
	}
	function s(t) {
		let r = new Set([...t, ...e.value]);
		for (let e of Object.keys(n.value)) r.has(e) || delete n.value[e];
	}
	return {
		addCustomPortraitSearchTerm: r,
		customPortraitSearchTerms: e,
		portraitSourceTagSections: t,
		portraitTermSections: n,
		resetPortraitFilters: i,
		retainAvailablePortraitFilterTerms: s,
		setPortraitSourceTagSection: a,
		setPortraitTermSection: o
	};
}
//#endregion
//#region src/state/npc-builder/portraits.ts
function Ol() {
	return Dl();
}
//#endregion
//#region src/functions/npc-builder/default-npc-builder-settings.ts
function kl() {
	return {
		allowBaseActorCharacteristics: !1,
		allowBaseActorSkills: !1,
		allowBaseActorTalents: !1,
		allowBaseActorTraits: !0,
		allowBaseActorTrappings: !0,
		askForLinkedSkillSpecializations: !1,
		autoSelectGrantedSpells: !0,
		baseActorFolderUuid: "",
		excludeFullyTransparentPortraitAssets: !0,
		excludedPortraitReferenceImages: [...ol],
		includeSpeciesInName: !1,
		lowerCareerMode: "prompt",
		outputActorFolderUuid: "",
		prioritizedPortraitFolders: [],
		quickTraitFolderUuid: "",
		searchCompendiumPortraitAssets: !0,
		searchFoundryPortraitAssets: !1,
		searchWebPortraitAssets: !1
	};
}
//#endregion
//#region src/state/npc-builder/settings.ts
var Al = kl(), jl = {
	advancements: [],
	optionalTraits: [],
	traits: [],
	trappings: []
}, Ml = /\(([^)]+)\)/, Nl = [
	"beasts",
	"death",
	"fire",
	"heavens",
	"metal",
	"life",
	"light",
	"shadow"
], Pl = [
	"daemonology",
	"necromancy",
	"nurgle",
	"slaanesh",
	"tzeentch",
	"undivided"
];
function Fl(e, t) {
	let n = e.trim(), r = n.toLocaleLowerCase();
	return r === "petty magic" ? Hl({
		kind: "petty-magic",
		rawLore: "Petty Magic",
		source: t,
		sourceName: n
	}) : r.startsWith("arcane magic") ? Hl({
		kind: "arcane-magic",
		rawLore: Ul(n),
		source: t,
		sourceName: n
	}) : r.startsWith("spellcaster") ? Hl({
		kind: "spellcaster",
		rawLore: Ul(n),
		source: t,
		sourceName: n
	}) : null;
}
function Il(e) {
	return e.trim().replace(/^any\s+/i, "").replace(/^arcane\s+lore\s+of\s+/i, "").replace(/^arcane\s+lore$/i, "").replace(/^lore\s+of\s+/i, "").replaceAll(/\s+/g, " ").toLocaleLowerCase();
}
function Ll(e) {
	return `${e.source}:${e.kind}:${e.sourceName}:${e.rawLore}`;
}
function Rl(e, t) {
	return {
		...e,
		isAmbiguous: !1,
		normalizedLore: Il(t),
		rawLore: t.trim()
	};
}
function zl(e) {
	let t = Il(e);
	return t === "petty" ? "petty" : Nl.includes(t) ? "eight-wind" : Pl.includes(t) ? "dark" : "other";
}
function Bl(e, t) {
	if (e.kind === "petty-magic") return t.filter((e) => e.category === "petty");
	let n = e.rawLore.trim().toLocaleLowerCase();
	return n.includes("dark") ? t.filter((e) => e.category === "dark") : n.includes("eight winds") ? t.filter((e) => e.category === "eight-wind") : t.filter((e) => e.category !== "petty");
}
function Vl(e) {
	let t = e.trim().toLocaleLowerCase();
	return !t || t === "any" || t.includes("any ");
}
function Hl(e) {
	let t = e.rawLore.trim();
	return {
		isAmbiguous: Vl(t),
		kind: e.kind,
		normalizedLore: Il(t),
		rawLore: t,
		resolutionKey: Ll({
			kind: e.kind,
			rawLore: t,
			source: e.source,
			sourceName: e.sourceName
		}),
		source: e.source,
		sourceName: e.sourceName
	};
}
function Ul(e) {
	return Ml.exec(e)?.[1]?.trim() ?? "";
}
//#endregion
//#region src/functions/npc-builder/spells/derive-magic-grants.ts
function Wl(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.advancements) n.kind !== "talent" || n.baseAdvances + n.current <= 0 || Gl(t, Fl(n.name, "talent"), e);
	for (let n of e.traits) Gl(t, Fl(n.name, "trait"), e);
	return [...t.values()];
}
function Gl(e, t, n) {
	if (!t) return;
	let r = n.loreResolutions[t.resolutionKey];
	e.set(t.resolutionKey, r ? Rl(t, r) : t);
}
//#endregion
//#region src/functions/npc-builder/spells/derive-spells.ts
function Kl(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.detectedSpells) t.set(n.key, {
		...n,
		selected: e.selectionOverrides[n.key] ?? e.autoSelectDetectedSpells
	});
	for (let n of e.customSpells) t.set(n.key, {
		...n,
		selected: e.selectionOverrides[n.key] ?? n.selected
	});
	return [...t.values()].sort(Zl);
}
function ql(e) {
	return e.filter((e) => e.selected);
}
function Jl(e) {
	return e.spells.map((t) => ({
		...t,
		selected: e.selectionOverrides[t.key] ?? e.autoSelectDetectedSpells
	}));
}
function Yl(e) {
	let t = e.detectedSpells.find((t) => Xl(t, e.spell));
	return t ? {
		customSpells: e.customSpells,
		selectedDetectedSpellKey: t.key
	} : e.customSpells.some((t) => t.key === e.spell.key) ? {
		customSpells: e.customSpells,
		selectedDetectedSpellKey: ""
	} : {
		customSpells: [...e.customSpells, {
			...e.spell,
			selected: !0
		}],
		selectedDetectedSpellKey: ""
	};
}
function Xl(e, t) {
	return e.sourceUuid && e.sourceUuid === t.sourceUuid ? !0 : js(e.name, t.name);
}
function Zl(e, t) {
	return e.loreName === t.loreName ? e.name.localeCompare(t.name) : e.loreName.localeCompare(t.loreName);
}
//#endregion
//#region src/state/npc-builder/spells.ts
function Ql(e) {
	let { advancements: t, customSpells: n, detectedSpells: r, magicLoreResolutions: i, settings: a, spellSelectionOverrides: o, traits: s } = e, c = q(() => Wl({
		advancements: t.value,
		loreResolutions: i.value,
		traits: s.value
	})), l = q(() => c.value.length > 0), u = q(() => Kl({
		autoSelectDetectedSpells: a.value.autoSelectGrantedSpells,
		customSpells: n.value,
		detectedSpells: r.value,
		selectionOverrides: o.value
	})), d = q(() => ql(u.value));
	function f(e) {
		let t = Yl({
			customSpells: n.value,
			detectedSpells: r.value,
			spell: e
		});
		if (t.selectedDetectedSpellKey) {
			o.value[t.selectedDetectedSpellKey] = !0;
			return;
		}
		n.value = t.customSpells;
	}
	function p(e) {
		r.value = Jl({
			autoSelectDetectedSpells: a.value.autoSelectGrantedSpells,
			selectionOverrides: o.value,
			spells: e
		});
	}
	function m(e) {
		n.value = n.value.filter((t) => t.key !== e), delete o.value[e];
	}
	function h(e, t) {
		o.value[e] = t;
	}
	function g(e, t) {
		let n = t.trim();
		if (!n) {
			delete i.value[e];
			return;
		}
		i.value[e] = n;
	}
	return {
		addCustomSpell: f,
		hasMagicAccess: l,
		hydrateDetectedSpells: p,
		magicGrants: c,
		removeCustomSpell: m,
		selectedSpells: d,
		setMagicGrantLoreResolution: g,
		setSpellSelected: h,
		spells: u
	};
}
//#endregion
//#region src/functions/npc-builder/traits/derive-traits.ts
function $l(e) {
	let t = /* @__PURE__ */ new Map();
	if (e.allowBaseActorTraits) for (let n of e.baseActorDraftData.traits) {
		let r = ru(n);
		e.ignoredBaseTraitKeys[r] || t.set(r, ou(n, r, !1));
	}
	for (let n of e.customTraits) au([...t.values()], n.name) || t.set(n.key, { ...n });
	return [...t.values()].map((t) => ({
		...t,
		config: As(t.config, e.traitConfigOverrides[t.key])
	})).sort(su);
}
function eu(e) {
	return e.allowBaseActorTraits ? [...e.baseActorDraftData.traits.filter((t) => e.ignoredBaseTraitKeys[ru(t)]).map((t) => {
		let n = ru(t);
		return {
			...ou(t, n, !0),
			config: As(t.config, e.traitConfigOverrides[n])
		};
	}), ...e.selectedTraits] : e.selectedTraits;
}
function tu(e) {
	return e.optionalTraits.map((e) => ({
		config: e.config,
		img: e.img,
		name: e.name,
		uuid: e.uuid
	})).sort((e, t) => e.name.localeCompare(t.name));
}
function nu(e, t) {
	return {
		config: t.config,
		ignored: !1,
		key: `${e}:${t.uuid || Ms(t.name)}`,
		name: t.name,
		source: e,
		sourceUuid: t.uuid
	};
}
function ru(e) {
	return `base:${e.uuid || Ms(e.name)}`;
}
function iu(e, t) {
	return e.find((e) => js(e.name, t));
}
function au(e, t) {
	return iu(e, t) !== void 0;
}
function ou(e, t, n) {
	return {
		config: e.config,
		ignored: n,
		key: t,
		name: e.name,
		source: "base",
		sourceUuid: e.uuid
	};
}
function su(e, t) {
	return e.source === t.source ? e.name.localeCompare(t.name) : e.source.localeCompare(t.source);
}
//#endregion
//#region src/state/npc-builder/traits.ts
function cu(e) {
	let { baseActorDraftData: t, customTraits: n, ignoredBaseTraitKeys: r, quickTraits: i, settings: a, traitConfigOverrides: o } = e, s = q(() => $l({
		allowBaseActorTraits: a.value.allowBaseActorTraits,
		baseActorDraftData: t.value,
		customTraits: n.value,
		ignoredBaseTraitKeys: r.value,
		traitConfigOverrides: o.value
	})), c = q(() => eu({
		allowBaseActorTraits: a.value.allowBaseActorTraits,
		baseActorDraftData: t.value,
		ignoredBaseTraitKeys: r.value,
		selectedTraits: s.value,
		traitConfigOverrides: o.value
	})), l = q(() => tu(t.value));
	function u(e) {
		let t = y(e.name), n = v(e.name);
		if (n) {
			p(n, !0);
			return;
		}
		if (t) {
			f(t, !0);
			return;
		}
		h(e);
	}
	function d(e) {
		n.value = n.value.filter((t) => t.key !== e), delete o.value[e];
	}
	function f(e, t) {
		m("quick", e, t);
	}
	function p(e, t) {
		m("optional", e, t);
	}
	function m(e, t, r) {
		let i = nu(e, t);
		if (!r) {
			d(i.key), x(t.name, !0);
			return;
		}
		x(t.name, !1) || n.value.find((e) => e.key === i.key) || h(i);
	}
	function h(e) {
		au(s.value, e.name) || n.value.some((t) => t.key === e.key) || n.value.push(e);
	}
	function g(e, t) {
		o.value[e] = {
			...o.value[e],
			...t
		};
	}
	function _(e, t) {
		if (e.startsWith("base:")) {
			if (!t) {
				delete r.value[e];
				return;
			}
			r.value[e] = !0;
		}
	}
	function v(e) {
		return iu(l.value, e);
	}
	function y(e) {
		return iu(i.value, e);
	}
	function b(e) {
		let n = iu(t.value.traits, e);
		if (!n) return null;
		let i = ru(n);
		return {
			ignored: !!r.value[i],
			key: i
		};
	}
	function x(e, t) {
		let n = b(e);
		return n ? (_(n.key, t), !0) : !1;
	}
	return {
		addCustomTrait: u,
		buildTraits: c,
		optionalTraits: l,
		removeCustomTrait: d,
		setBaseTraitIgnored: _,
		setOptionalTraitSelected: p,
		setQuickTraitSelected: f,
		setTraitConfig: g,
		traits: s
	};
}
//#endregion
//#region src/functions/npc-builder/trapping-resolution.ts
function lu(e, t = "trapping") {
	return {
		candidates: [],
		searchTerms: pu(e),
		selectedCandidateUuid: "",
		selectedItemType: t,
		selectedName: e.trim(),
		status: "fallback"
	};
}
function uu(e) {
	return {
		candidates: [{
			itemType: e.itemType,
			matchKind: "exact",
			name: e.name,
			searchTerm: e.name,
			sourceLabel: "Dropped item",
			uuid: e.uuid
		}],
		searchTerms: [e.name],
		selectedCandidateUuid: e.uuid,
		selectedItemType: e.itemType,
		selectedName: e.name,
		status: "matched"
	};
}
function du(e) {
	return {
		candidates: [],
		searchTerms: pu(e),
		selectedCandidateUuid: "",
		selectedItemType: "trapping",
		selectedName: e.trim(),
		status: "unresolved"
	};
}
function fu(e, t) {
	let n = pu(e), r = hu(n, t), i = r.filter((e) => e.matchKind === "exact");
	return i.length === 1 ? _u("matched", n, i[0]) : i.length > 1 ? _u("ambiguous", n, i[0], { candidates: r }) : r.length ? {
		candidates: r,
		searchTerms: n,
		selectedCandidateUuid: "",
		selectedItemType: "trapping",
		selectedName: e.trim(),
		status: "ambiguous"
	} : lu(e);
}
function pu(e) {
	let t = e.split(/\s+or\s+/i).map((e) => e.trim()).filter(Boolean);
	return t.length ? xu(t) : [e.trim()].filter(Boolean);
}
function mu(e, t) {
	if (vu(e) === vu(t)) return "exact";
	let n = yu(e), r = yu(t);
	if (!n || !r) return null;
	if (n === r || n.includes(r) || r.includes(n)) return "near";
	let i = n.split(" "), a = new Set(r.split(" "));
	return i.every((e) => a.has(e)) ? "near" : null;
}
function hu(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) for (let e of t) {
		let t = mu(r, e.name);
		t && n.get(e.uuid)?.matchKind !== "exact" && n.set(e.uuid, {
			itemType: e.itemType,
			matchKind: t,
			name: e.name,
			searchTerm: r,
			sourceLabel: e.sourceLabel,
			uuid: e.uuid
		});
	}
	return [...n.values()].sort(gu);
}
function gu(e, t) {
	return e.matchKind === t.matchKind ? e.name.localeCompare(t.name) : e.matchKind === "exact" ? -1 : 1;
}
function _u(e, t, n, r = {}) {
	return {
		candidates: r.candidates ?? (n ? [n] : []),
		searchTerms: t,
		selectedCandidateUuid: n?.uuid ?? "",
		selectedItemType: n?.itemType ?? "trapping",
		selectedName: n?.name ?? "",
		status: e
	};
}
function vu(e) {
	return e.trim().toLocaleLowerCase().replaceAll(/\s+/g, " ");
}
function yu(e) {
	return vu(e).replaceAll("&", " and ").replaceAll(/[(),.:;[\]]/g, " ").replaceAll(/\b(a|an|the|some|pair of|pairs of)\b/g, " ").split(/\s+/).map(bu).filter(Boolean).join(" ");
}
function bu(e) {
	return e.endsWith("ies") && e.length > 4 ? `${e.slice(0, -3)}y` : e.endsWith("s") && !e.endsWith("ss") && e.length > 3 ? e.slice(0, -1) : e;
}
function xu(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/functions/npc-builder/trappings/derive-trappings.ts
function Su(e) {
	let t = /* @__PURE__ */ new Map();
	Tu(t, e), Eu(t, e);
	for (let n of e.customTrappings) t.set(n.key, { ...n });
	return [...t.values()].map((t) => Du(t, e)).sort(Ou);
}
function Cu(e, t) {
	let n = e.resolution.candidates.find((e) => e.uuid === t);
	return n ? {
		...e.resolution,
		selectedCandidateUuid: n.uuid,
		selectedItemType: n.itemType,
		selectedName: n.name,
		status: e.resolution.status === "matched" ? "matched" : "ambiguous"
	} : null;
}
function wu(e) {
	return {
		...lu(e.name, e.itemType),
		candidates: e.resolution.candidates,
		searchTerms: e.resolution.searchTerms
	};
}
function Tu(e, t) {
	if (t.settings.allowBaseActorTrappings) for (let n of t.baseActorDraftData.trappings) {
		let t = `base:${n.uuid || Ms(n.name)}`;
		e.set(t, {
			ignored: !1,
			itemType: n.itemType,
			key: t,
			name: n.name,
			quantity: n.quantity,
			resolution: uu({
				itemType: n.itemType,
				name: n.name,
				uuid: n.uuid
			}),
			source: "base",
			sourceUuid: n.uuid
		});
	}
}
function Eu(e, t) {
	for (let n of t.careers) for (let r of n.grants.trappings) {
		let i = `career:${Ms(r)}`, a = e.get(i);
		if (a) {
			a.quantity += n.quantity;
			continue;
		}
		e.set(i, {
			ignored: !1,
			itemType: "trapping",
			key: i,
			name: r,
			quantity: n.quantity,
			resolution: t.trappingResolutionOverrides[i] ?? du(r),
			source: "career",
			sourceUuid: ""
		});
	}
}
function Du(e, t) {
	let n = t.trappingOverrides[e.key];
	return {
		...e,
		ignored: n?.ignored ?? e.ignored,
		quantity: Ns(n?.quantity ?? e.quantity),
		resolution: t.trappingResolutionOverrides[e.key] ?? e.resolution
	};
}
function Ou(e, t) {
	return e.source === t.source ? e.name.localeCompare(t.name) : e.source.localeCompare(t.source);
}
//#endregion
//#region src/state/npc-builder/trappings.ts
function ku(e) {
	let { baseActorDraftData: t, careers: n, customTrappings: r, settings: i, trappingOverrides: a, trappingResolutionOverrides: o } = e, s = q(() => Su({
		baseActorDraftData: t.value,
		careers: n.value,
		customTrappings: r.value,
		settings: i.value,
		trappingOverrides: a.value,
		trappingResolutionOverrides: o.value
	}));
	function c(e) {
		r.value.some((t) => t.key === e.key) || r.value.push(e);
	}
	function l(e) {
		r.value = r.value.filter((t) => t.key !== e), delete a.value[e], delete o.value[e];
	}
	function u(e, t) {
		a.value[e] = {
			...a.value[e],
			ignored: t
		};
	}
	function d(e, t) {
		a.value[e] = {
			...a.value[e],
			quantity: Ns(t)
		};
	}
	function f(e, t) {
		let n = s.value.find((t) => t.key === e), r = n ? Cu(n, t) : null;
		r && (o.value[e] = r);
	}
	function p(e) {
		let t = s.value.find((t) => t.key === e);
		t && (o.value[e] = wu(t));
	}
	function m(e, t) {
		o.value[e] = t;
	}
	return {
		addCustomTrapping: c,
		removeCustomTrapping: l,
		selectTrappingResolutionCandidate: f,
		setTrappingFallback: p,
		setTrappingIgnored: u,
		setTrappingQuantity: d,
		setTrappingResolution: m,
		trappings: s
	};
}
//#endregion
//#region src/state/npc-builder/index.ts
var Au = bs("npc-builder", () => {
	let e = /* @__PURE__ */ P(""), t = /* @__PURE__ */ P([]), n = /* @__PURE__ */ P({}), r = /* @__PURE__ */ P(null), i = /* @__PURE__ */ P({ ...jl }), a = /* @__PURE__ */ P([]), o = /* @__PURE__ */ P([]), s = /* @__PURE__ */ P([]), c = /* @__PURE__ */ P([]), l = /* @__PURE__ */ P([]), u = /* @__PURE__ */ P(null), d = /* @__PURE__ */ P([]), f = /* @__PURE__ */ P([]), p = /* @__PURE__ */ P(""), m = /* @__PURE__ */ P({ ...Al }), h = /* @__PURE__ */ P(""), g = /* @__PURE__ */ P(""), _ = /* @__PURE__ */ P({}), v = /* @__PURE__ */ P({}), y = /* @__PURE__ */ P({}), b = /* @__PURE__ */ P([]), x = /* @__PURE__ */ P([]), S = /* @__PURE__ */ P([]), C = /* @__PURE__ */ P({}), w = /* @__PURE__ */ P({}), ee = /* @__PURE__ */ P({}), te = /* @__PURE__ */ P({}), ne = /* @__PURE__ */ P({}), re = /* @__PURE__ */ P({}), T = Ic({
		baseActorDraftData: i,
		careers: o,
		customAdvancements: S,
		manualAdvancementDeltas: n,
		settings: m,
		skillCharacteristics: _,
		skillGrantResolutions: y,
		talentMaximums: v
	}), E = Ol(), ie = Gc({
		actorFolders: t,
		baseActorDraftData: i,
		baseActors: a,
		ignoredBaseTraitKeys: C,
		itemFolders: l,
		manualAdvancementDeltas: n,
		quickTraits: f,
		selectedBaseActorUuid: h,
		settings: m,
		traitConfigOverrides: te,
		trappingOverrides: ne,
		trappingResolutionOverrides: re
	}), ae = Kc({
		baseActorCombatProfile: r,
		mountActorProfile: u,
		mountActors: d,
		selectedMountActorUuid: g
	}), D = Wc({
		actorName: e,
		baseActors: a,
		careers: o,
		clearBaseDraftData: ie.clearBaseDraftData,
		clearMountSelection: ae.clearMountSelection,
		customAdvancements: S,
		customSpells: x,
		customTraits: s,
		customTrappings: c,
		detectedSpells: b,
		ignoredBaseTraitKeys: C,
		magicLoreResolutions: w,
		removeSkillGrantResolutionsForCareer: T.removeSkillGrantResolutionsForCareer,
		selectedBaseActorUuid: h,
		selectedPortraitPath: p,
		settings: m,
		skillGrantResolutions: y,
		spellSelectionOverrides: ee
	}), oe = cu({
		baseActorDraftData: i,
		customTraits: s,
		ignoredBaseTraitKeys: C,
		quickTraits: f,
		settings: m,
		traitConfigOverrides: te
	}), O = ku({
		baseActorDraftData: i,
		careers: o,
		customTrappings: c,
		settings: m,
		trappingOverrides: ne,
		trappingResolutionOverrides: re
	}), se = Ql({
		advancements: T.advancements,
		customSpells: x,
		detectedSpells: b,
		magicLoreResolutions: w,
		settings: m,
		spellSelectionOverrides: ee,
		traits: oe.traits
	});
	function ce() {
		D.resetDraft(), E.resetPortraitFilters();
	}
	return {
		actorName: e,
		actorFolders: t,
		addCareer: D.addCareer,
		addCareerIfMissing: D.addCareerIfMissing,
		addCustomAdvancement: T.addCustomAdvancement,
		addCustomPortraitSearchTerm: E.addCustomPortraitSearchTerm,
		addCustomSpell: se.addCustomSpell,
		addCustomTrait: oe.addCustomTrait,
		addCustomTrapping: O.addCustomTrapping,
		adjustAdvancementCurrent: T.adjustAdvancementCurrent,
		advancements: T.advancements,
		applyAutoAdvance: T.applyAutoAdvance,
		baseActorCombatProfile: r,
		baseActorDraftData: i,
		baseActors: a,
		buildTraits: oe.buildTraits,
		careers: o,
		clearCareers: D.clearCareers,
		clearBaseDraftData: ie.clearBaseDraftData,
		clearMountSelection: ae.clearMountSelection,
		customSpells: x,
		customAdvancements: S,
		customPortraitSearchTerms: E.customPortraitSearchTerms,
		customTraits: s,
		customTrappings: c,
		estimatedNpcXp: T.estimatedNpcXp,
		finalActorName: D.finalActorName,
		finalCareer: D.finalCareer,
		finalPortraitPath: D.finalPortraitPath,
		getSkillGrantResolution: T.getSkillGrantResolution,
		grantTotals: D.grantTotals,
		hasMagicAccess: se.hasMagicAccess,
		hydrateActorFolders: ie.hydrateActorFolders,
		hydrateBaseActorCombatProfile: ae.hydrateBaseActorCombatProfile,
		hydrateBaseActorDraftData: ie.hydrateBaseActorDraftData,
		hydrateBaseActors: ie.hydrateBaseActors,
		hydrateDetectedSpells: se.hydrateDetectedSpells,
		hydrateItemFolders: ie.hydrateItemFolders,
		hydrateMountActorProfile: ae.hydrateMountActorProfile,
		hydrateMountActors: ae.hydrateMountActors,
		hydrateQuickTraits: ie.hydrateQuickTraits,
		hydrateSettings: ie.hydrateSettings,
		hydrateSkillCharacteristics: T.hydrateSkillCharacteristics,
		hydrateTalentMaximums: T.hydrateTalentMaximums,
		itemFolders: l,
		magicGrants: se.magicGrants,
		magicLoreResolutions: w,
		mountActorProfile: u,
		mountActors: d,
		maximizableTalentCount: T.maximizableTalentCount,
		maximizeTalents: T.maximizeTalents,
		moveCareer: D.moveCareer,
		moveCareerToIndex: D.moveCareerToIndex,
		optionalTraits: oe.optionalTraits,
		quickTraits: f,
		removeCareer: D.removeCareer,
		removeCustomAdvancement: T.removeCustomAdvancement,
		removeCustomSpell: se.removeCustomSpell,
		removeCustomTrait: oe.removeCustomTrait,
		removeCustomTrapping: O.removeCustomTrapping,
		resetAdvancementCurrent: T.resetAdvancementCurrent,
		resetAllAdvancementCurrents: T.resetAllAdvancementCurrents,
		portraitSourceTagSections: E.portraitSourceTagSections,
		portraitTermSections: E.portraitTermSections,
		resetDraft: ce,
		retainAvailablePortraitFilterTerms: E.retainAvailablePortraitFilterTerms,
		selectBaseActor: D.selectBaseActor,
		selectBaseActorUuid: D.selectBaseActorUuid,
		selectMountActor: ae.selectMountActor,
		selectMountActorUuid: ae.selectMountActorUuid,
		selectedBaseActor: D.selectedBaseActor,
		selectedBaseActorUuid: h,
		selectedMountActorUuid: g,
		selectedPortraitPath: p,
		selectedSpells: se.selectedSpells,
		selectPortrait: D.selectPortrait,
		selectTrappingResolutionCandidate: O.selectTrappingResolutionCandidate,
		setAdvancementCurrent: T.setAdvancementCurrent,
		setAdvancementTotal: T.setAdvancementTotal,
		setBaseTraitIgnored: oe.setBaseTraitIgnored,
		setCareerQuantity: D.setCareerQuantity,
		setMagicGrantLoreResolution: se.setMagicGrantLoreResolution,
		setOptionalTraitSelected: oe.setOptionalTraitSelected,
		setPortraitSourceTagSection: E.setPortraitSourceTagSection,
		setPortraitTermSection: E.setPortraitTermSection,
		setQuickTraitSelected: oe.setQuickTraitSelected,
		setSkillGrantResolution: T.setSkillGrantResolution,
		setSpellSelected: se.setSpellSelected,
		setTraitConfig: oe.setTraitConfig,
		setTrappingFallback: O.setTrappingFallback,
		setTrappingIgnored: O.setTrappingIgnored,
		setTrappingQuantity: O.setTrappingQuantity,
		setTrappingResolution: O.setTrappingResolution,
		settings: m,
		spells: se.spells,
		suggestedActorName: D.suggestedActorName,
		traits: oe.traits,
		trappings: O.trappings
	};
}), ju = { class: "dui-fieldset-legend" }, Mu = [
	"checked",
	"disabled",
	"onChange"
], Nu = { class: "dui-card-actions" }, Pu = /* @__PURE__ */ L({
	__name: "LowerCareerPromptContent",
	props: {
		candidateGroups: {},
		isCareerQueued: { type: Function },
		isLowerCareerSelected: { type: Function },
		prompt: {}
	},
	emits: [
		"addDroppedOnly",
		"addSelected",
		"lowerCareerSelected"
	],
	setup(e, { emit: t }) {
		let n = t;
		function r(e, t) {
			let r = t.currentTarget;
			n("lowerCareerSelected", e, r.checked);
		}
		return (t, i) => (B(), V("section", null, [
			U("p", null, A(e.prompt.droppedCareer.name) + " appears to belong to the " + A(e.prompt.droppedCareer.careerGroup) + " career track. The following lower-tier candidates were found. ", 1),
			(B(!0), V(z, null, R(e.candidateGroups, (t) => (B(), V("fieldset", {
				key: t.level,
				class: "dui-fieldset"
			}, [U("legend", ju, "Tier " + A(t.level || "Unknown"), 1), (B(!0), V(z, null, R(t.candidates, (t) => (B(), V("label", {
				key: t.uuid,
				class: "dui-label"
			}, [U("input", {
				class: "dui-checkbox dui-checkbox-sm",
				checked: e.isCareerQueued(t.uuid) || e.isLowerCareerSelected(t.uuid),
				disabled: e.isCareerQueued(t.uuid),
				type: "checkbox",
				onChange: (e) => r(t, e)
			}, null, 40, Mu), U("span", null, [U("strong", null, A(t.name), 1), U("small", null, [G(A(t.careerGroup || "Career") + " ", 1), e.isCareerQueued(t.uuid) ? (B(), V(z, { key: 0 }, [G(" already queued ")], 64)) : K("", !0)])])]))), 128))]))), 128)),
			U("div", Nu, [U("button", {
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: i[0] ||= (e) => n("addDroppedOnly")
			}, " Add Dropped Only "), U("button", {
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: i[1] ||= (e) => n("addSelected")
			}, " Add Selected ")])
		]));
	}
}), Fu = ["aria-labelledby"], Iu = ["id"], Lu = { class: "dui-modal-action" }, Ru = /* @__PURE__ */ L({
	__name: "NpcBuilderDialog",
	props: {
		closeLabel: { default: "Close" },
		open: { type: Boolean },
		title: {},
		wide: {
			type: Boolean,
			default: !1
		}
	},
	emits: ["close"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ P(null), a = $n();
		return Gn(() => n.open, async (e) => {
			await En();
			let t = i.value;
			if (e && !t?.open) {
				t?.showModal();
				return;
			}
			!e && t?.open && t.close();
		}, { immediate: !0 }), _r(() => {
			i.value?.open && i.value.close();
		}), (t, n) => (B(), V("dialog", {
			ref_key: "dialogElement",
			ref: i,
			"aria-labelledby": F(a),
			"aria-modal": "true",
			class: "dui-modal",
			onCancel: n[1] ||= No((e) => r("close"), ["prevent"])
		}, [U("section", { class: k(["dui-modal-box", { "app:max-w-5xl": e.wide }]) }, [
			U("h2", {
				id: F(a),
				class: "dui-card-title"
			}, A(e.title), 9, Iu),
			wr(t.$slots, "default"),
			U("div", Lu, [U("button", {
				class: "dui-btn",
				type: "button",
				onClick: n[0] ||= (e) => r("close")
			}, A(e.closeLabel), 1)])
		], 2)], 40, Fu));
	}
}), zu = /* @__PURE__ */ new Map();
function Bu(e) {
	let t = e.id.trim();
	if (!t) throw Error("NPC auto-advance strategies must have an id.");
	zu.set(t, {
		...e,
		id: t
	});
}
function Vu() {
	return [...zu.values()].sort((e, t) => e.name.localeCompare(t.name));
}
function Hu(e) {
	return zu.get(e) ?? null;
}
function Uu(e, t) {
	return Ku(e, t, {
		kinds: ["skill"],
		respectTalentMaximums: !1
	});
}
function Wu(e, t) {
	return Ku(Ku(e, t, {
		kinds: ["talent"],
		respectTalentMaximums: !0
	}), t, {
		kinds: ["skill"],
		respectTalentMaximums: !1
	});
}
function Gu(e, t) {
	return Ku(e, t, {
		kinds: ["characteristic"],
		respectTalentMaximums: !1
	});
}
function Ku(e, t, n) {
	let r = Math.max(0, Math.floor(Number.isFinite(t) ? t : 0)), i = Yu(e.advancements), a = Tc(i).total;
	if (a >= r) return { advancements: i };
	let o = !0;
	for (; o;) {
		o = !1;
		for (let e of i) {
			if (!n.kinds.includes(e.kind)) continue;
			let t = qu(e, n);
			if (!t) continue;
			let i = Dc(t) - Dc(e);
			i <= 0 || a + i > r || (e.current = t.current, a += i, o = !0);
		}
	}
	return { advancements: i };
}
function qu(e, t) {
	return t.respectTalentMaximums && e.kind === "talent" && !Ju(e) ? null : {
		...e,
		current: e.current + hc(e)
	};
}
function Ju(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" ? gc(e) < t : !1;
}
function Yu(e) {
	return e.map((e) => ({
		...e,
		sources: e.sources.map((e) => ({ ...e }))
	}));
}
Bu({
	description: "Cycles visible Skill rows evenly until no next skill increase fits the target XP.",
	id: "skill-master",
	name: "Skill Master",
	run: Uu
}), Bu({
	description: "Raises visible Talent rows evenly up to known maximums, then spends any remaining XP like Skill Master.",
	id: "gifted-and-talented",
	name: "Gifted & Talented",
	run: Wu
}), Bu({
	description: "Cycles visible Characteristic rows evenly until no next characteristic increase fits the target XP.",
	id: "all-natural",
	name: "All Natural",
	run: Gu
});
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderAdvancementsTab/advancement-display.ts
function Xu(e) {
	let t = e.current - e.careerValue, n = [...e.sources].sort((e, t) => id(e.kind) - id(t.kind)).map((e) => Zu(e));
	return t !== 0 && n.push(`Manual ${ad(t)}`), n.length ? n.join(", ") : e.includedFromBase ? "Base actor" : "-";
}
function Zu(e) {
	return e.kind === "custom" && e.count === 0 ? e.label : `${e.label} ${ad(e.count)}`;
}
function Qu(e) {
	return zs(e) !== null;
}
function $u(e) {
	return Math.max(e.minimumTotal, e.baseValue + e.current);
}
function ed(e) {
	return $u(e);
}
function td(e) {
	return e.talentMaximumLabel ?? "Unknown";
}
function nd(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" && ed(e) > t;
}
function rd(e) {
	return Dc(e);
}
function id(e) {
	return e === "characteristic" ? 0 : e === "career" ? 1 : 2;
}
function ad(e) {
	return e > 0 ? `+${e}` : `${e}`;
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderAdvancementsTab/AdvancementRowTailActions.vue?vue&type=script&setup=true&lang.ts
var od = ["disabled"], sd = /* @__PURE__ */ L({
	__name: "AdvancementRowTailActions",
	props: { entry: {} },
	emits: ["removeCustom", "resetCurrent"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (B(), V(z, null, [U("button", {
			class: "dui-join-item dui-btn dui-btn-sm",
			disabled: e.entry.current === e.entry.careerValue,
			title: "Reset to career value",
			type: "button",
			onClick: r[0] ||= (e) => n("resetCurrent")
		}, " Reset ", 8, od), e.entry.includedFromCustom ? (B(), V("button", {
			key: 0,
			class: "dui-join-item dui-btn dui-btn-sm",
			title: "Remove dropped entry",
			type: "button",
			onClick: r[1] ||= (e) => n("removeCustom")
		}, " Remove Dropped ")) : K("", !0)], 64));
	}
}), cd = { class: "dui-card dui-card-border dui-card-sm" }, ld = { class: "dui-card-body" }, ud = { class: "dui-card-title" }, dd = {
	key: 0,
	class: "dui-badge dui-badge-primary"
}, fd = { key: 0 }, pd = /* @__PURE__ */ L({
	__name: "NpcBuilderSection",
	props: {
		description: { default: "" },
		number: { default: "" },
		title: {}
	},
	setup(e) {
		return (t, n) => (B(), V("section", cd, [U("div", ld, [
			U("h2", ud, [e.number ? (B(), V("span", dd, A(e.number), 1)) : K("", !0), G(" " + A(e.title), 1)]),
			e.description ? (B(), V("p", fd, A(e.description), 1)) : K("", !0),
			wr(t.$slots, "default")
		])]));
	}
}), md = {
	key: 0,
	class: "dui-card-actions"
}, hd = {
	key: 1,
	class: "dui-alert dui-alert-info"
}, gd = { class: "dui-list" }, _d = { class: "dui-list-col-grow" }, vd = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, yd = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, bd = { class: "dui-join" }, xd = ["disabled", "onClick"], Sd = [
	"aria-label",
	"value",
	"onInput"
], Cd = ["onClick"], wd = {
	key: 2,
	class: "dui-alert"
}, Td = /* @__PURE__ */ L({
	__name: "AdvancementRowsPanel",
	props: {
		entries: {},
		estimatedNpcXp: {},
		manualAdvanceCount: {},
		sectionNumber: {},
		showSkillSpecializationBadges: { type: Boolean },
		title: {}
	},
	emits: [
		"adjustCurrent",
		"removeCustom",
		"resetAll",
		"resetCurrent",
		"totalChange"
	],
	setup(e, { emit: t }) {
		let n = t;
		function r(e, t) {
			let r = t.target;
			r && n("totalChange", e, Number(r.value));
		}
		return (t, i) => (B(), H(pd, {
			number: e.sectionNumber,
			title: e.title
		}, {
			default: I(() => [
				e.manualAdvanceCount ? (B(), V("div", md, [U("span", null, A(e.manualAdvanceCount) + " manual edits", 1), U("button", {
					class: "dui-btn dui-btn-sm",
					type: "button",
					onClick: i[0] ||= (e) => n("resetAll")
				}, " Reset All Advances ")])) : K("", !0),
				e.estimatedNpcXp ? (B(), V("div", hd, [
					U("strong", null, "Estimated NPC XP " + A(e.estimatedNpcXp.total), 1),
					U("span", null, A(e.estimatedNpcXp.characteristics) + " characteristics", 1),
					U("span", null, A(e.estimatedNpcXp.skills) + " skills", 1),
					U("span", null, A(e.estimatedNpcXp.talents) + " talents", 1)
				])) : K("", !0),
				U("ul", gd, [(B(!0), V(z, null, R(e.entries, (t) => (B(), V("li", {
					key: `${t.kind}:${t.name}`,
					class: "dui-list-row"
				}, [U("div", _d, [
					U("strong", null, A(t.name), 1),
					t.current === t.careerValue ? K("", !0) : (B(), V("span", vd, " Manual edit ")),
					e.showSkillSpecializationBadges && F(Qu)(t.name) ? (B(), V("span", yd, " Needs specialization ")) : K("", !0),
					U("span", null, " Base " + A(t.baseValue) + " · Advances " + A(t.current) + " · XP " + A(F(rd)(t)), 1),
					U("small", null, "Sources: " + A(F(Xu)(t)), 1)
				]), U("div", bd, [
					U("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						disabled: F($u)(t) <= t.minimumTotal,
						title: "Decrease by 5",
						type: "button",
						onClick: (e) => n("adjustCurrent", t, -1)
					}, " -5 ", 8, xd),
					U("input", {
						class: "dui-join-item dui-input dui-input-sm",
						"aria-label": `Total ${t.name}`,
						value: F($u)(t),
						min: "0",
						type: "number",
						onInput: (e) => r(t, e)
					}, null, 40, Sd),
					U("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						title: "Increase by 5",
						type: "button",
						onClick: (e) => n("adjustCurrent", t, 1)
					}, " +5 ", 8, Cd),
					W(sd, {
						entry: t,
						onRemoveCustom: (e) => n("removeCustom", t),
						onResetCurrent: (e) => n("resetCurrent", t)
					}, null, 8, [
						"entry",
						"onRemoveCustom",
						"onResetCurrent"
					])
				])]))), 128))]),
				e.entries.length ? K("", !0) : (B(), V("p", wd, "No " + A(e.title.toLowerCase()) + " to advance yet.", 1))
			]),
			_: 1
		}, 8, ["number", "title"]));
	}
}), Ed = { class: "dui-fieldset" }, Dd = ["value"], Od = { class: "dui-fieldset" }, kd = ["value"], Ad = ["value"], jd = { key: 0 }, Md = { class: "dui-card-actions" }, Nd = ["disabled"], Pd = /* @__PURE__ */ L({
	__name: "AutoAdvancePanel",
	props: {
		autoAdvanceStrategies: {},
		canRunAutoAdvance: { type: Boolean },
		selectedAutoAdvanceStrategy: {},
		selectedAutoAdvanceStrategyId: {},
		targetXp: {}
	},
	emits: [
		"runAutoAdvance",
		"strategyChange",
		"targetXpChange"
	],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("targetXpChange", Number(t?.value ?? 0));
		}
		function i(e) {
			let t = e.target;
			n("strategyChange", t?.value ?? "");
		}
		return (t, a) => (B(), H(pd, {
			description: "Spend toward a target without exceeding it. Existing manual edits are preserved.",
			number: "4",
			title: "Auto Advance"
		}, {
			default: I(() => [
				U("fieldset", Ed, [a[1] ||= U("legend", { class: "dui-fieldset-legend" }, "Target XP", -1), U("input", {
					"aria-label": "Target XP",
					class: "dui-input dui-input-sm",
					value: e.targetXp,
					min: "0",
					type: "number",
					onInput: r
				}, null, 40, Dd)]),
				U("fieldset", Od, [a[2] ||= U("legend", { class: "dui-fieldset-legend" }, "Strategy", -1), U("select", {
					"aria-label": "Auto advance strategy",
					class: "dui-select dui-select-sm",
					value: e.selectedAutoAdvanceStrategyId,
					onChange: i
				}, [(B(!0), V(z, null, R(e.autoAdvanceStrategies, (e) => (B(), V("option", {
					key: e.id,
					value: e.id
				}, A(e.name), 9, Ad))), 128))], 40, kd)]),
				e.selectedAutoAdvanceStrategy ? (B(), V("p", jd, A(e.selectedAutoAdvanceStrategy.description), 1)) : K("", !0),
				U("div", Md, [U("button", {
					class: "dui-btn dui-btn-primary dui-btn-sm",
					disabled: !e.canRunAutoAdvance,
					title: "Advance rows as close to the target XP as possible without going over",
					type: "button",
					onClick: a[0] ||= (e) => n("runAutoAdvance")
				}, " Auto Advance ", 8, Nd)])
			]),
			_: 1
		}));
	}
}), Fd = { class: "dui-card-actions" }, Id = ["disabled"], Ld = { class: "dui-list" }, Rd = { class: "dui-list-col-grow" }, zd = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, Bd = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, Vd = { class: "dui-join" }, Hd = ["disabled", "onClick"], Ud = [
	"aria-label",
	"value",
	"onInput"
], Wd = ["onClick"], Gd = {
	key: 0,
	class: "dui-alert"
}, Kd = /* @__PURE__ */ L({
	__name: "TalentRowsPanel",
	props: {
		maximizableTalentCount: {},
		talents: {}
	},
	emits: [
		"adjustCurrent",
		"maximizeTalents",
		"removeCustom",
		"resetCurrent",
		"totalChange"
	],
	setup(e, { emit: t }) {
		let n = t;
		function r(e, t) {
			let r = t.target;
			r && n("totalChange", e, Number(r.value));
		}
		return (t, i) => (B(), H(pd, {
			number: "3",
			title: "Talents"
		}, {
			default: I(() => [
				U("div", Fd, [U("span", null, A(e.maximizableTalentCount) + " below maximum", 1), U("button", {
					class: "dui-btn dui-btn-sm",
					disabled: e.maximizableTalentCount === 0,
					title: "Raise talents with known maximums to their maximum ranks",
					type: "button",
					onClick: i[0] ||= (e) => n("maximizeTalents")
				}, " Maximize Talents ", 8, Id)]),
				U("ul", Ld, [(B(!0), V(z, null, R(e.talents, (e) => (B(), V("li", {
					key: `${e.kind}:${e.name}`,
					class: "dui-list-row"
				}, [U("div", Rd, [
					U("strong", null, A(e.name), 1),
					e.current === e.careerValue ? K("", !0) : (B(), V("span", zd, " Manual edit ")),
					U("span", null, " Ranks " + A(F(ed)(e)) + " · Maximum " + A(F(td)(e)) + " · XP " + A(F(rd)(e)), 1),
					U("small", null, "Sources: " + A(F(Xu)(e)), 1),
					F(nd)(e) ? (B(), V("span", Bd, " Over maximum ")) : K("", !0)
				]), U("div", Vd, [
					U("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						disabled: F(ed)(e) <= e.minimumTotal,
						title: "Decrease by 1",
						type: "button",
						onClick: (t) => n("adjustCurrent", e, -1)
					}, " -1 ", 8, Hd),
					U("input", {
						class: "dui-join-item dui-input dui-input-sm",
						"aria-label": `Ranks ${e.name}`,
						value: F(ed)(e),
						min: "0",
						type: "number",
						onInput: (t) => r(e, t)
					}, null, 40, Ud),
					U("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						title: "Increase by 1",
						type: "button",
						onClick: (t) => n("adjustCurrent", e, 1)
					}, " +1 ", 8, Wd),
					W(sd, {
						entry: e,
						onRemoveCustom: (t) => n("removeCustom", e),
						onResetCurrent: (t) => n("resetCurrent", e)
					}, null, 8, [
						"entry",
						"onRemoveCustom",
						"onResetCurrent"
					])
				])]))), 128))]),
				e.talents.length ? K("", !0) : (B(), V("p", Gd, "No talents to advance yet."))
			]),
			_: 1
		}));
	}
}), qd = /* @__PURE__ */ L({
	__name: "NpcBuilderAdvancementsTab",
	props: { page: {} },
	setup(e) {
		let t = Au(), { advancements: n, estimatedNpcXp: r, maximizableTalentCount: i } = xs(t), a = Vu(), o = /* @__PURE__ */ P("skill-master"), s = /* @__PURE__ */ P(0), c = q(() => n.value.filter((e) => e.kind === "characteristic")), l = q(() => n.value.filter((e) => e.kind === "skill")), u = q(() => n.value.filter((e) => e.kind === "talent")), d = q(() => n.value.filter((e) => e.current !== e.careerValue).length), f = q(() => Hu(o.value) ?? a[0] ?? null), p = q(() => f.value !== null && s.value > r.value.total);
		Gn(() => r.value.total, (e) => {
			s.value < e && (s.value = e);
		}, { immediate: !0 });
		function m() {
			let e = f.value;
			e && t.applyAutoAdvance(e, s.value);
		}
		return (n, h) => (B(), V("section", null, [e.page === "detail-characteristics" ? (B(), H(Td, {
			key: 0,
			entries: c.value,
			"estimated-npc-xp": F(r),
			"manual-advance-count": d.value,
			"section-number": "",
			title: "Characteristics",
			onAdjustCurrent: F(t).adjustAdvancementCurrent,
			onRemoveCustom: F(t).removeCustomAdvancement,
			onResetAll: F(t).resetAllAdvancementCurrents,
			onResetCurrent: F(t).resetAdvancementCurrent,
			onTotalChange: F(t).setAdvancementTotal
		}, null, 8, [
			"entries",
			"estimated-npc-xp",
			"manual-advance-count",
			"onAdjustCurrent",
			"onRemoveCustom",
			"onResetAll",
			"onResetCurrent",
			"onTotalChange"
		])) : e.page === "detail-skills" ? (B(), H(Td, {
			key: 1,
			entries: l.value,
			"section-number": "",
			"show-skill-specialization-badges": "",
			title: "Skills",
			onAdjustCurrent: F(t).adjustAdvancementCurrent,
			onRemoveCustom: F(t).removeCustomAdvancement,
			onResetCurrent: F(t).resetAdvancementCurrent,
			onTotalChange: F(t).setAdvancementTotal
		}, null, 8, [
			"entries",
			"onAdjustCurrent",
			"onRemoveCustom",
			"onResetCurrent",
			"onTotalChange"
		])) : e.page === "detail-talents" ? (B(), H(Kd, {
			key: 2,
			"maximizable-talent-count": F(i),
			talents: u.value,
			onAdjustCurrent: F(t).adjustAdvancementCurrent,
			onMaximizeTalents: F(t).maximizeTalents,
			onRemoveCustom: F(t).removeCustomAdvancement,
			onResetCurrent: F(t).resetAdvancementCurrent,
			onTotalChange: F(t).setAdvancementTotal
		}, null, 8, [
			"maximizable-talent-count",
			"talents",
			"onAdjustCurrent",
			"onMaximizeTalents",
			"onRemoveCustom",
			"onResetCurrent",
			"onTotalChange"
		])) : (B(), H(Pd, {
			key: 3,
			"auto-advance-strategies": F(a),
			"can-run-auto-advance": p.value,
			"selected-auto-advance-strategy": f.value,
			"selected-auto-advance-strategy-id": o.value,
			"target-xp": s.value,
			onRunAutoAdvance: m,
			onStrategyChange: h[0] ||= (e) => o.value = e,
			onTargetXpChange: h[1] ||= (e) => s.value = e
		}, null, 8, [
			"auto-advance-strategies",
			"can-run-auto-advance",
			"selected-auto-advance-strategy",
			"selected-auto-advance-strategy-id",
			"target-xp"
		]))]));
	}
});
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/labels.ts
function Jd(e) {
	return [
		`Ch ${e.grants.characteristics.length}`,
		`Sk ${e.grants.skills.length}`,
		`Ta ${e.grants.talents.length}`,
		`Tr ${e.grants.trappings.length}`
	].join(" / ");
}
function Yd(e) {
	let t = e.slice(0, 3).join(", "), n = e.length - 3;
	return e.length ? n > 0 ? `${t}, +${n}` : t : "-";
}
function Xd(e) {
	return e.split(/\s+/).map((e) => e.at(0)).filter(Boolean).slice(0, 2).join("").toLocaleUpperCase();
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/BaseActorPanel.vue?vue&type=script&setup=true&lang.ts
var Zd = { class: "dui-fieldset" }, Qd = ["value"], $d = { class: "dui-fieldset" }, ef = ["disabled", "value"], tf = { value: "" }, nf = ["value"], rf = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, af = {
	key: 1,
	class: "dui-alert"
}, of = {
	key: 0,
	class: "dui-avatar"
}, sf = { class: "app:size-16 app:shrink-0 app:rounded-lg" }, cf = ["src"], lf = {
	key: 1,
	class: "dui-badge"
}, uf = /* @__PURE__ */ L({
	__name: "BaseActorPanel",
	props: {
		actorFilter: {},
		description: { default: "Choose a world Actor as the starting statblock." },
		errorMessage: {},
		filteredActors: {},
		isLoadingActors: { type: Boolean },
		isLoadingBaseDraft: { type: Boolean },
		number: { default: "1" },
		selectedBaseActor: {},
		selectedBaseActorUuid: {},
		title: { default: "Base Actor" }
	},
	emits: ["actorFilterChange", "baseActorChange"],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("actorFilterChange", t?.value ?? "");
		}
		function i(e) {
			let t = e.target;
			n("baseActorChange", t?.value ?? "");
		}
		return (t, n) => (B(), H(pd, {
			description: e.description,
			number: e.number,
			title: e.title
		}, {
			default: I(() => [
				U("fieldset", Zd, [n[0] ||= U("legend", { class: "dui-fieldset-legend" }, "Search world actors", -1), U("input", {
					"aria-label": "Search world actors",
					class: "dui-input dui-input-sm",
					value: e.actorFilter,
					placeholder: "Filter actors",
					type: "search",
					onInput: r
				}, null, 40, Qd)]),
				U("fieldset", $d, [n[1] ||= U("legend", { class: "dui-fieldset-legend" }, "Base statblock", -1), U("select", {
					"aria-label": "Base statblock",
					class: "dui-select dui-select-sm",
					disabled: e.isLoadingActors,
					value: e.selectedBaseActorUuid,
					onChange: i
				}, [U("option", tf, A(e.isLoadingActors ? "Loading actors..." : "Choose an actor"), 1), (B(!0), V(z, null, R(e.filteredActors, (e) => (B(), V("option", {
					key: e.uuid,
					value: e.uuid
				}, A(e.name), 9, nf))), 128))], 40, ef)]),
				e.errorMessage ? (B(), V("p", rf, A(e.errorMessage), 1)) : K("", !0),
				e.selectedBaseActor ? (B(), V("article", af, [e.selectedBaseActor.img ? (B(), V("div", of, [U("div", sf, [U("img", {
					src: e.selectedBaseActor.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "64",
					width: "64"
				}, null, 8, cf)])])) : (B(), V("span", lf, A(F(Xd)(e.selectedBaseActor.name)), 1)), U("div", null, [U("strong", null, A(e.selectedBaseActor.name), 1), U("span", null, [
					G(A(e.selectedBaseActor.species || "Species not found") + " ", 1),
					e.selectedBaseActor.type ? (B(), V(z, { key: 0 }, [G(" - " + A(e.selectedBaseActor.type), 1)], 64)) : K("", !0),
					e.isLoadingBaseDraft ? (B(), V(z, { key: 1 }, [G(" - loading details...")], 64)) : K("", !0)
				])])])) : K("", !0)
			]),
			_: 1
		}, 8, [
			"description",
			"number",
			"title"
		]));
	}
}), df = { class: "dui-card-actions" }, ff = { class: "dui-stats dui-stats-vertical app:w-full" }, pf = { class: "dui-stat" }, mf = { class: "dui-stat-value" }, hf = {
	key: 0,
	class: "dui-stat-desc"
}, gf = { class: "dui-stat" }, _f = { class: "dui-stat-value" }, vf = {
	key: 0,
	class: "dui-stat-desc"
}, yf = {
	key: 1,
	class: "dui-stat-desc"
}, bf = { class: "dui-stat" }, xf = { class: "dui-stat-value" }, Sf = { class: "dui-stat" }, Cf = { class: "dui-stat-value" }, wf = { class: "dui-stat" }, Tf = { class: "dui-stat-value" }, Ef = { class: "dui-stat-desc" }, Df = {
	key: 0,
	class: "dui-alert dui-alert-warning",
	role: "alert"
}, Of = { key: 1 }, kf = /* @__PURE__ */ L({
	__name: "BuildPreviewPanel",
	props: {
		advancementCount: {},
		buildPreviewStatus: {},
		buildPreviewWarnings: {},
		editedAdvanceCount: {},
		estimatedNpcXp: {},
		fallbackTrappingCount: {},
		ignoredTrappingCount: {},
		selectedSpellCount: {},
		traitCount: {},
		visibleTrappingCount: {}
	},
	setup(e) {
		return (t, n) => (B(), H(pd, {
			number: "4",
			title: "Build Preview"
		}, {
			default: I(() => [
				U("div", df, [U("span", { class: k(["dui-badge", e.buildPreviewStatus === "Ready" ? "dui-badge-success" : "dui-badge-warning"]) }, A(e.buildPreviewStatus), 3)]),
				U("div", ff, [
					U("div", pf, [
						n[0] ||= U("span", { class: "dui-stat-title" }, "Advances", -1),
						U("strong", mf, A(e.advancementCount), 1),
						e.editedAdvanceCount ? (B(), V("small", hf, A(e.editedAdvanceCount) + " manually edited ", 1)) : K("", !0)
					]),
					U("div", gf, [
						n[1] ||= U("span", { class: "dui-stat-title" }, "Trappings", -1),
						U("strong", _f, A(e.visibleTrappingCount), 1),
						e.fallbackTrappingCount ? (B(), V("small", vf, A(e.fallbackTrappingCount) + " blank fallback ", 1)) : K("", !0),
						e.ignoredTrappingCount ? (B(), V("small", yf, A(e.ignoredTrappingCount) + " ignored ", 1)) : K("", !0)
					]),
					U("div", bf, [n[2] ||= U("span", { class: "dui-stat-title" }, "Traits", -1), U("strong", xf, A(e.traitCount), 1)]),
					U("div", Sf, [n[3] ||= U("span", { class: "dui-stat-title" }, "Spells", -1), U("strong", Cf, A(e.selectedSpellCount), 1)]),
					U("div", wf, [
						n[4] ||= U("span", { class: "dui-stat-title" }, "Estimated NPC XP", -1),
						U("strong", Tf, A(e.estimatedNpcXp.total), 1),
						U("small", Ef, A(e.estimatedNpcXp.characteristics) + " char / " + A(e.estimatedNpcXp.skills) + " skill / " + A(e.estimatedNpcXp.talents) + " talent ", 1)
					])
				]),
				e.buildPreviewWarnings.length ? (B(), V("div", Df, [U("div", null, [(B(!0), V(z, null, R(e.buildPreviewWarnings, (e) => (B(), V("p", { key: e }, A(e), 1))), 128))])])) : (B(), V("p", Of, " The draft has a base Actor, queued Career data, resolved trappings, and a portrait ready to apply. "))
			]),
			_: 1
		}));
	}
}), Af = { class: "dui-list" }, jf = { class: "dui-list-row" }, Mf = { class: "dui-list-row" }, Nf = { class: "dui-list-row" }, Pf = { class: "dui-list-row" }, Ff = { class: "dui-list-row" }, If = { class: "dui-list-row" }, Lf = { class: "dui-list-row" }, Rf = /* @__PURE__ */ L({
	__name: "BuildSummaryDetails",
	props: {
		advancementCount: {},
		baseActorName: {},
		careerItemCount: {},
		estimatedNpcXpTotal: {},
		finalActorName: {},
		finalCareerName: {},
		grantTotals: {},
		selectedSpellCount: {},
		traitCount: {},
		visibleTrappingCount: {}
	},
	setup(e) {
		return (t, n) => (B(), V("dl", Af, [
			U("div", jf, [n[0] ||= U("dt", null, "Build name", -1), U("dd", null, A(e.finalActorName), 1)]),
			U("div", Mf, [n[1] ||= U("dt", null, "Base actor", -1), U("dd", null, A(e.baseActorName), 1)]),
			U("div", Nf, [n[2] ||= U("dt", null, "Final career", -1), U("dd", null, A(e.finalCareerName), 1)]),
			U("div", Pf, [n[3] ||= U("dt", null, "Career items", -1), U("dd", null, A(e.careerItemCount), 1)]),
			U("div", Ff, [n[4] ||= U("dt", null, "Apply", -1), U("dd", null, A(e.advancementCount) + " advance rows, " + A(e.visibleTrappingCount) + " trappings, " + A(e.traitCount) + " traits, " + A(e.selectedSpellCount) + " spells ", 1)]),
			U("div", If, [n[5] ||= U("dt", null, "Extracted grants", -1), U("dd", null, A(e.grantTotals.characteristics) + " characteristics, " + A(e.grantTotals.skills) + " skills, " + A(e.grantTotals.talents) + " talents, " + A(e.grantTotals.trappings) + " trappings ", 1)]),
			U("div", Lf, [n[6] ||= U("dt", null, "Estimated NPC XP", -1), U("dd", null, A(e.estimatedNpcXpTotal), 1)])
		]));
	}
}), zf = { class: "app:grid app:gap-3" }, Bf = { class: "app:flex app:flex-wrap app:items-start app:gap-3" }, Vf = ["aria-label", "disabled"], Hf = ["src"], Uf = { key: 1 }, Wf = { key: 2 }, Gf = { class: "app:flex app:min-w-48 app:flex-1 app:flex-col app:items-start app:gap-2" }, Kf = ["title"], qf = {
	key: 1,
	class: "app:text-base-content/70"
}, Jf = ["disabled"], Yf = {
	key: 0,
	"aria-live": "polite",
	role: "status"
}, Xf = ["value"], Zf = {
	key: 1,
	class: "dui-fieldset"
}, Qf = { class: "dui-fieldset-legend" }, $f = { key: 0 }, ep = { key: 1 }, tp = { class: "app:flex app:flex-wrap app:gap-2" }, np = [
	"aria-label",
	"aria-pressed",
	"title",
	"onClick"
], rp = ["src"], ip = ["aria-label"], ap = /* @__PURE__ */ L({
	__name: "PortraitPicker",
	props: {
		compactPortraitCandidates: {},
		finalCareer: {},
		finalPortraitPath: {},
		hiddenPortraitCandidateCount: {},
		isLoadingPortraitCandidates: { type: Boolean },
		portraitCandidates: {},
		portraitSearchProgress: {},
		portraitSearchProgressLabel: {},
		portraitSearchProgressValue: {},
		selectedPortraitCandidate: {},
		selectedPortraitCandidateKey: {}
	},
	emits: ["openGallery", "selectPortrait"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (B(), V("section", zf, [
			U("div", Bf, [U("button", {
				"aria-label": e.portraitCandidates.length ? "Open portrait gallery" : "No portraits available",
				class: "dui-btn dui-btn-square app:h-32 app:w-32 app:shrink-0 app:overflow-hidden app:p-1",
				disabled: !e.portraitCandidates.length,
				title: "Open portrait gallery",
				type: "button",
				onClick: r[0] ||= (e) => n("openGallery")
			}, [e.finalPortraitPath ? (B(), V("img", {
				key: 0,
				alt: "",
				class: "app:h-full app:w-full app:rounded-box app:object-cover",
				height: "192",
				src: e.finalPortraitPath,
				width: "192"
			}, null, 8, Hf)) : e.finalCareer ? (B(), V("strong", Uf, A(F(Xd)(e.finalCareer.name)), 1)) : (B(), V("span", Wf, "No portrait"))], 8, Vf), U("div", Gf, [
				r[3] ||= U("span", { class: "dui-badge dui-badge-outline" }, "Current portrait", -1),
				U("strong", null, A(e.selectedPortraitCandidate?.label ?? "No portrait selected"), 1),
				e.finalPortraitPath ? (B(), V("small", {
					key: 0,
					class: "app:break-all app:text-base-content/70",
					title: e.finalPortraitPath
				}, A(e.finalPortraitPath), 9, Kf)) : (B(), V("span", qf, " A Career or base Actor image will be used when available. ")),
				U("button", {
					class: "dui-btn dui-btn-outline dui-btn-sm",
					disabled: !e.portraitCandidates.length,
					type: "button",
					onClick: r[1] ||= (e) => n("openGallery")
				}, " Browse " + A(e.portraitCandidates.length) + " portraits ", 9, Jf)
			])]),
			e.isLoadingPortraitCandidates && e.portraitSearchProgress ? (B(), V("div", Yf, [U("progress", {
				"aria-label": "Portrait search progress",
				class: "dui-progress dui-progress-info app:w-full",
				value: e.portraitSearchProgressValue,
				max: "100"
			}, null, 8, Xf), U("small", null, A(e.portraitSearchProgressLabel), 1)])) : K("", !0),
			e.portraitCandidates.length || e.isLoadingPortraitCandidates ? (B(), V("fieldset", Zf, [U("legend", Qf, [r[4] ||= U("span", null, "Quick picks", -1), e.isLoadingPortraitCandidates ? (B(), V("span", $f, "Updating...")) : (B(), V("span", ep, A(e.portraitCandidates.length) + " options", 1))]), U("div", tp, [(B(!0), V(z, null, R(e.compactPortraitCandidates, (t) => (B(), V("button", {
				key: t.key,
				"aria-label": F(xl)(t),
				"aria-pressed": t.key === e.selectedPortraitCandidateKey,
				class: k(["dui-btn dui-btn-square app:overflow-hidden app:p-1", { "dui-btn-active dui-btn-outline": t.key === e.selectedPortraitCandidateKey }]),
				title: F(bl)(t),
				type: "button",
				onClick: (e) => n("selectPortrait", t)
			}, [U("img", {
				alt: "",
				class: "app:h-full app:w-full app:rounded-box app:object-cover",
				height: "64",
				loading: "lazy",
				src: t.img,
				width: "64"
			}, null, 8, rp)], 10, np))), 128)), e.hiddenPortraitCandidateCount > 0 ? (B(), V("button", {
				key: 0,
				"aria-label": `Open ${e.hiddenPortraitCandidateCount} more portrait options`,
				class: "dui-btn dui-btn-square",
				type: "button",
				onClick: r[2] ||= (e) => n("openGallery")
			}, " +" + A(e.hiddenPortraitCandidateCount), 9, ip)) : K("", !0)])])) : K("", !0)
		]));
	}
}), op = { class: "app:grid app:gap-3 md:app:sticky md:app:top-28 md:app:max-h-[calc(100vh-10rem)] md:app:self-start md:app:overflow-y-auto" }, sp = { class: "dui-fieldset" }, cp = ["placeholder", "value"], lp = { class: "app:hidden md:app:grid md:app:gap-3" }, up = { class: "dui-collapse dui-collapse-arrow dui-card-border" }, dp = { class: "dui-collapse-content" }, fp = /* @__PURE__ */ L({
	__name: "BuildSidebar",
	props: {
		actorName: {},
		advancementCount: {},
		buildPreviewStatus: {},
		buildPreviewWarnings: {},
		careerItemCount: {},
		compactPortraitCandidates: {},
		editedAdvanceCount: {},
		estimatedNpcXp: {},
		fallbackTrappingCount: {},
		finalActorName: {},
		finalCareer: {},
		finalPortraitPath: {},
		grantTotals: {},
		hiddenPortraitCandidateCount: {},
		ignoredTrappingCount: {},
		isLoadingPortraitCandidates: { type: Boolean },
		portraitCandidates: {},
		portraitSearchProgress: {},
		portraitSearchProgressLabel: {},
		portraitSearchProgressValue: {},
		selectedBaseActor: {},
		selectedPortraitCandidate: {},
		selectedPortraitCandidateKey: {},
		selectedSpellCount: {},
		suggestedActorName: {},
		traitCount: {},
		visibleTrappingCount: {}
	},
	emits: [
		"actorNameChange",
		"openPortraitGallery",
		"selectPortrait"
	],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("actorNameChange", t?.value ?? "");
		}
		return (t, i) => (B(), V("aside", op, [W(pd, {
			description: "The generated Actor identity stays visible while Build NPC controls change.",
			title: "Preview"
		}, {
			default: I(() => [W(ap, {
				"compact-portrait-candidates": e.compactPortraitCandidates,
				"final-career": e.finalCareer,
				"final-portrait-path": e.finalPortraitPath,
				"hidden-portrait-candidate-count": e.hiddenPortraitCandidateCount,
				"is-loading-portrait-candidates": e.isLoadingPortraitCandidates,
				"portrait-candidates": e.portraitCandidates,
				"portrait-search-progress": e.portraitSearchProgress,
				"portrait-search-progress-label": e.portraitSearchProgressLabel,
				"portrait-search-progress-value": e.portraitSearchProgressValue,
				"selected-portrait-candidate": e.selectedPortraitCandidate,
				"selected-portrait-candidate-key": e.selectedPortraitCandidateKey,
				onOpenGallery: i[0] ||= (e) => n("openPortraitGallery"),
				onSelectPortrait: i[1] ||= (e) => n("selectPortrait", e)
			}, null, 8, [
				"compact-portrait-candidates",
				"final-career",
				"final-portrait-path",
				"hidden-portrait-candidate-count",
				"is-loading-portrait-candidates",
				"portrait-candidates",
				"portrait-search-progress",
				"portrait-search-progress-label",
				"portrait-search-progress-value",
				"selected-portrait-candidate",
				"selected-portrait-candidate-key"
			]), U("fieldset", sp, [i[2] ||= U("legend", { class: "dui-fieldset-legend" }, "NPC name", -1), U("input", {
				"aria-label": "NPC name",
				class: "dui-input dui-input-sm",
				placeholder: e.suggestedActorName,
				value: e.actorName,
				type: "text",
				onInput: r
			}, null, 40, cp)])]),
			_: 1
		}), U("div", lp, [W(kf, {
			"advancement-count": e.advancementCount,
			"build-preview-status": e.buildPreviewStatus,
			"build-preview-warnings": e.buildPreviewWarnings,
			"edited-advance-count": e.editedAdvanceCount,
			"estimated-npc-xp": e.estimatedNpcXp,
			"fallback-trapping-count": e.fallbackTrappingCount,
			"ignored-trapping-count": e.ignoredTrappingCount,
			"selected-spell-count": e.selectedSpellCount,
			"trait-count": e.traitCount,
			"visible-trapping-count": e.visibleTrappingCount
		}, null, 8, [
			"advancement-count",
			"build-preview-status",
			"build-preview-warnings",
			"edited-advance-count",
			"estimated-npc-xp",
			"fallback-trapping-count",
			"ignored-trapping-count",
			"selected-spell-count",
			"trait-count",
			"visible-trapping-count"
		]), U("details", up, [i[3] ||= U("summary", { class: "dui-collapse-title" }, "Complete build details", -1), U("div", dp, [W(Rf, {
			"advancement-count": e.advancementCount,
			"base-actor-name": e.selectedBaseActor?.name ?? "Not selected",
			"career-item-count": e.careerItemCount,
			"estimated-npc-xp-total": e.estimatedNpcXp.total,
			"final-actor-name": e.finalActorName,
			"final-career-name": e.finalCareer?.name ?? "Not queued",
			"grant-totals": e.grantTotals,
			"selected-spell-count": e.selectedSpellCount,
			"trait-count": e.traitCount,
			"visible-trapping-count": e.visibleTrappingCount
		}, null, 8, [
			"advancement-count",
			"base-actor-name",
			"career-item-count",
			"estimated-npc-xp-total",
			"final-actor-name",
			"final-career-name",
			"grant-totals",
			"selected-spell-count",
			"trait-count",
			"visible-trapping-count"
		])])])])]));
	}
}), pp = {
	key: 0,
	class: "dui-list app:gap-1"
}, mp = [
	"onDragenter",
	"onDragover",
	"onDrop"
], hp = ["onDragstart"], gp = {
	key: 0,
	class: "dui-avatar"
}, _p = { class: "app:size-10 app:rounded-md" }, vp = ["src"], yp = {
	key: 1,
	class: "dui-badge dui-badge-sm"
}, bp = { class: "dui-list-col-grow app:min-w-0" }, xp = { class: "app:flex app:min-w-0 app:flex-wrap app:items-center app:gap-1" }, Sp = { class: "app:truncate" }, Cp = {
	key: 0,
	class: "dui-badge dui-badge-info dui-badge-xs"
}, wp = {
	key: 1,
	class: "dui-badge dui-badge-info dui-badge-xs"
}, Tp = { class: "app:flex app:min-w-0 app:items-center app:gap-2 app:text-xs" }, Ep = { class: "app:shrink-0" }, Dp = ["title"], Op = { class: "app:flex app:items-center app:justify-end app:gap-1" }, kp = { class: "app:flex app:items-center app:gap-1 app:text-xs" }, Ap = ["value", "onInput"], jp = { class: "dui-join" }, Mp = ["disabled", "onClick"], Np = ["disabled", "onClick"], Pp = ["onClick"], Fp = {
	key: 1,
	class: "dui-alert"
}, Ip = /* @__PURE__ */ L({
	__name: "CareerQueuePanel",
	props: {
		careers: {},
		draggedCareerIndex: {},
		dragOverCareerIndex: {}
	},
	emits: [
		"careerDragEnd",
		"careerDragEnter",
		"careerDragOver",
		"careerDragStart",
		"careerDropOnRow",
		"careerQuantityInput",
		"moveCareer",
		"removeCareer"
	],
	setup(e, { emit: t }) {
		let n = e, r = t;
		function i(e) {
			return n.draggedCareerIndex === null || n.draggedCareerIndex === e || n.dragOverCareerIndex !== e ? null : n.draggedCareerIndex < e ? "after" : "before";
		}
		return (t, n) => (B(), H(pd, {
			description: "Careers are applied in this order. Drag rows or use the buttons to reorder them.",
			number: "2",
			title: "Career Queue"
		}, {
			default: I(() => [e.careers.length ? (B(), V("ol", pp, [(B(!0), V(z, null, R(e.careers, (t, a) => (B(), V("li", {
				key: t.uuid,
				class: k(["dui-list-row app:grid-cols-[auto_auto_minmax(0,1fr)_auto] app:items-center app:gap-2 app:rounded-md app:px-2 app:py-2", {
					"app:border-t-2 app:border-dashed app:border-info": i(a) === "before",
					"app:border-b-2 app:border-dashed app:border-info": i(a) === "after",
					"app:opacity-60": e.draggedCareerIndex === a
				}]),
				onDragenter: No((e) => r("careerDragEnter", a), ["prevent", "stop"]),
				onDragover: (e) => r("careerDragOver", a, e),
				onDrop: (e) => r("careerDropOnRow", a, e)
			}, [
				U("span", {
					"aria-hidden": "true",
					class: k(["dui-badge dui-badge-ghost dui-badge-sm app:cursor-grab", { "app:cursor-grabbing": e.draggedCareerIndex === a }]),
					draggable: "true",
					title: "Drag to reorder",
					onDragend: n[0] ||= (e) => r("careerDragEnd"),
					onDragstart: (e) => r("careerDragStart", a, e)
				}, " Drag ", 42, hp),
				t.img ? (B(), V("div", gp, [U("div", _p, [U("img", {
					src: t.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "40",
					width: "40"
				}, null, 8, vp)])])) : (B(), V("span", yp, A(F(Xd)(t.name)), 1)),
				U("div", bp, [U("div", xp, [U("strong", Sp, A(t.name), 1), e.draggedCareerIndex === a ? (B(), V("span", Cp, " Dragging ")) : i(a) ? (B(), V("span", wp, " Place " + A(i(a)), 1)) : K("", !0)]), U("div", Tp, [U("span", Ep, [G(A(t.careerGroup || "Career") + " ", 1), t.level === null ? K("", !0) : (B(), V(z, { key: 0 }, [G(" level " + A(t.level), 1)], 64))]), U("small", {
					class: "dui-badge dui-badge-ghost dui-badge-sm app:min-w-0 app:truncate",
					title: [
						`Characteristics: ${F(Yd)(t.grants.characteristics)}`,
						`Skills: ${F(Yd)(t.grants.skills)}`,
						`Talents: ${F(Yd)(t.grants.talents)}`,
						`Trappings: ${F(Yd)(t.grants.trappings)}`
					].join("\n")
				}, A(F(Jd)(t)), 9, Dp)])]),
				U("div", Op, [U("label", kp, [n[1] ||= G(" Qty ", -1), U("input", {
					class: "dui-input dui-input-xs app:w-14",
					value: t.quantity,
					min: "1",
					type: "number",
					onInput: (e) => r("careerQuantityInput", a, e)
				}, null, 40, Ap)]), U("div", jp, [
					U("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						disabled: a === 0,
						title: "Move career earlier",
						type: "button",
						onClick: (e) => r("moveCareer", a, -1)
					}, " Up ", 8, Mp),
					U("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						disabled: a === e.careers.length - 1,
						title: "Move career later",
						type: "button",
						onClick: (e) => r("moveCareer", a, 1)
					}, " Down ", 8, Np),
					U("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						type: "button",
						onClick: (e) => r("removeCareer", a)
					}, " Remove ", 8, Pp)
				])])
			], 42, mp))), 128))])) : (B(), V("p", Fp, "No careers queued yet."))]),
			_: 1
		}));
	}
}), Lp = { class: "app:grid app:gap-2" }, Rp = { class: "app:flex app:flex-wrap app:items-center app:gap-2" }, zp = { class: "dui-join app:min-w-64 app:flex-1" }, Bp = { class: "dui-input dui-input-sm dui-join-item app:flex-1" }, Vp = ["onKeydown"], Hp = { class: "dui-badge dui-badge-sm dui-badge-outline" }, Up = { class: "app:grid app:gap-2 md:app:grid-cols-3" }, Wp = [
	"onDragenter",
	"onDragleave",
	"onDragover",
	"onDrop"
], Gp = { class: "dui-card-body app:gap-2 app:p-2" }, Kp = { class: "app:flex app:items-center app:gap-2" }, qp = { class: "dui-card-title app:m-0 app:text-sm" }, Jp = { class: "dui-badge dui-badge-sm" }, Yp = {
	key: 0,
	"aria-live": "polite",
	class: "dui-badge dui-badge-info dui-badge-sm app:ml-auto"
}, Xp = { class: "app:flex app:min-h-8 app:flex-wrap app:items-center app:gap-2" }, Zp = [
	"title",
	"onClick",
	"onDragstart",
	"onKeydown"
], Qp = {
	key: 0,
	class: "app:text-base-content/60"
}, $p = { class: "dui-card-body app:flex-row app:items-center app:justify-center app:gap-2 app:p-2" }, em = { "aria-live": "polite" }, tm = /* @__PURE__ */ L({
	__name: "PortraitFilterTags",
	props: {
		resultCount: {},
		tags: {}
	},
	emits: ["createSearchTerm", "filterTagSectionChange"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ P(""), a = /* @__PURE__ */ P(null), o = /* @__PURE__ */ P(null), s = [
			{
				icon: "fa-magnifying-glass",
				id: "search",
				title: "Search"
			},
			{
				icon: "fa-check",
				id: "must-include",
				title: "Must Include"
			},
			{
				icon: "fa-ban",
				id: "must-exclude",
				title: "Mustn't Include"
			}
		], c = q(() => Object.fromEntries(s.map((e) => [e.id, n.tags.filter((t) => t.section === e.id)])));
		function l() {
			let e = i.value;
			r("createSearchTerm", e), i.value = "";
		}
		function u(e, t) {
			t.stopPropagation(), a.value = e, t.dataTransfer?.setData("text/plain", hl(e.id)), t.dataTransfer?.setData(sl, e.id), t.dataTransfer && (t.dataTransfer.effectAllowed = "move");
		}
		function d(e, t) {
			t.preventDefault(), t.stopPropagation(), o.value = e, t.dataTransfer && (t.dataTransfer.dropEffect = _(a.value, e) ? "move" : "none");
		}
		function f(e, t) {
			t.stopPropagation(), !(t.currentTarget instanceof Node && t.relatedTarget instanceof Node && t.currentTarget.contains(t.relatedTarget)) && o.value === e && (o.value = null);
		}
		function p(e, t) {
			t.preventDefault(), t.stopPropagation();
			let i = t.dataTransfer?.getData("application/x-wfrp4e-customizer-portrait-filter-tag") || gl(t.dataTransfer?.getData("text/plain") ?? ""), o = a.value ?? n.tags.find((e) => e.id === i) ?? null;
			g(), _(o, e) && r("filterTagSectionChange", o, e);
		}
		function m(e) {
			let t = s[(s.findIndex((t) => t.id === e.section) + 1) % s.length];
			t && r("filterTagSectionChange", e, t.id);
		}
		function h(e) {
			e.canRemove && r("filterTagSectionChange", e, "removed");
		}
		function g() {
			a.value = null, o.value = null;
		}
		function _(e, t) {
			return !!(e && (t !== "removed" || e.canRemove));
		}
		function v(e) {
			return o.value === e ? e === "removed" && !a.value?.canRemove ? "Protected" : a.value?.section === e ? "Already here" : "Drop here" : "";
		}
		let y = q(() => o.value === "removed" ? a.value?.canRemove ? "Drop to remove this tag" : "Source tags stay available" : "Trash");
		return (t, n) => (B(), V("section", Lp, [
			U("div", Rp, [U("div", zp, [U("label", Bp, [n[5] ||= U("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-magnifying-glass"
			}, null, -1), Rn(U("input", {
				"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
				"aria-label": "Add a portrait search term",
				class: "app:grow",
				placeholder: "Add a search term",
				type: "search",
				onKeydown: Fo(No(l, ["prevent"]), ["enter"])
			}, null, 40, Vp), [[wo, i.value]])]), U("button", {
				class: "dui-btn dui-btn-sm dui-join-item",
				type: "button",
				onClick: l
			}, [...n[6] ||= [U("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-plus"
			}, null, -1), G(" Add ", -1)]])]), U("span", Hp, A(e.resultCount) + " images", 1)]),
			U("div", Up, [(B(), V(z, null, R(s, (e) => U("section", {
				key: e.id,
				class: k(["dui-card dui-card-border dui-card-sm app:min-h-20 app:border-base-content/30 app:bg-base-200 app:shadow-sm", { "app:border-info app:bg-info/10 app:ring-2 app:ring-info": o.value === e.id }]),
				onDragenter: (t) => d(e.id, t),
				onDragleave: (t) => f(e.id, t),
				onDragover: (t) => d(e.id, t),
				onDrop: (t) => p(e.id, t)
			}, [U("div", Gp, [U("header", Kp, [
				U("h3", qp, [U("i", {
					"aria-hidden": "true",
					class: k(["fa-solid", e.icon])
				}, null, 2), G(" " + A(e.title), 1)]),
				U("span", Jp, A(c.value[e.id].length), 1),
				o.value === e.id ? (B(), V("span", Yp, A(v(e.id)), 1)) : K("", !0)
			]), U("div", Xp, [(B(!0), V(z, null, R(c.value[e.id], (e) => (B(), V("button", {
				key: e.id,
				class: k(["dui-badge dui-badge-sm app:h-auto app:cursor-grab app:whitespace-normal app:py-1", [e.kind === "source" ? "dui-badge-outline" : "dui-badge-primary", a.value?.id === e.id ? "app:opacity-50" : ""]]),
				draggable: "true",
				title: `Drag ${e.label} to another group, or select it to move it to the next group.`,
				type: "button",
				onClick: (t) => m(e),
				onDragend: g,
				onDragstart: (t) => u(e, t),
				onKeydown: Fo(No((t) => h(e), ["prevent"]), ["delete"])
			}, A(e.label), 43, Zp))), 128)), c.value[e.id].length ? K("", !0) : (B(), V("small", Qp, " Drop tags here "))])])], 42, Wp)), 64))]),
			U("div", {
				"aria-label": "Remove search tag",
				class: k(["dui-card dui-card-border dui-card-sm app:border-dashed app:border-base-content/30 app:bg-base-200", {
					"app:border-error app:bg-error/10 app:ring-2 app:ring-error": o.value === "removed" && !a.value?.canRemove,
					"app:border-warning app:bg-warning/10 app:ring-2 app:ring-warning": o.value === "removed" && a.value?.canRemove
				}]),
				onDragenter: n[1] ||= (e) => d("removed", e),
				onDragleave: n[2] ||= (e) => f("removed", e),
				onDragover: n[3] ||= (e) => d("removed", e),
				onDrop: n[4] ||= (e) => p("removed", e)
			}, [U("div", $p, [n[7] ||= U("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-trash"
			}, null, -1), U("span", em, A(y.value), 1)])], 34)
		]));
	}
}), nm = ["aria-busy"], rm = {
	key: 0,
	class: "dui-alert dui-alert-error app:min-h-0 app:py-2",
	role: "alert"
}, im = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info app:min-h-0 app:gap-2 app:py-2",
	role: "status"
}, am = { class: "app:flex app:min-w-0 app:flex-1 app:items-center app:gap-2" }, om = { class: "app:shrink-0" }, sm = ["value"], cm = {
	key: 2,
	class: "dui-alert dui-alert-warning app:min-h-0 app:py-2"
}, lm = { class: "dui-list app:m-0 app:grid app:grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] app:gap-3 app:p-0" }, um = [
	"aria-label",
	"aria-pressed",
	"title",
	"onClick"
], dm = ["loading", "src"], fm = { class: "app:flex app:flex-wrap app:items-center app:justify-between app:gap-1" }, pm = {
	key: 0,
	class: "dui-badge dui-badge-success dui-badge-sm"
}, mm = { class: "app:text-sm" }, hm = {
	key: 4,
	class: "dui-alert"
}, gm = /* @__PURE__ */ L({
	__name: "PortraitGallery",
	props: {
		emptyMessage: { default: "No portraits are available yet." },
		errorMessage: { default: "" },
		fillHeight: {
			type: Boolean,
			default: !1
		},
		isLoading: { type: Boolean },
		options: {},
		progressLabel: {},
		progressValue: {},
		searchTerms: {},
		selectedOptionKey: {},
		tags: {}
	},
	emits: [
		"createSearchTerm",
		"filterTagSectionChange",
		"selectPortrait"
	],
	setup(e, { emit: t }) {
		let n = e, r = t;
		return (t, i) => (B(), V("section", {
			"aria-busy": e.isLoading,
			class: "app:flex app:min-h-0 app:flex-col app:gap-2"
		}, [
			W(tm, {
				"result-count": e.options.length,
				tags: e.tags,
				onCreateSearchTerm: i[0] ||= (e) => r("createSearchTerm", e),
				onFilterTagSectionChange: i[1] ||= (e, t) => r("filterTagSectionChange", e, t)
			}, null, 8, ["result-count", "tags"]),
			e.errorMessage ? (B(), V("div", rm, [i[2] ||= U("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-triangle-exclamation"
			}, null, -1), U("span", null, A(e.errorMessage), 1)])) : K("", !0),
			e.isLoading ? (B(), V("div", im, [i[3] ||= U("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-spinner fa-spin"
			}, null, -1), U("div", am, [U("small", om, A(e.progressLabel || "Updating results..."), 1), U("progress", {
				"aria-label": "Portrait search progress",
				class: "dui-progress app:min-w-24 app:flex-1",
				value: e.progressValue,
				max: "100"
			}, null, 8, sm)])])) : e.searchTerms.length && !e.options.length ? (B(), V("p", cm, " No portraits match the current filter tags. ")) : K("", !0),
			e.options.length ? (B(), V("div", {
				key: 3,
				class: k(["app:pr-1", e.fillHeight ? "app:min-h-48 app:flex-1 app:overflow-y-auto" : "app:max-h-[30rem] app:overflow-y-auto"])
			}, [U("ul", lm, [(B(!0), V(z, null, R(e.options, (t, n) => (B(), V("li", { key: t.key }, [U("button", {
				"aria-label": F(xl)(t),
				"aria-pressed": t.key === e.selectedOptionKey,
				class: k(["dui-btn app:h-auto app:min-h-0 app:w-full app:flex-col app:items-stretch app:justify-start app:gap-2 app:overflow-hidden app:whitespace-normal app:p-2 app:text-left", t.key === e.selectedOptionKey ? "dui-btn-active dui-btn-outline" : "dui-btn-ghost"]),
				title: F(bl)(t),
				type: "button",
				onClick: (e) => r("selectPortrait", t)
			}, [
				U("img", {
					alt: "",
					class: "app:aspect-square app:w-full app:rounded-box app:bg-base-300 app:object-cover",
					height: "192",
					loading: n < 6 ? "eager" : "lazy",
					src: t.img,
					width: "192"
				}, null, 8, dm),
				U("span", fm, [U("small", null, A(F(Sl)(t)), 1), t.key === e.selectedOptionKey ? (B(), V("span", pm, " Selected ")) : K("", !0)]),
				U("strong", mm, A(t.label), 1)
			], 10, um)]))), 128))])], 2)) : e.isLoading ? K("", !0) : (B(), V("p", hm, A(n.emptyMessage), 1))
		], 8, nm));
	}
}), _m = /* @__PURE__ */ L({
	__name: "PortraitGallery",
	props: {
		isLoadingPortraitCandidates: { type: Boolean },
		open: { type: Boolean },
		portraitCandidates: {},
		portraitFilterTags: {},
		portraitSearchProgressLabel: {},
		portraitSearchProgressValue: {},
		portraitSearchTerms: {},
		selectedPortraitCandidateKey: {}
	},
	emits: [
		"close",
		"createSearchTerm",
		"filterTagSectionChange",
		"selectPortrait"
	],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (B(), H(Ru, {
			"close-label": "Done",
			open: e.open,
			title: "Choose an NPC Portrait",
			wide: "",
			onClose: r[3] ||= (e) => n("close")
		}, {
			default: I(() => [W(gm, {
				"empty-message": "No portraits are available yet. Choose a base Actor or queue a Career to start the search.",
				"is-loading": e.isLoadingPortraitCandidates,
				options: e.portraitCandidates,
				"progress-label": e.portraitSearchProgressLabel,
				"progress-value": e.portraitSearchProgressValue,
				"search-terms": e.portraitSearchTerms,
				"selected-option-key": e.selectedPortraitCandidateKey,
				tags: e.portraitFilterTags,
				onCreateSearchTerm: r[0] ||= (e) => n("createSearchTerm", e),
				onFilterTagSectionChange: r[1] ||= (e, t) => n("filterTagSectionChange", e, t),
				onSelectPortrait: r[2] ||= (e) => n("selectPortrait", e)
			}, null, 8, [
				"is-loading",
				"options",
				"progress-label",
				"progress-value",
				"search-terms",
				"selected-option-key",
				"tags"
			])]),
			_: 1
		}, 8, ["open"]));
	}
}), vm = {
	key: 0,
	class: "dui-alert"
}, ym = {
	key: 0,
	class: "dui-avatar"
}, bm = { class: "app:size-14 app:shrink-0 app:rounded-lg" }, xm = ["src"], Sm = {
	key: 1,
	class: "dui-badge"
}, Cm = {
	key: 1,
	class: "dui-alert dui-alert-info"
}, wm = { class: "dui-card-actions" }, Tm = ["disabled"], Em = {
	key: 2,
	class: "dui-alert"
}, Dm = /* @__PURE__ */ L({
	__name: "QuickCareerPanel",
	props: {
		careers: {},
		finalCareer: {}
	},
	emits: ["clearCareers"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (B(), H(pd, {
			description: "Quick Build keeps one chosen Career chain instead of a manual queue.",
			number: "2",
			title: "Career"
		}, {
			default: I(() => [
				e.finalCareer ? (B(), V("article", vm, [e.finalCareer.img ? (B(), V("div", ym, [U("div", bm, [U("img", {
					src: e.finalCareer.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "56",
					width: "56"
				}, null, 8, xm)])])) : (B(), V("span", Sm, A(F(Xd)(e.finalCareer.name)), 1)), U("div", null, [
					U("strong", null, A(e.finalCareer.name), 1),
					U("span", null, [G(A(e.finalCareer.careerGroup || "Career") + " ", 1), e.finalCareer.level === null ? K("", !0) : (B(), V(z, { key: 0 }, [G(" level " + A(e.finalCareer.level), 1)], 64))]),
					U("small", null, A(F(Jd)(e.finalCareer)), 1)
				])])) : K("", !0),
				e.careers.length > 1 ? (B(), V("div", Cm, [U("span", null, A(e.careers.length - 1) + " lower-tier Career" + A(e.careers.length === 2 ? "" : "s"), 1), U("span", null, "Included before " + A(e.finalCareer?.name) + ".", 1)])) : K("", !0),
				U("div", wm, [U("button", {
					class: "dui-btn dui-btn-sm",
					disabled: !e.careers.length,
					type: "button",
					onClick: r[0] ||= (e) => n("clearCareers")
				}, " Clear Career ", 8, Tm)]),
				e.careers.length ? K("", !0) : (B(), V("p", Em, "No Career selected."))
			]),
			_: 1
		}));
	}
}), Om = {
	key: 0,
	class: "dui-fieldset"
}, km = { class: "dui-fieldset-legend" }, Am = { class: "dui-card-actions" }, jm = ["aria-pressed", "onClick"], Mm = /* @__PURE__ */ L({
	__name: "TraitButtonGroup",
	props: {
		caption: {},
		title: {},
		traits: {}
	},
	emits: ["toggleTrait"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => e.traits.length ? (B(), V("fieldset", Om, [U("legend", km, [U("span", null, A(e.title), 1), U("span", null, A(e.caption), 1)]), U("div", Am, [(B(!0), V(z, null, R(e.traits, (e) => (B(), V("button", {
			key: e.uuid,
			"aria-pressed": e.isSelected,
			class: k(["dui-btn dui-btn-sm", { "dui-btn-active": e.isSelected }]),
			type: "button",
			onClick: (t) => n("toggleTrait", e)
		}, A(e.name), 11, jm))), 128))])])) : K("", !0);
	}
});
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/errors.ts
function Nm(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not resolve that Actor drop.";
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/useBaseActorSelection.ts
function Pm(e, t) {
	let n = Au(), { baseActors: r, selectedBaseActorUuid: i } = xs(n), a = /* @__PURE__ */ P(""), o = q(() => {
		let e = a.value.trim().toLocaleLowerCase();
		return e ? r.value.filter((t) => t.name.toLocaleLowerCase().includes(e)) : r.value;
	}), s = q({
		get: () => i.value,
		set: (e) => {
			n.selectBaseActorUuid(e);
		}
	});
	async function c(r) {
		t.value = "";
		try {
			n.selectBaseActor(await e.resolveActorDrop(r));
		} catch (e) {
			t.value = Nm(e);
		}
	}
	return {
		actorFilter: a,
		filteredActors: o,
		handleActorDrop: c,
		selectedBaseActorSelectValue: s
	};
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/useBuildPreview.ts
function Fm() {
	let { advancements: e, careers: t, finalPortraitPath: n, selectedBaseActor: r, trappings: i } = xs(Au()), a = q(() => {
		let e = 0;
		for (let n of t.value) e += n.quantity;
		return e;
	}), o = q(() => i.value.filter((e) => !e.ignored).length), s = q(() => e.value.filter((e) => e.current !== e.careerValue).length), c = q(() => i.value.filter((e) => !e.ignored && e.resolution.status === "fallback").length), l = q(() => i.value.filter((e) => e.ignored).length), u = q(() => e.value.filter((e) => e.kind === "skill" && zs(e.name) !== null).length), d = q(() => i.value.filter((e) => !e.ignored && e.resolution.status === "unresolved").length), f = q(() => {
		let e = [];
		return r.value || e.push("Choose a base Actor before building."), t.value.length || e.push("No Careers are queued."), u.value && e.push(`${u.value} skill rows still need a specialization.`), d.value && e.push(`${d.value} trappings have no item resolution yet.`), n.value || e.push("No portrait is selected."), e;
	});
	return {
		buildPreviewStatus: q(() => f.value.length ? "Review" : "Ready"),
		buildPreviewWarnings: f,
		careerItemCount: a,
		editedAdvanceCount: s,
		fallbackTrappingCount: c,
		ignoredTrappingCount: l,
		visibleTrappingCount: o
	};
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/useBuildTraits.ts
function Im() {
	let e = Au(), { optionalTraits: t, quickTraits: n, traits: r } = xs(e), i = q(() => new Set(r.value.map((e) => Lm(e.name)))), a = q(() => t.value.map(s)), o = q(() => {
		let e = new Set(t.value.map((e) => Lm(e.name)));
		return n.value.filter((t) => !e.has(Lm(t.name))).map(s);
	});
	function s(e) {
		return {
			...e,
			isSelected: i.value.has(Lm(e.name))
		};
	}
	function c(t) {
		let n = i.value.has(Lm(t.name));
		e.setQuickTraitSelected(t, !n);
	}
	function l(t) {
		let n = i.value.has(Lm(t.name));
		e.setOptionalTraitSelected(t, !n);
	}
	return {
		displayedQuickTraitOptions: o,
		optionalTraitOptions: a,
		toggleOptionalTrait: l,
		toggleQuickTrait: c
	};
}
function Lm(e) {
	return e.trim().toLocaleLowerCase();
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/useCareerQueue.ts
function Rm() {
	let e = Au(), t = /* @__PURE__ */ P(null), n = /* @__PURE__ */ P(null);
	function r(t, n) {
		let r = n.target;
		r && e.setCareerQuantity(t, Number(r.value));
	}
	function i(e, r) {
		t.value = e, n.value = e, r.dataTransfer?.setData("text/plain", `npc-builder-career:${e}`), r.dataTransfer && (r.dataTransfer.effectAllowed = "move");
	}
	function a(e, t) {
		t.preventDefault(), t.stopPropagation(), n.value = e, t.dataTransfer && (t.dataTransfer.dropEffect = "move");
	}
	function o(n, r) {
		r.preventDefault(), r.stopPropagation(), t.value !== null && e.moveCareerToIndex(t.value, n), s();
	}
	function s() {
		t.value = null, n.value = null;
	}
	function c(e) {
		n.value = e;
	}
	function l(t, n) {
		e.moveCareer(t, n);
	}
	function u(t) {
		e.removeCareer(t);
	}
	return {
		clearCareerDragState: s,
		draggedCareerIndex: t,
		dragOverCareerIndex: n,
		handleCareerDragOver: a,
		handleCareerDragStart: i,
		handleCareerDrop: o,
		moveCareer: l,
		removeCareer: u,
		setCareerQuantity: r,
		setDragOverCareerIndex: c
	};
}
//#endregion
//#region src/functions/npc-builder/portrait-candidates.ts
var zm = sl;
function Bm(e) {
	let t = [];
	for (let n of [...e.careers].reverse()) n.img && t.push({
		img: n.img,
		key: `career:${n.uuid}`,
		label: `${n.name} icon`,
		source: "career",
		sourceGroup: "career",
		sourceLabel: "Career"
	});
	return e.selectedBaseActor?.img && t.push({
		img: e.selectedBaseActor.img,
		key: `base-actor:${e.selectedBaseActor.uuid}`,
		label: `${e.selectedBaseActor.name} image`,
		source: "base-actor",
		sourceGroup: "world",
		sourceLabel: "Base Actor"
	}), e.selectedBaseActor?.prototypeTokenImg && e.selectedBaseActor.prototypeTokenImg !== e.selectedBaseActor.img && t.push({
		img: e.selectedBaseActor.prototypeTokenImg,
		key: `base-token:${e.selectedBaseActor.uuid}`,
		label: `${e.selectedBaseActor.name} token`,
		source: "base-token",
		sourceGroup: "world",
		sourceLabel: "Base Token"
	}), Zc(t);
}
function Vm(e) {
	let t = [];
	e.selectedBaseActor && t.push(e.selectedBaseActor.species, e.selectedBaseActor.name);
	for (let n of e.careers) t.push(n.name, n.careerGroup);
	return ll(t);
}
//#endregion
//#region src/state/portrait-gallery/workflow.ts
function Hm(e) {
	let t = /* @__PURE__ */ P([]), n = /* @__PURE__ */ P(null), r = /* @__PURE__ */ P(!1), i = /* @__PURE__ */ P(null), a = 0, o = q(() => Um([...e.baseSearchTerms.value, ...e.filterState.customPortraitSearchTerms.value])), s = q(() => x("search")), c = q(() => x("must-include")), l = q(() => x("must-exclude")), u = q(() => Um([...s.value, ...c.value])), d = q(() => n.value ?? Qc({
		assetCandidates: t.value,
		immediateCandidates: e.immediateCandidates.value,
		selectedPortraitPath: e.pinnedPortraitPath.value
	})), f = q(() => Jc(d.value)), p = q(() => [...o.value.flatMap(S), ...f.value.map(C)]), m = q(() => d.value.filter((e) => ml(e, {
		mustExcludeSources: w("must-exclude"),
		mustExcludeTerms: l.value,
		mustIncludeSources: w("must-include"),
		mustIncludeTerms: c.value
	}))), h = q(() => m.value.find((t) => t.img === e.activePortraitPath.value) ?? null), g = q(() => h.value?.key ?? ""), _ = q(() => yl(i.value)), v = q(() => vl(i.value));
	Gn(o, (t) => e.filterState.retainAvailablePortraitFilterTerms(t), { immediate: !0 }), Gn(() => [
		e.hasSubject.value,
		e.includeCompendiumAssets.value,
		e.includeFilePickerAssets.value,
		e.excludeFullyTransparentImages.value,
		e.excludedReferenceImagePaths.value.join("|"),
		e.priorityFolderPaths.value.join("|"),
		e.immediateCandidates.value.map(({ img: e }) => e).join("|"),
		e.baseSearchTerms.value.join("|"),
		e.filterState.customPortraitSearchTerms.value.join("|"),
		u.value.join("|"),
		l.value.join("|")
	], (e, t, n) => {
		a += 1;
		let r = setTimeout(() => void b(), 150);
		n(() => clearTimeout(r));
	}, { immediate: !0 });
	function y(t, n) {
		if (t.kind === "source") {
			e.filterState.setPortraitSourceTagSection(t.value, n);
			return;
		}
		e.filterState.setPortraitTermSection(t.value, n);
	}
	async function b() {
		let o = a + 1;
		a = o;
		let s = e.hasSubject.value, d = _l({
			hasEnabledSource: e.includeCompendiumAssets.value || e.includeFilePickerAssets.value || e.priorityFolderPaths.value.length > 0,
			hasSubject: s,
			searchTerms: u.value
		});
		if (!s) {
			t.value = [], n.value = [], r.value = !1, i.value = null;
			return;
		}
		r.value = !0, t.value = [], n.value = null, i.value = {
			candidatesFound: 0,
			currentLocation: "Preparing portrait search",
			directoriesVisited: 0,
			maxDirectories: 0,
			phase: "world-documents"
		};
		try {
			let r = (e) => {
				a === o && (i.value = e);
			}, s = d ? await e.provider.listPortraitCandidates({
				includeCompendiumAssets: e.includeCompendiumAssets.value,
				includeFilePickerAssets: e.includeFilePickerAssets.value,
				mustExcludeTerms: l.value,
				mustIncludeTerms: c.value,
				priorityFolderPaths: e.priorityFolderPaths.value,
				searchTerms: u.value
			}, r) : [], f = Qc({
				assetCandidates: s,
				immediateCandidates: e.immediateCandidates.value,
				selectedPortraitPath: e.pinnedPortraitPath.value
			}), p = await e.provider.filterPortraitCandidates(f, {
				excludeFullyTransparentImages: e.excludeFullyTransparentImages.value,
				excludedReferenceImagePaths: e.excludedReferenceImagePaths.value
			}, r);
			a === o && (t.value = s, n.value = p);
		} catch (t) {
			a === o && (e.errorMessage.value = t instanceof Error ? t.message : e.searchErrorMessage);
		} finally {
			a === o && (r.value = !1);
		}
	}
	return {
		activePortraitSearchTerms: u,
		addPortraitSearchTerm: e.filterState.addCustomPortraitSearchTerm,
		isLoadingPortraitCandidates: r,
		portraitCandidates: m,
		portraitFilterTags: p,
		portraitSearchProgress: i,
		portraitSearchProgressLabel: _,
		portraitSearchProgressValue: v,
		portraitSearchTerms: o,
		selectedPortraitCandidate: h,
		selectedPortraitCandidateKey: g,
		selectPortrait: e.selectPortrait,
		setPortraitFilterTagSection: y
	};
	function x(t) {
		return fl(o.value, e.filterState.portraitTermSections.value, t);
	}
	function S(t) {
		let n = e.filterState.portraitTermSections.value[t] ?? "search";
		return n === "removed" ? [] : [{
			canRemove: !0,
			id: `term:${t}`,
			kind: "term",
			label: t,
			section: n,
			value: t
		}];
	}
	function C(t) {
		return {
			canRemove: !1,
			id: `source:${t.value}`,
			kind: "source",
			label: `Sourced From ${t.label}`,
			section: e.filterState.portraitSourceTagSections.value[t.value] ?? "search",
			value: t.value
		};
	}
	function w(t) {
		return f.value.filter((n) => (e.filterState.portraitSourceTagSections.value[n.value] ?? "search") === t).map((e) => e.value);
	}
}
function Um(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/state/npc-builder/workflows/portrait-candidates-workflow.ts
function Wm(e, t) {
	let n = Au(), { careers: r, customPortraitSearchTerms: i, finalPortraitPath: a, portraitSourceTagSections: o, portraitTermSections: s, selectedBaseActor: c, selectedPortraitPath: l, settings: u } = xs(n), d = q(() => Bm({
		careers: r.value,
		selectedBaseActor: c.value
	})), f = q(() => Vm({
		careers: r.value,
		selectedBaseActor: c.value
	})), p = q(() => dl({
		configuredFolders: u.value.prioritizedPortraitFolders,
		hasCareer: r.value.length > 0
	})), m = Hm({
		activePortraitPath: a,
		baseSearchTerms: f,
		errorMessage: t,
		excludeFullyTransparentImages: q(() => u.value.excludeFullyTransparentPortraitAssets),
		excludedReferenceImagePaths: q(() => u.value.excludedPortraitReferenceImages),
		filterState: {
			addCustomPortraitSearchTerm: n.addCustomPortraitSearchTerm,
			customPortraitSearchTerms: i,
			portraitSourceTagSections: o,
			portraitTermSections: s,
			retainAvailablePortraitFilterTerms: n.retainAvailablePortraitFilterTerms,
			setPortraitSourceTagSection: n.setPortraitSourceTagSection,
			setPortraitTermSection: n.setPortraitTermSection
		},
		hasSubject: q(() => !!c.value || r.value.length > 0),
		immediateCandidates: d,
		includeCompendiumAssets: q(() => u.value.searchCompendiumPortraitAssets),
		includeFilePickerAssets: q(() => u.value.searchFoundryPortraitAssets),
		pinnedPortraitPath: l,
		priorityFolderPaths: p,
		provider: {
			filterPortraitCandidates: e.filterPortraitCandidates,
			listPortraitCandidates: e.listFoundryPortraitCandidates
		},
		searchErrorMessage: "The NPC Builder could not finish searching for portraits.",
		selectPortrait: (e) => n.selectPortrait(e.img)
	}), h = q(() => m.portraitCandidates.value.slice(0, 4)), g = q(() => Math.max(0, m.portraitCandidates.value.length - h.value.length));
	return {
		...m,
		compactPortraitCandidates: h,
		hiddenPortraitCandidateCount: g
	};
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/usePortraitCandidates.ts
function Gm(e, t) {
	let n = Wm(e, t), r = /* @__PURE__ */ P(!1);
	function i(e) {
		n.selectPortrait(e);
	}
	return {
		...n,
		isPortraitGalleryOpen: r,
		selectPortraitFromGallery: i
	};
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab.vue?vue&type=script&setup=true&lang.ts
var Km = { class: "app:grid app:gap-3" }, qm = { class: "app:grid app:items-start app:gap-3 md:app:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]" }, Jm = { class: "app:grid app:min-w-0 app:gap-3" }, Ym = /* @__PURE__ */ L({
	__name: "NpcBuilderBuildTab",
	props: {
		bridge: {},
		isLoadingActors: { type: Boolean },
		isLoadingBaseDraft: { type: Boolean },
		page: {}
	},
	setup(e) {
		let t = e, n = Au(), { actorName: r, advancements: i, careers: a, estimatedNpcXp: o, finalActorName: s, finalCareer: c, finalPortraitPath: l, grantTotals: u, selectedBaseActor: d, selectedSpells: f, suggestedActorName: p, traits: m } = xs(n), h = /* @__PURE__ */ P(""), { actorFilter: g, filteredActors: _, selectedBaseActorSelectValue: v } = Pm(t.bridge, h), { clearCareerDragState: y, draggedCareerIndex: b, dragOverCareerIndex: x, handleCareerDragOver: S, handleCareerDragStart: C, handleCareerDrop: w, moveCareer: ee, removeCareer: te, setCareerQuantity: ne, setDragOverCareerIndex: re } = Rm(), { displayedQuickTraitOptions: T, optionalTraitOptions: E, toggleOptionalTrait: ie, toggleQuickTrait: ae } = Im(), { buildPreviewStatus: D, buildPreviewWarnings: oe, careerItemCount: O, editedAdvanceCount: se, fallbackTrappingCount: ce, ignoredTrappingCount: le, visibleTrappingCount: ue } = Fm(), { addPortraitSearchTerm: de, compactPortraitCandidates: fe, hiddenPortraitCandidateCount: pe, isLoadingPortraitCandidates: me, isPortraitGalleryOpen: he, portraitCandidates: ge, portraitFilterTags: k, portraitSearchProgress: _e, portraitSearchProgressLabel: ve, portraitSearchProgressValue: ye, portraitSearchTerms: be, selectedPortraitCandidate: xe, selectedPortraitCandidateKey: Se, selectPortrait: Ce, selectPortraitFromGallery: A, setPortraitFilterTagSection: we } = Gm(t.bridge, h);
		return (t, Te) => (B(), V("section", Km, [U("div", qm, [U("div", Jm, [
			e.page === "build-quick" || e.page === "build-actor" ? (B(), H(uf, {
				key: 0,
				"actor-filter": F(g),
				description: e.page === "build-quick" ? "Choose the base statblock for this fast NPC draft." : "Choose the base statblock before reviewing detailed build pages.",
				"error-message": h.value,
				"filtered-actors": F(_),
				"is-loading-actors": e.isLoadingActors,
				"is-loading-base-draft": e.isLoadingBaseDraft,
				number: e.page === "build-quick" ? "1" : "",
				"selected-base-actor": F(d),
				"selected-base-actor-uuid": F(v),
				onActorFilterChange: Te[0] ||= (e) => g.value = e,
				onBaseActorChange: Te[1] ||= (e) => v.value = e
			}, null, 8, [
				"actor-filter",
				"description",
				"error-message",
				"filtered-actors",
				"is-loading-actors",
				"is-loading-base-draft",
				"number",
				"selected-base-actor",
				"selected-base-actor-uuid"
			])) : K("", !0),
			e.page === "build-quick" ? (B(), H(Dm, {
				key: 1,
				careers: F(a),
				"final-career": F(c),
				onClearCareers: F(n).clearCareers
			}, null, 8, [
				"careers",
				"final-career",
				"onClearCareers"
			])) : K("", !0),
			e.page === "build-quick" ? (B(), H(pd, {
				key: 2,
				description: "Apply optional base traits and configured quick traits to the draft.",
				number: "3",
				title: "Quick Traits"
			}, {
				default: I(() => [W(Mm, {
					caption: `${F(E).length} from base statblock`,
					traits: F(E),
					title: "Optional Traits",
					onToggleTrait: F(ie)
				}, null, 8, [
					"caption",
					"traits",
					"onToggleTrait"
				]), W(Mm, {
					caption: `${F(T).length} configured`,
					traits: F(T),
					title: "Quick Traits",
					onToggleTrait: F(ae)
				}, null, 8, [
					"caption",
					"traits",
					"onToggleTrait"
				])]),
				_: 1
			})) : K("", !0),
			e.page === "build-careers" ? (B(), H(Ip, {
				key: 3,
				careers: F(a),
				"drag-over-career-index": F(x),
				"dragged-career-index": F(b),
				onCareerDragEnd: F(y),
				onCareerDragEnter: F(re),
				onCareerDragOver: F(S),
				onCareerDragStart: F(C),
				onCareerDropOnRow: F(w),
				onCareerQuantityInput: F(ne),
				onMoveCareer: F(ee),
				onRemoveCareer: F(te)
			}, null, 8, [
				"careers",
				"drag-over-career-index",
				"dragged-career-index",
				"onCareerDragEnd",
				"onCareerDragEnter",
				"onCareerDragOver",
				"onCareerDragStart",
				"onCareerDropOnRow",
				"onCareerQuantityInput",
				"onMoveCareer",
				"onRemoveCareer"
			])) : K("", !0)
		]), W(fp, {
			class: "app:min-w-0",
			"actor-name": F(r),
			"advancement-count": F(i).length,
			"build-preview-status": F(D),
			"build-preview-warnings": F(oe),
			"career-item-count": F(O),
			"compact-portrait-candidates": F(fe),
			"edited-advance-count": F(se),
			"estimated-npc-xp": F(o),
			"fallback-trapping-count": F(ce),
			"final-actor-name": F(s),
			"final-career": F(c),
			"final-portrait-path": F(l),
			"grant-totals": F(u),
			"hidden-portrait-candidate-count": F(pe),
			"ignored-trapping-count": F(le),
			"is-loading-portrait-candidates": F(me),
			"portrait-candidates": F(ge),
			"portrait-search-progress": F(_e),
			"portrait-search-progress-label": F(ve),
			"portrait-search-progress-value": F(ye),
			"selected-base-actor": F(d),
			"selected-portrait-candidate": F(xe),
			"selected-portrait-candidate-key": F(Se),
			"selected-spell-count": F(f).length,
			"suggested-actor-name": F(p),
			"trait-count": F(m).length,
			"visible-trapping-count": F(ue),
			onActorNameChange: Te[2] ||= (e) => r.value = e,
			onOpenPortraitGallery: Te[3] ||= (e) => he.value = !0,
			onSelectPortrait: F(Ce)
		}, null, 8, /* @__PURE__ */ "actor-name.advancement-count.build-preview-status.build-preview-warnings.career-item-count.compact-portrait-candidates.edited-advance-count.estimated-npc-xp.fallback-trapping-count.final-actor-name.final-career.final-portrait-path.grant-totals.hidden-portrait-candidate-count.ignored-trapping-count.is-loading-portrait-candidates.portrait-candidates.portrait-search-progress.portrait-search-progress-label.portrait-search-progress-value.selected-base-actor.selected-portrait-candidate.selected-portrait-candidate-key.selected-spell-count.suggested-actor-name.trait-count.visible-trapping-count.onSelectPortrait".split("."))]), W(_m, {
			"is-loading-portrait-candidates": F(me),
			open: F(he),
			"portrait-candidates": F(ge),
			"portrait-filter-tags": F(k),
			"portrait-search-progress-label": F(ve),
			"portrait-search-progress-value": F(ye),
			"portrait-search-terms": F(be),
			"selected-portrait-candidate-key": F(Se),
			onCreateSearchTerm: F(de),
			onClose: Te[4] ||= (e) => he.value = !1,
			onFilterTagSectionChange: F(we),
			onSelectPortrait: F(A)
		}, null, 8, [
			"is-loading-portrait-candidates",
			"open",
			"portrait-candidates",
			"portrait-filter-tags",
			"portrait-search-progress-label",
			"portrait-search-progress-value",
			"portrait-search-terms",
			"selected-portrait-candidate-key",
			"onCreateSearchTerm",
			"onFilterTagSectionChange",
			"onSelectPortrait"
		])]));
	}
}), Xm = {
	Average: "avg",
	Enormous: "enor",
	Large: "lrg",
	Little: "ltl",
	Monstrous: "mnst",
	Small: "sml",
	Tiny: "tiny"
}, Zm = new Set(["bestial", "skittish"]);
function Qm(e) {
	let t = e.some((e) => rh(e, "skittish")), n = e.some((e) => ih(e, "trained", "war")), r = oh(e.filter((e) => rh(e, "weapon")));
	return e.map((e) => {
		let i = eh(e.name);
		return Zm.has(i) ? nh(e, `${e.name} is removed from combined mounts.`) : i === "weapon" ? !n || t ? nh(e, "Weapon requires Trained (War) and a mount that was not Skittish.") : e.uuid === r ? th(e, "Weapon (Mount)") : nh(e, "Only the strongest Weapon trait is retained for the combined profile.") : th(e, e.damage ? ah(e.name) : e.name);
	});
}
function $m(e) {
	return eh(e) === "armour";
}
function eh(e) {
	return e.trim().replace(/\s*\(mount\)\s*$/i, "").toLocaleLowerCase();
}
function th(e, t) {
	return {
		fixedDamage: e.fixedDamage,
		included: !0,
		name: e.name,
		outputName: t,
		reason: "",
		sourceUuid: e.uuid
	};
}
function nh(e, t) {
	return {
		fixedDamage: e.fixedDamage,
		included: !1,
		name: e.name,
		outputName: "",
		reason: t,
		sourceUuid: e.uuid
	};
}
function rh(e, t) {
	return eh(e.name) === t;
}
function ih(e, t, n) {
	return rh(e, t) ? e.specification.trim().toLocaleLowerCase() === n : e.name.trim().toLocaleLowerCase() === `${t} (${n})`;
}
function ah(e) {
	return /\(mount\)\s*$/i.test(e.trim()) ? e.trim() : `${e.trim()} (Mount)`;
}
function oh(e) {
	return [...e].sort((e, t) => (t.fixedDamage ?? 0) - (e.fixedDamage ?? 0) || e.uuid.localeCompare(t.uuid))[0]?.uuid ?? "";
}
//#endregion
//#region src/functions/npc-builder/combined-profile/calculate.ts
var sh = [
	Xm.Tiny,
	Xm.Little,
	Xm.Small,
	Xm.Average,
	Xm.Large,
	Xm.Enormous,
	Xm.Monstrous
], ch = {
	[Xm.Average]: "Average",
	[Xm.Enormous]: "Enormous",
	[Xm.Large]: "Large",
	[Xm.Little]: "Little",
	[Xm.Monstrous]: "Monstrous",
	[Xm.Small]: "Small",
	[Xm.Tiny]: "Tiny"
};
function lh(e, t) {
	return {
		chargeStrengthBonus: Math.max(t.characteristics.strengthBonus - e.characteristics.strengthBonus, 0),
		initiative: Math.max(e.characteristics.initiative, t.characteristics.initiative),
		movement: t.movement,
		size: dh(e.size, t.size),
		strength: e.characteristics.strength,
		toughness: Math.max(e.characteristics.toughness, t.characteristics.toughness),
		traits: Qm(t.traits),
		wounds: uh(e.wounds, t.wounds)
	};
}
function uh(e, t) {
	return Math.max(1, Math.max(e, t) + Math.ceil(Math.min(e, t) * .25));
}
function dh(e, t) {
	return fh(t) > fh(e) ? t : e;
}
function fh(e) {
	return sh.indexOf(e);
}
//#endregion
//#region src/functions/npc-builder/combined-profile/trait-source.ts
function ph({ flagScope: e, mount: t, plan: n, rider: r }) {
	let i = "Combined Profile";
	return {
		effects: [{
			changes: [],
			disabled: !1,
			flags: { [e]: { generatedCombinedProfileEffect: !0 } },
			img: t.img || "icons/svg/wing.svg",
			name: i,
			system: {
				scriptData: mh(e, n),
				transferData: {
					documentType: "Actor",
					type: "document"
				}
			},
			transfer: !0
		}],
		flags: { [e]: { generatedCombinedProfileTrait: {
			mountUuid: t.uuid,
			riderUuid: r.uuid
		} } },
		img: t.img || "icons/svg/wing.svg",
		name: i,
		system: {
			description: { value: gh(r, t, n) },
			specification: { value: `${r.name} + ${t.name}` }
		},
		type: "trait"
	};
}
function mh(e, t) {
	let n = [{
		label: "Combined Profile Wounds",
		script: ["// Generated by Drowsy's WFRP4e Customizers.", `args.wounds = ${t.wounds};`].join("\n"),
		trigger: "woundCalc"
	}, {
		label: "Combined Profile Size",
		script: ["// Generated by Drowsy's WFRP4e Customizers.", `args.size = ${JSON.stringify(t.size)};`].join("\n"),
		trigger: "calculateSize"
	}];
	return t.chargeStrengthBonus > 0 && n.push({
		label: "Combined Profile Charge",
		script: hh(e, t.chargeStrengthBonus),
		trigger: "preRollTest"
	}), n;
}
function hh(e, t) {
	return [
		"// Generated by Drowsy's WFRP4e Customizers.",
		"const test = args.test;",
		"const attackType = test.item?.attackType || test.item?.system?.attackType || test.item?.system?.rollable?.attackType;",
		`const isMountAttack = Boolean(test.item?.flags?.[${JSON.stringify(e)}]?.generatedMountTrait);`,
		"",
		"if (!test.preData.charging || attackType !== \"melee\" || isMountAttack) {",
		"  return;",
		"}",
		"",
		`test.preData.additionalDamage = Number(test.preData.additionalDamage || 0) + ${t};`,
		"test.preData.other ||= [];",
		`test.preData.other.push("Combined Profile: +${t} mount Strength Bonus on the charge");`
	].join("\n");
}
function gh(e, t, n) {
	return [
		"<p>Generated by Drowsy's WFRP4e Customizers. This Actor combines a rider and mount into one simplified NPC profile.</p>",
		`<p><strong>Rider:</strong> ${_h(e.name)}<br><strong>Mount:</strong> ${_h(t.name)}</p>`,
		`<p><strong>Movement:</strong> ${n.movement}; <strong>Wounds:</strong> ${n.wounds}; <strong>Charge SB:</strong> +${n.chargeStrengthBonus}.</p>`,
		"<p>Mount attack Traits use fixed damage captured from the mount. Skittish and Bestial are removed.</p>"
	].join("");
}
function _h(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
//#endregion
//#region src/types/foundry/document-drop.ts
var vh = "wfrp4e-customizer-apps.document-drop", yh = { class: "dui-list" }, bh = [
	"aria-label",
	"disabled",
	"title",
	"onClick"
], xh = ["src"], Sh = {
	key: 1,
	"aria-hidden": "true",
	class: "fa-solid fa-scroll"
}, Ch = {
	key: 1,
	class: "dui-list-row"
}, wh = /* @__PURE__ */ L({
	__name: "DocumentList",
	props: {
		documents: {},
		emptyLabel: {},
		isClickable: { type: Boolean }
	},
	emits: ["documentClicked"],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			e.uuid && n("documentClicked", e);
		}
		return (t, n) => (B(), V("ul", yh, [e.documents.length > 0 ? (B(!0), V(z, { key: 0 }, R(e.documents, (t) => (B(), V("li", {
			key: t.uuid,
			class: "dui-list-row"
		}, [U("button", {
			"aria-label": e.isClickable ? `Use ${t.name}` : void 0,
			class: "dui-btn dui-btn-ghost",
			disabled: !e.isClickable,
			title: e.isClickable ? t.name : void 0,
			type: "button",
			onClick: No((e) => r(t), ["stop"])
		}, [t.img ? (B(), V("img", {
			key: 0,
			alt: "",
			"aria-hidden": "true",
			src: t.img
		}, null, 8, xh)) : (B(), V("i", Sh)), U("span", null, A(t.name), 1)], 8, bh)]))), 128)) : (B(), V("li", Ch, [n[0] ||= U("i", {
			"aria-hidden": "true",
			class: "fa-solid fa-arrow-down"
		}, null, -1), U("span", null, A(e.emptyLabel), 1)]))]));
	}
}), Th = { class: "dui-card-body dui-fieldset" }, Eh = ["for"], Dh = ["id", "value"], Oh = ["for"], kh = ["id", "value"], Ah = { class: "dui-card-actions" }, jh = /* @__PURE__ */ L({
	__name: "ManualEntryForm",
	props: {
		documentType: {},
		documentValue: {},
		isPickingDocument: { type: Boolean }
	},
	emits: [
		"close",
		"startPick",
		"submit",
		"updateDocumentType",
		"updateDocumentValue"
	],
	setup(e, { emit: t }) {
		let n = t, r = $n(), i = $n();
		function a(e) {
			let t = e.target instanceof HTMLSelectElement ? e.target.value : "auto";
			(t === "Actor" || t === "auto" || t === "Item" || t === "JournalEntry" || t === "JournalEntryPage") && n("updateDocumentType", t);
		}
		function o(e) {
			n("updateDocumentValue", e.target instanceof HTMLInputElement ? e.target.value : "");
		}
		return (t, s) => (B(), V("form", {
			class: "dui-card dui-card-border dui-card-sm",
			onClick: s[2] ||= No(() => {}, ["stop"]),
			onSubmit: s[3] ||= No((e) => n("submit"), ["prevent"])
		}, [U("fieldset", Th, [
			s[6] ||= U("legend", { class: "dui-fieldset-legend" }, "Manual document entry", -1),
			U("label", {
				class: "dui-label",
				for: F(r)
			}, "Document type", 8, Eh),
			U("select", {
				id: F(r),
				class: "dui-select",
				value: e.documentType,
				onChange: a
			}, [...s[4] ||= [ia("<option value=\"auto\">Auto</option><option value=\"Item\">Item</option><option value=\"Actor\">Actor</option><option value=\"JournalEntry\">Journal Entry</option><option value=\"JournalEntryPage\">Journal Page</option>", 5)]], 40, Dh),
			U("label", {
				class: "dui-label",
				for: F(i)
			}, "UUID or drop JSON", 8, Oh),
			U("input", {
				id: F(i),
				class: "dui-input",
				value: e.documentValue,
				placeholder: "Compendium.package.pack.id",
				type: "text",
				onInput: o
			}, null, 40, kh),
			U("div", Ah, [
				s[5] ||= U("button", {
					class: "dui-btn dui-btn-primary",
					type: "submit"
				}, "Use", -1),
				U("button", {
					class: "dui-btn",
					type: "button",
					onClick: s[0] ||= (e) => n("startPick")
				}, A(e.isPickingDocument ? "Waiting..." : "Pick Next Click"), 1),
				U("button", {
					class: "dui-btn dui-btn-ghost",
					type: "button",
					onClick: s[1] ||= (e) => n("close")
				}, "Cancel")
			])
		])], 32));
	}
}), Mh = ["aria-label", "aria-disabled"], Nh = { key: 0 }, Ph = {
	key: 1,
	class: "dui-alert dui-alert-info",
	role: "status"
}, Fh = { key: 2 }, Ih = {
	key: 4,
	class: "dui-card-actions"
}, Lh = ["disabled"], Rh = /* @__PURE__ */ L({
	inheritAttrs: !1,
	__name: "DocumentDrop",
	props: {
		description: { default: "" },
		disabled: {
			type: Boolean,
			default: !1
		},
		documents: { default: () => [] },
		documentsClickable: {
			type: Boolean,
			default: !1
		},
		emptyDocumentLabel: { default: "No document selected." },
		manualEntryTrigger: { default: "button" },
		showDocuments: {
			type: Boolean,
			default: !1
		},
		showPrompt: {
			type: Boolean,
			default: !0
		},
		title: {},
		variant: { default: "default" }
	},
	emits: ["documentClicked", "dropData"],
	setup(e, { emit: t }) {
		let n = e, r = Vn(vh);
		if (!r) throw Error("DocumentDrop requires a document drop bridge from its application host.");
		let i = Ar(), a = t, o = /* @__PURE__ */ P(!1), s = /* @__PURE__ */ P(!1), c = /* @__PURE__ */ P(!1), l = /* @__PURE__ */ P("auto"), u = /* @__PURE__ */ P(""), d, f = q(() => !!i.prompt), p = q(() => !!i.default), m = q(() => n.showPrompt && (f.value || n.title.length > 0)), h = q(() => n.showDocuments ? n.documents : []), g = q(() => n.manualEntryTrigger === "button"), _ = q(() => n.variant === "bare" ? [] : [
			"dui-card",
			"dui-card-border",
			n.variant === "compact" ? "dui-card-xs" : "dui-card-sm"
		]);
		function v(e) {
			let t = e.currentTarget, n = e.relatedTarget;
			t instanceof Node && n instanceof Node && t.contains(n) || (o.value = !1);
		}
		function y() {
			n.disabled || (o.value = !0);
		}
		function b(e) {
			e.preventDefault(), e.stopPropagation(), o.value = !1, !n.disabled && a("dropData", e.dataTransfer?.getData("text/plain") ?? "");
		}
		function x() {
			n.manualEntryTrigger !== "none" && (s.value = !0);
		}
		function S() {
			s.value = !1, te();
		}
		function C() {
			if (!n.disabled) {
				if (s.value) {
					S();
					return;
				}
				x();
			}
		}
		function w() {
			if (n.disabled) return;
			let e = r.createDropData({
				documentType: l.value,
				value: u.value
			});
			e && (a("dropData", e), u.value = "", S());
		}
		function ee() {
			n.disabled || d || (c.value = !0, d = r.startDocumentPick(ne));
		}
		function te() {
			let e = d;
			d = void 0, c.value = !1, e?.();
		}
		function ne(e) {
			a("dropData", e), S();
		}
		return _r(() => {
			te();
		}), Gn(() => n.disabled, (e) => {
			e && (o.value = !1, S());
		}), (t, n) => (B(), V("div", ca(t.$attrs, {
			class: _.value,
			"aria-label": e.title,
			"aria-disabled": e.disabled,
			role: "group",
			onDragenter: No(y, ["prevent"]),
			onDragover: No(y, ["prevent"]),
			onDragleave: v,
			onDrop: b
		}), [U("div", { class: k(e.variant === "bare" ? void 0 : "dui-card-body") }, [
			m.value ? (B(), V("div", {
				key: 0,
				class: k(["dui-alert dui-alert-info", { "dui-alert-outline": !o.value }])
			}, [
				n[3] ||= U("i", {
					"aria-hidden": "true",
					class: "fa-solid fa-arrow-down"
				}, null, -1),
				U("div", null, [wr(t.$slots, "prompt", {}, () => [U("strong", null, A(e.title), 1), e.description ? (B(), V("p", Nh, A(e.description), 1)) : K("", !0)])]),
				U("span", { class: k(["dui-badge", { "dui-badge-info": o.value }]) }, A(o.value ? "Release to add" : "Drop zone"), 3)
			], 2)) : o.value ? (B(), V("div", Ph, [n[4] ||= U("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-arrow-down"
			}, null, -1), U("span", null, "Release to add " + A(e.title.toLowerCase()) + ".", 1)])) : K("", !0),
			p.value ? (B(), V("div", Fh, [wr(t.$slots, "default")])) : K("", !0),
			e.showDocuments ? (B(), H(wh, {
				key: 3,
				documents: h.value,
				"empty-label": e.emptyDocumentLabel,
				"is-clickable": e.documentsClickable,
				onDocumentClicked: n[0] ||= (e) => a("documentClicked", e)
			}, null, 8, [
				"documents",
				"empty-label",
				"is-clickable"
			])) : K("", !0),
			g.value ? (B(), V("div", Ih, [U("button", {
				class: "dui-btn dui-btn-ghost dui-btn-sm",
				disabled: e.disabled,
				type: "button",
				onClick: No(C, ["stop"])
			}, A(s.value ? "Close Manual Entry" : "Manual Entry"), 9, Lh)])) : K("", !0),
			s.value && !e.disabled ? (B(), H(jh, {
				key: 5,
				"document-type": l.value,
				"document-value": u.value,
				"is-picking-document": c.value,
				onClose: S,
				onStartPick: ee,
				onSubmit: w,
				onUpdateDocumentType: n[1] ||= (e) => l.value = e,
				onUpdateDocumentValue: n[2] ||= (e) => u.value = e
			}, null, 8, [
				"document-type",
				"document-value",
				"is-picking-document"
			])) : K("", !0)
		], 2)], 16, Mh));
	}
});
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp/errors.ts
function zh(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderMountTab/CombinedProfilePreview.vue?vue&type=script&setup=true&lang.ts
var Bh = { class: "app:max-w-full app:overflow-x-auto" }, Vh = { class: "dui-table dui-table-sm" }, Hh = { class: "dui-alert" }, Uh = { class: "app:flex app:flex-wrap app:gap-2" }, Wh = { key: 0 }, Gh = {
	key: 1,
	class: "app:grid app:gap-2"
}, Kh = /* @__PURE__ */ L({
	__name: "CombinedProfilePreview",
	props: {
		mount: {},
		plan: {},
		rider: {}
	},
	setup(e) {
		let t = e, n = q(() => t.plan.traits.filter((e) => e.included)), r = q(() => t.plan.traits.filter((e) => !e.included)), i = q(() => [
			{
				field: "Strength",
				mount: t.mount.characteristics.strength,
				result: t.plan.strength,
				rider: t.rider.characteristics.strength,
				rule: "Rider"
			},
			{
				field: "Toughness",
				mount: t.mount.characteristics.toughness,
				result: t.plan.toughness,
				rider: t.rider.characteristics.toughness,
				rule: "Higher"
			},
			{
				field: "Initiative",
				mount: t.mount.characteristics.initiative,
				result: t.plan.initiative,
				rider: t.rider.characteristics.initiative,
				rule: "Higher"
			},
			{
				field: "Movement",
				mount: t.mount.movement,
				result: t.plan.movement,
				rider: t.rider.movement,
				rule: "Mount"
			},
			{
				field: "Wounds",
				mount: t.mount.wounds,
				result: t.plan.wounds,
				rider: t.rider.wounds,
				rule: "Higher + 25% lower"
			},
			{
				field: "Size",
				mount: ch[t.mount.size],
				result: ch[t.plan.size],
				rider: ch[t.rider.size],
				rule: "Larger"
			}
		]);
		function a(e) {
			return e.fixedDamage === null ? e.outputName : `${e.outputName} (fixed Damage ${e.fixedDamage})`;
		}
		return (t, o) => (B(), V(z, null, [W(pd, {
			description: "This preview uses the Actors' current prepared values. The build recalculates after applying the rider's Career advances.",
			number: "2",
			title: "Combined Profile Preview"
		}, {
			default: I(() => [U("div", Bh, [U("table", Vh, [o[0] ||= U("thead", null, [U("tr", null, [
				U("th", null, "Field"),
				U("th", null, "Rider"),
				U("th", null, "Mount"),
				U("th", null, "Combined"),
				U("th", null, "Rule")
			])], -1), U("tbody", null, [(B(!0), V(z, null, R(i.value, (e) => (B(), V("tr", { key: e.field }, [
				U("th", null, A(e.field), 1),
				U("td", null, A(e.rider), 1),
				U("td", null, A(e.mount), 1),
				U("td", null, A(e.result), 1),
				U("td", null, A(e.rule), 1)
			]))), 128))])])]), U("p", Hh, " Charge attacks gain +" + A(e.plan.chargeStrengthBonus) + " Damage from the mount's Strength Bonus. The combined profile also gains at least Armour (1). ", 1)]),
			_: 1
		}), W(pd, {
			description: "Mount attack damage is frozen before the traits are copied to the rider.",
			number: "3",
			title: "Mount Traits"
		}, {
			default: I(() => [
				U("div", Uh, [(B(!0), V(z, null, R(n.value, (e) => (B(), V("span", {
					key: e.sourceUuid,
					class: "dui-badge dui-badge-sm"
				}, A(a(e)), 1))), 128))]),
				n.value.length ? K("", !0) : (B(), V("p", Wh, "The mount contributes no traits.")),
				r.value.length ? (B(), V("div", Gh, [o[1] ||= U("p", null, [U("strong", null, "Removed or consolidated")], -1), (B(!0), V(z, null, R(r.value, (e) => (B(), V("p", {
					key: e.sourceUuid,
					class: "dui-alert dui-alert-warning"
				}, [U("strong", null, A(e.name) + ":", 1), G(" " + A(e.reason), 1)]))), 128))])) : K("", !0)
			]),
			_: 1
		})], 64));
	}
}), qh = { class: "app:grid app:gap-3" }, Jh = { class: "app:grid app:gap-3 md:app:grid-cols-2" }, Yh = { class: "dui-fieldset" }, Xh = ["for"], Zh = ["id"], Qh = { class: "dui-fieldset" }, $h = ["for"], eg = [
	"id",
	"disabled",
	"value"
], tg = ["value"], ng = {
	key: 0,
	class: "dui-card-actions"
}, rg = {
	key: 1,
	class: "dui-alert dui-alert-warning"
}, ig = {
	key: 2,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, ag = {
	key: 3,
	"aria-live": "polite",
	class: "dui-alert",
	role: "status"
}, og = {
	key: 4,
	class: "dui-alert"
}, sg = {
	key: 0,
	class: "dui-avatar"
}, cg = { class: "app:size-16 app:shrink-0 app:rounded-lg" }, lg = ["src"], ug = /* @__PURE__ */ L({
	__name: "NpcBuilderMountTab",
	props: { bridge: {} },
	setup(e) {
		let t = e, n = Au(), { baseActorCombatProfile: r, mountActorProfile: i, mountActors: a, selectedBaseActorUuid: o, selectedMountActorUuid: s } = xs(n), c = /* @__PURE__ */ P(""), l = /* @__PURE__ */ P(""), u = /* @__PURE__ */ P(!1), d = $n(), f = 0, p = q(() => {
			let e = c.value.trim().toLocaleLowerCase();
			return a.value.filter((t) => t.uuid !== o.value && (!e || t.name.toLocaleLowerCase().includes(e)));
		}), m = q(() => a.value.find((e) => e.uuid === s.value) ?? null), h = q(() => !r.value || !i.value ? null : lh(r.value, i.value));
		Gn(s, async (e) => {
			let r = ++f;
			if (l.value = "", !e) {
				n.hydrateMountActorProfile(null), u.value = !1;
				return;
			}
			if (e === o.value) {
				n.clearMountSelection(), l.value = "The rider and mount must be different Actors.";
				return;
			}
			u.value = !0;
			try {
				let i = await t.bridge.loadActorCombatProfile(e);
				r === f && n.hydrateMountActorProfile(i);
			} catch (e) {
				r === f && (n.hydrateMountActorProfile(null), l.value = zh(e));
			} finally {
				r === f && (u.value = !1);
			}
		}, { immediate: !0 });
		function g(e) {
			let t = e.target;
			n.selectMountActorUuid(t?.value ?? "");
		}
		async function _(e) {
			l.value = "";
			try {
				let r = await t.bridge.resolveActorDrop(e);
				if (r.uuid === o.value) throw Error("The rider and mount must be different Actors.");
				n.selectMountActor(r);
			} catch (e) {
				l.value = zh(e);
			}
		}
		return (e, t) => (B(), V("div", qh, [
			t[5] ||= U("p", { class: "dui-alert dui-alert-info" }, " Mounts are optional. A selected mount is folded into one simplified NPC profile during build. ", -1),
			W(pd, {
				description: "Choose any world Actor as the mount. This selection does not create a live WFRP mount relationship.",
				number: "1",
				title: "Mount Actor"
			}, {
				default: I(() => [
					U("div", Jh, [U("fieldset", Yh, [
						t[2] ||= U("legend", { class: "dui-fieldset-legend" }, "Search mounts", -1),
						U("label", {
							class: "dui-label",
							for: `${F(d)}-filter`
						}, "Actor name", 8, Xh),
						Rn(U("input", {
							id: `${F(d)}-filter`,
							"onUpdate:modelValue": t[0] ||= (e) => c.value = e,
							"aria-label": "Filter mount actors by name",
							class: "dui-input dui-input-sm",
							placeholder: "Filter world actors",
							type: "search"
						}, null, 8, Zh), [[wo, c.value]])
					]), U("fieldset", Qh, [
						t[4] ||= U("legend", { class: "dui-fieldset-legend" }, "Selected mount", -1),
						U("label", {
							class: "dui-label",
							for: `${F(d)}-mount`
						}, "Mount statblock", 8, $h),
						U("select", {
							id: `${F(d)}-mount`,
							"aria-label": "Selected mount actor",
							class: "dui-select dui-select-sm",
							disabled: !F(o),
							value: F(s),
							onChange: g
						}, [t[3] ||= U("option", { value: "" }, "No combined mount", -1), (B(!0), V(z, null, R(p.value, (e) => (B(), V("option", {
							key: e.uuid,
							value: e.uuid
						}, A(e.name), 9, tg))), 128))], 40, eg)
					])]),
					W(Rh, {
						disabled: !F(o),
						description: "Drop a world Actor to use as the mount.",
						title: "Drop Mount Actor",
						variant: "compact",
						onDropData: _
					}, null, 8, ["disabled"]),
					F(s) ? (B(), V("div", ng, [U("button", {
						class: "dui-btn dui-btn-ghost dui-btn-sm",
						type: "button",
						onClick: t[1] ||= (...e) => F(n).clearMountSelection && F(n).clearMountSelection(...e)
					}, " Clear Mount ")])) : K("", !0),
					F(o) ? l.value ? (B(), V("p", ig, A(l.value), 1)) : u.value ? (B(), V("p", ag, " Loading mount profile... ")) : m.value && F(i) ? (B(), V("article", og, [m.value.img ? (B(), V("div", sg, [U("div", cg, [U("img", {
						src: m.value.img,
						alt: "",
						class: "app:h-full app:w-full app:object-cover",
						height: "64",
						width: "64"
					}, null, 8, lg)])])) : K("", !0), U("div", null, [U("strong", null, A(m.value.name), 1), U("span", null, " Movement " + A(F(i).movement) + " | Wounds " + A(F(i).wounds) + " | " + A(F(ch)[F(i).size]), 1)])])) : K("", !0) : (B(), V("p", rg, " Choose the rider on the Build tab before selecting a mount. "))
				]),
				_: 1
			}),
			h.value && F(r) && F(i) ? (B(), H(Kh, {
				key: 0,
				mount: F(i),
				plan: h.value,
				rider: F(r)
			}, null, 8, [
				"mount",
				"plan",
				"rider"
			])) : K("", !0)
		]));
	}
});
//#endregion
//#region src/functions/npc-builder/settings/portrait-search-status.ts
function dg(e) {
	return e ? e.digDownActive ? e.digDownDeepFileSearchEnabled ? e.digDownCacheReady ? `Dig Down cache ready with ${e.digDownIndexedFileCount} indexed files.` : "Dig Down is active; its file cache is still building or unavailable." : "Dig Down is active, but its Deep File Search setting is disabled." : "Install and enable Dig Down to search local files for portrait suggestions." : "Checking Dig Down integration.";
}
//#endregion
//#region src/functions/npc-builder/settings/settings-payload.ts
function fg(e) {
	let { canUseDigDownPortraitSearch: t, settings: n } = e;
	return {
		allowBaseActorCharacteristics: n.allowBaseActorCharacteristics,
		allowBaseActorSkills: n.allowBaseActorSkills,
		allowBaseActorTalents: n.allowBaseActorTalents,
		allowBaseActorTraits: n.allowBaseActorTraits,
		allowBaseActorTrappings: n.allowBaseActorTrappings,
		askForLinkedSkillSpecializations: n.askForLinkedSkillSpecializations,
		autoSelectGrantedSpells: n.autoSelectGrantedSpells,
		baseActorFolderUuid: n.baseActorFolderUuid,
		excludeFullyTransparentPortraitAssets: n.excludeFullyTransparentPortraitAssets,
		excludedPortraitReferenceImages: [...n.excludedPortraitReferenceImages],
		includeSpeciesInName: n.includeSpeciesInName,
		lowerCareerMode: n.lowerCareerMode,
		outputActorFolderUuid: n.outputActorFolderUuid,
		prioritizedPortraitFolders: [...n.prioritizedPortraitFolders],
		quickTraitFolderUuid: n.quickTraitFolderUuid,
		searchCompendiumPortraitAssets: n.searchCompendiumPortraitAssets,
		searchFoundryPortraitAssets: t && n.searchFoundryPortraitAssets,
		searchWebPortraitAssets: n.searchWebPortraitAssets
	};
}
//#endregion
//#region src/state/npc-builder/workflows/settings-workflow.ts
function pg(e) {
	let t = Au(), { actorFolders: n, itemFolders: r, settings: i } = xs(t), a = /* @__PURE__ */ P(""), o = /* @__PURE__ */ P(""), s = /* @__PURE__ */ P(!1), c = /* @__PURE__ */ P(""), l = /* @__PURE__ */ P(null), u = /* @__PURE__ */ P(""), d = /* @__PURE__ */ P(""), f = q(() => l.value?.digDownActive ?? !0), p = q(() => dg(l.value));
	Gn(l, (e) => {
		e && !e.digDownActive && (i.value.searchFoundryPortraitAssets = !1);
	});
	async function m() {
		await _({
			ensureFolder: e.ensureActorFolder,
			name: a.value,
			refresh: v,
			setFolderUuid: (e) => {
				i.value.baseActorFolderUuid = e;
			}
		});
	}
	async function h() {
		await _({
			ensureFolder: e.ensureActorFolder,
			name: c.value,
			refresh: v,
			setFolderUuid: (e) => {
				i.value.outputActorFolderUuid = e;
			}
		});
	}
	async function g() {
		await _({
			ensureFolder: e.ensureItemFolder,
			name: u.value,
			refresh: y,
			setFolderUuid: (e) => {
				i.value.quickTraitFolderUuid = e;
			}
		}), t.hydrateQuickTraits(await e.listQuickTraits(i.value));
	}
	async function _(n) {
		await w(async () => {
			let r = await n.ensureFolder(n.name);
			await n.refresh(), n.setFolderUuid(r.uuid), t.hydrateSettings(await e.saveSettings(te())), d.value = `Using folder "${r.name}".`;
		});
	}
	async function v() {
		t.hydrateActorFolders(await e.listActorFolders());
	}
	async function y() {
		t.hydrateItemFolders(await e.listItemFolders());
	}
	async function b() {
		l.value = await e.getPortraitSearchAvailability();
	}
	async function x() {
		await w(async () => {
			t.hydrateSettings(await e.saveSettings(te())), t.hydrateQuickTraits(await e.importRecommendedQuickTraits(i.value)), d.value = "Recommended quick traits imported.";
		});
	}
	async function S() {
		await w(async () => {
			t.hydrateSettings(await e.saveSettings(te())), await ee(), d.value = "Settings saved.";
		});
	}
	async function C() {
		await w(async () => {
			t.hydrateSettings(await e.saveSettings(kl())), await ee(), d.value = "Settings reset to defaults.";
		});
	}
	async function w(e) {
		s.value = !0, o.value = "", d.value = "";
		try {
			await e();
		} catch (e) {
			o.value = mg(e);
		} finally {
			s.value = !1;
		}
	}
	async function ee() {
		let [n, r] = await Promise.all([e.listBaseActors(i.value), e.listQuickTraits(i.value)]);
		t.hydrateBaseActors(n), t.hydrateQuickTraits(r);
	}
	function te() {
		return fg({
			canUseDigDownPortraitSearch: f.value,
			settings: i.value
		});
	}
	return {
		actorFolders: n,
		baseActorFolderName: a,
		canUseDigDownPortraitSearch: f,
		errorMessage: o,
		importRecommendedQuickTraits: x,
		isBusy: s,
		itemFolders: r,
		outputActorFolderName: c,
		portraitSearchStatusLabel: p,
		quickTraitFolderName: u,
		refreshPortraitSearchAvailability: b,
		resetSettingsToDefaults: C,
		saveBaseActorFolderName: m,
		saveOutputActorFolderName: h,
		saveQuickTraitFolderName: g,
		saveSettings: S,
		settings: i,
		settingsMessage: d
	};
}
function mg(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderSettingsTab/FolderSetting.vue?vue&type=script&setup=true&lang.ts
var hg = { class: "dui-fieldset" }, gg = { class: "dui-fieldset-legend" }, _g = ["aria-label", "value"], vg = { value: "" }, yg = ["value"], bg = { class: "dui-fieldset" }, xg = ["aria-label", "value"], Sg = { class: "dui-card-actions" }, Cg = ["disabled"], wg = /* @__PURE__ */ L({
	__name: "FolderSetting",
	props: {
		buttonLabel: {},
		createName: {},
		defaultOptionLabel: {},
		disabled: { type: Boolean },
		folders: {},
		folderLabel: {},
		selectedUuid: {}
	},
	emits: [
		"createNameChange",
		"saveFolderName",
		"selectedUuidChange"
	],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("selectedUuidChange", t?.value ?? "");
		}
		function i(e) {
			let t = e.target;
			n("createNameChange", t?.value ?? "");
		}
		return (t, a) => (B(), V("section", null, [
			U("fieldset", hg, [U("legend", gg, A(e.folderLabel), 1), U("select", {
				"aria-label": e.folderLabel,
				class: "dui-select dui-select-sm",
				value: e.selectedUuid,
				onChange: r
			}, [U("option", vg, A(e.defaultOptionLabel), 1), (B(!0), V(z, null, R(e.folders, (e) => (B(), V("option", {
				key: e.uuid,
				value: e.uuid
			}, A(e.name), 9, yg))), 128))], 40, _g)]),
			U("fieldset", bg, [a[1] ||= U("legend", { class: "dui-fieldset-legend" }, "Create or use by name", -1), U("input", {
				"aria-label": `Create or use ${e.folderLabel} by name`,
				class: "dui-input dui-input-sm",
				value: e.createName,
				placeholder: "Folder name",
				type: "text",
				onInput: i
			}, null, 40, xg)]),
			U("div", Sg, [U("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.disabled || !e.createName.trim(),
				type: "button",
				onClick: a[0] ||= (e) => n("saveFolderName")
			}, A(e.buttonLabel ?? "Save Folder"), 9, Cg)])
		]));
	}
}), Tg = /* @__PURE__ */ L({
	__name: "ActorSourceSettings",
	props: {
		actorFolders: {},
		baseActorFolderName: {},
		baseActorFolderUuid: {},
		isBusy: { type: Boolean },
		outputActorFolderName: {},
		outputActorFolderUuid: {}
	},
	emits: [
		"baseActorFolderNameChange",
		"baseActorFolderUuidChange",
		"outputActorFolderNameChange",
		"outputActorFolderUuidChange",
		"saveBaseActorFolderName",
		"saveOutputActorFolderName"
	],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (B(), H(pd, {
			description: "Limit the source picker or choose where generated Actors are stored.",
			number: "1",
			title: "Actor Sources"
		}, {
			default: I(() => [W(wg, {
				"create-name": e.baseActorFolderName,
				disabled: e.isBusy,
				folders: e.actorFolders,
				"selected-uuid": e.baseActorFolderUuid,
				"default-option-label": "All world actors",
				"folder-label": "Base actor folder",
				onCreateNameChange: r[0] ||= (e) => n("baseActorFolderNameChange", e),
				onSaveFolderName: r[1] ||= (e) => n("saveBaseActorFolderName"),
				onSelectedUuidChange: r[2] ||= (e) => n("baseActorFolderUuidChange", e)
			}, null, 8, [
				"create-name",
				"disabled",
				"folders",
				"selected-uuid"
			]), W(wg, {
				"create-name": e.outputActorFolderName,
				disabled: e.isBusy,
				folders: e.actorFolders,
				"selected-uuid": e.outputActorFolderUuid,
				"default-option-label": "Foundry default location",
				"folder-label": "Output actor folder",
				onCreateNameChange: r[3] ||= (e) => n("outputActorFolderNameChange", e),
				onSaveFolderName: r[4] ||= (e) => n("saveOutputActorFolderName"),
				onSelectedUuidChange: r[5] ||= (e) => n("outputActorFolderUuidChange", e)
			}, null, 8, [
				"create-name",
				"disabled",
				"folders",
				"selected-uuid"
			])]),
			_: 1
		}));
	}
}), Eg = {
	key: 0,
	class: "dui-label"
}, Dg = ["checked"], Og = {
	key: 1,
	class: "dui-label"
}, kg = ["checked"], Ag = {
	key: 2,
	class: "dui-label"
}, jg = ["checked"], Mg = {
	key: 3,
	class: "dui-label"
}, Ng = ["checked"], Pg = {
	key: 4,
	class: "dui-label"
}, Fg = ["checked"], Ig = /* @__PURE__ */ L({
	__name: "BaseActorFeatureSettings",
	props: {
		allowCharacteristics: { type: Boolean },
		allowSkills: { type: Boolean },
		allowTalents: { type: Boolean },
		allowTraits: { type: Boolean },
		allowTrappings: { type: Boolean },
		showAdvancementFeatures: { type: Boolean },
		showTraitFeature: { type: Boolean },
		showTrappingFeature: { type: Boolean }
	},
	emits: [
		"allowCharacteristicsChange",
		"allowSkillsChange",
		"allowTalentsChange",
		"allowTraitsChange",
		"allowTrappingsChange"
	],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			return !!e.target?.checked;
		}
		return (t, i) => (B(), H(pd, {
			description: "Choose which base-only data is included in the editable draft.",
			title: "Base Actor Features"
		}, {
			default: I(() => [
				e.showAdvancementFeatures === !1 ? K("", !0) : (B(), V("label", Eg, [U("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowCharacteristics,
					type: "checkbox",
					onChange: i[0] ||= (e) => n("allowCharacteristicsChange", r(e))
				}, null, 40, Dg), i[5] ||= U("span", null, "Show base actor characteristics", -1)])),
				e.showAdvancementFeatures === !1 ? K("", !0) : (B(), V("label", Og, [U("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowSkills,
					type: "checkbox",
					onChange: i[1] ||= (e) => n("allowSkillsChange", r(e))
				}, null, 40, kg), i[6] ||= U("span", null, "Show base actor skills", -1)])),
				e.showAdvancementFeatures === !1 ? K("", !0) : (B(), V("label", Ag, [U("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTalents,
					type: "checkbox",
					onChange: i[2] ||= (e) => n("allowTalentsChange", r(e))
				}, null, 40, jg), i[7] ||= U("span", null, "Show base actor talents", -1)])),
				e.showTrappingFeature ? (B(), V("label", Mg, [U("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTrappings,
					type: "checkbox",
					onChange: i[3] ||= (e) => n("allowTrappingsChange", r(e))
				}, null, 40, Ng), i[8] ||= U("span", null, "Show base actor trappings", -1)])) : K("", !0),
				e.showTraitFeature === !1 ? K("", !0) : (B(), V("label", Pg, [U("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTraits,
					type: "checkbox",
					onChange: i[4] ||= (e) => n("allowTraitsChange", r(e))
				}, null, 40, Fg), i[9] ||= U("span", null, "Show base actor traits", -1)]))
			]),
			_: 1
		}));
	}
}), Lg = { class: "dui-label" }, Rg = ["checked"], zg = /* @__PURE__ */ L({
	__name: "MagicSpellSettings",
	props: { autoSelectGrantedSpells: { type: Boolean } },
	emits: ["autoSelectGrantedSpellsChange"],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("autoSelectGrantedSpellsChange", !!t?.checked);
		}
		return (t, n) => (B(), H(pd, {
			number: "6",
			title: "Magic and Spells"
		}, {
			default: I(() => [U("label", Lg, [U("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.autoSelectGrantedSpells,
				type: "checkbox",
				onChange: r
			}, null, 40, Rg), n[0] ||= U("span", null, "Select detected Lore spells by default", -1)])]),
			_: 1
		}));
	}
}), Bg = { class: "dui-label" }, Vg = ["checked"], Hg = /* @__PURE__ */ L({
	__name: "NamingSettings",
	props: { includeSpeciesInName: { type: Boolean } },
	emits: ["includeSpeciesInNameChange"],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("includeSpeciesInNameChange", !!t?.checked);
		}
		return (t, n) => (B(), H(pd, {
			number: "3",
			title: "Default Naming"
		}, {
			default: I(() => [U("label", Bg, [U("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.includeSpeciesInName,
				type: "checkbox",
				onChange: r
			}, null, 40, Vg), n[0] ||= U("span", null, "Include species in suggested names", -1)])]),
			_: 1
		}));
	}
}), Ug = { class: "dui-fieldset" }, Wg = ["value"], Gg = { class: "dui-label" }, Kg = ["checked"], qg = /* @__PURE__ */ L({
	__name: "OtherSettingsPanel",
	props: {
		askForLinkedSkillSpecializations: { type: Boolean },
		lowerCareerMode: {}
	},
	emits: ["askForLinkedSkillSpecializationsChange", "lowerCareerModeChange"],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target?.value;
			(t === "auto-add-all" || t === "never" || t === "prompt") && n("lowerCareerModeChange", t);
		}
		function i(e) {
			let t = e.target;
			n("askForLinkedSkillSpecializationsChange", !!t?.checked);
		}
		return (t, n) => (B(), H(pd, { title: "Career Resolution" }, {
			default: I(() => [U("fieldset", Ug, [n[1] ||= U("legend", { class: "dui-fieldset-legend" }, "Lower career handling", -1), U("select", {
				"aria-label": "Lower career handling",
				class: "dui-select dui-select-sm",
				value: e.lowerCareerMode,
				onChange: r
			}, [...n[0] ||= [
				U("option", { value: "prompt" }, "Prompt when candidates are found", -1),
				U("option", { value: "auto-add-all" }, "Automatically add all lower-tier matches", -1),
				U("option", { value: "never" }, "Only add dropped careers", -1)
			]], 40, Wg)]), U("label", Gg, [U("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.askForLinkedSkillSpecializations,
				type: "checkbox",
				onChange: i
			}, null, 40, Kg), n[2] ||= U("span", null, "Resolve linked career skill repeats separately", -1)])]),
			_: 1
		}));
	}
}), Jg = { class: "app:grid app:gap-1" }, Yg = ["value"], Xg = { class: "dui-label" }, Zg = ["checked"], Qg = { class: "app:grid app:gap-1" }, $g = ["value"], e_ = { class: "dui-label" }, t_ = ["checked", "disabled"], n_ = {
	"aria-live": "polite",
	class: "dui-alert",
	role: "status"
}, r_ = { class: "dui-label" }, i_ = ["checked"], a_ = { class: "dui-label" }, o_ = ["checked"], s_ = /* @__PURE__ */ L({
	__name: "PortraitSuggestionSettings",
	props: {
		canUseDigDownPortraitSearch: { type: Boolean },
		excludeFullyTransparentPortraitAssets: { type: Boolean },
		excludedPortraitReferenceImages: {},
		prioritizedPortraitFolders: {},
		searchCompendiumPortraitAssets: { type: Boolean },
		searchFoundryPortraitAssets: { type: Boolean },
		searchWebPortraitAssets: { type: Boolean },
		statusLabel: {}
	},
	emits: [
		"excludeFullyTransparentPortraitAssetsChange",
		"excludedPortraitReferenceImagesChange",
		"prioritizedPortraitFoldersChange",
		"searchCompendiumPortraitAssetsChange",
		"searchFoundryPortraitAssetsChange"
	],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("excludeFullyTransparentPortraitAssetsChange", !!t?.checked);
		}
		function i(e) {
			let t = e.target;
			n("excludedPortraitReferenceImagesChange", t?.value.split(/\r?\n/u) ?? []);
		}
		function a(e) {
			let t = e.target;
			n("prioritizedPortraitFoldersChange", t?.value.split(/\r?\n/u) ?? []);
		}
		function o(e) {
			let t = e.target;
			n("searchFoundryPortraitAssetsChange", !!t?.checked);
		}
		function s(e) {
			let t = e.target;
			n("searchCompendiumPortraitAssetsChange", !!t?.checked);
		}
		return (t, n) => (B(), H(pd, {
			description: "Choose which local Foundry sources can suggest portraits.",
			number: "4",
			title: "Portrait Suggestions"
		}, {
			default: I(() => [
				U("label", Jg, [
					n[0] ||= U("span", { class: "dui-label app:justify-start app:gap-2 app:font-semibold" }, [U("i", {
						"aria-hidden": "true",
						class: "fa-solid fa-folder-open"
					}), G(" Priority Foundry folders ")], -1),
					U("textarea", {
						"aria-describedby": "portrait-priority-folders-help",
						class: "dui-textarea dui-textarea-sm app:min-h-20 app:w-full",
						placeholder: "modules/my-art-module/portraits",
						rows: "3",
						value: e.prioritizedPortraitFolders.join("\n"),
						onInput: a
					}, null, 40, Yg),
					n[1] ||= U("small", { id: "portrait-priority-folders-help" }, " One Foundry data path per line. These appear first, ahead of compendiums, world documents, and Dig Down results. ", -1)
				]),
				U("label", Xg, [U("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.excludeFullyTransparentPortraitAssets,
					type: "checkbox",
					onChange: r
				}, null, 40, Zg), n[2] ||= U("span", null, "Hide fully empty or transparent images", -1)]),
				U("label", Qg, [
					n[3] ||= U("span", { class: "dui-label app:justify-start app:gap-2 app:font-semibold" }, [U("i", {
						"aria-hidden": "true",
						class: "fa-solid fa-ban"
					}), G(" Excluded image references ")], -1),
					U("textarea", {
						"aria-describedby": "portrait-excluded-references-help",
						class: "dui-textarea dui-textarea-sm app:min-h-20 app:w-full",
						placeholder: "systems/wfrp4e/tokens/unknown.png",
						rows: "3",
						value: e.excludedPortraitReferenceImages.join("\n"),
						onInput: i
					}, null, 40, $g),
					n[4] ||= U("small", { id: "portrait-excluded-references-help" }, " One image path per line. Each listed image and its visual duplicates are hidden. Broken images are always hidden. ", -1)
				]),
				U("label", e_, [U("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchFoundryPortraitAssets,
					disabled: !e.canUseDigDownPortraitSearch,
					type: "checkbox",
					onChange: o
				}, null, 40, t_), n[5] ||= U("span", null, "Search Dig Down's file cache for portrait suggestions", -1)]),
				U("p", n_, A(e.statusLabel), 1),
				U("label", r_, [U("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchCompendiumPortraitAssets,
					type: "checkbox",
					onChange: s
				}, null, 40, i_), n[6] ||= U("span", null, "Search Actor and Item compendiums for portrait suggestions", -1)]),
				U("label", a_, [U("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchWebPortraitAssets,
					disabled: "",
					type: "checkbox"
				}, null, 8, o_), n[7] ||= U("span", null, "Search the web for portrait suggestions (later)", -1)])
			]),
			_: 1
		}));
	}
}), c_ = { class: "dui-card-actions" }, l_ = ["disabled"], u_ = /* @__PURE__ */ L({
	__name: "QuickTraitSettings",
	props: {
		isBusy: { type: Boolean },
		itemFolders: {},
		quickTraitFolderName: {},
		quickTraitFolderUuid: {}
	},
	emits: [
		"importRecommendedQuickTraits",
		"quickTraitFolderNameChange",
		"quickTraitFolderUuidChange",
		"saveQuickTraitFolderName"
	],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (B(), H(pd, {
			description: "Items in this folder become one-click Trait choices on the Build tab.",
			number: "2",
			title: "Quick Traits"
		}, {
			default: I(() => [W(wg, {
				"create-name": e.quickTraitFolderName,
				disabled: e.isBusy,
				folders: e.itemFolders,
				"selected-uuid": e.quickTraitFolderUuid,
				"default-option-label": "No quick traits folder",
				"folder-label": "Quick traits folder",
				onCreateNameChange: r[0] ||= (e) => n("quickTraitFolderNameChange", e),
				onSaveFolderName: r[1] ||= (e) => n("saveQuickTraitFolderName"),
				onSelectedUuidChange: r[2] ||= (e) => n("quickTraitFolderUuidChange", e)
			}, null, 8, [
				"create-name",
				"disabled",
				"folders",
				"selected-uuid"
			]), U("div", c_, [U("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.isBusy || !e.quickTraitFolderUuid,
				type: "button",
				onClick: r[3] ||= (e) => n("importRecommendedQuickTraits")
			}, " Import Recommended Quick Traits ", 8, l_)])]),
			_: 1
		}));
	}
}), d_ = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, f_ = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, p_ = /* @__PURE__ */ L({
	__name: "SettingsMessages",
	props: {
		errorMessage: {},
		settingsMessage: {}
	},
	setup(e) {
		return (t, n) => e.errorMessage ? (B(), V("p", d_, A(e.errorMessage), 1)) : e.settingsMessage ? (B(), V("p", f_, A(e.settingsMessage), 1)) : K("", !0);
	}
}), m_ = { class: "app:grid app:gap-3" }, h_ = { class: "app:grid app:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] app:gap-3" }, g_ = { class: "dui-card-actions" }, __ = ["disabled"], v_ = ["disabled"], y_ = /* @__PURE__ */ L({
	__name: "NpcBuilderSettingsTab",
	props: {
		bridge: {},
		page: {}
	},
	setup(e) {
		let { actorFolders: t, baseActorFolderName: n, canUseDigDownPortraitSearch: r, errorMessage: i, importRecommendedQuickTraits: a, isBusy: o, itemFolders: s, outputActorFolderName: c, portraitSearchStatusLabel: l, quickTraitFolderName: u, refreshPortraitSearchAvailability: d, resetSettingsToDefaults: f, saveBaseActorFolderName: p, saveOutputActorFolderName: m, saveQuickTraitFolderName: h, saveSettings: g, settings: _, settingsMessage: v } = pg(e.bridge);
		return mr(() => {
			d();
		}), (d, y) => (B(), V("section", m_, [
			W(p_, {
				"error-message": F(i),
				"settings-message": F(v)
			}, null, 8, ["error-message", "settings-message"]),
			U("div", h_, [
				e.page === "settings-folders" ? (B(), H(Tg, {
					key: 0,
					class: "app:col-span-full",
					"actor-folders": F(t),
					"base-actor-folder-name": F(n),
					"base-actor-folder-uuid": F(_).baseActorFolderUuid,
					"is-busy": F(o),
					"output-actor-folder-name": F(c),
					"output-actor-folder-uuid": F(_).outputActorFolderUuid,
					onBaseActorFolderNameChange: y[0] ||= (e) => n.value = e,
					onBaseActorFolderUuidChange: y[1] ||= (e) => F(_).baseActorFolderUuid = e,
					onOutputActorFolderNameChange: y[2] ||= (e) => c.value = e,
					onOutputActorFolderUuidChange: y[3] ||= (e) => F(_).outputActorFolderUuid = e,
					onSaveBaseActorFolderName: F(p),
					onSaveOutputActorFolderName: F(m)
				}, null, 8, [
					"actor-folders",
					"base-actor-folder-name",
					"base-actor-folder-uuid",
					"is-busy",
					"output-actor-folder-name",
					"output-actor-folder-uuid",
					"onSaveBaseActorFolderName",
					"onSaveOutputActorFolderName"
				])) : K("", !0),
				e.page === "settings-folders" ? (B(), H(u_, {
					key: 1,
					"is-busy": F(o),
					"item-folders": F(s),
					"quick-trait-folder-name": F(u),
					"quick-trait-folder-uuid": F(_).quickTraitFolderUuid,
					onImportRecommendedQuickTraits: F(a),
					onQuickTraitFolderNameChange: y[4] ||= (e) => u.value = e,
					onQuickTraitFolderUuidChange: y[5] ||= (e) => F(_).quickTraitFolderUuid = e,
					onSaveQuickTraitFolderName: F(h)
				}, null, 8, [
					"is-busy",
					"item-folders",
					"quick-trait-folder-name",
					"quick-trait-folder-uuid",
					"onImportRecommendedQuickTraits",
					"onSaveQuickTraitFolderName"
				])) : K("", !0),
				e.page === "settings-suggestions" ? (B(), H(Hg, {
					key: 2,
					"include-species-in-name": F(_).includeSpeciesInName,
					onIncludeSpeciesInNameChange: y[6] ||= (e) => F(_).includeSpeciesInName = e
				}, null, 8, ["include-species-in-name"])) : K("", !0),
				e.page === "settings-suggestions" ? (B(), H(s_, {
					key: 3,
					"can-use-dig-down-portrait-search": F(r),
					"exclude-fully-transparent-portrait-assets": F(_).excludeFullyTransparentPortraitAssets,
					"excluded-portrait-reference-images": F(_).excludedPortraitReferenceImages,
					"prioritized-portrait-folders": F(_).prioritizedPortraitFolders,
					"search-compendium-portrait-assets": F(_).searchCompendiumPortraitAssets,
					"search-foundry-portrait-assets": F(_).searchFoundryPortraitAssets,
					"search-web-portrait-assets": F(_).searchWebPortraitAssets,
					"status-label": F(l),
					onExcludeFullyTransparentPortraitAssetsChange: y[7] ||= (e) => F(_).excludeFullyTransparentPortraitAssets = e,
					onExcludedPortraitReferenceImagesChange: y[8] ||= (e) => F(_).excludedPortraitReferenceImages = e,
					onPrioritizedPortraitFoldersChange: y[9] ||= (e) => F(_).prioritizedPortraitFolders = e,
					onSearchCompendiumPortraitAssetsChange: y[10] ||= (e) => F(_).searchCompendiumPortraitAssets = e,
					onSearchFoundryPortraitAssetsChange: y[11] ||= (e) => F(_).searchFoundryPortraitAssets = e
				}, null, 8, [
					"can-use-dig-down-portrait-search",
					"exclude-fully-transparent-portrait-assets",
					"excluded-portrait-reference-images",
					"prioritized-portrait-folders",
					"search-compendium-portrait-assets",
					"search-foundry-portrait-assets",
					"search-web-portrait-assets",
					"status-label"
				])) : K("", !0),
				e.page === "settings-advancement" ? (B(), H(Ig, {
					key: 4,
					"allow-characteristics": F(_).allowBaseActorCharacteristics,
					"allow-skills": F(_).allowBaseActorSkills,
					"allow-talents": F(_).allowBaseActorTalents,
					"allow-traits": F(_).allowBaseActorTraits,
					"allow-trappings": F(_).allowBaseActorTrappings,
					"show-trapping-feature": !1,
					onAllowCharacteristicsChange: y[12] ||= (e) => F(_).allowBaseActorCharacteristics = e,
					onAllowSkillsChange: y[13] ||= (e) => F(_).allowBaseActorSkills = e,
					onAllowTalentsChange: y[14] ||= (e) => F(_).allowBaseActorTalents = e,
					onAllowTraitsChange: y[15] ||= (e) => F(_).allowBaseActorTraits = e,
					onAllowTrappingsChange: y[16] ||= (e) => F(_).allowBaseActorTrappings = e
				}, null, 8, [
					"allow-characteristics",
					"allow-skills",
					"allow-talents",
					"allow-traits",
					"allow-trappings"
				])) : K("", !0),
				e.page === "settings-resolution" ? (B(), H(zg, {
					key: 5,
					"auto-select-granted-spells": F(_).autoSelectGrantedSpells,
					onAutoSelectGrantedSpellsChange: y[17] ||= (e) => F(_).autoSelectGrantedSpells = e
				}, null, 8, ["auto-select-granted-spells"])) : K("", !0),
				e.page === "settings-resolution" ? (B(), H(Ig, {
					key: 6,
					"allow-characteristics": F(_).allowBaseActorCharacteristics,
					"allow-skills": F(_).allowBaseActorSkills,
					"allow-talents": F(_).allowBaseActorTalents,
					"allow-traits": F(_).allowBaseActorTraits,
					"allow-trappings": F(_).allowBaseActorTrappings,
					"show-advancement-features": !1,
					"show-trait-feature": !1,
					"show-trapping-feature": "",
					onAllowCharacteristicsChange: y[18] ||= (e) => F(_).allowBaseActorCharacteristics = e,
					onAllowSkillsChange: y[19] ||= (e) => F(_).allowBaseActorSkills = e,
					onAllowTalentsChange: y[20] ||= (e) => F(_).allowBaseActorTalents = e,
					onAllowTraitsChange: y[21] ||= (e) => F(_).allowBaseActorTraits = e,
					onAllowTrappingsChange: y[22] ||= (e) => F(_).allowBaseActorTrappings = e
				}, null, 8, [
					"allow-characteristics",
					"allow-skills",
					"allow-talents",
					"allow-traits",
					"allow-trappings"
				])) : K("", !0),
				e.page === "settings-resolution" ? (B(), H(qg, {
					key: 7,
					class: "app:col-span-full",
					"ask-for-linked-skill-specializations": F(_).askForLinkedSkillSpecializations,
					"lower-career-mode": F(_).lowerCareerMode,
					onAskForLinkedSkillSpecializationsChange: y[23] ||= (e) => F(_).askForLinkedSkillSpecializations = e,
					onLowerCareerModeChange: y[24] ||= (e) => F(_).lowerCareerMode = e
				}, null, 8, ["ask-for-linked-skill-specializations", "lower-career-mode"])) : K("", !0)
			]),
			U("div", g_, [U("button", {
				class: "dui-btn dui-btn-primary dui-btn-sm",
				disabled: F(o),
				type: "button",
				onClick: y[25] ||= (...e) => F(g) && F(g)(...e)
			}, " Save Settings ", 8, __), U("button", {
				class: "dui-btn dui-btn-sm",
				disabled: F(o),
				type: "button",
				onClick: y[26] ||= (...e) => F(f) && F(f)(...e)
			}, " Reset to Defaults ", 8, v_)])
		]));
	}
});
//#endregion
//#region src/functions/npc-builder/magic-lore-resolution.ts
function b_(e) {
	return e.map((e) => `${e.kind}:${e.sourceName}:${e.rawLore}`).sort().join("|");
}
function x_(e) {
	return e.filter((e) => e.isAmbiguous);
}
function S_(e, t) {
	return { rows: x_(e).map((e) => ({
		grantLabel: w_(e),
		options: Bl(e, t),
		rawLore: e.rawLore,
		resolutionKey: e.resolutionKey,
		selectedLore: "",
		sourceLabel: T_(e)
	})) };
}
function C_(e) {
	return e.kind === "arcane-magic" ? "Arcane Magic" : e.kind === "petty-magic" ? "Petty Magic" : "Spellcaster";
}
function w_(e) {
	return `${C_(e)} from ${e.sourceName}`;
}
function T_(e) {
	return e.source === "talent" ? "Talent" : "Trait";
}
//#endregion
//#region src/state/npc-builder/workflows/spells-workflow.ts
function E_(e) {
	let t = Au(), { magicGrants: n, spells: r, selectedSpells: i } = xs(t), a = /* @__PURE__ */ P(""), o = /* @__PURE__ */ P(!1), s = /* @__PURE__ */ P(!1), c = /* @__PURE__ */ P([]), l = /* @__PURE__ */ P(null), u = 0, d = q(() => x_(n.value)), f = q(() => n.value.length - d.value.length);
	Gn(() => b_(n.value), () => {
		m();
	});
	function p() {
		h(), m();
	}
	async function m() {
		let r = u + 1;
		if (u = r, !n.value.length) {
			t.hydrateDetectedSpells([]);
			return;
		}
		s.value = !0, a.value = "";
		try {
			let i = await e.listSpellsForMagicGrants(n.value);
			u === r && t.hydrateDetectedSpells(i);
		} catch (e) {
			u === r && (a.value = D_(e));
		} finally {
			u === r && (s.value = !1);
		}
	}
	async function h() {
		if (!(c.value.length || o.value)) {
			o.value = !0;
			try {
				c.value = await e.listMagicLoreOptions();
			} catch (e) {
				a.value = D_(e);
			} finally {
				o.value = !1;
			}
		}
	}
	async function g() {
		a.value = "", await h(), l.value = S_(n.value, c.value);
	}
	function _() {
		let e = l.value;
		if (e) {
			for (let n of e.rows) t.setMagicGrantLoreResolution(n.resolutionKey, n.selectedLore);
			l.value = null, m();
		}
	}
	function v() {
		l.value = null;
	}
	async function y(n) {
		a.value = "";
		try {
			t.addCustomSpell(await e.resolveSpellDrop(n));
		} catch (e) {
			a.value = D_(e);
		}
	}
	function b(e) {
		t.removeCustomSpell(e);
	}
	function x(e, n) {
		t.setSpellSelected(e, n);
	}
	return {
		ambiguousGrants: d,
		confirmMagicLorePrompt: _,
		dismissMagicLorePrompt: v,
		errorMessage: a,
		handleSpellDrop: y,
		initialize: p,
		isLoadingLoreOptions: o,
		isLoadingSpells: s,
		loadDetectedSpells: m,
		magicGrants: n,
		openMagicLorePrompt: g,
		pendingMagicLorePrompt: l,
		removeCustomSpell: b,
		resolvedGrantCount: f,
		selectedSpells: i,
		setSpellSelected: x,
		spells: r
	};
}
function D_(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that spell action.";
}
//#endregion
//#region src/view/apps/npc-builder/components/MagicLoreResolutionPromptContent.vue?vue&type=script&setup=true&lang.ts
var O_ = { class: "dui-card-body" }, k_ = { class: "dui-card-title" }, A_ = { class: "dui-fieldset" }, j_ = ["onUpdate:modelValue", "aria-label"], M_ = ["value"], N_ = { class: "dui-card-actions" }, P_ = /* @__PURE__ */ L({
	__name: "MagicLoreResolutionPromptContent",
	props: { prompt: {} },
	emits: ["applyLores", "keepUnresolved"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (B(), V("section", null, [
			r[4] ||= U("p", null, " Choose concrete magic Lores for ambiguous grants before automatic spells are detected. Unresolved grants can still use manually dropped spells. ", -1),
			(B(!0), V(z, null, R(e.prompt.rows, (e) => (B(), V("section", {
				key: e.resolutionKey,
				class: "dui-card dui-card-border dui-card-sm"
			}, [U("div", O_, [
				U("h3", k_, A(e.grantLabel), 1),
				U("span", null, A(e.sourceLabel) + " - " + A(e.rawLore || "Any Lore"), 1),
				U("fieldset", A_, [r[3] ||= U("legend", { class: "dui-fieldset-legend" }, "Lore", -1), Rn(U("select", {
					"onUpdate:modelValue": (t) => e.selectedLore = t,
					"aria-label": `Lore for ${e.grantLabel}`,
					class: "dui-select dui-select-sm"
				}, [r[2] ||= U("option", { value: "" }, "Leave unresolved", -1), (B(!0), V(z, null, R(e.options, (e) => (B(), V("option", {
					key: e.key,
					value: e.value
				}, A(e.label) + A(e.wind && e.wind !== "None" ? ` (${e.wind})` : ""), 9, M_))), 128))], 8, j_), [[Do, e.selectedLore]])])
			])]))), 128)),
			U("div", N_, [U("button", {
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: r[0] ||= (e) => n("keepUnresolved")
			}, " Keep Unresolved "), U("button", {
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: r[1] ||= (e) => n("applyLores")
			}, " Apply Lores ")])
		]));
	}
}), F_ = {
	key: 0,
	class: "dui-alert"
}, I_ = {
	key: 1,
	class: "dui-list"
}, L_ = { class: "dui-list-col-grow" }, R_ = { key: 0 }, z_ = { key: 1 }, B_ = {
	key: 2,
	class: "dui-card-actions"
}, V_ = ["disabled"], H_ = /* @__PURE__ */ L({
	__name: "MagicAccessPanel",
	props: {
		ambiguousGrantCount: {},
		isLoadingLoreOptions: { type: Boolean },
		magicGrants: {}
	},
	emits: ["resolveLores"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (B(), H(pd, {
			description: "Magic Talents and Traits determine which spell Lores are available.",
			number: "1",
			title: "Magic Access"
		}, {
			default: I(() => [e.magicGrants.length ? (B(), V("ul", I_, [(B(!0), V(z, null, R(e.magicGrants, (e) => (B(), V("li", {
				key: `${e.source}:${e.sourceName}:${e.rawLore}`,
				class: "dui-list-row"
			}, [U("div", L_, [
				U("strong", null, A(F(C_)(e)), 1),
				U("span", null, A(F(T_)(e)) + " - " + A(e.sourceName), 1),
				e.isAmbiguous ? (B(), V("small", R_, " Needs Lore resolution before automatic spells can be found. ")) : (B(), V("small", z_, " Lore: " + A(e.rawLore || e.normalizedLore), 1))
			])]))), 128))])) : (B(), V("p", F_, " No magic-enabling Talent or Trait is selected. ")), e.ambiguousGrantCount ? (B(), V("div", B_, [U("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.isLoadingLoreOptions,
				type: "button",
				onClick: r[0] ||= (e) => n("resolveLores")
			}, A(e.isLoadingLoreOptions ? "Loading Lores..." : "Resolve Lores"), 9, V_)])) : K("", !0)]),
			_: 1
		}));
	}
});
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderSpellsTab/labels.ts
function U_(e) {
	return e.source === "custom" ? "Dropped" : e.sourceLabel;
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderSpellsTab/SpellSelectionPanel.vue?vue&type=script&setup=true&lang.ts
var W_ = { class: "dui-card-actions" }, G_ = ["disabled"], K_ = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, q_ = {
	key: 1,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, J_ = {
	key: 2,
	class: "dui-list"
}, Y_ = [
	"aria-label",
	"checked",
	"onChange"
], X_ = { class: "dui-list-col-grow" }, Z_ = {
	key: 0,
	class: "dui-avatar"
}, Q_ = ["src"], $_ = ["onClick"], ev = {
	key: 3,
	class: "dui-alert"
}, tv = /* @__PURE__ */ L({
	__name: "SpellSelectionPanel",
	props: {
		ambiguousGrantCount: {},
		errorMessage: {},
		isLoadingSpells: { type: Boolean },
		resolvedGrantCount: {},
		selectedSpellCount: {},
		spells: {}
	},
	emits: [
		"refreshSpells",
		"removeCustomSpell",
		"spellDrop",
		"spellSelectedChange"
	],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (B(), H(pd, {
			description: "Select detected Lore spells or drop specific Spell Items.",
			number: "2",
			title: "Spells"
		}, {
			default: I(() => [
				W(Rh, {
					description: "Add a specific Spell item regardless of detected Lores.",
					title: "Drop Spell Items",
					onDropData: r[0] ||= (e) => n("spellDrop", e)
				}),
				U("div", W_, [U("button", {
					class: "dui-btn dui-btn-sm",
					disabled: e.isLoadingSpells || !e.resolvedGrantCount,
					type: "button",
					onClick: r[1] ||= (e) => n("refreshSpells")
				}, A(e.isLoadingSpells ? "Finding spells..." : "Refresh Spells"), 9, G_), U("span", null, A(e.selectedSpellCount) + " selected / " + A(e.spells.length) + " found", 1)]),
				e.errorMessage ? (B(), V("p", K_, A(e.errorMessage), 1)) : K("", !0),
				e.ambiguousGrantCount ? (B(), V("p", q_, A(e.ambiguousGrantCount) + " magic grant" + A(e.ambiguousGrantCount === 1 ? "" : "s") + " still need Lore resolution. You can still drop specific spells for now. ", 1)) : K("", !0),
				e.spells.length ? (B(), V("ul", J_, [(B(!0), V(z, null, R(e.spells, (e) => (B(), V("li", {
					key: e.key,
					class: "dui-list-row"
				}, [
					U("input", {
						"aria-label": `Use ${e.name}`,
						class: "dui-checkbox dui-checkbox-sm",
						checked: e.selected,
						type: "checkbox",
						onChange: (t) => n("spellSelectedChange", e, t)
					}, null, 40, Y_),
					U("div", X_, [
						e.img ? (B(), V("div", Z_, [U("div", null, [U("img", {
							src: e.img,
							alt: ""
						}, null, 8, Q_)])])) : K("", !0),
						U("strong", null, A(e.name), 1),
						U("span", null, A(e.loreName || "Unknown Lore") + " · " + A(F(U_)(e)), 1)
					]),
					e.source === "custom" ? (B(), V("button", {
						key: 0,
						class: "dui-btn dui-btn-sm",
						type: "button",
						onClick: (t) => n("removeCustomSpell", e.key)
					}, " Remove ", 8, $_)) : K("", !0)
				]))), 128))])) : (B(), V("p", ev, " No matching spells found yet. Drop specific spells here, or resolve a non-ambiguous magic Lore. "))
			]),
			_: 1
		}));
	}
}), nv = /* @__PURE__ */ L({
	__name: "NpcBuilderSpellsTab",
	props: { bridge: {} },
	setup(e) {
		let { ambiguousGrants: t, confirmMagicLorePrompt: n, dismissMagicLorePrompt: r, errorMessage: i, handleSpellDrop: a, initialize: o, isLoadingLoreOptions: s, isLoadingSpells: c, loadDetectedSpells: l, magicGrants: u, openMagicLorePrompt: d, pendingMagicLorePrompt: f, removeCustomSpell: p, resolvedGrantCount: m, selectedSpells: h, setSpellSelected: g, spells: _ } = E_(e.bridge);
		mr(() => {
			o();
		});
		function v(e, t) {
			let n = t.target;
			n && g(e.key, n.checked);
		}
		return (e, o) => (B(), V("section", null, [
			W(Ru, {
				open: F(f) !== null,
				title: "Resolve Magic Lores",
				onClose: F(r)
			}, {
				default: I(() => [F(f) ? (B(), H(P_, {
					key: 0,
					prompt: F(f),
					onApplyLores: F(n),
					onKeepUnresolved: F(r)
				}, null, 8, [
					"prompt",
					"onApplyLores",
					"onKeepUnresolved"
				])) : K("", !0)]),
				_: 1
			}, 8, ["open", "onClose"]),
			W(H_, {
				"ambiguous-grant-count": F(t).length,
				"is-loading-lore-options": F(s),
				"magic-grants": F(u),
				onResolveLores: F(d)
			}, null, 8, [
				"ambiguous-grant-count",
				"is-loading-lore-options",
				"magic-grants",
				"onResolveLores"
			]),
			o[0] ||= U("div", { class: "dui-divider" }, null, -1),
			W(tv, {
				"ambiguous-grant-count": F(t).length,
				"error-message": F(i),
				"is-loading-spells": F(c),
				"resolved-grant-count": F(m),
				"selected-spell-count": F(h).length,
				spells: F(_),
				onRefreshSpells: F(l),
				onRemoveCustomSpell: F(p),
				onSpellDrop: F(a),
				onSpellSelectedChange: v
			}, null, 8, [
				"ambiguous-grant-count",
				"error-message",
				"is-loading-spells",
				"resolved-grant-count",
				"selected-spell-count",
				"spells",
				"onRefreshSpells",
				"onRemoveCustomSpell",
				"onSpellDrop"
			])
		]));
	}
}), rv = { class: "dui-collapse-title" }, iv = { class: "dui-badge" }, av = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, ov = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, sv = { class: "dui-collapse-content" }, cv = { class: "dui-fieldset" }, lv = { class: "dui-fieldset-legend" }, uv = [
	"aria-label",
	"value",
	"onInput"
], dv = {
	key: 0,
	class: "dui-fieldset"
}, fv = [
	"aria-label",
	"value",
	"onChange"
], pv = ["value"], mv = {
	key: 1,
	class: "dui-fieldset"
}, hv = [
	"aria-label",
	"value",
	"onInput"
], gv = ["onClick"], _v = {
	key: 0,
	class: "dui-alert"
}, vv = /* @__PURE__ */ L({
	__name: "NpcBuilderTraitsTab",
	props: { difficultyOptions: {} },
	setup(e) {
		let t = Au(), { traits: n } = xs(t);
		function r(e) {
			return e.source === "base" ? "Base" : e.source === "quick" ? "Quick" : e.source === "optional" ? "Optional" : "Custom";
		}
		function i(e) {
			if (e.source === "base") {
				t.setBaseTraitIgnored(e.key, !0);
				return;
			}
			t.removeCustomTrait(e.key);
		}
		function a(e, n, r) {
			let i = r.target;
			i && t.setTraitConfig(e.key, { [n]: i.value });
		}
		return (t, o) => (B(), H(pd, {
			description: "Open a Trait to review its WFRP configuration before building.",
			title: "Traits"
		}, {
			default: I(() => [(B(!0), V(z, null, R(F(n), (t) => (B(), V("details", {
				key: t.key,
				class: "dui-collapse dui-collapse-arrow dui-card-border"
			}, [U("summary", rv, [
				U("strong", null, A(t.name), 1),
				U("span", iv, A(r(t)), 1),
				t.config.rollable ? (B(), V("span", av, "Rollable")) : K("", !0),
				t.config.damage ? (B(), V("span", ov, "Damage")) : K("", !0)
			]), U("div", sv, [
				U("fieldset", cv, [U("legend", lv, A(t.config.damage ? "Damage" : "Specification"), 1), U("input", {
					"aria-label": `${t.config.damage ? "Damage" : "Specification"} for ${t.name}`,
					class: "dui-input dui-input-sm",
					value: t.config.specification,
					placeholder: "None",
					type: "text",
					onInput: (e) => a(t, "specification", e)
				}, null, 40, uv)]),
				t.config.rollable && !t.config.damage ? (B(), V("fieldset", dv, [o[0] ||= U("legend", { class: "dui-fieldset-legend" }, "Difficulty", -1), U("select", {
					"aria-label": `Difficulty for ${t.name}`,
					class: "dui-select dui-select-sm",
					value: t.config.defaultDifficulty,
					onChange: (e) => a(t, "defaultDifficulty", e)
				}, [(B(!0), V(z, null, R(e.difficultyOptions, (e) => (B(), V("option", {
					key: e.value,
					value: e.value
				}, A(e.label), 9, pv))), 128))], 40, fv)])) : K("", !0),
				t.config.damage && t.config.dice ? (B(), V("fieldset", mv, [o[1] ||= U("legend", { class: "dui-fieldset-legend" }, "Dice", -1), U("input", {
					"aria-label": `Dice for ${t.name}`,
					class: "dui-input dui-input-sm",
					value: t.config.dice,
					placeholder: "Optional",
					type: "text",
					onInput: (e) => a(t, "dice", e)
				}, null, 40, hv)])) : K("", !0),
				U("button", {
					class: "dui-btn dui-btn-sm",
					type: "button",
					onClick: (e) => i(t)
				}, "Remove", 8, gv)
			])]))), 128)), F(n).length ? K("", !0) : (B(), V("p", _v, "No traits are selected yet."))]),
			_: 1
		}));
	}
}), yv = "__blank-item__";
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderTrappingsTab/resolution-labels.ts
function bv(e) {
	return e.source === "base" ? "Base" : e.source === "career" ? "Career" : "Custom";
}
function xv(e) {
	return e.resolution.status === "matched" ? `Matched ${e.resolution.selectedName}` : e.resolution.status === "fallback" ? `Blank ${e.resolution.selectedName || e.name}` : e.resolution.candidates.length ? "Choose a match" : "Needs resolution";
}
function Sv(e) {
	return e.ignored ? "Ignored" : e.resolution.status === "matched" ? "Matched" : e.resolution.status === "fallback" ? "Blank item" : e.resolution.status === "ambiguous" || e.resolution.candidates.length ? "Choose" : "Needs resolution";
}
function Cv(e) {
	let t = "dui-badge";
	return e.ignored ? [t, "dui-badge-ghost"] : e.resolution.status === "matched" ? [t, "dui-badge-success"] : e.resolution.status === "fallback" ? [t, "dui-badge-info"] : e.resolution.status === "ambiguous" || e.resolution.candidates.length ? [t, "dui-badge-warning"] : [t, "dui-badge-error"];
}
function wv(e) {
	return e.resolution.status === "fallback" ? yv : e.resolution.selectedCandidateUuid;
}
function Tv(e) {
	return e.source === "career";
}
function Ev(e) {
	return e.resolution.candidates.length > 0 || Tv(e);
}
function Dv(e) {
	return e.resolution.searchTerms.length <= 1 ? "" : `Options: ${e.resolution.searchTerms.join(" / ")}`;
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderTrappingsTab/TrappingsTable.vue?vue&type=script&setup=true&lang.ts
var Ov = {
	key: 0,
	class: "dui-list"
}, kv = [
	"aria-label",
	"checked",
	"onChange"
], Av = { class: "dui-list-col-grow app:grid app:gap-2" }, jv = { key: 0 }, Mv = {
	key: 1,
	class: "dui-fieldset"
}, Nv = [
	"aria-label",
	"value",
	"onChange"
], Pv = {
	key: 0,
	value: ""
}, Fv = ["value"], Iv = ["value"], Lv = { key: 2 }, Rv = { class: "dui-card-actions" }, zv = { class: "dui-fieldset" }, Bv = [
	"aria-label",
	"value",
	"onInput"
], Vv = ["onClick"], Hv = {
	key: 1,
	class: "dui-alert"
}, Uv = /* @__PURE__ */ L({
	__name: "TrappingsTable",
	props: { trappings: {} },
	emits: [
		"quantityInput",
		"removeCustomTrapping",
		"resolutionChange",
		"useChange"
	],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => e.trappings.length ? (B(), V("ul", Ov, [(B(!0), V(z, null, R(e.trappings, (e) => (B(), V("li", {
			key: e.key,
			class: "dui-list-row"
		}, [U("input", {
			"aria-label": `Use ${e.name}`,
			class: "dui-checkbox dui-checkbox-sm",
			checked: !e.ignored,
			type: "checkbox",
			onChange: (t) => n("useChange", e.key, t)
		}, null, 40, kv), U("div", Av, [
			U("strong", null, A(e.name), 1),
			U("span", null, A(e.resolution.selectedItemType || e.itemType || "trapping") + " · " + A(F(bv)(e)), 1),
			F(Dv)(e) ? (B(), V("span", jv, A(F(Dv)(e)), 1)) : K("", !0),
			U("span", { class: k(F(Cv)(e)) }, A(F(Sv)(e)), 3),
			F(Ev)(e) ? (B(), V("fieldset", Mv, [r[0] ||= U("legend", { class: "dui-fieldset-legend" }, "Resolution", -1), U("select", {
				"aria-label": `Resolution for ${e.name}`,
				class: "dui-select dui-select-sm",
				value: F(wv)(e),
				onChange: (t) => n("resolutionChange", e.key, t)
			}, [
				e.resolution.candidates.length ? (B(), V("option", Pv, "Choose match")) : K("", !0),
				(B(!0), V(z, null, R(e.resolution.candidates, (e) => (B(), V("option", {
					key: e.uuid,
					value: e.uuid
				}, A(e.name) + " (" + A(e.sourceLabel) + ") ", 9, Fv))), 128)),
				F(Tv)(e) ? (B(), V("option", {
					key: 1,
					value: F(yv)
				}, " Blank Item ", 8, Iv)) : K("", !0)
			], 40, Nv)])) : (B(), V("span", Lv, A(F(xv)(e)), 1)),
			U("div", Rv, [U("fieldset", zv, [r[1] ||= U("legend", { class: "dui-fieldset-legend" }, "Quantity", -1), U("input", {
				"aria-label": `Quantity for ${e.name}`,
				class: "dui-input dui-input-sm",
				value: e.quantity,
				min: "1",
				type: "number",
				onInput: (t) => n("quantityInput", e.key, t)
			}, null, 40, Bv)]), e.source === "custom" ? (B(), V("button", {
				key: 0,
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: (t) => n("removeCustomTrapping", e.key)
			}, " Remove ", 8, Vv)) : K("", !0)])
		])]))), 128))])) : (B(), V("p", Hv, "No trappings are selected yet."));
	}
}), Wv = { class: "dui-card-actions" }, Gv = ["disabled"], Kv = { key: 0 }, qv = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, Jv = /* @__PURE__ */ L({
	__name: "NpcBuilderTrappingsTab",
	props: { bridge: {} },
	setup(e) {
		let t = e, n = Au(), { trappings: r } = xs(n), i = /* @__PURE__ */ P(""), a = /* @__PURE__ */ P(!1), o = q(() => r.value.filter((e) => !e.ignored && e.resolution.status === "unresolved"));
		mr(() => {
			u();
		});
		function s(e, t) {
			let r = t.target;
			r && n.setTrappingQuantity(e, Number(r.value));
		}
		function c(e, t) {
			let r = t.target;
			r && n.setTrappingIgnored(e, !r.checked);
		}
		function l(e, t) {
			let r = t.target;
			if (r?.value) {
				if (r.value === "__blank-item__") {
					n.setTrappingFallback(e);
					return;
				}
				n.selectTrappingResolutionCandidate(e, r.value);
			}
		}
		async function u() {
			if (o.value.length) {
				a.value = !0, i.value = "";
				try {
					for (let e of o.value) n.setTrappingResolution(e.key, await t.bridge.resolveTrapping(e.name));
				} catch (e) {
					i.value = d(e);
				} finally {
					a.value = !1;
				}
			}
		}
		function d(e) {
			return e instanceof Error ? e.message : "The NPC Builder could not resolve that Trapping drop.";
		}
		return (e, t) => (B(), H(pd, {
			description: "Review the Items that will be embedded in the generated NPC.",
			title: "Trappings"
		}, {
			default: I(() => [
				U("div", Wv, [U("button", {
					class: "dui-btn dui-btn-sm",
					disabled: a.value || !o.value.length,
					type: "button",
					onClick: u
				}, A(a.value ? "Resolving..." : "Resolve Trappings"), 9, Gv), o.value.length ? (B(), V("span", Kv, A(o.value.length) + " unresolved ", 1)) : K("", !0)]),
				i.value ? (B(), V("p", qv, A(i.value), 1)) : K("", !0),
				W(Uv, {
					trappings: F(r),
					onQuantityInput: s,
					onRemoveCustomTrapping: F(n).removeCustomTrapping,
					onResolutionChange: l,
					onUseChange: c
				}, null, 8, ["trappings", "onRemoveCustomTrapping"])
			]),
			_: 1
		}));
	}
});
//#endregion
//#region src/functions/npc-builder/career-workflow/skill-resolution.ts
function Yv(e, t) {
	let n = /* @__PURE__ */ new Map(), r = [], i = [];
	for (let a of e) {
		let e = /* @__PURE__ */ new Map();
		for (let o of Bs(a.career.uuid, a.career.grants.skills)) {
			let s = zs(o.originalName);
			if (!s) continue;
			let c = Vs(o.originalName), l = n.get(c) ?? [], u = e.get(c) ?? 0, d = t.enableLinkedSkillResolution && l[u] ? l[u] : "";
			if (e.set(c, u + 1), d) {
				r.push({
					linkedFromKey: d,
					resolutionKey: o.resolutionKey
				});
				continue;
			}
			i.push({
				alreadyGrantedSpecializations: ey(a.career.grants.skills, s.baseName),
				baseName: s.baseName,
				careerLabel: ty(a.career),
				isLoadingSuggestions: !1,
				occurrence: o.occurrence,
				options: s.options,
				originalName: s.originalName,
				resolvedSpecialization: ny(s),
				resolutionKey: o.resolutionKey,
				specialization: s.specialization,
				suggestedSpecializations: []
			}), l[u] = o.resolutionKey, n.set(c, l);
		}
	}
	return {
		entries: e,
		linkedRows: r,
		message: t.message,
		rows: i
	};
}
function Xv(e) {
	return e.resolvedSpecialization.trim() ? Ls(e.baseName, e.resolvedSpecialization) : "";
}
function Zv(e) {
	return e.occurrence > 0 ? `${e.originalName}, choice ${e.occurrence + 1}` : e.originalName;
}
function Qv(e) {
	return e.options.length <= 1 && e.specialization.trim().toLocaleLowerCase() === "any";
}
function $v(e, t) {
	let n = Vs(t);
	return e.alreadyGrantedSpecializations.some((e) => Vs(e) === n);
}
function ey(e, t) {
	let n = Vs(t), r = /* @__PURE__ */ new Set(), i = [];
	for (let t of e) {
		let e = Rs(t);
		if (!e || Vs(e.baseName) !== n) continue;
		let a = Vs(e.specialization);
		r.has(a) || (r.add(a), i.push(e.specialization));
	}
	return i;
}
function ty(e) {
	return e.level === null ? e.name : `${e.name}, tier ${e.level}`;
}
function ny(e) {
	return e.specialization.trim().toLocaleLowerCase() === "any" ? "" : e.options[0] ?? "";
}
//#endregion
//#region src/view/apps/npc-builder/components/SkillResolutionPromptContent.vue?vue&type=script&setup=true&lang.ts
var ry = { class: "dui-card-body" }, iy = { class: "dui-card-title" }, ay = { class: "dui-badge" }, oy = { class: "dui-fieldset" }, sy = { class: "app:grid app:gap-1" }, cy = ["onUpdate:modelValue", "aria-label"], ly = ["value"], uy = [
	"onUpdate:modelValue",
	"aria-label",
	"placeholder"
], dy = {
	key: 0,
	class: "dui-label app:text-error"
}, fy = {
	key: 0,
	class: "dui-card-actions"
}, py = { key: 0 }, my = ["onClick"], hy = {
	key: 0,
	class: "dui-badge dui-badge-error dui-badge-xs"
}, gy = {
	key: 0,
	class: "dui-alert dui-alert-info"
}, _y = { class: "dui-card-actions" }, vy = /* @__PURE__ */ L({
	__name: "SkillResolutionPromptContent",
	props: {
		getSkillResolutionLabel: { type: Function },
		prompt: {},
		usesFreeformSkillSpecialization: { type: Function }
	},
	emits: [
		"addWithoutResolving",
		"applySpecializations",
		"chooseSkillSpecialization"
	],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			return !!e.resolvedSpecialization && $v(e, e.resolvedSpecialization);
		}
		return (t, i) => (B(), V("section", null, [
			i[5] ||= U("p", null, " Some Career skills need a specialization before they become concrete WFRP skills. Blank rows can be left unresolved and edited later. ", -1),
			(B(!0), V(z, null, R(e.prompt.rows, (t) => (B(), V("section", {
				key: t.resolutionKey,
				class: "dui-card dui-card-border dui-card-sm"
			}, [U("div", ry, [
				U("h3", iy, A(e.getSkillResolutionLabel(t)), 1),
				U("span", ay, A(t.careerLabel), 1),
				U("fieldset", oy, [
					i[4] ||= U("legend", { class: "dui-fieldset-legend" }, "Specialization", -1),
					U("label", sy, [i[3] ||= U("span", { class: "dui-label" }, "Choice", -1), t.options.length > 1 ? Rn((B(), V("select", {
						key: 0,
						"onUpdate:modelValue": (e) => t.resolvedSpecialization = e,
						"aria-label": `Specialization for ${e.getSkillResolutionLabel(t)}`,
						class: k(["dui-select dui-select-sm", { "dui-select-error": F($v)(t, t.resolvedSpecialization) }])
					}, [i[2] ||= U("option", { value: "" }, "Leave unresolved", -1), (B(!0), V(z, null, R(t.options, (e) => (B(), V("option", {
						key: e,
						class: k({ "app:text-error": F($v)(t, e) }),
						value: e
					}, A(e) + A(F($v)(t, e) ? " — already granted" : ""), 11, ly))), 128))], 10, cy)), [[Do, t.resolvedSpecialization]]) : Rn((B(), V("input", {
						key: 1,
						"onUpdate:modelValue": (e) => t.resolvedSpecialization = e,
						"aria-label": `Specialization for ${e.getSkillResolutionLabel(t)}`,
						class: k(["dui-input dui-input-sm", { "dui-input-error": F($v)(t, t.resolvedSpecialization) }]),
						placeholder: t.suggestedSpecializations.length ? "Type or choose below" : t.specialization,
						type: "text"
					}, null, 10, uy)), [[wo, t.resolvedSpecialization]])]),
					r(t) ? (B(), V("p", dy, " Already granted by this Career. ")) : K("", !0)
				]),
				e.usesFreeformSkillSpecialization(t) ? (B(), V("div", fy, [t.isLoadingSuggestions ? (B(), V("small", py, "Finding known choices.")) : K("", !0), (B(!0), V(z, null, R(t.suggestedSpecializations, (e) => (B(), V("button", {
					key: `${t.resolutionKey}:${e}`,
					class: k(["dui-btn dui-btn-sm", { "dui-btn-error dui-btn-outline": F($v)(t, e) }]),
					type: "button",
					onClick: (r) => n("chooseSkillSpecialization", t, e)
				}, [G(A(e) + " ", 1), F($v)(t, e) ? (B(), V("span", hy, " Already granted ")) : K("", !0)], 10, my))), 128))])) : K("", !0)
			])]))), 128)),
			e.prompt.linkedRows.length ? (B(), V("div", gy, A(e.prompt.linkedRows.length) + " linked skill specialization" + A(e.prompt.linkedRows.length === 1 ? "" : "s") + " will reuse earlier choices from this career chain. ", 1)) : K("", !0),
			U("div", _y, [U("button", {
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: i[0] ||= (e) => n("addWithoutResolving")
			}, " Add Without Resolving "), U("button", {
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: i[1] ||= (e) => n("applySpecializations")
			}, " Apply Specializations ")])
		]));
	}
});
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp/types.ts
function yy(e) {
	return e === "build-actor" || e === "build-careers" || e === "build-quick";
}
function by(e) {
	return e === "settings-advancement" || e === "settings-folders" || e === "settings-resolution" || e === "settings-suggestions";
}
function xy(e) {
	return e === "automatic-xp" || e === "detail-characteristics" || e === "detail-skills" || e === "detail-talents";
}
function Sy(e) {
	return {
		"automatic-xp": "Automatic XP Advancement",
		"build-actor": "Choose Actor",
		"build-careers": "Queue Careers",
		"build-quick": "Quick Build",
		"detail-characteristics": "Characteristics",
		"detail-skills": "Skills",
		"detail-spells": "Spells",
		"detail-talents": "Talents",
		mount: "Combined Profile",
		"settings-advancement": "Advancement Settings",
		"settings-folders": "Folder Settings",
		"settings-resolution": "Resolution Settings",
		"settings-suggestions": "Suggestion Settings",
		traits: "Traits",
		trappings: "Trappings"
	}[e];
}
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp/NpcBuilderMegaMenuContent.vue?vue&type=script&setup=true&lang.ts
var Cy = ["aria-current", "onClick"], wy = ["aria-current", "popovertarget"], Ty = ["id"], Ey = ["onClick"], Dy = /* @__PURE__ */ L({
	__name: "NpcBuilderMegaMenuContent",
	props: {
		activePage: {},
		groups: {}
	},
	emits: ["pageSelect"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (B(), V(z, null, [r[0] ||= U("span", { class: "dui-megamenu-active" }, null, -1), (B(!0), V(z, null, R(e.groups, (t) => (B(), V(z, { key: t.key }, ["page" in t ? (B(), V("button", {
			key: 0,
			"aria-current": t.isActive ? "page" : void 0,
			type: "button",
			onClick: (e) => n("pageSelect", t.page, e)
		}, A(t.label), 9, Cy)) : (B(), V(z, { key: 1 }, [U("button", {
			"aria-current": t.isActive ? "page" : void 0,
			popovertarget: t.popoverId,
			type: "button"
		}, A(t.label), 9, wy), U("div", {
			id: t.popoverId,
			popover: ""
		}, [U("ul", { class: k(["dui-menu app:min-w-56 app:p-2", t.columnsClass]) }, [(B(!0), V(z, null, R(t.pages, (t) => (B(), V("li", { key: t.page }, [U("button", {
			class: k({ "dui-menu-active": e.activePage === t.page }),
			type: "button",
			onClick: (e) => n("pageSelect", t.page, e)
		}, A(F(Sy)(t.page)), 11, Ey)]))), 128))], 2)], 8, Ty)], 64))], 64))), 128))], 64));
	}
}), Oy = { class: "dui-navbar app:sticky app:top-0 app:z-20 app:flex-wrap app:gap-2 app:bg-base-200 app:px-3 app:py-2" }, ky = { class: "dui-navbar-start app:min-w-64 app:flex-1" }, Ay = { class: "app:min-w-0" }, jy = { class: "app:text-base-content/70" }, My = {
	"aria-label": "NPC Builder pages",
	class: "app:order-3 app:flex app:w-full app:flex-wrap app:items-center app:justify-start app:gap-2"
}, Ny = {
	id: "npc-builder-megamenu",
	class: "dui-megamenu max-sm:dui-megamenu-vertical dui-megamenu-sm app:ml-0 app:mr-auto app:border app:border-base-300 app:bg-base-100 app:p-2",
	popover: ""
}, Py = { class: "dui-navbar-end app:w-auto app:shrink-0" }, Fy = ["disabled"], Iy = /* @__PURE__ */ L({
	__name: "NpcBuilderMegaMenu",
	props: {
		activePage: {},
		canBuild: { type: Boolean },
		finalActorName: {},
		hasSpellPage: { type: Boolean },
		selectedBaseActorName: {}
	},
	emits: ["buildNpc", "pageChange"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = [
			{
				page: "build-quick",
				summary: "Actor, one Career chain, quick Traits"
			},
			{
				page: "build-actor",
				summary: "Base Actor selection and summary"
			},
			{
				page: "build-careers",
				summary: "Ordered Career queue"
			}
		], a = [
			{
				page: "detail-characteristics",
				summary: "Characteristic totals and advances"
			},
			{
				page: "detail-skills",
				summary: "Skill advances and specializations"
			},
			{
				page: "detail-talents",
				summary: "Talent ranks and maximums"
			},
			{
				page: "traits",
				summary: "Creature and NPC Trait tuning"
			},
			{
				page: "trappings",
				summary: "Equipment resolution and quantities"
			},
			{
				page: "mount",
				summary: "Combined rider and mount profile"
			}
		], o = {
			page: "detail-spells",
			summary: "Magic grants and dropped spells"
		}, s = [
			{
				page: "settings-folders",
				summary: "Base, output, and source folders"
			},
			{
				page: "settings-suggestions",
				summary: "Names and portrait suggestions"
			},
			{
				page: "settings-resolution",
				summary: "Career, trapping, and magic defaults"
			},
			{
				page: "settings-advancement",
				summary: "Base Actor advancement inclusion"
			}
		], c = q(() => [
			{
				columnsClass: "",
				isActive: n.activePage.startsWith("build-"),
				key: "build",
				label: "Build NPC",
				pages: i,
				popoverId: "npc-builder-megamenu-build"
			},
			{
				columnsClass: "",
				isActive: n.activePage.startsWith("detail-") || n.activePage === "traits" || n.activePage === "trappings" || n.activePage === "mount",
				key: "detailed",
				label: "Detailed Build",
				pages: n.hasSpellPage ? [...a, o] : a,
				popoverId: "npc-builder-megamenu-detailed"
			},
			{
				isActive: n.activePage === "automatic-xp",
				key: "automatic-xp",
				label: "Automatic XP Advancement",
				page: "automatic-xp"
			},
			{
				columnsClass: "",
				isActive: n.activePage.startsWith("settings-"),
				key: "settings",
				label: "Settings",
				pages: s,
				popoverId: "npc-builder-megamenu-settings"
			}
		]);
		function l(e, t) {
			r("pageChange", e), u(t.currentTarget);
		}
		function u(e) {
			e instanceof HTMLElement && (d(e.closest("[popover]")), d(e.closest(".dui-megamenu")));
		}
		function d(e) {
			e instanceof HTMLElement && e.matches(":popover-open") && e.hidePopover();
		}
		return (t, n) => (B(), V("header", Oy, [
			U("div", ky, [U("div", Ay, [
				n[1] ||= U("span", { class: "dui-badge dui-badge-outline" }, "WFRP4e Customizer", -1),
				n[2] ||= U("h1", { class: "app:m-0 app:text-xl app:leading-tight" }, "NPC Builder", -1),
				U("small", jy, [e.selectedBaseActorName ? (B(), V(z, { key: 0 }, [G(A(e.selectedBaseActorName) + " base · " + A(e.finalActorName), 1)], 64)) : (B(), V(z, { key: 1 }, [G("Choose a base character, then shape the final NPC.")], 64))])
			])]),
			U("nav", My, [n[3] ||= U("button", {
				"aria-label": "Open NPC Builder navigation",
				class: "dui-btn dui-btn-sm sm:app:hidden",
				popovertarget: "npc-builder-megamenu",
				type: "button"
			}, " Menu ", -1), U("div", Ny, [W(Dy, {
				"active-page": e.activePage,
				groups: c.value,
				onPageSelect: l
			}, null, 8, ["active-page", "groups"])])]),
			U("div", Py, [U("button", {
				class: "dui-btn dui-btn-primary",
				disabled: !e.canBuild,
				type: "button",
				onClick: n[0] ||= (e) => r("buildNpc")
			}, " Build NPC ", 8, Fy)])
		]));
	}
});
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp/useNpcBuilderApplicationDrop.ts
function Ly(e, t, n, r) {
	let i = Au(), a = /* @__PURE__ */ P(!1);
	function o(e) {
		Ry(e) || (e.preventDefault(), a.value = !0);
	}
	function s(e) {
		if (Ry(e)) return;
		let t = e.currentTarget, n = e.relatedTarget;
		t instanceof Node && n instanceof Node && t.contains(n) || (a.value = !1);
	}
	function c(e) {
		Ry(e) || (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"));
	}
	async function l(o) {
		if (!Ry(o)) {
			o.preventDefault(), a.value = !1, r.value = "";
			try {
				let r = await e.resolveApplicationDrop(o.dataTransfer?.getData("text/plain") ?? "");
				r.kind === "actor" ? i.selectBaseActor(r.actor) : r.kind === "career" ? await n(r.career, { replaceQueue: t.value === "build-quick" }) : r.kind === "advancement" ? i.addCustomAdvancement(r.advancement) : r.kind === "trapping" ? i.addCustomTrapping(r.trapping) : r.kind === "trait" ? i.addCustomTrait(r.trait) : i.addCustomSpell(r.spell);
			} catch (e) {
				r.value = zh(e);
			}
		}
	}
	return {
		handleApplicationDragEnter: o,
		handleApplicationDragLeave: s,
		handleApplicationDragOver: c,
		handleApplicationDrop: l,
		isApplicationDragOver: a
	};
}
function Ry(e) {
	let t = e.dataTransfer, n = t?.getData("text/plain") ?? "", r = Array.from(t?.types ?? []);
	return n.startsWith("npc-builder-career:") || gl(n) !== null || r.includes(zm);
}
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp/useNpcBuilderBuild.ts
function zy(e, t, n, r, i) {
	let a = Au(), { advancements: o, buildTraits: s, careers: c, finalActorName: l, finalPortraitPath: u, selectedMountActorUuid: d, selectedBaseActor: f, selectedSpells: p, settings: m, trappings: h } = xs(a), g = /* @__PURE__ */ P(!1), _ = q(() => !!(f.value && c.value.length && !g.value && !i.value));
	async function v() {
		if (!f.value || !c.value.length) return;
		g.value = !0, r.value = "", n.value = "Building actor from the selected draft.";
		let i = {
			actorName: l.value,
			advancements: o.value,
			baseActorUuid: f.value.uuid,
			careers: c.value,
			mountActorUuid: d.value,
			portraitPath: u.value,
			settings: m.value,
			spells: p.value,
			traits: s.value,
			trappings: h.value
		};
		try {
			n.value = `Created ${(await e.buildNpc(i)).name}.`, a.resetDraft(), t.value = "build-quick";
		} catch (e) {
			r.value = zh(e), n.value = "";
		} finally {
			g.value = !1;
		}
	}
	return {
		buildNpc: v,
		canBuild: _,
		isBusy: g
	};
}
//#endregion
//#region src/functions/npc-builder/career-workflow/lower-careers.ts
function By(e) {
	if (!e) return [];
	let t = /* @__PURE__ */ new Map();
	for (let n of e.candidates) {
		let e = n.level ?? 0, r = t.get(e) ?? [];
		r.push(n), t.set(e, r);
	}
	return [...t.entries()].sort(([e], [t]) => e - t).map(([e, t]) => ({
		candidates: [...t].sort((e, t) => e.name.localeCompare(t.name)),
		level: e
	}));
}
function Vy(e) {
	return [{
		career: e,
		mode: "add-or-increment"
	}];
}
function Hy(e) {
	return [...e.candidates.filter((t) => e.selectedUuids.includes(t.uuid)).map((e) => ({
		career: e,
		mode: "add-if-missing"
	})), {
		career: e.droppedCareer,
		mode: "add-or-increment"
	}];
}
function Uy(e) {
	let t = e.candidates.filter((t) => e.selectedUuids.includes(t.uuid)).length;
	return t === 0 ? "" : `Added ${t} lower-tier career candidate${t === 1 ? "" : "s"}.`;
}
function Wy(e, t) {
	return e?.selectedUuids.includes(t) ?? !1;
}
function Gy(e) {
	let { candidateUuid: t, isAlreadyQueued: n, prompt: r, selected: i } = e;
	return !r || n ? null : i ? [...new Set([...r.selectedUuids, t])] : r.selectedUuids.filter((e) => e !== t);
}
//#endregion
//#region src/state/npc-builder/workflows/skill-suggestions.ts
async function Ky(e, t) {
	await Promise.all(t.rows.map(async (t) => {
		if (Qv(t)) {
			t.isLoadingSuggestions = !0;
			try {
				t.suggestedSpecializations = await e.listSkillSpecializations(t.baseName);
			} catch {
				t.suggestedSpecializations = [];
			} finally {
				t.isLoadingSuggestions = !1;
			}
		}
	}));
}
//#endregion
//#region src/state/npc-builder/workflows/career-drop-workflow.ts
function qy(e) {
	let t = Au(), { careers: n, settings: r } = xs(t), i = /* @__PURE__ */ P(""), a = /* @__PURE__ */ P(""), o = /* @__PURE__ */ P(!1), s = /* @__PURE__ */ P(null), c = /* @__PURE__ */ P(null), l = q(() => By(s.value));
	async function u(t, n = {}) {
		a.value = "";
		try {
			await d(await e.resolveCareerDrop(t), n);
		} catch (e) {
			a.value = Jy(e);
		}
	}
	async function d(e, n = {}) {
		if (n.replaceQueue && t.clearCareers(), r.value.lowerCareerMode === "never") {
			p(e);
			return;
		}
		o.value = !0, i.value = "Checking for lower-tier career candidates.";
		try {
			await f(e);
		} finally {
			o.value = !1;
		}
	}
	async function f(t) {
		let n = await e.findLowerCareerCandidates(t), a = n.filter((e) => !x(e.uuid));
		if (!a.length) {
			p(t), i.value = "";
			return;
		}
		if (r.value.lowerCareerMode === "auto-add-all") {
			m([...a.map((e) => ({
				career: e,
				mode: "add-if-missing"
			})), {
				career: t,
				mode: "add-or-increment"
			}], {
				enableLinkedSkillResolution: !r.value.askForLinkedSkillSpecializations,
				message: `Added ${a.length} lower-tier career candidate${a.length === 1 ? "" : "s"}.`
			});
			return;
		}
		s.value = {
			candidates: n,
			droppedCareer: t,
			selectedUuids: a.map((e) => e.uuid)
		}, i.value = "";
	}
	function p(e) {
		m(Vy(e), {
			enableLinkedSkillResolution: !1,
			message: ""
		});
	}
	function m(t, n) {
		let r = Yv(t, n);
		if (r.rows.length) {
			c.value = r, Ky(e, c.value);
			return;
		}
		b(t, n.message);
	}
	function h() {
		let e = s.value;
		e && (s.value = null, m(Hy(e), {
			enableLinkedSkillResolution: !r.value.askForLinkedSkillSpecializations,
			message: Uy(e)
		}));
	}
	function g(e, t) {
		e.resolvedSpecialization = t;
	}
	function _() {
		let e = s.value;
		e && (s.value = null, p(e.droppedCareer));
	}
	function v() {
		let e = c.value;
		if (e) {
			for (let n of e.rows) t.setSkillGrantResolution(n.resolutionKey, Xv(n));
			for (let n of e.linkedRows) t.setSkillGrantResolution(n.resolutionKey, t.getSkillGrantResolution(n.linkedFromKey));
			c.value = null, b(e.entries, e.message);
		}
	}
	function y() {
		let e = c.value;
		e && (c.value = null, b(e.entries, e.message));
	}
	function b(e, n) {
		for (let n of e) n.mode === "add-if-missing" ? t.addCareerIfMissing(n.career) : t.addCareer(n.career);
		i.value = n;
	}
	function x(e) {
		return n.value.some((t) => t.uuid === e);
	}
	function S(e) {
		return Wy(s.value, e);
	}
	function C(e, t) {
		let n = Gy({
			candidateUuid: e.uuid,
			isAlreadyQueued: x(e.uuid),
			prompt: s.value,
			selected: t
		});
		n && s.value && (s.value.selectedUuids = n);
	}
	return {
		buildMessage: i,
		chooseSkillSpecialization: g,
		confirmLowerCareerPrompt: h,
		confirmSkillResolutionPrompt: v,
		dismissLowerCareerPrompt: _,
		dismissSkillResolutionPrompt: y,
		errorMessage: a,
		getSkillResolutionLabel: Zv,
		addCareerSummaryWithLowerCareerMode: d,
		handleCareerDrop: u,
		isCareerQueued: x,
		isFindingLowerCareers: o,
		isLowerCareerSelected: S,
		lowerCareerCandidateGroups: l,
		pendingLowerCareerPrompt: s,
		pendingSkillResolutionPrompt: c,
		setLowerCareerSelected: C,
		usesFreeformSkillSpecialization: Qv
	};
}
function Jy(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp/useNpcBuilderCareerDropWorkflow.ts
function Yy(e) {
	return qy(e);
}
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp/useNpcBuilderInitialData.ts
function Xy(e, t) {
	let n = Au(), { selectedBaseActorUuid: r, selectedMountActorUuid: i, settings: a } = xs(n), o = /* @__PURE__ */ P(!1), s = /* @__PURE__ */ P(!1), c = /* @__PURE__ */ P([]);
	mr(async () => {
		o.value = !0;
		try {
			let [t, r, i, a] = await Promise.all([
				e.loadSettings(),
				e.listActorFolders(),
				e.listItemFolders(),
				e.listTraitDifficultyOptions()
			]);
			n.hydrateSettings(t), n.hydrateActorFolders(r), n.hydrateItemFolders(i), c.value = a, await Promise.all([
				l(),
				d(),
				u()
			]);
		} catch (e) {
			t.value = zh(e);
		} finally {
			o.value = !1;
		}
	}), Gn(r, async (r) => {
		if (t.value = "", !r) {
			n.clearBaseDraftData(), n.hydrateBaseActorCombatProfile(null);
			return;
		}
		r === i.value && n.clearMountSelection(), n.hydrateBaseActorCombatProfile(null), s.value = !0;
		try {
			let [t, i] = await Promise.all([e.loadBaseActorDraftData(r), e.loadActorCombatProfile(r)]);
			n.hydrateBaseActorDraftData(t), n.hydrateBaseActorCombatProfile(i);
		} catch (e) {
			t.value = zh(e), n.clearBaseDraftData(), n.hydrateBaseActorCombatProfile(null);
		} finally {
			s.value = !1;
		}
	});
	async function l() {
		n.hydrateBaseActors(await e.listBaseActors(a.value));
	}
	async function u() {
		n.hydrateQuickTraits(await e.listQuickTraits(a.value));
	}
	async function d() {
		n.hydrateMountActors(await e.listMountActors());
	}
	return {
		isLoadingActors: o,
		isLoadingBaseDraft: s,
		refreshBaseActors: l,
		refreshMountActors: d,
		refreshQuickTraits: u,
		traitDifficultyOptions: c
	};
}
//#endregion
//#region src/functions/npc-builder/metadata-lookups.ts
function Zy() {
	return {
		inFlightNames: [],
		successfulNames: []
	};
}
function Qy(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.kind === "skill" && !n.characteristicKey && !zs(n.name) && t.add(n.name);
	return [...t];
}
function $y(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.kind === "talent" && !n.talentMaximumKey && t.add(n.name);
	return [...t];
}
function eb(e, t) {
	let n = new Set([...t.inFlightNames, ...t.successfulNames]);
	return e.filter((e) => {
		let t = Vs(e);
		return n.has(t) ? !1 : (n.add(t), !0);
	});
}
function tb(e, t) {
	return {
		...e,
		inFlightNames: ib([...e.inFlightNames, ...t])
	};
}
function nb(e, t) {
	let n = new Set(ib(t));
	return {
		inFlightNames: e.inFlightNames.filter((e) => !n.has(e)),
		successfulNames: ib([...e.successfulNames, ...n])
	};
}
function rb(e, t) {
	let n = new Set(ib(t));
	return {
		...e,
		inFlightNames: e.inFlightNames.filter((e) => !n.has(e))
	};
}
function ib(e) {
	return [...new Set([...e].map(Vs).filter(Boolean))];
}
//#endregion
//#region src/state/npc-builder/workflows/metadata-lookups-workflow.ts
function ab(e) {
	let t = Au(), { advancements: n } = xs(t), r = /* @__PURE__ */ P(Zy()), i = /* @__PURE__ */ P(Zy()), a = /* @__PURE__ */ P(""), o = /* @__PURE__ */ P(""), s = q(() => Qy(n.value)), c = q(() => $y(n.value)), l = q(() => [a.value, o.value].filter(Boolean).join(" ")), u = q(() => l.value ? "degraded" : r.value.inFlightNames.length + i.value.inFlightNames.length > 0 ? "loading" : "ready");
	Gn(s, (e) => {
		d(e);
	}, { immediate: !0 }), Gn(c, (e) => {
		f(e);
	}, { immediate: !0 });
	async function d(n) {
		if (!n.length) {
			a.value = "";
			return;
		}
		let i = eb(n, r.value);
		if (i.length) {
			r.value = tb(r.value, i), a.value = "";
			try {
				let n = await e.listSkillCharacteristics(i);
				r.value = nb(r.value, i), t.hydrateSkillCharacteristics(n);
			} catch (e) {
				r.value = rb(r.value, i), a.value = ob("skill characteristics", e);
			}
		}
	}
	async function f(n) {
		if (!n.length) {
			o.value = "";
			return;
		}
		let r = eb(n, i.value);
		if (r.length) {
			i.value = tb(i.value, r), o.value = "";
			try {
				let n = await e.listTalentMaximums(r);
				i.value = nb(i.value, r), t.hydrateTalentMaximums(n);
			} catch (e) {
				i.value = rb(i.value, r), o.value = ob("Talent maximums", e);
			}
		}
	}
	async function p() {
		await Promise.all([d(s.value), f(c.value)]);
	}
	return {
		metadataLookupError: l,
		metadataLookupStatus: u,
		retryMetadataLookups: p
	};
}
function ob(e, t) {
	return `Could not load ${e}.${t instanceof Error ? ` ${t.message}` : ""}`;
}
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp/useNpcBuilderMetadataLookups.ts
function sb(e) {
	return ab(e);
}
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp.vue?vue&type=script&setup=true&lang.ts
var cb = ["id", "aria-label"], lb = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, ub = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, db = {
	key: 2,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, fb = {
	key: 3,
	"aria-live": "polite",
	class: "dui-alert dui-alert-warning",
	role: "status"
}, pb = /* @__PURE__ */ L({
	__name: "NpcBuilderApp",
	props: { bridge: {} },
	setup(e) {
		let t = e, { finalActorName: n, hasMagicAccess: r, selectedBaseActor: i, selectedSpells: a } = xs(Au()), o = /* @__PURE__ */ P("build-quick"), s = $n(), c = q(() => r.value || a.value.length > 0), { addCareerSummaryWithLowerCareerMode: l, buildMessage: u, chooseSkillSpecialization: d, confirmLowerCareerPrompt: f, confirmSkillResolutionPrompt: p, dismissLowerCareerPrompt: m, dismissSkillResolutionPrompt: h, errorMessage: g, getSkillResolutionLabel: _, isCareerQueued: v, isFindingLowerCareers: y, isLowerCareerSelected: b, lowerCareerCandidateGroups: x, pendingLowerCareerPrompt: S, pendingSkillResolutionPrompt: C, setLowerCareerSelected: w, usesFreeformSkillSpecialization: ee } = Yy(t.bridge), { buildNpc: te, canBuild: ne } = zy(t.bridge, o, u, g, y), { isLoadingActors: re, isLoadingBaseDraft: T, traitDifficultyOptions: E } = Xy(t.bridge, g), { metadataLookupError: ie, metadataLookupStatus: ae, retryMetadataLookups: D } = sb(t.bridge), { handleApplicationDragEnter: oe, handleApplicationDragLeave: O, handleApplicationDragOver: se, handleApplicationDrop: ce, isApplicationDragOver: le } = Ly(t.bridge, o, l, g);
		return (e, r) => (B(), V("section", {
			"aria-label": "NPC Builder",
			class: k(["app:flex app:min-h-full app:flex-col", { "app:ring-2 app:ring-info": F(le) }]),
			onDragenter: r[2] ||= (...e) => F(oe) && F(oe)(...e),
			onDragleave: r[3] ||= (...e) => F(O) && F(O)(...e),
			onDragover: r[4] ||= (...e) => F(se) && F(se)(...e),
			onDrop: r[5] ||= (...e) => F(ce) && F(ce)(...e)
		}, [
			W(Iy, {
				"active-page": o.value,
				"can-build": F(ne),
				"final-actor-name": F(n),
				"has-spell-page": c.value,
				"selected-base-actor-name": F(i)?.name ?? "",
				onBuildNpc: F(te),
				onPageChange: r[0] ||= (e) => o.value = e
			}, null, 8, [
				"active-page",
				"can-build",
				"final-actor-name",
				"has-spell-page",
				"selected-base-actor-name",
				"onBuildNpc"
			]),
			W(Ru, {
				open: F(S) !== null,
				title: "Add Lower-Tier Careers?",
				onClose: F(m)
			}, {
				default: I(() => [F(S) ? (B(), H(Pu, {
					key: 0,
					"candidate-groups": F(x),
					"is-career-queued": F(v),
					"is-lower-career-selected": F(b),
					prompt: F(S),
					onAddDroppedOnly: F(m),
					onAddSelected: F(f),
					onLowerCareerSelected: F(w)
				}, null, 8, [
					"candidate-groups",
					"is-career-queued",
					"is-lower-career-selected",
					"prompt",
					"onAddDroppedOnly",
					"onAddSelected",
					"onLowerCareerSelected"
				])) : K("", !0)]),
				_: 1
			}, 8, ["open", "onClose"]),
			W(Ru, {
				open: F(C) !== null,
				title: "Resolve Skill Specializations",
				onClose: F(h)
			}, {
				default: I(() => [F(C) ? (B(), H(vy, {
					key: 0,
					"get-skill-resolution-label": F(_),
					prompt: F(C),
					"uses-freeform-skill-specialization": F(ee),
					onAddWithoutResolving: F(h),
					onApplySpecializations: F(p),
					onChooseSkillSpecialization: F(d)
				}, null, 8, [
					"get-skill-resolution-label",
					"prompt",
					"uses-freeform-skill-specialization",
					"onAddWithoutResolving",
					"onApplySpecializations",
					"onChooseSkillSpecialization"
				])) : K("", !0)]),
				_: 1
			}, 8, ["open", "onClose"]),
			U("section", {
				id: `${F(s)}-panel`,
				"aria-label": F(Sy)(o.value),
				class: "app:grid app:flex-1 app:content-start app:gap-3 app:p-3"
			}, [
				F(g) ? (B(), V("p", lb, A(F(g)), 1)) : F(u) ? (B(), V("p", ub, A(F(u)), 1)) : F(le) ? (B(), V("p", db, " Release to add this document to the NPC draft. ")) : K("", !0),
				F(ae) === "degraded" ? (B(), V("div", fb, [
					U("span", null, A(F(ie)), 1),
					r[6] ||= U("span", null, "Advancement rows remain editable with reduced metadata.", -1),
					U("button", {
						class: "dui-btn dui-btn-sm",
						type: "button",
						onClick: r[1] ||= (...e) => F(D) && F(D)(...e)
					}, " Retry Metadata ")
				])) : K("", !0),
				F(by)(o.value) ? (B(), H(y_, {
					key: 4,
					bridge: t.bridge,
					page: o.value
				}, null, 8, ["bridge", "page"])) : F(xy)(o.value) ? (B(), H(qd, {
					key: 5,
					page: o.value
				}, null, 8, ["page"])) : o.value === "trappings" ? (B(), H(Jv, {
					key: 6,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : o.value === "traits" ? (B(), H(vv, {
					key: 7,
					"difficulty-options": F(E)
				}, null, 8, ["difficulty-options"])) : o.value === "detail-spells" ? (B(), H(nv, {
					key: 8,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : o.value === "mount" ? (B(), H(ug, {
					key: 9,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : F(yy)(o.value) ? (B(), H(Ym, {
					key: 10,
					bridge: t.bridge,
					"is-loading-actors": F(re),
					"is-loading-base-draft": F(T),
					page: o.value
				}, null, 8, [
					"bridge",
					"is-loading-actors",
					"is-loading-base-draft",
					"page"
				])) : K("", !0)
			], 8, cb)
		], 34));
	}
}), Y = "wfrp4e-customizer-apps", mb = "Drowsy's WFRP4e Customizers", hb = "wfrp4e", gb = os();
//#endregion
//#region src/module/foundry/document-drop.ts
function _b(e) {
	let t = e.value.trim();
	if (!t) return "";
	if (Tb(t)) return t;
	let n = xb(t), r = Cb(n, e.documentType);
	return r ? Eb(n) ? JSON.stringify({
		type: r,
		uuid: n
	}) : JSON.stringify({
		id: n,
		type: r
	}) : "";
}
function vb(e) {
	let t = !0;
	function n() {
		t && (t = !1, document.removeEventListener("click", r, !0));
	}
	function r(t) {
		let r = t.target;
		if (!(r instanceof Element)) return;
		let i = yb(r);
		i && (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), n(), e(i));
	}
	return document.addEventListener("click", r, !0), n;
}
function yb(e) {
	let t = e.closest("[data-uuid], [data-document-uuid], [data-entry-uuid], [data-document-id], [data-entry-id], [data-pack]");
	if (!t) return "";
	let n = t.dataset.uuid || t.dataset.documentUuid || t.dataset.entryUuid || "";
	if (n) return bb(n);
	let r = t.dataset.documentId || t.dataset.entryId || "", i = Sb(t);
	if (!r || !i) return "";
	let a = t.dataset.pack || t.closest("[data-pack]")?.dataset.pack || "";
	return JSON.stringify(a ? {
		type: i,
		uuid: `Compendium.${a}.${r}`
	} : {
		type: i,
		uuid: `${i}.${r}`
	});
}
function bb(e) {
	let t = Cb(e, "auto");
	return t ? JSON.stringify({
		type: t,
		uuid: e
	}) : "";
}
function xb(e) {
	return /@UUID\[([^\]]+)]/.exec(e)?.[1]?.trim() ?? e;
}
function Sb(e) {
	let t = e.dataset.documentName || e.dataset.type || e.closest("[data-document-name]")?.dataset.documentName || "";
	return wb(t) ? t : e.classList.contains("actor") ? "Actor" : e.classList.contains("item") ? "Item" : e.classList.contains("journal") ? "JournalEntry" : e.closest("#actors") ? "Actor" : e.closest("#items") ? "Item" : e.closest("#journal") ? "JournalEntry" : "";
}
function Cb(e, t) {
	return /^actor\./i.test(e) || /\.actors(\.|$)/i.test(e) ? "Actor" : /^item\./i.test(e) || /\.items(\.|$)/i.test(e) ? "Item" : /journalentrypage\./i.test(e) || /\.journalentrypage\./i.test(e) ? "JournalEntryPage" : /^journalentry\./i.test(e) || /\.journals(\.|$)/i.test(e) ? "JournalEntry" : t === "auto" ? "Item" : t;
}
function wb(e) {
	return e === "Actor" || e === "Item" || e === "JournalEntry" || e === "JournalEntryPage";
}
function Tb(e) {
	if (!e.startsWith("{")) return !1;
	try {
		return typeof JSON.parse(e).type == "string";
	} catch {
		return !1;
	}
}
function Eb(e) {
	return /^(actor|item|journalentry|journalentrypage|compendium)\./i.test(e);
}
var Db = {
	createDropData: _b,
	startDocumentPick: vb
}, Ob = class {
	#e;
	createRoot() {
		let e = document.createElement("div");
		return e.classList.add("wfrp4e-customizer-apps-root"), e.dataset.theme = "wfrp4e-customizer-apps", e;
	}
	mount(e, t, n, r) {
		this.unmount(), t.classList.add("wfrp4e-customizer-apps-app"), t.replaceChildren(e), this.#e = zo(n, r), this.#e.use(gb), this.#e.provide(vh, Db), this.#e.mount(e);
	}
	unmount() {
		this.#e?.unmount(), this.#e = void 0;
	}
}, kb = class extends foundry.applications.api.ApplicationV2 {
	#e = new Ob();
	getVueProps() {}
	async _renderHTML(e, t) {
		return this.#e.createRoot();
	}
	_replaceHTML(e, t, n) {
		this.#e.mount(e, t, this.getVueComponent(), this.getVueProps() ?? {});
	}
	async _preClose(e) {
		this.#e.unmount(), await super._preClose(e);
	}
};
//#endregion
//#region src/shared/object-readers.ts
function X(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Z(e, t) {
	let n = e;
	for (let e of t) {
		if (!X(n) || !(e in n)) return;
		n = n[e];
	}
	return n;
}
function Q(e, t) {
	let n = Z(e, t);
	return typeof n == "string" ? n.trim() : "";
}
function Ab(e, t) {
	let n = Z(e, t);
	return Array.isArray(n) ? n.filter((e) => typeof e == "string") : [];
}
function jb(e, t, n = 0) {
	return Mb(e, t) ?? n;
}
function Mb(e, t) {
	for (let n of t) {
		let t = Number(Z(e, n));
		if (Number.isFinite(t)) return t;
	}
	return null;
}
function Nb(e, t, n = !1) {
	for (let n of t) {
		let t = Z(e, n);
		if (typeof t == "boolean") return t;
	}
	return n;
}
function Pb(e) {
	return Array.isArray(e) ? e.flatMap(Pb) : typeof e == "string" ? e.split(/[\n\r,;]/).map((e) => e.trim()).filter(Boolean) : X(e) ? Object.values(e).flatMap(Pb) : [];
}
function Fb(e, t, n) {
	let r = e;
	for (let e of t.slice(0, -1)) {
		let t = r[e];
		X(t) || (r[e] = {}), r = r[e];
	}
	r[t[t.length - 1] ?? ""] = n;
}
//#endregion
//#region src/functions/npc-builder/extract-career-grants.ts
function Ib(e) {
	return {
		characteristics: Lb(e),
		skills: Rb(e),
		talents: Bb(e, [["talents", "value"], ["talents"]]),
		trappings: Bb(e, [["trappings", "value"], ["trappings"]])
	};
}
function Lb(e) {
	let t = Bb(e, [["characteristics", "value"], ["characteristics"]]);
	if (t.length) return t.map(zb);
	let n = Z(e, ["characteristics"]);
	if (!X(n)) return [];
	let r = [];
	for (let [e, t] of Object.entries(n)) t && r.push(zb(e));
	return Hb(r);
}
function Rb(e) {
	return Bb(e, [["skills", "value"], ["skills"]], { preserveDuplicates: !0 });
}
function zb(e) {
	let t = e.trim().toLocaleLowerCase();
	if (ws(t)) return Ss[t];
	let n = Cs[t];
	return n ? Ss[n] : e.trim();
}
function Bb(e, t, n = {}) {
	for (let r of t) {
		let t = Pb(Z(e, r));
		if (t.length) return n.preserveDuplicates ? Vb(t) : Hb(t);
	}
	return [];
}
function Vb(e) {
	return e.map((e) => e.trim()).filter(Boolean);
}
function Hb(e) {
	return [...new Set(Vb(e))].sort((e, t) => e.localeCompare(t));
}
//#endregion
//#region src/module/foundry/compendiums.ts
function Ub(e, t) {
	return t.uuid ? t.uuid : t._id && e.getUuid ? e.getUuid(t._id) : "";
}
function Wb(e) {
	return e.documentName === "Item" || Q(e, ["metadata", "type"]) === "Item" || Q(e, ["metadata", "documentName"]) === "Item";
}
function Gb(e) {
	return e.documentName === "Actor" || Q(e, ["metadata", "type"]) === "Actor" || Q(e, ["metadata", "documentName"]) === "Actor";
}
function Kb(e) {
	return Array.isArray(e) ? e.filter(Jb) : X(e) && Array.isArray(e.contents) ? e.contents.filter(Jb) : Yb(e) ? [...e].flatMap((e) => {
		let t = Array.isArray(e) ? e[1] : e;
		return Jb(t) ? [t] : [];
	}) : [];
}
function qb() {
	return new Promise((e) => {
		globalThis.setTimeout(e, 0);
	});
}
function Jb(e) {
	return X(e);
}
function Yb(e) {
	return X(e) && Symbol.iterator in e;
}
//#endregion
//#region src/module/wfrp4e/career-summary.ts
function Xb(e) {
	return {
		careerGroup: Zb(e),
		grants: Ib(e.system),
		img: e.img ?? "",
		level: Qb(e),
		name: e.name,
		uuid: e.uuid
	};
}
function Zb(e) {
	return Q(e.system, ["careergroup", "value"]);
}
function Qb(e) {
	let t = Z(e.system, ["level", "value"]), n = Number(t);
	return Number.isFinite(n) ? n : null;
}
//#endregion
//#region src/module/wfrp4e/career-index.ts
var $b = [
	"name",
	"type",
	"img",
	"system.careergroup.value",
	"system.characteristics",
	"system.level.value",
	"system.skills",
	"system.talents",
	"system.trappings"
], ex = /* @__PURE__ */ new Map(), tx = "idle", nx = null;
function rx() {
	return nx || (tx = "indexing", ex.clear(), nx = ax().then(() => {
		tx = "ready";
	}).catch((e) => {
		tx = "error", t("wfrp4e-customizer-apps | Career indexing failed.", e);
	}), nx);
}
async function ix(e) {
	return tx === "idle" && rx(), !e.careerGroup || e.level === null ? [] : [...ex.values()].filter((t) => ux(t, e)).sort(fx);
}
async function ax() {
	ox(), await qb();
	for (let e of game.packs ?? []) {
		if (!Wb(e) || !e.getIndex) continue;
		let t = await e.getIndex({ fields: $b });
		for (let n of Kb(t)) {
			let t = sx(e, n);
			t && ex.set(t.uuid, t);
		}
		await qb();
	}
}
function ox() {
	for (let e of game.items?.contents ?? []) e.type === "career" && ex.set(e.uuid, Xb(e));
}
function sx(e, t) {
	let n = Ub(e, t);
	if (t.type !== "career" || !t.name || !n) return null;
	let r = Z(t, ["system"]);
	return {
		careerGroup: cx(t),
		grants: Ib(r),
		img: t.img ?? "",
		level: lx(t),
		name: t.name,
		uuid: n
	};
}
function cx(e) {
	let t = Z(e, [
		"system",
		"careergroup",
		"value"
	]);
	return typeof t == "string" ? t.trim() : "";
}
function lx(e) {
	let t = Z(e, [
		"system",
		"level",
		"value"
	]), n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function ux(e, t) {
	return e.uuid !== t.uuid && e.level !== null && t.level !== null && e.level < t.level && dx(e.careerGroup) === dx(t.careerGroup);
}
function dx(e) {
	return e.trim().toLocaleLowerCase();
}
function fx(e, t) {
	let n = e.level ?? 0, r = t.level ?? 0;
	return n === r ? e.name.localeCompare(t.name) : n - r;
}
//#endregion
//#region src/module/wfrp4e/skill-specializations.ts
var px = [
	"name",
	"type",
	"system.characteristic.value"
], mx = /* @__PURE__ */ new Map(), hx = /* @__PURE__ */ new Map(), gx = /* @__PURE__ */ new Map(), _x = "idle", vx = null;
async function yx(e) {
	let t = Vs(e);
	return t ? (_x === "idle" && xx(), vx && await vx, [...mx.get(t) ?? []].sort((e, t) => e.localeCompare(t))) : [];
}
async function bx(e) {
	return _x === "idle" && xx(), vx && await vx, e.flatMap((e) => {
		let t = Dx(e);
		return t ? [{
			...t,
			skillName: e
		}] : [];
	});
}
function xx() {
	return vx || (_x = "indexing", mx.clear(), hx.clear(), gx.clear(), vx = Sx().then(() => {
		_x = "ready";
	}).catch((e) => {
		_x = "error", t("wfrp4e-customizer-apps | Skill specialization indexing failed.", e);
	}), vx);
}
async function Sx() {
	Ox(), await qb();
	for (let e of game.packs ?? []) {
		if (!Wb(e) || !e.getIndex) continue;
		let t = await e.getIndex({ fields: px });
		for (let e of Kb(t)) wx(e);
		await qb();
	}
}
function Cx(e) {
	if (e.type !== "skill") return;
	Tx(e);
	let t = Rs(e.name);
	if (!t) return;
	let n = Vs(t.baseName), r = mx.get(n) ?? /* @__PURE__ */ new Set();
	r.add(t.specialization), mx.set(n, r);
}
function wx(e) {
	if (e.type !== "skill" || !e.name) return;
	Ex(e);
	let t = Rs(e.name);
	if (!t) return;
	let n = Vs(t.baseName), r = mx.get(n) ?? /* @__PURE__ */ new Set();
	r.add(t.specialization), mx.set(n, r);
}
function Tx(e) {
	let t = Q(e.system, ["characteristic", "value"]);
	if (!ws(t)) return;
	let n = {
		characteristicKey: t,
		characteristicName: Ss[t],
		skillName: e.name
	}, r = Vs(e.name), i = Vs(Rs(e.name)?.baseName ?? e.name);
	hx.set(r, n), gx.has(i) || gx.set(i, n);
}
function Ex(e) {
	let t = Q(e, [
		"system",
		"characteristic",
		"value"
	]);
	if (!ws(t) || !e.name) return;
	let n = {
		characteristicKey: t,
		characteristicName: Ss[t],
		skillName: e.name
	}, r = Vs(e.name), i = Vs(Rs(e.name)?.baseName ?? e.name);
	hx.set(r, n), gx.has(i) || gx.set(i, n);
}
function Dx(e) {
	let t = Vs(e), n = Vs(Rs(e)?.baseName ?? e);
	return hx.get(t) ?? gx.get(n) ?? null;
}
function Ox() {
	for (let e of game.items?.contents ?? []) Cx(e);
}
//#endregion
//#region src/module/foundry/item-sources.ts
function kx(e, t) {
	return {
		img: "systems/wfrp4e/icons/blank.png",
		name: e,
		system: {},
		type: t
	};
}
function Ax(e, t, n) {
	let r = e ? e.toObject() : kx(t, n);
	return delete r._id, r;
}
function jx(e, t, n) {
	return Mx(e, t, n)[0] ?? null;
}
function Mx(e, t, n) {
	return e.items?.contents.filter((e) => e.type === n && Fx(e.name, t)) ?? [];
}
function Nx(e, t, n) {
	return e.items?.contents.find((e) => t && e.uuid === t ? !0 : Fx(e.name, n)) ?? null;
}
function Px(e, t) {
	return game.items?.contents.find((n) => t.includes(n.type) && Fx(n.name, e)) ?? null;
}
function Fx(e, t) {
	return e.trim().toLocaleLowerCase() === t.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/wfrp4e/item-lookup.ts
async function Ix(e, t) {
	return await game.wfrp4e?.utility?.findItem?.(e, t) || Px(e, t);
}
//#endregion
//#region src/module/wfrp4e/talent-maximums.ts
async function Lx(e) {
	let t = [];
	for (let n of Rx(e)) {
		let e = await Ix(n, ["talent"]);
		e && t.push({
			maximumFormula: Q(e.system, ["max", "formula"]),
			maximumKey: Q(e.system, ["max", "value"]),
			talentName: n
		});
	}
	return t;
}
function Rx(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = r.trim().toLocaleLowerCase();
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
//#endregion
//#region src/module/foundry/portrait-search/candidate-utils.ts
var zx = [
	".webp",
	".png",
	".jpg",
	".jpeg",
	".gif"
], Bx = new Set(zx);
function Vx(e, t) {
	let n = t.img.trim().toLocaleLowerCase();
	!n || e.seenPaths.has(n) || (e.seenPaths.add(n), e.candidates.push(t));
}
function Hx(e, t) {
	let n = t.imagePaths.filter(({ path: e }) => !!e);
	if (Xx(t.name, n, e.searchTerms)) for (let r of n) {
		let n = {
			img: r.path,
			key: `foundry-asset:${t.sourceKey}:${r.label}`,
			label: `${t.name || Kx(r.path)} ${r.label} (${t.sourceLabel})`,
			source: "foundry-asset",
			sourceGroup: t.sourceGroup,
			sourceLabel: t.sourceLabel
		};
		Zx(n, e) && Vx(e, n);
	}
}
function Ux(e, t, n) {
	e?.({
		candidatesFound: t.candidates.length,
		currentLocation: n.currentLocation,
		directoriesVisited: t.visitedDirectories,
		maxDirectories: n.maxDirectories,
		phase: n.phase
	});
}
function Wx(e) {
	return Q(e, [
		"prototypeToken",
		"texture",
		"src"
	]) || Q(e.toObject(), [
		"prototypeToken",
		"texture",
		"src"
	]);
}
function Gx(e, t) {
	return `${Kx(e)} (${t})`;
}
function Kx(e) {
	return e.split(/[/\\]/).at(-1) ?? e;
}
function qx(e) {
	let t = `.${e.split(/[#?]/u)[0]?.split(".").pop() ?? ""}`;
	return Bx.has(t.toLocaleLowerCase());
}
function Jx(e) {
	return typeof e == "object" && !!e;
}
function Yx(e) {
	return Jx(e) && Object.values(e).every((e) => Array.isArray(e) && e.every((e) => typeof e == "string"));
}
function Xx(e, t, n) {
	return pl(e, n) || t.some(({ path: e }) => pl(e, n));
}
function Zx(e, t) {
	return ml(e, {
		mustExcludeSources: [],
		mustExcludeTerms: t.mustExcludeTerms,
		mustIncludeSources: [],
		mustIncludeTerms: t.mustIncludeTerms
	});
}
//#endregion
//#region src/module/foundry/portrait-search/dig-down.ts
var Qx = "fuzzy-foundry", $x = .3;
function eS(e, t) {
	let n = tS();
	if (Ux(t, e, {
		currentLocation: rS(n),
		maxDirectories: 0,
		phase: "filesystem"
	}), !n.digDownActive || !n.digDownCacheReady) return;
	let r = oS();
	if (!(!r?._fileIndexCache || !r.fs)) {
		for (let t of iS(r, e.searchTerms)) aS(e, r, t);
		Ux(t, e, {
			currentLocation: "Dig Down file cache search complete",
			maxDirectories: 0,
			phase: "filesystem"
		});
	}
}
function tS() {
	let e = game.modules.get(Qx)?.active === !0, t = nS(), n = oS(), r = Object.values(n?._fileIndexCache ?? {}).reduce((e, t) => e + t.length, 0);
	return {
		digDownActive: e,
		digDownCacheReady: !!(n?._fileIndexCache && n.fs),
		digDownDeepFileSearchEnabled: t,
		digDownIndexedFileCount: r
	};
}
function nS() {
	try {
		return game.settings.get(Qx, "deepFile") === !0;
	} catch {
		return !1;
	}
}
function rS(e) {
	return e.digDownActive ? e.digDownDeepFileSearchEnabled ? e.digDownCacheReady ? `Dig Down file cache (${e.digDownIndexedFileCount} files)` : "Waiting for Dig Down file cache" : "Dig Down Deep File Search is disabled" : "Dig Down is not active";
}
function iS(e, t) {
	let n = /* @__PURE__ */ new Set(), r = Object.keys(e._fileIndexCache ?? {});
	for (let i of t) {
		let t = i.toLocaleLowerCase();
		for (let e of r) e.toLocaleLowerCase().includes(t) && n.add(e);
		let a = e.fs?.get(i, [], $x) ?? [];
		for (let [, e] of a) n.add(e);
	}
	return [...n].sort((e, t) => e.toLocaleLowerCase().localeCompare(t.toLocaleLowerCase()));
}
function aS(e, t, n) {
	let r = t._fileIndexCache?.[n] ?? [];
	for (let t of r) {
		if (!qx(t)) continue;
		let n = {
			img: t,
			key: `foundry-asset:${t}`,
			label: Gx(t, "Dig Down"),
			source: "foundry-asset",
			sourceGroup: "dig-down",
			sourceLabel: "Dig Down"
		};
		Zx(n, e) && Vx(e, n);
	}
}
function oS() {
	let e = canvas.deepSearchCache;
	if (!Jx(e)) return null;
	let t = e._fileIndexCache, n = e.fs, r = {};
	return Yx(t) && (r._fileIndexCache = t), Jx(n) && typeof n.get == "function" && (r.fs = { get: n.get.bind(n) }), r;
}
//#endregion
//#region src/module/foundry/portrait-search/documents.ts
function sS(e, t) {
	Ux(t, e, {
		currentLocation: "World Actors and Items",
		maxDirectories: 0,
		phase: "world-documents"
	});
	for (let t of game.actors.contents) Hx(e, {
		imagePaths: [{
			label: "actor image",
			path: t.img ?? ""
		}, {
			label: "token image",
			path: Wx(t)
		}],
		name: t.name,
		sourceGroup: "world",
		sourceLabel: "World Actors",
		sourceKey: t.uuid
	});
	for (let t of game.items?.contents ?? []) Hx(e, {
		imagePaths: [{
			label: "item image",
			path: t.img ?? ""
		}],
		name: t.name,
		sourceGroup: "world",
		sourceLabel: "World Items",
		sourceKey: t.uuid
	});
}
async function cS(e, t) {
	Ux(t, e, {
		currentLocation: "Actor and Item compendiums",
		maxDirectories: 0,
		phase: "compendiums"
	});
	for (let t of game.packs ?? []) {
		if (t.documentName !== "Actor" && t.documentName !== "Item") continue;
		let n = await t.getIndex?.({ fields: [
			"name",
			"img",
			"thumb",
			"prototypeToken.texture.src"
		] }).catch(() => void 0), r = n ? Kb(n) : [];
		for (let n of r) Hx(e, {
			imagePaths: [
				{
					label: `${t.documentName.toLocaleLowerCase()} image`,
					path: n.img ?? ""
				},
				{
					label: "thumbnail",
					path: n.thumb ?? ""
				},
				{
					label: "token image",
					path: Q(n, [
						"prototypeToken",
						"texture",
						"src"
					])
				}
			],
			name: n.name ?? "",
			sourceGroup: "compendiums",
			sourceLabel: t.title ?? "Compendium",
			sourceKey: `${t.collection ?? t.title ?? "pack"}:${n._id ?? n.name ?? ""}`
		});
	}
}
//#endregion
//#region src/module/foundry/portrait-search/priority-folders.ts
async function lS(e, t, n) {
	let r = uS(t), i = new Set(r.map(({ path: e }) => mS(e)));
	for (e.maxDirectoryBudget += r.length; r.length;) {
		let t = r.shift();
		if (!t) break;
		pS(e, n, t.path);
		let a = await dS(t.path);
		if (e.visitedDirectories += 1, a) {
			fS(e, t.root, a.files ?? []);
			for (let n of hS(a.dirs ?? [])) {
				let a = ul([n])[0], o = mS(a ?? "");
				!a || i.has(o) || (i.add(o), r.push({
					path: a,
					root: t.root
				}), e.maxDirectoryBudget += 1);
			}
			pS(e, n, t.path);
		}
	}
}
function uS(e) {
	return ul(e).map((e) => ({
		path: e,
		root: e
	}));
}
async function dS(e) {
	try {
		return await foundry.applications.apps.FilePicker.browse("data", e, { extensions: zx });
	} catch (n) {
		return t(`${Y} | Could not browse priority portrait folder "${e}".`, n), null;
	}
}
function fS(e, t, n) {
	let r = `Priority: ${Kx(t)}`;
	for (let i of hS(n)) {
		if (!qx(i) || !pl(Kx(i), e.searchTerms)) continue;
		let n = {
			img: i,
			key: `foundry-asset:${i}`,
			label: Gx(i, r),
			source: "foundry-asset",
			sourceFilter: Yc(t),
			sourceGroup: "priority-folders",
			sourceLabel: r
		};
		Zx(n, e) && Vx(e, n);
	}
}
function pS(e, t, n) {
	Ux(t, e, {
		currentLocation: n,
		maxDirectories: e.maxDirectoryBudget,
		phase: "filesystem"
	});
}
function mS(e) {
	return e.toLocaleLowerCase();
}
function hS(e) {
	return [...e].sort((e, t) => e.toLocaleLowerCase().localeCompare(t.toLocaleLowerCase()));
}
//#endregion
//#region src/module/foundry/portrait-search/exclusions.ts
var gS = /* @__PURE__ */ new Map(), _S = 6, vS = 15e3;
async function yS(e, t, n, r = bS) {
	let i = ul(t.excludedReferenceImagePaths), a = new Set(i.map(TS)), o = /* @__PURE__ */ new Set();
	for (let e of i) {
		let t = await r(e);
		t.loadable && t.pixelSignature && o.add(t.pixelSignature);
	}
	let s = Array(e.length).fill(null), c = 0, l = 0, u = 0;
	wS(n, 0, 0, e.length);
	async function d() {
		for (; l < e.length;) {
			let i = l, d = e[i];
			if (l += 1, !a.has(TS(d.img))) {
				let e = await r(d.img);
				e.loadable && (!t.excludeFullyTransparentImages || !e.fullyTransparent) && (!e.pixelSignature || !o.has(e.pixelSignature)) && (s[i] = d, c += 1);
			}
			u += 1, wS(n, c, u, e.length);
		}
	}
	let f = Math.min(_S, e.length);
	return await Promise.all(Array.from({ length: f }, d)), s.filter((e) => e !== null);
}
async function bS(e) {
	let t = TS(e), n = gS.get(t);
	if (n) return await n;
	let r = xS(e);
	return gS.set(t, r), await r;
}
async function xS(e) {
	let t = await SS(e);
	if (!t) return {
		fullyTransparent: !1,
		loadable: !1,
		pixelSignature: ""
	};
	try {
		let e = document.createElement("canvas");
		e.width = t.naturalWidth, e.height = t.naturalHeight;
		let n = e.getContext("2d", { willReadFrequently: !0 });
		if (!n) return {
			fullyTransparent: !1,
			loadable: !0,
			pixelSignature: ""
		};
		n.drawImage(t, 0, 0);
		let r = n.getImageData(0, 0, e.width, e.height).data, i = !0;
		for (let e = 0; e < r.length; e += 4) r[e + 3] === 0 ? (r[e] = 0, r[e + 1] = 0, r[e + 2] = 0) : i = !1;
		return {
			fullyTransparent: i,
			loadable: !0,
			pixelSignature: await CS(e.width, e.height, r)
		};
	} catch {
		return {
			fullyTransparent: !1,
			loadable: !0,
			pixelSignature: ""
		};
	}
}
function SS(e) {
	return new Promise((t) => {
		let n = new Image(), r = setTimeout(() => i(null), vS);
		function i(e) {
			clearTimeout(r), n.onload = null, n.onerror = null, t(e);
		}
		n.onload = () => {
			i(n.naturalWidth > 0 && n.naturalHeight > 0 ? n : null);
		}, n.onerror = () => i(null), n.src = e;
	});
}
async function CS(e, t, n) {
	let r = await crypto.subtle.digest("SHA-256", n);
	return `${e}x${t}:${[...new Uint8Array(r)].map((e) => e.toString(16).padStart(2, "0")).join("")}`;
}
function wS(e, t, n, r) {
	e?.({
		candidatesFound: t,
		currentLocation: `Checking images ${n}/${r}`,
		directoriesVisited: n,
		maxDirectories: r,
		phase: "image-validation"
	});
}
function TS(e) {
	return e.trim().replaceAll("\\", "/").toLocaleLowerCase();
}
//#endregion
//#region src/module/foundry/portrait-search/index.ts
async function ES(e, t) {
	if (!e.searchTerms.length) return [];
	let n = {
		candidates: [],
		maxDirectoryBudget: 0,
		mustExcludeTerms: e.mustExcludeTerms,
		mustIncludeTerms: e.mustIncludeTerms,
		searchTerms: e.searchTerms,
		seenPaths: /* @__PURE__ */ new Set(),
		visitedDirectories: 0
	};
	return await lS(n, e.priorityFolderPaths, t), e.includeCompendiumAssets && (await cS(n, t), sS(n, t)), e.includeFilePickerAssets && eS(n, t), Ux(t, n, {
		currentLocation: "Portrait search complete",
		maxDirectories: n.maxDirectoryBudget,
		phase: "ready"
	}), n.candidates;
}
//#endregion
//#region src/functions/npc-builder/normalize-npc-builder-settings.ts
var DS = {
	...kl(),
	allowBaseActorCharacteristics: !0,
	allowBaseActorSkills: !0,
	allowBaseActorTalents: !0
};
function OS(e) {
	let t = kl();
	return AS(e) ? {
		allowBaseActorCharacteristics: jS(e.allowBaseActorCharacteristics, DS.allowBaseActorCharacteristics),
		allowBaseActorSkills: jS(e.allowBaseActorSkills, DS.allowBaseActorSkills),
		allowBaseActorTalents: jS(e.allowBaseActorTalents, DS.allowBaseActorTalents),
		allowBaseActorTraits: jS(e.allowBaseActorTraits, DS.allowBaseActorTraits),
		allowBaseActorTrappings: jS(e.allowBaseActorTrappings, DS.allowBaseActorTrappings),
		askForLinkedSkillSpecializations: jS(e.askForLinkedSkillSpecializations, DS.askForLinkedSkillSpecializations),
		autoSelectGrantedSpells: jS(e.autoSelectGrantedSpells, DS.autoSelectGrantedSpells),
		baseActorFolderUuid: MS(e.baseActorFolderUuid, DS.baseActorFolderUuid),
		excludeFullyTransparentPortraitAssets: jS(e.excludeFullyTransparentPortraitAssets, DS.excludeFullyTransparentPortraitAssets),
		excludedPortraitReferenceImages: ul(Array.isArray(e.excludedPortraitReferenceImages) ? e.excludedPortraitReferenceImages : DS.excludedPortraitReferenceImages),
		includeSpeciesInName: jS(e.includeSpeciesInName, DS.includeSpeciesInName),
		lowerCareerMode: kS(e.lowerCareerMode) ? e.lowerCareerMode : DS.lowerCareerMode,
		outputActorFolderUuid: MS(e.outputActorFolderUuid, DS.outputActorFolderUuid),
		prioritizedPortraitFolders: ul(e.prioritizedPortraitFolders),
		quickTraitFolderUuid: MS(e.quickTraitFolderUuid, DS.quickTraitFolderUuid),
		searchCompendiumPortraitAssets: jS(e.searchCompendiumPortraitAssets, DS.searchCompendiumPortraitAssets),
		searchFoundryPortraitAssets: jS(e.searchFoundryPortraitAssets, DS.searchFoundryPortraitAssets),
		searchWebPortraitAssets: jS(e.searchWebPortraitAssets, DS.searchWebPortraitAssets)
	} : t;
}
function kS(e) {
	return e === "auto-add-all" || e === "never" || e === "prompt";
}
function AS(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function jS(e, t) {
	return typeof e == "boolean" ? e : t;
}
function MS(e, t) {
	return typeof e == "string" ? e : t;
}
//#endregion
//#region src/module/settings/foundry-setting-adapter.ts
function NS(e) {
	return e;
}
function PS(e) {
	game.settings.register(Y, e.key, {
		config: e.config ?? !1,
		default: e.defaultValue,
		name: e.name,
		scope: e.scope ?? "world",
		type: Object
	});
}
function FS(e) {
	return e.normalize(game.settings.get(Y, e.key));
}
async function IS(e, t) {
	let n = e.normalize(t);
	return await game.settings.set(Y, e.key, n), n;
}
//#endregion
//#region src/module/apps/npc-builder/settings.ts
var LS = NS({
	defaultValue: kl(),
	key: "npcBuilderSettings",
	name: "NPC Builder Settings",
	normalize: OS
});
function RS() {
	PS(LS);
}
function zS() {
	return FS(LS);
}
async function BS(e) {
	return await IS(LS, e);
}
//#endregion
//#region src/module/foundry/document-guards.ts
function VS(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Actor";
}
function HS(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Item";
}
function US(e, t = "Expected a Foundry Actor.") {
	if (!VS(e)) throw Error(t);
	return e;
}
function WS(e, t = "Expected a Foundry Item.") {
	if (!HS(e)) throw Error(t);
	return e;
}
function GS(e, t, n = `Expected a Foundry ${t} Item.`) {
	let r = WS(e, n);
	if (r.type !== t) throw Error(n);
	return r;
}
//#endregion
//#region src/module/foundry/drop-data.ts
function KS(e) {
	try {
		return JSON.parse(e);
	} catch {
		throw Error("Foundry drop data could not be read.");
	}
}
//#endregion
//#region src/module/foundry/embedded-items.ts
function qS() {
	return {
		creates: [],
		deletes: [],
		updates: []
	};
}
async function JS(e, t) {
	t.deletes.length && e.deleteEmbeddedDocuments && await e.deleteEmbeddedDocuments("Item", t.deletes), t.updates.length && e.updateEmbeddedDocuments && await e.updateEmbeddedDocuments("Item", t.updates), t.creates.length && await e.createEmbeddedDocuments("Item", t.creates);
}
//#endregion
//#region src/module/apps/npc-builder/xp-source-values.ts
function YS(e, t) {
	return jb(e, [[
		"characteristics",
		t,
		"initial",
		"value"
	], [
		"characteristics",
		t,
		"initial"
	]]) + jb(e, [[
		"characteristics",
		t,
		"modifier",
		"value"
	], [
		"characteristics",
		t,
		"modifier"
	]]) + jb(e, [[
		"characteristics",
		t,
		"advances",
		"value"
	], [
		"characteristics",
		t,
		"advances"
	]]);
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/advancements.ts
async function XS(e, t) {
	let n = {}, r = qS();
	for (let i of t) {
		let t = Math.floor(i.current);
		if (i.kind === "talent") {
			await iC(e, i, t, r);
			continue;
		}
		let a = i.baseAdvances + t;
		if (i.kind === "characteristic") {
			if (t === 0) continue;
			rC(n, i, a);
			continue;
		}
		let o = jx(e, i.name, i.kind);
		if (t === 0 && !i.includedFromCustom && !o) continue;
		if (o) {
			r.updates.push({
				_id: o.id,
				"system.advances.value": a
			});
			continue;
		}
		let s = Ax(await aC(i), i.name, i.kind);
		s.type = i.kind, Fb(s, [
			"system",
			"advances",
			"value"
		], a), r.creates.push(s);
	}
	Object.keys(n).length && await e.update(n), await JS(e, r);
}
function ZS(e) {
	let t = e.toObject().system, n = jb(t, [["advances", "value"], ["advances"]]);
	if (e.type === "talent") return {
		advances: Math.max(1, n),
		kind: "talent",
		name: e.name,
		sourceUuid: e.uuid,
		talentMaximumFormula: Q(t, ["max", "formula"]),
		talentMaximumKey: Q(t, ["max", "value"])
	};
	let r = nC(t), i = {
		advances: n,
		kind: "skill",
		name: e.name,
		sourceUuid: e.uuid
	};
	return r && (i.characteristicKey = r, i.characteristicName = Ss[r]), i;
}
function QS(e) {
	let t = e.toObject().system, n = [];
	for (let [e, r] of Object.entries(Ss)) {
		let i = jb(t, [[
			"characteristics",
			e,
			"advances",
			"value"
		], [
			"characteristics",
			e,
			"advances"
		]]), a = jb(t, [[
			"characteristics",
			e,
			"modifier",
			"value"
		], [
			"characteristics",
			e,
			"modifier"
		]]), o = jb(t, [[
			"characteristics",
			e,
			"initial",
			"value"
		], [
			"characteristics",
			e,
			"initial"
		]], 0);
		n.push({
			baseAdvances: i,
			baseModifier: a,
			current: o + a + i,
			kind: "characteristic",
			name: r
		});
	}
	return n;
}
function $S(e, t) {
	return t === "talent" ? eC(e) : e.items?.contents.filter((e) => e.type === t).map((n) => tC(e, n, t)) ?? [];
}
function eC(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.items?.contents.filter((e) => e.type === "talent") ?? []) {
		let e = n.toObject().system, r = n.name.trim().toLocaleLowerCase(), i = jb(e, [["advances", "value"], ["advances"]]), a = t.get(r);
		if (a) {
			a.baseAdvances += i, a.current += i;
			continue;
		}
		t.set(r, {
			baseAdvances: i,
			current: i,
			kind: "talent",
			name: n.name,
			talentMaximumFormula: Q(e, ["max", "formula"]),
			talentMaximumKey: Q(e, ["max", "value"])
		});
	}
	return [...t.values()];
}
function tC(e, t, n) {
	let r = t.toObject().system, i = jb(r, [["advances", "value"], ["advances"]]);
	if (n === "talent") return {
		baseAdvances: i,
		current: i,
		kind: n,
		name: t.name,
		talentMaximumFormula: Q(r, ["max", "formula"]),
		talentMaximumKey: Q(r, ["max", "value"])
	};
	let a = jb(r, [["modifier", "value"], ["modifier"]]), o = nC(r), s = {
		baseAdvances: i,
		baseModifier: a,
		current: (o ? YS(e.toObject().system, o) : 0) + i + a,
		kind: n,
		name: t.name
	};
	return o && (s.characteristicKey = o, s.characteristicName = Ss[o]), s;
}
function nC(e) {
	let t = Q(e, ["characteristic", "value"]);
	return ws(t) ? t : void 0;
}
function rC(e, t, n) {
	let r = Cs[t.name.trim().toLocaleLowerCase()];
	r && (e[`system.characteristics.${r}.advances`] = n);
}
async function iC(e, t, n, r) {
	let i = Math.max(0, t.baseAdvances + n), a = Mx(e, t.name, "talent"), o = a[0] ?? await aC(t);
	r.deletes.push(...a.map((e) => e.id));
	for (let e = 0; e < i; e += 1) {
		let e = Ax(o, t.name, "talent");
		e.type = "talent", Fb(e, [
			"system",
			"advances",
			"value"
		], 1), r.creates.push(e);
	}
}
async function aC(e) {
	if (e.sourceUuid) {
		let t = await fromUuid(e.sourceUuid);
		if (HS(t)) return t;
	}
	return Ix(e.name, [e.kind]);
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/traits/config.ts
function oC(e, t) {
	Fb(e, [
		"system",
		"specification",
		"value"
	], t.specification), t.rollable && !t.damage && Fb(e, [
		"system",
		"rollable",
		"defaultDifficulty"
	], t.defaultDifficulty), t.damage && t.dice && Fb(e, [
		"system",
		"rollable",
		"dice"
	], t.dice);
}
function sC(e, t) {
	return {
		_id: e,
		"system.specification.value": t.specification,
		...t.rollable && !t.damage ? { "system.rollable.defaultDifficulty": t.defaultDifficulty } : {},
		...t.damage && t.dice ? { "system.rollable.dice": t.dice } : {}
	};
}
function cC(e) {
	return {
		...Ts(),
		attackType: fC(e.system, ["rollable", "attackType"]) || "melee",
		bonusCharacteristic: fC(e.system, ["rollable", "bonusCharacteristic"]),
		damage: Nb(e.system, [["rollable", "damage"]]),
		defaultDifficulty: fC(e.system, ["rollable", "defaultDifficulty"]) || "challenging",
		dice: fC(e.system, ["rollable", "dice"]),
		rollable: Nb(e.system, [["rollable", "value"]]),
		skill: fC(e.system, ["rollable", "skill"]),
		sl: Nb(e.system, [["rollable", "SL"]], !0),
		specification: fC(e.system, ["specification", "value"])
	};
}
function lC(e) {
	return dC(e.system);
}
function uC(e) {
	return dC(e.system);
}
function dC(e) {
	return Nb(e, [["disabled"], ["disabled", "value"]]);
}
function fC(e, t) {
	let n = Z(e, t);
	return typeof n == "string" ? n.trim() : typeof n == "number" ? String(n) : "";
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/traits/apply.ts
async function pC(e, t) {
	let n = qS();
	for (let r of t) {
		let t = r.source === "base" ? Nx(e, r.sourceUuid, r.name) : jx(e, r.name, "trait");
		if (r.ignored) {
			t && n.deletes.push(t.id);
			continue;
		}
		if (t) {
			n.updates.push(sC(t.id, r.config));
			continue;
		}
		let i = Ax(r.sourceUuid ? await mC(r.sourceUuid) : await Ix(r.name, ["trait"]), r.name, "trait");
		i.type = "trait", Fb(i, ["system", "disabled"], !1), oC(i, r.config), n.creates.push(i);
	}
	await JS(e, n);
}
async function mC(e) {
	let t = await fromUuid(e);
	return HS(t) ? t : null;
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/traits/actor-traits.ts
function hC(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && !lC(e)).map(vC) ?? [];
}
function gC(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && lC(e)).map(vC) ?? [];
}
function _C(e) {
	Array.isArray(e.items) && (e.items = e.items.filter((e) => {
		if (typeof e != "object" || !e) return !0;
		let t = e;
		return t.type !== "trait" || !uC(t);
	}));
}
function vC(e) {
	return {
		config: cC(e),
		img: e.img ?? "",
		name: e.name,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/traits/difficulty-options.ts
var yC = [
	{
		label: "Very Easy",
		value: "veasy"
	},
	{
		label: "Easy",
		value: "easy"
	},
	{
		label: "Average",
		value: "average"
	},
	{
		label: "Challenging",
		value: "challenging"
	},
	{
		label: "Difficult",
		value: "difficult"
	},
	{
		label: "Hard",
		value: "hard"
	},
	{
		label: "Very Hard",
		value: "vhard"
	},
	{
		label: "Futile",
		value: "futile"
	},
	{
		label: "Impossible",
		value: "impossible"
	}
];
async function bC() {
	let e = Z(game.wfrp4e?.config, ["difficultyLabels"]);
	if (!X(e)) return yC;
	let t = Object.entries(e).filter((e) => {
		let [t, n] = e;
		return !!t.trim() && typeof n == "string";
	}).map(([e, t]) => ({
		label: t,
		value: e
	}));
	return t.length ? t : yC;
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/traits/drops.ts
async function xC(e) {
	let t = KS(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Trait item here.");
	let n = GS(await fromUuid(t.uuid), "trait", "Drop a Foundry Trait item here.");
	return {
		config: cC(n),
		ignored: !1,
		key: `custom:${n.uuid}`,
		name: n.name,
		source: "custom",
		sourceUuid: n.uuid
	};
}
//#endregion
//#region src/functions/npc-builder/recommended-quick-traits.ts
var SC = [
	"Armour",
	"Big",
	"Brute",
	"Champion",
	"Clever",
	"Easily Confused",
	"Elite",
	"Fast",
	"Fear",
	"Frenzy",
	"Grim",
	"Hardy",
	"Leader",
	"Magical",
	"Null",
	"Painless",
	"Ranged",
	"Size",
	"Stealthy",
	"Stupid",
	"Tough",
	"Weapon"
];
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/folders.ts
async function CC(e) {
	return AC(await kC(e, "Actor"));
}
async function wC(e) {
	return AC(await kC(e, "Item"));
}
function TC() {
	return game.folders.contents.filter((e) => e.type === "Actor").map(AC).sort((e, t) => e.name.localeCompare(t.name));
}
function EC() {
	return game.folders.contents.filter((e) => e.type === "Item").map(AC).sort((e, t) => e.name.localeCompare(t.name));
}
function DC(e) {
	return e ? game.folders.contents.find((t) => t.uuid === e) ?? null : null;
}
function OC(e) {
	let t = DC(e);
	return t?.type === "Item" ? t : null;
}
async function kC(e, t) {
	let n = e.trim();
	if (!n) throw Error("Enter a folder name first.");
	let r = game.folders.contents.find((e) => e.type === t && jC(e.name, n));
	if (r) return r;
	let i = await Folder.create({
		name: n,
		type: t
	});
	if (!i) throw Error("Foundry did not create the folder.");
	return i;
}
function AC(e) {
	return {
		name: e.name,
		uuid: e.uuid
	};
}
function jC(e, t) {
	return e.trim().toLocaleLowerCase() === t.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/traits/quick-traits.ts
async function MC(e) {
	let t = OC(e.quickTraitFolderUuid);
	if (!t) throw Error("Choose a Quick Traits item folder before importing traits.");
	let n = new Set(FC(e).map((e) => e.name.trim().toLocaleLowerCase()));
	for (let e of SC) {
		if (n.has(e.trim().toLocaleLowerCase())) continue;
		let r = Ax(await Ix(e, ["trait"]), e, "trait");
		r.folder = t.id, r.type = "trait", await Item.create(r);
	}
	return ui.notifications?.info("Imported recommended quick traits."), await NC(e);
}
async function NC(e) {
	return FC(e).map(IC).sort((e, t) => e.name.localeCompare(t.name));
}
function PC(e, t) {
	return t.quickTraitFolderUuid ? e.folder?.uuid === t.quickTraitFolderUuid : !1;
}
function FC(e) {
	return game.items?.contents.filter((t) => t.type === "trait" && PC(t, e)) ?? [];
}
function IC(e) {
	return {
		config: cC(e),
		img: e.img ?? "",
		name: e.name,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/trappings.ts
var LC = [
	"ammunition",
	"armour",
	"container",
	"money",
	"trapping",
	"weapon"
];
async function RC(e, t) {
	let n = qS();
	for (let r of t) {
		let t = r.source === "base" ? Nx(e, r.sourceUuid, r.name) : null;
		if (r.ignored) {
			t && n.deletes.push(t.id);
			continue;
		}
		if (t) {
			n.updates.push({
				_id: t.id,
				"system.quantity.value": r.quantity
			});
			continue;
		}
		let i = await WC(r), a = r.resolution.selectedItemType || r.itemType || "trapping", o = Ax(i, r.resolution.selectedName || r.name, a);
		o.type = a || o.type || "trapping", Fb(o, [
			"system",
			"quantity",
			"value"
		], r.quantity), n.creates.push(o);
	}
	await JS(e, n);
}
async function zC(e) {
	return fu(e, await GC());
}
async function BC(e) {
	let t = KS(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Item here.");
	let n = WS(await fromUuid(t.uuid), "Drop a Foundry Item here.");
	return {
		ignored: !1,
		itemType: n.type,
		key: `custom:${n.uuid}`,
		name: n.name,
		quantity: HC(n),
		resolution: uu({
			itemType: n.type,
			name: n.name,
			uuid: n.uuid
		}),
		source: "custom",
		sourceUuid: n.uuid
	};
}
function VC(e) {
	let t = UC();
	return e.items?.contents.filter((e) => t.includes(e.type)).map((e) => ({
		itemType: e.type,
		name: e.name,
		quantity: HC(e),
		uuid: e.uuid
	})) ?? [];
}
function HC(e) {
	return jb(e.system, [["quantity", "value"], ["quantity"]]) || 1;
}
function UC() {
	let e = Ab(game.wfrp4e?.config, ["trappingItems"]);
	return e.length ? e : LC;
}
async function WC(e) {
	if (e.sourceUuid) {
		let t = await fromUuid(e.sourceUuid);
		return HS(t) ? t : null;
	}
	if (e.resolution.selectedCandidateUuid) {
		let t = await fromUuid(e.resolution.selectedCandidateUuid);
		return HS(t) ? t : null;
	}
	return e.resolution.status === "fallback" ? null : await Ix(e.resolution.selectedName || e.name, UC());
}
async function GC() {
	let e = [], t = UC();
	for (let n of game.items?.contents ?? []) t.includes(n.type) && e.push(qC(n, "World"));
	for (let n of game.packs ?? []) {
		if (!Wb(n)) continue;
		let r = await KC(n, t);
		if (r.length) {
			e.push(...r);
			continue;
		}
		if (!n.getDocuments) continue;
		let i = await n.getDocuments();
		for (let r of i) HS(r) && t.includes(r.type) && e.push(qC(r, n.title ?? "Compendium"));
	}
	return e;
}
async function KC(e, t) {
	return e.getIndex ? Kb(await e.getIndex({ fields: ["name", "type"] })).filter((n) => !!(n.name && n.type && Ub(e, n) && t.includes(n.type))).map((t) => ({
		itemType: t.type ?? "trapping",
		name: t.name ?? "",
		sourceLabel: e.title ?? "Compendium",
		uuid: Ub(e, t)
	})) : [];
}
function qC(e, t) {
	return {
		itemType: e.type,
		name: e.name,
		sourceLabel: t,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/actors.ts
function JC(e) {
	return game.actors.contents.filter((t) => ew(t, e)).map(ZC);
}
async function YC(e) {
	let t = US(await fromUuid(e));
	return {
		advancements: [
			...QS(t),
			...$S(t, "skill"),
			...$S(t, "talent")
		],
		optionalTraits: gC(t),
		traits: hC(t),
		trappings: VC(t)
	};
}
async function XC(e) {
	let t = KS(e);
	if (t.type !== "Actor") throw Error("Drop a Foundry Actor here.");
	let n = null;
	return t.uuid ? n = await fromUuid(t.uuid) : t.id && (n = game.actors.get(t.id)), ZC(US(n));
}
function ZC(e) {
	return {
		img: e.img ?? "",
		name: e.name,
		prototypeTokenImg: $C(e),
		species: QC(e),
		type: e.type,
		uuid: e.uuid
	};
}
function QC(e) {
	return Q(e.system, [
		"details",
		"species",
		"value"
	]) || Q(e.system, ["details", "species"]) || Q(e.system, [
		"details",
		"race",
		"value"
	]) || Q(e.system, [
		"details",
		"ancestry",
		"value"
	]);
}
function $C(e) {
	return Q(e, [
		"prototypeToken",
		"texture",
		"src"
	]) || Q(e.toObject(), [
		"prototypeToken",
		"texture",
		"src"
	]);
}
function ew(e, t) {
	return t.baseActorFolderUuid ? e.folder?.uuid === t.baseActorFolderUuid : !0;
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/careers.ts
async function tw(e) {
	let t = KS(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a WFRP Career item here.");
	return Xb(GS(await fromUuid(t.uuid), "career", "Drop a WFRP Career item here."));
}
async function nw(e) {
	let t = [];
	for (let n of e) {
		let e = GS(await fromUuid(n.uuid), "career", `Career “${n.name}” is no longer available.`);
		for (let r = 0; r < Ns(n.quantity); r += 1) {
			let n = e.toObject();
			delete n._id, Fb(n, [
				"system",
				"complete",
				"value"
			], !0), Fb(n, [
				"system",
				"current",
				"value"
			], !1), t.push(n);
		}
	}
	return t;
}
async function rw(e, t) {
	t.length && await e.createEmbeddedDocuments("Item", t);
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/magic/constants.ts
var iw = "spell", aw = new Set(Nl), ow = new Set(Pl);
async function sw() {
	return cw().map((e) => ({
		category: zl(e.key),
		key: e.key,
		label: e.name,
		value: e.name,
		wind: e.wind
	})).sort((e, t) => e.category === t.category ? e.label.localeCompare(t.label) : e.category.localeCompare(t.category));
}
function cw() {
	let e = Z(game.wfrp4e?.config, ["magicLores"]), t = Z(game.wfrp4e?.config, ["magicWind"]), n = [];
	if (!X(e)) return [fw()];
	for (let [r, i] of Object.entries(e)) {
		let e = yw(i) || r, a = vw(t, r);
		n.push({
			key: r,
			matchTerms: _w(r, e, a),
			name: e,
			wind: a
		});
	}
	return n.some((e) => e.key === "petty") || n.push(fw()), n;
}
function lw(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		if (r.isAmbiguous) continue;
		if (r.kind === "petty-magic") {
			let e = gw("petty magic", t);
			e && n.set(e.key, e);
			continue;
		}
		let e = gw(r.rawLore, t);
		e && n.set(e.key, e);
	}
	return [...n.values()];
}
function uw(e, t) {
	let n = [...dw(e.system), hw(e.name)].filter(Boolean);
	for (let e of n) {
		let n = mw(e, t);
		if (n) return n;
		let r = gw(e, t);
		if (r) return r;
	}
	return null;
}
function dw(e) {
	return [
		...Pb(Z(e, ["lore", "value"])),
		...Pb(Z(e, ["lore"])),
		...Pb(Z(e, ["magicLore", "value"])),
		...Pb(Z(e, ["magicLore"])),
		...Pb(Z(e, ["category", "value"])),
		...Pb(Z(e, [
			"system",
			"lore",
			"value"
		])),
		...Pb(Z(e, ["system", "lore"])),
		...Pb(Z(e, ["system.lore.value"])),
		...Pb(Z(e, ["system.lore"]))
	];
}
function fw() {
	return {
		key: "petty",
		matchTerms: ["petty", "petty magic"],
		name: "Petty Magic",
		wind: ""
	};
}
function pw(e) {
	let t = e.trim() || "Unknown Lore";
	return {
		key: Il(t) || "unknown",
		matchTerms: [t],
		name: t,
		wind: ""
	};
}
function mw(e, t) {
	let n = Il(e);
	return n === "lore" ? t.find((e) => e.key !== "petty") ?? null : n === "the eight winds" || n === "eight winds" ? t.find((e) => aw.has(e.key)) ?? null : n === "dark lore" ? t.find((e) => ow.has(e.key)) ?? null : null;
}
function hw(e) {
	return /\(([^)]+)\)\s*$/.exec(e)?.[1]?.trim() ?? "";
}
function gw(e, t) {
	let n = Il(e);
	return n ? t.find((e) => e.matchTerms.some((e) => Il(e) === n)) ?? null : null;
}
function _w(e, t, n) {
	let r = /* @__PURE__ */ new Set(), i = Il(e), a = Il(t);
	for (let i of [
		e,
		t,
		n
	]) i.trim() && r.add(i.trim());
	return (i === "petty" || a === "petty") && r.add("Petty Magic"), (i === "shadow" || a === "shadow") && r.add("Shadows"), t && !/^lore of /i.test(t) && r.add(`Lore of ${t}`), [...r];
}
function vw(e, t) {
	return X(e) ? yw(e[t]) : "";
}
function yw(e) {
	return typeof e == "string" ? e.trim() : X(e) ? Q(e, ["name"]) || Q(e, ["label"]) || Q(e, ["value"]) : "";
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/magic/debug.ts
var bw = "[Drowsy's WFRP4e Customizers][Spell Lookup]";
function xw(t, n) {
	if (n) {
		e(`${bw} ${t}`, n);
		return;
	}
	e(`${bw} ${t}`);
}
function Sw(e, n) {
	t(`${bw} ${e}`, n);
}
function Cw(e) {
	return [
		e.title ?? "",
		e.collection ?? "",
		Q(e, ["metadata", "type"]),
		Q(e, ["metadata", "documentName"]),
		e.documentName
	].filter(Boolean).join(" | ");
}
function ww(e) {
	return {
		loreTerms: dw(e.system),
		name: e.name,
		sourceLabel: e.sourceLabel,
		uuid: e.uuid
	};
}
function Tw(e) {
	return typeof e == "string" ? {
		kind: "uuid-string",
		value: e
	} : X(e) ? {
		documentName: Q(e, ["documentName"]),
		hasSystem: X(Z(e, ["system"])),
		loreTerms: dw(Z(e, ["system"])),
		name: Q(e, ["name"]),
		type: Q(e, ["type"]),
		uuid: Q(e, ["uuid"])
	} : { kind: typeof e };
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/magic/spell-input-conversion.ts
function Ew(e, t) {
	return {
		img: e.img ?? "",
		name: e.name,
		sourceLabel: t,
		system: e.system,
		uuid: e.uuid
	};
}
function Dw(e) {
	return /^item\./i.test(e.uuid) ? "World" : Ow(e.uuid, "WFRP Item Lookup");
}
function Ow(e, t) {
	let n = /^Compendium\.([^.]+\.[^.]+)\./.exec(e)?.[1];
	return n ? [...game.packs ?? []].find((e) => e.collection === n)?.title ?? n : t;
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/magic/compendium-spell-inputs.ts
async function kw(e) {
	if (xw("Compendium index scan start", { pack: Cw(e) }), !e.getIndex) return xw("Compendium has no index; loading documents", { pack: Cw(e) }), await Mw(e);
	let t = Kb(await e.getIndex({ fields: [
		"name",
		"type",
		"img",
		"system.lore.value"
	] }));
	if (xw("Compendium index loaded", {
		entries: t.length,
		pack: Cw(e),
		samples: t.slice(0, 5).map((t) => ({
			hasLoreTerms: dw(t).length > 0,
			name: t.name,
			type: t.type,
			uuid: Ub(e, t)
		}))
	}), !t.length) return xw("Compendium index empty; loading documents", { pack: Cw(e) }), await Mw(e);
	let n = t.filter(jw);
	xw("Compendium index spell candidates", {
		pack: Cw(e),
		spellEntries: n.length
	});
	let r = n.filter((e) => e.name).map((t) => Pw(e, t));
	return r.length || !Nw(e) ? r : await Mw(e);
}
function Aw(e) {
	return Wb(e);
}
function jw(e) {
	return e.type === "spell" ? !0 : !!(e.name && (dw(e).length || hw(e.name)));
}
async function Mw(e) {
	if (!e.getDocuments) return xw("Compendium has no document loader", { pack: Cw(e) }), [];
	xw("Compendium document load start", { pack: Cw(e) });
	let t = await e.getDocuments(), n = t.filter((e) => HS(e) && e.type === "spell");
	return xw("Compendium document load complete", {
		documents: t.length,
		pack: Cw(e),
		spellDocuments: n.length,
		spellSamples: n.slice(0, 5).map((e) => ({
			loreTerms: dw(e.system),
			name: e.name,
			uuid: e.uuid
		}))
	}), n.map((t) => Ew(t, e.title ?? "Compendium"));
}
function Nw(e) {
	return e.collection === "wfrp4e-core.items" || e.collection === "wfrp4e-wom.items";
}
function Pw(e, t) {
	return {
		img: t.img ?? t.thumb ?? "",
		name: t.name ?? "",
		sourceLabel: e.title ?? "Compendium",
		system: t,
		uuid: Ub(e, t)
	};
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/magic/warhammer-spell-inputs.ts
async function Fw() {
	let e = Lw();
	if (!e) return xw("WFRP helper unavailable"), [];
	try {
		let t = await e.findAllItems(iw, "Loading Spells", !0, ["system.lore.value"]);
		return xw("WFRP helper raw result", {
			count: t.length,
			samples: t.slice(0, 10).map(Tw)
		}), (await Promise.all(t.map((e) => Iw(e)))).filter((e) => e !== null);
	} catch (e) {
		return Sw("WFRP helper lookup failed.", e), [];
	}
}
async function Iw(e) {
	if (typeof e == "string") {
		let t = await fromUuid(e);
		return HS(t) && t.type === "spell" ? Ew(t, Dw(t)) : null;
	}
	if (HS(e)) return e.type === "spell" ? Ew(e, Dw(e)) : null;
	if (Q(e, ["type"]) !== "spell") return null;
	let t = Q(e, ["name"]);
	return t ? {
		img: Q(e, ["img"]) || Q(e, ["thumb"]),
		name: t,
		sourceLabel: Ow(Q(e, ["uuid"]), "WFRP Item Lookup"),
		system: Z(e, ["system"]),
		uuid: Q(e, ["uuid"])
	} : null;
}
function Lw() {
	let e = Z(globalThis, [
		"warhammer",
		"utility",
		"findAllItems"
	]);
	return typeof e == "function" ? { findAllItems: e } : null;
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/magic/spell-resolution-inputs.ts
async function Rw() {
	let e = [], n = [...game.packs ?? []];
	xw("Candidate lookup start", {
		itemPacks: n.filter(Aw).length,
		totalPacks: n.length,
		warhammerUtilityAvailable: !!Vw(),
		worldItems: game.items?.contents.length ?? 0
	});
	let r = await Fw();
	xw("WFRP helper lookup complete", {
		utilityInputs: r.length,
		utilitySamples: r.slice(0, 10).map(ww)
	}), e.push(...r), e.push(...zw()), xw("World spell scan complete", { worldSpellCount: e.filter((e) => e.sourceLabel === "World").length });
	for (let r of n) if (Aw(r)) try {
		let t = await kw(r);
		e.push(...t), xw("Compendium spell scan complete", {
			inputCount: t.length,
			pack: Cw(r),
			samples: t.slice(0, 5).map(ww)
		});
	} catch (e) {
		t(`wfrp4e-customizer-apps | Spell lookup skipped compendium "${r.title ?? r.collection ?? "unknown"}".`, e);
	}
	let i = Bw(e);
	return xw("Candidate lookup complete", {
		rawInputCount: e.length,
		uniqueInputCount: i.length
	}), i;
}
function zw() {
	let e = [];
	for (let t of game.items?.contents ?? []) t.type === "spell" && e.push(Ew(t, "World"));
	return e;
}
function Bw(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.uuid || n.name.trim().toLocaleLowerCase();
		t.has(e) || t.set(e, n);
	}
	return [...t.values()];
}
function Vw() {
	return Z(globalThis, [
		"warhammer",
		"utility",
		"findAllItems"
	]);
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/magic/index.ts
async function Hw(e, t) {
	let n = [];
	for (let r of t) {
		if (!r.selected || jx(e, r.name, "spell")) continue;
		let t = Ax(r.sourceUuid ? await Gw(r.sourceUuid) : null, r.name, iw);
		t.type = iw, n.push(t);
	}
	n.length && await e.createEmbeddedDocuments("Item", n);
}
async function Uw(e) {
	let t = lw(e, cw());
	if (xw("Grant resolution start", {
		grants: e.map((e) => ({
			isAmbiguous: e.isAmbiguous,
			kind: e.kind,
			rawLore: e.rawLore,
			sourceName: e.sourceName
		})),
		resolvedProfiles: t.map((e) => ({
			key: e.key,
			matchTerms: e.matchTerms,
			name: e.name,
			wind: e.wind
		}))
	}), !t.length) return [];
	let n = await Rw(), r = /* @__PURE__ */ new Map(), i = [];
	for (let e of n) {
		let n = uw(e, t);
		if (!n) {
			i.length < 20 && i.push({
				loreTerms: dw(e.system),
				name: e.name,
				sourceLabel: e.sourceLabel,
				uuid: e.uuid
			});
			continue;
		}
		let a = `detected:${e.uuid || e.name}`;
		r.set(a, {
			img: e.img,
			key: a,
			loreKey: n.key,
			loreName: n.name,
			name: e.name,
			selected: !1,
			source: "detected",
			sourceLabel: e.sourceLabel,
			sourceUuid: e.uuid
		});
	}
	return xw("Grant resolution complete", {
		candidateCount: n.length,
		matchedSpellCount: r.size,
		matchedSpellSamples: [...r.values()].slice(0, 10).map((e) => ({
			loreName: e.loreName,
			name: e.name,
			sourceLabel: e.sourceLabel,
			sourceUuid: e.sourceUuid
		})),
		unmatchedLoreSamples: i
	}), [...r.values()].sort((e, t) => e.loreName === t.loreName ? e.name.localeCompare(t.name) : e.loreName.localeCompare(t.loreName));
}
async function Ww(e) {
	let t = KS(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Spell item here.");
	let n = GS(await fromUuid(t.uuid), iw, "Drop a Foundry Spell item here."), r = uw(Ew(n, "Dropped"), [...cw(), fw()]) ?? pw(dw(n.system)[0] ?? "");
	return {
		img: n.img ?? "",
		key: `custom:${n.uuid}`,
		loreKey: r.key,
		loreName: r.name,
		name: n.name,
		selected: !0,
		source: "custom",
		sourceLabel: "Dropped",
		sourceUuid: n.uuid
	};
}
async function Gw(e) {
	let t = await fromUuid(e);
	return HS(t) && t.type === "spell" ? t : null;
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/mounts/trait-sources.ts
var Kw = "generatedMountTrait";
function qw(e, t) {
	return t.traits.flatMap((t) => {
		if (!t.included || $m(t.name)) return [];
		let n = Jw(e, t);
		if (!n) return [];
		let r = n.toObject();
		return delete r._id, r.name = t.outputName, Fb(r, ["system", "disabled"], !1), Fb(r, [
			"flags",
			Y,
			Kw
		], {
			mountUuid: e.uuid,
			sourceTraitUuid: t.sourceUuid
		}), t.fixedDamage !== null && Yw(r, t.fixedDamage), [r];
	});
}
function Jw(e, t) {
	return e.items?.contents.find((e) => e.type === "trait" && e.uuid === t.sourceUuid) ?? null;
}
function Yw(e, t) {
	Fb(e, [
		"system",
		"specification",
		"value"
	], String(t)), Fb(e, [
		"system",
		"rollable",
		"bonusCharacteristic"
	], ""), Fb(e, [
		"system",
		"rollable",
		"rollCharacteristic"
	], "ws"), Fb(e, [
		"system",
		"rollable",
		"skill"
	], "");
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/mounts/armour.ts
async function Xw(e, t, n, r) {
	let i = e.items?.contents.filter($w) ?? [], a = r.traits.filter((e) => e.included && $m(e.name)), o = Zw(i), s = Qw(n, a), c = Math.max(o.value, s.value) + 1;
	if (o.item && e.updateEmbeddedDocuments) {
		await e.updateEmbeddedDocuments("Item", [{
			_id: o.item.id,
			"system.specification.value": String(c)
		}]);
		return;
	}
	let l = Ax((s.contribution ? Jw(t, s.contribution) : null) ?? await Ix("Armour", ["trait"]), "Armour", "trait");
	l.name = "Armour", l.type = "trait", Fb(l, ["system", "disabled"], !1), Fb(l, [
		"system",
		"specification",
		"value"
	], String(c)), await e.createEmbeddedDocuments("Item", [l]);
}
function Zw(e) {
	return e.reduce((e, t) => {
		let n = jb(t.system, [["specification", "value"]]);
		return n > e.value ? {
			item: t,
			value: n
		} : e;
	}, {
		item: null,
		value: 0
	});
}
function Qw(e, t) {
	return t.reduce((t, n) => {
		let r = e.traits.find((e) => e.uuid === n.sourceUuid), i = Number(r?.specification);
		return Number.isFinite(i) && i > t.value ? {
			contribution: n,
			value: i
		} : t;
	}, {
		contribution: null,
		value: 0
	});
}
function $w(e) {
	return e.type === "trait" && $m(e.name);
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/mounts/profile.ts
var eT = new Set(Object.values(Xm));
async function tT(e) {
	return nT(US(await fromUuid(e)));
}
function nT(e) {
	return {
		characteristics: {
			initiative: oT(e, "i"),
			strength: oT(e, "s"),
			strengthBonus: sT(e, "s"),
			toughness: oT(e, "t")
		},
		img: e.img ?? "",
		movement: jb(e.system, [[
			"details",
			"move",
			"value"
		]]),
		name: e.name,
		size: cT(e),
		traits: rT(e),
		uuid: e.uuid,
		wounds: jb(e.system, [[
			"status",
			"wounds",
			"max"
		], [
			"status",
			"wounds",
			"value"
		]])
	};
}
function rT(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && !lT(e)).map((t) => iT(e, t)).sort((e, t) => e.name.localeCompare(t.name)) ?? [];
}
function iT(e, t) {
	let n = Nb(t.system, [["rollable", "damage"]]), r = Q(t.system, ["specification", "value"]);
	return {
		damage: n,
		fixedDamage: n ? aT(e, t, r) : null,
		name: t.name,
		specification: r,
		uuid: t.uuid
	};
}
function aT(e, t, n) {
	let r = Mb(t, [["Damage"]]);
	if (r !== null) return r;
	let i = Number(n), a = Q(t.system, ["rollable", "bonusCharacteristic"]);
	return (Number.isFinite(i) ? i : 0) + (a ? sT(e, a) : 0);
}
function oT(e, t) {
	return jb(e.system, [[
		"characteristics",
		t,
		"value"
	], [
		"characteristics",
		t,
		"initial"
	]]);
}
function sT(e, t) {
	return Mb(e.system, [[
		"characteristics",
		t,
		"bonus"
	]]) ?? Math.floor(oT(e, t) / 10);
}
function cT(e) {
	let t = Q(e.system, [
		"details",
		"size",
		"value"
	]);
	return eT.has(t) ? t : Xm.Average;
}
function lT(e) {
	return Nb(e.system, [["disabled"], ["disabled", "value"]]);
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/mounts/apply.ts
var uT = {
	avg: 1,
	enor: 3,
	lrg: 2,
	ltl: .5,
	mnst: 4,
	sml: .8,
	tiny: .3
};
async function dT(e, t) {
	let n = US(await fromUuid(t));
	if (e.uuid === n.uuid) throw Error("The rider and mount must be different Actors.");
	let r = nT(e), i = nT(n), a = lh(r, i);
	await e.update(fT(e, a));
	let o = qw(n, a);
	o.length && await e.createEmbeddedDocuments("Item", o), await Xw(e, n, i, a), await e.createEmbeddedDocuments("Item", [ph({
		flagScope: Y,
		mount: i,
		plan: a,
		rider: r
	})]), await e.update({
		"system.status.wounds.max": a.wounds,
		"system.status.wounds.value": a.wounds
	});
}
function fT(e, t) {
	let n = uT[t.size] ?? 1;
	return {
		"prototypeToken.height": n,
		"prototypeToken.width": n,
		"system.characteristics.i.modifier": pT(e, "i") + t.initiative - mT(e, "i"),
		"system.characteristics.t.modifier": pT(e, "t") + t.toughness - mT(e, "t"),
		"system.details.move.value": t.movement
	};
}
function pT(e, t) {
	return jb(e.system, [[
		"characteristics",
		t,
		"modifier"
	]]);
}
function mT(e, t) {
	return jb(e.system, [[
		"characteristics",
		t,
		"value"
	]]);
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/mounts/actors.ts
function hT() {
	return game.actors.contents.map(ZC).sort((e, t) => e.name.localeCompare(t.name));
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/build-npc.ts
async function gT(e) {
	if (e.mountActorUuid && e.mountActorUuid === e.baseActorUuid) throw Error("The rider and mount must be different Actors.");
	let t = await nw(e.careers), n = await vT(e);
	if (!n) throw Error("Foundry did not create the NPC Actor.");
	let r = yT(e), i = e.careers.at(-1), a = {
		name: r,
		"prototypeToken.name": r
	}, o = Q(n.system, [
		"details",
		"gmnotes",
		"value"
	]), s = _T(o);
	s !== o && (a["system.details.gmnotes.value"] = s);
	let c = e.portraitPath || i?.img || "";
	return c && (a.img = c, a["prototypeToken.texture.src"] = c), await n.update(a), await rw(n, t), await XS(n, e.advancements), await pC(n, e.traits), e.mountActorUuid && await dT(n, e.mountActorUuid), await RC(n, e.trappings), await Hw(n, e.spells), n.sheet?.render(!0), ui.notifications?.info(`Created NPC "${r}".`), {
		name: r,
		uuid: n.uuid
	};
}
function _T(e) {
	return e.replaceAll(/(?:<hr\s*\/?>)?<section data-wfrp-customizer-npc-xp="true">[\S\s]*?<\/section>/g, "").trim();
}
async function vT(e) {
	let t = US(await fromUuid(e.baseActorUuid)).toObject(), n = DC(e.settings.outputActorFolderUuid);
	return delete t._id, delete t.folder, t.type = "npc", _C(t), n && (t.folder = n.id), await Actor.create(t);
}
function yT(e) {
	if (!e.settings.includeSpeciesInName) return e.actorName;
	let t = game.actors.contents.find((t) => t.uuid === e.baseActorUuid), n = t ? QC(t) : "";
	return !n || e.actorName.toLocaleLowerCase().includes(n.toLocaleLowerCase()) ? e.actorName : `${n} ${e.actorName}`;
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/document-drops.ts
async function bT(e) {
	let t = KS(e);
	if (t.type === "Actor") return {
		actor: await XC(e),
		kind: "actor"
	};
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Actor or WFRP Item.");
	let n = WS(await fromUuid(t.uuid), "Drop a Foundry Item.");
	if (n.type === "career") return {
		career: await tw(e),
		kind: "career"
	};
	if (n.type === "skill" || n.type === "talent") return {
		advancement: ZS(n),
		kind: "advancement"
	};
	if (n.type === "trait") return {
		kind: "trait",
		trait: await xC(e)
	};
	if (n.type === "spell") return {
		kind: "spell",
		spell: await Ww(e)
	};
	if (UC().includes(n.type)) return {
		kind: "trapping",
		trapping: await BC(e)
	};
	throw Error("Drop an Actor, Career, Skill, Talent, Trait, Trapping, or Spell Item.");
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/index.ts
var xT = {
	buildNpc: gT,
	ensureActorFolder: CC,
	ensureItemFolder: wC,
	findLowerCareerCandidates: ix,
	filterPortraitCandidates: yS,
	getPortraitSearchAvailability: async () => tS(),
	importRecommendedQuickTraits: MC,
	listActorFolders: async () => TC(),
	listBaseActors: async (e) => JC(e),
	listFoundryPortraitCandidates: ES,
	listMagicLoreOptions: sw,
	listMountActors: async () => hT(),
	listSpellsForMagicGrants: Uw,
	listItemFolders: async () => EC(),
	listQuickTraits: NC,
	listSkillCharacteristics: bx,
	listSkillSpecializations: yx,
	listTalentMaximums: Lx,
	listTraitDifficultyOptions: bC,
	loadBaseActorDraftData: YC,
	loadActorCombatProfile: tT,
	loadSettings: async () => zS(),
	resolveActorDrop: XC,
	resolveApplicationDrop: bT,
	resolveCareerDrop: tw,
	resolveSpellDrop: Ww,
	resolveTraitDrop: xC,
	resolveTrapping: zC,
	resolveTrappingDrop: BC,
	saveSettings: BS
}, ST = class extends kb {
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${Y}-npc-builder`,
		classes: [Y, "wfrp4e-customizer-npc-builder"],
		position: {
			height: 720,
			width: 980
		},
		window: {
			icon: "fa-solid fa-user-plus",
			resizable: !0,
			title: "WFRP4e NPC Builder"
		}
	};
	getVueComponent() {
		return pb;
	}
	getVueProps() {
		return { bridge: xT };
	}
}, CT = "wfrp4e-customizer-open-npc-builder";
function wT() {
	Hooks.on("renderActorDirectory", (e, t) => {
		let n = OT(t);
		n && TT(n);
	});
}
function TT(e) {
	let n = DT(e);
	if (!n) {
		t("wfrp4e-customizer-apps | Could not find Actor Directory button container.");
		return;
	}
	ET(e, n);
}
function ET(e, t) {
	if (e.querySelector(`.${CT}`)) return;
	let n = document.createElement("button");
	n.classList.add(CT, "wfrp4e-customizer-actor-directory-button"), n.type = "button", n.innerHTML = "<i class=\"fa-solid fa-user-plus\" inert></i><span>NPC Builder App</span>", n.addEventListener("click", () => {
		new ST().render(!0);
	}), t.append(n);
}
function DT(e) {
	return e.querySelector(".directory-header .header-actions") ?? e.querySelector(".directory-header .action-buttons") ?? e.querySelector(".header-actions") ?? e.querySelector(".action-buttons");
}
function OT(e) {
	return e instanceof HTMLElement ? e : kT(e) && e[0] instanceof HTMLElement ? e[0] : null;
}
function kT(e) {
	return typeof e == "object" && !!e && "length" in e;
}
//#endregion
//#region src/view/apps/actor-portrait-gallery/ActorPortraitGalleryApp.vue?vue&type=script&setup=true&lang.ts
var AT = { class: "app:flex app:h-full app:min-h-0 app:flex-col" }, jT = { class: "dui-navbar app:sticky app:top-0 app:z-10 app:min-h-0 app:gap-2 app:bg-base-100 app:px-3 app:py-2 app:shadow-sm" }, MT = { class: "dui-navbar-start app:min-w-0 app:flex-1 app:gap-2" }, NT = { class: "app:m-0 app:truncate app:text-lg app:font-semibold" }, PT = {
	key: 0,
	class: "dui-badge dui-badge-success dui-badge-sm"
}, FT = { class: "dui-navbar-end app:w-auto app:gap-2" }, IT = ["alt", "src"], LT = ["disabled"], RT = {
	key: 0,
	"aria-hidden": "true",
	class: "fa-solid fa-spinner fa-spin"
}, zT = {
	key: 1,
	"aria-hidden": "true",
	class: "fa-solid fa-layer-group"
}, BT = ["disabled"], VT = ["disabled"], HT = ["disabled"], UT = { class: "app:min-h-0 app:flex-1 app:p-2" }, WT = /* @__PURE__ */ L({
	__name: "ActorPortraitGalleryApp",
	props: {
		bridge: {},
		context: {}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ P(""), r = /* @__PURE__ */ P(""), i = /* @__PURE__ */ P(null), a = /* @__PURE__ */ P(null), o = /* @__PURE__ */ P(t.context.selectedPortraitPath), s = /* @__PURE__ */ P(t.context.currentPortraitPath), c = /* @__PURE__ */ P(t.context.currentTokenPath), l = null, u = null, d = Dl(), f = Hm({
			activePortraitPath: o,
			baseSearchTerms: /* @__PURE__ */ P([...t.context.searchTerms]),
			errorMessage: n,
			excludeFullyTransparentImages: /* @__PURE__ */ P(t.context.excludeFullyTransparentImages),
			excludedReferenceImagePaths: /* @__PURE__ */ P([...t.context.excludedReferenceImagePaths]),
			filterState: d,
			hasSubject: /* @__PURE__ */ P(!0),
			immediateCandidates: /* @__PURE__ */ P([...t.context.immediateCandidates]),
			includeCompendiumAssets: /* @__PURE__ */ P(t.context.includeCompendiumAssets),
			includeFilePickerAssets: /* @__PURE__ */ P(t.context.includeFilePickerAssets),
			pinnedPortraitPath: o,
			priorityFolderPaths: /* @__PURE__ */ P([...t.context.priorityFolderPaths]),
			provider: t.bridge,
			searchErrorMessage: "The portrait gallery could not finish searching Foundry images.",
			selectPortrait: _
		}), p = q(() => !!o.value && o.value !== s.value), m = q(() => !!o.value && o.value !== c.value), h = q(() => p.value || m.value), g = q(() => f.selectedPortraitCandidate.value?.label ?? "Selected portrait");
		Gn(o, () => {
			n.value = "", r.value = "";
		}), _r(te);
		function _(e) {
			o.value = e.img;
		}
		async function v(e) {
			if (!(!o.value || i.value || !b(e))) {
				ee(), i.value = e, n.value = "", r.value = "";
				try {
					await t.bridge.applyActorPortrait(t.context.actorUuid, o.value, e), e !== "token" && (s.value = o.value), e !== "portrait" && (c.value = o.value), r.value = x(e);
				} catch (e) {
					n.value = e instanceof Error ? e.message : "The selected image could not be applied.";
				} finally {
					i.value = null;
				}
			}
		}
		function y(e) {
			ee(), v(e);
		}
		function b(e) {
			return e === "portrait" ? p.value : e === "token" ? m.value : h.value;
		}
		function x(e) {
			return e === "portrait" ? "Portrait updated." : e === "token" ? "Prototype token updated." : "Portrait and token updated.";
		}
		function S() {
			te(), l = window.setTimeout(w, 650);
		}
		function C() {
			te(), u = window.setTimeout(ee, 180);
		}
		function w() {
			te(), a.value && !a.value.matches(":popover-open") && a.value.showPopover();
		}
		function ee() {
			te(), a.value?.matches(":popover-open") && a.value.hidePopover();
		}
		function te() {
			l !== null && (window.clearTimeout(l), l = null), u !== null && (window.clearTimeout(u), u = null);
		}
		return (t, s) => (B(), V("section", AT, [U("header", jT, [U("div", MT, [U("h1", NT, A(e.context.actorName), 1), r.value ? (B(), V("span", PT, A(r.value), 1)) : K("", !0)]), U("div", FT, [
			o.value ? (B(), V("img", {
				key: 0,
				alt: `${g.value} preview`,
				class: "app:aspect-square app:w-10 app:rounded-box app:bg-base-300 app:object-cover",
				height: "40",
				src: o.value,
				width: "40"
			}, null, 8, IT)) : K("", !0),
			U("div", {
				class: "dui-join",
				onFocusin: w,
				onFocusout: C,
				onPointerenter: S,
				onPointerleave: C
			}, [U("button", {
				class: "dui-btn dui-btn-primary dui-btn-sm dui-join-item",
				disabled: !h.value || !!i.value,
				type: "button",
				onClick: s[0] ||= (e) => v("both")
			}, [i.value === "both" ? (B(), V("i", RT)) : (B(), V("i", zT)), G(" " + A(i.value === "both" ? "Applying..." : "Apply to Both"), 1)], 8, LT), U("button", {
				"aria-label": "More apply options",
				class: "dui-btn dui-btn-primary dui-btn-sm dui-btn-square dui-join-item",
				disabled: !o.value || !!i.value,
				popovertarget: "actor-portrait-apply-menu",
				style: { "anchor-name": "--actor-portrait-apply-menu" },
				type: "button"
			}, [...s[3] ||= [U("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-chevron-down"
			}, null, -1)]], 8, BT)], 32),
			U("ul", {
				id: "actor-portrait-apply-menu",
				ref_key: "applyMenu",
				ref: a,
				class: "dui-dropdown dui-dropdown-end dui-menu dui-menu-sm app:z-20 app:mt-1 app:w-52 app:rounded-box app:bg-base-100 app:p-2 app:shadow-lg",
				popover: "",
				style: { "position-anchor": "--actor-portrait-apply-menu" },
				onFocusin: w,
				onFocusout: C,
				onPointerenter: w,
				onPointerleave: C
			}, [U("li", null, [U("button", {
				disabled: !p.value || !!i.value,
				type: "button",
				onClick: s[1] ||= (e) => y("portrait")
			}, [...s[4] ||= [U("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-image"
			}, null, -1), G(" Portrait only ", -1)]], 8, VT)]), U("li", null, [U("button", {
				disabled: !m.value || !!i.value,
				type: "button",
				onClick: s[2] ||= (e) => y("token")
			}, [...s[5] ||= [U("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-circle"
			}, null, -1), G(" Token only ", -1)]], 8, HT)])], 544)
		])]), U("main", UT, [W(gm, {
			class: "app:h-full",
			"empty-message": "No portrait or token images are available for this Actor yet.",
			"error-message": n.value,
			"fill-height": "",
			"is-loading": F(f).isLoadingPortraitCandidates.value,
			options: F(f).portraitCandidates.value,
			"progress-label": F(f).portraitSearchProgressLabel.value,
			"progress-value": F(f).portraitSearchProgressValue.value,
			"search-terms": F(f).portraitSearchTerms.value,
			"selected-option-key": F(f).selectedPortraitCandidateKey.value,
			tags: F(f).portraitFilterTags.value,
			onCreateSearchTerm: F(f).addPortraitSearchTerm,
			onFilterTagSectionChange: F(f).setPortraitFilterTagSection,
			onSelectPortrait: F(f).selectPortrait
		}, null, 8, [
			"error-message",
			"is-loading",
			"options",
			"progress-label",
			"progress-value",
			"search-terms",
			"selected-option-key",
			"tags",
			"onCreateSearchTerm",
			"onFilterTagSectionChange",
			"onSelectPortrait"
		])])]));
	}
}), GT = {
	applyActorPortrait: KT,
	filterPortraitCandidates: yS,
	listPortraitCandidates: ES
};
async function KT(e, t, n) {
	await US(await fromUuid(e), "The Actor for this portrait gallery is no longer available.").update(qT(t, n));
}
function qT(e, t) {
	return t === "portrait" ? { img: e } : t === "token" ? { "prototypeToken.texture.src": e } : {
		img: e,
		"prototypeToken.texture.src": e
	};
}
//#endregion
//#region src/module/apps/actor-portrait-gallery/context.ts
function JT(e, t) {
	let n = e.img?.trim() ?? "", r = Wx(e), i = (e.items?.contents ?? []).filter((e) => e.type === "career"), a = Q(e.system, [
		"details",
		"career",
		"name"
	]), o = [
		e.name,
		Q(e, ["Species"]),
		Q(e.system, [
			"details",
			"species",
			"value"
		]),
		Q(e.system, [
			"details",
			"species",
			"subspecies"
		]),
		a,
		Q(e.system, [
			"details",
			"career",
			"careergroup",
			"value"
		]),
		Q(e.system, [
			"details",
			"career",
			"class",
			"value"
		]),
		...i.flatMap(XT)
	];
	return {
		actorName: e.name,
		actorUuid: e.uuid,
		currentPortraitPath: n,
		currentTokenPath: r,
		excludeFullyTransparentImages: t.excludeFullyTransparentPortraitAssets,
		excludedReferenceImagePaths: [...t.excludedPortraitReferenceImages],
		immediateCandidates: YT(e, n, r),
		includeCompendiumAssets: t.searchCompendiumPortraitAssets,
		includeFilePickerAssets: t.searchFoundryPortraitAssets,
		priorityFolderPaths: dl({
			configuredFolders: t.prioritizedPortraitFolders,
			hasCareer: !!a || i.length > 0
		}),
		searchTerms: ll(o),
		selectedPortraitPath: n || r
	};
}
function YT(e, t, n) {
	let r = [];
	return t && r.push({
		img: t,
		key: `base-actor:${e.uuid}`,
		label: `${e.name} portrait`,
		source: "base-actor",
		sourceGroup: "world",
		sourceLabel: "Actor Portrait"
	}), n && n !== t && r.push({
		img: n,
		key: `base-token:${e.uuid}`,
		label: `${e.name} prototype token`,
		source: "base-token",
		sourceGroup: "world",
		sourceLabel: "Prototype Token"
	}), Zc(r);
}
function XT(e) {
	return [
		e.name,
		Q(e.system, ["careergroup", "value"]),
		Q(e.system, ["class", "value"])
	];
}
//#endregion
//#region src/module/apps/actor-portrait-gallery/ActorPortraitGalleryApplication.ts
var ZT = class extends kb {
	actor;
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${Y}-actor-portrait-gallery`,
		classes: [Y, "wfrp4e-customizer-actor-portrait-gallery"],
		position: {
			height: 760,
			width: 900
		},
		window: {
			icon: "fa-solid fa-images",
			resizable: !0,
			title: "Choose Actor Portrait & Token"
		}
	};
	constructor(e) {
		super(), this.actor = e;
	}
	getVueComponent() {
		return WT;
	}
	getVueProps() {
		return {
			bridge: GT,
			context: JT(this.actor, zS())
		};
	}
};
//#endregion
//#region src/module/apps/actor-portrait-gallery/open.ts
async function QT(e) {
	await new ZT(US(await fromUuid(e), "The requested Actor could not be opened in the portrait gallery.")).render(!0);
}
async function $T(e) {
	await new ZT(e).render(!0);
}
//#endregion
//#region src/module/apps/actor-portrait-gallery/register-actor-sheet-button.ts
var eE = "openWfrpCustomizerPortraitGallery", tE = "wfrp4e-customizer-actor-portrait-gallery-header", nE = [
	"getHeaderControlsActorSheetWFRP4eCharacter",
	"getHeaderControlsActorSheetWFRP4eNPC",
	"getHeaderControlsActorSheetWFRP4eCreature",
	"getHeaderControlsStandardWFRP4eActorSheet",
	"getHeaderControlsBaseWFRP4eActorSheet",
	"getHeaderControlsWarhammerActorSheetV2"
], rE = [
	"renderActorSheetWFRP4eCharacter",
	"renderActorSheetWFRP4eNPC",
	"renderActorSheetWFRP4eCreature",
	"renderStandardWFRP4eActorSheet",
	"renderBaseWFRP4eActorSheet",
	"renderWarhammerActorSheetV2"
], iE = !1;
function aE() {
	if (!iE) {
		iE = !0;
		for (let e of nE) Hooks.on(e, oE);
		for (let e of rE) Hooks.on(e, sE);
	}
}
function oE(e, t) {
	let n = cE(e);
	if (!n || !Array.isArray(t) || n.isOwner === !1) return;
	let r = t;
	r.some((e) => e.action === eE) || r.push({
		action: eE,
		icon: "fa-solid fa-images",
		label: "Choose Portrait & Token"
	});
	let i = e;
	i.options ??= {}, i.options.actions ??= {}, i.options.actions[eE] = function() {
		let e = cE(this);
		e && uE(e);
	};
}
function sE(e) {
	let t = cE(e), n = lE(e);
	if (!t || !n || t.isOwner === !1) return;
	let r = n.querySelector(".window-header");
	if (!r || r.querySelector(`.${tE}, [data-action="${eE}"]`)) return;
	let i = document.createElement("button");
	i.type = "button", i.classList.add(tE, "header-control", "icon", "fa-solid", "fa-images"), i.dataset.action = eE, i.dataset.tooltip = "Choose Portrait & Token", i.ariaLabel = `Choose a portrait and prototype token for ${t.name}`, i.addEventListener("click", (e) => {
		e.preventDefault(), e.stopPropagation(), uE(t);
	});
	let a = r.querySelector("[data-action=\"toggleControls\"]") ?? r.querySelector("[data-action=\"close\"]");
	r.insertBefore(i, a);
}
function cE(e) {
	if (typeof e != "object" || !e) return null;
	let t = "document" in e ? e.document : void 0, n = "actor" in e ? e.actor : void 0;
	return VS(t) ? t : VS(n) ? n : null;
}
function lE(e) {
	return typeof e != "object" || !e || !("element" in e) ? null : e.element instanceof HTMLElement ? e.element : null;
}
async function uE(e) {
	try {
		await $T(e);
	} catch (e) {
		t("wfrp4e-customizer-apps | Actor portrait gallery could not be opened.", e), ui.notifications?.warn?.("The portrait gallery could not be opened. See the console for details.");
	}
}
//#endregion
//#region src/module/apps/npc-builder/estimated-xp/actor-profile.ts
function dE(e) {
	let t = e.toObject(), n = {};
	for (let e of Object.keys(Ss)) {
		let r = e;
		n[r] = YS(t.system, r);
	}
	return {
		characteristics: n,
		skills: fE(e, "skill"),
		talents: fE(e, "talent")
	};
}
function fE(e, t) {
	return e.items?.contents.filter((e) => e.type === t).map((e) => ({
		name: e.name,
		value: t === "skill" ? pE(e.toObject().system) : mE(e.toObject().system)
	})) ?? [];
}
function pE(e) {
	return jb(e, [["advances", "value"], ["advances"]]) + jb(e, [["modifier", "value"], ["modifier"]]);
}
function mE(e) {
	return jb(e, [["advances", "value"], ["advances"]]);
}
//#endregion
//#region src/module/apps/npc-builder/estimated-xp/species-actor.ts
var hE = null;
async function gE(e, t, n) {
	let r = game.actors.contents, i = _E(n ? r.filter((e) => e.folder?.uuid === n) : [], e);
	if (i) return {
		actor: i,
		source: i.folder?.name ?? "Configured NPC Base Actors folder"
	};
	let a = _E(r.filter((e) => e.uuid !== t.uuid), e);
	if (a) return {
		actor: a,
		source: "World Actors"
	};
	let o = vE(await bE(), e);
	if (!o) return null;
	let s = await fromUuid(o.uuid);
	if (!SE(s)) throw Error(`The species Actor ${o.uuid} is no longer available.`);
	return {
		actor: s,
		source: o.source
	};
}
function _E(e, t) {
	return yE(e, t, (e) => e.name);
}
function vE(e, t) {
	return yE(e, t, (e) => e.name);
}
function yE(e, t, n) {
	let r = t.trim();
	return e.find((e) => n(e).trim() === r) ?? e.find((e) => Ms(n(e)) === Ms(t)) ?? null;
}
function bE() {
	return hE ??= xE(), hE;
}
async function xE() {
	let e = [];
	for (let t of game.packs ?? []) {
		if (!Gb(t) || !t.getIndex) continue;
		let n = await t.getIndex({ fields: ["name"] });
		for (let r of Kb(n)) {
			let n = Ub(t, r);
			r.name && n && e.push({
				name: r.name,
				source: t.title ?? t.collection ?? "Actor Compendium",
				uuid: n
			});
		}
	}
	return e;
}
function SE(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Actor";
}
//#endregion
//#region src/module/apps/npc-builder/estimated-xp/estimate.ts
async function CE(e) {
	let t = US(await fromUuid(e), "Expected an NPC Actor.");
	if (t.type !== "npc") throw Error(`Expected an NPC Actor, but received Actor type “${t.type}”.`);
	return await wE(t);
}
async function wE(e) {
	let t = QC(e);
	if (!t) return { status: "missing-species" };
	let n = await gE(t, e, zS().baseActorFolderUuid);
	return n ? {
		baselineName: n.actor.name,
		baselineSource: n.source,
		baselineUuid: n.actor.uuid,
		breakdown: Ec(dE(e), dE(n.actor)),
		species: t,
		status: "ready"
	} : {
		species: t,
		status: "baseline-not-found"
	};
}
//#endregion
//#region src/module/apps/npc-builder/estimated-xp/sheet.ts
var TE = "[data-wfrp-customizer-npc-xp=\"true\"]", EE = /* @__PURE__ */ new Set(), DE = !1, OE = !1;
function kE() {
	if (!DE) {
		DE = !0, Hooks.on("renderApplicationV2", (e, t) => {
			if (!(t instanceof HTMLElement)) return;
			let n = PE(e);
			n && AE(n, t);
		});
		for (let e of [
			"createActor",
			"updateActor",
			"deleteActor",
			"createItem",
			"updateItem",
			"deleteItem",
			"updateSetting"
		]) Hooks.on(e, FE);
	}
}
function AE(e, t) {
	let n = t.matches("section[data-tab=\"careers\"]") ? t : t.querySelector("section[data-tab=\"careers\"]");
	if (!n) return;
	n.querySelector(TE)?.remove();
	let r = jE(e, t), i = n.querySelector(".sheet-list.careers");
	i ? n.insertBefore(r.container, i) : n.append(r.container), IE(), ME(r), globalThis.setTimeout(() => {
		r.root.isConnected && r.root.contains(r.container) && (IE(), EE.add(r));
	}, 0);
}
function jE(e, t) {
	let n = document.createElement("div");
	n.dataset.wfrpCustomizerNpcXp = "true";
	let r = document.createElement("div");
	r.classList.add("form-group");
	let i = document.createElement("label");
	i.textContent = "Estimated NPC XP";
	let a = document.createElement("div");
	a.classList.add("form-fields");
	let o = document.createElement("input");
	o.type = "text", o.readOnly = !0, o.value = "Calculating…";
	let s = document.createElement("p");
	return s.classList.add("notes"), s.textContent = "Comparing this NPC with its species Actor.", a.append(o), r.append(i, a), n.append(r, s), {
		actor: e,
		container: n,
		details: s,
		generation: 0,
		output: o,
		root: t
	};
}
async function ME(e) {
	let n = ++e.generation;
	e.output.value = "Calculating…";
	try {
		let t = await wE(e.actor);
		n === e.generation && e.root.contains(e.container) && NE(e, t);
	} catch (r) {
		n === e.generation && e.root.contains(e.container) && (e.output.value = "Unavailable", e.details.textContent = "XP calculation failed; see the console for details."), t("wfrp4e-customizer-apps | NPC XP calculation failed.", r);
	}
}
function NE(e, t) {
	if (t.status === "missing-species") {
		e.output.value = "Unavailable", e.details.textContent = "Set this NPC's Species to select a baseline Actor.";
		return;
	}
	if (t.status === "baseline-not-found") {
		e.output.value = "Unavailable", e.details.textContent = `No Actor named “${t.species}” was found.`;
		return;
	}
	let { breakdown: n } = t;
	e.output.value = `${n.total.toLocaleString()} XP`, e.details.textContent = [
		`${t.baselineName} (${t.baselineSource})`,
		`Characteristics ${n.characteristics.toLocaleString()}`,
		`Skills ${n.skills.toLocaleString()}`,
		`Talents ${n.talents.toLocaleString()}`
	].join(" · ");
}
function PE(e) {
	if (typeof e != "object" || !e) return null;
	let t = "actor" in e ? e.actor : void 0, n = "document" in e ? e.document : void 0, r = VS(t) ? t : VS(n) ? n : null;
	return r?.type === "npc" ? r : null;
}
function FE() {
	OE || (OE = !0, globalThis.setTimeout(() => {
		OE = !1, IE();
		for (let e of EE) ME(e);
	}, 0));
}
function IE() {
	for (let e of EE) (!e.root.isConnected || !e.root.contains(e.container)) && EE.delete(e);
}
//#endregion
//#region src/shared/assign-if-present.ts
function $(e, t, n) {
	n !== void 0 && (e[t] = n);
}
//#endregion
//#region src/functions/species-builder/item-reference-names.ts
function LE(e) {
	return zE(e.name, e.specification);
}
function RE(e) {
	let t = e.name.trim();
	if (!e.item) return t;
	if (!t) return LE(e.item);
	if (!VE(t)) {
		if (e.item.specification) return zE(t, e.item.specification);
		if (VE(e.item.name) && HE(t) === HE(e.item.name)) return e.item.name.trim();
	}
	return t;
}
function zE(e, t) {
	let n = e.trim(), r = t?.trim();
	return !n || !r || BE(n) ? n : `${n} (${r})`;
}
function BE(e) {
	return /\(([^()]*)\)\s*$/.exec(e.trim())?.[1]?.trim() ?? "";
}
function VE(e) {
	return /\([^()]*\)\s*$/.test(e.trim());
}
function HE(e) {
	return e.split("(")[0]?.trim().toLocaleLowerCase() ?? "";
}
//#endregion
//#region src/functions/species-builder/replacement-row-records.ts
function UE(e) {
	if (!e) return;
	let t = e.flatMap((e) => {
		let t = RE(e.rolled), n = RE(e.replacement);
		return t && n ? [[t, n]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : void 0;
}
function WE(e) {
	if (!e) return;
	let t = e.flatMap((e) => {
		let t = RE(e.rolled), n = e.replacements.map(RE).filter((e) => e.length > 0);
		return t && n.length > 0 ? [[t, n]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : void 0;
}
//#endregion
//#region src/functions/species-builder/linked-grant-records.ts
function GE(e) {
	if (!e || e.length === 0) return;
	let t = e.map(RE).filter((e) => e.length > 0);
	return t.length > 0 ? t : void 0;
}
function KE(e) {
	if (!e || e.length === 0) return;
	let t = e.flatMap((e) => {
		let t = e.choices.map(RE).filter((e) => e.length > 0);
		return t.length > 0 ? [t.join(", ")] : [];
	});
	return t.length > 0 ? t : void 0;
}
//#endregion
//#region src/functions/species-builder/subspecies-list-fields.ts
function qE(e) {
	return GE(e.linkedSkills) ?? e.skills;
}
function JE(e, t) {
	return eD(qE(e), t.skillsAdded, t.skillsRemoved);
}
function YE(e) {
	return KE(e.linkedTalents) ?? e.talents;
}
function XE(e, t) {
	return eD(YE(e), t.talentsAdded, t.talentsRemoved);
}
function ZE(e, t) {
	return $E(GE(e.linkedTraits) ?? e.traits, t);
}
function QE(e, t, n = {}) {
	let r = n.subspecies ?? n.parent, i = eD(ZE(e), t.traitsAdded, t.traitsRemoved);
	return i ? $E(i, r) : n.subspecies ? $E(ZE(e), n.subspecies) : void 0;
}
function $E(e, t) {
	if (!t) return e;
	let n = e ? [...e] : [];
	return n.includes(t) || n.push(t), n;
}
function eD(e, t, n) {
	if (!t && !n) return;
	let r = new Set(n ?? []), i = (e ?? []).filter((e) => !r.has(e));
	for (let e of t ?? []) i.includes(e) || i.push(e);
	return i;
}
//#endregion
//#region src/functions/species-builder/definition-plans.ts
function tD(e, t = []) {
	let n = new Map(t.map((e) => [e.key.trim(), e])), r = e.definitions.flatMap((e) => n.has(e.key.trim()) ? [] : [{
		definition: e,
		emitBaseDefinition: !0,
		subspecies: e.subspecies ?? []
	}]), i = (e.runtimeSpeciesExtensions ?? []).flatMap((e) => {
		let t = n.get(e.speciesKey.trim());
		if (!t) return [];
		let r = new Set((t.subspecies ?? []).map((e) => e.key.trim())), i = e.subspecies.filter((e) => !r.has(e.key.trim()));
		return i.length > 0 ? [{
			definition: t,
			emitBaseDefinition: !1,
			subspecies: i
		}] : [];
	});
	return [...r, ...i];
}
//#endregion
//#region src/functions/species-builder/familiar-correction.ts
var nD = "constructfamiliar", rD = "Familiar", iD = "Compendium.wfrp4e-wom.items.Item.GWEA2m8FN3IbV7Su", aD = "Compendium.wfrp4e-wom.items.Item.6wTQe3nFr1j64D6s", oD = [
	"Athletics",
	"Channelling (Wind)",
	"Dodge",
	"Intuition",
	"Lore (Magick)",
	"Melee (Basic)",
	"Perception",
	"Language (Classical)",
	"Language (Magick)",
	"Stealth (Urban)",
	"Stealth (Rural)",
	"Research"
], sD = [
	"Petty Magic",
	"Read/Write",
	"Second Sight",
	"Savvy, Coolheaded",
	"Small",
	"Suffuse with (Wind)"
], cD = [
	"Climb",
	"Cool",
	"Endurance",
	"Intimidate",
	"Melee (Fencing)",
	"Melee (Flail)",
	"Melee (Parrying)",
	"Melee (Two-handed)"
], lD = [
	"Channelling (Wind)",
	"Intuition",
	"Lore (Magick)",
	"Language (Classical)",
	"Language (Magick)",
	"Stealth (Urban)",
	"Stealth (Rural)",
	"Research"
], uD = [
	"Fearless (Size Large or Smaller)",
	"Lightning Reflexes, Very Strong",
	"Sturdy",
	"Very Resilient, Warrior Born"
], dD = [
	"Petty Magic",
	"Read/Write",
	"Second Sight",
	"Savvy, Coolheaded"
];
function fD(e = nD) {
	return {
		careerTable: { rows: [{
			journalUuid: aD,
			name: "Spell Familiar"
		}] },
		characteristics: {
			[J.WeaponSkill]: "2d10+10",
			[J.BallisticSkill]: "2d10+10",
			[J.Strength]: "2d10+10",
			[J.Toughness]: "2d10+10",
			[J.Initiative]: "2d10+20",
			[J.Agility]: "2d10+20",
			[J.Dexterity]: "2d10+20",
			[J.Intelligence]: "1d10+30",
			[J.Willpower]: "1d10+30",
			[J.Fellowship]: "2d10+10"
		},
		extra: 0,
		fate: 2,
		includeInExtraSpecies: !0,
		key: e,
		movement: 4,
		name: rD,
		randomTalents: { talents: 0 },
		resilience: 1,
		skills: [...oD],
		subspecies: [
			{
				careerTable: { rows: [{
					journalUuid: iD,
					name: "Combat Familiar"
				}] },
				characteristics: {
					[J.WeaponSkill]: "1d10+30",
					[J.Strength]: "1d10+30",
					[J.Toughness]: "2d10+20",
					[J.Intelligence]: "2d10+10",
					[J.Willpower]: "2d10+10"
				},
				fate: 1,
				key: "combat",
				name: "Combat Familiar",
				resilience: 2,
				skillsAdded: [...cD],
				skillsRemoved: [...lD],
				talentsAdded: [...uD],
				talentsRemoved: [...dD]
			},
			{
				careerTable: { rows: [{
					journalUuid: aD,
					name: "Spell Familiar"
				}] },
				key: "spell",
				name: "Spell Familiar"
			},
			{
				careerTable: { rows: [{
					journalUuid: aD,
					name: "Spell Familiar"
				}] },
				key: "power",
				name: "Power Familiar",
				skillsRemoved: ["Channelling (Wind)", "Language (Magick)"],
				talentsAdded: ["Magical Assistant"],
				talentsRemoved: ["Petty Magic"]
			}
		],
		talents: [...sD],
		traits: ["Magical"],
		woundFormula: { formula: "2 * @tb + @wpb" }
	};
}
//#endregion
//#region src/functions/species-builder/wound-formula/compiler.ts
function pD(e) {
	let t = [], n = /* @__PURE__ */ new Set(), r = e.trim();
	return r = r.replaceAll(/@([A-Za-z][\dA-Za-z]*)/g, (e, t) => {
		let r = mD(t);
		return n.add(r), r;
	}), r = r.replaceAll(/{([^{}]+)}/g, (e, n) => hD(t, n, "total")), r = r.replaceAll(/\[([^[\]]+)]/g, (e, n) => hD(t, n, "bonus")), {
		expression: r,
		references: t,
		usedKeywords: n
	};
}
function mD(e) {
	if ((/* @__PURE__ */ "ablaze.advantage.age.bleeding.blinded.broken.corruption.deafened.entangled.fate.fatigued.fortune.height.poisoned.rank.resilience.resolve.sb.sbMultiplier.scale.sin.size.status.stunned.tb.tbMultiplier.weight.wpb.wpbMultiplier.xp".split(".")).includes(e)) return e;
	throw Error(`Unknown wound formula keyword: @${e}`);
}
function hD(e, t, n) {
	let r = gD(t, n, e), i = e.find((e) => _D(e, r));
	return i ? i.variableName : (e.push(r), r.variableName);
}
function gD(e, t, n) {
	let [r, i] = vD(e), a = yD(r), o = CD(SD(r, i, t), n);
	if (a && !i) return {
		characteristicKey: a,
		kind: t,
		name: r,
		source: "characteristic",
		variableName: o
	};
	let s = {
		kind: t,
		name: r,
		source: "skill",
		variableName: o
	};
	return i && (s.characteristicOverride = bD(i)), s;
}
function _D(e, t) {
	return e.characteristicKey === t.characteristicKey && e.characteristicOverride === t.characteristicOverride && e.kind === t.kind && e.name === t.name && e.source === t.source;
}
function vD(e) {
	let t = e.split("|").map((e) => e.trim());
	if (t.length > 2 || !t[0]) throw Error(`Invalid wound formula attribute reference: ${e}`);
	return [t[0], t[1]];
}
function yD(e) {
	let t = e.trim().toLocaleLowerCase();
	return ws(t) ? t : Cs[t] ?? xD[t];
}
function bD(e) {
	let t = yD(e);
	if (!t) throw Error(`Unknown wound formula characteristic: ${e}`);
	return t;
}
var xD = {
	ag: "ag",
	bs: "bs",
	dex: "dex",
	fel: "fel",
	i: "i",
	int: "int",
	s: "s",
	t: "t",
	wp: "wp",
	ws: "ws"
};
function SD(e, t, n) {
	let [r, ...i] = [e, t].flatMap((e) => e ? e.match(/\d+|[A-Za-z]+/g) ?? [] : []), a = r ? [r.toLocaleLowerCase(), ...i.map((e) => e.charAt(0).toLocaleUpperCase() + e.slice(1))].join("") : "attribute";
	return n === "bonus" ? `${a}Bonus` : a;
}
function CD(e, t) {
	let n = new Set(t.map((e) => e.variableName));
	if (!n.has(e)) return e;
	let r = 2, i = `${e}${r}`;
	for (; n.has(i);) r += 1, i = `${e}${r}`;
	return i;
}
//#endregion
//#region src/functions/species-builder/wound-formula/script-lines.ts
function wD(e) {
	let t = [];
	if (DD(e, [
		"sb",
		"tb",
		"wpb"
	]) && (t.push(...OD(e, "sb", "preWoundArgs.sb")), t.push(...OD(e, "tb", "preWoundArgs.tb")), t.push(...OD(e, "wpb", "preWoundArgs.wpb"))), DD(e, [
		"sbMultiplier",
		"tbMultiplier",
		"wpbMultiplier"
	]) && (t.push("const multiplier = preWoundArgs.multiplier;"), t.push(...OD(e, "sbMultiplier", "multiplier.sb")), t.push(...OD(e, "tbMultiplier", "multiplier.tb")), t.push(...OD(e, "wpbMultiplier", "multiplier.wpb"))), DD(e, ["scale", "size"]) && (t.push(...kD()), t.push("const size = actorSizeStep();"), t.push(...OD(e, "scale", "2 ** size"))), DD(e, PD) && (t.push(...OD(e, "age", "Number(actor.system.details.age.value)")), t.push(...OD(e, "height", "Number(actor.system.details.height.value)")), t.push(...OD(e, "weight", "Number(actor.system.details.weight.value)")), t.push(...LD(e))), DD(e, FD) && (t.push(...OD(e, "xp", "actor.system.details.experience.total")), t.push(...OD(e, "fate", "actor.system.status.fate.value")), t.push(...OD(e, "fortune", "actor.system.status.fortune.value")), t.push(...OD(e, "resilience", "actor.system.status.resilience.value")), t.push(...OD(e, "resolve", "actor.system.status.resolve.value")), t.push(...OD(e, "corruption", "actor.system.status.corruption.value")), t.push(...OD(e, "sin", "actor.system.status.sin.value")), t.push(...OD(e, "advantage", "actor.system.status.advantage.value"))), DD(e, ID)) {
		t.push(...RD());
		for (let n of ID) t.push(...OD(e, n, `conditionValue("${n}")`));
	}
	return t.length ? [...t, ""] : [];
}
function TD(e) {
	let t = e.length > 0, n = e.some((e) => e.source === "skill");
	return [...AD(t), ...jD(n)];
}
function ED(e) {
	return e.map((e) => e.source === "characteristic" ? MD(e) : ND(e));
}
function DD(e, t) {
	return t.some((t) => e.has(t));
}
function OD(e, t, n) {
	return e.has(t) ? [`const ${t} = ${n};`] : [];
}
function kD() {
	return [
		"function actorSizeStep() {",
		"  const sizeSteps = {",
		"    tiny: -3,",
		"    ltl: -2,",
		"    little: -2,",
		"    sml: -1,",
		"    small: -1,",
		"    avg: 0,",
		"    average: 0,",
		"    lrg: 1,",
		"    large: 1,",
		"    enor: 2,",
		"    enormous: 2,",
		"    mon: 3,",
		"    mnst: 3,",
		"    monstrous: 3,",
		"  };",
		"  return sizeSteps[actor.system.details.size.value.trim().toLocaleLowerCase()];",
		"}",
		""
	];
}
function AD(e) {
	return e ? [
		"function characteristicTotal(key) {",
		"  const characteristic = actor.system.characteristics[key];",
		"  return characteristic.value;",
		"}",
		"",
		"function characteristicBonus(key) {",
		"  return actor.system.characteristics[key].bonus;",
		"}",
		""
	] : [];
}
function jD(e) {
	return e ? [
		"function normalizedName(value) {",
		"  return value.trim().toLocaleLowerCase();",
		"}",
		"",
		"function findSkillItem(name, items) {",
		"  return items.find((item) => item.type === 'skill' && normalizedName(item.name) === normalizedName(name));",
		"}",
		"",
		"function skillAdvances(skill) {",
		"  return skill.system.advances.value;",
		"}",
		"",
		"function skillBaseName(name) {",
		"  return name.split('(')[0].trim();",
		"}",
		"",
		"function skillTotal(name, characteristicOverride) {",
		"  const actorSkill = findSkillItem(name, actor.items.contents);",
		"",
		"  if (actorSkill) {",
		"    const characteristicKey = characteristicOverride || actorSkill.system.characteristic.value;",
		"    return characteristicOverride ? characteristicTotal(characteristicKey) + skillAdvances(actorSkill) : actorSkill.system.total;",
		"  }",
		"",
		"  const worldSkill = findSkillItem(name, game.items.contents) || findSkillItem(skillBaseName(name), game.items.contents);",
		"",
		"  if (!worldSkill) {",
		"    return 0;",
		"  }",
		"",
		"  if (worldSkill.system.advanced.value !== 'bsc' && name === skillBaseName(name)) {",
		"    return 0;",
		"  }",
		"",
		"  return characteristicTotal(characteristicOverride || worldSkill.system.characteristic.value);",
		"}",
		"",
		"function skillBonus(name, characteristicOverride) {",
		"  return Math.floor(skillTotal(name, characteristicOverride) / 10);",
		"}",
		""
	] : [];
}
function MD(e) {
	let t = e.kind === "bonus" ? "characteristicBonus" : "characteristicTotal";
	return `const ${e.variableName} = ${t}(${JSON.stringify(e.characteristicKey)});`;
}
function ND(e) {
	let t = e.kind === "bonus" ? "skillBonus" : "skillTotal", n = e.characteristicOverride ? JSON.stringify(e.characteristicOverride) : "undefined";
	return `const ${e.variableName} = ${t}(${JSON.stringify(e.name)}, ${n});`;
}
var PD = [
	"age",
	"height",
	"rank",
	"status",
	"weight"
], FD = [
	"advantage",
	"corruption",
	"fate",
	"fortune",
	"resilience",
	"resolve",
	"sin",
	"xp"
], ID = [
	"ablaze",
	"bleeding",
	"blinded",
	"broken",
	"deafened",
	"entangled",
	"fatigued",
	"poisoned",
	"stunned"
];
function LD(e) {
	let t = [];
	return e.has("status") && t.push("function statusTierValue() {", "  const statusTiers = { brass: 1, silver: 2, gold: 3 };", "  const tier = actor.system.details.status.tier;", "  return statusTiers[String(tier).toLocaleLowerCase()] || Number(tier);", "}", "const status = statusTierValue();"), t.push(...OD(e, "rank", "Number(actor.system.details.status.standing)")), t;
}
function RD() {
	return [
		"function conditionValue(key) {",
		"  return actor.hasCondition(key)?.conditionValue || 0;",
		"}"
	];
}
//#endregion
//#region src/functions/species-builder/wound-formula/index.ts
function zD(e) {
	let t = pD(e);
	return [
		...wD(t.usedKeywords),
		...TD(t.references),
		...ED(t.references),
		"",
		`args.wounds = ${t.expression};`
	];
}
//#endregion
//#region src/functions/effect-builders/wounds.ts
var BD = ["const storageKey = \"__wfrp4eCustomizerWoundFormulaArgs\";", "const sourceId = this.effect.id;"];
function VD(e, t) {
	return {
		changes: [],
		disabled: !1,
		img: "icons/svg/regen.svg",
		name: e,
		transfer: !0,
		system: {
			transferData: {
				documentType: "Actor",
				type: "document"
			},
			scriptData: [{
				label: `${e} Capture`,
				trigger: "preWoundCalc",
				script: [
					...BD,
					"this.actor[storageKey] ||= {};",
					"this.actor[storageKey][sourceId] = args;"
				].join("\n")
			}, {
				label: e,
				trigger: "woundCalc",
				script: [
					...BD,
					"const preWoundArgs = this.actor[storageKey][sourceId];",
					"const actor = this.actor;",
					...zD(t)
				].join("\n")
			}]
		}
	};
}
//#endregion
//#region src/functions/species-builder/wound-formula-traits.ts
function HD(e) {
	return `__${e.name.trim()}__`;
}
function UD(e, t) {
	return `__${e.name.trim()} / ${t.name.trim()}__`;
}
//#endregion
//#region src/functions/species-builder/species-config.ts
function WD(e, t = []) {
	let n = GD();
	for (let r of tD(e, t)) r.emitBaseDefinition && KD(n, r.definition), qD(n, r.definition, r.subspecies);
	return n;
}
function GD() {
	return {
		extraSpecies: [],
		species: {},
		speciesAge: {},
		speciesCareerReplacements: {},
		speciesCharacteristics: {},
		speciesExtra: {},
		speciesFate: {},
		speciesHeight: {},
		speciesMovement: {},
		speciesRandomTalents: {},
		speciesRes: {},
		speciesSkills: {},
		speciesTalentReplacement: {},
		speciesTalents: {},
		speciesTraits: {},
		subspecies: {}
	};
}
function KD(e, t) {
	e.species[t.key] = t.name, $(e.speciesCharacteristics, t.key, t.characteristics), e.speciesSkills[t.key] = qE(t) ?? [], e.speciesTalents[t.key] = YE(t) ?? [], $(e.speciesRandomTalents, t.key, t.randomTalents), $(e.speciesTalentReplacement, t.key, ZD(t)), $(e.speciesTraits, t.key, ZE(t, t.woundFormula ? HD(t) : void 0)), $(e.speciesMovement, t.key, t.movement), $(e.speciesFate, t.key, t.fate), $(e.speciesRes, t.key, t.resilience), $(e.speciesExtra, t.key, t.extra), $(e.speciesAge, t.key, t.age), $(e.speciesHeight, t.key, t.height), $(e.speciesCareerReplacements, t.key, QD(t)), t.includeInExtraSpecies && e.extraSpecies.push(t.key);
}
function qD(e, t, n) {
	for (let r of n) {
		let n = e.subspecies[t.key] ?? {}, i = r.woundFormula ? UD(t, r) : void 0, a = r.careerTable ? XD(t, r) : void 0;
		n[r.key] = JD(t, r, i, a), e.subspecies[t.key] = n;
	}
}
function JD(e, t, n, r) {
	let i = { name: t.name };
	return $(i, "characteristics", t.characteristics ? {
		...e.characteristics,
		...t.characteristics
	} : void 0), $(i, "skills", JE(e, t)), $(i, "talents", XE(e, t)), $(i, "speciesTraits", QE(e, t, {
		parent: e.woundFormula ? HD(e) : void 0,
		subspecies: n
	})), $(i, "randomTalents", t.randomTalents), $(i, "talentReplacement", ZD(t)), $(i, "movement", t.movement), $(i, "fate", t.fate), $(i, "resilience", t.resilience), $(i, "extra", t.extra), $(i, "careerTable", r), i;
}
function YD(e) {
	return e.key;
}
function XD(e, t) {
	return `${e.key}-${t.key}`;
}
function ZD(e) {
	return UE(e.talentReplacementRows) ?? e.talentReplacements;
}
function QD(e) {
	return WE(e.careerReplacementRows) ?? e.careerReplacements;
}
//#endregion
//#region src/functions/species-builder/items/choices.ts
function $D(e) {
	let t = [];
	return {
		structure: {
			id: "root",
			type: "and",
			options: e.map((e, n) => {
				let r = e.choices.map((e, r) => {
					let i = `talent-${n}-${r}`;
					return t.push({
						id: i,
						name: RE(e),
						type: e.item ? "item" : "placeholder",
						idType: e.item ? "uuid" : "",
						documentId: e.item?.uuid ?? "",
						diff: {},
						filters: []
					}), {
						id: i,
						type: "option"
					};
				});
				return r.length === 1 ? r[0] : {
					id: `group-${n}`,
					type: "or",
					options: r
				};
			})
		},
		options: t,
		script: ""
	};
}
function eO(e) {
	if (e.script.trim()) throw Error("Scripted Talent choices cannot be represented by legacy species config.");
	let t = new Map(e.options.map((e) => [e.id, e]));
	function n(e) {
		if (e.type === "option") {
			let n = t.get(e.id);
			if (!n || !["item", "placeholder"].includes(n.type) || !n.name.trim()) throw Error("Species Talent choices must refer to named Talents; filters and effects need chargen v2.");
			if (Object.keys(n.diff).length || n.filters.length) throw Error("Modified or filtered Talent choice documents require native chargen v2.");
			let r = n.idType === "uuid" && n.documentId ? {
				name: n.name,
				uuid: n.documentId,
				type: "talent"
			} : void 0;
			return [{ choices: [{
				name: n.name,
				...r ? { item: r } : {}
			}] }];
		}
		let r = e.options ?? [];
		if (e.type === "and") return r.flatMap(n);
		let i = r.map(n);
		if (i.some((e) => e.length !== 1)) throw Error("A choice between groups of Talents needs chargen v2 and cannot become a legacy either/or grant.");
		return i.length ? [{ choices: i.flatMap((e) => e[0].choices) }] : [];
	}
	return n(e.structure);
}
//#endregion
//#region src/functions/species-builder/items/system.ts
function tO() {
	return {
		uuid: "",
		id: "",
		name: ""
	};
}
function nO() {
	return {
		description: { value: "" },
		gmdescription: { value: "" },
		characteristics: Object.fromEntries(Object.values(J).map((e) => [e, {
			base: 20,
			dice: 2
		}])),
		fate: 0,
		resilience: 0,
		extra: 0,
		movement: 4,
		skills: { list: [] },
		talents: {
			choices: $D([]),
			random: 0
		},
		size: "avg",
		subspeciesOf: tO(),
		keys: [],
		tables: {
			talents: tO(),
			eye: tO(),
			hair: tO(),
			career: tO()
		}
	};
}
function rO(e) {
	let t = {};
	for (let n of Object.values(J)) {
		let r = e.characteristics[n];
		r && r.base !== null && r.dice !== null && (t[n] = r.dice === 0 ? String(r.base) : `${r.dice}d10+${r.base}`);
	}
	return Object.keys(t).length ? t : void 0;
}
//#endregion
//#region src/functions/species-builder/items/effect-carriers.ts
var iO = "speciesEffectCarrier";
function aO(e) {
	return `__Species Effects ${e.id}__`;
}
function oO(e) {
	let t = structuredClone(e);
	return delete t._stats, t;
}
function sO(e, t) {
	return {
		type: "trait",
		name: aO(e),
		img: e.img,
		effects: e.effects.map(oO),
		system: { description: { value: `<p>Temporary species effects carrier for @UUID[${e.uuid}]. Edit the effects on the Species Item; this Trait is regenerated for legacy character creation.</p>` } },
		flags: { [t]: { [iO]: { speciesUuid: e.uuid } } }
	};
}
//#endregion
//#region src/functions/species-builder/items/definitions.ts
function cO(e, t = {}) {
	let { system: n } = e, r = eO(n.talents.choices), i = {
		key: n.keys[0] || `species${e.id.toLowerCase()}`,
		name: e.name,
		includeInExtraSpecies: !0,
		skills: n.skills.list,
		talents: r.map((e) => e.choices.map((e) => e.name).join(", "))
	};
	e.effects.length && (i.traits = [aO(e)]), $(i, "characteristics", rO(n)), $(i, "careerTable", t.careerTable);
	for (let e of [
		"extra",
		"fate",
		"movement",
		"resilience"
	]) {
		let t = n[e];
		t !== null && (i[e] = t);
	}
	return n.talents.random !== null && (i.randomTalents = { [t.randomTalentKey || "talents"]: n.talents.random }), i;
}
function lO(e, t, n) {
	let r = uO(e.system, t.system), i = cO({
		...e,
		system: r
	}, n), a = {
		key: i.key,
		name: i.name
	};
	for (let e of [
		"characteristics",
		"extra",
		"fate",
		"movement",
		"resilience",
		"randomTalents",
		"careerTable"
	]) $(a, e, i[e]);
	let o = cO(t), s = e.effects.length ? i.traits : o.traits;
	return Object.assign(a, dO("skills", o.skills ?? [], i.skills ?? [])), Object.assign(a, dO("talents", o.talents ?? [], i.talents ?? [])), Object.assign(a, dO("traits", o.traits ?? [], s ?? [])), a;
}
function uO(e, t) {
	eO(e.talents.choices);
	let n = structuredClone(e);
	for (let r of Object.values(J)) n.characteristics[r] = {
		base: e.characteristics[r]?.base ?? t.characteristics[r]?.base ?? null,
		dice: e.characteristics[r]?.dice ?? t.characteristics[r]?.dice ?? null
	};
	for (let r of [
		"extra",
		"fate",
		"movement",
		"resilience"
	]) n[r] = e[r] ?? t[r];
	return e.skills.list.length || (n.skills = t.skills), e.talents.choices.options.length || (n.talents.choices = t.talents.choices), n.talents.random = e.talents.random ?? t.talents.random, n;
}
function dO(e, t, n) {
	return {
		[`${e}Added`]: n.filter((e) => !t.includes(e)),
		[`${e}Removed`]: t.filter((e) => !n.includes(e))
	};
}
//#endregion
//#region src/functions/species-builder/items/catalog.ts
function fO(e, t = /* @__PURE__ */ new Map()) {
	let n = new Map(e.filter((e) => !pO(e)).map((e) => [e.uuid, cO(e, t.get(e.uuid))]));
	for (let r of e.filter(pO)) {
		let i = r.system.subspeciesOf, a = e.find((e) => i.uuid ? e.uuid === i.uuid : e.id === i.id);
		if (!a) throw Error(`${r.name}: parent Species Item is missing from the world. Import its parent before loading species.`);
		if (pO(a)) throw Error(`${r.name}: nested or cyclic subspecies cannot be represented by WFRP's current config.`);
		let o = n.get(a.uuid), s = {
			...t.get(a.uuid),
			...t.get(r.uuid)
		};
		(o.subspecies ??= []).push(lO(r, a, s));
	}
	return {
		definitions: [...n.values()],
		runtimeSpeciesExtensions: []
	};
}
function pO(e) {
	return !!(e.system.subspeciesOf.uuid || e.system.subspeciesOf.id);
}
//#endregion
//#region src/functions/species-builder/default-species-builder-settings.ts
function mO() {
	return {
		autoRegisterSpeciesTable: !1,
		correctExistingWfrpSpecies: !1,
		definitions: [],
		runtimeSpeciesExtensions: [],
		showGeneratedConfigTab: !1
	};
}
//#endregion
//#region src/module/apps/species-builder/runtime-species/career-table.ts
function hO(e, t, n) {
	let r = _O(e, t, typeof n == "string" ? n.trim() : "");
	for (let e of r) {
		let t = game.wfrp4e?.tables?.findTable?.("career", e);
		if (!t) continue;
		let n = vO(t, e);
		if (n) return gO(n);
	}
}
function gO(e) {
	if (!X(e)) return;
	let t = TO(e.results).flatMap((e) => {
		let t = bO(e);
		return t ? [t] : [];
	}), n = e.formula;
	return t.length > 0 ? {
		rows: t,
		...typeof n == "string" ? { sourceFormula: n } : {}
	} : void 0;
}
function _O(e, t, n) {
	let r = t ? [
		n,
		`${e}-${t}`,
		e
	] : [e];
	return e === "human" && r.push("human-reiklander"), [...new Set(r.filter(Boolean))];
}
function vO(e, t) {
	return !X(e) || !Array.isArray(e.columns) ? e : e.columns.find((e) => yO(e) === t);
}
function yO(e) {
	if (!X(e) || typeof e.getFlag != "function") return "";
	let t = e.getFlag.call(e, "wfrp4e", "column");
	return typeof t == "string" ? t : "";
}
function bO(e) {
	if (!X(e)) return;
	let t = CO(e), n = /@UUID\[([^\]]+)\]\{([^}]+)\}/u.exec(t), r = wO(n?.[2] ?? ""), i = wO(t) || wO(e.name), a = r || i;
	if (!a) return;
	let o = n?.[1]?.trim(), s = xO(e.range), c = SO(e.weight), l = { name: a };
	return o && (l.journalUuid = o), s && (l.sourceRange = s), c !== void 0 && (l.sourceWeight = c), l;
}
function xO(e) {
	if (!Array.isArray(e) || e.length < 2) return;
	let t = Number(e[0]), n = Number(e[1]);
	return Number.isFinite(t) && Number.isFinite(n) ? [t, n] : void 0;
}
function SO(e) {
	let t = Number(e);
	return Number.isFinite(t) && t > 0 ? t : void 0;
}
function CO(e) {
	if (e.type === "document") {
		let t = e.documentUuid, n = e.name;
		return typeof t == "string" && typeof n == "string" ? `@UUID[${t}]{${n}}` : "";
	}
	let t = e.description ?? e.text;
	return typeof t == "string" ? t : "";
}
function wO(e) {
	return typeof e == "string" ? e.replace(/@UUID\[[^\]]+\]\{([^}]+)\}/gu, "$1").replace(/<[^>]*>/gu, "").trim() : "";
}
function TO(e) {
	return Array.isArray(e) ? e : typeof e == "object" && e && Symbol.iterator in e ? [...e] : [];
}
//#endregion
//#region src/module/apps/species-builder/items/table-references.ts
function EO(e) {
	let t = {}, n = DO(e.system.tables.talents);
	if (n) {
		let r = n.getFlag("wfrp4e", "key");
		if (typeof r != "string" || !r.trim()) throw Error(`${e.name}: the random Talent table needs a WFRP table key.`);
		t.randomTalentKey = r;
	}
	let r = DO(e.system.tables.career);
	if (r) {
		let n = gO(r);
		if (!n) throw Error(`${e.name}: the referenced Career table has no usable rows.`);
		t.careerTable = n;
	}
	return t;
}
function DO(e) {
	if (!e.uuid && !e.id) return;
	let t = game.tables?.contents.find((t) => e.uuid ? t.uuid === e.uuid : t.id === e.id);
	if (!t) throw Error(`Import the referenced RollTable ${e.name || e.uuid || e.id} into the world and relink it.`);
	return t;
}
//#endregion
//#region src/module/apps/species-builder/items/effect-sources.ts
function OO(e) {
	if (e === void 0) return [];
	if (!Array.isArray(e)) throw Error("Species effects must be embedded Active Effects.");
	return e.map((e) => {
		if (!X(e) || typeof e._id != "string") throw Error("Species effects must have Foundry document IDs.");
		return {
			...structuredClone(e),
			_id: e._id
		};
	});
}
//#endregion
//#region src/module/apps/species-builder/items/adapter.ts
var kO = `${Y}.species`;
function AO(e) {
	return e.type === kO || e.type === "species";
}
function jO(e) {
	let t = e.toObject();
	return {
		id: e.id,
		uuid: e.uuid,
		name: e.name,
		img: e.img || "icons/svg/mystery-man.svg",
		system: MO(t.system),
		effects: OO(t.effects)
	};
}
function MO(e) {
	if (!X(e)) throw Error("Species Item system data is missing.");
	let t = nO(), n = zO(e.characteristics), r = zO(e.talents), i = zO(r.choices), a = zO(e.tables);
	return {
		description: { value: IO(zO(e.description).value) },
		gmdescription: { value: IO(zO(e.gmdescription).value) },
		characteristics: Object.fromEntries(Object.values(J).map((e) => {
			let t = zO(n[e]);
			return [e, {
				base: FO(t.base),
				dice: FO(t.dice)
			}];
		})),
		extra: FO(e.extra),
		fate: FO(e.fate),
		movement: FO(e.movement),
		resilience: FO(e.resilience),
		keys: RO(e.keys),
		size: IO(e.size) || "avg",
		skills: { list: RO(zO(e.skills).list) },
		talents: {
			random: FO(r.random),
			choices: {
				structure: i.structure === void 0 ? t.talents.choices.structure : NO(i.structure),
				options: LO(i.options).map((e) => {
					let t = zO(e);
					return {
						type: IO(t.type),
						id: IO(t.id),
						name: IO(t.name),
						documentId: IO(t.documentId),
						idType: IO(t.idType),
						diff: zO(t.diff),
						filters: LO(t.filters).map((e) => {
							let t = zO(e);
							return {
								path: IO(t.path),
								operation: IO(t.operation),
								value: IO(t.value)
							};
						})
					};
				}),
				script: IO(i.script)
			}
		},
		subspeciesOf: PO(e.subspeciesOf),
		tables: {
			talents: PO(a.talents),
			eye: PO(a.eye),
			hair: PO(a.hair),
			career: PO(a.career)
		}
	};
}
function NO(e) {
	let t = zO(e), n = t.type;
	if (n !== "and" && n !== "or" && n !== "option") throw Error("Species Talent choice structure is invalid.");
	return {
		type: n,
		id: IO(t.id),
		...n === "option" ? {} : { options: LO(t.options).map(NO) }
	};
}
function PO(e) {
	let t = zO(e);
	return {
		uuid: IO(t.uuid),
		id: IO(t.id),
		name: IO(t.name)
	};
}
function FO(e) {
	if (e == null) return null;
	if (typeof e != "number" || !Number.isFinite(e) || e < 0) throw Error("Species statistics must be non-negative numbers or empty inheritance values.");
	return e;
}
function IO(e) {
	return typeof e == "string" ? e : "";
}
function LO(e) {
	return Array.isArray(e) ? e : [];
}
function RO(e) {
	return LO(e).map((e) => {
		if (typeof e != "string") throw Error("Species keys and skills must contain text values.");
		return e;
	});
}
function zO(e) {
	return X(e) ? e : {};
}
//#endregion
//#region src/module/apps/species-builder/items/repository.ts
function BO() {
	return (game.items?.contents ?? []).filter(AO);
}
function VO() {
	let e = BO().map(jO), t = new Map(e.map((e) => [e.uuid, EO(e)]));
	return {
		...mO(),
		...fO(e, t)
	};
}
async function HO(e, t) {
	UO();
	let n = e.toObject(), r = X(n.system) ? n.system : {};
	return await e.update({
		name: t.name,
		img: t.img,
		system: {
			...r,
			...t.system
		}
	}, { recursive: !1 }), e;
}
function UO() {
	if (!game.user?.isGM) throw Error("Only a GM can change world Species Items through the Customizer.");
}
//#endregion
//#region src/module/apps/species-builder/apply-species-config.ts
var WO = [
	"species",
	"speciesCharacteristics",
	"speciesSkills",
	"speciesTalents",
	"speciesRandomTalents",
	"speciesTalentReplacement",
	"speciesTraits",
	"speciesMovement",
	"speciesFate",
	"speciesRes",
	"speciesExtra",
	"speciesAge",
	"speciesHeight",
	"speciesCareerReplacements"
];
function GO(n = VO()) {
	let r = game.wfrp4e?.config;
	if (!X(r)) {
		t(`${Y} | WFRP config was unavailable; custom species were not applied.`);
		return;
	}
	let i = new Set(X(r.species) ? Object.keys(r.species) : []), a = new Set(n.definitions.filter((e, t, n) => n.some((n, r) => t !== r && n.key === e.key)).map(({ key: e }) => e));
	a.size && t(`Duplicate Species Item keys were skipped: ${[...a].join(", ")}`);
	let o = n.definitions.filter((e) => !a.has(e.key)), s = WD({
		...n,
		definitions: o
	});
	for (let e of WO) for (let t of i) delete s[e][t];
	s.extraSpecies = s.extraSpecies.filter((e) => !i.has(e)), KO(r, s), o.length > 0 && e(`${Y} | Applied ${o.length} custom species definition(s).`);
}
function KO(e, t) {
	for (let n of WO) qO(e, n, t[n]);
	JO(e, t.extraSpecies), YO(e, t.subspecies);
}
function qO(e, t, n) {
	if (Object.keys(n).length === 0) return;
	let r = e[t];
	if (!X(r)) {
		e[t] = { ...n };
		return;
	}
	Object.assign(r, n);
}
function JO(e, t) {
	if (t.length === 0) return;
	let n = Array.isArray(e.extraSpecies) ? e.extraSpecies : [], r = /* @__PURE__ */ new Set();
	for (let e of n) typeof e == "string" && r.add(e);
	for (let e of t) r.add(e);
	e.extraSpecies = [...r];
}
function YO(e, t) {
	if (Object.keys(t).length === 0) return;
	let n = X(e.subspecies) ? e.subspecies : {};
	for (let [e, r] of Object.entries(t)) {
		let t = X(n[e]) ? n[e] : {};
		Object.assign(t, r), n[e] = t;
	}
	e.subspecies = n;
}
//#endregion
//#region src/functions/species-builder/career-tables.ts
var XO = "generatedSpeciesCareerTable", ZO = "Compendium.wfrp4e-core.journals.JournalEntry.wczCPcuHT4VQDLpL", QO = "Compendium.wfrp4e-archives3.journals.JournalEntry.jnN5JqDCI8T1epzs.JournalEntryPage.yByG9MMGFjml7sRQ";
function $O(e, t = []) {
	return [
		...tD(e, t).flatMap((e) => [...e.emitBaseDefinition ? ik(e.definition) : [], ...ck(e.definition, e.subspecies)]),
		...ak(e, t),
		...ok(e, t)
	];
}
function ek({ fallbackJournalUuid: e = ZO, flagScope: t, speciesItemBridge: n, spec: r }) {
	let i = {
		speciesKey: r.speciesKey,
		subspeciesKey: r.subspeciesKey ?? ""
	}, a = {
		displayRoll: !0,
		flags: {
			wfrp4e: {
				column: r.column,
				key: "career"
			},
			[t]: { [XO]: i }
		},
		formula: r.sourceFormula ?? `1d${r.rows.length}`,
		img: "systems/wfrp4e/ui/buttons/d10.webp",
		name: r.name,
		replacement: !0,
		results: r.rows.map((t, n) => ({
			description: lk(t, e),
			drawn: !1,
			img: "icons/svg/d20-grey.svg",
			name: t.name,
			range: t.sourceRange ? [...t.sourceRange] : [n + 1, n + 1],
			type: "text",
			weight: t.sourceWeight ?? 1
		}))
	}, o = a.flags;
	return o[t][XO] = {
		...i,
		...n ? { speciesItemBridge: !0 } : {},
		fingerprint: tk(a, t),
		schemaVersion: 1
	}, a;
}
function tk(e, t) {
	let n = nk(e, t), r = 2166136261;
	for (let e = 0; e < n.length; e += 1) r ^= n.charCodeAt(e), r = Math.imul(r, 16777619);
	return (r >>> 0).toString(16).padStart(8, "0");
}
function nk(e, t) {
	return JSON.stringify(dk(e, t));
}
function rk(e) {
	return JSON.stringify(fk(e));
}
function ik(e) {
	return e.careerTable?.rows.length ? [{
		column: YD(e),
		name: `Career - ${e.name}`,
		...e.careerTable,
		speciesKey: e.key
	}] : [];
}
function ak(e, t) {
	if (!e.correctExistingWfrpSpecies) return [];
	let n = t.find((e) => e.name.trim() === "Animal Familiar");
	return n ? [{
		column: n.key,
		name: "Career - Animal Familiar",
		rows: [{
			journalUuid: QO,
			name: "Power Familiar"
		}],
		speciesKey: n.key
	}] : [];
}
function ok(e, t) {
	if (!e.correctExistingWfrpSpecies) return [];
	let n = t.find((e) => e.name.trim() === rD);
	if (!n) return [];
	let r = fD(n.key);
	return [...ik(r), ...ck(r, r.subspecies ?? [])];
}
function sk(e) {
	return e === "Compendium.wfrp4e-wom.items.Item.GWEA2m8FN3IbV7Su" || e === "Compendium.wfrp4e-wom.items.Item.6wTQe3nFr1j64D6s";
}
function ck(e, t) {
	return t.flatMap((t) => t.careerTable?.rows.length ? [{
		column: XD(e, t),
		name: `Career - ${e.name} / ${t.name}`,
		...t.careerTable,
		speciesKey: e.key,
		subspeciesKey: t.key
	}] : []);
}
function lk(e, t) {
	return `@UUID[${e.journalUuid?.trim() || t}]{${uk(e.name)}}`;
}
function uk(e) {
	return e.replaceAll("{", "").replaceAll("}", "").trim();
}
function dk(e, t) {
	let n = Z(e, ["results"]);
	return {
		displayRoll: Z(e, ["displayRoll"]),
		flags: {
			generated: {
				speciesKey: Z(e, [
					"flags",
					t,
					XO,
					"speciesKey"
				]),
				subspeciesKey: Z(e, [
					"flags",
					t,
					XO,
					"subspeciesKey"
				])
			},
			wfrp4e: {
				column: Z(e, [
					"flags",
					"wfrp4e",
					"column"
				]),
				key: Z(e, [
					"flags",
					"wfrp4e",
					"key"
				])
			}
		},
		formula: Z(e, ["formula"]),
		img: Z(e, ["img"]),
		name: Z(e, ["name"]),
		replacement: Z(e, ["replacement"]),
		results: Array.isArray(n) ? n.filter(X).map(fk) : []
	};
}
function fk(e) {
	return {
		description: e.description,
		drawn: e.drawn,
		img: e.img,
		name: e.name,
		range: e.range,
		type: e.type,
		weight: e.weight
	};
}
//#endregion
//#region src/functions/species-builder/generated-table-sync.ts
function pk(e, t, n, r) {
	let i = /* @__PURE__ */ new Map(), a = [];
	for (let e of t) {
		let t = mk(e.source, n);
		if (t) {
			let n = hk(t);
			i.set(n, [...i.get(n) ?? [], e]);
		} else a.push(e.id);
	}
	return {
		entries: e.map((e) => {
			let t = mk(e, n), a = (t ? i.get(hk(t)) : void 0)?.shift();
			if (!a) return {
				action: "create",
				source: e
			};
			let o = nk(a.source, n) === nk(e, n);
			return {
				action: r || !o ? "update" : "skip",
				existingId: a.id,
				source: e
			};
		}),
		obsoleteIds: [...a, ...[...i.values()].flatMap((e) => e.map((e) => e.id))]
	};
}
function mk(e, t) {
	let n = Z(e, [
		"flags",
		t,
		XO
	]);
	if (!X(n)) return;
	let r = Q(n, ["speciesKey"]);
	return r ? {
		speciesKey: r,
		subspeciesKey: Q(n, ["subspeciesKey"])
	} : void 0;
}
function hk(e) {
	return `${e.speciesKey}\u0000${e.subspeciesKey}`;
}
//#endregion
//#region src/module/foundry/roll-table-results.ts
async function gk(e, t) {
	t.updates.length > 0 && await e.updateEmbeddedDocuments("TableResult", t.updates), t.creates.length > 0 && await e.createEmbeddedDocuments("TableResult", t.creates), t.deletedIds.length > 0 && await e.deleteEmbeddedDocuments("TableResult", t.deletedIds);
}
//#endregion
//#region src/module/apps/species-builder/items/career-outputs.ts
function _k() {
	let e = BO().map((e) => jO(e).system.tables.career);
	return (game.tables?.contents ?? []).filter((t) => Z(t.toObject(), [
		"flags",
		"wfrp4e-customizer-apps",
		"generatedSpeciesCareerTable",
		"speciesItemBridge"
	]) === !0 && !e.some((e) => e.uuid === t.uuid || !e.uuid && e.id === t.id));
}
//#endregion
//#region src/module/apps/species-builder/items/migration.ts
function vk() {
	return typeof CONFIG.Item.dataModels.species == "function";
}
async function yk() {
	if (!vk() || !game.user?.isGM || game.users?.activeGM && game.users.activeGM.id !== game.user.id) return 0;
	let e = 0;
	for (let t of BO().filter((e) => e.type === kO)) await t.update({ type: "species" }), e += 1;
	return e;
}
//#endregion
//#region src/module/apps/species-builder/runtime-species/config-snapshot.ts
var bk = [
	"species",
	"speciesAge",
	"speciesCareerReplacements",
	"speciesCharacteristics",
	"speciesExtra",
	"speciesFate",
	"speciesHeight",
	"speciesMovement",
	"speciesRandomTalents",
	"speciesRes",
	"speciesSkills",
	"speciesTalentReplacement",
	"speciesTalents",
	"speciesTraits",
	"subspecies"
];
function xk(e) {
	let t = X(e) ? e : {}, n = Object.fromEntries(bk.map((e) => [e, Ek(t[e])]));
	return {
		extraSpecies: Ok(t.extraSpecies),
		records: n
	};
}
function Sk(e, t, n) {
	let r = Object.fromEntries(bk.map((r) => [r, wk(r, e.records[r], t.records[r], n)]));
	return {
		extraSpecies: kk([...e.extraSpecies, ...t.extraSpecies]).filter((t) => !n.has(t) || e.extraSpecies.includes(t)),
		records: r
	};
}
function Ck(e, t, n) {
	return e.records[t][n];
}
function wk(e, t, n, r) {
	let i = e === "subspecies" ? Tk(t, n) : {
		...t,
		...n
	};
	for (let e of r) Object.hasOwn(t, e) ? i[e] = Dk(t[e]) : delete i[e];
	return i;
}
function Tk(e, t) {
	let n = new Set([...Object.keys(e), ...Object.keys(t)]);
	return Object.fromEntries([...n].map((n) => {
		let r = X(e[n]) ? e[n] : {}, i = X(t[n]) ? t[n] : {};
		return [n, {
			...r,
			...i
		}];
	}));
}
function Ek(e) {
	return X(e) ? Object.fromEntries(Object.entries(e).map(([e, t]) => [e, Dk(t)])) : {};
}
function Dk(e) {
	return Array.isArray(e) ? e.map(Dk) : X(e) ? Object.fromEntries(Object.entries(e).map(([e, t]) => [e, Dk(t)])) : e;
}
function Ok(e) {
	return Array.isArray(e) ? e.flatMap((e) => typeof e == "string" && e.trim() ? [e.trim()] : []) : [];
}
function kk(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/module/apps/species-builder/runtime-species/values.ts
var Ak = Object.values(J);
function jk(e) {
	if (typeof e == "string") return e.trim() || void 0;
}
function Mk(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
function Nk(e) {
	if (Array.isArray(e)) return e.flatMap((e) => {
		let t = jk(e);
		return t ? [t] : [];
	});
}
function Pk(e) {
	if (!Array.isArray(e)) return;
	let t, n = [];
	for (let r of e) {
		let e = Fk(r);
		if (e !== void 0) {
			t = e;
			continue;
		}
		let i = jk(r);
		i && n.push(i);
	}
	return t === void 0 ? { talents: n } : {
		randomTalentCount: t,
		talents: n
	};
}
function Fk(e) {
	if (typeof e == "number") return Mk(e);
	if (typeof e != "string" || !e.trim()) return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function Ik(e) {
	if (X(e)) return Object.fromEntries(Object.entries(e).flatMap(([e, t]) => {
		let n = jk(e), r = jk(t);
		return n && r ? [[n, r]] : [];
	}));
}
function Lk(e) {
	if (X(e)) return Object.fromEntries(Object.entries(e).flatMap(([e, t]) => {
		let n = jk(e), r = Fk(t);
		return n && r !== void 0 ? [[n, r]] : [];
	}));
}
function Rk(e) {
	if (X(e)) return Object.fromEntries(Object.entries(e).flatMap(([e, t]) => {
		let n = jk(e), r = Nk(t);
		return n && r ? [[n, r]] : [];
	}));
}
function zk(e) {
	if (!X(e)) return;
	let t = Ak.flatMap((t) => {
		let n = jk(e[t]);
		return n ? [[t, n]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : {};
}
function Bk(e) {
	if (!X(e)) return;
	let t = {};
	return $(t, "die", jk(e.die)), $(t, "feet", Mk(e.feet)), $(t, "inches", Mk(e.inches)), Object.keys(t).length > 0 ? t : {};
}
function Vk(e, t, n = void 0) {
	if (!e && t === void 0) return;
	let r = { ...e ?? n };
	return t !== void 0 && (r.talents = t), r;
}
function Hk(e, t) {
	let n = t.filter((t) => !e.includes(t)), r = e.filter((e) => !t.includes(e)), i = {};
	return $(i, "added", n.length > 0 ? n : void 0), $(i, "removed", r.length > 0 ? r : void 0), i;
}
function Uk(e, t) {
	let n = Object.fromEntries(Object.entries(t).filter(([t, n]) => e?.[t] !== n));
	return Object.keys(n).length > 0 ? n : void 0;
}
function Wk(e, t) {
	let n = Object.entries(e ?? {}), r = Object.entries(t ?? {});
	return n.length === r.length && n.every(([e, n]) => t?.[e] === n);
}
function Gk(e, t, n, r) {
	let i = Mk(r);
	i !== void 0 && i !== n && (e[t] = i);
}
//#endregion
//#region src/module/apps/species-builder/runtime-species/definition-adapter.ts
function Kk(e, t) {
	let n = new Set(e.extraSpecies);
	return Object.entries(e.records.species).flatMap(([r, i]) => {
		let a = r.trim();
		return a ? [qk(e, a, i, n, t)] : [];
	}).sort(tA);
}
function qk(e, t, n, r, i) {
	let a = {
		includeInExtraSpecies: r.has(t),
		key: t,
		name: jk(n) ?? t
	}, o = Pk(Ck(e, "speciesTalents", t));
	$(a, "characteristics", zk(Ck(e, "speciesCharacteristics", t))), $(a, "skills", Nk(Ck(e, "speciesSkills", t))), $(a, "talents", o?.talents), $(a, "randomTalents", Vk(Lk(Ck(e, "speciesRandomTalents", t)), o?.randomTalentCount)), $(a, "talentReplacements", Ik(Ck(e, "speciesTalentReplacement", t))), $(a, "traits", Nk(Ck(e, "speciesTraits", t))), Jk(a, e, t), $(a, "careerTable", i.resolveCareerTable(t, void 0, void 0));
	let s = Yk(e, a, i);
	return $(a, "subspecies", s.length > 0 ? s : void 0), a;
}
function Jk(e, t, n) {
	$(e, "movement", Mk(Ck(t, "speciesMovement", n))), $(e, "fate", Mk(Ck(t, "speciesFate", n))), $(e, "resilience", Mk(Ck(t, "speciesRes", n))), $(e, "extra", Mk(Ck(t, "speciesExtra", n))), $(e, "age", jk(Ck(t, "speciesAge", n))), $(e, "height", Bk(Ck(t, "speciesHeight", n))), $(e, "careerReplacements", Rk(Ck(t, "speciesCareerReplacements", n)));
}
function Yk(e, t, n) {
	let r = Ck(e, "subspecies", t.key);
	return X(r) ? Object.entries(r).flatMap(([r, i]) => r.trim() && X(i) ? [Xk(e, t, r.trim(), i, n)] : []).sort(tA) : [];
}
function Xk(e, t, n, r, i) {
	let a = {
		key: n,
		name: jk(r.name) ?? n
	}, o = zk(r.characteristics);
	o && $(a, "characteristics", Uk(t.characteristics, o)), Zk(a, t, r), $k(a, t, r), eA(a, t, r), $(a, "careerReplacements", Rk(Ck(e, "speciesCareerReplacements", `${t.key}-${n}`)));
	let s = Ik(r.talentReplacement);
	return Wk(t.talentReplacements, s) || $(a, "talentReplacements", s), $(a, "careerTable", i.resolveCareerTable(t.key, n, r.careerTable)), a;
}
function Zk(e, t, n) {
	Qk(e, "skills", t.skills ?? [], Nk(n.skills));
	let r = Pk(n.talents);
	Qk(e, "talents", t.talents ?? [], r?.talents), Qk(e, "traits", t.traits ?? [], Nk(n.speciesTraits));
}
function Qk(e, t, n, r) {
	if (!r) return;
	let i = Hk(n, r);
	$(e, `${t}Added`, i.added), $(e, `${t}Removed`, i.removed);
}
function $k(e, t, n) {
	let r = Pk(n.talents), i = Vk(Lk(n.randomTalents), r?.randomTalentCount, t.randomTalents);
	Wk(t.randomTalents, i) || $(e, "randomTalents", i);
}
function eA(e, t, n) {
	Gk(e, "movement", t.movement, n.movement), Gk(e, "fate", t.fate, n.fate), Gk(e, "resilience", t.resilience, n.resilience), Gk(e, "extra", t.extra, n.extra);
}
function tA(e, t) {
	return e.name.localeCompare(t.name);
}
//#endregion
//#region src/module/apps/species-builder/runtime-species/index.ts
var nA, rA = [];
function iA() {
	nA = xk(game.wfrp4e?.config), rA = [];
}
async function aA(e, t = []) {
	let n = Sk(nA ?? xk(void 0), xk(game.wfrp4e?.config), new Set(e.map((e) => e.trim()).filter(Boolean)));
	for (let e of t) delete n.records.species[e];
	rA = Kk(n, { resolveCareerTable: hO });
}
async function oA() {
	return structuredClone(rA);
}
//#endregion
//#region src/module/apps/species-builder/career-tables.ts
var sA = "WFRP Customizer Generated Career Tables", cA = "WFRP Customizer Career Table Link Fallback", lA, uA = !1;
function dA(e, t = {}) {
	let n = t.force === !0;
	if (!pA() || vk()) return Promise.resolve(CA());
	let r = e ?? VO();
	return lA ? n && !uA ? lA.then(() => dA(r, { force: !0 })) : lA : (uA = n, lA = fA(r, n).finally(() => {
		lA = void 0, uA = !1;
	}), lA);
}
async function fA(e, t) {
	let n = performance.now(), r = $O(e, await oA()).filter((e) => !mA(e) || !hA(e.column)), i = r.some((e) => e.rows.some((e) => !e.journalUuid?.trim())) ? await SA() : void 0, a = r.map((e) => ek({
		fallbackJournalUuid: i,
		flagScope: Y,
		speciesItemBridge: !0,
		spec: e
	})), o = _k(), s = new Map(o.map((e) => [e.id, e])), c = pk(a, o.map((e) => ({
		id: e.id,
		source: e.toObject()
	})), Y, t), l, u = 0, d = 0;
	for (let e of c.entries) {
		if (e.action === "skip") {
			u += 1;
			continue;
		}
		if (e.action === "create") l ??= await xA(), await _A(e.source, l);
		else {
			let n = e.existingId ? s.get(e.existingId) : void 0;
			if (!n) throw Error("A generated career table changed during synchronization.");
			await vA(n, e.source, t);
		}
		d += 1;
	}
	for (let e of c.obsoleteIds) await s.get(e)?.delete();
	let f = {
		checked: a.length,
		elapsedMilliseconds: performance.now() - n,
		regenerated: d,
		removed: c.obsoleteIds.length,
		skipped: u
	};
	return wA(f, t), f;
}
function pA() {
	return game.user?.isGM === !0 && game.users?.activeGM?.id === game.user.id;
}
function mA(e) {
	return e.rows.some((e) => e.journalUuid === "Compendium.wfrp4e-archives3.journals.JournalEntry.jnN5JqDCI8T1epzs.JournalEntryPage.yByG9MMGFjml7sRQ" || sk(e.journalUuid));
}
function hA(e) {
	return (game.tables?.contents ?? []).some((t) => !gA(t) && t.getFlag("wfrp4e", "key") === "career" && t.getFlag("wfrp4e", "column") === e);
}
function gA(e) {
	return X(Z(e.toObject(), [
		"flags",
		Y,
		XO
	]));
}
async function _A(e, t) {
	if (!await RollTable.create({
		...e,
		folder: t.id
	})) throw Error("Foundry did not create a generated Species Builder career table.");
}
async function vA(e, t, n) {
	let r = Z(t, [
		"flags",
		Y,
		XO
	]);
	await e.update({
		displayRoll: t.displayRoll,
		[`flags.${Y}.${XO}`]: r,
		"flags.wfrp4e.column": Z(t, [
			"flags",
			"wfrp4e",
			"column"
		]),
		"flags.wfrp4e.key": Z(t, [
			"flags",
			"wfrp4e",
			"key"
		]),
		formula: t.formula,
		img: t.img,
		name: t.name,
		replacement: t.replacement
	}), await yA(e, t, n);
}
async function yA(e, t, n) {
	let r = bA(e.toObject()), i = bA(t), a = [], o = [];
	i.forEach((e, t) => {
		let i = r[t], s = Q(i, ["_id"]);
		s ? (n || rk(i) !== rk(e)) && a.push({
			...e,
			_id: s
		}) : o.push(e);
	}), await gk(e, {
		creates: o,
		deletedIds: r.slice(i.length).map((e) => Q(e, ["_id"])).filter(Boolean),
		updates: a
	});
}
function bA(e) {
	let t = Z(e, ["results"]);
	return Array.isArray(t) ? t.filter(X) : [];
}
async function xA() {
	let e = game.folders.contents.find((e) => e.type === "RollTable" && e.name === sA);
	if (e) return e;
	let t = await Folder.create({
		name: sA,
		type: "RollTable"
	});
	if (!t) throw Error("Foundry did not create the generated career table folder.");
	return t;
}
async function SA() {
	let e = game.journal?.contents.find((e) => e.name === cA);
	if (e) return e.uuid;
	let t = await JournalEntry.create({
		name: cA,
		pages: [{
			name: "Why This Link Exists",
			text: {
				content: "<p>This Journal Entry exists as a fallback link target for generated WFRP career RollTables.</p><p>WFRP character generation ignores the linked document and reads only the visible career group name in the table result link. Species Builder rows can point at a more specific Journal Entry or Journal Entry Page when one exists.</p>",
				format: 1
			},
			type: "text"
		}]
	});
	if (!t) throw Error("Foundry did not create the Species Builder career table fallback journal.");
	return t.uuid;
}
function CA() {
	return {
		checked: 0,
		elapsedMilliseconds: 0,
		regenerated: 0,
		removed: 0,
		skipped: 0
	};
}
function wA(t, n) {
	e(`${Y} | ${n ? "Forced rebuild" : "Validation"} checked ${t.checked} Species Builder career table(s): ${t.skipped} skipped, ${t.regenerated} regenerated, ${t.removed} removed in ${t.elapsedMilliseconds.toFixed(1)} ms.`);
}
//#endregion
//#region src/functions/species-builder/characteristic-roll-formulas.ts
var TA = "2d10";
function EA(e) {
	let t = e?.split("+")[0]?.trim();
	return t ? OA(t) : TA;
}
function DA(e, t) {
	return EA(e) === EA(t);
}
function OA(e) {
	return e.replaceAll(/\s+/g, "").toLocaleLowerCase();
}
//#endregion
//#region src/module/apps/species-builder/chargen-roll-swap-feedback.ts
var kA = "data-wfrp4e-customizer-roll-swap-feedback", AA = `[${kA}="blocked"]`, jA = /* @__PURE__ */ new WeakMap();
function MA(e, t) {
	let n = zA(e);
	if (n) for (let e of RA(n)) e.addEventListener("dragstart", () => {
		let r = e.dataset.ch;
		r && NA(n, r, t);
	}), e.addEventListener("dragend", () => {
		FA(n);
	}), e.addEventListener("drop", () => {
		FA(n);
	});
}
function NA(e, t, n) {
	FA(e);
	for (let r of RA(e)) {
		let e = r.dataset.ch;
		e && (e === t || n(t, e) || PA(r));
	}
}
function PA(e) {
	jA.set(e, {
		ariaDisabled: e.getAttribute("aria-disabled"),
		borderColor: e.style.getPropertyValue("border-color"),
		borderColorPriority: e.style.getPropertyPriority("border-color"),
		hadDisabledClass: e.classList.contains("disabled")
	}), e.setAttribute(kA, "blocked"), e.setAttribute("aria-disabled", "true"), e.classList.add("disabled"), e.style.setProperty("border-color", "transparent");
}
function FA(e) {
	for (let t of e.querySelectorAll(AA)) {
		let e = jA.get(t);
		e && (e.hadDisabledClass || t.classList.remove("disabled"), IA(t, "aria-disabled", e.ariaDisabled), LA(t, "border-color", e.borderColor, e.borderColorPriority), t.removeAttribute(kA), jA.delete(t));
	}
}
function IA(e, t, n) {
	if (n === null) {
		e.removeAttribute(t);
		return;
	}
	e.setAttribute(t, n);
}
function LA(e, t, n, r) {
	if (!n) {
		e.style.removeProperty(t);
		return;
	}
	e.style.setProperty(t, n, r);
}
function RA(e) {
	return [...e.querySelectorAll(".ch-roll.ch-drag")];
}
function zA(e) {
	if (e instanceof HTMLElement) return e;
	if (!X(e)) return;
	let t = e[0];
	return t instanceof HTMLElement ? t : void 0;
}
//#endregion
//#region src/module/apps/species-builder/chargen-roll-swap-guard.ts
var BA = Symbol("wfrp4e-customizer-guarded-attributes-stage");
function VA() {
	Hooks.on("wfrp4e:chargen", (e) => {
		HA(e);
	});
}
function HA(n) {
	let r = UA(n);
	if (!r) {
		t(`${Y} | Could not inspect WFRP character generation stages.`);
		return;
	}
	let i = WA(r);
	if (!i) {
		t(`${Y} | Could not find the WFRP Attributes character generation stage.`);
		return;
	}
	if (GA(i.class)) return;
	let a = KA(i.class);
	typeof r.replaceStage == "function" ? r.replaceStage("attributes", a) : i.class = a, e(`${Y} | Guarded WFRP characteristic roll swapping for custom species.`);
}
function UA(e) {
	if (!X(e)) return;
	let t = {}, n = e.replaceStage;
	return typeof n == "function" && (t.replaceStage = (t, r) => {
		n.call(e, t, r);
	}), Array.isArray(e.stages) && (t.stages = e.stages), t;
}
function WA(e) {
	for (let t of e.stages ?? []) if (X(t) && t.key === "attributes") return typeof t.class == "function" ? t : void 0;
}
function GA(e) {
	return !!e[BA];
}
function KA(e) {
	class t extends e {
		static [BA] = !0;
		activateListeners(e) {
			let t = super.activateListeners(e);
			return MA(e, (e, t) => DA(qA(this, e), qA(this, t))), t;
		}
		swap(e, t) {
			let n = qA(this, e), r = qA(this, t);
			if (DA(n, r)) return super.swap(e, t);
			JA(e, n, t, r);
		}
	}
	return t;
}
function qA(e, t) {
	let n = X(e.context) ? e.context : void 0, r = X(n?.characteristics) ? n.characteristics : void 0, i = (X(r?.[t]) ? r[t] : void 0)?.formula;
	return typeof i == "string" ? i : void 0;
}
function JA(e, t, n, r) {
	let i = YA(e), a = YA(n), o = EA(t), s = EA(r);
	ui.notifications?.warn?.(`Cannot swap ${i} and ${a}: ${i} uses ${o}, while ${a} uses ${s}.`);
}
function YA(e) {
	let t = game.wfrp4e?.config?.characteristics;
	if (!X(t)) return e;
	let n = t[e];
	return typeof n == "string" ? n : e;
}
//#endregion
//#region src/state/species-item/index.ts
function XA(e) {
	return bs(`species-item:${e}`, () => {
		let t = /* @__PURE__ */ P({
			name: "",
			img: "icons/svg/mystery-man.svg",
			system: nO()
		}), n = /* @__PURE__ */ P(""), r = /* @__PURE__ */ P("description"), i = /* @__PURE__ */ P(0), a = /* @__PURE__ */ P(!1), o = /* @__PURE__ */ P([]), s = /* @__PURE__ */ P(""), c = /* @__PURE__ */ P(""), l = /* @__PURE__ */ P(!1), u = /* @__PURE__ */ P(!1), d, f = q(() => JSON.stringify(t.value) !== n.value), p = q(() => {
			try {
				return eO(t.value.system.talents.choices);
			} catch {
				return [];
			}
		});
		function m(e) {
			u.value && f.value || (d = e, a.value = d.isGM, h());
		}
		function h() {
			try {
				t.value = d.load(), n.value = JSON.stringify(t.value), u.value = !0, o.value = d.effects(), i.value += 1, s.value = "", c.value = "";
			} catch (e) {
				s.value = ZA(e), u.value = !1;
			}
		}
		async function g() {
			l.value = !0, s.value = "";
			try {
				d.flushNotes(), t.value = await d.save(JSON.parse(JSON.stringify(t.value))), n.value = JSON.stringify(t.value), i.value += 1, c.value = "Saved Species Item. Refresh Foundry to update character generation.";
			} catch (e) {
				s.value = ZA(e);
			} finally {
				l.value = !1;
			}
		}
		function _(e, n) {
			t.value.system[e] = n === "" ? null : Number(n);
		}
		function v(e, n, r) {
			let i = t.value.system.characteristics[e] ?? {
				base: null,
				dice: null
			};
			i[n] = r === "" ? null : Number(r), t.value.system.characteristics[e] = i;
		}
		function y(e) {
			t.value.system.keys = e.split(",").map((e) => e.trim()).filter(Boolean);
		}
		function b(e, n, r) {
			let i = JSON.parse(JSON.stringify(p.value));
			i[e].choices[n] = { name: r }, t.value.system.talents.choices = $D(i);
		}
		function x(e) {
			let n = [...p.value];
			e === void 0 ? n.push({ choices: [{ name: "New Talent" }] }) : n[e].choices.push({ name: "Alternative Talent" }), t.value.system.talents.choices = $D(n);
		}
		function S(e) {
			t.value.system.talents.choices = $D(p.value.filter((t, n) => n !== e));
		}
		function C() {
			t.value.system.subspeciesOf = tO();
		}
		async function w(n, r) {
			try {
				let { type: i, reference: a } = await d.resolveDrop(n);
				if (r === "parent") {
					if (!i.endsWith("species") || a.uuid === e) throw Error("Choose a different Species Item as the parent.");
					t.value.system.subspeciesOf = a;
				} else if (r === "skills" && i === "skill") t.value.system.skills.list.push(a.name);
				else if (r === "talents" && i === "talent") t.value.system.talents.choices = $D([...p.value, { choices: [{
					name: a.name,
					item: {
						...a,
						type: "talent"
					}
				}] }]);
				else if (i === "RollTable" && r !== "skills") t.value.system.tables[r] = a;
				else throw Error("This document does not match the selected field.");
				s.value = "";
			} catch (e) {
				s.value = ZA(e);
			}
		}
		let ee = q(() => {
			try {
				return eO(t.value.system.talents.choices), "";
			} catch (e) {
				return ZA(e);
			}
		});
		async function te(e) {
			try {
				await d.openReference(e);
			} catch (e) {
				s.value = ZA(e);
			}
		}
		function ne() {
			d.chooseImage(t.value.img, (e) => {
				t.value.img = e;
			});
		}
		let re = (...e) => d.mountNotes(...e), T = (e) => d.editNotes(e);
		async function E(e, t) {
			if (f.value) {
				s.value = "Save or reload Item changes before editing effects.";
				return;
			}
			try {
				await d.effectAction(e, t), h();
			} catch (e) {
				s.value = ZA(e);
			}
		}
		return {
			draft: t,
			tab: r,
			revision: i,
			isGM: a,
			effects: o,
			choiceWarning: ee,
			chooseImage: ne,
			mountNotes: re,
			editNotes: T,
			effectAction: E,
			openReference: te,
			dirty: f,
			error: s,
			grants: p,
			isLoaded: u,
			isSaving: l,
			message: c,
			configure: m,
			reload: h,
			save: g,
			setStatistic: _,
			setCharacteristic: v,
			setKeys: y,
			editTalent: b,
			addTalent: x,
			removeTalent: S,
			clearParent: C,
			drop: w
		};
	})();
}
function ZA(e) {
	return e instanceof Error ? e.message : String(e);
}
//#endregion
//#region src/view/apps/species-item/SpeciesItemGrants.vue?vue&type=script&setup=true&lang.ts
var QA = ["disabled"], $A = ["onUpdate:modelValue"], ej = ["aria-label", "onClick"], tj = {
	key: 0,
	class: "dui-alert dui-alert-warning",
	role: "status"
}, nj = ["disabled"], rj = { class: "dui-fieldset-legend" }, ij = ["value", "onChange"], aj = { class: "app:flex app:gap-2" }, oj = ["onClick"], sj = ["onClick"], cj = ["for"], lj = ["id", "value"], uj = /* @__PURE__ */ L({
	__name: "SpeciesItemGrants",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = XA(e.uuid);
		return (n, r) => (B(), V("fieldset", {
			class: "dui-fieldset",
			disabled: !e.editable
		}, [
			r[8] ||= U("legend", { class: "app:sr-only" }, "Skills and Talents", -1),
			W(Rh, {
				title: "Skills",
				variant: "bare",
				"show-prompt": !1,
				"manual-entry-trigger": "none",
				disabled: !e.editable,
				onDropData: r[0] ||= (e) => F(t).drop(e, "skills")
			}, {
				default: I(() => [...r[5] ||= [U("span", { class: "dui-label" }, "Skills", -1), G(" — Drop Skills here ", -1)]]),
				_: 1
			}, 8, ["disabled"]),
			(B(!0), V(z, null, R(F(t).draft.system.skills.list, (e, n) => (B(), V("div", {
				key: n,
				class: "app:flex app:gap-2"
			}, [Rn(U("input", {
				"onUpdate:modelValue": (e) => F(t).draft.system.skills.list[n] = e,
				"aria-label": "Skill name",
				class: "dui-input dui-input-sm",
				required: ""
			}, null, 8, $A), [[wo, F(t).draft.system.skills.list[n]]]), U("button", {
				type: "button",
				class: "dui-btn dui-btn-sm",
				"aria-label": `Remove Skill ${n + 1}`,
				onClick: (e) => F(t).draft.system.skills.list.splice(n, 1)
			}, " Remove ", 8, ej)]))), 128)),
			U("button", {
				type: "button",
				class: "dui-btn dui-btn-sm app:justify-self-start",
				onClick: r[1] ||= (e) => F(t).draft.system.skills.list.push("New Skill")
			}, " Add Skill "),
			F(t).choiceWarning ? (B(), V("div", tj, A(F(t).choiceWarning) + " The stored choices are preserved. ", 1)) : K("", !0),
			U("fieldset", {
				class: "dui-fieldset",
				disabled: !!F(t).choiceWarning
			}, [
				r[7] ||= U("legend", { class: "dui-fieldset-legend" }, "Talents", -1),
				W(Rh, {
					title: "Talents",
					variant: "bare",
					"show-prompt": !1,
					"manual-entry-trigger": "none",
					disabled: !e.editable || !!F(t).choiceWarning,
					onDropData: r[2] ||= (e) => F(t).drop(e, "talents")
				}, {
					default: I(() => [...r[6] ||= [G(" Drop Talents here, or add a Talent with alternatives below. ", -1)]]),
					_: 1
				}, 8, ["disabled"]),
				(B(!0), V(z, null, R(F(t).grants, (e, n) => (B(), V("fieldset", {
					key: n,
					class: "dui-fieldset"
				}, [
					U("legend", rj, "Talent " + A(n + 1), 1),
					(B(!0), V(z, null, R(e.choices, (e, r) => (B(), V("label", {
						key: r,
						class: "dui-label"
					}, [G(A(r ? "Or" : "Talent") + " ", 1), U("input", {
						class: "dui-input dui-input-sm",
						value: e.name,
						required: "",
						onChange: (e) => F(t).editTalent(n, r, e.target.value)
					}, null, 40, ij)]))), 128)),
					U("div", aj, [U("button", {
						type: "button",
						class: "dui-btn dui-btn-sm",
						onClick: (e) => F(t).addTalent(n)
					}, " Add alternative ", 8, oj), U("button", {
						type: "button",
						class: "dui-btn dui-btn-sm",
						onClick: (e) => F(t).removeTalent(n)
					}, " Remove grant ", 8, sj)])
				]))), 128)),
				U("button", {
					type: "button",
					class: "dui-btn dui-btn-sm app:justify-self-start",
					onClick: r[3] ||= (e) => F(t).addTalent()
				}, " Add Talent ")
			], 8, nj),
			U("label", {
				class: "dui-label",
				for: `${e.uuid}-random-talents`
			}, "Random Talents", 8, cj),
			U("input", {
				id: `${e.uuid}-random-talents`,
				"aria-label": "Random Talents",
				class: "dui-input dui-input-sm",
				type: "number",
				min: "0",
				value: F(t).draft.system.talents.random,
				placeholder: "Inherit",
				onInput: r[4] ||= (e) => F(t).draft.system.talents.random = e.target.value === "" ? null : Number(e.target.value)
			}, null, 40, lj)
		], 8, QA));
	}
}), dj = { class: "dui-label" }, fj = { key: 1 }, pj = ["aria-label"], mj = /* @__PURE__ */ L({
	__name: "SpeciesItemReference",
	props: {
		uuid: {},
		label: {},
		reference: {},
		editable: { type: Boolean }
	},
	emits: ["clear", "drop-data"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = XA(n.uuid);
		function a(e) {
			n.editable && e.dataTransfer && r("drop-data", e.dataTransfer.getData("text/plain"));
		}
		return (t, n) => (B(), V("div", {
			class: "app:flex app:flex-wrap app:items-center app:gap-2",
			onDragover: n[2] ||= No(() => {}, ["prevent"]),
			onDrop: No(a, ["prevent"])
		}, [
			U("span", dj, A(e.label), 1),
			e.reference.uuid ? (B(), V("button", {
				key: 0,
				type: "button",
				class: "dui-btn dui-btn-sm",
				onClick: n[0] ||= (t) => F(i).openReference(e.reference.uuid)
			}, A(e.reference.name || e.label), 1)) : (B(), V("span", fj, "Drop " + A(e.label === "Subspecies Of" ? "a Species Item" : "a RollTable") + " here", 1)),
			e.editable && (e.reference.uuid || e.reference.id) ? (B(), V("button", {
				key: 2,
				type: "button",
				class: "dui-btn dui-btn-sm",
				"aria-label": `Clear ${e.label}`,
				onClick: n[1] ||= (e) => r("clear")
			}, " Clear ", 8, pj)) : K("", !0)
		], 32));
	}
}), hj = ["disabled"], gj = /* @__PURE__ */ L({
	__name: "SpeciesItemTables",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = XA(e.uuid), n = [
			{
				key: "career",
				label: "Careers"
			},
			{
				key: "talents",
				label: "Talents"
			},
			{
				key: "eye",
				label: "Eye Colour"
			},
			{
				key: "hair",
				label: "Hair Colour"
			}
		];
		return (r, i) => (B(), V("fieldset", {
			class: "dui-fieldset",
			disabled: !e.editable
		}, [i[0] ||= U("legend", { class: "dui-fieldset-legend" }, "Tables", -1), (B(), V(z, null, R(n, (n) => W(mj, {
			key: n.key,
			uuid: e.uuid,
			label: n.label,
			reference: F(t).draft.system.tables[n.key],
			editable: e.editable,
			onDropData: (e) => F(t).drop(e, n.key),
			onClear: (e) => F(t).draft.system.tables[n.key] = F(tO)()
		}, null, 8, [
			"uuid",
			"label",
			"reference",
			"editable",
			"onDropData",
			"onClear"
		])), 64))], 8, hj));
	}
}), _j = ["disabled"], vj = { class: "app:max-w-full app:overflow-x-auto" }, yj = { class: "dui-table dui-table-xs" }, bj = { class: "app:sr-only" }, xj = [
	"aria-label",
	"value",
	"onInput"
], Sj = { "aria-hidden": "true" }, Cj = { class: "app:flex app:items-center app:gap-1" }, wj = [
	"aria-label",
	"value",
	"onInput"
], Tj = { key: 0 }, Ej = ["for"], Dj = ["id", "value"], Oj = { class: "app:grid app:grid-cols-3 app:gap-3" }, kj = { class: "dui-label" }, Aj = [
	"aria-label",
	"value",
	"onInput"
], jj = ["for"], Mj = ["id"], Nj = ["for"], Pj = ["id", "value"], Fj = /* @__PURE__ */ L({
	__name: "SpeciesItemDetails",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = XA(e.uuid), n = {
			ws: "WS",
			bs: "BS",
			s: "S",
			t: "T",
			i: "I",
			ag: "Ag",
			dex: "Dex",
			int: "Int",
			wp: "WP",
			fel: "Fel"
		}, r = Object.keys(n), i = [
			{
				key: "fate",
				label: "Fate"
			},
			{
				key: "resilience",
				label: "Resilience"
			},
			{
				key: "extra",
				label: "Extra"
			}
		];
		return (a, o) => (B(), V("fieldset", {
			class: "dui-fieldset",
			disabled: !e.editable
		}, [
			o[8] ||= U("legend", { class: "app:sr-only" }, "Species details", -1),
			W(mj, {
				uuid: e.uuid,
				label: "Subspecies Of",
				reference: F(t).draft.system.subspeciesOf,
				editable: e.editable,
				onDropData: o[0] ||= (e) => F(t).drop(e, "parent"),
				onClear: o[1] ||= (e) => F(t).clearParent()
			}, null, 8, [
				"uuid",
				"reference",
				"editable"
			]),
			U("div", vj, [U("table", yj, [
				o[6] ||= U("caption", { class: "app:sr-only" }, " Characteristic bases plus dice ", -1),
				U("thead", null, [U("tr", null, [(B(!0), V(z, null, R(F(r), (e) => (B(), V("th", {
					key: e,
					scope: "col",
					class: "app:text-center"
				}, A(n[e]), 1))), 128))])]),
				U("tbody", null, [
					U("tr", null, [(B(!0), V(z, null, R(F(r), (e) => (B(), V("td", {
						key: e,
						class: "app:p-1"
					}, [U("label", null, [U("span", bj, A(n[e]) + " base", 1), U("input", {
						class: "dui-input dui-input-xs app:w-12",
						type: "number",
						min: "0",
						step: "any",
						"aria-label": `${n[e]} base`,
						value: F(t).draft.system.characteristics[e]?.base,
						placeholder: "—",
						onInput: (n) => F(t).setCharacteristic(e, "base", n.target.value)
					}, null, 40, xj)])]))), 128))]),
					U("tr", Sj, [(B(!0), V(z, null, R(F(r), (e) => (B(), V("td", {
						key: e,
						class: "app:text-center"
					}, "+"))), 128))]),
					U("tr", null, [(B(!0), V(z, null, R(F(r), (e) => (B(), V("td", {
						key: e,
						class: "app:p-1"
					}, [U("label", Cj, [U("input", {
						class: "dui-input dui-input-xs app:w-10",
						type: "number",
						min: "0",
						step: "any",
						"aria-label": `${n[e]} dice`,
						value: F(t).draft.system.characteristics[e]?.dice,
						placeholder: "—",
						onInput: (n) => F(t).setCharacteristic(e, "dice", n.target.value)
					}, null, 40, wj), o[5] ||= U("span", null, "d10", -1)])]))), 128))])
				])
			])]),
			F(t).draft.system.subspeciesOf.uuid ? (B(), V("p", Tj, "Empty values inherit from the parent species.")) : K("", !0),
			W(uj, {
				uuid: e.uuid,
				editable: e.editable
			}, null, 8, ["uuid", "editable"]),
			U("label", {
				class: "dui-label",
				for: `${e.uuid}-movement`
			}, "Movement", 8, Ej),
			U("input", {
				id: `${e.uuid}-movement`,
				"aria-label": "Movement",
				class: "dui-input dui-input-sm",
				type: "number",
				min: "0",
				step: "any",
				value: F(t).draft.system.movement,
				placeholder: "Inherit",
				onInput: o[2] ||= (e) => F(t).setStatistic("movement", e.target.value)
			}, null, 40, Dj),
			U("div", Oj, [(B(), V(z, null, R(i, (e) => U("label", {
				key: e.key,
				class: "dui-fieldset app:min-w-0"
			}, [U("span", kj, A(e.label), 1), U("input", {
				class: "dui-input dui-input-sm app:w-full",
				type: "number",
				min: "0",
				step: "any",
				"aria-label": e.label,
				value: F(t).draft.system[e.key],
				placeholder: "Inherit",
				onInput: (n) => F(t).setStatistic(e.key, n.target.value)
			}, null, 40, Aj)])), 64))]),
			U("label", {
				class: "dui-label",
				for: `${e.uuid}-size`
			}, "Size", 8, jj),
			Rn(U("select", {
				id: `${e.uuid}-size`,
				"onUpdate:modelValue": o[3] ||= (e) => F(t).draft.system.size = e,
				class: "dui-select dui-select-sm",
				"aria-label": "Size"
			}, [...o[7] ||= [ia("<option value=\"tiny\">Tiny</option><option value=\"ltl\">Little</option><option value=\"sml\">Small</option><option value=\"avg\">Average</option><option value=\"lrg\">Large</option><option value=\"enor\">Enormous</option><option value=\"mnst\">Monstrous</option>", 7)]], 8, Mj), [[Do, F(t).draft.system.size]]),
			W(gj, {
				uuid: e.uuid,
				editable: e.editable
			}, null, 8, ["uuid", "editable"]),
			U("label", {
				class: "dui-label",
				for: `${e.uuid}-keys`
			}, "Keys", 8, Nj),
			U("input", {
				id: `${e.uuid}-keys`,
				"aria-label": "Keys",
				value: F(t).draft.system.keys.join(", "),
				class: "dui-input dui-input-sm",
				placeholder: "Leave blank for a stable Item key",
				onChange: o[4] ||= (e) => F(t).setKeys(e.target.value)
			}, null, 40, Pj)
		], 8, _j));
	}
}), Ij = {
	key: 0,
	class: "dui-fieldset"
}, Lj = { class: "dui-fieldset" }, Rj = /* @__PURE__ */ L({
	__name: "SpeciesItemNotes",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = e, n = XA(t.uuid), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = [];
		return mr(() => {
			for (let [e, o] of [["description", r.value], ["gmdescription", i.value]]) o && a.push(n.mountNotes(o, e, n.draft.system[e].value, t.editable, (t) => {
				n.draft.system[e].value = t;
			}));
		}), _r(() => a.forEach((e) => e())), (t, a) => (B(), V(z, null, [F(n).isGM ? (B(), V("fieldset", Ij, [
			a[2] ||= U("legend", { class: "dui-fieldset-legend" }, "GM Notes", -1),
			e.editable ? (B(), V("button", {
				key: 0,
				type: "button",
				class: "dui-btn dui-btn-xs app:justify-self-start",
				onClick: a[0] ||= (e) => F(n).editNotes("gmdescription")
			}, " Edit GM Notes ")) : K("", !0),
			U("div", {
				ref_key: "gmNotes",
				ref: i,
				class: "app:min-h-32",
				"aria-label": "GM Notes"
			}, null, 512)
		])) : K("", !0), U("fieldset", Lj, [
			a[3] ||= U("legend", { class: "dui-fieldset-legend" }, "Notes", -1),
			e.editable ? (B(), V("button", {
				key: 0,
				type: "button",
				class: "dui-btn dui-btn-xs app:justify-self-start",
				onClick: a[1] ||= (e) => F(n).editNotes("description")
			}, " Edit Notes ")) : K("", !0),
			U("div", {
				ref_key: "notes",
				ref: r,
				class: "app:min-h-32",
				"aria-label": "Notes"
			}, null, 512)
		])], 64));
	}
});
//#endregion
//#region src/module/wfrp4e/grant/item-documents.ts
function zj(e) {
	let t = e.dataTransfer?.getData("text/plain") ?? "";
	if (!t) return null;
	try {
		return KS(t).type === "Item" ? t : null;
	} catch {
		return null;
	}
}
async function Bj(e) {
	let t = KS(e);
	if (!t.uuid) throw Error("Drop an Item with a resolvable UUID.");
	return WS(await fromUuid(t.uuid), "The dropped Item was not found.");
}
function Vj(e) {
	let t = {
		name: e.name,
		uuid: e.uuid
	};
	return e.img && (t.img = e.img), t;
}
//#endregion
//#region src/module/apps/effect-builders/documents.ts
async function Hj(e) {
	let t = JSON.parse(e);
	if (!X(t) || typeof t.uuid != "string") throw Error("Drop a document or enter its UUID.");
	return fromUuid(t.uuid);
}
function Uj(e) {
	let t = WS(e, "Choose an Item to receive the effect.");
	if (!game.user || !t.canUserModify(game.user, "update")) throw Error("You do not have permission to edit this Item.");
	if (t.compendium?.locked) throw Error("Unlock the destination compendium or import its Item into the world.");
	return t;
}
async function Wj(e, t = !1) {
	let n = await Hj(e);
	return Vj(t ? Uj(n) : WS(n, "Choose an Item to grant."));
}
function Gj(e) {
	if (!X(e) || e.documentName !== "RollTable" || typeof e.uuid != "string" || typeof e.name != "string") throw Error("Choose a RollTable containing Item document results.");
	return {
		uuid: e.uuid,
		name: e.name
	};
}
async function Kj(e, t, n = []) {
	if (n.includes(e)) throw Error("The grant RollTables contain a circular reference.");
	if (n.length > 5) throw Error("The grant RollTables exceed Foundry's nesting limit.");
	let r = await fromUuid(e);
	Gj(r);
	let i = X(r) ? r.results : void 0, a = X(i) ? i.contents : void 0;
	if (!Array.isArray(a) || !a.length) throw Error("The grant RollTable is empty.");
	for (let r of a) {
		let i = X(r) ? r.documentUuid : void 0;
		if (typeof i != "string" || !i) throw Error("Grant RollTables must use Item or nested RollTable document results.");
		if (i === t) throw Error("An Item cannot grant itself.");
		let a = await fromUuid(i);
		X(a) && a.documentName === "RollTable" ? await Kj(i, t, [...n, e]) : WS(a, `The RollTable result ${i} is not an available Item.`);
	}
}
//#endregion
//#region src/functions/effect-builders/catalogue.ts
var qj = [
	{
		kind: "wounds",
		title: "Wound Formula",
		description: "Calculate wounds from characteristics, skills, and a custom formula."
	},
	{
		kind: "grant",
		title: "Item Grant",
		description: "Give a character a fixed set of Items."
	},
	{
		kind: "random",
		title: "Random Item",
		description: "Roll for Items, including results from nested RollTables."
	},
	{
		kind: "choice",
		title: "Item Choice",
		description: "Let a player choose between Items or packages of Items."
	}
];
function Jj(e) {
	return {
		kind: e,
		name: qj.find((t) => t.kind === e).title,
		formula: "@sb + 2 * @tb + @wpb",
		items: [],
		table: null,
		count: 1,
		groups: [],
		recipe: {
			grantMode: "all",
			lifetime: "linked-to-effect",
			ownerAction: "keep"
		}
	};
}
//#endregion
//#region src/functions/item-grants/script.ts
function Yj(e, t) {
	let n = t.lifetime === "linked-to-effect" ? "{ fromEffect: this.effect.id }" : "{}";
	return [
		"// Generated by Drowsy's WFRP4e Customizers; runs using native Foundry and WFRP APIs.",
		...e,
		"const itemDataToCreate = [];",
		"for (const uuid of itemUuids) {",
		"  const sourceItem = await fromUuid(uuid);",
		"  if (sourceItem?.documentName !== \"Item\") throw new Error(\"Could not resolve Item UUID: \" + uuid);",
		"  const itemData = sourceItem.toObject();",
		"  delete itemData._id;",
		"  itemDataToCreate.push(itemData);",
		"}",
		"if (!itemDataToCreate.length) return;",
		`await this.actor.createEmbeddedDocuments("Item", itemDataToCreate, ${n});`,
		"this.script.notification(\"Added \" + itemDataToCreate.length + \" granted item(s).\");",
		...t.ownerAction === "delete-after-grant" ? [
			"if (this.item) {",
			"  await this.item.delete({ skipDeletingItems: true });",
			"}"
		] : []
	].join("\n");
}
//#endregion
//#region src/functions/item-grants/wfrp-grant-effect.ts
var Xj = "generatedGrantItemsEffect", Zj = {
	grantMode: "all",
	lifetime: "linked-to-effect",
	ownerAction: "keep"
};
function Qj(e) {
	let t = e.recipe ?? Zj;
	$j(t);
	let n = e.items.map((e) => e.uuid);
	return {
		changes: [],
		description: eM(e.effectName, e.items, t),
		disabled: !1,
		flags: { [e.flagScope]: {
			[Xj]: !0,
			itemUuids: n,
			recipe: t
		} },
		img: e.items[0]?.img ?? "icons/svg/aura.svg",
		name: e.effectName,
		system: {
			scriptData: [{
				label: e.effectName,
				script: Yj([`const itemUuids = ${JSON.stringify(n)};`], t),
				trigger: "addItems"
			}],
			transferData: {
				documentType: "Item",
				type: "document"
			}
		},
		transfer: !0
	};
}
function $j(e) {
	if (e.lifetime === "linked-to-effect" && e.ownerAction === "delete-after-grant") throw Error("Self-removing grant effects must create detached item copies.");
}
function eM(e, t, n) {
	let r = tM(e), i = t.map((e) => `<li>${tM(e.name)}</li>`).join("");
	return `<p><strong>${r}</strong>: grants item copies; ${n.lifetime === "linked-to-effect" ? "granted item copies are removed with this effect" : "granted item copies remain after this effect is removed"}.${n.ownerAction === "delete-after-grant" ? " The source Item removes itself after granting." : ""}</p><ul>${i}</ul>`;
}
function tM(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
//#endregion
//#region src/functions/effect-builders/formula-validation.ts
function nM(e) {
	if (!e.trim()) throw Error("Enter a wound formula.");
	let t = pD(e), n = [...t.usedKeywords, ...t.references.map((e) => e.variableName)], r = t.expression.replace(/Math\.(floor|ceil|round|min|max|abs|sqrt|pow)\b/g, "0");
	if ((r.match(/[A-Za-z_$][\w$]*/g) ?? []).some((e) => !n.includes(e)) || /[^\w\s.+*/%(),-]/.test(r)) throw Error("Use arithmetic, formula tokens, and Math functions in the wound formula.");
	try {
		Function(...n, `"use strict"; return (${t.expression});`);
	} catch {
		throw Error("The wound formula has invalid arithmetic or unmatched brackets.");
	}
}
//#endregion
//#region src/functions/effect-builders/choice.ts
function rM(e, t, n) {
	return [
		`const groups = ${JSON.stringify(t.map((e) => ({
			name: e.name,
			itemNames: e.items.map((e) => e.name),
			items: e.items.map((e) => e.uuid)
		})))};`,
		`const required = ${n};`,
		"const escape = (text) => text.replaceAll(\"&\", \"&amp;\").replaceAll(\"<\", \"&lt;\").replaceAll(\">\", \"&gt;\").replaceAll('\"', \"&quot;\");",
		"const content = `<p>Choose ${required} option(s).</p>` + groups.map((group, index) => `<div class=\"form-group\"><label><input type=\"checkbox\" name=\"choice\" value=\"${index}\"> ${escape(group.name)}</label><p class=\"hint\">${group.itemNames.map(escape).join(\", \")}</p></div>`).join(\"\");",
		"let selected;",
		"do {",
		"  selected = await foundry.applications.api.DialogV2.wait({",
		`    window: { title: ${JSON.stringify(e)} },`,
		"    content, rejectClose: false,",
		"    buttons: [{ action: \"choose\", label: \"Grant selected Items\", default: true,",
		"      callback: (_event, button) => Array.from(button.form.querySelectorAll('input[name=\"choice\"]:checked'), (input) => Number(input.value))",
		"    }]",
		"  });",
		"  if (selected === null) return;",
		"  if (selected.length !== required) this.script.notification(`Choose exactly ${required} option(s).`, \"warn\");",
		"} while (selected.length !== required);",
		"const itemUuids = selected.flatMap((index) => groups[index].items);"
	];
}
//#endregion
//#region src/functions/effect-builders/random.ts
function iM(e, t) {
	return [
		`const table = await fromUuid(${JSON.stringify(e)});`,
		"if (table?.documentName !== \"RollTable\") throw new Error(\"The grant RollTable could not be found.\");",
		"const itemUuids = [];",
		`for (let index = 0; index < ${t}; index += 1) {`,
		"  const draw = await table.roll({ recursive: true });",
		"  if (!draw.results.length) throw new Error(\"The grant RollTable has no available results.\");",
		"  for (const result of draw.results) {",
		"    if (!result.documentUuid) throw new Error(\"Use Item document results in the grant RollTable.\");",
		"    itemUuids.push(result.documentUuid);",
		"  }",
		"}"
	];
}
//#endregion
//#region src/functions/effect-builders/build.ts
function aM(e) {
	let t = [];
	if (e.name.trim() || t.push("Enter an effect name."), e.kind === "wounds") {
		try {
			nM(e.formula);
		} catch (e) {
			t.push(e instanceof Error ? e.message : String(e));
		}
		return t;
	}
	return e.recipe.lifetime === "linked-to-effect" && e.recipe.ownerAction === "delete-after-grant" && t.push("Self-removing source Items must grant copies that remain after the effect is removed."), e.kind === "grant" && !e.items.length && t.push("Add at least one Item to grant."), e.kind === "random" && !e.table && t.push("Choose a RollTable."), (e.kind === "random" || e.kind === "choice") && (!Number.isInteger(e.count) || e.count < 1 || e.count > 100) && t.push("Enter a whole number from 1 to 100."), e.kind === "choice" && ((!e.groups.length || e.groups.some((e) => !e.name.trim() || !e.items.length)) && t.push("Each choice needs a name and at least one Item."), e.count > e.groups.length && t.push("The number of choices exceeds the available options.")), t;
}
function oM(e, t) {
	let n = aM(e);
	if (n.length) throw Error(n.join(" "));
	let r = e.name.trim();
	if (e.kind === "wounds") return VD(r, e.formula);
	let i = Qj({
		effectName: r,
		flagScope: t,
		items: e.items,
		recipe: e.recipe
	});
	if (e.kind === "grant") return i;
	let a = e.kind === "random" ? iM(e.table.uuid, e.count) : rM(r, e.groups, e.count);
	return {
		...i,
		description: e.kind === "random" ? "<p>Grants Items rolled from a RollTable.</p>" : "<p>Grants the chosen Item options.</p>",
		flags: {},
		system: {
			transferData: {
				documentType: "Item",
				type: "document"
			},
			scriptData: [{
				label: r,
				trigger: "addItems",
				script: Yj(a, e.recipe)
			}]
		}
	};
}
//#endregion
//#region src/state/effect-builders/index.ts
function sM(e) {
	return bs(`effect-builder:${e}`, () => {
		let e = /* @__PURE__ */ P(Jj("wounds")), t = /* @__PURE__ */ P(null), n = /* @__PURE__ */ P(""), r = /* @__PURE__ */ P(""), i = /* @__PURE__ */ P(!1), a = /* @__PURE__ */ P(!1), o = /* @__PURE__ */ P(!1), s, c = q(() => aM(e.value)), l = q(() => !!t.value && !c.value.length && !i.value && !a.value);
		function u(n, r, i) {
			s = r, !o.value && (e.value = Jj(n), t.value = i, o.value = !0);
		}
		async function d(e) {
			if (!(i.value || a.value)) {
				n.value = "", i.value = !0;
				try {
					await e();
				} catch (e) {
					n.value = e instanceof Error ? e.message : String(e);
				} finally {
					i.value = !1;
				}
			}
		}
		async function f(e) {
			await d(async () => {
				t.value = await s.resolveItem(e, !0);
			});
		}
		async function p(n, r) {
			await d(async () => {
				let i = await s.resolveItem(n);
				if (i.uuid === t.value?.uuid) throw Error("An Item cannot grant itself.");
				let a = r === void 0 ? e.value.items : e.value.groups[r].items;
				if (a.some((e) => e.uuid === i.uuid)) throw Error("That Item is already in this option.");
				a.push(i);
			});
		}
		async function m(t) {
			await d(async () => {
				e.value.table = await s.resolveTable(t);
			});
		}
		function h() {
			e.value.groups.push({
				name: `Option ${e.value.groups.length + 1}`,
				items: []
			});
		}
		function g(t, n) {
			let r = n === void 0 ? e.value.items : e.value.groups[n].items, i = r.findIndex((e) => e.uuid === t);
			i !== -1 && r.splice(i, 1);
		}
		function _(t) {
			e.value.recipe.lifetime = t, t === "linked-to-effect" && (e.value.recipe.ownerAction = "keep");
		}
		async function v() {
			l.value && await d(async () => {
				await s.create(t.value.uuid, JSON.parse(JSON.stringify(e.value))), a.value = !0, r.value = `Added “${e.value.name.trim()}” to ${t.value.name}.`;
			});
		}
		async function y() {
			if (t.value) try {
				await s.openItem(t.value.uuid);
			} catch (e) {
				n.value = e instanceof Error ? e.message : String(e);
			}
		}
		return {
			draft: e,
			destination: t,
			error: n,
			message: r,
			busy: i,
			created: a,
			problems: c,
			ready: l,
			configure: u,
			dropDestination: f,
			dropItem: p,
			dropTable: m,
			addGroup: h,
			removeItem: g,
			setLifetime: _,
			create: v,
			openDestination: y
		};
	})(gb);
}
//#endregion
//#region src/view/components/ApplicationShell.vue?vue&type=script&setup=true&lang.ts
var cM = ["aria-label"], lM = { class: "dui-card-body" }, uM = { class: "dui-card-title" }, dM = { key: 0 }, fM = {
	key: 0,
	class: "dui-card-actions"
}, pM = /* @__PURE__ */ L({
	__name: "ApplicationShell",
	props: {
		description: {},
		title: {}
	},
	setup(e) {
		return (t, n) => (B(), V("section", {
			"aria-label": e.title,
			class: "dui-card"
		}, [U("div", lM, [
			U("header", null, [
				U("h1", uM, A(e.title), 1),
				e.description ? (B(), V("p", dM, A(e.description), 1)) : K("", !0),
				wr(t.$slots, "header")
			]),
			wr(t.$slots, "default"),
			t.$slots.actions ? (B(), V("div", fM, [wr(t.$slots, "actions")])) : K("", !0)
		])], 8, cM));
	}
}), mM = { class: "dui-list" }, hM = { class: "dui-list-col-grow" }, gM = ["aria-label", "onClick"], _M = /* @__PURE__ */ L({
	__name: "SourceItems",
	props: {
		items: {},
		title: {}
	},
	emits: ["dropData", "remove"],
	setup(e) {
		return (t, n) => (B(), V(z, null, [W(Rh, {
			title: e.title,
			description: "Drop an Item to add it to this list.",
			variant: "compact",
			onDropData: n[0] ||= (e) => t.$emit("dropData", e)
		}, null, 8, ["title"]), U("ul", mM, [(B(!0), V(z, null, R(e.items, (e) => (B(), V("li", {
			key: e.uuid,
			class: "dui-list-row"
		}, [U("span", hM, A(e.name), 1), U("button", {
			type: "button",
			class: "dui-btn dui-btn-sm dui-btn-ghost",
			"aria-label": `Remove ${e.name}`,
			onClick: (n) => t.$emit("remove", e.uuid)
		}, " Remove ", 8, gM)]))), 128))])], 64));
	}
}), vM = { class: "dui-fieldset" }, yM = ["for"], bM = ["id", "max"], xM = { class: "dui-fieldset-legend" }, SM = ["for"], CM = ["id", "onUpdate:modelValue"], wM = ["onClick"], TM = /* @__PURE__ */ L({
	__name: "ChoiceOptions",
	props: { id: {} },
	setup(e) {
		let t = e, n = sM(t.id), r = `${t.id}-${$n()}`;
		return (e, t) => (B(), V("fieldset", vM, [
			t[2] ||= U("legend", { class: "dui-fieldset-legend" }, "Player choices", -1),
			U("label", {
				for: `${r}-count`,
				class: "dui-label"
			}, "Number of options to choose", 8, yM),
			Rn(U("input", {
				id: `${r}-count`,
				"onUpdate:modelValue": t[0] ||= (e) => F(n).draft.count = e,
				"aria-label": "Number of options to choose",
				type: "number",
				min: "1",
				max: F(n).draft.groups.length || 1,
				step: "1",
				class: "dui-input"
			}, null, 8, bM), [[
				wo,
				F(n).draft.count,
				void 0,
				{ number: !0 }
			]]),
			t[3] ||= U("p", null, "Each option can grant one Item or a whole package.", -1),
			(B(!0), V(z, null, R(F(n).draft.groups, (e, t) => (B(), V("fieldset", {
				key: t,
				class: "dui-fieldset"
			}, [
				U("legend", xM, "Option " + A(t + 1), 1),
				U("label", {
					for: `${r}-${t}`,
					class: "dui-label"
				}, "Option name", 8, SM),
				Rn(U("input", {
					id: `${r}-${t}`,
					"onUpdate:modelValue": (t) => e.name = t,
					"aria-label": "Option name",
					class: "dui-input app:w-full"
				}, null, 8, CM), [[wo, e.name]]),
				W(_M, {
					items: e.items,
					title: `Items for option ${t + 1}`,
					onDropData: (e) => F(n).dropItem(e, t),
					onRemove: (e) => F(n).removeItem(e, t)
				}, null, 8, [
					"items",
					"title",
					"onDropData",
					"onRemove"
				]),
				U("button", {
					type: "button",
					class: "dui-btn dui-btn-sm dui-btn-ghost",
					onClick: (e) => F(n).draft.groups.splice(t, 1)
				}, " Remove option ", 8, wM)
			]))), 128)),
			U("button", {
				type: "button",
				class: "dui-btn",
				onClick: t[1] ||= (...e) => F(n).addGroup && F(n).addGroup(...e)
			}, "Add option")
		]));
	}
}), EM = { class: "dui-fieldset" }, DM = ["for"], OM = ["id", "value"], kM = {
	key: 0,
	class: "dui-label"
}, AM = /* @__PURE__ */ L({
	__name: "GrantOptions",
	props: { id: {} },
	setup(e) {
		let t = e, n = sM(t.id), r = `${t.id}-${$n()}`;
		return (e, t) => (B(), V("fieldset", EM, [
			t[4] ||= U("legend", { class: "dui-fieldset-legend" }, "Granted Items", -1),
			U("label", {
				for: `${r}-lifetime`,
				class: "dui-label"
			}, "When the effect is removed", 8, DM),
			U("select", {
				id: `${r}-lifetime`,
				"aria-label": "When the effect is removed",
				class: "dui-select app:w-full",
				value: F(n).draft.recipe.lifetime,
				onChange: t[0] ||= (e) => F(n).setLifetime(e.target.value)
			}, [...t[2] ||= [U("option", { value: "linked-to-effect" }, "Remove the granted Items too", -1), U("option", { value: "detached" }, "Keep the granted Items", -1)]], 40, OM),
			F(n).draft.recipe.lifetime === "detached" ? (B(), V("label", kM, [Rn(U("input", {
				"onUpdate:modelValue": t[1] ||= (e) => F(n).draft.recipe.ownerAction = e,
				type: "checkbox",
				class: "dui-checkbox",
				"true-value": "delete-after-grant",
				"false-value": "keep"
			}, null, 512), [[To, F(n).draft.recipe.ownerAction]]), t[3] ||= G(" Remove the source Item after a successful grant ", -1)])) : K("", !0)
		]));
	}
}), jM = /* @__PURE__ */ "@sb.@tb.@wpb.@sbMultiplier.@tbMultiplier.@wpbMultiplier.@scale.@size.@age.@height.@weight.@status.@rank.@xp.@fate.@fortune.@resilience.@resolve.@corruption.@sin.@advantage.@bleeding.@poisoned.@ablaze.@deafened.@stunned.@entangled.@fatigued.@blinded.@broken".split("."), MM = { class: "dui-fieldset" }, NM = { class: "dui-collapse dui-collapse-arrow" }, PM = { class: "dui-collapse-content" }, FM = { class: "app:flex app:flex-wrap app:gap-1" }, IM = ["onClick", "onDragstart"], LM = /* @__PURE__ */ L({
	__name: "WoundFormula",
	props: { id: {} },
	setup(e) {
		let t = e, n = sM(t.id), r = `${t.id}-${$n()}`, i = /* @__PURE__ */ P(), a = [
			...jM,
			"{Strength}",
			"[Toughness]",
			"{Endurance}",
			"[Endurance]"
		];
		async function o(e) {
			let t = i.value, r = t?.selectionStart ?? n.draft.formula.length, a = t?.selectionEnd ?? r;
			n.draft.formula = `${n.draft.formula.slice(0, r)}${e}${n.draft.formula.slice(a)}`, await En(), t?.focus(), t?.setSelectionRange(r + e.length, r + e.length);
		}
		return (e, t) => (B(), V("fieldset", MM, [
			t[5] ||= U("legend", { class: "dui-fieldset-legend" }, "Wound calculation", -1),
			U("label", {
				for: r,
				class: "dui-label"
			}, "Formula"),
			Rn(U("textarea", {
				id: r,
				ref_key: "textarea",
				ref: i,
				"onUpdate:modelValue": t[0] ||= (e) => F(n).draft.formula = e,
				"aria-label": "Formula",
				class: "dui-textarea app:w-full",
				rows: "3",
				onDragover: t[1] ||= No(() => {}, ["prevent"]),
				onDrop: t[2] ||= No((e) => o(e.dataTransfer?.getData("text/plain") ?? ""), ["prevent"])
			}, null, 544), [[wo, F(n).draft.formula]]),
			t[6] ||= ia("<p> Use <code>{Name}</code> for a characteristic or Skill total and <code>[Name]</code> for its bonus. For example: <code>[Endurance] + 2 * @tb</code>. </p><p><code>{Endurance|Strength}</code> uses Strength for that Skill. Arithmetic and <code>Math.floor</code>, <code>Math.ceil</code>, <code>Math.min</code>, and <code>Math.max</code> are supported. </p>", 2),
			U("details", NM, [t[4] ||= U("summary", { class: "dui-collapse-title" }, "Insert formula tokens", -1), U("div", PM, [t[3] ||= U("p", null, "Click a token to insert it at the cursor, or drag it into the formula.", -1), U("div", FM, [(B(), V(z, null, R(a, (e) => U("button", {
				key: e,
				type: "button",
				class: "dui-btn dui-btn-xs",
				draggable: "true",
				onClick: (t) => o(e),
				onDragstart: (t) => t.dataTransfer?.setData("text/plain", e)
			}, A(e), 41, IM)), 64))])])])
		]));
	}
}), RM = {
	key: 0,
	role: "alert",
	class: "dui-alert dui-alert-error"
}, zM = {
	key: 1,
	role: "status",
	class: "dui-alert dui-alert-success"
}, BM = ["disabled"], VM = ["for"], HM = ["id"], UM = {
	key: 2,
	class: "dui-fieldset"
}, WM = ["for"], GM = ["id"], KM = {
	key: 2,
	class: "dui-list",
	"aria-label": "To finish this effect"
}, qM = { class: "app:flex app:flex-wrap app:gap-2" }, JM = ["disabled"], YM = ["disabled"], XM = /* @__PURE__ */ L({
	__name: "EffectBuilderApp",
	props: {
		id: {},
		kind: {},
		destination: {},
		bridge: {},
		close: { type: Function }
	},
	setup(e) {
		let t = e, n = sM(t.id);
		n.configure(t.kind, t.bridge, t.destination);
		let r = `${t.id}-${$n()}`, i = qj.find((e) => e.kind === t.kind);
		return (t, a) => (B(), H(pM, {
			title: `${F(i).title} Effect Builder`,
			description: F(i).description
		}, {
			default: I(() => [
				F(n).error ? (B(), V("div", RM, A(F(n).error), 1)) : K("", !0),
				F(n).message ? (B(), V("div", zM, A(F(n).message), 1)) : K("", !0),
				U("fieldset", {
					class: "dui-fieldset",
					disabled: F(n).busy || F(n).created
				}, [
					W(Rh, {
						title: "Destination Item",
						description: "Drop the Item that will receive this effect.",
						documents: F(n).destination ? [F(n).destination] : [],
						"show-documents": "",
						variant: "compact",
						onDropData: F(n).dropDestination
					}, null, 8, ["documents", "onDropData"]),
					U("label", {
						for: `${r}-name`,
						class: "dui-label"
					}, "Effect name", 8, VM),
					Rn(U("input", {
						id: `${r}-name`,
						"onUpdate:modelValue": a[0] ||= (e) => F(n).draft.name = e,
						"aria-label": "Effect name",
						class: "dui-input app:w-full"
					}, null, 8, HM), [[wo, F(n).draft.name]]),
					e.kind === "wounds" ? (B(), H(LM, {
						key: 0,
						id: e.id
					}, null, 8, ["id"])) : e.kind === "grant" ? (B(), H(_M, {
						key: 1,
						title: "Items to grant",
						items: F(n).draft.items,
						onDropData: a[1] ||= (e) => F(n).dropItem(e),
						onRemove: a[2] ||= (e) => F(n).removeItem(e)
					}, null, 8, ["items"])) : e.kind === "random" ? (B(), V("fieldset", UM, [
						a[7] ||= U("legend", { class: "dui-fieldset-legend" }, "Random selection", -1),
						W(Rh, {
							title: "Grant RollTable",
							description: "Use document results pointing to Items or nested RollTables.",
							documents: F(n).draft.table ? [F(n).draft.table] : [],
							"show-documents": "",
							variant: "compact",
							onDropData: F(n).dropTable
						}, null, 8, ["documents", "onDropData"]),
						U("label", {
							for: `${r}-rolls`,
							class: "dui-label"
						}, "Number of rolls", 8, WM),
						Rn(U("input", {
							id: `${r}-rolls`,
							"onUpdate:modelValue": a[3] ||= (e) => F(n).draft.count = e,
							"aria-label": "Number of rolls",
							type: "number",
							min: "1",
							max: "100",
							step: "1",
							class: "dui-input"
						}, null, 8, GM), [[
							wo,
							F(n).draft.count,
							void 0,
							{ number: !0 }
						]]),
						a[8] ||= U("p", null, " Rolls leave results available for future rolls. An Item may be granted more than once. ", -1)
					])) : (B(), H(TM, {
						key: 3,
						id: e.id
					}, null, 8, ["id"])),
					e.kind === "wounds" ? K("", !0) : (B(), H(AM, {
						key: 4,
						id: e.id
					}, null, 8, ["id"]))
				], 8, BM),
				!F(n).created && F(n).problems.length ? (B(), V("ul", KM, [(B(!0), V(z, null, R(F(n).problems, (e) => (B(), V("li", { key: e }, A(e), 1))), 128))])) : K("", !0),
				U("div", qM, [
					F(n).created ? K("", !0) : (B(), V("button", {
						key: 0,
						type: "button",
						class: "dui-btn dui-btn-primary",
						disabled: !F(n).ready,
						onClick: a[4] ||= (...e) => F(n).create && F(n).create(...e)
					}, A(F(n).busy ? "Working…" : "Add effect to Item"), 9, JM)),
					F(n).destination ? (B(), V("button", {
						key: 1,
						type: "button",
						class: "dui-btn",
						onClick: a[5] ||= (...e) => F(n).openDestination && F(n).openDestination(...e)
					}, " Open destination Item ")) : K("", !0),
					U("button", {
						type: "button",
						class: "dui-btn dui-btn-ghost",
						disabled: F(n).busy,
						onClick: a[6] ||= (...t) => e.close && e.close(...t)
					}, A(F(n).created ? "Done" : "Cancel"), 9, YM)
				])
			]),
			_: 1
		}, 8, ["title", "description"]));
	}
});
//#endregion
//#region src/module/apps/effect-builders/bridge.ts
async function ZM(e, t) {
	let n = Uj(await fromUuid(e)), r = oM(t, Y), i = t.kind === "grant" ? t.items : t.kind === "choice" ? t.groups.flatMap((e) => e.items) : [];
	for (let t of i) {
		if (t.uuid === e) throw Error("An Item cannot grant itself.");
		WS(await fromUuid(t.uuid), `The granted Item ${t.name} is no longer available.`);
	}
	if (t.kind === "random" && await Kj(t.table.uuid, e), !n.createEmbeddedDocuments) throw Error("This Item cannot contain Active Effects.");
	await n.createEmbeddedDocuments("ActiveEffect", [r]);
}
var QM = {
	resolveItem: Wj,
	async resolveTable(e) {
		return Gj(await Hj(e));
	},
	create: ZM,
	async openItem(e) {
		WS(await fromUuid(e)).sheet?.render(!0);
	}
}, $M = 0, eN = class extends kb {
	kind;
	destination;
	storeId;
	constructor(e, t = null) {
		let n = `${Y}-effect-${++$M}`;
		super({
			id: n,
			window: { title: `${qj.find((t) => t.kind === e).title} Effect Builder` }
		}), this.kind = e, this.destination = t, this.storeId = n;
	}
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		classes: [Y],
		position: {
			height: 780,
			width: 620
		},
		window: {
			icon: "fa-solid fa-wand-magic-sparkles",
			resizable: !0
		}
	};
	getVueComponent() {
		return XM;
	}
	getVueProps() {
		return {
			id: this.storeId,
			kind: this.kind,
			destination: this.destination,
			bridge: QM,
			close: () => this.close()
		};
	}
	async _preClose(e) {
		let t = sM(this.storeId);
		await super._preClose(e), t.$dispose(), delete gb.state.value[`effect-builder:${this.storeId}`];
	}
}, tN = { key: 0 }, nN = { class: "dui-list" }, rN = { class: "dui-list-col-grow" }, iN = ["aria-label", "onClick"], aN = /* @__PURE__ */ L({
	__name: "EffectBuildersApp",
	props: {
		destination: {},
		openBuilder: { type: Function }
	},
	setup(e) {
		return (t, n) => (B(), H(pM, {
			title: "Effect Builders",
			description: "Choose an effect to create, then select the Item that will carry it."
		}, {
			default: I(() => [
				e.destination ? (B(), V("p", tN, [n[0] ||= G(" Destination: ", -1), U("strong", null, A(e.destination.name), 1)])) : K("", !0),
				U("ul", nN, [(B(!0), V(z, null, R(F(qj), (t) => (B(), V("li", {
					key: t.kind,
					class: "dui-list-row"
				}, [U("div", rN, [U("strong", null, A(t.title), 1), U("p", null, A(t.description), 1)]), U("button", {
					type: "button",
					class: "dui-btn",
					"aria-label": `Open ${t.title} Effect Builder`,
					onClick: (n) => e.openBuilder(t.kind)
				}, " Open ", 8, iN)]))), 128))]),
				n[1] ||= U("p", null, "Find this launcher and individual shortcuts in the Effect Builders macro compendium.", -1)
			]),
			_: 1
		}));
	}
}), oN = class extends kb {
	destination = null;
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${Y}-effect-builders-{id}`,
		classes: [Y],
		position: {
			height: 550,
			width: 620
		},
		window: {
			icon: "fa-solid fa-wand-magic-sparkles",
			title: "Effect Builders",
			resizable: !0
		}
	};
	getVueComponent() {
		return aN;
	}
	getVueProps() {
		return {
			destination: this.destination,
			openBuilder: (e) => new eN(e, this.destination).render(!0)
		};
	}
};
//#endregion
//#region src/module/apps/effect-builders/open.ts
async function sN(e) {
	let t = new oN();
	e && (t.destination = Vj(Uj(await fromUuid(e)))), await t.render(!0);
}
async function cN(e, t) {
	await new eN(e, t ? Vj(Uj(await fromUuid(t))) : null).render(!0);
}
var lN = (e) => cN("wounds", e), uN = (e) => cN("grant", e), dN = (e) => cN("random", e), fN = (e) => cN("choice", e), pN = { key: 0 }, mN = ["disabled"], hN = { class: "dui-fieldset-legend" }, gN = { key: 2 }, _N = { class: "dui-list" }, vN = ["onClick"], yN = { class: "app:flex app:flex-wrap app:gap-2" }, bN = ["onClick"], xN = ["aria-label", "onClick"], SN = /* @__PURE__ */ L({
	__name: "SpeciesItemEffects",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = XA(e.uuid), n = q(() => [
			{
				name: "Temporary Effects",
				entries: t.effects.filter((e) => e.temporary && !e.disabled)
			},
			{
				name: "Effects",
				entries: t.effects.filter((e) => !e.temporary && !e.disabled)
			},
			{
				name: "Disabled Effects",
				entries: t.effects.filter((e) => e.disabled)
			}
		]);
		return (r, i) => (B(), V(z, null, [F(t).dirty ? (B(), V("p", pN, "Save or reload Item changes before editing effects.")) : K("", !0), (B(!0), V(z, null, R(n.value, (n) => (B(), V(z, { key: n.name }, [n.entries.length || n.name === "Effects" ? (B(), V("fieldset", {
			key: 0,
			class: "dui-fieldset",
			disabled: !e.editable || F(t).dirty
		}, [
			U("legend", hN, A(n.name), 1),
			n.name === "Effects" ? (B(), V("button", {
				key: 0,
				type: "button",
				class: "dui-btn dui-btn-sm",
				onClick: i[0] ||= (e) => F(t).effectAction("create")
			}, " Add Effect ")) : K("", !0),
			n.name === "Effects" ? (B(), V("button", {
				key: 1,
				type: "button",
				class: "dui-btn dui-btn-sm",
				onClick: i[1] ||= (t) => F(sN)(e.uuid)
			}, " Effect Builders ")) : K("", !0),
			n.entries.length ? K("", !0) : (B(), V("p", gN, "No effects.")),
			U("ul", _N, [(B(!0), V(z, null, R(n.entries, (e) => (B(), V("li", {
				key: e.id,
				class: "dui-list-row"
			}, [
				U("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					onClick: (n) => F(t).effectAction("edit", e.id)
				}, A(e.name), 9, vN),
				U("span", null, A(e.type), 1),
				U("div", yN, [U("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					onClick: (n) => F(t).effectAction("toggle", e.id)
				}, A(e.disabled ? "Enable" : "Disable"), 9, bN), U("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					"aria-label": `Delete ${e.name}`,
					onClick: (n) => F(t).effectAction("delete", e.id)
				}, " Delete ", 8, xN)])
			]))), 128))])
		], 8, mN)) : K("", !0)], 64))), 128))], 64));
	}
}), CN = { class: "app:flex app:items-center app:gap-3" }, wN = ["disabled"], TN = { class: "dui-avatar" }, EN = { class: "app:w-14" }, DN = ["src"], ON = { class: "dui-fieldset app:min-w-0 app:flex-1" }, kN = ["disabled"], AN = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, jN = {
	class: "dui-tabs dui-tabs-border",
	role: "tablist",
	"aria-label": "Species Item"
}, MN = [
	"id",
	"aria-selected",
	"aria-controls"
], NN = [
	"id",
	"aria-selected",
	"aria-controls"
], PN = [
	"id",
	"aria-selected",
	"aria-controls"
], FN = { class: "app:min-h-0 app:min-w-0 app:flex-1 app:overflow-y-auto" }, IN = ["id", "aria-labelledby"], LN = ["id", "aria-labelledby"], RN = ["id", "aria-labelledby"], zN = { class: "app:flex app:flex-wrap app:items-center app:gap-2" }, BN = ["disabled"], VN = ["disabled"], HN = { role: "status" }, UN = /* @__PURE__ */ L({
	__name: "SpeciesItemApp",
	props: {
		uuid: {},
		editable: { type: Boolean },
		bridge: {}
	},
	setup(e) {
		let t = e, n = XA(t.uuid);
		return n.configure(t.bridge), (t, r) => (B(), V("form", {
			class: "app:flex app:h-full app:min-w-0 app:flex-col app:gap-3",
			onSubmit: r[6] ||= No((e) => F(n).save(), ["prevent"])
		}, [
			U("header", CN, [U("button", {
				type: "button",
				class: "dui-btn dui-btn-sm app:h-auto",
				"aria-label": "Choose Species image",
				disabled: !e.editable || F(n).isSaving,
				onClick: r[0] ||= (e) => F(n).chooseImage()
			}, [U("div", TN, [U("div", EN, [U("img", {
				src: F(n).draft.img,
				alt: "Species image",
				width: "56",
				height: "56",
				class: "app:object-contain"
			}, null, 8, DN)])])], 8, wN), U("label", ON, [r[7] ||= U("span", { class: "dui-label" }, "Name", -1), Rn(U("input", {
				"onUpdate:modelValue": r[1] ||= (e) => F(n).draft.name = e,
				"aria-label": "Species name",
				class: "dui-input dui-input-sm app:w-full",
				disabled: !e.editable || !F(n).isLoaded || F(n).isSaving,
				required: ""
			}, null, 8, kN), [[wo, F(n).draft.name]])])]),
			F(n).error ? (B(), V("div", AN, A(F(n).error), 1)) : K("", !0),
			U("div", jN, [
				U("button", {
					id: `${e.uuid}-description-tab`,
					type: "button",
					role: "tab",
					class: k(["dui-tab", { "dui-tab-active": F(n).tab === "description" }]),
					"aria-selected": F(n).tab === "description",
					"aria-controls": `${e.uuid}-description-panel`,
					onClick: r[2] ||= (e) => F(n).tab = "description"
				}, " Description ", 10, MN),
				U("button", {
					id: `${e.uuid}-details-tab`,
					type: "button",
					role: "tab",
					class: k(["dui-tab", { "dui-tab-active": F(n).tab === "details" }]),
					"aria-selected": F(n).tab === "details",
					"aria-controls": `${e.uuid}-details-panel`,
					onClick: r[3] ||= (e) => F(n).tab = "details"
				}, " Details ", 10, NN),
				U("button", {
					id: `${e.uuid}-effects-tab`,
					type: "button",
					role: "tab",
					class: k(["dui-tab", { "dui-tab-active": F(n).tab === "effects" }]),
					"aria-selected": F(n).tab === "effects",
					"aria-controls": `${e.uuid}-effects-panel`,
					onClick: r[4] ||= (e) => F(n).tab = "effects"
				}, " Effects ", 10, PN)
			]),
			U("div", FN, [
				Rn(U("section", {
					id: `${e.uuid}-description-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-description-tab`
				}, [F(n).isLoaded ? (B(), H(Rj, {
					key: F(n).revision,
					uuid: e.uuid,
					editable: e.editable
				}, null, 8, ["uuid", "editable"])) : K("", !0)], 8, IN), [[Wa, F(n).tab === "description"]]),
				Rn(U("section", {
					id: `${e.uuid}-details-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-details-tab`
				}, [W(Fj, {
					uuid: e.uuid,
					editable: e.editable && F(n).isLoaded && !F(n).isSaving
				}, null, 8, ["uuid", "editable"])], 8, LN), [[Wa, F(n).tab === "details"]]),
				Rn(U("section", {
					id: `${e.uuid}-effects-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-effects-tab`
				}, [W(SN, {
					uuid: e.uuid,
					editable: e.editable && F(n).isLoaded && !F(n).isSaving
				}, null, 8, ["uuid", "editable"])], 8, RN), [[Wa, F(n).tab === "effects"]])
			]),
			U("footer", zN, [
				U("button", {
					type: "submit",
					class: "dui-btn dui-btn-sm dui-btn-primary",
					disabled: !e.editable || !F(n).isLoaded || F(n).isSaving
				}, " Save Item ", 8, BN),
				U("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					disabled: F(n).isSaving,
					onClick: r[5] ||= (e) => F(n).reload()
				}, " Reload Item ", 8, VN),
				U("span", HN, A(F(n).dirty ? "Unsaved changes" : F(n).message || "Saved"), 1)
			])
		], 32));
	}
});
//#endregion
//#region src/module/apps/species-item/editing.ts
function WN(e) {
	return (e.effects?.contents ?? []).map((e) => {
		let t = e.toObject(), n = X(t.system) ? t.system : {}, r = X(n.transferData) ? n.transferData : {};
		return {
			id: e.id,
			name: e.name,
			disabled: t.disabled === !0,
			temporary: e.isTemporary === !0,
			type: typeof r.type == "string" ? r.type : ""
		};
	});
}
async function GN(e, t, n) {
	if (!game.user?.isGM) throw Error("Only a GM can edit Species effects.");
	if (t === "create") {
		if (!e.createEmbeddedDocuments) throw Error("This Item cannot create effects.");
		await e.createEmbeddedDocuments("ActiveEffect", [{
			name: "New Effect",
			img: "icons/svg/aura.svg"
		}]);
		return;
	}
	let r = e.effects?.contents.find((e) => e.id === n);
	if (!r) throw Error("The effect no longer exists. Reload the Item.");
	t === "edit" ? r.sheet?.render(!0) : t === "toggle" ? await r.update({ disabled: r.toObject().disabled !== !0 }) : e.deleteEmbeddedDocuments && await e.deleteEmbeddedDocuments("ActiveEffect", [r.id]);
}
function KN(e, t) {
	new foundry.applications.apps.FilePicker.implementation({
		type: "image",
		current: e,
		callback: t
	}).render(!0);
}
//#endregion
//#region src/module/apps/species-item/notes.ts
function qN() {
	let e = /* @__PURE__ */ new Map();
	return {
		mount: (t, n, r, i, a) => {
			let o = new foundry.applications.elements.HTMLProseMirrorElement({
				value: r,
				enriched: r,
				toggled: !0
			});
			o.name = `system.${n}.value`, o.disabled = !i;
			let s = () => a(o.value);
			return o.addEventListener("input", s), o.addEventListener("change", s), e.set(n, o), t.append(o), () => {
				o.removeEventListener("input", s), o.removeEventListener("change", s), o.remove(), e.get(n) === o && e.delete(n);
			};
		},
		edit(t) {
			e.get(t)?.setAttribute("open", "");
		},
		flush() {
			for (let t of e.values()) t.classList.contains("active") && t.save();
		}
	};
}
//#endregion
//#region src/module/apps/species-item/bridge.ts
function JN(e) {
	let t = "", n = qN(), r = () => {
		let n = jO(e);
		return t = JSON.stringify(e.toObject()), {
			name: n.name,
			img: n.img,
			system: n.system
		};
	};
	return {
		isGM: game.user?.isGM === !0,
		flushNotes: n.flush,
		editNotes: n.edit,
		async openReference(e) {
			let t = await fromUuid(e), n = X(t) ? t.sheet : void 0;
			if (X(n) && typeof n.render == "function") n.render.call(n, !0);
			else throw Error("The referenced document could not be opened.");
		},
		effects: () => WN(e),
		effectAction: (t, n) => GN(e, t, n),
		chooseImage: KN,
		mountNotes: n.mount,
		load: r,
		async save(n) {
			if (t !== JSON.stringify(e.toObject())) throw Error("This Item changed in another window. Reload its sheet before saving.");
			return await HO(e, n), r();
		},
		async resolveDrop(e) {
			let t = JSON.parse(e), n = X(t) ? t.uuid : void 0;
			if (typeof n != "string") throw Error("Drop a Species, Skill, Talent, or RollTable document.");
			let r = await fromUuid(n);
			if (!X(r) || typeof r.uuid != "string" || typeof r.id != "string" || typeof r.name != "string") throw Error("The dropped document could not be resolved.");
			return {
				type: r.documentName === "RollTable" ? "RollTable" : String(r.type),
				reference: {
					uuid: r.uuid,
					id: r.id,
					name: r.name
				}
			};
		}
	};
}
//#endregion
//#region src/module/apps/species-item/SpeciesItemApplication.ts
var YN = class extends foundry.applications.api.DocumentSheetV2 {
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		tag: "div",
		classes: [Y],
		position: {
			width: 760,
			height: 780
		},
		window: {
			resizable: !0,
			icon: "fa-solid fa-people-group"
		}
	};
	#e = new Ob();
	async _renderHTML(e, t) {
		return this.#e.createRoot();
	}
	_replaceHTML(e, t, n) {
		this.#e.mount(e, t, UN, {
			uuid: this.document.uuid,
			editable: this.isEditable && game.user?.isGM === !0,
			bridge: JN(this.document)
		});
	}
	async _preClose(e) {
		this.#e.unmount(), await super._preClose(e);
	}
};
function XN() {
	foundry.applications.apps.DocumentSheetConfig.registerSheet(Item, Y, YN, {
		types: [kO],
		makeDefault: !0,
		label: "Species Customizer"
	});
}
//#endregion
//#region src/module/apps/species-builder/items/model.ts
function ZN() {
	let e = CONFIG.Item.dataModels.species;
	if (e) {
		CONFIG.Item.dataModels[kO] = e;
		return;
	}
	let t = Object.getPrototypeOf(CONFIG.Item.dataModels.psychology);
	if (typeof t?.defineSchema != "function") throw Error("WFRP BaseItemModel is unavailable for Species Items.");
	class n extends t {
		static LOCALIZATION_PREFIXES = ["WH.Models.species"];
		static defineSchema() {
			let e = foundry.data.fields, t = () => new e.NumberField({ min: 0 }), n = () => new e.EmbeddedDataField(DocumentReferenceModel);
			return {
				...super.defineSchema(),
				characteristics: new e.SchemaField(Object.fromEntries(Object.values(J).map((t) => [t, new e.SchemaField({
					base: new e.NumberField({
						initial: 20,
						min: 0
					}),
					dice: new e.NumberField({
						initial: 2,
						min: 0
					})
				})]))),
				fate: t(),
				resilience: t(),
				extra: t(),
				movement: new e.NumberField({
					initial: 4,
					min: 0
				}),
				skills: ListModel.createListModel(new e.StringField()),
				talents: new e.SchemaField({
					choices: new e.EmbeddedDataField(ChoiceModel, { restrictType: ["talent"] }),
					random: new e.NumberField({
						min: 0,
						integer: !0
					})
				}),
				size: new e.StringField({
					choices: game.wfrp4e?.config?.actorSizes,
					initial: "avg"
				}),
				subspeciesOf: n(),
				keys: new e.ArrayField(new e.StringField()),
				tables: new e.SchemaField({
					talents: n(),
					eye: n(),
					hair: n(),
					career: n()
				})
			};
		}
	}
	CONFIG.Item.dataModels[kO] = n;
}
//#endregion
//#region src/module/apps/species-builder/items/carrier-effects.ts
async function QN(e, t) {
	if (!e.createEmbeddedDocuments || !e.updateEmbeddedDocuments || !e.deleteEmbeddedDocuments) throw Error("The species carrier does not support embedded Active Effects.");
	let n = OO(e.toObject().effects), r = new Set(t.map((e) => e._id)), i = n.filter((e) => !r.has(e._id)).map((e) => e._id), a = t.filter((e) => !n.some((t) => t._id === e._id)), o = t.filter((e) => {
		let t = n.find((t) => t._id === e._id);
		return t && JSON.stringify(oO(t)) !== JSON.stringify(e);
	});
	i.length && await e.deleteEmbeddedDocuments("ActiveEffect", i), o.length && await e.updateEmbeddedDocuments("ActiveEffect", o, { recursive: !1 }), a.length && await e.createEmbeddedDocuments("ActiveEffect", a, { keepId: !0 });
}
//#endregion
//#region src/module/apps/species-builder/items/effect-carriers.ts
var $N = "WFRP Customizer Species Effect Carriers";
async function eP() {
	if (vk() || !game.user?.isGM || game.users?.activeGM && game.users.activeGM.id !== game.user.id) return;
	let t = BO().map(jO).filter((e) => e.effects.length), n = (game.items?.contents ?? []).filter((e) => tP(e)), r = /* @__PURE__ */ new Set();
	for (let e of t) {
		let t = sO(e, Y), i = n.find((t) => tP(t) === e.uuid);
		if (i) {
			let e = Z(i.toObject(), [
				"system",
				"description",
				"value"
			]);
			(i.name !== t.name || i.img !== t.img || e !== t.system.description.value) && await i.update({
				name: t.name,
				img: t.img,
				"system.description.value": t.system.description.value
			}), await QN(i, t.effects);
		} else {
			let n = await nP();
			if (i = await Item.create({
				...t,
				folder: n.id,
				ownership: { default: 2 }
			}) ?? void 0, !i) throw Error(`Foundry did not create the effects carrier for ${e.name}.`);
		}
		r.add(i.id);
	}
	for (let e of n) r.has(e.id) || await e.delete();
	(t.length || n.length) && e(`${Y} | Synchronized ${t.length} Species effect carrier(s).`);
}
function tP(e) {
	if (e.type !== "trait") return;
	let t = Z(e.toObject(), [
		"flags",
		Y,
		iO,
		"speciesUuid"
	]);
	return typeof t == "string" ? t : void 0;
}
async function nP() {
	let e = game.folders.contents.find((e) => e.type === "Item" && e.name === $N);
	if (e) return e;
	let t = await Folder.create({
		name: $N,
		type: "Item"
	});
	if (!t) throw Error("Foundry did not create the species effects carrier folder.");
	return t;
}
//#endregion
//#region src/module/debug/shape-inspector/constants.ts
var rP = `${Y}.debugShapeProbes`, iP = "wfrp4eCustomizerShapeProbes", aP = "wfrp4eCustomizerShapePreset";
//#endregion
//#region src/module/debug/shape-inspector/utils.ts
function oP(e, t, n) {
	let r = Number(e);
	return Number.isFinite(r) ? Math.max(0, Math.min(n, Math.floor(r))) : t;
}
function sP(e) {
	return typeof e == "object" && !!e;
}
function cP(e) {
	return typeof e == "string" ? e.trim().toLocaleLowerCase() : "";
}
function lP(e) {
	try {
		return localStorage.getItem(e);
	} catch {
		return null;
	}
}
//#endregion
//#region src/module/debug/shape-inspector/path-resolver.ts
function uP(e) {
	let t = gP(e), n = dP(globalThis, t.root);
	for (let e of t.tokens) {
		if (e.type === "property") {
			n = dP(n, e.key);
			continue;
		}
		if (e.type === "index") {
			n = dP(n, String(e.index));
			continue;
		}
		n = fP(n, e.name, e.args);
	}
	return n;
}
function dP(e, t) {
	if (!(!sP(e) && typeof e != "function")) try {
		return e[t];
	} catch {
		return;
	}
}
function fP(e, t, n) {
	if (t === "at") {
		let t = Number(n[0] ?? 0), r = Number.isFinite(t) ? t : 0;
		return _P(e).at(r);
	}
	if (t === "findByName") {
		let t = cP(n[0] ?? "");
		return _P(e).find((e) => cP(dP(e, "name")) === t);
	}
	if (t === "findByType") {
		let t = cP(n[0] ?? "");
		return _P(e).find((e) => cP(dP(e, "type")) === t);
	}
	if (t === "get") {
		let t = n[0] ?? "";
		if (e instanceof Map) return e.get(t);
		let r = dP(e, "get");
		if (typeof r == "function") return r.call(e, t);
	}
	if (t === "sample") {
		let t = oP(n[0], 3, 60);
		return _P(e).slice(0, t);
	}
	throw Error(`Unsupported path method "${t}".`);
}
function pP(e) {
	return e.trim() ? e.split(",").map((e) => hP(e.trim())).map(String) : [];
}
function mP(e) {
	let t = e.trim();
	return /^-?\d+$/.test(t) ? Number(t) : hP(t);
}
function hP(e) {
	let t = /^["'](?<value>.*)["']$/.exec(e);
	return t?.groups ? t.groups.value ?? "" : e;
}
function gP(e) {
	let t = /^(?<root>[$A-Z_a-z][\w$]*)/.exec(e.trim());
	if (!t?.groups) throw Error(`Debug path "${e}" does not start with a root name.`);
	let n = t.groups.root;
	if (!n) throw Error(`Debug path "${e}" does not start with a root name.`);
	let r = [], i = e.trim().slice(n.length);
	for (; i;) {
		let e = /^\.(?<name>[$A-Z_a-z][\w$]*)\((?<args>[^)]*)\)/.exec(i);
		if (e?.groups) {
			let t = e.groups.name;
			if (!t) throw Error(`Could not parse debug path near "${i}".`);
			r.push({
				args: pP(e.groups.args ?? ""),
				name: t,
				type: "method"
			}), i = i.slice(e[0].length);
			continue;
		}
		let t = /^\.(?<key>[$A-Z_a-z][\w$]*)/.exec(i);
		if (t?.groups) {
			let e = t.groups.key;
			if (!e) throw Error(`Could not parse debug path near "${i}".`);
			r.push({
				key: e,
				type: "property"
			}), i = i.slice(t[0].length);
			continue;
		}
		let n = /^\[(?<index>[^\]]+)]/.exec(i);
		if (n?.groups) {
			let e = n.groups.index;
			if (!e) throw Error(`Could not parse debug path near "${i}".`);
			r.push({
				index: mP(e),
				type: "index"
			}), i = i.slice(n[0].length);
			continue;
		}
		throw Error(`Could not parse debug path near "${i}".`);
	}
	return {
		root: n,
		tokens: r
	};
}
function _P(e) {
	if (Array.isArray(e)) return e;
	let t = dP(e, "contents");
	return Array.isArray(t) ? t : [];
}
//#endregion
//#region src/module/debug/shape-inspector/presets.ts
var vP = { "npc-builder": [
	{
		hook: "ready",
		label: "game.actors collection",
		maxDepth: 2,
		maxEntries: 10,
		path: "game.actors"
	},
	{
		hook: "ready",
		label: "first world Actor",
		maxDepth: 4,
		maxEntries: 14,
		path: "game.actors.contents.at(0)"
	},
	{
		hook: "ready",
		label: "game.items collection",
		maxDepth: 2,
		maxEntries: 10,
		path: "game.items"
	},
	{
		hook: "ready",
		label: "first world Career Item",
		maxDepth: 4,
		maxEntries: 16,
		path: "game.items.contents.findByType(\"career\")"
	},
	{
		hook: "ready",
		label: "first world Skill Item",
		maxDepth: 3,
		maxEntries: 12,
		path: "game.items.contents.findByType(\"skill\")"
	},
	{
		hook: "ready",
		label: "first world Talent Item",
		maxDepth: 3,
		maxEntries: 12,
		path: "game.items.contents.findByType(\"talent\")"
	},
	{
		hook: "ready",
		label: "first world Trapping Item",
		maxDepth: 3,
		maxEntries: 12,
		path: "game.items.contents.findByType(\"trapping\")"
	},
	{
		hook: "ready",
		label: "game.wfrp4e.config",
		maxDepth: 2,
		maxEntries: 24,
		path: "game.wfrp4e.config"
	},
	{
		hook: "ready",
		label: "game.wfrp4e.utility",
		maxDepth: 2,
		maxEntries: 24,
		path: "game.wfrp4e.utility"
	},
	{
		hook: "ready",
		label: "CONFIG.WFRP4E",
		maxDepth: 2,
		maxEntries: 24,
		path: "CONFIG.WFRP4E"
	}
] };
//#endregion
//#region src/module/debug/shape-inspector/probe-config.ts
function yP() {
	return window.location.href.includes("wfrp4eCustomizerShapeProbes") || window.location.href.includes("wfrp4eCustomizerShapePreset");
}
function bP(e) {
	let t = {
		hook: e.hook ?? "ready",
		maxDepth: oP(e.maxDepth, 2, 6),
		maxEntries: oP(e.maxEntries, 12, 60),
		path: e.path.trim()
	};
	return e.label && (t.label = e.label), t;
}
function xP() {
	return [...SP(), ...CP()].map(bP);
}
function SP() {
	let e = lP(rP);
	if (!e) return [];
	try {
		let t = JSON.parse(e);
		return Array.isArray(t) ? t.filter(TP).map(bP) : [];
	} catch {
		return [];
	}
}
function CP() {
	let e = [], t = [new URLSearchParams(window.location.search), new URLSearchParams(window.location.hash.replace(/^#/, ""))];
	for (let n of t) {
		let t = n.get(aP), r = n.get(iP);
		t && e.push(...vP[t] ?? []), r && e.push(...wP(r));
	}
	return window.location.href.includes("wfrp4eCustomizerShapePreset=npc-builder") && !e.length && e.push(...vP["npc-builder"] ?? []), e;
}
function wP(e) {
	try {
		let t = JSON.parse(decodeURIComponent(e));
		return Array.isArray(t) ? t.filter(TP) : [];
	} catch (e) {
		return t(`${Y} | Could not parse URL shape probes.`, e), [];
	}
}
function TP(e) {
	return typeof e != "object" || !e ? !1 : "path" in e && typeof e.path == "string";
}
//#endregion
//#region src/module/debug/shape-inspector/summary.ts
function EP(e, t) {
	return !sP(e) && typeof e != "function" ? jP(e) : typeof e == "function" ? kP(e) : Array.isArray(e) ? DP(e, t) : e instanceof Map ? OP(e, t) : AP(e, t);
}
function DP(e, t) {
	return {
		length: e.length,
		sample: e.slice(0, t.maxEntries).map((e) => EP(e, NP(t))),
		type: "array"
	};
}
function OP(e, t) {
	return {
		sample: [...e.entries()].slice(0, t.maxEntries).map(([e, n]) => ({
			key: EP(e, NP(t)),
			value: EP(n, NP(t))
		})),
		size: e.size,
		type: "Map"
	};
}
function kP(e) {
	return {
		name: e.name,
		type: "function"
	};
}
function AP(e, t) {
	if (t.seen.has(e)) return { type: "circular" };
	t.seen.add(e);
	let n = MP(e, t.maxEntries), r = dP(e, "constructor"), i = {
		constructor: typeof r == "function" && r.name ? r.name : "Object",
		keys: n,
		type: "object"
	};
	for (let t of [
		"documentName",
		"id",
		"name",
		"type",
		"uuid"
	]) {
		let n = dP(e, t);
		typeof n == "string" && (i[t] = n);
	}
	if (t.maxDepth <= 0) return i;
	let a = {};
	for (let r of n) a[r] = EP(dP(e, r), NP(t));
	i.properties = a;
	let o = dP(e, "toObject");
	if (typeof o == "function") try {
		i.source = EP(o.call(e), NP(t));
	} catch (e) {
		i.source = {
			error: e instanceof Error ? e.message : String(e),
			type: "error"
		};
	}
	return i;
}
function jP(e) {
	if (typeof e == "string") {
		let t = e.length > 120 ? `${e.slice(0, 120)}...` : e;
		return {
			length: e.length,
			sample: t,
			type: "string"
		};
	}
	return {
		type: e === null ? "null" : typeof e,
		value: e
	};
}
function MP(e, t) {
	return Object.keys(e).sort().slice(0, t);
}
function NP(e) {
	return {
		maxDepth: e.maxDepth - 1,
		maxEntries: e.maxEntries,
		seen: e.seen
	};
}
//#endregion
//#region src/module/debug/shape-inspector/index.ts
function PP() {
	localStorage.removeItem(rP), e(`${Y} | Cleared debug shape probes.`);
}
function FP() {
	return xP();
}
function IP(e, t = {}) {
	let n = zP(e, t);
	return VP(n), n;
}
function LP() {
	let t = xP();
	for (let e of ["init", "setup"]) {
		let n = t.filter((t) => t.hook === e);
		n.length && Hooks.once(e, () => {
			for (let t of n) BP(t, e);
		});
	}
	Hooks.once("ready", () => {
		let t = xP().filter((e) => (e.hook ?? "ready") === "ready");
		yP() && e(`${Y} | Debug shape ready probes discovered: ${t.length}`, window.location.href);
		for (let e of t) BP(e, "ready");
	});
}
function RP(t) {
	let n = t.map(bP);
	localStorage.setItem(rP, JSON.stringify(n)), e(`${Y} | Stored ${n.length} debug shape probe(s). Reload Foundry to run init/setup probes.`);
}
function zP(e, t = {}, n) {
	let r = oP(t.maxDepth, 2, 6), i = oP(t.maxEntries, 12, 60), a = uP(e), o = {
		inspectedAt: (/* @__PURE__ */ new Date()).toISOString(),
		label: t.label || e,
		maxDepth: r,
		maxEntries: i,
		path: e,
		value: EP(a, {
			maxDepth: r,
			maxEntries: i,
			seen: /* @__PURE__ */ new WeakSet()
		})
	};
	return n && (o.hook = n), o;
}
function BP(e, n) {
	try {
		VP(zP(e.path, e, n));
	} catch (n) {
		t(`${Y} | Debug shape probe failed for "${e.path}".`, n);
	}
}
function VP(t) {
	e(`${Y} | Debug shape probe: ${t.label}`, JSON.stringify(t, null, 2));
}
//#endregion
//#region src/view/apps/daisy-example/DaisyExampleApp.vue?vue&type=script&setup=true&lang.ts
var HP = { class: "dui-list" }, UP = /* @__PURE__ */ L({
	__name: "DaisyExampleApp",
	setup(e) {
		let t = [
			"button",
			"badge",
			"card",
			"alert"
		];
		return (e, n) => (B(), H(pM, {
			description: "A quick visual check of the module's isolated Daisy component theme.",
			title: "Daisy Probe"
		}, {
			header: I(() => [...n[0] ||= [U("span", { class: "dui-badge dui-badge-primary" }, "Scoped", -1), U("span", { class: "dui-badge dui-badge-outline" }, "Foundry-safe", -1)]]),
			actions: I(() => [...n[1] ||= [U("span", { class: "dui-badge dui-badge-success" }, "Ready", -1)]]),
			default: I(() => [n[2] ||= U("div", { class: "dui-alert dui-alert-info" }, [U("span", null, "DaisyUI is available inside this Vue application root.")], -1), U("ul", HP, [(B(), V(z, null, R(t, (e) => U("li", {
				key: e,
				class: "dui-list-row"
			}, A(e), 1)), 64))])]),
			_: 1
		}));
	}
}), WP = class extends kb {
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${Y}-daisy-example`,
		classes: [Y, "wfrp4e-customizer-daisy-example"],
		position: {
			height: 430,
			width: 560
		},
		window: {
			icon: "fa-solid fa-flask",
			title: "WFRP4e Daisy Probe"
		}
	};
	getVueComponent() {
		return UP;
	}
}, GP = { class: "dui-list" }, KP = { class: "dui-list-row" }, qP = { class: "dui-list-row" }, JP = { class: "dui-list-row" }, YP = /* @__PURE__ */ L({
	__name: "WorkbenchApp",
	props: {
		openDaisyProbe: { type: Function },
		openNpcBuilder: { type: Function },
		openEffectBuilders: { type: Function }
	},
	setup(e) {
		return (t, n) => (B(), H(pM, {
			description: "Open a focused WFRP4e authoring workflow.",
			title: "Customizer Workbench"
		}, {
			default: I(() => [U("ul", GP, [
				U("li", KP, [n[3] ||= U("div", { class: "dui-list-col-grow" }, [U("strong", null, "NPC Builder"), U("p", null, "Build an NPC from a base Actor, Careers, traits, trappings, and spells.")], -1), U("button", {
					"aria-label": "Open NPC Builder",
					class: "dui-btn dui-btn-primary",
					type: "button",
					onClick: n[0] ||= (...t) => e.openNpcBuilder && e.openNpcBuilder(...t)
				}, " Open ")]),
				U("li", qP, [n[4] ||= U("div", { class: "dui-list-col-grow" }, [U("strong", null, "Effect Builders"), U("p", null, "Create wound formulas, Item grants, random grants, and player choices as effects.")], -1), U("button", {
					"aria-label": "Open Effect Builders",
					class: "dui-btn",
					type: "button",
					onClick: n[1] ||= (...t) => e.openEffectBuilders && e.openEffectBuilders(...t)
				}, " Open ")]),
				U("li", JP, [n[5] ||= U("div", { class: "dui-list-col-grow" }, [U("strong", null, "DaisyUI Probe"), U("p", null, "Check the module's scoped component theme.")], -1), U("button", {
					"aria-label": "Open DaisyUI Probe",
					class: "dui-btn dui-btn-ghost",
					type: "button",
					onClick: n[2] ||= (...t) => e.openDaisyProbe && e.openDaisyProbe(...t)
				}, " Open ")])
			])]),
			_: 1
		}));
	}
}), XP = class extends kb {
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${Y}-workbench`,
		classes: [Y, "wfrp4e-customizer-workbench"],
		position: {
			height: 430,
			width: 640
		},
		window: {
			icon: "fa-solid fa-screwdriver-wrench",
			title: mb
		}
	};
	getVueComponent() {
		return YP;
	}
	getVueProps() {
		return {
			openDaisyProbe: () => new WP().render(!0),
			openNpcBuilder: () => new ST().render(!0),
			openEffectBuilders: sN
		};
	}
};
//#endregion
//#region src/module/register-module-menus.ts
function ZP() {
	game.settings.registerMenu(Y, "workbench", {
		hint: `Open the ${mb} workbench.`,
		icon: "fa-solid fa-screwdriver-wrench",
		label: "Open Workbench",
		name: mb,
		restricted: !0,
		type: XP
	}), game.settings.registerMenu(Y, "npc-builder", {
		hint: "Build a WFRP4e NPC from a base Actor and Career items.",
		icon: "fa-solid fa-user-plus",
		label: "Open NPC Builder",
		name: "WFRP4e NPC Builder",
		restricted: !0,
		type: ST
	}), game.settings.registerMenu(Y, "effect-builders", {
		hint: "Create native WFRP effects on your Items.",
		icon: "fa-solid fa-wand-magic-sparkles",
		label: "Open Effect Builders",
		name: "Effect Builders",
		restricted: !1,
		type: oN
	}), game.settings.registerMenu(Y, "daisy-example", {
		hint: "Open a small isolated DaisyUI component probe.",
		icon: "fa-solid fa-flask",
		label: "Open Daisy Probe",
		name: "WFRP4e Daisy Probe",
		restricted: !0,
		type: WP
	});
}
//#endregion
//#region src/functions/species-builder/career-table-normalization.ts
function QP(e) {
	if (!X(e)) return;
	let t = $P(e.rows) ?? eF(e.careers);
	return t ? { rows: t } : void 0;
}
function $P(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap((e) => {
		if (!X(e)) return [];
		let t = nF(e.name);
		if (!t) return [];
		let n = { name: t };
		return $(n, "journalUuid", nF(e.journalUuid)), [n];
	});
	return t.length > 0 ? t : void 0;
}
function eF(e) {
	return tF(e)?.map((e) => ({ name: e }));
}
function tF(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap((e) => {
		let t = nF(e);
		return t ? [t] : [];
	});
	return t.length > 0 ? t : void 0;
}
function nF(e) {
	if (typeof e == "string") return e.trim() || void 0;
}
//#endregion
//#region src/functions/species-builder/replacement-row-normalization.ts
function rF(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap((e) => {
		if (!X(e)) return [];
		let t = aF(e.rolled, "talent"), n = aF(e.replacement, "talent");
		return !t.name || !n.name ? [] : [{
			replacement: n,
			rolled: t
		}];
	});
	return t.length > 0 ? t : void 0;
}
function iF(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap((e) => {
		if (!X(e)) return [];
		let t = aF(e.rolled, "career"), n = Array.isArray(e.replacements) ? e.replacements.flatMap((e) => {
			let t = aF(e, "career");
			return t.name ? [t] : [];
		}) : [];
		return !t.name || n.length === 0 ? [] : [{
			replacements: n,
			rolled: t
		}];
	});
	return t.length > 0 ? t : void 0;
}
function aF(e, t) {
	if (typeof e == "string") return { name: cF(e) ?? "" };
	if (!X(e)) return { name: "" };
	let n = oF(e.item, t), r = cF(e.name) ?? n?.name ?? "";
	return n ? {
		item: n,
		name: r
	} : { name: r };
}
function oF(e, t) {
	if (!X(e)) return;
	let n = cF(e.name), r = sF(e.type), i = cF(e.uuid);
	if (!n || r !== t || !i) return;
	let a = {
		name: n,
		type: r,
		uuid: i
	}, o = cF(e.specification) ?? cF(e.specifier);
	o && (a.specification = o);
	let s = cF(e.img);
	return s && (a.img = s), a;
}
function sF(e) {
	return e === "career" || e === "skill" || e === "talent" || e === "trait" ? e : void 0;
}
function cF(e) {
	if (typeof e == "string") return e.trim() || void 0;
}
//#endregion
//#region src/functions/species-builder/linked-grant-normalization.ts
function lF(e, t) {
	if (!Array.isArray(e)) return;
	let n = e.flatMap((e) => {
		let n = aF(e, t);
		return n.name ? [n] : [];
	});
	return n.length > 0 ? n : void 0;
}
function uF(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap((e) => {
		if (!X(e) || !Array.isArray(e.choices)) return [];
		let t = e.choices.flatMap((e) => {
			let t = aF(e, "talent");
			return t.name ? [t] : [];
		});
		return t.length > 0 ? [{ choices: t }] : [];
	});
	return t.length > 0 ? t : void 0;
}
//#endregion
//#region src/functions/species-builder/config-keys.ts
function dF(e) {
	return e.trim().toLocaleLowerCase().replaceAll(/[^\da-z]+/g, "-").replaceAll(/^-+|-+$/g, "");
}
//#endregion
//#region src/functions/species-builder/settings-normalization/values.ts
var fF = Object.values(J);
function pF(e) {
	return typeof e == "string" ? dF(e) : "";
}
function mF(e) {
	if (typeof e == "string") return e.trim() || void 0;
}
function hF(e) {
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function gF(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap((e) => {
		let t = mF(e);
		return t ? [t] : [];
	});
	return t.length > 0 ? t : void 0;
}
function _F(e) {
	if (!X(e)) return;
	let t = Object.entries(e).flatMap(([e, t]) => {
		let n = mF(e), r = mF(t);
		return n && r ? [[n, r]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : void 0;
}
function vF(e) {
	if (!X(e)) return;
	let t = Object.entries(e).flatMap(([e, t]) => {
		let n = mF(e), r = hF(t);
		return n && r !== void 0 ? [[n, r]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : void 0;
}
function yF(e) {
	if (!X(e)) return;
	let t = Object.entries(e).flatMap(([e, t]) => {
		let n = mF(e), r = gF(t);
		return n && r ? [[n, r]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : void 0;
}
function bF(e) {
	if (!X(e)) return;
	let t = fF.flatMap((t) => {
		let n = mF(e[t]);
		return n ? [[t, n]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : void 0;
}
function xF(e) {
	if (!X(e)) return;
	let t = {};
	return $(t, "die", mF(e.die)), $(t, "feet", hF(e.feet)), $(t, "inches", hF(e.inches)), Object.keys(t).length > 0 ? t : void 0;
}
function SF(e) {
	if (!X(e)) return;
	let t = mF(e.formula);
	return t ? { formula: t } : void 0;
}
//#endregion
//#region src/functions/species-builder/species-settings-normalization.ts
function CF(e) {
	return !X(e) || !Array.isArray(e.definitions) ? {
		autoRegisterSpeciesTable: !1,
		correctExistingWfrpSpecies: !1,
		definitions: [],
		runtimeSpeciesExtensions: [],
		showGeneratedConfigTab: !1
	} : {
		autoRegisterSpeciesTable: e.autoRegisterSpeciesTable === !0,
		correctExistingWfrpSpecies: e.correctExistingWfrpSpecies === !0,
		definitions: e.definitions.flatMap(TF),
		runtimeSpeciesExtensions: wF(e.runtimeSpeciesExtensions),
		showGeneratedConfigTab: e.showGeneratedConfigTab === !0
	};
}
function wF(e) {
	return Array.isArray(e) ? e.flatMap((e) => {
		if (!X(e)) return [];
		let t = mF(e.speciesKey), n = mF(e.speciesName), r = EF(e.subspecies) ?? [];
		return t && n && r.length > 0 ? [{
			speciesKey: t,
			speciesName: n,
			subspecies: r
		}] : [];
	}) : [];
}
function TF(e) {
	return OF(e, (e, t, n) => ({
		includeInExtraSpecies: n.includeInExtraSpecies === !0,
		key: e,
		name: t
	})).map((t) => (kF(t, e), AF(t, e), t));
}
function EF(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap(DF);
	return t.length > 0 ? t : void 0;
}
function DF(e) {
	return OF(e, (e, t, n) => {
		let r = {
			key: e,
			name: t
		};
		return $(r, "skillsAdded", gF(n.skillsAdded)), $(r, "skillsRemoved", gF(n.skillsRemoved)), $(r, "talentsAdded", gF(n.talentsAdded)), $(r, "talentsRemoved", gF(n.talentsRemoved)), $(r, "traitsAdded", gF(n.traitsAdded)), $(r, "traitsRemoved", gF(n.traitsRemoved)), r;
	});
}
function OF(e, t) {
	if (!X(e)) return [];
	let n = pF(e.key), r = mF(e.name);
	if (!n || !r) return [];
	let i = t(n, r, e);
	return $(i, "characteristics", bF(e.characteristics)), $(i, "randomTalents", vF(e.randomTalents)), $(i, "talentReplacementRows", rF(e.talentReplacementRows)), $(i, "talentReplacements", _F(e.talentReplacements)), $(i, "movement", hF(e.movement)), $(i, "fate", hF(e.fate)), $(i, "resilience", hF(e.resilience)), $(i, "extra", hF(e.extra)), $(i, "woundFormula", SF(e.woundFormula)), $(i, "careerTable", QP(e.careerTable)), [i];
}
function kF(e, t) {
	X(t) && ($(e, "skills", gF(t.skills)), $(e, "linkedSkills", lF(t.linkedSkills, "skill")), $(e, "talents", gF(t.talents)), $(e, "linkedTalents", uF(t.linkedTalents)), $(e, "traits", gF(t.traits)), $(e, "linkedTraits", lF(t.linkedTraits, "trait")));
}
function AF(e, t) {
	X(t) && ($(e, "age", mF(t.age)), $(e, "height", xF(t.height)), $(e, "careerReplacements", yF(t.careerReplacements)), $(e, "careerReplacementRows", iF(t.careerReplacementRows)), $(e, "subspecies", EF(t.subspecies)));
}
//#endregion
//#region src/module/apps/species-builder/settings.ts
var jF = NS({
	defaultValue: mO(),
	key: "speciesBuilderSettings",
	name: "Species Builder Settings",
	normalize: CF
});
function MF() {
	PS(jF);
}
//#endregion
//#region src/module/register-module-settings.ts
function NF() {
	RS(), MF();
}
//#endregion
//#region src/module/wfrp4e/item-effect-drops.ts
var PF = new Set(["talent", "trait"]), FF = /* @__PURE__ */ new WeakSet(), IF = !1, LF = "wfrp4e-customizer-grant-builder-button", RF = [
	"section[data-application-part=\"effects\"].active",
	"section[data-tab=\"effects\"].active",
	".tab[data-tab=\"effects\"].active",
	".tab.effects.active"
].join(","), zF = [
	"section[data-application-part=\"effects\"]",
	"section[data-tab=\"effects\"]",
	".tab[data-tab=\"effects\"]",
	".tab.effects"
].join(",");
function BF() {
	IF || (IF = !0, Hooks.on("renderApplicationV2", (e, t) => {
		if (!(t instanceof HTMLElement)) return;
		let n = WF(e);
		!n || !PF.has(n.type) || (VF(n, t), HF(n, t));
	}));
}
function VF(e, t) {
	FF.has(t) || (FF.add(t), t.addEventListener("dragover", (e) => {
		GF(t, e.target) && (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"));
	}, !0), t.addEventListener("drop", (n) => {
		UF(e, t, n);
	}, !0));
}
function HF(e, t) {
	if (t.querySelector(`.${LF}`)) return;
	let n = qF(t, { includeInactive: !0 });
	if (!n) return;
	let r = document.createElement("div");
	r.classList.add("wfrp4e-customizer-grant-builder-toolbar");
	let i = document.createElement("button");
	i.type = "button", i.classList.add(LF), i.title = "Open Effect Builders for this Item", i.innerHTML = "<i class=\"fa-solid fa-sitemap\" aria-hidden=\"true\"></i><span>Effect Builders</span>", i.addEventListener("click", () => {
		sN(e.uuid);
	}), r.append(i), n.prepend(r);
}
async function UF(e, t, n) {
	if (!GF(t, n.target)) return;
	let r = zj(n);
	if (r) {
		n.preventDefault(), n.stopPropagation();
		try {
			let t = await Bj(r);
			if (t.uuid === e.uuid) throw Error("An Item cannot grant itself.");
			let n = Vj(t), i = Qj({
				effectName: `Grant ${t.name}`,
				flagScope: Y,
				items: [n]
			});
			if (!e.createEmbeddedDocuments) throw Error("This Item sheet does not support creating Active Effects.");
			await e.createEmbeddedDocuments("ActiveEffect", [i]), ui.notifications?.info(`Added grant effect for "${t.name}".`);
		} catch (e) {
			let t = e instanceof Error ? e.message : "The dropped Item could not be converted.";
			ui.notifications?.warn?.(t);
		}
	}
}
function WF(e) {
	if (typeof e != "object" || !e) return null;
	let t = "item" in e ? e.item : void 0;
	if (HS(t)) return t;
	let n = "document" in e ? e.document : void 0;
	return HS(n) ? n : null;
}
function GF(e, t) {
	return !(t instanceof Element) || !e.contains(t) ? !1 : !!KF(e);
}
function KF(e) {
	return e.querySelector(RF) || qF(e, { includeInactive: !1 });
}
function qF(e, t) {
	return [...e.querySelectorAll(zF)].find((e) => t.includeInactive || e.offsetParent !== null) ?? null;
}
//#endregion
//#region src/module/api/create-module-api.ts
function JF() {
	return {
		clearDebugShapeProbes: PP,
		estimateNpcXp: CE,
		getDebugShapeProbes: FP,
		inspectPath: IP,
		listNpcAutoAdvanceStrategies: Vu,
		openActorPortraitGallery: QT,
		async openDaisyExample() {
			await new WP().render(!0);
		},
		async openNpcBuilder() {
			await new ST().render(!0);
		},
		createBuiltEffect: ZM,
		openEffectBuilders: sN,
		openWoundFormulaEffectBuilder: lN,
		openItemGrantEffectBuilder: uN,
		openRandomItemEffectBuilder: dN,
		openItemChoiceEffectBuilder: fN,
		async openWorkbench() {
			await new XP().render(!0);
		},
		rebuildSpeciesCareerTables: async () => await dA(void 0, { force: !0 }),
		registerNpcAutoAdvanceStrategy: Bu,
		setDebugShapeProbes: RP
	};
}
//#endregion
//#region src/module/api/register-module-api.ts
function YF() {
	let e = game.modules.get(Y);
	if (!e) throw Error(`Foundry module registry entry was not found for ${Y}.`);
	e.api = JF();
}
//#endregion
//#region src/module/hooks/register-module-hooks.ts
function XF() {
	LP(), Hooks.once("init", () => {
		e(`${Y} | Initializing`), NF(), game.system.id === "wfrp4e" && (iA(), ZN(), XN(), aE(), kE(), vk() || VA(), BF()), ZP(), wT();
	}), Hooks.once("ready", () => {
		if (game.system.id !== "wfrp4e") {
			t(`${Y} | Loaded outside ${hb}; skipping module API registration.`);
			return;
		}
		ZF();
	});
}
async function ZF() {
	await Promise.resolve();
	let n;
	try {
		await yk(), await aA([]), vk() || (n = VO(), await eP(), GO(n));
	} catch (e) {
		let r = e instanceof Error ? e.message : "Unknown runtime adaptation error.";
		t(`${Y} | Runtime species catalog could not be prepared: ${r}`), ui.notifications?.warn?.(`Species Items could not be applied: ${r}`), n = void 0;
	}
	YF(), rx(), xx(), n && game.user?.isGM && (!game.users?.activeGM || game.users.activeGM.id === game.user.id) && dA(n).catch((e) => t(String(e))), e(`${Y} | Ready`);
}
//#endregion
//#region src/main.ts
XF();
//#endregion

//# sourceMappingURL=wfrp4e-customizer-apps.mjs.map
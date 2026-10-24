//#region src/module/constants.ts
var e = "wfrp4e-customizer-apps", t = "Drowsy's WFRP4e Customizers", n = "wfrp4e", r = "keepCompendiumsTidy";
function i() {
	if (!game?.user) throw Error("Foundry user is unavailable during Compendium tidy setting registration.");
	game.settings.register(e, r, {
		config: game.user.isGM === !0,
		default: !1,
		hint: "Restore this module's Compendium sidebar folders and pack locations when the active GM opens the world.",
		name: `Keep ${t} Compendiums Tidy?`,
		scope: "world",
		type: Boolean
	});
}
//#endregion
//#region src/module/foundry/compendiums/queue.ts
var a = /* @__PURE__ */ new WeakMap();
async function o(e, t) {
	let n = (a.get(e) ?? Promise.resolve()).catch(() => void 0).then(async () => {
		let e = globalThis.navigator?.locks;
		e ? await e.request("foundry:folder-tidy", t) : await t();
	});
	a.set(e, n);
	try {
		await n;
	} finally {
		a.get(e) === n && a.delete(e);
	}
}
//#endregion
//#region src/module/foundry/compendiums/merge.ts
async function s(e, t, n, r) {
	for (let [, n] of r.entries()) if (n.folder?.id === e.id && (await n.setFolder(t), n.folder?.id !== t.id)) throw Error(`Could not move a pack out of ${e.name}.`);
	for (let r of n.filter((t) => t.folder?.id === e.id)) if (await r.update({ folder: t.id }), r.folder?.id !== t.id) throw Error(`Could not move folder ${r.name}.`);
	if (!await e.delete({
		deleteSubfolders: !1,
		deleteContents: !1
	})) throw Error(`Could not delete empty duplicate folder ${e.name}.`);
	n.splice(n.indexOf(e), 1);
}
async function c(e, t, n, r) {
	for (let [e, i] of t.entries()) if (i.folder && n.has(i.folder.id) && !r.has(e) && (await i.setFolder(null), i.folder)) throw Error(`Could not move unrelated pack ${e} to the sidebar root.`);
	for (let t of e) if (t.folder && n.has(t.folder.id) && !n.has(t.id) && (await t.update({ folder: null }), t.folder)) throw Error(`Could not move unrelated folder ${t.name} to the sidebar root.`);
}
//#endregion
//#region src/module/functions/compendiums/folders.ts
function l(e, t) {
	return t.filter((t) => t.folder?.id === e.id);
}
function u(e, t) {
	let n = new Set([e.id]);
	for (let r of l(e, t)) for (let e of u(r, t)) n.add(e);
	return n;
}
function d(e, t) {
	let n = new Set(Array.from(e.packs, (e) => `${t}.${e}`));
	for (let r of e.folders) for (let e of d(r, t)) n.add(e);
	return n;
}
function f(e, t, n, r) {
	let i = u(e, t), a = !1;
	for (let [e, t] of n.entries()) !t.folder || !i.has(t.folder.id) || r.has(e) && (a = !0);
	return a;
}
function p(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	function r(e, i) {
		let a = `${i}/${e.name}`;
		if (t.has(a)) throw Error(`Duplicate Compendium folder declaration: ${a}`);
		t.add(a);
		for (let t of e.packs) {
			if (n.has(t)) throw Error(`Duplicate Compendium pack declaration: ${t}`);
			n.add(t);
		}
		for (let t of e.folders) r(t, a);
	}
	for (let t of e) r(t, "");
}
//#endregion
//#region src/module/foundry/compendiums/tidy.ts
async function m(e, t) {
	await o(e, () => h(e, t));
}
async function h(t, n) {
	if (t.user.isGM !== !0 || t.user.isActiveGM !== !0) return;
	let r = t.modules.get(e);
	if (!r) throw Error(`Foundry module registry entry was not found for ${e}.`);
	let i = Array.from(r.packFolders ?? []);
	if (p(i), i.length === 0) return;
	for (let n of i) for (let r of d(n, e)) if (!t.packs.has(r)) throw Error(`Declared Compendium ${r} was not found.`);
	let a = Array.from(t.folders).filter((e) => e.type === "Compendium"), o = /* @__PURE__ */ new Set();
	async function l(r, i) {
		let c = r.color === void 0 ? void 0 : r.color?.toString() ?? null, p = d(r, e), m = a.filter((e) => e.name === r.name && !o.has(e.id) && (!i || !u(e, a).has(i.id))).sort((e, n) => Number(f(n, a, t.packs, p)) - Number(f(e, a, t.packs, p)) || e.id.localeCompare(n.id)), h = m.find((e) => (e.folder?.id ?? null) === (i?.id ?? null));
		if (!h) if (h = m.find((e) => f(e, a, t.packs, p) && (!i || !u(e, a).has(i.id))), h) {
			if (i && u(h, a).has(i.id)) throw Error(`Moving ${r.name} under ${i.name} would make a folder cycle.`);
			let e = i?.id ?? null;
			if (await h.update({ folder: e }) === void 0 && (h.folder?.id ?? null) !== e) throw Error(`Could not move Compendium folder ${r.name}; the update was not applied.`);
		} else {
			if (h = await n({
				name: r.name,
				type: "Compendium",
				folder: i?.id ?? null,
				sorting: r.sorting,
				...c ? { color: c } : {}
			}), !h) throw Error(`Could not create Compendium folder ${r.name}.`);
			a.push(h);
		}
		o.add(h.id);
		for (let e of m) if (e.id !== h.id && !((e.folder?.id ?? null) !== (i?.id ?? null) && !f(e, a, t.packs, p))) {
			if (u(e, a).has(h.id)) throw Error(`Cannot merge ancestor folder ${e.name} into its descendant.`);
			await s(e, h, a, t.packs);
		}
		let g = {};
		if (h.sorting !== r.sorting && (g.sorting = r.sorting), c !== void 0 && (h.color?.toString() ?? null) !== c && (g.color = c), Object.keys(g).length > 0 && await h.update(g) === void 0 && (h.sorting !== r.sorting || c !== void 0 && (h.color?.toString() ?? null) !== c)) throw Error(`Could not configure Compendium folder ${r.name}; the update was not applied.`);
		for (let n of r.packs) {
			let r = `${e}.${n}`, i = t.packs.get(r);
			if (!i) throw Error(`Declared Compendium ${r} was not found.`);
			i.folder?.id !== h.id && await i.setFolder(h);
		}
		for (let e of r.folders) await l(e, h);
	}
	for (let e of i) await l(e, null);
	let m = new Set(i.flatMap((t) => [...d(t, e)]));
	await c(a, t.packs, o, m);
}
async function g() {
	if (!game.user?.isGM || game.users?.activeGM?.id !== game.user.id || game.settings.get("wfrp4e-customizer-apps", "keepCompendiumsTidy") !== !0) return;
	let e = game;
	await m({
		modules: e.modules,
		packs: e.packs,
		folders: e.folders,
		user: {
			isGM: !0,
			isActiveGM: !0
		}
	}, (e) => Folder.create(e));
}
//#endregion
//#region src/module/functions/shared/object-readers.ts
function _(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function v(e, t) {
	let n = e;
	for (let e of t) {
		if (!_(n) || !(e in n)) return;
		n = n[e];
	}
	return n;
}
function y(e, t) {
	let n = v(e, t);
	return typeof n == "string" ? n.trim() : "";
}
function b(e, t) {
	let n = v(e, t);
	return Array.isArray(n) ? n.filter((e) => typeof e == "string") : [];
}
function x(e, t, n = 0) {
	return S(e, t) ?? n;
}
function S(e, t) {
	for (let n of t) {
		let t = Number(v(e, n));
		if (Number.isFinite(t)) return t;
	}
	return null;
}
function C(e, t, n = !1) {
	for (let n of t) {
		let t = v(e, n);
		if (typeof t == "boolean") return t;
	}
	return n;
}
function w(e) {
	return Array.isArray(e) ? e.flatMap(w) : typeof e == "string" ? e.split(/[\n\r,;]/).map((e) => e.trim()).filter(Boolean) : _(e) ? Object.values(e).flatMap(w) : [];
}
function T(e, t, n) {
	let r = e;
	for (let e of t.slice(0, -1)) {
		let t = r[e];
		_(t) || (r[e] = {}), r = r[e];
	}
	r[t[t.length - 1] ?? ""] = n;
}
//#endregion
//#region src/types/wfrp4e/characteristics.ts
var E = {
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
}, D = {
	[E.Agility]: "Agility",
	[E.BallisticSkill]: "Ballistic Skill",
	[E.Dexterity]: "Dexterity",
	[E.Fellowship]: "Fellowship",
	[E.Initiative]: "Initiative",
	[E.Intelligence]: "Intelligence",
	[E.Strength]: "Strength",
	[E.Toughness]: "Toughness",
	[E.WeaponSkill]: "Weapon Skill",
	[E.Willpower]: "Willpower"
}, ee = {
	agility: E.Agility,
	"ballistic skill": E.BallisticSkill,
	dexterity: E.Dexterity,
	fellowship: E.Fellowship,
	initiative: E.Initiative,
	intelligence: E.Intelligence,
	strength: E.Strength,
	toughness: E.Toughness,
	"weapon skill": E.WeaponSkill,
	willpower: E.Willpower
};
function O(e) {
	return e in D;
}
//#endregion
//#region src/module/functions/species-item/reference-names.ts
function te(e) {
	return ne(e.name, e.specification);
}
function k(e) {
	let t = e.name.trim();
	if (!e.item) return t;
	if (!t) return te(e.item);
	if (!re(t)) {
		if (e.item.specification) return ne(t, e.item.specification);
		if (re(e.item.name) && ie(t) === ie(e.item.name)) return e.item.name.trim();
	}
	return t;
}
function ne(e, t) {
	let n = e.trim(), r = t?.trim();
	return !n || !r || A(n) ? n : `${n} (${r})`;
}
function A(e) {
	return /\(([^()]*)\)\s*$/.exec(e.trim())?.[1]?.trim() ?? "";
}
function re(e) {
	return /\([^()]*\)\s*$/.test(e.trim());
}
function ie(e) {
	return e.split("(")[0]?.trim().toLocaleLowerCase() ?? "";
}
//#endregion
//#region src/module/functions/species-item/choices.ts
function ae(e) {
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
						name: k(e),
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
function oe(e) {
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
//#region src/module/functions/species-item/system.ts
function se() {
	return {
		uuid: "",
		id: "",
		name: ""
	};
}
function ce() {
	return {
		description: { value: "" },
		gmdescription: { value: "" },
		characteristics: Object.fromEntries(Object.values(E).map((e) => [e, {
			base: 20,
			dice: 2
		}])),
		fate: 0,
		resilience: 0,
		extra: 0,
		movement: 4,
		skills: { list: [] },
		talents: {
			choices: ae([]),
			random: 0
		},
		size: "avg",
		subspeciesOf: se(),
		keys: [],
		tables: {
			talents: se(),
			eye: se(),
			hair: se(),
			career: se()
		}
	};
}
function le(e) {
	let t = {};
	for (let n of Object.values(E)) {
		let r = e.characteristics[n];
		r && r.base !== null && r.dice !== null && (t[n] = r.dice === 0 ? String(r.base) : `${r.dice}d10+${r.base}`);
	}
	return Object.keys(t).length ? t : void 0;
}
//#endregion
//#region src/module/wfrp/species-item/documents/effect-sources.ts
function ue(e) {
	if (e === void 0) return [];
	if (!Array.isArray(e)) throw Error("Species effects must be embedded Active Effects.");
	return e.map((e) => {
		if (!_(e) || typeof e._id != "string") throw Error("Species effects must have Foundry document IDs.");
		return {
			...structuredClone(e),
			_id: e._id
		};
	});
}
//#endregion
//#region src/module/wfrp/species-item/documents/adapter.ts
var de = `${e}.species`;
function fe(e) {
	return e.type === de || e.type === "species";
}
function pe(e) {
	let t = e.toObject();
	return {
		id: e.id,
		uuid: e.uuid,
		name: e.name,
		img: e.img || "icons/svg/mystery-man.svg",
		system: me(t.system),
		effects: ue(t.effects)
	};
}
function me(e) {
	if (!_(e)) throw Error("Species Item system data is missing.");
	let t = ce(), n = xe(e.characteristics), r = xe(e.talents), i = xe(r.choices), a = xe(e.tables);
	return {
		description: { value: ve(xe(e.description).value) },
		gmdescription: { value: ve(xe(e.gmdescription).value) },
		characteristics: Object.fromEntries(Object.values(E).map((e) => {
			let t = xe(n[e]);
			return [e, {
				base: _e(t.base),
				dice: _e(t.dice)
			}];
		})),
		extra: _e(e.extra),
		fate: _e(e.fate),
		movement: _e(e.movement),
		resilience: _e(e.resilience),
		keys: be(e.keys),
		size: ve(e.size) || "avg",
		skills: { list: be(xe(e.skills).list) },
		talents: {
			random: _e(r.random),
			choices: {
				structure: i.structure === void 0 ? t.talents.choices.structure : he(i.structure),
				options: ye(i.options).map((e) => {
					let t = xe(e);
					return {
						type: ve(t.type),
						id: ve(t.id),
						name: ve(t.name),
						documentId: ve(t.documentId),
						idType: ve(t.idType),
						diff: xe(t.diff),
						filters: ye(t.filters).map((e) => {
							let t = xe(e);
							return {
								path: ve(t.path),
								operation: ve(t.operation),
								value: ve(t.value)
							};
						})
					};
				}),
				script: ve(i.script)
			}
		},
		subspeciesOf: ge(e.subspeciesOf),
		tables: {
			talents: ge(a.talents),
			eye: ge(a.eye),
			hair: ge(a.hair),
			career: ge(a.career)
		}
	};
}
function he(e) {
	let t = xe(e), n = t.type;
	if (n !== "and" && n !== "or" && n !== "option") throw Error("Species Talent choice structure is invalid.");
	return {
		type: n,
		id: ve(t.id),
		...n === "option" ? {} : { options: ye(t.options).map(he) }
	};
}
function ge(e) {
	let t = xe(e);
	return {
		uuid: ve(t.uuid),
		id: ve(t.id),
		name: ve(t.name)
	};
}
function _e(e) {
	if (e == null) return null;
	if (typeof e != "number" || !Number.isFinite(e) || e < 0) throw Error("Species statistics must be non-negative numbers or empty inheritance values.");
	return e;
}
function ve(e) {
	return typeof e == "string" ? e : "";
}
function ye(e) {
	return Array.isArray(e) ? e : [];
}
function be(e) {
	return ye(e).map((e) => {
		if (typeof e != "string") throw Error("Species keys and skills must contain text values.");
		return e;
	});
}
function xe(e) {
	return _(e) ? e : {};
}
//#endregion
//#region src/module/wfrp/species-item/documents/repository.ts
function Se() {
	return (game.items?.contents ?? []).filter(fe);
}
async function Ce(e, t) {
	we();
	let n = e.toObject(), r = _(n.system) ? n.system : {};
	return await e.update({
		name: t.name,
		img: t.img,
		system: {
			...r,
			...me(t.system)
		}
	}, { recursive: !1 }), e;
}
function we() {
	if (!game.user?.isGM) throw Error("Only a GM can change world Species Items through the Customizer.");
}
//#endregion
//#region src/module/wfrp/species-item/documents/migration.ts
function Te() {
	return typeof CONFIG.Item.dataModels.species == "function";
}
async function Ee() {
	if (!Te() || !game.user?.isGM || game.users?.activeGM && game.users.activeGM.id !== game.user.id) return 0;
	let e = 0, t = game.actors.contents.flatMap((e) => e.items?.contents ?? []), n = [...Se(), ...t];
	for (let t of n.filter((e) => e.type === de)) await t.update({ type: "species" }), e += 1;
	return e;
}
//#endregion
//#region src/module/functions/species-chargen/config.ts
function De(e, t, n, r) {
	let { system: i } = t, a = {
		species: { [e]: t.name },
		speciesSkills: { [e]: [...i.skills.list] },
		speciesTalents: { [e]: oe(i.talents.choices).map((e) => e.choices.map((e) => e.name).join(", ")) }
	}, o = le(i);
	o && (a.speciesCharacteristics = { [e]: o });
	for (let [t, n] of Object.entries({
		speciesMovement: i.movement,
		speciesFate: i.fate,
		speciesRes: i.resilience,
		speciesExtra: i.extra
	})) n !== null && (a[t] = { [e]: n });
	return i.talents.random !== null && (a.speciesRandomTalents = { [e]: { [r]: i.talents.random } }), n.age !== void 0 && (a.speciesAge = { [e]: n.age }), n.height !== void 0 && (a.speciesHeight = { [e]: {
		feet: 0,
		inches: 0,
		die: n.height
	} }), a;
}
//#endregion
//#region src/module/functions/species-chargen/detail-formulas.ts
function Oe(e) {
	let t = {};
	for (let n of e) {
		if (n.disabled === !0) continue;
		let e = _(n.system) ? n.system : {}, r = _(e.transferData) ? e.transferData : {};
		if (r.type !== "document" || r.documentType !== "Actor") continue;
		let i = e.changes ?? n.changes;
		if (Array.isArray(i)) for (let e of i) {
			if (!_(e)) continue;
			let n = e.key === "flags.drowsy.ageFormula" ? "age" : e.key === "flags.drowsy.heightFormula" ? "height" : void 0;
			if (!n) continue;
			let r = e.value, i = typeof r == "string" ? r.trim() : typeof r == "number" && Number.isFinite(r) ? String(r) : "";
			if ((e.type === void 0 ? e.mode !== 5 : e.type !== "override") || !i) throw Error(`Species ${n} formula must be a nonempty Override effect change.`);
			if (t[n] !== void 0) throw Error(`Species has more than one enabled ${n} formula. Keep one provider.`);
			t[n] = i;
		}
	}
	return t;
}
//#endregion
//#region src/module/wfrp/species-item/documents/imported-references.ts
function ke(e, t) {
	let n = t.find((t) => e.uuid ? t.uuid === e.uuid : t.id === e.id);
	if (n || !e.uuid.startsWith("Compendium.")) return n;
	let r = t.filter((t) => {
		let n = t.toObject();
		return [y(n, ["_stats", "compendiumSource"]), y(n, [
			"flags",
			"core",
			"sourceId"
		])].includes(e.uuid);
	});
	if (r.length > 1) throw Error(`Multiple imported copies of ${e.name || e.uuid}; relink the reference to the intended world document.`);
	return r[0];
}
//#endregion
//#region src/module/wfrp/species-chargen/tables.ts
var Ae = /* @__PURE__ */ new Map(), je = !1;
function Me(e, t) {
	return `${e.toLowerCase()}|${t ?? ""}`;
}
function Ne() {
	if (je) return;
	let e = game.wfrp4e?.tables;
	if (!e?.findTable) throw Error("WFRP table lookup is unavailable.");
	let t = e.findTable;
	e.findTable = function(e, n) {
		return Ae.get(Me(e, n)) ?? t.call(this, e, n);
	}, je = !0;
}
async function Pe(e) {
	if (!e.uuid && !e.id) return;
	let t = ke(e, game.tables?.contents ?? []) ?? await fromUuid(e.uuid || `RollTable.${e.id}`);
	if (!_(t) || t.documentName !== "RollTable") throw Error(`Cannot resolve Species RollTable ${e.name || e.uuid || e.id}.`);
	return t;
}
function Fe(e, t, n, r, i) {
	Ne(), Ie(e), r && Ae.set(Me("eyes", e), r), i && Ae.set(Me("hair", e), i), t && Ae.set(Me("career", e), t), n && Ae.set(Me(`${e}-talents`), n);
}
function Ie(e) {
	Ae.delete(Me("eyes", e)), Ae.delete(Me("hair", e)), Ae.delete(Me("career", e)), Ae.delete(Me(`${e}-talents`));
}
//#endregion
//#region src/module/wfrp/species-chargen/config.ts
var Le = 0, Re = "customizer-chargen-";
function ze() {
	return `${Re}${++Le}`;
}
async function Be(e, t) {
	let n = game.wfrp4e?.config;
	if (!n) throw Error("WFRP species config is unavailable.");
	let { record: r } = t, i = Oe(r.effects);
	for (let [e, t] of Object.entries(i)) if (!Roll.validate(t)) throw Error(`Invalid Species ${e} formula: ${t}`);
	let [a, o, s, c] = await Promise.all([
		Pe(r.system.tables.career),
		Pe(r.system.tables.talents),
		Pe(r.system.tables.eye),
		Pe(r.system.tables.hair)
	]), l = De(e, r, i, o ? `${e}-talents` : "talents");
	Ve(e);
	for (let [t, r] of Object.entries(l)) if (_(r) && Object.hasOwn(r, e)) {
		let i = _(n[t]) ? n[t] : n[t] = {};
		i[e] = r[e];
	}
	Fe(e, a, o, s, c);
}
function Ve(e) {
	let t = game.wfrp4e?.config;
	for (let [n, r] of Object.entries(t ?? {})) (n.startsWith("species") || n === "subspecies") && _(r) && delete r[e];
	Ie(e);
}
//#endregion
//#region src/module/functions/species-item/inheritance.ts
function He(e, t) {
	oe(e.talents.choices);
	let n = structuredClone(e);
	for (let r of Object.values(E)) n.characteristics[r] = {
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
//#endregion
//#region src/module/functions/species-chargen/selection.ts
function Ue(e, t) {
	let n = structuredClone(e);
	if (!t) return n;
	n.system = He(e.system, t.system);
	for (let r of [
		"career",
		"talents",
		"eye",
		"hair"
	]) {
		let i = e.system.tables[r];
		!i.uuid && !i.id && (n.system.tables[r] = structuredClone(t.system.tables[r]));
	}
	return e.effects.length || (n.effects = structuredClone(t.effects)), n;
}
function We(e) {
	if (typeof e.documentUuid == "string" && e.documentUuid) return e.documentUuid;
	let t = typeof e.description == "string" ? e.description : "";
	return /@UUID\[([^\]]+)\]/u.exec(t)?.[1];
}
function Ge(e) {
	return e.startsWith("Item.") || e.startsWith("Compendium.") && e.includes(".Item.");
}
//#endregion
//#region src/module/functions/species-chargen/roll-bonus.ts
function Ke(e, t) {
	return [...new Set([
		e,
		y(t, ["_stats", "compendiumSource"]),
		y(t, [
			"flags",
			"core",
			"sourceId"
		])
	].filter(Ge))];
}
function qe(e, t) {
	if (!e) return 0;
	let n = e.identity?.self ?? Ke(e.uuid, e.source), r = e.identity?.parent ?? [e.record.system.subspeciesOf.uuid];
	return [...n, ...r].some((e) => e && t.includes(e)) ? 20 : 0;
}
//#endregion
//#region src/module/functions/species-item/identity.ts
function Je(e) {
	return !!(e.system.subspeciesOf.uuid || e.system.subspeciesOf.id);
}
//#endregion
//#region src/module/foundry/document-guards.ts
function Ye(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Actor";
}
function Xe(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Item";
}
function Ze(e, t = "Expected a Foundry Actor.") {
	if (!Ye(e)) throw Error(t);
	return e;
}
function Qe(e, t = "Expected a Foundry Item.") {
	if (!Xe(e)) throw Error(t);
	return e;
}
function $e(e, t, n = `Expected a Foundry ${t} Item.`) {
	let r = Qe(e, n);
	if (r.type !== t) throw Error(n);
	return r;
}
//#endregion
//#region src/module/wfrp/species-table/items.ts
function et() {
	if (!game.user?.isGM) throw Error("Only a GM can edit the world's Species table.");
}
function tt() {
	let e = game.wfrp4e?.config?.species, t = [];
	if (_(e)) for (let [n, r] of Object.entries(e)) !n.startsWith("customizer-chargen-") && typeof r == "string" && r.trim() && t.push({
		key: n,
		label: r
	});
	for (let e of Se()) t.push({
		key: `item:${e.uuid}`,
		label: e.name,
		itemUuid: e.uuid
	});
	return t.sort((e, t) => e.label.localeCompare(t.label));
}
async function nt(e) {
	let t = Se(), n = ke(e, t), r = Qe(n ?? await fromUuid(e.uuid || `Item.${e.id}`), `Species Item “${e.name || e.uuid || e.id}” is unavailable.`), i = n ?? ke({
		uuid: r.uuid,
		id: r.id,
		name: r.name
	}, t) ?? r;
	if (!fe(i)) throw Error("Drop a Species Item into this editor.");
	if (game.user && !game.user.isGM && !i.testUserPermission(game.user, "OBSERVER")) throw Error(`You do not have permission to read ${i.name}.`);
	if (!i.compendium && !Se().some((e) => e.uuid === i.uuid)) throw Error("Use a world or compendium Species Item, rather than an Item on an Actor.");
	return i;
}
async function rt(e) {
	return nt({
		uuid: e,
		id: "",
		name: ""
	});
}
async function it(e) {
	let t = await rt(e), n = pe(t);
	if (!Je(n)) return [t];
	let r = await nt(n.system.subspeciesOf);
	if (Je(pe(r))) throw Error(`${t.name}: nested or cyclic subspecies cannot be used by WFRP's current Species table.`);
	return [r, t];
}
async function at(e) {
	et();
	let t = JSON.parse(e);
	if (!_(t) || typeof t.uuid != "string") throw Error("Drop a Species Item or enter its UUID.");
	let n = await it(t.uuid), r = n[n.length - 1];
	return {
		option: {
			key: `item:${r.uuid}`,
			label: r.name,
			itemUuid: r.uuid
		},
		sources: [{
			uuid: r.uuid,
			name: r.name
		}],
		message: `Added ${r.name}. Its Species Item will be loaded when selected during character creation.`
	};
}
//#endregion
//#region src/module/wfrp/species-item/documents/actor-source.ts
function ot(e, t) {
	let n = e.toObject();
	for (let e of [
		"_id",
		"folder",
		"ownership",
		"_stats"
	]) delete n[e];
	return n.system = t.system, n.effects = t.effects, n;
}
//#endregion
//#region src/module/wfrp/species-chargen/resolve.ts
async function st(e) {
	let t = await it(e), n = t[t.length - 1], r = t.length > 1 ? pe(t[0]) : void 0, i = Ue(pe(n), r), a = ot(n, i);
	return {
		uuid: n.uuid,
		record: i,
		source: a,
		identity: {
			self: [...new Set([e, ...Ke(n.uuid, n.toObject())])],
			parent: t.length > 1 ? Ke(t[0].uuid, t[0].toObject()) : []
		}
	};
}
//#endregion
//#region src/module/wfrp/species-chargen/session.ts
var ct = class {
	app;
	key = ze();
	selection;
	busy = !1;
	closed = !1;
	ready;
	constructor(e) {
		this.app = e, this.ready = this.restore();
	}
	assertUnlocked() {
		if (this.app.stages.some((e) => e.key !== "species" && (e.app || e.complete))) throw Error("Species is locked after another stage has started. Start a new character to change species.");
	}
	async select(e) {
		this.assertUnlocked();
		let t = await st(e);
		if (!this.closed) {
			if (await Be(this.key, t), this.closed) {
				Ve(this.key);
				return;
			}
			this.selection = t;
		}
	}
	useLegacy() {
		this.assertUnlocked(), this.selection = void 0, Ve(this.key);
	}
	commit() {
		let e = this.app.data;
		this.selection ? (e.customizerSpecies = {
			...e.customizerSpecies,
			selection: this.selection
		}, e.items.species = [new Item(structuredClone(this.selection.source))], e.misc["system.details.species.value"] = this.selection.record.name, e.misc["system.details.species.subspecies"] = "") : (delete e.customizerSpecies?.selection, delete e.items.species, delete e.misc["system.details.species.value"], delete e.misc["system.details.species.subspecies"]);
	}
	dispose() {
		this.closed = !0, Ve(this.key);
	}
	async restore() {
		let e = this.app.data.customizerSpecies?.selection;
		if (e === void 0) return;
		if (!_(e) || typeof e.uuid != "string" || !_(e.source)) throw Error("The saved Species selection is invalid. Start a new character.");
		let t = e.source;
		if (t.type !== de && t.type !== "species") throw Error("The saved chargen Item is not a Species Item.");
		let n = {
			uuid: e.uuid,
			source: t,
			..._(e.identity) ? { identity: {
				self: b(e.identity, ["self"]),
				parent: b(e.identity, ["parent"])
			} } : {},
			record: {
				id: e.uuid.split(".").at(-1),
				uuid: e.uuid,
				name: String(t.name ?? "Species"),
				img: String(t.img ?? ""),
				system: me(t.system),
				effects: ue(t.effects)
			}
		};
		if (await Be(this.key, n), this.closed) return this.dispose();
		this.selection = n, this.app.data.species = this.key, this.app.data.subspecies = "", this.commit();
	}
};
//#endregion
//#region src/module/foundry/application-element.ts
function lt(e) {
	let t = e instanceof HTMLElement ? e : _(e) ? e[0] : void 0;
	return t instanceof HTMLElement ? t : void 0;
}
//#endregion
//#region src/module/functions/species-chargen/preview.ts
function ut(e) {
	let { system: t } = e;
	return {
		characteristics: le(t),
		movement: t.movement ?? void 0,
		fate: t.fate ?? void 0,
		resilience: t.resilience ?? void 0,
		extra: t.extra ?? void 0,
		skills: t.skills.list.map(dt),
		talents: oe(t.talents.choices).map((e) => e.choices.map((e) => dt(e.name)).join(" or ")),
		randomTalents: [{
			name: e.system.tables.talents.name || "Talents",
			count: e.system.talents.random ?? 0
		}]
	};
}
function dt(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
//#endregion
//#region src/module/wfrp/species-chargen/table-policy.ts
function ft(e) {
	return e.type === "document" && typeof e.documentUuid == "string" && e.documentUuid ? e.documentUuid : void 0;
}
function pt() {
	return game.wfrp4e?.tables?.findTable?.("species");
}
async function mt(e) {
	let t = {}, n = (e) => ({
		valid: !1,
		choices: {},
		reason: e
	});
	if (!_(e) || e.documentName !== "RollTable" || typeof e.toObject != "function") return n("No usable Species table is configured.");
	let r = e.toObject(), i = _(r) ? r.results : void 0;
	if (!Array.isArray(i) || !i.length) return n("The Species table is empty.");
	for (let e of i) {
		let r = _(e) ? ft(e) : void 0;
		if (!r) return n("Every Species table result must be a Species Item document result.");
		try {
			let e = await fromUuid(r);
			if (!Xe(e) || !fe(e) || e.actor) return n("Every Species table result must link a world or compendium Species Item.");
			if (game.user && !game.user.isGM && !e.testUserPermission(game.user, "OBSERVER")) return n("A Species table Item is not readable by this user.");
			t[`item:${r}`] = e.name;
		} catch {
			return n("A Species table Item could not be resolved.");
		}
	}
	return {
		valid: !0,
		choices: t,
		reason: ""
	};
}
async function ht() {
	return mt(pt());
}
//#endregion
//#region src/module/wfrp/species-chargen/choices.ts
var gt = ft;
async function _t() {
	let e = pt(), t = await ht();
	if (!t.valid) throw Error(t.reason);
	if (pt() !== e) throw Error("The Species table changed. Try again.");
	let n = game.wfrp4e?.tables;
	if (!n?.rollTable) throw Error("WFRP Species table rolling is unavailable.");
	let r = await n.rollTable("species");
	if (!_(r) || !_(r.object)) throw Error("The Species table did not return a result.");
	let i = ft(r.object);
	if (!i || !t.choices[`item:${i}`]) throw Error("The rolled result is not one of the table's Species Items.");
	return r;
}
//#endregion
//#region src/module/functions/species-table/source.ts
var vt = "managedSpeciesTable";
function yt() {
	return {
		isRegistered: !1,
		name: "Species",
		ownership: "new",
		requiresLinkRepair: !1,
		rows: []
	};
}
function bt(e, t, n) {
	if (e.rows.length === 0) return n ? ["Add at least one species before saving or registering this table."] : [];
	let r = new Set(t.map((e) => e.key)), i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = [];
	return e.rows.forEach((e, t) => {
		let n = t + 1;
		if (!e.speciesKey || !r.has(e.speciesKey)) {
			let t = e.name.trim() ? ` “${e.name.trim()}”` : "";
			o.push(`Row ${n}${t} must be assigned to a known WFRP species.`);
		} else i.has(e.speciesKey) ? o.push(`Row ${n} repeats species “${e.name}”.`) : i.add(e.speciesKey);
		let s = e.name.trim().toLocaleLowerCase();
		!e.speciesKey.startsWith("item:") && s && a.has(s) ? o.push(`Row ${n} repeats species name "${e.name.trim()}".`) : !e.speciesKey.startsWith("item:") && s && a.add(s), /[{}]/u.test(e.name) && o.push(`Row ${n} has a species name containing { or }, which WFRP cannot parse.`), (!Number.isInteger(e.weight) || e.weight < 1) && o.push(`Row ${n} needs a whole-number weight of at least 1.`);
	}), o;
}
function xt(e) {
	let t = e.map((e) => Number.isInteger(e.weight) && e.weight > 0 ? e.weight : 0), n = t.reduce((e, t) => e + t, 0), r = 1;
	return t.map((e) => {
		let t = r, i = e > 0 ? t + e - 1 : t;
		return r = i + 1, {
			chance: n > 0 ? e / n : 0,
			range: [t, i]
		};
	});
}
function St(e, t, n) {
	let r = n.find((e) => e.label === t.trim());
	if (r) return r.key;
	let i = e.trim();
	return n.some((e) => e.key === i) ? i : "";
}
function Ct(e) {
	let t = /@UUID\[([^\]]+)\]\{([^}]*)\}/u.exec(e), n = t?.[1]?.trim() ?? "", r = t?.[2]?.trim() ?? "";
	return n && r ? {
		label: r,
		uuid: n
	} : void 0;
}
function wt(e) {
	let t = v(e, ["range"]), n = Array.isArray(t) ? Number(t[0]) : 0, r = Array.isArray(t) ? Number(t[1]) : 0;
	if (Number.isInteger(n) && Number.isInteger(r) && r >= n) return r - n + 1;
	let i = Number(v(e, ["weight"]));
	return Number.isInteger(i) && i > 0 ? i : 1;
}
function Tt(e, t) {
	let n = xt(e.rows), r = e.rows.reduce((e, t) => e + (Number.isInteger(t.weight) && t.weight > 0 ? t.weight : 0), 0);
	return {
		displayRoll: !0,
		flags: {
			wfrp4e: { key: "species" },
			[t]: { [vt]: !0 }
		},
		formula: `1d${Math.max(r, 1)}`,
		img: "systems/wfrp4e/ui/buttons/d10.webp",
		name: Dt(e),
		replacement: !0,
		results: e.rows.map((e, t) => ({
			description: Et(e),
			drawn: !1,
			flags: { wfrp4e: { species: e.speciesKey } },
			img: "icons/svg/d20-grey.svg",
			name: e.name,
			range: n[t]?.range ?? [1, 1],
			...e.speciesKey.startsWith("item:") ? {
				type: "document",
				documentUuid: e.journalUuid
			} : { type: "text" },
			weight: e.weight
		}))
	};
}
function Et(e) {
	let t = e.journalUuid?.trim() ?? "", n = e.name.trim();
	if (!t) throw Error(`Species "${n || e.speciesKey}" does not have a document link target.`);
	if (/[{}]/u.test(n)) throw Error(`Species "${n}" cannot be encoded in WFRP's UUID-link label.`);
	return `@UUID[${t}]{${n}}`;
}
function Dt(e) {
	let t = e.name.trim() || "Species";
	return e.ownership === "external" && !t.endsWith("(Customizer)") ? `${t} (Customizer)` : t;
}
//#endregion
//#region src/module/foundry/roll-table-results.ts
async function Ot(e, t) {
	t.updates.length > 0 && await e.updateEmbeddedDocuments("TableResult", t.updates), t.creates.length > 0 && await e.createEmbeddedDocuments("TableResult", t.creates), t.deletedIds.length > 0 && await e.deleteEmbeddedDocuments("TableResult", t.deletedIds);
}
//#endregion
//#region src/module/wfrp/species-table/documents/journals.ts
var kt = "generatedSpeciesJournal", At = "WFRP Customizer Species Journals";
async function jt(t) {
	let n = game.journal?.contents ?? [], r = Mt(n), i, a = [];
	for (let o of t.rows) {
		let t = Nt(o.journalUuid, o.speciesKey, n) || r.get(o.speciesKey)?.uuid;
		if (!t) {
			i ??= await Ft();
			let n = await JournalEntry.create({
				flags: { [e]: { [kt]: { speciesKey: o.speciesKey } } },
				folder: i.id,
				name: o.name.trim(),
				pages: []
			});
			if (!n) throw Error(`Foundry did not create the Journal Entry for species "${o.name}".`);
			r.set(o.speciesKey, n), t = n.uuid;
		}
		a.push({
			...o,
			journalUuid: t
		});
	}
	return {
		...t,
		requiresLinkRepair: !1,
		rows: a
	};
}
function Mt(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = Pt(n);
		if (e) {
			if (t.has(e)) throw Error(`Multiple Species Builder Journals exist for "${e}". Remove the duplicate and retry.`);
			t.set(e, n);
		}
	}
	return t;
}
function Nt(e, t, n) {
	let r = e?.trim() ?? "";
	if (!r) return "";
	let i = n.find((e) => e.uuid === r);
	if (!i) return r.startsWith("JournalEntry.") && r.split(".").length === 2 ? "" : r;
	let a = Pt(i);
	return a && a !== t ? "" : r;
}
function Pt(t) {
	let n = t.getFlag(e, kt);
	return _(n) ? y(n, ["speciesKey"]).trim() : "";
}
async function Ft() {
	let e = game.folders.contents.find((e) => e.type === "JournalEntry" && e.name === At);
	if (e) return e;
	let t = await Folder.create({
		name: At,
		type: "JournalEntry"
	});
	if (!t) throw Error("Foundry did not create the generated Species Journal folder.");
	return t;
}
//#endregion
//#region src/module/wfrp/species-table/documents/persistence.ts
var It = "species", Lt = "tableSettings";
async function Rt(t) {
	let n = await jt(t), r = Tt(n, e);
	return t.ownership === "managed" ? await Ht(n, r) : await Vt(n, r);
}
async function zt(e) {
	let t = game.settings.get(n, Lt);
	if (!_(t)) throw Error("WFRP table settings are unavailable; the Species table was not registered.");
	await game.settings.set(n, Lt, {
		...t,
		[It]: e
	});
}
function Bt(t) {
	return t.getFlag(e, vt) === !0;
}
async function Vt(e, t) {
	if (e.ownership === "external") {
		let t = e.tableId ? game.tables?.get(e.tableId) : void 0;
		if (!t || Bt(t)) throw Error("The source Species table changed. Reload before saving a managed copy.");
	}
	if ((game.tables?.contents ?? []).some(Bt)) throw Error("A managed Species table already exists. Reload before saving.");
	let n = await RollTable.create(t);
	if (!n) throw Error("Foundry did not create the managed Species table.");
	return n;
}
async function Ht(t, r) {
	let i = t.tableId ? game.tables?.get(t.tableId) : void 0;
	if (!i || !Bt(i)) throw Error("The managed Species table changed. Reload before saving again.");
	let a = Array.isArray(r.results) ? r.results.filter(_) : [];
	return await i.update({
		displayRoll: r.displayRoll,
		[`flags.${e}.${vt}`]: !0,
		[`flags.${n}.key`]: It,
		formula: r.formula,
		name: r.name,
		replacement: r.replacement
	}), await Ut(i, t.rows, a), i;
}
async function Ut(e, t, n) {
	let r = e.toObject(), i = Array.isArray(r.results) ? r.results.filter(_) : [], a = new Set(i.map((e) => y(e, ["_id"]))), o = /* @__PURE__ */ new Set(), s = [], c = [];
	n.forEach((e, n) => {
		let r = Wt(t[n], i, a, o);
		r ? (o.add(r), s.push({
			...e,
			_id: r
		})) : c.push(e);
	}), await Ot(e, {
		creates: c,
		deletedIds: [...a].filter((e) => e && !o.has(e)),
		updates: s
	});
}
function Wt(e, t, n, r) {
	if (e?.resultId && n.has(e.resultId) && !r.has(e.resultId)) return e.resultId;
	let i = t.find((t) => y(t, [
		"flags",
		"wfrp4e",
		"species"
	]) === e?.speciesKey && !r.has(y(t, ["_id"])));
	return i ? y(i, ["_id"]) : "";
}
//#endregion
//#region src/module/wfrp/species-chargen/default-table.ts
var Gt = "Compendium.wfrp4e-customizer-apps.species-tables.RollTable.a341d269e7805bc2";
async function Kt() {
	if (!game.user?.isGM) throw Error("Only a GM can change the configured Species table.");
	if ((await ht()).valid) return;
	let e;
	for (let t of game.tables?.contents ?? []) {
		let n = t.toObject(), r = y(n, ["_stats", "compendiumSource"]), i = y(n, [
			"flags",
			"core",
			"sourceId"
		]);
		if (!(r !== "Compendium.wfrp4e-customizer-apps.species-tables.RollTable.a341d269e7805bc2" && i !== "Compendium.wfrp4e-customizer-apps.species-tables.RollTable.a341d269e7805bc2") && (await mt(t)).valid) {
			e = t;
			break;
		}
	}
	if (!e) {
		let t = await fromUuid(Gt), n = await mt(t);
		if (!n.valid || !_(t) || typeof t.toObject != "function") throw Error(`The default Species table is unavailable or invalid. ${n.reason}`);
		let r = t.toObject();
		if (!_(r)) throw Error("The default Species table has no source data.");
		for (let e of [
			"_id",
			"folder",
			"_stats"
		]) delete r[e];
		if (r._stats = { compendiumSource: Gt }, e = await RollTable.create(r) ?? void 0, !e) throw Error("Foundry could not import the default Species table.");
	}
	await zt(e.id);
}
//#endregion
//#region src/module/wfrp/species-chargen/table-reminder.ts
var qt = "hideInvalidSpeciesTableReminder", Jt = !1, Yt;
function Xt() {
	game.settings.register(e, qt, {
		name: "Hide invalid Species table reminder",
		scope: "client",
		config: !0,
		type: Boolean,
		default: !1
	});
}
function Zt() {
	return Yt || (!game.user?.isGM || Te() || Jt || game.settings.get("wfrp4e-customizer-apps", "hideInvalidSpeciesTableReminder") === !0 || game.users?.activeGM && game.users.activeGM.id !== game.user.id ? Promise.resolve(!1) : (Yt = Qt().catch((e) => (ui.notifications?.error(e instanceof Error ? e.message : String(e)), !1)).finally(() => {
		Yt = void 0;
	}), Yt));
}
async function Qt() {
	if ((await ht()).valid) return !1;
	Jt = !0;
	let t = null, n = await foundry.applications.api.DialogV2.wait({
		window: { title: "Species table needs Species Items" },
		content: "<p>Character creation requires a Species table whose results are all Species Items. The current table cannot be used for species rolls.</p><p>Use the supplied default table? It has Human 90%, Halfling 4%, Dwarf 4%, High Elf 1%, and Wood Elf 1%. Your current table will be kept.</p><label><input type=\"checkbox\" name=\"suppress\"> Don’t show this reminder again</label>",
		buttons: [{
			action: "replace",
			label: "Use Default Table",
			callback: (e, t) => $t(!0, t.form)
		}, {
			action: "later",
			label: "Not Now",
			default: !0,
			callback: (e, t) => $t(!1, t.form)
		}],
		render: (e, n) => {
			t = n.element.querySelector("form");
		},
		close: () => $t(!1, t),
		rejectClose: !1
	});
	return n?.suppress && await game.settings.set(e, qt, !0), n?.replace ? (await Kt(), ui.notifications?.info("Character creation now uses a Species Item table."), !0) : !1;
}
function $t(e, t) {
	return {
		replace: e,
		suppress: t?.querySelector("[name=\"suppress\"]")?.checked === !0
	};
}
//#endregion
//#region src/module/wfrp/species-chargen/stage.ts
function en(e, t) {
	return class extends e {
		tableValid = !1;
		tableReason = "";
		reminderStarted = !1;
		constructor(e, t) {
			super(e, t);
			let n = !!e.customizerSpecies?.selection;
			this.context.species = n ? e.species ?? "" : "", this.context.subspecies = "", this.context.exp = n ? e.exp.species ?? 0 : 0, this.context.roll = e.customizerSpecies?.roll;
		}
		async getData() {
			await t.ready, this.refreshBonus();
			let e = await ht();
			this.tableValid = e.valid, this.tableReason = e.reason, !e.valid && !this.reminderStarted && (this.reminderStarted = !0, Zt().then((e) => {
				e && !t.closed && this.render(!0);
			}));
			let n = t.selection?.record;
			return {
				data: this.data,
				context: this.context,
				species: e.choices,
				speciesDisplay: n?.name ?? "",
				...n ? { preview: ut(n) } : {}
			};
		}
		activateListeners(e) {
			super.activateListeners(e);
			let t = lt(e);
			if (!t) return;
			if (!this.tableValid) {
				t.querySelector("[data-button=\"onRollSpecies\"]")?.remove();
				let e = document.createElement("p");
				e.textContent = `${this.tableReason} Species rolls are unavailable; you can still drop a Species Item.`, t.querySelector(".select-species")?.append(e);
			}
			let n = document.createElement("p");
			n.textContent = "Drop a Species Item here to choose it. Returning to your rolled species or choosing its subspecies restores the 20 XP bonus. The Item and its effects will be added to your character.", t.querySelector(".chargen-content")?.prepend(n), t.addEventListener("dragover", (e) => e.preventDefault()), t.addEventListener("drop", (e) => {
				e.preventDefault(), e.stopPropagation(), this.runSelection(async () => {
					let t = JSON.parse(e.dataTransfer?.getData("text/plain") || "{}");
					if (!_(t) || typeof t.uuid != "string") throw Error("Drop a world or compendium Species Item.");
					await this.chooseItem(t.uuid);
				});
			});
		}
		async selectSpeciesItem(e) {
			await this.runSelection(() => this.chooseItem(e));
		}
		async chooseItem(e) {
			await t.select(e), !t.closed && (this.refreshBonus(), this.context.choose = t.key, this.setSpecies(t.key), this.updateMessage("Chosen", { chosen: t.selection.record.name }));
		}
		async onSelectSpecies(e) {
			let t = e.currentTarget.dataset.species ?? "";
			await this.runSelection(async () => {
				let e = await ht();
				if (!e.valid || !e.choices[t]) throw Error(e.reason || "Choose a Species Item from the current table.");
				await this.chooseItem(t.slice(5));
			});
		}
		async onRollSpecies(e) {
			e.stopPropagation(), await this.runSelection(async () => {
				if (t.assertUnlocked(), this.context.roll) throw Error("Species has already been rolled for this character.");
				let e = await _t();
				this.context.roll = e;
				let n = gt(e.object);
				if (!n) throw Error("The rolled result must be a Species Item.");
				this.data.customizerSpecies = {
					...this.data.customizerSpecies,
					roll: e,
					rollIdentity: [n]
				}, await t.select(n), !t.closed && (this.data.customizerSpecies.rollIdentity = t.selection.identity.self, this.context.exp = 20, this.context.choose = !1, this.setSpecies(t.key), this.updateMessage("Rolled", { rolled: e.name }));
			});
		}
		onSelectSubspecies() {
			ui.notifications?.warn?.("Choose or drop the subspecies' own Species Item.");
		}
		async validate() {
			return t.busy ? (ui.notifications?.warn?.("Wait for the Species Item to finish loading."), !1) : !t.selection || this.context.species !== t.key ? (ui.notifications?.warn?.("Choose or drop a Species Item before continuing."), !1) : super.validate();
		}
		_updateObject(e, n) {
			if (!t.selection || this.context.species !== t.key) throw Error("A Species Item must be selected before submitting this stage.");
			this.refreshBonus(), t.commit(), this.data.customizerSpecies = {
				...this.data.customizerSpecies,
				roll: this.context.roll
			}, super._updateObject(e, n);
		}
		refreshBonus() {
			let e = this.context.roll?.object, n = _(e) ? gt(e) : void 0, r = this.data.customizerSpecies?.rollIdentity ?? (n ? [n] : []);
			this.context.exp = this.context.roll ? qe(t.selection, r) : 0;
		}
		async runSelection(e) {
			if (!(t.busy || t.closed)) {
				t.busy = !0;
				try {
					await t.ready, await e();
				} catch (e) {
					ui.notifications?.error(e instanceof Error ? e.message : String(e));
				} finally {
					t.busy = !1, t.closed || this.render(!0);
				}
			}
		}
	};
}
//#endregion
//#region src/module/wfrp/species-chargen/details.ts
var tn = [
	"rollName",
	"rollAge",
	"rollHeight",
	"rollEyes",
	"rollHair",
	"rollMotivation"
];
function nn(e, t) {
	if (!e.selection) return;
	let n = e.selection.record.system.keys;
	return (t === "rollName" ? n : [e.key, ...n]).find((e) => {
		if (t === "rollName") {
			let t = game.wfrp4e?.names?.[e];
			return _(t) && typeof t.forename == "function" && typeof t.surname == "function";
		}
		let n = game.wfrp4e?.config?.[t === "rollAge" ? "speciesAge" : "speciesHeight"], r = _(n) ? n[e] : void 0;
		return t === "rollAge" ? typeof r == "string" && !!r.trim() : _(r) && typeof r.die == "string" && typeof r.feet == "number" && typeof r.inches == "number";
	});
}
function rn(e, t) {
	return class extends e {
		generatorContext(e) {
			let n = nn(t, e);
			if (!n) throw Error("This Species has no generator for this detail. Enter it manually.");
			return Object.assign(Object.create(this), { data: {
				...this.data,
				species: n
			} });
		}
		rollName() {
			return super.rollName.call(this.generatorContext("rollName"));
		}
		rollAge() {
			return super.rollAge.call(this.generatorContext("rollAge"));
		}
		rollHeight() {
			return super.rollHeight.call(this.generatorContext("rollHeight"));
		}
		async rollDetailTable(e, t) {
			let n = game.wfrp4e?.tables;
			if (!n?.findTable?.(e, t)) throw Error("No table is available for this detail.");
			let r = await n.rollTable?.(e, {}, t), i = _(r) ? [r.text, r.name].find((e) => typeof e == "string" && e.trim()) : void 0;
			if (typeof i != "string") throw Error("The details table returned no result. Your current entry was kept.");
			return i;
		}
		rollEyes() {
			return this.rollDetailTable("eyes", t.key);
		}
		rollHair() {
			return this.rollDetailTable("hair", t.key);
		}
		rollMotivation() {
			return this.rollDetailTable("motivation");
		}
		activateListeners(e) {
			super.activateListeners(e);
			let n = lt(e);
			if (!n) return;
			let r = !1;
			for (let e of tn) {
				let i = n.querySelector(`[data-type="${e}"]`);
				if (i) {
					if (!(e === "rollName" || e === "rollAge" || e === "rollHeight" ? nn(t, e) : e === "rollMotivation" || t.selection?.record.system.tables[e === "rollEyes" ? "eye" : "hair"].uuid || t.selection?.record.system.tables[e === "rollEyes" ? "eye" : "hair"].id)) {
						i.remove(), r = !0;
						continue;
					}
					i.addEventListener("click", (t) => {
						t.preventDefault(), t.stopImmediatePropagation(), Promise.resolve().then(async () => await this[e]()).then((e) => {
							let t = i.closest(".detail-form")?.querySelector("input");
							t && (t.value = String(e));
						}).catch((e) => {
							ui.notifications?.error(e instanceof Error ? e.message : String(e));
						});
					}, { capture: !0 });
				}
			}
			if (r) {
				let e = document.createElement("p");
				e.textContent = "Enter details manually where this Species has no generator. Check its description for any age or height guidance.", n.querySelector(".chargen-content")?.prepend(e);
			}
		}
	};
}
//#endregion
//#region src/module/wfrp/species-chargen/index.ts
var an = /* @__PURE__ */ new WeakMap();
function on() {
	Hooks.on("wfrp4e:chargen", (e) => {
		Te() || sn(e);
	});
}
function sn(e) {
	if (Te()) throw Error("The legacy Species bridge is disabled when native Species support is available.");
	if (!_(e) || !Array.isArray(e.stages) || !_(e.data) || typeof e.getData != "function" || typeof e.close != "function") throw Error("WFRP character generation has an unsupported application shape.");
	let t = e, n = t.stages.find((e) => e.key === "species");
	if (!n || typeof n.class != "function") throw Error("WFRP's Species stage is unavailable.");
	if (an.has(t)) return;
	let r = new ct(t);
	an.set(t, r), n.class = en(n.class, r);
	let i = t.stages.find((e) => e.key === "details");
	i && (i.class = rn(i.class, r));
	let a = t.getData;
	t.getData = async function() {
		return await r.ready, a.call(this);
	};
	let o = !1;
	r.ready.then(() => {
		o = !0;
	}).catch((e) => {
		ui.notifications?.error(`Could not restore Species: ${e instanceof Error ? e.message : String(e)}`);
	});
	let s = t.canStartStage;
	t.canStartStage = function(e) {
		return o && !r.busy && s.call(this, e);
	};
	let c = t.close;
	t.close = async function() {
		r.dispose();
		for (let e of this.stages) await e.app?.close();
		return c.call(this);
	};
}
async function cn(e, t) {
	sn(e);
	let n = e;
	await an.get(n).ready;
	let r = n.stages.findIndex((e) => e.key === "species"), i = n.stages[r];
	i.app ??= new i.class(n.data, {
		complete: n.complete.bind(n),
		index: r
	});
	let a = i.app;
	await a.selectSpeciesItem(t), a.render(!0);
}
//#endregion
//#region src/module/functions/species-item/actor-profile.ts
function ln(e) {
	let t = {};
	for (let [n, r] of Object.entries(e.characteristics)) r.base !== null && r.dice !== null && (t[`system.characteristics.${n}.initial`] = r.base + r.dice * 5);
	return e.movement !== null && (t["system.details.move.value"] = e.movement), t;
}
function un(e, t) {
	let n = Object.entries(e.characteristics).filter(([e, n]) => e in t && n.base !== null && n.dice !== null), r = ln(e), i = n.every(([e]) => t[e] === r[`system.characteristics.${e}.initial`]), a = {};
	for (let [e, r] of n) {
		if (!(e in t) || !i && t[e] === 0) continue;
		let n = r.dice, o = n === 0 ? "0" : `${n}d10`, s = i ? "initial" : "modifier";
		a[`system.characteristics.${e}.${s}`] = i ? `${o}+${r.base}` : `${o}-${n * 5}`;
	}
	return a;
}
//#endregion
//#region src/module/wfrp/species-item/actor/profile.ts
function dn(e) {
	let t = e.toObject().system, n = _(t) ? t.characteristics : void 0;
	if (!_(n)) throw Error("This Actor has no characteristics.");
	let r = {};
	for (let [e, t] of Object.entries(n)) _(t) && typeof t.initial == "number" && (r[e] = t.initial);
	return r;
}
function fn(e, t) {
	let n = ln(t), r = dn(e);
	for (let e of Object.keys(t.characteristics)) e in r || delete n[`system.characteristics.${e}.initial`];
	if (e.type === "vehicle" && t.movement !== null) {
		let r = e.toObject().system, i = _(r) ? r.details : void 0, a = _(i) ? i.move : void 0;
		if (!_(a)) throw Error("This Vehicle has no Movement data.");
		let o = a.custom, s = _(o) && o.label && o.value ? "custom" : a.primary;
		if (s !== "custom" && s !== "sail" && s !== "oars") throw Error("This Vehicle has no active Movement mode.");
		delete n["system.details.move.value"], n[`system.details.move.${s}.value`] = t.movement;
	}
	return n;
}
//#endregion
//#region src/module/wfrp/species-item/actor/owned.ts
function pn(e) {
	return e.items?.contents.find(fe);
}
async function mn(e) {
	let t = pe(e);
	if (e.actor || !Je(t)) return t;
	let n = pe(await nt(t.system.subspeciesOf));
	if (Je(n)) throw Error("Nested Species parents are not supported.");
	return Ue(t, n);
}
//#endregion
//#region src/module/wfrp/species-item/actor/drop.ts
var hn = /* @__PURE__ */ new WeakSet();
async function gn(e, t) {
	if (!e.isOwner) throw Error("You cannot change this Actor's Species.");
	if (!e.items?.contents.some((e) => e.uuid === t.uuid) && !hn.has(e)) {
		if (pn(e)) throw Error("Remove the Actor's existing Species Item before dropping another Species.");
		hn.add(e);
		try {
			if (game.user && !t.testUserPermission(game.user, "OBSERVER")) throw Error(`You do not have permission to read ${t.name}.`);
			let n = await mn(t), r = ot(t, n), i = await e.createEmbeddedDocuments("Item", [r]);
			return i.length ? (await foundry.applications.api.DialogV2.confirm({
				window: { title: "Apply Species Characteristics" },
				content: "<p>Apply this Species Item's starting characteristics and Movement?</p><p>This replaces initial characteristic values and Movement. Advances and modifiers are kept. Choosing No keeps your current profile; the Species Item and its effects remain on the Actor.</p>",
				rejectClose: !1
			}) && e.items?.contents.includes(i[0]) && await e.update(fn(e, n.system)), i) : void 0;
		} finally {
			hn.delete(e);
		}
	}
}
//#endregion
//#region src/module/wfrp/species-item/actor/grant.ts
async function _n(e, t) {
	let n = game.wfrp4e?.utility, r = t === "skill" ? await n?.findSkill?.(e) : await n?.findTalent?.(e);
	if (!r || r.type !== t) throw Error(`Cannot find ${t} “${e}”.`);
	return r;
}
//#endregion
//#region src/module/wfrp/species-item/actor/talent-table.ts
async function vn(e) {
	let t = await Pe(e) ?? game.wfrp4e?.tables?.findTable?.("talents");
	if (!_(t) || typeof t.roll != "function") throw Error("The Species random Talent table is unavailable.");
	let n = await t.roll({ recursive: !0 }), r = _(n) ? n.results : void 0;
	if (!Array.isArray(r) || r.length !== 1) throw Error("The Species Talent table must return one Talent per roll.");
	let i = r[0];
	if (!_(i) || typeof i.toObject != "function") throw Error("The Species Talent table returned an invalid result.");
	let a = i.toObject();
	if (!_(a)) throw Error("The Species Talent result has no data.");
	let o = We(a), s = a.name;
	if (!o && (typeof s != "string" || !s.trim())) throw Error("The Species Talent result has no Item link or Talent name.");
	let c = o ? Qe(await fromUuid(o), "The rolled Talent Item is unavailable.") : await _n(s, "talent");
	if (c.type !== "talent") throw Error("The Species Talent table result is not a Talent.");
	return c;
}
//#endregion
//#region src/module/wfrp/species-item/actor/randomize.ts
async function yn(e, t, n) {
	if (!e.isOwner) throw Error("You cannot change this Actor.");
	let { system: r } = pe(t);
	n === "characteristics" ? await bn(e, r) : n === "skills" ? await xn(e, r) : n === "talents" && await Sn(e, r);
}
async function bn(e, t) {
	let n = un(t, dn(e)), r = {};
	for (let [e, t] of Object.entries(n)) r[e] = await Cn(t);
	await e.update(r);
}
async function xn(e, t) {
	let n = [...new Set(t.skills.list.filter((e) => e.trim()))];
	if (!n.length) throw Error("This Species Item has no Skills.");
	let r = [];
	for (; r.length < 6 && n.length;) {
		let e = await Cn(`1d${n.length}-1`);
		r.push(n.splice(e, 1)[0]);
	}
	let i = [];
	for (let [t, n] of r.entries()) {
		let r = (e.items?.contents.find((e) => e.type === "skill" && e.name === n) ?? await _n(n, "skill")).toObject(), a = r.system;
		if (!_(a) || !_(a.advances)) throw Error(`Skill ${n} has no advances data.`);
		let o = a.advances.value;
		if (typeof o != "number") throw Error(`Skill ${n} has invalid advances.`);
		a.advances.value = Math.max(o, t < 3 ? 5 : 3), i.push(r);
	}
	await e.update({ items: i });
}
async function Sn(e, t) {
	let n = oe(t.talents.choices), r = [];
	for (let e of n) {
		let t = e.choices[await Cn(`1d${e.choices.length}-1`)], n = t.item?.uuid ? Qe(await fromUuid(t.item.uuid), `Talent ${t.name} is unavailable.`) : await _n(t.name, "talent");
		if (n.type !== "talent") throw Error(`${t.name} is not a Talent.`);
		r.push(n.toObject());
	}
	for (let e = 0; e < (t.talents.random ?? 0); e++) r.push((await vn(t.tables.talents)).toObject());
	if (!r.length) throw Error("This Species Item has no Talents.");
	await e.createEmbeddedDocuments("Item", r);
}
async function Cn(e) {
	return (await new Roll(e).roll({ allowInteractive: !1 })).total;
}
//#endregion
//#region src/module/wfrp/species-item/actor/integration.ts
var wn = /* @__PURE__ */ new WeakSet();
function Tn(e) {
	let t = Object.getOwnPropertyDescriptor(e, "Species");
	if (!t?.get) throw Error("WFRP Actor Species getter is unavailable.");
	let n = t.get;
	Object.defineProperty(e, "Species", {
		...t,
		get() {
			return pn(this)?.name ?? n.call(this);
		}
	});
}
function En(e, t) {
	if (!_(e) || !Ye(e.document) || !_(e.options) || !_(e.options.actions) || typeof e._onDropItem != "function") return;
	let n = e;
	if (wn.has(n) || (Dn(n), wn.add(n)), !(t instanceof HTMLElement)) return;
	let r = t.querySelector("[data-action='editSpecies']"), i = pn(n.document);
	r && (r.readOnly = !!i), r && i && (r.value = i.name, r.readOnly = !0, r.title = "Species comes from the owned Item. Open it from the sheet header menu to edit.");
}
function Dn(e) {
	let t = e._onDropItem;
	e._onDropItem = async function(e, n) {
		if (!_(e) || typeof e.uuid != "string") return t.call(this, e, n);
		try {
			let t = await fromUuid(e.uuid);
			if (Xe(t) && fe(t)) return await gn(this.document, t);
		} catch (e) {
			On(e);
			return;
		}
		return t.call(this, e, n);
	};
	let n = e.options.actions.randomize;
	typeof n == "function" && (e.options.actions.randomize = async function(e, t) {
		let r = pn(this.document);
		if (!r) return n.call(this, e, t);
		let i = t ?? e.target;
		if (i instanceof HTMLElement) try {
			await yn(this.document, r, i.dataset.type ?? "");
		} catch (e) {
			On(e);
		}
	});
}
function On(e) {
	ui.notifications?.error(e instanceof Error ? e.message : String(e));
}
//#endregion
//#region src/module/wfrp/species-item/actor-sheet.ts
function kn() {
	Te() || (Hooks.once("setup", () => {
		let e = game.wfrp4e;
		Tn(e.documents.ActorWFRP4e.prototype);
	}), Hooks.on("renderApplicationV2", En));
	for (let e of [
		"Character",
		"NPC",
		"Creature",
		"Vehicle"
	]) Hooks.on(`getHeaderControlsActorSheetWFRP4e${e}`, (e, t) => {
		if (!_(e) || !Array.isArray(t)) return;
		let n = e.document;
		if (!Ye(n)) return;
		let r = e.options;
		if (!(!_(r) || !_(r.actions))) for (let e of n.items?.contents.filter(fe) ?? []) {
			let i = `openSpecies${e.id}`;
			if (t.push({
				action: i,
				icon: "fa-solid fa-people-group",
				label: `Species: ${e.name}`
			}), r.actions[i] = () => e.sheet?.render(!0), n.isOwner) {
				let n = `removeSpecies${e.id}`;
				t.push({
					action: n,
					icon: "fa-solid fa-trash",
					label: `Remove Species: ${e.name}`
				}), r.actions[n] = () => e.deleteDialog();
			}
		}
	});
}
//#endregion
//#region src/module/foundry/logging.ts
function An(e, ...t) {
	console.info(e, ...t);
}
function jn(e, ...t) {
	console.warn(e, ...t);
}
//#endregion
//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function Mn(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var j = {}, Nn = [], Pn = () => {}, Fn = () => !1, In = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Ln = (e) => e.startsWith("onUpdate:"), Rn = Object.assign, zn = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, Bn = Object.prototype.hasOwnProperty, M = (e, t) => Bn.call(e, t), N = Array.isArray, Vn = (e) => Jn(e) === "[object Map]", Hn = (e) => Jn(e) === "[object Set]", Un = (e) => Jn(e) === "[object Date]", P = (e) => typeof e == "function", Wn = (e) => typeof e == "string", Gn = (e) => typeof e == "symbol", F = (e) => typeof e == "object" && !!e, Kn = (e) => (F(e) || P(e)) && P(e.then) && P(e.catch), qn = Object.prototype.toString, Jn = (e) => qn.call(e), Yn = (e) => Jn(e).slice(8, -1), Xn = (e) => Jn(e) === "[object Object]", Zn = (e) => Wn(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Qn = /* @__PURE__ */ Mn(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), $n = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, er = /-\w/g, tr = $n((e) => e.replace(er, (e) => e.slice(1).toUpperCase())), nr = /\B([A-Z])/g, rr = $n((e) => e.replace(nr, "-$1").toLowerCase()), ir = $n((e) => e.charAt(0).toUpperCase() + e.slice(1)), ar = $n((e) => e ? `on${ir(e)}` : ""), or = (e, t) => !Object.is(e, t), sr = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, cr = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, lr = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ur, dr = () => ur ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function fr(e) {
	if (N(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = Wn(r) ? gr(r) : fr(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (Wn(e) || F(e)) return e;
}
var pr = /;(?![^(]*\))/g, mr = /:([^]+)/, hr = /\/\*[^]*?\*\//g;
function gr(e) {
	let t = {};
	return e.replace(hr, "").split(pr).forEach((e) => {
		if (e) {
			let n = e.split(mr);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function I(e) {
	let t = "";
	if (Wn(e)) t = e;
	else if (N(e)) for (let n = 0; n < e.length; n++) {
		let r = I(e[n]);
		r && (t += r + " ");
	}
	else if (F(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var _r = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", vr = /* @__PURE__ */ Mn(_r);
_r + "";
function yr(e) {
	return !!e || e === "";
}
function br(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = xr(e[r], t[r]);
	return n;
}
function xr(e, t) {
	if (e === t) return !0;
	let n = Un(e), r = Un(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = Gn(e), r = Gn(t), n || r) return e === t;
	if (n = N(e), r = N(t), n || r) return n && r ? br(e, t) : !1;
	if (n = F(e), r = F(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !xr(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function Sr(e, t) {
	return e.findIndex((e) => xr(e, t));
}
var Cr = (e) => !!(e && e.__v_isRef === !0), L = (e) => Wn(e) ? e : e == null ? "" : N(e) || F(e) && (e.toString === qn || !P(e.toString)) ? Cr(e) ? L(e.value) : JSON.stringify(e, wr, 2) : String(e), wr = (e, t) => Cr(t) ? wr(e, t.value) : Vn(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Tr(t, r) + " =>"] = n, e), {}) } : Hn(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Tr(e)) } : Gn(t) ? Tr(t) : F(t) && !N(t) && !Xn(t) ? String(t) : t, Tr = (e, t = "") => Gn(e) ? `Symbol(${e.description ?? t})` : e, Er, Dr = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Er && (Er.active ? (this.parent = Er, this.index = (Er.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = Er;
			try {
				return Er = this, e();
			} finally {
				Er = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Er, Er = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Er === this) Er = this.prevScope;
			else {
				let e = Er;
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
function Or(e) {
	return new Dr(e);
}
function kr() {
	return Er;
}
function Ar(e, t = !1) {
	Er && Er.cleanups.push(e);
}
var R, jr = /* @__PURE__ */ new WeakSet(), Mr = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Er && (Er.active ? Er.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, jr.has(this) && (jr.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ir(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Yr(this), zr(this);
		let e = R, t = Gr;
		R = this, Gr = !0;
		try {
			return this.fn();
		} finally {
			Br(this), R = e, Gr = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Ur(e);
			this.deps = this.depsTail = void 0, Yr(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? jr.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Vr(this) && this.run();
	}
	get dirty() {
		return Vr(this);
	}
}, Nr = 0, Pr, Fr;
function Ir(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Fr, Fr = e;
		return;
	}
	e.next = Pr, Pr = e;
}
function Lr() {
	Nr++;
}
function Rr() {
	if (--Nr > 0) return;
	if (Fr) {
		let e = Fr;
		for (Fr = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Pr;) {
		let t = Pr;
		for (Pr = void 0; t;) {
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
function zr(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Br(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Ur(r), Wr(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Vr(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Hr(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Hr(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Xr) || (e.globalVersion = Xr, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Vr(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = R, r = Gr;
	R = e, Gr = !0;
	try {
		zr(e);
		let n = e.fn(e._value);
		(t.version === 0 || or(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		R = n, Gr = r, Br(e), e.flags &= -3;
	}
}
function Ur(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Ur(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Wr(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Gr = !0, Kr = [];
function qr() {
	Kr.push(Gr), Gr = !1;
}
function Jr() {
	let e = Kr.pop();
	Gr = e === void 0 ? !0 : e;
}
function Yr(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = R;
		R = void 0;
		try {
			t();
		} finally {
			R = e;
		}
	}
}
var Xr = 0, Zr = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Qr = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!R || !Gr || R === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== R) t = this.activeLink = new Zr(R, this), R.deps ? (t.prevDep = R.depsTail, R.depsTail.nextDep = t, R.depsTail = t) : R.deps = R.depsTail = t, $r(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = R.depsTail, t.nextDep = void 0, R.depsTail.nextDep = t, R.depsTail = t, R.deps === t && (R.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Xr++, this.notify(e);
	}
	notify(e) {
		Lr();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Rr();
		}
	}
};
function $r(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) $r(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var ei = /* @__PURE__ */ new WeakMap(), ti = /* @__PURE__ */ Symbol(""), ni = /* @__PURE__ */ Symbol(""), ri = /* @__PURE__ */ Symbol("");
function ii(e, t, n) {
	if (Gr && R) {
		let t = ei.get(e);
		t || ei.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Qr()), r.map = t, r.key = n), r.track();
	}
}
function ai(e, t, n, r, i, a) {
	let o = ei.get(e);
	if (!o) {
		Xr++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Lr(), t === "clear") o.forEach(s);
	else {
		let i = N(e), a = i && Zn(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === ri || !Gn(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(ri)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(ti)), Vn(e) && s(o.get(ni)));
				break;
			case "delete":
				i || (s(o.get(ti)), Vn(e) && s(o.get(ni)));
				break;
			case "set":
				Vn(e) && s(o.get(ti));
				break;
		}
	}
	Rr();
}
function oi(e, t) {
	let n = ei.get(e);
	return n && n.get(t);
}
function si(e) {
	let t = /* @__PURE__ */ z(e);
	return t === e ? t : (ii(t, "iterate", ri), /* @__PURE__ */ qi(e) ? t : t.map(Xi));
}
function ci(e) {
	return ii(e = /* @__PURE__ */ z(e), "iterate", ri), e;
}
function li(e, t) {
	return /* @__PURE__ */ Ki(e) ? Zi(/* @__PURE__ */ Gi(e) ? Xi(t) : t) : Xi(t);
}
var di = {
	__proto__: null,
	[Symbol.iterator]() {
		return fi(this, Symbol.iterator, (e) => li(this, e));
	},
	concat(...e) {
		return si(this).concat(...e.map((e) => N(e) ? si(e) : e));
	},
	entries() {
		return fi(this, "entries", (e) => (e[1] = li(this, e[1]), e));
	},
	every(e, t) {
		return mi(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return mi(this, "filter", e, t, (e) => e.map((e) => li(this, e)), arguments);
	},
	find(e, t) {
		return mi(this, "find", e, t, (e) => li(this, e), arguments);
	},
	findIndex(e, t) {
		return mi(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return mi(this, "findLast", e, t, (e) => li(this, e), arguments);
	},
	findLastIndex(e, t) {
		return mi(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return mi(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return gi(this, "includes", e);
	},
	indexOf(...e) {
		return gi(this, "indexOf", e);
	},
	join(e) {
		return si(this).join(e);
	},
	lastIndexOf(...e) {
		return gi(this, "lastIndexOf", e);
	},
	map(e, t) {
		return mi(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return _i(this, "pop");
	},
	push(...e) {
		return _i(this, "push", e);
	},
	reduce(e, ...t) {
		return hi(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return hi(this, "reduceRight", e, t);
	},
	shift() {
		return _i(this, "shift");
	},
	some(e, t) {
		return mi(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return _i(this, "splice", e);
	},
	toReversed() {
		return si(this).toReversed();
	},
	toSorted(e) {
		return si(this).toSorted(e);
	},
	toSpliced(...e) {
		return si(this).toSpliced(...e);
	},
	unshift(...e) {
		return _i(this, "unshift", e);
	},
	values() {
		return fi(this, "values", (e) => li(this, e));
	}
};
function fi(e, t, n) {
	let r = ci(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ qi(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var pi = Array.prototype;
function mi(e, t, n, r, i, a) {
	let o = ci(e), s = o !== e && !/* @__PURE__ */ qi(e), c = o[t];
	if (c !== pi[t]) {
		let t = c.apply(e, a);
		return s ? Xi(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, li(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function hi(e, t, n, r) {
	let i = ci(e), a = i !== e && !/* @__PURE__ */ qi(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = li(e, t)), n.call(this, t, li(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? li(e, c) : c;
}
function gi(e, t, n) {
	let r = /* @__PURE__ */ z(e);
	ii(r, "iterate", ri);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Ji(n[0]) ? (n[0] = /* @__PURE__ */ z(n[0]), r[t](...n)) : i;
}
function _i(e, t, n = []) {
	qr(), Lr();
	let r = (/* @__PURE__ */ z(e))[t].apply(e, n);
	return Rr(), Jr(), r;
}
var vi = /* @__PURE__ */ Mn("__proto__,__v_isRef,__isVue"), yi = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Gn));
function bi(e) {
	Gn(e) || (e = String(e));
	let t = /* @__PURE__ */ z(this);
	return ii(t, "has", e), t.hasOwnProperty(e);
}
var xi = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? zi : Ri : i ? Li : Ii).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = N(e);
		if (!r) {
			let e;
			if (a && (e = di[t])) return e;
			if (t === "hasOwnProperty") return bi;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ Qi(e) ? e : n);
		if ((Gn(t) ? yi.has(t) : vi(t)) || (r || ii(e, "get", t), i)) return o;
		if (/* @__PURE__ */ Qi(o)) {
			let e = a && Zn(t) ? o : o.value;
			return r && F(e) ? /* @__PURE__ */ Ui(e) : e;
		}
		return F(o) ? r ? /* @__PURE__ */ Ui(o) : /* @__PURE__ */ Vi(o) : o;
	}
}, Si = class extends xi {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = N(e) && Zn(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Ki(i);
			if (!/* @__PURE__ */ qi(n) && !/* @__PURE__ */ Ki(n) && (i = /* @__PURE__ */ z(i), n = /* @__PURE__ */ z(n)), !a && /* @__PURE__ */ Qi(i) && !/* @__PURE__ */ Qi(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : M(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ Qi(e) ? e : r);
		return e === /* @__PURE__ */ z(r) && (o ? or(n, i) && ai(e, "set", t, n, i) : ai(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = M(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && ai(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!Gn(t) || !yi.has(t)) && ii(e, "has", t), n;
	}
	ownKeys(e) {
		return ii(e, "iterate", N(e) ? "length" : ti), Reflect.ownKeys(e);
	}
}, Ci = class extends xi {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, wi = /* @__PURE__ */ new Si(), Ti = /* @__PURE__ */ new Ci(), Ei = /* @__PURE__ */ new Si(!0), Di = (e) => e, Oi = (e) => Reflect.getPrototypeOf(e);
function ki(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ z(i), o = Vn(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Di : t ? Zi : Xi;
		return !t && ii(a, "iterate", c ? ni : ti), Rn(Object.create(l), { next() {
			let { value: e, done: t } = l.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: s ? [u(e[0]), u(e[1])] : u(e),
				done: t
			};
		} });
	};
}
function Ai(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function ji(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ z(r), a = /* @__PURE__ */ z(n);
			e || (or(n, a) && ii(i, "get", n), ii(i, "get", a));
			let { has: o } = Oi(i), s = t ? Di : e ? Zi : Xi;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && ii(/* @__PURE__ */ z(t), "iterate", ti), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ z(n), i = /* @__PURE__ */ z(t);
			return e || (or(t, i) && ii(r, "has", t), ii(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ z(a), s = t ? Di : e ? Zi : Xi;
			return !e && ii(o, "iterate", ti), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return Rn(n, e ? {
		add: Ai("add"),
		set: Ai("set"),
		delete: Ai("delete"),
		clear: Ai("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ z(this), r = Oi(n), i = /* @__PURE__ */ z(e), a = !t && !/* @__PURE__ */ qi(e) && !/* @__PURE__ */ Ki(e) ? i : e;
			return r.has.call(n, a) || or(e, a) && r.has.call(n, e) || or(i, a) && r.has.call(n, i) || (n.add(a), ai(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ qi(n) && !/* @__PURE__ */ Ki(n) && (n = /* @__PURE__ */ z(n));
			let r = /* @__PURE__ */ z(this), { has: i, get: a } = Oi(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ z(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? or(n, s) && ai(r, "set", e, n, s) : ai(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ z(this), { has: n, get: r } = Oi(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ z(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && ai(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ z(this), t = e.size !== 0, n = e.clear();
			return t && ai(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = ki(r, e, t);
	}), n;
}
function Mi(e, t) {
	let n = ji(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(M(n, r) && r in t ? n : t, r, i);
}
var Ni = { get: /* @__PURE__ */ Mi(!1, !1) }, Pi = { get: /* @__PURE__ */ Mi(!1, !0) }, Fi = { get: /* @__PURE__ */ Mi(!0, !1) }, Ii = /* @__PURE__ */ new WeakMap(), Li = /* @__PURE__ */ new WeakMap(), Ri = /* @__PURE__ */ new WeakMap(), zi = /* @__PURE__ */ new WeakMap();
function Bi(e) {
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
function Vi(e) {
	return /* @__PURE__ */ Ki(e) ? e : Wi(e, !1, wi, Ni, Ii);
}
// @__NO_SIDE_EFFECTS__
function Hi(e) {
	return Wi(e, !1, Ei, Pi, Li);
}
// @__NO_SIDE_EFFECTS__
function Ui(e) {
	return Wi(e, !0, Ti, Fi, Ri);
}
function Wi(e, t, n, r, i) {
	if (!F(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Bi(Yn(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Gi(e) {
	return /* @__PURE__ */ Ki(e) ? /* @__PURE__ */ Gi(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Ki(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function qi(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Ji(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ z(t) : e;
}
function Yi(e) {
	return !M(e, "__v_skip") && Object.isExtensible(e) && cr(e, "__v_skip", !0), e;
}
var Xi = (e) => F(e) ? /* @__PURE__ */ Vi(e) : e, Zi = (e) => F(e) ? /* @__PURE__ */ Ui(e) : e;
// @__NO_SIDE_EFFECTS__
function Qi(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function B(e) {
	return $i(e, !1);
}
function $i(e, t) {
	return /* @__PURE__ */ Qi(e) ? e : new ea(e, t);
}
var ea = class {
	constructor(e, t) {
		this.dep = new Qr(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ z(e), this._value = t ? e : Xi(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ qi(e) || /* @__PURE__ */ Ki(e);
		e = n ? e : /* @__PURE__ */ z(e), or(e, t) && (this._rawValue = e, this._value = n ? e : Xi(e), this.dep.trigger());
	}
};
function V(e) {
	return /* @__PURE__ */ Qi(e) ? e.value : e;
}
var ta = {
	get: (e, t, n) => t === "__v_raw" ? e : V(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ Qi(i) && !/* @__PURE__ */ Qi(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function na(e) {
	return /* @__PURE__ */ Gi(e) ? e : new Proxy(e, ta);
}
// @__NO_SIDE_EFFECTS__
function ra(e) {
	let t = N(e) ? Array(e.length) : {};
	for (let n in e) t[n] = sa(e, n);
	return t;
}
var ia = class {
	constructor(e, t, n) {
		this._object = e, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0, this._key = Gn(t) ? t : String(t), this._raw = /* @__PURE__ */ z(e);
		let r = !0, i = e;
		if (!N(e) || Gn(this._key) || !Zn(this._key)) do
			r = !/* @__PURE__ */ Ji(i) || /* @__PURE__ */ qi(i);
		while (r && (i = i.__v_raw));
		this._shallow = r;
	}
	get value() {
		let e = this._object[this._key];
		return this._shallow && (e = V(e)), this._value = e === void 0 ? this._defaultValue : e;
	}
	set value(e) {
		if (this._shallow && /* @__PURE__ */ Qi(this._raw[this._key])) {
			let t = this._object[this._key];
			if (/* @__PURE__ */ Qi(t)) {
				t.value = e;
				return;
			}
		}
		this._object[this._key] = e;
	}
	get dep() {
		return oi(this._raw, this._key);
	}
}, aa = class {
	constructor(e) {
		this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
};
// @__NO_SIDE_EFFECTS__
function oa(e, t, n) {
	return /* @__PURE__ */ Qi(e) ? e : P(e) ? new aa(e) : F(e) && arguments.length > 1 ? sa(e, t, n) : /* @__PURE__ */ B(e);
}
function sa(e, t, n) {
	return new ia(e, t, n);
}
var ca = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Qr(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Xr - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && R !== this) return Ir(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Hr(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function la(e, t, n = !1) {
	let r, i;
	return P(e) ? r = e : (r = e.get, i = e.set), new ca(r, i, n);
}
var ua = {}, da = /* @__PURE__ */ new WeakMap(), fa = void 0;
function pa(e, t = !1, n = fa) {
	if (n) {
		let t = da.get(n);
		t || da.set(n, t = []), t.push(e);
	}
}
function ma(e, t, n = j) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ qi(e) || i === !1 || i === 0 ? ha(e, 1) : ha(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ Qi(e) ? (d = () => e.value, m = /* @__PURE__ */ qi(e)) : /* @__PURE__ */ Gi(e) ? (d = () => l(e), m = !0) : N(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ Gi(e) || /* @__PURE__ */ qi(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ Qi(e)) return e.value;
		if (/* @__PURE__ */ Gi(e)) return l(e);
		if (P(e)) return c ? c(e, 2) : e();
	})) : d = P(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			qr();
			try {
				f();
			} finally {
				Jr();
			}
		}
		let t = fa;
		fa = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			fa = t;
		}
	} : Pn, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => ha(e(), t);
	}
	let g = kr(), _ = () => {
		u.stop(), g && g.active && zn(g.effects, u);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return _(), n;
		};
	}
	let v = h ? Array(e.length).fill(ua) : ua, y = (e) => {
		if (!(!(u.flags & 1) || !u.dirty && !e)) if (t) {
			let n = u.run();
			if (e || i || m || (h ? n.some((e, t) => or(e, v[t])) : or(n, v))) {
				f && f();
				let e = fa;
				fa = u;
				try {
					let e = [
						n,
						v === ua ? void 0 : h && v[0] === ua ? [] : v,
						p
					];
					v = n, c ? c(t, 3, e) : t(...e);
				} finally {
					fa = e;
				}
			}
		} else u.run();
	};
	return s && s(y), u = new Mr(d), u.scheduler = o ? () => o(y, !1) : y, p = (e) => pa(e, !1, u), f = u.onStop = () => {
		let e = da.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			da.delete(u);
		}
	}, t ? r ? y(!0) : v = u.run() : o ? o(y.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function ha(e, t = Infinity, n) {
	if (t <= 0 || !F(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ Qi(e)) ha(e.value, t, n);
	else if (N(e)) for (let r = 0; r < e.length; r++) ha(e[r], t, n);
	else if (Hn(e) || Vn(e)) e.forEach((e) => {
		ha(e, t, n);
	});
	else if (Xn(e)) {
		for (let r in e) ha(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && ha(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function ga(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		va(e, t, n);
	}
}
function _a(e, t, n, r) {
	if (P(e)) {
		let i = ga(e, t, n, r);
		return i && Kn(i) && i.catch((e) => {
			va(e, t, n);
		}), i;
	}
	if (N(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(_a(e[a], t, n, r));
		return i;
	}
}
function va(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || j;
	if (t) {
		let r = t.parent, i = t.proxy, o = `https://vuejs.org/error-reference/#runtime-${n}`;
		for (; r;) {
			let t = r.ec;
			if (t) {
				for (let n = 0; n < t.length; n++) if (t[n](e, i, o) === !1) return;
			}
			r = r.parent;
		}
		if (a) {
			qr(), ga(a, null, 10, [
				e,
				i,
				o
			]), Jr();
			return;
		}
	}
	ya(e, n, i, r, o);
}
function ya(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var ba = [], xa = -1, Sa = [], Ca = null, wa = 0, Ta = /* @__PURE__ */ Promise.resolve(), Ea = null;
function Da(e) {
	let t = Ea || Ta;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Oa(e) {
	let t = xa + 1, n = ba.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = ba[r], a = Pa(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function ka(e) {
	if (!(e.flags & 1)) {
		let t = Pa(e), n = ba[ba.length - 1];
		!n || !(e.flags & 2) && t >= Pa(n) ? ba.push(e) : ba.splice(Oa(t), 0, e), e.flags |= 1, Aa();
	}
}
function Aa() {
	Ea ||= Ta.then(Fa);
}
function ja(e) {
	N(e) ? Sa.push(...e) : Ca && e.id === -1 ? Ca.splice(wa + 1, 0, e) : e.flags & 1 || (Sa.push(e), e.flags |= 1), Aa();
}
function Ma(e, t, n = xa + 1) {
	for (; n < ba.length; n++) {
		let t = ba[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			ba.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function Na(e) {
	if (Sa.length) {
		let e = [...new Set(Sa)].sort((e, t) => Pa(e) - Pa(t));
		if (Sa.length = 0, Ca) {
			Ca.push(...e);
			return;
		}
		for (Ca = e, wa = 0; wa < Ca.length; wa++) {
			let e = Ca[wa];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Ca = null, wa = 0;
	}
}
var Pa = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Fa(e) {
	try {
		for (xa = 0; xa < ba.length; xa++) {
			let e = ba[xa];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), ga(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; xa < ba.length; xa++) {
			let e = ba[xa];
			e && (e.flags &= -2);
		}
		xa = -1, ba.length = 0, Na(e), Ea = null, (ba.length || Sa.length) && Fa(e);
	}
}
var Ia = null, La = null;
function Ra(e) {
	let t = Ia;
	return Ia = e, La = e && e.type.__scopeId || null, t;
}
function H(e, t = Ia, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Xs(-1);
		let i = Ra(t), a;
		try {
			a = e(...n);
		} finally {
			Ra(i), r._d && Xs(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function za(e, t) {
	if (Ia === null) return e;
	let n = Ac(Ia), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = j] = t[e];
		i && (P(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && ha(a), r.push({
			dir: i,
			instance: n,
			value: a,
			oldValue: void 0,
			arg: o,
			modifiers: s
		}));
	}
	return e;
}
function Ba(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (qr(), _a(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Jr());
	}
}
function Va(e, t) {
	if (mc) {
		let n = mc.provides, r = mc.parent && mc.parent.provides;
		r === n && (n = mc.provides = Object.create(r)), n[e] = t;
	}
}
function Ha(e, t, n = !1) {
	let r = hc();
	if (r || $o) {
		let i = $o ? $o._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && P(t) ? t.call(r && r.proxy) : t;
	}
}
function Ua() {
	return !!(hc() || $o);
}
var Wa = /* @__PURE__ */ Symbol.for("v-scx"), Ga = () => Ha(Wa);
function Ka(e, t, n) {
	return qa(e, t, n);
}
function qa(e, t, n = j) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = Rn({}, n), c = t && r || !t && a !== "post", l;
	if (xc) {
		if (a === "sync") {
			let e = Ga();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = Pn, e.resume = Pn, e.pause = Pn, e;
		}
	}
	let u = mc;
	s.call = (e, t, n) => _a(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		As(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : ka(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = ma(e, t, s);
	return xc && (l ? l.push(f) : c && f()), f;
}
function Ja(e, t, n) {
	let r = this.proxy, i = Wn(e) ? e.includes(".") ? Ya(r, e) : () => r[e] : e.bind(r, r), a;
	P(t) ? a = t : (a = t.handler, n = t);
	let o = vc(this), s = qa(i, a.bind(r), n);
	return o(), s;
}
function Ya(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Xa = /* @__PURE__ */ Symbol("_vte"), Za = (e) => e.__isTeleport, Qa = /* @__PURE__ */ Symbol("_leaveCb");
function $a(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, $a(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function U(e, t) {
	return P(e) ? /* @__PURE__ */ Rn({ name: e.name }, t, { setup: e }) : e;
}
function eo() {
	let e = hc();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function to(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function no(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var ro = /* @__PURE__ */ new WeakMap();
function io(e, t, n, r, i = !1) {
	if (N(e)) {
		e.forEach((e, a) => io(e, t && (N(t) ? t[a] : t), n, r, i));
		return;
	}
	if (oo(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && io(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Ac(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === j ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ z(d), p = d === j ? Fn : (e) => no(u, e) ? !1 : M(f, e), m = (e, t) => !(t && no(u, t));
	if (l != null && l !== c) {
		if (ao(t), Wn(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ Qi(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (P(c)) ga(c, s, 12, [o, u]);
	else {
		let t = Wn(c), r = /* @__PURE__ */ Qi(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) N(n) && zn(n, a);
					else if (N(n)) n.includes(a) || n.push(a);
					else if (t) u[c] = [a], p(c) && (d[c] = u[c]);
					else {
						let t = [a];
						m(c, e.k) && (c.value = t), e.k && (u[e.k] = t);
					}
				} else t ? (u[c] = o, p(c) && (d[c] = o)) : r && (m(c, e.k) && (c.value = o), e.k && (u[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), ro.delete(e);
				};
				t.id = -1, ro.set(e, t), As(t, n);
			} else ao(e), s();
		}
	}
}
function ao(e) {
	let t = ro.get(e);
	t && (t.flags |= 8, ro.delete(e));
}
dr().requestIdleCallback, dr().cancelIdleCallback;
var oo = (e) => !!e.type.__asyncLoader, so = (e) => e.type.__isKeepAlive;
function co(e, t) {
	uo(e, "a", t);
}
function lo(e, t) {
	uo(e, "da", t);
}
function uo(e, t, n = mc) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (po(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) so(e.parent.vnode) && fo(r, t, n, e), e = e.parent;
	}
}
function fo(e, t, n, r) {
	let i = po(t, e, r, !0);
	bo(() => {
		zn(r[t], i);
	}, n);
}
function po(e, t, n = mc, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			qr();
			let i = vc(n), a = _a(t, n, e, r);
			return i(), Jr(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var mo = (e) => (t, n = mc) => {
	(!xc || e === "sp") && po(e, (...e) => t(...e), n);
}, ho = mo("bm"), go = mo("m"), _o = mo("bu"), vo = mo("u"), yo = mo("bum"), bo = mo("um"), xo = mo("sp"), So = mo("rtg"), Co = mo("rtc");
function wo(e, t = mc) {
	po("ec", e, t);
}
var To = /* @__PURE__ */ Symbol.for("v-ndc");
function W(e, t, n, r) {
	let i, a = n && n[r], o = N(e);
	if (o || Wn(e)) {
		let n = o && /* @__PURE__ */ Gi(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ qi(e), s = /* @__PURE__ */ Ki(e), e = ci(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Zi(Xi(e[n])) : Xi(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (F(e)) if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
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
function Eo(e, t, n = {}, r, i) {
	if (Ia.ce || Ia.parent && oo(Ia.parent) && Ia.parent.ce) {
		let e = Object.keys(n).length > 0;
		return t !== "default" && (n.name = t), K(), J(G, null, [X("slot", n, r && r())], e ? -2 : 64);
	}
	let a = e[t];
	a && a._c && (a._d = !1), K();
	let o = a && Do(a(n)), s = n.key || o && o.key, c = J(G, { key: (s && !Gn(s) ? s : `_${t}`) + (!o && r ? "_fb" : "") }, o || (r ? r() : []), o && e._ === 1 ? 64 : -2);
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), a && a._c && (a._d = !0), c;
}
function Do(e) {
	return e.some((e) => Qs(e) ? !(e.type === Ws || e.type === G && !Do(e.children)) : !0) ? e : null;
}
var Oo = (e) => e ? bc(e) ? Ac(e) : Oo(e.parent) : null, ko = /* @__PURE__ */ Rn(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Oo(e.parent),
	$root: (e) => Oo(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Bo(e),
	$forceUpdate: (e) => e.f ||= () => {
		ka(e.update);
	},
	$nextTick: (e) => e.n ||= Da.bind(e.proxy),
	$watch: (e) => Ja.bind(e)
}), Ao = (e, t) => e !== j && !e.__isScriptSetup && M(e, t), jo = {
	get({ _: e }, t) {
		if (t === "__v_skip") return !0;
		let { ctx: n, setupState: r, data: i, props: a, accessCache: o, type: s, appContext: c } = e;
		if (t[0] !== "$") {
			let e = o[t];
			if (e !== void 0) switch (e) {
				case 1: return r[t];
				case 2: return i[t];
				case 4: return n[t];
				case 3: return a[t];
			}
			else if (Ao(r, t)) return o[t] = 1, r[t];
			else if (i !== j && M(i, t)) return o[t] = 2, i[t];
			else if (M(a, t)) return o[t] = 3, a[t];
			else if (n !== j && M(n, t)) return o[t] = 4, n[t];
			else Fo && (o[t] = 0);
		}
		let l = ko[t], u, d;
		if (l) return t === "$attrs" && ii(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== j && M(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, M(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Ao(i, t) ? (i[t] = n, !0) : r !== j && M(r, t) ? (r[t] = n, !0) : M(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || e !== j && s[0] !== "$" && M(e, s) || Ao(t, s) || M(a, s) || M(r, s) || M(ko, s) || M(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? M(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Mo() {
	return No("useSlots").slots;
}
function No(e) {
	let t = hc();
	return t.setupContext ||= kc(t);
}
function Po(e) {
	return N(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var Fo = !0;
function Io(e) {
	let t = Bo(e), n = e.proxy, r = e.ctx;
	Fo = !1, t.beforeCreate && Ro(t.beforeCreate, e, "bc");
	let { data: i, computed: a, methods: o, watch: s, provide: c, inject: l, created: u, beforeMount: d, mounted: f, beforeUpdate: p, updated: m, activated: h, deactivated: g, beforeDestroy: _, beforeUnmount: v, destroyed: y, unmounted: b, render: x, renderTracked: S, renderTriggered: C, errorCaptured: w, serverPrefetch: T, expose: E, inheritAttrs: D, components: ee, directives: O, filters: te } = t;
	if (l && Lo(l, r, null), o) for (let e in o) {
		let t = o[e];
		P(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		F(t) && (e.data = /* @__PURE__ */ Vi(t));
	}
	if (Fo = !0, a) for (let e in a) {
		let t = a[e], i = $({
			get: P(t) ? t.bind(n, n) : P(t.get) ? t.get.bind(n, n) : Pn,
			set: !P(t) && P(t.set) ? t.set.bind(n) : Pn
		});
		Object.defineProperty(r, e, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		});
	}
	if (s) for (let e in s) zo(s[e], r, n, e);
	if (c) {
		let e = P(c) ? c.call(n) : c;
		Reflect.ownKeys(e).forEach((t) => {
			Va(t, e[t]);
		});
	}
	u && Ro(u, e, "c");
	function k(e, t) {
		N(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (k(ho, d), k(go, f), k(_o, p), k(vo, m), k(co, h), k(lo, g), k(wo, w), k(Co, S), k(So, C), k(yo, v), k(bo, b), k(xo, T), N(E)) if (E.length) {
		let t = e.exposed ||= {};
		E.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	x && e.render === Pn && (e.render = x), D != null && (e.inheritAttrs = D), ee && (e.components = ee), O && (e.directives = O), T && to(e);
}
function Lo(e, t, n = Pn) {
	N(e) && (e = Go(e));
	for (let n in e) {
		let r = e[n], i;
		i = F(r) ? "default" in r ? Ha(r.from || n, r.default, !0) : Ha(r.from || n) : Ha(r), /* @__PURE__ */ Qi(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Ro(e, t, n) {
	_a(N(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function zo(e, t, n, r) {
	let i = r.includes(".") ? Ya(n, r) : () => n[r];
	if (Wn(e)) {
		let n = t[e];
		P(n) && Ka(i, n);
	} else if (P(e)) Ka(i, e.bind(n));
	else if (F(e)) if (N(e)) e.forEach((e) => zo(e, t, n, r));
	else {
		let r = P(e.handler) ? e.handler.bind(n) : t[e.handler];
		P(r) && Ka(i, r, e);
	}
}
function Bo(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Vo(c, e, o, !0)), Vo(c, t, o)), F(t) && a.set(t, c), c;
}
function Vo(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Vo(e, a, n, !0), i && i.forEach((t) => Vo(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Ho[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Ho = {
	data: Uo,
	props: Jo,
	emits: Jo,
	methods: qo,
	computed: qo,
	beforeCreate: Ko,
	created: Ko,
	beforeMount: Ko,
	mounted: Ko,
	beforeUpdate: Ko,
	updated: Ko,
	beforeDestroy: Ko,
	beforeUnmount: Ko,
	destroyed: Ko,
	unmounted: Ko,
	activated: Ko,
	deactivated: Ko,
	errorCaptured: Ko,
	serverPrefetch: Ko,
	components: qo,
	directives: qo,
	watch: Yo,
	provide: Uo,
	inject: Wo
};
function Uo(e, t) {
	return t ? e ? function() {
		return Rn(P(e) ? e.call(this, this) : e, P(t) ? t.call(this, this) : t);
	} : t : e;
}
function Wo(e, t) {
	return qo(Go(e), Go(t));
}
function Go(e) {
	if (N(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Ko(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function qo(e, t) {
	return e ? Rn(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Jo(e, t) {
	return e ? N(e) && N(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Rn(/* @__PURE__ */ Object.create(null), Po(e), Po(t ?? {})) : t;
}
function Yo(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = Rn(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Ko(e[r], t[r]);
	return n;
}
function Xo() {
	return {
		app: null,
		config: {
			isNativeTag: Fn,
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
var Zo = 0;
function Qo(e, t) {
	return function(n, r = null) {
		P(n) || (n = Rn({}, n)), r != null && !F(r) && (r = null);
		let i = Xo(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: Zo++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Mc,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && P(e.install) ? (a.add(e), e.install(c, ...t)) : P(e) && (a.add(e), e(c, ...t))), c;
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
					let u = c._ceVNode || X(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Ac(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (_a(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = $o;
				$o = c;
				try {
					return e();
				} finally {
					$o = t;
				}
			}
		};
		return c;
	};
}
var $o = null, es = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${tr(t)}Modifiers`] || e[`${rr(t)}Modifiers`];
function ts(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || j, i = n, a = t.startsWith("update:"), o = a && es(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => Wn(e) ? e.trim() : e)), o.number && (i = n.map(lr)));
	let s, c = r[s = ar(t)] || r[s = ar(tr(t))];
	!c && a && (c = r[s = ar(rr(t))]), c && _a(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, _a(l, e, 6, i);
	}
}
var ns = /* @__PURE__ */ new WeakMap();
function rs(e, t, n = !1) {
	let r = n ? ns : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!P(e)) {
		let r = (e) => {
			let n = rs(e, t, !0);
			n && (s = !0, Rn(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (F(e) && r.set(e, null), null) : (N(a) ? a.forEach((e) => o[e] = null) : Rn(o, a), F(e) && r.set(e, o), o);
}
function is(e, t) {
	return !e || !In(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), M(e, t[0].toLowerCase() + t.slice(1)) || M(e, rr(t)) || M(e, t));
}
function as(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = Ra(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = oc(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = oc(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : os(s);
		}
	} catch (t) {
		Ks.length = 0, va(t, e, 1), _ = X(Ws);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(Ln) && (v = ss(v, a)), y = ic(y, v, !1, !0));
	}
	return n.dirs && (y = ic(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && $a(y, n.transition), _ = y, Ra(g), _;
}
var os = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || In(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, ss = (e, t) => {
	let n = {};
	for (let r in e) (!Ln(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function cs(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? ls(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (us(o, r, n) && !is(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? o ? ls(r, o, l) : !0 : !!o;
	return !1;
}
function ls(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (us(t, e, a) && !is(n, a)) return !0;
	}
	return !1;
}
function us(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && F(r) && F(i) ? !xr(r, i) : r !== i;
}
function ds({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var fs = {}, ps = () => Object.create(fs), ms = (e) => Object.getPrototypeOf(e) === fs;
function hs(e, t, n, r = !1) {
	let i = {}, a = ps();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), _s(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ Hi(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function gs(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ z(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (is(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) if (M(a, o)) u !== a[o] && (a[o] = u, l = !0);
				else {
					let t = tr(o);
					i[t] = vs(c, s, t, u, e, !1);
				}
				else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		_s(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !M(t, a) && ((r = rr(a)) === a || !M(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = vs(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !M(t, e)) && (delete a[e], l = !0);
	}
	l && ai(e.attrs, "set", "");
}
function _s(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (Qn(c)) continue;
		let l = t[c], u;
		i && M(i, u = tr(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : is(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ z(n), r = s || j;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = vs(i, t, s, r[s], e, !M(r, s));
		}
	}
	return o;
}
function vs(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = M(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && P(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = vc(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === rr(n)) && (r = !0));
	}
	return r;
}
var ys = /* @__PURE__ */ new WeakMap();
function bs(e, t, n = !1) {
	let r = n ? ys : t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [], c = !1;
	if (!P(e)) {
		let r = (e) => {
			c = !0;
			let [n, r] = bs(e, t, !0);
			Rn(o, n), r && s.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!a && !c) return F(e) && r.set(e, Nn), Nn;
	if (N(a)) for (let e = 0; e < a.length; e++) {
		let t = tr(a[e]);
		xs(t) && (o[t] = j);
	}
	else if (a) for (let e in a) {
		let t = tr(e);
		if (xs(t)) {
			let n = a[e], r = o[t] = N(n) || P(n) ? { type: n } : Rn({}, n), i = r.type, c = !1, l = !0;
			if (N(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = P(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				} else n === "String" && (l = !1);
			}
			else c = P(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || M(r, "default")) && s.push(t);
		}
	}
	let l = [o, s];
	return F(e) && r.set(e, l), l;
}
function xs(e) {
	return e[0] !== "$" && !Qn(e);
}
var Ss = (e) => e === "_" || e === "_ctx" || e === "$stable", Cs = (e) => N(e) ? e.map(oc) : [oc(e)], ws = (e, t, n) => {
	if (t._n) return t;
	let r = H((...e) => Cs(t(...e)), n);
	return r._c = !1, r;
}, Ts = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Ss(n)) continue;
		let i = e[n];
		if (P(i)) t[n] = ws(n, i, r);
		else if (i != null) {
			let e = Cs(i);
			t[n] = () => e;
		}
	}
}, Es = (e, t) => {
	let n = Cs(t);
	e.slots.default = () => n;
}, Ds = (e, t, n) => {
	for (let r in t) (n || !Ss(r)) && (e[r] = t[r]);
}, Os = (e, t, n) => {
	let r = e.slots = ps();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Ds(r, t, n), n && cr(r, "_", e, !0)) : Ts(t, r);
	} else t && Es(e, t);
}, ks = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = j;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Ds(i, t, n) : (a = !t.$stable, Ts(t, i)), o = t;
	} else t && (Es(e, t), o = { default: 1 });
	if (a) for (let e in i) !Ss(e) && o[e] == null && delete i[e];
}, As = Hs;
function js(e) {
	return Ms(e);
}
function Ms(e, t) {
	let n = dr();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = Pn, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !$s(e, t) && (r = fe(e), se(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Us:
				g(e, t, n, r);
				break;
			case Ws:
				_(e, t, n, r);
				break;
			case Gs:
				e ?? v(t, n, r, o);
				break;
			case G:
				ee(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? x(e, t, n, r, i, a, o, s, c) : d & 6 ? O(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, he);
		}
		u != null && i ? io(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && io(e.ref, null, a, e, !0);
	}, g = (e, t, n, i) => {
		if (e == null) r(t.el = s(t.children), n, i);
		else {
			let n = t.el = e.el;
			t.children !== e.children && l(n, t.children);
		}
	}, _ = (e, t, n, i) => {
		e == null ? r(t.el = c(t.children || ""), n, i) : t.el = e.el;
	}, v = (e, t, n, r) => {
		[e.el, e.anchor] = m(e.children, t, n, r, e.el, e.anchor);
	}, y = ({ el: e, anchor: t }, n, i) => {
		let a;
		for (; e && e !== t;) a = f(e), r(e, n, i), e = a;
		r(t, n, i);
	}, b = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, x = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) S(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), T(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, S = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && w(e.children, f, null, i, s, Ns(e, c), l, d), _ && Ba(e, null, i, "created"), C(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !Qn(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && uc(p, i, e);
		}
		_ && Ba(e, null, i, "beforeMount");
		let v = Fs(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && As(() => {
			try {
				p && uc(p, i, e), v && g.enter(f), _ && Ba(e, null, i, "mounted");
			} finally {}
		}, s);
	}, C = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Vs(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				C(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, w = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) h(null, e[l] = s ? sc(e[l]) : oc(e[l]), t, n, r, i, a, o, s);
	}, T = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || j, m = t.props || j, h;
		if (n && Ps(n, !1), (h = m.onVnodeBeforeUpdate) && uc(h, n, t, e), f && Ba(t, e, n, "beforeUpdate"), n && Ps(n, !0), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? E(e.dynamicChildren, d, c, n, r, Ns(t, i), o) : s || re(e, t, c, null, n, r, Ns(t, i), o, !1), l > 0) {
			if (l & 16) D(c, p, m, n, i);
			else if (l & 2 && p.class !== m.class && a(c, "class", null, m.class, i), l & 4 && a(c, "style", p.style, m.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = p[r], s = m[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && D(c, p, m, n, i);
		((h = m.onVnodeUpdated) || f) && As(() => {
			h && uc(h, n, t, e), f && Ba(t, e, n, "updated");
		}, r);
	}, E = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s];
			h(c, l, c.el && (c.type === G || !$s(c, l) || c.shapeFlag & 198) ? d(c.el) : n, null, r, i, a, o, !0);
		}
	}, D = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== j) for (let o in t) !Qn(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (Qn(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, ee = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), w(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (E(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Is(e, t, !0)) : re(e, t, n, f, a, o, c, l, u);
	}, O = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : te(t, n, r, i, a, o, c) : k(e, t, c);
	}, te = (e, t, n, r, i, a, o) => {
		let s = e.component = pc(e, r, i);
		if (so(e) && (s.ctx.renderer = he), Sc(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ne, o), !e.el) {
				let r = s.subTree = X(Ws);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else ne(s, e, t, n, i, a, o);
	}, k = (e, t, n) => {
		let r = t.component = e.component;
		if (cs(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			A(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, ne = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Rs(e);
					if (n) {
						t && (t.el = c.el, A(e, t, o)), n.asyncDep.then(() => {
							As(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				Ps(e, !1), t ? (t.el = c.el, A(e, t, o)) : t = c, n && sr(n), (f = t.props && t.props.onVnodeBeforeUpdate) && uc(f, s, t, c), Ps(e, !0);
				let p = as(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), fe(m), e, i, a), t.el = p.el, u === null && ds(e, p.el), r && As(r, i), (f = t.props && t.props.onVnodeUpdated) && As(() => uc(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = oo(t);
				if (Ps(e, !1), l && sr(l), !m && (o = c && c.onVnodeBeforeMount) && uc(o, d, t), Ps(e, !0), s && _e) {
					let t = () => {
						e.subTree = as(e), _e(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = as(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && As(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					As(() => uc(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && oo(d.vnode) && d.vnode.shapeFlag & 256) && e.a && As(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Mr(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => ka(u), Ps(e, !0), l();
	}, A = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, gs(e, t.props, r, n), ks(e, t.children, n), qr(), Ma(e), Jr();
	}, re = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				ae(l, f, n, r, i, a, o, s, c);
				return;
			} else if (p & 256) {
				ie(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && de(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? ae(l, f, n, r, i, a, o, s, c) : de(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && w(f, n, r, i, a, o, s, c));
	}, ie = (e, t, n, r, i, a, o, s, c) => {
		e ||= Nn, t ||= Nn;
		let l = e.length, u = t.length, d = Math.min(l, u), f;
		for (f = 0; f < d; f++) {
			let r = t[f] = c ? sc(t[f]) : oc(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? de(e, i, a, !0, !1, d) : w(t, n, r, i, a, o, s, c, d);
	}, ae = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? sc(t[l]) : oc(t[l]);
			if ($s(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? sc(t[f]) : oc(t[f]);
			if ($s(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? sc(t[l]) : oc(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) se(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? sc(t[l]) : oc(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, v = 0, y = f - m + 1, b = !1, x = 0, S = Array(y);
			for (l = 0; l < y; l++) S[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (v >= y) {
					se(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (S[_ - m] === 0 && $s(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? se(r, i, a, !0) : (S[u - m] = l + 1, u >= x ? x = u : b = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let C = b ? Ls(S) : Nn;
			for (_ = C.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || Bs(f) : r;
				S[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : b && (_ < 0 || l !== C[_] ? oe(d, n, p, 2) : _--);
			}
		}
	}, oe = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			oe(e.component.subTree, t, n, a);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, a);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, he);
			return;
		}
		if (c === G) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) oe(u[e], t, n, a);
			r(e.anchor, t, n);
			return;
		}
		if (c === Gs) {
			y(e, t, n);
			return;
		}
		if (a !== 2 && d & 1 && l) if (a === 0) l.persisted && !s[Qa] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), As(() => l.enter(s), o));
		else {
			let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? i(s) : r(s, t, n);
			}, d = () => {
				let e = s._isLeaving || !!s[Qa];
				s._isLeaving && s[Qa](!0), l.persisted && !e ? u() : a(s, () => {
					u(), c && c();
				});
			};
			o ? o(s, u, d) : d();
		}
		else r(s, t, n);
	}, se = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (qr(), io(s, null, n, e, !0), Jr()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !oo(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && uc(_, t, e), u & 6) ue(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Ba(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, he, r) : l && !l.hasOnce && (a !== G || d > 0 && d & 64) ? de(l, t, n, !1, !0) : (a === G && d & 384 || !i && u & 16) && de(c, t, n), r && ce(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && As(() => {
			_ && uc(_, t, e), h && Ba(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ce = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e;
		if (t === G) {
			le(n, r);
			return;
		}
		if (t === Gs) {
			b(e);
			return;
		}
		let o = () => {
			i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (e.shapeFlag & 1 && a && !a.persisted) {
			let { leave: t, delayLeave: r } = a, i = () => t(n, o);
			r ? r(e.el, o, i) : i();
		} else o();
	}, le = (e, t) => {
		let n;
		for (; e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, ue = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		zs(c), zs(l), r && sr(r), i.stop(), a && (a.flags |= 8, se(o, e, t, n)), s && As(s, t), As(() => {
			e.isUnmounted = !0;
		}, t);
	}, de = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) se(e[o], t, n, r, i);
	}, fe = (e) => {
		if (e.shapeFlag & 6) return fe(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[Xa];
		return n ? f(n) : t;
	}, pe = !1, me = (e, t, n) => {
		let r;
		e == null ? t._vnode && (se(t._vnode, null, null, !0), r = t._vnode.component) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e, pe ||= (pe = !0, Ma(r), Na(), !1);
	}, he = {
		p: h,
		um: se,
		m: oe,
		r: ce,
		mt: te,
		mc: w,
		pc: re,
		pbc: E,
		n: fe,
		o: e
	}, ge, _e;
	return t && ([ge, _e] = t(he)), {
		render: me,
		hydrate: ge,
		createApp: Qo(me, ge)
	};
}
function Ns({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ps({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Fs(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Is(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (N(r) && N(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = sc(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Is(t, a)), a.type === Us && (a.patchFlag === -1 && (a = i[e] = sc(a)), a.el = t.el), a.type === Ws && !a.el && (a.el = t.el);
	}
}
function Ls(e) {
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
function Rs(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Rs(t);
}
function zs(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Bs(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Bs(t.subTree) : null;
}
var Vs = (e) => e.__isSuspense;
function Hs(e, t) {
	t && t.pendingBranch ? N(e) ? t.effects.push(...e) : t.effects.push(e) : ja(e);
}
var G = /* @__PURE__ */ Symbol.for("v-fgt"), Us = /* @__PURE__ */ Symbol.for("v-txt"), Ws = /* @__PURE__ */ Symbol.for("v-cmt"), Gs = /* @__PURE__ */ Symbol.for("v-stc"), Ks = [], qs = null;
function K(e = !1) {
	Ks.push(qs = e ? null : []);
}
function Js() {
	Ks.pop(), qs = Ks[Ks.length - 1] || null;
}
var Ys = 1;
function Xs(e, t = !1) {
	Ys += e, e < 0 && qs && t && (qs.hasOnce = !0);
}
function Zs(e) {
	return e.dynamicChildren = Ys > 0 ? qs || Nn : null, Js(), Ys > 0 && qs && qs.push(e), e;
}
function q(e, t, n, r, i, a) {
	return Zs(Y(e, t, n, r, i, a, !0));
}
function J(e, t, n, r, i) {
	return Zs(X(e, t, n, r, i, !0));
}
function Qs(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function $s(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ec = ({ key: e }) => e ?? null, tc = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : Wn(e) || /* @__PURE__ */ Qi(e) || P(e) ? {
	i: Ia,
	r: e,
	k: t,
	f: !!n
} : e);
function Y(e, t = null, n = null, r = 0, i = null, a = e === G ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && ec(t),
		ref: t && tc(t),
		scopeId: La,
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
		ctx: Ia
	};
	return s ? (cc(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= Wn(n) ? 8 : 16), Ys > 0 && !o && qs && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && qs.push(c), c;
}
var X = nc;
function nc(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === To) && (e = Ws), Qs(e)) {
		let r = ic(e, t, !0);
		return n && cc(r, n), Ys > 0 && !a && qs && (r.shapeFlag & 6 ? qs[qs.indexOf(e)] = r : qs.push(r)), r.patchFlag = -2, r;
	}
	if (jc(e) && (e = e.__vccOpts), t) {
		t = rc(t);
		let { class: e, style: n } = t;
		e && !Wn(e) && (t.class = I(e)), F(n) && (/* @__PURE__ */ Ji(n) && !N(n) && (n = Rn({}, n)), t.style = fr(n));
	}
	let o = Wn(e) ? 1 : Vs(e) ? 128 : Za(e) ? 64 : F(e) ? 4 : P(e) ? 2 : 0;
	return Y(e, t, n, r, i, o, a, !0);
}
function rc(e) {
	return e ? /* @__PURE__ */ Ji(e) || ms(e) ? Rn({}, e) : e : null;
}
function ic(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? lc(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ec(l),
		ref: t && t.ref ? n && a ? N(a) ? a.concat(tc(t)) : [a, tc(t)] : tc(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== G ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && ic(e.ssContent),
		ssFallback: e.ssFallback && ic(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && $a(u, c.clone(u)), u;
}
function Z(e = " ", t = 0) {
	return X(Us, null, e, t);
}
function ac(e, t) {
	let n = X(Gs, null, e);
	return n.staticCount = t, n;
}
function Q(e = "", t = !1) {
	return t ? (K(), J(Ws, null, e)) : X(Ws, null, e);
}
function oc(e) {
	return e == null || typeof e == "boolean" ? X(Ws) : N(e) ? X(G, null, e.slice()) : Qs(e) ? sc(e) : X(Us, null, String(e));
}
function sc(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : ic(e);
}
function cc(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (N(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), cc(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !ms(t) ? t._ctx = Ia : r === 3 && Ia && (Ia.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else P(t) ? (t = {
		default: t,
		_ctx: Ia
	}, n = 32) : (t = String(t), r & 64 ? (n = 16, t = [Z(t)]) : n = 8);
	e.children = t, e.shapeFlag |= n;
}
function lc(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = I([t.class, r.class]));
		else if (e === "style") t.style = fr([t.style, r.style]);
		else if (In(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(N(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !Ln(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function uc(e, t, n, r = null) {
	_a(e, t, 7, [n, r]);
}
var dc = Xo(), fc = 0;
function pc(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || dc, a = {
		uid: fc++,
		vnode: e,
		type: r,
		parent: t,
		appContext: i,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new Dr(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: t ? t.provides : Object.create(i.provides),
		ids: t ? t.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: bs(r, i),
		emitsOptions: rs(r, i),
		emit: null,
		emitted: null,
		propsDefaults: j,
		inheritAttrs: r.inheritAttrs,
		ctx: j,
		data: j,
		props: j,
		attrs: j,
		slots: j,
		refs: j,
		setupState: j,
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = ts.bind(null, a), e.ce && e.ce(a), a;
}
var mc = null, hc = () => mc || Ia, gc, _c;
{
	let e = dr(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	gc = t("__VUE_INSTANCE_SETTERS__", (e) => mc = e), _c = t("__VUE_SSR_SETTERS__", (e) => xc = e);
}
var vc = (e) => {
	let t = mc;
	return gc(e), e.scope.on(), () => {
		e.scope.off(), gc(t);
	};
}, yc = () => {
	mc && mc.scope.off(), gc(null);
};
function bc(e) {
	return e.vnode.shapeFlag & 4;
}
var xc = !1;
function Sc(e, t = !1, n = !1) {
	t && _c(t);
	let { props: r, children: i } = e.vnode, a = bc(e);
	hs(e, r, a, t), Os(e, i, n || t);
	let o = a ? Cc(e, t) : void 0;
	return t && _c(!1), o;
}
function Cc(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, jo);
	let { setup: r } = n;
	if (r) {
		qr();
		let n = e.setupContext = r.length > 1 ? kc(e) : null, i = vc(e), a = ga(r, e, 0, [e.props, n]), o = Kn(a);
		if (Jr(), i(), (o || e.sp) && !oo(e) && to(e), o) {
			if (a.then(yc, yc), t) return a.then((n) => {
				wc(e, n, t);
			}).catch((t) => {
				va(t, e, 0);
			});
			e.asyncDep = a;
		} else wc(e, a, t);
	} else Dc(e, t);
}
function wc(e, t, n) {
	P(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : F(t) && (e.setupState = na(t)), Dc(e, n);
}
var Tc, Ec;
function Dc(e, t, n) {
	let r = e.type;
	if (!e.render) {
		if (!t && Tc && !r.render) {
			let t = r.template || Bo(e).template;
			if (t) {
				let { isCustomElement: n, compilerOptions: i } = e.appContext.config, { delimiters: a, compilerOptions: o } = r;
				r.render = Tc(t, Rn(Rn({
					isCustomElement: n,
					delimiters: a
				}, i), o));
			}
		}
		e.render = r.render || Pn, Ec && Ec(e);
	}
	{
		let t = vc(e);
		qr();
		try {
			Io(e);
		} finally {
			Jr(), t();
		}
	}
}
var Oc = { get(e, t) {
	return ii(e, "get", ""), e[t];
} };
function kc(e) {
	return {
		attrs: new Proxy(e.attrs, Oc),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Ac(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(na(Yi(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in ko) return ko[n](e);
		},
		has(e, t) {
			return t in e || t in ko;
		}
	}) : e.proxy;
}
function jc(e) {
	return P(e) && "__vccOpts" in e;
}
var $ = (e, t) => /* @__PURE__ */ la(e, t, xc), Mc = "3.5.38", Nc = void 0, Pc = typeof window < "u" && window.trustedTypes;
if (Pc) try {
	Nc = /* @__PURE__ */ Pc.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Fc = Nc ? (e) => Nc.createHTML(e) : (e) => e, Ic = "http://www.w3.org/2000/svg", Lc = "http://www.w3.org/1998/Math/MathML", Rc = typeof document < "u" ? document : null, zc = Rc && /* @__PURE__ */ Rc.createElement("template"), Bc = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Rc.createElementNS(Ic, e) : t === "mathml" ? Rc.createElementNS(Lc, e) : n ? Rc.createElement(e, { is: n }) : Rc.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Rc.createTextNode(e),
	createComment: (e) => Rc.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Rc.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
		else {
			zc.innerHTML = Fc(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = zc.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Vc = /* @__PURE__ */ Symbol("_vtc");
function Hc(e, t, n) {
	let r = e[Vc];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Uc = /* @__PURE__ */ Symbol("_vod"), Wc = /* @__PURE__ */ Symbol("_vsh"), Gc = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[Uc] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Kc(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Kc(e, !0), r.enter(e)) : r.leave(e, () => {
			Kc(e, !1);
		}) : Kc(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Kc(e, t);
	}
};
function Kc(e, t) {
	e.style.display = t ? e[Uc] : "none", e[Wc] = !t;
}
var qc = /* @__PURE__ */ Symbol(""), Jc = /(?:^|;)\s*display\s*:/;
function Yc(e, t, n) {
	let r = e.style, i = Wn(n), a = !1;
	if (n && !i) {
		if (t) if (Wn(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? Zc(r, t, "");
		}
		else for (let e in t) n[e] ?? Zc(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Zc(r, i, "") : tl(e, i, !Wn(t) && t ? t[i] : void 0, o) || Zc(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[qc];
			e && (n += ";" + e), r.cssText = n, a = Jc.test(n);
		}
	} else t && e.removeAttribute("style");
	Uc in e && (e[Uc] = a ? r.display : "", e[Wc] && (r.display = "none"));
}
var Xc = /\s*!important$/;
function Zc(e, t, n) {
	if (N(n)) n.forEach((n) => Zc(e, t, n));
	else if (n ??= "", t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = el(e, t);
		Xc.test(n) ? e.setProperty(rr(r), n.replace(Xc, ""), "important") : e[r] = n;
	}
}
var Qc = [
	"Webkit",
	"Moz",
	"ms"
], $c = {};
function el(e, t) {
	let n = $c[t];
	if (n) return n;
	let r = tr(t);
	if (r !== "filter" && r in e) return $c[t] = r;
	r = ir(r);
	for (let n = 0; n < Qc.length; n++) {
		let i = Qc[n] + r;
		if (i in e) return $c[t] = i;
	}
	return t;
}
function tl(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && Wn(r) && n === r;
}
var nl = "http://www.w3.org/1999/xlink";
function rl(e, t, n, r, i, a = vr(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(nl, t.slice(6, t.length)) : e.setAttributeNS(nl, t, n) : n == null || a && !yr(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : Gn(n) ? String(n) : n);
}
function il(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Fc(n) : n);
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
		r === "boolean" ? n = yr(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function al(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function ol(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var sl = /* @__PURE__ */ Symbol("_vei");
function cl(e, t, n, r, i = null) {
	let a = e[sl] || (e[sl] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = ul(t);
		r ? al(e, n, a[t] = ml(r, i), s) : o && (ol(e, n, o, s), a[t] = void 0);
	}
}
var ll = /(?:Once|Passive|Capture)$/;
function ul(e) {
	let t;
	if (ll.test(e)) {
		t = {};
		let n;
		for (; n = e.match(ll);) e = e.slice(0, e.length - n[0].length), t[n[0].toLowerCase()] = !0;
	}
	return [e[2] === ":" ? e.slice(3) : rr(e.slice(2)), t];
}
var dl = 0, fl = /* @__PURE__ */ Promise.resolve(), pl = () => dl ||= (fl.then(() => dl = 0), Date.now());
function ml(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (N(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && _a(e, t, 5, a);
			}
		} else _a(r, t, 5, [e]);
	};
	return n.value = e, n.attached = pl(), n;
}
var hl = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, gl = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? Hc(e, r, o) : t === "style" ? Yc(e, n, r) : In(t) ? Ln(t) || cl(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : _l(e, t, r, o)) ? (il(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && rl(e, t, r, o, a, t !== "value")) : e._isVueCE && (vl(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !Wn(r))) ? il(e, tr(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), rl(e, t, r, o));
};
function _l(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && hl(t) && P(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return hl(t) && Wn(n) ? !1 : t in e;
}
function vl(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = tr(t);
	return Array.isArray(n) ? n.some((e) => tr(e) === r) : Object.keys(n).some((e) => tr(e) === r);
}
var yl = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return N(t) ? (e) => sr(t, e) : t;
};
function bl(e) {
	e.target.composing = !0;
}
function xl(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Sl = /* @__PURE__ */ Symbol("_assign");
function Cl(e, t, n) {
	return t && (e = e.trim()), n && (e = lr(e)), e;
}
var wl = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e[Sl] = yl(i);
		let a = r || i.props && i.props.type === "number";
		al(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Sl](Cl(e.value, n, a));
		}), (n || a) && al(e, "change", () => {
			e.value = Cl(e.value, n, a);
		}), t || (al(e, "compositionstart", bl), al(e, "compositionend", xl), al(e, "change", xl));
	},
	mounted(e, { value: t }) {
		e.value = t ?? "";
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Sl] = yl(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? lr(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Tl = {
	deep: !0,
	created(e, t, n) {
		e[Sl] = yl(n), al(e, "change", () => {
			let t = e._modelValue, n = kl(e), r = e.checked, i = e[Sl];
			if (N(t)) {
				let e = Sr(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (Hn(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(Al(e, r));
		});
	},
	mounted: El,
	beforeUpdate(e, t, n) {
		e[Sl] = yl(n), El(e, t, n);
	}
};
function El(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (N(t)) i = Sr(t, r.props.value) > -1;
	else if (Hn(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = xr(t, Al(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Dl = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		let i = Hn(t);
		al(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? lr(kl(e)) : kl(e));
			e[Sl](e.multiple ? i ? new Set(t) : t : t[0]), e._assigning = !0, Da(() => {
				e._assigning = !1;
			});
		}), e[Sl] = yl(r);
	},
	mounted(e, { value: t }) {
		Ol(e, t);
	},
	beforeUpdate(e, t, n) {
		e[Sl] = yl(n);
	},
	updated(e, { value: t }) {
		e._assigning || Ol(e, t);
	}
};
function Ol(e, t) {
	let n = e.multiple, r = N(t);
	if (!(n && !r && !Hn(t))) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = kl(a);
			if (n) if (r) {
				let e = typeof o;
				e === "string" || e === "number" ? a.selected = t.some((e) => String(e) === String(o)) : a.selected = Sr(t, o) > -1;
			} else a.selected = t.has(o);
			else if (xr(kl(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function kl(e) {
	return "_value" in e ? e._value : e.value;
}
function Al(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var jl = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Ml = {
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
	exact: (e, t) => jl.some((n) => e[`${n}Key`] && !t.includes(n))
}, Nl = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Ml[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Pl = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, Fl = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = rr(n.key);
		if (t.some((e) => e === r || Pl[e] === r)) return e(n);
	}));
}, Il = /* @__PURE__ */ Rn({ patchProp: gl }, Bc), Ll;
function Rl() {
	return Ll ||= js(Il);
}
var zl = ((...e) => {
	let t = Rl().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Vl(e);
		if (!r) return;
		let i = t._component;
		!P(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Bl(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Bl(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Vl(e) {
	return Wn(e) ? document.querySelector(e) : e;
}
//#endregion
//#region node_modules/pinia/dist/pinia.mjs
var Hl = typeof window < "u", Ul, Wl = (e) => Ul = e, Gl = Symbol();
function Kl(e) {
	return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var ql;
(function(e) {
	e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(ql ||= {});
var Jl = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null };
function Yl(e, { autoBom: t = !1 } = {}) {
	return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["﻿", e], { type: e.type }) : e;
}
function Xl(e, t, n) {
	let r = new XMLHttpRequest();
	r.open("GET", e), r.responseType = "blob", r.onload = function() {
		tu(r.response, t, n);
	}, r.onerror = function() {
		console.error("could not download file");
	}, r.send();
}
function Zl(e) {
	let t = new XMLHttpRequest();
	t.open("HEAD", e, !1);
	try {
		t.send();
	} catch {}
	return t.status >= 200 && t.status <= 299;
}
function Ql(e) {
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
var $l = typeof navigator == "object" ? navigator : { userAgent: "" }, eu = /Macintosh/.test($l.userAgent) && /AppleWebKit/.test($l.userAgent) && !/Safari/.test($l.userAgent), tu = Hl ? typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !eu ? nu : "msSaveOrOpenBlob" in $l ? ru : iu : () => {};
function nu(e, t = "download", n) {
	let r = document.createElement("a");
	r.download = t, r.rel = "noopener", typeof e == "string" ? (r.href = e, r.origin === location.origin ? Ql(r) : Zl(r.href) ? Xl(e, t, n) : (r.target = "_blank", Ql(r))) : (r.href = URL.createObjectURL(e), setTimeout(function() {
		URL.revokeObjectURL(r.href);
	}, 4e4), setTimeout(function() {
		Ql(r);
	}, 0));
}
function ru(e, t = "download", n) {
	if (typeof e == "string") if (Zl(e)) Xl(e, t, n);
	else {
		let t = document.createElement("a");
		t.href = e, t.target = "_blank", setTimeout(function() {
			Ql(t);
		});
	}
	else navigator.msSaveOrOpenBlob(Yl(e, n), t);
}
function iu(e, t, n, r) {
	if (r ||= open("", "_blank"), r && (r.document.title = r.document.body.innerText = "downloading..."), typeof e == "string") return Xl(e, t, n);
	let i = e.type === "application/octet-stream", a = /constructor/i.test(String(Jl.HTMLElement)) || "safari" in Jl, o = /CriOS\/[\d]+/.test(navigator.userAgent);
	if ((o || i && a || eu) && typeof FileReader < "u") {
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
var { assign: au } = Object;
function ou() {
	let e = Or(!0), t = e.run(() => /* @__PURE__ */ B({})), n = [], r = [], i = Yi({
		install(e) {
			Wl(i), i._a = e, e.provide(Gl, i), e.config.globalProperties.$pinia = i, r.forEach((e) => n.push(e)), r = [];
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
var su = () => {};
function cu(e, t, n, r = su) {
	e.add(t);
	let i = () => {
		e.delete(t) && r();
	};
	return !n && kr() && Ar(i), i;
}
function lu(e, ...t) {
	e.forEach((e) => {
		e(...t);
	});
}
var uu = (e) => e(), du = Symbol(), fu = Symbol();
function pu(e, t) {
	e instanceof Map && t instanceof Map ? t.forEach((t, n) => e.set(n, t)) : e instanceof Set && t instanceof Set && t.forEach(e.add, e);
	for (let n in t) {
		if (!t.hasOwnProperty(n)) continue;
		let r = t[n], i = e[n];
		Kl(i) && Kl(r) && e.hasOwnProperty(n) && !/* @__PURE__ */ Qi(r) && !/* @__PURE__ */ Gi(r) ? e[n] = pu(i, r) : e[n] = r;
	}
	return e;
}
var mu = Symbol();
function hu(e) {
	return !Kl(e) || !Object.prototype.hasOwnProperty.call(e, mu);
}
var { assign: gu } = Object;
function _u(e) {
	return !!(/* @__PURE__ */ Qi(e) && e.effect);
}
function vu(e, t, n, r) {
	let { state: i, actions: a, getters: o } = t, s = n.state.value[e], c;
	function l() {
		return s || (n.state.value[e] = i ? i() : {}), gu(/* @__PURE__ */ ra(n.state.value[e]), a, Object.keys(o || {}).reduce((t, r) => (t[r] = Yi($(() => {
			Wl(n);
			let t = n._s.get(e);
			return o[r].call(t, t);
		})), t), {}));
	}
	return c = yu(e, l, t, n, r, !0), c;
}
function yu(e, t, n = {}, r, i, a) {
	let o, s = gu({ actions: {} }, n), c = { deep: !0 }, l, u, d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), p = r.state.value[e];
	!a && !p && (r.state.value[e] = {});
	let m;
	function h(t) {
		let n;
		l = u = !1, typeof t == "function" ? (t(r.state.value[e]), n = {
			type: ql.patchFunction,
			storeId: e,
			events: void 0
		}) : (pu(r.state.value[e], t), n = {
			type: ql.patchObject,
			payload: t,
			storeId: e,
			events: void 0
		});
		let i = m = Symbol();
		Da().then(() => {
			m === i && (l = !0);
		}), u = !0, lu(d, n, r.state.value[e]);
	}
	let g = a ? function() {
		let { state: e } = n, t = e ? e() : {};
		this.$patch((e) => {
			gu(e, t);
		});
	} : su;
	function _() {
		o.stop(), d.clear(), f.clear(), r._s.delete(e);
	}
	let v = (t, n = "") => {
		if (du in t) return t[fu] = n, t;
		let i = function() {
			Wl(r);
			let n = Array.from(arguments), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
			function s(e) {
				a.add(e);
			}
			function c(e) {
				o.add(e);
			}
			lu(f, {
				args: n,
				name: i[fu],
				store: y,
				after: s,
				onError: c
			});
			let l;
			try {
				l = t.apply(this && this.$id === e ? this : y, n);
			} catch (e) {
				throw lu(o, e), e;
			}
			return l instanceof Promise ? l.then((e) => (lu(a, e), e)).catch((e) => (lu(o, e), Promise.reject(e))) : (lu(a, l), l);
		};
		return i[du] = !0, i[fu] = n, i;
	}, y = /* @__PURE__ */ Vi({
		_p: r,
		$id: e,
		$onAction: cu.bind(null, f),
		$patch: h,
		$reset: g,
		$subscribe(t, n = {}) {
			let i = cu(d, t, n.detached, () => a()), a = o.run(() => Ka(() => r.state.value[e], (r) => {
				(n.flush === "sync" ? u : l) && t({
					storeId: e,
					type: ql.direct,
					events: void 0
				}, r);
			}, gu({}, c, n)));
			return i;
		},
		$dispose: _
	});
	r._s.set(e, y);
	let b = (r._a && r._a.runWithContext || uu)(() => r._e.run(() => (o = Or()).run(() => t({ action: v }))));
	for (let t in b) {
		let n = b[t];
		/* @__PURE__ */ Qi(n) && !_u(n) || /* @__PURE__ */ Gi(n) ? a || (p && hu(n) && (/* @__PURE__ */ Qi(n) ? n.value = p[t] : pu(n, p[t])), r.state.value[e][t] = n) : typeof n == "function" && (b[t] = v(n, t), s.actions[t] = n);
	}
	return gu(y, b), gu(/* @__PURE__ */ z(y), b), Object.defineProperty(y, "$state", {
		get: () => r.state.value[e],
		set: (e) => {
			h((t) => {
				gu(t, e);
			});
		}
	}), r._p.forEach((e) => {
		gu(y, o.run(() => e({
			store: y,
			app: r._a,
			pinia: r,
			options: s
		})));
	}), p && a && n.hydrate && n.hydrate(y.$state, p), l = !0, u = !0, y;
}
function bu(e, t, n) {
	let r, i = typeof t == "function";
	r = i ? n : t;
	function a(n, a) {
		let o = Ua();
		return n ||= o ? Ha(Gl, null) : null, n && Wl(n), n = Ul, n._s.has(e) || (i ? yu(e, t, r, n) : vu(e, r, n)), n._s.get(e);
	}
	return a.$id = e, a;
}
function xu(e) {
	let t = /* @__PURE__ */ z(e), n = {};
	for (let r in t) {
		let i = t[r];
		i.effect ? n[r] = $({
			get: () => e[r],
			set(t) {
				e[r] = t;
			}
		}) : (/* @__PURE__ */ Qi(i) || /* @__PURE__ */ Gi(i)) && (n[r] = /* @__PURE__ */ oa(e, r));
	}
	return n;
}
//#endregion
//#region src/module/apps/npc-builder/functions/create-default-trait-config.ts
function Su() {
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
function Cu(e, t) {
	return `${e}:${ku(t)}`;
}
function wu(e) {
	let t = e.level ?? 1;
	return Number.isFinite(t) ? Math.max(1, Math.floor(t)) * 5 : 5;
}
function Tu(e) {
	return e.name;
}
function Eu(e, t) {
	return e === "characteristic" ? t.allowBaseActorCharacteristics : e === "skill" ? t.allowBaseActorSkills : t.allowBaseActorTalents;
}
function Du(e, t) {
	return {
		...Su(),
		...e,
		...t
	};
}
function Ou(e, t) {
	return ku(e) === ku(t);
}
function ku(e) {
	return e.trim().toLocaleLowerCase();
}
function Au(e) {
	return Number.isFinite(e) ? Math.max(1, Math.floor(e)) : 1;
}
function ju(e) {
	let t = 0;
	for (let n of e) t += n.count;
	return t;
}
function Mu(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = ku(r);
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
//#endregion
//#region src/module/apps/npc-builder/functions/skill-specialization.ts
function Nu(e, t, n) {
	return `${e}:${Ru(t)}:${n}`;
}
function Pu(e, t) {
	let n = e.trim(), r = t.trim();
	return r ? `${n} (${r})` : n;
}
function Fu(e) {
	let t = /^(?<base>.+?)\s*\((?<specialization>[^)]+)\)\s*$/.exec(e.trim());
	if (!t?.groups) return null;
	let n = t.groups.base?.trim() ?? "", r = t.groups.specialization?.trim() ?? "";
	return !n || !r || Iu(e) ? null : {
		baseName: n,
		originalName: e,
		specialization: r
	};
}
function Iu(e) {
	let t = /^(?<base>.+?)\s*\((?<specialization>[^)]+)\)\s*$/.exec(e.trim());
	if (!t?.groups) return null;
	let n = t.groups.base?.trim() ?? "", r = t.groups.specialization?.trim() ?? "", i = Bu(r);
	return !n || !r || !zu(r, i) ? null : {
		baseName: n,
		options: i,
		originalName: e,
		specialization: r
	};
}
function Lu(e, t) {
	let n = /* @__PURE__ */ new Map();
	return t.map((t) => {
		let r = Ru(t), i = n.get(r) ?? 0;
		return n.set(r, i + 1), {
			occurrence: i,
			originalName: t,
			resolutionKey: Nu(e, t, i)
		};
	});
}
function Ru(e) {
	return e.trim().replaceAll(/\s+/g, " ").toLocaleLowerCase();
}
function zu(e, t) {
	return e.trim().toLocaleLowerCase() === "any" || t.length > 1;
}
function Bu(e) {
	return e.split(/\s+or\s+/i).map((e) => e.trim()).filter(Boolean);
}
//#endregion
//#region src/module/apps/npc-builder/functions/advancements/source-counts.ts
function Vu(e, t) {
	return t <= 0 ? [] : [{
		count: t,
		kind: "career",
		label: `${e} extra time`
	}];
}
function Hu(e, t) {
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
//#region src/module/apps/npc-builder/functions/advancements/talent-maximums.ts
function Uu(e, t, n, r) {
	let i = Gu(Wu(e, r), n);
	return i.value === null ? t : Math.min(t, Math.max(0, i.value - e.baseAdvances));
}
function Wu(e, t) {
	let n = t[ku(e.name)];
	return {
		maximumFormula: e.talentMaximumFormula ?? n?.maximumFormula ?? "",
		maximumKey: e.talentMaximumKey ?? n?.maximumKey ?? ""
	};
}
function Gu(e, t) {
	let n = e.maximumKey.trim().toLocaleLowerCase();
	if (!n) return {
		label: "Unknown",
		value: null
	};
	if (n === "none") return {
		label: "-",
		value: null
	};
	if (n === "custom") return Ku(e.maximumFormula, t);
	let r = Number(n);
	if (Number.isFinite(r)) {
		let e = Math.max(0, Math.floor(r));
		return {
			label: `${e}`,
			value: e
		};
	}
	if (O(n)) {
		let e = t[n] ?? 0, r = Math.max(0, Math.floor(e / 10));
		return {
			label: `${D[n]} Bonus (${r})`,
			value: r
		};
	}
	return {
		label: e.maximumKey || "Unknown",
		value: null
	};
}
function Ku(e, t) {
	let n = e.trim(), r = Number(n);
	if (Number.isFinite(r)) {
		let e = Math.max(0, Math.floor(r));
		return {
			label: `${e}`,
			value: e
		};
	}
	let i = /@characteristics\.([a-z]+)\.bonus/i.exec(n)?.[1]?.toLocaleLowerCase();
	if (i && O(i)) {
		let e = t[i] ?? 0, n = Math.max(0, Math.floor(e / 10));
		return {
			label: `${D[i]} Bonus (${n})`,
			value: n
		};
	}
	return {
		label: n || "Custom",
		value: null
	};
}
//#endregion
//#region src/module/apps/npc-builder/functions/advancements/career-grants.ts
function qu(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e.careers) {
		let i = Mu(Xu(r, t, e.skillGrantResolutions)), a = wu(r) / 5, o = Math.max(0, Au(r.quantity) - 1) * 5;
		for (let e of i) {
			let i = Cu(t, e), s = n.get(i);
			if (s) {
				a > s.highestLevel && (s.highestLevel = a, s.highestLevelSource = Tu(r)), o > 0 && s.extraSources.push({
					count: o,
					kind: "career",
					label: `${r.name} extra time`
				});
				continue;
			}
			n.set(i, {
				extraSources: Vu(r.name, o),
				highestLevel: a,
				highestLevelSource: Tu(r),
				name: e
			});
		}
	}
	for (let r of n.values()) Yu(e, {
		careerValue: r.highestLevel * 5 + ju(r.extraSources),
		kind: t,
		name: r.name,
		sources: [{
			count: r.highestLevel * 5,
			kind: "career",
			label: r.highestLevelSource
		}, ...r.extraSources]
	});
}
function Ju(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.careers) {
		let r = Mu(Xu(n, "talent", e.skillGrantResolutions)), i = Math.max(0, Au(n.quantity) - 1);
		for (let e of r) {
			let r = Cu("talent", e), a = t.get(r);
			if (a) {
				i > 0 && a.extraSources.push({
					count: i,
					kind: "career",
					label: `${n.name} extra time`
				});
				continue;
			}
			t.set(r, {
				extraSources: Vu(n.name, i),
				firstSource: n.name,
				name: e
			});
		}
	}
	for (let n of t.values()) Yu(e, {
		careerValue: 1 + ju(n.extraSources),
		kind: "talent",
		name: n.name,
		sources: [{
			count: 1,
			kind: "career",
			label: n.firstSource
		}, ...n.extraSources]
	}, e.characteristicTotals);
}
function Yu(e, t, n = {}) {
	let r = Cu(t.kind, t.name), i = e.entries.get(r);
	if (i) {
		let r = t.kind === "talent" && i.includedFromBase ? t.sources.slice(1) : t.sources, a = t.kind === "talent" ? Uu(i, ju(r), n, e.talentMaximums) : t.careerValue;
		i.careerValue = a, i.includedFromCareer = !0, i.sources = [...i.sources.filter((e) => e.kind === "base"), ...Hu(r, a)];
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
	t.kind === "talent" && (a.careerValue = Uu(a, t.careerValue, n, e.talentMaximums), a.current = a.careerValue, a.sources = Hu(t.sources, a.careerValue)), e.entries.set(r, { ...a });
}
function Xu(e, t, n) {
	return t === "characteristic" ? e.grants.characteristics : t === "skill" ? Lu(e.uuid, e.grants.skills).map((e) => n[e.resolutionKey] || e.originalName) : e.grants.talents;
}
//#endregion
//#region src/module/apps/npc-builder/functions/advancements/entry-context.ts
function Zu(e, t) {
	let n = {};
	for (let r of e.values()) {
		if (r.kind !== "characteristic") continue;
		let e = ee[ku(r.name)];
		if (!e) continue;
		let i = t[Cu(r.kind, r.name)] ?? 0, a = Math.max(r.minimumCurrent, Math.floor(r.careerValue + i));
		n[e] = Math.max(0, r.baseValue + a);
	}
	return n;
}
function Qu(e, t, n) {
	return e.kind === "skill" ? $u(e, t, n) : e.kind === "talent" ? ed(e, t, n) : e;
}
function $u(e, t, n) {
	let r = td(e) ?? nd(e.name, n.skillCharacteristics) ?? rd(e.name, n.baseActorDraftData);
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
function ed(e, t, n) {
	let r = Wu(e, n.talentMaximums), i = Gu(r, t);
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
function td(e) {
	return !e.characteristicKey || !e.characteristicName ? null : {
		characteristicKey: e.characteristicKey,
		characteristicName: e.characteristicName,
		skillName: e.name
	};
}
function nd(e, t) {
	return t[ku(e)] ?? null;
}
function rd(e, t) {
	let n = t.advancements.find((t) => t.kind === "skill" && Ou(t.name, e));
	return n?.characteristicKey ? {
		characteristicKey: n.characteristicKey,
		characteristicName: n.characteristicName ?? D[n.characteristicKey],
		skillName: e
	} : null;
}
//#endregion
//#region src/module/apps/npc-builder/functions/advancements/derive-advancements.ts
function id(e) {
	let t = ld(e.baseActorDraftData), n = {
		careers: e.careers,
		entries: t,
		skillGrantResolutions: e.skillGrantResolutions,
		talentMaximums: e.talentMaximums
	};
	qu(n, "characteristic"), qu(n, "skill");
	let r = Zu(t, e.manualAdvancementDeltas);
	return Ju({
		...n,
		characteristicTotals: r
	}), ud(t, e.customAdvancements), [...t.values()].filter((t) => t.includedFromCareer || t.includedFromCustom || Eu(t.kind, e.settings)).map((t) => {
		let n = Qu(t, r, e), i = Cu(t.kind, t.name), a = e.manualAdvancementDeltas[i] ?? 0, o = n.careerValue + a;
		return {
			...n,
			current: Math.max(n.minimumCurrent, Math.floor(o))
		};
	}).sort(dd);
}
function ad(e, t) {
	let n = Number.isFinite(t) ? t : 0;
	return Math.max(e.minimumCurrent, Math.floor(n)) - e.careerValue;
}
function od(e, t) {
	let n = Number.isFinite(t) ? t : 0;
	return ad(e, Math.max(e.minimumTotal, Math.floor(n)) - e.baseValue);
}
function sd(e, t) {
	return {
		...e,
		...Object.fromEntries(t.map((e) => [ku(e.skillName), e]))
	};
}
function cd(e, t) {
	return {
		...e,
		...Object.fromEntries(t.map((e) => [ku(e.talentName), e]))
	};
}
function ld(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.advancements) {
		let e = Cu(n.kind, n.name), r = {
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
		n.baseModifier !== void 0 && (r.baseModifier = n.baseModifier), n.characteristicKey && (r.characteristicKey = n.characteristicKey, r.characteristicName = n.characteristicName ?? D[n.characteristicKey]), n.kind === "talent" && n.baseAdvances > 0 && r.sources.push({
			count: n.baseAdvances,
			kind: "base",
			label: "Base"
		}), n.talentMaximumFormula && (r.talentMaximumFormula = n.talentMaximumFormula), n.talentMaximumKey && (r.talentMaximumKey = n.talentMaximumKey), t.set(e, r);
	}
	return t;
}
function ud(e, t) {
	for (let n of t) {
		let t = Cu(n.kind, n.name), r = {
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
			...n.characteristicKey ? { characteristicKey: n.characteristicKey } : {},
			...n.characteristicName ? { characteristicName: n.characteristicName } : {},
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
			...n.talentMaximumFormula ? { talentMaximumFormula: n.talentMaximumFormula } : {},
			...n.talentMaximumKey ? { talentMaximumKey: n.talentMaximumKey } : {}
		});
	}
}
function dd(e, t) {
	return e.kind === t.kind ? e.name.localeCompare(t.name) : e.kind.localeCompare(t.kind);
}
//#endregion
//#region src/module/apps/npc-builder/functions/advancements/advancement-actions.ts
function fd(e) {
	return e.kind === "talent" ? 1 : 5;
}
function pd(e) {
	return Math.max(e.minimumTotal, e.baseValue + e.current);
}
function md(e, t) {
	return pd(e) + t * fd(e);
}
function hd(e) {
	return pd(e);
}
function gd(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" && hd(e) < t;
}
function _d(e) {
	return e.filter((e) => e.kind === "talent" && gd(e)).map((e) => ({
		kind: e.kind,
		name: e.name,
		total: e.talentMaximumValue
	}));
}
function vd(e, t) {
	let n = new Map(e.map((e) => [bd(e), e])), r = [];
	for (let e of t) {
		let t = n.get(bd(e));
		!t || t.current === e.current || r.push({
			current: e.current,
			kind: t.kind,
			name: t.name
		});
	}
	return r;
}
function yd(e, t) {
	return e.find((e) => e.kind === t.kind && e.name === t.name) ?? null;
}
function bd(e) {
	return `${e.kind}:${e.name}`;
}
//#endregion
//#region src/module/apps/npc-builder/functions/xp-cost.ts
var xd = {
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
function Sd(e) {
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
		let e = Md(r), i = e + r.current;
		if (r.kind === "characteristic") {
			let a = ee[ku(r.name)];
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
	return Cd(n, t);
}
function Cd(e, t) {
	let n = Dd(e, t), r = Od(e.skills, t.skills, xd.skill), i = kd(e.talents, t.talents);
	return {
		characteristics: n,
		skills: r,
		talents: i,
		total: n + r + i
	};
}
function wd(e) {
	let t = Math.max(0, Math.floor(e.current));
	return e.kind === "talent" ? Ed(t) : Td(t, e.kind === "characteristic" ? xd.characteristic : xd.skill);
}
function Td(e, t) {
	let n = Math.max(0, Math.floor(e)), r = 0;
	for (let e = 0; e < n; e += 1) {
		let n = Math.min(Math.floor(e / 5), t.length - 1);
		r += t[n] ?? 0;
	}
	return r;
}
function Ed(e, t = 0) {
	let n = Math.max(0, Math.floor(e)), r = Math.max(0, Math.floor(t)), i = 0;
	for (let e = 0; e < n; e += 1) i += (r + e + 1) * 100;
	return i;
}
function Dd(e, t) {
	let n = 0;
	for (let r of Object.keys(D)) {
		let i = r, a = jd(e.characteristics[i] ?? 0, t.characteristics[i] ?? 0);
		n += Td(a, xd.characteristic);
	}
	return n;
}
function Od(e, t, n) {
	let r = Ad(e), i = Ad(t), a = 0;
	for (let [e, t] of r) {
		let r = jd(t, i.get(e) ?? 0);
		a += Td(r, n);
	}
	return a;
}
function kd(e, t) {
	let n = Ad(e), r = Ad(t), i = 0;
	for (let [e, t] of n) {
		let n = jd(t, r.get(e) ?? 0);
		i += Ed(n);
	}
	return i;
}
function Ad(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = ku(n.name), r = Math.floor(n.value);
		e && t.set(e, (t.get(e) ?? 0) + r);
	}
	return t;
}
function jd(e, t) {
	return Math.max(0, Math.floor(e) - Math.floor(t));
}
function Md(e) {
	return e.kind === "characteristic" ? Math.floor(e.baseValue) : e.kind === "skill" ? Math.floor(e.baseAdvances + (e.baseModifier ?? 0)) : Math.floor(e.baseAdvances);
}
//#endregion
//#region src/module/apps/npc-builder/state/advancements/index.ts
function Nd(e) {
	let { baseActorDraftData: t, careers: n, customAdvancements: r, manualAdvancementDeltas: i, settings: a, skillCharacteristics: o, skillGrantResolutions: s, talentMaximums: c } = e, l = $(() => id({
		baseActorDraftData: t.value,
		careers: n.value,
		customAdvancements: r.value,
		manualAdvancementDeltas: i.value,
		settings: a.value,
		skillCharacteristics: o.value,
		skillGrantResolutions: s.value,
		talentMaximums: c.value
	})), u = $(() => Sd(l.value)), d = $(() => _d(l.value).length);
	function f(e) {
		let t = Cu(e.kind, e.name);
		r.value.some((e) => Cu(e.kind, e.name) === t) || r.value.push(e);
	}
	function p(e) {
		let t = Cu(e.kind, e.name);
		r.value = r.value.filter((e) => Cu(e.kind, e.name) !== t), delete i.value[t];
	}
	function m(e, t) {
		x(e, md(e, t));
	}
	function h() {
		for (let e of _d(l.value)) {
			let t = yd(l.value, e);
			t && x(t, e.total);
		}
	}
	function g(e, t) {
		let n = Math.max(0, Math.floor(Number.isFinite(t) ? t : 0)), r = e.run({ advancements: l.value }, n), i = vd(l.value, r.advancements);
		for (let e of i) {
			let t = yd(l.value, e);
			t && b(t, e.current);
		}
	}
	function _(e) {
		return s.value[e] ?? "";
	}
	function v(e) {
		o.value = sd(o.value, e);
	}
	function y(e) {
		c.value = cd(c.value, e);
	}
	function b(e, t) {
		let n = Cu(e.kind, e.name);
		i.value[n] = ad(e, t);
	}
	function x(e, t) {
		let n = Cu(e.kind, e.name);
		i.value[n] = od(e, t);
	}
	function S(e) {
		let t = Cu(e.kind, e.name);
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
	function T(e) {
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
		removeSkillGrantResolutionsForCareer: T,
		resetAdvancementCurrent: S,
		resetAllAdvancementCurrents: C,
		setAdvancementCurrent: b,
		setAdvancementTotal: x,
		setSkillGrantResolution: w
	};
}
//#endregion
//#region src/module/apps/npc-builder/functions/draft-summary.ts
function Pd(e, t) {
	return e.find((e) => e.uuid === t) ?? null;
}
function Fd(e) {
	return e.at(-1) ?? null;
}
function Id(e) {
	let t = e.finalCareer?.name, n = e.settings.includeSpeciesInName && e.selectedBaseActor?.species ? e.selectedBaseActor.species : "";
	return t && n ? `${n} ${t}` : t || (e.selectedBaseActor ? `${e.selectedBaseActor.name} NPC` : "New NPC");
}
function Ld(e, t) {
	return e.trim() || t;
}
function Rd(e) {
	return e.finalCareer?.img || e.selectedBaseActor?.prototypeTokenImg || e.selectedBaseActor?.img || "";
}
function zd(e, t) {
	return e || t;
}
function Bd(e) {
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
//#region src/module/apps/npc-builder/state/draft.ts
function Vd(e) {
	let { actorName: t, baseActors: n, careers: r, clearBaseDraftData: i, clearMountSelection: a, customAdvancements: o, customSpells: s, customTraits: c, customTrappings: l, detectedSpells: u, ignoredBaseTraitKeys: d, magicLoreResolutions: f, removeSkillGrantResolutionsForCareer: p, selectedBaseActorUuid: m, selectedPortraitPath: h, settings: g, skillGrantResolutions: _, spellSelectionOverrides: v } = e, y = $(() => Pd(n.value, m.value)), b = $(() => Fd(r.value)), x = $(() => Id({
		finalCareer: b.value,
		selectedBaseActor: y.value,
		settings: g.value
	})), S = $(() => Ld(t.value, x.value)), C = $(() => Rd({
		finalCareer: b.value,
		selectedBaseActor: y.value
	})), w = $(() => zd(h.value, C.value)), T = $(() => Bd(r.value));
	function E(e) {
		let t = r.value.find((t) => t.uuid === e.uuid);
		if (t) {
			t.quantity = Au(t.quantity + 1);
			return;
		}
		r.value.push({
			...e,
			quantity: 1
		});
	}
	function D(e) {
		return r.value.some((t) => t.uuid === e.uuid) ? !1 : (r.value.push({
			...e,
			quantity: 1
		}), !0);
	}
	function ee(e, t) {
		let n = e + t, i = r.value[e];
		!i || n < 0 || n >= r.value.length || (r.value.splice(e, 1), r.value.splice(n, 0, i));
	}
	function O(e, t) {
		let n = r.value[e];
		!n || e === t || t < 0 || t >= r.value.length || (r.value.splice(e, 1), r.value.splice(t, 0, n));
	}
	function te(e) {
		let [t] = r.value.splice(e, 1);
		t && p(t.uuid);
	}
	function k() {
		for (let e of r.value) p(e.uuid);
		r.value = [];
	}
	function ne() {
		t.value = "", k(), o.value = [], c.value = [], l.value = [], s.value = [], u.value = [], d.value = {}, f.value = {}, h.value = "", _.value = {}, v.value = {}, m.value = "", i(), a();
	}
	function A(e) {
		n.value.some((t) => t.uuid === e.uuid) || n.value.push(e), re(e.uuid);
	}
	function re(e) {
		let t = e.trim();
		m.value !== t && (h.value = ""), m.value = t;
	}
	function ie(e) {
		h.value = e;
	}
	function ae(e, t) {
		let n = r.value[e];
		n && (n.quantity = Au(t));
	}
	return {
		addCareer: E,
		addCareerIfMissing: D,
		clearCareers: k,
		finalActorName: S,
		finalCareer: b,
		finalPortraitPath: w,
		grantTotals: T,
		moveCareer: ee,
		moveCareerToIndex: O,
		removeCareer: te,
		resetDraft: ne,
		selectBaseActor: A,
		selectBaseActorUuid: re,
		selectedBaseActor: y,
		selectPortrait: ie,
		setCareerQuantity: ae,
		suggestedActorName: x
	};
}
//#endregion
//#region src/module/apps/npc-builder/state/hydration.ts
function Hd(e) {
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
//#region src/module/apps/npc-builder/state/mount.ts
function Ud(e) {
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
//#region src/module/functions/portrait-gallery/source-filters.ts
function Wd(e) {
	return e.sourceFilter ? e.sourceFilter : e.sourceGroup ? {
		label: qd(e.sourceGroup),
		value: e.sourceGroup
	} : null;
}
function Gd(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = Wd(n);
		e && !t.has(e.value) && t.set(e.value, e);
	}
	return [...t.values()];
}
function Kd(e) {
	return {
		label: `Priority Folder: ${e.split("/").filter(Boolean).slice(-2).join("/") || e}`,
		value: `priority-folder:${e.toLocaleLowerCase()}`
	};
}
function qd(e) {
	return {
		career: "Career",
		compendiums: "Compendiums",
		"dig-down": "Dig Down",
		"priority-folders": "Priority Folders",
		world: "World"
	}[e];
}
//#endregion
//#region src/module/functions/portrait-gallery/candidate-collection.ts
function Jd(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = Qd(r.img);
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
function Yd(e) {
	let t = Jd(Xd([...e.assetCandidates, ...e.immediateCandidates]));
	return !e.selectedPortraitPath || t.some((t) => Qd(t.img) === Qd(e.selectedPortraitPath)) ? t : [{
		img: e.selectedPortraitPath,
		key: `selected:${e.selectedPortraitPath}`,
		label: "Selected portrait",
		source: "foundry-asset",
		sourceLabel: "Selected"
	}, ...t];
}
function Xd(e) {
	return e.map((e, t) => ({
		candidate: e,
		index: t
	})).sort((e, t) => Zd(e.candidate) - Zd(t.candidate) || e.index - t.index).map(({ candidate: e }) => e);
}
function Zd(e) {
	return e.sourceFilter?.value.startsWith("priority-folder:") ? 0 : e.sourceGroup ? {
		career: 1,
		compendiums: 2,
		world: 3,
		"dig-down": 4
	}[e.sourceGroup] ?? 5 : 5;
}
function Qd(e) {
	return e.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/functions/portrait-gallery/index.ts
var $d = new Set([
	"and",
	"any",
	"the",
	"with",
	"without",
	"of",
	"or",
	"npc"
]), ef = "portrait-gallery-filter:", tf = "modules/wfrp4e-core/art/careers", nf = [
	"modules/wfrp4e-core/art/bestiary",
	"modules/wfrp4e-core/tokens",
	"modules/wfrp4e-core/tokens/popout"
], rf = ["systems/wfrp4e/tokens/unknown.png"], af = "application/x-wfrp4e-customizer-portrait-filter-tag";
function of(e) {
	return wf(Cf(e).filter((e) => e.length >= 3 && !$d.has(e)));
}
function sf(e) {
	return wf(e.flatMap(of));
}
function cf(e) {
	if (!Array.isArray(e)) return [];
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		if (typeof r != "string") continue;
		let e = r.trim().replaceAll("\\", "/").replace(/^\/+|\/+$/gu, ""), i = e.toLocaleLowerCase();
		e && !t.has(i) && (t.add(i), n.push(e));
	}
	return n;
}
function lf(e) {
	return cf([
		...e.hasCareer ? [tf] : [],
		...nf,
		...e.configuredFolders
	]);
}
function uf(e, t, n) {
	return e.filter((e) => (t[e] ?? "search") === n);
}
function df(e, t) {
	let n = Sf(e);
	return !!(n && t.some((e) => n.includes(e)));
}
function ff(e, t) {
	let n = xf(e), r = Wd(e), i = t.mustIncludeSources.length === 0 || r !== null && t.mustIncludeSources.includes(r.value), a = r !== null && t.mustExcludeSources.includes(r.value);
	return t.mustIncludeTerms.every((e) => n.includes(e)) && t.mustExcludeTerms.every((e) => !n.includes(e)) && i && !a;
}
function pf(e) {
	return `${ef}${e}`;
}
function mf(e) {
	return e.startsWith(ef) ? e.slice(24) : null;
}
function hf(e) {
	return e.hasEnabledSource && e.hasSubject && e.searchTerms.length > 0;
}
function gf(e) {
	return e ? e.maxDirectories <= 0 ? e.phase === "ready" ? 100 : 4 : Math.min(100, Math.round(e.directoriesVisited / e.maxDirectories * 100)) : 0;
}
function _f(e) {
	return e ? e.phase === "ready" ? `${e.candidatesFound} options found` : e.phase === "filesystem" ? e.maxDirectories <= 0 ? `${e.directoriesVisited} directories - ${e.currentLocation}` : `${e.directoriesVisited}/${e.maxDirectories} directories - ${e.currentLocation}` : e.currentLocation : "";
}
function vf(e) {
	return `${e.label}\n${e.img}`;
}
function yf(e) {
	return `Use ${e.label} (${bf(e)})`;
}
function bf(e) {
	return e.sourceLabel ?? {
		"base-actor": "Actor Portrait",
		"base-token": "Prototype Token",
		career: "Career",
		"foundry-asset": "Foundry",
		web: "Web"
	}[e.source];
}
function xf(e) {
	return Sf([
		e.label,
		e.img,
		e.sourceLabel ?? ""
	].filter(Boolean).join(" "));
}
function Sf(e) {
	return e.trim().toLocaleLowerCase().replaceAll(/[_-]/g, " ").replaceAll(/[(),.:;[\]]/g, " ").replaceAll(/\s+/g, " ");
}
function Cf(e) {
	return Sf(e).split(" ").filter(Boolean);
}
function wf(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/module/state/portrait-gallery/filters.ts
function Tf() {
	let e = /* @__PURE__ */ B([]), t = /* @__PURE__ */ B({}), n = /* @__PURE__ */ B({});
	function r(t) {
		let r = new Set(e.value), i = of(t).filter((e) => !r.has(e));
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
//#region src/module/apps/npc-builder/state/portraits.ts
function Ef() {
	return Tf();
}
//#endregion
//#region src/module/apps/npc-builder/functions/default-npc-builder-settings.ts
function Df() {
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
		excludedPortraitReferenceImages: [...rf],
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
//#region src/module/apps/npc-builder/state/settings.ts
var Of = Df(), kf = {
	advancements: [],
	optionalTraits: [],
	traits: [],
	trappings: []
}, Af = /\(([^)]+)\)/, jf = [
	"beasts",
	"death",
	"fire",
	"heavens",
	"metal",
	"life",
	"light",
	"shadow"
], Mf = [
	"daemonology",
	"necromancy",
	"nurgle",
	"slaanesh",
	"tzeentch",
	"undivided"
];
function Nf(e, t) {
	let n = e.trim(), r = n.toLocaleLowerCase();
	return r === "petty magic" ? Bf({
		kind: "petty-magic",
		rawLore: "Petty Magic",
		source: t,
		sourceName: n
	}) : r.startsWith("arcane magic") ? Bf({
		kind: "arcane-magic",
		rawLore: Vf(n),
		source: t,
		sourceName: n
	}) : r.startsWith("spellcaster") ? Bf({
		kind: "spellcaster",
		rawLore: Vf(n),
		source: t,
		sourceName: n
	}) : null;
}
function Pf(e) {
	return e.trim().replace(/^any\s+/i, "").replace(/^arcane\s+lore\s+of\s+/i, "").replace(/^arcane\s+lore$/i, "").replace(/^lore\s+of\s+/i, "").replaceAll(/\s+/g, " ").toLocaleLowerCase();
}
function Ff(e) {
	return `${e.source}:${e.kind}:${e.sourceName}:${e.rawLore}`;
}
function If(e, t) {
	return {
		...e,
		isAmbiguous: !1,
		normalizedLore: Pf(t),
		rawLore: t.trim()
	};
}
function Lf(e) {
	let t = Pf(e);
	return t === "petty" ? "petty" : jf.includes(t) ? "eight-wind" : Mf.includes(t) ? "dark" : "other";
}
function Rf(e, t) {
	if (e.kind === "petty-magic") return t.filter((e) => e.category === "petty");
	let n = e.rawLore.trim().toLocaleLowerCase();
	return n.includes("dark") ? t.filter((e) => e.category === "dark") : n.includes("eight winds") ? t.filter((e) => e.category === "eight-wind") : t.filter((e) => e.category !== "petty");
}
function zf(e) {
	let t = e.trim().toLocaleLowerCase();
	return !t || t === "any" || t.includes("any ");
}
function Bf(e) {
	let t = e.rawLore.trim();
	return {
		isAmbiguous: zf(t),
		kind: e.kind,
		normalizedLore: Pf(t),
		rawLore: t,
		resolutionKey: Ff({
			kind: e.kind,
			rawLore: t,
			source: e.source,
			sourceName: e.sourceName
		}),
		source: e.source,
		sourceName: e.sourceName
	};
}
function Vf(e) {
	return Af.exec(e)?.[1]?.trim() ?? "";
}
//#endregion
//#region src/module/apps/npc-builder/functions/spells/derive-magic-grants.ts
function Hf(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.advancements) n.kind !== "talent" || n.baseAdvances + n.current <= 0 || Uf(t, Nf(n.name, "talent"), e);
	for (let n of e.traits) Uf(t, Nf(n.name, "trait"), e);
	return [...t.values()];
}
function Uf(e, t, n) {
	if (!t) return;
	let r = n.loreResolutions[t.resolutionKey];
	e.set(t.resolutionKey, r ? If(t, r) : t);
}
//#endregion
//#region src/module/apps/npc-builder/functions/spells/derive-spells.ts
function Wf(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.detectedSpells) t.set(n.key, {
		...n,
		selected: e.selectionOverrides[n.key] ?? e.autoSelectDetectedSpells
	});
	for (let n of e.customSpells) t.set(n.key, {
		...n,
		selected: e.selectionOverrides[n.key] ?? n.selected
	});
	return [...t.values()].sort(Yf);
}
function Gf(e) {
	return e.filter((e) => e.selected);
}
function Kf(e) {
	return e.spells.map((t) => ({
		...t,
		selected: e.selectionOverrides[t.key] ?? e.autoSelectDetectedSpells
	}));
}
function qf(e) {
	let t = e.detectedSpells.find((t) => Jf(t, e.spell));
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
function Jf(e, t) {
	return e.sourceUuid && e.sourceUuid === t.sourceUuid ? !0 : Ou(e.name, t.name);
}
function Yf(e, t) {
	return e.loreName === t.loreName ? e.name.localeCompare(t.name) : e.loreName.localeCompare(t.loreName);
}
//#endregion
//#region src/module/apps/npc-builder/state/spells.ts
function Xf(e) {
	let { advancements: t, customSpells: n, detectedSpells: r, magicLoreResolutions: i, settings: a, spellSelectionOverrides: o, traits: s } = e, c = $(() => Hf({
		advancements: t.value,
		loreResolutions: i.value,
		traits: s.value
	})), l = $(() => c.value.length > 0), u = $(() => Wf({
		autoSelectDetectedSpells: a.value.autoSelectGrantedSpells,
		customSpells: n.value,
		detectedSpells: r.value,
		selectionOverrides: o.value
	})), d = $(() => Gf(u.value));
	function f(e) {
		let t = qf({
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
		r.value = Kf({
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
//#region src/module/apps/npc-builder/functions/traits/derive-traits.ts
function Zf(e) {
	let t = /* @__PURE__ */ new Map();
	if (e.allowBaseActorTraits) for (let n of e.baseActorDraftData.traits) {
		let r = tp(n);
		e.ignoredBaseTraitKeys[r] || t.set(r, ip(n, r, !1));
	}
	for (let n of e.customTraits) rp([...t.values()], n.name) || t.set(n.key, { ...n });
	return [...t.values()].map((t) => ({
		...t,
		config: Du(t.config, e.traitConfigOverrides[t.key])
	})).sort(ap);
}
function Qf(e) {
	return e.allowBaseActorTraits ? [...e.baseActorDraftData.traits.filter((t) => e.ignoredBaseTraitKeys[tp(t)]).map((t) => {
		let n = tp(t);
		return {
			...ip(t, n, !0),
			config: Du(t.config, e.traitConfigOverrides[n])
		};
	}), ...e.selectedTraits] : e.selectedTraits;
}
function $f(e) {
	return e.optionalTraits.map((e) => ({
		config: e.config,
		img: e.img,
		name: e.name,
		uuid: e.uuid
	})).sort((e, t) => e.name.localeCompare(t.name));
}
function ep(e, t) {
	return {
		config: t.config,
		ignored: !1,
		key: `${e}:${t.uuid || ku(t.name)}`,
		name: t.name,
		source: e,
		sourceUuid: t.uuid
	};
}
function tp(e) {
	return `base:${e.uuid || ku(e.name)}`;
}
function np(e, t) {
	return e.find((e) => Ou(e.name, t));
}
function rp(e, t) {
	return np(e, t) !== void 0;
}
function ip(e, t, n) {
	return {
		config: e.config,
		ignored: n,
		key: t,
		name: e.name,
		source: "base",
		sourceUuid: e.uuid
	};
}
function ap(e, t) {
	return e.source === t.source ? e.name.localeCompare(t.name) : e.source.localeCompare(t.source);
}
//#endregion
//#region src/module/apps/npc-builder/state/traits.ts
function op(e) {
	let { baseActorDraftData: t, customTraits: n, ignoredBaseTraitKeys: r, quickTraits: i, settings: a, traitConfigOverrides: o } = e, s = $(() => Zf({
		allowBaseActorTraits: a.value.allowBaseActorTraits,
		baseActorDraftData: t.value,
		customTraits: n.value,
		ignoredBaseTraitKeys: r.value,
		traitConfigOverrides: o.value
	})), c = $(() => Qf({
		allowBaseActorTraits: a.value.allowBaseActorTraits,
		baseActorDraftData: t.value,
		ignoredBaseTraitKeys: r.value,
		selectedTraits: s.value,
		traitConfigOverrides: o.value
	})), l = $(() => $f(t.value));
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
		let i = ep(e, t);
		if (!r) {
			d(i.key), x(t.name, !0);
			return;
		}
		x(t.name, !1) || n.value.find((e) => e.key === i.key) || h(i);
	}
	function h(e) {
		rp(s.value, e.name) || n.value.some((t) => t.key === e.key) || n.value.push(e);
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
		return np(l.value, e);
	}
	function y(e) {
		return np(i.value, e);
	}
	function b(e) {
		let n = np(t.value.traits, e);
		if (!n) return null;
		let i = tp(n);
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
//#region src/module/apps/npc-builder/functions/trapping-resolution.ts
function sp(e, t = "trapping") {
	return {
		candidates: [],
		searchTerms: dp(e),
		selectedCandidateUuid: "",
		selectedItemType: t,
		selectedName: e.trim(),
		status: "fallback"
	};
}
function cp(e) {
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
function lp(e) {
	return {
		candidates: [],
		searchTerms: dp(e),
		selectedCandidateUuid: "",
		selectedItemType: "trapping",
		selectedName: e.trim(),
		status: "unresolved"
	};
}
function up(e, t) {
	let n = dp(e), r = pp(n, t), i = r.filter((e) => e.matchKind === "exact");
	return i.length === 1 ? hp("matched", n, i[0]) : i.length > 1 ? hp("ambiguous", n, i[0], { candidates: r }) : r.length ? {
		candidates: r,
		searchTerms: n,
		selectedCandidateUuid: "",
		selectedItemType: "trapping",
		selectedName: e.trim(),
		status: "ambiguous"
	} : sp(e);
}
function dp(e) {
	let t = e.split(/\s+or\s+/i).map((e) => e.trim()).filter(Boolean);
	return t.length ? yp(t) : [e.trim()].filter(Boolean);
}
function fp(e, t) {
	if (gp(e) === gp(t)) return "exact";
	let n = _p(e), r = _p(t);
	if (!n || !r) return null;
	if (n === r || n.includes(r) || r.includes(n)) return "near";
	let i = n.split(" "), a = new Set(r.split(" "));
	return i.every((e) => a.has(e)) ? "near" : null;
}
function pp(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) for (let e of t) {
		let t = fp(r, e.name);
		t && n.get(e.uuid)?.matchKind !== "exact" && n.set(e.uuid, {
			itemType: e.itemType,
			matchKind: t,
			name: e.name,
			searchTerm: r,
			sourceLabel: e.sourceLabel,
			uuid: e.uuid
		});
	}
	return [...n.values()].sort(mp);
}
function mp(e, t) {
	return e.matchKind === t.matchKind ? e.name.localeCompare(t.name) : e.matchKind === "exact" ? -1 : 1;
}
function hp(e, t, n, r = {}) {
	return {
		candidates: r.candidates ?? (n ? [n] : []),
		searchTerms: t,
		selectedCandidateUuid: n?.uuid ?? "",
		selectedItemType: n?.itemType ?? "trapping",
		selectedName: n?.name ?? "",
		status: e
	};
}
function gp(e) {
	return e.trim().toLocaleLowerCase().replaceAll(/\s+/g, " ");
}
function _p(e) {
	return gp(e).replaceAll("&", " and ").replaceAll(/[(),.:;[\]]/g, " ").replaceAll(/\b(a|an|the|some|pair of|pairs of)\b/g, " ").split(/\s+/).map(vp).filter(Boolean).join(" ");
}
function vp(e) {
	return e.endsWith("ies") && e.length > 4 ? `${e.slice(0, -3)}y` : e.endsWith("s") && !e.endsWith("ss") && e.length > 3 ? e.slice(0, -1) : e;
}
function yp(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/module/apps/npc-builder/functions/trappings/derive-trappings.ts
function bp(e) {
	let t = /* @__PURE__ */ new Map();
	Cp(t, e), wp(t, e);
	for (let n of e.customTrappings) t.set(n.key, { ...n });
	return [...t.values()].map((t) => Tp(t, e)).sort(Ep);
}
function xp(e, t) {
	let n = e.resolution.candidates.find((e) => e.uuid === t);
	return n ? {
		...e.resolution,
		selectedCandidateUuid: n.uuid,
		selectedItemType: n.itemType,
		selectedName: n.name,
		status: e.resolution.status === "matched" ? "matched" : "ambiguous"
	} : null;
}
function Sp(e) {
	return {
		...sp(e.name, e.itemType),
		candidates: e.resolution.candidates,
		searchTerms: e.resolution.searchTerms
	};
}
function Cp(e, t) {
	if (t.settings.allowBaseActorTrappings) for (let n of t.baseActorDraftData.trappings) {
		let t = `base:${n.uuid || ku(n.name)}`;
		e.set(t, {
			ignored: !1,
			itemType: n.itemType,
			key: t,
			name: n.name,
			quantity: n.quantity,
			resolution: cp({
				itemType: n.itemType,
				name: n.name,
				uuid: n.uuid
			}),
			source: "base",
			sourceUuid: n.uuid
		});
	}
}
function wp(e, t) {
	for (let n of t.careers) for (let r of n.grants.trappings) {
		let i = `career:${ku(r)}`, a = e.get(i);
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
			resolution: t.trappingResolutionOverrides[i] ?? lp(r),
			source: "career",
			sourceUuid: ""
		});
	}
}
function Tp(e, t) {
	let n = t.trappingOverrides[e.key];
	return {
		...e,
		ignored: n?.ignored ?? e.ignored,
		quantity: Au(n?.quantity ?? e.quantity),
		resolution: t.trappingResolutionOverrides[e.key] ?? e.resolution
	};
}
function Ep(e, t) {
	return e.source === t.source ? e.name.localeCompare(t.name) : e.source.localeCompare(t.source);
}
//#endregion
//#region src/module/apps/npc-builder/state/trappings.ts
function Dp(e) {
	let { baseActorDraftData: t, careers: n, customTrappings: r, settings: i, trappingOverrides: a, trappingResolutionOverrides: o } = e, s = $(() => bp({
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
			quantity: Au(t)
		};
	}
	function f(e, t) {
		let n = s.value.find((t) => t.key === e), r = n ? xp(n, t) : null;
		r && (o.value[e] = r);
	}
	function p(e) {
		let t = s.value.find((t) => t.key === e);
		t && (o.value[e] = Sp(t));
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
//#region src/module/apps/npc-builder/state/index.ts
var Op = bu("npc-builder", () => {
	let e = /* @__PURE__ */ B(""), t = /* @__PURE__ */ B([]), n = /* @__PURE__ */ B({}), r = /* @__PURE__ */ B(null), i = /* @__PURE__ */ B({ ...kf }), a = /* @__PURE__ */ B([]), o = /* @__PURE__ */ B([]), s = /* @__PURE__ */ B([]), c = /* @__PURE__ */ B([]), l = /* @__PURE__ */ B([]), u = /* @__PURE__ */ B(null), d = /* @__PURE__ */ B([]), f = /* @__PURE__ */ B([]), p = /* @__PURE__ */ B(""), m = /* @__PURE__ */ B({ ...Of }), h = /* @__PURE__ */ B(""), g = /* @__PURE__ */ B(""), _ = /* @__PURE__ */ B({}), v = /* @__PURE__ */ B({}), y = /* @__PURE__ */ B({}), b = /* @__PURE__ */ B([]), x = /* @__PURE__ */ B([]), S = /* @__PURE__ */ B([]), C = /* @__PURE__ */ B({}), w = /* @__PURE__ */ B({}), T = /* @__PURE__ */ B({}), E = /* @__PURE__ */ B({}), D = /* @__PURE__ */ B({}), ee = /* @__PURE__ */ B({}), O = Nd({
		baseActorDraftData: i,
		careers: o,
		customAdvancements: S,
		manualAdvancementDeltas: n,
		settings: m,
		skillCharacteristics: _,
		skillGrantResolutions: y,
		talentMaximums: v
	}), te = Ef(), k = Hd({
		actorFolders: t,
		baseActorDraftData: i,
		baseActors: a,
		ignoredBaseTraitKeys: C,
		itemFolders: l,
		manualAdvancementDeltas: n,
		quickTraits: f,
		selectedBaseActorUuid: h,
		settings: m,
		traitConfigOverrides: E,
		trappingOverrides: D,
		trappingResolutionOverrides: ee
	}), ne = Ud({
		baseActorCombatProfile: r,
		mountActorProfile: u,
		mountActors: d,
		selectedMountActorUuid: g
	}), A = Vd({
		actorName: e,
		baseActors: a,
		careers: o,
		clearBaseDraftData: k.clearBaseDraftData,
		clearMountSelection: ne.clearMountSelection,
		customAdvancements: S,
		customSpells: x,
		customTraits: s,
		customTrappings: c,
		detectedSpells: b,
		ignoredBaseTraitKeys: C,
		magicLoreResolutions: w,
		removeSkillGrantResolutionsForCareer: O.removeSkillGrantResolutionsForCareer,
		selectedBaseActorUuid: h,
		selectedPortraitPath: p,
		settings: m,
		skillGrantResolutions: y,
		spellSelectionOverrides: T
	}), re = op({
		baseActorDraftData: i,
		customTraits: s,
		ignoredBaseTraitKeys: C,
		quickTraits: f,
		settings: m,
		traitConfigOverrides: E
	}), ie = Dp({
		baseActorDraftData: i,
		careers: o,
		customTrappings: c,
		settings: m,
		trappingOverrides: D,
		trappingResolutionOverrides: ee
	}), ae = Xf({
		advancements: O.advancements,
		customSpells: x,
		detectedSpells: b,
		magicLoreResolutions: w,
		settings: m,
		spellSelectionOverrides: T,
		traits: re.traits
	});
	function oe() {
		A.resetDraft(), te.resetPortraitFilters();
	}
	return {
		actorName: e,
		actorFolders: t,
		addCareer: A.addCareer,
		addCareerIfMissing: A.addCareerIfMissing,
		addCustomAdvancement: O.addCustomAdvancement,
		addCustomPortraitSearchTerm: te.addCustomPortraitSearchTerm,
		addCustomSpell: ae.addCustomSpell,
		addCustomTrait: re.addCustomTrait,
		addCustomTrapping: ie.addCustomTrapping,
		adjustAdvancementCurrent: O.adjustAdvancementCurrent,
		advancements: O.advancements,
		applyAutoAdvance: O.applyAutoAdvance,
		baseActorCombatProfile: r,
		baseActorDraftData: i,
		baseActors: a,
		buildTraits: re.buildTraits,
		careers: o,
		clearCareers: A.clearCareers,
		clearBaseDraftData: k.clearBaseDraftData,
		clearMountSelection: ne.clearMountSelection,
		customSpells: x,
		customAdvancements: S,
		customPortraitSearchTerms: te.customPortraitSearchTerms,
		customTraits: s,
		customTrappings: c,
		estimatedNpcXp: O.estimatedNpcXp,
		finalActorName: A.finalActorName,
		finalCareer: A.finalCareer,
		finalPortraitPath: A.finalPortraitPath,
		getSkillGrantResolution: O.getSkillGrantResolution,
		grantTotals: A.grantTotals,
		hasMagicAccess: ae.hasMagicAccess,
		hydrateActorFolders: k.hydrateActorFolders,
		hydrateBaseActorCombatProfile: ne.hydrateBaseActorCombatProfile,
		hydrateBaseActorDraftData: k.hydrateBaseActorDraftData,
		hydrateBaseActors: k.hydrateBaseActors,
		hydrateDetectedSpells: ae.hydrateDetectedSpells,
		hydrateItemFolders: k.hydrateItemFolders,
		hydrateMountActorProfile: ne.hydrateMountActorProfile,
		hydrateMountActors: ne.hydrateMountActors,
		hydrateQuickTraits: k.hydrateQuickTraits,
		hydrateSettings: k.hydrateSettings,
		hydrateSkillCharacteristics: O.hydrateSkillCharacteristics,
		hydrateTalentMaximums: O.hydrateTalentMaximums,
		itemFolders: l,
		magicGrants: ae.magicGrants,
		magicLoreResolutions: w,
		mountActorProfile: u,
		mountActors: d,
		maximizableTalentCount: O.maximizableTalentCount,
		maximizeTalents: O.maximizeTalents,
		moveCareer: A.moveCareer,
		moveCareerToIndex: A.moveCareerToIndex,
		optionalTraits: re.optionalTraits,
		quickTraits: f,
		removeCareer: A.removeCareer,
		removeCustomAdvancement: O.removeCustomAdvancement,
		removeCustomSpell: ae.removeCustomSpell,
		removeCustomTrait: re.removeCustomTrait,
		removeCustomTrapping: ie.removeCustomTrapping,
		resetAdvancementCurrent: O.resetAdvancementCurrent,
		resetAllAdvancementCurrents: O.resetAllAdvancementCurrents,
		portraitSourceTagSections: te.portraitSourceTagSections,
		portraitTermSections: te.portraitTermSections,
		resetDraft: oe,
		retainAvailablePortraitFilterTerms: te.retainAvailablePortraitFilterTerms,
		selectBaseActor: A.selectBaseActor,
		selectBaseActorUuid: A.selectBaseActorUuid,
		selectMountActor: ne.selectMountActor,
		selectMountActorUuid: ne.selectMountActorUuid,
		selectedBaseActor: A.selectedBaseActor,
		selectedBaseActorUuid: h,
		selectedMountActorUuid: g,
		selectedPortraitPath: p,
		selectedSpells: ae.selectedSpells,
		selectPortrait: A.selectPortrait,
		selectTrappingResolutionCandidate: ie.selectTrappingResolutionCandidate,
		setAdvancementCurrent: O.setAdvancementCurrent,
		setAdvancementTotal: O.setAdvancementTotal,
		setBaseTraitIgnored: re.setBaseTraitIgnored,
		setCareerQuantity: A.setCareerQuantity,
		setMagicGrantLoreResolution: ae.setMagicGrantLoreResolution,
		setOptionalTraitSelected: re.setOptionalTraitSelected,
		setPortraitSourceTagSection: te.setPortraitSourceTagSection,
		setPortraitTermSection: te.setPortraitTermSection,
		setQuickTraitSelected: re.setQuickTraitSelected,
		setSkillGrantResolution: O.setSkillGrantResolution,
		setSpellSelected: ae.setSpellSelected,
		setTraitConfig: re.setTraitConfig,
		setTrappingFallback: ie.setTrappingFallback,
		setTrappingIgnored: ie.setTrappingIgnored,
		setTrappingQuantity: ie.setTrappingQuantity,
		setTrappingResolution: ie.setTrappingResolution,
		settings: m,
		spells: ae.spells,
		suggestedActorName: A.suggestedActorName,
		traits: re.traits,
		trappings: ie.trappings
	};
}), kp = { class: "dui-fieldset-legend" }, Ap = [
	"checked",
	"disabled",
	"onChange"
], jp = { class: "dui-card-actions" }, Mp = /* @__PURE__ */ U({
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
		return (t, i) => (K(), q("section", null, [
			Y("p", null, L(e.prompt.droppedCareer.name) + " appears to belong to the " + L(e.prompt.droppedCareer.careerGroup) + " career track. The following lower-tier candidates were found. ", 1),
			(K(!0), q(G, null, W(e.candidateGroups, (t) => (K(), q("fieldset", {
				key: t.level,
				class: "dui-fieldset"
			}, [Y("legend", kp, "Tier " + L(t.level || "Unknown"), 1), (K(!0), q(G, null, W(t.candidates, (t) => (K(), q("label", {
				key: t.uuid,
				class: "dui-label"
			}, [Y("input", {
				class: "dui-checkbox dui-checkbox-sm",
				checked: e.isCareerQueued(t.uuid) || e.isLowerCareerSelected(t.uuid),
				disabled: e.isCareerQueued(t.uuid),
				type: "checkbox",
				onChange: (e) => r(t, e)
			}, null, 40, Ap), Y("span", null, [Y("strong", null, L(t.name), 1), Y("small", null, [Z(L(t.careerGroup || "Career") + " ", 1), e.isCareerQueued(t.uuid) ? (K(), q(G, { key: 0 }, [Z(" already queued ")], 64)) : Q("", !0)])])]))), 128))]))), 128)),
			Y("div", jp, [Y("button", {
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: i[0] ||= (e) => n("addDroppedOnly")
			}, " Add Dropped Only "), Y("button", {
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: i[1] ||= (e) => n("addSelected")
			}, " Add Selected ")])
		]));
	}
}), Np = ["aria-labelledby"], Pp = ["id"], Fp = { class: "dui-modal-action" }, Ip = /* @__PURE__ */ U({
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
		let n = e, r = t, i = /* @__PURE__ */ B(null), a = eo();
		return Ka(() => n.open, async (e) => {
			await Da();
			let t = i.value;
			if (e && !t?.open) {
				t?.showModal();
				return;
			}
			!e && t?.open && t.close();
		}, { immediate: !0 }), yo(() => {
			i.value?.open && i.value.close();
		}), (t, n) => (K(), q("dialog", {
			ref_key: "dialogElement",
			ref: i,
			"aria-labelledby": V(a),
			"aria-modal": "true",
			class: "dui-modal",
			onCancel: n[1] ||= Nl((e) => r("close"), ["prevent"])
		}, [Y("section", { class: I(["dui-modal-box", { "app:max-w-5xl": e.wide }]) }, [
			Y("h2", {
				id: V(a),
				class: "dui-card-title"
			}, L(e.title), 9, Pp),
			Eo(t.$slots, "default"),
			Y("div", Fp, [Y("button", {
				class: "dui-btn",
				type: "button",
				onClick: n[0] ||= (e) => r("close")
			}, L(e.closeLabel), 1)])
		], 2)], 40, Np));
	}
}), Lp = /* @__PURE__ */ new Map();
function Rp(e) {
	let t = e.id.trim();
	if (!t) throw Error("NPC auto-advance strategies must have an id.");
	Lp.set(t, {
		...e,
		id: t
	});
}
function zp() {
	return [...Lp.values()].sort((e, t) => e.name.localeCompare(t.name));
}
function Bp(e) {
	return Lp.get(e) ?? null;
}
function Vp(e, t) {
	return Wp(e, t, {
		kinds: ["skill"],
		respectTalentMaximums: !1
	});
}
function Hp(e, t) {
	return Wp(Wp(e, t, {
		kinds: ["talent"],
		respectTalentMaximums: !0
	}), t, {
		kinds: ["skill"],
		respectTalentMaximums: !1
	});
}
function Up(e, t) {
	return Wp(e, t, {
		kinds: ["characteristic"],
		respectTalentMaximums: !1
	});
}
function Wp(e, t, n) {
	let r = Math.max(0, Math.floor(Number.isFinite(t) ? t : 0)), i = qp(e.advancements), a = Sd(i).total;
	if (a >= r) return { advancements: i };
	let o = !0;
	for (; o;) {
		o = !1;
		for (let e of i) {
			if (!n.kinds.includes(e.kind)) continue;
			let t = Gp(e, n);
			if (!t) continue;
			let i = wd(t) - wd(e);
			i <= 0 || a + i > r || (e.current = t.current, a += i, o = !0);
		}
	}
	return { advancements: i };
}
function Gp(e, t) {
	return t.respectTalentMaximums && e.kind === "talent" && !Kp(e) ? null : {
		...e,
		current: e.current + fd(e)
	};
}
function Kp(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" ? pd(e) < t : !1;
}
function qp(e) {
	return e.map((e) => ({
		...e,
		sources: e.sources.map((e) => ({ ...e }))
	}));
}
Rp({
	description: "Cycles visible Skill rows evenly until no next skill increase fits the target XP.",
	id: "skill-master",
	name: "Skill Master",
	run: Vp
}), Rp({
	description: "Raises visible Talent rows evenly up to known maximums, then spends any remaining XP like Skill Master.",
	id: "gifted-and-talented",
	name: "Gifted & Talented",
	run: Hp
}), Rp({
	description: "Cycles visible Characteristic rows evenly until no next characteristic increase fits the target XP.",
	id: "all-natural",
	name: "All Natural",
	run: Up
});
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderAdvancementsTab/advancement-display.ts
function Jp(e) {
	let t = e.current - e.careerValue, n = [...e.sources].sort((e, t) => nm(e.kind) - nm(t.kind)).map((e) => Yp(e));
	return t !== 0 && n.push(`Manual ${rm(t)}`), n.length ? n.join(", ") : e.includedFromBase ? "Base actor" : "-";
}
function Yp(e) {
	return e.kind === "custom" && e.count === 0 ? e.label : `${e.label} ${rm(e.count)}`;
}
function Xp(e) {
	return Iu(e) !== null;
}
function Zp(e) {
	return Math.max(e.minimumTotal, e.baseValue + e.current);
}
function Qp(e) {
	return Zp(e);
}
function $p(e) {
	return e.talentMaximumLabel ?? "Unknown";
}
function em(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" && Qp(e) > t;
}
function tm(e) {
	return wd(e);
}
function nm(e) {
	return e === "characteristic" ? 0 : e === "career" ? 1 : 2;
}
function rm(e) {
	return e > 0 ? `+${e}` : `${e}`;
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderAdvancementsTab/AdvancementRowTailActions.vue?vue&type=script&setup=true&lang.ts
var im = ["disabled"], am = /* @__PURE__ */ U({
	__name: "AdvancementRowTailActions",
	props: { entry: {} },
	emits: ["removeCustom", "resetCurrent"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (K(), q(G, null, [Y("button", {
			class: "dui-join-item dui-btn dui-btn-sm",
			disabled: e.entry.current === e.entry.careerValue,
			title: "Reset to career value",
			type: "button",
			onClick: r[0] ||= (e) => n("resetCurrent")
		}, " Reset ", 8, im), e.entry.includedFromCustom ? (K(), q("button", {
			key: 0,
			class: "dui-join-item dui-btn dui-btn-sm",
			title: "Remove dropped entry",
			type: "button",
			onClick: r[1] ||= (e) => n("removeCustom")
		}, " Remove Dropped ")) : Q("", !0)], 64));
	}
}), om = { class: "dui-card dui-card-border dui-card-sm" }, sm = { class: "dui-card-body" }, cm = { class: "dui-card-title" }, lm = {
	key: 0,
	class: "dui-badge dui-badge-primary"
}, um = { key: 0 }, dm = /* @__PURE__ */ U({
	__name: "NpcBuilderSection",
	props: {
		description: { default: "" },
		number: { default: "" },
		title: {}
	},
	setup(e) {
		return (t, n) => (K(), q("section", om, [Y("div", sm, [
			Y("h2", cm, [e.number ? (K(), q("span", lm, L(e.number), 1)) : Q("", !0), Z(" " + L(e.title), 1)]),
			e.description ? (K(), q("p", um, L(e.description), 1)) : Q("", !0),
			Eo(t.$slots, "default")
		])]));
	}
}), fm = {
	key: 0,
	class: "dui-card-actions"
}, pm = {
	key: 1,
	class: "dui-alert dui-alert-info"
}, mm = { class: "dui-list" }, hm = { class: "dui-list-col-grow" }, gm = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, _m = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, vm = { class: "dui-join" }, ym = ["disabled", "onClick"], bm = [
	"aria-label",
	"value",
	"onInput"
], xm = ["onClick"], Sm = {
	key: 2,
	class: "dui-alert"
}, Cm = /* @__PURE__ */ U({
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
		return (t, i) => (K(), J(dm, {
			number: e.sectionNumber,
			title: e.title
		}, {
			default: H(() => [
				e.manualAdvanceCount ? (K(), q("div", fm, [Y("span", null, L(e.manualAdvanceCount) + " manual edits", 1), Y("button", {
					class: "dui-btn dui-btn-sm",
					type: "button",
					onClick: i[0] ||= (e) => n("resetAll")
				}, " Reset All Advances ")])) : Q("", !0),
				e.estimatedNpcXp ? (K(), q("div", pm, [
					Y("strong", null, "Estimated NPC XP " + L(e.estimatedNpcXp.total), 1),
					Y("span", null, L(e.estimatedNpcXp.characteristics) + " characteristics", 1),
					Y("span", null, L(e.estimatedNpcXp.skills) + " skills", 1),
					Y("span", null, L(e.estimatedNpcXp.talents) + " talents", 1)
				])) : Q("", !0),
				Y("ul", mm, [(K(!0), q(G, null, W(e.entries, (t) => (K(), q("li", {
					key: `${t.kind}:${t.name}`,
					class: "dui-list-row"
				}, [Y("div", hm, [
					Y("strong", null, L(t.name), 1),
					t.current === t.careerValue ? Q("", !0) : (K(), q("span", gm, " Manual edit ")),
					e.showSkillSpecializationBadges && V(Xp)(t.name) ? (K(), q("span", _m, " Needs specialization ")) : Q("", !0),
					Y("span", null, " Base " + L(t.baseValue) + " · Advances " + L(t.current) + " · XP " + L(V(tm)(t)), 1),
					Y("small", null, "Sources: " + L(V(Jp)(t)), 1)
				]), Y("div", vm, [
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						disabled: V(Zp)(t) <= t.minimumTotal,
						title: "Decrease by 5",
						type: "button",
						onClick: (e) => n("adjustCurrent", t, -1)
					}, " -5 ", 8, ym),
					Y("input", {
						class: "dui-join-item dui-input dui-input-sm",
						"aria-label": `Total ${t.name}`,
						value: V(Zp)(t),
						min: "0",
						type: "number",
						onInput: (e) => r(t, e)
					}, null, 40, bm),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						title: "Increase by 5",
						type: "button",
						onClick: (e) => n("adjustCurrent", t, 1)
					}, " +5 ", 8, xm),
					X(am, {
						entry: t,
						onRemoveCustom: (e) => n("removeCustom", t),
						onResetCurrent: (e) => n("resetCurrent", t)
					}, null, 8, [
						"entry",
						"onRemoveCustom",
						"onResetCurrent"
					])
				])]))), 128))]),
				e.entries.length ? Q("", !0) : (K(), q("p", Sm, "No " + L(e.title.toLowerCase()) + " to advance yet.", 1))
			]),
			_: 1
		}, 8, ["number", "title"]));
	}
}), wm = { class: "dui-fieldset" }, Tm = ["value"], Em = { class: "dui-fieldset" }, Dm = ["value"], Om = ["value"], km = { key: 0 }, Am = { class: "dui-card-actions" }, jm = ["disabled"], Mm = /* @__PURE__ */ U({
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
		return (t, a) => (K(), J(dm, {
			description: "Spend toward a target without exceeding it. Existing manual edits are preserved.",
			number: "4",
			title: "Auto Advance"
		}, {
			default: H(() => [
				Y("fieldset", wm, [a[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Target XP", -1), Y("input", {
					"aria-label": "Target XP",
					class: "dui-input dui-input-sm",
					value: e.targetXp,
					min: "0",
					type: "number",
					onInput: r
				}, null, 40, Tm)]),
				Y("fieldset", Em, [a[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "Strategy", -1), Y("select", {
					"aria-label": "Auto advance strategy",
					class: "dui-select dui-select-sm",
					value: e.selectedAutoAdvanceStrategyId,
					onChange: i
				}, [(K(!0), q(G, null, W(e.autoAdvanceStrategies, (e) => (K(), q("option", {
					key: e.id,
					value: e.id
				}, L(e.name), 9, Om))), 128))], 40, Dm)]),
				e.selectedAutoAdvanceStrategy ? (K(), q("p", km, L(e.selectedAutoAdvanceStrategy.description), 1)) : Q("", !0),
				Y("div", Am, [Y("button", {
					class: "dui-btn dui-btn-primary dui-btn-sm",
					disabled: !e.canRunAutoAdvance,
					title: "Advance rows as close to the target XP as possible without going over",
					type: "button",
					onClick: a[0] ||= (e) => n("runAutoAdvance")
				}, " Auto Advance ", 8, jm)])
			]),
			_: 1
		}));
	}
}), Nm = { class: "dui-card-actions" }, Pm = ["disabled"], Fm = { class: "dui-list" }, Im = { class: "dui-list-col-grow" }, Lm = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, Rm = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, zm = { class: "dui-join" }, Bm = ["disabled", "onClick"], Vm = [
	"aria-label",
	"value",
	"onInput"
], Hm = ["onClick"], Um = {
	key: 0,
	class: "dui-alert"
}, Wm = /* @__PURE__ */ U({
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
		return (t, i) => (K(), J(dm, {
			number: "3",
			title: "Talents"
		}, {
			default: H(() => [
				Y("div", Nm, [Y("span", null, L(e.maximizableTalentCount) + " below maximum", 1), Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: e.maximizableTalentCount === 0,
					title: "Raise talents with known maximums to their maximum ranks",
					type: "button",
					onClick: i[0] ||= (e) => n("maximizeTalents")
				}, " Maximize Talents ", 8, Pm)]),
				Y("ul", Fm, [(K(!0), q(G, null, W(e.talents, (e) => (K(), q("li", {
					key: `${e.kind}:${e.name}`,
					class: "dui-list-row"
				}, [Y("div", Im, [
					Y("strong", null, L(e.name), 1),
					e.current === e.careerValue ? Q("", !0) : (K(), q("span", Lm, " Manual edit ")),
					Y("span", null, " Ranks " + L(V(Qp)(e)) + " · Maximum " + L(V($p)(e)) + " · XP " + L(V(tm)(e)), 1),
					Y("small", null, "Sources: " + L(V(Jp)(e)), 1),
					V(em)(e) ? (K(), q("span", Rm, " Over maximum ")) : Q("", !0)
				]), Y("div", zm, [
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						disabled: V(Qp)(e) <= e.minimumTotal,
						title: "Decrease by 1",
						type: "button",
						onClick: (t) => n("adjustCurrent", e, -1)
					}, " -1 ", 8, Bm),
					Y("input", {
						class: "dui-join-item dui-input dui-input-sm",
						"aria-label": `Ranks ${e.name}`,
						value: V(Qp)(e),
						min: "0",
						type: "number",
						onInput: (t) => r(e, t)
					}, null, 40, Vm),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						title: "Increase by 1",
						type: "button",
						onClick: (t) => n("adjustCurrent", e, 1)
					}, " +1 ", 8, Hm),
					X(am, {
						entry: e,
						onRemoveCustom: (t) => n("removeCustom", e),
						onResetCurrent: (t) => n("resetCurrent", e)
					}, null, 8, [
						"entry",
						"onRemoveCustom",
						"onResetCurrent"
					])
				])]))), 128))]),
				e.talents.length ? Q("", !0) : (K(), q("p", Um, "No talents to advance yet."))
			]),
			_: 1
		}));
	}
}), Gm = /* @__PURE__ */ U({
	__name: "NpcBuilderAdvancementsTab",
	props: { page: {} },
	setup(e) {
		let t = Op(), { advancements: n, estimatedNpcXp: r, maximizableTalentCount: i } = xu(t), a = zp(), o = /* @__PURE__ */ B("skill-master"), s = /* @__PURE__ */ B(0), c = $(() => n.value.filter((e) => e.kind === "characteristic")), l = $(() => n.value.filter((e) => e.kind === "skill")), u = $(() => n.value.filter((e) => e.kind === "talent")), d = $(() => n.value.filter((e) => e.current !== e.careerValue).length), f = $(() => Bp(o.value) ?? a[0] ?? null), p = $(() => f.value !== null && s.value > r.value.total);
		Ka(() => r.value.total, (e) => {
			s.value < e && (s.value = e);
		}, { immediate: !0 });
		function m() {
			let e = f.value;
			e && t.applyAutoAdvance(e, s.value);
		}
		return (n, h) => (K(), q("section", null, [e.page === "detail-characteristics" ? (K(), J(Cm, {
			key: 0,
			entries: c.value,
			"estimated-npc-xp": V(r),
			"manual-advance-count": d.value,
			"section-number": "",
			title: "Characteristics",
			onAdjustCurrent: V(t).adjustAdvancementCurrent,
			onRemoveCustom: V(t).removeCustomAdvancement,
			onResetAll: V(t).resetAllAdvancementCurrents,
			onResetCurrent: V(t).resetAdvancementCurrent,
			onTotalChange: V(t).setAdvancementTotal
		}, null, 8, [
			"entries",
			"estimated-npc-xp",
			"manual-advance-count",
			"onAdjustCurrent",
			"onRemoveCustom",
			"onResetAll",
			"onResetCurrent",
			"onTotalChange"
		])) : e.page === "detail-skills" ? (K(), J(Cm, {
			key: 1,
			entries: l.value,
			"section-number": "",
			"show-skill-specialization-badges": "",
			title: "Skills",
			onAdjustCurrent: V(t).adjustAdvancementCurrent,
			onRemoveCustom: V(t).removeCustomAdvancement,
			onResetCurrent: V(t).resetAdvancementCurrent,
			onTotalChange: V(t).setAdvancementTotal
		}, null, 8, [
			"entries",
			"onAdjustCurrent",
			"onRemoveCustom",
			"onResetCurrent",
			"onTotalChange"
		])) : e.page === "detail-talents" ? (K(), J(Wm, {
			key: 2,
			"maximizable-talent-count": V(i),
			talents: u.value,
			onAdjustCurrent: V(t).adjustAdvancementCurrent,
			onMaximizeTalents: V(t).maximizeTalents,
			onRemoveCustom: V(t).removeCustomAdvancement,
			onResetCurrent: V(t).resetAdvancementCurrent,
			onTotalChange: V(t).setAdvancementTotal
		}, null, 8, [
			"maximizable-talent-count",
			"talents",
			"onAdjustCurrent",
			"onMaximizeTalents",
			"onRemoveCustom",
			"onResetCurrent",
			"onTotalChange"
		])) : (K(), J(Mm, {
			key: 3,
			"auto-advance-strategies": V(a),
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
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/labels.ts
function Km(e) {
	return [
		`Ch ${e.grants.characteristics.length}`,
		`Sk ${e.grants.skills.length}`,
		`Ta ${e.grants.talents.length}`,
		`Tr ${e.grants.trappings.length}`
	].join(" / ");
}
function qm(e) {
	let t = e.slice(0, 3).join(", "), n = e.length - 3;
	return e.length ? n > 0 ? `${t}, +${n}` : t : "-";
}
function Jm(e) {
	return e.split(/\s+/).map((e) => e.at(0)).filter(Boolean).slice(0, 2).join("").toLocaleUpperCase();
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/BaseActorPanel.vue?vue&type=script&setup=true&lang.ts
var Ym = { class: "dui-fieldset" }, Xm = ["value"], Zm = { class: "dui-fieldset" }, Qm = ["disabled", "value"], $m = { value: "" }, eh = ["value"], th = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, nh = {
	key: 1,
	class: "dui-alert"
}, rh = {
	key: 0,
	class: "dui-avatar"
}, ih = { class: "app:size-16 app:shrink-0 app:rounded-lg" }, ah = ["src"], oh = {
	key: 1,
	class: "dui-badge"
}, sh = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(dm, {
			description: e.description,
			number: e.number,
			title: e.title
		}, {
			default: H(() => [
				Y("fieldset", Ym, [n[0] ||= Y("legend", { class: "dui-fieldset-legend" }, "Search world actors", -1), Y("input", {
					"aria-label": "Search world actors",
					class: "dui-input dui-input-sm",
					value: e.actorFilter,
					placeholder: "Filter actors",
					type: "search",
					onInput: r
				}, null, 40, Xm)]),
				Y("fieldset", Zm, [n[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Base statblock", -1), Y("select", {
					"aria-label": "Base statblock",
					class: "dui-select dui-select-sm",
					disabled: e.isLoadingActors,
					value: e.selectedBaseActorUuid,
					onChange: i
				}, [Y("option", $m, L(e.isLoadingActors ? "Loading actors..." : "Choose an actor"), 1), (K(!0), q(G, null, W(e.filteredActors, (e) => (K(), q("option", {
					key: e.uuid,
					value: e.uuid
				}, L(e.name), 9, eh))), 128))], 40, Qm)]),
				e.errorMessage ? (K(), q("p", th, L(e.errorMessage), 1)) : Q("", !0),
				e.selectedBaseActor ? (K(), q("article", nh, [e.selectedBaseActor.img ? (K(), q("div", rh, [Y("div", ih, [Y("img", {
					src: e.selectedBaseActor.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "64",
					width: "64"
				}, null, 8, ah)])])) : (K(), q("span", oh, L(V(Jm)(e.selectedBaseActor.name)), 1)), Y("div", null, [Y("strong", null, L(e.selectedBaseActor.name), 1), Y("span", null, [
					Z(L(e.selectedBaseActor.species || "Species not found") + " ", 1),
					e.selectedBaseActor.type ? (K(), q(G, { key: 0 }, [Z(" - " + L(e.selectedBaseActor.type), 1)], 64)) : Q("", !0),
					e.isLoadingBaseDraft ? (K(), q(G, { key: 1 }, [Z(" - loading details...")], 64)) : Q("", !0)
				])])])) : Q("", !0)
			]),
			_: 1
		}, 8, [
			"description",
			"number",
			"title"
		]));
	}
}), ch = { class: "dui-card-actions" }, lh = { class: "dui-stats dui-stats-vertical app:w-full" }, uh = { class: "dui-stat" }, dh = { class: "dui-stat-value" }, fh = {
	key: 0,
	class: "dui-stat-desc"
}, ph = { class: "dui-stat" }, mh = { class: "dui-stat-value" }, hh = {
	key: 0,
	class: "dui-stat-desc"
}, gh = {
	key: 1,
	class: "dui-stat-desc"
}, _h = { class: "dui-stat" }, vh = { class: "dui-stat-value" }, yh = { class: "dui-stat" }, bh = { class: "dui-stat-value" }, xh = { class: "dui-stat" }, Sh = { class: "dui-stat-value" }, Ch = { class: "dui-stat-desc" }, wh = {
	key: 0,
	class: "dui-alert dui-alert-warning",
	role: "alert"
}, Th = { key: 1 }, Eh = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(dm, {
			number: "4",
			title: "Build Preview"
		}, {
			default: H(() => [
				Y("div", ch, [Y("span", { class: I(["dui-badge", e.buildPreviewStatus === "Ready" ? "dui-badge-success" : "dui-badge-warning"]) }, L(e.buildPreviewStatus), 3)]),
				Y("div", lh, [
					Y("div", uh, [
						n[0] ||= Y("span", { class: "dui-stat-title" }, "Advances", -1),
						Y("strong", dh, L(e.advancementCount), 1),
						e.editedAdvanceCount ? (K(), q("small", fh, L(e.editedAdvanceCount) + " manually edited ", 1)) : Q("", !0)
					]),
					Y("div", ph, [
						n[1] ||= Y("span", { class: "dui-stat-title" }, "Trappings", -1),
						Y("strong", mh, L(e.visibleTrappingCount), 1),
						e.fallbackTrappingCount ? (K(), q("small", hh, L(e.fallbackTrappingCount) + " blank fallback ", 1)) : Q("", !0),
						e.ignoredTrappingCount ? (K(), q("small", gh, L(e.ignoredTrappingCount) + " ignored ", 1)) : Q("", !0)
					]),
					Y("div", _h, [n[2] ||= Y("span", { class: "dui-stat-title" }, "Traits", -1), Y("strong", vh, L(e.traitCount), 1)]),
					Y("div", yh, [n[3] ||= Y("span", { class: "dui-stat-title" }, "Spells", -1), Y("strong", bh, L(e.selectedSpellCount), 1)]),
					Y("div", xh, [
						n[4] ||= Y("span", { class: "dui-stat-title" }, "Estimated NPC XP", -1),
						Y("strong", Sh, L(e.estimatedNpcXp.total), 1),
						Y("small", Ch, L(e.estimatedNpcXp.characteristics) + " char / " + L(e.estimatedNpcXp.skills) + " skill / " + L(e.estimatedNpcXp.talents) + " talent ", 1)
					])
				]),
				e.buildPreviewWarnings.length ? (K(), q("div", wh, [Y("div", null, [(K(!0), q(G, null, W(e.buildPreviewWarnings, (e) => (K(), q("p", { key: e }, L(e), 1))), 128))])])) : (K(), q("p", Th, " The draft has a base Actor, queued Career data, resolved trappings, and a portrait ready to apply. "))
			]),
			_: 1
		}));
	}
}), Dh = { class: "dui-list" }, Oh = { class: "dui-list-row" }, kh = { class: "dui-list-row" }, Ah = { class: "dui-list-row" }, jh = { class: "dui-list-row" }, Mh = { class: "dui-list-row" }, Nh = { class: "dui-list-row" }, Ph = { class: "dui-list-row" }, Fh = /* @__PURE__ */ U({
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
		return (t, n) => (K(), q("dl", Dh, [
			Y("div", Oh, [n[0] ||= Y("dt", null, "Build name", -1), Y("dd", null, L(e.finalActorName), 1)]),
			Y("div", kh, [n[1] ||= Y("dt", null, "Base actor", -1), Y("dd", null, L(e.baseActorName), 1)]),
			Y("div", Ah, [n[2] ||= Y("dt", null, "Final career", -1), Y("dd", null, L(e.finalCareerName), 1)]),
			Y("div", jh, [n[3] ||= Y("dt", null, "Career items", -1), Y("dd", null, L(e.careerItemCount), 1)]),
			Y("div", Mh, [n[4] ||= Y("dt", null, "Apply", -1), Y("dd", null, L(e.advancementCount) + " advance rows, " + L(e.visibleTrappingCount) + " trappings, " + L(e.traitCount) + " traits, " + L(e.selectedSpellCount) + " spells ", 1)]),
			Y("div", Nh, [n[5] ||= Y("dt", null, "Extracted grants", -1), Y("dd", null, L(e.grantTotals.characteristics) + " characteristics, " + L(e.grantTotals.skills) + " skills, " + L(e.grantTotals.talents) + " talents, " + L(e.grantTotals.trappings) + " trappings ", 1)]),
			Y("div", Ph, [n[6] ||= Y("dt", null, "Estimated NPC XP", -1), Y("dd", null, L(e.estimatedNpcXpTotal), 1)])
		]));
	}
}), Ih = { class: "app:grid app:gap-3" }, Lh = { class: "app:flex app:flex-wrap app:items-start app:gap-3" }, Rh = ["aria-label", "disabled"], zh = ["src"], Bh = { key: 1 }, Vh = { key: 2 }, Hh = { class: "app:flex app:min-w-48 app:flex-1 app:flex-col app:items-start app:gap-2" }, Uh = ["title"], Wh = {
	key: 1,
	class: "app:text-base-content/70"
}, Gh = ["disabled"], Kh = {
	key: 0,
	"aria-live": "polite",
	role: "status"
}, qh = ["value"], Jh = {
	key: 1,
	class: "dui-fieldset"
}, Yh = { class: "dui-fieldset-legend" }, Xh = { key: 0 }, Zh = { key: 1 }, Qh = { class: "app:flex app:flex-wrap app:gap-2" }, $h = [
	"aria-label",
	"aria-pressed",
	"title",
	"onClick"
], eg = ["src"], tg = ["aria-label"], ng = /* @__PURE__ */ U({
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
		return (t, r) => (K(), q("section", Ih, [
			Y("div", Lh, [Y("button", {
				"aria-label": e.portraitCandidates.length ? "Open portrait gallery" : "No portraits available",
				class: "dui-btn dui-btn-square app:h-32 app:w-32 app:shrink-0 app:overflow-hidden app:p-1",
				disabled: !e.portraitCandidates.length,
				title: "Open portrait gallery",
				type: "button",
				onClick: r[0] ||= (e) => n("openGallery")
			}, [e.finalPortraitPath ? (K(), q("img", {
				key: 0,
				alt: "",
				class: "app:h-full app:w-full app:rounded-box app:object-cover",
				height: "192",
				src: e.finalPortraitPath,
				width: "192"
			}, null, 8, zh)) : e.finalCareer ? (K(), q("strong", Bh, L(V(Jm)(e.finalCareer.name)), 1)) : (K(), q("span", Vh, "No portrait"))], 8, Rh), Y("div", Hh, [
				r[3] ||= Y("span", { class: "dui-badge dui-badge-outline" }, "Current portrait", -1),
				Y("strong", null, L(e.selectedPortraitCandidate?.label ?? "No portrait selected"), 1),
				e.finalPortraitPath ? (K(), q("small", {
					key: 0,
					class: "app:break-all app:text-base-content/70",
					title: e.finalPortraitPath
				}, L(e.finalPortraitPath), 9, Uh)) : (K(), q("span", Wh, " A Career or base Actor image will be used when available. ")),
				Y("button", {
					class: "dui-btn dui-btn-outline dui-btn-sm",
					disabled: !e.portraitCandidates.length,
					type: "button",
					onClick: r[1] ||= (e) => n("openGallery")
				}, " Browse " + L(e.portraitCandidates.length) + " portraits ", 9, Gh)
			])]),
			e.isLoadingPortraitCandidates && e.portraitSearchProgress ? (K(), q("div", Kh, [Y("progress", {
				"aria-label": "Portrait search progress",
				class: "dui-progress dui-progress-info app:w-full",
				value: e.portraitSearchProgressValue,
				max: "100"
			}, null, 8, qh), Y("small", null, L(e.portraitSearchProgressLabel), 1)])) : Q("", !0),
			e.portraitCandidates.length || e.isLoadingPortraitCandidates ? (K(), q("fieldset", Jh, [Y("legend", Yh, [r[4] ||= Y("span", null, "Quick picks", -1), e.isLoadingPortraitCandidates ? (K(), q("span", Xh, "Updating...")) : (K(), q("span", Zh, L(e.portraitCandidates.length) + " options", 1))]), Y("div", Qh, [(K(!0), q(G, null, W(e.compactPortraitCandidates, (t) => (K(), q("button", {
				key: t.key,
				"aria-label": V(yf)(t),
				"aria-pressed": t.key === e.selectedPortraitCandidateKey,
				class: I(["dui-btn dui-btn-square app:overflow-hidden app:p-1", { "dui-btn-active dui-btn-outline": t.key === e.selectedPortraitCandidateKey }]),
				title: V(vf)(t),
				type: "button",
				onClick: (e) => n("selectPortrait", t)
			}, [Y("img", {
				alt: "",
				class: "app:h-full app:w-full app:rounded-box app:object-cover",
				height: "64",
				loading: "lazy",
				src: t.img,
				width: "64"
			}, null, 8, eg)], 10, $h))), 128)), e.hiddenPortraitCandidateCount > 0 ? (K(), q("button", {
				key: 0,
				"aria-label": `Open ${e.hiddenPortraitCandidateCount} more portrait options`,
				class: "dui-btn dui-btn-square",
				type: "button",
				onClick: r[2] ||= (e) => n("openGallery")
			}, " +" + L(e.hiddenPortraitCandidateCount), 9, tg)) : Q("", !0)])])) : Q("", !0)
		]));
	}
}), rg = { class: "app:grid app:gap-3 md:app:sticky md:app:top-28 md:app:max-h-[calc(100vh-10rem)] md:app:self-start md:app:overflow-y-auto" }, ig = { class: "dui-fieldset" }, ag = ["placeholder", "value"], og = { class: "app:hidden md:app:grid md:app:gap-3" }, sg = { class: "dui-collapse dui-collapse-arrow dui-card-border" }, cg = { class: "dui-collapse-content" }, lg = /* @__PURE__ */ U({
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
		return (t, i) => (K(), q("aside", rg, [X(dm, {
			description: "The generated Actor identity stays visible while Build NPC controls change.",
			title: "Preview"
		}, {
			default: H(() => [X(ng, {
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
			]), Y("fieldset", ig, [i[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "NPC name", -1), Y("input", {
				"aria-label": "NPC name",
				class: "dui-input dui-input-sm",
				placeholder: e.suggestedActorName,
				value: e.actorName,
				type: "text",
				onInput: r
			}, null, 40, ag)])]),
			_: 1
		}), Y("div", og, [X(Eh, {
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
		]), Y("details", sg, [i[3] ||= Y("summary", { class: "dui-collapse-title" }, "Complete build details", -1), Y("div", cg, [X(Fh, {
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
}), ug = {
	key: 0,
	class: "dui-list app:gap-1"
}, dg = [
	"onDragenter",
	"onDragover",
	"onDrop"
], fg = ["onDragstart"], pg = {
	key: 0,
	class: "dui-avatar"
}, mg = { class: "app:size-10 app:rounded-md" }, hg = ["src"], gg = {
	key: 1,
	class: "dui-badge dui-badge-sm"
}, _g = { class: "dui-list-col-grow app:min-w-0" }, vg = { class: "app:flex app:min-w-0 app:flex-wrap app:items-center app:gap-1" }, yg = { class: "app:truncate" }, bg = {
	key: 0,
	class: "dui-badge dui-badge-info dui-badge-xs"
}, xg = {
	key: 1,
	class: "dui-badge dui-badge-info dui-badge-xs"
}, Sg = { class: "app:flex app:min-w-0 app:items-center app:gap-2 app:text-xs" }, Cg = { class: "app:shrink-0" }, wg = ["title"], Tg = { class: "app:flex app:items-center app:justify-end app:gap-1" }, Eg = { class: "app:flex app:items-center app:gap-1 app:text-xs" }, Dg = ["value", "onInput"], Og = { class: "dui-join" }, kg = ["disabled", "onClick"], Ag = ["disabled", "onClick"], jg = ["onClick"], Mg = {
	key: 1,
	class: "dui-alert"
}, Ng = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(dm, {
			description: "Careers are applied in this order. Drag rows or use the buttons to reorder them.",
			number: "2",
			title: "Career Queue"
		}, {
			default: H(() => [e.careers.length ? (K(), q("ol", ug, [(K(!0), q(G, null, W(e.careers, (t, a) => (K(), q("li", {
				key: t.uuid,
				class: I(["dui-list-row app:grid-cols-[auto_auto_minmax(0,1fr)_auto] app:items-center app:gap-2 app:rounded-md app:px-2 app:py-2", {
					"app:border-t-2 app:border-dashed app:border-info": i(a) === "before",
					"app:border-b-2 app:border-dashed app:border-info": i(a) === "after",
					"app:opacity-60": e.draggedCareerIndex === a
				}]),
				onDragenter: Nl((e) => r("careerDragEnter", a), ["prevent", "stop"]),
				onDragover: (e) => r("careerDragOver", a, e),
				onDrop: (e) => r("careerDropOnRow", a, e)
			}, [
				Y("span", {
					"aria-hidden": "true",
					class: I(["dui-badge dui-badge-ghost dui-badge-sm app:cursor-grab", { "app:cursor-grabbing": e.draggedCareerIndex === a }]),
					draggable: "true",
					title: "Drag to reorder",
					onDragend: n[0] ||= (e) => r("careerDragEnd"),
					onDragstart: (e) => r("careerDragStart", a, e)
				}, " Drag ", 42, fg),
				t.img ? (K(), q("div", pg, [Y("div", mg, [Y("img", {
					src: t.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "40",
					width: "40"
				}, null, 8, hg)])])) : (K(), q("span", gg, L(V(Jm)(t.name)), 1)),
				Y("div", _g, [Y("div", vg, [Y("strong", yg, L(t.name), 1), e.draggedCareerIndex === a ? (K(), q("span", bg, " Dragging ")) : i(a) ? (K(), q("span", xg, " Place " + L(i(a)), 1)) : Q("", !0)]), Y("div", Sg, [Y("span", Cg, [Z(L(t.careerGroup || "Career") + " ", 1), t.level === null ? Q("", !0) : (K(), q(G, { key: 0 }, [Z(" level " + L(t.level), 1)], 64))]), Y("small", {
					class: "dui-badge dui-badge-ghost dui-badge-sm app:min-w-0 app:truncate",
					title: [
						`Characteristics: ${V(qm)(t.grants.characteristics)}`,
						`Skills: ${V(qm)(t.grants.skills)}`,
						`Talents: ${V(qm)(t.grants.talents)}`,
						`Trappings: ${V(qm)(t.grants.trappings)}`
					].join("\n")
				}, L(V(Km)(t)), 9, wg)])]),
				Y("div", Tg, [Y("label", Eg, [n[1] ||= Z(" Qty ", -1), Y("input", {
					class: "dui-input dui-input-xs app:w-14",
					value: t.quantity,
					min: "1",
					type: "number",
					onInput: (e) => r("careerQuantityInput", a, e)
				}, null, 40, Dg)]), Y("div", Og, [
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						disabled: a === 0,
						title: "Move career earlier",
						type: "button",
						onClick: (e) => r("moveCareer", a, -1)
					}, " Up ", 8, kg),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						disabled: a === e.careers.length - 1,
						title: "Move career later",
						type: "button",
						onClick: (e) => r("moveCareer", a, 1)
					}, " Down ", 8, Ag),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						type: "button",
						onClick: (e) => r("removeCareer", a)
					}, " Remove ", 8, jg)
				])])
			], 42, dg))), 128))])) : (K(), q("p", Mg, "No careers queued yet."))]),
			_: 1
		}));
	}
}), Pg = { class: "app:grid app:gap-2" }, Fg = { class: "app:flex app:flex-wrap app:items-center app:gap-2" }, Ig = { class: "dui-join app:min-w-64 app:flex-1" }, Lg = { class: "dui-input dui-input-sm dui-join-item app:flex-1" }, Rg = ["onKeydown"], zg = { class: "dui-badge dui-badge-sm dui-badge-outline" }, Bg = { class: "app:grid app:gap-2 md:app:grid-cols-3" }, Vg = [
	"onDragenter",
	"onDragleave",
	"onDragover",
	"onDrop"
], Hg = { class: "dui-card-body app:gap-2 app:p-2" }, Ug = { class: "app:flex app:items-center app:gap-2" }, Wg = { class: "dui-card-title app:m-0 app:text-sm" }, Gg = { class: "dui-badge dui-badge-sm" }, Kg = {
	key: 0,
	"aria-live": "polite",
	class: "dui-badge dui-badge-info dui-badge-sm app:ml-auto"
}, qg = { class: "app:flex app:min-h-8 app:flex-wrap app:items-center app:gap-2" }, Jg = [
	"title",
	"onClick",
	"onDragstart",
	"onKeydown"
], Yg = {
	key: 0,
	class: "app:text-base-content/60"
}, Xg = { class: "dui-card-body app:flex-row app:items-center app:justify-center app:gap-2 app:p-2" }, Zg = { "aria-live": "polite" }, Qg = /* @__PURE__ */ U({
	__name: "PortraitFilterTags",
	props: {
		resultCount: {},
		tags: {}
	},
	emits: ["createSearchTerm", "filterTagSectionChange"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ B(""), a = /* @__PURE__ */ B(null), o = /* @__PURE__ */ B(null), s = [
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
		], c = $(() => Object.fromEntries(s.map((e) => [e.id, n.tags.filter((t) => t.section === e.id)])));
		function l() {
			let e = i.value;
			r("createSearchTerm", e), i.value = "";
		}
		function u(e, t) {
			t.stopPropagation(), a.value = e, t.dataTransfer?.setData("text/plain", pf(e.id)), t.dataTransfer?.setData(af, e.id), t.dataTransfer && (t.dataTransfer.effectAllowed = "move");
		}
		function d(e, t) {
			t.preventDefault(), t.stopPropagation(), o.value = e, t.dataTransfer && (t.dataTransfer.dropEffect = _(a.value, e) ? "move" : "none");
		}
		function f(e, t) {
			t.stopPropagation(), !(t.currentTarget instanceof Node && t.relatedTarget instanceof Node && t.currentTarget.contains(t.relatedTarget)) && o.value === e && (o.value = null);
		}
		function p(e, t) {
			t.preventDefault(), t.stopPropagation();
			let i = t.dataTransfer?.getData("application/x-wfrp4e-customizer-portrait-filter-tag") || mf(t.dataTransfer?.getData("text/plain") ?? ""), o = a.value ?? n.tags.find((e) => e.id === i) ?? null;
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
		let y = $(() => o.value === "removed" ? a.value?.canRemove ? "Drop to remove this tag" : "Source tags stay available" : "Trash");
		return (t, n) => (K(), q("section", Pg, [
			Y("div", Fg, [Y("div", Ig, [Y("label", Lg, [n[5] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-magnifying-glass"
			}, null, -1), za(Y("input", {
				"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
				"aria-label": "Add a portrait search term",
				class: "app:grow",
				placeholder: "Add a search term",
				type: "search",
				onKeydown: Fl(Nl(l, ["prevent"]), ["enter"])
			}, null, 40, Rg), [[wl, i.value]])]), Y("button", {
				class: "dui-btn dui-btn-sm dui-join-item",
				type: "button",
				onClick: l
			}, [...n[6] ||= [Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-plus"
			}, null, -1), Z(" Add ", -1)]])]), Y("span", zg, L(e.resultCount) + " images", 1)]),
			Y("div", Bg, [(K(), q(G, null, W(s, (e) => Y("section", {
				key: e.id,
				class: I(["dui-card dui-card-border dui-card-sm app:min-h-20 app:border-base-content/30 app:bg-base-200 app:shadow-sm", { "app:border-info app:bg-info/10 app:ring-2 app:ring-info": o.value === e.id }]),
				onDragenter: (t) => d(e.id, t),
				onDragleave: (t) => f(e.id, t),
				onDragover: (t) => d(e.id, t),
				onDrop: (t) => p(e.id, t)
			}, [Y("div", Hg, [Y("header", Ug, [
				Y("h3", Wg, [Y("i", {
					"aria-hidden": "true",
					class: I(["fa-solid", e.icon])
				}, null, 2), Z(" " + L(e.title), 1)]),
				Y("span", Gg, L(c.value[e.id].length), 1),
				o.value === e.id ? (K(), q("span", Kg, L(v(e.id)), 1)) : Q("", !0)
			]), Y("div", qg, [(K(!0), q(G, null, W(c.value[e.id], (e) => (K(), q("button", {
				key: e.id,
				class: I(["dui-badge dui-badge-sm app:h-auto app:cursor-grab app:whitespace-normal app:py-1", [e.kind === "source" ? "dui-badge-outline" : "dui-badge-primary", a.value?.id === e.id ? "app:opacity-50" : ""]]),
				draggable: "true",
				title: `Drag ${e.label} to another group, or select it to move it to the next group.`,
				type: "button",
				onClick: (t) => m(e),
				onDragend: g,
				onDragstart: (t) => u(e, t),
				onKeydown: Fl(Nl((t) => h(e), ["prevent"]), ["delete"])
			}, L(e.label), 43, Jg))), 128)), c.value[e.id].length ? Q("", !0) : (K(), q("small", Yg, " Drop tags here "))])])], 42, Vg)), 64))]),
			Y("div", {
				"aria-label": "Remove search tag",
				class: I(["dui-card dui-card-border dui-card-sm app:border-dashed app:border-base-content/30 app:bg-base-200", {
					"app:border-error app:bg-error/10 app:ring-2 app:ring-error": o.value === "removed" && !a.value?.canRemove,
					"app:border-warning app:bg-warning/10 app:ring-2 app:ring-warning": o.value === "removed" && a.value?.canRemove
				}]),
				onDragenter: n[1] ||= (e) => d("removed", e),
				onDragleave: n[2] ||= (e) => f("removed", e),
				onDragover: n[3] ||= (e) => d("removed", e),
				onDrop: n[4] ||= (e) => p("removed", e)
			}, [Y("div", Xg, [n[7] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-trash"
			}, null, -1), Y("span", Zg, L(y.value), 1)])], 34)
		]));
	}
}), $g = ["aria-busy"], e_ = {
	key: 0,
	class: "dui-alert dui-alert-error app:min-h-0 app:py-2",
	role: "alert"
}, t_ = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info app:min-h-0 app:gap-2 app:py-2",
	role: "status"
}, n_ = { class: "app:flex app:min-w-0 app:flex-1 app:items-center app:gap-2" }, r_ = { class: "app:shrink-0" }, i_ = ["value"], a_ = {
	key: 2,
	class: "dui-alert dui-alert-warning app:min-h-0 app:py-2"
}, o_ = { class: "dui-list app:m-0 app:grid app:grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] app:gap-3 app:p-0" }, s_ = [
	"aria-label",
	"aria-pressed",
	"title",
	"onClick"
], c_ = ["loading", "src"], l_ = { class: "app:flex app:flex-wrap app:items-center app:justify-between app:gap-1" }, u_ = {
	key: 0,
	class: "dui-badge dui-badge-success dui-badge-sm"
}, d_ = { class: "app:text-sm" }, f_ = {
	key: 4,
	class: "dui-alert"
}, p_ = /* @__PURE__ */ U({
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
		return (t, i) => (K(), q("section", {
			"aria-busy": e.isLoading,
			class: "app:flex app:min-h-0 app:flex-col app:gap-2"
		}, [
			X(Qg, {
				"result-count": e.options.length,
				tags: e.tags,
				onCreateSearchTerm: i[0] ||= (e) => r("createSearchTerm", e),
				onFilterTagSectionChange: i[1] ||= (e, t) => r("filterTagSectionChange", e, t)
			}, null, 8, ["result-count", "tags"]),
			e.errorMessage ? (K(), q("div", e_, [i[2] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-triangle-exclamation"
			}, null, -1), Y("span", null, L(e.errorMessage), 1)])) : Q("", !0),
			e.isLoading ? (K(), q("div", t_, [i[3] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-spinner fa-spin"
			}, null, -1), Y("div", n_, [Y("small", r_, L(e.progressLabel || "Updating results..."), 1), Y("progress", {
				"aria-label": "Portrait search progress",
				class: "dui-progress app:min-w-24 app:flex-1",
				value: e.progressValue,
				max: "100"
			}, null, 8, i_)])])) : e.searchTerms.length && !e.options.length ? (K(), q("p", a_, " No portraits match the current filter tags. ")) : Q("", !0),
			e.options.length ? (K(), q("div", {
				key: 3,
				class: I(["app:pr-1", e.fillHeight ? "app:min-h-48 app:flex-1 app:overflow-y-auto" : "app:max-h-[30rem] app:overflow-y-auto"])
			}, [Y("ul", o_, [(K(!0), q(G, null, W(e.options, (t, n) => (K(), q("li", { key: t.key }, [Y("button", {
				"aria-label": V(yf)(t),
				"aria-pressed": t.key === e.selectedOptionKey,
				class: I(["dui-btn app:h-auto app:min-h-0 app:w-full app:flex-col app:items-stretch app:justify-start app:gap-2 app:overflow-hidden app:whitespace-normal app:p-2 app:text-left", t.key === e.selectedOptionKey ? "dui-btn-active dui-btn-outline" : "dui-btn-ghost"]),
				title: V(vf)(t),
				type: "button",
				onClick: (e) => r("selectPortrait", t)
			}, [
				Y("img", {
					alt: "",
					class: "app:aspect-square app:w-full app:rounded-box app:bg-base-300 app:object-cover",
					height: "192",
					loading: n < 6 ? "eager" : "lazy",
					src: t.img,
					width: "192"
				}, null, 8, c_),
				Y("span", l_, [Y("small", null, L(V(bf)(t)), 1), t.key === e.selectedOptionKey ? (K(), q("span", u_, " Selected ")) : Q("", !0)]),
				Y("strong", d_, L(t.label), 1)
			], 10, s_)]))), 128))])], 2)) : e.isLoading ? Q("", !0) : (K(), q("p", f_, L(n.emptyMessage), 1))
		], 8, $g));
	}
}), m_ = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(Ip, {
			"close-label": "Done",
			open: e.open,
			title: "Choose an NPC Portrait",
			wide: "",
			onClose: r[3] ||= (e) => n("close")
		}, {
			default: H(() => [X(p_, {
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
}), h_ = {
	key: 0,
	class: "dui-alert"
}, g_ = {
	key: 0,
	class: "dui-avatar"
}, __ = { class: "app:size-14 app:shrink-0 app:rounded-lg" }, v_ = ["src"], y_ = {
	key: 1,
	class: "dui-badge"
}, b_ = {
	key: 1,
	class: "dui-alert dui-alert-info"
}, x_ = { class: "dui-card-actions" }, S_ = ["disabled"], C_ = {
	key: 2,
	class: "dui-alert"
}, w_ = /* @__PURE__ */ U({
	__name: "QuickCareerPanel",
	props: {
		careers: {},
		finalCareer: {}
	},
	emits: ["clearCareers"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (K(), J(dm, {
			description: "Quick Build keeps one chosen Career chain instead of a manual queue.",
			number: "2",
			title: "Career"
		}, {
			default: H(() => [
				e.finalCareer ? (K(), q("article", h_, [e.finalCareer.img ? (K(), q("div", g_, [Y("div", __, [Y("img", {
					src: e.finalCareer.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "56",
					width: "56"
				}, null, 8, v_)])])) : (K(), q("span", y_, L(V(Jm)(e.finalCareer.name)), 1)), Y("div", null, [
					Y("strong", null, L(e.finalCareer.name), 1),
					Y("span", null, [Z(L(e.finalCareer.careerGroup || "Career") + " ", 1), e.finalCareer.level === null ? Q("", !0) : (K(), q(G, { key: 0 }, [Z(" level " + L(e.finalCareer.level), 1)], 64))]),
					Y("small", null, L(V(Km)(e.finalCareer)), 1)
				])])) : Q("", !0),
				e.careers.length > 1 ? (K(), q("div", b_, [Y("span", null, L(e.careers.length - 1) + " lower-tier Career" + L(e.careers.length === 2 ? "" : "s"), 1), Y("span", null, "Included before " + L(e.finalCareer?.name) + ".", 1)])) : Q("", !0),
				Y("div", x_, [Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: !e.careers.length,
					type: "button",
					onClick: r[0] ||= (e) => n("clearCareers")
				}, " Clear Career ", 8, S_)]),
				e.careers.length ? Q("", !0) : (K(), q("p", C_, "No Career selected."))
			]),
			_: 1
		}));
	}
}), T_ = {
	key: 0,
	class: "dui-fieldset"
}, E_ = { class: "dui-fieldset-legend" }, D_ = { class: "dui-card-actions" }, O_ = ["aria-pressed", "onClick"], k_ = /* @__PURE__ */ U({
	__name: "TraitButtonGroup",
	props: {
		caption: {},
		title: {},
		traits: {}
	},
	emits: ["toggleTrait"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => e.traits.length ? (K(), q("fieldset", T_, [Y("legend", E_, [Y("span", null, L(e.title), 1), Y("span", null, L(e.caption), 1)]), Y("div", D_, [(K(!0), q(G, null, W(e.traits, (e) => (K(), q("button", {
			key: e.uuid,
			"aria-pressed": e.isSelected,
			class: I(["dui-btn dui-btn-sm", { "dui-btn-active": e.isSelected }]),
			type: "button",
			onClick: (t) => n("toggleTrait", e)
		}, L(e.name), 11, O_))), 128))])])) : Q("", !0);
	}
});
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/errors.ts
function A_(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not resolve that Actor drop.";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/useBaseActorSelection.ts
function j_(e, t) {
	let n = Op(), { baseActors: r, selectedBaseActorUuid: i } = xu(n), a = /* @__PURE__ */ B(""), o = $(() => {
		let e = a.value.trim().toLocaleLowerCase();
		return e ? r.value.filter((t) => t.name.toLocaleLowerCase().includes(e)) : r.value;
	}), s = $({
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
			t.value = A_(e);
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
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/useBuildPreview.ts
function M_() {
	let { advancements: e, careers: t, finalPortraitPath: n, selectedBaseActor: r, trappings: i } = xu(Op()), a = $(() => {
		let e = 0;
		for (let n of t.value) e += n.quantity;
		return e;
	}), o = $(() => i.value.filter((e) => !e.ignored).length), s = $(() => e.value.filter((e) => e.current !== e.careerValue).length), c = $(() => i.value.filter((e) => !e.ignored && e.resolution.status === "fallback").length), l = $(() => i.value.filter((e) => e.ignored).length), u = $(() => e.value.filter((e) => e.kind === "skill" && Iu(e.name) !== null).length), d = $(() => i.value.filter((e) => !e.ignored && e.resolution.status === "unresolved").length), f = $(() => {
		let e = [];
		return r.value || e.push("Choose a base Actor before building."), t.value.length || e.push("No Careers are queued."), u.value && e.push(`${u.value} skill rows still need a specialization.`), d.value && e.push(`${d.value} trappings have no item resolution yet.`), n.value || e.push("No portrait is selected."), e;
	});
	return {
		buildPreviewStatus: $(() => f.value.length ? "Review" : "Ready"),
		buildPreviewWarnings: f,
		careerItemCount: a,
		editedAdvanceCount: s,
		fallbackTrappingCount: c,
		ignoredTrappingCount: l,
		visibleTrappingCount: o
	};
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/useBuildTraits.ts
function N_() {
	let e = Op(), { optionalTraits: t, quickTraits: n, traits: r } = xu(e), i = $(() => new Set(r.value.map((e) => P_(e.name)))), a = $(() => t.value.map(s)), o = $(() => {
		let e = new Set(t.value.map((e) => P_(e.name)));
		return n.value.filter((t) => !e.has(P_(t.name))).map(s);
	});
	function s(e) {
		return {
			...e,
			isSelected: i.value.has(P_(e.name))
		};
	}
	function c(t) {
		let n = i.value.has(P_(t.name));
		e.setQuickTraitSelected(t, !n);
	}
	function l(t) {
		let n = i.value.has(P_(t.name));
		e.setOptionalTraitSelected(t, !n);
	}
	return {
		displayedQuickTraitOptions: o,
		optionalTraitOptions: a,
		toggleOptionalTrait: l,
		toggleQuickTrait: c
	};
}
function P_(e) {
	return e.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/useCareerQueue.ts
function F_() {
	let e = Op(), t = /* @__PURE__ */ B(null), n = /* @__PURE__ */ B(null);
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
//#region src/module/apps/npc-builder/functions/portrait-candidates.ts
var I_ = af;
function L_(e) {
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
	}), Jd(t);
}
function R_(e) {
	let t = [];
	e.selectedBaseActor && t.push(e.selectedBaseActor.species, e.selectedBaseActor.name);
	for (let n of e.careers) t.push(n.name, n.careerGroup);
	return sf(t);
}
//#endregion
//#region src/module/state/portrait-gallery/workflow.ts
function z_(e) {
	let t = /* @__PURE__ */ B([]), n = /* @__PURE__ */ B(null), r = /* @__PURE__ */ B(!1), i = /* @__PURE__ */ B(null), a = 0, o = $(() => B_([...e.baseSearchTerms.value, ...e.filterState.customPortraitSearchTerms.value])), s = $(() => x("search")), c = $(() => x("must-include")), l = $(() => x("must-exclude")), u = $(() => B_([...s.value, ...c.value])), d = $(() => n.value ?? Yd({
		assetCandidates: t.value,
		immediateCandidates: e.immediateCandidates.value,
		selectedPortraitPath: e.pinnedPortraitPath.value
	})), f = $(() => Gd(d.value)), p = $(() => [...o.value.flatMap(S), ...f.value.map(C)]), m = $(() => d.value.filter((e) => ff(e, {
		mustExcludeSources: w("must-exclude"),
		mustExcludeTerms: l.value,
		mustIncludeSources: w("must-include"),
		mustIncludeTerms: c.value
	}))), h = $(() => m.value.find((t) => t.img === e.activePortraitPath.value) ?? null), g = $(() => h.value?.key ?? ""), _ = $(() => _f(i.value)), v = $(() => gf(i.value));
	Ka(o, (t) => e.filterState.retainAvailablePortraitFilterTerms(t), { immediate: !0 }), Ka(() => [
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
		let s = e.hasSubject.value, d = hf({
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
			}, r) : [], f = Yd({
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
		return uf(o.value, e.filterState.portraitTermSections.value, t);
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
function B_(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/module/apps/npc-builder/state/workflows/portrait-candidates-workflow.ts
function V_(e, t) {
	let n = Op(), { careers: r, customPortraitSearchTerms: i, finalPortraitPath: a, portraitSourceTagSections: o, portraitTermSections: s, selectedBaseActor: c, selectedPortraitPath: l, settings: u } = xu(n), d = $(() => L_({
		careers: r.value,
		selectedBaseActor: c.value
	})), f = $(() => R_({
		careers: r.value,
		selectedBaseActor: c.value
	})), p = $(() => lf({
		configuredFolders: u.value.prioritizedPortraitFolders,
		hasCareer: r.value.length > 0
	})), m = z_({
		activePortraitPath: a,
		baseSearchTerms: f,
		errorMessage: t,
		excludeFullyTransparentImages: $(() => u.value.excludeFullyTransparentPortraitAssets),
		excludedReferenceImagePaths: $(() => u.value.excludedPortraitReferenceImages),
		filterState: {
			addCustomPortraitSearchTerm: n.addCustomPortraitSearchTerm,
			customPortraitSearchTerms: i,
			portraitSourceTagSections: o,
			portraitTermSections: s,
			retainAvailablePortraitFilterTerms: n.retainAvailablePortraitFilterTerms,
			setPortraitSourceTagSection: n.setPortraitSourceTagSection,
			setPortraitTermSection: n.setPortraitTermSection
		},
		hasSubject: $(() => !!c.value || r.value.length > 0),
		immediateCandidates: d,
		includeCompendiumAssets: $(() => u.value.searchCompendiumPortraitAssets),
		includeFilePickerAssets: $(() => u.value.searchFoundryPortraitAssets),
		pinnedPortraitPath: l,
		priorityFolderPaths: p,
		provider: {
			filterPortraitCandidates: e.filterPortraitCandidates,
			listPortraitCandidates: e.listFoundryPortraitCandidates
		},
		searchErrorMessage: "The NPC Builder could not finish searching for portraits.",
		selectPortrait: (e) => n.selectPortrait(e.img)
	}), h = $(() => m.portraitCandidates.value.slice(0, 4)), g = $(() => Math.max(0, m.portraitCandidates.value.length - h.value.length));
	return {
		...m,
		compactPortraitCandidates: h,
		hiddenPortraitCandidateCount: g
	};
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/usePortraitCandidates.ts
function H_(e, t) {
	let n = V_(e, t), r = /* @__PURE__ */ B(!1);
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
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab.vue?vue&type=script&setup=true&lang.ts
var U_ = { class: "app:grid app:gap-3" }, W_ = { class: "app:grid app:items-start app:gap-3 md:app:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]" }, G_ = { class: "app:grid app:min-w-0 app:gap-3" }, K_ = /* @__PURE__ */ U({
	__name: "NpcBuilderBuildTab",
	props: {
		bridge: {},
		isLoadingActors: { type: Boolean },
		isLoadingBaseDraft: { type: Boolean },
		page: {}
	},
	setup(e) {
		let t = e, n = Op(), { actorName: r, advancements: i, careers: a, estimatedNpcXp: o, finalActorName: s, finalCareer: c, finalPortraitPath: l, grantTotals: u, selectedBaseActor: d, selectedSpells: f, suggestedActorName: p, traits: m } = xu(n), h = /* @__PURE__ */ B(""), { actorFilter: g, filteredActors: _, selectedBaseActorSelectValue: v } = j_(t.bridge, h), { clearCareerDragState: y, draggedCareerIndex: b, dragOverCareerIndex: x, handleCareerDragOver: S, handleCareerDragStart: C, handleCareerDrop: w, moveCareer: T, removeCareer: E, setCareerQuantity: D, setDragOverCareerIndex: ee } = F_(), { displayedQuickTraitOptions: O, optionalTraitOptions: te, toggleOptionalTrait: k, toggleQuickTrait: ne } = N_(), { buildPreviewStatus: A, buildPreviewWarnings: re, careerItemCount: ie, editedAdvanceCount: ae, fallbackTrappingCount: oe, ignoredTrappingCount: se, visibleTrappingCount: ce } = M_(), { addPortraitSearchTerm: le, compactPortraitCandidates: ue, hiddenPortraitCandidateCount: de, isLoadingPortraitCandidates: fe, isPortraitGalleryOpen: pe, portraitCandidates: me, portraitFilterTags: he, portraitSearchProgress: ge, portraitSearchProgressLabel: _e, portraitSearchProgressValue: ve, portraitSearchTerms: ye, selectedPortraitCandidate: be, selectedPortraitCandidateKey: xe, selectPortrait: Se, selectPortraitFromGallery: Ce, setPortraitFilterTagSection: we } = H_(t.bridge, h);
		return (t, Te) => (K(), q("section", U_, [Y("div", W_, [Y("div", G_, [
			e.page === "build-quick" || e.page === "build-actor" ? (K(), J(sh, {
				key: 0,
				"actor-filter": V(g),
				description: e.page === "build-quick" ? "Choose the base statblock for this fast NPC draft." : "Choose the base statblock before reviewing detailed build pages.",
				"error-message": h.value,
				"filtered-actors": V(_),
				"is-loading-actors": e.isLoadingActors,
				"is-loading-base-draft": e.isLoadingBaseDraft,
				number: e.page === "build-quick" ? "1" : "",
				"selected-base-actor": V(d),
				"selected-base-actor-uuid": V(v),
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
			])) : Q("", !0),
			e.page === "build-quick" ? (K(), J(w_, {
				key: 1,
				careers: V(a),
				"final-career": V(c),
				onClearCareers: V(n).clearCareers
			}, null, 8, [
				"careers",
				"final-career",
				"onClearCareers"
			])) : Q("", !0),
			e.page === "build-quick" ? (K(), J(dm, {
				key: 2,
				description: "Apply optional base traits and configured quick traits to the draft.",
				number: "3",
				title: "Quick Traits"
			}, {
				default: H(() => [X(k_, {
					caption: `${V(te).length} from base statblock`,
					traits: V(te),
					title: "Optional Traits",
					onToggleTrait: V(k)
				}, null, 8, [
					"caption",
					"traits",
					"onToggleTrait"
				]), X(k_, {
					caption: `${V(O).length} configured`,
					traits: V(O),
					title: "Quick Traits",
					onToggleTrait: V(ne)
				}, null, 8, [
					"caption",
					"traits",
					"onToggleTrait"
				])]),
				_: 1
			})) : Q("", !0),
			e.page === "build-careers" ? (K(), J(Ng, {
				key: 3,
				careers: V(a),
				"drag-over-career-index": V(x),
				"dragged-career-index": V(b),
				onCareerDragEnd: V(y),
				onCareerDragEnter: V(ee),
				onCareerDragOver: V(S),
				onCareerDragStart: V(C),
				onCareerDropOnRow: V(w),
				onCareerQuantityInput: V(D),
				onMoveCareer: V(T),
				onRemoveCareer: V(E)
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
			])) : Q("", !0)
		]), X(lg, {
			class: "app:min-w-0",
			"actor-name": V(r),
			"advancement-count": V(i).length,
			"build-preview-status": V(A),
			"build-preview-warnings": V(re),
			"career-item-count": V(ie),
			"compact-portrait-candidates": V(ue),
			"edited-advance-count": V(ae),
			"estimated-npc-xp": V(o),
			"fallback-trapping-count": V(oe),
			"final-actor-name": V(s),
			"final-career": V(c),
			"final-portrait-path": V(l),
			"grant-totals": V(u),
			"hidden-portrait-candidate-count": V(de),
			"ignored-trapping-count": V(se),
			"is-loading-portrait-candidates": V(fe),
			"portrait-candidates": V(me),
			"portrait-search-progress": V(ge),
			"portrait-search-progress-label": V(_e),
			"portrait-search-progress-value": V(ve),
			"selected-base-actor": V(d),
			"selected-portrait-candidate": V(be),
			"selected-portrait-candidate-key": V(xe),
			"selected-spell-count": V(f).length,
			"suggested-actor-name": V(p),
			"trait-count": V(m).length,
			"visible-trapping-count": V(ce),
			onActorNameChange: Te[2] ||= (e) => r.value = e,
			onOpenPortraitGallery: Te[3] ||= (e) => pe.value = !0,
			onSelectPortrait: V(Se)
		}, null, 8, /* @__PURE__ */ "actor-name.advancement-count.build-preview-status.build-preview-warnings.career-item-count.compact-portrait-candidates.edited-advance-count.estimated-npc-xp.fallback-trapping-count.final-actor-name.final-career.final-portrait-path.grant-totals.hidden-portrait-candidate-count.ignored-trapping-count.is-loading-portrait-candidates.portrait-candidates.portrait-search-progress.portrait-search-progress-label.portrait-search-progress-value.selected-base-actor.selected-portrait-candidate.selected-portrait-candidate-key.selected-spell-count.suggested-actor-name.trait-count.visible-trapping-count.onSelectPortrait".split("."))]), X(m_, {
			"is-loading-portrait-candidates": V(fe),
			open: V(pe),
			"portrait-candidates": V(me),
			"portrait-filter-tags": V(he),
			"portrait-search-progress-label": V(_e),
			"portrait-search-progress-value": V(ve),
			"portrait-search-terms": V(ye),
			"selected-portrait-candidate-key": V(xe),
			onCreateSearchTerm: V(le),
			onClose: Te[4] ||= (e) => pe.value = !1,
			onFilterTagSectionChange: V(we),
			onSelectPortrait: V(Ce)
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
}), q_ = {
	Average: "avg",
	Enormous: "enor",
	Large: "lrg",
	Little: "ltl",
	Monstrous: "mnst",
	Small: "sml",
	Tiny: "tiny"
}, J_ = new Set(["bestial", "skittish"]);
function Y_(e) {
	let t = e.some((e) => ev(e, "skittish")), n = e.some((e) => tv(e, "trained", "war")), r = rv(e.filter((e) => ev(e, "weapon")));
	return e.map((e) => {
		let i = Z_(e.name);
		return J_.has(i) ? $_(e, `${e.name} is removed from combined mounts.`) : i === "weapon" ? !n || t ? $_(e, "Weapon requires Trained (War) and a mount that was not Skittish.") : e.uuid === r ? Q_(e, "Weapon (Mount)") : $_(e, "Only the strongest Weapon trait is retained for the combined profile.") : Q_(e, e.damage ? nv(e.name) : e.name);
	});
}
function X_(e) {
	return Z_(e) === "armour";
}
function Z_(e) {
	return e.trim().replace(/\s*\(mount\)\s*$/i, "").toLocaleLowerCase();
}
function Q_(e, t) {
	return {
		fixedDamage: e.fixedDamage,
		included: !0,
		name: e.name,
		outputName: t,
		reason: "",
		sourceUuid: e.uuid
	};
}
function $_(e, t) {
	return {
		fixedDamage: e.fixedDamage,
		included: !1,
		name: e.name,
		outputName: "",
		reason: t,
		sourceUuid: e.uuid
	};
}
function ev(e, t) {
	return Z_(e.name) === t;
}
function tv(e, t, n) {
	return ev(e, t) ? e.specification.trim().toLocaleLowerCase() === n : e.name.trim().toLocaleLowerCase() === `${t} (${n})`;
}
function nv(e) {
	return /\(mount\)\s*$/i.test(e.trim()) ? e.trim() : `${e.trim()} (Mount)`;
}
function rv(e) {
	return [...e].sort((e, t) => (t.fixedDamage ?? 0) - (e.fixedDamage ?? 0) || e.uuid.localeCompare(t.uuid))[0]?.uuid ?? "";
}
//#endregion
//#region src/module/apps/npc-builder/functions/combined-profile/calculate.ts
var iv = [
	q_.Tiny,
	q_.Little,
	q_.Small,
	q_.Average,
	q_.Large,
	q_.Enormous,
	q_.Monstrous
], av = {
	[q_.Average]: "Average",
	[q_.Enormous]: "Enormous",
	[q_.Large]: "Large",
	[q_.Little]: "Little",
	[q_.Monstrous]: "Monstrous",
	[q_.Small]: "Small",
	[q_.Tiny]: "Tiny"
};
function ov(e, t) {
	return {
		chargeStrengthBonus: Math.max(t.characteristics.strengthBonus - e.characteristics.strengthBonus, 0),
		initiative: Math.max(e.characteristics.initiative, t.characteristics.initiative),
		movement: t.movement,
		size: cv(e.size, t.size),
		strength: e.characteristics.strength,
		toughness: Math.max(e.characteristics.toughness, t.characteristics.toughness),
		traits: Y_(t.traits),
		wounds: sv(e.wounds, t.wounds)
	};
}
function sv(e, t) {
	return Math.max(1, Math.max(e, t) + Math.ceil(Math.min(e, t) * .25));
}
function cv(e, t) {
	return lv(t) > lv(e) ? t : e;
}
function lv(e) {
	return iv.indexOf(e);
}
//#endregion
//#region src/module/apps/npc-builder/functions/combined-profile/trait-source.ts
function uv({ flagScope: e, mount: t, plan: n, rider: r }) {
	let i = "Combined Profile";
	return {
		effects: [{
			changes: [],
			disabled: !1,
			flags: { [e]: { generatedCombinedProfileEffect: !0 } },
			img: t.img || "icons/svg/wing.svg",
			name: i,
			system: {
				scriptData: dv(e, n),
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
			description: { value: pv(r, t, n) },
			specification: { value: `${r.name} + ${t.name}` }
		},
		type: "trait"
	};
}
function dv(e, t) {
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
		script: fv(e, t.chargeStrengthBonus),
		trigger: "preRollTest"
	}), n;
}
function fv(e, t) {
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
function pv(e, t, n) {
	return [
		"<p>Generated by Drowsy's WFRP4e Customizers. This Actor combines a rider and mount into one simplified NPC profile.</p>",
		`<p><strong>Rider:</strong> ${mv(e.name)}<br><strong>Mount:</strong> ${mv(t.name)}</p>`,
		`<p><strong>Movement:</strong> ${n.movement}; <strong>Wounds:</strong> ${n.wounds}; <strong>Charge SB:</strong> +${n.chargeStrengthBonus}.</p>`,
		"<p>Mount attack Traits use fixed damage captured from the mount. Skittish and Bestial are removed.</p>"
	].join("");
}
function mv(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
//#endregion
//#region src/types/foundry/document-drop.ts
var hv = "wfrp4e-customizer-apps.document-drop", gv = { class: "dui-list" }, _v = [
	"aria-label",
	"disabled",
	"title",
	"onClick"
], vv = ["src"], yv = {
	key: 1,
	"aria-hidden": "true",
	class: "fa-solid fa-scroll"
}, bv = { class: "app:min-w-0 app:break-words" }, xv = {
	key: 1,
	class: "dui-list-row"
}, Sv = /* @__PURE__ */ U({
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
		return (t, n) => (K(), q("ul", gv, [e.documents.length > 0 ? (K(!0), q(G, { key: 0 }, W(e.documents, (t) => (K(), q("li", {
			key: t.uuid,
			class: "dui-list-row"
		}, [Y("button", {
			"aria-label": e.isClickable ? `Use ${t.name}` : void 0,
			class: "dui-btn dui-btn-ghost app:col-span-full app:h-auto app:min-h-8 app:w-full app:justify-start app:whitespace-normal app:text-left",
			disabled: !e.isClickable,
			title: e.isClickable ? t.name : void 0,
			type: "button",
			onClick: Nl((e) => r(t), ["stop"])
		}, [t.img ? (K(), q("img", {
			key: 0,
			alt: "",
			"aria-hidden": "true",
			src: t.img,
			width: "24",
			height: "24",
			class: "app:size-6 app:shrink-0 app:object-contain"
		}, null, 8, vv)) : (K(), q("i", yv)), Y("span", bv, L(t.name), 1)], 8, _v)]))), 128)) : (K(), q("li", xv, [n[0] ||= Y("i", {
			"aria-hidden": "true",
			class: "fa-solid fa-arrow-down"
		}, null, -1), Y("span", null, L(e.emptyLabel), 1)]))]));
	}
}), Cv = { class: "dui-card-body dui-fieldset" }, wv = ["for"], Tv = ["id", "value"], Ev = ["for"], Dv = ["id", "value"], Ov = { class: "dui-card-actions" }, kv = /* @__PURE__ */ U({
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
		let n = t, r = eo(), i = eo();
		function a(e) {
			let t = e.target instanceof HTMLSelectElement ? e.target.value : "auto";
			(t === "Actor" || t === "auto" || t === "Item" || t === "JournalEntry" || t === "JournalEntryPage") && n("updateDocumentType", t);
		}
		function o(e) {
			n("updateDocumentValue", e.target instanceof HTMLInputElement ? e.target.value : "");
		}
		return (t, s) => (K(), q("form", {
			class: "dui-card dui-card-border dui-card-sm",
			onClick: s[2] ||= Nl(() => {}, ["stop"]),
			onSubmit: s[3] ||= Nl((e) => n("submit"), ["prevent"])
		}, [Y("fieldset", Cv, [
			s[6] ||= Y("legend", { class: "dui-fieldset-legend" }, "Manual document entry", -1),
			Y("label", {
				class: "dui-label",
				for: V(r)
			}, "Document type", 8, wv),
			Y("select", {
				id: V(r),
				class: "dui-select",
				value: e.documentType,
				onChange: a
			}, [...s[4] ||= [ac("<option value=\"auto\">Auto</option><option value=\"Item\">Item</option><option value=\"Actor\">Actor</option><option value=\"JournalEntry\">Journal Entry</option><option value=\"JournalEntryPage\">Journal Page</option>", 5)]], 40, Tv),
			Y("label", {
				class: "dui-label",
				for: V(i)
			}, "UUID or drop JSON", 8, Ev),
			Y("input", {
				id: V(i),
				class: "dui-input",
				value: e.documentValue,
				placeholder: "Compendium.package.pack.id",
				type: "text",
				onInput: o
			}, null, 40, Dv),
			Y("div", Ov, [
				s[5] ||= Y("button", {
					class: "dui-btn dui-btn-primary",
					type: "submit"
				}, "Use", -1),
				Y("button", {
					class: "dui-btn",
					type: "button",
					onClick: s[0] ||= (e) => n("startPick")
				}, L(e.isPickingDocument ? "Waiting..." : "Pick Next Click"), 1),
				Y("button", {
					class: "dui-btn dui-btn-ghost",
					type: "button",
					onClick: s[1] ||= (e) => n("close")
				}, "Cancel")
			])
		])], 32));
	}
}), Av = ["aria-label", "aria-disabled"], jv = { key: 0 }, Mv = {
	key: 1,
	class: "dui-alert dui-alert-info",
	role: "status"
}, Nv = { key: 2 }, Pv = {
	key: 4,
	class: "dui-card-actions"
}, Fv = ["disabled"], Iv = /* @__PURE__ */ U({
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
		let n = e, r = Ha(hv);
		if (!r) throw Error("DocumentDrop requires a document drop bridge from its application host.");
		let i = r, a = Mo(), o = t, s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B(!1), l = /* @__PURE__ */ B(!1), u = /* @__PURE__ */ B("auto"), d = /* @__PURE__ */ B(""), f, p = $(() => !!a.prompt), m = $(() => !!a.default), h = $(() => n.showPrompt && (p.value || n.title.length > 0)), g = $(() => n.showDocuments ? n.documents : []), _ = $(() => n.manualEntryTrigger === "button"), v = $(() => n.variant === "bare" ? [] : [
			"dui-card",
			"dui-card-border",
			n.variant === "compact" ? "dui-card-xs" : "dui-card-sm"
		]);
		function y(e) {
			let t = e.currentTarget, n = e.relatedTarget;
			t instanceof Node && n instanceof Node && t.contains(n) || (s.value = !1);
		}
		function b() {
			n.disabled || (s.value = !0);
		}
		function x(e) {
			e.preventDefault(), e.stopPropagation(), s.value = !1, !n.disabled && o("dropData", e.dataTransfer?.getData("text/plain") ?? "");
		}
		function S() {
			n.manualEntryTrigger !== "none" && (c.value = !0);
		}
		function C() {
			c.value = !1, D();
		}
		function w() {
			if (!n.disabled) {
				if (c.value) {
					C();
					return;
				}
				S();
			}
		}
		function T() {
			if (n.disabled) return;
			let e = i.createDropData({
				documentType: u.value,
				value: d.value
			});
			e && (o("dropData", e), d.value = "", C());
		}
		function E() {
			n.disabled || f || (l.value = !0, f = i.startDocumentPick(ee));
		}
		function D() {
			let e = f;
			f = void 0, l.value = !1, e?.();
		}
		function ee(e) {
			o("dropData", e), C();
		}
		return yo(() => {
			D();
		}), Ka(() => n.disabled, (e) => {
			e && (s.value = !1, C());
		}), (t, n) => (K(), q("div", lc(t.$attrs, {
			class: v.value,
			"aria-label": e.title,
			"aria-disabled": e.disabled,
			role: "group",
			onDragenter: Nl(b, ["prevent"]),
			onDragover: Nl(b, ["prevent"]),
			onDragleave: y,
			onDrop: x
		}), [Y("div", { class: I(e.variant === "bare" ? void 0 : "dui-card-body") }, [
			h.value ? (K(), q("div", {
				key: 0,
				class: I(["dui-alert dui-alert-info", { "dui-alert-outline": !s.value }])
			}, [
				n[3] ||= Y("i", {
					"aria-hidden": "true",
					class: "fa-solid fa-arrow-down"
				}, null, -1),
				Y("div", null, [Eo(t.$slots, "prompt", {}, () => [Y("strong", null, L(e.title), 1), e.description ? (K(), q("p", jv, L(e.description), 1)) : Q("", !0)])]),
				Y("span", { class: I(["dui-badge", { "dui-badge-info": s.value }]) }, L(s.value ? "Release to add" : "Drop zone"), 3)
			], 2)) : s.value ? (K(), q("div", Mv, [n[4] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-arrow-down"
			}, null, -1), Y("span", null, "Release to add " + L(e.title.toLowerCase()) + ".", 1)])) : Q("", !0),
			m.value ? (K(), q("div", Nv, [Eo(t.$slots, "default")])) : Q("", !0),
			e.showDocuments ? (K(), J(Sv, {
				key: 3,
				documents: g.value,
				"empty-label": e.emptyDocumentLabel,
				"is-clickable": e.documentsClickable,
				onDocumentClicked: n[0] ||= (e) => o("documentClicked", e)
			}, null, 8, [
				"documents",
				"empty-label",
				"is-clickable"
			])) : Q("", !0),
			_.value ? (K(), q("div", Pv, [Y("button", {
				class: "dui-btn dui-btn-ghost dui-btn-sm",
				disabled: e.disabled,
				type: "button",
				onClick: Nl(w, ["stop"])
			}, L(c.value ? "Close Manual Entry" : "Manual Entry"), 9, Fv)])) : Q("", !0),
			c.value && !e.disabled ? (K(), J(kv, {
				key: 5,
				"document-type": u.value,
				"document-value": d.value,
				"is-picking-document": l.value,
				onClose: C,
				onStartPick: E,
				onSubmit: T,
				onUpdateDocumentType: n[1] ||= (e) => u.value = e,
				onUpdateDocumentValue: n[2] ||= (e) => d.value = e
			}, null, 8, [
				"document-type",
				"document-value",
				"is-picking-document"
			])) : Q("", !0)
		], 2)], 16, Av));
	}
});
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/errors.ts
function Lv(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderMountTab/CombinedProfilePreview.vue?vue&type=script&setup=true&lang.ts
var Rv = { class: "app:max-w-full app:overflow-x-auto" }, zv = { class: "dui-table dui-table-sm" }, Bv = { class: "dui-alert" }, Vv = { class: "app:flex app:flex-wrap app:gap-2" }, Hv = { key: 0 }, Uv = {
	key: 1,
	class: "app:grid app:gap-2"
}, Wv = /* @__PURE__ */ U({
	__name: "CombinedProfilePreview",
	props: {
		mount: {},
		plan: {},
		rider: {}
	},
	setup(e) {
		let t = e, n = $(() => t.plan.traits.filter((e) => e.included)), r = $(() => t.plan.traits.filter((e) => !e.included)), i = $(() => [
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
				mount: av[t.mount.size],
				result: av[t.plan.size],
				rider: av[t.rider.size],
				rule: "Larger"
			}
		]);
		function a(e) {
			return e.fixedDamage === null ? e.outputName : `${e.outputName} (fixed Damage ${e.fixedDamage})`;
		}
		return (t, o) => (K(), q(G, null, [X(dm, {
			description: "This preview uses the Actors' current prepared values. The build recalculates after applying the rider's Career advances.",
			number: "2",
			title: "Combined Profile Preview"
		}, {
			default: H(() => [Y("div", Rv, [Y("table", zv, [o[0] ||= Y("thead", null, [Y("tr", null, [
				Y("th", null, "Field"),
				Y("th", null, "Rider"),
				Y("th", null, "Mount"),
				Y("th", null, "Combined"),
				Y("th", null, "Rule")
			])], -1), Y("tbody", null, [(K(!0), q(G, null, W(i.value, (e) => (K(), q("tr", { key: e.field }, [
				Y("th", null, L(e.field), 1),
				Y("td", null, L(e.rider), 1),
				Y("td", null, L(e.mount), 1),
				Y("td", null, L(e.result), 1),
				Y("td", null, L(e.rule), 1)
			]))), 128))])])]), Y("p", Bv, " Charge attacks gain +" + L(e.plan.chargeStrengthBonus) + " Damage from the mount's Strength Bonus. The combined profile also gains at least Armour (1). ", 1)]),
			_: 1
		}), X(dm, {
			description: "Mount attack damage is frozen before the traits are copied to the rider.",
			number: "3",
			title: "Mount Traits"
		}, {
			default: H(() => [
				Y("div", Vv, [(K(!0), q(G, null, W(n.value, (e) => (K(), q("span", {
					key: e.sourceUuid,
					class: "dui-badge dui-badge-sm"
				}, L(a(e)), 1))), 128))]),
				n.value.length ? Q("", !0) : (K(), q("p", Hv, "The mount contributes no traits.")),
				r.value.length ? (K(), q("div", Uv, [o[1] ||= Y("p", null, [Y("strong", null, "Removed or consolidated")], -1), (K(!0), q(G, null, W(r.value, (e) => (K(), q("p", {
					key: e.sourceUuid,
					class: "dui-alert dui-alert-warning"
				}, [Y("strong", null, L(e.name) + ":", 1), Z(" " + L(e.reason), 1)]))), 128))])) : Q("", !0)
			]),
			_: 1
		})], 64));
	}
}), Gv = { class: "app:grid app:gap-3" }, Kv = { class: "app:grid app:gap-3 md:app:grid-cols-2" }, qv = { class: "dui-fieldset" }, Jv = ["for"], Yv = ["id"], Xv = { class: "dui-fieldset" }, Zv = ["for"], Qv = [
	"id",
	"disabled",
	"value"
], $v = ["value"], ey = {
	key: 0,
	class: "dui-card-actions"
}, ty = {
	key: 1,
	class: "dui-alert dui-alert-warning"
}, ny = {
	key: 2,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, ry = {
	key: 3,
	"aria-live": "polite",
	class: "dui-alert",
	role: "status"
}, iy = {
	key: 4,
	class: "dui-alert"
}, ay = {
	key: 0,
	class: "dui-avatar"
}, oy = { class: "app:size-16 app:shrink-0 app:rounded-lg" }, sy = ["src"], cy = /* @__PURE__ */ U({
	__name: "NpcBuilderMountTab",
	props: { bridge: {} },
	setup(e) {
		let t = e, n = Op(), { baseActorCombatProfile: r, mountActorProfile: i, mountActors: a, selectedBaseActorUuid: o, selectedMountActorUuid: s } = xu(n), c = /* @__PURE__ */ B(""), l = /* @__PURE__ */ B(""), u = /* @__PURE__ */ B(!1), d = eo(), f = 0, p = $(() => {
			let e = c.value.trim().toLocaleLowerCase();
			return a.value.filter((t) => t.uuid !== o.value && (!e || t.name.toLocaleLowerCase().includes(e)));
		}), m = $(() => a.value.find((e) => e.uuid === s.value) ?? null), h = $(() => !r.value || !i.value ? null : ov(r.value, i.value));
		Ka(s, async (e) => {
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
				r === f && (n.hydrateMountActorProfile(null), l.value = Lv(e));
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
				l.value = Lv(e);
			}
		}
		return (e, t) => (K(), q("div", Gv, [
			t[5] ||= Y("p", { class: "dui-alert dui-alert-info" }, " Mounts are optional. A selected mount is folded into one simplified NPC profile during build. ", -1),
			X(dm, {
				description: "Choose any world Actor as the mount. This selection does not create a live WFRP mount relationship.",
				number: "1",
				title: "Mount Actor"
			}, {
				default: H(() => [
					Y("div", Kv, [Y("fieldset", qv, [
						t[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "Search mounts", -1),
						Y("label", {
							class: "dui-label",
							for: `${V(d)}-filter`
						}, "Actor name", 8, Jv),
						za(Y("input", {
							id: `${V(d)}-filter`,
							"onUpdate:modelValue": t[0] ||= (e) => c.value = e,
							"aria-label": "Filter mount actors by name",
							class: "dui-input dui-input-sm",
							placeholder: "Filter world actors",
							type: "search"
						}, null, 8, Yv), [[wl, c.value]])
					]), Y("fieldset", Xv, [
						t[4] ||= Y("legend", { class: "dui-fieldset-legend" }, "Selected mount", -1),
						Y("label", {
							class: "dui-label",
							for: `${V(d)}-mount`
						}, "Mount statblock", 8, Zv),
						Y("select", {
							id: `${V(d)}-mount`,
							"aria-label": "Selected mount actor",
							class: "dui-select dui-select-sm",
							disabled: !V(o),
							value: V(s),
							onChange: g
						}, [t[3] ||= Y("option", { value: "" }, "No combined mount", -1), (K(!0), q(G, null, W(p.value, (e) => (K(), q("option", {
							key: e.uuid,
							value: e.uuid
						}, L(e.name), 9, $v))), 128))], 40, Qv)
					])]),
					X(Iv, {
						disabled: !V(o),
						description: "Drop a world Actor to use as the mount.",
						title: "Drop Mount Actor",
						variant: "compact",
						onDropData: _
					}, null, 8, ["disabled"]),
					V(s) ? (K(), q("div", ey, [Y("button", {
						class: "dui-btn dui-btn-ghost dui-btn-sm",
						type: "button",
						onClick: t[1] ||= (...e) => V(n).clearMountSelection && V(n).clearMountSelection(...e)
					}, " Clear Mount ")])) : Q("", !0),
					V(o) ? l.value ? (K(), q("p", ny, L(l.value), 1)) : u.value ? (K(), q("p", ry, " Loading mount profile... ")) : m.value && V(i) ? (K(), q("article", iy, [m.value.img ? (K(), q("div", ay, [Y("div", oy, [Y("img", {
						src: m.value.img,
						alt: "",
						class: "app:h-full app:w-full app:object-cover",
						height: "64",
						width: "64"
					}, null, 8, sy)])])) : Q("", !0), Y("div", null, [Y("strong", null, L(m.value.name), 1), Y("span", null, " Movement " + L(V(i).movement) + " | Wounds " + L(V(i).wounds) + " | " + L(V(av)[V(i).size]), 1)])])) : Q("", !0) : (K(), q("p", ty, " Choose the rider on the Build tab before selecting a mount. "))
				]),
				_: 1
			}),
			h.value && V(r) && V(i) ? (K(), J(Wv, {
				key: 0,
				mount: V(i),
				plan: h.value,
				rider: V(r)
			}, null, 8, [
				"mount",
				"plan",
				"rider"
			])) : Q("", !0)
		]));
	}
});
//#endregion
//#region src/module/apps/npc-builder/functions/settings/portrait-search-status.ts
function ly(e) {
	return e ? e.digDownActive ? e.digDownDeepFileSearchEnabled ? e.digDownCacheReady ? `Dig Down cache ready with ${e.digDownIndexedFileCount} indexed files.` : "Dig Down is active; its file cache is still building or unavailable." : "Dig Down is active, but its Deep File Search setting is disabled." : "Install and enable Dig Down to search local files for portrait suggestions." : "Checking Dig Down integration.";
}
//#endregion
//#region src/module/apps/npc-builder/functions/settings/settings-payload.ts
function uy(e) {
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
//#region src/module/apps/npc-builder/state/workflows/settings-workflow.ts
function dy(e) {
	let t = Op(), { actorFolders: n, itemFolders: r, settings: i } = xu(t), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(""), s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B(""), l = /* @__PURE__ */ B(null), u = /* @__PURE__ */ B(""), d = /* @__PURE__ */ B(""), f = $(() => l.value?.digDownActive ?? !0), p = $(() => ly(l.value));
	Ka(l, (e) => {
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
			await n.refresh(), n.setFolderUuid(r.uuid), t.hydrateSettings(await e.saveSettings(E())), d.value = `Using folder "${r.name}".`;
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
			t.hydrateSettings(await e.saveSettings(E())), t.hydrateQuickTraits(await e.importRecommendedQuickTraits(i.value)), d.value = "Recommended quick traits imported.";
		});
	}
	async function S() {
		await w(async () => {
			t.hydrateSettings(await e.saveSettings(E())), await T(), d.value = "Settings saved.";
		});
	}
	async function C() {
		await w(async () => {
			t.hydrateSettings(await e.saveSettings(Df())), await T(), d.value = "Settings reset to defaults.";
		});
	}
	async function w(e) {
		s.value = !0, o.value = "", d.value = "";
		try {
			await e();
		} catch (e) {
			o.value = fy(e);
		} finally {
			s.value = !1;
		}
	}
	async function T() {
		let [n, r] = await Promise.all([e.listBaseActors(i.value), e.listQuickTraits(i.value)]);
		t.hydrateBaseActors(n), t.hydrateQuickTraits(r);
	}
	function E() {
		return uy({
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
function fy(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderSettingsTab/FolderSetting.vue?vue&type=script&setup=true&lang.ts
var py = { class: "dui-fieldset" }, my = { class: "dui-fieldset-legend" }, hy = ["aria-label", "value"], gy = { value: "" }, _y = ["value"], vy = { class: "dui-fieldset" }, yy = ["aria-label", "value"], by = { class: "dui-card-actions" }, xy = ["disabled"], Sy = /* @__PURE__ */ U({
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
		return (t, a) => (K(), q("section", null, [
			Y("fieldset", py, [Y("legend", my, L(e.folderLabel), 1), Y("select", {
				"aria-label": e.folderLabel,
				class: "dui-select dui-select-sm",
				value: e.selectedUuid,
				onChange: r
			}, [Y("option", gy, L(e.defaultOptionLabel), 1), (K(!0), q(G, null, W(e.folders, (e) => (K(), q("option", {
				key: e.uuid,
				value: e.uuid
			}, L(e.name), 9, _y))), 128))], 40, hy)]),
			Y("fieldset", vy, [a[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Create or use by name", -1), Y("input", {
				"aria-label": `Create or use ${e.folderLabel} by name`,
				class: "dui-input dui-input-sm",
				value: e.createName,
				placeholder: "Folder name",
				type: "text",
				onInput: i
			}, null, 40, yy)]),
			Y("div", by, [Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.disabled || !e.createName.trim(),
				type: "button",
				onClick: a[0] ||= (e) => n("saveFolderName")
			}, L(e.buttonLabel ?? "Save Folder"), 9, xy)])
		]));
	}
}), Cy = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(dm, {
			description: "Limit the source picker or choose where generated Actors are stored.",
			number: "1",
			title: "Actor Sources"
		}, {
			default: H(() => [X(Sy, {
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
			]), X(Sy, {
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
}), wy = {
	key: 0,
	class: "dui-label"
}, Ty = ["checked"], Ey = {
	key: 1,
	class: "dui-label"
}, Dy = ["checked"], Oy = {
	key: 2,
	class: "dui-label"
}, ky = ["checked"], Ay = {
	key: 3,
	class: "dui-label"
}, jy = ["checked"], My = {
	key: 4,
	class: "dui-label"
}, Ny = ["checked"], Py = /* @__PURE__ */ U({
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
		return (t, i) => (K(), J(dm, {
			description: "Choose which base-only data is included in the editable draft.",
			title: "Base Actor Features"
		}, {
			default: H(() => [
				e.showAdvancementFeatures === !1 ? Q("", !0) : (K(), q("label", wy, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowCharacteristics,
					type: "checkbox",
					onChange: i[0] ||= (e) => n("allowCharacteristicsChange", r(e))
				}, null, 40, Ty), i[5] ||= Y("span", null, "Show base actor characteristics", -1)])),
				e.showAdvancementFeatures === !1 ? Q("", !0) : (K(), q("label", Ey, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowSkills,
					type: "checkbox",
					onChange: i[1] ||= (e) => n("allowSkillsChange", r(e))
				}, null, 40, Dy), i[6] ||= Y("span", null, "Show base actor skills", -1)])),
				e.showAdvancementFeatures === !1 ? Q("", !0) : (K(), q("label", Oy, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTalents,
					type: "checkbox",
					onChange: i[2] ||= (e) => n("allowTalentsChange", r(e))
				}, null, 40, ky), i[7] ||= Y("span", null, "Show base actor talents", -1)])),
				e.showTrappingFeature ? (K(), q("label", Ay, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTrappings,
					type: "checkbox",
					onChange: i[3] ||= (e) => n("allowTrappingsChange", r(e))
				}, null, 40, jy), i[8] ||= Y("span", null, "Show base actor trappings", -1)])) : Q("", !0),
				e.showTraitFeature === !1 ? Q("", !0) : (K(), q("label", My, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTraits,
					type: "checkbox",
					onChange: i[4] ||= (e) => n("allowTraitsChange", r(e))
				}, null, 40, Ny), i[9] ||= Y("span", null, "Show base actor traits", -1)]))
			]),
			_: 1
		}));
	}
}), Fy = { class: "dui-label" }, Iy = ["checked"], Ly = /* @__PURE__ */ U({
	__name: "MagicSpellSettings",
	props: { autoSelectGrantedSpells: { type: Boolean } },
	emits: ["autoSelectGrantedSpellsChange"],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("autoSelectGrantedSpellsChange", !!t?.checked);
		}
		return (t, n) => (K(), J(dm, {
			number: "6",
			title: "Magic and Spells"
		}, {
			default: H(() => [Y("label", Fy, [Y("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.autoSelectGrantedSpells,
				type: "checkbox",
				onChange: r
			}, null, 40, Iy), n[0] ||= Y("span", null, "Select detected Lore spells by default", -1)])]),
			_: 1
		}));
	}
}), Ry = { class: "dui-label" }, zy = ["checked"], By = /* @__PURE__ */ U({
	__name: "NamingSettings",
	props: { includeSpeciesInName: { type: Boolean } },
	emits: ["includeSpeciesInNameChange"],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("includeSpeciesInNameChange", !!t?.checked);
		}
		return (t, n) => (K(), J(dm, {
			number: "3",
			title: "Default Naming"
		}, {
			default: H(() => [Y("label", Ry, [Y("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.includeSpeciesInName,
				type: "checkbox",
				onChange: r
			}, null, 40, zy), n[0] ||= Y("span", null, "Include species in suggested names", -1)])]),
			_: 1
		}));
	}
}), Vy = { class: "dui-fieldset" }, Hy = ["value"], Uy = { class: "dui-label" }, Wy = ["checked"], Gy = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(dm, { title: "Career Resolution" }, {
			default: H(() => [Y("fieldset", Vy, [n[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Lower career handling", -1), Y("select", {
				"aria-label": "Lower career handling",
				class: "dui-select dui-select-sm",
				value: e.lowerCareerMode,
				onChange: r
			}, [...n[0] ||= [
				Y("option", { value: "prompt" }, "Prompt when candidates are found", -1),
				Y("option", { value: "auto-add-all" }, "Automatically add all lower-tier matches", -1),
				Y("option", { value: "never" }, "Only add dropped careers", -1)
			]], 40, Hy)]), Y("label", Uy, [Y("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.askForLinkedSkillSpecializations,
				type: "checkbox",
				onChange: i
			}, null, 40, Wy), n[2] ||= Y("span", null, "Resolve linked career skill repeats separately", -1)])]),
			_: 1
		}));
	}
}), Ky = { class: "app:grid app:gap-1" }, qy = ["value"], Jy = { class: "dui-label" }, Yy = ["checked"], Xy = { class: "app:grid app:gap-1" }, Zy = ["value"], Qy = { class: "dui-label" }, $y = ["checked", "disabled"], eb = {
	"aria-live": "polite",
	class: "dui-alert",
	role: "status"
}, tb = { class: "dui-label" }, nb = ["checked"], rb = { class: "dui-label" }, ib = ["checked"], ab = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(dm, {
			description: "Choose which local Foundry sources can suggest portraits.",
			number: "4",
			title: "Portrait Suggestions"
		}, {
			default: H(() => [
				Y("label", Ky, [
					n[0] ||= Y("span", { class: "dui-label app:justify-start app:gap-2 app:font-semibold" }, [Y("i", {
						"aria-hidden": "true",
						class: "fa-solid fa-folder-open"
					}), Z(" Priority Foundry folders ")], -1),
					Y("textarea", {
						"aria-describedby": "portrait-priority-folders-help",
						class: "dui-textarea dui-textarea-sm app:min-h-20 app:w-full",
						placeholder: "modules/my-art-module/portraits",
						rows: "3",
						value: e.prioritizedPortraitFolders.join("\n"),
						onInput: a
					}, null, 40, qy),
					n[1] ||= Y("small", { id: "portrait-priority-folders-help" }, " One Foundry data path per line. These appear first, ahead of compendiums, world documents, and Dig Down results. ", -1)
				]),
				Y("label", Jy, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.excludeFullyTransparentPortraitAssets,
					type: "checkbox",
					onChange: r
				}, null, 40, Yy), n[2] ||= Y("span", null, "Hide fully empty or transparent images", -1)]),
				Y("label", Xy, [
					n[3] ||= Y("span", { class: "dui-label app:justify-start app:gap-2 app:font-semibold" }, [Y("i", {
						"aria-hidden": "true",
						class: "fa-solid fa-ban"
					}), Z(" Excluded image references ")], -1),
					Y("textarea", {
						"aria-describedby": "portrait-excluded-references-help",
						class: "dui-textarea dui-textarea-sm app:min-h-20 app:w-full",
						placeholder: "systems/wfrp4e/tokens/unknown.png",
						rows: "3",
						value: e.excludedPortraitReferenceImages.join("\n"),
						onInput: i
					}, null, 40, Zy),
					n[4] ||= Y("small", { id: "portrait-excluded-references-help" }, " One image path per line. Each listed image and its visual duplicates are hidden. Broken images are always hidden. ", -1)
				]),
				Y("label", Qy, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchFoundryPortraitAssets,
					disabled: !e.canUseDigDownPortraitSearch,
					type: "checkbox",
					onChange: o
				}, null, 40, $y), n[5] ||= Y("span", null, "Search Dig Down's file cache for portrait suggestions", -1)]),
				Y("p", eb, L(e.statusLabel), 1),
				Y("label", tb, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchCompendiumPortraitAssets,
					type: "checkbox",
					onChange: s
				}, null, 40, nb), n[6] ||= Y("span", null, "Search Actor and Item compendiums for portrait suggestions", -1)]),
				Y("label", rb, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchWebPortraitAssets,
					disabled: "",
					type: "checkbox"
				}, null, 8, ib), n[7] ||= Y("span", null, "Search the web for portrait suggestions (later)", -1)])
			]),
			_: 1
		}));
	}
}), ob = { class: "dui-card-actions" }, sb = ["disabled"], cb = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(dm, {
			description: "Items in this folder become one-click Trait choices on the Build tab.",
			number: "2",
			title: "Quick Traits"
		}, {
			default: H(() => [X(Sy, {
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
			]), Y("div", ob, [Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.isBusy || !e.quickTraitFolderUuid,
				type: "button",
				onClick: r[3] ||= (e) => n("importRecommendedQuickTraits")
			}, " Import Recommended Quick Traits ", 8, sb)])]),
			_: 1
		}));
	}
}), lb = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, ub = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, db = /* @__PURE__ */ U({
	__name: "SettingsMessages",
	props: {
		errorMessage: {},
		settingsMessage: {}
	},
	setup(e) {
		return (t, n) => e.errorMessage ? (K(), q("p", lb, L(e.errorMessage), 1)) : e.settingsMessage ? (K(), q("p", ub, L(e.settingsMessage), 1)) : Q("", !0);
	}
}), fb = { class: "app:grid app:gap-3" }, pb = { class: "app:grid app:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] app:gap-3" }, mb = { class: "dui-card-actions" }, hb = ["disabled"], gb = ["disabled"], _b = /* @__PURE__ */ U({
	__name: "NpcBuilderSettingsTab",
	props: {
		bridge: {},
		page: {}
	},
	setup(e) {
		let { actorFolders: t, baseActorFolderName: n, canUseDigDownPortraitSearch: r, errorMessage: i, importRecommendedQuickTraits: a, isBusy: o, itemFolders: s, outputActorFolderName: c, portraitSearchStatusLabel: l, quickTraitFolderName: u, refreshPortraitSearchAvailability: d, resetSettingsToDefaults: f, saveBaseActorFolderName: p, saveOutputActorFolderName: m, saveQuickTraitFolderName: h, saveSettings: g, settings: _, settingsMessage: v } = dy(e.bridge);
		return go(() => {
			d();
		}), (d, y) => (K(), q("section", fb, [
			X(db, {
				"error-message": V(i),
				"settings-message": V(v)
			}, null, 8, ["error-message", "settings-message"]),
			Y("div", pb, [
				e.page === "settings-folders" ? (K(), J(Cy, {
					key: 0,
					class: "app:col-span-full",
					"actor-folders": V(t),
					"base-actor-folder-name": V(n),
					"base-actor-folder-uuid": V(_).baseActorFolderUuid,
					"is-busy": V(o),
					"output-actor-folder-name": V(c),
					"output-actor-folder-uuid": V(_).outputActorFolderUuid,
					onBaseActorFolderNameChange: y[0] ||= (e) => n.value = e,
					onBaseActorFolderUuidChange: y[1] ||= (e) => V(_).baseActorFolderUuid = e,
					onOutputActorFolderNameChange: y[2] ||= (e) => c.value = e,
					onOutputActorFolderUuidChange: y[3] ||= (e) => V(_).outputActorFolderUuid = e,
					onSaveBaseActorFolderName: V(p),
					onSaveOutputActorFolderName: V(m)
				}, null, 8, [
					"actor-folders",
					"base-actor-folder-name",
					"base-actor-folder-uuid",
					"is-busy",
					"output-actor-folder-name",
					"output-actor-folder-uuid",
					"onSaveBaseActorFolderName",
					"onSaveOutputActorFolderName"
				])) : Q("", !0),
				e.page === "settings-folders" ? (K(), J(cb, {
					key: 1,
					"is-busy": V(o),
					"item-folders": V(s),
					"quick-trait-folder-name": V(u),
					"quick-trait-folder-uuid": V(_).quickTraitFolderUuid,
					onImportRecommendedQuickTraits: V(a),
					onQuickTraitFolderNameChange: y[4] ||= (e) => u.value = e,
					onQuickTraitFolderUuidChange: y[5] ||= (e) => V(_).quickTraitFolderUuid = e,
					onSaveQuickTraitFolderName: V(h)
				}, null, 8, [
					"is-busy",
					"item-folders",
					"quick-trait-folder-name",
					"quick-trait-folder-uuid",
					"onImportRecommendedQuickTraits",
					"onSaveQuickTraitFolderName"
				])) : Q("", !0),
				e.page === "settings-suggestions" ? (K(), J(By, {
					key: 2,
					"include-species-in-name": V(_).includeSpeciesInName,
					onIncludeSpeciesInNameChange: y[6] ||= (e) => V(_).includeSpeciesInName = e
				}, null, 8, ["include-species-in-name"])) : Q("", !0),
				e.page === "settings-suggestions" ? (K(), J(ab, {
					key: 3,
					"can-use-dig-down-portrait-search": V(r),
					"exclude-fully-transparent-portrait-assets": V(_).excludeFullyTransparentPortraitAssets,
					"excluded-portrait-reference-images": V(_).excludedPortraitReferenceImages,
					"prioritized-portrait-folders": V(_).prioritizedPortraitFolders,
					"search-compendium-portrait-assets": V(_).searchCompendiumPortraitAssets,
					"search-foundry-portrait-assets": V(_).searchFoundryPortraitAssets,
					"search-web-portrait-assets": V(_).searchWebPortraitAssets,
					"status-label": V(l),
					onExcludeFullyTransparentPortraitAssetsChange: y[7] ||= (e) => V(_).excludeFullyTransparentPortraitAssets = e,
					onExcludedPortraitReferenceImagesChange: y[8] ||= (e) => V(_).excludedPortraitReferenceImages = e,
					onPrioritizedPortraitFoldersChange: y[9] ||= (e) => V(_).prioritizedPortraitFolders = e,
					onSearchCompendiumPortraitAssetsChange: y[10] ||= (e) => V(_).searchCompendiumPortraitAssets = e,
					onSearchFoundryPortraitAssetsChange: y[11] ||= (e) => V(_).searchFoundryPortraitAssets = e
				}, null, 8, [
					"can-use-dig-down-portrait-search",
					"exclude-fully-transparent-portrait-assets",
					"excluded-portrait-reference-images",
					"prioritized-portrait-folders",
					"search-compendium-portrait-assets",
					"search-foundry-portrait-assets",
					"search-web-portrait-assets",
					"status-label"
				])) : Q("", !0),
				e.page === "settings-advancement" ? (K(), J(Py, {
					key: 4,
					"allow-characteristics": V(_).allowBaseActorCharacteristics,
					"allow-skills": V(_).allowBaseActorSkills,
					"allow-talents": V(_).allowBaseActorTalents,
					"allow-traits": V(_).allowBaseActorTraits,
					"allow-trappings": V(_).allowBaseActorTrappings,
					"show-trapping-feature": !1,
					onAllowCharacteristicsChange: y[12] ||= (e) => V(_).allowBaseActorCharacteristics = e,
					onAllowSkillsChange: y[13] ||= (e) => V(_).allowBaseActorSkills = e,
					onAllowTalentsChange: y[14] ||= (e) => V(_).allowBaseActorTalents = e,
					onAllowTraitsChange: y[15] ||= (e) => V(_).allowBaseActorTraits = e,
					onAllowTrappingsChange: y[16] ||= (e) => V(_).allowBaseActorTrappings = e
				}, null, 8, [
					"allow-characteristics",
					"allow-skills",
					"allow-talents",
					"allow-traits",
					"allow-trappings"
				])) : Q("", !0),
				e.page === "settings-resolution" ? (K(), J(Ly, {
					key: 5,
					"auto-select-granted-spells": V(_).autoSelectGrantedSpells,
					onAutoSelectGrantedSpellsChange: y[17] ||= (e) => V(_).autoSelectGrantedSpells = e
				}, null, 8, ["auto-select-granted-spells"])) : Q("", !0),
				e.page === "settings-resolution" ? (K(), J(Py, {
					key: 6,
					"allow-characteristics": V(_).allowBaseActorCharacteristics,
					"allow-skills": V(_).allowBaseActorSkills,
					"allow-talents": V(_).allowBaseActorTalents,
					"allow-traits": V(_).allowBaseActorTraits,
					"allow-trappings": V(_).allowBaseActorTrappings,
					"show-advancement-features": !1,
					"show-trait-feature": !1,
					"show-trapping-feature": "",
					onAllowCharacteristicsChange: y[18] ||= (e) => V(_).allowBaseActorCharacteristics = e,
					onAllowSkillsChange: y[19] ||= (e) => V(_).allowBaseActorSkills = e,
					onAllowTalentsChange: y[20] ||= (e) => V(_).allowBaseActorTalents = e,
					onAllowTraitsChange: y[21] ||= (e) => V(_).allowBaseActorTraits = e,
					onAllowTrappingsChange: y[22] ||= (e) => V(_).allowBaseActorTrappings = e
				}, null, 8, [
					"allow-characteristics",
					"allow-skills",
					"allow-talents",
					"allow-traits",
					"allow-trappings"
				])) : Q("", !0),
				e.page === "settings-resolution" ? (K(), J(Gy, {
					key: 7,
					class: "app:col-span-full",
					"ask-for-linked-skill-specializations": V(_).askForLinkedSkillSpecializations,
					"lower-career-mode": V(_).lowerCareerMode,
					onAskForLinkedSkillSpecializationsChange: y[23] ||= (e) => V(_).askForLinkedSkillSpecializations = e,
					onLowerCareerModeChange: y[24] ||= (e) => V(_).lowerCareerMode = e
				}, null, 8, ["ask-for-linked-skill-specializations", "lower-career-mode"])) : Q("", !0)
			]),
			Y("div", mb, [Y("button", {
				class: "dui-btn dui-btn-primary dui-btn-sm",
				disabled: V(o),
				type: "button",
				onClick: y[25] ||= (...e) => V(g) && V(g)(...e)
			}, " Save Settings ", 8, hb), Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: V(o),
				type: "button",
				onClick: y[26] ||= (...e) => V(f) && V(f)(...e)
			}, " Reset to Defaults ", 8, gb)])
		]));
	}
});
//#endregion
//#region src/module/apps/npc-builder/functions/magic-lore-resolution.ts
function vb(e) {
	return e.map((e) => `${e.kind}:${e.sourceName}:${e.rawLore}`).sort().join("|");
}
function yb(e) {
	return e.filter((e) => e.isAmbiguous);
}
function bb(e, t) {
	return { rows: yb(e).map((e) => ({
		grantLabel: Sb(e),
		options: Rf(e, t),
		rawLore: e.rawLore,
		resolutionKey: e.resolutionKey,
		selectedLore: "",
		sourceLabel: Cb(e)
	})) };
}
function xb(e) {
	return e.kind === "arcane-magic" ? "Arcane Magic" : e.kind === "petty-magic" ? "Petty Magic" : "Spellcaster";
}
function Sb(e) {
	return `${xb(e)} from ${e.sourceName}`;
}
function Cb(e) {
	return e.source === "talent" ? "Talent" : "Trait";
}
//#endregion
//#region src/module/apps/npc-builder/state/workflows/spells-workflow.ts
function wb(e) {
	let t = Op(), { magicGrants: n, spells: r, selectedSpells: i } = xu(t), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B([]), l = /* @__PURE__ */ B(null), u = 0, d = $(() => yb(n.value)), f = $(() => n.value.length - d.value.length);
	Ka(() => vb(n.value), () => {
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
			u === r && (a.value = Tb(e));
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
				a.value = Tb(e);
			} finally {
				o.value = !1;
			}
		}
	}
	async function g() {
		a.value = "", await h(), l.value = bb(n.value, c.value);
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
			a.value = Tb(e);
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
function Tb(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that spell action.";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/MagicLoreResolutionPromptContent.vue?vue&type=script&setup=true&lang.ts
var Eb = { class: "dui-card-body" }, Db = { class: "dui-card-title" }, Ob = { class: "dui-fieldset" }, kb = ["onUpdate:modelValue", "aria-label"], Ab = ["value"], jb = { class: "dui-card-actions" }, Mb = /* @__PURE__ */ U({
	__name: "MagicLoreResolutionPromptContent",
	props: { prompt: {} },
	emits: ["applyLores", "keepUnresolved"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (K(), q("section", null, [
			r[4] ||= Y("p", null, " Choose concrete magic Lores for ambiguous grants before automatic spells are detected. Unresolved grants can still use manually dropped spells. ", -1),
			(K(!0), q(G, null, W(e.prompt.rows, (e) => (K(), q("section", {
				key: e.resolutionKey,
				class: "dui-card dui-card-border dui-card-sm"
			}, [Y("div", Eb, [
				Y("h3", Db, L(e.grantLabel), 1),
				Y("span", null, L(e.sourceLabel) + " - " + L(e.rawLore || "Any Lore"), 1),
				Y("fieldset", Ob, [r[3] ||= Y("legend", { class: "dui-fieldset-legend" }, "Lore", -1), za(Y("select", {
					"onUpdate:modelValue": (t) => e.selectedLore = t,
					"aria-label": `Lore for ${e.grantLabel}`,
					class: "dui-select dui-select-sm"
				}, [r[2] ||= Y("option", { value: "" }, "Leave unresolved", -1), (K(!0), q(G, null, W(e.options, (e) => (K(), q("option", {
					key: e.key,
					value: e.value
				}, L(e.label) + L(e.wind && e.wind !== "None" ? ` (${e.wind})` : ""), 9, Ab))), 128))], 8, kb), [[Dl, e.selectedLore]])])
			])]))), 128)),
			Y("div", jb, [Y("button", {
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: r[0] ||= (e) => n("keepUnresolved")
			}, " Keep Unresolved "), Y("button", {
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: r[1] ||= (e) => n("applyLores")
			}, " Apply Lores ")])
		]));
	}
}), Nb = {
	key: 0,
	class: "dui-alert"
}, Pb = {
	key: 1,
	class: "dui-list"
}, Fb = { class: "dui-list-col-grow" }, Ib = { key: 0 }, Lb = { key: 1 }, Rb = {
	key: 2,
	class: "dui-card-actions"
}, zb = ["disabled"], Bb = /* @__PURE__ */ U({
	__name: "MagicAccessPanel",
	props: {
		ambiguousGrantCount: {},
		isLoadingLoreOptions: { type: Boolean },
		magicGrants: {}
	},
	emits: ["resolveLores"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (K(), J(dm, {
			description: "Magic Talents and Traits determine which spell Lores are available.",
			number: "1",
			title: "Magic Access"
		}, {
			default: H(() => [e.magicGrants.length ? (K(), q("ul", Pb, [(K(!0), q(G, null, W(e.magicGrants, (e) => (K(), q("li", {
				key: `${e.source}:${e.sourceName}:${e.rawLore}`,
				class: "dui-list-row"
			}, [Y("div", Fb, [
				Y("strong", null, L(V(xb)(e)), 1),
				Y("span", null, L(V(Cb)(e)) + " - " + L(e.sourceName), 1),
				e.isAmbiguous ? (K(), q("small", Ib, " Needs Lore resolution before automatic spells can be found. ")) : (K(), q("small", Lb, " Lore: " + L(e.rawLore || e.normalizedLore), 1))
			])]))), 128))])) : (K(), q("p", Nb, " No magic-enabling Talent or Trait is selected. ")), e.ambiguousGrantCount ? (K(), q("div", Rb, [Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.isLoadingLoreOptions,
				type: "button",
				onClick: r[0] ||= (e) => n("resolveLores")
			}, L(e.isLoadingLoreOptions ? "Loading Lores..." : "Resolve Lores"), 9, zb)])) : Q("", !0)]),
			_: 1
		}));
	}
});
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderSpellsTab/labels.ts
function Vb(e) {
	return e.source === "custom" ? "Dropped" : e.sourceLabel;
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderSpellsTab/SpellSelectionPanel.vue?vue&type=script&setup=true&lang.ts
var Hb = { class: "dui-card-actions" }, Ub = ["disabled"], Wb = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, Gb = {
	key: 1,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, Kb = {
	key: 2,
	class: "dui-list"
}, qb = [
	"aria-label",
	"checked",
	"onChange"
], Jb = { class: "dui-list-col-grow" }, Yb = {
	key: 0,
	class: "dui-avatar"
}, Xb = ["src"], Zb = ["onClick"], Qb = {
	key: 3,
	class: "dui-alert"
}, $b = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(dm, {
			description: "Select detected Lore spells or drop specific Spell Items.",
			number: "2",
			title: "Spells"
		}, {
			default: H(() => [
				X(Iv, {
					description: "Add a specific Spell item regardless of detected Lores.",
					title: "Drop Spell Items",
					onDropData: r[0] ||= (e) => n("spellDrop", e)
				}),
				Y("div", Hb, [Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: e.isLoadingSpells || !e.resolvedGrantCount,
					type: "button",
					onClick: r[1] ||= (e) => n("refreshSpells")
				}, L(e.isLoadingSpells ? "Finding spells..." : "Refresh Spells"), 9, Ub), Y("span", null, L(e.selectedSpellCount) + " selected / " + L(e.spells.length) + " found", 1)]),
				e.errorMessage ? (K(), q("p", Wb, L(e.errorMessage), 1)) : Q("", !0),
				e.ambiguousGrantCount ? (K(), q("p", Gb, L(e.ambiguousGrantCount) + " magic grant" + L(e.ambiguousGrantCount === 1 ? "" : "s") + " still need Lore resolution. You can still drop specific spells for now. ", 1)) : Q("", !0),
				e.spells.length ? (K(), q("ul", Kb, [(K(!0), q(G, null, W(e.spells, (e) => (K(), q("li", {
					key: e.key,
					class: "dui-list-row"
				}, [
					Y("input", {
						"aria-label": `Use ${e.name}`,
						class: "dui-checkbox dui-checkbox-sm",
						checked: e.selected,
						type: "checkbox",
						onChange: (t) => n("spellSelectedChange", e, t)
					}, null, 40, qb),
					Y("div", Jb, [
						e.img ? (K(), q("div", Yb, [Y("div", null, [Y("img", {
							src: e.img,
							alt: ""
						}, null, 8, Xb)])])) : Q("", !0),
						Y("strong", null, L(e.name), 1),
						Y("span", null, L(e.loreName || "Unknown Lore") + " · " + L(V(Vb)(e)), 1)
					]),
					e.source === "custom" ? (K(), q("button", {
						key: 0,
						class: "dui-btn dui-btn-sm",
						type: "button",
						onClick: (t) => n("removeCustomSpell", e.key)
					}, " Remove ", 8, Zb)) : Q("", !0)
				]))), 128))])) : (K(), q("p", Qb, " No matching spells found yet. Drop specific spells here, or resolve a non-ambiguous magic Lore. "))
			]),
			_: 1
		}));
	}
}), ex = /* @__PURE__ */ U({
	__name: "NpcBuilderSpellsTab",
	props: { bridge: {} },
	setup(e) {
		let { ambiguousGrants: t, confirmMagicLorePrompt: n, dismissMagicLorePrompt: r, errorMessage: i, handleSpellDrop: a, initialize: o, isLoadingLoreOptions: s, isLoadingSpells: c, loadDetectedSpells: l, magicGrants: u, openMagicLorePrompt: d, pendingMagicLorePrompt: f, removeCustomSpell: p, resolvedGrantCount: m, selectedSpells: h, setSpellSelected: g, spells: _ } = wb(e.bridge);
		go(() => {
			o();
		});
		function v(e, t) {
			let n = t.target;
			n && g(e.key, n.checked);
		}
		return (e, o) => (K(), q("section", null, [
			X(Ip, {
				open: V(f) !== null,
				title: "Resolve Magic Lores",
				onClose: V(r)
			}, {
				default: H(() => [V(f) ? (K(), J(Mb, {
					key: 0,
					prompt: V(f),
					onApplyLores: V(n),
					onKeepUnresolved: V(r)
				}, null, 8, [
					"prompt",
					"onApplyLores",
					"onKeepUnresolved"
				])) : Q("", !0)]),
				_: 1
			}, 8, ["open", "onClose"]),
			X(Bb, {
				"ambiguous-grant-count": V(t).length,
				"is-loading-lore-options": V(s),
				"magic-grants": V(u),
				onResolveLores: V(d)
			}, null, 8, [
				"ambiguous-grant-count",
				"is-loading-lore-options",
				"magic-grants",
				"onResolveLores"
			]),
			o[0] ||= Y("div", { class: "dui-divider" }, null, -1),
			X($b, {
				"ambiguous-grant-count": V(t).length,
				"error-message": V(i),
				"is-loading-spells": V(c),
				"resolved-grant-count": V(m),
				"selected-spell-count": V(h).length,
				spells: V(_),
				onRefreshSpells: V(l),
				onRemoveCustomSpell: V(p),
				onSpellDrop: V(a),
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
}), tx = { class: "dui-collapse-title" }, nx = { class: "dui-badge" }, rx = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, ix = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, ax = { class: "dui-collapse-content" }, ox = { class: "dui-fieldset" }, sx = { class: "dui-fieldset-legend" }, cx = [
	"aria-label",
	"value",
	"onInput"
], lx = {
	key: 0,
	class: "dui-fieldset"
}, ux = [
	"aria-label",
	"value",
	"onChange"
], dx = ["value"], fx = {
	key: 1,
	class: "dui-fieldset"
}, px = [
	"aria-label",
	"value",
	"onInput"
], mx = ["onClick"], hx = {
	key: 0,
	class: "dui-alert"
}, gx = /* @__PURE__ */ U({
	__name: "NpcBuilderTraitsTab",
	props: { difficultyOptions: {} },
	setup(e) {
		let t = Op(), { traits: n } = xu(t);
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
		return (t, o) => (K(), J(dm, {
			description: "Open a Trait to review its WFRP configuration before building.",
			title: "Traits"
		}, {
			default: H(() => [(K(!0), q(G, null, W(V(n), (t) => (K(), q("details", {
				key: t.key,
				class: "dui-collapse dui-collapse-arrow dui-card-border"
			}, [Y("summary", tx, [
				Y("strong", null, L(t.name), 1),
				Y("span", nx, L(r(t)), 1),
				t.config.rollable ? (K(), q("span", rx, "Rollable")) : Q("", !0),
				t.config.damage ? (K(), q("span", ix, "Damage")) : Q("", !0)
			]), Y("div", ax, [
				Y("fieldset", ox, [Y("legend", sx, L(t.config.damage ? "Damage" : "Specification"), 1), Y("input", {
					"aria-label": `${t.config.damage ? "Damage" : "Specification"} for ${t.name}`,
					class: "dui-input dui-input-sm",
					value: t.config.specification,
					placeholder: "None",
					type: "text",
					onInput: (e) => a(t, "specification", e)
				}, null, 40, cx)]),
				t.config.rollable && !t.config.damage ? (K(), q("fieldset", lx, [o[0] ||= Y("legend", { class: "dui-fieldset-legend" }, "Difficulty", -1), Y("select", {
					"aria-label": `Difficulty for ${t.name}`,
					class: "dui-select dui-select-sm",
					value: t.config.defaultDifficulty,
					onChange: (e) => a(t, "defaultDifficulty", e)
				}, [(K(!0), q(G, null, W(e.difficultyOptions, (e) => (K(), q("option", {
					key: e.value,
					value: e.value
				}, L(e.label), 9, dx))), 128))], 40, ux)])) : Q("", !0),
				t.config.damage && t.config.dice ? (K(), q("fieldset", fx, [o[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Dice", -1), Y("input", {
					"aria-label": `Dice for ${t.name}`,
					class: "dui-input dui-input-sm",
					value: t.config.dice,
					placeholder: "Optional",
					type: "text",
					onInput: (e) => a(t, "dice", e)
				}, null, 40, px)])) : Q("", !0),
				Y("button", {
					class: "dui-btn dui-btn-sm",
					type: "button",
					onClick: (e) => i(t)
				}, "Remove", 8, mx)
			])]))), 128)), V(n).length ? Q("", !0) : (K(), q("p", hx, "No traits are selected yet."))]),
			_: 1
		}));
	}
}), _x = "__blank-item__";
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderTrappingsTab/resolution-labels.ts
function vx(e) {
	return e.source === "base" ? "Base" : e.source === "career" ? "Career" : "Custom";
}
function yx(e) {
	return e.resolution.status === "matched" ? `Matched ${e.resolution.selectedName}` : e.resolution.status === "fallback" ? `Blank ${e.resolution.selectedName || e.name}` : e.resolution.candidates.length ? "Choose a match" : "Needs resolution";
}
function bx(e) {
	return e.ignored ? "Ignored" : e.resolution.status === "matched" ? "Matched" : e.resolution.status === "fallback" ? "Blank item" : e.resolution.status === "ambiguous" || e.resolution.candidates.length ? "Choose" : "Needs resolution";
}
function xx(e) {
	let t = "dui-badge";
	return e.ignored ? [t, "dui-badge-ghost"] : e.resolution.status === "matched" ? [t, "dui-badge-success"] : e.resolution.status === "fallback" ? [t, "dui-badge-info"] : e.resolution.status === "ambiguous" || e.resolution.candidates.length ? [t, "dui-badge-warning"] : [t, "dui-badge-error"];
}
function Sx(e) {
	return e.resolution.status === "fallback" ? _x : e.resolution.selectedCandidateUuid;
}
function Cx(e) {
	return e.source === "career";
}
function wx(e) {
	return e.resolution.candidates.length > 0 || Cx(e);
}
function Tx(e) {
	return e.resolution.searchTerms.length <= 1 ? "" : `Options: ${e.resolution.searchTerms.join(" / ")}`;
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderTrappingsTab/TrappingsTable.vue?vue&type=script&setup=true&lang.ts
var Ex = {
	key: 0,
	class: "dui-list"
}, Dx = [
	"aria-label",
	"checked",
	"onChange"
], Ox = { class: "dui-list-col-grow app:grid app:gap-2" }, kx = { key: 0 }, Ax = {
	key: 1,
	class: "dui-fieldset"
}, jx = [
	"aria-label",
	"value",
	"onChange"
], Mx = {
	key: 0,
	value: ""
}, Nx = ["value"], Px = ["value"], Fx = { key: 2 }, Ix = { class: "dui-card-actions" }, Lx = { class: "dui-fieldset" }, Rx = [
	"aria-label",
	"value",
	"onInput"
], zx = ["onClick"], Bx = {
	key: 1,
	class: "dui-alert"
}, Vx = /* @__PURE__ */ U({
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
		return (t, r) => e.trappings.length ? (K(), q("ul", Ex, [(K(!0), q(G, null, W(e.trappings, (e) => (K(), q("li", {
			key: e.key,
			class: "dui-list-row"
		}, [Y("input", {
			"aria-label": `Use ${e.name}`,
			class: "dui-checkbox dui-checkbox-sm",
			checked: !e.ignored,
			type: "checkbox",
			onChange: (t) => n("useChange", e.key, t)
		}, null, 40, Dx), Y("div", Ox, [
			Y("strong", null, L(e.name), 1),
			Y("span", null, L(e.resolution.selectedItemType || e.itemType || "trapping") + " · " + L(V(vx)(e)), 1),
			V(Tx)(e) ? (K(), q("span", kx, L(V(Tx)(e)), 1)) : Q("", !0),
			Y("span", { class: I(V(xx)(e)) }, L(V(bx)(e)), 3),
			V(wx)(e) ? (K(), q("fieldset", Ax, [r[0] ||= Y("legend", { class: "dui-fieldset-legend" }, "Resolution", -1), Y("select", {
				"aria-label": `Resolution for ${e.name}`,
				class: "dui-select dui-select-sm",
				value: V(Sx)(e),
				onChange: (t) => n("resolutionChange", e.key, t)
			}, [
				e.resolution.candidates.length ? (K(), q("option", Mx, "Choose match")) : Q("", !0),
				(K(!0), q(G, null, W(e.resolution.candidates, (e) => (K(), q("option", {
					key: e.uuid,
					value: e.uuid
				}, L(e.name) + " (" + L(e.sourceLabel) + ") ", 9, Nx))), 128)),
				V(Cx)(e) ? (K(), q("option", {
					key: 1,
					value: V(_x)
				}, " Blank Item ", 8, Px)) : Q("", !0)
			], 40, jx)])) : (K(), q("span", Fx, L(V(yx)(e)), 1)),
			Y("div", Ix, [Y("fieldset", Lx, [r[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Quantity", -1), Y("input", {
				"aria-label": `Quantity for ${e.name}`,
				class: "dui-input dui-input-sm",
				value: e.quantity,
				min: "1",
				type: "number",
				onInput: (t) => n("quantityInput", e.key, t)
			}, null, 40, Rx)]), e.source === "custom" ? (K(), q("button", {
				key: 0,
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: (t) => n("removeCustomTrapping", e.key)
			}, " Remove ", 8, zx)) : Q("", !0)])
		])]))), 128))])) : (K(), q("p", Bx, "No trappings are selected yet."));
	}
}), Hx = { class: "dui-card-actions" }, Ux = ["disabled"], Wx = { key: 0 }, Gx = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, Kx = /* @__PURE__ */ U({
	__name: "NpcBuilderTrappingsTab",
	props: { bridge: {} },
	setup(e) {
		let t = e, n = Op(), { trappings: r } = xu(n), i = /* @__PURE__ */ B(""), a = /* @__PURE__ */ B(!1), o = $(() => r.value.filter((e) => !e.ignored && e.resolution.status === "unresolved"));
		go(() => {
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
		return (e, t) => (K(), J(dm, {
			description: "Review the Items that will be embedded in the generated NPC.",
			title: "Trappings"
		}, {
			default: H(() => [
				Y("div", Hx, [Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: a.value || !o.value.length,
					type: "button",
					onClick: u
				}, L(a.value ? "Resolving..." : "Resolve Trappings"), 9, Ux), o.value.length ? (K(), q("span", Wx, L(o.value.length) + " unresolved ", 1)) : Q("", !0)]),
				i.value ? (K(), q("p", Gx, L(i.value), 1)) : Q("", !0),
				X(Vx, {
					trappings: V(r),
					onQuantityInput: s,
					onRemoveCustomTrapping: V(n).removeCustomTrapping,
					onResolutionChange: l,
					onUseChange: c
				}, null, 8, ["trappings", "onRemoveCustomTrapping"])
			]),
			_: 1
		}));
	}
});
//#endregion
//#region src/module/apps/npc-builder/functions/career-workflow/skill-resolution.ts
function qx(e, t) {
	let n = /* @__PURE__ */ new Map(), r = [], i = [];
	for (let a of e) {
		let e = /* @__PURE__ */ new Map();
		for (let o of Lu(a.career.uuid, a.career.grants.skills)) {
			let s = Iu(o.originalName);
			if (!s) continue;
			let c = Ru(o.originalName), l = n.get(c) ?? [], u = e.get(c) ?? 0, d = t.enableLinkedSkillResolution && l[u] ? l[u] : "";
			if (e.set(c, u + 1), d) {
				r.push({
					linkedFromKey: d,
					resolutionKey: o.resolutionKey
				});
				continue;
			}
			i.push({
				alreadyGrantedSpecializations: Qx(a.career.grants.skills, s.baseName),
				baseName: s.baseName,
				careerLabel: $x(a.career),
				isLoadingSuggestions: !1,
				occurrence: o.occurrence,
				options: s.options,
				originalName: s.originalName,
				resolvedSpecialization: eS(s),
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
function Jx(e) {
	return e.resolvedSpecialization.trim() ? Pu(e.baseName, e.resolvedSpecialization) : "";
}
function Yx(e) {
	return e.occurrence > 0 ? `${e.originalName}, choice ${e.occurrence + 1}` : e.originalName;
}
function Xx(e) {
	return e.options.length <= 1 && e.specialization.trim().toLocaleLowerCase() === "any";
}
function Zx(e, t) {
	let n = Ru(t);
	return e.alreadyGrantedSpecializations.some((e) => Ru(e) === n);
}
function Qx(e, t) {
	let n = Ru(t), r = /* @__PURE__ */ new Set(), i = [];
	for (let t of e) {
		let e = Fu(t);
		if (!e || Ru(e.baseName) !== n) continue;
		let a = Ru(e.specialization);
		r.has(a) || (r.add(a), i.push(e.specialization));
	}
	return i;
}
function $x(e) {
	return e.level === null ? e.name : `${e.name}, tier ${e.level}`;
}
function eS(e) {
	return e.specialization.trim().toLocaleLowerCase() === "any" ? "" : e.options[0] ?? "";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/SkillResolutionPromptContent.vue?vue&type=script&setup=true&lang.ts
var tS = { class: "dui-card-body" }, nS = { class: "dui-card-title" }, rS = { class: "dui-badge" }, iS = { class: "dui-fieldset" }, aS = { class: "app:grid app:gap-1" }, oS = ["onUpdate:modelValue", "aria-label"], sS = ["value"], cS = [
	"onUpdate:modelValue",
	"aria-label",
	"placeholder"
], lS = {
	key: 0,
	class: "dui-label app:text-error"
}, uS = {
	key: 0,
	class: "dui-card-actions"
}, dS = { key: 0 }, fS = ["onClick"], pS = {
	key: 0,
	class: "dui-badge dui-badge-error dui-badge-xs"
}, mS = {
	key: 0,
	class: "dui-alert dui-alert-info"
}, hS = { class: "dui-card-actions" }, gS = /* @__PURE__ */ U({
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
			return !!e.resolvedSpecialization && Zx(e, e.resolvedSpecialization);
		}
		return (t, i) => (K(), q("section", null, [
			i[5] ||= Y("p", null, " Some Career skills need a specialization before they become concrete WFRP skills. Blank rows can be left unresolved and edited later. ", -1),
			(K(!0), q(G, null, W(e.prompt.rows, (t) => (K(), q("section", {
				key: t.resolutionKey,
				class: "dui-card dui-card-border dui-card-sm"
			}, [Y("div", tS, [
				Y("h3", nS, L(e.getSkillResolutionLabel(t)), 1),
				Y("span", rS, L(t.careerLabel), 1),
				Y("fieldset", iS, [
					i[4] ||= Y("legend", { class: "dui-fieldset-legend" }, "Specialization", -1),
					Y("label", aS, [i[3] ||= Y("span", { class: "dui-label" }, "Choice", -1), t.options.length > 1 ? za((K(), q("select", {
						key: 0,
						"onUpdate:modelValue": (e) => t.resolvedSpecialization = e,
						"aria-label": `Specialization for ${e.getSkillResolutionLabel(t)}`,
						class: I(["dui-select dui-select-sm", { "dui-select-error": V(Zx)(t, t.resolvedSpecialization) }])
					}, [i[2] ||= Y("option", { value: "" }, "Leave unresolved", -1), (K(!0), q(G, null, W(t.options, (e) => (K(), q("option", {
						key: e,
						class: I({ "app:text-error": V(Zx)(t, e) }),
						value: e
					}, L(e) + L(V(Zx)(t, e) ? " — already granted" : ""), 11, sS))), 128))], 10, oS)), [[Dl, t.resolvedSpecialization]]) : za((K(), q("input", {
						key: 1,
						"onUpdate:modelValue": (e) => t.resolvedSpecialization = e,
						"aria-label": `Specialization for ${e.getSkillResolutionLabel(t)}`,
						class: I(["dui-input dui-input-sm", { "dui-input-error": V(Zx)(t, t.resolvedSpecialization) }]),
						placeholder: t.suggestedSpecializations.length ? "Type or choose below" : t.specialization,
						type: "text"
					}, null, 10, cS)), [[wl, t.resolvedSpecialization]])]),
					r(t) ? (K(), q("p", lS, " Already granted by this Career. ")) : Q("", !0)
				]),
				e.usesFreeformSkillSpecialization(t) ? (K(), q("div", uS, [t.isLoadingSuggestions ? (K(), q("small", dS, "Finding known choices.")) : Q("", !0), (K(!0), q(G, null, W(t.suggestedSpecializations, (e) => (K(), q("button", {
					key: `${t.resolutionKey}:${e}`,
					class: I(["dui-btn dui-btn-sm", { "dui-btn-error dui-btn-outline": V(Zx)(t, e) }]),
					type: "button",
					onClick: (r) => n("chooseSkillSpecialization", t, e)
				}, [Z(L(e) + " ", 1), V(Zx)(t, e) ? (K(), q("span", pS, " Already granted ")) : Q("", !0)], 10, fS))), 128))])) : Q("", !0)
			])]))), 128)),
			e.prompt.linkedRows.length ? (K(), q("div", mS, L(e.prompt.linkedRows.length) + " linked skill specialization" + L(e.prompt.linkedRows.length === 1 ? "" : "s") + " will reuse earlier choices from this career chain. ", 1)) : Q("", !0),
			Y("div", hS, [Y("button", {
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: i[0] ||= (e) => n("addWithoutResolving")
			}, " Add Without Resolving "), Y("button", {
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: i[1] ||= (e) => n("applySpecializations")
			}, " Apply Specializations ")])
		]));
	}
});
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/types.ts
function _S(e) {
	return e === "build-actor" || e === "build-careers" || e === "build-quick";
}
function vS(e) {
	return e === "settings-advancement" || e === "settings-folders" || e === "settings-resolution" || e === "settings-suggestions";
}
function yS(e) {
	return e === "automatic-xp" || e === "detail-characteristics" || e === "detail-skills" || e === "detail-talents";
}
function bS(e) {
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
//#region src/module/apps/npc-builder/view/NpcBuilderApp/NpcBuilderMegaMenuContent.vue?vue&type=script&setup=true&lang.ts
var xS = ["aria-current", "onClick"], SS = ["aria-current", "popovertarget"], CS = ["id"], wS = ["onClick"], TS = /* @__PURE__ */ U({
	__name: "NpcBuilderMegaMenuContent",
	props: {
		activePage: {},
		groups: {}
	},
	emits: ["pageSelect"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (K(), q(G, null, [r[0] ||= Y("span", { class: "dui-megamenu-active" }, null, -1), (K(!0), q(G, null, W(e.groups, (t) => (K(), q(G, { key: t.key }, ["page" in t ? (K(), q("button", {
			key: 0,
			"aria-current": t.isActive ? "page" : void 0,
			type: "button",
			onClick: (e) => n("pageSelect", t.page, e)
		}, L(t.label), 9, xS)) : (K(), q(G, { key: 1 }, [Y("button", {
			"aria-current": t.isActive ? "page" : void 0,
			popovertarget: t.popoverId,
			type: "button"
		}, L(t.label), 9, SS), Y("div", {
			id: t.popoverId,
			popover: ""
		}, [Y("ul", { class: I(["dui-menu app:min-w-56 app:p-2", t.columnsClass]) }, [(K(!0), q(G, null, W(t.pages, (t) => (K(), q("li", { key: t.page }, [Y("button", {
			class: I({ "dui-menu-active": e.activePage === t.page }),
			type: "button",
			onClick: (e) => n("pageSelect", t.page, e)
		}, L(V(bS)(t.page)), 11, wS)]))), 128))], 2)], 8, CS)], 64))], 64))), 128))], 64));
	}
}), ES = { class: "dui-navbar app:sticky app:top-0 app:z-20 app:flex-wrap app:gap-2 app:bg-base-200 app:px-3 app:py-2" }, DS = { class: "dui-navbar-start app:min-w-64 app:flex-1" }, OS = { class: "app:min-w-0" }, kS = { class: "app:text-base-content/70" }, AS = {
	"aria-label": "NPC Builder pages",
	class: "app:order-3 app:flex app:w-full app:flex-wrap app:items-center app:justify-start app:gap-2"
}, jS = {
	id: "npc-builder-megamenu",
	class: "dui-megamenu max-sm:dui-megamenu-vertical dui-megamenu-sm app:ml-0 app:mr-auto app:border app:border-base-300 app:bg-base-100 app:p-2",
	popover: ""
}, MS = { class: "dui-navbar-end app:w-auto app:shrink-0" }, NS = ["disabled"], PS = /* @__PURE__ */ U({
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
		], c = $(() => [
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
		return (t, n) => (K(), q("header", ES, [
			Y("div", DS, [Y("div", OS, [
				n[1] ||= Y("span", { class: "dui-badge dui-badge-outline" }, "WFRP4e Customizer", -1),
				n[2] ||= Y("h1", { class: "app:m-0 app:text-xl app:leading-tight" }, "NPC Builder", -1),
				Y("small", kS, [e.selectedBaseActorName ? (K(), q(G, { key: 0 }, [Z(L(e.selectedBaseActorName) + " base · " + L(e.finalActorName), 1)], 64)) : (K(), q(G, { key: 1 }, [Z("Choose a base character, then shape the final NPC.")], 64))])
			])]),
			Y("nav", AS, [n[3] ||= Y("button", {
				"aria-label": "Open NPC Builder navigation",
				class: "dui-btn dui-btn-sm sm:app:hidden",
				popovertarget: "npc-builder-megamenu",
				type: "button"
			}, " Menu ", -1), Y("div", jS, [X(TS, {
				"active-page": e.activePage,
				groups: c.value,
				onPageSelect: l
			}, null, 8, ["active-page", "groups"])])]),
			Y("div", MS, [Y("button", {
				class: "dui-btn dui-btn-primary",
				disabled: !e.canBuild,
				type: "button",
				onClick: n[0] ||= (e) => r("buildNpc")
			}, " Build NPC ", 8, NS)])
		]));
	}
});
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderApplicationDrop.ts
function FS(e, t, n, r) {
	let i = Op(), a = /* @__PURE__ */ B(!1);
	function o(e) {
		IS(e) || (e.preventDefault(), a.value = !0);
	}
	function s(e) {
		if (IS(e)) return;
		let t = e.currentTarget, n = e.relatedTarget;
		t instanceof Node && n instanceof Node && t.contains(n) || (a.value = !1);
	}
	function c(e) {
		IS(e) || (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"));
	}
	async function l(o) {
		if (!IS(o)) {
			o.preventDefault(), a.value = !1, r.value = "";
			try {
				let r = await e.resolveApplicationDrop(o.dataTransfer?.getData("text/plain") ?? "");
				r.kind === "actor" ? i.selectBaseActor(r.actor) : r.kind === "career" ? await n(r.career, { replaceQueue: t.value === "build-quick" }) : r.kind === "advancement" ? i.addCustomAdvancement(r.advancement) : r.kind === "trapping" ? i.addCustomTrapping(r.trapping) : r.kind === "trait" ? i.addCustomTrait(r.trait) : i.addCustomSpell(r.spell);
			} catch (e) {
				r.value = Lv(e);
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
function IS(e) {
	let t = e.dataTransfer, n = t?.getData("text/plain") ?? "", r = Array.from(t?.types ?? []);
	return n.startsWith("npc-builder-career:") || mf(n) !== null || r.includes(I_);
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderBuild.ts
function LS(e, t, n, r, i) {
	let a = Op(), { advancements: o, buildTraits: s, careers: c, finalActorName: l, finalPortraitPath: u, selectedMountActorUuid: d, selectedBaseActor: f, selectedSpells: p, settings: m, trappings: h } = xu(a), g = /* @__PURE__ */ B(!1), _ = $(() => !!(f.value && c.value.length && !g.value && !i.value));
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
			r.value = Lv(e), n.value = "";
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
//#region src/module/apps/npc-builder/functions/career-workflow/lower-careers.ts
function RS(e) {
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
function zS(e) {
	return [{
		career: e,
		mode: "add-or-increment"
	}];
}
function BS(e) {
	return [...e.candidates.filter((t) => e.selectedUuids.includes(t.uuid)).map((e) => ({
		career: e,
		mode: "add-if-missing"
	})), {
		career: e.droppedCareer,
		mode: "add-or-increment"
	}];
}
function VS(e) {
	let t = e.candidates.filter((t) => e.selectedUuids.includes(t.uuid)).length;
	return t === 0 ? "" : `Added ${t} lower-tier career candidate${t === 1 ? "" : "s"}.`;
}
function HS(e, t) {
	return e?.selectedUuids.includes(t) ?? !1;
}
function US(e) {
	let { candidateUuid: t, isAlreadyQueued: n, prompt: r, selected: i } = e;
	return !r || n ? null : i ? [...new Set([...r.selectedUuids, t])] : r.selectedUuids.filter((e) => e !== t);
}
//#endregion
//#region src/module/apps/npc-builder/state/workflows/skill-suggestions.ts
async function WS(e, t) {
	await Promise.all(t.rows.map(async (t) => {
		if (Xx(t)) {
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
//#region src/module/apps/npc-builder/state/workflows/career-drop-workflow.ts
function GS(e) {
	let t = Op(), { careers: n, settings: r } = xu(t), i = /* @__PURE__ */ B(""), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(null), c = /* @__PURE__ */ B(null), l = $(() => RS(s.value));
	async function u(t, n = {}) {
		a.value = "";
		try {
			await d(await e.resolveCareerDrop(t), n);
		} catch (e) {
			a.value = KS(e);
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
		m(zS(e), {
			enableLinkedSkillResolution: !1,
			message: ""
		});
	}
	function m(t, n) {
		let r = qx(t, n);
		if (r.rows.length) {
			c.value = r, WS(e, c.value);
			return;
		}
		b(t, n.message);
	}
	function h() {
		let e = s.value;
		e && (s.value = null, m(BS(e), {
			enableLinkedSkillResolution: !r.value.askForLinkedSkillSpecializations,
			message: VS(e)
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
			for (let n of e.rows) t.setSkillGrantResolution(n.resolutionKey, Jx(n));
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
		return HS(s.value, e);
	}
	function C(e, t) {
		let n = US({
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
		getSkillResolutionLabel: Yx,
		addCareerSummaryWithLowerCareerMode: d,
		handleCareerDrop: u,
		isCareerQueued: x,
		isFindingLowerCareers: o,
		isLowerCareerSelected: S,
		lowerCareerCandidateGroups: l,
		pendingLowerCareerPrompt: s,
		pendingSkillResolutionPrompt: c,
		setLowerCareerSelected: C,
		usesFreeformSkillSpecialization: Xx
	};
}
function KS(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderCareerDropWorkflow.ts
function qS(e) {
	return GS(e);
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderInitialData.ts
function JS(e, t) {
	let n = Op(), { selectedBaseActorUuid: r, selectedMountActorUuid: i, settings: a } = xu(n), o = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B([]);
	go(async () => {
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
			t.value = Lv(e);
		} finally {
			o.value = !1;
		}
	}), Ka(r, async (r) => {
		if (t.value = "", !r) {
			n.clearBaseDraftData(), n.hydrateBaseActorCombatProfile(null);
			return;
		}
		r === i.value && n.clearMountSelection(), n.hydrateBaseActorCombatProfile(null), s.value = !0;
		try {
			let [t, i] = await Promise.all([e.loadBaseActorDraftData(r), e.loadActorCombatProfile(r)]);
			n.hydrateBaseActorDraftData(t), n.hydrateBaseActorCombatProfile(i);
		} catch (e) {
			t.value = Lv(e), n.clearBaseDraftData(), n.hydrateBaseActorCombatProfile(null);
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
//#region src/module/apps/npc-builder/functions/metadata-lookups.ts
function YS() {
	return {
		inFlightNames: [],
		successfulNames: []
	};
}
function XS(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.kind === "skill" && !n.characteristicKey && !Iu(n.name) && t.add(n.name);
	return [...t];
}
function ZS(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.kind === "talent" && !n.talentMaximumKey && t.add(n.name);
	return [...t];
}
function QS(e, t) {
	let n = new Set([...t.inFlightNames, ...t.successfulNames]);
	return e.filter((e) => {
		let t = Ru(e);
		return n.has(t) ? !1 : (n.add(t), !0);
	});
}
function $S(e, t) {
	return {
		...e,
		inFlightNames: nC([...e.inFlightNames, ...t])
	};
}
function eC(e, t) {
	let n = new Set(nC(t));
	return {
		inFlightNames: e.inFlightNames.filter((e) => !n.has(e)),
		successfulNames: nC([...e.successfulNames, ...n])
	};
}
function tC(e, t) {
	let n = new Set(nC(t));
	return {
		...e,
		inFlightNames: e.inFlightNames.filter((e) => !n.has(e))
	};
}
function nC(e) {
	return [...new Set([...e].map(Ru).filter(Boolean))];
}
//#endregion
//#region src/module/apps/npc-builder/state/workflows/metadata-lookups-workflow.ts
function rC(e) {
	let t = Op(), { advancements: n } = xu(t), r = /* @__PURE__ */ B(YS()), i = /* @__PURE__ */ B(YS()), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(""), s = $(() => XS(n.value)), c = $(() => ZS(n.value)), l = $(() => [a.value, o.value].filter(Boolean).join(" ")), u = $(() => l.value ? "degraded" : r.value.inFlightNames.length + i.value.inFlightNames.length > 0 ? "loading" : "ready");
	Ka(s, (e) => {
		d(e);
	}, { immediate: !0 }), Ka(c, (e) => {
		f(e);
	}, { immediate: !0 });
	async function d(n) {
		if (!n.length) {
			a.value = "";
			return;
		}
		let i = QS(n, r.value);
		if (i.length) {
			r.value = $S(r.value, i), a.value = "";
			try {
				let n = await e.listSkillCharacteristics(i);
				r.value = eC(r.value, i), t.hydrateSkillCharacteristics(n);
			} catch (e) {
				r.value = tC(r.value, i), a.value = iC("skill characteristics", e);
			}
		}
	}
	async function f(n) {
		if (!n.length) {
			o.value = "";
			return;
		}
		let r = QS(n, i.value);
		if (r.length) {
			i.value = $S(i.value, r), o.value = "";
			try {
				let n = await e.listTalentMaximums(r);
				i.value = eC(i.value, r), t.hydrateTalentMaximums(n);
			} catch (e) {
				i.value = tC(i.value, r), o.value = iC("Talent maximums", e);
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
function iC(e, t) {
	return `Could not load ${e}.${t instanceof Error ? ` ${t.message}` : ""}`;
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderMetadataLookups.ts
function aC(e) {
	return rC(e);
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp.vue?vue&type=script&setup=true&lang.ts
var oC = ["id", "aria-label"], sC = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, cC = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, lC = {
	key: 2,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, uC = {
	key: 3,
	"aria-live": "polite",
	class: "dui-alert dui-alert-warning",
	role: "status"
}, dC = /* @__PURE__ */ U({
	__name: "NpcBuilderApp",
	props: { bridge: {} },
	setup(e) {
		let t = e, { finalActorName: n, hasMagicAccess: r, selectedBaseActor: i, selectedSpells: a } = xu(Op()), o = /* @__PURE__ */ B("build-quick"), s = eo(), c = $(() => r.value || a.value.length > 0), { addCareerSummaryWithLowerCareerMode: l, buildMessage: u, chooseSkillSpecialization: d, confirmLowerCareerPrompt: f, confirmSkillResolutionPrompt: p, dismissLowerCareerPrompt: m, dismissSkillResolutionPrompt: h, errorMessage: g, getSkillResolutionLabel: _, isCareerQueued: v, isFindingLowerCareers: y, isLowerCareerSelected: b, lowerCareerCandidateGroups: x, pendingLowerCareerPrompt: S, pendingSkillResolutionPrompt: C, setLowerCareerSelected: w, usesFreeformSkillSpecialization: T } = qS(t.bridge), { buildNpc: E, canBuild: D } = LS(t.bridge, o, u, g, y), { isLoadingActors: ee, isLoadingBaseDraft: O, traitDifficultyOptions: te } = JS(t.bridge, g), { metadataLookupError: k, metadataLookupStatus: ne, retryMetadataLookups: A } = aC(t.bridge), { handleApplicationDragEnter: re, handleApplicationDragLeave: ie, handleApplicationDragOver: ae, handleApplicationDrop: oe, isApplicationDragOver: se } = FS(t.bridge, o, l, g);
		return (e, r) => (K(), q("section", {
			"aria-label": "NPC Builder",
			class: I(["app:flex app:min-h-full app:flex-col", { "app:ring-2 app:ring-info": V(se) }]),
			onDragenter: r[2] ||= (...e) => V(re) && V(re)(...e),
			onDragleave: r[3] ||= (...e) => V(ie) && V(ie)(...e),
			onDragover: r[4] ||= (...e) => V(ae) && V(ae)(...e),
			onDrop: r[5] ||= (...e) => V(oe) && V(oe)(...e)
		}, [
			X(PS, {
				"active-page": o.value,
				"can-build": V(D),
				"final-actor-name": V(n),
				"has-spell-page": c.value,
				"selected-base-actor-name": V(i)?.name ?? "",
				onBuildNpc: V(E),
				onPageChange: r[0] ||= (e) => o.value = e
			}, null, 8, [
				"active-page",
				"can-build",
				"final-actor-name",
				"has-spell-page",
				"selected-base-actor-name",
				"onBuildNpc"
			]),
			X(Ip, {
				open: V(S) !== null,
				title: "Add Lower-Tier Careers?",
				onClose: V(m)
			}, {
				default: H(() => [V(S) ? (K(), J(Mp, {
					key: 0,
					"candidate-groups": V(x),
					"is-career-queued": V(v),
					"is-lower-career-selected": V(b),
					prompt: V(S),
					onAddDroppedOnly: V(m),
					onAddSelected: V(f),
					onLowerCareerSelected: V(w)
				}, null, 8, [
					"candidate-groups",
					"is-career-queued",
					"is-lower-career-selected",
					"prompt",
					"onAddDroppedOnly",
					"onAddSelected",
					"onLowerCareerSelected"
				])) : Q("", !0)]),
				_: 1
			}, 8, ["open", "onClose"]),
			X(Ip, {
				open: V(C) !== null,
				title: "Resolve Skill Specializations",
				onClose: V(h)
			}, {
				default: H(() => [V(C) ? (K(), J(gS, {
					key: 0,
					"get-skill-resolution-label": V(_),
					prompt: V(C),
					"uses-freeform-skill-specialization": V(T),
					onAddWithoutResolving: V(h),
					onApplySpecializations: V(p),
					onChooseSkillSpecialization: V(d)
				}, null, 8, [
					"get-skill-resolution-label",
					"prompt",
					"uses-freeform-skill-specialization",
					"onAddWithoutResolving",
					"onApplySpecializations",
					"onChooseSkillSpecialization"
				])) : Q("", !0)]),
				_: 1
			}, 8, ["open", "onClose"]),
			Y("section", {
				id: `${V(s)}-panel`,
				"aria-label": V(bS)(o.value),
				class: "app:grid app:flex-1 app:content-start app:gap-3 app:p-3"
			}, [
				V(g) ? (K(), q("p", sC, L(V(g)), 1)) : V(u) ? (K(), q("p", cC, L(V(u)), 1)) : V(se) ? (K(), q("p", lC, " Release to add this document to the NPC draft. ")) : Q("", !0),
				V(ne) === "degraded" ? (K(), q("div", uC, [
					Y("span", null, L(V(k)), 1),
					r[6] ||= Y("span", null, "Advancement rows remain editable with reduced metadata.", -1),
					Y("button", {
						class: "dui-btn dui-btn-sm",
						type: "button",
						onClick: r[1] ||= (...e) => V(A) && V(A)(...e)
					}, " Retry Metadata ")
				])) : Q("", !0),
				V(vS)(o.value) ? (K(), J(_b, {
					key: 4,
					bridge: t.bridge,
					page: o.value
				}, null, 8, ["bridge", "page"])) : V(yS)(o.value) ? (K(), J(Gm, {
					key: 5,
					page: o.value
				}, null, 8, ["page"])) : o.value === "trappings" ? (K(), J(Kx, {
					key: 6,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : o.value === "traits" ? (K(), J(gx, {
					key: 7,
					"difficulty-options": V(te)
				}, null, 8, ["difficulty-options"])) : o.value === "detail-spells" ? (K(), J(ex, {
					key: 8,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : o.value === "mount" ? (K(), J(cy, {
					key: 9,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : V(_S)(o.value) ? (K(), J(K_, {
					key: 10,
					bridge: t.bridge,
					"is-loading-actors": V(ee),
					"is-loading-base-draft": V(O),
					page: o.value
				}, null, 8, [
					"bridge",
					"is-loading-actors",
					"is-loading-base-draft",
					"page"
				])) : Q("", !0)
			], 8, oC)
		], 34));
	}
}), fC = ou();
//#endregion
//#region src/module/foundry/document-drop.ts
function pC(e) {
	let t = e.value.trim();
	if (!t) return "";
	if (SC(t)) return t;
	let n = vC(t), r = bC(n, e.documentType);
	return r ? CC(n) ? JSON.stringify({
		type: r,
		uuid: n
	}) : JSON.stringify({
		id: n,
		type: r
	}) : "";
}
function mC(e) {
	let t = !0;
	function n() {
		t && (t = !1, document.removeEventListener("click", r, !0));
	}
	function r(t) {
		let r = t.target;
		if (!(r instanceof Element)) return;
		let i = hC(r);
		i && (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), n(), e(i));
	}
	return document.addEventListener("click", r, !0), n;
}
function hC(e) {
	let t = e.closest("[data-uuid], [data-document-uuid], [data-entry-uuid], [data-document-id], [data-entry-id], [data-pack]");
	if (!t) return "";
	let n = t.dataset.uuid || t.dataset.documentUuid || t.dataset.entryUuid || "";
	if (n) return _C(n);
	let r = t.dataset.documentId || t.dataset.entryId || "", i = yC(t);
	if (!r || !i) return "";
	let a = t.dataset.pack || t.closest("[data-pack]")?.dataset.pack || gC(t);
	return a ? JSON.stringify({
		type: i,
		uuid: `Compendium.${a}.${r}`
	}) : t.closest(".compendium-directory") ? "" : JSON.stringify({
		type: i,
		uuid: `${i}.${r}`
	});
}
function gC(e) {
	let t = e.closest(".compendium-directory");
	return t ? Array.from(game.packs ?? []).find((e) => t.id === `Compendium-${e.collection?.replaceAll(".", "_")}`)?.collection ?? "" : "";
}
function _C(e) {
	let t = bC(e, "auto");
	return t ? JSON.stringify({
		type: t,
		uuid: e
	}) : "";
}
function vC(e) {
	return /@UUID\[([^\]]+)]/.exec(e)?.[1]?.trim() ?? e;
}
function yC(e) {
	let t = e.dataset.documentName || e.dataset.type || e.closest("[data-document-name]")?.dataset.documentName || "";
	return xC(t) ? t : e.classList.contains("actor") ? "Actor" : e.classList.contains("item") ? "Item" : e.classList.contains("journal") ? "JournalEntry" : e.closest("#actors") ? "Actor" : e.closest("#items") ? "Item" : e.closest("#journal") ? "JournalEntry" : "";
}
function bC(e, t) {
	return /^actor\./i.test(e) || /\.actors(\.|$)/i.test(e) ? "Actor" : /^item\./i.test(e) || /\.items(\.|$)/i.test(e) ? "Item" : /journalentrypage\./i.test(e) || /\.journalentrypage\./i.test(e) ? "JournalEntryPage" : /^journalentry\./i.test(e) || /\.journals(\.|$)/i.test(e) ? "JournalEntry" : t === "auto" ? "Item" : t;
}
function xC(e) {
	return e === "Actor" || e === "Item" || e === "JournalEntry" || e === "JournalEntryPage";
}
function SC(e) {
	if (!e.startsWith("{")) return !1;
	try {
		return typeof JSON.parse(e).type == "string";
	} catch {
		return !1;
	}
}
function CC(e) {
	return /^(actor|item|journalentry|journalentrypage|compendium)\./i.test(e);
}
var wC = {
	createDropData: pC,
	startDocumentPick: mC
}, TC = class {
	#e;
	createRoot() {
		let e = document.createElement("div");
		return e.classList.add("wfrp4e-customizer-apps-root"), e.dataset.theme = "wfrp4e-customizer-apps", e;
	}
	mount(e, t, n, r) {
		this.unmount(), t.classList.add("wfrp4e-customizer-apps-app"), t.replaceChildren(e), this.#e = zl(n, r), this.#e.use(fC), this.#e.provide(hv, wC), this.#e.mount(e);
	}
	unmount() {
		this.#e?.unmount(), this.#e = void 0;
	}
}, EC = class extends foundry.applications.api.ApplicationV2 {
	#e = new TC();
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
//#region src/module/apps/npc-builder/functions/extract-career-grants.ts
function DC(e) {
	return {
		characteristics: OC(e),
		skills: kC(e),
		talents: jC(e, [["talents", "value"], ["talents"]]),
		trappings: jC(e, [["trappings", "value"], ["trappings"]])
	};
}
function OC(e) {
	let t = jC(e, [["characteristics", "value"], ["characteristics"]]);
	if (t.length) return t.map(AC);
	let n = v(e, ["characteristics"]);
	if (!_(n)) return [];
	let r = [];
	for (let [e, t] of Object.entries(n)) t && r.push(AC(e));
	return NC(r);
}
function kC(e) {
	return jC(e, [["skills", "value"], ["skills"]], { preserveDuplicates: !0 });
}
function AC(e) {
	let t = e.trim().toLocaleLowerCase();
	if (O(t)) return D[t];
	let n = ee[t];
	return n ? D[n] : e.trim();
}
function jC(e, t, n = {}) {
	for (let r of t) {
		let t = w(v(e, r));
		if (t.length) return n.preserveDuplicates ? MC(t) : NC(t);
	}
	return [];
}
function MC(e) {
	return e.map((e) => e.trim()).filter(Boolean);
}
function NC(e) {
	return [...new Set(MC(e))].sort((e, t) => e.localeCompare(t));
}
//#endregion
//#region src/module/foundry/compendiums.ts
function PC(e, t) {
	return t.uuid ? t.uuid : t._id && e.getUuid ? e.getUuid(t._id) : "";
}
function FC(e) {
	return e.documentName === "Item" || y(e, ["metadata", "type"]) === "Item" || y(e, ["metadata", "documentName"]) === "Item";
}
function IC(e) {
	return e.documentName === "Actor" || y(e, ["metadata", "type"]) === "Actor" || y(e, ["metadata", "documentName"]) === "Actor";
}
function LC(e) {
	return Array.isArray(e) ? e.filter(zC) : _(e) && Array.isArray(e.contents) ? e.contents.filter(zC) : BC(e) ? [...e].flatMap((e) => {
		let t = Array.isArray(e) ? e[1] : e;
		return zC(t) ? [t] : [];
	}) : [];
}
function RC() {
	return new Promise((e) => {
		globalThis.setTimeout(e, 0);
	});
}
function zC(e) {
	return _(e);
}
function BC(e) {
	return _(e) && Symbol.iterator in e;
}
//#endregion
//#region src/module/wfrp/career-summary.ts
function VC(e) {
	return {
		careerGroup: HC(e),
		grants: DC(e.system),
		img: e.img ?? "",
		level: UC(e),
		name: e.name,
		uuid: e.uuid
	};
}
function HC(e) {
	return y(e.system, ["careergroup", "value"]);
}
function UC(e) {
	let t = v(e.system, ["level", "value"]), n = Number(t);
	return Number.isFinite(n) ? n : null;
}
//#endregion
//#region src/module/wfrp/career-index.ts
var WC = [
	"name",
	"type",
	"img",
	"system.careergroup.value",
	"system.characteristics",
	"system.level.value",
	"system.skills",
	"system.talents",
	"system.trappings"
], GC = /* @__PURE__ */ new Map(), KC = null;
function qC() {
	return KC || (GC.clear(), KC = YC().catch((e) => {
		throw GC.clear(), KC = null, jn("wfrp4e-customizer-apps | Career indexing failed.", e), e;
	}), KC);
}
async function JC(e) {
	return !e.careerGroup || e.level === null ? [] : (await qC(), [...GC.values()].filter((t) => ew(t, e)).sort(nw));
}
async function YC() {
	XC(), await RC();
	for (let e of game.packs ?? []) {
		if (!FC(e) || !e.getIndex) continue;
		let t = await e.getIndex({ fields: WC });
		for (let n of LC(t)) {
			let t = ZC(e, n);
			t && GC.set(t.uuid, t);
		}
		await RC();
	}
}
function XC() {
	for (let e of game.items?.contents ?? []) e.type === "career" && GC.set(e.uuid, VC(e));
}
function ZC(e, t) {
	let n = PC(e, t);
	if (t.type !== "career" || !t.name || !n) return null;
	let r = v(t, ["system"]);
	return {
		careerGroup: QC(t),
		grants: DC(r),
		img: t.img ?? "",
		level: $C(t),
		name: t.name,
		uuid: n
	};
}
function QC(e) {
	let t = v(e, [
		"system",
		"careergroup",
		"value"
	]);
	return typeof t == "string" ? t.trim() : "";
}
function $C(e) {
	let t = v(e, [
		"system",
		"level",
		"value"
	]), n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function ew(e, t) {
	return e.uuid !== t.uuid && e.level !== null && t.level !== null && e.level < t.level && tw(e.careerGroup) === tw(t.careerGroup);
}
function tw(e) {
	return e.trim().toLocaleLowerCase();
}
function nw(e, t) {
	let n = e.level ?? 0, r = t.level ?? 0;
	return n === r ? e.name.localeCompare(t.name) : n - r;
}
//#endregion
//#region src/module/wfrp/skill-specializations.ts
var rw = [
	"name",
	"type",
	"system.characteristic.value"
], iw = /* @__PURE__ */ new Map(), aw = /* @__PURE__ */ new Map(), ow = /* @__PURE__ */ new Map(), sw = "idle", cw = null;
async function lw(e) {
	let t = Ru(e);
	return t ? (sw === "idle" && dw(), cw && await cw, [...iw.get(t) ?? []].sort((e, t) => e.localeCompare(t))) : [];
}
async function uw(e) {
	return sw === "idle" && dw(), cw && await cw, e.flatMap((e) => {
		let t = _w(e);
		return t ? [{
			...t,
			skillName: e
		}] : [];
	});
}
function dw() {
	return cw || (sw = "indexing", iw.clear(), aw.clear(), ow.clear(), cw = fw().then(() => {
		sw = "ready";
	}).catch((e) => {
		sw = "error", jn("wfrp4e-customizer-apps | Skill specialization indexing failed.", e);
	}), cw);
}
async function fw() {
	vw(), await RC();
	for (let e of game.packs ?? []) {
		if (!FC(e) || !e.getIndex) continue;
		let t = await e.getIndex({ fields: rw });
		for (let e of LC(t)) mw(e);
		await RC();
	}
}
function pw(e) {
	e.type === "skill" && (gw(e.name, y(e.system, ["characteristic", "value"])), hw(e.name));
}
function mw(e) {
	e.type !== "skill" || !e.name || (gw(e.name, y(e, [
		"system",
		"characteristic",
		"value"
	])), hw(e.name));
}
function hw(e) {
	let t = Fu(e);
	if (!t) return;
	let n = Ru(t.baseName), r = iw.get(n) ?? /* @__PURE__ */ new Set();
	r.add(t.specialization), iw.set(n, r);
}
function gw(e, t) {
	if (!O(t)) return;
	let n = {
		characteristicKey: t,
		characteristicName: D[t],
		skillName: e
	}, r = Ru(e), i = Ru(Fu(e)?.baseName ?? e);
	aw.set(r, n), ow.has(i) || ow.set(i, n);
}
function _w(e) {
	let t = Ru(e), n = Ru(Fu(e)?.baseName ?? e);
	return aw.get(t) ?? ow.get(n) ?? null;
}
function vw() {
	for (let e of game.items?.contents ?? []) pw(e);
}
//#endregion
//#region src/module/foundry/item-sources.ts
function yw(e, t) {
	return {
		img: "systems/wfrp4e/icons/blank.png",
		name: e,
		system: {},
		type: t
	};
}
function bw(e, t, n) {
	let r = e ? e.toObject() : yw(t, n);
	return delete r._id, r;
}
function xw(e, t, n) {
	return Sw(e, t, n)[0] ?? null;
}
function Sw(e, t, n) {
	return e.items?.contents.filter((e) => e.type === n && Tw(e.name, t)) ?? [];
}
function Cw(e, t, n) {
	return e.items?.contents.find((e) => t && e.uuid === t ? !0 : Tw(e.name, n)) ?? null;
}
function ww(e, t) {
	return game.items?.contents.find((n) => t.includes(n.type) && Tw(n.name, e)) ?? null;
}
function Tw(e, t) {
	return e.trim().toLocaleLowerCase() === t.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/wfrp/item-lookup.ts
async function Ew(e, t) {
	return await game.wfrp4e?.utility?.findItem?.(e, t) || ww(e, t);
}
//#endregion
//#region src/module/wfrp/talent-maximums.ts
async function Dw(e) {
	let t = [];
	for (let n of Ow(e)) {
		let e = await Ew(n, ["talent"]);
		e && t.push({
			maximumFormula: y(e.system, ["max", "formula"]),
			maximumKey: y(e.system, ["max", "value"]),
			talentName: n
		});
	}
	return t;
}
function Ow(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = r.trim().toLocaleLowerCase();
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
//#endregion
//#region src/module/foundry/portrait-search/candidate-utils.ts
var kw = [
	".webp",
	".png",
	".jpg",
	".jpeg",
	".gif"
], Aw = new Set(kw);
function jw(e, t) {
	let n = t.img.trim().toLocaleLowerCase();
	!n || e.seenPaths.has(n) || (e.seenPaths.add(n), e.candidates.push(t));
}
function Mw(e, t) {
	let n = t.imagePaths.filter(({ path: e }) => !!e);
	if (Bw(t.name, n, e.searchTerms)) for (let r of n) {
		let n = {
			img: r.path,
			key: `foundry-asset:${t.sourceKey}:${r.label}`,
			label: `${t.name || Iw(r.path)} ${r.label} (${t.sourceLabel})`,
			source: "foundry-asset",
			sourceGroup: t.sourceGroup,
			sourceLabel: t.sourceLabel
		};
		Vw(n, e) && jw(e, n);
	}
}
function Nw(e, t, n) {
	e?.({
		candidatesFound: t.candidates.length,
		currentLocation: n.currentLocation,
		directoriesVisited: t.visitedDirectories,
		maxDirectories: n.maxDirectories,
		phase: n.phase
	});
}
function Pw(e) {
	return y(e, [
		"prototypeToken",
		"texture",
		"src"
	]) || y(e.toObject(), [
		"prototypeToken",
		"texture",
		"src"
	]);
}
function Fw(e, t) {
	return `${Iw(e)} (${t})`;
}
function Iw(e) {
	return e.split(/[/\\]/).at(-1) ?? e;
}
function Lw(e) {
	let t = `.${e.split(/[#?]/u)[0]?.split(".").pop() ?? ""}`;
	return Aw.has(t.toLocaleLowerCase());
}
function Rw(e) {
	return typeof e == "object" && !!e;
}
function zw(e) {
	return Rw(e) && Object.values(e).every((e) => Array.isArray(e) && e.every((e) => typeof e == "string"));
}
function Bw(e, t, n) {
	return df(e, n) || t.some(({ path: e }) => df(e, n));
}
function Vw(e, t) {
	return ff(e, {
		mustExcludeSources: [],
		mustExcludeTerms: t.mustExcludeTerms,
		mustIncludeSources: [],
		mustIncludeTerms: t.mustIncludeTerms
	});
}
//#endregion
//#region src/module/foundry/portrait-search/dig-down.ts
var Hw = "fuzzy-foundry", Uw = .3;
function Ww(e, t) {
	let n = Gw();
	if (Nw(t, e, {
		currentLocation: qw(n),
		maxDirectories: 0,
		phase: "filesystem"
	}), !n.digDownActive || !n.digDownCacheReady) return;
	let r = Xw();
	if (!(!r?._fileIndexCache || !r.fs)) {
		for (let t of Jw(r, e.searchTerms)) Yw(e, r, t);
		Nw(t, e, {
			currentLocation: "Dig Down file cache search complete",
			maxDirectories: 0,
			phase: "filesystem"
		});
	}
}
function Gw() {
	let e = game.modules.get(Hw)?.active === !0, t = Kw(), n = Xw(), r = Object.values(n?._fileIndexCache ?? {}).reduce((e, t) => e + t.length, 0);
	return {
		digDownActive: e,
		digDownCacheReady: !!(n?._fileIndexCache && n.fs),
		digDownDeepFileSearchEnabled: t,
		digDownIndexedFileCount: r
	};
}
function Kw() {
	try {
		return game.settings.get(Hw, "deepFile") === !0;
	} catch {
		return !1;
	}
}
function qw(e) {
	return e.digDownActive ? e.digDownDeepFileSearchEnabled ? e.digDownCacheReady ? `Dig Down file cache (${e.digDownIndexedFileCount} files)` : "Waiting for Dig Down file cache" : "Dig Down Deep File Search is disabled" : "Dig Down is not active";
}
function Jw(e, t) {
	let n = /* @__PURE__ */ new Set(), r = Object.keys(e._fileIndexCache ?? {});
	for (let i of t) {
		let t = i.toLocaleLowerCase();
		for (let e of r) e.toLocaleLowerCase().includes(t) && n.add(e);
		let a = e.fs?.get(i, [], Uw) ?? [];
		for (let [, e] of a) n.add(e);
	}
	return [...n].sort((e, t) => e.toLocaleLowerCase().localeCompare(t.toLocaleLowerCase()));
}
function Yw(e, t, n) {
	let r = t._fileIndexCache?.[n] ?? [];
	for (let t of r) {
		if (!Lw(t)) continue;
		let n = {
			img: t,
			key: `foundry-asset:${t}`,
			label: Fw(t, "Dig Down"),
			source: "foundry-asset",
			sourceGroup: "dig-down",
			sourceLabel: "Dig Down"
		};
		Vw(n, e) && jw(e, n);
	}
}
function Xw() {
	let e = canvas.deepSearchCache;
	if (!Rw(e)) return null;
	let t = e._fileIndexCache, n = e.fs, r = {};
	return zw(t) && (r._fileIndexCache = t), Rw(n) && typeof n.get == "function" && (r.fs = { get: n.get.bind(n) }), r;
}
//#endregion
//#region src/module/foundry/portrait-search/documents.ts
function Zw(e, t) {
	Nw(t, e, {
		currentLocation: "World Actors and Items",
		maxDirectories: 0,
		phase: "world-documents"
	});
	for (let t of game.actors.contents) Mw(e, {
		imagePaths: [{
			label: "actor image",
			path: t.img ?? ""
		}, {
			label: "token image",
			path: Pw(t)
		}],
		name: t.name,
		sourceGroup: "world",
		sourceLabel: "World Actors",
		sourceKey: t.uuid
	});
	for (let t of game.items?.contents ?? []) Mw(e, {
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
async function Qw(e, t) {
	Nw(t, e, {
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
		] }).catch(() => void 0), r = n ? LC(n) : [];
		for (let n of r) Mw(e, {
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
					path: y(n, [
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
async function $w(e, t, n) {
	let r = eT(t), i = new Set(r.map(({ path: e }) => iT(e)));
	for (e.maxDirectoryBudget += r.length; r.length;) {
		let t = r.shift();
		if (!t) break;
		rT(e, n, t.path);
		let a = await tT(t.path);
		if (e.visitedDirectories += 1, a) {
			nT(e, t.root, a.files ?? []);
			for (let n of aT(a.dirs ?? [])) {
				let a = cf([n])[0], o = iT(a ?? "");
				!a || i.has(o) || (i.add(o), r.push({
					path: a,
					root: t.root
				}), e.maxDirectoryBudget += 1);
			}
			rT(e, n, t.path);
		}
	}
}
function eT(e) {
	return cf(e).map((e) => ({
		path: e,
		root: e
	}));
}
async function tT(t) {
	try {
		return await foundry.applications.apps.FilePicker.browse("data", t, { extensions: kw });
	} catch (n) {
		return jn(`${e} | Could not browse priority portrait folder "${t}".`, n), null;
	}
}
function nT(e, t, n) {
	let r = `Priority: ${Iw(t)}`;
	for (let i of aT(n)) {
		if (!Lw(i) || !df(Iw(i), e.searchTerms)) continue;
		let n = {
			img: i,
			key: `foundry-asset:${i}`,
			label: Fw(i, r),
			source: "foundry-asset",
			sourceFilter: Kd(t),
			sourceGroup: "priority-folders",
			sourceLabel: r
		};
		Vw(n, e) && jw(e, n);
	}
}
function rT(e, t, n) {
	Nw(t, e, {
		currentLocation: n,
		maxDirectories: e.maxDirectoryBudget,
		phase: "filesystem"
	});
}
function iT(e) {
	return e.toLocaleLowerCase();
}
function aT(e) {
	return [...e].sort((e, t) => e.toLocaleLowerCase().localeCompare(t.toLocaleLowerCase()));
}
//#endregion
//#region src/module/foundry/portrait-search/exclusions.ts
var oT = /* @__PURE__ */ new Map(), sT = 6, cT = 15e3;
async function lT(e, t, n, r = uT) {
	let i = cf(t.excludedReferenceImagePaths), a = new Set(i.map(hT)), o = /* @__PURE__ */ new Set();
	for (let e of i) {
		let t = await r(e);
		t.loadable && t.pixelSignature && o.add(t.pixelSignature);
	}
	let s = Array(e.length).fill(null), c = 0, l = 0, u = 0;
	mT(n, 0, 0, e.length);
	async function d() {
		for (; l < e.length;) {
			let i = l, d = e[i];
			if (l += 1, !a.has(hT(d.img))) {
				let e = await r(d.img);
				e.loadable && (!t.excludeFullyTransparentImages || !e.fullyTransparent) && (!e.pixelSignature || !o.has(e.pixelSignature)) && (s[i] = d, c += 1);
			}
			u += 1, mT(n, c, u, e.length);
		}
	}
	let f = Math.min(sT, e.length);
	return await Promise.all(Array.from({ length: f }, d)), s.filter((e) => e !== null);
}
async function uT(e) {
	let t = hT(e), n = oT.get(t);
	if (n) return await n;
	let r = dT(e);
	return oT.set(t, r), await r;
}
async function dT(e) {
	let t = await fT(e);
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
			pixelSignature: await pT(e.width, e.height, r)
		};
	} catch {
		return {
			fullyTransparent: !1,
			loadable: !0,
			pixelSignature: ""
		};
	}
}
function fT(e) {
	return new Promise((t) => {
		let n = new Image(), r = setTimeout(() => i(null), cT);
		function i(e) {
			clearTimeout(r), n.onload = null, n.onerror = null, t(e);
		}
		n.onload = () => {
			i(n.naturalWidth > 0 && n.naturalHeight > 0 ? n : null);
		}, n.onerror = () => i(null), n.src = e;
	});
}
async function pT(e, t, n) {
	let r = await crypto.subtle.digest("SHA-256", n);
	return `${e}x${t}:${[...new Uint8Array(r)].map((e) => e.toString(16).padStart(2, "0")).join("")}`;
}
function mT(e, t, n, r) {
	e?.({
		candidatesFound: t,
		currentLocation: `Checking images ${n}/${r}`,
		directoriesVisited: n,
		maxDirectories: r,
		phase: "image-validation"
	});
}
function hT(e) {
	return e.trim().replaceAll("\\", "/").toLocaleLowerCase();
}
//#endregion
//#region src/module/foundry/portrait-search/index.ts
async function gT(e, t) {
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
	return await $w(n, e.priorityFolderPaths, t), e.includeCompendiumAssets && (await Qw(n, t), Zw(n, t)), e.includeFilePickerAssets && Ww(n, t), Nw(t, n, {
		currentLocation: "Portrait search complete",
		maxDirectories: n.maxDirectoryBudget,
		phase: "ready"
	}), n.candidates;
}
//#endregion
//#region src/module/apps/npc-builder/functions/normalize-npc-builder-settings.ts
var _T = {
	...Df(),
	allowBaseActorCharacteristics: !0,
	allowBaseActorSkills: !0,
	allowBaseActorTalents: !0
};
function vT(e) {
	let t = Df();
	return bT(e) ? {
		allowBaseActorCharacteristics: xT(e.allowBaseActorCharacteristics, _T.allowBaseActorCharacteristics),
		allowBaseActorSkills: xT(e.allowBaseActorSkills, _T.allowBaseActorSkills),
		allowBaseActorTalents: xT(e.allowBaseActorTalents, _T.allowBaseActorTalents),
		allowBaseActorTraits: xT(e.allowBaseActorTraits, _T.allowBaseActorTraits),
		allowBaseActorTrappings: xT(e.allowBaseActorTrappings, _T.allowBaseActorTrappings),
		askForLinkedSkillSpecializations: xT(e.askForLinkedSkillSpecializations, _T.askForLinkedSkillSpecializations),
		autoSelectGrantedSpells: xT(e.autoSelectGrantedSpells, _T.autoSelectGrantedSpells),
		baseActorFolderUuid: ST(e.baseActorFolderUuid, _T.baseActorFolderUuid),
		excludeFullyTransparentPortraitAssets: xT(e.excludeFullyTransparentPortraitAssets, _T.excludeFullyTransparentPortraitAssets),
		excludedPortraitReferenceImages: cf(Array.isArray(e.excludedPortraitReferenceImages) ? e.excludedPortraitReferenceImages : _T.excludedPortraitReferenceImages),
		includeSpeciesInName: xT(e.includeSpeciesInName, _T.includeSpeciesInName),
		lowerCareerMode: yT(e.lowerCareerMode) ? e.lowerCareerMode : _T.lowerCareerMode,
		outputActorFolderUuid: ST(e.outputActorFolderUuid, _T.outputActorFolderUuid),
		prioritizedPortraitFolders: cf(e.prioritizedPortraitFolders),
		quickTraitFolderUuid: ST(e.quickTraitFolderUuid, _T.quickTraitFolderUuid),
		searchCompendiumPortraitAssets: xT(e.searchCompendiumPortraitAssets, _T.searchCompendiumPortraitAssets),
		searchFoundryPortraitAssets: xT(e.searchFoundryPortraitAssets, _T.searchFoundryPortraitAssets),
		searchWebPortraitAssets: xT(e.searchWebPortraitAssets, _T.searchWebPortraitAssets)
	} : t;
}
function yT(e) {
	return e === "auto-add-all" || e === "never" || e === "prompt";
}
function bT(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function xT(e, t) {
	return typeof e == "boolean" ? e : t;
}
function ST(e, t) {
	return typeof e == "string" ? e : t;
}
//#endregion
//#region src/module/foundry/settings/foundry-setting-adapter.ts
function CT(e) {
	return e;
}
function wT(t) {
	game.settings.register(e, t.key, {
		config: t.config ?? !1,
		default: t.defaultValue,
		name: t.name,
		scope: t.scope ?? "world",
		type: Object
	});
}
function TT(t) {
	return t.normalize(game.settings.get(e, t.key));
}
async function ET(t, n) {
	let r = t.normalize(n);
	return await game.settings.set(e, t.key, r), r;
}
//#endregion
//#region src/module/wfrp/npc-builder/settings.ts
var DT = CT({
	defaultValue: Df(),
	key: "npcBuilderSettings",
	name: "NPC Builder Settings",
	normalize: vT
});
function OT() {
	wT(DT);
}
function kT() {
	return TT(DT);
}
async function AT(e) {
	return await ET(DT, e);
}
//#endregion
//#region src/module/foundry/drop-data.ts
function jT(e) {
	try {
		return JSON.parse(e);
	} catch {
		throw Error("Foundry drop data could not be read.");
	}
}
//#endregion
//#region src/module/foundry/embedded-items.ts
function MT() {
	return {
		creates: [],
		deletes: [],
		updates: []
	};
}
async function NT(e, t) {
	t.deletes.length && e.deleteEmbeddedDocuments && await e.deleteEmbeddedDocuments("Item", t.deletes), t.updates.length && e.updateEmbeddedDocuments && await e.updateEmbeddedDocuments("Item", t.updates), t.creates.length && await e.createEmbeddedDocuments("Item", t.creates);
}
//#endregion
//#region src/module/wfrp/npc-builder/xp-source-values.ts
function PT(e, t) {
	return x(e, [[
		"characteristics",
		t,
		"initial",
		"value"
	], [
		"characteristics",
		t,
		"initial"
	]]) + x(e, [[
		"characteristics",
		t,
		"modifier",
		"value"
	], [
		"characteristics",
		t,
		"modifier"
	]]) + x(e, [[
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
//#region src/module/wfrp/npc-builder/foundry-bridge/advancements.ts
async function FT(e, t) {
	let n = {}, r = MT();
	for (let i of t) {
		let t = Math.floor(i.current);
		if (i.kind === "talent") {
			await UT(e, i, t, r);
			continue;
		}
		let a = i.baseAdvances + t;
		if (i.kind === "characteristic") {
			if (t === 0) continue;
			HT(n, i, a);
			continue;
		}
		let o = xw(e, i.name, i.kind);
		if (t === 0 && !i.includedFromCustom && !o) continue;
		if (o) {
			r.updates.push({
				_id: o.id,
				"system.advances.value": a
			});
			continue;
		}
		let s = bw(await WT(i), i.name, i.kind);
		s.type = i.kind, T(s, [
			"system",
			"advances",
			"value"
		], a), r.creates.push(s);
	}
	Object.keys(n).length && await e.update(n), await NT(e, r);
}
function IT(e) {
	let t = e.toObject().system, n = x(t, [["advances", "value"], ["advances"]]);
	if (e.type === "talent") return {
		advances: Math.max(1, n),
		kind: "talent",
		name: e.name,
		sourceUuid: e.uuid,
		talentMaximumFormula: y(t, ["max", "formula"]),
		talentMaximumKey: y(t, ["max", "value"])
	};
	let r = VT(t), i = {
		advances: n,
		kind: "skill",
		name: e.name,
		sourceUuid: e.uuid
	};
	return r && (i.characteristicKey = r, i.characteristicName = D[r]), i;
}
function LT(e) {
	let t = e.toObject().system, n = [];
	for (let [e, r] of Object.entries(D)) {
		let i = x(t, [[
			"characteristics",
			e,
			"advances",
			"value"
		], [
			"characteristics",
			e,
			"advances"
		]]), a = x(t, [[
			"characteristics",
			e,
			"modifier",
			"value"
		], [
			"characteristics",
			e,
			"modifier"
		]]), o = x(t, [[
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
function RT(e, t) {
	return t === "talent" ? zT(e) : e.items?.contents.filter((e) => e.type === t).map((n) => BT(e, n, t)) ?? [];
}
function zT(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.items?.contents.filter((e) => e.type === "talent") ?? []) {
		let e = n.toObject().system, r = n.name.trim().toLocaleLowerCase(), i = x(e, [["advances", "value"], ["advances"]]), a = t.get(r);
		if (a) {
			a.baseAdvances += i, a.current += i;
			continue;
		}
		t.set(r, {
			baseAdvances: i,
			current: i,
			kind: "talent",
			name: n.name,
			talentMaximumFormula: y(e, ["max", "formula"]),
			talentMaximumKey: y(e, ["max", "value"])
		});
	}
	return [...t.values()];
}
function BT(e, t, n) {
	let r = t.toObject().system, i = x(r, [["advances", "value"], ["advances"]]);
	if (n === "talent") return {
		baseAdvances: i,
		current: i,
		kind: n,
		name: t.name,
		talentMaximumFormula: y(r, ["max", "formula"]),
		talentMaximumKey: y(r, ["max", "value"])
	};
	let a = x(r, [["modifier", "value"], ["modifier"]]), o = VT(r), s = {
		baseAdvances: i,
		baseModifier: a,
		current: (o ? PT(e.toObject().system, o) : 0) + i + a,
		kind: n,
		name: t.name
	};
	return o && (s.characteristicKey = o, s.characteristicName = D[o]), s;
}
function VT(e) {
	let t = y(e, ["characteristic", "value"]);
	return O(t) ? t : void 0;
}
function HT(e, t, n) {
	let r = ee[t.name.trim().toLocaleLowerCase()];
	r && (e[`system.characteristics.${r}.advances`] = n);
}
async function UT(e, t, n, r) {
	let i = Math.max(0, t.baseAdvances + n), a = Sw(e, t.name, "talent"), o = a[0] ?? await WT(t);
	r.deletes.push(...a.map((e) => e.id));
	for (let e = 0; e < i; e += 1) {
		let e = bw(o, t.name, "talent");
		e.type = "talent", T(e, [
			"system",
			"advances",
			"value"
		], 1), r.creates.push(e);
	}
}
async function WT(e) {
	if (e.sourceUuid) {
		let t = await fromUuid(e.sourceUuid);
		if (Xe(t)) return t;
	}
	return Ew(e.name, [e.kind]);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/config.ts
function GT(e, t) {
	T(e, [
		"system",
		"specification",
		"value"
	], t.specification), t.rollable && !t.damage && T(e, [
		"system",
		"rollable",
		"defaultDifficulty"
	], t.defaultDifficulty), t.damage && t.dice && T(e, [
		"system",
		"rollable",
		"dice"
	], t.dice);
}
function KT(e, t) {
	return {
		_id: e,
		"system.specification.value": t.specification,
		...t.rollable && !t.damage ? { "system.rollable.defaultDifficulty": t.defaultDifficulty } : {},
		...t.damage && t.dice ? { "system.rollable.dice": t.dice } : {}
	};
}
function qT(e) {
	return {
		...Su(),
		attackType: ZT(e.system, ["rollable", "attackType"]) || "melee",
		bonusCharacteristic: ZT(e.system, ["rollable", "bonusCharacteristic"]),
		damage: C(e.system, [["rollable", "damage"]]),
		defaultDifficulty: ZT(e.system, ["rollable", "defaultDifficulty"]) || "challenging",
		dice: ZT(e.system, ["rollable", "dice"]),
		rollable: C(e.system, [["rollable", "value"]]),
		skill: ZT(e.system, ["rollable", "skill"]),
		sl: C(e.system, [["rollable", "SL"]], !0),
		specification: ZT(e.system, ["specification", "value"])
	};
}
function JT(e) {
	return XT(e.system);
}
function YT(e) {
	return XT(e.system);
}
function XT(e) {
	return C(e, [["disabled"], ["disabled", "value"]]);
}
function ZT(e, t) {
	let n = v(e, t);
	return typeof n == "string" ? n.trim() : typeof n == "number" ? String(n) : "";
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/apply.ts
async function QT(e, t) {
	let n = MT();
	for (let r of t) {
		let t = r.source === "base" ? Cw(e, r.sourceUuid, r.name) : xw(e, r.name, "trait");
		if (r.ignored) {
			t && n.deletes.push(t.id);
			continue;
		}
		if (t) {
			n.updates.push(KT(t.id, r.config));
			continue;
		}
		let i = bw(r.sourceUuid ? await $T(r.sourceUuid) : await Ew(r.name, ["trait"]), r.name, "trait");
		i.type = "trait", T(i, ["system", "disabled"], !1), GT(i, r.config), n.creates.push(i);
	}
	await NT(e, n);
}
async function $T(e) {
	let t = await fromUuid(e);
	return Xe(t) ? t : null;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/actor-traits.ts
function eE(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && !JT(e)).map(rE) ?? [];
}
function tE(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && JT(e)).map(rE) ?? [];
}
function nE(e) {
	Array.isArray(e.items) && (e.items = e.items.filter((e) => {
		if (typeof e != "object" || !e) return !0;
		let t = e;
		return t.type !== "trait" || !YT(t);
	}));
}
function rE(e) {
	return {
		config: qT(e),
		img: e.img ?? "",
		name: e.name,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/difficulty-options.ts
var iE = [
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
async function aE() {
	let e = v(game.wfrp4e?.config, ["difficultyLabels"]);
	if (!_(e)) return iE;
	let t = Object.entries(e).filter((e) => {
		let [t, n] = e;
		return !!t.trim() && typeof n == "string";
	}).map(([e, t]) => ({
		label: t,
		value: e
	}));
	return t.length ? t : iE;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/drops.ts
async function oE(e) {
	let t = jT(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Trait item here.");
	let n = $e(await fromUuid(t.uuid), "trait", "Drop a Foundry Trait item here.");
	return {
		config: qT(n),
		ignored: !1,
		key: `custom:${n.uuid}`,
		name: n.name,
		source: "custom",
		sourceUuid: n.uuid
	};
}
//#endregion
//#region src/module/apps/npc-builder/functions/recommended-quick-traits.ts
var sE = [
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
//#region src/module/wfrp/npc-builder/foundry-bridge/folders.ts
async function cE(e) {
	return hE(await mE(e, "Actor"));
}
async function lE(e) {
	return hE(await mE(e, "Item"));
}
function uE() {
	return game.folders.contents.filter((e) => e.type === "Actor").map(hE).sort((e, t) => e.name.localeCompare(t.name));
}
function dE() {
	return game.folders.contents.filter((e) => e.type === "Item").map(hE).sort((e, t) => e.name.localeCompare(t.name));
}
function fE(e) {
	return e ? game.folders.contents.find((t) => t.uuid === e) ?? null : null;
}
function pE(e) {
	let t = fE(e);
	return t?.type === "Item" ? t : null;
}
async function mE(e, t) {
	let n = e.trim();
	if (!n) throw Error("Enter a folder name first.");
	let r = game.folders.contents.find((e) => e.type === t && gE(e.name, n));
	if (r) return r;
	let i = await Folder.create({
		name: n,
		type: t
	});
	if (!i) throw Error("Foundry did not create the folder.");
	return i;
}
function hE(e) {
	return {
		name: e.name,
		uuid: e.uuid
	};
}
function gE(e, t) {
	return e.trim().toLocaleLowerCase() === t.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/quick-traits.ts
async function _E(e) {
	let t = pE(e.quickTraitFolderUuid);
	if (!t) throw Error("Choose a Quick Traits item folder before importing traits.");
	let n = new Set(bE(e).map((e) => e.name.trim().toLocaleLowerCase()));
	for (let e of sE) {
		if (n.has(e.trim().toLocaleLowerCase())) continue;
		let r = bw(await Ew(e, ["trait"]), e, "trait");
		r.folder = t.id, r.type = "trait", await Item.create(r);
	}
	return ui.notifications?.info("Imported recommended quick traits."), await vE(e);
}
async function vE(e) {
	return bE(e).map(xE).sort((e, t) => e.name.localeCompare(t.name));
}
function yE(e, t) {
	return t.quickTraitFolderUuid ? e.folder?.uuid === t.quickTraitFolderUuid : !1;
}
function bE(e) {
	return game.items?.contents.filter((t) => t.type === "trait" && yE(t, e)) ?? [];
}
function xE(e) {
	return {
		config: qT(e),
		img: e.img ?? "",
		name: e.name,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/trappings.ts
var SE = [
	"ammunition",
	"armour",
	"container",
	"money",
	"trapping",
	"weapon"
];
async function CE(e, t) {
	let n = MT();
	for (let r of t) {
		let t = r.source === "base" ? Cw(e, r.sourceUuid, r.name) : null;
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
		let i = await kE(r), a = r.resolution.selectedItemType || r.itemType || "trapping", o = bw(i, r.resolution.selectedName || r.name, a);
		o.type = a || o.type || "trapping", T(o, [
			"system",
			"quantity",
			"value"
		], r.quantity), n.creates.push(o);
	}
	await NT(e, n);
}
async function wE(e) {
	return up(e, await AE());
}
async function TE(e) {
	let t = jT(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Item here.");
	let n = Qe(await fromUuid(t.uuid), "Drop a Foundry Item here.");
	return {
		ignored: !1,
		itemType: n.type,
		key: `custom:${n.uuid}`,
		name: n.name,
		quantity: DE(n),
		resolution: cp({
			itemType: n.type,
			name: n.name,
			uuid: n.uuid
		}),
		source: "custom",
		sourceUuid: n.uuid
	};
}
function EE(e) {
	let t = OE();
	return e.items?.contents.filter((e) => t.includes(e.type)).map((e) => ({
		itemType: e.type,
		name: e.name,
		quantity: DE(e),
		uuid: e.uuid
	})) ?? [];
}
function DE(e) {
	return x(e.system, [["quantity", "value"], ["quantity"]]) || 1;
}
function OE() {
	let e = b(game.wfrp4e?.config, ["trappingItems"]);
	return e.length ? e : SE;
}
async function kE(e) {
	if (e.sourceUuid) {
		let t = await fromUuid(e.sourceUuid);
		return Xe(t) ? t : null;
	}
	if (e.resolution.selectedCandidateUuid) {
		let t = await fromUuid(e.resolution.selectedCandidateUuid);
		return Xe(t) ? t : null;
	}
	return e.resolution.status === "fallback" ? null : await Ew(e.resolution.selectedName || e.name, OE());
}
async function AE() {
	let e = [], t = OE();
	for (let n of game.items?.contents ?? []) t.includes(n.type) && e.push(ME(n, "World"));
	for (let n of game.packs ?? []) {
		if (!FC(n)) continue;
		let r = await jE(n, t);
		if (r.length) {
			e.push(...r);
			continue;
		}
		if (!n.getDocuments) continue;
		let i = await n.getDocuments();
		for (let r of i) Xe(r) && t.includes(r.type) && e.push(ME(r, n.title ?? "Compendium"));
	}
	return e;
}
async function jE(e, t) {
	return e.getIndex ? LC(await e.getIndex({ fields: ["name", "type"] })).filter((n) => !!(n.name && n.type && PC(e, n) && t.includes(n.type))).map((t) => ({
		itemType: t.type ?? "trapping",
		name: t.name ?? "",
		sourceLabel: e.title ?? "Compendium",
		uuid: PC(e, t)
	})) : [];
}
function ME(e, t) {
	return {
		itemType: e.type,
		name: e.name,
		sourceLabel: t,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/actors.ts
function NE(e) {
	return game.actors.contents.filter((t) => zE(t, e)).map(IE);
}
async function PE(e) {
	let t = Ze(await fromUuid(e));
	return {
		advancements: [
			...LT(t),
			...RT(t, "skill"),
			...RT(t, "talent")
		],
		optionalTraits: tE(t),
		traits: eE(t),
		trappings: EE(t)
	};
}
async function FE(e) {
	let t = jT(e);
	if (t.type !== "Actor") throw Error("Drop a Foundry Actor here.");
	let n = null;
	return t.uuid ? n = await fromUuid(t.uuid) : t.id && (n = game.actors.get(t.id)), IE(Ze(n));
}
function IE(e) {
	return {
		img: e.img ?? "",
		name: e.name,
		prototypeTokenImg: RE(e),
		species: LE(e),
		type: e.type,
		uuid: e.uuid
	};
}
function LE(e) {
	return y(e.system, [
		"details",
		"species",
		"value"
	]) || y(e.system, ["details", "species"]) || y(e.system, [
		"details",
		"race",
		"value"
	]) || y(e.system, [
		"details",
		"ancestry",
		"value"
	]);
}
function RE(e) {
	return y(e, [
		"prototypeToken",
		"texture",
		"src"
	]) || y(e.toObject(), [
		"prototypeToken",
		"texture",
		"src"
	]);
}
function zE(e, t) {
	return t.baseActorFolderUuid ? e.folder?.uuid === t.baseActorFolderUuid : !0;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/careers.ts
async function BE(e) {
	let t = jT(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a WFRP Career item here.");
	return VC($e(await fromUuid(t.uuid), "career", "Drop a WFRP Career item here."));
}
async function VE(e) {
	let t = [];
	for (let n of e) {
		let e = $e(await fromUuid(n.uuid), "career", `Career “${n.name}” is no longer available.`);
		for (let r = 0; r < Au(n.quantity); r += 1) {
			let n = e.toObject();
			delete n._id, T(n, [
				"system",
				"complete",
				"value"
			], !0), T(n, [
				"system",
				"current",
				"value"
			], !1), t.push(n);
		}
	}
	return t;
}
async function HE(e, t) {
	t.length && await e.createEmbeddedDocuments("Item", t);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/constants.ts
var UE = "spell", WE = new Set(jf), GE = new Set(Mf);
async function KE() {
	return qE().map((e) => ({
		category: Lf(e.key),
		key: e.key,
		label: e.name,
		value: e.name,
		wind: e.wind
	})).sort((e, t) => e.category === t.category ? e.label.localeCompare(t.label) : e.category.localeCompare(t.category));
}
function qE() {
	let e = v(game.wfrp4e?.config, ["magicLores"]), t = v(game.wfrp4e?.config, ["magicWind"]), n = [];
	if (!_(e)) return [ZE()];
	for (let [r, i] of Object.entries(e)) {
		let e = iD(i) || r, a = rD(t, r);
		n.push({
			key: r,
			matchTerms: nD(r, e, a),
			name: e,
			wind: a
		});
	}
	return n.some((e) => e.key === "petty") || n.push(ZE()), n;
}
function JE(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		if (r.isAmbiguous) continue;
		if (r.kind === "petty-magic") {
			let e = tD("petty magic", t);
			e && n.set(e.key, e);
			continue;
		}
		let e = tD(r.rawLore, t);
		e && n.set(e.key, e);
	}
	return [...n.values()];
}
function YE(e, t) {
	let n = [...XE(e.system), eD(e.name)].filter(Boolean);
	for (let e of n) {
		let n = $E(e, t);
		if (n) return n;
		let r = tD(e, t);
		if (r) return r;
	}
	return null;
}
function XE(e) {
	return [
		...w(v(e, ["lore", "value"])),
		...w(v(e, ["lore"])),
		...w(v(e, ["magicLore", "value"])),
		...w(v(e, ["magicLore"])),
		...w(v(e, ["category", "value"])),
		...w(v(e, [
			"system",
			"lore",
			"value"
		])),
		...w(v(e, ["system", "lore"])),
		...w(v(e, ["system.lore.value"])),
		...w(v(e, ["system.lore"]))
	];
}
function ZE() {
	return {
		key: "petty",
		matchTerms: ["petty", "petty magic"],
		name: "Petty Magic",
		wind: ""
	};
}
function QE(e) {
	let t = e.trim() || "Unknown Lore";
	return {
		key: Pf(t) || "unknown",
		matchTerms: [t],
		name: t,
		wind: ""
	};
}
function $E(e, t) {
	let n = Pf(e);
	return n === "lore" ? t.find((e) => e.key !== "petty") ?? null : n === "the eight winds" || n === "eight winds" ? t.find((e) => WE.has(e.key)) ?? null : n === "dark lore" ? t.find((e) => GE.has(e.key)) ?? null : null;
}
function eD(e) {
	return /\(([^)]+)\)\s*$/.exec(e)?.[1]?.trim() ?? "";
}
function tD(e, t) {
	let n = Pf(e);
	return n ? t.find((e) => e.matchTerms.some((e) => Pf(e) === n)) ?? null : null;
}
function nD(e, t, n) {
	let r = /* @__PURE__ */ new Set(), i = Pf(e), a = Pf(t);
	for (let i of [
		e,
		t,
		n
	]) i.trim() && r.add(i.trim());
	return (i === "petty" || a === "petty") && r.add("Petty Magic"), (i === "shadow" || a === "shadow") && r.add("Shadows"), t && !/^lore of /i.test(t) && r.add(`Lore of ${t}`), [...r];
}
function rD(e, t) {
	return _(e) ? iD(e[t]) : "";
}
function iD(e) {
	return typeof e == "string" ? e.trim() : _(e) ? y(e, ["name"]) || y(e, ["label"]) || y(e, ["value"]) : "";
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/debug.ts
var aD = "[Drowsy's WFRP4e Customizers][Spell Lookup]";
function oD(e, t) {
	if (t) {
		An(`${aD} ${e}`, t);
		return;
	}
	An(`${aD} ${e}`);
}
function sD(e, t) {
	jn(`${aD} ${e}`, t);
}
function cD(e) {
	return [
		e.title ?? "",
		e.collection ?? "",
		y(e, ["metadata", "type"]),
		y(e, ["metadata", "documentName"]),
		e.documentName
	].filter(Boolean).join(" | ");
}
function lD(e) {
	return {
		loreTerms: XE(e.system),
		name: e.name,
		sourceLabel: e.sourceLabel,
		uuid: e.uuid
	};
}
function uD(e) {
	return typeof e == "string" ? {
		kind: "uuid-string",
		value: e
	} : _(e) ? {
		documentName: y(e, ["documentName"]),
		hasSystem: _(v(e, ["system"])),
		loreTerms: XE(v(e, ["system"])),
		name: y(e, ["name"]),
		type: y(e, ["type"]),
		uuid: y(e, ["uuid"])
	} : { kind: typeof e };
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/spell-input-conversion.ts
function dD(e, t) {
	return {
		img: e.img ?? "",
		name: e.name,
		sourceLabel: t,
		system: e.system,
		uuid: e.uuid
	};
}
function fD(e) {
	return /^item\./i.test(e.uuid) ? "World" : pD(e.uuid, "WFRP Item Lookup");
}
function pD(e, t) {
	let n = /^Compendium\.([^.]+\.[^.]+)\./.exec(e)?.[1];
	return n ? [...game.packs ?? []].find((e) => e.collection === n)?.title ?? n : t;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/compendium-spell-inputs.ts
async function mD(e) {
	if (oD("Compendium index scan start", { pack: cD(e) }), !e.getIndex) return oD("Compendium has no index; loading documents", { pack: cD(e) }), await _D(e);
	let t = LC(await e.getIndex({ fields: [
		"name",
		"type",
		"img",
		"system.lore.value"
	] }));
	if (oD("Compendium index loaded", {
		entries: t.length,
		pack: cD(e),
		samples: t.slice(0, 5).map((t) => ({
			hasLoreTerms: XE(t).length > 0,
			name: t.name,
			type: t.type,
			uuid: PC(e, t)
		}))
	}), !t.length) return oD("Compendium index empty; loading documents", { pack: cD(e) }), await _D(e);
	let n = t.filter(gD);
	oD("Compendium index spell candidates", {
		pack: cD(e),
		spellEntries: n.length
	});
	let r = n.filter((e) => e.name).map((t) => yD(e, t));
	return r.length || !vD(e) ? r : await _D(e);
}
function hD(e) {
	return FC(e);
}
function gD(e) {
	return e.type === "spell" ? !0 : !!(e.name && (XE(e).length || eD(e.name)));
}
async function _D(e) {
	if (!e.getDocuments) return oD("Compendium has no document loader", { pack: cD(e) }), [];
	oD("Compendium document load start", { pack: cD(e) });
	let t = await e.getDocuments(), n = t.filter((e) => Xe(e) && e.type === "spell");
	return oD("Compendium document load complete", {
		documents: t.length,
		pack: cD(e),
		spellDocuments: n.length,
		spellSamples: n.slice(0, 5).map((e) => ({
			loreTerms: XE(e.system),
			name: e.name,
			uuid: e.uuid
		}))
	}), n.map((t) => dD(t, e.title ?? "Compendium"));
}
function vD(e) {
	return e.collection === "wfrp4e-core.items" || e.collection === "wfrp4e-wom.items";
}
function yD(e, t) {
	return {
		img: t.img ?? t.thumb ?? "",
		name: t.name ?? "",
		sourceLabel: e.title ?? "Compendium",
		system: t,
		uuid: PC(e, t)
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/warhammer-spell-inputs.ts
async function bD() {
	let e = SD();
	if (!e) return oD("WFRP helper unavailable"), [];
	try {
		let t = await e.findAllItems(UE, "Loading Spells", !0, ["system.lore.value"]);
		return oD("WFRP helper raw result", {
			count: t.length,
			samples: t.slice(0, 10).map(uD)
		}), (await Promise.all(t.map((e) => xD(e)))).filter((e) => e !== null);
	} catch (e) {
		return sD("WFRP helper lookup failed.", e), [];
	}
}
async function xD(e) {
	if (typeof e == "string") {
		let t = await fromUuid(e);
		return Xe(t) && t.type === "spell" ? dD(t, fD(t)) : null;
	}
	if (Xe(e)) return e.type === "spell" ? dD(e, fD(e)) : null;
	if (y(e, ["type"]) !== "spell") return null;
	let t = y(e, ["name"]);
	return t ? {
		img: y(e, ["img"]) || y(e, ["thumb"]),
		name: t,
		sourceLabel: pD(y(e, ["uuid"]), "WFRP Item Lookup"),
		system: v(e, ["system"]),
		uuid: y(e, ["uuid"])
	} : null;
}
function SD() {
	let e = v(globalThis, [
		"warhammer",
		"utility",
		"findAllItems"
	]);
	return typeof e == "function" ? { findAllItems: e } : null;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/spell-resolution-inputs.ts
async function CD() {
	let e = [], t = [...game.packs ?? []];
	oD("Candidate lookup start", {
		itemPacks: t.filter(hD).length,
		totalPacks: t.length,
		warhammerUtilityAvailable: !!ED(),
		worldItems: game.items?.contents.length ?? 0
	});
	let n = await bD();
	oD("WFRP helper lookup complete", {
		utilityInputs: n.length,
		utilitySamples: n.slice(0, 10).map(lD)
	}), e.push(...n), e.push(...wD()), oD("World spell scan complete", { worldSpellCount: e.filter((e) => e.sourceLabel === "World").length });
	for (let n of t) if (hD(n)) try {
		let t = await mD(n);
		e.push(...t), oD("Compendium spell scan complete", {
			inputCount: t.length,
			pack: cD(n),
			samples: t.slice(0, 5).map(lD)
		});
	} catch (e) {
		jn(`wfrp4e-customizer-apps | Spell lookup skipped compendium "${n.title ?? n.collection ?? "unknown"}".`, e);
	}
	let r = TD(e);
	return oD("Candidate lookup complete", {
		rawInputCount: e.length,
		uniqueInputCount: r.length
	}), r;
}
function wD() {
	let e = [];
	for (let t of game.items?.contents ?? []) t.type === "spell" && e.push(dD(t, "World"));
	return e;
}
function TD(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.uuid || n.name.trim().toLocaleLowerCase();
		t.has(e) || t.set(e, n);
	}
	return [...t.values()];
}
function ED() {
	return v(globalThis, [
		"warhammer",
		"utility",
		"findAllItems"
	]);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/index.ts
async function DD(e, t) {
	let n = [];
	for (let r of t) {
		if (!r.selected || xw(e, r.name, "spell")) continue;
		let t = bw(r.sourceUuid ? await AD(r.sourceUuid) : null, r.name, UE);
		t.type = UE, n.push(t);
	}
	n.length && await e.createEmbeddedDocuments("Item", n);
}
async function OD(e) {
	let t = JE(e, qE());
	if (oD("Grant resolution start", {
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
	let n = await CD(), r = /* @__PURE__ */ new Map(), i = [];
	for (let e of n) {
		let n = YE(e, t);
		if (!n) {
			i.length < 20 && i.push({
				loreTerms: XE(e.system),
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
	return oD("Grant resolution complete", {
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
async function kD(e) {
	let t = jT(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Spell item here.");
	let n = $e(await fromUuid(t.uuid), UE, "Drop a Foundry Spell item here."), r = YE(dD(n, "Dropped"), [...qE(), ZE()]) ?? QE(XE(n.system)[0] ?? "");
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
async function AD(e) {
	let t = await fromUuid(e);
	return Xe(t) && t.type === "spell" ? t : null;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/mounts/trait-sources.ts
var jD = "generatedMountTrait";
function MD(t, n) {
	return n.traits.flatMap((n) => {
		if (!n.included || X_(n.name)) return [];
		let r = ND(t, n);
		if (!r) return [];
		let i = r.toObject();
		return delete i._id, i.name = n.outputName, T(i, ["system", "disabled"], !1), T(i, [
			"flags",
			e,
			jD
		], {
			mountUuid: t.uuid,
			sourceTraitUuid: n.sourceUuid
		}), n.fixedDamage !== null && PD(i, n.fixedDamage), [i];
	});
}
function ND(e, t) {
	return e.items?.contents.find((e) => e.type === "trait" && e.uuid === t.sourceUuid) ?? null;
}
function PD(e, t) {
	T(e, [
		"system",
		"specification",
		"value"
	], String(t)), T(e, [
		"system",
		"rollable",
		"bonusCharacteristic"
	], ""), T(e, [
		"system",
		"rollable",
		"rollCharacteristic"
	], "ws"), T(e, [
		"system",
		"rollable",
		"skill"
	], "");
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/mounts/armour.ts
async function FD(e, t, n, r) {
	let i = e.items?.contents.filter(RD) ?? [], a = r.traits.filter((e) => e.included && X_(e.name)), o = ID(i), s = LD(n, a), c = Math.max(o.value, s.value) + 1;
	if (o.item && e.updateEmbeddedDocuments) {
		await e.updateEmbeddedDocuments("Item", [{
			_id: o.item.id,
			"system.specification.value": String(c)
		}]);
		return;
	}
	let l = bw((s.contribution ? ND(t, s.contribution) : null) ?? await Ew("Armour", ["trait"]), "Armour", "trait");
	l.name = "Armour", l.type = "trait", T(l, ["system", "disabled"], !1), T(l, [
		"system",
		"specification",
		"value"
	], String(c)), await e.createEmbeddedDocuments("Item", [l]);
}
function ID(e) {
	return e.reduce((e, t) => {
		let n = x(t.system, [["specification", "value"]]);
		return n > e.value ? {
			item: t,
			value: n
		} : e;
	}, {
		item: null,
		value: 0
	});
}
function LD(e, t) {
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
function RD(e) {
	return e.type === "trait" && X_(e.name);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/mounts/profile.ts
var zD = new Set(Object.values(q_));
async function BD(e) {
	return VD(Ze(await fromUuid(e)));
}
function VD(e) {
	return {
		characteristics: {
			initiative: GD(e, "i"),
			strength: GD(e, "s"),
			strengthBonus: KD(e, "s"),
			toughness: GD(e, "t")
		},
		img: e.img ?? "",
		movement: x(e.system, [[
			"details",
			"move",
			"value"
		]]),
		name: e.name,
		size: qD(e),
		traits: HD(e),
		uuid: e.uuid,
		wounds: x(e.system, [[
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
function HD(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && !JD(e)).map((t) => UD(e, t)).sort((e, t) => e.name.localeCompare(t.name)) ?? [];
}
function UD(e, t) {
	let n = C(t.system, [["rollable", "damage"]]), r = y(t.system, ["specification", "value"]);
	return {
		damage: n,
		fixedDamage: n ? WD(e, t, r) : null,
		name: t.name,
		specification: r,
		uuid: t.uuid
	};
}
function WD(e, t, n) {
	let r = S(t, [["Damage"]]);
	if (r !== null) return r;
	let i = Number(n), a = y(t.system, ["rollable", "bonusCharacteristic"]);
	return (Number.isFinite(i) ? i : 0) + (a ? KD(e, a) : 0);
}
function GD(e, t) {
	return x(e.system, [[
		"characteristics",
		t,
		"value"
	], [
		"characteristics",
		t,
		"initial"
	]]);
}
function KD(e, t) {
	return S(e.system, [[
		"characteristics",
		t,
		"bonus"
	]]) ?? Math.floor(GD(e, t) / 10);
}
function qD(e) {
	let t = y(e.system, [
		"details",
		"size",
		"value"
	]);
	return zD.has(t) ? t : q_.Average;
}
function JD(e) {
	return C(e.system, [["disabled"], ["disabled", "value"]]);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/mounts/apply.ts
var YD = {
	avg: 1,
	enor: 3,
	lrg: 2,
	ltl: .5,
	mnst: 4,
	sml: .8,
	tiny: .3
};
async function XD(t, n) {
	let r = Ze(await fromUuid(n));
	if (t.uuid === r.uuid) throw Error("The rider and mount must be different Actors.");
	let i = VD(t), a = VD(r), o = ov(i, a);
	await t.update(ZD(t, o));
	let s = MD(r, o);
	s.length && await t.createEmbeddedDocuments("Item", s), await FD(t, r, a, o), await t.createEmbeddedDocuments("Item", [uv({
		flagScope: e,
		mount: a,
		plan: o,
		rider: i
	})]), await t.update({
		"system.status.wounds.max": o.wounds,
		"system.status.wounds.value": o.wounds
	});
}
function ZD(e, t) {
	let n = YD[t.size] ?? 1;
	return {
		"prototypeToken.height": n,
		"prototypeToken.width": n,
		"system.characteristics.i.modifier": QD(e, "i") + t.initiative - $D(e, "i"),
		"system.characteristics.t.modifier": QD(e, "t") + t.toughness - $D(e, "t"),
		"system.details.move.value": t.movement
	};
}
function QD(e, t) {
	return x(e.system, [[
		"characteristics",
		t,
		"modifier"
	]]);
}
function $D(e, t) {
	return x(e.system, [[
		"characteristics",
		t,
		"value"
	]]);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/mounts/actors.ts
function eO() {
	return game.actors.contents.map(IE).sort((e, t) => e.name.localeCompare(t.name));
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/build-npc.ts
async function tO(e) {
	if (e.mountActorUuid && e.mountActorUuid === e.baseActorUuid) throw Error("The rider and mount must be different Actors.");
	let t = await VE(e.careers), n = await rO(e);
	if (!n) throw Error("Foundry did not create the NPC Actor.");
	let r = iO(e), i = e.careers.at(-1), a = {
		name: r,
		"prototypeToken.name": r
	}, o = y(n.system, [
		"details",
		"gmnotes",
		"value"
	]), s = nO(o);
	s !== o && (a["system.details.gmnotes.value"] = s);
	let c = e.portraitPath || i?.img || "";
	return c && (a.img = c, a["prototypeToken.texture.src"] = c), await n.update(a), await HE(n, t), await FT(n, e.advancements), await QT(n, e.traits), e.mountActorUuid && await XD(n, e.mountActorUuid), await CE(n, e.trappings), await DD(n, e.spells), n.sheet?.render(!0), ui.notifications?.info(`Created NPC "${r}".`), {
		name: r,
		uuid: n.uuid
	};
}
function nO(e) {
	return e.replaceAll(/(?:<hr\s*\/?>)?<section data-wfrp-customizer-npc-xp="true">[\S\s]*?<\/section>/g, "").trim();
}
async function rO(e) {
	let t = Ze(await fromUuid(e.baseActorUuid)).toObject(), n = fE(e.settings.outputActorFolderUuid);
	return delete t._id, delete t.folder, t.type = "npc", nE(t), n && (t.folder = n.id), await Actor.create(t);
}
function iO(e) {
	if (!e.settings.includeSpeciesInName) return e.actorName;
	let t = game.actors.contents.find((t) => t.uuid === e.baseActorUuid), n = t ? LE(t) : "";
	return !n || e.actorName.toLocaleLowerCase().includes(n.toLocaleLowerCase()) ? e.actorName : `${n} ${e.actorName}`;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/document-drops.ts
async function aO(e) {
	let t = jT(e);
	if (t.type === "Actor") return {
		actor: await FE(e),
		kind: "actor"
	};
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Actor or WFRP Item.");
	let n = Qe(await fromUuid(t.uuid), "Drop a Foundry Item.");
	if (n.type === "career") return {
		career: await BE(e),
		kind: "career"
	};
	if (n.type === "skill" || n.type === "talent") return {
		advancement: IT(n),
		kind: "advancement"
	};
	if (n.type === "trait") return {
		kind: "trait",
		trait: await oE(e)
	};
	if (n.type === "spell") return {
		kind: "spell",
		spell: await kD(e)
	};
	if (OE().includes(n.type)) return {
		kind: "trapping",
		trapping: await TE(e)
	};
	throw Error("Drop an Actor, Career, Skill, Talent, Trait, Trapping, or Spell Item.");
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/index.ts
var oO = {
	buildNpc: tO,
	ensureActorFolder: cE,
	ensureItemFolder: lE,
	findLowerCareerCandidates: JC,
	filterPortraitCandidates: lT,
	getPortraitSearchAvailability: async () => Gw(),
	importRecommendedQuickTraits: _E,
	listActorFolders: async () => uE(),
	listBaseActors: async (e) => NE(e),
	listFoundryPortraitCandidates: gT,
	listMagicLoreOptions: KE,
	listMountActors: async () => eO(),
	listSpellsForMagicGrants: OD,
	listItemFolders: async () => dE(),
	listQuickTraits: vE,
	listSkillCharacteristics: uw,
	listSkillSpecializations: lw,
	listTalentMaximums: Dw,
	listTraitDifficultyOptions: aE,
	loadBaseActorDraftData: PE,
	loadActorCombatProfile: BD,
	loadSettings: async () => kT(),
	resolveActorDrop: FE,
	resolveApplicationDrop: aO,
	resolveCareerDrop: BE,
	resolveSpellDrop: kD,
	resolveTraitDrop: oE,
	resolveTrapping: wE,
	resolveTrappingDrop: TE,
	saveSettings: AT
}, sO = class extends EC {
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${e}-npc-builder`,
		classes: [e, "wfrp4e-customizer-npc-builder"],
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
		return dC;
	}
	getVueProps() {
		return { bridge: oO };
	}
}, cO = "wfrp4e-customizer-open-npc-builder";
function lO() {
	Hooks.on("renderActorDirectory", (e, t) => {
		let n = pO(t);
		n && uO(n);
	});
}
function uO(e) {
	let t = fO(e);
	if (!t) {
		jn("wfrp4e-customizer-apps | Could not find Actor Directory button container.");
		return;
	}
	dO(e, t);
}
function dO(e, t) {
	if (e.querySelector(`.${cO}`)) return;
	let n = document.createElement("button");
	n.classList.add(cO, "wfrp4e-customizer-actor-directory-button"), n.type = "button", n.innerHTML = "<i class=\"fa-solid fa-user-plus\" inert></i><span>NPC Builder App</span>", n.addEventListener("click", () => {
		new sO().render(!0);
	}), t.append(n);
}
function fO(e) {
	return e.querySelector(".directory-header .header-actions") ?? e.querySelector(".directory-header .action-buttons") ?? e.querySelector(".header-actions") ?? e.querySelector(".action-buttons");
}
function pO(e) {
	return e instanceof HTMLElement ? e : mO(e) && e[0] instanceof HTMLElement ? e[0] : null;
}
function mO(e) {
	return typeof e == "object" && !!e && "length" in e;
}
//#endregion
//#region src/module/apps/actor-portrait-gallery/view/ActorPortraitGalleryApp.vue?vue&type=script&setup=true&lang.ts
var hO = { class: "app:flex app:h-full app:min-h-0 app:flex-col" }, gO = { class: "dui-navbar app:sticky app:top-0 app:z-10 app:min-h-0 app:gap-2 app:bg-base-100 app:px-3 app:py-2 app:shadow-sm" }, _O = { class: "dui-navbar-start app:min-w-0 app:flex-1 app:gap-2" }, vO = { class: "app:m-0 app:truncate app:text-lg app:font-semibold" }, yO = {
	key: 0,
	class: "dui-badge dui-badge-success dui-badge-sm"
}, bO = { class: "dui-navbar-end app:w-auto app:gap-2" }, xO = ["alt", "src"], SO = ["disabled"], CO = {
	key: 0,
	"aria-hidden": "true",
	class: "fa-solid fa-spinner fa-spin"
}, wO = {
	key: 1,
	"aria-hidden": "true",
	class: "fa-solid fa-layer-group"
}, TO = ["disabled"], EO = ["disabled"], DO = ["disabled"], OO = { class: "app:min-h-0 app:flex-1 app:p-2" }, kO = /* @__PURE__ */ U({
	__name: "ActorPortraitGalleryApp",
	props: {
		bridge: {},
		context: {}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ B(""), r = /* @__PURE__ */ B(""), i = /* @__PURE__ */ B(null), a = /* @__PURE__ */ B(null), o = /* @__PURE__ */ B(t.context.selectedPortraitPath), s = /* @__PURE__ */ B(t.context.currentPortraitPath), c = /* @__PURE__ */ B(t.context.currentTokenPath), l = null, u = null, d = Tf(), f = z_({
			activePortraitPath: o,
			baseSearchTerms: /* @__PURE__ */ B([...t.context.searchTerms]),
			errorMessage: n,
			excludeFullyTransparentImages: /* @__PURE__ */ B(t.context.excludeFullyTransparentImages),
			excludedReferenceImagePaths: /* @__PURE__ */ B([...t.context.excludedReferenceImagePaths]),
			filterState: d,
			hasSubject: /* @__PURE__ */ B(!0),
			immediateCandidates: /* @__PURE__ */ B([...t.context.immediateCandidates]),
			includeCompendiumAssets: /* @__PURE__ */ B(t.context.includeCompendiumAssets),
			includeFilePickerAssets: /* @__PURE__ */ B(t.context.includeFilePickerAssets),
			pinnedPortraitPath: o,
			priorityFolderPaths: /* @__PURE__ */ B([...t.context.priorityFolderPaths]),
			provider: t.bridge,
			searchErrorMessage: "The portrait gallery could not finish searching Foundry images.",
			selectPortrait: _
		}), p = $(() => !!o.value && o.value !== s.value), m = $(() => !!o.value && o.value !== c.value), h = $(() => p.value || m.value), g = $(() => f.selectedPortraitCandidate.value?.label ?? "Selected portrait");
		Ka(o, () => {
			n.value = "", r.value = "";
		}), yo(E);
		function _(e) {
			o.value = e.img;
		}
		async function v(e) {
			if (!(!o.value || i.value || !b(e))) {
				T(), i.value = e, n.value = "", r.value = "";
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
			T(), v(e);
		}
		function b(e) {
			return e === "portrait" ? p.value : e === "token" ? m.value : h.value;
		}
		function x(e) {
			return e === "portrait" ? "Portrait updated." : e === "token" ? "Prototype token updated." : "Portrait and token updated.";
		}
		function S() {
			E(), l = window.setTimeout(w, 650);
		}
		function C() {
			E(), u = window.setTimeout(T, 180);
		}
		function w() {
			E(), a.value && !a.value.matches(":popover-open") && a.value.showPopover();
		}
		function T() {
			E(), a.value?.matches(":popover-open") && a.value.hidePopover();
		}
		function E() {
			l !== null && (window.clearTimeout(l), l = null), u !== null && (window.clearTimeout(u), u = null);
		}
		return (t, s) => (K(), q("section", hO, [Y("header", gO, [Y("div", _O, [Y("h1", vO, L(e.context.actorName), 1), r.value ? (K(), q("span", yO, L(r.value), 1)) : Q("", !0)]), Y("div", bO, [
			o.value ? (K(), q("img", {
				key: 0,
				alt: `${g.value} preview`,
				class: "app:aspect-square app:w-10 app:rounded-box app:bg-base-300 app:object-cover",
				height: "40",
				src: o.value,
				width: "40"
			}, null, 8, xO)) : Q("", !0),
			Y("div", {
				class: "dui-join",
				onFocusin: w,
				onFocusout: C,
				onPointerenter: S,
				onPointerleave: C
			}, [Y("button", {
				class: "dui-btn dui-btn-primary dui-btn-sm dui-join-item",
				disabled: !h.value || !!i.value,
				type: "button",
				onClick: s[0] ||= (e) => v("both")
			}, [i.value === "both" ? (K(), q("i", CO)) : (K(), q("i", wO)), Z(" " + L(i.value === "both" ? "Applying..." : "Apply to Both"), 1)], 8, SO), Y("button", {
				"aria-label": "More apply options",
				class: "dui-btn dui-btn-primary dui-btn-sm dui-btn-square dui-join-item",
				disabled: !o.value || !!i.value,
				popovertarget: "actor-portrait-apply-menu",
				style: { "anchor-name": "--actor-portrait-apply-menu" },
				type: "button"
			}, [...s[3] ||= [Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-chevron-down"
			}, null, -1)]], 8, TO)], 32),
			Y("ul", {
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
			}, [Y("li", null, [Y("button", {
				disabled: !p.value || !!i.value,
				type: "button",
				onClick: s[1] ||= (e) => y("portrait")
			}, [...s[4] ||= [Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-image"
			}, null, -1), Z(" Portrait only ", -1)]], 8, EO)]), Y("li", null, [Y("button", {
				disabled: !m.value || !!i.value,
				type: "button",
				onClick: s[2] ||= (e) => y("token")
			}, [...s[5] ||= [Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-circle"
			}, null, -1), Z(" Token only ", -1)]], 8, DO)])], 544)
		])]), Y("main", OO, [X(p_, {
			class: "app:h-full",
			"empty-message": "No portrait or token images are available for this Actor yet.",
			"error-message": n.value,
			"fill-height": "",
			"is-loading": V(f).isLoadingPortraitCandidates.value,
			options: V(f).portraitCandidates.value,
			"progress-label": V(f).portraitSearchProgressLabel.value,
			"progress-value": V(f).portraitSearchProgressValue.value,
			"search-terms": V(f).portraitSearchTerms.value,
			"selected-option-key": V(f).selectedPortraitCandidateKey.value,
			tags: V(f).portraitFilterTags.value,
			onCreateSearchTerm: V(f).addPortraitSearchTerm,
			onFilterTagSectionChange: V(f).setPortraitFilterTagSection,
			onSelectPortrait: V(f).selectPortrait
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
}), AO = {
	applyActorPortrait: jO,
	filterPortraitCandidates: lT,
	listPortraitCandidates: gT
};
async function jO(e, t, n) {
	await Ze(await fromUuid(e), "The Actor for this portrait gallery is no longer available.").update(MO(t, n));
}
function MO(e, t) {
	return t === "portrait" ? { img: e } : t === "token" ? { "prototypeToken.texture.src": e } : {
		img: e,
		"prototypeToken.texture.src": e
	};
}
//#endregion
//#region src/module/wfrp/actor-portrait-gallery/context.ts
function NO(e, t) {
	let n = e.img?.trim() ?? "", r = Pw(e), i = (e.items?.contents ?? []).filter((e) => e.type === "career"), a = y(e.system, [
		"details",
		"career",
		"name"
	]), o = [
		e.name,
		y(e, ["Species"]),
		y(e.system, [
			"details",
			"species",
			"value"
		]),
		y(e.system, [
			"details",
			"species",
			"subspecies"
		]),
		a,
		y(e.system, [
			"details",
			"career",
			"careergroup",
			"value"
		]),
		y(e.system, [
			"details",
			"career",
			"class",
			"value"
		]),
		...i.flatMap(FO)
	];
	return {
		actorName: e.name,
		actorUuid: e.uuid,
		currentPortraitPath: n,
		currentTokenPath: r,
		excludeFullyTransparentImages: t.excludeFullyTransparentPortraitAssets,
		excludedReferenceImagePaths: [...t.excludedPortraitReferenceImages],
		immediateCandidates: PO(e, n, r),
		includeCompendiumAssets: t.searchCompendiumPortraitAssets,
		includeFilePickerAssets: t.searchFoundryPortraitAssets,
		priorityFolderPaths: lf({
			configuredFolders: t.prioritizedPortraitFolders,
			hasCareer: !!a || i.length > 0
		}),
		searchTerms: sf(o),
		selectedPortraitPath: n || r
	};
}
function PO(e, t, n) {
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
	}), Jd(r);
}
function FO(e) {
	return [
		e.name,
		y(e.system, ["careergroup", "value"]),
		y(e.system, ["class", "value"])
	];
}
//#endregion
//#region src/module/apps/actor-portrait-gallery/view/ActorPortraitGalleryApplication.ts
var IO = class extends EC {
	actor;
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${e}-actor-portrait-gallery`,
		classes: [e, "wfrp4e-customizer-actor-portrait-gallery"],
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
		return kO;
	}
	getVueProps() {
		return {
			bridge: AO,
			context: NO(this.actor, kT())
		};
	}
};
//#endregion
//#region src/module/wfrp/actor-portrait-gallery/open.ts
async function LO(e) {
	await new IO(Ze(await fromUuid(e), "The requested Actor could not be opened in the portrait gallery.")).render(!0);
}
async function RO(e) {
	await new IO(e).render(!0);
}
//#endregion
//#region src/module/wfrp/actor-portrait-gallery/register-actor-sheet-button.ts
var zO = "openWfrpCustomizerPortraitGallery", BO = "wfrp4e-customizer-actor-portrait-gallery-header", VO = [
	"getHeaderControlsActorSheetWFRP4eCharacter",
	"getHeaderControlsActorSheetWFRP4eNPC",
	"getHeaderControlsActorSheetWFRP4eCreature",
	"getHeaderControlsStandardWFRP4eActorSheet",
	"getHeaderControlsBaseWFRP4eActorSheet",
	"getHeaderControlsWarhammerActorSheetV2"
], HO = [
	"renderActorSheetWFRP4eCharacter",
	"renderActorSheetWFRP4eNPC",
	"renderActorSheetWFRP4eCreature",
	"renderStandardWFRP4eActorSheet",
	"renderBaseWFRP4eActorSheet",
	"renderWarhammerActorSheetV2"
], UO = !1;
function WO() {
	if (!UO) {
		UO = !0;
		for (let e of VO) Hooks.on(e, GO);
		for (let e of HO) Hooks.on(e, KO);
	}
}
function GO(e, t) {
	let n = qO(e);
	if (!n || !Array.isArray(t) || n.isOwner === !1) return;
	let r = t;
	r.some((e) => e.action === zO) || r.push({
		action: zO,
		icon: "fa-solid fa-images",
		label: "Choose Portrait & Token"
	});
	let i = e;
	i.options ??= {}, i.options.actions ??= {}, i.options.actions[zO] = function() {
		let e = qO(this);
		e && YO(e);
	};
}
function KO(e) {
	let t = qO(e), n = JO(e);
	if (!t || !n || t.isOwner === !1) return;
	let r = n.querySelector(".window-header");
	if (!r || r.querySelector(`.${BO}, [data-action="${zO}"]`)) return;
	let i = document.createElement("button");
	i.type = "button", i.classList.add(BO, "header-control", "icon", "fa-solid", "fa-images"), i.dataset.action = zO, i.dataset.tooltip = "Choose Portrait & Token", i.ariaLabel = `Choose a portrait and prototype token for ${t.name}`, i.addEventListener("click", (e) => {
		e.preventDefault(), e.stopPropagation(), YO(t);
	});
	let a = r.querySelector("[data-action=\"toggleControls\"]") ?? r.querySelector("[data-action=\"close\"]");
	r.insertBefore(i, a);
}
function qO(e) {
	if (typeof e != "object" || !e) return null;
	let t = "document" in e ? e.document : void 0, n = "actor" in e ? e.actor : void 0;
	return Ye(t) ? t : Ye(n) ? n : null;
}
function JO(e) {
	return typeof e != "object" || !e || !("element" in e) ? null : e.element instanceof HTMLElement ? e.element : null;
}
async function YO(e) {
	try {
		await RO(e);
	} catch (e) {
		jn("wfrp4e-customizer-apps | Actor portrait gallery could not be opened.", e), ui.notifications?.warn?.("The portrait gallery could not be opened. See the console for details.");
	}
}
//#endregion
//#region src/module/wfrp/npc-builder/estimated-xp/actor-profile.ts
function XO(e) {
	let t = e.toObject(), n = {};
	for (let e of Object.keys(D)) {
		let r = e;
		n[r] = PT(t.system, r);
	}
	return {
		characteristics: n,
		skills: ZO(e, "skill"),
		talents: ZO(e, "talent")
	};
}
function ZO(e, t) {
	return e.items?.contents.filter((e) => e.type === t).map((e) => ({
		name: e.name,
		value: t === "skill" ? QO(e.toObject().system) : $O(e.toObject().system)
	})) ?? [];
}
function QO(e) {
	return x(e, [["advances", "value"], ["advances"]]) + x(e, [["modifier", "value"], ["modifier"]]);
}
function $O(e) {
	return x(e, [["advances", "value"], ["advances"]]);
}
//#endregion
//#region src/module/wfrp/npc-builder/estimated-xp/species-actor.ts
var ek = null;
async function tk(e, t, n) {
	let r = game.actors.contents, i = nk(n ? r.filter((e) => e.folder?.uuid === n) : [], e);
	if (i) return {
		actor: i,
		source: i.folder?.name ?? "Configured NPC Base Actors folder"
	};
	let a = nk(r.filter((e) => e.uuid !== t.uuid), e);
	if (a) return {
		actor: a,
		source: "World Actors"
	};
	let o = rk(await ak(), e);
	if (!o) return null;
	let s = await fromUuid(o.uuid);
	if (!sk(s)) throw Error(`The species Actor ${o.uuid} is no longer available.`);
	return {
		actor: s,
		source: o.source
	};
}
function nk(e, t) {
	return ik(e, t, (e) => e.name);
}
function rk(e, t) {
	return ik(e, t, (e) => e.name);
}
function ik(e, t, n) {
	let r = t.trim();
	return e.find((e) => n(e).trim() === r) ?? e.find((e) => ku(n(e)) === ku(t)) ?? null;
}
function ak() {
	return ek ??= ok(), ek;
}
async function ok() {
	let e = [];
	for (let t of game.packs ?? []) {
		if (!IC(t) || !t.getIndex) continue;
		let n = await t.getIndex({ fields: ["name"] });
		for (let r of LC(n)) {
			let n = PC(t, r);
			r.name && n && e.push({
				name: r.name,
				source: t.title ?? t.collection ?? "Actor Compendium",
				uuid: n
			});
		}
	}
	return e;
}
function sk(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Actor";
}
//#endregion
//#region src/module/wfrp/npc-builder/estimated-xp/estimate.ts
async function ck(e) {
	let t = Ze(await fromUuid(e), "Expected an NPC Actor.");
	if (t.type !== "npc") throw Error(`Expected an NPC Actor, but received Actor type “${t.type}”.`);
	return await lk(t);
}
async function lk(e) {
	let t = LE(e);
	if (!t) return { status: "missing-species" };
	let n = await tk(t, e, kT().baseActorFolderUuid);
	return n ? {
		baselineName: n.actor.name,
		baselineSource: n.source,
		baselineUuid: n.actor.uuid,
		breakdown: Cd(XO(e), XO(n.actor)),
		species: t,
		status: "ready"
	} : {
		species: t,
		status: "baseline-not-found"
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/estimated-xp/sheet.ts
var uk = "[data-wfrp-customizer-npc-xp=\"true\"]", dk = /* @__PURE__ */ new Set(), fk = !1, pk = !1;
function mk() {
	if (!fk) {
		fk = !0, Hooks.on("renderApplicationV2", (e, t) => {
			if (!(t instanceof HTMLElement)) return;
			let n = yk(e);
			n && hk(n, t);
		});
		for (let e of [
			"createActor",
			"updateActor",
			"deleteActor",
			"createItem",
			"updateItem",
			"deleteItem",
			"updateSetting"
		]) Hooks.on(e, bk);
	}
}
function hk(e, t) {
	let n = t.matches("section[data-tab=\"careers\"]") ? t : t.querySelector("section[data-tab=\"careers\"]");
	if (!n) return;
	n.querySelector(uk)?.remove();
	let r = gk(e, t), i = n.querySelector(".sheet-list.careers");
	i ? n.insertBefore(r.container, i) : n.append(r.container), xk(), _k(r), globalThis.setTimeout(() => {
		r.root.isConnected && r.root.contains(r.container) && (xk(), dk.add(r));
	}, 0);
}
function gk(e, t) {
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
async function _k(e) {
	let t = ++e.generation;
	e.output.value = "Calculating…";
	try {
		let n = await lk(e.actor);
		t === e.generation && e.root.contains(e.container) && vk(e, n);
	} catch (n) {
		t === e.generation && e.root.contains(e.container) && (e.output.value = "Unavailable", e.details.textContent = "XP calculation failed; see the console for details."), jn("wfrp4e-customizer-apps | NPC XP calculation failed.", n);
	}
}
function vk(e, t) {
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
function yk(e) {
	if (typeof e != "object" || !e) return null;
	let t = "actor" in e ? e.actor : void 0, n = "document" in e ? e.document : void 0, r = Ye(t) ? t : Ye(n) ? n : null;
	return r?.type === "npc" ? r : null;
}
function bk() {
	pk || (pk = !0, globalThis.setTimeout(() => {
		pk = !1, xk();
		for (let e of dk) _k(e);
	}, 0));
}
function xk() {
	for (let e of dk) (!e.root.isConnected || !e.root.contains(e.container)) && dk.delete(e);
}
//#endregion
//#region src/module/functions/species-chargen/characteristic-roll-formulas.ts
var Sk = "2d10";
function Ck(e) {
	let t = e?.split("+")[0]?.trim();
	return t ? Tk(t) : Sk;
}
function wk(e, t) {
	return Ck(e) === Ck(t);
}
function Tk(e) {
	return e.replaceAll(/\s+/g, "").toLocaleLowerCase();
}
//#endregion
//#region src/module/wfrp/species-chargen/roll-swap-feedback.ts
var Ek = "data-wfrp4e-customizer-roll-swap-feedback", Dk = `[${Ek}="blocked"]`, Ok = /* @__PURE__ */ new WeakMap();
function kk(e, t) {
	let n = Ik(e);
	if (n) for (let e of Fk(n)) e.addEventListener("dragstart", () => {
		let r = e.dataset.ch;
		r && Ak(n, r, t);
	}), e.addEventListener("dragend", () => {
		Mk(n);
	}), e.addEventListener("drop", () => {
		Mk(n);
	});
}
function Ak(e, t, n) {
	Mk(e);
	for (let r of Fk(e)) {
		let e = r.dataset.ch;
		e && (e === t || n(t, e) || jk(r));
	}
}
function jk(e) {
	Ok.set(e, {
		ariaDisabled: e.getAttribute("aria-disabled"),
		borderColor: e.style.getPropertyValue("border-color"),
		borderColorPriority: e.style.getPropertyPriority("border-color"),
		hadDisabledClass: e.classList.contains("disabled")
	}), e.setAttribute(Ek, "blocked"), e.setAttribute("aria-disabled", "true"), e.classList.add("disabled"), e.style.setProperty("border-color", "transparent");
}
function Mk(e) {
	for (let t of e.querySelectorAll(Dk)) {
		let e = Ok.get(t);
		e && (e.hadDisabledClass || t.classList.remove("disabled"), Nk(t, "aria-disabled", e.ariaDisabled), Pk(t, "border-color", e.borderColor, e.borderColorPriority), t.removeAttribute(Ek), Ok.delete(t));
	}
}
function Nk(e, t, n) {
	if (n === null) {
		e.removeAttribute(t);
		return;
	}
	e.setAttribute(t, n);
}
function Pk(e, t, n, r) {
	if (!n) {
		e.style.removeProperty(t);
		return;
	}
	e.style.setProperty(t, n, r);
}
function Fk(e) {
	return [...e.querySelectorAll(".ch-roll.ch-drag")];
}
function Ik(e) {
	if (e instanceof HTMLElement) return e;
	if (!_(e)) return;
	let t = e[0];
	return t instanceof HTMLElement ? t : void 0;
}
//#endregion
//#region src/module/wfrp/species-chargen/roll-swap-guard.ts
var Lk = Symbol("wfrp4e-customizer-guarded-attributes-stage");
function Rk() {
	Hooks.on("wfrp4e:chargen", (e) => {
		zk(e);
	});
}
function zk(t) {
	let n = Bk(t);
	if (!n) {
		jn(`${e} | Could not inspect WFRP character generation stages.`);
		return;
	}
	let r = Vk(n);
	if (!r) {
		jn(`${e} | Could not find the WFRP Attributes character generation stage.`);
		return;
	}
	if (Hk(r.class)) return;
	let i = Uk(r.class);
	typeof n.replaceStage == "function" ? n.replaceStage("attributes", i) : r.class = i, An(`${e} | Guarded WFRP characteristic roll swapping for custom species.`);
}
function Bk(e) {
	if (!_(e)) return;
	let t = {}, n = e.replaceStage;
	return typeof n == "function" && (t.replaceStage = (t, r) => {
		n.call(e, t, r);
	}), Array.isArray(e.stages) && (t.stages = e.stages), t;
}
function Vk(e) {
	for (let t of e.stages ?? []) if (_(t) && t.key === "attributes") return typeof t.class == "function" ? t : void 0;
}
function Hk(e) {
	return !!e[Lk];
}
function Uk(e) {
	class t extends e {
		static [Lk] = !0;
		activateListeners(e) {
			let t = super.activateListeners(e);
			return kk(e, (e, t) => wk(Wk(this, e), Wk(this, t))), t;
		}
		swap(e, t) {
			let n = Wk(this, e), r = Wk(this, t);
			if (wk(n, r)) return super.swap(e, t);
			Gk(e, n, t, r);
		}
	}
	return t;
}
function Wk(e, t) {
	let n = _(e.context) ? e.context : void 0, r = _(n?.characteristics) ? n.characteristics : void 0, i = (_(r?.[t]) ? r[t] : void 0)?.formula;
	return typeof i == "string" ? i : void 0;
}
function Gk(e, t, n, r) {
	let i = Kk(e), a = Kk(n), o = Ck(t), s = Ck(r);
	ui.notifications?.warn?.(`Cannot swap ${i} and ${a}: ${i} uses ${o}, while ${a} uses ${s}.`);
}
function Kk(e) {
	let t = game.wfrp4e?.config?.characteristics;
	if (!_(t)) return e;
	let n = t[e];
	return typeof n == "string" ? n : e;
}
//#endregion
//#region src/module/apps/species-item/state/index.ts
function qk(e) {
	return bu(`species-item:${e}`, () => {
		let t = /* @__PURE__ */ B({
			name: "",
			img: "icons/svg/mystery-man.svg",
			system: ce()
		}), n = /* @__PURE__ */ B(""), r = /* @__PURE__ */ B("description"), i = /* @__PURE__ */ B(0), a = /* @__PURE__ */ B(!1), o = /* @__PURE__ */ B([]), s = /* @__PURE__ */ B(""), c = /* @__PURE__ */ B(""), l = /* @__PURE__ */ B(!1), u = /* @__PURE__ */ B(!1), d = /* @__PURE__ */ B(!1), f = /* @__PURE__ */ B(null), p;
		Ka(() => t.value.system.subspeciesOf, async (e, t, n) => {
			let r = !0;
			n(() => {
				r = !1;
			}), f.value = null;
			try {
				let t = await p.loadParent(e);
				r && (f.value = t);
			} catch (e) {
				r && (s.value = Jk(e));
			}
		});
		let m = $(() => JSON.stringify(t.value) !== n.value), h = $(() => {
			try {
				return oe(t.value.system.talents.choices);
			} catch {
				return [];
			}
		}), g = $(() => h.value.map((e) => e.choices.map((e) => e.name).join(" or ")).join(", "));
		function _(e) {
			u.value && m.value || (p = e, a.value = p.isGM, v());
		}
		function v() {
			try {
				t.value = p.load(), n.value = JSON.stringify(t.value), u.value = !0, o.value = p.effects(), i.value += 1, s.value = "", c.value = "";
			} catch (e) {
				s.value = Jk(e), u.value = !1;
			}
		}
		async function y() {
			l.value = !0, s.value = "";
			try {
				p.flushNotes(), t.value = await p.save(JSON.parse(JSON.stringify(t.value))), n.value = JSON.stringify(t.value), i.value += 1, c.value = "Saved Species Item. Refresh Foundry to update character generation.";
			} catch (e) {
				s.value = Jk(e);
			} finally {
				l.value = !1;
			}
		}
		function b(e, n) {
			t.value.system[e] = n === "" ? null : Number(n);
		}
		function x(e, n, r) {
			let i = t.value.system.characteristics[e] ?? {
				base: null,
				dice: null
			};
			i[n] = r === "" ? null : Number(r), t.value.system.characteristics[e] = i;
		}
		function S(e, n, r) {
			let i = JSON.parse(JSON.stringify(h.value));
			i[e].choices[n] = { name: r }, t.value.system.talents.choices = ae(i);
		}
		function C(e) {
			let n = [...h.value];
			e === void 0 ? n.push({ choices: [{ name: "New Talent" }] }) : n[e].choices.push({ name: "Alternative Talent" }), t.value.system.talents.choices = ae(n);
		}
		function w(e) {
			t.value.system.talents.choices = ae(h.value.filter((t, n) => n !== e));
		}
		function T() {
			t.value.system.subspeciesOf = se();
		}
		async function E(n, r) {
			try {
				let { type: i, reference: a } = await p.resolveDrop(n);
				if (r === "parent") {
					if (!i.endsWith("species") || a.uuid === e) throw Error("Choose a different Species Item as the parent.");
					t.value.system.subspeciesOf = a;
				} else if (r === "skills" && i === "skill") t.value.system.skills.list.push(a.name);
				else if (r === "talents" && i === "talent") t.value.system.talents.choices = ae([...h.value, { choices: [{
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
				s.value = Jk(e);
			}
		}
		let D = $(() => {
			try {
				return oe(t.value.system.talents.choices), "";
			} catch (e) {
				return Jk(e);
			}
		});
		async function ee(e) {
			try {
				await p.openReference(e);
			} catch (e) {
				s.value = Jk(e);
			}
		}
		function O() {
			p.chooseImage(t.value.img, (e) => {
				t.value.img = e;
			});
		}
		let te = (...e) => p.mountNotes(...e), k = (e) => p.editNotes(e);
		async function ne(e, t) {
			if (m.value) {
				s.value = "Save or reload Item changes before editing effects.";
				return;
			}
			try {
				await p.effectAction(e, t), v();
			} catch (e) {
				s.value = Jk(e);
			}
		}
		return {
			draft: t,
			parent: f,
			tab: r,
			revision: i,
			isGM: a,
			effects: o,
			choiceWarning: D,
			chooseImage: O,
			mountNotes: te,
			editNotes: k,
			effectAction: ne,
			openReference: ee,
			dirty: m,
			error: s,
			grants: h,
			talentSummary: g,
			editingTalents: d,
			isLoaded: u,
			isSaving: l,
			message: c,
			configure: _,
			reload: v,
			save: y,
			setStatistic: b,
			setCharacteristic: x,
			editTalent: S,
			addTalent: C,
			removeTalent: w,
			clearParent: T,
			drop: E
		};
	})();
}
function Jk(e) {
	return e instanceof Error ? e.message : String(e);
}
//#endregion
//#region src/module/apps/species-item/view/details/SpeciesTalentEditor.vue?vue&type=script&setup=true&lang.ts
var Yk = ["disabled"], Xk = { class: "dui-fieldset-legend" }, Zk = { class: "app:flex app:flex-wrap app:items-center app:gap-2" }, Qk = { class: "dui-label" }, $k = [
	"value",
	"aria-label",
	"onChange"
], eA = { class: "app:flex app:gap-2" }, tA = ["onClick"], nA = ["onClick"], rA = /* @__PURE__ */ U({
	__name: "SpeciesTalentEditor",
	props: { uuid: {} },
	setup(e) {
		let t = qk(e.uuid);
		return (e, n) => (K(), q("fieldset", {
			class: "dui-fieldset",
			disabled: !!V(t).choiceWarning
		}, [
			n[1] ||= Y("legend", { class: "app:sr-only" }, "Edit Talent choices", -1),
			(K(!0), q(G, null, W(V(t).grants, (e, n) => (K(), q("fieldset", {
				key: n,
				class: "dui-fieldset"
			}, [
				Y("legend", Xk, "Talent " + L(n + 1), 1),
				Y("div", Zk, [(K(!0), q(G, null, W(e.choices, (e, r) => (K(), q("label", {
					key: r,
					class: "dui-input dui-input-sm app:min-w-0 app:flex-1"
				}, [Y("span", Qk, L(r ? "Or" : "Talent"), 1), Y("input", {
					value: e.name,
					required: "",
					"aria-label": `Talent ${n + 1}, option ${r + 1}`,
					onChange: (e) => V(t).editTalent(n, r, e.target.value)
				}, null, 40, $k)]))), 128))]),
				Y("div", eA, [Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					onClick: (e) => V(t).addTalent(n)
				}, " Add alternative ", 8, tA), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					onClick: (e) => V(t).removeTalent(n)
				}, " Remove grant ", 8, nA)])
			]))), 128)),
			Y("button", {
				type: "button",
				class: "dui-btn dui-btn-sm app:justify-self-start",
				onClick: n[0] ||= (e) => V(t).addTalent()
			}, " Add Talent ")
		], 8, Yk));
	}
}), iA = ["disabled"], aA = { class: "app:flex app:flex-wrap app:items-center app:gap-1" }, oA = [
	"onUpdate:modelValue",
	"aria-label",
	"size"
], sA = ["aria-label", "onClick"], cA = {
	key: 0,
	class: "dui-alert dui-alert-warning",
	role: "status"
}, lA = { class: "app:flex app:items-center app:gap-2" }, uA = [
	"disabled",
	"aria-expanded",
	"aria-controls"
], dA = { class: "app:my-1" }, fA = { class: "dui-input dui-input-sm app:w-full" }, pA = [
	"id",
	"value",
	"placeholder"
], mA = /* @__PURE__ */ U({
	__name: "SpeciesItemGrants",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = qk(e.uuid);
		return (n, r) => (K(), q("fieldset", {
			class: "dui-fieldset",
			disabled: !e.editable
		}, [
			r[11] ||= Y("legend", { class: "app:sr-only" }, "Skills and Talents", -1),
			X(Iv, {
				title: "Skills",
				variant: "bare",
				"show-prompt": !1,
				"manual-entry-trigger": "none",
				disabled: !e.editable,
				onDropData: r[1] ||= (e) => V(t).drop(e, "skills")
			}, {
				default: H(() => [r[7] ||= Y("div", { class: "dui-divider" }, "Skills", -1), Y("div", aA, [(K(!0), q(G, null, W(V(t).draft.system.skills.list, (e, n) => (K(), q("div", {
					key: n,
					class: "dui-join app:max-w-full"
				}, [za(Y("input", {
					"onUpdate:modelValue": (e) => V(t).draft.system.skills.list[n] = e,
					"aria-label": `Skill ${n + 1} name`,
					size: Math.max(6, V(t).draft.system.skills.list[n].length),
					class: "dui-input dui-input-xs dui-join-item app:w-auto app:min-w-0",
					required: ""
				}, null, 8, oA), [[wl, V(t).draft.system.skills.list[n]]]), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-square dui-join-item",
					"aria-label": `Remove Skill ${n + 1}`,
					onClick: (e) => V(t).draft.system.skills.list.splice(n, 1)
				}, [...r[5] ||= [Y("i", {
					class: "fa-solid fa-xmark",
					"aria-hidden": "true"
				}, null, -1)]], 8, sA)]))), 128)), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					onClick: r[0] ||= (e) => V(t).draft.system.skills.list.push("New Skill")
				}, [...r[6] ||= [Y("i", {
					class: "fa-solid fa-plus",
					"aria-hidden": "true"
				}, null, -1), Z(" Skill ", -1)]])])]),
				_: 1
			}, 8, ["disabled"]),
			V(t).choiceWarning ? (K(), q("div", cA, L(V(t).choiceWarning) + " The stored choices are preserved. ", 1)) : Q("", !0),
			X(Iv, {
				title: "Talents",
				variant: "bare",
				"show-prompt": !1,
				"manual-entry-trigger": "none",
				disabled: !e.editable || !!V(t).choiceWarning,
				onDropData: r[3] ||= (e) => V(t).drop(e, "talents")
			}, {
				default: H(() => [Y("div", lA, [r[9] ||= Y("span", { class: "dui-label app:flex-1" }, "Talents", -1), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					disabled: !e.editable || !!V(t).choiceWarning,
					"aria-expanded": V(t).editingTalents,
					"aria-controls": `${e.uuid}-talent-editor`,
					onClick: r[2] ||= (e) => V(t).editingTalents = !V(t).editingTalents
				}, [r[8] ||= Y("i", {
					class: "fa-solid fa-gear",
					"aria-hidden": "true"
				}, null, -1), Z(" " + L(V(t).editingTalents ? "Done" : "Edit Talents"), 1)], 8, uA)]), Y("p", dA, L(V(t).choiceWarning ? "Native Talent choices preserved" : V(t).talentSummary || (V(t).draft.system.subspeciesOf.uuid ? "Inherit parent Talents" : "None")), 1)]),
				_: 1
			}, 8, ["disabled"]),
			V(t).editingTalents ? (K(), J(rA, {
				key: 1,
				id: `${e.uuid}-talent-editor`,
				uuid: e.uuid
			}, null, 8, ["id", "uuid"])) : Q("", !0),
			Y("label", fA, [r[10] ||= Y("span", { class: "dui-label app:flex-1" }, "Random Talents", -1), Y("input", {
				id: `${e.uuid}-random-talents`,
				"aria-label": "Random Talents",
				class: "app:max-w-20 app:text-center",
				type: "number",
				min: "0",
				value: V(t).draft.system.talents.random,
				placeholder: String(V(t).parent?.talents.random ?? "—"),
				onInput: r[4] ||= (e) => V(t).draft.system.talents.random = e.target.value === "" ? null : Number(e.target.value)
			}, null, 40, pA)])
		], 8, iA));
	}
}), hA = { class: "dui-label" }, gA = { class: "dui-join app:min-w-0" }, _A = {
	key: 1,
	class: "dui-input dui-input-sm app:h-auto app:min-h-8 app:w-full app:whitespace-normal"
}, vA = ["aria-label"], yA = /* @__PURE__ */ U({
	__name: "SpeciesItemReference",
	props: {
		uuid: {},
		label: {},
		reference: {},
		editable: { type: Boolean }
	},
	emits: ["clear", "drop-data"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = qk(n.uuid);
		function a(e) {
			n.editable && e.dataTransfer && r("drop-data", e.dataTransfer.getData("text/plain"));
		}
		return (t, n) => (K(), q("div", {
			class: "app:grid app:grid-cols-[7rem_minmax(0,1fr)] app:items-center app:gap-2",
			onDragover: n[2] ||= Nl(() => {}, ["prevent"]),
			onDrop: Nl(a, ["prevent"])
		}, [Y("span", hA, L(e.label), 1), Y("div", gA, [e.reference.uuid ? (K(), q("button", {
			key: 0,
			type: "button",
			class: "dui-btn dui-btn-sm dui-btn-outline dui-join-item app:h-auto app:min-h-8 app:min-w-0 app:flex-1 app:justify-start app:whitespace-normal",
			onClick: n[0] ||= (t) => V(i).openReference(e.reference.uuid)
		}, L(e.reference.name || e.label), 1)) : (K(), q("div", _A, " Drop " + L(e.label === "Subspecies Of" ? "a Species Item" : "a RollTable") + " here ", 1)), e.editable && (e.reference.uuid || e.reference.id) ? (K(), q("button", {
			key: 2,
			type: "button",
			class: "dui-btn dui-btn-sm dui-btn-square dui-join-item",
			"aria-label": `Clear ${e.label}`,
			onClick: n[1] ||= (e) => r("clear")
		}, [...n[3] ||= [Y("i", {
			class: "fa-solid fa-xmark",
			"aria-hidden": "true"
		}, null, -1)]], 8, vA)) : Q("", !0)])], 32));
	}
}), bA = ["disabled"], xA = /* @__PURE__ */ U({
	__name: "SpeciesItemTables",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = qk(e.uuid), n = [
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
		return (r, i) => (K(), q("fieldset", {
			class: "dui-fieldset",
			disabled: !e.editable
		}, [
			i[0] ||= Y("legend", { class: "app:sr-only" }, "Tables", -1),
			i[1] ||= Y("div", { class: "dui-divider" }, "Tables", -1),
			(K(), q(G, null, W(n, (n) => X(yA, {
				key: n.key,
				uuid: e.uuid,
				label: n.label,
				reference: V(t).draft.system.tables[n.key],
				editable: e.editable,
				onDropData: (e) => V(t).drop(e, n.key),
				onClear: (e) => V(t).draft.system.tables[n.key] = V(se)()
			}, null, 8, [
				"uuid",
				"label",
				"reference",
				"editable",
				"onDropData",
				"onClear"
			])), 64))
		], 8, bA));
	}
}), SA = ["disabled"], CA = { class: "app:max-w-full app:overflow-x-auto" }, wA = { class: "dui-table dui-table-xs app:min-w-[34rem]" }, TA = { class: "app:sr-only" }, EA = [
	"aria-label",
	"value",
	"placeholder",
	"onInput"
], DA = { "aria-hidden": "true" }, OA = { class: "dui-input dui-input-xs dui-input-ghost app:w-full app:gap-0 app:px-1" }, kA = [
	"aria-label",
	"value",
	"placeholder",
	"onInput"
], AA = { key: 0 }, jA = { class: "dui-input dui-input-sm app:w-full" }, MA = [
	"id",
	"value",
	"placeholder"
], NA = { class: "app:flex app:flex-wrap app:gap-2" }, PA = { class: "dui-label app:flex-1" }, FA = [
	"aria-label",
	"value",
	"placeholder",
	"onInput"
], IA = { class: "app:grid app:grid-cols-[7rem_minmax(0,1fr)] app:items-center app:gap-2" }, LA = ["for"], RA = ["id"], zA = /* @__PURE__ */ U({
	__name: "SpeciesItemDetails",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = qk(e.uuid), n = {
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
		return (a, o) => (K(), q("fieldset", {
			class: "dui-fieldset",
			disabled: !e.editable
		}, [
			o[8] ||= Y("legend", { class: "app:sr-only" }, "Species details", -1),
			X(yA, {
				uuid: e.uuid,
				label: "Subspecies Of",
				reference: V(t).draft.system.subspeciesOf,
				editable: e.editable,
				onDropData: o[0] ||= (e) => V(t).drop(e, "parent"),
				onClear: o[1] ||= (e) => V(t).clearParent()
			}, null, 8, [
				"uuid",
				"reference",
				"editable"
			]),
			Y("div", CA, [Y("table", wA, [
				o[5] ||= Y("caption", { class: "app:sr-only" }, " Characteristic bases plus dice ", -1),
				Y("thead", null, [Y("tr", null, [(K(!0), q(G, null, W(V(r), (e) => (K(), q("th", {
					key: e,
					scope: "col",
					class: "app:text-center"
				}, L(n[e]), 1))), 128))])]),
				Y("tbody", null, [
					Y("tr", null, [(K(!0), q(G, null, W(V(r), (e) => (K(), q("td", {
						key: e,
						class: "app:p-1"
					}, [Y("label", null, [Y("span", TA, L(n[e]) + " base", 1), Y("input", {
						class: "dui-input dui-input-xs dui-input-ghost app:w-full app:text-center",
						type: "number",
						min: "0",
						step: "any",
						"aria-label": `${n[e]} base`,
						value: V(t).draft.system.characteristics[e]?.base,
						placeholder: String(V(t).parent?.characteristics[e]?.base ?? "—"),
						onInput: (n) => V(t).setCharacteristic(e, "base", n.target.value)
					}, null, 40, EA)])]))), 128))]),
					Y("tr", DA, [(K(!0), q(G, null, W(V(r), (e) => (K(), q("td", {
						key: e,
						class: "app:text-center"
					}, "+"))), 128))]),
					Y("tr", null, [(K(!0), q(G, null, W(V(r), (e) => (K(), q("td", {
						key: e,
						class: "app:p-1"
					}, [Y("label", OA, [Y("input", {
						class: "app:text-center",
						type: "number",
						min: "0",
						step: "any",
						"aria-label": `${n[e]} dice`,
						value: V(t).draft.system.characteristics[e]?.dice,
						placeholder: String(V(t).parent?.characteristics[e]?.dice ?? "—"),
						onInput: (n) => V(t).setCharacteristic(e, "dice", n.target.value)
					}, null, 40, kA), o[4] ||= Y("span", null, "d10", -1)])]))), 128))])
				])
			])]),
			V(t).draft.system.subspeciesOf.uuid ? (K(), q("p", AA, "Empty values inherit from the parent species.")) : Q("", !0),
			X(mA, {
				uuid: e.uuid,
				editable: e.editable
			}, null, 8, ["uuid", "editable"]),
			Y("label", jA, [o[6] ||= Y("span", { class: "dui-label app:flex-1" }, "Movement", -1), Y("input", {
				id: `${e.uuid}-movement`,
				"aria-label": "Movement",
				class: "app:max-w-20 app:text-center",
				type: "number",
				min: "0",
				step: "any",
				value: V(t).draft.system.movement,
				placeholder: String(V(t).parent?.movement ?? "—"),
				onInput: o[2] ||= (e) => V(t).setStatistic("movement", e.target.value)
			}, null, 40, MA)]),
			Y("div", NA, [(K(), q(G, null, W(i, (e) => Y("label", {
				key: e.key,
				class: "dui-input dui-input-sm app:min-w-36 app:flex-1"
			}, [Y("span", PA, L(e.label), 1), Y("input", {
				class: "app:max-w-12 app:text-center",
				type: "number",
				min: "0",
				step: "any",
				"aria-label": e.label,
				value: V(t).draft.system[e.key],
				placeholder: String(V(t).parent?.[e.key] ?? "—"),
				onInput: (n) => V(t).setStatistic(e.key, n.target.value)
			}, null, 40, FA)])), 64))]),
			Y("div", IA, [Y("label", {
				class: "dui-label",
				for: `${e.uuid}-size`
			}, "Size", 8, LA), za(Y("select", {
				id: `${e.uuid}-size`,
				"onUpdate:modelValue": o[3] ||= (e) => V(t).draft.system.size = e,
				class: "dui-select dui-select-sm app:w-full",
				"aria-label": "Size"
			}, [...o[7] ||= [ac("<option value=\"tiny\">Tiny</option><option value=\"ltl\">Little</option><option value=\"sml\">Small</option><option value=\"avg\">Average</option><option value=\"lrg\">Large</option><option value=\"enor\">Enormous</option><option value=\"mnst\">Monstrous</option>", 7)]], 8, RA), [[Dl, V(t).draft.system.size]])]),
			X(xA, {
				uuid: e.uuid,
				editable: e.editable
			}, null, 8, ["uuid", "editable"])
		], 8, SA));
	}
}), BA = {
	key: 0,
	class: "dui-fieldset"
}, VA = { class: "dui-fieldset" }, HA = /* @__PURE__ */ U({
	__name: "SpeciesItemNotes",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = e, n = qk(t.uuid), r = /* @__PURE__ */ B(), i = /* @__PURE__ */ B(), a = [];
		return go(() => {
			for (let [e, o] of [["description", r.value], ["gmdescription", i.value]]) o && a.push(n.mountNotes(o, e, n.draft.system[e].value, t.editable, (t) => {
				n.draft.system[e].value = t;
			}));
		}), yo(() => a.forEach((e) => e())), (t, a) => (K(), q(G, null, [V(n).isGM ? (K(), q("fieldset", BA, [
			a[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "GM Notes", -1),
			e.editable ? (K(), q("button", {
				key: 0,
				type: "button",
				class: "dui-btn dui-btn-xs app:justify-self-start",
				onClick: a[0] ||= (e) => V(n).editNotes("gmdescription")
			}, " Edit GM Notes ")) : Q("", !0),
			Y("div", {
				ref_key: "gmNotes",
				ref: i,
				class: "app:min-h-32",
				"aria-label": "GM Notes"
			}, null, 512)
		])) : Q("", !0), Y("fieldset", VA, [
			a[3] ||= Y("legend", { class: "dui-fieldset-legend" }, "Notes", -1),
			e.editable ? (K(), q("button", {
				key: 0,
				type: "button",
				class: "dui-btn dui-btn-xs app:justify-self-start",
				onClick: a[1] ||= (e) => V(n).editNotes("description")
			}, " Edit Notes ")) : Q("", !0),
			Y("div", {
				ref_key: "notes",
				ref: r,
				class: "app:min-h-32",
				"aria-label": "Notes"
			}, null, 512)
		])], 64));
	}
});
//#endregion
//#region src/module/wfrp/grant/item-documents.ts
function UA(e) {
	let t = e.dataTransfer?.getData("text/plain") ?? "";
	if (!t) return null;
	try {
		return jT(t).type === "Item" ? t : null;
	} catch {
		return null;
	}
}
async function WA(e) {
	let t = jT(e);
	if (!t.uuid) throw Error("Drop an Item with a resolvable UUID.");
	return Qe(await fromUuid(t.uuid), "The dropped Item was not found.");
}
function GA(e) {
	let t = {
		name: e.name,
		uuid: e.uuid
	};
	return e.img && (t.img = e.img), t;
}
//#endregion
//#region src/module/wfrp/effect-builders/documents.ts
async function KA(e) {
	let t = JSON.parse(e);
	if (!_(t) || typeof t.uuid != "string") throw Error("Drop a document or enter its UUID.");
	return fromUuid(t.uuid);
}
function qA(e) {
	let t = Qe(e, "Choose an Item to receive the effect.");
	if (!game.user || !t.canUserModify(game.user, "update")) throw Error("You do not have permission to edit this Item.");
	if (t.compendium?.locked) throw Error("Unlock the destination compendium or import its Item into the world.");
	return t;
}
async function JA(e, t = !1) {
	let n = await KA(e);
	return GA(t ? qA(n) : Qe(n, "Choose an Item to grant."));
}
function YA(e) {
	if (!_(e) || e.documentName !== "RollTable" || typeof e.uuid != "string" || typeof e.name != "string") throw Error("Choose a RollTable containing Item document results.");
	return {
		uuid: e.uuid,
		name: e.name
	};
}
async function XA(e, t, n = []) {
	if (n.includes(e)) throw Error("The grant RollTables contain a circular reference.");
	if (n.length > 5) throw Error("The grant RollTables exceed Foundry's nesting limit.");
	let r = await fromUuid(e);
	YA(r);
	let i = _(r) ? r.results : void 0, a = _(i) ? i.contents : void 0;
	if (!Array.isArray(a) || !a.length) throw Error("The grant RollTable is empty.");
	for (let r of a) {
		let i = _(r) ? r.documentUuid : void 0;
		if (typeof i != "string" || !i) throw Error("Grant RollTables must use Item or nested RollTable document results.");
		if (i === t) throw Error("An Item cannot grant itself.");
		let a = await fromUuid(i);
		_(a) && a.documentName === "RollTable" ? await XA(i, t, [...n, e]) : Qe(a, `The RollTable result ${i} is not an available Item.`);
	}
}
//#endregion
//#region src/module/apps/effect-builders/functions/catalogue.ts
var ZA = [
	{
		kind: "wounds",
		title: "Wound Formula",
		description: "Calculate wounds from characteristics, skills, and a custom formula."
	},
	{
		kind: "age-height",
		title: "Age & Height",
		description: "Set Species age and height formulas and fill missing actor details."
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
function QA(e) {
	return {
		kind: e,
		name: ZA.find((t) => t.kind === e).title,
		formula: "@sb + 2 * @tb + @wpb",
		ageFormula: "",
		heightFormula: "",
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
//#region src/module/functions/item-grants/script.ts
function $A(e, t) {
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
//#region src/module/functions/item-grants/wfrp-grant-effect.ts
var ej = "generatedGrantItemsEffect", tj = {
	grantMode: "all",
	lifetime: "linked-to-effect",
	ownerAction: "keep"
};
function nj(e) {
	let t = e.recipe ?? tj;
	rj(t);
	let n = e.items.map((e) => e.uuid);
	return {
		changes: [],
		description: ij(e.effectName, e.items, t),
		disabled: !1,
		flags: { [e.flagScope]: {
			[ej]: !0,
			itemUuids: n,
			recipe: t
		} },
		img: e.items[0]?.img ?? "icons/svg/aura.svg",
		name: e.effectName,
		system: {
			scriptData: [{
				label: e.effectName,
				script: $A([`const itemUuids = ${JSON.stringify(n)};`], t),
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
function rj(e) {
	if (e.lifetime === "linked-to-effect" && e.ownerAction === "delete-after-grant") throw Error("Self-removing grant effects must create detached item copies.");
}
function ij(e, t, n) {
	let r = aj(e), i = t.map((e) => `<li>${aj(e.name)}</li>`).join("");
	return `<p><strong>${r}</strong>: grants item copies; ${n.lifetime === "linked-to-effect" ? "granted item copies are removed with this effect" : "granted item copies remain after this effect is removed"}.${n.ownerAction === "delete-after-grant" ? " The source Item removes itself after granting." : ""}</p><ul>${i}</ul>`;
}
function aj(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
//#endregion
//#region src/module/functions/effect-builders/wound-formula/compiler.ts
function oj(e) {
	let t = [], n = /* @__PURE__ */ new Set(), r = e.trim();
	return r = r.replaceAll(/@([A-Za-z][\dA-Za-z]*)/g, (e, t) => {
		let r = sj(t);
		return n.add(r), r;
	}), r = r.replaceAll(/{([^{}]+)}/g, (e, n) => cj(t, n, "total")), r = r.replaceAll(/\[([^[\]]+)]/g, (e, n) => cj(t, n, "bonus")), {
		expression: r,
		references: t,
		usedKeywords: n
	};
}
function sj(e) {
	if ((/* @__PURE__ */ "ablaze.advantage.age.bleeding.blinded.broken.corruption.deafened.entangled.fate.fatigued.fortune.height.poisoned.rank.resilience.resolve.sb.sbMultiplier.scale.sin.size.status.stunned.tb.tbMultiplier.weight.wpb.wpbMultiplier.xp".split(".")).includes(e)) return e;
	throw Error(`Unknown wound formula keyword: @${e}`);
}
function cj(e, t, n) {
	let r = lj(t, n, e), i = e.find((e) => uj(e, r));
	return i ? i.variableName : (e.push(r), r.variableName);
}
function lj(e, t, n) {
	let [r, i] = dj(e), a = fj(r), o = gj(hj(r, i, t), n);
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
	return i && (s.characteristicOverride = pj(i)), s;
}
function uj(e, t) {
	return e.characteristicKey === t.characteristicKey && e.characteristicOverride === t.characteristicOverride && e.kind === t.kind && e.name === t.name && e.source === t.source;
}
function dj(e) {
	let t = e.split("|").map((e) => e.trim());
	if (t.length > 2 || !t[0]) throw Error(`Invalid wound formula attribute reference: ${e}`);
	return [t[0], t[1]];
}
function fj(e) {
	let t = e.trim().toLocaleLowerCase();
	return O(t) ? t : ee[t] ?? mj[t];
}
function pj(e) {
	let t = fj(e);
	if (!t) throw Error(`Unknown wound formula characteristic: ${e}`);
	return t;
}
var mj = {
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
function hj(e, t, n) {
	let [r, ...i] = [e, t].flatMap((e) => e ? e.match(/\d+|[A-Za-z]+/g) ?? [] : []), a = r ? [r.toLocaleLowerCase(), ...i.map((e) => e.charAt(0).toLocaleUpperCase() + e.slice(1))].join("") : "attribute";
	return n === "bonus" ? `${a}Bonus` : a;
}
function gj(e, t) {
	let n = new Set(t.map((e) => e.variableName));
	if (!n.has(e)) return e;
	let r = 2, i = `${e}${r}`;
	for (; n.has(i);) r += 1, i = `${e}${r}`;
	return i;
}
//#endregion
//#region src/module/apps/effect-builders/functions/formula-validation.ts
function _j(e) {
	if (!e.trim()) throw Error("Enter a wound formula.");
	let t = oj(e), n = [...t.usedKeywords, ...t.references.map((e) => e.variableName)], r = t.expression.replace(/Math\.(floor|ceil|round|min|max|abs|sqrt|pow)\b/g, "0");
	if ((r.match(/[A-Za-z_$][\w$]*/g) ?? []).some((e) => !n.includes(e)) || /[^\w\s.+*/%(),-]/.test(r)) throw Error("Use arithmetic, formula tokens, and Math functions in the wound formula.");
	try {
		Function(...n, `"use strict"; return (${t.expression});`);
	} catch {
		throw Error("The wound formula has invalid arithmetic or unmatched brackets.");
	}
}
//#endregion
//#region src/module/apps/effect-builders/functions/choice.ts
function vj(e, t, n) {
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
//#region src/module/apps/effect-builders/functions/random.ts
function yj(e, t) {
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
//#region src/module/apps/effect-builders/functions/age-height.ts
function bj(e) {
	let t = [e.ageFormula.trim(), e.heightFormula.trim()];
	if (!t.some(Boolean)) return ["Enter an age formula, a height formula, or both."];
	if (t.some((e) => e.includes("@"))) return ["Use self-contained formulas without Actor data references (@)."];
	for (let [e, n] of t.entries()) if (n && !Number.isNaN(Number(n))) {
		let t = Number(n);
		if (!Number.isSafeInteger(t) || t < (e === 0 ? 0 : 1)) return [e === 0 ? "Age must be a whole number of zero or more." : "Height must be a positive whole number of inches."];
	}
	return [];
}
function xj(e) {
	let t = e.name.trim();
	return {
		name: t,
		img: "icons/svg/clockwork.svg",
		disabled: !1,
		transfer: !0,
		description: "<p>Species age is measured in years and height in total inches. When added to an actor, fills only missing values. Existing values are preserved.</p>",
		system: {
			transferData: {
				type: "document",
				documentType: "Actor"
			},
			changes: ["age", "height"].flatMap((t) => {
				let n = e[t === "age" ? "ageFormula" : "heightFormula"].trim();
				return n ? [{
					key: `flags.drowsy.${t}Formula`,
					value: n,
					type: "override",
					phase: "initial",
					mode: 5,
					priority: 50
				}] : [];
			}),
			scriptData: [{
				label: t,
				trigger: "immediate",
				script: Sj,
				options: { deleteEffect: !1 }
			}]
		}
	};
}
var Sj = [
	"const actor = this.actor;",
	"if (!actor || this.effect.disabled) return;",
	"",
	"const updates = {};",
	"for (const field of [\"age\", \"height\"]) {",
	"  const detail = actor.system.details?.[field];",
	"  if (!detail || (detail.value != null && String(detail.value).trim() !== \"\")) continue;",
	"",
	"  const change = this.effect.changes.find((entry) => entry.key === `flags.drowsy.${field}Formula`);",
	"  if (!change) continue;",
	"  const value = change.value;",
	"  const formula =",
	"    typeof value === \"string\"",
	"      ? value",
	"      : typeof value === \"number\" && Number.isFinite(value)",
	"        ? String(value)",
	"        : \"\";",
	"  const override =",
	"    change.type !== undefined",
	"      ? change.type === \"override\"",
	"      : change.mode === CONST.ACTIVE_EFFECT_MODES.OVERRIDE;",
	"  if (!override || !Roll.validate(formula)) {",
	"    this.script.notification(",
	"      `Invalid ${field} formula. Use an Override change with a dice formula.`,",
	"      \"error\",",
	"    );",
	"    return;",
	"  }",
	"  const roll = await new Roll(formula).roll({ allowInteractive: false });",
	"  if (!Number.isSafeInteger(roll.total) || roll.total < (field === \"height\" ? 1 : 0)) {",
	"    this.script.notification(",
	"      `${field} formula returned an invalid value. Existing details were kept.`,",
	"      \"error\",",
	"    );",
	"    return;",
	"  }",
	"  updates[`system.details.${field}.value`] =",
	"    field === \"age\" ? String(roll.total) : `${Math.floor(roll.total / 12)}'${roll.total % 12}`;",
	"}",
	"",
	"if (Object.keys(updates).length) await actor.update(updates);"
].join("\n");
//#endregion
//#region src/module/functions/effect-builders/wound-formula/script-lines.ts
function Cj(e) {
	let t = [];
	if (Ej(e, [
		"sb",
		"tb",
		"wpb"
	]) && (t.push(...Dj(e, "sb", "preWoundArgs.sb")), t.push(...Dj(e, "tb", "preWoundArgs.tb")), t.push(...Dj(e, "wpb", "preWoundArgs.wpb"))), Ej(e, [
		"sbMultiplier",
		"tbMultiplier",
		"wpbMultiplier"
	]) && (t.push("const multiplier = preWoundArgs.multiplier;"), t.push(...Dj(e, "sbMultiplier", "multiplier.sb")), t.push(...Dj(e, "tbMultiplier", "multiplier.tb")), t.push(...Dj(e, "wpbMultiplier", "multiplier.wpb"))), Ej(e, ["scale", "size"]) && (t.push(...Oj()), t.push("const size = actorSizeStep();"), t.push(...Dj(e, "scale", "2 ** size"))), Ej(e, Nj) && (t.push(...Dj(e, "age", "Number(actor.system.details.age.value)")), t.push(...Dj(e, "height", "Number(actor.system.details.height.value)")), t.push(...Dj(e, "weight", "Number(actor.system.details.weight.value)")), t.push(...Ij(e))), Ej(e, Pj) && (t.push(...Dj(e, "xp", "actor.system.details.experience.total")), t.push(...Dj(e, "fate", "actor.system.status.fate.value")), t.push(...Dj(e, "fortune", "actor.system.status.fortune.value")), t.push(...Dj(e, "resilience", "actor.system.status.resilience.value")), t.push(...Dj(e, "resolve", "actor.system.status.resolve.value")), t.push(...Dj(e, "corruption", "actor.system.status.corruption.value")), t.push(...Dj(e, "sin", "actor.system.status.sin.value")), t.push(...Dj(e, "advantage", "actor.system.status.advantage.value"))), Ej(e, Fj)) {
		t.push(...Lj());
		for (let n of Fj) t.push(...Dj(e, n, `conditionValue("${n}")`));
	}
	return t.length ? [...t, ""] : [];
}
function wj(e) {
	let t = e.length > 0, n = e.some((e) => e.source === "skill");
	return [...kj(t), ...Aj(n)];
}
function Tj(e) {
	return e.map((e) => e.source === "characteristic" ? jj(e) : Mj(e));
}
function Ej(e, t) {
	return t.some((t) => e.has(t));
}
function Dj(e, t, n) {
	return e.has(t) ? [`const ${t} = ${n};`] : [];
}
function Oj() {
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
function kj(e) {
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
function Aj(e) {
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
function jj(e) {
	let t = e.kind === "bonus" ? "characteristicBonus" : "characteristicTotal";
	return `const ${e.variableName} = ${t}(${JSON.stringify(e.characteristicKey)});`;
}
function Mj(e) {
	let t = e.kind === "bonus" ? "skillBonus" : "skillTotal", n = e.characteristicOverride ? JSON.stringify(e.characteristicOverride) : "undefined";
	return `const ${e.variableName} = ${t}(${JSON.stringify(e.name)}, ${n});`;
}
var Nj = [
	"age",
	"height",
	"rank",
	"status",
	"weight"
], Pj = [
	"advantage",
	"corruption",
	"fate",
	"fortune",
	"resilience",
	"resolve",
	"sin",
	"xp"
], Fj = [
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
function Ij(e) {
	let t = [];
	return e.has("status") && t.push("function statusTierValue() {", "  const statusTiers = { brass: 1, silver: 2, gold: 3 };", "  const tier = actor.system.details.status.tier;", "  return statusTiers[String(tier).toLocaleLowerCase()] || Number(tier);", "}", "const status = statusTierValue();"), t.push(...Dj(e, "rank", "Number(actor.system.details.status.standing)")), t;
}
function Lj() {
	return [
		"function conditionValue(key) {",
		"  return actor.hasCondition(key)?.conditionValue || 0;",
		"}"
	];
}
//#endregion
//#region src/module/functions/effect-builders/wound-formula/index.ts
function Rj(e) {
	let t = oj(e);
	return [
		...Cj(t.usedKeywords),
		...wj(t.references),
		...Tj(t.references),
		"",
		`args.wounds = ${t.expression};`
	];
}
//#endregion
//#region src/module/apps/effect-builders/functions/wounds.ts
var zj = ["const storageKey = \"__wfrp4eCustomizerWoundFormulaArgs\";", "const sourceId = this.effect.id;"];
function Bj(e, t) {
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
					...zj,
					"this.actor[storageKey] ||= {};",
					"this.actor[storageKey][sourceId] = args;"
				].join("\n")
			}, {
				label: e,
				trigger: "woundCalc",
				script: [
					...zj,
					"const preWoundArgs = this.actor[storageKey][sourceId];",
					"const actor = this.actor;",
					...Rj(t)
				].join("\n")
			}]
		}
	};
}
//#endregion
//#region src/module/apps/effect-builders/functions/build.ts
function Vj(e) {
	let t = [];
	if (e.name.trim() || t.push("Enter an effect name."), e.kind === "age-height") return [...t, ...bj(e)];
	if (e.kind === "wounds") {
		try {
			_j(e.formula);
		} catch (e) {
			t.push(e instanceof Error ? e.message : String(e));
		}
		return t;
	}
	return e.recipe.lifetime === "linked-to-effect" && e.recipe.ownerAction === "delete-after-grant" && t.push("Self-removing source Items must grant copies that remain after the effect is removed."), e.kind === "grant" && !e.items.length && t.push("Add at least one Item to grant."), e.kind === "random" && !e.table && t.push("Choose a RollTable."), (e.kind === "random" || e.kind === "choice") && (!Number.isInteger(e.count) || e.count < 1 || e.count > 100) && t.push("Enter a whole number from 1 to 100."), e.kind === "choice" && ((!e.groups.length || e.groups.some((e) => !e.name.trim() || !e.items.length)) && t.push("Each choice needs a name and at least one Item."), e.count > e.groups.length && t.push("The number of choices exceeds the available options.")), t;
}
function Hj(e, t) {
	let n = Vj(e);
	if (n.length) throw Error(n.join(" "));
	let r = e.name.trim();
	if (e.kind === "age-height") return xj(e);
	if (e.kind === "wounds") return Bj(r, e.formula);
	let i = nj({
		effectName: r,
		flagScope: t,
		items: e.items,
		recipe: e.recipe
	});
	if (e.kind === "grant") return i;
	let a = e.kind === "random" ? yj(e.table.uuid, e.count) : vj(r, e.groups, e.count);
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
				script: $A(a, e.recipe)
			}]
		}
	};
}
//#endregion
//#region src/module/apps/effect-builders/state/index.ts
function Uj(e) {
	return bu(`effect-builder:${e}`, () => {
		let e = /* @__PURE__ */ B(QA("wounds")), t = /* @__PURE__ */ B(null), n = /* @__PURE__ */ B(""), r = /* @__PURE__ */ B(""), i = /* @__PURE__ */ B(!1), a = /* @__PURE__ */ B(!1), o = /* @__PURE__ */ B(!1), s, c = $(() => Vj(e.value)), l = $(() => !!t.value && !c.value.length && !i.value && !a.value);
		function u(n, r, i) {
			s = r, !o.value && (e.value = QA(n), t.value = i, o.value = !0);
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
	})(fC);
}
//#endregion
//#region src/module/apps/shared/view/components/ApplicationShell.vue?vue&type=script&setup=true&lang.ts
var Wj = ["aria-label"], Gj = { class: "dui-card-body" }, Kj = { class: "dui-card-title" }, qj = { key: 0 }, Jj = {
	key: 0,
	class: "dui-card-actions"
}, Yj = /* @__PURE__ */ U({
	__name: "ApplicationShell",
	props: {
		description: {},
		title: {}
	},
	setup(e) {
		return (t, n) => (K(), q("section", {
			"aria-label": e.title,
			class: "dui-card"
		}, [Y("div", Gj, [
			Y("header", null, [
				Y("h1", Kj, L(e.title), 1),
				e.description ? (K(), q("p", qj, L(e.description), 1)) : Q("", !0),
				Eo(t.$slots, "header")
			]),
			Eo(t.$slots, "default"),
			t.$slots.actions ? (K(), q("div", Jj, [Eo(t.$slots, "actions")])) : Q("", !0)
		])], 8, Wj));
	}
}), Xj = { class: "dui-list" }, Zj = { class: "dui-list-col-grow" }, Qj = ["aria-label", "onClick"], $j = /* @__PURE__ */ U({
	__name: "SourceItems",
	props: {
		items: {},
		title: {}
	},
	emits: ["dropData", "remove"],
	setup(e) {
		return (t, n) => (K(), q(G, null, [X(Iv, {
			title: e.title,
			description: "Drop an Item to add it to this list.",
			variant: "compact",
			onDropData: n[0] ||= (e) => t.$emit("dropData", e)
		}, null, 8, ["title"]), Y("ul", Xj, [(K(!0), q(G, null, W(e.items, (e) => (K(), q("li", {
			key: e.uuid,
			class: "dui-list-row"
		}, [Y("span", Zj, L(e.name), 1), Y("button", {
			type: "button",
			class: "dui-btn dui-btn-sm dui-btn-ghost",
			"aria-label": `Remove ${e.name}`,
			onClick: (n) => t.$emit("remove", e.uuid)
		}, " Remove ", 8, Qj)]))), 128))])], 64));
	}
}), eM = { class: "dui-fieldset" }, tM = ["for"], nM = ["id", "max"], rM = { class: "dui-fieldset-legend" }, iM = ["for"], aM = ["id", "onUpdate:modelValue"], oM = ["onClick"], sM = /* @__PURE__ */ U({
	__name: "ChoiceOptions",
	props: { id: {} },
	setup(e) {
		let t = e, n = Uj(t.id), r = `${t.id}-${eo()}`;
		return (e, t) => (K(), q("fieldset", eM, [
			t[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "Player choices", -1),
			Y("label", {
				for: `${r}-count`,
				class: "dui-label"
			}, "Number of options to choose", 8, tM),
			za(Y("input", {
				id: `${r}-count`,
				"onUpdate:modelValue": t[0] ||= (e) => V(n).draft.count = e,
				"aria-label": "Number of options to choose",
				type: "number",
				min: "1",
				max: V(n).draft.groups.length || 1,
				step: "1",
				class: "dui-input"
			}, null, 8, nM), [[
				wl,
				V(n).draft.count,
				void 0,
				{ number: !0 }
			]]),
			t[3] ||= Y("p", null, "Each option can grant one Item or a whole package.", -1),
			(K(!0), q(G, null, W(V(n).draft.groups, (e, t) => (K(), q("fieldset", {
				key: t,
				class: "dui-fieldset"
			}, [
				Y("legend", rM, "Option " + L(t + 1), 1),
				Y("label", {
					for: `${r}-${t}`,
					class: "dui-label"
				}, "Option name", 8, iM),
				za(Y("input", {
					id: `${r}-${t}`,
					"onUpdate:modelValue": (t) => e.name = t,
					"aria-label": "Option name",
					class: "dui-input app:w-full"
				}, null, 8, aM), [[wl, e.name]]),
				X($j, {
					items: e.items,
					title: `Items for option ${t + 1}`,
					onDropData: (e) => V(n).dropItem(e, t),
					onRemove: (e) => V(n).removeItem(e, t)
				}, null, 8, [
					"items",
					"title",
					"onDropData",
					"onRemove"
				]),
				Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm dui-btn-ghost",
					onClick: (e) => V(n).draft.groups.splice(t, 1)
				}, " Remove option ", 8, oM)
			]))), 128)),
			Y("button", {
				type: "button",
				class: "dui-btn",
				onClick: t[1] ||= (...e) => V(n).addGroup && V(n).addGroup(...e)
			}, "Add option")
		]));
	}
}), cM = { class: "dui-fieldset" }, lM = ["for"], uM = ["id", "value"], dM = {
	key: 0,
	class: "dui-label"
}, fM = /* @__PURE__ */ U({
	__name: "GrantOptions",
	props: { id: {} },
	setup(e) {
		let t = e, n = Uj(t.id), r = `${t.id}-${eo()}`;
		return (e, t) => (K(), q("fieldset", cM, [
			t[4] ||= Y("legend", { class: "dui-fieldset-legend" }, "Granted Items", -1),
			Y("label", {
				for: `${r}-lifetime`,
				class: "dui-label"
			}, "When the effect is removed", 8, lM),
			Y("select", {
				id: `${r}-lifetime`,
				"aria-label": "When the effect is removed",
				class: "dui-select app:w-full",
				value: V(n).draft.recipe.lifetime,
				onChange: t[0] ||= (e) => V(n).setLifetime(e.target.value)
			}, [...t[2] ||= [Y("option", { value: "linked-to-effect" }, "Remove the granted Items too", -1), Y("option", { value: "detached" }, "Keep the granted Items", -1)]], 40, uM),
			V(n).draft.recipe.lifetime === "detached" ? (K(), q("label", dM, [za(Y("input", {
				"onUpdate:modelValue": t[1] ||= (e) => V(n).draft.recipe.ownerAction = e,
				type: "checkbox",
				class: "dui-checkbox",
				"true-value": "delete-after-grant",
				"false-value": "keep"
			}, null, 512), [[Tl, V(n).draft.recipe.ownerAction]]), t[3] ||= Z(" Remove the source Item after a successful grant ", -1)])) : Q("", !0)
		]));
	}
}), pM = { class: "dui-fieldset" }, mM = ["for"], hM = ["id", "aria-describedby"], gM = ["id"], _M = ["for"], vM = ["id", "aria-describedby"], yM = ["id"], bM = /* @__PURE__ */ U({
	__name: "AgeHeightFormula",
	props: { id: {} },
	setup(e) {
		let t = e, n = Uj(t.id), r = `${t.id}-${eo()}`;
		return (e, t) => (K(), q("fieldset", pM, [
			t[4] ||= Y("legend", { class: "dui-fieldset-legend" }, "Age and height formulas", -1),
			Y("label", {
				for: `${r}-age`,
				class: "dui-label"
			}, "Age formula (years)", 8, mM),
			za(Y("input", {
				id: `${r}-age`,
				"onUpdate:modelValue": t[0] ||= (e) => V(n).draft.ageFormula = e,
				"aria-label": "Age formula (years)",
				type: "text",
				class: "dui-input dui-input-sm app:w-full",
				placeholder: "15 + 1d10",
				"aria-describedby": `${r}-age-help`
			}, null, 8, hM), [[wl, V(n).draft.ageFormula]]),
			Y("p", { id: `${r}-age-help` }, [...t[2] ||= [
				Z("For example, ", -1),
				Y("code", null, "15 + 1d10", -1),
				Z(" gives 16–25 years.", -1)
			]], 8, gM),
			Y("label", {
				for: `${r}-height`,
				class: "dui-label"
			}, "Height formula (total inches)", 8, _M),
			za(Y("input", {
				id: `${r}-height`,
				"onUpdate:modelValue": t[1] ||= (e) => V(n).draft.heightFormula = e,
				"aria-label": "Height formula (total inches)",
				type: "text",
				class: "dui-input dui-input-sm app:w-full",
				placeholder: "57 + 2d10",
				"aria-describedby": `${r}-height-help`
			}, null, 8, vM), [[wl, V(n).draft.heightFormula]]),
			Y("p", { id: `${r}-height-help` }, [...t[3] ||= [
				Z(" 12 inches = 1 foot. ", -1),
				Y("code", null, "57 + 2d10", -1),
				Z(" gives 4′11″–6′5″. ", -1)
			]], 8, yM),
			t[5] ||= Y("p", null, " Enter one or both formulas. Leave a field blank to leave that detail unchanged. Use whole-number results; height must be positive. ", -1),
			t[6] ||= Y("p", null, " Character creation uses these formulas. Adding the Item to an actor rolls only missing details and keeps existing values. ", -1)
		]));
	}
}), xM = /* @__PURE__ */ "@sb.@tb.@wpb.@sbMultiplier.@tbMultiplier.@wpbMultiplier.@scale.@size.@age.@height.@weight.@status.@rank.@xp.@fate.@fortune.@resilience.@resolve.@corruption.@sin.@advantage.@bleeding.@poisoned.@ablaze.@deafened.@stunned.@entangled.@fatigued.@blinded.@broken".split("."), SM = { class: "dui-fieldset" }, CM = { class: "dui-collapse dui-collapse-arrow" }, wM = { class: "dui-collapse-content" }, TM = { class: "app:flex app:flex-wrap app:gap-1" }, EM = ["onClick", "onDragstart"], DM = /* @__PURE__ */ U({
	__name: "WoundFormula",
	props: { id: {} },
	setup(e) {
		let t = e, n = Uj(t.id), r = `${t.id}-${eo()}`, i = /* @__PURE__ */ B(), a = [
			...xM,
			"{Strength}",
			"[Toughness]",
			"{Endurance}",
			"[Endurance]"
		];
		async function o(e) {
			let t = i.value, r = t?.selectionStart ?? n.draft.formula.length, a = t?.selectionEnd ?? r;
			n.draft.formula = `${n.draft.formula.slice(0, r)}${e}${n.draft.formula.slice(a)}`, await Da(), t?.focus(), t?.setSelectionRange(r + e.length, r + e.length);
		}
		return (e, t) => (K(), q("fieldset", SM, [
			t[5] ||= Y("legend", { class: "dui-fieldset-legend" }, "Wound calculation", -1),
			Y("label", {
				for: r,
				class: "dui-label"
			}, "Formula"),
			za(Y("textarea", {
				id: r,
				ref_key: "textarea",
				ref: i,
				"onUpdate:modelValue": t[0] ||= (e) => V(n).draft.formula = e,
				"aria-label": "Formula",
				class: "dui-textarea app:w-full",
				rows: "3",
				onDragover: t[1] ||= Nl(() => {}, ["prevent"]),
				onDrop: t[2] ||= Nl((e) => o(e.dataTransfer?.getData("text/plain") ?? ""), ["prevent"])
			}, null, 544), [[wl, V(n).draft.formula]]),
			t[6] ||= ac("<p> Use <code>{Name}</code> for a characteristic or Skill total and <code>[Name]</code> for its bonus. For example: <code>[Endurance] + 2 * @tb</code>. </p><p><code>{Endurance|Strength}</code> uses Strength for that Skill. Arithmetic and <code>Math.floor</code>, <code>Math.ceil</code>, <code>Math.min</code>, and <code>Math.max</code> are supported. </p>", 2),
			Y("details", CM, [t[4] ||= Y("summary", { class: "dui-collapse-title" }, "Insert formula tokens", -1), Y("div", wM, [t[3] ||= Y("p", null, "Click a token to insert it at the cursor, or drag it into the formula.", -1), Y("div", TM, [(K(), q(G, null, W(a, (e) => Y("button", {
				key: e,
				type: "button",
				class: "dui-btn dui-btn-xs",
				draggable: "true",
				onClick: (t) => o(e),
				onDragstart: (t) => t.dataTransfer?.setData("text/plain", e)
			}, L(e), 41, EM)), 64))])])])
		]));
	}
}), OM = {
	key: 0,
	role: "alert",
	class: "dui-alert dui-alert-error"
}, kM = {
	key: 1,
	role: "status",
	class: "dui-alert dui-alert-success"
}, AM = ["disabled"], jM = ["for"], MM = ["id"], NM = {
	key: 3,
	class: "dui-fieldset"
}, PM = ["for"], FM = ["id"], IM = {
	key: 2,
	class: "dui-list",
	"aria-label": "To finish this effect"
}, LM = { class: "app:flex app:flex-wrap app:gap-2" }, RM = ["disabled"], zM = ["disabled"], BM = /* @__PURE__ */ U({
	__name: "EffectBuilderApp",
	props: {
		id: {},
		kind: {},
		destination: {},
		bridge: {},
		close: { type: Function }
	},
	setup(e) {
		let t = e, n = Uj(t.id);
		n.configure(t.kind, t.bridge, t.destination);
		let r = `${t.id}-${eo()}`, i = ZA.find((e) => e.kind === t.kind);
		return (t, a) => (K(), J(Yj, {
			title: `${V(i).title} Effect Builder`,
			description: V(i).description
		}, {
			default: H(() => [
				V(n).error ? (K(), q("div", OM, L(V(n).error), 1)) : Q("", !0),
				V(n).message ? (K(), q("div", kM, L(V(n).message), 1)) : Q("", !0),
				Y("fieldset", {
					class: "dui-fieldset",
					disabled: V(n).busy || V(n).created
				}, [
					X(Iv, {
						title: "Destination Item",
						description: "Drop the Item that will receive this effect.",
						documents: V(n).destination ? [V(n).destination] : [],
						"show-documents": "",
						variant: "compact",
						onDropData: V(n).dropDestination
					}, null, 8, ["documents", "onDropData"]),
					Y("label", {
						for: `${r}-name`,
						class: "dui-label"
					}, "Effect name", 8, jM),
					za(Y("input", {
						id: `${r}-name`,
						"onUpdate:modelValue": a[0] ||= (e) => V(n).draft.name = e,
						"aria-label": "Effect name",
						class: "dui-input app:w-full"
					}, null, 8, MM), [[wl, V(n).draft.name]]),
					e.kind === "wounds" ? (K(), J(DM, {
						key: 0,
						id: e.id
					}, null, 8, ["id"])) : e.kind === "age-height" ? (K(), J(bM, {
						key: 1,
						id: e.id
					}, null, 8, ["id"])) : e.kind === "grant" ? (K(), J($j, {
						key: 2,
						title: "Items to grant",
						items: V(n).draft.items,
						onDropData: a[1] ||= (e) => V(n).dropItem(e),
						onRemove: a[2] ||= (e) => V(n).removeItem(e)
					}, null, 8, ["items"])) : e.kind === "random" ? (K(), q("fieldset", NM, [
						a[7] ||= Y("legend", { class: "dui-fieldset-legend" }, "Random selection", -1),
						X(Iv, {
							title: "Grant RollTable",
							description: "Use document results pointing to Items or nested RollTables.",
							documents: V(n).draft.table ? [V(n).draft.table] : [],
							"show-documents": "",
							variant: "compact",
							onDropData: V(n).dropTable
						}, null, 8, ["documents", "onDropData"]),
						Y("label", {
							for: `${r}-rolls`,
							class: "dui-label"
						}, "Number of rolls", 8, PM),
						za(Y("input", {
							id: `${r}-rolls`,
							"onUpdate:modelValue": a[3] ||= (e) => V(n).draft.count = e,
							"aria-label": "Number of rolls",
							type: "number",
							min: "1",
							max: "100",
							step: "1",
							class: "dui-input"
						}, null, 8, FM), [[
							wl,
							V(n).draft.count,
							void 0,
							{ number: !0 }
						]]),
						a[8] ||= Y("p", null, " Rolls leave results available for future rolls. An Item may be granted more than once. ", -1)
					])) : (K(), J(sM, {
						key: 4,
						id: e.id
					}, null, 8, ["id"])),
					e.kind !== "wounds" && e.kind !== "age-height" ? (K(), J(fM, {
						key: 5,
						id: e.id
					}, null, 8, ["id"])) : Q("", !0)
				], 8, AM),
				!V(n).created && V(n).problems.length ? (K(), q("ul", IM, [(K(!0), q(G, null, W(V(n).problems, (e) => (K(), q("li", { key: e }, L(e), 1))), 128))])) : Q("", !0),
				Y("div", LM, [
					V(n).created ? Q("", !0) : (K(), q("button", {
						key: 0,
						type: "button",
						class: "dui-btn dui-btn-primary",
						disabled: !V(n).ready,
						onClick: a[4] ||= (...e) => V(n).create && V(n).create(...e)
					}, L(V(n).busy ? "Working…" : "Add effect to Item"), 9, RM)),
					V(n).destination ? (K(), q("button", {
						key: 1,
						type: "button",
						class: "dui-btn",
						onClick: a[5] ||= (...e) => V(n).openDestination && V(n).openDestination(...e)
					}, " Open destination Item ")) : Q("", !0),
					Y("button", {
						type: "button",
						class: "dui-btn dui-btn-ghost",
						disabled: V(n).busy,
						onClick: a[6] ||= (...t) => e.close && e.close(...t)
					}, L(V(n).created ? "Done" : "Cancel"), 9, zM)
				])
			]),
			_: 1
		}, 8, ["title", "description"]));
	}
});
//#endregion
//#region src/module/wfrp/effect-builders/bridge.ts
async function VM(t, n) {
	let r = qA(await fromUuid(t)), i = Hj(n, e);
	if (n.kind === "age-height") {
		let e = Oe(ue(r.toObject().effects));
		for (let t of ["age", "height"]) {
			let r = n[t === "age" ? "ageFormula" : "heightFormula"].trim();
			if (r) {
				if (!Roll.validate(r)) throw Error(`Invalid ${t} formula. Use a number or dice formula.`);
				if (e[t] !== void 0) throw Error(`This Item already has an enabled ${t} formula. Edit its existing effect instead.`);
			}
		}
	}
	let a = n.kind === "grant" ? n.items : n.kind === "choice" ? n.groups.flatMap((e) => e.items) : [];
	for (let e of a) {
		if (e.uuid === t) throw Error("An Item cannot grant itself.");
		Qe(await fromUuid(e.uuid), `The granted Item ${e.name} is no longer available.`);
	}
	if (n.kind === "random" && await XA(n.table.uuid, t), !r.createEmbeddedDocuments) throw Error("This Item cannot contain Active Effects.");
	await r.createEmbeddedDocuments("ActiveEffect", [i]);
}
var HM = {
	resolveItem: JA,
	async resolveTable(e) {
		return YA(await KA(e));
	},
	create: VM,
	async openItem(e) {
		Qe(await fromUuid(e)).sheet?.render(!0);
	}
}, UM = 0, WM = class extends EC {
	kind;
	destination;
	storeId;
	constructor(t, n = null) {
		let r = `${e}-effect-${++UM}`;
		super({
			id: r,
			window: { title: `${ZA.find((e) => e.kind === t).title} Effect Builder` }
		}), this.kind = t, this.destination = n, this.storeId = r;
	}
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		classes: [e],
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
		return BM;
	}
	getVueProps() {
		return {
			id: this.storeId,
			kind: this.kind,
			destination: this.destination,
			bridge: HM,
			close: () => this.close()
		};
	}
	async _preClose(e) {
		let t = Uj(this.storeId);
		await super._preClose(e), t.$dispose(), delete fC.state.value[`effect-builder:${this.storeId}`];
	}
}, GM = { key: 0 }, KM = { class: "dui-list" }, qM = { class: "dui-list-col-grow" }, JM = ["aria-label", "onClick"], YM = /* @__PURE__ */ U({
	__name: "EffectBuildersApp",
	props: {
		destination: {},
		openBuilder: { type: Function }
	},
	setup(e) {
		return (t, n) => (K(), J(Yj, {
			title: "Effect Builders",
			description: "Choose an effect to create, then select the Item that will carry it."
		}, {
			default: H(() => [
				e.destination ? (K(), q("p", GM, [n[0] ||= Z(" Destination: ", -1), Y("strong", null, L(e.destination.name), 1)])) : Q("", !0),
				Y("ul", KM, [(K(!0), q(G, null, W(V(ZA), (t) => (K(), q("li", {
					key: t.kind,
					class: "dui-list-row"
				}, [Y("div", qM, [Y("strong", null, L(t.title), 1), Y("p", null, L(t.description), 1)]), Y("button", {
					type: "button",
					class: "dui-btn",
					"aria-label": `Open ${t.title} Effect Builder`,
					onClick: (n) => e.openBuilder(t.kind)
				}, " Open ", 8, JM)]))), 128))]),
				n[1] ||= Y("p", null, "Find this launcher and individual shortcuts in the Effect Builders macro compendium.", -1)
			]),
			_: 1
		}));
	}
}), XM = class extends EC {
	destination = null;
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${e}-effect-builders-{id}`,
		classes: [e],
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
		return YM;
	}
	getVueProps() {
		return {
			destination: this.destination,
			openBuilder: (e) => new WM(e, this.destination).render(!0)
		};
	}
};
//#endregion
//#region src/module/wfrp/effect-builders/open.ts
async function ZM(e) {
	let t = new XM();
	e && (t.destination = GA(qA(await fromUuid(e)))), await t.render(!0);
}
async function QM(e, t) {
	await new WM(e, t ? GA(qA(await fromUuid(t))) : null).render(!0);
}
var $M = (e) => QM("wounds", e), eN = (e) => QM("grant", e), tN = (e) => QM("random", e), nN = (e) => QM("choice", e), rN = (e) => QM("age-height", e), iN = { key: 0 }, aN = ["disabled"], oN = { class: "dui-fieldset-legend" }, sN = {
	key: 0,
	class: "app:flex app:flex-wrap app:gap-2"
}, cN = { key: 1 }, lN = {
	key: 2,
	class: "app:max-w-full app:overflow-x-auto"
}, uN = { class: "dui-table dui-table-sm" }, dN = ["onClick"], fN = { class: "app:flex app:flex-wrap app:gap-2" }, pN = ["onClick"], mN = ["aria-label", "onClick"], hN = /* @__PURE__ */ U({
	__name: "SpeciesItemEffects",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = qk(e.uuid), n = $(() => [
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
		return (r, i) => (K(), q(G, null, [V(t).dirty ? (K(), q("p", iN, "Save or reload Item changes before editing effects.")) : Q("", !0), (K(!0), q(G, null, W(n.value, (n) => (K(), q(G, { key: n.name }, [n.entries.length || n.name === "Effects" ? (K(), q("fieldset", {
			key: 0,
			class: "dui-fieldset",
			disabled: !e.editable || V(t).dirty
		}, [
			Y("legend", oN, L(n.name), 1),
			n.name === "Effects" ? (K(), q("div", sN, [Y("button", {
				type: "button",
				class: "dui-btn dui-btn-sm",
				onClick: i[0] ||= (e) => V(t).effectAction("create")
			}, " Add Effect "), Y("button", {
				type: "button",
				class: "dui-btn dui-btn-sm",
				onClick: i[1] ||= (t) => V(ZM)(e.uuid)
			}, " Effect Builders ")])) : Q("", !0),
			n.entries.length ? Q("", !0) : (K(), q("p", cN, "No effects.")),
			n.entries.length ? (K(), q("div", lN, [Y("table", uN, [i[2] ||= Y("thead", null, [Y("tr", null, [
				Y("th", { scope: "col" }, "Effect"),
				Y("th", { scope: "col" }, "Type"),
				Y("th", { scope: "col" }, [Y("span", { class: "app:sr-only" }, "Actions")])
			])], -1), Y("tbody", null, [(K(!0), q(G, null, W(n.entries, (e) => (K(), q("tr", { key: e.id }, [
				Y("td", null, [Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm dui-btn-ghost app:h-auto app:whitespace-normal",
					onClick: (n) => V(t).effectAction("edit", e.id)
				}, L(e.name), 9, dN)]),
				Y("td", null, L(e.type), 1),
				Y("td", null, [Y("div", fN, [Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					onClick: (n) => V(t).effectAction("toggle", e.id)
				}, L(e.disabled ? "Enable" : "Disable"), 9, pN), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					"aria-label": `Delete ${e.name}`,
					onClick: (n) => V(t).effectAction("delete", e.id)
				}, " Delete ", 8, mN)])])
			]))), 128))])])])) : Q("", !0)
		], 8, aN)) : Q("", !0)], 64))), 128))], 64));
	}
}), gN = { class: "app:flex app:items-center app:gap-3" }, _N = ["disabled"], vN = { class: "dui-avatar" }, yN = { class: "app:w-20" }, bN = ["src"], xN = { class: "app:min-w-0 app:flex-1" }, SN = ["disabled"], CN = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, wN = {
	class: "dui-tabs dui-tabs-border",
	role: "tablist",
	"aria-label": "Species Item"
}, TN = [
	"id",
	"aria-selected",
	"aria-controls"
], EN = [
	"id",
	"aria-selected",
	"aria-controls"
], DN = [
	"id",
	"aria-selected",
	"aria-controls"
], ON = { class: "app:min-h-0 app:min-w-0 app:flex-1 app:overflow-y-auto" }, kN = ["id", "aria-labelledby"], AN = ["id", "aria-labelledby"], jN = ["id", "aria-labelledby"], MN = { class: "app:flex app:flex-wrap app:items-center app:gap-2" }, NN = ["disabled"], PN = ["disabled"], FN = {
	class: "app:text-sm",
	role: "status"
}, IN = /* @__PURE__ */ U({
	__name: "SpeciesItemApp",
	props: {
		uuid: {},
		editable: { type: Boolean },
		bridge: {}
	},
	setup(e) {
		let t = e, n = qk(t.uuid);
		return n.configure(t.bridge), (t, r) => (K(), q("form", {
			class: "app:flex app:h-full app:min-w-0 app:flex-col app:gap-2",
			onSubmit: r[6] ||= Nl((e) => V(n).save(), ["prevent"])
		}, [
			Y("header", gN, [Y("button", {
				type: "button",
				class: "dui-btn dui-btn-outline app:h-auto",
				"aria-label": "Choose Species image",
				disabled: !e.editable || V(n).isSaving,
				onClick: r[0] ||= (e) => V(n).chooseImage()
			}, [Y("div", vN, [Y("div", yN, [Y("img", {
				src: V(n).draft.img,
				alt: "Species image",
				width: "80",
				height: "80",
				class: "app:object-contain"
			}, null, 8, bN)])])], 8, _N), Y("label", xN, [r[7] ||= Y("span", { class: "app:sr-only" }, "Name", -1), za(Y("input", {
				"onUpdate:modelValue": r[1] ||= (e) => V(n).draft.name = e,
				"aria-label": "Species name",
				class: "dui-input dui-input-ghost app:w-full app:text-center app:text-xl",
				disabled: !e.editable || !V(n).isLoaded || V(n).isSaving,
				required: ""
			}, null, 8, SN), [[wl, V(n).draft.name]])])]),
			V(n).error ? (K(), q("div", CN, L(V(n).error), 1)) : Q("", !0),
			Y("div", wN, [
				Y("button", {
					id: `${e.uuid}-description-tab`,
					type: "button",
					role: "tab",
					class: I(["dui-tab app:flex-1", { "dui-tab-active": V(n).tab === "description" }]),
					"aria-selected": V(n).tab === "description",
					"aria-controls": `${e.uuid}-description-panel`,
					onClick: r[2] ||= (e) => V(n).tab = "description"
				}, " Description ", 10, TN),
				Y("button", {
					id: `${e.uuid}-details-tab`,
					type: "button",
					role: "tab",
					class: I(["dui-tab app:flex-1", { "dui-tab-active": V(n).tab === "details" }]),
					"aria-selected": V(n).tab === "details",
					"aria-controls": `${e.uuid}-details-panel`,
					onClick: r[3] ||= (e) => V(n).tab = "details"
				}, " Details ", 10, EN),
				Y("button", {
					id: `${e.uuid}-effects-tab`,
					type: "button",
					role: "tab",
					class: I(["dui-tab app:flex-1", { "dui-tab-active": V(n).tab === "effects" }]),
					"aria-selected": V(n).tab === "effects",
					"aria-controls": `${e.uuid}-effects-panel`,
					onClick: r[4] ||= (e) => V(n).tab = "effects"
				}, " Effects ", 10, DN)
			]),
			Y("div", ON, [
				za(Y("section", {
					id: `${e.uuid}-description-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-description-tab`
				}, [V(n).isLoaded ? (K(), J(HA, {
					key: V(n).revision,
					uuid: e.uuid,
					editable: e.editable
				}, null, 8, ["uuid", "editable"])) : Q("", !0)], 8, kN), [[Gc, V(n).tab === "description"]]),
				za(Y("section", {
					id: `${e.uuid}-details-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-details-tab`
				}, [X(zA, {
					uuid: e.uuid,
					editable: e.editable && V(n).isLoaded && !V(n).isSaving
				}, null, 8, ["uuid", "editable"])], 8, AN), [[Gc, V(n).tab === "details"]]),
				za(Y("section", {
					id: `${e.uuid}-effects-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-effects-tab`
				}, [X(hN, {
					uuid: e.uuid,
					editable: e.editable && V(n).isLoaded && !V(n).isSaving
				}, null, 8, ["uuid", "editable"])], 8, jN), [[Gc, V(n).tab === "effects"]])
			]),
			Y("footer", MN, [
				Y("button", {
					type: "submit",
					class: "dui-btn dui-btn-sm dui-btn-primary",
					disabled: !e.editable || !V(n).isLoaded || V(n).isSaving
				}, " Save Item ", 8, NN),
				Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					disabled: V(n).isSaving,
					onClick: r[5] ||= (e) => V(n).reload()
				}, " Reload Item ", 8, PN),
				Y("span", FN, L(V(n).dirty ? "Unsaved changes" : V(n).message || "Saved"), 1)
			])
		], 32));
	}
});
//#endregion
//#region src/module/wfrp/species-item/editing.ts
function LN(e) {
	return (e.effects?.contents ?? []).map((e) => {
		let t = e.toObject(), n = _(t.system) ? t.system : {}, r = _(n.transferData) ? n.transferData : {};
		return {
			id: e.id,
			name: e.name,
			disabled: t.disabled === !0,
			temporary: e.isTemporary === !0,
			type: typeof r.type == "string" ? r.type : ""
		};
	});
}
async function RN(e, t, n) {
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
function zN(e, t) {
	new foundry.applications.apps.FilePicker.implementation({
		type: "image",
		current: e,
		callback: t
	}).render(!0);
}
//#endregion
//#region src/module/wfrp/species-item/notes.ts
function BN(e) {
	let t = /* @__PURE__ */ new Map();
	return {
		mount: (n, r, i, a, o) => {
			let s, c = !1, l = () => {
				s && o(s.value);
			};
			return (async () => {
				let o = await foundry.applications.ux.TextEditor.implementation.enrichHTML(i, {
					secrets: game.user?.isGM === !0,
					relativeTo: e
				});
				c || (s = new foundry.applications.elements.HTMLProseMirrorElement({
					value: i,
					enriched: o,
					toggled: !0
				}), s.name = `system.${r}.value`, s.disabled = !a, s.addEventListener("input", l), s.addEventListener("change", l), t.set(r, s), n.append(s));
			})().catch((e) => {
				c || ui.notifications?.error(`Could not display Species notes: ${String(e)}`);
			}), () => {
				c = !0, s && (s.removeEventListener("input", l), s.removeEventListener("change", l), s.remove(), t.get(r) === s && t.delete(r));
			};
		},
		edit(e) {
			t.get(e)?.setAttribute("open", "");
		},
		flush() {
			for (let e of t.values()) e.classList.contains("active") && e.save();
		}
	};
}
//#endregion
//#region src/module/wfrp/species-item/parent.ts
async function VN(e) {
	if (!e.uuid && !e.id) return null;
	let t = ke(e, Se()) ?? (e.uuid ? await fromUuid(e.uuid) : void 0);
	if (!_(t) || typeof t.type != "string" || !fe({ type: t.type }) || typeof t.toObject != "function") throw Error("The parent Species Item could not be resolved.");
	let n = t.toObject.call(t);
	if (!_(n)) throw Error("The parent Species Item has no source data.");
	return me(n.system);
}
//#endregion
//#region src/module/wfrp/species-item/bridge.ts
function HN(e) {
	let t = "", n = BN(e), r = () => {
		let n = pe(e);
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
			let t = await fromUuid(e), n = _(t) ? t.sheet : void 0;
			if (_(n) && typeof n.render == "function") n.render.call(n, !0);
			else throw Error("The referenced document could not be opened.");
		},
		effects: () => LN(e),
		effectAction: (t, n) => RN(e, t, n),
		chooseImage: zN,
		mountNotes: n.mount,
		load: r,
		loadParent: VN,
		async save(n) {
			if (t !== JSON.stringify(e.toObject())) throw Error("This Item changed in another window. Reload its sheet before saving.");
			return await Ce(e, n), r();
		},
		async resolveDrop(e) {
			let t = JSON.parse(e), n = _(t) ? t.uuid : void 0;
			if (typeof n != "string") throw Error("Drop a Species, Skill, Talent, or RollTable document.");
			let r = await fromUuid(n);
			if (!_(r) || typeof r.uuid != "string" || typeof r.id != "string" || typeof r.name != "string") throw Error("The dropped document could not be resolved.");
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
//#region src/module/apps/species-item/view/SpeciesItemApplication.ts
var UN = class extends foundry.applications.api.DocumentSheetV2 {
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		tag: "div",
		classes: [e],
		position: {
			width: 640,
			height: 780
		},
		window: {
			resizable: !0,
			icon: "fa-solid fa-people-group"
		}
	};
	#e = new TC();
	async _renderHTML(e, t) {
		return this.#e.createRoot();
	}
	_replaceHTML(e, t, n) {
		this.#e.mount(e, t, IN, {
			uuid: this.document.uuid,
			editable: this.isEditable && game.user?.isGM === !0,
			bridge: HN(this.document)
		});
	}
	async _preClose(e) {
		this.#e.unmount(), await super._preClose(e);
	}
};
//#endregion
//#region src/module/init/species-sheet.ts
function WN() {
	foundry.applications.apps.DocumentSheetConfig.registerSheet(Item, e, UN, {
		types: [de],
		makeDefault: !0,
		label: "Species Customizer"
	});
}
//#endregion
//#region src/module/wfrp/species-item/documents/model.ts
function GN() {
	let e = CONFIG.Item.dataModels.species;
	if (e) {
		CONFIG.Item.dataModels[de] = e;
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
				characteristics: new e.SchemaField(Object.fromEntries(Object.values(E).map((t) => [t, new e.SchemaField({
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
	CONFIG.Item.dataModels[de] = n;
}
//#endregion
//#region src/module/apps/workbench/view/WorkbenchApp.vue?vue&type=script&setup=true&lang.ts
var KN = { class: "dui-list" }, qN = { class: "dui-list-row" }, JN = { class: "dui-list-row" }, YN = { class: "dui-list-row" }, XN = /* @__PURE__ */ U({
	__name: "WorkbenchApp",
	props: {
		openNpcBuilder: { type: Function },
		openEffectBuilders: { type: Function },
		openSpeciesTableEditor: { type: Function }
	},
	setup(e) {
		return (t, n) => (K(), J(Yj, {
			description: "Open a focused WFRP4e authoring workflow.",
			title: "Customizer Workbench"
		}, {
			default: H(() => [Y("ul", KN, [
				Y("li", qN, [n[3] ||= Y("div", { class: "dui-list-col-grow" }, [Y("strong", null, "NPC Builder"), Y("p", null, "Build an NPC from a base Actor, Careers, traits, trappings, and spells.")], -1), Y("button", {
					"aria-label": "Open NPC Builder",
					class: "dui-btn dui-btn-primary",
					type: "button",
					onClick: n[0] ||= (...t) => e.openNpcBuilder && e.openNpcBuilder(...t)
				}, " Open ")]),
				Y("li", JN, [n[4] ||= Y("div", { class: "dui-list-col-grow" }, [Y("strong", null, "Effect Builders"), Y("p", null, "Create wound formulas, Item grants, random grants, and player choices as effects.")], -1), Y("button", {
					"aria-label": "Open Effect Builders",
					class: "dui-btn",
					type: "button",
					onClick: n[1] ||= (...t) => e.openEffectBuilders && e.openEffectBuilders(...t)
				}, " Open ")]),
				Y("li", YN, [n[5] ||= Y("div", { class: "dui-list-col-grow" }, [Y("strong", null, "Species Table Editor"), Y("p", null, "Drop Species Items into the world's species roll table and adjust their chances.")], -1), Y("button", {
					"aria-label": "Open Species Table Editor",
					class: "dui-btn",
					type: "button",
					onClick: n[2] ||= (...t) => e.openSpeciesTableEditor && e.openSpeciesTableEditor(...t)
				}, " Open ")])
			])]),
			_: 1
		}));
	}
});
//#endregion
//#region src/module/apps/species-table/functions/draft.ts
function ZN(e, t) {
	let { option: n } = t, r = e.rows.find((e) => e.speciesKey === n.key);
	if (r?.itemUuid && r.itemUuid !== n.itemUuid) throw Error(`A different Species Item already uses “${n.key}” in this table.`);
	r || (r = {
		speciesKey: n.key,
		name: n.label,
		weight: 1,
		sources: []
	}, e.rows.push(r)), n.itemUuid && (r.itemUuid = n.itemUuid), r.name = n.label, n.itemUuid && (r.journalUuid = n.itemUuid);
	for (let e of t.sources) r.sources.some((t) => t.uuid === e.uuid) || r.sources.push(e);
}
function QN(e, t) {
	let n = bt(e, t, !0);
	e.name.trim() || n.push("Enter a table name.");
	let r = e.rows.reduce((e, t) => e + t.weight, 0);
	Number.isSafeInteger(r) || n.push("The total weight must be a safe whole number.");
	for (let r of e.rows) {
		let e = t.find((e) => e.key === r.speciesKey);
		e && r.name !== e.label && n.push(`“${r.name}” must use WFRP's species name “${e.label}”. Reload the editor.`), r.name.trim() || n.push("Every species needs a name."), !r.itemUuid && t.some((e) => !e.itemUuid && e.key !== r.speciesKey && e.label === r.name) && n.push(`“${r.name}” also names another species. WFRP needs distinct species names.`);
	}
	return [...new Set(n)];
}
//#endregion
//#region src/module/apps/species-table/state/index.ts
function $N(e) {
	return bu(`species-table:${e}`, () => {
		let e = /* @__PURE__ */ B({
			...yt(),
			rows: []
		}), t = /* @__PURE__ */ B([]), n = /* @__PURE__ */ B(""), r = /* @__PURE__ */ B(!1), i = /* @__PURE__ */ B(!1), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(""), s = /* @__PURE__ */ B(!0), c = /* @__PURE__ */ B(""), l, u = $(() => QN(e.value, t.value)), d = $(() => xt(e.value.rows)), f = $(() => e.value.rows.reduce((e, t) => e + Number(t.weight || 0), 0)), p = $(() => t.value.filter((t) => !e.value.rows.some((e) => e.speciesKey === t.key))), m = $(() => i.value && !r.value && !u.value.length);
		function h(e) {
			l = e;
		}
		function g(r) {
			e.value = r.draft, t.value = r.options, n.value = r.revision, i.value = !0, c.value = "";
		}
		async function _(e) {
			if (!r.value) {
				r.value = !0, a.value = "", o.value = "";
				try {
					await e();
				} catch (e) {
					a.value = e instanceof Error ? e.message : String(e);
				} finally {
					r.value = !1;
				}
			}
		}
		async function v() {
			await _(async () => {
				g(await l.load());
			});
		}
		async function y(n) {
			i.value && await _(async () => {
				let r = await l.resolveDrop(n);
				ZN(e.value, r);
				let i = t.value.findIndex((e) => e.key === r.option.key);
				i === -1 ? t.value.push(r.option) : t.value[i] = r.option, o.value = r.message;
			});
		}
		async function b() {
			let n = t.value.find((e) => e.key === c.value);
			n && (n.itemUuid ? await y(JSON.stringify({ uuid: n.itemUuid })) : ZN(e.value, {
				option: n,
				sources: [],
				message: ""
			}), c.value = "");
		}
		function x(t) {
			e.value.rows.splice(t, 1), o.value = "";
		}
		async function S() {
			m.value && await _(async () => {
				let t = await l.save(JSON.parse(JSON.stringify(e.value)), n.value, s.value);
				g(t), a.value = t.registrationError ? `Table saved, but WFRP registration failed: ${t.registrationError} Save again to retry.` : "", o.value = t.draft.isRegistered ? "Saved the world's Species table." : "Saved the Species table.";
			});
		}
		return {
			draft: e,
			options: t,
			busy: r,
			loaded: i,
			error: a,
			message: o,
			register: s,
			selected: c,
			problems: u,
			summaries: d,
			total: f,
			available: p,
			ready: m,
			configure: h,
			load: v,
			drop: y,
			addSelected: b,
			remove: x,
			save: S
		};
	})(fC);
}
//#endregion
//#region src/module/apps/species-table/view/SpeciesTableRows.vue?vue&type=script&setup=true&lang.ts
var eP = { class: "dui-fieldset app:min-w-0" }, tP = { class: "app:max-w-full app:overflow-x-auto" }, nP = { class: "dui-table dui-table-sm" }, rP = { scope: "row" }, iP = { class: "app:sr-only" }, aP = ["onUpdate:modelValue", "aria-label"], oP = ["aria-label", "onClick"], sP = { key: 0 }, cP = /* @__PURE__ */ U({
	__name: "SpeciesTableRows",
	props: { id: {} },
	setup(e) {
		let t = $N(e.id), n = new Intl.NumberFormat(void 0, {
			style: "percent",
			maximumFractionDigits: 2
		});
		return (e, r) => (K(), q("fieldset", eP, [
			r[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Roll weights", -1),
			r[2] ||= Y("p", null, "A species with weight 2 is twice as likely as one with weight 1.", -1),
			Y("div", tP, [Y("table", nP, [
				Y("caption", null, " Species chances · " + L(V(t).problems.length ? "Finish the entries to calculate a valid roll" : `Roll 1d${V(t).total}`), 1),
				r[0] ||= Y("thead", null, [Y("tr", null, [
					Y("th", { scope: "col" }, "Species"),
					Y("th", { scope: "col" }, "Weight"),
					Y("th", { scope: "col" }, "Chance"),
					Y("th", { scope: "col" }, "Range"),
					Y("th", { scope: "col" }, "Actions")
				])], -1),
				Y("tbody", null, [(K(!0), q(G, null, W(V(t).draft.rows, (e, r) => (K(), q("tr", { key: e.speciesKey || e.resultId || r }, [
					Y("th", rP, L(e.name || "Unassigned species"), 1),
					Y("td", null, [Y("label", null, [Y("span", iP, "Weight for " + L(e.name), 1), za(Y("input", {
						"onUpdate:modelValue": (t) => e.weight = t,
						"aria-label": `Weight for ${e.name}`,
						class: "dui-input dui-input-sm app:w-20",
						type: "number",
						min: "1",
						step: "1"
					}, null, 8, aP), [[
						wl,
						e.weight,
						void 0,
						{ number: !0 }
					]])])]),
					Y("td", null, L(V(t).problems.length ? "—" : V(n).format(V(t).summaries[r].chance)), 1),
					Y("td", null, L(V(t).problems.length ? "—" : V(t).summaries[r].range.join("–")), 1),
					Y("td", null, [Y("button", {
						type: "button",
						class: "dui-btn dui-btn-ghost dui-btn-sm",
						"aria-label": `Remove ${e.name}`,
						onClick: (e) => V(t).remove(r)
					}, " Remove ", 8, oP)])
				]))), 128))])
			])]),
			V(t).draft.rows.length ? Q("", !0) : (K(), q("p", sP, "Add a species or drop a Species Item to start."))
		]));
	}
}), lP = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, uP = {
	key: 1,
	class: "dui-alert dui-alert-info",
	role: "status"
}, dP = {
	key: 2,
	role: "status"
}, fP = ["disabled"], pP = ["for"], mP = ["id"], hP = { key: 0 }, gP = { key: 1 }, _P = ["for"], vP = { class: "app:flex app:flex-wrap app:gap-2" }, yP = ["id"], bP = ["value"], xP = ["disabled"], SP = {
	key: 2,
	class: "dui-label"
}, CP = {
	key: 4,
	class: "dui-list",
	"aria-label": "Before saving"
}, wP = ["disabled"], TP = ["disabled"], EP = ["disabled"], DP = /* @__PURE__ */ U({
	__name: "SpeciesTableApp",
	props: {
		id: {},
		bridge: {},
		close: { type: Function }
	},
	setup(e) {
		let t = e, n = $N(t.id);
		return n.configure(t.bridge), go(() => n.load()), (t, r) => (K(), J(Yj, {
			title: "Species Table Editor",
			description: "Choose which species can be rolled during character creation, and how often."
		}, {
			actions: H(() => [
				Y("button", {
					type: "button",
					class: "dui-btn dui-btn-primary",
					disabled: !V(n).ready,
					onClick: r[4] ||= (...e) => V(n).save && V(n).save(...e)
				}, " Save table ", 8, wP),
				Y("button", {
					type: "button",
					class: "dui-btn",
					disabled: V(n).busy,
					onClick: r[5] ||= (...e) => V(n).load && V(n).load(...e)
				}, " Reload saved table ", 8, TP),
				Y("button", {
					type: "button",
					class: "dui-btn dui-btn-ghost",
					disabled: V(n).busy,
					onClick: r[6] ||= (...t) => e.close && e.close(...t)
				}, " Close ", 8, EP)
			]),
			default: H(() => [
				V(n).error ? (K(), q("div", lP, L(V(n).error), 1)) : Q("", !0),
				V(n).message ? (K(), q("div", uP, L(V(n).message), 1)) : Q("", !0),
				V(n).busy ? (K(), q("p", dP, "Working…")) : Q("", !0),
				V(n).loaded ? (K(), q("fieldset", {
					key: 3,
					class: "dui-fieldset app:min-w-0",
					disabled: V(n).busy
				}, [
					Y("label", {
						for: `${e.id}-name`,
						class: "dui-label"
					}, "Table name", 8, pP),
					za(Y("input", {
						id: `${e.id}-name`,
						"onUpdate:modelValue": r[0] ||= (e) => V(n).draft.name = e,
						"aria-label": "Table name",
						class: "dui-input app:w-full"
					}, null, 8, mP), [[wl, V(n).draft.name]]),
					V(n).draft.ownership === "external" ? (K(), q("p", hP, " Saving creates a Customizer copy of this table. The source table is preserved. ")) : V(n).draft.isRegistered ? (K(), q("p", gP, "This is the world's active Species table.")) : Q("", !0),
					X(Iv, {
						title: "Species Items",
						description: "Drop a Species Item here. World and compendium Items are linked directly.",
						variant: "compact",
						disabled: V(n).busy,
						onDropData: V(n).drop
					}, null, 8, ["disabled", "onDropData"]),
					r[9] ||= Y("p", null, "A subspecies row selects that subspecies directly.", -1),
					Y("label", {
						for: `${e.id}-species`,
						class: "dui-label"
					}, "Add an available species", 8, _P),
					Y("div", vP, [za(Y("select", {
						id: `${e.id}-species`,
						"onUpdate:modelValue": r[1] ||= (e) => V(n).selected = e,
						"aria-label": "Add an available species",
						class: "dui-select app:max-w-full"
					}, [r[7] ||= Y("option", { value: "" }, "Choose a species…", -1), (K(!0), q(G, null, W(V(n).available, (e) => (K(), q("option", {
						key: e.key,
						value: e.key
					}, L(e.label), 9, bP))), 128))], 8, yP), [[Dl, V(n).selected]]), Y("button", {
						type: "button",
						class: "dui-btn",
						disabled: !V(n).selected,
						onClick: r[2] ||= (...e) => V(n).addSelected && V(n).addSelected(...e)
					}, " Add species ", 8, xP)]),
					X(cP, { id: e.id }, null, 8, ["id"]),
					!V(n).draft.isRegistered || V(n).draft.ownership === "external" ? (K(), q("label", SP, [za(Y("input", {
						"onUpdate:modelValue": r[3] ||= (e) => V(n).register = e,
						type: "checkbox",
						class: "dui-checkbox"
					}, null, 512), [[Tl, V(n).register]]), r[8] ||= Z(" Use this table for the world's species rolls ", -1)])) : Q("", !0)
				], 8, fP)) : Q("", !0),
				V(n).loaded && V(n).problems.length ? (K(), q("ul", CP, [(K(!0), q(G, null, W(V(n).problems, (e) => (K(), q("li", { key: e }, L(e), 1))), 128))])) : Q("", !0)
			]),
			_: 1
		}));
	}
}), OP = "species", kP = "tableSettings";
async function AP(e) {
	let t = game.tables?.contents ?? [], n = jP(), r = MP(t, t.filter(Bt), n);
	return {
		draft: r ? NP(r, e, n[0] === r.id) : IP(),
		runtimeOptions: e
	};
}
function jP() {
	let e = game.settings.get(n, kP), t = _(e) ? e[OP] : void 0;
	return typeof t == "string" ? t.split(",").map((e) => e.trim()).filter(Boolean) : [];
}
function MP(e, t, r) {
	if (t.length > 1) {
		let e = t.filter((e) => r[0] === e.id);
		if (e.length === 1) return e[0];
		throw Error("Multiple Species Builder-managed Species tables exist. Remove the duplicate and reload.");
	}
	if (t[0]) return t[0];
	for (let t of r) {
		let n = e.find((e) => e.id === t);
		if (n) return n;
	}
	return e.find((e) => e.getFlag(n, "key") === OP);
}
function NP(e, t, n) {
	let r = e.toObject(), i = (Array.isArray(r.results) ? r.results : []).flatMap((e) => PP(e, t));
	return i.sort((e, t) => FP(e.source) - FP(t.source)), {
		isRegistered: n,
		name: e.name,
		ownership: Bt(e) ? "managed" : "external",
		requiresLinkRepair: i.some((e) => e.requiresLinkRepair),
		rows: i.map(({ row: e }) => e),
		tableId: e.id
	};
}
function PP(e, t) {
	if (!_(e)) return [];
	let r = y(e, ["name"]), i = Ct(y(e, ["description"])), a = y(e, [
		"flags",
		n,
		"species"
	]), o = y(e, ["documentUuid"]), s = i?.label || r, c = St(a, s, t), l = y(e, ["_id"]), u = y(e, ["type"]);
	return [{
		requiresLinkRepair: u === "document" ? !o : !i || i.label !== r.trim() || u !== "text",
		row: {
			...o || i ? { journalUuid: o || i.uuid } : {},
			name: s,
			...l ? { resultId: l } : {},
			speciesKey: c,
			weight: wt(e)
		},
		source: e
	}];
}
function FP(e) {
	let t = v(e, ["range"]), n = Array.isArray(t) ? Number(t[0]) : 0;
	return Number.isInteger(n) ? n : 0;
}
function IP() {
	return {
		isRegistered: !1,
		name: "Species",
		ownership: "new",
		requiresLinkRepair: !1,
		rows: []
	};
}
//#endregion
//#region src/module/wfrp/species-table/bridge.ts
var LP = !1;
function RP(e) {
	return JSON.stringify({
		table: e ? game.tables?.get(e)?.toObject() : null,
		settings: game.settings.get("wfrp4e", "tableSettings")
	});
}
async function zP() {
	et();
	let e = tt(), { draft: t } = await AP(e), n = [];
	for (let r of t.rows) {
		let t = r.journalUuid;
		if (t && (t.startsWith("Item.") || t.includes(".Item.") || r.speciesKey.startsWith("item:"))) {
			let i = await rt(t), a = {
				key: `item:${i.uuid}`,
				label: i.name,
				itemUuid: i.uuid
			};
			e.some((e) => e.key === a.key) || e.push(a), n.push({
				...r,
				name: i.name,
				speciesKey: a.key,
				itemUuid: i.uuid,
				sources: [{
					uuid: i.uuid,
					name: i.name
				}]
			});
		} else n.push({
			...r,
			sources: []
		});
	}
	return {
		draft: {
			...t,
			rows: n
		},
		options: e,
		revision: RP(t.tableId)
	};
}
async function BP(e) {
	if ((await zP()).revision !== e) throw Error("The world's Species table or table settings changed. Reload the editor before saving.");
}
async function VP(e) {
	let t = tt();
	for (let n of e.rows) {
		if (!n.itemUuid) continue;
		let e = await at(JSON.stringify({ uuid: n.itemUuid }));
		if (e.option.key !== n.speciesKey || e.option.label !== n.name) throw Error(`${n.name} changed. Reload the editor and drop the updated Species Item again.`);
		t.some((t) => t.key === e.option.key) || t.push(e.option);
	}
	let n = QN(e, t);
	if (n.length) throw Error(n.join("\n"));
}
async function HP(e, t, n) {
	if (et(), LP) throw Error("Another Species table save is in progress. Try again when it finishes.");
	LP = !0;
	try {
		await BP(t), await VP(e);
		let r = structuredClone(e);
		for (let e of r.rows) {
			if (!e.itemUuid) continue;
			let t = await rt(e.itemUuid);
			e.speciesKey = `item:${t.uuid}`, e.itemUuid = t.uuid, e.journalUuid = t.uuid, e.name = t.name;
		}
		await BP(t);
		let i = tt();
		for (let e of r.rows) e.itemUuid && !i.some((t) => t.key === e.speciesKey) && i.push({
			key: e.speciesKey,
			label: e.name,
			itemUuid: e.itemUuid
		});
		let a = QN(r, i);
		if (a.length) throw Error(a.join("\n"));
		let o = await Rt(r), s;
		if (n) try {
			await zt(o.id);
		} catch (e) {
			s = e instanceof Error ? e.message : String(e);
		}
		return {
			...await zP(),
			...s ? { registrationError: s } : {}
		};
	} finally {
		LP = !1;
	}
}
var UP = {
	load: zP,
	resolveDrop: at,
	save: HP
}, WP = 0, GP = class extends EC {
	storeId;
	constructor() {
		let t = `${e}-species-table-${++WP}`;
		super({ id: t }), this.storeId = t;
	}
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		classes: [e],
		position: {
			height: 740,
			width: 720
		},
		window: {
			title: "Species Table Editor",
			icon: "fa-solid fa-dice",
			resizable: !0
		}
	};
	getVueComponent() {
		return DP;
	}
	getVueProps() {
		return {
			id: this.storeId,
			bridge: UP,
			close: () => this.close()
		};
	}
	async _preClose(e) {
		let t = $N(this.storeId);
		await super._preClose(e), t.$dispose(), delete fC.state.value[`species-table:${this.storeId}`];
	}
};
async function KP() {
	et(), await new GP().render(!0);
}
//#endregion
//#region src/module/apps/workbench/view/WorkbenchApplication.ts
var qP = class extends EC {
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${e}-workbench`,
		classes: [e, "wfrp4e-customizer-workbench"],
		position: {
			height: "auto",
			width: 640
		},
		window: {
			icon: "fa-solid fa-screwdriver-wrench",
			title: t
		}
	};
	getVueComponent() {
		return XN;
	}
	getVueProps() {
		return {
			openNpcBuilder: () => new sO().render(!0),
			openEffectBuilders: () => ZM(),
			openSpeciesTableEditor: KP
		};
	}
};
//#endregion
//#region src/module/foundry/register-module-menus.ts
function JP() {
	game.settings.registerMenu(e, "workbench", {
		hint: `Open the ${t} workbench.`,
		icon: "fa-solid fa-screwdriver-wrench",
		label: "Open Workbench",
		name: t,
		restricted: !0,
		type: qP
	}), game.settings.registerMenu(e, "npc-builder", {
		hint: "Build a WFRP4e NPC from a base Actor and Career items.",
		icon: "fa-solid fa-user-plus",
		label: "Open NPC Builder",
		name: "WFRP4e NPC Builder",
		restricted: !0,
		type: sO
	}), game.settings.registerMenu(e, "effect-builders", {
		hint: "Create native WFRP effects on your Items.",
		icon: "fa-solid fa-wand-magic-sparkles",
		label: "Open Effect Builders",
		name: "Effect Builders",
		restricted: !1,
		type: XM
	});
}
//#endregion
//#region src/module/foundry/register-module-settings.ts
function YP() {
	OT(), Xt();
}
//#endregion
//#region src/module/wfrp/item-effect-drops.ts
var XP = new Set(["talent", "trait"]), ZP = /* @__PURE__ */ new WeakSet(), QP = !1, $P = "wfrp4e-customizer-grant-builder-button", eF = [
	"section[data-application-part=\"effects\"].active",
	"section[data-tab=\"effects\"].active",
	".tab[data-tab=\"effects\"].active",
	".tab.effects.active"
].join(","), tF = [
	"section[data-application-part=\"effects\"]",
	"section[data-tab=\"effects\"]",
	".tab[data-tab=\"effects\"]",
	".tab.effects"
].join(",");
function nF() {
	QP || (QP = !0, Hooks.on("renderApplicationV2", (e, t) => {
		if (!(t instanceof HTMLElement)) return;
		let n = oF(e);
		!n || !XP.has(n.type) || (rF(n, t), iF(n, t));
	}));
}
function rF(e, t) {
	ZP.has(t) || (ZP.add(t), t.addEventListener("dragover", (e) => {
		sF(t, e.target) && (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"));
	}, !0), t.addEventListener("drop", (n) => {
		aF(e, t, n);
	}, !0));
}
function iF(e, t) {
	if (t.querySelector(`.${$P}`)) return;
	let n = lF(t, { includeInactive: !0 });
	if (!n) return;
	let r = document.createElement("div");
	r.classList.add("wfrp4e-customizer-grant-builder-toolbar");
	let i = document.createElement("button");
	i.type = "button", i.classList.add($P), i.title = "Open Effect Builders for this Item", i.innerHTML = "<i class=\"fa-solid fa-sitemap\" aria-hidden=\"true\"></i><span>Effect Builders</span>", i.addEventListener("click", () => {
		ZM(e.uuid);
	}), r.append(i), n.prepend(r);
}
async function aF(t, n, r) {
	if (!sF(n, r.target)) return;
	let i = UA(r);
	if (i) {
		r.preventDefault(), r.stopPropagation();
		try {
			let n = await WA(i);
			if (n.uuid === t.uuid) throw Error("An Item cannot grant itself.");
			let r = GA(n), a = nj({
				effectName: `Grant ${n.name}`,
				flagScope: e,
				items: [r]
			});
			if (!t.createEmbeddedDocuments) throw Error("This Item sheet does not support creating Active Effects.");
			await t.createEmbeddedDocuments("ActiveEffect", [a]), ui.notifications?.info(`Added grant effect for "${n.name}".`);
		} catch (e) {
			let t = e instanceof Error ? e.message : "The dropped Item could not be converted.";
			ui.notifications?.warn?.(t);
		}
	}
}
function oF(e) {
	if (typeof e != "object" || !e) return null;
	let t = "item" in e ? e.item : void 0;
	if (Xe(t)) return t;
	let n = "document" in e ? e.document : void 0;
	return Xe(n) ? n : null;
}
function sF(e, t) {
	return !(t instanceof Element) || !e.contains(t) ? !1 : !!cF(e);
}
function cF(e) {
	return e.querySelector(eF) || lF(e, { includeInactive: !1 });
}
function lF(e, t) {
	return [...e.querySelectorAll(tF)].find((e) => t.includeInactive || e.offsetParent !== null) ?? null;
}
//#endregion
//#region src/module/foundry/api/create-module-api.ts
function uF() {
	return {
		estimateNpcXp: ck,
		listNpcAutoAdvanceStrategies: zp,
		openActorPortraitGallery: LO,
		async openNpcBuilder() {
			await new sO().render(!0);
		},
		createBuiltEffect: VM,
		openEffectBuilders: ZM,
		openAgeHeightEffectBuilder: rN,
		openWoundFormulaEffectBuilder: $M,
		openItemGrantEffectBuilder: eN,
		openRandomItemEffectBuilder: tN,
		openItemChoiceEffectBuilder: nN,
		openSpeciesTableEditor: KP,
		speciesTable: UP,
		async openWorkbench() {
			await new qP().render(!0);
		},
		selectChargenSpecies: cn,
		registerNpcAutoAdvanceStrategy: Rp
	};
}
//#endregion
//#region src/module/foundry/api/register-module-api.ts
function dF() {
	if (!game) throw Error("Foundry game global is unavailable during module API registration.");
	let t = game.modules.get(e);
	if (!t) throw Error(`Foundry module registry entry was not found for ${e}.`);
	t.api = uF();
}
//#endregion
//#region src/module/init/register-hooks.ts
function fF() {
	Hooks.once("init", () => {
		An(`${e} | Initializing`), YP(), game.system.id === "wfrp4e" && (GN(), WN(), kn(), WO(), mk(), Te() || (Rk(), on()), nF()), JP(), lO();
	}), Hooks.once("setup", i), Hooks.once("ready", () => {
		if (game.system.id !== "wfrp4e") {
			jn(`${e} | Loaded outside ${n}; skipping module API registration.`);
			return;
		}
		return pF();
	});
}
async function pF() {
	try {
		await Ee();
	} catch (t) {
		let n = t instanceof Error ? t.message : "Unknown runtime adaptation error.";
		throw jn(`${e} | Species Item migration failed: ${n}`), ui.notifications?.error(`Customizer initialization failed: ${n}`), t;
	}
	try {
		await g();
	} catch (t) {
		let n = t instanceof Error ? t.message : String(t);
		jn(`${e} | Compendium tidy failed: ${n}`), ui.notifications?.error(`Compendium folders could not be restored: ${n}`);
	}
	dF(), Zt(), qC().catch(() => {
		ui.notifications?.error("Career indexing failed. Adding a Career will retry the index.");
	}), dw(), An(`${e} | Ready`);
}
//#endregion
//#region src/module/init/index.ts
fF();
//#endregion

//# sourceMappingURL=wfrp4e-customizer-apps.mjs.map
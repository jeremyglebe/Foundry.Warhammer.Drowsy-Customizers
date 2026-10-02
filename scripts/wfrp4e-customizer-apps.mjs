//#region src/shared/object-readers.ts
function e(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function t(t, n) {
	let r = t;
	for (let t of n) {
		if (!e(r) || !(t in r)) return;
		r = r[t];
	}
	return r;
}
function n(e, n) {
	let r = t(e, n);
	return typeof r == "string" ? r.trim() : "";
}
function r(e, n) {
	let r = t(e, n);
	return Array.isArray(r) ? r.filter((e) => typeof e == "string") : [];
}
function i(e, t, n = 0) {
	return a(e, t) ?? n;
}
function a(e, n) {
	for (let r of n) {
		let n = Number(t(e, r));
		if (Number.isFinite(n)) return n;
	}
	return null;
}
function o(e, n, r = !1) {
	for (let r of n) {
		let n = t(e, r);
		if (typeof n == "boolean") return n;
	}
	return r;
}
function s(t) {
	return Array.isArray(t) ? t.flatMap(s) : typeof t == "string" ? t.split(/[\n\r,;]/).map((e) => e.trim()).filter(Boolean) : e(t) ? Object.values(t).flatMap(s) : [];
}
function c(t, n, r) {
	let i = t;
	for (let t of n.slice(0, -1)) {
		let n = i[t];
		e(n) || (i[t] = {}), i = i[t];
	}
	i[n[n.length - 1] ?? ""] = r;
}
//#endregion
//#region src/types/wfrp4e/characteristics.ts
var l = {
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
}, u = {
	[l.Agility]: "Agility",
	[l.BallisticSkill]: "Ballistic Skill",
	[l.Dexterity]: "Dexterity",
	[l.Fellowship]: "Fellowship",
	[l.Initiative]: "Initiative",
	[l.Intelligence]: "Intelligence",
	[l.Strength]: "Strength",
	[l.Toughness]: "Toughness",
	[l.WeaponSkill]: "Weapon Skill",
	[l.Willpower]: "Willpower"
}, d = {
	agility: l.Agility,
	"ballistic skill": l.BallisticSkill,
	dexterity: l.Dexterity,
	fellowship: l.Fellowship,
	initiative: l.Initiative,
	intelligence: l.Intelligence,
	strength: l.Strength,
	toughness: l.Toughness,
	"weapon skill": l.WeaponSkill,
	willpower: l.Willpower
};
function f(e) {
	return e in u;
}
//#endregion
//#region src/functions/species-builder/item-reference-names.ts
function p(e) {
	return h(e.name, e.specification);
}
function m(e) {
	let t = e.name.trim();
	if (!e.item) return t;
	if (!t) return p(e.item);
	if (!_(t)) {
		if (e.item.specification) return h(t, e.item.specification);
		if (_(e.item.name) && v(t) === v(e.item.name)) return e.item.name.trim();
	}
	return t;
}
function h(e, t) {
	let n = e.trim(), r = t?.trim();
	return !n || !r || g(n) ? n : `${n} (${r})`;
}
function g(e) {
	return /\(([^()]*)\)\s*$/.exec(e.trim())?.[1]?.trim() ?? "";
}
function _(e) {
	return /\([^()]*\)\s*$/.test(e.trim());
}
function v(e) {
	return e.split("(")[0]?.trim().toLocaleLowerCase() ?? "";
}
//#endregion
//#region src/functions/species-builder/items/choices.ts
function y(e) {
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
						name: m(e),
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
function b(e) {
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
function x() {
	return {
		uuid: "",
		id: "",
		name: ""
	};
}
function S() {
	return {
		description: { value: "" },
		gmdescription: { value: "" },
		characteristics: Object.fromEntries(Object.values(l).map((e) => [e, {
			base: 20,
			dice: 2
		}])),
		fate: 0,
		resilience: 0,
		extra: 0,
		movement: 4,
		skills: { list: [] },
		talents: {
			choices: y([]),
			random: 0
		},
		size: "avg",
		subspeciesOf: x(),
		keys: [],
		tables: {
			talents: x(),
			eye: x(),
			hair: x(),
			career: x()
		}
	};
}
function ee(e) {
	let t = {};
	for (let n of Object.values(l)) {
		let r = e.characteristics[n];
		r && r.base !== null && r.dice !== null && (t[n] = r.dice === 0 ? String(r.base) : `${r.dice}d10+${r.base}`);
	}
	return Object.keys(t).length ? t : void 0;
}
//#endregion
//#region src/module/constants.ts
var C = "wfrp4e-customizer-apps", te = "Drowsy's WFRP4e Customizers", w = "wfrp4e";
//#endregion
//#region src/module/apps/species-builder/items/effect-sources.ts
function ne(t) {
	if (t === void 0) return [];
	if (!Array.isArray(t)) throw Error("Species effects must be embedded Active Effects.");
	return t.map((t) => {
		if (!e(t) || typeof t._id != "string") throw Error("Species effects must have Foundry document IDs.");
		return {
			...structuredClone(t),
			_id: t._id
		};
	});
}
//#endregion
//#region src/module/apps/species-builder/items/adapter.ts
var re = `${C}.species`;
function T(e) {
	return e.type === re || e.type === "species";
}
function ie(e) {
	let t = e.toObject();
	return {
		id: e.id,
		uuid: e.uuid,
		name: e.name,
		img: e.img || "icons/svg/mystery-man.svg",
		system: E(t.system),
		effects: ne(t.effects)
	};
}
function E(t) {
	if (!e(t)) throw Error("Species Item system data is missing.");
	let n = S(), r = ce(t.characteristics), i = ce(t.talents), a = ce(i.choices), o = ce(t.tables);
	return {
		description: { value: k(ce(t.description).value) },
		gmdescription: { value: k(ce(t.gmdescription).value) },
		characteristics: Object.fromEntries(Object.values(l).map((e) => {
			let t = ce(r[e]);
			return [e, {
				base: O(t.base),
				dice: O(t.dice)
			}];
		})),
		extra: O(t.extra),
		fate: O(t.fate),
		movement: O(t.movement),
		resilience: O(t.resilience),
		keys: se(t.keys),
		size: k(t.size) || "avg",
		skills: { list: se(ce(t.skills).list) },
		talents: {
			random: O(i.random),
			choices: {
				structure: a.structure === void 0 ? n.talents.choices.structure : ae(a.structure),
				options: oe(a.options).map((e) => {
					let t = ce(e);
					return {
						type: k(t.type),
						id: k(t.id),
						name: k(t.name),
						documentId: k(t.documentId),
						idType: k(t.idType),
						diff: ce(t.diff),
						filters: oe(t.filters).map((e) => {
							let t = ce(e);
							return {
								path: k(t.path),
								operation: k(t.operation),
								value: k(t.value)
							};
						})
					};
				}),
				script: k(a.script)
			}
		},
		subspeciesOf: D(t.subspeciesOf),
		tables: {
			talents: D(o.talents),
			eye: D(o.eye),
			hair: D(o.hair),
			career: D(o.career)
		}
	};
}
function ae(e) {
	let t = ce(e), n = t.type;
	if (n !== "and" && n !== "or" && n !== "option") throw Error("Species Talent choice structure is invalid.");
	return {
		type: n,
		id: k(t.id),
		...n === "option" ? {} : { options: oe(t.options).map(ae) }
	};
}
function D(e) {
	let t = ce(e);
	return {
		uuid: k(t.uuid),
		id: k(t.id),
		name: k(t.name)
	};
}
function O(e) {
	if (e == null) return null;
	if (typeof e != "number" || !Number.isFinite(e) || e < 0) throw Error("Species statistics must be non-negative numbers or empty inheritance values.");
	return e;
}
function k(e) {
	return typeof e == "string" ? e : "";
}
function oe(e) {
	return Array.isArray(e) ? e : [];
}
function se(e) {
	return oe(e).map((e) => {
		if (typeof e != "string") throw Error("Species keys and skills must contain text values.");
		return e;
	});
}
function ce(t) {
	return e(t) ? t : {};
}
//#endregion
//#region src/shared/assign-if-present.ts
function A(e, t, n) {
	n !== void 0 && (e[t] = n);
}
//#endregion
//#region src/functions/species-builder/items/effect-carriers.ts
function le(e) {
	return `__Species Effects ${e.id}__`;
}
//#endregion
//#region src/functions/species-builder/items/identity.ts
function ue(e) {
	return e.system.keys[0] || `species${e.id.toLowerCase()}`;
}
function de(e) {
	return !!(e.system.subspeciesOf.uuid || e.system.subspeciesOf.id);
}
//#endregion
//#region src/functions/species-builder/items/definitions.ts
function fe(e, t = {}) {
	let { system: n } = e, r = b(n.talents.choices), i = {
		key: ue(e),
		name: e.name,
		includeInExtraSpecies: !0,
		skills: n.skills.list,
		talents: r.map((e) => e.choices.map((e) => e.name).join(", "))
	};
	e.effects.length && (i.traits = [le(e)]), A(i, "characteristics", ee(n)), A(i, "careerTable", t.careerTable);
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
function pe(e, t, n) {
	let r = me(e.system, t.system), i = fe({
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
	]) A(a, e, i[e]);
	let o = fe(t), s = e.effects.length ? i.traits : o.traits;
	return Object.assign(a, he("skills", o.skills ?? [], i.skills ?? [])), Object.assign(a, he("talents", o.talents ?? [], i.talents ?? [])), Object.assign(a, he("traits", o.traits ?? [], s ?? [])), a;
}
function me(e, t) {
	b(e.talents.choices);
	let n = structuredClone(e);
	for (let r of Object.values(l)) n.characteristics[r] = {
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
function he(e, t, n) {
	return {
		[`${e}Added`]: n.filter((e) => !t.includes(e)),
		[`${e}Removed`]: t.filter((e) => !n.includes(e))
	};
}
//#endregion
//#region src/functions/species-builder/items/catalog.ts
function ge(e, t = /* @__PURE__ */ new Map()) {
	let n = new Map(e.filter((e) => !de(e)).map((e) => [e.uuid, fe(e, t.get(e.uuid))]));
	for (let r of e.filter(de)) {
		let i = r.system.subspeciesOf, a = e.find((e) => i.uuid ? e.uuid === i.uuid : e.id === i.id);
		if (!a) throw Error(`${r.name}: parent Species Item is missing from the world. Import its parent before loading species.`);
		if (de(a)) throw Error(`${r.name}: nested or cyclic subspecies cannot be represented by WFRP's current config.`);
		let o = n.get(a.uuid), s = {
			...t.get(a.uuid),
			...t.get(r.uuid)
		};
		(o.subspecies ??= []).push(pe(r, a, s));
	}
	return {
		definitions: [...n.values()],
		runtimeSpeciesExtensions: []
	};
}
//#endregion
//#region src/functions/species-builder/default-species-builder-settings.ts
function _e() {
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
function ve(e, t, n) {
	let r = be(e, t, typeof n == "string" ? n.trim() : "");
	for (let e of r) {
		let t = game.wfrp4e?.tables?.findTable?.("career", e);
		if (!t) continue;
		let n = xe(t, e);
		if (n) return ye(n);
	}
}
function ye(t) {
	if (!e(t)) return;
	let n = Oe(t.results).flatMap((e) => {
		let t = Ce(e);
		return t ? [t] : [];
	}), r = t.formula;
	return n.length > 0 ? {
		rows: n,
		...typeof r == "string" ? { sourceFormula: r } : {}
	} : void 0;
}
function be(e, t, n) {
	let r = t ? [
		n,
		`${e}-${t}`,
		e
	] : [e];
	return e === "human" && r.push("human-reiklander"), [...new Set(r.filter(Boolean))];
}
function xe(t, n) {
	return !e(t) || !Array.isArray(t.columns) ? t : t.columns.find((e) => Se(e) === n);
}
function Se(t) {
	if (!e(t) || typeof t.getFlag != "function") return "";
	let n = t.getFlag.call(t, "wfrp4e", "column");
	return typeof n == "string" ? n : "";
}
function Ce(t) {
	if (!e(t)) return;
	let n = Ee(t), r = /@UUID\[([^\]]+)\]\{([^}]+)\}/u.exec(n), i = De(r?.[2] ?? ""), a = De(n) || De(t.name), o = i || a;
	if (!o) return;
	let s = r?.[1]?.trim(), c = we(t.range), l = Te(t.weight), u = { name: o };
	return s && (u.journalUuid = s), c && (u.sourceRange = c), l !== void 0 && (u.sourceWeight = l), u;
}
function we(e) {
	if (!Array.isArray(e) || e.length < 2) return;
	let t = Number(e[0]), n = Number(e[1]);
	return Number.isFinite(t) && Number.isFinite(n) ? [t, n] : void 0;
}
function Te(e) {
	let t = Number(e);
	return Number.isFinite(t) && t > 0 ? t : void 0;
}
function Ee(e) {
	if (e.type === "document") {
		let t = e.documentUuid, n = e.name;
		return typeof t == "string" && typeof n == "string" ? `@UUID[${t}]{${n}}` : "";
	}
	let t = e.description ?? e.text;
	return typeof t == "string" ? t : "";
}
function De(e) {
	return typeof e == "string" ? e.replace(/@UUID\[[^\]]+\]\{([^}]+)\}/gu, "$1").replace(/<[^>]*>/gu, "").trim() : "";
}
function Oe(e) {
	return Array.isArray(e) ? e : typeof e == "object" && e && Symbol.iterator in e ? [...e] : [];
}
//#endregion
//#region src/module/apps/species-builder/items/imported-references.ts
function ke(e, t) {
	let r = t.find((t) => e.uuid ? t.uuid === e.uuid : t.id === e.id);
	if (r || !e.uuid.startsWith("Compendium.")) return r;
	let i = t.filter((t) => {
		let r = t.toObject();
		return [n(r, ["_stats", "compendiumSource"]), n(r, [
			"flags",
			"core",
			"sourceId"
		])].includes(e.uuid);
	});
	if (i.length > 1) throw Error(`Multiple imported copies of ${e.name || e.uuid}; relink the reference to the intended world document.`);
	return i[0];
}
//#endregion
//#region src/module/apps/species-builder/items/table-references.ts
async function Ae(t) {
	let n = {}, r = je(t.system.tables.talents);
	if (r) {
		let e = r.getFlag("wfrp4e", "key");
		if (typeof e != "string" || !e.trim()) throw Error(`${t.name}: the random Talent table needs a WFRP table key.`);
		n.randomTalentKey = e;
	}
	let i = t.system.tables.career, a = i.uuid.startsWith("Compendium.") ? ke(i, game.tables?.contents ?? []) ?? await fromUuid(i.uuid) : je(i);
	if (i.uuid.startsWith("Compendium.") && (!e(a) || a.documentName !== "RollTable")) throw Error(`${t.name}: the referenced Career RollTable could not be resolved.`);
	if (a) {
		let e = ye(a);
		if (!e) throw Error(`${t.name}: the referenced Career table has no usable rows.`);
		n.careerTable = e;
	}
	return n;
}
function je(e) {
	if (!e.uuid && !e.id) return;
	let t = ke(e, game.tables?.contents ?? []);
	if (!t) throw Error(`Import the referenced RollTable ${e.name || e.uuid || e.id} into the world and relink it.`);
	return t;
}
//#endregion
//#region src/module/apps/species-builder/items/repository.ts
function Me() {
	return (game.items?.contents ?? []).filter(T);
}
async function Ne() {
	let e = Me(), t = e.map(ie);
	for (let n of t) {
		let t = n.system.subspeciesOf;
		if (!t.uuid && !t.id) continue;
		let r = ke(t, e);
		r && (n.system.subspeciesOf = {
			uuid: r.uuid,
			id: r.id,
			name: r.name
		});
	}
	let n = new Map(await Promise.all(t.map(async (e) => [e.uuid, await Ae(e)])));
	return {
		..._e(),
		...ge(t, n)
	};
}
async function Pe(t, n) {
	Fe();
	let r = t.toObject(), i = e(r.system) ? r.system : {};
	return await t.update({
		name: n.name,
		img: n.img,
		system: {
			...i,
			...E(n.system)
		}
	}, { recursive: !1 }), t;
}
function Fe() {
	if (!game.user?.isGM) throw Error("Only a GM can change world Species Items through the Customizer.");
}
//#endregion
//#region src/module/apps/species-builder/items/migration.ts
function Ie() {
	return typeof CONFIG.Item.dataModels.species == "function";
}
async function Le() {
	if (!Ie() || !game.user?.isGM || game.users?.activeGM && game.users.activeGM.id !== game.user.id) return 0;
	let e = 0, t = game.actors.contents.flatMap((e) => e.items?.contents ?? []), n = [...Me(), ...t];
	for (let t of n.filter((e) => e.type === re)) await t.update({ type: "species" }), e += 1;
	return e;
}
//#endregion
//#region src/functions/species-builder/replacement-row-records.ts
function Re(e) {
	if (!e) return;
	let t = e.flatMap((e) => {
		let t = m(e.rolled), n = m(e.replacement);
		return t && n ? [[t, n]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : void 0;
}
function ze(e) {
	if (!e) return;
	let t = e.flatMap((e) => {
		let t = m(e.rolled), n = e.replacements.map(m).filter((e) => e.length > 0);
		return t && n.length > 0 ? [[t, n]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : void 0;
}
//#endregion
//#region src/functions/species-builder/linked-grant-records.ts
function Be(e) {
	if (!e || e.length === 0) return;
	let t = e.map(m).filter((e) => e.length > 0);
	return t.length > 0 ? t : void 0;
}
function Ve(e) {
	if (!e || e.length === 0) return;
	let t = e.flatMap((e) => {
		let t = e.choices.map(m).filter((e) => e.length > 0);
		return t.length > 0 ? [t.join(", ")] : [];
	});
	return t.length > 0 ? t : void 0;
}
//#endregion
//#region src/functions/species-builder/subspecies-list-fields.ts
function He(e) {
	return Be(e.linkedSkills) ?? e.skills;
}
function Ue(e, t) {
	return Ye(He(e), t.skillsAdded, t.skillsRemoved);
}
function We(e) {
	return Ve(e.linkedTalents) ?? e.talents;
}
function Ge(e, t) {
	return Ye(We(e), t.talentsAdded, t.talentsRemoved);
}
function Ke(e, t) {
	return Je(Be(e.linkedTraits) ?? e.traits, t);
}
function qe(e, t, n = {}) {
	let r = n.subspecies ?? n.parent, i = Ye(Ke(e), t.traitsAdded, t.traitsRemoved);
	return i ? Je(i, r) : n.subspecies ? Je(Ke(e), n.subspecies) : void 0;
}
function Je(e, t) {
	if (!t) return e;
	let n = e ? [...e] : [];
	return n.includes(t) || n.push(t), n;
}
function Ye(e, t, n) {
	if (!t && !n) return;
	let r = new Set(n ?? []), i = (e ?? []).filter((e) => !r.has(e));
	for (let e of t ?? []) i.includes(e) || i.push(e);
	return i;
}
//#endregion
//#region src/functions/species-builder/definition-plans.ts
function Xe(e, t = []) {
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
//#region src/functions/species-builder/wound-formula/compiler.ts
function Ze(e) {
	let t = [], n = /* @__PURE__ */ new Set(), r = e.trim();
	return r = r.replaceAll(/@([A-Za-z][\dA-Za-z]*)/g, (e, t) => {
		let r = Qe(t);
		return n.add(r), r;
	}), r = r.replaceAll(/{([^{}]+)}/g, (e, n) => $e(t, n, "total")), r = r.replaceAll(/\[([^[\]]+)]/g, (e, n) => $e(t, n, "bonus")), {
		expression: r,
		references: t,
		usedKeywords: n
	};
}
function Qe(e) {
	if ((/* @__PURE__ */ "ablaze.advantage.age.bleeding.blinded.broken.corruption.deafened.entangled.fate.fatigued.fortune.height.poisoned.rank.resilience.resolve.sb.sbMultiplier.scale.sin.size.status.stunned.tb.tbMultiplier.weight.wpb.wpbMultiplier.xp".split(".")).includes(e)) return e;
	throw Error(`Unknown wound formula keyword: @${e}`);
}
function $e(e, t, n) {
	let r = et(t, n, e), i = e.find((e) => tt(e, r));
	return i ? i.variableName : (e.push(r), r.variableName);
}
function et(e, t, n) {
	let [r, i] = nt(e), a = rt(r), o = st(ot(r, i, t), n);
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
	return i && (s.characteristicOverride = it(i)), s;
}
function tt(e, t) {
	return e.characteristicKey === t.characteristicKey && e.characteristicOverride === t.characteristicOverride && e.kind === t.kind && e.name === t.name && e.source === t.source;
}
function nt(e) {
	let t = e.split("|").map((e) => e.trim());
	if (t.length > 2 || !t[0]) throw Error(`Invalid wound formula attribute reference: ${e}`);
	return [t[0], t[1]];
}
function rt(e) {
	let t = e.trim().toLocaleLowerCase();
	return f(t) ? t : d[t] ?? at[t];
}
function it(e) {
	let t = rt(e);
	if (!t) throw Error(`Unknown wound formula characteristic: ${e}`);
	return t;
}
var at = {
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
function ot(e, t, n) {
	let [r, ...i] = [e, t].flatMap((e) => e ? e.match(/\d+|[A-Za-z]+/g) ?? [] : []), a = r ? [r.toLocaleLowerCase(), ...i.map((e) => e.charAt(0).toLocaleUpperCase() + e.slice(1))].join("") : "attribute";
	return n === "bonus" ? `${a}Bonus` : a;
}
function st(e, t) {
	let n = new Set(t.map((e) => e.variableName));
	if (!n.has(e)) return e;
	let r = 2, i = `${e}${r}`;
	for (; n.has(i);) r += 1, i = `${e}${r}`;
	return i;
}
//#endregion
//#region src/functions/species-builder/wound-formula/script-lines.ts
function ct(e) {
	let t = [];
	if (dt(e, [
		"sb",
		"tb",
		"wpb"
	]) && (t.push(...ft(e, "sb", "preWoundArgs.sb")), t.push(...ft(e, "tb", "preWoundArgs.tb")), t.push(...ft(e, "wpb", "preWoundArgs.wpb"))), dt(e, [
		"sbMultiplier",
		"tbMultiplier",
		"wpbMultiplier"
	]) && (t.push("const multiplier = preWoundArgs.multiplier;"), t.push(...ft(e, "sbMultiplier", "multiplier.sb")), t.push(...ft(e, "tbMultiplier", "multiplier.tb")), t.push(...ft(e, "wpbMultiplier", "multiplier.wpb"))), dt(e, ["scale", "size"]) && (t.push(...pt()), t.push("const size = actorSizeStep();"), t.push(...ft(e, "scale", "2 ** size"))), dt(e, vt) && (t.push(...ft(e, "age", "Number(actor.system.details.age.value)")), t.push(...ft(e, "height", "Number(actor.system.details.height.value)")), t.push(...ft(e, "weight", "Number(actor.system.details.weight.value)")), t.push(...xt(e))), dt(e, yt) && (t.push(...ft(e, "xp", "actor.system.details.experience.total")), t.push(...ft(e, "fate", "actor.system.status.fate.value")), t.push(...ft(e, "fortune", "actor.system.status.fortune.value")), t.push(...ft(e, "resilience", "actor.system.status.resilience.value")), t.push(...ft(e, "resolve", "actor.system.status.resolve.value")), t.push(...ft(e, "corruption", "actor.system.status.corruption.value")), t.push(...ft(e, "sin", "actor.system.status.sin.value")), t.push(...ft(e, "advantage", "actor.system.status.advantage.value"))), dt(e, bt)) {
		t.push(...St());
		for (let n of bt) t.push(...ft(e, n, `conditionValue("${n}")`));
	}
	return t.length ? [...t, ""] : [];
}
function lt(e) {
	let t = e.length > 0, n = e.some((e) => e.source === "skill");
	return [...mt(t), ...ht(n)];
}
function ut(e) {
	return e.map((e) => e.source === "characteristic" ? gt(e) : _t(e));
}
function dt(e, t) {
	return t.some((t) => e.has(t));
}
function ft(e, t, n) {
	return e.has(t) ? [`const ${t} = ${n};`] : [];
}
function pt() {
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
function mt(e) {
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
function ht(e) {
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
function gt(e) {
	let t = e.kind === "bonus" ? "characteristicBonus" : "characteristicTotal";
	return `const ${e.variableName} = ${t}(${JSON.stringify(e.characteristicKey)});`;
}
function _t(e) {
	let t = e.kind === "bonus" ? "skillBonus" : "skillTotal", n = e.characteristicOverride ? JSON.stringify(e.characteristicOverride) : "undefined";
	return `const ${e.variableName} = ${t}(${JSON.stringify(e.name)}, ${n});`;
}
var vt = [
	"age",
	"height",
	"rank",
	"status",
	"weight"
], yt = [
	"advantage",
	"corruption",
	"fate",
	"fortune",
	"resilience",
	"resolve",
	"sin",
	"xp"
], bt = [
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
function xt(e) {
	let t = [];
	return e.has("status") && t.push("function statusTierValue() {", "  const statusTiers = { brass: 1, silver: 2, gold: 3 };", "  const tier = actor.system.details.status.tier;", "  return statusTiers[String(tier).toLocaleLowerCase()] || Number(tier);", "}", "const status = statusTierValue();"), t.push(...ft(e, "rank", "Number(actor.system.details.status.standing)")), t;
}
function St() {
	return [
		"function conditionValue(key) {",
		"  return actor.hasCondition(key)?.conditionValue || 0;",
		"}"
	];
}
//#endregion
//#region src/functions/species-builder/wound-formula/index.ts
function Ct(e) {
	let t = Ze(e);
	return [
		...ct(t.usedKeywords),
		...lt(t.references),
		...ut(t.references),
		"",
		`args.wounds = ${t.expression};`
	];
}
//#endregion
//#region src/functions/effect-builders/wounds.ts
var wt = ["const storageKey = \"__wfrp4eCustomizerWoundFormulaArgs\";", "const sourceId = this.effect.id;"];
function Tt(e, t) {
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
					...wt,
					"this.actor[storageKey] ||= {};",
					"this.actor[storageKey][sourceId] = args;"
				].join("\n")
			}, {
				label: e,
				trigger: "woundCalc",
				script: [
					...wt,
					"const preWoundArgs = this.actor[storageKey][sourceId];",
					"const actor = this.actor;",
					...Ct(t)
				].join("\n")
			}]
		}
	};
}
//#endregion
//#region src/functions/species-builder/wound-formula-traits.ts
function Et(e) {
	return `__${e.name.trim()}__`;
}
function Dt(e, t) {
	return `__${e.name.trim()} / ${t.name.trim()}__`;
}
//#endregion
//#region src/functions/species-builder/species-config.ts
function Ot(e, t = []) {
	let n = kt();
	for (let r of Xe(e, t)) r.emitBaseDefinition && At(n, r.definition), jt(n, r.definition, r.subspecies);
	return n;
}
function kt() {
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
function At(e, t) {
	e.species[t.key] = t.name, A(e.speciesCharacteristics, t.key, t.characteristics), e.speciesSkills[t.key] = He(t) ?? [], e.speciesTalents[t.key] = We(t) ?? [], A(e.speciesRandomTalents, t.key, t.randomTalents), A(e.speciesTalentReplacement, t.key, Pt(t)), A(e.speciesTraits, t.key, Ke(t, t.woundFormula ? Et(t) : void 0)), A(e.speciesMovement, t.key, t.movement), A(e.speciesFate, t.key, t.fate), A(e.speciesRes, t.key, t.resilience), A(e.speciesExtra, t.key, t.extra), A(e.speciesAge, t.key, t.age), A(e.speciesHeight, t.key, t.height), A(e.speciesCareerReplacements, t.key, Ft(t)), t.includeInExtraSpecies && e.extraSpecies.push(t.key);
}
function jt(e, t, n) {
	for (let r of n) {
		let n = e.subspecies[t.key] ?? {}, i = r.woundFormula ? Dt(t, r) : void 0, a = r.careerTable ? Nt(t, r) : void 0;
		n[r.key] = Mt(t, r, i, a), e.subspecies[t.key] = n;
	}
}
function Mt(e, t, n, r) {
	let i = { name: t.name };
	return A(i, "characteristics", t.characteristics ? {
		...e.characteristics,
		...t.characteristics
	} : void 0), A(i, "skills", Ue(e, t)), A(i, "talents", Ge(e, t)), A(i, "speciesTraits", qe(e, t, {
		parent: e.woundFormula ? Et(e) : void 0,
		subspecies: n
	})), A(i, "randomTalents", t.randomTalents), A(i, "talentReplacement", Pt(t)), A(i, "movement", t.movement), A(i, "fate", t.fate), A(i, "resilience", t.resilience), A(i, "extra", t.extra), A(i, "careerTable", r), i;
}
function Nt(e, t) {
	return `${e.key}-${t.key}`;
}
function Pt(e) {
	return Re(e.talentReplacementRows) ?? e.talentReplacements;
}
function Ft(e) {
	return ze(e.careerReplacementRows) ?? e.careerReplacements;
}
//#endregion
//#region src/module/apps/species-chargen/tables.ts
var It = /* @__PURE__ */ new Map(), Lt = !1;
function Rt(e, t) {
	return `${e.toLowerCase()}|${t ?? ""}`;
}
function zt() {
	if (Lt) return;
	let e = game.wfrp4e?.tables;
	if (!e?.findTable) throw Error("WFRP table lookup is unavailable.");
	let t = e.findTable;
	e.findTable = function(e, n) {
		return It.get(Rt(e, n)) ?? t.call(this, e, n);
	}, Lt = !0;
}
async function Bt(t) {
	if (!t.uuid && !t.id) return;
	let n = ke(t, game.tables?.contents ?? []) ?? await fromUuid(t.uuid || `RollTable.${t.id}`);
	if (!e(n) || n.documentName !== "RollTable") throw Error(`Cannot resolve Species RollTable ${t.name || t.uuid || t.id}.`);
	return n;
}
function Vt(e, t, n, r, i) {
	zt(), Ht(e), r && It.set(Rt("eyes", e), r), i && It.set(Rt("hair", e), i), t && It.set(Rt("career", e), t), n && It.set(Rt(`${e}-talents`), n);
}
function Ht(e) {
	It.delete(Rt("eyes", e)), It.delete(Rt("hair", e)), It.delete(Rt("career", e)), It.delete(Rt(`${e}-talents`));
}
//#endregion
//#region src/module/apps/species-chargen/config.ts
var Ut = 0, Wt = "customizer-chargen-";
function Gt() {
	return `${Wt}${++Ut}`;
}
async function Kt(t, n) {
	let r = game.wfrp4e?.config;
	if (!r) throw Error("WFRP species config is unavailable.");
	let { record: i } = n, [a, o, s, c] = await Promise.all([
		Bt(i.system.tables.career),
		Bt(i.system.tables.talents),
		Bt(i.system.tables.eye),
		Bt(i.system.tables.hair)
	]), l = fe({
		...i,
		effects: []
	}, { ...o ? { randomTalentKey: `${t}-talents` } : {} });
	l.key = t, l.includeInExtraSpecies = !1;
	let u = _e();
	u.definitions = [l];
	let d = Ot(u);
	qt(t);
	for (let [n, i] of Object.entries(d)) if (e(i) && Object.hasOwn(i, t)) {
		let a = e(r[n]) ? r[n] : r[n] = {};
		a[t] = i[t];
	}
	Vt(t, a, o, s, c);
}
function qt(t) {
	let n = game.wfrp4e?.config;
	for (let [r, i] of Object.entries(n ?? {})) (r.startsWith("species") || r === "subspecies") && e(i) && delete i[t];
	Ht(t);
}
//#endregion
//#region src/functions/species-chargen/selection.ts
function Jt(e, t) {
	let n = structuredClone(e);
	if (!t) return n;
	n.system = me(e.system, t.system);
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
function Yt(e) {
	if (typeof e.documentUuid == "string" && e.documentUuid) return e.documentUuid;
	let t = typeof e.description == "string" ? e.description : "";
	return /@UUID\[([^\]]+)\]/u.exec(t)?.[1];
}
function Xt(e) {
	return e.startsWith("Item.") || e.startsWith("Compendium.") && e.includes(".Item.");
}
//#endregion
//#region src/functions/species-chargen/roll-bonus.ts
function Zt(e, t) {
	return [...new Set([
		e,
		n(t, ["_stats", "compendiumSource"]),
		n(t, [
			"flags",
			"core",
			"sourceId"
		])
	].filter(Xt))];
}
function Qt(e, t) {
	if (!e) return 0;
	let n = e.identity?.self ?? Zt(e.uuid, e.source), r = e.identity?.parent ?? [e.record.system.subspeciesOf.uuid];
	return [...n, ...r].some((e) => e && t.includes(e)) ? 20 : 0;
}
//#endregion
//#region src/module/foundry/document-guards.ts
function $t(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Actor";
}
function en(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Item";
}
function tn(e, t = "Expected a Foundry Actor.") {
	if (!$t(e)) throw Error(t);
	return e;
}
function nn(e, t = "Expected a Foundry Item.") {
	if (!en(e)) throw Error(t);
	return e;
}
function rn(e, t, n = `Expected a Foundry ${t} Item.`) {
	let r = nn(e, n);
	if (r.type !== t) throw Error(n);
	return r;
}
//#endregion
//#region src/module/apps/species-table/items.ts
function an() {
	if (!game.user?.isGM) throw Error("Only a GM can edit the world's Species table.");
}
function on() {
	let t = game.wfrp4e?.config?.species, n = [];
	if (e(t)) for (let [e, r] of Object.entries(t)) !e.startsWith("customizer-chargen-") && typeof r == "string" && r.trim() && n.push({
		key: e,
		label: r
	});
	for (let e of Me()) n.push({
		key: `item:${e.uuid}`,
		label: e.name,
		itemUuid: e.uuid
	});
	return n.sort((e, t) => e.label.localeCompare(t.label));
}
async function sn(e) {
	let t = Me(), n = ke(e, t), r = nn(n ?? await fromUuid(e.uuid || `Item.${e.id}`), `Species Item “${e.name || e.uuid || e.id}” is unavailable.`), i = n ?? ke({
		uuid: r.uuid,
		id: r.id,
		name: r.name
	}, t) ?? r;
	if (!T(i)) throw Error("Drop a Species Item into this editor.");
	if (game.user && !game.user.isGM && !i.testUserPermission(game.user, "OBSERVER")) throw Error(`You do not have permission to read ${i.name}.`);
	if (!i.compendium && !Me().some((e) => e.uuid === i.uuid)) throw Error("Use a world or compendium Species Item, rather than an Item on an Actor.");
	return i;
}
async function cn(e) {
	return sn({
		uuid: e,
		id: "",
		name: ""
	});
}
async function ln(e) {
	let t = await cn(e), n = ie(t);
	if (!de(n)) return [t];
	let r = await sn(n.system.subspeciesOf);
	if (de(ie(r))) throw Error(`${t.name}: nested or cyclic subspecies cannot be used by WFRP's current Species table.`);
	return [r, t];
}
async function un(t) {
	an();
	let n = JSON.parse(t);
	if (!e(n) || typeof n.uuid != "string") throw Error("Drop a Species Item or enter its UUID.");
	let r = await ln(n.uuid), i = r[r.length - 1];
	return {
		option: {
			key: `item:${i.uuid}`,
			label: i.name,
			itemUuid: i.uuid
		},
		sources: [{
			uuid: i.uuid,
			name: i.name
		}],
		message: `Added ${i.name}. Its Species Item will be loaded when selected during character creation.`
	};
}
//#endregion
//#region src/module/apps/species-builder/items/actor-source.ts
function dn(e, t) {
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
//#region src/module/apps/species-chargen/resolve.ts
async function fn(e) {
	let t = await ln(e), n = t[t.length - 1], r = t.length > 1 ? ie(t[0]) : void 0, i = Jt(ie(n), r), a = dn(n, i);
	return {
		uuid: n.uuid,
		record: i,
		source: a,
		identity: {
			self: [...new Set([e, ...Zt(n.uuid, n.toObject())])],
			parent: t.length > 1 ? Zt(t[0].uuid, t[0].toObject()) : []
		}
	};
}
//#endregion
//#region src/module/apps/species-chargen/session.ts
var pn = class {
	app;
	key = Gt();
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
		let t = await fn(e);
		if (!this.closed) {
			if (await Kt(this.key, t), this.closed) {
				qt(this.key);
				return;
			}
			this.selection = t;
		}
	}
	useLegacy() {
		this.assertUnlocked(), this.selection = void 0, qt(this.key);
	}
	commit() {
		let e = this.app.data;
		this.selection ? (e.customizerSpecies = {
			...e.customizerSpecies,
			selection: this.selection
		}, e.items.species = [new Item(structuredClone(this.selection.source))], e.misc["system.details.species.value"] = this.selection.record.name, e.misc["system.details.species.subspecies"] = "") : (delete e.customizerSpecies?.selection, delete e.items.species, delete e.misc["system.details.species.value"], delete e.misc["system.details.species.subspecies"]);
	}
	dispose() {
		this.closed = !0, qt(this.key);
	}
	async restore() {
		let t = this.app.data.customizerSpecies?.selection;
		if (t === void 0) return;
		if (!e(t) || typeof t.uuid != "string" || !e(t.source)) throw Error("The saved Species selection is invalid. Start a new character.");
		let n = t.source;
		if (n.type !== re && n.type !== "species") throw Error("The saved chargen Item is not a Species Item.");
		let i = {
			uuid: t.uuid,
			source: n,
			...e(t.identity) ? { identity: {
				self: r(t.identity, ["self"]),
				parent: r(t.identity, ["parent"])
			} } : {},
			record: {
				id: t.uuid.split(".").at(-1),
				uuid: t.uuid,
				name: String(n.name ?? "Species"),
				img: String(n.img ?? ""),
				system: E(n.system),
				effects: ne(n.effects)
			}
		};
		if (await Kt(this.key, i), this.closed) return this.dispose();
		this.selection = i, this.app.data.species = this.key, this.app.data.subspecies = "", this.commit();
	}
};
//#endregion
//#region src/module/foundry/application-element.ts
function mn(t) {
	let n = t instanceof HTMLElement ? t : e(t) ? t[0] : void 0;
	return n instanceof HTMLElement ? n : void 0;
}
//#endregion
//#region src/functions/species-chargen/preview.ts
function hn(e) {
	let t = fe(e);
	return {
		characteristics: t.characteristics,
		movement: t.movement,
		fate: t.fate,
		resilience: t.resilience,
		extra: t.extra,
		skills: t.skills?.map(gn),
		talents: t.talents?.map((e) => gn(e).replaceAll(", ", " or ")),
		randomTalents: [{
			name: e.system.tables.talents.name || "Talents",
			count: e.system.talents.random ?? 0
		}]
	};
}
function gn(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
//#endregion
//#region src/module/apps/species-chargen/table-policy.ts
function _n(e) {
	return e.type === "document" && typeof e.documentUuid == "string" && e.documentUuid ? e.documentUuid : void 0;
}
function vn() {
	return game.wfrp4e?.tables?.findTable?.("species");
}
async function yn(t) {
	let n = {}, r = (e) => ({
		valid: !1,
		choices: {},
		reason: e
	});
	if (!e(t) || t.documentName !== "RollTable" || typeof t.toObject != "function") return r("No usable Species table is configured.");
	let i = t.toObject(), a = e(i) ? i.results : void 0;
	if (!Array.isArray(a) || !a.length) return r("The Species table is empty.");
	for (let t of a) {
		let i = e(t) ? _n(t) : void 0;
		if (!i) return r("Every Species table result must be a Species Item document result.");
		try {
			let e = await fromUuid(i);
			if (!en(e) || !T(e) || e.actor) return r("Every Species table result must link a world or compendium Species Item.");
			if (game.user && !game.user.isGM && !e.testUserPermission(game.user, "OBSERVER")) return r("A Species table Item is not readable by this user.");
			n[`item:${i}`] = e.name;
		} catch {
			return r("A Species table Item could not be resolved.");
		}
	}
	return {
		valid: !0,
		choices: n,
		reason: ""
	};
}
async function bn() {
	return yn(vn());
}
//#endregion
//#region src/module/apps/species-chargen/choices.ts
var xn = _n;
async function Sn() {
	let t = vn(), n = await bn();
	if (!n.valid) throw Error(n.reason);
	if (vn() !== t) throw Error("The Species table changed. Try again.");
	let r = game.wfrp4e?.tables;
	if (!r?.rollTable) throw Error("WFRP Species table rolling is unavailable.");
	let i = await r.rollTable("species");
	if (!e(i) || !e(i.object)) throw Error("The Species table did not return a result.");
	let a = _n(i.object);
	if (!a || !n.choices[`item:${a}`]) throw Error("The rolled result is not one of the table's Species Items.");
	return i;
}
//#endregion
//#region src/functions/species-builder/world-table.ts
var Cn = "managedSpeciesTable";
function wn() {
	return {
		isRegistered: !1,
		name: "Species",
		ownership: "new",
		requiresLinkRepair: !1,
		rows: []
	};
}
function Tn(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = t.key.trim(), r = t.label.trim();
		e && r && n.set(e, {
			key: e,
			label: r
		});
	}
	for (let e of t) {
		let t = e.key.trim(), r = e.name.trim();
		t && r && n.set(t, {
			key: t,
			label: r
		});
	}
	return [...n.values()].sort((e, t) => e.label.localeCompare(t.label));
}
function En(e, t, n) {
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
function Dn(e) {
	let t = e.map((e) => Number.isInteger(e.weight) && e.weight > 0 ? e.weight : 0), n = t.reduce((e, t) => e + t, 0), r = 1;
	return t.map((e) => {
		let t = r, i = e > 0 ? t + e - 1 : t;
		return r = i + 1, {
			chance: n > 0 ? e / n : 0,
			range: [t, i]
		};
	});
}
function On(e, t, n) {
	let r = n.find((e) => e.label === t.trim());
	if (r) return r.key;
	let i = e.trim();
	return n.some((e) => e.key === i) ? i : "";
}
function kn(e) {
	let t = /@UUID\[([^\]]+)\]\{([^}]*)\}/u.exec(e), n = t?.[1]?.trim() ?? "", r = t?.[2]?.trim() ?? "";
	return n && r ? {
		label: r,
		uuid: n
	} : void 0;
}
function An(e) {
	let n = t(e, ["range"]), r = Array.isArray(n) ? Number(n[0]) : 0, i = Array.isArray(n) ? Number(n[1]) : 0;
	if (Number.isInteger(r) && Number.isInteger(i) && i >= r) return i - r + 1;
	let a = Number(t(e, ["weight"]));
	return Number.isInteger(a) && a > 0 ? a : 1;
}
function jn(e, t) {
	let n = Dn(e.rows), r = e.rows.reduce((e, t) => e + (Number.isInteger(t.weight) && t.weight > 0 ? t.weight : 0), 0);
	return {
		displayRoll: !0,
		flags: {
			wfrp4e: { key: "species" },
			[t]: { [Cn]: !0 }
		},
		formula: `1d${Math.max(r, 1)}`,
		img: "systems/wfrp4e/ui/buttons/d10.webp",
		name: Nn(e),
		replacement: !0,
		results: e.rows.map((e, t) => ({
			description: Mn(e),
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
function Mn(e) {
	let t = e.journalUuid?.trim() ?? "", n = e.name.trim();
	if (!t) throw Error(`Species "${n || e.speciesKey}" does not have a document link target.`);
	if (/[{}]/u.test(n)) throw Error(`Species "${n}" cannot be encoded in WFRP's UUID-link label.`);
	return `@UUID[${t}]{${n}}`;
}
function Nn(e) {
	let t = e.name.trim() || "Species";
	return e.ownership === "external" && !t.endsWith("(Customizer)") ? `${t} (Customizer)` : t;
}
//#endregion
//#region src/module/foundry/roll-table-results.ts
async function Pn(e, t) {
	t.updates.length > 0 && await e.updateEmbeddedDocuments("TableResult", t.updates), t.creates.length > 0 && await e.createEmbeddedDocuments("TableResult", t.creates), t.deletedIds.length > 0 && await e.deleteEmbeddedDocuments("TableResult", t.deletedIds);
}
//#endregion
//#region src/module/apps/species-builder/world-table/journals.ts
var Fn = "generatedSpeciesJournal", In = "WFRP Customizer Species Journals";
async function Ln(e) {
	let t = game.journal?.contents ?? [], n = Rn(t), r, i = [];
	for (let a of e.rows) {
		let e = zn(a.journalUuid, a.speciesKey, t) || n.get(a.speciesKey)?.uuid;
		if (!e) {
			r ??= await Vn();
			let t = await JournalEntry.create({
				flags: { [C]: { [Fn]: { speciesKey: a.speciesKey } } },
				folder: r.id,
				name: a.name.trim(),
				pages: []
			});
			if (!t) throw Error(`Foundry did not create the Journal Entry for species "${a.name}".`);
			n.set(a.speciesKey, t), e = t.uuid;
		}
		i.push({
			...a,
			journalUuid: e
		});
	}
	return {
		...e,
		requiresLinkRepair: !1,
		rows: i
	};
}
function Rn(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = Bn(n);
		if (e) {
			if (t.has(e)) throw Error(`Multiple Species Builder Journals exist for "${e}". Remove the duplicate and retry.`);
			t.set(e, n);
		}
	}
	return t;
}
function zn(e, t, n) {
	let r = e?.trim() ?? "";
	if (!r) return "";
	let i = n.find((e) => e.uuid === r);
	if (!i) return r.startsWith("JournalEntry.") && r.split(".").length === 2 ? "" : r;
	let a = Bn(i);
	return a && a !== t ? "" : r;
}
function Bn(t) {
	let r = t.getFlag(C, Fn);
	return e(r) ? n(r, ["speciesKey"]).trim() : "";
}
async function Vn() {
	let e = game.folders.contents.find((e) => e.type === "JournalEntry" && e.name === In);
	if (e) return e;
	let t = await Folder.create({
		name: In,
		type: "JournalEntry"
	});
	if (!t) throw Error("Foundry did not create the generated Species Journal folder.");
	return t;
}
//#endregion
//#region src/module/apps/species-builder/world-table/persistence.ts
var Hn = "species", Un = "tableSettings";
async function Wn(e) {
	let t = await Ln(e), n = jn(t, C);
	return e.ownership === "managed" ? await Jn(t, n) : await qn(t, n);
}
async function Gn(t) {
	let n = game.settings.get(w, Un);
	if (!e(n)) throw Error("WFRP table settings are unavailable; the Species table was not registered.");
	await game.settings.set(w, Un, {
		...n,
		[Hn]: t
	});
}
function Kn(e) {
	return e.getFlag(C, Cn) === !0;
}
async function qn(e, t) {
	if (e.ownership === "external") {
		let t = e.tableId ? game.tables?.get(e.tableId) : void 0;
		if (!t || Kn(t)) throw Error("The source Species table changed. Reload before saving a managed copy.");
	}
	if ((game.tables?.contents ?? []).some(Kn)) throw Error("A managed Species table already exists. Reload before saving.");
	let n = await RollTable.create(t);
	if (!n) throw Error("Foundry did not create the managed Species table.");
	return n;
}
async function Jn(t, n) {
	let r = t.tableId ? game.tables?.get(t.tableId) : void 0;
	if (!r || !Kn(r)) throw Error("The managed Species table changed. Reload before saving again.");
	let i = Array.isArray(n.results) ? n.results.filter(e) : [];
	return await r.update({
		displayRoll: n.displayRoll,
		[`flags.${C}.${Cn}`]: !0,
		[`flags.${w}.key`]: Hn,
		formula: n.formula,
		name: n.name,
		replacement: n.replacement
	}), await Yn(r, t.rows, i), r;
}
async function Yn(t, r, i) {
	let a = t.toObject(), o = Array.isArray(a.results) ? a.results.filter(e) : [], s = new Set(o.map((e) => n(e, ["_id"]))), c = /* @__PURE__ */ new Set(), l = [], u = [];
	i.forEach((e, t) => {
		let n = Xn(r[t], o, s, c);
		n ? (c.add(n), l.push({
			...e,
			_id: n
		})) : u.push(e);
	}), await Pn(t, {
		creates: u,
		deletedIds: [...s].filter((e) => e && !c.has(e)),
		updates: l
	});
}
function Xn(e, t, r, i) {
	if (e?.resultId && r.has(e.resultId) && !i.has(e.resultId)) return e.resultId;
	let a = t.find((t) => n(t, [
		"flags",
		"wfrp4e",
		"species"
	]) === e?.speciesKey && !i.has(n(t, ["_id"])));
	return a ? n(a, ["_id"]) : "";
}
//#endregion
//#region src/module/apps/species-chargen/default-table.ts
var Zn = "Compendium.wfrp4e-customizer-apps.species-tables.RollTable.a341d269e7805bc2";
async function Qn() {
	if (!game.user?.isGM) throw Error("Only a GM can change the configured Species table.");
	if ((await bn()).valid) return;
	let t;
	for (let e of game.tables?.contents ?? []) {
		let r = e.toObject(), i = n(r, ["_stats", "compendiumSource"]), a = n(r, [
			"flags",
			"core",
			"sourceId"
		]);
		if (!(i !== "Compendium.wfrp4e-customizer-apps.species-tables.RollTable.a341d269e7805bc2" && a !== "Compendium.wfrp4e-customizer-apps.species-tables.RollTable.a341d269e7805bc2") && (await yn(e)).valid) {
			t = e;
			break;
		}
	}
	if (!t) {
		let n = await fromUuid(Zn), r = await yn(n);
		if (!r.valid || !e(n) || typeof n.toObject != "function") throw Error(`The default Species table is unavailable or invalid. ${r.reason}`);
		let i = n.toObject();
		if (!e(i)) throw Error("The default Species table has no source data.");
		for (let e of [
			"_id",
			"folder",
			"_stats"
		]) delete i[e];
		if (i._stats = { compendiumSource: Zn }, t = await RollTable.create(i) ?? void 0, !t) throw Error("Foundry could not import the default Species table.");
	}
	await Gn(t.id);
}
//#endregion
//#region src/module/apps/species-chargen/table-reminder.ts
var $n = "hideInvalidSpeciesTableReminder", er = !1, tr;
function nr() {
	game.settings.register(C, $n, {
		name: "Hide invalid Species table reminder",
		scope: "client",
		config: !0,
		type: Boolean,
		default: !1
	});
}
function rr() {
	return tr || (!game.user?.isGM || Ie() || er || game.settings.get("wfrp4e-customizer-apps", "hideInvalidSpeciesTableReminder") === !0 || game.users?.activeGM && game.users.activeGM.id !== game.user.id ? Promise.resolve(!1) : (tr = ir().catch((e) => (ui.notifications?.error(e instanceof Error ? e.message : String(e)), !1)).finally(() => {
		tr = void 0;
	}), tr));
}
async function ir() {
	if ((await bn()).valid) return !1;
	er = !0;
	let e = null, t = await foundry.applications.api.DialogV2.wait({
		window: { title: "Species table needs Species Items" },
		content: "<p>Character creation requires a Species table whose results are all Species Items. The current table cannot be used for species rolls.</p><p>Use the supplied default table? It has Human 90%, Halfling 4%, Dwarf 4%, High Elf 1%, and Wood Elf 1%. Your current table will be kept.</p><label><input type=\"checkbox\" name=\"suppress\"> Don’t show this reminder again</label>",
		buttons: [{
			action: "replace",
			label: "Use Default Table",
			callback: (e, t) => ar(!0, t.form)
		}, {
			action: "later",
			label: "Not Now",
			default: !0,
			callback: (e, t) => ar(!1, t.form)
		}],
		render: (t, n) => {
			e = n.element.querySelector("form");
		},
		close: () => ar(!1, e),
		rejectClose: !1
	});
	return t?.suppress && await game.settings.set(C, $n, !0), t?.replace ? (await Qn(), ui.notifications?.info("Character creation now uses a Species Item table."), !0) : !1;
}
function ar(e, t) {
	return {
		replace: e,
		suppress: t?.querySelector("[name=\"suppress\"]")?.checked === !0
	};
}
//#endregion
//#region src/module/apps/species-chargen/stage.ts
function or(t, n) {
	return class extends t {
		tableValid = !1;
		tableReason = "";
		reminderStarted = !1;
		constructor(e, t) {
			super(e, t);
			let n = !!e.customizerSpecies?.selection;
			this.context.species = n ? e.species ?? "" : "", this.context.subspecies = "", this.context.exp = n ? e.exp.species ?? 0 : 0, this.context.roll = e.customizerSpecies?.roll;
		}
		async getData() {
			await n.ready, this.refreshBonus();
			let e = await bn();
			this.tableValid = e.valid, this.tableReason = e.reason, !e.valid && !this.reminderStarted && (this.reminderStarted = !0, rr().then((e) => {
				e && !n.closed && this.render(!0);
			}));
			let t = n.selection?.record;
			return {
				data: this.data,
				context: this.context,
				species: e.choices,
				speciesDisplay: t?.name ?? "",
				...t ? { preview: hn(t) } : {}
			};
		}
		activateListeners(t) {
			super.activateListeners(t);
			let n = mn(t);
			if (!n) return;
			if (!this.tableValid) {
				n.querySelector("[data-button=\"onRollSpecies\"]")?.remove();
				let e = document.createElement("p");
				e.textContent = `${this.tableReason} Species rolls are unavailable; you can still drop a Species Item.`, n.querySelector(".select-species")?.append(e);
			}
			let r = document.createElement("p");
			r.textContent = "Drop a Species Item here to choose it. Returning to your rolled species or choosing its subspecies restores the 20 XP bonus. The Item and its effects will be added to your character.", n.querySelector(".chargen-content")?.prepend(r), n.addEventListener("dragover", (e) => e.preventDefault()), n.addEventListener("drop", (t) => {
				t.preventDefault(), t.stopPropagation(), this.runSelection(async () => {
					let n = JSON.parse(t.dataTransfer?.getData("text/plain") || "{}");
					if (!e(n) || typeof n.uuid != "string") throw Error("Drop a world or compendium Species Item.");
					await this.chooseItem(n.uuid);
				});
			});
		}
		async selectSpeciesItem(e) {
			await this.runSelection(() => this.chooseItem(e));
		}
		async chooseItem(e) {
			await n.select(e), !n.closed && (this.refreshBonus(), this.context.choose = n.key, this.setSpecies(n.key), this.updateMessage("Chosen", { chosen: n.selection.record.name }));
		}
		async onSelectSpecies(e) {
			let t = e.currentTarget.dataset.species ?? "";
			await this.runSelection(async () => {
				let e = await bn();
				if (!e.valid || !e.choices[t]) throw Error(e.reason || "Choose a Species Item from the current table.");
				await this.chooseItem(t.slice(5));
			});
		}
		async onRollSpecies(e) {
			e.stopPropagation(), await this.runSelection(async () => {
				if (n.assertUnlocked(), this.context.roll) throw Error("Species has already been rolled for this character.");
				let e = await Sn();
				this.context.roll = e;
				let t = xn(e.object);
				if (!t) throw Error("The rolled result must be a Species Item.");
				this.data.customizerSpecies = {
					...this.data.customizerSpecies,
					roll: e,
					rollIdentity: [t]
				}, await n.select(t), !n.closed && (this.data.customizerSpecies.rollIdentity = n.selection.identity.self, this.context.exp = 20, this.context.choose = !1, this.setSpecies(n.key), this.updateMessage("Rolled", { rolled: e.name }));
			});
		}
		onSelectSubspecies() {
			ui.notifications?.warn?.("Choose or drop the subspecies' own Species Item.");
		}
		async validate() {
			return n.busy ? (ui.notifications?.warn?.("Wait for the Species Item to finish loading."), !1) : !n.selection || this.context.species !== n.key ? (ui.notifications?.warn?.("Choose or drop a Species Item before continuing."), !1) : super.validate();
		}
		_updateObject(e, t) {
			if (!n.selection || this.context.species !== n.key) throw Error("A Species Item must be selected before submitting this stage.");
			this.refreshBonus(), n.commit(), this.data.customizerSpecies = {
				...this.data.customizerSpecies,
				roll: this.context.roll
			}, super._updateObject(e, t);
		}
		refreshBonus() {
			let t = this.context.roll?.object, r = e(t) ? xn(t) : void 0, i = this.data.customizerSpecies?.rollIdentity ?? (r ? [r] : []);
			this.context.exp = this.context.roll ? Qt(n.selection, i) : 0;
		}
		async runSelection(e) {
			if (!(n.busy || n.closed)) {
				n.busy = !0;
				try {
					await n.ready, await e();
				} catch (e) {
					ui.notifications?.error(e instanceof Error ? e.message : String(e));
				} finally {
					n.busy = !1, n.closed || this.render(!0);
				}
			}
		}
	};
}
//#endregion
//#region src/module/apps/species-chargen/details.ts
var sr = [
	"rollName",
	"rollAge",
	"rollHeight",
	"rollEyes",
	"rollHair",
	"rollMotivation"
];
function cr(t, n) {
	return t.selection?.record.system.keys.find((t) => {
		if (n === "rollName") {
			let n = game.wfrp4e?.names?.[t];
			return e(n) && typeof n.forename == "function" && typeof n.surname == "function";
		}
		let r = game.wfrp4e?.config?.[n === "rollAge" ? "speciesAge" : "speciesHeight"], i = e(r) ? r[t] : void 0;
		return n === "rollAge" ? typeof i == "string" && !!i.trim() : e(i) && typeof i.die == "string" && typeof i.feet == "number" && typeof i.inches == "number";
	});
}
function lr(t, n) {
	return class extends t {
		generatorContext(e) {
			let t = cr(n, e);
			if (!t) throw Error("This Species has no generator for this detail. Enter it manually.");
			return Object.assign(Object.create(this), { data: {
				...this.data,
				species: t
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
		async rollDetailTable(t, n) {
			let r = game.wfrp4e?.tables;
			if (!r?.findTable?.(t, n)) throw Error("No table is available for this detail.");
			let i = await r.rollTable?.(t, {}, n), a = e(i) ? [i.text, i.name].find((e) => typeof e == "string" && e.trim()) : void 0;
			if (typeof a != "string") throw Error("The details table returned no result. Your current entry was kept.");
			return a;
		}
		rollEyes() {
			return this.rollDetailTable("eyes", n.key);
		}
		rollHair() {
			return this.rollDetailTable("hair", n.key);
		}
		rollMotivation() {
			return this.rollDetailTable("motivation");
		}
		activateListeners(e) {
			super.activateListeners(e);
			let t = mn(e);
			if (!t) return;
			let r = !1;
			for (let e of sr) {
				let i = t.querySelector(`[data-type="${e}"]`);
				if (i) {
					if (!(e === "rollName" || e === "rollAge" || e === "rollHeight" ? cr(n, e) : e === "rollMotivation" || n.selection?.record.system.tables[e === "rollEyes" ? "eye" : "hair"].uuid || n.selection?.record.system.tables[e === "rollEyes" ? "eye" : "hair"].id)) {
						i.remove(), r = !0;
						continue;
					}
					i.addEventListener("click", (t) => {
						t.preventDefault(), t.stopImmediatePropagation(), Promise.resolve().then(() => this[e]()).then((e) => {
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
				e.textContent = "Enter details manually where this Species has no generator. Check its description for any age or height guidance.", t.querySelector(".chargen-content")?.prepend(e);
			}
		}
	};
}
//#endregion
//#region src/module/apps/species-chargen/index.ts
var ur = /* @__PURE__ */ new WeakMap();
function dr() {
	Hooks.on("wfrp4e:chargen", (e) => {
		Ie() || fr(e);
	});
}
function fr(t) {
	if (Ie()) throw Error("The legacy Species bridge is disabled when native Species support is available.");
	if (!e(t) || !Array.isArray(t.stages) || !e(t.data) || typeof t.getData != "function" || typeof t.close != "function") throw Error("WFRP character generation has an unsupported application shape.");
	let n = t, r = n.stages.find((e) => e.key === "species");
	if (!r || typeof r.class != "function") throw Error("WFRP's Species stage is unavailable.");
	if (ur.has(n)) return;
	let i = new pn(n);
	ur.set(n, i), r.class = or(r.class, i);
	let a = n.stages.find((e) => e.key === "details");
	a && (a.class = lr(a.class, i));
	let o = n.getData;
	n.getData = async function() {
		return await i.ready, o.call(this);
	};
	let s = !1;
	i.ready.then(() => {
		s = !0;
	}).catch((e) => {
		ui.notifications?.error(`Could not restore Species: ${e instanceof Error ? e.message : String(e)}`);
	});
	let c = n.canStartStage;
	n.canStartStage = function(e) {
		return s && !i.busy && c.call(this, e);
	};
	let l = n.close;
	n.close = async function() {
		i.dispose();
		for (let e of this.stages) await e.app?.close();
		return l.call(this);
	};
}
async function pr(e, t) {
	fr(e);
	let n = e;
	await ur.get(n).ready;
	let r = n.stages.findIndex((e) => e.key === "species"), i = n.stages[r];
	i.app ??= new i.class(n.data, {
		complete: n.complete.bind(n),
		index: r
	});
	let a = i.app;
	await a.selectSpeciesItem(t), a.render(!0);
}
//#endregion
//#region src/functions/species-builder/items/actor-profile.ts
function mr(e) {
	let t = {};
	for (let [n, r] of Object.entries(e.characteristics)) r.base !== null && r.dice !== null && (t[`system.characteristics.${n}.initial`] = r.base + r.dice * 5);
	return e.movement !== null && (t["system.details.move.value"] = e.movement), t;
}
function hr(e, t) {
	let n = Object.entries(e.characteristics).filter(([e, n]) => e in t && n.base !== null && n.dice !== null), r = mr(e), i = n.every(([e]) => t[e] === r[`system.characteristics.${e}.initial`]), a = {};
	for (let [e, r] of n) {
		if (!(e in t) || !i && t[e] === 0) continue;
		let n = r.dice, o = n === 0 ? "0" : `${n}d10`, s = i ? "initial" : "modifier";
		a[`system.characteristics.${e}.${s}`] = i ? `${o}+${r.base}` : `${o}-${n * 5}`;
	}
	return a;
}
//#endregion
//#region src/module/apps/species-item/actor/profile.ts
function gr(t) {
	let n = t.toObject().system, r = e(n) ? n.characteristics : void 0;
	if (!e(r)) throw Error("This Actor has no characteristics.");
	let i = {};
	for (let [t, n] of Object.entries(r)) e(n) && typeof n.initial == "number" && (i[t] = n.initial);
	return i;
}
function _r(t, n) {
	let r = mr(n), i = gr(t);
	for (let e of Object.keys(n.characteristics)) e in i || delete r[`system.characteristics.${e}.initial`];
	if (t.type === "vehicle" && n.movement !== null) {
		let i = t.toObject().system, a = e(i) ? i.details : void 0, o = e(a) ? a.move : void 0;
		if (!e(o)) throw Error("This Vehicle has no Movement data.");
		let s = o.custom, c = e(s) && s.label && s.value ? "custom" : o.primary;
		if (c !== "custom" && c !== "sail" && c !== "oars") throw Error("This Vehicle has no active Movement mode.");
		delete r["system.details.move.value"], r[`system.details.move.${c}.value`] = n.movement;
	}
	return r;
}
//#endregion
//#region src/module/apps/species-item/actor/owned.ts
function vr(e) {
	return e.items?.contents.find(T);
}
async function yr(e) {
	let t = ie(e);
	if (e.actor || !de(t)) return t;
	let n = ie(await sn(t.system.subspeciesOf));
	if (de(n)) throw Error("Nested Species parents are not supported.");
	return Jt(t, n);
}
//#endregion
//#region src/module/apps/species-item/actor/drop.ts
var br = /* @__PURE__ */ new WeakSet();
async function xr(e, t) {
	if (!e.isOwner) throw Error("You cannot change this Actor's Species.");
	if (!e.items?.contents.some((e) => e.uuid === t.uuid) && !br.has(e)) {
		if (vr(e)) throw Error("Remove the Actor's existing Species Item before dropping another Species.");
		br.add(e);
		try {
			if (game.user && !t.testUserPermission(game.user, "OBSERVER")) throw Error(`You do not have permission to read ${t.name}.`);
			let n = await yr(t), r = dn(t, n), i = await e.createEmbeddedDocuments("Item", [r]);
			return i.length ? (await foundry.applications.api.DialogV2.confirm({
				window: { title: "Apply Species Characteristics" },
				content: "<p>Apply this Species Item's starting characteristics and Movement?</p><p>This replaces initial characteristic values and Movement. Advances and modifiers are kept. Choosing No keeps your current profile; the Species Item and its effects remain on the Actor.</p>",
				rejectClose: !1
			}) && e.items?.contents.includes(i[0]) && await e.update(_r(e, n.system)), i) : void 0;
		} finally {
			br.delete(e);
		}
	}
}
//#endregion
//#region src/module/apps/species-item/actor/grant.ts
async function Sr(e, t) {
	let n = game.wfrp4e?.utility, r = t === "skill" ? await n?.findSkill?.(e) : await n?.findTalent?.(e);
	if (!r || r.type !== t) throw Error(`Cannot find ${t} “${e}”.`);
	return r;
}
//#endregion
//#region src/module/apps/species-item/actor/talent-table.ts
async function Cr(t) {
	let n = await Bt(t) ?? game.wfrp4e?.tables?.findTable?.("talents");
	if (!e(n) || typeof n.roll != "function") throw Error("The Species random Talent table is unavailable.");
	let r = await n.roll({ recursive: !0 }), i = e(r) ? r.results : void 0;
	if (!Array.isArray(i) || i.length !== 1) throw Error("The Species Talent table must return one Talent per roll.");
	let a = i[0];
	if (!e(a) || typeof a.toObject != "function") throw Error("The Species Talent table returned an invalid result.");
	let o = a.toObject();
	if (!e(o)) throw Error("The Species Talent result has no data.");
	let s = Yt(o), c = o.name;
	if (!s && (typeof c != "string" || !c.trim())) throw Error("The Species Talent result has no Item link or Talent name.");
	let l = s ? nn(await fromUuid(s), "The rolled Talent Item is unavailable.") : await Sr(c, "talent");
	if (l.type !== "talent") throw Error("The Species Talent table result is not a Talent.");
	return l;
}
//#endregion
//#region src/module/apps/species-item/actor/randomize.ts
async function wr(e, t, n) {
	if (!e.isOwner) throw Error("You cannot change this Actor.");
	let { system: r } = ie(t);
	n === "characteristics" ? await Tr(e, r) : n === "skills" ? await Er(e, r) : n === "talents" && await Dr(e, r);
}
async function Tr(e, t) {
	let n = hr(t, gr(e)), r = {};
	for (let [e, t] of Object.entries(n)) r[e] = await Or(t);
	await e.update(r);
}
async function Er(t, n) {
	let r = [...new Set(n.skills.list.filter((e) => e.trim()))];
	if (!r.length) throw Error("This Species Item has no Skills.");
	let i = [];
	for (; i.length < 6 && r.length;) {
		let e = await Or(`1d${r.length}-1`);
		i.push(r.splice(e, 1)[0]);
	}
	let a = [];
	for (let [n, r] of i.entries()) {
		let i = (t.items?.contents.find((e) => e.type === "skill" && e.name === r) ?? await Sr(r, "skill")).toObject(), o = i.system;
		if (!e(o) || !e(o.advances)) throw Error(`Skill ${r} has no advances data.`);
		let s = o.advances.value;
		if (typeof s != "number") throw Error(`Skill ${r} has invalid advances.`);
		o.advances.value = Math.max(s, n < 3 ? 5 : 3), a.push(i);
	}
	await t.update({ items: a });
}
async function Dr(e, t) {
	let n = b(t.talents.choices), r = [];
	for (let e of n) {
		let t = e.choices[await Or(`1d${e.choices.length}-1`)], n = t.item?.uuid ? nn(await fromUuid(t.item.uuid), `Talent ${t.name} is unavailable.`) : await Sr(t.name, "talent");
		if (n.type !== "talent") throw Error(`${t.name} is not a Talent.`);
		r.push(n.toObject());
	}
	for (let e = 0; e < (t.talents.random ?? 0); e++) r.push((await Cr(t.tables.talents)).toObject());
	if (!r.length) throw Error("This Species Item has no Talents.");
	await e.createEmbeddedDocuments("Item", r);
}
async function Or(e) {
	return (await new Roll(e).roll({ allowInteractive: !1 })).total;
}
//#endregion
//#region src/module/apps/species-item/actor/integration.ts
var kr = /* @__PURE__ */ new WeakSet();
function Ar(e) {
	let t = Object.getOwnPropertyDescriptor(e, "Species");
	if (!t?.get) throw Error("WFRP Actor Species getter is unavailable.");
	let n = t.get;
	Object.defineProperty(e, "Species", {
		...t,
		get() {
			return vr(this)?.name ?? n.call(this);
		}
	});
}
function jr(t, n) {
	if (!e(t) || !$t(t.document) || !e(t.options) || !e(t.options.actions) || typeof t._onDropItem != "function") return;
	let r = t;
	if (kr.has(r) || (Mr(r), kr.add(r)), !(n instanceof HTMLElement)) return;
	let i = n.querySelector("[data-action='editSpecies']"), a = vr(r.document);
	i && (i.readOnly = !!a), i && a && (i.value = a.name, i.readOnly = !0, i.title = "Species comes from the owned Item. Open it from the sheet header menu to edit.");
}
function Mr(t) {
	let n = t._onDropItem;
	t._onDropItem = async function(t, r) {
		if (!e(t) || typeof t.uuid != "string") return n.call(this, t, r);
		try {
			let e = await fromUuid(t.uuid);
			if (en(e) && T(e)) return await xr(this.document, e);
		} catch (e) {
			Nr(e);
			return;
		}
		return n.call(this, t, r);
	};
	let r = t.options.actions.randomize;
	typeof r == "function" && (t.options.actions.randomize = async function(e, t) {
		let n = vr(this.document);
		if (!n) return r.call(this, e, t);
		let i = t ?? e.target;
		if (i instanceof HTMLElement) try {
			await wr(this.document, n, i.dataset.type ?? "");
		} catch (e) {
			Nr(e);
		}
	});
}
function Nr(e) {
	ui.notifications?.error(e instanceof Error ? e.message : String(e));
}
//#endregion
//#region src/module/apps/species-item/actor-sheet.ts
function Pr() {
	Ie() || (Hooks.once("setup", () => {
		let e = game.wfrp4e;
		Ar(e.documents.ActorWFRP4e.prototype);
	}), Hooks.on("renderApplicationV2", jr));
	for (let t of [
		"Character",
		"NPC",
		"Creature",
		"Vehicle"
	]) Hooks.on(`getHeaderControlsActorSheetWFRP4e${t}`, (t, n) => {
		if (!e(t) || !Array.isArray(n)) return;
		let r = t.document;
		if (!$t(r)) return;
		let i = t.options;
		if (!(!e(i) || !e(i.actions))) for (let e of r.items?.contents.filter(T) ?? []) {
			let t = `openSpecies${e.id}`;
			if (n.push({
				action: t,
				icon: "fa-solid fa-people-group",
				label: `Species: ${e.name}`
			}), i.actions[t] = () => e.sheet?.render(!0), r.isOwner) {
				let t = `removeSpecies${e.id}`;
				n.push({
					action: t,
					icon: "fa-solid fa-trash",
					label: `Remove Species: ${e.name}`
				}), i.actions[t] = () => e.deleteDialog();
			}
		}
	});
}
//#endregion
//#region src/module/logging.ts
function Fr(e, ...t) {
	console.info(e, ...t);
}
function Ir(e, ...t) {
	console.warn(e, ...t);
}
//#endregion
//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function Lr(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var j = {}, Rr = [], zr = () => {}, Br = () => !1, Vr = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Hr = (e) => e.startsWith("onUpdate:"), Ur = Object.assign, Wr = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, Gr = Object.prototype.hasOwnProperty, M = (e, t) => Gr.call(e, t), N = Array.isArray, Kr = (e) => $r(e) === "[object Map]", qr = (e) => $r(e) === "[object Set]", Jr = (e) => $r(e) === "[object Date]", P = (e) => typeof e == "function", Yr = (e) => typeof e == "string", Xr = (e) => typeof e == "symbol", F = (e) => typeof e == "object" && !!e, Zr = (e) => (F(e) || P(e)) && P(e.then) && P(e.catch), Qr = Object.prototype.toString, $r = (e) => Qr.call(e), ei = (e) => $r(e).slice(8, -1), ti = (e) => $r(e) === "[object Object]", ni = (e) => Yr(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ri = /* @__PURE__ */ Lr(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ii = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ai = /-\w/g, oi = ii((e) => e.replace(ai, (e) => e.slice(1).toUpperCase())), si = /\B([A-Z])/g, ci = ii((e) => e.replace(si, "-$1").toLowerCase()), li = ii((e) => e.charAt(0).toUpperCase() + e.slice(1)), di = ii((e) => e ? `on${li(e)}` : ""), fi = (e, t) => !Object.is(e, t), pi = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, mi = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, hi = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, gi, _i = () => gi ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function vi(e) {
	if (N(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = Yr(r) ? Si(r) : vi(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (Yr(e) || F(e)) return e;
}
var yi = /;(?![^(]*\))/g, bi = /:([^]+)/, xi = /\/\*[^]*?\*\//g;
function Si(e) {
	let t = {};
	return e.replace(xi, "").split(yi).forEach((e) => {
		if (e) {
			let n = e.split(bi);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function I(e) {
	let t = "";
	if (Yr(e)) t = e;
	else if (N(e)) for (let n = 0; n < e.length; n++) {
		let r = I(e[n]);
		r && (t += r + " ");
	}
	else if (F(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var Ci = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", wi = /* @__PURE__ */ Lr(Ci);
Ci + "";
function Ti(e) {
	return !!e || e === "";
}
function Ei(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = Di(e[r], t[r]);
	return n;
}
function Di(e, t) {
	if (e === t) return !0;
	let n = Jr(e), r = Jr(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = Xr(e), r = Xr(t), n || r) return e === t;
	if (n = N(e), r = N(t), n || r) return n && r ? Ei(e, t) : !1;
	if (n = F(e), r = F(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !Di(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function Oi(e, t) {
	return e.findIndex((e) => Di(e, t));
}
var ki = (e) => !!(e && e.__v_isRef === !0), L = (e) => Yr(e) ? e : e == null ? "" : N(e) || F(e) && (e.toString === Qr || !P(e.toString)) ? ki(e) ? L(e.value) : JSON.stringify(e, Ai, 2) : String(e), Ai = (e, t) => ki(t) ? Ai(e, t.value) : Kr(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[ji(t, r) + " =>"] = n, e), {}) } : qr(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => ji(e)) } : Xr(t) ? ji(t) : F(t) && !N(t) && !ti(t) ? String(t) : t, ji = (e, t = "") => Xr(e) ? `Symbol(${e.description ?? t})` : e, Mi, Ni = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Mi && (Mi.active ? (this.parent = Mi, this.index = (Mi.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = Mi;
			try {
				return Mi = this, e();
			} finally {
				Mi = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Mi, Mi = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Mi === this) Mi = this.prevScope;
			else {
				let e = Mi;
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
function Pi(e) {
	return new Ni(e);
}
function Fi() {
	return Mi;
}
function Ii(e, t = !1) {
	Mi && Mi.cleanups.push(e);
}
var R, Li = /* @__PURE__ */ new WeakSet(), Ri = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Mi && (Mi.active ? Mi.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Li.has(this) && (Li.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Hi(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, ta(this), Gi(this);
		let e = R, t = Zi;
		R = this, Zi = !0;
		try {
			return this.fn();
		} finally {
			Ki(this), R = e, Zi = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Yi(e);
			this.deps = this.depsTail = void 0, ta(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Li.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		qi(this) && this.run();
	}
	get dirty() {
		return qi(this);
	}
}, zi = 0, Bi, Vi;
function Hi(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Vi, Vi = e;
		return;
	}
	e.next = Bi, Bi = e;
}
function Ui() {
	zi++;
}
function Wi() {
	if (--zi > 0) return;
	if (Vi) {
		let e = Vi;
		for (Vi = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Bi;) {
		let t = Bi;
		for (Bi = void 0; t;) {
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
function Gi(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ki(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Yi(r), Xi(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function qi(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ji(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ji(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === na) || (e.globalVersion = na, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !qi(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = R, r = Zi;
	R = e, Zi = !0;
	try {
		Gi(e);
		let n = e.fn(e._value);
		(t.version === 0 || fi(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		R = n, Zi = r, Ki(e), e.flags &= -3;
	}
}
function Yi(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Yi(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Xi(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Zi = !0, Qi = [];
function $i() {
	Qi.push(Zi), Zi = !1;
}
function ea() {
	let e = Qi.pop();
	Zi = e === void 0 ? !0 : e;
}
function ta(e) {
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
var na = 0, ra = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, ia = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!R || !Zi || R === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== R) t = this.activeLink = new ra(R, this), R.deps ? (t.prevDep = R.depsTail, R.depsTail.nextDep = t, R.depsTail = t) : R.deps = R.depsTail = t, aa(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = R.depsTail, t.nextDep = void 0, R.depsTail.nextDep = t, R.depsTail = t, R.deps === t && (R.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, na++, this.notify(e);
	}
	notify(e) {
		Ui();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Wi();
		}
	}
};
function aa(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) aa(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var oa = /* @__PURE__ */ new WeakMap(), sa = /* @__PURE__ */ Symbol(""), ca = /* @__PURE__ */ Symbol(""), la = /* @__PURE__ */ Symbol("");
function ua(e, t, n) {
	if (Zi && R) {
		let t = oa.get(e);
		t || oa.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new ia()), r.map = t, r.key = n), r.track();
	}
}
function da(e, t, n, r, i, a) {
	let o = oa.get(e);
	if (!o) {
		na++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Ui(), t === "clear") o.forEach(s);
	else {
		let i = N(e), a = i && ni(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === la || !Xr(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(la)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(sa)), Kr(e) && s(o.get(ca)));
				break;
			case "delete":
				i || (s(o.get(sa)), Kr(e) && s(o.get(ca)));
				break;
			case "set":
				Kr(e) && s(o.get(sa));
				break;
		}
	}
	Wi();
}
function fa(e, t) {
	let n = oa.get(e);
	return n && n.get(t);
}
function pa(e) {
	let t = /* @__PURE__ */ z(e);
	return t === e ? t : (ua(t, "iterate", la), /* @__PURE__ */ Qa(e) ? t : t.map(to));
}
function ma(e) {
	return ua(e = /* @__PURE__ */ z(e), "iterate", la), e;
}
function ha(e, t) {
	return /* @__PURE__ */ Za(e) ? no(/* @__PURE__ */ Xa(e) ? to(t) : t) : to(t);
}
var ga = {
	__proto__: null,
	[Symbol.iterator]() {
		return _a(this, Symbol.iterator, (e) => ha(this, e));
	},
	concat(...e) {
		return pa(this).concat(...e.map((e) => N(e) ? pa(e) : e));
	},
	entries() {
		return _a(this, "entries", (e) => (e[1] = ha(this, e[1]), e));
	},
	every(e, t) {
		return ya(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return ya(this, "filter", e, t, (e) => e.map((e) => ha(this, e)), arguments);
	},
	find(e, t) {
		return ya(this, "find", e, t, (e) => ha(this, e), arguments);
	},
	findIndex(e, t) {
		return ya(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return ya(this, "findLast", e, t, (e) => ha(this, e), arguments);
	},
	findLastIndex(e, t) {
		return ya(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return ya(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return xa(this, "includes", e);
	},
	indexOf(...e) {
		return xa(this, "indexOf", e);
	},
	join(e) {
		return pa(this).join(e);
	},
	lastIndexOf(...e) {
		return xa(this, "lastIndexOf", e);
	},
	map(e, t) {
		return ya(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return Sa(this, "pop");
	},
	push(...e) {
		return Sa(this, "push", e);
	},
	reduce(e, ...t) {
		return ba(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return ba(this, "reduceRight", e, t);
	},
	shift() {
		return Sa(this, "shift");
	},
	some(e, t) {
		return ya(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return Sa(this, "splice", e);
	},
	toReversed() {
		return pa(this).toReversed();
	},
	toSorted(e) {
		return pa(this).toSorted(e);
	},
	toSpliced(...e) {
		return pa(this).toSpliced(...e);
	},
	unshift(...e) {
		return Sa(this, "unshift", e);
	},
	values() {
		return _a(this, "values", (e) => ha(this, e));
	}
};
function _a(e, t, n) {
	let r = ma(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Qa(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var va = Array.prototype;
function ya(e, t, n, r, i, a) {
	let o = ma(e), s = o !== e && !/* @__PURE__ */ Qa(e), c = o[t];
	if (c !== va[t]) {
		let t = c.apply(e, a);
		return s ? to(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, ha(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function ba(e, t, n, r) {
	let i = ma(e), a = i !== e && !/* @__PURE__ */ Qa(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = ha(e, t)), n.call(this, t, ha(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? ha(e, c) : c;
}
function xa(e, t, n) {
	let r = /* @__PURE__ */ z(e);
	ua(r, "iterate", la);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ $a(n[0]) ? (n[0] = /* @__PURE__ */ z(n[0]), r[t](...n)) : i;
}
function Sa(e, t, n = []) {
	$i(), Ui();
	let r = (/* @__PURE__ */ z(e))[t].apply(e, n);
	return Wi(), ea(), r;
}
var Ca = /* @__PURE__ */ Lr("__proto__,__v_isRef,__isVue"), wa = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Xr));
function Ta(e) {
	Xr(e) || (e = String(e));
	let t = /* @__PURE__ */ z(this);
	return ua(t, "has", e), t.hasOwnProperty(e);
}
var Ea = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Wa : Ua : i ? Ha : Va).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = N(e);
		if (!r) {
			let e;
			if (a && (e = ga[t])) return e;
			if (t === "hasOwnProperty") return Ta;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ ro(e) ? e : n);
		if ((Xr(t) ? wa.has(t) : Ca(t)) || (r || ua(e, "get", t), i)) return o;
		if (/* @__PURE__ */ ro(o)) {
			let e = a && ni(t) ? o : o.value;
			return r && F(e) ? /* @__PURE__ */ Ja(e) : e;
		}
		return F(o) ? r ? /* @__PURE__ */ Ja(o) : /* @__PURE__ */ Ka(o) : o;
	}
}, Da = class extends Ea {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = N(e) && ni(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Za(i);
			if (!/* @__PURE__ */ Qa(n) && !/* @__PURE__ */ Za(n) && (i = /* @__PURE__ */ z(i), n = /* @__PURE__ */ z(n)), !a && /* @__PURE__ */ ro(i) && !/* @__PURE__ */ ro(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : M(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ ro(e) ? e : r);
		return e === /* @__PURE__ */ z(r) && (o ? fi(n, i) && da(e, "set", t, n, i) : da(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = M(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && da(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!Xr(t) || !wa.has(t)) && ua(e, "has", t), n;
	}
	ownKeys(e) {
		return ua(e, "iterate", N(e) ? "length" : sa), Reflect.ownKeys(e);
	}
}, Oa = class extends Ea {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, ka = /* @__PURE__ */ new Da(), Aa = /* @__PURE__ */ new Oa(), ja = /* @__PURE__ */ new Da(!0), Ma = (e) => e, Na = (e) => Reflect.getPrototypeOf(e);
function Pa(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ z(i), o = Kr(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Ma : t ? no : to;
		return !t && ua(a, "iterate", c ? ca : sa), Ur(Object.create(l), { next() {
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
function Fa(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Ia(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ z(r), a = /* @__PURE__ */ z(n);
			e || (fi(n, a) && ua(i, "get", n), ua(i, "get", a));
			let { has: o } = Na(i), s = t ? Ma : e ? no : to;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && ua(/* @__PURE__ */ z(t), "iterate", sa), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ z(n), i = /* @__PURE__ */ z(t);
			return e || (fi(t, i) && ua(r, "has", t), ua(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ z(a), s = t ? Ma : e ? no : to;
			return !e && ua(o, "iterate", sa), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return Ur(n, e ? {
		add: Fa("add"),
		set: Fa("set"),
		delete: Fa("delete"),
		clear: Fa("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ z(this), r = Na(n), i = /* @__PURE__ */ z(e), a = !t && !/* @__PURE__ */ Qa(e) && !/* @__PURE__ */ Za(e) ? i : e;
			return r.has.call(n, a) || fi(e, a) && r.has.call(n, e) || fi(i, a) && r.has.call(n, i) || (n.add(a), da(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Qa(n) && !/* @__PURE__ */ Za(n) && (n = /* @__PURE__ */ z(n));
			let r = /* @__PURE__ */ z(this), { has: i, get: a } = Na(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ z(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? fi(n, s) && da(r, "set", e, n, s) : da(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ z(this), { has: n, get: r } = Na(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ z(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && da(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ z(this), t = e.size !== 0, n = e.clear();
			return t && da(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Pa(r, e, t);
	}), n;
}
function La(e, t) {
	let n = Ia(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(M(n, r) && r in t ? n : t, r, i);
}
var Ra = { get: /* @__PURE__ */ La(!1, !1) }, za = { get: /* @__PURE__ */ La(!1, !0) }, Ba = { get: /* @__PURE__ */ La(!0, !1) }, Va = /* @__PURE__ */ new WeakMap(), Ha = /* @__PURE__ */ new WeakMap(), Ua = /* @__PURE__ */ new WeakMap(), Wa = /* @__PURE__ */ new WeakMap();
function Ga(e) {
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
function Ka(e) {
	return /* @__PURE__ */ Za(e) ? e : Ya(e, !1, ka, Ra, Va);
}
// @__NO_SIDE_EFFECTS__
function qa(e) {
	return Ya(e, !1, ja, za, Ha);
}
// @__NO_SIDE_EFFECTS__
function Ja(e) {
	return Ya(e, !0, Aa, Ba, Ua);
}
function Ya(e, t, n, r, i) {
	if (!F(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Ga(ei(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Xa(e) {
	return /* @__PURE__ */ Za(e) ? /* @__PURE__ */ Xa(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Za(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Qa(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function $a(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ z(t) : e;
}
function eo(e) {
	return !M(e, "__v_skip") && Object.isExtensible(e) && mi(e, "__v_skip", !0), e;
}
var to = (e) => F(e) ? /* @__PURE__ */ Ka(e) : e, no = (e) => F(e) ? /* @__PURE__ */ Ja(e) : e;
// @__NO_SIDE_EFFECTS__
function ro(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function B(e) {
	return io(e, !1);
}
function io(e, t) {
	return /* @__PURE__ */ ro(e) ? e : new ao(e, t);
}
var ao = class {
	constructor(e, t) {
		this.dep = new ia(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ z(e), this._value = t ? e : to(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Qa(e) || /* @__PURE__ */ Za(e);
		e = n ? e : /* @__PURE__ */ z(e), fi(e, t) && (this._rawValue = e, this._value = n ? e : to(e), this.dep.trigger());
	}
};
function V(e) {
	return /* @__PURE__ */ ro(e) ? e.value : e;
}
var oo = {
	get: (e, t, n) => t === "__v_raw" ? e : V(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ ro(i) && !/* @__PURE__ */ ro(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function so(e) {
	return /* @__PURE__ */ Xa(e) ? e : new Proxy(e, oo);
}
// @__NO_SIDE_EFFECTS__
function co(e) {
	let t = N(e) ? Array(e.length) : {};
	for (let n in e) t[n] = po(e, n);
	return t;
}
var lo = class {
	constructor(e, t, n) {
		this._object = e, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0, this._key = Xr(t) ? t : String(t), this._raw = /* @__PURE__ */ z(e);
		let r = !0, i = e;
		if (!N(e) || Xr(this._key) || !ni(this._key)) do
			r = !/* @__PURE__ */ $a(i) || /* @__PURE__ */ Qa(i);
		while (r && (i = i.__v_raw));
		this._shallow = r;
	}
	get value() {
		let e = this._object[this._key];
		return this._shallow && (e = V(e)), this._value = e === void 0 ? this._defaultValue : e;
	}
	set value(e) {
		if (this._shallow && /* @__PURE__ */ ro(this._raw[this._key])) {
			let t = this._object[this._key];
			if (/* @__PURE__ */ ro(t)) {
				t.value = e;
				return;
			}
		}
		this._object[this._key] = e;
	}
	get dep() {
		return fa(this._raw, this._key);
	}
}, uo = class {
	constructor(e) {
		this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
};
// @__NO_SIDE_EFFECTS__
function fo(e, t, n) {
	return /* @__PURE__ */ ro(e) ? e : P(e) ? new uo(e) : F(e) && arguments.length > 1 ? po(e, t, n) : /* @__PURE__ */ B(e);
}
function po(e, t, n) {
	return new lo(e, t, n);
}
var mo = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new ia(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = na - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && R !== this) return Hi(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ji(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function ho(e, t, n = !1) {
	let r, i;
	return P(e) ? r = e : (r = e.get, i = e.set), new mo(r, i, n);
}
var go = {}, _o = /* @__PURE__ */ new WeakMap(), vo = void 0;
function yo(e, t = !1, n = vo) {
	if (n) {
		let t = _o.get(n);
		t || _o.set(n, t = []), t.push(e);
	}
}
function bo(e, t, n = j) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ Qa(e) || i === !1 || i === 0 ? xo(e, 1) : xo(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ ro(e) ? (d = () => e.value, m = /* @__PURE__ */ Qa(e)) : /* @__PURE__ */ Xa(e) ? (d = () => l(e), m = !0) : N(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ Xa(e) || /* @__PURE__ */ Qa(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ ro(e)) return e.value;
		if (/* @__PURE__ */ Xa(e)) return l(e);
		if (P(e)) return c ? c(e, 2) : e();
	})) : d = P(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			$i();
			try {
				f();
			} finally {
				ea();
			}
		}
		let t = vo;
		vo = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			vo = t;
		}
	} : zr, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => xo(e(), t);
	}
	let g = Fi(), _ = () => {
		u.stop(), g && g.active && Wr(g.effects, u);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return _(), n;
		};
	}
	let v = h ? Array(e.length).fill(go) : go, y = (e) => {
		if (!(!(u.flags & 1) || !u.dirty && !e)) if (t) {
			let n = u.run();
			if (e || i || m || (h ? n.some((e, t) => fi(e, v[t])) : fi(n, v))) {
				f && f();
				let e = vo;
				vo = u;
				try {
					let e = [
						n,
						v === go ? void 0 : h && v[0] === go ? [] : v,
						p
					];
					v = n, c ? c(t, 3, e) : t(...e);
				} finally {
					vo = e;
				}
			}
		} else u.run();
	};
	return s && s(y), u = new Ri(d), u.scheduler = o ? () => o(y, !1) : y, p = (e) => yo(e, !1, u), f = u.onStop = () => {
		let e = _o.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			_o.delete(u);
		}
	}, t ? r ? y(!0) : v = u.run() : o ? o(y.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function xo(e, t = Infinity, n) {
	if (t <= 0 || !F(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ ro(e)) xo(e.value, t, n);
	else if (N(e)) for (let r = 0; r < e.length; r++) xo(e[r], t, n);
	else if (qr(e) || Kr(e)) e.forEach((e) => {
		xo(e, t, n);
	});
	else if (ti(e)) {
		for (let r in e) xo(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && xo(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function So(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		wo(e, t, n);
	}
}
function Co(e, t, n, r) {
	if (P(e)) {
		let i = So(e, t, n, r);
		return i && Zr(i) && i.catch((e) => {
			wo(e, t, n);
		}), i;
	}
	if (N(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Co(e[a], t, n, r));
		return i;
	}
}
function wo(e, t, n, r = !0) {
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
			$i(), So(a, null, 10, [
				e,
				i,
				o
			]), ea();
			return;
		}
	}
	To(e, n, i, r, o);
}
function To(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var Eo = [], Do = -1, Oo = [], ko = null, Ao = 0, jo = /* @__PURE__ */ Promise.resolve(), Mo = null;
function No(e) {
	let t = Mo || jo;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Po(e) {
	let t = Do + 1, n = Eo.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Eo[r], a = Bo(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Fo(e) {
	if (!(e.flags & 1)) {
		let t = Bo(e), n = Eo[Eo.length - 1];
		!n || !(e.flags & 2) && t >= Bo(n) ? Eo.push(e) : Eo.splice(Po(t), 0, e), e.flags |= 1, Io();
	}
}
function Io() {
	Mo ||= jo.then(Vo);
}
function Lo(e) {
	N(e) ? Oo.push(...e) : ko && e.id === -1 ? ko.splice(Ao + 1, 0, e) : e.flags & 1 || (Oo.push(e), e.flags |= 1), Io();
}
function Ro(e, t, n = Do + 1) {
	for (; n < Eo.length; n++) {
		let t = Eo[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			Eo.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function zo(e) {
	if (Oo.length) {
		let e = [...new Set(Oo)].sort((e, t) => Bo(e) - Bo(t));
		if (Oo.length = 0, ko) {
			ko.push(...e);
			return;
		}
		for (ko = e, Ao = 0; Ao < ko.length; Ao++) {
			let e = ko[Ao];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		ko = null, Ao = 0;
	}
}
var Bo = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Vo(e) {
	try {
		for (Do = 0; Do < Eo.length; Do++) {
			let e = Eo[Do];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), So(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Do < Eo.length; Do++) {
			let e = Eo[Do];
			e && (e.flags &= -2);
		}
		Do = -1, Eo.length = 0, zo(e), Mo = null, (Eo.length || Oo.length) && Vo(e);
	}
}
var Ho = null, Uo = null;
function Wo(e) {
	let t = Ho;
	return Ho = e, Uo = e && e.type.__scopeId || null, t;
}
function H(e, t = Ho, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && tl(-1);
		let i = Wo(t), a;
		try {
			a = e(...n);
		} finally {
			Wo(i), r._d && tl(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function Go(e, t) {
	if (Ho === null) return e;
	let n = Fl(Ho), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = j] = t[e];
		i && (P(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && xo(a), r.push({
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
function Ko(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && ($i(), Co(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), ea());
	}
}
function qo(e, t) {
	if (yl) {
		let n = yl.provides, r = yl.parent && yl.parent.provides;
		r === n && (n = yl.provides = Object.create(r)), n[e] = t;
	}
}
function Jo(e, t, n = !1) {
	let r = bl();
	if (r || ic) {
		let i = ic ? ic._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && P(t) ? t.call(r && r.proxy) : t;
	}
}
function Yo() {
	return !!(bl() || ic);
}
var Xo = /* @__PURE__ */ Symbol.for("v-scx"), Zo = () => Jo(Xo);
function Qo(e, t, n) {
	return $o(e, t, n);
}
function $o(e, t, n = j) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = Ur({}, n), c = t && r || !t && a !== "post", l;
	if (El) {
		if (a === "sync") {
			let e = Zo();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = zr, e.resume = zr, e.pause = zr, e;
		}
	}
	let u = yl;
	s.call = (e, t, n) => Co(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		Fc(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : Fo(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = bo(e, t, s);
	return El && (l ? l.push(f) : c && f()), f;
}
function es(e, t, n) {
	let r = this.proxy, i = Yr(e) ? e.includes(".") ? ts(r, e) : () => r[e] : e.bind(r, r), a;
	P(t) ? a = t : (a = t.handler, n = t);
	let o = Cl(this), s = $o(i, a.bind(r), n);
	return o(), s;
}
function ts(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var ns = /* @__PURE__ */ Symbol("_vte"), rs = (e) => e.__isTeleport, is = /* @__PURE__ */ Symbol("_leaveCb");
function as(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, as(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function U(e, t) {
	return P(e) ? /* @__PURE__ */ Ur({ name: e.name }, t, { setup: e }) : e;
}
function os() {
	let e = bl();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function ss(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function cs(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var ls = /* @__PURE__ */ new WeakMap();
function us(e, t, n, r, i = !1) {
	if (N(e)) {
		e.forEach((e, a) => us(e, t && (N(t) ? t[a] : t), n, r, i));
		return;
	}
	if (fs(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && us(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Fl(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === j ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ z(d), p = d === j ? Br : (e) => cs(u, e) ? !1 : M(f, e), m = (e, t) => !(t && cs(u, t));
	if (l != null && l !== c) {
		if (ds(t), Yr(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ ro(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (P(c)) So(c, s, 12, [o, u]);
	else {
		let t = Yr(c), r = /* @__PURE__ */ ro(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) N(n) && Wr(n, a);
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
					s(), ls.delete(e);
				};
				t.id = -1, ls.set(e, t), Fc(t, n);
			} else ds(e), s();
		}
	}
}
function ds(e) {
	let t = ls.get(e);
	t && (t.flags |= 8, ls.delete(e));
}
_i().requestIdleCallback, _i().cancelIdleCallback;
var fs = (e) => !!e.type.__asyncLoader, ps = (e) => e.type.__isKeepAlive;
function ms(e, t) {
	gs(e, "a", t);
}
function hs(e, t) {
	gs(e, "da", t);
}
function gs(e, t, n = yl) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (vs(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) ps(e.parent.vnode) && _s(r, t, n, e), e = e.parent;
	}
}
function _s(e, t, n, r) {
	let i = vs(t, e, r, !0);
	Ts(() => {
		Wr(r[t], i);
	}, n);
}
function vs(e, t, n = yl, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			$i();
			let i = Cl(n), a = Co(t, n, e, r);
			return i(), ea(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var ys = (e) => (t, n = yl) => {
	(!El || e === "sp") && vs(e, (...e) => t(...e), n);
}, bs = ys("bm"), xs = ys("m"), Ss = ys("bu"), Cs = ys("u"), ws = ys("bum"), Ts = ys("um"), Es = ys("sp"), Ds = ys("rtg"), Os = ys("rtc");
function ks(e, t = yl) {
	vs("ec", e, t);
}
var As = /* @__PURE__ */ Symbol.for("v-ndc");
function W(e, t, n, r) {
	let i, a = n && n[r], o = N(e);
	if (o || Yr(e)) {
		let n = o && /* @__PURE__ */ Xa(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Qa(e), s = /* @__PURE__ */ Za(e), e = ma(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? no(to(e[n])) : to(e[n]) : e[n], n, void 0, a && a[n]);
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
function js(e, t, n = {}, r, i) {
	if (Ho.ce || Ho.parent && fs(Ho.parent) && Ho.parent.ce) {
		let e = Object.keys(n).length > 0;
		return t !== "default" && (n.name = t), K(), J(G, null, [X("slot", n, r && r())], e ? -2 : 64);
	}
	let a = e[t];
	a && a._c && (a._d = !1), K();
	let o = a && Ms(a(n)), s = n.key || o && o.key, c = J(G, { key: (s && !Xr(s) ? s : `_${t}`) + (!o && r ? "_fb" : "") }, o || (r ? r() : []), o && e._ === 1 ? 64 : -2);
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), a && a._c && (a._d = !0), c;
}
function Ms(e) {
	return e.some((e) => rl(e) ? !(e.type === Yc || e.type === G && !Ms(e.children)) : !0) ? e : null;
}
var Ns = (e) => e ? Tl(e) ? Fl(e) : Ns(e.parent) : null, Ps = /* @__PURE__ */ Ur(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Ns(e.parent),
	$root: (e) => Ns(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Gs(e),
	$forceUpdate: (e) => e.f ||= () => {
		Fo(e.update);
	},
	$nextTick: (e) => e.n ||= No.bind(e.proxy),
	$watch: (e) => es.bind(e)
}), Fs = (e, t) => e !== j && !e.__isScriptSetup && M(e, t), Is = {
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
			else if (Fs(r, t)) return o[t] = 1, r[t];
			else if (i !== j && M(i, t)) return o[t] = 2, i[t];
			else if (M(a, t)) return o[t] = 3, a[t];
			else if (n !== j && M(n, t)) return o[t] = 4, n[t];
			else Bs && (o[t] = 0);
		}
		let l = Ps[t], u, d;
		if (l) return t === "$attrs" && ua(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== j && M(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, M(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Fs(i, t) ? (i[t] = n, !0) : r !== j && M(r, t) ? (r[t] = n, !0) : M(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || e !== j && s[0] !== "$" && M(e, s) || Fs(t, s) || M(a, s) || M(r, s) || M(Ps, s) || M(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? M(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Ls() {
	return Rs("useSlots").slots;
}
function Rs(e) {
	let t = bl();
	return t.setupContext ||= Pl(t);
}
function zs(e) {
	return N(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var Bs = !0;
function Vs(e) {
	let t = Gs(e), n = e.proxy, r = e.ctx;
	Bs = !1, t.beforeCreate && Us(t.beforeCreate, e, "bc");
	let { data: i, computed: a, methods: o, watch: s, provide: c, inject: l, created: u, beforeMount: d, mounted: f, beforeUpdate: p, updated: m, activated: h, deactivated: g, beforeDestroy: _, beforeUnmount: v, destroyed: y, unmounted: b, render: x, renderTracked: S, renderTriggered: ee, errorCaptured: C, serverPrefetch: te, expose: w, inheritAttrs: ne, components: re, directives: T, filters: ie } = t;
	if (l && Hs(l, r, null), o) for (let e in o) {
		let t = o[e];
		P(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		F(t) && (e.data = /* @__PURE__ */ Ka(t));
	}
	if (Bs = !0, a) for (let e in a) {
		let t = a[e], i = $({
			get: P(t) ? t.bind(n, n) : P(t.get) ? t.get.bind(n, n) : zr,
			set: !P(t) && P(t.set) ? t.set.bind(n) : zr
		});
		Object.defineProperty(r, e, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		});
	}
	if (s) for (let e in s) Ws(s[e], r, n, e);
	if (c) {
		let e = P(c) ? c.call(n) : c;
		Reflect.ownKeys(e).forEach((t) => {
			qo(t, e[t]);
		});
	}
	u && Us(u, e, "c");
	function E(e, t) {
		N(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (E(bs, d), E(xs, f), E(Ss, p), E(Cs, m), E(ms, h), E(hs, g), E(ks, C), E(Os, S), E(Ds, ee), E(ws, v), E(Ts, b), E(Es, te), N(w)) if (w.length) {
		let t = e.exposed ||= {};
		w.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	x && e.render === zr && (e.render = x), ne != null && (e.inheritAttrs = ne), re && (e.components = re), T && (e.directives = T), te && ss(e);
}
function Hs(e, t, n = zr) {
	N(e) && (e = Xs(e));
	for (let n in e) {
		let r = e[n], i;
		i = F(r) ? "default" in r ? Jo(r.from || n, r.default, !0) : Jo(r.from || n) : Jo(r), /* @__PURE__ */ ro(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Us(e, t, n) {
	Co(N(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Ws(e, t, n, r) {
	let i = r.includes(".") ? ts(n, r) : () => n[r];
	if (Yr(e)) {
		let n = t[e];
		P(n) && Qo(i, n);
	} else if (P(e)) Qo(i, e.bind(n));
	else if (F(e)) if (N(e)) e.forEach((e) => Ws(e, t, n, r));
	else {
		let r = P(e.handler) ? e.handler.bind(n) : t[e.handler];
		P(r) && Qo(i, r, e);
	}
}
function Gs(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Ks(c, e, o, !0)), Ks(c, t, o)), F(t) && a.set(t, c), c;
}
function Ks(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Ks(e, a, n, !0), i && i.forEach((t) => Ks(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = qs[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var qs = {
	data: Js,
	props: $s,
	emits: $s,
	methods: Qs,
	computed: Qs,
	beforeCreate: Zs,
	created: Zs,
	beforeMount: Zs,
	mounted: Zs,
	beforeUpdate: Zs,
	updated: Zs,
	beforeDestroy: Zs,
	beforeUnmount: Zs,
	destroyed: Zs,
	unmounted: Zs,
	activated: Zs,
	deactivated: Zs,
	errorCaptured: Zs,
	serverPrefetch: Zs,
	components: Qs,
	directives: Qs,
	watch: ec,
	provide: Js,
	inject: Ys
};
function Js(e, t) {
	return t ? e ? function() {
		return Ur(P(e) ? e.call(this, this) : e, P(t) ? t.call(this, this) : t);
	} : t : e;
}
function Ys(e, t) {
	return Qs(Xs(e), Xs(t));
}
function Xs(e) {
	if (N(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Zs(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Qs(e, t) {
	return e ? Ur(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function $s(e, t) {
	return e ? N(e) && N(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Ur(/* @__PURE__ */ Object.create(null), zs(e), zs(t ?? {})) : t;
}
function ec(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = Ur(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Zs(e[r], t[r]);
	return n;
}
function tc() {
	return {
		app: null,
		config: {
			isNativeTag: Br,
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
var nc = 0;
function rc(e, t) {
	return function(n, r = null) {
		P(n) || (n = Ur({}, n)), r != null && !F(r) && (r = null);
		let i = tc(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: nc++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Ll,
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
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Fl(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (Co(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = ic;
				ic = c;
				try {
					return e();
				} finally {
					ic = t;
				}
			}
		};
		return c;
	};
}
var ic = null, ac = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${oi(t)}Modifiers`] || e[`${ci(t)}Modifiers`];
function oc(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || j, i = n, a = t.startsWith("update:"), o = a && ac(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => Yr(e) ? e.trim() : e)), o.number && (i = n.map(hi)));
	let s, c = r[s = di(t)] || r[s = di(oi(t))];
	!c && a && (c = r[s = di(ci(t))]), c && Co(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, Co(l, e, 6, i);
	}
}
var sc = /* @__PURE__ */ new WeakMap();
function cc(e, t, n = !1) {
	let r = n ? sc : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!P(e)) {
		let r = (e) => {
			let n = cc(e, t, !0);
			n && (s = !0, Ur(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (F(e) && r.set(e, null), null) : (N(a) ? a.forEach((e) => o[e] = null) : Ur(o, a), F(e) && r.set(e, o), o);
}
function lc(e, t) {
	return !e || !Vr(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), M(e, t[0].toLowerCase() + t.slice(1)) || M(e, ci(t)) || M(e, t));
}
function uc(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = Wo(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = dl(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = dl(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : dc(s);
		}
	} catch (t) {
		Zc.length = 0, wo(t, e, 1), _ = X(Yc);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(Hr) && (v = fc(v, a)), y = ll(y, v, !1, !0));
	}
	return n.dirs && (y = ll(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && as(y, n.transition), _ = y, Wo(g), _;
}
var dc = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || Vr(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, fc = (e, t) => {
	let n = {};
	for (let r in e) (!Hr(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function pc(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? mc(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (hc(o, r, n) && !lc(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? o ? mc(r, o, l) : !0 : !!o;
	return !1;
}
function mc(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (hc(t, e, a) && !lc(n, a)) return !0;
	}
	return !1;
}
function hc(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && F(r) && F(i) ? !Di(r, i) : r !== i;
}
function gc({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var _c = {}, vc = () => Object.create(_c), yc = (e) => Object.getPrototypeOf(e) === _c;
function bc(e, t, n, r = !1) {
	let i = {}, a = vc();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Sc(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ qa(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function xc(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ z(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (lc(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) if (M(a, o)) u !== a[o] && (a[o] = u, l = !0);
				else {
					let t = oi(o);
					i[t] = Cc(c, s, t, u, e, !1);
				}
				else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Sc(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !M(t, a) && ((r = ci(a)) === a || !M(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Cc(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !M(t, e)) && (delete a[e], l = !0);
	}
	l && da(e.attrs, "set", "");
}
function Sc(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (ri(c)) continue;
		let l = t[c], u;
		i && M(i, u = oi(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : lc(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ z(n), r = s || j;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Cc(i, t, s, r[s], e, !M(r, s));
		}
	}
	return o;
}
function Cc(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = M(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && P(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Cl(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === ci(n)) && (r = !0));
	}
	return r;
}
var wc = /* @__PURE__ */ new WeakMap();
function Tc(e, t, n = !1) {
	let r = n ? wc : t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [], c = !1;
	if (!P(e)) {
		let r = (e) => {
			c = !0;
			let [n, r] = Tc(e, t, !0);
			Ur(o, n), r && s.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!a && !c) return F(e) && r.set(e, Rr), Rr;
	if (N(a)) for (let e = 0; e < a.length; e++) {
		let t = oi(a[e]);
		Ec(t) && (o[t] = j);
	}
	else if (a) for (let e in a) {
		let t = oi(e);
		if (Ec(t)) {
			let n = a[e], r = o[t] = N(n) || P(n) ? { type: n } : Ur({}, n), i = r.type, c = !1, l = !0;
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
function Ec(e) {
	return e[0] !== "$" && !ri(e);
}
var Dc = (e) => e === "_" || e === "_ctx" || e === "$stable", Oc = (e) => N(e) ? e.map(dl) : [dl(e)], kc = (e, t, n) => {
	if (t._n) return t;
	let r = H((...e) => Oc(t(...e)), n);
	return r._c = !1, r;
}, Ac = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Dc(n)) continue;
		let i = e[n];
		if (P(i)) t[n] = kc(n, i, r);
		else if (i != null) {
			let e = Oc(i);
			t[n] = () => e;
		}
	}
}, jc = (e, t) => {
	let n = Oc(t);
	e.slots.default = () => n;
}, Mc = (e, t, n) => {
	for (let r in t) (n || !Dc(r)) && (e[r] = t[r]);
}, Nc = (e, t, n) => {
	let r = e.slots = vc();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Mc(r, t, n), n && mi(r, "_", e, !0)) : Ac(t, r);
	} else t && jc(e, t);
}, Pc = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = j;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Mc(i, t, n) : (a = !t.$stable, Ac(t, i)), o = t;
	} else t && (jc(e, t), o = { default: 1 });
	if (a) for (let e in i) !Dc(e) && o[e] == null && delete i[e];
}, Fc = qc;
function Ic(e) {
	return Lc(e);
}
function Lc(e, t) {
	let n = _i();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = zr, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !il(e, t) && (r = fe(e), ce(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Jc:
				g(e, t, n, r);
				break;
			case Yc:
				_(e, t, n, r);
				break;
			case Xc:
				e ?? v(t, n, r, o);
				break;
			case G:
				re(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? x(e, t, n, r, i, a, o, s, c) : d & 6 ? T(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, he);
		}
		u != null && i ? us(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && us(e.ref, null, a, e, !0);
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
				n && n._beginPatch(), te(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, S = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && C(e.children, f, null, i, s, Rc(e, c), l, d), _ && Ko(e, null, i, "created"), ee(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !ri(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && hl(p, i, e);
		}
		_ && Ko(e, null, i, "beforeMount");
		let v = Bc(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Fc(() => {
			try {
				p && hl(p, i, e), v && g.enter(f), _ && Ko(e, null, i, "mounted");
			} finally {}
		}, s);
	}, ee = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Kc(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ee(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, C = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) h(null, e[l] = s ? fl(e[l]) : dl(e[l]), t, n, r, i, a, o, s);
	}, te = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || j, m = t.props || j, h;
		if (n && zc(n, !1), (h = m.onVnodeBeforeUpdate) && hl(h, n, t, e), f && Ko(t, e, n, "beforeUpdate"), n && zc(n, !0), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? w(e.dynamicChildren, d, c, n, r, Rc(t, i), o) : s || O(e, t, c, null, n, r, Rc(t, i), o, !1), l > 0) {
			if (l & 16) ne(c, p, m, n, i);
			else if (l & 2 && p.class !== m.class && a(c, "class", null, m.class, i), l & 4 && a(c, "style", p.style, m.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = p[r], s = m[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && ne(c, p, m, n, i);
		((h = m.onVnodeUpdated) || f) && Fc(() => {
			h && hl(h, n, t, e), f && Ko(t, e, n, "updated");
		}, r);
	}, w = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s];
			h(c, l, c.el && (c.type === G || !il(c, l) || c.shapeFlag & 198) ? d(c.el) : n, null, r, i, a, o, !0);
		}
	}, ne = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== j) for (let o in t) !ri(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (ri(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, re = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), C(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (w(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Vc(e, t, !0)) : O(e, t, n, f, a, o, c, l, u);
	}, T = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ie(t, n, r, i, a, o, c) : E(e, t, c);
	}, ie = (e, t, n, r, i, a, o) => {
		let s = e.component = vl(e, r, i);
		if (ps(e) && (s.ctx.renderer = he), Dl(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ae, o), !e.el) {
				let r = s.subTree = X(Yc);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else ae(s, e, t, n, i, a, o);
	}, E = (e, t, n) => {
		let r = t.component = e.component;
		if (pc(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			D(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, ae = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Uc(e);
					if (n) {
						t && (t.el = c.el, D(e, t, o)), n.asyncDep.then(() => {
							Fc(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				zc(e, !1), t ? (t.el = c.el, D(e, t, o)) : t = c, n && pi(n), (f = t.props && t.props.onVnodeBeforeUpdate) && hl(f, s, t, c), zc(e, !0);
				let p = uc(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), fe(m), e, i, a), t.el = p.el, u === null && gc(e, p.el), r && Fc(r, i), (f = t.props && t.props.onVnodeUpdated) && Fc(() => hl(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = fs(t);
				if (zc(e, !1), l && pi(l), !m && (o = c && c.onVnodeBeforeMount) && hl(o, d, t), zc(e, !0), s && _e) {
					let t = () => {
						e.subTree = uc(e), _e(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = uc(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Fc(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Fc(() => hl(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && fs(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Fc(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ri(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Fo(u), zc(e, !0), l();
	}, D = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, xc(e, t.props, r, n), Pc(e, t.children, n), $i(), Ro(e), ea();
	}, O = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				oe(l, f, n, r, i, a, o, s, c);
				return;
			} else if (p & 256) {
				k(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && de(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? oe(l, f, n, r, i, a, o, s, c) : de(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && C(f, n, r, i, a, o, s, c));
	}, k = (e, t, n, r, i, a, o, s, c) => {
		e ||= Rr, t ||= Rr;
		let l = e.length, u = t.length, d = Math.min(l, u), f;
		for (f = 0; f < d; f++) {
			let r = t[f] = c ? fl(t[f]) : dl(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? de(e, i, a, !0, !1, d) : C(t, n, r, i, a, o, s, c, d);
	}, oe = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? fl(t[l]) : dl(t[l]);
			if (il(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? fl(t[f]) : dl(t[f]);
			if (il(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? fl(t[l]) : dl(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) ce(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? fl(t[l]) : dl(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, v = 0, y = f - m + 1, b = !1, x = 0, S = Array(y);
			for (l = 0; l < y; l++) S[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (v >= y) {
					ce(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (S[_ - m] === 0 && il(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? ce(r, i, a, !0) : (S[u - m] = l + 1, u >= x ? x = u : b = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let ee = b ? Hc(S) : Rr;
			for (_ = ee.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || Gc(f) : r;
				S[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : b && (_ < 0 || l !== ee[_] ? se(d, n, p, 2) : _--);
			}
		}
	}, se = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			se(e.component.subTree, t, n, a);
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
			for (let e = 0; e < u.length; e++) se(u[e], t, n, a);
			r(e.anchor, t, n);
			return;
		}
		if (c === Xc) {
			y(e, t, n);
			return;
		}
		if (a !== 2 && d & 1 && l) if (a === 0) l.persisted && !s[is] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Fc(() => l.enter(s), o));
		else {
			let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? i(s) : r(s, t, n);
			}, d = () => {
				let e = s._isLeaving || !!s[is];
				s._isLeaving && s[is](!0), l.persisted && !e ? u() : a(s, () => {
					u(), c && c();
				});
			};
			o ? o(s, u, d) : d();
		}
		else r(s, t, n);
	}, ce = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && ($i(), us(s, null, n, e, !0), ea()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !fs(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && hl(_, t, e), u & 6) ue(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Ko(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, he, r) : l && !l.hasOnce && (a !== G || d > 0 && d & 64) ? de(l, t, n, !1, !0) : (a === G && d & 384 || !i && u & 16) && de(c, t, n), r && A(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Fc(() => {
			_ && hl(_, t, e), h && Ko(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, A = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e;
		if (t === G) {
			le(n, r);
			return;
		}
		if (t === Xc) {
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
		Wc(c), Wc(l), r && pi(r), i.stop(), a && (a.flags |= 8, ce(o, e, t, n)), s && Fc(s, t), Fc(() => {
			e.isUnmounted = !0;
		}, t);
	}, de = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) ce(e[o], t, n, r, i);
	}, fe = (e) => {
		if (e.shapeFlag & 6) return fe(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[ns];
		return n ? f(n) : t;
	}, pe = !1, me = (e, t, n) => {
		let r;
		e == null ? t._vnode && (ce(t._vnode, null, null, !0), r = t._vnode.component) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e, pe ||= (pe = !0, Ro(r), zo(), !1);
	}, he = {
		p: h,
		um: ce,
		m: se,
		r: A,
		mt: ie,
		mc: C,
		pc: O,
		pbc: w,
		n: fe,
		o: e
	}, ge, _e;
	return t && ([ge, _e] = t(he)), {
		render: me,
		hydrate: ge,
		createApp: rc(me, ge)
	};
}
function Rc({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function zc({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Bc(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Vc(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (N(r) && N(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = fl(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Vc(t, a)), a.type === Jc && (a.patchFlag === -1 && (a = i[e] = fl(a)), a.el = t.el), a.type === Yc && !a.el && (a.el = t.el);
	}
}
function Hc(e) {
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
function Uc(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Uc(t);
}
function Wc(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Gc(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Gc(t.subTree) : null;
}
var Kc = (e) => e.__isSuspense;
function qc(e, t) {
	t && t.pendingBranch ? N(e) ? t.effects.push(...e) : t.effects.push(e) : Lo(e);
}
var G = /* @__PURE__ */ Symbol.for("v-fgt"), Jc = /* @__PURE__ */ Symbol.for("v-txt"), Yc = /* @__PURE__ */ Symbol.for("v-cmt"), Xc = /* @__PURE__ */ Symbol.for("v-stc"), Zc = [], Qc = null;
function K(e = !1) {
	Zc.push(Qc = e ? null : []);
}
function $c() {
	Zc.pop(), Qc = Zc[Zc.length - 1] || null;
}
var el = 1;
function tl(e, t = !1) {
	el += e, e < 0 && Qc && t && (Qc.hasOnce = !0);
}
function nl(e) {
	return e.dynamicChildren = el > 0 ? Qc || Rr : null, $c(), el > 0 && Qc && Qc.push(e), e;
}
function q(e, t, n, r, i, a) {
	return nl(Y(e, t, n, r, i, a, !0));
}
function J(e, t, n, r, i) {
	return nl(X(e, t, n, r, i, !0));
}
function rl(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function il(e, t) {
	return e.type === t.type && e.key === t.key;
}
var al = ({ key: e }) => e ?? null, ol = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : Yr(e) || /* @__PURE__ */ ro(e) || P(e) ? {
	i: Ho,
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
		key: t && al(t),
		ref: t && ol(t),
		scopeId: Uo,
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
		ctx: Ho
	};
	return s ? (pl(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= Yr(n) ? 8 : 16), el > 0 && !o && Qc && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Qc.push(c), c;
}
var X = sl;
function sl(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === As) && (e = Yc), rl(e)) {
		let r = ll(e, t, !0);
		return n && pl(r, n), el > 0 && !a && Qc && (r.shapeFlag & 6 ? Qc[Qc.indexOf(e)] = r : Qc.push(r)), r.patchFlag = -2, r;
	}
	if (Il(e) && (e = e.__vccOpts), t) {
		t = cl(t);
		let { class: e, style: n } = t;
		e && !Yr(e) && (t.class = I(e)), F(n) && (/* @__PURE__ */ $a(n) && !N(n) && (n = Ur({}, n)), t.style = vi(n));
	}
	let o = Yr(e) ? 1 : Kc(e) ? 128 : rs(e) ? 64 : F(e) ? 4 : P(e) ? 2 : 0;
	return Y(e, t, n, r, i, o, a, !0);
}
function cl(e) {
	return e ? /* @__PURE__ */ $a(e) || yc(e) ? Ur({}, e) : e : null;
}
function ll(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ml(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && al(l),
		ref: t && t.ref ? n && a ? N(a) ? a.concat(ol(t)) : [a, ol(t)] : ol(t) : a,
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
		ssContent: e.ssContent && ll(e.ssContent),
		ssFallback: e.ssFallback && ll(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && as(u, c.clone(u)), u;
}
function Z(e = " ", t = 0) {
	return X(Jc, null, e, t);
}
function ul(e, t) {
	let n = X(Xc, null, e);
	return n.staticCount = t, n;
}
function Q(e = "", t = !1) {
	return t ? (K(), J(Yc, null, e)) : X(Yc, null, e);
}
function dl(e) {
	return e == null || typeof e == "boolean" ? X(Yc) : N(e) ? X(G, null, e.slice()) : rl(e) ? fl(e) : X(Jc, null, String(e));
}
function fl(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : ll(e);
}
function pl(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (N(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), pl(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !yc(t) ? t._ctx = Ho : r === 3 && Ho && (Ho.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else P(t) ? (t = {
		default: t,
		_ctx: Ho
	}, n = 32) : (t = String(t), r & 64 ? (n = 16, t = [Z(t)]) : n = 8);
	e.children = t, e.shapeFlag |= n;
}
function ml(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = I([t.class, r.class]));
		else if (e === "style") t.style = vi([t.style, r.style]);
		else if (Vr(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(N(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !Hr(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function hl(e, t, n, r = null) {
	Co(e, t, 7, [n, r]);
}
var gl = tc(), _l = 0;
function vl(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || gl, a = {
		uid: _l++,
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
		scope: new Ni(!0),
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
		propsOptions: Tc(r, i),
		emitsOptions: cc(r, i),
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = oc.bind(null, a), e.ce && e.ce(a), a;
}
var yl = null, bl = () => yl || Ho, xl, Sl;
{
	let e = _i(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	xl = t("__VUE_INSTANCE_SETTERS__", (e) => yl = e), Sl = t("__VUE_SSR_SETTERS__", (e) => El = e);
}
var Cl = (e) => {
	let t = yl;
	return xl(e), e.scope.on(), () => {
		e.scope.off(), xl(t);
	};
}, wl = () => {
	yl && yl.scope.off(), xl(null);
};
function Tl(e) {
	return e.vnode.shapeFlag & 4;
}
var El = !1;
function Dl(e, t = !1, n = !1) {
	t && Sl(t);
	let { props: r, children: i } = e.vnode, a = Tl(e);
	bc(e, r, a, t), Nc(e, i, n || t);
	let o = a ? Ol(e, t) : void 0;
	return t && Sl(!1), o;
}
function Ol(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Is);
	let { setup: r } = n;
	if (r) {
		$i();
		let n = e.setupContext = r.length > 1 ? Pl(e) : null, i = Cl(e), a = So(r, e, 0, [e.props, n]), o = Zr(a);
		if (ea(), i(), (o || e.sp) && !fs(e) && ss(e), o) {
			if (a.then(wl, wl), t) return a.then((n) => {
				kl(e, n, t);
			}).catch((t) => {
				wo(t, e, 0);
			});
			e.asyncDep = a;
		} else kl(e, a, t);
	} else Ml(e, t);
}
function kl(e, t, n) {
	P(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : F(t) && (e.setupState = so(t)), Ml(e, n);
}
var Al, jl;
function Ml(e, t, n) {
	let r = e.type;
	if (!e.render) {
		if (!t && Al && !r.render) {
			let t = r.template || Gs(e).template;
			if (t) {
				let { isCustomElement: n, compilerOptions: i } = e.appContext.config, { delimiters: a, compilerOptions: o } = r;
				r.render = Al(t, Ur(Ur({
					isCustomElement: n,
					delimiters: a
				}, i), o));
			}
		}
		e.render = r.render || zr, jl && jl(e);
	}
	{
		let t = Cl(e);
		$i();
		try {
			Vs(e);
		} finally {
			ea(), t();
		}
	}
}
var Nl = { get(e, t) {
	return ua(e, "get", ""), e[t];
} };
function Pl(e) {
	return {
		attrs: new Proxy(e.attrs, Nl),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Fl(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(so(eo(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Ps) return Ps[n](e);
		},
		has(e, t) {
			return t in e || t in Ps;
		}
	}) : e.proxy;
}
function Il(e) {
	return P(e) && "__vccOpts" in e;
}
var $ = (e, t) => /* @__PURE__ */ ho(e, t, El), Ll = "3.5.38", Rl = void 0, zl = typeof window < "u" && window.trustedTypes;
if (zl) try {
	Rl = /* @__PURE__ */ zl.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Bl = Rl ? (e) => Rl.createHTML(e) : (e) => e, Vl = "http://www.w3.org/2000/svg", Hl = "http://www.w3.org/1998/Math/MathML", Ul = typeof document < "u" ? document : null, Wl = Ul && /* @__PURE__ */ Ul.createElement("template"), Gl = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Ul.createElementNS(Vl, e) : t === "mathml" ? Ul.createElementNS(Hl, e) : n ? Ul.createElement(e, { is: n }) : Ul.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Ul.createTextNode(e),
	createComment: (e) => Ul.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Ul.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
		else {
			Wl.innerHTML = Bl(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Wl.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Kl = /* @__PURE__ */ Symbol("_vtc");
function ql(e, t, n) {
	let r = e[Kl];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Jl = /* @__PURE__ */ Symbol("_vod"), Yl = /* @__PURE__ */ Symbol("_vsh"), Xl = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[Jl] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Zl(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Zl(e, !0), r.enter(e)) : r.leave(e, () => {
			Zl(e, !1);
		}) : Zl(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Zl(e, t);
	}
};
function Zl(e, t) {
	e.style.display = t ? e[Jl] : "none", e[Yl] = !t;
}
var Ql = /* @__PURE__ */ Symbol(""), $l = /(?:^|;)\s*display\s*:/;
function eu(e, t, n) {
	let r = e.style, i = Yr(n), a = !1;
	if (n && !i) {
		if (t) if (Yr(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? nu(r, t, "");
		}
		else for (let e in t) n[e] ?? nu(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? nu(r, i, "") : ou(e, i, !Yr(t) && t ? t[i] : void 0, o) || nu(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Ql];
			e && (n += ";" + e), r.cssText = n, a = $l.test(n);
		}
	} else t && e.removeAttribute("style");
	Jl in e && (e[Jl] = a ? r.display : "", e[Yl] && (r.display = "none"));
}
var tu = /\s*!important$/;
function nu(e, t, n) {
	if (N(n)) n.forEach((n) => nu(e, t, n));
	else if (n ??= "", t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = au(e, t);
		tu.test(n) ? e.setProperty(ci(r), n.replace(tu, ""), "important") : e[r] = n;
	}
}
var ru = [
	"Webkit",
	"Moz",
	"ms"
], iu = {};
function au(e, t) {
	let n = iu[t];
	if (n) return n;
	let r = oi(t);
	if (r !== "filter" && r in e) return iu[t] = r;
	r = li(r);
	for (let n = 0; n < ru.length; n++) {
		let i = ru[n] + r;
		if (i in e) return iu[t] = i;
	}
	return t;
}
function ou(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && Yr(r) && n === r;
}
var su = "http://www.w3.org/1999/xlink";
function cu(e, t, n, r, i, a = wi(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(su, t.slice(6, t.length)) : e.setAttributeNS(su, t, n) : n == null || a && !Ti(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : Xr(n) ? String(n) : n);
}
function lu(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Bl(n) : n);
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
		r === "boolean" ? n = Ti(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function uu(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function du(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var fu = /* @__PURE__ */ Symbol("_vei");
function pu(e, t, n, r, i = null) {
	let a = e[fu] || (e[fu] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = hu(t);
		r ? uu(e, n, a[t] = yu(r, i), s) : o && (du(e, n, o, s), a[t] = void 0);
	}
}
var mu = /(?:Once|Passive|Capture)$/;
function hu(e) {
	let t;
	if (mu.test(e)) {
		t = {};
		let n;
		for (; n = e.match(mu);) e = e.slice(0, e.length - n[0].length), t[n[0].toLowerCase()] = !0;
	}
	return [e[2] === ":" ? e.slice(3) : ci(e.slice(2)), t];
}
var gu = 0, _u = /* @__PURE__ */ Promise.resolve(), vu = () => gu ||= (_u.then(() => gu = 0), Date.now());
function yu(e, t) {
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
				e && Co(e, t, 5, a);
			}
		} else Co(r, t, 5, [e]);
	};
	return n.value = e, n.attached = vu(), n;
}
var bu = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, xu = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? ql(e, r, o) : t === "style" ? eu(e, n, r) : Vr(t) ? Hr(t) || pu(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Su(e, t, r, o)) ? (lu(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && cu(e, t, r, o, a, t !== "value")) : e._isVueCE && (Cu(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !Yr(r))) ? lu(e, oi(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), cu(e, t, r, o));
};
function Su(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && bu(t) && P(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return bu(t) && Yr(n) ? !1 : t in e;
}
function Cu(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = oi(t);
	return Array.isArray(n) ? n.some((e) => oi(e) === r) : Object.keys(n).some((e) => oi(e) === r);
}
var wu = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return N(t) ? (e) => pi(t, e) : t;
};
function Tu(e) {
	e.target.composing = !0;
}
function Eu(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Du = /* @__PURE__ */ Symbol("_assign");
function Ou(e, t, n) {
	return t && (e = e.trim()), n && (e = hi(e)), e;
}
var ku = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e[Du] = wu(i);
		let a = r || i.props && i.props.type === "number";
		uu(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Du](Ou(e.value, n, a));
		}), (n || a) && uu(e, "change", () => {
			e.value = Ou(e.value, n, a);
		}), t || (uu(e, "compositionstart", Tu), uu(e, "compositionend", Eu), uu(e, "change", Eu));
	},
	mounted(e, { value: t }) {
		e.value = t ?? "";
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Du] = wu(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? hi(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Au = {
	deep: !0,
	created(e, t, n) {
		e[Du] = wu(n), uu(e, "change", () => {
			let t = e._modelValue, n = Pu(e), r = e.checked, i = e[Du];
			if (N(t)) {
				let e = Oi(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (qr(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(Fu(e, r));
		});
	},
	mounted: ju,
	beforeUpdate(e, t, n) {
		e[Du] = wu(n), ju(e, t, n);
	}
};
function ju(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (N(t)) i = Oi(t, r.props.value) > -1;
	else if (qr(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Di(t, Fu(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Mu = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		let i = qr(t);
		uu(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? hi(Pu(e)) : Pu(e));
			e[Du](e.multiple ? i ? new Set(t) : t : t[0]), e._assigning = !0, No(() => {
				e._assigning = !1;
			});
		}), e[Du] = wu(r);
	},
	mounted(e, { value: t }) {
		Nu(e, t);
	},
	beforeUpdate(e, t, n) {
		e[Du] = wu(n);
	},
	updated(e, { value: t }) {
		e._assigning || Nu(e, t);
	}
};
function Nu(e, t) {
	let n = e.multiple, r = N(t);
	if (!(n && !r && !qr(t))) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = Pu(a);
			if (n) if (r) {
				let e = typeof o;
				e === "string" || e === "number" ? a.selected = t.some((e) => String(e) === String(o)) : a.selected = Oi(t, o) > -1;
			} else a.selected = t.has(o);
			else if (Di(Pu(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function Pu(e) {
	return "_value" in e ? e._value : e.value;
}
function Fu(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var Iu = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Lu = {
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
	exact: (e, t) => Iu.some((n) => e[`${n}Key`] && !t.includes(n))
}, Ru = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Lu[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, zu = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, Bu = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = ci(n.key);
		if (t.some((e) => e === r || zu[e] === r)) return e(n);
	}));
}, Vu = /* @__PURE__ */ Ur({ patchProp: xu }, Gl), Hu;
function Uu() {
	return Hu ||= Ic(Vu);
}
var Wu = ((...e) => {
	let t = Uu().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Ku(e);
		if (!r) return;
		let i = t._component;
		!P(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Gu(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Gu(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Ku(e) {
	return Yr(e) ? document.querySelector(e) : e;
}
//#endregion
//#region node_modules/pinia/dist/pinia.mjs
var qu = typeof window < "u", Ju, Yu = (e) => Ju = e, Xu = Symbol();
function Zu(e) {
	return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var Qu;
(function(e) {
	e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(Qu ||= {});
var $u = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null };
function ed(e, { autoBom: t = !1 } = {}) {
	return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["﻿", e], { type: e.type }) : e;
}
function td(e, t, n) {
	let r = new XMLHttpRequest();
	r.open("GET", e), r.responseType = "blob", r.onload = function() {
		od(r.response, t, n);
	}, r.onerror = function() {
		console.error("could not download file");
	}, r.send();
}
function nd(e) {
	let t = new XMLHttpRequest();
	t.open("HEAD", e, !1);
	try {
		t.send();
	} catch {}
	return t.status >= 200 && t.status <= 299;
}
function rd(e) {
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
var id = typeof navigator == "object" ? navigator : { userAgent: "" }, ad = /Macintosh/.test(id.userAgent) && /AppleWebKit/.test(id.userAgent) && !/Safari/.test(id.userAgent), od = qu ? typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !ad ? sd : "msSaveOrOpenBlob" in id ? cd : ld : () => {};
function sd(e, t = "download", n) {
	let r = document.createElement("a");
	r.download = t, r.rel = "noopener", typeof e == "string" ? (r.href = e, r.origin === location.origin ? rd(r) : nd(r.href) ? td(e, t, n) : (r.target = "_blank", rd(r))) : (r.href = URL.createObjectURL(e), setTimeout(function() {
		URL.revokeObjectURL(r.href);
	}, 4e4), setTimeout(function() {
		rd(r);
	}, 0));
}
function cd(e, t = "download", n) {
	if (typeof e == "string") if (nd(e)) td(e, t, n);
	else {
		let t = document.createElement("a");
		t.href = e, t.target = "_blank", setTimeout(function() {
			rd(t);
		});
	}
	else navigator.msSaveOrOpenBlob(ed(e, n), t);
}
function ld(e, t, n, r) {
	if (r ||= open("", "_blank"), r && (r.document.title = r.document.body.innerText = "downloading..."), typeof e == "string") return td(e, t, n);
	let i = e.type === "application/octet-stream", a = /constructor/i.test(String($u.HTMLElement)) || "safari" in $u, o = /CriOS\/[\d]+/.test(navigator.userAgent);
	if ((o || i && a || ad) && typeof FileReader < "u") {
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
var { assign: ud } = Object;
function dd() {
	let e = Pi(!0), t = e.run(() => /* @__PURE__ */ B({})), n = [], r = [], i = eo({
		install(e) {
			Yu(i), i._a = e, e.provide(Xu, i), e.config.globalProperties.$pinia = i, r.forEach((e) => n.push(e)), r = [];
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
var fd = () => {};
function pd(e, t, n, r = fd) {
	e.add(t);
	let i = () => {
		e.delete(t) && r();
	};
	return !n && Fi() && Ii(i), i;
}
function md(e, ...t) {
	e.forEach((e) => {
		e(...t);
	});
}
var hd = (e) => e(), gd = Symbol(), _d = Symbol();
function vd(e, t) {
	e instanceof Map && t instanceof Map ? t.forEach((t, n) => e.set(n, t)) : e instanceof Set && t instanceof Set && t.forEach(e.add, e);
	for (let n in t) {
		if (!t.hasOwnProperty(n)) continue;
		let r = t[n], i = e[n];
		Zu(i) && Zu(r) && e.hasOwnProperty(n) && !/* @__PURE__ */ ro(r) && !/* @__PURE__ */ Xa(r) ? e[n] = vd(i, r) : e[n] = r;
	}
	return e;
}
var yd = Symbol();
function bd(e) {
	return !Zu(e) || !Object.prototype.hasOwnProperty.call(e, yd);
}
var { assign: xd } = Object;
function Sd(e) {
	return !!(/* @__PURE__ */ ro(e) && e.effect);
}
function Cd(e, t, n, r) {
	let { state: i, actions: a, getters: o } = t, s = n.state.value[e], c;
	function l() {
		return s || (n.state.value[e] = i ? i() : {}), xd(/* @__PURE__ */ co(n.state.value[e]), a, Object.keys(o || {}).reduce((t, r) => (t[r] = eo($(() => {
			Yu(n);
			let t = n._s.get(e);
			return o[r].call(t, t);
		})), t), {}));
	}
	return c = wd(e, l, t, n, r, !0), c;
}
function wd(e, t, n = {}, r, i, a) {
	let o, s = xd({ actions: {} }, n), c = { deep: !0 }, l, u, d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), p = r.state.value[e];
	!a && !p && (r.state.value[e] = {});
	let m;
	function h(t) {
		let n;
		l = u = !1, typeof t == "function" ? (t(r.state.value[e]), n = {
			type: Qu.patchFunction,
			storeId: e,
			events: void 0
		}) : (vd(r.state.value[e], t), n = {
			type: Qu.patchObject,
			payload: t,
			storeId: e,
			events: void 0
		});
		let i = m = Symbol();
		No().then(() => {
			m === i && (l = !0);
		}), u = !0, md(d, n, r.state.value[e]);
	}
	let g = a ? function() {
		let { state: e } = n, t = e ? e() : {};
		this.$patch((e) => {
			xd(e, t);
		});
	} : fd;
	function _() {
		o.stop(), d.clear(), f.clear(), r._s.delete(e);
	}
	let v = (t, n = "") => {
		if (gd in t) return t[_d] = n, t;
		let i = function() {
			Yu(r);
			let n = Array.from(arguments), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
			function s(e) {
				a.add(e);
			}
			function c(e) {
				o.add(e);
			}
			md(f, {
				args: n,
				name: i[_d],
				store: y,
				after: s,
				onError: c
			});
			let l;
			try {
				l = t.apply(this && this.$id === e ? this : y, n);
			} catch (e) {
				throw md(o, e), e;
			}
			return l instanceof Promise ? l.then((e) => (md(a, e), e)).catch((e) => (md(o, e), Promise.reject(e))) : (md(a, l), l);
		};
		return i[gd] = !0, i[_d] = n, i;
	}, y = /* @__PURE__ */ Ka({
		_p: r,
		$id: e,
		$onAction: pd.bind(null, f),
		$patch: h,
		$reset: g,
		$subscribe(t, n = {}) {
			let i = pd(d, t, n.detached, () => a()), a = o.run(() => Qo(() => r.state.value[e], (r) => {
				(n.flush === "sync" ? u : l) && t({
					storeId: e,
					type: Qu.direct,
					events: void 0
				}, r);
			}, xd({}, c, n)));
			return i;
		},
		$dispose: _
	});
	r._s.set(e, y);
	let b = (r._a && r._a.runWithContext || hd)(() => r._e.run(() => (o = Pi()).run(() => t({ action: v }))));
	for (let t in b) {
		let n = b[t];
		/* @__PURE__ */ ro(n) && !Sd(n) || /* @__PURE__ */ Xa(n) ? a || (p && bd(n) && (/* @__PURE__ */ ro(n) ? n.value = p[t] : vd(n, p[t])), r.state.value[e][t] = n) : typeof n == "function" && (b[t] = v(n, t), s.actions[t] = n);
	}
	return xd(y, b), xd(/* @__PURE__ */ z(y), b), Object.defineProperty(y, "$state", {
		get: () => r.state.value[e],
		set: (e) => {
			h((t) => {
				xd(t, e);
			});
		}
	}), r._p.forEach((e) => {
		xd(y, o.run(() => e({
			store: y,
			app: r._a,
			pinia: r,
			options: s
		})));
	}), p && a && n.hydrate && n.hydrate(y.$state, p), l = !0, u = !0, y;
}
function Td(e, t, n) {
	let r, i = typeof t == "function";
	r = i ? n : t;
	function a(n, a) {
		let o = Yo();
		return n ||= o ? Jo(Xu, null) : null, n && Yu(n), n = Ju, n._s.has(e) || (i ? wd(e, t, r, n) : Cd(e, r, n)), n._s.get(e);
	}
	return a.$id = e, a;
}
function Ed(e) {
	let t = /* @__PURE__ */ z(e), n = {};
	for (let r in t) {
		let i = t[r];
		i.effect ? n[r] = $({
			get: () => e[r],
			set(t) {
				e[r] = t;
			}
		}) : (/* @__PURE__ */ ro(i) || /* @__PURE__ */ Xa(i)) && (n[r] = /* @__PURE__ */ fo(e, r));
	}
	return n;
}
//#endregion
//#region src/functions/npc-builder/create-default-trait-config.ts
function Dd() {
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
function Od(e, t) {
	return `${e}:${Pd(t)}`;
}
function kd(e) {
	let t = e.level ?? 1;
	return Number.isFinite(t) ? Math.max(1, Math.floor(t)) * 5 : 5;
}
function Ad(e) {
	return e.name;
}
function jd(e, t) {
	return e === "characteristic" ? t.allowBaseActorCharacteristics : e === "skill" ? t.allowBaseActorSkills : t.allowBaseActorTalents;
}
function Md(e, t) {
	return {
		...Dd(),
		...e,
		...t
	};
}
function Nd(e, t) {
	return Pd(e) === Pd(t);
}
function Pd(e) {
	return e.trim().toLocaleLowerCase();
}
function Fd(e) {
	return Number.isFinite(e) ? Math.max(1, Math.floor(e)) : 1;
}
function Id(e) {
	let t = 0;
	for (let n of e) t += n.count;
	return t;
}
function Ld(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = Pd(r);
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
//#endregion
//#region src/functions/npc-builder/skill-specialization.ts
function Rd(e, t, n) {
	return `${e}:${Ud(t)}:${n}`;
}
function zd(e, t) {
	let n = e.trim(), r = t.trim();
	return r ? `${n} (${r})` : n;
}
function Bd(e) {
	let t = /^(?<base>.+?)\s*\((?<specialization>[^)]+)\)\s*$/.exec(e.trim());
	if (!t?.groups) return null;
	let n = t.groups.base?.trim() ?? "", r = t.groups.specialization?.trim() ?? "";
	return !n || !r || Vd(e) ? null : {
		baseName: n,
		originalName: e,
		specialization: r
	};
}
function Vd(e) {
	let t = /^(?<base>.+?)\s*\((?<specialization>[^)]+)\)\s*$/.exec(e.trim());
	if (!t?.groups) return null;
	let n = t.groups.base?.trim() ?? "", r = t.groups.specialization?.trim() ?? "", i = Gd(r);
	return !n || !r || !Wd(r, i) ? null : {
		baseName: n,
		options: i,
		originalName: e,
		specialization: r
	};
}
function Hd(e, t) {
	let n = /* @__PURE__ */ new Map();
	return t.map((t) => {
		let r = Ud(t), i = n.get(r) ?? 0;
		return n.set(r, i + 1), {
			occurrence: i,
			originalName: t,
			resolutionKey: Rd(e, t, i)
		};
	});
}
function Ud(e) {
	return e.trim().replaceAll(/\s+/g, " ").toLocaleLowerCase();
}
function Wd(e, t) {
	return e.trim().toLocaleLowerCase() === "any" || t.length > 1;
}
function Gd(e) {
	return e.split(/\s+or\s+/i).map((e) => e.trim()).filter(Boolean);
}
//#endregion
//#region src/functions/npc-builder/advancements/source-counts.ts
function Kd(e, t) {
	return t <= 0 ? [] : [{
		count: t,
		kind: "career",
		label: `${e} extra time`
	}];
}
function qd(e, t) {
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
function Jd(e, t, n, r) {
	let i = Xd(Yd(e, r), n);
	return i.value === null ? t : Math.min(t, Math.max(0, i.value - e.baseAdvances));
}
function Yd(e, t) {
	let n = t[Pd(e.name)];
	return {
		maximumFormula: e.talentMaximumFormula ?? n?.maximumFormula ?? "",
		maximumKey: e.talentMaximumKey ?? n?.maximumKey ?? ""
	};
}
function Xd(e, t) {
	let n = e.maximumKey.trim().toLocaleLowerCase();
	if (!n) return {
		label: "Unknown",
		value: null
	};
	if (n === "none") return {
		label: "-",
		value: null
	};
	if (n === "custom") return Zd(e.maximumFormula, t);
	let r = Number(n);
	if (Number.isFinite(r)) {
		let e = Math.max(0, Math.floor(r));
		return {
			label: `${e}`,
			value: e
		};
	}
	if (f(n)) {
		let e = t[n] ?? 0, r = Math.max(0, Math.floor(e / 10));
		return {
			label: `${u[n]} Bonus (${r})`,
			value: r
		};
	}
	return {
		label: e.maximumKey || "Unknown",
		value: null
	};
}
function Zd(e, t) {
	let n = e.trim(), r = Number(n);
	if (Number.isFinite(r)) {
		let e = Math.max(0, Math.floor(r));
		return {
			label: `${e}`,
			value: e
		};
	}
	let i = /@characteristics\.([a-z]+)\.bonus/i.exec(n)?.[1]?.toLocaleLowerCase();
	if (i && f(i)) {
		let e = t[i] ?? 0, n = Math.max(0, Math.floor(e / 10));
		return {
			label: `${u[i]} Bonus (${n})`,
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
function Qd(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e.careers) {
		let i = Ld(tf(r, t, e.skillGrantResolutions)), a = kd(r) / 5, o = Math.max(0, Fd(r.quantity) - 1) * 5;
		for (let e of i) {
			let i = Od(t, e), s = n.get(i);
			if (s) {
				a > s.highestLevel && (s.highestLevel = a, s.highestLevelSource = Ad(r)), o > 0 && s.extraSources.push({
					count: o,
					kind: "career",
					label: `${r.name} extra time`
				});
				continue;
			}
			n.set(i, {
				extraSources: Kd(r.name, o),
				highestLevel: a,
				highestLevelSource: Ad(r),
				name: e
			});
		}
	}
	for (let r of n.values()) ef(e, {
		careerValue: r.highestLevel * 5 + Id(r.extraSources),
		kind: t,
		name: r.name,
		sources: [{
			count: r.highestLevel * 5,
			kind: "career",
			label: r.highestLevelSource
		}, ...r.extraSources]
	});
}
function $d(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.careers) {
		let r = Ld(tf(n, "talent", e.skillGrantResolutions)), i = Math.max(0, Fd(n.quantity) - 1);
		for (let e of r) {
			let r = Od("talent", e), a = t.get(r);
			if (a) {
				i > 0 && a.extraSources.push({
					count: i,
					kind: "career",
					label: `${n.name} extra time`
				});
				continue;
			}
			t.set(r, {
				extraSources: Kd(n.name, i),
				firstSource: n.name,
				name: e
			});
		}
	}
	for (let n of t.values()) ef(e, {
		careerValue: 1 + Id(n.extraSources),
		kind: "talent",
		name: n.name,
		sources: [{
			count: 1,
			kind: "career",
			label: n.firstSource
		}, ...n.extraSources]
	}, e.characteristicTotals);
}
function ef(e, t, n = {}) {
	let r = Od(t.kind, t.name), i = e.entries.get(r);
	if (i) {
		let r = t.kind === "talent" && i.includedFromBase ? t.sources.slice(1) : t.sources, a = t.kind === "talent" ? Jd(i, Id(r), n, e.talentMaximums) : t.careerValue;
		i.careerValue = a, i.includedFromCareer = !0, i.sources = [...i.sources.filter((e) => e.kind === "base"), ...qd(r, a)];
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
	t.kind === "talent" && (a.careerValue = Jd(a, t.careerValue, n, e.talentMaximums), a.current = a.careerValue, a.sources = qd(t.sources, a.careerValue)), e.entries.set(r, { ...a });
}
function tf(e, t, n) {
	return t === "characteristic" ? e.grants.characteristics : t === "skill" ? Hd(e.uuid, e.grants.skills).map((e) => n[e.resolutionKey] || e.originalName) : e.grants.talents;
}
//#endregion
//#region src/functions/npc-builder/advancements/entry-context.ts
function nf(e, t) {
	let n = {};
	for (let r of e.values()) {
		if (r.kind !== "characteristic") continue;
		let e = d[Pd(r.name)];
		if (!e) continue;
		let i = t[Od(r.kind, r.name)] ?? 0, a = Math.max(r.minimumCurrent, Math.floor(r.careerValue + i));
		n[e] = Math.max(0, r.baseValue + a);
	}
	return n;
}
function rf(e, t, n) {
	return e.kind === "skill" ? af(e, t, n) : e.kind === "talent" ? of(e, t, n) : e;
}
function af(e, t, n) {
	let r = sf(e) ?? cf(e.name, n.skillCharacteristics) ?? lf(e.name, n.baseActorDraftData);
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
function of(e, t, n) {
	let r = Yd(e, n.talentMaximums), i = Xd(r, t);
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
function sf(e) {
	return !e.characteristicKey || !e.characteristicName ? null : {
		characteristicKey: e.characteristicKey,
		characteristicName: e.characteristicName,
		skillName: e.name
	};
}
function cf(e, t) {
	return t[Pd(e)] ?? null;
}
function lf(e, t) {
	let n = t.advancements.find((t) => t.kind === "skill" && Nd(t.name, e));
	return n?.characteristicKey ? {
		characteristicKey: n.characteristicKey,
		characteristicName: n.characteristicName ?? u[n.characteristicKey],
		skillName: e
	} : null;
}
//#endregion
//#region src/functions/npc-builder/advancements/derive-advancements.ts
function uf(e) {
	let t = hf(e.baseActorDraftData), n = {
		careers: e.careers,
		entries: t,
		skillGrantResolutions: e.skillGrantResolutions,
		talentMaximums: e.talentMaximums
	};
	Qd(n, "characteristic"), Qd(n, "skill");
	let r = nf(t, e.manualAdvancementDeltas);
	return $d({
		...n,
		characteristicTotals: r
	}), gf(t, e.customAdvancements), [...t.values()].filter((t) => t.includedFromCareer || t.includedFromCustom || jd(t.kind, e.settings)).map((t) => {
		let n = rf(t, r, e), i = Od(t.kind, t.name), a = e.manualAdvancementDeltas[i] ?? 0, o = n.careerValue + a;
		return {
			...n,
			current: Math.max(n.minimumCurrent, Math.floor(o))
		};
	}).sort(_f);
}
function df(e, t) {
	let n = Number.isFinite(t) ? t : 0;
	return Math.max(e.minimumCurrent, Math.floor(n)) - e.careerValue;
}
function ff(e, t) {
	let n = Number.isFinite(t) ? t : 0;
	return df(e, Math.max(e.minimumTotal, Math.floor(n)) - e.baseValue);
}
function pf(e, t) {
	return {
		...e,
		...Object.fromEntries(t.map((e) => [Pd(e.skillName), e]))
	};
}
function mf(e, t) {
	return {
		...e,
		...Object.fromEntries(t.map((e) => [Pd(e.talentName), e]))
	};
}
function hf(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.advancements) {
		let e = Od(n.kind, n.name), r = {
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
		n.baseModifier !== void 0 && (r.baseModifier = n.baseModifier), n.characteristicKey && (r.characteristicKey = n.characteristicKey, r.characteristicName = n.characteristicName ?? u[n.characteristicKey]), n.kind === "talent" && n.baseAdvances > 0 && r.sources.push({
			count: n.baseAdvances,
			kind: "base",
			label: "Base"
		}), n.talentMaximumFormula && (r.talentMaximumFormula = n.talentMaximumFormula), n.talentMaximumKey && (r.talentMaximumKey = n.talentMaximumKey), t.set(e, r);
	}
	return t;
}
function gf(e, t) {
	for (let n of t) {
		let t = Od(n.kind, n.name), r = {
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
function _f(e, t) {
	return e.kind === t.kind ? e.name.localeCompare(t.name) : e.kind.localeCompare(t.kind);
}
//#endregion
//#region src/functions/npc-builder/advancements/advancement-actions.ts
function vf(e) {
	return e.kind === "talent" ? 1 : 5;
}
function yf(e) {
	return Math.max(e.minimumTotal, e.baseValue + e.current);
}
function bf(e, t) {
	return yf(e) + t * vf(e);
}
function xf(e) {
	return yf(e);
}
function Sf(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" && xf(e) < t;
}
function Cf(e) {
	return e.filter((e) => e.kind === "talent" && Sf(e)).map((e) => ({
		kind: e.kind,
		name: e.name,
		total: e.talentMaximumValue
	}));
}
function wf(e, t) {
	let n = new Map(e.map((e) => [Ef(e), e])), r = [];
	for (let e of t) {
		let t = n.get(Ef(e));
		!t || t.current === e.current || r.push({
			current: e.current,
			kind: t.kind,
			name: t.name
		});
	}
	return r;
}
function Tf(e, t) {
	return e.find((e) => e.kind === t.kind && e.name === t.name) ?? null;
}
function Ef(e) {
	return `${e.kind}:${e.name}`;
}
//#endregion
//#region src/functions/npc-builder/xp-cost.ts
var Df = {
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
function Of(e) {
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
		let e = Rf(r), i = e + r.current;
		if (r.kind === "characteristic") {
			let a = d[Pd(r.name)];
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
	return kf(n, t);
}
function kf(e, t) {
	let n = Nf(e, t), r = Pf(e.skills, t.skills, Df.skill), i = Ff(e.talents, t.talents);
	return {
		characteristics: n,
		skills: r,
		talents: i,
		total: n + r + i
	};
}
function Af(e) {
	let t = Math.max(0, Math.floor(e.current));
	return e.kind === "talent" ? Mf(t) : jf(t, e.kind === "characteristic" ? Df.characteristic : Df.skill);
}
function jf(e, t) {
	let n = Math.max(0, Math.floor(e)), r = 0;
	for (let e = 0; e < n; e += 1) {
		let n = Math.min(Math.floor(e / 5), t.length - 1);
		r += t[n] ?? 0;
	}
	return r;
}
function Mf(e, t = 0) {
	let n = Math.max(0, Math.floor(e)), r = Math.max(0, Math.floor(t)), i = 0;
	for (let e = 0; e < n; e += 1) i += (r + e + 1) * 100;
	return i;
}
function Nf(e, t) {
	let n = 0;
	for (let r of Object.keys(u)) {
		let i = r, a = Lf(e.characteristics[i] ?? 0, t.characteristics[i] ?? 0);
		n += jf(a, Df.characteristic);
	}
	return n;
}
function Pf(e, t, n) {
	let r = If(e), i = If(t), a = 0;
	for (let [e, t] of r) {
		let r = Lf(t, i.get(e) ?? 0);
		a += jf(r, n);
	}
	return a;
}
function Ff(e, t) {
	let n = If(e), r = If(t), i = 0;
	for (let [e, t] of n) {
		let n = Lf(t, r.get(e) ?? 0);
		i += Mf(n);
	}
	return i;
}
function If(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = Pd(n.name), r = Math.floor(n.value);
		e && t.set(e, (t.get(e) ?? 0) + r);
	}
	return t;
}
function Lf(e, t) {
	return Math.max(0, Math.floor(e) - Math.floor(t));
}
function Rf(e) {
	return e.kind === "characteristic" ? Math.floor(e.baseValue) : e.kind === "skill" ? Math.floor(e.baseAdvances + (e.baseModifier ?? 0)) : Math.floor(e.baseAdvances);
}
//#endregion
//#region src/state/npc-builder/advancements/index.ts
function zf(e) {
	let { baseActorDraftData: t, careers: n, customAdvancements: r, manualAdvancementDeltas: i, settings: a, skillCharacteristics: o, skillGrantResolutions: s, talentMaximums: c } = e, l = $(() => uf({
		baseActorDraftData: t.value,
		careers: n.value,
		customAdvancements: r.value,
		manualAdvancementDeltas: i.value,
		settings: a.value,
		skillCharacteristics: o.value,
		skillGrantResolutions: s.value,
		talentMaximums: c.value
	})), u = $(() => Of(l.value)), d = $(() => Cf(l.value).length);
	function f(e) {
		let t = Od(e.kind, e.name);
		r.value.some((e) => Od(e.kind, e.name) === t) || r.value.push(e);
	}
	function p(e) {
		let t = Od(e.kind, e.name);
		r.value = r.value.filter((e) => Od(e.kind, e.name) !== t), delete i.value[t];
	}
	function m(e, t) {
		x(e, bf(e, t));
	}
	function h() {
		for (let e of Cf(l.value)) {
			let t = Tf(l.value, e);
			t && x(t, e.total);
		}
	}
	function g(e, t) {
		let n = Math.max(0, Math.floor(Number.isFinite(t) ? t : 0)), r = e.run({ advancements: l.value }, n), i = wf(l.value, r.advancements);
		for (let e of i) {
			let t = Tf(l.value, e);
			t && b(t, e.current);
		}
	}
	function _(e) {
		return s.value[e] ?? "";
	}
	function v(e) {
		o.value = pf(o.value, e);
	}
	function y(e) {
		c.value = mf(c.value, e);
	}
	function b(e, t) {
		let n = Od(e.kind, e.name);
		i.value[n] = df(e, t);
	}
	function x(e, t) {
		let n = Od(e.kind, e.name);
		i.value[n] = ff(e, t);
	}
	function S(e) {
		let t = Od(e.kind, e.name);
		delete i.value[t];
	}
	function ee() {
		i.value = {};
	}
	function C(e, t) {
		let n = t.trim();
		if (!n) {
			delete s.value[e];
			return;
		}
		s.value[e] = n;
	}
	function te(e) {
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
		removeSkillGrantResolutionsForCareer: te,
		resetAdvancementCurrent: S,
		resetAllAdvancementCurrents: ee,
		setAdvancementCurrent: b,
		setAdvancementTotal: x,
		setSkillGrantResolution: C
	};
}
//#endregion
//#region src/functions/npc-builder/draft-summary.ts
function Bf(e, t) {
	return e.find((e) => e.uuid === t) ?? null;
}
function Vf(e) {
	return e.at(-1) ?? null;
}
function Hf(e) {
	let t = e.finalCareer?.name, n = e.settings.includeSpeciesInName && e.selectedBaseActor?.species ? e.selectedBaseActor.species : "";
	return t && n ? `${n} ${t}` : t || (e.selectedBaseActor ? `${e.selectedBaseActor.name} NPC` : "New NPC");
}
function Uf(e, t) {
	return e.trim() || t;
}
function Wf(e) {
	return e.finalCareer?.img || e.selectedBaseActor?.prototypeTokenImg || e.selectedBaseActor?.img || "";
}
function Gf(e, t) {
	return e || t;
}
function Kf(e) {
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
function qf(e) {
	let { actorName: t, baseActors: n, careers: r, clearBaseDraftData: i, clearMountSelection: a, customAdvancements: o, customSpells: s, customTraits: c, customTrappings: l, detectedSpells: u, ignoredBaseTraitKeys: d, magicLoreResolutions: f, removeSkillGrantResolutionsForCareer: p, selectedBaseActorUuid: m, selectedPortraitPath: h, settings: g, skillGrantResolutions: _, spellSelectionOverrides: v } = e, y = $(() => Bf(n.value, m.value)), b = $(() => Vf(r.value)), x = $(() => Hf({
		finalCareer: b.value,
		selectedBaseActor: y.value,
		settings: g.value
	})), S = $(() => Uf(t.value, x.value)), ee = $(() => Wf({
		finalCareer: b.value,
		selectedBaseActor: y.value
	})), C = $(() => Gf(h.value, ee.value)), te = $(() => Kf(r.value));
	function w(e) {
		let t = r.value.find((t) => t.uuid === e.uuid);
		if (t) {
			t.quantity = Fd(t.quantity + 1);
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
	function ie(e) {
		let [t] = r.value.splice(e, 1);
		t && p(t.uuid);
	}
	function E() {
		for (let e of r.value) p(e.uuid);
		r.value = [];
	}
	function ae() {
		t.value = "", E(), o.value = [], c.value = [], l.value = [], s.value = [], u.value = [], d.value = {}, f.value = {}, h.value = "", _.value = {}, v.value = {}, m.value = "", i(), a();
	}
	function D(e) {
		n.value.some((t) => t.uuid === e.uuid) || n.value.push(e), O(e.uuid);
	}
	function O(e) {
		let t = e.trim();
		m.value !== t && (h.value = ""), m.value = t;
	}
	function k(e) {
		h.value = e;
	}
	function oe(e, t) {
		let n = r.value[e];
		n && (n.quantity = Fd(t));
	}
	return {
		addCareer: w,
		addCareerIfMissing: ne,
		clearCareers: E,
		finalActorName: S,
		finalCareer: b,
		finalPortraitPath: C,
		grantTotals: te,
		moveCareer: re,
		moveCareerToIndex: T,
		removeCareer: ie,
		resetDraft: ae,
		selectBaseActor: D,
		selectBaseActorUuid: O,
		selectedBaseActor: y,
		selectPortrait: k,
		setCareerQuantity: oe,
		suggestedActorName: x
	};
}
//#endregion
//#region src/state/npc-builder/hydration.ts
function Jf(e) {
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
function Yf(e) {
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
function Xf(e) {
	return e.sourceFilter ? e.sourceFilter : e.sourceGroup ? {
		label: $f(e.sourceGroup),
		value: e.sourceGroup
	} : null;
}
function Zf(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = Xf(n);
		e && !t.has(e.value) && t.set(e.value, e);
	}
	return [...t.values()];
}
function Qf(e) {
	return {
		label: `Priority Folder: ${e.split("/").filter(Boolean).slice(-2).join("/") || e}`,
		value: `priority-folder:${e.toLocaleLowerCase()}`
	};
}
function $f(e) {
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
function ep(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = ip(r.img);
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
function tp(e) {
	let t = ep(np([...e.assetCandidates, ...e.immediateCandidates]));
	return !e.selectedPortraitPath || t.some((t) => ip(t.img) === ip(e.selectedPortraitPath)) ? t : [{
		img: e.selectedPortraitPath,
		key: `selected:${e.selectedPortraitPath}`,
		label: "Selected portrait",
		source: "foundry-asset",
		sourceLabel: "Selected"
	}, ...t];
}
function np(e) {
	return e.map((e, t) => ({
		candidate: e,
		index: t
	})).sort((e, t) => rp(e.candidate) - rp(t.candidate) || e.index - t.index).map(({ candidate: e }) => e);
}
function rp(e) {
	return e.sourceFilter?.value.startsWith("priority-folder:") ? 0 : e.sourceGroup ? {
		career: 1,
		compendiums: 2,
		world: 3,
		"dig-down": 4
	}[e.sourceGroup] ?? 5 : 5;
}
function ip(e) {
	return e.trim().toLocaleLowerCase();
}
//#endregion
//#region src/functions/portrait-gallery/index.ts
var ap = new Set([
	"and",
	"any",
	"the",
	"with",
	"without",
	"of",
	"or",
	"npc"
]), op = "portrait-gallery-filter:", sp = "modules/wfrp4e-core/art/careers", cp = [
	"modules/wfrp4e-core/art/bestiary",
	"modules/wfrp4e-core/tokens",
	"modules/wfrp4e-core/tokens/popout"
], lp = ["systems/wfrp4e/tokens/unknown.png"], up = "application/x-wfrp4e-customizer-portrait-filter-tag";
function dp(e) {
	return kp(Op(e).filter((e) => e.length >= 3 && !ap.has(e)));
}
function fp(e) {
	return kp(e.flatMap(dp));
}
function pp(e) {
	if (!Array.isArray(e)) return [];
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		if (typeof r != "string") continue;
		let e = r.trim().replaceAll("\\", "/").replace(/^\/+|\/+$/gu, ""), i = e.toLocaleLowerCase();
		e && !t.has(i) && (t.add(i), n.push(e));
	}
	return n;
}
function mp(e) {
	return pp([
		...e.hasCareer ? [sp] : [],
		...cp,
		...e.configuredFolders
	]);
}
function hp(e, t, n) {
	return e.filter((e) => (t[e] ?? "search") === n);
}
function gp(e, t) {
	let n = Dp(e);
	return !!(n && t.some((e) => n.includes(e)));
}
function _p(e, t) {
	let n = Ep(e), r = Xf(e), i = t.mustIncludeSources.length === 0 || r !== null && t.mustIncludeSources.includes(r.value), a = r !== null && t.mustExcludeSources.includes(r.value);
	return t.mustIncludeTerms.every((e) => n.includes(e)) && t.mustExcludeTerms.every((e) => !n.includes(e)) && i && !a;
}
function vp(e) {
	return `${op}${e}`;
}
function yp(e) {
	return e.startsWith(op) ? e.slice(24) : null;
}
function bp(e) {
	return e.hasEnabledSource && e.hasSubject && e.searchTerms.length > 0;
}
function xp(e) {
	return e ? e.maxDirectories <= 0 ? e.phase === "ready" ? 100 : 4 : Math.min(100, Math.round(e.directoriesVisited / e.maxDirectories * 100)) : 0;
}
function Sp(e) {
	return e ? e.phase === "ready" ? `${e.candidatesFound} options found` : e.phase === "filesystem" ? e.maxDirectories <= 0 ? `${e.directoriesVisited} directories - ${e.currentLocation}` : `${e.directoriesVisited}/${e.maxDirectories} directories - ${e.currentLocation}` : e.currentLocation : "";
}
function Cp(e) {
	return `${e.label}\n${e.img}`;
}
function wp(e) {
	return `Use ${e.label} (${Tp(e)})`;
}
function Tp(e) {
	return e.sourceLabel ?? {
		"base-actor": "Actor Portrait",
		"base-token": "Prototype Token",
		career: "Career",
		"foundry-asset": "Foundry",
		web: "Web"
	}[e.source];
}
function Ep(e) {
	return Dp([
		e.label,
		e.img,
		e.sourceLabel ?? ""
	].filter(Boolean).join(" "));
}
function Dp(e) {
	return e.trim().toLocaleLowerCase().replaceAll(/[_-]/g, " ").replaceAll(/[(),.:;[\]]/g, " ").replaceAll(/\s+/g, " ");
}
function Op(e) {
	return Dp(e).split(" ").filter(Boolean);
}
function kp(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/state/portrait-gallery/filters.ts
function Ap() {
	let e = /* @__PURE__ */ B([]), t = /* @__PURE__ */ B({}), n = /* @__PURE__ */ B({});
	function r(t) {
		let r = new Set(e.value), i = dp(t).filter((e) => !r.has(e));
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
function jp() {
	return Ap();
}
//#endregion
//#region src/functions/npc-builder/default-npc-builder-settings.ts
function Mp() {
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
		excludedPortraitReferenceImages: [...lp],
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
var Np = Mp(), Pp = {
	advancements: [],
	optionalTraits: [],
	traits: [],
	trappings: []
}, Fp = /\(([^)]+)\)/, Ip = [
	"beasts",
	"death",
	"fire",
	"heavens",
	"metal",
	"life",
	"light",
	"shadow"
], Lp = [
	"daemonology",
	"necromancy",
	"nurgle",
	"slaanesh",
	"tzeentch",
	"undivided"
];
function Rp(e, t) {
	let n = e.trim(), r = n.toLocaleLowerCase();
	return r === "petty magic" ? Gp({
		kind: "petty-magic",
		rawLore: "Petty Magic",
		source: t,
		sourceName: n
	}) : r.startsWith("arcane magic") ? Gp({
		kind: "arcane-magic",
		rawLore: Kp(n),
		source: t,
		sourceName: n
	}) : r.startsWith("spellcaster") ? Gp({
		kind: "spellcaster",
		rawLore: Kp(n),
		source: t,
		sourceName: n
	}) : null;
}
function zp(e) {
	return e.trim().replace(/^any\s+/i, "").replace(/^arcane\s+lore\s+of\s+/i, "").replace(/^arcane\s+lore$/i, "").replace(/^lore\s+of\s+/i, "").replaceAll(/\s+/g, " ").toLocaleLowerCase();
}
function Bp(e) {
	return `${e.source}:${e.kind}:${e.sourceName}:${e.rawLore}`;
}
function Vp(e, t) {
	return {
		...e,
		isAmbiguous: !1,
		normalizedLore: zp(t),
		rawLore: t.trim()
	};
}
function Hp(e) {
	let t = zp(e);
	return t === "petty" ? "petty" : Ip.includes(t) ? "eight-wind" : Lp.includes(t) ? "dark" : "other";
}
function Up(e, t) {
	if (e.kind === "petty-magic") return t.filter((e) => e.category === "petty");
	let n = e.rawLore.trim().toLocaleLowerCase();
	return n.includes("dark") ? t.filter((e) => e.category === "dark") : n.includes("eight winds") ? t.filter((e) => e.category === "eight-wind") : t.filter((e) => e.category !== "petty");
}
function Wp(e) {
	let t = e.trim().toLocaleLowerCase();
	return !t || t === "any" || t.includes("any ");
}
function Gp(e) {
	let t = e.rawLore.trim();
	return {
		isAmbiguous: Wp(t),
		kind: e.kind,
		normalizedLore: zp(t),
		rawLore: t,
		resolutionKey: Bp({
			kind: e.kind,
			rawLore: t,
			source: e.source,
			sourceName: e.sourceName
		}),
		source: e.source,
		sourceName: e.sourceName
	};
}
function Kp(e) {
	return Fp.exec(e)?.[1]?.trim() ?? "";
}
//#endregion
//#region src/functions/npc-builder/spells/derive-magic-grants.ts
function qp(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.advancements) n.kind !== "talent" || n.baseAdvances + n.current <= 0 || Jp(t, Rp(n.name, "talent"), e);
	for (let n of e.traits) Jp(t, Rp(n.name, "trait"), e);
	return [...t.values()];
}
function Jp(e, t, n) {
	if (!t) return;
	let r = n.loreResolutions[t.resolutionKey];
	e.set(t.resolutionKey, r ? Vp(t, r) : t);
}
//#endregion
//#region src/functions/npc-builder/spells/derive-spells.ts
function Yp(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.detectedSpells) t.set(n.key, {
		...n,
		selected: e.selectionOverrides[n.key] ?? e.autoSelectDetectedSpells
	});
	for (let n of e.customSpells) t.set(n.key, {
		...n,
		selected: e.selectionOverrides[n.key] ?? n.selected
	});
	return [...t.values()].sort(em);
}
function Xp(e) {
	return e.filter((e) => e.selected);
}
function Zp(e) {
	return e.spells.map((t) => ({
		...t,
		selected: e.selectionOverrides[t.key] ?? e.autoSelectDetectedSpells
	}));
}
function Qp(e) {
	let t = e.detectedSpells.find((t) => $p(t, e.spell));
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
function $p(e, t) {
	return e.sourceUuid && e.sourceUuid === t.sourceUuid ? !0 : Nd(e.name, t.name);
}
function em(e, t) {
	return e.loreName === t.loreName ? e.name.localeCompare(t.name) : e.loreName.localeCompare(t.loreName);
}
//#endregion
//#region src/state/npc-builder/spells.ts
function tm(e) {
	let { advancements: t, customSpells: n, detectedSpells: r, magicLoreResolutions: i, settings: a, spellSelectionOverrides: o, traits: s } = e, c = $(() => qp({
		advancements: t.value,
		loreResolutions: i.value,
		traits: s.value
	})), l = $(() => c.value.length > 0), u = $(() => Yp({
		autoSelectDetectedSpells: a.value.autoSelectGrantedSpells,
		customSpells: n.value,
		detectedSpells: r.value,
		selectionOverrides: o.value
	})), d = $(() => Xp(u.value));
	function f(e) {
		let t = Qp({
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
		r.value = Zp({
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
function nm(e) {
	let t = /* @__PURE__ */ new Map();
	if (e.allowBaseActorTraits) for (let n of e.baseActorDraftData.traits) {
		let r = om(n);
		e.ignoredBaseTraitKeys[r] || t.set(r, lm(n, r, !1));
	}
	for (let n of e.customTraits) cm([...t.values()], n.name) || t.set(n.key, { ...n });
	return [...t.values()].map((t) => ({
		...t,
		config: Md(t.config, e.traitConfigOverrides[t.key])
	})).sort(um);
}
function rm(e) {
	return e.allowBaseActorTraits ? [...e.baseActorDraftData.traits.filter((t) => e.ignoredBaseTraitKeys[om(t)]).map((t) => {
		let n = om(t);
		return {
			...lm(t, n, !0),
			config: Md(t.config, e.traitConfigOverrides[n])
		};
	}), ...e.selectedTraits] : e.selectedTraits;
}
function im(e) {
	return e.optionalTraits.map((e) => ({
		config: e.config,
		img: e.img,
		name: e.name,
		uuid: e.uuid
	})).sort((e, t) => e.name.localeCompare(t.name));
}
function am(e, t) {
	return {
		config: t.config,
		ignored: !1,
		key: `${e}:${t.uuid || Pd(t.name)}`,
		name: t.name,
		source: e,
		sourceUuid: t.uuid
	};
}
function om(e) {
	return `base:${e.uuid || Pd(e.name)}`;
}
function sm(e, t) {
	return e.find((e) => Nd(e.name, t));
}
function cm(e, t) {
	return sm(e, t) !== void 0;
}
function lm(e, t, n) {
	return {
		config: e.config,
		ignored: n,
		key: t,
		name: e.name,
		source: "base",
		sourceUuid: e.uuid
	};
}
function um(e, t) {
	return e.source === t.source ? e.name.localeCompare(t.name) : e.source.localeCompare(t.source);
}
//#endregion
//#region src/state/npc-builder/traits.ts
function dm(e) {
	let { baseActorDraftData: t, customTraits: n, ignoredBaseTraitKeys: r, quickTraits: i, settings: a, traitConfigOverrides: o } = e, s = $(() => nm({
		allowBaseActorTraits: a.value.allowBaseActorTraits,
		baseActorDraftData: t.value,
		customTraits: n.value,
		ignoredBaseTraitKeys: r.value,
		traitConfigOverrides: o.value
	})), c = $(() => rm({
		allowBaseActorTraits: a.value.allowBaseActorTraits,
		baseActorDraftData: t.value,
		ignoredBaseTraitKeys: r.value,
		selectedTraits: s.value,
		traitConfigOverrides: o.value
	})), l = $(() => im(t.value));
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
		let i = am(e, t);
		if (!r) {
			d(i.key), x(t.name, !0);
			return;
		}
		x(t.name, !1) || n.value.find((e) => e.key === i.key) || h(i);
	}
	function h(e) {
		cm(s.value, e.name) || n.value.some((t) => t.key === e.key) || n.value.push(e);
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
		return sm(l.value, e);
	}
	function y(e) {
		return sm(i.value, e);
	}
	function b(e) {
		let n = sm(t.value.traits, e);
		if (!n) return null;
		let i = om(n);
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
function fm(e, t = "trapping") {
	return {
		candidates: [],
		searchTerms: gm(e),
		selectedCandidateUuid: "",
		selectedItemType: t,
		selectedName: e.trim(),
		status: "fallback"
	};
}
function pm(e) {
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
function mm(e) {
	return {
		candidates: [],
		searchTerms: gm(e),
		selectedCandidateUuid: "",
		selectedItemType: "trapping",
		selectedName: e.trim(),
		status: "unresolved"
	};
}
function hm(e, t) {
	let n = gm(e), r = vm(n, t), i = r.filter((e) => e.matchKind === "exact");
	return i.length === 1 ? bm("matched", n, i[0]) : i.length > 1 ? bm("ambiguous", n, i[0], { candidates: r }) : r.length ? {
		candidates: r,
		searchTerms: n,
		selectedCandidateUuid: "",
		selectedItemType: "trapping",
		selectedName: e.trim(),
		status: "ambiguous"
	} : fm(e);
}
function gm(e) {
	let t = e.split(/\s+or\s+/i).map((e) => e.trim()).filter(Boolean);
	return t.length ? wm(t) : [e.trim()].filter(Boolean);
}
function _m(e, t) {
	if (xm(e) === xm(t)) return "exact";
	let n = Sm(e), r = Sm(t);
	if (!n || !r) return null;
	if (n === r || n.includes(r) || r.includes(n)) return "near";
	let i = n.split(" "), a = new Set(r.split(" "));
	return i.every((e) => a.has(e)) ? "near" : null;
}
function vm(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) for (let e of t) {
		let t = _m(r, e.name);
		t && n.get(e.uuid)?.matchKind !== "exact" && n.set(e.uuid, {
			itemType: e.itemType,
			matchKind: t,
			name: e.name,
			searchTerm: r,
			sourceLabel: e.sourceLabel,
			uuid: e.uuid
		});
	}
	return [...n.values()].sort(ym);
}
function ym(e, t) {
	return e.matchKind === t.matchKind ? e.name.localeCompare(t.name) : e.matchKind === "exact" ? -1 : 1;
}
function bm(e, t, n, r = {}) {
	return {
		candidates: r.candidates ?? (n ? [n] : []),
		searchTerms: t,
		selectedCandidateUuid: n?.uuid ?? "",
		selectedItemType: n?.itemType ?? "trapping",
		selectedName: n?.name ?? "",
		status: e
	};
}
function xm(e) {
	return e.trim().toLocaleLowerCase().replaceAll(/\s+/g, " ");
}
function Sm(e) {
	return xm(e).replaceAll("&", " and ").replaceAll(/[(),.:;[\]]/g, " ").replaceAll(/\b(a|an|the|some|pair of|pairs of)\b/g, " ").split(/\s+/).map(Cm).filter(Boolean).join(" ");
}
function Cm(e) {
	return e.endsWith("ies") && e.length > 4 ? `${e.slice(0, -3)}y` : e.endsWith("s") && !e.endsWith("ss") && e.length > 3 ? e.slice(0, -1) : e;
}
function wm(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/functions/npc-builder/trappings/derive-trappings.ts
function Tm(e) {
	let t = /* @__PURE__ */ new Map();
	Om(t, e), km(t, e);
	for (let n of e.customTrappings) t.set(n.key, { ...n });
	return [...t.values()].map((t) => Am(t, e)).sort(jm);
}
function Em(e, t) {
	let n = e.resolution.candidates.find((e) => e.uuid === t);
	return n ? {
		...e.resolution,
		selectedCandidateUuid: n.uuid,
		selectedItemType: n.itemType,
		selectedName: n.name,
		status: e.resolution.status === "matched" ? "matched" : "ambiguous"
	} : null;
}
function Dm(e) {
	return {
		...fm(e.name, e.itemType),
		candidates: e.resolution.candidates,
		searchTerms: e.resolution.searchTerms
	};
}
function Om(e, t) {
	if (t.settings.allowBaseActorTrappings) for (let n of t.baseActorDraftData.trappings) {
		let t = `base:${n.uuid || Pd(n.name)}`;
		e.set(t, {
			ignored: !1,
			itemType: n.itemType,
			key: t,
			name: n.name,
			quantity: n.quantity,
			resolution: pm({
				itemType: n.itemType,
				name: n.name,
				uuid: n.uuid
			}),
			source: "base",
			sourceUuid: n.uuid
		});
	}
}
function km(e, t) {
	for (let n of t.careers) for (let r of n.grants.trappings) {
		let i = `career:${Pd(r)}`, a = e.get(i);
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
			resolution: t.trappingResolutionOverrides[i] ?? mm(r),
			source: "career",
			sourceUuid: ""
		});
	}
}
function Am(e, t) {
	let n = t.trappingOverrides[e.key];
	return {
		...e,
		ignored: n?.ignored ?? e.ignored,
		quantity: Fd(n?.quantity ?? e.quantity),
		resolution: t.trappingResolutionOverrides[e.key] ?? e.resolution
	};
}
function jm(e, t) {
	return e.source === t.source ? e.name.localeCompare(t.name) : e.source.localeCompare(t.source);
}
//#endregion
//#region src/state/npc-builder/trappings.ts
function Mm(e) {
	let { baseActorDraftData: t, careers: n, customTrappings: r, settings: i, trappingOverrides: a, trappingResolutionOverrides: o } = e, s = $(() => Tm({
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
			quantity: Fd(t)
		};
	}
	function f(e, t) {
		let n = s.value.find((t) => t.key === e), r = n ? Em(n, t) : null;
		r && (o.value[e] = r);
	}
	function p(e) {
		let t = s.value.find((t) => t.key === e);
		t && (o.value[e] = Dm(t));
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
var Nm = Td("npc-builder", () => {
	let e = /* @__PURE__ */ B(""), t = /* @__PURE__ */ B([]), n = /* @__PURE__ */ B({}), r = /* @__PURE__ */ B(null), i = /* @__PURE__ */ B({ ...Pp }), a = /* @__PURE__ */ B([]), o = /* @__PURE__ */ B([]), s = /* @__PURE__ */ B([]), c = /* @__PURE__ */ B([]), l = /* @__PURE__ */ B([]), u = /* @__PURE__ */ B(null), d = /* @__PURE__ */ B([]), f = /* @__PURE__ */ B([]), p = /* @__PURE__ */ B(""), m = /* @__PURE__ */ B({ ...Np }), h = /* @__PURE__ */ B(""), g = /* @__PURE__ */ B(""), _ = /* @__PURE__ */ B({}), v = /* @__PURE__ */ B({}), y = /* @__PURE__ */ B({}), b = /* @__PURE__ */ B([]), x = /* @__PURE__ */ B([]), S = /* @__PURE__ */ B([]), ee = /* @__PURE__ */ B({}), C = /* @__PURE__ */ B({}), te = /* @__PURE__ */ B({}), w = /* @__PURE__ */ B({}), ne = /* @__PURE__ */ B({}), re = /* @__PURE__ */ B({}), T = zf({
		baseActorDraftData: i,
		careers: o,
		customAdvancements: S,
		manualAdvancementDeltas: n,
		settings: m,
		skillCharacteristics: _,
		skillGrantResolutions: y,
		talentMaximums: v
	}), ie = jp(), E = Jf({
		actorFolders: t,
		baseActorDraftData: i,
		baseActors: a,
		ignoredBaseTraitKeys: ee,
		itemFolders: l,
		manualAdvancementDeltas: n,
		quickTraits: f,
		selectedBaseActorUuid: h,
		settings: m,
		traitConfigOverrides: w,
		trappingOverrides: ne,
		trappingResolutionOverrides: re
	}), ae = Yf({
		baseActorCombatProfile: r,
		mountActorProfile: u,
		mountActors: d,
		selectedMountActorUuid: g
	}), D = qf({
		actorName: e,
		baseActors: a,
		careers: o,
		clearBaseDraftData: E.clearBaseDraftData,
		clearMountSelection: ae.clearMountSelection,
		customAdvancements: S,
		customSpells: x,
		customTraits: s,
		customTrappings: c,
		detectedSpells: b,
		ignoredBaseTraitKeys: ee,
		magicLoreResolutions: C,
		removeSkillGrantResolutionsForCareer: T.removeSkillGrantResolutionsForCareer,
		selectedBaseActorUuid: h,
		selectedPortraitPath: p,
		settings: m,
		skillGrantResolutions: y,
		spellSelectionOverrides: te
	}), O = dm({
		baseActorDraftData: i,
		customTraits: s,
		ignoredBaseTraitKeys: ee,
		quickTraits: f,
		settings: m,
		traitConfigOverrides: w
	}), k = Mm({
		baseActorDraftData: i,
		careers: o,
		customTrappings: c,
		settings: m,
		trappingOverrides: ne,
		trappingResolutionOverrides: re
	}), oe = tm({
		advancements: T.advancements,
		customSpells: x,
		detectedSpells: b,
		magicLoreResolutions: C,
		settings: m,
		spellSelectionOverrides: te,
		traits: O.traits
	});
	function se() {
		D.resetDraft(), ie.resetPortraitFilters();
	}
	return {
		actorName: e,
		actorFolders: t,
		addCareer: D.addCareer,
		addCareerIfMissing: D.addCareerIfMissing,
		addCustomAdvancement: T.addCustomAdvancement,
		addCustomPortraitSearchTerm: ie.addCustomPortraitSearchTerm,
		addCustomSpell: oe.addCustomSpell,
		addCustomTrait: O.addCustomTrait,
		addCustomTrapping: k.addCustomTrapping,
		adjustAdvancementCurrent: T.adjustAdvancementCurrent,
		advancements: T.advancements,
		applyAutoAdvance: T.applyAutoAdvance,
		baseActorCombatProfile: r,
		baseActorDraftData: i,
		baseActors: a,
		buildTraits: O.buildTraits,
		careers: o,
		clearCareers: D.clearCareers,
		clearBaseDraftData: E.clearBaseDraftData,
		clearMountSelection: ae.clearMountSelection,
		customSpells: x,
		customAdvancements: S,
		customPortraitSearchTerms: ie.customPortraitSearchTerms,
		customTraits: s,
		customTrappings: c,
		estimatedNpcXp: T.estimatedNpcXp,
		finalActorName: D.finalActorName,
		finalCareer: D.finalCareer,
		finalPortraitPath: D.finalPortraitPath,
		getSkillGrantResolution: T.getSkillGrantResolution,
		grantTotals: D.grantTotals,
		hasMagicAccess: oe.hasMagicAccess,
		hydrateActorFolders: E.hydrateActorFolders,
		hydrateBaseActorCombatProfile: ae.hydrateBaseActorCombatProfile,
		hydrateBaseActorDraftData: E.hydrateBaseActorDraftData,
		hydrateBaseActors: E.hydrateBaseActors,
		hydrateDetectedSpells: oe.hydrateDetectedSpells,
		hydrateItemFolders: E.hydrateItemFolders,
		hydrateMountActorProfile: ae.hydrateMountActorProfile,
		hydrateMountActors: ae.hydrateMountActors,
		hydrateQuickTraits: E.hydrateQuickTraits,
		hydrateSettings: E.hydrateSettings,
		hydrateSkillCharacteristics: T.hydrateSkillCharacteristics,
		hydrateTalentMaximums: T.hydrateTalentMaximums,
		itemFolders: l,
		magicGrants: oe.magicGrants,
		magicLoreResolutions: C,
		mountActorProfile: u,
		mountActors: d,
		maximizableTalentCount: T.maximizableTalentCount,
		maximizeTalents: T.maximizeTalents,
		moveCareer: D.moveCareer,
		moveCareerToIndex: D.moveCareerToIndex,
		optionalTraits: O.optionalTraits,
		quickTraits: f,
		removeCareer: D.removeCareer,
		removeCustomAdvancement: T.removeCustomAdvancement,
		removeCustomSpell: oe.removeCustomSpell,
		removeCustomTrait: O.removeCustomTrait,
		removeCustomTrapping: k.removeCustomTrapping,
		resetAdvancementCurrent: T.resetAdvancementCurrent,
		resetAllAdvancementCurrents: T.resetAllAdvancementCurrents,
		portraitSourceTagSections: ie.portraitSourceTagSections,
		portraitTermSections: ie.portraitTermSections,
		resetDraft: se,
		retainAvailablePortraitFilterTerms: ie.retainAvailablePortraitFilterTerms,
		selectBaseActor: D.selectBaseActor,
		selectBaseActorUuid: D.selectBaseActorUuid,
		selectMountActor: ae.selectMountActor,
		selectMountActorUuid: ae.selectMountActorUuid,
		selectedBaseActor: D.selectedBaseActor,
		selectedBaseActorUuid: h,
		selectedMountActorUuid: g,
		selectedPortraitPath: p,
		selectedSpells: oe.selectedSpells,
		selectPortrait: D.selectPortrait,
		selectTrappingResolutionCandidate: k.selectTrappingResolutionCandidate,
		setAdvancementCurrent: T.setAdvancementCurrent,
		setAdvancementTotal: T.setAdvancementTotal,
		setBaseTraitIgnored: O.setBaseTraitIgnored,
		setCareerQuantity: D.setCareerQuantity,
		setMagicGrantLoreResolution: oe.setMagicGrantLoreResolution,
		setOptionalTraitSelected: O.setOptionalTraitSelected,
		setPortraitSourceTagSection: ie.setPortraitSourceTagSection,
		setPortraitTermSection: ie.setPortraitTermSection,
		setQuickTraitSelected: O.setQuickTraitSelected,
		setSkillGrantResolution: T.setSkillGrantResolution,
		setSpellSelected: oe.setSpellSelected,
		setTraitConfig: O.setTraitConfig,
		setTrappingFallback: k.setTrappingFallback,
		setTrappingIgnored: k.setTrappingIgnored,
		setTrappingQuantity: k.setTrappingQuantity,
		setTrappingResolution: k.setTrappingResolution,
		settings: m,
		spells: oe.spells,
		suggestedActorName: D.suggestedActorName,
		traits: O.traits,
		trappings: k.trappings
	};
}), Pm = { class: "dui-fieldset-legend" }, Fm = [
	"checked",
	"disabled",
	"onChange"
], Im = { class: "dui-card-actions" }, Lm = /* @__PURE__ */ U({
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
			}, [Y("legend", Pm, "Tier " + L(t.level || "Unknown"), 1), (K(!0), q(G, null, W(t.candidates, (t) => (K(), q("label", {
				key: t.uuid,
				class: "dui-label"
			}, [Y("input", {
				class: "dui-checkbox dui-checkbox-sm",
				checked: e.isCareerQueued(t.uuid) || e.isLowerCareerSelected(t.uuid),
				disabled: e.isCareerQueued(t.uuid),
				type: "checkbox",
				onChange: (e) => r(t, e)
			}, null, 40, Fm), Y("span", null, [Y("strong", null, L(t.name), 1), Y("small", null, [Z(L(t.careerGroup || "Career") + " ", 1), e.isCareerQueued(t.uuid) ? (K(), q(G, { key: 0 }, [Z(" already queued ")], 64)) : Q("", !0)])])]))), 128))]))), 128)),
			Y("div", Im, [Y("button", {
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
}), Rm = ["aria-labelledby"], zm = ["id"], Bm = { class: "dui-modal-action" }, Vm = /* @__PURE__ */ U({
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
		let n = e, r = t, i = /* @__PURE__ */ B(null), a = os();
		return Qo(() => n.open, async (e) => {
			await No();
			let t = i.value;
			if (e && !t?.open) {
				t?.showModal();
				return;
			}
			!e && t?.open && t.close();
		}, { immediate: !0 }), ws(() => {
			i.value?.open && i.value.close();
		}), (t, n) => (K(), q("dialog", {
			ref_key: "dialogElement",
			ref: i,
			"aria-labelledby": V(a),
			"aria-modal": "true",
			class: "dui-modal",
			onCancel: n[1] ||= Ru((e) => r("close"), ["prevent"])
		}, [Y("section", { class: I(["dui-modal-box", { "app:max-w-5xl": e.wide }]) }, [
			Y("h2", {
				id: V(a),
				class: "dui-card-title"
			}, L(e.title), 9, zm),
			js(t.$slots, "default"),
			Y("div", Bm, [Y("button", {
				class: "dui-btn",
				type: "button",
				onClick: n[0] ||= (e) => r("close")
			}, L(e.closeLabel), 1)])
		], 2)], 40, Rm));
	}
}), Hm = /* @__PURE__ */ new Map();
function Um(e) {
	let t = e.id.trim();
	if (!t) throw Error("NPC auto-advance strategies must have an id.");
	Hm.set(t, {
		...e,
		id: t
	});
}
function Wm() {
	return [...Hm.values()].sort((e, t) => e.name.localeCompare(t.name));
}
function Gm(e) {
	return Hm.get(e) ?? null;
}
function Km(e, t) {
	return Ym(e, t, {
		kinds: ["skill"],
		respectTalentMaximums: !1
	});
}
function qm(e, t) {
	return Ym(Ym(e, t, {
		kinds: ["talent"],
		respectTalentMaximums: !0
	}), t, {
		kinds: ["skill"],
		respectTalentMaximums: !1
	});
}
function Jm(e, t) {
	return Ym(e, t, {
		kinds: ["characteristic"],
		respectTalentMaximums: !1
	});
}
function Ym(e, t, n) {
	let r = Math.max(0, Math.floor(Number.isFinite(t) ? t : 0)), i = Qm(e.advancements), a = Of(i).total;
	if (a >= r) return { advancements: i };
	let o = !0;
	for (; o;) {
		o = !1;
		for (let e of i) {
			if (!n.kinds.includes(e.kind)) continue;
			let t = Xm(e, n);
			if (!t) continue;
			let i = Af(t) - Af(e);
			i <= 0 || a + i > r || (e.current = t.current, a += i, o = !0);
		}
	}
	return { advancements: i };
}
function Xm(e, t) {
	return t.respectTalentMaximums && e.kind === "talent" && !Zm(e) ? null : {
		...e,
		current: e.current + vf(e)
	};
}
function Zm(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" ? yf(e) < t : !1;
}
function Qm(e) {
	return e.map((e) => ({
		...e,
		sources: e.sources.map((e) => ({ ...e }))
	}));
}
Um({
	description: "Cycles visible Skill rows evenly until no next skill increase fits the target XP.",
	id: "skill-master",
	name: "Skill Master",
	run: Km
}), Um({
	description: "Raises visible Talent rows evenly up to known maximums, then spends any remaining XP like Skill Master.",
	id: "gifted-and-talented",
	name: "Gifted & Talented",
	run: qm
}), Um({
	description: "Cycles visible Characteristic rows evenly until no next characteristic increase fits the target XP.",
	id: "all-natural",
	name: "All Natural",
	run: Jm
});
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderAdvancementsTab/advancement-display.ts
function $m(e) {
	let t = e.current - e.careerValue, n = [...e.sources].sort((e, t) => sh(e.kind) - sh(t.kind)).map((e) => eh(e));
	return t !== 0 && n.push(`Manual ${ch(t)}`), n.length ? n.join(", ") : e.includedFromBase ? "Base actor" : "-";
}
function eh(e) {
	return e.kind === "custom" && e.count === 0 ? e.label : `${e.label} ${ch(e.count)}`;
}
function th(e) {
	return Vd(e) !== null;
}
function nh(e) {
	return Math.max(e.minimumTotal, e.baseValue + e.current);
}
function rh(e) {
	return nh(e);
}
function ih(e) {
	return e.talentMaximumLabel ?? "Unknown";
}
function ah(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" && rh(e) > t;
}
function oh(e) {
	return Af(e);
}
function sh(e) {
	return e === "characteristic" ? 0 : e === "career" ? 1 : 2;
}
function ch(e) {
	return e > 0 ? `+${e}` : `${e}`;
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderAdvancementsTab/AdvancementRowTailActions.vue?vue&type=script&setup=true&lang.ts
var lh = ["disabled"], uh = /* @__PURE__ */ U({
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
		}, " Reset ", 8, lh), e.entry.includedFromCustom ? (K(), q("button", {
			key: 0,
			class: "dui-join-item dui-btn dui-btn-sm",
			title: "Remove dropped entry",
			type: "button",
			onClick: r[1] ||= (e) => n("removeCustom")
		}, " Remove Dropped ")) : Q("", !0)], 64));
	}
}), dh = { class: "dui-card dui-card-border dui-card-sm" }, fh = { class: "dui-card-body" }, ph = { class: "dui-card-title" }, mh = {
	key: 0,
	class: "dui-badge dui-badge-primary"
}, hh = { key: 0 }, gh = /* @__PURE__ */ U({
	__name: "NpcBuilderSection",
	props: {
		description: { default: "" },
		number: { default: "" },
		title: {}
	},
	setup(e) {
		return (t, n) => (K(), q("section", dh, [Y("div", fh, [
			Y("h2", ph, [e.number ? (K(), q("span", mh, L(e.number), 1)) : Q("", !0), Z(" " + L(e.title), 1)]),
			e.description ? (K(), q("p", hh, L(e.description), 1)) : Q("", !0),
			js(t.$slots, "default")
		])]));
	}
}), _h = {
	key: 0,
	class: "dui-card-actions"
}, vh = {
	key: 1,
	class: "dui-alert dui-alert-info"
}, yh = { class: "dui-list" }, bh = { class: "dui-list-col-grow" }, xh = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, Sh = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, Ch = { class: "dui-join" }, wh = ["disabled", "onClick"], Th = [
	"aria-label",
	"value",
	"onInput"
], Eh = ["onClick"], Dh = {
	key: 2,
	class: "dui-alert"
}, Oh = /* @__PURE__ */ U({
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
		return (t, i) => (K(), J(gh, {
			number: e.sectionNumber,
			title: e.title
		}, {
			default: H(() => [
				e.manualAdvanceCount ? (K(), q("div", _h, [Y("span", null, L(e.manualAdvanceCount) + " manual edits", 1), Y("button", {
					class: "dui-btn dui-btn-sm",
					type: "button",
					onClick: i[0] ||= (e) => n("resetAll")
				}, " Reset All Advances ")])) : Q("", !0),
				e.estimatedNpcXp ? (K(), q("div", vh, [
					Y("strong", null, "Estimated NPC XP " + L(e.estimatedNpcXp.total), 1),
					Y("span", null, L(e.estimatedNpcXp.characteristics) + " characteristics", 1),
					Y("span", null, L(e.estimatedNpcXp.skills) + " skills", 1),
					Y("span", null, L(e.estimatedNpcXp.talents) + " talents", 1)
				])) : Q("", !0),
				Y("ul", yh, [(K(!0), q(G, null, W(e.entries, (t) => (K(), q("li", {
					key: `${t.kind}:${t.name}`,
					class: "dui-list-row"
				}, [Y("div", bh, [
					Y("strong", null, L(t.name), 1),
					t.current === t.careerValue ? Q("", !0) : (K(), q("span", xh, " Manual edit ")),
					e.showSkillSpecializationBadges && V(th)(t.name) ? (K(), q("span", Sh, " Needs specialization ")) : Q("", !0),
					Y("span", null, " Base " + L(t.baseValue) + " · Advances " + L(t.current) + " · XP " + L(V(oh)(t)), 1),
					Y("small", null, "Sources: " + L(V($m)(t)), 1)
				]), Y("div", Ch, [
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						disabled: V(nh)(t) <= t.minimumTotal,
						title: "Decrease by 5",
						type: "button",
						onClick: (e) => n("adjustCurrent", t, -1)
					}, " -5 ", 8, wh),
					Y("input", {
						class: "dui-join-item dui-input dui-input-sm",
						"aria-label": `Total ${t.name}`,
						value: V(nh)(t),
						min: "0",
						type: "number",
						onInput: (e) => r(t, e)
					}, null, 40, Th),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						title: "Increase by 5",
						type: "button",
						onClick: (e) => n("adjustCurrent", t, 1)
					}, " +5 ", 8, Eh),
					X(uh, {
						entry: t,
						onRemoveCustom: (e) => n("removeCustom", t),
						onResetCurrent: (e) => n("resetCurrent", t)
					}, null, 8, [
						"entry",
						"onRemoveCustom",
						"onResetCurrent"
					])
				])]))), 128))]),
				e.entries.length ? Q("", !0) : (K(), q("p", Dh, "No " + L(e.title.toLowerCase()) + " to advance yet.", 1))
			]),
			_: 1
		}, 8, ["number", "title"]));
	}
}), kh = { class: "dui-fieldset" }, Ah = ["value"], jh = { class: "dui-fieldset" }, Mh = ["value"], Nh = ["value"], Ph = { key: 0 }, Fh = { class: "dui-card-actions" }, Ih = ["disabled"], Lh = /* @__PURE__ */ U({
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
		return (t, a) => (K(), J(gh, {
			description: "Spend toward a target without exceeding it. Existing manual edits are preserved.",
			number: "4",
			title: "Auto Advance"
		}, {
			default: H(() => [
				Y("fieldset", kh, [a[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Target XP", -1), Y("input", {
					"aria-label": "Target XP",
					class: "dui-input dui-input-sm",
					value: e.targetXp,
					min: "0",
					type: "number",
					onInput: r
				}, null, 40, Ah)]),
				Y("fieldset", jh, [a[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "Strategy", -1), Y("select", {
					"aria-label": "Auto advance strategy",
					class: "dui-select dui-select-sm",
					value: e.selectedAutoAdvanceStrategyId,
					onChange: i
				}, [(K(!0), q(G, null, W(e.autoAdvanceStrategies, (e) => (K(), q("option", {
					key: e.id,
					value: e.id
				}, L(e.name), 9, Nh))), 128))], 40, Mh)]),
				e.selectedAutoAdvanceStrategy ? (K(), q("p", Ph, L(e.selectedAutoAdvanceStrategy.description), 1)) : Q("", !0),
				Y("div", Fh, [Y("button", {
					class: "dui-btn dui-btn-primary dui-btn-sm",
					disabled: !e.canRunAutoAdvance,
					title: "Advance rows as close to the target XP as possible without going over",
					type: "button",
					onClick: a[0] ||= (e) => n("runAutoAdvance")
				}, " Auto Advance ", 8, Ih)])
			]),
			_: 1
		}));
	}
}), Rh = { class: "dui-card-actions" }, zh = ["disabled"], Bh = { class: "dui-list" }, Vh = { class: "dui-list-col-grow" }, Hh = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, Uh = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, Wh = { class: "dui-join" }, Gh = ["disabled", "onClick"], Kh = [
	"aria-label",
	"value",
	"onInput"
], qh = ["onClick"], Jh = {
	key: 0,
	class: "dui-alert"
}, Yh = /* @__PURE__ */ U({
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
		return (t, i) => (K(), J(gh, {
			number: "3",
			title: "Talents"
		}, {
			default: H(() => [
				Y("div", Rh, [Y("span", null, L(e.maximizableTalentCount) + " below maximum", 1), Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: e.maximizableTalentCount === 0,
					title: "Raise talents with known maximums to their maximum ranks",
					type: "button",
					onClick: i[0] ||= (e) => n("maximizeTalents")
				}, " Maximize Talents ", 8, zh)]),
				Y("ul", Bh, [(K(!0), q(G, null, W(e.talents, (e) => (K(), q("li", {
					key: `${e.kind}:${e.name}`,
					class: "dui-list-row"
				}, [Y("div", Vh, [
					Y("strong", null, L(e.name), 1),
					e.current === e.careerValue ? Q("", !0) : (K(), q("span", Hh, " Manual edit ")),
					Y("span", null, " Ranks " + L(V(rh)(e)) + " · Maximum " + L(V(ih)(e)) + " · XP " + L(V(oh)(e)), 1),
					Y("small", null, "Sources: " + L(V($m)(e)), 1),
					V(ah)(e) ? (K(), q("span", Uh, " Over maximum ")) : Q("", !0)
				]), Y("div", Wh, [
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						disabled: V(rh)(e) <= e.minimumTotal,
						title: "Decrease by 1",
						type: "button",
						onClick: (t) => n("adjustCurrent", e, -1)
					}, " -1 ", 8, Gh),
					Y("input", {
						class: "dui-join-item dui-input dui-input-sm",
						"aria-label": `Ranks ${e.name}`,
						value: V(rh)(e),
						min: "0",
						type: "number",
						onInput: (t) => r(e, t)
					}, null, 40, Kh),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						title: "Increase by 1",
						type: "button",
						onClick: (t) => n("adjustCurrent", e, 1)
					}, " +1 ", 8, qh),
					X(uh, {
						entry: e,
						onRemoveCustom: (t) => n("removeCustom", e),
						onResetCurrent: (t) => n("resetCurrent", e)
					}, null, 8, [
						"entry",
						"onRemoveCustom",
						"onResetCurrent"
					])
				])]))), 128))]),
				e.talents.length ? Q("", !0) : (K(), q("p", Jh, "No talents to advance yet."))
			]),
			_: 1
		}));
	}
}), Xh = /* @__PURE__ */ U({
	__name: "NpcBuilderAdvancementsTab",
	props: { page: {} },
	setup(e) {
		let t = Nm(), { advancements: n, estimatedNpcXp: r, maximizableTalentCount: i } = Ed(t), a = Wm(), o = /* @__PURE__ */ B("skill-master"), s = /* @__PURE__ */ B(0), c = $(() => n.value.filter((e) => e.kind === "characteristic")), l = $(() => n.value.filter((e) => e.kind === "skill")), u = $(() => n.value.filter((e) => e.kind === "talent")), d = $(() => n.value.filter((e) => e.current !== e.careerValue).length), f = $(() => Gm(o.value) ?? a[0] ?? null), p = $(() => f.value !== null && s.value > r.value.total);
		Qo(() => r.value.total, (e) => {
			s.value < e && (s.value = e);
		}, { immediate: !0 });
		function m() {
			let e = f.value;
			e && t.applyAutoAdvance(e, s.value);
		}
		return (n, h) => (K(), q("section", null, [e.page === "detail-characteristics" ? (K(), J(Oh, {
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
		])) : e.page === "detail-skills" ? (K(), J(Oh, {
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
		])) : e.page === "detail-talents" ? (K(), J(Yh, {
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
		])) : (K(), J(Lh, {
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
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/labels.ts
function Zh(e) {
	return [
		`Ch ${e.grants.characteristics.length}`,
		`Sk ${e.grants.skills.length}`,
		`Ta ${e.grants.talents.length}`,
		`Tr ${e.grants.trappings.length}`
	].join(" / ");
}
function Qh(e) {
	let t = e.slice(0, 3).join(", "), n = e.length - 3;
	return e.length ? n > 0 ? `${t}, +${n}` : t : "-";
}
function $h(e) {
	return e.split(/\s+/).map((e) => e.at(0)).filter(Boolean).slice(0, 2).join("").toLocaleUpperCase();
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/BaseActorPanel.vue?vue&type=script&setup=true&lang.ts
var eg = { class: "dui-fieldset" }, tg = ["value"], ng = { class: "dui-fieldset" }, rg = ["disabled", "value"], ig = { value: "" }, ag = ["value"], og = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, sg = {
	key: 1,
	class: "dui-alert"
}, cg = {
	key: 0,
	class: "dui-avatar"
}, lg = { class: "app:size-16 app:shrink-0 app:rounded-lg" }, ug = ["src"], dg = {
	key: 1,
	class: "dui-badge"
}, fg = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(gh, {
			description: e.description,
			number: e.number,
			title: e.title
		}, {
			default: H(() => [
				Y("fieldset", eg, [n[0] ||= Y("legend", { class: "dui-fieldset-legend" }, "Search world actors", -1), Y("input", {
					"aria-label": "Search world actors",
					class: "dui-input dui-input-sm",
					value: e.actorFilter,
					placeholder: "Filter actors",
					type: "search",
					onInput: r
				}, null, 40, tg)]),
				Y("fieldset", ng, [n[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Base statblock", -1), Y("select", {
					"aria-label": "Base statblock",
					class: "dui-select dui-select-sm",
					disabled: e.isLoadingActors,
					value: e.selectedBaseActorUuid,
					onChange: i
				}, [Y("option", ig, L(e.isLoadingActors ? "Loading actors..." : "Choose an actor"), 1), (K(!0), q(G, null, W(e.filteredActors, (e) => (K(), q("option", {
					key: e.uuid,
					value: e.uuid
				}, L(e.name), 9, ag))), 128))], 40, rg)]),
				e.errorMessage ? (K(), q("p", og, L(e.errorMessage), 1)) : Q("", !0),
				e.selectedBaseActor ? (K(), q("article", sg, [e.selectedBaseActor.img ? (K(), q("div", cg, [Y("div", lg, [Y("img", {
					src: e.selectedBaseActor.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "64",
					width: "64"
				}, null, 8, ug)])])) : (K(), q("span", dg, L(V($h)(e.selectedBaseActor.name)), 1)), Y("div", null, [Y("strong", null, L(e.selectedBaseActor.name), 1), Y("span", null, [
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
}), pg = { class: "dui-card-actions" }, mg = { class: "dui-stats dui-stats-vertical app:w-full" }, hg = { class: "dui-stat" }, gg = { class: "dui-stat-value" }, _g = {
	key: 0,
	class: "dui-stat-desc"
}, vg = { class: "dui-stat" }, yg = { class: "dui-stat-value" }, bg = {
	key: 0,
	class: "dui-stat-desc"
}, xg = {
	key: 1,
	class: "dui-stat-desc"
}, Sg = { class: "dui-stat" }, Cg = { class: "dui-stat-value" }, wg = { class: "dui-stat" }, Tg = { class: "dui-stat-value" }, Eg = { class: "dui-stat" }, Dg = { class: "dui-stat-value" }, Og = { class: "dui-stat-desc" }, kg = {
	key: 0,
	class: "dui-alert dui-alert-warning",
	role: "alert"
}, Ag = { key: 1 }, jg = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(gh, {
			number: "4",
			title: "Build Preview"
		}, {
			default: H(() => [
				Y("div", pg, [Y("span", { class: I(["dui-badge", e.buildPreviewStatus === "Ready" ? "dui-badge-success" : "dui-badge-warning"]) }, L(e.buildPreviewStatus), 3)]),
				Y("div", mg, [
					Y("div", hg, [
						n[0] ||= Y("span", { class: "dui-stat-title" }, "Advances", -1),
						Y("strong", gg, L(e.advancementCount), 1),
						e.editedAdvanceCount ? (K(), q("small", _g, L(e.editedAdvanceCount) + " manually edited ", 1)) : Q("", !0)
					]),
					Y("div", vg, [
						n[1] ||= Y("span", { class: "dui-stat-title" }, "Trappings", -1),
						Y("strong", yg, L(e.visibleTrappingCount), 1),
						e.fallbackTrappingCount ? (K(), q("small", bg, L(e.fallbackTrappingCount) + " blank fallback ", 1)) : Q("", !0),
						e.ignoredTrappingCount ? (K(), q("small", xg, L(e.ignoredTrappingCount) + " ignored ", 1)) : Q("", !0)
					]),
					Y("div", Sg, [n[2] ||= Y("span", { class: "dui-stat-title" }, "Traits", -1), Y("strong", Cg, L(e.traitCount), 1)]),
					Y("div", wg, [n[3] ||= Y("span", { class: "dui-stat-title" }, "Spells", -1), Y("strong", Tg, L(e.selectedSpellCount), 1)]),
					Y("div", Eg, [
						n[4] ||= Y("span", { class: "dui-stat-title" }, "Estimated NPC XP", -1),
						Y("strong", Dg, L(e.estimatedNpcXp.total), 1),
						Y("small", Og, L(e.estimatedNpcXp.characteristics) + " char / " + L(e.estimatedNpcXp.skills) + " skill / " + L(e.estimatedNpcXp.talents) + " talent ", 1)
					])
				]),
				e.buildPreviewWarnings.length ? (K(), q("div", kg, [Y("div", null, [(K(!0), q(G, null, W(e.buildPreviewWarnings, (e) => (K(), q("p", { key: e }, L(e), 1))), 128))])])) : (K(), q("p", Ag, " The draft has a base Actor, queued Career data, resolved trappings, and a portrait ready to apply. "))
			]),
			_: 1
		}));
	}
}), Mg = { class: "dui-list" }, Ng = { class: "dui-list-row" }, Pg = { class: "dui-list-row" }, Fg = { class: "dui-list-row" }, Ig = { class: "dui-list-row" }, Lg = { class: "dui-list-row" }, Rg = { class: "dui-list-row" }, zg = { class: "dui-list-row" }, Bg = /* @__PURE__ */ U({
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
		return (t, n) => (K(), q("dl", Mg, [
			Y("div", Ng, [n[0] ||= Y("dt", null, "Build name", -1), Y("dd", null, L(e.finalActorName), 1)]),
			Y("div", Pg, [n[1] ||= Y("dt", null, "Base actor", -1), Y("dd", null, L(e.baseActorName), 1)]),
			Y("div", Fg, [n[2] ||= Y("dt", null, "Final career", -1), Y("dd", null, L(e.finalCareerName), 1)]),
			Y("div", Ig, [n[3] ||= Y("dt", null, "Career items", -1), Y("dd", null, L(e.careerItemCount), 1)]),
			Y("div", Lg, [n[4] ||= Y("dt", null, "Apply", -1), Y("dd", null, L(e.advancementCount) + " advance rows, " + L(e.visibleTrappingCount) + " trappings, " + L(e.traitCount) + " traits, " + L(e.selectedSpellCount) + " spells ", 1)]),
			Y("div", Rg, [n[5] ||= Y("dt", null, "Extracted grants", -1), Y("dd", null, L(e.grantTotals.characteristics) + " characteristics, " + L(e.grantTotals.skills) + " skills, " + L(e.grantTotals.talents) + " talents, " + L(e.grantTotals.trappings) + " trappings ", 1)]),
			Y("div", zg, [n[6] ||= Y("dt", null, "Estimated NPC XP", -1), Y("dd", null, L(e.estimatedNpcXpTotal), 1)])
		]));
	}
}), Vg = { class: "app:grid app:gap-3" }, Hg = { class: "app:flex app:flex-wrap app:items-start app:gap-3" }, Ug = ["aria-label", "disabled"], Wg = ["src"], Gg = { key: 1 }, Kg = { key: 2 }, qg = { class: "app:flex app:min-w-48 app:flex-1 app:flex-col app:items-start app:gap-2" }, Jg = ["title"], Yg = {
	key: 1,
	class: "app:text-base-content/70"
}, Xg = ["disabled"], Zg = {
	key: 0,
	"aria-live": "polite",
	role: "status"
}, Qg = ["value"], $g = {
	key: 1,
	class: "dui-fieldset"
}, e_ = { class: "dui-fieldset-legend" }, t_ = { key: 0 }, n_ = { key: 1 }, r_ = { class: "app:flex app:flex-wrap app:gap-2" }, i_ = [
	"aria-label",
	"aria-pressed",
	"title",
	"onClick"
], a_ = ["src"], o_ = ["aria-label"], s_ = /* @__PURE__ */ U({
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
		return (t, r) => (K(), q("section", Vg, [
			Y("div", Hg, [Y("button", {
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
			}, null, 8, Wg)) : e.finalCareer ? (K(), q("strong", Gg, L(V($h)(e.finalCareer.name)), 1)) : (K(), q("span", Kg, "No portrait"))], 8, Ug), Y("div", qg, [
				r[3] ||= Y("span", { class: "dui-badge dui-badge-outline" }, "Current portrait", -1),
				Y("strong", null, L(e.selectedPortraitCandidate?.label ?? "No portrait selected"), 1),
				e.finalPortraitPath ? (K(), q("small", {
					key: 0,
					class: "app:break-all app:text-base-content/70",
					title: e.finalPortraitPath
				}, L(e.finalPortraitPath), 9, Jg)) : (K(), q("span", Yg, " A Career or base Actor image will be used when available. ")),
				Y("button", {
					class: "dui-btn dui-btn-outline dui-btn-sm",
					disabled: !e.portraitCandidates.length,
					type: "button",
					onClick: r[1] ||= (e) => n("openGallery")
				}, " Browse " + L(e.portraitCandidates.length) + " portraits ", 9, Xg)
			])]),
			e.isLoadingPortraitCandidates && e.portraitSearchProgress ? (K(), q("div", Zg, [Y("progress", {
				"aria-label": "Portrait search progress",
				class: "dui-progress dui-progress-info app:w-full",
				value: e.portraitSearchProgressValue,
				max: "100"
			}, null, 8, Qg), Y("small", null, L(e.portraitSearchProgressLabel), 1)])) : Q("", !0),
			e.portraitCandidates.length || e.isLoadingPortraitCandidates ? (K(), q("fieldset", $g, [Y("legend", e_, [r[4] ||= Y("span", null, "Quick picks", -1), e.isLoadingPortraitCandidates ? (K(), q("span", t_, "Updating...")) : (K(), q("span", n_, L(e.portraitCandidates.length) + " options", 1))]), Y("div", r_, [(K(!0), q(G, null, W(e.compactPortraitCandidates, (t) => (K(), q("button", {
				key: t.key,
				"aria-label": V(wp)(t),
				"aria-pressed": t.key === e.selectedPortraitCandidateKey,
				class: I(["dui-btn dui-btn-square app:overflow-hidden app:p-1", { "dui-btn-active dui-btn-outline": t.key === e.selectedPortraitCandidateKey }]),
				title: V(Cp)(t),
				type: "button",
				onClick: (e) => n("selectPortrait", t)
			}, [Y("img", {
				alt: "",
				class: "app:h-full app:w-full app:rounded-box app:object-cover",
				height: "64",
				loading: "lazy",
				src: t.img,
				width: "64"
			}, null, 8, a_)], 10, i_))), 128)), e.hiddenPortraitCandidateCount > 0 ? (K(), q("button", {
				key: 0,
				"aria-label": `Open ${e.hiddenPortraitCandidateCount} more portrait options`,
				class: "dui-btn dui-btn-square",
				type: "button",
				onClick: r[2] ||= (e) => n("openGallery")
			}, " +" + L(e.hiddenPortraitCandidateCount), 9, o_)) : Q("", !0)])])) : Q("", !0)
		]));
	}
}), c_ = { class: "app:grid app:gap-3 md:app:sticky md:app:top-28 md:app:max-h-[calc(100vh-10rem)] md:app:self-start md:app:overflow-y-auto" }, l_ = { class: "dui-fieldset" }, u_ = ["placeholder", "value"], d_ = { class: "app:hidden md:app:grid md:app:gap-3" }, f_ = { class: "dui-collapse dui-collapse-arrow dui-card-border" }, p_ = { class: "dui-collapse-content" }, m_ = /* @__PURE__ */ U({
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
		return (t, i) => (K(), q("aside", c_, [X(gh, {
			description: "The generated Actor identity stays visible while Build NPC controls change.",
			title: "Preview"
		}, {
			default: H(() => [X(s_, {
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
			]), Y("fieldset", l_, [i[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "NPC name", -1), Y("input", {
				"aria-label": "NPC name",
				class: "dui-input dui-input-sm",
				placeholder: e.suggestedActorName,
				value: e.actorName,
				type: "text",
				onInput: r
			}, null, 40, u_)])]),
			_: 1
		}), Y("div", d_, [X(jg, {
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
		]), Y("details", f_, [i[3] ||= Y("summary", { class: "dui-collapse-title" }, "Complete build details", -1), Y("div", p_, [X(Bg, {
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
}), h_ = {
	key: 0,
	class: "dui-list app:gap-1"
}, g_ = [
	"onDragenter",
	"onDragover",
	"onDrop"
], __ = ["onDragstart"], v_ = {
	key: 0,
	class: "dui-avatar"
}, y_ = { class: "app:size-10 app:rounded-md" }, b_ = ["src"], x_ = {
	key: 1,
	class: "dui-badge dui-badge-sm"
}, S_ = { class: "dui-list-col-grow app:min-w-0" }, C_ = { class: "app:flex app:min-w-0 app:flex-wrap app:items-center app:gap-1" }, w_ = { class: "app:truncate" }, T_ = {
	key: 0,
	class: "dui-badge dui-badge-info dui-badge-xs"
}, E_ = {
	key: 1,
	class: "dui-badge dui-badge-info dui-badge-xs"
}, D_ = { class: "app:flex app:min-w-0 app:items-center app:gap-2 app:text-xs" }, O_ = { class: "app:shrink-0" }, k_ = ["title"], A_ = { class: "app:flex app:items-center app:justify-end app:gap-1" }, j_ = { class: "app:flex app:items-center app:gap-1 app:text-xs" }, M_ = ["value", "onInput"], N_ = { class: "dui-join" }, P_ = ["disabled", "onClick"], F_ = ["disabled", "onClick"], I_ = ["onClick"], L_ = {
	key: 1,
	class: "dui-alert"
}, R_ = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(gh, {
			description: "Careers are applied in this order. Drag rows or use the buttons to reorder them.",
			number: "2",
			title: "Career Queue"
		}, {
			default: H(() => [e.careers.length ? (K(), q("ol", h_, [(K(!0), q(G, null, W(e.careers, (t, a) => (K(), q("li", {
				key: t.uuid,
				class: I(["dui-list-row app:grid-cols-[auto_auto_minmax(0,1fr)_auto] app:items-center app:gap-2 app:rounded-md app:px-2 app:py-2", {
					"app:border-t-2 app:border-dashed app:border-info": i(a) === "before",
					"app:border-b-2 app:border-dashed app:border-info": i(a) === "after",
					"app:opacity-60": e.draggedCareerIndex === a
				}]),
				onDragenter: Ru((e) => r("careerDragEnter", a), ["prevent", "stop"]),
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
				}, " Drag ", 42, __),
				t.img ? (K(), q("div", v_, [Y("div", y_, [Y("img", {
					src: t.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "40",
					width: "40"
				}, null, 8, b_)])])) : (K(), q("span", x_, L(V($h)(t.name)), 1)),
				Y("div", S_, [Y("div", C_, [Y("strong", w_, L(t.name), 1), e.draggedCareerIndex === a ? (K(), q("span", T_, " Dragging ")) : i(a) ? (K(), q("span", E_, " Place " + L(i(a)), 1)) : Q("", !0)]), Y("div", D_, [Y("span", O_, [Z(L(t.careerGroup || "Career") + " ", 1), t.level === null ? Q("", !0) : (K(), q(G, { key: 0 }, [Z(" level " + L(t.level), 1)], 64))]), Y("small", {
					class: "dui-badge dui-badge-ghost dui-badge-sm app:min-w-0 app:truncate",
					title: [
						`Characteristics: ${V(Qh)(t.grants.characteristics)}`,
						`Skills: ${V(Qh)(t.grants.skills)}`,
						`Talents: ${V(Qh)(t.grants.talents)}`,
						`Trappings: ${V(Qh)(t.grants.trappings)}`
					].join("\n")
				}, L(V(Zh)(t)), 9, k_)])]),
				Y("div", A_, [Y("label", j_, [n[1] ||= Z(" Qty ", -1), Y("input", {
					class: "dui-input dui-input-xs app:w-14",
					value: t.quantity,
					min: "1",
					type: "number",
					onInput: (e) => r("careerQuantityInput", a, e)
				}, null, 40, M_)]), Y("div", N_, [
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						disabled: a === 0,
						title: "Move career earlier",
						type: "button",
						onClick: (e) => r("moveCareer", a, -1)
					}, " Up ", 8, P_),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						disabled: a === e.careers.length - 1,
						title: "Move career later",
						type: "button",
						onClick: (e) => r("moveCareer", a, 1)
					}, " Down ", 8, F_),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						type: "button",
						onClick: (e) => r("removeCareer", a)
					}, " Remove ", 8, I_)
				])])
			], 42, g_))), 128))])) : (K(), q("p", L_, "No careers queued yet."))]),
			_: 1
		}));
	}
}), z_ = { class: "app:grid app:gap-2" }, B_ = { class: "app:flex app:flex-wrap app:items-center app:gap-2" }, V_ = { class: "dui-join app:min-w-64 app:flex-1" }, H_ = { class: "dui-input dui-input-sm dui-join-item app:flex-1" }, U_ = ["onKeydown"], W_ = { class: "dui-badge dui-badge-sm dui-badge-outline" }, G_ = { class: "app:grid app:gap-2 md:app:grid-cols-3" }, K_ = [
	"onDragenter",
	"onDragleave",
	"onDragover",
	"onDrop"
], q_ = { class: "dui-card-body app:gap-2 app:p-2" }, J_ = { class: "app:flex app:items-center app:gap-2" }, Y_ = { class: "dui-card-title app:m-0 app:text-sm" }, X_ = { class: "dui-badge dui-badge-sm" }, Z_ = {
	key: 0,
	"aria-live": "polite",
	class: "dui-badge dui-badge-info dui-badge-sm app:ml-auto"
}, Q_ = { class: "app:flex app:min-h-8 app:flex-wrap app:items-center app:gap-2" }, $_ = [
	"title",
	"onClick",
	"onDragstart",
	"onKeydown"
], ev = {
	key: 0,
	class: "app:text-base-content/60"
}, tv = { class: "dui-card-body app:flex-row app:items-center app:justify-center app:gap-2 app:p-2" }, nv = { "aria-live": "polite" }, rv = /* @__PURE__ */ U({
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
			t.stopPropagation(), a.value = e, t.dataTransfer?.setData("text/plain", vp(e.id)), t.dataTransfer?.setData(up, e.id), t.dataTransfer && (t.dataTransfer.effectAllowed = "move");
		}
		function d(e, t) {
			t.preventDefault(), t.stopPropagation(), o.value = e, t.dataTransfer && (t.dataTransfer.dropEffect = _(a.value, e) ? "move" : "none");
		}
		function f(e, t) {
			t.stopPropagation(), !(t.currentTarget instanceof Node && t.relatedTarget instanceof Node && t.currentTarget.contains(t.relatedTarget)) && o.value === e && (o.value = null);
		}
		function p(e, t) {
			t.preventDefault(), t.stopPropagation();
			let i = t.dataTransfer?.getData("application/x-wfrp4e-customizer-portrait-filter-tag") || yp(t.dataTransfer?.getData("text/plain") ?? ""), o = a.value ?? n.tags.find((e) => e.id === i) ?? null;
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
		return (t, n) => (K(), q("section", z_, [
			Y("div", B_, [Y("div", V_, [Y("label", H_, [n[5] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-magnifying-glass"
			}, null, -1), Go(Y("input", {
				"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
				"aria-label": "Add a portrait search term",
				class: "app:grow",
				placeholder: "Add a search term",
				type: "search",
				onKeydown: Bu(Ru(l, ["prevent"]), ["enter"])
			}, null, 40, U_), [[ku, i.value]])]), Y("button", {
				class: "dui-btn dui-btn-sm dui-join-item",
				type: "button",
				onClick: l
			}, [...n[6] ||= [Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-plus"
			}, null, -1), Z(" Add ", -1)]])]), Y("span", W_, L(e.resultCount) + " images", 1)]),
			Y("div", G_, [(K(), q(G, null, W(s, (e) => Y("section", {
				key: e.id,
				class: I(["dui-card dui-card-border dui-card-sm app:min-h-20 app:border-base-content/30 app:bg-base-200 app:shadow-sm", { "app:border-info app:bg-info/10 app:ring-2 app:ring-info": o.value === e.id }]),
				onDragenter: (t) => d(e.id, t),
				onDragleave: (t) => f(e.id, t),
				onDragover: (t) => d(e.id, t),
				onDrop: (t) => p(e.id, t)
			}, [Y("div", q_, [Y("header", J_, [
				Y("h3", Y_, [Y("i", {
					"aria-hidden": "true",
					class: I(["fa-solid", e.icon])
				}, null, 2), Z(" " + L(e.title), 1)]),
				Y("span", X_, L(c.value[e.id].length), 1),
				o.value === e.id ? (K(), q("span", Z_, L(v(e.id)), 1)) : Q("", !0)
			]), Y("div", Q_, [(K(!0), q(G, null, W(c.value[e.id], (e) => (K(), q("button", {
				key: e.id,
				class: I(["dui-badge dui-badge-sm app:h-auto app:cursor-grab app:whitespace-normal app:py-1", [e.kind === "source" ? "dui-badge-outline" : "dui-badge-primary", a.value?.id === e.id ? "app:opacity-50" : ""]]),
				draggable: "true",
				title: `Drag ${e.label} to another group, or select it to move it to the next group.`,
				type: "button",
				onClick: (t) => m(e),
				onDragend: g,
				onDragstart: (t) => u(e, t),
				onKeydown: Bu(Ru((t) => h(e), ["prevent"]), ["delete"])
			}, L(e.label), 43, $_))), 128)), c.value[e.id].length ? Q("", !0) : (K(), q("small", ev, " Drop tags here "))])])], 42, K_)), 64))]),
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
			}, [Y("div", tv, [n[7] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-trash"
			}, null, -1), Y("span", nv, L(y.value), 1)])], 34)
		]));
	}
}), iv = ["aria-busy"], av = {
	key: 0,
	class: "dui-alert dui-alert-error app:min-h-0 app:py-2",
	role: "alert"
}, ov = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info app:min-h-0 app:gap-2 app:py-2",
	role: "status"
}, sv = { class: "app:flex app:min-w-0 app:flex-1 app:items-center app:gap-2" }, cv = { class: "app:shrink-0" }, lv = ["value"], uv = {
	key: 2,
	class: "dui-alert dui-alert-warning app:min-h-0 app:py-2"
}, dv = { class: "dui-list app:m-0 app:grid app:grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] app:gap-3 app:p-0" }, fv = [
	"aria-label",
	"aria-pressed",
	"title",
	"onClick"
], pv = ["loading", "src"], mv = { class: "app:flex app:flex-wrap app:items-center app:justify-between app:gap-1" }, hv = {
	key: 0,
	class: "dui-badge dui-badge-success dui-badge-sm"
}, gv = { class: "app:text-sm" }, _v = {
	key: 4,
	class: "dui-alert"
}, vv = /* @__PURE__ */ U({
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
			X(rv, {
				"result-count": e.options.length,
				tags: e.tags,
				onCreateSearchTerm: i[0] ||= (e) => r("createSearchTerm", e),
				onFilterTagSectionChange: i[1] ||= (e, t) => r("filterTagSectionChange", e, t)
			}, null, 8, ["result-count", "tags"]),
			e.errorMessage ? (K(), q("div", av, [i[2] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-triangle-exclamation"
			}, null, -1), Y("span", null, L(e.errorMessage), 1)])) : Q("", !0),
			e.isLoading ? (K(), q("div", ov, [i[3] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-spinner fa-spin"
			}, null, -1), Y("div", sv, [Y("small", cv, L(e.progressLabel || "Updating results..."), 1), Y("progress", {
				"aria-label": "Portrait search progress",
				class: "dui-progress app:min-w-24 app:flex-1",
				value: e.progressValue,
				max: "100"
			}, null, 8, lv)])])) : e.searchTerms.length && !e.options.length ? (K(), q("p", uv, " No portraits match the current filter tags. ")) : Q("", !0),
			e.options.length ? (K(), q("div", {
				key: 3,
				class: I(["app:pr-1", e.fillHeight ? "app:min-h-48 app:flex-1 app:overflow-y-auto" : "app:max-h-[30rem] app:overflow-y-auto"])
			}, [Y("ul", dv, [(K(!0), q(G, null, W(e.options, (t, n) => (K(), q("li", { key: t.key }, [Y("button", {
				"aria-label": V(wp)(t),
				"aria-pressed": t.key === e.selectedOptionKey,
				class: I(["dui-btn app:h-auto app:min-h-0 app:w-full app:flex-col app:items-stretch app:justify-start app:gap-2 app:overflow-hidden app:whitespace-normal app:p-2 app:text-left", t.key === e.selectedOptionKey ? "dui-btn-active dui-btn-outline" : "dui-btn-ghost"]),
				title: V(Cp)(t),
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
				}, null, 8, pv),
				Y("span", mv, [Y("small", null, L(V(Tp)(t)), 1), t.key === e.selectedOptionKey ? (K(), q("span", hv, " Selected ")) : Q("", !0)]),
				Y("strong", gv, L(t.label), 1)
			], 10, fv)]))), 128))])], 2)) : e.isLoading ? Q("", !0) : (K(), q("p", _v, L(n.emptyMessage), 1))
		], 8, iv));
	}
}), yv = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(Vm, {
			"close-label": "Done",
			open: e.open,
			title: "Choose an NPC Portrait",
			wide: "",
			onClose: r[3] ||= (e) => n("close")
		}, {
			default: H(() => [X(vv, {
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
}), bv = {
	key: 0,
	class: "dui-alert"
}, xv = {
	key: 0,
	class: "dui-avatar"
}, Sv = { class: "app:size-14 app:shrink-0 app:rounded-lg" }, Cv = ["src"], wv = {
	key: 1,
	class: "dui-badge"
}, Tv = {
	key: 1,
	class: "dui-alert dui-alert-info"
}, Ev = { class: "dui-card-actions" }, Dv = ["disabled"], Ov = {
	key: 2,
	class: "dui-alert"
}, kv = /* @__PURE__ */ U({
	__name: "QuickCareerPanel",
	props: {
		careers: {},
		finalCareer: {}
	},
	emits: ["clearCareers"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (K(), J(gh, {
			description: "Quick Build keeps one chosen Career chain instead of a manual queue.",
			number: "2",
			title: "Career"
		}, {
			default: H(() => [
				e.finalCareer ? (K(), q("article", bv, [e.finalCareer.img ? (K(), q("div", xv, [Y("div", Sv, [Y("img", {
					src: e.finalCareer.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "56",
					width: "56"
				}, null, 8, Cv)])])) : (K(), q("span", wv, L(V($h)(e.finalCareer.name)), 1)), Y("div", null, [
					Y("strong", null, L(e.finalCareer.name), 1),
					Y("span", null, [Z(L(e.finalCareer.careerGroup || "Career") + " ", 1), e.finalCareer.level === null ? Q("", !0) : (K(), q(G, { key: 0 }, [Z(" level " + L(e.finalCareer.level), 1)], 64))]),
					Y("small", null, L(V(Zh)(e.finalCareer)), 1)
				])])) : Q("", !0),
				e.careers.length > 1 ? (K(), q("div", Tv, [Y("span", null, L(e.careers.length - 1) + " lower-tier Career" + L(e.careers.length === 2 ? "" : "s"), 1), Y("span", null, "Included before " + L(e.finalCareer?.name) + ".", 1)])) : Q("", !0),
				Y("div", Ev, [Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: !e.careers.length,
					type: "button",
					onClick: r[0] ||= (e) => n("clearCareers")
				}, " Clear Career ", 8, Dv)]),
				e.careers.length ? Q("", !0) : (K(), q("p", Ov, "No Career selected."))
			]),
			_: 1
		}));
	}
}), Av = {
	key: 0,
	class: "dui-fieldset"
}, jv = { class: "dui-fieldset-legend" }, Mv = { class: "dui-card-actions" }, Nv = ["aria-pressed", "onClick"], Pv = /* @__PURE__ */ U({
	__name: "TraitButtonGroup",
	props: {
		caption: {},
		title: {},
		traits: {}
	},
	emits: ["toggleTrait"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => e.traits.length ? (K(), q("fieldset", Av, [Y("legend", jv, [Y("span", null, L(e.title), 1), Y("span", null, L(e.caption), 1)]), Y("div", Mv, [(K(!0), q(G, null, W(e.traits, (e) => (K(), q("button", {
			key: e.uuid,
			"aria-pressed": e.isSelected,
			class: I(["dui-btn dui-btn-sm", { "dui-btn-active": e.isSelected }]),
			type: "button",
			onClick: (t) => n("toggleTrait", e)
		}, L(e.name), 11, Nv))), 128))])])) : Q("", !0);
	}
});
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/errors.ts
function Fv(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not resolve that Actor drop.";
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/useBaseActorSelection.ts
function Iv(e, t) {
	let n = Nm(), { baseActors: r, selectedBaseActorUuid: i } = Ed(n), a = /* @__PURE__ */ B(""), o = $(() => {
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
			t.value = Fv(e);
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
function Lv() {
	let { advancements: e, careers: t, finalPortraitPath: n, selectedBaseActor: r, trappings: i } = Ed(Nm()), a = $(() => {
		let e = 0;
		for (let n of t.value) e += n.quantity;
		return e;
	}), o = $(() => i.value.filter((e) => !e.ignored).length), s = $(() => e.value.filter((e) => e.current !== e.careerValue).length), c = $(() => i.value.filter((e) => !e.ignored && e.resolution.status === "fallback").length), l = $(() => i.value.filter((e) => e.ignored).length), u = $(() => e.value.filter((e) => e.kind === "skill" && Vd(e.name) !== null).length), d = $(() => i.value.filter((e) => !e.ignored && e.resolution.status === "unresolved").length), f = $(() => {
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
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/useBuildTraits.ts
function Rv() {
	let e = Nm(), { optionalTraits: t, quickTraits: n, traits: r } = Ed(e), i = $(() => new Set(r.value.map((e) => zv(e.name)))), a = $(() => t.value.map(s)), o = $(() => {
		let e = new Set(t.value.map((e) => zv(e.name)));
		return n.value.filter((t) => !e.has(zv(t.name))).map(s);
	});
	function s(e) {
		return {
			...e,
			isSelected: i.value.has(zv(e.name))
		};
	}
	function c(t) {
		let n = i.value.has(zv(t.name));
		e.setQuickTraitSelected(t, !n);
	}
	function l(t) {
		let n = i.value.has(zv(t.name));
		e.setOptionalTraitSelected(t, !n);
	}
	return {
		displayedQuickTraitOptions: o,
		optionalTraitOptions: a,
		toggleOptionalTrait: l,
		toggleQuickTrait: c
	};
}
function zv(e) {
	return e.trim().toLocaleLowerCase();
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/useCareerQueue.ts
function Bv() {
	let e = Nm(), t = /* @__PURE__ */ B(null), n = /* @__PURE__ */ B(null);
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
var Vv = up;
function Hv(e) {
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
	}), ep(t);
}
function Uv(e) {
	let t = [];
	e.selectedBaseActor && t.push(e.selectedBaseActor.species, e.selectedBaseActor.name);
	for (let n of e.careers) t.push(n.name, n.careerGroup);
	return fp(t);
}
//#endregion
//#region src/state/portrait-gallery/workflow.ts
function Wv(e) {
	let t = /* @__PURE__ */ B([]), n = /* @__PURE__ */ B(null), r = /* @__PURE__ */ B(!1), i = /* @__PURE__ */ B(null), a = 0, o = $(() => Gv([...e.baseSearchTerms.value, ...e.filterState.customPortraitSearchTerms.value])), s = $(() => x("search")), c = $(() => x("must-include")), l = $(() => x("must-exclude")), u = $(() => Gv([...s.value, ...c.value])), d = $(() => n.value ?? tp({
		assetCandidates: t.value,
		immediateCandidates: e.immediateCandidates.value,
		selectedPortraitPath: e.pinnedPortraitPath.value
	})), f = $(() => Zf(d.value)), p = $(() => [...o.value.flatMap(S), ...f.value.map(ee)]), m = $(() => d.value.filter((e) => _p(e, {
		mustExcludeSources: C("must-exclude"),
		mustExcludeTerms: l.value,
		mustIncludeSources: C("must-include"),
		mustIncludeTerms: c.value
	}))), h = $(() => m.value.find((t) => t.img === e.activePortraitPath.value) ?? null), g = $(() => h.value?.key ?? ""), _ = $(() => Sp(i.value)), v = $(() => xp(i.value));
	Qo(o, (t) => e.filterState.retainAvailablePortraitFilterTerms(t), { immediate: !0 }), Qo(() => [
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
		let s = e.hasSubject.value, d = bp({
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
			}, r) : [], f = tp({
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
		return hp(o.value, e.filterState.portraitTermSections.value, t);
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
	function ee(t) {
		return {
			canRemove: !1,
			id: `source:${t.value}`,
			kind: "source",
			label: `Sourced From ${t.label}`,
			section: e.filterState.portraitSourceTagSections.value[t.value] ?? "search",
			value: t.value
		};
	}
	function C(t) {
		return f.value.filter((n) => (e.filterState.portraitSourceTagSections.value[n.value] ?? "search") === t).map((e) => e.value);
	}
}
function Gv(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/state/npc-builder/workflows/portrait-candidates-workflow.ts
function Kv(e, t) {
	let n = Nm(), { careers: r, customPortraitSearchTerms: i, finalPortraitPath: a, portraitSourceTagSections: o, portraitTermSections: s, selectedBaseActor: c, selectedPortraitPath: l, settings: u } = Ed(n), d = $(() => Hv({
		careers: r.value,
		selectedBaseActor: c.value
	})), f = $(() => Uv({
		careers: r.value,
		selectedBaseActor: c.value
	})), p = $(() => mp({
		configuredFolders: u.value.prioritizedPortraitFolders,
		hasCareer: r.value.length > 0
	})), m = Wv({
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
//#region src/view/apps/npc-builder/components/NpcBuilderBuildTab/usePortraitCandidates.ts
function qv(e, t) {
	let n = Kv(e, t), r = /* @__PURE__ */ B(!1);
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
var Jv = { class: "app:grid app:gap-3" }, Yv = { class: "app:grid app:items-start app:gap-3 md:app:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]" }, Xv = { class: "app:grid app:min-w-0 app:gap-3" }, Zv = /* @__PURE__ */ U({
	__name: "NpcBuilderBuildTab",
	props: {
		bridge: {},
		isLoadingActors: { type: Boolean },
		isLoadingBaseDraft: { type: Boolean },
		page: {}
	},
	setup(e) {
		let t = e, n = Nm(), { actorName: r, advancements: i, careers: a, estimatedNpcXp: o, finalActorName: s, finalCareer: c, finalPortraitPath: l, grantTotals: u, selectedBaseActor: d, selectedSpells: f, suggestedActorName: p, traits: m } = Ed(n), h = /* @__PURE__ */ B(""), { actorFilter: g, filteredActors: _, selectedBaseActorSelectValue: v } = Iv(t.bridge, h), { clearCareerDragState: y, draggedCareerIndex: b, dragOverCareerIndex: x, handleCareerDragOver: S, handleCareerDragStart: ee, handleCareerDrop: C, moveCareer: te, removeCareer: w, setCareerQuantity: ne, setDragOverCareerIndex: re } = Bv(), { displayedQuickTraitOptions: T, optionalTraitOptions: ie, toggleOptionalTrait: E, toggleQuickTrait: ae } = Rv(), { buildPreviewStatus: D, buildPreviewWarnings: O, careerItemCount: k, editedAdvanceCount: oe, fallbackTrappingCount: se, ignoredTrappingCount: ce, visibleTrappingCount: A } = Lv(), { addPortraitSearchTerm: le, compactPortraitCandidates: ue, hiddenPortraitCandidateCount: de, isLoadingPortraitCandidates: fe, isPortraitGalleryOpen: pe, portraitCandidates: me, portraitFilterTags: he, portraitSearchProgress: ge, portraitSearchProgressLabel: _e, portraitSearchProgressValue: ve, portraitSearchTerms: ye, selectedPortraitCandidate: be, selectedPortraitCandidateKey: xe, selectPortrait: Se, selectPortraitFromGallery: Ce, setPortraitFilterTagSection: we } = qv(t.bridge, h);
		return (t, Te) => (K(), q("section", Jv, [Y("div", Yv, [Y("div", Xv, [
			e.page === "build-quick" || e.page === "build-actor" ? (K(), J(fg, {
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
			e.page === "build-quick" ? (K(), J(kv, {
				key: 1,
				careers: V(a),
				"final-career": V(c),
				onClearCareers: V(n).clearCareers
			}, null, 8, [
				"careers",
				"final-career",
				"onClearCareers"
			])) : Q("", !0),
			e.page === "build-quick" ? (K(), J(gh, {
				key: 2,
				description: "Apply optional base traits and configured quick traits to the draft.",
				number: "3",
				title: "Quick Traits"
			}, {
				default: H(() => [X(Pv, {
					caption: `${V(ie).length} from base statblock`,
					traits: V(ie),
					title: "Optional Traits",
					onToggleTrait: V(E)
				}, null, 8, [
					"caption",
					"traits",
					"onToggleTrait"
				]), X(Pv, {
					caption: `${V(T).length} configured`,
					traits: V(T),
					title: "Quick Traits",
					onToggleTrait: V(ae)
				}, null, 8, [
					"caption",
					"traits",
					"onToggleTrait"
				])]),
				_: 1
			})) : Q("", !0),
			e.page === "build-careers" ? (K(), J(R_, {
				key: 3,
				careers: V(a),
				"drag-over-career-index": V(x),
				"dragged-career-index": V(b),
				onCareerDragEnd: V(y),
				onCareerDragEnter: V(re),
				onCareerDragOver: V(S),
				onCareerDragStart: V(ee),
				onCareerDropOnRow: V(C),
				onCareerQuantityInput: V(ne),
				onMoveCareer: V(te),
				onRemoveCareer: V(w)
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
		]), X(m_, {
			class: "app:min-w-0",
			"actor-name": V(r),
			"advancement-count": V(i).length,
			"build-preview-status": V(D),
			"build-preview-warnings": V(O),
			"career-item-count": V(k),
			"compact-portrait-candidates": V(ue),
			"edited-advance-count": V(oe),
			"estimated-npc-xp": V(o),
			"fallback-trapping-count": V(se),
			"final-actor-name": V(s),
			"final-career": V(c),
			"final-portrait-path": V(l),
			"grant-totals": V(u),
			"hidden-portrait-candidate-count": V(de),
			"ignored-trapping-count": V(ce),
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
			"visible-trapping-count": V(A),
			onActorNameChange: Te[2] ||= (e) => r.value = e,
			onOpenPortraitGallery: Te[3] ||= (e) => pe.value = !0,
			onSelectPortrait: V(Se)
		}, null, 8, /* @__PURE__ */ "actor-name.advancement-count.build-preview-status.build-preview-warnings.career-item-count.compact-portrait-candidates.edited-advance-count.estimated-npc-xp.fallback-trapping-count.final-actor-name.final-career.final-portrait-path.grant-totals.hidden-portrait-candidate-count.ignored-trapping-count.is-loading-portrait-candidates.portrait-candidates.portrait-search-progress.portrait-search-progress-label.portrait-search-progress-value.selected-base-actor.selected-portrait-candidate.selected-portrait-candidate-key.selected-spell-count.suggested-actor-name.trait-count.visible-trapping-count.onSelectPortrait".split("."))]), X(yv, {
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
}), Qv = {
	Average: "avg",
	Enormous: "enor",
	Large: "lrg",
	Little: "ltl",
	Monstrous: "mnst",
	Small: "sml",
	Tiny: "tiny"
}, $v = new Set(["bestial", "skittish"]);
function ey(e) {
	let t = e.some((e) => ay(e, "skittish")), n = e.some((e) => oy(e, "trained", "war")), r = cy(e.filter((e) => ay(e, "weapon")));
	return e.map((e) => {
		let i = ny(e.name);
		return $v.has(i) ? iy(e, `${e.name} is removed from combined mounts.`) : i === "weapon" ? !n || t ? iy(e, "Weapon requires Trained (War) and a mount that was not Skittish.") : e.uuid === r ? ry(e, "Weapon (Mount)") : iy(e, "Only the strongest Weapon trait is retained for the combined profile.") : ry(e, e.damage ? sy(e.name) : e.name);
	});
}
function ty(e) {
	return ny(e) === "armour";
}
function ny(e) {
	return e.trim().replace(/\s*\(mount\)\s*$/i, "").toLocaleLowerCase();
}
function ry(e, t) {
	return {
		fixedDamage: e.fixedDamage,
		included: !0,
		name: e.name,
		outputName: t,
		reason: "",
		sourceUuid: e.uuid
	};
}
function iy(e, t) {
	return {
		fixedDamage: e.fixedDamage,
		included: !1,
		name: e.name,
		outputName: "",
		reason: t,
		sourceUuid: e.uuid
	};
}
function ay(e, t) {
	return ny(e.name) === t;
}
function oy(e, t, n) {
	return ay(e, t) ? e.specification.trim().toLocaleLowerCase() === n : e.name.trim().toLocaleLowerCase() === `${t} (${n})`;
}
function sy(e) {
	return /\(mount\)\s*$/i.test(e.trim()) ? e.trim() : `${e.trim()} (Mount)`;
}
function cy(e) {
	return [...e].sort((e, t) => (t.fixedDamage ?? 0) - (e.fixedDamage ?? 0) || e.uuid.localeCompare(t.uuid))[0]?.uuid ?? "";
}
//#endregion
//#region src/functions/npc-builder/combined-profile/calculate.ts
var ly = [
	Qv.Tiny,
	Qv.Little,
	Qv.Small,
	Qv.Average,
	Qv.Large,
	Qv.Enormous,
	Qv.Monstrous
], uy = {
	[Qv.Average]: "Average",
	[Qv.Enormous]: "Enormous",
	[Qv.Large]: "Large",
	[Qv.Little]: "Little",
	[Qv.Monstrous]: "Monstrous",
	[Qv.Small]: "Small",
	[Qv.Tiny]: "Tiny"
};
function dy(e, t) {
	return {
		chargeStrengthBonus: Math.max(t.characteristics.strengthBonus - e.characteristics.strengthBonus, 0),
		initiative: Math.max(e.characteristics.initiative, t.characteristics.initiative),
		movement: t.movement,
		size: py(e.size, t.size),
		strength: e.characteristics.strength,
		toughness: Math.max(e.characteristics.toughness, t.characteristics.toughness),
		traits: ey(t.traits),
		wounds: fy(e.wounds, t.wounds)
	};
}
function fy(e, t) {
	return Math.max(1, Math.max(e, t) + Math.ceil(Math.min(e, t) * .25));
}
function py(e, t) {
	return my(t) > my(e) ? t : e;
}
function my(e) {
	return ly.indexOf(e);
}
//#endregion
//#region src/functions/npc-builder/combined-profile/trait-source.ts
function hy({ flagScope: e, mount: t, plan: n, rider: r }) {
	let i = "Combined Profile";
	return {
		effects: [{
			changes: [],
			disabled: !1,
			flags: { [e]: { generatedCombinedProfileEffect: !0 } },
			img: t.img || "icons/svg/wing.svg",
			name: i,
			system: {
				scriptData: gy(e, n),
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
			description: { value: vy(r, t, n) },
			specification: { value: `${r.name} + ${t.name}` }
		},
		type: "trait"
	};
}
function gy(e, t) {
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
		script: _y(e, t.chargeStrengthBonus),
		trigger: "preRollTest"
	}), n;
}
function _y(e, t) {
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
function vy(e, t, n) {
	return [
		"<p>Generated by Drowsy's WFRP4e Customizers. This Actor combines a rider and mount into one simplified NPC profile.</p>",
		`<p><strong>Rider:</strong> ${yy(e.name)}<br><strong>Mount:</strong> ${yy(t.name)}</p>`,
		`<p><strong>Movement:</strong> ${n.movement}; <strong>Wounds:</strong> ${n.wounds}; <strong>Charge SB:</strong> +${n.chargeStrengthBonus}.</p>`,
		"<p>Mount attack Traits use fixed damage captured from the mount. Skittish and Bestial are removed.</p>"
	].join("");
}
function yy(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
//#endregion
//#region src/types/foundry/document-drop.ts
var by = "wfrp4e-customizer-apps.document-drop", xy = { class: "dui-list" }, Sy = [
	"aria-label",
	"disabled",
	"title",
	"onClick"
], Cy = ["src"], wy = {
	key: 1,
	"aria-hidden": "true",
	class: "fa-solid fa-scroll"
}, Ty = {
	key: 1,
	class: "dui-list-row"
}, Ey = /* @__PURE__ */ U({
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
		return (t, n) => (K(), q("ul", xy, [e.documents.length > 0 ? (K(!0), q(G, { key: 0 }, W(e.documents, (t) => (K(), q("li", {
			key: t.uuid,
			class: "dui-list-row"
		}, [Y("button", {
			"aria-label": e.isClickable ? `Use ${t.name}` : void 0,
			class: "dui-btn dui-btn-ghost",
			disabled: !e.isClickable,
			title: e.isClickable ? t.name : void 0,
			type: "button",
			onClick: Ru((e) => r(t), ["stop"])
		}, [t.img ? (K(), q("img", {
			key: 0,
			alt: "",
			"aria-hidden": "true",
			src: t.img
		}, null, 8, Cy)) : (K(), q("i", wy)), Y("span", null, L(t.name), 1)], 8, Sy)]))), 128)) : (K(), q("li", Ty, [n[0] ||= Y("i", {
			"aria-hidden": "true",
			class: "fa-solid fa-arrow-down"
		}, null, -1), Y("span", null, L(e.emptyLabel), 1)]))]));
	}
}), Dy = { class: "dui-card-body dui-fieldset" }, Oy = ["for"], ky = ["id", "value"], Ay = ["for"], jy = ["id", "value"], My = { class: "dui-card-actions" }, Ny = /* @__PURE__ */ U({
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
		let n = t, r = os(), i = os();
		function a(e) {
			let t = e.target instanceof HTMLSelectElement ? e.target.value : "auto";
			(t === "Actor" || t === "auto" || t === "Item" || t === "JournalEntry" || t === "JournalEntryPage") && n("updateDocumentType", t);
		}
		function o(e) {
			n("updateDocumentValue", e.target instanceof HTMLInputElement ? e.target.value : "");
		}
		return (t, s) => (K(), q("form", {
			class: "dui-card dui-card-border dui-card-sm",
			onClick: s[2] ||= Ru(() => {}, ["stop"]),
			onSubmit: s[3] ||= Ru((e) => n("submit"), ["prevent"])
		}, [Y("fieldset", Dy, [
			s[6] ||= Y("legend", { class: "dui-fieldset-legend" }, "Manual document entry", -1),
			Y("label", {
				class: "dui-label",
				for: V(r)
			}, "Document type", 8, Oy),
			Y("select", {
				id: V(r),
				class: "dui-select",
				value: e.documentType,
				onChange: a
			}, [...s[4] ||= [ul("<option value=\"auto\">Auto</option><option value=\"Item\">Item</option><option value=\"Actor\">Actor</option><option value=\"JournalEntry\">Journal Entry</option><option value=\"JournalEntryPage\">Journal Page</option>", 5)]], 40, ky),
			Y("label", {
				class: "dui-label",
				for: V(i)
			}, "UUID or drop JSON", 8, Ay),
			Y("input", {
				id: V(i),
				class: "dui-input",
				value: e.documentValue,
				placeholder: "Compendium.package.pack.id",
				type: "text",
				onInput: o
			}, null, 40, jy),
			Y("div", My, [
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
}), Py = ["aria-label", "aria-disabled"], Fy = { key: 0 }, Iy = {
	key: 1,
	class: "dui-alert dui-alert-info",
	role: "status"
}, Ly = { key: 2 }, Ry = {
	key: 4,
	class: "dui-card-actions"
}, zy = ["disabled"], By = /* @__PURE__ */ U({
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
		let n = e, r = Jo(by);
		if (!r) throw Error("DocumentDrop requires a document drop bridge from its application host.");
		let i = Ls(), a = t, o = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B(!1), l = /* @__PURE__ */ B("auto"), u = /* @__PURE__ */ B(""), d, f = $(() => !!i.prompt), p = $(() => !!i.default), m = $(() => n.showPrompt && (f.value || n.title.length > 0)), h = $(() => n.showDocuments ? n.documents : []), g = $(() => n.manualEntryTrigger === "button"), _ = $(() => n.variant === "bare" ? [] : [
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
			s.value = !1, w();
		}
		function ee() {
			if (!n.disabled) {
				if (s.value) {
					S();
					return;
				}
				x();
			}
		}
		function C() {
			if (n.disabled) return;
			let e = r.createDropData({
				documentType: l.value,
				value: u.value
			});
			e && (a("dropData", e), u.value = "", S());
		}
		function te() {
			n.disabled || d || (c.value = !0, d = r.startDocumentPick(ne));
		}
		function w() {
			let e = d;
			d = void 0, c.value = !1, e?.();
		}
		function ne(e) {
			a("dropData", e), S();
		}
		return ws(() => {
			w();
		}), Qo(() => n.disabled, (e) => {
			e && (o.value = !1, S());
		}), (t, n) => (K(), q("div", ml(t.$attrs, {
			class: _.value,
			"aria-label": e.title,
			"aria-disabled": e.disabled,
			role: "group",
			onDragenter: Ru(y, ["prevent"]),
			onDragover: Ru(y, ["prevent"]),
			onDragleave: v,
			onDrop: b
		}), [Y("div", { class: I(e.variant === "bare" ? void 0 : "dui-card-body") }, [
			m.value ? (K(), q("div", {
				key: 0,
				class: I(["dui-alert dui-alert-info", { "dui-alert-outline": !o.value }])
			}, [
				n[3] ||= Y("i", {
					"aria-hidden": "true",
					class: "fa-solid fa-arrow-down"
				}, null, -1),
				Y("div", null, [js(t.$slots, "prompt", {}, () => [Y("strong", null, L(e.title), 1), e.description ? (K(), q("p", Fy, L(e.description), 1)) : Q("", !0)])]),
				Y("span", { class: I(["dui-badge", { "dui-badge-info": o.value }]) }, L(o.value ? "Release to add" : "Drop zone"), 3)
			], 2)) : o.value ? (K(), q("div", Iy, [n[4] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-arrow-down"
			}, null, -1), Y("span", null, "Release to add " + L(e.title.toLowerCase()) + ".", 1)])) : Q("", !0),
			p.value ? (K(), q("div", Ly, [js(t.$slots, "default")])) : Q("", !0),
			e.showDocuments ? (K(), J(Ey, {
				key: 3,
				documents: h.value,
				"empty-label": e.emptyDocumentLabel,
				"is-clickable": e.documentsClickable,
				onDocumentClicked: n[0] ||= (e) => a("documentClicked", e)
			}, null, 8, [
				"documents",
				"empty-label",
				"is-clickable"
			])) : Q("", !0),
			g.value ? (K(), q("div", Ry, [Y("button", {
				class: "dui-btn dui-btn-ghost dui-btn-sm",
				disabled: e.disabled,
				type: "button",
				onClick: Ru(ee, ["stop"])
			}, L(s.value ? "Close Manual Entry" : "Manual Entry"), 9, zy)])) : Q("", !0),
			s.value && !e.disabled ? (K(), J(Ny, {
				key: 5,
				"document-type": l.value,
				"document-value": u.value,
				"is-picking-document": c.value,
				onClose: S,
				onStartPick: te,
				onSubmit: C,
				onUpdateDocumentType: n[1] ||= (e) => l.value = e,
				onUpdateDocumentValue: n[2] ||= (e) => u.value = e
			}, null, 8, [
				"document-type",
				"document-value",
				"is-picking-document"
			])) : Q("", !0)
		], 2)], 16, Py));
	}
});
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp/errors.ts
function Vy(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderMountTab/CombinedProfilePreview.vue?vue&type=script&setup=true&lang.ts
var Hy = { class: "app:max-w-full app:overflow-x-auto" }, Uy = { class: "dui-table dui-table-sm" }, Wy = { class: "dui-alert" }, Gy = { class: "app:flex app:flex-wrap app:gap-2" }, Ky = { key: 0 }, qy = {
	key: 1,
	class: "app:grid app:gap-2"
}, Jy = /* @__PURE__ */ U({
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
				mount: uy[t.mount.size],
				result: uy[t.plan.size],
				rider: uy[t.rider.size],
				rule: "Larger"
			}
		]);
		function a(e) {
			return e.fixedDamage === null ? e.outputName : `${e.outputName} (fixed Damage ${e.fixedDamage})`;
		}
		return (t, o) => (K(), q(G, null, [X(gh, {
			description: "This preview uses the Actors' current prepared values. The build recalculates after applying the rider's Career advances.",
			number: "2",
			title: "Combined Profile Preview"
		}, {
			default: H(() => [Y("div", Hy, [Y("table", Uy, [o[0] ||= Y("thead", null, [Y("tr", null, [
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
			]))), 128))])])]), Y("p", Wy, " Charge attacks gain +" + L(e.plan.chargeStrengthBonus) + " Damage from the mount's Strength Bonus. The combined profile also gains at least Armour (1). ", 1)]),
			_: 1
		}), X(gh, {
			description: "Mount attack damage is frozen before the traits are copied to the rider.",
			number: "3",
			title: "Mount Traits"
		}, {
			default: H(() => [
				Y("div", Gy, [(K(!0), q(G, null, W(n.value, (e) => (K(), q("span", {
					key: e.sourceUuid,
					class: "dui-badge dui-badge-sm"
				}, L(a(e)), 1))), 128))]),
				n.value.length ? Q("", !0) : (K(), q("p", Ky, "The mount contributes no traits.")),
				r.value.length ? (K(), q("div", qy, [o[1] ||= Y("p", null, [Y("strong", null, "Removed or consolidated")], -1), (K(!0), q(G, null, W(r.value, (e) => (K(), q("p", {
					key: e.sourceUuid,
					class: "dui-alert dui-alert-warning"
				}, [Y("strong", null, L(e.name) + ":", 1), Z(" " + L(e.reason), 1)]))), 128))])) : Q("", !0)
			]),
			_: 1
		})], 64));
	}
}), Yy = { class: "app:grid app:gap-3" }, Xy = { class: "app:grid app:gap-3 md:app:grid-cols-2" }, Zy = { class: "dui-fieldset" }, Qy = ["for"], $y = ["id"], eb = { class: "dui-fieldset" }, tb = ["for"], nb = [
	"id",
	"disabled",
	"value"
], rb = ["value"], ib = {
	key: 0,
	class: "dui-card-actions"
}, ab = {
	key: 1,
	class: "dui-alert dui-alert-warning"
}, ob = {
	key: 2,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, sb = {
	key: 3,
	"aria-live": "polite",
	class: "dui-alert",
	role: "status"
}, cb = {
	key: 4,
	class: "dui-alert"
}, lb = {
	key: 0,
	class: "dui-avatar"
}, ub = { class: "app:size-16 app:shrink-0 app:rounded-lg" }, db = ["src"], fb = /* @__PURE__ */ U({
	__name: "NpcBuilderMountTab",
	props: { bridge: {} },
	setup(e) {
		let t = e, n = Nm(), { baseActorCombatProfile: r, mountActorProfile: i, mountActors: a, selectedBaseActorUuid: o, selectedMountActorUuid: s } = Ed(n), c = /* @__PURE__ */ B(""), l = /* @__PURE__ */ B(""), u = /* @__PURE__ */ B(!1), d = os(), f = 0, p = $(() => {
			let e = c.value.trim().toLocaleLowerCase();
			return a.value.filter((t) => t.uuid !== o.value && (!e || t.name.toLocaleLowerCase().includes(e)));
		}), m = $(() => a.value.find((e) => e.uuid === s.value) ?? null), h = $(() => !r.value || !i.value ? null : dy(r.value, i.value));
		Qo(s, async (e) => {
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
				r === f && (n.hydrateMountActorProfile(null), l.value = Vy(e));
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
				l.value = Vy(e);
			}
		}
		return (e, t) => (K(), q("div", Yy, [
			t[5] ||= Y("p", { class: "dui-alert dui-alert-info" }, " Mounts are optional. A selected mount is folded into one simplified NPC profile during build. ", -1),
			X(gh, {
				description: "Choose any world Actor as the mount. This selection does not create a live WFRP mount relationship.",
				number: "1",
				title: "Mount Actor"
			}, {
				default: H(() => [
					Y("div", Xy, [Y("fieldset", Zy, [
						t[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "Search mounts", -1),
						Y("label", {
							class: "dui-label",
							for: `${V(d)}-filter`
						}, "Actor name", 8, Qy),
						Go(Y("input", {
							id: `${V(d)}-filter`,
							"onUpdate:modelValue": t[0] ||= (e) => c.value = e,
							"aria-label": "Filter mount actors by name",
							class: "dui-input dui-input-sm",
							placeholder: "Filter world actors",
							type: "search"
						}, null, 8, $y), [[ku, c.value]])
					]), Y("fieldset", eb, [
						t[4] ||= Y("legend", { class: "dui-fieldset-legend" }, "Selected mount", -1),
						Y("label", {
							class: "dui-label",
							for: `${V(d)}-mount`
						}, "Mount statblock", 8, tb),
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
						}, L(e.name), 9, rb))), 128))], 40, nb)
					])]),
					X(By, {
						disabled: !V(o),
						description: "Drop a world Actor to use as the mount.",
						title: "Drop Mount Actor",
						variant: "compact",
						onDropData: _
					}, null, 8, ["disabled"]),
					V(s) ? (K(), q("div", ib, [Y("button", {
						class: "dui-btn dui-btn-ghost dui-btn-sm",
						type: "button",
						onClick: t[1] ||= (...e) => V(n).clearMountSelection && V(n).clearMountSelection(...e)
					}, " Clear Mount ")])) : Q("", !0),
					V(o) ? l.value ? (K(), q("p", ob, L(l.value), 1)) : u.value ? (K(), q("p", sb, " Loading mount profile... ")) : m.value && V(i) ? (K(), q("article", cb, [m.value.img ? (K(), q("div", lb, [Y("div", ub, [Y("img", {
						src: m.value.img,
						alt: "",
						class: "app:h-full app:w-full app:object-cover",
						height: "64",
						width: "64"
					}, null, 8, db)])])) : Q("", !0), Y("div", null, [Y("strong", null, L(m.value.name), 1), Y("span", null, " Movement " + L(V(i).movement) + " | Wounds " + L(V(i).wounds) + " | " + L(V(uy)[V(i).size]), 1)])])) : Q("", !0) : (K(), q("p", ab, " Choose the rider on the Build tab before selecting a mount. "))
				]),
				_: 1
			}),
			h.value && V(r) && V(i) ? (K(), J(Jy, {
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
//#region src/functions/npc-builder/settings/portrait-search-status.ts
function pb(e) {
	return e ? e.digDownActive ? e.digDownDeepFileSearchEnabled ? e.digDownCacheReady ? `Dig Down cache ready with ${e.digDownIndexedFileCount} indexed files.` : "Dig Down is active; its file cache is still building or unavailable." : "Dig Down is active, but its Deep File Search setting is disabled." : "Install and enable Dig Down to search local files for portrait suggestions." : "Checking Dig Down integration.";
}
//#endregion
//#region src/functions/npc-builder/settings/settings-payload.ts
function mb(e) {
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
function hb(e) {
	let t = Nm(), { actorFolders: n, itemFolders: r, settings: i } = Ed(t), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(""), s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B(""), l = /* @__PURE__ */ B(null), u = /* @__PURE__ */ B(""), d = /* @__PURE__ */ B(""), f = $(() => l.value?.digDownActive ?? !0), p = $(() => pb(l.value));
	Qo(l, (e) => {
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
		await C(async () => {
			let r = await n.ensureFolder(n.name);
			await n.refresh(), n.setFolderUuid(r.uuid), t.hydrateSettings(await e.saveSettings(w())), d.value = `Using folder "${r.name}".`;
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
		await C(async () => {
			t.hydrateSettings(await e.saveSettings(w())), t.hydrateQuickTraits(await e.importRecommendedQuickTraits(i.value)), d.value = "Recommended quick traits imported.";
		});
	}
	async function S() {
		await C(async () => {
			t.hydrateSettings(await e.saveSettings(w())), await te(), d.value = "Settings saved.";
		});
	}
	async function ee() {
		await C(async () => {
			t.hydrateSettings(await e.saveSettings(Mp())), await te(), d.value = "Settings reset to defaults.";
		});
	}
	async function C(e) {
		s.value = !0, o.value = "", d.value = "";
		try {
			await e();
		} catch (e) {
			o.value = gb(e);
		} finally {
			s.value = !1;
		}
	}
	async function te() {
		let [n, r] = await Promise.all([e.listBaseActors(i.value), e.listQuickTraits(i.value)]);
		t.hydrateBaseActors(n), t.hydrateQuickTraits(r);
	}
	function w() {
		return mb({
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
		resetSettingsToDefaults: ee,
		saveBaseActorFolderName: m,
		saveOutputActorFolderName: h,
		saveQuickTraitFolderName: g,
		saveSettings: S,
		settings: i,
		settingsMessage: d
	};
}
function gb(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderSettingsTab/FolderSetting.vue?vue&type=script&setup=true&lang.ts
var _b = { class: "dui-fieldset" }, vb = { class: "dui-fieldset-legend" }, yb = ["aria-label", "value"], bb = { value: "" }, xb = ["value"], Sb = { class: "dui-fieldset" }, Cb = ["aria-label", "value"], wb = { class: "dui-card-actions" }, Tb = ["disabled"], Eb = /* @__PURE__ */ U({
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
			Y("fieldset", _b, [Y("legend", vb, L(e.folderLabel), 1), Y("select", {
				"aria-label": e.folderLabel,
				class: "dui-select dui-select-sm",
				value: e.selectedUuid,
				onChange: r
			}, [Y("option", bb, L(e.defaultOptionLabel), 1), (K(!0), q(G, null, W(e.folders, (e) => (K(), q("option", {
				key: e.uuid,
				value: e.uuid
			}, L(e.name), 9, xb))), 128))], 40, yb)]),
			Y("fieldset", Sb, [a[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Create or use by name", -1), Y("input", {
				"aria-label": `Create or use ${e.folderLabel} by name`,
				class: "dui-input dui-input-sm",
				value: e.createName,
				placeholder: "Folder name",
				type: "text",
				onInput: i
			}, null, 40, Cb)]),
			Y("div", wb, [Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.disabled || !e.createName.trim(),
				type: "button",
				onClick: a[0] ||= (e) => n("saveFolderName")
			}, L(e.buttonLabel ?? "Save Folder"), 9, Tb)])
		]));
	}
}), Db = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(gh, {
			description: "Limit the source picker or choose where generated Actors are stored.",
			number: "1",
			title: "Actor Sources"
		}, {
			default: H(() => [X(Eb, {
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
			]), X(Eb, {
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
}), Ob = {
	key: 0,
	class: "dui-label"
}, kb = ["checked"], Ab = {
	key: 1,
	class: "dui-label"
}, jb = ["checked"], Mb = {
	key: 2,
	class: "dui-label"
}, Nb = ["checked"], Pb = {
	key: 3,
	class: "dui-label"
}, Fb = ["checked"], Ib = {
	key: 4,
	class: "dui-label"
}, Lb = ["checked"], Rb = /* @__PURE__ */ U({
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
		return (t, i) => (K(), J(gh, {
			description: "Choose which base-only data is included in the editable draft.",
			title: "Base Actor Features"
		}, {
			default: H(() => [
				e.showAdvancementFeatures === !1 ? Q("", !0) : (K(), q("label", Ob, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowCharacteristics,
					type: "checkbox",
					onChange: i[0] ||= (e) => n("allowCharacteristicsChange", r(e))
				}, null, 40, kb), i[5] ||= Y("span", null, "Show base actor characteristics", -1)])),
				e.showAdvancementFeatures === !1 ? Q("", !0) : (K(), q("label", Ab, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowSkills,
					type: "checkbox",
					onChange: i[1] ||= (e) => n("allowSkillsChange", r(e))
				}, null, 40, jb), i[6] ||= Y("span", null, "Show base actor skills", -1)])),
				e.showAdvancementFeatures === !1 ? Q("", !0) : (K(), q("label", Mb, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTalents,
					type: "checkbox",
					onChange: i[2] ||= (e) => n("allowTalentsChange", r(e))
				}, null, 40, Nb), i[7] ||= Y("span", null, "Show base actor talents", -1)])),
				e.showTrappingFeature ? (K(), q("label", Pb, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTrappings,
					type: "checkbox",
					onChange: i[3] ||= (e) => n("allowTrappingsChange", r(e))
				}, null, 40, Fb), i[8] ||= Y("span", null, "Show base actor trappings", -1)])) : Q("", !0),
				e.showTraitFeature === !1 ? Q("", !0) : (K(), q("label", Ib, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTraits,
					type: "checkbox",
					onChange: i[4] ||= (e) => n("allowTraitsChange", r(e))
				}, null, 40, Lb), i[9] ||= Y("span", null, "Show base actor traits", -1)]))
			]),
			_: 1
		}));
	}
}), zb = { class: "dui-label" }, Bb = ["checked"], Vb = /* @__PURE__ */ U({
	__name: "MagicSpellSettings",
	props: { autoSelectGrantedSpells: { type: Boolean } },
	emits: ["autoSelectGrantedSpellsChange"],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("autoSelectGrantedSpellsChange", !!t?.checked);
		}
		return (t, n) => (K(), J(gh, {
			number: "6",
			title: "Magic and Spells"
		}, {
			default: H(() => [Y("label", zb, [Y("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.autoSelectGrantedSpells,
				type: "checkbox",
				onChange: r
			}, null, 40, Bb), n[0] ||= Y("span", null, "Select detected Lore spells by default", -1)])]),
			_: 1
		}));
	}
}), Hb = { class: "dui-label" }, Ub = ["checked"], Wb = /* @__PURE__ */ U({
	__name: "NamingSettings",
	props: { includeSpeciesInName: { type: Boolean } },
	emits: ["includeSpeciesInNameChange"],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("includeSpeciesInNameChange", !!t?.checked);
		}
		return (t, n) => (K(), J(gh, {
			number: "3",
			title: "Default Naming"
		}, {
			default: H(() => [Y("label", Hb, [Y("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.includeSpeciesInName,
				type: "checkbox",
				onChange: r
			}, null, 40, Ub), n[0] ||= Y("span", null, "Include species in suggested names", -1)])]),
			_: 1
		}));
	}
}), Gb = { class: "dui-fieldset" }, Kb = ["value"], qb = { class: "dui-label" }, Jb = ["checked"], Yb = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(gh, { title: "Career Resolution" }, {
			default: H(() => [Y("fieldset", Gb, [n[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Lower career handling", -1), Y("select", {
				"aria-label": "Lower career handling",
				class: "dui-select dui-select-sm",
				value: e.lowerCareerMode,
				onChange: r
			}, [...n[0] ||= [
				Y("option", { value: "prompt" }, "Prompt when candidates are found", -1),
				Y("option", { value: "auto-add-all" }, "Automatically add all lower-tier matches", -1),
				Y("option", { value: "never" }, "Only add dropped careers", -1)
			]], 40, Kb)]), Y("label", qb, [Y("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.askForLinkedSkillSpecializations,
				type: "checkbox",
				onChange: i
			}, null, 40, Jb), n[2] ||= Y("span", null, "Resolve linked career skill repeats separately", -1)])]),
			_: 1
		}));
	}
}), Xb = { class: "app:grid app:gap-1" }, Zb = ["value"], Qb = { class: "dui-label" }, $b = ["checked"], ex = { class: "app:grid app:gap-1" }, tx = ["value"], nx = { class: "dui-label" }, rx = ["checked", "disabled"], ix = {
	"aria-live": "polite",
	class: "dui-alert",
	role: "status"
}, ax = { class: "dui-label" }, ox = ["checked"], sx = { class: "dui-label" }, cx = ["checked"], lx = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(gh, {
			description: "Choose which local Foundry sources can suggest portraits.",
			number: "4",
			title: "Portrait Suggestions"
		}, {
			default: H(() => [
				Y("label", Xb, [
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
					}, null, 40, Zb),
					n[1] ||= Y("small", { id: "portrait-priority-folders-help" }, " One Foundry data path per line. These appear first, ahead of compendiums, world documents, and Dig Down results. ", -1)
				]),
				Y("label", Qb, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.excludeFullyTransparentPortraitAssets,
					type: "checkbox",
					onChange: r
				}, null, 40, $b), n[2] ||= Y("span", null, "Hide fully empty or transparent images", -1)]),
				Y("label", ex, [
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
					}, null, 40, tx),
					n[4] ||= Y("small", { id: "portrait-excluded-references-help" }, " One image path per line. Each listed image and its visual duplicates are hidden. Broken images are always hidden. ", -1)
				]),
				Y("label", nx, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchFoundryPortraitAssets,
					disabled: !e.canUseDigDownPortraitSearch,
					type: "checkbox",
					onChange: o
				}, null, 40, rx), n[5] ||= Y("span", null, "Search Dig Down's file cache for portrait suggestions", -1)]),
				Y("p", ix, L(e.statusLabel), 1),
				Y("label", ax, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchCompendiumPortraitAssets,
					type: "checkbox",
					onChange: s
				}, null, 40, ox), n[6] ||= Y("span", null, "Search Actor and Item compendiums for portrait suggestions", -1)]),
				Y("label", sx, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchWebPortraitAssets,
					disabled: "",
					type: "checkbox"
				}, null, 8, cx), n[7] ||= Y("span", null, "Search the web for portrait suggestions (later)", -1)])
			]),
			_: 1
		}));
	}
}), ux = { class: "dui-card-actions" }, dx = ["disabled"], fx = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(gh, {
			description: "Items in this folder become one-click Trait choices on the Build tab.",
			number: "2",
			title: "Quick Traits"
		}, {
			default: H(() => [X(Eb, {
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
			]), Y("div", ux, [Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.isBusy || !e.quickTraitFolderUuid,
				type: "button",
				onClick: r[3] ||= (e) => n("importRecommendedQuickTraits")
			}, " Import Recommended Quick Traits ", 8, dx)])]),
			_: 1
		}));
	}
}), px = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, mx = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, hx = /* @__PURE__ */ U({
	__name: "SettingsMessages",
	props: {
		errorMessage: {},
		settingsMessage: {}
	},
	setup(e) {
		return (t, n) => e.errorMessage ? (K(), q("p", px, L(e.errorMessage), 1)) : e.settingsMessage ? (K(), q("p", mx, L(e.settingsMessage), 1)) : Q("", !0);
	}
}), gx = { class: "app:grid app:gap-3" }, _x = { class: "app:grid app:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] app:gap-3" }, vx = { class: "dui-card-actions" }, yx = ["disabled"], bx = ["disabled"], xx = /* @__PURE__ */ U({
	__name: "NpcBuilderSettingsTab",
	props: {
		bridge: {},
		page: {}
	},
	setup(e) {
		let { actorFolders: t, baseActorFolderName: n, canUseDigDownPortraitSearch: r, errorMessage: i, importRecommendedQuickTraits: a, isBusy: o, itemFolders: s, outputActorFolderName: c, portraitSearchStatusLabel: l, quickTraitFolderName: u, refreshPortraitSearchAvailability: d, resetSettingsToDefaults: f, saveBaseActorFolderName: p, saveOutputActorFolderName: m, saveQuickTraitFolderName: h, saveSettings: g, settings: _, settingsMessage: v } = hb(e.bridge);
		return xs(() => {
			d();
		}), (d, y) => (K(), q("section", gx, [
			X(hx, {
				"error-message": V(i),
				"settings-message": V(v)
			}, null, 8, ["error-message", "settings-message"]),
			Y("div", _x, [
				e.page === "settings-folders" ? (K(), J(Db, {
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
				e.page === "settings-folders" ? (K(), J(fx, {
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
				e.page === "settings-suggestions" ? (K(), J(Wb, {
					key: 2,
					"include-species-in-name": V(_).includeSpeciesInName,
					onIncludeSpeciesInNameChange: y[6] ||= (e) => V(_).includeSpeciesInName = e
				}, null, 8, ["include-species-in-name"])) : Q("", !0),
				e.page === "settings-suggestions" ? (K(), J(lx, {
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
				e.page === "settings-advancement" ? (K(), J(Rb, {
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
				e.page === "settings-resolution" ? (K(), J(Vb, {
					key: 5,
					"auto-select-granted-spells": V(_).autoSelectGrantedSpells,
					onAutoSelectGrantedSpellsChange: y[17] ||= (e) => V(_).autoSelectGrantedSpells = e
				}, null, 8, ["auto-select-granted-spells"])) : Q("", !0),
				e.page === "settings-resolution" ? (K(), J(Rb, {
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
				e.page === "settings-resolution" ? (K(), J(Yb, {
					key: 7,
					class: "app:col-span-full",
					"ask-for-linked-skill-specializations": V(_).askForLinkedSkillSpecializations,
					"lower-career-mode": V(_).lowerCareerMode,
					onAskForLinkedSkillSpecializationsChange: y[23] ||= (e) => V(_).askForLinkedSkillSpecializations = e,
					onLowerCareerModeChange: y[24] ||= (e) => V(_).lowerCareerMode = e
				}, null, 8, ["ask-for-linked-skill-specializations", "lower-career-mode"])) : Q("", !0)
			]),
			Y("div", vx, [Y("button", {
				class: "dui-btn dui-btn-primary dui-btn-sm",
				disabled: V(o),
				type: "button",
				onClick: y[25] ||= (...e) => V(g) && V(g)(...e)
			}, " Save Settings ", 8, yx), Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: V(o),
				type: "button",
				onClick: y[26] ||= (...e) => V(f) && V(f)(...e)
			}, " Reset to Defaults ", 8, bx)])
		]));
	}
});
//#endregion
//#region src/functions/npc-builder/magic-lore-resolution.ts
function Sx(e) {
	return e.map((e) => `${e.kind}:${e.sourceName}:${e.rawLore}`).sort().join("|");
}
function Cx(e) {
	return e.filter((e) => e.isAmbiguous);
}
function wx(e, t) {
	return { rows: Cx(e).map((e) => ({
		grantLabel: Ex(e),
		options: Up(e, t),
		rawLore: e.rawLore,
		resolutionKey: e.resolutionKey,
		selectedLore: "",
		sourceLabel: Dx(e)
	})) };
}
function Tx(e) {
	return e.kind === "arcane-magic" ? "Arcane Magic" : e.kind === "petty-magic" ? "Petty Magic" : "Spellcaster";
}
function Ex(e) {
	return `${Tx(e)} from ${e.sourceName}`;
}
function Dx(e) {
	return e.source === "talent" ? "Talent" : "Trait";
}
//#endregion
//#region src/state/npc-builder/workflows/spells-workflow.ts
function Ox(e) {
	let t = Nm(), { magicGrants: n, spells: r, selectedSpells: i } = Ed(t), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B([]), l = /* @__PURE__ */ B(null), u = 0, d = $(() => Cx(n.value)), f = $(() => n.value.length - d.value.length);
	Qo(() => Sx(n.value), () => {
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
			u === r && (a.value = kx(e));
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
				a.value = kx(e);
			} finally {
				o.value = !1;
			}
		}
	}
	async function g() {
		a.value = "", await h(), l.value = wx(n.value, c.value);
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
			a.value = kx(e);
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
function kx(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that spell action.";
}
//#endregion
//#region src/view/apps/npc-builder/components/MagicLoreResolutionPromptContent.vue?vue&type=script&setup=true&lang.ts
var Ax = { class: "dui-card-body" }, jx = { class: "dui-card-title" }, Mx = { class: "dui-fieldset" }, Nx = ["onUpdate:modelValue", "aria-label"], Px = ["value"], Fx = { class: "dui-card-actions" }, Ix = /* @__PURE__ */ U({
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
			}, [Y("div", Ax, [
				Y("h3", jx, L(e.grantLabel), 1),
				Y("span", null, L(e.sourceLabel) + " - " + L(e.rawLore || "Any Lore"), 1),
				Y("fieldset", Mx, [r[3] ||= Y("legend", { class: "dui-fieldset-legend" }, "Lore", -1), Go(Y("select", {
					"onUpdate:modelValue": (t) => e.selectedLore = t,
					"aria-label": `Lore for ${e.grantLabel}`,
					class: "dui-select dui-select-sm"
				}, [r[2] ||= Y("option", { value: "" }, "Leave unresolved", -1), (K(!0), q(G, null, W(e.options, (e) => (K(), q("option", {
					key: e.key,
					value: e.value
				}, L(e.label) + L(e.wind && e.wind !== "None" ? ` (${e.wind})` : ""), 9, Px))), 128))], 8, Nx), [[Mu, e.selectedLore]])])
			])]))), 128)),
			Y("div", Fx, [Y("button", {
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
}), Lx = {
	key: 0,
	class: "dui-alert"
}, Rx = {
	key: 1,
	class: "dui-list"
}, zx = { class: "dui-list-col-grow" }, Bx = { key: 0 }, Vx = { key: 1 }, Hx = {
	key: 2,
	class: "dui-card-actions"
}, Ux = ["disabled"], Wx = /* @__PURE__ */ U({
	__name: "MagicAccessPanel",
	props: {
		ambiguousGrantCount: {},
		isLoadingLoreOptions: { type: Boolean },
		magicGrants: {}
	},
	emits: ["resolveLores"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (K(), J(gh, {
			description: "Magic Talents and Traits determine which spell Lores are available.",
			number: "1",
			title: "Magic Access"
		}, {
			default: H(() => [e.magicGrants.length ? (K(), q("ul", Rx, [(K(!0), q(G, null, W(e.magicGrants, (e) => (K(), q("li", {
				key: `${e.source}:${e.sourceName}:${e.rawLore}`,
				class: "dui-list-row"
			}, [Y("div", zx, [
				Y("strong", null, L(V(Tx)(e)), 1),
				Y("span", null, L(V(Dx)(e)) + " - " + L(e.sourceName), 1),
				e.isAmbiguous ? (K(), q("small", Bx, " Needs Lore resolution before automatic spells can be found. ")) : (K(), q("small", Vx, " Lore: " + L(e.rawLore || e.normalizedLore), 1))
			])]))), 128))])) : (K(), q("p", Lx, " No magic-enabling Talent or Trait is selected. ")), e.ambiguousGrantCount ? (K(), q("div", Hx, [Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.isLoadingLoreOptions,
				type: "button",
				onClick: r[0] ||= (e) => n("resolveLores")
			}, L(e.isLoadingLoreOptions ? "Loading Lores..." : "Resolve Lores"), 9, Ux)])) : Q("", !0)]),
			_: 1
		}));
	}
});
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderSpellsTab/labels.ts
function Gx(e) {
	return e.source === "custom" ? "Dropped" : e.sourceLabel;
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderSpellsTab/SpellSelectionPanel.vue?vue&type=script&setup=true&lang.ts
var Kx = { class: "dui-card-actions" }, qx = ["disabled"], Jx = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, Yx = {
	key: 1,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, Xx = {
	key: 2,
	class: "dui-list"
}, Zx = [
	"aria-label",
	"checked",
	"onChange"
], Qx = { class: "dui-list-col-grow" }, $x = {
	key: 0,
	class: "dui-avatar"
}, eS = ["src"], tS = ["onClick"], nS = {
	key: 3,
	class: "dui-alert"
}, rS = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(gh, {
			description: "Select detected Lore spells or drop specific Spell Items.",
			number: "2",
			title: "Spells"
		}, {
			default: H(() => [
				X(By, {
					description: "Add a specific Spell item regardless of detected Lores.",
					title: "Drop Spell Items",
					onDropData: r[0] ||= (e) => n("spellDrop", e)
				}),
				Y("div", Kx, [Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: e.isLoadingSpells || !e.resolvedGrantCount,
					type: "button",
					onClick: r[1] ||= (e) => n("refreshSpells")
				}, L(e.isLoadingSpells ? "Finding spells..." : "Refresh Spells"), 9, qx), Y("span", null, L(e.selectedSpellCount) + " selected / " + L(e.spells.length) + " found", 1)]),
				e.errorMessage ? (K(), q("p", Jx, L(e.errorMessage), 1)) : Q("", !0),
				e.ambiguousGrantCount ? (K(), q("p", Yx, L(e.ambiguousGrantCount) + " magic grant" + L(e.ambiguousGrantCount === 1 ? "" : "s") + " still need Lore resolution. You can still drop specific spells for now. ", 1)) : Q("", !0),
				e.spells.length ? (K(), q("ul", Xx, [(K(!0), q(G, null, W(e.spells, (e) => (K(), q("li", {
					key: e.key,
					class: "dui-list-row"
				}, [
					Y("input", {
						"aria-label": `Use ${e.name}`,
						class: "dui-checkbox dui-checkbox-sm",
						checked: e.selected,
						type: "checkbox",
						onChange: (t) => n("spellSelectedChange", e, t)
					}, null, 40, Zx),
					Y("div", Qx, [
						e.img ? (K(), q("div", $x, [Y("div", null, [Y("img", {
							src: e.img,
							alt: ""
						}, null, 8, eS)])])) : Q("", !0),
						Y("strong", null, L(e.name), 1),
						Y("span", null, L(e.loreName || "Unknown Lore") + " · " + L(V(Gx)(e)), 1)
					]),
					e.source === "custom" ? (K(), q("button", {
						key: 0,
						class: "dui-btn dui-btn-sm",
						type: "button",
						onClick: (t) => n("removeCustomSpell", e.key)
					}, " Remove ", 8, tS)) : Q("", !0)
				]))), 128))])) : (K(), q("p", nS, " No matching spells found yet. Drop specific spells here, or resolve a non-ambiguous magic Lore. "))
			]),
			_: 1
		}));
	}
}), iS = /* @__PURE__ */ U({
	__name: "NpcBuilderSpellsTab",
	props: { bridge: {} },
	setup(e) {
		let { ambiguousGrants: t, confirmMagicLorePrompt: n, dismissMagicLorePrompt: r, errorMessage: i, handleSpellDrop: a, initialize: o, isLoadingLoreOptions: s, isLoadingSpells: c, loadDetectedSpells: l, magicGrants: u, openMagicLorePrompt: d, pendingMagicLorePrompt: f, removeCustomSpell: p, resolvedGrantCount: m, selectedSpells: h, setSpellSelected: g, spells: _ } = Ox(e.bridge);
		xs(() => {
			o();
		});
		function v(e, t) {
			let n = t.target;
			n && g(e.key, n.checked);
		}
		return (e, o) => (K(), q("section", null, [
			X(Vm, {
				open: V(f) !== null,
				title: "Resolve Magic Lores",
				onClose: V(r)
			}, {
				default: H(() => [V(f) ? (K(), J(Ix, {
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
			X(Wx, {
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
			X(rS, {
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
}), aS = { class: "dui-collapse-title" }, oS = { class: "dui-badge" }, sS = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, cS = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, lS = { class: "dui-collapse-content" }, uS = { class: "dui-fieldset" }, dS = { class: "dui-fieldset-legend" }, fS = [
	"aria-label",
	"value",
	"onInput"
], pS = {
	key: 0,
	class: "dui-fieldset"
}, mS = [
	"aria-label",
	"value",
	"onChange"
], hS = ["value"], gS = {
	key: 1,
	class: "dui-fieldset"
}, _S = [
	"aria-label",
	"value",
	"onInput"
], vS = ["onClick"], yS = {
	key: 0,
	class: "dui-alert"
}, bS = /* @__PURE__ */ U({
	__name: "NpcBuilderTraitsTab",
	props: { difficultyOptions: {} },
	setup(e) {
		let t = Nm(), { traits: n } = Ed(t);
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
		return (t, o) => (K(), J(gh, {
			description: "Open a Trait to review its WFRP configuration before building.",
			title: "Traits"
		}, {
			default: H(() => [(K(!0), q(G, null, W(V(n), (t) => (K(), q("details", {
				key: t.key,
				class: "dui-collapse dui-collapse-arrow dui-card-border"
			}, [Y("summary", aS, [
				Y("strong", null, L(t.name), 1),
				Y("span", oS, L(r(t)), 1),
				t.config.rollable ? (K(), q("span", sS, "Rollable")) : Q("", !0),
				t.config.damage ? (K(), q("span", cS, "Damage")) : Q("", !0)
			]), Y("div", lS, [
				Y("fieldset", uS, [Y("legend", dS, L(t.config.damage ? "Damage" : "Specification"), 1), Y("input", {
					"aria-label": `${t.config.damage ? "Damage" : "Specification"} for ${t.name}`,
					class: "dui-input dui-input-sm",
					value: t.config.specification,
					placeholder: "None",
					type: "text",
					onInput: (e) => a(t, "specification", e)
				}, null, 40, fS)]),
				t.config.rollable && !t.config.damage ? (K(), q("fieldset", pS, [o[0] ||= Y("legend", { class: "dui-fieldset-legend" }, "Difficulty", -1), Y("select", {
					"aria-label": `Difficulty for ${t.name}`,
					class: "dui-select dui-select-sm",
					value: t.config.defaultDifficulty,
					onChange: (e) => a(t, "defaultDifficulty", e)
				}, [(K(!0), q(G, null, W(e.difficultyOptions, (e) => (K(), q("option", {
					key: e.value,
					value: e.value
				}, L(e.label), 9, hS))), 128))], 40, mS)])) : Q("", !0),
				t.config.damage && t.config.dice ? (K(), q("fieldset", gS, [o[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Dice", -1), Y("input", {
					"aria-label": `Dice for ${t.name}`,
					class: "dui-input dui-input-sm",
					value: t.config.dice,
					placeholder: "Optional",
					type: "text",
					onInput: (e) => a(t, "dice", e)
				}, null, 40, _S)])) : Q("", !0),
				Y("button", {
					class: "dui-btn dui-btn-sm",
					type: "button",
					onClick: (e) => i(t)
				}, "Remove", 8, vS)
			])]))), 128)), V(n).length ? Q("", !0) : (K(), q("p", yS, "No traits are selected yet."))]),
			_: 1
		}));
	}
}), xS = "__blank-item__";
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderTrappingsTab/resolution-labels.ts
function SS(e) {
	return e.source === "base" ? "Base" : e.source === "career" ? "Career" : "Custom";
}
function CS(e) {
	return e.resolution.status === "matched" ? `Matched ${e.resolution.selectedName}` : e.resolution.status === "fallback" ? `Blank ${e.resolution.selectedName || e.name}` : e.resolution.candidates.length ? "Choose a match" : "Needs resolution";
}
function wS(e) {
	return e.ignored ? "Ignored" : e.resolution.status === "matched" ? "Matched" : e.resolution.status === "fallback" ? "Blank item" : e.resolution.status === "ambiguous" || e.resolution.candidates.length ? "Choose" : "Needs resolution";
}
function TS(e) {
	let t = "dui-badge";
	return e.ignored ? [t, "dui-badge-ghost"] : e.resolution.status === "matched" ? [t, "dui-badge-success"] : e.resolution.status === "fallback" ? [t, "dui-badge-info"] : e.resolution.status === "ambiguous" || e.resolution.candidates.length ? [t, "dui-badge-warning"] : [t, "dui-badge-error"];
}
function ES(e) {
	return e.resolution.status === "fallback" ? xS : e.resolution.selectedCandidateUuid;
}
function DS(e) {
	return e.source === "career";
}
function OS(e) {
	return e.resolution.candidates.length > 0 || DS(e);
}
function kS(e) {
	return e.resolution.searchTerms.length <= 1 ? "" : `Options: ${e.resolution.searchTerms.join(" / ")}`;
}
//#endregion
//#region src/view/apps/npc-builder/components/NpcBuilderTrappingsTab/TrappingsTable.vue?vue&type=script&setup=true&lang.ts
var AS = {
	key: 0,
	class: "dui-list"
}, jS = [
	"aria-label",
	"checked",
	"onChange"
], MS = { class: "dui-list-col-grow app:grid app:gap-2" }, NS = { key: 0 }, PS = {
	key: 1,
	class: "dui-fieldset"
}, FS = [
	"aria-label",
	"value",
	"onChange"
], IS = {
	key: 0,
	value: ""
}, LS = ["value"], RS = ["value"], zS = { key: 2 }, BS = { class: "dui-card-actions" }, VS = { class: "dui-fieldset" }, HS = [
	"aria-label",
	"value",
	"onInput"
], US = ["onClick"], WS = {
	key: 1,
	class: "dui-alert"
}, GS = /* @__PURE__ */ U({
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
		return (t, r) => e.trappings.length ? (K(), q("ul", AS, [(K(!0), q(G, null, W(e.trappings, (e) => (K(), q("li", {
			key: e.key,
			class: "dui-list-row"
		}, [Y("input", {
			"aria-label": `Use ${e.name}`,
			class: "dui-checkbox dui-checkbox-sm",
			checked: !e.ignored,
			type: "checkbox",
			onChange: (t) => n("useChange", e.key, t)
		}, null, 40, jS), Y("div", MS, [
			Y("strong", null, L(e.name), 1),
			Y("span", null, L(e.resolution.selectedItemType || e.itemType || "trapping") + " · " + L(V(SS)(e)), 1),
			V(kS)(e) ? (K(), q("span", NS, L(V(kS)(e)), 1)) : Q("", !0),
			Y("span", { class: I(V(TS)(e)) }, L(V(wS)(e)), 3),
			V(OS)(e) ? (K(), q("fieldset", PS, [r[0] ||= Y("legend", { class: "dui-fieldset-legend" }, "Resolution", -1), Y("select", {
				"aria-label": `Resolution for ${e.name}`,
				class: "dui-select dui-select-sm",
				value: V(ES)(e),
				onChange: (t) => n("resolutionChange", e.key, t)
			}, [
				e.resolution.candidates.length ? (K(), q("option", IS, "Choose match")) : Q("", !0),
				(K(!0), q(G, null, W(e.resolution.candidates, (e) => (K(), q("option", {
					key: e.uuid,
					value: e.uuid
				}, L(e.name) + " (" + L(e.sourceLabel) + ") ", 9, LS))), 128)),
				V(DS)(e) ? (K(), q("option", {
					key: 1,
					value: V(xS)
				}, " Blank Item ", 8, RS)) : Q("", !0)
			], 40, FS)])) : (K(), q("span", zS, L(V(CS)(e)), 1)),
			Y("div", BS, [Y("fieldset", VS, [r[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Quantity", -1), Y("input", {
				"aria-label": `Quantity for ${e.name}`,
				class: "dui-input dui-input-sm",
				value: e.quantity,
				min: "1",
				type: "number",
				onInput: (t) => n("quantityInput", e.key, t)
			}, null, 40, HS)]), e.source === "custom" ? (K(), q("button", {
				key: 0,
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: (t) => n("removeCustomTrapping", e.key)
			}, " Remove ", 8, US)) : Q("", !0)])
		])]))), 128))])) : (K(), q("p", WS, "No trappings are selected yet."));
	}
}), KS = { class: "dui-card-actions" }, qS = ["disabled"], JS = { key: 0 }, YS = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, XS = /* @__PURE__ */ U({
	__name: "NpcBuilderTrappingsTab",
	props: { bridge: {} },
	setup(e) {
		let t = e, n = Nm(), { trappings: r } = Ed(n), i = /* @__PURE__ */ B(""), a = /* @__PURE__ */ B(!1), o = $(() => r.value.filter((e) => !e.ignored && e.resolution.status === "unresolved"));
		xs(() => {
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
		return (e, t) => (K(), J(gh, {
			description: "Review the Items that will be embedded in the generated NPC.",
			title: "Trappings"
		}, {
			default: H(() => [
				Y("div", KS, [Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: a.value || !o.value.length,
					type: "button",
					onClick: u
				}, L(a.value ? "Resolving..." : "Resolve Trappings"), 9, qS), o.value.length ? (K(), q("span", JS, L(o.value.length) + " unresolved ", 1)) : Q("", !0)]),
				i.value ? (K(), q("p", YS, L(i.value), 1)) : Q("", !0),
				X(GS, {
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
//#region src/functions/npc-builder/career-workflow/skill-resolution.ts
function ZS(e, t) {
	let n = /* @__PURE__ */ new Map(), r = [], i = [];
	for (let a of e) {
		let e = /* @__PURE__ */ new Map();
		for (let o of Hd(a.career.uuid, a.career.grants.skills)) {
			let s = Vd(o.originalName);
			if (!s) continue;
			let c = Ud(o.originalName), l = n.get(c) ?? [], u = e.get(c) ?? 0, d = t.enableLinkedSkillResolution && l[u] ? l[u] : "";
			if (e.set(c, u + 1), d) {
				r.push({
					linkedFromKey: d,
					resolutionKey: o.resolutionKey
				});
				continue;
			}
			i.push({
				alreadyGrantedSpecializations: nC(a.career.grants.skills, s.baseName),
				baseName: s.baseName,
				careerLabel: rC(a.career),
				isLoadingSuggestions: !1,
				occurrence: o.occurrence,
				options: s.options,
				originalName: s.originalName,
				resolvedSpecialization: iC(s),
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
function QS(e) {
	return e.resolvedSpecialization.trim() ? zd(e.baseName, e.resolvedSpecialization) : "";
}
function $S(e) {
	return e.occurrence > 0 ? `${e.originalName}, choice ${e.occurrence + 1}` : e.originalName;
}
function eC(e) {
	return e.options.length <= 1 && e.specialization.trim().toLocaleLowerCase() === "any";
}
function tC(e, t) {
	let n = Ud(t);
	return e.alreadyGrantedSpecializations.some((e) => Ud(e) === n);
}
function nC(e, t) {
	let n = Ud(t), r = /* @__PURE__ */ new Set(), i = [];
	for (let t of e) {
		let e = Bd(t);
		if (!e || Ud(e.baseName) !== n) continue;
		let a = Ud(e.specialization);
		r.has(a) || (r.add(a), i.push(e.specialization));
	}
	return i;
}
function rC(e) {
	return e.level === null ? e.name : `${e.name}, tier ${e.level}`;
}
function iC(e) {
	return e.specialization.trim().toLocaleLowerCase() === "any" ? "" : e.options[0] ?? "";
}
//#endregion
//#region src/view/apps/npc-builder/components/SkillResolutionPromptContent.vue?vue&type=script&setup=true&lang.ts
var aC = { class: "dui-card-body" }, oC = { class: "dui-card-title" }, sC = { class: "dui-badge" }, cC = { class: "dui-fieldset" }, lC = { class: "app:grid app:gap-1" }, uC = ["onUpdate:modelValue", "aria-label"], dC = ["value"], fC = [
	"onUpdate:modelValue",
	"aria-label",
	"placeholder"
], pC = {
	key: 0,
	class: "dui-label app:text-error"
}, mC = {
	key: 0,
	class: "dui-card-actions"
}, hC = { key: 0 }, gC = ["onClick"], _C = {
	key: 0,
	class: "dui-badge dui-badge-error dui-badge-xs"
}, vC = {
	key: 0,
	class: "dui-alert dui-alert-info"
}, yC = { class: "dui-card-actions" }, bC = /* @__PURE__ */ U({
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
			return !!e.resolvedSpecialization && tC(e, e.resolvedSpecialization);
		}
		return (t, i) => (K(), q("section", null, [
			i[5] ||= Y("p", null, " Some Career skills need a specialization before they become concrete WFRP skills. Blank rows can be left unresolved and edited later. ", -1),
			(K(!0), q(G, null, W(e.prompt.rows, (t) => (K(), q("section", {
				key: t.resolutionKey,
				class: "dui-card dui-card-border dui-card-sm"
			}, [Y("div", aC, [
				Y("h3", oC, L(e.getSkillResolutionLabel(t)), 1),
				Y("span", sC, L(t.careerLabel), 1),
				Y("fieldset", cC, [
					i[4] ||= Y("legend", { class: "dui-fieldset-legend" }, "Specialization", -1),
					Y("label", lC, [i[3] ||= Y("span", { class: "dui-label" }, "Choice", -1), t.options.length > 1 ? Go((K(), q("select", {
						key: 0,
						"onUpdate:modelValue": (e) => t.resolvedSpecialization = e,
						"aria-label": `Specialization for ${e.getSkillResolutionLabel(t)}`,
						class: I(["dui-select dui-select-sm", { "dui-select-error": V(tC)(t, t.resolvedSpecialization) }])
					}, [i[2] ||= Y("option", { value: "" }, "Leave unresolved", -1), (K(!0), q(G, null, W(t.options, (e) => (K(), q("option", {
						key: e,
						class: I({ "app:text-error": V(tC)(t, e) }),
						value: e
					}, L(e) + L(V(tC)(t, e) ? " — already granted" : ""), 11, dC))), 128))], 10, uC)), [[Mu, t.resolvedSpecialization]]) : Go((K(), q("input", {
						key: 1,
						"onUpdate:modelValue": (e) => t.resolvedSpecialization = e,
						"aria-label": `Specialization for ${e.getSkillResolutionLabel(t)}`,
						class: I(["dui-input dui-input-sm", { "dui-input-error": V(tC)(t, t.resolvedSpecialization) }]),
						placeholder: t.suggestedSpecializations.length ? "Type or choose below" : t.specialization,
						type: "text"
					}, null, 10, fC)), [[ku, t.resolvedSpecialization]])]),
					r(t) ? (K(), q("p", pC, " Already granted by this Career. ")) : Q("", !0)
				]),
				e.usesFreeformSkillSpecialization(t) ? (K(), q("div", mC, [t.isLoadingSuggestions ? (K(), q("small", hC, "Finding known choices.")) : Q("", !0), (K(!0), q(G, null, W(t.suggestedSpecializations, (e) => (K(), q("button", {
					key: `${t.resolutionKey}:${e}`,
					class: I(["dui-btn dui-btn-sm", { "dui-btn-error dui-btn-outline": V(tC)(t, e) }]),
					type: "button",
					onClick: (r) => n("chooseSkillSpecialization", t, e)
				}, [Z(L(e) + " ", 1), V(tC)(t, e) ? (K(), q("span", _C, " Already granted ")) : Q("", !0)], 10, gC))), 128))])) : Q("", !0)
			])]))), 128)),
			e.prompt.linkedRows.length ? (K(), q("div", vC, L(e.prompt.linkedRows.length) + " linked skill specialization" + L(e.prompt.linkedRows.length === 1 ? "" : "s") + " will reuse earlier choices from this career chain. ", 1)) : Q("", !0),
			Y("div", yC, [Y("button", {
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
//#region src/view/apps/npc-builder/NpcBuilderApp/types.ts
function xC(e) {
	return e === "build-actor" || e === "build-careers" || e === "build-quick";
}
function SC(e) {
	return e === "settings-advancement" || e === "settings-folders" || e === "settings-resolution" || e === "settings-suggestions";
}
function CC(e) {
	return e === "automatic-xp" || e === "detail-characteristics" || e === "detail-skills" || e === "detail-talents";
}
function wC(e) {
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
var TC = ["aria-current", "onClick"], EC = ["aria-current", "popovertarget"], DC = ["id"], OC = ["onClick"], kC = /* @__PURE__ */ U({
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
		}, L(t.label), 9, TC)) : (K(), q(G, { key: 1 }, [Y("button", {
			"aria-current": t.isActive ? "page" : void 0,
			popovertarget: t.popoverId,
			type: "button"
		}, L(t.label), 9, EC), Y("div", {
			id: t.popoverId,
			popover: ""
		}, [Y("ul", { class: I(["dui-menu app:min-w-56 app:p-2", t.columnsClass]) }, [(K(!0), q(G, null, W(t.pages, (t) => (K(), q("li", { key: t.page }, [Y("button", {
			class: I({ "dui-menu-active": e.activePage === t.page }),
			type: "button",
			onClick: (e) => n("pageSelect", t.page, e)
		}, L(V(wC)(t.page)), 11, OC)]))), 128))], 2)], 8, DC)], 64))], 64))), 128))], 64));
	}
}), AC = { class: "dui-navbar app:sticky app:top-0 app:z-20 app:flex-wrap app:gap-2 app:bg-base-200 app:px-3 app:py-2" }, jC = { class: "dui-navbar-start app:min-w-64 app:flex-1" }, MC = { class: "app:min-w-0" }, NC = { class: "app:text-base-content/70" }, PC = {
	"aria-label": "NPC Builder pages",
	class: "app:order-3 app:flex app:w-full app:flex-wrap app:items-center app:justify-start app:gap-2"
}, FC = {
	id: "npc-builder-megamenu",
	class: "dui-megamenu max-sm:dui-megamenu-vertical dui-megamenu-sm app:ml-0 app:mr-auto app:border app:border-base-300 app:bg-base-100 app:p-2",
	popover: ""
}, IC = { class: "dui-navbar-end app:w-auto app:shrink-0" }, LC = ["disabled"], RC = /* @__PURE__ */ U({
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
		return (t, n) => (K(), q("header", AC, [
			Y("div", jC, [Y("div", MC, [
				n[1] ||= Y("span", { class: "dui-badge dui-badge-outline" }, "WFRP4e Customizer", -1),
				n[2] ||= Y("h1", { class: "app:m-0 app:text-xl app:leading-tight" }, "NPC Builder", -1),
				Y("small", NC, [e.selectedBaseActorName ? (K(), q(G, { key: 0 }, [Z(L(e.selectedBaseActorName) + " base · " + L(e.finalActorName), 1)], 64)) : (K(), q(G, { key: 1 }, [Z("Choose a base character, then shape the final NPC.")], 64))])
			])]),
			Y("nav", PC, [n[3] ||= Y("button", {
				"aria-label": "Open NPC Builder navigation",
				class: "dui-btn dui-btn-sm sm:app:hidden",
				popovertarget: "npc-builder-megamenu",
				type: "button"
			}, " Menu ", -1), Y("div", FC, [X(kC, {
				"active-page": e.activePage,
				groups: c.value,
				onPageSelect: l
			}, null, 8, ["active-page", "groups"])])]),
			Y("div", IC, [Y("button", {
				class: "dui-btn dui-btn-primary",
				disabled: !e.canBuild,
				type: "button",
				onClick: n[0] ||= (e) => r("buildNpc")
			}, " Build NPC ", 8, LC)])
		]));
	}
});
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp/useNpcBuilderApplicationDrop.ts
function zC(e, t, n, r) {
	let i = Nm(), a = /* @__PURE__ */ B(!1);
	function o(e) {
		BC(e) || (e.preventDefault(), a.value = !0);
	}
	function s(e) {
		if (BC(e)) return;
		let t = e.currentTarget, n = e.relatedTarget;
		t instanceof Node && n instanceof Node && t.contains(n) || (a.value = !1);
	}
	function c(e) {
		BC(e) || (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"));
	}
	async function l(o) {
		if (!BC(o)) {
			o.preventDefault(), a.value = !1, r.value = "";
			try {
				let r = await e.resolveApplicationDrop(o.dataTransfer?.getData("text/plain") ?? "");
				r.kind === "actor" ? i.selectBaseActor(r.actor) : r.kind === "career" ? await n(r.career, { replaceQueue: t.value === "build-quick" }) : r.kind === "advancement" ? i.addCustomAdvancement(r.advancement) : r.kind === "trapping" ? i.addCustomTrapping(r.trapping) : r.kind === "trait" ? i.addCustomTrait(r.trait) : i.addCustomSpell(r.spell);
			} catch (e) {
				r.value = Vy(e);
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
function BC(e) {
	let t = e.dataTransfer, n = t?.getData("text/plain") ?? "", r = Array.from(t?.types ?? []);
	return n.startsWith("npc-builder-career:") || yp(n) !== null || r.includes(Vv);
}
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp/useNpcBuilderBuild.ts
function VC(e, t, n, r, i) {
	let a = Nm(), { advancements: o, buildTraits: s, careers: c, finalActorName: l, finalPortraitPath: u, selectedMountActorUuid: d, selectedBaseActor: f, selectedSpells: p, settings: m, trappings: h } = Ed(a), g = /* @__PURE__ */ B(!1), _ = $(() => !!(f.value && c.value.length && !g.value && !i.value));
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
			r.value = Vy(e), n.value = "";
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
function HC(e) {
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
function UC(e) {
	return [{
		career: e,
		mode: "add-or-increment"
	}];
}
function WC(e) {
	return [...e.candidates.filter((t) => e.selectedUuids.includes(t.uuid)).map((e) => ({
		career: e,
		mode: "add-if-missing"
	})), {
		career: e.droppedCareer,
		mode: "add-or-increment"
	}];
}
function GC(e) {
	let t = e.candidates.filter((t) => e.selectedUuids.includes(t.uuid)).length;
	return t === 0 ? "" : `Added ${t} lower-tier career candidate${t === 1 ? "" : "s"}.`;
}
function KC(e, t) {
	return e?.selectedUuids.includes(t) ?? !1;
}
function qC(e) {
	let { candidateUuid: t, isAlreadyQueued: n, prompt: r, selected: i } = e;
	return !r || n ? null : i ? [...new Set([...r.selectedUuids, t])] : r.selectedUuids.filter((e) => e !== t);
}
//#endregion
//#region src/state/npc-builder/workflows/skill-suggestions.ts
async function JC(e, t) {
	await Promise.all(t.rows.map(async (t) => {
		if (eC(t)) {
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
function YC(e) {
	let t = Nm(), { careers: n, settings: r } = Ed(t), i = /* @__PURE__ */ B(""), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(null), c = /* @__PURE__ */ B(null), l = $(() => HC(s.value));
	async function u(t, n = {}) {
		a.value = "";
		try {
			await d(await e.resolveCareerDrop(t), n);
		} catch (e) {
			a.value = XC(e);
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
		m(UC(e), {
			enableLinkedSkillResolution: !1,
			message: ""
		});
	}
	function m(t, n) {
		let r = ZS(t, n);
		if (r.rows.length) {
			c.value = r, JC(e, c.value);
			return;
		}
		b(t, n.message);
	}
	function h() {
		let e = s.value;
		e && (s.value = null, m(WC(e), {
			enableLinkedSkillResolution: !r.value.askForLinkedSkillSpecializations,
			message: GC(e)
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
			for (let n of e.rows) t.setSkillGrantResolution(n.resolutionKey, QS(n));
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
		return KC(s.value, e);
	}
	function ee(e, t) {
		let n = qC({
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
		getSkillResolutionLabel: $S,
		addCareerSummaryWithLowerCareerMode: d,
		handleCareerDrop: u,
		isCareerQueued: x,
		isFindingLowerCareers: o,
		isLowerCareerSelected: S,
		lowerCareerCandidateGroups: l,
		pendingLowerCareerPrompt: s,
		pendingSkillResolutionPrompt: c,
		setLowerCareerSelected: ee,
		usesFreeformSkillSpecialization: eC
	};
}
function XC(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp/useNpcBuilderCareerDropWorkflow.ts
function ZC(e) {
	return YC(e);
}
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp/useNpcBuilderInitialData.ts
function QC(e, t) {
	let n = Nm(), { selectedBaseActorUuid: r, selectedMountActorUuid: i, settings: a } = Ed(n), o = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B([]);
	xs(async () => {
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
			t.value = Vy(e);
		} finally {
			o.value = !1;
		}
	}), Qo(r, async (r) => {
		if (t.value = "", !r) {
			n.clearBaseDraftData(), n.hydrateBaseActorCombatProfile(null);
			return;
		}
		r === i.value && n.clearMountSelection(), n.hydrateBaseActorCombatProfile(null), s.value = !0;
		try {
			let [t, i] = await Promise.all([e.loadBaseActorDraftData(r), e.loadActorCombatProfile(r)]);
			n.hydrateBaseActorDraftData(t), n.hydrateBaseActorCombatProfile(i);
		} catch (e) {
			t.value = Vy(e), n.clearBaseDraftData(), n.hydrateBaseActorCombatProfile(null);
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
function $C() {
	return {
		inFlightNames: [],
		successfulNames: []
	};
}
function ew(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.kind === "skill" && !n.characteristicKey && !Vd(n.name) && t.add(n.name);
	return [...t];
}
function tw(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.kind === "talent" && !n.talentMaximumKey && t.add(n.name);
	return [...t];
}
function nw(e, t) {
	let n = new Set([...t.inFlightNames, ...t.successfulNames]);
	return e.filter((e) => {
		let t = Ud(e);
		return n.has(t) ? !1 : (n.add(t), !0);
	});
}
function rw(e, t) {
	return {
		...e,
		inFlightNames: ow([...e.inFlightNames, ...t])
	};
}
function iw(e, t) {
	let n = new Set(ow(t));
	return {
		inFlightNames: e.inFlightNames.filter((e) => !n.has(e)),
		successfulNames: ow([...e.successfulNames, ...n])
	};
}
function aw(e, t) {
	let n = new Set(ow(t));
	return {
		...e,
		inFlightNames: e.inFlightNames.filter((e) => !n.has(e))
	};
}
function ow(e) {
	return [...new Set([...e].map(Ud).filter(Boolean))];
}
//#endregion
//#region src/state/npc-builder/workflows/metadata-lookups-workflow.ts
function sw(e) {
	let t = Nm(), { advancements: n } = Ed(t), r = /* @__PURE__ */ B($C()), i = /* @__PURE__ */ B($C()), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(""), s = $(() => ew(n.value)), c = $(() => tw(n.value)), l = $(() => [a.value, o.value].filter(Boolean).join(" ")), u = $(() => l.value ? "degraded" : r.value.inFlightNames.length + i.value.inFlightNames.length > 0 ? "loading" : "ready");
	Qo(s, (e) => {
		d(e);
	}, { immediate: !0 }), Qo(c, (e) => {
		f(e);
	}, { immediate: !0 });
	async function d(n) {
		if (!n.length) {
			a.value = "";
			return;
		}
		let i = nw(n, r.value);
		if (i.length) {
			r.value = rw(r.value, i), a.value = "";
			try {
				let n = await e.listSkillCharacteristics(i);
				r.value = iw(r.value, i), t.hydrateSkillCharacteristics(n);
			} catch (e) {
				r.value = aw(r.value, i), a.value = cw("skill characteristics", e);
			}
		}
	}
	async function f(n) {
		if (!n.length) {
			o.value = "";
			return;
		}
		let r = nw(n, i.value);
		if (r.length) {
			i.value = rw(i.value, r), o.value = "";
			try {
				let n = await e.listTalentMaximums(r);
				i.value = iw(i.value, r), t.hydrateTalentMaximums(n);
			} catch (e) {
				i.value = aw(i.value, r), o.value = cw("Talent maximums", e);
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
function cw(e, t) {
	return `Could not load ${e}.${t instanceof Error ? ` ${t.message}` : ""}`;
}
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp/useNpcBuilderMetadataLookups.ts
function lw(e) {
	return sw(e);
}
//#endregion
//#region src/view/apps/npc-builder/NpcBuilderApp.vue?vue&type=script&setup=true&lang.ts
var uw = ["id", "aria-label"], dw = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, fw = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, pw = {
	key: 2,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, mw = {
	key: 3,
	"aria-live": "polite",
	class: "dui-alert dui-alert-warning",
	role: "status"
}, hw = /* @__PURE__ */ U({
	__name: "NpcBuilderApp",
	props: { bridge: {} },
	setup(e) {
		let t = e, { finalActorName: n, hasMagicAccess: r, selectedBaseActor: i, selectedSpells: a } = Ed(Nm()), o = /* @__PURE__ */ B("build-quick"), s = os(), c = $(() => r.value || a.value.length > 0), { addCareerSummaryWithLowerCareerMode: l, buildMessage: u, chooseSkillSpecialization: d, confirmLowerCareerPrompt: f, confirmSkillResolutionPrompt: p, dismissLowerCareerPrompt: m, dismissSkillResolutionPrompt: h, errorMessage: g, getSkillResolutionLabel: _, isCareerQueued: v, isFindingLowerCareers: y, isLowerCareerSelected: b, lowerCareerCandidateGroups: x, pendingLowerCareerPrompt: S, pendingSkillResolutionPrompt: ee, setLowerCareerSelected: C, usesFreeformSkillSpecialization: te } = ZC(t.bridge), { buildNpc: w, canBuild: ne } = VC(t.bridge, o, u, g, y), { isLoadingActors: re, isLoadingBaseDraft: T, traitDifficultyOptions: ie } = QC(t.bridge, g), { metadataLookupError: E, metadataLookupStatus: ae, retryMetadataLookups: D } = lw(t.bridge), { handleApplicationDragEnter: O, handleApplicationDragLeave: k, handleApplicationDragOver: oe, handleApplicationDrop: se, isApplicationDragOver: ce } = zC(t.bridge, o, l, g);
		return (e, r) => (K(), q("section", {
			"aria-label": "NPC Builder",
			class: I(["app:flex app:min-h-full app:flex-col", { "app:ring-2 app:ring-info": V(ce) }]),
			onDragenter: r[2] ||= (...e) => V(O) && V(O)(...e),
			onDragleave: r[3] ||= (...e) => V(k) && V(k)(...e),
			onDragover: r[4] ||= (...e) => V(oe) && V(oe)(...e),
			onDrop: r[5] ||= (...e) => V(se) && V(se)(...e)
		}, [
			X(RC, {
				"active-page": o.value,
				"can-build": V(ne),
				"final-actor-name": V(n),
				"has-spell-page": c.value,
				"selected-base-actor-name": V(i)?.name ?? "",
				onBuildNpc: V(w),
				onPageChange: r[0] ||= (e) => o.value = e
			}, null, 8, [
				"active-page",
				"can-build",
				"final-actor-name",
				"has-spell-page",
				"selected-base-actor-name",
				"onBuildNpc"
			]),
			X(Vm, {
				open: V(S) !== null,
				title: "Add Lower-Tier Careers?",
				onClose: V(m)
			}, {
				default: H(() => [V(S) ? (K(), J(Lm, {
					key: 0,
					"candidate-groups": V(x),
					"is-career-queued": V(v),
					"is-lower-career-selected": V(b),
					prompt: V(S),
					onAddDroppedOnly: V(m),
					onAddSelected: V(f),
					onLowerCareerSelected: V(C)
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
			X(Vm, {
				open: V(ee) !== null,
				title: "Resolve Skill Specializations",
				onClose: V(h)
			}, {
				default: H(() => [V(ee) ? (K(), J(bC, {
					key: 0,
					"get-skill-resolution-label": V(_),
					prompt: V(ee),
					"uses-freeform-skill-specialization": V(te),
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
				"aria-label": V(wC)(o.value),
				class: "app:grid app:flex-1 app:content-start app:gap-3 app:p-3"
			}, [
				V(g) ? (K(), q("p", dw, L(V(g)), 1)) : V(u) ? (K(), q("p", fw, L(V(u)), 1)) : V(ce) ? (K(), q("p", pw, " Release to add this document to the NPC draft. ")) : Q("", !0),
				V(ae) === "degraded" ? (K(), q("div", mw, [
					Y("span", null, L(V(E)), 1),
					r[6] ||= Y("span", null, "Advancement rows remain editable with reduced metadata.", -1),
					Y("button", {
						class: "dui-btn dui-btn-sm",
						type: "button",
						onClick: r[1] ||= (...e) => V(D) && V(D)(...e)
					}, " Retry Metadata ")
				])) : Q("", !0),
				V(SC)(o.value) ? (K(), J(xx, {
					key: 4,
					bridge: t.bridge,
					page: o.value
				}, null, 8, ["bridge", "page"])) : V(CC)(o.value) ? (K(), J(Xh, {
					key: 5,
					page: o.value
				}, null, 8, ["page"])) : o.value === "trappings" ? (K(), J(XS, {
					key: 6,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : o.value === "traits" ? (K(), J(bS, {
					key: 7,
					"difficulty-options": V(ie)
				}, null, 8, ["difficulty-options"])) : o.value === "detail-spells" ? (K(), J(iS, {
					key: 8,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : o.value === "mount" ? (K(), J(fb, {
					key: 9,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : V(xC)(o.value) ? (K(), J(Zv, {
					key: 10,
					bridge: t.bridge,
					"is-loading-actors": V(re),
					"is-loading-base-draft": V(T),
					page: o.value
				}, null, 8, [
					"bridge",
					"is-loading-actors",
					"is-loading-base-draft",
					"page"
				])) : Q("", !0)
			], 8, uw)
		], 34));
	}
}), gw = dd();
//#endregion
//#region src/module/foundry/document-drop.ts
function _w(e) {
	let t = e.value.trim();
	if (!t) return "";
	if (Ew(t)) return t;
	let n = Sw(t), r = ww(n, e.documentType);
	return r ? Dw(n) ? JSON.stringify({
		type: r,
		uuid: n
	}) : JSON.stringify({
		id: n,
		type: r
	}) : "";
}
function vw(e) {
	let t = !0;
	function n() {
		t && (t = !1, document.removeEventListener("click", r, !0));
	}
	function r(t) {
		let r = t.target;
		if (!(r instanceof Element)) return;
		let i = yw(r);
		i && (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), n(), e(i));
	}
	return document.addEventListener("click", r, !0), n;
}
function yw(e) {
	let t = e.closest("[data-uuid], [data-document-uuid], [data-entry-uuid], [data-document-id], [data-entry-id], [data-pack]");
	if (!t) return "";
	let n = t.dataset.uuid || t.dataset.documentUuid || t.dataset.entryUuid || "";
	if (n) return xw(n);
	let r = t.dataset.documentId || t.dataset.entryId || "", i = Cw(t);
	if (!r || !i) return "";
	let a = t.dataset.pack || t.closest("[data-pack]")?.dataset.pack || bw(t);
	return a ? JSON.stringify({
		type: i,
		uuid: `Compendium.${a}.${r}`
	}) : t.closest(".compendium-directory") ? "" : JSON.stringify({
		type: i,
		uuid: `${i}.${r}`
	});
}
function bw(e) {
	let t = e.closest(".compendium-directory");
	return t ? Array.from(game.packs ?? []).find((e) => t.id === `Compendium-${e.collection?.replaceAll(".", "_")}`)?.collection ?? "" : "";
}
function xw(e) {
	let t = ww(e, "auto");
	return t ? JSON.stringify({
		type: t,
		uuid: e
	}) : "";
}
function Sw(e) {
	return /@UUID\[([^\]]+)]/.exec(e)?.[1]?.trim() ?? e;
}
function Cw(e) {
	let t = e.dataset.documentName || e.dataset.type || e.closest("[data-document-name]")?.dataset.documentName || "";
	return Tw(t) ? t : e.classList.contains("actor") ? "Actor" : e.classList.contains("item") ? "Item" : e.classList.contains("journal") ? "JournalEntry" : e.closest("#actors") ? "Actor" : e.closest("#items") ? "Item" : e.closest("#journal") ? "JournalEntry" : "";
}
function ww(e, t) {
	return /^actor\./i.test(e) || /\.actors(\.|$)/i.test(e) ? "Actor" : /^item\./i.test(e) || /\.items(\.|$)/i.test(e) ? "Item" : /journalentrypage\./i.test(e) || /\.journalentrypage\./i.test(e) ? "JournalEntryPage" : /^journalentry\./i.test(e) || /\.journals(\.|$)/i.test(e) ? "JournalEntry" : t === "auto" ? "Item" : t;
}
function Tw(e) {
	return e === "Actor" || e === "Item" || e === "JournalEntry" || e === "JournalEntryPage";
}
function Ew(e) {
	if (!e.startsWith("{")) return !1;
	try {
		return typeof JSON.parse(e).type == "string";
	} catch {
		return !1;
	}
}
function Dw(e) {
	return /^(actor|item|journalentry|journalentrypage|compendium)\./i.test(e);
}
var Ow = {
	createDropData: _w,
	startDocumentPick: vw
}, kw = class {
	#e;
	createRoot() {
		let e = document.createElement("div");
		return e.classList.add("wfrp4e-customizer-apps-root"), e.dataset.theme = "wfrp4e-customizer-apps", e;
	}
	mount(e, t, n, r) {
		this.unmount(), t.classList.add("wfrp4e-customizer-apps-app"), t.replaceChildren(e), this.#e = Wu(n, r), this.#e.use(gw), this.#e.provide(by, Ow), this.#e.mount(e);
	}
	unmount() {
		this.#e?.unmount(), this.#e = void 0;
	}
}, Aw = class extends foundry.applications.api.ApplicationV2 {
	#e = new kw();
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
//#region src/functions/npc-builder/extract-career-grants.ts
function jw(e) {
	return {
		characteristics: Mw(e),
		skills: Nw(e),
		talents: Fw(e, [["talents", "value"], ["talents"]]),
		trappings: Fw(e, [["trappings", "value"], ["trappings"]])
	};
}
function Mw(n) {
	let r = Fw(n, [["characteristics", "value"], ["characteristics"]]);
	if (r.length) return r.map(Pw);
	let i = t(n, ["characteristics"]);
	if (!e(i)) return [];
	let a = [];
	for (let [e, t] of Object.entries(i)) t && a.push(Pw(e));
	return Lw(a);
}
function Nw(e) {
	return Fw(e, [["skills", "value"], ["skills"]], { preserveDuplicates: !0 });
}
function Pw(e) {
	let t = e.trim().toLocaleLowerCase();
	if (f(t)) return u[t];
	let n = d[t];
	return n ? u[n] : e.trim();
}
function Fw(e, n, r = {}) {
	for (let i of n) {
		let n = s(t(e, i));
		if (n.length) return r.preserveDuplicates ? Iw(n) : Lw(n);
	}
	return [];
}
function Iw(e) {
	return e.map((e) => e.trim()).filter(Boolean);
}
function Lw(e) {
	return [...new Set(Iw(e))].sort((e, t) => e.localeCompare(t));
}
//#endregion
//#region src/module/foundry/compendiums.ts
function Rw(e, t) {
	return t.uuid ? t.uuid : t._id && e.getUuid ? e.getUuid(t._id) : "";
}
function zw(e) {
	return e.documentName === "Item" || n(e, ["metadata", "type"]) === "Item" || n(e, ["metadata", "documentName"]) === "Item";
}
function Bw(e) {
	return e.documentName === "Actor" || n(e, ["metadata", "type"]) === "Actor" || n(e, ["metadata", "documentName"]) === "Actor";
}
function Vw(t) {
	return Array.isArray(t) ? t.filter(Uw) : e(t) && Array.isArray(t.contents) ? t.contents.filter(Uw) : Ww(t) ? [...t].flatMap((e) => {
		let t = Array.isArray(e) ? e[1] : e;
		return Uw(t) ? [t] : [];
	}) : [];
}
function Hw() {
	return new Promise((e) => {
		globalThis.setTimeout(e, 0);
	});
}
function Uw(t) {
	return e(t);
}
function Ww(t) {
	return e(t) && Symbol.iterator in t;
}
//#endregion
//#region src/module/wfrp4e/career-summary.ts
function Gw(e) {
	return {
		careerGroup: Kw(e),
		grants: jw(e.system),
		img: e.img ?? "",
		level: qw(e),
		name: e.name,
		uuid: e.uuid
	};
}
function Kw(e) {
	return n(e.system, ["careergroup", "value"]);
}
function qw(e) {
	let n = t(e.system, ["level", "value"]), r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/module/wfrp4e/career-index.ts
var Jw = [
	"name",
	"type",
	"img",
	"system.careergroup.value",
	"system.characteristics",
	"system.level.value",
	"system.skills",
	"system.talents",
	"system.trappings"
], Yw = /* @__PURE__ */ new Map(), Xw = "idle", Zw = null;
function Qw() {
	return Zw || (Xw = "indexing", Yw.clear(), Zw = eT().then(() => {
		Xw = "ready";
	}).catch((e) => {
		Xw = "error", Ir("wfrp4e-customizer-apps | Career indexing failed.", e);
	}), Zw);
}
async function $w(e) {
	return Xw === "idle" && Qw(), !e.careerGroup || e.level === null ? [] : [...Yw.values()].filter((t) => aT(t, e)).sort(sT);
}
async function eT() {
	tT(), await Hw();
	for (let e of game.packs ?? []) {
		if (!zw(e) || !e.getIndex) continue;
		let t = await e.getIndex({ fields: Jw });
		for (let n of Vw(t)) {
			let t = nT(e, n);
			t && Yw.set(t.uuid, t);
		}
		await Hw();
	}
}
function tT() {
	for (let e of game.items?.contents ?? []) e.type === "career" && Yw.set(e.uuid, Gw(e));
}
function nT(e, n) {
	let r = Rw(e, n);
	if (n.type !== "career" || !n.name || !r) return null;
	let i = t(n, ["system"]);
	return {
		careerGroup: rT(n),
		grants: jw(i),
		img: n.img ?? "",
		level: iT(n),
		name: n.name,
		uuid: r
	};
}
function rT(e) {
	let n = t(e, [
		"system",
		"careergroup",
		"value"
	]);
	return typeof n == "string" ? n.trim() : "";
}
function iT(e) {
	let n = t(e, [
		"system",
		"level",
		"value"
	]), r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function aT(e, t) {
	return e.uuid !== t.uuid && e.level !== null && t.level !== null && e.level < t.level && oT(e.careerGroup) === oT(t.careerGroup);
}
function oT(e) {
	return e.trim().toLocaleLowerCase();
}
function sT(e, t) {
	let n = e.level ?? 0, r = t.level ?? 0;
	return n === r ? e.name.localeCompare(t.name) : n - r;
}
//#endregion
//#region src/module/wfrp4e/skill-specializations.ts
var cT = [
	"name",
	"type",
	"system.characteristic.value"
], lT = /* @__PURE__ */ new Map(), uT = /* @__PURE__ */ new Map(), dT = /* @__PURE__ */ new Map(), fT = "idle", pT = null;
async function mT(e) {
	let t = Ud(e);
	return t ? (fT === "idle" && gT(), pT && await pT, [...lT.get(t) ?? []].sort((e, t) => e.localeCompare(t))) : [];
}
async function hT(e) {
	return fT === "idle" && gT(), pT && await pT, e.flatMap((e) => {
		let t = ST(e);
		return t ? [{
			...t,
			skillName: e
		}] : [];
	});
}
function gT() {
	return pT || (fT = "indexing", lT.clear(), uT.clear(), dT.clear(), pT = _T().then(() => {
		fT = "ready";
	}).catch((e) => {
		fT = "error", Ir("wfrp4e-customizer-apps | Skill specialization indexing failed.", e);
	}), pT);
}
async function _T() {
	CT(), await Hw();
	for (let e of game.packs ?? []) {
		if (!zw(e) || !e.getIndex) continue;
		let t = await e.getIndex({ fields: cT });
		for (let e of Vw(t)) yT(e);
		await Hw();
	}
}
function vT(e) {
	if (e.type !== "skill") return;
	bT(e);
	let t = Bd(e.name);
	if (!t) return;
	let n = Ud(t.baseName), r = lT.get(n) ?? /* @__PURE__ */ new Set();
	r.add(t.specialization), lT.set(n, r);
}
function yT(e) {
	if (e.type !== "skill" || !e.name) return;
	xT(e);
	let t = Bd(e.name);
	if (!t) return;
	let n = Ud(t.baseName), r = lT.get(n) ?? /* @__PURE__ */ new Set();
	r.add(t.specialization), lT.set(n, r);
}
function bT(e) {
	let t = n(e.system, ["characteristic", "value"]);
	if (!f(t)) return;
	let r = {
		characteristicKey: t,
		characteristicName: u[t],
		skillName: e.name
	}, i = Ud(e.name), a = Ud(Bd(e.name)?.baseName ?? e.name);
	uT.set(i, r), dT.has(a) || dT.set(a, r);
}
function xT(e) {
	let t = n(e, [
		"system",
		"characteristic",
		"value"
	]);
	if (!f(t) || !e.name) return;
	let r = {
		characteristicKey: t,
		characteristicName: u[t],
		skillName: e.name
	}, i = Ud(e.name), a = Ud(Bd(e.name)?.baseName ?? e.name);
	uT.set(i, r), dT.has(a) || dT.set(a, r);
}
function ST(e) {
	let t = Ud(e), n = Ud(Bd(e)?.baseName ?? e);
	return uT.get(t) ?? dT.get(n) ?? null;
}
function CT() {
	for (let e of game.items?.contents ?? []) vT(e);
}
//#endregion
//#region src/module/foundry/item-sources.ts
function wT(e, t) {
	return {
		img: "systems/wfrp4e/icons/blank.png",
		name: e,
		system: {},
		type: t
	};
}
function TT(e, t, n) {
	let r = e ? e.toObject() : wT(t, n);
	return delete r._id, r;
}
function ET(e, t, n) {
	return DT(e, t, n)[0] ?? null;
}
function DT(e, t, n) {
	return e.items?.contents.filter((e) => e.type === n && AT(e.name, t)) ?? [];
}
function OT(e, t, n) {
	return e.items?.contents.find((e) => t && e.uuid === t ? !0 : AT(e.name, n)) ?? null;
}
function kT(e, t) {
	return game.items?.contents.find((n) => t.includes(n.type) && AT(n.name, e)) ?? null;
}
function AT(e, t) {
	return e.trim().toLocaleLowerCase() === t.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/wfrp4e/item-lookup.ts
async function jT(e, t) {
	return await game.wfrp4e?.utility?.findItem?.(e, t) || kT(e, t);
}
//#endregion
//#region src/module/wfrp4e/talent-maximums.ts
async function MT(e) {
	let t = [];
	for (let r of NT(e)) {
		let e = await jT(r, ["talent"]);
		e && t.push({
			maximumFormula: n(e.system, ["max", "formula"]),
			maximumKey: n(e.system, ["max", "value"]),
			talentName: r
		});
	}
	return t;
}
function NT(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = r.trim().toLocaleLowerCase();
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
//#endregion
//#region src/module/foundry/portrait-search/candidate-utils.ts
var PT = [
	".webp",
	".png",
	".jpg",
	".jpeg",
	".gif"
], FT = new Set(PT);
function IT(e, t) {
	let n = t.img.trim().toLocaleLowerCase();
	!n || e.seenPaths.has(n) || (e.seenPaths.add(n), e.candidates.push(t));
}
function LT(e, t) {
	let n = t.imagePaths.filter(({ path: e }) => !!e);
	if (GT(t.name, n, e.searchTerms)) for (let r of n) {
		let n = {
			img: r.path,
			key: `foundry-asset:${t.sourceKey}:${r.label}`,
			label: `${t.name || VT(r.path)} ${r.label} (${t.sourceLabel})`,
			source: "foundry-asset",
			sourceGroup: t.sourceGroup,
			sourceLabel: t.sourceLabel
		};
		KT(n, e) && IT(e, n);
	}
}
function RT(e, t, n) {
	e?.({
		candidatesFound: t.candidates.length,
		currentLocation: n.currentLocation,
		directoriesVisited: t.visitedDirectories,
		maxDirectories: n.maxDirectories,
		phase: n.phase
	});
}
function zT(e) {
	return n(e, [
		"prototypeToken",
		"texture",
		"src"
	]) || n(e.toObject(), [
		"prototypeToken",
		"texture",
		"src"
	]);
}
function BT(e, t) {
	return `${VT(e)} (${t})`;
}
function VT(e) {
	return e.split(/[/\\]/).at(-1) ?? e;
}
function HT(e) {
	let t = `.${e.split(/[#?]/u)[0]?.split(".").pop() ?? ""}`;
	return FT.has(t.toLocaleLowerCase());
}
function UT(e) {
	return typeof e == "object" && !!e;
}
function WT(e) {
	return UT(e) && Object.values(e).every((e) => Array.isArray(e) && e.every((e) => typeof e == "string"));
}
function GT(e, t, n) {
	return gp(e, n) || t.some(({ path: e }) => gp(e, n));
}
function KT(e, t) {
	return _p(e, {
		mustExcludeSources: [],
		mustExcludeTerms: t.mustExcludeTerms,
		mustIncludeSources: [],
		mustIncludeTerms: t.mustIncludeTerms
	});
}
//#endregion
//#region src/module/foundry/portrait-search/dig-down.ts
var qT = "fuzzy-foundry", JT = .3;
function YT(e, t) {
	let n = XT();
	if (RT(t, e, {
		currentLocation: QT(n),
		maxDirectories: 0,
		phase: "filesystem"
	}), !n.digDownActive || !n.digDownCacheReady) return;
	let r = tE();
	if (!(!r?._fileIndexCache || !r.fs)) {
		for (let t of $T(r, e.searchTerms)) eE(e, r, t);
		RT(t, e, {
			currentLocation: "Dig Down file cache search complete",
			maxDirectories: 0,
			phase: "filesystem"
		});
	}
}
function XT() {
	let e = game.modules.get(qT)?.active === !0, t = ZT(), n = tE(), r = Object.values(n?._fileIndexCache ?? {}).reduce((e, t) => e + t.length, 0);
	return {
		digDownActive: e,
		digDownCacheReady: !!(n?._fileIndexCache && n.fs),
		digDownDeepFileSearchEnabled: t,
		digDownIndexedFileCount: r
	};
}
function ZT() {
	try {
		return game.settings.get(qT, "deepFile") === !0;
	} catch {
		return !1;
	}
}
function QT(e) {
	return e.digDownActive ? e.digDownDeepFileSearchEnabled ? e.digDownCacheReady ? `Dig Down file cache (${e.digDownIndexedFileCount} files)` : "Waiting for Dig Down file cache" : "Dig Down Deep File Search is disabled" : "Dig Down is not active";
}
function $T(e, t) {
	let n = /* @__PURE__ */ new Set(), r = Object.keys(e._fileIndexCache ?? {});
	for (let i of t) {
		let t = i.toLocaleLowerCase();
		for (let e of r) e.toLocaleLowerCase().includes(t) && n.add(e);
		let a = e.fs?.get(i, [], JT) ?? [];
		for (let [, e] of a) n.add(e);
	}
	return [...n].sort((e, t) => e.toLocaleLowerCase().localeCompare(t.toLocaleLowerCase()));
}
function eE(e, t, n) {
	let r = t._fileIndexCache?.[n] ?? [];
	for (let t of r) {
		if (!HT(t)) continue;
		let n = {
			img: t,
			key: `foundry-asset:${t}`,
			label: BT(t, "Dig Down"),
			source: "foundry-asset",
			sourceGroup: "dig-down",
			sourceLabel: "Dig Down"
		};
		KT(n, e) && IT(e, n);
	}
}
function tE() {
	let e = canvas.deepSearchCache;
	if (!UT(e)) return null;
	let t = e._fileIndexCache, n = e.fs, r = {};
	return WT(t) && (r._fileIndexCache = t), UT(n) && typeof n.get == "function" && (r.fs = { get: n.get.bind(n) }), r;
}
//#endregion
//#region src/module/foundry/portrait-search/documents.ts
function nE(e, t) {
	RT(t, e, {
		currentLocation: "World Actors and Items",
		maxDirectories: 0,
		phase: "world-documents"
	});
	for (let t of game.actors.contents) LT(e, {
		imagePaths: [{
			label: "actor image",
			path: t.img ?? ""
		}, {
			label: "token image",
			path: zT(t)
		}],
		name: t.name,
		sourceGroup: "world",
		sourceLabel: "World Actors",
		sourceKey: t.uuid
	});
	for (let t of game.items?.contents ?? []) LT(e, {
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
async function rE(e, t) {
	RT(t, e, {
		currentLocation: "Actor and Item compendiums",
		maxDirectories: 0,
		phase: "compendiums"
	});
	for (let t of game.packs ?? []) {
		if (t.documentName !== "Actor" && t.documentName !== "Item") continue;
		let r = await t.getIndex?.({ fields: [
			"name",
			"img",
			"thumb",
			"prototypeToken.texture.src"
		] }).catch(() => void 0), i = r ? Vw(r) : [];
		for (let r of i) LT(e, {
			imagePaths: [
				{
					label: `${t.documentName.toLocaleLowerCase()} image`,
					path: r.img ?? ""
				},
				{
					label: "thumbnail",
					path: r.thumb ?? ""
				},
				{
					label: "token image",
					path: n(r, [
						"prototypeToken",
						"texture",
						"src"
					])
				}
			],
			name: r.name ?? "",
			sourceGroup: "compendiums",
			sourceLabel: t.title ?? "Compendium",
			sourceKey: `${t.collection ?? t.title ?? "pack"}:${r._id ?? r.name ?? ""}`
		});
	}
}
//#endregion
//#region src/module/foundry/portrait-search/priority-folders.ts
async function iE(e, t, n) {
	let r = aE(t), i = new Set(r.map(({ path: e }) => lE(e)));
	for (e.maxDirectoryBudget += r.length; r.length;) {
		let t = r.shift();
		if (!t) break;
		cE(e, n, t.path);
		let a = await oE(t.path);
		if (e.visitedDirectories += 1, a) {
			sE(e, t.root, a.files ?? []);
			for (let n of uE(a.dirs ?? [])) {
				let a = pp([n])[0], o = lE(a ?? "");
				!a || i.has(o) || (i.add(o), r.push({
					path: a,
					root: t.root
				}), e.maxDirectoryBudget += 1);
			}
			cE(e, n, t.path);
		}
	}
}
function aE(e) {
	return pp(e).map((e) => ({
		path: e,
		root: e
	}));
}
async function oE(e) {
	try {
		return await foundry.applications.apps.FilePicker.browse("data", e, { extensions: PT });
	} catch (t) {
		return Ir(`${C} | Could not browse priority portrait folder "${e}".`, t), null;
	}
}
function sE(e, t, n) {
	let r = `Priority: ${VT(t)}`;
	for (let i of uE(n)) {
		if (!HT(i) || !gp(VT(i), e.searchTerms)) continue;
		let n = {
			img: i,
			key: `foundry-asset:${i}`,
			label: BT(i, r),
			source: "foundry-asset",
			sourceFilter: Qf(t),
			sourceGroup: "priority-folders",
			sourceLabel: r
		};
		KT(n, e) && IT(e, n);
	}
}
function cE(e, t, n) {
	RT(t, e, {
		currentLocation: n,
		maxDirectories: e.maxDirectoryBudget,
		phase: "filesystem"
	});
}
function lE(e) {
	return e.toLocaleLowerCase();
}
function uE(e) {
	return [...e].sort((e, t) => e.toLocaleLowerCase().localeCompare(t.toLocaleLowerCase()));
}
//#endregion
//#region src/module/foundry/portrait-search/exclusions.ts
var dE = /* @__PURE__ */ new Map(), fE = 6, pE = 15e3;
async function mE(e, t, n, r = hE) {
	let i = pp(t.excludedReferenceImagePaths), a = new Set(i.map(bE)), o = /* @__PURE__ */ new Set();
	for (let e of i) {
		let t = await r(e);
		t.loadable && t.pixelSignature && o.add(t.pixelSignature);
	}
	let s = Array(e.length).fill(null), c = 0, l = 0, u = 0;
	yE(n, 0, 0, e.length);
	async function d() {
		for (; l < e.length;) {
			let i = l, d = e[i];
			if (l += 1, !a.has(bE(d.img))) {
				let e = await r(d.img);
				e.loadable && (!t.excludeFullyTransparentImages || !e.fullyTransparent) && (!e.pixelSignature || !o.has(e.pixelSignature)) && (s[i] = d, c += 1);
			}
			u += 1, yE(n, c, u, e.length);
		}
	}
	let f = Math.min(fE, e.length);
	return await Promise.all(Array.from({ length: f }, d)), s.filter((e) => e !== null);
}
async function hE(e) {
	let t = bE(e), n = dE.get(t);
	if (n) return await n;
	let r = gE(e);
	return dE.set(t, r), await r;
}
async function gE(e) {
	let t = await _E(e);
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
			pixelSignature: await vE(e.width, e.height, r)
		};
	} catch {
		return {
			fullyTransparent: !1,
			loadable: !0,
			pixelSignature: ""
		};
	}
}
function _E(e) {
	return new Promise((t) => {
		let n = new Image(), r = setTimeout(() => i(null), pE);
		function i(e) {
			clearTimeout(r), n.onload = null, n.onerror = null, t(e);
		}
		n.onload = () => {
			i(n.naturalWidth > 0 && n.naturalHeight > 0 ? n : null);
		}, n.onerror = () => i(null), n.src = e;
	});
}
async function vE(e, t, n) {
	let r = await crypto.subtle.digest("SHA-256", n);
	return `${e}x${t}:${[...new Uint8Array(r)].map((e) => e.toString(16).padStart(2, "0")).join("")}`;
}
function yE(e, t, n, r) {
	e?.({
		candidatesFound: t,
		currentLocation: `Checking images ${n}/${r}`,
		directoriesVisited: n,
		maxDirectories: r,
		phase: "image-validation"
	});
}
function bE(e) {
	return e.trim().replaceAll("\\", "/").toLocaleLowerCase();
}
//#endregion
//#region src/module/foundry/portrait-search/index.ts
async function xE(e, t) {
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
	return await iE(n, e.priorityFolderPaths, t), e.includeCompendiumAssets && (await rE(n, t), nE(n, t)), e.includeFilePickerAssets && YT(n, t), RT(t, n, {
		currentLocation: "Portrait search complete",
		maxDirectories: n.maxDirectoryBudget,
		phase: "ready"
	}), n.candidates;
}
//#endregion
//#region src/functions/npc-builder/normalize-npc-builder-settings.ts
var SE = {
	...Mp(),
	allowBaseActorCharacteristics: !0,
	allowBaseActorSkills: !0,
	allowBaseActorTalents: !0
};
function CE(e) {
	let t = Mp();
	return TE(e) ? {
		allowBaseActorCharacteristics: EE(e.allowBaseActorCharacteristics, SE.allowBaseActorCharacteristics),
		allowBaseActorSkills: EE(e.allowBaseActorSkills, SE.allowBaseActorSkills),
		allowBaseActorTalents: EE(e.allowBaseActorTalents, SE.allowBaseActorTalents),
		allowBaseActorTraits: EE(e.allowBaseActorTraits, SE.allowBaseActorTraits),
		allowBaseActorTrappings: EE(e.allowBaseActorTrappings, SE.allowBaseActorTrappings),
		askForLinkedSkillSpecializations: EE(e.askForLinkedSkillSpecializations, SE.askForLinkedSkillSpecializations),
		autoSelectGrantedSpells: EE(e.autoSelectGrantedSpells, SE.autoSelectGrantedSpells),
		baseActorFolderUuid: DE(e.baseActorFolderUuid, SE.baseActorFolderUuid),
		excludeFullyTransparentPortraitAssets: EE(e.excludeFullyTransparentPortraitAssets, SE.excludeFullyTransparentPortraitAssets),
		excludedPortraitReferenceImages: pp(Array.isArray(e.excludedPortraitReferenceImages) ? e.excludedPortraitReferenceImages : SE.excludedPortraitReferenceImages),
		includeSpeciesInName: EE(e.includeSpeciesInName, SE.includeSpeciesInName),
		lowerCareerMode: wE(e.lowerCareerMode) ? e.lowerCareerMode : SE.lowerCareerMode,
		outputActorFolderUuid: DE(e.outputActorFolderUuid, SE.outputActorFolderUuid),
		prioritizedPortraitFolders: pp(e.prioritizedPortraitFolders),
		quickTraitFolderUuid: DE(e.quickTraitFolderUuid, SE.quickTraitFolderUuid),
		searchCompendiumPortraitAssets: EE(e.searchCompendiumPortraitAssets, SE.searchCompendiumPortraitAssets),
		searchFoundryPortraitAssets: EE(e.searchFoundryPortraitAssets, SE.searchFoundryPortraitAssets),
		searchWebPortraitAssets: EE(e.searchWebPortraitAssets, SE.searchWebPortraitAssets)
	} : t;
}
function wE(e) {
	return e === "auto-add-all" || e === "never" || e === "prompt";
}
function TE(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function EE(e, t) {
	return typeof e == "boolean" ? e : t;
}
function DE(e, t) {
	return typeof e == "string" ? e : t;
}
//#endregion
//#region src/module/settings/foundry-setting-adapter.ts
function OE(e) {
	return e;
}
function kE(e) {
	game.settings.register(C, e.key, {
		config: e.config ?? !1,
		default: e.defaultValue,
		name: e.name,
		scope: e.scope ?? "world",
		type: Object
	});
}
function AE(e) {
	return e.normalize(game.settings.get(C, e.key));
}
async function jE(e, t) {
	let n = e.normalize(t);
	return await game.settings.set(C, e.key, n), n;
}
//#endregion
//#region src/module/apps/npc-builder/settings.ts
var ME = OE({
	defaultValue: Mp(),
	key: "npcBuilderSettings",
	name: "NPC Builder Settings",
	normalize: CE
});
function NE() {
	kE(ME);
}
function PE() {
	return AE(ME);
}
async function FE(e) {
	return await jE(ME, e);
}
//#endregion
//#region src/module/foundry/drop-data.ts
function IE(e) {
	try {
		return JSON.parse(e);
	} catch {
		throw Error("Foundry drop data could not be read.");
	}
}
//#endregion
//#region src/module/foundry/embedded-items.ts
function LE() {
	return {
		creates: [],
		deletes: [],
		updates: []
	};
}
async function RE(e, t) {
	t.deletes.length && e.deleteEmbeddedDocuments && await e.deleteEmbeddedDocuments("Item", t.deletes), t.updates.length && e.updateEmbeddedDocuments && await e.updateEmbeddedDocuments("Item", t.updates), t.creates.length && await e.createEmbeddedDocuments("Item", t.creates);
}
//#endregion
//#region src/module/apps/npc-builder/xp-source-values.ts
function zE(e, t) {
	return i(e, [[
		"characteristics",
		t,
		"initial",
		"value"
	], [
		"characteristics",
		t,
		"initial"
	]]) + i(e, [[
		"characteristics",
		t,
		"modifier",
		"value"
	], [
		"characteristics",
		t,
		"modifier"
	]]) + i(e, [[
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
async function BE(e, t) {
	let n = {}, r = LE();
	for (let i of t) {
		let t = Math.floor(i.current);
		if (i.kind === "talent") {
			await JE(e, i, t, r);
			continue;
		}
		let a = i.baseAdvances + t;
		if (i.kind === "characteristic") {
			if (t === 0) continue;
			qE(n, i, a);
			continue;
		}
		let o = ET(e, i.name, i.kind);
		if (t === 0 && !i.includedFromCustom && !o) continue;
		if (o) {
			r.updates.push({
				_id: o.id,
				"system.advances.value": a
			});
			continue;
		}
		let s = TT(await YE(i), i.name, i.kind);
		s.type = i.kind, c(s, [
			"system",
			"advances",
			"value"
		], a), r.creates.push(s);
	}
	Object.keys(n).length && await e.update(n), await RE(e, r);
}
function VE(e) {
	let t = e.toObject().system, r = i(t, [["advances", "value"], ["advances"]]);
	if (e.type === "talent") return {
		advances: Math.max(1, r),
		kind: "talent",
		name: e.name,
		sourceUuid: e.uuid,
		talentMaximumFormula: n(t, ["max", "formula"]),
		talentMaximumKey: n(t, ["max", "value"])
	};
	let a = KE(t), o = {
		advances: r,
		kind: "skill",
		name: e.name,
		sourceUuid: e.uuid
	};
	return a && (o.characteristicKey = a, o.characteristicName = u[a]), o;
}
function HE(e) {
	let t = e.toObject().system, n = [];
	for (let [e, r] of Object.entries(u)) {
		let a = i(t, [[
			"characteristics",
			e,
			"advances",
			"value"
		], [
			"characteristics",
			e,
			"advances"
		]]), o = i(t, [[
			"characteristics",
			e,
			"modifier",
			"value"
		], [
			"characteristics",
			e,
			"modifier"
		]]), s = i(t, [[
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
			baseAdvances: a,
			baseModifier: o,
			current: s + o + a,
			kind: "characteristic",
			name: r
		});
	}
	return n;
}
function UE(e, t) {
	return t === "talent" ? WE(e) : e.items?.contents.filter((e) => e.type === t).map((n) => GE(e, n, t)) ?? [];
}
function WE(e) {
	let t = /* @__PURE__ */ new Map();
	for (let r of e.items?.contents.filter((e) => e.type === "talent") ?? []) {
		let e = r.toObject().system, a = r.name.trim().toLocaleLowerCase(), o = i(e, [["advances", "value"], ["advances"]]), s = t.get(a);
		if (s) {
			s.baseAdvances += o, s.current += o;
			continue;
		}
		t.set(a, {
			baseAdvances: o,
			current: o,
			kind: "talent",
			name: r.name,
			talentMaximumFormula: n(e, ["max", "formula"]),
			talentMaximumKey: n(e, ["max", "value"])
		});
	}
	return [...t.values()];
}
function GE(e, t, r) {
	let a = t.toObject().system, o = i(a, [["advances", "value"], ["advances"]]);
	if (r === "talent") return {
		baseAdvances: o,
		current: o,
		kind: r,
		name: t.name,
		talentMaximumFormula: n(a, ["max", "formula"]),
		talentMaximumKey: n(a, ["max", "value"])
	};
	let s = i(a, [["modifier", "value"], ["modifier"]]), c = KE(a), l = {
		baseAdvances: o,
		baseModifier: s,
		current: (c ? zE(e.toObject().system, c) : 0) + o + s,
		kind: r,
		name: t.name
	};
	return c && (l.characteristicKey = c, l.characteristicName = u[c]), l;
}
function KE(e) {
	let t = n(e, ["characteristic", "value"]);
	return f(t) ? t : void 0;
}
function qE(e, t, n) {
	let r = d[t.name.trim().toLocaleLowerCase()];
	r && (e[`system.characteristics.${r}.advances`] = n);
}
async function JE(e, t, n, r) {
	let i = Math.max(0, t.baseAdvances + n), a = DT(e, t.name, "talent"), o = a[0] ?? await YE(t);
	r.deletes.push(...a.map((e) => e.id));
	for (let e = 0; e < i; e += 1) {
		let e = TT(o, t.name, "talent");
		e.type = "talent", c(e, [
			"system",
			"advances",
			"value"
		], 1), r.creates.push(e);
	}
}
async function YE(e) {
	if (e.sourceUuid) {
		let t = await fromUuid(e.sourceUuid);
		if (en(t)) return t;
	}
	return jT(e.name, [e.kind]);
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/traits/config.ts
function XE(e, t) {
	c(e, [
		"system",
		"specification",
		"value"
	], t.specification), t.rollable && !t.damage && c(e, [
		"system",
		"rollable",
		"defaultDifficulty"
	], t.defaultDifficulty), t.damage && t.dice && c(e, [
		"system",
		"rollable",
		"dice"
	], t.dice);
}
function ZE(e, t) {
	return {
		_id: e,
		"system.specification.value": t.specification,
		...t.rollable && !t.damage ? { "system.rollable.defaultDifficulty": t.defaultDifficulty } : {},
		...t.damage && t.dice ? { "system.rollable.dice": t.dice } : {}
	};
}
function QE(e) {
	return {
		...Dd(),
		attackType: nD(e.system, ["rollable", "attackType"]) || "melee",
		bonusCharacteristic: nD(e.system, ["rollable", "bonusCharacteristic"]),
		damage: o(e.system, [["rollable", "damage"]]),
		defaultDifficulty: nD(e.system, ["rollable", "defaultDifficulty"]) || "challenging",
		dice: nD(e.system, ["rollable", "dice"]),
		rollable: o(e.system, [["rollable", "value"]]),
		skill: nD(e.system, ["rollable", "skill"]),
		sl: o(e.system, [["rollable", "SL"]], !0),
		specification: nD(e.system, ["specification", "value"])
	};
}
function $E(e) {
	return tD(e.system);
}
function eD(e) {
	return tD(e.system);
}
function tD(e) {
	return o(e, [["disabled"], ["disabled", "value"]]);
}
function nD(e, n) {
	let r = t(e, n);
	return typeof r == "string" ? r.trim() : typeof r == "number" ? String(r) : "";
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/traits/apply.ts
async function rD(e, t) {
	let n = LE();
	for (let r of t) {
		let t = r.source === "base" ? OT(e, r.sourceUuid, r.name) : ET(e, r.name, "trait");
		if (r.ignored) {
			t && n.deletes.push(t.id);
			continue;
		}
		if (t) {
			n.updates.push(ZE(t.id, r.config));
			continue;
		}
		let i = TT(r.sourceUuid ? await iD(r.sourceUuid) : await jT(r.name, ["trait"]), r.name, "trait");
		i.type = "trait", c(i, ["system", "disabled"], !1), XE(i, r.config), n.creates.push(i);
	}
	await RE(e, n);
}
async function iD(e) {
	let t = await fromUuid(e);
	return en(t) ? t : null;
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/traits/actor-traits.ts
function aD(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && !$E(e)).map(cD) ?? [];
}
function oD(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && $E(e)).map(cD) ?? [];
}
function sD(e) {
	Array.isArray(e.items) && (e.items = e.items.filter((e) => {
		if (typeof e != "object" || !e) return !0;
		let t = e;
		return t.type !== "trait" || !eD(t);
	}));
}
function cD(e) {
	return {
		config: QE(e),
		img: e.img ?? "",
		name: e.name,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/traits/difficulty-options.ts
var lD = [
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
async function uD() {
	let n = t(game.wfrp4e?.config, ["difficultyLabels"]);
	if (!e(n)) return lD;
	let r = Object.entries(n).filter((e) => {
		let [t, n] = e;
		return !!t.trim() && typeof n == "string";
	}).map(([e, t]) => ({
		label: t,
		value: e
	}));
	return r.length ? r : lD;
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/traits/drops.ts
async function dD(e) {
	let t = IE(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Trait item here.");
	let n = rn(await fromUuid(t.uuid), "trait", "Drop a Foundry Trait item here.");
	return {
		config: QE(n),
		ignored: !1,
		key: `custom:${n.uuid}`,
		name: n.name,
		source: "custom",
		sourceUuid: n.uuid
	};
}
//#endregion
//#region src/functions/npc-builder/recommended-quick-traits.ts
var fD = [
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
async function pD(e) {
	return bD(await yD(e, "Actor"));
}
async function mD(e) {
	return bD(await yD(e, "Item"));
}
function hD() {
	return game.folders.contents.filter((e) => e.type === "Actor").map(bD).sort((e, t) => e.name.localeCompare(t.name));
}
function gD() {
	return game.folders.contents.filter((e) => e.type === "Item").map(bD).sort((e, t) => e.name.localeCompare(t.name));
}
function _D(e) {
	return e ? game.folders.contents.find((t) => t.uuid === e) ?? null : null;
}
function vD(e) {
	let t = _D(e);
	return t?.type === "Item" ? t : null;
}
async function yD(e, t) {
	let n = e.trim();
	if (!n) throw Error("Enter a folder name first.");
	let r = game.folders.contents.find((e) => e.type === t && xD(e.name, n));
	if (r) return r;
	let i = await Folder.create({
		name: n,
		type: t
	});
	if (!i) throw Error("Foundry did not create the folder.");
	return i;
}
function bD(e) {
	return {
		name: e.name,
		uuid: e.uuid
	};
}
function xD(e, t) {
	return e.trim().toLocaleLowerCase() === t.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/traits/quick-traits.ts
async function SD(e) {
	let t = vD(e.quickTraitFolderUuid);
	if (!t) throw Error("Choose a Quick Traits item folder before importing traits.");
	let n = new Set(TD(e).map((e) => e.name.trim().toLocaleLowerCase()));
	for (let e of fD) {
		if (n.has(e.trim().toLocaleLowerCase())) continue;
		let r = TT(await jT(e, ["trait"]), e, "trait");
		r.folder = t.id, r.type = "trait", await Item.create(r);
	}
	return ui.notifications?.info("Imported recommended quick traits."), await CD(e);
}
async function CD(e) {
	return TD(e).map(ED).sort((e, t) => e.name.localeCompare(t.name));
}
function wD(e, t) {
	return t.quickTraitFolderUuid ? e.folder?.uuid === t.quickTraitFolderUuid : !1;
}
function TD(e) {
	return game.items?.contents.filter((t) => t.type === "trait" && wD(t, e)) ?? [];
}
function ED(e) {
	return {
		config: QE(e),
		img: e.img ?? "",
		name: e.name,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/trappings.ts
var DD = [
	"ammunition",
	"armour",
	"container",
	"money",
	"trapping",
	"weapon"
];
async function OD(e, t) {
	let n = LE();
	for (let r of t) {
		let t = r.source === "base" ? OT(e, r.sourceUuid, r.name) : null;
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
		let i = await PD(r), a = r.resolution.selectedItemType || r.itemType || "trapping", o = TT(i, r.resolution.selectedName || r.name, a);
		o.type = a || o.type || "trapping", c(o, [
			"system",
			"quantity",
			"value"
		], r.quantity), n.creates.push(o);
	}
	await RE(e, n);
}
async function kD(e) {
	return hm(e, await FD());
}
async function AD(e) {
	let t = IE(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Item here.");
	let n = nn(await fromUuid(t.uuid), "Drop a Foundry Item here.");
	return {
		ignored: !1,
		itemType: n.type,
		key: `custom:${n.uuid}`,
		name: n.name,
		quantity: MD(n),
		resolution: pm({
			itemType: n.type,
			name: n.name,
			uuid: n.uuid
		}),
		source: "custom",
		sourceUuid: n.uuid
	};
}
function jD(e) {
	let t = ND();
	return e.items?.contents.filter((e) => t.includes(e.type)).map((e) => ({
		itemType: e.type,
		name: e.name,
		quantity: MD(e),
		uuid: e.uuid
	})) ?? [];
}
function MD(e) {
	return i(e.system, [["quantity", "value"], ["quantity"]]) || 1;
}
function ND() {
	let e = r(game.wfrp4e?.config, ["trappingItems"]);
	return e.length ? e : DD;
}
async function PD(e) {
	if (e.sourceUuid) {
		let t = await fromUuid(e.sourceUuid);
		return en(t) ? t : null;
	}
	if (e.resolution.selectedCandidateUuid) {
		let t = await fromUuid(e.resolution.selectedCandidateUuid);
		return en(t) ? t : null;
	}
	return e.resolution.status === "fallback" ? null : await jT(e.resolution.selectedName || e.name, ND());
}
async function FD() {
	let e = [], t = ND();
	for (let n of game.items?.contents ?? []) t.includes(n.type) && e.push(LD(n, "World"));
	for (let n of game.packs ?? []) {
		if (!zw(n)) continue;
		let r = await ID(n, t);
		if (r.length) {
			e.push(...r);
			continue;
		}
		if (!n.getDocuments) continue;
		let i = await n.getDocuments();
		for (let r of i) en(r) && t.includes(r.type) && e.push(LD(r, n.title ?? "Compendium"));
	}
	return e;
}
async function ID(e, t) {
	return e.getIndex ? Vw(await e.getIndex({ fields: ["name", "type"] })).filter((n) => !!(n.name && n.type && Rw(e, n) && t.includes(n.type))).map((t) => ({
		itemType: t.type ?? "trapping",
		name: t.name ?? "",
		sourceLabel: e.title ?? "Compendium",
		uuid: Rw(e, t)
	})) : [];
}
function LD(e, t) {
	return {
		itemType: e.type,
		name: e.name,
		sourceLabel: t,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/actors.ts
function RD(e) {
	return game.actors.contents.filter((t) => WD(t, e)).map(VD);
}
async function zD(e) {
	let t = tn(await fromUuid(e));
	return {
		advancements: [
			...HE(t),
			...UE(t, "skill"),
			...UE(t, "talent")
		],
		optionalTraits: oD(t),
		traits: aD(t),
		trappings: jD(t)
	};
}
async function BD(e) {
	let t = IE(e);
	if (t.type !== "Actor") throw Error("Drop a Foundry Actor here.");
	let n = null;
	return t.uuid ? n = await fromUuid(t.uuid) : t.id && (n = game.actors.get(t.id)), VD(tn(n));
}
function VD(e) {
	return {
		img: e.img ?? "",
		name: e.name,
		prototypeTokenImg: UD(e),
		species: HD(e),
		type: e.type,
		uuid: e.uuid
	};
}
function HD(e) {
	return n(e.system, [
		"details",
		"species",
		"value"
	]) || n(e.system, ["details", "species"]) || n(e.system, [
		"details",
		"race",
		"value"
	]) || n(e.system, [
		"details",
		"ancestry",
		"value"
	]);
}
function UD(e) {
	return n(e, [
		"prototypeToken",
		"texture",
		"src"
	]) || n(e.toObject(), [
		"prototypeToken",
		"texture",
		"src"
	]);
}
function WD(e, t) {
	return t.baseActorFolderUuid ? e.folder?.uuid === t.baseActorFolderUuid : !0;
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/careers.ts
async function GD(e) {
	let t = IE(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a WFRP Career item here.");
	return Gw(rn(await fromUuid(t.uuid), "career", "Drop a WFRP Career item here."));
}
async function KD(e) {
	let t = [];
	for (let n of e) {
		let e = rn(await fromUuid(n.uuid), "career", `Career “${n.name}” is no longer available.`);
		for (let r = 0; r < Fd(n.quantity); r += 1) {
			let n = e.toObject();
			delete n._id, c(n, [
				"system",
				"complete",
				"value"
			], !0), c(n, [
				"system",
				"current",
				"value"
			], !1), t.push(n);
		}
	}
	return t;
}
async function qD(e, t) {
	t.length && await e.createEmbeddedDocuments("Item", t);
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/magic/constants.ts
var JD = "spell", YD = new Set(Ip), XD = new Set(Lp);
async function ZD() {
	return QD().map((e) => ({
		category: Hp(e.key),
		key: e.key,
		label: e.name,
		value: e.name,
		wind: e.wind
	})).sort((e, t) => e.category === t.category ? e.label.localeCompare(t.label) : e.category.localeCompare(t.category));
}
function QD() {
	let n = t(game.wfrp4e?.config, ["magicLores"]), r = t(game.wfrp4e?.config, ["magicWind"]), i = [];
	if (!e(n)) return [nO()];
	for (let [e, t] of Object.entries(n)) {
		let n = lO(t) || e, a = cO(r, e);
		i.push({
			key: e,
			matchTerms: sO(e, n, a),
			name: n,
			wind: a
		});
	}
	return i.some((e) => e.key === "petty") || i.push(nO()), i;
}
function $D(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		if (r.isAmbiguous) continue;
		if (r.kind === "petty-magic") {
			let e = oO("petty magic", t);
			e && n.set(e.key, e);
			continue;
		}
		let e = oO(r.rawLore, t);
		e && n.set(e.key, e);
	}
	return [...n.values()];
}
function eO(e, t) {
	let n = [...tO(e.system), aO(e.name)].filter(Boolean);
	for (let e of n) {
		let n = iO(e, t);
		if (n) return n;
		let r = oO(e, t);
		if (r) return r;
	}
	return null;
}
function tO(e) {
	return [
		...s(t(e, ["lore", "value"])),
		...s(t(e, ["lore"])),
		...s(t(e, ["magicLore", "value"])),
		...s(t(e, ["magicLore"])),
		...s(t(e, ["category", "value"])),
		...s(t(e, [
			"system",
			"lore",
			"value"
		])),
		...s(t(e, ["system", "lore"])),
		...s(t(e, ["system.lore.value"])),
		...s(t(e, ["system.lore"]))
	];
}
function nO() {
	return {
		key: "petty",
		matchTerms: ["petty", "petty magic"],
		name: "Petty Magic",
		wind: ""
	};
}
function rO(e) {
	let t = e.trim() || "Unknown Lore";
	return {
		key: zp(t) || "unknown",
		matchTerms: [t],
		name: t,
		wind: ""
	};
}
function iO(e, t) {
	let n = zp(e);
	return n === "lore" ? t.find((e) => e.key !== "petty") ?? null : n === "the eight winds" || n === "eight winds" ? t.find((e) => YD.has(e.key)) ?? null : n === "dark lore" ? t.find((e) => XD.has(e.key)) ?? null : null;
}
function aO(e) {
	return /\(([^)]+)\)\s*$/.exec(e)?.[1]?.trim() ?? "";
}
function oO(e, t) {
	let n = zp(e);
	return n ? t.find((e) => e.matchTerms.some((e) => zp(e) === n)) ?? null : null;
}
function sO(e, t, n) {
	let r = /* @__PURE__ */ new Set(), i = zp(e), a = zp(t);
	for (let i of [
		e,
		t,
		n
	]) i.trim() && r.add(i.trim());
	return (i === "petty" || a === "petty") && r.add("Petty Magic"), (i === "shadow" || a === "shadow") && r.add("Shadows"), t && !/^lore of /i.test(t) && r.add(`Lore of ${t}`), [...r];
}
function cO(t, n) {
	return e(t) ? lO(t[n]) : "";
}
function lO(t) {
	return typeof t == "string" ? t.trim() : e(t) ? n(t, ["name"]) || n(t, ["label"]) || n(t, ["value"]) : "";
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/magic/debug.ts
var uO = "[Drowsy's WFRP4e Customizers][Spell Lookup]";
function dO(e, t) {
	if (t) {
		Fr(`${uO} ${e}`, t);
		return;
	}
	Fr(`${uO} ${e}`);
}
function fO(e, t) {
	Ir(`${uO} ${e}`, t);
}
function pO(e) {
	return [
		e.title ?? "",
		e.collection ?? "",
		n(e, ["metadata", "type"]),
		n(e, ["metadata", "documentName"]),
		e.documentName
	].filter(Boolean).join(" | ");
}
function mO(e) {
	return {
		loreTerms: tO(e.system),
		name: e.name,
		sourceLabel: e.sourceLabel,
		uuid: e.uuid
	};
}
function hO(r) {
	return typeof r == "string" ? {
		kind: "uuid-string",
		value: r
	} : e(r) ? {
		documentName: n(r, ["documentName"]),
		hasSystem: e(t(r, ["system"])),
		loreTerms: tO(t(r, ["system"])),
		name: n(r, ["name"]),
		type: n(r, ["type"]),
		uuid: n(r, ["uuid"])
	} : { kind: typeof r };
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/magic/spell-input-conversion.ts
function gO(e, t) {
	return {
		img: e.img ?? "",
		name: e.name,
		sourceLabel: t,
		system: e.system,
		uuid: e.uuid
	};
}
function _O(e) {
	return /^item\./i.test(e.uuid) ? "World" : vO(e.uuid, "WFRP Item Lookup");
}
function vO(e, t) {
	let n = /^Compendium\.([^.]+\.[^.]+)\./.exec(e)?.[1];
	return n ? [...game.packs ?? []].find((e) => e.collection === n)?.title ?? n : t;
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/magic/compendium-spell-inputs.ts
async function yO(e) {
	if (dO("Compendium index scan start", { pack: pO(e) }), !e.getIndex) return dO("Compendium has no index; loading documents", { pack: pO(e) }), await SO(e);
	let t = Vw(await e.getIndex({ fields: [
		"name",
		"type",
		"img",
		"system.lore.value"
	] }));
	if (dO("Compendium index loaded", {
		entries: t.length,
		pack: pO(e),
		samples: t.slice(0, 5).map((t) => ({
			hasLoreTerms: tO(t).length > 0,
			name: t.name,
			type: t.type,
			uuid: Rw(e, t)
		}))
	}), !t.length) return dO("Compendium index empty; loading documents", { pack: pO(e) }), await SO(e);
	let n = t.filter(xO);
	dO("Compendium index spell candidates", {
		pack: pO(e),
		spellEntries: n.length
	});
	let r = n.filter((e) => e.name).map((t) => wO(e, t));
	return r.length || !CO(e) ? r : await SO(e);
}
function bO(e) {
	return zw(e);
}
function xO(e) {
	return e.type === "spell" ? !0 : !!(e.name && (tO(e).length || aO(e.name)));
}
async function SO(e) {
	if (!e.getDocuments) return dO("Compendium has no document loader", { pack: pO(e) }), [];
	dO("Compendium document load start", { pack: pO(e) });
	let t = await e.getDocuments(), n = t.filter((e) => en(e) && e.type === "spell");
	return dO("Compendium document load complete", {
		documents: t.length,
		pack: pO(e),
		spellDocuments: n.length,
		spellSamples: n.slice(0, 5).map((e) => ({
			loreTerms: tO(e.system),
			name: e.name,
			uuid: e.uuid
		}))
	}), n.map((t) => gO(t, e.title ?? "Compendium"));
}
function CO(e) {
	return e.collection === "wfrp4e-core.items" || e.collection === "wfrp4e-wom.items";
}
function wO(e, t) {
	return {
		img: t.img ?? t.thumb ?? "",
		name: t.name ?? "",
		sourceLabel: e.title ?? "Compendium",
		system: t,
		uuid: Rw(e, t)
	};
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/magic/warhammer-spell-inputs.ts
async function TO() {
	let e = DO();
	if (!e) return dO("WFRP helper unavailable"), [];
	try {
		let t = await e.findAllItems(JD, "Loading Spells", !0, ["system.lore.value"]);
		return dO("WFRP helper raw result", {
			count: t.length,
			samples: t.slice(0, 10).map(hO)
		}), (await Promise.all(t.map((e) => EO(e)))).filter((e) => e !== null);
	} catch (e) {
		return fO("WFRP helper lookup failed.", e), [];
	}
}
async function EO(e) {
	if (typeof e == "string") {
		let t = await fromUuid(e);
		return en(t) && t.type === "spell" ? gO(t, _O(t)) : null;
	}
	if (en(e)) return e.type === "spell" ? gO(e, _O(e)) : null;
	if (n(e, ["type"]) !== "spell") return null;
	let r = n(e, ["name"]);
	return r ? {
		img: n(e, ["img"]) || n(e, ["thumb"]),
		name: r,
		sourceLabel: vO(n(e, ["uuid"]), "WFRP Item Lookup"),
		system: t(e, ["system"]),
		uuid: n(e, ["uuid"])
	} : null;
}
function DO() {
	let e = t(globalThis, [
		"warhammer",
		"utility",
		"findAllItems"
	]);
	return typeof e == "function" ? { findAllItems: e } : null;
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/magic/spell-resolution-inputs.ts
async function OO() {
	let e = [], t = [...game.packs ?? []];
	dO("Candidate lookup start", {
		itemPacks: t.filter(bO).length,
		totalPacks: t.length,
		warhammerUtilityAvailable: !!jO(),
		worldItems: game.items?.contents.length ?? 0
	});
	let n = await TO();
	dO("WFRP helper lookup complete", {
		utilityInputs: n.length,
		utilitySamples: n.slice(0, 10).map(mO)
	}), e.push(...n), e.push(...kO()), dO("World spell scan complete", { worldSpellCount: e.filter((e) => e.sourceLabel === "World").length });
	for (let n of t) if (bO(n)) try {
		let t = await yO(n);
		e.push(...t), dO("Compendium spell scan complete", {
			inputCount: t.length,
			pack: pO(n),
			samples: t.slice(0, 5).map(mO)
		});
	} catch (e) {
		Ir(`wfrp4e-customizer-apps | Spell lookup skipped compendium "${n.title ?? n.collection ?? "unknown"}".`, e);
	}
	let r = AO(e);
	return dO("Candidate lookup complete", {
		rawInputCount: e.length,
		uniqueInputCount: r.length
	}), r;
}
function kO() {
	let e = [];
	for (let t of game.items?.contents ?? []) t.type === "spell" && e.push(gO(t, "World"));
	return e;
}
function AO(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.uuid || n.name.trim().toLocaleLowerCase();
		t.has(e) || t.set(e, n);
	}
	return [...t.values()];
}
function jO() {
	return t(globalThis, [
		"warhammer",
		"utility",
		"findAllItems"
	]);
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/magic/index.ts
async function MO(e, t) {
	let n = [];
	for (let r of t) {
		if (!r.selected || ET(e, r.name, "spell")) continue;
		let t = TT(r.sourceUuid ? await FO(r.sourceUuid) : null, r.name, JD);
		t.type = JD, n.push(t);
	}
	n.length && await e.createEmbeddedDocuments("Item", n);
}
async function NO(e) {
	let t = $D(e, QD());
	if (dO("Grant resolution start", {
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
	let n = await OO(), r = /* @__PURE__ */ new Map(), i = [];
	for (let e of n) {
		let n = eO(e, t);
		if (!n) {
			i.length < 20 && i.push({
				loreTerms: tO(e.system),
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
	return dO("Grant resolution complete", {
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
async function PO(e) {
	let t = IE(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Spell item here.");
	let n = rn(await fromUuid(t.uuid), JD, "Drop a Foundry Spell item here."), r = eO(gO(n, "Dropped"), [...QD(), nO()]) ?? rO(tO(n.system)[0] ?? "");
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
async function FO(e) {
	let t = await fromUuid(e);
	return en(t) && t.type === "spell" ? t : null;
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/mounts/trait-sources.ts
var IO = "generatedMountTrait";
function LO(e, t) {
	return t.traits.flatMap((t) => {
		if (!t.included || ty(t.name)) return [];
		let n = RO(e, t);
		if (!n) return [];
		let r = n.toObject();
		return delete r._id, r.name = t.outputName, c(r, ["system", "disabled"], !1), c(r, [
			"flags",
			C,
			IO
		], {
			mountUuid: e.uuid,
			sourceTraitUuid: t.sourceUuid
		}), t.fixedDamage !== null && zO(r, t.fixedDamage), [r];
	});
}
function RO(e, t) {
	return e.items?.contents.find((e) => e.type === "trait" && e.uuid === t.sourceUuid) ?? null;
}
function zO(e, t) {
	c(e, [
		"system",
		"specification",
		"value"
	], String(t)), c(e, [
		"system",
		"rollable",
		"bonusCharacteristic"
	], ""), c(e, [
		"system",
		"rollable",
		"rollCharacteristic"
	], "ws"), c(e, [
		"system",
		"rollable",
		"skill"
	], "");
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/mounts/armour.ts
async function BO(e, t, n, r) {
	let i = e.items?.contents.filter(UO) ?? [], a = r.traits.filter((e) => e.included && ty(e.name)), o = VO(i), s = HO(n, a), l = Math.max(o.value, s.value) + 1;
	if (o.item && e.updateEmbeddedDocuments) {
		await e.updateEmbeddedDocuments("Item", [{
			_id: o.item.id,
			"system.specification.value": String(l)
		}]);
		return;
	}
	let u = TT((s.contribution ? RO(t, s.contribution) : null) ?? await jT("Armour", ["trait"]), "Armour", "trait");
	u.name = "Armour", u.type = "trait", c(u, ["system", "disabled"], !1), c(u, [
		"system",
		"specification",
		"value"
	], String(l)), await e.createEmbeddedDocuments("Item", [u]);
}
function VO(e) {
	return e.reduce((e, t) => {
		let n = i(t.system, [["specification", "value"]]);
		return n > e.value ? {
			item: t,
			value: n
		} : e;
	}, {
		item: null,
		value: 0
	});
}
function HO(e, t) {
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
function UO(e) {
	return e.type === "trait" && ty(e.name);
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/mounts/profile.ts
var WO = new Set(Object.values(Qv));
async function GO(e) {
	return KO(tn(await fromUuid(e)));
}
function KO(e) {
	return {
		characteristics: {
			initiative: XO(e, "i"),
			strength: XO(e, "s"),
			strengthBonus: ZO(e, "s"),
			toughness: XO(e, "t")
		},
		img: e.img ?? "",
		movement: i(e.system, [[
			"details",
			"move",
			"value"
		]]),
		name: e.name,
		size: QO(e),
		traits: qO(e),
		uuid: e.uuid,
		wounds: i(e.system, [[
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
function qO(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && !$O(e)).map((t) => JO(e, t)).sort((e, t) => e.name.localeCompare(t.name)) ?? [];
}
function JO(e, t) {
	let r = o(t.system, [["rollable", "damage"]]), i = n(t.system, ["specification", "value"]);
	return {
		damage: r,
		fixedDamage: r ? YO(e, t, i) : null,
		name: t.name,
		specification: i,
		uuid: t.uuid
	};
}
function YO(e, t, r) {
	let i = a(t, [["Damage"]]);
	if (i !== null) return i;
	let o = Number(r), s = n(t.system, ["rollable", "bonusCharacteristic"]);
	return (Number.isFinite(o) ? o : 0) + (s ? ZO(e, s) : 0);
}
function XO(e, t) {
	return i(e.system, [[
		"characteristics",
		t,
		"value"
	], [
		"characteristics",
		t,
		"initial"
	]]);
}
function ZO(e, t) {
	return a(e.system, [[
		"characteristics",
		t,
		"bonus"
	]]) ?? Math.floor(XO(e, t) / 10);
}
function QO(e) {
	let t = n(e.system, [
		"details",
		"size",
		"value"
	]);
	return WO.has(t) ? t : Qv.Average;
}
function $O(e) {
	return o(e.system, [["disabled"], ["disabled", "value"]]);
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/mounts/apply.ts
var ek = {
	avg: 1,
	enor: 3,
	lrg: 2,
	ltl: .5,
	mnst: 4,
	sml: .8,
	tiny: .3
};
async function tk(e, t) {
	let n = tn(await fromUuid(t));
	if (e.uuid === n.uuid) throw Error("The rider and mount must be different Actors.");
	let r = KO(e), i = KO(n), a = dy(r, i);
	await e.update(nk(e, a));
	let o = LO(n, a);
	o.length && await e.createEmbeddedDocuments("Item", o), await BO(e, n, i, a), await e.createEmbeddedDocuments("Item", [hy({
		flagScope: C,
		mount: i,
		plan: a,
		rider: r
	})]), await e.update({
		"system.status.wounds.max": a.wounds,
		"system.status.wounds.value": a.wounds
	});
}
function nk(e, t) {
	let n = ek[t.size] ?? 1;
	return {
		"prototypeToken.height": n,
		"prototypeToken.width": n,
		"system.characteristics.i.modifier": rk(e, "i") + t.initiative - ik(e, "i"),
		"system.characteristics.t.modifier": rk(e, "t") + t.toughness - ik(e, "t"),
		"system.details.move.value": t.movement
	};
}
function rk(e, t) {
	return i(e.system, [[
		"characteristics",
		t,
		"modifier"
	]]);
}
function ik(e, t) {
	return i(e.system, [[
		"characteristics",
		t,
		"value"
	]]);
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/mounts/actors.ts
function ak() {
	return game.actors.contents.map(VD).sort((e, t) => e.name.localeCompare(t.name));
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/build-npc.ts
async function ok(e) {
	if (e.mountActorUuid && e.mountActorUuid === e.baseActorUuid) throw Error("The rider and mount must be different Actors.");
	let t = await KD(e.careers), r = await ck(e);
	if (!r) throw Error("Foundry did not create the NPC Actor.");
	let i = lk(e), a = e.careers.at(-1), o = {
		name: i,
		"prototypeToken.name": i
	}, s = n(r.system, [
		"details",
		"gmnotes",
		"value"
	]), c = sk(s);
	c !== s && (o["system.details.gmnotes.value"] = c);
	let l = e.portraitPath || a?.img || "";
	return l && (o.img = l, o["prototypeToken.texture.src"] = l), await r.update(o), await qD(r, t), await BE(r, e.advancements), await rD(r, e.traits), e.mountActorUuid && await tk(r, e.mountActorUuid), await OD(r, e.trappings), await MO(r, e.spells), r.sheet?.render(!0), ui.notifications?.info(`Created NPC "${i}".`), {
		name: i,
		uuid: r.uuid
	};
}
function sk(e) {
	return e.replaceAll(/(?:<hr\s*\/?>)?<section data-wfrp-customizer-npc-xp="true">[\S\s]*?<\/section>/g, "").trim();
}
async function ck(e) {
	let t = tn(await fromUuid(e.baseActorUuid)).toObject(), n = _D(e.settings.outputActorFolderUuid);
	return delete t._id, delete t.folder, t.type = "npc", sD(t), n && (t.folder = n.id), await Actor.create(t);
}
function lk(e) {
	if (!e.settings.includeSpeciesInName) return e.actorName;
	let t = game.actors.contents.find((t) => t.uuid === e.baseActorUuid), n = t ? HD(t) : "";
	return !n || e.actorName.toLocaleLowerCase().includes(n.toLocaleLowerCase()) ? e.actorName : `${n} ${e.actorName}`;
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/document-drops.ts
async function uk(e) {
	let t = IE(e);
	if (t.type === "Actor") return {
		actor: await BD(e),
		kind: "actor"
	};
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Actor or WFRP Item.");
	let n = nn(await fromUuid(t.uuid), "Drop a Foundry Item.");
	if (n.type === "career") return {
		career: await GD(e),
		kind: "career"
	};
	if (n.type === "skill" || n.type === "talent") return {
		advancement: VE(n),
		kind: "advancement"
	};
	if (n.type === "trait") return {
		kind: "trait",
		trait: await dD(e)
	};
	if (n.type === "spell") return {
		kind: "spell",
		spell: await PO(e)
	};
	if (ND().includes(n.type)) return {
		kind: "trapping",
		trapping: await AD(e)
	};
	throw Error("Drop an Actor, Career, Skill, Talent, Trait, Trapping, or Spell Item.");
}
//#endregion
//#region src/module/apps/npc-builder/foundry-bridge/index.ts
var dk = {
	buildNpc: ok,
	ensureActorFolder: pD,
	ensureItemFolder: mD,
	findLowerCareerCandidates: $w,
	filterPortraitCandidates: mE,
	getPortraitSearchAvailability: async () => XT(),
	importRecommendedQuickTraits: SD,
	listActorFolders: async () => hD(),
	listBaseActors: async (e) => RD(e),
	listFoundryPortraitCandidates: xE,
	listMagicLoreOptions: ZD,
	listMountActors: async () => ak(),
	listSpellsForMagicGrants: NO,
	listItemFolders: async () => gD(),
	listQuickTraits: CD,
	listSkillCharacteristics: hT,
	listSkillSpecializations: mT,
	listTalentMaximums: MT,
	listTraitDifficultyOptions: uD,
	loadBaseActorDraftData: zD,
	loadActorCombatProfile: GO,
	loadSettings: async () => PE(),
	resolveActorDrop: BD,
	resolveApplicationDrop: uk,
	resolveCareerDrop: GD,
	resolveSpellDrop: PO,
	resolveTraitDrop: dD,
	resolveTrapping: kD,
	resolveTrappingDrop: AD,
	saveSettings: FE
}, fk = class extends Aw {
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${C}-npc-builder`,
		classes: [C, "wfrp4e-customizer-npc-builder"],
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
		return hw;
	}
	getVueProps() {
		return { bridge: dk };
	}
}, pk = "wfrp4e-customizer-open-npc-builder";
function mk() {
	Hooks.on("renderActorDirectory", (e, t) => {
		let n = vk(t);
		n && hk(n);
	});
}
function hk(e) {
	let t = _k(e);
	if (!t) {
		Ir("wfrp4e-customizer-apps | Could not find Actor Directory button container.");
		return;
	}
	gk(e, t);
}
function gk(e, t) {
	if (e.querySelector(`.${pk}`)) return;
	let n = document.createElement("button");
	n.classList.add(pk, "wfrp4e-customizer-actor-directory-button"), n.type = "button", n.innerHTML = "<i class=\"fa-solid fa-user-plus\" inert></i><span>NPC Builder App</span>", n.addEventListener("click", () => {
		new fk().render(!0);
	}), t.append(n);
}
function _k(e) {
	return e.querySelector(".directory-header .header-actions") ?? e.querySelector(".directory-header .action-buttons") ?? e.querySelector(".header-actions") ?? e.querySelector(".action-buttons");
}
function vk(e) {
	return e instanceof HTMLElement ? e : yk(e) && e[0] instanceof HTMLElement ? e[0] : null;
}
function yk(e) {
	return typeof e == "object" && !!e && "length" in e;
}
//#endregion
//#region src/view/apps/actor-portrait-gallery/ActorPortraitGalleryApp.vue?vue&type=script&setup=true&lang.ts
var bk = { class: "app:flex app:h-full app:min-h-0 app:flex-col" }, xk = { class: "dui-navbar app:sticky app:top-0 app:z-10 app:min-h-0 app:gap-2 app:bg-base-100 app:px-3 app:py-2 app:shadow-sm" }, Sk = { class: "dui-navbar-start app:min-w-0 app:flex-1 app:gap-2" }, Ck = { class: "app:m-0 app:truncate app:text-lg app:font-semibold" }, wk = {
	key: 0,
	class: "dui-badge dui-badge-success dui-badge-sm"
}, Tk = { class: "dui-navbar-end app:w-auto app:gap-2" }, Ek = ["alt", "src"], Dk = ["disabled"], Ok = {
	key: 0,
	"aria-hidden": "true",
	class: "fa-solid fa-spinner fa-spin"
}, kk = {
	key: 1,
	"aria-hidden": "true",
	class: "fa-solid fa-layer-group"
}, Ak = ["disabled"], jk = ["disabled"], Mk = ["disabled"], Nk = { class: "app:min-h-0 app:flex-1 app:p-2" }, Pk = /* @__PURE__ */ U({
	__name: "ActorPortraitGalleryApp",
	props: {
		bridge: {},
		context: {}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ B(""), r = /* @__PURE__ */ B(""), i = /* @__PURE__ */ B(null), a = /* @__PURE__ */ B(null), o = /* @__PURE__ */ B(t.context.selectedPortraitPath), s = /* @__PURE__ */ B(t.context.currentPortraitPath), c = /* @__PURE__ */ B(t.context.currentTokenPath), l = null, u = null, d = Ap(), f = Wv({
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
		Qo(o, () => {
			n.value = "", r.value = "";
		}), ws(w);
		function _(e) {
			o.value = e.img;
		}
		async function v(e) {
			if (!(!o.value || i.value || !b(e))) {
				te(), i.value = e, n.value = "", r.value = "";
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
			te(), v(e);
		}
		function b(e) {
			return e === "portrait" ? p.value : e === "token" ? m.value : h.value;
		}
		function x(e) {
			return e === "portrait" ? "Portrait updated." : e === "token" ? "Prototype token updated." : "Portrait and token updated.";
		}
		function S() {
			w(), l = window.setTimeout(C, 650);
		}
		function ee() {
			w(), u = window.setTimeout(te, 180);
		}
		function C() {
			w(), a.value && !a.value.matches(":popover-open") && a.value.showPopover();
		}
		function te() {
			w(), a.value?.matches(":popover-open") && a.value.hidePopover();
		}
		function w() {
			l !== null && (window.clearTimeout(l), l = null), u !== null && (window.clearTimeout(u), u = null);
		}
		return (t, s) => (K(), q("section", bk, [Y("header", xk, [Y("div", Sk, [Y("h1", Ck, L(e.context.actorName), 1), r.value ? (K(), q("span", wk, L(r.value), 1)) : Q("", !0)]), Y("div", Tk, [
			o.value ? (K(), q("img", {
				key: 0,
				alt: `${g.value} preview`,
				class: "app:aspect-square app:w-10 app:rounded-box app:bg-base-300 app:object-cover",
				height: "40",
				src: o.value,
				width: "40"
			}, null, 8, Ek)) : Q("", !0),
			Y("div", {
				class: "dui-join",
				onFocusin: C,
				onFocusout: ee,
				onPointerenter: S,
				onPointerleave: ee
			}, [Y("button", {
				class: "dui-btn dui-btn-primary dui-btn-sm dui-join-item",
				disabled: !h.value || !!i.value,
				type: "button",
				onClick: s[0] ||= (e) => v("both")
			}, [i.value === "both" ? (K(), q("i", Ok)) : (K(), q("i", kk)), Z(" " + L(i.value === "both" ? "Applying..." : "Apply to Both"), 1)], 8, Dk), Y("button", {
				"aria-label": "More apply options",
				class: "dui-btn dui-btn-primary dui-btn-sm dui-btn-square dui-join-item",
				disabled: !o.value || !!i.value,
				popovertarget: "actor-portrait-apply-menu",
				style: { "anchor-name": "--actor-portrait-apply-menu" },
				type: "button"
			}, [...s[3] ||= [Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-chevron-down"
			}, null, -1)]], 8, Ak)], 32),
			Y("ul", {
				id: "actor-portrait-apply-menu",
				ref_key: "applyMenu",
				ref: a,
				class: "dui-dropdown dui-dropdown-end dui-menu dui-menu-sm app:z-20 app:mt-1 app:w-52 app:rounded-box app:bg-base-100 app:p-2 app:shadow-lg",
				popover: "",
				style: { "position-anchor": "--actor-portrait-apply-menu" },
				onFocusin: C,
				onFocusout: ee,
				onPointerenter: C,
				onPointerleave: ee
			}, [Y("li", null, [Y("button", {
				disabled: !p.value || !!i.value,
				type: "button",
				onClick: s[1] ||= (e) => y("portrait")
			}, [...s[4] ||= [Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-image"
			}, null, -1), Z(" Portrait only ", -1)]], 8, jk)]), Y("li", null, [Y("button", {
				disabled: !m.value || !!i.value,
				type: "button",
				onClick: s[2] ||= (e) => y("token")
			}, [...s[5] ||= [Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-circle"
			}, null, -1), Z(" Token only ", -1)]], 8, Mk)])], 544)
		])]), Y("main", Nk, [X(vv, {
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
}), Fk = {
	applyActorPortrait: Ik,
	filterPortraitCandidates: mE,
	listPortraitCandidates: xE
};
async function Ik(e, t, n) {
	await tn(await fromUuid(e), "The Actor for this portrait gallery is no longer available.").update(Lk(t, n));
}
function Lk(e, t) {
	return t === "portrait" ? { img: e } : t === "token" ? { "prototypeToken.texture.src": e } : {
		img: e,
		"prototypeToken.texture.src": e
	};
}
//#endregion
//#region src/module/apps/actor-portrait-gallery/context.ts
function Rk(e, t) {
	let r = e.img?.trim() ?? "", i = zT(e), a = (e.items?.contents ?? []).filter((e) => e.type === "career"), o = n(e.system, [
		"details",
		"career",
		"name"
	]), s = [
		e.name,
		n(e, ["Species"]),
		n(e.system, [
			"details",
			"species",
			"value"
		]),
		n(e.system, [
			"details",
			"species",
			"subspecies"
		]),
		o,
		n(e.system, [
			"details",
			"career",
			"careergroup",
			"value"
		]),
		n(e.system, [
			"details",
			"career",
			"class",
			"value"
		]),
		...a.flatMap(Bk)
	];
	return {
		actorName: e.name,
		actorUuid: e.uuid,
		currentPortraitPath: r,
		currentTokenPath: i,
		excludeFullyTransparentImages: t.excludeFullyTransparentPortraitAssets,
		excludedReferenceImagePaths: [...t.excludedPortraitReferenceImages],
		immediateCandidates: zk(e, r, i),
		includeCompendiumAssets: t.searchCompendiumPortraitAssets,
		includeFilePickerAssets: t.searchFoundryPortraitAssets,
		priorityFolderPaths: mp({
			configuredFolders: t.prioritizedPortraitFolders,
			hasCareer: !!o || a.length > 0
		}),
		searchTerms: fp(s),
		selectedPortraitPath: r || i
	};
}
function zk(e, t, n) {
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
	}), ep(r);
}
function Bk(e) {
	return [
		e.name,
		n(e.system, ["careergroup", "value"]),
		n(e.system, ["class", "value"])
	];
}
//#endregion
//#region src/module/apps/actor-portrait-gallery/ActorPortraitGalleryApplication.ts
var Vk = class extends Aw {
	actor;
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${C}-actor-portrait-gallery`,
		classes: [C, "wfrp4e-customizer-actor-portrait-gallery"],
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
		return Pk;
	}
	getVueProps() {
		return {
			bridge: Fk,
			context: Rk(this.actor, PE())
		};
	}
};
//#endregion
//#region src/module/apps/actor-portrait-gallery/open.ts
async function Hk(e) {
	await new Vk(tn(await fromUuid(e), "The requested Actor could not be opened in the portrait gallery.")).render(!0);
}
async function Uk(e) {
	await new Vk(e).render(!0);
}
//#endregion
//#region src/module/apps/actor-portrait-gallery/register-actor-sheet-button.ts
var Wk = "openWfrpCustomizerPortraitGallery", Gk = "wfrp4e-customizer-actor-portrait-gallery-header", Kk = [
	"getHeaderControlsActorSheetWFRP4eCharacter",
	"getHeaderControlsActorSheetWFRP4eNPC",
	"getHeaderControlsActorSheetWFRP4eCreature",
	"getHeaderControlsStandardWFRP4eActorSheet",
	"getHeaderControlsBaseWFRP4eActorSheet",
	"getHeaderControlsWarhammerActorSheetV2"
], qk = [
	"renderActorSheetWFRP4eCharacter",
	"renderActorSheetWFRP4eNPC",
	"renderActorSheetWFRP4eCreature",
	"renderStandardWFRP4eActorSheet",
	"renderBaseWFRP4eActorSheet",
	"renderWarhammerActorSheetV2"
], Jk = !1;
function Yk() {
	if (!Jk) {
		Jk = !0;
		for (let e of Kk) Hooks.on(e, Xk);
		for (let e of qk) Hooks.on(e, Zk);
	}
}
function Xk(e, t) {
	let n = Qk(e);
	if (!n || !Array.isArray(t) || n.isOwner === !1) return;
	let r = t;
	r.some((e) => e.action === Wk) || r.push({
		action: Wk,
		icon: "fa-solid fa-images",
		label: "Choose Portrait & Token"
	});
	let i = e;
	i.options ??= {}, i.options.actions ??= {}, i.options.actions[Wk] = function() {
		let e = Qk(this);
		e && eA(e);
	};
}
function Zk(e) {
	let t = Qk(e), n = $k(e);
	if (!t || !n || t.isOwner === !1) return;
	let r = n.querySelector(".window-header");
	if (!r || r.querySelector(`.${Gk}, [data-action="${Wk}"]`)) return;
	let i = document.createElement("button");
	i.type = "button", i.classList.add(Gk, "header-control", "icon", "fa-solid", "fa-images"), i.dataset.action = Wk, i.dataset.tooltip = "Choose Portrait & Token", i.ariaLabel = `Choose a portrait and prototype token for ${t.name}`, i.addEventListener("click", (e) => {
		e.preventDefault(), e.stopPropagation(), eA(t);
	});
	let a = r.querySelector("[data-action=\"toggleControls\"]") ?? r.querySelector("[data-action=\"close\"]");
	r.insertBefore(i, a);
}
function Qk(e) {
	if (typeof e != "object" || !e) return null;
	let t = "document" in e ? e.document : void 0, n = "actor" in e ? e.actor : void 0;
	return $t(t) ? t : $t(n) ? n : null;
}
function $k(e) {
	return typeof e != "object" || !e || !("element" in e) ? null : e.element instanceof HTMLElement ? e.element : null;
}
async function eA(e) {
	try {
		await Uk(e);
	} catch (e) {
		Ir("wfrp4e-customizer-apps | Actor portrait gallery could not be opened.", e), ui.notifications?.warn?.("The portrait gallery could not be opened. See the console for details.");
	}
}
//#endregion
//#region src/module/apps/npc-builder/estimated-xp/actor-profile.ts
function tA(e) {
	let t = e.toObject(), n = {};
	for (let e of Object.keys(u)) {
		let r = e;
		n[r] = zE(t.system, r);
	}
	return {
		characteristics: n,
		skills: nA(e, "skill"),
		talents: nA(e, "talent")
	};
}
function nA(e, t) {
	return e.items?.contents.filter((e) => e.type === t).map((e) => ({
		name: e.name,
		value: t === "skill" ? rA(e.toObject().system) : iA(e.toObject().system)
	})) ?? [];
}
function rA(e) {
	return i(e, [["advances", "value"], ["advances"]]) + i(e, [["modifier", "value"], ["modifier"]]);
}
function iA(e) {
	return i(e, [["advances", "value"], ["advances"]]);
}
//#endregion
//#region src/module/apps/npc-builder/estimated-xp/species-actor.ts
var aA = null;
async function oA(e, t, n) {
	let r = game.actors.contents, i = sA(n ? r.filter((e) => e.folder?.uuid === n) : [], e);
	if (i) return {
		actor: i,
		source: i.folder?.name ?? "Configured NPC Base Actors folder"
	};
	let a = sA(r.filter((e) => e.uuid !== t.uuid), e);
	if (a) return {
		actor: a,
		source: "World Actors"
	};
	let o = cA(await uA(), e);
	if (!o) return null;
	let s = await fromUuid(o.uuid);
	if (!fA(s)) throw Error(`The species Actor ${o.uuid} is no longer available.`);
	return {
		actor: s,
		source: o.source
	};
}
function sA(e, t) {
	return lA(e, t, (e) => e.name);
}
function cA(e, t) {
	return lA(e, t, (e) => e.name);
}
function lA(e, t, n) {
	let r = t.trim();
	return e.find((e) => n(e).trim() === r) ?? e.find((e) => Pd(n(e)) === Pd(t)) ?? null;
}
function uA() {
	return aA ??= dA(), aA;
}
async function dA() {
	let e = [];
	for (let t of game.packs ?? []) {
		if (!Bw(t) || !t.getIndex) continue;
		let n = await t.getIndex({ fields: ["name"] });
		for (let r of Vw(n)) {
			let n = Rw(t, r);
			r.name && n && e.push({
				name: r.name,
				source: t.title ?? t.collection ?? "Actor Compendium",
				uuid: n
			});
		}
	}
	return e;
}
function fA(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Actor";
}
//#endregion
//#region src/module/apps/npc-builder/estimated-xp/estimate.ts
async function pA(e) {
	let t = tn(await fromUuid(e), "Expected an NPC Actor.");
	if (t.type !== "npc") throw Error(`Expected an NPC Actor, but received Actor type “${t.type}”.`);
	return await mA(t);
}
async function mA(e) {
	let t = HD(e);
	if (!t) return { status: "missing-species" };
	let n = await oA(t, e, PE().baseActorFolderUuid);
	return n ? {
		baselineName: n.actor.name,
		baselineSource: n.source,
		baselineUuid: n.actor.uuid,
		breakdown: kf(tA(e), tA(n.actor)),
		species: t,
		status: "ready"
	} : {
		species: t,
		status: "baseline-not-found"
	};
}
//#endregion
//#region src/module/apps/npc-builder/estimated-xp/sheet.ts
var hA = "[data-wfrp-customizer-npc-xp=\"true\"]", gA = /* @__PURE__ */ new Set(), _A = !1, vA = !1;
function yA() {
	if (!_A) {
		_A = !0, Hooks.on("renderApplicationV2", (e, t) => {
			if (!(t instanceof HTMLElement)) return;
			let n = wA(e);
			n && bA(n, t);
		});
		for (let e of [
			"createActor",
			"updateActor",
			"deleteActor",
			"createItem",
			"updateItem",
			"deleteItem",
			"updateSetting"
		]) Hooks.on(e, TA);
	}
}
function bA(e, t) {
	let n = t.matches("section[data-tab=\"careers\"]") ? t : t.querySelector("section[data-tab=\"careers\"]");
	if (!n) return;
	n.querySelector(hA)?.remove();
	let r = xA(e, t), i = n.querySelector(".sheet-list.careers");
	i ? n.insertBefore(r.container, i) : n.append(r.container), EA(), SA(r), globalThis.setTimeout(() => {
		r.root.isConnected && r.root.contains(r.container) && (EA(), gA.add(r));
	}, 0);
}
function xA(e, t) {
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
async function SA(e) {
	let t = ++e.generation;
	e.output.value = "Calculating…";
	try {
		let n = await mA(e.actor);
		t === e.generation && e.root.contains(e.container) && CA(e, n);
	} catch (n) {
		t === e.generation && e.root.contains(e.container) && (e.output.value = "Unavailable", e.details.textContent = "XP calculation failed; see the console for details."), Ir("wfrp4e-customizer-apps | NPC XP calculation failed.", n);
	}
}
function CA(e, t) {
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
function wA(e) {
	if (typeof e != "object" || !e) return null;
	let t = "actor" in e ? e.actor : void 0, n = "document" in e ? e.document : void 0, r = $t(t) ? t : $t(n) ? n : null;
	return r?.type === "npc" ? r : null;
}
function TA() {
	vA || (vA = !0, globalThis.setTimeout(() => {
		vA = !1, EA();
		for (let e of gA) SA(e);
	}, 0));
}
function EA() {
	for (let e of gA) (!e.root.isConnected || !e.root.contains(e.container)) && gA.delete(e);
}
//#endregion
//#region src/functions/species-builder/characteristic-roll-formulas.ts
var DA = "2d10";
function OA(e) {
	let t = e?.split("+")[0]?.trim();
	return t ? AA(t) : DA;
}
function kA(e, t) {
	return OA(e) === OA(t);
}
function AA(e) {
	return e.replaceAll(/\s+/g, "").toLocaleLowerCase();
}
//#endregion
//#region src/module/apps/species-builder/chargen-roll-swap-feedback.ts
var jA = "data-wfrp4e-customizer-roll-swap-feedback", MA = `[${jA}="blocked"]`, NA = /* @__PURE__ */ new WeakMap();
function PA(e, t) {
	let n = VA(e);
	if (n) for (let e of BA(n)) e.addEventListener("dragstart", () => {
		let r = e.dataset.ch;
		r && FA(n, r, t);
	}), e.addEventListener("dragend", () => {
		LA(n);
	}), e.addEventListener("drop", () => {
		LA(n);
	});
}
function FA(e, t, n) {
	LA(e);
	for (let r of BA(e)) {
		let e = r.dataset.ch;
		e && (e === t || n(t, e) || IA(r));
	}
}
function IA(e) {
	NA.set(e, {
		ariaDisabled: e.getAttribute("aria-disabled"),
		borderColor: e.style.getPropertyValue("border-color"),
		borderColorPriority: e.style.getPropertyPriority("border-color"),
		hadDisabledClass: e.classList.contains("disabled")
	}), e.setAttribute(jA, "blocked"), e.setAttribute("aria-disabled", "true"), e.classList.add("disabled"), e.style.setProperty("border-color", "transparent");
}
function LA(e) {
	for (let t of e.querySelectorAll(MA)) {
		let e = NA.get(t);
		e && (e.hadDisabledClass || t.classList.remove("disabled"), RA(t, "aria-disabled", e.ariaDisabled), zA(t, "border-color", e.borderColor, e.borderColorPriority), t.removeAttribute(jA), NA.delete(t));
	}
}
function RA(e, t, n) {
	if (n === null) {
		e.removeAttribute(t);
		return;
	}
	e.setAttribute(t, n);
}
function zA(e, t, n, r) {
	if (!n) {
		e.style.removeProperty(t);
		return;
	}
	e.style.setProperty(t, n, r);
}
function BA(e) {
	return [...e.querySelectorAll(".ch-roll.ch-drag")];
}
function VA(t) {
	if (t instanceof HTMLElement) return t;
	if (!e(t)) return;
	let n = t[0];
	return n instanceof HTMLElement ? n : void 0;
}
//#endregion
//#region src/module/apps/species-builder/chargen-roll-swap-guard.ts
var HA = Symbol("wfrp4e-customizer-guarded-attributes-stage");
function UA() {
	Hooks.on("wfrp4e:chargen", (e) => {
		WA(e);
	});
}
function WA(e) {
	let t = GA(e);
	if (!t) {
		Ir(`${C} | Could not inspect WFRP character generation stages.`);
		return;
	}
	let n = KA(t);
	if (!n) {
		Ir(`${C} | Could not find the WFRP Attributes character generation stage.`);
		return;
	}
	if (qA(n.class)) return;
	let r = JA(n.class);
	typeof t.replaceStage == "function" ? t.replaceStage("attributes", r) : n.class = r, Fr(`${C} | Guarded WFRP characteristic roll swapping for custom species.`);
}
function GA(t) {
	if (!e(t)) return;
	let n = {}, r = t.replaceStage;
	return typeof r == "function" && (n.replaceStage = (e, n) => {
		r.call(t, e, n);
	}), Array.isArray(t.stages) && (n.stages = t.stages), n;
}
function KA(t) {
	for (let n of t.stages ?? []) if (e(n) && n.key === "attributes") return typeof n.class == "function" ? n : void 0;
}
function qA(e) {
	return !!e[HA];
}
function JA(e) {
	class t extends e {
		static [HA] = !0;
		activateListeners(e) {
			let t = super.activateListeners(e);
			return PA(e, (e, t) => kA(YA(this, e), YA(this, t))), t;
		}
		swap(e, t) {
			let n = YA(this, e), r = YA(this, t);
			if (kA(n, r)) return super.swap(e, t);
			XA(e, n, t, r);
		}
	}
	return t;
}
function YA(t, n) {
	let r = e(t.context) ? t.context : void 0, i = e(r?.characteristics) ? r.characteristics : void 0, a = (e(i?.[n]) ? i[n] : void 0)?.formula;
	return typeof a == "string" ? a : void 0;
}
function XA(e, t, n, r) {
	let i = ZA(e), a = ZA(n), o = OA(t), s = OA(r);
	ui.notifications?.warn?.(`Cannot swap ${i} and ${a}: ${i} uses ${o}, while ${a} uses ${s}.`);
}
function ZA(t) {
	let n = game.wfrp4e?.config?.characteristics;
	if (!e(n)) return t;
	let r = n[t];
	return typeof r == "string" ? r : t;
}
//#endregion
//#region src/module/apps/species-builder/runtime-species/config-snapshot.ts
var QA = [
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
function $A(t) {
	let n = e(t) ? t : {}, r = Object.fromEntries(QA.map((e) => [e, ij(n[e])]));
	return {
		extraSpecies: oj(n.extraSpecies),
		records: r
	};
}
function ej(e, t, n) {
	let r = Object.fromEntries(QA.map((r) => [r, nj(r, e.records[r], t.records[r], n)]));
	return {
		extraSpecies: sj([...e.extraSpecies, ...t.extraSpecies]).filter((t) => !n.has(t) || e.extraSpecies.includes(t)),
		records: r
	};
}
function tj(e, t, n) {
	return e.records[t][n];
}
function nj(e, t, n, r) {
	let i = e === "subspecies" ? rj(t, n) : {
		...t,
		...n
	};
	for (let e of r) Object.hasOwn(t, e) ? i[e] = aj(t[e]) : delete i[e];
	return i;
}
function rj(t, n) {
	let r = new Set([...Object.keys(t), ...Object.keys(n)]);
	return Object.fromEntries([...r].map((r) => {
		let i = e(t[r]) ? t[r] : {}, a = e(n[r]) ? n[r] : {};
		return [r, {
			...i,
			...a
		}];
	}));
}
function ij(t) {
	return e(t) ? Object.fromEntries(Object.entries(t).map(([e, t]) => [e, aj(t)])) : {};
}
function aj(t) {
	return Array.isArray(t) ? t.map(aj) : e(t) ? Object.fromEntries(Object.entries(t).map(([e, t]) => [e, aj(t)])) : t;
}
function oj(e) {
	return Array.isArray(e) ? e.flatMap((e) => typeof e == "string" && e.trim() ? [e.trim()] : []) : [];
}
function sj(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/module/apps/species-builder/runtime-species/values.ts
var cj = Object.values(l);
function lj(e) {
	if (typeof e == "string") return e.trim() || void 0;
}
function uj(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
function dj(e) {
	if (Array.isArray(e)) return e.flatMap((e) => {
		let t = lj(e);
		return t ? [t] : [];
	});
}
function fj(e) {
	if (!Array.isArray(e)) return;
	let t, n = [];
	for (let r of e) {
		let e = pj(r);
		if (e !== void 0) {
			t = e;
			continue;
		}
		let i = lj(r);
		i && n.push(i);
	}
	return t === void 0 ? { talents: n } : {
		randomTalentCount: t,
		talents: n
	};
}
function pj(e) {
	if (typeof e == "number") return uj(e);
	if (typeof e != "string" || !e.trim()) return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function mj(t) {
	if (e(t)) return Object.fromEntries(Object.entries(t).flatMap(([e, t]) => {
		let n = lj(e), r = lj(t);
		return n && r ? [[n, r]] : [];
	}));
}
function hj(t) {
	if (e(t)) return Object.fromEntries(Object.entries(t).flatMap(([e, t]) => {
		let n = lj(e), r = pj(t);
		return n && r !== void 0 ? [[n, r]] : [];
	}));
}
function gj(t) {
	if (e(t)) return Object.fromEntries(Object.entries(t).flatMap(([e, t]) => {
		let n = lj(e), r = dj(t);
		return n && r ? [[n, r]] : [];
	}));
}
function _j(t) {
	if (!e(t)) return;
	let n = cj.flatMap((e) => {
		let n = lj(t[e]);
		return n ? [[e, n]] : [];
	});
	return n.length > 0 ? Object.fromEntries(n) : {};
}
function vj(t) {
	if (!e(t)) return;
	let n = {};
	return A(n, "die", lj(t.die)), A(n, "feet", uj(t.feet)), A(n, "inches", uj(t.inches)), Object.keys(n).length > 0 ? n : {};
}
function yj(e, t, n = void 0) {
	if (!e && t === void 0) return;
	let r = { ...e ?? n };
	return t !== void 0 && (r.talents = t), r;
}
function bj(e, t) {
	let n = t.filter((t) => !e.includes(t)), r = e.filter((e) => !t.includes(e)), i = {};
	return A(i, "added", n.length > 0 ? n : void 0), A(i, "removed", r.length > 0 ? r : void 0), i;
}
function xj(e, t) {
	let n = Object.fromEntries(Object.entries(t).filter(([t, n]) => e?.[t] !== n));
	return Object.keys(n).length > 0 ? n : void 0;
}
function Sj(e, t) {
	let n = Object.entries(e ?? {}), r = Object.entries(t ?? {});
	return n.length === r.length && n.every(([e, n]) => t?.[e] === n);
}
function Cj(e, t, n, r) {
	let i = uj(r);
	i !== void 0 && i !== n && (e[t] = i);
}
//#endregion
//#region src/module/apps/species-builder/runtime-species/definition-adapter.ts
function wj(e, t) {
	let n = new Set(e.extraSpecies);
	return Object.entries(e.records.species).flatMap(([r, i]) => {
		let a = r.trim();
		return a ? [Tj(e, a, i, n, t)] : [];
	}).sort(Nj);
}
function Tj(e, t, n, r, i) {
	let a = {
		includeInExtraSpecies: r.has(t),
		key: t,
		name: lj(n) ?? t
	}, o = fj(tj(e, "speciesTalents", t));
	A(a, "characteristics", _j(tj(e, "speciesCharacteristics", t))), A(a, "skills", dj(tj(e, "speciesSkills", t))), A(a, "talents", o?.talents), A(a, "randomTalents", yj(hj(tj(e, "speciesRandomTalents", t)), o?.randomTalentCount)), A(a, "talentReplacements", mj(tj(e, "speciesTalentReplacement", t))), A(a, "traits", dj(tj(e, "speciesTraits", t))), Ej(a, e, t), A(a, "careerTable", i.resolveCareerTable(t, void 0, void 0));
	let s = Dj(e, a, i);
	return A(a, "subspecies", s.length > 0 ? s : void 0), a;
}
function Ej(e, t, n) {
	A(e, "movement", uj(tj(t, "speciesMovement", n))), A(e, "fate", uj(tj(t, "speciesFate", n))), A(e, "resilience", uj(tj(t, "speciesRes", n))), A(e, "extra", uj(tj(t, "speciesExtra", n))), A(e, "age", lj(tj(t, "speciesAge", n))), A(e, "height", vj(tj(t, "speciesHeight", n))), A(e, "careerReplacements", gj(tj(t, "speciesCareerReplacements", n)));
}
function Dj(t, n, r) {
	let i = tj(t, "subspecies", n.key);
	return e(i) ? Object.entries(i).flatMap(([i, a]) => i.trim() && e(a) ? [Oj(t, n, i.trim(), a, r)] : []).sort(Nj) : [];
}
function Oj(e, t, n, r, i) {
	let a = {
		key: n,
		name: lj(r.name) ?? n
	}, o = _j(r.characteristics);
	o && A(a, "characteristics", xj(t.characteristics, o)), kj(a, t, r), jj(a, t, r), Mj(a, t, r), A(a, "careerReplacements", gj(tj(e, "speciesCareerReplacements", `${t.key}-${n}`)));
	let s = mj(r.talentReplacement);
	return Sj(t.talentReplacements, s) || A(a, "talentReplacements", s), A(a, "careerTable", i.resolveCareerTable(t.key, n, r.careerTable)), a;
}
function kj(e, t, n) {
	Aj(e, "skills", t.skills ?? [], dj(n.skills));
	let r = fj(n.talents);
	Aj(e, "talents", t.talents ?? [], r?.talents), Aj(e, "traits", t.traits ?? [], dj(n.speciesTraits));
}
function Aj(e, t, n, r) {
	if (!r) return;
	let i = bj(n, r);
	A(e, `${t}Added`, i.added), A(e, `${t}Removed`, i.removed);
}
function jj(e, t, n) {
	let r = fj(n.talents), i = yj(hj(n.randomTalents), r?.randomTalentCount, t.randomTalents);
	Sj(t.randomTalents, i) || A(e, "randomTalents", i);
}
function Mj(e, t, n) {
	Cj(e, "movement", t.movement, n.movement), Cj(e, "fate", t.fate, n.fate), Cj(e, "resilience", t.resilience, n.resilience), Cj(e, "extra", t.extra, n.extra);
}
function Nj(e, t) {
	return e.name.localeCompare(t.name);
}
//#endregion
//#region src/module/apps/species-builder/runtime-species/index.ts
var Pj;
function Fj() {
	Pj = $A(game.wfrp4e?.config);
}
async function Ij(e, t = []) {
	let n = ej(Pj ?? $A(void 0), $A(game.wfrp4e?.config), new Set(e.map((e) => e.trim()).filter(Boolean)));
	for (let e of t) delete n.records.species[e];
	wj(n, { resolveCareerTable: ve });
}
//#endregion
//#region src/state/species-item/index.ts
function Lj(e) {
	return Td(`species-item:${e}`, () => {
		let t = /* @__PURE__ */ B({
			name: "",
			img: "icons/svg/mystery-man.svg",
			system: S()
		}), n = /* @__PURE__ */ B(""), r = /* @__PURE__ */ B("description"), i = /* @__PURE__ */ B(0), a = /* @__PURE__ */ B(!1), o = /* @__PURE__ */ B([]), s = /* @__PURE__ */ B(""), c = /* @__PURE__ */ B(""), l = /* @__PURE__ */ B(!1), u = /* @__PURE__ */ B(!1), d = /* @__PURE__ */ B(!1), f = /* @__PURE__ */ B(null), p;
		Qo(() => t.value.system.subspeciesOf, async (e, t, n) => {
			let r = !0;
			n(() => {
				r = !1;
			}), f.value = null;
			try {
				let t = await p.loadParent(e);
				r && (f.value = t);
			} catch (e) {
				r && (s.value = Rj(e));
			}
		});
		let m = $(() => JSON.stringify(t.value) !== n.value), h = $(() => {
			try {
				return b(t.value.system.talents.choices);
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
				s.value = Rj(e), u.value = !1;
			}
		}
		async function ee() {
			l.value = !0, s.value = "";
			try {
				p.flushNotes(), t.value = await p.save(JSON.parse(JSON.stringify(t.value))), n.value = JSON.stringify(t.value), i.value += 1, c.value = "Saved Species Item. Refresh Foundry to update character generation.";
			} catch (e) {
				s.value = Rj(e);
			} finally {
				l.value = !1;
			}
		}
		function C(e, n) {
			t.value.system[e] = n === "" ? null : Number(n);
		}
		function te(e, n, r) {
			let i = t.value.system.characteristics[e] ?? {
				base: null,
				dice: null
			};
			i[n] = r === "" ? null : Number(r), t.value.system.characteristics[e] = i;
		}
		function w(e, n, r) {
			let i = JSON.parse(JSON.stringify(h.value));
			i[e].choices[n] = { name: r }, t.value.system.talents.choices = y(i);
		}
		function ne(e) {
			let n = [...h.value];
			e === void 0 ? n.push({ choices: [{ name: "New Talent" }] }) : n[e].choices.push({ name: "Alternative Talent" }), t.value.system.talents.choices = y(n);
		}
		function re(e) {
			t.value.system.talents.choices = y(h.value.filter((t, n) => n !== e));
		}
		function T() {
			t.value.system.subspeciesOf = x();
		}
		async function ie(n, r) {
			try {
				let { type: i, reference: a } = await p.resolveDrop(n);
				if (r === "parent") {
					if (!i.endsWith("species") || a.uuid === e) throw Error("Choose a different Species Item as the parent.");
					t.value.system.subspeciesOf = a;
				} else if (r === "skills" && i === "skill") t.value.system.skills.list.push(a.name);
				else if (r === "talents" && i === "talent") t.value.system.talents.choices = y([...h.value, { choices: [{
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
				s.value = Rj(e);
			}
		}
		let E = $(() => {
			try {
				return b(t.value.system.talents.choices), "";
			} catch (e) {
				return Rj(e);
			}
		});
		async function ae(e) {
			try {
				await p.openReference(e);
			} catch (e) {
				s.value = Rj(e);
			}
		}
		function D() {
			p.chooseImage(t.value.img, (e) => {
				t.value.img = e;
			});
		}
		let O = (...e) => p.mountNotes(...e), k = (e) => p.editNotes(e);
		async function oe(e, t) {
			if (m.value) {
				s.value = "Save or reload Item changes before editing effects.";
				return;
			}
			try {
				await p.effectAction(e, t), v();
			} catch (e) {
				s.value = Rj(e);
			}
		}
		return {
			draft: t,
			parent: f,
			tab: r,
			revision: i,
			isGM: a,
			effects: o,
			choiceWarning: E,
			chooseImage: D,
			mountNotes: O,
			editNotes: k,
			effectAction: oe,
			openReference: ae,
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
			save: ee,
			setStatistic: C,
			setCharacteristic: te,
			editTalent: w,
			addTalent: ne,
			removeTalent: re,
			clearParent: T,
			drop: ie
		};
	})();
}
function Rj(e) {
	return e instanceof Error ? e.message : String(e);
}
//#endregion
//#region src/view/apps/species-item/details/SpeciesTalentEditor.vue?vue&type=script&setup=true&lang.ts
var zj = ["disabled"], Bj = { class: "dui-fieldset-legend" }, Vj = { class: "app:flex app:flex-wrap app:items-center app:gap-2" }, Hj = { class: "dui-label" }, Uj = [
	"value",
	"aria-label",
	"onChange"
], Wj = { class: "app:flex app:gap-2" }, Gj = ["onClick"], Kj = ["onClick"], qj = /* @__PURE__ */ U({
	__name: "SpeciesTalentEditor",
	props: { uuid: {} },
	setup(e) {
		let t = Lj(e.uuid);
		return (e, n) => (K(), q("fieldset", {
			class: "dui-fieldset",
			disabled: !!V(t).choiceWarning
		}, [
			n[1] ||= Y("legend", { class: "app:sr-only" }, "Edit Talent choices", -1),
			(K(!0), q(G, null, W(V(t).grants, (e, n) => (K(), q("fieldset", {
				key: n,
				class: "dui-fieldset"
			}, [
				Y("legend", Bj, "Talent " + L(n + 1), 1),
				Y("div", Vj, [(K(!0), q(G, null, W(e.choices, (e, r) => (K(), q("label", {
					key: r,
					class: "dui-input dui-input-sm app:min-w-0 app:flex-1"
				}, [Y("span", Hj, L(r ? "Or" : "Talent"), 1), Y("input", {
					value: e.name,
					required: "",
					"aria-label": `Talent ${n + 1}, option ${r + 1}`,
					onChange: (e) => V(t).editTalent(n, r, e.target.value)
				}, null, 40, Uj)]))), 128))]),
				Y("div", Wj, [Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					onClick: (e) => V(t).addTalent(n)
				}, " Add alternative ", 8, Gj), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					onClick: (e) => V(t).removeTalent(n)
				}, " Remove grant ", 8, Kj)])
			]))), 128)),
			Y("button", {
				type: "button",
				class: "dui-btn dui-btn-sm app:justify-self-start",
				onClick: n[0] ||= (e) => V(t).addTalent()
			}, " Add Talent ")
		], 8, zj));
	}
}), Jj = ["disabled"], Yj = { class: "app:flex app:flex-wrap app:items-center app:gap-1" }, Xj = [
	"onUpdate:modelValue",
	"aria-label",
	"size"
], Zj = ["aria-label", "onClick"], Qj = {
	key: 0,
	class: "dui-alert dui-alert-warning",
	role: "status"
}, $j = { class: "app:flex app:items-center app:gap-2" }, eM = [
	"disabled",
	"aria-expanded",
	"aria-controls"
], tM = { class: "app:my-1" }, nM = { class: "dui-input dui-input-sm app:w-full" }, rM = [
	"id",
	"value",
	"placeholder"
], iM = /* @__PURE__ */ U({
	__name: "SpeciesItemGrants",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = Lj(e.uuid);
		return (n, r) => (K(), q("fieldset", {
			class: "dui-fieldset",
			disabled: !e.editable
		}, [
			r[11] ||= Y("legend", { class: "app:sr-only" }, "Skills and Talents", -1),
			X(By, {
				title: "Skills",
				variant: "bare",
				"show-prompt": !1,
				"manual-entry-trigger": "none",
				disabled: !e.editable,
				onDropData: r[1] ||= (e) => V(t).drop(e, "skills")
			}, {
				default: H(() => [r[7] ||= Y("div", { class: "dui-divider" }, "Skills", -1), Y("div", Yj, [(K(!0), q(G, null, W(V(t).draft.system.skills.list, (e, n) => (K(), q("div", {
					key: n,
					class: "dui-join app:max-w-full"
				}, [Go(Y("input", {
					"onUpdate:modelValue": (e) => V(t).draft.system.skills.list[n] = e,
					"aria-label": `Skill ${n + 1} name`,
					size: Math.max(6, V(t).draft.system.skills.list[n].length),
					class: "dui-input dui-input-xs dui-join-item app:w-auto app:min-w-0",
					required: ""
				}, null, 8, Xj), [[ku, V(t).draft.system.skills.list[n]]]), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-square dui-join-item",
					"aria-label": `Remove Skill ${n + 1}`,
					onClick: (e) => V(t).draft.system.skills.list.splice(n, 1)
				}, [...r[5] ||= [Y("i", {
					class: "fa-solid fa-xmark",
					"aria-hidden": "true"
				}, null, -1)]], 8, Zj)]))), 128)), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					onClick: r[0] ||= (e) => V(t).draft.system.skills.list.push("New Skill")
				}, [...r[6] ||= [Y("i", {
					class: "fa-solid fa-plus",
					"aria-hidden": "true"
				}, null, -1), Z(" Skill ", -1)]])])]),
				_: 1
			}, 8, ["disabled"]),
			V(t).choiceWarning ? (K(), q("div", Qj, L(V(t).choiceWarning) + " The stored choices are preserved. ", 1)) : Q("", !0),
			X(By, {
				title: "Talents",
				variant: "bare",
				"show-prompt": !1,
				"manual-entry-trigger": "none",
				disabled: !e.editable || !!V(t).choiceWarning,
				onDropData: r[3] ||= (e) => V(t).drop(e, "talents")
			}, {
				default: H(() => [Y("div", $j, [r[9] ||= Y("span", { class: "dui-label app:flex-1" }, "Talents", -1), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					disabled: !e.editable || !!V(t).choiceWarning,
					"aria-expanded": V(t).editingTalents,
					"aria-controls": `${e.uuid}-talent-editor`,
					onClick: r[2] ||= (e) => V(t).editingTalents = !V(t).editingTalents
				}, [r[8] ||= Y("i", {
					class: "fa-solid fa-gear",
					"aria-hidden": "true"
				}, null, -1), Z(" " + L(V(t).editingTalents ? "Done" : "Edit Talents"), 1)], 8, eM)]), Y("p", tM, L(V(t).choiceWarning ? "Native Talent choices preserved" : V(t).talentSummary || (V(t).draft.system.subspeciesOf.uuid ? "Inherit parent Talents" : "None")), 1)]),
				_: 1
			}, 8, ["disabled"]),
			V(t).editingTalents ? (K(), J(qj, {
				key: 1,
				id: `${e.uuid}-talent-editor`,
				uuid: e.uuid
			}, null, 8, ["id", "uuid"])) : Q("", !0),
			Y("label", nM, [r[10] ||= Y("span", { class: "dui-label app:flex-1" }, "Random Talents", -1), Y("input", {
				id: `${e.uuid}-random-talents`,
				"aria-label": "Random Talents",
				class: "app:max-w-20 app:text-center",
				type: "number",
				min: "0",
				value: V(t).draft.system.talents.random,
				placeholder: String(V(t).parent?.talents.random ?? "—"),
				onInput: r[4] ||= (e) => V(t).draft.system.talents.random = e.target.value === "" ? null : Number(e.target.value)
			}, null, 40, rM)])
		], 8, Jj));
	}
}), aM = { class: "dui-label" }, oM = { class: "dui-join app:min-w-0" }, sM = {
	key: 1,
	class: "dui-input dui-input-sm app:h-auto app:min-h-8 app:w-full app:whitespace-normal"
}, cM = ["aria-label"], lM = /* @__PURE__ */ U({
	__name: "SpeciesItemReference",
	props: {
		uuid: {},
		label: {},
		reference: {},
		editable: { type: Boolean }
	},
	emits: ["clear", "drop-data"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = Lj(n.uuid);
		function a(e) {
			n.editable && e.dataTransfer && r("drop-data", e.dataTransfer.getData("text/plain"));
		}
		return (t, n) => (K(), q("div", {
			class: "app:grid app:grid-cols-[7rem_minmax(0,1fr)] app:items-center app:gap-2",
			onDragover: n[2] ||= Ru(() => {}, ["prevent"]),
			onDrop: Ru(a, ["prevent"])
		}, [Y("span", aM, L(e.label), 1), Y("div", oM, [e.reference.uuid ? (K(), q("button", {
			key: 0,
			type: "button",
			class: "dui-btn dui-btn-sm dui-btn-outline dui-join-item app:h-auto app:min-h-8 app:min-w-0 app:flex-1 app:justify-start app:whitespace-normal",
			onClick: n[0] ||= (t) => V(i).openReference(e.reference.uuid)
		}, L(e.reference.name || e.label), 1)) : (K(), q("div", sM, " Drop " + L(e.label === "Subspecies Of" ? "a Species Item" : "a RollTable") + " here ", 1)), e.editable && (e.reference.uuid || e.reference.id) ? (K(), q("button", {
			key: 2,
			type: "button",
			class: "dui-btn dui-btn-sm dui-btn-square dui-join-item",
			"aria-label": `Clear ${e.label}`,
			onClick: n[1] ||= (e) => r("clear")
		}, [...n[3] ||= [Y("i", {
			class: "fa-solid fa-xmark",
			"aria-hidden": "true"
		}, null, -1)]], 8, cM)) : Q("", !0)])], 32));
	}
}), uM = ["disabled"], dM = /* @__PURE__ */ U({
	__name: "SpeciesItemTables",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = Lj(e.uuid), n = [
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
			(K(), q(G, null, W(n, (n) => X(lM, {
				key: n.key,
				uuid: e.uuid,
				label: n.label,
				reference: V(t).draft.system.tables[n.key],
				editable: e.editable,
				onDropData: (e) => V(t).drop(e, n.key),
				onClear: (e) => V(t).draft.system.tables[n.key] = V(x)()
			}, null, 8, [
				"uuid",
				"label",
				"reference",
				"editable",
				"onDropData",
				"onClear"
			])), 64))
		], 8, uM));
	}
}), fM = ["disabled"], pM = { class: "app:max-w-full app:overflow-x-auto" }, mM = { class: "dui-table dui-table-xs app:min-w-[34rem]" }, hM = { class: "app:sr-only" }, gM = [
	"aria-label",
	"value",
	"placeholder",
	"onInput"
], _M = { "aria-hidden": "true" }, vM = { class: "dui-input dui-input-xs dui-input-ghost app:w-full app:gap-0 app:px-1" }, yM = [
	"aria-label",
	"value",
	"placeholder",
	"onInput"
], bM = { key: 0 }, xM = { class: "dui-input dui-input-sm app:w-full" }, SM = [
	"id",
	"value",
	"placeholder"
], CM = { class: "app:flex app:flex-wrap app:gap-2" }, wM = { class: "dui-label app:flex-1" }, TM = [
	"aria-label",
	"value",
	"placeholder",
	"onInput"
], EM = { class: "app:grid app:grid-cols-[7rem_minmax(0,1fr)] app:items-center app:gap-2" }, DM = ["for"], OM = ["id"], kM = /* @__PURE__ */ U({
	__name: "SpeciesItemDetails",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = Lj(e.uuid), n = {
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
			X(lM, {
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
			Y("div", pM, [Y("table", mM, [
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
					}, [Y("label", null, [Y("span", hM, L(n[e]) + " base", 1), Y("input", {
						class: "dui-input dui-input-xs dui-input-ghost app:w-full app:text-center",
						type: "number",
						min: "0",
						step: "any",
						"aria-label": `${n[e]} base`,
						value: V(t).draft.system.characteristics[e]?.base,
						placeholder: String(V(t).parent?.characteristics[e]?.base ?? "—"),
						onInput: (n) => V(t).setCharacteristic(e, "base", n.target.value)
					}, null, 40, gM)])]))), 128))]),
					Y("tr", _M, [(K(!0), q(G, null, W(V(r), (e) => (K(), q("td", {
						key: e,
						class: "app:text-center"
					}, "+"))), 128))]),
					Y("tr", null, [(K(!0), q(G, null, W(V(r), (e) => (K(), q("td", {
						key: e,
						class: "app:p-1"
					}, [Y("label", vM, [Y("input", {
						class: "app:text-center",
						type: "number",
						min: "0",
						step: "any",
						"aria-label": `${n[e]} dice`,
						value: V(t).draft.system.characteristics[e]?.dice,
						placeholder: String(V(t).parent?.characteristics[e]?.dice ?? "—"),
						onInput: (n) => V(t).setCharacteristic(e, "dice", n.target.value)
					}, null, 40, yM), o[4] ||= Y("span", null, "d10", -1)])]))), 128))])
				])
			])]),
			V(t).draft.system.subspeciesOf.uuid ? (K(), q("p", bM, "Empty values inherit from the parent species.")) : Q("", !0),
			X(iM, {
				uuid: e.uuid,
				editable: e.editable
			}, null, 8, ["uuid", "editable"]),
			Y("label", xM, [o[6] ||= Y("span", { class: "dui-label app:flex-1" }, "Movement", -1), Y("input", {
				id: `${e.uuid}-movement`,
				"aria-label": "Movement",
				class: "app:max-w-20 app:text-center",
				type: "number",
				min: "0",
				step: "any",
				value: V(t).draft.system.movement,
				placeholder: String(V(t).parent?.movement ?? "—"),
				onInput: o[2] ||= (e) => V(t).setStatistic("movement", e.target.value)
			}, null, 40, SM)]),
			Y("div", CM, [(K(), q(G, null, W(i, (e) => Y("label", {
				key: e.key,
				class: "dui-input dui-input-sm app:min-w-36 app:flex-1"
			}, [Y("span", wM, L(e.label), 1), Y("input", {
				class: "app:max-w-12 app:text-center",
				type: "number",
				min: "0",
				step: "any",
				"aria-label": e.label,
				value: V(t).draft.system[e.key],
				placeholder: String(V(t).parent?.[e.key] ?? "—"),
				onInput: (n) => V(t).setStatistic(e.key, n.target.value)
			}, null, 40, TM)])), 64))]),
			Y("div", EM, [Y("label", {
				class: "dui-label",
				for: `${e.uuid}-size`
			}, "Size", 8, DM), Go(Y("select", {
				id: `${e.uuid}-size`,
				"onUpdate:modelValue": o[3] ||= (e) => V(t).draft.system.size = e,
				class: "dui-select dui-select-sm app:w-full",
				"aria-label": "Size"
			}, [...o[7] ||= [ul("<option value=\"tiny\">Tiny</option><option value=\"ltl\">Little</option><option value=\"sml\">Small</option><option value=\"avg\">Average</option><option value=\"lrg\">Large</option><option value=\"enor\">Enormous</option><option value=\"mnst\">Monstrous</option>", 7)]], 8, OM), [[Mu, V(t).draft.system.size]])]),
			X(dM, {
				uuid: e.uuid,
				editable: e.editable
			}, null, 8, ["uuid", "editable"])
		], 8, fM));
	}
}), AM = {
	key: 0,
	class: "dui-fieldset"
}, jM = { class: "dui-fieldset" }, MM = /* @__PURE__ */ U({
	__name: "SpeciesItemNotes",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = e, n = Lj(t.uuid), r = /* @__PURE__ */ B(), i = /* @__PURE__ */ B(), a = [];
		return xs(() => {
			for (let [e, o] of [["description", r.value], ["gmdescription", i.value]]) o && a.push(n.mountNotes(o, e, n.draft.system[e].value, t.editable, (t) => {
				n.draft.system[e].value = t;
			}));
		}), ws(() => a.forEach((e) => e())), (t, a) => (K(), q(G, null, [V(n).isGM ? (K(), q("fieldset", AM, [
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
		])) : Q("", !0), Y("fieldset", jM, [
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
//#region src/module/wfrp4e/grant/item-documents.ts
function NM(e) {
	let t = e.dataTransfer?.getData("text/plain") ?? "";
	if (!t) return null;
	try {
		return IE(t).type === "Item" ? t : null;
	} catch {
		return null;
	}
}
async function PM(e) {
	let t = IE(e);
	if (!t.uuid) throw Error("Drop an Item with a resolvable UUID.");
	return nn(await fromUuid(t.uuid), "The dropped Item was not found.");
}
function FM(e) {
	let t = {
		name: e.name,
		uuid: e.uuid
	};
	return e.img && (t.img = e.img), t;
}
//#endregion
//#region src/module/apps/effect-builders/documents.ts
async function IM(t) {
	let n = JSON.parse(t);
	if (!e(n) || typeof n.uuid != "string") throw Error("Drop a document or enter its UUID.");
	return fromUuid(n.uuid);
}
function LM(e) {
	let t = nn(e, "Choose an Item to receive the effect.");
	if (!game.user || !t.canUserModify(game.user, "update")) throw Error("You do not have permission to edit this Item.");
	if (t.compendium?.locked) throw Error("Unlock the destination compendium or import its Item into the world.");
	return t;
}
async function RM(e, t = !1) {
	let n = await IM(e);
	return FM(t ? LM(n) : nn(n, "Choose an Item to grant."));
}
function zM(t) {
	if (!e(t) || t.documentName !== "RollTable" || typeof t.uuid != "string" || typeof t.name != "string") throw Error("Choose a RollTable containing Item document results.");
	return {
		uuid: t.uuid,
		name: t.name
	};
}
async function BM(t, n, r = []) {
	if (r.includes(t)) throw Error("The grant RollTables contain a circular reference.");
	if (r.length > 5) throw Error("The grant RollTables exceed Foundry's nesting limit.");
	let i = await fromUuid(t);
	zM(i);
	let a = e(i) ? i.results : void 0, o = e(a) ? a.contents : void 0;
	if (!Array.isArray(o) || !o.length) throw Error("The grant RollTable is empty.");
	for (let i of o) {
		let a = e(i) ? i.documentUuid : void 0;
		if (typeof a != "string" || !a) throw Error("Grant RollTables must use Item or nested RollTable document results.");
		if (a === n) throw Error("An Item cannot grant itself.");
		let o = await fromUuid(a);
		e(o) && o.documentName === "RollTable" ? await BM(a, n, [...r, t]) : nn(o, `The RollTable result ${a} is not an available Item.`);
	}
}
//#endregion
//#region src/functions/effect-builders/catalogue.ts
var VM = [
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
function HM(e) {
	return {
		kind: e,
		name: VM.find((t) => t.kind === e).title,
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
function UM(e, t) {
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
var WM = "generatedGrantItemsEffect", GM = {
	grantMode: "all",
	lifetime: "linked-to-effect",
	ownerAction: "keep"
};
function KM(e) {
	let t = e.recipe ?? GM;
	qM(t);
	let n = e.items.map((e) => e.uuid);
	return {
		changes: [],
		description: JM(e.effectName, e.items, t),
		disabled: !1,
		flags: { [e.flagScope]: {
			[WM]: !0,
			itemUuids: n,
			recipe: t
		} },
		img: e.items[0]?.img ?? "icons/svg/aura.svg",
		name: e.effectName,
		system: {
			scriptData: [{
				label: e.effectName,
				script: UM([`const itemUuids = ${JSON.stringify(n)};`], t),
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
function qM(e) {
	if (e.lifetime === "linked-to-effect" && e.ownerAction === "delete-after-grant") throw Error("Self-removing grant effects must create detached item copies.");
}
function JM(e, t, n) {
	let r = YM(e), i = t.map((e) => `<li>${YM(e.name)}</li>`).join("");
	return `<p><strong>${r}</strong>: grants item copies; ${n.lifetime === "linked-to-effect" ? "granted item copies are removed with this effect" : "granted item copies remain after this effect is removed"}.${n.ownerAction === "delete-after-grant" ? " The source Item removes itself after granting." : ""}</p><ul>${i}</ul>`;
}
function YM(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
//#endregion
//#region src/functions/effect-builders/formula-validation.ts
function XM(e) {
	if (!e.trim()) throw Error("Enter a wound formula.");
	let t = Ze(e), n = [...t.usedKeywords, ...t.references.map((e) => e.variableName)], r = t.expression.replace(/Math\.(floor|ceil|round|min|max|abs|sqrt|pow)\b/g, "0");
	if ((r.match(/[A-Za-z_$][\w$]*/g) ?? []).some((e) => !n.includes(e)) || /[^\w\s.+*/%(),-]/.test(r)) throw Error("Use arithmetic, formula tokens, and Math functions in the wound formula.");
	try {
		Function(...n, `"use strict"; return (${t.expression});`);
	} catch {
		throw Error("The wound formula has invalid arithmetic or unmatched brackets.");
	}
}
//#endregion
//#region src/functions/effect-builders/choice.ts
function ZM(e, t, n) {
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
function QM(e, t) {
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
function $M(e) {
	let t = [];
	if (e.name.trim() || t.push("Enter an effect name."), e.kind === "wounds") {
		try {
			XM(e.formula);
		} catch (e) {
			t.push(e instanceof Error ? e.message : String(e));
		}
		return t;
	}
	return e.recipe.lifetime === "linked-to-effect" && e.recipe.ownerAction === "delete-after-grant" && t.push("Self-removing source Items must grant copies that remain after the effect is removed."), e.kind === "grant" && !e.items.length && t.push("Add at least one Item to grant."), e.kind === "random" && !e.table && t.push("Choose a RollTable."), (e.kind === "random" || e.kind === "choice") && (!Number.isInteger(e.count) || e.count < 1 || e.count > 100) && t.push("Enter a whole number from 1 to 100."), e.kind === "choice" && ((!e.groups.length || e.groups.some((e) => !e.name.trim() || !e.items.length)) && t.push("Each choice needs a name and at least one Item."), e.count > e.groups.length && t.push("The number of choices exceeds the available options.")), t;
}
function eN(e, t) {
	let n = $M(e);
	if (n.length) throw Error(n.join(" "));
	let r = e.name.trim();
	if (e.kind === "wounds") return Tt(r, e.formula);
	let i = KM({
		effectName: r,
		flagScope: t,
		items: e.items,
		recipe: e.recipe
	});
	if (e.kind === "grant") return i;
	let a = e.kind === "random" ? QM(e.table.uuid, e.count) : ZM(r, e.groups, e.count);
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
				script: UM(a, e.recipe)
			}]
		}
	};
}
//#endregion
//#region src/state/effect-builders/index.ts
function tN(e) {
	return Td(`effect-builder:${e}`, () => {
		let e = /* @__PURE__ */ B(HM("wounds")), t = /* @__PURE__ */ B(null), n = /* @__PURE__ */ B(""), r = /* @__PURE__ */ B(""), i = /* @__PURE__ */ B(!1), a = /* @__PURE__ */ B(!1), o = /* @__PURE__ */ B(!1), s, c = $(() => $M(e.value)), l = $(() => !!t.value && !c.value.length && !i.value && !a.value);
		function u(n, r, i) {
			s = r, !o.value && (e.value = HM(n), t.value = i, o.value = !0);
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
	})(gw);
}
//#endregion
//#region src/view/components/ApplicationShell.vue?vue&type=script&setup=true&lang.ts
var nN = ["aria-label"], rN = { class: "dui-card-body" }, iN = { class: "dui-card-title" }, aN = { key: 0 }, oN = {
	key: 0,
	class: "dui-card-actions"
}, sN = /* @__PURE__ */ U({
	__name: "ApplicationShell",
	props: {
		description: {},
		title: {}
	},
	setup(e) {
		return (t, n) => (K(), q("section", {
			"aria-label": e.title,
			class: "dui-card"
		}, [Y("div", rN, [
			Y("header", null, [
				Y("h1", iN, L(e.title), 1),
				e.description ? (K(), q("p", aN, L(e.description), 1)) : Q("", !0),
				js(t.$slots, "header")
			]),
			js(t.$slots, "default"),
			t.$slots.actions ? (K(), q("div", oN, [js(t.$slots, "actions")])) : Q("", !0)
		])], 8, nN));
	}
}), cN = { class: "dui-list" }, lN = { class: "dui-list-col-grow" }, uN = ["aria-label", "onClick"], dN = /* @__PURE__ */ U({
	__name: "SourceItems",
	props: {
		items: {},
		title: {}
	},
	emits: ["dropData", "remove"],
	setup(e) {
		return (t, n) => (K(), q(G, null, [X(By, {
			title: e.title,
			description: "Drop an Item to add it to this list.",
			variant: "compact",
			onDropData: n[0] ||= (e) => t.$emit("dropData", e)
		}, null, 8, ["title"]), Y("ul", cN, [(K(!0), q(G, null, W(e.items, (e) => (K(), q("li", {
			key: e.uuid,
			class: "dui-list-row"
		}, [Y("span", lN, L(e.name), 1), Y("button", {
			type: "button",
			class: "dui-btn dui-btn-sm dui-btn-ghost",
			"aria-label": `Remove ${e.name}`,
			onClick: (n) => t.$emit("remove", e.uuid)
		}, " Remove ", 8, uN)]))), 128))])], 64));
	}
}), fN = { class: "dui-fieldset" }, pN = ["for"], mN = ["id", "max"], hN = { class: "dui-fieldset-legend" }, gN = ["for"], _N = ["id", "onUpdate:modelValue"], vN = ["onClick"], yN = /* @__PURE__ */ U({
	__name: "ChoiceOptions",
	props: { id: {} },
	setup(e) {
		let t = e, n = tN(t.id), r = `${t.id}-${os()}`;
		return (e, t) => (K(), q("fieldset", fN, [
			t[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "Player choices", -1),
			Y("label", {
				for: `${r}-count`,
				class: "dui-label"
			}, "Number of options to choose", 8, pN),
			Go(Y("input", {
				id: `${r}-count`,
				"onUpdate:modelValue": t[0] ||= (e) => V(n).draft.count = e,
				"aria-label": "Number of options to choose",
				type: "number",
				min: "1",
				max: V(n).draft.groups.length || 1,
				step: "1",
				class: "dui-input"
			}, null, 8, mN), [[
				ku,
				V(n).draft.count,
				void 0,
				{ number: !0 }
			]]),
			t[3] ||= Y("p", null, "Each option can grant one Item or a whole package.", -1),
			(K(!0), q(G, null, W(V(n).draft.groups, (e, t) => (K(), q("fieldset", {
				key: t,
				class: "dui-fieldset"
			}, [
				Y("legend", hN, "Option " + L(t + 1), 1),
				Y("label", {
					for: `${r}-${t}`,
					class: "dui-label"
				}, "Option name", 8, gN),
				Go(Y("input", {
					id: `${r}-${t}`,
					"onUpdate:modelValue": (t) => e.name = t,
					"aria-label": "Option name",
					class: "dui-input app:w-full"
				}, null, 8, _N), [[ku, e.name]]),
				X(dN, {
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
				}, " Remove option ", 8, vN)
			]))), 128)),
			Y("button", {
				type: "button",
				class: "dui-btn",
				onClick: t[1] ||= (...e) => V(n).addGroup && V(n).addGroup(...e)
			}, "Add option")
		]));
	}
}), bN = { class: "dui-fieldset" }, xN = ["for"], SN = ["id", "value"], CN = {
	key: 0,
	class: "dui-label"
}, wN = /* @__PURE__ */ U({
	__name: "GrantOptions",
	props: { id: {} },
	setup(e) {
		let t = e, n = tN(t.id), r = `${t.id}-${os()}`;
		return (e, t) => (K(), q("fieldset", bN, [
			t[4] ||= Y("legend", { class: "dui-fieldset-legend" }, "Granted Items", -1),
			Y("label", {
				for: `${r}-lifetime`,
				class: "dui-label"
			}, "When the effect is removed", 8, xN),
			Y("select", {
				id: `${r}-lifetime`,
				"aria-label": "When the effect is removed",
				class: "dui-select app:w-full",
				value: V(n).draft.recipe.lifetime,
				onChange: t[0] ||= (e) => V(n).setLifetime(e.target.value)
			}, [...t[2] ||= [Y("option", { value: "linked-to-effect" }, "Remove the granted Items too", -1), Y("option", { value: "detached" }, "Keep the granted Items", -1)]], 40, SN),
			V(n).draft.recipe.lifetime === "detached" ? (K(), q("label", CN, [Go(Y("input", {
				"onUpdate:modelValue": t[1] ||= (e) => V(n).draft.recipe.ownerAction = e,
				type: "checkbox",
				class: "dui-checkbox",
				"true-value": "delete-after-grant",
				"false-value": "keep"
			}, null, 512), [[Au, V(n).draft.recipe.ownerAction]]), t[3] ||= Z(" Remove the source Item after a successful grant ", -1)])) : Q("", !0)
		]));
	}
}), TN = /* @__PURE__ */ "@sb.@tb.@wpb.@sbMultiplier.@tbMultiplier.@wpbMultiplier.@scale.@size.@age.@height.@weight.@status.@rank.@xp.@fate.@fortune.@resilience.@resolve.@corruption.@sin.@advantage.@bleeding.@poisoned.@ablaze.@deafened.@stunned.@entangled.@fatigued.@blinded.@broken".split("."), EN = { class: "dui-fieldset" }, DN = { class: "dui-collapse dui-collapse-arrow" }, ON = { class: "dui-collapse-content" }, kN = { class: "app:flex app:flex-wrap app:gap-1" }, AN = ["onClick", "onDragstart"], jN = /* @__PURE__ */ U({
	__name: "WoundFormula",
	props: { id: {} },
	setup(e) {
		let t = e, n = tN(t.id), r = `${t.id}-${os()}`, i = /* @__PURE__ */ B(), a = [
			...TN,
			"{Strength}",
			"[Toughness]",
			"{Endurance}",
			"[Endurance]"
		];
		async function o(e) {
			let t = i.value, r = t?.selectionStart ?? n.draft.formula.length, a = t?.selectionEnd ?? r;
			n.draft.formula = `${n.draft.formula.slice(0, r)}${e}${n.draft.formula.slice(a)}`, await No(), t?.focus(), t?.setSelectionRange(r + e.length, r + e.length);
		}
		return (e, t) => (K(), q("fieldset", EN, [
			t[5] ||= Y("legend", { class: "dui-fieldset-legend" }, "Wound calculation", -1),
			Y("label", {
				for: r,
				class: "dui-label"
			}, "Formula"),
			Go(Y("textarea", {
				id: r,
				ref_key: "textarea",
				ref: i,
				"onUpdate:modelValue": t[0] ||= (e) => V(n).draft.formula = e,
				"aria-label": "Formula",
				class: "dui-textarea app:w-full",
				rows: "3",
				onDragover: t[1] ||= Ru(() => {}, ["prevent"]),
				onDrop: t[2] ||= Ru((e) => o(e.dataTransfer?.getData("text/plain") ?? ""), ["prevent"])
			}, null, 544), [[ku, V(n).draft.formula]]),
			t[6] ||= ul("<p> Use <code>{Name}</code> for a characteristic or Skill total and <code>[Name]</code> for its bonus. For example: <code>[Endurance] + 2 * @tb</code>. </p><p><code>{Endurance|Strength}</code> uses Strength for that Skill. Arithmetic and <code>Math.floor</code>, <code>Math.ceil</code>, <code>Math.min</code>, and <code>Math.max</code> are supported. </p>", 2),
			Y("details", DN, [t[4] ||= Y("summary", { class: "dui-collapse-title" }, "Insert formula tokens", -1), Y("div", ON, [t[3] ||= Y("p", null, "Click a token to insert it at the cursor, or drag it into the formula.", -1), Y("div", kN, [(K(), q(G, null, W(a, (e) => Y("button", {
				key: e,
				type: "button",
				class: "dui-btn dui-btn-xs",
				draggable: "true",
				onClick: (t) => o(e),
				onDragstart: (t) => t.dataTransfer?.setData("text/plain", e)
			}, L(e), 41, AN)), 64))])])])
		]));
	}
}), MN = {
	key: 0,
	role: "alert",
	class: "dui-alert dui-alert-error"
}, NN = {
	key: 1,
	role: "status",
	class: "dui-alert dui-alert-success"
}, PN = ["disabled"], FN = ["for"], IN = ["id"], LN = {
	key: 2,
	class: "dui-fieldset"
}, RN = ["for"], zN = ["id"], BN = {
	key: 2,
	class: "dui-list",
	"aria-label": "To finish this effect"
}, VN = { class: "app:flex app:flex-wrap app:gap-2" }, HN = ["disabled"], UN = ["disabled"], WN = /* @__PURE__ */ U({
	__name: "EffectBuilderApp",
	props: {
		id: {},
		kind: {},
		destination: {},
		bridge: {},
		close: { type: Function }
	},
	setup(e) {
		let t = e, n = tN(t.id);
		n.configure(t.kind, t.bridge, t.destination);
		let r = `${t.id}-${os()}`, i = VM.find((e) => e.kind === t.kind);
		return (t, a) => (K(), J(sN, {
			title: `${V(i).title} Effect Builder`,
			description: V(i).description
		}, {
			default: H(() => [
				V(n).error ? (K(), q("div", MN, L(V(n).error), 1)) : Q("", !0),
				V(n).message ? (K(), q("div", NN, L(V(n).message), 1)) : Q("", !0),
				Y("fieldset", {
					class: "dui-fieldset",
					disabled: V(n).busy || V(n).created
				}, [
					X(By, {
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
					}, "Effect name", 8, FN),
					Go(Y("input", {
						id: `${r}-name`,
						"onUpdate:modelValue": a[0] ||= (e) => V(n).draft.name = e,
						"aria-label": "Effect name",
						class: "dui-input app:w-full"
					}, null, 8, IN), [[ku, V(n).draft.name]]),
					e.kind === "wounds" ? (K(), J(jN, {
						key: 0,
						id: e.id
					}, null, 8, ["id"])) : e.kind === "grant" ? (K(), J(dN, {
						key: 1,
						title: "Items to grant",
						items: V(n).draft.items,
						onDropData: a[1] ||= (e) => V(n).dropItem(e),
						onRemove: a[2] ||= (e) => V(n).removeItem(e)
					}, null, 8, ["items"])) : e.kind === "random" ? (K(), q("fieldset", LN, [
						a[7] ||= Y("legend", { class: "dui-fieldset-legend" }, "Random selection", -1),
						X(By, {
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
						}, "Number of rolls", 8, RN),
						Go(Y("input", {
							id: `${r}-rolls`,
							"onUpdate:modelValue": a[3] ||= (e) => V(n).draft.count = e,
							"aria-label": "Number of rolls",
							type: "number",
							min: "1",
							max: "100",
							step: "1",
							class: "dui-input"
						}, null, 8, zN), [[
							ku,
							V(n).draft.count,
							void 0,
							{ number: !0 }
						]]),
						a[8] ||= Y("p", null, " Rolls leave results available for future rolls. An Item may be granted more than once. ", -1)
					])) : (K(), J(yN, {
						key: 3,
						id: e.id
					}, null, 8, ["id"])),
					e.kind === "wounds" ? Q("", !0) : (K(), J(wN, {
						key: 4,
						id: e.id
					}, null, 8, ["id"]))
				], 8, PN),
				!V(n).created && V(n).problems.length ? (K(), q("ul", BN, [(K(!0), q(G, null, W(V(n).problems, (e) => (K(), q("li", { key: e }, L(e), 1))), 128))])) : Q("", !0),
				Y("div", VN, [
					V(n).created ? Q("", !0) : (K(), q("button", {
						key: 0,
						type: "button",
						class: "dui-btn dui-btn-primary",
						disabled: !V(n).ready,
						onClick: a[4] ||= (...e) => V(n).create && V(n).create(...e)
					}, L(V(n).busy ? "Working…" : "Add effect to Item"), 9, HN)),
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
					}, L(V(n).created ? "Done" : "Cancel"), 9, UN)
				])
			]),
			_: 1
		}, 8, ["title", "description"]));
	}
});
//#endregion
//#region src/module/apps/effect-builders/bridge.ts
async function GN(e, t) {
	let n = LM(await fromUuid(e)), r = eN(t, C), i = t.kind === "grant" ? t.items : t.kind === "choice" ? t.groups.flatMap((e) => e.items) : [];
	for (let t of i) {
		if (t.uuid === e) throw Error("An Item cannot grant itself.");
		nn(await fromUuid(t.uuid), `The granted Item ${t.name} is no longer available.`);
	}
	if (t.kind === "random" && await BM(t.table.uuid, e), !n.createEmbeddedDocuments) throw Error("This Item cannot contain Active Effects.");
	await n.createEmbeddedDocuments("ActiveEffect", [r]);
}
var KN = {
	resolveItem: RM,
	async resolveTable(e) {
		return zM(await IM(e));
	},
	create: GN,
	async openItem(e) {
		nn(await fromUuid(e)).sheet?.render(!0);
	}
}, qN = 0, JN = class extends Aw {
	kind;
	destination;
	storeId;
	constructor(e, t = null) {
		let n = `${C}-effect-${++qN}`;
		super({
			id: n,
			window: { title: `${VM.find((t) => t.kind === e).title} Effect Builder` }
		}), this.kind = e, this.destination = t, this.storeId = n;
	}
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		classes: [C],
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
		return WN;
	}
	getVueProps() {
		return {
			id: this.storeId,
			kind: this.kind,
			destination: this.destination,
			bridge: KN,
			close: () => this.close()
		};
	}
	async _preClose(e) {
		let t = tN(this.storeId);
		await super._preClose(e), t.$dispose(), delete gw.state.value[`effect-builder:${this.storeId}`];
	}
}, YN = { key: 0 }, XN = { class: "dui-list" }, ZN = { class: "dui-list-col-grow" }, QN = ["aria-label", "onClick"], $N = /* @__PURE__ */ U({
	__name: "EffectBuildersApp",
	props: {
		destination: {},
		openBuilder: { type: Function }
	},
	setup(e) {
		return (t, n) => (K(), J(sN, {
			title: "Effect Builders",
			description: "Choose an effect to create, then select the Item that will carry it."
		}, {
			default: H(() => [
				e.destination ? (K(), q("p", YN, [n[0] ||= Z(" Destination: ", -1), Y("strong", null, L(e.destination.name), 1)])) : Q("", !0),
				Y("ul", XN, [(K(!0), q(G, null, W(V(VM), (t) => (K(), q("li", {
					key: t.kind,
					class: "dui-list-row"
				}, [Y("div", ZN, [Y("strong", null, L(t.title), 1), Y("p", null, L(t.description), 1)]), Y("button", {
					type: "button",
					class: "dui-btn",
					"aria-label": `Open ${t.title} Effect Builder`,
					onClick: (n) => e.openBuilder(t.kind)
				}, " Open ", 8, QN)]))), 128))]),
				n[1] ||= Y("p", null, "Find this launcher and individual shortcuts in the Effect Builders macro compendium.", -1)
			]),
			_: 1
		}));
	}
}), eP = class extends Aw {
	destination = null;
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${C}-effect-builders-{id}`,
		classes: [C],
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
		return $N;
	}
	getVueProps() {
		return {
			destination: this.destination,
			openBuilder: (e) => new JN(e, this.destination).render(!0)
		};
	}
};
//#endregion
//#region src/module/apps/effect-builders/open.ts
async function tP(e) {
	let t = new eP();
	e && (t.destination = FM(LM(await fromUuid(e)))), await t.render(!0);
}
async function nP(e, t) {
	await new JN(e, t ? FM(LM(await fromUuid(t))) : null).render(!0);
}
var rP = (e) => nP("wounds", e), iP = (e) => nP("grant", e), aP = (e) => nP("random", e), oP = (e) => nP("choice", e), sP = { key: 0 }, cP = ["disabled"], lP = { class: "dui-fieldset-legend" }, uP = {
	key: 0,
	class: "app:flex app:flex-wrap app:gap-2"
}, dP = { key: 1 }, fP = {
	key: 2,
	class: "app:max-w-full app:overflow-x-auto"
}, pP = { class: "dui-table dui-table-sm" }, mP = ["onClick"], hP = { class: "app:flex app:flex-wrap app:gap-2" }, gP = ["onClick"], _P = ["aria-label", "onClick"], vP = /* @__PURE__ */ U({
	__name: "SpeciesItemEffects",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = Lj(e.uuid), n = $(() => [
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
		return (r, i) => (K(), q(G, null, [V(t).dirty ? (K(), q("p", sP, "Save or reload Item changes before editing effects.")) : Q("", !0), (K(!0), q(G, null, W(n.value, (n) => (K(), q(G, { key: n.name }, [n.entries.length || n.name === "Effects" ? (K(), q("fieldset", {
			key: 0,
			class: "dui-fieldset",
			disabled: !e.editable || V(t).dirty
		}, [
			Y("legend", lP, L(n.name), 1),
			n.name === "Effects" ? (K(), q("div", uP, [Y("button", {
				type: "button",
				class: "dui-btn dui-btn-sm",
				onClick: i[0] ||= (e) => V(t).effectAction("create")
			}, " Add Effect "), Y("button", {
				type: "button",
				class: "dui-btn dui-btn-sm",
				onClick: i[1] ||= (t) => V(tP)(e.uuid)
			}, " Effect Builders ")])) : Q("", !0),
			n.entries.length ? Q("", !0) : (K(), q("p", dP, "No effects.")),
			n.entries.length ? (K(), q("div", fP, [Y("table", pP, [i[2] ||= Y("thead", null, [Y("tr", null, [
				Y("th", { scope: "col" }, "Effect"),
				Y("th", { scope: "col" }, "Type"),
				Y("th", { scope: "col" }, [Y("span", { class: "app:sr-only" }, "Actions")])
			])], -1), Y("tbody", null, [(K(!0), q(G, null, W(n.entries, (e) => (K(), q("tr", { key: e.id }, [
				Y("td", null, [Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm dui-btn-ghost app:h-auto app:whitespace-normal",
					onClick: (n) => V(t).effectAction("edit", e.id)
				}, L(e.name), 9, mP)]),
				Y("td", null, L(e.type), 1),
				Y("td", null, [Y("div", hP, [Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					onClick: (n) => V(t).effectAction("toggle", e.id)
				}, L(e.disabled ? "Enable" : "Disable"), 9, gP), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					"aria-label": `Delete ${e.name}`,
					onClick: (n) => V(t).effectAction("delete", e.id)
				}, " Delete ", 8, _P)])])
			]))), 128))])])])) : Q("", !0)
		], 8, cP)) : Q("", !0)], 64))), 128))], 64));
	}
}), yP = { class: "app:flex app:items-center app:gap-3" }, bP = ["disabled"], xP = { class: "dui-avatar" }, SP = { class: "app:w-20" }, CP = ["src"], wP = { class: "app:min-w-0 app:flex-1" }, TP = ["disabled"], EP = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, DP = {
	class: "dui-tabs dui-tabs-border",
	role: "tablist",
	"aria-label": "Species Item"
}, OP = [
	"id",
	"aria-selected",
	"aria-controls"
], kP = [
	"id",
	"aria-selected",
	"aria-controls"
], AP = [
	"id",
	"aria-selected",
	"aria-controls"
], jP = { class: "app:min-h-0 app:min-w-0 app:flex-1 app:overflow-y-auto" }, MP = ["id", "aria-labelledby"], NP = ["id", "aria-labelledby"], PP = ["id", "aria-labelledby"], FP = { class: "app:flex app:flex-wrap app:items-center app:gap-2" }, IP = ["disabled"], LP = ["disabled"], RP = {
	class: "app:text-sm",
	role: "status"
}, zP = /* @__PURE__ */ U({
	__name: "SpeciesItemApp",
	props: {
		uuid: {},
		editable: { type: Boolean },
		bridge: {}
	},
	setup(e) {
		let t = e, n = Lj(t.uuid);
		return n.configure(t.bridge), (t, r) => (K(), q("form", {
			class: "app:flex app:h-full app:min-w-0 app:flex-col app:gap-2",
			onSubmit: r[6] ||= Ru((e) => V(n).save(), ["prevent"])
		}, [
			Y("header", yP, [Y("button", {
				type: "button",
				class: "dui-btn dui-btn-outline app:h-auto",
				"aria-label": "Choose Species image",
				disabled: !e.editable || V(n).isSaving,
				onClick: r[0] ||= (e) => V(n).chooseImage()
			}, [Y("div", xP, [Y("div", SP, [Y("img", {
				src: V(n).draft.img,
				alt: "Species image",
				width: "80",
				height: "80",
				class: "app:object-contain"
			}, null, 8, CP)])])], 8, bP), Y("label", wP, [r[7] ||= Y("span", { class: "app:sr-only" }, "Name", -1), Go(Y("input", {
				"onUpdate:modelValue": r[1] ||= (e) => V(n).draft.name = e,
				"aria-label": "Species name",
				class: "dui-input dui-input-ghost app:w-full app:text-center app:text-xl",
				disabled: !e.editable || !V(n).isLoaded || V(n).isSaving,
				required: ""
			}, null, 8, TP), [[ku, V(n).draft.name]])])]),
			V(n).error ? (K(), q("div", EP, L(V(n).error), 1)) : Q("", !0),
			Y("div", DP, [
				Y("button", {
					id: `${e.uuid}-description-tab`,
					type: "button",
					role: "tab",
					class: I(["dui-tab app:flex-1", { "dui-tab-active": V(n).tab === "description" }]),
					"aria-selected": V(n).tab === "description",
					"aria-controls": `${e.uuid}-description-panel`,
					onClick: r[2] ||= (e) => V(n).tab = "description"
				}, " Description ", 10, OP),
				Y("button", {
					id: `${e.uuid}-details-tab`,
					type: "button",
					role: "tab",
					class: I(["dui-tab app:flex-1", { "dui-tab-active": V(n).tab === "details" }]),
					"aria-selected": V(n).tab === "details",
					"aria-controls": `${e.uuid}-details-panel`,
					onClick: r[3] ||= (e) => V(n).tab = "details"
				}, " Details ", 10, kP),
				Y("button", {
					id: `${e.uuid}-effects-tab`,
					type: "button",
					role: "tab",
					class: I(["dui-tab app:flex-1", { "dui-tab-active": V(n).tab === "effects" }]),
					"aria-selected": V(n).tab === "effects",
					"aria-controls": `${e.uuid}-effects-panel`,
					onClick: r[4] ||= (e) => V(n).tab = "effects"
				}, " Effects ", 10, AP)
			]),
			Y("div", jP, [
				Go(Y("section", {
					id: `${e.uuid}-description-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-description-tab`
				}, [V(n).isLoaded ? (K(), J(MM, {
					key: V(n).revision,
					uuid: e.uuid,
					editable: e.editable
				}, null, 8, ["uuid", "editable"])) : Q("", !0)], 8, MP), [[Xl, V(n).tab === "description"]]),
				Go(Y("section", {
					id: `${e.uuid}-details-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-details-tab`
				}, [X(kM, {
					uuid: e.uuid,
					editable: e.editable && V(n).isLoaded && !V(n).isSaving
				}, null, 8, ["uuid", "editable"])], 8, NP), [[Xl, V(n).tab === "details"]]),
				Go(Y("section", {
					id: `${e.uuid}-effects-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-effects-tab`
				}, [X(vP, {
					uuid: e.uuid,
					editable: e.editable && V(n).isLoaded && !V(n).isSaving
				}, null, 8, ["uuid", "editable"])], 8, PP), [[Xl, V(n).tab === "effects"]])
			]),
			Y("footer", FP, [
				Y("button", {
					type: "submit",
					class: "dui-btn dui-btn-sm dui-btn-primary",
					disabled: !e.editable || !V(n).isLoaded || V(n).isSaving
				}, " Save Item ", 8, IP),
				Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					disabled: V(n).isSaving,
					onClick: r[5] ||= (e) => V(n).reload()
				}, " Reload Item ", 8, LP),
				Y("span", RP, L(V(n).dirty ? "Unsaved changes" : V(n).message || "Saved"), 1)
			])
		], 32));
	}
});
//#endregion
//#region src/module/apps/species-item/editing.ts
function BP(t) {
	return (t.effects?.contents ?? []).map((t) => {
		let n = t.toObject(), r = e(n.system) ? n.system : {}, i = e(r.transferData) ? r.transferData : {};
		return {
			id: t.id,
			name: t.name,
			disabled: n.disabled === !0,
			temporary: t.isTemporary === !0,
			type: typeof i.type == "string" ? i.type : ""
		};
	});
}
async function VP(e, t, n) {
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
function HP(e, t) {
	new foundry.applications.apps.FilePicker.implementation({
		type: "image",
		current: e,
		callback: t
	}).render(!0);
}
//#endregion
//#region src/module/apps/species-item/notes.ts
function UP(e) {
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
//#region src/module/apps/species-item/parent.ts
async function WP(t) {
	if (!t.uuid && !t.id) return null;
	let n = ke(t, Me()) ?? (t.uuid ? await fromUuid(t.uuid) : void 0);
	if (!e(n) || typeof n.type != "string" || !T({ type: n.type }) || typeof n.toObject != "function") throw Error("The parent Species Item could not be resolved.");
	let r = n.toObject.call(n);
	if (!e(r)) throw Error("The parent Species Item has no source data.");
	return E(r.system);
}
//#endregion
//#region src/module/apps/species-item/bridge.ts
function GP(t) {
	let n = "", r = UP(t), i = () => {
		let e = ie(t);
		return n = JSON.stringify(t.toObject()), {
			name: e.name,
			img: e.img,
			system: e.system
		};
	};
	return {
		isGM: game.user?.isGM === !0,
		flushNotes: r.flush,
		editNotes: r.edit,
		async openReference(t) {
			let n = await fromUuid(t), r = e(n) ? n.sheet : void 0;
			if (e(r) && typeof r.render == "function") r.render.call(r, !0);
			else throw Error("The referenced document could not be opened.");
		},
		effects: () => BP(t),
		effectAction: (e, n) => VP(t, e, n),
		chooseImage: HP,
		mountNotes: r.mount,
		load: i,
		loadParent: WP,
		async save(e) {
			if (n !== JSON.stringify(t.toObject())) throw Error("This Item changed in another window. Reload its sheet before saving.");
			return await Pe(t, e), i();
		},
		async resolveDrop(t) {
			let n = JSON.parse(t), r = e(n) ? n.uuid : void 0;
			if (typeof r != "string") throw Error("Drop a Species, Skill, Talent, or RollTable document.");
			let i = await fromUuid(r);
			if (!e(i) || typeof i.uuid != "string" || typeof i.id != "string" || typeof i.name != "string") throw Error("The dropped document could not be resolved.");
			return {
				type: i.documentName === "RollTable" ? "RollTable" : String(i.type),
				reference: {
					uuid: i.uuid,
					id: i.id,
					name: i.name
				}
			};
		}
	};
}
//#endregion
//#region src/module/apps/species-item/SpeciesItemApplication.ts
var KP = class extends foundry.applications.api.DocumentSheetV2 {
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		tag: "div",
		classes: [C],
		position: {
			width: 640,
			height: 780
		},
		window: {
			resizable: !0,
			icon: "fa-solid fa-people-group"
		}
	};
	#e = new kw();
	async _renderHTML(e, t) {
		return this.#e.createRoot();
	}
	_replaceHTML(e, t, n) {
		this.#e.mount(e, t, zP, {
			uuid: this.document.uuid,
			editable: this.isEditable && game.user?.isGM === !0,
			bridge: GP(this.document)
		});
	}
	async _preClose(e) {
		this.#e.unmount(), await super._preClose(e);
	}
};
function qP() {
	foundry.applications.apps.DocumentSheetConfig.registerSheet(Item, C, KP, {
		types: [re],
		makeDefault: !0,
		label: "Species Customizer"
	});
}
//#endregion
//#region src/module/apps/species-builder/items/model.ts
function JP() {
	let e = CONFIG.Item.dataModels.species;
	if (e) {
		CONFIG.Item.dataModels[re] = e;
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
				characteristics: new e.SchemaField(Object.fromEntries(Object.values(l).map((t) => [t, new e.SchemaField({
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
	CONFIG.Item.dataModels[re] = n;
}
//#endregion
//#region src/module/debug/shape-inspector/constants.ts
var YP = `${C}.debugShapeProbes`, XP = "wfrp4eCustomizerShapeProbes", ZP = "wfrp4eCustomizerShapePreset";
//#endregion
//#region src/module/debug/shape-inspector/utils.ts
function QP(e, t, n) {
	let r = Number(e);
	return Number.isFinite(r) ? Math.max(0, Math.min(n, Math.floor(r))) : t;
}
function $P(e) {
	return typeof e == "object" && !!e;
}
function eF(e) {
	return typeof e == "string" ? e.trim().toLocaleLowerCase() : "";
}
function tF(e) {
	try {
		return localStorage.getItem(e);
	} catch {
		return null;
	}
}
//#endregion
//#region src/module/debug/shape-inspector/path-resolver.ts
function nF(e) {
	let t = cF(e), n = rF(globalThis, t.root);
	for (let e of t.tokens) {
		if (e.type === "property") {
			n = rF(n, e.key);
			continue;
		}
		if (e.type === "index") {
			n = rF(n, String(e.index));
			continue;
		}
		n = iF(n, e.name, e.args);
	}
	return n;
}
function rF(e, t) {
	if (!(!$P(e) && typeof e != "function")) try {
		return e[t];
	} catch {
		return;
	}
}
function iF(e, t, n) {
	if (t === "at") {
		let t = Number(n[0] ?? 0), r = Number.isFinite(t) ? t : 0;
		return lF(e).at(r);
	}
	if (t === "findByName") {
		let t = eF(n[0] ?? "");
		return lF(e).find((e) => eF(rF(e, "name")) === t);
	}
	if (t === "findByType") {
		let t = eF(n[0] ?? "");
		return lF(e).find((e) => eF(rF(e, "type")) === t);
	}
	if (t === "get") {
		let t = n[0] ?? "";
		if (e instanceof Map) return e.get(t);
		let r = rF(e, "get");
		if (typeof r == "function") return r.call(e, t);
	}
	if (t === "sample") {
		let t = QP(n[0], 3, 60);
		return lF(e).slice(0, t);
	}
	throw Error(`Unsupported path method "${t}".`);
}
function aF(e) {
	return e.trim() ? e.split(",").map((e) => sF(e.trim())).map(String) : [];
}
function oF(e) {
	let t = e.trim();
	return /^-?\d+$/.test(t) ? Number(t) : sF(t);
}
function sF(e) {
	let t = /^["'](?<value>.*)["']$/.exec(e);
	return t?.groups ? t.groups.value ?? "" : e;
}
function cF(e) {
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
				args: aF(e.groups.args ?? ""),
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
				index: oF(e),
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
function lF(e) {
	if (Array.isArray(e)) return e;
	let t = rF(e, "contents");
	return Array.isArray(t) ? t : [];
}
//#endregion
//#region src/module/debug/shape-inspector/presets.ts
var uF = { "npc-builder": [
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
function dF() {
	return window.location.href.includes("wfrp4eCustomizerShapeProbes") || window.location.href.includes("wfrp4eCustomizerShapePreset");
}
function fF(e) {
	let t = {
		hook: e.hook ?? "ready",
		maxDepth: QP(e.maxDepth, 2, 6),
		maxEntries: QP(e.maxEntries, 12, 60),
		path: e.path.trim()
	};
	return e.label && (t.label = e.label), t;
}
function pF() {
	return [...mF(), ...hF()].map(fF);
}
function mF() {
	let e = tF(YP);
	if (!e) return [];
	try {
		let t = JSON.parse(e);
		return Array.isArray(t) ? t.filter(_F).map(fF) : [];
	} catch {
		return [];
	}
}
function hF() {
	let e = [], t = [new URLSearchParams(window.location.search), new URLSearchParams(window.location.hash.replace(/^#/, ""))];
	for (let n of t) {
		let t = n.get(ZP), r = n.get(XP);
		t && e.push(...uF[t] ?? []), r && e.push(...gF(r));
	}
	return window.location.href.includes("wfrp4eCustomizerShapePreset=npc-builder") && !e.length && e.push(...uF["npc-builder"] ?? []), e;
}
function gF(e) {
	try {
		let t = JSON.parse(decodeURIComponent(e));
		return Array.isArray(t) ? t.filter(_F) : [];
	} catch (e) {
		return Ir(`${C} | Could not parse URL shape probes.`, e), [];
	}
}
function _F(e) {
	return typeof e != "object" || !e ? !1 : "path" in e && typeof e.path == "string";
}
//#endregion
//#region src/module/debug/shape-inspector/summary.ts
function vF(e, t) {
	return !$P(e) && typeof e != "function" ? CF(e) : typeof e == "function" ? xF(e) : Array.isArray(e) ? yF(e, t) : e instanceof Map ? bF(e, t) : SF(e, t);
}
function yF(e, t) {
	return {
		length: e.length,
		sample: e.slice(0, t.maxEntries).map((e) => vF(e, TF(t))),
		type: "array"
	};
}
function bF(e, t) {
	return {
		sample: [...e.entries()].slice(0, t.maxEntries).map(([e, n]) => ({
			key: vF(e, TF(t)),
			value: vF(n, TF(t))
		})),
		size: e.size,
		type: "Map"
	};
}
function xF(e) {
	return {
		name: e.name,
		type: "function"
	};
}
function SF(e, t) {
	if (t.seen.has(e)) return { type: "circular" };
	t.seen.add(e);
	let n = wF(e, t.maxEntries), r = rF(e, "constructor"), i = {
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
		let n = rF(e, t);
		typeof n == "string" && (i[t] = n);
	}
	if (t.maxDepth <= 0) return i;
	let a = {};
	for (let r of n) a[r] = vF(rF(e, r), TF(t));
	i.properties = a;
	let o = rF(e, "toObject");
	if (typeof o == "function") try {
		i.source = vF(o.call(e), TF(t));
	} catch (e) {
		i.source = {
			error: e instanceof Error ? e.message : String(e),
			type: "error"
		};
	}
	return i;
}
function CF(e) {
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
function wF(e, t) {
	return Object.keys(e).sort().slice(0, t);
}
function TF(e) {
	return {
		maxDepth: e.maxDepth - 1,
		maxEntries: e.maxEntries,
		seen: e.seen
	};
}
//#endregion
//#region src/module/debug/shape-inspector/index.ts
function EF() {
	localStorage.removeItem(YP), Fr(`${C} | Cleared debug shape probes.`);
}
function DF() {
	return pF();
}
function OF(e, t = {}) {
	let n = jF(e, t);
	return NF(n), n;
}
function kF() {
	let e = pF();
	for (let t of ["init", "setup"]) {
		let n = e.filter((e) => e.hook === t);
		n.length && Hooks.once(t, () => {
			for (let e of n) MF(e, t);
		});
	}
	Hooks.once("ready", () => {
		let e = pF().filter((e) => (e.hook ?? "ready") === "ready");
		dF() && Fr(`${C} | Debug shape ready probes discovered: ${e.length}`, window.location.href);
		for (let t of e) MF(t, "ready");
	});
}
function AF(e) {
	let t = e.map(fF);
	localStorage.setItem(YP, JSON.stringify(t)), Fr(`${C} | Stored ${t.length} debug shape probe(s). Reload Foundry to run init/setup probes.`);
}
function jF(e, t = {}, n) {
	let r = QP(t.maxDepth, 2, 6), i = QP(t.maxEntries, 12, 60), a = nF(e), o = {
		inspectedAt: (/* @__PURE__ */ new Date()).toISOString(),
		label: t.label || e,
		maxDepth: r,
		maxEntries: i,
		path: e,
		value: vF(a, {
			maxDepth: r,
			maxEntries: i,
			seen: /* @__PURE__ */ new WeakSet()
		})
	};
	return n && (o.hook = n), o;
}
function MF(e, t) {
	try {
		NF(jF(e.path, e, t));
	} catch (t) {
		Ir(`${C} | Debug shape probe failed for "${e.path}".`, t);
	}
}
function NF(e) {
	Fr(`${C} | Debug shape probe: ${e.label}`, JSON.stringify(e, null, 2));
}
//#endregion
//#region src/view/apps/daisy-example/DaisyExampleApp.vue?vue&type=script&setup=true&lang.ts
var PF = { class: "dui-list" }, FF = /* @__PURE__ */ U({
	__name: "DaisyExampleApp",
	setup(e) {
		let t = [
			"button",
			"badge",
			"card",
			"alert"
		];
		return (e, n) => (K(), J(sN, {
			description: "A quick visual check of the module's isolated Daisy component theme.",
			title: "Daisy Probe"
		}, {
			header: H(() => [...n[0] ||= [Y("span", { class: "dui-badge dui-badge-primary" }, "Scoped", -1), Y("span", { class: "dui-badge dui-badge-outline" }, "Foundry-safe", -1)]]),
			actions: H(() => [...n[1] ||= [Y("span", { class: "dui-badge dui-badge-success" }, "Ready", -1)]]),
			default: H(() => [n[2] ||= Y("div", { class: "dui-alert dui-alert-info" }, [Y("span", null, "DaisyUI is available inside this Vue application root.")], -1), Y("ul", PF, [(K(), q(G, null, W(t, (e) => Y("li", {
				key: e,
				class: "dui-list-row"
			}, L(e), 1)), 64))])]),
			_: 1
		}));
	}
}), IF = class extends Aw {
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${C}-daisy-example`,
		classes: [C, "wfrp4e-customizer-daisy-example"],
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
		return FF;
	}
}, LF = { class: "dui-list" }, RF = { class: "dui-list-row" }, zF = { class: "dui-list-row" }, BF = { class: "dui-list-row" }, VF = { class: "dui-list-row" }, HF = /* @__PURE__ */ U({
	__name: "WorkbenchApp",
	props: {
		openDaisyProbe: { type: Function },
		openNpcBuilder: { type: Function },
		openEffectBuilders: { type: Function },
		openSpeciesTableEditor: { type: Function }
	},
	setup(e) {
		return (t, n) => (K(), J(sN, {
			description: "Open a focused WFRP4e authoring workflow.",
			title: "Customizer Workbench"
		}, {
			default: H(() => [Y("ul", LF, [
				Y("li", RF, [n[4] ||= Y("div", { class: "dui-list-col-grow" }, [Y("strong", null, "NPC Builder"), Y("p", null, "Build an NPC from a base Actor, Careers, traits, trappings, and spells.")], -1), Y("button", {
					"aria-label": "Open NPC Builder",
					class: "dui-btn dui-btn-primary",
					type: "button",
					onClick: n[0] ||= (...t) => e.openNpcBuilder && e.openNpcBuilder(...t)
				}, " Open ")]),
				Y("li", zF, [n[5] ||= Y("div", { class: "dui-list-col-grow" }, [Y("strong", null, "Effect Builders"), Y("p", null, "Create wound formulas, Item grants, random grants, and player choices as effects.")], -1), Y("button", {
					"aria-label": "Open Effect Builders",
					class: "dui-btn",
					type: "button",
					onClick: n[1] ||= (...t) => e.openEffectBuilders && e.openEffectBuilders(...t)
				}, " Open ")]),
				Y("li", BF, [n[6] ||= Y("div", { class: "dui-list-col-grow" }, [Y("strong", null, "Species Table Editor"), Y("p", null, "Drop Species Items into the world's species roll table and adjust their chances.")], -1), Y("button", {
					"aria-label": "Open Species Table Editor",
					class: "dui-btn",
					type: "button",
					onClick: n[2] ||= (...t) => e.openSpeciesTableEditor && e.openSpeciesTableEditor(...t)
				}, " Open ")]),
				Y("li", VF, [n[7] ||= Y("div", { class: "dui-list-col-grow" }, [Y("strong", null, "DaisyUI Probe"), Y("p", null, "Check the module's scoped component theme.")], -1), Y("button", {
					"aria-label": "Open DaisyUI Probe",
					class: "dui-btn dui-btn-ghost",
					type: "button",
					onClick: n[3] ||= (...t) => e.openDaisyProbe && e.openDaisyProbe(...t)
				}, " Open ")])
			])]),
			_: 1
		}));
	}
});
//#endregion
//#region src/functions/species-table/draft.ts
function UF(e, t) {
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
function WF(e, t) {
	let n = En(e, t, !0);
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
//#region src/state/species-table/index.ts
function GF(e) {
	return Td(`species-table:${e}`, () => {
		let e = /* @__PURE__ */ B({
			...wn(),
			rows: []
		}), t = /* @__PURE__ */ B([]), n = /* @__PURE__ */ B(""), r = /* @__PURE__ */ B(!1), i = /* @__PURE__ */ B(!1), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(""), s = /* @__PURE__ */ B(!0), c = /* @__PURE__ */ B(""), l, u = $(() => WF(e.value, t.value)), d = $(() => Dn(e.value.rows)), f = $(() => e.value.rows.reduce((e, t) => e + Number(t.weight || 0), 0)), p = $(() => t.value.filter((t) => !e.value.rows.some((e) => e.speciesKey === t.key))), m = $(() => i.value && !r.value && !u.value.length);
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
				UF(e.value, r);
				let i = t.value.findIndex((e) => e.key === r.option.key);
				i === -1 ? t.value.push(r.option) : t.value[i] = r.option, o.value = r.message;
			});
		}
		async function b() {
			let n = t.value.find((e) => e.key === c.value);
			n && (n.itemUuid ? await y(JSON.stringify({ uuid: n.itemUuid })) : UF(e.value, {
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
	})(gw);
}
//#endregion
//#region src/view/apps/species-table/SpeciesTableRows.vue?vue&type=script&setup=true&lang.ts
var KF = { class: "dui-fieldset app:min-w-0" }, qF = { class: "app:max-w-full app:overflow-x-auto" }, JF = { class: "dui-table dui-table-sm" }, YF = { scope: "row" }, XF = { class: "app:sr-only" }, ZF = ["onUpdate:modelValue", "aria-label"], QF = ["aria-label", "onClick"], $F = { key: 0 }, eI = /* @__PURE__ */ U({
	__name: "SpeciesTableRows",
	props: { id: {} },
	setup(e) {
		let t = GF(e.id), n = new Intl.NumberFormat(void 0, {
			style: "percent",
			maximumFractionDigits: 2
		});
		return (e, r) => (K(), q("fieldset", KF, [
			r[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Roll weights", -1),
			r[2] ||= Y("p", null, "A species with weight 2 is twice as likely as one with weight 1.", -1),
			Y("div", qF, [Y("table", JF, [
				Y("caption", null, " Species chances · " + L(V(t).problems.length ? "Finish the entries to calculate a valid roll" : `Roll 1d${V(t).total}`), 1),
				r[0] ||= Y("thead", null, [Y("tr", null, [
					Y("th", { scope: "col" }, "Species"),
					Y("th", { scope: "col" }, "Weight"),
					Y("th", { scope: "col" }, "Chance"),
					Y("th", { scope: "col" }, "Range"),
					Y("th", { scope: "col" }, "Actions")
				])], -1),
				Y("tbody", null, [(K(!0), q(G, null, W(V(t).draft.rows, (e, r) => (K(), q("tr", { key: e.speciesKey || e.resultId || r }, [
					Y("th", YF, L(e.name || "Unassigned species"), 1),
					Y("td", null, [Y("label", null, [Y("span", XF, "Weight for " + L(e.name), 1), Go(Y("input", {
						"onUpdate:modelValue": (t) => e.weight = t,
						"aria-label": `Weight for ${e.name}`,
						class: "dui-input dui-input-sm app:w-20",
						type: "number",
						min: "1",
						step: "1"
					}, null, 8, ZF), [[
						ku,
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
					}, " Remove ", 8, QF)])
				]))), 128))])
			])]),
			V(t).draft.rows.length ? Q("", !0) : (K(), q("p", $F, "Add a species or drop a Species Item to start."))
		]));
	}
}), tI = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, nI = {
	key: 1,
	class: "dui-alert dui-alert-info",
	role: "status"
}, rI = {
	key: 2,
	role: "status"
}, iI = ["disabled"], aI = ["for"], oI = ["id"], sI = { key: 0 }, cI = { key: 1 }, lI = ["for"], uI = { class: "app:flex app:flex-wrap app:gap-2" }, dI = ["id"], fI = ["value"], pI = ["disabled"], mI = {
	key: 2,
	class: "dui-label"
}, hI = {
	key: 4,
	class: "dui-list",
	"aria-label": "Before saving"
}, gI = ["disabled"], _I = ["disabled"], vI = ["disabled"], yI = /* @__PURE__ */ U({
	__name: "SpeciesTableApp",
	props: {
		id: {},
		bridge: {},
		close: { type: Function }
	},
	setup(e) {
		let t = e, n = GF(t.id);
		return n.configure(t.bridge), xs(() => n.load()), (t, r) => (K(), J(sN, {
			title: "Species Table Editor",
			description: "Choose which species can be rolled during character creation, and how often."
		}, {
			actions: H(() => [
				Y("button", {
					type: "button",
					class: "dui-btn dui-btn-primary",
					disabled: !V(n).ready,
					onClick: r[4] ||= (...e) => V(n).save && V(n).save(...e)
				}, " Save table ", 8, gI),
				Y("button", {
					type: "button",
					class: "dui-btn",
					disabled: V(n).busy,
					onClick: r[5] ||= (...e) => V(n).load && V(n).load(...e)
				}, " Reload saved table ", 8, _I),
				Y("button", {
					type: "button",
					class: "dui-btn dui-btn-ghost",
					disabled: V(n).busy,
					onClick: r[6] ||= (...t) => e.close && e.close(...t)
				}, " Close ", 8, vI)
			]),
			default: H(() => [
				V(n).error ? (K(), q("div", tI, L(V(n).error), 1)) : Q("", !0),
				V(n).message ? (K(), q("div", nI, L(V(n).message), 1)) : Q("", !0),
				V(n).busy ? (K(), q("p", rI, "Working…")) : Q("", !0),
				V(n).loaded ? (K(), q("fieldset", {
					key: 3,
					class: "dui-fieldset app:min-w-0",
					disabled: V(n).busy
				}, [
					Y("label", {
						for: `${e.id}-name`,
						class: "dui-label"
					}, "Table name", 8, aI),
					Go(Y("input", {
						id: `${e.id}-name`,
						"onUpdate:modelValue": r[0] ||= (e) => V(n).draft.name = e,
						"aria-label": "Table name",
						class: "dui-input app:w-full"
					}, null, 8, oI), [[ku, V(n).draft.name]]),
					V(n).draft.ownership === "external" ? (K(), q("p", sI, " Saving creates a Customizer copy of this table. The source table is preserved. ")) : V(n).draft.isRegistered ? (K(), q("p", cI, "This is the world's active Species table.")) : Q("", !0),
					X(By, {
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
					}, "Add an available species", 8, lI),
					Y("div", uI, [Go(Y("select", {
						id: `${e.id}-species`,
						"onUpdate:modelValue": r[1] ||= (e) => V(n).selected = e,
						"aria-label": "Add an available species",
						class: "dui-select app:max-w-full"
					}, [r[7] ||= Y("option", { value: "" }, "Choose a species…", -1), (K(!0), q(G, null, W(V(n).available, (e) => (K(), q("option", {
						key: e.key,
						value: e.key
					}, L(e.label), 9, fI))), 128))], 8, dI), [[Mu, V(n).selected]]), Y("button", {
						type: "button",
						class: "dui-btn",
						disabled: !V(n).selected,
						onClick: r[2] ||= (...e) => V(n).addSelected && V(n).addSelected(...e)
					}, " Add species ", 8, pI)]),
					X(eI, { id: e.id }, null, 8, ["id"]),
					!V(n).draft.isRegistered || V(n).draft.ownership === "external" ? (K(), q("label", mI, [Go(Y("input", {
						"onUpdate:modelValue": r[3] ||= (e) => V(n).register = e,
						type: "checkbox",
						class: "dui-checkbox"
					}, null, 512), [[Au, V(n).register]]), r[8] ||= Z(" Use this table for the world's species rolls ", -1)])) : Q("", !0)
				], 8, iI)) : Q("", !0),
				V(n).loaded && V(n).problems.length ? (K(), q("ul", hI, [(K(!0), q(G, null, W(V(n).problems, (e) => (K(), q("li", { key: e }, L(e), 1))), 128))])) : Q("", !0)
			]),
			_: 1
		}));
	}
}), bI = "species", xI = "tableSettings";
async function SI(e) {
	let t = e ? { definitions: [] } : await Ne(), n = new Set(t.definitions.map((e) => e.key)), r = CI().filter((e) => !n.has(e.key)), i = e ?? Tn(r, t.definitions), a = game.tables?.contents ?? [], o = wI(), s = TI(a, a.filter(Kn), o);
	return {
		draft: s ? EI(s, i, o[0] === s.id) : kI(),
		runtimeOptions: r
	};
}
function CI() {
	let t = game.wfrp4e?.config?.species;
	return e(t) ? Object.entries(t).flatMap(([e, t]) => {
		let n = typeof t == "string" ? t.trim() : "";
		return e.trim() && n ? [{
			key: e.trim(),
			label: n
		}] : [];
	}) : [];
}
function wI() {
	let t = game.settings.get(w, xI), n = e(t) ? t[bI] : void 0;
	return typeof n == "string" ? n.split(",").map((e) => e.trim()).filter(Boolean) : [];
}
function TI(e, t, n) {
	if (t.length > 1) {
		let e = t.filter((e) => n[0] === e.id);
		if (e.length === 1) return e[0];
		throw Error("Multiple Species Builder-managed Species tables exist. Remove the duplicate and reload.");
	}
	if (t[0]) return t[0];
	for (let t of n) {
		let n = e.find((e) => e.id === t);
		if (n) return n;
	}
	return e.find((e) => e.getFlag(w, "key") === bI);
}
function EI(e, t, n) {
	let r = e.toObject(), i = (Array.isArray(r.results) ? r.results : []).flatMap((e) => DI(e, t));
	return i.sort((e, t) => OI(e.source) - OI(t.source)), {
		isRegistered: n,
		name: e.name,
		ownership: Kn(e) ? "managed" : "external",
		requiresLinkRepair: i.some((e) => e.requiresLinkRepair),
		rows: i.map(({ row: e }) => e),
		tableId: e.id
	};
}
function DI(t, r) {
	if (!e(t)) return [];
	let i = n(t, ["name"]), a = kn(n(t, ["description"])), o = n(t, [
		"flags",
		w,
		"species"
	]), s = n(t, ["documentUuid"]), c = a?.label || i, l = On(o, c, r), u = n(t, ["_id"]), d = n(t, ["type"]);
	return [{
		requiresLinkRepair: d === "document" ? !s : !a || a.label !== i.trim() || d !== "text",
		row: {
			...s || a ? { journalUuid: s || a.uuid } : {},
			name: c,
			...u ? { resultId: u } : {},
			speciesKey: l,
			weight: An(t)
		},
		source: t
	}];
}
function OI(e) {
	let n = t(e, ["range"]), r = Array.isArray(n) ? Number(n[0]) : 0;
	return Number.isInteger(r) ? r : 0;
}
function kI() {
	return {
		isRegistered: !1,
		name: "Species",
		ownership: "new",
		requiresLinkRepair: !1,
		rows: []
	};
}
//#endregion
//#region src/module/apps/species-table/bridge.ts
var AI = !1;
function jI(e) {
	return JSON.stringify({
		table: e ? game.tables?.get(e)?.toObject() : null,
		settings: game.settings.get("wfrp4e", "tableSettings")
	});
}
async function MI() {
	an();
	let e = on(), { draft: t } = await SI(e), n = [];
	for (let r of t.rows) {
		let t = r.journalUuid;
		if (t && (t.startsWith("Item.") || t.includes(".Item.") || r.speciesKey.startsWith("item:"))) {
			let i = await cn(t), a = {
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
		revision: jI(t.tableId)
	};
}
async function NI(e) {
	if ((await MI()).revision !== e) throw Error("The world's Species table or table settings changed. Reload the editor before saving.");
}
async function PI(e) {
	let t = on();
	for (let n of e.rows) {
		if (!n.itemUuid) continue;
		let e = await un(JSON.stringify({ uuid: n.itemUuid }));
		if (e.option.key !== n.speciesKey || e.option.label !== n.name) throw Error(`${n.name} changed. Reload the editor and drop the updated Species Item again.`);
		t.some((t) => t.key === e.option.key) || t.push(e.option);
	}
	let n = WF(e, t);
	if (n.length) throw Error(n.join("\n"));
}
async function FI(e, t, n) {
	if (an(), AI) throw Error("Another Species table save is in progress. Try again when it finishes.");
	AI = !0;
	try {
		await NI(t), await PI(e);
		let r = structuredClone(e);
		for (let e of r.rows) {
			if (!e.itemUuid) continue;
			let t = await cn(e.itemUuid);
			e.speciesKey = `item:${t.uuid}`, e.itemUuid = t.uuid, e.journalUuid = t.uuid, e.name = t.name;
		}
		await NI(t);
		let i = on();
		for (let e of r.rows) e.itemUuid && !i.some((t) => t.key === e.speciesKey) && i.push({
			key: e.speciesKey,
			label: e.name,
			itemUuid: e.itemUuid
		});
		let a = WF(r, i);
		if (a.length) throw Error(a.join("\n"));
		let o = await Wn(r), s;
		if (n) try {
			await Gn(o.id);
		} catch (e) {
			s = e instanceof Error ? e.message : String(e);
		}
		return {
			...await MI(),
			...s ? { registrationError: s } : {}
		};
	} finally {
		AI = !1;
	}
}
var II = {
	load: MI,
	resolveDrop: un,
	save: FI
}, LI = 0, RI = class extends Aw {
	storeId;
	constructor() {
		let e = `${C}-species-table-${++LI}`;
		super({ id: e }), this.storeId = e;
	}
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		classes: [C],
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
		return yI;
	}
	getVueProps() {
		return {
			id: this.storeId,
			bridge: II,
			close: () => this.close()
		};
	}
	async _preClose(e) {
		let t = GF(this.storeId);
		await super._preClose(e), t.$dispose(), delete gw.state.value[`species-table:${this.storeId}`];
	}
};
async function zI() {
	an(), await new RI().render(!0);
}
//#endregion
//#region src/module/apps/workbench/WorkbenchApplication.ts
var BI = class extends Aw {
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${C}-workbench`,
		classes: [C, "wfrp4e-customizer-workbench"],
		position: {
			height: 530,
			width: 640
		},
		window: {
			icon: "fa-solid fa-screwdriver-wrench",
			title: te
		}
	};
	getVueComponent() {
		return HF;
	}
	getVueProps() {
		return {
			openDaisyProbe: () => new IF().render(!0),
			openNpcBuilder: () => new fk().render(!0),
			openEffectBuilders: tP,
			openSpeciesTableEditor: zI
		};
	}
};
//#endregion
//#region src/module/register-module-menus.ts
function VI() {
	game.settings.registerMenu(C, "workbench", {
		hint: `Open the ${te} workbench.`,
		icon: "fa-solid fa-screwdriver-wrench",
		label: "Open Workbench",
		name: te,
		restricted: !0,
		type: BI
	}), game.settings.registerMenu(C, "npc-builder", {
		hint: "Build a WFRP4e NPC from a base Actor and Career items.",
		icon: "fa-solid fa-user-plus",
		label: "Open NPC Builder",
		name: "WFRP4e NPC Builder",
		restricted: !0,
		type: fk
	}), game.settings.registerMenu(C, "effect-builders", {
		hint: "Create native WFRP effects on your Items.",
		icon: "fa-solid fa-wand-magic-sparkles",
		label: "Open Effect Builders",
		name: "Effect Builders",
		restricted: !1,
		type: eP
	}), game.settings.registerMenu(C, "daisy-example", {
		hint: "Open a small isolated DaisyUI component probe.",
		icon: "fa-solid fa-flask",
		label: "Open Daisy Probe",
		name: "WFRP4e Daisy Probe",
		restricted: !0,
		type: IF
	});
}
//#endregion
//#region src/functions/species-builder/career-table-normalization.ts
function HI(t) {
	if (!e(t)) return;
	let n = UI(t.rows) ?? WI(t.careers);
	return n ? { rows: n } : void 0;
}
function UI(t) {
	if (!Array.isArray(t)) return;
	let n = t.flatMap((t) => {
		if (!e(t)) return [];
		let n = KI(t.name);
		if (!n) return [];
		let r = { name: n };
		return A(r, "journalUuid", KI(t.journalUuid)), [r];
	});
	return n.length > 0 ? n : void 0;
}
function WI(e) {
	return GI(e)?.map((e) => ({ name: e }));
}
function GI(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap((e) => {
		let t = KI(e);
		return t ? [t] : [];
	});
	return t.length > 0 ? t : void 0;
}
function KI(e) {
	if (typeof e == "string") return e.trim() || void 0;
}
//#endregion
//#region src/functions/species-builder/replacement-row-normalization.ts
function qI(t) {
	if (!Array.isArray(t)) return;
	let n = t.flatMap((t) => {
		if (!e(t)) return [];
		let n = YI(t.rolled, "talent"), r = YI(t.replacement, "talent");
		return !n.name || !r.name ? [] : [{
			replacement: r,
			rolled: n
		}];
	});
	return n.length > 0 ? n : void 0;
}
function JI(t) {
	if (!Array.isArray(t)) return;
	let n = t.flatMap((t) => {
		if (!e(t)) return [];
		let n = YI(t.rolled, "career"), r = Array.isArray(t.replacements) ? t.replacements.flatMap((e) => {
			let t = YI(e, "career");
			return t.name ? [t] : [];
		}) : [];
		return !n.name || r.length === 0 ? [] : [{
			replacements: r,
			rolled: n
		}];
	});
	return n.length > 0 ? n : void 0;
}
function YI(t, n) {
	if (typeof t == "string") return { name: QI(t) ?? "" };
	if (!e(t)) return { name: "" };
	let r = XI(t.item, n), i = QI(t.name) ?? r?.name ?? "";
	return r ? {
		item: r,
		name: i
	} : { name: i };
}
function XI(t, n) {
	if (!e(t)) return;
	let r = QI(t.name), i = ZI(t.type), a = QI(t.uuid);
	if (!r || i !== n || !a) return;
	let o = {
		name: r,
		type: i,
		uuid: a
	}, s = QI(t.specification) ?? QI(t.specifier);
	s && (o.specification = s);
	let c = QI(t.img);
	return c && (o.img = c), o;
}
function ZI(e) {
	return e === "career" || e === "skill" || e === "talent" || e === "trait" ? e : void 0;
}
function QI(e) {
	if (typeof e == "string") return e.trim() || void 0;
}
//#endregion
//#region src/functions/species-builder/linked-grant-normalization.ts
function $I(e, t) {
	if (!Array.isArray(e)) return;
	let n = e.flatMap((e) => {
		let n = YI(e, t);
		return n.name ? [n] : [];
	});
	return n.length > 0 ? n : void 0;
}
function eL(t) {
	if (!Array.isArray(t)) return;
	let n = t.flatMap((t) => {
		if (!e(t) || !Array.isArray(t.choices)) return [];
		let n = t.choices.flatMap((e) => {
			let t = YI(e, "talent");
			return t.name ? [t] : [];
		});
		return n.length > 0 ? [{ choices: n }] : [];
	});
	return n.length > 0 ? n : void 0;
}
//#endregion
//#region src/functions/species-builder/config-keys.ts
function tL(e) {
	return e.trim().toLocaleLowerCase().replaceAll(/[^\da-z]+/g, "-").replaceAll(/^-+|-+$/g, "");
}
//#endregion
//#region src/functions/species-builder/settings-normalization/values.ts
var nL = Object.values(l);
function rL(e) {
	return typeof e == "string" ? tL(e) : "";
}
function iL(e) {
	if (typeof e == "string") return e.trim() || void 0;
}
function aL(e) {
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function oL(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap((e) => {
		let t = iL(e);
		return t ? [t] : [];
	});
	return t.length > 0 ? t : void 0;
}
function sL(t) {
	if (!e(t)) return;
	let n = Object.entries(t).flatMap(([e, t]) => {
		let n = iL(e), r = iL(t);
		return n && r ? [[n, r]] : [];
	});
	return n.length > 0 ? Object.fromEntries(n) : void 0;
}
function cL(t) {
	if (!e(t)) return;
	let n = Object.entries(t).flatMap(([e, t]) => {
		let n = iL(e), r = aL(t);
		return n && r !== void 0 ? [[n, r]] : [];
	});
	return n.length > 0 ? Object.fromEntries(n) : void 0;
}
function lL(t) {
	if (!e(t)) return;
	let n = Object.entries(t).flatMap(([e, t]) => {
		let n = iL(e), r = oL(t);
		return n && r ? [[n, r]] : [];
	});
	return n.length > 0 ? Object.fromEntries(n) : void 0;
}
function uL(t) {
	if (!e(t)) return;
	let n = nL.flatMap((e) => {
		let n = iL(t[e]);
		return n ? [[e, n]] : [];
	});
	return n.length > 0 ? Object.fromEntries(n) : void 0;
}
function dL(t) {
	if (!e(t)) return;
	let n = {};
	return A(n, "die", iL(t.die)), A(n, "feet", aL(t.feet)), A(n, "inches", aL(t.inches)), Object.keys(n).length > 0 ? n : void 0;
}
function fL(t) {
	if (!e(t)) return;
	let n = iL(t.formula);
	return n ? { formula: n } : void 0;
}
//#endregion
//#region src/functions/species-builder/species-settings-normalization.ts
function pL(t) {
	return !e(t) || !Array.isArray(t.definitions) ? {
		autoRegisterSpeciesTable: !1,
		correctExistingWfrpSpecies: !1,
		definitions: [],
		runtimeSpeciesExtensions: [],
		showGeneratedConfigTab: !1
	} : {
		autoRegisterSpeciesTable: t.autoRegisterSpeciesTable === !0,
		correctExistingWfrpSpecies: t.correctExistingWfrpSpecies === !0,
		definitions: t.definitions.flatMap(hL),
		runtimeSpeciesExtensions: mL(t.runtimeSpeciesExtensions),
		showGeneratedConfigTab: t.showGeneratedConfigTab === !0
	};
}
function mL(t) {
	return Array.isArray(t) ? t.flatMap((t) => {
		if (!e(t)) return [];
		let n = iL(t.speciesKey), r = iL(t.speciesName), i = gL(t.subspecies) ?? [];
		return n && r && i.length > 0 ? [{
			speciesKey: n,
			speciesName: r,
			subspecies: i
		}] : [];
	}) : [];
}
function hL(e) {
	return vL(e, (e, t, n) => ({
		includeInExtraSpecies: n.includeInExtraSpecies === !0,
		key: e,
		name: t
	})).map((t) => (yL(t, e), bL(t, e), t));
}
function gL(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap(_L);
	return t.length > 0 ? t : void 0;
}
function _L(e) {
	return vL(e, (e, t, n) => {
		let r = {
			key: e,
			name: t
		};
		return A(r, "skillsAdded", oL(n.skillsAdded)), A(r, "skillsRemoved", oL(n.skillsRemoved)), A(r, "talentsAdded", oL(n.talentsAdded)), A(r, "talentsRemoved", oL(n.talentsRemoved)), A(r, "traitsAdded", oL(n.traitsAdded)), A(r, "traitsRemoved", oL(n.traitsRemoved)), r;
	});
}
function vL(t, n) {
	if (!e(t)) return [];
	let r = rL(t.key), i = iL(t.name);
	if (!r || !i) return [];
	let a = n(r, i, t);
	return A(a, "characteristics", uL(t.characteristics)), A(a, "randomTalents", cL(t.randomTalents)), A(a, "talentReplacementRows", qI(t.talentReplacementRows)), A(a, "talentReplacements", sL(t.talentReplacements)), A(a, "movement", aL(t.movement)), A(a, "fate", aL(t.fate)), A(a, "resilience", aL(t.resilience)), A(a, "extra", aL(t.extra)), A(a, "woundFormula", fL(t.woundFormula)), A(a, "careerTable", HI(t.careerTable)), [a];
}
function yL(t, n) {
	e(n) && (A(t, "skills", oL(n.skills)), A(t, "linkedSkills", $I(n.linkedSkills, "skill")), A(t, "talents", oL(n.talents)), A(t, "linkedTalents", eL(n.linkedTalents)), A(t, "traits", oL(n.traits)), A(t, "linkedTraits", $I(n.linkedTraits, "trait")));
}
function bL(t, n) {
	e(n) && (A(t, "age", iL(n.age)), A(t, "height", dL(n.height)), A(t, "careerReplacements", lL(n.careerReplacements)), A(t, "careerReplacementRows", JI(n.careerReplacementRows)), A(t, "subspecies", gL(n.subspecies)));
}
//#endregion
//#region src/module/apps/species-builder/settings.ts
var xL = OE({
	defaultValue: _e(),
	key: "speciesBuilderSettings",
	name: "Species Builder Settings",
	normalize: pL
});
function SL() {
	kE(xL);
}
//#endregion
//#region src/module/register-module-settings.ts
function CL() {
	NE(), SL(), nr();
}
//#endregion
//#region src/module/wfrp4e/item-effect-drops.ts
var wL = new Set(["talent", "trait"]), TL = /* @__PURE__ */ new WeakSet(), EL = !1, DL = "wfrp4e-customizer-grant-builder-button", OL = [
	"section[data-application-part=\"effects\"].active",
	"section[data-tab=\"effects\"].active",
	".tab[data-tab=\"effects\"].active",
	".tab.effects.active"
].join(","), kL = [
	"section[data-application-part=\"effects\"]",
	"section[data-tab=\"effects\"]",
	".tab[data-tab=\"effects\"]",
	".tab.effects"
].join(",");
function AL() {
	EL || (EL = !0, Hooks.on("renderApplicationV2", (e, t) => {
		if (!(t instanceof HTMLElement)) return;
		let n = PL(e);
		!n || !wL.has(n.type) || (jL(n, t), ML(n, t));
	}));
}
function jL(e, t) {
	TL.has(t) || (TL.add(t), t.addEventListener("dragover", (e) => {
		FL(t, e.target) && (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"));
	}, !0), t.addEventListener("drop", (n) => {
		NL(e, t, n);
	}, !0));
}
function ML(e, t) {
	if (t.querySelector(`.${DL}`)) return;
	let n = LL(t, { includeInactive: !0 });
	if (!n) return;
	let r = document.createElement("div");
	r.classList.add("wfrp4e-customizer-grant-builder-toolbar");
	let i = document.createElement("button");
	i.type = "button", i.classList.add(DL), i.title = "Open Effect Builders for this Item", i.innerHTML = "<i class=\"fa-solid fa-sitemap\" aria-hidden=\"true\"></i><span>Effect Builders</span>", i.addEventListener("click", () => {
		tP(e.uuid);
	}), r.append(i), n.prepend(r);
}
async function NL(e, t, n) {
	if (!FL(t, n.target)) return;
	let r = NM(n);
	if (r) {
		n.preventDefault(), n.stopPropagation();
		try {
			let t = await PM(r);
			if (t.uuid === e.uuid) throw Error("An Item cannot grant itself.");
			let n = FM(t), i = KM({
				effectName: `Grant ${t.name}`,
				flagScope: C,
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
function PL(e) {
	if (typeof e != "object" || !e) return null;
	let t = "item" in e ? e.item : void 0;
	if (en(t)) return t;
	let n = "document" in e ? e.document : void 0;
	return en(n) ? n : null;
}
function FL(e, t) {
	return !(t instanceof Element) || !e.contains(t) ? !1 : !!IL(e);
}
function IL(e) {
	return e.querySelector(OL) || LL(e, { includeInactive: !1 });
}
function LL(e, t) {
	return [...e.querySelectorAll(kL)].find((e) => t.includeInactive || e.offsetParent !== null) ?? null;
}
//#endregion
//#region src/module/api/create-module-api.ts
function RL() {
	return {
		clearDebugShapeProbes: EF,
		estimateNpcXp: pA,
		getDebugShapeProbes: DF,
		inspectPath: OF,
		listNpcAutoAdvanceStrategies: Wm,
		openActorPortraitGallery: Hk,
		async openDaisyExample() {
			await new IF().render(!0);
		},
		async openNpcBuilder() {
			await new fk().render(!0);
		},
		createBuiltEffect: GN,
		openEffectBuilders: tP,
		openWoundFormulaEffectBuilder: rP,
		openItemGrantEffectBuilder: iP,
		openRandomItemEffectBuilder: aP,
		openItemChoiceEffectBuilder: oP,
		openSpeciesTableEditor: zI,
		speciesTable: II,
		async openWorkbench() {
			await new BI().render(!0);
		},
		selectChargenSpecies: pr,
		registerNpcAutoAdvanceStrategy: Um,
		setDebugShapeProbes: AF
	};
}
//#endregion
//#region src/module/api/register-module-api.ts
function zL() {
	if (!game) throw Error("Foundry game global is unavailable during module API registration.");
	let e = game.modules.get(C);
	if (!e) throw Error(`Foundry module registry entry was not found for ${C}.`);
	e.api = RL();
}
//#endregion
//#region src/module/hooks/register-module-hooks.ts
function BL() {
	kF(), Hooks.once("init", () => {
		Fr(`${C} | Initializing`), CL(), game.system.id === "wfrp4e" && (Fj(), JP(), qP(), Pr(), Yk(), yA(), Ie() || (UA(), dr()), AL()), VI(), mk();
	}), Hooks.once("ready", () => {
		if (game.system.id !== "wfrp4e") {
			Ir(`${C} | Loaded outside ${w}; skipping module API registration.`);
			return;
		}
		return VL();
	});
}
async function VL() {
	await Promise.resolve();
	try {
		await Le(), await Ij([]);
	} catch (e) {
		let t = e instanceof Error ? e.message : "Unknown runtime adaptation error.";
		throw Ir(`${C} | Runtime species catalog could not be prepared: ${t}`), ui.notifications?.error(`Customizer initialization failed: ${t}`), e;
	}
	zL(), rr(), Qw(), gT(), Fr(`${C} | Ready`);
}
//#endregion
//#region src/main.ts
BL();
//#endregion

//# sourceMappingURL=wfrp4e-customizer-apps.mjs.map
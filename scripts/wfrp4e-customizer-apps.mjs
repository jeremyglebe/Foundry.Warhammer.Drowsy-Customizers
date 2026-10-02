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
//#region src/module/functions/compendiums/folders.ts
function a(e, t) {
	return t.filter((t) => t.folder?.id === e.id);
}
function o(e, t) {
	let n = new Set([e.id]);
	for (let r of a(e, t)) for (let e of o(r, t)) n.add(e);
	return n;
}
function s(e, t) {
	let n = new Set(e.packs.map((e) => `${t}.${e}`));
	for (let r of e.folders) for (let e of s(r, t)) n.add(e);
	return n;
}
function c(e, t, n, r) {
	let i = o(e, t), a = !1;
	for (let [e, t] of n) if (!(!t.folder || !i.has(t.folder.id))) {
		if (!r.has(e)) return !1;
		a = !0;
	}
	return a;
}
function l(e, t, n, r) {
	let i = o(t, n);
	for (let [t, n] of r) if (n.folder && i.has(n.folder.id) && !t.startsWith(`${e}.`)) return !0;
	return !1;
}
function u(e) {
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
async function d(t, n) {
	if (t.user.isGM !== !0 || t.user.isActiveGM !== !0) return;
	let r = t.modules.get(e);
	if (!r) throw Error(`Foundry module registry entry was not found for ${e}.`);
	let i = Array.from(r.packFolders ?? []);
	if (u(i), i.length === 0) return;
	for (let n of i) for (let r of s(n, e)) if (!t.packs.has(r)) throw Error(`Declared Compendium ${r} was not found.`);
	let a = Array.from(t.folders).filter((e) => e.type === "Compendium");
	async function d(r, i) {
		let u = s(r, e), f = a.filter((e) => e.name === r.name && (e.folder?.id ?? null) === (i?.id ?? null));
		if (f.length > 1) throw Error(`Ambiguous Compendium folder named ${r.name} under ${i?.name ?? "root"}.`);
		let p = f[0];
		if (p && l("wfrp4e-customizer-apps", p, a, t.packs)) throw Error(`Compendium folder ${r.name} contains another package's packs.`);
		if (!p) {
			let e = a.filter((e) => e.name === r.name && c(e, a, t.packs, u));
			if (e.length > 1) throw Error(`Ambiguous displaced Compendium folder named ${r.name}.`);
			if (p = e[0], p) {
				if (i && o(p, a).has(i.id)) throw Error(`Moving ${r.name} under ${i.name} would make a folder cycle.`);
				let e = i?.id ?? null;
				if (await p.update({ folder: e }) === void 0 && (p.folder?.id ?? null) !== e) throw Error(`Could not move Compendium folder ${r.name}; the update was not applied.`);
			} else {
				if (p = await n({
					name: r.name,
					type: "Compendium",
					folder: i?.id ?? null,
					sorting: r.sorting,
					...r.color ? { color: r.color } : {}
				}), !p) throw Error(`Could not create Compendium folder ${r.name}.`);
				a.push(p);
			}
		}
		let m = {};
		if (p.sorting !== r.sorting && (m.sorting = r.sorting), r.color !== void 0 && p.color !== r.color && (m.color = r.color), Object.keys(m).length > 0 && await p.update(m) === void 0 && (p.sorting !== r.sorting || r.color !== void 0 && p.color !== r.color)) throw Error(`Could not configure Compendium folder ${r.name}; the update was not applied.`);
		for (let n of r.packs) {
			let r = `${e}.${n}`, i = t.packs.get(r);
			if (!i) throw Error(`Declared Compendium ${r} was not found.`);
			i.folder?.id !== p.id && await i.setFolder(p);
		}
		for (let e of r.folders) await d(e, p);
	}
	for (let e of i) await d(e, null);
}
async function f() {
	if (!game.user?.isGM || game.users?.activeGM?.id !== game.user.id || game.settings.get("wfrp4e-customizer-apps", "keepCompendiumsTidy") !== !0) return;
	let e = game;
	await d({
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
function p(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function m(e, t) {
	let n = e;
	for (let e of t) {
		if (!p(n) || !(e in n)) return;
		n = n[e];
	}
	return n;
}
function h(e, t) {
	let n = m(e, t);
	return typeof n == "string" ? n.trim() : "";
}
function g(e, t) {
	let n = m(e, t);
	return Array.isArray(n) ? n.filter((e) => typeof e == "string") : [];
}
function _(e, t, n = 0) {
	return v(e, t) ?? n;
}
function v(e, t) {
	for (let n of t) {
		let t = Number(m(e, n));
		if (Number.isFinite(t)) return t;
	}
	return null;
}
function y(e, t, n = !1) {
	for (let n of t) {
		let t = m(e, n);
		if (typeof t == "boolean") return t;
	}
	return n;
}
function b(e) {
	return Array.isArray(e) ? e.flatMap(b) : typeof e == "string" ? e.split(/[\n\r,;]/).map((e) => e.trim()).filter(Boolean) : p(e) ? Object.values(e).flatMap(b) : [];
}
function x(e, t, n) {
	let r = e;
	for (let e of t.slice(0, -1)) {
		let t = r[e];
		p(t) || (r[e] = {}), r = r[e];
	}
	r[t[t.length - 1] ?? ""] = n;
}
//#endregion
//#region src/types/wfrp4e/characteristics.ts
var S = {
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
}, C = {
	[S.Agility]: "Agility",
	[S.BallisticSkill]: "Ballistic Skill",
	[S.Dexterity]: "Dexterity",
	[S.Fellowship]: "Fellowship",
	[S.Initiative]: "Initiative",
	[S.Intelligence]: "Intelligence",
	[S.Strength]: "Strength",
	[S.Toughness]: "Toughness",
	[S.WeaponSkill]: "Weapon Skill",
	[S.Willpower]: "Willpower"
}, w = {
	agility: S.Agility,
	"ballistic skill": S.BallisticSkill,
	dexterity: S.Dexterity,
	fellowship: S.Fellowship,
	initiative: S.Initiative,
	intelligence: S.Intelligence,
	strength: S.Strength,
	toughness: S.Toughness,
	"weapon skill": S.WeaponSkill,
	willpower: S.Willpower
};
function ee(e) {
	return e in C;
}
//#endregion
//#region src/module/functions/species-builder/item-reference-names.ts
function te(e) {
	return re(e.name, e.specification);
}
function ne(e) {
	let t = e.name.trim();
	if (!e.item) return t;
	if (!t) return te(e.item);
	if (!ie(t)) {
		if (e.item.specification) return re(t, e.item.specification);
		if (ie(e.item.name) && E(t) === E(e.item.name)) return e.item.name.trim();
	}
	return t;
}
function re(e, t) {
	let n = e.trim(), r = t?.trim();
	return !n || !r || T(n) ? n : `${n} (${r})`;
}
function T(e) {
	return /\(([^()]*)\)\s*$/.exec(e.trim())?.[1]?.trim() ?? "";
}
function ie(e) {
	return /\([^()]*\)\s*$/.test(e.trim());
}
function E(e) {
	return e.split("(")[0]?.trim().toLocaleLowerCase() ?? "";
}
//#endregion
//#region src/module/functions/species-builder/items/choices.ts
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
						name: ne(e),
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
function D(e) {
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
//#region src/module/functions/species-builder/items/system.ts
function O() {
	return {
		uuid: "",
		id: "",
		name: ""
	};
}
function oe() {
	return {
		description: { value: "" },
		gmdescription: { value: "" },
		characteristics: Object.fromEntries(Object.values(S).map((e) => [e, {
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
		subspeciesOf: O(),
		keys: [],
		tables: {
			talents: O(),
			eye: O(),
			hair: O(),
			career: O()
		}
	};
}
function se(e) {
	let t = {};
	for (let n of Object.values(S)) {
		let r = e.characteristics[n];
		r && r.base !== null && r.dice !== null && (t[n] = r.dice === 0 ? String(r.base) : `${r.dice}d10+${r.base}`);
	}
	return Object.keys(t).length ? t : void 0;
}
//#endregion
//#region src/module/wfrp/species-builder/items/effect-sources.ts
function ce(e) {
	if (e === void 0) return [];
	if (!Array.isArray(e)) throw Error("Species effects must be embedded Active Effects.");
	return e.map((e) => {
		if (!p(e) || typeof e._id != "string") throw Error("Species effects must have Foundry document IDs.");
		return {
			...structuredClone(e),
			_id: e._id
		};
	});
}
//#endregion
//#region src/module/wfrp/species-builder/items/adapter.ts
var le = `${e}.species`;
function ue(e) {
	return e.type === le || e.type === "species";
}
function de(e) {
	let t = e.toObject();
	return {
		id: e.id,
		uuid: e.uuid,
		name: e.name,
		img: e.img || "icons/svg/mystery-man.svg",
		system: fe(t.system),
		effects: ce(t.effects)
	};
}
function fe(e) {
	if (!p(e)) throw Error("Species Item system data is missing.");
	let t = oe(), n = ye(e.characteristics), r = ye(e.talents), i = ye(r.choices), a = ye(e.tables);
	return {
		description: { value: ge(ye(e.description).value) },
		gmdescription: { value: ge(ye(e.gmdescription).value) },
		characteristics: Object.fromEntries(Object.values(S).map((e) => {
			let t = ye(n[e]);
			return [e, {
				base: he(t.base),
				dice: he(t.dice)
			}];
		})),
		extra: he(e.extra),
		fate: he(e.fate),
		movement: he(e.movement),
		resilience: he(e.resilience),
		keys: ve(e.keys),
		size: ge(e.size) || "avg",
		skills: { list: ve(ye(e.skills).list) },
		talents: {
			random: he(r.random),
			choices: {
				structure: i.structure === void 0 ? t.talents.choices.structure : pe(i.structure),
				options: _e(i.options).map((e) => {
					let t = ye(e);
					return {
						type: ge(t.type),
						id: ge(t.id),
						name: ge(t.name),
						documentId: ge(t.documentId),
						idType: ge(t.idType),
						diff: ye(t.diff),
						filters: _e(t.filters).map((e) => {
							let t = ye(e);
							return {
								path: ge(t.path),
								operation: ge(t.operation),
								value: ge(t.value)
							};
						})
					};
				}),
				script: ge(i.script)
			}
		},
		subspeciesOf: me(e.subspeciesOf),
		tables: {
			talents: me(a.talents),
			eye: me(a.eye),
			hair: me(a.hair),
			career: me(a.career)
		}
	};
}
function pe(e) {
	let t = ye(e), n = t.type;
	if (n !== "and" && n !== "or" && n !== "option") throw Error("Species Talent choice structure is invalid.");
	return {
		type: n,
		id: ge(t.id),
		...n === "option" ? {} : { options: _e(t.options).map(pe) }
	};
}
function me(e) {
	let t = ye(e);
	return {
		uuid: ge(t.uuid),
		id: ge(t.id),
		name: ge(t.name)
	};
}
function he(e) {
	if (e == null) return null;
	if (typeof e != "number" || !Number.isFinite(e) || e < 0) throw Error("Species statistics must be non-negative numbers or empty inheritance values.");
	return e;
}
function ge(e) {
	return typeof e == "string" ? e : "";
}
function _e(e) {
	return Array.isArray(e) ? e : [];
}
function ve(e) {
	return _e(e).map((e) => {
		if (typeof e != "string") throw Error("Species keys and skills must contain text values.");
		return e;
	});
}
function ye(e) {
	return p(e) ? e : {};
}
//#endregion
//#region src/module/functions/shared/assign-if-present.ts
function k(e, t, n) {
	n !== void 0 && (e[t] = n);
}
//#endregion
//#region src/module/functions/species-builder/items/effect-carriers.ts
function be(e) {
	return `__Species Effects ${e.id}__`;
}
//#endregion
//#region src/module/functions/species-builder/items/identity.ts
function xe(e) {
	return e.system.keys[0] || `species${e.id.toLowerCase()}`;
}
function Se(e) {
	return !!(e.system.subspeciesOf.uuid || e.system.subspeciesOf.id);
}
//#endregion
//#region src/module/functions/species-builder/items/definitions.ts
function Ce(e, t = {}) {
	let { system: n } = e, r = D(n.talents.choices), i = {
		key: xe(e),
		name: e.name,
		includeInExtraSpecies: !0,
		skills: n.skills.list,
		talents: r.map((e) => e.choices.map((e) => e.name).join(", "))
	};
	e.effects.length && (i.traits = [be(e)]), k(i, "characteristics", se(n)), k(i, "careerTable", t.careerTable);
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
function we(e, t, n) {
	let r = Te(e.system, t.system), i = Ce({
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
	]) k(a, e, i[e]);
	let o = Ce(t), s = e.effects.length ? i.traits : o.traits;
	return Object.assign(a, Ee("skills", o.skills ?? [], i.skills ?? [])), Object.assign(a, Ee("talents", o.talents ?? [], i.talents ?? [])), Object.assign(a, Ee("traits", o.traits ?? [], s ?? [])), a;
}
function Te(e, t) {
	D(e.talents.choices);
	let n = structuredClone(e);
	for (let r of Object.values(S)) n.characteristics[r] = {
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
function Ee(e, t, n) {
	return {
		[`${e}Added`]: n.filter((e) => !t.includes(e)),
		[`${e}Removed`]: t.filter((e) => !n.includes(e))
	};
}
//#endregion
//#region src/module/functions/species-builder/items/catalog.ts
function De(e, t = /* @__PURE__ */ new Map()) {
	let n = new Map(e.filter((e) => !Se(e)).map((e) => [e.uuid, Ce(e, t.get(e.uuid))]));
	for (let r of e.filter(Se)) {
		let i = r.system.subspeciesOf, a = e.find((e) => i.uuid ? e.uuid === i.uuid : e.id === i.id);
		if (!a) throw Error(`${r.name}: parent Species Item is missing from the world. Import its parent before loading species.`);
		if (Se(a)) throw Error(`${r.name}: nested or cyclic subspecies cannot be represented by WFRP's current config.`);
		let o = n.get(a.uuid), s = {
			...t.get(a.uuid),
			...t.get(r.uuid)
		};
		(o.subspecies ??= []).push(we(r, a, s));
	}
	return {
		definitions: [...n.values()],
		runtimeSpeciesExtensions: []
	};
}
//#endregion
//#region src/module/functions/species-builder/default-species-builder-settings.ts
function Oe() {
	return {
		autoRegisterSpeciesTable: !1,
		correctExistingWfrpSpecies: !1,
		definitions: [],
		runtimeSpeciesExtensions: [],
		showGeneratedConfigTab: !1
	};
}
//#endregion
//#region src/module/wfrp/species-builder/runtime-species/career-table.ts
function ke(e, t, n) {
	let r = je(e, t, typeof n == "string" ? n.trim() : "");
	for (let e of r) {
		let t = game.wfrp4e?.tables?.findTable?.("career", e);
		if (!t) continue;
		let n = Me(t, e);
		if (n) return Ae(n);
	}
}
function Ae(e) {
	if (!p(e)) return;
	let t = ze(e.results).flatMap((e) => {
		let t = Pe(e);
		return t ? [t] : [];
	}), n = e.formula;
	return t.length > 0 ? {
		rows: t,
		...typeof n == "string" ? { sourceFormula: n } : {}
	} : void 0;
}
function je(e, t, n) {
	let r = t ? [
		n,
		`${e}-${t}`,
		e
	] : [e];
	return e === "human" && r.push("human-reiklander"), [...new Set(r.filter(Boolean))];
}
function Me(e, t) {
	return !p(e) || !Array.isArray(e.columns) ? e : e.columns.find((e) => Ne(e) === t);
}
function Ne(e) {
	if (!p(e) || typeof e.getFlag != "function") return "";
	let t = e.getFlag.call(e, "wfrp4e", "column");
	return typeof t == "string" ? t : "";
}
function Pe(e) {
	if (!p(e)) return;
	let t = Le(e), n = /@UUID\[([^\]]+)\]\{([^}]+)\}/u.exec(t), r = Re(n?.[2] ?? ""), i = Re(t) || Re(e.name), a = r || i;
	if (!a) return;
	let o = n?.[1]?.trim(), s = Fe(e.range), c = Ie(e.weight), l = { name: a };
	return o && (l.journalUuid = o), s && (l.sourceRange = s), c !== void 0 && (l.sourceWeight = c), l;
}
function Fe(e) {
	if (!Array.isArray(e) || e.length < 2) return;
	let t = Number(e[0]), n = Number(e[1]);
	return Number.isFinite(t) && Number.isFinite(n) ? [t, n] : void 0;
}
function Ie(e) {
	let t = Number(e);
	return Number.isFinite(t) && t > 0 ? t : void 0;
}
function Le(e) {
	if (e.type === "document") {
		let t = e.documentUuid, n = e.name;
		return typeof t == "string" && typeof n == "string" ? `@UUID[${t}]{${n}}` : "";
	}
	let t = e.description ?? e.text;
	return typeof t == "string" ? t : "";
}
function Re(e) {
	return typeof e == "string" ? e.replace(/@UUID\[[^\]]+\]\{([^}]+)\}/gu, "$1").replace(/<[^>]*>/gu, "").trim() : "";
}
function ze(e) {
	return Array.isArray(e) ? e : typeof e == "object" && e && Symbol.iterator in e ? [...e] : [];
}
//#endregion
//#region src/module/wfrp/species-builder/items/imported-references.ts
function Be(e, t) {
	let n = t.find((t) => e.uuid ? t.uuid === e.uuid : t.id === e.id);
	if (n || !e.uuid.startsWith("Compendium.")) return n;
	let r = t.filter((t) => {
		let n = t.toObject();
		return [h(n, ["_stats", "compendiumSource"]), h(n, [
			"flags",
			"core",
			"sourceId"
		])].includes(e.uuid);
	});
	if (r.length > 1) throw Error(`Multiple imported copies of ${e.name || e.uuid}; relink the reference to the intended world document.`);
	return r[0];
}
//#endregion
//#region src/module/wfrp/species-builder/items/table-references.ts
async function Ve(e) {
	let t = {}, n = He(e.system.tables.talents);
	if (n) {
		let r = n.getFlag("wfrp4e", "key");
		if (typeof r != "string" || !r.trim()) throw Error(`${e.name}: the random Talent table needs a WFRP table key.`);
		t.randomTalentKey = r;
	}
	let r = e.system.tables.career, i = r.uuid.startsWith("Compendium.") ? Be(r, game.tables?.contents ?? []) ?? await fromUuid(r.uuid) : He(r);
	if (r.uuid.startsWith("Compendium.") && (!p(i) || i.documentName !== "RollTable")) throw Error(`${e.name}: the referenced Career RollTable could not be resolved.`);
	if (i) {
		let n = Ae(i);
		if (!n) throw Error(`${e.name}: the referenced Career table has no usable rows.`);
		t.careerTable = n;
	}
	return t;
}
function He(e) {
	if (!e.uuid && !e.id) return;
	let t = Be(e, game.tables?.contents ?? []);
	if (!t) throw Error(`Import the referenced RollTable ${e.name || e.uuid || e.id} into the world and relink it.`);
	return t;
}
//#endregion
//#region src/module/wfrp/species-builder/items/repository.ts
function Ue() {
	return (game.items?.contents ?? []).filter(ue);
}
async function We() {
	let e = Ue(), t = e.map(de);
	for (let n of t) {
		let t = n.system.subspeciesOf;
		if (!t.uuid && !t.id) continue;
		let r = Be(t, e);
		r && (n.system.subspeciesOf = {
			uuid: r.uuid,
			id: r.id,
			name: r.name
		});
	}
	let n = new Map(await Promise.all(t.map(async (e) => [e.uuid, await Ve(e)])));
	return {
		...Oe(),
		...De(t, n)
	};
}
async function Ge(e, t) {
	Ke();
	let n = e.toObject(), r = p(n.system) ? n.system : {};
	return await e.update({
		name: t.name,
		img: t.img,
		system: {
			...r,
			...fe(t.system)
		}
	}, { recursive: !1 }), e;
}
function Ke() {
	if (!game.user?.isGM) throw Error("Only a GM can change world Species Items through the Customizer.");
}
//#endregion
//#region src/module/wfrp/species-builder/items/migration.ts
function qe() {
	return typeof CONFIG.Item.dataModels.species == "function";
}
async function Je() {
	if (!qe() || !game.user?.isGM || game.users?.activeGM && game.users.activeGM.id !== game.user.id) return 0;
	let e = 0, t = game.actors.contents.flatMap((e) => e.items?.contents ?? []), n = [...Ue(), ...t];
	for (let t of n.filter((e) => e.type === le)) await t.update({ type: "species" }), e += 1;
	return e;
}
//#endregion
//#region src/module/functions/species-builder/replacement-row-records.ts
function Ye(e) {
	if (!e) return;
	let t = e.flatMap((e) => {
		let t = ne(e.rolled), n = ne(e.replacement);
		return t && n ? [[t, n]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : void 0;
}
function Xe(e) {
	if (!e) return;
	let t = e.flatMap((e) => {
		let t = ne(e.rolled), n = e.replacements.map(ne).filter((e) => e.length > 0);
		return t && n.length > 0 ? [[t, n]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : void 0;
}
//#endregion
//#region src/module/functions/species-builder/linked-grant-records.ts
function Ze(e) {
	if (!e || e.length === 0) return;
	let t = e.map(ne).filter((e) => e.length > 0);
	return t.length > 0 ? t : void 0;
}
function Qe(e) {
	if (!e || e.length === 0) return;
	let t = e.flatMap((e) => {
		let t = e.choices.map(ne).filter((e) => e.length > 0);
		return t.length > 0 ? [t.join(", ")] : [];
	});
	return t.length > 0 ? t : void 0;
}
//#endregion
//#region src/module/functions/species-builder/subspecies-list-fields.ts
function $e(e) {
	return Ze(e.linkedSkills) ?? e.skills;
}
function et(e, t) {
	return ot($e(e), t.skillsAdded, t.skillsRemoved);
}
function tt(e) {
	return Qe(e.linkedTalents) ?? e.talents;
}
function nt(e, t) {
	return ot(tt(e), t.talentsAdded, t.talentsRemoved);
}
function rt(e, t) {
	return at(Ze(e.linkedTraits) ?? e.traits, t);
}
function it(e, t, n = {}) {
	let r = n.subspecies ?? n.parent, i = ot(rt(e), t.traitsAdded, t.traitsRemoved);
	return i ? at(i, r) : n.subspecies ? at(rt(e), n.subspecies) : void 0;
}
function at(e, t) {
	if (!t) return e;
	let n = e ? [...e] : [];
	return n.includes(t) || n.push(t), n;
}
function ot(e, t, n) {
	if (!t && !n) return;
	let r = new Set(n ?? []), i = (e ?? []).filter((e) => !r.has(e));
	for (let e of t ?? []) i.includes(e) || i.push(e);
	return i;
}
//#endregion
//#region src/module/functions/species-builder/definition-plans.ts
function st(e, t = []) {
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
//#region src/module/functions/species-builder/wound-formula/compiler.ts
function ct(e) {
	let t = [], n = /* @__PURE__ */ new Set(), r = e.trim();
	return r = r.replaceAll(/@([A-Za-z][\dA-Za-z]*)/g, (e, t) => {
		let r = lt(t);
		return n.add(r), r;
	}), r = r.replaceAll(/{([^{}]+)}/g, (e, n) => ut(t, n, "total")), r = r.replaceAll(/\[([^[\]]+)]/g, (e, n) => ut(t, n, "bonus")), {
		expression: r,
		references: t,
		usedKeywords: n
	};
}
function lt(e) {
	if ((/* @__PURE__ */ "ablaze.advantage.age.bleeding.blinded.broken.corruption.deafened.entangled.fate.fatigued.fortune.height.poisoned.rank.resilience.resolve.sb.sbMultiplier.scale.sin.size.status.stunned.tb.tbMultiplier.weight.wpb.wpbMultiplier.xp".split(".")).includes(e)) return e;
	throw Error(`Unknown wound formula keyword: @${e}`);
}
function ut(e, t, n) {
	let r = dt(t, n, e), i = e.find((e) => ft(e, r));
	return i ? i.variableName : (e.push(r), r.variableName);
}
function dt(e, t, n) {
	let [r, i] = pt(e), a = mt(r), o = vt(_t(r, i, t), n);
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
	return i && (s.characteristicOverride = ht(i)), s;
}
function ft(e, t) {
	return e.characteristicKey === t.characteristicKey && e.characteristicOverride === t.characteristicOverride && e.kind === t.kind && e.name === t.name && e.source === t.source;
}
function pt(e) {
	let t = e.split("|").map((e) => e.trim());
	if (t.length > 2 || !t[0]) throw Error(`Invalid wound formula attribute reference: ${e}`);
	return [t[0], t[1]];
}
function mt(e) {
	let t = e.trim().toLocaleLowerCase();
	return ee(t) ? t : w[t] ?? gt[t];
}
function ht(e) {
	let t = mt(e);
	if (!t) throw Error(`Unknown wound formula characteristic: ${e}`);
	return t;
}
var gt = {
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
function _t(e, t, n) {
	let [r, ...i] = [e, t].flatMap((e) => e ? e.match(/\d+|[A-Za-z]+/g) ?? [] : []), a = r ? [r.toLocaleLowerCase(), ...i.map((e) => e.charAt(0).toLocaleUpperCase() + e.slice(1))].join("") : "attribute";
	return n === "bonus" ? `${a}Bonus` : a;
}
function vt(e, t) {
	let n = new Set(t.map((e) => e.variableName));
	if (!n.has(e)) return e;
	let r = 2, i = `${e}${r}`;
	for (; n.has(i);) r += 1, i = `${e}${r}`;
	return i;
}
//#endregion
//#region src/module/functions/species-builder/wound-formula/script-lines.ts
function yt(e) {
	let t = [];
	if (St(e, [
		"sb",
		"tb",
		"wpb"
	]) && (t.push(...Ct(e, "sb", "preWoundArgs.sb")), t.push(...Ct(e, "tb", "preWoundArgs.tb")), t.push(...Ct(e, "wpb", "preWoundArgs.wpb"))), St(e, [
		"sbMultiplier",
		"tbMultiplier",
		"wpbMultiplier"
	]) && (t.push("const multiplier = preWoundArgs.multiplier;"), t.push(...Ct(e, "sbMultiplier", "multiplier.sb")), t.push(...Ct(e, "tbMultiplier", "multiplier.tb")), t.push(...Ct(e, "wpbMultiplier", "multiplier.wpb"))), St(e, ["scale", "size"]) && (t.push(...wt()), t.push("const size = actorSizeStep();"), t.push(...Ct(e, "scale", "2 ** size"))), St(e, kt) && (t.push(...Ct(e, "age", "Number(actor.system.details.age.value)")), t.push(...Ct(e, "height", "Number(actor.system.details.height.value)")), t.push(...Ct(e, "weight", "Number(actor.system.details.weight.value)")), t.push(...Mt(e))), St(e, At) && (t.push(...Ct(e, "xp", "actor.system.details.experience.total")), t.push(...Ct(e, "fate", "actor.system.status.fate.value")), t.push(...Ct(e, "fortune", "actor.system.status.fortune.value")), t.push(...Ct(e, "resilience", "actor.system.status.resilience.value")), t.push(...Ct(e, "resolve", "actor.system.status.resolve.value")), t.push(...Ct(e, "corruption", "actor.system.status.corruption.value")), t.push(...Ct(e, "sin", "actor.system.status.sin.value")), t.push(...Ct(e, "advantage", "actor.system.status.advantage.value"))), St(e, jt)) {
		t.push(...Nt());
		for (let n of jt) t.push(...Ct(e, n, `conditionValue("${n}")`));
	}
	return t.length ? [...t, ""] : [];
}
function bt(e) {
	let t = e.length > 0, n = e.some((e) => e.source === "skill");
	return [...Tt(t), ...Et(n)];
}
function xt(e) {
	return e.map((e) => e.source === "characteristic" ? Dt(e) : Ot(e));
}
function St(e, t) {
	return t.some((t) => e.has(t));
}
function Ct(e, t, n) {
	return e.has(t) ? [`const ${t} = ${n};`] : [];
}
function wt() {
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
function Tt(e) {
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
function Et(e) {
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
function Dt(e) {
	let t = e.kind === "bonus" ? "characteristicBonus" : "characteristicTotal";
	return `const ${e.variableName} = ${t}(${JSON.stringify(e.characteristicKey)});`;
}
function Ot(e) {
	let t = e.kind === "bonus" ? "skillBonus" : "skillTotal", n = e.characteristicOverride ? JSON.stringify(e.characteristicOverride) : "undefined";
	return `const ${e.variableName} = ${t}(${JSON.stringify(e.name)}, ${n});`;
}
var kt = [
	"age",
	"height",
	"rank",
	"status",
	"weight"
], At = [
	"advantage",
	"corruption",
	"fate",
	"fortune",
	"resilience",
	"resolve",
	"sin",
	"xp"
], jt = [
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
function Mt(e) {
	let t = [];
	return e.has("status") && t.push("function statusTierValue() {", "  const statusTiers = { brass: 1, silver: 2, gold: 3 };", "  const tier = actor.system.details.status.tier;", "  return statusTiers[String(tier).toLocaleLowerCase()] || Number(tier);", "}", "const status = statusTierValue();"), t.push(...Ct(e, "rank", "Number(actor.system.details.status.standing)")), t;
}
function Nt() {
	return [
		"function conditionValue(key) {",
		"  return actor.hasCondition(key)?.conditionValue || 0;",
		"}"
	];
}
//#endregion
//#region src/module/functions/species-builder/wound-formula/index.ts
function Pt(e) {
	let t = ct(e);
	return [
		...yt(t.usedKeywords),
		...bt(t.references),
		...xt(t.references),
		"",
		`args.wounds = ${t.expression};`
	];
}
//#endregion
//#region src/module/apps/effect-builders/functions/wounds.ts
var Ft = ["const storageKey = \"__wfrp4eCustomizerWoundFormulaArgs\";", "const sourceId = this.effect.id;"];
function It(e, t) {
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
					...Ft,
					"this.actor[storageKey] ||= {};",
					"this.actor[storageKey][sourceId] = args;"
				].join("\n")
			}, {
				label: e,
				trigger: "woundCalc",
				script: [
					...Ft,
					"const preWoundArgs = this.actor[storageKey][sourceId];",
					"const actor = this.actor;",
					...Pt(t)
				].join("\n")
			}]
		}
	};
}
//#endregion
//#region src/module/functions/species-builder/wound-formula-traits.ts
function Lt(e) {
	return `__${e.name.trim()}__`;
}
function Rt(e, t) {
	return `__${e.name.trim()} / ${t.name.trim()}__`;
}
//#endregion
//#region src/module/functions/species-builder/species-config.ts
function zt(e, t = []) {
	let n = Bt();
	for (let r of st(e, t)) r.emitBaseDefinition && Vt(n, r.definition), Ht(n, r.definition, r.subspecies);
	return n;
}
function Bt() {
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
function Vt(e, t) {
	e.species[t.key] = t.name, k(e.speciesCharacteristics, t.key, t.characteristics), e.speciesSkills[t.key] = $e(t) ?? [], e.speciesTalents[t.key] = tt(t) ?? [], k(e.speciesRandomTalents, t.key, t.randomTalents), k(e.speciesTalentReplacement, t.key, Gt(t)), k(e.speciesTraits, t.key, rt(t, t.woundFormula ? Lt(t) : void 0)), k(e.speciesMovement, t.key, t.movement), k(e.speciesFate, t.key, t.fate), k(e.speciesRes, t.key, t.resilience), k(e.speciesExtra, t.key, t.extra), k(e.speciesAge, t.key, t.age), k(e.speciesHeight, t.key, t.height), k(e.speciesCareerReplacements, t.key, Kt(t)), t.includeInExtraSpecies && e.extraSpecies.push(t.key);
}
function Ht(e, t, n) {
	for (let r of n) {
		let n = e.subspecies[t.key] ?? {}, i = r.woundFormula ? Rt(t, r) : void 0, a = r.careerTable ? Wt(t, r) : void 0;
		n[r.key] = Ut(t, r, i, a), e.subspecies[t.key] = n;
	}
}
function Ut(e, t, n, r) {
	let i = { name: t.name };
	return k(i, "characteristics", t.characteristics ? {
		...e.characteristics,
		...t.characteristics
	} : void 0), k(i, "skills", et(e, t)), k(i, "talents", nt(e, t)), k(i, "speciesTraits", it(e, t, {
		...e.woundFormula ? { parent: Lt(e) } : {},
		...n ? { subspecies: n } : {}
	})), k(i, "randomTalents", t.randomTalents), k(i, "talentReplacement", Gt(t)), k(i, "movement", t.movement), k(i, "fate", t.fate), k(i, "resilience", t.resilience), k(i, "extra", t.extra), k(i, "careerTable", r), i;
}
function Wt(e, t) {
	return `${e.key}-${t.key}`;
}
function Gt(e) {
	return Ye(e.talentReplacementRows) ?? e.talentReplacements;
}
function Kt(e) {
	return Xe(e.careerReplacementRows) ?? e.careerReplacements;
}
//#endregion
//#region src/module/wfrp/species-chargen/tables.ts
var qt = /* @__PURE__ */ new Map(), Jt = !1;
function Yt(e, t) {
	return `${e.toLowerCase()}|${t ?? ""}`;
}
function Xt() {
	if (Jt) return;
	let e = game.wfrp4e?.tables;
	if (!e?.findTable) throw Error("WFRP table lookup is unavailable.");
	let t = e.findTable;
	e.findTable = function(e, n) {
		return qt.get(Yt(e, n)) ?? t.call(this, e, n);
	}, Jt = !0;
}
async function Zt(e) {
	if (!e.uuid && !e.id) return;
	let t = Be(e, game.tables?.contents ?? []) ?? await fromUuid(e.uuid || `RollTable.${e.id}`);
	if (!p(t) || t.documentName !== "RollTable") throw Error(`Cannot resolve Species RollTable ${e.name || e.uuid || e.id}.`);
	return t;
}
function Qt(e, t, n, r, i) {
	Xt(), $t(e), r && qt.set(Yt("eyes", e), r), i && qt.set(Yt("hair", e), i), t && qt.set(Yt("career", e), t), n && qt.set(Yt(`${e}-talents`), n);
}
function $t(e) {
	qt.delete(Yt("eyes", e)), qt.delete(Yt("hair", e)), qt.delete(Yt("career", e)), qt.delete(Yt(`${e}-talents`));
}
//#endregion
//#region src/module/wfrp/species-chargen/config.ts
var en = 0, tn = "customizer-chargen-";
function nn() {
	return `${tn}${++en}`;
}
async function rn(e, t) {
	let n = game.wfrp4e?.config;
	if (!n) throw Error("WFRP species config is unavailable.");
	let { record: r } = t, [i, a, o, s] = await Promise.all([
		Zt(r.system.tables.career),
		Zt(r.system.tables.talents),
		Zt(r.system.tables.eye),
		Zt(r.system.tables.hair)
	]), c = Ce({
		...r,
		effects: []
	}, { ...a ? { randomTalentKey: `${e}-talents` } : {} });
	c.key = e, c.includeInExtraSpecies = !1;
	let l = Oe();
	l.definitions = [c];
	let u = zt(l);
	an(e);
	for (let [t, r] of Object.entries(u)) if (p(r) && Object.hasOwn(r, e)) {
		let i = p(n[t]) ? n[t] : n[t] = {};
		i[e] = r[e];
	}
	Qt(e, i, a, o, s);
}
function an(e) {
	let t = game.wfrp4e?.config;
	for (let [n, r] of Object.entries(t ?? {})) (n.startsWith("species") || n === "subspecies") && p(r) && delete r[e];
	$t(e);
}
//#endregion
//#region src/module/functions/species-chargen/selection.ts
function on(e, t) {
	let n = structuredClone(e);
	if (!t) return n;
	n.system = Te(e.system, t.system);
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
function sn(e) {
	if (typeof e.documentUuid == "string" && e.documentUuid) return e.documentUuid;
	let t = typeof e.description == "string" ? e.description : "";
	return /@UUID\[([^\]]+)\]/u.exec(t)?.[1];
}
function cn(e) {
	return e.startsWith("Item.") || e.startsWith("Compendium.") && e.includes(".Item.");
}
//#endregion
//#region src/module/functions/species-chargen/roll-bonus.ts
function ln(e, t) {
	return [...new Set([
		e,
		h(t, ["_stats", "compendiumSource"]),
		h(t, [
			"flags",
			"core",
			"sourceId"
		])
	].filter(cn))];
}
function un(e, t) {
	if (!e) return 0;
	let n = e.identity?.self ?? ln(e.uuid, e.source), r = e.identity?.parent ?? [e.record.system.subspeciesOf.uuid];
	return [...n, ...r].some((e) => e && t.includes(e)) ? 20 : 0;
}
//#endregion
//#region src/module/foundry/document-guards.ts
function dn(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Actor";
}
function fn(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Item";
}
function pn(e, t = "Expected a Foundry Actor.") {
	if (!dn(e)) throw Error(t);
	return e;
}
function mn(e, t = "Expected a Foundry Item.") {
	if (!fn(e)) throw Error(t);
	return e;
}
function hn(e, t, n = `Expected a Foundry ${t} Item.`) {
	let r = mn(e, n);
	if (r.type !== t) throw Error(n);
	return r;
}
//#endregion
//#region src/module/wfrp/species-table/items.ts
function gn() {
	if (!game.user?.isGM) throw Error("Only a GM can edit the world's Species table.");
}
function _n() {
	let e = game.wfrp4e?.config?.species, t = [];
	if (p(e)) for (let [n, r] of Object.entries(e)) !n.startsWith("customizer-chargen-") && typeof r == "string" && r.trim() && t.push({
		key: n,
		label: r
	});
	for (let e of Ue()) t.push({
		key: `item:${e.uuid}`,
		label: e.name,
		itemUuid: e.uuid
	});
	return t.sort((e, t) => e.label.localeCompare(t.label));
}
async function vn(e) {
	let t = Ue(), n = Be(e, t), r = mn(n ?? await fromUuid(e.uuid || `Item.${e.id}`), `Species Item “${e.name || e.uuid || e.id}” is unavailable.`), i = n ?? Be({
		uuid: r.uuid,
		id: r.id,
		name: r.name
	}, t) ?? r;
	if (!ue(i)) throw Error("Drop a Species Item into this editor.");
	if (game.user && !game.user.isGM && !i.testUserPermission(game.user, "OBSERVER")) throw Error(`You do not have permission to read ${i.name}.`);
	if (!i.compendium && !Ue().some((e) => e.uuid === i.uuid)) throw Error("Use a world or compendium Species Item, rather than an Item on an Actor.");
	return i;
}
async function yn(e) {
	return vn({
		uuid: e,
		id: "",
		name: ""
	});
}
async function bn(e) {
	let t = await yn(e), n = de(t);
	if (!Se(n)) return [t];
	let r = await vn(n.system.subspeciesOf);
	if (Se(de(r))) throw Error(`${t.name}: nested or cyclic subspecies cannot be used by WFRP's current Species table.`);
	return [r, t];
}
async function xn(e) {
	gn();
	let t = JSON.parse(e);
	if (!p(t) || typeof t.uuid != "string") throw Error("Drop a Species Item or enter its UUID.");
	let n = await bn(t.uuid), r = n[n.length - 1];
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
//#region src/module/wfrp/species-builder/items/actor-source.ts
function Sn(e, t) {
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
async function Cn(e) {
	let t = await bn(e), n = t[t.length - 1], r = t.length > 1 ? de(t[0]) : void 0, i = on(de(n), r), a = Sn(n, i);
	return {
		uuid: n.uuid,
		record: i,
		source: a,
		identity: {
			self: [...new Set([e, ...ln(n.uuid, n.toObject())])],
			parent: t.length > 1 ? ln(t[0].uuid, t[0].toObject()) : []
		}
	};
}
//#endregion
//#region src/module/wfrp/species-chargen/session.ts
var wn = class {
	app;
	key = nn();
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
		let t = await Cn(e);
		if (!this.closed) {
			if (await rn(this.key, t), this.closed) {
				an(this.key);
				return;
			}
			this.selection = t;
		}
	}
	useLegacy() {
		this.assertUnlocked(), this.selection = void 0, an(this.key);
	}
	commit() {
		let e = this.app.data;
		this.selection ? (e.customizerSpecies = {
			...e.customizerSpecies,
			selection: this.selection
		}, e.items.species = [new Item(structuredClone(this.selection.source))], e.misc["system.details.species.value"] = this.selection.record.name, e.misc["system.details.species.subspecies"] = "") : (delete e.customizerSpecies?.selection, delete e.items.species, delete e.misc["system.details.species.value"], delete e.misc["system.details.species.subspecies"]);
	}
	dispose() {
		this.closed = !0, an(this.key);
	}
	async restore() {
		let e = this.app.data.customizerSpecies?.selection;
		if (e === void 0) return;
		if (!p(e) || typeof e.uuid != "string" || !p(e.source)) throw Error("The saved Species selection is invalid. Start a new character.");
		let t = e.source;
		if (t.type !== le && t.type !== "species") throw Error("The saved chargen Item is not a Species Item.");
		let n = {
			uuid: e.uuid,
			source: t,
			...p(e.identity) ? { identity: {
				self: g(e.identity, ["self"]),
				parent: g(e.identity, ["parent"])
			} } : {},
			record: {
				id: e.uuid.split(".").at(-1),
				uuid: e.uuid,
				name: String(t.name ?? "Species"),
				img: String(t.img ?? ""),
				system: fe(t.system),
				effects: ce(t.effects)
			}
		};
		if (await rn(this.key, n), this.closed) return this.dispose();
		this.selection = n, this.app.data.species = this.key, this.app.data.subspecies = "", this.commit();
	}
};
//#endregion
//#region src/module/foundry/application-element.ts
function Tn(e) {
	let t = e instanceof HTMLElement ? e : p(e) ? e[0] : void 0;
	return t instanceof HTMLElement ? t : void 0;
}
//#endregion
//#region src/module/functions/species-chargen/preview.ts
function En(e) {
	let t = Ce(e);
	return {
		characteristics: t.characteristics,
		movement: t.movement,
		fate: t.fate,
		resilience: t.resilience,
		extra: t.extra,
		skills: t.skills?.map(Dn),
		talents: t.talents?.map((e) => Dn(e).replaceAll(", ", " or ")),
		randomTalents: [{
			name: e.system.tables.talents.name || "Talents",
			count: e.system.talents.random ?? 0
		}]
	};
}
function Dn(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
//#endregion
//#region src/module/wfrp/species-chargen/table-policy.ts
function On(e) {
	return e.type === "document" && typeof e.documentUuid == "string" && e.documentUuid ? e.documentUuid : void 0;
}
function kn() {
	return game.wfrp4e?.tables?.findTable?.("species");
}
async function An(e) {
	let t = {}, n = (e) => ({
		valid: !1,
		choices: {},
		reason: e
	});
	if (!p(e) || e.documentName !== "RollTable" || typeof e.toObject != "function") return n("No usable Species table is configured.");
	let r = e.toObject(), i = p(r) ? r.results : void 0;
	if (!Array.isArray(i) || !i.length) return n("The Species table is empty.");
	for (let e of i) {
		let r = p(e) ? On(e) : void 0;
		if (!r) return n("Every Species table result must be a Species Item document result.");
		try {
			let e = await fromUuid(r);
			if (!fn(e) || !ue(e) || e.actor) return n("Every Species table result must link a world or compendium Species Item.");
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
async function jn() {
	return An(kn());
}
//#endregion
//#region src/module/wfrp/species-chargen/choices.ts
var Mn = On;
async function Nn() {
	let e = kn(), t = await jn();
	if (!t.valid) throw Error(t.reason);
	if (kn() !== e) throw Error("The Species table changed. Try again.");
	let n = game.wfrp4e?.tables;
	if (!n?.rollTable) throw Error("WFRP Species table rolling is unavailable.");
	let r = await n.rollTable("species");
	if (!p(r) || !p(r.object)) throw Error("The Species table did not return a result.");
	let i = On(r.object);
	if (!i || !t.choices[`item:${i}`]) throw Error("The rolled result is not one of the table's Species Items.");
	return r;
}
//#endregion
//#region src/module/functions/species-builder/world-table.ts
var Pn = "managedSpeciesTable";
function Fn() {
	return {
		isRegistered: !1,
		name: "Species",
		ownership: "new",
		requiresLinkRepair: !1,
		rows: []
	};
}
function In(e, t) {
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
function Ln(e, t, n) {
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
function Rn(e) {
	let t = e.map((e) => Number.isInteger(e.weight) && e.weight > 0 ? e.weight : 0), n = t.reduce((e, t) => e + t, 0), r = 1;
	return t.map((e) => {
		let t = r, i = e > 0 ? t + e - 1 : t;
		return r = i + 1, {
			chance: n > 0 ? e / n : 0,
			range: [t, i]
		};
	});
}
function zn(e, t, n) {
	let r = n.find((e) => e.label === t.trim());
	if (r) return r.key;
	let i = e.trim();
	return n.some((e) => e.key === i) ? i : "";
}
function Bn(e) {
	let t = /@UUID\[([^\]]+)\]\{([^}]*)\}/u.exec(e), n = t?.[1]?.trim() ?? "", r = t?.[2]?.trim() ?? "";
	return n && r ? {
		label: r,
		uuid: n
	} : void 0;
}
function Vn(e) {
	let t = m(e, ["range"]), n = Array.isArray(t) ? Number(t[0]) : 0, r = Array.isArray(t) ? Number(t[1]) : 0;
	if (Number.isInteger(n) && Number.isInteger(r) && r >= n) return r - n + 1;
	let i = Number(m(e, ["weight"]));
	return Number.isInteger(i) && i > 0 ? i : 1;
}
function Hn(e, t) {
	let n = Rn(e.rows), r = e.rows.reduce((e, t) => e + (Number.isInteger(t.weight) && t.weight > 0 ? t.weight : 0), 0);
	return {
		displayRoll: !0,
		flags: {
			wfrp4e: { key: "species" },
			[t]: { [Pn]: !0 }
		},
		formula: `1d${Math.max(r, 1)}`,
		img: "systems/wfrp4e/ui/buttons/d10.webp",
		name: Wn(e),
		replacement: !0,
		results: e.rows.map((e, t) => ({
			description: Un(e),
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
function Un(e) {
	let t = e.journalUuid?.trim() ?? "", n = e.name.trim();
	if (!t) throw Error(`Species "${n || e.speciesKey}" does not have a document link target.`);
	if (/[{}]/u.test(n)) throw Error(`Species "${n}" cannot be encoded in WFRP's UUID-link label.`);
	return `@UUID[${t}]{${n}}`;
}
function Wn(e) {
	let t = e.name.trim() || "Species";
	return e.ownership === "external" && !t.endsWith("(Customizer)") ? `${t} (Customizer)` : t;
}
//#endregion
//#region src/module/foundry/roll-table-results.ts
async function Gn(e, t) {
	t.updates.length > 0 && await e.updateEmbeddedDocuments("TableResult", t.updates), t.creates.length > 0 && await e.createEmbeddedDocuments("TableResult", t.creates), t.deletedIds.length > 0 && await e.deleteEmbeddedDocuments("TableResult", t.deletedIds);
}
//#endregion
//#region src/module/wfrp/species-builder/world-table/journals.ts
var Kn = "generatedSpeciesJournal", qn = "WFRP Customizer Species Journals";
async function Jn(t) {
	let n = game.journal?.contents ?? [], r = Yn(n), i, a = [];
	for (let o of t.rows) {
		let t = Xn(o.journalUuid, o.speciesKey, n) || r.get(o.speciesKey)?.uuid;
		if (!t) {
			i ??= await Qn();
			let n = await JournalEntry.create({
				flags: { [e]: { [Kn]: { speciesKey: o.speciesKey } } },
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
function Yn(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = Zn(n);
		if (e) {
			if (t.has(e)) throw Error(`Multiple Species Builder Journals exist for "${e}". Remove the duplicate and retry.`);
			t.set(e, n);
		}
	}
	return t;
}
function Xn(e, t, n) {
	let r = e?.trim() ?? "";
	if (!r) return "";
	let i = n.find((e) => e.uuid === r);
	if (!i) return r.startsWith("JournalEntry.") && r.split(".").length === 2 ? "" : r;
	let a = Zn(i);
	return a && a !== t ? "" : r;
}
function Zn(t) {
	let n = t.getFlag(e, Kn);
	return p(n) ? h(n, ["speciesKey"]).trim() : "";
}
async function Qn() {
	let e = game.folders.contents.find((e) => e.type === "JournalEntry" && e.name === qn);
	if (e) return e;
	let t = await Folder.create({
		name: qn,
		type: "JournalEntry"
	});
	if (!t) throw Error("Foundry did not create the generated Species Journal folder.");
	return t;
}
//#endregion
//#region src/module/wfrp/species-builder/world-table/persistence.ts
var $n = "species", er = "tableSettings";
async function tr(t) {
	let n = await Jn(t), r = Hn(n, e);
	return t.ownership === "managed" ? await ar(n, r) : await ir(n, r);
}
async function nr(e) {
	let t = game.settings.get(n, er);
	if (!p(t)) throw Error("WFRP table settings are unavailable; the Species table was not registered.");
	await game.settings.set(n, er, {
		...t,
		[$n]: e
	});
}
function rr(t) {
	return t.getFlag(e, Pn) === !0;
}
async function ir(e, t) {
	if (e.ownership === "external") {
		let t = e.tableId ? game.tables?.get(e.tableId) : void 0;
		if (!t || rr(t)) throw Error("The source Species table changed. Reload before saving a managed copy.");
	}
	if ((game.tables?.contents ?? []).some(rr)) throw Error("A managed Species table already exists. Reload before saving.");
	let n = await RollTable.create(t);
	if (!n) throw Error("Foundry did not create the managed Species table.");
	return n;
}
async function ar(t, r) {
	let i = t.tableId ? game.tables?.get(t.tableId) : void 0;
	if (!i || !rr(i)) throw Error("The managed Species table changed. Reload before saving again.");
	let a = Array.isArray(r.results) ? r.results.filter(p) : [];
	return await i.update({
		displayRoll: r.displayRoll,
		[`flags.${e}.${Pn}`]: !0,
		[`flags.${n}.key`]: $n,
		formula: r.formula,
		name: r.name,
		replacement: r.replacement
	}), await or(i, t.rows, a), i;
}
async function or(e, t, n) {
	let r = e.toObject(), i = Array.isArray(r.results) ? r.results.filter(p) : [], a = new Set(i.map((e) => h(e, ["_id"]))), o = /* @__PURE__ */ new Set(), s = [], c = [];
	n.forEach((e, n) => {
		let r = sr(t[n], i, a, o);
		r ? (o.add(r), s.push({
			...e,
			_id: r
		})) : c.push(e);
	}), await Gn(e, {
		creates: c,
		deletedIds: [...a].filter((e) => e && !o.has(e)),
		updates: s
	});
}
function sr(e, t, n, r) {
	if (e?.resultId && n.has(e.resultId) && !r.has(e.resultId)) return e.resultId;
	let i = t.find((t) => h(t, [
		"flags",
		"wfrp4e",
		"species"
	]) === e?.speciesKey && !r.has(h(t, ["_id"])));
	return i ? h(i, ["_id"]) : "";
}
//#endregion
//#region src/module/wfrp/species-chargen/default-table.ts
var cr = "Compendium.wfrp4e-customizer-apps.species-tables.RollTable.a341d269e7805bc2";
async function lr() {
	if (!game.user?.isGM) throw Error("Only a GM can change the configured Species table.");
	if ((await jn()).valid) return;
	let e;
	for (let t of game.tables?.contents ?? []) {
		let n = t.toObject(), r = h(n, ["_stats", "compendiumSource"]), i = h(n, [
			"flags",
			"core",
			"sourceId"
		]);
		if (!(r !== "Compendium.wfrp4e-customizer-apps.species-tables.RollTable.a341d269e7805bc2" && i !== "Compendium.wfrp4e-customizer-apps.species-tables.RollTable.a341d269e7805bc2") && (await An(t)).valid) {
			e = t;
			break;
		}
	}
	if (!e) {
		let t = await fromUuid(cr), n = await An(t);
		if (!n.valid || !p(t) || typeof t.toObject != "function") throw Error(`The default Species table is unavailable or invalid. ${n.reason}`);
		let r = t.toObject();
		if (!p(r)) throw Error("The default Species table has no source data.");
		for (let e of [
			"_id",
			"folder",
			"_stats"
		]) delete r[e];
		if (r._stats = { compendiumSource: cr }, e = await RollTable.create(r) ?? void 0, !e) throw Error("Foundry could not import the default Species table.");
	}
	await nr(e.id);
}
//#endregion
//#region src/module/wfrp/species-chargen/table-reminder.ts
var ur = "hideInvalidSpeciesTableReminder", dr = !1, fr;
function pr() {
	game.settings.register(e, ur, {
		name: "Hide invalid Species table reminder",
		scope: "client",
		config: !0,
		type: Boolean,
		default: !1
	});
}
function mr() {
	return fr || (!game.user?.isGM || qe() || dr || game.settings.get("wfrp4e-customizer-apps", "hideInvalidSpeciesTableReminder") === !0 || game.users?.activeGM && game.users.activeGM.id !== game.user.id ? Promise.resolve(!1) : (fr = hr().catch((e) => (ui.notifications?.error(e instanceof Error ? e.message : String(e)), !1)).finally(() => {
		fr = void 0;
	}), fr));
}
async function hr() {
	if ((await jn()).valid) return !1;
	dr = !0;
	let t = null, n = await foundry.applications.api.DialogV2.wait({
		window: { title: "Species table needs Species Items" },
		content: "<p>Character creation requires a Species table whose results are all Species Items. The current table cannot be used for species rolls.</p><p>Use the supplied default table? It has Human 90%, Halfling 4%, Dwarf 4%, High Elf 1%, and Wood Elf 1%. Your current table will be kept.</p><label><input type=\"checkbox\" name=\"suppress\"> Don’t show this reminder again</label>",
		buttons: [{
			action: "replace",
			label: "Use Default Table",
			callback: (e, t) => gr(!0, t.form)
		}, {
			action: "later",
			label: "Not Now",
			default: !0,
			callback: (e, t) => gr(!1, t.form)
		}],
		render: (e, n) => {
			t = n.element.querySelector("form");
		},
		close: () => gr(!1, t),
		rejectClose: !1
	});
	return n?.suppress && await game.settings.set(e, ur, !0), n?.replace ? (await lr(), ui.notifications?.info("Character creation now uses a Species Item table."), !0) : !1;
}
function gr(e, t) {
	return {
		replace: e,
		suppress: t?.querySelector("[name=\"suppress\"]")?.checked === !0
	};
}
//#endregion
//#region src/module/wfrp/species-chargen/stage.ts
function _r(e, t) {
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
			let e = await jn();
			this.tableValid = e.valid, this.tableReason = e.reason, !e.valid && !this.reminderStarted && (this.reminderStarted = !0, mr().then((e) => {
				e && !t.closed && this.render(!0);
			}));
			let n = t.selection?.record;
			return {
				data: this.data,
				context: this.context,
				species: e.choices,
				speciesDisplay: n?.name ?? "",
				...n ? { preview: En(n) } : {}
			};
		}
		activateListeners(e) {
			super.activateListeners(e);
			let t = Tn(e);
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
					if (!p(t) || typeof t.uuid != "string") throw Error("Drop a world or compendium Species Item.");
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
				let e = await jn();
				if (!e.valid || !e.choices[t]) throw Error(e.reason || "Choose a Species Item from the current table.");
				await this.chooseItem(t.slice(5));
			});
		}
		async onRollSpecies(e) {
			e.stopPropagation(), await this.runSelection(async () => {
				if (t.assertUnlocked(), this.context.roll) throw Error("Species has already been rolled for this character.");
				let e = await Nn();
				this.context.roll = e;
				let n = Mn(e.object);
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
			let e = this.context.roll?.object, n = p(e) ? Mn(e) : void 0, r = this.data.customizerSpecies?.rollIdentity ?? (n ? [n] : []);
			this.context.exp = this.context.roll ? un(t.selection, r) : 0;
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
var vr = [
	"rollName",
	"rollAge",
	"rollHeight",
	"rollEyes",
	"rollHair",
	"rollMotivation"
];
function yr(e, t) {
	return e.selection?.record.system.keys.find((e) => {
		if (t === "rollName") {
			let t = game.wfrp4e?.names?.[e];
			return p(t) && typeof t.forename == "function" && typeof t.surname == "function";
		}
		let n = game.wfrp4e?.config?.[t === "rollAge" ? "speciesAge" : "speciesHeight"], r = p(n) ? n[e] : void 0;
		return t === "rollAge" ? typeof r == "string" && !!r.trim() : p(r) && typeof r.die == "string" && typeof r.feet == "number" && typeof r.inches == "number";
	});
}
function br(e, t) {
	return class extends e {
		generatorContext(e) {
			let n = yr(t, e);
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
			let r = await n.rollTable?.(e, {}, t), i = p(r) ? [r.text, r.name].find((e) => typeof e == "string" && e.trim()) : void 0;
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
			let n = Tn(e);
			if (!n) return;
			let r = !1;
			for (let e of vr) {
				let i = n.querySelector(`[data-type="${e}"]`);
				if (i) {
					if (!(e === "rollName" || e === "rollAge" || e === "rollHeight" ? yr(t, e) : e === "rollMotivation" || t.selection?.record.system.tables[e === "rollEyes" ? "eye" : "hair"].uuid || t.selection?.record.system.tables[e === "rollEyes" ? "eye" : "hair"].id)) {
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
var xr = /* @__PURE__ */ new WeakMap();
function Sr() {
	Hooks.on("wfrp4e:chargen", (e) => {
		qe() || Cr(e);
	});
}
function Cr(e) {
	if (qe()) throw Error("The legacy Species bridge is disabled when native Species support is available.");
	if (!p(e) || !Array.isArray(e.stages) || !p(e.data) || typeof e.getData != "function" || typeof e.close != "function") throw Error("WFRP character generation has an unsupported application shape.");
	let t = e, n = t.stages.find((e) => e.key === "species");
	if (!n || typeof n.class != "function") throw Error("WFRP's Species stage is unavailable.");
	if (xr.has(t)) return;
	let r = new wn(t);
	xr.set(t, r), n.class = _r(n.class, r);
	let i = t.stages.find((e) => e.key === "details");
	i && (i.class = br(i.class, r));
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
async function wr(e, t) {
	Cr(e);
	let n = e;
	await xr.get(n).ready;
	let r = n.stages.findIndex((e) => e.key === "species"), i = n.stages[r];
	i.app ??= new i.class(n.data, {
		complete: n.complete.bind(n),
		index: r
	});
	let a = i.app;
	await a.selectSpeciesItem(t), a.render(!0);
}
//#endregion
//#region src/module/functions/species-builder/items/actor-profile.ts
function Tr(e) {
	let t = {};
	for (let [n, r] of Object.entries(e.characteristics)) r.base !== null && r.dice !== null && (t[`system.characteristics.${n}.initial`] = r.base + r.dice * 5);
	return e.movement !== null && (t["system.details.move.value"] = e.movement), t;
}
function Er(e, t) {
	let n = Object.entries(e.characteristics).filter(([e, n]) => e in t && n.base !== null && n.dice !== null), r = Tr(e), i = n.every(([e]) => t[e] === r[`system.characteristics.${e}.initial`]), a = {};
	for (let [e, r] of n) {
		if (!(e in t) || !i && t[e] === 0) continue;
		let n = r.dice, o = n === 0 ? "0" : `${n}d10`, s = i ? "initial" : "modifier";
		a[`system.characteristics.${e}.${s}`] = i ? `${o}+${r.base}` : `${o}-${n * 5}`;
	}
	return a;
}
//#endregion
//#region src/module/wfrp/species-item/actor/profile.ts
function Dr(e) {
	let t = e.toObject().system, n = p(t) ? t.characteristics : void 0;
	if (!p(n)) throw Error("This Actor has no characteristics.");
	let r = {};
	for (let [e, t] of Object.entries(n)) p(t) && typeof t.initial == "number" && (r[e] = t.initial);
	return r;
}
function Or(e, t) {
	let n = Tr(t), r = Dr(e);
	for (let e of Object.keys(t.characteristics)) e in r || delete n[`system.characteristics.${e}.initial`];
	if (e.type === "vehicle" && t.movement !== null) {
		let r = e.toObject().system, i = p(r) ? r.details : void 0, a = p(i) ? i.move : void 0;
		if (!p(a)) throw Error("This Vehicle has no Movement data.");
		let o = a.custom, s = p(o) && o.label && o.value ? "custom" : a.primary;
		if (s !== "custom" && s !== "sail" && s !== "oars") throw Error("This Vehicle has no active Movement mode.");
		delete n["system.details.move.value"], n[`system.details.move.${s}.value`] = t.movement;
	}
	return n;
}
//#endregion
//#region src/module/wfrp/species-item/actor/owned.ts
function kr(e) {
	return e.items?.contents.find(ue);
}
async function Ar(e) {
	let t = de(e);
	if (e.actor || !Se(t)) return t;
	let n = de(await vn(t.system.subspeciesOf));
	if (Se(n)) throw Error("Nested Species parents are not supported.");
	return on(t, n);
}
//#endregion
//#region src/module/wfrp/species-item/actor/drop.ts
var jr = /* @__PURE__ */ new WeakSet();
async function Mr(e, t) {
	if (!e.isOwner) throw Error("You cannot change this Actor's Species.");
	if (!e.items?.contents.some((e) => e.uuid === t.uuid) && !jr.has(e)) {
		if (kr(e)) throw Error("Remove the Actor's existing Species Item before dropping another Species.");
		jr.add(e);
		try {
			if (game.user && !t.testUserPermission(game.user, "OBSERVER")) throw Error(`You do not have permission to read ${t.name}.`);
			let n = await Ar(t), r = Sn(t, n), i = await e.createEmbeddedDocuments("Item", [r]);
			return i.length ? (await foundry.applications.api.DialogV2.confirm({
				window: { title: "Apply Species Characteristics" },
				content: "<p>Apply this Species Item's starting characteristics and Movement?</p><p>This replaces initial characteristic values and Movement. Advances and modifiers are kept. Choosing No keeps your current profile; the Species Item and its effects remain on the Actor.</p>",
				rejectClose: !1
			}) && e.items?.contents.includes(i[0]) && await e.update(Or(e, n.system)), i) : void 0;
		} finally {
			jr.delete(e);
		}
	}
}
//#endregion
//#region src/module/wfrp/species-item/actor/grant.ts
async function Nr(e, t) {
	let n = game.wfrp4e?.utility, r = t === "skill" ? await n?.findSkill?.(e) : await n?.findTalent?.(e);
	if (!r || r.type !== t) throw Error(`Cannot find ${t} “${e}”.`);
	return r;
}
//#endregion
//#region src/module/wfrp/species-item/actor/talent-table.ts
async function Pr(e) {
	let t = await Zt(e) ?? game.wfrp4e?.tables?.findTable?.("talents");
	if (!p(t) || typeof t.roll != "function") throw Error("The Species random Talent table is unavailable.");
	let n = await t.roll({ recursive: !0 }), r = p(n) ? n.results : void 0;
	if (!Array.isArray(r) || r.length !== 1) throw Error("The Species Talent table must return one Talent per roll.");
	let i = r[0];
	if (!p(i) || typeof i.toObject != "function") throw Error("The Species Talent table returned an invalid result.");
	let a = i.toObject();
	if (!p(a)) throw Error("The Species Talent result has no data.");
	let o = sn(a), s = a.name;
	if (!o && (typeof s != "string" || !s.trim())) throw Error("The Species Talent result has no Item link or Talent name.");
	let c = o ? mn(await fromUuid(o), "The rolled Talent Item is unavailable.") : await Nr(s, "talent");
	if (c.type !== "talent") throw Error("The Species Talent table result is not a Talent.");
	return c;
}
//#endregion
//#region src/module/wfrp/species-item/actor/randomize.ts
async function Fr(e, t, n) {
	if (!e.isOwner) throw Error("You cannot change this Actor.");
	let { system: r } = de(t);
	n === "characteristics" ? await Ir(e, r) : n === "skills" ? await Lr(e, r) : n === "talents" && await Rr(e, r);
}
async function Ir(e, t) {
	let n = Er(t, Dr(e)), r = {};
	for (let [e, t] of Object.entries(n)) r[e] = await zr(t);
	await e.update(r);
}
async function Lr(e, t) {
	let n = [...new Set(t.skills.list.filter((e) => e.trim()))];
	if (!n.length) throw Error("This Species Item has no Skills.");
	let r = [];
	for (; r.length < 6 && n.length;) {
		let e = await zr(`1d${n.length}-1`);
		r.push(n.splice(e, 1)[0]);
	}
	let i = [];
	for (let [t, n] of r.entries()) {
		let r = (e.items?.contents.find((e) => e.type === "skill" && e.name === n) ?? await Nr(n, "skill")).toObject(), a = r.system;
		if (!p(a) || !p(a.advances)) throw Error(`Skill ${n} has no advances data.`);
		let o = a.advances.value;
		if (typeof o != "number") throw Error(`Skill ${n} has invalid advances.`);
		a.advances.value = Math.max(o, t < 3 ? 5 : 3), i.push(r);
	}
	await e.update({ items: i });
}
async function Rr(e, t) {
	let n = D(t.talents.choices), r = [];
	for (let e of n) {
		let t = e.choices[await zr(`1d${e.choices.length}-1`)], n = t.item?.uuid ? mn(await fromUuid(t.item.uuid), `Talent ${t.name} is unavailable.`) : await Nr(t.name, "talent");
		if (n.type !== "talent") throw Error(`${t.name} is not a Talent.`);
		r.push(n.toObject());
	}
	for (let e = 0; e < (t.talents.random ?? 0); e++) r.push((await Pr(t.tables.talents)).toObject());
	if (!r.length) throw Error("This Species Item has no Talents.");
	await e.createEmbeddedDocuments("Item", r);
}
async function zr(e) {
	return (await new Roll(e).roll({ allowInteractive: !1 })).total;
}
//#endregion
//#region src/module/wfrp/species-item/actor/integration.ts
var Br = /* @__PURE__ */ new WeakSet();
function Vr(e) {
	let t = Object.getOwnPropertyDescriptor(e, "Species");
	if (!t?.get) throw Error("WFRP Actor Species getter is unavailable.");
	let n = t.get;
	Object.defineProperty(e, "Species", {
		...t,
		get() {
			return kr(this)?.name ?? n.call(this);
		}
	});
}
function Hr(e, t) {
	if (!p(e) || !dn(e.document) || !p(e.options) || !p(e.options.actions) || typeof e._onDropItem != "function") return;
	let n = e;
	if (Br.has(n) || (Ur(n), Br.add(n)), !(t instanceof HTMLElement)) return;
	let r = t.querySelector("[data-action='editSpecies']"), i = kr(n.document);
	r && (r.readOnly = !!i), r && i && (r.value = i.name, r.readOnly = !0, r.title = "Species comes from the owned Item. Open it from the sheet header menu to edit.");
}
function Ur(e) {
	let t = e._onDropItem;
	e._onDropItem = async function(e, n) {
		if (!p(e) || typeof e.uuid != "string") return t.call(this, e, n);
		try {
			let t = await fromUuid(e.uuid);
			if (fn(t) && ue(t)) return await Mr(this.document, t);
		} catch (e) {
			Wr(e);
			return;
		}
		return t.call(this, e, n);
	};
	let n = e.options.actions.randomize;
	typeof n == "function" && (e.options.actions.randomize = async function(e, t) {
		let r = kr(this.document);
		if (!r) return n.call(this, e, t);
		let i = t ?? e.target;
		if (i instanceof HTMLElement) try {
			await Fr(this.document, r, i.dataset.type ?? "");
		} catch (e) {
			Wr(e);
		}
	});
}
function Wr(e) {
	ui.notifications?.error(e instanceof Error ? e.message : String(e));
}
//#endregion
//#region src/module/wfrp/species-item/actor-sheet.ts
function Gr() {
	qe() || (Hooks.once("setup", () => {
		let e = game.wfrp4e;
		Vr(e.documents.ActorWFRP4e.prototype);
	}), Hooks.on("renderApplicationV2", Hr));
	for (let e of [
		"Character",
		"NPC",
		"Creature",
		"Vehicle"
	]) Hooks.on(`getHeaderControlsActorSheetWFRP4e${e}`, (e, t) => {
		if (!p(e) || !Array.isArray(t)) return;
		let n = e.document;
		if (!dn(n)) return;
		let r = e.options;
		if (!(!p(r) || !p(r.actions))) for (let e of n.items?.contents.filter(ue) ?? []) {
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
function Kr(e, ...t) {
	console.info(e, ...t);
}
function qr(e, ...t) {
	console.warn(e, ...t);
}
//#endregion
//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function Jr(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var A = {}, Yr = [], Xr = () => {}, Zr = () => !1, Qr = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), $r = (e) => e.startsWith("onUpdate:"), ei = Object.assign, ti = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, ni = Object.prototype.hasOwnProperty, j = (e, t) => ni.call(e, t), M = Array.isArray, ri = (e) => di(e) === "[object Map]", ii = (e) => di(e) === "[object Set]", ai = (e) => di(e) === "[object Date]", N = (e) => typeof e == "function", oi = (e) => typeof e == "string", si = (e) => typeof e == "symbol", P = (e) => typeof e == "object" && !!e, ci = (e) => (P(e) || N(e)) && N(e.then) && N(e.catch), li = Object.prototype.toString, di = (e) => li.call(e), fi = (e) => di(e).slice(8, -1), pi = (e) => di(e) === "[object Object]", mi = (e) => oi(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, hi = /* @__PURE__ */ Jr(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), gi = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, _i = /-\w/g, vi = gi((e) => e.replace(_i, (e) => e.slice(1).toUpperCase())), yi = /\B([A-Z])/g, bi = gi((e) => e.replace(yi, "-$1").toLowerCase()), xi = gi((e) => e.charAt(0).toUpperCase() + e.slice(1)), Si = gi((e) => e ? `on${xi(e)}` : ""), Ci = (e, t) => !Object.is(e, t), wi = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, Ti = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, Ei = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, Di, Oi = () => Di ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function ki(e) {
	if (M(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = oi(r) ? Ni(r) : ki(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (oi(e) || P(e)) return e;
}
var Ai = /;(?![^(]*\))/g, ji = /:([^]+)/, Mi = /\/\*[^]*?\*\//g;
function Ni(e) {
	let t = {};
	return e.replace(Mi, "").split(Ai).forEach((e) => {
		if (e) {
			let n = e.split(ji);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function F(e) {
	let t = "";
	if (oi(e)) t = e;
	else if (M(e)) for (let n = 0; n < e.length; n++) {
		let r = F(e[n]);
		r && (t += r + " ");
	}
	else if (P(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var Pi = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Fi = /* @__PURE__ */ Jr(Pi);
Pi + "";
function Ii(e) {
	return !!e || e === "";
}
function Li(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = Ri(e[r], t[r]);
	return n;
}
function Ri(e, t) {
	if (e === t) return !0;
	let n = ai(e), r = ai(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = si(e), r = si(t), n || r) return e === t;
	if (n = M(e), r = M(t), n || r) return n && r ? Li(e, t) : !1;
	if (n = P(e), r = P(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !Ri(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function zi(e, t) {
	return e.findIndex((e) => Ri(e, t));
}
var Bi = (e) => !!(e && e.__v_isRef === !0), I = (e) => oi(e) ? e : e == null ? "" : M(e) || P(e) && (e.toString === li || !N(e.toString)) ? Bi(e) ? I(e.value) : JSON.stringify(e, Vi, 2) : String(e), Vi = (e, t) => Bi(t) ? Vi(e, t.value) : ri(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Hi(t, r) + " =>"] = n, e), {}) } : ii(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Hi(e)) } : si(t) ? Hi(t) : P(t) && !M(t) && !pi(t) ? String(t) : t, Hi = (e, t = "") => si(e) ? `Symbol(${e.description ?? t})` : e, Ui, Wi = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Ui && (Ui.active ? (this.parent = Ui, this.index = (Ui.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = Ui;
			try {
				return Ui = this, e();
			} finally {
				Ui = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Ui, Ui = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Ui === this) Ui = this.prevScope;
			else {
				let e = Ui;
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
function Gi(e) {
	return new Wi(e);
}
function Ki() {
	return Ui;
}
function qi(e, t = !1) {
	Ui && Ui.cleanups.push(e);
}
var L, Ji = /* @__PURE__ */ new WeakSet(), Yi = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ui && (Ui.active ? Ui.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ji.has(this) && (Ji.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || $i(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, fa(this), na(this);
		let e = L, t = ca;
		L = this, ca = !0;
		try {
			return this.fn();
		} finally {
			ra(this), L = e, ca = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) oa(e);
			this.deps = this.depsTail = void 0, fa(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ji.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		ia(this) && this.run();
	}
	get dirty() {
		return ia(this);
	}
}, Xi = 0, Zi, Qi;
function $i(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Qi, Qi = e;
		return;
	}
	e.next = Zi, Zi = e;
}
function ea() {
	Xi++;
}
function ta() {
	if (--Xi > 0) return;
	if (Qi) {
		let e = Qi;
		for (Qi = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Zi;) {
		let t = Zi;
		for (Zi = void 0; t;) {
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
function na(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function ra(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), oa(r), sa(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function ia(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (aa(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function aa(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === pa) || (e.globalVersion = pa, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ia(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = L, r = ca;
	L = e, ca = !0;
	try {
		na(e);
		let n = e.fn(e._value);
		(t.version === 0 || Ci(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		L = n, ca = r, ra(e), e.flags &= -3;
	}
}
function oa(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) oa(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function sa(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var ca = !0, la = [];
function ua() {
	la.push(ca), ca = !1;
}
function da() {
	let e = la.pop();
	ca = e === void 0 ? !0 : e;
}
function fa(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = L;
		L = void 0;
		try {
			t();
		} finally {
			L = e;
		}
	}
}
var pa = 0, ma = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, ha = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!L || !ca || L === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== L) t = this.activeLink = new ma(L, this), L.deps ? (t.prevDep = L.depsTail, L.depsTail.nextDep = t, L.depsTail = t) : L.deps = L.depsTail = t, ga(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = L.depsTail, t.nextDep = void 0, L.depsTail.nextDep = t, L.depsTail = t, L.deps === t && (L.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, pa++, this.notify(e);
	}
	notify(e) {
		ea();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			ta();
		}
	}
};
function ga(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) ga(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var _a = /* @__PURE__ */ new WeakMap(), va = /* @__PURE__ */ Symbol(""), ya = /* @__PURE__ */ Symbol(""), ba = /* @__PURE__ */ Symbol("");
function xa(e, t, n) {
	if (ca && L) {
		let t = _a.get(e);
		t || _a.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new ha()), r.map = t, r.key = n), r.track();
	}
}
function Sa(e, t, n, r, i, a) {
	let o = _a.get(e);
	if (!o) {
		pa++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (ea(), t === "clear") o.forEach(s);
	else {
		let i = M(e), a = i && mi(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === ba || !si(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(ba)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(va)), ri(e) && s(o.get(ya)));
				break;
			case "delete":
				i || (s(o.get(va)), ri(e) && s(o.get(ya)));
				break;
			case "set":
				ri(e) && s(o.get(va));
				break;
		}
	}
	ta();
}
function Ca(e, t) {
	let n = _a.get(e);
	return n && n.get(t);
}
function wa(e) {
	let t = /* @__PURE__ */ R(e);
	return t === e ? t : (xa(t, "iterate", ba), /* @__PURE__ */ lo(e) ? t : t.map(po));
}
function Ta(e) {
	return xa(e = /* @__PURE__ */ R(e), "iterate", ba), e;
}
function Ea(e, t) {
	return /* @__PURE__ */ co(e) ? mo(/* @__PURE__ */ so(e) ? po(t) : t) : po(t);
}
var Da = {
	__proto__: null,
	[Symbol.iterator]() {
		return Oa(this, Symbol.iterator, (e) => Ea(this, e));
	},
	concat(...e) {
		return wa(this).concat(...e.map((e) => M(e) ? wa(e) : e));
	},
	entries() {
		return Oa(this, "entries", (e) => (e[1] = Ea(this, e[1]), e));
	},
	every(e, t) {
		return Aa(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return Aa(this, "filter", e, t, (e) => e.map((e) => Ea(this, e)), arguments);
	},
	find(e, t) {
		return Aa(this, "find", e, t, (e) => Ea(this, e), arguments);
	},
	findIndex(e, t) {
		return Aa(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return Aa(this, "findLast", e, t, (e) => Ea(this, e), arguments);
	},
	findLastIndex(e, t) {
		return Aa(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return Aa(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return Ma(this, "includes", e);
	},
	indexOf(...e) {
		return Ma(this, "indexOf", e);
	},
	join(e) {
		return wa(this).join(e);
	},
	lastIndexOf(...e) {
		return Ma(this, "lastIndexOf", e);
	},
	map(e, t) {
		return Aa(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return Na(this, "pop");
	},
	push(...e) {
		return Na(this, "push", e);
	},
	reduce(e, ...t) {
		return ja(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return ja(this, "reduceRight", e, t);
	},
	shift() {
		return Na(this, "shift");
	},
	some(e, t) {
		return Aa(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return Na(this, "splice", e);
	},
	toReversed() {
		return wa(this).toReversed();
	},
	toSorted(e) {
		return wa(this).toSorted(e);
	},
	toSpliced(...e) {
		return wa(this).toSpliced(...e);
	},
	unshift(...e) {
		return Na(this, "unshift", e);
	},
	values() {
		return Oa(this, "values", (e) => Ea(this, e));
	}
};
function Oa(e, t, n) {
	let r = Ta(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ lo(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var ka = Array.prototype;
function Aa(e, t, n, r, i, a) {
	let o = Ta(e), s = o !== e && !/* @__PURE__ */ lo(e), c = o[t];
	if (c !== ka[t]) {
		let t = c.apply(e, a);
		return s ? po(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Ea(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function ja(e, t, n, r) {
	let i = Ta(e), a = i !== e && !/* @__PURE__ */ lo(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Ea(e, t)), n.call(this, t, Ea(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Ea(e, c) : c;
}
function Ma(e, t, n) {
	let r = /* @__PURE__ */ R(e);
	xa(r, "iterate", ba);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ uo(n[0]) ? (n[0] = /* @__PURE__ */ R(n[0]), r[t](...n)) : i;
}
function Na(e, t, n = []) {
	ua(), ea();
	let r = (/* @__PURE__ */ R(e))[t].apply(e, n);
	return ta(), da(), r;
}
var Pa = /* @__PURE__ */ Jr("__proto__,__v_isRef,__isVue"), Fa = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(si));
function Ia(e) {
	si(e) || (e = String(e));
	let t = /* @__PURE__ */ R(this);
	return xa(t, "has", e), t.hasOwnProperty(e);
}
var La = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? to : eo : i ? $a : Qa).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = M(e);
		if (!r) {
			let e;
			if (a && (e = Da[t])) return e;
			if (t === "hasOwnProperty") return Ia;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ z(e) ? e : n);
		if ((si(t) ? Fa.has(t) : Pa(t)) || (r || xa(e, "get", t), i)) return o;
		if (/* @__PURE__ */ z(o)) {
			let e = a && mi(t) ? o : o.value;
			return r && P(e) ? /* @__PURE__ */ ao(e) : e;
		}
		return P(o) ? r ? /* @__PURE__ */ ao(o) : /* @__PURE__ */ ro(o) : o;
	}
}, Ra = class extends La {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = M(e) && mi(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ co(i);
			if (!/* @__PURE__ */ lo(n) && !/* @__PURE__ */ co(n) && (i = /* @__PURE__ */ R(i), n = /* @__PURE__ */ R(n)), !a && /* @__PURE__ */ z(i) && !/* @__PURE__ */ z(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : j(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ z(e) ? e : r);
		return e === /* @__PURE__ */ R(r) && (o ? Ci(n, i) && Sa(e, "set", t, n, i) : Sa(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = j(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Sa(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!si(t) || !Fa.has(t)) && xa(e, "has", t), n;
	}
	ownKeys(e) {
		return xa(e, "iterate", M(e) ? "length" : va), Reflect.ownKeys(e);
	}
}, za = class extends La {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Ba = /* @__PURE__ */ new Ra(), Va = /* @__PURE__ */ new za(), Ha = /* @__PURE__ */ new Ra(!0), Ua = (e) => e, Wa = (e) => Reflect.getPrototypeOf(e);
function Ga(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ R(i), o = ri(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Ua : t ? mo : po;
		return !t && xa(a, "iterate", c ? ya : va), ei(Object.create(l), { next() {
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
function Ka(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function qa(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ R(r), a = /* @__PURE__ */ R(n);
			e || (Ci(n, a) && xa(i, "get", n), xa(i, "get", a));
			let { has: o } = Wa(i), s = t ? Ua : e ? mo : po;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && xa(/* @__PURE__ */ R(t), "iterate", va), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ R(n), i = /* @__PURE__ */ R(t);
			return e || (Ci(t, i) && xa(r, "has", t), xa(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ R(a), s = t ? Ua : e ? mo : po;
			return !e && xa(o, "iterate", va), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return ei(n, e ? {
		add: Ka("add"),
		set: Ka("set"),
		delete: Ka("delete"),
		clear: Ka("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ R(this), r = Wa(n), i = /* @__PURE__ */ R(e), a = !t && !/* @__PURE__ */ lo(e) && !/* @__PURE__ */ co(e) ? i : e;
			return r.has.call(n, a) || Ci(e, a) && r.has.call(n, e) || Ci(i, a) && r.has.call(n, i) || (n.add(a), Sa(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ lo(n) && !/* @__PURE__ */ co(n) && (n = /* @__PURE__ */ R(n));
			let r = /* @__PURE__ */ R(this), { has: i, get: a } = Wa(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ R(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? Ci(n, s) && Sa(r, "set", e, n, s) : Sa(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ R(this), { has: n, get: r } = Wa(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ R(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Sa(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ R(this), t = e.size !== 0, n = e.clear();
			return t && Sa(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Ga(r, e, t);
	}), n;
}
function Ja(e, t) {
	let n = qa(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(j(n, r) && r in t ? n : t, r, i);
}
var Ya = { get: /* @__PURE__ */ Ja(!1, !1) }, Xa = { get: /* @__PURE__ */ Ja(!1, !0) }, Za = { get: /* @__PURE__ */ Ja(!0, !1) }, Qa = /* @__PURE__ */ new WeakMap(), $a = /* @__PURE__ */ new WeakMap(), eo = /* @__PURE__ */ new WeakMap(), to = /* @__PURE__ */ new WeakMap();
function no(e) {
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
function ro(e) {
	return /* @__PURE__ */ co(e) ? e : oo(e, !1, Ba, Ya, Qa);
}
// @__NO_SIDE_EFFECTS__
function io(e) {
	return oo(e, !1, Ha, Xa, $a);
}
// @__NO_SIDE_EFFECTS__
function ao(e) {
	return oo(e, !0, Va, Za, eo);
}
function oo(e, t, n, r, i) {
	if (!P(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = no(fi(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function so(e) {
	return /* @__PURE__ */ co(e) ? /* @__PURE__ */ so(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function co(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function lo(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function uo(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function R(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ R(t) : e;
}
function fo(e) {
	return !j(e, "__v_skip") && Object.isExtensible(e) && Ti(e, "__v_skip", !0), e;
}
var po = (e) => P(e) ? /* @__PURE__ */ ro(e) : e, mo = (e) => P(e) ? /* @__PURE__ */ ao(e) : e;
// @__NO_SIDE_EFFECTS__
function z(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function B(e) {
	return ho(e, !1);
}
function ho(e, t) {
	return /* @__PURE__ */ z(e) ? e : new go(e, t);
}
var go = class {
	constructor(e, t) {
		this.dep = new ha(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ R(e), this._value = t ? e : po(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ lo(e) || /* @__PURE__ */ co(e);
		e = n ? e : /* @__PURE__ */ R(e), Ci(e, t) && (this._rawValue = e, this._value = n ? e : po(e), this.dep.trigger());
	}
};
function V(e) {
	return /* @__PURE__ */ z(e) ? e.value : e;
}
var _o = {
	get: (e, t, n) => t === "__v_raw" ? e : V(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ z(i) && !/* @__PURE__ */ z(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function vo(e) {
	return /* @__PURE__ */ so(e) ? e : new Proxy(e, _o);
}
// @__NO_SIDE_EFFECTS__
function yo(e) {
	let t = M(e) ? Array(e.length) : {};
	for (let n in e) t[n] = Co(e, n);
	return t;
}
var bo = class {
	constructor(e, t, n) {
		this._object = e, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0, this._key = si(t) ? t : String(t), this._raw = /* @__PURE__ */ R(e);
		let r = !0, i = e;
		if (!M(e) || si(this._key) || !mi(this._key)) do
			r = !/* @__PURE__ */ uo(i) || /* @__PURE__ */ lo(i);
		while (r && (i = i.__v_raw));
		this._shallow = r;
	}
	get value() {
		let e = this._object[this._key];
		return this._shallow && (e = V(e)), this._value = e === void 0 ? this._defaultValue : e;
	}
	set value(e) {
		if (this._shallow && /* @__PURE__ */ z(this._raw[this._key])) {
			let t = this._object[this._key];
			if (/* @__PURE__ */ z(t)) {
				t.value = e;
				return;
			}
		}
		this._object[this._key] = e;
	}
	get dep() {
		return Ca(this._raw, this._key);
	}
}, xo = class {
	constructor(e) {
		this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
};
// @__NO_SIDE_EFFECTS__
function So(e, t, n) {
	return /* @__PURE__ */ z(e) ? e : N(e) ? new xo(e) : P(e) && arguments.length > 1 ? Co(e, t, n) : /* @__PURE__ */ B(e);
}
function Co(e, t, n) {
	return new bo(e, t, n);
}
var wo = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new ha(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = pa - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && L !== this) return $i(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return aa(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function To(e, t, n = !1) {
	let r, i;
	return N(e) ? r = e : (r = e.get, i = e.set), new wo(r, i, n);
}
var Eo = {}, Do = /* @__PURE__ */ new WeakMap(), Oo = void 0;
function ko(e, t = !1, n = Oo) {
	if (n) {
		let t = Do.get(n);
		t || Do.set(n, t = []), t.push(e);
	}
}
function Ao(e, t, n = A) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ lo(e) || i === !1 || i === 0 ? jo(e, 1) : jo(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ z(e) ? (d = () => e.value, m = /* @__PURE__ */ lo(e)) : /* @__PURE__ */ so(e) ? (d = () => l(e), m = !0) : M(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ so(e) || /* @__PURE__ */ lo(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ z(e)) return e.value;
		if (/* @__PURE__ */ so(e)) return l(e);
		if (N(e)) return c ? c(e, 2) : e();
	})) : d = N(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			ua();
			try {
				f();
			} finally {
				da();
			}
		}
		let t = Oo;
		Oo = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			Oo = t;
		}
	} : Xr, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => jo(e(), t);
	}
	let g = Ki(), _ = () => {
		u.stop(), g && g.active && ti(g.effects, u);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return _(), n;
		};
	}
	let v = h ? Array(e.length).fill(Eo) : Eo, y = (e) => {
		if (!(!(u.flags & 1) || !u.dirty && !e)) if (t) {
			let n = u.run();
			if (e || i || m || (h ? n.some((e, t) => Ci(e, v[t])) : Ci(n, v))) {
				f && f();
				let e = Oo;
				Oo = u;
				try {
					let e = [
						n,
						v === Eo ? void 0 : h && v[0] === Eo ? [] : v,
						p
					];
					v = n, c ? c(t, 3, e) : t(...e);
				} finally {
					Oo = e;
				}
			}
		} else u.run();
	};
	return s && s(y), u = new Yi(d), u.scheduler = o ? () => o(y, !1) : y, p = (e) => ko(e, !1, u), f = u.onStop = () => {
		let e = Do.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			Do.delete(u);
		}
	}, t ? r ? y(!0) : v = u.run() : o ? o(y.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function jo(e, t = Infinity, n) {
	if (t <= 0 || !P(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ z(e)) jo(e.value, t, n);
	else if (M(e)) for (let r = 0; r < e.length; r++) jo(e[r], t, n);
	else if (ii(e) || ri(e)) e.forEach((e) => {
		jo(e, t, n);
	});
	else if (pi(e)) {
		for (let r in e) jo(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && jo(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Mo(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Po(e, t, n);
	}
}
function No(e, t, n, r) {
	if (N(e)) {
		let i = Mo(e, t, n, r);
		return i && ci(i) && i.catch((e) => {
			Po(e, t, n);
		}), i;
	}
	if (M(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(No(e[a], t, n, r));
		return i;
	}
}
function Po(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || A;
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
			ua(), Mo(a, null, 10, [
				e,
				i,
				o
			]), da();
			return;
		}
	}
	Fo(e, n, i, r, o);
}
function Fo(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var Io = [], Lo = -1, Ro = [], zo = null, Bo = 0, Vo = /* @__PURE__ */ Promise.resolve(), Ho = null;
function Uo(e) {
	let t = Ho || Vo;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Wo(e) {
	let t = Lo + 1, n = Io.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Io[r], a = Xo(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Go(e) {
	if (!(e.flags & 1)) {
		let t = Xo(e), n = Io[Io.length - 1];
		!n || !(e.flags & 2) && t >= Xo(n) ? Io.push(e) : Io.splice(Wo(t), 0, e), e.flags |= 1, Ko();
	}
}
function Ko() {
	Ho ||= Vo.then(Zo);
}
function qo(e) {
	M(e) ? Ro.push(...e) : zo && e.id === -1 ? zo.splice(Bo + 1, 0, e) : e.flags & 1 || (Ro.push(e), e.flags |= 1), Ko();
}
function Jo(e, t, n = Lo + 1) {
	for (; n < Io.length; n++) {
		let t = Io[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			Io.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function Yo(e) {
	if (Ro.length) {
		let e = [...new Set(Ro)].sort((e, t) => Xo(e) - Xo(t));
		if (Ro.length = 0, zo) {
			zo.push(...e);
			return;
		}
		for (zo = e, Bo = 0; Bo < zo.length; Bo++) {
			let e = zo[Bo];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		zo = null, Bo = 0;
	}
}
var Xo = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Zo(e) {
	try {
		for (Lo = 0; Lo < Io.length; Lo++) {
			let e = Io[Lo];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Mo(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Lo < Io.length; Lo++) {
			let e = Io[Lo];
			e && (e.flags &= -2);
		}
		Lo = -1, Io.length = 0, Yo(e), Ho = null, (Io.length || Ro.length) && Zo(e);
	}
}
var Qo = null, $o = null;
function es(e) {
	let t = Qo;
	return Qo = e, $o = e && e.type.__scopeId || null, t;
}
function H(e, t = Qo, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && dl(-1);
		let i = es(t), a;
		try {
			a = e(...n);
		} finally {
			es(i), r._d && dl(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function ts(e, t) {
	if (Qo === null) return e;
	let n = Gl(Qo), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = A] = t[e];
		i && (N(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && jo(a), r.push({
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
function ns(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (ua(), No(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), da());
	}
}
function rs(e, t) {
	if (kl) {
		let n = kl.provides, r = kl.parent && kl.parent.provides;
		r === n && (n = kl.provides = Object.create(r)), n[e] = t;
	}
}
function is(e, t, n = !1) {
	let r = Al();
	if (r || mc) {
		let i = mc ? mc._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && N(t) ? t.call(r && r.proxy) : t;
	}
}
function as() {
	return !!(Al() || mc);
}
var os = /* @__PURE__ */ Symbol.for("v-scx"), ss = () => is(os);
function cs(e, t, n) {
	return ls(e, t, n);
}
function ls(e, t, n = A) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = ei({}, n), c = t && r || !t && a !== "post", l;
	if (Il) {
		if (a === "sync") {
			let e = ss();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = Xr, e.resume = Xr, e.pause = Xr, e;
		}
	}
	let u = kl;
	s.call = (e, t, n) => No(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		Gc(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : Go(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = Ao(e, t, s);
	return Il && (l ? l.push(f) : c && f()), f;
}
function us(e, t, n) {
	let r = this.proxy, i = oi(e) ? e.includes(".") ? ds(r, e) : () => r[e] : e.bind(r, r), a;
	N(t) ? a = t : (a = t.handler, n = t);
	let o = Nl(this), s = ls(i, a.bind(r), n);
	return o(), s;
}
function ds(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var fs = /* @__PURE__ */ Symbol("_vte"), ps = (e) => e.__isTeleport, ms = /* @__PURE__ */ Symbol("_leaveCb");
function hs(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, hs(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function U(e, t) {
	return N(e) ? /* @__PURE__ */ ei({ name: e.name }, t, { setup: e }) : e;
}
function gs() {
	let e = Al();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function _s(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function vs(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var ys = /* @__PURE__ */ new WeakMap();
function bs(e, t, n, r, i = !1) {
	if (M(e)) {
		e.forEach((e, a) => bs(e, t && (M(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Ss(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && bs(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Gl(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === A ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ R(d), p = d === A ? Zr : (e) => vs(u, e) ? !1 : j(f, e), m = (e, t) => !(t && vs(u, t));
	if (l != null && l !== c) {
		if (xs(t), oi(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ z(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (N(c)) Mo(c, s, 12, [o, u]);
	else {
		let t = oi(c), r = /* @__PURE__ */ z(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) M(n) && ti(n, a);
					else if (M(n)) n.includes(a) || n.push(a);
					else if (t) u[c] = [a], p(c) && (d[c] = u[c]);
					else {
						let t = [a];
						m(c, e.k) && (c.value = t), e.k && (u[e.k] = t);
					}
				} else t ? (u[c] = o, p(c) && (d[c] = o)) : r && (m(c, e.k) && (c.value = o), e.k && (u[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), ys.delete(e);
				};
				t.id = -1, ys.set(e, t), Gc(t, n);
			} else xs(e), s();
		}
	}
}
function xs(e) {
	let t = ys.get(e);
	t && (t.flags |= 8, ys.delete(e));
}
Oi().requestIdleCallback, Oi().cancelIdleCallback;
var Ss = (e) => !!e.type.__asyncLoader, Cs = (e) => e.type.__isKeepAlive;
function ws(e, t) {
	Es(e, "a", t);
}
function Ts(e, t) {
	Es(e, "da", t);
}
function Es(e, t, n = kl) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Os(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Cs(e.parent.vnode) && Ds(r, t, n, e), e = e.parent;
	}
}
function Ds(e, t, n, r) {
	let i = Os(t, e, r, !0);
	Fs(() => {
		ti(r[t], i);
	}, n);
}
function Os(e, t, n = kl, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			ua();
			let i = Nl(n), a = No(t, n, e, r);
			return i(), da(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var ks = (e) => (t, n = kl) => {
	(!Il || e === "sp") && Os(e, (...e) => t(...e), n);
}, As = ks("bm"), js = ks("m"), Ms = ks("bu"), Ns = ks("u"), Ps = ks("bum"), Fs = ks("um"), Is = ks("sp"), Ls = ks("rtg"), Rs = ks("rtc");
function zs(e, t = kl) {
	Os("ec", e, t);
}
var Bs = /* @__PURE__ */ Symbol.for("v-ndc");
function W(e, t, n, r) {
	let i, a = n && n[r], o = M(e);
	if (o || oi(e)) {
		let n = o && /* @__PURE__ */ so(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ lo(e), s = /* @__PURE__ */ co(e), e = Ta(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? mo(po(e[n])) : po(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (P(e)) if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
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
function Vs(e, t, n = {}, r, i) {
	if (Qo.ce || Qo.parent && Ss(Qo.parent) && Qo.parent.ce) {
		let e = Object.keys(n).length > 0;
		return t !== "default" && (n.name = t), K(), J(G, null, [X("slot", n, r && r())], e ? -2 : 64);
	}
	let a = e[t];
	a && a._c && (a._d = !1), K();
	let o = a && Hs(a(n)), s = n.key || o && o.key, c = J(G, { key: (s && !si(s) ? s : `_${t}`) + (!o && r ? "_fb" : "") }, o || (r ? r() : []), o && e._ === 1 ? 64 : -2);
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), a && a._c && (a._d = !0), c;
}
function Hs(e) {
	return e.some((e) => pl(e) ? !(e.type === al || e.type === G && !Hs(e.children)) : !0) ? e : null;
}
var Us = (e) => e ? Fl(e) ? Gl(e) : Us(e.parent) : null, Ws = /* @__PURE__ */ ei(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Us(e.parent),
	$root: (e) => Us(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => tc(e),
	$forceUpdate: (e) => e.f ||= () => {
		Go(e.update);
	},
	$nextTick: (e) => e.n ||= Uo.bind(e.proxy),
	$watch: (e) => us.bind(e)
}), Gs = (e, t) => e !== A && !e.__isScriptSetup && j(e, t), Ks = {
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
			else if (Gs(r, t)) return o[t] = 1, r[t];
			else if (i !== A && j(i, t)) return o[t] = 2, i[t];
			else if (j(a, t)) return o[t] = 3, a[t];
			else if (n !== A && j(n, t)) return o[t] = 4, n[t];
			else Xs && (o[t] = 0);
		}
		let l = Ws[t], u, d;
		if (l) return t === "$attrs" && xa(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== A && j(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, j(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Gs(i, t) ? (i[t] = n, !0) : r !== A && j(r, t) ? (r[t] = n, !0) : j(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || e !== A && s[0] !== "$" && j(e, s) || Gs(t, s) || j(a, s) || j(r, s) || j(Ws, s) || j(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? j(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function qs() {
	return Js("useSlots").slots;
}
function Js(e) {
	let t = Al();
	return t.setupContext ||= Wl(t);
}
function Ys(e) {
	return M(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var Xs = !0;
function Zs(e) {
	let t = tc(e), n = e.proxy, r = e.ctx;
	Xs = !1, t.beforeCreate && $s(t.beforeCreate, e, "bc");
	let { data: i, computed: a, methods: o, watch: s, provide: c, inject: l, created: u, beforeMount: d, mounted: f, beforeUpdate: p, updated: m, activated: h, deactivated: g, beforeDestroy: _, beforeUnmount: v, destroyed: y, unmounted: b, render: x, renderTracked: S, renderTriggered: C, errorCaptured: w, serverPrefetch: ee, expose: te, inheritAttrs: ne, components: re, directives: T, filters: ie } = t;
	if (l && Qs(l, r, null), o) for (let e in o) {
		let t = o[e];
		N(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		P(t) && (e.data = /* @__PURE__ */ ro(t));
	}
	if (Xs = !0, a) for (let e in a) {
		let t = a[e], i = $({
			get: N(t) ? t.bind(n, n) : N(t.get) ? t.get.bind(n, n) : Xr,
			set: !N(t) && N(t.set) ? t.set.bind(n) : Xr
		});
		Object.defineProperty(r, e, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		});
	}
	if (s) for (let e in s) ec(s[e], r, n, e);
	if (c) {
		let e = N(c) ? c.call(n) : c;
		Reflect.ownKeys(e).forEach((t) => {
			rs(t, e[t]);
		});
	}
	u && $s(u, e, "c");
	function E(e, t) {
		M(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (E(As, d), E(js, f), E(Ms, p), E(Ns, m), E(ws, h), E(Ts, g), E(zs, w), E(Rs, S), E(Ls, C), E(Ps, v), E(Fs, b), E(Is, ee), M(te)) if (te.length) {
		let t = e.exposed ||= {};
		te.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	x && e.render === Xr && (e.render = x), ne != null && (e.inheritAttrs = ne), re && (e.components = re), T && (e.directives = T), ee && _s(e);
}
function Qs(e, t, n = Xr) {
	M(e) && (e = oc(e));
	for (let n in e) {
		let r = e[n], i;
		i = P(r) ? "default" in r ? is(r.from || n, r.default, !0) : is(r.from || n) : is(r), /* @__PURE__ */ z(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function $s(e, t, n) {
	No(M(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function ec(e, t, n, r) {
	let i = r.includes(".") ? ds(n, r) : () => n[r];
	if (oi(e)) {
		let n = t[e];
		N(n) && cs(i, n);
	} else if (N(e)) cs(i, e.bind(n));
	else if (P(e)) if (M(e)) e.forEach((e) => ec(e, t, n, r));
	else {
		let r = N(e.handler) ? e.handler.bind(n) : t[e.handler];
		N(r) && cs(i, r, e);
	}
}
function tc(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => nc(c, e, o, !0)), nc(c, t, o)), P(t) && a.set(t, c), c;
}
function nc(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && nc(e, a, n, !0), i && i.forEach((t) => nc(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = rc[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var rc = {
	data: ic,
	props: lc,
	emits: lc,
	methods: cc,
	computed: cc,
	beforeCreate: sc,
	created: sc,
	beforeMount: sc,
	mounted: sc,
	beforeUpdate: sc,
	updated: sc,
	beforeDestroy: sc,
	beforeUnmount: sc,
	destroyed: sc,
	unmounted: sc,
	activated: sc,
	deactivated: sc,
	errorCaptured: sc,
	serverPrefetch: sc,
	components: cc,
	directives: cc,
	watch: uc,
	provide: ic,
	inject: ac
};
function ic(e, t) {
	return t ? e ? function() {
		return ei(N(e) ? e.call(this, this) : e, N(t) ? t.call(this, this) : t);
	} : t : e;
}
function ac(e, t) {
	return cc(oc(e), oc(t));
}
function oc(e) {
	if (M(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function sc(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function cc(e, t) {
	return e ? ei(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function lc(e, t) {
	return e ? M(e) && M(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : ei(/* @__PURE__ */ Object.create(null), Ys(e), Ys(t ?? {})) : t;
}
function uc(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = ei(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = sc(e[r], t[r]);
	return n;
}
function dc() {
	return {
		app: null,
		config: {
			isNativeTag: Zr,
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
var fc = 0;
function pc(e, t) {
	return function(n, r = null) {
		N(n) || (n = ei({}, n)), r != null && !P(r) && (r = null);
		let i = dc(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: fc++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: ql,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && N(e.install) ? (a.add(e), e.install(c, ...t)) : N(e) && (a.add(e), e(c, ...t))), c;
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
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Gl(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (No(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = mc;
				mc = c;
				try {
					return e();
				} finally {
					mc = t;
				}
			}
		};
		return c;
	};
}
var mc = null, hc = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${vi(t)}Modifiers`] || e[`${bi(t)}Modifiers`];
function gc(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || A, i = n, a = t.startsWith("update:"), o = a && hc(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => oi(e) ? e.trim() : e)), o.number && (i = n.map(Ei)));
	let s, c = r[s = Si(t)] || r[s = Si(vi(t))];
	!c && a && (c = r[s = Si(bi(t))]), c && No(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, No(l, e, 6, i);
	}
}
var _c = /* @__PURE__ */ new WeakMap();
function vc(e, t, n = !1) {
	let r = n ? _c : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!N(e)) {
		let r = (e) => {
			let n = vc(e, t, !0);
			n && (s = !0, ei(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (P(e) && r.set(e, null), null) : (M(a) ? a.forEach((e) => o[e] = null) : ei(o, a), P(e) && r.set(e, o), o);
}
function yc(e, t) {
	return !e || !Qr(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), j(e, t[0].toLowerCase() + t.slice(1)) || j(e, bi(t)) || j(e, t));
}
function bc(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = es(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = xl(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = xl(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : xc(s);
		}
	} catch (t) {
		sl.length = 0, Po(t, e, 1), _ = X(al);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some($r) && (v = Sc(v, a)), y = yl(y, v, !1, !0));
	}
	return n.dirs && (y = yl(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && hs(y, n.transition), _ = y, es(g), _;
}
var xc = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || Qr(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Sc = (e, t) => {
	let n = {};
	for (let r in e) (!$r(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Cc(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? wc(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Tc(o, r, n) && !yc(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? o ? wc(r, o, l) : !0 : !!o;
	return !1;
}
function wc(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Tc(t, e, a) && !yc(n, a)) return !0;
	}
	return !1;
}
function Tc(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && P(r) && P(i) ? !Ri(r, i) : r !== i;
}
function Ec({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Dc = {}, Oc = () => Object.create(Dc), kc = (e) => Object.getPrototypeOf(e) === Dc;
function Ac(e, t, n, r = !1) {
	let i = {}, a = Oc();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Mc(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ io(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function jc(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ R(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (yc(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) if (j(a, o)) u !== a[o] && (a[o] = u, l = !0);
				else {
					let t = vi(o);
					i[t] = Nc(c, s, t, u, e, !1);
				}
				else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Mc(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !j(t, a) && ((r = bi(a)) === a || !j(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Nc(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !j(t, e)) && (delete a[e], l = !0);
	}
	l && Sa(e.attrs, "set", "");
}
function Mc(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (hi(c)) continue;
		let l = t[c], u;
		i && j(i, u = vi(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : yc(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ R(n), r = s || A;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Nc(i, t, s, r[s], e, !j(r, s));
		}
	}
	return o;
}
function Nc(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = j(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && N(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Nl(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === bi(n)) && (r = !0));
	}
	return r;
}
var Pc = /* @__PURE__ */ new WeakMap();
function Fc(e, t, n = !1) {
	let r = n ? Pc : t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [], c = !1;
	if (!N(e)) {
		let r = (e) => {
			c = !0;
			let [n, r] = Fc(e, t, !0);
			ei(o, n), r && s.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!a && !c) return P(e) && r.set(e, Yr), Yr;
	if (M(a)) for (let e = 0; e < a.length; e++) {
		let t = vi(a[e]);
		Ic(t) && (o[t] = A);
	}
	else if (a) for (let e in a) {
		let t = vi(e);
		if (Ic(t)) {
			let n = a[e], r = o[t] = M(n) || N(n) ? { type: n } : ei({}, n), i = r.type, c = !1, l = !0;
			if (M(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = N(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				} else n === "String" && (l = !1);
			}
			else c = N(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || j(r, "default")) && s.push(t);
		}
	}
	let l = [o, s];
	return P(e) && r.set(e, l), l;
}
function Ic(e) {
	return e[0] !== "$" && !hi(e);
}
var Lc = (e) => e === "_" || e === "_ctx" || e === "$stable", Rc = (e) => M(e) ? e.map(xl) : [xl(e)], zc = (e, t, n) => {
	if (t._n) return t;
	let r = H((...e) => Rc(t(...e)), n);
	return r._c = !1, r;
}, Bc = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Lc(n)) continue;
		let i = e[n];
		if (N(i)) t[n] = zc(n, i, r);
		else if (i != null) {
			let e = Rc(i);
			t[n] = () => e;
		}
	}
}, Vc = (e, t) => {
	let n = Rc(t);
	e.slots.default = () => n;
}, Hc = (e, t, n) => {
	for (let r in t) (n || !Lc(r)) && (e[r] = t[r]);
}, Uc = (e, t, n) => {
	let r = e.slots = Oc();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Hc(r, t, n), n && Ti(r, "_", e, !0)) : Bc(t, r);
	} else t && Vc(e, t);
}, Wc = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = A;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Hc(i, t, n) : (a = !t.$stable, Bc(t, i)), o = t;
	} else t && (Vc(e, t), o = { default: 1 });
	if (a) for (let e in i) !Lc(e) && o[e] == null && delete i[e];
}, Gc = rl;
function Kc(e) {
	return qc(e);
}
function qc(e, t) {
	let n = Oi();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = Xr, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ml(e, t) && (r = me(e), le(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case il:
				g(e, t, n, r);
				break;
			case al:
				_(e, t, n, r);
				break;
			case ol:
				e ?? v(t, n, r, o);
				break;
			case G:
				re(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? x(e, t, n, r, i, a, o, s, c) : d & 6 ? T(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, _e);
		}
		u != null && i ? bs(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && bs(e.ref, null, a, e, !0);
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
				n && n._beginPatch(), ee(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, S = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && w(e.children, f, null, i, s, Jc(e, c), l, d), _ && ns(e, null, i, "created"), C(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !hi(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && Tl(p, i, e);
		}
		_ && ns(e, null, i, "beforeMount");
		let v = Xc(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Gc(() => {
			try {
				p && Tl(p, i, e), v && g.enter(f), _ && ns(e, null, i, "mounted");
			} finally {}
		}, s);
	}, C = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || nl(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				C(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, w = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) h(null, e[l] = s ? Sl(e[l]) : xl(e[l]), t, n, r, i, a, o, s);
	}, ee = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || A, m = t.props || A, h;
		if (n && Yc(n, !1), (h = m.onVnodeBeforeUpdate) && Tl(h, n, t, e), f && ns(t, e, n, "beforeUpdate"), n && Yc(n, !0), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? te(e.dynamicChildren, d, c, n, r, Jc(t, i), o) : s || O(e, t, c, null, n, r, Jc(t, i), o, !1), l > 0) {
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
		((h = m.onVnodeUpdated) || f) && Gc(() => {
			h && Tl(h, n, t, e), f && ns(t, e, n, "updated");
		}, r);
	}, te = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s];
			h(c, l, c.el && (c.type === G || !ml(c, l) || c.shapeFlag & 198) ? d(c.el) : n, null, r, i, a, o, !0);
		}
	}, ne = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== A) for (let o in t) !hi(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (hi(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, re = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), w(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (te(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Zc(e, t, !0)) : O(e, t, n, f, a, o, c, l, u);
	}, T = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ie(t, n, r, i, a, o, c) : E(e, t, c);
	}, ie = (e, t, n, r, i, a, o) => {
		let s = e.component = Ol(e, r, i);
		if (Cs(e) && (s.ctx.renderer = _e), Ll(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ae, o), !e.el) {
				let r = s.subTree = X(al);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else ae(s, e, t, n, i, a, o);
	}, E = (e, t, n) => {
		let r = t.component = e.component;
		if (Cc(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			D(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, ae = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = $c(e);
					if (n) {
						t && (t.el = c.el, D(e, t, o)), n.asyncDep.then(() => {
							Gc(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				Yc(e, !1), t ? (t.el = c.el, D(e, t, o)) : t = c, n && wi(n), (f = t.props && t.props.onVnodeBeforeUpdate) && Tl(f, s, t, c), Yc(e, !0);
				let p = bc(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), me(m), e, i, a), t.el = p.el, u === null && Ec(e, p.el), r && Gc(r, i), (f = t.props && t.props.onVnodeUpdated) && Gc(() => Tl(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Ss(t);
				if (Yc(e, !1), l && wi(l), !m && (o = c && c.onVnodeBeforeMount) && Tl(o, d, t), Yc(e, !0), s && ye) {
					let t = () => {
						e.subTree = bc(e), ye(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = bc(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Gc(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Gc(() => Tl(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Ss(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Gc(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Yi(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Go(u), Yc(e, !0), l();
	}, D = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, jc(e, t.props, r, n), Wc(e, t.children, n), ua(), Jo(e), da();
	}, O = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				se(l, f, n, r, i, a, o, s, c);
				return;
			} else if (p & 256) {
				oe(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && pe(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? se(l, f, n, r, i, a, o, s, c) : pe(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && w(f, n, r, i, a, o, s, c));
	}, oe = (e, t, n, r, i, a, o, s, c) => {
		e ||= Yr, t ||= Yr;
		let l = e.length, u = t.length, d = Math.min(l, u), f;
		for (f = 0; f < d; f++) {
			let r = t[f] = c ? Sl(t[f]) : xl(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? pe(e, i, a, !0, !1, d) : w(t, n, r, i, a, o, s, c, d);
	}, se = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? Sl(t[l]) : xl(t[l]);
			if (ml(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? Sl(t[f]) : xl(t[f]);
			if (ml(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? Sl(t[l]) : xl(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) le(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? Sl(t[l]) : xl(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, v = 0, y = f - m + 1, b = !1, x = 0, S = Array(y);
			for (l = 0; l < y; l++) S[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (v >= y) {
					le(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (S[_ - m] === 0 && ml(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? le(r, i, a, !0) : (S[u - m] = l + 1, u >= x ? x = u : b = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let C = b ? Qc(S) : Yr;
			for (_ = C.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || tl(f) : r;
				S[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : b && (_ < 0 || l !== C[_] ? ce(d, n, p, 2) : _--);
			}
		}
	}, ce = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			ce(e.component.subTree, t, n, a);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, a);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, _e);
			return;
		}
		if (c === G) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) ce(u[e], t, n, a);
			r(e.anchor, t, n);
			return;
		}
		if (c === ol) {
			y(e, t, n);
			return;
		}
		if (a !== 2 && d & 1 && l) if (a === 0) l.persisted && !s[ms] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Gc(() => l.enter(s), o));
		else {
			let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? i(s) : r(s, t, n);
			}, d = () => {
				let e = s._isLeaving || !!s[ms];
				s._isLeaving && s[ms](!0), l.persisted && !e ? u() : a(s, () => {
					u(), c && c();
				});
			};
			o ? o(s, u, d) : d();
		}
		else r(s, t, n);
	}, le = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (ua(), bs(s, null, n, e, !0), da()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Ss(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Tl(_, t, e), u & 6) fe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && ns(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, _e, r) : l && !l.hasOnce && (a !== G || d > 0 && d & 64) ? pe(l, t, n, !1, !0) : (a === G && d & 384 || !i && u & 16) && pe(c, t, n), r && ue(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Gc(() => {
			_ && Tl(_, t, e), h && ns(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ue = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e;
		if (t === G) {
			de(n, r);
			return;
		}
		if (t === ol) {
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
	}, de = (e, t) => {
		let n;
		for (; e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, fe = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		el(c), el(l), r && wi(r), i.stop(), a && (a.flags |= 8, le(o, e, t, n)), s && Gc(s, t), Gc(() => {
			e.isUnmounted = !0;
		}, t);
	}, pe = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) le(e[o], t, n, r, i);
	}, me = (e) => {
		if (e.shapeFlag & 6) return me(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[fs];
		return n ? f(n) : t;
	}, he = !1, ge = (e, t, n) => {
		let r;
		e == null ? t._vnode && (le(t._vnode, null, null, !0), r = t._vnode.component) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e, he ||= (he = !0, Jo(r), Yo(), !1);
	}, _e = {
		p: h,
		um: le,
		m: ce,
		r: ue,
		mt: ie,
		mc: w,
		pc: O,
		pbc: te,
		n: me,
		o: e
	}, ve, ye;
	return t && ([ve, ye] = t(_e)), {
		render: ge,
		hydrate: ve,
		createApp: pc(ge, ve)
	};
}
function Jc({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Yc({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Xc(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Zc(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (M(r) && M(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Sl(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Zc(t, a)), a.type === il && (a.patchFlag === -1 && (a = i[e] = Sl(a)), a.el = t.el), a.type === al && !a.el && (a.el = t.el);
	}
}
function Qc(e) {
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
function $c(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : $c(t);
}
function el(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function tl(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? tl(t.subTree) : null;
}
var nl = (e) => e.__isSuspense;
function rl(e, t) {
	t && t.pendingBranch ? M(e) ? t.effects.push(...e) : t.effects.push(e) : qo(e);
}
var G = /* @__PURE__ */ Symbol.for("v-fgt"), il = /* @__PURE__ */ Symbol.for("v-txt"), al = /* @__PURE__ */ Symbol.for("v-cmt"), ol = /* @__PURE__ */ Symbol.for("v-stc"), sl = [], cl = null;
function K(e = !1) {
	sl.push(cl = e ? null : []);
}
function ll() {
	sl.pop(), cl = sl[sl.length - 1] || null;
}
var ul = 1;
function dl(e, t = !1) {
	ul += e, e < 0 && cl && t && (cl.hasOnce = !0);
}
function fl(e) {
	return e.dynamicChildren = ul > 0 ? cl || Yr : null, ll(), ul > 0 && cl && cl.push(e), e;
}
function q(e, t, n, r, i, a) {
	return fl(Y(e, t, n, r, i, a, !0));
}
function J(e, t, n, r, i) {
	return fl(X(e, t, n, r, i, !0));
}
function pl(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ml(e, t) {
	return e.type === t.type && e.key === t.key;
}
var hl = ({ key: e }) => e ?? null, gl = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : oi(e) || /* @__PURE__ */ z(e) || N(e) ? {
	i: Qo,
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
		key: t && hl(t),
		ref: t && gl(t),
		scopeId: $o,
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
		ctx: Qo
	};
	return s ? (Cl(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= oi(n) ? 8 : 16), ul > 0 && !o && cl && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && cl.push(c), c;
}
var X = _l;
function _l(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Bs) && (e = al), pl(e)) {
		let r = yl(e, t, !0);
		return n && Cl(r, n), ul > 0 && !a && cl && (r.shapeFlag & 6 ? cl[cl.indexOf(e)] = r : cl.push(r)), r.patchFlag = -2, r;
	}
	if (Kl(e) && (e = e.__vccOpts), t) {
		t = vl(t);
		let { class: e, style: n } = t;
		e && !oi(e) && (t.class = F(e)), P(n) && (/* @__PURE__ */ uo(n) && !M(n) && (n = ei({}, n)), t.style = ki(n));
	}
	let o = oi(e) ? 1 : nl(e) ? 128 : ps(e) ? 64 : P(e) ? 4 : N(e) ? 2 : 0;
	return Y(e, t, n, r, i, o, a, !0);
}
function vl(e) {
	return e ? /* @__PURE__ */ uo(e) || kc(e) ? ei({}, e) : e : null;
}
function yl(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? wl(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && hl(l),
		ref: t && t.ref ? n && a ? M(a) ? a.concat(gl(t)) : [a, gl(t)] : gl(t) : a,
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
		ssContent: e.ssContent && yl(e.ssContent),
		ssFallback: e.ssFallback && yl(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && hs(u, c.clone(u)), u;
}
function Z(e = " ", t = 0) {
	return X(il, null, e, t);
}
function bl(e, t) {
	let n = X(ol, null, e);
	return n.staticCount = t, n;
}
function Q(e = "", t = !1) {
	return t ? (K(), J(al, null, e)) : X(al, null, e);
}
function xl(e) {
	return e == null || typeof e == "boolean" ? X(al) : M(e) ? X(G, null, e.slice()) : pl(e) ? Sl(e) : X(il, null, String(e));
}
function Sl(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : yl(e);
}
function Cl(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (M(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), Cl(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !kc(t) ? t._ctx = Qo : r === 3 && Qo && (Qo.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else N(t) ? (t = {
		default: t,
		_ctx: Qo
	}, n = 32) : (t = String(t), r & 64 ? (n = 16, t = [Z(t)]) : n = 8);
	e.children = t, e.shapeFlag |= n;
}
function wl(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = F([t.class, r.class]));
		else if (e === "style") t.style = ki([t.style, r.style]);
		else if (Qr(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(M(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !$r(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Tl(e, t, n, r = null) {
	No(e, t, 7, [n, r]);
}
var El = dc(), Dl = 0;
function Ol(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || El, a = {
		uid: Dl++,
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
		scope: new Wi(!0),
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
		propsOptions: Fc(r, i),
		emitsOptions: vc(r, i),
		emit: null,
		emitted: null,
		propsDefaults: A,
		inheritAttrs: r.inheritAttrs,
		ctx: A,
		data: A,
		props: A,
		attrs: A,
		slots: A,
		refs: A,
		setupState: A,
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = gc.bind(null, a), e.ce && e.ce(a), a;
}
var kl = null, Al = () => kl || Qo, jl, Ml;
{
	let e = Oi(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	jl = t("__VUE_INSTANCE_SETTERS__", (e) => kl = e), Ml = t("__VUE_SSR_SETTERS__", (e) => Il = e);
}
var Nl = (e) => {
	let t = kl;
	return jl(e), e.scope.on(), () => {
		e.scope.off(), jl(t);
	};
}, Pl = () => {
	kl && kl.scope.off(), jl(null);
};
function Fl(e) {
	return e.vnode.shapeFlag & 4;
}
var Il = !1;
function Ll(e, t = !1, n = !1) {
	t && Ml(t);
	let { props: r, children: i } = e.vnode, a = Fl(e);
	Ac(e, r, a, t), Uc(e, i, n || t);
	let o = a ? Rl(e, t) : void 0;
	return t && Ml(!1), o;
}
function Rl(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Ks);
	let { setup: r } = n;
	if (r) {
		ua();
		let n = e.setupContext = r.length > 1 ? Wl(e) : null, i = Nl(e), a = Mo(r, e, 0, [e.props, n]), o = ci(a);
		if (da(), i(), (o || e.sp) && !Ss(e) && _s(e), o) {
			if (a.then(Pl, Pl), t) return a.then((n) => {
				zl(e, n, t);
			}).catch((t) => {
				Po(t, e, 0);
			});
			e.asyncDep = a;
		} else zl(e, a, t);
	} else Hl(e, t);
}
function zl(e, t, n) {
	N(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : P(t) && (e.setupState = vo(t)), Hl(e, n);
}
var Bl, Vl;
function Hl(e, t, n) {
	let r = e.type;
	if (!e.render) {
		if (!t && Bl && !r.render) {
			let t = r.template || tc(e).template;
			if (t) {
				let { isCustomElement: n, compilerOptions: i } = e.appContext.config, { delimiters: a, compilerOptions: o } = r;
				r.render = Bl(t, ei(ei({
					isCustomElement: n,
					delimiters: a
				}, i), o));
			}
		}
		e.render = r.render || Xr, Vl && Vl(e);
	}
	{
		let t = Nl(e);
		ua();
		try {
			Zs(e);
		} finally {
			da(), t();
		}
	}
}
var Ul = { get(e, t) {
	return xa(e, "get", ""), e[t];
} };
function Wl(e) {
	return {
		attrs: new Proxy(e.attrs, Ul),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Gl(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(vo(fo(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Ws) return Ws[n](e);
		},
		has(e, t) {
			return t in e || t in Ws;
		}
	}) : e.proxy;
}
function Kl(e) {
	return N(e) && "__vccOpts" in e;
}
var $ = (e, t) => /* @__PURE__ */ To(e, t, Il), ql = "3.5.38", Jl = void 0, Yl = typeof window < "u" && window.trustedTypes;
if (Yl) try {
	Jl = /* @__PURE__ */ Yl.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Xl = Jl ? (e) => Jl.createHTML(e) : (e) => e, Zl = "http://www.w3.org/2000/svg", Ql = "http://www.w3.org/1998/Math/MathML", $l = typeof document < "u" ? document : null, eu = $l && /* @__PURE__ */ $l.createElement("template"), tu = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? $l.createElementNS(Zl, e) : t === "mathml" ? $l.createElementNS(Ql, e) : n ? $l.createElement(e, { is: n }) : $l.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => $l.createTextNode(e),
	createComment: (e) => $l.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => $l.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
		else {
			eu.innerHTML = Xl(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = eu.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, nu = /* @__PURE__ */ Symbol("_vtc");
function ru(e, t, n) {
	let r = e[nu];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var iu = /* @__PURE__ */ Symbol("_vod"), au = /* @__PURE__ */ Symbol("_vsh"), ou = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[iu] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : su(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), su(e, !0), r.enter(e)) : r.leave(e, () => {
			su(e, !1);
		}) : su(e, t));
	},
	beforeUnmount(e, { value: t }) {
		su(e, t);
	}
};
function su(e, t) {
	e.style.display = t ? e[iu] : "none", e[au] = !t;
}
var cu = /* @__PURE__ */ Symbol(""), lu = /(?:^|;)\s*display\s*:/;
function uu(e, t, n) {
	let r = e.style, i = oi(n), a = !1;
	if (n && !i) {
		if (t) if (oi(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? fu(r, t, "");
		}
		else for (let e in t) n[e] ?? fu(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? fu(r, i, "") : gu(e, i, !oi(t) && t ? t[i] : void 0, o) || fu(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[cu];
			e && (n += ";" + e), r.cssText = n, a = lu.test(n);
		}
	} else t && e.removeAttribute("style");
	iu in e && (e[iu] = a ? r.display : "", e[au] && (r.display = "none"));
}
var du = /\s*!important$/;
function fu(e, t, n) {
	if (M(n)) n.forEach((n) => fu(e, t, n));
	else if (n ??= "", t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = hu(e, t);
		du.test(n) ? e.setProperty(bi(r), n.replace(du, ""), "important") : e[r] = n;
	}
}
var pu = [
	"Webkit",
	"Moz",
	"ms"
], mu = {};
function hu(e, t) {
	let n = mu[t];
	if (n) return n;
	let r = vi(t);
	if (r !== "filter" && r in e) return mu[t] = r;
	r = xi(r);
	for (let n = 0; n < pu.length; n++) {
		let i = pu[n] + r;
		if (i in e) return mu[t] = i;
	}
	return t;
}
function gu(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && oi(r) && n === r;
}
var _u = "http://www.w3.org/1999/xlink";
function vu(e, t, n, r, i, a = Fi(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(_u, t.slice(6, t.length)) : e.setAttributeNS(_u, t, n) : n == null || a && !Ii(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : si(n) ? String(n) : n);
}
function yu(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Xl(n) : n);
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
		r === "boolean" ? n = Ii(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function bu(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function xu(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Su = /* @__PURE__ */ Symbol("_vei");
function Cu(e, t, n, r, i = null) {
	let a = e[Su] || (e[Su] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Tu(t);
		r ? bu(e, n, a[t] = ku(r, i), s) : o && (xu(e, n, o, s), a[t] = void 0);
	}
}
var wu = /(?:Once|Passive|Capture)$/;
function Tu(e) {
	let t;
	if (wu.test(e)) {
		t = {};
		let n;
		for (; n = e.match(wu);) e = e.slice(0, e.length - n[0].length), t[n[0].toLowerCase()] = !0;
	}
	return [e[2] === ":" ? e.slice(3) : bi(e.slice(2)), t];
}
var Eu = 0, Du = /* @__PURE__ */ Promise.resolve(), Ou = () => Eu ||= (Du.then(() => Eu = 0), Date.now());
function ku(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (M(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && No(e, t, 5, a);
			}
		} else No(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Ou(), n;
}
var Au = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, ju = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? ru(e, r, o) : t === "style" ? uu(e, n, r) : Qr(t) ? $r(t) || Cu(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Mu(e, t, r, o)) ? (yu(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && vu(e, t, r, o, a, t !== "value")) : e._isVueCE && (Nu(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !oi(r))) ? yu(e, vi(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), vu(e, t, r, o));
};
function Mu(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Au(t) && N(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Au(t) && oi(n) ? !1 : t in e;
}
function Nu(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = vi(t);
	return Array.isArray(n) ? n.some((e) => vi(e) === r) : Object.keys(n).some((e) => vi(e) === r);
}
var Pu = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return M(t) ? (e) => wi(t, e) : t;
};
function Fu(e) {
	e.target.composing = !0;
}
function Iu(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Lu = /* @__PURE__ */ Symbol("_assign");
function Ru(e, t, n) {
	return t && (e = e.trim()), n && (e = Ei(e)), e;
}
var zu = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e[Lu] = Pu(i);
		let a = r || i.props && i.props.type === "number";
		bu(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Lu](Ru(e.value, n, a));
		}), (n || a) && bu(e, "change", () => {
			e.value = Ru(e.value, n, a);
		}), t || (bu(e, "compositionstart", Fu), bu(e, "compositionend", Iu), bu(e, "change", Iu));
	},
	mounted(e, { value: t }) {
		e.value = t ?? "";
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Lu] = Pu(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? Ei(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Bu = {
	deep: !0,
	created(e, t, n) {
		e[Lu] = Pu(n), bu(e, "change", () => {
			let t = e._modelValue, n = Wu(e), r = e.checked, i = e[Lu];
			if (M(t)) {
				let e = zi(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (ii(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(Gu(e, r));
		});
	},
	mounted: Vu,
	beforeUpdate(e, t, n) {
		e[Lu] = Pu(n), Vu(e, t, n);
	}
};
function Vu(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (M(t)) i = zi(t, r.props.value) > -1;
	else if (ii(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Ri(t, Gu(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Hu = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		let i = ii(t);
		bu(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? Ei(Wu(e)) : Wu(e));
			e[Lu](e.multiple ? i ? new Set(t) : t : t[0]), e._assigning = !0, Uo(() => {
				e._assigning = !1;
			});
		}), e[Lu] = Pu(r);
	},
	mounted(e, { value: t }) {
		Uu(e, t);
	},
	beforeUpdate(e, t, n) {
		e[Lu] = Pu(n);
	},
	updated(e, { value: t }) {
		e._assigning || Uu(e, t);
	}
};
function Uu(e, t) {
	let n = e.multiple, r = M(t);
	if (!(n && !r && !ii(t))) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = Wu(a);
			if (n) if (r) {
				let e = typeof o;
				e === "string" || e === "number" ? a.selected = t.some((e) => String(e) === String(o)) : a.selected = zi(t, o) > -1;
			} else a.selected = t.has(o);
			else if (Ri(Wu(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function Wu(e) {
	return "_value" in e ? e._value : e.value;
}
function Gu(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var Ku = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], qu = {
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
	exact: (e, t) => Ku.some((n) => e[`${n}Key`] && !t.includes(n))
}, Ju = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = qu[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Yu = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, Xu = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = bi(n.key);
		if (t.some((e) => e === r || Yu[e] === r)) return e(n);
	}));
}, Zu = /* @__PURE__ */ ei({ patchProp: ju }, tu), Qu;
function $u() {
	return Qu ||= Kc(Zu);
}
var ed = ((...e) => {
	let t = $u().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = nd(e);
		if (!r) return;
		let i = t._component;
		!N(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, td(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function td(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function nd(e) {
	return oi(e) ? document.querySelector(e) : e;
}
//#endregion
//#region node_modules/pinia/dist/pinia.mjs
var rd = typeof window < "u", id, ad = (e) => id = e, od = Symbol();
function sd(e) {
	return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var cd;
(function(e) {
	e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(cd ||= {});
var ld = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null };
function ud(e, { autoBom: t = !1 } = {}) {
	return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["﻿", e], { type: e.type }) : e;
}
function dd(e, t, n) {
	let r = new XMLHttpRequest();
	r.open("GET", e), r.responseType = "blob", r.onload = function() {
		gd(r.response, t, n);
	}, r.onerror = function() {
		console.error("could not download file");
	}, r.send();
}
function fd(e) {
	let t = new XMLHttpRequest();
	t.open("HEAD", e, !1);
	try {
		t.send();
	} catch {}
	return t.status >= 200 && t.status <= 299;
}
function pd(e) {
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
var md = typeof navigator == "object" ? navigator : { userAgent: "" }, hd = /Macintosh/.test(md.userAgent) && /AppleWebKit/.test(md.userAgent) && !/Safari/.test(md.userAgent), gd = rd ? typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !hd ? _d : "msSaveOrOpenBlob" in md ? vd : yd : () => {};
function _d(e, t = "download", n) {
	let r = document.createElement("a");
	r.download = t, r.rel = "noopener", typeof e == "string" ? (r.href = e, r.origin === location.origin ? pd(r) : fd(r.href) ? dd(e, t, n) : (r.target = "_blank", pd(r))) : (r.href = URL.createObjectURL(e), setTimeout(function() {
		URL.revokeObjectURL(r.href);
	}, 4e4), setTimeout(function() {
		pd(r);
	}, 0));
}
function vd(e, t = "download", n) {
	if (typeof e == "string") if (fd(e)) dd(e, t, n);
	else {
		let t = document.createElement("a");
		t.href = e, t.target = "_blank", setTimeout(function() {
			pd(t);
		});
	}
	else navigator.msSaveOrOpenBlob(ud(e, n), t);
}
function yd(e, t, n, r) {
	if (r ||= open("", "_blank"), r && (r.document.title = r.document.body.innerText = "downloading..."), typeof e == "string") return dd(e, t, n);
	let i = e.type === "application/octet-stream", a = /constructor/i.test(String(ld.HTMLElement)) || "safari" in ld, o = /CriOS\/[\d]+/.test(navigator.userAgent);
	if ((o || i && a || hd) && typeof FileReader < "u") {
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
var { assign: bd } = Object;
function xd() {
	let e = Gi(!0), t = e.run(() => /* @__PURE__ */ B({})), n = [], r = [], i = fo({
		install(e) {
			ad(i), i._a = e, e.provide(od, i), e.config.globalProperties.$pinia = i, r.forEach((e) => n.push(e)), r = [];
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
var Sd = () => {};
function Cd(e, t, n, r = Sd) {
	e.add(t);
	let i = () => {
		e.delete(t) && r();
	};
	return !n && Ki() && qi(i), i;
}
function wd(e, ...t) {
	e.forEach((e) => {
		e(...t);
	});
}
var Td = (e) => e(), Ed = Symbol(), Dd = Symbol();
function Od(e, t) {
	e instanceof Map && t instanceof Map ? t.forEach((t, n) => e.set(n, t)) : e instanceof Set && t instanceof Set && t.forEach(e.add, e);
	for (let n in t) {
		if (!t.hasOwnProperty(n)) continue;
		let r = t[n], i = e[n];
		sd(i) && sd(r) && e.hasOwnProperty(n) && !/* @__PURE__ */ z(r) && !/* @__PURE__ */ so(r) ? e[n] = Od(i, r) : e[n] = r;
	}
	return e;
}
var kd = Symbol();
function Ad(e) {
	return !sd(e) || !Object.prototype.hasOwnProperty.call(e, kd);
}
var { assign: jd } = Object;
function Md(e) {
	return !!(/* @__PURE__ */ z(e) && e.effect);
}
function Nd(e, t, n, r) {
	let { state: i, actions: a, getters: o } = t, s = n.state.value[e], c;
	function l() {
		return s || (n.state.value[e] = i ? i() : {}), jd(/* @__PURE__ */ yo(n.state.value[e]), a, Object.keys(o || {}).reduce((t, r) => (t[r] = fo($(() => {
			ad(n);
			let t = n._s.get(e);
			return o[r].call(t, t);
		})), t), {}));
	}
	return c = Pd(e, l, t, n, r, !0), c;
}
function Pd(e, t, n = {}, r, i, a) {
	let o, s = jd({ actions: {} }, n), c = { deep: !0 }, l, u, d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), p = r.state.value[e];
	!a && !p && (r.state.value[e] = {});
	let m;
	function h(t) {
		let n;
		l = u = !1, typeof t == "function" ? (t(r.state.value[e]), n = {
			type: cd.patchFunction,
			storeId: e,
			events: void 0
		}) : (Od(r.state.value[e], t), n = {
			type: cd.patchObject,
			payload: t,
			storeId: e,
			events: void 0
		});
		let i = m = Symbol();
		Uo().then(() => {
			m === i && (l = !0);
		}), u = !0, wd(d, n, r.state.value[e]);
	}
	let g = a ? function() {
		let { state: e } = n, t = e ? e() : {};
		this.$patch((e) => {
			jd(e, t);
		});
	} : Sd;
	function _() {
		o.stop(), d.clear(), f.clear(), r._s.delete(e);
	}
	let v = (t, n = "") => {
		if (Ed in t) return t[Dd] = n, t;
		let i = function() {
			ad(r);
			let n = Array.from(arguments), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
			function s(e) {
				a.add(e);
			}
			function c(e) {
				o.add(e);
			}
			wd(f, {
				args: n,
				name: i[Dd],
				store: y,
				after: s,
				onError: c
			});
			let l;
			try {
				l = t.apply(this && this.$id === e ? this : y, n);
			} catch (e) {
				throw wd(o, e), e;
			}
			return l instanceof Promise ? l.then((e) => (wd(a, e), e)).catch((e) => (wd(o, e), Promise.reject(e))) : (wd(a, l), l);
		};
		return i[Ed] = !0, i[Dd] = n, i;
	}, y = /* @__PURE__ */ ro({
		_p: r,
		$id: e,
		$onAction: Cd.bind(null, f),
		$patch: h,
		$reset: g,
		$subscribe(t, n = {}) {
			let i = Cd(d, t, n.detached, () => a()), a = o.run(() => cs(() => r.state.value[e], (r) => {
				(n.flush === "sync" ? u : l) && t({
					storeId: e,
					type: cd.direct,
					events: void 0
				}, r);
			}, jd({}, c, n)));
			return i;
		},
		$dispose: _
	});
	r._s.set(e, y);
	let b = (r._a && r._a.runWithContext || Td)(() => r._e.run(() => (o = Gi()).run(() => t({ action: v }))));
	for (let t in b) {
		let n = b[t];
		/* @__PURE__ */ z(n) && !Md(n) || /* @__PURE__ */ so(n) ? a || (p && Ad(n) && (/* @__PURE__ */ z(n) ? n.value = p[t] : Od(n, p[t])), r.state.value[e][t] = n) : typeof n == "function" && (b[t] = v(n, t), s.actions[t] = n);
	}
	return jd(y, b), jd(/* @__PURE__ */ R(y), b), Object.defineProperty(y, "$state", {
		get: () => r.state.value[e],
		set: (e) => {
			h((t) => {
				jd(t, e);
			});
		}
	}), r._p.forEach((e) => {
		jd(y, o.run(() => e({
			store: y,
			app: r._a,
			pinia: r,
			options: s
		})));
	}), p && a && n.hydrate && n.hydrate(y.$state, p), l = !0, u = !0, y;
}
function Fd(e, t, n) {
	let r, i = typeof t == "function";
	r = i ? n : t;
	function a(n, a) {
		let o = as();
		return n ||= o ? is(od, null) : null, n && ad(n), n = id, n._s.has(e) || (i ? Pd(e, t, r, n) : Nd(e, r, n)), n._s.get(e);
	}
	return a.$id = e, a;
}
function Id(e) {
	let t = /* @__PURE__ */ R(e), n = {};
	for (let r in t) {
		let i = t[r];
		i.effect ? n[r] = $({
			get: () => e[r],
			set(t) {
				e[r] = t;
			}
		}) : (/* @__PURE__ */ z(i) || /* @__PURE__ */ so(i)) && (n[r] = /* @__PURE__ */ So(e, r));
	}
	return n;
}
//#endregion
//#region src/module/apps/npc-builder/functions/create-default-trait-config.ts
function Ld() {
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
function Rd(e, t) {
	return `${e}:${Wd(t)}`;
}
function zd(e) {
	let t = e.level ?? 1;
	return Number.isFinite(t) ? Math.max(1, Math.floor(t)) * 5 : 5;
}
function Bd(e) {
	return e.name;
}
function Vd(e, t) {
	return e === "characteristic" ? t.allowBaseActorCharacteristics : e === "skill" ? t.allowBaseActorSkills : t.allowBaseActorTalents;
}
function Hd(e, t) {
	return {
		...Ld(),
		...e,
		...t
	};
}
function Ud(e, t) {
	return Wd(e) === Wd(t);
}
function Wd(e) {
	return e.trim().toLocaleLowerCase();
}
function Gd(e) {
	return Number.isFinite(e) ? Math.max(1, Math.floor(e)) : 1;
}
function Kd(e) {
	let t = 0;
	for (let n of e) t += n.count;
	return t;
}
function qd(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = Wd(r);
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
//#endregion
//#region src/module/apps/npc-builder/functions/skill-specialization.ts
function Jd(e, t, n) {
	return `${e}:${$d(t)}:${n}`;
}
function Yd(e, t) {
	let n = e.trim(), r = t.trim();
	return r ? `${n} (${r})` : n;
}
function Xd(e) {
	let t = /^(?<base>.+?)\s*\((?<specialization>[^)]+)\)\s*$/.exec(e.trim());
	if (!t?.groups) return null;
	let n = t.groups.base?.trim() ?? "", r = t.groups.specialization?.trim() ?? "";
	return !n || !r || Zd(e) ? null : {
		baseName: n,
		originalName: e,
		specialization: r
	};
}
function Zd(e) {
	let t = /^(?<base>.+?)\s*\((?<specialization>[^)]+)\)\s*$/.exec(e.trim());
	if (!t?.groups) return null;
	let n = t.groups.base?.trim() ?? "", r = t.groups.specialization?.trim() ?? "", i = tf(r);
	return !n || !r || !ef(r, i) ? null : {
		baseName: n,
		options: i,
		originalName: e,
		specialization: r
	};
}
function Qd(e, t) {
	let n = /* @__PURE__ */ new Map();
	return t.map((t) => {
		let r = $d(t), i = n.get(r) ?? 0;
		return n.set(r, i + 1), {
			occurrence: i,
			originalName: t,
			resolutionKey: Jd(e, t, i)
		};
	});
}
function $d(e) {
	return e.trim().replaceAll(/\s+/g, " ").toLocaleLowerCase();
}
function ef(e, t) {
	return e.trim().toLocaleLowerCase() === "any" || t.length > 1;
}
function tf(e) {
	return e.split(/\s+or\s+/i).map((e) => e.trim()).filter(Boolean);
}
//#endregion
//#region src/module/apps/npc-builder/functions/advancements/source-counts.ts
function nf(e, t) {
	return t <= 0 ? [] : [{
		count: t,
		kind: "career",
		label: `${e} extra time`
	}];
}
function rf(e, t) {
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
function af(e, t, n, r) {
	let i = sf(of(e, r), n);
	return i.value === null ? t : Math.min(t, Math.max(0, i.value - e.baseAdvances));
}
function of(e, t) {
	let n = t[Wd(e.name)];
	return {
		maximumFormula: e.talentMaximumFormula ?? n?.maximumFormula ?? "",
		maximumKey: e.talentMaximumKey ?? n?.maximumKey ?? ""
	};
}
function sf(e, t) {
	let n = e.maximumKey.trim().toLocaleLowerCase();
	if (!n) return {
		label: "Unknown",
		value: null
	};
	if (n === "none") return {
		label: "-",
		value: null
	};
	if (n === "custom") return cf(e.maximumFormula, t);
	let r = Number(n);
	if (Number.isFinite(r)) {
		let e = Math.max(0, Math.floor(r));
		return {
			label: `${e}`,
			value: e
		};
	}
	if (ee(n)) {
		let e = t[n] ?? 0, r = Math.max(0, Math.floor(e / 10));
		return {
			label: `${C[n]} Bonus (${r})`,
			value: r
		};
	}
	return {
		label: e.maximumKey || "Unknown",
		value: null
	};
}
function cf(e, t) {
	let n = e.trim(), r = Number(n);
	if (Number.isFinite(r)) {
		let e = Math.max(0, Math.floor(r));
		return {
			label: `${e}`,
			value: e
		};
	}
	let i = /@characteristics\.([a-z]+)\.bonus/i.exec(n)?.[1]?.toLocaleLowerCase();
	if (i && ee(i)) {
		let e = t[i] ?? 0, n = Math.max(0, Math.floor(e / 10));
		return {
			label: `${C[i]} Bonus (${n})`,
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
function lf(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e.careers) {
		let i = qd(ff(r, t, e.skillGrantResolutions)), a = zd(r) / 5, o = Math.max(0, Gd(r.quantity) - 1) * 5;
		for (let e of i) {
			let i = Rd(t, e), s = n.get(i);
			if (s) {
				a > s.highestLevel && (s.highestLevel = a, s.highestLevelSource = Bd(r)), o > 0 && s.extraSources.push({
					count: o,
					kind: "career",
					label: `${r.name} extra time`
				});
				continue;
			}
			n.set(i, {
				extraSources: nf(r.name, o),
				highestLevel: a,
				highestLevelSource: Bd(r),
				name: e
			});
		}
	}
	for (let r of n.values()) df(e, {
		careerValue: r.highestLevel * 5 + Kd(r.extraSources),
		kind: t,
		name: r.name,
		sources: [{
			count: r.highestLevel * 5,
			kind: "career",
			label: r.highestLevelSource
		}, ...r.extraSources]
	});
}
function uf(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.careers) {
		let r = qd(ff(n, "talent", e.skillGrantResolutions)), i = Math.max(0, Gd(n.quantity) - 1);
		for (let e of r) {
			let r = Rd("talent", e), a = t.get(r);
			if (a) {
				i > 0 && a.extraSources.push({
					count: i,
					kind: "career",
					label: `${n.name} extra time`
				});
				continue;
			}
			t.set(r, {
				extraSources: nf(n.name, i),
				firstSource: n.name,
				name: e
			});
		}
	}
	for (let n of t.values()) df(e, {
		careerValue: 1 + Kd(n.extraSources),
		kind: "talent",
		name: n.name,
		sources: [{
			count: 1,
			kind: "career",
			label: n.firstSource
		}, ...n.extraSources]
	}, e.characteristicTotals);
}
function df(e, t, n = {}) {
	let r = Rd(t.kind, t.name), i = e.entries.get(r);
	if (i) {
		let r = t.kind === "talent" && i.includedFromBase ? t.sources.slice(1) : t.sources, a = t.kind === "talent" ? af(i, Kd(r), n, e.talentMaximums) : t.careerValue;
		i.careerValue = a, i.includedFromCareer = !0, i.sources = [...i.sources.filter((e) => e.kind === "base"), ...rf(r, a)];
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
	t.kind === "talent" && (a.careerValue = af(a, t.careerValue, n, e.talentMaximums), a.current = a.careerValue, a.sources = rf(t.sources, a.careerValue)), e.entries.set(r, { ...a });
}
function ff(e, t, n) {
	return t === "characteristic" ? e.grants.characteristics : t === "skill" ? Qd(e.uuid, e.grants.skills).map((e) => n[e.resolutionKey] || e.originalName) : e.grants.talents;
}
//#endregion
//#region src/module/apps/npc-builder/functions/advancements/entry-context.ts
function pf(e, t) {
	let n = {};
	for (let r of e.values()) {
		if (r.kind !== "characteristic") continue;
		let e = w[Wd(r.name)];
		if (!e) continue;
		let i = t[Rd(r.kind, r.name)] ?? 0, a = Math.max(r.minimumCurrent, Math.floor(r.careerValue + i));
		n[e] = Math.max(0, r.baseValue + a);
	}
	return n;
}
function mf(e, t, n) {
	return e.kind === "skill" ? hf(e, t, n) : e.kind === "talent" ? gf(e, t, n) : e;
}
function hf(e, t, n) {
	let r = _f(e) ?? vf(e.name, n.skillCharacteristics) ?? yf(e.name, n.baseActorDraftData);
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
function gf(e, t, n) {
	let r = of(e, n.talentMaximums), i = sf(r, t);
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
function _f(e) {
	return !e.characteristicKey || !e.characteristicName ? null : {
		characteristicKey: e.characteristicKey,
		characteristicName: e.characteristicName,
		skillName: e.name
	};
}
function vf(e, t) {
	return t[Wd(e)] ?? null;
}
function yf(e, t) {
	let n = t.advancements.find((t) => t.kind === "skill" && Ud(t.name, e));
	return n?.characteristicKey ? {
		characteristicKey: n.characteristicKey,
		characteristicName: n.characteristicName ?? C[n.characteristicKey],
		skillName: e
	} : null;
}
//#endregion
//#region src/module/apps/npc-builder/functions/advancements/derive-advancements.ts
function bf(e) {
	let t = Tf(e.baseActorDraftData), n = {
		careers: e.careers,
		entries: t,
		skillGrantResolutions: e.skillGrantResolutions,
		talentMaximums: e.talentMaximums
	};
	lf(n, "characteristic"), lf(n, "skill");
	let r = pf(t, e.manualAdvancementDeltas);
	return uf({
		...n,
		characteristicTotals: r
	}), Ef(t, e.customAdvancements), [...t.values()].filter((t) => t.includedFromCareer || t.includedFromCustom || Vd(t.kind, e.settings)).map((t) => {
		let n = mf(t, r, e), i = Rd(t.kind, t.name), a = e.manualAdvancementDeltas[i] ?? 0, o = n.careerValue + a;
		return {
			...n,
			current: Math.max(n.minimumCurrent, Math.floor(o))
		};
	}).sort(Df);
}
function xf(e, t) {
	let n = Number.isFinite(t) ? t : 0;
	return Math.max(e.minimumCurrent, Math.floor(n)) - e.careerValue;
}
function Sf(e, t) {
	let n = Number.isFinite(t) ? t : 0;
	return xf(e, Math.max(e.minimumTotal, Math.floor(n)) - e.baseValue);
}
function Cf(e, t) {
	return {
		...e,
		...Object.fromEntries(t.map((e) => [Wd(e.skillName), e]))
	};
}
function wf(e, t) {
	return {
		...e,
		...Object.fromEntries(t.map((e) => [Wd(e.talentName), e]))
	};
}
function Tf(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.advancements) {
		let e = Rd(n.kind, n.name), r = {
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
		n.baseModifier !== void 0 && (r.baseModifier = n.baseModifier), n.characteristicKey && (r.characteristicKey = n.characteristicKey, r.characteristicName = n.characteristicName ?? C[n.characteristicKey]), n.kind === "talent" && n.baseAdvances > 0 && r.sources.push({
			count: n.baseAdvances,
			kind: "base",
			label: "Base"
		}), n.talentMaximumFormula && (r.talentMaximumFormula = n.talentMaximumFormula), n.talentMaximumKey && (r.talentMaximumKey = n.talentMaximumKey), t.set(e, r);
	}
	return t;
}
function Ef(e, t) {
	for (let n of t) {
		let t = Rd(n.kind, n.name), r = {
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
function Df(e, t) {
	return e.kind === t.kind ? e.name.localeCompare(t.name) : e.kind.localeCompare(t.kind);
}
//#endregion
//#region src/module/apps/npc-builder/functions/advancements/advancement-actions.ts
function Of(e) {
	return e.kind === "talent" ? 1 : 5;
}
function kf(e) {
	return Math.max(e.minimumTotal, e.baseValue + e.current);
}
function Af(e, t) {
	return kf(e) + t * Of(e);
}
function jf(e) {
	return kf(e);
}
function Mf(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" && jf(e) < t;
}
function Nf(e) {
	return e.filter((e) => e.kind === "talent" && Mf(e)).map((e) => ({
		kind: e.kind,
		name: e.name,
		total: e.talentMaximumValue
	}));
}
function Pf(e, t) {
	let n = new Map(e.map((e) => [If(e), e])), r = [];
	for (let e of t) {
		let t = n.get(If(e));
		!t || t.current === e.current || r.push({
			current: e.current,
			kind: t.kind,
			name: t.name
		});
	}
	return r;
}
function Ff(e, t) {
	return e.find((e) => e.kind === t.kind && e.name === t.name) ?? null;
}
function If(e) {
	return `${e.kind}:${e.name}`;
}
//#endregion
//#region src/module/apps/npc-builder/functions/xp-cost.ts
var Lf = {
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
function Rf(e) {
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
		let e = Jf(r), i = e + r.current;
		if (r.kind === "characteristic") {
			let a = w[Wd(r.name)];
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
	return zf(n, t);
}
function zf(e, t) {
	let n = Uf(e, t), r = Wf(e.skills, t.skills, Lf.skill), i = Gf(e.talents, t.talents);
	return {
		characteristics: n,
		skills: r,
		talents: i,
		total: n + r + i
	};
}
function Bf(e) {
	let t = Math.max(0, Math.floor(e.current));
	return e.kind === "talent" ? Hf(t) : Vf(t, e.kind === "characteristic" ? Lf.characteristic : Lf.skill);
}
function Vf(e, t) {
	let n = Math.max(0, Math.floor(e)), r = 0;
	for (let e = 0; e < n; e += 1) {
		let n = Math.min(Math.floor(e / 5), t.length - 1);
		r += t[n] ?? 0;
	}
	return r;
}
function Hf(e, t = 0) {
	let n = Math.max(0, Math.floor(e)), r = Math.max(0, Math.floor(t)), i = 0;
	for (let e = 0; e < n; e += 1) i += (r + e + 1) * 100;
	return i;
}
function Uf(e, t) {
	let n = 0;
	for (let r of Object.keys(C)) {
		let i = r, a = qf(e.characteristics[i] ?? 0, t.characteristics[i] ?? 0);
		n += Vf(a, Lf.characteristic);
	}
	return n;
}
function Wf(e, t, n) {
	let r = Kf(e), i = Kf(t), a = 0;
	for (let [e, t] of r) {
		let r = qf(t, i.get(e) ?? 0);
		a += Vf(r, n);
	}
	return a;
}
function Gf(e, t) {
	let n = Kf(e), r = Kf(t), i = 0;
	for (let [e, t] of n) {
		let n = qf(t, r.get(e) ?? 0);
		i += Hf(n);
	}
	return i;
}
function Kf(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = Wd(n.name), r = Math.floor(n.value);
		e && t.set(e, (t.get(e) ?? 0) + r);
	}
	return t;
}
function qf(e, t) {
	return Math.max(0, Math.floor(e) - Math.floor(t));
}
function Jf(e) {
	return e.kind === "characteristic" ? Math.floor(e.baseValue) : e.kind === "skill" ? Math.floor(e.baseAdvances + (e.baseModifier ?? 0)) : Math.floor(e.baseAdvances);
}
//#endregion
//#region src/module/apps/npc-builder/state/advancements/index.ts
function Yf(e) {
	let { baseActorDraftData: t, careers: n, customAdvancements: r, manualAdvancementDeltas: i, settings: a, skillCharacteristics: o, skillGrantResolutions: s, talentMaximums: c } = e, l = $(() => bf({
		baseActorDraftData: t.value,
		careers: n.value,
		customAdvancements: r.value,
		manualAdvancementDeltas: i.value,
		settings: a.value,
		skillCharacteristics: o.value,
		skillGrantResolutions: s.value,
		talentMaximums: c.value
	})), u = $(() => Rf(l.value)), d = $(() => Nf(l.value).length);
	function f(e) {
		let t = Rd(e.kind, e.name);
		r.value.some((e) => Rd(e.kind, e.name) === t) || r.value.push(e);
	}
	function p(e) {
		let t = Rd(e.kind, e.name);
		r.value = r.value.filter((e) => Rd(e.kind, e.name) !== t), delete i.value[t];
	}
	function m(e, t) {
		x(e, Af(e, t));
	}
	function h() {
		for (let e of Nf(l.value)) {
			let t = Ff(l.value, e);
			t && x(t, e.total);
		}
	}
	function g(e, t) {
		let n = Math.max(0, Math.floor(Number.isFinite(t) ? t : 0)), r = e.run({ advancements: l.value }, n), i = Pf(l.value, r.advancements);
		for (let e of i) {
			let t = Ff(l.value, e);
			t && b(t, e.current);
		}
	}
	function _(e) {
		return s.value[e] ?? "";
	}
	function v(e) {
		o.value = Cf(o.value, e);
	}
	function y(e) {
		c.value = wf(c.value, e);
	}
	function b(e, t) {
		let n = Rd(e.kind, e.name);
		i.value[n] = xf(e, t);
	}
	function x(e, t) {
		let n = Rd(e.kind, e.name);
		i.value[n] = Sf(e, t);
	}
	function S(e) {
		let t = Rd(e.kind, e.name);
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
//#region src/module/apps/npc-builder/functions/draft-summary.ts
function Xf(e, t) {
	return e.find((e) => e.uuid === t) ?? null;
}
function Zf(e) {
	return e.at(-1) ?? null;
}
function Qf(e) {
	let t = e.finalCareer?.name, n = e.settings.includeSpeciesInName && e.selectedBaseActor?.species ? e.selectedBaseActor.species : "";
	return t && n ? `${n} ${t}` : t || (e.selectedBaseActor ? `${e.selectedBaseActor.name} NPC` : "New NPC");
}
function $f(e, t) {
	return e.trim() || t;
}
function ep(e) {
	return e.finalCareer?.img || e.selectedBaseActor?.prototypeTokenImg || e.selectedBaseActor?.img || "";
}
function tp(e, t) {
	return e || t;
}
function np(e) {
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
function rp(e) {
	let { actorName: t, baseActors: n, careers: r, clearBaseDraftData: i, clearMountSelection: a, customAdvancements: o, customSpells: s, customTraits: c, customTrappings: l, detectedSpells: u, ignoredBaseTraitKeys: d, magicLoreResolutions: f, removeSkillGrantResolutionsForCareer: p, selectedBaseActorUuid: m, selectedPortraitPath: h, settings: g, skillGrantResolutions: _, spellSelectionOverrides: v } = e, y = $(() => Xf(n.value, m.value)), b = $(() => Zf(r.value)), x = $(() => Qf({
		finalCareer: b.value,
		selectedBaseActor: y.value,
		settings: g.value
	})), S = $(() => $f(t.value, x.value)), C = $(() => ep({
		finalCareer: b.value,
		selectedBaseActor: y.value
	})), w = $(() => tp(h.value, C.value)), ee = $(() => np(r.value));
	function te(e) {
		let t = r.value.find((t) => t.uuid === e.uuid);
		if (t) {
			t.quantity = Gd(t.quantity + 1);
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
	function oe(e) {
		h.value = e;
	}
	function se(e, t) {
		let n = r.value[e];
		n && (n.quantity = Gd(t));
	}
	return {
		addCareer: te,
		addCareerIfMissing: ne,
		clearCareers: E,
		finalActorName: S,
		finalCareer: b,
		finalPortraitPath: w,
		grantTotals: ee,
		moveCareer: re,
		moveCareerToIndex: T,
		removeCareer: ie,
		resetDraft: ae,
		selectBaseActor: D,
		selectBaseActorUuid: O,
		selectedBaseActor: y,
		selectPortrait: oe,
		setCareerQuantity: se,
		suggestedActorName: x
	};
}
//#endregion
//#region src/module/apps/npc-builder/state/hydration.ts
function ip(e) {
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
function ap(e) {
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
function op(e) {
	return e.sourceFilter ? e.sourceFilter : e.sourceGroup ? {
		label: lp(e.sourceGroup),
		value: e.sourceGroup
	} : null;
}
function sp(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = op(n);
		e && !t.has(e.value) && t.set(e.value, e);
	}
	return [...t.values()];
}
function cp(e) {
	return {
		label: `Priority Folder: ${e.split("/").filter(Boolean).slice(-2).join("/") || e}`,
		value: `priority-folder:${e.toLocaleLowerCase()}`
	};
}
function lp(e) {
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
function up(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = mp(r.img);
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
function dp(e) {
	let t = up(fp([...e.assetCandidates, ...e.immediateCandidates]));
	return !e.selectedPortraitPath || t.some((t) => mp(t.img) === mp(e.selectedPortraitPath)) ? t : [{
		img: e.selectedPortraitPath,
		key: `selected:${e.selectedPortraitPath}`,
		label: "Selected portrait",
		source: "foundry-asset",
		sourceLabel: "Selected"
	}, ...t];
}
function fp(e) {
	return e.map((e, t) => ({
		candidate: e,
		index: t
	})).sort((e, t) => pp(e.candidate) - pp(t.candidate) || e.index - t.index).map(({ candidate: e }) => e);
}
function pp(e) {
	return e.sourceFilter?.value.startsWith("priority-folder:") ? 0 : e.sourceGroup ? {
		career: 1,
		compendiums: 2,
		world: 3,
		"dig-down": 4
	}[e.sourceGroup] ?? 5 : 5;
}
function mp(e) {
	return e.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/functions/portrait-gallery/index.ts
var hp = new Set([
	"and",
	"any",
	"the",
	"with",
	"without",
	"of",
	"or",
	"npc"
]), gp = "portrait-gallery-filter:", _p = "modules/wfrp4e-core/art/careers", vp = [
	"modules/wfrp4e-core/art/bestiary",
	"modules/wfrp4e-core/tokens",
	"modules/wfrp4e-core/tokens/popout"
], yp = ["systems/wfrp4e/tokens/unknown.png"], bp = "application/x-wfrp4e-customizer-portrait-filter-tag";
function xp(e) {
	return zp(Rp(e).filter((e) => e.length >= 3 && !hp.has(e)));
}
function Sp(e) {
	return zp(e.flatMap(xp));
}
function Cp(e) {
	if (!Array.isArray(e)) return [];
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		if (typeof r != "string") continue;
		let e = r.trim().replaceAll("\\", "/").replace(/^\/+|\/+$/gu, ""), i = e.toLocaleLowerCase();
		e && !t.has(i) && (t.add(i), n.push(e));
	}
	return n;
}
function wp(e) {
	return Cp([
		...e.hasCareer ? [_p] : [],
		...vp,
		...e.configuredFolders
	]);
}
function Tp(e, t, n) {
	return e.filter((e) => (t[e] ?? "search") === n);
}
function Ep(e, t) {
	let n = Lp(e);
	return !!(n && t.some((e) => n.includes(e)));
}
function Dp(e, t) {
	let n = Ip(e), r = op(e), i = t.mustIncludeSources.length === 0 || r !== null && t.mustIncludeSources.includes(r.value), a = r !== null && t.mustExcludeSources.includes(r.value);
	return t.mustIncludeTerms.every((e) => n.includes(e)) && t.mustExcludeTerms.every((e) => !n.includes(e)) && i && !a;
}
function Op(e) {
	return `${gp}${e}`;
}
function kp(e) {
	return e.startsWith(gp) ? e.slice(24) : null;
}
function Ap(e) {
	return e.hasEnabledSource && e.hasSubject && e.searchTerms.length > 0;
}
function jp(e) {
	return e ? e.maxDirectories <= 0 ? e.phase === "ready" ? 100 : 4 : Math.min(100, Math.round(e.directoriesVisited / e.maxDirectories * 100)) : 0;
}
function Mp(e) {
	return e ? e.phase === "ready" ? `${e.candidatesFound} options found` : e.phase === "filesystem" ? e.maxDirectories <= 0 ? `${e.directoriesVisited} directories - ${e.currentLocation}` : `${e.directoriesVisited}/${e.maxDirectories} directories - ${e.currentLocation}` : e.currentLocation : "";
}
function Np(e) {
	return `${e.label}\n${e.img}`;
}
function Pp(e) {
	return `Use ${e.label} (${Fp(e)})`;
}
function Fp(e) {
	return e.sourceLabel ?? {
		"base-actor": "Actor Portrait",
		"base-token": "Prototype Token",
		career: "Career",
		"foundry-asset": "Foundry",
		web: "Web"
	}[e.source];
}
function Ip(e) {
	return Lp([
		e.label,
		e.img,
		e.sourceLabel ?? ""
	].filter(Boolean).join(" "));
}
function Lp(e) {
	return e.trim().toLocaleLowerCase().replaceAll(/[_-]/g, " ").replaceAll(/[(),.:;[\]]/g, " ").replaceAll(/\s+/g, " ");
}
function Rp(e) {
	return Lp(e).split(" ").filter(Boolean);
}
function zp(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/module/state/portrait-gallery/filters.ts
function Bp() {
	let e = /* @__PURE__ */ B([]), t = /* @__PURE__ */ B({}), n = /* @__PURE__ */ B({});
	function r(t) {
		let r = new Set(e.value), i = xp(t).filter((e) => !r.has(e));
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
function Vp() {
	return Bp();
}
//#endregion
//#region src/module/apps/npc-builder/functions/default-npc-builder-settings.ts
function Hp() {
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
		excludedPortraitReferenceImages: [...yp],
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
var Up = Hp(), Wp = {
	advancements: [],
	optionalTraits: [],
	traits: [],
	trappings: []
}, Gp = /\(([^)]+)\)/, Kp = [
	"beasts",
	"death",
	"fire",
	"heavens",
	"metal",
	"life",
	"light",
	"shadow"
], qp = [
	"daemonology",
	"necromancy",
	"nurgle",
	"slaanesh",
	"tzeentch",
	"undivided"
];
function Jp(e, t) {
	let n = e.trim(), r = n.toLocaleLowerCase();
	return r === "petty magic" ? tm({
		kind: "petty-magic",
		rawLore: "Petty Magic",
		source: t,
		sourceName: n
	}) : r.startsWith("arcane magic") ? tm({
		kind: "arcane-magic",
		rawLore: nm(n),
		source: t,
		sourceName: n
	}) : r.startsWith("spellcaster") ? tm({
		kind: "spellcaster",
		rawLore: nm(n),
		source: t,
		sourceName: n
	}) : null;
}
function Yp(e) {
	return e.trim().replace(/^any\s+/i, "").replace(/^arcane\s+lore\s+of\s+/i, "").replace(/^arcane\s+lore$/i, "").replace(/^lore\s+of\s+/i, "").replaceAll(/\s+/g, " ").toLocaleLowerCase();
}
function Xp(e) {
	return `${e.source}:${e.kind}:${e.sourceName}:${e.rawLore}`;
}
function Zp(e, t) {
	return {
		...e,
		isAmbiguous: !1,
		normalizedLore: Yp(t),
		rawLore: t.trim()
	};
}
function Qp(e) {
	let t = Yp(e);
	return t === "petty" ? "petty" : Kp.includes(t) ? "eight-wind" : qp.includes(t) ? "dark" : "other";
}
function $p(e, t) {
	if (e.kind === "petty-magic") return t.filter((e) => e.category === "petty");
	let n = e.rawLore.trim().toLocaleLowerCase();
	return n.includes("dark") ? t.filter((e) => e.category === "dark") : n.includes("eight winds") ? t.filter((e) => e.category === "eight-wind") : t.filter((e) => e.category !== "petty");
}
function em(e) {
	let t = e.trim().toLocaleLowerCase();
	return !t || t === "any" || t.includes("any ");
}
function tm(e) {
	let t = e.rawLore.trim();
	return {
		isAmbiguous: em(t),
		kind: e.kind,
		normalizedLore: Yp(t),
		rawLore: t,
		resolutionKey: Xp({
			kind: e.kind,
			rawLore: t,
			source: e.source,
			sourceName: e.sourceName
		}),
		source: e.source,
		sourceName: e.sourceName
	};
}
function nm(e) {
	return Gp.exec(e)?.[1]?.trim() ?? "";
}
//#endregion
//#region src/module/apps/npc-builder/functions/spells/derive-magic-grants.ts
function rm(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.advancements) n.kind !== "talent" || n.baseAdvances + n.current <= 0 || im(t, Jp(n.name, "talent"), e);
	for (let n of e.traits) im(t, Jp(n.name, "trait"), e);
	return [...t.values()];
}
function im(e, t, n) {
	if (!t) return;
	let r = n.loreResolutions[t.resolutionKey];
	e.set(t.resolutionKey, r ? Zp(t, r) : t);
}
//#endregion
//#region src/module/apps/npc-builder/functions/spells/derive-spells.ts
function am(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.detectedSpells) t.set(n.key, {
		...n,
		selected: e.selectionOverrides[n.key] ?? e.autoSelectDetectedSpells
	});
	for (let n of e.customSpells) t.set(n.key, {
		...n,
		selected: e.selectionOverrides[n.key] ?? n.selected
	});
	return [...t.values()].sort(um);
}
function om(e) {
	return e.filter((e) => e.selected);
}
function sm(e) {
	return e.spells.map((t) => ({
		...t,
		selected: e.selectionOverrides[t.key] ?? e.autoSelectDetectedSpells
	}));
}
function cm(e) {
	let t = e.detectedSpells.find((t) => lm(t, e.spell));
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
function lm(e, t) {
	return e.sourceUuid && e.sourceUuid === t.sourceUuid ? !0 : Ud(e.name, t.name);
}
function um(e, t) {
	return e.loreName === t.loreName ? e.name.localeCompare(t.name) : e.loreName.localeCompare(t.loreName);
}
//#endregion
//#region src/module/apps/npc-builder/state/spells.ts
function dm(e) {
	let { advancements: t, customSpells: n, detectedSpells: r, magicLoreResolutions: i, settings: a, spellSelectionOverrides: o, traits: s } = e, c = $(() => rm({
		advancements: t.value,
		loreResolutions: i.value,
		traits: s.value
	})), l = $(() => c.value.length > 0), u = $(() => am({
		autoSelectDetectedSpells: a.value.autoSelectGrantedSpells,
		customSpells: n.value,
		detectedSpells: r.value,
		selectionOverrides: o.value
	})), d = $(() => om(u.value));
	function f(e) {
		let t = cm({
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
		r.value = sm({
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
function fm(e) {
	let t = /* @__PURE__ */ new Map();
	if (e.allowBaseActorTraits) for (let n of e.baseActorDraftData.traits) {
		let r = gm(n);
		e.ignoredBaseTraitKeys[r] || t.set(r, ym(n, r, !1));
	}
	for (let n of e.customTraits) vm([...t.values()], n.name) || t.set(n.key, { ...n });
	return [...t.values()].map((t) => ({
		...t,
		config: Hd(t.config, e.traitConfigOverrides[t.key])
	})).sort(bm);
}
function pm(e) {
	return e.allowBaseActorTraits ? [...e.baseActorDraftData.traits.filter((t) => e.ignoredBaseTraitKeys[gm(t)]).map((t) => {
		let n = gm(t);
		return {
			...ym(t, n, !0),
			config: Hd(t.config, e.traitConfigOverrides[n])
		};
	}), ...e.selectedTraits] : e.selectedTraits;
}
function mm(e) {
	return e.optionalTraits.map((e) => ({
		config: e.config,
		img: e.img,
		name: e.name,
		uuid: e.uuid
	})).sort((e, t) => e.name.localeCompare(t.name));
}
function hm(e, t) {
	return {
		config: t.config,
		ignored: !1,
		key: `${e}:${t.uuid || Wd(t.name)}`,
		name: t.name,
		source: e,
		sourceUuid: t.uuid
	};
}
function gm(e) {
	return `base:${e.uuid || Wd(e.name)}`;
}
function _m(e, t) {
	return e.find((e) => Ud(e.name, t));
}
function vm(e, t) {
	return _m(e, t) !== void 0;
}
function ym(e, t, n) {
	return {
		config: e.config,
		ignored: n,
		key: t,
		name: e.name,
		source: "base",
		sourceUuid: e.uuid
	};
}
function bm(e, t) {
	return e.source === t.source ? e.name.localeCompare(t.name) : e.source.localeCompare(t.source);
}
//#endregion
//#region src/module/apps/npc-builder/state/traits.ts
function xm(e) {
	let { baseActorDraftData: t, customTraits: n, ignoredBaseTraitKeys: r, quickTraits: i, settings: a, traitConfigOverrides: o } = e, s = $(() => fm({
		allowBaseActorTraits: a.value.allowBaseActorTraits,
		baseActorDraftData: t.value,
		customTraits: n.value,
		ignoredBaseTraitKeys: r.value,
		traitConfigOverrides: o.value
	})), c = $(() => pm({
		allowBaseActorTraits: a.value.allowBaseActorTraits,
		baseActorDraftData: t.value,
		ignoredBaseTraitKeys: r.value,
		selectedTraits: s.value,
		traitConfigOverrides: o.value
	})), l = $(() => mm(t.value));
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
		let i = hm(e, t);
		if (!r) {
			d(i.key), x(t.name, !0);
			return;
		}
		x(t.name, !1) || n.value.find((e) => e.key === i.key) || h(i);
	}
	function h(e) {
		vm(s.value, e.name) || n.value.some((t) => t.key === e.key) || n.value.push(e);
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
		return _m(l.value, e);
	}
	function y(e) {
		return _m(i.value, e);
	}
	function b(e) {
		let n = _m(t.value.traits, e);
		if (!n) return null;
		let i = gm(n);
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
function Sm(e, t = "trapping") {
	return {
		candidates: [],
		searchTerms: Em(e),
		selectedCandidateUuid: "",
		selectedItemType: t,
		selectedName: e.trim(),
		status: "fallback"
	};
}
function Cm(e) {
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
function wm(e) {
	return {
		candidates: [],
		searchTerms: Em(e),
		selectedCandidateUuid: "",
		selectedItemType: "trapping",
		selectedName: e.trim(),
		status: "unresolved"
	};
}
function Tm(e, t) {
	let n = Em(e), r = Om(n, t), i = r.filter((e) => e.matchKind === "exact");
	return i.length === 1 ? Am("matched", n, i[0]) : i.length > 1 ? Am("ambiguous", n, i[0], { candidates: r }) : r.length ? {
		candidates: r,
		searchTerms: n,
		selectedCandidateUuid: "",
		selectedItemType: "trapping",
		selectedName: e.trim(),
		status: "ambiguous"
	} : Sm(e);
}
function Em(e) {
	let t = e.split(/\s+or\s+/i).map((e) => e.trim()).filter(Boolean);
	return t.length ? Pm(t) : [e.trim()].filter(Boolean);
}
function Dm(e, t) {
	if (jm(e) === jm(t)) return "exact";
	let n = Mm(e), r = Mm(t);
	if (!n || !r) return null;
	if (n === r || n.includes(r) || r.includes(n)) return "near";
	let i = n.split(" "), a = new Set(r.split(" "));
	return i.every((e) => a.has(e)) ? "near" : null;
}
function Om(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) for (let e of t) {
		let t = Dm(r, e.name);
		t && n.get(e.uuid)?.matchKind !== "exact" && n.set(e.uuid, {
			itemType: e.itemType,
			matchKind: t,
			name: e.name,
			searchTerm: r,
			sourceLabel: e.sourceLabel,
			uuid: e.uuid
		});
	}
	return [...n.values()].sort(km);
}
function km(e, t) {
	return e.matchKind === t.matchKind ? e.name.localeCompare(t.name) : e.matchKind === "exact" ? -1 : 1;
}
function Am(e, t, n, r = {}) {
	return {
		candidates: r.candidates ?? (n ? [n] : []),
		searchTerms: t,
		selectedCandidateUuid: n?.uuid ?? "",
		selectedItemType: n?.itemType ?? "trapping",
		selectedName: n?.name ?? "",
		status: e
	};
}
function jm(e) {
	return e.trim().toLocaleLowerCase().replaceAll(/\s+/g, " ");
}
function Mm(e) {
	return jm(e).replaceAll("&", " and ").replaceAll(/[(),.:;[\]]/g, " ").replaceAll(/\b(a|an|the|some|pair of|pairs of)\b/g, " ").split(/\s+/).map(Nm).filter(Boolean).join(" ");
}
function Nm(e) {
	return e.endsWith("ies") && e.length > 4 ? `${e.slice(0, -3)}y` : e.endsWith("s") && !e.endsWith("ss") && e.length > 3 ? e.slice(0, -1) : e;
}
function Pm(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/module/apps/npc-builder/functions/trappings/derive-trappings.ts
function Fm(e) {
	let t = /* @__PURE__ */ new Map();
	Rm(t, e), zm(t, e);
	for (let n of e.customTrappings) t.set(n.key, { ...n });
	return [...t.values()].map((t) => Bm(t, e)).sort(Vm);
}
function Im(e, t) {
	let n = e.resolution.candidates.find((e) => e.uuid === t);
	return n ? {
		...e.resolution,
		selectedCandidateUuid: n.uuid,
		selectedItemType: n.itemType,
		selectedName: n.name,
		status: e.resolution.status === "matched" ? "matched" : "ambiguous"
	} : null;
}
function Lm(e) {
	return {
		...Sm(e.name, e.itemType),
		candidates: e.resolution.candidates,
		searchTerms: e.resolution.searchTerms
	};
}
function Rm(e, t) {
	if (t.settings.allowBaseActorTrappings) for (let n of t.baseActorDraftData.trappings) {
		let t = `base:${n.uuid || Wd(n.name)}`;
		e.set(t, {
			ignored: !1,
			itemType: n.itemType,
			key: t,
			name: n.name,
			quantity: n.quantity,
			resolution: Cm({
				itemType: n.itemType,
				name: n.name,
				uuid: n.uuid
			}),
			source: "base",
			sourceUuid: n.uuid
		});
	}
}
function zm(e, t) {
	for (let n of t.careers) for (let r of n.grants.trappings) {
		let i = `career:${Wd(r)}`, a = e.get(i);
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
			resolution: t.trappingResolutionOverrides[i] ?? wm(r),
			source: "career",
			sourceUuid: ""
		});
	}
}
function Bm(e, t) {
	let n = t.trappingOverrides[e.key];
	return {
		...e,
		ignored: n?.ignored ?? e.ignored,
		quantity: Gd(n?.quantity ?? e.quantity),
		resolution: t.trappingResolutionOverrides[e.key] ?? e.resolution
	};
}
function Vm(e, t) {
	return e.source === t.source ? e.name.localeCompare(t.name) : e.source.localeCompare(t.source);
}
//#endregion
//#region src/module/apps/npc-builder/state/trappings.ts
function Hm(e) {
	let { baseActorDraftData: t, careers: n, customTrappings: r, settings: i, trappingOverrides: a, trappingResolutionOverrides: o } = e, s = $(() => Fm({
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
			quantity: Gd(t)
		};
	}
	function f(e, t) {
		let n = s.value.find((t) => t.key === e), r = n ? Im(n, t) : null;
		r && (o.value[e] = r);
	}
	function p(e) {
		let t = s.value.find((t) => t.key === e);
		t && (o.value[e] = Lm(t));
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
var Um = Fd("npc-builder", () => {
	let e = /* @__PURE__ */ B(""), t = /* @__PURE__ */ B([]), n = /* @__PURE__ */ B({}), r = /* @__PURE__ */ B(null), i = /* @__PURE__ */ B({ ...Wp }), a = /* @__PURE__ */ B([]), o = /* @__PURE__ */ B([]), s = /* @__PURE__ */ B([]), c = /* @__PURE__ */ B([]), l = /* @__PURE__ */ B([]), u = /* @__PURE__ */ B(null), d = /* @__PURE__ */ B([]), f = /* @__PURE__ */ B([]), p = /* @__PURE__ */ B(""), m = /* @__PURE__ */ B({ ...Up }), h = /* @__PURE__ */ B(""), g = /* @__PURE__ */ B(""), _ = /* @__PURE__ */ B({}), v = /* @__PURE__ */ B({}), y = /* @__PURE__ */ B({}), b = /* @__PURE__ */ B([]), x = /* @__PURE__ */ B([]), S = /* @__PURE__ */ B([]), C = /* @__PURE__ */ B({}), w = /* @__PURE__ */ B({}), ee = /* @__PURE__ */ B({}), te = /* @__PURE__ */ B({}), ne = /* @__PURE__ */ B({}), re = /* @__PURE__ */ B({}), T = Yf({
		baseActorDraftData: i,
		careers: o,
		customAdvancements: S,
		manualAdvancementDeltas: n,
		settings: m,
		skillCharacteristics: _,
		skillGrantResolutions: y,
		talentMaximums: v
	}), ie = Vp(), E = ip({
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
	}), ae = ap({
		baseActorCombatProfile: r,
		mountActorProfile: u,
		mountActors: d,
		selectedMountActorUuid: g
	}), D = rp({
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
		ignoredBaseTraitKeys: C,
		magicLoreResolutions: w,
		removeSkillGrantResolutionsForCareer: T.removeSkillGrantResolutionsForCareer,
		selectedBaseActorUuid: h,
		selectedPortraitPath: p,
		settings: m,
		skillGrantResolutions: y,
		spellSelectionOverrides: ee
	}), O = xm({
		baseActorDraftData: i,
		customTraits: s,
		ignoredBaseTraitKeys: C,
		quickTraits: f,
		settings: m,
		traitConfigOverrides: te
	}), oe = Hm({
		baseActorDraftData: i,
		careers: o,
		customTrappings: c,
		settings: m,
		trappingOverrides: ne,
		trappingResolutionOverrides: re
	}), se = dm({
		advancements: T.advancements,
		customSpells: x,
		detectedSpells: b,
		magicLoreResolutions: w,
		settings: m,
		spellSelectionOverrides: ee,
		traits: O.traits
	});
	function ce() {
		D.resetDraft(), ie.resetPortraitFilters();
	}
	return {
		actorName: e,
		actorFolders: t,
		addCareer: D.addCareer,
		addCareerIfMissing: D.addCareerIfMissing,
		addCustomAdvancement: T.addCustomAdvancement,
		addCustomPortraitSearchTerm: ie.addCustomPortraitSearchTerm,
		addCustomSpell: se.addCustomSpell,
		addCustomTrait: O.addCustomTrait,
		addCustomTrapping: oe.addCustomTrapping,
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
		hasMagicAccess: se.hasMagicAccess,
		hydrateActorFolders: E.hydrateActorFolders,
		hydrateBaseActorCombatProfile: ae.hydrateBaseActorCombatProfile,
		hydrateBaseActorDraftData: E.hydrateBaseActorDraftData,
		hydrateBaseActors: E.hydrateBaseActors,
		hydrateDetectedSpells: se.hydrateDetectedSpells,
		hydrateItemFolders: E.hydrateItemFolders,
		hydrateMountActorProfile: ae.hydrateMountActorProfile,
		hydrateMountActors: ae.hydrateMountActors,
		hydrateQuickTraits: E.hydrateQuickTraits,
		hydrateSettings: E.hydrateSettings,
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
		optionalTraits: O.optionalTraits,
		quickTraits: f,
		removeCareer: D.removeCareer,
		removeCustomAdvancement: T.removeCustomAdvancement,
		removeCustomSpell: se.removeCustomSpell,
		removeCustomTrait: O.removeCustomTrait,
		removeCustomTrapping: oe.removeCustomTrapping,
		resetAdvancementCurrent: T.resetAdvancementCurrent,
		resetAllAdvancementCurrents: T.resetAllAdvancementCurrents,
		portraitSourceTagSections: ie.portraitSourceTagSections,
		portraitTermSections: ie.portraitTermSections,
		resetDraft: ce,
		retainAvailablePortraitFilterTerms: ie.retainAvailablePortraitFilterTerms,
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
		selectTrappingResolutionCandidate: oe.selectTrappingResolutionCandidate,
		setAdvancementCurrent: T.setAdvancementCurrent,
		setAdvancementTotal: T.setAdvancementTotal,
		setBaseTraitIgnored: O.setBaseTraitIgnored,
		setCareerQuantity: D.setCareerQuantity,
		setMagicGrantLoreResolution: se.setMagicGrantLoreResolution,
		setOptionalTraitSelected: O.setOptionalTraitSelected,
		setPortraitSourceTagSection: ie.setPortraitSourceTagSection,
		setPortraitTermSection: ie.setPortraitTermSection,
		setQuickTraitSelected: O.setQuickTraitSelected,
		setSkillGrantResolution: T.setSkillGrantResolution,
		setSpellSelected: se.setSpellSelected,
		setTraitConfig: O.setTraitConfig,
		setTrappingFallback: oe.setTrappingFallback,
		setTrappingIgnored: oe.setTrappingIgnored,
		setTrappingQuantity: oe.setTrappingQuantity,
		setTrappingResolution: oe.setTrappingResolution,
		settings: m,
		spells: se.spells,
		suggestedActorName: D.suggestedActorName,
		traits: O.traits,
		trappings: oe.trappings
	};
}), Wm = { class: "dui-fieldset-legend" }, Gm = [
	"checked",
	"disabled",
	"onChange"
], Km = { class: "dui-card-actions" }, qm = /* @__PURE__ */ U({
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
			Y("p", null, I(e.prompt.droppedCareer.name) + " appears to belong to the " + I(e.prompt.droppedCareer.careerGroup) + " career track. The following lower-tier candidates were found. ", 1),
			(K(!0), q(G, null, W(e.candidateGroups, (t) => (K(), q("fieldset", {
				key: t.level,
				class: "dui-fieldset"
			}, [Y("legend", Wm, "Tier " + I(t.level || "Unknown"), 1), (K(!0), q(G, null, W(t.candidates, (t) => (K(), q("label", {
				key: t.uuid,
				class: "dui-label"
			}, [Y("input", {
				class: "dui-checkbox dui-checkbox-sm",
				checked: e.isCareerQueued(t.uuid) || e.isLowerCareerSelected(t.uuid),
				disabled: e.isCareerQueued(t.uuid),
				type: "checkbox",
				onChange: (e) => r(t, e)
			}, null, 40, Gm), Y("span", null, [Y("strong", null, I(t.name), 1), Y("small", null, [Z(I(t.careerGroup || "Career") + " ", 1), e.isCareerQueued(t.uuid) ? (K(), q(G, { key: 0 }, [Z(" already queued ")], 64)) : Q("", !0)])])]))), 128))]))), 128)),
			Y("div", Km, [Y("button", {
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
}), Jm = ["aria-labelledby"], Ym = ["id"], Xm = { class: "dui-modal-action" }, Zm = /* @__PURE__ */ U({
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
		let n = e, r = t, i = /* @__PURE__ */ B(null), a = gs();
		return cs(() => n.open, async (e) => {
			await Uo();
			let t = i.value;
			if (e && !t?.open) {
				t?.showModal();
				return;
			}
			!e && t?.open && t.close();
		}, { immediate: !0 }), Ps(() => {
			i.value?.open && i.value.close();
		}), (t, n) => (K(), q("dialog", {
			ref_key: "dialogElement",
			ref: i,
			"aria-labelledby": V(a),
			"aria-modal": "true",
			class: "dui-modal",
			onCancel: n[1] ||= Ju((e) => r("close"), ["prevent"])
		}, [Y("section", { class: F(["dui-modal-box", { "app:max-w-5xl": e.wide }]) }, [
			Y("h2", {
				id: V(a),
				class: "dui-card-title"
			}, I(e.title), 9, Ym),
			Vs(t.$slots, "default"),
			Y("div", Xm, [Y("button", {
				class: "dui-btn",
				type: "button",
				onClick: n[0] ||= (e) => r("close")
			}, I(e.closeLabel), 1)])
		], 2)], 40, Jm));
	}
}), Qm = /* @__PURE__ */ new Map();
function $m(e) {
	let t = e.id.trim();
	if (!t) throw Error("NPC auto-advance strategies must have an id.");
	Qm.set(t, {
		...e,
		id: t
	});
}
function eh() {
	return [...Qm.values()].sort((e, t) => e.name.localeCompare(t.name));
}
function th(e) {
	return Qm.get(e) ?? null;
}
function nh(e, t) {
	return ah(e, t, {
		kinds: ["skill"],
		respectTalentMaximums: !1
	});
}
function rh(e, t) {
	return ah(ah(e, t, {
		kinds: ["talent"],
		respectTalentMaximums: !0
	}), t, {
		kinds: ["skill"],
		respectTalentMaximums: !1
	});
}
function ih(e, t) {
	return ah(e, t, {
		kinds: ["characteristic"],
		respectTalentMaximums: !1
	});
}
function ah(e, t, n) {
	let r = Math.max(0, Math.floor(Number.isFinite(t) ? t : 0)), i = ch(e.advancements), a = Rf(i).total;
	if (a >= r) return { advancements: i };
	let o = !0;
	for (; o;) {
		o = !1;
		for (let e of i) {
			if (!n.kinds.includes(e.kind)) continue;
			let t = oh(e, n);
			if (!t) continue;
			let i = Bf(t) - Bf(e);
			i <= 0 || a + i > r || (e.current = t.current, a += i, o = !0);
		}
	}
	return { advancements: i };
}
function oh(e, t) {
	return t.respectTalentMaximums && e.kind === "talent" && !sh(e) ? null : {
		...e,
		current: e.current + Of(e)
	};
}
function sh(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" ? kf(e) < t : !1;
}
function ch(e) {
	return e.map((e) => ({
		...e,
		sources: e.sources.map((e) => ({ ...e }))
	}));
}
$m({
	description: "Cycles visible Skill rows evenly until no next skill increase fits the target XP.",
	id: "skill-master",
	name: "Skill Master",
	run: nh
}), $m({
	description: "Raises visible Talent rows evenly up to known maximums, then spends any remaining XP like Skill Master.",
	id: "gifted-and-talented",
	name: "Gifted & Talented",
	run: rh
}), $m({
	description: "Cycles visible Characteristic rows evenly until no next characteristic increase fits the target XP.",
	id: "all-natural",
	name: "All Natural",
	run: ih
});
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderAdvancementsTab/advancement-display.ts
function lh(e) {
	let t = e.current - e.careerValue, n = [...e.sources].sort((e, t) => _h(e.kind) - _h(t.kind)).map((e) => uh(e));
	return t !== 0 && n.push(`Manual ${vh(t)}`), n.length ? n.join(", ") : e.includedFromBase ? "Base actor" : "-";
}
function uh(e) {
	return e.kind === "custom" && e.count === 0 ? e.label : `${e.label} ${vh(e.count)}`;
}
function dh(e) {
	return Zd(e) !== null;
}
function fh(e) {
	return Math.max(e.minimumTotal, e.baseValue + e.current);
}
function ph(e) {
	return fh(e);
}
function mh(e) {
	return e.talentMaximumLabel ?? "Unknown";
}
function hh(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" && ph(e) > t;
}
function gh(e) {
	return Bf(e);
}
function _h(e) {
	return e === "characteristic" ? 0 : e === "career" ? 1 : 2;
}
function vh(e) {
	return e > 0 ? `+${e}` : `${e}`;
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderAdvancementsTab/AdvancementRowTailActions.vue?vue&type=script&setup=true&lang.ts
var yh = ["disabled"], bh = /* @__PURE__ */ U({
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
		}, " Reset ", 8, yh), e.entry.includedFromCustom ? (K(), q("button", {
			key: 0,
			class: "dui-join-item dui-btn dui-btn-sm",
			title: "Remove dropped entry",
			type: "button",
			onClick: r[1] ||= (e) => n("removeCustom")
		}, " Remove Dropped ")) : Q("", !0)], 64));
	}
}), xh = { class: "dui-card dui-card-border dui-card-sm" }, Sh = { class: "dui-card-body" }, Ch = { class: "dui-card-title" }, wh = {
	key: 0,
	class: "dui-badge dui-badge-primary"
}, Th = { key: 0 }, Eh = /* @__PURE__ */ U({
	__name: "NpcBuilderSection",
	props: {
		description: { default: "" },
		number: { default: "" },
		title: {}
	},
	setup(e) {
		return (t, n) => (K(), q("section", xh, [Y("div", Sh, [
			Y("h2", Ch, [e.number ? (K(), q("span", wh, I(e.number), 1)) : Q("", !0), Z(" " + I(e.title), 1)]),
			e.description ? (K(), q("p", Th, I(e.description), 1)) : Q("", !0),
			Vs(t.$slots, "default")
		])]));
	}
}), Dh = {
	key: 0,
	class: "dui-card-actions"
}, Oh = {
	key: 1,
	class: "dui-alert dui-alert-info"
}, kh = { class: "dui-list" }, Ah = { class: "dui-list-col-grow" }, jh = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, Mh = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, Nh = { class: "dui-join" }, Ph = ["disabled", "onClick"], Fh = [
	"aria-label",
	"value",
	"onInput"
], Ih = ["onClick"], Lh = {
	key: 2,
	class: "dui-alert"
}, Rh = /* @__PURE__ */ U({
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
		return (t, i) => (K(), J(Eh, {
			number: e.sectionNumber,
			title: e.title
		}, {
			default: H(() => [
				e.manualAdvanceCount ? (K(), q("div", Dh, [Y("span", null, I(e.manualAdvanceCount) + " manual edits", 1), Y("button", {
					class: "dui-btn dui-btn-sm",
					type: "button",
					onClick: i[0] ||= (e) => n("resetAll")
				}, " Reset All Advances ")])) : Q("", !0),
				e.estimatedNpcXp ? (K(), q("div", Oh, [
					Y("strong", null, "Estimated NPC XP " + I(e.estimatedNpcXp.total), 1),
					Y("span", null, I(e.estimatedNpcXp.characteristics) + " characteristics", 1),
					Y("span", null, I(e.estimatedNpcXp.skills) + " skills", 1),
					Y("span", null, I(e.estimatedNpcXp.talents) + " talents", 1)
				])) : Q("", !0),
				Y("ul", kh, [(K(!0), q(G, null, W(e.entries, (t) => (K(), q("li", {
					key: `${t.kind}:${t.name}`,
					class: "dui-list-row"
				}, [Y("div", Ah, [
					Y("strong", null, I(t.name), 1),
					t.current === t.careerValue ? Q("", !0) : (K(), q("span", jh, " Manual edit ")),
					e.showSkillSpecializationBadges && V(dh)(t.name) ? (K(), q("span", Mh, " Needs specialization ")) : Q("", !0),
					Y("span", null, " Base " + I(t.baseValue) + " · Advances " + I(t.current) + " · XP " + I(V(gh)(t)), 1),
					Y("small", null, "Sources: " + I(V(lh)(t)), 1)
				]), Y("div", Nh, [
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						disabled: V(fh)(t) <= t.minimumTotal,
						title: "Decrease by 5",
						type: "button",
						onClick: (e) => n("adjustCurrent", t, -1)
					}, " -5 ", 8, Ph),
					Y("input", {
						class: "dui-join-item dui-input dui-input-sm",
						"aria-label": `Total ${t.name}`,
						value: V(fh)(t),
						min: "0",
						type: "number",
						onInput: (e) => r(t, e)
					}, null, 40, Fh),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						title: "Increase by 5",
						type: "button",
						onClick: (e) => n("adjustCurrent", t, 1)
					}, " +5 ", 8, Ih),
					X(bh, {
						entry: t,
						onRemoveCustom: (e) => n("removeCustom", t),
						onResetCurrent: (e) => n("resetCurrent", t)
					}, null, 8, [
						"entry",
						"onRemoveCustom",
						"onResetCurrent"
					])
				])]))), 128))]),
				e.entries.length ? Q("", !0) : (K(), q("p", Lh, "No " + I(e.title.toLowerCase()) + " to advance yet.", 1))
			]),
			_: 1
		}, 8, ["number", "title"]));
	}
}), zh = { class: "dui-fieldset" }, Bh = ["value"], Vh = { class: "dui-fieldset" }, Hh = ["value"], Uh = ["value"], Wh = { key: 0 }, Gh = { class: "dui-card-actions" }, Kh = ["disabled"], qh = /* @__PURE__ */ U({
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
		return (t, a) => (K(), J(Eh, {
			description: "Spend toward a target without exceeding it. Existing manual edits are preserved.",
			number: "4",
			title: "Auto Advance"
		}, {
			default: H(() => [
				Y("fieldset", zh, [a[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Target XP", -1), Y("input", {
					"aria-label": "Target XP",
					class: "dui-input dui-input-sm",
					value: e.targetXp,
					min: "0",
					type: "number",
					onInput: r
				}, null, 40, Bh)]),
				Y("fieldset", Vh, [a[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "Strategy", -1), Y("select", {
					"aria-label": "Auto advance strategy",
					class: "dui-select dui-select-sm",
					value: e.selectedAutoAdvanceStrategyId,
					onChange: i
				}, [(K(!0), q(G, null, W(e.autoAdvanceStrategies, (e) => (K(), q("option", {
					key: e.id,
					value: e.id
				}, I(e.name), 9, Uh))), 128))], 40, Hh)]),
				e.selectedAutoAdvanceStrategy ? (K(), q("p", Wh, I(e.selectedAutoAdvanceStrategy.description), 1)) : Q("", !0),
				Y("div", Gh, [Y("button", {
					class: "dui-btn dui-btn-primary dui-btn-sm",
					disabled: !e.canRunAutoAdvance,
					title: "Advance rows as close to the target XP as possible without going over",
					type: "button",
					onClick: a[0] ||= (e) => n("runAutoAdvance")
				}, " Auto Advance ", 8, Kh)])
			]),
			_: 1
		}));
	}
}), Jh = { class: "dui-card-actions" }, Yh = ["disabled"], Xh = { class: "dui-list" }, Zh = { class: "dui-list-col-grow" }, Qh = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, $h = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, eg = { class: "dui-join" }, tg = ["disabled", "onClick"], ng = [
	"aria-label",
	"value",
	"onInput"
], rg = ["onClick"], ig = {
	key: 0,
	class: "dui-alert"
}, ag = /* @__PURE__ */ U({
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
		return (t, i) => (K(), J(Eh, {
			number: "3",
			title: "Talents"
		}, {
			default: H(() => [
				Y("div", Jh, [Y("span", null, I(e.maximizableTalentCount) + " below maximum", 1), Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: e.maximizableTalentCount === 0,
					title: "Raise talents with known maximums to their maximum ranks",
					type: "button",
					onClick: i[0] ||= (e) => n("maximizeTalents")
				}, " Maximize Talents ", 8, Yh)]),
				Y("ul", Xh, [(K(!0), q(G, null, W(e.talents, (e) => (K(), q("li", {
					key: `${e.kind}:${e.name}`,
					class: "dui-list-row"
				}, [Y("div", Zh, [
					Y("strong", null, I(e.name), 1),
					e.current === e.careerValue ? Q("", !0) : (K(), q("span", Qh, " Manual edit ")),
					Y("span", null, " Ranks " + I(V(ph)(e)) + " · Maximum " + I(V(mh)(e)) + " · XP " + I(V(gh)(e)), 1),
					Y("small", null, "Sources: " + I(V(lh)(e)), 1),
					V(hh)(e) ? (K(), q("span", $h, " Over maximum ")) : Q("", !0)
				]), Y("div", eg, [
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						disabled: V(ph)(e) <= e.minimumTotal,
						title: "Decrease by 1",
						type: "button",
						onClick: (t) => n("adjustCurrent", e, -1)
					}, " -1 ", 8, tg),
					Y("input", {
						class: "dui-join-item dui-input dui-input-sm",
						"aria-label": `Ranks ${e.name}`,
						value: V(ph)(e),
						min: "0",
						type: "number",
						onInput: (t) => r(e, t)
					}, null, 40, ng),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						title: "Increase by 1",
						type: "button",
						onClick: (t) => n("adjustCurrent", e, 1)
					}, " +1 ", 8, rg),
					X(bh, {
						entry: e,
						onRemoveCustom: (t) => n("removeCustom", e),
						onResetCurrent: (t) => n("resetCurrent", e)
					}, null, 8, [
						"entry",
						"onRemoveCustom",
						"onResetCurrent"
					])
				])]))), 128))]),
				e.talents.length ? Q("", !0) : (K(), q("p", ig, "No talents to advance yet."))
			]),
			_: 1
		}));
	}
}), og = /* @__PURE__ */ U({
	__name: "NpcBuilderAdvancementsTab",
	props: { page: {} },
	setup(e) {
		let t = Um(), { advancements: n, estimatedNpcXp: r, maximizableTalentCount: i } = Id(t), a = eh(), o = /* @__PURE__ */ B("skill-master"), s = /* @__PURE__ */ B(0), c = $(() => n.value.filter((e) => e.kind === "characteristic")), l = $(() => n.value.filter((e) => e.kind === "skill")), u = $(() => n.value.filter((e) => e.kind === "talent")), d = $(() => n.value.filter((e) => e.current !== e.careerValue).length), f = $(() => th(o.value) ?? a[0] ?? null), p = $(() => f.value !== null && s.value > r.value.total);
		cs(() => r.value.total, (e) => {
			s.value < e && (s.value = e);
		}, { immediate: !0 });
		function m() {
			let e = f.value;
			e && t.applyAutoAdvance(e, s.value);
		}
		return (n, h) => (K(), q("section", null, [e.page === "detail-characteristics" ? (K(), J(Rh, {
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
		])) : e.page === "detail-skills" ? (K(), J(Rh, {
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
		])) : e.page === "detail-talents" ? (K(), J(ag, {
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
		])) : (K(), J(qh, {
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
function sg(e) {
	return [
		`Ch ${e.grants.characteristics.length}`,
		`Sk ${e.grants.skills.length}`,
		`Ta ${e.grants.talents.length}`,
		`Tr ${e.grants.trappings.length}`
	].join(" / ");
}
function cg(e) {
	let t = e.slice(0, 3).join(", "), n = e.length - 3;
	return e.length ? n > 0 ? `${t}, +${n}` : t : "-";
}
function lg(e) {
	return e.split(/\s+/).map((e) => e.at(0)).filter(Boolean).slice(0, 2).join("").toLocaleUpperCase();
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/BaseActorPanel.vue?vue&type=script&setup=true&lang.ts
var ug = { class: "dui-fieldset" }, dg = ["value"], fg = { class: "dui-fieldset" }, pg = ["disabled", "value"], mg = { value: "" }, hg = ["value"], gg = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, _g = {
	key: 1,
	class: "dui-alert"
}, vg = {
	key: 0,
	class: "dui-avatar"
}, yg = { class: "app:size-16 app:shrink-0 app:rounded-lg" }, bg = ["src"], xg = {
	key: 1,
	class: "dui-badge"
}, Sg = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(Eh, {
			description: e.description,
			number: e.number,
			title: e.title
		}, {
			default: H(() => [
				Y("fieldset", ug, [n[0] ||= Y("legend", { class: "dui-fieldset-legend" }, "Search world actors", -1), Y("input", {
					"aria-label": "Search world actors",
					class: "dui-input dui-input-sm",
					value: e.actorFilter,
					placeholder: "Filter actors",
					type: "search",
					onInput: r
				}, null, 40, dg)]),
				Y("fieldset", fg, [n[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Base statblock", -1), Y("select", {
					"aria-label": "Base statblock",
					class: "dui-select dui-select-sm",
					disabled: e.isLoadingActors,
					value: e.selectedBaseActorUuid,
					onChange: i
				}, [Y("option", mg, I(e.isLoadingActors ? "Loading actors..." : "Choose an actor"), 1), (K(!0), q(G, null, W(e.filteredActors, (e) => (K(), q("option", {
					key: e.uuid,
					value: e.uuid
				}, I(e.name), 9, hg))), 128))], 40, pg)]),
				e.errorMessage ? (K(), q("p", gg, I(e.errorMessage), 1)) : Q("", !0),
				e.selectedBaseActor ? (K(), q("article", _g, [e.selectedBaseActor.img ? (K(), q("div", vg, [Y("div", yg, [Y("img", {
					src: e.selectedBaseActor.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "64",
					width: "64"
				}, null, 8, bg)])])) : (K(), q("span", xg, I(V(lg)(e.selectedBaseActor.name)), 1)), Y("div", null, [Y("strong", null, I(e.selectedBaseActor.name), 1), Y("span", null, [
					Z(I(e.selectedBaseActor.species || "Species not found") + " ", 1),
					e.selectedBaseActor.type ? (K(), q(G, { key: 0 }, [Z(" - " + I(e.selectedBaseActor.type), 1)], 64)) : Q("", !0),
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
}), Cg = { class: "dui-card-actions" }, wg = { class: "dui-stats dui-stats-vertical app:w-full" }, Tg = { class: "dui-stat" }, Eg = { class: "dui-stat-value" }, Dg = {
	key: 0,
	class: "dui-stat-desc"
}, Og = { class: "dui-stat" }, kg = { class: "dui-stat-value" }, Ag = {
	key: 0,
	class: "dui-stat-desc"
}, jg = {
	key: 1,
	class: "dui-stat-desc"
}, Mg = { class: "dui-stat" }, Ng = { class: "dui-stat-value" }, Pg = { class: "dui-stat" }, Fg = { class: "dui-stat-value" }, Ig = { class: "dui-stat" }, Lg = { class: "dui-stat-value" }, Rg = { class: "dui-stat-desc" }, zg = {
	key: 0,
	class: "dui-alert dui-alert-warning",
	role: "alert"
}, Bg = { key: 1 }, Vg = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(Eh, {
			number: "4",
			title: "Build Preview"
		}, {
			default: H(() => [
				Y("div", Cg, [Y("span", { class: F(["dui-badge", e.buildPreviewStatus === "Ready" ? "dui-badge-success" : "dui-badge-warning"]) }, I(e.buildPreviewStatus), 3)]),
				Y("div", wg, [
					Y("div", Tg, [
						n[0] ||= Y("span", { class: "dui-stat-title" }, "Advances", -1),
						Y("strong", Eg, I(e.advancementCount), 1),
						e.editedAdvanceCount ? (K(), q("small", Dg, I(e.editedAdvanceCount) + " manually edited ", 1)) : Q("", !0)
					]),
					Y("div", Og, [
						n[1] ||= Y("span", { class: "dui-stat-title" }, "Trappings", -1),
						Y("strong", kg, I(e.visibleTrappingCount), 1),
						e.fallbackTrappingCount ? (K(), q("small", Ag, I(e.fallbackTrappingCount) + " blank fallback ", 1)) : Q("", !0),
						e.ignoredTrappingCount ? (K(), q("small", jg, I(e.ignoredTrappingCount) + " ignored ", 1)) : Q("", !0)
					]),
					Y("div", Mg, [n[2] ||= Y("span", { class: "dui-stat-title" }, "Traits", -1), Y("strong", Ng, I(e.traitCount), 1)]),
					Y("div", Pg, [n[3] ||= Y("span", { class: "dui-stat-title" }, "Spells", -1), Y("strong", Fg, I(e.selectedSpellCount), 1)]),
					Y("div", Ig, [
						n[4] ||= Y("span", { class: "dui-stat-title" }, "Estimated NPC XP", -1),
						Y("strong", Lg, I(e.estimatedNpcXp.total), 1),
						Y("small", Rg, I(e.estimatedNpcXp.characteristics) + " char / " + I(e.estimatedNpcXp.skills) + " skill / " + I(e.estimatedNpcXp.talents) + " talent ", 1)
					])
				]),
				e.buildPreviewWarnings.length ? (K(), q("div", zg, [Y("div", null, [(K(!0), q(G, null, W(e.buildPreviewWarnings, (e) => (K(), q("p", { key: e }, I(e), 1))), 128))])])) : (K(), q("p", Bg, " The draft has a base Actor, queued Career data, resolved trappings, and a portrait ready to apply. "))
			]),
			_: 1
		}));
	}
}), Hg = { class: "dui-list" }, Ug = { class: "dui-list-row" }, Wg = { class: "dui-list-row" }, Gg = { class: "dui-list-row" }, Kg = { class: "dui-list-row" }, qg = { class: "dui-list-row" }, Jg = { class: "dui-list-row" }, Yg = { class: "dui-list-row" }, Xg = /* @__PURE__ */ U({
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
		return (t, n) => (K(), q("dl", Hg, [
			Y("div", Ug, [n[0] ||= Y("dt", null, "Build name", -1), Y("dd", null, I(e.finalActorName), 1)]),
			Y("div", Wg, [n[1] ||= Y("dt", null, "Base actor", -1), Y("dd", null, I(e.baseActorName), 1)]),
			Y("div", Gg, [n[2] ||= Y("dt", null, "Final career", -1), Y("dd", null, I(e.finalCareerName), 1)]),
			Y("div", Kg, [n[3] ||= Y("dt", null, "Career items", -1), Y("dd", null, I(e.careerItemCount), 1)]),
			Y("div", qg, [n[4] ||= Y("dt", null, "Apply", -1), Y("dd", null, I(e.advancementCount) + " advance rows, " + I(e.visibleTrappingCount) + " trappings, " + I(e.traitCount) + " traits, " + I(e.selectedSpellCount) + " spells ", 1)]),
			Y("div", Jg, [n[5] ||= Y("dt", null, "Extracted grants", -1), Y("dd", null, I(e.grantTotals.characteristics) + " characteristics, " + I(e.grantTotals.skills) + " skills, " + I(e.grantTotals.talents) + " talents, " + I(e.grantTotals.trappings) + " trappings ", 1)]),
			Y("div", Yg, [n[6] ||= Y("dt", null, "Estimated NPC XP", -1), Y("dd", null, I(e.estimatedNpcXpTotal), 1)])
		]));
	}
}), Zg = { class: "app:grid app:gap-3" }, Qg = { class: "app:flex app:flex-wrap app:items-start app:gap-3" }, $g = ["aria-label", "disabled"], e_ = ["src"], t_ = { key: 1 }, n_ = { key: 2 }, r_ = { class: "app:flex app:min-w-48 app:flex-1 app:flex-col app:items-start app:gap-2" }, i_ = ["title"], a_ = {
	key: 1,
	class: "app:text-base-content/70"
}, o_ = ["disabled"], s_ = {
	key: 0,
	"aria-live": "polite",
	role: "status"
}, c_ = ["value"], l_ = {
	key: 1,
	class: "dui-fieldset"
}, u_ = { class: "dui-fieldset-legend" }, d_ = { key: 0 }, f_ = { key: 1 }, p_ = { class: "app:flex app:flex-wrap app:gap-2" }, m_ = [
	"aria-label",
	"aria-pressed",
	"title",
	"onClick"
], h_ = ["src"], g_ = ["aria-label"], __ = /* @__PURE__ */ U({
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
		return (t, r) => (K(), q("section", Zg, [
			Y("div", Qg, [Y("button", {
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
			}, null, 8, e_)) : e.finalCareer ? (K(), q("strong", t_, I(V(lg)(e.finalCareer.name)), 1)) : (K(), q("span", n_, "No portrait"))], 8, $g), Y("div", r_, [
				r[3] ||= Y("span", { class: "dui-badge dui-badge-outline" }, "Current portrait", -1),
				Y("strong", null, I(e.selectedPortraitCandidate?.label ?? "No portrait selected"), 1),
				e.finalPortraitPath ? (K(), q("small", {
					key: 0,
					class: "app:break-all app:text-base-content/70",
					title: e.finalPortraitPath
				}, I(e.finalPortraitPath), 9, i_)) : (K(), q("span", a_, " A Career or base Actor image will be used when available. ")),
				Y("button", {
					class: "dui-btn dui-btn-outline dui-btn-sm",
					disabled: !e.portraitCandidates.length,
					type: "button",
					onClick: r[1] ||= (e) => n("openGallery")
				}, " Browse " + I(e.portraitCandidates.length) + " portraits ", 9, o_)
			])]),
			e.isLoadingPortraitCandidates && e.portraitSearchProgress ? (K(), q("div", s_, [Y("progress", {
				"aria-label": "Portrait search progress",
				class: "dui-progress dui-progress-info app:w-full",
				value: e.portraitSearchProgressValue,
				max: "100"
			}, null, 8, c_), Y("small", null, I(e.portraitSearchProgressLabel), 1)])) : Q("", !0),
			e.portraitCandidates.length || e.isLoadingPortraitCandidates ? (K(), q("fieldset", l_, [Y("legend", u_, [r[4] ||= Y("span", null, "Quick picks", -1), e.isLoadingPortraitCandidates ? (K(), q("span", d_, "Updating...")) : (K(), q("span", f_, I(e.portraitCandidates.length) + " options", 1))]), Y("div", p_, [(K(!0), q(G, null, W(e.compactPortraitCandidates, (t) => (K(), q("button", {
				key: t.key,
				"aria-label": V(Pp)(t),
				"aria-pressed": t.key === e.selectedPortraitCandidateKey,
				class: F(["dui-btn dui-btn-square app:overflow-hidden app:p-1", { "dui-btn-active dui-btn-outline": t.key === e.selectedPortraitCandidateKey }]),
				title: V(Np)(t),
				type: "button",
				onClick: (e) => n("selectPortrait", t)
			}, [Y("img", {
				alt: "",
				class: "app:h-full app:w-full app:rounded-box app:object-cover",
				height: "64",
				loading: "lazy",
				src: t.img,
				width: "64"
			}, null, 8, h_)], 10, m_))), 128)), e.hiddenPortraitCandidateCount > 0 ? (K(), q("button", {
				key: 0,
				"aria-label": `Open ${e.hiddenPortraitCandidateCount} more portrait options`,
				class: "dui-btn dui-btn-square",
				type: "button",
				onClick: r[2] ||= (e) => n("openGallery")
			}, " +" + I(e.hiddenPortraitCandidateCount), 9, g_)) : Q("", !0)])])) : Q("", !0)
		]));
	}
}), v_ = { class: "app:grid app:gap-3 md:app:sticky md:app:top-28 md:app:max-h-[calc(100vh-10rem)] md:app:self-start md:app:overflow-y-auto" }, y_ = { class: "dui-fieldset" }, b_ = ["placeholder", "value"], x_ = { class: "app:hidden md:app:grid md:app:gap-3" }, S_ = { class: "dui-collapse dui-collapse-arrow dui-card-border" }, C_ = { class: "dui-collapse-content" }, w_ = /* @__PURE__ */ U({
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
		return (t, i) => (K(), q("aside", v_, [X(Eh, {
			description: "The generated Actor identity stays visible while Build NPC controls change.",
			title: "Preview"
		}, {
			default: H(() => [X(__, {
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
			]), Y("fieldset", y_, [i[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "NPC name", -1), Y("input", {
				"aria-label": "NPC name",
				class: "dui-input dui-input-sm",
				placeholder: e.suggestedActorName,
				value: e.actorName,
				type: "text",
				onInput: r
			}, null, 40, b_)])]),
			_: 1
		}), Y("div", x_, [X(Vg, {
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
		]), Y("details", S_, [i[3] ||= Y("summary", { class: "dui-collapse-title" }, "Complete build details", -1), Y("div", C_, [X(Xg, {
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
}), T_ = {
	key: 0,
	class: "dui-list app:gap-1"
}, E_ = [
	"onDragenter",
	"onDragover",
	"onDrop"
], D_ = ["onDragstart"], O_ = {
	key: 0,
	class: "dui-avatar"
}, k_ = { class: "app:size-10 app:rounded-md" }, A_ = ["src"], j_ = {
	key: 1,
	class: "dui-badge dui-badge-sm"
}, M_ = { class: "dui-list-col-grow app:min-w-0" }, N_ = { class: "app:flex app:min-w-0 app:flex-wrap app:items-center app:gap-1" }, P_ = { class: "app:truncate" }, F_ = {
	key: 0,
	class: "dui-badge dui-badge-info dui-badge-xs"
}, I_ = {
	key: 1,
	class: "dui-badge dui-badge-info dui-badge-xs"
}, L_ = { class: "app:flex app:min-w-0 app:items-center app:gap-2 app:text-xs" }, R_ = { class: "app:shrink-0" }, z_ = ["title"], B_ = { class: "app:flex app:items-center app:justify-end app:gap-1" }, V_ = { class: "app:flex app:items-center app:gap-1 app:text-xs" }, H_ = ["value", "onInput"], U_ = { class: "dui-join" }, W_ = ["disabled", "onClick"], G_ = ["disabled", "onClick"], K_ = ["onClick"], q_ = {
	key: 1,
	class: "dui-alert"
}, J_ = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(Eh, {
			description: "Careers are applied in this order. Drag rows or use the buttons to reorder them.",
			number: "2",
			title: "Career Queue"
		}, {
			default: H(() => [e.careers.length ? (K(), q("ol", T_, [(K(!0), q(G, null, W(e.careers, (t, a) => (K(), q("li", {
				key: t.uuid,
				class: F(["dui-list-row app:grid-cols-[auto_auto_minmax(0,1fr)_auto] app:items-center app:gap-2 app:rounded-md app:px-2 app:py-2", {
					"app:border-t-2 app:border-dashed app:border-info": i(a) === "before",
					"app:border-b-2 app:border-dashed app:border-info": i(a) === "after",
					"app:opacity-60": e.draggedCareerIndex === a
				}]),
				onDragenter: Ju((e) => r("careerDragEnter", a), ["prevent", "stop"]),
				onDragover: (e) => r("careerDragOver", a, e),
				onDrop: (e) => r("careerDropOnRow", a, e)
			}, [
				Y("span", {
					"aria-hidden": "true",
					class: F(["dui-badge dui-badge-ghost dui-badge-sm app:cursor-grab", { "app:cursor-grabbing": e.draggedCareerIndex === a }]),
					draggable: "true",
					title: "Drag to reorder",
					onDragend: n[0] ||= (e) => r("careerDragEnd"),
					onDragstart: (e) => r("careerDragStart", a, e)
				}, " Drag ", 42, D_),
				t.img ? (K(), q("div", O_, [Y("div", k_, [Y("img", {
					src: t.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "40",
					width: "40"
				}, null, 8, A_)])])) : (K(), q("span", j_, I(V(lg)(t.name)), 1)),
				Y("div", M_, [Y("div", N_, [Y("strong", P_, I(t.name), 1), e.draggedCareerIndex === a ? (K(), q("span", F_, " Dragging ")) : i(a) ? (K(), q("span", I_, " Place " + I(i(a)), 1)) : Q("", !0)]), Y("div", L_, [Y("span", R_, [Z(I(t.careerGroup || "Career") + " ", 1), t.level === null ? Q("", !0) : (K(), q(G, { key: 0 }, [Z(" level " + I(t.level), 1)], 64))]), Y("small", {
					class: "dui-badge dui-badge-ghost dui-badge-sm app:min-w-0 app:truncate",
					title: [
						`Characteristics: ${V(cg)(t.grants.characteristics)}`,
						`Skills: ${V(cg)(t.grants.skills)}`,
						`Talents: ${V(cg)(t.grants.talents)}`,
						`Trappings: ${V(cg)(t.grants.trappings)}`
					].join("\n")
				}, I(V(sg)(t)), 9, z_)])]),
				Y("div", B_, [Y("label", V_, [n[1] ||= Z(" Qty ", -1), Y("input", {
					class: "dui-input dui-input-xs app:w-14",
					value: t.quantity,
					min: "1",
					type: "number",
					onInput: (e) => r("careerQuantityInput", a, e)
				}, null, 40, H_)]), Y("div", U_, [
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						disabled: a === 0,
						title: "Move career earlier",
						type: "button",
						onClick: (e) => r("moveCareer", a, -1)
					}, " Up ", 8, W_),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						disabled: a === e.careers.length - 1,
						title: "Move career later",
						type: "button",
						onClick: (e) => r("moveCareer", a, 1)
					}, " Down ", 8, G_),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						type: "button",
						onClick: (e) => r("removeCareer", a)
					}, " Remove ", 8, K_)
				])])
			], 42, E_))), 128))])) : (K(), q("p", q_, "No careers queued yet."))]),
			_: 1
		}));
	}
}), Y_ = { class: "app:grid app:gap-2" }, X_ = { class: "app:flex app:flex-wrap app:items-center app:gap-2" }, Z_ = { class: "dui-join app:min-w-64 app:flex-1" }, Q_ = { class: "dui-input dui-input-sm dui-join-item app:flex-1" }, $_ = ["onKeydown"], ev = { class: "dui-badge dui-badge-sm dui-badge-outline" }, tv = { class: "app:grid app:gap-2 md:app:grid-cols-3" }, nv = [
	"onDragenter",
	"onDragleave",
	"onDragover",
	"onDrop"
], rv = { class: "dui-card-body app:gap-2 app:p-2" }, iv = { class: "app:flex app:items-center app:gap-2" }, av = { class: "dui-card-title app:m-0 app:text-sm" }, ov = { class: "dui-badge dui-badge-sm" }, sv = {
	key: 0,
	"aria-live": "polite",
	class: "dui-badge dui-badge-info dui-badge-sm app:ml-auto"
}, cv = { class: "app:flex app:min-h-8 app:flex-wrap app:items-center app:gap-2" }, lv = [
	"title",
	"onClick",
	"onDragstart",
	"onKeydown"
], uv = {
	key: 0,
	class: "app:text-base-content/60"
}, dv = { class: "dui-card-body app:flex-row app:items-center app:justify-center app:gap-2 app:p-2" }, fv = { "aria-live": "polite" }, pv = /* @__PURE__ */ U({
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
			t.stopPropagation(), a.value = e, t.dataTransfer?.setData("text/plain", Op(e.id)), t.dataTransfer?.setData(bp, e.id), t.dataTransfer && (t.dataTransfer.effectAllowed = "move");
		}
		function d(e, t) {
			t.preventDefault(), t.stopPropagation(), o.value = e, t.dataTransfer && (t.dataTransfer.dropEffect = _(a.value, e) ? "move" : "none");
		}
		function f(e, t) {
			t.stopPropagation(), !(t.currentTarget instanceof Node && t.relatedTarget instanceof Node && t.currentTarget.contains(t.relatedTarget)) && o.value === e && (o.value = null);
		}
		function p(e, t) {
			t.preventDefault(), t.stopPropagation();
			let i = t.dataTransfer?.getData("application/x-wfrp4e-customizer-portrait-filter-tag") || kp(t.dataTransfer?.getData("text/plain") ?? ""), o = a.value ?? n.tags.find((e) => e.id === i) ?? null;
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
		return (t, n) => (K(), q("section", Y_, [
			Y("div", X_, [Y("div", Z_, [Y("label", Q_, [n[5] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-magnifying-glass"
			}, null, -1), ts(Y("input", {
				"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
				"aria-label": "Add a portrait search term",
				class: "app:grow",
				placeholder: "Add a search term",
				type: "search",
				onKeydown: Xu(Ju(l, ["prevent"]), ["enter"])
			}, null, 40, $_), [[zu, i.value]])]), Y("button", {
				class: "dui-btn dui-btn-sm dui-join-item",
				type: "button",
				onClick: l
			}, [...n[6] ||= [Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-plus"
			}, null, -1), Z(" Add ", -1)]])]), Y("span", ev, I(e.resultCount) + " images", 1)]),
			Y("div", tv, [(K(), q(G, null, W(s, (e) => Y("section", {
				key: e.id,
				class: F(["dui-card dui-card-border dui-card-sm app:min-h-20 app:border-base-content/30 app:bg-base-200 app:shadow-sm", { "app:border-info app:bg-info/10 app:ring-2 app:ring-info": o.value === e.id }]),
				onDragenter: (t) => d(e.id, t),
				onDragleave: (t) => f(e.id, t),
				onDragover: (t) => d(e.id, t),
				onDrop: (t) => p(e.id, t)
			}, [Y("div", rv, [Y("header", iv, [
				Y("h3", av, [Y("i", {
					"aria-hidden": "true",
					class: F(["fa-solid", e.icon])
				}, null, 2), Z(" " + I(e.title), 1)]),
				Y("span", ov, I(c.value[e.id].length), 1),
				o.value === e.id ? (K(), q("span", sv, I(v(e.id)), 1)) : Q("", !0)
			]), Y("div", cv, [(K(!0), q(G, null, W(c.value[e.id], (e) => (K(), q("button", {
				key: e.id,
				class: F(["dui-badge dui-badge-sm app:h-auto app:cursor-grab app:whitespace-normal app:py-1", [e.kind === "source" ? "dui-badge-outline" : "dui-badge-primary", a.value?.id === e.id ? "app:opacity-50" : ""]]),
				draggable: "true",
				title: `Drag ${e.label} to another group, or select it to move it to the next group.`,
				type: "button",
				onClick: (t) => m(e),
				onDragend: g,
				onDragstart: (t) => u(e, t),
				onKeydown: Xu(Ju((t) => h(e), ["prevent"]), ["delete"])
			}, I(e.label), 43, lv))), 128)), c.value[e.id].length ? Q("", !0) : (K(), q("small", uv, " Drop tags here "))])])], 42, nv)), 64))]),
			Y("div", {
				"aria-label": "Remove search tag",
				class: F(["dui-card dui-card-border dui-card-sm app:border-dashed app:border-base-content/30 app:bg-base-200", {
					"app:border-error app:bg-error/10 app:ring-2 app:ring-error": o.value === "removed" && !a.value?.canRemove,
					"app:border-warning app:bg-warning/10 app:ring-2 app:ring-warning": o.value === "removed" && a.value?.canRemove
				}]),
				onDragenter: n[1] ||= (e) => d("removed", e),
				onDragleave: n[2] ||= (e) => f("removed", e),
				onDragover: n[3] ||= (e) => d("removed", e),
				onDrop: n[4] ||= (e) => p("removed", e)
			}, [Y("div", dv, [n[7] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-trash"
			}, null, -1), Y("span", fv, I(y.value), 1)])], 34)
		]));
	}
}), mv = ["aria-busy"], hv = {
	key: 0,
	class: "dui-alert dui-alert-error app:min-h-0 app:py-2",
	role: "alert"
}, gv = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info app:min-h-0 app:gap-2 app:py-2",
	role: "status"
}, _v = { class: "app:flex app:min-w-0 app:flex-1 app:items-center app:gap-2" }, vv = { class: "app:shrink-0" }, yv = ["value"], bv = {
	key: 2,
	class: "dui-alert dui-alert-warning app:min-h-0 app:py-2"
}, xv = { class: "dui-list app:m-0 app:grid app:grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] app:gap-3 app:p-0" }, Sv = [
	"aria-label",
	"aria-pressed",
	"title",
	"onClick"
], Cv = ["loading", "src"], wv = { class: "app:flex app:flex-wrap app:items-center app:justify-between app:gap-1" }, Tv = {
	key: 0,
	class: "dui-badge dui-badge-success dui-badge-sm"
}, Ev = { class: "app:text-sm" }, Dv = {
	key: 4,
	class: "dui-alert"
}, Ov = /* @__PURE__ */ U({
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
			X(pv, {
				"result-count": e.options.length,
				tags: e.tags,
				onCreateSearchTerm: i[0] ||= (e) => r("createSearchTerm", e),
				onFilterTagSectionChange: i[1] ||= (e, t) => r("filterTagSectionChange", e, t)
			}, null, 8, ["result-count", "tags"]),
			e.errorMessage ? (K(), q("div", hv, [i[2] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-triangle-exclamation"
			}, null, -1), Y("span", null, I(e.errorMessage), 1)])) : Q("", !0),
			e.isLoading ? (K(), q("div", gv, [i[3] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-spinner fa-spin"
			}, null, -1), Y("div", _v, [Y("small", vv, I(e.progressLabel || "Updating results..."), 1), Y("progress", {
				"aria-label": "Portrait search progress",
				class: "dui-progress app:min-w-24 app:flex-1",
				value: e.progressValue,
				max: "100"
			}, null, 8, yv)])])) : e.searchTerms.length && !e.options.length ? (K(), q("p", bv, " No portraits match the current filter tags. ")) : Q("", !0),
			e.options.length ? (K(), q("div", {
				key: 3,
				class: F(["app:pr-1", e.fillHeight ? "app:min-h-48 app:flex-1 app:overflow-y-auto" : "app:max-h-[30rem] app:overflow-y-auto"])
			}, [Y("ul", xv, [(K(!0), q(G, null, W(e.options, (t, n) => (K(), q("li", { key: t.key }, [Y("button", {
				"aria-label": V(Pp)(t),
				"aria-pressed": t.key === e.selectedOptionKey,
				class: F(["dui-btn app:h-auto app:min-h-0 app:w-full app:flex-col app:items-stretch app:justify-start app:gap-2 app:overflow-hidden app:whitespace-normal app:p-2 app:text-left", t.key === e.selectedOptionKey ? "dui-btn-active dui-btn-outline" : "dui-btn-ghost"]),
				title: V(Np)(t),
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
				}, null, 8, Cv),
				Y("span", wv, [Y("small", null, I(V(Fp)(t)), 1), t.key === e.selectedOptionKey ? (K(), q("span", Tv, " Selected ")) : Q("", !0)]),
				Y("strong", Ev, I(t.label), 1)
			], 10, Sv)]))), 128))])], 2)) : e.isLoading ? Q("", !0) : (K(), q("p", Dv, I(n.emptyMessage), 1))
		], 8, mv));
	}
}), kv = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(Zm, {
			"close-label": "Done",
			open: e.open,
			title: "Choose an NPC Portrait",
			wide: "",
			onClose: r[3] ||= (e) => n("close")
		}, {
			default: H(() => [X(Ov, {
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
}), Av = {
	key: 0,
	class: "dui-alert"
}, jv = {
	key: 0,
	class: "dui-avatar"
}, Mv = { class: "app:size-14 app:shrink-0 app:rounded-lg" }, Nv = ["src"], Pv = {
	key: 1,
	class: "dui-badge"
}, Fv = {
	key: 1,
	class: "dui-alert dui-alert-info"
}, Iv = { class: "dui-card-actions" }, Lv = ["disabled"], Rv = {
	key: 2,
	class: "dui-alert"
}, zv = /* @__PURE__ */ U({
	__name: "QuickCareerPanel",
	props: {
		careers: {},
		finalCareer: {}
	},
	emits: ["clearCareers"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (K(), J(Eh, {
			description: "Quick Build keeps one chosen Career chain instead of a manual queue.",
			number: "2",
			title: "Career"
		}, {
			default: H(() => [
				e.finalCareer ? (K(), q("article", Av, [e.finalCareer.img ? (K(), q("div", jv, [Y("div", Mv, [Y("img", {
					src: e.finalCareer.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "56",
					width: "56"
				}, null, 8, Nv)])])) : (K(), q("span", Pv, I(V(lg)(e.finalCareer.name)), 1)), Y("div", null, [
					Y("strong", null, I(e.finalCareer.name), 1),
					Y("span", null, [Z(I(e.finalCareer.careerGroup || "Career") + " ", 1), e.finalCareer.level === null ? Q("", !0) : (K(), q(G, { key: 0 }, [Z(" level " + I(e.finalCareer.level), 1)], 64))]),
					Y("small", null, I(V(sg)(e.finalCareer)), 1)
				])])) : Q("", !0),
				e.careers.length > 1 ? (K(), q("div", Fv, [Y("span", null, I(e.careers.length - 1) + " lower-tier Career" + I(e.careers.length === 2 ? "" : "s"), 1), Y("span", null, "Included before " + I(e.finalCareer?.name) + ".", 1)])) : Q("", !0),
				Y("div", Iv, [Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: !e.careers.length,
					type: "button",
					onClick: r[0] ||= (e) => n("clearCareers")
				}, " Clear Career ", 8, Lv)]),
				e.careers.length ? Q("", !0) : (K(), q("p", Rv, "No Career selected."))
			]),
			_: 1
		}));
	}
}), Bv = {
	key: 0,
	class: "dui-fieldset"
}, Vv = { class: "dui-fieldset-legend" }, Hv = { class: "dui-card-actions" }, Uv = ["aria-pressed", "onClick"], Wv = /* @__PURE__ */ U({
	__name: "TraitButtonGroup",
	props: {
		caption: {},
		title: {},
		traits: {}
	},
	emits: ["toggleTrait"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => e.traits.length ? (K(), q("fieldset", Bv, [Y("legend", Vv, [Y("span", null, I(e.title), 1), Y("span", null, I(e.caption), 1)]), Y("div", Hv, [(K(!0), q(G, null, W(e.traits, (e) => (K(), q("button", {
			key: e.uuid,
			"aria-pressed": e.isSelected,
			class: F(["dui-btn dui-btn-sm", { "dui-btn-active": e.isSelected }]),
			type: "button",
			onClick: (t) => n("toggleTrait", e)
		}, I(e.name), 11, Uv))), 128))])])) : Q("", !0);
	}
});
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/errors.ts
function Gv(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not resolve that Actor drop.";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/useBaseActorSelection.ts
function Kv(e, t) {
	let n = Um(), { baseActors: r, selectedBaseActorUuid: i } = Id(n), a = /* @__PURE__ */ B(""), o = $(() => {
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
			t.value = Gv(e);
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
function qv() {
	let { advancements: e, careers: t, finalPortraitPath: n, selectedBaseActor: r, trappings: i } = Id(Um()), a = $(() => {
		let e = 0;
		for (let n of t.value) e += n.quantity;
		return e;
	}), o = $(() => i.value.filter((e) => !e.ignored).length), s = $(() => e.value.filter((e) => e.current !== e.careerValue).length), c = $(() => i.value.filter((e) => !e.ignored && e.resolution.status === "fallback").length), l = $(() => i.value.filter((e) => e.ignored).length), u = $(() => e.value.filter((e) => e.kind === "skill" && Zd(e.name) !== null).length), d = $(() => i.value.filter((e) => !e.ignored && e.resolution.status === "unresolved").length), f = $(() => {
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
function Jv() {
	let e = Um(), { optionalTraits: t, quickTraits: n, traits: r } = Id(e), i = $(() => new Set(r.value.map((e) => Yv(e.name)))), a = $(() => t.value.map(s)), o = $(() => {
		let e = new Set(t.value.map((e) => Yv(e.name)));
		return n.value.filter((t) => !e.has(Yv(t.name))).map(s);
	});
	function s(e) {
		return {
			...e,
			isSelected: i.value.has(Yv(e.name))
		};
	}
	function c(t) {
		let n = i.value.has(Yv(t.name));
		e.setQuickTraitSelected(t, !n);
	}
	function l(t) {
		let n = i.value.has(Yv(t.name));
		e.setOptionalTraitSelected(t, !n);
	}
	return {
		displayedQuickTraitOptions: o,
		optionalTraitOptions: a,
		toggleOptionalTrait: l,
		toggleQuickTrait: c
	};
}
function Yv(e) {
	return e.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/useCareerQueue.ts
function Xv() {
	let e = Um(), t = /* @__PURE__ */ B(null), n = /* @__PURE__ */ B(null);
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
var Zv = bp;
function Qv(e) {
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
	}), up(t);
}
function $v(e) {
	let t = [];
	e.selectedBaseActor && t.push(e.selectedBaseActor.species, e.selectedBaseActor.name);
	for (let n of e.careers) t.push(n.name, n.careerGroup);
	return Sp(t);
}
//#endregion
//#region src/module/state/portrait-gallery/workflow.ts
function ey(e) {
	let t = /* @__PURE__ */ B([]), n = /* @__PURE__ */ B(null), r = /* @__PURE__ */ B(!1), i = /* @__PURE__ */ B(null), a = 0, o = $(() => ty([...e.baseSearchTerms.value, ...e.filterState.customPortraitSearchTerms.value])), s = $(() => x("search")), c = $(() => x("must-include")), l = $(() => x("must-exclude")), u = $(() => ty([...s.value, ...c.value])), d = $(() => n.value ?? dp({
		assetCandidates: t.value,
		immediateCandidates: e.immediateCandidates.value,
		selectedPortraitPath: e.pinnedPortraitPath.value
	})), f = $(() => sp(d.value)), p = $(() => [...o.value.flatMap(S), ...f.value.map(C)]), m = $(() => d.value.filter((e) => Dp(e, {
		mustExcludeSources: w("must-exclude"),
		mustExcludeTerms: l.value,
		mustIncludeSources: w("must-include"),
		mustIncludeTerms: c.value
	}))), h = $(() => m.value.find((t) => t.img === e.activePortraitPath.value) ?? null), g = $(() => h.value?.key ?? ""), _ = $(() => Mp(i.value)), v = $(() => jp(i.value));
	cs(o, (t) => e.filterState.retainAvailablePortraitFilterTerms(t), { immediate: !0 }), cs(() => [
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
		let s = e.hasSubject.value, d = Ap({
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
			}, r) : [], f = dp({
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
		return Tp(o.value, e.filterState.portraitTermSections.value, t);
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
function ty(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/module/apps/npc-builder/state/workflows/portrait-candidates-workflow.ts
function ny(e, t) {
	let n = Um(), { careers: r, customPortraitSearchTerms: i, finalPortraitPath: a, portraitSourceTagSections: o, portraitTermSections: s, selectedBaseActor: c, selectedPortraitPath: l, settings: u } = Id(n), d = $(() => Qv({
		careers: r.value,
		selectedBaseActor: c.value
	})), f = $(() => $v({
		careers: r.value,
		selectedBaseActor: c.value
	})), p = $(() => wp({
		configuredFolders: u.value.prioritizedPortraitFolders,
		hasCareer: r.value.length > 0
	})), m = ey({
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
function ry(e, t) {
	let n = ny(e, t), r = /* @__PURE__ */ B(!1);
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
var iy = { class: "app:grid app:gap-3" }, ay = { class: "app:grid app:items-start app:gap-3 md:app:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]" }, oy = { class: "app:grid app:min-w-0 app:gap-3" }, sy = /* @__PURE__ */ U({
	__name: "NpcBuilderBuildTab",
	props: {
		bridge: {},
		isLoadingActors: { type: Boolean },
		isLoadingBaseDraft: { type: Boolean },
		page: {}
	},
	setup(e) {
		let t = e, n = Um(), { actorName: r, advancements: i, careers: a, estimatedNpcXp: o, finalActorName: s, finalCareer: c, finalPortraitPath: l, grantTotals: u, selectedBaseActor: d, selectedSpells: f, suggestedActorName: p, traits: m } = Id(n), h = /* @__PURE__ */ B(""), { actorFilter: g, filteredActors: _, selectedBaseActorSelectValue: v } = Kv(t.bridge, h), { clearCareerDragState: y, draggedCareerIndex: b, dragOverCareerIndex: x, handleCareerDragOver: S, handleCareerDragStart: C, handleCareerDrop: w, moveCareer: ee, removeCareer: te, setCareerQuantity: ne, setDragOverCareerIndex: re } = Xv(), { displayedQuickTraitOptions: T, optionalTraitOptions: ie, toggleOptionalTrait: E, toggleQuickTrait: ae } = Jv(), { buildPreviewStatus: D, buildPreviewWarnings: O, careerItemCount: oe, editedAdvanceCount: se, fallbackTrappingCount: ce, ignoredTrappingCount: le, visibleTrappingCount: ue } = qv(), { addPortraitSearchTerm: de, compactPortraitCandidates: fe, hiddenPortraitCandidateCount: pe, isLoadingPortraitCandidates: me, isPortraitGalleryOpen: he, portraitCandidates: ge, portraitFilterTags: _e, portraitSearchProgress: ve, portraitSearchProgressLabel: ye, portraitSearchProgressValue: k, portraitSearchTerms: be, selectedPortraitCandidate: xe, selectedPortraitCandidateKey: Se, selectPortrait: Ce, selectPortraitFromGallery: we, setPortraitFilterTagSection: Te } = ry(t.bridge, h);
		return (t, Ee) => (K(), q("section", iy, [Y("div", ay, [Y("div", oy, [
			e.page === "build-quick" || e.page === "build-actor" ? (K(), J(Sg, {
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
				onActorFilterChange: Ee[0] ||= (e) => g.value = e,
				onBaseActorChange: Ee[1] ||= (e) => v.value = e
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
			e.page === "build-quick" ? (K(), J(zv, {
				key: 1,
				careers: V(a),
				"final-career": V(c),
				onClearCareers: V(n).clearCareers
			}, null, 8, [
				"careers",
				"final-career",
				"onClearCareers"
			])) : Q("", !0),
			e.page === "build-quick" ? (K(), J(Eh, {
				key: 2,
				description: "Apply optional base traits and configured quick traits to the draft.",
				number: "3",
				title: "Quick Traits"
			}, {
				default: H(() => [X(Wv, {
					caption: `${V(ie).length} from base statblock`,
					traits: V(ie),
					title: "Optional Traits",
					onToggleTrait: V(E)
				}, null, 8, [
					"caption",
					"traits",
					"onToggleTrait"
				]), X(Wv, {
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
			e.page === "build-careers" ? (K(), J(J_, {
				key: 3,
				careers: V(a),
				"drag-over-career-index": V(x),
				"dragged-career-index": V(b),
				onCareerDragEnd: V(y),
				onCareerDragEnter: V(re),
				onCareerDragOver: V(S),
				onCareerDragStart: V(C),
				onCareerDropOnRow: V(w),
				onCareerQuantityInput: V(ne),
				onMoveCareer: V(ee),
				onRemoveCareer: V(te)
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
		]), X(w_, {
			class: "app:min-w-0",
			"actor-name": V(r),
			"advancement-count": V(i).length,
			"build-preview-status": V(D),
			"build-preview-warnings": V(O),
			"career-item-count": V(oe),
			"compact-portrait-candidates": V(fe),
			"edited-advance-count": V(se),
			"estimated-npc-xp": V(o),
			"fallback-trapping-count": V(ce),
			"final-actor-name": V(s),
			"final-career": V(c),
			"final-portrait-path": V(l),
			"grant-totals": V(u),
			"hidden-portrait-candidate-count": V(pe),
			"ignored-trapping-count": V(le),
			"is-loading-portrait-candidates": V(me),
			"portrait-candidates": V(ge),
			"portrait-search-progress": V(ve),
			"portrait-search-progress-label": V(ye),
			"portrait-search-progress-value": V(k),
			"selected-base-actor": V(d),
			"selected-portrait-candidate": V(xe),
			"selected-portrait-candidate-key": V(Se),
			"selected-spell-count": V(f).length,
			"suggested-actor-name": V(p),
			"trait-count": V(m).length,
			"visible-trapping-count": V(ue),
			onActorNameChange: Ee[2] ||= (e) => r.value = e,
			onOpenPortraitGallery: Ee[3] ||= (e) => he.value = !0,
			onSelectPortrait: V(Ce)
		}, null, 8, /* @__PURE__ */ "actor-name.advancement-count.build-preview-status.build-preview-warnings.career-item-count.compact-portrait-candidates.edited-advance-count.estimated-npc-xp.fallback-trapping-count.final-actor-name.final-career.final-portrait-path.grant-totals.hidden-portrait-candidate-count.ignored-trapping-count.is-loading-portrait-candidates.portrait-candidates.portrait-search-progress.portrait-search-progress-label.portrait-search-progress-value.selected-base-actor.selected-portrait-candidate.selected-portrait-candidate-key.selected-spell-count.suggested-actor-name.trait-count.visible-trapping-count.onSelectPortrait".split("."))]), X(kv, {
			"is-loading-portrait-candidates": V(me),
			open: V(he),
			"portrait-candidates": V(ge),
			"portrait-filter-tags": V(_e),
			"portrait-search-progress-label": V(ye),
			"portrait-search-progress-value": V(k),
			"portrait-search-terms": V(be),
			"selected-portrait-candidate-key": V(Se),
			onCreateSearchTerm: V(de),
			onClose: Ee[4] ||= (e) => he.value = !1,
			onFilterTagSectionChange: V(Te),
			onSelectPortrait: V(we)
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
}), cy = {
	Average: "avg",
	Enormous: "enor",
	Large: "lrg",
	Little: "ltl",
	Monstrous: "mnst",
	Small: "sml",
	Tiny: "tiny"
}, ly = new Set(["bestial", "skittish"]);
function uy(e) {
	let t = e.some((e) => hy(e, "skittish")), n = e.some((e) => gy(e, "trained", "war")), r = vy(e.filter((e) => hy(e, "weapon")));
	return e.map((e) => {
		let i = fy(e.name);
		return ly.has(i) ? my(e, `${e.name} is removed from combined mounts.`) : i === "weapon" ? !n || t ? my(e, "Weapon requires Trained (War) and a mount that was not Skittish.") : e.uuid === r ? py(e, "Weapon (Mount)") : my(e, "Only the strongest Weapon trait is retained for the combined profile.") : py(e, e.damage ? _y(e.name) : e.name);
	});
}
function dy(e) {
	return fy(e) === "armour";
}
function fy(e) {
	return e.trim().replace(/\s*\(mount\)\s*$/i, "").toLocaleLowerCase();
}
function py(e, t) {
	return {
		fixedDamage: e.fixedDamage,
		included: !0,
		name: e.name,
		outputName: t,
		reason: "",
		sourceUuid: e.uuid
	};
}
function my(e, t) {
	return {
		fixedDamage: e.fixedDamage,
		included: !1,
		name: e.name,
		outputName: "",
		reason: t,
		sourceUuid: e.uuid
	};
}
function hy(e, t) {
	return fy(e.name) === t;
}
function gy(e, t, n) {
	return hy(e, t) ? e.specification.trim().toLocaleLowerCase() === n : e.name.trim().toLocaleLowerCase() === `${t} (${n})`;
}
function _y(e) {
	return /\(mount\)\s*$/i.test(e.trim()) ? e.trim() : `${e.trim()} (Mount)`;
}
function vy(e) {
	return [...e].sort((e, t) => (t.fixedDamage ?? 0) - (e.fixedDamage ?? 0) || e.uuid.localeCompare(t.uuid))[0]?.uuid ?? "";
}
//#endregion
//#region src/module/apps/npc-builder/functions/combined-profile/calculate.ts
var yy = [
	cy.Tiny,
	cy.Little,
	cy.Small,
	cy.Average,
	cy.Large,
	cy.Enormous,
	cy.Monstrous
], by = {
	[cy.Average]: "Average",
	[cy.Enormous]: "Enormous",
	[cy.Large]: "Large",
	[cy.Little]: "Little",
	[cy.Monstrous]: "Monstrous",
	[cy.Small]: "Small",
	[cy.Tiny]: "Tiny"
};
function xy(e, t) {
	return {
		chargeStrengthBonus: Math.max(t.characteristics.strengthBonus - e.characteristics.strengthBonus, 0),
		initiative: Math.max(e.characteristics.initiative, t.characteristics.initiative),
		movement: t.movement,
		size: Cy(e.size, t.size),
		strength: e.characteristics.strength,
		toughness: Math.max(e.characteristics.toughness, t.characteristics.toughness),
		traits: uy(t.traits),
		wounds: Sy(e.wounds, t.wounds)
	};
}
function Sy(e, t) {
	return Math.max(1, Math.max(e, t) + Math.ceil(Math.min(e, t) * .25));
}
function Cy(e, t) {
	return wy(t) > wy(e) ? t : e;
}
function wy(e) {
	return yy.indexOf(e);
}
//#endregion
//#region src/module/apps/npc-builder/functions/combined-profile/trait-source.ts
function Ty({ flagScope: e, mount: t, plan: n, rider: r }) {
	let i = "Combined Profile";
	return {
		effects: [{
			changes: [],
			disabled: !1,
			flags: { [e]: { generatedCombinedProfileEffect: !0 } },
			img: t.img || "icons/svg/wing.svg",
			name: i,
			system: {
				scriptData: Ey(e, n),
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
			description: { value: Oy(r, t, n) },
			specification: { value: `${r.name} + ${t.name}` }
		},
		type: "trait"
	};
}
function Ey(e, t) {
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
		script: Dy(e, t.chargeStrengthBonus),
		trigger: "preRollTest"
	}), n;
}
function Dy(e, t) {
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
function Oy(e, t, n) {
	return [
		"<p>Generated by Drowsy's WFRP4e Customizers. This Actor combines a rider and mount into one simplified NPC profile.</p>",
		`<p><strong>Rider:</strong> ${ky(e.name)}<br><strong>Mount:</strong> ${ky(t.name)}</p>`,
		`<p><strong>Movement:</strong> ${n.movement}; <strong>Wounds:</strong> ${n.wounds}; <strong>Charge SB:</strong> +${n.chargeStrengthBonus}.</p>`,
		"<p>Mount attack Traits use fixed damage captured from the mount. Skittish and Bestial are removed.</p>"
	].join("");
}
function ky(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
//#endregion
//#region src/types/foundry/document-drop.ts
var Ay = "wfrp4e-customizer-apps.document-drop", jy = { class: "dui-list" }, My = [
	"aria-label",
	"disabled",
	"title",
	"onClick"
], Ny = ["src"], Py = {
	key: 1,
	"aria-hidden": "true",
	class: "fa-solid fa-scroll"
}, Fy = {
	key: 1,
	class: "dui-list-row"
}, Iy = /* @__PURE__ */ U({
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
		return (t, n) => (K(), q("ul", jy, [e.documents.length > 0 ? (K(!0), q(G, { key: 0 }, W(e.documents, (t) => (K(), q("li", {
			key: t.uuid,
			class: "dui-list-row"
		}, [Y("button", {
			"aria-label": e.isClickable ? `Use ${t.name}` : void 0,
			class: "dui-btn dui-btn-ghost",
			disabled: !e.isClickable,
			title: e.isClickable ? t.name : void 0,
			type: "button",
			onClick: Ju((e) => r(t), ["stop"])
		}, [t.img ? (K(), q("img", {
			key: 0,
			alt: "",
			"aria-hidden": "true",
			src: t.img
		}, null, 8, Ny)) : (K(), q("i", Py)), Y("span", null, I(t.name), 1)], 8, My)]))), 128)) : (K(), q("li", Fy, [n[0] ||= Y("i", {
			"aria-hidden": "true",
			class: "fa-solid fa-arrow-down"
		}, null, -1), Y("span", null, I(e.emptyLabel), 1)]))]));
	}
}), Ly = { class: "dui-card-body dui-fieldset" }, Ry = ["for"], zy = ["id", "value"], By = ["for"], Vy = ["id", "value"], Hy = { class: "dui-card-actions" }, Uy = /* @__PURE__ */ U({
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
		let n = t, r = gs(), i = gs();
		function a(e) {
			let t = e.target instanceof HTMLSelectElement ? e.target.value : "auto";
			(t === "Actor" || t === "auto" || t === "Item" || t === "JournalEntry" || t === "JournalEntryPage") && n("updateDocumentType", t);
		}
		function o(e) {
			n("updateDocumentValue", e.target instanceof HTMLInputElement ? e.target.value : "");
		}
		return (t, s) => (K(), q("form", {
			class: "dui-card dui-card-border dui-card-sm",
			onClick: s[2] ||= Ju(() => {}, ["stop"]),
			onSubmit: s[3] ||= Ju((e) => n("submit"), ["prevent"])
		}, [Y("fieldset", Ly, [
			s[6] ||= Y("legend", { class: "dui-fieldset-legend" }, "Manual document entry", -1),
			Y("label", {
				class: "dui-label",
				for: V(r)
			}, "Document type", 8, Ry),
			Y("select", {
				id: V(r),
				class: "dui-select",
				value: e.documentType,
				onChange: a
			}, [...s[4] ||= [bl("<option value=\"auto\">Auto</option><option value=\"Item\">Item</option><option value=\"Actor\">Actor</option><option value=\"JournalEntry\">Journal Entry</option><option value=\"JournalEntryPage\">Journal Page</option>", 5)]], 40, zy),
			Y("label", {
				class: "dui-label",
				for: V(i)
			}, "UUID or drop JSON", 8, By),
			Y("input", {
				id: V(i),
				class: "dui-input",
				value: e.documentValue,
				placeholder: "Compendium.package.pack.id",
				type: "text",
				onInput: o
			}, null, 40, Vy),
			Y("div", Hy, [
				s[5] ||= Y("button", {
					class: "dui-btn dui-btn-primary",
					type: "submit"
				}, "Use", -1),
				Y("button", {
					class: "dui-btn",
					type: "button",
					onClick: s[0] ||= (e) => n("startPick")
				}, I(e.isPickingDocument ? "Waiting..." : "Pick Next Click"), 1),
				Y("button", {
					class: "dui-btn dui-btn-ghost",
					type: "button",
					onClick: s[1] ||= (e) => n("close")
				}, "Cancel")
			])
		])], 32));
	}
}), Wy = ["aria-label", "aria-disabled"], Gy = { key: 0 }, Ky = {
	key: 1,
	class: "dui-alert dui-alert-info",
	role: "status"
}, qy = { key: 2 }, Jy = {
	key: 4,
	class: "dui-card-actions"
}, Yy = ["disabled"], Xy = /* @__PURE__ */ U({
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
		let n = e, r = is(Ay);
		if (!r) throw Error("DocumentDrop requires a document drop bridge from its application host.");
		let i = r, a = qs(), o = t, s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B(!1), l = /* @__PURE__ */ B(!1), u = /* @__PURE__ */ B("auto"), d = /* @__PURE__ */ B(""), f, p = $(() => !!a.prompt), m = $(() => !!a.default), h = $(() => n.showPrompt && (p.value || n.title.length > 0)), g = $(() => n.showDocuments ? n.documents : []), _ = $(() => n.manualEntryTrigger === "button"), v = $(() => n.variant === "bare" ? [] : [
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
			c.value = !1, ne();
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
		function ee() {
			if (n.disabled) return;
			let e = i.createDropData({
				documentType: u.value,
				value: d.value
			});
			e && (o("dropData", e), d.value = "", C());
		}
		function te() {
			n.disabled || f || (l.value = !0, f = i.startDocumentPick(re));
		}
		function ne() {
			let e = f;
			f = void 0, l.value = !1, e?.();
		}
		function re(e) {
			o("dropData", e), C();
		}
		return Ps(() => {
			ne();
		}), cs(() => n.disabled, (e) => {
			e && (s.value = !1, C());
		}), (t, n) => (K(), q("div", wl(t.$attrs, {
			class: v.value,
			"aria-label": e.title,
			"aria-disabled": e.disabled,
			role: "group",
			onDragenter: Ju(b, ["prevent"]),
			onDragover: Ju(b, ["prevent"]),
			onDragleave: y,
			onDrop: x
		}), [Y("div", { class: F(e.variant === "bare" ? void 0 : "dui-card-body") }, [
			h.value ? (K(), q("div", {
				key: 0,
				class: F(["dui-alert dui-alert-info", { "dui-alert-outline": !s.value }])
			}, [
				n[3] ||= Y("i", {
					"aria-hidden": "true",
					class: "fa-solid fa-arrow-down"
				}, null, -1),
				Y("div", null, [Vs(t.$slots, "prompt", {}, () => [Y("strong", null, I(e.title), 1), e.description ? (K(), q("p", Gy, I(e.description), 1)) : Q("", !0)])]),
				Y("span", { class: F(["dui-badge", { "dui-badge-info": s.value }]) }, I(s.value ? "Release to add" : "Drop zone"), 3)
			], 2)) : s.value ? (K(), q("div", Ky, [n[4] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-arrow-down"
			}, null, -1), Y("span", null, "Release to add " + I(e.title.toLowerCase()) + ".", 1)])) : Q("", !0),
			m.value ? (K(), q("div", qy, [Vs(t.$slots, "default")])) : Q("", !0),
			e.showDocuments ? (K(), J(Iy, {
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
			_.value ? (K(), q("div", Jy, [Y("button", {
				class: "dui-btn dui-btn-ghost dui-btn-sm",
				disabled: e.disabled,
				type: "button",
				onClick: Ju(w, ["stop"])
			}, I(c.value ? "Close Manual Entry" : "Manual Entry"), 9, Yy)])) : Q("", !0),
			c.value && !e.disabled ? (K(), J(Uy, {
				key: 5,
				"document-type": u.value,
				"document-value": d.value,
				"is-picking-document": l.value,
				onClose: C,
				onStartPick: te,
				onSubmit: ee,
				onUpdateDocumentType: n[1] ||= (e) => u.value = e,
				onUpdateDocumentValue: n[2] ||= (e) => d.value = e
			}, null, 8, [
				"document-type",
				"document-value",
				"is-picking-document"
			])) : Q("", !0)
		], 2)], 16, Wy));
	}
});
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/errors.ts
function Zy(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderMountTab/CombinedProfilePreview.vue?vue&type=script&setup=true&lang.ts
var Qy = { class: "app:max-w-full app:overflow-x-auto" }, $y = { class: "dui-table dui-table-sm" }, eb = { class: "dui-alert" }, tb = { class: "app:flex app:flex-wrap app:gap-2" }, nb = { key: 0 }, rb = {
	key: 1,
	class: "app:grid app:gap-2"
}, ib = /* @__PURE__ */ U({
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
				mount: by[t.mount.size],
				result: by[t.plan.size],
				rider: by[t.rider.size],
				rule: "Larger"
			}
		]);
		function a(e) {
			return e.fixedDamage === null ? e.outputName : `${e.outputName} (fixed Damage ${e.fixedDamage})`;
		}
		return (t, o) => (K(), q(G, null, [X(Eh, {
			description: "This preview uses the Actors' current prepared values. The build recalculates after applying the rider's Career advances.",
			number: "2",
			title: "Combined Profile Preview"
		}, {
			default: H(() => [Y("div", Qy, [Y("table", $y, [o[0] ||= Y("thead", null, [Y("tr", null, [
				Y("th", null, "Field"),
				Y("th", null, "Rider"),
				Y("th", null, "Mount"),
				Y("th", null, "Combined"),
				Y("th", null, "Rule")
			])], -1), Y("tbody", null, [(K(!0), q(G, null, W(i.value, (e) => (K(), q("tr", { key: e.field }, [
				Y("th", null, I(e.field), 1),
				Y("td", null, I(e.rider), 1),
				Y("td", null, I(e.mount), 1),
				Y("td", null, I(e.result), 1),
				Y("td", null, I(e.rule), 1)
			]))), 128))])])]), Y("p", eb, " Charge attacks gain +" + I(e.plan.chargeStrengthBonus) + " Damage from the mount's Strength Bonus. The combined profile also gains at least Armour (1). ", 1)]),
			_: 1
		}), X(Eh, {
			description: "Mount attack damage is frozen before the traits are copied to the rider.",
			number: "3",
			title: "Mount Traits"
		}, {
			default: H(() => [
				Y("div", tb, [(K(!0), q(G, null, W(n.value, (e) => (K(), q("span", {
					key: e.sourceUuid,
					class: "dui-badge dui-badge-sm"
				}, I(a(e)), 1))), 128))]),
				n.value.length ? Q("", !0) : (K(), q("p", nb, "The mount contributes no traits.")),
				r.value.length ? (K(), q("div", rb, [o[1] ||= Y("p", null, [Y("strong", null, "Removed or consolidated")], -1), (K(!0), q(G, null, W(r.value, (e) => (K(), q("p", {
					key: e.sourceUuid,
					class: "dui-alert dui-alert-warning"
				}, [Y("strong", null, I(e.name) + ":", 1), Z(" " + I(e.reason), 1)]))), 128))])) : Q("", !0)
			]),
			_: 1
		})], 64));
	}
}), ab = { class: "app:grid app:gap-3" }, ob = { class: "app:grid app:gap-3 md:app:grid-cols-2" }, sb = { class: "dui-fieldset" }, cb = ["for"], lb = ["id"], ub = { class: "dui-fieldset" }, db = ["for"], fb = [
	"id",
	"disabled",
	"value"
], pb = ["value"], mb = {
	key: 0,
	class: "dui-card-actions"
}, hb = {
	key: 1,
	class: "dui-alert dui-alert-warning"
}, gb = {
	key: 2,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, _b = {
	key: 3,
	"aria-live": "polite",
	class: "dui-alert",
	role: "status"
}, vb = {
	key: 4,
	class: "dui-alert"
}, yb = {
	key: 0,
	class: "dui-avatar"
}, bb = { class: "app:size-16 app:shrink-0 app:rounded-lg" }, xb = ["src"], Sb = /* @__PURE__ */ U({
	__name: "NpcBuilderMountTab",
	props: { bridge: {} },
	setup(e) {
		let t = e, n = Um(), { baseActorCombatProfile: r, mountActorProfile: i, mountActors: a, selectedBaseActorUuid: o, selectedMountActorUuid: s } = Id(n), c = /* @__PURE__ */ B(""), l = /* @__PURE__ */ B(""), u = /* @__PURE__ */ B(!1), d = gs(), f = 0, p = $(() => {
			let e = c.value.trim().toLocaleLowerCase();
			return a.value.filter((t) => t.uuid !== o.value && (!e || t.name.toLocaleLowerCase().includes(e)));
		}), m = $(() => a.value.find((e) => e.uuid === s.value) ?? null), h = $(() => !r.value || !i.value ? null : xy(r.value, i.value));
		cs(s, async (e) => {
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
				r === f && (n.hydrateMountActorProfile(null), l.value = Zy(e));
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
				l.value = Zy(e);
			}
		}
		return (e, t) => (K(), q("div", ab, [
			t[5] ||= Y("p", { class: "dui-alert dui-alert-info" }, " Mounts are optional. A selected mount is folded into one simplified NPC profile during build. ", -1),
			X(Eh, {
				description: "Choose any world Actor as the mount. This selection does not create a live WFRP mount relationship.",
				number: "1",
				title: "Mount Actor"
			}, {
				default: H(() => [
					Y("div", ob, [Y("fieldset", sb, [
						t[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "Search mounts", -1),
						Y("label", {
							class: "dui-label",
							for: `${V(d)}-filter`
						}, "Actor name", 8, cb),
						ts(Y("input", {
							id: `${V(d)}-filter`,
							"onUpdate:modelValue": t[0] ||= (e) => c.value = e,
							"aria-label": "Filter mount actors by name",
							class: "dui-input dui-input-sm",
							placeholder: "Filter world actors",
							type: "search"
						}, null, 8, lb), [[zu, c.value]])
					]), Y("fieldset", ub, [
						t[4] ||= Y("legend", { class: "dui-fieldset-legend" }, "Selected mount", -1),
						Y("label", {
							class: "dui-label",
							for: `${V(d)}-mount`
						}, "Mount statblock", 8, db),
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
						}, I(e.name), 9, pb))), 128))], 40, fb)
					])]),
					X(Xy, {
						disabled: !V(o),
						description: "Drop a world Actor to use as the mount.",
						title: "Drop Mount Actor",
						variant: "compact",
						onDropData: _
					}, null, 8, ["disabled"]),
					V(s) ? (K(), q("div", mb, [Y("button", {
						class: "dui-btn dui-btn-ghost dui-btn-sm",
						type: "button",
						onClick: t[1] ||= (...e) => V(n).clearMountSelection && V(n).clearMountSelection(...e)
					}, " Clear Mount ")])) : Q("", !0),
					V(o) ? l.value ? (K(), q("p", gb, I(l.value), 1)) : u.value ? (K(), q("p", _b, " Loading mount profile... ")) : m.value && V(i) ? (K(), q("article", vb, [m.value.img ? (K(), q("div", yb, [Y("div", bb, [Y("img", {
						src: m.value.img,
						alt: "",
						class: "app:h-full app:w-full app:object-cover",
						height: "64",
						width: "64"
					}, null, 8, xb)])])) : Q("", !0), Y("div", null, [Y("strong", null, I(m.value.name), 1), Y("span", null, " Movement " + I(V(i).movement) + " | Wounds " + I(V(i).wounds) + " | " + I(V(by)[V(i).size]), 1)])])) : Q("", !0) : (K(), q("p", hb, " Choose the rider on the Build tab before selecting a mount. "))
				]),
				_: 1
			}),
			h.value && V(r) && V(i) ? (K(), J(ib, {
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
function Cb(e) {
	return e ? e.digDownActive ? e.digDownDeepFileSearchEnabled ? e.digDownCacheReady ? `Dig Down cache ready with ${e.digDownIndexedFileCount} indexed files.` : "Dig Down is active; its file cache is still building or unavailable." : "Dig Down is active, but its Deep File Search setting is disabled." : "Install and enable Dig Down to search local files for portrait suggestions." : "Checking Dig Down integration.";
}
//#endregion
//#region src/module/apps/npc-builder/functions/settings/settings-payload.ts
function wb(e) {
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
function Tb(e) {
	let t = Um(), { actorFolders: n, itemFolders: r, settings: i } = Id(t), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(""), s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B(""), l = /* @__PURE__ */ B(null), u = /* @__PURE__ */ B(""), d = /* @__PURE__ */ B(""), f = $(() => l.value?.digDownActive ?? !0), p = $(() => Cb(l.value));
	cs(l, (e) => {
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
			t.hydrateSettings(await e.saveSettings(Hp())), await ee(), d.value = "Settings reset to defaults.";
		});
	}
	async function w(e) {
		s.value = !0, o.value = "", d.value = "";
		try {
			await e();
		} catch (e) {
			o.value = Eb(e);
		} finally {
			s.value = !1;
		}
	}
	async function ee() {
		let [n, r] = await Promise.all([e.listBaseActors(i.value), e.listQuickTraits(i.value)]);
		t.hydrateBaseActors(n), t.hydrateQuickTraits(r);
	}
	function te() {
		return wb({
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
function Eb(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderSettingsTab/FolderSetting.vue?vue&type=script&setup=true&lang.ts
var Db = { class: "dui-fieldset" }, Ob = { class: "dui-fieldset-legend" }, kb = ["aria-label", "value"], Ab = { value: "" }, jb = ["value"], Mb = { class: "dui-fieldset" }, Nb = ["aria-label", "value"], Pb = { class: "dui-card-actions" }, Fb = ["disabled"], Ib = /* @__PURE__ */ U({
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
			Y("fieldset", Db, [Y("legend", Ob, I(e.folderLabel), 1), Y("select", {
				"aria-label": e.folderLabel,
				class: "dui-select dui-select-sm",
				value: e.selectedUuid,
				onChange: r
			}, [Y("option", Ab, I(e.defaultOptionLabel), 1), (K(!0), q(G, null, W(e.folders, (e) => (K(), q("option", {
				key: e.uuid,
				value: e.uuid
			}, I(e.name), 9, jb))), 128))], 40, kb)]),
			Y("fieldset", Mb, [a[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Create or use by name", -1), Y("input", {
				"aria-label": `Create or use ${e.folderLabel} by name`,
				class: "dui-input dui-input-sm",
				value: e.createName,
				placeholder: "Folder name",
				type: "text",
				onInput: i
			}, null, 40, Nb)]),
			Y("div", Pb, [Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.disabled || !e.createName.trim(),
				type: "button",
				onClick: a[0] ||= (e) => n("saveFolderName")
			}, I(e.buttonLabel ?? "Save Folder"), 9, Fb)])
		]));
	}
}), Lb = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(Eh, {
			description: "Limit the source picker or choose where generated Actors are stored.",
			number: "1",
			title: "Actor Sources"
		}, {
			default: H(() => [X(Ib, {
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
			]), X(Ib, {
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
}), Rb = {
	key: 0,
	class: "dui-label"
}, zb = ["checked"], Bb = {
	key: 1,
	class: "dui-label"
}, Vb = ["checked"], Hb = {
	key: 2,
	class: "dui-label"
}, Ub = ["checked"], Wb = {
	key: 3,
	class: "dui-label"
}, Gb = ["checked"], Kb = {
	key: 4,
	class: "dui-label"
}, qb = ["checked"], Jb = /* @__PURE__ */ U({
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
		return (t, i) => (K(), J(Eh, {
			description: "Choose which base-only data is included in the editable draft.",
			title: "Base Actor Features"
		}, {
			default: H(() => [
				e.showAdvancementFeatures === !1 ? Q("", !0) : (K(), q("label", Rb, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowCharacteristics,
					type: "checkbox",
					onChange: i[0] ||= (e) => n("allowCharacteristicsChange", r(e))
				}, null, 40, zb), i[5] ||= Y("span", null, "Show base actor characteristics", -1)])),
				e.showAdvancementFeatures === !1 ? Q("", !0) : (K(), q("label", Bb, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowSkills,
					type: "checkbox",
					onChange: i[1] ||= (e) => n("allowSkillsChange", r(e))
				}, null, 40, Vb), i[6] ||= Y("span", null, "Show base actor skills", -1)])),
				e.showAdvancementFeatures === !1 ? Q("", !0) : (K(), q("label", Hb, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTalents,
					type: "checkbox",
					onChange: i[2] ||= (e) => n("allowTalentsChange", r(e))
				}, null, 40, Ub), i[7] ||= Y("span", null, "Show base actor talents", -1)])),
				e.showTrappingFeature ? (K(), q("label", Wb, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTrappings,
					type: "checkbox",
					onChange: i[3] ||= (e) => n("allowTrappingsChange", r(e))
				}, null, 40, Gb), i[8] ||= Y("span", null, "Show base actor trappings", -1)])) : Q("", !0),
				e.showTraitFeature === !1 ? Q("", !0) : (K(), q("label", Kb, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTraits,
					type: "checkbox",
					onChange: i[4] ||= (e) => n("allowTraitsChange", r(e))
				}, null, 40, qb), i[9] ||= Y("span", null, "Show base actor traits", -1)]))
			]),
			_: 1
		}));
	}
}), Yb = { class: "dui-label" }, Xb = ["checked"], Zb = /* @__PURE__ */ U({
	__name: "MagicSpellSettings",
	props: { autoSelectGrantedSpells: { type: Boolean } },
	emits: ["autoSelectGrantedSpellsChange"],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("autoSelectGrantedSpellsChange", !!t?.checked);
		}
		return (t, n) => (K(), J(Eh, {
			number: "6",
			title: "Magic and Spells"
		}, {
			default: H(() => [Y("label", Yb, [Y("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.autoSelectGrantedSpells,
				type: "checkbox",
				onChange: r
			}, null, 40, Xb), n[0] ||= Y("span", null, "Select detected Lore spells by default", -1)])]),
			_: 1
		}));
	}
}), Qb = { class: "dui-label" }, $b = ["checked"], ex = /* @__PURE__ */ U({
	__name: "NamingSettings",
	props: { includeSpeciesInName: { type: Boolean } },
	emits: ["includeSpeciesInNameChange"],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("includeSpeciesInNameChange", !!t?.checked);
		}
		return (t, n) => (K(), J(Eh, {
			number: "3",
			title: "Default Naming"
		}, {
			default: H(() => [Y("label", Qb, [Y("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.includeSpeciesInName,
				type: "checkbox",
				onChange: r
			}, null, 40, $b), n[0] ||= Y("span", null, "Include species in suggested names", -1)])]),
			_: 1
		}));
	}
}), tx = { class: "dui-fieldset" }, nx = ["value"], rx = { class: "dui-label" }, ix = ["checked"], ax = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(Eh, { title: "Career Resolution" }, {
			default: H(() => [Y("fieldset", tx, [n[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Lower career handling", -1), Y("select", {
				"aria-label": "Lower career handling",
				class: "dui-select dui-select-sm",
				value: e.lowerCareerMode,
				onChange: r
			}, [...n[0] ||= [
				Y("option", { value: "prompt" }, "Prompt when candidates are found", -1),
				Y("option", { value: "auto-add-all" }, "Automatically add all lower-tier matches", -1),
				Y("option", { value: "never" }, "Only add dropped careers", -1)
			]], 40, nx)]), Y("label", rx, [Y("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.askForLinkedSkillSpecializations,
				type: "checkbox",
				onChange: i
			}, null, 40, ix), n[2] ||= Y("span", null, "Resolve linked career skill repeats separately", -1)])]),
			_: 1
		}));
	}
}), ox = { class: "app:grid app:gap-1" }, sx = ["value"], cx = { class: "dui-label" }, lx = ["checked"], ux = { class: "app:grid app:gap-1" }, dx = ["value"], fx = { class: "dui-label" }, px = ["checked", "disabled"], mx = {
	"aria-live": "polite",
	class: "dui-alert",
	role: "status"
}, hx = { class: "dui-label" }, gx = ["checked"], _x = { class: "dui-label" }, vx = ["checked"], yx = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(Eh, {
			description: "Choose which local Foundry sources can suggest portraits.",
			number: "4",
			title: "Portrait Suggestions"
		}, {
			default: H(() => [
				Y("label", ox, [
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
					}, null, 40, sx),
					n[1] ||= Y("small", { id: "portrait-priority-folders-help" }, " One Foundry data path per line. These appear first, ahead of compendiums, world documents, and Dig Down results. ", -1)
				]),
				Y("label", cx, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.excludeFullyTransparentPortraitAssets,
					type: "checkbox",
					onChange: r
				}, null, 40, lx), n[2] ||= Y("span", null, "Hide fully empty or transparent images", -1)]),
				Y("label", ux, [
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
					}, null, 40, dx),
					n[4] ||= Y("small", { id: "portrait-excluded-references-help" }, " One image path per line. Each listed image and its visual duplicates are hidden. Broken images are always hidden. ", -1)
				]),
				Y("label", fx, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchFoundryPortraitAssets,
					disabled: !e.canUseDigDownPortraitSearch,
					type: "checkbox",
					onChange: o
				}, null, 40, px), n[5] ||= Y("span", null, "Search Dig Down's file cache for portrait suggestions", -1)]),
				Y("p", mx, I(e.statusLabel), 1),
				Y("label", hx, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchCompendiumPortraitAssets,
					type: "checkbox",
					onChange: s
				}, null, 40, gx), n[6] ||= Y("span", null, "Search Actor and Item compendiums for portrait suggestions", -1)]),
				Y("label", _x, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchWebPortraitAssets,
					disabled: "",
					type: "checkbox"
				}, null, 8, vx), n[7] ||= Y("span", null, "Search the web for portrait suggestions (later)", -1)])
			]),
			_: 1
		}));
	}
}), bx = { class: "dui-card-actions" }, xx = ["disabled"], Sx = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(Eh, {
			description: "Items in this folder become one-click Trait choices on the Build tab.",
			number: "2",
			title: "Quick Traits"
		}, {
			default: H(() => [X(Ib, {
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
			]), Y("div", bx, [Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.isBusy || !e.quickTraitFolderUuid,
				type: "button",
				onClick: r[3] ||= (e) => n("importRecommendedQuickTraits")
			}, " Import Recommended Quick Traits ", 8, xx)])]),
			_: 1
		}));
	}
}), Cx = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, wx = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, Tx = /* @__PURE__ */ U({
	__name: "SettingsMessages",
	props: {
		errorMessage: {},
		settingsMessage: {}
	},
	setup(e) {
		return (t, n) => e.errorMessage ? (K(), q("p", Cx, I(e.errorMessage), 1)) : e.settingsMessage ? (K(), q("p", wx, I(e.settingsMessage), 1)) : Q("", !0);
	}
}), Ex = { class: "app:grid app:gap-3" }, Dx = { class: "app:grid app:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] app:gap-3" }, Ox = { class: "dui-card-actions" }, kx = ["disabled"], Ax = ["disabled"], jx = /* @__PURE__ */ U({
	__name: "NpcBuilderSettingsTab",
	props: {
		bridge: {},
		page: {}
	},
	setup(e) {
		let { actorFolders: t, baseActorFolderName: n, canUseDigDownPortraitSearch: r, errorMessage: i, importRecommendedQuickTraits: a, isBusy: o, itemFolders: s, outputActorFolderName: c, portraitSearchStatusLabel: l, quickTraitFolderName: u, refreshPortraitSearchAvailability: d, resetSettingsToDefaults: f, saveBaseActorFolderName: p, saveOutputActorFolderName: m, saveQuickTraitFolderName: h, saveSettings: g, settings: _, settingsMessage: v } = Tb(e.bridge);
		return js(() => {
			d();
		}), (d, y) => (K(), q("section", Ex, [
			X(Tx, {
				"error-message": V(i),
				"settings-message": V(v)
			}, null, 8, ["error-message", "settings-message"]),
			Y("div", Dx, [
				e.page === "settings-folders" ? (K(), J(Lb, {
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
				e.page === "settings-folders" ? (K(), J(Sx, {
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
				e.page === "settings-suggestions" ? (K(), J(ex, {
					key: 2,
					"include-species-in-name": V(_).includeSpeciesInName,
					onIncludeSpeciesInNameChange: y[6] ||= (e) => V(_).includeSpeciesInName = e
				}, null, 8, ["include-species-in-name"])) : Q("", !0),
				e.page === "settings-suggestions" ? (K(), J(yx, {
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
				e.page === "settings-advancement" ? (K(), J(Jb, {
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
				e.page === "settings-resolution" ? (K(), J(Zb, {
					key: 5,
					"auto-select-granted-spells": V(_).autoSelectGrantedSpells,
					onAutoSelectGrantedSpellsChange: y[17] ||= (e) => V(_).autoSelectGrantedSpells = e
				}, null, 8, ["auto-select-granted-spells"])) : Q("", !0),
				e.page === "settings-resolution" ? (K(), J(Jb, {
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
				e.page === "settings-resolution" ? (K(), J(ax, {
					key: 7,
					class: "app:col-span-full",
					"ask-for-linked-skill-specializations": V(_).askForLinkedSkillSpecializations,
					"lower-career-mode": V(_).lowerCareerMode,
					onAskForLinkedSkillSpecializationsChange: y[23] ||= (e) => V(_).askForLinkedSkillSpecializations = e,
					onLowerCareerModeChange: y[24] ||= (e) => V(_).lowerCareerMode = e
				}, null, 8, ["ask-for-linked-skill-specializations", "lower-career-mode"])) : Q("", !0)
			]),
			Y("div", Ox, [Y("button", {
				class: "dui-btn dui-btn-primary dui-btn-sm",
				disabled: V(o),
				type: "button",
				onClick: y[25] ||= (...e) => V(g) && V(g)(...e)
			}, " Save Settings ", 8, kx), Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: V(o),
				type: "button",
				onClick: y[26] ||= (...e) => V(f) && V(f)(...e)
			}, " Reset to Defaults ", 8, Ax)])
		]));
	}
});
//#endregion
//#region src/module/apps/npc-builder/functions/magic-lore-resolution.ts
function Mx(e) {
	return e.map((e) => `${e.kind}:${e.sourceName}:${e.rawLore}`).sort().join("|");
}
function Nx(e) {
	return e.filter((e) => e.isAmbiguous);
}
function Px(e, t) {
	return { rows: Nx(e).map((e) => ({
		grantLabel: Ix(e),
		options: $p(e, t),
		rawLore: e.rawLore,
		resolutionKey: e.resolutionKey,
		selectedLore: "",
		sourceLabel: Lx(e)
	})) };
}
function Fx(e) {
	return e.kind === "arcane-magic" ? "Arcane Magic" : e.kind === "petty-magic" ? "Petty Magic" : "Spellcaster";
}
function Ix(e) {
	return `${Fx(e)} from ${e.sourceName}`;
}
function Lx(e) {
	return e.source === "talent" ? "Talent" : "Trait";
}
//#endregion
//#region src/module/apps/npc-builder/state/workflows/spells-workflow.ts
function Rx(e) {
	let t = Um(), { magicGrants: n, spells: r, selectedSpells: i } = Id(t), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B([]), l = /* @__PURE__ */ B(null), u = 0, d = $(() => Nx(n.value)), f = $(() => n.value.length - d.value.length);
	cs(() => Mx(n.value), () => {
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
			u === r && (a.value = zx(e));
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
				a.value = zx(e);
			} finally {
				o.value = !1;
			}
		}
	}
	async function g() {
		a.value = "", await h(), l.value = Px(n.value, c.value);
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
			a.value = zx(e);
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
function zx(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that spell action.";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/MagicLoreResolutionPromptContent.vue?vue&type=script&setup=true&lang.ts
var Bx = { class: "dui-card-body" }, Vx = { class: "dui-card-title" }, Hx = { class: "dui-fieldset" }, Ux = ["onUpdate:modelValue", "aria-label"], Wx = ["value"], Gx = { class: "dui-card-actions" }, Kx = /* @__PURE__ */ U({
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
			}, [Y("div", Bx, [
				Y("h3", Vx, I(e.grantLabel), 1),
				Y("span", null, I(e.sourceLabel) + " - " + I(e.rawLore || "Any Lore"), 1),
				Y("fieldset", Hx, [r[3] ||= Y("legend", { class: "dui-fieldset-legend" }, "Lore", -1), ts(Y("select", {
					"onUpdate:modelValue": (t) => e.selectedLore = t,
					"aria-label": `Lore for ${e.grantLabel}`,
					class: "dui-select dui-select-sm"
				}, [r[2] ||= Y("option", { value: "" }, "Leave unresolved", -1), (K(!0), q(G, null, W(e.options, (e) => (K(), q("option", {
					key: e.key,
					value: e.value
				}, I(e.label) + I(e.wind && e.wind !== "None" ? ` (${e.wind})` : ""), 9, Wx))), 128))], 8, Ux), [[Hu, e.selectedLore]])])
			])]))), 128)),
			Y("div", Gx, [Y("button", {
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
}), qx = {
	key: 0,
	class: "dui-alert"
}, Jx = {
	key: 1,
	class: "dui-list"
}, Yx = { class: "dui-list-col-grow" }, Xx = { key: 0 }, Zx = { key: 1 }, Qx = {
	key: 2,
	class: "dui-card-actions"
}, $x = ["disabled"], eS = /* @__PURE__ */ U({
	__name: "MagicAccessPanel",
	props: {
		ambiguousGrantCount: {},
		isLoadingLoreOptions: { type: Boolean },
		magicGrants: {}
	},
	emits: ["resolveLores"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (K(), J(Eh, {
			description: "Magic Talents and Traits determine which spell Lores are available.",
			number: "1",
			title: "Magic Access"
		}, {
			default: H(() => [e.magicGrants.length ? (K(), q("ul", Jx, [(K(!0), q(G, null, W(e.magicGrants, (e) => (K(), q("li", {
				key: `${e.source}:${e.sourceName}:${e.rawLore}`,
				class: "dui-list-row"
			}, [Y("div", Yx, [
				Y("strong", null, I(V(Fx)(e)), 1),
				Y("span", null, I(V(Lx)(e)) + " - " + I(e.sourceName), 1),
				e.isAmbiguous ? (K(), q("small", Xx, " Needs Lore resolution before automatic spells can be found. ")) : (K(), q("small", Zx, " Lore: " + I(e.rawLore || e.normalizedLore), 1))
			])]))), 128))])) : (K(), q("p", qx, " No magic-enabling Talent or Trait is selected. ")), e.ambiguousGrantCount ? (K(), q("div", Qx, [Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.isLoadingLoreOptions,
				type: "button",
				onClick: r[0] ||= (e) => n("resolveLores")
			}, I(e.isLoadingLoreOptions ? "Loading Lores..." : "Resolve Lores"), 9, $x)])) : Q("", !0)]),
			_: 1
		}));
	}
});
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderSpellsTab/labels.ts
function tS(e) {
	return e.source === "custom" ? "Dropped" : e.sourceLabel;
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderSpellsTab/SpellSelectionPanel.vue?vue&type=script&setup=true&lang.ts
var nS = { class: "dui-card-actions" }, rS = ["disabled"], iS = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, aS = {
	key: 1,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, oS = {
	key: 2,
	class: "dui-list"
}, sS = [
	"aria-label",
	"checked",
	"onChange"
], cS = { class: "dui-list-col-grow" }, lS = {
	key: 0,
	class: "dui-avatar"
}, uS = ["src"], dS = ["onClick"], fS = {
	key: 3,
	class: "dui-alert"
}, pS = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(Eh, {
			description: "Select detected Lore spells or drop specific Spell Items.",
			number: "2",
			title: "Spells"
		}, {
			default: H(() => [
				X(Xy, {
					description: "Add a specific Spell item regardless of detected Lores.",
					title: "Drop Spell Items",
					onDropData: r[0] ||= (e) => n("spellDrop", e)
				}),
				Y("div", nS, [Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: e.isLoadingSpells || !e.resolvedGrantCount,
					type: "button",
					onClick: r[1] ||= (e) => n("refreshSpells")
				}, I(e.isLoadingSpells ? "Finding spells..." : "Refresh Spells"), 9, rS), Y("span", null, I(e.selectedSpellCount) + " selected / " + I(e.spells.length) + " found", 1)]),
				e.errorMessage ? (K(), q("p", iS, I(e.errorMessage), 1)) : Q("", !0),
				e.ambiguousGrantCount ? (K(), q("p", aS, I(e.ambiguousGrantCount) + " magic grant" + I(e.ambiguousGrantCount === 1 ? "" : "s") + " still need Lore resolution. You can still drop specific spells for now. ", 1)) : Q("", !0),
				e.spells.length ? (K(), q("ul", oS, [(K(!0), q(G, null, W(e.spells, (e) => (K(), q("li", {
					key: e.key,
					class: "dui-list-row"
				}, [
					Y("input", {
						"aria-label": `Use ${e.name}`,
						class: "dui-checkbox dui-checkbox-sm",
						checked: e.selected,
						type: "checkbox",
						onChange: (t) => n("spellSelectedChange", e, t)
					}, null, 40, sS),
					Y("div", cS, [
						e.img ? (K(), q("div", lS, [Y("div", null, [Y("img", {
							src: e.img,
							alt: ""
						}, null, 8, uS)])])) : Q("", !0),
						Y("strong", null, I(e.name), 1),
						Y("span", null, I(e.loreName || "Unknown Lore") + " · " + I(V(tS)(e)), 1)
					]),
					e.source === "custom" ? (K(), q("button", {
						key: 0,
						class: "dui-btn dui-btn-sm",
						type: "button",
						onClick: (t) => n("removeCustomSpell", e.key)
					}, " Remove ", 8, dS)) : Q("", !0)
				]))), 128))])) : (K(), q("p", fS, " No matching spells found yet. Drop specific spells here, or resolve a non-ambiguous magic Lore. "))
			]),
			_: 1
		}));
	}
}), mS = /* @__PURE__ */ U({
	__name: "NpcBuilderSpellsTab",
	props: { bridge: {} },
	setup(e) {
		let { ambiguousGrants: t, confirmMagicLorePrompt: n, dismissMagicLorePrompt: r, errorMessage: i, handleSpellDrop: a, initialize: o, isLoadingLoreOptions: s, isLoadingSpells: c, loadDetectedSpells: l, magicGrants: u, openMagicLorePrompt: d, pendingMagicLorePrompt: f, removeCustomSpell: p, resolvedGrantCount: m, selectedSpells: h, setSpellSelected: g, spells: _ } = Rx(e.bridge);
		js(() => {
			o();
		});
		function v(e, t) {
			let n = t.target;
			n && g(e.key, n.checked);
		}
		return (e, o) => (K(), q("section", null, [
			X(Zm, {
				open: V(f) !== null,
				title: "Resolve Magic Lores",
				onClose: V(r)
			}, {
				default: H(() => [V(f) ? (K(), J(Kx, {
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
			X(eS, {
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
			X(pS, {
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
}), hS = { class: "dui-collapse-title" }, gS = { class: "dui-badge" }, _S = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, vS = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, yS = { class: "dui-collapse-content" }, bS = { class: "dui-fieldset" }, xS = { class: "dui-fieldset-legend" }, SS = [
	"aria-label",
	"value",
	"onInput"
], CS = {
	key: 0,
	class: "dui-fieldset"
}, wS = [
	"aria-label",
	"value",
	"onChange"
], TS = ["value"], ES = {
	key: 1,
	class: "dui-fieldset"
}, DS = [
	"aria-label",
	"value",
	"onInput"
], OS = ["onClick"], kS = {
	key: 0,
	class: "dui-alert"
}, AS = /* @__PURE__ */ U({
	__name: "NpcBuilderTraitsTab",
	props: { difficultyOptions: {} },
	setup(e) {
		let t = Um(), { traits: n } = Id(t);
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
		return (t, o) => (K(), J(Eh, {
			description: "Open a Trait to review its WFRP configuration before building.",
			title: "Traits"
		}, {
			default: H(() => [(K(!0), q(G, null, W(V(n), (t) => (K(), q("details", {
				key: t.key,
				class: "dui-collapse dui-collapse-arrow dui-card-border"
			}, [Y("summary", hS, [
				Y("strong", null, I(t.name), 1),
				Y("span", gS, I(r(t)), 1),
				t.config.rollable ? (K(), q("span", _S, "Rollable")) : Q("", !0),
				t.config.damage ? (K(), q("span", vS, "Damage")) : Q("", !0)
			]), Y("div", yS, [
				Y("fieldset", bS, [Y("legend", xS, I(t.config.damage ? "Damage" : "Specification"), 1), Y("input", {
					"aria-label": `${t.config.damage ? "Damage" : "Specification"} for ${t.name}`,
					class: "dui-input dui-input-sm",
					value: t.config.specification,
					placeholder: "None",
					type: "text",
					onInput: (e) => a(t, "specification", e)
				}, null, 40, SS)]),
				t.config.rollable && !t.config.damage ? (K(), q("fieldset", CS, [o[0] ||= Y("legend", { class: "dui-fieldset-legend" }, "Difficulty", -1), Y("select", {
					"aria-label": `Difficulty for ${t.name}`,
					class: "dui-select dui-select-sm",
					value: t.config.defaultDifficulty,
					onChange: (e) => a(t, "defaultDifficulty", e)
				}, [(K(!0), q(G, null, W(e.difficultyOptions, (e) => (K(), q("option", {
					key: e.value,
					value: e.value
				}, I(e.label), 9, TS))), 128))], 40, wS)])) : Q("", !0),
				t.config.damage && t.config.dice ? (K(), q("fieldset", ES, [o[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Dice", -1), Y("input", {
					"aria-label": `Dice for ${t.name}`,
					class: "dui-input dui-input-sm",
					value: t.config.dice,
					placeholder: "Optional",
					type: "text",
					onInput: (e) => a(t, "dice", e)
				}, null, 40, DS)])) : Q("", !0),
				Y("button", {
					class: "dui-btn dui-btn-sm",
					type: "button",
					onClick: (e) => i(t)
				}, "Remove", 8, OS)
			])]))), 128)), V(n).length ? Q("", !0) : (K(), q("p", kS, "No traits are selected yet."))]),
			_: 1
		}));
	}
}), jS = "__blank-item__";
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderTrappingsTab/resolution-labels.ts
function MS(e) {
	return e.source === "base" ? "Base" : e.source === "career" ? "Career" : "Custom";
}
function NS(e) {
	return e.resolution.status === "matched" ? `Matched ${e.resolution.selectedName}` : e.resolution.status === "fallback" ? `Blank ${e.resolution.selectedName || e.name}` : e.resolution.candidates.length ? "Choose a match" : "Needs resolution";
}
function PS(e) {
	return e.ignored ? "Ignored" : e.resolution.status === "matched" ? "Matched" : e.resolution.status === "fallback" ? "Blank item" : e.resolution.status === "ambiguous" || e.resolution.candidates.length ? "Choose" : "Needs resolution";
}
function FS(e) {
	let t = "dui-badge";
	return e.ignored ? [t, "dui-badge-ghost"] : e.resolution.status === "matched" ? [t, "dui-badge-success"] : e.resolution.status === "fallback" ? [t, "dui-badge-info"] : e.resolution.status === "ambiguous" || e.resolution.candidates.length ? [t, "dui-badge-warning"] : [t, "dui-badge-error"];
}
function IS(e) {
	return e.resolution.status === "fallback" ? jS : e.resolution.selectedCandidateUuid;
}
function LS(e) {
	return e.source === "career";
}
function RS(e) {
	return e.resolution.candidates.length > 0 || LS(e);
}
function zS(e) {
	return e.resolution.searchTerms.length <= 1 ? "" : `Options: ${e.resolution.searchTerms.join(" / ")}`;
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderTrappingsTab/TrappingsTable.vue?vue&type=script&setup=true&lang.ts
var BS = {
	key: 0,
	class: "dui-list"
}, VS = [
	"aria-label",
	"checked",
	"onChange"
], HS = { class: "dui-list-col-grow app:grid app:gap-2" }, US = { key: 0 }, WS = {
	key: 1,
	class: "dui-fieldset"
}, GS = [
	"aria-label",
	"value",
	"onChange"
], KS = {
	key: 0,
	value: ""
}, qS = ["value"], JS = ["value"], YS = { key: 2 }, XS = { class: "dui-card-actions" }, ZS = { class: "dui-fieldset" }, QS = [
	"aria-label",
	"value",
	"onInput"
], $S = ["onClick"], eC = {
	key: 1,
	class: "dui-alert"
}, tC = /* @__PURE__ */ U({
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
		return (t, r) => e.trappings.length ? (K(), q("ul", BS, [(K(!0), q(G, null, W(e.trappings, (e) => (K(), q("li", {
			key: e.key,
			class: "dui-list-row"
		}, [Y("input", {
			"aria-label": `Use ${e.name}`,
			class: "dui-checkbox dui-checkbox-sm",
			checked: !e.ignored,
			type: "checkbox",
			onChange: (t) => n("useChange", e.key, t)
		}, null, 40, VS), Y("div", HS, [
			Y("strong", null, I(e.name), 1),
			Y("span", null, I(e.resolution.selectedItemType || e.itemType || "trapping") + " · " + I(V(MS)(e)), 1),
			V(zS)(e) ? (K(), q("span", US, I(V(zS)(e)), 1)) : Q("", !0),
			Y("span", { class: F(V(FS)(e)) }, I(V(PS)(e)), 3),
			V(RS)(e) ? (K(), q("fieldset", WS, [r[0] ||= Y("legend", { class: "dui-fieldset-legend" }, "Resolution", -1), Y("select", {
				"aria-label": `Resolution for ${e.name}`,
				class: "dui-select dui-select-sm",
				value: V(IS)(e),
				onChange: (t) => n("resolutionChange", e.key, t)
			}, [
				e.resolution.candidates.length ? (K(), q("option", KS, "Choose match")) : Q("", !0),
				(K(!0), q(G, null, W(e.resolution.candidates, (e) => (K(), q("option", {
					key: e.uuid,
					value: e.uuid
				}, I(e.name) + " (" + I(e.sourceLabel) + ") ", 9, qS))), 128)),
				V(LS)(e) ? (K(), q("option", {
					key: 1,
					value: V(jS)
				}, " Blank Item ", 8, JS)) : Q("", !0)
			], 40, GS)])) : (K(), q("span", YS, I(V(NS)(e)), 1)),
			Y("div", XS, [Y("fieldset", ZS, [r[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Quantity", -1), Y("input", {
				"aria-label": `Quantity for ${e.name}`,
				class: "dui-input dui-input-sm",
				value: e.quantity,
				min: "1",
				type: "number",
				onInput: (t) => n("quantityInput", e.key, t)
			}, null, 40, QS)]), e.source === "custom" ? (K(), q("button", {
				key: 0,
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: (t) => n("removeCustomTrapping", e.key)
			}, " Remove ", 8, $S)) : Q("", !0)])
		])]))), 128))])) : (K(), q("p", eC, "No trappings are selected yet."));
	}
}), nC = { class: "dui-card-actions" }, rC = ["disabled"], iC = { key: 0 }, aC = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, oC = /* @__PURE__ */ U({
	__name: "NpcBuilderTrappingsTab",
	props: { bridge: {} },
	setup(e) {
		let t = e, n = Um(), { trappings: r } = Id(n), i = /* @__PURE__ */ B(""), a = /* @__PURE__ */ B(!1), o = $(() => r.value.filter((e) => !e.ignored && e.resolution.status === "unresolved"));
		js(() => {
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
		return (e, t) => (K(), J(Eh, {
			description: "Review the Items that will be embedded in the generated NPC.",
			title: "Trappings"
		}, {
			default: H(() => [
				Y("div", nC, [Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: a.value || !o.value.length,
					type: "button",
					onClick: u
				}, I(a.value ? "Resolving..." : "Resolve Trappings"), 9, rC), o.value.length ? (K(), q("span", iC, I(o.value.length) + " unresolved ", 1)) : Q("", !0)]),
				i.value ? (K(), q("p", aC, I(i.value), 1)) : Q("", !0),
				X(tC, {
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
function sC(e, t) {
	let n = /* @__PURE__ */ new Map(), r = [], i = [];
	for (let a of e) {
		let e = /* @__PURE__ */ new Map();
		for (let o of Qd(a.career.uuid, a.career.grants.skills)) {
			let s = Zd(o.originalName);
			if (!s) continue;
			let c = $d(o.originalName), l = n.get(c) ?? [], u = e.get(c) ?? 0, d = t.enableLinkedSkillResolution && l[u] ? l[u] : "";
			if (e.set(c, u + 1), d) {
				r.push({
					linkedFromKey: d,
					resolutionKey: o.resolutionKey
				});
				continue;
			}
			i.push({
				alreadyGrantedSpecializations: fC(a.career.grants.skills, s.baseName),
				baseName: s.baseName,
				careerLabel: pC(a.career),
				isLoadingSuggestions: !1,
				occurrence: o.occurrence,
				options: s.options,
				originalName: s.originalName,
				resolvedSpecialization: mC(s),
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
function cC(e) {
	return e.resolvedSpecialization.trim() ? Yd(e.baseName, e.resolvedSpecialization) : "";
}
function lC(e) {
	return e.occurrence > 0 ? `${e.originalName}, choice ${e.occurrence + 1}` : e.originalName;
}
function uC(e) {
	return e.options.length <= 1 && e.specialization.trim().toLocaleLowerCase() === "any";
}
function dC(e, t) {
	let n = $d(t);
	return e.alreadyGrantedSpecializations.some((e) => $d(e) === n);
}
function fC(e, t) {
	let n = $d(t), r = /* @__PURE__ */ new Set(), i = [];
	for (let t of e) {
		let e = Xd(t);
		if (!e || $d(e.baseName) !== n) continue;
		let a = $d(e.specialization);
		r.has(a) || (r.add(a), i.push(e.specialization));
	}
	return i;
}
function pC(e) {
	return e.level === null ? e.name : `${e.name}, tier ${e.level}`;
}
function mC(e) {
	return e.specialization.trim().toLocaleLowerCase() === "any" ? "" : e.options[0] ?? "";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/SkillResolutionPromptContent.vue?vue&type=script&setup=true&lang.ts
var hC = { class: "dui-card-body" }, gC = { class: "dui-card-title" }, _C = { class: "dui-badge" }, vC = { class: "dui-fieldset" }, yC = { class: "app:grid app:gap-1" }, bC = ["onUpdate:modelValue", "aria-label"], xC = ["value"], SC = [
	"onUpdate:modelValue",
	"aria-label",
	"placeholder"
], CC = {
	key: 0,
	class: "dui-label app:text-error"
}, wC = {
	key: 0,
	class: "dui-card-actions"
}, TC = { key: 0 }, EC = ["onClick"], DC = {
	key: 0,
	class: "dui-badge dui-badge-error dui-badge-xs"
}, OC = {
	key: 0,
	class: "dui-alert dui-alert-info"
}, kC = { class: "dui-card-actions" }, AC = /* @__PURE__ */ U({
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
			return !!e.resolvedSpecialization && dC(e, e.resolvedSpecialization);
		}
		return (t, i) => (K(), q("section", null, [
			i[5] ||= Y("p", null, " Some Career skills need a specialization before they become concrete WFRP skills. Blank rows can be left unresolved and edited later. ", -1),
			(K(!0), q(G, null, W(e.prompt.rows, (t) => (K(), q("section", {
				key: t.resolutionKey,
				class: "dui-card dui-card-border dui-card-sm"
			}, [Y("div", hC, [
				Y("h3", gC, I(e.getSkillResolutionLabel(t)), 1),
				Y("span", _C, I(t.careerLabel), 1),
				Y("fieldset", vC, [
					i[4] ||= Y("legend", { class: "dui-fieldset-legend" }, "Specialization", -1),
					Y("label", yC, [i[3] ||= Y("span", { class: "dui-label" }, "Choice", -1), t.options.length > 1 ? ts((K(), q("select", {
						key: 0,
						"onUpdate:modelValue": (e) => t.resolvedSpecialization = e,
						"aria-label": `Specialization for ${e.getSkillResolutionLabel(t)}`,
						class: F(["dui-select dui-select-sm", { "dui-select-error": V(dC)(t, t.resolvedSpecialization) }])
					}, [i[2] ||= Y("option", { value: "" }, "Leave unresolved", -1), (K(!0), q(G, null, W(t.options, (e) => (K(), q("option", {
						key: e,
						class: F({ "app:text-error": V(dC)(t, e) }),
						value: e
					}, I(e) + I(V(dC)(t, e) ? " — already granted" : ""), 11, xC))), 128))], 10, bC)), [[Hu, t.resolvedSpecialization]]) : ts((K(), q("input", {
						key: 1,
						"onUpdate:modelValue": (e) => t.resolvedSpecialization = e,
						"aria-label": `Specialization for ${e.getSkillResolutionLabel(t)}`,
						class: F(["dui-input dui-input-sm", { "dui-input-error": V(dC)(t, t.resolvedSpecialization) }]),
						placeholder: t.suggestedSpecializations.length ? "Type or choose below" : t.specialization,
						type: "text"
					}, null, 10, SC)), [[zu, t.resolvedSpecialization]])]),
					r(t) ? (K(), q("p", CC, " Already granted by this Career. ")) : Q("", !0)
				]),
				e.usesFreeformSkillSpecialization(t) ? (K(), q("div", wC, [t.isLoadingSuggestions ? (K(), q("small", TC, "Finding known choices.")) : Q("", !0), (K(!0), q(G, null, W(t.suggestedSpecializations, (e) => (K(), q("button", {
					key: `${t.resolutionKey}:${e}`,
					class: F(["dui-btn dui-btn-sm", { "dui-btn-error dui-btn-outline": V(dC)(t, e) }]),
					type: "button",
					onClick: (r) => n("chooseSkillSpecialization", t, e)
				}, [Z(I(e) + " ", 1), V(dC)(t, e) ? (K(), q("span", DC, " Already granted ")) : Q("", !0)], 10, EC))), 128))])) : Q("", !0)
			])]))), 128)),
			e.prompt.linkedRows.length ? (K(), q("div", OC, I(e.prompt.linkedRows.length) + " linked skill specialization" + I(e.prompt.linkedRows.length === 1 ? "" : "s") + " will reuse earlier choices from this career chain. ", 1)) : Q("", !0),
			Y("div", kC, [Y("button", {
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
function jC(e) {
	return e === "build-actor" || e === "build-careers" || e === "build-quick";
}
function MC(e) {
	return e === "settings-advancement" || e === "settings-folders" || e === "settings-resolution" || e === "settings-suggestions";
}
function NC(e) {
	return e === "automatic-xp" || e === "detail-characteristics" || e === "detail-skills" || e === "detail-talents";
}
function PC(e) {
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
var FC = ["aria-current", "onClick"], IC = ["aria-current", "popovertarget"], LC = ["id"], RC = ["onClick"], zC = /* @__PURE__ */ U({
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
		}, I(t.label), 9, FC)) : (K(), q(G, { key: 1 }, [Y("button", {
			"aria-current": t.isActive ? "page" : void 0,
			popovertarget: t.popoverId,
			type: "button"
		}, I(t.label), 9, IC), Y("div", {
			id: t.popoverId,
			popover: ""
		}, [Y("ul", { class: F(["dui-menu app:min-w-56 app:p-2", t.columnsClass]) }, [(K(!0), q(G, null, W(t.pages, (t) => (K(), q("li", { key: t.page }, [Y("button", {
			class: F({ "dui-menu-active": e.activePage === t.page }),
			type: "button",
			onClick: (e) => n("pageSelect", t.page, e)
		}, I(V(PC)(t.page)), 11, RC)]))), 128))], 2)], 8, LC)], 64))], 64))), 128))], 64));
	}
}), BC = { class: "dui-navbar app:sticky app:top-0 app:z-20 app:flex-wrap app:gap-2 app:bg-base-200 app:px-3 app:py-2" }, VC = { class: "dui-navbar-start app:min-w-64 app:flex-1" }, HC = { class: "app:min-w-0" }, UC = { class: "app:text-base-content/70" }, WC = {
	"aria-label": "NPC Builder pages",
	class: "app:order-3 app:flex app:w-full app:flex-wrap app:items-center app:justify-start app:gap-2"
}, GC = {
	id: "npc-builder-megamenu",
	class: "dui-megamenu max-sm:dui-megamenu-vertical dui-megamenu-sm app:ml-0 app:mr-auto app:border app:border-base-300 app:bg-base-100 app:p-2",
	popover: ""
}, KC = { class: "dui-navbar-end app:w-auto app:shrink-0" }, qC = ["disabled"], JC = /* @__PURE__ */ U({
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
		return (t, n) => (K(), q("header", BC, [
			Y("div", VC, [Y("div", HC, [
				n[1] ||= Y("span", { class: "dui-badge dui-badge-outline" }, "WFRP4e Customizer", -1),
				n[2] ||= Y("h1", { class: "app:m-0 app:text-xl app:leading-tight" }, "NPC Builder", -1),
				Y("small", UC, [e.selectedBaseActorName ? (K(), q(G, { key: 0 }, [Z(I(e.selectedBaseActorName) + " base · " + I(e.finalActorName), 1)], 64)) : (K(), q(G, { key: 1 }, [Z("Choose a base character, then shape the final NPC.")], 64))])
			])]),
			Y("nav", WC, [n[3] ||= Y("button", {
				"aria-label": "Open NPC Builder navigation",
				class: "dui-btn dui-btn-sm sm:app:hidden",
				popovertarget: "npc-builder-megamenu",
				type: "button"
			}, " Menu ", -1), Y("div", GC, [X(zC, {
				"active-page": e.activePage,
				groups: c.value,
				onPageSelect: l
			}, null, 8, ["active-page", "groups"])])]),
			Y("div", KC, [Y("button", {
				class: "dui-btn dui-btn-primary",
				disabled: !e.canBuild,
				type: "button",
				onClick: n[0] ||= (e) => r("buildNpc")
			}, " Build NPC ", 8, qC)])
		]));
	}
});
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderApplicationDrop.ts
function YC(e, t, n, r) {
	let i = Um(), a = /* @__PURE__ */ B(!1);
	function o(e) {
		XC(e) || (e.preventDefault(), a.value = !0);
	}
	function s(e) {
		if (XC(e)) return;
		let t = e.currentTarget, n = e.relatedTarget;
		t instanceof Node && n instanceof Node && t.contains(n) || (a.value = !1);
	}
	function c(e) {
		XC(e) || (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"));
	}
	async function l(o) {
		if (!XC(o)) {
			o.preventDefault(), a.value = !1, r.value = "";
			try {
				let r = await e.resolveApplicationDrop(o.dataTransfer?.getData("text/plain") ?? "");
				r.kind === "actor" ? i.selectBaseActor(r.actor) : r.kind === "career" ? await n(r.career, { replaceQueue: t.value === "build-quick" }) : r.kind === "advancement" ? i.addCustomAdvancement(r.advancement) : r.kind === "trapping" ? i.addCustomTrapping(r.trapping) : r.kind === "trait" ? i.addCustomTrait(r.trait) : i.addCustomSpell(r.spell);
			} catch (e) {
				r.value = Zy(e);
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
function XC(e) {
	let t = e.dataTransfer, n = t?.getData("text/plain") ?? "", r = Array.from(t?.types ?? []);
	return n.startsWith("npc-builder-career:") || kp(n) !== null || r.includes(Zv);
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderBuild.ts
function ZC(e, t, n, r, i) {
	let a = Um(), { advancements: o, buildTraits: s, careers: c, finalActorName: l, finalPortraitPath: u, selectedMountActorUuid: d, selectedBaseActor: f, selectedSpells: p, settings: m, trappings: h } = Id(a), g = /* @__PURE__ */ B(!1), _ = $(() => !!(f.value && c.value.length && !g.value && !i.value));
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
			r.value = Zy(e), n.value = "";
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
function QC(e) {
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
function $C(e) {
	return [{
		career: e,
		mode: "add-or-increment"
	}];
}
function ew(e) {
	return [...e.candidates.filter((t) => e.selectedUuids.includes(t.uuid)).map((e) => ({
		career: e,
		mode: "add-if-missing"
	})), {
		career: e.droppedCareer,
		mode: "add-or-increment"
	}];
}
function tw(e) {
	let t = e.candidates.filter((t) => e.selectedUuids.includes(t.uuid)).length;
	return t === 0 ? "" : `Added ${t} lower-tier career candidate${t === 1 ? "" : "s"}.`;
}
function nw(e, t) {
	return e?.selectedUuids.includes(t) ?? !1;
}
function rw(e) {
	let { candidateUuid: t, isAlreadyQueued: n, prompt: r, selected: i } = e;
	return !r || n ? null : i ? [...new Set([...r.selectedUuids, t])] : r.selectedUuids.filter((e) => e !== t);
}
//#endregion
//#region src/module/apps/npc-builder/state/workflows/skill-suggestions.ts
async function iw(e, t) {
	await Promise.all(t.rows.map(async (t) => {
		if (uC(t)) {
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
function aw(e) {
	let t = Um(), { careers: n, settings: r } = Id(t), i = /* @__PURE__ */ B(""), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(null), c = /* @__PURE__ */ B(null), l = $(() => QC(s.value));
	async function u(t, n = {}) {
		a.value = "";
		try {
			await d(await e.resolveCareerDrop(t), n);
		} catch (e) {
			a.value = ow(e);
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
		m($C(e), {
			enableLinkedSkillResolution: !1,
			message: ""
		});
	}
	function m(t, n) {
		let r = sC(t, n);
		if (r.rows.length) {
			c.value = r, iw(e, c.value);
			return;
		}
		b(t, n.message);
	}
	function h() {
		let e = s.value;
		e && (s.value = null, m(ew(e), {
			enableLinkedSkillResolution: !r.value.askForLinkedSkillSpecializations,
			message: tw(e)
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
			for (let n of e.rows) t.setSkillGrantResolution(n.resolutionKey, cC(n));
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
		return nw(s.value, e);
	}
	function C(e, t) {
		let n = rw({
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
		getSkillResolutionLabel: lC,
		addCareerSummaryWithLowerCareerMode: d,
		handleCareerDrop: u,
		isCareerQueued: x,
		isFindingLowerCareers: o,
		isLowerCareerSelected: S,
		lowerCareerCandidateGroups: l,
		pendingLowerCareerPrompt: s,
		pendingSkillResolutionPrompt: c,
		setLowerCareerSelected: C,
		usesFreeformSkillSpecialization: uC
	};
}
function ow(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderCareerDropWorkflow.ts
function sw(e) {
	return aw(e);
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderInitialData.ts
function cw(e, t) {
	let n = Um(), { selectedBaseActorUuid: r, selectedMountActorUuid: i, settings: a } = Id(n), o = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B([]);
	js(async () => {
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
			t.value = Zy(e);
		} finally {
			o.value = !1;
		}
	}), cs(r, async (r) => {
		if (t.value = "", !r) {
			n.clearBaseDraftData(), n.hydrateBaseActorCombatProfile(null);
			return;
		}
		r === i.value && n.clearMountSelection(), n.hydrateBaseActorCombatProfile(null), s.value = !0;
		try {
			let [t, i] = await Promise.all([e.loadBaseActorDraftData(r), e.loadActorCombatProfile(r)]);
			n.hydrateBaseActorDraftData(t), n.hydrateBaseActorCombatProfile(i);
		} catch (e) {
			t.value = Zy(e), n.clearBaseDraftData(), n.hydrateBaseActorCombatProfile(null);
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
function lw() {
	return {
		inFlightNames: [],
		successfulNames: []
	};
}
function uw(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.kind === "skill" && !n.characteristicKey && !Zd(n.name) && t.add(n.name);
	return [...t];
}
function dw(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.kind === "talent" && !n.talentMaximumKey && t.add(n.name);
	return [...t];
}
function fw(e, t) {
	let n = new Set([...t.inFlightNames, ...t.successfulNames]);
	return e.filter((e) => {
		let t = $d(e);
		return n.has(t) ? !1 : (n.add(t), !0);
	});
}
function pw(e, t) {
	return {
		...e,
		inFlightNames: gw([...e.inFlightNames, ...t])
	};
}
function mw(e, t) {
	let n = new Set(gw(t));
	return {
		inFlightNames: e.inFlightNames.filter((e) => !n.has(e)),
		successfulNames: gw([...e.successfulNames, ...n])
	};
}
function hw(e, t) {
	let n = new Set(gw(t));
	return {
		...e,
		inFlightNames: e.inFlightNames.filter((e) => !n.has(e))
	};
}
function gw(e) {
	return [...new Set([...e].map($d).filter(Boolean))];
}
//#endregion
//#region src/module/apps/npc-builder/state/workflows/metadata-lookups-workflow.ts
function _w(e) {
	let t = Um(), { advancements: n } = Id(t), r = /* @__PURE__ */ B(lw()), i = /* @__PURE__ */ B(lw()), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(""), s = $(() => uw(n.value)), c = $(() => dw(n.value)), l = $(() => [a.value, o.value].filter(Boolean).join(" ")), u = $(() => l.value ? "degraded" : r.value.inFlightNames.length + i.value.inFlightNames.length > 0 ? "loading" : "ready");
	cs(s, (e) => {
		d(e);
	}, { immediate: !0 }), cs(c, (e) => {
		f(e);
	}, { immediate: !0 });
	async function d(n) {
		if (!n.length) {
			a.value = "";
			return;
		}
		let i = fw(n, r.value);
		if (i.length) {
			r.value = pw(r.value, i), a.value = "";
			try {
				let n = await e.listSkillCharacteristics(i);
				r.value = mw(r.value, i), t.hydrateSkillCharacteristics(n);
			} catch (e) {
				r.value = hw(r.value, i), a.value = vw("skill characteristics", e);
			}
		}
	}
	async function f(n) {
		if (!n.length) {
			o.value = "";
			return;
		}
		let r = fw(n, i.value);
		if (r.length) {
			i.value = pw(i.value, r), o.value = "";
			try {
				let n = await e.listTalentMaximums(r);
				i.value = mw(i.value, r), t.hydrateTalentMaximums(n);
			} catch (e) {
				i.value = hw(i.value, r), o.value = vw("Talent maximums", e);
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
function vw(e, t) {
	return `Could not load ${e}.${t instanceof Error ? ` ${t.message}` : ""}`;
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderMetadataLookups.ts
function yw(e) {
	return _w(e);
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp.vue?vue&type=script&setup=true&lang.ts
var bw = ["id", "aria-label"], xw = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, Sw = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, Cw = {
	key: 2,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, ww = {
	key: 3,
	"aria-live": "polite",
	class: "dui-alert dui-alert-warning",
	role: "status"
}, Tw = /* @__PURE__ */ U({
	__name: "NpcBuilderApp",
	props: { bridge: {} },
	setup(e) {
		let t = e, { finalActorName: n, hasMagicAccess: r, selectedBaseActor: i, selectedSpells: a } = Id(Um()), o = /* @__PURE__ */ B("build-quick"), s = gs(), c = $(() => r.value || a.value.length > 0), { addCareerSummaryWithLowerCareerMode: l, buildMessage: u, chooseSkillSpecialization: d, confirmLowerCareerPrompt: f, confirmSkillResolutionPrompt: p, dismissLowerCareerPrompt: m, dismissSkillResolutionPrompt: h, errorMessage: g, getSkillResolutionLabel: _, isCareerQueued: v, isFindingLowerCareers: y, isLowerCareerSelected: b, lowerCareerCandidateGroups: x, pendingLowerCareerPrompt: S, pendingSkillResolutionPrompt: C, setLowerCareerSelected: w, usesFreeformSkillSpecialization: ee } = sw(t.bridge), { buildNpc: te, canBuild: ne } = ZC(t.bridge, o, u, g, y), { isLoadingActors: re, isLoadingBaseDraft: T, traitDifficultyOptions: ie } = cw(t.bridge, g), { metadataLookupError: E, metadataLookupStatus: ae, retryMetadataLookups: D } = yw(t.bridge), { handleApplicationDragEnter: O, handleApplicationDragLeave: oe, handleApplicationDragOver: se, handleApplicationDrop: ce, isApplicationDragOver: le } = YC(t.bridge, o, l, g);
		return (e, r) => (K(), q("section", {
			"aria-label": "NPC Builder",
			class: F(["app:flex app:min-h-full app:flex-col", { "app:ring-2 app:ring-info": V(le) }]),
			onDragenter: r[2] ||= (...e) => V(O) && V(O)(...e),
			onDragleave: r[3] ||= (...e) => V(oe) && V(oe)(...e),
			onDragover: r[4] ||= (...e) => V(se) && V(se)(...e),
			onDrop: r[5] ||= (...e) => V(ce) && V(ce)(...e)
		}, [
			X(JC, {
				"active-page": o.value,
				"can-build": V(ne),
				"final-actor-name": V(n),
				"has-spell-page": c.value,
				"selected-base-actor-name": V(i)?.name ?? "",
				onBuildNpc: V(te),
				onPageChange: r[0] ||= (e) => o.value = e
			}, null, 8, [
				"active-page",
				"can-build",
				"final-actor-name",
				"has-spell-page",
				"selected-base-actor-name",
				"onBuildNpc"
			]),
			X(Zm, {
				open: V(S) !== null,
				title: "Add Lower-Tier Careers?",
				onClose: V(m)
			}, {
				default: H(() => [V(S) ? (K(), J(qm, {
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
			X(Zm, {
				open: V(C) !== null,
				title: "Resolve Skill Specializations",
				onClose: V(h)
			}, {
				default: H(() => [V(C) ? (K(), J(AC, {
					key: 0,
					"get-skill-resolution-label": V(_),
					prompt: V(C),
					"uses-freeform-skill-specialization": V(ee),
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
				"aria-label": V(PC)(o.value),
				class: "app:grid app:flex-1 app:content-start app:gap-3 app:p-3"
			}, [
				V(g) ? (K(), q("p", xw, I(V(g)), 1)) : V(u) ? (K(), q("p", Sw, I(V(u)), 1)) : V(le) ? (K(), q("p", Cw, " Release to add this document to the NPC draft. ")) : Q("", !0),
				V(ae) === "degraded" ? (K(), q("div", ww, [
					Y("span", null, I(V(E)), 1),
					r[6] ||= Y("span", null, "Advancement rows remain editable with reduced metadata.", -1),
					Y("button", {
						class: "dui-btn dui-btn-sm",
						type: "button",
						onClick: r[1] ||= (...e) => V(D) && V(D)(...e)
					}, " Retry Metadata ")
				])) : Q("", !0),
				V(MC)(o.value) ? (K(), J(jx, {
					key: 4,
					bridge: t.bridge,
					page: o.value
				}, null, 8, ["bridge", "page"])) : V(NC)(o.value) ? (K(), J(og, {
					key: 5,
					page: o.value
				}, null, 8, ["page"])) : o.value === "trappings" ? (K(), J(oC, {
					key: 6,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : o.value === "traits" ? (K(), J(AS, {
					key: 7,
					"difficulty-options": V(ie)
				}, null, 8, ["difficulty-options"])) : o.value === "detail-spells" ? (K(), J(mS, {
					key: 8,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : o.value === "mount" ? (K(), J(Sb, {
					key: 9,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : V(jC)(o.value) ? (K(), J(sy, {
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
			], 8, bw)
		], 34));
	}
}), Ew = xd();
//#endregion
//#region src/module/foundry/document-drop.ts
function Dw(e) {
	let t = e.value.trim();
	if (!t) return "";
	if (Iw(t)) return t;
	let n = Mw(t), r = Pw(n, e.documentType);
	return r ? Lw(n) ? JSON.stringify({
		type: r,
		uuid: n
	}) : JSON.stringify({
		id: n,
		type: r
	}) : "";
}
function Ow(e) {
	let t = !0;
	function n() {
		t && (t = !1, document.removeEventListener("click", r, !0));
	}
	function r(t) {
		let r = t.target;
		if (!(r instanceof Element)) return;
		let i = kw(r);
		i && (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), n(), e(i));
	}
	return document.addEventListener("click", r, !0), n;
}
function kw(e) {
	let t = e.closest("[data-uuid], [data-document-uuid], [data-entry-uuid], [data-document-id], [data-entry-id], [data-pack]");
	if (!t) return "";
	let n = t.dataset.uuid || t.dataset.documentUuid || t.dataset.entryUuid || "";
	if (n) return jw(n);
	let r = t.dataset.documentId || t.dataset.entryId || "", i = Nw(t);
	if (!r || !i) return "";
	let a = t.dataset.pack || t.closest("[data-pack]")?.dataset.pack || Aw(t);
	return a ? JSON.stringify({
		type: i,
		uuid: `Compendium.${a}.${r}`
	}) : t.closest(".compendium-directory") ? "" : JSON.stringify({
		type: i,
		uuid: `${i}.${r}`
	});
}
function Aw(e) {
	let t = e.closest(".compendium-directory");
	return t ? Array.from(game.packs ?? []).find((e) => t.id === `Compendium-${e.collection?.replaceAll(".", "_")}`)?.collection ?? "" : "";
}
function jw(e) {
	let t = Pw(e, "auto");
	return t ? JSON.stringify({
		type: t,
		uuid: e
	}) : "";
}
function Mw(e) {
	return /@UUID\[([^\]]+)]/.exec(e)?.[1]?.trim() ?? e;
}
function Nw(e) {
	let t = e.dataset.documentName || e.dataset.type || e.closest("[data-document-name]")?.dataset.documentName || "";
	return Fw(t) ? t : e.classList.contains("actor") ? "Actor" : e.classList.contains("item") ? "Item" : e.classList.contains("journal") ? "JournalEntry" : e.closest("#actors") ? "Actor" : e.closest("#items") ? "Item" : e.closest("#journal") ? "JournalEntry" : "";
}
function Pw(e, t) {
	return /^actor\./i.test(e) || /\.actors(\.|$)/i.test(e) ? "Actor" : /^item\./i.test(e) || /\.items(\.|$)/i.test(e) ? "Item" : /journalentrypage\./i.test(e) || /\.journalentrypage\./i.test(e) ? "JournalEntryPage" : /^journalentry\./i.test(e) || /\.journals(\.|$)/i.test(e) ? "JournalEntry" : t === "auto" ? "Item" : t;
}
function Fw(e) {
	return e === "Actor" || e === "Item" || e === "JournalEntry" || e === "JournalEntryPage";
}
function Iw(e) {
	if (!e.startsWith("{")) return !1;
	try {
		return typeof JSON.parse(e).type == "string";
	} catch {
		return !1;
	}
}
function Lw(e) {
	return /^(actor|item|journalentry|journalentrypage|compendium)\./i.test(e);
}
var Rw = {
	createDropData: Dw,
	startDocumentPick: Ow
}, zw = class {
	#e;
	createRoot() {
		let e = document.createElement("div");
		return e.classList.add("wfrp4e-customizer-apps-root"), e.dataset.theme = "wfrp4e-customizer-apps", e;
	}
	mount(e, t, n, r) {
		this.unmount(), t.classList.add("wfrp4e-customizer-apps-app"), t.replaceChildren(e), this.#e = ed(n, r), this.#e.use(Ew), this.#e.provide(Ay, Rw), this.#e.mount(e);
	}
	unmount() {
		this.#e?.unmount(), this.#e = void 0;
	}
}, Bw = class extends foundry.applications.api.ApplicationV2 {
	#e = new zw();
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
function Vw(e) {
	return {
		characteristics: Hw(e),
		skills: Uw(e),
		talents: Gw(e, [["talents", "value"], ["talents"]]),
		trappings: Gw(e, [["trappings", "value"], ["trappings"]])
	};
}
function Hw(e) {
	let t = Gw(e, [["characteristics", "value"], ["characteristics"]]);
	if (t.length) return t.map(Ww);
	let n = m(e, ["characteristics"]);
	if (!p(n)) return [];
	let r = [];
	for (let [e, t] of Object.entries(n)) t && r.push(Ww(e));
	return qw(r);
}
function Uw(e) {
	return Gw(e, [["skills", "value"], ["skills"]], { preserveDuplicates: !0 });
}
function Ww(e) {
	let t = e.trim().toLocaleLowerCase();
	if (ee(t)) return C[t];
	let n = w[t];
	return n ? C[n] : e.trim();
}
function Gw(e, t, n = {}) {
	for (let r of t) {
		let t = b(m(e, r));
		if (t.length) return n.preserveDuplicates ? Kw(t) : qw(t);
	}
	return [];
}
function Kw(e) {
	return e.map((e) => e.trim()).filter(Boolean);
}
function qw(e) {
	return [...new Set(Kw(e))].sort((e, t) => e.localeCompare(t));
}
//#endregion
//#region src/module/foundry/compendiums.ts
function Jw(e, t) {
	return t.uuid ? t.uuid : t._id && e.getUuid ? e.getUuid(t._id) : "";
}
function Yw(e) {
	return e.documentName === "Item" || h(e, ["metadata", "type"]) === "Item" || h(e, ["metadata", "documentName"]) === "Item";
}
function Xw(e) {
	return e.documentName === "Actor" || h(e, ["metadata", "type"]) === "Actor" || h(e, ["metadata", "documentName"]) === "Actor";
}
function Zw(e) {
	return Array.isArray(e) ? e.filter($w) : p(e) && Array.isArray(e.contents) ? e.contents.filter($w) : eT(e) ? [...e].flatMap((e) => {
		let t = Array.isArray(e) ? e[1] : e;
		return $w(t) ? [t] : [];
	}) : [];
}
function Qw() {
	return new Promise((e) => {
		globalThis.setTimeout(e, 0);
	});
}
function $w(e) {
	return p(e);
}
function eT(e) {
	return p(e) && Symbol.iterator in e;
}
//#endregion
//#region src/module/wfrp/career-summary.ts
function tT(e) {
	return {
		careerGroup: nT(e),
		grants: Vw(e.system),
		img: e.img ?? "",
		level: rT(e),
		name: e.name,
		uuid: e.uuid
	};
}
function nT(e) {
	return h(e.system, ["careergroup", "value"]);
}
function rT(e) {
	let t = m(e.system, ["level", "value"]), n = Number(t);
	return Number.isFinite(n) ? n : null;
}
//#endregion
//#region src/module/wfrp/career-index.ts
var iT = [
	"name",
	"type",
	"img",
	"system.careergroup.value",
	"system.characteristics",
	"system.level.value",
	"system.skills",
	"system.talents",
	"system.trappings"
], aT = /* @__PURE__ */ new Map(), oT = null;
function sT() {
	return oT || (aT.clear(), oT = lT().catch((e) => {
		throw aT.clear(), oT = null, qr("wfrp4e-customizer-apps | Career indexing failed.", e), e;
	}), oT);
}
async function cT(e) {
	return !e.careerGroup || e.level === null ? [] : (await sT(), [...aT.values()].filter((t) => mT(t, e)).sort(gT));
}
async function lT() {
	uT(), await Qw();
	for (let e of game.packs ?? []) {
		if (!Yw(e) || !e.getIndex) continue;
		let t = await e.getIndex({ fields: iT });
		for (let n of Zw(t)) {
			let t = dT(e, n);
			t && aT.set(t.uuid, t);
		}
		await Qw();
	}
}
function uT() {
	for (let e of game.items?.contents ?? []) e.type === "career" && aT.set(e.uuid, tT(e));
}
function dT(e, t) {
	let n = Jw(e, t);
	if (t.type !== "career" || !t.name || !n) return null;
	let r = m(t, ["system"]);
	return {
		careerGroup: fT(t),
		grants: Vw(r),
		img: t.img ?? "",
		level: pT(t),
		name: t.name,
		uuid: n
	};
}
function fT(e) {
	let t = m(e, [
		"system",
		"careergroup",
		"value"
	]);
	return typeof t == "string" ? t.trim() : "";
}
function pT(e) {
	let t = m(e, [
		"system",
		"level",
		"value"
	]), n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function mT(e, t) {
	return e.uuid !== t.uuid && e.level !== null && t.level !== null && e.level < t.level && hT(e.careerGroup) === hT(t.careerGroup);
}
function hT(e) {
	return e.trim().toLocaleLowerCase();
}
function gT(e, t) {
	let n = e.level ?? 0, r = t.level ?? 0;
	return n === r ? e.name.localeCompare(t.name) : n - r;
}
//#endregion
//#region src/module/wfrp/skill-specializations.ts
var _T = [
	"name",
	"type",
	"system.characteristic.value"
], vT = /* @__PURE__ */ new Map(), yT = /* @__PURE__ */ new Map(), bT = /* @__PURE__ */ new Map(), xT = "idle", ST = null;
async function CT(e) {
	let t = $d(e);
	return t ? (xT === "idle" && TT(), ST && await ST, [...vT.get(t) ?? []].sort((e, t) => e.localeCompare(t))) : [];
}
async function wT(e) {
	return xT === "idle" && TT(), ST && await ST, e.flatMap((e) => {
		let t = jT(e);
		return t ? [{
			...t,
			skillName: e
		}] : [];
	});
}
function TT() {
	return ST || (xT = "indexing", vT.clear(), yT.clear(), bT.clear(), ST = ET().then(() => {
		xT = "ready";
	}).catch((e) => {
		xT = "error", qr("wfrp4e-customizer-apps | Skill specialization indexing failed.", e);
	}), ST);
}
async function ET() {
	MT(), await Qw();
	for (let e of game.packs ?? []) {
		if (!Yw(e) || !e.getIndex) continue;
		let t = await e.getIndex({ fields: _T });
		for (let e of Zw(t)) OT(e);
		await Qw();
	}
}
function DT(e) {
	if (e.type !== "skill") return;
	kT(e);
	let t = Xd(e.name);
	if (!t) return;
	let n = $d(t.baseName), r = vT.get(n) ?? /* @__PURE__ */ new Set();
	r.add(t.specialization), vT.set(n, r);
}
function OT(e) {
	if (e.type !== "skill" || !e.name) return;
	AT(e);
	let t = Xd(e.name);
	if (!t) return;
	let n = $d(t.baseName), r = vT.get(n) ?? /* @__PURE__ */ new Set();
	r.add(t.specialization), vT.set(n, r);
}
function kT(e) {
	let t = h(e.system, ["characteristic", "value"]);
	if (!ee(t)) return;
	let n = {
		characteristicKey: t,
		characteristicName: C[t],
		skillName: e.name
	}, r = $d(e.name), i = $d(Xd(e.name)?.baseName ?? e.name);
	yT.set(r, n), bT.has(i) || bT.set(i, n);
}
function AT(e) {
	let t = h(e, [
		"system",
		"characteristic",
		"value"
	]);
	if (!ee(t) || !e.name) return;
	let n = {
		characteristicKey: t,
		characteristicName: C[t],
		skillName: e.name
	}, r = $d(e.name), i = $d(Xd(e.name)?.baseName ?? e.name);
	yT.set(r, n), bT.has(i) || bT.set(i, n);
}
function jT(e) {
	let t = $d(e), n = $d(Xd(e)?.baseName ?? e);
	return yT.get(t) ?? bT.get(n) ?? null;
}
function MT() {
	for (let e of game.items?.contents ?? []) DT(e);
}
//#endregion
//#region src/module/foundry/item-sources.ts
function NT(e, t) {
	return {
		img: "systems/wfrp4e/icons/blank.png",
		name: e,
		system: {},
		type: t
	};
}
function PT(e, t, n) {
	let r = e ? e.toObject() : NT(t, n);
	return delete r._id, r;
}
function FT(e, t, n) {
	return IT(e, t, n)[0] ?? null;
}
function IT(e, t, n) {
	return e.items?.contents.filter((e) => e.type === n && zT(e.name, t)) ?? [];
}
function LT(e, t, n) {
	return e.items?.contents.find((e) => t && e.uuid === t ? !0 : zT(e.name, n)) ?? null;
}
function RT(e, t) {
	return game.items?.contents.find((n) => t.includes(n.type) && zT(n.name, e)) ?? null;
}
function zT(e, t) {
	return e.trim().toLocaleLowerCase() === t.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/wfrp/item-lookup.ts
async function BT(e, t) {
	return await game.wfrp4e?.utility?.findItem?.(e, t) || RT(e, t);
}
//#endregion
//#region src/module/wfrp/talent-maximums.ts
async function VT(e) {
	let t = [];
	for (let n of HT(e)) {
		let e = await BT(n, ["talent"]);
		e && t.push({
			maximumFormula: h(e.system, ["max", "formula"]),
			maximumKey: h(e.system, ["max", "value"]),
			talentName: n
		});
	}
	return t;
}
function HT(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = r.trim().toLocaleLowerCase();
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
//#endregion
//#region src/module/foundry/portrait-search/candidate-utils.ts
var UT = [
	".webp",
	".png",
	".jpg",
	".jpeg",
	".gif"
], WT = new Set(UT);
function GT(e, t) {
	let n = t.img.trim().toLocaleLowerCase();
	!n || e.seenPaths.has(n) || (e.seenPaths.add(n), e.candidates.push(t));
}
function KT(e, t) {
	let n = t.imagePaths.filter(({ path: e }) => !!e);
	if (eE(t.name, n, e.searchTerms)) for (let r of n) {
		let n = {
			img: r.path,
			key: `foundry-asset:${t.sourceKey}:${r.label}`,
			label: `${t.name || XT(r.path)} ${r.label} (${t.sourceLabel})`,
			source: "foundry-asset",
			sourceGroup: t.sourceGroup,
			sourceLabel: t.sourceLabel
		};
		tE(n, e) && GT(e, n);
	}
}
function qT(e, t, n) {
	e?.({
		candidatesFound: t.candidates.length,
		currentLocation: n.currentLocation,
		directoriesVisited: t.visitedDirectories,
		maxDirectories: n.maxDirectories,
		phase: n.phase
	});
}
function JT(e) {
	return h(e, [
		"prototypeToken",
		"texture",
		"src"
	]) || h(e.toObject(), [
		"prototypeToken",
		"texture",
		"src"
	]);
}
function YT(e, t) {
	return `${XT(e)} (${t})`;
}
function XT(e) {
	return e.split(/[/\\]/).at(-1) ?? e;
}
function ZT(e) {
	let t = `.${e.split(/[#?]/u)[0]?.split(".").pop() ?? ""}`;
	return WT.has(t.toLocaleLowerCase());
}
function QT(e) {
	return typeof e == "object" && !!e;
}
function $T(e) {
	return QT(e) && Object.values(e).every((e) => Array.isArray(e) && e.every((e) => typeof e == "string"));
}
function eE(e, t, n) {
	return Ep(e, n) || t.some(({ path: e }) => Ep(e, n));
}
function tE(e, t) {
	return Dp(e, {
		mustExcludeSources: [],
		mustExcludeTerms: t.mustExcludeTerms,
		mustIncludeSources: [],
		mustIncludeTerms: t.mustIncludeTerms
	});
}
//#endregion
//#region src/module/foundry/portrait-search/dig-down.ts
var nE = "fuzzy-foundry", rE = .3;
function iE(e, t) {
	let n = aE();
	if (qT(t, e, {
		currentLocation: sE(n),
		maxDirectories: 0,
		phase: "filesystem"
	}), !n.digDownActive || !n.digDownCacheReady) return;
	let r = uE();
	if (!(!r?._fileIndexCache || !r.fs)) {
		for (let t of cE(r, e.searchTerms)) lE(e, r, t);
		qT(t, e, {
			currentLocation: "Dig Down file cache search complete",
			maxDirectories: 0,
			phase: "filesystem"
		});
	}
}
function aE() {
	let e = game.modules.get(nE)?.active === !0, t = oE(), n = uE(), r = Object.values(n?._fileIndexCache ?? {}).reduce((e, t) => e + t.length, 0);
	return {
		digDownActive: e,
		digDownCacheReady: !!(n?._fileIndexCache && n.fs),
		digDownDeepFileSearchEnabled: t,
		digDownIndexedFileCount: r
	};
}
function oE() {
	try {
		return game.settings.get(nE, "deepFile") === !0;
	} catch {
		return !1;
	}
}
function sE(e) {
	return e.digDownActive ? e.digDownDeepFileSearchEnabled ? e.digDownCacheReady ? `Dig Down file cache (${e.digDownIndexedFileCount} files)` : "Waiting for Dig Down file cache" : "Dig Down Deep File Search is disabled" : "Dig Down is not active";
}
function cE(e, t) {
	let n = /* @__PURE__ */ new Set(), r = Object.keys(e._fileIndexCache ?? {});
	for (let i of t) {
		let t = i.toLocaleLowerCase();
		for (let e of r) e.toLocaleLowerCase().includes(t) && n.add(e);
		let a = e.fs?.get(i, [], rE) ?? [];
		for (let [, e] of a) n.add(e);
	}
	return [...n].sort((e, t) => e.toLocaleLowerCase().localeCompare(t.toLocaleLowerCase()));
}
function lE(e, t, n) {
	let r = t._fileIndexCache?.[n] ?? [];
	for (let t of r) {
		if (!ZT(t)) continue;
		let n = {
			img: t,
			key: `foundry-asset:${t}`,
			label: YT(t, "Dig Down"),
			source: "foundry-asset",
			sourceGroup: "dig-down",
			sourceLabel: "Dig Down"
		};
		tE(n, e) && GT(e, n);
	}
}
function uE() {
	let e = canvas.deepSearchCache;
	if (!QT(e)) return null;
	let t = e._fileIndexCache, n = e.fs, r = {};
	return $T(t) && (r._fileIndexCache = t), QT(n) && typeof n.get == "function" && (r.fs = { get: n.get.bind(n) }), r;
}
//#endregion
//#region src/module/foundry/portrait-search/documents.ts
function dE(e, t) {
	qT(t, e, {
		currentLocation: "World Actors and Items",
		maxDirectories: 0,
		phase: "world-documents"
	});
	for (let t of game.actors.contents) KT(e, {
		imagePaths: [{
			label: "actor image",
			path: t.img ?? ""
		}, {
			label: "token image",
			path: JT(t)
		}],
		name: t.name,
		sourceGroup: "world",
		sourceLabel: "World Actors",
		sourceKey: t.uuid
	});
	for (let t of game.items?.contents ?? []) KT(e, {
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
async function fE(e, t) {
	qT(t, e, {
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
		] }).catch(() => void 0), r = n ? Zw(n) : [];
		for (let n of r) KT(e, {
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
					path: h(n, [
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
async function pE(e, t, n) {
	let r = mE(t), i = new Set(r.map(({ path: e }) => vE(e)));
	for (e.maxDirectoryBudget += r.length; r.length;) {
		let t = r.shift();
		if (!t) break;
		_E(e, n, t.path);
		let a = await hE(t.path);
		if (e.visitedDirectories += 1, a) {
			gE(e, t.root, a.files ?? []);
			for (let n of yE(a.dirs ?? [])) {
				let a = Cp([n])[0], o = vE(a ?? "");
				!a || i.has(o) || (i.add(o), r.push({
					path: a,
					root: t.root
				}), e.maxDirectoryBudget += 1);
			}
			_E(e, n, t.path);
		}
	}
}
function mE(e) {
	return Cp(e).map((e) => ({
		path: e,
		root: e
	}));
}
async function hE(t) {
	try {
		return await foundry.applications.apps.FilePicker.browse("data", t, { extensions: UT });
	} catch (n) {
		return qr(`${e} | Could not browse priority portrait folder "${t}".`, n), null;
	}
}
function gE(e, t, n) {
	let r = `Priority: ${XT(t)}`;
	for (let i of yE(n)) {
		if (!ZT(i) || !Ep(XT(i), e.searchTerms)) continue;
		let n = {
			img: i,
			key: `foundry-asset:${i}`,
			label: YT(i, r),
			source: "foundry-asset",
			sourceFilter: cp(t),
			sourceGroup: "priority-folders",
			sourceLabel: r
		};
		tE(n, e) && GT(e, n);
	}
}
function _E(e, t, n) {
	qT(t, e, {
		currentLocation: n,
		maxDirectories: e.maxDirectoryBudget,
		phase: "filesystem"
	});
}
function vE(e) {
	return e.toLocaleLowerCase();
}
function yE(e) {
	return [...e].sort((e, t) => e.toLocaleLowerCase().localeCompare(t.toLocaleLowerCase()));
}
//#endregion
//#region src/module/foundry/portrait-search/exclusions.ts
var bE = /* @__PURE__ */ new Map(), xE = 6, SE = 15e3;
async function CE(e, t, n, r = wE) {
	let i = Cp(t.excludedReferenceImagePaths), a = new Set(i.map(kE)), o = /* @__PURE__ */ new Set();
	for (let e of i) {
		let t = await r(e);
		t.loadable && t.pixelSignature && o.add(t.pixelSignature);
	}
	let s = Array(e.length).fill(null), c = 0, l = 0, u = 0;
	OE(n, 0, 0, e.length);
	async function d() {
		for (; l < e.length;) {
			let i = l, d = e[i];
			if (l += 1, !a.has(kE(d.img))) {
				let e = await r(d.img);
				e.loadable && (!t.excludeFullyTransparentImages || !e.fullyTransparent) && (!e.pixelSignature || !o.has(e.pixelSignature)) && (s[i] = d, c += 1);
			}
			u += 1, OE(n, c, u, e.length);
		}
	}
	let f = Math.min(xE, e.length);
	return await Promise.all(Array.from({ length: f }, d)), s.filter((e) => e !== null);
}
async function wE(e) {
	let t = kE(e), n = bE.get(t);
	if (n) return await n;
	let r = TE(e);
	return bE.set(t, r), await r;
}
async function TE(e) {
	let t = await EE(e);
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
			pixelSignature: await DE(e.width, e.height, r)
		};
	} catch {
		return {
			fullyTransparent: !1,
			loadable: !0,
			pixelSignature: ""
		};
	}
}
function EE(e) {
	return new Promise((t) => {
		let n = new Image(), r = setTimeout(() => i(null), SE);
		function i(e) {
			clearTimeout(r), n.onload = null, n.onerror = null, t(e);
		}
		n.onload = () => {
			i(n.naturalWidth > 0 && n.naturalHeight > 0 ? n : null);
		}, n.onerror = () => i(null), n.src = e;
	});
}
async function DE(e, t, n) {
	let r = await crypto.subtle.digest("SHA-256", n);
	return `${e}x${t}:${[...new Uint8Array(r)].map((e) => e.toString(16).padStart(2, "0")).join("")}`;
}
function OE(e, t, n, r) {
	e?.({
		candidatesFound: t,
		currentLocation: `Checking images ${n}/${r}`,
		directoriesVisited: n,
		maxDirectories: r,
		phase: "image-validation"
	});
}
function kE(e) {
	return e.trim().replaceAll("\\", "/").toLocaleLowerCase();
}
//#endregion
//#region src/module/foundry/portrait-search/index.ts
async function AE(e, t) {
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
	return await pE(n, e.priorityFolderPaths, t), e.includeCompendiumAssets && (await fE(n, t), dE(n, t)), e.includeFilePickerAssets && iE(n, t), qT(t, n, {
		currentLocation: "Portrait search complete",
		maxDirectories: n.maxDirectoryBudget,
		phase: "ready"
	}), n.candidates;
}
//#endregion
//#region src/module/apps/npc-builder/functions/normalize-npc-builder-settings.ts
var jE = {
	...Hp(),
	allowBaseActorCharacteristics: !0,
	allowBaseActorSkills: !0,
	allowBaseActorTalents: !0
};
function ME(e) {
	let t = Hp();
	return PE(e) ? {
		allowBaseActorCharacteristics: FE(e.allowBaseActorCharacteristics, jE.allowBaseActorCharacteristics),
		allowBaseActorSkills: FE(e.allowBaseActorSkills, jE.allowBaseActorSkills),
		allowBaseActorTalents: FE(e.allowBaseActorTalents, jE.allowBaseActorTalents),
		allowBaseActorTraits: FE(e.allowBaseActorTraits, jE.allowBaseActorTraits),
		allowBaseActorTrappings: FE(e.allowBaseActorTrappings, jE.allowBaseActorTrappings),
		askForLinkedSkillSpecializations: FE(e.askForLinkedSkillSpecializations, jE.askForLinkedSkillSpecializations),
		autoSelectGrantedSpells: FE(e.autoSelectGrantedSpells, jE.autoSelectGrantedSpells),
		baseActorFolderUuid: IE(e.baseActorFolderUuid, jE.baseActorFolderUuid),
		excludeFullyTransparentPortraitAssets: FE(e.excludeFullyTransparentPortraitAssets, jE.excludeFullyTransparentPortraitAssets),
		excludedPortraitReferenceImages: Cp(Array.isArray(e.excludedPortraitReferenceImages) ? e.excludedPortraitReferenceImages : jE.excludedPortraitReferenceImages),
		includeSpeciesInName: FE(e.includeSpeciesInName, jE.includeSpeciesInName),
		lowerCareerMode: NE(e.lowerCareerMode) ? e.lowerCareerMode : jE.lowerCareerMode,
		outputActorFolderUuid: IE(e.outputActorFolderUuid, jE.outputActorFolderUuid),
		prioritizedPortraitFolders: Cp(e.prioritizedPortraitFolders),
		quickTraitFolderUuid: IE(e.quickTraitFolderUuid, jE.quickTraitFolderUuid),
		searchCompendiumPortraitAssets: FE(e.searchCompendiumPortraitAssets, jE.searchCompendiumPortraitAssets),
		searchFoundryPortraitAssets: FE(e.searchFoundryPortraitAssets, jE.searchFoundryPortraitAssets),
		searchWebPortraitAssets: FE(e.searchWebPortraitAssets, jE.searchWebPortraitAssets)
	} : t;
}
function NE(e) {
	return e === "auto-add-all" || e === "never" || e === "prompt";
}
function PE(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function FE(e, t) {
	return typeof e == "boolean" ? e : t;
}
function IE(e, t) {
	return typeof e == "string" ? e : t;
}
//#endregion
//#region src/module/foundry/settings/foundry-setting-adapter.ts
function LE(e) {
	return e;
}
function RE(t) {
	game.settings.register(e, t.key, {
		config: t.config ?? !1,
		default: t.defaultValue,
		name: t.name,
		scope: t.scope ?? "world",
		type: Object
	});
}
function zE(t) {
	return t.normalize(game.settings.get(e, t.key));
}
async function BE(t, n) {
	let r = t.normalize(n);
	return await game.settings.set(e, t.key, r), r;
}
//#endregion
//#region src/module/wfrp/npc-builder/settings.ts
var VE = LE({
	defaultValue: Hp(),
	key: "npcBuilderSettings",
	name: "NPC Builder Settings",
	normalize: ME
});
function HE() {
	RE(VE);
}
function UE() {
	return zE(VE);
}
async function WE(e) {
	return await BE(VE, e);
}
//#endregion
//#region src/module/foundry/drop-data.ts
function GE(e) {
	try {
		return JSON.parse(e);
	} catch {
		throw Error("Foundry drop data could not be read.");
	}
}
//#endregion
//#region src/module/foundry/embedded-items.ts
function KE() {
	return {
		creates: [],
		deletes: [],
		updates: []
	};
}
async function qE(e, t) {
	t.deletes.length && e.deleteEmbeddedDocuments && await e.deleteEmbeddedDocuments("Item", t.deletes), t.updates.length && e.updateEmbeddedDocuments && await e.updateEmbeddedDocuments("Item", t.updates), t.creates.length && await e.createEmbeddedDocuments("Item", t.creates);
}
//#endregion
//#region src/module/wfrp/npc-builder/xp-source-values.ts
function JE(e, t) {
	return _(e, [[
		"characteristics",
		t,
		"initial",
		"value"
	], [
		"characteristics",
		t,
		"initial"
	]]) + _(e, [[
		"characteristics",
		t,
		"modifier",
		"value"
	], [
		"characteristics",
		t,
		"modifier"
	]]) + _(e, [[
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
async function YE(e, t) {
	let n = {}, r = KE();
	for (let i of t) {
		let t = Math.floor(i.current);
		if (i.kind === "talent") {
			await rD(e, i, t, r);
			continue;
		}
		let a = i.baseAdvances + t;
		if (i.kind === "characteristic") {
			if (t === 0) continue;
			nD(n, i, a);
			continue;
		}
		let o = FT(e, i.name, i.kind);
		if (t === 0 && !i.includedFromCustom && !o) continue;
		if (o) {
			r.updates.push({
				_id: o.id,
				"system.advances.value": a
			});
			continue;
		}
		let s = PT(await iD(i), i.name, i.kind);
		s.type = i.kind, x(s, [
			"system",
			"advances",
			"value"
		], a), r.creates.push(s);
	}
	Object.keys(n).length && await e.update(n), await qE(e, r);
}
function XE(e) {
	let t = e.toObject().system, n = _(t, [["advances", "value"], ["advances"]]);
	if (e.type === "talent") return {
		advances: Math.max(1, n),
		kind: "talent",
		name: e.name,
		sourceUuid: e.uuid,
		talentMaximumFormula: h(t, ["max", "formula"]),
		talentMaximumKey: h(t, ["max", "value"])
	};
	let r = tD(t), i = {
		advances: n,
		kind: "skill",
		name: e.name,
		sourceUuid: e.uuid
	};
	return r && (i.characteristicKey = r, i.characteristicName = C[r]), i;
}
function ZE(e) {
	let t = e.toObject().system, n = [];
	for (let [e, r] of Object.entries(C)) {
		let i = _(t, [[
			"characteristics",
			e,
			"advances",
			"value"
		], [
			"characteristics",
			e,
			"advances"
		]]), a = _(t, [[
			"characteristics",
			e,
			"modifier",
			"value"
		], [
			"characteristics",
			e,
			"modifier"
		]]), o = _(t, [[
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
function QE(e, t) {
	return t === "talent" ? $E(e) : e.items?.contents.filter((e) => e.type === t).map((n) => eD(e, n, t)) ?? [];
}
function $E(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.items?.contents.filter((e) => e.type === "talent") ?? []) {
		let e = n.toObject().system, r = n.name.trim().toLocaleLowerCase(), i = _(e, [["advances", "value"], ["advances"]]), a = t.get(r);
		if (a) {
			a.baseAdvances += i, a.current += i;
			continue;
		}
		t.set(r, {
			baseAdvances: i,
			current: i,
			kind: "talent",
			name: n.name,
			talentMaximumFormula: h(e, ["max", "formula"]),
			talentMaximumKey: h(e, ["max", "value"])
		});
	}
	return [...t.values()];
}
function eD(e, t, n) {
	let r = t.toObject().system, i = _(r, [["advances", "value"], ["advances"]]);
	if (n === "talent") return {
		baseAdvances: i,
		current: i,
		kind: n,
		name: t.name,
		talentMaximumFormula: h(r, ["max", "formula"]),
		talentMaximumKey: h(r, ["max", "value"])
	};
	let a = _(r, [["modifier", "value"], ["modifier"]]), o = tD(r), s = {
		baseAdvances: i,
		baseModifier: a,
		current: (o ? JE(e.toObject().system, o) : 0) + i + a,
		kind: n,
		name: t.name
	};
	return o && (s.characteristicKey = o, s.characteristicName = C[o]), s;
}
function tD(e) {
	let t = h(e, ["characteristic", "value"]);
	return ee(t) ? t : void 0;
}
function nD(e, t, n) {
	let r = w[t.name.trim().toLocaleLowerCase()];
	r && (e[`system.characteristics.${r}.advances`] = n);
}
async function rD(e, t, n, r) {
	let i = Math.max(0, t.baseAdvances + n), a = IT(e, t.name, "talent"), o = a[0] ?? await iD(t);
	r.deletes.push(...a.map((e) => e.id));
	for (let e = 0; e < i; e += 1) {
		let e = PT(o, t.name, "talent");
		e.type = "talent", x(e, [
			"system",
			"advances",
			"value"
		], 1), r.creates.push(e);
	}
}
async function iD(e) {
	if (e.sourceUuid) {
		let t = await fromUuid(e.sourceUuid);
		if (fn(t)) return t;
	}
	return BT(e.name, [e.kind]);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/config.ts
function aD(e, t) {
	x(e, [
		"system",
		"specification",
		"value"
	], t.specification), t.rollable && !t.damage && x(e, [
		"system",
		"rollable",
		"defaultDifficulty"
	], t.defaultDifficulty), t.damage && t.dice && x(e, [
		"system",
		"rollable",
		"dice"
	], t.dice);
}
function oD(e, t) {
	return {
		_id: e,
		"system.specification.value": t.specification,
		...t.rollable && !t.damage ? { "system.rollable.defaultDifficulty": t.defaultDifficulty } : {},
		...t.damage && t.dice ? { "system.rollable.dice": t.dice } : {}
	};
}
function sD(e) {
	return {
		...Ld(),
		attackType: dD(e.system, ["rollable", "attackType"]) || "melee",
		bonusCharacteristic: dD(e.system, ["rollable", "bonusCharacteristic"]),
		damage: y(e.system, [["rollable", "damage"]]),
		defaultDifficulty: dD(e.system, ["rollable", "defaultDifficulty"]) || "challenging",
		dice: dD(e.system, ["rollable", "dice"]),
		rollable: y(e.system, [["rollable", "value"]]),
		skill: dD(e.system, ["rollable", "skill"]),
		sl: y(e.system, [["rollable", "SL"]], !0),
		specification: dD(e.system, ["specification", "value"])
	};
}
function cD(e) {
	return uD(e.system);
}
function lD(e) {
	return uD(e.system);
}
function uD(e) {
	return y(e, [["disabled"], ["disabled", "value"]]);
}
function dD(e, t) {
	let n = m(e, t);
	return typeof n == "string" ? n.trim() : typeof n == "number" ? String(n) : "";
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/apply.ts
async function fD(e, t) {
	let n = KE();
	for (let r of t) {
		let t = r.source === "base" ? LT(e, r.sourceUuid, r.name) : FT(e, r.name, "trait");
		if (r.ignored) {
			t && n.deletes.push(t.id);
			continue;
		}
		if (t) {
			n.updates.push(oD(t.id, r.config));
			continue;
		}
		let i = PT(r.sourceUuid ? await pD(r.sourceUuid) : await BT(r.name, ["trait"]), r.name, "trait");
		i.type = "trait", x(i, ["system", "disabled"], !1), aD(i, r.config), n.creates.push(i);
	}
	await qE(e, n);
}
async function pD(e) {
	let t = await fromUuid(e);
	return fn(t) ? t : null;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/actor-traits.ts
function mD(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && !cD(e)).map(_D) ?? [];
}
function hD(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && cD(e)).map(_D) ?? [];
}
function gD(e) {
	Array.isArray(e.items) && (e.items = e.items.filter((e) => {
		if (typeof e != "object" || !e) return !0;
		let t = e;
		return t.type !== "trait" || !lD(t);
	}));
}
function _D(e) {
	return {
		config: sD(e),
		img: e.img ?? "",
		name: e.name,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/difficulty-options.ts
var vD = [
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
async function yD() {
	let e = m(game.wfrp4e?.config, ["difficultyLabels"]);
	if (!p(e)) return vD;
	let t = Object.entries(e).filter((e) => {
		let [t, n] = e;
		return !!t.trim() && typeof n == "string";
	}).map(([e, t]) => ({
		label: t,
		value: e
	}));
	return t.length ? t : vD;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/drops.ts
async function bD(e) {
	let t = GE(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Trait item here.");
	let n = hn(await fromUuid(t.uuid), "trait", "Drop a Foundry Trait item here.");
	return {
		config: sD(n),
		ignored: !1,
		key: `custom:${n.uuid}`,
		name: n.name,
		source: "custom",
		sourceUuid: n.uuid
	};
}
//#endregion
//#region src/module/apps/npc-builder/functions/recommended-quick-traits.ts
var xD = [
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
async function SD(e) {
	return kD(await OD(e, "Actor"));
}
async function CD(e) {
	return kD(await OD(e, "Item"));
}
function wD() {
	return game.folders.contents.filter((e) => e.type === "Actor").map(kD).sort((e, t) => e.name.localeCompare(t.name));
}
function TD() {
	return game.folders.contents.filter((e) => e.type === "Item").map(kD).sort((e, t) => e.name.localeCompare(t.name));
}
function ED(e) {
	return e ? game.folders.contents.find((t) => t.uuid === e) ?? null : null;
}
function DD(e) {
	let t = ED(e);
	return t?.type === "Item" ? t : null;
}
async function OD(e, t) {
	let n = e.trim();
	if (!n) throw Error("Enter a folder name first.");
	let r = game.folders.contents.find((e) => e.type === t && AD(e.name, n));
	if (r) return r;
	let i = await Folder.create({
		name: n,
		type: t
	});
	if (!i) throw Error("Foundry did not create the folder.");
	return i;
}
function kD(e) {
	return {
		name: e.name,
		uuid: e.uuid
	};
}
function AD(e, t) {
	return e.trim().toLocaleLowerCase() === t.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/quick-traits.ts
async function jD(e) {
	let t = DD(e.quickTraitFolderUuid);
	if (!t) throw Error("Choose a Quick Traits item folder before importing traits.");
	let n = new Set(PD(e).map((e) => e.name.trim().toLocaleLowerCase()));
	for (let e of xD) {
		if (n.has(e.trim().toLocaleLowerCase())) continue;
		let r = PT(await BT(e, ["trait"]), e, "trait");
		r.folder = t.id, r.type = "trait", await Item.create(r);
	}
	return ui.notifications?.info("Imported recommended quick traits."), await MD(e);
}
async function MD(e) {
	return PD(e).map(FD).sort((e, t) => e.name.localeCompare(t.name));
}
function ND(e, t) {
	return t.quickTraitFolderUuid ? e.folder?.uuid === t.quickTraitFolderUuid : !1;
}
function PD(e) {
	return game.items?.contents.filter((t) => t.type === "trait" && ND(t, e)) ?? [];
}
function FD(e) {
	return {
		config: sD(e),
		img: e.img ?? "",
		name: e.name,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/trappings.ts
var ID = [
	"ammunition",
	"armour",
	"container",
	"money",
	"trapping",
	"weapon"
];
async function LD(e, t) {
	let n = KE();
	for (let r of t) {
		let t = r.source === "base" ? LT(e, r.sourceUuid, r.name) : null;
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
		let i = await UD(r), a = r.resolution.selectedItemType || r.itemType || "trapping", o = PT(i, r.resolution.selectedName || r.name, a);
		o.type = a || o.type || "trapping", x(o, [
			"system",
			"quantity",
			"value"
		], r.quantity), n.creates.push(o);
	}
	await qE(e, n);
}
async function RD(e) {
	return Tm(e, await WD());
}
async function zD(e) {
	let t = GE(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Item here.");
	let n = mn(await fromUuid(t.uuid), "Drop a Foundry Item here.");
	return {
		ignored: !1,
		itemType: n.type,
		key: `custom:${n.uuid}`,
		name: n.name,
		quantity: VD(n),
		resolution: Cm({
			itemType: n.type,
			name: n.name,
			uuid: n.uuid
		}),
		source: "custom",
		sourceUuid: n.uuid
	};
}
function BD(e) {
	let t = HD();
	return e.items?.contents.filter((e) => t.includes(e.type)).map((e) => ({
		itemType: e.type,
		name: e.name,
		quantity: VD(e),
		uuid: e.uuid
	})) ?? [];
}
function VD(e) {
	return _(e.system, [["quantity", "value"], ["quantity"]]) || 1;
}
function HD() {
	let e = g(game.wfrp4e?.config, ["trappingItems"]);
	return e.length ? e : ID;
}
async function UD(e) {
	if (e.sourceUuid) {
		let t = await fromUuid(e.sourceUuid);
		return fn(t) ? t : null;
	}
	if (e.resolution.selectedCandidateUuid) {
		let t = await fromUuid(e.resolution.selectedCandidateUuid);
		return fn(t) ? t : null;
	}
	return e.resolution.status === "fallback" ? null : await BT(e.resolution.selectedName || e.name, HD());
}
async function WD() {
	let e = [], t = HD();
	for (let n of game.items?.contents ?? []) t.includes(n.type) && e.push(KD(n, "World"));
	for (let n of game.packs ?? []) {
		if (!Yw(n)) continue;
		let r = await GD(n, t);
		if (r.length) {
			e.push(...r);
			continue;
		}
		if (!n.getDocuments) continue;
		let i = await n.getDocuments();
		for (let r of i) fn(r) && t.includes(r.type) && e.push(KD(r, n.title ?? "Compendium"));
	}
	return e;
}
async function GD(e, t) {
	return e.getIndex ? Zw(await e.getIndex({ fields: ["name", "type"] })).filter((n) => !!(n.name && n.type && Jw(e, n) && t.includes(n.type))).map((t) => ({
		itemType: t.type ?? "trapping",
		name: t.name ?? "",
		sourceLabel: e.title ?? "Compendium",
		uuid: Jw(e, t)
	})) : [];
}
function KD(e, t) {
	return {
		itemType: e.type,
		name: e.name,
		sourceLabel: t,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/actors.ts
function qD(e) {
	return game.actors.contents.filter((t) => $D(t, e)).map(XD);
}
async function JD(e) {
	let t = pn(await fromUuid(e));
	return {
		advancements: [
			...ZE(t),
			...QE(t, "skill"),
			...QE(t, "talent")
		],
		optionalTraits: hD(t),
		traits: mD(t),
		trappings: BD(t)
	};
}
async function YD(e) {
	let t = GE(e);
	if (t.type !== "Actor") throw Error("Drop a Foundry Actor here.");
	let n = null;
	return t.uuid ? n = await fromUuid(t.uuid) : t.id && (n = game.actors.get(t.id)), XD(pn(n));
}
function XD(e) {
	return {
		img: e.img ?? "",
		name: e.name,
		prototypeTokenImg: QD(e),
		species: ZD(e),
		type: e.type,
		uuid: e.uuid
	};
}
function ZD(e) {
	return h(e.system, [
		"details",
		"species",
		"value"
	]) || h(e.system, ["details", "species"]) || h(e.system, [
		"details",
		"race",
		"value"
	]) || h(e.system, [
		"details",
		"ancestry",
		"value"
	]);
}
function QD(e) {
	return h(e, [
		"prototypeToken",
		"texture",
		"src"
	]) || h(e.toObject(), [
		"prototypeToken",
		"texture",
		"src"
	]);
}
function $D(e, t) {
	return t.baseActorFolderUuid ? e.folder?.uuid === t.baseActorFolderUuid : !0;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/careers.ts
async function eO(e) {
	let t = GE(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a WFRP Career item here.");
	return tT(hn(await fromUuid(t.uuid), "career", "Drop a WFRP Career item here."));
}
async function tO(e) {
	let t = [];
	for (let n of e) {
		let e = hn(await fromUuid(n.uuid), "career", `Career “${n.name}” is no longer available.`);
		for (let r = 0; r < Gd(n.quantity); r += 1) {
			let n = e.toObject();
			delete n._id, x(n, [
				"system",
				"complete",
				"value"
			], !0), x(n, [
				"system",
				"current",
				"value"
			], !1), t.push(n);
		}
	}
	return t;
}
async function nO(e, t) {
	t.length && await e.createEmbeddedDocuments("Item", t);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/constants.ts
var rO = "spell", iO = new Set(Kp), aO = new Set(qp);
async function oO() {
	return sO().map((e) => ({
		category: Qp(e.key),
		key: e.key,
		label: e.name,
		value: e.name,
		wind: e.wind
	})).sort((e, t) => e.category === t.category ? e.label.localeCompare(t.label) : e.category.localeCompare(t.category));
}
function sO() {
	let e = m(game.wfrp4e?.config, ["magicLores"]), t = m(game.wfrp4e?.config, ["magicWind"]), n = [];
	if (!p(e)) return [dO()];
	for (let [r, i] of Object.entries(e)) {
		let e = vO(i) || r, a = _O(t, r);
		n.push({
			key: r,
			matchTerms: gO(r, e, a),
			name: e,
			wind: a
		});
	}
	return n.some((e) => e.key === "petty") || n.push(dO()), n;
}
function cO(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		if (r.isAmbiguous) continue;
		if (r.kind === "petty-magic") {
			let e = hO("petty magic", t);
			e && n.set(e.key, e);
			continue;
		}
		let e = hO(r.rawLore, t);
		e && n.set(e.key, e);
	}
	return [...n.values()];
}
function lO(e, t) {
	let n = [...uO(e.system), mO(e.name)].filter(Boolean);
	for (let e of n) {
		let n = pO(e, t);
		if (n) return n;
		let r = hO(e, t);
		if (r) return r;
	}
	return null;
}
function uO(e) {
	return [
		...b(m(e, ["lore", "value"])),
		...b(m(e, ["lore"])),
		...b(m(e, ["magicLore", "value"])),
		...b(m(e, ["magicLore"])),
		...b(m(e, ["category", "value"])),
		...b(m(e, [
			"system",
			"lore",
			"value"
		])),
		...b(m(e, ["system", "lore"])),
		...b(m(e, ["system.lore.value"])),
		...b(m(e, ["system.lore"]))
	];
}
function dO() {
	return {
		key: "petty",
		matchTerms: ["petty", "petty magic"],
		name: "Petty Magic",
		wind: ""
	};
}
function fO(e) {
	let t = e.trim() || "Unknown Lore";
	return {
		key: Yp(t) || "unknown",
		matchTerms: [t],
		name: t,
		wind: ""
	};
}
function pO(e, t) {
	let n = Yp(e);
	return n === "lore" ? t.find((e) => e.key !== "petty") ?? null : n === "the eight winds" || n === "eight winds" ? t.find((e) => iO.has(e.key)) ?? null : n === "dark lore" ? t.find((e) => aO.has(e.key)) ?? null : null;
}
function mO(e) {
	return /\(([^)]+)\)\s*$/.exec(e)?.[1]?.trim() ?? "";
}
function hO(e, t) {
	let n = Yp(e);
	return n ? t.find((e) => e.matchTerms.some((e) => Yp(e) === n)) ?? null : null;
}
function gO(e, t, n) {
	let r = /* @__PURE__ */ new Set(), i = Yp(e), a = Yp(t);
	for (let i of [
		e,
		t,
		n
	]) i.trim() && r.add(i.trim());
	return (i === "petty" || a === "petty") && r.add("Petty Magic"), (i === "shadow" || a === "shadow") && r.add("Shadows"), t && !/^lore of /i.test(t) && r.add(`Lore of ${t}`), [...r];
}
function _O(e, t) {
	return p(e) ? vO(e[t]) : "";
}
function vO(e) {
	return typeof e == "string" ? e.trim() : p(e) ? h(e, ["name"]) || h(e, ["label"]) || h(e, ["value"]) : "";
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/debug.ts
var yO = "[Drowsy's WFRP4e Customizers][Spell Lookup]";
function bO(e, t) {
	if (t) {
		Kr(`${yO} ${e}`, t);
		return;
	}
	Kr(`${yO} ${e}`);
}
function xO(e, t) {
	qr(`${yO} ${e}`, t);
}
function SO(e) {
	return [
		e.title ?? "",
		e.collection ?? "",
		h(e, ["metadata", "type"]),
		h(e, ["metadata", "documentName"]),
		e.documentName
	].filter(Boolean).join(" | ");
}
function CO(e) {
	return {
		loreTerms: uO(e.system),
		name: e.name,
		sourceLabel: e.sourceLabel,
		uuid: e.uuid
	};
}
function wO(e) {
	return typeof e == "string" ? {
		kind: "uuid-string",
		value: e
	} : p(e) ? {
		documentName: h(e, ["documentName"]),
		hasSystem: p(m(e, ["system"])),
		loreTerms: uO(m(e, ["system"])),
		name: h(e, ["name"]),
		type: h(e, ["type"]),
		uuid: h(e, ["uuid"])
	} : { kind: typeof e };
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/spell-input-conversion.ts
function TO(e, t) {
	return {
		img: e.img ?? "",
		name: e.name,
		sourceLabel: t,
		system: e.system,
		uuid: e.uuid
	};
}
function EO(e) {
	return /^item\./i.test(e.uuid) ? "World" : DO(e.uuid, "WFRP Item Lookup");
}
function DO(e, t) {
	let n = /^Compendium\.([^.]+\.[^.]+)\./.exec(e)?.[1];
	return n ? [...game.packs ?? []].find((e) => e.collection === n)?.title ?? n : t;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/compendium-spell-inputs.ts
async function OO(e) {
	if (bO("Compendium index scan start", { pack: SO(e) }), !e.getIndex) return bO("Compendium has no index; loading documents", { pack: SO(e) }), await jO(e);
	let t = Zw(await e.getIndex({ fields: [
		"name",
		"type",
		"img",
		"system.lore.value"
	] }));
	if (bO("Compendium index loaded", {
		entries: t.length,
		pack: SO(e),
		samples: t.slice(0, 5).map((t) => ({
			hasLoreTerms: uO(t).length > 0,
			name: t.name,
			type: t.type,
			uuid: Jw(e, t)
		}))
	}), !t.length) return bO("Compendium index empty; loading documents", { pack: SO(e) }), await jO(e);
	let n = t.filter(AO);
	bO("Compendium index spell candidates", {
		pack: SO(e),
		spellEntries: n.length
	});
	let r = n.filter((e) => e.name).map((t) => NO(e, t));
	return r.length || !MO(e) ? r : await jO(e);
}
function kO(e) {
	return Yw(e);
}
function AO(e) {
	return e.type === "spell" ? !0 : !!(e.name && (uO(e).length || mO(e.name)));
}
async function jO(e) {
	if (!e.getDocuments) return bO("Compendium has no document loader", { pack: SO(e) }), [];
	bO("Compendium document load start", { pack: SO(e) });
	let t = await e.getDocuments(), n = t.filter((e) => fn(e) && e.type === "spell");
	return bO("Compendium document load complete", {
		documents: t.length,
		pack: SO(e),
		spellDocuments: n.length,
		spellSamples: n.slice(0, 5).map((e) => ({
			loreTerms: uO(e.system),
			name: e.name,
			uuid: e.uuid
		}))
	}), n.map((t) => TO(t, e.title ?? "Compendium"));
}
function MO(e) {
	return e.collection === "wfrp4e-core.items" || e.collection === "wfrp4e-wom.items";
}
function NO(e, t) {
	return {
		img: t.img ?? t.thumb ?? "",
		name: t.name ?? "",
		sourceLabel: e.title ?? "Compendium",
		system: t,
		uuid: Jw(e, t)
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/warhammer-spell-inputs.ts
async function PO() {
	let e = IO();
	if (!e) return bO("WFRP helper unavailable"), [];
	try {
		let t = await e.findAllItems(rO, "Loading Spells", !0, ["system.lore.value"]);
		return bO("WFRP helper raw result", {
			count: t.length,
			samples: t.slice(0, 10).map(wO)
		}), (await Promise.all(t.map((e) => FO(e)))).filter((e) => e !== null);
	} catch (e) {
		return xO("WFRP helper lookup failed.", e), [];
	}
}
async function FO(e) {
	if (typeof e == "string") {
		let t = await fromUuid(e);
		return fn(t) && t.type === "spell" ? TO(t, EO(t)) : null;
	}
	if (fn(e)) return e.type === "spell" ? TO(e, EO(e)) : null;
	if (h(e, ["type"]) !== "spell") return null;
	let t = h(e, ["name"]);
	return t ? {
		img: h(e, ["img"]) || h(e, ["thumb"]),
		name: t,
		sourceLabel: DO(h(e, ["uuid"]), "WFRP Item Lookup"),
		system: m(e, ["system"]),
		uuid: h(e, ["uuid"])
	} : null;
}
function IO() {
	let e = m(globalThis, [
		"warhammer",
		"utility",
		"findAllItems"
	]);
	return typeof e == "function" ? { findAllItems: e } : null;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/spell-resolution-inputs.ts
async function LO() {
	let e = [], t = [...game.packs ?? []];
	bO("Candidate lookup start", {
		itemPacks: t.filter(kO).length,
		totalPacks: t.length,
		warhammerUtilityAvailable: !!BO(),
		worldItems: game.items?.contents.length ?? 0
	});
	let n = await PO();
	bO("WFRP helper lookup complete", {
		utilityInputs: n.length,
		utilitySamples: n.slice(0, 10).map(CO)
	}), e.push(...n), e.push(...RO()), bO("World spell scan complete", { worldSpellCount: e.filter((e) => e.sourceLabel === "World").length });
	for (let n of t) if (kO(n)) try {
		let t = await OO(n);
		e.push(...t), bO("Compendium spell scan complete", {
			inputCount: t.length,
			pack: SO(n),
			samples: t.slice(0, 5).map(CO)
		});
	} catch (e) {
		qr(`wfrp4e-customizer-apps | Spell lookup skipped compendium "${n.title ?? n.collection ?? "unknown"}".`, e);
	}
	let r = zO(e);
	return bO("Candidate lookup complete", {
		rawInputCount: e.length,
		uniqueInputCount: r.length
	}), r;
}
function RO() {
	let e = [];
	for (let t of game.items?.contents ?? []) t.type === "spell" && e.push(TO(t, "World"));
	return e;
}
function zO(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.uuid || n.name.trim().toLocaleLowerCase();
		t.has(e) || t.set(e, n);
	}
	return [...t.values()];
}
function BO() {
	return m(globalThis, [
		"warhammer",
		"utility",
		"findAllItems"
	]);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/index.ts
async function VO(e, t) {
	let n = [];
	for (let r of t) {
		if (!r.selected || FT(e, r.name, "spell")) continue;
		let t = PT(r.sourceUuid ? await WO(r.sourceUuid) : null, r.name, rO);
		t.type = rO, n.push(t);
	}
	n.length && await e.createEmbeddedDocuments("Item", n);
}
async function HO(e) {
	let t = cO(e, sO());
	if (bO("Grant resolution start", {
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
	let n = await LO(), r = /* @__PURE__ */ new Map(), i = [];
	for (let e of n) {
		let n = lO(e, t);
		if (!n) {
			i.length < 20 && i.push({
				loreTerms: uO(e.system),
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
	return bO("Grant resolution complete", {
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
async function UO(e) {
	let t = GE(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Spell item here.");
	let n = hn(await fromUuid(t.uuid), rO, "Drop a Foundry Spell item here."), r = lO(TO(n, "Dropped"), [...sO(), dO()]) ?? fO(uO(n.system)[0] ?? "");
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
async function WO(e) {
	let t = await fromUuid(e);
	return fn(t) && t.type === "spell" ? t : null;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/mounts/trait-sources.ts
var GO = "generatedMountTrait";
function KO(t, n) {
	return n.traits.flatMap((n) => {
		if (!n.included || dy(n.name)) return [];
		let r = qO(t, n);
		if (!r) return [];
		let i = r.toObject();
		return delete i._id, i.name = n.outputName, x(i, ["system", "disabled"], !1), x(i, [
			"flags",
			e,
			GO
		], {
			mountUuid: t.uuid,
			sourceTraitUuid: n.sourceUuid
		}), n.fixedDamage !== null && JO(i, n.fixedDamage), [i];
	});
}
function qO(e, t) {
	return e.items?.contents.find((e) => e.type === "trait" && e.uuid === t.sourceUuid) ?? null;
}
function JO(e, t) {
	x(e, [
		"system",
		"specification",
		"value"
	], String(t)), x(e, [
		"system",
		"rollable",
		"bonusCharacteristic"
	], ""), x(e, [
		"system",
		"rollable",
		"rollCharacteristic"
	], "ws"), x(e, [
		"system",
		"rollable",
		"skill"
	], "");
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/mounts/armour.ts
async function YO(e, t, n, r) {
	let i = e.items?.contents.filter(QO) ?? [], a = r.traits.filter((e) => e.included && dy(e.name)), o = XO(i), s = ZO(n, a), c = Math.max(o.value, s.value) + 1;
	if (o.item && e.updateEmbeddedDocuments) {
		await e.updateEmbeddedDocuments("Item", [{
			_id: o.item.id,
			"system.specification.value": String(c)
		}]);
		return;
	}
	let l = PT((s.contribution ? qO(t, s.contribution) : null) ?? await BT("Armour", ["trait"]), "Armour", "trait");
	l.name = "Armour", l.type = "trait", x(l, ["system", "disabled"], !1), x(l, [
		"system",
		"specification",
		"value"
	], String(c)), await e.createEmbeddedDocuments("Item", [l]);
}
function XO(e) {
	return e.reduce((e, t) => {
		let n = _(t.system, [["specification", "value"]]);
		return n > e.value ? {
			item: t,
			value: n
		} : e;
	}, {
		item: null,
		value: 0
	});
}
function ZO(e, t) {
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
function QO(e) {
	return e.type === "trait" && dy(e.name);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/mounts/profile.ts
var $O = new Set(Object.values(cy));
async function ek(e) {
	return tk(pn(await fromUuid(e)));
}
function tk(e) {
	return {
		characteristics: {
			initiative: ak(e, "i"),
			strength: ak(e, "s"),
			strengthBonus: ok(e, "s"),
			toughness: ak(e, "t")
		},
		img: e.img ?? "",
		movement: _(e.system, [[
			"details",
			"move",
			"value"
		]]),
		name: e.name,
		size: sk(e),
		traits: nk(e),
		uuid: e.uuid,
		wounds: _(e.system, [[
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
function nk(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && !ck(e)).map((t) => rk(e, t)).sort((e, t) => e.name.localeCompare(t.name)) ?? [];
}
function rk(e, t) {
	let n = y(t.system, [["rollable", "damage"]]), r = h(t.system, ["specification", "value"]);
	return {
		damage: n,
		fixedDamage: n ? ik(e, t, r) : null,
		name: t.name,
		specification: r,
		uuid: t.uuid
	};
}
function ik(e, t, n) {
	let r = v(t, [["Damage"]]);
	if (r !== null) return r;
	let i = Number(n), a = h(t.system, ["rollable", "bonusCharacteristic"]);
	return (Number.isFinite(i) ? i : 0) + (a ? ok(e, a) : 0);
}
function ak(e, t) {
	return _(e.system, [[
		"characteristics",
		t,
		"value"
	], [
		"characteristics",
		t,
		"initial"
	]]);
}
function ok(e, t) {
	return v(e.system, [[
		"characteristics",
		t,
		"bonus"
	]]) ?? Math.floor(ak(e, t) / 10);
}
function sk(e) {
	let t = h(e.system, [
		"details",
		"size",
		"value"
	]);
	return $O.has(t) ? t : cy.Average;
}
function ck(e) {
	return y(e.system, [["disabled"], ["disabled", "value"]]);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/mounts/apply.ts
var lk = {
	avg: 1,
	enor: 3,
	lrg: 2,
	ltl: .5,
	mnst: 4,
	sml: .8,
	tiny: .3
};
async function uk(t, n) {
	let r = pn(await fromUuid(n));
	if (t.uuid === r.uuid) throw Error("The rider and mount must be different Actors.");
	let i = tk(t), a = tk(r), o = xy(i, a);
	await t.update(dk(t, o));
	let s = KO(r, o);
	s.length && await t.createEmbeddedDocuments("Item", s), await YO(t, r, a, o), await t.createEmbeddedDocuments("Item", [Ty({
		flagScope: e,
		mount: a,
		plan: o,
		rider: i
	})]), await t.update({
		"system.status.wounds.max": o.wounds,
		"system.status.wounds.value": o.wounds
	});
}
function dk(e, t) {
	let n = lk[t.size] ?? 1;
	return {
		"prototypeToken.height": n,
		"prototypeToken.width": n,
		"system.characteristics.i.modifier": fk(e, "i") + t.initiative - pk(e, "i"),
		"system.characteristics.t.modifier": fk(e, "t") + t.toughness - pk(e, "t"),
		"system.details.move.value": t.movement
	};
}
function fk(e, t) {
	return _(e.system, [[
		"characteristics",
		t,
		"modifier"
	]]);
}
function pk(e, t) {
	return _(e.system, [[
		"characteristics",
		t,
		"value"
	]]);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/mounts/actors.ts
function mk() {
	return game.actors.contents.map(XD).sort((e, t) => e.name.localeCompare(t.name));
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/build-npc.ts
async function hk(e) {
	if (e.mountActorUuid && e.mountActorUuid === e.baseActorUuid) throw Error("The rider and mount must be different Actors.");
	let t = await tO(e.careers), n = await _k(e);
	if (!n) throw Error("Foundry did not create the NPC Actor.");
	let r = vk(e), i = e.careers.at(-1), a = {
		name: r,
		"prototypeToken.name": r
	}, o = h(n.system, [
		"details",
		"gmnotes",
		"value"
	]), s = gk(o);
	s !== o && (a["system.details.gmnotes.value"] = s);
	let c = e.portraitPath || i?.img || "";
	return c && (a.img = c, a["prototypeToken.texture.src"] = c), await n.update(a), await nO(n, t), await YE(n, e.advancements), await fD(n, e.traits), e.mountActorUuid && await uk(n, e.mountActorUuid), await LD(n, e.trappings), await VO(n, e.spells), n.sheet?.render(!0), ui.notifications?.info(`Created NPC "${r}".`), {
		name: r,
		uuid: n.uuid
	};
}
function gk(e) {
	return e.replaceAll(/(?:<hr\s*\/?>)?<section data-wfrp-customizer-npc-xp="true">[\S\s]*?<\/section>/g, "").trim();
}
async function _k(e) {
	let t = pn(await fromUuid(e.baseActorUuid)).toObject(), n = ED(e.settings.outputActorFolderUuid);
	return delete t._id, delete t.folder, t.type = "npc", gD(t), n && (t.folder = n.id), await Actor.create(t);
}
function vk(e) {
	if (!e.settings.includeSpeciesInName) return e.actorName;
	let t = game.actors.contents.find((t) => t.uuid === e.baseActorUuid), n = t ? ZD(t) : "";
	return !n || e.actorName.toLocaleLowerCase().includes(n.toLocaleLowerCase()) ? e.actorName : `${n} ${e.actorName}`;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/document-drops.ts
async function yk(e) {
	let t = GE(e);
	if (t.type === "Actor") return {
		actor: await YD(e),
		kind: "actor"
	};
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Actor or WFRP Item.");
	let n = mn(await fromUuid(t.uuid), "Drop a Foundry Item.");
	if (n.type === "career") return {
		career: await eO(e),
		kind: "career"
	};
	if (n.type === "skill" || n.type === "talent") return {
		advancement: XE(n),
		kind: "advancement"
	};
	if (n.type === "trait") return {
		kind: "trait",
		trait: await bD(e)
	};
	if (n.type === "spell") return {
		kind: "spell",
		spell: await UO(e)
	};
	if (HD().includes(n.type)) return {
		kind: "trapping",
		trapping: await zD(e)
	};
	throw Error("Drop an Actor, Career, Skill, Talent, Trait, Trapping, or Spell Item.");
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/index.ts
var bk = {
	buildNpc: hk,
	ensureActorFolder: SD,
	ensureItemFolder: CD,
	findLowerCareerCandidates: cT,
	filterPortraitCandidates: CE,
	getPortraitSearchAvailability: async () => aE(),
	importRecommendedQuickTraits: jD,
	listActorFolders: async () => wD(),
	listBaseActors: async (e) => qD(e),
	listFoundryPortraitCandidates: AE,
	listMagicLoreOptions: oO,
	listMountActors: async () => mk(),
	listSpellsForMagicGrants: HO,
	listItemFolders: async () => TD(),
	listQuickTraits: MD,
	listSkillCharacteristics: wT,
	listSkillSpecializations: CT,
	listTalentMaximums: VT,
	listTraitDifficultyOptions: yD,
	loadBaseActorDraftData: JD,
	loadActorCombatProfile: ek,
	loadSettings: async () => UE(),
	resolveActorDrop: YD,
	resolveApplicationDrop: yk,
	resolveCareerDrop: eO,
	resolveSpellDrop: UO,
	resolveTraitDrop: bD,
	resolveTrapping: RD,
	resolveTrappingDrop: zD,
	saveSettings: WE
}, xk = class extends Bw {
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
		return Tw;
	}
	getVueProps() {
		return { bridge: bk };
	}
}, Sk = "wfrp4e-customizer-open-npc-builder";
function Ck() {
	Hooks.on("renderActorDirectory", (e, t) => {
		let n = Dk(t);
		n && wk(n);
	});
}
function wk(e) {
	let t = Ek(e);
	if (!t) {
		qr("wfrp4e-customizer-apps | Could not find Actor Directory button container.");
		return;
	}
	Tk(e, t);
}
function Tk(e, t) {
	if (e.querySelector(`.${Sk}`)) return;
	let n = document.createElement("button");
	n.classList.add(Sk, "wfrp4e-customizer-actor-directory-button"), n.type = "button", n.innerHTML = "<i class=\"fa-solid fa-user-plus\" inert></i><span>NPC Builder App</span>", n.addEventListener("click", () => {
		new xk().render(!0);
	}), t.append(n);
}
function Ek(e) {
	return e.querySelector(".directory-header .header-actions") ?? e.querySelector(".directory-header .action-buttons") ?? e.querySelector(".header-actions") ?? e.querySelector(".action-buttons");
}
function Dk(e) {
	return e instanceof HTMLElement ? e : Ok(e) && e[0] instanceof HTMLElement ? e[0] : null;
}
function Ok(e) {
	return typeof e == "object" && !!e && "length" in e;
}
//#endregion
//#region src/module/apps/actor-portrait-gallery/view/ActorPortraitGalleryApp.vue?vue&type=script&setup=true&lang.ts
var kk = { class: "app:flex app:h-full app:min-h-0 app:flex-col" }, Ak = { class: "dui-navbar app:sticky app:top-0 app:z-10 app:min-h-0 app:gap-2 app:bg-base-100 app:px-3 app:py-2 app:shadow-sm" }, jk = { class: "dui-navbar-start app:min-w-0 app:flex-1 app:gap-2" }, Mk = { class: "app:m-0 app:truncate app:text-lg app:font-semibold" }, Nk = {
	key: 0,
	class: "dui-badge dui-badge-success dui-badge-sm"
}, Pk = { class: "dui-navbar-end app:w-auto app:gap-2" }, Fk = ["alt", "src"], Ik = ["disabled"], Lk = {
	key: 0,
	"aria-hidden": "true",
	class: "fa-solid fa-spinner fa-spin"
}, Rk = {
	key: 1,
	"aria-hidden": "true",
	class: "fa-solid fa-layer-group"
}, zk = ["disabled"], Bk = ["disabled"], Vk = ["disabled"], Hk = { class: "app:min-h-0 app:flex-1 app:p-2" }, Uk = /* @__PURE__ */ U({
	__name: "ActorPortraitGalleryApp",
	props: {
		bridge: {},
		context: {}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ B(""), r = /* @__PURE__ */ B(""), i = /* @__PURE__ */ B(null), a = /* @__PURE__ */ B(null), o = /* @__PURE__ */ B(t.context.selectedPortraitPath), s = /* @__PURE__ */ B(t.context.currentPortraitPath), c = /* @__PURE__ */ B(t.context.currentTokenPath), l = null, u = null, d = Bp(), f = ey({
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
		cs(o, () => {
			n.value = "", r.value = "";
		}), Ps(te);
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
		return (t, s) => (K(), q("section", kk, [Y("header", Ak, [Y("div", jk, [Y("h1", Mk, I(e.context.actorName), 1), r.value ? (K(), q("span", Nk, I(r.value), 1)) : Q("", !0)]), Y("div", Pk, [
			o.value ? (K(), q("img", {
				key: 0,
				alt: `${g.value} preview`,
				class: "app:aspect-square app:w-10 app:rounded-box app:bg-base-300 app:object-cover",
				height: "40",
				src: o.value,
				width: "40"
			}, null, 8, Fk)) : Q("", !0),
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
			}, [i.value === "both" ? (K(), q("i", Lk)) : (K(), q("i", Rk)), Z(" " + I(i.value === "both" ? "Applying..." : "Apply to Both"), 1)], 8, Ik), Y("button", {
				"aria-label": "More apply options",
				class: "dui-btn dui-btn-primary dui-btn-sm dui-btn-square dui-join-item",
				disabled: !o.value || !!i.value,
				popovertarget: "actor-portrait-apply-menu",
				style: { "anchor-name": "--actor-portrait-apply-menu" },
				type: "button"
			}, [...s[3] ||= [Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-chevron-down"
			}, null, -1)]], 8, zk)], 32),
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
			}, null, -1), Z(" Portrait only ", -1)]], 8, Bk)]), Y("li", null, [Y("button", {
				disabled: !m.value || !!i.value,
				type: "button",
				onClick: s[2] ||= (e) => y("token")
			}, [...s[5] ||= [Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-circle"
			}, null, -1), Z(" Token only ", -1)]], 8, Vk)])], 544)
		])]), Y("main", Hk, [X(Ov, {
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
}), Wk = {
	applyActorPortrait: Gk,
	filterPortraitCandidates: CE,
	listPortraitCandidates: AE
};
async function Gk(e, t, n) {
	await pn(await fromUuid(e), "The Actor for this portrait gallery is no longer available.").update(Kk(t, n));
}
function Kk(e, t) {
	return t === "portrait" ? { img: e } : t === "token" ? { "prototypeToken.texture.src": e } : {
		img: e,
		"prototypeToken.texture.src": e
	};
}
//#endregion
//#region src/module/wfrp/actor-portrait-gallery/context.ts
function qk(e, t) {
	let n = e.img?.trim() ?? "", r = JT(e), i = (e.items?.contents ?? []).filter((e) => e.type === "career"), a = h(e.system, [
		"details",
		"career",
		"name"
	]), o = [
		e.name,
		h(e, ["Species"]),
		h(e.system, [
			"details",
			"species",
			"value"
		]),
		h(e.system, [
			"details",
			"species",
			"subspecies"
		]),
		a,
		h(e.system, [
			"details",
			"career",
			"careergroup",
			"value"
		]),
		h(e.system, [
			"details",
			"career",
			"class",
			"value"
		]),
		...i.flatMap(Yk)
	];
	return {
		actorName: e.name,
		actorUuid: e.uuid,
		currentPortraitPath: n,
		currentTokenPath: r,
		excludeFullyTransparentImages: t.excludeFullyTransparentPortraitAssets,
		excludedReferenceImagePaths: [...t.excludedPortraitReferenceImages],
		immediateCandidates: Jk(e, n, r),
		includeCompendiumAssets: t.searchCompendiumPortraitAssets,
		includeFilePickerAssets: t.searchFoundryPortraitAssets,
		priorityFolderPaths: wp({
			configuredFolders: t.prioritizedPortraitFolders,
			hasCareer: !!a || i.length > 0
		}),
		searchTerms: Sp(o),
		selectedPortraitPath: n || r
	};
}
function Jk(e, t, n) {
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
	}), up(r);
}
function Yk(e) {
	return [
		e.name,
		h(e.system, ["careergroup", "value"]),
		h(e.system, ["class", "value"])
	];
}
//#endregion
//#region src/module/apps/actor-portrait-gallery/view/ActorPortraitGalleryApplication.ts
var Xk = class extends Bw {
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
		return Uk;
	}
	getVueProps() {
		return {
			bridge: Wk,
			context: qk(this.actor, UE())
		};
	}
};
//#endregion
//#region src/module/wfrp/actor-portrait-gallery/open.ts
async function Zk(e) {
	await new Xk(pn(await fromUuid(e), "The requested Actor could not be opened in the portrait gallery.")).render(!0);
}
async function Qk(e) {
	await new Xk(e).render(!0);
}
//#endregion
//#region src/module/wfrp/actor-portrait-gallery/register-actor-sheet-button.ts
var $k = "openWfrpCustomizerPortraitGallery", eA = "wfrp4e-customizer-actor-portrait-gallery-header", tA = [
	"getHeaderControlsActorSheetWFRP4eCharacter",
	"getHeaderControlsActorSheetWFRP4eNPC",
	"getHeaderControlsActorSheetWFRP4eCreature",
	"getHeaderControlsStandardWFRP4eActorSheet",
	"getHeaderControlsBaseWFRP4eActorSheet",
	"getHeaderControlsWarhammerActorSheetV2"
], nA = [
	"renderActorSheetWFRP4eCharacter",
	"renderActorSheetWFRP4eNPC",
	"renderActorSheetWFRP4eCreature",
	"renderStandardWFRP4eActorSheet",
	"renderBaseWFRP4eActorSheet",
	"renderWarhammerActorSheetV2"
], rA = !1;
function iA() {
	if (!rA) {
		rA = !0;
		for (let e of tA) Hooks.on(e, aA);
		for (let e of nA) Hooks.on(e, oA);
	}
}
function aA(e, t) {
	let n = sA(e);
	if (!n || !Array.isArray(t) || n.isOwner === !1) return;
	let r = t;
	r.some((e) => e.action === $k) || r.push({
		action: $k,
		icon: "fa-solid fa-images",
		label: "Choose Portrait & Token"
	});
	let i = e;
	i.options ??= {}, i.options.actions ??= {}, i.options.actions[$k] = function() {
		let e = sA(this);
		e && lA(e);
	};
}
function oA(e) {
	let t = sA(e), n = cA(e);
	if (!t || !n || t.isOwner === !1) return;
	let r = n.querySelector(".window-header");
	if (!r || r.querySelector(`.${eA}, [data-action="${$k}"]`)) return;
	let i = document.createElement("button");
	i.type = "button", i.classList.add(eA, "header-control", "icon", "fa-solid", "fa-images"), i.dataset.action = $k, i.dataset.tooltip = "Choose Portrait & Token", i.ariaLabel = `Choose a portrait and prototype token for ${t.name}`, i.addEventListener("click", (e) => {
		e.preventDefault(), e.stopPropagation(), lA(t);
	});
	let a = r.querySelector("[data-action=\"toggleControls\"]") ?? r.querySelector("[data-action=\"close\"]");
	r.insertBefore(i, a);
}
function sA(e) {
	if (typeof e != "object" || !e) return null;
	let t = "document" in e ? e.document : void 0, n = "actor" in e ? e.actor : void 0;
	return dn(t) ? t : dn(n) ? n : null;
}
function cA(e) {
	return typeof e != "object" || !e || !("element" in e) ? null : e.element instanceof HTMLElement ? e.element : null;
}
async function lA(e) {
	try {
		await Qk(e);
	} catch (e) {
		qr("wfrp4e-customizer-apps | Actor portrait gallery could not be opened.", e), ui.notifications?.warn?.("The portrait gallery could not be opened. See the console for details.");
	}
}
//#endregion
//#region src/module/wfrp/npc-builder/estimated-xp/actor-profile.ts
function uA(e) {
	let t = e.toObject(), n = {};
	for (let e of Object.keys(C)) {
		let r = e;
		n[r] = JE(t.system, r);
	}
	return {
		characteristics: n,
		skills: dA(e, "skill"),
		talents: dA(e, "talent")
	};
}
function dA(e, t) {
	return e.items?.contents.filter((e) => e.type === t).map((e) => ({
		name: e.name,
		value: t === "skill" ? fA(e.toObject().system) : pA(e.toObject().system)
	})) ?? [];
}
function fA(e) {
	return _(e, [["advances", "value"], ["advances"]]) + _(e, [["modifier", "value"], ["modifier"]]);
}
function pA(e) {
	return _(e, [["advances", "value"], ["advances"]]);
}
//#endregion
//#region src/module/wfrp/npc-builder/estimated-xp/species-actor.ts
var mA = null;
async function hA(e, t, n) {
	let r = game.actors.contents, i = gA(n ? r.filter((e) => e.folder?.uuid === n) : [], e);
	if (i) return {
		actor: i,
		source: i.folder?.name ?? "Configured NPC Base Actors folder"
	};
	let a = gA(r.filter((e) => e.uuid !== t.uuid), e);
	if (a) return {
		actor: a,
		source: "World Actors"
	};
	let o = _A(await yA(), e);
	if (!o) return null;
	let s = await fromUuid(o.uuid);
	if (!xA(s)) throw Error(`The species Actor ${o.uuid} is no longer available.`);
	return {
		actor: s,
		source: o.source
	};
}
function gA(e, t) {
	return vA(e, t, (e) => e.name);
}
function _A(e, t) {
	return vA(e, t, (e) => e.name);
}
function vA(e, t, n) {
	let r = t.trim();
	return e.find((e) => n(e).trim() === r) ?? e.find((e) => Wd(n(e)) === Wd(t)) ?? null;
}
function yA() {
	return mA ??= bA(), mA;
}
async function bA() {
	let e = [];
	for (let t of game.packs ?? []) {
		if (!Xw(t) || !t.getIndex) continue;
		let n = await t.getIndex({ fields: ["name"] });
		for (let r of Zw(n)) {
			let n = Jw(t, r);
			r.name && n && e.push({
				name: r.name,
				source: t.title ?? t.collection ?? "Actor Compendium",
				uuid: n
			});
		}
	}
	return e;
}
function xA(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Actor";
}
//#endregion
//#region src/module/wfrp/npc-builder/estimated-xp/estimate.ts
async function SA(e) {
	let t = pn(await fromUuid(e), "Expected an NPC Actor.");
	if (t.type !== "npc") throw Error(`Expected an NPC Actor, but received Actor type “${t.type}”.`);
	return await CA(t);
}
async function CA(e) {
	let t = ZD(e);
	if (!t) return { status: "missing-species" };
	let n = await hA(t, e, UE().baseActorFolderUuid);
	return n ? {
		baselineName: n.actor.name,
		baselineSource: n.source,
		baselineUuid: n.actor.uuid,
		breakdown: zf(uA(e), uA(n.actor)),
		species: t,
		status: "ready"
	} : {
		species: t,
		status: "baseline-not-found"
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/estimated-xp/sheet.ts
var wA = "[data-wfrp-customizer-npc-xp=\"true\"]", TA = /* @__PURE__ */ new Set(), EA = !1, DA = !1;
function OA() {
	if (!EA) {
		EA = !0, Hooks.on("renderApplicationV2", (e, t) => {
			if (!(t instanceof HTMLElement)) return;
			let n = NA(e);
			n && kA(n, t);
		});
		for (let e of [
			"createActor",
			"updateActor",
			"deleteActor",
			"createItem",
			"updateItem",
			"deleteItem",
			"updateSetting"
		]) Hooks.on(e, PA);
	}
}
function kA(e, t) {
	let n = t.matches("section[data-tab=\"careers\"]") ? t : t.querySelector("section[data-tab=\"careers\"]");
	if (!n) return;
	n.querySelector(wA)?.remove();
	let r = AA(e, t), i = n.querySelector(".sheet-list.careers");
	i ? n.insertBefore(r.container, i) : n.append(r.container), FA(), jA(r), globalThis.setTimeout(() => {
		r.root.isConnected && r.root.contains(r.container) && (FA(), TA.add(r));
	}, 0);
}
function AA(e, t) {
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
async function jA(e) {
	let t = ++e.generation;
	e.output.value = "Calculating…";
	try {
		let n = await CA(e.actor);
		t === e.generation && e.root.contains(e.container) && MA(e, n);
	} catch (n) {
		t === e.generation && e.root.contains(e.container) && (e.output.value = "Unavailable", e.details.textContent = "XP calculation failed; see the console for details."), qr("wfrp4e-customizer-apps | NPC XP calculation failed.", n);
	}
}
function MA(e, t) {
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
function NA(e) {
	if (typeof e != "object" || !e) return null;
	let t = "actor" in e ? e.actor : void 0, n = "document" in e ? e.document : void 0, r = dn(t) ? t : dn(n) ? n : null;
	return r?.type === "npc" ? r : null;
}
function PA() {
	DA || (DA = !0, globalThis.setTimeout(() => {
		DA = !1, FA();
		for (let e of TA) jA(e);
	}, 0));
}
function FA() {
	for (let e of TA) (!e.root.isConnected || !e.root.contains(e.container)) && TA.delete(e);
}
//#endregion
//#region src/module/functions/species-builder/characteristic-roll-formulas.ts
var IA = "2d10";
function LA(e) {
	let t = e?.split("+")[0]?.trim();
	return t ? zA(t) : IA;
}
function RA(e, t) {
	return LA(e) === LA(t);
}
function zA(e) {
	return e.replaceAll(/\s+/g, "").toLocaleLowerCase();
}
//#endregion
//#region src/module/wfrp/species-builder/chargen-roll-swap-feedback.ts
var BA = "data-wfrp4e-customizer-roll-swap-feedback", VA = `[${BA}="blocked"]`, HA = /* @__PURE__ */ new WeakMap();
function UA(e, t) {
	let n = XA(e);
	if (n) for (let e of YA(n)) e.addEventListener("dragstart", () => {
		let r = e.dataset.ch;
		r && WA(n, r, t);
	}), e.addEventListener("dragend", () => {
		KA(n);
	}), e.addEventListener("drop", () => {
		KA(n);
	});
}
function WA(e, t, n) {
	KA(e);
	for (let r of YA(e)) {
		let e = r.dataset.ch;
		e && (e === t || n(t, e) || GA(r));
	}
}
function GA(e) {
	HA.set(e, {
		ariaDisabled: e.getAttribute("aria-disabled"),
		borderColor: e.style.getPropertyValue("border-color"),
		borderColorPriority: e.style.getPropertyPriority("border-color"),
		hadDisabledClass: e.classList.contains("disabled")
	}), e.setAttribute(BA, "blocked"), e.setAttribute("aria-disabled", "true"), e.classList.add("disabled"), e.style.setProperty("border-color", "transparent");
}
function KA(e) {
	for (let t of e.querySelectorAll(VA)) {
		let e = HA.get(t);
		e && (e.hadDisabledClass || t.classList.remove("disabled"), qA(t, "aria-disabled", e.ariaDisabled), JA(t, "border-color", e.borderColor, e.borderColorPriority), t.removeAttribute(BA), HA.delete(t));
	}
}
function qA(e, t, n) {
	if (n === null) {
		e.removeAttribute(t);
		return;
	}
	e.setAttribute(t, n);
}
function JA(e, t, n, r) {
	if (!n) {
		e.style.removeProperty(t);
		return;
	}
	e.style.setProperty(t, n, r);
}
function YA(e) {
	return [...e.querySelectorAll(".ch-roll.ch-drag")];
}
function XA(e) {
	if (e instanceof HTMLElement) return e;
	if (!p(e)) return;
	let t = e[0];
	return t instanceof HTMLElement ? t : void 0;
}
//#endregion
//#region src/module/wfrp/species-builder/chargen-roll-swap-guard.ts
var ZA = Symbol("wfrp4e-customizer-guarded-attributes-stage");
function QA() {
	Hooks.on("wfrp4e:chargen", (e) => {
		$A(e);
	});
}
function $A(t) {
	let n = ej(t);
	if (!n) {
		qr(`${e} | Could not inspect WFRP character generation stages.`);
		return;
	}
	let r = tj(n);
	if (!r) {
		qr(`${e} | Could not find the WFRP Attributes character generation stage.`);
		return;
	}
	if (nj(r.class)) return;
	let i = rj(r.class);
	typeof n.replaceStage == "function" ? n.replaceStage("attributes", i) : r.class = i, Kr(`${e} | Guarded WFRP characteristic roll swapping for custom species.`);
}
function ej(e) {
	if (!p(e)) return;
	let t = {}, n = e.replaceStage;
	return typeof n == "function" && (t.replaceStage = (t, r) => {
		n.call(e, t, r);
	}), Array.isArray(e.stages) && (t.stages = e.stages), t;
}
function tj(e) {
	for (let t of e.stages ?? []) if (p(t) && t.key === "attributes") return typeof t.class == "function" ? t : void 0;
}
function nj(e) {
	return !!e[ZA];
}
function rj(e) {
	class t extends e {
		static [ZA] = !0;
		activateListeners(e) {
			let t = super.activateListeners(e);
			return UA(e, (e, t) => RA(ij(this, e), ij(this, t))), t;
		}
		swap(e, t) {
			let n = ij(this, e), r = ij(this, t);
			if (RA(n, r)) return super.swap(e, t);
			aj(e, n, t, r);
		}
	}
	return t;
}
function ij(e, t) {
	let n = p(e.context) ? e.context : void 0, r = p(n?.characteristics) ? n.characteristics : void 0, i = (p(r?.[t]) ? r[t] : void 0)?.formula;
	return typeof i == "string" ? i : void 0;
}
function aj(e, t, n, r) {
	let i = oj(e), a = oj(n), o = LA(t), s = LA(r);
	ui.notifications?.warn?.(`Cannot swap ${i} and ${a}: ${i} uses ${o}, while ${a} uses ${s}.`);
}
function oj(e) {
	let t = game.wfrp4e?.config?.characteristics;
	if (!p(t)) return e;
	let n = t[e];
	return typeof n == "string" ? n : e;
}
//#endregion
//#region src/module/wfrp/species-builder/runtime-species/config-snapshot.ts
var sj = [
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
function cj(e) {
	let t = p(e) ? e : {}, n = Object.fromEntries(sj.map((e) => [e, pj(t[e])]));
	return {
		extraSpecies: hj(t.extraSpecies),
		records: n
	};
}
function lj(e, t, n) {
	let r = Object.fromEntries(sj.map((r) => [r, dj(r, e.records[r], t.records[r], n)]));
	return {
		extraSpecies: gj([...e.extraSpecies, ...t.extraSpecies]).filter((t) => !n.has(t) || e.extraSpecies.includes(t)),
		records: r
	};
}
function uj(e, t, n) {
	return e.records[t][n];
}
function dj(e, t, n, r) {
	let i = e === "subspecies" ? fj(t, n) : {
		...t,
		...n
	};
	for (let e of r) Object.hasOwn(t, e) ? i[e] = mj(t[e]) : delete i[e];
	return i;
}
function fj(e, t) {
	let n = new Set([...Object.keys(e), ...Object.keys(t)]);
	return Object.fromEntries([...n].map((n) => {
		let r = p(e[n]) ? e[n] : {}, i = p(t[n]) ? t[n] : {};
		return [n, {
			...r,
			...i
		}];
	}));
}
function pj(e) {
	return p(e) ? Object.fromEntries(Object.entries(e).map(([e, t]) => [e, mj(t)])) : {};
}
function mj(e) {
	return Array.isArray(e) ? e.map(mj) : p(e) ? Object.fromEntries(Object.entries(e).map(([e, t]) => [e, mj(t)])) : e;
}
function hj(e) {
	return Array.isArray(e) ? e.flatMap((e) => typeof e == "string" && e.trim() ? [e.trim()] : []) : [];
}
function gj(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/module/wfrp/species-builder/runtime-species/values.ts
var _j = Object.values(S);
function vj(e) {
	if (typeof e == "string") return e.trim() || void 0;
}
function yj(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
function bj(e) {
	if (Array.isArray(e)) return e.flatMap((e) => {
		let t = vj(e);
		return t ? [t] : [];
	});
}
function xj(e) {
	if (!Array.isArray(e)) return;
	let t, n = [];
	for (let r of e) {
		let e = Sj(r);
		if (e !== void 0) {
			t = e;
			continue;
		}
		let i = vj(r);
		i && n.push(i);
	}
	return t === void 0 ? { talents: n } : {
		randomTalentCount: t,
		talents: n
	};
}
function Sj(e) {
	if (typeof e == "number") return yj(e);
	if (typeof e != "string" || !e.trim()) return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function Cj(e) {
	if (p(e)) return Object.fromEntries(Object.entries(e).flatMap(([e, t]) => {
		let n = vj(e), r = vj(t);
		return n && r ? [[n, r]] : [];
	}));
}
function wj(e) {
	if (p(e)) return Object.fromEntries(Object.entries(e).flatMap(([e, t]) => {
		let n = vj(e), r = Sj(t);
		return n && r !== void 0 ? [[n, r]] : [];
	}));
}
function Tj(e) {
	if (p(e)) return Object.fromEntries(Object.entries(e).flatMap(([e, t]) => {
		let n = vj(e), r = bj(t);
		return n && r ? [[n, r]] : [];
	}));
}
function Ej(e) {
	if (!p(e)) return;
	let t = _j.flatMap((t) => {
		let n = vj(e[t]);
		return n ? [[t, n]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : {};
}
function Dj(e) {
	if (!p(e)) return;
	let t = {};
	return k(t, "die", vj(e.die)), k(t, "feet", yj(e.feet)), k(t, "inches", yj(e.inches)), Object.keys(t).length > 0 ? t : {};
}
function Oj(e, t, n = void 0) {
	if (!e && t === void 0) return;
	let r = { ...e ?? n };
	return t !== void 0 && (r.talents = t), r;
}
function kj(e, t) {
	let n = t.filter((t) => !e.includes(t)), r = e.filter((e) => !t.includes(e)), i = {};
	return k(i, "added", n.length > 0 ? n : void 0), k(i, "removed", r.length > 0 ? r : void 0), i;
}
function Aj(e, t) {
	let n = Object.fromEntries(Object.entries(t).filter(([t, n]) => e?.[t] !== n));
	return Object.keys(n).length > 0 ? n : void 0;
}
function jj(e, t) {
	let n = Object.entries(e ?? {}), r = Object.entries(t ?? {});
	return n.length === r.length && n.every(([e, n]) => t?.[e] === n);
}
function Mj(e, t, n, r) {
	let i = yj(r);
	i !== void 0 && i !== n && (e[t] = i);
}
//#endregion
//#region src/module/wfrp/species-builder/runtime-species/definition-adapter.ts
function Nj(e, t) {
	let n = new Set(e.extraSpecies);
	return Object.entries(e.records.species).flatMap(([r, i]) => {
		let a = r.trim();
		return a ? [Pj(e, a, i, n, t)] : [];
	}).sort(Hj);
}
function Pj(e, t, n, r, i) {
	let a = {
		includeInExtraSpecies: r.has(t),
		key: t,
		name: vj(n) ?? t
	}, o = xj(uj(e, "speciesTalents", t));
	k(a, "characteristics", Ej(uj(e, "speciesCharacteristics", t))), k(a, "skills", bj(uj(e, "speciesSkills", t))), k(a, "talents", o?.talents), k(a, "randomTalents", Oj(wj(uj(e, "speciesRandomTalents", t)), o?.randomTalentCount)), k(a, "talentReplacements", Cj(uj(e, "speciesTalentReplacement", t))), k(a, "traits", bj(uj(e, "speciesTraits", t))), Fj(a, e, t), k(a, "careerTable", i.resolveCareerTable(t, void 0, void 0));
	let s = Ij(e, a, i);
	return k(a, "subspecies", s.length > 0 ? s : void 0), a;
}
function Fj(e, t, n) {
	k(e, "movement", yj(uj(t, "speciesMovement", n))), k(e, "fate", yj(uj(t, "speciesFate", n))), k(e, "resilience", yj(uj(t, "speciesRes", n))), k(e, "extra", yj(uj(t, "speciesExtra", n))), k(e, "age", vj(uj(t, "speciesAge", n))), k(e, "height", Dj(uj(t, "speciesHeight", n))), k(e, "careerReplacements", Tj(uj(t, "speciesCareerReplacements", n)));
}
function Ij(e, t, n) {
	let r = uj(e, "subspecies", t.key);
	return p(r) ? Object.entries(r).flatMap(([r, i]) => r.trim() && p(i) ? [Lj(e, t, r.trim(), i, n)] : []).sort(Hj) : [];
}
function Lj(e, t, n, r, i) {
	let a = {
		key: n,
		name: vj(r.name) ?? n
	}, o = Ej(r.characteristics);
	o && k(a, "characteristics", Aj(t.characteristics, o)), Rj(a, t, r), Bj(a, t, r), Vj(a, t, r), k(a, "careerReplacements", Tj(uj(e, "speciesCareerReplacements", `${t.key}-${n}`)));
	let s = Cj(r.talentReplacement);
	return jj(t.talentReplacements, s) || k(a, "talentReplacements", s), k(a, "careerTable", i.resolveCareerTable(t.key, n, r.careerTable)), a;
}
function Rj(e, t, n) {
	zj(e, "skills", t.skills ?? [], bj(n.skills));
	let r = xj(n.talents);
	zj(e, "talents", t.talents ?? [], r?.talents), zj(e, "traits", t.traits ?? [], bj(n.speciesTraits));
}
function zj(e, t, n, r) {
	if (!r) return;
	let i = kj(n, r);
	k(e, `${t}Added`, i.added), k(e, `${t}Removed`, i.removed);
}
function Bj(e, t, n) {
	let r = xj(n.talents), i = Oj(wj(n.randomTalents), r?.randomTalentCount, t.randomTalents);
	jj(t.randomTalents, i) || k(e, "randomTalents", i);
}
function Vj(e, t, n) {
	Mj(e, "movement", t.movement, n.movement), Mj(e, "fate", t.fate, n.fate), Mj(e, "resilience", t.resilience, n.resilience), Mj(e, "extra", t.extra, n.extra);
}
function Hj(e, t) {
	return e.name.localeCompare(t.name);
}
//#endregion
//#region src/module/wfrp/species-builder/runtime-species/index.ts
var Uj;
function Wj() {
	Uj = cj(game.wfrp4e?.config);
}
async function Gj(e, t = []) {
	let n = lj(Uj ?? cj(void 0), cj(game.wfrp4e?.config), new Set(e.map((e) => e.trim()).filter(Boolean)));
	for (let e of t) delete n.records.species[e];
	Nj(n, { resolveCareerTable: ke });
}
//#endregion
//#region src/module/apps/species-item/state/index.ts
function Kj(e) {
	return Fd(`species-item:${e}`, () => {
		let t = /* @__PURE__ */ B({
			name: "",
			img: "icons/svg/mystery-man.svg",
			system: oe()
		}), n = /* @__PURE__ */ B(""), r = /* @__PURE__ */ B("description"), i = /* @__PURE__ */ B(0), a = /* @__PURE__ */ B(!1), o = /* @__PURE__ */ B([]), s = /* @__PURE__ */ B(""), c = /* @__PURE__ */ B(""), l = /* @__PURE__ */ B(!1), u = /* @__PURE__ */ B(!1), d = /* @__PURE__ */ B(!1), f = /* @__PURE__ */ B(null), p;
		cs(() => t.value.system.subspeciesOf, async (e, t, n) => {
			let r = !0;
			n(() => {
				r = !1;
			}), f.value = null;
			try {
				let t = await p.loadParent(e);
				r && (f.value = t);
			} catch (e) {
				r && (s.value = qj(e));
			}
		});
		let m = $(() => JSON.stringify(t.value) !== n.value), h = $(() => {
			try {
				return D(t.value.system.talents.choices);
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
				s.value = qj(e), u.value = !1;
			}
		}
		async function y() {
			l.value = !0, s.value = "";
			try {
				p.flushNotes(), t.value = await p.save(JSON.parse(JSON.stringify(t.value))), n.value = JSON.stringify(t.value), i.value += 1, c.value = "Saved Species Item. Refresh Foundry to update character generation.";
			} catch (e) {
				s.value = qj(e);
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
		function ee() {
			t.value.system.subspeciesOf = O();
		}
		async function te(n, r) {
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
				s.value = qj(e);
			}
		}
		let ne = $(() => {
			try {
				return D(t.value.system.talents.choices), "";
			} catch (e) {
				return qj(e);
			}
		});
		async function re(e) {
			try {
				await p.openReference(e);
			} catch (e) {
				s.value = qj(e);
			}
		}
		function T() {
			p.chooseImage(t.value.img, (e) => {
				t.value.img = e;
			});
		}
		let ie = (...e) => p.mountNotes(...e), E = (e) => p.editNotes(e);
		async function se(e, t) {
			if (m.value) {
				s.value = "Save or reload Item changes before editing effects.";
				return;
			}
			try {
				await p.effectAction(e, t), v();
			} catch (e) {
				s.value = qj(e);
			}
		}
		return {
			draft: t,
			parent: f,
			tab: r,
			revision: i,
			isGM: a,
			effects: o,
			choiceWarning: ne,
			chooseImage: T,
			mountNotes: ie,
			editNotes: E,
			effectAction: se,
			openReference: re,
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
			clearParent: ee,
			drop: te
		};
	})();
}
function qj(e) {
	return e instanceof Error ? e.message : String(e);
}
//#endregion
//#region src/module/apps/species-item/view/details/SpeciesTalentEditor.vue?vue&type=script&setup=true&lang.ts
var Jj = ["disabled"], Yj = { class: "dui-fieldset-legend" }, Xj = { class: "app:flex app:flex-wrap app:items-center app:gap-2" }, Zj = { class: "dui-label" }, Qj = [
	"value",
	"aria-label",
	"onChange"
], $j = { class: "app:flex app:gap-2" }, eM = ["onClick"], tM = ["onClick"], nM = /* @__PURE__ */ U({
	__name: "SpeciesTalentEditor",
	props: { uuid: {} },
	setup(e) {
		let t = Kj(e.uuid);
		return (e, n) => (K(), q("fieldset", {
			class: "dui-fieldset",
			disabled: !!V(t).choiceWarning
		}, [
			n[1] ||= Y("legend", { class: "app:sr-only" }, "Edit Talent choices", -1),
			(K(!0), q(G, null, W(V(t).grants, (e, n) => (K(), q("fieldset", {
				key: n,
				class: "dui-fieldset"
			}, [
				Y("legend", Yj, "Talent " + I(n + 1), 1),
				Y("div", Xj, [(K(!0), q(G, null, W(e.choices, (e, r) => (K(), q("label", {
					key: r,
					class: "dui-input dui-input-sm app:min-w-0 app:flex-1"
				}, [Y("span", Zj, I(r ? "Or" : "Talent"), 1), Y("input", {
					value: e.name,
					required: "",
					"aria-label": `Talent ${n + 1}, option ${r + 1}`,
					onChange: (e) => V(t).editTalent(n, r, e.target.value)
				}, null, 40, Qj)]))), 128))]),
				Y("div", $j, [Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					onClick: (e) => V(t).addTalent(n)
				}, " Add alternative ", 8, eM), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					onClick: (e) => V(t).removeTalent(n)
				}, " Remove grant ", 8, tM)])
			]))), 128)),
			Y("button", {
				type: "button",
				class: "dui-btn dui-btn-sm app:justify-self-start",
				onClick: n[0] ||= (e) => V(t).addTalent()
			}, " Add Talent ")
		], 8, Jj));
	}
}), rM = ["disabled"], iM = { class: "app:flex app:flex-wrap app:items-center app:gap-1" }, aM = [
	"onUpdate:modelValue",
	"aria-label",
	"size"
], oM = ["aria-label", "onClick"], sM = {
	key: 0,
	class: "dui-alert dui-alert-warning",
	role: "status"
}, cM = { class: "app:flex app:items-center app:gap-2" }, lM = [
	"disabled",
	"aria-expanded",
	"aria-controls"
], uM = { class: "app:my-1" }, dM = { class: "dui-input dui-input-sm app:w-full" }, fM = [
	"id",
	"value",
	"placeholder"
], pM = /* @__PURE__ */ U({
	__name: "SpeciesItemGrants",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = Kj(e.uuid);
		return (n, r) => (K(), q("fieldset", {
			class: "dui-fieldset",
			disabled: !e.editable
		}, [
			r[11] ||= Y("legend", { class: "app:sr-only" }, "Skills and Talents", -1),
			X(Xy, {
				title: "Skills",
				variant: "bare",
				"show-prompt": !1,
				"manual-entry-trigger": "none",
				disabled: !e.editable,
				onDropData: r[1] ||= (e) => V(t).drop(e, "skills")
			}, {
				default: H(() => [r[7] ||= Y("div", { class: "dui-divider" }, "Skills", -1), Y("div", iM, [(K(!0), q(G, null, W(V(t).draft.system.skills.list, (e, n) => (K(), q("div", {
					key: n,
					class: "dui-join app:max-w-full"
				}, [ts(Y("input", {
					"onUpdate:modelValue": (e) => V(t).draft.system.skills.list[n] = e,
					"aria-label": `Skill ${n + 1} name`,
					size: Math.max(6, V(t).draft.system.skills.list[n].length),
					class: "dui-input dui-input-xs dui-join-item app:w-auto app:min-w-0",
					required: ""
				}, null, 8, aM), [[zu, V(t).draft.system.skills.list[n]]]), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-square dui-join-item",
					"aria-label": `Remove Skill ${n + 1}`,
					onClick: (e) => V(t).draft.system.skills.list.splice(n, 1)
				}, [...r[5] ||= [Y("i", {
					class: "fa-solid fa-xmark",
					"aria-hidden": "true"
				}, null, -1)]], 8, oM)]))), 128)), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					onClick: r[0] ||= (e) => V(t).draft.system.skills.list.push("New Skill")
				}, [...r[6] ||= [Y("i", {
					class: "fa-solid fa-plus",
					"aria-hidden": "true"
				}, null, -1), Z(" Skill ", -1)]])])]),
				_: 1
			}, 8, ["disabled"]),
			V(t).choiceWarning ? (K(), q("div", sM, I(V(t).choiceWarning) + " The stored choices are preserved. ", 1)) : Q("", !0),
			X(Xy, {
				title: "Talents",
				variant: "bare",
				"show-prompt": !1,
				"manual-entry-trigger": "none",
				disabled: !e.editable || !!V(t).choiceWarning,
				onDropData: r[3] ||= (e) => V(t).drop(e, "talents")
			}, {
				default: H(() => [Y("div", cM, [r[9] ||= Y("span", { class: "dui-label app:flex-1" }, "Talents", -1), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					disabled: !e.editable || !!V(t).choiceWarning,
					"aria-expanded": V(t).editingTalents,
					"aria-controls": `${e.uuid}-talent-editor`,
					onClick: r[2] ||= (e) => V(t).editingTalents = !V(t).editingTalents
				}, [r[8] ||= Y("i", {
					class: "fa-solid fa-gear",
					"aria-hidden": "true"
				}, null, -1), Z(" " + I(V(t).editingTalents ? "Done" : "Edit Talents"), 1)], 8, lM)]), Y("p", uM, I(V(t).choiceWarning ? "Native Talent choices preserved" : V(t).talentSummary || (V(t).draft.system.subspeciesOf.uuid ? "Inherit parent Talents" : "None")), 1)]),
				_: 1
			}, 8, ["disabled"]),
			V(t).editingTalents ? (K(), J(nM, {
				key: 1,
				id: `${e.uuid}-talent-editor`,
				uuid: e.uuid
			}, null, 8, ["id", "uuid"])) : Q("", !0),
			Y("label", dM, [r[10] ||= Y("span", { class: "dui-label app:flex-1" }, "Random Talents", -1), Y("input", {
				id: `${e.uuid}-random-talents`,
				"aria-label": "Random Talents",
				class: "app:max-w-20 app:text-center",
				type: "number",
				min: "0",
				value: V(t).draft.system.talents.random,
				placeholder: String(V(t).parent?.talents.random ?? "—"),
				onInput: r[4] ||= (e) => V(t).draft.system.talents.random = e.target.value === "" ? null : Number(e.target.value)
			}, null, 40, fM)])
		], 8, rM));
	}
}), mM = { class: "dui-label" }, hM = { class: "dui-join app:min-w-0" }, gM = {
	key: 1,
	class: "dui-input dui-input-sm app:h-auto app:min-h-8 app:w-full app:whitespace-normal"
}, _M = ["aria-label"], vM = /* @__PURE__ */ U({
	__name: "SpeciesItemReference",
	props: {
		uuid: {},
		label: {},
		reference: {},
		editable: { type: Boolean }
	},
	emits: ["clear", "drop-data"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = Kj(n.uuid);
		function a(e) {
			n.editable && e.dataTransfer && r("drop-data", e.dataTransfer.getData("text/plain"));
		}
		return (t, n) => (K(), q("div", {
			class: "app:grid app:grid-cols-[7rem_minmax(0,1fr)] app:items-center app:gap-2",
			onDragover: n[2] ||= Ju(() => {}, ["prevent"]),
			onDrop: Ju(a, ["prevent"])
		}, [Y("span", mM, I(e.label), 1), Y("div", hM, [e.reference.uuid ? (K(), q("button", {
			key: 0,
			type: "button",
			class: "dui-btn dui-btn-sm dui-btn-outline dui-join-item app:h-auto app:min-h-8 app:min-w-0 app:flex-1 app:justify-start app:whitespace-normal",
			onClick: n[0] ||= (t) => V(i).openReference(e.reference.uuid)
		}, I(e.reference.name || e.label), 1)) : (K(), q("div", gM, " Drop " + I(e.label === "Subspecies Of" ? "a Species Item" : "a RollTable") + " here ", 1)), e.editable && (e.reference.uuid || e.reference.id) ? (K(), q("button", {
			key: 2,
			type: "button",
			class: "dui-btn dui-btn-sm dui-btn-square dui-join-item",
			"aria-label": `Clear ${e.label}`,
			onClick: n[1] ||= (e) => r("clear")
		}, [...n[3] ||= [Y("i", {
			class: "fa-solid fa-xmark",
			"aria-hidden": "true"
		}, null, -1)]], 8, _M)) : Q("", !0)])], 32));
	}
}), yM = ["disabled"], bM = /* @__PURE__ */ U({
	__name: "SpeciesItemTables",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = Kj(e.uuid), n = [
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
			(K(), q(G, null, W(n, (n) => X(vM, {
				key: n.key,
				uuid: e.uuid,
				label: n.label,
				reference: V(t).draft.system.tables[n.key],
				editable: e.editable,
				onDropData: (e) => V(t).drop(e, n.key),
				onClear: (e) => V(t).draft.system.tables[n.key] = V(O)()
			}, null, 8, [
				"uuid",
				"label",
				"reference",
				"editable",
				"onDropData",
				"onClear"
			])), 64))
		], 8, yM));
	}
}), xM = ["disabled"], SM = { class: "app:max-w-full app:overflow-x-auto" }, CM = { class: "dui-table dui-table-xs app:min-w-[34rem]" }, wM = { class: "app:sr-only" }, TM = [
	"aria-label",
	"value",
	"placeholder",
	"onInput"
], EM = { "aria-hidden": "true" }, DM = { class: "dui-input dui-input-xs dui-input-ghost app:w-full app:gap-0 app:px-1" }, OM = [
	"aria-label",
	"value",
	"placeholder",
	"onInput"
], kM = { key: 0 }, AM = { class: "dui-input dui-input-sm app:w-full" }, jM = [
	"id",
	"value",
	"placeholder"
], MM = { class: "app:flex app:flex-wrap app:gap-2" }, NM = { class: "dui-label app:flex-1" }, PM = [
	"aria-label",
	"value",
	"placeholder",
	"onInput"
], FM = { class: "app:grid app:grid-cols-[7rem_minmax(0,1fr)] app:items-center app:gap-2" }, IM = ["for"], LM = ["id"], RM = /* @__PURE__ */ U({
	__name: "SpeciesItemDetails",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = Kj(e.uuid), n = {
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
			X(vM, {
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
			Y("div", SM, [Y("table", CM, [
				o[5] ||= Y("caption", { class: "app:sr-only" }, " Characteristic bases plus dice ", -1),
				Y("thead", null, [Y("tr", null, [(K(!0), q(G, null, W(V(r), (e) => (K(), q("th", {
					key: e,
					scope: "col",
					class: "app:text-center"
				}, I(n[e]), 1))), 128))])]),
				Y("tbody", null, [
					Y("tr", null, [(K(!0), q(G, null, W(V(r), (e) => (K(), q("td", {
						key: e,
						class: "app:p-1"
					}, [Y("label", null, [Y("span", wM, I(n[e]) + " base", 1), Y("input", {
						class: "dui-input dui-input-xs dui-input-ghost app:w-full app:text-center",
						type: "number",
						min: "0",
						step: "any",
						"aria-label": `${n[e]} base`,
						value: V(t).draft.system.characteristics[e]?.base,
						placeholder: String(V(t).parent?.characteristics[e]?.base ?? "—"),
						onInput: (n) => V(t).setCharacteristic(e, "base", n.target.value)
					}, null, 40, TM)])]))), 128))]),
					Y("tr", EM, [(K(!0), q(G, null, W(V(r), (e) => (K(), q("td", {
						key: e,
						class: "app:text-center"
					}, "+"))), 128))]),
					Y("tr", null, [(K(!0), q(G, null, W(V(r), (e) => (K(), q("td", {
						key: e,
						class: "app:p-1"
					}, [Y("label", DM, [Y("input", {
						class: "app:text-center",
						type: "number",
						min: "0",
						step: "any",
						"aria-label": `${n[e]} dice`,
						value: V(t).draft.system.characteristics[e]?.dice,
						placeholder: String(V(t).parent?.characteristics[e]?.dice ?? "—"),
						onInput: (n) => V(t).setCharacteristic(e, "dice", n.target.value)
					}, null, 40, OM), o[4] ||= Y("span", null, "d10", -1)])]))), 128))])
				])
			])]),
			V(t).draft.system.subspeciesOf.uuid ? (K(), q("p", kM, "Empty values inherit from the parent species.")) : Q("", !0),
			X(pM, {
				uuid: e.uuid,
				editable: e.editable
			}, null, 8, ["uuid", "editable"]),
			Y("label", AM, [o[6] ||= Y("span", { class: "dui-label app:flex-1" }, "Movement", -1), Y("input", {
				id: `${e.uuid}-movement`,
				"aria-label": "Movement",
				class: "app:max-w-20 app:text-center",
				type: "number",
				min: "0",
				step: "any",
				value: V(t).draft.system.movement,
				placeholder: String(V(t).parent?.movement ?? "—"),
				onInput: o[2] ||= (e) => V(t).setStatistic("movement", e.target.value)
			}, null, 40, jM)]),
			Y("div", MM, [(K(), q(G, null, W(i, (e) => Y("label", {
				key: e.key,
				class: "dui-input dui-input-sm app:min-w-36 app:flex-1"
			}, [Y("span", NM, I(e.label), 1), Y("input", {
				class: "app:max-w-12 app:text-center",
				type: "number",
				min: "0",
				step: "any",
				"aria-label": e.label,
				value: V(t).draft.system[e.key],
				placeholder: String(V(t).parent?.[e.key] ?? "—"),
				onInput: (n) => V(t).setStatistic(e.key, n.target.value)
			}, null, 40, PM)])), 64))]),
			Y("div", FM, [Y("label", {
				class: "dui-label",
				for: `${e.uuid}-size`
			}, "Size", 8, IM), ts(Y("select", {
				id: `${e.uuid}-size`,
				"onUpdate:modelValue": o[3] ||= (e) => V(t).draft.system.size = e,
				class: "dui-select dui-select-sm app:w-full",
				"aria-label": "Size"
			}, [...o[7] ||= [bl("<option value=\"tiny\">Tiny</option><option value=\"ltl\">Little</option><option value=\"sml\">Small</option><option value=\"avg\">Average</option><option value=\"lrg\">Large</option><option value=\"enor\">Enormous</option><option value=\"mnst\">Monstrous</option>", 7)]], 8, LM), [[Hu, V(t).draft.system.size]])]),
			X(bM, {
				uuid: e.uuid,
				editable: e.editable
			}, null, 8, ["uuid", "editable"])
		], 8, xM));
	}
}), zM = {
	key: 0,
	class: "dui-fieldset"
}, BM = { class: "dui-fieldset" }, VM = /* @__PURE__ */ U({
	__name: "SpeciesItemNotes",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = e, n = Kj(t.uuid), r = /* @__PURE__ */ B(), i = /* @__PURE__ */ B(), a = [];
		return js(() => {
			for (let [e, o] of [["description", r.value], ["gmdescription", i.value]]) o && a.push(n.mountNotes(o, e, n.draft.system[e].value, t.editable, (t) => {
				n.draft.system[e].value = t;
			}));
		}), Ps(() => a.forEach((e) => e())), (t, a) => (K(), q(G, null, [V(n).isGM ? (K(), q("fieldset", zM, [
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
		])) : Q("", !0), Y("fieldset", BM, [
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
function HM(e) {
	let t = e.dataTransfer?.getData("text/plain") ?? "";
	if (!t) return null;
	try {
		return GE(t).type === "Item" ? t : null;
	} catch {
		return null;
	}
}
async function UM(e) {
	let t = GE(e);
	if (!t.uuid) throw Error("Drop an Item with a resolvable UUID.");
	return mn(await fromUuid(t.uuid), "The dropped Item was not found.");
}
function WM(e) {
	let t = {
		name: e.name,
		uuid: e.uuid
	};
	return e.img && (t.img = e.img), t;
}
//#endregion
//#region src/module/wfrp/effect-builders/documents.ts
async function GM(e) {
	let t = JSON.parse(e);
	if (!p(t) || typeof t.uuid != "string") throw Error("Drop a document or enter its UUID.");
	return fromUuid(t.uuid);
}
function KM(e) {
	let t = mn(e, "Choose an Item to receive the effect.");
	if (!game.user || !t.canUserModify(game.user, "update")) throw Error("You do not have permission to edit this Item.");
	if (t.compendium?.locked) throw Error("Unlock the destination compendium or import its Item into the world.");
	return t;
}
async function qM(e, t = !1) {
	let n = await GM(e);
	return WM(t ? KM(n) : mn(n, "Choose an Item to grant."));
}
function JM(e) {
	if (!p(e) || e.documentName !== "RollTable" || typeof e.uuid != "string" || typeof e.name != "string") throw Error("Choose a RollTable containing Item document results.");
	return {
		uuid: e.uuid,
		name: e.name
	};
}
async function YM(e, t, n = []) {
	if (n.includes(e)) throw Error("The grant RollTables contain a circular reference.");
	if (n.length > 5) throw Error("The grant RollTables exceed Foundry's nesting limit.");
	let r = await fromUuid(e);
	JM(r);
	let i = p(r) ? r.results : void 0, a = p(i) ? i.contents : void 0;
	if (!Array.isArray(a) || !a.length) throw Error("The grant RollTable is empty.");
	for (let r of a) {
		let i = p(r) ? r.documentUuid : void 0;
		if (typeof i != "string" || !i) throw Error("Grant RollTables must use Item or nested RollTable document results.");
		if (i === t) throw Error("An Item cannot grant itself.");
		let a = await fromUuid(i);
		p(a) && a.documentName === "RollTable" ? await YM(i, t, [...n, e]) : mn(a, `The RollTable result ${i} is not an available Item.`);
	}
}
//#endregion
//#region src/module/apps/effect-builders/functions/catalogue.ts
var XM = [
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
function ZM(e) {
	return {
		kind: e,
		name: XM.find((t) => t.kind === e).title,
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
//#region src/module/functions/item-grants/script.ts
function QM(e, t) {
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
var $M = "generatedGrantItemsEffect", eN = {
	grantMode: "all",
	lifetime: "linked-to-effect",
	ownerAction: "keep"
};
function tN(e) {
	let t = e.recipe ?? eN;
	nN(t);
	let n = e.items.map((e) => e.uuid);
	return {
		changes: [],
		description: rN(e.effectName, e.items, t),
		disabled: !1,
		flags: { [e.flagScope]: {
			[$M]: !0,
			itemUuids: n,
			recipe: t
		} },
		img: e.items[0]?.img ?? "icons/svg/aura.svg",
		name: e.effectName,
		system: {
			scriptData: [{
				label: e.effectName,
				script: QM([`const itemUuids = ${JSON.stringify(n)};`], t),
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
function nN(e) {
	if (e.lifetime === "linked-to-effect" && e.ownerAction === "delete-after-grant") throw Error("Self-removing grant effects must create detached item copies.");
}
function rN(e, t, n) {
	let r = iN(e), i = t.map((e) => `<li>${iN(e.name)}</li>`).join("");
	return `<p><strong>${r}</strong>: grants item copies; ${n.lifetime === "linked-to-effect" ? "granted item copies are removed with this effect" : "granted item copies remain after this effect is removed"}.${n.ownerAction === "delete-after-grant" ? " The source Item removes itself after granting." : ""}</p><ul>${i}</ul>`;
}
function iN(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
//#endregion
//#region src/module/apps/effect-builders/functions/formula-validation.ts
function aN(e) {
	if (!e.trim()) throw Error("Enter a wound formula.");
	let t = ct(e), n = [...t.usedKeywords, ...t.references.map((e) => e.variableName)], r = t.expression.replace(/Math\.(floor|ceil|round|min|max|abs|sqrt|pow)\b/g, "0");
	if ((r.match(/[A-Za-z_$][\w$]*/g) ?? []).some((e) => !n.includes(e)) || /[^\w\s.+*/%(),-]/.test(r)) throw Error("Use arithmetic, formula tokens, and Math functions in the wound formula.");
	try {
		Function(...n, `"use strict"; return (${t.expression});`);
	} catch {
		throw Error("The wound formula has invalid arithmetic or unmatched brackets.");
	}
}
//#endregion
//#region src/module/apps/effect-builders/functions/choice.ts
function oN(e, t, n) {
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
function sN(e, t) {
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
//#region src/module/apps/effect-builders/functions/build.ts
function cN(e) {
	let t = [];
	if (e.name.trim() || t.push("Enter an effect name."), e.kind === "wounds") {
		try {
			aN(e.formula);
		} catch (e) {
			t.push(e instanceof Error ? e.message : String(e));
		}
		return t;
	}
	return e.recipe.lifetime === "linked-to-effect" && e.recipe.ownerAction === "delete-after-grant" && t.push("Self-removing source Items must grant copies that remain after the effect is removed."), e.kind === "grant" && !e.items.length && t.push("Add at least one Item to grant."), e.kind === "random" && !e.table && t.push("Choose a RollTable."), (e.kind === "random" || e.kind === "choice") && (!Number.isInteger(e.count) || e.count < 1 || e.count > 100) && t.push("Enter a whole number from 1 to 100."), e.kind === "choice" && ((!e.groups.length || e.groups.some((e) => !e.name.trim() || !e.items.length)) && t.push("Each choice needs a name and at least one Item."), e.count > e.groups.length && t.push("The number of choices exceeds the available options.")), t;
}
function lN(e, t) {
	let n = cN(e);
	if (n.length) throw Error(n.join(" "));
	let r = e.name.trim();
	if (e.kind === "wounds") return It(r, e.formula);
	let i = tN({
		effectName: r,
		flagScope: t,
		items: e.items,
		recipe: e.recipe
	});
	if (e.kind === "grant") return i;
	let a = e.kind === "random" ? sN(e.table.uuid, e.count) : oN(r, e.groups, e.count);
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
				script: QM(a, e.recipe)
			}]
		}
	};
}
//#endregion
//#region src/module/apps/effect-builders/state/index.ts
function uN(e) {
	return Fd(`effect-builder:${e}`, () => {
		let e = /* @__PURE__ */ B(ZM("wounds")), t = /* @__PURE__ */ B(null), n = /* @__PURE__ */ B(""), r = /* @__PURE__ */ B(""), i = /* @__PURE__ */ B(!1), a = /* @__PURE__ */ B(!1), o = /* @__PURE__ */ B(!1), s, c = $(() => cN(e.value)), l = $(() => !!t.value && !c.value.length && !i.value && !a.value);
		function u(n, r, i) {
			s = r, !o.value && (e.value = ZM(n), t.value = i, o.value = !0);
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
	})(Ew);
}
//#endregion
//#region src/module/apps/shared/view/components/ApplicationShell.vue?vue&type=script&setup=true&lang.ts
var dN = ["aria-label"], fN = { class: "dui-card-body" }, pN = { class: "dui-card-title" }, mN = { key: 0 }, hN = {
	key: 0,
	class: "dui-card-actions"
}, gN = /* @__PURE__ */ U({
	__name: "ApplicationShell",
	props: {
		description: {},
		title: {}
	},
	setup(e) {
		return (t, n) => (K(), q("section", {
			"aria-label": e.title,
			class: "dui-card"
		}, [Y("div", fN, [
			Y("header", null, [
				Y("h1", pN, I(e.title), 1),
				e.description ? (K(), q("p", mN, I(e.description), 1)) : Q("", !0),
				Vs(t.$slots, "header")
			]),
			Vs(t.$slots, "default"),
			t.$slots.actions ? (K(), q("div", hN, [Vs(t.$slots, "actions")])) : Q("", !0)
		])], 8, dN));
	}
}), _N = { class: "dui-list" }, vN = { class: "dui-list-col-grow" }, yN = ["aria-label", "onClick"], bN = /* @__PURE__ */ U({
	__name: "SourceItems",
	props: {
		items: {},
		title: {}
	},
	emits: ["dropData", "remove"],
	setup(e) {
		return (t, n) => (K(), q(G, null, [X(Xy, {
			title: e.title,
			description: "Drop an Item to add it to this list.",
			variant: "compact",
			onDropData: n[0] ||= (e) => t.$emit("dropData", e)
		}, null, 8, ["title"]), Y("ul", _N, [(K(!0), q(G, null, W(e.items, (e) => (K(), q("li", {
			key: e.uuid,
			class: "dui-list-row"
		}, [Y("span", vN, I(e.name), 1), Y("button", {
			type: "button",
			class: "dui-btn dui-btn-sm dui-btn-ghost",
			"aria-label": `Remove ${e.name}`,
			onClick: (n) => t.$emit("remove", e.uuid)
		}, " Remove ", 8, yN)]))), 128))])], 64));
	}
}), xN = { class: "dui-fieldset" }, SN = ["for"], CN = ["id", "max"], wN = { class: "dui-fieldset-legend" }, TN = ["for"], EN = ["id", "onUpdate:modelValue"], DN = ["onClick"], ON = /* @__PURE__ */ U({
	__name: "ChoiceOptions",
	props: { id: {} },
	setup(e) {
		let t = e, n = uN(t.id), r = `${t.id}-${gs()}`;
		return (e, t) => (K(), q("fieldset", xN, [
			t[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "Player choices", -1),
			Y("label", {
				for: `${r}-count`,
				class: "dui-label"
			}, "Number of options to choose", 8, SN),
			ts(Y("input", {
				id: `${r}-count`,
				"onUpdate:modelValue": t[0] ||= (e) => V(n).draft.count = e,
				"aria-label": "Number of options to choose",
				type: "number",
				min: "1",
				max: V(n).draft.groups.length || 1,
				step: "1",
				class: "dui-input"
			}, null, 8, CN), [[
				zu,
				V(n).draft.count,
				void 0,
				{ number: !0 }
			]]),
			t[3] ||= Y("p", null, "Each option can grant one Item or a whole package.", -1),
			(K(!0), q(G, null, W(V(n).draft.groups, (e, t) => (K(), q("fieldset", {
				key: t,
				class: "dui-fieldset"
			}, [
				Y("legend", wN, "Option " + I(t + 1), 1),
				Y("label", {
					for: `${r}-${t}`,
					class: "dui-label"
				}, "Option name", 8, TN),
				ts(Y("input", {
					id: `${r}-${t}`,
					"onUpdate:modelValue": (t) => e.name = t,
					"aria-label": "Option name",
					class: "dui-input app:w-full"
				}, null, 8, EN), [[zu, e.name]]),
				X(bN, {
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
				}, " Remove option ", 8, DN)
			]))), 128)),
			Y("button", {
				type: "button",
				class: "dui-btn",
				onClick: t[1] ||= (...e) => V(n).addGroup && V(n).addGroup(...e)
			}, "Add option")
		]));
	}
}), kN = { class: "dui-fieldset" }, AN = ["for"], jN = ["id", "value"], MN = {
	key: 0,
	class: "dui-label"
}, NN = /* @__PURE__ */ U({
	__name: "GrantOptions",
	props: { id: {} },
	setup(e) {
		let t = e, n = uN(t.id), r = `${t.id}-${gs()}`;
		return (e, t) => (K(), q("fieldset", kN, [
			t[4] ||= Y("legend", { class: "dui-fieldset-legend" }, "Granted Items", -1),
			Y("label", {
				for: `${r}-lifetime`,
				class: "dui-label"
			}, "When the effect is removed", 8, AN),
			Y("select", {
				id: `${r}-lifetime`,
				"aria-label": "When the effect is removed",
				class: "dui-select app:w-full",
				value: V(n).draft.recipe.lifetime,
				onChange: t[0] ||= (e) => V(n).setLifetime(e.target.value)
			}, [...t[2] ||= [Y("option", { value: "linked-to-effect" }, "Remove the granted Items too", -1), Y("option", { value: "detached" }, "Keep the granted Items", -1)]], 40, jN),
			V(n).draft.recipe.lifetime === "detached" ? (K(), q("label", MN, [ts(Y("input", {
				"onUpdate:modelValue": t[1] ||= (e) => V(n).draft.recipe.ownerAction = e,
				type: "checkbox",
				class: "dui-checkbox",
				"true-value": "delete-after-grant",
				"false-value": "keep"
			}, null, 512), [[Bu, V(n).draft.recipe.ownerAction]]), t[3] ||= Z(" Remove the source Item after a successful grant ", -1)])) : Q("", !0)
		]));
	}
}), PN = /* @__PURE__ */ "@sb.@tb.@wpb.@sbMultiplier.@tbMultiplier.@wpbMultiplier.@scale.@size.@age.@height.@weight.@status.@rank.@xp.@fate.@fortune.@resilience.@resolve.@corruption.@sin.@advantage.@bleeding.@poisoned.@ablaze.@deafened.@stunned.@entangled.@fatigued.@blinded.@broken".split("."), FN = { class: "dui-fieldset" }, IN = { class: "dui-collapse dui-collapse-arrow" }, LN = { class: "dui-collapse-content" }, RN = { class: "app:flex app:flex-wrap app:gap-1" }, zN = ["onClick", "onDragstart"], BN = /* @__PURE__ */ U({
	__name: "WoundFormula",
	props: { id: {} },
	setup(e) {
		let t = e, n = uN(t.id), r = `${t.id}-${gs()}`, i = /* @__PURE__ */ B(), a = [
			...PN,
			"{Strength}",
			"[Toughness]",
			"{Endurance}",
			"[Endurance]"
		];
		async function o(e) {
			let t = i.value, r = t?.selectionStart ?? n.draft.formula.length, a = t?.selectionEnd ?? r;
			n.draft.formula = `${n.draft.formula.slice(0, r)}${e}${n.draft.formula.slice(a)}`, await Uo(), t?.focus(), t?.setSelectionRange(r + e.length, r + e.length);
		}
		return (e, t) => (K(), q("fieldset", FN, [
			t[5] ||= Y("legend", { class: "dui-fieldset-legend" }, "Wound calculation", -1),
			Y("label", {
				for: r,
				class: "dui-label"
			}, "Formula"),
			ts(Y("textarea", {
				id: r,
				ref_key: "textarea",
				ref: i,
				"onUpdate:modelValue": t[0] ||= (e) => V(n).draft.formula = e,
				"aria-label": "Formula",
				class: "dui-textarea app:w-full",
				rows: "3",
				onDragover: t[1] ||= Ju(() => {}, ["prevent"]),
				onDrop: t[2] ||= Ju((e) => o(e.dataTransfer?.getData("text/plain") ?? ""), ["prevent"])
			}, null, 544), [[zu, V(n).draft.formula]]),
			t[6] ||= bl("<p> Use <code>{Name}</code> for a characteristic or Skill total and <code>[Name]</code> for its bonus. For example: <code>[Endurance] + 2 * @tb</code>. </p><p><code>{Endurance|Strength}</code> uses Strength for that Skill. Arithmetic and <code>Math.floor</code>, <code>Math.ceil</code>, <code>Math.min</code>, and <code>Math.max</code> are supported. </p>", 2),
			Y("details", IN, [t[4] ||= Y("summary", { class: "dui-collapse-title" }, "Insert formula tokens", -1), Y("div", LN, [t[3] ||= Y("p", null, "Click a token to insert it at the cursor, or drag it into the formula.", -1), Y("div", RN, [(K(), q(G, null, W(a, (e) => Y("button", {
				key: e,
				type: "button",
				class: "dui-btn dui-btn-xs",
				draggable: "true",
				onClick: (t) => o(e),
				onDragstart: (t) => t.dataTransfer?.setData("text/plain", e)
			}, I(e), 41, zN)), 64))])])])
		]));
	}
}), VN = {
	key: 0,
	role: "alert",
	class: "dui-alert dui-alert-error"
}, HN = {
	key: 1,
	role: "status",
	class: "dui-alert dui-alert-success"
}, UN = ["disabled"], WN = ["for"], GN = ["id"], KN = {
	key: 2,
	class: "dui-fieldset"
}, qN = ["for"], JN = ["id"], YN = {
	key: 2,
	class: "dui-list",
	"aria-label": "To finish this effect"
}, XN = { class: "app:flex app:flex-wrap app:gap-2" }, ZN = ["disabled"], QN = ["disabled"], $N = /* @__PURE__ */ U({
	__name: "EffectBuilderApp",
	props: {
		id: {},
		kind: {},
		destination: {},
		bridge: {},
		close: { type: Function }
	},
	setup(e) {
		let t = e, n = uN(t.id);
		n.configure(t.kind, t.bridge, t.destination);
		let r = `${t.id}-${gs()}`, i = XM.find((e) => e.kind === t.kind);
		return (t, a) => (K(), J(gN, {
			title: `${V(i).title} Effect Builder`,
			description: V(i).description
		}, {
			default: H(() => [
				V(n).error ? (K(), q("div", VN, I(V(n).error), 1)) : Q("", !0),
				V(n).message ? (K(), q("div", HN, I(V(n).message), 1)) : Q("", !0),
				Y("fieldset", {
					class: "dui-fieldset",
					disabled: V(n).busy || V(n).created
				}, [
					X(Xy, {
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
					}, "Effect name", 8, WN),
					ts(Y("input", {
						id: `${r}-name`,
						"onUpdate:modelValue": a[0] ||= (e) => V(n).draft.name = e,
						"aria-label": "Effect name",
						class: "dui-input app:w-full"
					}, null, 8, GN), [[zu, V(n).draft.name]]),
					e.kind === "wounds" ? (K(), J(BN, {
						key: 0,
						id: e.id
					}, null, 8, ["id"])) : e.kind === "grant" ? (K(), J(bN, {
						key: 1,
						title: "Items to grant",
						items: V(n).draft.items,
						onDropData: a[1] ||= (e) => V(n).dropItem(e),
						onRemove: a[2] ||= (e) => V(n).removeItem(e)
					}, null, 8, ["items"])) : e.kind === "random" ? (K(), q("fieldset", KN, [
						a[7] ||= Y("legend", { class: "dui-fieldset-legend" }, "Random selection", -1),
						X(Xy, {
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
						}, "Number of rolls", 8, qN),
						ts(Y("input", {
							id: `${r}-rolls`,
							"onUpdate:modelValue": a[3] ||= (e) => V(n).draft.count = e,
							"aria-label": "Number of rolls",
							type: "number",
							min: "1",
							max: "100",
							step: "1",
							class: "dui-input"
						}, null, 8, JN), [[
							zu,
							V(n).draft.count,
							void 0,
							{ number: !0 }
						]]),
						a[8] ||= Y("p", null, " Rolls leave results available for future rolls. An Item may be granted more than once. ", -1)
					])) : (K(), J(ON, {
						key: 3,
						id: e.id
					}, null, 8, ["id"])),
					e.kind === "wounds" ? Q("", !0) : (K(), J(NN, {
						key: 4,
						id: e.id
					}, null, 8, ["id"]))
				], 8, UN),
				!V(n).created && V(n).problems.length ? (K(), q("ul", YN, [(K(!0), q(G, null, W(V(n).problems, (e) => (K(), q("li", { key: e }, I(e), 1))), 128))])) : Q("", !0),
				Y("div", XN, [
					V(n).created ? Q("", !0) : (K(), q("button", {
						key: 0,
						type: "button",
						class: "dui-btn dui-btn-primary",
						disabled: !V(n).ready,
						onClick: a[4] ||= (...e) => V(n).create && V(n).create(...e)
					}, I(V(n).busy ? "Working…" : "Add effect to Item"), 9, ZN)),
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
					}, I(V(n).created ? "Done" : "Cancel"), 9, QN)
				])
			]),
			_: 1
		}, 8, ["title", "description"]));
	}
});
//#endregion
//#region src/module/wfrp/effect-builders/bridge.ts
async function eP(t, n) {
	let r = KM(await fromUuid(t)), i = lN(n, e), a = n.kind === "grant" ? n.items : n.kind === "choice" ? n.groups.flatMap((e) => e.items) : [];
	for (let e of a) {
		if (e.uuid === t) throw Error("An Item cannot grant itself.");
		mn(await fromUuid(e.uuid), `The granted Item ${e.name} is no longer available.`);
	}
	if (n.kind === "random" && await YM(n.table.uuid, t), !r.createEmbeddedDocuments) throw Error("This Item cannot contain Active Effects.");
	await r.createEmbeddedDocuments("ActiveEffect", [i]);
}
var tP = {
	resolveItem: qM,
	async resolveTable(e) {
		return JM(await GM(e));
	},
	create: eP,
	async openItem(e) {
		mn(await fromUuid(e)).sheet?.render(!0);
	}
}, nP = 0, rP = class extends Bw {
	kind;
	destination;
	storeId;
	constructor(t, n = null) {
		let r = `${e}-effect-${++nP}`;
		super({
			id: r,
			window: { title: `${XM.find((e) => e.kind === t).title} Effect Builder` }
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
		return $N;
	}
	getVueProps() {
		return {
			id: this.storeId,
			kind: this.kind,
			destination: this.destination,
			bridge: tP,
			close: () => this.close()
		};
	}
	async _preClose(e) {
		let t = uN(this.storeId);
		await super._preClose(e), t.$dispose(), delete Ew.state.value[`effect-builder:${this.storeId}`];
	}
}, iP = { key: 0 }, aP = { class: "dui-list" }, oP = { class: "dui-list-col-grow" }, sP = ["aria-label", "onClick"], cP = /* @__PURE__ */ U({
	__name: "EffectBuildersApp",
	props: {
		destination: {},
		openBuilder: { type: Function }
	},
	setup(e) {
		return (t, n) => (K(), J(gN, {
			title: "Effect Builders",
			description: "Choose an effect to create, then select the Item that will carry it."
		}, {
			default: H(() => [
				e.destination ? (K(), q("p", iP, [n[0] ||= Z(" Destination: ", -1), Y("strong", null, I(e.destination.name), 1)])) : Q("", !0),
				Y("ul", aP, [(K(!0), q(G, null, W(V(XM), (t) => (K(), q("li", {
					key: t.kind,
					class: "dui-list-row"
				}, [Y("div", oP, [Y("strong", null, I(t.title), 1), Y("p", null, I(t.description), 1)]), Y("button", {
					type: "button",
					class: "dui-btn",
					"aria-label": `Open ${t.title} Effect Builder`,
					onClick: (n) => e.openBuilder(t.kind)
				}, " Open ", 8, sP)]))), 128))]),
				n[1] ||= Y("p", null, "Find this launcher and individual shortcuts in the Effect Builders macro compendium.", -1)
			]),
			_: 1
		}));
	}
}), lP = class extends Bw {
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
		return cP;
	}
	getVueProps() {
		return {
			destination: this.destination,
			openBuilder: (e) => new rP(e, this.destination).render(!0)
		};
	}
};
//#endregion
//#region src/module/wfrp/effect-builders/open.ts
async function uP(e) {
	let t = new lP();
	e && (t.destination = WM(KM(await fromUuid(e)))), await t.render(!0);
}
async function dP(e, t) {
	await new rP(e, t ? WM(KM(await fromUuid(t))) : null).render(!0);
}
var fP = (e) => dP("wounds", e), pP = (e) => dP("grant", e), mP = (e) => dP("random", e), hP = (e) => dP("choice", e), gP = { key: 0 }, _P = ["disabled"], vP = { class: "dui-fieldset-legend" }, yP = {
	key: 0,
	class: "app:flex app:flex-wrap app:gap-2"
}, bP = { key: 1 }, xP = {
	key: 2,
	class: "app:max-w-full app:overflow-x-auto"
}, SP = { class: "dui-table dui-table-sm" }, CP = ["onClick"], wP = { class: "app:flex app:flex-wrap app:gap-2" }, TP = ["onClick"], EP = ["aria-label", "onClick"], DP = /* @__PURE__ */ U({
	__name: "SpeciesItemEffects",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = Kj(e.uuid), n = $(() => [
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
		return (r, i) => (K(), q(G, null, [V(t).dirty ? (K(), q("p", gP, "Save or reload Item changes before editing effects.")) : Q("", !0), (K(!0), q(G, null, W(n.value, (n) => (K(), q(G, { key: n.name }, [n.entries.length || n.name === "Effects" ? (K(), q("fieldset", {
			key: 0,
			class: "dui-fieldset",
			disabled: !e.editable || V(t).dirty
		}, [
			Y("legend", vP, I(n.name), 1),
			n.name === "Effects" ? (K(), q("div", yP, [Y("button", {
				type: "button",
				class: "dui-btn dui-btn-sm",
				onClick: i[0] ||= (e) => V(t).effectAction("create")
			}, " Add Effect "), Y("button", {
				type: "button",
				class: "dui-btn dui-btn-sm",
				onClick: i[1] ||= (t) => V(uP)(e.uuid)
			}, " Effect Builders ")])) : Q("", !0),
			n.entries.length ? Q("", !0) : (K(), q("p", bP, "No effects.")),
			n.entries.length ? (K(), q("div", xP, [Y("table", SP, [i[2] ||= Y("thead", null, [Y("tr", null, [
				Y("th", { scope: "col" }, "Effect"),
				Y("th", { scope: "col" }, "Type"),
				Y("th", { scope: "col" }, [Y("span", { class: "app:sr-only" }, "Actions")])
			])], -1), Y("tbody", null, [(K(!0), q(G, null, W(n.entries, (e) => (K(), q("tr", { key: e.id }, [
				Y("td", null, [Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm dui-btn-ghost app:h-auto app:whitespace-normal",
					onClick: (n) => V(t).effectAction("edit", e.id)
				}, I(e.name), 9, CP)]),
				Y("td", null, I(e.type), 1),
				Y("td", null, [Y("div", wP, [Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					onClick: (n) => V(t).effectAction("toggle", e.id)
				}, I(e.disabled ? "Enable" : "Disable"), 9, TP), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					"aria-label": `Delete ${e.name}`,
					onClick: (n) => V(t).effectAction("delete", e.id)
				}, " Delete ", 8, EP)])])
			]))), 128))])])])) : Q("", !0)
		], 8, _P)) : Q("", !0)], 64))), 128))], 64));
	}
}), OP = { class: "app:flex app:items-center app:gap-3" }, kP = ["disabled"], AP = { class: "dui-avatar" }, jP = { class: "app:w-20" }, MP = ["src"], NP = { class: "app:min-w-0 app:flex-1" }, PP = ["disabled"], FP = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, IP = {
	class: "dui-tabs dui-tabs-border",
	role: "tablist",
	"aria-label": "Species Item"
}, LP = [
	"id",
	"aria-selected",
	"aria-controls"
], RP = [
	"id",
	"aria-selected",
	"aria-controls"
], zP = [
	"id",
	"aria-selected",
	"aria-controls"
], BP = { class: "app:min-h-0 app:min-w-0 app:flex-1 app:overflow-y-auto" }, VP = ["id", "aria-labelledby"], HP = ["id", "aria-labelledby"], UP = ["id", "aria-labelledby"], WP = { class: "app:flex app:flex-wrap app:items-center app:gap-2" }, GP = ["disabled"], KP = ["disabled"], qP = {
	class: "app:text-sm",
	role: "status"
}, JP = /* @__PURE__ */ U({
	__name: "SpeciesItemApp",
	props: {
		uuid: {},
		editable: { type: Boolean },
		bridge: {}
	},
	setup(e) {
		let t = e, n = Kj(t.uuid);
		return n.configure(t.bridge), (t, r) => (K(), q("form", {
			class: "app:flex app:h-full app:min-w-0 app:flex-col app:gap-2",
			onSubmit: r[6] ||= Ju((e) => V(n).save(), ["prevent"])
		}, [
			Y("header", OP, [Y("button", {
				type: "button",
				class: "dui-btn dui-btn-outline app:h-auto",
				"aria-label": "Choose Species image",
				disabled: !e.editable || V(n).isSaving,
				onClick: r[0] ||= (e) => V(n).chooseImage()
			}, [Y("div", AP, [Y("div", jP, [Y("img", {
				src: V(n).draft.img,
				alt: "Species image",
				width: "80",
				height: "80",
				class: "app:object-contain"
			}, null, 8, MP)])])], 8, kP), Y("label", NP, [r[7] ||= Y("span", { class: "app:sr-only" }, "Name", -1), ts(Y("input", {
				"onUpdate:modelValue": r[1] ||= (e) => V(n).draft.name = e,
				"aria-label": "Species name",
				class: "dui-input dui-input-ghost app:w-full app:text-center app:text-xl",
				disabled: !e.editable || !V(n).isLoaded || V(n).isSaving,
				required: ""
			}, null, 8, PP), [[zu, V(n).draft.name]])])]),
			V(n).error ? (K(), q("div", FP, I(V(n).error), 1)) : Q("", !0),
			Y("div", IP, [
				Y("button", {
					id: `${e.uuid}-description-tab`,
					type: "button",
					role: "tab",
					class: F(["dui-tab app:flex-1", { "dui-tab-active": V(n).tab === "description" }]),
					"aria-selected": V(n).tab === "description",
					"aria-controls": `${e.uuid}-description-panel`,
					onClick: r[2] ||= (e) => V(n).tab = "description"
				}, " Description ", 10, LP),
				Y("button", {
					id: `${e.uuid}-details-tab`,
					type: "button",
					role: "tab",
					class: F(["dui-tab app:flex-1", { "dui-tab-active": V(n).tab === "details" }]),
					"aria-selected": V(n).tab === "details",
					"aria-controls": `${e.uuid}-details-panel`,
					onClick: r[3] ||= (e) => V(n).tab = "details"
				}, " Details ", 10, RP),
				Y("button", {
					id: `${e.uuid}-effects-tab`,
					type: "button",
					role: "tab",
					class: F(["dui-tab app:flex-1", { "dui-tab-active": V(n).tab === "effects" }]),
					"aria-selected": V(n).tab === "effects",
					"aria-controls": `${e.uuid}-effects-panel`,
					onClick: r[4] ||= (e) => V(n).tab = "effects"
				}, " Effects ", 10, zP)
			]),
			Y("div", BP, [
				ts(Y("section", {
					id: `${e.uuid}-description-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-description-tab`
				}, [V(n).isLoaded ? (K(), J(VM, {
					key: V(n).revision,
					uuid: e.uuid,
					editable: e.editable
				}, null, 8, ["uuid", "editable"])) : Q("", !0)], 8, VP), [[ou, V(n).tab === "description"]]),
				ts(Y("section", {
					id: `${e.uuid}-details-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-details-tab`
				}, [X(RM, {
					uuid: e.uuid,
					editable: e.editable && V(n).isLoaded && !V(n).isSaving
				}, null, 8, ["uuid", "editable"])], 8, HP), [[ou, V(n).tab === "details"]]),
				ts(Y("section", {
					id: `${e.uuid}-effects-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-effects-tab`
				}, [X(DP, {
					uuid: e.uuid,
					editable: e.editable && V(n).isLoaded && !V(n).isSaving
				}, null, 8, ["uuid", "editable"])], 8, UP), [[ou, V(n).tab === "effects"]])
			]),
			Y("footer", WP, [
				Y("button", {
					type: "submit",
					class: "dui-btn dui-btn-sm dui-btn-primary",
					disabled: !e.editable || !V(n).isLoaded || V(n).isSaving
				}, " Save Item ", 8, GP),
				Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					disabled: V(n).isSaving,
					onClick: r[5] ||= (e) => V(n).reload()
				}, " Reload Item ", 8, KP),
				Y("span", qP, I(V(n).dirty ? "Unsaved changes" : V(n).message || "Saved"), 1)
			])
		], 32));
	}
});
//#endregion
//#region src/module/wfrp/species-item/editing.ts
function YP(e) {
	return (e.effects?.contents ?? []).map((e) => {
		let t = e.toObject(), n = p(t.system) ? t.system : {}, r = p(n.transferData) ? n.transferData : {};
		return {
			id: e.id,
			name: e.name,
			disabled: t.disabled === !0,
			temporary: e.isTemporary === !0,
			type: typeof r.type == "string" ? r.type : ""
		};
	});
}
async function XP(e, t, n) {
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
function ZP(e, t) {
	new foundry.applications.apps.FilePicker.implementation({
		type: "image",
		current: e,
		callback: t
	}).render(!0);
}
//#endregion
//#region src/module/wfrp/species-item/notes.ts
function QP(e) {
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
async function $P(e) {
	if (!e.uuid && !e.id) return null;
	let t = Be(e, Ue()) ?? (e.uuid ? await fromUuid(e.uuid) : void 0);
	if (!p(t) || typeof t.type != "string" || !ue({ type: t.type }) || typeof t.toObject != "function") throw Error("The parent Species Item could not be resolved.");
	let n = t.toObject.call(t);
	if (!p(n)) throw Error("The parent Species Item has no source data.");
	return fe(n.system);
}
//#endregion
//#region src/module/wfrp/species-item/bridge.ts
function eF(e) {
	let t = "", n = QP(e), r = () => {
		let n = de(e);
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
			let t = await fromUuid(e), n = p(t) ? t.sheet : void 0;
			if (p(n) && typeof n.render == "function") n.render.call(n, !0);
			else throw Error("The referenced document could not be opened.");
		},
		effects: () => YP(e),
		effectAction: (t, n) => XP(e, t, n),
		chooseImage: ZP,
		mountNotes: n.mount,
		load: r,
		loadParent: $P,
		async save(n) {
			if (t !== JSON.stringify(e.toObject())) throw Error("This Item changed in another window. Reload its sheet before saving.");
			return await Ge(e, n), r();
		},
		async resolveDrop(e) {
			let t = JSON.parse(e), n = p(t) ? t.uuid : void 0;
			if (typeof n != "string") throw Error("Drop a Species, Skill, Talent, or RollTable document.");
			let r = await fromUuid(n);
			if (!p(r) || typeof r.uuid != "string" || typeof r.id != "string" || typeof r.name != "string") throw Error("The dropped document could not be resolved.");
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
var tF = class extends foundry.applications.api.DocumentSheetV2 {
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
	#e = new zw();
	async _renderHTML(e, t) {
		return this.#e.createRoot();
	}
	_replaceHTML(e, t, n) {
		this.#e.mount(e, t, JP, {
			uuid: this.document.uuid,
			editable: this.isEditable && game.user?.isGM === !0,
			bridge: eF(this.document)
		});
	}
	async _preClose(e) {
		this.#e.unmount(), await super._preClose(e);
	}
};
//#endregion
//#region src/module/init/species-sheet.ts
function nF() {
	foundry.applications.apps.DocumentSheetConfig.registerSheet(Item, e, tF, {
		types: [le],
		makeDefault: !0,
		label: "Species Customizer"
	});
}
//#endregion
//#region src/module/wfrp/species-builder/items/model.ts
function rF() {
	let e = CONFIG.Item.dataModels.species;
	if (e) {
		CONFIG.Item.dataModels[le] = e;
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
				characteristics: new e.SchemaField(Object.fromEntries(Object.values(S).map((t) => [t, new e.SchemaField({
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
	CONFIG.Item.dataModels[le] = n;
}
//#endregion
//#region src/module/foundry/debug/shape-inspector/constants.ts
var iF = `${e}.debugShapeProbes`, aF = "wfrp4eCustomizerShapeProbes", oF = "wfrp4eCustomizerShapePreset";
//#endregion
//#region src/module/foundry/debug/shape-inspector/utils.ts
function sF(e, t, n) {
	let r = Number(e);
	return Number.isFinite(r) ? Math.max(0, Math.min(n, Math.floor(r))) : t;
}
function cF(e) {
	return typeof e == "object" && !!e;
}
function lF(e) {
	return typeof e == "string" ? e.trim().toLocaleLowerCase() : "";
}
function uF(e) {
	try {
		return localStorage.getItem(e);
	} catch {
		return null;
	}
}
//#endregion
//#region src/module/foundry/debug/shape-inspector/path-resolver.ts
function dF(e) {
	let t = _F(e), n = fF(globalThis, t.root);
	for (let e of t.tokens) {
		if (e.type === "property") {
			n = fF(n, e.key);
			continue;
		}
		if (e.type === "index") {
			n = fF(n, String(e.index));
			continue;
		}
		n = pF(n, e.name, e.args);
	}
	return n;
}
function fF(e, t) {
	if (!(!cF(e) && typeof e != "function")) try {
		return e[t];
	} catch {
		return;
	}
}
function pF(e, t, n) {
	if (t === "at") {
		let t = Number(n[0] ?? 0), r = Number.isFinite(t) ? t : 0;
		return vF(e).at(r);
	}
	if (t === "findByName") {
		let t = lF(n[0] ?? "");
		return vF(e).find((e) => lF(fF(e, "name")) === t);
	}
	if (t === "findByType") {
		let t = lF(n[0] ?? "");
		return vF(e).find((e) => lF(fF(e, "type")) === t);
	}
	if (t === "get") {
		let t = n[0] ?? "";
		if (e instanceof Map) return e.get(t);
		let r = fF(e, "get");
		if (typeof r == "function") return r.call(e, t);
	}
	if (t === "sample") {
		let t = sF(n[0], 3, 60);
		return vF(e).slice(0, t);
	}
	throw Error(`Unsupported path method "${t}".`);
}
function mF(e) {
	return e.trim() ? e.split(",").map((e) => gF(e.trim())).map(String) : [];
}
function hF(e) {
	let t = e.trim();
	return /^-?\d+$/.test(t) ? Number(t) : gF(t);
}
function gF(e) {
	let t = /^["'](?<value>.*)["']$/.exec(e);
	return t?.groups ? t.groups.value ?? "" : e;
}
function _F(e) {
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
				args: mF(e.groups.args ?? ""),
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
				index: hF(e),
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
function vF(e) {
	if (Array.isArray(e)) return e;
	let t = fF(e, "contents");
	return Array.isArray(t) ? t : [];
}
//#endregion
//#region src/module/foundry/debug/shape-inspector/presets.ts
var yF = { "npc-builder": [
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
//#region src/module/foundry/debug/shape-inspector/probe-config.ts
function bF() {
	return window.location.href.includes("wfrp4eCustomizerShapeProbes") || window.location.href.includes("wfrp4eCustomizerShapePreset");
}
function xF(e) {
	let t = {
		hook: e.hook ?? "ready",
		maxDepth: sF(e.maxDepth, 2, 6),
		maxEntries: sF(e.maxEntries, 12, 60),
		path: e.path.trim()
	};
	return e.label && (t.label = e.label), t;
}
function SF() {
	return [...CF(), ...wF()].map(xF);
}
function CF() {
	let e = uF(iF);
	if (!e) return [];
	try {
		let t = JSON.parse(e);
		return Array.isArray(t) ? t.filter(EF).map(xF) : [];
	} catch {
		return [];
	}
}
function wF() {
	let e = [], t = [new URLSearchParams(window.location.search), new URLSearchParams(window.location.hash.replace(/^#/, ""))];
	for (let n of t) {
		let t = n.get(oF), r = n.get(aF);
		t && e.push(...yF[t] ?? []), r && e.push(...TF(r));
	}
	return window.location.href.includes("wfrp4eCustomizerShapePreset=npc-builder") && !e.length && e.push(...yF["npc-builder"] ?? []), e;
}
function TF(t) {
	try {
		let e = JSON.parse(decodeURIComponent(t));
		return Array.isArray(e) ? e.filter(EF) : [];
	} catch (t) {
		return qr(`${e} | Could not parse URL shape probes.`, t), [];
	}
}
function EF(e) {
	return typeof e != "object" || !e ? !1 : "path" in e && typeof e.path == "string";
}
//#endregion
//#region src/module/foundry/debug/shape-inspector/summary.ts
function DF(e, t) {
	return !cF(e) && typeof e != "function" ? MF(e) : typeof e == "function" ? AF(e) : Array.isArray(e) ? OF(e, t) : e instanceof Map ? kF(e, t) : jF(e, t);
}
function OF(e, t) {
	return {
		length: e.length,
		sample: e.slice(0, t.maxEntries).map((e) => DF(e, PF(t))),
		type: "array"
	};
}
function kF(e, t) {
	return {
		sample: [...e.entries()].slice(0, t.maxEntries).map(([e, n]) => ({
			key: DF(e, PF(t)),
			value: DF(n, PF(t))
		})),
		size: e.size,
		type: "Map"
	};
}
function AF(e) {
	return {
		name: e.name,
		type: "function"
	};
}
function jF(e, t) {
	if (t.seen.has(e)) return { type: "circular" };
	t.seen.add(e);
	let n = NF(e, t.maxEntries), r = fF(e, "constructor"), i = {
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
		let n = fF(e, t);
		typeof n == "string" && (i[t] = n);
	}
	if (t.maxDepth <= 0) return i;
	let a = {};
	for (let r of n) a[r] = DF(fF(e, r), PF(t));
	i.properties = a;
	let o = fF(e, "toObject");
	if (typeof o == "function") try {
		i.source = DF(o.call(e), PF(t));
	} catch (e) {
		i.source = {
			error: e instanceof Error ? e.message : String(e),
			type: "error"
		};
	}
	return i;
}
function MF(e) {
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
function NF(e, t) {
	return Object.keys(e).sort().slice(0, t);
}
function PF(e) {
	return {
		maxDepth: e.maxDepth - 1,
		maxEntries: e.maxEntries,
		seen: e.seen
	};
}
//#endregion
//#region src/module/foundry/debug/shape-inspector/index.ts
function FF() {
	localStorage.removeItem(iF), Kr(`${e} | Cleared debug shape probes.`);
}
function IF() {
	return SF();
}
function LF(e, t = {}) {
	let n = BF(e, t);
	return HF(n), n;
}
function RF() {
	let t = SF();
	for (let e of ["init", "setup"]) {
		let n = t.filter((t) => t.hook === e);
		n.length && Hooks.once(e, () => {
			for (let t of n) VF(t, e);
		});
	}
	Hooks.once("ready", () => {
		let t = SF().filter((e) => (e.hook ?? "ready") === "ready");
		bF() && Kr(`${e} | Debug shape ready probes discovered: ${t.length}`, window.location.href);
		for (let e of t) VF(e, "ready");
	});
}
function zF(t) {
	let n = t.map(xF);
	localStorage.setItem(iF, JSON.stringify(n)), Kr(`${e} | Stored ${n.length} debug shape probe(s). Reload Foundry to run init/setup probes.`);
}
function BF(e, t = {}, n) {
	let r = sF(t.maxDepth, 2, 6), i = sF(t.maxEntries, 12, 60), a = dF(e), o = {
		inspectedAt: (/* @__PURE__ */ new Date()).toISOString(),
		label: t.label || e,
		maxDepth: r,
		maxEntries: i,
		path: e,
		value: DF(a, {
			maxDepth: r,
			maxEntries: i,
			seen: /* @__PURE__ */ new WeakSet()
		})
	};
	return n && (o.hook = n), o;
}
function VF(t, n) {
	try {
		HF(BF(t.path, t, n));
	} catch (n) {
		qr(`${e} | Debug shape probe failed for "${t.path}".`, n);
	}
}
function HF(t) {
	Kr(`${e} | Debug shape probe: ${t.label}`, JSON.stringify(t, null, 2));
}
//#endregion
//#region src/module/apps/daisy-example/view/DaisyExampleApp.vue?vue&type=script&setup=true&lang.ts
var UF = { class: "dui-list" }, WF = /* @__PURE__ */ U({
	__name: "DaisyExampleApp",
	setup(e) {
		let t = [
			"button",
			"badge",
			"card",
			"alert"
		];
		return (e, n) => (K(), J(gN, {
			description: "A quick visual check of the module's isolated Daisy component theme.",
			title: "Daisy Probe"
		}, {
			header: H(() => [...n[0] ||= [Y("span", { class: "dui-badge dui-badge-primary" }, "Scoped", -1), Y("span", { class: "dui-badge dui-badge-outline" }, "Foundry-safe", -1)]]),
			actions: H(() => [...n[1] ||= [Y("span", { class: "dui-badge dui-badge-success" }, "Ready", -1)]]),
			default: H(() => [n[2] ||= Y("div", { class: "dui-alert dui-alert-info" }, [Y("span", null, "DaisyUI is available inside this Vue application root.")], -1), Y("ul", UF, [(K(), q(G, null, W(t, (e) => Y("li", {
				key: e,
				class: "dui-list-row"
			}, I(e), 1)), 64))])]),
			_: 1
		}));
	}
}), GF = class extends Bw {
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${e}-daisy-example`,
		classes: [e, "wfrp4e-customizer-daisy-example"],
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
		return WF;
	}
}, KF = { class: "dui-list" }, qF = { class: "dui-list-row" }, JF = { class: "dui-list-row" }, YF = { class: "dui-list-row" }, XF = { class: "dui-list-row" }, ZF = /* @__PURE__ */ U({
	__name: "WorkbenchApp",
	props: {
		openDaisyProbe: { type: Function },
		openNpcBuilder: { type: Function },
		openEffectBuilders: { type: Function },
		openSpeciesTableEditor: { type: Function }
	},
	setup(e) {
		return (t, n) => (K(), J(gN, {
			description: "Open a focused WFRP4e authoring workflow.",
			title: "Customizer Workbench"
		}, {
			default: H(() => [Y("ul", KF, [
				Y("li", qF, [n[4] ||= Y("div", { class: "dui-list-col-grow" }, [Y("strong", null, "NPC Builder"), Y("p", null, "Build an NPC from a base Actor, Careers, traits, trappings, and spells.")], -1), Y("button", {
					"aria-label": "Open NPC Builder",
					class: "dui-btn dui-btn-primary",
					type: "button",
					onClick: n[0] ||= (...t) => e.openNpcBuilder && e.openNpcBuilder(...t)
				}, " Open ")]),
				Y("li", JF, [n[5] ||= Y("div", { class: "dui-list-col-grow" }, [Y("strong", null, "Effect Builders"), Y("p", null, "Create wound formulas, Item grants, random grants, and player choices as effects.")], -1), Y("button", {
					"aria-label": "Open Effect Builders",
					class: "dui-btn",
					type: "button",
					onClick: n[1] ||= (...t) => e.openEffectBuilders && e.openEffectBuilders(...t)
				}, " Open ")]),
				Y("li", YF, [n[6] ||= Y("div", { class: "dui-list-col-grow" }, [Y("strong", null, "Species Table Editor"), Y("p", null, "Drop Species Items into the world's species roll table and adjust their chances.")], -1), Y("button", {
					"aria-label": "Open Species Table Editor",
					class: "dui-btn",
					type: "button",
					onClick: n[2] ||= (...t) => e.openSpeciesTableEditor && e.openSpeciesTableEditor(...t)
				}, " Open ")]),
				Y("li", XF, [n[7] ||= Y("div", { class: "dui-list-col-grow" }, [Y("strong", null, "DaisyUI Probe"), Y("p", null, "Check the module's scoped component theme.")], -1), Y("button", {
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
//#region src/module/apps/species-table/functions/draft.ts
function QF(e, t) {
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
function $F(e, t) {
	let n = Ln(e, t, !0);
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
function eI(e) {
	return Fd(`species-table:${e}`, () => {
		let e = /* @__PURE__ */ B({
			...Fn(),
			rows: []
		}), t = /* @__PURE__ */ B([]), n = /* @__PURE__ */ B(""), r = /* @__PURE__ */ B(!1), i = /* @__PURE__ */ B(!1), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(""), s = /* @__PURE__ */ B(!0), c = /* @__PURE__ */ B(""), l, u = $(() => $F(e.value, t.value)), d = $(() => Rn(e.value.rows)), f = $(() => e.value.rows.reduce((e, t) => e + Number(t.weight || 0), 0)), p = $(() => t.value.filter((t) => !e.value.rows.some((e) => e.speciesKey === t.key))), m = $(() => i.value && !r.value && !u.value.length);
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
				QF(e.value, r);
				let i = t.value.findIndex((e) => e.key === r.option.key);
				i === -1 ? t.value.push(r.option) : t.value[i] = r.option, o.value = r.message;
			});
		}
		async function b() {
			let n = t.value.find((e) => e.key === c.value);
			n && (n.itemUuid ? await y(JSON.stringify({ uuid: n.itemUuid })) : QF(e.value, {
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
	})(Ew);
}
//#endregion
//#region src/module/apps/species-table/view/SpeciesTableRows.vue?vue&type=script&setup=true&lang.ts
var tI = { class: "dui-fieldset app:min-w-0" }, nI = { class: "app:max-w-full app:overflow-x-auto" }, rI = { class: "dui-table dui-table-sm" }, iI = { scope: "row" }, aI = { class: "app:sr-only" }, oI = ["onUpdate:modelValue", "aria-label"], sI = ["aria-label", "onClick"], cI = { key: 0 }, lI = /* @__PURE__ */ U({
	__name: "SpeciesTableRows",
	props: { id: {} },
	setup(e) {
		let t = eI(e.id), n = new Intl.NumberFormat(void 0, {
			style: "percent",
			maximumFractionDigits: 2
		});
		return (e, r) => (K(), q("fieldset", tI, [
			r[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Roll weights", -1),
			r[2] ||= Y("p", null, "A species with weight 2 is twice as likely as one with weight 1.", -1),
			Y("div", nI, [Y("table", rI, [
				Y("caption", null, " Species chances · " + I(V(t).problems.length ? "Finish the entries to calculate a valid roll" : `Roll 1d${V(t).total}`), 1),
				r[0] ||= Y("thead", null, [Y("tr", null, [
					Y("th", { scope: "col" }, "Species"),
					Y("th", { scope: "col" }, "Weight"),
					Y("th", { scope: "col" }, "Chance"),
					Y("th", { scope: "col" }, "Range"),
					Y("th", { scope: "col" }, "Actions")
				])], -1),
				Y("tbody", null, [(K(!0), q(G, null, W(V(t).draft.rows, (e, r) => (K(), q("tr", { key: e.speciesKey || e.resultId || r }, [
					Y("th", iI, I(e.name || "Unassigned species"), 1),
					Y("td", null, [Y("label", null, [Y("span", aI, "Weight for " + I(e.name), 1), ts(Y("input", {
						"onUpdate:modelValue": (t) => e.weight = t,
						"aria-label": `Weight for ${e.name}`,
						class: "dui-input dui-input-sm app:w-20",
						type: "number",
						min: "1",
						step: "1"
					}, null, 8, oI), [[
						zu,
						e.weight,
						void 0,
						{ number: !0 }
					]])])]),
					Y("td", null, I(V(t).problems.length ? "—" : V(n).format(V(t).summaries[r].chance)), 1),
					Y("td", null, I(V(t).problems.length ? "—" : V(t).summaries[r].range.join("–")), 1),
					Y("td", null, [Y("button", {
						type: "button",
						class: "dui-btn dui-btn-ghost dui-btn-sm",
						"aria-label": `Remove ${e.name}`,
						onClick: (e) => V(t).remove(r)
					}, " Remove ", 8, sI)])
				]))), 128))])
			])]),
			V(t).draft.rows.length ? Q("", !0) : (K(), q("p", cI, "Add a species or drop a Species Item to start."))
		]));
	}
}), uI = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, dI = {
	key: 1,
	class: "dui-alert dui-alert-info",
	role: "status"
}, fI = {
	key: 2,
	role: "status"
}, pI = ["disabled"], mI = ["for"], hI = ["id"], gI = { key: 0 }, _I = { key: 1 }, vI = ["for"], yI = { class: "app:flex app:flex-wrap app:gap-2" }, bI = ["id"], xI = ["value"], SI = ["disabled"], CI = {
	key: 2,
	class: "dui-label"
}, wI = {
	key: 4,
	class: "dui-list",
	"aria-label": "Before saving"
}, TI = ["disabled"], EI = ["disabled"], DI = ["disabled"], OI = /* @__PURE__ */ U({
	__name: "SpeciesTableApp",
	props: {
		id: {},
		bridge: {},
		close: { type: Function }
	},
	setup(e) {
		let t = e, n = eI(t.id);
		return n.configure(t.bridge), js(() => n.load()), (t, r) => (K(), J(gN, {
			title: "Species Table Editor",
			description: "Choose which species can be rolled during character creation, and how often."
		}, {
			actions: H(() => [
				Y("button", {
					type: "button",
					class: "dui-btn dui-btn-primary",
					disabled: !V(n).ready,
					onClick: r[4] ||= (...e) => V(n).save && V(n).save(...e)
				}, " Save table ", 8, TI),
				Y("button", {
					type: "button",
					class: "dui-btn",
					disabled: V(n).busy,
					onClick: r[5] ||= (...e) => V(n).load && V(n).load(...e)
				}, " Reload saved table ", 8, EI),
				Y("button", {
					type: "button",
					class: "dui-btn dui-btn-ghost",
					disabled: V(n).busy,
					onClick: r[6] ||= (...t) => e.close && e.close(...t)
				}, " Close ", 8, DI)
			]),
			default: H(() => [
				V(n).error ? (K(), q("div", uI, I(V(n).error), 1)) : Q("", !0),
				V(n).message ? (K(), q("div", dI, I(V(n).message), 1)) : Q("", !0),
				V(n).busy ? (K(), q("p", fI, "Working…")) : Q("", !0),
				V(n).loaded ? (K(), q("fieldset", {
					key: 3,
					class: "dui-fieldset app:min-w-0",
					disabled: V(n).busy
				}, [
					Y("label", {
						for: `${e.id}-name`,
						class: "dui-label"
					}, "Table name", 8, mI),
					ts(Y("input", {
						id: `${e.id}-name`,
						"onUpdate:modelValue": r[0] ||= (e) => V(n).draft.name = e,
						"aria-label": "Table name",
						class: "dui-input app:w-full"
					}, null, 8, hI), [[zu, V(n).draft.name]]),
					V(n).draft.ownership === "external" ? (K(), q("p", gI, " Saving creates a Customizer copy of this table. The source table is preserved. ")) : V(n).draft.isRegistered ? (K(), q("p", _I, "This is the world's active Species table.")) : Q("", !0),
					X(Xy, {
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
					}, "Add an available species", 8, vI),
					Y("div", yI, [ts(Y("select", {
						id: `${e.id}-species`,
						"onUpdate:modelValue": r[1] ||= (e) => V(n).selected = e,
						"aria-label": "Add an available species",
						class: "dui-select app:max-w-full"
					}, [r[7] ||= Y("option", { value: "" }, "Choose a species…", -1), (K(!0), q(G, null, W(V(n).available, (e) => (K(), q("option", {
						key: e.key,
						value: e.key
					}, I(e.label), 9, xI))), 128))], 8, bI), [[Hu, V(n).selected]]), Y("button", {
						type: "button",
						class: "dui-btn",
						disabled: !V(n).selected,
						onClick: r[2] ||= (...e) => V(n).addSelected && V(n).addSelected(...e)
					}, " Add species ", 8, SI)]),
					X(lI, { id: e.id }, null, 8, ["id"]),
					!V(n).draft.isRegistered || V(n).draft.ownership === "external" ? (K(), q("label", CI, [ts(Y("input", {
						"onUpdate:modelValue": r[3] ||= (e) => V(n).register = e,
						type: "checkbox",
						class: "dui-checkbox"
					}, null, 512), [[Bu, V(n).register]]), r[8] ||= Z(" Use this table for the world's species rolls ", -1)])) : Q("", !0)
				], 8, pI)) : Q("", !0),
				V(n).loaded && V(n).problems.length ? (K(), q("ul", wI, [(K(!0), q(G, null, W(V(n).problems, (e) => (K(), q("li", { key: e }, I(e), 1))), 128))])) : Q("", !0)
			]),
			_: 1
		}));
	}
}), kI = "species", AI = "tableSettings";
async function jI(e) {
	let t = e ? { definitions: [] } : await We(), n = new Set(t.definitions.map((e) => e.key)), r = MI().filter((e) => !n.has(e.key)), i = e ?? In(r, t.definitions), a = game.tables?.contents ?? [], o = NI(), s = PI(a, a.filter(rr), o);
	return {
		draft: s ? FI(s, i, o[0] === s.id) : RI(),
		runtimeOptions: r
	};
}
function MI() {
	let e = game.wfrp4e?.config?.species;
	return p(e) ? Object.entries(e).flatMap(([e, t]) => {
		let n = typeof t == "string" ? t.trim() : "";
		return e.trim() && n ? [{
			key: e.trim(),
			label: n
		}] : [];
	}) : [];
}
function NI() {
	let e = game.settings.get(n, AI), t = p(e) ? e[kI] : void 0;
	return typeof t == "string" ? t.split(",").map((e) => e.trim()).filter(Boolean) : [];
}
function PI(e, t, r) {
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
	return e.find((e) => e.getFlag(n, "key") === kI);
}
function FI(e, t, n) {
	let r = e.toObject(), i = (Array.isArray(r.results) ? r.results : []).flatMap((e) => II(e, t));
	return i.sort((e, t) => LI(e.source) - LI(t.source)), {
		isRegistered: n,
		name: e.name,
		ownership: rr(e) ? "managed" : "external",
		requiresLinkRepair: i.some((e) => e.requiresLinkRepair),
		rows: i.map(({ row: e }) => e),
		tableId: e.id
	};
}
function II(e, t) {
	if (!p(e)) return [];
	let r = h(e, ["name"]), i = Bn(h(e, ["description"])), a = h(e, [
		"flags",
		n,
		"species"
	]), o = h(e, ["documentUuid"]), s = i?.label || r, c = zn(a, s, t), l = h(e, ["_id"]), u = h(e, ["type"]);
	return [{
		requiresLinkRepair: u === "document" ? !o : !i || i.label !== r.trim() || u !== "text",
		row: {
			...o || i ? { journalUuid: o || i.uuid } : {},
			name: s,
			...l ? { resultId: l } : {},
			speciesKey: c,
			weight: Vn(e)
		},
		source: e
	}];
}
function LI(e) {
	let t = m(e, ["range"]), n = Array.isArray(t) ? Number(t[0]) : 0;
	return Number.isInteger(n) ? n : 0;
}
function RI() {
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
var zI = !1;
function BI(e) {
	return JSON.stringify({
		table: e ? game.tables?.get(e)?.toObject() : null,
		settings: game.settings.get("wfrp4e", "tableSettings")
	});
}
async function VI() {
	gn();
	let e = _n(), { draft: t } = await jI(e), n = [];
	for (let r of t.rows) {
		let t = r.journalUuid;
		if (t && (t.startsWith("Item.") || t.includes(".Item.") || r.speciesKey.startsWith("item:"))) {
			let i = await yn(t), a = {
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
		revision: BI(t.tableId)
	};
}
async function HI(e) {
	if ((await VI()).revision !== e) throw Error("The world's Species table or table settings changed. Reload the editor before saving.");
}
async function UI(e) {
	let t = _n();
	for (let n of e.rows) {
		if (!n.itemUuid) continue;
		let e = await xn(JSON.stringify({ uuid: n.itemUuid }));
		if (e.option.key !== n.speciesKey || e.option.label !== n.name) throw Error(`${n.name} changed. Reload the editor and drop the updated Species Item again.`);
		t.some((t) => t.key === e.option.key) || t.push(e.option);
	}
	let n = $F(e, t);
	if (n.length) throw Error(n.join("\n"));
}
async function WI(e, t, n) {
	if (gn(), zI) throw Error("Another Species table save is in progress. Try again when it finishes.");
	zI = !0;
	try {
		await HI(t), await UI(e);
		let r = structuredClone(e);
		for (let e of r.rows) {
			if (!e.itemUuid) continue;
			let t = await yn(e.itemUuid);
			e.speciesKey = `item:${t.uuid}`, e.itemUuid = t.uuid, e.journalUuid = t.uuid, e.name = t.name;
		}
		await HI(t);
		let i = _n();
		for (let e of r.rows) e.itemUuid && !i.some((t) => t.key === e.speciesKey) && i.push({
			key: e.speciesKey,
			label: e.name,
			itemUuid: e.itemUuid
		});
		let a = $F(r, i);
		if (a.length) throw Error(a.join("\n"));
		let o = await tr(r), s;
		if (n) try {
			await nr(o.id);
		} catch (e) {
			s = e instanceof Error ? e.message : String(e);
		}
		return {
			...await VI(),
			...s ? { registrationError: s } : {}
		};
	} finally {
		zI = !1;
	}
}
var GI = {
	load: VI,
	resolveDrop: xn,
	save: WI
}, KI = 0, qI = class extends Bw {
	storeId;
	constructor() {
		let t = `${e}-species-table-${++KI}`;
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
		return OI;
	}
	getVueProps() {
		return {
			id: this.storeId,
			bridge: GI,
			close: () => this.close()
		};
	}
	async _preClose(e) {
		let t = eI(this.storeId);
		await super._preClose(e), t.$dispose(), delete Ew.state.value[`species-table:${this.storeId}`];
	}
};
async function JI() {
	gn(), await new qI().render(!0);
}
//#endregion
//#region src/module/apps/workbench/view/WorkbenchApplication.ts
var YI = class extends Bw {
	static DEFAULT_OPTIONS = {
		...super.DEFAULT_OPTIONS,
		id: `${e}-workbench`,
		classes: [e, "wfrp4e-customizer-workbench"],
		position: {
			height: 530,
			width: 640
		},
		window: {
			icon: "fa-solid fa-screwdriver-wrench",
			title: t
		}
	};
	getVueComponent() {
		return ZF;
	}
	getVueProps() {
		return {
			openDaisyProbe: () => new GF().render(!0),
			openNpcBuilder: () => new xk().render(!0),
			openEffectBuilders: uP,
			openSpeciesTableEditor: JI
		};
	}
};
//#endregion
//#region src/module/foundry/register-module-menus.ts
function XI() {
	game.settings.registerMenu(e, "workbench", {
		hint: `Open the ${t} workbench.`,
		icon: "fa-solid fa-screwdriver-wrench",
		label: "Open Workbench",
		name: t,
		restricted: !0,
		type: YI
	}), game.settings.registerMenu(e, "npc-builder", {
		hint: "Build a WFRP4e NPC from a base Actor and Career items.",
		icon: "fa-solid fa-user-plus",
		label: "Open NPC Builder",
		name: "WFRP4e NPC Builder",
		restricted: !0,
		type: xk
	}), game.settings.registerMenu(e, "effect-builders", {
		hint: "Create native WFRP effects on your Items.",
		icon: "fa-solid fa-wand-magic-sparkles",
		label: "Open Effect Builders",
		name: "Effect Builders",
		restricted: !1,
		type: lP
	}), game.settings.registerMenu(e, "daisy-example", {
		hint: "Open a small isolated DaisyUI component probe.",
		icon: "fa-solid fa-flask",
		label: "Open Daisy Probe",
		name: "WFRP4e Daisy Probe",
		restricted: !0,
		type: GF
	});
}
//#endregion
//#region src/module/functions/species-builder/career-table-normalization.ts
function ZI(e) {
	if (!p(e)) return;
	let t = QI(e.rows) ?? $I(e.careers);
	return t ? { rows: t } : void 0;
}
function QI(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap((e) => {
		if (!p(e)) return [];
		let t = tL(e.name);
		if (!t) return [];
		let n = { name: t };
		return k(n, "journalUuid", tL(e.journalUuid)), [n];
	});
	return t.length > 0 ? t : void 0;
}
function $I(e) {
	return eL(e)?.map((e) => ({ name: e }));
}
function eL(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap((e) => {
		let t = tL(e);
		return t ? [t] : [];
	});
	return t.length > 0 ? t : void 0;
}
function tL(e) {
	if (typeof e == "string") return e.trim() || void 0;
}
//#endregion
//#region src/module/functions/species-builder/replacement-row-normalization.ts
function nL(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap((e) => {
		if (!p(e)) return [];
		let t = iL(e.rolled, "talent"), n = iL(e.replacement, "talent");
		return !t.name || !n.name ? [] : [{
			replacement: n,
			rolled: t
		}];
	});
	return t.length > 0 ? t : void 0;
}
function rL(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap((e) => {
		if (!p(e)) return [];
		let t = iL(e.rolled, "career"), n = Array.isArray(e.replacements) ? e.replacements.flatMap((e) => {
			let t = iL(e, "career");
			return t.name ? [t] : [];
		}) : [];
		return !t.name || n.length === 0 ? [] : [{
			replacements: n,
			rolled: t
		}];
	});
	return t.length > 0 ? t : void 0;
}
function iL(e, t) {
	if (typeof e == "string") return { name: sL(e) ?? "" };
	if (!p(e)) return { name: "" };
	let n = aL(e.item, t), r = sL(e.name) ?? n?.name ?? "";
	return n ? {
		item: n,
		name: r
	} : { name: r };
}
function aL(e, t) {
	if (!p(e)) return;
	let n = sL(e.name), r = oL(e.type), i = sL(e.uuid);
	if (!n || r !== t || !i) return;
	let a = {
		name: n,
		type: r,
		uuid: i
	}, o = sL(e.specification) ?? sL(e.specifier);
	o && (a.specification = o);
	let s = sL(e.img);
	return s && (a.img = s), a;
}
function oL(e) {
	return e === "career" || e === "skill" || e === "talent" || e === "trait" ? e : void 0;
}
function sL(e) {
	if (typeof e == "string") return e.trim() || void 0;
}
//#endregion
//#region src/module/functions/species-builder/linked-grant-normalization.ts
function cL(e, t) {
	if (!Array.isArray(e)) return;
	let n = e.flatMap((e) => {
		let n = iL(e, t);
		return n.name ? [n] : [];
	});
	return n.length > 0 ? n : void 0;
}
function lL(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap((e) => {
		if (!p(e) || !Array.isArray(e.choices)) return [];
		let t = e.choices.flatMap((e) => {
			let t = iL(e, "talent");
			return t.name ? [t] : [];
		});
		return t.length > 0 ? [{ choices: t }] : [];
	});
	return t.length > 0 ? t : void 0;
}
//#endregion
//#region src/module/functions/species-builder/config-keys.ts
function uL(e) {
	return e.trim().toLocaleLowerCase().replaceAll(/[^\da-z]+/g, "-").replaceAll(/^-+|-+$/g, "");
}
//#endregion
//#region src/module/functions/species-builder/settings-normalization/values.ts
var dL = Object.values(S);
function fL(e) {
	return typeof e == "string" ? uL(e) : "";
}
function pL(e) {
	if (typeof e == "string") return e.trim() || void 0;
}
function mL(e) {
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function hL(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap((e) => {
		let t = pL(e);
		return t ? [t] : [];
	});
	return t.length > 0 ? t : void 0;
}
function gL(e) {
	if (!p(e)) return;
	let t = Object.entries(e).flatMap(([e, t]) => {
		let n = pL(e), r = pL(t);
		return n && r ? [[n, r]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : void 0;
}
function _L(e) {
	if (!p(e)) return;
	let t = Object.entries(e).flatMap(([e, t]) => {
		let n = pL(e), r = mL(t);
		return n && r !== void 0 ? [[n, r]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : void 0;
}
function vL(e) {
	if (!p(e)) return;
	let t = Object.entries(e).flatMap(([e, t]) => {
		let n = pL(e), r = hL(t);
		return n && r ? [[n, r]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : void 0;
}
function yL(e) {
	if (!p(e)) return;
	let t = dL.flatMap((t) => {
		let n = pL(e[t]);
		return n ? [[t, n]] : [];
	});
	return t.length > 0 ? Object.fromEntries(t) : void 0;
}
function bL(e) {
	if (!p(e)) return;
	let t = {};
	return k(t, "die", pL(e.die)), k(t, "feet", mL(e.feet)), k(t, "inches", mL(e.inches)), Object.keys(t).length > 0 ? t : void 0;
}
function xL(e) {
	if (!p(e)) return;
	let t = pL(e.formula);
	return t ? { formula: t } : void 0;
}
//#endregion
//#region src/module/functions/species-builder/species-settings-normalization.ts
function SL(e) {
	return !p(e) || !Array.isArray(e.definitions) ? {
		autoRegisterSpeciesTable: !1,
		correctExistingWfrpSpecies: !1,
		definitions: [],
		runtimeSpeciesExtensions: [],
		showGeneratedConfigTab: !1
	} : {
		autoRegisterSpeciesTable: e.autoRegisterSpeciesTable === !0,
		correctExistingWfrpSpecies: e.correctExistingWfrpSpecies === !0,
		definitions: e.definitions.flatMap(wL),
		runtimeSpeciesExtensions: CL(e.runtimeSpeciesExtensions),
		showGeneratedConfigTab: e.showGeneratedConfigTab === !0
	};
}
function CL(e) {
	return Array.isArray(e) ? e.flatMap((e) => {
		if (!p(e)) return [];
		let t = pL(e.speciesKey), n = pL(e.speciesName), r = TL(e.subspecies) ?? [];
		return t && n && r.length > 0 ? [{
			speciesKey: t,
			speciesName: n,
			subspecies: r
		}] : [];
	}) : [];
}
function wL(e) {
	return DL(e, (e, t, n) => ({
		includeInExtraSpecies: n.includeInExtraSpecies === !0,
		key: e,
		name: t
	})).map((t) => (OL(t, e), kL(t, e), t));
}
function TL(e) {
	if (!Array.isArray(e)) return;
	let t = e.flatMap(EL);
	return t.length > 0 ? t : void 0;
}
function EL(e) {
	return DL(e, (e, t, n) => {
		let r = {
			key: e,
			name: t
		};
		return k(r, "skillsAdded", hL(n.skillsAdded)), k(r, "skillsRemoved", hL(n.skillsRemoved)), k(r, "talentsAdded", hL(n.talentsAdded)), k(r, "talentsRemoved", hL(n.talentsRemoved)), k(r, "traitsAdded", hL(n.traitsAdded)), k(r, "traitsRemoved", hL(n.traitsRemoved)), r;
	});
}
function DL(e, t) {
	if (!p(e)) return [];
	let n = fL(e.key), r = pL(e.name);
	if (!n || !r) return [];
	let i = t(n, r, e);
	return k(i, "characteristics", yL(e.characteristics)), k(i, "randomTalents", _L(e.randomTalents)), k(i, "talentReplacementRows", nL(e.talentReplacementRows)), k(i, "talentReplacements", gL(e.talentReplacements)), k(i, "movement", mL(e.movement)), k(i, "fate", mL(e.fate)), k(i, "resilience", mL(e.resilience)), k(i, "extra", mL(e.extra)), k(i, "woundFormula", xL(e.woundFormula)), k(i, "careerTable", ZI(e.careerTable)), [i];
}
function OL(e, t) {
	p(t) && (k(e, "skills", hL(t.skills)), k(e, "linkedSkills", cL(t.linkedSkills, "skill")), k(e, "talents", hL(t.talents)), k(e, "linkedTalents", lL(t.linkedTalents)), k(e, "traits", hL(t.traits)), k(e, "linkedTraits", cL(t.linkedTraits, "trait")));
}
function kL(e, t) {
	p(t) && (k(e, "age", pL(t.age)), k(e, "height", bL(t.height)), k(e, "careerReplacements", vL(t.careerReplacements)), k(e, "careerReplacementRows", rL(t.careerReplacementRows)), k(e, "subspecies", TL(t.subspecies)));
}
//#endregion
//#region src/module/wfrp/species-builder/settings.ts
var AL = LE({
	defaultValue: Oe(),
	key: "speciesBuilderSettings",
	name: "Species Builder Settings",
	normalize: SL
});
function jL() {
	RE(AL);
}
//#endregion
//#region src/module/foundry/register-module-settings.ts
function ML() {
	HE(), jL(), pr();
}
//#endregion
//#region src/module/wfrp/item-effect-drops.ts
var NL = new Set(["talent", "trait"]), PL = /* @__PURE__ */ new WeakSet(), FL = !1, IL = "wfrp4e-customizer-grant-builder-button", LL = [
	"section[data-application-part=\"effects\"].active",
	"section[data-tab=\"effects\"].active",
	".tab[data-tab=\"effects\"].active",
	".tab.effects.active"
].join(","), RL = [
	"section[data-application-part=\"effects\"]",
	"section[data-tab=\"effects\"]",
	".tab[data-tab=\"effects\"]",
	".tab.effects"
].join(",");
function zL() {
	FL || (FL = !0, Hooks.on("renderApplicationV2", (e, t) => {
		if (!(t instanceof HTMLElement)) return;
		let n = UL(e);
		!n || !NL.has(n.type) || (BL(n, t), VL(n, t));
	}));
}
function BL(e, t) {
	PL.has(t) || (PL.add(t), t.addEventListener("dragover", (e) => {
		WL(t, e.target) && (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"));
	}, !0), t.addEventListener("drop", (n) => {
		HL(e, t, n);
	}, !0));
}
function VL(e, t) {
	if (t.querySelector(`.${IL}`)) return;
	let n = KL(t, { includeInactive: !0 });
	if (!n) return;
	let r = document.createElement("div");
	r.classList.add("wfrp4e-customizer-grant-builder-toolbar");
	let i = document.createElement("button");
	i.type = "button", i.classList.add(IL), i.title = "Open Effect Builders for this Item", i.innerHTML = "<i class=\"fa-solid fa-sitemap\" aria-hidden=\"true\"></i><span>Effect Builders</span>", i.addEventListener("click", () => {
		uP(e.uuid);
	}), r.append(i), n.prepend(r);
}
async function HL(t, n, r) {
	if (!WL(n, r.target)) return;
	let i = HM(r);
	if (i) {
		r.preventDefault(), r.stopPropagation();
		try {
			let n = await UM(i);
			if (n.uuid === t.uuid) throw Error("An Item cannot grant itself.");
			let r = WM(n), a = tN({
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
function UL(e) {
	if (typeof e != "object" || !e) return null;
	let t = "item" in e ? e.item : void 0;
	if (fn(t)) return t;
	let n = "document" in e ? e.document : void 0;
	return fn(n) ? n : null;
}
function WL(e, t) {
	return !(t instanceof Element) || !e.contains(t) ? !1 : !!GL(e);
}
function GL(e) {
	return e.querySelector(LL) || KL(e, { includeInactive: !1 });
}
function KL(e, t) {
	return [...e.querySelectorAll(RL)].find((e) => t.includeInactive || e.offsetParent !== null) ?? null;
}
//#endregion
//#region src/module/foundry/api/create-module-api.ts
function qL() {
	return {
		clearDebugShapeProbes: FF,
		estimateNpcXp: SA,
		getDebugShapeProbes: IF,
		inspectPath: LF,
		listNpcAutoAdvanceStrategies: eh,
		openActorPortraitGallery: Zk,
		async openDaisyExample() {
			await new GF().render(!0);
		},
		async openNpcBuilder() {
			await new xk().render(!0);
		},
		createBuiltEffect: eP,
		openEffectBuilders: uP,
		openWoundFormulaEffectBuilder: fP,
		openItemGrantEffectBuilder: pP,
		openRandomItemEffectBuilder: mP,
		openItemChoiceEffectBuilder: hP,
		openSpeciesTableEditor: JI,
		speciesTable: GI,
		async openWorkbench() {
			await new YI().render(!0);
		},
		selectChargenSpecies: wr,
		registerNpcAutoAdvanceStrategy: $m,
		setDebugShapeProbes: zF
	};
}
//#endregion
//#region src/module/foundry/api/register-module-api.ts
function JL() {
	if (!game) throw Error("Foundry game global is unavailable during module API registration.");
	let t = game.modules.get(e);
	if (!t) throw Error(`Foundry module registry entry was not found for ${e}.`);
	t.api = qL();
}
//#endregion
//#region src/module/init/register-hooks.ts
function YL() {
	RF(), Hooks.once("init", () => {
		Kr(`${e} | Initializing`), ML(), game.system.id === "wfrp4e" && (Wj(), rF(), nF(), Gr(), iA(), OA(), qe() || (QA(), Sr()), zL()), XI(), Ck();
	}), Hooks.once("setup", i), Hooks.once("ready", () => {
		if (game.system.id !== "wfrp4e") {
			qr(`${e} | Loaded outside ${n}; skipping module API registration.`);
			return;
		}
		return XL();
	});
}
async function XL() {
	await Promise.resolve();
	try {
		await Je(), await Gj([]);
	} catch (t) {
		let n = t instanceof Error ? t.message : "Unknown runtime adaptation error.";
		throw qr(`${e} | Runtime species catalog could not be prepared: ${n}`), ui.notifications?.error(`Customizer initialization failed: ${n}`), t;
	}
	try {
		await f();
	} catch (t) {
		let n = t instanceof Error ? t.message : String(t);
		qr(`${e} | Compendium tidy failed: ${n}`), ui.notifications?.error(`Compendium folders could not be restored: ${n}`);
	}
	JL(), mr(), sT().catch(() => {
		ui.notifications?.error("Career indexing failed. Adding a Career will retry the index.");
	}), TT(), Kr(`${e} | Ready`);
}
//#endregion
//#region src/module/init/index.ts
YL();
//#endregion

//# sourceMappingURL=wfrp4e-customizer-apps.mjs.map
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
	let n = new Set(Array.from(e.packs, (e) => `${t}.${e}`));
	for (let r of e.folders) for (let e of s(r, t)) n.add(e);
	return n;
}
function c(e, t, n, r) {
	let i = o(e, t), a = !1;
	for (let [e, t] of n.entries()) if (!(!t.folder || !i.has(t.folder.id))) {
		if (!r.has(e)) return !1;
		a = !0;
	}
	return a;
}
function l(e, t, n, r) {
	let i = o(t, n);
	for (let [t, n] of r.entries()) if (n.folder && i.has(n.folder.id) && !t.startsWith(`${e}.`)) return !0;
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
		let u = r.color === void 0 ? void 0 : r.color?.toString() ?? null, f = s(r, e), p = a.filter((e) => e.name === r.name && (e.folder?.id ?? null) === (i?.id ?? null));
		if (p.length > 1) throw Error(`Ambiguous Compendium folder named ${r.name} under ${i?.name ?? "root"}.`);
		let m = p[0];
		if (m && l("wfrp4e-customizer-apps", m, a, t.packs)) throw Error(`Compendium folder ${r.name} contains another package's packs.`);
		if (!m) {
			let e = a.filter((e) => e.name === r.name && c(e, a, t.packs, f));
			if (e.length > 1) throw Error(`Ambiguous displaced Compendium folder named ${r.name}.`);
			if (m = e[0], m) {
				if (i && o(m, a).has(i.id)) throw Error(`Moving ${r.name} under ${i.name} would make a folder cycle.`);
				let e = i?.id ?? null;
				if (await m.update({ folder: e }) === void 0 && (m.folder?.id ?? null) !== e) throw Error(`Could not move Compendium folder ${r.name}; the update was not applied.`);
			} else {
				if (m = await n({
					name: r.name,
					type: "Compendium",
					folder: i?.id ?? null,
					sorting: r.sorting,
					...u ? { color: u } : {}
				}), !m) throw Error(`Could not create Compendium folder ${r.name}.`);
				a.push(m);
			}
		}
		let h = {};
		if (m.sorting !== r.sorting && (h.sorting = r.sorting), u !== void 0 && (m.color?.toString() ?? null) !== u && (h.color = u), Object.keys(h).length > 0 && await m.update(h) === void 0 && (m.sorting !== r.sorting || u !== void 0 && (m.color?.toString() ?? null) !== u)) throw Error(`Could not configure Compendium folder ${r.name}; the update was not applied.`);
		for (let n of r.packs) {
			let r = `${e}.${n}`, i = t.packs.get(r);
			if (!i) throw Error(`Declared Compendium ${r} was not found.`);
			i.folder?.id !== m.id && await i.setFolder(m);
		}
		for (let e of r.folders) await d(e, m);
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
//#region src/module/functions/species-item/reference-names.ts
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
//#region src/module/functions/species-item/system.ts
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
//#region src/module/wfrp/species-item/documents/effect-sources.ts
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
//#region src/module/wfrp/species-item/documents/adapter.ts
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
//#region src/module/wfrp/species-item/documents/repository.ts
function be() {
	return (game.items?.contents ?? []).filter(ue);
}
async function xe(e, t) {
	Se();
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
function Se() {
	if (!game.user?.isGM) throw Error("Only a GM can change world Species Items through the Customizer.");
}
//#endregion
//#region src/module/wfrp/species-item/documents/migration.ts
function Ce() {
	return typeof CONFIG.Item.dataModels.species == "function";
}
async function we() {
	if (!Ce() || !game.user?.isGM || game.users?.activeGM && game.users.activeGM.id !== game.user.id) return 0;
	let e = 0, t = game.actors.contents.flatMap((e) => e.items?.contents ?? []), n = [...be(), ...t];
	for (let t of n.filter((e) => e.type === le)) await t.update({ type: "species" }), e += 1;
	return e;
}
//#endregion
//#region src/module/functions/species-chargen/config.ts
function Te(e, t, n, r) {
	let { system: i } = t, a = {
		species: { [e]: t.name },
		speciesSkills: { [e]: [...i.skills.list] },
		speciesTalents: { [e]: D(i.talents.choices).map((e) => e.choices.map((e) => e.name).join(", ")) }
	}, o = se(i);
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
function Ee(e) {
	let t = {};
	for (let n of e) {
		if (n.disabled === !0) continue;
		let e = p(n.system) ? n.system : {}, r = p(e.transferData) ? e.transferData : {};
		if (r.type !== "document" || r.documentType !== "Actor") continue;
		let i = e.changes ?? n.changes;
		if (Array.isArray(i)) for (let e of i) {
			if (!p(e)) continue;
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
function De(e, t) {
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
//#region src/module/wfrp/species-chargen/tables.ts
var Oe = /* @__PURE__ */ new Map(), ke = !1;
function Ae(e, t) {
	return `${e.toLowerCase()}|${t ?? ""}`;
}
function je() {
	if (ke) return;
	let e = game.wfrp4e?.tables;
	if (!e?.findTable) throw Error("WFRP table lookup is unavailable.");
	let t = e.findTable;
	e.findTable = function(e, n) {
		return Oe.get(Ae(e, n)) ?? t.call(this, e, n);
	}, ke = !0;
}
async function Me(e) {
	if (!e.uuid && !e.id) return;
	let t = De(e, game.tables?.contents ?? []) ?? await fromUuid(e.uuid || `RollTable.${e.id}`);
	if (!p(t) || t.documentName !== "RollTable") throw Error(`Cannot resolve Species RollTable ${e.name || e.uuid || e.id}.`);
	return t;
}
function Ne(e, t, n, r, i) {
	je(), Pe(e), r && Oe.set(Ae("eyes", e), r), i && Oe.set(Ae("hair", e), i), t && Oe.set(Ae("career", e), t), n && Oe.set(Ae(`${e}-talents`), n);
}
function Pe(e) {
	Oe.delete(Ae("eyes", e)), Oe.delete(Ae("hair", e)), Oe.delete(Ae("career", e)), Oe.delete(Ae(`${e}-talents`));
}
//#endregion
//#region src/module/wfrp/species-chargen/config.ts
var Fe = 0, Ie = "customizer-chargen-";
function Le() {
	return `${Ie}${++Fe}`;
}
async function Re(e, t) {
	let n = game.wfrp4e?.config;
	if (!n) throw Error("WFRP species config is unavailable.");
	let { record: r } = t, i = Ee(r.effects);
	for (let [e, t] of Object.entries(i)) if (!Roll.validate(t)) throw Error(`Invalid Species ${e} formula: ${t}`);
	let [a, o, s, c] = await Promise.all([
		Me(r.system.tables.career),
		Me(r.system.tables.talents),
		Me(r.system.tables.eye),
		Me(r.system.tables.hair)
	]), l = Te(e, r, i, o ? `${e}-talents` : "talents");
	ze(e);
	for (let [t, r] of Object.entries(l)) if (p(r) && Object.hasOwn(r, e)) {
		let i = p(n[t]) ? n[t] : n[t] = {};
		i[e] = r[e];
	}
	Ne(e, a, o, s, c);
}
function ze(e) {
	let t = game.wfrp4e?.config;
	for (let [n, r] of Object.entries(t ?? {})) (n.startsWith("species") || n === "subspecies") && p(r) && delete r[e];
	Pe(e);
}
//#endregion
//#region src/module/functions/species-item/inheritance.ts
function Be(e, t) {
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
//#endregion
//#region src/module/functions/species-chargen/selection.ts
function Ve(e, t) {
	let n = structuredClone(e);
	if (!t) return n;
	n.system = Be(e.system, t.system);
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
function He(e) {
	if (typeof e.documentUuid == "string" && e.documentUuid) return e.documentUuid;
	let t = typeof e.description == "string" ? e.description : "";
	return /@UUID\[([^\]]+)\]/u.exec(t)?.[1];
}
function Ue(e) {
	return e.startsWith("Item.") || e.startsWith("Compendium.") && e.includes(".Item.");
}
//#endregion
//#region src/module/functions/species-chargen/roll-bonus.ts
function We(e, t) {
	return [...new Set([
		e,
		h(t, ["_stats", "compendiumSource"]),
		h(t, [
			"flags",
			"core",
			"sourceId"
		])
	].filter(Ue))];
}
function Ge(e, t) {
	if (!e) return 0;
	let n = e.identity?.self ?? We(e.uuid, e.source), r = e.identity?.parent ?? [e.record.system.subspeciesOf.uuid];
	return [...n, ...r].some((e) => e && t.includes(e)) ? 20 : 0;
}
//#endregion
//#region src/module/functions/species-item/identity.ts
function Ke(e) {
	return !!(e.system.subspeciesOf.uuid || e.system.subspeciesOf.id);
}
//#endregion
//#region src/module/foundry/document-guards.ts
function qe(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Actor";
}
function Je(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Item";
}
function Ye(e, t = "Expected a Foundry Actor.") {
	if (!qe(e)) throw Error(t);
	return e;
}
function Xe(e, t = "Expected a Foundry Item.") {
	if (!Je(e)) throw Error(t);
	return e;
}
function Ze(e, t, n = `Expected a Foundry ${t} Item.`) {
	let r = Xe(e, n);
	if (r.type !== t) throw Error(n);
	return r;
}
//#endregion
//#region src/module/wfrp/species-table/items.ts
function Qe() {
	if (!game.user?.isGM) throw Error("Only a GM can edit the world's Species table.");
}
function $e() {
	let e = game.wfrp4e?.config?.species, t = [];
	if (p(e)) for (let [n, r] of Object.entries(e)) !n.startsWith("customizer-chargen-") && typeof r == "string" && r.trim() && t.push({
		key: n,
		label: r
	});
	for (let e of be()) t.push({
		key: `item:${e.uuid}`,
		label: e.name,
		itemUuid: e.uuid
	});
	return t.sort((e, t) => e.label.localeCompare(t.label));
}
async function et(e) {
	let t = be(), n = De(e, t), r = Xe(n ?? await fromUuid(e.uuid || `Item.${e.id}`), `Species Item “${e.name || e.uuid || e.id}” is unavailable.`), i = n ?? De({
		uuid: r.uuid,
		id: r.id,
		name: r.name
	}, t) ?? r;
	if (!ue(i)) throw Error("Drop a Species Item into this editor.");
	if (game.user && !game.user.isGM && !i.testUserPermission(game.user, "OBSERVER")) throw Error(`You do not have permission to read ${i.name}.`);
	if (!i.compendium && !be().some((e) => e.uuid === i.uuid)) throw Error("Use a world or compendium Species Item, rather than an Item on an Actor.");
	return i;
}
async function tt(e) {
	return et({
		uuid: e,
		id: "",
		name: ""
	});
}
async function nt(e) {
	let t = await tt(e), n = de(t);
	if (!Ke(n)) return [t];
	let r = await et(n.system.subspeciesOf);
	if (Ke(de(r))) throw Error(`${t.name}: nested or cyclic subspecies cannot be used by WFRP's current Species table.`);
	return [r, t];
}
async function rt(e) {
	Qe();
	let t = JSON.parse(e);
	if (!p(t) || typeof t.uuid != "string") throw Error("Drop a Species Item or enter its UUID.");
	let n = await nt(t.uuid), r = n[n.length - 1];
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
function it(e, t) {
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
async function at(e) {
	let t = await nt(e), n = t[t.length - 1], r = t.length > 1 ? de(t[0]) : void 0, i = Ve(de(n), r), a = it(n, i);
	return {
		uuid: n.uuid,
		record: i,
		source: a,
		identity: {
			self: [...new Set([e, ...We(n.uuid, n.toObject())])],
			parent: t.length > 1 ? We(t[0].uuid, t[0].toObject()) : []
		}
	};
}
//#endregion
//#region src/module/wfrp/species-chargen/session.ts
var ot = class {
	app;
	key = Le();
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
		let t = await at(e);
		if (!this.closed) {
			if (await Re(this.key, t), this.closed) {
				ze(this.key);
				return;
			}
			this.selection = t;
		}
	}
	useLegacy() {
		this.assertUnlocked(), this.selection = void 0, ze(this.key);
	}
	commit() {
		let e = this.app.data;
		this.selection ? (e.customizerSpecies = {
			...e.customizerSpecies,
			selection: this.selection
		}, e.items.species = [new Item(structuredClone(this.selection.source))], e.misc["system.details.species.value"] = this.selection.record.name, e.misc["system.details.species.subspecies"] = "") : (delete e.customizerSpecies?.selection, delete e.items.species, delete e.misc["system.details.species.value"], delete e.misc["system.details.species.subspecies"]);
	}
	dispose() {
		this.closed = !0, ze(this.key);
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
		if (await Re(this.key, n), this.closed) return this.dispose();
		this.selection = n, this.app.data.species = this.key, this.app.data.subspecies = "", this.commit();
	}
};
//#endregion
//#region src/module/foundry/application-element.ts
function st(e) {
	let t = e instanceof HTMLElement ? e : p(e) ? e[0] : void 0;
	return t instanceof HTMLElement ? t : void 0;
}
//#endregion
//#region src/module/functions/species-chargen/preview.ts
function ct(e) {
	let { system: t } = e;
	return {
		characteristics: se(t),
		movement: t.movement ?? void 0,
		fate: t.fate ?? void 0,
		resilience: t.resilience ?? void 0,
		extra: t.extra ?? void 0,
		skills: t.skills.list.map(lt),
		talents: D(t.talents.choices).map((e) => e.choices.map((e) => lt(e.name)).join(" or ")),
		randomTalents: [{
			name: e.system.tables.talents.name || "Talents",
			count: e.system.talents.random ?? 0
		}]
	};
}
function lt(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
//#endregion
//#region src/module/wfrp/species-chargen/table-policy.ts
function ut(e) {
	return e.type === "document" && typeof e.documentUuid == "string" && e.documentUuid ? e.documentUuid : void 0;
}
function dt() {
	return game.wfrp4e?.tables?.findTable?.("species");
}
async function ft(e) {
	let t = {}, n = (e) => ({
		valid: !1,
		choices: {},
		reason: e
	});
	if (!p(e) || e.documentName !== "RollTable" || typeof e.toObject != "function") return n("No usable Species table is configured.");
	let r = e.toObject(), i = p(r) ? r.results : void 0;
	if (!Array.isArray(i) || !i.length) return n("The Species table is empty.");
	for (let e of i) {
		let r = p(e) ? ut(e) : void 0;
		if (!r) return n("Every Species table result must be a Species Item document result.");
		try {
			let e = await fromUuid(r);
			if (!Je(e) || !ue(e) || e.actor) return n("Every Species table result must link a world or compendium Species Item.");
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
async function pt() {
	return ft(dt());
}
//#endregion
//#region src/module/wfrp/species-chargen/choices.ts
var mt = ut;
async function ht() {
	let e = dt(), t = await pt();
	if (!t.valid) throw Error(t.reason);
	if (dt() !== e) throw Error("The Species table changed. Try again.");
	let n = game.wfrp4e?.tables;
	if (!n?.rollTable) throw Error("WFRP Species table rolling is unavailable.");
	let r = await n.rollTable("species");
	if (!p(r) || !p(r.object)) throw Error("The Species table did not return a result.");
	let i = ut(r.object);
	if (!i || !t.choices[`item:${i}`]) throw Error("The rolled result is not one of the table's Species Items.");
	return r;
}
//#endregion
//#region src/module/functions/species-table/source.ts
var gt = "managedSpeciesTable";
function _t() {
	return {
		isRegistered: !1,
		name: "Species",
		ownership: "new",
		requiresLinkRepair: !1,
		rows: []
	};
}
function vt(e, t, n) {
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
function yt(e) {
	let t = e.map((e) => Number.isInteger(e.weight) && e.weight > 0 ? e.weight : 0), n = t.reduce((e, t) => e + t, 0), r = 1;
	return t.map((e) => {
		let t = r, i = e > 0 ? t + e - 1 : t;
		return r = i + 1, {
			chance: n > 0 ? e / n : 0,
			range: [t, i]
		};
	});
}
function bt(e, t, n) {
	let r = n.find((e) => e.label === t.trim());
	if (r) return r.key;
	let i = e.trim();
	return n.some((e) => e.key === i) ? i : "";
}
function xt(e) {
	let t = /@UUID\[([^\]]+)\]\{([^}]*)\}/u.exec(e), n = t?.[1]?.trim() ?? "", r = t?.[2]?.trim() ?? "";
	return n && r ? {
		label: r,
		uuid: n
	} : void 0;
}
function St(e) {
	let t = m(e, ["range"]), n = Array.isArray(t) ? Number(t[0]) : 0, r = Array.isArray(t) ? Number(t[1]) : 0;
	if (Number.isInteger(n) && Number.isInteger(r) && r >= n) return r - n + 1;
	let i = Number(m(e, ["weight"]));
	return Number.isInteger(i) && i > 0 ? i : 1;
}
function Ct(e, t) {
	let n = yt(e.rows), r = e.rows.reduce((e, t) => e + (Number.isInteger(t.weight) && t.weight > 0 ? t.weight : 0), 0);
	return {
		displayRoll: !0,
		flags: {
			wfrp4e: { key: "species" },
			[t]: { [gt]: !0 }
		},
		formula: `1d${Math.max(r, 1)}`,
		img: "systems/wfrp4e/ui/buttons/d10.webp",
		name: Tt(e),
		replacement: !0,
		results: e.rows.map((e, t) => ({
			description: wt(e),
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
function wt(e) {
	let t = e.journalUuid?.trim() ?? "", n = e.name.trim();
	if (!t) throw Error(`Species "${n || e.speciesKey}" does not have a document link target.`);
	if (/[{}]/u.test(n)) throw Error(`Species "${n}" cannot be encoded in WFRP's UUID-link label.`);
	return `@UUID[${t}]{${n}}`;
}
function Tt(e) {
	let t = e.name.trim() || "Species";
	return e.ownership === "external" && !t.endsWith("(Customizer)") ? `${t} (Customizer)` : t;
}
//#endregion
//#region src/module/foundry/roll-table-results.ts
async function Et(e, t) {
	t.updates.length > 0 && await e.updateEmbeddedDocuments("TableResult", t.updates), t.creates.length > 0 && await e.createEmbeddedDocuments("TableResult", t.creates), t.deletedIds.length > 0 && await e.deleteEmbeddedDocuments("TableResult", t.deletedIds);
}
//#endregion
//#region src/module/wfrp/species-table/documents/journals.ts
var Dt = "generatedSpeciesJournal", Ot = "WFRP Customizer Species Journals";
async function kt(t) {
	let n = game.journal?.contents ?? [], r = At(n), i, a = [];
	for (let o of t.rows) {
		let t = jt(o.journalUuid, o.speciesKey, n) || r.get(o.speciesKey)?.uuid;
		if (!t) {
			i ??= await Nt();
			let n = await JournalEntry.create({
				flags: { [e]: { [Dt]: { speciesKey: o.speciesKey } } },
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
function At(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = Mt(n);
		if (e) {
			if (t.has(e)) throw Error(`Multiple Species Builder Journals exist for "${e}". Remove the duplicate and retry.`);
			t.set(e, n);
		}
	}
	return t;
}
function jt(e, t, n) {
	let r = e?.trim() ?? "";
	if (!r) return "";
	let i = n.find((e) => e.uuid === r);
	if (!i) return r.startsWith("JournalEntry.") && r.split(".").length === 2 ? "" : r;
	let a = Mt(i);
	return a && a !== t ? "" : r;
}
function Mt(t) {
	let n = t.getFlag(e, Dt);
	return p(n) ? h(n, ["speciesKey"]).trim() : "";
}
async function Nt() {
	let e = game.folders.contents.find((e) => e.type === "JournalEntry" && e.name === Ot);
	if (e) return e;
	let t = await Folder.create({
		name: Ot,
		type: "JournalEntry"
	});
	if (!t) throw Error("Foundry did not create the generated Species Journal folder.");
	return t;
}
//#endregion
//#region src/module/wfrp/species-table/documents/persistence.ts
var Pt = "species", Ft = "tableSettings";
async function It(t) {
	let n = await kt(t), r = Ct(n, e);
	return t.ownership === "managed" ? await Bt(n, r) : await zt(n, r);
}
async function Lt(e) {
	let t = game.settings.get(n, Ft);
	if (!p(t)) throw Error("WFRP table settings are unavailable; the Species table was not registered.");
	await game.settings.set(n, Ft, {
		...t,
		[Pt]: e
	});
}
function Rt(t) {
	return t.getFlag(e, gt) === !0;
}
async function zt(e, t) {
	if (e.ownership === "external") {
		let t = e.tableId ? game.tables?.get(e.tableId) : void 0;
		if (!t || Rt(t)) throw Error("The source Species table changed. Reload before saving a managed copy.");
	}
	if ((game.tables?.contents ?? []).some(Rt)) throw Error("A managed Species table already exists. Reload before saving.");
	let n = await RollTable.create(t);
	if (!n) throw Error("Foundry did not create the managed Species table.");
	return n;
}
async function Bt(t, r) {
	let i = t.tableId ? game.tables?.get(t.tableId) : void 0;
	if (!i || !Rt(i)) throw Error("The managed Species table changed. Reload before saving again.");
	let a = Array.isArray(r.results) ? r.results.filter(p) : [];
	return await i.update({
		displayRoll: r.displayRoll,
		[`flags.${e}.${gt}`]: !0,
		[`flags.${n}.key`]: Pt,
		formula: r.formula,
		name: r.name,
		replacement: r.replacement
	}), await Vt(i, t.rows, a), i;
}
async function Vt(e, t, n) {
	let r = e.toObject(), i = Array.isArray(r.results) ? r.results.filter(p) : [], a = new Set(i.map((e) => h(e, ["_id"]))), o = /* @__PURE__ */ new Set(), s = [], c = [];
	n.forEach((e, n) => {
		let r = Ht(t[n], i, a, o);
		r ? (o.add(r), s.push({
			...e,
			_id: r
		})) : c.push(e);
	}), await Et(e, {
		creates: c,
		deletedIds: [...a].filter((e) => e && !o.has(e)),
		updates: s
	});
}
function Ht(e, t, n, r) {
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
var Ut = "Compendium.wfrp4e-customizer-apps.species-tables.RollTable.a341d269e7805bc2";
async function Wt() {
	if (!game.user?.isGM) throw Error("Only a GM can change the configured Species table.");
	if ((await pt()).valid) return;
	let e;
	for (let t of game.tables?.contents ?? []) {
		let n = t.toObject(), r = h(n, ["_stats", "compendiumSource"]), i = h(n, [
			"flags",
			"core",
			"sourceId"
		]);
		if (!(r !== "Compendium.wfrp4e-customizer-apps.species-tables.RollTable.a341d269e7805bc2" && i !== "Compendium.wfrp4e-customizer-apps.species-tables.RollTable.a341d269e7805bc2") && (await ft(t)).valid) {
			e = t;
			break;
		}
	}
	if (!e) {
		let t = await fromUuid(Ut), n = await ft(t);
		if (!n.valid || !p(t) || typeof t.toObject != "function") throw Error(`The default Species table is unavailable or invalid. ${n.reason}`);
		let r = t.toObject();
		if (!p(r)) throw Error("The default Species table has no source data.");
		for (let e of [
			"_id",
			"folder",
			"_stats"
		]) delete r[e];
		if (r._stats = { compendiumSource: Ut }, e = await RollTable.create(r) ?? void 0, !e) throw Error("Foundry could not import the default Species table.");
	}
	await Lt(e.id);
}
//#endregion
//#region src/module/wfrp/species-chargen/table-reminder.ts
var Gt = "hideInvalidSpeciesTableReminder", Kt = !1, qt;
function Jt() {
	game.settings.register(e, Gt, {
		name: "Hide invalid Species table reminder",
		scope: "client",
		config: !0,
		type: Boolean,
		default: !1
	});
}
function Yt() {
	return qt || (!game.user?.isGM || Ce() || Kt || game.settings.get("wfrp4e-customizer-apps", "hideInvalidSpeciesTableReminder") === !0 || game.users?.activeGM && game.users.activeGM.id !== game.user.id ? Promise.resolve(!1) : (qt = Xt().catch((e) => (ui.notifications?.error(e instanceof Error ? e.message : String(e)), !1)).finally(() => {
		qt = void 0;
	}), qt));
}
async function Xt() {
	if ((await pt()).valid) return !1;
	Kt = !0;
	let t = null, n = await foundry.applications.api.DialogV2.wait({
		window: { title: "Species table needs Species Items" },
		content: "<p>Character creation requires a Species table whose results are all Species Items. The current table cannot be used for species rolls.</p><p>Use the supplied default table? It has Human 90%, Halfling 4%, Dwarf 4%, High Elf 1%, and Wood Elf 1%. Your current table will be kept.</p><label><input type=\"checkbox\" name=\"suppress\"> Don’t show this reminder again</label>",
		buttons: [{
			action: "replace",
			label: "Use Default Table",
			callback: (e, t) => Zt(!0, t.form)
		}, {
			action: "later",
			label: "Not Now",
			default: !0,
			callback: (e, t) => Zt(!1, t.form)
		}],
		render: (e, n) => {
			t = n.element.querySelector("form");
		},
		close: () => Zt(!1, t),
		rejectClose: !1
	});
	return n?.suppress && await game.settings.set(e, Gt, !0), n?.replace ? (await Wt(), ui.notifications?.info("Character creation now uses a Species Item table."), !0) : !1;
}
function Zt(e, t) {
	return {
		replace: e,
		suppress: t?.querySelector("[name=\"suppress\"]")?.checked === !0
	};
}
//#endregion
//#region src/module/wfrp/species-chargen/stage.ts
function Qt(e, t) {
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
			let e = await pt();
			this.tableValid = e.valid, this.tableReason = e.reason, !e.valid && !this.reminderStarted && (this.reminderStarted = !0, Yt().then((e) => {
				e && !t.closed && this.render(!0);
			}));
			let n = t.selection?.record;
			return {
				data: this.data,
				context: this.context,
				species: e.choices,
				speciesDisplay: n?.name ?? "",
				...n ? { preview: ct(n) } : {}
			};
		}
		activateListeners(e) {
			super.activateListeners(e);
			let t = st(e);
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
				let e = await pt();
				if (!e.valid || !e.choices[t]) throw Error(e.reason || "Choose a Species Item from the current table.");
				await this.chooseItem(t.slice(5));
			});
		}
		async onRollSpecies(e) {
			e.stopPropagation(), await this.runSelection(async () => {
				if (t.assertUnlocked(), this.context.roll) throw Error("Species has already been rolled for this character.");
				let e = await ht();
				this.context.roll = e;
				let n = mt(e.object);
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
			let e = this.context.roll?.object, n = p(e) ? mt(e) : void 0, r = this.data.customizerSpecies?.rollIdentity ?? (n ? [n] : []);
			this.context.exp = this.context.roll ? Ge(t.selection, r) : 0;
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
var $t = [
	"rollName",
	"rollAge",
	"rollHeight",
	"rollEyes",
	"rollHair",
	"rollMotivation"
];
function en(e, t) {
	if (!e.selection) return;
	let n = e.selection.record.system.keys;
	return (t === "rollName" ? n : [e.key, ...n]).find((e) => {
		if (t === "rollName") {
			let t = game.wfrp4e?.names?.[e];
			return p(t) && typeof t.forename == "function" && typeof t.surname == "function";
		}
		let n = game.wfrp4e?.config?.[t === "rollAge" ? "speciesAge" : "speciesHeight"], r = p(n) ? n[e] : void 0;
		return t === "rollAge" ? typeof r == "string" && !!r.trim() : p(r) && typeof r.die == "string" && typeof r.feet == "number" && typeof r.inches == "number";
	});
}
function tn(e, t) {
	return class extends e {
		generatorContext(e) {
			let n = en(t, e);
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
			let n = st(e);
			if (!n) return;
			let r = !1;
			for (let e of $t) {
				let i = n.querySelector(`[data-type="${e}"]`);
				if (i) {
					if (!(e === "rollName" || e === "rollAge" || e === "rollHeight" ? en(t, e) : e === "rollMotivation" || t.selection?.record.system.tables[e === "rollEyes" ? "eye" : "hair"].uuid || t.selection?.record.system.tables[e === "rollEyes" ? "eye" : "hair"].id)) {
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
var nn = /* @__PURE__ */ new WeakMap();
function rn() {
	Hooks.on("wfrp4e:chargen", (e) => {
		Ce() || an(e);
	});
}
function an(e) {
	if (Ce()) throw Error("The legacy Species bridge is disabled when native Species support is available.");
	if (!p(e) || !Array.isArray(e.stages) || !p(e.data) || typeof e.getData != "function" || typeof e.close != "function") throw Error("WFRP character generation has an unsupported application shape.");
	let t = e, n = t.stages.find((e) => e.key === "species");
	if (!n || typeof n.class != "function") throw Error("WFRP's Species stage is unavailable.");
	if (nn.has(t)) return;
	let r = new ot(t);
	nn.set(t, r), n.class = Qt(n.class, r);
	let i = t.stages.find((e) => e.key === "details");
	i && (i.class = tn(i.class, r));
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
async function on(e, t) {
	an(e);
	let n = e;
	await nn.get(n).ready;
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
function sn(e) {
	let t = {};
	for (let [n, r] of Object.entries(e.characteristics)) r.base !== null && r.dice !== null && (t[`system.characteristics.${n}.initial`] = r.base + r.dice * 5);
	return e.movement !== null && (t["system.details.move.value"] = e.movement), t;
}
function cn(e, t) {
	let n = Object.entries(e.characteristics).filter(([e, n]) => e in t && n.base !== null && n.dice !== null), r = sn(e), i = n.every(([e]) => t[e] === r[`system.characteristics.${e}.initial`]), a = {};
	for (let [e, r] of n) {
		if (!(e in t) || !i && t[e] === 0) continue;
		let n = r.dice, o = n === 0 ? "0" : `${n}d10`, s = i ? "initial" : "modifier";
		a[`system.characteristics.${e}.${s}`] = i ? `${o}+${r.base}` : `${o}-${n * 5}`;
	}
	return a;
}
//#endregion
//#region src/module/wfrp/species-item/actor/profile.ts
function ln(e) {
	let t = e.toObject().system, n = p(t) ? t.characteristics : void 0;
	if (!p(n)) throw Error("This Actor has no characteristics.");
	let r = {};
	for (let [e, t] of Object.entries(n)) p(t) && typeof t.initial == "number" && (r[e] = t.initial);
	return r;
}
function un(e, t) {
	let n = sn(t), r = ln(e);
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
function dn(e) {
	return e.items?.contents.find(ue);
}
async function fn(e) {
	let t = de(e);
	if (e.actor || !Ke(t)) return t;
	let n = de(await et(t.system.subspeciesOf));
	if (Ke(n)) throw Error("Nested Species parents are not supported.");
	return Ve(t, n);
}
//#endregion
//#region src/module/wfrp/species-item/actor/drop.ts
var pn = /* @__PURE__ */ new WeakSet();
async function mn(e, t) {
	if (!e.isOwner) throw Error("You cannot change this Actor's Species.");
	if (!e.items?.contents.some((e) => e.uuid === t.uuid) && !pn.has(e)) {
		if (dn(e)) throw Error("Remove the Actor's existing Species Item before dropping another Species.");
		pn.add(e);
		try {
			if (game.user && !t.testUserPermission(game.user, "OBSERVER")) throw Error(`You do not have permission to read ${t.name}.`);
			let n = await fn(t), r = it(t, n), i = await e.createEmbeddedDocuments("Item", [r]);
			return i.length ? (await foundry.applications.api.DialogV2.confirm({
				window: { title: "Apply Species Characteristics" },
				content: "<p>Apply this Species Item's starting characteristics and Movement?</p><p>This replaces initial characteristic values and Movement. Advances and modifiers are kept. Choosing No keeps your current profile; the Species Item and its effects remain on the Actor.</p>",
				rejectClose: !1
			}) && e.items?.contents.includes(i[0]) && await e.update(un(e, n.system)), i) : void 0;
		} finally {
			pn.delete(e);
		}
	}
}
//#endregion
//#region src/module/wfrp/species-item/actor/grant.ts
async function hn(e, t) {
	let n = game.wfrp4e?.utility, r = t === "skill" ? await n?.findSkill?.(e) : await n?.findTalent?.(e);
	if (!r || r.type !== t) throw Error(`Cannot find ${t} “${e}”.`);
	return r;
}
//#endregion
//#region src/module/wfrp/species-item/actor/talent-table.ts
async function gn(e) {
	let t = await Me(e) ?? game.wfrp4e?.tables?.findTable?.("talents");
	if (!p(t) || typeof t.roll != "function") throw Error("The Species random Talent table is unavailable.");
	let n = await t.roll({ recursive: !0 }), r = p(n) ? n.results : void 0;
	if (!Array.isArray(r) || r.length !== 1) throw Error("The Species Talent table must return one Talent per roll.");
	let i = r[0];
	if (!p(i) || typeof i.toObject != "function") throw Error("The Species Talent table returned an invalid result.");
	let a = i.toObject();
	if (!p(a)) throw Error("The Species Talent result has no data.");
	let o = He(a), s = a.name;
	if (!o && (typeof s != "string" || !s.trim())) throw Error("The Species Talent result has no Item link or Talent name.");
	let c = o ? Xe(await fromUuid(o), "The rolled Talent Item is unavailable.") : await hn(s, "talent");
	if (c.type !== "talent") throw Error("The Species Talent table result is not a Talent.");
	return c;
}
//#endregion
//#region src/module/wfrp/species-item/actor/randomize.ts
async function _n(e, t, n) {
	if (!e.isOwner) throw Error("You cannot change this Actor.");
	let { system: r } = de(t);
	n === "characteristics" ? await vn(e, r) : n === "skills" ? await yn(e, r) : n === "talents" && await bn(e, r);
}
async function vn(e, t) {
	let n = cn(t, ln(e)), r = {};
	for (let [e, t] of Object.entries(n)) r[e] = await xn(t);
	await e.update(r);
}
async function yn(e, t) {
	let n = [...new Set(t.skills.list.filter((e) => e.trim()))];
	if (!n.length) throw Error("This Species Item has no Skills.");
	let r = [];
	for (; r.length < 6 && n.length;) {
		let e = await xn(`1d${n.length}-1`);
		r.push(n.splice(e, 1)[0]);
	}
	let i = [];
	for (let [t, n] of r.entries()) {
		let r = (e.items?.contents.find((e) => e.type === "skill" && e.name === n) ?? await hn(n, "skill")).toObject(), a = r.system;
		if (!p(a) || !p(a.advances)) throw Error(`Skill ${n} has no advances data.`);
		let o = a.advances.value;
		if (typeof o != "number") throw Error(`Skill ${n} has invalid advances.`);
		a.advances.value = Math.max(o, t < 3 ? 5 : 3), i.push(r);
	}
	await e.update({ items: i });
}
async function bn(e, t) {
	let n = D(t.talents.choices), r = [];
	for (let e of n) {
		let t = e.choices[await xn(`1d${e.choices.length}-1`)], n = t.item?.uuid ? Xe(await fromUuid(t.item.uuid), `Talent ${t.name} is unavailable.`) : await hn(t.name, "talent");
		if (n.type !== "talent") throw Error(`${t.name} is not a Talent.`);
		r.push(n.toObject());
	}
	for (let e = 0; e < (t.talents.random ?? 0); e++) r.push((await gn(t.tables.talents)).toObject());
	if (!r.length) throw Error("This Species Item has no Talents.");
	await e.createEmbeddedDocuments("Item", r);
}
async function xn(e) {
	return (await new Roll(e).roll({ allowInteractive: !1 })).total;
}
//#endregion
//#region src/module/wfrp/species-item/actor/integration.ts
var Sn = /* @__PURE__ */ new WeakSet();
function Cn(e) {
	let t = Object.getOwnPropertyDescriptor(e, "Species");
	if (!t?.get) throw Error("WFRP Actor Species getter is unavailable.");
	let n = t.get;
	Object.defineProperty(e, "Species", {
		...t,
		get() {
			return dn(this)?.name ?? n.call(this);
		}
	});
}
function wn(e, t) {
	if (!p(e) || !qe(e.document) || !p(e.options) || !p(e.options.actions) || typeof e._onDropItem != "function") return;
	let n = e;
	if (Sn.has(n) || (Tn(n), Sn.add(n)), !(t instanceof HTMLElement)) return;
	let r = t.querySelector("[data-action='editSpecies']"), i = dn(n.document);
	r && (r.readOnly = !!i), r && i && (r.value = i.name, r.readOnly = !0, r.title = "Species comes from the owned Item. Open it from the sheet header menu to edit.");
}
function Tn(e) {
	let t = e._onDropItem;
	e._onDropItem = async function(e, n) {
		if (!p(e) || typeof e.uuid != "string") return t.call(this, e, n);
		try {
			let t = await fromUuid(e.uuid);
			if (Je(t) && ue(t)) return await mn(this.document, t);
		} catch (e) {
			En(e);
			return;
		}
		return t.call(this, e, n);
	};
	let n = e.options.actions.randomize;
	typeof n == "function" && (e.options.actions.randomize = async function(e, t) {
		let r = dn(this.document);
		if (!r) return n.call(this, e, t);
		let i = t ?? e.target;
		if (i instanceof HTMLElement) try {
			await _n(this.document, r, i.dataset.type ?? "");
		} catch (e) {
			En(e);
		}
	});
}
function En(e) {
	ui.notifications?.error(e instanceof Error ? e.message : String(e));
}
//#endregion
//#region src/module/wfrp/species-item/actor-sheet.ts
function Dn() {
	Ce() || (Hooks.once("setup", () => {
		let e = game.wfrp4e;
		Cn(e.documents.ActorWFRP4e.prototype);
	}), Hooks.on("renderApplicationV2", wn));
	for (let e of [
		"Character",
		"NPC",
		"Creature",
		"Vehicle"
	]) Hooks.on(`getHeaderControlsActorSheetWFRP4e${e}`, (e, t) => {
		if (!p(e) || !Array.isArray(t)) return;
		let n = e.document;
		if (!qe(n)) return;
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
function On(e, ...t) {
	console.info(e, ...t);
}
function kn(e, ...t) {
	console.warn(e, ...t);
}
//#endregion
//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function An(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var k = {}, jn = [], Mn = () => {}, Nn = () => !1, Pn = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Fn = (e) => e.startsWith("onUpdate:"), In = Object.assign, Ln = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, Rn = Object.prototype.hasOwnProperty, A = (e, t) => Rn.call(e, t), j = Array.isArray, zn = (e) => Kn(e) === "[object Map]", Bn = (e) => Kn(e) === "[object Set]", Vn = (e) => Kn(e) === "[object Date]", M = (e) => typeof e == "function", Hn = (e) => typeof e == "string", Un = (e) => typeof e == "symbol", N = (e) => typeof e == "object" && !!e, Wn = (e) => (N(e) || M(e)) && M(e.then) && M(e.catch), Gn = Object.prototype.toString, Kn = (e) => Gn.call(e), qn = (e) => Kn(e).slice(8, -1), Jn = (e) => Kn(e) === "[object Object]", Yn = (e) => Hn(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Xn = /* @__PURE__ */ An(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), Zn = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, Qn = /-\w/g, $n = Zn((e) => e.replace(Qn, (e) => e.slice(1).toUpperCase())), er = /\B([A-Z])/g, tr = Zn((e) => e.replace(er, "-$1").toLowerCase()), nr = Zn((e) => e.charAt(0).toUpperCase() + e.slice(1)), rr = Zn((e) => e ? `on${nr(e)}` : ""), ir = (e, t) => !Object.is(e, t), ar = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, or = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, sr = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, cr, lr = () => cr ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function ur(e) {
	if (j(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = Hn(r) ? mr(r) : ur(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (Hn(e) || N(e)) return e;
}
var dr = /;(?![^(]*\))/g, fr = /:([^]+)/, pr = /\/\*[^]*?\*\//g;
function mr(e) {
	let t = {};
	return e.replace(pr, "").split(dr).forEach((e) => {
		if (e) {
			let n = e.split(fr);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function P(e) {
	let t = "";
	if (Hn(e)) t = e;
	else if (j(e)) for (let n = 0; n < e.length; n++) {
		let r = P(e[n]);
		r && (t += r + " ");
	}
	else if (N(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var hr = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", gr = /* @__PURE__ */ An(hr);
hr + "";
function _r(e) {
	return !!e || e === "";
}
function vr(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = yr(e[r], t[r]);
	return n;
}
function yr(e, t) {
	if (e === t) return !0;
	let n = Vn(e), r = Vn(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = Un(e), r = Un(t), n || r) return e === t;
	if (n = j(e), r = j(t), n || r) return n && r ? vr(e, t) : !1;
	if (n = N(e), r = N(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !yr(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function br(e, t) {
	return e.findIndex((e) => yr(e, t));
}
var xr = (e) => !!(e && e.__v_isRef === !0), F = (e) => Hn(e) ? e : e == null ? "" : j(e) || N(e) && (e.toString === Gn || !M(e.toString)) ? xr(e) ? F(e.value) : JSON.stringify(e, Sr, 2) : String(e), Sr = (e, t) => xr(t) ? Sr(e, t.value) : zn(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Cr(t, r) + " =>"] = n, e), {}) } : Bn(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Cr(e)) } : Un(t) ? Cr(t) : N(t) && !j(t) && !Jn(t) ? String(t) : t, Cr = (e, t = "") => Un(e) ? `Symbol(${e.description ?? t})` : e, wr, Tr = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && wr && (wr.active ? (this.parent = wr, this.index = (wr.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = wr;
			try {
				return wr = this, e();
			} finally {
				wr = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = wr, wr = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (wr === this) wr = this.prevScope;
			else {
				let e = wr;
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
function Er(e) {
	return new Tr(e);
}
function Dr() {
	return wr;
}
function Or(e, t = !1) {
	wr && wr.cleanups.push(e);
}
var I, kr = /* @__PURE__ */ new WeakSet(), Ar = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, wr && (wr.active ? wr.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, kr.has(this) && (kr.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Pr(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, qr(this), Lr(this);
		let e = I, t = Ur;
		I = this, Ur = !0;
		try {
			return this.fn();
		} finally {
			Rr(this), I = e, Ur = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Vr(e);
			this.deps = this.depsTail = void 0, qr(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? kr.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		zr(this) && this.run();
	}
	get dirty() {
		return zr(this);
	}
}, jr = 0, Mr, Nr;
function Pr(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Nr, Nr = e;
		return;
	}
	e.next = Mr, Mr = e;
}
function Fr() {
	jr++;
}
function Ir() {
	if (--jr > 0) return;
	if (Nr) {
		let e = Nr;
		for (Nr = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Mr;) {
		let t = Mr;
		for (Mr = void 0; t;) {
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
function Lr(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Rr(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Vr(r), Hr(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function zr(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Br(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Br(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Jr) || (e.globalVersion = Jr, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !zr(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = I, r = Ur;
	I = e, Ur = !0;
	try {
		Lr(e);
		let n = e.fn(e._value);
		(t.version === 0 || ir(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		I = n, Ur = r, Rr(e), e.flags &= -3;
	}
}
function Vr(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Vr(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Hr(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Ur = !0, Wr = [];
function Gr() {
	Wr.push(Ur), Ur = !1;
}
function Kr() {
	let e = Wr.pop();
	Ur = e === void 0 ? !0 : e;
}
function qr(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = I;
		I = void 0;
		try {
			t();
		} finally {
			I = e;
		}
	}
}
var Jr = 0, Yr = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Xr = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!I || !Ur || I === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== I) t = this.activeLink = new Yr(I, this), I.deps ? (t.prevDep = I.depsTail, I.depsTail.nextDep = t, I.depsTail = t) : I.deps = I.depsTail = t, Zr(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = I.depsTail, t.nextDep = void 0, I.depsTail.nextDep = t, I.depsTail = t, I.deps === t && (I.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Jr++, this.notify(e);
	}
	notify(e) {
		Fr();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Ir();
		}
	}
};
function Zr(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Zr(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Qr = /* @__PURE__ */ new WeakMap(), $r = /* @__PURE__ */ Symbol(""), ei = /* @__PURE__ */ Symbol(""), ti = /* @__PURE__ */ Symbol("");
function ni(e, t, n) {
	if (Ur && I) {
		let t = Qr.get(e);
		t || Qr.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Xr()), r.map = t, r.key = n), r.track();
	}
}
function ri(e, t, n, r, i, a) {
	let o = Qr.get(e);
	if (!o) {
		Jr++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Fr(), t === "clear") o.forEach(s);
	else {
		let i = j(e), a = i && Yn(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === ti || !Un(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(ti)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get($r)), zn(e) && s(o.get(ei)));
				break;
			case "delete":
				i || (s(o.get($r)), zn(e) && s(o.get(ei)));
				break;
			case "set":
				zn(e) && s(o.get($r));
				break;
		}
	}
	Ir();
}
function ii(e, t) {
	let n = Qr.get(e);
	return n && n.get(t);
}
function ai(e) {
	let t = /* @__PURE__ */ L(e);
	return t === e ? t : (ni(t, "iterate", ti), /* @__PURE__ */ Gi(e) ? t : t.map(Ji));
}
function oi(e) {
	return ni(e = /* @__PURE__ */ L(e), "iterate", ti), e;
}
function si(e, t) {
	return /* @__PURE__ */ Wi(e) ? Yi(/* @__PURE__ */ Ui(e) ? Ji(t) : t) : Ji(t);
}
var ci = {
	__proto__: null,
	[Symbol.iterator]() {
		return li(this, Symbol.iterator, (e) => si(this, e));
	},
	concat(...e) {
		return ai(this).concat(...e.map((e) => j(e) ? ai(e) : e));
	},
	entries() {
		return li(this, "entries", (e) => (e[1] = si(this, e[1]), e));
	},
	every(e, t) {
		return fi(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return fi(this, "filter", e, t, (e) => e.map((e) => si(this, e)), arguments);
	},
	find(e, t) {
		return fi(this, "find", e, t, (e) => si(this, e), arguments);
	},
	findIndex(e, t) {
		return fi(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return fi(this, "findLast", e, t, (e) => si(this, e), arguments);
	},
	findLastIndex(e, t) {
		return fi(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return fi(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return mi(this, "includes", e);
	},
	indexOf(...e) {
		return mi(this, "indexOf", e);
	},
	join(e) {
		return ai(this).join(e);
	},
	lastIndexOf(...e) {
		return mi(this, "lastIndexOf", e);
	},
	map(e, t) {
		return fi(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return hi(this, "pop");
	},
	push(...e) {
		return hi(this, "push", e);
	},
	reduce(e, ...t) {
		return pi(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return pi(this, "reduceRight", e, t);
	},
	shift() {
		return hi(this, "shift");
	},
	some(e, t) {
		return fi(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return hi(this, "splice", e);
	},
	toReversed() {
		return ai(this).toReversed();
	},
	toSorted(e) {
		return ai(this).toSorted(e);
	},
	toSpliced(...e) {
		return ai(this).toSpliced(...e);
	},
	unshift(...e) {
		return hi(this, "unshift", e);
	},
	values() {
		return li(this, "values", (e) => si(this, e));
	}
};
function li(e, t, n) {
	let r = oi(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Gi(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var di = Array.prototype;
function fi(e, t, n, r, i, a) {
	let o = oi(e), s = o !== e && !/* @__PURE__ */ Gi(e), c = o[t];
	if (c !== di[t]) {
		let t = c.apply(e, a);
		return s ? Ji(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, si(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function pi(e, t, n, r) {
	let i = oi(e), a = i !== e && !/* @__PURE__ */ Gi(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = si(e, t)), n.call(this, t, si(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? si(e, c) : c;
}
function mi(e, t, n) {
	let r = /* @__PURE__ */ L(e);
	ni(r, "iterate", ti);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Ki(n[0]) ? (n[0] = /* @__PURE__ */ L(n[0]), r[t](...n)) : i;
}
function hi(e, t, n = []) {
	Gr(), Fr();
	let r = (/* @__PURE__ */ L(e))[t].apply(e, n);
	return Ir(), Kr(), r;
}
var gi = /* @__PURE__ */ An("__proto__,__v_isRef,__isVue"), _i = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Un));
function vi(e) {
	Un(e) || (e = String(e));
	let t = /* @__PURE__ */ L(this);
	return ni(t, "has", e), t.hasOwnProperty(e);
}
var yi = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Li : Ii : i ? Fi : Pi).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = j(e);
		if (!r) {
			let e;
			if (a && (e = ci[t])) return e;
			if (t === "hasOwnProperty") return vi;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ R(e) ? e : n);
		if ((Un(t) ? _i.has(t) : gi(t)) || (r || ni(e, "get", t), i)) return o;
		if (/* @__PURE__ */ R(o)) {
			let e = a && Yn(t) ? o : o.value;
			return r && N(e) ? /* @__PURE__ */ Vi(e) : e;
		}
		return N(o) ? r ? /* @__PURE__ */ Vi(o) : /* @__PURE__ */ zi(o) : o;
	}
}, bi = class extends yi {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = j(e) && Yn(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Wi(i);
			if (!/* @__PURE__ */ Gi(n) && !/* @__PURE__ */ Wi(n) && (i = /* @__PURE__ */ L(i), n = /* @__PURE__ */ L(n)), !a && /* @__PURE__ */ R(i) && !/* @__PURE__ */ R(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : A(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ R(e) ? e : r);
		return e === /* @__PURE__ */ L(r) && (o ? ir(n, i) && ri(e, "set", t, n, i) : ri(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = A(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && ri(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!Un(t) || !_i.has(t)) && ni(e, "has", t), n;
	}
	ownKeys(e) {
		return ni(e, "iterate", j(e) ? "length" : $r), Reflect.ownKeys(e);
	}
}, xi = class extends yi {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Si = /* @__PURE__ */ new bi(), Ci = /* @__PURE__ */ new xi(), wi = /* @__PURE__ */ new bi(!0), Ti = (e) => e, Ei = (e) => Reflect.getPrototypeOf(e);
function Di(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ L(i), o = zn(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Ti : t ? Yi : Ji;
		return !t && ni(a, "iterate", c ? ei : $r), In(Object.create(l), { next() {
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
function Oi(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function ki(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ L(r), a = /* @__PURE__ */ L(n);
			e || (ir(n, a) && ni(i, "get", n), ni(i, "get", a));
			let { has: o } = Ei(i), s = t ? Ti : e ? Yi : Ji;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && ni(/* @__PURE__ */ L(t), "iterate", $r), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ L(n), i = /* @__PURE__ */ L(t);
			return e || (ir(t, i) && ni(r, "has", t), ni(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ L(a), s = t ? Ti : e ? Yi : Ji;
			return !e && ni(o, "iterate", $r), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return In(n, e ? {
		add: Oi("add"),
		set: Oi("set"),
		delete: Oi("delete"),
		clear: Oi("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ L(this), r = Ei(n), i = /* @__PURE__ */ L(e), a = !t && !/* @__PURE__ */ Gi(e) && !/* @__PURE__ */ Wi(e) ? i : e;
			return r.has.call(n, a) || ir(e, a) && r.has.call(n, e) || ir(i, a) && r.has.call(n, i) || (n.add(a), ri(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Gi(n) && !/* @__PURE__ */ Wi(n) && (n = /* @__PURE__ */ L(n));
			let r = /* @__PURE__ */ L(this), { has: i, get: a } = Ei(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ L(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? ir(n, s) && ri(r, "set", e, n, s) : ri(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ L(this), { has: n, get: r } = Ei(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ L(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && ri(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ L(this), t = e.size !== 0, n = e.clear();
			return t && ri(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Di(r, e, t);
	}), n;
}
function Ai(e, t) {
	let n = ki(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(A(n, r) && r in t ? n : t, r, i);
}
var ji = { get: /* @__PURE__ */ Ai(!1, !1) }, Mi = { get: /* @__PURE__ */ Ai(!1, !0) }, Ni = { get: /* @__PURE__ */ Ai(!0, !1) }, Pi = /* @__PURE__ */ new WeakMap(), Fi = /* @__PURE__ */ new WeakMap(), Ii = /* @__PURE__ */ new WeakMap(), Li = /* @__PURE__ */ new WeakMap();
function Ri(e) {
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
function zi(e) {
	return /* @__PURE__ */ Wi(e) ? e : Hi(e, !1, Si, ji, Pi);
}
// @__NO_SIDE_EFFECTS__
function Bi(e) {
	return Hi(e, !1, wi, Mi, Fi);
}
// @__NO_SIDE_EFFECTS__
function Vi(e) {
	return Hi(e, !0, Ci, Ni, Ii);
}
function Hi(e, t, n, r, i) {
	if (!N(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Ri(qn(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Ui(e) {
	return /* @__PURE__ */ Wi(e) ? /* @__PURE__ */ Ui(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Wi(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Gi(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Ki(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function L(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ L(t) : e;
}
function qi(e) {
	return !A(e, "__v_skip") && Object.isExtensible(e) && or(e, "__v_skip", !0), e;
}
var Ji = (e) => N(e) ? /* @__PURE__ */ zi(e) : e, Yi = (e) => N(e) ? /* @__PURE__ */ Vi(e) : e;
// @__NO_SIDE_EFFECTS__
function R(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
	return Xi(e, !1);
}
function Xi(e, t) {
	return /* @__PURE__ */ R(e) ? e : new Zi(e, t);
}
var Zi = class {
	constructor(e, t) {
		this.dep = new Xr(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ L(e), this._value = t ? e : Ji(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Gi(e) || /* @__PURE__ */ Wi(e);
		e = n ? e : /* @__PURE__ */ L(e), ir(e, t) && (this._rawValue = e, this._value = n ? e : Ji(e), this.dep.trigger());
	}
};
function B(e) {
	return /* @__PURE__ */ R(e) ? e.value : e;
}
var Qi = {
	get: (e, t, n) => t === "__v_raw" ? e : B(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ R(i) && !/* @__PURE__ */ R(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function $i(e) {
	return /* @__PURE__ */ Ui(e) ? e : new Proxy(e, Qi);
}
// @__NO_SIDE_EFFECTS__
function ea(e) {
	let t = j(e) ? Array(e.length) : {};
	for (let n in e) t[n] = ia(e, n);
	return t;
}
var ta = class {
	constructor(e, t, n) {
		this._object = e, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0, this._key = Un(t) ? t : String(t), this._raw = /* @__PURE__ */ L(e);
		let r = !0, i = e;
		if (!j(e) || Un(this._key) || !Yn(this._key)) do
			r = !/* @__PURE__ */ Ki(i) || /* @__PURE__ */ Gi(i);
		while (r && (i = i.__v_raw));
		this._shallow = r;
	}
	get value() {
		let e = this._object[this._key];
		return this._shallow && (e = B(e)), this._value = e === void 0 ? this._defaultValue : e;
	}
	set value(e) {
		if (this._shallow && /* @__PURE__ */ R(this._raw[this._key])) {
			let t = this._object[this._key];
			if (/* @__PURE__ */ R(t)) {
				t.value = e;
				return;
			}
		}
		this._object[this._key] = e;
	}
	get dep() {
		return ii(this._raw, this._key);
	}
}, na = class {
	constructor(e) {
		this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
};
// @__NO_SIDE_EFFECTS__
function ra(e, t, n) {
	return /* @__PURE__ */ R(e) ? e : M(e) ? new na(e) : N(e) && arguments.length > 1 ? ia(e, t, n) : /* @__PURE__ */ z(e);
}
function ia(e, t, n) {
	return new ta(e, t, n);
}
var aa = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Xr(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Jr - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && I !== this) return Pr(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Br(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function oa(e, t, n = !1) {
	let r, i;
	return M(e) ? r = e : (r = e.get, i = e.set), new aa(r, i, n);
}
var sa = {}, ca = /* @__PURE__ */ new WeakMap(), la = void 0;
function ua(e, t = !1, n = la) {
	if (n) {
		let t = ca.get(n);
		t || ca.set(n, t = []), t.push(e);
	}
}
function da(e, t, n = k) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ Gi(e) || i === !1 || i === 0 ? fa(e, 1) : fa(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ R(e) ? (d = () => e.value, m = /* @__PURE__ */ Gi(e)) : /* @__PURE__ */ Ui(e) ? (d = () => l(e), m = !0) : j(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ Ui(e) || /* @__PURE__ */ Gi(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ R(e)) return e.value;
		if (/* @__PURE__ */ Ui(e)) return l(e);
		if (M(e)) return c ? c(e, 2) : e();
	})) : d = M(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			Gr();
			try {
				f();
			} finally {
				Kr();
			}
		}
		let t = la;
		la = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			la = t;
		}
	} : Mn, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => fa(e(), t);
	}
	let g = Dr(), _ = () => {
		u.stop(), g && g.active && Ln(g.effects, u);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return _(), n;
		};
	}
	let v = h ? Array(e.length).fill(sa) : sa, y = (e) => {
		if (!(!(u.flags & 1) || !u.dirty && !e)) if (t) {
			let n = u.run();
			if (e || i || m || (h ? n.some((e, t) => ir(e, v[t])) : ir(n, v))) {
				f && f();
				let e = la;
				la = u;
				try {
					let e = [
						n,
						v === sa ? void 0 : h && v[0] === sa ? [] : v,
						p
					];
					v = n, c ? c(t, 3, e) : t(...e);
				} finally {
					la = e;
				}
			}
		} else u.run();
	};
	return s && s(y), u = new Ar(d), u.scheduler = o ? () => o(y, !1) : y, p = (e) => ua(e, !1, u), f = u.onStop = () => {
		let e = ca.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			ca.delete(u);
		}
	}, t ? r ? y(!0) : v = u.run() : o ? o(y.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function fa(e, t = Infinity, n) {
	if (t <= 0 || !N(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ R(e)) fa(e.value, t, n);
	else if (j(e)) for (let r = 0; r < e.length; r++) fa(e[r], t, n);
	else if (Bn(e) || zn(e)) e.forEach((e) => {
		fa(e, t, n);
	});
	else if (Jn(e)) {
		for (let r in e) fa(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && fa(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function pa(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		ha(e, t, n);
	}
}
function ma(e, t, n, r) {
	if (M(e)) {
		let i = pa(e, t, n, r);
		return i && Wn(i) && i.catch((e) => {
			ha(e, t, n);
		}), i;
	}
	if (j(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(ma(e[a], t, n, r));
		return i;
	}
}
function ha(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || k;
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
			Gr(), pa(a, null, 10, [
				e,
				i,
				o
			]), Kr();
			return;
		}
	}
	ga(e, n, i, r, o);
}
function ga(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var _a = [], va = -1, ya = [], ba = null, xa = 0, Sa = /* @__PURE__ */ Promise.resolve(), Ca = null;
function wa(e) {
	let t = Ca || Sa;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Ta(e) {
	let t = va + 1, n = _a.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = _a[r], a = ja(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Ea(e) {
	if (!(e.flags & 1)) {
		let t = ja(e), n = _a[_a.length - 1];
		!n || !(e.flags & 2) && t >= ja(n) ? _a.push(e) : _a.splice(Ta(t), 0, e), e.flags |= 1, Da();
	}
}
function Da() {
	Ca ||= Sa.then(Ma);
}
function Oa(e) {
	j(e) ? ya.push(...e) : ba && e.id === -1 ? ba.splice(xa + 1, 0, e) : e.flags & 1 || (ya.push(e), e.flags |= 1), Da();
}
function ka(e, t, n = va + 1) {
	for (; n < _a.length; n++) {
		let t = _a[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			_a.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function Aa(e) {
	if (ya.length) {
		let e = [...new Set(ya)].sort((e, t) => ja(e) - ja(t));
		if (ya.length = 0, ba) {
			ba.push(...e);
			return;
		}
		for (ba = e, xa = 0; xa < ba.length; xa++) {
			let e = ba[xa];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		ba = null, xa = 0;
	}
}
var ja = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Ma(e) {
	try {
		for (va = 0; va < _a.length; va++) {
			let e = _a[va];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), pa(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; va < _a.length; va++) {
			let e = _a[va];
			e && (e.flags &= -2);
		}
		va = -1, _a.length = 0, Aa(e), Ca = null, (_a.length || ya.length) && Ma(e);
	}
}
var Na = null, Pa = null;
function Fa(e) {
	let t = Na;
	return Na = e, Pa = e && e.type.__scopeId || null, t;
}
function V(e, t = Na, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Ks(-1);
		let i = Fa(t), a;
		try {
			a = e(...n);
		} finally {
			Fa(i), r._d && Ks(1);
		}
		return a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function H(e, t) {
	if (Na === null) return e;
	let n = Ec(Na), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = k] = t[e];
		i && (M(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && fa(a), r.push({
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
function Ia(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Gr(), ma(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Kr());
	}
}
function La(e, t) {
	if (uc) {
		let n = uc.provides, r = uc.parent && uc.parent.provides;
		r === n && (n = uc.provides = Object.create(r)), n[e] = t;
	}
}
function Ra(e, t, n = !1) {
	let r = dc();
	if (r || Yo) {
		let i = Yo ? Yo._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && M(t) ? t.call(r && r.proxy) : t;
	}
}
function za() {
	return !!(dc() || Yo);
}
var Ba = /* @__PURE__ */ Symbol.for("v-scx"), Va = () => Ra(Ba);
function Ha(e, t, n) {
	return Ua(e, t, n);
}
function Ua(e, t, n = k) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = In({}, n), c = t && r || !t && a !== "post", l;
	if (_c) {
		if (a === "sync") {
			let e = Va();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = Mn, e.resume = Mn, e.pause = Mn, e;
		}
	}
	let u = uc;
	s.call = (e, t, n) => ma(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		Es(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : Ea(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = da(e, t, s);
	return _c && (l ? l.push(f) : c && f()), f;
}
function Wa(e, t, n) {
	let r = this.proxy, i = Hn(e) ? e.includes(".") ? Ga(r, e) : () => r[e] : e.bind(r, r), a;
	M(t) ? a = t : (a = t.handler, n = t);
	let o = mc(this), s = Ua(i, a.bind(r), n);
	return o(), s;
}
function Ga(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Ka = /* @__PURE__ */ Symbol("_vte"), qa = (e) => e.__isTeleport, Ja = /* @__PURE__ */ Symbol("_leaveCb");
function Ya(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, Ya(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function U(e, t) {
	return M(e) ? /* @__PURE__ */ In({ name: e.name }, t, { setup: e }) : e;
}
function Xa() {
	let e = dc();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function Za(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Qa(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var $a = /* @__PURE__ */ new WeakMap();
function eo(e, t, n, r, i = !1) {
	if (j(e)) {
		e.forEach((e, a) => eo(e, t && (j(t) ? t[a] : t), n, r, i));
		return;
	}
	if (no(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && eo(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Ec(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === k ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ L(d), p = d === k ? Nn : (e) => Qa(u, e) ? !1 : A(f, e), m = (e, t) => !(t && Qa(u, t));
	if (l != null && l !== c) {
		if (to(t), Hn(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ R(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (M(c)) pa(c, s, 12, [o, u]);
	else {
		let t = Hn(c), r = /* @__PURE__ */ R(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) j(n) && Ln(n, a);
					else if (j(n)) n.includes(a) || n.push(a);
					else if (t) u[c] = [a], p(c) && (d[c] = u[c]);
					else {
						let t = [a];
						m(c, e.k) && (c.value = t), e.k && (u[e.k] = t);
					}
				} else t ? (u[c] = o, p(c) && (d[c] = o)) : r && (m(c, e.k) && (c.value = o), e.k && (u[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), $a.delete(e);
				};
				t.id = -1, $a.set(e, t), Es(t, n);
			} else to(e), s();
		}
	}
}
function to(e) {
	let t = $a.get(e);
	t && (t.flags |= 8, $a.delete(e));
}
lr().requestIdleCallback, lr().cancelIdleCallback;
var no = (e) => !!e.type.__asyncLoader, ro = (e) => e.type.__isKeepAlive;
function io(e, t) {
	oo(e, "a", t);
}
function ao(e, t) {
	oo(e, "da", t);
}
function oo(e, t, n = uc) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (co(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) ro(e.parent.vnode) && so(r, t, n, e), e = e.parent;
	}
}
function so(e, t, n, r) {
	let i = co(t, e, r, !0);
	go(() => {
		Ln(r[t], i);
	}, n);
}
function co(e, t, n = uc, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Gr();
			let i = mc(n), a = ma(t, n, e, r);
			return i(), Kr(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var lo = (e) => (t, n = uc) => {
	(!_c || e === "sp") && co(e, (...e) => t(...e), n);
}, uo = lo("bm"), fo = lo("m"), po = lo("bu"), mo = lo("u"), ho = lo("bum"), go = lo("um"), _o = lo("sp"), vo = lo("rtg"), yo = lo("rtc");
function bo(e, t = uc) {
	co("ec", e, t);
}
var xo = /* @__PURE__ */ Symbol.for("v-ndc");
function W(e, t, n, r) {
	let i, a = n && n[r], o = j(e);
	if (o || Hn(e)) {
		let n = o && /* @__PURE__ */ Ui(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Gi(e), s = /* @__PURE__ */ Wi(e), e = oi(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Yi(Ji(e[n])) : Ji(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (N(e)) if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
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
function So(e, t, n = {}, r, i) {
	if (Na.ce || Na.parent && no(Na.parent) && Na.parent.ce) {
		let e = Object.keys(n).length > 0;
		return t !== "default" && (n.name = t), K(), J(G, null, [X("slot", n, r && r())], e ? -2 : 64);
	}
	let a = e[t];
	a && a._c && (a._d = !1), K();
	let o = a && Co(a(n)), s = n.key || o && o.key, c = J(G, { key: (s && !Un(s) ? s : `_${t}`) + (!o && r ? "_fb" : "") }, o || (r ? r() : []), o && e._ === 1 ? 64 : -2);
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), a && a._c && (a._d = !0), c;
}
function Co(e) {
	return e.some((e) => Js(e) ? !(e.type === Bs || e.type === G && !Co(e.children)) : !0) ? e : null;
}
var wo = (e) => e ? gc(e) ? Ec(e) : wo(e.parent) : null, To = /* @__PURE__ */ In(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => wo(e.parent),
	$root: (e) => wo(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Io(e),
	$forceUpdate: (e) => e.f ||= () => {
		Ea(e.update);
	},
	$nextTick: (e) => e.n ||= wa.bind(e.proxy),
	$watch: (e) => Wa.bind(e)
}), Eo = (e, t) => e !== k && !e.__isScriptSetup && A(e, t), Do = {
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
			else if (Eo(r, t)) return o[t] = 1, r[t];
			else if (i !== k && A(i, t)) return o[t] = 2, i[t];
			else if (A(a, t)) return o[t] = 3, a[t];
			else if (n !== k && A(n, t)) return o[t] = 4, n[t];
			else jo && (o[t] = 0);
		}
		let l = To[t], u, d;
		if (l) return t === "$attrs" && ni(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== k && A(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, A(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Eo(i, t) ? (i[t] = n, !0) : r !== k && A(r, t) ? (r[t] = n, !0) : A(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || e !== k && s[0] !== "$" && A(e, s) || Eo(t, s) || A(a, s) || A(r, s) || A(To, s) || A(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? A(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Oo() {
	return ko("useSlots").slots;
}
function ko(e) {
	let t = dc();
	return t.setupContext ||= Tc(t);
}
function Ao(e) {
	return j(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var jo = !0;
function Mo(e) {
	let t = Io(e), n = e.proxy, r = e.ctx;
	jo = !1, t.beforeCreate && Po(t.beforeCreate, e, "bc");
	let { data: i, computed: a, methods: o, watch: s, provide: c, inject: l, created: u, beforeMount: d, mounted: f, beforeUpdate: p, updated: m, activated: h, deactivated: g, beforeDestroy: _, beforeUnmount: v, destroyed: y, unmounted: b, render: x, renderTracked: S, renderTriggered: C, errorCaptured: w, serverPrefetch: ee, expose: te, inheritAttrs: ne, components: re, directives: T, filters: ie } = t;
	if (l && No(l, r, null), o) for (let e in o) {
		let t = o[e];
		M(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		N(t) && (e.data = /* @__PURE__ */ zi(t));
	}
	if (jo = !0, a) for (let e in a) {
		let t = a[e], i = $({
			get: M(t) ? t.bind(n, n) : M(t.get) ? t.get.bind(n, n) : Mn,
			set: !M(t) && M(t.set) ? t.set.bind(n) : Mn
		});
		Object.defineProperty(r, e, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		});
	}
	if (s) for (let e in s) Fo(s[e], r, n, e);
	if (c) {
		let e = M(c) ? c.call(n) : c;
		Reflect.ownKeys(e).forEach((t) => {
			La(t, e[t]);
		});
	}
	u && Po(u, e, "c");
	function E(e, t) {
		j(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (E(uo, d), E(fo, f), E(po, p), E(mo, m), E(io, h), E(ao, g), E(bo, w), E(yo, S), E(vo, C), E(ho, v), E(go, b), E(_o, ee), j(te)) if (te.length) {
		let t = e.exposed ||= {};
		te.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	x && e.render === Mn && (e.render = x), ne != null && (e.inheritAttrs = ne), re && (e.components = re), T && (e.directives = T), ee && Za(e);
}
function No(e, t, n = Mn) {
	j(e) && (e = Vo(e));
	for (let n in e) {
		let r = e[n], i;
		i = N(r) ? "default" in r ? Ra(r.from || n, r.default, !0) : Ra(r.from || n) : Ra(r), /* @__PURE__ */ R(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Po(e, t, n) {
	ma(j(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Fo(e, t, n, r) {
	let i = r.includes(".") ? Ga(n, r) : () => n[r];
	if (Hn(e)) {
		let n = t[e];
		M(n) && Ha(i, n);
	} else if (M(e)) Ha(i, e.bind(n));
	else if (N(e)) if (j(e)) e.forEach((e) => Fo(e, t, n, r));
	else {
		let r = M(e.handler) ? e.handler.bind(n) : t[e.handler];
		M(r) && Ha(i, r, e);
	}
}
function Io(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Lo(c, e, o, !0)), Lo(c, t, o)), N(t) && a.set(t, c), c;
}
function Lo(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Lo(e, a, n, !0), i && i.forEach((t) => Lo(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Ro[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Ro = {
	data: zo,
	props: Wo,
	emits: Wo,
	methods: Uo,
	computed: Uo,
	beforeCreate: Ho,
	created: Ho,
	beforeMount: Ho,
	mounted: Ho,
	beforeUpdate: Ho,
	updated: Ho,
	beforeDestroy: Ho,
	beforeUnmount: Ho,
	destroyed: Ho,
	unmounted: Ho,
	activated: Ho,
	deactivated: Ho,
	errorCaptured: Ho,
	serverPrefetch: Ho,
	components: Uo,
	directives: Uo,
	watch: Go,
	provide: zo,
	inject: Bo
};
function zo(e, t) {
	return t ? e ? function() {
		return In(M(e) ? e.call(this, this) : e, M(t) ? t.call(this, this) : t);
	} : t : e;
}
function Bo(e, t) {
	return Uo(Vo(e), Vo(t));
}
function Vo(e) {
	if (j(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Ho(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Uo(e, t) {
	return e ? In(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Wo(e, t) {
	return e ? j(e) && j(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : In(/* @__PURE__ */ Object.create(null), Ao(e), Ao(t ?? {})) : t;
}
function Go(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = In(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Ho(e[r], t[r]);
	return n;
}
function Ko() {
	return {
		app: null,
		config: {
			isNativeTag: Nn,
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
var qo = 0;
function Jo(e, t) {
	return function(n, r = null) {
		M(n) || (n = In({}, n)), r != null && !N(r) && (r = null);
		let i = Ko(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: qo++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Oc,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && M(e.install) ? (a.add(e), e.install(c, ...t)) : M(e) && (a.add(e), e(c, ...t))), c;
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
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Ec(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (ma(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = Yo;
				Yo = c;
				try {
					return e();
				} finally {
					Yo = t;
				}
			}
		};
		return c;
	};
}
var Yo = null, Xo = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${$n(t)}Modifiers`] || e[`${tr(t)}Modifiers`];
function Zo(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || k, i = n, a = t.startsWith("update:"), o = a && Xo(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => Hn(e) ? e.trim() : e)), o.number && (i = n.map(sr)));
	let s, c = r[s = rr(t)] || r[s = rr($n(t))];
	!c && a && (c = r[s = rr(tr(t))]), c && ma(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, ma(l, e, 6, i);
	}
}
var Qo = /* @__PURE__ */ new WeakMap();
function $o(e, t, n = !1) {
	let r = n ? Qo : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!M(e)) {
		let r = (e) => {
			let n = $o(e, t, !0);
			n && (s = !0, In(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (N(e) && r.set(e, null), null) : (j(a) ? a.forEach((e) => o[e] = null) : In(o, a), N(e) && r.set(e, o), o);
}
function es(e, t) {
	return !e || !Pn(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), A(e, t[0].toLowerCase() + t.slice(1)) || A(e, tr(t)) || A(e, t));
}
function ts(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = Fa(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = nc(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = nc(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : ns(s);
		}
	} catch (t) {
		Hs.length = 0, ha(t, e, 1), _ = X(Bs);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(Fn) && (v = rs(v, a)), y = ec(y, v, !1, !0));
	}
	return n.dirs && (y = ec(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && Ya(y, n.transition), _ = y, Fa(g), _;
}
var ns = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || Pn(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, rs = (e, t) => {
	let n = {};
	for (let r in e) (!Fn(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function is(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? as(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (os(o, r, n) && !es(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? o ? as(r, o, l) : !0 : !!o;
	return !1;
}
function as(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (os(t, e, a) && !es(n, a)) return !0;
	}
	return !1;
}
function os(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && N(r) && N(i) ? !yr(r, i) : r !== i;
}
function ss({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var cs = {}, ls = () => Object.create(cs), us = (e) => Object.getPrototypeOf(e) === cs;
function ds(e, t, n, r = !1) {
	let i = {}, a = ls();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), ps(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ Bi(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function fs(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ L(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (es(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) if (A(a, o)) u !== a[o] && (a[o] = u, l = !0);
				else {
					let t = $n(o);
					i[t] = ms(c, s, t, u, e, !1);
				}
				else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		ps(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !A(t, a) && ((r = tr(a)) === a || !A(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = ms(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !A(t, e)) && (delete a[e], l = !0);
	}
	l && ri(e.attrs, "set", "");
}
function ps(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (Xn(c)) continue;
		let l = t[c], u;
		i && A(i, u = $n(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : es(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ L(n), r = s || k;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = ms(i, t, s, r[s], e, !A(r, s));
		}
	}
	return o;
}
function ms(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = A(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && M(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = mc(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === tr(n)) && (r = !0));
	}
	return r;
}
var hs = /* @__PURE__ */ new WeakMap();
function gs(e, t, n = !1) {
	let r = n ? hs : t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [], c = !1;
	if (!M(e)) {
		let r = (e) => {
			c = !0;
			let [n, r] = gs(e, t, !0);
			In(o, n), r && s.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!a && !c) return N(e) && r.set(e, jn), jn;
	if (j(a)) for (let e = 0; e < a.length; e++) {
		let t = $n(a[e]);
		_s(t) && (o[t] = k);
	}
	else if (a) for (let e in a) {
		let t = $n(e);
		if (_s(t)) {
			let n = a[e], r = o[t] = j(n) || M(n) ? { type: n } : In({}, n), i = r.type, c = !1, l = !0;
			if (j(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = M(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				} else n === "String" && (l = !1);
			}
			else c = M(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || A(r, "default")) && s.push(t);
		}
	}
	let l = [o, s];
	return N(e) && r.set(e, l), l;
}
function _s(e) {
	return e[0] !== "$" && !Xn(e);
}
var vs = (e) => e === "_" || e === "_ctx" || e === "$stable", ys = (e) => j(e) ? e.map(nc) : [nc(e)], bs = (e, t, n) => {
	if (t._n) return t;
	let r = V((...e) => ys(t(...e)), n);
	return r._c = !1, r;
}, xs = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (vs(n)) continue;
		let i = e[n];
		if (M(i)) t[n] = bs(n, i, r);
		else if (i != null) {
			let e = ys(i);
			t[n] = () => e;
		}
	}
}, Ss = (e, t) => {
	let n = ys(t);
	e.slots.default = () => n;
}, Cs = (e, t, n) => {
	for (let r in t) (n || !vs(r)) && (e[r] = t[r]);
}, ws = (e, t, n) => {
	let r = e.slots = ls();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Cs(r, t, n), n && or(r, "_", e, !0)) : xs(t, r);
	} else t && Ss(e, t);
}, Ts = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = k;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Cs(i, t, n) : (a = !t.$stable, xs(t, i)), o = t;
	} else t && (Ss(e, t), o = { default: 1 });
	if (a) for (let e in i) !vs(e) && o[e] == null && delete i[e];
}, Es = Rs;
function Ds(e) {
	return Os(e);
}
function Os(e, t) {
	let n = lr();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = Mn, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ys(e, t) && (r = me(e), le(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case zs:
				g(e, t, n, r);
				break;
			case Bs:
				_(e, t, n, r);
				break;
			case Vs:
				e ?? v(t, n, r, o);
				break;
			case G:
				re(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? x(e, t, n, r, i, a, o, s, c) : d & 6 ? T(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, _e);
		}
		u != null && i ? eo(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && eo(e.ref, null, a, e, !0);
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
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && w(e.children, f, null, i, s, ks(e, c), l, d), _ && Ia(e, null, i, "created"), C(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !Xn(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && oc(p, i, e);
		}
		_ && Ia(e, null, i, "beforeMount");
		let v = js(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Es(() => {
			try {
				p && oc(p, i, e), v && g.enter(f), _ && Ia(e, null, i, "mounted");
			} finally {}
		}, s);
	}, C = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Ls(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				C(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, w = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) h(null, e[l] = s ? rc(e[l]) : nc(e[l]), t, n, r, i, a, o, s);
	}, ee = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || k, m = t.props || k, h;
		if (n && As(n, !1), (h = m.onVnodeBeforeUpdate) && oc(h, n, t, e), f && Ia(t, e, n, "beforeUpdate"), n && As(n, !0), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? te(e.dynamicChildren, d, c, n, r, ks(t, i), o) : s || O(e, t, c, null, n, r, ks(t, i), o, !1), l > 0) {
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
		((h = m.onVnodeUpdated) || f) && Es(() => {
			h && oc(h, n, t, e), f && Ia(t, e, n, "updated");
		}, r);
	}, te = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s];
			h(c, l, c.el && (c.type === G || !Ys(c, l) || c.shapeFlag & 198) ? d(c.el) : n, null, r, i, a, o, !0);
		}
	}, ne = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== k) for (let o in t) !Xn(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (Xn(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, re = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), w(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (te(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Ms(e, t, !0)) : O(e, t, n, f, a, o, c, l, u);
	}, T = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ie(t, n, r, i, a, o, c) : E(e, t, c);
	}, ie = (e, t, n, r, i, a, o) => {
		let s = e.component = lc(e, r, i);
		if (ro(e) && (s.ctx.renderer = _e), vc(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ae, o), !e.el) {
				let r = s.subTree = X(Bs);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else ae(s, e, t, n, i, a, o);
	}, E = (e, t, n) => {
		let r = t.component = e.component;
		if (is(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			D(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, ae = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Ps(e);
					if (n) {
						t && (t.el = c.el, D(e, t, o)), n.asyncDep.then(() => {
							Es(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				As(e, !1), t ? (t.el = c.el, D(e, t, o)) : t = c, n && ar(n), (f = t.props && t.props.onVnodeBeforeUpdate) && oc(f, s, t, c), As(e, !0);
				let p = ts(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), me(m), e, i, a), t.el = p.el, u === null && ss(e, p.el), r && Es(r, i), (f = t.props && t.props.onVnodeUpdated) && Es(() => oc(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = no(t);
				if (As(e, !1), l && ar(l), !m && (o = c && c.onVnodeBeforeMount) && oc(o, d, t), As(e, !0), s && ye) {
					let t = () => {
						e.subTree = ts(e), ye(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = ts(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Es(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Es(() => oc(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && no(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Es(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ar(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Ea(u), As(e, !0), l();
	}, D = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, fs(e, t.props, r, n), Ts(e, t.children, n), Gr(), ka(e), Kr();
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
		e ||= jn, t ||= jn;
		let l = e.length, u = t.length, d = Math.min(l, u), f;
		for (f = 0; f < d; f++) {
			let r = t[f] = c ? rc(t[f]) : nc(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? pe(e, i, a, !0, !1, d) : w(t, n, r, i, a, o, s, c, d);
	}, se = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? rc(t[l]) : nc(t[l]);
			if (Ys(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? rc(t[f]) : nc(t[f]);
			if (Ys(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? rc(t[l]) : nc(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) le(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? rc(t[l]) : nc(t[l]);
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
				else for (_ = m; _ <= f; _++) if (S[_ - m] === 0 && Ys(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? le(r, i, a, !0) : (S[u - m] = l + 1, u >= x ? x = u : b = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let C = b ? Ns(S) : jn;
			for (_ = C.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || Is(f) : r;
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
		if (c === Vs) {
			y(e, t, n);
			return;
		}
		if (a !== 2 && d & 1 && l) if (a === 0) l.persisted && !s[Ja] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Es(() => l.enter(s), o));
		else {
			let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? i(s) : r(s, t, n);
			}, d = () => {
				let e = s._isLeaving || !!s[Ja];
				s._isLeaving && s[Ja](!0), l.persisted && !e ? u() : a(s, () => {
					u(), c && c();
				});
			};
			o ? o(s, u, d) : d();
		}
		else r(s, t, n);
	}, le = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (Gr(), eo(s, null, n, e, !0), Kr()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !no(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && oc(_, t, e), u & 6) fe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Ia(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, _e, r) : l && !l.hasOnce && (a !== G || d > 0 && d & 64) ? pe(l, t, n, !1, !0) : (a === G && d & 384 || !i && u & 16) && pe(c, t, n), r && ue(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Es(() => {
			_ && oc(_, t, e), h && Ia(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ue = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e;
		if (t === G) {
			de(n, r);
			return;
		}
		if (t === Vs) {
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
		Fs(c), Fs(l), r && ar(r), i.stop(), a && (a.flags |= 8, le(o, e, t, n)), s && Es(s, t), Es(() => {
			e.isUnmounted = !0;
		}, t);
	}, pe = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) le(e[o], t, n, r, i);
	}, me = (e) => {
		if (e.shapeFlag & 6) return me(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[Ka];
		return n ? f(n) : t;
	}, he = !1, ge = (e, t, n) => {
		let r;
		e == null ? t._vnode && (le(t._vnode, null, null, !0), r = t._vnode.component) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e, he ||= (he = !0, ka(r), Aa(), !1);
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
		createApp: Jo(ge, ve)
	};
}
function ks({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function As({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function js(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Ms(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (j(r) && j(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = rc(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Ms(t, a)), a.type === zs && (a.patchFlag === -1 && (a = i[e] = rc(a)), a.el = t.el), a.type === Bs && !a.el && (a.el = t.el);
	}
}
function Ns(e) {
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
function Ps(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Ps(t);
}
function Fs(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Is(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Is(t.subTree) : null;
}
var Ls = (e) => e.__isSuspense;
function Rs(e, t) {
	t && t.pendingBranch ? j(e) ? t.effects.push(...e) : t.effects.push(e) : Oa(e);
}
var G = /* @__PURE__ */ Symbol.for("v-fgt"), zs = /* @__PURE__ */ Symbol.for("v-txt"), Bs = /* @__PURE__ */ Symbol.for("v-cmt"), Vs = /* @__PURE__ */ Symbol.for("v-stc"), Hs = [], Us = null;
function K(e = !1) {
	Hs.push(Us = e ? null : []);
}
function Ws() {
	Hs.pop(), Us = Hs[Hs.length - 1] || null;
}
var Gs = 1;
function Ks(e, t = !1) {
	Gs += e, e < 0 && Us && t && (Us.hasOnce = !0);
}
function qs(e) {
	return e.dynamicChildren = Gs > 0 ? Us || jn : null, Ws(), Gs > 0 && Us && Us.push(e), e;
}
function q(e, t, n, r, i, a) {
	return qs(Y(e, t, n, r, i, a, !0));
}
function J(e, t, n, r, i) {
	return qs(X(e, t, n, r, i, !0));
}
function Js(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Ys(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Xs = ({ key: e }) => e ?? null, Zs = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : Hn(e) || /* @__PURE__ */ R(e) || M(e) ? {
	i: Na,
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
		key: t && Xs(t),
		ref: t && Zs(t),
		scopeId: Pa,
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
		ctx: Na
	};
	return s ? (ic(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= Hn(n) ? 8 : 16), Gs > 0 && !o && Us && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Us.push(c), c;
}
var X = Qs;
function Qs(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === xo) && (e = Bs), Js(e)) {
		let r = ec(e, t, !0);
		return n && ic(r, n), Gs > 0 && !a && Us && (r.shapeFlag & 6 ? Us[Us.indexOf(e)] = r : Us.push(r)), r.patchFlag = -2, r;
	}
	if (Dc(e) && (e = e.__vccOpts), t) {
		t = $s(t);
		let { class: e, style: n } = t;
		e && !Hn(e) && (t.class = P(e)), N(n) && (/* @__PURE__ */ Ki(n) && !j(n) && (n = In({}, n)), t.style = ur(n));
	}
	let o = Hn(e) ? 1 : Ls(e) ? 128 : qa(e) ? 64 : N(e) ? 4 : M(e) ? 2 : 0;
	return Y(e, t, n, r, i, o, a, !0);
}
function $s(e) {
	return e ? /* @__PURE__ */ Ki(e) || us(e) ? In({}, e) : e : null;
}
function ec(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ac(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Xs(l),
		ref: t && t.ref ? n && a ? j(a) ? a.concat(Zs(t)) : [a, Zs(t)] : Zs(t) : a,
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
		ssContent: e.ssContent && ec(e.ssContent),
		ssFallback: e.ssFallback && ec(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && Ya(u, c.clone(u)), u;
}
function Z(e = " ", t = 0) {
	return X(zs, null, e, t);
}
function tc(e, t) {
	let n = X(Vs, null, e);
	return n.staticCount = t, n;
}
function Q(e = "", t = !1) {
	return t ? (K(), J(Bs, null, e)) : X(Bs, null, e);
}
function nc(e) {
	return e == null || typeof e == "boolean" ? X(Bs) : j(e) ? X(G, null, e.slice()) : Js(e) ? rc(e) : X(zs, null, String(e));
}
function rc(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : ec(e);
}
function ic(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (j(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), ic(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !us(t) ? t._ctx = Na : r === 3 && Na && (Na.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else M(t) ? (t = {
		default: t,
		_ctx: Na
	}, n = 32) : (t = String(t), r & 64 ? (n = 16, t = [Z(t)]) : n = 8);
	e.children = t, e.shapeFlag |= n;
}
function ac(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = P([t.class, r.class]));
		else if (e === "style") t.style = ur([t.style, r.style]);
		else if (Pn(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(j(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !Fn(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function oc(e, t, n, r = null) {
	ma(e, t, 7, [n, r]);
}
var sc = Ko(), cc = 0;
function lc(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || sc, a = {
		uid: cc++,
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
		scope: new Tr(!0),
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
		propsOptions: gs(r, i),
		emitsOptions: $o(r, i),
		emit: null,
		emitted: null,
		propsDefaults: k,
		inheritAttrs: r.inheritAttrs,
		ctx: k,
		data: k,
		props: k,
		attrs: k,
		slots: k,
		refs: k,
		setupState: k,
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = Zo.bind(null, a), e.ce && e.ce(a), a;
}
var uc = null, dc = () => uc || Na, fc, pc;
{
	let e = lr(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	fc = t("__VUE_INSTANCE_SETTERS__", (e) => uc = e), pc = t("__VUE_SSR_SETTERS__", (e) => _c = e);
}
var mc = (e) => {
	let t = uc;
	return fc(e), e.scope.on(), () => {
		e.scope.off(), fc(t);
	};
}, hc = () => {
	uc && uc.scope.off(), fc(null);
};
function gc(e) {
	return e.vnode.shapeFlag & 4;
}
var _c = !1;
function vc(e, t = !1, n = !1) {
	t && pc(t);
	let { props: r, children: i } = e.vnode, a = gc(e);
	ds(e, r, a, t), ws(e, i, n || t);
	let o = a ? yc(e, t) : void 0;
	return t && pc(!1), o;
}
function yc(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Do);
	let { setup: r } = n;
	if (r) {
		Gr();
		let n = e.setupContext = r.length > 1 ? Tc(e) : null, i = mc(e), a = pa(r, e, 0, [e.props, n]), o = Wn(a);
		if (Kr(), i(), (o || e.sp) && !no(e) && Za(e), o) {
			if (a.then(hc, hc), t) return a.then((n) => {
				bc(e, n, t);
			}).catch((t) => {
				ha(t, e, 0);
			});
			e.asyncDep = a;
		} else bc(e, a, t);
	} else Cc(e, t);
}
function bc(e, t, n) {
	M(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : N(t) && (e.setupState = $i(t)), Cc(e, n);
}
var xc, Sc;
function Cc(e, t, n) {
	let r = e.type;
	if (!e.render) {
		if (!t && xc && !r.render) {
			let t = r.template || Io(e).template;
			if (t) {
				let { isCustomElement: n, compilerOptions: i } = e.appContext.config, { delimiters: a, compilerOptions: o } = r;
				r.render = xc(t, In(In({
					isCustomElement: n,
					delimiters: a
				}, i), o));
			}
		}
		e.render = r.render || Mn, Sc && Sc(e);
	}
	{
		let t = mc(e);
		Gr();
		try {
			Mo(e);
		} finally {
			Kr(), t();
		}
	}
}
var wc = { get(e, t) {
	return ni(e, "get", ""), e[t];
} };
function Tc(e) {
	return {
		attrs: new Proxy(e.attrs, wc),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Ec(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy($i(qi(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in To) return To[n](e);
		},
		has(e, t) {
			return t in e || t in To;
		}
	}) : e.proxy;
}
function Dc(e) {
	return M(e) && "__vccOpts" in e;
}
var $ = (e, t) => /* @__PURE__ */ oa(e, t, _c), Oc = "3.5.38", kc = void 0, Ac = typeof window < "u" && window.trustedTypes;
if (Ac) try {
	kc = /* @__PURE__ */ Ac.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var jc = kc ? (e) => kc.createHTML(e) : (e) => e, Mc = "http://www.w3.org/2000/svg", Nc = "http://www.w3.org/1998/Math/MathML", Pc = typeof document < "u" ? document : null, Fc = Pc && /* @__PURE__ */ Pc.createElement("template"), Ic = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Pc.createElementNS(Mc, e) : t === "mathml" ? Pc.createElementNS(Nc, e) : n ? Pc.createElement(e, { is: n }) : Pc.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Pc.createTextNode(e),
	createComment: (e) => Pc.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Pc.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
		else {
			Fc.innerHTML = jc(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Fc.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Lc = /* @__PURE__ */ Symbol("_vtc");
function Rc(e, t, n) {
	let r = e[Lc];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var zc = /* @__PURE__ */ Symbol("_vod"), Bc = /* @__PURE__ */ Symbol("_vsh"), Vc = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[zc] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Hc(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Hc(e, !0), r.enter(e)) : r.leave(e, () => {
			Hc(e, !1);
		}) : Hc(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Hc(e, t);
	}
};
function Hc(e, t) {
	e.style.display = t ? e[zc] : "none", e[Bc] = !t;
}
var Uc = /* @__PURE__ */ Symbol(""), Wc = /(?:^|;)\s*display\s*:/;
function Gc(e, t, n) {
	let r = e.style, i = Hn(n), a = !1;
	if (n && !i) {
		if (t) if (Hn(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? qc(r, t, "");
		}
		else for (let e in t) n[e] ?? qc(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? qc(r, i, "") : Zc(e, i, !Hn(t) && t ? t[i] : void 0, o) || qc(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Uc];
			e && (n += ";" + e), r.cssText = n, a = Wc.test(n);
		}
	} else t && e.removeAttribute("style");
	zc in e && (e[zc] = a ? r.display : "", e[Bc] && (r.display = "none"));
}
var Kc = /\s*!important$/;
function qc(e, t, n) {
	if (j(n)) n.forEach((n) => qc(e, t, n));
	else if (n ??= "", t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = Xc(e, t);
		Kc.test(n) ? e.setProperty(tr(r), n.replace(Kc, ""), "important") : e[r] = n;
	}
}
var Jc = [
	"Webkit",
	"Moz",
	"ms"
], Yc = {};
function Xc(e, t) {
	let n = Yc[t];
	if (n) return n;
	let r = $n(t);
	if (r !== "filter" && r in e) return Yc[t] = r;
	r = nr(r);
	for (let n = 0; n < Jc.length; n++) {
		let i = Jc[n] + r;
		if (i in e) return Yc[t] = i;
	}
	return t;
}
function Zc(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && Hn(r) && n === r;
}
var Qc = "http://www.w3.org/1999/xlink";
function $c(e, t, n, r, i, a = gr(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Qc, t.slice(6, t.length)) : e.setAttributeNS(Qc, t, n) : n == null || a && !_r(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : Un(n) ? String(n) : n);
}
function el(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? jc(n) : n);
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
		r === "boolean" ? n = _r(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function tl(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function nl(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var rl = /* @__PURE__ */ Symbol("_vei");
function il(e, t, n, r, i = null) {
	let a = e[rl] || (e[rl] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = ol(t);
		r ? tl(e, n, a[t] = ul(r, i), s) : o && (nl(e, n, o, s), a[t] = void 0);
	}
}
var al = /(?:Once|Passive|Capture)$/;
function ol(e) {
	let t;
	if (al.test(e)) {
		t = {};
		let n;
		for (; n = e.match(al);) e = e.slice(0, e.length - n[0].length), t[n[0].toLowerCase()] = !0;
	}
	return [e[2] === ":" ? e.slice(3) : tr(e.slice(2)), t];
}
var sl = 0, cl = /* @__PURE__ */ Promise.resolve(), ll = () => sl ||= (cl.then(() => sl = 0), Date.now());
function ul(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (j(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && ma(e, t, 5, a);
			}
		} else ma(r, t, 5, [e]);
	};
	return n.value = e, n.attached = ll(), n;
}
var dl = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, fl = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? Rc(e, r, o) : t === "style" ? Gc(e, n, r) : Pn(t) ? Fn(t) || il(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : pl(e, t, r, o)) ? (el(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && $c(e, t, r, o, a, t !== "value")) : e._isVueCE && (ml(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !Hn(r))) ? el(e, $n(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), $c(e, t, r, o));
};
function pl(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && dl(t) && M(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return dl(t) && Hn(n) ? !1 : t in e;
}
function ml(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = $n(t);
	return Array.isArray(n) ? n.some((e) => $n(e) === r) : Object.keys(n).some((e) => $n(e) === r);
}
var hl = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return j(t) ? (e) => ar(t, e) : t;
};
function gl(e) {
	e.target.composing = !0;
}
function _l(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var vl = /* @__PURE__ */ Symbol("_assign");
function yl(e, t, n) {
	return t && (e = e.trim()), n && (e = sr(e)), e;
}
var bl = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e[vl] = hl(i);
		let a = r || i.props && i.props.type === "number";
		tl(e, t ? "change" : "input", (t) => {
			t.target.composing || e[vl](yl(e.value, n, a));
		}), (n || a) && tl(e, "change", () => {
			e.value = yl(e.value, n, a);
		}), t || (tl(e, "compositionstart", gl), tl(e, "compositionend", _l), tl(e, "change", _l));
	},
	mounted(e, { value: t }) {
		e.value = t ?? "";
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[vl] = hl(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? sr(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, xl = {
	deep: !0,
	created(e, t, n) {
		e[vl] = hl(n), tl(e, "change", () => {
			let t = e._modelValue, n = Tl(e), r = e.checked, i = e[vl];
			if (j(t)) {
				let e = br(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (Bn(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(El(e, r));
		});
	},
	mounted: Sl,
	beforeUpdate(e, t, n) {
		e[vl] = hl(n), Sl(e, t, n);
	}
};
function Sl(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (j(t)) i = br(t, r.props.value) > -1;
	else if (Bn(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = yr(t, El(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Cl = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		let i = Bn(t);
		tl(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? sr(Tl(e)) : Tl(e));
			e[vl](e.multiple ? i ? new Set(t) : t : t[0]), e._assigning = !0, wa(() => {
				e._assigning = !1;
			});
		}), e[vl] = hl(r);
	},
	mounted(e, { value: t }) {
		wl(e, t);
	},
	beforeUpdate(e, t, n) {
		e[vl] = hl(n);
	},
	updated(e, { value: t }) {
		e._assigning || wl(e, t);
	}
};
function wl(e, t) {
	let n = e.multiple, r = j(t);
	if (!(n && !r && !Bn(t))) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = Tl(a);
			if (n) if (r) {
				let e = typeof o;
				e === "string" || e === "number" ? a.selected = t.some((e) => String(e) === String(o)) : a.selected = br(t, o) > -1;
			} else a.selected = t.has(o);
			else if (yr(Tl(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function Tl(e) {
	return "_value" in e ? e._value : e.value;
}
function El(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var Dl = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Ol = {
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
	exact: (e, t) => Dl.some((n) => e[`${n}Key`] && !t.includes(n))
}, kl = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Ol[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Al = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, jl = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = tr(n.key);
		if (t.some((e) => e === r || Al[e] === r)) return e(n);
	}));
}, Ml = /* @__PURE__ */ In({ patchProp: fl }, Ic), Nl;
function Pl() {
	return Nl ||= Ds(Ml);
}
var Fl = ((...e) => {
	let t = Pl().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Ll(e);
		if (!r) return;
		let i = t._component;
		!M(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Il(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Il(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Ll(e) {
	return Hn(e) ? document.querySelector(e) : e;
}
//#endregion
//#region node_modules/pinia/dist/pinia.mjs
var Rl = typeof window < "u", zl, Bl = (e) => zl = e, Vl = Symbol();
function Hl(e) {
	return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var Ul;
(function(e) {
	e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(Ul ||= {});
var Wl = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null };
function Gl(e, { autoBom: t = !1 } = {}) {
	return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["﻿", e], { type: e.type }) : e;
}
function Kl(e, t, n) {
	let r = new XMLHttpRequest();
	r.open("GET", e), r.responseType = "blob", r.onload = function() {
		Zl(r.response, t, n);
	}, r.onerror = function() {
		console.error("could not download file");
	}, r.send();
}
function ql(e) {
	let t = new XMLHttpRequest();
	t.open("HEAD", e, !1);
	try {
		t.send();
	} catch {}
	return t.status >= 200 && t.status <= 299;
}
function Jl(e) {
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
var Yl = typeof navigator == "object" ? navigator : { userAgent: "" }, Xl = /Macintosh/.test(Yl.userAgent) && /AppleWebKit/.test(Yl.userAgent) && !/Safari/.test(Yl.userAgent), Zl = Rl ? typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !Xl ? Ql : "msSaveOrOpenBlob" in Yl ? $l : eu : () => {};
function Ql(e, t = "download", n) {
	let r = document.createElement("a");
	r.download = t, r.rel = "noopener", typeof e == "string" ? (r.href = e, r.origin === location.origin ? Jl(r) : ql(r.href) ? Kl(e, t, n) : (r.target = "_blank", Jl(r))) : (r.href = URL.createObjectURL(e), setTimeout(function() {
		URL.revokeObjectURL(r.href);
	}, 4e4), setTimeout(function() {
		Jl(r);
	}, 0));
}
function $l(e, t = "download", n) {
	if (typeof e == "string") if (ql(e)) Kl(e, t, n);
	else {
		let t = document.createElement("a");
		t.href = e, t.target = "_blank", setTimeout(function() {
			Jl(t);
		});
	}
	else navigator.msSaveOrOpenBlob(Gl(e, n), t);
}
function eu(e, t, n, r) {
	if (r ||= open("", "_blank"), r && (r.document.title = r.document.body.innerText = "downloading..."), typeof e == "string") return Kl(e, t, n);
	let i = e.type === "application/octet-stream", a = /constructor/i.test(String(Wl.HTMLElement)) || "safari" in Wl, o = /CriOS\/[\d]+/.test(navigator.userAgent);
	if ((o || i && a || Xl) && typeof FileReader < "u") {
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
var { assign: tu } = Object;
function nu() {
	let e = Er(!0), t = e.run(() => /* @__PURE__ */ z({})), n = [], r = [], i = qi({
		install(e) {
			Bl(i), i._a = e, e.provide(Vl, i), e.config.globalProperties.$pinia = i, r.forEach((e) => n.push(e)), r = [];
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
var ru = () => {};
function iu(e, t, n, r = ru) {
	e.add(t);
	let i = () => {
		e.delete(t) && r();
	};
	return !n && Dr() && Or(i), i;
}
function au(e, ...t) {
	e.forEach((e) => {
		e(...t);
	});
}
var ou = (e) => e(), su = Symbol(), cu = Symbol();
function lu(e, t) {
	e instanceof Map && t instanceof Map ? t.forEach((t, n) => e.set(n, t)) : e instanceof Set && t instanceof Set && t.forEach(e.add, e);
	for (let n in t) {
		if (!t.hasOwnProperty(n)) continue;
		let r = t[n], i = e[n];
		Hl(i) && Hl(r) && e.hasOwnProperty(n) && !/* @__PURE__ */ R(r) && !/* @__PURE__ */ Ui(r) ? e[n] = lu(i, r) : e[n] = r;
	}
	return e;
}
var uu = Symbol();
function du(e) {
	return !Hl(e) || !Object.prototype.hasOwnProperty.call(e, uu);
}
var { assign: fu } = Object;
function pu(e) {
	return !!(/* @__PURE__ */ R(e) && e.effect);
}
function mu(e, t, n, r) {
	let { state: i, actions: a, getters: o } = t, s = n.state.value[e], c;
	function l() {
		return s || (n.state.value[e] = i ? i() : {}), fu(/* @__PURE__ */ ea(n.state.value[e]), a, Object.keys(o || {}).reduce((t, r) => (t[r] = qi($(() => {
			Bl(n);
			let t = n._s.get(e);
			return o[r].call(t, t);
		})), t), {}));
	}
	return c = hu(e, l, t, n, r, !0), c;
}
function hu(e, t, n = {}, r, i, a) {
	let o, s = fu({ actions: {} }, n), c = { deep: !0 }, l, u, d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), p = r.state.value[e];
	!a && !p && (r.state.value[e] = {});
	let m;
	function h(t) {
		let n;
		l = u = !1, typeof t == "function" ? (t(r.state.value[e]), n = {
			type: Ul.patchFunction,
			storeId: e,
			events: void 0
		}) : (lu(r.state.value[e], t), n = {
			type: Ul.patchObject,
			payload: t,
			storeId: e,
			events: void 0
		});
		let i = m = Symbol();
		wa().then(() => {
			m === i && (l = !0);
		}), u = !0, au(d, n, r.state.value[e]);
	}
	let g = a ? function() {
		let { state: e } = n, t = e ? e() : {};
		this.$patch((e) => {
			fu(e, t);
		});
	} : ru;
	function _() {
		o.stop(), d.clear(), f.clear(), r._s.delete(e);
	}
	let v = (t, n = "") => {
		if (su in t) return t[cu] = n, t;
		let i = function() {
			Bl(r);
			let n = Array.from(arguments), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
			function s(e) {
				a.add(e);
			}
			function c(e) {
				o.add(e);
			}
			au(f, {
				args: n,
				name: i[cu],
				store: y,
				after: s,
				onError: c
			});
			let l;
			try {
				l = t.apply(this && this.$id === e ? this : y, n);
			} catch (e) {
				throw au(o, e), e;
			}
			return l instanceof Promise ? l.then((e) => (au(a, e), e)).catch((e) => (au(o, e), Promise.reject(e))) : (au(a, l), l);
		};
		return i[su] = !0, i[cu] = n, i;
	}, y = /* @__PURE__ */ zi({
		_p: r,
		$id: e,
		$onAction: iu.bind(null, f),
		$patch: h,
		$reset: g,
		$subscribe(t, n = {}) {
			let i = iu(d, t, n.detached, () => a()), a = o.run(() => Ha(() => r.state.value[e], (r) => {
				(n.flush === "sync" ? u : l) && t({
					storeId: e,
					type: Ul.direct,
					events: void 0
				}, r);
			}, fu({}, c, n)));
			return i;
		},
		$dispose: _
	});
	r._s.set(e, y);
	let b = (r._a && r._a.runWithContext || ou)(() => r._e.run(() => (o = Er()).run(() => t({ action: v }))));
	for (let t in b) {
		let n = b[t];
		/* @__PURE__ */ R(n) && !pu(n) || /* @__PURE__ */ Ui(n) ? a || (p && du(n) && (/* @__PURE__ */ R(n) ? n.value = p[t] : lu(n, p[t])), r.state.value[e][t] = n) : typeof n == "function" && (b[t] = v(n, t), s.actions[t] = n);
	}
	return fu(y, b), fu(/* @__PURE__ */ L(y), b), Object.defineProperty(y, "$state", {
		get: () => r.state.value[e],
		set: (e) => {
			h((t) => {
				fu(t, e);
			});
		}
	}), r._p.forEach((e) => {
		fu(y, o.run(() => e({
			store: y,
			app: r._a,
			pinia: r,
			options: s
		})));
	}), p && a && n.hydrate && n.hydrate(y.$state, p), l = !0, u = !0, y;
}
function gu(e, t, n) {
	let r, i = typeof t == "function";
	r = i ? n : t;
	function a(n, a) {
		let o = za();
		return n ||= o ? Ra(Vl, null) : null, n && Bl(n), n = zl, n._s.has(e) || (i ? hu(e, t, r, n) : mu(e, r, n)), n._s.get(e);
	}
	return a.$id = e, a;
}
function _u(e) {
	let t = /* @__PURE__ */ L(e), n = {};
	for (let r in t) {
		let i = t[r];
		i.effect ? n[r] = $({
			get: () => e[r],
			set(t) {
				e[r] = t;
			}
		}) : (/* @__PURE__ */ R(i) || /* @__PURE__ */ Ui(i)) && (n[r] = /* @__PURE__ */ ra(e, r));
	}
	return n;
}
//#endregion
//#region src/module/apps/npc-builder/functions/create-default-trait-config.ts
function vu() {
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
function yu(e, t) {
	return `${e}:${Tu(t)}`;
}
function bu(e) {
	let t = e.level ?? 1;
	return Number.isFinite(t) ? Math.max(1, Math.floor(t)) * 5 : 5;
}
function xu(e) {
	return e.name;
}
function Su(e, t) {
	return e === "characteristic" ? t.allowBaseActorCharacteristics : e === "skill" ? t.allowBaseActorSkills : t.allowBaseActorTalents;
}
function Cu(e, t) {
	return {
		...vu(),
		...e,
		...t
	};
}
function wu(e, t) {
	return Tu(e) === Tu(t);
}
function Tu(e) {
	return e.trim().toLocaleLowerCase();
}
function Eu(e) {
	return Number.isFinite(e) ? Math.max(1, Math.floor(e)) : 1;
}
function Du(e) {
	let t = 0;
	for (let n of e) t += n.count;
	return t;
}
function Ou(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = Tu(r);
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
//#endregion
//#region src/module/apps/npc-builder/functions/skill-specialization.ts
function ku(e, t, n) {
	return `${e}:${Pu(t)}:${n}`;
}
function Au(e, t) {
	let n = e.trim(), r = t.trim();
	return r ? `${n} (${r})` : n;
}
function ju(e) {
	let t = /^(?<base>.+?)\s*\((?<specialization>[^)]+)\)\s*$/.exec(e.trim());
	if (!t?.groups) return null;
	let n = t.groups.base?.trim() ?? "", r = t.groups.specialization?.trim() ?? "";
	return !n || !r || Mu(e) ? null : {
		baseName: n,
		originalName: e,
		specialization: r
	};
}
function Mu(e) {
	let t = /^(?<base>.+?)\s*\((?<specialization>[^)]+)\)\s*$/.exec(e.trim());
	if (!t?.groups) return null;
	let n = t.groups.base?.trim() ?? "", r = t.groups.specialization?.trim() ?? "", i = Iu(r);
	return !n || !r || !Fu(r, i) ? null : {
		baseName: n,
		options: i,
		originalName: e,
		specialization: r
	};
}
function Nu(e, t) {
	let n = /* @__PURE__ */ new Map();
	return t.map((t) => {
		let r = Pu(t), i = n.get(r) ?? 0;
		return n.set(r, i + 1), {
			occurrence: i,
			originalName: t,
			resolutionKey: ku(e, t, i)
		};
	});
}
function Pu(e) {
	return e.trim().replaceAll(/\s+/g, " ").toLocaleLowerCase();
}
function Fu(e, t) {
	return e.trim().toLocaleLowerCase() === "any" || t.length > 1;
}
function Iu(e) {
	return e.split(/\s+or\s+/i).map((e) => e.trim()).filter(Boolean);
}
//#endregion
//#region src/module/apps/npc-builder/functions/advancements/source-counts.ts
function Lu(e, t) {
	return t <= 0 ? [] : [{
		count: t,
		kind: "career",
		label: `${e} extra time`
	}];
}
function Ru(e, t) {
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
function zu(e, t, n, r) {
	let i = Vu(Bu(e, r), n);
	return i.value === null ? t : Math.min(t, Math.max(0, i.value - e.baseAdvances));
}
function Bu(e, t) {
	let n = t[Tu(e.name)];
	return {
		maximumFormula: e.talentMaximumFormula ?? n?.maximumFormula ?? "",
		maximumKey: e.talentMaximumKey ?? n?.maximumKey ?? ""
	};
}
function Vu(e, t) {
	let n = e.maximumKey.trim().toLocaleLowerCase();
	if (!n) return {
		label: "Unknown",
		value: null
	};
	if (n === "none") return {
		label: "-",
		value: null
	};
	if (n === "custom") return Hu(e.maximumFormula, t);
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
function Hu(e, t) {
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
function Uu(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e.careers) {
		let i = Ou(Ku(r, t, e.skillGrantResolutions)), a = bu(r) / 5, o = Math.max(0, Eu(r.quantity) - 1) * 5;
		for (let e of i) {
			let i = yu(t, e), s = n.get(i);
			if (s) {
				a > s.highestLevel && (s.highestLevel = a, s.highestLevelSource = xu(r)), o > 0 && s.extraSources.push({
					count: o,
					kind: "career",
					label: `${r.name} extra time`
				});
				continue;
			}
			n.set(i, {
				extraSources: Lu(r.name, o),
				highestLevel: a,
				highestLevelSource: xu(r),
				name: e
			});
		}
	}
	for (let r of n.values()) Gu(e, {
		careerValue: r.highestLevel * 5 + Du(r.extraSources),
		kind: t,
		name: r.name,
		sources: [{
			count: r.highestLevel * 5,
			kind: "career",
			label: r.highestLevelSource
		}, ...r.extraSources]
	});
}
function Wu(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.careers) {
		let r = Ou(Ku(n, "talent", e.skillGrantResolutions)), i = Math.max(0, Eu(n.quantity) - 1);
		for (let e of r) {
			let r = yu("talent", e), a = t.get(r);
			if (a) {
				i > 0 && a.extraSources.push({
					count: i,
					kind: "career",
					label: `${n.name} extra time`
				});
				continue;
			}
			t.set(r, {
				extraSources: Lu(n.name, i),
				firstSource: n.name,
				name: e
			});
		}
	}
	for (let n of t.values()) Gu(e, {
		careerValue: 1 + Du(n.extraSources),
		kind: "talent",
		name: n.name,
		sources: [{
			count: 1,
			kind: "career",
			label: n.firstSource
		}, ...n.extraSources]
	}, e.characteristicTotals);
}
function Gu(e, t, n = {}) {
	let r = yu(t.kind, t.name), i = e.entries.get(r);
	if (i) {
		let r = t.kind === "talent" && i.includedFromBase ? t.sources.slice(1) : t.sources, a = t.kind === "talent" ? zu(i, Du(r), n, e.talentMaximums) : t.careerValue;
		i.careerValue = a, i.includedFromCareer = !0, i.sources = [...i.sources.filter((e) => e.kind === "base"), ...Ru(r, a)];
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
	t.kind === "talent" && (a.careerValue = zu(a, t.careerValue, n, e.talentMaximums), a.current = a.careerValue, a.sources = Ru(t.sources, a.careerValue)), e.entries.set(r, { ...a });
}
function Ku(e, t, n) {
	return t === "characteristic" ? e.grants.characteristics : t === "skill" ? Nu(e.uuid, e.grants.skills).map((e) => n[e.resolutionKey] || e.originalName) : e.grants.talents;
}
//#endregion
//#region src/module/apps/npc-builder/functions/advancements/entry-context.ts
function qu(e, t) {
	let n = {};
	for (let r of e.values()) {
		if (r.kind !== "characteristic") continue;
		let e = w[Tu(r.name)];
		if (!e) continue;
		let i = t[yu(r.kind, r.name)] ?? 0, a = Math.max(r.minimumCurrent, Math.floor(r.careerValue + i));
		n[e] = Math.max(0, r.baseValue + a);
	}
	return n;
}
function Ju(e, t, n) {
	return e.kind === "skill" ? Yu(e, t, n) : e.kind === "talent" ? Xu(e, t, n) : e;
}
function Yu(e, t, n) {
	let r = Zu(e) ?? Qu(e.name, n.skillCharacteristics) ?? $u(e.name, n.baseActorDraftData);
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
function Xu(e, t, n) {
	let r = Bu(e, n.talentMaximums), i = Vu(r, t);
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
function Zu(e) {
	return !e.characteristicKey || !e.characteristicName ? null : {
		characteristicKey: e.characteristicKey,
		characteristicName: e.characteristicName,
		skillName: e.name
	};
}
function Qu(e, t) {
	return t[Tu(e)] ?? null;
}
function $u(e, t) {
	let n = t.advancements.find((t) => t.kind === "skill" && wu(t.name, e));
	return n?.characteristicKey ? {
		characteristicKey: n.characteristicKey,
		characteristicName: n.characteristicName ?? C[n.characteristicKey],
		skillName: e
	} : null;
}
//#endregion
//#region src/module/apps/npc-builder/functions/advancements/derive-advancements.ts
function ed(e) {
	let t = ad(e.baseActorDraftData), n = {
		careers: e.careers,
		entries: t,
		skillGrantResolutions: e.skillGrantResolutions,
		talentMaximums: e.talentMaximums
	};
	Uu(n, "characteristic"), Uu(n, "skill");
	let r = qu(t, e.manualAdvancementDeltas);
	return Wu({
		...n,
		characteristicTotals: r
	}), od(t, e.customAdvancements), [...t.values()].filter((t) => t.includedFromCareer || t.includedFromCustom || Su(t.kind, e.settings)).map((t) => {
		let n = Ju(t, r, e), i = yu(t.kind, t.name), a = e.manualAdvancementDeltas[i] ?? 0, o = n.careerValue + a;
		return {
			...n,
			current: Math.max(n.minimumCurrent, Math.floor(o))
		};
	}).sort(sd);
}
function td(e, t) {
	let n = Number.isFinite(t) ? t : 0;
	return Math.max(e.minimumCurrent, Math.floor(n)) - e.careerValue;
}
function nd(e, t) {
	let n = Number.isFinite(t) ? t : 0;
	return td(e, Math.max(e.minimumTotal, Math.floor(n)) - e.baseValue);
}
function rd(e, t) {
	return {
		...e,
		...Object.fromEntries(t.map((e) => [Tu(e.skillName), e]))
	};
}
function id(e, t) {
	return {
		...e,
		...Object.fromEntries(t.map((e) => [Tu(e.talentName), e]))
	};
}
function ad(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.advancements) {
		let e = yu(n.kind, n.name), r = {
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
function od(e, t) {
	for (let n of t) {
		let t = yu(n.kind, n.name), r = {
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
function sd(e, t) {
	return e.kind === t.kind ? e.name.localeCompare(t.name) : e.kind.localeCompare(t.kind);
}
//#endregion
//#region src/module/apps/npc-builder/functions/advancements/advancement-actions.ts
function cd(e) {
	return e.kind === "talent" ? 1 : 5;
}
function ld(e) {
	return Math.max(e.minimumTotal, e.baseValue + e.current);
}
function ud(e, t) {
	return ld(e) + t * cd(e);
}
function dd(e) {
	return ld(e);
}
function fd(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" && dd(e) < t;
}
function pd(e) {
	return e.filter((e) => e.kind === "talent" && fd(e)).map((e) => ({
		kind: e.kind,
		name: e.name,
		total: e.talentMaximumValue
	}));
}
function md(e, t) {
	let n = new Map(e.map((e) => [gd(e), e])), r = [];
	for (let e of t) {
		let t = n.get(gd(e));
		!t || t.current === e.current || r.push({
			current: e.current,
			kind: t.kind,
			name: t.name
		});
	}
	return r;
}
function hd(e, t) {
	return e.find((e) => e.kind === t.kind && e.name === t.name) ?? null;
}
function gd(e) {
	return `${e.kind}:${e.name}`;
}
//#endregion
//#region src/module/apps/npc-builder/functions/xp-cost.ts
var _d = {
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
function vd(e) {
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
		let e = Od(r), i = e + r.current;
		if (r.kind === "characteristic") {
			let a = w[Tu(r.name)];
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
	return yd(n, t);
}
function yd(e, t) {
	let n = Cd(e, t), r = wd(e.skills, t.skills, _d.skill), i = Td(e.talents, t.talents);
	return {
		characteristics: n,
		skills: r,
		talents: i,
		total: n + r + i
	};
}
function bd(e) {
	let t = Math.max(0, Math.floor(e.current));
	return e.kind === "talent" ? Sd(t) : xd(t, e.kind === "characteristic" ? _d.characteristic : _d.skill);
}
function xd(e, t) {
	let n = Math.max(0, Math.floor(e)), r = 0;
	for (let e = 0; e < n; e += 1) {
		let n = Math.min(Math.floor(e / 5), t.length - 1);
		r += t[n] ?? 0;
	}
	return r;
}
function Sd(e, t = 0) {
	let n = Math.max(0, Math.floor(e)), r = Math.max(0, Math.floor(t)), i = 0;
	for (let e = 0; e < n; e += 1) i += (r + e + 1) * 100;
	return i;
}
function Cd(e, t) {
	let n = 0;
	for (let r of Object.keys(C)) {
		let i = r, a = Dd(e.characteristics[i] ?? 0, t.characteristics[i] ?? 0);
		n += xd(a, _d.characteristic);
	}
	return n;
}
function wd(e, t, n) {
	let r = Ed(e), i = Ed(t), a = 0;
	for (let [e, t] of r) {
		let r = Dd(t, i.get(e) ?? 0);
		a += xd(r, n);
	}
	return a;
}
function Td(e, t) {
	let n = Ed(e), r = Ed(t), i = 0;
	for (let [e, t] of n) {
		let n = Dd(t, r.get(e) ?? 0);
		i += Sd(n);
	}
	return i;
}
function Ed(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = Tu(n.name), r = Math.floor(n.value);
		e && t.set(e, (t.get(e) ?? 0) + r);
	}
	return t;
}
function Dd(e, t) {
	return Math.max(0, Math.floor(e) - Math.floor(t));
}
function Od(e) {
	return e.kind === "characteristic" ? Math.floor(e.baseValue) : e.kind === "skill" ? Math.floor(e.baseAdvances + (e.baseModifier ?? 0)) : Math.floor(e.baseAdvances);
}
//#endregion
//#region src/module/apps/npc-builder/state/advancements/index.ts
function kd(e) {
	let { baseActorDraftData: t, careers: n, customAdvancements: r, manualAdvancementDeltas: i, settings: a, skillCharacteristics: o, skillGrantResolutions: s, talentMaximums: c } = e, l = $(() => ed({
		baseActorDraftData: t.value,
		careers: n.value,
		customAdvancements: r.value,
		manualAdvancementDeltas: i.value,
		settings: a.value,
		skillCharacteristics: o.value,
		skillGrantResolutions: s.value,
		talentMaximums: c.value
	})), u = $(() => vd(l.value)), d = $(() => pd(l.value).length);
	function f(e) {
		let t = yu(e.kind, e.name);
		r.value.some((e) => yu(e.kind, e.name) === t) || r.value.push(e);
	}
	function p(e) {
		let t = yu(e.kind, e.name);
		r.value = r.value.filter((e) => yu(e.kind, e.name) !== t), delete i.value[t];
	}
	function m(e, t) {
		x(e, ud(e, t));
	}
	function h() {
		for (let e of pd(l.value)) {
			let t = hd(l.value, e);
			t && x(t, e.total);
		}
	}
	function g(e, t) {
		let n = Math.max(0, Math.floor(Number.isFinite(t) ? t : 0)), r = e.run({ advancements: l.value }, n), i = md(l.value, r.advancements);
		for (let e of i) {
			let t = hd(l.value, e);
			t && b(t, e.current);
		}
	}
	function _(e) {
		return s.value[e] ?? "";
	}
	function v(e) {
		o.value = rd(o.value, e);
	}
	function y(e) {
		c.value = id(c.value, e);
	}
	function b(e, t) {
		let n = yu(e.kind, e.name);
		i.value[n] = td(e, t);
	}
	function x(e, t) {
		let n = yu(e.kind, e.name);
		i.value[n] = nd(e, t);
	}
	function S(e) {
		let t = yu(e.kind, e.name);
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
function Ad(e, t) {
	return e.find((e) => e.uuid === t) ?? null;
}
function jd(e) {
	return e.at(-1) ?? null;
}
function Md(e) {
	let t = e.finalCareer?.name, n = e.settings.includeSpeciesInName && e.selectedBaseActor?.species ? e.selectedBaseActor.species : "";
	return t && n ? `${n} ${t}` : t || (e.selectedBaseActor ? `${e.selectedBaseActor.name} NPC` : "New NPC");
}
function Nd(e, t) {
	return e.trim() || t;
}
function Pd(e) {
	return e.finalCareer?.img || e.selectedBaseActor?.prototypeTokenImg || e.selectedBaseActor?.img || "";
}
function Fd(e, t) {
	return e || t;
}
function Id(e) {
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
function Ld(e) {
	let { actorName: t, baseActors: n, careers: r, clearBaseDraftData: i, clearMountSelection: a, customAdvancements: o, customSpells: s, customTraits: c, customTrappings: l, detectedSpells: u, ignoredBaseTraitKeys: d, magicLoreResolutions: f, removeSkillGrantResolutionsForCareer: p, selectedBaseActorUuid: m, selectedPortraitPath: h, settings: g, skillGrantResolutions: _, spellSelectionOverrides: v } = e, y = $(() => Ad(n.value, m.value)), b = $(() => jd(r.value)), x = $(() => Md({
		finalCareer: b.value,
		selectedBaseActor: y.value,
		settings: g.value
	})), S = $(() => Nd(t.value, x.value)), C = $(() => Pd({
		finalCareer: b.value,
		selectedBaseActor: y.value
	})), w = $(() => Fd(h.value, C.value)), ee = $(() => Id(r.value));
	function te(e) {
		let t = r.value.find((t) => t.uuid === e.uuid);
		if (t) {
			t.quantity = Eu(t.quantity + 1);
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
		n && (n.quantity = Eu(t));
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
function Rd(e) {
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
function zd(e) {
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
function Bd(e) {
	return e.sourceFilter ? e.sourceFilter : e.sourceGroup ? {
		label: Ud(e.sourceGroup),
		value: e.sourceGroup
	} : null;
}
function Vd(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = Bd(n);
		e && !t.has(e.value) && t.set(e.value, e);
	}
	return [...t.values()];
}
function Hd(e) {
	return {
		label: `Priority Folder: ${e.split("/").filter(Boolean).slice(-2).join("/") || e}`,
		value: `priority-folder:${e.toLocaleLowerCase()}`
	};
}
function Ud(e) {
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
function Wd(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = Jd(r.img);
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
function Gd(e) {
	let t = Wd(Kd([...e.assetCandidates, ...e.immediateCandidates]));
	return !e.selectedPortraitPath || t.some((t) => Jd(t.img) === Jd(e.selectedPortraitPath)) ? t : [{
		img: e.selectedPortraitPath,
		key: `selected:${e.selectedPortraitPath}`,
		label: "Selected portrait",
		source: "foundry-asset",
		sourceLabel: "Selected"
	}, ...t];
}
function Kd(e) {
	return e.map((e, t) => ({
		candidate: e,
		index: t
	})).sort((e, t) => qd(e.candidate) - qd(t.candidate) || e.index - t.index).map(({ candidate: e }) => e);
}
function qd(e) {
	return e.sourceFilter?.value.startsWith("priority-folder:") ? 0 : e.sourceGroup ? {
		career: 1,
		compendiums: 2,
		world: 3,
		"dig-down": 4
	}[e.sourceGroup] ?? 5 : 5;
}
function Jd(e) {
	return e.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/functions/portrait-gallery/index.ts
var Yd = new Set([
	"and",
	"any",
	"the",
	"with",
	"without",
	"of",
	"or",
	"npc"
]), Xd = "portrait-gallery-filter:", Zd = "modules/wfrp4e-core/art/careers", Qd = [
	"modules/wfrp4e-core/art/bestiary",
	"modules/wfrp4e-core/tokens",
	"modules/wfrp4e-core/tokens/popout"
], $d = ["systems/wfrp4e/tokens/unknown.png"], ef = "application/x-wfrp4e-customizer-portrait-filter-tag";
function tf(e) {
	return bf(yf(e).filter((e) => e.length >= 3 && !Yd.has(e)));
}
function nf(e) {
	return bf(e.flatMap(tf));
}
function rf(e) {
	if (!Array.isArray(e)) return [];
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		if (typeof r != "string") continue;
		let e = r.trim().replaceAll("\\", "/").replace(/^\/+|\/+$/gu, ""), i = e.toLocaleLowerCase();
		e && !t.has(i) && (t.add(i), n.push(e));
	}
	return n;
}
function af(e) {
	return rf([
		...e.hasCareer ? [Zd] : [],
		...Qd,
		...e.configuredFolders
	]);
}
function of(e, t, n) {
	return e.filter((e) => (t[e] ?? "search") === n);
}
function sf(e, t) {
	let n = vf(e);
	return !!(n && t.some((e) => n.includes(e)));
}
function cf(e, t) {
	let n = _f(e), r = Bd(e), i = t.mustIncludeSources.length === 0 || r !== null && t.mustIncludeSources.includes(r.value), a = r !== null && t.mustExcludeSources.includes(r.value);
	return t.mustIncludeTerms.every((e) => n.includes(e)) && t.mustExcludeTerms.every((e) => !n.includes(e)) && i && !a;
}
function lf(e) {
	return `${Xd}${e}`;
}
function uf(e) {
	return e.startsWith(Xd) ? e.slice(24) : null;
}
function df(e) {
	return e.hasEnabledSource && e.hasSubject && e.searchTerms.length > 0;
}
function ff(e) {
	return e ? e.maxDirectories <= 0 ? e.phase === "ready" ? 100 : 4 : Math.min(100, Math.round(e.directoriesVisited / e.maxDirectories * 100)) : 0;
}
function pf(e) {
	return e ? e.phase === "ready" ? `${e.candidatesFound} options found` : e.phase === "filesystem" ? e.maxDirectories <= 0 ? `${e.directoriesVisited} directories - ${e.currentLocation}` : `${e.directoriesVisited}/${e.maxDirectories} directories - ${e.currentLocation}` : e.currentLocation : "";
}
function mf(e) {
	return `${e.label}\n${e.img}`;
}
function hf(e) {
	return `Use ${e.label} (${gf(e)})`;
}
function gf(e) {
	return e.sourceLabel ?? {
		"base-actor": "Actor Portrait",
		"base-token": "Prototype Token",
		career: "Career",
		"foundry-asset": "Foundry",
		web: "Web"
	}[e.source];
}
function _f(e) {
	return vf([
		e.label,
		e.img,
		e.sourceLabel ?? ""
	].filter(Boolean).join(" "));
}
function vf(e) {
	return e.trim().toLocaleLowerCase().replaceAll(/[_-]/g, " ").replaceAll(/[(),.:;[\]]/g, " ").replaceAll(/\s+/g, " ");
}
function yf(e) {
	return vf(e).split(" ").filter(Boolean);
}
function bf(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/module/state/portrait-gallery/filters.ts
function xf() {
	let e = /* @__PURE__ */ z([]), t = /* @__PURE__ */ z({}), n = /* @__PURE__ */ z({});
	function r(t) {
		let r = new Set(e.value), i = tf(t).filter((e) => !r.has(e));
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
function Sf() {
	return xf();
}
//#endregion
//#region src/module/apps/npc-builder/functions/default-npc-builder-settings.ts
function Cf() {
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
		excludedPortraitReferenceImages: [...$d],
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
var wf = Cf(), Tf = {
	advancements: [],
	optionalTraits: [],
	traits: [],
	trappings: []
}, Ef = /\(([^)]+)\)/, Df = [
	"beasts",
	"death",
	"fire",
	"heavens",
	"metal",
	"life",
	"light",
	"shadow"
], Of = [
	"daemonology",
	"necromancy",
	"nurgle",
	"slaanesh",
	"tzeentch",
	"undivided"
];
function kf(e, t) {
	let n = e.trim(), r = n.toLocaleLowerCase();
	return r === "petty magic" ? If({
		kind: "petty-magic",
		rawLore: "Petty Magic",
		source: t,
		sourceName: n
	}) : r.startsWith("arcane magic") ? If({
		kind: "arcane-magic",
		rawLore: Lf(n),
		source: t,
		sourceName: n
	}) : r.startsWith("spellcaster") ? If({
		kind: "spellcaster",
		rawLore: Lf(n),
		source: t,
		sourceName: n
	}) : null;
}
function Af(e) {
	return e.trim().replace(/^any\s+/i, "").replace(/^arcane\s+lore\s+of\s+/i, "").replace(/^arcane\s+lore$/i, "").replace(/^lore\s+of\s+/i, "").replaceAll(/\s+/g, " ").toLocaleLowerCase();
}
function jf(e) {
	return `${e.source}:${e.kind}:${e.sourceName}:${e.rawLore}`;
}
function Mf(e, t) {
	return {
		...e,
		isAmbiguous: !1,
		normalizedLore: Af(t),
		rawLore: t.trim()
	};
}
function Nf(e) {
	let t = Af(e);
	return t === "petty" ? "petty" : Df.includes(t) ? "eight-wind" : Of.includes(t) ? "dark" : "other";
}
function Pf(e, t) {
	if (e.kind === "petty-magic") return t.filter((e) => e.category === "petty");
	let n = e.rawLore.trim().toLocaleLowerCase();
	return n.includes("dark") ? t.filter((e) => e.category === "dark") : n.includes("eight winds") ? t.filter((e) => e.category === "eight-wind") : t.filter((e) => e.category !== "petty");
}
function Ff(e) {
	let t = e.trim().toLocaleLowerCase();
	return !t || t === "any" || t.includes("any ");
}
function If(e) {
	let t = e.rawLore.trim();
	return {
		isAmbiguous: Ff(t),
		kind: e.kind,
		normalizedLore: Af(t),
		rawLore: t,
		resolutionKey: jf({
			kind: e.kind,
			rawLore: t,
			source: e.source,
			sourceName: e.sourceName
		}),
		source: e.source,
		sourceName: e.sourceName
	};
}
function Lf(e) {
	return Ef.exec(e)?.[1]?.trim() ?? "";
}
//#endregion
//#region src/module/apps/npc-builder/functions/spells/derive-magic-grants.ts
function Rf(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.advancements) n.kind !== "talent" || n.baseAdvances + n.current <= 0 || zf(t, kf(n.name, "talent"), e);
	for (let n of e.traits) zf(t, kf(n.name, "trait"), e);
	return [...t.values()];
}
function zf(e, t, n) {
	if (!t) return;
	let r = n.loreResolutions[t.resolutionKey];
	e.set(t.resolutionKey, r ? Mf(t, r) : t);
}
//#endregion
//#region src/module/apps/npc-builder/functions/spells/derive-spells.ts
function Bf(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.detectedSpells) t.set(n.key, {
		...n,
		selected: e.selectionOverrides[n.key] ?? e.autoSelectDetectedSpells
	});
	for (let n of e.customSpells) t.set(n.key, {
		...n,
		selected: e.selectionOverrides[n.key] ?? n.selected
	});
	return [...t.values()].sort(Gf);
}
function Vf(e) {
	return e.filter((e) => e.selected);
}
function Hf(e) {
	return e.spells.map((t) => ({
		...t,
		selected: e.selectionOverrides[t.key] ?? e.autoSelectDetectedSpells
	}));
}
function Uf(e) {
	let t = e.detectedSpells.find((t) => Wf(t, e.spell));
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
function Wf(e, t) {
	return e.sourceUuid && e.sourceUuid === t.sourceUuid ? !0 : wu(e.name, t.name);
}
function Gf(e, t) {
	return e.loreName === t.loreName ? e.name.localeCompare(t.name) : e.loreName.localeCompare(t.loreName);
}
//#endregion
//#region src/module/apps/npc-builder/state/spells.ts
function Kf(e) {
	let { advancements: t, customSpells: n, detectedSpells: r, magicLoreResolutions: i, settings: a, spellSelectionOverrides: o, traits: s } = e, c = $(() => Rf({
		advancements: t.value,
		loreResolutions: i.value,
		traits: s.value
	})), l = $(() => c.value.length > 0), u = $(() => Bf({
		autoSelectDetectedSpells: a.value.autoSelectGrantedSpells,
		customSpells: n.value,
		detectedSpells: r.value,
		selectionOverrides: o.value
	})), d = $(() => Vf(u.value));
	function f(e) {
		let t = Uf({
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
		r.value = Hf({
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
function qf(e) {
	let t = /* @__PURE__ */ new Map();
	if (e.allowBaseActorTraits) for (let n of e.baseActorDraftData.traits) {
		let r = Zf(n);
		e.ignoredBaseTraitKeys[r] || t.set(r, ep(n, r, !1));
	}
	for (let n of e.customTraits) $f([...t.values()], n.name) || t.set(n.key, { ...n });
	return [...t.values()].map((t) => ({
		...t,
		config: Cu(t.config, e.traitConfigOverrides[t.key])
	})).sort(tp);
}
function Jf(e) {
	return e.allowBaseActorTraits ? [...e.baseActorDraftData.traits.filter((t) => e.ignoredBaseTraitKeys[Zf(t)]).map((t) => {
		let n = Zf(t);
		return {
			...ep(t, n, !0),
			config: Cu(t.config, e.traitConfigOverrides[n])
		};
	}), ...e.selectedTraits] : e.selectedTraits;
}
function Yf(e) {
	return e.optionalTraits.map((e) => ({
		config: e.config,
		img: e.img,
		name: e.name,
		uuid: e.uuid
	})).sort((e, t) => e.name.localeCompare(t.name));
}
function Xf(e, t) {
	return {
		config: t.config,
		ignored: !1,
		key: `${e}:${t.uuid || Tu(t.name)}`,
		name: t.name,
		source: e,
		sourceUuid: t.uuid
	};
}
function Zf(e) {
	return `base:${e.uuid || Tu(e.name)}`;
}
function Qf(e, t) {
	return e.find((e) => wu(e.name, t));
}
function $f(e, t) {
	return Qf(e, t) !== void 0;
}
function ep(e, t, n) {
	return {
		config: e.config,
		ignored: n,
		key: t,
		name: e.name,
		source: "base",
		sourceUuid: e.uuid
	};
}
function tp(e, t) {
	return e.source === t.source ? e.name.localeCompare(t.name) : e.source.localeCompare(t.source);
}
//#endregion
//#region src/module/apps/npc-builder/state/traits.ts
function np(e) {
	let { baseActorDraftData: t, customTraits: n, ignoredBaseTraitKeys: r, quickTraits: i, settings: a, traitConfigOverrides: o } = e, s = $(() => qf({
		allowBaseActorTraits: a.value.allowBaseActorTraits,
		baseActorDraftData: t.value,
		customTraits: n.value,
		ignoredBaseTraitKeys: r.value,
		traitConfigOverrides: o.value
	})), c = $(() => Jf({
		allowBaseActorTraits: a.value.allowBaseActorTraits,
		baseActorDraftData: t.value,
		ignoredBaseTraitKeys: r.value,
		selectedTraits: s.value,
		traitConfigOverrides: o.value
	})), l = $(() => Yf(t.value));
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
		let i = Xf(e, t);
		if (!r) {
			d(i.key), x(t.name, !0);
			return;
		}
		x(t.name, !1) || n.value.find((e) => e.key === i.key) || h(i);
	}
	function h(e) {
		$f(s.value, e.name) || n.value.some((t) => t.key === e.key) || n.value.push(e);
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
		return Qf(l.value, e);
	}
	function y(e) {
		return Qf(i.value, e);
	}
	function b(e) {
		let n = Qf(t.value.traits, e);
		if (!n) return null;
		let i = Zf(n);
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
function rp(e, t = "trapping") {
	return {
		candidates: [],
		searchTerms: sp(e),
		selectedCandidateUuid: "",
		selectedItemType: t,
		selectedName: e.trim(),
		status: "fallback"
	};
}
function ip(e) {
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
function ap(e) {
	return {
		candidates: [],
		searchTerms: sp(e),
		selectedCandidateUuid: "",
		selectedItemType: "trapping",
		selectedName: e.trim(),
		status: "unresolved"
	};
}
function op(e, t) {
	let n = sp(e), r = lp(n, t), i = r.filter((e) => e.matchKind === "exact");
	return i.length === 1 ? dp("matched", n, i[0]) : i.length > 1 ? dp("ambiguous", n, i[0], { candidates: r }) : r.length ? {
		candidates: r,
		searchTerms: n,
		selectedCandidateUuid: "",
		selectedItemType: "trapping",
		selectedName: e.trim(),
		status: "ambiguous"
	} : rp(e);
}
function sp(e) {
	let t = e.split(/\s+or\s+/i).map((e) => e.trim()).filter(Boolean);
	return t.length ? hp(t) : [e.trim()].filter(Boolean);
}
function cp(e, t) {
	if (fp(e) === fp(t)) return "exact";
	let n = pp(e), r = pp(t);
	if (!n || !r) return null;
	if (n === r || n.includes(r) || r.includes(n)) return "near";
	let i = n.split(" "), a = new Set(r.split(" "));
	return i.every((e) => a.has(e)) ? "near" : null;
}
function lp(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) for (let e of t) {
		let t = cp(r, e.name);
		t && n.get(e.uuid)?.matchKind !== "exact" && n.set(e.uuid, {
			itemType: e.itemType,
			matchKind: t,
			name: e.name,
			searchTerm: r,
			sourceLabel: e.sourceLabel,
			uuid: e.uuid
		});
	}
	return [...n.values()].sort(up);
}
function up(e, t) {
	return e.matchKind === t.matchKind ? e.name.localeCompare(t.name) : e.matchKind === "exact" ? -1 : 1;
}
function dp(e, t, n, r = {}) {
	return {
		candidates: r.candidates ?? (n ? [n] : []),
		searchTerms: t,
		selectedCandidateUuid: n?.uuid ?? "",
		selectedItemType: n?.itemType ?? "trapping",
		selectedName: n?.name ?? "",
		status: e
	};
}
function fp(e) {
	return e.trim().toLocaleLowerCase().replaceAll(/\s+/g, " ");
}
function pp(e) {
	return fp(e).replaceAll("&", " and ").replaceAll(/[(),.:;[\]]/g, " ").replaceAll(/\b(a|an|the|some|pair of|pairs of)\b/g, " ").split(/\s+/).map(mp).filter(Boolean).join(" ");
}
function mp(e) {
	return e.endsWith("ies") && e.length > 4 ? `${e.slice(0, -3)}y` : e.endsWith("s") && !e.endsWith("ss") && e.length > 3 ? e.slice(0, -1) : e;
}
function hp(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/module/apps/npc-builder/functions/trappings/derive-trappings.ts
function gp(e) {
	let t = /* @__PURE__ */ new Map();
	yp(t, e), bp(t, e);
	for (let n of e.customTrappings) t.set(n.key, { ...n });
	return [...t.values()].map((t) => xp(t, e)).sort(Sp);
}
function _p(e, t) {
	let n = e.resolution.candidates.find((e) => e.uuid === t);
	return n ? {
		...e.resolution,
		selectedCandidateUuid: n.uuid,
		selectedItemType: n.itemType,
		selectedName: n.name,
		status: e.resolution.status === "matched" ? "matched" : "ambiguous"
	} : null;
}
function vp(e) {
	return {
		...rp(e.name, e.itemType),
		candidates: e.resolution.candidates,
		searchTerms: e.resolution.searchTerms
	};
}
function yp(e, t) {
	if (t.settings.allowBaseActorTrappings) for (let n of t.baseActorDraftData.trappings) {
		let t = `base:${n.uuid || Tu(n.name)}`;
		e.set(t, {
			ignored: !1,
			itemType: n.itemType,
			key: t,
			name: n.name,
			quantity: n.quantity,
			resolution: ip({
				itemType: n.itemType,
				name: n.name,
				uuid: n.uuid
			}),
			source: "base",
			sourceUuid: n.uuid
		});
	}
}
function bp(e, t) {
	for (let n of t.careers) for (let r of n.grants.trappings) {
		let i = `career:${Tu(r)}`, a = e.get(i);
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
			resolution: t.trappingResolutionOverrides[i] ?? ap(r),
			source: "career",
			sourceUuid: ""
		});
	}
}
function xp(e, t) {
	let n = t.trappingOverrides[e.key];
	return {
		...e,
		ignored: n?.ignored ?? e.ignored,
		quantity: Eu(n?.quantity ?? e.quantity),
		resolution: t.trappingResolutionOverrides[e.key] ?? e.resolution
	};
}
function Sp(e, t) {
	return e.source === t.source ? e.name.localeCompare(t.name) : e.source.localeCompare(t.source);
}
//#endregion
//#region src/module/apps/npc-builder/state/trappings.ts
function Cp(e) {
	let { baseActorDraftData: t, careers: n, customTrappings: r, settings: i, trappingOverrides: a, trappingResolutionOverrides: o } = e, s = $(() => gp({
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
			quantity: Eu(t)
		};
	}
	function f(e, t) {
		let n = s.value.find((t) => t.key === e), r = n ? _p(n, t) : null;
		r && (o.value[e] = r);
	}
	function p(e) {
		let t = s.value.find((t) => t.key === e);
		t && (o.value[e] = vp(t));
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
var wp = gu("npc-builder", () => {
	let e = /* @__PURE__ */ z(""), t = /* @__PURE__ */ z([]), n = /* @__PURE__ */ z({}), r = /* @__PURE__ */ z(null), i = /* @__PURE__ */ z({ ...Tf }), a = /* @__PURE__ */ z([]), o = /* @__PURE__ */ z([]), s = /* @__PURE__ */ z([]), c = /* @__PURE__ */ z([]), l = /* @__PURE__ */ z([]), u = /* @__PURE__ */ z(null), d = /* @__PURE__ */ z([]), f = /* @__PURE__ */ z([]), p = /* @__PURE__ */ z(""), m = /* @__PURE__ */ z({ ...wf }), h = /* @__PURE__ */ z(""), g = /* @__PURE__ */ z(""), _ = /* @__PURE__ */ z({}), v = /* @__PURE__ */ z({}), y = /* @__PURE__ */ z({}), b = /* @__PURE__ */ z([]), x = /* @__PURE__ */ z([]), S = /* @__PURE__ */ z([]), C = /* @__PURE__ */ z({}), w = /* @__PURE__ */ z({}), ee = /* @__PURE__ */ z({}), te = /* @__PURE__ */ z({}), ne = /* @__PURE__ */ z({}), re = /* @__PURE__ */ z({}), T = kd({
		baseActorDraftData: i,
		careers: o,
		customAdvancements: S,
		manualAdvancementDeltas: n,
		settings: m,
		skillCharacteristics: _,
		skillGrantResolutions: y,
		talentMaximums: v
	}), ie = Sf(), E = Rd({
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
	}), ae = zd({
		baseActorCombatProfile: r,
		mountActorProfile: u,
		mountActors: d,
		selectedMountActorUuid: g
	}), D = Ld({
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
	}), O = np({
		baseActorDraftData: i,
		customTraits: s,
		ignoredBaseTraitKeys: C,
		quickTraits: f,
		settings: m,
		traitConfigOverrides: te
	}), oe = Cp({
		baseActorDraftData: i,
		careers: o,
		customTrappings: c,
		settings: m,
		trappingOverrides: ne,
		trappingResolutionOverrides: re
	}), se = Kf({
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
}), Tp = { class: "dui-fieldset-legend" }, Ep = [
	"checked",
	"disabled",
	"onChange"
], Dp = { class: "dui-card-actions" }, Op = /* @__PURE__ */ U({
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
			Y("p", null, F(e.prompt.droppedCareer.name) + " appears to belong to the " + F(e.prompt.droppedCareer.careerGroup) + " career track. The following lower-tier candidates were found. ", 1),
			(K(!0), q(G, null, W(e.candidateGroups, (t) => (K(), q("fieldset", {
				key: t.level,
				class: "dui-fieldset"
			}, [Y("legend", Tp, "Tier " + F(t.level || "Unknown"), 1), (K(!0), q(G, null, W(t.candidates, (t) => (K(), q("label", {
				key: t.uuid,
				class: "dui-label"
			}, [Y("input", {
				class: "dui-checkbox dui-checkbox-sm",
				checked: e.isCareerQueued(t.uuid) || e.isLowerCareerSelected(t.uuid),
				disabled: e.isCareerQueued(t.uuid),
				type: "checkbox",
				onChange: (e) => r(t, e)
			}, null, 40, Ep), Y("span", null, [Y("strong", null, F(t.name), 1), Y("small", null, [Z(F(t.careerGroup || "Career") + " ", 1), e.isCareerQueued(t.uuid) ? (K(), q(G, { key: 0 }, [Z(" already queued ")], 64)) : Q("", !0)])])]))), 128))]))), 128)),
			Y("div", Dp, [Y("button", {
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
}), kp = ["aria-labelledby"], Ap = ["id"], jp = { class: "dui-modal-action" }, Mp = /* @__PURE__ */ U({
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
		let n = e, r = t, i = /* @__PURE__ */ z(null), a = Xa();
		return Ha(() => n.open, async (e) => {
			await wa();
			let t = i.value;
			if (e && !t?.open) {
				t?.showModal();
				return;
			}
			!e && t?.open && t.close();
		}, { immediate: !0 }), ho(() => {
			i.value?.open && i.value.close();
		}), (t, n) => (K(), q("dialog", {
			ref_key: "dialogElement",
			ref: i,
			"aria-labelledby": B(a),
			"aria-modal": "true",
			class: "dui-modal",
			onCancel: n[1] ||= kl((e) => r("close"), ["prevent"])
		}, [Y("section", { class: P(["dui-modal-box", { "app:max-w-5xl": e.wide }]) }, [
			Y("h2", {
				id: B(a),
				class: "dui-card-title"
			}, F(e.title), 9, Ap),
			So(t.$slots, "default"),
			Y("div", jp, [Y("button", {
				class: "dui-btn",
				type: "button",
				onClick: n[0] ||= (e) => r("close")
			}, F(e.closeLabel), 1)])
		], 2)], 40, kp));
	}
}), Np = /* @__PURE__ */ new Map();
function Pp(e) {
	let t = e.id.trim();
	if (!t) throw Error("NPC auto-advance strategies must have an id.");
	Np.set(t, {
		...e,
		id: t
	});
}
function Fp() {
	return [...Np.values()].sort((e, t) => e.name.localeCompare(t.name));
}
function Ip(e) {
	return Np.get(e) ?? null;
}
function Lp(e, t) {
	return Bp(e, t, {
		kinds: ["skill"],
		respectTalentMaximums: !1
	});
}
function Rp(e, t) {
	return Bp(Bp(e, t, {
		kinds: ["talent"],
		respectTalentMaximums: !0
	}), t, {
		kinds: ["skill"],
		respectTalentMaximums: !1
	});
}
function zp(e, t) {
	return Bp(e, t, {
		kinds: ["characteristic"],
		respectTalentMaximums: !1
	});
}
function Bp(e, t, n) {
	let r = Math.max(0, Math.floor(Number.isFinite(t) ? t : 0)), i = Up(e.advancements), a = vd(i).total;
	if (a >= r) return { advancements: i };
	let o = !0;
	for (; o;) {
		o = !1;
		for (let e of i) {
			if (!n.kinds.includes(e.kind)) continue;
			let t = Vp(e, n);
			if (!t) continue;
			let i = bd(t) - bd(e);
			i <= 0 || a + i > r || (e.current = t.current, a += i, o = !0);
		}
	}
	return { advancements: i };
}
function Vp(e, t) {
	return t.respectTalentMaximums && e.kind === "talent" && !Hp(e) ? null : {
		...e,
		current: e.current + cd(e)
	};
}
function Hp(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" ? ld(e) < t : !1;
}
function Up(e) {
	return e.map((e) => ({
		...e,
		sources: e.sources.map((e) => ({ ...e }))
	}));
}
Pp({
	description: "Cycles visible Skill rows evenly until no next skill increase fits the target XP.",
	id: "skill-master",
	name: "Skill Master",
	run: Lp
}), Pp({
	description: "Raises visible Talent rows evenly up to known maximums, then spends any remaining XP like Skill Master.",
	id: "gifted-and-talented",
	name: "Gifted & Talented",
	run: Rp
}), Pp({
	description: "Cycles visible Characteristic rows evenly until no next characteristic increase fits the target XP.",
	id: "all-natural",
	name: "All Natural",
	run: zp
});
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderAdvancementsTab/advancement-display.ts
function Wp(e) {
	let t = e.current - e.careerValue, n = [...e.sources].sort((e, t) => Qp(e.kind) - Qp(t.kind)).map((e) => Gp(e));
	return t !== 0 && n.push(`Manual ${$p(t)}`), n.length ? n.join(", ") : e.includedFromBase ? "Base actor" : "-";
}
function Gp(e) {
	return e.kind === "custom" && e.count === 0 ? e.label : `${e.label} ${$p(e.count)}`;
}
function Kp(e) {
	return Mu(e) !== null;
}
function qp(e) {
	return Math.max(e.minimumTotal, e.baseValue + e.current);
}
function Jp(e) {
	return qp(e);
}
function Yp(e) {
	return e.talentMaximumLabel ?? "Unknown";
}
function Xp(e) {
	let t = e.talentMaximumValue;
	return typeof t == "number" && Jp(e) > t;
}
function Zp(e) {
	return bd(e);
}
function Qp(e) {
	return e === "characteristic" ? 0 : e === "career" ? 1 : 2;
}
function $p(e) {
	return e > 0 ? `+${e}` : `${e}`;
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderAdvancementsTab/AdvancementRowTailActions.vue?vue&type=script&setup=true&lang.ts
var em = ["disabled"], tm = /* @__PURE__ */ U({
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
		}, " Reset ", 8, em), e.entry.includedFromCustom ? (K(), q("button", {
			key: 0,
			class: "dui-join-item dui-btn dui-btn-sm",
			title: "Remove dropped entry",
			type: "button",
			onClick: r[1] ||= (e) => n("removeCustom")
		}, " Remove Dropped ")) : Q("", !0)], 64));
	}
}), nm = { class: "dui-card dui-card-border dui-card-sm" }, rm = { class: "dui-card-body" }, im = { class: "dui-card-title" }, am = {
	key: 0,
	class: "dui-badge dui-badge-primary"
}, om = { key: 0 }, sm = /* @__PURE__ */ U({
	__name: "NpcBuilderSection",
	props: {
		description: { default: "" },
		number: { default: "" },
		title: {}
	},
	setup(e) {
		return (t, n) => (K(), q("section", nm, [Y("div", rm, [
			Y("h2", im, [e.number ? (K(), q("span", am, F(e.number), 1)) : Q("", !0), Z(" " + F(e.title), 1)]),
			e.description ? (K(), q("p", om, F(e.description), 1)) : Q("", !0),
			So(t.$slots, "default")
		])]));
	}
}), cm = {
	key: 0,
	class: "dui-card-actions"
}, lm = {
	key: 1,
	class: "dui-alert dui-alert-info"
}, um = { class: "dui-list" }, dm = { class: "dui-list-col-grow" }, fm = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, pm = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, mm = { class: "dui-join" }, hm = ["disabled", "onClick"], gm = [
	"aria-label",
	"value",
	"onInput"
], _m = ["onClick"], vm = {
	key: 2,
	class: "dui-alert"
}, ym = /* @__PURE__ */ U({
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
		return (t, i) => (K(), J(sm, {
			number: e.sectionNumber,
			title: e.title
		}, {
			default: V(() => [
				e.manualAdvanceCount ? (K(), q("div", cm, [Y("span", null, F(e.manualAdvanceCount) + " manual edits", 1), Y("button", {
					class: "dui-btn dui-btn-sm",
					type: "button",
					onClick: i[0] ||= (e) => n("resetAll")
				}, " Reset All Advances ")])) : Q("", !0),
				e.estimatedNpcXp ? (K(), q("div", lm, [
					Y("strong", null, "Estimated NPC XP " + F(e.estimatedNpcXp.total), 1),
					Y("span", null, F(e.estimatedNpcXp.characteristics) + " characteristics", 1),
					Y("span", null, F(e.estimatedNpcXp.skills) + " skills", 1),
					Y("span", null, F(e.estimatedNpcXp.talents) + " talents", 1)
				])) : Q("", !0),
				Y("ul", um, [(K(!0), q(G, null, W(e.entries, (t) => (K(), q("li", {
					key: `${t.kind}:${t.name}`,
					class: "dui-list-row"
				}, [Y("div", dm, [
					Y("strong", null, F(t.name), 1),
					t.current === t.careerValue ? Q("", !0) : (K(), q("span", fm, " Manual edit ")),
					e.showSkillSpecializationBadges && B(Kp)(t.name) ? (K(), q("span", pm, " Needs specialization ")) : Q("", !0),
					Y("span", null, " Base " + F(t.baseValue) + " · Advances " + F(t.current) + " · XP " + F(B(Zp)(t)), 1),
					Y("small", null, "Sources: " + F(B(Wp)(t)), 1)
				]), Y("div", mm, [
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						disabled: B(qp)(t) <= t.minimumTotal,
						title: "Decrease by 5",
						type: "button",
						onClick: (e) => n("adjustCurrent", t, -1)
					}, " -5 ", 8, hm),
					Y("input", {
						class: "dui-join-item dui-input dui-input-sm",
						"aria-label": `Total ${t.name}`,
						value: B(qp)(t),
						min: "0",
						type: "number",
						onInput: (e) => r(t, e)
					}, null, 40, gm),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						title: "Increase by 5",
						type: "button",
						onClick: (e) => n("adjustCurrent", t, 1)
					}, " +5 ", 8, _m),
					X(tm, {
						entry: t,
						onRemoveCustom: (e) => n("removeCustom", t),
						onResetCurrent: (e) => n("resetCurrent", t)
					}, null, 8, [
						"entry",
						"onRemoveCustom",
						"onResetCurrent"
					])
				])]))), 128))]),
				e.entries.length ? Q("", !0) : (K(), q("p", vm, "No " + F(e.title.toLowerCase()) + " to advance yet.", 1))
			]),
			_: 1
		}, 8, ["number", "title"]));
	}
}), bm = { class: "dui-fieldset" }, xm = ["value"], Sm = { class: "dui-fieldset" }, Cm = ["value"], wm = ["value"], Tm = { key: 0 }, Em = { class: "dui-card-actions" }, Dm = ["disabled"], Om = /* @__PURE__ */ U({
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
		return (t, a) => (K(), J(sm, {
			description: "Spend toward a target without exceeding it. Existing manual edits are preserved.",
			number: "4",
			title: "Auto Advance"
		}, {
			default: V(() => [
				Y("fieldset", bm, [a[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Target XP", -1), Y("input", {
					"aria-label": "Target XP",
					class: "dui-input dui-input-sm",
					value: e.targetXp,
					min: "0",
					type: "number",
					onInput: r
				}, null, 40, xm)]),
				Y("fieldset", Sm, [a[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "Strategy", -1), Y("select", {
					"aria-label": "Auto advance strategy",
					class: "dui-select dui-select-sm",
					value: e.selectedAutoAdvanceStrategyId,
					onChange: i
				}, [(K(!0), q(G, null, W(e.autoAdvanceStrategies, (e) => (K(), q("option", {
					key: e.id,
					value: e.id
				}, F(e.name), 9, wm))), 128))], 40, Cm)]),
				e.selectedAutoAdvanceStrategy ? (K(), q("p", Tm, F(e.selectedAutoAdvanceStrategy.description), 1)) : Q("", !0),
				Y("div", Em, [Y("button", {
					class: "dui-btn dui-btn-primary dui-btn-sm",
					disabled: !e.canRunAutoAdvance,
					title: "Advance rows as close to the target XP as possible without going over",
					type: "button",
					onClick: a[0] ||= (e) => n("runAutoAdvance")
				}, " Auto Advance ", 8, Dm)])
			]),
			_: 1
		}));
	}
}), km = { class: "dui-card-actions" }, Am = ["disabled"], jm = { class: "dui-list" }, Mm = { class: "dui-list-col-grow" }, Nm = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, Pm = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, Fm = { class: "dui-join" }, Im = ["disabled", "onClick"], Lm = [
	"aria-label",
	"value",
	"onInput"
], Rm = ["onClick"], zm = {
	key: 0,
	class: "dui-alert"
}, Bm = /* @__PURE__ */ U({
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
		return (t, i) => (K(), J(sm, {
			number: "3",
			title: "Talents"
		}, {
			default: V(() => [
				Y("div", km, [Y("span", null, F(e.maximizableTalentCount) + " below maximum", 1), Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: e.maximizableTalentCount === 0,
					title: "Raise talents with known maximums to their maximum ranks",
					type: "button",
					onClick: i[0] ||= (e) => n("maximizeTalents")
				}, " Maximize Talents ", 8, Am)]),
				Y("ul", jm, [(K(!0), q(G, null, W(e.talents, (e) => (K(), q("li", {
					key: `${e.kind}:${e.name}`,
					class: "dui-list-row"
				}, [Y("div", Mm, [
					Y("strong", null, F(e.name), 1),
					e.current === e.careerValue ? Q("", !0) : (K(), q("span", Nm, " Manual edit ")),
					Y("span", null, " Ranks " + F(B(Jp)(e)) + " · Maximum " + F(B(Yp)(e)) + " · XP " + F(B(Zp)(e)), 1),
					Y("small", null, "Sources: " + F(B(Wp)(e)), 1),
					B(Xp)(e) ? (K(), q("span", Pm, " Over maximum ")) : Q("", !0)
				]), Y("div", Fm, [
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						disabled: B(Jp)(e) <= e.minimumTotal,
						title: "Decrease by 1",
						type: "button",
						onClick: (t) => n("adjustCurrent", e, -1)
					}, " -1 ", 8, Im),
					Y("input", {
						class: "dui-join-item dui-input dui-input-sm",
						"aria-label": `Ranks ${e.name}`,
						value: B(Jp)(e),
						min: "0",
						type: "number",
						onInput: (t) => r(e, t)
					}, null, 40, Lm),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-sm",
						title: "Increase by 1",
						type: "button",
						onClick: (t) => n("adjustCurrent", e, 1)
					}, " +1 ", 8, Rm),
					X(tm, {
						entry: e,
						onRemoveCustom: (t) => n("removeCustom", e),
						onResetCurrent: (t) => n("resetCurrent", e)
					}, null, 8, [
						"entry",
						"onRemoveCustom",
						"onResetCurrent"
					])
				])]))), 128))]),
				e.talents.length ? Q("", !0) : (K(), q("p", zm, "No talents to advance yet."))
			]),
			_: 1
		}));
	}
}), Vm = /* @__PURE__ */ U({
	__name: "NpcBuilderAdvancementsTab",
	props: { page: {} },
	setup(e) {
		let t = wp(), { advancements: n, estimatedNpcXp: r, maximizableTalentCount: i } = _u(t), a = Fp(), o = /* @__PURE__ */ z("skill-master"), s = /* @__PURE__ */ z(0), c = $(() => n.value.filter((e) => e.kind === "characteristic")), l = $(() => n.value.filter((e) => e.kind === "skill")), u = $(() => n.value.filter((e) => e.kind === "talent")), d = $(() => n.value.filter((e) => e.current !== e.careerValue).length), f = $(() => Ip(o.value) ?? a[0] ?? null), p = $(() => f.value !== null && s.value > r.value.total);
		Ha(() => r.value.total, (e) => {
			s.value < e && (s.value = e);
		}, { immediate: !0 });
		function m() {
			let e = f.value;
			e && t.applyAutoAdvance(e, s.value);
		}
		return (n, h) => (K(), q("section", null, [e.page === "detail-characteristics" ? (K(), J(ym, {
			key: 0,
			entries: c.value,
			"estimated-npc-xp": B(r),
			"manual-advance-count": d.value,
			"section-number": "",
			title: "Characteristics",
			onAdjustCurrent: B(t).adjustAdvancementCurrent,
			onRemoveCustom: B(t).removeCustomAdvancement,
			onResetAll: B(t).resetAllAdvancementCurrents,
			onResetCurrent: B(t).resetAdvancementCurrent,
			onTotalChange: B(t).setAdvancementTotal
		}, null, 8, [
			"entries",
			"estimated-npc-xp",
			"manual-advance-count",
			"onAdjustCurrent",
			"onRemoveCustom",
			"onResetAll",
			"onResetCurrent",
			"onTotalChange"
		])) : e.page === "detail-skills" ? (K(), J(ym, {
			key: 1,
			entries: l.value,
			"section-number": "",
			"show-skill-specialization-badges": "",
			title: "Skills",
			onAdjustCurrent: B(t).adjustAdvancementCurrent,
			onRemoveCustom: B(t).removeCustomAdvancement,
			onResetCurrent: B(t).resetAdvancementCurrent,
			onTotalChange: B(t).setAdvancementTotal
		}, null, 8, [
			"entries",
			"onAdjustCurrent",
			"onRemoveCustom",
			"onResetCurrent",
			"onTotalChange"
		])) : e.page === "detail-talents" ? (K(), J(Bm, {
			key: 2,
			"maximizable-talent-count": B(i),
			talents: u.value,
			onAdjustCurrent: B(t).adjustAdvancementCurrent,
			onMaximizeTalents: B(t).maximizeTalents,
			onRemoveCustom: B(t).removeCustomAdvancement,
			onResetCurrent: B(t).resetAdvancementCurrent,
			onTotalChange: B(t).setAdvancementTotal
		}, null, 8, [
			"maximizable-talent-count",
			"talents",
			"onAdjustCurrent",
			"onMaximizeTalents",
			"onRemoveCustom",
			"onResetCurrent",
			"onTotalChange"
		])) : (K(), J(Om, {
			key: 3,
			"auto-advance-strategies": B(a),
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
function Hm(e) {
	return [
		`Ch ${e.grants.characteristics.length}`,
		`Sk ${e.grants.skills.length}`,
		`Ta ${e.grants.talents.length}`,
		`Tr ${e.grants.trappings.length}`
	].join(" / ");
}
function Um(e) {
	let t = e.slice(0, 3).join(", "), n = e.length - 3;
	return e.length ? n > 0 ? `${t}, +${n}` : t : "-";
}
function Wm(e) {
	return e.split(/\s+/).map((e) => e.at(0)).filter(Boolean).slice(0, 2).join("").toLocaleUpperCase();
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/BaseActorPanel.vue?vue&type=script&setup=true&lang.ts
var Gm = { class: "dui-fieldset" }, Km = ["value"], qm = { class: "dui-fieldset" }, Jm = ["disabled", "value"], Ym = { value: "" }, Xm = ["value"], Zm = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, Qm = {
	key: 1,
	class: "dui-alert"
}, $m = {
	key: 0,
	class: "dui-avatar"
}, eh = { class: "app:size-16 app:shrink-0 app:rounded-lg" }, th = ["src"], nh = {
	key: 1,
	class: "dui-badge"
}, rh = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(sm, {
			description: e.description,
			number: e.number,
			title: e.title
		}, {
			default: V(() => [
				Y("fieldset", Gm, [n[0] ||= Y("legend", { class: "dui-fieldset-legend" }, "Search world actors", -1), Y("input", {
					"aria-label": "Search world actors",
					class: "dui-input dui-input-sm",
					value: e.actorFilter,
					placeholder: "Filter actors",
					type: "search",
					onInput: r
				}, null, 40, Km)]),
				Y("fieldset", qm, [n[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Base statblock", -1), Y("select", {
					"aria-label": "Base statblock",
					class: "dui-select dui-select-sm",
					disabled: e.isLoadingActors,
					value: e.selectedBaseActorUuid,
					onChange: i
				}, [Y("option", Ym, F(e.isLoadingActors ? "Loading actors..." : "Choose an actor"), 1), (K(!0), q(G, null, W(e.filteredActors, (e) => (K(), q("option", {
					key: e.uuid,
					value: e.uuid
				}, F(e.name), 9, Xm))), 128))], 40, Jm)]),
				e.errorMessage ? (K(), q("p", Zm, F(e.errorMessage), 1)) : Q("", !0),
				e.selectedBaseActor ? (K(), q("article", Qm, [e.selectedBaseActor.img ? (K(), q("div", $m, [Y("div", eh, [Y("img", {
					src: e.selectedBaseActor.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "64",
					width: "64"
				}, null, 8, th)])])) : (K(), q("span", nh, F(B(Wm)(e.selectedBaseActor.name)), 1)), Y("div", null, [Y("strong", null, F(e.selectedBaseActor.name), 1), Y("span", null, [
					Z(F(e.selectedBaseActor.species || "Species not found") + " ", 1),
					e.selectedBaseActor.type ? (K(), q(G, { key: 0 }, [Z(" - " + F(e.selectedBaseActor.type), 1)], 64)) : Q("", !0),
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
}), ih = { class: "dui-card-actions" }, ah = { class: "dui-stats dui-stats-vertical app:w-full" }, oh = { class: "dui-stat" }, sh = { class: "dui-stat-value" }, ch = {
	key: 0,
	class: "dui-stat-desc"
}, lh = { class: "dui-stat" }, uh = { class: "dui-stat-value" }, dh = {
	key: 0,
	class: "dui-stat-desc"
}, fh = {
	key: 1,
	class: "dui-stat-desc"
}, ph = { class: "dui-stat" }, mh = { class: "dui-stat-value" }, hh = { class: "dui-stat" }, gh = { class: "dui-stat-value" }, _h = { class: "dui-stat" }, vh = { class: "dui-stat-value" }, yh = { class: "dui-stat-desc" }, bh = {
	key: 0,
	class: "dui-alert dui-alert-warning",
	role: "alert"
}, xh = { key: 1 }, Sh = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(sm, {
			number: "4",
			title: "Build Preview"
		}, {
			default: V(() => [
				Y("div", ih, [Y("span", { class: P(["dui-badge", e.buildPreviewStatus === "Ready" ? "dui-badge-success" : "dui-badge-warning"]) }, F(e.buildPreviewStatus), 3)]),
				Y("div", ah, [
					Y("div", oh, [
						n[0] ||= Y("span", { class: "dui-stat-title" }, "Advances", -1),
						Y("strong", sh, F(e.advancementCount), 1),
						e.editedAdvanceCount ? (K(), q("small", ch, F(e.editedAdvanceCount) + " manually edited ", 1)) : Q("", !0)
					]),
					Y("div", lh, [
						n[1] ||= Y("span", { class: "dui-stat-title" }, "Trappings", -1),
						Y("strong", uh, F(e.visibleTrappingCount), 1),
						e.fallbackTrappingCount ? (K(), q("small", dh, F(e.fallbackTrappingCount) + " blank fallback ", 1)) : Q("", !0),
						e.ignoredTrappingCount ? (K(), q("small", fh, F(e.ignoredTrappingCount) + " ignored ", 1)) : Q("", !0)
					]),
					Y("div", ph, [n[2] ||= Y("span", { class: "dui-stat-title" }, "Traits", -1), Y("strong", mh, F(e.traitCount), 1)]),
					Y("div", hh, [n[3] ||= Y("span", { class: "dui-stat-title" }, "Spells", -1), Y("strong", gh, F(e.selectedSpellCount), 1)]),
					Y("div", _h, [
						n[4] ||= Y("span", { class: "dui-stat-title" }, "Estimated NPC XP", -1),
						Y("strong", vh, F(e.estimatedNpcXp.total), 1),
						Y("small", yh, F(e.estimatedNpcXp.characteristics) + " char / " + F(e.estimatedNpcXp.skills) + " skill / " + F(e.estimatedNpcXp.talents) + " talent ", 1)
					])
				]),
				e.buildPreviewWarnings.length ? (K(), q("div", bh, [Y("div", null, [(K(!0), q(G, null, W(e.buildPreviewWarnings, (e) => (K(), q("p", { key: e }, F(e), 1))), 128))])])) : (K(), q("p", xh, " The draft has a base Actor, queued Career data, resolved trappings, and a portrait ready to apply. "))
			]),
			_: 1
		}));
	}
}), Ch = { class: "dui-list" }, wh = { class: "dui-list-row" }, Th = { class: "dui-list-row" }, Eh = { class: "dui-list-row" }, Dh = { class: "dui-list-row" }, Oh = { class: "dui-list-row" }, kh = { class: "dui-list-row" }, Ah = { class: "dui-list-row" }, jh = /* @__PURE__ */ U({
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
		return (t, n) => (K(), q("dl", Ch, [
			Y("div", wh, [n[0] ||= Y("dt", null, "Build name", -1), Y("dd", null, F(e.finalActorName), 1)]),
			Y("div", Th, [n[1] ||= Y("dt", null, "Base actor", -1), Y("dd", null, F(e.baseActorName), 1)]),
			Y("div", Eh, [n[2] ||= Y("dt", null, "Final career", -1), Y("dd", null, F(e.finalCareerName), 1)]),
			Y("div", Dh, [n[3] ||= Y("dt", null, "Career items", -1), Y("dd", null, F(e.careerItemCount), 1)]),
			Y("div", Oh, [n[4] ||= Y("dt", null, "Apply", -1), Y("dd", null, F(e.advancementCount) + " advance rows, " + F(e.visibleTrappingCount) + " trappings, " + F(e.traitCount) + " traits, " + F(e.selectedSpellCount) + " spells ", 1)]),
			Y("div", kh, [n[5] ||= Y("dt", null, "Extracted grants", -1), Y("dd", null, F(e.grantTotals.characteristics) + " characteristics, " + F(e.grantTotals.skills) + " skills, " + F(e.grantTotals.talents) + " talents, " + F(e.grantTotals.trappings) + " trappings ", 1)]),
			Y("div", Ah, [n[6] ||= Y("dt", null, "Estimated NPC XP", -1), Y("dd", null, F(e.estimatedNpcXpTotal), 1)])
		]));
	}
}), Mh = { class: "app:grid app:gap-3" }, Nh = { class: "app:flex app:flex-wrap app:items-start app:gap-3" }, Ph = ["aria-label", "disabled"], Fh = ["src"], Ih = { key: 1 }, Lh = { key: 2 }, Rh = { class: "app:flex app:min-w-48 app:flex-1 app:flex-col app:items-start app:gap-2" }, zh = ["title"], Bh = {
	key: 1,
	class: "app:text-base-content/70"
}, Vh = ["disabled"], Hh = {
	key: 0,
	"aria-live": "polite",
	role: "status"
}, Uh = ["value"], Wh = {
	key: 1,
	class: "dui-fieldset"
}, Gh = { class: "dui-fieldset-legend" }, Kh = { key: 0 }, qh = { key: 1 }, Jh = { class: "app:flex app:flex-wrap app:gap-2" }, Yh = [
	"aria-label",
	"aria-pressed",
	"title",
	"onClick"
], Xh = ["src"], Zh = ["aria-label"], Qh = /* @__PURE__ */ U({
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
		return (t, r) => (K(), q("section", Mh, [
			Y("div", Nh, [Y("button", {
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
			}, null, 8, Fh)) : e.finalCareer ? (K(), q("strong", Ih, F(B(Wm)(e.finalCareer.name)), 1)) : (K(), q("span", Lh, "No portrait"))], 8, Ph), Y("div", Rh, [
				r[3] ||= Y("span", { class: "dui-badge dui-badge-outline" }, "Current portrait", -1),
				Y("strong", null, F(e.selectedPortraitCandidate?.label ?? "No portrait selected"), 1),
				e.finalPortraitPath ? (K(), q("small", {
					key: 0,
					class: "app:break-all app:text-base-content/70",
					title: e.finalPortraitPath
				}, F(e.finalPortraitPath), 9, zh)) : (K(), q("span", Bh, " A Career or base Actor image will be used when available. ")),
				Y("button", {
					class: "dui-btn dui-btn-outline dui-btn-sm",
					disabled: !e.portraitCandidates.length,
					type: "button",
					onClick: r[1] ||= (e) => n("openGallery")
				}, " Browse " + F(e.portraitCandidates.length) + " portraits ", 9, Vh)
			])]),
			e.isLoadingPortraitCandidates && e.portraitSearchProgress ? (K(), q("div", Hh, [Y("progress", {
				"aria-label": "Portrait search progress",
				class: "dui-progress dui-progress-info app:w-full",
				value: e.portraitSearchProgressValue,
				max: "100"
			}, null, 8, Uh), Y("small", null, F(e.portraitSearchProgressLabel), 1)])) : Q("", !0),
			e.portraitCandidates.length || e.isLoadingPortraitCandidates ? (K(), q("fieldset", Wh, [Y("legend", Gh, [r[4] ||= Y("span", null, "Quick picks", -1), e.isLoadingPortraitCandidates ? (K(), q("span", Kh, "Updating...")) : (K(), q("span", qh, F(e.portraitCandidates.length) + " options", 1))]), Y("div", Jh, [(K(!0), q(G, null, W(e.compactPortraitCandidates, (t) => (K(), q("button", {
				key: t.key,
				"aria-label": B(hf)(t),
				"aria-pressed": t.key === e.selectedPortraitCandidateKey,
				class: P(["dui-btn dui-btn-square app:overflow-hidden app:p-1", { "dui-btn-active dui-btn-outline": t.key === e.selectedPortraitCandidateKey }]),
				title: B(mf)(t),
				type: "button",
				onClick: (e) => n("selectPortrait", t)
			}, [Y("img", {
				alt: "",
				class: "app:h-full app:w-full app:rounded-box app:object-cover",
				height: "64",
				loading: "lazy",
				src: t.img,
				width: "64"
			}, null, 8, Xh)], 10, Yh))), 128)), e.hiddenPortraitCandidateCount > 0 ? (K(), q("button", {
				key: 0,
				"aria-label": `Open ${e.hiddenPortraitCandidateCount} more portrait options`,
				class: "dui-btn dui-btn-square",
				type: "button",
				onClick: r[2] ||= (e) => n("openGallery")
			}, " +" + F(e.hiddenPortraitCandidateCount), 9, Zh)) : Q("", !0)])])) : Q("", !0)
		]));
	}
}), $h = { class: "app:grid app:gap-3 md:app:sticky md:app:top-28 md:app:max-h-[calc(100vh-10rem)] md:app:self-start md:app:overflow-y-auto" }, eg = { class: "dui-fieldset" }, tg = ["placeholder", "value"], ng = { class: "app:hidden md:app:grid md:app:gap-3" }, rg = { class: "dui-collapse dui-collapse-arrow dui-card-border" }, ig = { class: "dui-collapse-content" }, ag = /* @__PURE__ */ U({
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
		return (t, i) => (K(), q("aside", $h, [X(sm, {
			description: "The generated Actor identity stays visible while Build NPC controls change.",
			title: "Preview"
		}, {
			default: V(() => [X(Qh, {
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
			]), Y("fieldset", eg, [i[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "NPC name", -1), Y("input", {
				"aria-label": "NPC name",
				class: "dui-input dui-input-sm",
				placeholder: e.suggestedActorName,
				value: e.actorName,
				type: "text",
				onInput: r
			}, null, 40, tg)])]),
			_: 1
		}), Y("div", ng, [X(Sh, {
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
		]), Y("details", rg, [i[3] ||= Y("summary", { class: "dui-collapse-title" }, "Complete build details", -1), Y("div", ig, [X(jh, {
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
}), og = {
	key: 0,
	class: "dui-list app:gap-1"
}, sg = [
	"onDragenter",
	"onDragover",
	"onDrop"
], cg = ["onDragstart"], lg = {
	key: 0,
	class: "dui-avatar"
}, ug = { class: "app:size-10 app:rounded-md" }, dg = ["src"], fg = {
	key: 1,
	class: "dui-badge dui-badge-sm"
}, pg = { class: "dui-list-col-grow app:min-w-0" }, mg = { class: "app:flex app:min-w-0 app:flex-wrap app:items-center app:gap-1" }, hg = { class: "app:truncate" }, gg = {
	key: 0,
	class: "dui-badge dui-badge-info dui-badge-xs"
}, _g = {
	key: 1,
	class: "dui-badge dui-badge-info dui-badge-xs"
}, vg = { class: "app:flex app:min-w-0 app:items-center app:gap-2 app:text-xs" }, yg = { class: "app:shrink-0" }, bg = ["title"], xg = { class: "app:flex app:items-center app:justify-end app:gap-1" }, Sg = { class: "app:flex app:items-center app:gap-1 app:text-xs" }, Cg = ["value", "onInput"], wg = { class: "dui-join" }, Tg = ["disabled", "onClick"], Eg = ["disabled", "onClick"], Dg = ["onClick"], Og = {
	key: 1,
	class: "dui-alert"
}, kg = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(sm, {
			description: "Careers are applied in this order. Drag rows or use the buttons to reorder them.",
			number: "2",
			title: "Career Queue"
		}, {
			default: V(() => [e.careers.length ? (K(), q("ol", og, [(K(!0), q(G, null, W(e.careers, (t, a) => (K(), q("li", {
				key: t.uuid,
				class: P(["dui-list-row app:grid-cols-[auto_auto_minmax(0,1fr)_auto] app:items-center app:gap-2 app:rounded-md app:px-2 app:py-2", {
					"app:border-t-2 app:border-dashed app:border-info": i(a) === "before",
					"app:border-b-2 app:border-dashed app:border-info": i(a) === "after",
					"app:opacity-60": e.draggedCareerIndex === a
				}]),
				onDragenter: kl((e) => r("careerDragEnter", a), ["prevent", "stop"]),
				onDragover: (e) => r("careerDragOver", a, e),
				onDrop: (e) => r("careerDropOnRow", a, e)
			}, [
				Y("span", {
					"aria-hidden": "true",
					class: P(["dui-badge dui-badge-ghost dui-badge-sm app:cursor-grab", { "app:cursor-grabbing": e.draggedCareerIndex === a }]),
					draggable: "true",
					title: "Drag to reorder",
					onDragend: n[0] ||= (e) => r("careerDragEnd"),
					onDragstart: (e) => r("careerDragStart", a, e)
				}, " Drag ", 42, cg),
				t.img ? (K(), q("div", lg, [Y("div", ug, [Y("img", {
					src: t.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "40",
					width: "40"
				}, null, 8, dg)])])) : (K(), q("span", fg, F(B(Wm)(t.name)), 1)),
				Y("div", pg, [Y("div", mg, [Y("strong", hg, F(t.name), 1), e.draggedCareerIndex === a ? (K(), q("span", gg, " Dragging ")) : i(a) ? (K(), q("span", _g, " Place " + F(i(a)), 1)) : Q("", !0)]), Y("div", vg, [Y("span", yg, [Z(F(t.careerGroup || "Career") + " ", 1), t.level === null ? Q("", !0) : (K(), q(G, { key: 0 }, [Z(" level " + F(t.level), 1)], 64))]), Y("small", {
					class: "dui-badge dui-badge-ghost dui-badge-sm app:min-w-0 app:truncate",
					title: [
						`Characteristics: ${B(Um)(t.grants.characteristics)}`,
						`Skills: ${B(Um)(t.grants.skills)}`,
						`Talents: ${B(Um)(t.grants.talents)}`,
						`Trappings: ${B(Um)(t.grants.trappings)}`
					].join("\n")
				}, F(B(Hm)(t)), 9, bg)])]),
				Y("div", xg, [Y("label", Sg, [n[1] ||= Z(" Qty ", -1), Y("input", {
					class: "dui-input dui-input-xs app:w-14",
					value: t.quantity,
					min: "1",
					type: "number",
					onInput: (e) => r("careerQuantityInput", a, e)
				}, null, 40, Cg)]), Y("div", wg, [
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						disabled: a === 0,
						title: "Move career earlier",
						type: "button",
						onClick: (e) => r("moveCareer", a, -1)
					}, " Up ", 8, Tg),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						disabled: a === e.careers.length - 1,
						title: "Move career later",
						type: "button",
						onClick: (e) => r("moveCareer", a, 1)
					}, " Down ", 8, Eg),
					Y("button", {
						class: "dui-join-item dui-btn dui-btn-xs",
						type: "button",
						onClick: (e) => r("removeCareer", a)
					}, " Remove ", 8, Dg)
				])])
			], 42, sg))), 128))])) : (K(), q("p", Og, "No careers queued yet."))]),
			_: 1
		}));
	}
}), Ag = { class: "app:grid app:gap-2" }, jg = { class: "app:flex app:flex-wrap app:items-center app:gap-2" }, Mg = { class: "dui-join app:min-w-64 app:flex-1" }, Ng = { class: "dui-input dui-input-sm dui-join-item app:flex-1" }, Pg = ["onKeydown"], Fg = { class: "dui-badge dui-badge-sm dui-badge-outline" }, Ig = { class: "app:grid app:gap-2 md:app:grid-cols-3" }, Lg = [
	"onDragenter",
	"onDragleave",
	"onDragover",
	"onDrop"
], Rg = { class: "dui-card-body app:gap-2 app:p-2" }, zg = { class: "app:flex app:items-center app:gap-2" }, Bg = { class: "dui-card-title app:m-0 app:text-sm" }, Vg = { class: "dui-badge dui-badge-sm" }, Hg = {
	key: 0,
	"aria-live": "polite",
	class: "dui-badge dui-badge-info dui-badge-sm app:ml-auto"
}, Ug = { class: "app:flex app:min-h-8 app:flex-wrap app:items-center app:gap-2" }, Wg = [
	"title",
	"onClick",
	"onDragstart",
	"onKeydown"
], Gg = {
	key: 0,
	class: "app:text-base-content/60"
}, Kg = { class: "dui-card-body app:flex-row app:items-center app:justify-center app:gap-2 app:p-2" }, qg = { "aria-live": "polite" }, Jg = /* @__PURE__ */ U({
	__name: "PortraitFilterTags",
	props: {
		resultCount: {},
		tags: {}
	},
	emits: ["createSearchTerm", "filterTagSectionChange"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ z(""), a = /* @__PURE__ */ z(null), o = /* @__PURE__ */ z(null), s = [
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
			t.stopPropagation(), a.value = e, t.dataTransfer?.setData("text/plain", lf(e.id)), t.dataTransfer?.setData(ef, e.id), t.dataTransfer && (t.dataTransfer.effectAllowed = "move");
		}
		function d(e, t) {
			t.preventDefault(), t.stopPropagation(), o.value = e, t.dataTransfer && (t.dataTransfer.dropEffect = _(a.value, e) ? "move" : "none");
		}
		function f(e, t) {
			t.stopPropagation(), !(t.currentTarget instanceof Node && t.relatedTarget instanceof Node && t.currentTarget.contains(t.relatedTarget)) && o.value === e && (o.value = null);
		}
		function p(e, t) {
			t.preventDefault(), t.stopPropagation();
			let i = t.dataTransfer?.getData("application/x-wfrp4e-customizer-portrait-filter-tag") || uf(t.dataTransfer?.getData("text/plain") ?? ""), o = a.value ?? n.tags.find((e) => e.id === i) ?? null;
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
		return (t, n) => (K(), q("section", Ag, [
			Y("div", jg, [Y("div", Mg, [Y("label", Ng, [n[5] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-magnifying-glass"
			}, null, -1), H(Y("input", {
				"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
				"aria-label": "Add a portrait search term",
				class: "app:grow",
				placeholder: "Add a search term",
				type: "search",
				onKeydown: jl(kl(l, ["prevent"]), ["enter"])
			}, null, 40, Pg), [[bl, i.value]])]), Y("button", {
				class: "dui-btn dui-btn-sm dui-join-item",
				type: "button",
				onClick: l
			}, [...n[6] ||= [Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-plus"
			}, null, -1), Z(" Add ", -1)]])]), Y("span", Fg, F(e.resultCount) + " images", 1)]),
			Y("div", Ig, [(K(), q(G, null, W(s, (e) => Y("section", {
				key: e.id,
				class: P(["dui-card dui-card-border dui-card-sm app:min-h-20 app:border-base-content/30 app:bg-base-200 app:shadow-sm", { "app:border-info app:bg-info/10 app:ring-2 app:ring-info": o.value === e.id }]),
				onDragenter: (t) => d(e.id, t),
				onDragleave: (t) => f(e.id, t),
				onDragover: (t) => d(e.id, t),
				onDrop: (t) => p(e.id, t)
			}, [Y("div", Rg, [Y("header", zg, [
				Y("h3", Bg, [Y("i", {
					"aria-hidden": "true",
					class: P(["fa-solid", e.icon])
				}, null, 2), Z(" " + F(e.title), 1)]),
				Y("span", Vg, F(c.value[e.id].length), 1),
				o.value === e.id ? (K(), q("span", Hg, F(v(e.id)), 1)) : Q("", !0)
			]), Y("div", Ug, [(K(!0), q(G, null, W(c.value[e.id], (e) => (K(), q("button", {
				key: e.id,
				class: P(["dui-badge dui-badge-sm app:h-auto app:cursor-grab app:whitespace-normal app:py-1", [e.kind === "source" ? "dui-badge-outline" : "dui-badge-primary", a.value?.id === e.id ? "app:opacity-50" : ""]]),
				draggable: "true",
				title: `Drag ${e.label} to another group, or select it to move it to the next group.`,
				type: "button",
				onClick: (t) => m(e),
				onDragend: g,
				onDragstart: (t) => u(e, t),
				onKeydown: jl(kl((t) => h(e), ["prevent"]), ["delete"])
			}, F(e.label), 43, Wg))), 128)), c.value[e.id].length ? Q("", !0) : (K(), q("small", Gg, " Drop tags here "))])])], 42, Lg)), 64))]),
			Y("div", {
				"aria-label": "Remove search tag",
				class: P(["dui-card dui-card-border dui-card-sm app:border-dashed app:border-base-content/30 app:bg-base-200", {
					"app:border-error app:bg-error/10 app:ring-2 app:ring-error": o.value === "removed" && !a.value?.canRemove,
					"app:border-warning app:bg-warning/10 app:ring-2 app:ring-warning": o.value === "removed" && a.value?.canRemove
				}]),
				onDragenter: n[1] ||= (e) => d("removed", e),
				onDragleave: n[2] ||= (e) => f("removed", e),
				onDragover: n[3] ||= (e) => d("removed", e),
				onDrop: n[4] ||= (e) => p("removed", e)
			}, [Y("div", Kg, [n[7] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-trash"
			}, null, -1), Y("span", qg, F(y.value), 1)])], 34)
		]));
	}
}), Yg = ["aria-busy"], Xg = {
	key: 0,
	class: "dui-alert dui-alert-error app:min-h-0 app:py-2",
	role: "alert"
}, Zg = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info app:min-h-0 app:gap-2 app:py-2",
	role: "status"
}, Qg = { class: "app:flex app:min-w-0 app:flex-1 app:items-center app:gap-2" }, $g = { class: "app:shrink-0" }, e_ = ["value"], t_ = {
	key: 2,
	class: "dui-alert dui-alert-warning app:min-h-0 app:py-2"
}, n_ = { class: "dui-list app:m-0 app:grid app:grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] app:gap-3 app:p-0" }, r_ = [
	"aria-label",
	"aria-pressed",
	"title",
	"onClick"
], i_ = ["loading", "src"], a_ = { class: "app:flex app:flex-wrap app:items-center app:justify-between app:gap-1" }, o_ = {
	key: 0,
	class: "dui-badge dui-badge-success dui-badge-sm"
}, s_ = { class: "app:text-sm" }, c_ = {
	key: 4,
	class: "dui-alert"
}, l_ = /* @__PURE__ */ U({
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
			X(Jg, {
				"result-count": e.options.length,
				tags: e.tags,
				onCreateSearchTerm: i[0] ||= (e) => r("createSearchTerm", e),
				onFilterTagSectionChange: i[1] ||= (e, t) => r("filterTagSectionChange", e, t)
			}, null, 8, ["result-count", "tags"]),
			e.errorMessage ? (K(), q("div", Xg, [i[2] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-triangle-exclamation"
			}, null, -1), Y("span", null, F(e.errorMessage), 1)])) : Q("", !0),
			e.isLoading ? (K(), q("div", Zg, [i[3] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-spinner fa-spin"
			}, null, -1), Y("div", Qg, [Y("small", $g, F(e.progressLabel || "Updating results..."), 1), Y("progress", {
				"aria-label": "Portrait search progress",
				class: "dui-progress app:min-w-24 app:flex-1",
				value: e.progressValue,
				max: "100"
			}, null, 8, e_)])])) : e.searchTerms.length && !e.options.length ? (K(), q("p", t_, " No portraits match the current filter tags. ")) : Q("", !0),
			e.options.length ? (K(), q("div", {
				key: 3,
				class: P(["app:pr-1", e.fillHeight ? "app:min-h-48 app:flex-1 app:overflow-y-auto" : "app:max-h-[30rem] app:overflow-y-auto"])
			}, [Y("ul", n_, [(K(!0), q(G, null, W(e.options, (t, n) => (K(), q("li", { key: t.key }, [Y("button", {
				"aria-label": B(hf)(t),
				"aria-pressed": t.key === e.selectedOptionKey,
				class: P(["dui-btn app:h-auto app:min-h-0 app:w-full app:flex-col app:items-stretch app:justify-start app:gap-2 app:overflow-hidden app:whitespace-normal app:p-2 app:text-left", t.key === e.selectedOptionKey ? "dui-btn-active dui-btn-outline" : "dui-btn-ghost"]),
				title: B(mf)(t),
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
				}, null, 8, i_),
				Y("span", a_, [Y("small", null, F(B(gf)(t)), 1), t.key === e.selectedOptionKey ? (K(), q("span", o_, " Selected ")) : Q("", !0)]),
				Y("strong", s_, F(t.label), 1)
			], 10, r_)]))), 128))])], 2)) : e.isLoading ? Q("", !0) : (K(), q("p", c_, F(n.emptyMessage), 1))
		], 8, Yg));
	}
}), u_ = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(Mp, {
			"close-label": "Done",
			open: e.open,
			title: "Choose an NPC Portrait",
			wide: "",
			onClose: r[3] ||= (e) => n("close")
		}, {
			default: V(() => [X(l_, {
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
}), d_ = {
	key: 0,
	class: "dui-alert"
}, f_ = {
	key: 0,
	class: "dui-avatar"
}, p_ = { class: "app:size-14 app:shrink-0 app:rounded-lg" }, m_ = ["src"], h_ = {
	key: 1,
	class: "dui-badge"
}, g_ = {
	key: 1,
	class: "dui-alert dui-alert-info"
}, __ = { class: "dui-card-actions" }, v_ = ["disabled"], y_ = {
	key: 2,
	class: "dui-alert"
}, b_ = /* @__PURE__ */ U({
	__name: "QuickCareerPanel",
	props: {
		careers: {},
		finalCareer: {}
	},
	emits: ["clearCareers"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (K(), J(sm, {
			description: "Quick Build keeps one chosen Career chain instead of a manual queue.",
			number: "2",
			title: "Career"
		}, {
			default: V(() => [
				e.finalCareer ? (K(), q("article", d_, [e.finalCareer.img ? (K(), q("div", f_, [Y("div", p_, [Y("img", {
					src: e.finalCareer.img,
					alt: "",
					class: "app:h-full app:w-full app:object-cover",
					height: "56",
					width: "56"
				}, null, 8, m_)])])) : (K(), q("span", h_, F(B(Wm)(e.finalCareer.name)), 1)), Y("div", null, [
					Y("strong", null, F(e.finalCareer.name), 1),
					Y("span", null, [Z(F(e.finalCareer.careerGroup || "Career") + " ", 1), e.finalCareer.level === null ? Q("", !0) : (K(), q(G, { key: 0 }, [Z(" level " + F(e.finalCareer.level), 1)], 64))]),
					Y("small", null, F(B(Hm)(e.finalCareer)), 1)
				])])) : Q("", !0),
				e.careers.length > 1 ? (K(), q("div", g_, [Y("span", null, F(e.careers.length - 1) + " lower-tier Career" + F(e.careers.length === 2 ? "" : "s"), 1), Y("span", null, "Included before " + F(e.finalCareer?.name) + ".", 1)])) : Q("", !0),
				Y("div", __, [Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: !e.careers.length,
					type: "button",
					onClick: r[0] ||= (e) => n("clearCareers")
				}, " Clear Career ", 8, v_)]),
				e.careers.length ? Q("", !0) : (K(), q("p", y_, "No Career selected."))
			]),
			_: 1
		}));
	}
}), x_ = {
	key: 0,
	class: "dui-fieldset"
}, S_ = { class: "dui-fieldset-legend" }, C_ = { class: "dui-card-actions" }, w_ = ["aria-pressed", "onClick"], T_ = /* @__PURE__ */ U({
	__name: "TraitButtonGroup",
	props: {
		caption: {},
		title: {},
		traits: {}
	},
	emits: ["toggleTrait"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => e.traits.length ? (K(), q("fieldset", x_, [Y("legend", S_, [Y("span", null, F(e.title), 1), Y("span", null, F(e.caption), 1)]), Y("div", C_, [(K(!0), q(G, null, W(e.traits, (e) => (K(), q("button", {
			key: e.uuid,
			"aria-pressed": e.isSelected,
			class: P(["dui-btn dui-btn-sm", { "dui-btn-active": e.isSelected }]),
			type: "button",
			onClick: (t) => n("toggleTrait", e)
		}, F(e.name), 11, w_))), 128))])])) : Q("", !0);
	}
});
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/errors.ts
function E_(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not resolve that Actor drop.";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/useBaseActorSelection.ts
function D_(e, t) {
	let n = wp(), { baseActors: r, selectedBaseActorUuid: i } = _u(n), a = /* @__PURE__ */ z(""), o = $(() => {
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
			t.value = E_(e);
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
function O_() {
	let { advancements: e, careers: t, finalPortraitPath: n, selectedBaseActor: r, trappings: i } = _u(wp()), a = $(() => {
		let e = 0;
		for (let n of t.value) e += n.quantity;
		return e;
	}), o = $(() => i.value.filter((e) => !e.ignored).length), s = $(() => e.value.filter((e) => e.current !== e.careerValue).length), c = $(() => i.value.filter((e) => !e.ignored && e.resolution.status === "fallback").length), l = $(() => i.value.filter((e) => e.ignored).length), u = $(() => e.value.filter((e) => e.kind === "skill" && Mu(e.name) !== null).length), d = $(() => i.value.filter((e) => !e.ignored && e.resolution.status === "unresolved").length), f = $(() => {
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
function k_() {
	let e = wp(), { optionalTraits: t, quickTraits: n, traits: r } = _u(e), i = $(() => new Set(r.value.map((e) => A_(e.name)))), a = $(() => t.value.map(s)), o = $(() => {
		let e = new Set(t.value.map((e) => A_(e.name)));
		return n.value.filter((t) => !e.has(A_(t.name))).map(s);
	});
	function s(e) {
		return {
			...e,
			isSelected: i.value.has(A_(e.name))
		};
	}
	function c(t) {
		let n = i.value.has(A_(t.name));
		e.setQuickTraitSelected(t, !n);
	}
	function l(t) {
		let n = i.value.has(A_(t.name));
		e.setOptionalTraitSelected(t, !n);
	}
	return {
		displayedQuickTraitOptions: o,
		optionalTraitOptions: a,
		toggleOptionalTrait: l,
		toggleQuickTrait: c
	};
}
function A_(e) {
	return e.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderBuildTab/useCareerQueue.ts
function j_() {
	let e = wp(), t = /* @__PURE__ */ z(null), n = /* @__PURE__ */ z(null);
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
var M_ = ef;
function N_(e) {
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
	}), Wd(t);
}
function P_(e) {
	let t = [];
	e.selectedBaseActor && t.push(e.selectedBaseActor.species, e.selectedBaseActor.name);
	for (let n of e.careers) t.push(n.name, n.careerGroup);
	return nf(t);
}
//#endregion
//#region src/module/state/portrait-gallery/workflow.ts
function F_(e) {
	let t = /* @__PURE__ */ z([]), n = /* @__PURE__ */ z(null), r = /* @__PURE__ */ z(!1), i = /* @__PURE__ */ z(null), a = 0, o = $(() => I_([...e.baseSearchTerms.value, ...e.filterState.customPortraitSearchTerms.value])), s = $(() => x("search")), c = $(() => x("must-include")), l = $(() => x("must-exclude")), u = $(() => I_([...s.value, ...c.value])), d = $(() => n.value ?? Gd({
		assetCandidates: t.value,
		immediateCandidates: e.immediateCandidates.value,
		selectedPortraitPath: e.pinnedPortraitPath.value
	})), f = $(() => Vd(d.value)), p = $(() => [...o.value.flatMap(S), ...f.value.map(C)]), m = $(() => d.value.filter((e) => cf(e, {
		mustExcludeSources: w("must-exclude"),
		mustExcludeTerms: l.value,
		mustIncludeSources: w("must-include"),
		mustIncludeTerms: c.value
	}))), h = $(() => m.value.find((t) => t.img === e.activePortraitPath.value) ?? null), g = $(() => h.value?.key ?? ""), _ = $(() => pf(i.value)), v = $(() => ff(i.value));
	Ha(o, (t) => e.filterState.retainAvailablePortraitFilterTerms(t), { immediate: !0 }), Ha(() => [
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
		let s = e.hasSubject.value, d = df({
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
			}, r) : [], f = Gd({
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
		return of(o.value, e.filterState.portraitTermSections.value, t);
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
function I_(e) {
	return [...new Set(e)];
}
//#endregion
//#region src/module/apps/npc-builder/state/workflows/portrait-candidates-workflow.ts
function L_(e, t) {
	let n = wp(), { careers: r, customPortraitSearchTerms: i, finalPortraitPath: a, portraitSourceTagSections: o, portraitTermSections: s, selectedBaseActor: c, selectedPortraitPath: l, settings: u } = _u(n), d = $(() => N_({
		careers: r.value,
		selectedBaseActor: c.value
	})), f = $(() => P_({
		careers: r.value,
		selectedBaseActor: c.value
	})), p = $(() => af({
		configuredFolders: u.value.prioritizedPortraitFolders,
		hasCareer: r.value.length > 0
	})), m = F_({
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
function R_(e, t) {
	let n = L_(e, t), r = /* @__PURE__ */ z(!1);
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
var z_ = { class: "app:grid app:gap-3" }, B_ = { class: "app:grid app:items-start app:gap-3 md:app:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]" }, V_ = { class: "app:grid app:min-w-0 app:gap-3" }, H_ = /* @__PURE__ */ U({
	__name: "NpcBuilderBuildTab",
	props: {
		bridge: {},
		isLoadingActors: { type: Boolean },
		isLoadingBaseDraft: { type: Boolean },
		page: {}
	},
	setup(e) {
		let t = e, n = wp(), { actorName: r, advancements: i, careers: a, estimatedNpcXp: o, finalActorName: s, finalCareer: c, finalPortraitPath: l, grantTotals: u, selectedBaseActor: d, selectedSpells: f, suggestedActorName: p, traits: m } = _u(n), h = /* @__PURE__ */ z(""), { actorFilter: g, filteredActors: _, selectedBaseActorSelectValue: v } = D_(t.bridge, h), { clearCareerDragState: y, draggedCareerIndex: b, dragOverCareerIndex: x, handleCareerDragOver: S, handleCareerDragStart: C, handleCareerDrop: w, moveCareer: ee, removeCareer: te, setCareerQuantity: ne, setDragOverCareerIndex: re } = j_(), { displayedQuickTraitOptions: T, optionalTraitOptions: ie, toggleOptionalTrait: E, toggleQuickTrait: ae } = k_(), { buildPreviewStatus: D, buildPreviewWarnings: O, careerItemCount: oe, editedAdvanceCount: se, fallbackTrappingCount: ce, ignoredTrappingCount: le, visibleTrappingCount: ue } = O_(), { addPortraitSearchTerm: de, compactPortraitCandidates: fe, hiddenPortraitCandidateCount: pe, isLoadingPortraitCandidates: me, isPortraitGalleryOpen: he, portraitCandidates: ge, portraitFilterTags: _e, portraitSearchProgress: ve, portraitSearchProgressLabel: ye, portraitSearchProgressValue: be, portraitSearchTerms: xe, selectedPortraitCandidate: Se, selectedPortraitCandidateKey: Ce, selectPortrait: we, selectPortraitFromGallery: Te, setPortraitFilterTagSection: Ee } = R_(t.bridge, h);
		return (t, De) => (K(), q("section", z_, [Y("div", B_, [Y("div", V_, [
			e.page === "build-quick" || e.page === "build-actor" ? (K(), J(rh, {
				key: 0,
				"actor-filter": B(g),
				description: e.page === "build-quick" ? "Choose the base statblock for this fast NPC draft." : "Choose the base statblock before reviewing detailed build pages.",
				"error-message": h.value,
				"filtered-actors": B(_),
				"is-loading-actors": e.isLoadingActors,
				"is-loading-base-draft": e.isLoadingBaseDraft,
				number: e.page === "build-quick" ? "1" : "",
				"selected-base-actor": B(d),
				"selected-base-actor-uuid": B(v),
				onActorFilterChange: De[0] ||= (e) => g.value = e,
				onBaseActorChange: De[1] ||= (e) => v.value = e
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
			e.page === "build-quick" ? (K(), J(b_, {
				key: 1,
				careers: B(a),
				"final-career": B(c),
				onClearCareers: B(n).clearCareers
			}, null, 8, [
				"careers",
				"final-career",
				"onClearCareers"
			])) : Q("", !0),
			e.page === "build-quick" ? (K(), J(sm, {
				key: 2,
				description: "Apply optional base traits and configured quick traits to the draft.",
				number: "3",
				title: "Quick Traits"
			}, {
				default: V(() => [X(T_, {
					caption: `${B(ie).length} from base statblock`,
					traits: B(ie),
					title: "Optional Traits",
					onToggleTrait: B(E)
				}, null, 8, [
					"caption",
					"traits",
					"onToggleTrait"
				]), X(T_, {
					caption: `${B(T).length} configured`,
					traits: B(T),
					title: "Quick Traits",
					onToggleTrait: B(ae)
				}, null, 8, [
					"caption",
					"traits",
					"onToggleTrait"
				])]),
				_: 1
			})) : Q("", !0),
			e.page === "build-careers" ? (K(), J(kg, {
				key: 3,
				careers: B(a),
				"drag-over-career-index": B(x),
				"dragged-career-index": B(b),
				onCareerDragEnd: B(y),
				onCareerDragEnter: B(re),
				onCareerDragOver: B(S),
				onCareerDragStart: B(C),
				onCareerDropOnRow: B(w),
				onCareerQuantityInput: B(ne),
				onMoveCareer: B(ee),
				onRemoveCareer: B(te)
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
		]), X(ag, {
			class: "app:min-w-0",
			"actor-name": B(r),
			"advancement-count": B(i).length,
			"build-preview-status": B(D),
			"build-preview-warnings": B(O),
			"career-item-count": B(oe),
			"compact-portrait-candidates": B(fe),
			"edited-advance-count": B(se),
			"estimated-npc-xp": B(o),
			"fallback-trapping-count": B(ce),
			"final-actor-name": B(s),
			"final-career": B(c),
			"final-portrait-path": B(l),
			"grant-totals": B(u),
			"hidden-portrait-candidate-count": B(pe),
			"ignored-trapping-count": B(le),
			"is-loading-portrait-candidates": B(me),
			"portrait-candidates": B(ge),
			"portrait-search-progress": B(ve),
			"portrait-search-progress-label": B(ye),
			"portrait-search-progress-value": B(be),
			"selected-base-actor": B(d),
			"selected-portrait-candidate": B(Se),
			"selected-portrait-candidate-key": B(Ce),
			"selected-spell-count": B(f).length,
			"suggested-actor-name": B(p),
			"trait-count": B(m).length,
			"visible-trapping-count": B(ue),
			onActorNameChange: De[2] ||= (e) => r.value = e,
			onOpenPortraitGallery: De[3] ||= (e) => he.value = !0,
			onSelectPortrait: B(we)
		}, null, 8, /* @__PURE__ */ "actor-name.advancement-count.build-preview-status.build-preview-warnings.career-item-count.compact-portrait-candidates.edited-advance-count.estimated-npc-xp.fallback-trapping-count.final-actor-name.final-career.final-portrait-path.grant-totals.hidden-portrait-candidate-count.ignored-trapping-count.is-loading-portrait-candidates.portrait-candidates.portrait-search-progress.portrait-search-progress-label.portrait-search-progress-value.selected-base-actor.selected-portrait-candidate.selected-portrait-candidate-key.selected-spell-count.suggested-actor-name.trait-count.visible-trapping-count.onSelectPortrait".split("."))]), X(u_, {
			"is-loading-portrait-candidates": B(me),
			open: B(he),
			"portrait-candidates": B(ge),
			"portrait-filter-tags": B(_e),
			"portrait-search-progress-label": B(ye),
			"portrait-search-progress-value": B(be),
			"portrait-search-terms": B(xe),
			"selected-portrait-candidate-key": B(Ce),
			onCreateSearchTerm: B(de),
			onClose: De[4] ||= (e) => he.value = !1,
			onFilterTagSectionChange: B(Ee),
			onSelectPortrait: B(Te)
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
}), U_ = {
	Average: "avg",
	Enormous: "enor",
	Large: "lrg",
	Little: "ltl",
	Monstrous: "mnst",
	Small: "sml",
	Tiny: "tiny"
}, W_ = new Set(["bestial", "skittish"]);
function G_(e) {
	let t = e.some((e) => X_(e, "skittish")), n = e.some((e) => Z_(e, "trained", "war")), r = $_(e.filter((e) => X_(e, "weapon")));
	return e.map((e) => {
		let i = q_(e.name);
		return W_.has(i) ? Y_(e, `${e.name} is removed from combined mounts.`) : i === "weapon" ? !n || t ? Y_(e, "Weapon requires Trained (War) and a mount that was not Skittish.") : e.uuid === r ? J_(e, "Weapon (Mount)") : Y_(e, "Only the strongest Weapon trait is retained for the combined profile.") : J_(e, e.damage ? Q_(e.name) : e.name);
	});
}
function K_(e) {
	return q_(e) === "armour";
}
function q_(e) {
	return e.trim().replace(/\s*\(mount\)\s*$/i, "").toLocaleLowerCase();
}
function J_(e, t) {
	return {
		fixedDamage: e.fixedDamage,
		included: !0,
		name: e.name,
		outputName: t,
		reason: "",
		sourceUuid: e.uuid
	};
}
function Y_(e, t) {
	return {
		fixedDamage: e.fixedDamage,
		included: !1,
		name: e.name,
		outputName: "",
		reason: t,
		sourceUuid: e.uuid
	};
}
function X_(e, t) {
	return q_(e.name) === t;
}
function Z_(e, t, n) {
	return X_(e, t) ? e.specification.trim().toLocaleLowerCase() === n : e.name.trim().toLocaleLowerCase() === `${t} (${n})`;
}
function Q_(e) {
	return /\(mount\)\s*$/i.test(e.trim()) ? e.trim() : `${e.trim()} (Mount)`;
}
function $_(e) {
	return [...e].sort((e, t) => (t.fixedDamage ?? 0) - (e.fixedDamage ?? 0) || e.uuid.localeCompare(t.uuid))[0]?.uuid ?? "";
}
//#endregion
//#region src/module/apps/npc-builder/functions/combined-profile/calculate.ts
var ev = [
	U_.Tiny,
	U_.Little,
	U_.Small,
	U_.Average,
	U_.Large,
	U_.Enormous,
	U_.Monstrous
], tv = {
	[U_.Average]: "Average",
	[U_.Enormous]: "Enormous",
	[U_.Large]: "Large",
	[U_.Little]: "Little",
	[U_.Monstrous]: "Monstrous",
	[U_.Small]: "Small",
	[U_.Tiny]: "Tiny"
};
function nv(e, t) {
	return {
		chargeStrengthBonus: Math.max(t.characteristics.strengthBonus - e.characteristics.strengthBonus, 0),
		initiative: Math.max(e.characteristics.initiative, t.characteristics.initiative),
		movement: t.movement,
		size: iv(e.size, t.size),
		strength: e.characteristics.strength,
		toughness: Math.max(e.characteristics.toughness, t.characteristics.toughness),
		traits: G_(t.traits),
		wounds: rv(e.wounds, t.wounds)
	};
}
function rv(e, t) {
	return Math.max(1, Math.max(e, t) + Math.ceil(Math.min(e, t) * .25));
}
function iv(e, t) {
	return av(t) > av(e) ? t : e;
}
function av(e) {
	return ev.indexOf(e);
}
//#endregion
//#region src/module/apps/npc-builder/functions/combined-profile/trait-source.ts
function ov({ flagScope: e, mount: t, plan: n, rider: r }) {
	let i = "Combined Profile";
	return {
		effects: [{
			changes: [],
			disabled: !1,
			flags: { [e]: { generatedCombinedProfileEffect: !0 } },
			img: t.img || "icons/svg/wing.svg",
			name: i,
			system: {
				scriptData: sv(e, n),
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
			description: { value: lv(r, t, n) },
			specification: { value: `${r.name} + ${t.name}` }
		},
		type: "trait"
	};
}
function sv(e, t) {
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
		script: cv(e, t.chargeStrengthBonus),
		trigger: "preRollTest"
	}), n;
}
function cv(e, t) {
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
function lv(e, t, n) {
	return [
		"<p>Generated by Drowsy's WFRP4e Customizers. This Actor combines a rider and mount into one simplified NPC profile.</p>",
		`<p><strong>Rider:</strong> ${uv(e.name)}<br><strong>Mount:</strong> ${uv(t.name)}</p>`,
		`<p><strong>Movement:</strong> ${n.movement}; <strong>Wounds:</strong> ${n.wounds}; <strong>Charge SB:</strong> +${n.chargeStrengthBonus}.</p>`,
		"<p>Mount attack Traits use fixed damage captured from the mount. Skittish and Bestial are removed.</p>"
	].join("");
}
function uv(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
//#endregion
//#region src/types/foundry/document-drop.ts
var dv = "wfrp4e-customizer-apps.document-drop", fv = { class: "dui-list" }, pv = [
	"aria-label",
	"disabled",
	"title",
	"onClick"
], mv = ["src"], hv = {
	key: 1,
	"aria-hidden": "true",
	class: "fa-solid fa-scroll"
}, gv = { class: "app:min-w-0 app:break-words" }, _v = {
	key: 1,
	class: "dui-list-row"
}, vv = /* @__PURE__ */ U({
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
		return (t, n) => (K(), q("ul", fv, [e.documents.length > 0 ? (K(!0), q(G, { key: 0 }, W(e.documents, (t) => (K(), q("li", {
			key: t.uuid,
			class: "dui-list-row"
		}, [Y("button", {
			"aria-label": e.isClickable ? `Use ${t.name}` : void 0,
			class: "dui-btn dui-btn-ghost app:col-span-full app:h-auto app:min-h-8 app:w-full app:justify-start app:whitespace-normal app:text-left",
			disabled: !e.isClickable,
			title: e.isClickable ? t.name : void 0,
			type: "button",
			onClick: kl((e) => r(t), ["stop"])
		}, [t.img ? (K(), q("img", {
			key: 0,
			alt: "",
			"aria-hidden": "true",
			src: t.img,
			width: "24",
			height: "24",
			class: "app:size-6 app:shrink-0 app:object-contain"
		}, null, 8, mv)) : (K(), q("i", hv)), Y("span", gv, F(t.name), 1)], 8, pv)]))), 128)) : (K(), q("li", _v, [n[0] ||= Y("i", {
			"aria-hidden": "true",
			class: "fa-solid fa-arrow-down"
		}, null, -1), Y("span", null, F(e.emptyLabel), 1)]))]));
	}
}), yv = { class: "dui-card-body dui-fieldset" }, bv = ["for"], xv = ["id", "value"], Sv = ["for"], Cv = ["id", "value"], wv = { class: "dui-card-actions" }, Tv = /* @__PURE__ */ U({
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
		let n = t, r = Xa(), i = Xa();
		function a(e) {
			let t = e.target instanceof HTMLSelectElement ? e.target.value : "auto";
			(t === "Actor" || t === "auto" || t === "Item" || t === "JournalEntry" || t === "JournalEntryPage") && n("updateDocumentType", t);
		}
		function o(e) {
			n("updateDocumentValue", e.target instanceof HTMLInputElement ? e.target.value : "");
		}
		return (t, s) => (K(), q("form", {
			class: "dui-card dui-card-border dui-card-sm",
			onClick: s[2] ||= kl(() => {}, ["stop"]),
			onSubmit: s[3] ||= kl((e) => n("submit"), ["prevent"])
		}, [Y("fieldset", yv, [
			s[6] ||= Y("legend", { class: "dui-fieldset-legend" }, "Manual document entry", -1),
			Y("label", {
				class: "dui-label",
				for: B(r)
			}, "Document type", 8, bv),
			Y("select", {
				id: B(r),
				class: "dui-select",
				value: e.documentType,
				onChange: a
			}, [...s[4] ||= [tc("<option value=\"auto\">Auto</option><option value=\"Item\">Item</option><option value=\"Actor\">Actor</option><option value=\"JournalEntry\">Journal Entry</option><option value=\"JournalEntryPage\">Journal Page</option>", 5)]], 40, xv),
			Y("label", {
				class: "dui-label",
				for: B(i)
			}, "UUID or drop JSON", 8, Sv),
			Y("input", {
				id: B(i),
				class: "dui-input",
				value: e.documentValue,
				placeholder: "Compendium.package.pack.id",
				type: "text",
				onInput: o
			}, null, 40, Cv),
			Y("div", wv, [
				s[5] ||= Y("button", {
					class: "dui-btn dui-btn-primary",
					type: "submit"
				}, "Use", -1),
				Y("button", {
					class: "dui-btn",
					type: "button",
					onClick: s[0] ||= (e) => n("startPick")
				}, F(e.isPickingDocument ? "Waiting..." : "Pick Next Click"), 1),
				Y("button", {
					class: "dui-btn dui-btn-ghost",
					type: "button",
					onClick: s[1] ||= (e) => n("close")
				}, "Cancel")
			])
		])], 32));
	}
}), Ev = ["aria-label", "aria-disabled"], Dv = { key: 0 }, Ov = {
	key: 1,
	class: "dui-alert dui-alert-info",
	role: "status"
}, kv = { key: 2 }, Av = {
	key: 4,
	class: "dui-card-actions"
}, jv = ["disabled"], Mv = /* @__PURE__ */ U({
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
		let n = e, r = Ra(dv);
		if (!r) throw Error("DocumentDrop requires a document drop bridge from its application host.");
		let i = r, a = Oo(), o = t, s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(!1), l = /* @__PURE__ */ z(!1), u = /* @__PURE__ */ z("auto"), d = /* @__PURE__ */ z(""), f, p = $(() => !!a.prompt), m = $(() => !!a.default), h = $(() => n.showPrompt && (p.value || n.title.length > 0)), g = $(() => n.showDocuments ? n.documents : []), _ = $(() => n.manualEntryTrigger === "button"), v = $(() => n.variant === "bare" ? [] : [
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
		return ho(() => {
			ne();
		}), Ha(() => n.disabled, (e) => {
			e && (s.value = !1, C());
		}), (t, n) => (K(), q("div", ac(t.$attrs, {
			class: v.value,
			"aria-label": e.title,
			"aria-disabled": e.disabled,
			role: "group",
			onDragenter: kl(b, ["prevent"]),
			onDragover: kl(b, ["prevent"]),
			onDragleave: y,
			onDrop: x
		}), [Y("div", { class: P(e.variant === "bare" ? void 0 : "dui-card-body") }, [
			h.value ? (K(), q("div", {
				key: 0,
				class: P(["dui-alert dui-alert-info", { "dui-alert-outline": !s.value }])
			}, [
				n[3] ||= Y("i", {
					"aria-hidden": "true",
					class: "fa-solid fa-arrow-down"
				}, null, -1),
				Y("div", null, [So(t.$slots, "prompt", {}, () => [Y("strong", null, F(e.title), 1), e.description ? (K(), q("p", Dv, F(e.description), 1)) : Q("", !0)])]),
				Y("span", { class: P(["dui-badge", { "dui-badge-info": s.value }]) }, F(s.value ? "Release to add" : "Drop zone"), 3)
			], 2)) : s.value ? (K(), q("div", Ov, [n[4] ||= Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-arrow-down"
			}, null, -1), Y("span", null, "Release to add " + F(e.title.toLowerCase()) + ".", 1)])) : Q("", !0),
			m.value ? (K(), q("div", kv, [So(t.$slots, "default")])) : Q("", !0),
			e.showDocuments ? (K(), J(vv, {
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
			_.value ? (K(), q("div", Av, [Y("button", {
				class: "dui-btn dui-btn-ghost dui-btn-sm",
				disabled: e.disabled,
				type: "button",
				onClick: kl(w, ["stop"])
			}, F(c.value ? "Close Manual Entry" : "Manual Entry"), 9, jv)])) : Q("", !0),
			c.value && !e.disabled ? (K(), J(Tv, {
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
		], 2)], 16, Ev));
	}
});
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/errors.ts
function Nv(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderMountTab/CombinedProfilePreview.vue?vue&type=script&setup=true&lang.ts
var Pv = { class: "app:max-w-full app:overflow-x-auto" }, Fv = { class: "dui-table dui-table-sm" }, Iv = { class: "dui-alert" }, Lv = { class: "app:flex app:flex-wrap app:gap-2" }, Rv = { key: 0 }, zv = {
	key: 1,
	class: "app:grid app:gap-2"
}, Bv = /* @__PURE__ */ U({
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
				mount: tv[t.mount.size],
				result: tv[t.plan.size],
				rider: tv[t.rider.size],
				rule: "Larger"
			}
		]);
		function a(e) {
			return e.fixedDamage === null ? e.outputName : `${e.outputName} (fixed Damage ${e.fixedDamage})`;
		}
		return (t, o) => (K(), q(G, null, [X(sm, {
			description: "This preview uses the Actors' current prepared values. The build recalculates after applying the rider's Career advances.",
			number: "2",
			title: "Combined Profile Preview"
		}, {
			default: V(() => [Y("div", Pv, [Y("table", Fv, [o[0] ||= Y("thead", null, [Y("tr", null, [
				Y("th", null, "Field"),
				Y("th", null, "Rider"),
				Y("th", null, "Mount"),
				Y("th", null, "Combined"),
				Y("th", null, "Rule")
			])], -1), Y("tbody", null, [(K(!0), q(G, null, W(i.value, (e) => (K(), q("tr", { key: e.field }, [
				Y("th", null, F(e.field), 1),
				Y("td", null, F(e.rider), 1),
				Y("td", null, F(e.mount), 1),
				Y("td", null, F(e.result), 1),
				Y("td", null, F(e.rule), 1)
			]))), 128))])])]), Y("p", Iv, " Charge attacks gain +" + F(e.plan.chargeStrengthBonus) + " Damage from the mount's Strength Bonus. The combined profile also gains at least Armour (1). ", 1)]),
			_: 1
		}), X(sm, {
			description: "Mount attack damage is frozen before the traits are copied to the rider.",
			number: "3",
			title: "Mount Traits"
		}, {
			default: V(() => [
				Y("div", Lv, [(K(!0), q(G, null, W(n.value, (e) => (K(), q("span", {
					key: e.sourceUuid,
					class: "dui-badge dui-badge-sm"
				}, F(a(e)), 1))), 128))]),
				n.value.length ? Q("", !0) : (K(), q("p", Rv, "The mount contributes no traits.")),
				r.value.length ? (K(), q("div", zv, [o[1] ||= Y("p", null, [Y("strong", null, "Removed or consolidated")], -1), (K(!0), q(G, null, W(r.value, (e) => (K(), q("p", {
					key: e.sourceUuid,
					class: "dui-alert dui-alert-warning"
				}, [Y("strong", null, F(e.name) + ":", 1), Z(" " + F(e.reason), 1)]))), 128))])) : Q("", !0)
			]),
			_: 1
		})], 64));
	}
}), Vv = { class: "app:grid app:gap-3" }, Hv = { class: "app:grid app:gap-3 md:app:grid-cols-2" }, Uv = { class: "dui-fieldset" }, Wv = ["for"], Gv = ["id"], Kv = { class: "dui-fieldset" }, qv = ["for"], Jv = [
	"id",
	"disabled",
	"value"
], Yv = ["value"], Xv = {
	key: 0,
	class: "dui-card-actions"
}, Zv = {
	key: 1,
	class: "dui-alert dui-alert-warning"
}, Qv = {
	key: 2,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, $v = {
	key: 3,
	"aria-live": "polite",
	class: "dui-alert",
	role: "status"
}, ey = {
	key: 4,
	class: "dui-alert"
}, ty = {
	key: 0,
	class: "dui-avatar"
}, ny = { class: "app:size-16 app:shrink-0 app:rounded-lg" }, ry = ["src"], iy = /* @__PURE__ */ U({
	__name: "NpcBuilderMountTab",
	props: { bridge: {} },
	setup(e) {
		let t = e, n = wp(), { baseActorCombatProfile: r, mountActorProfile: i, mountActors: a, selectedBaseActorUuid: o, selectedMountActorUuid: s } = _u(n), c = /* @__PURE__ */ z(""), l = /* @__PURE__ */ z(""), u = /* @__PURE__ */ z(!1), d = Xa(), f = 0, p = $(() => {
			let e = c.value.trim().toLocaleLowerCase();
			return a.value.filter((t) => t.uuid !== o.value && (!e || t.name.toLocaleLowerCase().includes(e)));
		}), m = $(() => a.value.find((e) => e.uuid === s.value) ?? null), h = $(() => !r.value || !i.value ? null : nv(r.value, i.value));
		Ha(s, async (e) => {
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
				r === f && (n.hydrateMountActorProfile(null), l.value = Nv(e));
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
				l.value = Nv(e);
			}
		}
		return (e, t) => (K(), q("div", Vv, [
			t[5] ||= Y("p", { class: "dui-alert dui-alert-info" }, " Mounts are optional. A selected mount is folded into one simplified NPC profile during build. ", -1),
			X(sm, {
				description: "Choose any world Actor as the mount. This selection does not create a live WFRP mount relationship.",
				number: "1",
				title: "Mount Actor"
			}, {
				default: V(() => [
					Y("div", Hv, [Y("fieldset", Uv, [
						t[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "Search mounts", -1),
						Y("label", {
							class: "dui-label",
							for: `${B(d)}-filter`
						}, "Actor name", 8, Wv),
						H(Y("input", {
							id: `${B(d)}-filter`,
							"onUpdate:modelValue": t[0] ||= (e) => c.value = e,
							"aria-label": "Filter mount actors by name",
							class: "dui-input dui-input-sm",
							placeholder: "Filter world actors",
							type: "search"
						}, null, 8, Gv), [[bl, c.value]])
					]), Y("fieldset", Kv, [
						t[4] ||= Y("legend", { class: "dui-fieldset-legend" }, "Selected mount", -1),
						Y("label", {
							class: "dui-label",
							for: `${B(d)}-mount`
						}, "Mount statblock", 8, qv),
						Y("select", {
							id: `${B(d)}-mount`,
							"aria-label": "Selected mount actor",
							class: "dui-select dui-select-sm",
							disabled: !B(o),
							value: B(s),
							onChange: g
						}, [t[3] ||= Y("option", { value: "" }, "No combined mount", -1), (K(!0), q(G, null, W(p.value, (e) => (K(), q("option", {
							key: e.uuid,
							value: e.uuid
						}, F(e.name), 9, Yv))), 128))], 40, Jv)
					])]),
					X(Mv, {
						disabled: !B(o),
						description: "Drop a world Actor to use as the mount.",
						title: "Drop Mount Actor",
						variant: "compact",
						onDropData: _
					}, null, 8, ["disabled"]),
					B(s) ? (K(), q("div", Xv, [Y("button", {
						class: "dui-btn dui-btn-ghost dui-btn-sm",
						type: "button",
						onClick: t[1] ||= (...e) => B(n).clearMountSelection && B(n).clearMountSelection(...e)
					}, " Clear Mount ")])) : Q("", !0),
					B(o) ? l.value ? (K(), q("p", Qv, F(l.value), 1)) : u.value ? (K(), q("p", $v, " Loading mount profile... ")) : m.value && B(i) ? (K(), q("article", ey, [m.value.img ? (K(), q("div", ty, [Y("div", ny, [Y("img", {
						src: m.value.img,
						alt: "",
						class: "app:h-full app:w-full app:object-cover",
						height: "64",
						width: "64"
					}, null, 8, ry)])])) : Q("", !0), Y("div", null, [Y("strong", null, F(m.value.name), 1), Y("span", null, " Movement " + F(B(i).movement) + " | Wounds " + F(B(i).wounds) + " | " + F(B(tv)[B(i).size]), 1)])])) : Q("", !0) : (K(), q("p", Zv, " Choose the rider on the Build tab before selecting a mount. "))
				]),
				_: 1
			}),
			h.value && B(r) && B(i) ? (K(), J(Bv, {
				key: 0,
				mount: B(i),
				plan: h.value,
				rider: B(r)
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
function ay(e) {
	return e ? e.digDownActive ? e.digDownDeepFileSearchEnabled ? e.digDownCacheReady ? `Dig Down cache ready with ${e.digDownIndexedFileCount} indexed files.` : "Dig Down is active; its file cache is still building or unavailable." : "Dig Down is active, but its Deep File Search setting is disabled." : "Install and enable Dig Down to search local files for portrait suggestions." : "Checking Dig Down integration.";
}
//#endregion
//#region src/module/apps/npc-builder/functions/settings/settings-payload.ts
function oy(e) {
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
function sy(e) {
	let t = wp(), { actorFolders: n, itemFolders: r, settings: i } = _u(t), a = /* @__PURE__ */ z(""), o = /* @__PURE__ */ z(""), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(""), l = /* @__PURE__ */ z(null), u = /* @__PURE__ */ z(""), d = /* @__PURE__ */ z(""), f = $(() => l.value?.digDownActive ?? !0), p = $(() => ay(l.value));
	Ha(l, (e) => {
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
			t.hydrateSettings(await e.saveSettings(Cf())), await ee(), d.value = "Settings reset to defaults.";
		});
	}
	async function w(e) {
		s.value = !0, o.value = "", d.value = "";
		try {
			await e();
		} catch (e) {
			o.value = cy(e);
		} finally {
			s.value = !1;
		}
	}
	async function ee() {
		let [n, r] = await Promise.all([e.listBaseActors(i.value), e.listQuickTraits(i.value)]);
		t.hydrateBaseActors(n), t.hydrateQuickTraits(r);
	}
	function te() {
		return oy({
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
function cy(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderSettingsTab/FolderSetting.vue?vue&type=script&setup=true&lang.ts
var ly = { class: "dui-fieldset" }, uy = { class: "dui-fieldset-legend" }, dy = ["aria-label", "value"], fy = { value: "" }, py = ["value"], my = { class: "dui-fieldset" }, hy = ["aria-label", "value"], gy = { class: "dui-card-actions" }, _y = ["disabled"], vy = /* @__PURE__ */ U({
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
			Y("fieldset", ly, [Y("legend", uy, F(e.folderLabel), 1), Y("select", {
				"aria-label": e.folderLabel,
				class: "dui-select dui-select-sm",
				value: e.selectedUuid,
				onChange: r
			}, [Y("option", fy, F(e.defaultOptionLabel), 1), (K(!0), q(G, null, W(e.folders, (e) => (K(), q("option", {
				key: e.uuid,
				value: e.uuid
			}, F(e.name), 9, py))), 128))], 40, dy)]),
			Y("fieldset", my, [a[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Create or use by name", -1), Y("input", {
				"aria-label": `Create or use ${e.folderLabel} by name`,
				class: "dui-input dui-input-sm",
				value: e.createName,
				placeholder: "Folder name",
				type: "text",
				onInput: i
			}, null, 40, hy)]),
			Y("div", gy, [Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.disabled || !e.createName.trim(),
				type: "button",
				onClick: a[0] ||= (e) => n("saveFolderName")
			}, F(e.buttonLabel ?? "Save Folder"), 9, _y)])
		]));
	}
}), yy = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(sm, {
			description: "Limit the source picker or choose where generated Actors are stored.",
			number: "1",
			title: "Actor Sources"
		}, {
			default: V(() => [X(vy, {
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
			]), X(vy, {
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
}), by = {
	key: 0,
	class: "dui-label"
}, xy = ["checked"], Sy = {
	key: 1,
	class: "dui-label"
}, Cy = ["checked"], wy = {
	key: 2,
	class: "dui-label"
}, Ty = ["checked"], Ey = {
	key: 3,
	class: "dui-label"
}, Dy = ["checked"], Oy = {
	key: 4,
	class: "dui-label"
}, ky = ["checked"], Ay = /* @__PURE__ */ U({
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
		return (t, i) => (K(), J(sm, {
			description: "Choose which base-only data is included in the editable draft.",
			title: "Base Actor Features"
		}, {
			default: V(() => [
				e.showAdvancementFeatures === !1 ? Q("", !0) : (K(), q("label", by, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowCharacteristics,
					type: "checkbox",
					onChange: i[0] ||= (e) => n("allowCharacteristicsChange", r(e))
				}, null, 40, xy), i[5] ||= Y("span", null, "Show base actor characteristics", -1)])),
				e.showAdvancementFeatures === !1 ? Q("", !0) : (K(), q("label", Sy, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowSkills,
					type: "checkbox",
					onChange: i[1] ||= (e) => n("allowSkillsChange", r(e))
				}, null, 40, Cy), i[6] ||= Y("span", null, "Show base actor skills", -1)])),
				e.showAdvancementFeatures === !1 ? Q("", !0) : (K(), q("label", wy, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTalents,
					type: "checkbox",
					onChange: i[2] ||= (e) => n("allowTalentsChange", r(e))
				}, null, 40, Ty), i[7] ||= Y("span", null, "Show base actor talents", -1)])),
				e.showTrappingFeature ? (K(), q("label", Ey, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTrappings,
					type: "checkbox",
					onChange: i[3] ||= (e) => n("allowTrappingsChange", r(e))
				}, null, 40, Dy), i[8] ||= Y("span", null, "Show base actor trappings", -1)])) : Q("", !0),
				e.showTraitFeature === !1 ? Q("", !0) : (K(), q("label", Oy, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.allowTraits,
					type: "checkbox",
					onChange: i[4] ||= (e) => n("allowTraitsChange", r(e))
				}, null, 40, ky), i[9] ||= Y("span", null, "Show base actor traits", -1)]))
			]),
			_: 1
		}));
	}
}), jy = { class: "dui-label" }, My = ["checked"], Ny = /* @__PURE__ */ U({
	__name: "MagicSpellSettings",
	props: { autoSelectGrantedSpells: { type: Boolean } },
	emits: ["autoSelectGrantedSpellsChange"],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("autoSelectGrantedSpellsChange", !!t?.checked);
		}
		return (t, n) => (K(), J(sm, {
			number: "6",
			title: "Magic and Spells"
		}, {
			default: V(() => [Y("label", jy, [Y("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.autoSelectGrantedSpells,
				type: "checkbox",
				onChange: r
			}, null, 40, My), n[0] ||= Y("span", null, "Select detected Lore spells by default", -1)])]),
			_: 1
		}));
	}
}), Py = { class: "dui-label" }, Fy = ["checked"], Iy = /* @__PURE__ */ U({
	__name: "NamingSettings",
	props: { includeSpeciesInName: { type: Boolean } },
	emits: ["includeSpeciesInNameChange"],
	setup(e, { emit: t }) {
		let n = t;
		function r(e) {
			let t = e.target;
			n("includeSpeciesInNameChange", !!t?.checked);
		}
		return (t, n) => (K(), J(sm, {
			number: "3",
			title: "Default Naming"
		}, {
			default: V(() => [Y("label", Py, [Y("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.includeSpeciesInName,
				type: "checkbox",
				onChange: r
			}, null, 40, Fy), n[0] ||= Y("span", null, "Include species in suggested names", -1)])]),
			_: 1
		}));
	}
}), Ly = { class: "dui-fieldset" }, Ry = ["value"], zy = { class: "dui-label" }, By = ["checked"], Vy = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(sm, { title: "Career Resolution" }, {
			default: V(() => [Y("fieldset", Ly, [n[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Lower career handling", -1), Y("select", {
				"aria-label": "Lower career handling",
				class: "dui-select dui-select-sm",
				value: e.lowerCareerMode,
				onChange: r
			}, [...n[0] ||= [
				Y("option", { value: "prompt" }, "Prompt when candidates are found", -1),
				Y("option", { value: "auto-add-all" }, "Automatically add all lower-tier matches", -1),
				Y("option", { value: "never" }, "Only add dropped careers", -1)
			]], 40, Ry)]), Y("label", zy, [Y("input", {
				class: "dui-toggle dui-toggle-sm",
				checked: e.askForLinkedSkillSpecializations,
				type: "checkbox",
				onChange: i
			}, null, 40, By), n[2] ||= Y("span", null, "Resolve linked career skill repeats separately", -1)])]),
			_: 1
		}));
	}
}), Hy = { class: "app:grid app:gap-1" }, Uy = ["value"], Wy = { class: "dui-label" }, Gy = ["checked"], Ky = { class: "app:grid app:gap-1" }, qy = ["value"], Jy = { class: "dui-label" }, Yy = ["checked", "disabled"], Xy = {
	"aria-live": "polite",
	class: "dui-alert",
	role: "status"
}, Zy = { class: "dui-label" }, Qy = ["checked"], $y = { class: "dui-label" }, eb = ["checked"], tb = /* @__PURE__ */ U({
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
		return (t, n) => (K(), J(sm, {
			description: "Choose which local Foundry sources can suggest portraits.",
			number: "4",
			title: "Portrait Suggestions"
		}, {
			default: V(() => [
				Y("label", Hy, [
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
					}, null, 40, Uy),
					n[1] ||= Y("small", { id: "portrait-priority-folders-help" }, " One Foundry data path per line. These appear first, ahead of compendiums, world documents, and Dig Down results. ", -1)
				]),
				Y("label", Wy, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.excludeFullyTransparentPortraitAssets,
					type: "checkbox",
					onChange: r
				}, null, 40, Gy), n[2] ||= Y("span", null, "Hide fully empty or transparent images", -1)]),
				Y("label", Ky, [
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
					}, null, 40, qy),
					n[4] ||= Y("small", { id: "portrait-excluded-references-help" }, " One image path per line. Each listed image and its visual duplicates are hidden. Broken images are always hidden. ", -1)
				]),
				Y("label", Jy, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchFoundryPortraitAssets,
					disabled: !e.canUseDigDownPortraitSearch,
					type: "checkbox",
					onChange: o
				}, null, 40, Yy), n[5] ||= Y("span", null, "Search Dig Down's file cache for portrait suggestions", -1)]),
				Y("p", Xy, F(e.statusLabel), 1),
				Y("label", Zy, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchCompendiumPortraitAssets,
					type: "checkbox",
					onChange: s
				}, null, 40, Qy), n[6] ||= Y("span", null, "Search Actor and Item compendiums for portrait suggestions", -1)]),
				Y("label", $y, [Y("input", {
					class: "dui-toggle dui-toggle-sm",
					checked: e.searchWebPortraitAssets,
					disabled: "",
					type: "checkbox"
				}, null, 8, eb), n[7] ||= Y("span", null, "Search the web for portrait suggestions (later)", -1)])
			]),
			_: 1
		}));
	}
}), nb = { class: "dui-card-actions" }, rb = ["disabled"], ib = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(sm, {
			description: "Items in this folder become one-click Trait choices on the Build tab.",
			number: "2",
			title: "Quick Traits"
		}, {
			default: V(() => [X(vy, {
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
			]), Y("div", nb, [Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.isBusy || !e.quickTraitFolderUuid,
				type: "button",
				onClick: r[3] ||= (e) => n("importRecommendedQuickTraits")
			}, " Import Recommended Quick Traits ", 8, rb)])]),
			_: 1
		}));
	}
}), ab = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, ob = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, sb = /* @__PURE__ */ U({
	__name: "SettingsMessages",
	props: {
		errorMessage: {},
		settingsMessage: {}
	},
	setup(e) {
		return (t, n) => e.errorMessage ? (K(), q("p", ab, F(e.errorMessage), 1)) : e.settingsMessage ? (K(), q("p", ob, F(e.settingsMessage), 1)) : Q("", !0);
	}
}), cb = { class: "app:grid app:gap-3" }, lb = { class: "app:grid app:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] app:gap-3" }, ub = { class: "dui-card-actions" }, db = ["disabled"], fb = ["disabled"], pb = /* @__PURE__ */ U({
	__name: "NpcBuilderSettingsTab",
	props: {
		bridge: {},
		page: {}
	},
	setup(e) {
		let { actorFolders: t, baseActorFolderName: n, canUseDigDownPortraitSearch: r, errorMessage: i, importRecommendedQuickTraits: a, isBusy: o, itemFolders: s, outputActorFolderName: c, portraitSearchStatusLabel: l, quickTraitFolderName: u, refreshPortraitSearchAvailability: d, resetSettingsToDefaults: f, saveBaseActorFolderName: p, saveOutputActorFolderName: m, saveQuickTraitFolderName: h, saveSettings: g, settings: _, settingsMessage: v } = sy(e.bridge);
		return fo(() => {
			d();
		}), (d, y) => (K(), q("section", cb, [
			X(sb, {
				"error-message": B(i),
				"settings-message": B(v)
			}, null, 8, ["error-message", "settings-message"]),
			Y("div", lb, [
				e.page === "settings-folders" ? (K(), J(yy, {
					key: 0,
					class: "app:col-span-full",
					"actor-folders": B(t),
					"base-actor-folder-name": B(n),
					"base-actor-folder-uuid": B(_).baseActorFolderUuid,
					"is-busy": B(o),
					"output-actor-folder-name": B(c),
					"output-actor-folder-uuid": B(_).outputActorFolderUuid,
					onBaseActorFolderNameChange: y[0] ||= (e) => n.value = e,
					onBaseActorFolderUuidChange: y[1] ||= (e) => B(_).baseActorFolderUuid = e,
					onOutputActorFolderNameChange: y[2] ||= (e) => c.value = e,
					onOutputActorFolderUuidChange: y[3] ||= (e) => B(_).outputActorFolderUuid = e,
					onSaveBaseActorFolderName: B(p),
					onSaveOutputActorFolderName: B(m)
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
				e.page === "settings-folders" ? (K(), J(ib, {
					key: 1,
					"is-busy": B(o),
					"item-folders": B(s),
					"quick-trait-folder-name": B(u),
					"quick-trait-folder-uuid": B(_).quickTraitFolderUuid,
					onImportRecommendedQuickTraits: B(a),
					onQuickTraitFolderNameChange: y[4] ||= (e) => u.value = e,
					onQuickTraitFolderUuidChange: y[5] ||= (e) => B(_).quickTraitFolderUuid = e,
					onSaveQuickTraitFolderName: B(h)
				}, null, 8, [
					"is-busy",
					"item-folders",
					"quick-trait-folder-name",
					"quick-trait-folder-uuid",
					"onImportRecommendedQuickTraits",
					"onSaveQuickTraitFolderName"
				])) : Q("", !0),
				e.page === "settings-suggestions" ? (K(), J(Iy, {
					key: 2,
					"include-species-in-name": B(_).includeSpeciesInName,
					onIncludeSpeciesInNameChange: y[6] ||= (e) => B(_).includeSpeciesInName = e
				}, null, 8, ["include-species-in-name"])) : Q("", !0),
				e.page === "settings-suggestions" ? (K(), J(tb, {
					key: 3,
					"can-use-dig-down-portrait-search": B(r),
					"exclude-fully-transparent-portrait-assets": B(_).excludeFullyTransparentPortraitAssets,
					"excluded-portrait-reference-images": B(_).excludedPortraitReferenceImages,
					"prioritized-portrait-folders": B(_).prioritizedPortraitFolders,
					"search-compendium-portrait-assets": B(_).searchCompendiumPortraitAssets,
					"search-foundry-portrait-assets": B(_).searchFoundryPortraitAssets,
					"search-web-portrait-assets": B(_).searchWebPortraitAssets,
					"status-label": B(l),
					onExcludeFullyTransparentPortraitAssetsChange: y[7] ||= (e) => B(_).excludeFullyTransparentPortraitAssets = e,
					onExcludedPortraitReferenceImagesChange: y[8] ||= (e) => B(_).excludedPortraitReferenceImages = e,
					onPrioritizedPortraitFoldersChange: y[9] ||= (e) => B(_).prioritizedPortraitFolders = e,
					onSearchCompendiumPortraitAssetsChange: y[10] ||= (e) => B(_).searchCompendiumPortraitAssets = e,
					onSearchFoundryPortraitAssetsChange: y[11] ||= (e) => B(_).searchFoundryPortraitAssets = e
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
				e.page === "settings-advancement" ? (K(), J(Ay, {
					key: 4,
					"allow-characteristics": B(_).allowBaseActorCharacteristics,
					"allow-skills": B(_).allowBaseActorSkills,
					"allow-talents": B(_).allowBaseActorTalents,
					"allow-traits": B(_).allowBaseActorTraits,
					"allow-trappings": B(_).allowBaseActorTrappings,
					"show-trapping-feature": !1,
					onAllowCharacteristicsChange: y[12] ||= (e) => B(_).allowBaseActorCharacteristics = e,
					onAllowSkillsChange: y[13] ||= (e) => B(_).allowBaseActorSkills = e,
					onAllowTalentsChange: y[14] ||= (e) => B(_).allowBaseActorTalents = e,
					onAllowTraitsChange: y[15] ||= (e) => B(_).allowBaseActorTraits = e,
					onAllowTrappingsChange: y[16] ||= (e) => B(_).allowBaseActorTrappings = e
				}, null, 8, [
					"allow-characteristics",
					"allow-skills",
					"allow-talents",
					"allow-traits",
					"allow-trappings"
				])) : Q("", !0),
				e.page === "settings-resolution" ? (K(), J(Ny, {
					key: 5,
					"auto-select-granted-spells": B(_).autoSelectGrantedSpells,
					onAutoSelectGrantedSpellsChange: y[17] ||= (e) => B(_).autoSelectGrantedSpells = e
				}, null, 8, ["auto-select-granted-spells"])) : Q("", !0),
				e.page === "settings-resolution" ? (K(), J(Ay, {
					key: 6,
					"allow-characteristics": B(_).allowBaseActorCharacteristics,
					"allow-skills": B(_).allowBaseActorSkills,
					"allow-talents": B(_).allowBaseActorTalents,
					"allow-traits": B(_).allowBaseActorTraits,
					"allow-trappings": B(_).allowBaseActorTrappings,
					"show-advancement-features": !1,
					"show-trait-feature": !1,
					"show-trapping-feature": "",
					onAllowCharacteristicsChange: y[18] ||= (e) => B(_).allowBaseActorCharacteristics = e,
					onAllowSkillsChange: y[19] ||= (e) => B(_).allowBaseActorSkills = e,
					onAllowTalentsChange: y[20] ||= (e) => B(_).allowBaseActorTalents = e,
					onAllowTraitsChange: y[21] ||= (e) => B(_).allowBaseActorTraits = e,
					onAllowTrappingsChange: y[22] ||= (e) => B(_).allowBaseActorTrappings = e
				}, null, 8, [
					"allow-characteristics",
					"allow-skills",
					"allow-talents",
					"allow-traits",
					"allow-trappings"
				])) : Q("", !0),
				e.page === "settings-resolution" ? (K(), J(Vy, {
					key: 7,
					class: "app:col-span-full",
					"ask-for-linked-skill-specializations": B(_).askForLinkedSkillSpecializations,
					"lower-career-mode": B(_).lowerCareerMode,
					onAskForLinkedSkillSpecializationsChange: y[23] ||= (e) => B(_).askForLinkedSkillSpecializations = e,
					onLowerCareerModeChange: y[24] ||= (e) => B(_).lowerCareerMode = e
				}, null, 8, ["ask-for-linked-skill-specializations", "lower-career-mode"])) : Q("", !0)
			]),
			Y("div", ub, [Y("button", {
				class: "dui-btn dui-btn-primary dui-btn-sm",
				disabled: B(o),
				type: "button",
				onClick: y[25] ||= (...e) => B(g) && B(g)(...e)
			}, " Save Settings ", 8, db), Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: B(o),
				type: "button",
				onClick: y[26] ||= (...e) => B(f) && B(f)(...e)
			}, " Reset to Defaults ", 8, fb)])
		]));
	}
});
//#endregion
//#region src/module/apps/npc-builder/functions/magic-lore-resolution.ts
function mb(e) {
	return e.map((e) => `${e.kind}:${e.sourceName}:${e.rawLore}`).sort().join("|");
}
function hb(e) {
	return e.filter((e) => e.isAmbiguous);
}
function gb(e, t) {
	return { rows: hb(e).map((e) => ({
		grantLabel: vb(e),
		options: Pf(e, t),
		rawLore: e.rawLore,
		resolutionKey: e.resolutionKey,
		selectedLore: "",
		sourceLabel: yb(e)
	})) };
}
function _b(e) {
	return e.kind === "arcane-magic" ? "Arcane Magic" : e.kind === "petty-magic" ? "Petty Magic" : "Spellcaster";
}
function vb(e) {
	return `${_b(e)} from ${e.sourceName}`;
}
function yb(e) {
	return e.source === "talent" ? "Talent" : "Trait";
}
//#endregion
//#region src/module/apps/npc-builder/state/workflows/spells-workflow.ts
function bb(e) {
	let t = wp(), { magicGrants: n, spells: r, selectedSpells: i } = _u(t), a = /* @__PURE__ */ z(""), o = /* @__PURE__ */ z(!1), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z([]), l = /* @__PURE__ */ z(null), u = 0, d = $(() => hb(n.value)), f = $(() => n.value.length - d.value.length);
	Ha(() => mb(n.value), () => {
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
			u === r && (a.value = xb(e));
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
				a.value = xb(e);
			} finally {
				o.value = !1;
			}
		}
	}
	async function g() {
		a.value = "", await h(), l.value = gb(n.value, c.value);
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
			a.value = xb(e);
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
function xb(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that spell action.";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/MagicLoreResolutionPromptContent.vue?vue&type=script&setup=true&lang.ts
var Sb = { class: "dui-card-body" }, Cb = { class: "dui-card-title" }, wb = { class: "dui-fieldset" }, Tb = ["onUpdate:modelValue", "aria-label"], Eb = ["value"], Db = { class: "dui-card-actions" }, Ob = /* @__PURE__ */ U({
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
			}, [Y("div", Sb, [
				Y("h3", Cb, F(e.grantLabel), 1),
				Y("span", null, F(e.sourceLabel) + " - " + F(e.rawLore || "Any Lore"), 1),
				Y("fieldset", wb, [r[3] ||= Y("legend", { class: "dui-fieldset-legend" }, "Lore", -1), H(Y("select", {
					"onUpdate:modelValue": (t) => e.selectedLore = t,
					"aria-label": `Lore for ${e.grantLabel}`,
					class: "dui-select dui-select-sm"
				}, [r[2] ||= Y("option", { value: "" }, "Leave unresolved", -1), (K(!0), q(G, null, W(e.options, (e) => (K(), q("option", {
					key: e.key,
					value: e.value
				}, F(e.label) + F(e.wind && e.wind !== "None" ? ` (${e.wind})` : ""), 9, Eb))), 128))], 8, Tb), [[Cl, e.selectedLore]])])
			])]))), 128)),
			Y("div", Db, [Y("button", {
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
}), kb = {
	key: 0,
	class: "dui-alert"
}, Ab = {
	key: 1,
	class: "dui-list"
}, jb = { class: "dui-list-col-grow" }, Mb = { key: 0 }, Nb = { key: 1 }, Pb = {
	key: 2,
	class: "dui-card-actions"
}, Fb = ["disabled"], Ib = /* @__PURE__ */ U({
	__name: "MagicAccessPanel",
	props: {
		ambiguousGrantCount: {},
		isLoadingLoreOptions: { type: Boolean },
		magicGrants: {}
	},
	emits: ["resolveLores"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (K(), J(sm, {
			description: "Magic Talents and Traits determine which spell Lores are available.",
			number: "1",
			title: "Magic Access"
		}, {
			default: V(() => [e.magicGrants.length ? (K(), q("ul", Ab, [(K(!0), q(G, null, W(e.magicGrants, (e) => (K(), q("li", {
				key: `${e.source}:${e.sourceName}:${e.rawLore}`,
				class: "dui-list-row"
			}, [Y("div", jb, [
				Y("strong", null, F(B(_b)(e)), 1),
				Y("span", null, F(B(yb)(e)) + " - " + F(e.sourceName), 1),
				e.isAmbiguous ? (K(), q("small", Mb, " Needs Lore resolution before automatic spells can be found. ")) : (K(), q("small", Nb, " Lore: " + F(e.rawLore || e.normalizedLore), 1))
			])]))), 128))])) : (K(), q("p", kb, " No magic-enabling Talent or Trait is selected. ")), e.ambiguousGrantCount ? (K(), q("div", Pb, [Y("button", {
				class: "dui-btn dui-btn-sm",
				disabled: e.isLoadingLoreOptions,
				type: "button",
				onClick: r[0] ||= (e) => n("resolveLores")
			}, F(e.isLoadingLoreOptions ? "Loading Lores..." : "Resolve Lores"), 9, Fb)])) : Q("", !0)]),
			_: 1
		}));
	}
});
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderSpellsTab/labels.ts
function Lb(e) {
	return e.source === "custom" ? "Dropped" : e.sourceLabel;
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderSpellsTab/SpellSelectionPanel.vue?vue&type=script&setup=true&lang.ts
var Rb = { class: "dui-card-actions" }, zb = ["disabled"], Bb = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, Vb = {
	key: 1,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, Hb = {
	key: 2,
	class: "dui-list"
}, Ub = [
	"aria-label",
	"checked",
	"onChange"
], Wb = { class: "dui-list-col-grow" }, Gb = {
	key: 0,
	class: "dui-avatar"
}, Kb = ["src"], qb = ["onClick"], Jb = {
	key: 3,
	class: "dui-alert"
}, Yb = /* @__PURE__ */ U({
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
		return (t, r) => (K(), J(sm, {
			description: "Select detected Lore spells or drop specific Spell Items.",
			number: "2",
			title: "Spells"
		}, {
			default: V(() => [
				X(Mv, {
					description: "Add a specific Spell item regardless of detected Lores.",
					title: "Drop Spell Items",
					onDropData: r[0] ||= (e) => n("spellDrop", e)
				}),
				Y("div", Rb, [Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: e.isLoadingSpells || !e.resolvedGrantCount,
					type: "button",
					onClick: r[1] ||= (e) => n("refreshSpells")
				}, F(e.isLoadingSpells ? "Finding spells..." : "Refresh Spells"), 9, zb), Y("span", null, F(e.selectedSpellCount) + " selected / " + F(e.spells.length) + " found", 1)]),
				e.errorMessage ? (K(), q("p", Bb, F(e.errorMessage), 1)) : Q("", !0),
				e.ambiguousGrantCount ? (K(), q("p", Vb, F(e.ambiguousGrantCount) + " magic grant" + F(e.ambiguousGrantCount === 1 ? "" : "s") + " still need Lore resolution. You can still drop specific spells for now. ", 1)) : Q("", !0),
				e.spells.length ? (K(), q("ul", Hb, [(K(!0), q(G, null, W(e.spells, (e) => (K(), q("li", {
					key: e.key,
					class: "dui-list-row"
				}, [
					Y("input", {
						"aria-label": `Use ${e.name}`,
						class: "dui-checkbox dui-checkbox-sm",
						checked: e.selected,
						type: "checkbox",
						onChange: (t) => n("spellSelectedChange", e, t)
					}, null, 40, Ub),
					Y("div", Wb, [
						e.img ? (K(), q("div", Gb, [Y("div", null, [Y("img", {
							src: e.img,
							alt: ""
						}, null, 8, Kb)])])) : Q("", !0),
						Y("strong", null, F(e.name), 1),
						Y("span", null, F(e.loreName || "Unknown Lore") + " · " + F(B(Lb)(e)), 1)
					]),
					e.source === "custom" ? (K(), q("button", {
						key: 0,
						class: "dui-btn dui-btn-sm",
						type: "button",
						onClick: (t) => n("removeCustomSpell", e.key)
					}, " Remove ", 8, qb)) : Q("", !0)
				]))), 128))])) : (K(), q("p", Jb, " No matching spells found yet. Drop specific spells here, or resolve a non-ambiguous magic Lore. "))
			]),
			_: 1
		}));
	}
}), Xb = /* @__PURE__ */ U({
	__name: "NpcBuilderSpellsTab",
	props: { bridge: {} },
	setup(e) {
		let { ambiguousGrants: t, confirmMagicLorePrompt: n, dismissMagicLorePrompt: r, errorMessage: i, handleSpellDrop: a, initialize: o, isLoadingLoreOptions: s, isLoadingSpells: c, loadDetectedSpells: l, magicGrants: u, openMagicLorePrompt: d, pendingMagicLorePrompt: f, removeCustomSpell: p, resolvedGrantCount: m, selectedSpells: h, setSpellSelected: g, spells: _ } = bb(e.bridge);
		fo(() => {
			o();
		});
		function v(e, t) {
			let n = t.target;
			n && g(e.key, n.checked);
		}
		return (e, o) => (K(), q("section", null, [
			X(Mp, {
				open: B(f) !== null,
				title: "Resolve Magic Lores",
				onClose: B(r)
			}, {
				default: V(() => [B(f) ? (K(), J(Ob, {
					key: 0,
					prompt: B(f),
					onApplyLores: B(n),
					onKeepUnresolved: B(r)
				}, null, 8, [
					"prompt",
					"onApplyLores",
					"onKeepUnresolved"
				])) : Q("", !0)]),
				_: 1
			}, 8, ["open", "onClose"]),
			X(Ib, {
				"ambiguous-grant-count": B(t).length,
				"is-loading-lore-options": B(s),
				"magic-grants": B(u),
				onResolveLores: B(d)
			}, null, 8, [
				"ambiguous-grant-count",
				"is-loading-lore-options",
				"magic-grants",
				"onResolveLores"
			]),
			o[0] ||= Y("div", { class: "dui-divider" }, null, -1),
			X(Yb, {
				"ambiguous-grant-count": B(t).length,
				"error-message": B(i),
				"is-loading-spells": B(c),
				"resolved-grant-count": B(m),
				"selected-spell-count": B(h).length,
				spells: B(_),
				onRefreshSpells: B(l),
				onRemoveCustomSpell: B(p),
				onSpellDrop: B(a),
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
}), Zb = { class: "dui-collapse-title" }, Qb = { class: "dui-badge" }, $b = {
	key: 0,
	class: "dui-badge dui-badge-info"
}, ex = {
	key: 1,
	class: "dui-badge dui-badge-warning"
}, tx = { class: "dui-collapse-content" }, nx = { class: "dui-fieldset" }, rx = { class: "dui-fieldset-legend" }, ix = [
	"aria-label",
	"value",
	"onInput"
], ax = {
	key: 0,
	class: "dui-fieldset"
}, ox = [
	"aria-label",
	"value",
	"onChange"
], sx = ["value"], cx = {
	key: 1,
	class: "dui-fieldset"
}, lx = [
	"aria-label",
	"value",
	"onInput"
], ux = ["onClick"], dx = {
	key: 0,
	class: "dui-alert"
}, fx = /* @__PURE__ */ U({
	__name: "NpcBuilderTraitsTab",
	props: { difficultyOptions: {} },
	setup(e) {
		let t = wp(), { traits: n } = _u(t);
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
		return (t, o) => (K(), J(sm, {
			description: "Open a Trait to review its WFRP configuration before building.",
			title: "Traits"
		}, {
			default: V(() => [(K(!0), q(G, null, W(B(n), (t) => (K(), q("details", {
				key: t.key,
				class: "dui-collapse dui-collapse-arrow dui-card-border"
			}, [Y("summary", Zb, [
				Y("strong", null, F(t.name), 1),
				Y("span", Qb, F(r(t)), 1),
				t.config.rollable ? (K(), q("span", $b, "Rollable")) : Q("", !0),
				t.config.damage ? (K(), q("span", ex, "Damage")) : Q("", !0)
			]), Y("div", tx, [
				Y("fieldset", nx, [Y("legend", rx, F(t.config.damage ? "Damage" : "Specification"), 1), Y("input", {
					"aria-label": `${t.config.damage ? "Damage" : "Specification"} for ${t.name}`,
					class: "dui-input dui-input-sm",
					value: t.config.specification,
					placeholder: "None",
					type: "text",
					onInput: (e) => a(t, "specification", e)
				}, null, 40, ix)]),
				t.config.rollable && !t.config.damage ? (K(), q("fieldset", ax, [o[0] ||= Y("legend", { class: "dui-fieldset-legend" }, "Difficulty", -1), Y("select", {
					"aria-label": `Difficulty for ${t.name}`,
					class: "dui-select dui-select-sm",
					value: t.config.defaultDifficulty,
					onChange: (e) => a(t, "defaultDifficulty", e)
				}, [(K(!0), q(G, null, W(e.difficultyOptions, (e) => (K(), q("option", {
					key: e.value,
					value: e.value
				}, F(e.label), 9, sx))), 128))], 40, ox)])) : Q("", !0),
				t.config.damage && t.config.dice ? (K(), q("fieldset", cx, [o[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Dice", -1), Y("input", {
					"aria-label": `Dice for ${t.name}`,
					class: "dui-input dui-input-sm",
					value: t.config.dice,
					placeholder: "Optional",
					type: "text",
					onInput: (e) => a(t, "dice", e)
				}, null, 40, lx)])) : Q("", !0),
				Y("button", {
					class: "dui-btn dui-btn-sm",
					type: "button",
					onClick: (e) => i(t)
				}, "Remove", 8, ux)
			])]))), 128)), B(n).length ? Q("", !0) : (K(), q("p", dx, "No traits are selected yet."))]),
			_: 1
		}));
	}
}), px = "__blank-item__";
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderTrappingsTab/resolution-labels.ts
function mx(e) {
	return e.source === "base" ? "Base" : e.source === "career" ? "Career" : "Custom";
}
function hx(e) {
	return e.resolution.status === "matched" ? `Matched ${e.resolution.selectedName}` : e.resolution.status === "fallback" ? `Blank ${e.resolution.selectedName || e.name}` : e.resolution.candidates.length ? "Choose a match" : "Needs resolution";
}
function gx(e) {
	return e.ignored ? "Ignored" : e.resolution.status === "matched" ? "Matched" : e.resolution.status === "fallback" ? "Blank item" : e.resolution.status === "ambiguous" || e.resolution.candidates.length ? "Choose" : "Needs resolution";
}
function _x(e) {
	let t = "dui-badge";
	return e.ignored ? [t, "dui-badge-ghost"] : e.resolution.status === "matched" ? [t, "dui-badge-success"] : e.resolution.status === "fallback" ? [t, "dui-badge-info"] : e.resolution.status === "ambiguous" || e.resolution.candidates.length ? [t, "dui-badge-warning"] : [t, "dui-badge-error"];
}
function vx(e) {
	return e.resolution.status === "fallback" ? px : e.resolution.selectedCandidateUuid;
}
function yx(e) {
	return e.source === "career";
}
function bx(e) {
	return e.resolution.candidates.length > 0 || yx(e);
}
function xx(e) {
	return e.resolution.searchTerms.length <= 1 ? "" : `Options: ${e.resolution.searchTerms.join(" / ")}`;
}
//#endregion
//#region src/module/apps/npc-builder/view/components/NpcBuilderTrappingsTab/TrappingsTable.vue?vue&type=script&setup=true&lang.ts
var Sx = {
	key: 0,
	class: "dui-list"
}, Cx = [
	"aria-label",
	"checked",
	"onChange"
], wx = { class: "dui-list-col-grow app:grid app:gap-2" }, Tx = { key: 0 }, Ex = {
	key: 1,
	class: "dui-fieldset"
}, Dx = [
	"aria-label",
	"value",
	"onChange"
], Ox = {
	key: 0,
	value: ""
}, kx = ["value"], Ax = ["value"], jx = { key: 2 }, Mx = { class: "dui-card-actions" }, Nx = { class: "dui-fieldset" }, Px = [
	"aria-label",
	"value",
	"onInput"
], Fx = ["onClick"], Ix = {
	key: 1,
	class: "dui-alert"
}, Lx = /* @__PURE__ */ U({
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
		return (t, r) => e.trappings.length ? (K(), q("ul", Sx, [(K(!0), q(G, null, W(e.trappings, (e) => (K(), q("li", {
			key: e.key,
			class: "dui-list-row"
		}, [Y("input", {
			"aria-label": `Use ${e.name}`,
			class: "dui-checkbox dui-checkbox-sm",
			checked: !e.ignored,
			type: "checkbox",
			onChange: (t) => n("useChange", e.key, t)
		}, null, 40, Cx), Y("div", wx, [
			Y("strong", null, F(e.name), 1),
			Y("span", null, F(e.resolution.selectedItemType || e.itemType || "trapping") + " · " + F(B(mx)(e)), 1),
			B(xx)(e) ? (K(), q("span", Tx, F(B(xx)(e)), 1)) : Q("", !0),
			Y("span", { class: P(B(_x)(e)) }, F(B(gx)(e)), 3),
			B(bx)(e) ? (K(), q("fieldset", Ex, [r[0] ||= Y("legend", { class: "dui-fieldset-legend" }, "Resolution", -1), Y("select", {
				"aria-label": `Resolution for ${e.name}`,
				class: "dui-select dui-select-sm",
				value: B(vx)(e),
				onChange: (t) => n("resolutionChange", e.key, t)
			}, [
				e.resolution.candidates.length ? (K(), q("option", Ox, "Choose match")) : Q("", !0),
				(K(!0), q(G, null, W(e.resolution.candidates, (e) => (K(), q("option", {
					key: e.uuid,
					value: e.uuid
				}, F(e.name) + " (" + F(e.sourceLabel) + ") ", 9, kx))), 128)),
				B(yx)(e) ? (K(), q("option", {
					key: 1,
					value: B(px)
				}, " Blank Item ", 8, Ax)) : Q("", !0)
			], 40, Dx)])) : (K(), q("span", jx, F(B(hx)(e)), 1)),
			Y("div", Mx, [Y("fieldset", Nx, [r[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Quantity", -1), Y("input", {
				"aria-label": `Quantity for ${e.name}`,
				class: "dui-input dui-input-sm",
				value: e.quantity,
				min: "1",
				type: "number",
				onInput: (t) => n("quantityInput", e.key, t)
			}, null, 40, Px)]), e.source === "custom" ? (K(), q("button", {
				key: 0,
				class: "dui-btn dui-btn-sm",
				type: "button",
				onClick: (t) => n("removeCustomTrapping", e.key)
			}, " Remove ", 8, Fx)) : Q("", !0)])
		])]))), 128))])) : (K(), q("p", Ix, "No trappings are selected yet."));
	}
}), Rx = { class: "dui-card-actions" }, zx = ["disabled"], Bx = { key: 0 }, Vx = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, Hx = /* @__PURE__ */ U({
	__name: "NpcBuilderTrappingsTab",
	props: { bridge: {} },
	setup(e) {
		let t = e, n = wp(), { trappings: r } = _u(n), i = /* @__PURE__ */ z(""), a = /* @__PURE__ */ z(!1), o = $(() => r.value.filter((e) => !e.ignored && e.resolution.status === "unresolved"));
		fo(() => {
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
		return (e, t) => (K(), J(sm, {
			description: "Review the Items that will be embedded in the generated NPC.",
			title: "Trappings"
		}, {
			default: V(() => [
				Y("div", Rx, [Y("button", {
					class: "dui-btn dui-btn-sm",
					disabled: a.value || !o.value.length,
					type: "button",
					onClick: u
				}, F(a.value ? "Resolving..." : "Resolve Trappings"), 9, zx), o.value.length ? (K(), q("span", Bx, F(o.value.length) + " unresolved ", 1)) : Q("", !0)]),
				i.value ? (K(), q("p", Vx, F(i.value), 1)) : Q("", !0),
				X(Lx, {
					trappings: B(r),
					onQuantityInput: s,
					onRemoveCustomTrapping: B(n).removeCustomTrapping,
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
function Ux(e, t) {
	let n = /* @__PURE__ */ new Map(), r = [], i = [];
	for (let a of e) {
		let e = /* @__PURE__ */ new Map();
		for (let o of Nu(a.career.uuid, a.career.grants.skills)) {
			let s = Mu(o.originalName);
			if (!s) continue;
			let c = Pu(o.originalName), l = n.get(c) ?? [], u = e.get(c) ?? 0, d = t.enableLinkedSkillResolution && l[u] ? l[u] : "";
			if (e.set(c, u + 1), d) {
				r.push({
					linkedFromKey: d,
					resolutionKey: o.resolutionKey
				});
				continue;
			}
			i.push({
				alreadyGrantedSpecializations: Jx(a.career.grants.skills, s.baseName),
				baseName: s.baseName,
				careerLabel: Yx(a.career),
				isLoadingSuggestions: !1,
				occurrence: o.occurrence,
				options: s.options,
				originalName: s.originalName,
				resolvedSpecialization: Xx(s),
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
function Wx(e) {
	return e.resolvedSpecialization.trim() ? Au(e.baseName, e.resolvedSpecialization) : "";
}
function Gx(e) {
	return e.occurrence > 0 ? `${e.originalName}, choice ${e.occurrence + 1}` : e.originalName;
}
function Kx(e) {
	return e.options.length <= 1 && e.specialization.trim().toLocaleLowerCase() === "any";
}
function qx(e, t) {
	let n = Pu(t);
	return e.alreadyGrantedSpecializations.some((e) => Pu(e) === n);
}
function Jx(e, t) {
	let n = Pu(t), r = /* @__PURE__ */ new Set(), i = [];
	for (let t of e) {
		let e = ju(t);
		if (!e || Pu(e.baseName) !== n) continue;
		let a = Pu(e.specialization);
		r.has(a) || (r.add(a), i.push(e.specialization));
	}
	return i;
}
function Yx(e) {
	return e.level === null ? e.name : `${e.name}, tier ${e.level}`;
}
function Xx(e) {
	return e.specialization.trim().toLocaleLowerCase() === "any" ? "" : e.options[0] ?? "";
}
//#endregion
//#region src/module/apps/npc-builder/view/components/SkillResolutionPromptContent.vue?vue&type=script&setup=true&lang.ts
var Zx = { class: "dui-card-body" }, Qx = { class: "dui-card-title" }, $x = { class: "dui-badge" }, eS = { class: "dui-fieldset" }, tS = { class: "app:grid app:gap-1" }, nS = ["onUpdate:modelValue", "aria-label"], rS = ["value"], iS = [
	"onUpdate:modelValue",
	"aria-label",
	"placeholder"
], aS = {
	key: 0,
	class: "dui-label app:text-error"
}, oS = {
	key: 0,
	class: "dui-card-actions"
}, sS = { key: 0 }, cS = ["onClick"], lS = {
	key: 0,
	class: "dui-badge dui-badge-error dui-badge-xs"
}, uS = {
	key: 0,
	class: "dui-alert dui-alert-info"
}, dS = { class: "dui-card-actions" }, fS = /* @__PURE__ */ U({
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
			return !!e.resolvedSpecialization && qx(e, e.resolvedSpecialization);
		}
		return (t, i) => (K(), q("section", null, [
			i[5] ||= Y("p", null, " Some Career skills need a specialization before they become concrete WFRP skills. Blank rows can be left unresolved and edited later. ", -1),
			(K(!0), q(G, null, W(e.prompt.rows, (t) => (K(), q("section", {
				key: t.resolutionKey,
				class: "dui-card dui-card-border dui-card-sm"
			}, [Y("div", Zx, [
				Y("h3", Qx, F(e.getSkillResolutionLabel(t)), 1),
				Y("span", $x, F(t.careerLabel), 1),
				Y("fieldset", eS, [
					i[4] ||= Y("legend", { class: "dui-fieldset-legend" }, "Specialization", -1),
					Y("label", tS, [i[3] ||= Y("span", { class: "dui-label" }, "Choice", -1), t.options.length > 1 ? H((K(), q("select", {
						key: 0,
						"onUpdate:modelValue": (e) => t.resolvedSpecialization = e,
						"aria-label": `Specialization for ${e.getSkillResolutionLabel(t)}`,
						class: P(["dui-select dui-select-sm", { "dui-select-error": B(qx)(t, t.resolvedSpecialization) }])
					}, [i[2] ||= Y("option", { value: "" }, "Leave unresolved", -1), (K(!0), q(G, null, W(t.options, (e) => (K(), q("option", {
						key: e,
						class: P({ "app:text-error": B(qx)(t, e) }),
						value: e
					}, F(e) + F(B(qx)(t, e) ? " — already granted" : ""), 11, rS))), 128))], 10, nS)), [[Cl, t.resolvedSpecialization]]) : H((K(), q("input", {
						key: 1,
						"onUpdate:modelValue": (e) => t.resolvedSpecialization = e,
						"aria-label": `Specialization for ${e.getSkillResolutionLabel(t)}`,
						class: P(["dui-input dui-input-sm", { "dui-input-error": B(qx)(t, t.resolvedSpecialization) }]),
						placeholder: t.suggestedSpecializations.length ? "Type or choose below" : t.specialization,
						type: "text"
					}, null, 10, iS)), [[bl, t.resolvedSpecialization]])]),
					r(t) ? (K(), q("p", aS, " Already granted by this Career. ")) : Q("", !0)
				]),
				e.usesFreeformSkillSpecialization(t) ? (K(), q("div", oS, [t.isLoadingSuggestions ? (K(), q("small", sS, "Finding known choices.")) : Q("", !0), (K(!0), q(G, null, W(t.suggestedSpecializations, (e) => (K(), q("button", {
					key: `${t.resolutionKey}:${e}`,
					class: P(["dui-btn dui-btn-sm", { "dui-btn-error dui-btn-outline": B(qx)(t, e) }]),
					type: "button",
					onClick: (r) => n("chooseSkillSpecialization", t, e)
				}, [Z(F(e) + " ", 1), B(qx)(t, e) ? (K(), q("span", lS, " Already granted ")) : Q("", !0)], 10, cS))), 128))])) : Q("", !0)
			])]))), 128)),
			e.prompt.linkedRows.length ? (K(), q("div", uS, F(e.prompt.linkedRows.length) + " linked skill specialization" + F(e.prompt.linkedRows.length === 1 ? "" : "s") + " will reuse earlier choices from this career chain. ", 1)) : Q("", !0),
			Y("div", dS, [Y("button", {
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
function pS(e) {
	return e === "build-actor" || e === "build-careers" || e === "build-quick";
}
function mS(e) {
	return e === "settings-advancement" || e === "settings-folders" || e === "settings-resolution" || e === "settings-suggestions";
}
function hS(e) {
	return e === "automatic-xp" || e === "detail-characteristics" || e === "detail-skills" || e === "detail-talents";
}
function gS(e) {
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
var _S = ["aria-current", "onClick"], vS = ["aria-current", "popovertarget"], yS = ["id"], bS = ["onClick"], xS = /* @__PURE__ */ U({
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
		}, F(t.label), 9, _S)) : (K(), q(G, { key: 1 }, [Y("button", {
			"aria-current": t.isActive ? "page" : void 0,
			popovertarget: t.popoverId,
			type: "button"
		}, F(t.label), 9, vS), Y("div", {
			id: t.popoverId,
			popover: ""
		}, [Y("ul", { class: P(["dui-menu app:min-w-56 app:p-2", t.columnsClass]) }, [(K(!0), q(G, null, W(t.pages, (t) => (K(), q("li", { key: t.page }, [Y("button", {
			class: P({ "dui-menu-active": e.activePage === t.page }),
			type: "button",
			onClick: (e) => n("pageSelect", t.page, e)
		}, F(B(gS)(t.page)), 11, bS)]))), 128))], 2)], 8, yS)], 64))], 64))), 128))], 64));
	}
}), SS = { class: "dui-navbar app:sticky app:top-0 app:z-20 app:flex-wrap app:gap-2 app:bg-base-200 app:px-3 app:py-2" }, CS = { class: "dui-navbar-start app:min-w-64 app:flex-1" }, wS = { class: "app:min-w-0" }, TS = { class: "app:text-base-content/70" }, ES = {
	"aria-label": "NPC Builder pages",
	class: "app:order-3 app:flex app:w-full app:flex-wrap app:items-center app:justify-start app:gap-2"
}, DS = {
	id: "npc-builder-megamenu",
	class: "dui-megamenu max-sm:dui-megamenu-vertical dui-megamenu-sm app:ml-0 app:mr-auto app:border app:border-base-300 app:bg-base-100 app:p-2",
	popover: ""
}, OS = { class: "dui-navbar-end app:w-auto app:shrink-0" }, kS = ["disabled"], AS = /* @__PURE__ */ U({
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
		return (t, n) => (K(), q("header", SS, [
			Y("div", CS, [Y("div", wS, [
				n[1] ||= Y("span", { class: "dui-badge dui-badge-outline" }, "WFRP4e Customizer", -1),
				n[2] ||= Y("h1", { class: "app:m-0 app:text-xl app:leading-tight" }, "NPC Builder", -1),
				Y("small", TS, [e.selectedBaseActorName ? (K(), q(G, { key: 0 }, [Z(F(e.selectedBaseActorName) + " base · " + F(e.finalActorName), 1)], 64)) : (K(), q(G, { key: 1 }, [Z("Choose a base character, then shape the final NPC.")], 64))])
			])]),
			Y("nav", ES, [n[3] ||= Y("button", {
				"aria-label": "Open NPC Builder navigation",
				class: "dui-btn dui-btn-sm sm:app:hidden",
				popovertarget: "npc-builder-megamenu",
				type: "button"
			}, " Menu ", -1), Y("div", DS, [X(xS, {
				"active-page": e.activePage,
				groups: c.value,
				onPageSelect: l
			}, null, 8, ["active-page", "groups"])])]),
			Y("div", OS, [Y("button", {
				class: "dui-btn dui-btn-primary",
				disabled: !e.canBuild,
				type: "button",
				onClick: n[0] ||= (e) => r("buildNpc")
			}, " Build NPC ", 8, kS)])
		]));
	}
});
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderApplicationDrop.ts
function jS(e, t, n, r) {
	let i = wp(), a = /* @__PURE__ */ z(!1);
	function o(e) {
		MS(e) || (e.preventDefault(), a.value = !0);
	}
	function s(e) {
		if (MS(e)) return;
		let t = e.currentTarget, n = e.relatedTarget;
		t instanceof Node && n instanceof Node && t.contains(n) || (a.value = !1);
	}
	function c(e) {
		MS(e) || (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"));
	}
	async function l(o) {
		if (!MS(o)) {
			o.preventDefault(), a.value = !1, r.value = "";
			try {
				let r = await e.resolveApplicationDrop(o.dataTransfer?.getData("text/plain") ?? "");
				r.kind === "actor" ? i.selectBaseActor(r.actor) : r.kind === "career" ? await n(r.career, { replaceQueue: t.value === "build-quick" }) : r.kind === "advancement" ? i.addCustomAdvancement(r.advancement) : r.kind === "trapping" ? i.addCustomTrapping(r.trapping) : r.kind === "trait" ? i.addCustomTrait(r.trait) : i.addCustomSpell(r.spell);
			} catch (e) {
				r.value = Nv(e);
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
function MS(e) {
	let t = e.dataTransfer, n = t?.getData("text/plain") ?? "", r = Array.from(t?.types ?? []);
	return n.startsWith("npc-builder-career:") || uf(n) !== null || r.includes(M_);
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderBuild.ts
function NS(e, t, n, r, i) {
	let a = wp(), { advancements: o, buildTraits: s, careers: c, finalActorName: l, finalPortraitPath: u, selectedMountActorUuid: d, selectedBaseActor: f, selectedSpells: p, settings: m, trappings: h } = _u(a), g = /* @__PURE__ */ z(!1), _ = $(() => !!(f.value && c.value.length && !g.value && !i.value));
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
			r.value = Nv(e), n.value = "";
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
function PS(e) {
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
function FS(e) {
	return [{
		career: e,
		mode: "add-or-increment"
	}];
}
function IS(e) {
	return [...e.candidates.filter((t) => e.selectedUuids.includes(t.uuid)).map((e) => ({
		career: e,
		mode: "add-if-missing"
	})), {
		career: e.droppedCareer,
		mode: "add-or-increment"
	}];
}
function LS(e) {
	let t = e.candidates.filter((t) => e.selectedUuids.includes(t.uuid)).length;
	return t === 0 ? "" : `Added ${t} lower-tier career candidate${t === 1 ? "" : "s"}.`;
}
function RS(e, t) {
	return e?.selectedUuids.includes(t) ?? !1;
}
function zS(e) {
	let { candidateUuid: t, isAlreadyQueued: n, prompt: r, selected: i } = e;
	return !r || n ? null : i ? [...new Set([...r.selectedUuids, t])] : r.selectedUuids.filter((e) => e !== t);
}
//#endregion
//#region src/module/apps/npc-builder/state/workflows/skill-suggestions.ts
async function BS(e, t) {
	await Promise.all(t.rows.map(async (t) => {
		if (Kx(t)) {
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
function VS(e) {
	let t = wp(), { careers: n, settings: r } = _u(t), i = /* @__PURE__ */ z(""), a = /* @__PURE__ */ z(""), o = /* @__PURE__ */ z(!1), s = /* @__PURE__ */ z(null), c = /* @__PURE__ */ z(null), l = $(() => PS(s.value));
	async function u(t, n = {}) {
		a.value = "";
		try {
			await d(await e.resolveCareerDrop(t), n);
		} catch (e) {
			a.value = HS(e);
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
		m(FS(e), {
			enableLinkedSkillResolution: !1,
			message: ""
		});
	}
	function m(t, n) {
		let r = Ux(t, n);
		if (r.rows.length) {
			c.value = r, BS(e, c.value);
			return;
		}
		b(t, n.message);
	}
	function h() {
		let e = s.value;
		e && (s.value = null, m(IS(e), {
			enableLinkedSkillResolution: !r.value.askForLinkedSkillSpecializations,
			message: LS(e)
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
			for (let n of e.rows) t.setSkillGrantResolution(n.resolutionKey, Wx(n));
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
		return RS(s.value, e);
	}
	function C(e, t) {
		let n = zS({
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
		getSkillResolutionLabel: Gx,
		addCareerSummaryWithLowerCareerMode: d,
		handleCareerDrop: u,
		isCareerQueued: x,
		isFindingLowerCareers: o,
		isLowerCareerSelected: S,
		lowerCareerCandidateGroups: l,
		pendingLowerCareerPrompt: s,
		pendingSkillResolutionPrompt: c,
		setLowerCareerSelected: C,
		usesFreeformSkillSpecialization: Kx
	};
}
function HS(e) {
	return e instanceof Error ? e.message : "The NPC Builder could not finish that action.";
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderCareerDropWorkflow.ts
function US(e) {
	return VS(e);
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderInitialData.ts
function WS(e, t) {
	let n = wp(), { selectedBaseActorUuid: r, selectedMountActorUuid: i, settings: a } = _u(n), o = /* @__PURE__ */ z(!1), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z([]);
	fo(async () => {
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
			t.value = Nv(e);
		} finally {
			o.value = !1;
		}
	}), Ha(r, async (r) => {
		if (t.value = "", !r) {
			n.clearBaseDraftData(), n.hydrateBaseActorCombatProfile(null);
			return;
		}
		r === i.value && n.clearMountSelection(), n.hydrateBaseActorCombatProfile(null), s.value = !0;
		try {
			let [t, i] = await Promise.all([e.loadBaseActorDraftData(r), e.loadActorCombatProfile(r)]);
			n.hydrateBaseActorDraftData(t), n.hydrateBaseActorCombatProfile(i);
		} catch (e) {
			t.value = Nv(e), n.clearBaseDraftData(), n.hydrateBaseActorCombatProfile(null);
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
function GS() {
	return {
		inFlightNames: [],
		successfulNames: []
	};
}
function KS(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.kind === "skill" && !n.characteristicKey && !Mu(n.name) && t.add(n.name);
	return [...t];
}
function qS(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.kind === "talent" && !n.talentMaximumKey && t.add(n.name);
	return [...t];
}
function JS(e, t) {
	let n = new Set([...t.inFlightNames, ...t.successfulNames]);
	return e.filter((e) => {
		let t = Pu(e);
		return n.has(t) ? !1 : (n.add(t), !0);
	});
}
function YS(e, t) {
	return {
		...e,
		inFlightNames: QS([...e.inFlightNames, ...t])
	};
}
function XS(e, t) {
	let n = new Set(QS(t));
	return {
		inFlightNames: e.inFlightNames.filter((e) => !n.has(e)),
		successfulNames: QS([...e.successfulNames, ...n])
	};
}
function ZS(e, t) {
	let n = new Set(QS(t));
	return {
		...e,
		inFlightNames: e.inFlightNames.filter((e) => !n.has(e))
	};
}
function QS(e) {
	return [...new Set([...e].map(Pu).filter(Boolean))];
}
//#endregion
//#region src/module/apps/npc-builder/state/workflows/metadata-lookups-workflow.ts
function $S(e) {
	let t = wp(), { advancements: n } = _u(t), r = /* @__PURE__ */ z(GS()), i = /* @__PURE__ */ z(GS()), a = /* @__PURE__ */ z(""), o = /* @__PURE__ */ z(""), s = $(() => KS(n.value)), c = $(() => qS(n.value)), l = $(() => [a.value, o.value].filter(Boolean).join(" ")), u = $(() => l.value ? "degraded" : r.value.inFlightNames.length + i.value.inFlightNames.length > 0 ? "loading" : "ready");
	Ha(s, (e) => {
		d(e);
	}, { immediate: !0 }), Ha(c, (e) => {
		f(e);
	}, { immediate: !0 });
	async function d(n) {
		if (!n.length) {
			a.value = "";
			return;
		}
		let i = JS(n, r.value);
		if (i.length) {
			r.value = YS(r.value, i), a.value = "";
			try {
				let n = await e.listSkillCharacteristics(i);
				r.value = XS(r.value, i), t.hydrateSkillCharacteristics(n);
			} catch (e) {
				r.value = ZS(r.value, i), a.value = eC("skill characteristics", e);
			}
		}
	}
	async function f(n) {
		if (!n.length) {
			o.value = "";
			return;
		}
		let r = JS(n, i.value);
		if (r.length) {
			i.value = YS(i.value, r), o.value = "";
			try {
				let n = await e.listTalentMaximums(r);
				i.value = XS(i.value, r), t.hydrateTalentMaximums(n);
			} catch (e) {
				i.value = ZS(i.value, r), o.value = eC("Talent maximums", e);
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
function eC(e, t) {
	return `Could not load ${e}.${t instanceof Error ? ` ${t.message}` : ""}`;
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp/useNpcBuilderMetadataLookups.ts
function tC(e) {
	return $S(e);
}
//#endregion
//#region src/module/apps/npc-builder/view/NpcBuilderApp.vue?vue&type=script&setup=true&lang.ts
var nC = ["id", "aria-label"], rC = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, iC = {
	key: 1,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, aC = {
	key: 2,
	"aria-live": "polite",
	class: "dui-alert dui-alert-info",
	role: "status"
}, oC = {
	key: 3,
	"aria-live": "polite",
	class: "dui-alert dui-alert-warning",
	role: "status"
}, sC = /* @__PURE__ */ U({
	__name: "NpcBuilderApp",
	props: { bridge: {} },
	setup(e) {
		let t = e, { finalActorName: n, hasMagicAccess: r, selectedBaseActor: i, selectedSpells: a } = _u(wp()), o = /* @__PURE__ */ z("build-quick"), s = Xa(), c = $(() => r.value || a.value.length > 0), { addCareerSummaryWithLowerCareerMode: l, buildMessage: u, chooseSkillSpecialization: d, confirmLowerCareerPrompt: f, confirmSkillResolutionPrompt: p, dismissLowerCareerPrompt: m, dismissSkillResolutionPrompt: h, errorMessage: g, getSkillResolutionLabel: _, isCareerQueued: v, isFindingLowerCareers: y, isLowerCareerSelected: b, lowerCareerCandidateGroups: x, pendingLowerCareerPrompt: S, pendingSkillResolutionPrompt: C, setLowerCareerSelected: w, usesFreeformSkillSpecialization: ee } = US(t.bridge), { buildNpc: te, canBuild: ne } = NS(t.bridge, o, u, g, y), { isLoadingActors: re, isLoadingBaseDraft: T, traitDifficultyOptions: ie } = WS(t.bridge, g), { metadataLookupError: E, metadataLookupStatus: ae, retryMetadataLookups: D } = tC(t.bridge), { handleApplicationDragEnter: O, handleApplicationDragLeave: oe, handleApplicationDragOver: se, handleApplicationDrop: ce, isApplicationDragOver: le } = jS(t.bridge, o, l, g);
		return (e, r) => (K(), q("section", {
			"aria-label": "NPC Builder",
			class: P(["app:flex app:min-h-full app:flex-col", { "app:ring-2 app:ring-info": B(le) }]),
			onDragenter: r[2] ||= (...e) => B(O) && B(O)(...e),
			onDragleave: r[3] ||= (...e) => B(oe) && B(oe)(...e),
			onDragover: r[4] ||= (...e) => B(se) && B(se)(...e),
			onDrop: r[5] ||= (...e) => B(ce) && B(ce)(...e)
		}, [
			X(AS, {
				"active-page": o.value,
				"can-build": B(ne),
				"final-actor-name": B(n),
				"has-spell-page": c.value,
				"selected-base-actor-name": B(i)?.name ?? "",
				onBuildNpc: B(te),
				onPageChange: r[0] ||= (e) => o.value = e
			}, null, 8, [
				"active-page",
				"can-build",
				"final-actor-name",
				"has-spell-page",
				"selected-base-actor-name",
				"onBuildNpc"
			]),
			X(Mp, {
				open: B(S) !== null,
				title: "Add Lower-Tier Careers?",
				onClose: B(m)
			}, {
				default: V(() => [B(S) ? (K(), J(Op, {
					key: 0,
					"candidate-groups": B(x),
					"is-career-queued": B(v),
					"is-lower-career-selected": B(b),
					prompt: B(S),
					onAddDroppedOnly: B(m),
					onAddSelected: B(f),
					onLowerCareerSelected: B(w)
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
			X(Mp, {
				open: B(C) !== null,
				title: "Resolve Skill Specializations",
				onClose: B(h)
			}, {
				default: V(() => [B(C) ? (K(), J(fS, {
					key: 0,
					"get-skill-resolution-label": B(_),
					prompt: B(C),
					"uses-freeform-skill-specialization": B(ee),
					onAddWithoutResolving: B(h),
					onApplySpecializations: B(p),
					onChooseSkillSpecialization: B(d)
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
				id: `${B(s)}-panel`,
				"aria-label": B(gS)(o.value),
				class: "app:grid app:flex-1 app:content-start app:gap-3 app:p-3"
			}, [
				B(g) ? (K(), q("p", rC, F(B(g)), 1)) : B(u) ? (K(), q("p", iC, F(B(u)), 1)) : B(le) ? (K(), q("p", aC, " Release to add this document to the NPC draft. ")) : Q("", !0),
				B(ae) === "degraded" ? (K(), q("div", oC, [
					Y("span", null, F(B(E)), 1),
					r[6] ||= Y("span", null, "Advancement rows remain editable with reduced metadata.", -1),
					Y("button", {
						class: "dui-btn dui-btn-sm",
						type: "button",
						onClick: r[1] ||= (...e) => B(D) && B(D)(...e)
					}, " Retry Metadata ")
				])) : Q("", !0),
				B(mS)(o.value) ? (K(), J(pb, {
					key: 4,
					bridge: t.bridge,
					page: o.value
				}, null, 8, ["bridge", "page"])) : B(hS)(o.value) ? (K(), J(Vm, {
					key: 5,
					page: o.value
				}, null, 8, ["page"])) : o.value === "trappings" ? (K(), J(Hx, {
					key: 6,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : o.value === "traits" ? (K(), J(fx, {
					key: 7,
					"difficulty-options": B(ie)
				}, null, 8, ["difficulty-options"])) : o.value === "detail-spells" ? (K(), J(Xb, {
					key: 8,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : o.value === "mount" ? (K(), J(iy, {
					key: 9,
					bridge: t.bridge
				}, null, 8, ["bridge"])) : B(pS)(o.value) ? (K(), J(H_, {
					key: 10,
					bridge: t.bridge,
					"is-loading-actors": B(re),
					"is-loading-base-draft": B(T),
					page: o.value
				}, null, 8, [
					"bridge",
					"is-loading-actors",
					"is-loading-base-draft",
					"page"
				])) : Q("", !0)
			], 8, nC)
		], 34));
	}
}), cC = nu();
//#endregion
//#region src/module/foundry/document-drop.ts
function lC(e) {
	let t = e.value.trim();
	if (!t) return "";
	if (vC(t)) return t;
	let n = mC(t), r = gC(n, e.documentType);
	return r ? yC(n) ? JSON.stringify({
		type: r,
		uuid: n
	}) : JSON.stringify({
		id: n,
		type: r
	}) : "";
}
function uC(e) {
	let t = !0;
	function n() {
		t && (t = !1, document.removeEventListener("click", r, !0));
	}
	function r(t) {
		let r = t.target;
		if (!(r instanceof Element)) return;
		let i = dC(r);
		i && (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), n(), e(i));
	}
	return document.addEventListener("click", r, !0), n;
}
function dC(e) {
	let t = e.closest("[data-uuid], [data-document-uuid], [data-entry-uuid], [data-document-id], [data-entry-id], [data-pack]");
	if (!t) return "";
	let n = t.dataset.uuid || t.dataset.documentUuid || t.dataset.entryUuid || "";
	if (n) return pC(n);
	let r = t.dataset.documentId || t.dataset.entryId || "", i = hC(t);
	if (!r || !i) return "";
	let a = t.dataset.pack || t.closest("[data-pack]")?.dataset.pack || fC(t);
	return a ? JSON.stringify({
		type: i,
		uuid: `Compendium.${a}.${r}`
	}) : t.closest(".compendium-directory") ? "" : JSON.stringify({
		type: i,
		uuid: `${i}.${r}`
	});
}
function fC(e) {
	let t = e.closest(".compendium-directory");
	return t ? Array.from(game.packs ?? []).find((e) => t.id === `Compendium-${e.collection?.replaceAll(".", "_")}`)?.collection ?? "" : "";
}
function pC(e) {
	let t = gC(e, "auto");
	return t ? JSON.stringify({
		type: t,
		uuid: e
	}) : "";
}
function mC(e) {
	return /@UUID\[([^\]]+)]/.exec(e)?.[1]?.trim() ?? e;
}
function hC(e) {
	let t = e.dataset.documentName || e.dataset.type || e.closest("[data-document-name]")?.dataset.documentName || "";
	return _C(t) ? t : e.classList.contains("actor") ? "Actor" : e.classList.contains("item") ? "Item" : e.classList.contains("journal") ? "JournalEntry" : e.closest("#actors") ? "Actor" : e.closest("#items") ? "Item" : e.closest("#journal") ? "JournalEntry" : "";
}
function gC(e, t) {
	return /^actor\./i.test(e) || /\.actors(\.|$)/i.test(e) ? "Actor" : /^item\./i.test(e) || /\.items(\.|$)/i.test(e) ? "Item" : /journalentrypage\./i.test(e) || /\.journalentrypage\./i.test(e) ? "JournalEntryPage" : /^journalentry\./i.test(e) || /\.journals(\.|$)/i.test(e) ? "JournalEntry" : t === "auto" ? "Item" : t;
}
function _C(e) {
	return e === "Actor" || e === "Item" || e === "JournalEntry" || e === "JournalEntryPage";
}
function vC(e) {
	if (!e.startsWith("{")) return !1;
	try {
		return typeof JSON.parse(e).type == "string";
	} catch {
		return !1;
	}
}
function yC(e) {
	return /^(actor|item|journalentry|journalentrypage|compendium)\./i.test(e);
}
var bC = {
	createDropData: lC,
	startDocumentPick: uC
}, xC = class {
	#e;
	createRoot() {
		let e = document.createElement("div");
		return e.classList.add("wfrp4e-customizer-apps-root"), e.dataset.theme = "wfrp4e-customizer-apps", e;
	}
	mount(e, t, n, r) {
		this.unmount(), t.classList.add("wfrp4e-customizer-apps-app"), t.replaceChildren(e), this.#e = Fl(n, r), this.#e.use(cC), this.#e.provide(dv, bC), this.#e.mount(e);
	}
	unmount() {
		this.#e?.unmount(), this.#e = void 0;
	}
}, SC = class extends foundry.applications.api.ApplicationV2 {
	#e = new xC();
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
function CC(e) {
	return {
		characteristics: wC(e),
		skills: TC(e),
		talents: DC(e, [["talents", "value"], ["talents"]]),
		trappings: DC(e, [["trappings", "value"], ["trappings"]])
	};
}
function wC(e) {
	let t = DC(e, [["characteristics", "value"], ["characteristics"]]);
	if (t.length) return t.map(EC);
	let n = m(e, ["characteristics"]);
	if (!p(n)) return [];
	let r = [];
	for (let [e, t] of Object.entries(n)) t && r.push(EC(e));
	return kC(r);
}
function TC(e) {
	return DC(e, [["skills", "value"], ["skills"]], { preserveDuplicates: !0 });
}
function EC(e) {
	let t = e.trim().toLocaleLowerCase();
	if (ee(t)) return C[t];
	let n = w[t];
	return n ? C[n] : e.trim();
}
function DC(e, t, n = {}) {
	for (let r of t) {
		let t = b(m(e, r));
		if (t.length) return n.preserveDuplicates ? OC(t) : kC(t);
	}
	return [];
}
function OC(e) {
	return e.map((e) => e.trim()).filter(Boolean);
}
function kC(e) {
	return [...new Set(OC(e))].sort((e, t) => e.localeCompare(t));
}
//#endregion
//#region src/module/foundry/compendiums.ts
function AC(e, t) {
	return t.uuid ? t.uuid : t._id && e.getUuid ? e.getUuid(t._id) : "";
}
function jC(e) {
	return e.documentName === "Item" || h(e, ["metadata", "type"]) === "Item" || h(e, ["metadata", "documentName"]) === "Item";
}
function MC(e) {
	return e.documentName === "Actor" || h(e, ["metadata", "type"]) === "Actor" || h(e, ["metadata", "documentName"]) === "Actor";
}
function NC(e) {
	return Array.isArray(e) ? e.filter(FC) : p(e) && Array.isArray(e.contents) ? e.contents.filter(FC) : IC(e) ? [...e].flatMap((e) => {
		let t = Array.isArray(e) ? e[1] : e;
		return FC(t) ? [t] : [];
	}) : [];
}
function PC() {
	return new Promise((e) => {
		globalThis.setTimeout(e, 0);
	});
}
function FC(e) {
	return p(e);
}
function IC(e) {
	return p(e) && Symbol.iterator in e;
}
//#endregion
//#region src/module/wfrp/career-summary.ts
function LC(e) {
	return {
		careerGroup: RC(e),
		grants: CC(e.system),
		img: e.img ?? "",
		level: zC(e),
		name: e.name,
		uuid: e.uuid
	};
}
function RC(e) {
	return h(e.system, ["careergroup", "value"]);
}
function zC(e) {
	let t = m(e.system, ["level", "value"]), n = Number(t);
	return Number.isFinite(n) ? n : null;
}
//#endregion
//#region src/module/wfrp/career-index.ts
var BC = [
	"name",
	"type",
	"img",
	"system.careergroup.value",
	"system.characteristics",
	"system.level.value",
	"system.skills",
	"system.talents",
	"system.trappings"
], VC = /* @__PURE__ */ new Map(), HC = null;
function UC() {
	return HC || (VC.clear(), HC = GC().catch((e) => {
		throw VC.clear(), HC = null, kn("wfrp4e-customizer-apps | Career indexing failed.", e), e;
	}), HC);
}
async function WC(e) {
	return !e.careerGroup || e.level === null ? [] : (await UC(), [...VC.values()].filter((t) => XC(t, e)).sort(QC));
}
async function GC() {
	KC(), await PC();
	for (let e of game.packs ?? []) {
		if (!jC(e) || !e.getIndex) continue;
		let t = await e.getIndex({ fields: BC });
		for (let n of NC(t)) {
			let t = qC(e, n);
			t && VC.set(t.uuid, t);
		}
		await PC();
	}
}
function KC() {
	for (let e of game.items?.contents ?? []) e.type === "career" && VC.set(e.uuid, LC(e));
}
function qC(e, t) {
	let n = AC(e, t);
	if (t.type !== "career" || !t.name || !n) return null;
	let r = m(t, ["system"]);
	return {
		careerGroup: JC(t),
		grants: CC(r),
		img: t.img ?? "",
		level: YC(t),
		name: t.name,
		uuid: n
	};
}
function JC(e) {
	let t = m(e, [
		"system",
		"careergroup",
		"value"
	]);
	return typeof t == "string" ? t.trim() : "";
}
function YC(e) {
	let t = m(e, [
		"system",
		"level",
		"value"
	]), n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function XC(e, t) {
	return e.uuid !== t.uuid && e.level !== null && t.level !== null && e.level < t.level && ZC(e.careerGroup) === ZC(t.careerGroup);
}
function ZC(e) {
	return e.trim().toLocaleLowerCase();
}
function QC(e, t) {
	let n = e.level ?? 0, r = t.level ?? 0;
	return n === r ? e.name.localeCompare(t.name) : n - r;
}
//#endregion
//#region src/module/wfrp/skill-specializations.ts
var $C = [
	"name",
	"type",
	"system.characteristic.value"
], ew = /* @__PURE__ */ new Map(), tw = /* @__PURE__ */ new Map(), nw = /* @__PURE__ */ new Map(), rw = "idle", iw = null;
async function aw(e) {
	let t = Pu(e);
	return t ? (rw === "idle" && sw(), iw && await iw, [...ew.get(t) ?? []].sort((e, t) => e.localeCompare(t))) : [];
}
async function ow(e) {
	return rw === "idle" && sw(), iw && await iw, e.flatMap((e) => {
		let t = pw(e);
		return t ? [{
			...t,
			skillName: e
		}] : [];
	});
}
function sw() {
	return iw || (rw = "indexing", ew.clear(), tw.clear(), nw.clear(), iw = cw().then(() => {
		rw = "ready";
	}).catch((e) => {
		rw = "error", kn("wfrp4e-customizer-apps | Skill specialization indexing failed.", e);
	}), iw);
}
async function cw() {
	mw(), await PC();
	for (let e of game.packs ?? []) {
		if (!jC(e) || !e.getIndex) continue;
		let t = await e.getIndex({ fields: $C });
		for (let e of NC(t)) uw(e);
		await PC();
	}
}
function lw(e) {
	e.type === "skill" && (fw(e.name, h(e.system, ["characteristic", "value"])), dw(e.name));
}
function uw(e) {
	e.type !== "skill" || !e.name || (fw(e.name, h(e, [
		"system",
		"characteristic",
		"value"
	])), dw(e.name));
}
function dw(e) {
	let t = ju(e);
	if (!t) return;
	let n = Pu(t.baseName), r = ew.get(n) ?? /* @__PURE__ */ new Set();
	r.add(t.specialization), ew.set(n, r);
}
function fw(e, t) {
	if (!ee(t)) return;
	let n = {
		characteristicKey: t,
		characteristicName: C[t],
		skillName: e
	}, r = Pu(e), i = Pu(ju(e)?.baseName ?? e);
	tw.set(r, n), nw.has(i) || nw.set(i, n);
}
function pw(e) {
	let t = Pu(e), n = Pu(ju(e)?.baseName ?? e);
	return tw.get(t) ?? nw.get(n) ?? null;
}
function mw() {
	for (let e of game.items?.contents ?? []) lw(e);
}
//#endregion
//#region src/module/foundry/item-sources.ts
function hw(e, t) {
	return {
		img: "systems/wfrp4e/icons/blank.png",
		name: e,
		system: {},
		type: t
	};
}
function gw(e, t, n) {
	let r = e ? e.toObject() : hw(t, n);
	return delete r._id, r;
}
function _w(e, t, n) {
	return vw(e, t, n)[0] ?? null;
}
function vw(e, t, n) {
	return e.items?.contents.filter((e) => e.type === n && xw(e.name, t)) ?? [];
}
function yw(e, t, n) {
	return e.items?.contents.find((e) => t && e.uuid === t ? !0 : xw(e.name, n)) ?? null;
}
function bw(e, t) {
	return game.items?.contents.find((n) => t.includes(n.type) && xw(n.name, e)) ?? null;
}
function xw(e, t) {
	return e.trim().toLocaleLowerCase() === t.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/wfrp/item-lookup.ts
async function Sw(e, t) {
	return await game.wfrp4e?.utility?.findItem?.(e, t) || bw(e, t);
}
//#endregion
//#region src/module/wfrp/talent-maximums.ts
async function Cw(e) {
	let t = [];
	for (let n of ww(e)) {
		let e = await Sw(n, ["talent"]);
		e && t.push({
			maximumFormula: h(e.system, ["max", "formula"]),
			maximumKey: h(e.system, ["max", "value"]),
			talentName: n
		});
	}
	return t;
}
function ww(e) {
	let t = /* @__PURE__ */ new Set(), n = [];
	for (let r of e) {
		let e = r.trim().toLocaleLowerCase();
		!e || t.has(e) || (t.add(e), n.push(r));
	}
	return n;
}
//#endregion
//#region src/module/foundry/portrait-search/candidate-utils.ts
var Tw = [
	".webp",
	".png",
	".jpg",
	".jpeg",
	".gif"
], Ew = new Set(Tw);
function Dw(e, t) {
	let n = t.img.trim().toLocaleLowerCase();
	!n || e.seenPaths.has(n) || (e.seenPaths.add(n), e.candidates.push(t));
}
function Ow(e, t) {
	let n = t.imagePaths.filter(({ path: e }) => !!e);
	if (Iw(t.name, n, e.searchTerms)) for (let r of n) {
		let n = {
			img: r.path,
			key: `foundry-asset:${t.sourceKey}:${r.label}`,
			label: `${t.name || Mw(r.path)} ${r.label} (${t.sourceLabel})`,
			source: "foundry-asset",
			sourceGroup: t.sourceGroup,
			sourceLabel: t.sourceLabel
		};
		Lw(n, e) && Dw(e, n);
	}
}
function kw(e, t, n) {
	e?.({
		candidatesFound: t.candidates.length,
		currentLocation: n.currentLocation,
		directoriesVisited: t.visitedDirectories,
		maxDirectories: n.maxDirectories,
		phase: n.phase
	});
}
function Aw(e) {
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
function jw(e, t) {
	return `${Mw(e)} (${t})`;
}
function Mw(e) {
	return e.split(/[/\\]/).at(-1) ?? e;
}
function Nw(e) {
	let t = `.${e.split(/[#?]/u)[0]?.split(".").pop() ?? ""}`;
	return Ew.has(t.toLocaleLowerCase());
}
function Pw(e) {
	return typeof e == "object" && !!e;
}
function Fw(e) {
	return Pw(e) && Object.values(e).every((e) => Array.isArray(e) && e.every((e) => typeof e == "string"));
}
function Iw(e, t, n) {
	return sf(e, n) || t.some(({ path: e }) => sf(e, n));
}
function Lw(e, t) {
	return cf(e, {
		mustExcludeSources: [],
		mustExcludeTerms: t.mustExcludeTerms,
		mustIncludeSources: [],
		mustIncludeTerms: t.mustIncludeTerms
	});
}
//#endregion
//#region src/module/foundry/portrait-search/dig-down.ts
var Rw = "fuzzy-foundry", zw = .3;
function Bw(e, t) {
	let n = Vw();
	if (kw(t, e, {
		currentLocation: Uw(n),
		maxDirectories: 0,
		phase: "filesystem"
	}), !n.digDownActive || !n.digDownCacheReady) return;
	let r = Kw();
	if (!(!r?._fileIndexCache || !r.fs)) {
		for (let t of Ww(r, e.searchTerms)) Gw(e, r, t);
		kw(t, e, {
			currentLocation: "Dig Down file cache search complete",
			maxDirectories: 0,
			phase: "filesystem"
		});
	}
}
function Vw() {
	let e = game.modules.get(Rw)?.active === !0, t = Hw(), n = Kw(), r = Object.values(n?._fileIndexCache ?? {}).reduce((e, t) => e + t.length, 0);
	return {
		digDownActive: e,
		digDownCacheReady: !!(n?._fileIndexCache && n.fs),
		digDownDeepFileSearchEnabled: t,
		digDownIndexedFileCount: r
	};
}
function Hw() {
	try {
		return game.settings.get(Rw, "deepFile") === !0;
	} catch {
		return !1;
	}
}
function Uw(e) {
	return e.digDownActive ? e.digDownDeepFileSearchEnabled ? e.digDownCacheReady ? `Dig Down file cache (${e.digDownIndexedFileCount} files)` : "Waiting for Dig Down file cache" : "Dig Down Deep File Search is disabled" : "Dig Down is not active";
}
function Ww(e, t) {
	let n = /* @__PURE__ */ new Set(), r = Object.keys(e._fileIndexCache ?? {});
	for (let i of t) {
		let t = i.toLocaleLowerCase();
		for (let e of r) e.toLocaleLowerCase().includes(t) && n.add(e);
		let a = e.fs?.get(i, [], zw) ?? [];
		for (let [, e] of a) n.add(e);
	}
	return [...n].sort((e, t) => e.toLocaleLowerCase().localeCompare(t.toLocaleLowerCase()));
}
function Gw(e, t, n) {
	let r = t._fileIndexCache?.[n] ?? [];
	for (let t of r) {
		if (!Nw(t)) continue;
		let n = {
			img: t,
			key: `foundry-asset:${t}`,
			label: jw(t, "Dig Down"),
			source: "foundry-asset",
			sourceGroup: "dig-down",
			sourceLabel: "Dig Down"
		};
		Lw(n, e) && Dw(e, n);
	}
}
function Kw() {
	let e = canvas.deepSearchCache;
	if (!Pw(e)) return null;
	let t = e._fileIndexCache, n = e.fs, r = {};
	return Fw(t) && (r._fileIndexCache = t), Pw(n) && typeof n.get == "function" && (r.fs = { get: n.get.bind(n) }), r;
}
//#endregion
//#region src/module/foundry/portrait-search/documents.ts
function qw(e, t) {
	kw(t, e, {
		currentLocation: "World Actors and Items",
		maxDirectories: 0,
		phase: "world-documents"
	});
	for (let t of game.actors.contents) Ow(e, {
		imagePaths: [{
			label: "actor image",
			path: t.img ?? ""
		}, {
			label: "token image",
			path: Aw(t)
		}],
		name: t.name,
		sourceGroup: "world",
		sourceLabel: "World Actors",
		sourceKey: t.uuid
	});
	for (let t of game.items?.contents ?? []) Ow(e, {
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
async function Jw(e, t) {
	kw(t, e, {
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
		] }).catch(() => void 0), r = n ? NC(n) : [];
		for (let n of r) Ow(e, {
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
async function Yw(e, t, n) {
	let r = Xw(t), i = new Set(r.map(({ path: e }) => eT(e)));
	for (e.maxDirectoryBudget += r.length; r.length;) {
		let t = r.shift();
		if (!t) break;
		$w(e, n, t.path);
		let a = await Zw(t.path);
		if (e.visitedDirectories += 1, a) {
			Qw(e, t.root, a.files ?? []);
			for (let n of tT(a.dirs ?? [])) {
				let a = rf([n])[0], o = eT(a ?? "");
				!a || i.has(o) || (i.add(o), r.push({
					path: a,
					root: t.root
				}), e.maxDirectoryBudget += 1);
			}
			$w(e, n, t.path);
		}
	}
}
function Xw(e) {
	return rf(e).map((e) => ({
		path: e,
		root: e
	}));
}
async function Zw(t) {
	try {
		return await foundry.applications.apps.FilePicker.browse("data", t, { extensions: Tw });
	} catch (n) {
		return kn(`${e} | Could not browse priority portrait folder "${t}".`, n), null;
	}
}
function Qw(e, t, n) {
	let r = `Priority: ${Mw(t)}`;
	for (let i of tT(n)) {
		if (!Nw(i) || !sf(Mw(i), e.searchTerms)) continue;
		let n = {
			img: i,
			key: `foundry-asset:${i}`,
			label: jw(i, r),
			source: "foundry-asset",
			sourceFilter: Hd(t),
			sourceGroup: "priority-folders",
			sourceLabel: r
		};
		Lw(n, e) && Dw(e, n);
	}
}
function $w(e, t, n) {
	kw(t, e, {
		currentLocation: n,
		maxDirectories: e.maxDirectoryBudget,
		phase: "filesystem"
	});
}
function eT(e) {
	return e.toLocaleLowerCase();
}
function tT(e) {
	return [...e].sort((e, t) => e.toLocaleLowerCase().localeCompare(t.toLocaleLowerCase()));
}
//#endregion
//#region src/module/foundry/portrait-search/exclusions.ts
var nT = /* @__PURE__ */ new Map(), rT = 6, iT = 15e3;
async function aT(e, t, n, r = oT) {
	let i = rf(t.excludedReferenceImagePaths), a = new Set(i.map(dT)), o = /* @__PURE__ */ new Set();
	for (let e of i) {
		let t = await r(e);
		t.loadable && t.pixelSignature && o.add(t.pixelSignature);
	}
	let s = Array(e.length).fill(null), c = 0, l = 0, u = 0;
	uT(n, 0, 0, e.length);
	async function d() {
		for (; l < e.length;) {
			let i = l, d = e[i];
			if (l += 1, !a.has(dT(d.img))) {
				let e = await r(d.img);
				e.loadable && (!t.excludeFullyTransparentImages || !e.fullyTransparent) && (!e.pixelSignature || !o.has(e.pixelSignature)) && (s[i] = d, c += 1);
			}
			u += 1, uT(n, c, u, e.length);
		}
	}
	let f = Math.min(rT, e.length);
	return await Promise.all(Array.from({ length: f }, d)), s.filter((e) => e !== null);
}
async function oT(e) {
	let t = dT(e), n = nT.get(t);
	if (n) return await n;
	let r = sT(e);
	return nT.set(t, r), await r;
}
async function sT(e) {
	let t = await cT(e);
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
			pixelSignature: await lT(e.width, e.height, r)
		};
	} catch {
		return {
			fullyTransparent: !1,
			loadable: !0,
			pixelSignature: ""
		};
	}
}
function cT(e) {
	return new Promise((t) => {
		let n = new Image(), r = setTimeout(() => i(null), iT);
		function i(e) {
			clearTimeout(r), n.onload = null, n.onerror = null, t(e);
		}
		n.onload = () => {
			i(n.naturalWidth > 0 && n.naturalHeight > 0 ? n : null);
		}, n.onerror = () => i(null), n.src = e;
	});
}
async function lT(e, t, n) {
	let r = await crypto.subtle.digest("SHA-256", n);
	return `${e}x${t}:${[...new Uint8Array(r)].map((e) => e.toString(16).padStart(2, "0")).join("")}`;
}
function uT(e, t, n, r) {
	e?.({
		candidatesFound: t,
		currentLocation: `Checking images ${n}/${r}`,
		directoriesVisited: n,
		maxDirectories: r,
		phase: "image-validation"
	});
}
function dT(e) {
	return e.trim().replaceAll("\\", "/").toLocaleLowerCase();
}
//#endregion
//#region src/module/foundry/portrait-search/index.ts
async function fT(e, t) {
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
	return await Yw(n, e.priorityFolderPaths, t), e.includeCompendiumAssets && (await Jw(n, t), qw(n, t)), e.includeFilePickerAssets && Bw(n, t), kw(t, n, {
		currentLocation: "Portrait search complete",
		maxDirectories: n.maxDirectoryBudget,
		phase: "ready"
	}), n.candidates;
}
//#endregion
//#region src/module/apps/npc-builder/functions/normalize-npc-builder-settings.ts
var pT = {
	...Cf(),
	allowBaseActorCharacteristics: !0,
	allowBaseActorSkills: !0,
	allowBaseActorTalents: !0
};
function mT(e) {
	let t = Cf();
	return gT(e) ? {
		allowBaseActorCharacteristics: _T(e.allowBaseActorCharacteristics, pT.allowBaseActorCharacteristics),
		allowBaseActorSkills: _T(e.allowBaseActorSkills, pT.allowBaseActorSkills),
		allowBaseActorTalents: _T(e.allowBaseActorTalents, pT.allowBaseActorTalents),
		allowBaseActorTraits: _T(e.allowBaseActorTraits, pT.allowBaseActorTraits),
		allowBaseActorTrappings: _T(e.allowBaseActorTrappings, pT.allowBaseActorTrappings),
		askForLinkedSkillSpecializations: _T(e.askForLinkedSkillSpecializations, pT.askForLinkedSkillSpecializations),
		autoSelectGrantedSpells: _T(e.autoSelectGrantedSpells, pT.autoSelectGrantedSpells),
		baseActorFolderUuid: vT(e.baseActorFolderUuid, pT.baseActorFolderUuid),
		excludeFullyTransparentPortraitAssets: _T(e.excludeFullyTransparentPortraitAssets, pT.excludeFullyTransparentPortraitAssets),
		excludedPortraitReferenceImages: rf(Array.isArray(e.excludedPortraitReferenceImages) ? e.excludedPortraitReferenceImages : pT.excludedPortraitReferenceImages),
		includeSpeciesInName: _T(e.includeSpeciesInName, pT.includeSpeciesInName),
		lowerCareerMode: hT(e.lowerCareerMode) ? e.lowerCareerMode : pT.lowerCareerMode,
		outputActorFolderUuid: vT(e.outputActorFolderUuid, pT.outputActorFolderUuid),
		prioritizedPortraitFolders: rf(e.prioritizedPortraitFolders),
		quickTraitFolderUuid: vT(e.quickTraitFolderUuid, pT.quickTraitFolderUuid),
		searchCompendiumPortraitAssets: _T(e.searchCompendiumPortraitAssets, pT.searchCompendiumPortraitAssets),
		searchFoundryPortraitAssets: _T(e.searchFoundryPortraitAssets, pT.searchFoundryPortraitAssets),
		searchWebPortraitAssets: _T(e.searchWebPortraitAssets, pT.searchWebPortraitAssets)
	} : t;
}
function hT(e) {
	return e === "auto-add-all" || e === "never" || e === "prompt";
}
function gT(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function _T(e, t) {
	return typeof e == "boolean" ? e : t;
}
function vT(e, t) {
	return typeof e == "string" ? e : t;
}
//#endregion
//#region src/module/foundry/settings/foundry-setting-adapter.ts
function yT(e) {
	return e;
}
function bT(t) {
	game.settings.register(e, t.key, {
		config: t.config ?? !1,
		default: t.defaultValue,
		name: t.name,
		scope: t.scope ?? "world",
		type: Object
	});
}
function xT(t) {
	return t.normalize(game.settings.get(e, t.key));
}
async function ST(t, n) {
	let r = t.normalize(n);
	return await game.settings.set(e, t.key, r), r;
}
//#endregion
//#region src/module/wfrp/npc-builder/settings.ts
var CT = yT({
	defaultValue: Cf(),
	key: "npcBuilderSettings",
	name: "NPC Builder Settings",
	normalize: mT
});
function wT() {
	bT(CT);
}
function TT() {
	return xT(CT);
}
async function ET(e) {
	return await ST(CT, e);
}
//#endregion
//#region src/module/foundry/drop-data.ts
function DT(e) {
	try {
		return JSON.parse(e);
	} catch {
		throw Error("Foundry drop data could not be read.");
	}
}
//#endregion
//#region src/module/foundry/embedded-items.ts
function OT() {
	return {
		creates: [],
		deletes: [],
		updates: []
	};
}
async function kT(e, t) {
	t.deletes.length && e.deleteEmbeddedDocuments && await e.deleteEmbeddedDocuments("Item", t.deletes), t.updates.length && e.updateEmbeddedDocuments && await e.updateEmbeddedDocuments("Item", t.updates), t.creates.length && await e.createEmbeddedDocuments("Item", t.creates);
}
//#endregion
//#region src/module/wfrp/npc-builder/xp-source-values.ts
function AT(e, t) {
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
async function jT(e, t) {
	let n = {}, r = OT();
	for (let i of t) {
		let t = Math.floor(i.current);
		if (i.kind === "talent") {
			await zT(e, i, t, r);
			continue;
		}
		let a = i.baseAdvances + t;
		if (i.kind === "characteristic") {
			if (t === 0) continue;
			RT(n, i, a);
			continue;
		}
		let o = _w(e, i.name, i.kind);
		if (t === 0 && !i.includedFromCustom && !o) continue;
		if (o) {
			r.updates.push({
				_id: o.id,
				"system.advances.value": a
			});
			continue;
		}
		let s = gw(await BT(i), i.name, i.kind);
		s.type = i.kind, x(s, [
			"system",
			"advances",
			"value"
		], a), r.creates.push(s);
	}
	Object.keys(n).length && await e.update(n), await kT(e, r);
}
function MT(e) {
	let t = e.toObject().system, n = _(t, [["advances", "value"], ["advances"]]);
	if (e.type === "talent") return {
		advances: Math.max(1, n),
		kind: "talent",
		name: e.name,
		sourceUuid: e.uuid,
		talentMaximumFormula: h(t, ["max", "formula"]),
		talentMaximumKey: h(t, ["max", "value"])
	};
	let r = LT(t), i = {
		advances: n,
		kind: "skill",
		name: e.name,
		sourceUuid: e.uuid
	};
	return r && (i.characteristicKey = r, i.characteristicName = C[r]), i;
}
function NT(e) {
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
function PT(e, t) {
	return t === "talent" ? FT(e) : e.items?.contents.filter((e) => e.type === t).map((n) => IT(e, n, t)) ?? [];
}
function FT(e) {
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
function IT(e, t, n) {
	let r = t.toObject().system, i = _(r, [["advances", "value"], ["advances"]]);
	if (n === "talent") return {
		baseAdvances: i,
		current: i,
		kind: n,
		name: t.name,
		talentMaximumFormula: h(r, ["max", "formula"]),
		talentMaximumKey: h(r, ["max", "value"])
	};
	let a = _(r, [["modifier", "value"], ["modifier"]]), o = LT(r), s = {
		baseAdvances: i,
		baseModifier: a,
		current: (o ? AT(e.toObject().system, o) : 0) + i + a,
		kind: n,
		name: t.name
	};
	return o && (s.characteristicKey = o, s.characteristicName = C[o]), s;
}
function LT(e) {
	let t = h(e, ["characteristic", "value"]);
	return ee(t) ? t : void 0;
}
function RT(e, t, n) {
	let r = w[t.name.trim().toLocaleLowerCase()];
	r && (e[`system.characteristics.${r}.advances`] = n);
}
async function zT(e, t, n, r) {
	let i = Math.max(0, t.baseAdvances + n), a = vw(e, t.name, "talent"), o = a[0] ?? await BT(t);
	r.deletes.push(...a.map((e) => e.id));
	for (let e = 0; e < i; e += 1) {
		let e = gw(o, t.name, "talent");
		e.type = "talent", x(e, [
			"system",
			"advances",
			"value"
		], 1), r.creates.push(e);
	}
}
async function BT(e) {
	if (e.sourceUuid) {
		let t = await fromUuid(e.sourceUuid);
		if (Je(t)) return t;
	}
	return Sw(e.name, [e.kind]);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/config.ts
function VT(e, t) {
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
function HT(e, t) {
	return {
		_id: e,
		"system.specification.value": t.specification,
		...t.rollable && !t.damage ? { "system.rollable.defaultDifficulty": t.defaultDifficulty } : {},
		...t.damage && t.dice ? { "system.rollable.dice": t.dice } : {}
	};
}
function UT(e) {
	return {
		...vu(),
		attackType: qT(e.system, ["rollable", "attackType"]) || "melee",
		bonusCharacteristic: qT(e.system, ["rollable", "bonusCharacteristic"]),
		damage: y(e.system, [["rollable", "damage"]]),
		defaultDifficulty: qT(e.system, ["rollable", "defaultDifficulty"]) || "challenging",
		dice: qT(e.system, ["rollable", "dice"]),
		rollable: y(e.system, [["rollable", "value"]]),
		skill: qT(e.system, ["rollable", "skill"]),
		sl: y(e.system, [["rollable", "SL"]], !0),
		specification: qT(e.system, ["specification", "value"])
	};
}
function WT(e) {
	return KT(e.system);
}
function GT(e) {
	return KT(e.system);
}
function KT(e) {
	return y(e, [["disabled"], ["disabled", "value"]]);
}
function qT(e, t) {
	let n = m(e, t);
	return typeof n == "string" ? n.trim() : typeof n == "number" ? String(n) : "";
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/apply.ts
async function JT(e, t) {
	let n = OT();
	for (let r of t) {
		let t = r.source === "base" ? yw(e, r.sourceUuid, r.name) : _w(e, r.name, "trait");
		if (r.ignored) {
			t && n.deletes.push(t.id);
			continue;
		}
		if (t) {
			n.updates.push(HT(t.id, r.config));
			continue;
		}
		let i = gw(r.sourceUuid ? await YT(r.sourceUuid) : await Sw(r.name, ["trait"]), r.name, "trait");
		i.type = "trait", x(i, ["system", "disabled"], !1), VT(i, r.config), n.creates.push(i);
	}
	await kT(e, n);
}
async function YT(e) {
	let t = await fromUuid(e);
	return Je(t) ? t : null;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/actor-traits.ts
function XT(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && !WT(e)).map($T) ?? [];
}
function ZT(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && WT(e)).map($T) ?? [];
}
function QT(e) {
	Array.isArray(e.items) && (e.items = e.items.filter((e) => {
		if (typeof e != "object" || !e) return !0;
		let t = e;
		return t.type !== "trait" || !GT(t);
	}));
}
function $T(e) {
	return {
		config: UT(e),
		img: e.img ?? "",
		name: e.name,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/difficulty-options.ts
var eE = [
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
async function tE() {
	let e = m(game.wfrp4e?.config, ["difficultyLabels"]);
	if (!p(e)) return eE;
	let t = Object.entries(e).filter((e) => {
		let [t, n] = e;
		return !!t.trim() && typeof n == "string";
	}).map(([e, t]) => ({
		label: t,
		value: e
	}));
	return t.length ? t : eE;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/drops.ts
async function nE(e) {
	let t = DT(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Trait item here.");
	let n = Ze(await fromUuid(t.uuid), "trait", "Drop a Foundry Trait item here.");
	return {
		config: UT(n),
		ignored: !1,
		key: `custom:${n.uuid}`,
		name: n.name,
		source: "custom",
		sourceUuid: n.uuid
	};
}
//#endregion
//#region src/module/apps/npc-builder/functions/recommended-quick-traits.ts
var rE = [
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
async function iE(e) {
	return dE(await uE(e, "Actor"));
}
async function aE(e) {
	return dE(await uE(e, "Item"));
}
function oE() {
	return game.folders.contents.filter((e) => e.type === "Actor").map(dE).sort((e, t) => e.name.localeCompare(t.name));
}
function sE() {
	return game.folders.contents.filter((e) => e.type === "Item").map(dE).sort((e, t) => e.name.localeCompare(t.name));
}
function cE(e) {
	return e ? game.folders.contents.find((t) => t.uuid === e) ?? null : null;
}
function lE(e) {
	let t = cE(e);
	return t?.type === "Item" ? t : null;
}
async function uE(e, t) {
	let n = e.trim();
	if (!n) throw Error("Enter a folder name first.");
	let r = game.folders.contents.find((e) => e.type === t && fE(e.name, n));
	if (r) return r;
	let i = await Folder.create({
		name: n,
		type: t
	});
	if (!i) throw Error("Foundry did not create the folder.");
	return i;
}
function dE(e) {
	return {
		name: e.name,
		uuid: e.uuid
	};
}
function fE(e, t) {
	return e.trim().toLocaleLowerCase() === t.trim().toLocaleLowerCase();
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/traits/quick-traits.ts
async function pE(e) {
	let t = lE(e.quickTraitFolderUuid);
	if (!t) throw Error("Choose a Quick Traits item folder before importing traits.");
	let n = new Set(gE(e).map((e) => e.name.trim().toLocaleLowerCase()));
	for (let e of rE) {
		if (n.has(e.trim().toLocaleLowerCase())) continue;
		let r = gw(await Sw(e, ["trait"]), e, "trait");
		r.folder = t.id, r.type = "trait", await Item.create(r);
	}
	return ui.notifications?.info("Imported recommended quick traits."), await mE(e);
}
async function mE(e) {
	return gE(e).map(_E).sort((e, t) => e.name.localeCompare(t.name));
}
function hE(e, t) {
	return t.quickTraitFolderUuid ? e.folder?.uuid === t.quickTraitFolderUuid : !1;
}
function gE(e) {
	return game.items?.contents.filter((t) => t.type === "trait" && hE(t, e)) ?? [];
}
function _E(e) {
	return {
		config: UT(e),
		img: e.img ?? "",
		name: e.name,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/trappings.ts
var vE = [
	"ammunition",
	"armour",
	"container",
	"money",
	"trapping",
	"weapon"
];
async function yE(e, t) {
	let n = OT();
	for (let r of t) {
		let t = r.source === "base" ? yw(e, r.sourceUuid, r.name) : null;
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
		let i = await TE(r), a = r.resolution.selectedItemType || r.itemType || "trapping", o = gw(i, r.resolution.selectedName || r.name, a);
		o.type = a || o.type || "trapping", x(o, [
			"system",
			"quantity",
			"value"
		], r.quantity), n.creates.push(o);
	}
	await kT(e, n);
}
async function bE(e) {
	return op(e, await EE());
}
async function xE(e) {
	let t = DT(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Item here.");
	let n = Xe(await fromUuid(t.uuid), "Drop a Foundry Item here.");
	return {
		ignored: !1,
		itemType: n.type,
		key: `custom:${n.uuid}`,
		name: n.name,
		quantity: CE(n),
		resolution: ip({
			itemType: n.type,
			name: n.name,
			uuid: n.uuid
		}),
		source: "custom",
		sourceUuid: n.uuid
	};
}
function SE(e) {
	let t = wE();
	return e.items?.contents.filter((e) => t.includes(e.type)).map((e) => ({
		itemType: e.type,
		name: e.name,
		quantity: CE(e),
		uuid: e.uuid
	})) ?? [];
}
function CE(e) {
	return _(e.system, [["quantity", "value"], ["quantity"]]) || 1;
}
function wE() {
	let e = g(game.wfrp4e?.config, ["trappingItems"]);
	return e.length ? e : vE;
}
async function TE(e) {
	if (e.sourceUuid) {
		let t = await fromUuid(e.sourceUuid);
		return Je(t) ? t : null;
	}
	if (e.resolution.selectedCandidateUuid) {
		let t = await fromUuid(e.resolution.selectedCandidateUuid);
		return Je(t) ? t : null;
	}
	return e.resolution.status === "fallback" ? null : await Sw(e.resolution.selectedName || e.name, wE());
}
async function EE() {
	let e = [], t = wE();
	for (let n of game.items?.contents ?? []) t.includes(n.type) && e.push(OE(n, "World"));
	for (let n of game.packs ?? []) {
		if (!jC(n)) continue;
		let r = await DE(n, t);
		if (r.length) {
			e.push(...r);
			continue;
		}
		if (!n.getDocuments) continue;
		let i = await n.getDocuments();
		for (let r of i) Je(r) && t.includes(r.type) && e.push(OE(r, n.title ?? "Compendium"));
	}
	return e;
}
async function DE(e, t) {
	return e.getIndex ? NC(await e.getIndex({ fields: ["name", "type"] })).filter((n) => !!(n.name && n.type && AC(e, n) && t.includes(n.type))).map((t) => ({
		itemType: t.type ?? "trapping",
		name: t.name ?? "",
		sourceLabel: e.title ?? "Compendium",
		uuid: AC(e, t)
	})) : [];
}
function OE(e, t) {
	return {
		itemType: e.type,
		name: e.name,
		sourceLabel: t,
		uuid: e.uuid
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/actors.ts
function kE(e) {
	return game.actors.contents.filter((t) => FE(t, e)).map(ME);
}
async function AE(e) {
	let t = Ye(await fromUuid(e));
	return {
		advancements: [
			...NT(t),
			...PT(t, "skill"),
			...PT(t, "talent")
		],
		optionalTraits: ZT(t),
		traits: XT(t),
		trappings: SE(t)
	};
}
async function jE(e) {
	let t = DT(e);
	if (t.type !== "Actor") throw Error("Drop a Foundry Actor here.");
	let n = null;
	return t.uuid ? n = await fromUuid(t.uuid) : t.id && (n = game.actors.get(t.id)), ME(Ye(n));
}
function ME(e) {
	return {
		img: e.img ?? "",
		name: e.name,
		prototypeTokenImg: PE(e),
		species: NE(e),
		type: e.type,
		uuid: e.uuid
	};
}
function NE(e) {
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
function PE(e) {
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
function FE(e, t) {
	return t.baseActorFolderUuid ? e.folder?.uuid === t.baseActorFolderUuid : !0;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/careers.ts
async function IE(e) {
	let t = DT(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a WFRP Career item here.");
	return LC(Ze(await fromUuid(t.uuid), "career", "Drop a WFRP Career item here."));
}
async function LE(e) {
	let t = [];
	for (let n of e) {
		let e = Ze(await fromUuid(n.uuid), "career", `Career “${n.name}” is no longer available.`);
		for (let r = 0; r < Eu(n.quantity); r += 1) {
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
async function RE(e, t) {
	t.length && await e.createEmbeddedDocuments("Item", t);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/constants.ts
var zE = "spell", BE = new Set(Df), VE = new Set(Of);
async function HE() {
	return UE().map((e) => ({
		category: Nf(e.key),
		key: e.key,
		label: e.name,
		value: e.name,
		wind: e.wind
	})).sort((e, t) => e.category === t.category ? e.label.localeCompare(t.label) : e.category.localeCompare(t.category));
}
function UE() {
	let e = m(game.wfrp4e?.config, ["magicLores"]), t = m(game.wfrp4e?.config, ["magicWind"]), n = [];
	if (!p(e)) return [qE()];
	for (let [r, i] of Object.entries(e)) {
		let e = eD(i) || r, a = $E(t, r);
		n.push({
			key: r,
			matchTerms: QE(r, e, a),
			name: e,
			wind: a
		});
	}
	return n.some((e) => e.key === "petty") || n.push(qE()), n;
}
function WE(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		if (r.isAmbiguous) continue;
		if (r.kind === "petty-magic") {
			let e = ZE("petty magic", t);
			e && n.set(e.key, e);
			continue;
		}
		let e = ZE(r.rawLore, t);
		e && n.set(e.key, e);
	}
	return [...n.values()];
}
function GE(e, t) {
	let n = [...KE(e.system), XE(e.name)].filter(Boolean);
	for (let e of n) {
		let n = YE(e, t);
		if (n) return n;
		let r = ZE(e, t);
		if (r) return r;
	}
	return null;
}
function KE(e) {
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
function qE() {
	return {
		key: "petty",
		matchTerms: ["petty", "petty magic"],
		name: "Petty Magic",
		wind: ""
	};
}
function JE(e) {
	let t = e.trim() || "Unknown Lore";
	return {
		key: Af(t) || "unknown",
		matchTerms: [t],
		name: t,
		wind: ""
	};
}
function YE(e, t) {
	let n = Af(e);
	return n === "lore" ? t.find((e) => e.key !== "petty") ?? null : n === "the eight winds" || n === "eight winds" ? t.find((e) => BE.has(e.key)) ?? null : n === "dark lore" ? t.find((e) => VE.has(e.key)) ?? null : null;
}
function XE(e) {
	return /\(([^)]+)\)\s*$/.exec(e)?.[1]?.trim() ?? "";
}
function ZE(e, t) {
	let n = Af(e);
	return n ? t.find((e) => e.matchTerms.some((e) => Af(e) === n)) ?? null : null;
}
function QE(e, t, n) {
	let r = /* @__PURE__ */ new Set(), i = Af(e), a = Af(t);
	for (let i of [
		e,
		t,
		n
	]) i.trim() && r.add(i.trim());
	return (i === "petty" || a === "petty") && r.add("Petty Magic"), (i === "shadow" || a === "shadow") && r.add("Shadows"), t && !/^lore of /i.test(t) && r.add(`Lore of ${t}`), [...r];
}
function $E(e, t) {
	return p(e) ? eD(e[t]) : "";
}
function eD(e) {
	return typeof e == "string" ? e.trim() : p(e) ? h(e, ["name"]) || h(e, ["label"]) || h(e, ["value"]) : "";
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/debug.ts
var tD = "[Drowsy's WFRP4e Customizers][Spell Lookup]";
function nD(e, t) {
	if (t) {
		On(`${tD} ${e}`, t);
		return;
	}
	On(`${tD} ${e}`);
}
function rD(e, t) {
	kn(`${tD} ${e}`, t);
}
function iD(e) {
	return [
		e.title ?? "",
		e.collection ?? "",
		h(e, ["metadata", "type"]),
		h(e, ["metadata", "documentName"]),
		e.documentName
	].filter(Boolean).join(" | ");
}
function aD(e) {
	return {
		loreTerms: KE(e.system),
		name: e.name,
		sourceLabel: e.sourceLabel,
		uuid: e.uuid
	};
}
function oD(e) {
	return typeof e == "string" ? {
		kind: "uuid-string",
		value: e
	} : p(e) ? {
		documentName: h(e, ["documentName"]),
		hasSystem: p(m(e, ["system"])),
		loreTerms: KE(m(e, ["system"])),
		name: h(e, ["name"]),
		type: h(e, ["type"]),
		uuid: h(e, ["uuid"])
	} : { kind: typeof e };
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/spell-input-conversion.ts
function sD(e, t) {
	return {
		img: e.img ?? "",
		name: e.name,
		sourceLabel: t,
		system: e.system,
		uuid: e.uuid
	};
}
function cD(e) {
	return /^item\./i.test(e.uuid) ? "World" : lD(e.uuid, "WFRP Item Lookup");
}
function lD(e, t) {
	let n = /^Compendium\.([^.]+\.[^.]+)\./.exec(e)?.[1];
	return n ? [...game.packs ?? []].find((e) => e.collection === n)?.title ?? n : t;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/compendium-spell-inputs.ts
async function uD(e) {
	if (nD("Compendium index scan start", { pack: iD(e) }), !e.getIndex) return nD("Compendium has no index; loading documents", { pack: iD(e) }), await pD(e);
	let t = NC(await e.getIndex({ fields: [
		"name",
		"type",
		"img",
		"system.lore.value"
	] }));
	if (nD("Compendium index loaded", {
		entries: t.length,
		pack: iD(e),
		samples: t.slice(0, 5).map((t) => ({
			hasLoreTerms: KE(t).length > 0,
			name: t.name,
			type: t.type,
			uuid: AC(e, t)
		}))
	}), !t.length) return nD("Compendium index empty; loading documents", { pack: iD(e) }), await pD(e);
	let n = t.filter(fD);
	nD("Compendium index spell candidates", {
		pack: iD(e),
		spellEntries: n.length
	});
	let r = n.filter((e) => e.name).map((t) => hD(e, t));
	return r.length || !mD(e) ? r : await pD(e);
}
function dD(e) {
	return jC(e);
}
function fD(e) {
	return e.type === "spell" ? !0 : !!(e.name && (KE(e).length || XE(e.name)));
}
async function pD(e) {
	if (!e.getDocuments) return nD("Compendium has no document loader", { pack: iD(e) }), [];
	nD("Compendium document load start", { pack: iD(e) });
	let t = await e.getDocuments(), n = t.filter((e) => Je(e) && e.type === "spell");
	return nD("Compendium document load complete", {
		documents: t.length,
		pack: iD(e),
		spellDocuments: n.length,
		spellSamples: n.slice(0, 5).map((e) => ({
			loreTerms: KE(e.system),
			name: e.name,
			uuid: e.uuid
		}))
	}), n.map((t) => sD(t, e.title ?? "Compendium"));
}
function mD(e) {
	return e.collection === "wfrp4e-core.items" || e.collection === "wfrp4e-wom.items";
}
function hD(e, t) {
	return {
		img: t.img ?? t.thumb ?? "",
		name: t.name ?? "",
		sourceLabel: e.title ?? "Compendium",
		system: t,
		uuid: AC(e, t)
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/warhammer-spell-inputs.ts
async function gD() {
	let e = vD();
	if (!e) return nD("WFRP helper unavailable"), [];
	try {
		let t = await e.findAllItems(zE, "Loading Spells", !0, ["system.lore.value"]);
		return nD("WFRP helper raw result", {
			count: t.length,
			samples: t.slice(0, 10).map(oD)
		}), (await Promise.all(t.map((e) => _D(e)))).filter((e) => e !== null);
	} catch (e) {
		return rD("WFRP helper lookup failed.", e), [];
	}
}
async function _D(e) {
	if (typeof e == "string") {
		let t = await fromUuid(e);
		return Je(t) && t.type === "spell" ? sD(t, cD(t)) : null;
	}
	if (Je(e)) return e.type === "spell" ? sD(e, cD(e)) : null;
	if (h(e, ["type"]) !== "spell") return null;
	let t = h(e, ["name"]);
	return t ? {
		img: h(e, ["img"]) || h(e, ["thumb"]),
		name: t,
		sourceLabel: lD(h(e, ["uuid"]), "WFRP Item Lookup"),
		system: m(e, ["system"]),
		uuid: h(e, ["uuid"])
	} : null;
}
function vD() {
	let e = m(globalThis, [
		"warhammer",
		"utility",
		"findAllItems"
	]);
	return typeof e == "function" ? { findAllItems: e } : null;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/spell-resolution-inputs.ts
async function yD() {
	let e = [], t = [...game.packs ?? []];
	nD("Candidate lookup start", {
		itemPacks: t.filter(dD).length,
		totalPacks: t.length,
		warhammerUtilityAvailable: !!SD(),
		worldItems: game.items?.contents.length ?? 0
	});
	let n = await gD();
	nD("WFRP helper lookup complete", {
		utilityInputs: n.length,
		utilitySamples: n.slice(0, 10).map(aD)
	}), e.push(...n), e.push(...bD()), nD("World spell scan complete", { worldSpellCount: e.filter((e) => e.sourceLabel === "World").length });
	for (let n of t) if (dD(n)) try {
		let t = await uD(n);
		e.push(...t), nD("Compendium spell scan complete", {
			inputCount: t.length,
			pack: iD(n),
			samples: t.slice(0, 5).map(aD)
		});
	} catch (e) {
		kn(`wfrp4e-customizer-apps | Spell lookup skipped compendium "${n.title ?? n.collection ?? "unknown"}".`, e);
	}
	let r = xD(e);
	return nD("Candidate lookup complete", {
		rawInputCount: e.length,
		uniqueInputCount: r.length
	}), r;
}
function bD() {
	let e = [];
	for (let t of game.items?.contents ?? []) t.type === "spell" && e.push(sD(t, "World"));
	return e;
}
function xD(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.uuid || n.name.trim().toLocaleLowerCase();
		t.has(e) || t.set(e, n);
	}
	return [...t.values()];
}
function SD() {
	return m(globalThis, [
		"warhammer",
		"utility",
		"findAllItems"
	]);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/magic/index.ts
async function CD(e, t) {
	let n = [];
	for (let r of t) {
		if (!r.selected || _w(e, r.name, "spell")) continue;
		let t = gw(r.sourceUuid ? await ED(r.sourceUuid) : null, r.name, zE);
		t.type = zE, n.push(t);
	}
	n.length && await e.createEmbeddedDocuments("Item", n);
}
async function wD(e) {
	let t = WE(e, UE());
	if (nD("Grant resolution start", {
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
	let n = await yD(), r = /* @__PURE__ */ new Map(), i = [];
	for (let e of n) {
		let n = GE(e, t);
		if (!n) {
			i.length < 20 && i.push({
				loreTerms: KE(e.system),
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
	return nD("Grant resolution complete", {
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
async function TD(e) {
	let t = DT(e);
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Spell item here.");
	let n = Ze(await fromUuid(t.uuid), zE, "Drop a Foundry Spell item here."), r = GE(sD(n, "Dropped"), [...UE(), qE()]) ?? JE(KE(n.system)[0] ?? "");
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
async function ED(e) {
	let t = await fromUuid(e);
	return Je(t) && t.type === "spell" ? t : null;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/mounts/trait-sources.ts
var DD = "generatedMountTrait";
function OD(t, n) {
	return n.traits.flatMap((n) => {
		if (!n.included || K_(n.name)) return [];
		let r = kD(t, n);
		if (!r) return [];
		let i = r.toObject();
		return delete i._id, i.name = n.outputName, x(i, ["system", "disabled"], !1), x(i, [
			"flags",
			e,
			DD
		], {
			mountUuid: t.uuid,
			sourceTraitUuid: n.sourceUuid
		}), n.fixedDamage !== null && AD(i, n.fixedDamage), [i];
	});
}
function kD(e, t) {
	return e.items?.contents.find((e) => e.type === "trait" && e.uuid === t.sourceUuid) ?? null;
}
function AD(e, t) {
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
async function jD(e, t, n, r) {
	let i = e.items?.contents.filter(PD) ?? [], a = r.traits.filter((e) => e.included && K_(e.name)), o = MD(i), s = ND(n, a), c = Math.max(o.value, s.value) + 1;
	if (o.item && e.updateEmbeddedDocuments) {
		await e.updateEmbeddedDocuments("Item", [{
			_id: o.item.id,
			"system.specification.value": String(c)
		}]);
		return;
	}
	let l = gw((s.contribution ? kD(t, s.contribution) : null) ?? await Sw("Armour", ["trait"]), "Armour", "trait");
	l.name = "Armour", l.type = "trait", x(l, ["system", "disabled"], !1), x(l, [
		"system",
		"specification",
		"value"
	], String(c)), await e.createEmbeddedDocuments("Item", [l]);
}
function MD(e) {
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
function ND(e, t) {
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
function PD(e) {
	return e.type === "trait" && K_(e.name);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/mounts/profile.ts
var FD = new Set(Object.values(U_));
async function ID(e) {
	return LD(Ye(await fromUuid(e)));
}
function LD(e) {
	return {
		characteristics: {
			initiative: VD(e, "i"),
			strength: VD(e, "s"),
			strengthBonus: HD(e, "s"),
			toughness: VD(e, "t")
		},
		img: e.img ?? "",
		movement: _(e.system, [[
			"details",
			"move",
			"value"
		]]),
		name: e.name,
		size: UD(e),
		traits: RD(e),
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
function RD(e) {
	return e.items?.contents.filter((e) => e.type === "trait" && !WD(e)).map((t) => zD(e, t)).sort((e, t) => e.name.localeCompare(t.name)) ?? [];
}
function zD(e, t) {
	let n = y(t.system, [["rollable", "damage"]]), r = h(t.system, ["specification", "value"]);
	return {
		damage: n,
		fixedDamage: n ? BD(e, t, r) : null,
		name: t.name,
		specification: r,
		uuid: t.uuid
	};
}
function BD(e, t, n) {
	let r = v(t, [["Damage"]]);
	if (r !== null) return r;
	let i = Number(n), a = h(t.system, ["rollable", "bonusCharacteristic"]);
	return (Number.isFinite(i) ? i : 0) + (a ? HD(e, a) : 0);
}
function VD(e, t) {
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
function HD(e, t) {
	return v(e.system, [[
		"characteristics",
		t,
		"bonus"
	]]) ?? Math.floor(VD(e, t) / 10);
}
function UD(e) {
	let t = h(e.system, [
		"details",
		"size",
		"value"
	]);
	return FD.has(t) ? t : U_.Average;
}
function WD(e) {
	return y(e.system, [["disabled"], ["disabled", "value"]]);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/mounts/apply.ts
var GD = {
	avg: 1,
	enor: 3,
	lrg: 2,
	ltl: .5,
	mnst: 4,
	sml: .8,
	tiny: .3
};
async function KD(t, n) {
	let r = Ye(await fromUuid(n));
	if (t.uuid === r.uuid) throw Error("The rider and mount must be different Actors.");
	let i = LD(t), a = LD(r), o = nv(i, a);
	await t.update(qD(t, o));
	let s = OD(r, o);
	s.length && await t.createEmbeddedDocuments("Item", s), await jD(t, r, a, o), await t.createEmbeddedDocuments("Item", [ov({
		flagScope: e,
		mount: a,
		plan: o,
		rider: i
	})]), await t.update({
		"system.status.wounds.max": o.wounds,
		"system.status.wounds.value": o.wounds
	});
}
function qD(e, t) {
	let n = GD[t.size] ?? 1;
	return {
		"prototypeToken.height": n,
		"prototypeToken.width": n,
		"system.characteristics.i.modifier": JD(e, "i") + t.initiative - YD(e, "i"),
		"system.characteristics.t.modifier": JD(e, "t") + t.toughness - YD(e, "t"),
		"system.details.move.value": t.movement
	};
}
function JD(e, t) {
	return _(e.system, [[
		"characteristics",
		t,
		"modifier"
	]]);
}
function YD(e, t) {
	return _(e.system, [[
		"characteristics",
		t,
		"value"
	]]);
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/mounts/actors.ts
function XD() {
	return game.actors.contents.map(ME).sort((e, t) => e.name.localeCompare(t.name));
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/build-npc.ts
async function ZD(e) {
	if (e.mountActorUuid && e.mountActorUuid === e.baseActorUuid) throw Error("The rider and mount must be different Actors.");
	let t = await LE(e.careers), n = await $D(e);
	if (!n) throw Error("Foundry did not create the NPC Actor.");
	let r = eO(e), i = e.careers.at(-1), a = {
		name: r,
		"prototypeToken.name": r
	}, o = h(n.system, [
		"details",
		"gmnotes",
		"value"
	]), s = QD(o);
	s !== o && (a["system.details.gmnotes.value"] = s);
	let c = e.portraitPath || i?.img || "";
	return c && (a.img = c, a["prototypeToken.texture.src"] = c), await n.update(a), await RE(n, t), await jT(n, e.advancements), await JT(n, e.traits), e.mountActorUuid && await KD(n, e.mountActorUuid), await yE(n, e.trappings), await CD(n, e.spells), n.sheet?.render(!0), ui.notifications?.info(`Created NPC "${r}".`), {
		name: r,
		uuid: n.uuid
	};
}
function QD(e) {
	return e.replaceAll(/(?:<hr\s*\/?>)?<section data-wfrp-customizer-npc-xp="true">[\S\s]*?<\/section>/g, "").trim();
}
async function $D(e) {
	let t = Ye(await fromUuid(e.baseActorUuid)).toObject(), n = cE(e.settings.outputActorFolderUuid);
	return delete t._id, delete t.folder, t.type = "npc", QT(t), n && (t.folder = n.id), await Actor.create(t);
}
function eO(e) {
	if (!e.settings.includeSpeciesInName) return e.actorName;
	let t = game.actors.contents.find((t) => t.uuid === e.baseActorUuid), n = t ? NE(t) : "";
	return !n || e.actorName.toLocaleLowerCase().includes(n.toLocaleLowerCase()) ? e.actorName : `${n} ${e.actorName}`;
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/document-drops.ts
async function tO(e) {
	let t = DT(e);
	if (t.type === "Actor") return {
		actor: await jE(e),
		kind: "actor"
	};
	if (t.type !== "Item" || !t.uuid) throw Error("Drop a Foundry Actor or WFRP Item.");
	let n = Xe(await fromUuid(t.uuid), "Drop a Foundry Item.");
	if (n.type === "career") return {
		career: await IE(e),
		kind: "career"
	};
	if (n.type === "skill" || n.type === "talent") return {
		advancement: MT(n),
		kind: "advancement"
	};
	if (n.type === "trait") return {
		kind: "trait",
		trait: await nE(e)
	};
	if (n.type === "spell") return {
		kind: "spell",
		spell: await TD(e)
	};
	if (wE().includes(n.type)) return {
		kind: "trapping",
		trapping: await xE(e)
	};
	throw Error("Drop an Actor, Career, Skill, Talent, Trait, Trapping, or Spell Item.");
}
//#endregion
//#region src/module/wfrp/npc-builder/foundry-bridge/index.ts
var nO = {
	buildNpc: ZD,
	ensureActorFolder: iE,
	ensureItemFolder: aE,
	findLowerCareerCandidates: WC,
	filterPortraitCandidates: aT,
	getPortraitSearchAvailability: async () => Vw(),
	importRecommendedQuickTraits: pE,
	listActorFolders: async () => oE(),
	listBaseActors: async (e) => kE(e),
	listFoundryPortraitCandidates: fT,
	listMagicLoreOptions: HE,
	listMountActors: async () => XD(),
	listSpellsForMagicGrants: wD,
	listItemFolders: async () => sE(),
	listQuickTraits: mE,
	listSkillCharacteristics: ow,
	listSkillSpecializations: aw,
	listTalentMaximums: Cw,
	listTraitDifficultyOptions: tE,
	loadBaseActorDraftData: AE,
	loadActorCombatProfile: ID,
	loadSettings: async () => TT(),
	resolveActorDrop: jE,
	resolveApplicationDrop: tO,
	resolveCareerDrop: IE,
	resolveSpellDrop: TD,
	resolveTraitDrop: nE,
	resolveTrapping: bE,
	resolveTrappingDrop: xE,
	saveSettings: ET
}, rO = class extends SC {
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
		return sC;
	}
	getVueProps() {
		return { bridge: nO };
	}
}, iO = "wfrp4e-customizer-open-npc-builder";
function aO() {
	Hooks.on("renderActorDirectory", (e, t) => {
		let n = lO(t);
		n && oO(n);
	});
}
function oO(e) {
	let t = cO(e);
	if (!t) {
		kn("wfrp4e-customizer-apps | Could not find Actor Directory button container.");
		return;
	}
	sO(e, t);
}
function sO(e, t) {
	if (e.querySelector(`.${iO}`)) return;
	let n = document.createElement("button");
	n.classList.add(iO, "wfrp4e-customizer-actor-directory-button"), n.type = "button", n.innerHTML = "<i class=\"fa-solid fa-user-plus\" inert></i><span>NPC Builder App</span>", n.addEventListener("click", () => {
		new rO().render(!0);
	}), t.append(n);
}
function cO(e) {
	return e.querySelector(".directory-header .header-actions") ?? e.querySelector(".directory-header .action-buttons") ?? e.querySelector(".header-actions") ?? e.querySelector(".action-buttons");
}
function lO(e) {
	return e instanceof HTMLElement ? e : uO(e) && e[0] instanceof HTMLElement ? e[0] : null;
}
function uO(e) {
	return typeof e == "object" && !!e && "length" in e;
}
//#endregion
//#region src/module/apps/actor-portrait-gallery/view/ActorPortraitGalleryApp.vue?vue&type=script&setup=true&lang.ts
var dO = { class: "app:flex app:h-full app:min-h-0 app:flex-col" }, fO = { class: "dui-navbar app:sticky app:top-0 app:z-10 app:min-h-0 app:gap-2 app:bg-base-100 app:px-3 app:py-2 app:shadow-sm" }, pO = { class: "dui-navbar-start app:min-w-0 app:flex-1 app:gap-2" }, mO = { class: "app:m-0 app:truncate app:text-lg app:font-semibold" }, hO = {
	key: 0,
	class: "dui-badge dui-badge-success dui-badge-sm"
}, gO = { class: "dui-navbar-end app:w-auto app:gap-2" }, _O = ["alt", "src"], vO = ["disabled"], yO = {
	key: 0,
	"aria-hidden": "true",
	class: "fa-solid fa-spinner fa-spin"
}, bO = {
	key: 1,
	"aria-hidden": "true",
	class: "fa-solid fa-layer-group"
}, xO = ["disabled"], SO = ["disabled"], CO = ["disabled"], wO = { class: "app:min-h-0 app:flex-1 app:p-2" }, TO = /* @__PURE__ */ U({
	__name: "ActorPortraitGalleryApp",
	props: {
		bridge: {},
		context: {}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ z(""), r = /* @__PURE__ */ z(""), i = /* @__PURE__ */ z(null), a = /* @__PURE__ */ z(null), o = /* @__PURE__ */ z(t.context.selectedPortraitPath), s = /* @__PURE__ */ z(t.context.currentPortraitPath), c = /* @__PURE__ */ z(t.context.currentTokenPath), l = null, u = null, d = xf(), f = F_({
			activePortraitPath: o,
			baseSearchTerms: /* @__PURE__ */ z([...t.context.searchTerms]),
			errorMessage: n,
			excludeFullyTransparentImages: /* @__PURE__ */ z(t.context.excludeFullyTransparentImages),
			excludedReferenceImagePaths: /* @__PURE__ */ z([...t.context.excludedReferenceImagePaths]),
			filterState: d,
			hasSubject: /* @__PURE__ */ z(!0),
			immediateCandidates: /* @__PURE__ */ z([...t.context.immediateCandidates]),
			includeCompendiumAssets: /* @__PURE__ */ z(t.context.includeCompendiumAssets),
			includeFilePickerAssets: /* @__PURE__ */ z(t.context.includeFilePickerAssets),
			pinnedPortraitPath: o,
			priorityFolderPaths: /* @__PURE__ */ z([...t.context.priorityFolderPaths]),
			provider: t.bridge,
			searchErrorMessage: "The portrait gallery could not finish searching Foundry images.",
			selectPortrait: _
		}), p = $(() => !!o.value && o.value !== s.value), m = $(() => !!o.value && o.value !== c.value), h = $(() => p.value || m.value), g = $(() => f.selectedPortraitCandidate.value?.label ?? "Selected portrait");
		Ha(o, () => {
			n.value = "", r.value = "";
		}), ho(te);
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
		return (t, s) => (K(), q("section", dO, [Y("header", fO, [Y("div", pO, [Y("h1", mO, F(e.context.actorName), 1), r.value ? (K(), q("span", hO, F(r.value), 1)) : Q("", !0)]), Y("div", gO, [
			o.value ? (K(), q("img", {
				key: 0,
				alt: `${g.value} preview`,
				class: "app:aspect-square app:w-10 app:rounded-box app:bg-base-300 app:object-cover",
				height: "40",
				src: o.value,
				width: "40"
			}, null, 8, _O)) : Q("", !0),
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
			}, [i.value === "both" ? (K(), q("i", yO)) : (K(), q("i", bO)), Z(" " + F(i.value === "both" ? "Applying..." : "Apply to Both"), 1)], 8, vO), Y("button", {
				"aria-label": "More apply options",
				class: "dui-btn dui-btn-primary dui-btn-sm dui-btn-square dui-join-item",
				disabled: !o.value || !!i.value,
				popovertarget: "actor-portrait-apply-menu",
				style: { "anchor-name": "--actor-portrait-apply-menu" },
				type: "button"
			}, [...s[3] ||= [Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-chevron-down"
			}, null, -1)]], 8, xO)], 32),
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
			}, null, -1), Z(" Portrait only ", -1)]], 8, SO)]), Y("li", null, [Y("button", {
				disabled: !m.value || !!i.value,
				type: "button",
				onClick: s[2] ||= (e) => y("token")
			}, [...s[5] ||= [Y("i", {
				"aria-hidden": "true",
				class: "fa-solid fa-circle"
			}, null, -1), Z(" Token only ", -1)]], 8, CO)])], 544)
		])]), Y("main", wO, [X(l_, {
			class: "app:h-full",
			"empty-message": "No portrait or token images are available for this Actor yet.",
			"error-message": n.value,
			"fill-height": "",
			"is-loading": B(f).isLoadingPortraitCandidates.value,
			options: B(f).portraitCandidates.value,
			"progress-label": B(f).portraitSearchProgressLabel.value,
			"progress-value": B(f).portraitSearchProgressValue.value,
			"search-terms": B(f).portraitSearchTerms.value,
			"selected-option-key": B(f).selectedPortraitCandidateKey.value,
			tags: B(f).portraitFilterTags.value,
			onCreateSearchTerm: B(f).addPortraitSearchTerm,
			onFilterTagSectionChange: B(f).setPortraitFilterTagSection,
			onSelectPortrait: B(f).selectPortrait
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
}), EO = {
	applyActorPortrait: DO,
	filterPortraitCandidates: aT,
	listPortraitCandidates: fT
};
async function DO(e, t, n) {
	await Ye(await fromUuid(e), "The Actor for this portrait gallery is no longer available.").update(OO(t, n));
}
function OO(e, t) {
	return t === "portrait" ? { img: e } : t === "token" ? { "prototypeToken.texture.src": e } : {
		img: e,
		"prototypeToken.texture.src": e
	};
}
//#endregion
//#region src/module/wfrp/actor-portrait-gallery/context.ts
function kO(e, t) {
	let n = e.img?.trim() ?? "", r = Aw(e), i = (e.items?.contents ?? []).filter((e) => e.type === "career"), a = h(e.system, [
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
		...i.flatMap(jO)
	];
	return {
		actorName: e.name,
		actorUuid: e.uuid,
		currentPortraitPath: n,
		currentTokenPath: r,
		excludeFullyTransparentImages: t.excludeFullyTransparentPortraitAssets,
		excludedReferenceImagePaths: [...t.excludedPortraitReferenceImages],
		immediateCandidates: AO(e, n, r),
		includeCompendiumAssets: t.searchCompendiumPortraitAssets,
		includeFilePickerAssets: t.searchFoundryPortraitAssets,
		priorityFolderPaths: af({
			configuredFolders: t.prioritizedPortraitFolders,
			hasCareer: !!a || i.length > 0
		}),
		searchTerms: nf(o),
		selectedPortraitPath: n || r
	};
}
function AO(e, t, n) {
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
	}), Wd(r);
}
function jO(e) {
	return [
		e.name,
		h(e.system, ["careergroup", "value"]),
		h(e.system, ["class", "value"])
	];
}
//#endregion
//#region src/module/apps/actor-portrait-gallery/view/ActorPortraitGalleryApplication.ts
var MO = class extends SC {
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
		return TO;
	}
	getVueProps() {
		return {
			bridge: EO,
			context: kO(this.actor, TT())
		};
	}
};
//#endregion
//#region src/module/wfrp/actor-portrait-gallery/open.ts
async function NO(e) {
	await new MO(Ye(await fromUuid(e), "The requested Actor could not be opened in the portrait gallery.")).render(!0);
}
async function PO(e) {
	await new MO(e).render(!0);
}
//#endregion
//#region src/module/wfrp/actor-portrait-gallery/register-actor-sheet-button.ts
var FO = "openWfrpCustomizerPortraitGallery", IO = "wfrp4e-customizer-actor-portrait-gallery-header", LO = [
	"getHeaderControlsActorSheetWFRP4eCharacter",
	"getHeaderControlsActorSheetWFRP4eNPC",
	"getHeaderControlsActorSheetWFRP4eCreature",
	"getHeaderControlsStandardWFRP4eActorSheet",
	"getHeaderControlsBaseWFRP4eActorSheet",
	"getHeaderControlsWarhammerActorSheetV2"
], RO = [
	"renderActorSheetWFRP4eCharacter",
	"renderActorSheetWFRP4eNPC",
	"renderActorSheetWFRP4eCreature",
	"renderStandardWFRP4eActorSheet",
	"renderBaseWFRP4eActorSheet",
	"renderWarhammerActorSheetV2"
], zO = !1;
function BO() {
	if (!zO) {
		zO = !0;
		for (let e of LO) Hooks.on(e, VO);
		for (let e of RO) Hooks.on(e, HO);
	}
}
function VO(e, t) {
	let n = UO(e);
	if (!n || !Array.isArray(t) || n.isOwner === !1) return;
	let r = t;
	r.some((e) => e.action === FO) || r.push({
		action: FO,
		icon: "fa-solid fa-images",
		label: "Choose Portrait & Token"
	});
	let i = e;
	i.options ??= {}, i.options.actions ??= {}, i.options.actions[FO] = function() {
		let e = UO(this);
		e && GO(e);
	};
}
function HO(e) {
	let t = UO(e), n = WO(e);
	if (!t || !n || t.isOwner === !1) return;
	let r = n.querySelector(".window-header");
	if (!r || r.querySelector(`.${IO}, [data-action="${FO}"]`)) return;
	let i = document.createElement("button");
	i.type = "button", i.classList.add(IO, "header-control", "icon", "fa-solid", "fa-images"), i.dataset.action = FO, i.dataset.tooltip = "Choose Portrait & Token", i.ariaLabel = `Choose a portrait and prototype token for ${t.name}`, i.addEventListener("click", (e) => {
		e.preventDefault(), e.stopPropagation(), GO(t);
	});
	let a = r.querySelector("[data-action=\"toggleControls\"]") ?? r.querySelector("[data-action=\"close\"]");
	r.insertBefore(i, a);
}
function UO(e) {
	if (typeof e != "object" || !e) return null;
	let t = "document" in e ? e.document : void 0, n = "actor" in e ? e.actor : void 0;
	return qe(t) ? t : qe(n) ? n : null;
}
function WO(e) {
	return typeof e != "object" || !e || !("element" in e) ? null : e.element instanceof HTMLElement ? e.element : null;
}
async function GO(e) {
	try {
		await PO(e);
	} catch (e) {
		kn("wfrp4e-customizer-apps | Actor portrait gallery could not be opened.", e), ui.notifications?.warn?.("The portrait gallery could not be opened. See the console for details.");
	}
}
//#endregion
//#region src/module/wfrp/npc-builder/estimated-xp/actor-profile.ts
function KO(e) {
	let t = e.toObject(), n = {};
	for (let e of Object.keys(C)) {
		let r = e;
		n[r] = AT(t.system, r);
	}
	return {
		characteristics: n,
		skills: qO(e, "skill"),
		talents: qO(e, "talent")
	};
}
function qO(e, t) {
	return e.items?.contents.filter((e) => e.type === t).map((e) => ({
		name: e.name,
		value: t === "skill" ? JO(e.toObject().system) : YO(e.toObject().system)
	})) ?? [];
}
function JO(e) {
	return _(e, [["advances", "value"], ["advances"]]) + _(e, [["modifier", "value"], ["modifier"]]);
}
function YO(e) {
	return _(e, [["advances", "value"], ["advances"]]);
}
//#endregion
//#region src/module/wfrp/npc-builder/estimated-xp/species-actor.ts
var XO = null;
async function ZO(e, t, n) {
	let r = game.actors.contents, i = QO(n ? r.filter((e) => e.folder?.uuid === n) : [], e);
	if (i) return {
		actor: i,
		source: i.folder?.name ?? "Configured NPC Base Actors folder"
	};
	let a = QO(r.filter((e) => e.uuid !== t.uuid), e);
	if (a) return {
		actor: a,
		source: "World Actors"
	};
	let o = $O(await tk(), e);
	if (!o) return null;
	let s = await fromUuid(o.uuid);
	if (!rk(s)) throw Error(`The species Actor ${o.uuid} is no longer available.`);
	return {
		actor: s,
		source: o.source
	};
}
function QO(e, t) {
	return ek(e, t, (e) => e.name);
}
function $O(e, t) {
	return ek(e, t, (e) => e.name);
}
function ek(e, t, n) {
	let r = t.trim();
	return e.find((e) => n(e).trim() === r) ?? e.find((e) => Tu(n(e)) === Tu(t)) ?? null;
}
function tk() {
	return XO ??= nk(), XO;
}
async function nk() {
	let e = [];
	for (let t of game.packs ?? []) {
		if (!MC(t) || !t.getIndex) continue;
		let n = await t.getIndex({ fields: ["name"] });
		for (let r of NC(n)) {
			let n = AC(t, r);
			r.name && n && e.push({
				name: r.name,
				source: t.title ?? t.collection ?? "Actor Compendium",
				uuid: n
			});
		}
	}
	return e;
}
function rk(e) {
	return typeof e == "object" && !!e && "documentName" in e && e.documentName === "Actor";
}
//#endregion
//#region src/module/wfrp/npc-builder/estimated-xp/estimate.ts
async function ik(e) {
	let t = Ye(await fromUuid(e), "Expected an NPC Actor.");
	if (t.type !== "npc") throw Error(`Expected an NPC Actor, but received Actor type “${t.type}”.`);
	return await ak(t);
}
async function ak(e) {
	let t = NE(e);
	if (!t) return { status: "missing-species" };
	let n = await ZO(t, e, TT().baseActorFolderUuid);
	return n ? {
		baselineName: n.actor.name,
		baselineSource: n.source,
		baselineUuid: n.actor.uuid,
		breakdown: yd(KO(e), KO(n.actor)),
		species: t,
		status: "ready"
	} : {
		species: t,
		status: "baseline-not-found"
	};
}
//#endregion
//#region src/module/wfrp/npc-builder/estimated-xp/sheet.ts
var ok = "[data-wfrp-customizer-npc-xp=\"true\"]", sk = /* @__PURE__ */ new Set(), ck = !1, lk = !1;
function uk() {
	if (!ck) {
		ck = !0, Hooks.on("renderApplicationV2", (e, t) => {
			if (!(t instanceof HTMLElement)) return;
			let n = hk(e);
			n && dk(n, t);
		});
		for (let e of [
			"createActor",
			"updateActor",
			"deleteActor",
			"createItem",
			"updateItem",
			"deleteItem",
			"updateSetting"
		]) Hooks.on(e, gk);
	}
}
function dk(e, t) {
	let n = t.matches("section[data-tab=\"careers\"]") ? t : t.querySelector("section[data-tab=\"careers\"]");
	if (!n) return;
	n.querySelector(ok)?.remove();
	let r = fk(e, t), i = n.querySelector(".sheet-list.careers");
	i ? n.insertBefore(r.container, i) : n.append(r.container), _k(), pk(r), globalThis.setTimeout(() => {
		r.root.isConnected && r.root.contains(r.container) && (_k(), sk.add(r));
	}, 0);
}
function fk(e, t) {
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
async function pk(e) {
	let t = ++e.generation;
	e.output.value = "Calculating…";
	try {
		let n = await ak(e.actor);
		t === e.generation && e.root.contains(e.container) && mk(e, n);
	} catch (n) {
		t === e.generation && e.root.contains(e.container) && (e.output.value = "Unavailable", e.details.textContent = "XP calculation failed; see the console for details."), kn("wfrp4e-customizer-apps | NPC XP calculation failed.", n);
	}
}
function mk(e, t) {
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
function hk(e) {
	if (typeof e != "object" || !e) return null;
	let t = "actor" in e ? e.actor : void 0, n = "document" in e ? e.document : void 0, r = qe(t) ? t : qe(n) ? n : null;
	return r?.type === "npc" ? r : null;
}
function gk() {
	lk || (lk = !0, globalThis.setTimeout(() => {
		lk = !1, _k();
		for (let e of sk) pk(e);
	}, 0));
}
function _k() {
	for (let e of sk) (!e.root.isConnected || !e.root.contains(e.container)) && sk.delete(e);
}
//#endregion
//#region src/module/functions/species-chargen/characteristic-roll-formulas.ts
var vk = "2d10";
function yk(e) {
	let t = e?.split("+")[0]?.trim();
	return t ? xk(t) : vk;
}
function bk(e, t) {
	return yk(e) === yk(t);
}
function xk(e) {
	return e.replaceAll(/\s+/g, "").toLocaleLowerCase();
}
//#endregion
//#region src/module/wfrp/species-chargen/roll-swap-feedback.ts
var Sk = "data-wfrp4e-customizer-roll-swap-feedback", Ck = `[${Sk}="blocked"]`, wk = /* @__PURE__ */ new WeakMap();
function Tk(e, t) {
	let n = Mk(e);
	if (n) for (let e of jk(n)) e.addEventListener("dragstart", () => {
		let r = e.dataset.ch;
		r && Ek(n, r, t);
	}), e.addEventListener("dragend", () => {
		Ok(n);
	}), e.addEventListener("drop", () => {
		Ok(n);
	});
}
function Ek(e, t, n) {
	Ok(e);
	for (let r of jk(e)) {
		let e = r.dataset.ch;
		e && (e === t || n(t, e) || Dk(r));
	}
}
function Dk(e) {
	wk.set(e, {
		ariaDisabled: e.getAttribute("aria-disabled"),
		borderColor: e.style.getPropertyValue("border-color"),
		borderColorPriority: e.style.getPropertyPriority("border-color"),
		hadDisabledClass: e.classList.contains("disabled")
	}), e.setAttribute(Sk, "blocked"), e.setAttribute("aria-disabled", "true"), e.classList.add("disabled"), e.style.setProperty("border-color", "transparent");
}
function Ok(e) {
	for (let t of e.querySelectorAll(Ck)) {
		let e = wk.get(t);
		e && (e.hadDisabledClass || t.classList.remove("disabled"), kk(t, "aria-disabled", e.ariaDisabled), Ak(t, "border-color", e.borderColor, e.borderColorPriority), t.removeAttribute(Sk), wk.delete(t));
	}
}
function kk(e, t, n) {
	if (n === null) {
		e.removeAttribute(t);
		return;
	}
	e.setAttribute(t, n);
}
function Ak(e, t, n, r) {
	if (!n) {
		e.style.removeProperty(t);
		return;
	}
	e.style.setProperty(t, n, r);
}
function jk(e) {
	return [...e.querySelectorAll(".ch-roll.ch-drag")];
}
function Mk(e) {
	if (e instanceof HTMLElement) return e;
	if (!p(e)) return;
	let t = e[0];
	return t instanceof HTMLElement ? t : void 0;
}
//#endregion
//#region src/module/wfrp/species-chargen/roll-swap-guard.ts
var Nk = Symbol("wfrp4e-customizer-guarded-attributes-stage");
function Pk() {
	Hooks.on("wfrp4e:chargen", (e) => {
		Fk(e);
	});
}
function Fk(t) {
	let n = Ik(t);
	if (!n) {
		kn(`${e} | Could not inspect WFRP character generation stages.`);
		return;
	}
	let r = Lk(n);
	if (!r) {
		kn(`${e} | Could not find the WFRP Attributes character generation stage.`);
		return;
	}
	if (Rk(r.class)) return;
	let i = zk(r.class);
	typeof n.replaceStage == "function" ? n.replaceStage("attributes", i) : r.class = i, On(`${e} | Guarded WFRP characteristic roll swapping for custom species.`);
}
function Ik(e) {
	if (!p(e)) return;
	let t = {}, n = e.replaceStage;
	return typeof n == "function" && (t.replaceStage = (t, r) => {
		n.call(e, t, r);
	}), Array.isArray(e.stages) && (t.stages = e.stages), t;
}
function Lk(e) {
	for (let t of e.stages ?? []) if (p(t) && t.key === "attributes") return typeof t.class == "function" ? t : void 0;
}
function Rk(e) {
	return !!e[Nk];
}
function zk(e) {
	class t extends e {
		static [Nk] = !0;
		activateListeners(e) {
			let t = super.activateListeners(e);
			return Tk(e, (e, t) => bk(Bk(this, e), Bk(this, t))), t;
		}
		swap(e, t) {
			let n = Bk(this, e), r = Bk(this, t);
			if (bk(n, r)) return super.swap(e, t);
			Vk(e, n, t, r);
		}
	}
	return t;
}
function Bk(e, t) {
	let n = p(e.context) ? e.context : void 0, r = p(n?.characteristics) ? n.characteristics : void 0, i = (p(r?.[t]) ? r[t] : void 0)?.formula;
	return typeof i == "string" ? i : void 0;
}
function Vk(e, t, n, r) {
	let i = Hk(e), a = Hk(n), o = yk(t), s = yk(r);
	ui.notifications?.warn?.(`Cannot swap ${i} and ${a}: ${i} uses ${o}, while ${a} uses ${s}.`);
}
function Hk(e) {
	let t = game.wfrp4e?.config?.characteristics;
	if (!p(t)) return e;
	let n = t[e];
	return typeof n == "string" ? n : e;
}
//#endregion
//#region src/module/apps/species-item/state/index.ts
function Uk(e) {
	return gu(`species-item:${e}`, () => {
		let t = /* @__PURE__ */ z({
			name: "",
			img: "icons/svg/mystery-man.svg",
			system: oe()
		}), n = /* @__PURE__ */ z(""), r = /* @__PURE__ */ z("description"), i = /* @__PURE__ */ z(0), a = /* @__PURE__ */ z(!1), o = /* @__PURE__ */ z([]), s = /* @__PURE__ */ z(""), c = /* @__PURE__ */ z(""), l = /* @__PURE__ */ z(!1), u = /* @__PURE__ */ z(!1), d = /* @__PURE__ */ z(!1), f = /* @__PURE__ */ z(null), p;
		Ha(() => t.value.system.subspeciesOf, async (e, t, n) => {
			let r = !0;
			n(() => {
				r = !1;
			}), f.value = null;
			try {
				let t = await p.loadParent(e);
				r && (f.value = t);
			} catch (e) {
				r && (s.value = Wk(e));
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
				s.value = Wk(e), u.value = !1;
			}
		}
		async function y() {
			l.value = !0, s.value = "";
			try {
				p.flushNotes(), t.value = await p.save(JSON.parse(JSON.stringify(t.value))), n.value = JSON.stringify(t.value), i.value += 1, c.value = "Saved Species Item. Refresh Foundry to update character generation.";
			} catch (e) {
				s.value = Wk(e);
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
				s.value = Wk(e);
			}
		}
		let ne = $(() => {
			try {
				return D(t.value.system.talents.choices), "";
			} catch (e) {
				return Wk(e);
			}
		});
		async function re(e) {
			try {
				await p.openReference(e);
			} catch (e) {
				s.value = Wk(e);
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
				s.value = Wk(e);
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
function Wk(e) {
	return e instanceof Error ? e.message : String(e);
}
//#endregion
//#region src/module/apps/species-item/view/details/SpeciesTalentEditor.vue?vue&type=script&setup=true&lang.ts
var Gk = ["disabled"], Kk = { class: "dui-fieldset-legend" }, qk = { class: "app:flex app:flex-wrap app:items-center app:gap-2" }, Jk = { class: "dui-label" }, Yk = [
	"value",
	"aria-label",
	"onChange"
], Xk = { class: "app:flex app:gap-2" }, Zk = ["onClick"], Qk = ["onClick"], $k = /* @__PURE__ */ U({
	__name: "SpeciesTalentEditor",
	props: { uuid: {} },
	setup(e) {
		let t = Uk(e.uuid);
		return (e, n) => (K(), q("fieldset", {
			class: "dui-fieldset",
			disabled: !!B(t).choiceWarning
		}, [
			n[1] ||= Y("legend", { class: "app:sr-only" }, "Edit Talent choices", -1),
			(K(!0), q(G, null, W(B(t).grants, (e, n) => (K(), q("fieldset", {
				key: n,
				class: "dui-fieldset"
			}, [
				Y("legend", Kk, "Talent " + F(n + 1), 1),
				Y("div", qk, [(K(!0), q(G, null, W(e.choices, (e, r) => (K(), q("label", {
					key: r,
					class: "dui-input dui-input-sm app:min-w-0 app:flex-1"
				}, [Y("span", Jk, F(r ? "Or" : "Talent"), 1), Y("input", {
					value: e.name,
					required: "",
					"aria-label": `Talent ${n + 1}, option ${r + 1}`,
					onChange: (e) => B(t).editTalent(n, r, e.target.value)
				}, null, 40, Yk)]))), 128))]),
				Y("div", Xk, [Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					onClick: (e) => B(t).addTalent(n)
				}, " Add alternative ", 8, Zk), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					onClick: (e) => B(t).removeTalent(n)
				}, " Remove grant ", 8, Qk)])
			]))), 128)),
			Y("button", {
				type: "button",
				class: "dui-btn dui-btn-sm app:justify-self-start",
				onClick: n[0] ||= (e) => B(t).addTalent()
			}, " Add Talent ")
		], 8, Gk));
	}
}), eA = ["disabled"], tA = { class: "app:flex app:flex-wrap app:items-center app:gap-1" }, nA = [
	"onUpdate:modelValue",
	"aria-label",
	"size"
], rA = ["aria-label", "onClick"], iA = {
	key: 0,
	class: "dui-alert dui-alert-warning",
	role: "status"
}, aA = { class: "app:flex app:items-center app:gap-2" }, oA = [
	"disabled",
	"aria-expanded",
	"aria-controls"
], sA = { class: "app:my-1" }, cA = { class: "dui-input dui-input-sm app:w-full" }, lA = [
	"id",
	"value",
	"placeholder"
], uA = /* @__PURE__ */ U({
	__name: "SpeciesItemGrants",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = Uk(e.uuid);
		return (n, r) => (K(), q("fieldset", {
			class: "dui-fieldset",
			disabled: !e.editable
		}, [
			r[11] ||= Y("legend", { class: "app:sr-only" }, "Skills and Talents", -1),
			X(Mv, {
				title: "Skills",
				variant: "bare",
				"show-prompt": !1,
				"manual-entry-trigger": "none",
				disabled: !e.editable,
				onDropData: r[1] ||= (e) => B(t).drop(e, "skills")
			}, {
				default: V(() => [r[7] ||= Y("div", { class: "dui-divider" }, "Skills", -1), Y("div", tA, [(K(!0), q(G, null, W(B(t).draft.system.skills.list, (e, n) => (K(), q("div", {
					key: n,
					class: "dui-join app:max-w-full"
				}, [H(Y("input", {
					"onUpdate:modelValue": (e) => B(t).draft.system.skills.list[n] = e,
					"aria-label": `Skill ${n + 1} name`,
					size: Math.max(6, B(t).draft.system.skills.list[n].length),
					class: "dui-input dui-input-xs dui-join-item app:w-auto app:min-w-0",
					required: ""
				}, null, 8, nA), [[bl, B(t).draft.system.skills.list[n]]]), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-square dui-join-item",
					"aria-label": `Remove Skill ${n + 1}`,
					onClick: (e) => B(t).draft.system.skills.list.splice(n, 1)
				}, [...r[5] ||= [Y("i", {
					class: "fa-solid fa-xmark",
					"aria-hidden": "true"
				}, null, -1)]], 8, rA)]))), 128)), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					onClick: r[0] ||= (e) => B(t).draft.system.skills.list.push("New Skill")
				}, [...r[6] ||= [Y("i", {
					class: "fa-solid fa-plus",
					"aria-hidden": "true"
				}, null, -1), Z(" Skill ", -1)]])])]),
				_: 1
			}, 8, ["disabled"]),
			B(t).choiceWarning ? (K(), q("div", iA, F(B(t).choiceWarning) + " The stored choices are preserved. ", 1)) : Q("", !0),
			X(Mv, {
				title: "Talents",
				variant: "bare",
				"show-prompt": !1,
				"manual-entry-trigger": "none",
				disabled: !e.editable || !!B(t).choiceWarning,
				onDropData: r[3] ||= (e) => B(t).drop(e, "talents")
			}, {
				default: V(() => [Y("div", aA, [r[9] ||= Y("span", { class: "dui-label app:flex-1" }, "Talents", -1), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-xs dui-btn-ghost",
					disabled: !e.editable || !!B(t).choiceWarning,
					"aria-expanded": B(t).editingTalents,
					"aria-controls": `${e.uuid}-talent-editor`,
					onClick: r[2] ||= (e) => B(t).editingTalents = !B(t).editingTalents
				}, [r[8] ||= Y("i", {
					class: "fa-solid fa-gear",
					"aria-hidden": "true"
				}, null, -1), Z(" " + F(B(t).editingTalents ? "Done" : "Edit Talents"), 1)], 8, oA)]), Y("p", sA, F(B(t).choiceWarning ? "Native Talent choices preserved" : B(t).talentSummary || (B(t).draft.system.subspeciesOf.uuid ? "Inherit parent Talents" : "None")), 1)]),
				_: 1
			}, 8, ["disabled"]),
			B(t).editingTalents ? (K(), J($k, {
				key: 1,
				id: `${e.uuid}-talent-editor`,
				uuid: e.uuid
			}, null, 8, ["id", "uuid"])) : Q("", !0),
			Y("label", cA, [r[10] ||= Y("span", { class: "dui-label app:flex-1" }, "Random Talents", -1), Y("input", {
				id: `${e.uuid}-random-talents`,
				"aria-label": "Random Talents",
				class: "app:max-w-20 app:text-center",
				type: "number",
				min: "0",
				value: B(t).draft.system.talents.random,
				placeholder: String(B(t).parent?.talents.random ?? "—"),
				onInput: r[4] ||= (e) => B(t).draft.system.talents.random = e.target.value === "" ? null : Number(e.target.value)
			}, null, 40, lA)])
		], 8, eA));
	}
}), dA = { class: "dui-label" }, fA = { class: "dui-join app:min-w-0" }, pA = {
	key: 1,
	class: "dui-input dui-input-sm app:h-auto app:min-h-8 app:w-full app:whitespace-normal"
}, mA = ["aria-label"], hA = /* @__PURE__ */ U({
	__name: "SpeciesItemReference",
	props: {
		uuid: {},
		label: {},
		reference: {},
		editable: { type: Boolean }
	},
	emits: ["clear", "drop-data"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = Uk(n.uuid);
		function a(e) {
			n.editable && e.dataTransfer && r("drop-data", e.dataTransfer.getData("text/plain"));
		}
		return (t, n) => (K(), q("div", {
			class: "app:grid app:grid-cols-[7rem_minmax(0,1fr)] app:items-center app:gap-2",
			onDragover: n[2] ||= kl(() => {}, ["prevent"]),
			onDrop: kl(a, ["prevent"])
		}, [Y("span", dA, F(e.label), 1), Y("div", fA, [e.reference.uuid ? (K(), q("button", {
			key: 0,
			type: "button",
			class: "dui-btn dui-btn-sm dui-btn-outline dui-join-item app:h-auto app:min-h-8 app:min-w-0 app:flex-1 app:justify-start app:whitespace-normal",
			onClick: n[0] ||= (t) => B(i).openReference(e.reference.uuid)
		}, F(e.reference.name || e.label), 1)) : (K(), q("div", pA, " Drop " + F(e.label === "Subspecies Of" ? "a Species Item" : "a RollTable") + " here ", 1)), e.editable && (e.reference.uuid || e.reference.id) ? (K(), q("button", {
			key: 2,
			type: "button",
			class: "dui-btn dui-btn-sm dui-btn-square dui-join-item",
			"aria-label": `Clear ${e.label}`,
			onClick: n[1] ||= (e) => r("clear")
		}, [...n[3] ||= [Y("i", {
			class: "fa-solid fa-xmark",
			"aria-hidden": "true"
		}, null, -1)]], 8, mA)) : Q("", !0)])], 32));
	}
}), gA = ["disabled"], _A = /* @__PURE__ */ U({
	__name: "SpeciesItemTables",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = Uk(e.uuid), n = [
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
			(K(), q(G, null, W(n, (n) => X(hA, {
				key: n.key,
				uuid: e.uuid,
				label: n.label,
				reference: B(t).draft.system.tables[n.key],
				editable: e.editable,
				onDropData: (e) => B(t).drop(e, n.key),
				onClear: (e) => B(t).draft.system.tables[n.key] = B(O)()
			}, null, 8, [
				"uuid",
				"label",
				"reference",
				"editable",
				"onDropData",
				"onClear"
			])), 64))
		], 8, gA));
	}
}), vA = ["disabled"], yA = { class: "app:max-w-full app:overflow-x-auto" }, bA = { class: "dui-table dui-table-xs app:min-w-[34rem]" }, xA = { class: "app:sr-only" }, SA = [
	"aria-label",
	"value",
	"placeholder",
	"onInput"
], CA = { "aria-hidden": "true" }, wA = { class: "dui-input dui-input-xs dui-input-ghost app:w-full app:gap-0 app:px-1" }, TA = [
	"aria-label",
	"value",
	"placeholder",
	"onInput"
], EA = { key: 0 }, DA = { class: "dui-input dui-input-sm app:w-full" }, OA = [
	"id",
	"value",
	"placeholder"
], kA = { class: "app:flex app:flex-wrap app:gap-2" }, AA = { class: "dui-label app:flex-1" }, jA = [
	"aria-label",
	"value",
	"placeholder",
	"onInput"
], MA = { class: "app:grid app:grid-cols-[7rem_minmax(0,1fr)] app:items-center app:gap-2" }, NA = ["for"], PA = ["id"], FA = /* @__PURE__ */ U({
	__name: "SpeciesItemDetails",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = Uk(e.uuid), n = {
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
			X(hA, {
				uuid: e.uuid,
				label: "Subspecies Of",
				reference: B(t).draft.system.subspeciesOf,
				editable: e.editable,
				onDropData: o[0] ||= (e) => B(t).drop(e, "parent"),
				onClear: o[1] ||= (e) => B(t).clearParent()
			}, null, 8, [
				"uuid",
				"reference",
				"editable"
			]),
			Y("div", yA, [Y("table", bA, [
				o[5] ||= Y("caption", { class: "app:sr-only" }, " Characteristic bases plus dice ", -1),
				Y("thead", null, [Y("tr", null, [(K(!0), q(G, null, W(B(r), (e) => (K(), q("th", {
					key: e,
					scope: "col",
					class: "app:text-center"
				}, F(n[e]), 1))), 128))])]),
				Y("tbody", null, [
					Y("tr", null, [(K(!0), q(G, null, W(B(r), (e) => (K(), q("td", {
						key: e,
						class: "app:p-1"
					}, [Y("label", null, [Y("span", xA, F(n[e]) + " base", 1), Y("input", {
						class: "dui-input dui-input-xs dui-input-ghost app:w-full app:text-center",
						type: "number",
						min: "0",
						step: "any",
						"aria-label": `${n[e]} base`,
						value: B(t).draft.system.characteristics[e]?.base,
						placeholder: String(B(t).parent?.characteristics[e]?.base ?? "—"),
						onInput: (n) => B(t).setCharacteristic(e, "base", n.target.value)
					}, null, 40, SA)])]))), 128))]),
					Y("tr", CA, [(K(!0), q(G, null, W(B(r), (e) => (K(), q("td", {
						key: e,
						class: "app:text-center"
					}, "+"))), 128))]),
					Y("tr", null, [(K(!0), q(G, null, W(B(r), (e) => (K(), q("td", {
						key: e,
						class: "app:p-1"
					}, [Y("label", wA, [Y("input", {
						class: "app:text-center",
						type: "number",
						min: "0",
						step: "any",
						"aria-label": `${n[e]} dice`,
						value: B(t).draft.system.characteristics[e]?.dice,
						placeholder: String(B(t).parent?.characteristics[e]?.dice ?? "—"),
						onInput: (n) => B(t).setCharacteristic(e, "dice", n.target.value)
					}, null, 40, TA), o[4] ||= Y("span", null, "d10", -1)])]))), 128))])
				])
			])]),
			B(t).draft.system.subspeciesOf.uuid ? (K(), q("p", EA, "Empty values inherit from the parent species.")) : Q("", !0),
			X(uA, {
				uuid: e.uuid,
				editable: e.editable
			}, null, 8, ["uuid", "editable"]),
			Y("label", DA, [o[6] ||= Y("span", { class: "dui-label app:flex-1" }, "Movement", -1), Y("input", {
				id: `${e.uuid}-movement`,
				"aria-label": "Movement",
				class: "app:max-w-20 app:text-center",
				type: "number",
				min: "0",
				step: "any",
				value: B(t).draft.system.movement,
				placeholder: String(B(t).parent?.movement ?? "—"),
				onInput: o[2] ||= (e) => B(t).setStatistic("movement", e.target.value)
			}, null, 40, OA)]),
			Y("div", kA, [(K(), q(G, null, W(i, (e) => Y("label", {
				key: e.key,
				class: "dui-input dui-input-sm app:min-w-36 app:flex-1"
			}, [Y("span", AA, F(e.label), 1), Y("input", {
				class: "app:max-w-12 app:text-center",
				type: "number",
				min: "0",
				step: "any",
				"aria-label": e.label,
				value: B(t).draft.system[e.key],
				placeholder: String(B(t).parent?.[e.key] ?? "—"),
				onInput: (n) => B(t).setStatistic(e.key, n.target.value)
			}, null, 40, jA)])), 64))]),
			Y("div", MA, [Y("label", {
				class: "dui-label",
				for: `${e.uuid}-size`
			}, "Size", 8, NA), H(Y("select", {
				id: `${e.uuid}-size`,
				"onUpdate:modelValue": o[3] ||= (e) => B(t).draft.system.size = e,
				class: "dui-select dui-select-sm app:w-full",
				"aria-label": "Size"
			}, [...o[7] ||= [tc("<option value=\"tiny\">Tiny</option><option value=\"ltl\">Little</option><option value=\"sml\">Small</option><option value=\"avg\">Average</option><option value=\"lrg\">Large</option><option value=\"enor\">Enormous</option><option value=\"mnst\">Monstrous</option>", 7)]], 8, PA), [[Cl, B(t).draft.system.size]])]),
			X(_A, {
				uuid: e.uuid,
				editable: e.editable
			}, null, 8, ["uuid", "editable"])
		], 8, vA));
	}
}), IA = {
	key: 0,
	class: "dui-fieldset"
}, LA = { class: "dui-fieldset" }, RA = /* @__PURE__ */ U({
	__name: "SpeciesItemNotes",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = e, n = Uk(t.uuid), r = /* @__PURE__ */ z(), i = /* @__PURE__ */ z(), a = [];
		return fo(() => {
			for (let [e, o] of [["description", r.value], ["gmdescription", i.value]]) o && a.push(n.mountNotes(o, e, n.draft.system[e].value, t.editable, (t) => {
				n.draft.system[e].value = t;
			}));
		}), ho(() => a.forEach((e) => e())), (t, a) => (K(), q(G, null, [B(n).isGM ? (K(), q("fieldset", IA, [
			a[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "GM Notes", -1),
			e.editable ? (K(), q("button", {
				key: 0,
				type: "button",
				class: "dui-btn dui-btn-xs app:justify-self-start",
				onClick: a[0] ||= (e) => B(n).editNotes("gmdescription")
			}, " Edit GM Notes ")) : Q("", !0),
			Y("div", {
				ref_key: "gmNotes",
				ref: i,
				class: "app:min-h-32",
				"aria-label": "GM Notes"
			}, null, 512)
		])) : Q("", !0), Y("fieldset", LA, [
			a[3] ||= Y("legend", { class: "dui-fieldset-legend" }, "Notes", -1),
			e.editable ? (K(), q("button", {
				key: 0,
				type: "button",
				class: "dui-btn dui-btn-xs app:justify-self-start",
				onClick: a[1] ||= (e) => B(n).editNotes("description")
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
function zA(e) {
	let t = e.dataTransfer?.getData("text/plain") ?? "";
	if (!t) return null;
	try {
		return DT(t).type === "Item" ? t : null;
	} catch {
		return null;
	}
}
async function BA(e) {
	let t = DT(e);
	if (!t.uuid) throw Error("Drop an Item with a resolvable UUID.");
	return Xe(await fromUuid(t.uuid), "The dropped Item was not found.");
}
function VA(e) {
	let t = {
		name: e.name,
		uuid: e.uuid
	};
	return e.img && (t.img = e.img), t;
}
//#endregion
//#region src/module/wfrp/effect-builders/documents.ts
async function HA(e) {
	let t = JSON.parse(e);
	if (!p(t) || typeof t.uuid != "string") throw Error("Drop a document or enter its UUID.");
	return fromUuid(t.uuid);
}
function UA(e) {
	let t = Xe(e, "Choose an Item to receive the effect.");
	if (!game.user || !t.canUserModify(game.user, "update")) throw Error("You do not have permission to edit this Item.");
	if (t.compendium?.locked) throw Error("Unlock the destination compendium or import its Item into the world.");
	return t;
}
async function WA(e, t = !1) {
	let n = await HA(e);
	return VA(t ? UA(n) : Xe(n, "Choose an Item to grant."));
}
function GA(e) {
	if (!p(e) || e.documentName !== "RollTable" || typeof e.uuid != "string" || typeof e.name != "string") throw Error("Choose a RollTable containing Item document results.");
	return {
		uuid: e.uuid,
		name: e.name
	};
}
async function KA(e, t, n = []) {
	if (n.includes(e)) throw Error("The grant RollTables contain a circular reference.");
	if (n.length > 5) throw Error("The grant RollTables exceed Foundry's nesting limit.");
	let r = await fromUuid(e);
	GA(r);
	let i = p(r) ? r.results : void 0, a = p(i) ? i.contents : void 0;
	if (!Array.isArray(a) || !a.length) throw Error("The grant RollTable is empty.");
	for (let r of a) {
		let i = p(r) ? r.documentUuid : void 0;
		if (typeof i != "string" || !i) throw Error("Grant RollTables must use Item or nested RollTable document results.");
		if (i === t) throw Error("An Item cannot grant itself.");
		let a = await fromUuid(i);
		p(a) && a.documentName === "RollTable" ? await KA(i, t, [...n, e]) : Xe(a, `The RollTable result ${i} is not an available Item.`);
	}
}
//#endregion
//#region src/module/apps/effect-builders/functions/catalogue.ts
var qA = [
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
function JA(e) {
	return {
		kind: e,
		name: qA.find((t) => t.kind === e).title,
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
function YA(e, t) {
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
var XA = "generatedGrantItemsEffect", ZA = {
	grantMode: "all",
	lifetime: "linked-to-effect",
	ownerAction: "keep"
};
function QA(e) {
	let t = e.recipe ?? ZA;
	$A(t);
	let n = e.items.map((e) => e.uuid);
	return {
		changes: [],
		description: ej(e.effectName, e.items, t),
		disabled: !1,
		flags: { [e.flagScope]: {
			[XA]: !0,
			itemUuids: n,
			recipe: t
		} },
		img: e.items[0]?.img ?? "icons/svg/aura.svg",
		name: e.effectName,
		system: {
			scriptData: [{
				label: e.effectName,
				script: YA([`const itemUuids = ${JSON.stringify(n)};`], t),
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
function $A(e) {
	if (e.lifetime === "linked-to-effect" && e.ownerAction === "delete-after-grant") throw Error("Self-removing grant effects must create detached item copies.");
}
function ej(e, t, n) {
	let r = tj(e), i = t.map((e) => `<li>${tj(e.name)}</li>`).join("");
	return `<p><strong>${r}</strong>: grants item copies; ${n.lifetime === "linked-to-effect" ? "granted item copies are removed with this effect" : "granted item copies remain after this effect is removed"}.${n.ownerAction === "delete-after-grant" ? " The source Item removes itself after granting." : ""}</p><ul>${i}</ul>`;
}
function tj(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
//#endregion
//#region src/module/functions/effect-builders/wound-formula/compiler.ts
function nj(e) {
	let t = [], n = /* @__PURE__ */ new Set(), r = e.trim();
	return r = r.replaceAll(/@([A-Za-z][\dA-Za-z]*)/g, (e, t) => {
		let r = rj(t);
		return n.add(r), r;
	}), r = r.replaceAll(/{([^{}]+)}/g, (e, n) => ij(t, n, "total")), r = r.replaceAll(/\[([^[\]]+)]/g, (e, n) => ij(t, n, "bonus")), {
		expression: r,
		references: t,
		usedKeywords: n
	};
}
function rj(e) {
	if ((/* @__PURE__ */ "ablaze.advantage.age.bleeding.blinded.broken.corruption.deafened.entangled.fate.fatigued.fortune.height.poisoned.rank.resilience.resolve.sb.sbMultiplier.scale.sin.size.status.stunned.tb.tbMultiplier.weight.wpb.wpbMultiplier.xp".split(".")).includes(e)) return e;
	throw Error(`Unknown wound formula keyword: @${e}`);
}
function ij(e, t, n) {
	let r = aj(t, n, e), i = e.find((e) => oj(e, r));
	return i ? i.variableName : (e.push(r), r.variableName);
}
function aj(e, t, n) {
	let [r, i] = sj(e), a = cj(r), o = fj(dj(r, i, t), n);
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
	return i && (s.characteristicOverride = lj(i)), s;
}
function oj(e, t) {
	return e.characteristicKey === t.characteristicKey && e.characteristicOverride === t.characteristicOverride && e.kind === t.kind && e.name === t.name && e.source === t.source;
}
function sj(e) {
	let t = e.split("|").map((e) => e.trim());
	if (t.length > 2 || !t[0]) throw Error(`Invalid wound formula attribute reference: ${e}`);
	return [t[0], t[1]];
}
function cj(e) {
	let t = e.trim().toLocaleLowerCase();
	return ee(t) ? t : w[t] ?? uj[t];
}
function lj(e) {
	let t = cj(e);
	if (!t) throw Error(`Unknown wound formula characteristic: ${e}`);
	return t;
}
var uj = {
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
function dj(e, t, n) {
	let [r, ...i] = [e, t].flatMap((e) => e ? e.match(/\d+|[A-Za-z]+/g) ?? [] : []), a = r ? [r.toLocaleLowerCase(), ...i.map((e) => e.charAt(0).toLocaleUpperCase() + e.slice(1))].join("") : "attribute";
	return n === "bonus" ? `${a}Bonus` : a;
}
function fj(e, t) {
	let n = new Set(t.map((e) => e.variableName));
	if (!n.has(e)) return e;
	let r = 2, i = `${e}${r}`;
	for (; n.has(i);) r += 1, i = `${e}${r}`;
	return i;
}
//#endregion
//#region src/module/apps/effect-builders/functions/formula-validation.ts
function pj(e) {
	if (!e.trim()) throw Error("Enter a wound formula.");
	let t = nj(e), n = [...t.usedKeywords, ...t.references.map((e) => e.variableName)], r = t.expression.replace(/Math\.(floor|ceil|round|min|max|abs|sqrt|pow)\b/g, "0");
	if ((r.match(/[A-Za-z_$][\w$]*/g) ?? []).some((e) => !n.includes(e)) || /[^\w\s.+*/%(),-]/.test(r)) throw Error("Use arithmetic, formula tokens, and Math functions in the wound formula.");
	try {
		Function(...n, `"use strict"; return (${t.expression});`);
	} catch {
		throw Error("The wound formula has invalid arithmetic or unmatched brackets.");
	}
}
//#endregion
//#region src/module/apps/effect-builders/functions/choice.ts
function mj(e, t, n) {
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
function hj(e, t) {
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
function gj(e) {
	let t = [e.ageFormula.trim(), e.heightFormula.trim()];
	if (!t.some(Boolean)) return ["Enter an age formula, a height formula, or both."];
	if (t.some((e) => e.includes("@"))) return ["Use self-contained formulas without Actor data references (@)."];
	for (let [e, n] of t.entries()) if (n && !Number.isNaN(Number(n))) {
		let t = Number(n);
		if (!Number.isSafeInteger(t) || t < (e === 0 ? 0 : 1)) return [e === 0 ? "Age must be a whole number of zero or more." : "Height must be a positive whole number of inches."];
	}
	return [];
}
function _j(e) {
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
				script: vj,
				options: { deleteEffect: !1 }
			}]
		}
	};
}
var vj = [
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
function yj(e) {
	let t = [];
	if (Sj(e, [
		"sb",
		"tb",
		"wpb"
	]) && (t.push(...Cj(e, "sb", "preWoundArgs.sb")), t.push(...Cj(e, "tb", "preWoundArgs.tb")), t.push(...Cj(e, "wpb", "preWoundArgs.wpb"))), Sj(e, [
		"sbMultiplier",
		"tbMultiplier",
		"wpbMultiplier"
	]) && (t.push("const multiplier = preWoundArgs.multiplier;"), t.push(...Cj(e, "sbMultiplier", "multiplier.sb")), t.push(...Cj(e, "tbMultiplier", "multiplier.tb")), t.push(...Cj(e, "wpbMultiplier", "multiplier.wpb"))), Sj(e, ["scale", "size"]) && (t.push(...wj()), t.push("const size = actorSizeStep();"), t.push(...Cj(e, "scale", "2 ** size"))), Sj(e, kj) && (t.push(...Cj(e, "age", "Number(actor.system.details.age.value)")), t.push(...Cj(e, "height", "Number(actor.system.details.height.value)")), t.push(...Cj(e, "weight", "Number(actor.system.details.weight.value)")), t.push(...Mj(e))), Sj(e, Aj) && (t.push(...Cj(e, "xp", "actor.system.details.experience.total")), t.push(...Cj(e, "fate", "actor.system.status.fate.value")), t.push(...Cj(e, "fortune", "actor.system.status.fortune.value")), t.push(...Cj(e, "resilience", "actor.system.status.resilience.value")), t.push(...Cj(e, "resolve", "actor.system.status.resolve.value")), t.push(...Cj(e, "corruption", "actor.system.status.corruption.value")), t.push(...Cj(e, "sin", "actor.system.status.sin.value")), t.push(...Cj(e, "advantage", "actor.system.status.advantage.value"))), Sj(e, jj)) {
		t.push(...Nj());
		for (let n of jj) t.push(...Cj(e, n, `conditionValue("${n}")`));
	}
	return t.length ? [...t, ""] : [];
}
function bj(e) {
	let t = e.length > 0, n = e.some((e) => e.source === "skill");
	return [...Tj(t), ...Ej(n)];
}
function xj(e) {
	return e.map((e) => e.source === "characteristic" ? Dj(e) : Oj(e));
}
function Sj(e, t) {
	return t.some((t) => e.has(t));
}
function Cj(e, t, n) {
	return e.has(t) ? [`const ${t} = ${n};`] : [];
}
function wj() {
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
function Tj(e) {
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
function Ej(e) {
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
function Dj(e) {
	let t = e.kind === "bonus" ? "characteristicBonus" : "characteristicTotal";
	return `const ${e.variableName} = ${t}(${JSON.stringify(e.characteristicKey)});`;
}
function Oj(e) {
	let t = e.kind === "bonus" ? "skillBonus" : "skillTotal", n = e.characteristicOverride ? JSON.stringify(e.characteristicOverride) : "undefined";
	return `const ${e.variableName} = ${t}(${JSON.stringify(e.name)}, ${n});`;
}
var kj = [
	"age",
	"height",
	"rank",
	"status",
	"weight"
], Aj = [
	"advantage",
	"corruption",
	"fate",
	"fortune",
	"resilience",
	"resolve",
	"sin",
	"xp"
], jj = [
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
function Mj(e) {
	let t = [];
	return e.has("status") && t.push("function statusTierValue() {", "  const statusTiers = { brass: 1, silver: 2, gold: 3 };", "  const tier = actor.system.details.status.tier;", "  return statusTiers[String(tier).toLocaleLowerCase()] || Number(tier);", "}", "const status = statusTierValue();"), t.push(...Cj(e, "rank", "Number(actor.system.details.status.standing)")), t;
}
function Nj() {
	return [
		"function conditionValue(key) {",
		"  return actor.hasCondition(key)?.conditionValue || 0;",
		"}"
	];
}
//#endregion
//#region src/module/functions/effect-builders/wound-formula/index.ts
function Pj(e) {
	let t = nj(e);
	return [
		...yj(t.usedKeywords),
		...bj(t.references),
		...xj(t.references),
		"",
		`args.wounds = ${t.expression};`
	];
}
//#endregion
//#region src/module/apps/effect-builders/functions/wounds.ts
var Fj = ["const storageKey = \"__wfrp4eCustomizerWoundFormulaArgs\";", "const sourceId = this.effect.id;"];
function Ij(e, t) {
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
					...Fj,
					"this.actor[storageKey] ||= {};",
					"this.actor[storageKey][sourceId] = args;"
				].join("\n")
			}, {
				label: e,
				trigger: "woundCalc",
				script: [
					...Fj,
					"const preWoundArgs = this.actor[storageKey][sourceId];",
					"const actor = this.actor;",
					...Pj(t)
				].join("\n")
			}]
		}
	};
}
//#endregion
//#region src/module/apps/effect-builders/functions/build.ts
function Lj(e) {
	let t = [];
	if (e.name.trim() || t.push("Enter an effect name."), e.kind === "age-height") return [...t, ...gj(e)];
	if (e.kind === "wounds") {
		try {
			pj(e.formula);
		} catch (e) {
			t.push(e instanceof Error ? e.message : String(e));
		}
		return t;
	}
	return e.recipe.lifetime === "linked-to-effect" && e.recipe.ownerAction === "delete-after-grant" && t.push("Self-removing source Items must grant copies that remain after the effect is removed."), e.kind === "grant" && !e.items.length && t.push("Add at least one Item to grant."), e.kind === "random" && !e.table && t.push("Choose a RollTable."), (e.kind === "random" || e.kind === "choice") && (!Number.isInteger(e.count) || e.count < 1 || e.count > 100) && t.push("Enter a whole number from 1 to 100."), e.kind === "choice" && ((!e.groups.length || e.groups.some((e) => !e.name.trim() || !e.items.length)) && t.push("Each choice needs a name and at least one Item."), e.count > e.groups.length && t.push("The number of choices exceeds the available options.")), t;
}
function Rj(e, t) {
	let n = Lj(e);
	if (n.length) throw Error(n.join(" "));
	let r = e.name.trim();
	if (e.kind === "age-height") return _j(e);
	if (e.kind === "wounds") return Ij(r, e.formula);
	let i = QA({
		effectName: r,
		flagScope: t,
		items: e.items,
		recipe: e.recipe
	});
	if (e.kind === "grant") return i;
	let a = e.kind === "random" ? hj(e.table.uuid, e.count) : mj(r, e.groups, e.count);
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
				script: YA(a, e.recipe)
			}]
		}
	};
}
//#endregion
//#region src/module/apps/effect-builders/state/index.ts
function zj(e) {
	return gu(`effect-builder:${e}`, () => {
		let e = /* @__PURE__ */ z(JA("wounds")), t = /* @__PURE__ */ z(null), n = /* @__PURE__ */ z(""), r = /* @__PURE__ */ z(""), i = /* @__PURE__ */ z(!1), a = /* @__PURE__ */ z(!1), o = /* @__PURE__ */ z(!1), s, c = $(() => Lj(e.value)), l = $(() => !!t.value && !c.value.length && !i.value && !a.value);
		function u(n, r, i) {
			s = r, !o.value && (e.value = JA(n), t.value = i, o.value = !0);
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
	})(cC);
}
//#endregion
//#region src/module/apps/shared/view/components/ApplicationShell.vue?vue&type=script&setup=true&lang.ts
var Bj = ["aria-label"], Vj = { class: "dui-card-body" }, Hj = { class: "dui-card-title" }, Uj = { key: 0 }, Wj = {
	key: 0,
	class: "dui-card-actions"
}, Gj = /* @__PURE__ */ U({
	__name: "ApplicationShell",
	props: {
		description: {},
		title: {}
	},
	setup(e) {
		return (t, n) => (K(), q("section", {
			"aria-label": e.title,
			class: "dui-card"
		}, [Y("div", Vj, [
			Y("header", null, [
				Y("h1", Hj, F(e.title), 1),
				e.description ? (K(), q("p", Uj, F(e.description), 1)) : Q("", !0),
				So(t.$slots, "header")
			]),
			So(t.$slots, "default"),
			t.$slots.actions ? (K(), q("div", Wj, [So(t.$slots, "actions")])) : Q("", !0)
		])], 8, Bj));
	}
}), Kj = { class: "dui-list" }, qj = { class: "dui-list-col-grow" }, Jj = ["aria-label", "onClick"], Yj = /* @__PURE__ */ U({
	__name: "SourceItems",
	props: {
		items: {},
		title: {}
	},
	emits: ["dropData", "remove"],
	setup(e) {
		return (t, n) => (K(), q(G, null, [X(Mv, {
			title: e.title,
			description: "Drop an Item to add it to this list.",
			variant: "compact",
			onDropData: n[0] ||= (e) => t.$emit("dropData", e)
		}, null, 8, ["title"]), Y("ul", Kj, [(K(!0), q(G, null, W(e.items, (e) => (K(), q("li", {
			key: e.uuid,
			class: "dui-list-row"
		}, [Y("span", qj, F(e.name), 1), Y("button", {
			type: "button",
			class: "dui-btn dui-btn-sm dui-btn-ghost",
			"aria-label": `Remove ${e.name}`,
			onClick: (n) => t.$emit("remove", e.uuid)
		}, " Remove ", 8, Jj)]))), 128))])], 64));
	}
}), Xj = { class: "dui-fieldset" }, Zj = ["for"], Qj = ["id", "max"], $j = { class: "dui-fieldset-legend" }, eM = ["for"], tM = ["id", "onUpdate:modelValue"], nM = ["onClick"], rM = /* @__PURE__ */ U({
	__name: "ChoiceOptions",
	props: { id: {} },
	setup(e) {
		let t = e, n = zj(t.id), r = `${t.id}-${Xa()}`;
		return (e, t) => (K(), q("fieldset", Xj, [
			t[2] ||= Y("legend", { class: "dui-fieldset-legend" }, "Player choices", -1),
			Y("label", {
				for: `${r}-count`,
				class: "dui-label"
			}, "Number of options to choose", 8, Zj),
			H(Y("input", {
				id: `${r}-count`,
				"onUpdate:modelValue": t[0] ||= (e) => B(n).draft.count = e,
				"aria-label": "Number of options to choose",
				type: "number",
				min: "1",
				max: B(n).draft.groups.length || 1,
				step: "1",
				class: "dui-input"
			}, null, 8, Qj), [[
				bl,
				B(n).draft.count,
				void 0,
				{ number: !0 }
			]]),
			t[3] ||= Y("p", null, "Each option can grant one Item or a whole package.", -1),
			(K(!0), q(G, null, W(B(n).draft.groups, (e, t) => (K(), q("fieldset", {
				key: t,
				class: "dui-fieldset"
			}, [
				Y("legend", $j, "Option " + F(t + 1), 1),
				Y("label", {
					for: `${r}-${t}`,
					class: "dui-label"
				}, "Option name", 8, eM),
				H(Y("input", {
					id: `${r}-${t}`,
					"onUpdate:modelValue": (t) => e.name = t,
					"aria-label": "Option name",
					class: "dui-input app:w-full"
				}, null, 8, tM), [[bl, e.name]]),
				X(Yj, {
					items: e.items,
					title: `Items for option ${t + 1}`,
					onDropData: (e) => B(n).dropItem(e, t),
					onRemove: (e) => B(n).removeItem(e, t)
				}, null, 8, [
					"items",
					"title",
					"onDropData",
					"onRemove"
				]),
				Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm dui-btn-ghost",
					onClick: (e) => B(n).draft.groups.splice(t, 1)
				}, " Remove option ", 8, nM)
			]))), 128)),
			Y("button", {
				type: "button",
				class: "dui-btn",
				onClick: t[1] ||= (...e) => B(n).addGroup && B(n).addGroup(...e)
			}, "Add option")
		]));
	}
}), iM = { class: "dui-fieldset" }, aM = ["for"], oM = ["id", "value"], sM = {
	key: 0,
	class: "dui-label"
}, cM = /* @__PURE__ */ U({
	__name: "GrantOptions",
	props: { id: {} },
	setup(e) {
		let t = e, n = zj(t.id), r = `${t.id}-${Xa()}`;
		return (e, t) => (K(), q("fieldset", iM, [
			t[4] ||= Y("legend", { class: "dui-fieldset-legend" }, "Granted Items", -1),
			Y("label", {
				for: `${r}-lifetime`,
				class: "dui-label"
			}, "When the effect is removed", 8, aM),
			Y("select", {
				id: `${r}-lifetime`,
				"aria-label": "When the effect is removed",
				class: "dui-select app:w-full",
				value: B(n).draft.recipe.lifetime,
				onChange: t[0] ||= (e) => B(n).setLifetime(e.target.value)
			}, [...t[2] ||= [Y("option", { value: "linked-to-effect" }, "Remove the granted Items too", -1), Y("option", { value: "detached" }, "Keep the granted Items", -1)]], 40, oM),
			B(n).draft.recipe.lifetime === "detached" ? (K(), q("label", sM, [H(Y("input", {
				"onUpdate:modelValue": t[1] ||= (e) => B(n).draft.recipe.ownerAction = e,
				type: "checkbox",
				class: "dui-checkbox",
				"true-value": "delete-after-grant",
				"false-value": "keep"
			}, null, 512), [[xl, B(n).draft.recipe.ownerAction]]), t[3] ||= Z(" Remove the source Item after a successful grant ", -1)])) : Q("", !0)
		]));
	}
}), lM = { class: "dui-fieldset" }, uM = ["for"], dM = ["id", "aria-describedby"], fM = ["id"], pM = ["for"], mM = ["id", "aria-describedby"], hM = ["id"], gM = /* @__PURE__ */ U({
	__name: "AgeHeightFormula",
	props: { id: {} },
	setup(e) {
		let t = e, n = zj(t.id), r = `${t.id}-${Xa()}`;
		return (e, t) => (K(), q("fieldset", lM, [
			t[4] ||= Y("legend", { class: "dui-fieldset-legend" }, "Age and height formulas", -1),
			Y("label", {
				for: `${r}-age`,
				class: "dui-label"
			}, "Age formula (years)", 8, uM),
			H(Y("input", {
				id: `${r}-age`,
				"onUpdate:modelValue": t[0] ||= (e) => B(n).draft.ageFormula = e,
				"aria-label": "Age formula (years)",
				type: "text",
				class: "dui-input dui-input-sm app:w-full",
				placeholder: "15 + 1d10",
				"aria-describedby": `${r}-age-help`
			}, null, 8, dM), [[bl, B(n).draft.ageFormula]]),
			Y("p", { id: `${r}-age-help` }, [...t[2] ||= [
				Z("For example, ", -1),
				Y("code", null, "15 + 1d10", -1),
				Z(" gives 16–25 years.", -1)
			]], 8, fM),
			Y("label", {
				for: `${r}-height`,
				class: "dui-label"
			}, "Height formula (total inches)", 8, pM),
			H(Y("input", {
				id: `${r}-height`,
				"onUpdate:modelValue": t[1] ||= (e) => B(n).draft.heightFormula = e,
				"aria-label": "Height formula (total inches)",
				type: "text",
				class: "dui-input dui-input-sm app:w-full",
				placeholder: "57 + 2d10",
				"aria-describedby": `${r}-height-help`
			}, null, 8, mM), [[bl, B(n).draft.heightFormula]]),
			Y("p", { id: `${r}-height-help` }, [...t[3] ||= [
				Z(" 12 inches = 1 foot. ", -1),
				Y("code", null, "57 + 2d10", -1),
				Z(" gives 4′11″–6′5″. ", -1)
			]], 8, hM),
			t[5] ||= Y("p", null, " Enter one or both formulas. Leave a field blank to leave that detail unchanged. Use whole-number results; height must be positive. ", -1),
			t[6] ||= Y("p", null, " Character creation uses these formulas. Adding the Item to an actor rolls only missing details and keeps existing values. ", -1)
		]));
	}
}), _M = /* @__PURE__ */ "@sb.@tb.@wpb.@sbMultiplier.@tbMultiplier.@wpbMultiplier.@scale.@size.@age.@height.@weight.@status.@rank.@xp.@fate.@fortune.@resilience.@resolve.@corruption.@sin.@advantage.@bleeding.@poisoned.@ablaze.@deafened.@stunned.@entangled.@fatigued.@blinded.@broken".split("."), vM = { class: "dui-fieldset" }, yM = { class: "dui-collapse dui-collapse-arrow" }, bM = { class: "dui-collapse-content" }, xM = { class: "app:flex app:flex-wrap app:gap-1" }, SM = ["onClick", "onDragstart"], CM = /* @__PURE__ */ U({
	__name: "WoundFormula",
	props: { id: {} },
	setup(e) {
		let t = e, n = zj(t.id), r = `${t.id}-${Xa()}`, i = /* @__PURE__ */ z(), a = [
			..._M,
			"{Strength}",
			"[Toughness]",
			"{Endurance}",
			"[Endurance]"
		];
		async function o(e) {
			let t = i.value, r = t?.selectionStart ?? n.draft.formula.length, a = t?.selectionEnd ?? r;
			n.draft.formula = `${n.draft.formula.slice(0, r)}${e}${n.draft.formula.slice(a)}`, await wa(), t?.focus(), t?.setSelectionRange(r + e.length, r + e.length);
		}
		return (e, t) => (K(), q("fieldset", vM, [
			t[5] ||= Y("legend", { class: "dui-fieldset-legend" }, "Wound calculation", -1),
			Y("label", {
				for: r,
				class: "dui-label"
			}, "Formula"),
			H(Y("textarea", {
				id: r,
				ref_key: "textarea",
				ref: i,
				"onUpdate:modelValue": t[0] ||= (e) => B(n).draft.formula = e,
				"aria-label": "Formula",
				class: "dui-textarea app:w-full",
				rows: "3",
				onDragover: t[1] ||= kl(() => {}, ["prevent"]),
				onDrop: t[2] ||= kl((e) => o(e.dataTransfer?.getData("text/plain") ?? ""), ["prevent"])
			}, null, 544), [[bl, B(n).draft.formula]]),
			t[6] ||= tc("<p> Use <code>{Name}</code> for a characteristic or Skill total and <code>[Name]</code> for its bonus. For example: <code>[Endurance] + 2 * @tb</code>. </p><p><code>{Endurance|Strength}</code> uses Strength for that Skill. Arithmetic and <code>Math.floor</code>, <code>Math.ceil</code>, <code>Math.min</code>, and <code>Math.max</code> are supported. </p>", 2),
			Y("details", yM, [t[4] ||= Y("summary", { class: "dui-collapse-title" }, "Insert formula tokens", -1), Y("div", bM, [t[3] ||= Y("p", null, "Click a token to insert it at the cursor, or drag it into the formula.", -1), Y("div", xM, [(K(), q(G, null, W(a, (e) => Y("button", {
				key: e,
				type: "button",
				class: "dui-btn dui-btn-xs",
				draggable: "true",
				onClick: (t) => o(e),
				onDragstart: (t) => t.dataTransfer?.setData("text/plain", e)
			}, F(e), 41, SM)), 64))])])])
		]));
	}
}), wM = {
	key: 0,
	role: "alert",
	class: "dui-alert dui-alert-error"
}, TM = {
	key: 1,
	role: "status",
	class: "dui-alert dui-alert-success"
}, EM = ["disabled"], DM = ["for"], OM = ["id"], kM = {
	key: 3,
	class: "dui-fieldset"
}, AM = ["for"], jM = ["id"], MM = {
	key: 2,
	class: "dui-list",
	"aria-label": "To finish this effect"
}, NM = { class: "app:flex app:flex-wrap app:gap-2" }, PM = ["disabled"], FM = ["disabled"], IM = /* @__PURE__ */ U({
	__name: "EffectBuilderApp",
	props: {
		id: {},
		kind: {},
		destination: {},
		bridge: {},
		close: { type: Function }
	},
	setup(e) {
		let t = e, n = zj(t.id);
		n.configure(t.kind, t.bridge, t.destination);
		let r = `${t.id}-${Xa()}`, i = qA.find((e) => e.kind === t.kind);
		return (t, a) => (K(), J(Gj, {
			title: `${B(i).title} Effect Builder`,
			description: B(i).description
		}, {
			default: V(() => [
				B(n).error ? (K(), q("div", wM, F(B(n).error), 1)) : Q("", !0),
				B(n).message ? (K(), q("div", TM, F(B(n).message), 1)) : Q("", !0),
				Y("fieldset", {
					class: "dui-fieldset",
					disabled: B(n).busy || B(n).created
				}, [
					X(Mv, {
						title: "Destination Item",
						description: "Drop the Item that will receive this effect.",
						documents: B(n).destination ? [B(n).destination] : [],
						"show-documents": "",
						variant: "compact",
						onDropData: B(n).dropDestination
					}, null, 8, ["documents", "onDropData"]),
					Y("label", {
						for: `${r}-name`,
						class: "dui-label"
					}, "Effect name", 8, DM),
					H(Y("input", {
						id: `${r}-name`,
						"onUpdate:modelValue": a[0] ||= (e) => B(n).draft.name = e,
						"aria-label": "Effect name",
						class: "dui-input app:w-full"
					}, null, 8, OM), [[bl, B(n).draft.name]]),
					e.kind === "wounds" ? (K(), J(CM, {
						key: 0,
						id: e.id
					}, null, 8, ["id"])) : e.kind === "age-height" ? (K(), J(gM, {
						key: 1,
						id: e.id
					}, null, 8, ["id"])) : e.kind === "grant" ? (K(), J(Yj, {
						key: 2,
						title: "Items to grant",
						items: B(n).draft.items,
						onDropData: a[1] ||= (e) => B(n).dropItem(e),
						onRemove: a[2] ||= (e) => B(n).removeItem(e)
					}, null, 8, ["items"])) : e.kind === "random" ? (K(), q("fieldset", kM, [
						a[7] ||= Y("legend", { class: "dui-fieldset-legend" }, "Random selection", -1),
						X(Mv, {
							title: "Grant RollTable",
							description: "Use document results pointing to Items or nested RollTables.",
							documents: B(n).draft.table ? [B(n).draft.table] : [],
							"show-documents": "",
							variant: "compact",
							onDropData: B(n).dropTable
						}, null, 8, ["documents", "onDropData"]),
						Y("label", {
							for: `${r}-rolls`,
							class: "dui-label"
						}, "Number of rolls", 8, AM),
						H(Y("input", {
							id: `${r}-rolls`,
							"onUpdate:modelValue": a[3] ||= (e) => B(n).draft.count = e,
							"aria-label": "Number of rolls",
							type: "number",
							min: "1",
							max: "100",
							step: "1",
							class: "dui-input"
						}, null, 8, jM), [[
							bl,
							B(n).draft.count,
							void 0,
							{ number: !0 }
						]]),
						a[8] ||= Y("p", null, " Rolls leave results available for future rolls. An Item may be granted more than once. ", -1)
					])) : (K(), J(rM, {
						key: 4,
						id: e.id
					}, null, 8, ["id"])),
					e.kind !== "wounds" && e.kind !== "age-height" ? (K(), J(cM, {
						key: 5,
						id: e.id
					}, null, 8, ["id"])) : Q("", !0)
				], 8, EM),
				!B(n).created && B(n).problems.length ? (K(), q("ul", MM, [(K(!0), q(G, null, W(B(n).problems, (e) => (K(), q("li", { key: e }, F(e), 1))), 128))])) : Q("", !0),
				Y("div", NM, [
					B(n).created ? Q("", !0) : (K(), q("button", {
						key: 0,
						type: "button",
						class: "dui-btn dui-btn-primary",
						disabled: !B(n).ready,
						onClick: a[4] ||= (...e) => B(n).create && B(n).create(...e)
					}, F(B(n).busy ? "Working…" : "Add effect to Item"), 9, PM)),
					B(n).destination ? (K(), q("button", {
						key: 1,
						type: "button",
						class: "dui-btn",
						onClick: a[5] ||= (...e) => B(n).openDestination && B(n).openDestination(...e)
					}, " Open destination Item ")) : Q("", !0),
					Y("button", {
						type: "button",
						class: "dui-btn dui-btn-ghost",
						disabled: B(n).busy,
						onClick: a[6] ||= (...t) => e.close && e.close(...t)
					}, F(B(n).created ? "Done" : "Cancel"), 9, FM)
				])
			]),
			_: 1
		}, 8, ["title", "description"]));
	}
});
//#endregion
//#region src/module/wfrp/effect-builders/bridge.ts
async function LM(t, n) {
	let r = UA(await fromUuid(t)), i = Rj(n, e);
	if (n.kind === "age-height") {
		let e = Ee(ce(r.toObject().effects));
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
		Xe(await fromUuid(e.uuid), `The granted Item ${e.name} is no longer available.`);
	}
	if (n.kind === "random" && await KA(n.table.uuid, t), !r.createEmbeddedDocuments) throw Error("This Item cannot contain Active Effects.");
	await r.createEmbeddedDocuments("ActiveEffect", [i]);
}
var RM = {
	resolveItem: WA,
	async resolveTable(e) {
		return GA(await HA(e));
	},
	create: LM,
	async openItem(e) {
		Xe(await fromUuid(e)).sheet?.render(!0);
	}
}, zM = 0, BM = class extends SC {
	kind;
	destination;
	storeId;
	constructor(t, n = null) {
		let r = `${e}-effect-${++zM}`;
		super({
			id: r,
			window: { title: `${qA.find((e) => e.kind === t).title} Effect Builder` }
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
		return IM;
	}
	getVueProps() {
		return {
			id: this.storeId,
			kind: this.kind,
			destination: this.destination,
			bridge: RM,
			close: () => this.close()
		};
	}
	async _preClose(e) {
		let t = zj(this.storeId);
		await super._preClose(e), t.$dispose(), delete cC.state.value[`effect-builder:${this.storeId}`];
	}
}, VM = { key: 0 }, HM = { class: "dui-list" }, UM = { class: "dui-list-col-grow" }, WM = ["aria-label", "onClick"], GM = /* @__PURE__ */ U({
	__name: "EffectBuildersApp",
	props: {
		destination: {},
		openBuilder: { type: Function }
	},
	setup(e) {
		return (t, n) => (K(), J(Gj, {
			title: "Effect Builders",
			description: "Choose an effect to create, then select the Item that will carry it."
		}, {
			default: V(() => [
				e.destination ? (K(), q("p", VM, [n[0] ||= Z(" Destination: ", -1), Y("strong", null, F(e.destination.name), 1)])) : Q("", !0),
				Y("ul", HM, [(K(!0), q(G, null, W(B(qA), (t) => (K(), q("li", {
					key: t.kind,
					class: "dui-list-row"
				}, [Y("div", UM, [Y("strong", null, F(t.title), 1), Y("p", null, F(t.description), 1)]), Y("button", {
					type: "button",
					class: "dui-btn",
					"aria-label": `Open ${t.title} Effect Builder`,
					onClick: (n) => e.openBuilder(t.kind)
				}, " Open ", 8, WM)]))), 128))]),
				n[1] ||= Y("p", null, "Find this launcher and individual shortcuts in the Effect Builders macro compendium.", -1)
			]),
			_: 1
		}));
	}
}), KM = class extends SC {
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
		return GM;
	}
	getVueProps() {
		return {
			destination: this.destination,
			openBuilder: (e) => new BM(e, this.destination).render(!0)
		};
	}
};
//#endregion
//#region src/module/wfrp/effect-builders/open.ts
async function qM(e) {
	let t = new KM();
	e && (t.destination = VA(UA(await fromUuid(e)))), await t.render(!0);
}
async function JM(e, t) {
	await new BM(e, t ? VA(UA(await fromUuid(t))) : null).render(!0);
}
var YM = (e) => JM("wounds", e), XM = (e) => JM("grant", e), ZM = (e) => JM("random", e), QM = (e) => JM("choice", e), $M = (e) => JM("age-height", e), eN = { key: 0 }, tN = ["disabled"], nN = { class: "dui-fieldset-legend" }, rN = {
	key: 0,
	class: "app:flex app:flex-wrap app:gap-2"
}, iN = { key: 1 }, aN = {
	key: 2,
	class: "app:max-w-full app:overflow-x-auto"
}, oN = { class: "dui-table dui-table-sm" }, sN = ["onClick"], cN = { class: "app:flex app:flex-wrap app:gap-2" }, lN = ["onClick"], uN = ["aria-label", "onClick"], dN = /* @__PURE__ */ U({
	__name: "SpeciesItemEffects",
	props: {
		uuid: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = Uk(e.uuid), n = $(() => [
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
		return (r, i) => (K(), q(G, null, [B(t).dirty ? (K(), q("p", eN, "Save or reload Item changes before editing effects.")) : Q("", !0), (K(!0), q(G, null, W(n.value, (n) => (K(), q(G, { key: n.name }, [n.entries.length || n.name === "Effects" ? (K(), q("fieldset", {
			key: 0,
			class: "dui-fieldset",
			disabled: !e.editable || B(t).dirty
		}, [
			Y("legend", nN, F(n.name), 1),
			n.name === "Effects" ? (K(), q("div", rN, [Y("button", {
				type: "button",
				class: "dui-btn dui-btn-sm",
				onClick: i[0] ||= (e) => B(t).effectAction("create")
			}, " Add Effect "), Y("button", {
				type: "button",
				class: "dui-btn dui-btn-sm",
				onClick: i[1] ||= (t) => B(qM)(e.uuid)
			}, " Effect Builders ")])) : Q("", !0),
			n.entries.length ? Q("", !0) : (K(), q("p", iN, "No effects.")),
			n.entries.length ? (K(), q("div", aN, [Y("table", oN, [i[2] ||= Y("thead", null, [Y("tr", null, [
				Y("th", { scope: "col" }, "Effect"),
				Y("th", { scope: "col" }, "Type"),
				Y("th", { scope: "col" }, [Y("span", { class: "app:sr-only" }, "Actions")])
			])], -1), Y("tbody", null, [(K(!0), q(G, null, W(n.entries, (e) => (K(), q("tr", { key: e.id }, [
				Y("td", null, [Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm dui-btn-ghost app:h-auto app:whitespace-normal",
					onClick: (n) => B(t).effectAction("edit", e.id)
				}, F(e.name), 9, sN)]),
				Y("td", null, F(e.type), 1),
				Y("td", null, [Y("div", cN, [Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					onClick: (n) => B(t).effectAction("toggle", e.id)
				}, F(e.disabled ? "Enable" : "Disable"), 9, lN), Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					"aria-label": `Delete ${e.name}`,
					onClick: (n) => B(t).effectAction("delete", e.id)
				}, " Delete ", 8, uN)])])
			]))), 128))])])])) : Q("", !0)
		], 8, tN)) : Q("", !0)], 64))), 128))], 64));
	}
}), fN = { class: "app:flex app:items-center app:gap-3" }, pN = ["disabled"], mN = { class: "dui-avatar" }, hN = { class: "app:w-20" }, gN = ["src"], _N = { class: "app:min-w-0 app:flex-1" }, vN = ["disabled"], yN = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, bN = {
	class: "dui-tabs dui-tabs-border",
	role: "tablist",
	"aria-label": "Species Item"
}, xN = [
	"id",
	"aria-selected",
	"aria-controls"
], SN = [
	"id",
	"aria-selected",
	"aria-controls"
], CN = [
	"id",
	"aria-selected",
	"aria-controls"
], wN = { class: "app:min-h-0 app:min-w-0 app:flex-1 app:overflow-y-auto" }, TN = ["id", "aria-labelledby"], EN = ["id", "aria-labelledby"], DN = ["id", "aria-labelledby"], ON = { class: "app:flex app:flex-wrap app:items-center app:gap-2" }, kN = ["disabled"], AN = ["disabled"], jN = {
	class: "app:text-sm",
	role: "status"
}, MN = /* @__PURE__ */ U({
	__name: "SpeciesItemApp",
	props: {
		uuid: {},
		editable: { type: Boolean },
		bridge: {}
	},
	setup(e) {
		let t = e, n = Uk(t.uuid);
		return n.configure(t.bridge), (t, r) => (K(), q("form", {
			class: "app:flex app:h-full app:min-w-0 app:flex-col app:gap-2",
			onSubmit: r[6] ||= kl((e) => B(n).save(), ["prevent"])
		}, [
			Y("header", fN, [Y("button", {
				type: "button",
				class: "dui-btn dui-btn-outline app:h-auto",
				"aria-label": "Choose Species image",
				disabled: !e.editable || B(n).isSaving,
				onClick: r[0] ||= (e) => B(n).chooseImage()
			}, [Y("div", mN, [Y("div", hN, [Y("img", {
				src: B(n).draft.img,
				alt: "Species image",
				width: "80",
				height: "80",
				class: "app:object-contain"
			}, null, 8, gN)])])], 8, pN), Y("label", _N, [r[7] ||= Y("span", { class: "app:sr-only" }, "Name", -1), H(Y("input", {
				"onUpdate:modelValue": r[1] ||= (e) => B(n).draft.name = e,
				"aria-label": "Species name",
				class: "dui-input dui-input-ghost app:w-full app:text-center app:text-xl",
				disabled: !e.editable || !B(n).isLoaded || B(n).isSaving,
				required: ""
			}, null, 8, vN), [[bl, B(n).draft.name]])])]),
			B(n).error ? (K(), q("div", yN, F(B(n).error), 1)) : Q("", !0),
			Y("div", bN, [
				Y("button", {
					id: `${e.uuid}-description-tab`,
					type: "button",
					role: "tab",
					class: P(["dui-tab app:flex-1", { "dui-tab-active": B(n).tab === "description" }]),
					"aria-selected": B(n).tab === "description",
					"aria-controls": `${e.uuid}-description-panel`,
					onClick: r[2] ||= (e) => B(n).tab = "description"
				}, " Description ", 10, xN),
				Y("button", {
					id: `${e.uuid}-details-tab`,
					type: "button",
					role: "tab",
					class: P(["dui-tab app:flex-1", { "dui-tab-active": B(n).tab === "details" }]),
					"aria-selected": B(n).tab === "details",
					"aria-controls": `${e.uuid}-details-panel`,
					onClick: r[3] ||= (e) => B(n).tab = "details"
				}, " Details ", 10, SN),
				Y("button", {
					id: `${e.uuid}-effects-tab`,
					type: "button",
					role: "tab",
					class: P(["dui-tab app:flex-1", { "dui-tab-active": B(n).tab === "effects" }]),
					"aria-selected": B(n).tab === "effects",
					"aria-controls": `${e.uuid}-effects-panel`,
					onClick: r[4] ||= (e) => B(n).tab = "effects"
				}, " Effects ", 10, CN)
			]),
			Y("div", wN, [
				H(Y("section", {
					id: `${e.uuid}-description-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-description-tab`
				}, [B(n).isLoaded ? (K(), J(RA, {
					key: B(n).revision,
					uuid: e.uuid,
					editable: e.editable
				}, null, 8, ["uuid", "editable"])) : Q("", !0)], 8, TN), [[Vc, B(n).tab === "description"]]),
				H(Y("section", {
					id: `${e.uuid}-details-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-details-tab`
				}, [X(FA, {
					uuid: e.uuid,
					editable: e.editable && B(n).isLoaded && !B(n).isSaving
				}, null, 8, ["uuid", "editable"])], 8, EN), [[Vc, B(n).tab === "details"]]),
				H(Y("section", {
					id: `${e.uuid}-effects-panel`,
					role: "tabpanel",
					"aria-labelledby": `${e.uuid}-effects-tab`
				}, [X(dN, {
					uuid: e.uuid,
					editable: e.editable && B(n).isLoaded && !B(n).isSaving
				}, null, 8, ["uuid", "editable"])], 8, DN), [[Vc, B(n).tab === "effects"]])
			]),
			Y("footer", ON, [
				Y("button", {
					type: "submit",
					class: "dui-btn dui-btn-sm dui-btn-primary",
					disabled: !e.editable || !B(n).isLoaded || B(n).isSaving
				}, " Save Item ", 8, kN),
				Y("button", {
					type: "button",
					class: "dui-btn dui-btn-sm",
					disabled: B(n).isSaving,
					onClick: r[5] ||= (e) => B(n).reload()
				}, " Reload Item ", 8, AN),
				Y("span", jN, F(B(n).dirty ? "Unsaved changes" : B(n).message || "Saved"), 1)
			])
		], 32));
	}
});
//#endregion
//#region src/module/wfrp/species-item/editing.ts
function NN(e) {
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
async function PN(e, t, n) {
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
function FN(e, t) {
	new foundry.applications.apps.FilePicker.implementation({
		type: "image",
		current: e,
		callback: t
	}).render(!0);
}
//#endregion
//#region src/module/wfrp/species-item/notes.ts
function IN(e) {
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
async function LN(e) {
	if (!e.uuid && !e.id) return null;
	let t = De(e, be()) ?? (e.uuid ? await fromUuid(e.uuid) : void 0);
	if (!p(t) || typeof t.type != "string" || !ue({ type: t.type }) || typeof t.toObject != "function") throw Error("The parent Species Item could not be resolved.");
	let n = t.toObject.call(t);
	if (!p(n)) throw Error("The parent Species Item has no source data.");
	return fe(n.system);
}
//#endregion
//#region src/module/wfrp/species-item/bridge.ts
function RN(e) {
	let t = "", n = IN(e), r = () => {
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
		effects: () => NN(e),
		effectAction: (t, n) => PN(e, t, n),
		chooseImage: FN,
		mountNotes: n.mount,
		load: r,
		loadParent: LN,
		async save(n) {
			if (t !== JSON.stringify(e.toObject())) throw Error("This Item changed in another window. Reload its sheet before saving.");
			return await xe(e, n), r();
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
var zN = class extends foundry.applications.api.DocumentSheetV2 {
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
	#e = new xC();
	async _renderHTML(e, t) {
		return this.#e.createRoot();
	}
	_replaceHTML(e, t, n) {
		this.#e.mount(e, t, MN, {
			uuid: this.document.uuid,
			editable: this.isEditable && game.user?.isGM === !0,
			bridge: RN(this.document)
		});
	}
	async _preClose(e) {
		this.#e.unmount(), await super._preClose(e);
	}
};
//#endregion
//#region src/module/init/species-sheet.ts
function BN() {
	foundry.applications.apps.DocumentSheetConfig.registerSheet(Item, e, zN, {
		types: [le],
		makeDefault: !0,
		label: "Species Customizer"
	});
}
//#endregion
//#region src/module/wfrp/species-item/documents/model.ts
function VN() {
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
//#region src/module/apps/workbench/view/WorkbenchApp.vue?vue&type=script&setup=true&lang.ts
var HN = { class: "dui-list" }, UN = { class: "dui-list-row" }, WN = { class: "dui-list-row" }, GN = { class: "dui-list-row" }, KN = /* @__PURE__ */ U({
	__name: "WorkbenchApp",
	props: {
		openNpcBuilder: { type: Function },
		openEffectBuilders: { type: Function },
		openSpeciesTableEditor: { type: Function }
	},
	setup(e) {
		return (t, n) => (K(), J(Gj, {
			description: "Open a focused WFRP4e authoring workflow.",
			title: "Customizer Workbench"
		}, {
			default: V(() => [Y("ul", HN, [
				Y("li", UN, [n[3] ||= Y("div", { class: "dui-list-col-grow" }, [Y("strong", null, "NPC Builder"), Y("p", null, "Build an NPC from a base Actor, Careers, traits, trappings, and spells.")], -1), Y("button", {
					"aria-label": "Open NPC Builder",
					class: "dui-btn dui-btn-primary",
					type: "button",
					onClick: n[0] ||= (...t) => e.openNpcBuilder && e.openNpcBuilder(...t)
				}, " Open ")]),
				Y("li", WN, [n[4] ||= Y("div", { class: "dui-list-col-grow" }, [Y("strong", null, "Effect Builders"), Y("p", null, "Create wound formulas, Item grants, random grants, and player choices as effects.")], -1), Y("button", {
					"aria-label": "Open Effect Builders",
					class: "dui-btn",
					type: "button",
					onClick: n[1] ||= (...t) => e.openEffectBuilders && e.openEffectBuilders(...t)
				}, " Open ")]),
				Y("li", GN, [n[5] ||= Y("div", { class: "dui-list-col-grow" }, [Y("strong", null, "Species Table Editor"), Y("p", null, "Drop Species Items into the world's species roll table and adjust their chances.")], -1), Y("button", {
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
function qN(e, t) {
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
function JN(e, t) {
	let n = vt(e, t, !0);
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
function YN(e) {
	return gu(`species-table:${e}`, () => {
		let e = /* @__PURE__ */ z({
			..._t(),
			rows: []
		}), t = /* @__PURE__ */ z([]), n = /* @__PURE__ */ z(""), r = /* @__PURE__ */ z(!1), i = /* @__PURE__ */ z(!1), a = /* @__PURE__ */ z(""), o = /* @__PURE__ */ z(""), s = /* @__PURE__ */ z(!0), c = /* @__PURE__ */ z(""), l, u = $(() => JN(e.value, t.value)), d = $(() => yt(e.value.rows)), f = $(() => e.value.rows.reduce((e, t) => e + Number(t.weight || 0), 0)), p = $(() => t.value.filter((t) => !e.value.rows.some((e) => e.speciesKey === t.key))), m = $(() => i.value && !r.value && !u.value.length);
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
				qN(e.value, r);
				let i = t.value.findIndex((e) => e.key === r.option.key);
				i === -1 ? t.value.push(r.option) : t.value[i] = r.option, o.value = r.message;
			});
		}
		async function b() {
			let n = t.value.find((e) => e.key === c.value);
			n && (n.itemUuid ? await y(JSON.stringify({ uuid: n.itemUuid })) : qN(e.value, {
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
	})(cC);
}
//#endregion
//#region src/module/apps/species-table/view/SpeciesTableRows.vue?vue&type=script&setup=true&lang.ts
var XN = { class: "dui-fieldset app:min-w-0" }, ZN = { class: "app:max-w-full app:overflow-x-auto" }, QN = { class: "dui-table dui-table-sm" }, $N = { scope: "row" }, eP = { class: "app:sr-only" }, tP = ["onUpdate:modelValue", "aria-label"], nP = ["aria-label", "onClick"], rP = { key: 0 }, iP = /* @__PURE__ */ U({
	__name: "SpeciesTableRows",
	props: { id: {} },
	setup(e) {
		let t = YN(e.id), n = new Intl.NumberFormat(void 0, {
			style: "percent",
			maximumFractionDigits: 2
		});
		return (e, r) => (K(), q("fieldset", XN, [
			r[1] ||= Y("legend", { class: "dui-fieldset-legend" }, "Roll weights", -1),
			r[2] ||= Y("p", null, "A species with weight 2 is twice as likely as one with weight 1.", -1),
			Y("div", ZN, [Y("table", QN, [
				Y("caption", null, " Species chances · " + F(B(t).problems.length ? "Finish the entries to calculate a valid roll" : `Roll 1d${B(t).total}`), 1),
				r[0] ||= Y("thead", null, [Y("tr", null, [
					Y("th", { scope: "col" }, "Species"),
					Y("th", { scope: "col" }, "Weight"),
					Y("th", { scope: "col" }, "Chance"),
					Y("th", { scope: "col" }, "Range"),
					Y("th", { scope: "col" }, "Actions")
				])], -1),
				Y("tbody", null, [(K(!0), q(G, null, W(B(t).draft.rows, (e, r) => (K(), q("tr", { key: e.speciesKey || e.resultId || r }, [
					Y("th", $N, F(e.name || "Unassigned species"), 1),
					Y("td", null, [Y("label", null, [Y("span", eP, "Weight for " + F(e.name), 1), H(Y("input", {
						"onUpdate:modelValue": (t) => e.weight = t,
						"aria-label": `Weight for ${e.name}`,
						class: "dui-input dui-input-sm app:w-20",
						type: "number",
						min: "1",
						step: "1"
					}, null, 8, tP), [[
						bl,
						e.weight,
						void 0,
						{ number: !0 }
					]])])]),
					Y("td", null, F(B(t).problems.length ? "—" : B(n).format(B(t).summaries[r].chance)), 1),
					Y("td", null, F(B(t).problems.length ? "—" : B(t).summaries[r].range.join("–")), 1),
					Y("td", null, [Y("button", {
						type: "button",
						class: "dui-btn dui-btn-ghost dui-btn-sm",
						"aria-label": `Remove ${e.name}`,
						onClick: (e) => B(t).remove(r)
					}, " Remove ", 8, nP)])
				]))), 128))])
			])]),
			B(t).draft.rows.length ? Q("", !0) : (K(), q("p", rP, "Add a species or drop a Species Item to start."))
		]));
	}
}), aP = {
	key: 0,
	class: "dui-alert dui-alert-error",
	role: "alert"
}, oP = {
	key: 1,
	class: "dui-alert dui-alert-info",
	role: "status"
}, sP = {
	key: 2,
	role: "status"
}, cP = ["disabled"], lP = ["for"], uP = ["id"], dP = { key: 0 }, fP = { key: 1 }, pP = ["for"], mP = { class: "app:flex app:flex-wrap app:gap-2" }, hP = ["id"], gP = ["value"], _P = ["disabled"], vP = {
	key: 2,
	class: "dui-label"
}, yP = {
	key: 4,
	class: "dui-list",
	"aria-label": "Before saving"
}, bP = ["disabled"], xP = ["disabled"], SP = ["disabled"], CP = /* @__PURE__ */ U({
	__name: "SpeciesTableApp",
	props: {
		id: {},
		bridge: {},
		close: { type: Function }
	},
	setup(e) {
		let t = e, n = YN(t.id);
		return n.configure(t.bridge), fo(() => n.load()), (t, r) => (K(), J(Gj, {
			title: "Species Table Editor",
			description: "Choose which species can be rolled during character creation, and how often."
		}, {
			actions: V(() => [
				Y("button", {
					type: "button",
					class: "dui-btn dui-btn-primary",
					disabled: !B(n).ready,
					onClick: r[4] ||= (...e) => B(n).save && B(n).save(...e)
				}, " Save table ", 8, bP),
				Y("button", {
					type: "button",
					class: "dui-btn",
					disabled: B(n).busy,
					onClick: r[5] ||= (...e) => B(n).load && B(n).load(...e)
				}, " Reload saved table ", 8, xP),
				Y("button", {
					type: "button",
					class: "dui-btn dui-btn-ghost",
					disabled: B(n).busy,
					onClick: r[6] ||= (...t) => e.close && e.close(...t)
				}, " Close ", 8, SP)
			]),
			default: V(() => [
				B(n).error ? (K(), q("div", aP, F(B(n).error), 1)) : Q("", !0),
				B(n).message ? (K(), q("div", oP, F(B(n).message), 1)) : Q("", !0),
				B(n).busy ? (K(), q("p", sP, "Working…")) : Q("", !0),
				B(n).loaded ? (K(), q("fieldset", {
					key: 3,
					class: "dui-fieldset app:min-w-0",
					disabled: B(n).busy
				}, [
					Y("label", {
						for: `${e.id}-name`,
						class: "dui-label"
					}, "Table name", 8, lP),
					H(Y("input", {
						id: `${e.id}-name`,
						"onUpdate:modelValue": r[0] ||= (e) => B(n).draft.name = e,
						"aria-label": "Table name",
						class: "dui-input app:w-full"
					}, null, 8, uP), [[bl, B(n).draft.name]]),
					B(n).draft.ownership === "external" ? (K(), q("p", dP, " Saving creates a Customizer copy of this table. The source table is preserved. ")) : B(n).draft.isRegistered ? (K(), q("p", fP, "This is the world's active Species table.")) : Q("", !0),
					X(Mv, {
						title: "Species Items",
						description: "Drop a Species Item here. World and compendium Items are linked directly.",
						variant: "compact",
						disabled: B(n).busy,
						onDropData: B(n).drop
					}, null, 8, ["disabled", "onDropData"]),
					r[9] ||= Y("p", null, "A subspecies row selects that subspecies directly.", -1),
					Y("label", {
						for: `${e.id}-species`,
						class: "dui-label"
					}, "Add an available species", 8, pP),
					Y("div", mP, [H(Y("select", {
						id: `${e.id}-species`,
						"onUpdate:modelValue": r[1] ||= (e) => B(n).selected = e,
						"aria-label": "Add an available species",
						class: "dui-select app:max-w-full"
					}, [r[7] ||= Y("option", { value: "" }, "Choose a species…", -1), (K(!0), q(G, null, W(B(n).available, (e) => (K(), q("option", {
						key: e.key,
						value: e.key
					}, F(e.label), 9, gP))), 128))], 8, hP), [[Cl, B(n).selected]]), Y("button", {
						type: "button",
						class: "dui-btn",
						disabled: !B(n).selected,
						onClick: r[2] ||= (...e) => B(n).addSelected && B(n).addSelected(...e)
					}, " Add species ", 8, _P)]),
					X(iP, { id: e.id }, null, 8, ["id"]),
					!B(n).draft.isRegistered || B(n).draft.ownership === "external" ? (K(), q("label", vP, [H(Y("input", {
						"onUpdate:modelValue": r[3] ||= (e) => B(n).register = e,
						type: "checkbox",
						class: "dui-checkbox"
					}, null, 512), [[xl, B(n).register]]), r[8] ||= Z(" Use this table for the world's species rolls ", -1)])) : Q("", !0)
				], 8, cP)) : Q("", !0),
				B(n).loaded && B(n).problems.length ? (K(), q("ul", yP, [(K(!0), q(G, null, W(B(n).problems, (e) => (K(), q("li", { key: e }, F(e), 1))), 128))])) : Q("", !0)
			]),
			_: 1
		}));
	}
}), wP = "species", TP = "tableSettings";
async function EP(e) {
	let t = game.tables?.contents ?? [], n = DP(), r = OP(t, t.filter(Rt), n);
	return {
		draft: r ? kP(r, e, n[0] === r.id) : MP(),
		runtimeOptions: e
	};
}
function DP() {
	let e = game.settings.get(n, TP), t = p(e) ? e[wP] : void 0;
	return typeof t == "string" ? t.split(",").map((e) => e.trim()).filter(Boolean) : [];
}
function OP(e, t, r) {
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
	return e.find((e) => e.getFlag(n, "key") === wP);
}
function kP(e, t, n) {
	let r = e.toObject(), i = (Array.isArray(r.results) ? r.results : []).flatMap((e) => AP(e, t));
	return i.sort((e, t) => jP(e.source) - jP(t.source)), {
		isRegistered: n,
		name: e.name,
		ownership: Rt(e) ? "managed" : "external",
		requiresLinkRepair: i.some((e) => e.requiresLinkRepair),
		rows: i.map(({ row: e }) => e),
		tableId: e.id
	};
}
function AP(e, t) {
	if (!p(e)) return [];
	let r = h(e, ["name"]), i = xt(h(e, ["description"])), a = h(e, [
		"flags",
		n,
		"species"
	]), o = h(e, ["documentUuid"]), s = i?.label || r, c = bt(a, s, t), l = h(e, ["_id"]), u = h(e, ["type"]);
	return [{
		requiresLinkRepair: u === "document" ? !o : !i || i.label !== r.trim() || u !== "text",
		row: {
			...o || i ? { journalUuid: o || i.uuid } : {},
			name: s,
			...l ? { resultId: l } : {},
			speciesKey: c,
			weight: St(e)
		},
		source: e
	}];
}
function jP(e) {
	let t = m(e, ["range"]), n = Array.isArray(t) ? Number(t[0]) : 0;
	return Number.isInteger(n) ? n : 0;
}
function MP() {
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
var NP = !1;
function PP(e) {
	return JSON.stringify({
		table: e ? game.tables?.get(e)?.toObject() : null,
		settings: game.settings.get("wfrp4e", "tableSettings")
	});
}
async function FP() {
	Qe();
	let e = $e(), { draft: t } = await EP(e), n = [];
	for (let r of t.rows) {
		let t = r.journalUuid;
		if (t && (t.startsWith("Item.") || t.includes(".Item.") || r.speciesKey.startsWith("item:"))) {
			let i = await tt(t), a = {
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
		revision: PP(t.tableId)
	};
}
async function IP(e) {
	if ((await FP()).revision !== e) throw Error("The world's Species table or table settings changed. Reload the editor before saving.");
}
async function LP(e) {
	let t = $e();
	for (let n of e.rows) {
		if (!n.itemUuid) continue;
		let e = await rt(JSON.stringify({ uuid: n.itemUuid }));
		if (e.option.key !== n.speciesKey || e.option.label !== n.name) throw Error(`${n.name} changed. Reload the editor and drop the updated Species Item again.`);
		t.some((t) => t.key === e.option.key) || t.push(e.option);
	}
	let n = JN(e, t);
	if (n.length) throw Error(n.join("\n"));
}
async function RP(e, t, n) {
	if (Qe(), NP) throw Error("Another Species table save is in progress. Try again when it finishes.");
	NP = !0;
	try {
		await IP(t), await LP(e);
		let r = structuredClone(e);
		for (let e of r.rows) {
			if (!e.itemUuid) continue;
			let t = await tt(e.itemUuid);
			e.speciesKey = `item:${t.uuid}`, e.itemUuid = t.uuid, e.journalUuid = t.uuid, e.name = t.name;
		}
		await IP(t);
		let i = $e();
		for (let e of r.rows) e.itemUuid && !i.some((t) => t.key === e.speciesKey) && i.push({
			key: e.speciesKey,
			label: e.name,
			itemUuid: e.itemUuid
		});
		let a = JN(r, i);
		if (a.length) throw Error(a.join("\n"));
		let o = await It(r), s;
		if (n) try {
			await Lt(o.id);
		} catch (e) {
			s = e instanceof Error ? e.message : String(e);
		}
		return {
			...await FP(),
			...s ? { registrationError: s } : {}
		};
	} finally {
		NP = !1;
	}
}
var zP = {
	load: FP,
	resolveDrop: rt,
	save: RP
}, BP = 0, VP = class extends SC {
	storeId;
	constructor() {
		let t = `${e}-species-table-${++BP}`;
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
		return CP;
	}
	getVueProps() {
		return {
			id: this.storeId,
			bridge: zP,
			close: () => this.close()
		};
	}
	async _preClose(e) {
		let t = YN(this.storeId);
		await super._preClose(e), t.$dispose(), delete cC.state.value[`species-table:${this.storeId}`];
	}
};
async function HP() {
	Qe(), await new VP().render(!0);
}
//#endregion
//#region src/module/apps/workbench/view/WorkbenchApplication.ts
var UP = class extends SC {
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
		return KN;
	}
	getVueProps() {
		return {
			openNpcBuilder: () => new rO().render(!0),
			openEffectBuilders: () => qM(),
			openSpeciesTableEditor: HP
		};
	}
};
//#endregion
//#region src/module/foundry/register-module-menus.ts
function WP() {
	game.settings.registerMenu(e, "workbench", {
		hint: `Open the ${t} workbench.`,
		icon: "fa-solid fa-screwdriver-wrench",
		label: "Open Workbench",
		name: t,
		restricted: !0,
		type: UP
	}), game.settings.registerMenu(e, "npc-builder", {
		hint: "Build a WFRP4e NPC from a base Actor and Career items.",
		icon: "fa-solid fa-user-plus",
		label: "Open NPC Builder",
		name: "WFRP4e NPC Builder",
		restricted: !0,
		type: rO
	}), game.settings.registerMenu(e, "effect-builders", {
		hint: "Create native WFRP effects on your Items.",
		icon: "fa-solid fa-wand-magic-sparkles",
		label: "Open Effect Builders",
		name: "Effect Builders",
		restricted: !1,
		type: KM
	});
}
//#endregion
//#region src/module/foundry/register-module-settings.ts
function GP() {
	wT(), Jt();
}
//#endregion
//#region src/module/wfrp/item-effect-drops.ts
var KP = new Set(["talent", "trait"]), qP = /* @__PURE__ */ new WeakSet(), JP = !1, YP = "wfrp4e-customizer-grant-builder-button", XP = [
	"section[data-application-part=\"effects\"].active",
	"section[data-tab=\"effects\"].active",
	".tab[data-tab=\"effects\"].active",
	".tab.effects.active"
].join(","), ZP = [
	"section[data-application-part=\"effects\"]",
	"section[data-tab=\"effects\"]",
	".tab[data-tab=\"effects\"]",
	".tab.effects"
].join(",");
function QP() {
	JP || (JP = !0, Hooks.on("renderApplicationV2", (e, t) => {
		if (!(t instanceof HTMLElement)) return;
		let n = nF(e);
		!n || !KP.has(n.type) || ($P(n, t), eF(n, t));
	}));
}
function $P(e, t) {
	qP.has(t) || (qP.add(t), t.addEventListener("dragover", (e) => {
		rF(t, e.target) && (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"));
	}, !0), t.addEventListener("drop", (n) => {
		tF(e, t, n);
	}, !0));
}
function eF(e, t) {
	if (t.querySelector(`.${YP}`)) return;
	let n = aF(t, { includeInactive: !0 });
	if (!n) return;
	let r = document.createElement("div");
	r.classList.add("wfrp4e-customizer-grant-builder-toolbar");
	let i = document.createElement("button");
	i.type = "button", i.classList.add(YP), i.title = "Open Effect Builders for this Item", i.innerHTML = "<i class=\"fa-solid fa-sitemap\" aria-hidden=\"true\"></i><span>Effect Builders</span>", i.addEventListener("click", () => {
		qM(e.uuid);
	}), r.append(i), n.prepend(r);
}
async function tF(t, n, r) {
	if (!rF(n, r.target)) return;
	let i = zA(r);
	if (i) {
		r.preventDefault(), r.stopPropagation();
		try {
			let n = await BA(i);
			if (n.uuid === t.uuid) throw Error("An Item cannot grant itself.");
			let r = VA(n), a = QA({
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
function nF(e) {
	if (typeof e != "object" || !e) return null;
	let t = "item" in e ? e.item : void 0;
	if (Je(t)) return t;
	let n = "document" in e ? e.document : void 0;
	return Je(n) ? n : null;
}
function rF(e, t) {
	return !(t instanceof Element) || !e.contains(t) ? !1 : !!iF(e);
}
function iF(e) {
	return e.querySelector(XP) || aF(e, { includeInactive: !1 });
}
function aF(e, t) {
	return [...e.querySelectorAll(ZP)].find((e) => t.includeInactive || e.offsetParent !== null) ?? null;
}
//#endregion
//#region src/module/foundry/api/create-module-api.ts
function oF() {
	return {
		estimateNpcXp: ik,
		listNpcAutoAdvanceStrategies: Fp,
		openActorPortraitGallery: NO,
		async openNpcBuilder() {
			await new rO().render(!0);
		},
		createBuiltEffect: LM,
		openEffectBuilders: qM,
		openAgeHeightEffectBuilder: $M,
		openWoundFormulaEffectBuilder: YM,
		openItemGrantEffectBuilder: XM,
		openRandomItemEffectBuilder: ZM,
		openItemChoiceEffectBuilder: QM,
		openSpeciesTableEditor: HP,
		speciesTable: zP,
		async openWorkbench() {
			await new UP().render(!0);
		},
		selectChargenSpecies: on,
		registerNpcAutoAdvanceStrategy: Pp
	};
}
//#endregion
//#region src/module/foundry/api/register-module-api.ts
function sF() {
	if (!game) throw Error("Foundry game global is unavailable during module API registration.");
	let t = game.modules.get(e);
	if (!t) throw Error(`Foundry module registry entry was not found for ${e}.`);
	t.api = oF();
}
//#endregion
//#region src/module/init/register-hooks.ts
function cF() {
	Hooks.once("init", () => {
		On(`${e} | Initializing`), GP(), game.system.id === "wfrp4e" && (VN(), BN(), Dn(), BO(), uk(), Ce() || (Pk(), rn()), QP()), WP(), aO();
	}), Hooks.once("setup", i), Hooks.once("ready", () => {
		if (game.system.id !== "wfrp4e") {
			kn(`${e} | Loaded outside ${n}; skipping module API registration.`);
			return;
		}
		return lF();
	});
}
async function lF() {
	try {
		await we();
	} catch (t) {
		let n = t instanceof Error ? t.message : "Unknown runtime adaptation error.";
		throw kn(`${e} | Species Item migration failed: ${n}`), ui.notifications?.error(`Customizer initialization failed: ${n}`), t;
	}
	try {
		await f();
	} catch (t) {
		let n = t instanceof Error ? t.message : String(t);
		kn(`${e} | Compendium tidy failed: ${n}`), ui.notifications?.error(`Compendium folders could not be restored: ${n}`);
	}
	sF(), Yt(), UC().catch(() => {
		ui.notifications?.error("Career indexing failed. Adding a Career will retry the index.");
	}), sw(), On(`${e} | Ready`);
}
//#endregion
//#region src/module/init/index.ts
cF();
//#endregion

//# sourceMappingURL=wfrp4e-customizer-apps.mjs.map
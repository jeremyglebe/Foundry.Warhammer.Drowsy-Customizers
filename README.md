# Drowsy's WFRP4e Customizers

Build WFRP4e NPCs, define species, create reusable effects, and choose actor portraits with focused
in-game tools.

## What it does

- **NPC Builder:** start with a base Actor, add ordered Careers, choose advancements and trappings,
  and configure traits, spells, portrait suggestions, and an optional simplified mount profile. NPC
  sheets show species-relative XP estimates.
- **Species Items:** define species and subspecies as Items for character creation and Actor-sheet
  use. Included Core Species and optional Sample Species provide starting points.
- **Effect Builders:** create ordinary WFRP effects for age/height formulas, Wounds formulas, fixed
  Item grants, random grants from RollTables, and choices between Items or packages.
- **Species Table Editor:** drop Species Items into a weighted species RollTable.
- **Actor Portrait Gallery:** search shared portrait sources from an owned Actor sheet and apply a
  result to the portrait, prototype token, or both.
- **Customizer Workbench:** a launcher for NPC Builder, Effect Builders, and Species Table Editor.

## Installation

1. In Foundry's Setup screen, open **Add-on Modules → Install Module**.
2. Paste the manifest URL below into **Manifest URL**, then install.
3. Launch a WFRP4e world. Enable the module in **Manage Modules** and save.

```text
https://github.com/jeremyglebe/Foundry.Warhammer.Drowsy-Customizers/releases/latest/download/module.json
```

## Compatibility

- Package ID: `wfrp4e-customizer-apps`
- Package version: `3.0.4`
- Foundry VTT: minimum 13, verified 14
- Required system: wfrp4e

Use the release manifest's compatibility requirements when choosing a version. A verified Foundry
version is not a promise that every combination of companion modules has been tested.

The manifest requires WFRP4e but does not declare a minimum system version. These tools depend on
WFRP4e behavior and are not general-purpose builders for other game systems.

## First steps

### Open the tools

As a GM, go to the module's **Game Settings** and choose **Open Workbench**. You can also use **Open
NPC Builder**, or the **NPC Builder App** button in the Actor Directory.

**Open Effect Builders** is available in settings; editing still depends on your document
permissions. The **Effect Builders** compendium contains a launcher macro and individual builder
shortcuts. The **Customizer Macros** compendium includes the Species Table Editor shortcut.

### Try Species Items

Use **Core Species**, or choose optional examples from **Sample Species**. Sample descriptions link
to the **Sample Species Journals** compendium for context. Drop a Species Item into character
creation, or use a RollTable containing exclusively Species Item results.

The **Species Tables** compendium includes **Default Species** and the optional **All Species**
table. To opt in to All Species, import it and select it as the world's Species table; it rolls
equally among Core and ordinary Sample Species, excluding Gag Species.

Dropping a Species Item onto an Actor sheet offers starting characteristics and Movement. Review the
offered changes before applying them. The finished actor owns its Species Item and effects.

### Choose a portrait

Open the Portrait Gallery from an owned Actor sheet's header. Search results use the Actor's name,
species, Career, Career group, and class, plus configured portrait sources. Choose whether to update
the actor portrait, prototype token, or both.

## Existing worlds

The old Species Builder applications are retired. Saved settings and previously generated world
documents are preserved, but only Species Items contribute custom species configuration. Back up
your world before upgrades or changes to existing actors and species content.

## Releases and support

- [Latest release](https://github.com/jeremyglebe/Foundry.Warhammer.Drowsy-Customizers/releases/latest)
- [All releases](https://github.com/jeremyglebe/Foundry.Warhammer.Drowsy-Customizers/releases)
- [Report a problem](https://github.com/jeremyglebe/Foundry.Warhammer.Drowsy-Customizers/issues)

For a useful bug report, include your Foundry, WFRP4e, and module versions, relevant companion
versions, reproduction steps, and any console error. Avoid including private campaign data.

## About this repository

This repository contains installable release artifacts. Its README is generated from the project's
public documentation template during release preparation. Generated scripts, styles, compendiums,
and `module.json` should not be edited here.

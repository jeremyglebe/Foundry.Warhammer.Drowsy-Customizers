# Drowsy's WFRP4e Customizers

Vue-powered customization applications for the WFRP4e Foundry system.

## Installation

In Foundry VTT, open **Add-on Modules**, choose **Install Module**, and paste this manifest URL:

```text
https://github.com/jeremyglebe/Foundry.Warhammer.Drowsy-Customizers/releases/latest/download/module.json
```

The manifest URL becomes available after the first GitHub release is published. Before then, it may
return a not-found response even though this repository already exists.

## Compatibility

- Package ID: `wfrp4e-customizer-apps`
- Current version: `2.3.0`
- Foundry VTT: minimum 13, verified 14
- Required systems: wfrp4e

## Links

- [Latest release](https://github.com/jeremyglebe/Foundry.Warhammer.Drowsy-Customizers/releases/latest)
- [Foundry manifest](https://github.com/jeremyglebe/Foundry.Warhammer.Drowsy-Customizers/releases/latest/download/module.json)
- [Public artifact repository](https://github.com/jeremyglebe/Foundry.Warhammer.Drowsy-Customizers)

## Repository Contents

This public repository contains built, installable module artifacts. Development source, private
notes, and local tooling belong in the separate source repository.

```text
.
├── .github/workflows/release.yml  Packages tagged releases
├── lang/                          Compiled localization files, when present
├── packs/                         Compiled Foundry compendiums, when declared
├── scripts/                       Browser-ready package JavaScript
├── styles/                        Compiled package styles
├── module.json                    Foundry package manifest
└── README.md                      Installation and compatibility information
```

Do not edit generated scripts, styles, packs, or `module.json` directly in this repository. They are
replaced from the private source build during release preparation.

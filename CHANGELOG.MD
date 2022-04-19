# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.7] - 19.04.2022.

### Added

- CLI ignore config flag on api generator
- CLI ignore config flag on router generator
- CLI ignore config flag on component generator
- CLI ignore config flag on main generator

## [1.0.6] - 16.04.2022.

### Added

- CLI command for directly creating the component
- CLI command for directly creating the router
- CLI command for directly creating the api
- CLI command for directly creating the config

## [1.0.5] - 16.04.2022.

### Changed

- Bug fix for version updater

## [1.0.4] - 15.04.2022.

### Added

- ora dependency for async loading notifications
- Ability to check for updates with `-u` flag
- Config option for including index files
- Component generator include index file option

### Changed

- Extended main application handler to support flags
- Getting package.json file can now fail without logging errors

### Removed

- Unnecessary files from build artifact

## [1.0.3] - 14.04.2022.

### Added

- Ability to choose between default and named export

### Changed

- Configuration file now supports exports as a configurable option

## [1.0.2] - 12.04.2022.

### Added

- Added storybook generation to component generator
- Added react-igniter config files so you can predefine answers to generator questions
- Added initialize react-igniter config command
- Added update react-igniter config command
- Cleaned up dependencies

### Changed

- Welcome to react igniter styling
- Changed script name from `react-igniter` to `rig`

### Removed

- chalk-animation dependency

## [1.0.1] - 10.04.2022.

### Added

- README overhaul

### Changed

- Fixed issue with test files generation

## [1.0.0] - 09.04.2022.

### Added

- Ability to create react components
- Ability to create react routers
- Ability to create react apis

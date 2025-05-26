# Implement Environment Variable Configuration

This task involves modifying Roo-Code to use environment variables for configuration, specifically starting with custom prompts and modes.

## Objective

Introduce a hierarchical configuration system using `.roo.env` files to manage the locations of `roo-rules`, custom modes, custom system prompts, and mode-specific settings.

## Plan

1.  **Concept:** Implement a mechanism to read and merge settings from a global `~/.config/.roo.env` file and a workspace-specific `/home/mstouffer/repos/GitHub/RooVetGit/Roo-Code/.roo.env` file, with the workspace file overriding global settings.
2.  **Initial Focus:** Begin by implementing support for environment variables related to custom system prompts (`ROO_SYSTEM_PROMPT_PATH`) and custom modes (`ROO_CUSTOM_MODES_PATH`).
3.  **Implementation Steps:**
    *   Develop or integrate a configuration loading utility that handles the hierarchical reading of `.roo.env` files.
    *   Update the Roo-Code codebase to use the loaded configuration values for custom prompt and mode file locations instead of hardcoded paths.
    *   Ensure graceful fallback to default behavior if environment variables are not set or files are not found.
    *   (Future steps will include adding support for roo-rules and mode-specific settings).

## Context

*   A high-level plan is outlined in `plan.md`.
*   Existing export features in `src/exports/api.ts` might provide some relevant context on how settings or paths are currently handled.

## Next Steps (in Design Engineer mode)

*   Analyze existing configuration loading mechanisms in Roo-Code.
*   Determine the best approach for reading `.roo.env` files and merging configurations.
*   Identify the specific code locations that need modification to use the new environment variables for custom prompts and modes.
*   Implement the necessary code changes.
*   Add tests for the new configuration loading and usage.

## Completed Work

- Implemented a utility function `loadEnvConfig` in `src/utils/config/envConfig.ts` to read and merge environment variables from `~/.config/.roo.env` and `.roo.env` in the workspace root.
- Modified `src/extension.ts` to call `loadEnvConfig` during activation and store the resulting configuration.
- Updated the `ClineProvider` in `src/core/webview/ClineProvider.ts` to accept the environment configuration and use `ROO_SYSTEM_PROMPT_PATH` for loading custom system prompts.
- Updated the `CustomModesManager` in `src/core/config/CustomModesManager.ts` to use `ROO_CUSTOM_MODES_PATH` for loading custom modes.
- Added `"env"` as a possible source for mode configuration in the `ModeConfig` schema in `src/schemas/index.ts`.
- Created an `example.roo.env` file with commented-out examples of all possible configuration keys that can be set via `.roo.env`.
- Resolved all TypeScript errors introduced during the implementation.
- Defined an S3 bucket (`ApprovedSendersBucket`) in `/home/mstouffer/repos/email-to-sms/lib/app-stack.ts` using AWS CDK. Configured `removalPolicy: DESTROY` and `autoDeleteObjects: true` for development. Added a CDK Output for the bucket name. Verified with `cdk synth`.
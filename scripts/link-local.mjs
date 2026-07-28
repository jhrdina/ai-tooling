#!/usr/bin/env node
/**
 * Symlink all plugins/ entries into global Cursor and Claude Code locations.
 *
 * Cursor:  ~/.cursor/plugins/local/<plugin>
 * Claude:  ~/.claude/skills/<plugin>  (loads as @skills-dir, in-place)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const pluginsDir = path.join(repoRoot, 'plugins');
const unlink = process.argv.includes('--unlink');

const home = os.homedir();
const cursorLocalDir = path.join(home, '.cursor', 'plugins', 'local');
const claudeSkillsDir = path.join(home, '.claude', 'skills');

function readPluginName(pluginDir) {
  for (const manifestRel of ['.cursor-plugin/plugin.json', '.claude-plugin/plugin.json']) {
    const manifestPath = path.join(pluginDir, manifestRel);
    if (!fs.existsSync(manifestPath)) continue;
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (typeof manifest.name === 'string' && manifest.name.length > 0) {
      return manifest.name;
    }
  }
  return path.basename(pluginDir);
}

function hasCursorManifest(pluginDir) {
  return fs.existsSync(path.join(pluginDir, '.cursor-plugin', 'plugin.json'));
}

function hasClaudeManifest(pluginDir) {
  return fs.existsSync(path.join(pluginDir, '.claude-plugin', 'plugin.json'));
}

function discoverPlugins() {
  if (!fs.existsSync(pluginsDir)) {
    console.error(`No plugins directory: ${pluginsDir}`);
    process.exit(1);
  }

  return fs
    .readdirSync(pluginsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => path.join(pluginsDir, entry.name))
    .filter((pluginDir) => hasCursorManifest(pluginDir) || hasClaudeManifest(pluginDir));
}

function removeLink(linkPath) {
  if (!fs.existsSync(linkPath)) {
    console.log(`SKIP ${linkPath} (not present)`);
    return;
  }
  const stat = fs.lstatSync(linkPath);
  if (!stat.isSymbolicLink()) {
    throw new Error(`Refusing to remove non-symlink: ${linkPath}`);
  }
  fs.unlinkSync(linkPath);
  console.log(`UNLINK ${linkPath}`);
}

function ensureSymlink(target, linkPath) {
  fs.mkdirSync(path.dirname(linkPath), { recursive: true });
  const absoluteTarget = path.resolve(target);

  if (fs.existsSync(linkPath)) {
    const stat = fs.lstatSync(linkPath);
    if (stat.isSymbolicLink()) {
      const currentTarget = fs.readlinkSync(linkPath);
      const resolvedCurrent = path.resolve(path.dirname(linkPath), currentTarget);
      if (resolvedCurrent === absoluteTarget) {
        console.log(`OK   ${linkPath}`);
        return;
      }
      fs.unlinkSync(linkPath);
    } else {
      throw new Error(`Refusing to overwrite non-symlink: ${linkPath}`);
    }
  }

  fs.symlinkSync(absoluteTarget, linkPath);
  console.log(`LINK ${linkPath} -> ${absoluteTarget}`);
}

function main() {
  const pluginDirs = discoverPlugins();
  if (pluginDirs.length === 0) {
    console.log('No plugins found under plugins/.');
    return;
  }

  console.log(unlink ? 'Unlinking plugins…' : 'Linking plugins…');
  console.log(`Repo: ${repoRoot}\n`);

  for (const pluginDir of pluginDirs) {
    const name = readPluginName(pluginDir);
    console.log(`Plugin: ${name}`);

    if (unlink) {
      if (hasCursorManifest(pluginDir)) {
        removeLink(path.join(cursorLocalDir, name));
      }
      if (hasClaudeManifest(pluginDir)) {
        removeLink(path.join(claudeSkillsDir, name));
      }
    } else {
      if (hasCursorManifest(pluginDir)) {
        ensureSymlink(pluginDir, path.join(cursorLocalDir, name));
      }
      if (hasClaudeManifest(pluginDir)) {
        ensureSymlink(pluginDir, path.join(claudeSkillsDir, name));
      }
    }

    console.log('');
  }

  if (!unlink) {
    console.log('Done. Restart Cursor / Claude Code (or Reload Window) to pick up changes.');
  }
}

main();

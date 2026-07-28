import { defineConfig } from '@ai-plugin-marketplace/core';

export default defineConfig({
  version: '0.1.0',
  targets: ['claude', 'cursor'],
  description:
    'Requirements specification workflow with hspec skill and automatic post-turn requirements sync hook.',
  keywords: ['requirements', 'hspec', 'specification', 'hooks'],
});

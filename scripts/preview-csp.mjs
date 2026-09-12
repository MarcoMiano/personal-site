#!/usr/bin/env node

import { preview } from 'astro';

const host = '127.0.0.1';
const port = 4323;

await preview({
  root: process.cwd(),
  server: {
    host,
    port,
    headers: {
      'Content-Security-Policy': "script-src 'self'",
    },
  },
});

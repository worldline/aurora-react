#!/usr/bin/env node
// start-playwright-container.mjs — starts Playwright as a Kazan Testcontainer
// Kazan requires ci.job.id and ci.project.id labels on every testcontainer.
// Writes PLAYWRIGHT_WS_ENDPOINT=ws://host:port to PLAYWRIGHT_TC_ENV_FILE.

import { GenericContainer } from 'testcontainers';
import { openSync, writeSync, closeSync, constants as fsConstants } from 'fs';
import { resolve } from 'path';

const image     = process.env.PLAYWRIGHT_IMAGE       || 'mcr.microsoft.com/playwright:v1.59.0-noble';
const version   = process.env.PLAYWRIGHT_VERSION     || '1.59.0';
const port      = parseInt(process.env.PLAYWRIGHT_SERVER_PORT || '3000', 10);
const envFile   = process.env.PLAYWRIGHT_TC_ENV_FILE || '/tmp/playwright-tc.env';
const jobId     = process.env.CI_JOB_ID              || '0';
const projectId = process.env.CI_PROJECT_ID          || '0';

function fail(msg) {
  process.stderr.write(`[playwright-tc] ERROR: ${msg}\n`);
  process.exit(1);
}

if (!/^[a-zA-Z0-9][a-zA-Z0-9._\-/:@]*$/.test(image)) {
  fail(`PLAYWRIGHT_IMAGE "${image}" contains invalid characters`);
}
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  fail(`PLAYWRIGHT_VERSION "${version}" must be x.y.z semver`);
}
if (isNaN(port) || port < 1024 || port > 65535) {
  fail(`PLAYWRIGHT_SERVER_PORT must be 1024-65535`);
}
if (!resolve(envFile).startsWith('/') || envFile.includes('..')) {
  fail(`PLAYWRIGHT_TC_ENV_FILE must be an absolute path without traversal`);
}

process.stderr.write(`[playwright-tc] Starting ${image} (playwright@${version} on port ${port})\n`);

try {
  const container = await new GenericContainer(image)
    .withLabels({
      'ci.job.id':     jobId,
      'ci.project.id': projectId,
      'com.joyrex2001.kubedock.request-memory': '2Gi',
      'com.joyrex2001.kubedock.request-cpu':    '1000m',
    })
    .withExposedPorts(port)
    .withCommand(['npx', '-y', `playwright@${version}`, 'run-server', '--port', String(port), '--host', '0.0.0.0'])
    .withStartupTimeout(120_000)
    .start();

  const wsEndpoint = `ws://${container.getHost()}:${container.getMappedPort(port)}`;
  const fd = openSync(
    envFile,
    fsConstants.O_WRONLY | fsConstants.O_CREAT | fsConstants.O_EXCL | fsConstants.O_NOFOLLOW,
    0o600
  );
  try {
    writeSync(fd, `PLAYWRIGHT_WS_ENDPOINT=${wsEndpoint}\n`);
  } finally {
    closeSync(fd);
  }
  process.stderr.write(`[playwright-tc] Ready - ${wsEndpoint}\n`);
} catch (err) {
  process.stderr.write(`[playwright-tc] ERROR: ${err.message}\n`);
  process.exit(1);
}

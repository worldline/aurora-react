/* eslint-disable no-console */
import { spawn } from 'node:child_process'

export const setup = async () => {
  if (!process.env.CI) {
    console.log('Starting Docker containers for visual tests...')
    await runCommand('docker', [
      'compose',
      '-f',
      '__tests__/visual/docker-compose.yml',
      'up',
      '-d',
      '--wait',
    ])
  } else {
    console.log('CI environment detected, skipping Docker setup...')
  }
}

export const teardown = async () => {
  if (!process.env.CI) {
    console.log('Stopping Docker containers...')
    await runCommand('docker', [
      'compose',
      '-f',
      '__tests__/visual/docker-compose.yml',
      'down',
    ])
  } else {
    console.log('CI environment detected, skipping Docker teardown...')
  }
}

const runCommand = (command: string, args: Array<string>): Promise<void> =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with exit code ${String(code)}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })

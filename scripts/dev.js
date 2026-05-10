const { spawn } = require('child_process');

const isWindows = process.platform === 'win32';
const command = isWindows ? 'cmd.exe' : 'npm';
const frontendArgs = isWindows ? ['/d', '/s', '/c', 'npm run dev:frontend'] : ['run', 'dev:frontend'];
const backendArgs = isWindows ? ['/d', '/s', '/c', 'npm run dev:backend'] : ['run', 'dev:backend'];

const processes = [
  spawn(command, frontendArgs, {
    stdio: 'inherit',
    shell: false,
  }),
  spawn(command, backendArgs, {
    stdio: 'inherit',
    shell: false,
  }),
];

let exiting = false;

const shutdown = (code) => {
  if (exiting) return;
  exiting = true;

  for (const childProcess of processes) {
    if (!childProcess.killed) {
      childProcess.kill();
    }
  }

  process.exit(code);
};

for (const childProcess of processes) {
  childProcess.on('exit', (code, signal) => {
    if (signal) {
      shutdown(0);
      return;
    }

    shutdown(code ?? 0);
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
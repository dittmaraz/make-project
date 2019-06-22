const { spawn } = require('child_process');
const gitclone = spawn('git', ['clone', 'https://gitlab.com/dittmaraz/html-boilerplate.git']);

gitclone.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  gitclone.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  
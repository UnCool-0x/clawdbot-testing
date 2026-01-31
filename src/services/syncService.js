const { exec } = require('child_process');
const path = require('path');

/**
 * Pushes changes to the remote repository.
 * Runs in background, logs errors if any.
 */
const syncToRemote = () => {
    const projectRoot = path.join(__dirname, '../../');
    
    // Command: Add all, Commit, Push
    const cmd = 'git add . && git commit -m "Auto-update memory" && git push origin main';

    exec(cmd, { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) {
            console.error(`[Git Sync Error]: ${error.message}`);
            return;
        }
        // console.log("[Git Sync] Pushed to remote successfully.");
    });
};

module.exports = { syncToRemote };

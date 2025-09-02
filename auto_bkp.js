import simpleGit from 'simple-git';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize simple-git for the current directory
const git = simpleGit(__dirname);

// Configuration
const backupBranchName = 'backup';
const intervalTime = 2 * 60 * 1000; // 2 minutes in milliseconds

/**
 * Checks for changes, commits them, and pushes to the backup branch.
 */
async function autoBackup() {
    try {
        const status = await git.status();
        // Check if there are any changes to commit
        if (!status.isClean()) {
            console.log(`\nChanges detected. Committing and pushing to '${backupBranchName}' branch...`);

            // Stage all changes
            await git.add('.');

            // Commit the changes with a timestamp
            await git.commit(`Auto-backup: ${new Date().toISOString()}`);

            // Push the changes to the remote branch
            await git.push('origin', backupBranchName);

            console.log('✅ Changes successfully committed and pushed.');
        } else {
            console.log(`\nNo changes to commit. Waiting for the next interval...`);
        }
    } catch (error) {
        console.error('❌ An error occurred during the backup process:', error);
        console.log('Please ensure you have authenticated with your Git provider (e.g., using SSH keys).');
    }
}

/**
 * Initializes the script, creating the backup branch if it doesn't exist.
 */
async function init() {
    try {
        const branches = await git.branch(['-a']);

        if (!branches.all.includes(backupBranchName)) {
            console.log(`\nBranch '${backupBranchName}' not found. Creating and pushing...`);

            // Create and checkout the new local branch
            await git.checkoutLocalBranch(backupBranchName);

            // Push the new branch to the remote and set the upstream
            await git.push(['-u', 'origin', backupBranchName]);
            
            console.log(`\n✅ Branch '${backupBranchName}' created and pushed. The backup system is now active.`);
        } else {
            console.log(`\nBranch '${backupBranchName}' already exists. Starting the auto-backup system.`);
        }

        // Start the continuous backup loop
        setInterval(autoBackup, intervalTime);
        
        // Run the first backup immediately
        autoBackup();
        
    } catch (error) {
        console.error('❌ An error occurred during initialization:', error);
        console.log('Please ensure your remote origin is set up correctly (e.g., `git remote add origin <url>`).');
    }
}

// Start the whole process
init();

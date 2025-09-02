# GitHub Repository Auto-Backup

This repository contains a simple Node.js script that automatically backs up your local Git repository to a dedicated branch on GitHub. It's designed to be a continuous background process that periodically checks for changes, commits them, and pushes them to a remote `backup` branch.

### Why use this script?

  - **Continuous Backup:** The script runs on a set interval (default is every 2 minutes), ensuring your changes are frequently saved.
  - **Dedicated Branch:** It uses a separate `backup` branch, so your `main` or `master` branch remains clean and untouched. This is useful for protecting your primary development branch from frequent, small commits.
  - **Easy Setup:** The `init` function handles the initial setup, automatically creating the `backup` branch if it doesn't already exist.

-----

## How it Works

The script operates in two main parts:

1.  **Initialization (`init` function):**

      - Checks for the existence of a remote `backup` branch.
      - If the branch does not exist, it creates a new local branch named `backup`, pushes it to the remote, and sets the upstream.
      - If the branch already exists, it simply logs a message and proceeds.
      - Once initialized, it starts a continuous loop to run the `autoBackup` function at a set interval. It also runs the first backup immediately.

2.  **Auto-Backup (`autoBackup` function):**

      - Performs a `git status` check to see if there are any uncommitted changes.
      - If changes are detected, it performs the following Git commands:
          - `git add .` to stage all changes.
          - `git commit -m "Auto-backup: <timestamp>"` to commit the changes with a unique timestamp.
          - `git push origin backup` to push the new commit to the remote `backup` branch.
      - If no changes are detected, it waits for the next interval to check again.

-----

## Getting Started

### Prerequisites

  - **Node.js:** Make sure you have Node.js installed on your system.
  - **Git:** The script relies on Git being installed and configured locally.
  - **SSH Keys:** It's highly recommended to have SSH keys set up and configured for your GitHub account to avoid having to enter your credentials for every push.

### Installation and Setup

1.  **Clone the repository** into the local directory you want to back up.
2.  **Navigate to the project folder** in your terminal.
3.  **Install dependencies** using npm:
    ```sh
    npm install
    ```
4.  **Run the script:**
    ```sh
    node auto_bkp.js
    ```
      - The script will first initialize, creating the `backup` branch if it's not present.
      - It will then begin the automatic backup process, running a check every 2 minutes by default. You can change this interval by editing the `intervalTime` variable in `auto_bkp.js`.

-----

## Configuration

You can easily customize the script by editing the `auto_bkp.js` file:

  - `backupBranchName`: Change the name of the backup branch.
  - `intervalTime`: Adjust the backup interval in milliseconds. The current setting is 2 minutes (`2 * 60 * 1000`).

-----

## Troubleshooting

  - **`An error occurred during the backup process...`**: This often means you don't have authentication set up correctly. Ensure you have your SSH keys configured with GitHub.
  - **`An error occurred during initialization...`**: This usually indicates an issue with your remote origin. Make sure you have a remote origin set for your repository using `git remote add origin <url>`.

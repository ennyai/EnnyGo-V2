# EnnyGo Error Solutions Documentation

This document tracks encountered errors during development and their solutions for future reference.

## Package Management

### NPM Installation Hanging

**Error Description:**
- NPM package installation process would hang indefinitely during `npm install`
- No error message, just frozen progress bar
- Specifically occurred when trying to install UI dependencies (clsx, tailwind-merge, lucide-react)

**Root Cause:**
- NPM can sometimes get stuck during dependency resolution
- Could be due to:
  - Network issues
  - Package conflicts
  - System resource limitations
  - Corrupted npm cache

**Solution:**
1. Switched from npm to yarn package manager
2. Steps taken:
   ```bash
   # Clean up existing installation
   rm -rf node_modules package-lock.json
   
   # Install yarn globally
   sudo npm install -g yarn
   
   # Install dependencies using yarn
   yarn install
   
   # Install specific UI dependencies
   yarn add clsx tailwind-merge lucide-react
   ```

**Prevention:**
- Use yarn for more reliable package management
- Keep package.json clean and well-organized
- Regularly update dependencies
- Consider using package version locks

### Package Manager Lock Files

**Important Note:**
When switching between package managers (npm to yarn or vice versa), it's crucial to:
1. Delete the old package manager's lock file
   - For npm: delete `package-lock.json`
   - For yarn: delete `yarn.lock`
2. Keep only the lock file for your chosen package manager

**Why:**
- Each package manager uses its own lock file format
- Having both lock files can cause:
  - Dependency resolution conflicts
  - Inconsistent installations across team members
  - Warning messages about mixed package managers
  - Potential version mismatches

**Best Practices:**
- Choose one package manager for your project and stick with it
- Document your choice in the project's README
- Remove any lock files from other package managers
- Commit the lock file to version control

## Command Reference for Yarn
```bash
# Installing dependencies
yarn install (or just yarn)

# Adding new dependencies
yarn add [package]
yarn add -D [package]  # for dev dependencies

# Running scripts
yarn dev
yarn build
yarn test

# Removing dependencies
yarn remove [package]
``` 
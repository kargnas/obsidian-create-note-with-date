import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

/**
 * Version Update and Deployment Automation Script
 * 1. Update version in package.json
 * 2. Synchronize version in manifest.json
 * 3. Run build
 * 4. Create Git commit
 * 5. Create Git tag
 * 6. Push changes to GitHub
 */

// Version type definitions
const VERSION_TYPES = {
  PATCH: 'patch',
  MINOR: 'minor',
  MAJOR: 'major'
};

// Default settings
const DEFAULT_VERSION_TYPE = VERSION_TYPES.PATCH;
const RELEASE_FILES = ['main.js', 'manifest.json', 'styles.css'];

/**
 * Updates version value from the version string.
 * @param {string} version - Current version (e.g., '0.2.2')
 * @param {string} type - Update type ('patch', 'minor', 'major')
 * @returns {string} Updated version
 */
const updateVersion = (version, type = DEFAULT_VERSION_TYPE) => {
  const [major, minor, patch] = version.split('.').map(Number);
  
  switch (type) {
    case VERSION_TYPES.MAJOR:
      return `${major + 1}.0.0`;
    case VERSION_TYPES.MINOR:
      return `${major}.${minor + 1}.0`;
    case VERSION_TYPES.PATCH:
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
};

/**
 * Updates version information in package.json file.
 * @param {string} versionType - Version type to update
 * @returns {string} New version
 */
const updatePackageVersion = (versionType) => {
  const packagePath = path.resolve(process.cwd(), 'package.json');
  const packageData = JSON.parse(readFileSync(packagePath, 'utf8'));
  
  const currentVersion = packageData.version;
  const newVersion = updateVersion(currentVersion, versionType);
  
  packageData.version = newVersion;
  writeFileSync(packagePath, JSON.stringify(packageData, null, '\t') + '\n');
  
  console.log(`📦 Updated package.json version: ${currentVersion} → ${newVersion}`);
  return newVersion;
};

/**
 * Updates version information in manifest.json file.
 * @param {string} newVersion - Version to update
 */
const updateManifestVersion = (newVersion) => {
  const manifestPath = path.resolve(process.cwd(), 'manifest.json');
  const manifestData = JSON.parse(readFileSync(manifestPath, 'utf8'));
  
  const currentVersion = manifestData.version;
  manifestData.version = newVersion;
  
  writeFileSync(manifestPath, JSON.stringify(manifestData, null, '\t') + '\n');
  console.log(`📋 Updated manifest.json version: ${currentVersion} → ${newVersion}`);
};

/**
 * Run project build
 */
const buildProject = () => {
  console.log('🔨 Starting project build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed');
};

/**
 * Create Git commit and tag
 * @param {string} version - New version
 */
const createGitCommitAndTag = (version) => {
  try {
    // Stage changed files
    execSync('git add package.json manifest.json', { stdio: 'inherit' });
    execSync(`git add ${RELEASE_FILES.join(' ')}`, { stdio: 'inherit' });
    
    // Create commit
    const commitMessage = `chore: release v${version}`;
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    console.log(`✅ Commit created: ${commitMessage}`);
    
    // Create tag
    const tagName = `v${version}`;
    execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' });
    console.log(`🏷️ Tag created: ${tagName}`);
    
    // Push changes
    execSync('git push', { stdio: 'inherit' });
    execSync('git push --tags', { stdio: 'inherit' });
    console.log('🚀 Changes pushed to GitHub');
    
    // Create GitHub Release
    try {
      console.log('📦 Creating GitHub Release...');
      
      // First check if GitHub CLI is installed
      try {
        execSync('gh --version', { stdio: 'pipe' });
      } catch (error) {
        console.log('⚠️ GitHub CLI not found. Skipping GitHub Release creation.');
        console.log('ℹ️ To create GitHub Releases, install GitHub CLI: https://cli.github.com/');
        return;
      }
      
      // Create GitHub Release using GitHub CLI
      const releaseCommand = `gh release create ${tagName} ${RELEASE_FILES.join(' ')} --title "Release ${tagName}" --notes "Release ${tagName}"`;
      execSync(releaseCommand, { stdio: 'inherit' });
      console.log(`✅ GitHub Release created: ${tagName}`);
    } catch (releaseError) {
      console.error('⚠️ Failed to create GitHub Release:', releaseError.message);
      console.log('Release files were still committed and pushed to GitHub.');
    }
  } catch (error) {
    console.error('❌ Error during Git operations:', error.message);
    process.exit(1);
  }
};

/**
 * Check if Git working tree is clean
 * @returns {boolean} Whether the working tree is clean
 */
const isGitWorkingTreeClean = () => {
  try {
    // Check for uncommitted changes
    const output = execSync('git status --porcelain', { encoding: 'utf-8' });
    return output.trim() === '';
  } catch (error) {
    console.error('❌ Error checking Git status:', error.message);
    return false;
  }
};

/**
 * Main function
 */
const main = () => {
  try {
    // Check for uncommitted changes
    if (!isGitWorkingTreeClean()) {
      console.error('❌ Cannot proceed with release: You have uncommitted changes.');
      console.log('Please commit or stash your changes before running the release script.');
      process.exit(1);
    }
    
    // Check command line arguments
    const args = process.argv.slice(2);
    const versionType = args[0] || DEFAULT_VERSION_TYPE;
    
    if (!Object.values(VERSION_TYPES).includes(versionType)) {
      console.error(`❌ Invalid version type: ${versionType}`);
      console.log(`Valid options: ${Object.values(VERSION_TYPES).join(', ')}`);
      process.exit(1);
    }
    
    // Execute version update and deployment process
    const newVersion = updatePackageVersion(versionType);
    updateManifestVersion(newVersion);
    buildProject();
    createGitCommitAndTag(newVersion);
    
    console.log(`\n🎉 Release v${newVersion} completed successfully!`);
  } catch (error) {
    console.error('❌ Error during release process:', error.message);
    process.exit(1);
  }
};

// Run script
main();

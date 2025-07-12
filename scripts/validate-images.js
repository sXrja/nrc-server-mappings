#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function getImageDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      const width = (buffer[16] << 24) | (buffer[17] << 16) | (buffer[18] << 8) | buffer[19];
      const height = (buffer[20] << 24) | (buffer[21] << 16) | (buffer[22] << 8) | buffer[23];
      
      return { width, height };
    }
    
    throw new Error('Not a valid PNG file');
  } catch (error) {
    throw new Error(`Failed to read image dimensions: ${error.message}`);
  }
}

function validateImageDimensions(filePath, expectedWidth, expectedHeight, imageType) {
  try {
    const dimensions = getImageDimensions(filePath);
    
    if (dimensions.width === expectedWidth && dimensions.height === expectedHeight) {
      console.log(`✅ ${imageType} dimensions are correct: ${dimensions.width}x${dimensions.height}`);
      return true;
    } else {
      console.error(`❌ ${imageType} dimensions are incorrect: ${dimensions.width}x${dimensions.height} (expected: ${expectedWidth}x${expectedHeight})`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error validating ${imageType}: ${error.message}`);
    return false;
  }
}

function validateIconDimensions(filePath) {
  try {
    const dimensions = getImageDimensions(filePath);
    
    if (dimensions.width >= 64 && dimensions.width <= 520 && 
        dimensions.height >= 64 && dimensions.height <= 520 &&
        dimensions.width === dimensions.height) {
      console.log(`✅ Icon dimensions are correct: ${dimensions.width}x${dimensions.height}`);
      return true;
    } else {
      console.error(`❌ Icon dimensions are incorrect: ${dimensions.width}x${dimensions.height} (expected: 64x64 to 520x520, must be square)`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error validating icon: ${error.message}`);
    return false;
  }
}

function validateManifestImages(manifestPath) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const manifestDir = path.dirname(manifestPath);
    
    const assets = manifest.assets;
    if (!assets) {
      console.error(`❌ No assets section found in ${manifestPath}`);
      return false;
    }
    
    let allValid = true;
    
    if (assets.background) {
      const backgroundPath = path.join(manifestDir, assets.background);
      if (!fs.existsSync(backgroundPath)) {
        console.error(`❌ Background file not found: ${backgroundPath}`);
        allValid = false;
      } else {
        const backgroundValid = validateImageDimensions(backgroundPath, 1920, 1080, 'Background');
        if (!backgroundValid) {
          allValid = false;
        }
      }
    } else {
      console.error(`❌ No background image specified in manifest`);
      allValid = false;
    }
    
    if (assets.icon) {
      const iconPath = path.join(manifestDir, assets.icon);
      if (!fs.existsSync(iconPath)) {
        console.error(`❌ Icon file not found: ${iconPath}`);
        allValid = false;
      } else {
        const iconValid = validateIconDimensions(iconPath);
        if (!iconValid) {
          allValid = false;
        }
      }
    } else {
      console.error(`❌ No icon image specified in manifest`);
      allValid = false;
    }
    
    return allValid;
  } catch (error) {
    console.error(`❌ Error checking images for ${manifestPath}: ${error.message}`);
    return false;
  }
}

function findManifestFiles() {
  const serversDir = path.join(__dirname, '..', 'servers');
  const manifests = [];
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file === 'manifest.json') {
        manifests.push(fullPath);
      }
    }
  }
  
  walkDir(serversDir);
  return manifests;
}

function main() {
  console.log('🔍 Finding manifest files...');
  const manifestFiles = findManifestFiles();
  
  if (manifestFiles.length === 0) {
    console.log('No manifest files found.');
    return;
  }
  
  console.log(`Found ${manifestFiles.length} manifest file(s):`);
  manifestFiles.forEach(file => console.log(`  - ${file}`));
  console.log('');
  
  let allValid = true;
  
  for (const manifestPath of manifestFiles) {
    console.log(`\n📋 Validating images for ${path.relative(process.cwd(), manifestPath)}...`);
    
    const imagesValid = validateManifestImages(manifestPath);
    
    if (!imagesValid) {
      allValid = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  if (allValid) {
    console.log('🎉 All images are valid!');
    process.exit(0);
  } else {
    console.log('❌ Some images have validation errors.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateManifestImages, validateImageDimensions, validateIconDimensions, findManifestFiles }; 
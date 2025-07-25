const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputPath, quality = 75) {
  try {
    const info = await sharp(inputPath)
      .jpeg({ quality, progressive: true })
      .toFile(outputPath);
    
    const inputSize = fs.statSync(inputPath).size;
    const outputSize = info.size;
    const savings = ((inputSize - outputSize) / inputSize * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)}: ${(inputSize/1024).toFixed(1)}KB → ${(outputSize/1024).toFixed(1)}KB (${savings}% smaller)`);
    return info;
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

async function optimizeAllImages() {
  console.log('🚀 Starting image optimization...\n');
  
  const photosDir = path.join(__dirname, '..', 'src', 'photos');
  const teamDir = path.join(photosDir, 'team');
  
  // Create backup directory
  const backupDir = path.join(photosDir, 'backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const backupTeamDir = path.join(backupDir, 'team');
  if (!fs.existsSync(backupTeamDir)) {
    fs.mkdirSync(backupTeamDir, { recursive: true });
  }
  
  // List of images to optimize
  const imagesToOptimize = [
    {
      input: path.join(photosDir, 'Header_image3.jpg'),
      backup: path.join(backupDir, 'Header_image3.jpg'),
      quality: 70
    },
    {
      input: path.join(teamDir, 'AnthonyHart.jpeg'),
      backup: path.join(backupTeamDir, 'AnthonyHart.jpeg'),
      quality: 75
    },
    {
      input: path.join(teamDir, 'DanielPeckham.jpeg'),
      backup: path.join(backupTeamDir, 'DanielPeckham.jpeg'),
      quality: 75
    },
    {
      input: path.join(teamDir, 'GAaronKibbie.jpeg'),
      backup: path.join(backupTeamDir, 'GAaronKibbie.jpeg'),
      quality: 75
    },
    {
      input: path.join(teamDir, 'GAidenKibbie.jpeg'),
      backup: path.join(backupTeamDir, 'GAidenKibbie.jpeg'),
      quality: 75
    },
    {
      input: path.join(teamDir, 'ECorinnekibbie.jpg'),
      backup: path.join(backupTeamDir, 'ECorinnekibbie.jpg'),
      quality: 75
    }
  ];
  
  let totalSavings = 0;
  let totalOriginalSize = 0;
  
  for (const image of imagesToOptimize) {
    if (fs.existsSync(image.input)) {
      // Create backup
      fs.copyFileSync(image.input, image.backup);
      
      const originalSize = fs.statSync(image.input).size;
      totalOriginalSize += originalSize;
      
      // Optimize in place
      const tempPath = image.input + '.tmp';
      await optimizeImage(image.input, tempPath, image.quality);
      
      if (fs.existsSync(tempPath)) {
        fs.renameSync(tempPath, image.input);
        const newSize = fs.statSync(image.input).size;
        totalSavings += (originalSize - newSize);
      }
    } else {
      console.log(`⚠️  File not found: ${image.input}`);
    }
  }
  
  console.log('\n📊 Optimization Summary:');
  console.log(`Total original size: ${(totalOriginalSize/1024).toFixed(1)}KB`);
  console.log(`Total savings: ${(totalSavings/1024).toFixed(1)}KB`);
  console.log(`Overall reduction: ${((totalSavings/totalOriginalSize)*100).toFixed(1)}%`);
  console.log(`\n💾 Original images backed up to: ${backupDir}`);
  console.log('✨ Image optimization complete!');
}

// Run the optimization
optimizeAllImages().catch(console.error);

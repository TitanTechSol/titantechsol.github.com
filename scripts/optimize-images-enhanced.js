const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// CAUSAI Enhanced Image Optimization Pipeline
// Desktop-first optimization with WebP conversion and responsive sizes

async function generateWebPVariants(inputPath, outputDir, filename, isBackground = false) {
  const baseName = path.parse(filename).name;
  const variants = [];
  
  try {
    // Desktop-first responsive sizes
    const sizes = isBackground 
      ? [
          { width: 1920, suffix: '@2x', quality: 85 }, // High-res backgrounds
          { width: 1440, suffix: '@1.5x', quality: 85 },
          { width: 1024, suffix: '', quality: 85 }
        ]
      : [
          { width: 400, suffix: '@2x', quality: 75 }, // Team headshots
          { width: 300, suffix: '@1.5x', quality: 75 },
          { width: 200, suffix: '', quality: 70 }
        ];

    for (const size of sizes) {
      const outputPath = path.join(outputDir, `${baseName}${size.suffix}.webp`);
      const info = await sharp(inputPath)
        .resize(size.width, null, { 
          withoutEnlargement: true,
          fastShrinkOnLoad: false 
        })
        .webp({ 
          quality: size.quality, 
          effort: 6,
          progressive: true 
        })
        .toFile(outputPath);
      
      variants.push({
        path: outputPath,
        width: size.width,
        size: info.size,
        suffix: size.suffix
      });
    }
    
    return variants;
  } catch (error) {
    console.error(`❌ Error generating WebP variants for ${inputPath}:`, error.message);
    return [];
  }
}

async function optimizeImage(inputPath, outputDir, isBackground = false) {
  try {
    const filename = path.basename(inputPath);
    const variants = await generateWebPVariants(inputPath, outputDir, filename, isBackground);
    
    const inputSize = fs.statSync(inputPath).size;
    const totalOutputSize = variants.reduce((sum, variant) => sum + variant.size, 0);
    const avgSavings = variants.length > 0 ? ((inputSize - (totalOutputSize / variants.length)) / inputSize * 100).toFixed(1) : 0;
    
    console.log(`✅ ${path.basename(inputPath)}: Generated ${variants.length} WebP variants`);
    variants.forEach(variant => {
      console.log(`   📱 ${variant.width}w${variant.suffix}: ${(variant.size/1024).toFixed(1)}KB`);
    });
    console.log(`   💾 Average savings: ${avgSavings}%`);
    
    return { variants, inputSize, totalOutputSize };
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function optimizeAllImages() {
  console.log('🤖 CAUSAI Enhanced Image Optimization Pipeline');
  console.log('🚀 Desktop-first WebP optimization starting...\n');
  
  const photosDir = path.join(__dirname, '..', 'src', 'photos');
  const teamDir = path.join(photosDir, 'team');
  
  // Create optimized directory structure
  const optimizedDir = path.join(photosDir, 'optimized');
  const optimizedTeamDir = path.join(optimizedDir, 'team');
  
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  if (!fs.existsSync(optimizedTeamDir)) {
    fs.mkdirSync(optimizedTeamDir, { recursive: true });
  }
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  // Background images (high resolution)
  console.log('🌄 Optimizing background images (high-res)...');
  const backgroundImages = [
    path.join(photosDir, 'Header_image3.jpg')
  ];
  
  for (const imagePath of backgroundImages) {
    if (fs.existsSync(imagePath)) {
      const result = await optimizeImage(imagePath, optimizedDir, true);
      if (result) {
        totalOriginalSize += result.inputSize;
        totalOptimizedSize += result.totalOutputSize / result.variants.length;
      }
    } else {
      console.log(`⚠️  Background image not found: ${imagePath}`);
    }
  }
  
  console.log('\n👥 Optimizing team member photos (optimized for web)...');
  
  // Team member photos (optimized for web)
  const teamImages = [
    'AnthonyHart.jpeg',
    'DanielPeckham.jpeg', 
    'ECorinnekibbie.jpg',
    'GAaronKibbie.jpeg',
    'GAidenKibbie.jpeg'
  ];
  
  for (const teamImage of teamImages) {
    const inputPath = path.join(teamDir, teamImage);
    if (fs.existsSync(inputPath)) {
      const result = await optimizeImage(inputPath, optimizedTeamDir, false);
      if (result) {
        totalOriginalSize += result.inputSize;
        totalOptimizedSize += result.totalOutputSize / result.variants.length;
      }
    } else {
      console.log(`⚠️  Team image not found: ${inputPath}`);
    }
  }
  
  // Calculate total savings
  const totalSavings = totalOriginalSize > 0 
    ? ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1) 
    : 0;
  
  console.log('\n📊 CAUSAI Optimization Summary:');
  console.log(`   📁 Original total size: ${(totalOriginalSize/1024/1024).toFixed(2)}MB`);
  console.log(`   📁 Optimized total size: ${(totalOptimizedSize/1024/1024).toFixed(2)}MB`);
  console.log(`   💾 Total savings: ${totalSavings}%`);
  console.log(`   🎯 Desktop-first WebP variants generated`);
  console.log(`   ✅ Ready for responsive implementation\n`);
  
  return {
    originalSize: totalOriginalSize,
    optimizedSize: totalOptimizedSize,
    savings: totalSavings
  };
}

// Run optimization if called directly
if (require.main === module) {
  optimizeAllImages()
    .then((results) => {
      console.log('🎉 CAUSAI image optimization completed successfully!');
      console.log(`Final savings: ${results.savings}%`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Optimization failed:', error);
      process.exit(1);
    });
}

module.exports = { optimizeAllImages, optimizeImage, generateWebPVariants };

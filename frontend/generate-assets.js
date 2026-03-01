const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create a simple colored square image
async function createImage(filename, width, height, color = '#28a745') {
  const filepath = path.join(assetsDir, filename);
  
  // Create SVG with the specified color
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.1}" 
            fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
        SJPS
      </text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(filepath);
  
  console.log(`✓ Created ${filename} (${width}x${height}px)`);
}

async function generateAssets() {
  console.log('Generating placeholder assets...\n');
  
  try {
    // App icon - 1024x1024px (green with text)
    await createImage('icon.png', 1024, 1024, '#28a745');
    
    // Splash screen - 1242x2436px (white background)
    await createImage('splash.png', 1242, 2436, '#ffffff');
    
    // Adaptive icon - 1024x1024px (green with text, same as icon)
    await createImage('adaptive-icon.png', 1024, 1024, '#28a745');
    
    // Favicon - 48x48px (green with text)
    await createImage('favicon.png', 48, 48, '#28a745');
    
    console.log('\n✅ All assets generated successfully!');
    console.log('You can replace these placeholder images with your own designs later.');
  } catch (error) {
    console.error('Error generating assets:', error);
    process.exit(1);
  }
}

generateAssets();



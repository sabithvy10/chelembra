import Jimp from 'jimp';

async function removeBg() {
  const image = await Jimp.read('public/title.png');
  
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const red = this.bitmap.data[idx + 0];
    const green = this.bitmap.data[idx + 1];
    const blue = this.bitmap.data[idx + 2];
    
    // If pixel is white/near-white, make it transparent
    if (red > 230 && green > 230 && blue > 230) {
      this.bitmap.data[idx + 3] = 0; 
    }
  });

  await image.writeAsync('public/title-transparent.png');
  console.log('Background removed!');
}

removeBg().catch(console.error);

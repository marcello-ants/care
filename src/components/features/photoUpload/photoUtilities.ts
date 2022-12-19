export interface pixelCropInterface {
  width: number;
  height: number;
  x: number;
  y: number;
}

const MAX_SIZE = 1500;
const MIN_SIZE = 320;

export const blobToFile = (theBlob: Blob, fileName: string): File => {
  const b: any = theBlob;
  // A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date();
  b.name = fileName;

  return <File>theBlob;
};

async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

const readPhoto = async (photo: File) => {
  const canvas = document.createElement('canvas');
  const img = document.createElement('img');

  // create img element from File object
  img.src = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = <string>e?.target?.result;
      if (result) {
        resolve(result);
      }
    };
    reader.readAsDataURL(photo);
  });

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  // draw image in canvas element
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas;
};

const scaleCanvas = (canvas: HTMLCanvasElement, scale: number) => {
  const scaledCanvas = document.createElement('canvas');

  scaledCanvas.width = canvas.width * scale;
  scaledCanvas.height = canvas.height * scale;
  scaledCanvas.getContext('2d')?.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

  return scaledCanvas;
};

export const optimizePhoto = async (photo: File) => {
  let canvas = await readPhoto(photo);
  const isGoingToBeTooSmall = canvas.width / 2 < MIN_SIZE;

  while (canvas.width >= 2 * MAX_SIZE && !isGoingToBeTooSmall) {
    canvas = scaleCanvas(canvas, 0.5);
  }

  if (canvas.width > MAX_SIZE) {
    canvas = scaleCanvas(canvas, MAX_SIZE / canvas.width);
  }

  const minSize = Math.min(canvas.width, canvas.height);

  if (minSize < MIN_SIZE) {
    canvas = scaleCanvas(canvas, MIN_SIZE / minSize);
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(file);
      } else {
        reject(new Error('Could not convert photo to blob.'));
      }
    }, 'image/jpeg');
  });
};

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: pixelCropInterface,
  rotation: number = 0
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const rotRad = getRadianAngle(rotation);

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.translate(-image.width / 2, -image.height / 2);

    // draw rotated image
    ctx.drawImage(image, 0, 0);

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0);
  }

  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(file);
      }
    }, 'image/jpeg');
  });
}

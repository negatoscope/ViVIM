import os
from PIL import Image
from pathlib import Path

def optimize_images(directory, max_dimension=1920, quality=80):
    """
    Recursively optimizes images in a directory.
    - Resizes images to max_dimension (width or height) if they are larger.
    - Converts all .jpg, .jpeg, .png to .webp.
    - Deletes original files after conversion.
    """
    image_extensions = {".jpg", ".jpeg", ".png"}
    images_dir = Path(directory)
    
    if not images_dir.exists():
        print(f"Directory {directory} does not exist.")
        return

    print(f"Starting optimization in {images_dir}...")
    
    count = 0
    for file_path in images_dir.rglob("*"):
        if file_path.suffix.lower() in image_extensions:
            try:
                # Open image
                with Image.open(file_path) as img:
                    # Check dimensions and resize if necessary
                    width, height = img.size
                    if max(width, height) > max_dimension:
                        # Calculate new dimensions proportional to aspect ratio
                        if width > height:
                            new_width = max_dimension
                            new_height = int(height * (max_dimension / width))
                        else:
                            new_height = max_dimension
                            new_width = int(width * (max_dimension / height))
                        
                        img = img.resize((new_width, new_height), Image.LANCZOS)
                        print(f"Resized: {file_path.name} from {width}x{height} to {new_width}x{new_height}")

                    # Determine output path (.webp)
                    output_path = file_path.with_suffix(".webp")
                    
                    # Save as WebP
                    img.save(output_path, "WEBP", quality=quality)
                    count += 1
                    print(f"Optimized and saved: {output_path.name}")

                # Verify WebP exists before deleting original
                if output_path.exists():
                    os.remove(file_path)
                    # print(f"Deleted original: {file_path.name}")
            except Exception as e:
                print(f"Error processing {file_path}: {e}")

    print(f"Finished! Processed {count} images.")

if __name__ == "__main__":
    optimize_images("images")

#!/bin/bash

# Image optimization script using basic tools
echo "Optimizing images for better performance..."

# Create optimized versions directory
mkdir -p src/photos/optimized
mkdir -p src/photos/optimized/team

# Function to optimize JPEG images
optimize_jpeg() {
    input_file="$1"
    output_file="$2"
    
    if command -v magick &> /dev/null; then
        # Using ImageMagick
        magick "$input_file" -quality 75 -strip "$output_file"
        echo "Optimized: $input_file -> $output_file"
    elif command -v jpegoptim &> /dev/null; then
        # Using jpegoptim
        cp "$input_file" "$output_file"
        jpegoptim --size=100k "$output_file"
        echo "Optimized: $input_file -> $output_file"
    else
        echo "No optimization tool found. Please install ImageMagick or jpegoptim"
        cp "$input_file" "$output_file"
    fi
}

# Optimize team photos
for photo in src/photos/team/*.{jpg,jpeg}; do
    if [ -f "$photo" ]; then
        filename=$(basename "$photo")
        optimize_jpeg "$photo" "src/photos/optimized/team/$filename"
    fi
done

# Optimize header image
if [ -f "src/photos/Header_image3.jpg" ]; then
    optimize_jpeg "src/photos/Header_image3.jpg" "src/photos/optimized/Header_image3.jpg"
fi

echo "Image optimization complete!"
echo "Note: For best results, manually optimize images using tools like:"
echo "- TinyPNG (https://tinypng.com/)"
echo "- Squoosh (https://squoosh.app/)"
echo "- ImageOptim (macOS)"

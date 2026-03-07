# Test Images for Photo-to-3D

Place test images here to quickly validate the TripoSR conversion feature.

**Recommended image types**:

- Interior design photographs
- Furniture product images
- Well-lit room interiors
- Front-facing object photos

**Avoid**:

- Heavily shadowed images
- Blurry or low-resolution photos (< 512px)
- Complex multi-room panoramas
- Images with lots of text or clutter

**File requirements**:

- Format: JPG, PNG
- Size: < 4MB
- Min resolution: 512x512 recommended

## Example workflow

```bash
# 1. Add a test image here
# 2. Start TripoSR service
cd ../triposr-service
start-server.bat

# 3. Test the service with your image
test-service.bat path/to/test-images/your-image.jpg

# 4. Start Next.js app
cd ..
npm run dev

# 5. Open http://localhost:3000
# 6. Click "Import Designer Photo"
# 7. Select your test image
# 8. Wait 10-20 seconds for conversion
```

## Sample test cases

### Case 1: Simple furniture

- Small chair, table, or lamp photo
- Expected result: Clean 3D model of the object

### Case 2: Room interior

- Wide-angle interior photo
- You may want to crop to focus on key furniture

### Case 3: Product photo

- Professional product shot of furniture
- Expected result: High-quality 3D model

## Tips

- **Best images**: Professional product photos, well-lit interiors
- **Remove clutter**: Fewer objects = cleaner 3D result
- **Lighting**: Even, diffuse lighting works better than harsh shadows
- **Cropping**: Focus on the main subject for best results

# Fix libvips alpha channel corruption during resize
# Override Jekyll Picture Tag's resize method to handle alpha correctly

module VipsAlphaFix
  def resize(image)
    # For images with alpha, resize WITHOUT premultiply/unpremultiply
    # The premultiply step causes corruption in semi-transparent pixels
    # Modern libvips can handle alpha during resize without this
    puts "🔧 PLUGIN: Resizing image without premultiply/unpremultiply"
    image.resize(scale_value, kernel: :lanczos3)
  end
end

# Hook to prepend our module after Jekyll Picture Tag loads
Jekyll::Hooks.register :site, :after_init do |site|
  if defined?(PictureTag::ImageFile)
    PictureTag::ImageFile.prepend(VipsAlphaFix)
    puts "✅ Alpha fix plugin loaded successfully"
  else
    puts "⚠️  Warning: PictureTag::ImageFile not found"
  end
end

require 'open3'
require 'json'

module Jekyll
  module ImageMetadataFilter
    def image_description(image_path)
      begin
        # Get the full file path
        site = @context.registers[:site]
        full_path = File.join(site.source, image_path.sub(/^\//, ''))

        # Use exiftool to read the Description field
        stdout, stderr, status = Open3.capture3("exiftool", "-Description", "-json", full_path)

        if status.success?
          data = JSON.parse(stdout)
          description = data[0]["Description"] rescue nil
          return description if description && !description.empty?
        end

        # Fallback to filename-based description
        File.basename(image_path, ".*").tr('-_', ' ').capitalize
      rescue => e
        Jekyll.logger.warn "ImageMetadata:", "Could not read metadata for #{image_path}: #{e.message}"
        File.basename(image_path, ".*").tr('-_', ' ').capitalize
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::ImageMetadataFilter)

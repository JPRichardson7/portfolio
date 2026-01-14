#!/bin/bash
# Fix PNG files with useless/fully-opaque alpha channels
# Preserves PNGs with actual transparency

echo "Scanning for PNG files with useless alpha channels..."

fixed_count=0
skipped_count=0
error_count=0

# Find all PNG files in assets/img
while IFS= read -r png_file; do
    # Check if file has alpha channel
    if identify -format "%A" "$png_file" 2>/dev/null | grep -q "True"; then
        # Extract alpha channel and check if it's fully opaque
        alpha_mean=$(convert "$png_file" -alpha extract -format "%[fx:mean]" info: 2>/dev/null || echo "error")

        if [ "$alpha_mean" = "error" ]; then
            echo "⚠️  Error checking: $png_file"
            ((error_count++))
            continue
        fi

        # Check if alpha is fully opaque (mean >= 0.99)
        is_opaque=$(echo "$alpha_mean >= 0.99" | bc -l)

        if [ "$is_opaque" -eq 1 ]; then
            echo "🔧 Fixing (opaque alpha): $png_file"

            # Create backup
            cp "$png_file" "${png_file}.bak"

            # Remove alpha channel
            convert "$png_file" -background white -alpha remove -alpha off "$png_file.tmp"
            mv "$png_file.tmp" "$png_file"

            ((fixed_count++))
        else
            echo "✓  Preserving (has transparency): $png_file (alpha mean: $alpha_mean)"
            ((skipped_count++))
        fi
    else
        echo "✓  Skipping (no alpha): $png_file"
        ((skipped_count++))
    fi
done < <(find assets/img -type f -name "*.png" ! -name "*_original*")

echo ""
echo "======================================="
echo "Summary:"
echo "  Fixed: $fixed_count files"
echo "  Preserved: $skipped_count files"
echo "  Errors: $error_count files"
echo "======================================="
echo ""
echo "Backups saved with .bak extension"
echo "Run 'npm run clean-all && npm run dev' to rebuild with fixed images"

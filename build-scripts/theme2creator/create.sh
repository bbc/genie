# Copy default theme to theme2 folder
rm -rf themes/theme2
cp -R themes/default themes/theme2
cd themes/theme2

# Convert all images to greyscale
for img in $(find . \( -name "*.jpg" -or -name "*.jpeg" -or -name "*.png"  -or -name "*.gif" \)); do echo -n "Converting $img"; convert $img -intensity Rec709luminance -colorspace gray $img && echo ' [Done]'; done

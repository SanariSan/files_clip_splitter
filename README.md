Created index.js build with ncc
ncc build .\clip.js -o ./dist

And exe with
pkg -t node14-win -o START.exe .\dist\index.js --debug

1. Create folder from where to read files
2. Folder to where to put clipped ones
3. Set settings in the corresponding file
4. Run start from main dir

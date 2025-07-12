##  Pull Request Validation

Before submitting this pull request, please confirm that you have completed the following:

###  Documentation Review
- [ ] I have read and understood the [README.md](../README.md)
- [ ] I have read and followed the [manifest.md](../docs/manifest.md) guide

###  Asset Requirements
- [ ] My server has an `icon.png` file (64x64 to 512x512 pixels, must be square)
- [ ] My server has a `background.png` file (1920x1080 pixels)
- [ ] Both image files are in PNG format
- [ ] Image files are properly referenced in the manifest.json (paths start with `./`)

###  Manifest Validation
- [ ] My `manifest.json` includes all required fields:
  - [ ] `server-address` (array of server domains)
  - [ ] `pretty-name` (display name for the server)
  - [ ] `categorys` (array of valid categories)
  - [ ] `assets.icon` (path to icon file)
  - [ ] `assets.background` (path to background file)
- [ ] All URLs in `socials` (if provided) are valid and start with `https://`
- [ ] All categories used are from the approved list in the documentation
- [ ] The manifest follows valid JSON syntax



## Validation

This repository includes automated validation for server manifest files. All `manifest.json` files must conform to the schema defined in `servers/manifest-schema.json`.

### Local Validation

To validate manifests locally:

```bash
# Install dependencies
npm install

# Run validation
npm run validate
```

### GitHub Actions

The repository includes a GitHub Action that automatically validates manifest files when they are added or modified. The action will:

1. Validate JSON structure against the schema
2. Check that required asset files (icon, background) exist
3. Verify that all URLs in socials are valid URIs
4. Ensure all required fields are present

### Adding a New Server

When adding a new server:

1. Create a new directory under `servers/` with your server name
2. Add a `manifest.json` file following the schema
3. Include the required asset files (icon.png, bg.png)
4. Optionally add a local `manifest-schema.json` for custom validation rules

The validation will run automatically on pull requests and pushes.

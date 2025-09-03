# Troubleshooting

Common issues and solutions when working with the Pablo presentation system.

## Common Issues

### PowerShell Execution Policy Error

**Problem**: Scripts cannot be executed due to PowerShell execution policy.

**Solution**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Preprocessor Errors

**Problem**: Slide generation fails or produces unexpected results.

**Solutions**:
- Check source file syntax and frontmatter
- Verify `pablo.config.js` configuration
- Ensure proper markdown structure

**Debug Mode**:
```bash
node -e "const {PabloSlideGenerator} = require('./src/preprocessor/index.js'); const generator = new PabloSlideGenerator({debug: true}); console.log(generator.processMarkdown(fs.readFileSync('file.source.md', 'utf8')));"
```

### Marp Build Failures

**Problem**: Marp fails to build presentation.

**Solutions**:
- Verify theme files exist and are compiled: `npm run build`
- Check markdown syntax and HTML elements
- Ensure all referenced assets exist

**Test Individual Components**:
```bash
# Test Marp only  
npx marp file.md --output test.html --theme ./output/themes/zappts-dark-theme.css
```

### Post-processing Issues

**Problem**: HTML processing fails or corrupts presentation.

**Solutions**:
- Check HTML file permissions
- Verify markdown syntax in HTML elements
- Review backup files for content comparison

**Test Post-processor**:
```bash
node postprocess-marp-html.js test.html --help
```

### Theme Not Found

**Problem**: Theme is not applied to presentation.

**Solutions**:
1. Ensure themes are compiled: `npm run build`
2. Check theme name in frontmatter matches available themes
3. Verify theme CSS files exist in `output/themes/`

### Port Conflicts

**Problem**: Development server cannot start.

**Solution**: The dev server auto-detects available ports starting from 1234. If issues persist, manually specify a different port.

## Debug Commands

### Test Preprocessor Only
```bash
node -e "const {PabloSlideGenerator} = require('./src/preprocessor/index.js'); console.log(new PabloSlideGenerator().processMarkdown(fs.readFileSync('file.source.md', 'utf8')));"
```

### Test Preprocessor with Debugging
```bash
node -e "const {PabloSlideGenerator} = require('./src/preprocessor/index.js'); const generator = new PabloSlideGenerator({debug: true}); console.log(generator.processMarkdown(fs.readFileSync('file.source.md', 'utf8')));"
```

### Test Preprocessor Validation
```bash
node -e "const {PabloSlideGenerator} = require('./src/preprocessor/index.js'); const generator = new PabloSlideGenerator(); const processed = generator.processMarkdown(fs.readFileSync('file.source.md', 'utf8')); const warnings = generator.validateSlides(processed.split('---').slice(2)); console.log('Validation warnings:', warnings);"
```

### Enable Debug Mode
```bash
DEBUG=* npm run build:presentation
```

## File Issues

### Backup and Recovery

Pablo automatically creates backups during processing. If something goes wrong:

1. Check for backup files: `*.backup.timestamp`
2. Restore from backup if needed
3. Verify file permissions

### Manual Pipeline Steps

For debugging specific stages:

1. **Preprocess only**:
   ```bash
   node build-presentation.js --preprocess-only
   ```

2. **Marp only**:
   ```bash
   npx marp processed.md --output output.html --theme ./themes/theme.css
   ```

3. **Post-process only**:
   ```bash
   node postprocess-marp-html.js output.html
   ```

## Getting Help

If you encounter issues not covered here:

1. Check the debug output with `DEBUG=*`
2. Verify all dependencies are installed
3. Ensure file permissions are correct
4. Review the build logs for specific error messages

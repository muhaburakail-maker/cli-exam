const { validateProjectName, validateDirectoryPath } = require('../utils/validators');

describe('validators', () => {
  describe('validateProjectName', () => {
    it('should accept valid project names', () => {
      const result = validateProjectName('my-project');
      expect(result.valid).toBe(true);
    });

    it('should reject empty project names', () => {
      const result = validateProjectName('');
      expect(result.valid).toBe(false);
    });

    it('should reject names with invalid characters', () => {
      const result = validateProjectName('my@project');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateDirectoryPath', () => {
    it('should validate existing directory', async () => {
      const result = await validateDirectoryPath('.');
      expect(result.valid).toBe(true);
    });
  });
});

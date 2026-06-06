const { sanitizeProjectName, getTemplateDisplayName } = require('../utils/helpers');

describe('helpers', () => {
  describe('sanitizeProjectName', () => {
    it('should convert spaces to hyphens', () => {
      expect(sanitizeProjectName('my project')).toBe('my-project');
    });

    it('should remove special characters', () => {
      expect(sanitizeProjectName('my@project#1')).toBe('myproject1');
    });

    it('should handle empty string', () => {
      expect(sanitizeProjectName('   ')).toBe('');
    });
  });

  describe('getTemplateDisplayName', () => {
    it('should return display name for known template', () => {
      expect(getTemplateDisplayName('rwanda-exam')).toBe('Rwanda National Exam Practice');
    });

    it('should return template id for unknown template', () => {
      expect(getTemplateDisplayName('unknown-template')).toBe('unknown-template');
    });
  });
});

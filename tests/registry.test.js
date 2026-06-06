const {
  getAllTemplates,
  getTemplate,
  getTemplateGitHubUrl,
  searchTemplates,
  getCategories,
  templateExists,
  getFeaturedTemplates,
} = require('../marketplace/registry');

describe('registry', () => {
  describe('getAllTemplates', () => {
    it('should return all templates', () => {
      const templates = getAllTemplates();
      expect(templates.length).toBe(8);
    });

    it('should return array of template objects', () => {
      const templates = getAllTemplates();
      expect(templates[0]).toHaveProperty('id');
      expect(templates[0]).toHaveProperty('name');
      expect(templates[0]).toHaveProperty('github');
    });
  });

  describe('getTemplate', () => {
    it('should return template by id', () => {
      const template = getTemplate('rwanda-exam');
      expect(template).toBeDefined();
      expect(template.name).toBe('Rwanda National Exam Practice');
    });

    it('should return undefined for unknown template', () => {
      const template = getTemplate('unknown');
      expect(template).toBeUndefined();
    });
  });

  describe('getTemplateGitHubUrl', () => {
    it('should construct GitHub URL', () => {
      const url = getTemplateGitHubUrl({ github: 'owner/repo' });
      expect(url).toBe('https://github.com/owner/repo');
    });

    it('should throw for template without github', () => {
      expect(() => getTemplateGitHubUrl({ id: 'test' })).toThrow();
    });
  });

  describe('searchTemplates', () => {
    it('should find templates by keyword', () => {
      const results = searchTemplates('exam');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', () => {
      const results = searchTemplates('xyznonexistent');
      expect(results.length).toBe(0);
    });
  });

  describe('getCategories', () => {
    it('should return unique categories', () => {
      const categories = getCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('education');
    });
  });

  describe('templateExists', () => {
    it('should return true for existing template', () => {
      expect(templateExists('rwanda-exam')).toBe(true);
    });

    it('should return false for unknown template', () => {
      expect(templateExists('unknown')).toBe(false);
    });
  });

  describe('getFeaturedTemplates', () => {
    it('should return limited number of templates', () => {
      const featured = getFeaturedTemplates(3);
      expect(featured.length).toBe(3);
    });

    it('should return all when limit exceeds total', () => {
      const featured = getFeaturedTemplates(100);
      expect(featured.length).toBe(8);
    });
  });
});

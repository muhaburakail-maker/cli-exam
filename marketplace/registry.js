/**
 * Template Registry and Marketplace
 * 
 * Manages available templates, their metadata, and sources
 */

const { writeJSON, success } = require('../utils/helpers');

/**
 * Template Marketplace Registry
 * Defines all available templates and their sources
 */
const TEMPLATES_REGISTRY = {
  templates: [
    {
      id: 'rwanda-exam',
      name: 'Rwanda National Exam Practice',
      description: 'Complete platform for Rwanda national exam practice and management',
      version: '1.0.0',
      category: 'education',
      github: 'muhaburakail-maker/cli-exam',
      features: ['Exam Practice', 'Analytics', 'User Management', 'Reports'],
      tags: ['exam', 'education', 'rwanda'],
    },
    {
      id: 'cbt-system',
      name: 'CBT Examination System',
      description: 'Computer-Based Testing platform for online examinations',
      version: '1.0.0',
      category: 'education',
      github: 'muhaburakail-maker/cli-exam',
      features: ['Online Tests', 'Timer', 'Analytics', 'Randomization'],
      tags: ['exam', 'cbt', 'online-testing'],
    },
    {
      id: 'school-management',
      name: 'School Management System',
      description: 'Complete school administration and management system',
      version: '1.0.0',
      category: 'education',
      github: 'muhaburakail-maker/cli-exam',
      features: ['Student Management', 'Grades', 'Attendance', 'Staff Portal'],
      tags: ['school', 'management', 'education'],
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Platform',
      description: 'Full-featured e-commerce platform with payments and inventory',
      version: '1.0.0',
      category: 'commerce',
      github: 'muhaburakail-maker/cli-exam',
      features: ['Product Catalog', 'Shopping Cart', 'Payments', 'Orders'],
      tags: ['ecommerce', 'shopping', 'store'],
    },
    {
      id: 'investment',
      name: 'Investment Platform',
      description: 'Investment management and portfolio tracking platform',
      version: '1.0.0',
      category: 'finance',
      github: 'muhaburakail-maker/cli-exam',
      features: ['Portfolio Tracking', 'Analytics', 'Transactions', 'Reports'],
      tags: ['investment', 'finance', 'portfolio'],
    },
    {
      id: 'order-grabbing',
      name: 'Order Grabbing Platform',
      description: 'Delivery and order management platform',
      version: '1.0.0',
      category: 'delivery',
      github: 'muhaburakail-maker/cli-exam',
      features: ['Order Management', 'Tracking', 'Driver Management', 'Payments'],
      tags: ['delivery', 'orders', 'logistics'],
    },
    {
      id: 'hotel-management',
      name: 'Hotel Management System',
      description: 'Complete hotel management and booking system',
      version: '1.0.0',
      category: 'hospitality',
      github: 'muhaburakail-maker/cli-exam',
      features: ['Reservations', 'Room Management', 'Billing', 'Guest Management'],
      tags: ['hotel', 'hospitality', 'booking'],
    },
    {
      id: 'hospital-management',
      name: 'Hospital Management System',
      description: 'Hospital and healthcare management system',
      version: '1.0.0',
      category: 'healthcare',
      github: 'muhaburakail-maker/cli-exam',
      features: ['Patient Management', 'Appointments', 'Medical Records', 'Billing'],
      tags: ['hospital', 'healthcare', 'medical'],
    },
  ],
};

/**
 * Get all available templates
 */
function getAllTemplates() {
  return TEMPLATES_REGISTRY.templates;
}

/**
 * Get template by ID
 */
function getTemplate(templateId) {
  return TEMPLATES_REGISTRY.templates.find((t) => t.id === templateId);
}

/**
 * Get template GitHub URL
 */
function getTemplateGitHubUrl(template) {
  if (!template.github) {
    throw new Error(`Template ${template.id} does not have a GitHub repository configured`);
  }
  return `https://github.com/${template.github}`;
}

/**
 * Search templates by keyword
 */
function searchTemplates(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return TEMPLATES_REGISTRY.templates.filter(
    (template) =>
      template.name.toLowerCase().includes(lowerKeyword) ||
      template.description.toLowerCase().includes(lowerKeyword) ||
      template.tags.some((tag) => tag.includes(lowerKeyword))
  );
}

/**
 * Filter templates by category
 */
function getTemplatesByCategory(category) {
  return TEMPLATES_REGISTRY.templates.filter((t) => t.category === category);
}

/**
 * Get all categories
 */
function getCategories() {
  const categories = new Set(TEMPLATES_REGISTRY.templates.map((t) => t.category));
  return Array.from(categories);
}

/**
 * Validate template exists
 */
function templateExists(templateId) {
  return TEMPLATES_REGISTRY.templates.some((t) => t.id === templateId);
}

/**
 * Add custom template to registry (for extensions)
 */
function addTemplate(template) {
  if (!template.id || !template.name) {
    throw new Error('Template must have id and name');
  }

  // Check if template already exists
  if (templateExists(template.id)) {
    throw new Error(`Template ${template.id} already exists`);
  }

  TEMPLATES_REGISTRY.templates.push(template);
  success(`Added custom template: ${template.name}`);
}

/**
 * Update template metadata
 */
function updateTemplate(templateId, updates) {
  const template = getTemplate(templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  Object.assign(template, updates);
  success(`Updated template: ${templateId}`);
}

/**
 * Get featured templates
 */
function getFeaturedTemplates(limit = 6) {
  return TEMPLATES_REGISTRY.templates.slice(0, limit);
}

/**
 * Get template with full details
 */
function getTemplateDetails(templateId) {
  const template = getTemplate(templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  return {
    ...template,
    githubUrl: getTemplateGitHubUrl(template),
    createdAt: new Date().toISOString(),
    downloads: 0, // This could be fetched from a server
  };
}

/**
 * Export registry to JSON
 */
async function exportRegistry(filePath) {
  await writeJSON(filePath, TEMPLATES_REGISTRY, true);
  success(`Registry exported to ${filePath}`);
}

/**
 * List templates in a formatted way
 */
function listTemplates(verbose = false) {
  console.log('\n');
  TEMPLATES_REGISTRY.templates.forEach((template, index) => {
    const prefix = `${index + 1}.`;
    console.log(`  ${prefix} ${template.name}`);
    if (verbose) {
      console.log(`     ID: ${template.id}`);
      console.log(`     Description: ${template.description}`);
      console.log(`     Features: ${template.features.join(', ')}`);
    }
  });
  console.log('\n');
}

module.exports = {
  TEMPLATES_REGISTRY,
  getAllTemplates,
  getTemplate,
  getTemplateGitHubUrl,
  searchTemplates,
  getTemplatesByCategory,
  getCategories,
  templateExists,
  addTemplate,
  updateTemplate,
  getFeaturedTemplates,
  getTemplateDetails,
  exportRegistry,
  listTemplates,
};

/**
 * MyExam Framework - Main Export
 * 
 * Exports all public APIs and utilities for the framework
 */

module.exports = {
  // Commands
  commands: {
    initialize: require('./commands/initialize'),
    create: require('./commands/create'),
    import: require('./commands/import'),
  },

  // Services
  services: {
    templateService: require('./services/template-service'),
    databaseService: require('./services/database-service'),
    dependencyService: require('./services/dependency-service'),
  },

  // Engines
  engines: {
    mergeEngine: require('./engines/merge-engine'),
    replaceEngine: require('./engines/replace-engine'),
    installerEngine: require('./engines/installer-engine'),
  },

  // Utilities
  utils: {
    helpers: require('./utils/helpers'),
    validators: require('./utils/validators'),
    logger: require('./utils/logger'),
  },

  // Marketplace
  marketplace: require('./marketplace/registry'),

  // Version
  version: require('./package.json').version,
};

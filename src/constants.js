/*
  * Constants(roles, access scopes, etc.).
  */

const USER_ROLE = {
  TOPCODER_ADMIN: 'administrator',
  MANAGER: 'Connect Manager',
  TOPCODER_ACCOUNT_MANAGER: 'Connect Account Manager',
  COPILOT: 'Connect Copilot',
  CONNECT_ADMIN: 'Connect Admin',
  COPILOT_MANAGER: 'Connect Copilot Manager',
  BUSINESS_DEVELOPMENT_REPRESENTATIVE: 'Business Development Representative',
  PRESALES: 'Presales',
  ACCOUNT_EXECUTIVE: 'Account Executive',
  PROGRAM_MANAGER: 'Program Manager',
  SOLUTION_ARCHITECT: 'Solution Architect',
  PROJECT_MANAGER: 'Project Manager',
  TOPCODER_USER: 'Topcoder User'
}

const ADMIN_ROLES = [USER_ROLE.CONNECT_ADMIN, USER_ROLE.TOPCODER_ADMIN]

const MANAGER_ROLES = [
  ...ADMIN_ROLES,
  USER_ROLE.MANAGER,
  USER_ROLE.TOPCODER_ACCOUNT_MANAGER,
  USER_ROLE.COPILOT_MANAGER,
  USER_ROLE.BUSINESS_DEVELOPMENT_REPRESENTATIVE,
  USER_ROLE.PRESALES,
  USER_ROLE.ACCOUNT_EXECUTIVE,

  USER_ROLE.PROGRAM_MANAGER,
  USER_ROLE.SOLUTION_ARCHITECT,
  USER_ROLE.PROJECT_MANAGER
]

const M2M_SCOPES = {
  // for backward compatibility we should allow ALL M2M operations with `CONNECT_PROJECT_ADMIN`
  CONNECT_PROJECT_ADMIN: 'all:connect_project',
  PROJECTS: {
    ALL: 'all:projects',
    WRITE: 'write:projects'
  }
}

const SequelizeCLSNamespace = 'skills-api'

const API_ACTION = {
  SkillCreate: 'skill.create',
  SkillUpdate: 'skill.update',
  SkillDelete: 'skill.delete',
  SkillPutMetadata: 'skill.putMetadata',
  SkillPatchMetadata: 'skill.patchMetadata',
  SkillDeleteMetadata: 'skill.deleteMetadata',
  TaxonomyCreate: 'taxonomy.create',
  TaxonomyUpdate: 'taxonomy.update',
  TaxonomyDelete: 'taxonomy.delete',
  TaxonomyPutMetadata: 'taxonomy.putMetadata',
  TaxonomyPatchMetadata: 'taxonomy.patchMetadata',
  TaxonomyDeleteMetadata: 'taxonomy.deleteMetadata'
}

module.exports = {
  MANAGER_ROLES,
  M2M_SCOPES,
  SequelizeCLSNamespace,
  API_ACTION
}

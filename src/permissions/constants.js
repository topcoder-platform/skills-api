/**
 * User permission policies.
 * Can be used with `hasPermission` method.
 *
 * PERMISSION GUIDELINES
 *
 * All the permission name and meaning should define **WHAT** can be done having such permission
 * but not **WHO** can do it.
 *
 * Examples of CORRECT permission naming and meaning:
 *    - `READ_PROJECT`
 *    - `UPDATE_MILESTONE`
 *    - `DELETE_WORK`
 *
 * Examples of INCORRECT permissions naming and meaning:
 *    - `COPILOT_AND_MANAGER`
 *    - `PROJECT_MEMBERS`
 *    - `ADMINS`
 *
 * The same time **internally only** in this file, constants like `COPILOT_AND_ABOVE`,
 * `PROJECT_MEMBERS`, `ADMINS` could be used to define permissions.
 *
 * NAMING GUIDELINES
 *
 * There are unified prefixes to indicate what kind of permissions.
 * If no prefix is suitable, please, feel free to use a new prefix.
 *
 * CREATE_ - create somethings
 * READ_   - read something
 * UPDATE_ - update something
 * DELETE_ - delete something
 *
 * MANAGE_ - means combination of 3 operations CREATE/UPDATE/DELETE.
 *           usually should be used, when READ operation is allowed to everyone
 *           while 3 manage operations require additional permissions
 * ACCESS_ - means combination of all 4 operations READ/CREATE/UPDATE/DELETE.
 *           usually should be used, when by default users cannot even READ something
 *           and if someone can READ, then also can do other kind of operations.
 *
 * ANTI-PERMISSIONS
 *
 * If it's technically impossible to create permission rules for some situation in "allowed" manner,
 * in such case we can create permission rules, which would disallow somethings.
 * - Create such rules ONLY IF CREATING ALLOW RULE IS IMPOSSIBLE.
 * - Add a comment to such rules explaining why allow-rule cannot be created.
 */

const {
  MANAGER_ROLES: TOPCODER_ROLES_MANAGERS_AND_ADMINS,
  M2M_SCOPES
} = require('../constants')

/**
 * M2M scopes to "write" projects
 */
// Commented out because it appears to be unused
// const SCOPES_PROJECTS_WRITE = [
//   M2M_SCOPES.CONNECT_PROJECT_ADMIN,
//   M2M_SCOPES.PROJECTS.ALL,
//   M2M_SCOPES.PROJECTS.WRITE
// ]

/**
 * The full list of possible permission rules
 */
const PERMISSION = {
  /*
   * Skill
   */
  CREATE_SKILL: {
    meta: {
      title: 'Create Skill',
      group: 'Skill'
    },
    topcoderRoles: TOPCODER_ROLES_MANAGERS_AND_ADMINS,
    scopes: [M2M_SCOPES.SKILLS.CREATE, M2M_SCOPES.SKILLS.ALL]
  },

  UPDATE_SKILL: {
    meta: {
      title: 'Update Skill',
      group: 'Skill'
    },
    topcoderRoles: TOPCODER_ROLES_MANAGERS_AND_ADMINS,
    scopes: [M2M_SCOPES.SKILLS.UPDATE, M2M_SCOPES.SKILLS.ALL]
  },

  DELETE_SKILL: {
    meta: {
      title: 'Delete Skill',
      group: 'Skill'
    },
    topcoderRoles: TOPCODER_ROLES_MANAGERS_AND_ADMINS,
    scopes: [M2M_SCOPES.SKILLS.DELETE, M2M_SCOPES.SKILLS.ALL]
  },

  /*
   * Skill Metadata
   */
  ADD_SKILL_METADATA: {
    meta: {
      title: 'Add Skill Metadata',
      group: 'Skill Metadata',
      description: 'Add metadata fields in a skill'
    },
    topcoderRoles: TOPCODER_ROLES_MANAGERS_AND_ADMINS,
    scopes: [M2M_SCOPES.SKILLS.CREATE, M2M_SCOPES.SKILLS.ALL]
  },

  UPDATE_SKILL_METADATA: {
    meta: {
      title: 'Update Skill Metadata',
      group: 'Skill Metadata',
      description: 'Update Metadata fields from a skill'
    },
    topcoderRoles: TOPCODER_ROLES_MANAGERS_AND_ADMINS,
    scopes: [M2M_SCOPES.SKILLS.UPDATE, M2M_SCOPES.SKILLS.ALL]
  },

  DELETE_SKILL_METADATA: {
    meta: {
      title: 'Delete Skill Metadata',
      group: 'Skill Metadata',
      description: 'Delete Metadata fields from a skill'
    },
    topcoderRoles: TOPCODER_ROLES_MANAGERS_AND_ADMINS,
    scopes: [M2M_SCOPES.SKILLS.DELETE, M2M_SCOPES.SKILLS.ALL]
  },

  /*
   * Taxonomy
   */
  CREATE_TAXONOMY: {
    meta: {
      title: 'Create Taxonomy',
      group: 'Taxonomy'
    },
    topcoderRoles: TOPCODER_ROLES_MANAGERS_AND_ADMINS,
    scopes: [M2M_SCOPES.TAXONOMIES.CREATE, M2M_SCOPES.TAXONOMIES.ALL]
  },

  UPDATE_TAXONOMY: {
    meta: {
      title: 'Update Taxonomy',
      group: 'Taxonomy'
    },
    topcoderRoles: TOPCODER_ROLES_MANAGERS_AND_ADMINS,
    scopes: [M2M_SCOPES.TAXONOMIES.UPDATE, M2M_SCOPES.TAXONOMIES.ALL]
  },

  DELETE_TAXONOMY: {
    meta: {
      title: 'Delete Taxonomy',
      group: 'Taxonomy'
    },
    topcoderRoles: TOPCODER_ROLES_MANAGERS_AND_ADMINS,
    scopes: [M2M_SCOPES.TAXONOMIES.DELETE, M2M_SCOPES.TAXONOMIES.ALL]
  },

  /*
   * Taxonomy Metadata
   */
  ADD_TAXONOMY_METADATA: {
    meta: {
      title: 'Add Taxonomy Metadata',
      group: 'Taxonomy Metadata',
      description: 'Add metadata fields in a taxonomy'
    },
    topcoderRoles: TOPCODER_ROLES_MANAGERS_AND_ADMINS,
    scopes: [M2M_SCOPES.TAXONOMIES.CREATE, M2M_SCOPES.TAXONOMIES.ALL]
  },

  UPDATE_TAXONOMY_METADATA: {
    meta: {
      title: 'Update Taxonomy Metadata',
      group: 'Taxonomy Metadata',
      description: 'Update Metadata fields from a taxonomy'
    },
    topcoderRoles: TOPCODER_ROLES_MANAGERS_AND_ADMINS,
    scopes: [M2M_SCOPES.TAXONOMIES.UPDATE, M2M_SCOPES.TAXONOMIES.ALL]
  },

  DELETE_TAXONOMY_METADATA: {
    meta: {
      title: 'Delete Taxonomy Metadata',
      group: 'Taxonomy Metadata',
      description: 'Delete Metadata fields from a taxonomy'
    },
    topcoderRoles: TOPCODER_ROLES_MANAGERS_AND_ADMINS,
    scopes: [M2M_SCOPES.TAXONOMIES.DELETE, M2M_SCOPES.TAXONOMIES.ALL]
  }
}

module.exports = {
  PERMISSION
}

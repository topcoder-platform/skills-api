# Automated testing using Postman + Newman
## Configurations

- All configurations are set in [/config/test.js](../../config/test.js).
- All test data is set in [/test/postman/testData](testData/).

## Running the tests locally

- Follow the steps from the [Readme](../../ReadMe.md)

## Running the tests on CircleCI

- With every commit in the `develop` branch, and after the API is deployed on the development environment, a `Run-Newman-Test` job is created on CircleCI.
- You need to approve this step in order to trigger the test execution.
- The progress as well as the results can be monitored within CircleCI and the final result (pass/fail) will also be visible on the repository page on Github.
- If you simply want to trigger the tests, you can either rerun the test workflow from within CircleCI or push an empty commit to trigger a new deployment.
## Testing summary

The following scenarios have been tested:

- create taxonomy by admin
- create taxonomy by m2m
- create taxonomy with all kinds of invalid request body
- create taxonomy with all kinds of invalid token
- list taxonomies by admin
- list taxonomies by m2m
- list taxonomies by copilot
- list taxonomies by user
- list taxonomies by anonymous
- list taxonomies with various parameters
- list taxonomies with invalid parameters
- head taxonomies by admin
- head taxonomies by m2m
- head taxonomies by copilot
- head taxonomies by user
- head taxonomies by anonymous
- head taxonomies with various parameters
- head taxonomies with invalid parameters
- get taxonomy by admin
- get taxonomy by m2m
- get taxonomy by copilot
- get taxonomy by user
- get taxonomy by anonymous
- get taxonomy with invalid requests
- head taxonomy by admin
- head taxonomy by m2m
- head taxonomy by copilot
- head taxonomy by user
- head taxonomy by anonymous
- head taxonomy with invalid requests
- patch taxonomy by admin
- patch taxonomy by m2m
- patch taxonomy with all kinds of invalid request body
- patch taxonomy with all kinds of invalid token
- update taxonomy by admin
- update taxonomy by m2m
- update taxonomy with all kinds of invalid request body
- update taxonomy with all kinds of invalid token
- delete taxonomy by admin
- delete taxonomy by m2m
- delete taxonomy with all kinds of invalid request
- create skill by admin
- create skill by m2m
- create skill with all kinds of invalid request body
- create skill with all kinds of invalid token
- list skills by admin
- list skills by m2m
- list skills by copilot
- list skills by user
- list skills by anonymous
- list skills with various parameters
- list skills with invalid parameters
- head skills by admin
- head skills by m2m
- head skills by copilot
- head skills by user
- head skills by anonymous
- head skills with various parameters
- head skills with invalid parameters
- get skill by admin
- get skill by m2m
- get skill by copilot
- get skill by user
- get skill by anonymous
- get skill with invalid requests
- head skill by admin
- head skill by m2m
- head skill by copilot
- head skill by user
- head skill by anonymous
- head skill with invalid requests
- patch skill by admin
- patch skill by m2m
- patch skill with all kinds of invalid request body
- patch skill with all kinds of invalid token
- update skill by admin
- update skill by m2m
- update skill with all kinds of invalid request body
- update skill with all kinds of invalid token
- delete skill by admin
- delete skill by m2m
- delete skill with all kinds of invalid request


### Roles tested

- M2M
- Admin
- Copilot
- User

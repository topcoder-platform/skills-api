# Clear Testing data which are from Postman Tests

## How to clear the Postman related testing data
- To summarize, simply run below command after running the Postman tests.
```
  npm run test:newman:clear
```
- You should follow the ReadMe.md to run the tests. Then you will get output like below:
```
> NODE_ENV=test node test/postman/clearTestData.js

2021-08-27T12:54:12.608Z info: 	Clear the Postman test data.
2021-08-27T12:54:13.831Z info: 	Completed!
```
From the API console, you can find the output like:
```
2021-08-27T12:54:13.499Z debug:         ENTER Method 'cleanup/service.cleanUpTestData'
2021-08-27T12:54:13.499Z debug:         ##input arguments, {}
2021-08-27T12:54:13.499Z info:  Start clean up the test data from postman test!
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): START TRANSACTION;
2021-08-27T12:54:13.508Z info:  Delete postman records Skill
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): SELECT * FROM "Skills" where name like 'POSTMANE2E-%'
2021-08-27T12:54:13.511Z debug:         Deleting records with id: 
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): SELECT "id", "createdBy", "updatedBy", "name", "externalId", "uri", "metadata", "created", "updated", "taxonomyId" FROM "Skills" AS "Skill" WHERE "Skill"."id" = '28b300d0-ae3d-40d3-96a0-4fd6b58204e4';
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): DELETE FROM "Skills" WHERE "id" = '28b300d0-ae3d-40d3-96a0-4fd6b58204e4'
2021-08-27T12:54:13.548Z debug:         Deleting records with id: 
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): SELECT "id", "createdBy", "updatedBy", "name", "externalId", "uri", "metadata", "created", "updated", "taxonomyId" FROM "Skills" AS "Skill" WHERE "Skill"."id" = '4fd24ed0-f033-440a-8104-e0456f3ccb0a';
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): DELETE FROM "Skills" WHERE "id" = '4fd24ed0-f033-440a-8104-e0456f3ccb0a'
2021-08-27T12:54:13.586Z debug:         Deleting records with id: 
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): SELECT "id", "createdBy", "updatedBy", "name", "externalId", "uri", "metadata", "created", "updated", "taxonomyId" FROM "Skills" AS "Skill" WHERE "Skill"."id" = 'e629a663-6257-4296-8fbe-d67f2728886b';
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): DELETE FROM "Skills" WHERE "id" = 'e629a663-6257-4296-8fbe-d67f2728886b'
2021-08-27T12:54:13.613Z debug:         Deleting records with id: 
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): SELECT "id", "createdBy", "updatedBy", "name", "externalId", "uri", "metadata", "created", "updated", "taxonomyId" FROM "Skills" AS "Skill" WHERE "Skill"."id" = 'b76f574a-cc11-430d-bd02-853b76e77f26';
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): DELETE FROM "Skills" WHERE "id" = 'b76f574a-cc11-430d-bd02-853b76e77f26'
2021-08-27T12:54:13.651Z info:  Delete postman records Taxonomy
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): SELECT * FROM "Taxonomies" where name like 'POSTMANE2E-%'
2021-08-27T12:54:13.653Z debug:         Deleting records with id: 
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): SELECT "id", "createdBy", "updatedBy", "name", "metadata", "created", "updated" FROM "Taxonomies" AS "Taxonomy" WHERE "Taxonomy"."id" = 'ba742dae-34a4-48a5-bdc9-8e8f9b015ce1';
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): DELETE FROM "Taxonomies" WHERE "id" = 'ba742dae-34a4-48a5-bdc9-8e8f9b015ce1'
2021-08-27T12:54:13.679Z debug:         Deleting records with id: 
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): SELECT "id", "createdBy", "updatedBy", "name", "metadata", "created", "updated" FROM "Taxonomies" AS "Taxonomy" WHERE "Taxonomy"."id" = 'f7838d83-76d8-4d9d-8125-3a97678bd83a';
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): DELETE FROM "Taxonomies" WHERE "id" = 'f7838d83-76d8-4d9d-8125-3a97678bd83a'
2021-08-27T12:54:13.713Z debug:         Deleting records with id: 
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): SELECT "id", "createdBy", "updatedBy", "name", "metadata", "created", "updated" FROM "Taxonomies" AS "Taxonomy" WHERE "Taxonomy"."id" = '0a7987e9-0969-4cd2-813e-5d49c7bfe46d';
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): DELETE FROM "Taxonomies" WHERE "id" = '0a7987e9-0969-4cd2-813e-5d49c7bfe46d'
2021-08-27T12:54:13.759Z debug:         Deleting records with id: 
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): SELECT "id", "createdBy", "updatedBy", "name", "metadata", "created", "updated" FROM "Taxonomies" AS "Taxonomy" WHERE "Taxonomy"."id" = '93c288be-1787-4d4b-a342-fa865a48cd92';
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): DELETE FROM "Taxonomies" WHERE "id" = '93c288be-1787-4d4b-a342-fa865a48cd92'
2021-08-27T12:54:13.788Z debug:         Deleting records with id: 
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): SELECT "id", "createdBy", "updatedBy", "name", "metadata", "created", "updated" FROM "Taxonomies" AS "Taxonomy" WHERE "Taxonomy"."id" = '13dac351-e2d1-45b7-b049-ef8753f67854';
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): DELETE FROM "Taxonomies" WHERE "id" = '13dac351-e2d1-45b7-b049-ef8753f67854'
Executing (7c33d1b9-b826-4f8a-8dfc-504473c2dc28): COMMIT;
2021-08-27T12:54:13.829Z info:  Finish clean up the test data from postman test!
2021-08-27T12:54:13.829Z debug:         ##output arguments, No any result returned
2021-08-27T12:54:13.829Z debug:         EXIT Method 'cleanup/service.cleanUpTestData'
```
## Strategy
1. Setup the `AUTOMATED_TESTING_NAME_PREFIX` from the test environment. This prefix should be a name that will never be used 
set as part of the skill/taxonomy name. e.g. 'POSTMANE2E-'. In this case, the created `Skill`/`Taxonomy` will have a name like 'POSTMANE2E-skill-01'.

2. You can use use Postman's mock server for the bus api. You can refer to https://drive.google.com/file/d/1GXMzyqpzwix-LDBwieiRFfpJlJxrTIgI/view?usp=sharing
   for details. You need to update the environment variable `BUSAPI_URL` to your Postman mock server.
  
3. Steps of clearing the test data from Postman tests.
   * Find all `Skill` records whose names are starting with `AUTOMATED_TESTING_NAME_PREFIX`. And delete those records from both DB and ES.
   * Find all `Taxonomy` records whose names are starting with `AUTOMATED_TESTING_NAME_PREFIX`. And delete those records from both DB and ES.

4. Note, in production enviroment, there is no need to run `npm run insert-data`.

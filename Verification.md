# Topcoder Skills API

## E2E testing with Postman

You should be able to find the tests result from the command window of running `npm run test:newman` for each test case.

Below is a sample output result of finding resources by member.

```
skill-api

Iteration 1/3

❏ taxonomies / create taxonomy
↳ create taxonomy by admin
  POST http://127.0.0.1:3001/api/1.0/taxonomies [200 OK, 449B, 84ms]
  ✓  Status code is 200

Iteration 2/3

↳ create taxonomy by admin
  POST http://127.0.0.1:3001/api/1.0/taxonomies [200 OK, 447B, 34ms]
  ✓  Status code is 200

Iteration 3/3

↳ create taxonomy by admin
  POST http://127.0.0.1:3001/api/1.0/taxonomies [200 OK, 404B, 33ms]
  ✓  Status code is 200

┌─────────────────────────┬───────────────────┬──────────────────┐
│                         │          executed │           failed │
├─────────────────────────┼───────────────────┼──────────────────┤
│              iterations │                 3 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│                requests │                 3 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│            test-scripts │                 3 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│      prerequest-scripts │                 3 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│              assertions │                 3 │                0 │
├─────────────────────────┴───────────────────┴──────────────────┤
│ total run duration: 273ms                                      │
├────────────────────────────────────────────────────────────────┤
│ total data received: 496B (approx)                             │
├────────────────────────────────────────────────────────────────┤
│ average response time: 50ms [min: 33ms, max: 84ms, s.d.: 23ms] │
└────────────────────────────────────────────────────────────────┘
```

Then you can run `npm run test:newman:clear` to delete all testing data by above postman tests.  
If 'socket hang up' appears while running the `npm run test:newman`. You can increase the `WAIT_TIME` from the `default/test.js`.
 Then run `npm run test:newman:clear` before calling `npm run test:newman` again.

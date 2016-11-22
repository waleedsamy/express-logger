# express-logger
Logger utils and middleware build upon winstonjs

#### Test
```bash
$ npm test
```

#### configuration
Logger generate human readable logs if configured with `process.env.LOG_FORMAT=pretty`, otherwise it will generate json.

Winston rewriters will mask any critical information based in log `meta` key name, if key name (_case insensitive_) is one of `['password', 'pwd', 'auth', 'authorization', 'cfg']`, it's value will be replaced by `<REDACTED>`, No masking/redacting to any information if you have `NODE_ENV` set to `development`.


#### middleware
 Logger provide two middleware `XRequestId` and `expressWinston` to generate `x-request-id` to distinguish every request and to log every HTTP request details respectively.

 * `XRequestId()`

  express `req.id` will contain a uuid for this request, and it will be available in request response headers as `x-request-id`, putting this id in log message allow you to search inside it with this id, and in return you will get all the logs which generated only while serving this request.

  `x-request-id` will created if no one already existed in `req.headers['x-request-id']`. if one existed (this mean, current micro-service is not the starting point for serving this request), it will be append with the lowercase of service name in `package.json` e.g. `26b3a9be-820c-42b9-965f-323594b1bda3-connectorservice`

  ```javascript
  var XRequestId      = require('./index.js').XRequestId;
  var app = express();
  app.use(XRequestId());
  ```
 * `expressWinston()`

  log all details about any incoming request such as headers, params, responseTime ...

  ```javascript
  var expressWinston      = require('./index.js').expressWinston;
  var app = express();
  app.use(expressWinston());
  ```

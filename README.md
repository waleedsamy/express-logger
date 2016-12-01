# express-logger

Logger utils and middleware build upon winstonjs, severity levels is syslog based.

[![Build Status](https://travis-ci.org/waleedsamy/exwml.svg?branch=master)](https://travis-ci.org/waleedsamy/exwml)

## Test

```bash
$ npm test
```

### configuration

- `process.env.LOG_FORMAT` e.g pretty to generate human readable logs
- `process.env.LOG_LEVEL` e.g debug, default is `info` or `debug` based on your `NODE_ENV`

### Usage

- logger object is available globally, and it provide syslog levels `{ emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7 }`.

- middleware

  - `XRequestId()`

    express `req.id` will be read from `req.headers['x-request-id']` and concatenated with the **package name** or new one is created for this request, and it will be available in request response headers as `x-request-id`.

    ```javascript
    var XRequestId      = require('exwml').XRequestId;
    var app = express();
    app.use(XRequestId());
    ```

  - `expressWinston()`

    log all details about any incoming request such as headers, params, responseTime ...

    ```javascript
    var expressWinston      = require('exwml').expressWinston;
    var app = express();
    app.use(expressWinston());
    ```

### security
 * meta object keys (_case insensitive_) `['password', 'pwd', 'auth', 'authorization', 'cfg']` will be *REDACTED*

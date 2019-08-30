# Remove Directory
Remove a directory in Node with promise


## Install

```bash
npm install @amindunited/remove-directory
```

## Use

```javascript
const path = require('path');
const removeDirectory = require('@amindunited/remove-directory');
const directoryToRemove = path.join(__dirname, 'testing');

removeDirectory(directoryToRemove)
  .then(() => {
    // ... continue
  }, (err) => {
    // ... Oh no, you got an error!
  })

```
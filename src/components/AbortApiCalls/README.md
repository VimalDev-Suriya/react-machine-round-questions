# AbortController

A Builtin JS API, which gives the control to abort the Async functionalities like fetch/event lisenters.

```js
const abort = new AbortController();

console.log(abort); // {signal, control}
```

- `signal` a _AbortSignal_ object that we pass into the async function, so that the correspodning instance of abort controller have a control to cancel them.
- `control` a method which signals the async function which holds the `signal` of corresponding abort instance to cancel them and returns the error as `AbortError`

## Use Cases:

- Aborting the old API calls
- Handling the timeouts from the UI

```js
import fs from 'fs';

const controller = new AbortController();
const { signal } = controller;

// Read a massive log file
fs.readFile('huge-access.log', { signal }, (err, data) => {
  if (err && err.name === 'AbortError') {
    console.log('File read stopped immediately.');
    return;
  }
  // Process data
});

// Watchdog (a Monitoring tool) triggers abort if system memory gets too low
controller.abort();
```

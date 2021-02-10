# DevBook

- Dynamic programming environment
- CLI designed to be installed on some users machine.
- User will be able to launch an interactive development environment inside their browser.
- User will use this environment to write some code and document it at the same time.

### User interaction flow

- user: run `devbook serve`
- arr: start server on localhost:4005
- user: write some code into an editor
- app: bundle in the browser
- app: execute users code in an iframe(disallow cross-frame access so the content inside the iframe can't access the content of the parent document)

### Improved performance with the use if a cashing layer

- Once a npm package is downloaded, it is automatically saved on the client side. When a package is needed, first the client storage is checked and only if it's not already there it reaches out to npm to get it.
- Used `localforage` for interacting with IndexedDB.

### Loading css files

- When importing a css file from JS, ESBuild would bundle a sibling CSS output next to the JS output file, like [this](https://esbuild.github.io/content-types/#css).
- When running a bulndler inside the browser, esbuild doesn't have a file system to work with and as a result won't output the css files
- As a workaround, the css files can be manually appended into a style element of the head tag
- A downside to this is that advanced css features like imports, url links, won't work
- By injecting the css into a JS string, the file must be escaped first(new line and quotes)

### Code execution in the browser

Considerations around code execution:

- User-provided code might throw errors and cause the program to crash(solved with iframe)
- User-provided code might mutate the DOM and cause the program to crash(solved with iframe)
- A user might accidentallly run code provided by another malitious user(solved with iframe AND direct communication disabled)

Create 2 execution contexts with iframe. The default settings allow communication between parent and child:

- parent can access child iframe: `document.querySelector('iframe').contentWindow`
- child can access parent: `parent.SomeParentProp`

Direct communication between frames is allowed when:

- The iframe does not have a 'sandbox' property, or has a 'sandbox' property with a value of "allow-same-origin"(results in less infrastructure, instant access to document - no extra outside requests, but the user will not be able to access local storage, cookies)
- The parent and child are fetched from the exact same Domain & Port & Protocol(extra infrastructure, extra requests and harder to implement since the code is bundled locally)

### Tools

- Initialize a react project with TypeScrypt `npx create-react-app devbook --template typescrypt`

- Install ESBuild web assembly `npm i --save-exact esbuild-wasm@0.8.27`

- Get the link for react source code `npm view react dist.tarball`
- Add localforage for IndexedDB communication `npm install localforage`

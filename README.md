# DevBook

- Dynamic programming environment
- CLI designed to be installed on some users machine.
- User will be able to launch an interactive development environment inside their browser.
- User will use this environment to write some code and document it at the same time.

### Step-by-step implementation

- Initialize a react project with TypeScrypt `npx create-react-app devbook --template typescrypt`

- Install ESBuild web assembly `npm i --save-exact esbuild-wasm@0.8.27`

- Get the link for react source code `npm view react dist.tarball`
- Add localforage for IndexedDB communication `npm install localforage`

### Improve performance by adding a cashing layer

- Once a npm package is downloaded, save it on the client side. When an package is needed, first check the client storage and only if it's not already cached, reach out to npm and get it.
- Use `localforage` for interacting with IndexedDB.

### Loading css files

- When importing a css file from JS, ESBuild would bundle a sibling CSS output next to the JS output file, like [this](https://esbuild.github.io/content-types/#css).
- When running a bulndler inside the browser, esbuild doesn't have a file system to work with and as a result won't output the css files
- As a workaround, the css files can be manually appended into a style element of the head tag
- A downside to this is that advanced css features like imports, url links won't work
- By injecting the css into a JS string, the file must be escaped first(new line and quotes)

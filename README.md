# DevBook

`npx create-react-app jbook --template typescrypt`

`npm i --save-exact esbuild-wasm@0.8.27`

#### Get the link for react source code

`npm view react dist.tarball`

### Caching for big performance

Implement a caching layer:

- Once a npm package is downloaded, save it on the client side.
  When an package is needed, first check the client storage and only if it's not already cached, reach out to npm and get it.
- Use `localforage` for interacting with IndexedDB.

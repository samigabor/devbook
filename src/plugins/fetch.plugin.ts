import axios from "axios";
import * as esbuild from "esbuild-wasm";
import localforage from "localforage";

const fileCache = localforage.createInstance({
  name: "DevBook packages",
});

export const fetchPlugin = (inputCode: string) => ({
  name: "fetch-plugin",
  setup(build: esbuild.PluginBuild) {
    /**
     * Handle root entry file of 'index.js'
     */
    build.onLoad({ filter: /^index\.js/ }, async (args: any) => {
      return {
        loader: "jsx",
        contents: inputCode,
      };
    });

    /**
     * Handle cached files
     */
    build.onLoad({ filter: /.*/ }, async (args: any) => {
      try {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }
      } catch (error) {
        console.error("DevBook cached packages error:", error);
      }
    });

    /**
     * Handle css files
     */
    build.onLoad({ filter: /.css$/ }, async (args: any) => {
      const { data, request } = await axios.get(args.path);
      const escaped = data
        .replace(/\n/g, "")
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'");
      let contents = `
        const style = document.createElement('style');
        style.innerText = '${escaped}';
        document.head.appendChild(style);
      `;
      const result: esbuild.OnLoadResult = {
        loader: "jsx",
        contents,
        resolveDir: new URL("./", request.responseURL).pathname,
      };
      await fileCache.setItem(args.path, result);
      return result;
    });

    /**
     * Handle all other files
     */
    build.onLoad({ filter: /.*/ }, async (args: any) => {
      const { data, request } = await axios.get(args.path);
      const result: esbuild.OnLoadResult = {
        loader: "jsx",
        contents: data,
        resolveDir: new URL("./", request.responseURL).pathname,
      };
      await fileCache.setItem(args.path, result);
      return result;
    });
  },
});

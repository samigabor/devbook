import axios from "axios";
import * as esbuild from "esbuild-wasm";
import localforage from "localforage";

const fileCache = localforage.createInstance({
  name: "DevBook packages",
});

export const fetchPlugin = (inputCode: string) => ({
  name: "fetch-plugin",
  setup(build: esbuild.PluginBuild) {
    build.onLoad({ filter: /.*/ }, async (args: any) => {
      if (args.path === "index.js") {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      }

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

      const { data, request } = await axios.get(args.path);

      let contents = data;
      if (args.path.match(/.css$/)) {
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        contents = `
          const style = document.createElement('style');
          style.innerText = '${escaped}';
          document.head.appendChild(style);
        `;
      }

      const result: esbuild.OnLoadResult = {
        loader: "jsx",
        contents,
        resolveDir: new URL("./", request.responseURL).pathname,
      };
      await fileCache.setItem(args.path, result);

      return result;
    });
  },
});

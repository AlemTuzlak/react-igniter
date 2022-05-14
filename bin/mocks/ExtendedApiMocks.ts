import { removeWhitespace } from "../helpers/removeWhitespace";

export const ExtendedApiMocks = {
  withPathTS: removeWhitespace(`import { AxiosRequestConfig } from 'axios';
  import { BaseApi, apiPrefix } from '../BaseApi';
  class ShopApi extends BaseApi {
    private static instance: ShopApi;
    private constructor() {
      super({ baseURL: \`\${apiPrefix}/shop\` });
    }
    public static getInstance(): ShopApi {
      if (!ShopApi.instance) {
        ShopApi.instance = new ShopApi();
      }
      return ShopApi.instance;
    }
    public getShops = (config?: AxiosRequestConfig) => {
      return this.instance.get('/', config);
    }
    public getShop = (id: string, config?: AxiosRequestConfig) => {
      return this.instance.get(\`/\${id}\`, config);
    }
    public postShop = (data: Record<string, any>, config?: AxiosRequestConfig) => {
      return this.instance.post(\`\`, data, config);
    }
    public patchShop = (id: string, data: Record<string, any>, config?: AxiosRequestConfig) => {   
      return this.instance.patch(\`/\${id}\`, data, config);
    }
    public deleteShop = (id: string, config?: AxiosRequestConfig) => {
      return this.instance.delete(\`/\${id}\`, config);
    }
  }
  export { ShopApi };`),
  withoutPathTS: removeWhitespace(`
  import { AxiosRequestConfig } from 'axios';
    import { BaseApi } from '../BaseApi';
    class ShopApi extends BaseApi {
      private static instance: ShopApi;
      private constructor() {
        super({ baseURL: \`/shop\` });
      }
      public static getInstance(): ShopApi {
        if (!ShopApi.instance) {
          ShopApi.instance = new ShopApi();
        }
        return ShopApi.instance;
      }
      public getShops = (config?: AxiosRequestConfig) => {
        return this.instance.get('/', config);
      }
      public getShop = (id: string, config?: AxiosRequestConfig) => {
        return this.instance.get(\`/\${id}\`, config);
      }
      public postShop = (data: Record<string, any>, config?: AxiosRequestConfig) => {
        return this.instance.post(\`\`, data, config);
      }
      public patchShop = (id: string, data: Record<string, any>, config?: AxiosRequestConfig) => {   
        return this.instance.patch(\`/\${id}\`, data, config);
      }
      public deleteShop = (id: string, config?: AxiosRequestConfig) => {
        return this.instance.delete(\`/\${id}\`, config);
      }
    }
    export { ShopApi };
    `),
  withoutCrudTS: removeWhitespace(`
  import { AxiosRequestConfig } from 'axios';
    import { BaseApi, apiPrefix } from '../BaseApi';
    class ShopApi extends BaseApi {
      private static instance: ShopApi;
      private constructor() {
        super({ baseURL: \`\${apiPrefix}/shop\` });
      }
      public static getInstance(): ShopApi {
        if (!ShopApi.instance) {
          ShopApi.instance = new ShopApi();
        }
        return ShopApi.instance;
      }
    }
    export { ShopApi };
    `),
  withoutCrudJS: removeWhitespace(`
  import { BaseApi, apiPrefix } from '../BaseApi';
    class ShopApi extends BaseApi {
      static instance;
      constructor() {
        super({ baseURL: \`\${apiPrefix}/shop\` });
      }
      static getInstance() {
        if (!ShopApi.instance) {
          ShopApi.instance = new ShopApi();
        }
        return ShopApi.instance;
      }
    }
    export { ShopApi };
    
  `),
  withPathJS: removeWhitespace(`
  import { BaseApi, apiPrefix } from '../BaseApi';
    class ShopApi extends BaseApi {
      static instance;
      constructor() {
        super({ baseURL: \`\${apiPrefix}/shop\` });
      }
      static getInstance() {
        if (!ShopApi.instance) {
          ShopApi.instance = new ShopApi();
        }
        return ShopApi.instance;
      }
      getShops = (config) => {
        return this.instance.get('/', config);
      }
      getShop = (id, config) => {
        return this.instance.get(\`/\${id}\`, config);
      }
      postShop = (data, config) => {
        return this.instance.post(\`\`, data, config);
      }
      patchShop = (id, data, config) => {
        return this.instance.patch(\`/\${id}\`, data, config);
      }
      deleteShop = (id, config) => {
        return this.instance.delete(\`/\${id}\`, config);
      }
    }
    export { ShopApi };
    `),
  withoutPathJS: removeWhitespace(`
  import { BaseApi } from '../BaseApi';
  class ShopApi extends BaseApi {
    static instance;
    constructor() {
      super({ baseURL: \`/shop\` });
    }
    static getInstance() {
      if (!ShopApi.instance) {
        ShopApi.instance = new ShopApi();
      }
      return ShopApi.instance;
    }
    getShops = (config) => {
      return this.instance.get('/', config);
    }
    getShop = (id, config) => {
      return this.instance.get(\`/\${id}\`, config);
    }
    postShop = (data, config) => {
      return this.instance.post(\`\`, data, config);
    }
    patchShop = (id, data, config) => {
      return this.instance.patch(\`/\${id}\`, data, config);
    }
    deleteShop = (id, config) => {
      return this.instance.delete(\`/\${id}\`, config);
    }
  }
  export { ShopApi };`),
};

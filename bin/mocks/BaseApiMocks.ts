import { removeWhitespace } from "../helpers/removeWhitespace";

export const BaseApiMock = {
  withoutPathJS: removeWhitespace(`
  import axios from 'axios';
  class BaseApi {
    constructor(config = {baseURL: \`\`}) {
      this.instance = axios.create(config);
      this._initializeResponseInterceptor();
    }
    _initializeResponseInterceptor = () => {
      this.instance.interceptors.response.use(
        this._handleGlobalResponseSuccess,
        this._handleGlobalResponseError,
      );
    }
    _handleGlobalResponseSuccess = (response) => response;
    _handleGlobalResponseError = (error) => {
      switch (error.status) {
        case 403:
          console.log('Unauthorized')
          break;
      }
      return Promise.reject(error);
    }
  }
  export { BaseApi };`),
  withPathJS: removeWhitespace(`
  import axios from 'axios';
  const apiPrefix = 'test'
  class BaseApi {
    constructor(config = {baseURL: \`\${apiPrefix}\`}) {
      this.instance = axios.create(config);
      this._initializeResponseInterceptor();
    }
    _initializeResponseInterceptor = () => {
      this.instance.interceptors.response.use(
        this._handleGlobalResponseSuccess,
        this._handleGlobalResponseError,
      );
    }
    _handleGlobalResponseSuccess = (response) => response;
    _handleGlobalResponseError = (error) => {
      switch (error.status) {
        case 403:
          console.log('Unauthorized')
          break;
      }
      return Promise.reject(error);
    }
  }
  export { BaseApi, apiPrefix };`),
  withoutPathTS:
    removeWhitespace(`import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
    
  abstract class BaseApi {
    protected readonly instance: AxiosInstance;
 
    public constructor(config: AxiosRequestConfig = {baseURL: \`\`}) {
      this.instance = axios.create(config);
 
      this._initializeResponseInterceptor();
    }
 
    private _initializeResponseInterceptor = () => {
      this.instance.interceptors.response.use(
        this._handleGlobalResponseSuccess,
        this._handleGlobalResponseError,
      );
    }
 
    private _handleGlobalResponseSuccess = (response: AxiosResponse) => response;
 
    private _handleGlobalResponseError = (error: AxiosResponse) => {
      switch (error.status) {
        case 403:
          console.log('Unauthorized')
          break;
      }
      return Promise.reject(error);
    }
  }
 
  export { BaseApi };`),
  withPathTS:
    removeWhitespace(`import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
  const apiPrefix = 'test'
 
  abstract class BaseApi {
    protected readonly instance: AxiosInstance;
 
    public constructor(config: AxiosRequestConfig = {baseURL: \`\${apiPrefix}\`}) {
      this.instance = axios.create(config);
 
      this._initializeResponseInterceptor();
    }
 
    private _initializeResponseInterceptor = () => {
      this.instance.interceptors.response.use(
        this._handleGlobalResponseSuccess,
        this._handleGlobalResponseError,
      );
    }
 
    private _handleGlobalResponseSuccess = (response: AxiosResponse) => response;
 
    private _handleGlobalResponseError = (error: AxiosResponse) => {
      switch (error.status) {
        case 403:
          console.log('Unauthorized')
          break;
      }
      return Promise.reject(error);
    }
  }
 
  export { BaseApi, apiPrefix };`),
};

import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";

import { ManagementClientOptions } from "./ManagementClientOptions";
import { ManagementTokenProvider } from "./ManagementTokenProvider";
import { pickBy } from "./utils";

export interface AuthingRequestConfig extends AxiosRequestConfig {
  body: any;
  mediaType: any;
  unSetToken?: boolean;
}

export class HttpClient {
  options: ManagementClientOptions;
  axios: AxiosInstance;
  tokenProvider: ManagementTokenProvider;

  constructor(options: ManagementClientOptions) {
    this.options = options;
    this.tokenProvider = new ManagementTokenProvider(this.options);
    this.axios = Axios.create({
      withCredentials: true,
    });
  }

  async request(config: AuthingRequestConfig) {
    // 将传入的 body 当作 data
    if (config.method === "POST" && config.body) {
      config.data = config.body;
    }
    const { accessToken, userPoolId } = await this.tokenProvider.getToken();
    const headers: any = {};
    headers[this.options.headers!["tenant-id"]!] = this.options.tenantId;
    headers[this.options.headers!["userpool-id"]] = userPoolId || "";
    headers[this.options.headers!["request-from"]] =
      this.options.requestFrom || "sdk";
    // headers[this.options.headers!["sdk-version"]] = `js:${SDK_VERSION}`;
    headers[this.options.headers!.lang] = this.options.lang || "";

    accessToken && (headers.Authorization = `Bearer ${accessToken}`);

    config.headers = headers;
    config.timeout = this.options.timeout;
    const { data } = await this.axios.request({
      ...config,
      headers: {
        ...pickBy(config.headers, (i) => !!i),
      },
    });
    return data;
  }
}

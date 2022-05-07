export interface Pagination {
  total: number;
  current_page: number;
  per_page: number;
}

export interface OssConfig {
  OSSAccessKeyId: string;
  callback: string;
  dir: string;
  expire: number;
  host: string;
  policy: string;
  signature: string;
}

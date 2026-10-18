/**
 * 内容源抽象。v1.0 只有 LocalContentSource（编译期常量）；
 * 未来接入 CMS 时实现同一接口，由构建脚本在 vite build 之前写入生成物。
 * 禁止在浏览器运行时调用任何远程内容源。
 */
export interface ContentSource<T> {
  list(): Promise<T[]>;
  get(slug: string): Promise<T | null>;
}

export interface ContentSourceConfig {
  kind: 'local' | 'cms';
  cms?: {
    endpoint: string;
    token: string;
    collection: string;
    schemaVersion: number;
  };
}

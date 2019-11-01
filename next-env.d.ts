/// <reference types="next" />
/// <reference types="next/types/global" />

declare var API_KEY: string;

declare module '*.json' {
  const value: any;
  export default value;
}

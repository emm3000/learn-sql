/// <reference path="../.astro/types.d.ts" />

// Allow importing any file with the ?raw Vite query suffix as a string.
// Used by: import sql from '../../seed/classic_company.sql?raw'
declare module '*?raw' {
  const content: string;
  export default content;
}

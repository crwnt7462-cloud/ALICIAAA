// Fait en sorte que TOUT import non stubé soit typé "any" (et donc ignoré)
declare module "*" {
  const anyExport: any;
  export default anyExport;
  export = anyExport;
}

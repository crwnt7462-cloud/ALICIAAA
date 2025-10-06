// utils/slugify.ts
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[0-]/g, '') // accents
    .replace(/[^a-z0-9]+/g, '-') // non-alphanum
    .replace(/(^-|-$)+/g, '') // trim -
    .replace(/--+/g, '-'); // double -
}

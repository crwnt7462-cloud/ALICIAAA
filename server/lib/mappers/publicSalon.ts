/**
 * Whitelist mapper for public salon fields.
 * Returns only safe, public-facing fields and normalizes common column names.
 */

const FIELD_MAP: { [target: string]: string[] } = {
  id: ['id'],
  public_slug: ['public_slug', 'publicSlug'],
  name: ['name'],
  description: ['description', 'bio', 'short_description', 'shortDescription'],
  address: ['business_address', 'address'],
  city: ['city'],
  postal_code: ['postal_code', 'zip', 'postalCode'],
  country: ['country'],
  phone_public: ['business_phone', 'phone_public', 'phone'],
  website: ['website'],
  instagram: ['instagram'],
  facebook: ['facebook'],
  tiktok: ['tiktok'],
  cover_image: ['cover_image_url', 'cover_image', 'coverImageUrl'],
  logo_image: ['logo_image_url', 'logo_image', 'logoImageUrl'],
  colors: ['custom_colors', 'colors', 'customColors'],
  theme: ['theme'],
  timezone: ['timezone'],
  opening_hours: ['horaires', 'opening_hours', 'openingHours'],
  geo_lat: ['geo_lat', 'latitude', 'lat'],
  geo_lng: ['geo_lng', 'longitude', 'lng', 'lon'],
  display_options: ['display_options', 'displayOptions'],
  tags: ['tags'],
  categories: ['service_categories', 'categories', 'serviceCategories'],
  gallery_images: ['gallery_images', 'galleryImages']
};

// Explicit blacklist: never return these fields even if present in DB
const SENSITIVE_PREFIXES = ['stripe_', 'webhook_', 'debug_', 'internal_', 'trial_'];
const SENSITIVE_FIELDS = new Set([
  'owner_id',
  'owner_email',
  'stripe_account_id',
  'service_role_only',
  'internal_notes'
]);

function isSensitiveKey(k: string) {
  if (SENSITIVE_FIELDS.has(k)) return true;
  for (const p of SENSITIVE_PREFIXES) if (k.startsWith(p)) return true;
  return false;
}

export function pickPublicSalonFields(row: any) {
  if (!row || typeof row !== 'object') return {};

  const out: any = {};

  // map canonical fields
  for (const [target, candidates] of Object.entries(FIELD_MAP)) {
    for (const c of candidates) {
      if (Object.prototype.hasOwnProperty.call(row, c) && row[c] !== undefined) {
        out[target] = row[c];
        break;
      }
    }
  }

  // Ensure gallery_images is an array
  if (!Array.isArray(out.gallery_images)) {
    const raw = row.gallery_images || row.galleryImages || out.gallery_images;
    out.gallery_images = Array.isArray(raw) ? raw : (raw ? [raw] : []);
  }

  // Ensure tags/categories are arrays
  if (!Array.isArray(out.tags)) out.tags = Array.isArray(row.tags) ? row.tags : [];
  if (!Array.isArray(out.categories)) out.categories = Array.isArray(row.categories) ? row.categories : out.categories || [];

  // Normalize colors to object if possible
  if (out.colors && typeof out.colors === 'string') {
    try { out.colors = JSON.parse(out.colors); } catch (e) { /* keep string if not JSON */ }
  }

  // We intentionally do NOT export arbitrary DB fields. Only the mapped FIELD_MAP keys
  // (normalized) are returned. This avoids accidental exposure of billing/legal or
  // any admin fields. If you need more public columns, add them explicitly to FIELD_MAP.

  return out;
}

export const SAFE_SALON_COLUMNS = Object.keys(FIELD_MAP);

/**
 * Flatten services defined inside service categories payloads.
 * Accepts either an already-parsed array of categories or a raw JSON string.
 * Returns an array of normalized PublicService objects.
 */
export function flattenServicesFromCategories(raw: any): any[] {
  if (!raw) return [];
  let categories: any[] = [];
  if (typeof raw === 'string') {
    try { categories = JSON.parse(raw); } catch (e) { return []; }
  } else if (Array.isArray(raw)) {
    categories = raw;
  } else if (raw && typeof raw === 'object' && Array.isArray(raw.categories)) {
    categories = raw.categories;
  } else {
    return [];
  }

  const out: any[] = [];
  for (const cat of categories) {
    const catId = cat?.id ?? cat?.category_id ?? cat?.slug ?? cat?.name;
    const catName = cat?.name ?? cat?.title ?? '';
    const svcList = Array.isArray(cat.services) ? cat.services : Array.isArray(cat.items) ? cat.items : [];
    for (let i = 0; i < svcList.length; i++) {
      const s = svcList[i];
      const svcId = s?.id ?? s?.service_id ?? s?.slug ?? `${catId || catName}-${i}`;
      const name = s?.name ?? s?.service_name ?? '';
      const priceRaw = s?.price ?? s?.amount ?? s?.cost;
      const price = priceRaw != null ? Number(priceRaw) : undefined;
      const priceOk = price !== undefined && !Number.isNaN(price) ? price : undefined;
      const durationRaw = s?.duration ?? s?.minutes ?? s?.time;
      const duration = durationRaw != null ? Number(durationRaw) : undefined;
      const durationOk = duration !== undefined && !Number.isNaN(duration) ? duration : undefined;
      const description = s?.description ?? '';
      const photos = Array.isArray(s?.photos) ? s.photos : Array.isArray(s?.images) ? s.images : [];

      out.push({
        id: svcId,
        name: name,
        price: priceOk,
        duration: durationOk,
        description: description,
        photos: photos,
        categoryId: catId,
        categoryName: catName
      });
    }
  }

  // Deduplicate by id (stringified)
  const seen = new Map<string, any>();
  for (const s of out) {
    const key = String(s.id ?? JSON.stringify({ name: s.name }));
    if (!seen.has(key)) seen.set(key, s);
  }
  return Array.from(seen.values());
}

export const toCitySlug = (city = '') =>
  city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const cityPath = (city) => `/prayer-times/${toCitySlug(city)}`

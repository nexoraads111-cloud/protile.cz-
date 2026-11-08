/** Client project photos from photos123/ — served via /photos123. */

import { GALLERY_FILTERS } from './lib/gallery-category'

const P = (n) => `/photos123/p${String(n).padStart(2, '0')}.jpg`

/** Filter chips for Realizace gallery (Vše + project types present in photos). */
export const CATEGORIES = GALLERY_FILTERS

/**
 * Curated Czech captions + categories for photos123 (matched to actual images).
 * Categories: koupelny | obklady | dlazby
 */
const META = [
  [1, 'koupelny', 'Koupelna — béžový velkoformát a vana'],
  [2, 'koupelny', 'Koupelna — sprchová vanička a obklad'],
  [3, 'koupelny', 'WC — šedý velkoformát a Geberit'],
  [4, 'koupelny', 'Koupelna — vana a béžový velkoformát'],
  [5, 'koupelny', 'Koupelna — šedý mramorový velkoformát'],
  [6, 'koupelny', 'Koupelna — šedý kamenný velkoformát'],
  [7, 'koupelny', 'Koupelna — šedý mramor a rozvody'],
  [8, 'koupelny', 'WC — šedý mramor a závěsné WC'],
  [9, 'dlazby', 'Dlažba — chodba s vyrovnávacím systémem'],
  [10, 'dlazby', 'Dlažba — pokládka v dlouhé chodbě'],
  [11, 'dlazby', 'Dlažba — rozpracovaná pokládka'],
  [12, 'koupelny', 'Koupelna — sprcha s lineárním žlabem'],
  [13, 'dlazby', 'Dlažba — hotová šedá podlaha'],
  [14, 'dlazby', 'Dlažba — pokládka s nivelačními klíny'],
  [15, 'dlazby', 'Dlažba — pokládka s laserem a křížky'],
  [16, 'koupelny', 'Koupelna — obklad vany velkoformátem'],
  [17, 'dlazby', 'Dlažba — šedá podlaha v chodbě'],
  [18, 'koupelny', 'Koupelna — sprcha a příprava WC'],
  [19, 'koupelny', 'Koupelna — sprchový kout a WC'],
  [20, 'koupelny', 'Koupelna — vana a kombinovaný obklad'],
  [21, 'koupelny', 'Koupelna — mramorový obklad a dlažba'],
  [22, 'koupelny', 'Koupelna — vana a krémový velkoformát'],
  [23, 'koupelny', 'Koupelna — kamenný velkoformát a WC'],
  [24, 'koupelny', 'WC — velkoformátový obklad a dlažba'],
  [25, 'koupelny', 'WC — příprava na závěsné WC'],
  [26, 'koupelny', 'WC — alcova s podomítkovým systémem'],
  [27, 'koupelny', 'Koupelna — obklad vany mramorem'],
  [28, 'koupelny', 'Koupelna — světlý obklad a tmavá dlažba'],
  [29, 'koupelny', 'WC — velkoformátový obklad'],
  [30, 'koupelny', 'WC — béžovohnědý velkoformát'],
  [31, 'koupelny', 'Koupelna — sprchové kouty v kamenném dekoru'],
  [32, 'koupelny', 'Koupelna — mramorový velkoformát a příčka'],
  [33, 'koupelny', 'WC — mramorový obklad s podomítkou'],
  [34, 'koupelny', 'Koupelna — mramor, nika a příčka'],
  [35, 'koupelny', 'Koupelna — antracitová vana a niky'],
  [36, 'koupelny', 'Koupelna — šedý velkoformát a niky'],
  [37, 'koupelny', 'Koupelna — tmavě šedý obklad a vana'],
  [38, 'obklady', 'Obklad — precizní dořez u desky'],
  [39, 'koupelny', 'Koupelna — antracit, vana a niky'],
  [40, 'obklady', 'Obklad — kamenický vnější roh'],
  [41, 'obklady', 'Obklad — miterovaný roh bez lišty'],
  [42, 'koupelny', 'Koupelna — béžový obklad s vanou'],
  [43, 'koupelny', 'Koupelna — pokládka dlažby s klíny'],
  [44, 'koupelny', 'Koupelna — šedý velkoformát nad vanou'],
]

/** Full gallery — every photos123 image */
export const gallery = META.map(([n, category, title]) => ({
  id: `p${String(n).padStart(2, '0')}`,
  title,
  image: P(n),
  category,
}))

export const photos = {
  /** Luxury bathroom — layout-ref match (not construction WIP). */
  hero: '/photos123/hero-luxury.webp',
  heroJpg: '/photos123/hero-luxury.jpg',
  about: '/photos123/feat-grey.jpg',
  contactBg: P(12),
  services: {
    bathroom: '/photos123/feat-bath.jpg',
    tiles: '/photos123/feat-stone.jpg',
    stairs: '/photos123/feat-floor.jpg',
    facade: P(32),
    niche: P(26),
  },
  chip: '/photos123/feat-grey.jpg',
  realizations: gallery,
}

export function findGalleryIndex(imagePath) {
  const i = gallery.findIndex((g) => g.image === imagePath)
  return i >= 0 ? i : 0
}

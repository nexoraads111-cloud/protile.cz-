/** Client project photos from photos123/ — served via /photos123. */

const P = (n) => `/photos123/p${String(n).padStart(2, '0')}.jpg`

export const CATEGORIES = [
  { id: 'all', label: 'Vše' },
  { id: 'koupelny', label: 'Koupelny' },
  { id: 'obklady', label: 'Obklady' },
  { id: 'kamen', label: 'Kámen / mramor' },
  { id: 'schody', label: 'Dlažba / chodby' },
]

/** Curated titles for photos123 set (real project documentation). */
const META = [
  [1, 'koupelny', 'Koupelna — béžový velkoformát'],
  [2, 'koupelny', 'Koupelna — roh a vana'],
  [3, 'koupelny', 'Koupelna — obklad stěn'],
  [4, 'kamen', 'Sprcha — mramorový obklad'],
  [5, 'kamen', 'Sprcha — žíhaný kámen'],
  [6, 'kamen', 'Sprcha — detail spár'],
  [7, 'kamen', 'Sprcha — vestavěná nika'],
  [8, 'kamen', 'Koupelna — kamenný obklad'],
  [9, 'kamen', 'Sprcha — plošný obklad'],
  [10, 'kamen', 'Sprcha — rohová spára'],
  [11, 'kamen', 'Sprcha — podlaha a stěny'],
  [12, 'kamen', 'Koupelna — šedý kámen'],
  [13, 'kamen', 'Koupelna — detail kamene'],
  [14, 'schody', 'Chodba — velkoformátová dlažba'],
  [15, 'obklady', 'Dlažba — pokládka s křížky'],
  [16, 'schody', 'Obývací prostor — dlažba'],
  [17, 'koupelny', 'Koupelna — vana a obklad'],
  [18, 'schody', 'Chodba — šedá dlažba'],
  [19, 'koupelny', 'Sprcha — světlý obklad'],
  [20, 'koupelny', 'Sprchy — dvojitá kabina'],
  [21, 'koupelny', 'Koupelna — vana a stěny'],
  [22, 'koupelny', 'Koupelna — tmavá dlažba'],
  [23, 'koupelny', 'Koupelna — přechod stěna/podlaha'],
  [24, 'koupelny', 'Koupelna — pohled shora'],
  [25, 'koupelny', 'Sprcha — světlý interiér'],
  [26, 'koupelny', 'WC — velkoformátový obklad'],
  [27, 'koupelny', 'WC — nika a panel'],
  [28, 'koupelny', 'Koupelna — mramorové stěny'],
  [29, 'koupelny', 'Koupelna — příčka a vana'],
  [30, 'koupelny', 'WC — rohový detail'],
  [31, 'koupelny', 'WC — čelní pohled'],
  [32, 'kamen', 'Sprcha — tmavý mramor'],
  [33, 'kamen', 'Sprcha — leštěný kámen'],
  [34, 'kamen', 'Sprcha — úzký prostor'],
  [35, 'kamen', 'Sprcha — kamenná příčka'],
  [36, 'koupelny', 'Koupelna — matný šedý obklad'],
  [37, 'koupelny', 'Koupelna — vana a niky'],
  [38, 'koupelny', 'Koupelna — čistý prostor'],
  [39, 'koupelny', 'Koupelna — detail nik'],
  [40, 'obklady', 'Obklad — přesné spáry'],
  [41, 'obklady', 'Obklad — velkoformát'],
  [42, 'schody', 'Dlažba — rovný povrch'],
  [43, 'koupelny', 'Koupelna — finální linie'],
  [44, 'obklady', 'Obklad — pracovní detail'],
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

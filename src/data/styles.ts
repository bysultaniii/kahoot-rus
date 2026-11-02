export type StyleId = 'science' | 'official' | 'public' | 'talk' | 'art'

export interface SpeechStyle {
  id: StyleId
  ru: string
  uz: string
  where: { ru: string; uz: string }[]
  signs: { ru: string; uz: string }[]
  /** светлый фон, акцент, тёмный текст */
  bg: string
  accent: string
  fg: string
}

export const STYLES: Record<StyleId, SpeechStyle> = {
  science: {
    id: 'science',
    ru: 'Научный',
    uz: 'Ilmiy uslub',
    where: [
      { ru: 'учебник', uz: 'darslik' },
      { ru: 'лекция', uz: "ma'ruza" },
    ],
    signs: [
      { ru: 'термины', uz: 'atamalar' },
      { ru: 'факты', uz: 'faktlar' },
      { ru: 'точность', uz: 'aniqlik' },
    ],
    bg: '#E4EDF5',
    accent: '#6E9CC7',
    fg: '#2F5577',
  },
  official: {
    id: 'official',
    ru: 'Официально-деловой',
    uz: 'Rasmiy-idoraviy uslub',
    where: [
      { ru: 'справка', uz: "ma'lumotnoma" },
      { ru: 'заявление', uz: 'ariza' },
    ],
    signs: [
      { ru: '«прошу…»', uz: "«so'rayman…»" },
      { ru: 'даты, имена', uz: 'sanalar, ismlar' },
      { ru: 'шаблоны', uz: 'qoliplar' },
    ],
    bg: '#ECE9F5',
    accent: '#9289C3',
    fg: '#4B4380',
  },
  public: {
    id: 'public',
    ru: 'Публицистический',
    uz: 'Publitsistik uslub',
    where: [
      { ru: 'газета', uz: 'gazeta' },
      { ru: 'ТВ, интернет', uz: 'TV, internet' },
    ],
    signs: [
      { ru: 'призыв', uz: 'chaqiriq' },
      { ru: 'новости', uz: 'yangiliklar' },
      { ru: 'оценка', uz: 'baho' },
    ],
    bg: '#F8EBE1',
    accent: '#D99573',
    fg: '#8A4B2C',
  },
  talk: {
    id: 'talk',
    ru: 'Разговорный',
    uz: "So'zlashuv uslubi",
    where: [
      { ru: 'друзья', uz: "do'stlar" },
      { ru: 'семья', uz: 'oila' },
    ],
    signs: [
      { ru: 'простые слова', uz: "oddiy so'zlar" },
      { ru: '«ну, ой, ага»', uz: '«nu, voy, ha»' },
      { ru: 'эмоции', uz: "his-tuyg'u" },
    ],
    bg: '#E5F0E8',
    accent: '#7FB08F',
    fg: '#345E44',
  },
  art: {
    id: 'art',
    ru: 'Художественный',
    uz: 'Badiiy uslub',
    where: [
      { ru: 'рассказ', uz: 'hikoya' },
      { ru: 'стихи', uz: "she'r" },
    ],
    signs: [
      { ru: 'образы', uz: 'obrazlar' },
      { ru: 'сравнения', uz: "o'xshatishlar" },
      { ru: 'эпитеты', uz: 'sifatlashlar' },
    ],
    bg: '#F6E5EB',
    accent: '#CF8BA2',
    fg: '#7E3D54',
  },
}

export const STYLE_ORDER: StyleId[] = ['science', 'official', 'public', 'talk', 'art']

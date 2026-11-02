import type { StyleId } from './styles'

/** Подсказка: русское слово → перевод на узбекский (латиница) */
export type Hint = [ru: string, uz: string]

export type Question =
  | {
      kind: 'which-style'
      text: string
      answer: StyleId
      hints: Hint[]
    }
  | {
      kind: 'odd-one'
      style: StyleId
      words: string[]
      answer: number
      /** к какому стилю на самом деле относится лишнее слово */
      oddStyle: StyleId
      hints: Hint[]
    }
  | {
      kind: 'pick-version'
      topic: string
      target: StyleId
      options: { text: string; style: StyleId }[]
      hints: Hint[]
    }

export interface Round {
  title: string
  uz: string
  rule: string
  points: number
  questions: Question[]
}

export const ROUNDS: Round[] = [
  {
    title: 'Какой стиль?',
    uz: 'Qaysi uslub?',
    rule: 'Прочитайте текст и назовите стиль',
    points: 1,
    questions: [
      {
        kind: 'which-style',
        text: 'Кариес — это разрушение твёрдых тканей зуба. Главная причина кариеса — бактерии.',
        answer: 'science',
        hints: [
          ['разрушение', 'yemirilish'],
          ['твёрдые ткани', "qattiq to'qimalar"],
          ['причина', 'sabab'],
        ],
      },
      {
        kind: 'which-style',
        text: 'Ой, зуб так болит! Всю ночь не спал…',
        answer: 'talk',
        hints: [
          ['болит', "og'riyapti"],
          ['всю ночь', "tun bo'yi"],
        ],
      },
      {
        kind: 'which-style',
        text: 'Справка. Дана студентке Каримовой Н. в том, что она была на приёме у стоматолога 12 октября 2026 года.',
        answer: 'official',
        hints: [
          ['справка', "ma'lumotnoma"],
          ['дана', 'berildi'],
          ['приём', 'qabul'],
        ],
      },
      {
        kind: 'which-style',
        text: 'Её улыбка была светлой, как утреннее солнце.',
        answer: 'art',
        hints: [
          ['улыбка', 'tabassum'],
          ['светлый', 'yorqin'],
          ['утреннее солнце', 'tonggi quyosh'],
        ],
      },
      {
        kind: 'which-style',
        text: 'В Ташкенте открылась новая детская стоматологическая клиника. Теперь лечение станет доступнее для тысяч семей!',
        answer: 'public',
        hints: [
          ['открылась', 'ochildi'],
          ['лечение', 'davolash'],
          ['доступнее', 'qulayroq'],
        ],
      },
      {
        kind: 'which-style',
        text: 'Эмаль — самая твёрдая ткань в организме человека.',
        answer: 'science',
        hints: [
          ['эмаль', 'tish emali'],
          ['самая твёрдая', 'eng qattiq'],
          ['ткань', "to'qima"],
        ],
      },
      {
        kind: 'which-style',
        text: 'Прошу освободить меня от занятий 5 ноября в связи с визитом к врачу.',
        answer: 'official',
        hints: [
          ['прошу', "so'rayman"],
          ['освободить от занятий', 'darslardan ozod qilish'],
          ['в связи с', 'munosabati bilan'],
        ],
      },
      {
        kind: 'which-style',
        text: '— Ну что, идём к врачу?\n— Ага, давай, только быстро!',
        answer: 'talk',
        hints: [
          ['идём', 'boramizmi'],
          ['ага', 'ha'],
          ['давай', 'mayli'],
        ],
      },
      {
        kind: 'which-style',
        text: 'Старый доктор посмотрел в окно. За стеклом тихо падал первый снег.',
        answer: 'art',
        hints: [
          ['стекло', 'oyna'],
          ['тихо', 'ohista'],
          ['падал снег', "qor yog'ardi"],
        ],
      },
      {
        kind: 'which-style',
        text: 'Врачи советуют: проверяйте зубы два раза в год! Это просто и очень важно.',
        answer: 'public',
        hints: [
          ['советуют', 'maslahat beradi'],
          ['проверять', 'tekshirmoq'],
          ['два раза в год', 'yiliga ikki marta'],
        ],
      },
    ],
  },
  {
    title: 'Найди лишнее',
    uz: 'Ortiqchasini top',
    rule: 'Какое слово не подходит к стилю?',
    points: 1,
    questions: [
      {
        kind: 'odd-one',
        style: 'science',
        words: ['термин', 'анализ', 'классно', 'функция'],
        answer: 2,
        oddStyle: 'talk',
        hints: [
          ['термин', 'atama'],
          ['анализ', 'tahlil'],
          ['классно', "zo'r"],
          ['функция', 'vazifa'],
        ],
      },
      {
        kind: 'odd-one',
        style: 'official',
        words: ['заявление', 'ага', 'справка', 'приказ'],
        answer: 1,
        oddStyle: 'talk',
        hints: [
          ['заявление', 'ariza'],
          ['ага', 'ha'],
          ['справка', "ma'lumotnoma"],
          ['приказ', 'buyruq'],
        ],
      },
      {
        kind: 'odd-one',
        style: 'talk',
        words: ['привет', 'ну', 'следовательно', 'ой'],
        answer: 2,
        oddStyle: 'science',
        hints: [
          ['привет', 'salom'],
          ['следовательно', 'demak'],
          ['ой', 'voy'],
        ],
      },
      {
        kind: 'odd-one',
        style: 'art',
        words: ['золотое солнце', 'тихая ночь', 'согласно приказу', 'грустные глаза'],
        answer: 2,
        oddStyle: 'official',
        hints: [
          ['золотое солнце', 'oltin quyosh'],
          ['тихая ночь', 'sokin tun'],
          ['согласно приказу', 'buyruqqa muvofiq'],
          ['грустные глаза', "g'amgin ko'zlar"],
        ],
      },
      {
        kind: 'odd-one',
        style: 'public',
        words: ['репортаж', 'интервью', 'теорема', 'новости'],
        answer: 2,
        oddStyle: 'science',
        hints: [
          ['репортаж', 'reportaj'],
          ['интервью', 'intervyu'],
          ['теорема', 'teorema'],
          ['новости', 'yangiliklar'],
        ],
      },
    ],
  },
  {
    title: 'Скажи иначе',
    uz: 'Boshqacha ayt',
    rule: 'Выберите вариант в нужном стиле',
    points: 2,
    questions: [
      {
        kind: 'pick-version',
        topic: 'Зубная боль',
        target: 'official',
        options: [
          { text: 'Ой, зуб болит — ужас!', style: 'talk' },
          { text: 'Прошу записать меня на приём к стоматологу.', style: 'official' },
          { text: 'Боль пришла ночью, тихо, как вор.', style: 'art' },
        ],
        hints: [
          ['записать на приём', "qabulga yozib qo'yish"],
          ['ужас', 'dahshat'],
          ['вор', "o'g'ri"],
        ],
      },
      {
        kind: 'pick-version',
        topic: 'Кариес',
        target: 'science',
        options: [
          { text: 'Опять кариес! Вот беда!', style: 'talk' },
          { text: 'Внимание! Кариес — враг вашей улыбки!', style: 'public' },
          { text: 'Кариес — это болезнь твёрдых тканей зуба.', style: 'science' },
        ],
        hints: [
          ['беда', 'muammo'],
          ['враг', 'dushman'],
          ['болезнь', 'kasallik'],
        ],
      },
      {
        kind: 'pick-version',
        topic: 'Пломба',
        target: 'talk',
        options: [
          { text: 'Слушай, мне сегодня пломбу поставили!', style: 'talk' },
          { text: 'Пломба — это материал для восстановления зуба.', style: 'science' },
          { text: 'Пломба установлена пациенту 3 ноября 2026 года.', style: 'official' },
        ],
        hints: [
          ['пломба', 'plomba'],
          ['поставили', "qo'yishdi"],
          ['восстановление', 'tiklash'],
        ],
      },
      {
        kind: 'pick-version',
        topic: 'Гигиена',
        target: 'public',
        options: [
          { text: 'Гигиена полости рта включает чистку зубов и языка.', style: 'science' },
          { text: 'Мам, я уже почистил зубы, честно!', style: 'talk' },
          { text: 'Здоровые зубы — здоровая страна! Чистите зубы каждый день!', style: 'public' },
        ],
        hints: [
          ['полость рта', "og'iz bo'shlig'i"],
          ['чистить зубы', 'tish tozalash'],
          ['честно', "rostdan"],
        ],
      },
      {
        kind: 'pick-version',
        topic: 'Улыбка',
        target: 'art',
        options: [
          { text: 'Классная улыбка, да?', style: 'talk' },
          { text: 'Её улыбка сияла, как жемчуг.', style: 'art' },
          { text: 'Улыбка — это движение мышц лица.', style: 'science' },
        ],
        hints: [
          ['сияла', 'porlardi'],
          ['жемчуг', 'marvarid'],
          ['мышцы лица', 'yuz mushaklari'],
        ],
      },
    ],
  },
]

export function correctIndex(q: Question, styleOrder: StyleId[]): number {
  switch (q.kind) {
    case 'which-style':
      return styleOrder.indexOf(q.answer)
    case 'odd-one':
      return q.answer
    case 'pick-version':
      return q.options.findIndex((o) => o.style === q.target)
  }
}

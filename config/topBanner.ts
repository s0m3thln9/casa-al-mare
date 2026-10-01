export interface TopBannerConfig {
  /** Глобальный выключатель баннера */
  enabled: boolean
  /**
   * Идентификатор кампании. Используется как ключ для запоминания закрытия —
   * при смене id баннер снова покажется всем, кто закрыл предыдущий.
   */
  id: string
  /** Период показа (ISO-дата). Если не задан — без ограничений */
  startAt?: string
  endAt?: string

  /** Содержимое */
  content: {
    /** Сообщения бегущей строки, разделяются иконкой */
    messages: string[]
    /** Ссылка по клику на баннер. Пусто — баннер не кликабельный */
    link?: string
    /** Подпись для скринридеров */
    ariaLabel?: string
    /** Показывать иконку-логотип между сообщениями */
    showIcon: boolean
    /** Сколько раз повторить набор сообщений в одной копии ленты */
    repeat: number
  }

  /** Поведение */
  behavior: {
    /** Показывать кнопку закрытия */
    closable: boolean
    /** Где запоминать закрытие: на вкладку, навсегда или не запоминать */
    rememberClose: "session" | "local" | "none"
    /** Длительность полного прохода ленты, сек. Меньше — быстрее */
    speed: number
    /** Останавливать ленту при наведении */
    pauseOnHover: boolean
  }

  /** Внешний вид */
  appearance: {
    /** Высота баннера, px */
    height: number
    background: string
    text: string
    icon: string
    closeBackground: string
    closeIcon: string
  }
}

export const topBannerConfig: TopBannerConfig = {
  enabled: false,
  id: "solo-noi-2026-09",

  content: {
    messages: ["Casa al mare × Solo Noi", "Pop-up и персиковое меню в итальянской фокаччерии"],
    link: "/blog/solo-noi-×-casa-al-mare-sentyabr-v-dome-na-italyanskom-poberezhe/",
    ariaLabel: "Casa al mare × Solo Noi: pop-up и персиковое меню в итальянской фокаччерии",
    showIcon: true,
    repeat: 4,
  },

  behavior: {
    closable: true,
    rememberClose: "session",
    speed: 100,
    pauseOnHover: true,
  },

  appearance: {
    height: 22,
    background: "#FDF5BF",
    text: "#211D1D",
    icon: "#F3A454",
    closeBackground: "#F3A454",
    closeIcon: "#FFFFFA",
  },
}

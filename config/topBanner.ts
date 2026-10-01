export interface TopBannerConfig {
  enabled: boolean
  id: string
  startAt?: string
  endAt?: string

  content: {
    messages: string[]
    link?: string
    ariaLabel?: string
    showIcon: boolean
    repeat: number
  }

  behavior: {
    closable: boolean
    rememberClose: "session" | "local" | "none"
    speed: number
    pauseOnHover: boolean
  }

  appearance: {
    height: number
    background: string
    text: string
    icon: string
    closeBackground: string
    closeIcon: string
  }
}

export const defaultTopBannerConfig: TopBannerConfig = {
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

export type RemoteTopBannerConfig = Partial<Omit<TopBannerConfig, "content" | "behavior" | "appearance">> & {
  content?: Partial<TopBannerConfig["content"]>
  behavior?: Partial<TopBannerConfig["behavior"]>
  appearance?: Partial<TopBannerConfig["appearance"]>
}

export const resolveTopBannerConfig = (remote?: RemoteTopBannerConfig | null): TopBannerConfig => {
  const defaults = defaultTopBannerConfig
  if (!remote) return defaults

  const content = { ...defaults.content, ...remote.content }
  if (!Array.isArray(content.messages)) content.messages = []

  return {
    ...defaults,
    ...remote,
    content,
    behavior: { ...defaults.behavior, ...remote.behavior },
    appearance: { ...defaults.appearance, ...remote.appearance },
  }
}

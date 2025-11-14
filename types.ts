export interface TestUser {
  certificates: {
    code: string
    created: number | null
    email: string
    id: number
    options: null
    phone: string
    send: number
    user_id: number
    value: number
    value_now: number
  }[]
  city: CityData
  cityQuestion: string
  favorites: number[]
  orders: UserOrder[]
  profile: {
    address: string[]
    birthdate: string
    blocked: boolean
    blockedafter: number
    blockeduntil: number
    city: string
    comment: string
    country: string
    dob: number
    email: string
    extended: {
      addresses: string[][]
      city: CityData
      country: string[]
      favorites: number[]
      firstname: string
      lastname: string
      token: string
    }
    failedlogincount: number
    fax: string
    fullname: string
    gender: number
    id: number
    internalKey: number
    lastlogin: number
    logincount: number
    mobilephone: string
    phone: string
    photo: string
    sessionid: string
    state: string
    thislogin: number
    website: string
    zip: string
  }
  total_quantity: number
  token: string
  uid: number
  success: boolean
  error?: string
}

export type User = Omit<TestUser, "token">

export interface CityData {
  fias: string
  kladr: string
  label: string
  name: string
  region: string
}

export interface CartItem {
  alias?: string
  article?: string
  externalId?: string
  variant?: string
  colorName?: string
  added_at?: number | null
  updated_at?: number | null
  sizes?: string[]
  images?: string[]
  vector?: Record<
    string,
    {
      comingSoon: number
      quantity: number
      externalId: string
    }
  >
  type?: string
  material?: string[]
  useType?: string[]
  count: number
  id: number
  name: string
  oldPrice: number | string
  price: number | string
  options?: {
    certificateType: string
    nominal: string
    design: 2
    deliveryMethod: string | null
    recipientEmail: string | null
    recipientPhone: string | null
    deliveryDetails: string | null
    recipientName: string | null
    message?: string | null
  }
}

export interface PvzData {
  address: string
  allowed_cod: boolean
  city: string
  city_code: number
  code: string
  country_code: string
  dimensions: null
  have_cash: boolean
  have_cashless: boolean
  is_dressing_room: boolean
  location: number[]
  name: string
  postal_code: string
  region: string
  type: string
  weight_max: number
  weight_min: number
  work_time: string
}

export interface ProfileExtended {
  addresses: string[][]
  city: CityData
  country: string[]
  favorites: number[]
  firstname: string
  lastname: string
  token: string
}

export interface UserOrder {
  orderId: number
  orderDate: string
  status: number
  cart: Record<string, CartItem>
  order: {
    certificates: string[]
    city: CityData
    commentForCourier: string
    currentAddress: string
    deliveryCost: number
    deliveryMethod: string
    deliveryTime: string
    order_cost: number
    paymentMethod: string
    points: number
    pvz: PvzData | null
    transaction: string
    userInfo: null
  }
}

export interface ProfileData {
  email: string
  name: string
  surname: string
  phone: string
  day: string
  month: string
  year: string
  city: CityData
  adr1: string
  adr2: string
}

export interface ResetPassword {
  success: boolean
  error: string
}

export interface EditUser {
  success: boolean
  changes: {
    fullname: string
    birthdate: string
    address: string[]
    city: CityData
  }
  error?: string
}

export interface GetFavorites {
  success: boolean
  favorites: number[]
  error?: string
}

export interface AddOrRemoveFavorites {
  success: boolean
  favorites: number[]
  message?: string
}

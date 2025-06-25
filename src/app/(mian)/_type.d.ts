export declare namespace IUser {
  type asObject = {
    firstname: string;
    lastname: string;
    email: string;
    password: string; // 邮箱密码
    phone: string;
    birthday: string; // e.g. "2022-10-01", 可视情况转为 Date 类型
    gender: string;
    address: Address;
    avatar: string;
    display_name: string;
    ip?: string;
  };
  type getCoorAddressRequest = {
    lat: number;
    lon: number;
    format?: string;
    zoom?: number;
    addressdetails?: number;
    'accept-language': string;
  };
  type getCoorAddressResponse = {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: number;
    lon: number;
    category: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    address: {
      road?: string;
      village?: string;
      state_district?: string;
      state?: string;
      'ISO3166-2-lvl4': string;
      postcode?: string;
      country?: string;
      country_code?: string;
      city: string;
    };
    boundingbox: [string, string, string, string];
  };
  type getSearchAddressRequest = {
    format?: string;
    q: string;
    limit?: number;
    addressdetails?: number;
    'accept-language': string;
  };
  type getSearchAddressResponse = getCoorAddressResponse[];
}

export interface Address {
  street: string;
  streetName: string;
  buildingNumber: string;
  city: string;
  zipcode: string;
  country: string;
  country_code: string;
  state: string;
  latitude: number;
  longitude: number;
}

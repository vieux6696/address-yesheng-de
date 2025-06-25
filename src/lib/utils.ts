import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Faker,
  faker,
  fakerAF_ZA,
  fakerAR,
  fakerAZ,
  fakerCS_CZ,
  fakerDA,
  fakerDE,
  fakerDE_AT,
  fakerDE_CH,
  fakerEL,
  fakerEN_AU,
  fakerEN_CA,
  fakerEN_GB,
  fakerEN_GH,
  fakerEN_HK,
  fakerEN_IE,
  fakerEN_IN,
  fakerEN_NG,
  fakerEN_US,
  fakerEN_ZA,
  fakerES,
  fakerES_MX,
  fakerFA,
  fakerFI,
  fakerFR,
  fakerFR_BE,
  fakerFR_CA,
  fakerFR_CH,
  fakerHE,
  fakerHR,
  fakerHU,
  fakerID_ID,
  fakerIT,
  fakerJA,
  fakerKO,
  fakerNB_NO,
  fakerNL,
  fakerNL_BE,
  fakerPL,
  fakerPT_BR,
  fakerPT_PT,
  fakerRO,
  fakerRU,
  fakerSK,
  fakerSV,
  fakerTH,
  fakerTR,
  fakerUK,
  fakerVI,
  fakerZH_CN,
  fakerZH_TW,
} from '@faker-js/faker';
import { IUser } from '@/app/(mian)/_type';
import { populationCenters } from './population';
// 本地化 Faker 实例映射
const localeMap: Record<string, Faker> = {
  af_ZA: fakerAF_ZA,
  ar: fakerAR,
  az: fakerAZ,
  cs_CZ: fakerCS_CZ,
  da: fakerDA,
  de: fakerDE,
  de_AT: fakerDE_AT,
  de_CH: fakerDE_CH,
  el: fakerEL,
  en_AU: fakerEN_AU,
  en_CA: fakerEN_CA,
  en_GB: fakerEN_GB,
  en_GH: fakerEN_GH,
  en_HK: fakerEN_HK,
  en_IE: fakerEN_IE,
  en_IN: fakerEN_IN,
  en_NG: fakerEN_NG,
  en_US: fakerEN_US,
  en_ZA: fakerEN_ZA,
  es: fakerES,
  es_MX: fakerES_MX,
  fa: fakerFA,
  fi: fakerFI,
  fr: fakerFR,
  fr_BE: fakerFR_BE,
  fr_CA: fakerFR_CA,
  fr_CH: fakerFR_CH,
  he: fakerHE,
  hr: fakerHR,
  hu: fakerHU,
  id_ID: fakerID_ID,
  it: fakerIT,
  ja: fakerJA,
  ko: fakerKO,
  nb_NO: fakerNB_NO,
  nl: fakerNL,
  nl_BE: fakerNL_BE,
  pl: fakerPL,
  pt_BR: fakerPT_BR,
  pt_PT: fakerPT_PT,
  ro: fakerRO,
  ru: fakerRU,
  sk: fakerSK,
  sv: fakerSV,
  th: fakerTH,
  tr: fakerTR,
  uk: fakerUK,
  vi: fakerVI,
  zh_CN: fakerZH_CN,
  zh_TW: fakerZH_TW,
};
const countryToLocaleMap: Record<string, string> = {
  // 中文系
  CN: 'zh_CN',
  TW: 'zh_TW',
  HK: 'en_HK',

  // 英语系
  US: 'en_US',
  GB: 'en_GB',
  AU: 'en_AU',
  CA: 'en_CA',
  IE: 'en_IE',
  IN: 'en_IN',
  NG: 'en_NG',
  ZA: 'en_ZA',
  GH: 'en_GH',

  // 欧洲
  DE: 'de',
  AT: 'de_AT',
  CH: 'de_CH',
  FR: 'fr',
  BE: 'fr_BE',
  NL: 'nl',
  IT: 'it',
  ES: 'es',
  FI: 'fi',
  NO: 'nb_NO',
  SE: 'sv',
  DK: 'da',
  PL: 'pl',
  CZ: 'cs_CZ',
  SK: 'sk',
  HU: 'hu',
  RO: 'ro',
  RU: 'ru',
  UA: 'uk',
  EL: 'el',

  // 亚洲
  JP: 'ja',
  KR: 'ko',
  TH: 'th',
  VN: 'vi',
  ID: 'id_ID',
  IL: 'he',
  TR: 'tr',
  IR: 'fa',
  AR: 'ar',

  // 拉美
  MX: 'es_MX',
  BR: 'pt_BR',
  PT: 'pt_PT',

  // 非洲
  EG: 'ar',

  // 其他
  AZ: 'az',
  HR: 'hr',
};

export function getLocalfromCountryCode(countryCode: string): string {
  const upperCode = countryCode.toUpperCase();
  return countryToLocaleMap[upperCode] || 'en_US'; // 默认返回英语
}

/**
 * 根据地区码获取对应的Faker实例
 * @param countryCode 地区码（如：zh_CN, en_US等）
 * @returns 对应的Faker实例，如果找不到则返回默认的faker
 */
export function getLocaleFaker(countryCode: string): Faker {
  const locale = getLocalfromCountryCode(countryCode);
  return localeMap[locale] || fakerEN_US;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomCoor(countryCode?: string) {
  const countrys = populationCenters.filter((center) =>
    countryCode ? center.countryCode === countryCode : true
  );
  const center = faker.helpers.arrayElement(countrys);
  const coordinates = faker.location.nearbyGPSCoordinate({
    isMetric: true,
    origin: center.origin,
    radius: center.radius,
  });
  return {
    coord: coordinates,
    country_code: center.countryCode,
  };
}

export function generateStrongPassword(length = 16): string {
  const upper = faker.string.fromCharacters('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const lower = faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz');
  const digit = faker.string.fromCharacters('0123456789');
  const special = faker.string.fromCharacters('!@#$%^&*()_-+=');

  const randomFrom = (chars: string, count: number) =>
    Array.from({ length: count }, () =>
      faker.string.fromCharacters(chars)
    ).join('');

  const required = upper + lower + digit + special;

  const remainingLength = Math.max(length - 4, 4); // 保证最少长度为4
  const allChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=';
  const rest = randomFrom(allChars, remainingLength);

  const full = (required + rest).split('');
  faker.helpers.shuffle(full);
  return full.join('').slice(0, length); // 再截断到期望长度
}

export function getPerson(country_code: string): IUser.asObject {
  const localFaker = getLocaleFaker(country_code);
  return {
    firstname: localFaker.person.firstName(),
    lastname: localFaker.person.lastName(),
    email: localFaker.internet.email(),
    phone: localFaker.phone.number({ style: 'international' }),
    birthday: localFaker.date
      .birthdate({ min: 18, max: 28, mode: 'age' })
      .toISOString()
      .split('T')[0],
    gender: localFaker.person.gender(),
    avatar: localFaker.image.avatarGitHub(),
    password: generateStrongPassword(
      localFaker.number.int({ min: 15, max: 20 })
    ),
    display_name: `${localFaker.location.streetAddress()}`,
    address: {
      street: localFaker.location.street(),
      streetName: localFaker.location.streetAddress(),
      buildingNumber: localFaker.location.buildingNumber(),
      city: '',
      zipcode: localFaker.location.zipCode(),
      country: '',
      country_code: country_code,
      latitude: 0,
      longitude: 0,
      state: '',
    },
  };
}
// export async function getPersonAsync() {
//   try {
//     const re·sponse = await fetch(`https://fakerapi.it/api/v2/persons?_quantity=1&_birthday_start=2005-01-01&_locale=en_US`)
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }
//     const data = await response.json()
//     return data
//   } catch (error) {
//     throw new Error(`Failed to fetch person data: ${error instanceof Error ? error.message : 'Unknown error'}`)
//   }
// }

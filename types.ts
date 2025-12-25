
export enum ZodiacType {
  Rat = '鼠', Ox = '牛', Tiger = '虎', Rabbit = '兔',
  Dragon = '龙', Snake = '蛇', Horse = '马', Goat = '羊',
  Monkey = '猴', Rooster = '鸡', Dog = '狗', Pig = '猪'
}

export enum DayMasterType {
  Jia = '甲', Yi = '乙', Bing = '丙', Ding = '丁', Wu = '戊',
  Ji = '己', Geng = '庚', Xin = '辛', Ren = '壬', Gui = '癸'
}

export enum ThemeMode {
  Mystic = 'mystic',
  Paper = 'paper'
}

export interface BaziPillar {
  stem: string;
  branch: string;
}

export interface BaziProfile {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour?: BaziPillar;
}

export interface UserProfile {
  zodiac: ZodiacType;
  birthDate?: string;
  birthTime?: string;
  dayMaster?: DayMasterType;
  bazi?: BaziProfile;
}

export enum AppStep {
  Welcome,
  ZodiacSelection,
  ZodiacInsight,
  DayMasterCalculation,
  FinalReport
}

export interface ZodiacData {
  type: ZodiacType;
  title: string;
  description: string;
  icon: string;
  rating: number; // 1 to 5
  tags: string[];
}

export interface DayMasterData {
  type: DayMasterType;
  icon: string;
  element: string;
  polarity: '阳' | '阴';
  keywords: string;
  nature: string;
  cultivation: string;
  riskTip: string;
  novStrategy: string;
}

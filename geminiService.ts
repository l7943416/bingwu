
import { ZodiacType, DayMasterType, BaziProfile } from "./types";
import { STEM_INFO, BRANCH_INFO, TEN_GODS_MAP } from "./constants";

// 移除 GoogleGenAI 依赖，改为本地计算
// 基础数据定义
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 2026 丙午年 易理数据库
const REPORT_TEMPLATES = {
  // 五行与流年丙午(强火)的关系断语
  ELEMENT_RELATIONS: {
    '木': {
      title: '木火通明 · 泄秀之年',
      desc: '流年丙午，火气鼎盛。木生火为“食伤”，主才华外露、思维活跃。然火多木焚，需防精力透支。此年是“输出”之年，宜创作、表达，忌盲目扩张。'
    },
    '火': {
      title: '烈火烹油 · 比劫争雄',
      desc: '流年丙午，与日主同气。两火相见，光芒万丈亦伴随激烈竞争。此年是“博弈”之年，机遇与挑战并存，需防急躁冲动，宜抱团取暖，忌单打独斗。'
    },
    '土': {
      title: '火炎土燥 · 印星过旺',
      desc: '流年丙午，火生土为“印星”。火势太旺则土焦，虽有贵人扶持、资源涌入，但易感压抑焦虑。此年是“沉淀”之年，宜学习、进修，忌固执己见。'
    },
    '金': {
      title: '火炼真金 · 官杀攻身',
      desc: '流年丙午，火克金为“官杀”。丙火猛烈，金受克制，压力剧增，亦是成器之时。此年是“磨砺”之年，宜承担重任、改革，忌正面硬刚。'
    },
    '水': {
      title: '水火既济 · 财星高照',
      desc: '流年丙午，水克火为“财星”。水火相激，动荡中藏巨大机会。离火大运，财源滚滚但极不稳定。此年是“逐鹿”之年，宜求财、跨界，忌贪得无厌。'
    }
  },
  // 生肖与午马的特殊关系
  ZODIAC_SECRETS: {
    [ZodiacType.Rat]: "子午相冲，水火激荡。今年变动极大，易有远行、搬迁或职位变动，宜动不宜静。",
    [ZodiacType.Ox]: "丑午相害，易生琐碎。需防小人是非，凡事留有余地，莫因小失大。",
    [ZodiacType.Tiger]: "寅午半合，火局助势。贵人运强，利于合作共赢，事业可更上一层楼。",
    [ZodiacType.Rabbit]: "卯木生火，顺势而为。虽有消耗，但能得赏识，利于名声传播。",
    [ZodiacType.Dragon]: "龙马精神，气场相生。状态稳健，利于按部就班推进长期计划。",
    [ZodiacType.Snake]: "巳午同气，火势更旺。需注意情绪管理，避免因冲动而坏事。",
    [ZodiacType.Horse]: "值年太岁，午午自刑。易陷入自我纠结，需修心养性，放过自己。",
    [ZodiacType.Goat]: "午未六合，日月生辉。运势顺遂，人际和谐，是拓展人脉的绝佳年份。",
    [ZodiacType.Monkey]: "火克金金，压力虽大但能炼金。动中求财，适合出差或开拓新市场。",
    [ZodiacType.Rooster]: "红鸾星动，桃花灿烂。利于社交、演艺及情感发展，但也需防烂桃花。",
    [ZodiacType.Dog]: "戌午半合，火库收纳。才华得以沉淀转化，利于幕后策划或资产管理。",
    [ZodiacType.Pig]: "暗合贵人，绝处逢生。表面平淡实则暗藏生机，遇困难自有解救之道。"
  }
};

export function validateZodiacYear(year: number, selectedZodiac: ZodiacType): { isValid: boolean; expected: string } {
  const zodiacList = [
    ZodiacType.Rat, ZodiacType.Ox, ZodiacType.Tiger, ZodiacType.Rabbit,
    ZodiacType.Dragon, ZodiacType.Snake, ZodiacType.Horse, ZodiacType.Goat,
    ZodiacType.Monkey, ZodiacType.Rooster, ZodiacType.Dog, ZodiacType.Pig
  ];
  const index = (year - 4) % 12;
  const actualZodiac = zodiacList[index < 0 ? index + 12 : index];
  return {
    isValid: actualZodiac === selectedZodiac,
    expected: actualZodiac
  };
}

export async function calculateBaziProfile(birthDate: string, birthTime: string): Promise<BaziProfile> {
  // 保持原有的算法逻辑，这已经是本地计算，无需更改，只需确保准确性
  const date = new Date(birthDate);
  let year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 简化版立春修正
  if (month < 2 || (month === 2 && day < 4)) {
    year -= 1;
  }
  
  const yearOffset = year - 1900;
  const yearStemIdx = (6 + yearOffset) % 10;
  const yearBranchIdx = (0 + yearOffset) % 12;

  const monthBranchIdx = (month + 1) % 12;
  const monthStemBase = (yearStemIdx % 5) * 2 + 2;
  const monthStemIdx = (monthStemBase + month - 1) % 10;

  const getJulianDay = (y: number, m: number, d: number) => {
    if (m <= 2) { y -= 1; m += 12; }
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
  };
  const jd = getJulianDay(date.getFullYear(), month, day);
  const diff = Math.floor(jd - 2451545.0);
  const dayStemIdx = ((0 + diff) % 10 + 10) % 10;
  const dayBranchIdx = ((10 + diff) % 12 + 12) % 12;

  let hourPillar = undefined;
  if (birthTime && birthTime !== 'UNKNOWN') {
    const hourNum = parseInt(birthTime.split(':')[0]);
    const hourBranchIdx = Math.floor((hourNum + 1) / 2) % 12;
    const hourStemBase = (dayStemIdx % 5) * 2;
    const hourStemIdx = (hourStemBase + hourBranchIdx) % 10;
    hourPillar = { stem: STEMS[hourStemIdx], branch: BRANCHES[hourBranchIdx] };
  }

  return {
    year: { stem: STEMS[yearStemIdx], branch: BRANCHES[yearBranchIdx] },
    month: { stem: STEMS[monthStemIdx], branch: BRANCHES[monthBranchIdx] },
    day: { stem: STEMS[dayStemIdx], branch: BRANCHES[dayBranchIdx] },
    hour: hourPillar
  };
}

export async function generateCombinedStrategy(
  zodiac: ZodiacType, 
  dayMaster: DayMasterType, 
  zodiacData: any, 
  dayMasterData: any,
  bazi: BaziProfile
): Promise<string> {
  // 1. 计算核心参数
  const tenGod = getTenGodRelation(dayMaster, '丙'); // 丙午流年，天干为丙
  const godInfo = TEN_GODS_MAP[tenGod];
  const dmInfo = STEM_INFO[dayMaster];
  const relationInfo = REPORT_TEMPLATES.ELEMENT_RELATIONS[dmInfo.element as keyof typeof REPORT_TEMPLATES.ELEMENT_RELATIONS];
  const zodiacSecret = REPORT_TEMPLATES.ZODIAC_SECRETS[zodiac];

  // 2. 组装 Markdown 报告
  // 模拟思考延迟，让用户感觉“正在排盘”
  // await new Promise(resolve => setTimeout(resolve, 100)); 

  const report = `**【天时 · 离火大势】**
2026 丙午年，九紫离火运之鼎盛期。
命主日元为【${dayMaster}${dmInfo.element}】，${dayMasterData.nature}
流年遇丙午，成【${relationInfo.title}】之局。
${relationInfo.desc}

**【流年 · 十神运程】**
本年值神为【${tenGod}】。
${godInfo.desc}
易理核心：${dayMasterData.riskTip}

**【地利 · 生肖玄机】**
生肖属${zodiac}，逢马年：
${zodiacSecret}
${zodiacData.description}

**【人和 · 修持锦囊】**
易道心法：**${dayMasterData.cultivation}**
${dayMasterData.novStrategy}

**【易道智慧：知命顺时，安身立命。】**`;

  return report;
}

function getTenGodRelation(dm: DayMasterType, targetStem: string): string {
  const dmInfo = STEM_INFO[dm];
  const targetInfo = STEM_INFO[targetStem];
  const relations: Record<string, Record<string, string>> = {
    '木': { '木': '比劫', '火': '食伤', '土': '财星', '金': '官杀', '水': '印星' },
    '火': { '木': '印星', '火': '比劫', '土': '食伤', '金': '财星', '水': '官杀' },
    '土': { '木': '官杀', '火': '印星', '土': '比劫', '金': '食伤', '水': '财星' },
    '金': { '木': '财星', '火': '官杀', '土': '印星', '金': '比劫', '水': '食伤' },
    '水': { '木': '食伤', '火': '财星', '土': '官杀', '金': '印星', '水': '比劫' },
  };
  const type = relations[dmInfo.element][targetInfo.element];
  const samePol = dmInfo.polarity === targetInfo.polarity;
  if (type === '比劫') return samePol ? '比肩' : '劫财';
  if (type === '食伤') return samePol ? '食神' : '伤官';
  if (type === '财星') return samePol ? '偏财' : '正财';
  if (type === '官杀') return samePol ? '七杀' : '正官';
  if (type === '印星') return samePol ? '偏印' : '正印';
  return '比肩';
}

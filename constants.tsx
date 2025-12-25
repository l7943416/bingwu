
import { ZodiacType, DayMasterType, ZodiacData, DayMasterData } from './types';

export const STEM_INFO: Record<string, { element: string, color: string, icon: string, polarity: number }> = {
  '甲': { element: '木', color: 'text-emerald-500', icon: '🌳', polarity: 1 },
  '乙': { element: '木', color: 'text-green-400', icon: '🌿', polarity: -1 },
  '丙': { element: '火', color: 'text-red-500', icon: '🔥', polarity: 1 },
  '丁': { element: '火', color: 'text-orange-400', icon: '🕯️', polarity: -1 },
  '戊': { element: '土', color: 'text-yellow-700', icon: '⛰️', polarity: 1 },
  '己': { element: '土', color: 'text-yellow-500', icon: '🌾', polarity: -1 },
  '庚': { element: '金', color: 'text-slate-300', icon: '⚔️', polarity: 1 },
  '辛': { element: '金', color: 'text-zinc-100', icon: '💎', polarity: -1 },
  '壬': { element: '水', color: 'text-blue-500', icon: '🌊', polarity: 1 },
  '癸': { element: '水', color: 'text-sky-300', icon: '💧', polarity: -1 },
};

export const BRANCH_INFO: Record<string, { element: string, color: string, icon: string, zodiac: string }> = {
  '子': { element: '水', color: 'text-blue-500', icon: '🐭', zodiac: '鼠' },
  '丑': { element: '土', color: 'text-yellow-600', icon: '🐮', zodiac: '牛' },
  '寅': { element: '木', color: 'text-emerald-600', icon: '🐯', zodiac: '虎' },
  '卯': { element: '木', color: 'text-green-400', icon: '🐰', zodiac: '兔' },
  '辰': { element: '土', color: 'text-yellow-600', icon: '🐲', zodiac: '龙' },
  '巳': { element: '火', color: 'text-red-500', icon: '🐍', zodiac: '蛇' },
  '午': { element: '火', color: 'text-red-600', icon: '🐴', zodiac: '马' },
  '未': { element: '土', color: 'text-yellow-500', icon: '🐑', zodiac: '羊' },
  '申': { element: '金', color: 'text-slate-300', icon: '🐒', zodiac: '猴' },
  '酉': { element: '金', color: 'text-zinc-100', icon: '🐔', zodiac: '鸡' },
  '戌': { element: '土', color: 'text-yellow-700', icon: '🐶', zodiac: '狗' },
  '亥': { element: '水', color: 'text-blue-700', icon: '🐷', zodiac: '猪' },
};

export const TEN_GODS_MAP: Record<string, { title: string, desc: string }> = {
  '比肩': { title: '比肩', desc: '流年逢比肩，自我意识增强，凡事宜自立自强。易道建议：稳扎稳打，切莫轻信旁人，独立方能破局。' },
  '劫财': { title: '劫财', desc: '流年逢劫财，需防意气用事导致钱财耗散。易道建议：谨言慎行，以静制动，避免风险投资。' },
  '食神': { title: '食神', desc: '流年逢食神，乃吐秀之年，心情舒畅，利于文化创作。易道建议：保持温和，展现才干，机遇自来。' },
  '伤官': { title: '伤官', desc: '流年逢伤官，才气纵横但也伴随口舌之争。易道建议：收敛锋芒，将能量转化为创造，而非对抗。' },
  '偏财': { title: '偏财', desc: '流年逢偏财，意外之机遇增多，思维变幻。易道建议：见好就收，切莫贪婪，离火之年守正为要。' },
  '正财': { title: '正财', desc: '流年逢正财，事业步入稳健轨道，努力必有回响。易道建议：长远布局，深耕本业，积微成著。' },
  '七杀': { title: '七杀', desc: '流年逢七杀，压力与转折共生，考验意志。易道建议：保持高度警觉，在变动中寻生机，退即是进。' },
  '正官': { title: '正官', desc: '流年逢正官，利于名望提升，受人敬重。易道建议：自律正直，确立个人口碑，正道坦途。' },
  '偏印': { title: '偏印', desc: '流年逢偏印，利于钻研深度学问或玄奥知识。易道建议：疏解内心，多与智者交流，化空想为行力。' },
  '正印': { title: '正印', desc: '流年逢正印，贵人扶持，长辈眷顾，心境安稳。易道建议：静心进修，以厚德承载流年波动。' }
};

export const DAY_MASTER_LIST: DayMasterData[] = [
  {
    type: DayMasterType.Jia, icon: '🌳', element: '木', polarity: '阳',
    keywords: '正直、担当',
    nature: '宛如参天大树，挺拔正直。丙午之年，木生火燃，需防过度消耗，守住根基。',
    cultivation: '仁者无忧',
    riskTip: '火旺木焚，凡事切忌急躁，合作易生虚火。',
    novStrategy: '先正其心，后行其事。遇事多退一步，求财宜稳。'
  },
  {
    type: DayMasterType.Yi, icon: '🌿', element: '木', polarity: '阴',
    keywords: '柔顺、灵活',
    nature: '宛如春风细柳，极具韧性。赤马之年，利于展现巧思，但要防范小人夺光。',
    cultivation: '柔中寓刚',
    riskTip: '灵感虽多，但落地难。偏财易进易出。',
    novStrategy: '专注正业，莫贪横财。借贵人之力，行稳致远。'
  },
  {
    type: DayMasterType.Bing, icon: '🔥', element: '火', polarity: '阳',
    keywords: '热情、光明',
    nature: '如烈日当空。流年值丙午，火气叠叠，最需调候，切莫因狂热误事。',
    cultivation: '明哲保身',
    riskTip: '火过旺则脆，情绪易失控，容易招惹非议。',
    novStrategy: '以水克火，多听取反对意见。保持冷静是第一要务。'
  },
  {
    type: DayMasterType.Ding, icon: '🕯️', element: '火', polarity: '阴',
    keywords: '细腻、执着',
    nature: '如灯火微光。丙午年火旺相助，才华得以显现，但需防范内耗过重。',
    cultivation: '内敛神光',
    riskTip: '事务繁杂，节奏易乱。注意身体劳损。',
    novStrategy: '劳逸结合，守住内心一点真明，不随外界起舞。'
  },
  {
    type: DayMasterType.Wu, icon: '⛰️', element: '土', polarity: '阳',
    keywords: '厚重、守信',
    nature: '如高山厚土。火生土旺，今年是您承载重任之时，利于确立威信。',
    cultivation: '诚而有信',
    riskTip: '过于固执容易错失变革机会。合作需防被动。',
    novStrategy: '适当变通，顺应离火之势。多接纳新事物。'
  },
  {
    type: DayMasterType.Ji, icon: '🌾', element: '土', polarity: '阴',
    keywords: '包容、周全',
    nature: '如沃野良田。火燥土焦，今年需注意情绪舒缓，别让自己太紧绷。',
    cultivation: '和合共生',
    riskTip: '琐事缠身，容易感到疲惫。脾胃需多关照。',
    novStrategy: '饮食起居宜清淡。简化社交，专注核心目标。'
  },
  {
    type: DayMasterType.Geng, icon: '⚔️', element: '金', polarity: '阳',
    keywords: '刚毅、果决',
    nature: '如精钢利刃。流年午火炼金，是磨砺成器之年，辛苦但有所成。',
    cultivation: '大器晚成',
    riskTip: '压力骤增，容易硬碰硬。言语易伤人。',
    novStrategy: '柔和处事。将压力转化为动力，借火炼金。'
  },
  {
    type: DayMasterType.Xin, icon: '💎', element: '金', polarity: '阴',
    keywords: '清雅、敏锐',
    nature: '如首饰明珠。丙午火旺克金，今年需低调藏锋，避开冲突。',
    cultivation: '清净无为',
    riskTip: '感情波折较多，容易产生误解。职场宜避嫌。',
    novStrategy: '提升内功，莫争一时长短。清者自清。'
  },
  {
    type: DayMasterType.Ren, icon: '🌊', element: '水', polarity: '阳',
    keywords: '博大、洒脱',
    nature: '如江河湖海。水火既济，今年是您智慧激发的巅峰，利于跨界。',
    cultivation: '智圆行方',
    riskTip: '水火相激，变动极大。投资需格外谨慎。',
    novStrategy: '设定止损。保持专注，不被浮华所惑。'
  },
  {
    type: DayMasterType.Gui, icon: '💧', element: '水', polarity: '阴',
    keywords: '聪慧、润物',
    nature: '如雨露之水。丙午大火之年，水气易干，需多寻找精神滋养。',
    cultivation: '上善若水',
    riskTip: '精力分散，财来财去。人情开支较大。',
    novStrategy: '量入为出。多亲近自然，保持心境温润。'
  }
];

export const ZODIAC_LIST: ZodiacData[] = [
  { type: ZodiacType.Rat, title: '守心待时', icon: '🐭', rating: 2, tags: ['子午相冲', '宜静'], description: '流年子午相冲，火水未济。易道建议：心定如山，守正出奇。' },
  { type: ZodiacType.Ox, title: '稳扎稳打', icon: '🐮', rating: 3, tags: ['丑午相害', '谨言'], description: '流年丑午相害，琐碎杂务多。易道建议：处乱不惊，步步为营。' },
  { type: ZodiacType.Tiger, title: '借势登高', icon: '🐯', rating: 4, tags: ['寅午相合', '机遇'], description: '流年寅午相合，木火通明。易道建议：抓住契机，顺势而上。' },
  { type: ZodiacType.Rabbit, title: '和乐且湛', icon: '🐰', rating: 5, tags: ['吉星高照', '贵人'], description: '流年天喜照耀，喜庆盈门。易道建议：广结善缘，和气生财。' },
  { type: ZodiacType.Dragon, title: '潜龙在渊', icon: '🐲', rating: 3, tags: ['平稳蓄势', '中庸'], description: '流年气场趋稳，波澜不惊。易道建议：静心思变，厚积薄发。' },
  { type: ZodiacType.Snake, title: '奋翼而起', icon: '🐍', rating: 4, tags: ['巳午同气', '晋升'], description: '流年火气充盈，贵人暗助。易道建议：敢于突破，必有所成。' },
  { type: ZodiacType.Horse, title: '修心化劫', icon: '🐴', rating: 2, tags: ['本命太岁', '自省'], description: '值年太岁，午午自刑。易道建议：收敛心性，不争为赢。' },
  { type: ZodiacType.Goat, title: '顺水推舟', icon: '🐑', rating: 5, tags: ['午未六合', '圆满'], description: '流年六合生辉，万事亨通。易道建议：把握良机，多行善事。' },
  { type: ZodiacType.Monkey, title: '动中求胜', icon: '🐒', rating: 3, tags: ['驿马动能', '远行'], description: '流年驿马星动，动则有机。易道建议：跨界求索，行者无疆。' },
  { type: ZodiacType.Rooster, title: '贵人引路', icon: '🐔', rating: 4, tags: ['红鸾心动', '人和'], description: '流年红鸾入命，人缘极佳。易道建议：真诚待人，必获回报。' },
  { type: ZodiacType.Dog, title: '慧心独具', icon: '🐶', rating: 4, tags: ['戌午相合', '睿智'], description: '流年三合入命，才智迸发。易道建议：深研内功，智慧立身。' },
  { type: ZodiacType.Pig, title: '否极泰来', icon: '🐷', rating: 4, tags: ['运势回暖', '稳健'], description: '流年正财入库，家宅安宁。易道建议：知足常乐，稳步前行。' },
];

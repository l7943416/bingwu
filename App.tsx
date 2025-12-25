
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AppStep, ZodiacType, DayMasterType, UserProfile, BaziPillar, ThemeMode } from './types';
import { ZODIAC_LIST, DAY_MASTER_LIST, STEM_INFO, BRANCH_INFO } from './constants';
import { calculateBaziProfile, generateCombinedStrategy, validateZodiacYear } from './geminiService';

const STORAGE_KEY = 'YIDAO_2026_V6_FINAL';

const BaziPillarCard: React.FC<{ 
  pillar?: BaziPillar; 
  label: string; 
  isDayMaster?: boolean;
  isYearBranch?: boolean;
  theme: ThemeMode;
}> = ({ pillar, label, isDayMaster, isYearBranch, theme }) => {
  const isDark = theme === ThemeMode.Mystic;
  
  if (!pillar || !pillar.stem || pillar.stem === '?' || !pillar.branch || pillar.branch === '?') {
    return (
      <div className="flex flex-col items-center gap-2 opacity-25 grayscale">
        <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
        <div className={`flex flex-col items-center justify-center w-16 md:w-24 h-48 rounded-[2.5rem] border ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
          <span className="text-xl font-calligraphy writing-mode-vertical">待考</span>
        </div>
      </div>
    );
  }

  const stemInfo = STEM_INFO[pillar.stem] || { element: '?', color: 'text-slate-400' };
  const branchInfo = BRANCH_INFO[pillar.branch] || { element: '?', color: 'text-slate-400' };
  
  return (
    <div className="flex flex-col items-center gap-2 animate-in slide-in-from-top duration-700">
      <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
      <div className={`flex flex-col items-center w-16 md:w-24 py-6 rounded-[2.5rem] border transition-all duration-700 ${isDayMaster || isYearBranch 
        ? (isDark ? 'border-amber-500/50 bg-amber-950/20 shadow-[0_0_30px_rgba(245,158,11,0.25)]' : 'border-red-600/40 bg-red-50/50 shadow-lg') 
        : (isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-white shadow-sm')}`}>
        <div className="flex flex-col items-center mb-6 relative">
          <span className={`text-4xl md:text-5xl font-calligraphy select-none transition-colors duration-500 ${stemInfo.color}`}>
            {pillar.stem}
          </span>
          <span className={`text-[9px] font-bold mt-2 opacity-60 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stemInfo.element}</span>
          {isDayMaster && (
            <span className={`absolute -top-3 -right-6 text-[8px] px-2 py-0.5 rounded-full font-black shadow-lg ${isDark ? 'bg-amber-500 text-black' : 'bg-red-700 text-white'}`}>日主</span>
          )}
        </div>
        <div className={`w-10 h-px mb-6 ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}></div>
        <div className="flex flex-col items-center">
          <span className={`text-4xl md:text-5xl font-calligraphy select-none transition-colors duration-500 ${branchInfo.color}`}>
            {pillar.branch}
          </span>
          <span className={`text-[9px] font-bold mt-2 opacity-60 ${isDark ? 'text-white' : 'text-slate-900'}`}>{branchInfo.element}</span>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.Welcome);
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.Mystic);
  const [user, setUser] = useState<UserProfile>({ 
    zodiac: ZodiacType.Rat, 
    birthTime: '' 
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [finalReport, setFinalReport] = useState<string>('');

  const [birthYear, setBirthYear] = useState('1990');
  const [birthMonth, setBirthMonth] = useState('1');
  const [birthDay, setBirthDay] = useState('1');

  // 初始化：加载存档
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setFinalReport(parsed.report || '');
        if (parsed.report) setStep(AppStep.FinalReport);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const isDark = theme === ThemeMode.Mystic;
  const selectedZodiacData = ZODIAC_LIST.find(z => z.type === user.zodiac)!;
  const selectedDayMasterData = user.dayMaster ? DAY_MASTER_LIST.find(d => d.type === user.dayMaster) : null;

  const years = useMemo(() => Array.from({ length: 100 }, (_, i) => (2026 - i).toString()), []);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => (i + 1).toString()), []);
  const days = useMemo(() => {
    const yearNum = parseInt(birthYear);
    const monthNum = parseInt(birthMonth);
    const maxDays = new Date(yearNum, monthNum, 0).getDate();
    return Array.from({ length: maxDays }, (_, i) => (i + 1).toString());
  }, [birthYear, birthMonth]);

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDark]);

  const handleSelectZodiac = (type: ZodiacType) => {
    setUser(prev => ({ ...prev, zodiac: type }));
    setStep(AppStep.ZodiacInsight);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 彻底重置所有状态，返回首页
   */
  const handleReset = () => {
    // 1. 清除本地存储
    localStorage.removeItem(STORAGE_KEY);
    
    // 2. 显式重置所有 React State (Explicit Reset)
    setUser({ zodiac: ZodiacType.Rat, birthTime: '' });
    setFinalReport('');
    setErrorMsg(null);
    setBirthYear('1990');
    setBirthMonth('1');
    setBirthDay('1');
    setLoading(false);
    
    // 3. 路由跳转与滚动重置
    setStep(AppStep.Welcome);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitBirth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 严谨校验 1: 时辰选择
    if (!user.birthTime || user.birthTime.trim() === '') {
      setErrorMsg("【易理警示】：尚未择定出生时辰。若时辰不明，请务必择【时辰不详】。");
      const el = document.getElementById('birthTimeSelect');
      el?.classList.add('ring-2', 'ring-red-500');
      setTimeout(() => el?.classList.remove('ring-2', 'ring-red-500'), 2000);
      return;
    }

    const yearNum = parseInt(birthYear);
    // 严谨校验 2: 生肖与年份一致性
    const check = validateZodiacYear(yearNum, user.zodiac);
    if (!check.isValid) {
      setErrorMsg(`【干支不合】：阁下自述属【${user.zodiac}】，然公历【${yearNum}年】实为【${check.expected}】年。推演大运需干支严丝合缝，请核实年份。`);
      return;
    }

    setLoading(true);
    // 本地计算极快，仅保留少许延迟作为“仪式感”
    await new Promise(r => setTimeout(r, 1500));

    try {
      const formattedDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
      const bazi = await calculateBaziProfile(formattedDate, user.birthTime);
      const dm = bazi.day.stem as DayMasterType;
      const dmData = DAY_MASTER_LIST.find(d => d.type === dm)!;
      
      const report = await generateCombinedStrategy(user.zodiac, dm, selectedZodiacData, dmData, bazi);
      const newUser = { ...user, birthDate: formattedDate, bazi, dayMaster: dm };
      
      setUser(newUser);
      setFinalReport(report);
      setLoading(false);
      setStep(AppStep.FinalReport);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser, report }));
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMsg("【天机阻滞】：推演过程中气场波动异常，请稍后重新叩门。");
    }
  };

  const handleShare = async () => {
    const shareText = `【2026 丙午·赤马年】易道智慧修运报告\n\n${finalReport}\n\n—— 知命顺时，安身立命。`;
    if (navigator.share) {
      try {
        await navigator.share({ title: '2026 丙午修运报告', text: shareText });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('报告内容已成功刻录（复制）到剪贴板。');
    }
  };

  const textGold = isDark ? 'text-amber-400' : 'text-red-800';
  const panelBg = isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white/80 border-slate-200 shadow-sm';

  return (
    <div className="min-h-screen transition-colors duration-500 selection:bg-amber-500/30">
      <nav className={`p-6 flex justify-between items-center backdrop-blur-3xl border-b sticky top-0 z-50 transition-all ${isDark ? 'bg-slate-950/80 border-white/10' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)] ${isDark ? 'bg-red-500' : 'bg-red-700'}`}></div>
          <h1 className={`font-calligraphy text-2xl tracking-widest ${textGold}`}>2026 丙午 · 赤马年</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setTheme(prev => prev === ThemeMode.Mystic ? ThemeMode.Paper : ThemeMode.Mystic)} className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase transition-all ${isDark ? 'border-white/20 hover:bg-white/10 text-slate-300' : 'border-slate-300 hover:border-red-800 text-slate-700'}`}>
            {isDark ? '🌙 观象' : '📜 阅卷'}
          </button>
          {step === AppStep.FinalReport && (
            <button onClick={handleReset} className="px-4 py-1.5 rounded-full border border-red-500/30 text-[10px] font-black tracking-widest uppercase text-red-500 hover:bg-red-500/20 active:scale-95 transition-all shadow-sm">重启推演</button>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {step === AppStep.Welcome && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in zoom-in duration-1000">
            <h1 className={`text-9xl md:text-[15rem] font-calligraphy leading-none select-none drop-shadow-2xl transition-colors ${isDark ? 'text-red-600' : 'text-red-800'}`}>丙午</h1>
            <h2 className={`text-2xl md:text-5xl font-black mb-10 tracking-[0.6em] font-serif ${textGold}`}>赤马红羊劫</h2>
            <p className={`max-w-xl mb-16 leading-loose text-lg font-serif italic ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>岁在丙午，离火大旺。易学谓之“红羊劫”，亦是“九运”起航之基。凭易道智慧，观照日主，锁定胜局。</p>
            <button onClick={() => setStep(AppStep.ZodiacSelection)} className={`px-16 py-6 border font-black rounded-full shadow-2xl tracking-[0.5em] uppercase text-sm active:scale-95 transition-transform ${isDark ? 'bg-amber-500 text-black border-amber-400 shadow-amber-900/40' : 'bg-red-800 text-white border-red-900 shadow-red-900/20'}`}>叩启玄门</button>
          </div>
        )}

        {step === AppStep.ZodiacSelection && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 text-center">
            <h3 className={`text-xl font-serif mb-16 tracking-[0.5em] uppercase font-black opacity-40`}>请择出生生肖</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {ZODIAC_LIST.map((z) => (
                <button key={z.type} onClick={() => handleSelectZodiac(z.type)} className={`p-8 backdrop-blur-xl border rounded-[3rem] transition-all group flex flex-col items-center shadow-lg ${panelBg} hover:scale-105 active:scale-95`}>
                  <span className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">{z.icon}</span>
                  <span className={`text-sm font-black tracking-widest`}>{z.type}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === AppStep.ZodiacInsight && (
          <div className="max-w-2xl mx-auto text-center animate-in zoom-in-95 duration-500">
            <div className="text-[10rem] mb-12 drop-shadow-2xl animate-flame">{selectedZodiacData.icon}</div>
            <h3 className={`text-4xl font-calligraphy mb-8 tracking-widest ${textGold}`}>属{selectedZodiacData.type}者 · {selectedZodiacData.title}</h3>
            <div className={`p-10 md:p-14 rounded-[4rem] border mb-16 leading-relaxed text-lg text-justify font-serif shadow-inner ${isDark ? 'bg-white/5 border-white/5 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
              {selectedZodiacData.description}
            </div>
            <div className="flex flex-col gap-8 items-center">
              <button onClick={() => setStep(AppStep.DayMasterCalculation)} className={`px-14 py-6 rounded-full font-black shadow-2xl transition-all tracking-[0.4em] text-sm active:scale-95 ${isDark ? 'bg-amber-500 text-black' : 'bg-red-800 text-white'}`}>进阶：锁定日主精算</button>
              <button onClick={() => setStep(AppStep.ZodiacSelection)} className="text-slate-500 text-xs font-bold tracking-widest underline underline-offset-8 opacity-50 hover:opacity-100 transition-opacity">重选生肖</button>
            </div>
          </div>
        )}

        {step === AppStep.DayMasterCalculation && (
          <div className={`max-w-2xl mx-auto p-12 rounded-[5rem] border shadow-2xl animate-in fade-in duration-1000 ${panelBg}`}>
            {loading ? (
              <div className="flex flex-col items-center py-20 text-center">
                <div className={`w-20 h-20 border-4 border-t-transparent rounded-full animate-spin mb-10 ${isDark ? 'border-amber-500' : 'border-red-800'}`}></div>
                <h3 className={`text-2xl font-calligraphy tracking-[0.5em] animate-pulse ${textGold}`}>正在感应天地气场，排布干支乾坤...</h3>
                <p className="mt-6 text-xs opacity-50 font-serif italic">“知命者不惑，修身者不殆。”</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-12">
                  <h3 className={`text-2xl font-black mb-4 tracking-widest ${textGold}`}>易道排盘</h3>
                  <p className="text-sm opacity-60 tracking-[0.3em] uppercase">请输入出生时间，精准定格流年</p>
                </div>
                <form onSubmit={handleSubmitBirth} className="space-y-12">
                  {errorMsg && <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-bold text-center animate-bounce">{errorMsg}</div>}
                  
                  <div className="space-y-6">
                    <label className="block text-[10px] font-black uppercase tracking-[0.5em] opacity-50">出生日期（公历）</label>
                    <div className="grid grid-cols-3 gap-4">
                      <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className={`p-5 rounded-3xl border outline-none font-bold ${isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}>
                        {years.map(y => <option key={y} value={y}>{y}年</option>)}
                      </select>
                      <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} className={`p-5 rounded-3xl border outline-none font-bold ${isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}>
                        {months.map(m => <option key={m} value={m}>{m}月</option>)}
                      </select>
                      <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)} className={`p-5 rounded-3xl border outline-none font-bold ${isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}>
                        {days.map(d => <option key={d} value={d}>{d}日</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="block text-[10px] font-black uppercase tracking-[0.5em] opacity-50">出生时辰</label>
                    <select 
                      id="birthTimeSelect"
                      value={user.birthTime} 
                      className={`w-full p-5 rounded-3xl border text-lg outline-none font-bold transition-all ${isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200'} ${!user.birthTime ? 'text-slate-500' : ''}`} 
                      onChange={(e) => setUser(prev => ({ ...prev, birthTime: e.target.value }))}
                    >
                      <option value="">-- 请择定准确生时 --</option>
                      <option value="00:00">子时 (23:00 - 01:00)</option>
                      <option value="02:00">丑时 (01:00 - 03:00)</option>
                      <option value="04:00">寅时 (03:00 - 05:00)</option>
                      <option value="06:00">卯时 (05:00 - 07:00)</option>
                      <option value="08:00">辰时 (07:00 - 09:00)</option>
                      <option value="10:00">巳时 (09:00 - 11:00)</option>
                      <option value="12:00">午时 (11:00 - 13:00)</option>
                      <option value="14:00">未时 (13:00 - 15:00)</option>
                      <option value="16:00">申时 (15:00 - 17:00)</option>
                      <option value="18:00">酉时 (17:00 - 19:00)</option>
                      <option value="20:00">戌时 (19:00 - 21:00)</option>
                      <option value="22:00">亥时 (21:00 - 23:00)</option>
                      <option value="UNKNOWN">不确定具体时辰（仅推算三柱）</option>
                    </select>
                  </div>

                  <button className={`w-full py-7 border rounded-[3rem] font-black shadow-2xl transition-all uppercase tracking-[0.6em] text-sm active:scale-95 ${isDark ? 'bg-amber-500 text-black border-amber-400' : 'bg-red-800 text-white border-red-900'}`}>开启易道推演</button>
                </form>
              </>
            )}
          </div>
        )}

        {step === AppStep.FinalReport && (
          <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
            <div className={`p-10 md:p-16 rounded-[6rem] border text-center shadow-2xl backdrop-blur-3xl ${panelBg}`}>
               <h3 className="text-[10px] font-black tracking-[0.8em] mb-20 uppercase opacity-40">易道智慧 · 八字乾坤排盘</h3>
               <div className="grid grid-cols-4 gap-4 md:gap-16">
                 <BaziPillarCard pillar={user.bazi?.hour} label="时" theme={theme} />
                 <BaziPillarCard pillar={user.bazi!.day} label="日" theme={theme} isDayMaster />
                 <BaziPillarCard pillar={user.bazi!.month} label="月" theme={theme} />
                 <BaziPillarCard pillar={user.bazi!.year} label="年" theme={theme} isYearBranch />
               </div>
               <div className="mt-16 h-px w-24 mx-auto bg-slate-500/20"></div>
               <p className="mt-8 text-[9px] font-black tracking-[0.5em] uppercase italic opacity-30">此盘仅供丙午流年推演参考，天命在天，修持在己</p>
            </div>

            <div className={`p-12 md:p-24 rounded-[7rem] border shadow-2xl transition-colors relative overflow-hidden ${panelBg}`}>
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
               <h4 className={`font-calligraphy text-6xl text-center mb-16 tracking-widest ${textGold}`}>丙午精研修运报告</h4>
               <div className={`leading-[2.8] text-xl whitespace-pre-wrap max-w-4xl mx-auto text-justify font-serif text-opacity-90`}>
                 {finalReport}
               </div>
               <div className="mt-24 flex flex-col items-center gap-12">
                  <button onClick={handleShare} className={`px-14 py-6 rounded-full font-black tracking-[0.4em] shadow-2xl transition-transform active:scale-95 ${isDark ? 'bg-amber-500 text-black' : 'bg-red-800 text-white'}`}>保存/分享修运策</button>
                  <button onClick={handleReset} className="p-4 text-xs opacity-50 hover:opacity-100 hover:text-red-500 transition-all font-black tracking-[0.5em] underline underline-offset-8">↺ 重新开始易道推演</button>
               </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="text-center p-20 text-[10px] tracking-[1em] font-black opacity-20 uppercase select-none">
        易道智慧 · 知命顺时 · 安身立命
      </footer>
    </div>
  );
};

export default App;

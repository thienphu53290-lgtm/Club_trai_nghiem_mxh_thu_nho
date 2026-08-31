import React, { useState, useEffect } from 'react';
import { Palette, Globe, Check, Image as ImageIcon, Layout as LayoutIcon, Moon, Loader } from 'lucide-react';

const ThemePreview = ({ type }) => {
  if (type === 'theme-jollibee') {
    return (
      <div className="w-full aspect-[1.4] rounded-xl border-2 border-slate-200 mb-3 overflow-hidden bg-[#fffaf9] flex flex-col shadow-sm relative pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#c93638_1.5px,transparent_1.5px)] [background-size:12px_12px]"></div>
        <div className="h-5 sm:h-6 bg-white border-b border-red-100 flex items-center px-2 justify-between z-10 shrink-0">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-[#c93638] rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          </div>
          <div className="w-12 h-2 bg-slate-100 rounded-full"></div>
          <div className="w-3 h-3 bg-red-100 rounded-full"></div>
        </div>
        <div className="flex-1 p-2 flex flex-col gap-2 z-10 overflow-hidden">
          <div className="w-full h-8 bg-gradient-to-r from-red-50 to-white rounded border border-red-100 shadow-sm flex items-center px-2">
            <div className="w-10 h-1.5 bg-[#c93638] rounded-full"></div>
          </div>
          <div className="flex gap-2 flex-1">
            <div className="flex-1 bg-white rounded border border-red-50 shadow-sm flex flex-col gap-1.5 p-1.5">
              <div className="w-full h-1 bg-slate-200 rounded-full"></div>
              <div className="w-3/4 h-1 bg-slate-100 rounded-full"></div>
            </div>
            <div className="flex-1 bg-white rounded border border-red-50 shadow-sm flex flex-col gap-1.5 p-1.5">
              <div className="w-full h-1 bg-slate-200 rounded-full"></div>
              <div className="w-3/4 h-1 bg-slate-100 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'theme-simple') {
    return (
      <div className="w-full aspect-[1.4] rounded-xl border-2 border-slate-200 mb-3 overflow-hidden bg-slate-50 flex flex-col shadow-sm relative pointer-events-none">
        <div className="h-5 sm:h-6 bg-white border-b border-slate-100 flex items-center px-2 justify-between shrink-0">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
          </div>
          <div className="w-12 h-2 bg-slate-100 rounded-full"></div>
          <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
        </div>
        <div className="flex-1 p-2 flex flex-col gap-2 overflow-hidden">
          <div className="w-full h-8 bg-white rounded border border-slate-200 shadow-sm flex items-center px-2">
            <div className="w-10 h-1.5 bg-slate-800 rounded-full"></div>
          </div>
          <div className="flex gap-2 flex-1">
            <div className="flex-1 bg-white rounded border border-slate-200 flex flex-col gap-1.5 p-1.5">
              <div className="w-full h-1 bg-slate-200 rounded-full"></div>
              <div className="w-3/4 h-1 bg-slate-100 rounded-full"></div>
            </div>
            <div className="flex-1 bg-white rounded border border-slate-200 flex flex-col gap-1.5 p-1.5">
              <div className="w-full h-1 bg-slate-200 rounded-full"></div>
              <div className="w-3/4 h-1 bg-slate-100 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'theme-dark') {
    return (
      <div className="w-full aspect-[1.4] rounded-xl border-2 border-slate-700 mb-3 overflow-hidden bg-[#070503] flex flex-col shadow-sm relative pointer-events-none">
        <div className="h-5 sm:h-6 bg-[#1d170f] border-b border-[#2e2a24] flex items-center px-2 justify-between shrink-0">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-[#ff5f56] rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-[#ffbd2e] rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-[#27c93f] rounded-full"></div>
          </div>
          <div className="w-12 h-2 bg-[#070503] rounded-full"></div>
          <div className="w-3 h-3 bg-slate-700 rounded-full"></div>
        </div>
        <div className="flex-1 p-2 flex flex-col gap-2 overflow-hidden">
          <div className="w-full h-8 bg-gradient-to-r from-[#2e2a24] to-[#1d170f] rounded border border-[#2e2a24] flex items-center px-2">
            <div className="w-10 h-1.5 bg-slate-300 rounded-full"></div>
          </div>
          <div className="flex gap-2 flex-1">
            <div className="flex-1 bg-[#1d170f] rounded border border-[#2e2a24] flex flex-col gap-1.5 p-1.5">
              <div className="w-full h-1 bg-slate-600 rounded-full"></div>
              <div className="w-3/4 h-1 bg-slate-700 rounded-full"></div>
            </div>
            <div className="flex-1 bg-[#1d170f] rounded border border-[#2e2a24] flex flex-col gap-1.5 p-1.5">
              <div className="w-full h-1 bg-slate-600 rounded-full"></div>
              <div className="w-3/4 h-1 bg-slate-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const Settings = () => {
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'theme-jollibee');
  const [lang, setLang] = useState(localStorage.getItem('app-lang') || 'vi');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    document.documentElement.className = theme; // Đặt lên thẻ html để sửa lỗi filter invert chặn modal
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // Handle restoring Google Translate state when component mounts is not needed here
  // because Google Translate widget automatically reads the 'googtrans' cookie on load.

  const changeLanguage = (targetLang) => {
    if (targetLang === lang) return;
    setLang(targetLang);
    localStorage.setItem('app-lang', targetLang);
    setIsTranslating(true);
    
    // Set Google Translate Cookie
    document.cookie = `googtrans=/vi/${targetLang}; path=/`;
    document.cookie = `googtrans=/vi/${targetLang}; domain=${window.location.hostname}; path=/`;

    // Reload page to apply translation cleanly across the entire React app
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  const themes = [
    { id: 'theme-jollibee', name: 'Sôi động (Họa tiết động)', icon: ImageIcon, color: 'text-primary bg-primary/10' },
    { id: 'theme-simple', name: 'Tối giản (Sạch sẽ)', icon: LayoutIcon, color: 'text-slate-600 bg-slate-100' },
    { id: 'theme-dark', name: 'Ban đêm (Bảo vệ mắt)', icon: Moon, color: 'text-indigo-400 bg-indigo-900/50' }
  ];

  const languages = [
    { code: 'vi', label: 'Tiếng Việt', flag: 'https://flagcdn.com/w40/vn.png' },
    { code: 'en', label: 'Tiếng Anh (English)', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'ja', label: 'Tiếng Nhật (日本語)', flag: 'https://flagcdn.com/w40/jp.png' },
    { code: 'ko', label: 'Tiếng Hàn (한국어)', flag: 'https://flagcdn.com/w40/kr.png' },
    { code: 'zh-CN', label: 'Tiếng Trung (中文)', flag: 'https://flagcdn.com/w40/cn.png' },
    { code: 'fr', label: 'Tiếng Pháp (Français)', flag: 'https://flagcdn.com/w40/fr.png' }
  ];

  return (
    <div className="max-w-[800px] mx-auto px-5 py-10 sm:py-14 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-[2rem] sm:text-[2.5rem] font-extrabold text-text-dark mb-3">Cài đặt</h1>
        <p className="text-text-light text-[1.1rem]">Tùy chỉnh giao diện và trải nghiệm của bạn</p>
      </div>

      <div className="grid gap-6">
        {/* Theme Settings */}
        <div className="bg-white/80 backdrop-blur-md border border-border-color rounded-[32px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-500 flex items-center justify-center shrink-0">
              <Palette size={20} />
            </div>
            <h2 className="text-[1.25rem] font-bold text-text-dark m-0">Chủ đề hiển thị</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`relative p-2 sm:p-5 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${
                  theme === t.id 
                    ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' 
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <ThemePreview type={t.id} />
                <h3 className="font-bold text-slate-800 text-[10px] leading-tight sm:text-sm mb-1 mt-2 sm:mt-3 text-center sm:text-left">{t.name}</h3>
                {theme === t.id && (
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-md z-20">
                    <Check size={12} className="sm:w-3.5 sm:h-3.5" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white/80 backdrop-blur-md border border-border-color rounded-[32px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-500 flex items-center justify-center shrink-0">
              <Globe size={20} />
            </div>
            <div className="flex-1">
              <h2 className="text-[1.25rem] font-bold text-text-dark m-0">Ngôn ngữ (Tự động)</h2>
              <p className="text-sm text-slate-500 mt-1">Dịch tự động toàn bộ trang web bởi Google Translate.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => changeLanguage(l.code)}
                disabled={isTranslating}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${
                  lang === l.code 
                    ? 'border-sky-500 bg-sky-50' 
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                } disabled:opacity-70 disabled:cursor-wait`}
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-col sm:flex-row text-center sm:text-left w-full sm:w-auto">
                  <img src={l.flag} alt={l.label} className="w-6 h-4 sm:w-7 sm:h-5 rounded-sm object-cover shadow-sm" />
                  <span className="font-bold text-slate-800 text-[11px] sm:text-base leading-tight">{l.label}</span>
                </div>
                <div className="hidden sm:block">
                  {isTranslating && lang !== l.code && lang === 'switching' ? (
                    <Loader size={18} className="text-sky-500 animate-spin" />
                  ) : (
                    lang === l.code && <Check size={18} className="text-sky-500" strokeWidth={3} />
                  )}
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm text-slate-600 m-0">
              <strong>Lưu ý:</strong> Tính năng này sử dụng công cụ dịch máy của Google, nên có thể văn phong sẽ không mượt mà được như người dịch thủ công. Bạn có thể gặp một số từ chuyên ngành dịch sát nghĩa đen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

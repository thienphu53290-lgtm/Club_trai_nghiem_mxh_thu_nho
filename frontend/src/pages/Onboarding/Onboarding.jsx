import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, Briefcase, Globe, Target, Music, Camera, Monitor, Compass, MapPin, MessageCircle, FileText, Image, Calendar, CheckSquare } from 'lucide-react';
import api from '../../api/axios';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  
  // State luu ket qua multiple choice array cho cac cau hoi
  const [answers, setAnswers] = useState({
    purpose: [],
    topics: [],
    contentTypes: [],
    events: '',
    source: ''
  });

  const saveOnboarding = async (payload) => {
    try {
      const res = await api.post('/onboarding', { answers: payload });
      if (res.data.status) {
        localStorage.setItem('current_user', JSON.stringify(res.data.user));
        window.dispatchEvent(new Event('user_auth_change'));
        navigate('/pricing');
      }
    } catch (error) {
      console.error("Lỗi lưu onboarding:", error);
      // Fallback
      navigate('/pricing');
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      saveOnboarding(answers);
    }
  };

  const skipToHome = () => {
    saveOnboarding({});
  };

  // Helper toggle for multiple selections
  const toggleSelection = (field, id) => {
    setAnswers(prev => {
      const currentList = prev[field];
      if (currentList.includes(id)) {
        return { ...prev, [field]: currentList.filter(item => item !== id) };
      } else {
        return { ...prev, [field]: [...currentList, id] };
      }
    });
  };

  // Helper cho single selection
  const selectSingle = (field, id) => {
    setAnswers(prev => ({ ...prev, [field]: id }));
  };

  // Data cau hoi
  const questions = {
    step1: [
      { id: 'friends', label: 'Tìm bạn bè mới', icon: <Users size={24} /> },
      { id: 'business', label: 'Kinh doanh & Khởi nghiệp', icon: <Briefcase size={24} /> },
      { id: 'content', label: 'Sáng tạo nội dung', icon: <Sparkles size={24} /> },
      { id: 'explore', label: 'Khám phá kiến thức', icon: <Globe size={24} /> },
    ],
    step2: [
      { id: 'tech', label: 'Công nghệ & IT', icon: <Monitor size={24} /> },
      { id: 'travel', label: 'Du lịch & Trải nghiệm', icon: <Compass size={24} /> },
      { id: 'music', label: 'Âm nhạc & Nghệ thuật', icon: <Music size={24} /> },
      { id: 'photo', label: 'Nhiếp ảnh', icon: <Camera size={24} /> },
    ],
    step3: [
      { id: 'long_post', label: 'Bài viết chuyên sâu', icon: <FileText size={24} /> },
      { id: 'short_media', label: 'Ảnh & Video ngắn', icon: <Image size={24} /> },
      { id: 'discussion', label: 'Thảo luận & Tranh luận', icon: <MessageCircle size={24} /> },
      { id: 'events', label: 'Check-in Sự kiện', icon: <MapPin size={24} /> },
    ],
    step4: [
      { id: 'yes', label: 'Có, tôi rất thích tham gia', icon: <Calendar size={24} /> },
      { id: 'maybe', label: 'Có thể, nếu rảnh', icon: <Target size={24} /> },
      { id: 'no', label: 'Không, tôi chỉ thích online', icon: <Monitor size={24} /> },
    ],
    step5: [
      { id: 'facebook', label: 'Từ Facebook / Tiktok' },
      { id: 'friend', label: 'Bạn bè giới thiệu' },
      { id: 'google', label: 'Tìm kiếm trên Google' },
      { id: 'other', label: 'Nguồn khác' },
    ]
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 font-sans selection:bg-[#c93638] selection:text-white">
      
      {/* Progress Bar & Skip */}
      <div className="w-full max-w-2xl mb-12">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-xs font-black text-[#c93638] tracking-widest uppercase mb-1">Onboarding</span>
            <span className="text-sm font-bold text-slate-500">Bước {step} / {totalSteps}</span>
          </div>
          <button 
            onClick={skipToHome} 
            className="px-4 py-2 bg-slate-200 text-slate-600 font-bold rounded-lg border-2 border-[#0f172a] hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-all"
          >
            Bỏ qua (Skip)
          </button>
        </div>
        <div className="w-full h-4 bg-slate-200 rounded-full border-2 border-[#0f172a] overflow-hidden p-0.5">
          <div 
            className="h-full bg-[#c93638] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-8 md:p-12 relative overflow-hidden">
        
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center mx-auto mb-6">
                <Target size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3">Mục tiêu của bạn là gì? 👋</h2>
              <p className="text-slate-500 font-medium text-lg">Bạn có thể chọn nhiều phương án.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.step1.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleSelection('purpose', p.id)}
                  className={`p-5 rounded-2xl border-2 text-left flex items-start gap-4 transition-all group relative
                    ${answers.purpose.includes(p.id) 
                      ? 'border-[#c93638] bg-rose-50 shadow-[4px_4px_0px_0px_rgba(201,54,56,1)] translate-y-[-2px]' 
                      : 'border-[#0f172a] bg-white hover:bg-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px]'
                    }
                  `}
                >
                  <div className={`p-3 rounded-xl border-2 border-[#0f172a] inline-flex shrink-0
                    ${answers.purpose.includes(p.id) ? 'bg-[#c93638] text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-white'}
                  `}>
                    {p.icon}
                  </div>
                  <div className="flex-1 mt-1">
                    <span className="font-bold text-slate-900 block">{p.label}</span>
                  </div>
                  {answers.purpose.includes(p.id) && (
                    <div className="absolute top-2 right-2 text-[#c93638]">
                      <CheckSquare size={20} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center mx-auto mb-6">
                <Compass size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3">Chủ đề bạn quan tâm? 🎨</h2>
              <p className="text-slate-500 font-medium text-lg">Chúng tôi sẽ gợi ý nội dung dựa trên sở thích này (Chọn nhiều).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.step2.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleSelection('topics', p.id)}
                  className={`p-5 rounded-2xl border-2 text-left flex items-start gap-4 transition-all group relative
                    ${answers.topics.includes(p.id) 
                      ? 'border-emerald-600 bg-emerald-50 shadow-[4px_4px_0px_0px_rgba(5,150,105,1)] translate-y-[-2px]' 
                      : 'border-[#0f172a] bg-white hover:bg-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px]'
                    }
                  `}
                >
                  <div className={`p-3 rounded-xl border-2 border-[#0f172a] inline-flex shrink-0
                    ${answers.topics.includes(p.id) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-white'}
                  `}>
                    {p.icon}
                  </div>
                  <div className="flex-1 mt-1">
                    <span className="font-bold text-slate-900 block">{p.label}</span>
                  </div>
                  {answers.topics.includes(p.id) && (
                    <div className="absolute top-2 right-2 text-emerald-600">
                      <CheckSquare size={20} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center mx-auto mb-6">
                <FileText size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3">Hình thức nội dung bạn thích? 📱</h2>
              <p className="text-slate-500 font-medium text-lg">Giúp bảng tin của bạn luôn hấp dẫn (Chọn nhiều).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.step3.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleSelection('contentTypes', p.id)}
                  className={`p-5 rounded-2xl border-2 text-left flex items-start gap-4 transition-all group relative
                    ${answers.contentTypes.includes(p.id) 
                      ? 'border-amber-500 bg-amber-50 shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] translate-y-[-2px]' 
                      : 'border-[#0f172a] bg-white hover:bg-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px]'
                    }
                  `}
                >
                  <div className={`p-3 rounded-xl border-2 border-[#0f172a] inline-flex shrink-0
                    ${answers.contentTypes.includes(p.id) ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-white'}
                  `}>
                    {p.icon}
                  </div>
                  <div className="flex-1 mt-1">
                    <span className="font-bold text-slate-900 block">{p.label}</span>
                  </div>
                  {answers.contentTypes.includes(p.id) && (
                    <div className="absolute top-2 right-2 text-amber-500">
                      <CheckSquare size={20} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center mx-auto mb-6">
                <Calendar size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3">Tham gia Event Offline? 🎟️</h2>
              <p className="text-slate-500 font-medium text-lg">Chúng tôi thường xuyên tổ chức sự kiện thực tế.</p>
            </div>

            <div className="flex flex-col gap-4 max-w-md mx-auto">
              {questions.step4.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectSingle('events', p.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all font-bold text-lg flex items-center gap-4
                    ${answers.events === p.id 
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-[4px_4px_0px_0px_rgba(147,51,234,1)] translate-x-1' 
                      : 'border-[#0f172a] bg-white text-slate-700 hover:bg-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-1'
                    }
                  `}
                >
                  {p.icon}
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-rose-100 text-[#c93638] rounded-2xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center mx-auto mb-6">
                <Globe size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3">Tuyệt vời! 🚀</h2>
              <p className="text-slate-500 font-medium text-lg">Câu hỏi cuối: Bạn biết đến chúng tôi từ đâu?</p>
            </div>

            <div className="flex flex-col gap-4 max-w-md mx-auto">
              {questions.step5.map((s) => (
                <div key={s.id} className="flex flex-col gap-2">
                  <button
                    onClick={() => selectSingle('source', s.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all font-bold text-lg
                      ${answers.source === s.id 
                        ? 'border-[#c93638] bg-rose-50 text-[#c93638] shadow-[4px_4px_0px_0px_rgba(201,54,56,1)] translate-x-1' 
                        : 'border-[#0f172a] bg-white text-slate-700 hover:bg-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-1'
                      }
                    `}
                  >
                    {s.label}
                  </button>
                  
                  {/* Hien thi input nhap text khi chon Nguon khac */}
                  {s.id === 'other' && answers.source === 'other' && (
                    <input 
                      type="text" 
                      placeholder="Nhập nguồn bạn biết đến..."
                      className="mt-2 w-full p-4 rounded-xl border-2 border-[#0f172a] bg-white text-slate-900 font-medium shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:outline-none focus:border-[#c93638] focus:shadow-[4px_4px_0px_0px_rgba(201,54,56,1)] transition-all ml-1 animate-in fade-in slide-in-from-top-2"
                      value={answers.otherSourceText || ''}
                      onChange={(e) => setAnswers({...answers, otherSourceText: e.target.value})}
                      autoFocus
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-between items-center pt-8 border-t-2 border-slate-100">
          {step > 1 ? (
             <button 
               onClick={() => setStep(step - 1)}
               className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900 transition-colors"
             >
               Quay lại
             </button>
          ) : (
            <div></div> // spacer
          )}
          
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && answers.purpose.length === 0) ||
              (step === 2 && answers.topics.length === 0) ||
              (step === 3 && answers.contentTypes.length === 0) ||
              (step === 4 && !answers.events) ||
              (step === 5 && !answers.source) ||
              (step === 5 && answers.source === 'other' && !answers.otherSourceText?.trim())
            }
            className={`px-8 py-4 rounded-xl font-black flex items-center gap-2 border-2 transition-all
              ${(step === 1 && answers.purpose.length === 0) || 
                (step === 2 && answers.topics.length === 0) || 
                (step === 3 && answers.contentTypes.length === 0) || 
                (step === 4 && !answers.events) || 
                (step === 5 && !answers.source) ||
                (step === 5 && answers.source === 'other' && !answers.otherSourceText?.trim())
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300'
                : 'bg-[#0f172a] border-[#0f172a] text-white shadow-[4px_4px_0px_0px_rgba(201,54,56,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(201,54,56,1)]'
              }
            `}
          >
            {step === totalSteps ? 'Hoàn tất & Nhận quà' : 'Tiếp tục'}
            <ArrowRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Onboarding;

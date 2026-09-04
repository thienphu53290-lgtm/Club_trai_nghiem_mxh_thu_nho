import React, { useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MoreHorizontal, MousePointerClick } from 'lucide-react';
import { useChatbotLogic } from './useChatbotLogic';

const Chatbot = () => {
  const {
    messages,
    inputText,
    setInputText,
    isTyping,
    chatMode,
    processMessage
  } = useChatbotLogic();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    processMessage(inputText);
  };

  const renderMessageText = (text) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-3xl border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col h-full overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-indigo-100 border-b-4 border-[#0f172a] p-5 flex items-center justify-between z-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-20 transform translate-x-4 -translate-y-4">
            <Sparkles size={120} className="text-indigo-700" />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-indigo-500 rounded-full flex items-center justify-center border-4 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <Bot className="text-white" size={30} />
            </div>
            <div>
              <h2 className="font-black text-[#0f172a] text-2xl uppercase tracking-tight">Trợ lý Đa Năng</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse border border-[#0f172a]"></span>
                <p className="text-sm font-bold text-indigo-800">
                  {chatMode === "creating_event" ? "Quy trình Tạo Sự Kiện" : "Sẵn sàng hỗ trợ"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Khung chat */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-slate-50">
          {messages.map((msg, index) => {
            const isLastMessage = index === messages.length - 1;

            return (
              <div key={msg.id} className="flex flex-col gap-3">
                <div className={`flex gap-4 items-end ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${
                    msg.sender === "user" ? "bg-amber-300" : "bg-indigo-400"
                  }`}>
                    {msg.sender === "user" ? <User size={20} className="text-slate-900" /> : <Bot size={20} className="text-slate-900" />}
                  </div>
                  
                  <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl border-4 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-slate-800 ${
                    msg.sender === "user" ? "bg-amber-100 rounded-br-none" : "bg-white rounded-bl-none"
                  }`}>
                    <p className="font-bold text-[15px] leading-relaxed">
                      {renderMessageText(msg.text)}
                    </p>
                  </div>
                </div>

                {msg.sender === "bot" && msg.options && isLastMessage && !isTyping && (
                  <div className="flex flex-wrap gap-2 ml-14 mt-1">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => processMessage(opt)}
                        className="bg-slate-100 hover:bg-indigo-100 border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5 active:translate-x-0.5 px-4 py-2 rounded-xl text-sm font-bold text-slate-800 transition-all flex items-center gap-2"
                      >
                        <MousePointerClick size={16} className="text-indigo-600" />
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-4 items-end">
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex flex-shrink-0 items-center justify-center border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <Bot size={20} className="text-slate-900" />
              </div>
              <div className="px-5 py-4 bg-white rounded-2xl rounded-bl-none border-4 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center">
                <MoreHorizontal className="text-slate-400 animate-pulse" size={24} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Khung nhập liệu */}
        <div className="p-5 bg-white border-t-4 border-[#0f172a] z-10 relative">
          <form onSubmit={handleSendMessage} className="flex gap-3 max-w-full">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập câu trả lời hoặc chọn gợi ý ở trên..."
              disabled={isTyping}
              className="flex-1 bg-slate-50 border-4 border-[#0f172a] rounded-2xl px-5 py-4 font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-300 text-white px-8 rounded-2xl border-4 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center group"
            >
              <Send size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Chatbot;

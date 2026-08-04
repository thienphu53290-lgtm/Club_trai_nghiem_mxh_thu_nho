import React, { useState } from 'react';
import Modal from './Modal';
import { FileText, Copy, Check, Printer, Download, BookOpen } from 'lucide-react';

const DocumentModal = ({
  isOpen,
  onClose,
  title = 'Tài Liệu & Quy Định',
  subtitle,
  content,
  sections = [],
  downloadUrl = null,
  fileSize = '2.4 MB',
  lastUpdated
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = () => {
    let fullText = content || '';
    if (sections && sections.length > 0) {
      fullText += '\n\n' + sections.map(s => `${s.heading}\n${s.body}`).join('\n\n');
    }
    navigator.clipboard.writeText(fullText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={FileText}
      iconColor="text-indigo-600"
      iconBg="bg-indigo-50 border-indigo-100"
      size="2xl"
      footer={
        <div className="w-full flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              type="button"
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? 'Đã sao chép' : 'Sao chép văn bản'}
            </button>
            <button
              onClick={handlePrint}
              type="button"
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} /> In tài liệu
            </button>
          </div>

          <div className="flex items-center gap-2">
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl transition-all no-underline flex items-center gap-1.5 shadow-sm"
              >
                <Download size={15} /> Tải file ({fileSize})
              </a>
            )}
            <button
              onClick={onClose}
              type="button"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors border-none cursor-pointer"
            >
              Đóng lại
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-slate-800 pb-2">
        {(subtitle || lastUpdated) && (
          <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold text-indigo-900">
            {subtitle && <span className="flex items-center gap-2 font-extrabold"><BookOpen size={16} /> {subtitle}</span>}
            {lastUpdated && <span className="text-indigo-600">Cập nhật lần cuối: {lastUpdated}</span>}
          </div>
        )}

        {content && (
          <div className="text-[15px] leading-relaxed font-normal text-slate-700 whitespace-pre-line bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
            {content}
          </div>
        )}

        {sections && sections.length > 0 && (
          <div className="space-y-5">
            {sections.map((sec, idx) => (
              <div key={idx} className="border-l-4 border-[#c93638] pl-4 py-1">
                <h4 className="font-extrabold text-base text-slate-900 mb-2">
                  {idx + 1}. {sec.heading}
                </h4>
                <p className="text-sm text-slate-600 font-normal leading-relaxed m-0 whitespace-pre-line">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DocumentModal;

'use client';

import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Download,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  FileText,
  FileCheck,
  Maximize2,
  FileQuestion,
  Eye,
} from 'lucide-react';
import { StudyDocument } from '@/data/funaabStructure';

interface StudentDocumentPreviewModalProps {
  document: StudyDocument | null;
  onClose: () => void;
  onDownload?: (doc: StudyDocument) => void;
}

export default function StudentDocumentPreviewModal({
  document,
  onClose,
  onDownload,
}: StudentDocumentPreviewModalProps) {
  if (!document) return null;

  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const url = document.fileUrl;
  const fileName = (document.fileName || '').toLowerCase();
  const fileType = (document.fileType || '').toLowerCase();

  const isPdf =
    fileType.includes('pdf') ||
    fileName.endsWith('.pdf') ||
    Boolean(url && url.toLowerCase().includes('.pdf'));

  const isImage =
    fileType.includes('image') ||
    Boolean(fileName.match(/\.(png|jpe?g|webp|gif|svg)$/i)) ||
    Boolean(url && url.match(/\.(png|jpe?g|webp|gif|svg)(\?|$)/i));

  const isDocx =
    fileType.includes('word') ||
    Boolean(fileName.match(/\.(docx?)$/i)) ||
    Boolean(url && url.match(/\.(docx?)(\?|$)/i));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-sm border border-slate-200 shadow-2xl max-w-5xl w-full h-[90vh] max-h-[850px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-sm bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs shrink-0">
              {isPdf ? 'PDF' : isImage ? 'IMG' : isDocx ? 'DOC' : 'FILE'}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-white truncate max-w-md sm:max-w-lg">
                {document.courseCode}: {document.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                {document.fileName} • {document.fileSize || 'Standard PDF'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {url && (
              <div className="flex items-center gap-1.5">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs"
                  title="Open full document in a new tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Open Full</span>
                </a>

                {onDownload && (
                  <button
                    onClick={() => onDownload(document)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition"
                    title="Download document file"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                )}
              </div>
            )}

            {isImage && url && (
              <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                  className="p-1.5 rounded-sm hover:bg-slate-800 text-slate-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="font-mono text-[11px] text-slate-300 w-10 text-center font-bold">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(180, z + 15))}
                  className="p-1.5 rounded-sm hover:bg-slate-800 text-slate-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-sm text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2 text-slate-600">
            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200 text-[11px]">
              {document.courseCode}
            </span>
            <span>•</span>
            <span className="font-medium">{document.semester}</span>
            {document.year && (
              <>
                <span>•</span>
                <span>{document.year}</span>
              </>
            )}
            <span>•</span>
            <span className="capitalize">{document.category.replace(/_/g, ' ')}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified Material
            </span>
            <span>•</span>
            <span>{(document.downloads || 0).toLocaleString()} downloads</span>
          </div>
        </div>

        {/* Real Document Viewer Canvas */}
        <div className="flex-1 min-h-0 bg-slate-100 flex items-center justify-center p-2 sm:p-3 overflow-hidden">
          {(() => {
            if (isPdf && url) {
              return (
                <div className="w-full h-full rounded-sm overflow-hidden border border-slate-200 bg-white shadow-xs">
                  <iframe
                    src={`${url}#toolbar=1`}
                    className="w-full h-full border-0"
                    title={document.title || document.fileName}
                  />
                </div>
              );
            }

            if (isImage && url) {
              return (
                <div className="w-full h-full flex items-center justify-center overflow-auto p-4 bg-slate-900/5">
                  <img
                    src={url}
                    alt={document.title || document.fileName}
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
                    className="max-h-[620px] max-w-full object-contain rounded-sm shadow-md border border-slate-200 bg-white transition-transform duration-150"
                  />
                </div>
              );
            }

            if (isDocx && url) {
              return (
                <div className="w-full h-full rounded-sm overflow-hidden border border-slate-200 bg-white shadow-xs">
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
                    className="w-full h-full border-0"
                    title={document.title || document.fileName}
                  />
                </div>
              );
            }

            if (url) {
              return (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-sm border border-slate-200 shadow-xs max-w-md mx-auto my-auto">
                  <FileText className="h-14 w-14 text-blue-600 mb-3" />
                  <h4 className="text-base font-bold text-slate-800">{document.fileName}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Document is ready for viewing in full resolution or offline study.
                  </p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-4 py-2 rounded-sm bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow-xs"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open in Full Viewer</span>
                  </a>
                </div>
              );
            }

            // Fallback for sample/demo syllabus documents without cloud storage attachment
            return (
              <div className="w-full h-full max-w-2xl mx-auto my-auto overflow-y-auto p-4 sm:p-6 bg-white rounded-sm border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b border-slate-200 space-y-1">
                    <p className="text-[11px] font-sans font-bold tracking-widest uppercase text-slate-500">
                      Academic Knowledge & Resource Repository
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 font-sans mt-1">
                      {document.courseCode}: {document.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {document.fileName} • {document.fileSize || 'Standard Material'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Syllabus Overview & Topic Focus:
                    </p>
                    <div className="p-4 bg-slate-50 rounded-sm border border-slate-200 text-xs font-mono leading-relaxed text-slate-800 whitespace-pre-wrap">
                      {document.previewSnippet || `Official verified curriculum notes for ${document.courseCode}.`}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <FileCheck className="w-4 h-4" />
                    <span>Curriculum Verified Document</span>
                  </span>
                  <span>Full file available for offline download</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 font-medium truncate">
            Contributor / Rep: <strong className="text-slate-800">{document.uploadedBy || 'Institutional Desk'}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Close
            </button>
            {onDownload && (
              <button
                onClick={() => onDownload(document)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

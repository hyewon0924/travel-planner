import React, { useState } from 'react'
import { X, Key, Check, Info, ExternalLink } from 'lucide-react'

export default function ApiKeyModal({ isOpen, onClose, currentKey, onSaveKey }) {
  const [inputKey, setInputKey] = useState(currentKey || '')

  if (!isOpen) return null

  const handleSave = (e) => {
    e.preventDefault()
    onSaveKey(inputKey.trim())
    onClose()
  }

  const handleClear = () => {
    setInputKey('')
    onSaveKey('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold">Google Maps API 키 설정</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Google Cloud Console에서 발급받은 <strong>Maps JavaScript API Key</strong>를 입력하시면, 웹 앱 화면에서 풀 인터랙티브 구글 지도와 동선(Polyline)을 직접 확인하실 수 있습니다.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              API Key
            </label>
            <input
              type="text"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>안내</span>
            </div>
            <p>
              • 입력하신 키는 브라우저 로컬스토리지에만 안전하게 저장됩니다.
            </p>
            <p>
              • 프로젝트의 <code>.env</code> 파일 내 <code>VITE_GOOGLE_MAPS_API_KEY</code>로 설정하셔도 됩니다.
            </p>
          </div>

          <a
            href="https://console.cloud.google.com/google/maps-apis/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
          >
            <span>Google Cloud Console 바로가기</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
            {currentKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition"
              >
                키 초기화
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-95 shadow-md shadow-blue-500/20"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

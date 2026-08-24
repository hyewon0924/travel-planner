import React, { useState, useEffect } from 'react'
import { X, CheckSquare, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'

export default function ChecklistModal({ isOpen, onClose, initialChecklist }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('osaka_travel_checklist')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    return initialChecklist.map((item) => ({ ...item, checked: false }))
  })
  const [newItemText, setNewItemText] = useState('')

  useEffect(() => {
    localStorage.setItem('osaka_travel_checklist', JSON.stringify(items))
  }, [items])

  if (!isOpen) return null

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const addItem = (e) => {
    e.preventDefault()
    if (!newItemText.trim()) return
    const newItem = {
      id: 'custom-' + Date.now(),
      text: newItemText.trim(),
      category: '추가',
      checked: false
    }
    setItems((prev) => [...prev, newItem])
    setNewItemText('')
  }

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const checkedCount = items.filter((i) => i.checked).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            <div>
              <h2 className="text-lg font-bold">여행 준비물 체크리스트</h2>
              <p className="text-xs text-emerald-100">
                {checkedCount} / {items.length}개 준비 완료
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Add item form */}
          <form onSubmit={addItem} className="flex gap-2">
            <input
              type="text"
              placeholder="새 준비물 추가..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition"
            >
              <Plus className="w-4 h-4" />
              추가
            </button>
          </form>

          {/* Checklist items */}
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition ${
                  item.checked
                    ? 'bg-slate-50 border-slate-200 text-slate-400'
                    : 'bg-white border-slate-200/80 text-slate-800 shadow-sm'
                }`}
              >
                <div
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center gap-2.5 flex-1 cursor-pointer select-none"
                >
                  {item.checked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      item.checked ? 'line-through text-slate-400' : 'font-medium text-slate-800'
                    }`}
                  >
                    {item.text}
                  </span>
                  {item.category && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-normal">
                      {item.category}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-slate-300 hover:text-rose-500 p-1 transition"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition active:scale-95 text-sm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEditor, EditorContent, Extension, useEditorState, type ChainedCommands } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link as LinkIcon, Undo, Redo,
  Minus, ChevronDown, X, ExternalLink, Trash2, ImagePlus,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { uploadBlogContentImage } from '@/lib/panelApi'
import { useToast } from './ToastProvider'

// FontSize: Tiptap dokümantasyonundaki standart custom-extension deseni —
// module augmentation olmadan `editor.chain().setFontSize(...)` tip
// kontrolünden geçmez.
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType
      unsetFontSize: () => ReturnType
    }
  }
}

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el: HTMLElement) => el.style.fontSize || null,
            renderHTML: (attrs: { fontSize?: string | null }) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: { chain: () => ChainedCommands }) =>
          chain().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: { chain: () => ChainedCommands }) =>
          chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    }
  },
})

const FONT_FAMILIES = [
  { label: 'Varsayılan', value: '' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
]

const FONT_SIZES = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px']

const COLORS = [
  '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1FAE5',
  '#DC2626', '#EA580C', '#D97706', '#16A34A', '#7FBF3A',
  '#2563EB', '#7C3AED', '#DB2777', '#FFFFFF', '#F3F4F6',
]

interface ToolbarButtonProps {
  onClick?: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: ReactNode
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        onClick?.()
      }}
      disabled={disabled}
      title={title}
      className="rounded p-1.5 transition-colors disabled:opacity-30"
      style={{
        background: active ? 'var(--color-primary)' : 'transparent',
        color: active ? '#fff' : 'var(--text-secondary)',
      }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="mx-0.5 h-5 w-px" style={{ background: 'var(--border-subtle)' }} />
}

interface DropdownOption {
  label: string
  value: string
  style?: React.CSSProperties
}

function Dropdown({
  label,
  options,
  onSelect,
  selected,
}: {
  label: string
  options: DropdownOption[]
  onSelect: (value: string) => void
  selected?: string
}) {
  const [open, setOpen] = useState(false)

  function handleSelect(val: string) {
    onSelect(val)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault()
          setOpen((o) => !o)
        }}
        className="flex min-w-22.5 items-center justify-between gap-1 rounded px-2 py-1 text-xs"
        style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
      >
        <span className="truncate">{selected || label}</span>
        <ChevronDown size={12} className="shrink-0" style={{ color: 'var(--text-faint)' }} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 z-50 mt-1 min-w-37.5 max-h-52 overflow-y-auto rounded-lg shadow-xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelect(opt.value)
              }}
              className="block w-full px-3 py-1.5 text-left text-sm"
              style={opt.style}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ColorPicker({ onPick, onReset, currentColor }: { onPick: (color: string) => void; onReset: () => void; currentColor: string }) {
  const [open, setOpen] = useState(false)
  const current = currentColor || '#000000'

  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault()
          setOpen((o) => !o)
        }}
        title="Yazı rengi"
        className="flex flex-col items-center rounded p-1.5"
      >
        <span className="text-xs leading-none font-bold" style={{ color: 'var(--text-secondary)' }}>A</span>
        <span className="mt-0.5 h-1 w-4 rounded-full" style={{ backgroundColor: current }} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 z-50 mt-1 w-48 rounded-xl p-3 shadow-xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <p className="mb-2 text-xs" style={{ color: 'var(--text-faint)' }}>Renk seç</p>
          <div className="mb-3 grid grid-cols-5 gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  onPick(c)
                  setOpen(false)
                }}
                className="h-7 w-7 rounded-full transition-transform hover:scale-110"
                style={{ backgroundColor: c, border: '1px solid var(--border-subtle)' }}
                title={c}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              defaultValue={current}
              onInput={(e) => onPick(e.currentTarget.value)}
              className="h-8 w-8 cursor-pointer rounded"
              style={{ border: '1px solid var(--border-subtle)' }}
            />
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                onReset()
                setOpen(false)
              }}
              className="text-xs"
              style={{ color: 'var(--text-faint)' }}
            >
              Sıfırla
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function LinkModal({
  open,
  initialUrl,
  onApply,
  onRemove,
  onClose,
}: {
  open: boolean
  initialUrl: string
  onApply: (url: string) => void
  onRemove: () => void
  onClose: () => void
}) {
  const [url, setUrl] = useState(initialUrl)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUrl(initialUrl)
      setTimeout(() => inputRef.current?.select(), 30)
    }
  }, [open, initialUrl])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      onApply(url)
    }
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl" style={{ background: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'rgba(127,191,58,0.1)' }}>
              <LinkIcon size={16} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Bağlantı Ekle</h3>
          </div>
          <button type="button" onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5">
          <label className="mb-2 block text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--text-muted)' }}>
            URL Adresi
          </label>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ border: '1px solid var(--border-subtle)' }}>
            <ExternalLink size={15} style={{ color: 'var(--text-faint)' }} className="shrink-0" />
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://ornek.com"
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
          <p className="mt-1.5 text-xs" style={{ color: 'var(--text-faint)' }}>https:// ile başlaması gerekir</p>
        </div>

        <div className="flex items-center gap-2 px-5 pb-5">
          <button
            type="button"
            onClick={() => onApply(url)}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Uygula
          </button>
          {initialUrl && (
            <button
              type="button"
              onClick={onRemove}
              title="Bağlantıyı kaldır"
              className="rounded-xl p-2.5"
              style={{ border: '1px solid #e74c3c40', color: '#e74c3c' }}
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm"
            style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  )
}

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [linkModal, setLinkModal] = useState<{ open: boolean; url: string }>({ open: false, url: '' })
  const [uploadingImage, setUploadingImage] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const editor = useEditor({
    // App Router SSR'da editörün sunucuda hemen render edilmeye çalışılmasını
    // engeller (renel'in Vite/SPA ortamında bu ayara gerek yoktu) — bkz. Faz 4 planı.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextStyle,
      FontSize,
      Color,
      FontFamily,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'nt-editor-link' } }),
      // src'siz/boyutsuz görsel eklenmesin diye backendin html-sanitize.ts
      // allowlist'iyle aynı attribute setine sınırlı (bkz. Faz 4 Aşama 2).
      Image.configure({ HTMLAttributes: { class: 'nt-editor-image' } }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'nt-editor-content',
      },
    },
  })

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return {
          isBold: false, isItalic: false, isUnderline: false, isStrike: false,
          isLink: false, isBulletList: false, isOrderedList: false,
          isH1: false, isH2: false, isH3: false,
          isAlignLeft: false, isAlignCenter: false, isAlignRight: false, isAlignJustify: false,
          canUndo: false, canRedo: false,
          fontFamily: '', fontSize: '', textColor: '#000000',
        }
      }
      return {
        isBold: ctx.editor.isActive('bold'),
        isItalic: ctx.editor.isActive('italic'),
        isUnderline: ctx.editor.isActive('underline'),
        isStrike: ctx.editor.isActive('strike'),
        isLink: ctx.editor.isActive('link'),
        isBulletList: ctx.editor.isActive('bulletList'),
        isOrderedList: ctx.editor.isActive('orderedList'),
        isH1: ctx.editor.isActive('heading', { level: 1 }),
        isH2: ctx.editor.isActive('heading', { level: 2 }),
        isH3: ctx.editor.isActive('heading', { level: 3 }),
        isAlignLeft: ctx.editor.isActive({ textAlign: 'left' }),
        isAlignCenter: ctx.editor.isActive({ textAlign: 'center' }),
        isAlignRight: ctx.editor.isActive({ textAlign: 'right' }),
        isAlignJustify: ctx.editor.isActive({ textAlign: 'justify' }),
        canUndo: ctx.editor.can().undo(),
        canRedo: ctx.editor.can().redo(),
        fontFamily: (ctx.editor.getAttributes('textStyle').fontFamily as string) || '',
        fontSize: (ctx.editor.getAttributes('textStyle').fontSize as string) || '',
        textColor: (ctx.editor.getAttributes('textStyle').color as string) || '#000000',
      }
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return
    if (editor.isActive('link') && editor.state.selection.empty) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    const prev = (editor.getAttributes('link').href as string) || ''
    setLinkModal({ open: true, url: prev })
  }, [editor])

  function applyLink(url: string) {
    setLinkModal({ open: false, url: '' })
    if (!url || !editor) return
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  function removeLink() {
    setLinkModal({ open: false, url: '' })
    editor?.chain().focus().extendMarkRange('link').unsetLink().run()
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !editor) return

    setUploadingImage(true)
    try {
      const { url } = await uploadBlogContentImage(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch {
      showToast('error', 'Görsel yüklenemedi. Lütfen tekrar deneyin.')
    } finally {
      setUploadingImage(false)
    }
  }

  if (!editor) return null
  // editorState yalnızca `editor` null iken null olur (bkz. useEditorState
  // tip imzası) — bir üstteki kontrolle editor'ün var olduğu kanıtlandı.
  const state = editorState!

  const currentFontLabel = FONT_FAMILIES.find((f) => f.value === state.fontFamily)?.label || 'Font'
  const currentSizeLabel = state.fontSize || 'Boyut'

  return (
    <>
      <LinkModal
        open={linkModal.open}
        initialUrl={linkModal.url}
        onApply={applyLink}
        onRemove={removeLink}
        onClose={() => setLinkModal({ open: false, url: '' })}
      />
      <input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleImagePick} />
      <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--border-subtle)' }}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-2" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-alt)' }}>

          <Dropdown
            label="Font"
            selected={currentFontLabel !== 'Font' && currentFontLabel !== 'Varsayılan' ? currentFontLabel : undefined}
            options={FONT_FAMILIES.map((f) => ({ label: f.label, value: f.value, style: { fontFamily: f.value || 'inherit' } }))}
            onSelect={(val) => {
              if (!val) editor.chain().focus().unsetFontFamily().run()
              else editor.chain().focus().setFontFamily(val).run()
            }}
          />

          <Dropdown
            label="Boyut"
            selected={currentSizeLabel !== 'Boyut' ? currentSizeLabel : undefined}
            options={FONT_SIZES.map((s) => ({ label: s, value: s }))}
            onSelect={(val) => editor.chain().focus().setFontSize(val).run()}
          />

          <Divider />

          <Dropdown
            label="Normal"
            selected={state.isH1 ? 'Başlık 1' : state.isH2 ? 'Başlık 2' : state.isH3 ? 'Başlık 3' : undefined}
            options={[
              { label: 'Normal', value: '0' },
              { label: 'Başlık 1', value: '1' },
              { label: 'Başlık 2', value: '2' },
              { label: 'Başlık 3', value: '3' },
            ]}
            onSelect={(val) => {
              if (val === '0') editor.chain().focus().setParagraph().run()
              else editor.chain().focus().toggleHeading({ level: parseInt(val) as 1 | 2 | 3 }).run()
            }}
          />

          <Divider />

          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={state.isBold} title="Kalın (Ctrl+B)">
            <Bold size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={state.isItalic} title="İtalik (Ctrl+I)">
            <Italic size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={state.isUnderline} title="Altı çizili (Ctrl+U)">
            <UnderlineIcon size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={state.isStrike} title="Üstü çizili">
            <Strikethrough size={15} />
          </ToolbarButton>

          <Divider />

          <ColorPicker
            currentColor={state.textColor}
            onPick={(c) => editor.chain().focus().setColor(c).run()}
            onReset={() => editor.chain().focus().unsetColor().run()}
          />

          <Divider />

          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={state.isAlignLeft} title="Sola hizala">
            <AlignLeft size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={state.isAlignCenter} title="Ortala">
            <AlignCenter size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={state.isAlignRight} title="Sağa hizala">
            <AlignRight size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={state.isAlignJustify} title="İki yana yasla">
            <AlignJustify size={15} />
          </ToolbarButton>

          <Divider />

          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={state.isBulletList} title="Madde listesi">
            <List size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={state.isOrderedList} title="Numaralı liste">
            <ListOrdered size={15} />
          </ToolbarButton>

          <Divider />

          <ToolbarButton onClick={setLink} active={state.isLink} title={state.isLink ? 'Bağlantıyı kaldır' : 'Bağlantı ekle'}>
            <LinkIcon size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => imageInputRef.current?.click()} disabled={uploadingImage} title="Görsel ekle">
            <ImagePlus size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Yatay çizgi">
            <Minus size={15} />
          </ToolbarButton>

          <Divider />

          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo} title="Geri al (Ctrl+Z)">
            <Undo size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo} title="İleri al (Ctrl+Y)">
            <Redo size={15} />
          </ToolbarButton>
        </div>

        <EditorContent editor={editor} />

        <style>{`
          .nt-editor-content { min-height: 320px; padding: 20px; outline: none; color: var(--text-primary); line-height: 1.7; }
          .nt-editor-content h1 { font-size: 2em; font-weight: 700; margin: 0.5em 0; }
          .nt-editor-content h2 { font-size: 1.5em; font-weight: 700; margin: 0.5em 0; }
          .nt-editor-content h3 { font-size: 1.25em; font-weight: 600; margin: 0.5em 0; }
          .nt-editor-content p { margin: 0.4em 0; }
          .nt-editor-content ul { list-style-type: disc; padding-left: 1.5em; margin: 0.4em 0; }
          .nt-editor-content ol { list-style-type: decimal; padding-left: 1.5em; margin: 0.4em 0; }
          .nt-editor-content hr { border: none; border-top: 2px solid var(--border-subtle); margin: 1em 0; }
          .nt-editor-content blockquote { border-left: 4px solid var(--color-primary); padding-left: 1em; color: var(--text-muted); margin: 0.5em 0; }
          .nt-editor-content code { background: var(--bg-alt); padding: 0.1em 0.3em; border-radius: 4px; font-family: monospace; }
          .nt-editor-content pre { background: #1f2937; color: #f9fafb; padding: 1em; border-radius: 8px; overflow-x: auto; }
          .nt-editor-content pre code { background: none; padding: 0; }
          .nt-editor-image { max-width: 100%; border-radius: 8px; }
          .nt-editor-link { color: var(--color-primary); text-decoration: underline; }
        `}</style>
      </div>
    </>
  )
}


'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { ChatArea } from '@/components/ChatArea'
import { SettingsModal } from '@/components/SettingsModal'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { useStore } from '@/store'
import { useEasterEggs } from '@/hooks/useEasterEggs'
import { useApiAutoDetect } from '@/hooks/useApiAutoDetect'

export default function Home() {
  const {
    theme,
    currentConversation,
    showSettings,
    setShowSettings,
    apiKey,
    ultraplinianApiUrl,
    ultraplinianApiKey,
    isHydrated
  } = useStore()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [videoEditorOpen, setVideoEditorOpen] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoMode, setVideoMode] = useState('10')
  const [message, setMessage] = useState('')

  useEasterEggs()
  useApiAutoDetect()

  const proxyMode =
    !apiKey &&
    !!ultraplinianApiUrl &&
    !!ultraplinianApiKey

  useEffect(() => {
    const root = document.documentElement

    root.classList.remove(
      'theme-matrix',
      'theme-hacker',
      'theme-glyph',
      'theme-minimal'
    )

    root.classList.add(`theme-${theme}`)
  }, [theme])

  function handleVideoRequest() {
    if (!videoUrl.trim()) {
      setMessage('Cole o link da live primeiro.')
      return
    }

    try {
      const url = new URL(videoUrl)

      if (
        !['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be']
          .includes(url.hostname) ||
        url.protocol !== 'https:'
      ) {
        setMessage('Insira um link HTTPS válido do YouTube.')
        return
      }
    } catch {
      setMessage('O link informado não é válido.')
      return
    }

    setMessage(
      'Link recebido! A interface está pronta. ' +
      'Agora precisamos conectar o servidor de edição ' +
      'para gerar os arquivos MP4.'
    )
  }

  if (!isHydrated) {
    return (
      <div
        className={`theme-${theme} theme-bg min-h-screen flex items-center justify-center`}
      >
        <div className="theme-primary text-xl font-mono">
          <span className="loading-dots">
            Initializing G0DM0D3
          </span>
        </div>
      </div>
    )
  }

  return (
    <main
      className={`theme-${theme} theme-bg theme-text min-h-screen flex relative overflow-hidden`}
    >
      {(theme === 'matrix' || theme === 'hacker') && (
        <div className="scanlines pointer-events-none absolute inset-0 z-50" />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-end p-3 border-b border-current/20">
          <button
            type="button"
            onClick={() => setVideoEditorOpen(!videoEditorOpen)}
            className="rounded-lg bg-green-600 hover:bg-green-700 px-4 py-3 text-white font-bold"
          >
            {videoEditorOpen ? 'VOLTAR AO CHAT' : '🎬 EDITAR VÍDEO'}
          </button>
        </div>

        {videoEditorOpen ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-xl mx-auto space-y-5">
              <h1 className="text-2xl font-bold">
                🎬 Editor de Vídeo IA
              </h1>

              <p>
                Prepare cortes de lives do YouTube
                para TikTok, Reels e Shorts.
              </p>

              <div className="space-y-2">
                <label
                  htmlFor="video-url"
                  className="block font-semibold"
                >
                  Link da live
                </label>

                <input
                  id="video-url"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value)
                    setMessage('')
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-3 rounded-lg bg-black/20 border border-current/30"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="video-mode"
                  className="block font-semibold"
                >
                  Tipo de edição
                </label>

                <select
                  id="video-mode"
                  value={videoMode}
                  onChange={(e) => setVideoMode(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600"
                >
                  <option value="10">
                    10 melhores momentos
                  </option>
                  <option value="90">
                    1 vídeo de até 90 segundos
                  </option>
                </select>
              </div>

              <div className="rounded-lg border border-current/20 p-4 space-y-2">
                <h2 className="font-bold">
                  Configuração desejada
                </h2>

                <p>✓ Formato vertical 9:16</p>
                <p>✓ Gameplay preservada</p>
                <p>✓ Facecam sem zoom</p>
                <p>✓ Legendas em português</p>
                <p>✓ Títulos para os cortes</p>
                <p>✓ Exportação MP4 sem marca d'água</p>
              </div>

              <button
                type="button"
                onClick={handleVideoRequest}
                className="w-full rounded-lg bg-green-600 hover:bg-green-700 p-4 text-white font-bold"
              >
                PREPARAR EDIÇÃO
              </button>

              {message && (
                <p
                  role="status"
                  className="rounded-lg border border-current/30 p-4"
                >
                  {message}
                </p>
              )}

              <p className="text-sm opacity-70">
                Esta é a primeira etapa: a interface.
                A análise das lives e a criação de
                vídeos ainda exigem um servidor de
                processamento conectado.
              </p>
            </div>
          </div>
        ) : (
          (!apiKey && !proxyMode) || !currentConversation ? (
            <WelcomeScreen
              onOpenSettings={() => setShowSettings(true)}
            />
          ) : (
            <ChatArea />
          )
        )}
      </div>

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
        />
      )}
    </main>
  )
}

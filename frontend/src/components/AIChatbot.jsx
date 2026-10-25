
import { useEffect, useRef, useState } from 'react'

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content:
                'Assalam-o-Alaikum! 👋 Welcome to Stylehood.\n\nMain tumhari clothing products, prices aur categories dhoondhne mein help kar sakta hoon.\n\nTry karo: "Show me winterwear" ya "Products under 3000".'
        }
    ])

    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading, isOpen])

    const sendMessage = async (event) => {
        event.preventDefault()

        const text = message.trim()

        if (!text || loading) return

        setMessages(prev => [
            ...prev,
            { role: 'user', content: text }
        ])

        setMessage('')
        setLoading(true)

        try {
            const backendUrl =
                import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

            const response = await fetch(
                `${backendUrl}/api/ai/chat`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: text })
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Chat request failed')
            }

            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: data.reply
                }
            ])
        } catch (error) {
            console.error('Stylehood chatbot error:', error)

            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content:
                        'Sorry! Chatbot se connection nahi ho raha. Backend check karke dobara try karein.'
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed bottom-5 right-5 z-[100] font-outfit">

            {isOpen && (
                <div className="mb-4 flex h-[min(520px,75vh)] w-[min(360px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                    {/* Header */}
                    <div className="flex items-center justify-between bg-[#0F172A] px-4 py-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F97316] text-lg font-bold">
                                S
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Stylehood AI
                                </h3>
                                <p className="text-xs text-slate-300">
                                    Fashion Assistant
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chatbot"
                            className="rounded-lg px-3 py-1 text-2xl hover:bg-white/10"
                        >
                            ×
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
                        {messages.map((item, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    item.role === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                }`}
                            >
                                <div
                                    className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3 py-3 text-sm leading-6 ${
                                        item.role === 'user'
                                            ? 'rounded-br-sm bg-[#F97316] text-white'
                                            : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700'
                                    }`}
                                >
                                    {item.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                                Finding products...
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={sendMessage}
                        className="flex gap-2 border-t border-slate-200 bg-white p-3"
                    >
                        <input
                            type="text"
                            value={message}
                            onChange={event => setMessage(event.target.value)}
                            placeholder="Ask about clothing..."
                            maxLength={1000}
                            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
                        />

                        <button
                            type="submit"
                            disabled={loading || !message.trim()}
                            className="rounded-xl bg-[#F97316] px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setIsOpen(prev => !prev)}
                    className="flex h-14 items-center gap-3 rounded-full bg-[#0F172A] px-5 text-white shadow-xl ring-2 ring-white transition hover:-translate-y-1 hover:bg-slate-800"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F97316] text-sm font-bold">
                        AI
                    </span>

                    <span className="text-sm font-semibold">
                        Fashion Help
                    </span>
                </button>
            </div>
        </div>
    )
}

export default AIChatbot


import { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const AIChatbot = () => {
  const { addToCart } = useContext(ShopContext);

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingProduct, setAddingProduct] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        'Assalam-o-Alaikum! 👋 Welcome to Stylehood.\n\nMain tumhari clothing products, prices aur categories dhoondhne mein help kar sakta hoon.\n\nTry karo: "Show me winterwear" ya "Products under 3000".',
    },
  ]);

  const bottomRef = useRef(null);

  const quickReplies = [
    {
      label: "👕 Kids Wear",
      message: "Mujhe kids ke kapray dikhao",
    },
    {
      label: "❄️ Winterwear",
      message: "Mujhe winterwear products dikhao",
    },
    {
      label: "💰 Under Rs. 2000",
      message: "2000 se kam price ke products dikhao",
    },
    {
      label: "✨ Best Picks",
      message: "Mere liye best clothing products recommend karo",
    },
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  const sendMessage = async (event, quickText = "") => {
    event?.preventDefault();

    const text = (quickText || message).trim();

    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const backendUrl = (
        import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
      ).replace(/\/+$/, "");

      const response = await fetch(`${backendUrl}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Chat request failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Sorry, mujhe reply nahi mila.",
          products: Array.isArray(data.products) ? data.products : [],
        },
      ]);
    } catch (error) {
      console.error("Stylehood chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry! Chatbot se connection nahi ho raha. Please thori dair baad dobara try karein.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendQuickReply = (text) => {
    if (!loading) {
      sendMessage({ preventDefault: () => {} }, text);
    }
  };

  const formatPrice = (price) => {
    const amount = Number(price);

    if (!Number.isFinite(amount)) {
      return "Price unavailable";
    }

    return `PKR ${amount.toLocaleString("en-PK")}`;
  };

  const getProductImage = (product) => {
    const images = product.Image || product.image || product.images;

    if (Array.isArray(images)) {
      return images[0] || "";
    }

    return typeof images === "string" ? images : "";
  };

  const getProductSizes = (product) => {
    const sizes = product.Sizes || product.sizes;
    return Array.isArray(sizes) ? sizes : [];
  };

const handleAddToCart = async (product) => {
  const productId = product._id || product.id;
  const sizes = getProductSizes(product);
  const selectedSize = selectedSizes[productId];

  if (!productId) {
    toast.error("Product not found");
    return;
  }

  if (!selectedSize) {
    toast.error("Select Product size");
    return;
  }

  try {
    await addToCart(productId, selectedSize);
    // ShopContext ka existing success toast use hoga.
  } catch (error) {
    console.error("Add to cart error:", error);
    toast.error("Failed to add product to cart");
  }
};

  return (
    <div className="fixed bottom-5 right-5 z-[100] font-outfit">
      {isOpen && (
        <div className="mb-4 flex h-[min(600px,78vh)] w-[min(390px,calc(100vw-28px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between bg-[#0F172A] px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F97316] text-lg font-bold">
                S
              </div>

              <div>
                <h3 className="font-semibold">Stylehood AI</h3>
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

          {/* Chat messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">

            {/* Quick Explore */}
            {messages.length === 1 && !loading && (
              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Quick explore
                </p>

                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      disabled={loading}
                      onClick={() => sendQuickReply(item.message)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-[#0F172A] shadow-sm transition hover:border-[#F97316] hover:bg-orange-50 hover:text-[#F97316] disabled:opacity-50"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  item.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[92%] whitespace-pre-wrap break-words rounded-2xl px-3 py-3 text-sm leading-6 ${
                    item.role === "user"
                      ? "rounded-br-sm bg-[#F97316] text-white"
                      : "rounded-bl-sm border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {item.content}
                </div>

                {/* Product cards */}
                {item.role === "assistant" &&
                  item.products?.length > 0 && (
                    <div className="mt-3 grid w-full grid-cols-2 gap-3">
                      {item.products.map((product, productIndex) => {
                        const image = getProductImage(product);
                        const productId = product._id || product.id;
                        const sizes = getProductSizes(product);
                        const selectedSize = selectedSizes[productId] || "";

                        return (
                          <div
                            key={productId || productIndex}
                            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                          >
                            {image ? (
                              <img
                                src={image}
                                alt={product.name || "Stylehood product"}
                                loading="lazy"
                                className="h-36 w-full bg-slate-100 object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-36 items-center justify-center bg-slate-100 text-xs text-slate-400">
                                Image unavailable
                              </div>
                            )}

                            <div className="space-y-2 p-3">
                              <p className="line-clamp-2 text-sm font-semibold text-[#0F172A]">
                                {product.name || "Stylehood Product"}
                              </p>

                              <p className="text-sm font-bold text-[#F97316]">
                                {formatPrice(product.price)}
                              </p>

                              {sizes.length > 0 && (
                                <div>
                                  <label
                                    htmlFor={`size-${productId}-${index}`}
                                    className="mb-1 block text-xs font-medium text-slate-600"
                                  >
                                    Select size
                                  </label>

                                  <select
                                    id={`size-${productId}-${index}`}
                                    value={selectedSize}
                                    onChange={(event) =>
                                      setSelectedSizes((prev) => ({
                                        ...prev,
                                        [productId]: event.target.value,
                                      }))
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs text-slate-700 outline-none focus:border-[#F97316]"
                                  >
                                    <option value="">Choose size</option>
                                    {sizes.map((size) => (
                                      <option key={size} value={size}>
                                        {size}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() => handleAddToCart(product)}
                                disabled={
                                  !productId || addingProduct !== null
                                }
                                className="w-full rounded-lg bg-[#F97316] px-2 py-2.5 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {addingProduct === productId
                                  ? "Adding..."
                                  : "🛍️ Add to Cart"}
                              </button>

                              {productId && (
                                <Link
                                  to={`/product/${productId}`}
                                  onClick={() => setIsOpen(false)}
                                  className="block text-center text-xs font-medium text-[#0F172A] underline underline-offset-2 hover:text-[#F97316]"
                                >
                                  View Details
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            ))}

            {loading && (
              <div className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                <span className="animate-pulse">
                  Finding products...
                </span>
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
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about clothing..."
              maxLength={1000}
              aria-label="Message Stylehood AI"
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="rounded-xl bg-[#F97316] px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close Stylehood AI" : "Open Stylehood AI"}
          className="flex h-14 items-center gap-3 rounded-full bg-[#0F172A] px-5 text-white shadow-xl ring-2 ring-white transition hover:-translate-y-1 hover:bg-slate-800"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F97316] text-sm font-bold">
            AI
          </span>

          <span className="text-sm font-semibold">Fashion Help</span>
        </button>
      </div>
    </div>
  );
};

export default AIChatbot;

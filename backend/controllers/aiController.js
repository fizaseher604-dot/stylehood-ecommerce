import { GoogleGenAI } from "@google/genai";
import productModel from "../models/productModel.js";

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    const customerMessage = message.trim().slice(0, 4000);
    const normalizedMessage = customerMessage.toLowerCase();

    // Fetch only products that are currently in stock.
    const products = await productModel
      .find({
        stock: { $gt: 0 },
      })
      .limit(100)
      .lean();

    const getSearchText = (product) =>
      [product.name, product.description, product.category, product.subCategory]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    // Detect a budget in English and Roman Urdu.
    const budgetPatterns = [
      /(?:under|below|less\s+than|within|maximum|max|upto|up\s+to|budget(?:\s+of)?)\s*(?:rs\.?|pkr)?\s*([\d,]+)/i,
      /(?:rs\.?|pkr)\s*([\d,]+)\s*(?:se\s+kam|tak|ke\s+andar|or\s+under|or\s+less)/i,
      /([\d,]+)\s*(?:rs\.?|pkr)?\s*(?:se\s+kam|ke\s+andar|or\s+under|or\s+less)/i,
    ];

    let budget = null;

    for (const pattern of budgetPatterns) {
      const match = customerMessage.match(pattern);

      if (match) {
        const amount = Number(match[1].replace(/,/g, ""));

        if (Number.isFinite(amount) && amount > 0) {
          budget = amount;
          break;
        }
      }
    }

    // Identify requested product types.
    const productTypeGroups = [
      {
        name: "jacket",
        terms: ["jacket", "jackets", "coat", "coats"],
      },
      {
        name: "sweater",
        terms: ["sweater", "sweaters", "jumper", "jumpers"],
      },
      {
        name: "hoodie",
        terms: ["hoodie", "hoodies"],
      },
      {
        name: "trouser",
        terms: ["trouser", "trousers", "pants"],
      },
      {
        name: "tshirt",
        terms: ["t-shirt", "tshirt", "tee", "tees"],
      },
      {
        name: "shirt",
        terms: ["shirt", "shirts"],
      },
      {
        name: "dress",
        terms: ["dress", "dresses"],
      },
      {
        name: "kurta",
        terms: ["kurta", "kurtas"],
      },
    ];

    const requestedTypes = productTypeGroups.filter((group) =>
      group.terms.some((term) => normalizedMessage.includes(term)),
    );

    // Detect specific categories.
    const wantsKids =
      /\b(kids?|children|child|boys?|girls?|bachon|bachon ke|bachon kay)\b/i.test(
        normalizedMessage,
      );

    const wantsMen = /\b(men|mens|man|male|boys?|gents)\b/i.test(
      normalizedMessage,
    );

    const wantsWomen = /\b(women|womens|woman|ladies|female|girls?)\b/i.test(
      normalizedMessage,
    );

    const wantsWinter =
      /\b(winter|winterwear|warm|cold weather|sardi|sardiyon|thand)\b/i.test(
        normalizedMessage,
      );

    const wantsTopwear = /\b(topwear|tops|upper wear)\b/i.test(
      normalizedMessage,
    );

    const wantsBottomwear = /\b(bottomwear|bottoms|lower wear)\b/i.test(
      normalizedMessage,
    );

    const isProductSearch =
      budget !== null ||
      requestedTypes.length > 0 ||
      wantsKids ||
      wantsMen ||
      wantsWomen ||
      wantsWinter ||
      wantsTopwear ||
      wantsBottomwear ||
      /\b(products?|items?|kapray|kapre|clothes|clothing|dikhao|show me|recommend)\b/i.test(
        normalizedMessage,
      );

    // Filter products deterministically before asking the AI.
    let matchingProducts = products.filter((product) => {
      const price = Number(product.price);
      const searchText = getSearchText(product);

      // Do not include invalid prices in a budget search.
      if (budget !== null) {
        if (!Number.isFinite(price) || price > budget) {
          return false;
        }
      }

      // Match the requested product type.
      if (requestedTypes.length > 0) {
        const typeMatches = requestedTypes.some((group) =>
          group.terms.some((term) => {
            const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            return new RegExp(`\\b${escaped}\\b`, "i").test(searchText);
          }),
        );

        if (!typeMatches) return false;
      }

      // Match winterwear through actual product fields.
      if (wantsWinter) {
        const winterMatches =
          /\bwinter(?:wear)?\b|\bwarm\b|\bfleece\b|\bthermal\b|\bfaux fur\b|\bknit\b|\bsweater\b|\bhoodie\b|\bjacket\b|\bcoat\b/i.test(
            searchText,
          );

        if (!winterMatches) return false;
      }

      // Match kids using the product's category or name.
      if (wantsKids) {
        const kidsMatches =
          /\bkids?\b|\bchildren\b|\bchild\b|\bboys?\b|\bgirls?\b|\btoddler\b/i.test(
            searchText,
          );

        if (!kidsMatches) return false;
      }

      if (wantsMen && !wantsKids && wantsWomen === false) {
        const category = String(product.category || "").toLowerCase();

        if (
          category &&
          !/\bmen\b|\bmens\b|\bmale\b|\bgents\b/.test(category) &&
          !/\bmen\b|\bmens\b|\bmale\b|\bgents\b/.test(searchText)
        ) {
          return false;
        }
      }

      if (wantsWomen && !wantsKids) {
        const category = String(product.category || "").toLowerCase();

        if (
          category &&
          !/\bwomen\b|\bwomens\b|\bladies\b|\bfemale\b/.test(category) &&
          !/\bwomen\b|\bwomens\b|\bladies\b|\bfemale\b/.test(searchText)
        ) {
          return false;
        }
      }

      if (wantsTopwear) {
        const subCategory = String(product.subCategory || "").toLowerCase();

        if (subCategory && subCategory !== "topwear") return false;
      }

      if (wantsBottomwear) {
        const subCategory = String(product.subCategory || "").toLowerCase();

        if (subCategory && subCategory !== "bottomwear") return false;
      }

      return true;
    });

    // If the customer asked for products but none match, do not show unrelated items.
    if (isProductSearch && matchingProducts.length === 0) {
      let reply =
        "Sorry, tumhari request ke mutabiq koi matching product nahi mila.";

      if (budget !== null) {
        reply += ` Budget PKR ${budget.toLocaleString("en-PK")} tak rakha gaya tha.`;
      }

      reply += " Tum budget ya product category change karke try kar sakte ho.";

      return res.json({
        success: true,
        reply,
        products: [],
      });
    }

    // Send only matching products to Gemini for product searches.
    const catalogue = (isProductSearch ? matchingProducts : products)
      .slice(0, 100)
      .map((product) => ({
        id: String(product._id),
        name: product.name || "Unnamed product",
        description: product.description || "",
        price: Number(product.price || 0),
        category: product.category || "",
        subCategory: product.subCategory || "",
        sizes: Array.isArray(product.Sizes) ? product.Sizes : [],
      }));

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.interactions.create({
      model: "gemini-3.5-flash-lite",
      input: `
You are Stylehood's friendly AI fashion assistant.

LANGUAGE:
- Understand English, Urdu and Roman Urdu.
- Reply in the same language as the customer.
- If the customer writes Roman Urdu, reply in natural Roman Urdu.
- Be friendly, helpful, concise and professional.

STRICT PRODUCT RULES:
- Recommend ONLY products present in the supplied catalogue.
- Never invent names, prices, sizes or availability.
- Prices are in Pakistani Rupees (PKR).
- Use the exact product names from the catalogue.
- Recommend no more than 4 products.
- Never recommend a product outside the supplied catalogue.
- If no products match, say no matching products were found.
- Never claim an order or payment has been completed.
- For greetings and general conversation, reply naturally.
- When recommending products, write their exact names so the website can display their cards.

FILTERS ALREADY APPLIED:
${budget !== null ? `- Maximum price: PKR ${budget}.` : "- No explicit price limit detected."}
${requestedTypes.length ? `- Requested product type: ${requestedTypes.map((group) => group.name).join(", ")}.` : ""}
${wantsKids ? "- Customer requested kids/children's products." : ""}
${wantsMen ? "- Customer requested men's products." : ""}
${wantsWomen ? "- Customer requested women's products." : ""}
${wantsWinter ? "- Customer requested winter/warm clothing." : ""}
- The catalogue below has already been filtered where applicable.
- Do not suggest products that are absent from this catalogue.

STYLEHOOD PRODUCT CATALOGUE:
${JSON.stringify(catalogue)}

CUSTOMER MESSAGE:
${customerMessage}
`,
      generation_config: {
        thinking_level: "low",
        max_output_tokens: 700,
      },
    });

    const reply = response.output_text?.trim();

    if (!reply) {
      return res.status(502).json({
        success: false,
        message: "No reply received. Please try again.",
      });
    }

    // Only return real products that match the filtered catalogue
    // and whose exact names were mentioned in the AI reply.
    const normalizedReply = reply.toLowerCase();

    const sourceProducts = isProductSearch ? matchingProducts : products;

    const matchedProducts = sourceProducts.filter((product) => {
      const name = (product.name || "").trim();

      if (!name || !normalizedReply.includes(name.toLowerCase())) {
        return false;
      }

      if (budget !== null && Number(product.price) > budget) {
        return false;
      }

      return true;
    });

    const productCards = matchedProducts
  .filter((product) => Number(product.stock || 0) > 0)
  .slice(0, 4)
  .map((product) => ({
    _id: String(product._id),
    name: product.name,
    price: Number(product.price || 0),
    Image: Array.isArray(product.Image) ? product.Image : [],
    Sizes: Array.isArray(product.Sizes) ? product.Sizes : [],
    category: product.category || "",
    subCategory: product.subCategory || "",
    stock: Number(product.stock || 0),
  }));

    return res.json({
      success: true,
      reply,
      products: productCards,
    });
  } catch (error) {
    console.error("Stylehood Gemini chatbot error:", error.message || error);

    return res.status(500).json({
      success: false,
      message: "Chatbot abhi reply nahi kar pa raha. Please try again.",
    });
  }
};

export { chatWithAI };

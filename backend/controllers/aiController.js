import { GoogleGenAI } from '@google/genai'
import productModel from '../models/productModel.js'

const chatWithAI = async (req, res) => {
    console.log('AI CHAT ROUTE HIT:', req.body)

    try {
        const { message } = req.body

        if (typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a message.'
            })
        }

        const apiKey = process.env.GEMINI_API_KEY

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is missing from backend .env')
        }

        const products = await productModel.find({})
            .limit(100)
            .lean()

        const catalogue = products.map(product => ({
            name: product.name || 'Unnamed product',
            description: product.description || '',
            price: Number(product.price || 0),
            category: product.category || '',
            subCategory: product.subCategory || '',
            sizes: product.Sizes || []
        }))

        const ai = new GoogleGenAI({ apiKey })

        const response = await ai.interactions.create({
           model: 'gemini-3.5-flash-lite',

            input: `
You are Stylehood's friendly AI fashion assistant.

Reply naturally to greetings, general conversation,
fashion questions, and shopping questions.

Understand English, Urdu, and Roman Urdu.
Usually reply in the same language as the customer.
Be friendly, helpful, and concise.

Recommend real products only from the catalogue below.
Never invent product names, prices, or sizes.
Prices are in Pakistani Rupees (PKR).
Help customers choose clothes based on their budget,
occasion, season, and preferred clothing type.

If a matching product is unavailable, say so politely.
Never claim that an order or payment has been completed.

STYLEHOOD PRODUCT CATALOGUE:
${JSON.stringify(catalogue)}

CUSTOMER MESSAGE:
${message.trim().slice(0, 4000)}
`,

            generation_config: {
                thinking_level: 'low',
                max_output_tokens: 700
            }
        })

        const reply = response.output_text?.trim()

        if (!reply) {
            return res.status(502).json({
                success: false,
                message: 'No reply received. Please try again.'
            })
        }

        return res.json({
            success: true,
            reply
        })

    } catch (error) {
        console.error(
            'Stylehood Gemini chatbot error:',
            error.message || error
        )

        return res.status(500).json({
            success: false,
            message: 'Chatbot abhi reply nahi kar pa raha. Please try again.'
        })
    }
}

export { chatWithAI }
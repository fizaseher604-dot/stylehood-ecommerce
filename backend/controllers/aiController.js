
import productModel from '../models/productModel.js'

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body

        if (typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a message.'
            })
        }

        const text = message.toLowerCase().trim()

        // Fetch actual Stylehood products from MongoDB
        const products = await productModel.find({}).limit(100).lean()

        let matchedProducts = products.filter(product => {
            const searchableText = [
                product.name,
                product.description,
                product.category,
                product.subCategory
            ].filter(Boolean).join(' ').toLowerCase()

            const keywords = text
                .replace(/[^\w\s]/g, ' ')
                .split(/\s+/)
                .filter(word => word.length > 2)

            return keywords.some(keyword =>
                searchableText.includes(keyword)
            )
        })

        // Price filter, e.g. "under 3000"
        const priceMatch = text.match(
    /(?:under|below|less than|within|budget|under rs|under pkr|under)\s*(?:rs\.?|pkr)?\s*(\d+)/
) || text.match(
    /(\d+)\s*(?:pkr|rs|rupees)?\s*(?:se kam|tak|ke andar|sy kam)/
)

        if (priceMatch) {
            const maxPrice = Number(priceMatch[1])

            matchedProducts = matchedProducts.filter(product =>
                Number(product.price) <= maxPrice
            )
        }

        // Greetings
        if (/^(hi|hello|hey|salam|assalam|aoa)\b/i.test(text)) {
            return res.json({
                success: true,
                reply: 'Assalam-o-Alaikum! 👋 Welcome to Stylehood. Aap men, women ya kids ke clothing products dhoondh rahe hain?'
            })
        }

        if (matchedProducts.length === 0) {
            return res.json({
                success: true,
                reply: 'Mujhe is message se matching product nahi mila. 😊 Aap Men, Women, Kids, winterwear, shirts ya trousers search kar sakte hain.'
            })
        }

        const results = matchedProducts.slice(0, 5)

        const productList = results.map((product, index) => {
            const price = Number(product.price || 0).toLocaleString('en-PK')

            return `${index + 1}. ${product.name}
Price: PKR ${price}
Category: ${product.category || 'Clothing'}
Subcategory: ${product.subCategory || 'Not specified'}`
        }).join('\n\n')

        return res.json({
            success: true,
            reply: `Stylehood par aap ke liye yeh products mile hain! 🛍️\n\n${productList}\n\nKisi product ko dekhne ke liye website ke Collection page par search karein.`
        })
    } catch (error) {
        console.error('Free chatbot error:', error)

        return res.status(500).json({
            success: false,
            message: 'Chatbot abhi available nahi hai.'
        })
    }
}

export { chatWithAI }

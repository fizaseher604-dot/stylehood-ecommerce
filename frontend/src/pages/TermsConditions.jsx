
import PolicyLayout from '../components/PolicyLayout'

const TermsConditions = () => {
  const sections = [
    {
      heading: '1. Using Our Website',
      text: 'By using the Stylehood website, you agree to use it lawfully and provide accurate information when placing an order.',
    },
    {
      heading: '2. Product Information',
      text: 'We aim to display accurate product descriptions, colours, images, sizes and prices. Actual colours may vary slightly depending on your screen.',
    },
    {
      heading: '3. Prices and Orders',
      text: 'All prices are displayed in Pakistani Rupees (PKR). Orders may require confirmation before dispatch. If a product or price contains an error, we will contact you before proceeding.',
    },
    {
      heading: '4. Payments',
      text: 'Cash on Delivery is subject to order confirmation and delivery availability. JazzCash and Easypaisa are demo options until an official payment integration is connected. A demo selection does not mean a real payment has been made.',
    },
    {
      heading: '5. Shipping, Returns and Exchanges',
      text: 'Orders and return or exchange requests are handled according to the Shipping & Delivery and Returns & Exchanges policies published on our website.',
    },
    {
      heading: '6. Website Content',
      text: 'Stylehood branding, design, text and other website content may be protected by intellectual property laws. Please do not copy or reuse content without permission.',
    },
    {
      heading: '7. Website Availability',
      text: 'We may update, maintain or temporarily suspend parts of the website when necessary.',
    },
    {
      heading: '8. Changes to These Terms',
      text: 'We may update these terms when our services or policies change. The latest version will be published on this page.',
    },
    {
      heading: '9. Contact Us',
      text: 'If you have questions about these terms, please contact us through the Contact Us page.',
    },
  ]

  return (
    <PolicyLayout
      title="Terms & Conditions"
      subtitle="The terms that apply when browsing and shopping with Stylehood."
      updated="October 2026"
      sections={sections}
    />
  )
}

export default TermsConditions
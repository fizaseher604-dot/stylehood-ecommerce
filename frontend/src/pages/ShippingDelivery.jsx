
import PolicyLayout from '../components/PolicyLayout'

const ShippingDelivery = () => {
  const sections = [
    {
      heading: '1. Order Processing',
      text: 'After placing your order, please allow 1–2 business days for processing. During busy periods, processing may take longer.'
    },
    {
      heading: '2. Delivery Time',
      text: 'Estimated delivery is 3–7 business days after dispatch within Pakistan. Remote locations, public holidays, weather and courier delays may affect delivery times.'
    },
    {
      heading: '3. Shipping Charges',
      text: 'The standard delivery fee currently configured on our website is PKR 200 per order. Any applicable delivery charges will be shown at checkout before you confirm your order.'
    },
    {
      heading: '4. Order Confirmation',
      text: 'Please provide a correct phone number and complete delivery address. Our team may contact you to confirm your order before dispatch.'
    },
    {
      heading: '5. Tracking Your Order',
      text: 'If order tracking information is available, you can check your order status through the Orders section of your account. Tracking status may take time to update.'
    },
    {
      heading: '6. Delivery Issues',
      text: 'If your parcel is delayed or you receive an incorrect delivery update, contact our support team with your order details so we can assist you.'
    }
  ]

  return (
    <PolicyLayout
      title="Shipping & Delivery"
      subtitle="Everything you need to know about receiving your Stylehood order."
      updated="October 2026"
      sections={sections}
    />
  )
}

export default ShippingDelivery

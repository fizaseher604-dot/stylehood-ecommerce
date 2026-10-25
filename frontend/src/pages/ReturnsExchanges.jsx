
import PolicyLayout from '../components/PolicyLayout'

const ReturnsExchanges = () => {
  const sections = [
    {
      heading: '1. Return Window',
      text: 'Please contact us within 7 days of receiving your order to request a return. This is a proposed store policy and should only be published if it matches your actual return arrangements.'
    },
    {
      heading: '2. Eligible Items',
      text: 'Items should be unused, unwashed, undamaged and returned with their original tags and packaging. Items that do not meet the published return conditions may not qualify, subject to applicable consumer rights.'
    },
    {
      heading: '3. Size Exchanges',
      text: 'If you need another size, contact our team with your order details and preferred size. Exchanges depend on stock availability and confirmation from our team.'
    },
    {
      heading: '4. Damaged or Incorrect Products',
      text: 'If you receive a damaged, defective or incorrect item, contact us as soon as possible and provide your order details and relevant photos so we can review the issue.'
    },
    {
      heading: '5. Refunds',
      text: 'Any approved refund will be arranged using a method agreed with the customer. Processing time depends on the agreed method and any payment provider involved. We will explain any applicable delivery charges before confirming the return.'
    },
    {
      heading: '6. How to Request a Return',
      text: 'Visit our Contact Us page and provide your order details, the reason for the return or exchange, and your preferred resolution. Please wait for our instructions before sending an item back.'
    }
  ]

  return (
    <PolicyLayout
      title="Returns & Exchanges"
      subtitle="Our guide to requesting a return, replacement or size exchange."
      updated="October 2026"
      sections={sections}
    />
  )
}

export default ReturnsExchanges

import PolicyLayout from '../components/PolicyLayout'

const PrivacyPolicy = () => {
  const sections = [
    {
      heading: '1. Information We Collect',
      text: 'When you use Stylehood, we may collect information you provide, such as your name, email address, phone number, delivery address, account details and order information.'
    },
    {
      heading: '2. How We Use Your Information',
      text: 'We use relevant information to process orders, arrange delivery, manage your account, respond to support requests, improve our website and help protect against fraud or misuse.'
    },
    {
      heading: '3. Payments',
      text: 'Payment information may be processed by the payment provider you choose when an approved payment service is available. Do not send passwords, PINs or one-time verification codes to our support team. Demo payment options do not mean that a real payment has been processed.'
    },
    {
      heading: '4. Sharing Information',
      text: 'We may share the information needed to fulfil your order with service providers such as delivery companies and payment providers. We do not sell customers’ personal information. We may disclose information when legally required.'
    },
    {
      heading: '5. Data Security',
      text: 'We take reasonable steps to protect customer information. However, no website or electronic transmission can be guaranteed to be completely secure.'
    },
    {
      heading: '6. Cookies and Website Data',
      text: 'Our website may use browser storage or similar technologies to maintain sessions, remember preferences and support shopping cart functionality.'
    },
    {
      heading: '7. Your Choices',
      text: 'You may contact us to request help accessing or correcting your account information. Some information may need to be retained where required for order records or legal obligations.'
    },
    {
      heading: '8. Contact Us',
      text: 'For questions about this policy or your information, contact us through the Contact Us page on our website.'
    }
  ]

  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="How Stylehood collects, uses and protects customer information."
      updated="October 2026"
      sections={sections}
    />
  )
}

export default PrivacyPolicy
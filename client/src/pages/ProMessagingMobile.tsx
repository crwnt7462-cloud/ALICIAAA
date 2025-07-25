// Page messagerie mobile pour professionnels
import MessagingMobile from "./MessagingMobile";

export default function ProMessagingMobile() {
  const currentUser = {
    id: 'current-pro',
    name: 'Pro Demo',
    handle: '@pro_demo',
    userType: 'pro' as const
  };

  return <MessagingMobile userType="pro" currentUser={currentUser} />;
}
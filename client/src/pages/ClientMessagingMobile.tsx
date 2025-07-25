// Page messagerie mobile pour clients
import MessagingMobile from "./MessagingMobile";

export default function ClientMessagingMobile() {
  const currentUser = {
    id: 'current-client',
    name: 'Client Demo',
    handle: '@client_demo',
    userType: 'client' as const
  };

  return <MessagingMobile userType="client" currentUser={currentUser} />;
}
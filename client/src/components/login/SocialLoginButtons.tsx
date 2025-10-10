import { Button } from '@/components/ui/button';

interface SocialLoginButtonsProps {
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  onTwitterLogin?: () => void;
  className?: string;
}

export const SocialLoginButtons = ({
  onGoogleLogin = () => console.log('Google login'),
  onFacebookLogin = () => console.log('Facebook login'),
  onTwitterLogin = () => console.log('Twitter login'),
  className = "flex justify-center gap-4 mb-8"
}: SocialLoginButtonsProps) => {
  return (
    <div className={className}>
      <Button
        variant="outline"
        className="w-16 h-16 rounded-2xl border-gray-200 hover:bg-gray-50"
        onClick={onGoogleLogin}
      >
        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          G
        </div>
      </Button>
      <Button
        variant="outline"
        className="w-16 h-16 rounded-2xl border-gray-200 hover:bg-gray-50"
        onClick={onFacebookLogin}
      >
        <div className="w-6 h-6 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">
          f
        </div>
      </Button>
      <Button
        variant="outline"
        className="w-16 h-16 rounded-2xl border-gray-200 hover:bg-gray-50"
        onClick={onTwitterLogin}
      >
        <div className="w-6 h-6 bg-black rounded text-white text-xs font-bold flex items-center justify-center">
          X
        </div>
      </Button>
    </div>
  );
};

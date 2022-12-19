import { useRouter } from 'next/router';
import AuthService from '@/lib/AuthService';

export default function useNextPagePath(
  { nextPageURL }: { nextPageURL: string },
  hasBasePath?: boolean
) {
  const authService = AuthService();
  const router = useRouter();

  return async (authToken: string) => {
    const nextPage = hasBasePath ? `${nextPageURL}` : `${router.basePath}${nextPageURL}`;
    await authService.redirectLogin(nextPage, authToken);
  };
}

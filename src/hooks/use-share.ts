import { IUser } from '@/app/(mian)/_type';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useShare() {
  const searchParams = useSearchParams();
  const [shareData, setData] = useState<IUser.asObject>();
  useEffect(() => {
    const share = searchParams.get('data');
    if (share) {
      try {
        const data = JSON.parse(decodeURIComponent(atob(share)));
        setData(data);
      } catch (error) {
        console.error('Invalid share data:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return shareData;
}

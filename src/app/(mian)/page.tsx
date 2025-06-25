'use client';
import { useStore } from './_store';
import { useEffect } from 'react';
import Show from '@/components/show';
import dynamic from 'next/dynamic';
import { getPerson, getRandomCoor } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getCoorAddress } from './_api';
import LogoPage from '@/components/logo-page';
import { useShare } from '@/hooks/use-share';
import { useRouter } from 'next/navigation';

// 动态导入 MapComponent，禁用 SSR
const MapComponent = dynamic(() => import('./_components/map-component'), {
  ssr: false,
  loading: () => <LogoPage />,
});

export default function Page() {
  const {
    coord,
    country_code,
    user,
    setLoadingAddress,
    setCoord,
    setCountryCode,
    setUser,
  } = useStore(); // 获取全局状态管理的 setUser 方法
  const shareData = useShare();
  const router = useRouter();
  useEffect(() => {
    // 如果是分享数据先走分享数据
    if (shareData) {
      setCoord([shareData.address.latitude, shareData.address.longitude]);
      setCountryCode(shareData.address.country_code ?? 'us');
      setUser(shareData);
      router.replace(window.location.pathname, { scroll: false });
      return;
    }
    const { coord, country_code } = getRandomCoor();
    setCoord(coord);
    setCountryCode(country_code);
    const user = getPerson(country_code ?? '');
    setUser(user);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareData]);

  const { isLoading, isError, data } = useQuery({
    queryKey: ['getCoorAddress', coord],
    queryFn: () =>
      getCoorAddress({
        lat: coord[0],
        lon: coord[1],
        'accept-language': country_code ?? '',
      }),
  });
  useEffect(() => {
    setLoadingAddress(isLoading);
  }, [isLoading, setLoadingAddress]);
  useEffect(() => {
    if (data && !isLoading && !isError && user) {
      const osm = data.data;
      setUser({
        ...user,
        display_name: osm.display_name,
        address: {
          ...user.address,
          latitude: osm.lat,
          longitude: osm.lon,
          city: osm.address.city,
          country: osm.address.country ?? user.address.country,
          country_code: osm.address.country_code ?? user.address.country_code,
          state: osm.address.state ?? user.address.state,
          zipcode:
            (osm?.address && osm?.address?.postcode) ?? user.address.zipcode,
        },
      });
    }
    // 都需要作为参数给到url
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, isError, setCoord, setCountryCode]);

  return (
    <Show when={!!coord[0]} fallback={<LogoPage />}>
      <div className="w-full h-screen fixed top-0 left-0 z-10">
        <div className="h-full overflow-hidden shadow-lg">
          <MapComponent lat={coord[0]} lon={coord[1]} />
        </div>
      </div>
    </Show>
  );
}

'use client';
import { MapPin, Mail, Lock, Shuffle, History, Share } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useStore } from '../_store';
import NiceAvatar, { genConfig } from 'react-nice-avatar';
import Show from '@/components/show';
import { Button } from '@/components/ui/button';
import HistoryDrawer from './history-drawer';
import { getPerson, getRandomCoor } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { MapAlert } from './map-tips';
import { saveAs } from 'file-saver';
import { toBlob } from 'html-to-image';
import ShareUserDialog from './share-user';

export default function UserGenerator() {
  const {
    user: userInfo,
    loadingAddress,
    setHistoryDrawerOpen,
    setUser,
    setCoord,
    setCountryCode,
  } = useStore();
  // 生成新地址
  const avatarId = 'yeshengde-user-avatar';
  const handleGenerateNewAddress = () => {
    // const newUser = getPerson()
    // setUser(newUser)
    const { coord, country_code } = getRandomCoor();
    setCoord(coord);
    setCountryCode(country_code);
    const newUser = getPerson(country_code ?? '');
    setUser(newUser);
  };

  // 打开历史记录
  const handleOpenHistory = () => {
    setHistoryDrawerOpen(true);
  };

  // 复制到剪贴板
  const copyToClipboard = async (
    text: string | null | undefined,
    label: string
  ) => {
    try {
      if (!text) return;
      await navigator.clipboard.writeText(text || '');
      toast.success(`已复制${label}`, {
        description: text,
        duration: 2000,
        position: 'top-right',
      });
    } catch (err) {
      console.error('复制失败:', err);
      toast.error('复制失败');
    }
  };
  const handleDownloadAvatar = async () => {
    const scale = 2;
    const node = document.getElementById(avatarId);
    if (!node) return;
    const loadingToast = toast.loading('正在下载头像...', {
      position: 'top-right',
    });
    const blob = await toBlob(node, {
      height: node.offsetHeight * scale,
      style: {
        transform: `scale(${scale}) translate(${node.offsetWidth / 2 / scale}px, ${node.offsetHeight / 2 / scale}px)`,
        borderRadius: '0',
        opacity: '1',
      },
      width: node.offsetWidth * scale,
    });
    const name = `${userInfo?.firstname}_${userInfo?.lastname}_avatar.png`;
    if (blob) saveAs(blob, name);
    toast.dismiss(loadingToast);
    toast.success('头像已下载为 PNG', {
      position: 'top-right',
      duration: 2000,
    });
  };
  return (
    <div className="absolute bottom-4 left-1 md:bottom-4 md:left-4 z-[1000]  w-[calc(100%-0.5rem)] md:max-w-[400px] md:min-w-[200px] text-[13px]">
      <Card>
        <div className="p-3">
          <div className="space-y-2">
            {/* 头部个人信息 */}
            <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-1">
                <div
                  className="text-lg font-bold text-gray-900 dark:text-gray-100 cursor-pointer "
                  onClick={() =>
                    copyToClipboard(
                      `${userInfo?.firstname} ${userInfo?.lastname}`,
                      '姓名'
                    )
                  }
                  title="点击复制姓名"
                >
                  <span className="underline-hover">
                    {' '}
                    {userInfo?.firstname} {userInfo?.lastname}
                  </span>
                </div>
                <div className="flex items-center gap-2   dark:text-gray-400">
                  <span
                    className="cursor-pointer  transition-colors underline-hover"
                    onClick={() =>
                      copyToClipboard(userInfo?.birthday || '', '生日')
                    }
                    title="点击复制生日"
                  >
                    {userInfo?.birthday}
                  </span>
                </div>
                <div
                  onClick={() => copyToClipboard(userInfo?.phone, '电话号码')}
                  className="flex items-center gap-2  dark:text-gray-400"
                >
                  <span className="underline-hover">{userInfo?.phone}</span>
                </div>
              </div>
              <Avatar
                id={avatarId}
                onClick={handleDownloadAvatar}
                className="w-[80px] h-[80px] border-border  shadow-md cursor-pointer hover:opacity-80 transition-opacity rounded-[20%]"
              >
                <NiceAvatar
                  className="w-full h-full"
                  {...genConfig(userInfo?.email)}
                  shape="square"
                />
              </Avatar>
            </div>

            {/* 联系信息 */}
            <div className="space-y-1 ">
              <div
                className="flex items-center gap-2 rounded   cursor-pointer transition-colors"
                onClick={() => copyToClipboard(userInfo?.email, '邮箱地址')}
                title="点击复制邮箱"
              >
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="underline-hover">{userInfo?.email}</span>
              </div>

              <div
                className="flex items-center gap-2   cursor-pointer transition-colors"
                onClick={() => copyToClipboard(userInfo?.password, '邮箱密码')}
                title="点击复制邮箱密码"
              >
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="underline-hover">{userInfo?.password}</span>
              </div>
            </div>

            {/* 地址信息 */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 relative">
              <Show
                when={!loadingAddress}
                fallback={
                  <div className="space-y-1">
                    <Skeleton className="h-[20px] w-full rounded-sm" />
                    <Skeleton className="h-[20px] w-[60%] rounded-sm " />
                  </div>
                }
              >
                <div className="flex items-start gap-2 rounded  dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span
                      onClick={() =>
                        copyToClipboard(userInfo?.display_name, '完整地址')
                      }
                      title="点击复制完整地址"
                      className="underline-hover"
                    >
                      {userInfo?.address.country},{userInfo?.address.state},
                      {userInfo?.address.city},{userInfo?.address.streetName},
                      {userInfo?.address.buildingNumber}
                    </span>
                    <div className="text-xs text-gray-500 mt-1 flex gap-2 flex-wrap">
                      <Show when={!!userInfo?.address.city}>
                        <span
                          className="underline-hover"
                          onClick={() =>
                            copyToClipboard(userInfo?.address.state, '州/省')
                          }
                        >
                          省/州:{userInfo?.address.state}
                        </span>
                      </Show>
                      <Show when={!!userInfo?.address.city}>
                        <span
                          title="点击复制城市"
                          className="underline-hover"
                          onClick={() =>
                            copyToClipboard(userInfo?.address.city, '城市')
                          }
                        >
                          城市:{userInfo?.address.city}
                        </span>
                      </Show>
                      <Show when={!!userInfo?.address.zipcode}>
                        <span
                          className="underline-hover"
                          onClick={() =>
                            copyToClipboard(
                              userInfo?.address.zipcode,
                              '邮政编码'
                            )
                          }
                        >
                          邮编:{userInfo?.address.zipcode}
                        </span>
                      </Show>
                    </div>
                  </div>
                  <ShareUserDialog>
                    <Badge
                      variant="secondary"
                      className=" absolute right-0 bottom-0"
                    >
                      <Share className="h-3 w-3" />
                    </Badge>
                  </ShareUserDialog>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-2 my-2">
        <Button
          variant="outline"
          className="flex-[4]"
          onClick={handleOpenHistory}
        >
          <History className="h-3 w-3 mr-1" />
          历史记录
        </Button>
        <Button
          variant="default"
          className="flex-[6] border-[rgba(255,255,255,.1)] border-solid border"
          onClick={handleGenerateNewAddress}
        >
          <Shuffle className="h-3 w-3 ml-1" />
          生成新地址
        </Button>
      </div>
      <div>
        {/* 热门快捷地区标签 */}

        <div className="flex flex-wrap gap-2 my-2">
          {[
            { label: '🇺🇸美国', code: 'US' },
            { label: '🇨🇦加拿大', code: 'CA' },
            { label: '🇭🇰香港', code: 'HK' },
            { label: '🇯🇵日本', code: 'JP' },
            { label: '🇸🇬新加坡', code: 'SG' },
          ].map((item) => (
            <Badge
              key={item.code}
              variant="secondary"
              className="cursor-pointer"
              title={`点击生成${item.label}地址`}
              onClick={() => {
                setCountryCode(item.code);
                const { coord } = getRandomCoor(item.code);
                setCoord(coord);
                setUser(getPerson(item.code));
              }}
            >
              {item.label}
            </Badge>
          ))}
        </div>
      </div>
      <MapAlert />

      {/* 历史记录抽屉 */}
      <HistoryDrawer />
    </div>
  );
}

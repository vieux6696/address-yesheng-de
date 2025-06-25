'use client';

import React from 'react';
import { useStore } from '../_store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { MapPin, Mail, Calendar, Phone, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import NiceAvatar, { genConfig } from 'react-nice-avatar';
import Show from '@/components/show';
import { IUser } from '../_type';

const HistoryDrawer: React.FC = () => {
  const {
    isHistoryDrawerOpen,
    setHistoryDrawerOpen,
    userHistory,
    clearHistory,
    setUser,
  } = useStore();

  const handleSelectUser = (user: IUser.asObject) => {
    setUser(user);
    setHistoryDrawerOpen(false);
    toast.success('已切换到历史记录', {
      description: `${user.firstname} ${user.lastname}`,
      duration: 2000,
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    toast.success('历史记录已清空', {
      duration: 2000,
      position: 'top-right',
    });
  };

  return (
    <Sheet open={isHistoryDrawerOpen} onOpenChange={setHistoryDrawerOpen}>
      <SheetContent className="w-96 z-[910]">
        <SheetClose onClose={() => setHistoryDrawerOpen(false)} />
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            历史记录
          </SheetTitle>
          <SheetDescription>选择之前生成的地址信息</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col mt-4">
          <div className="flex items-center justify-between mb-4 px-3">
            <span className="text-sm text-gray-500">
              共 {userHistory.length} 条记录
            </span>
            <Show when={userHistory.length > 0}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                清空
              </Button>
            </Show>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[80vh] pb-4 space-y-3 px-3">
            <Show when={userHistory.length === 0}>
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <RotateCcw className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-center">
                  暂无历史记录
                  <br />
                  <span className="text-sm">生成新地址后会自动保存</span>
                </p>
              </div>
            </Show>

            {userHistory.map((user, index) => (
              <Card
                key={`${user.email}-${index}`}
                className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-4 border-l-black-500"
                onClick={() => handleSelectUser(user)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12 flex-shrink-0 rounded-[20%]">
                    <NiceAvatar
                      className="w-full h-full"
                      {...genConfig(user.email)}
                      shape="square"
                    />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">
                      {user.firstname} {user.lastname}
                    </div>

                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{user.email}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{user.phone}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{user.birthday}</span>
                      </div>

                      <div className="flex items-start gap-1">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="truncate">{user.display_name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryDrawer;

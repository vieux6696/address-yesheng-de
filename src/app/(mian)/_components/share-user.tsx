'use client';

import type React from 'react';

import { useEffect, useState, useCallback } from 'react';
import { useStore } from '../_store';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, Download, Share2, ExternalLink } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useMobile } from '@/hooks/use-mobile';

interface ShareDialogProps {
  children?: React.ReactNode;
}

export default function ShareDialog({ children }: ShareDialogProps) {
  const { user } = useStore();
  const isMobile = useMobile();
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    try {
      const encodedUser = btoa(encodeURIComponent(JSON.stringify(user)));
      const url = `${window.location.origin}?data=${encodedUser}`;
      setShareUrl(url);
    } catch (error) {
      console.error('Failed to generate share URL:', error);
      toast.error('生成分享链接失败');
    }
  }, [user]);

  const handleCopy = useCallback(async () => {
    if (!shareUrl) {
      toast.error('分享链接未生成');
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('链接已复制到剪贴板', {
        position: 'top-right',
        duration: 2000,
      });
    } catch (error) {
      // Fallback for older browsers
      console.log(error);
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('链接已复制到剪贴板');
      } catch (fallbackError) {
        toast.error('复制失败，请手动复制链接');
        console.error('Copy failed:', fallbackError);
      }
    }
  }, [shareUrl]);

  const handleDownloadQRCode = useCallback(() => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (!canvas) {
      toast.error('二维码未加载完成');
      return;
    }

    try {
      const link = document.createElement('a');
      link.download = `share_qrcode_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('二维码已下载');
    } catch (error) {
      toast.error('下载失败');
      console.error('Download failed:', error);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '用户位置分享',
          text: '查看我的位置信息',
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error);
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  }, [shareUrl, handleCopy]);

  const ShareContent = () => (
    <div className="space-y-6">
      {/* QR Code Section */}
      <div className="flex flex-col items-center space-y-3">
        <Card className="p-2 bg-white dark:bg-gray-900 shadow-sm">
          <CardContent className="p-0 flex items-center justify-center">
            {shareUrl ? (
              <QRCodeCanvas
                id="qr-canvas"
                value={shareUrl}
                size={isMobile ? 180 : 256}
                level="L"
                bgColor="#ffffff"
                fgColor="#000000"
                className=""
              />
            ) : (
              <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">生成中...</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            扫描二维码或复制链接分享
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadQRCode}
              disabled={!shareUrl}
              className="flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              下载二维码
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleShare}
              disabled={!shareUrl}
              className="flex items-center gap-1"
            >
              <Share2 className="w-4 h-4" />
              分享
            </Button>
          </div>
        </div>
      </div>

      {/* URL Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <ExternalLink className="w-4 h-4" />
          分享链接
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 text-xs font-mono bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            placeholder="生成分享链接中..."
            onFocus={(e) => e.target.select()}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            disabled={!shareUrl}
            className="shrink-0"
            aria-label="复制链接"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          点击输入框可全选链接，或点击复制按钮
        </p>
      </div>

      {/* User Info Preview */}
    </div>
  );

  const TriggerWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="inline-block">{children}</div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <TriggerWrapper>
            <div onClick={() => setIsOpen(true)}>{children}</div>
          </TriggerWrapper>
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="text-center">
            <DrawerTitle>分享用户信息</DrawerTitle>
          </DrawerHeader>
          <div className="mt-4">
            <ShareContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <TriggerWrapper>
          <div onClick={() => setIsOpen(true)}>{children}</div>
        </TriggerWrapper>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] w-[95%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            分享用户信息
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          <ShareContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}

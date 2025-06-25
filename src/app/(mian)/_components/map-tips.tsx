import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { X } from 'lucide-react';
import { useStore } from '../_store';

export function MapAlert() {
  const { hideMapTips, setHideMapTips } = useStore();
  if (hideMapTips) return null;
  return (
    <Alert className="relative mt-2 text-sm border-none bg-yellow-100 text-gray-600 dark:text-gray-300 dark:bg-yellow-100/10">
      <AlertTitle className="font-semibold">💡 小提示</AlertTitle>
      <AlertDescription className="space-y-0 mt-2">
        <div>1.搜索可定位具体位置</div>
        <div>2.随机按钮可生成新位置</div>
        <div>3.点击地图可定位具体位置</div>
        <div>5.点击热门区域可快速定位</div>
        <div>4.点击头像可下载，卡片信息可复制到剪贴板</div>
      </AlertDescription>
      <button
        onClick={() => setHideMapTips(true)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
        aria-label="关闭提示"
      >
        <X className="h-4 w-4" />
      </button>
    </Alert>
  );
}

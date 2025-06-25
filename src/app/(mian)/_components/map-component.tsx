'use client';
import { useState, useRef, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapLayerControl from './map-layer-control';
import MapSearch from './map-search';
import UserGenerator from './user-generator';
import { layerOptions } from './map-layer-control';
// 修复 Leaflet 默认图标问题
import L from 'leaflet';
import { useStore } from '../_store';
import { getPerson } from '@/lib/utils';

const DefaultIcon = L.divIcon({
  html: '<div style="font-size: 30px;">📍</div>',
  className: 'emoji-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -20],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LayerOption {
  id: string;
  name: string;
  url: string;
  attribution: string;
  hasLabels?: boolean;
  labelsUrl?: string;
}

export default function MapComponent({
  lat,
  lon,
}: {
  lat?: number;
  lon?: number;
}) {
  const { user, country_code, setCoord, setUser } = useStore();
  const [currentLayer, setCurrentLayer] = useState<LayerOption>(
    layerOptions[0]
  );

  const mapRef = useRef<L.Map | null>(null);

  // 地理编码 - 根据坐标获取地址
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([lat ?? 0, lon ?? 0], 17, {
        animate: true,
        duration: 1.0,
      });
    }
  }, [lat, lon]);

  const handleLayerChange = (layer: LayerOption) => {
    setCurrentLayer(layer);
  };

  // 处理搜索位置选择
  const handleLocationSelect = (lat: number, lng: number) => {
    setCoord([lat, lng]); // 更新全局坐标状态
    // 移动地图中心到新位置，带动画效果
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 17, {
        animate: true,
        duration: 1.0,
      });
    }
  };
  // 地图引用组件
  function MapRefHandler() {
    const map = useMapEvents({});
    mapRef.current = map;
    return null;
  }

  // 处理地图点击事件的组件
  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        // 检查点击是否在控制面板区域内
        const clickedElement = e.originalEvent?.target as HTMLElement;
        if (clickedElement) {
          // 检查是否点击了控制面板或其子元素
          const isControlPanel = clickedElement.closest('[data-map-control]');
          if (isControlPanel) {
            return; // 如果点击的是控制面板，不处理地图点击
          }
        }

        const { lat, lng } = e.latlng;
        setCoord([lat, lng]); // 更新全局坐标状态
        const newUser = getPerson(country_code);
        setUser(newUser);
        // 自动移动地图使标记点居中
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], mapRef.current.getZoom(), {
            animate: true,
            duration: 0.5,
          });
        }
      },
    });
    return null;
  }

  return (
    <div className="relative h-full w-full">
      {/* 地点搜索组件 */}
      <MapSearch onLocationSelect={handleLocationSelect} />

      <MapContainer
        center={[lat ?? 0, lon ?? 0]} // 使用传入的经纬度或默认值
        zoom={16} // 增大放大级别，可以看到房子和地貌
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false} // 禁用默认的缩放控件
        attributionControl={false} // 禁用默认的属性控件
      >
        {/* 地图引用处理器 */}
        <MapRefHandler />
        {/* 地图点击事件处理器 */}
        <MapClickHandler />

        <TileLayer
          key={`${currentLayer.id}-${Date.now()}`} // 添加 key 确保图层正确切换
          attribution={currentLayer.attribution}
          url={currentLayer.url}
        />

        {/* 如果有标注层，则添加标注层 */}
        {currentLayer.hasLabels && currentLayer.labelsUrl && (
          <TileLayer
            key={`${currentLayer.id}-labels-${Date.now()}`}
            url={currentLayer.labelsUrl}
            attribution=""
          />
        )}

        <Marker position={[lat ?? 0, lon ?? 0]}>
          <Popup>
            <div className="min-w-[250px] max-w-[350px]">
              <div className="font-semibold text-sm mb-3 flex items-center gap-2">
                📍 <span>位置详情</span>
              </div>

              {/* 详细地址 */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  详细地址
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <div className="break-all select-all">
                    {user?.display_name}
                  </div>
                </div>
              </div>

              {/* 精确坐标 */}
              <div className="text-xs text-gray-500 border-t pt-2 space-y-1">
                <div className="font-medium mb-1">精确坐标</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">纬度:</span>
                    <br />
                    <span className="font-mono">{lat}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">经度:</span>
                    <br />
                    <span className="font-mono">{lon}</span>
                  </div>
                </div>
              </div>
              {/* 操作提示 */}
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-3 pt-2 border-t">
                💡 点击地图其他位置可重新定位标记
              </div>
            </div>
          </Popup>
        </Marker>

        {/* 自定义图层控制组件 */}
        <MapLayerControl
          onLayerChange={handleLayerChange}
          currentLayer={currentLayer.id}
        />
      </MapContainer>

      {/* 自定义属性信息 */}
      <div className="absolute bottom-1 left-1 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-900/80 px-2 py-1 rounded backdrop-blur-sm">
        <span dangerouslySetInnerHTML={{ __html: currentLayer.attribution }} />
      </div>
      {/* 用户信息生成器 */}
      <UserGenerator />
    </div>
  );
}

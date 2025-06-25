'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type React from 'react';
import { useQuery } from '@tanstack/react-query'; // Import useQuery from react-query

import { Search, MapPin, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getSearchAddress } from '../_api';
import { useStore } from '../_store';
import type { IUser } from '../_type';
import { getPerson } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

interface MapSearchProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

export default function MapSearch({ onLocationSelect }: MapSearchProps) {
  const { setUser, country_code } = useStore();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 500); // Reduced debounce time for better UX

  const { isLoading, data, error } = useQuery({
    queryKey: ['searchAddress', debouncedQuery, country_code],
    queryFn: () =>
      getSearchAddress({
        q: debouncedQuery,
        'accept-language': country_code,
      }),
    enabled: !!debouncedQuery.trim() && debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
    retry: 1,
  });

  // Memoize search results to prevent unnecessary re-renders
  const searchResults = useMemo(() => {
    return data?.data || [];
  }, [data?.data]);

  const hasResults = searchResults.length > 0;
  const shouldShowResults =
    showResults && (hasResults || (query.trim() && !isLoading && !hasResults));

  // Handle click outside with useCallback for better performance
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setShowResults(false);
      setSelectedIndex(-1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Show results when data is available
  useEffect(() => {
    if (hasResults && query.trim()) {
      setShowResults(true);
      setSelectedIndex(-1);
    }
  }, [hasResults, query]);

  // Memoized location selection handler
  const handleLocationSelect = useCallback(
    (result: IUser.getCoorAddressResponse) => {
      if (!result) return;

      onLocationSelect(result.lat, result.lon, result.display_name);
      const newUser = getPerson(result?.address?.country_code ?? '');
      setUser(newUser);
      setQuery(result.display_name);
      setShowResults(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    },
    [onLocationSelect, setUser]
  );

  // Optimized input change handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setSelectedIndex(-1);

      if (!value.trim()) {
        setShowResults(false);
      }
    },
    []
  );

  // Enhanced input focus handler
  const handleInputFocus = useCallback(() => {
    if (hasResults && query.trim()) {
      setShowResults(true);
    }
  }, [hasResults, query]);

  // Clear search handler
  const clearSearch = useCallback(() => {
    setQuery('');
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!shouldShowResults) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && searchResults[selectedIndex]) {
            handleLocationSelect(searchResults[selectedIndex]);
          }
          break;
        case 'Escape':
          setShowResults(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [shouldShowResults, searchResults, selectedIndex, handleLocationSelect]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      selectedElement?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  return (
    <div
      className="absolute top-4 left-4 z-[1000] md:max-w-[300px] w-[calc(100vw-2rem)]"
      ref={searchRef}
      data-map-control
    >
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border shadow-lg">
        <div className="relative">
          {/* Search Input */}
          <div className="flex items-center px-3 py-1">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="搜索地点..."
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 border-0 shadow-none px-0 focus-visible:ring-0"
              aria-label="搜索地点"
              aria-expanded={!!shouldShowResults}
              aria-haspopup="listbox"
              aria-activedescendant={
                selectedIndex >= 0 ? `result-${selectedIndex}` : undefined
              }
              autoComplete="off"
            />

            {/* Loading indicator */}
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin ml-2 text-gray-500" />
            )}

            {/* Clear button */}
            {query && !isLoading && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={clearSearch}
                aria-label="清除搜索"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Search Results */}
          {shouldShowResults && (
            <div className="border-t border-gray-200 dark:border-gray-700">
              {hasResults ? (
                <div
                  ref={resultsRef}
                  className="max-h-64 overflow-y-auto"
                  role="listbox"
                  aria-label="搜索结果"
                >
                  {searchResults.map((result, index) => (
                    <button
                      key={result.place_id}
                      id={`result-${index}`}
                      className={`w-full px-3 py-2 text-left transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 `}
                      onClick={() => handleLocationSelect(result)}
                      role="option"
                      aria-selected={index === selectedIndex}
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                            {result.display_name.split(',')[0]}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {result.display_name}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : error ? (
                <div className="p-4 text-center text-sm text-red-500 dark:text-red-400">
                  搜索出错，请重试
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  未找到相关地点
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

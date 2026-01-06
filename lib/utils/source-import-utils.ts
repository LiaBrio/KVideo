/**
 * Source Import Utilities - Handle parsing and importing sources from various formats
 */

import type { VideoSource, SourceSubscription } from '@/lib/types';

/**
 * Simplified source format for import
 */
export interface ImportSourceFormat {
    id: string;
    name: string;
    baseUrl: string;
    group?: 'normal' | 'adult';
    enabled?: boolean;
    priority?: number;
}

/**
 * Import result containing categorized sources
 */
export interface ImportResult {
    normalSources: VideoSource[];
    adultSources: VideoSource[];
    totalCount: number;
}

/**
 * Convert simplified import format to full VideoSource
 */
export function convertToVideoSource(source: ImportSourceFormat): VideoSource {
    return {
        id: source.id,
        name: source.name,
        baseUrl: source.baseUrl,
        searchPath: '',
        detailPath: '',
        enabled: source.enabled !== false,
        priority: source.priority || 1,
        group: source.group || 'normal',
    };
}

/**
 * Validate if an object is a valid source format
 */
export function isValidSourceFormat(obj: unknown): obj is ImportSourceFormat {
    if (typeof obj !== 'object' || obj === null) return false;
    const source = obj as Record<string, unknown>;
    return (
        typeof source.id === 'string' &&
        typeof source.name === 'string' &&
        typeof source.baseUrl === 'string' &&
        source.id.length > 0 &&
        source.name.length > 0 &&
        source.baseUrl.length > 0
    );
}

/**
 * Parse sources from JSON string
 * Supports both array format and wrapped object format
 */
export function parseSourcesFromJson(jsonString: string): ImportResult {
    const data = JSON.parse(jsonString);

    let sourcesArray: unknown[];

    // Handle different JSON structures
    if (Array.isArray(data)) {
        sourcesArray = data;
    } else if (data.sources && Array.isArray(data.sources)) {
        sourcesArray = data.sources;
    } else if (data.list && Array.isArray(data.list)) {
        sourcesArray = data.list;
    } else {
        throw new Error('无法识别的JSON格式');
    }

    const normalSources: VideoSource[] = [];
    const adultSources: VideoSource[] = [];

    for (const item of sourcesArray) {
        if (!isValidSourceFormat(item)) continue;

        const source = convertToVideoSource(item);

        if (item.group === 'adult') {
            adultSources.push(source);
        } else {
            normalSources.push(source);
        }
    }

    return {
        normalSources,
        adultSources,
        totalCount: normalSources.length + adultSources.length,
    };
}

/**
 * Fetch and parse sources from a URL
 */
export async function fetchSourcesFromUrl(url: string): Promise<ImportResult> {
    // Check if we're in a static export environment (APK/Capacitor)
    const isStaticExport = typeof window !== 'undefined' && (
        window.location.protocol === 'file:' ||
        window.location.protocol === 'capacitor:' ||
        (window as any).Capacitor !== undefined
    );

    // If we're in the browser and it's an external URL, try to use our proxy to avoid CORS issues
    // But in static export (APK), API routes don't work, so we'll try direct fetch with fallback
    const isExternal = url.startsWith('http') && (typeof window !== 'undefined' && !url.includes(window.location.host));
    
    let fetchUrl = url;
    let useProxy = false;

    if (isExternal && !isStaticExport) {
        // Try proxy first in non-static environments
        fetchUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        useProxy = true;
    }

    try {
        const response = await fetch(fetchUrl, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            // If proxy failed and we haven't tried direct fetch yet, try direct fetch
            if (useProxy && response.status >= 400) {
                console.warn('Proxy failed, trying direct fetch:', url);
                const directResponse = await fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (!directResponse.ok) {
                    throw new Error(`获取失败: ${directResponse.status} ${directResponse.statusText}`);
                }

                const text = await directResponse.text();
                return parseSourcesFromJson(text);
            }

            throw new Error(`获取失败: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        return parseSourcesFromJson(text);
    } catch (error) {
        // If proxy request failed and we haven't tried direct fetch, try direct fetch
        if (useProxy && isExternal) {
            console.warn('Proxy request failed, trying direct fetch:', error);
            try {
                const directResponse = await fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (!directResponse.ok) {
                    throw new Error(`获取失败: ${directResponse.status} ${directResponse.statusText}`);
                }

                const text = await directResponse.text();
                return parseSourcesFromJson(text);
            } catch (directError) {
                throw new Error(`获取失败: ${error instanceof Error ? error.message : '未知错误'}`);
            }
        }

        throw error;
    }
}

/**
 * Create a new subscription object
 */
export function createSubscription(name: string, url: string): SourceSubscription {
    return {
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        name: name.trim() || '未命名订阅',
        url: url.trim(),
        lastUpdated: Date.now(),
        autoRefresh: true,
    };
}

/**
 * Merge new sources with existing sources, avoiding duplicates
 */
export function mergeSources(
    existing: VideoSource[],
    newSources: VideoSource[]
): VideoSource[] {
    const existingIds = new Set(existing.map(s => s.id));
    const merged = [...existing];

    for (const source of newSources) {
        if (existingIds.has(source.id)) {
            // Update existing source
            const idx = merged.findIndex(s => s.id === source.id);
            if (idx !== -1) {
                merged[idx] = { ...merged[idx], ...source };
            }
        } else {
            // Add new source
            merged.push({
                ...source,
                priority: merged.length + 1,
            });
            existingIds.add(source.id);
        }
    }

    return merged;
}

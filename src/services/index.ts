import { OpenFDAResponse, FDADevice, SearchParams } from '@/types';

const FDA_BASE_URL = 'https://api.fda.gov/device/510k.json';
const DEFAULT_LIMIT = 100;

export class FDAService {
  private static instance: FDAService;
  
  static getInstance(): FDAService {
    if (!FDAService.instance) {
      FDAService.instance = new FDAService();
    }
    return FDAService.instance;
  }

  async searchDevices(params: SearchParams): Promise<OpenFDAResponse> {
    try {
      const url = this.buildSearchUrl(params);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new APIError({
          message: `API request failed: ${response.statusText}`,
          status: response.status,
        });
      }

      const data: OpenFDAResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError({
        message: 'Network error occurred',
        code: 'NETWORK_ERROR',
      });
    }
  }

  async getDeviceByKNumber(kNumber: string): Promise<FDADevice | null> {
    try {
      const response = await this.searchDevices({
        kNumber,
        limit: 1,
      });
      
      return response.results?.[0] || null;
    } catch (error) {
      console.error(`Failed to fetch device ${kNumber}:`, error);
      return null;
    }
  }

  async getDevicesByKNumbers(kNumbers: string[]): Promise<FDADevice[]> {
    try {
      const kNumberQuery = kNumbers.map(k => `"${k}"`).join('+OR+');
      
      const response = await this.searchDevices({
        query: `k_number:(${kNumberQuery})`,
        limit: Math.min(kNumbers.length, 1000), 
      });
      
      return response.results || [];
    } catch (error) {
      console.error('Failed to fetch multiple devices:', error);
      return [];
    }
  }

  private buildSearchUrl(params: SearchParams): string {
    const url = new URL(FDA_BASE_URL);
    
    const searchParts: string[] = [];
    
    if (params.kNumber) {
      searchParts.push(`k_number:"${params.kNumber}"`);
    }
    
    if (params.query) {
      searchParts.push(`device_name:"${params.query}"`);
    }
    
    if (params.applicant) {
      searchParts.push(`applicant:"${params.applicant}"`);
    }
    
    if (params.productCode) {
      searchParts.push(`product_code:"${params.productCode}"`);
    }
    
    if (params.dateFrom || params.dateTo) {
      const dateRange = this.buildDateRange(params.dateFrom, params.dateTo);
      if (dateRange) {
        searchParts.push(`date_received:${dateRange}`);
      }
    }
    
    if (params.query && !params.kNumber && !params.applicant && !params.productCode) {
      url.searchParams.set('search', params.query);
    } else if (searchParts.length > 0) {
      url.searchParams.set('search', searchParts.join('+AND+'));
    }
    
    url.searchParams.set('limit', String(params.limit || DEFAULT_LIMIT));
    if (params.skip) {
      url.searchParams.set('skip', String(params.skip));
    }
    
    return url.toString();
  }

  private buildDateRange(dateFrom?: string, dateTo?: string): string | null {
    if (!dateFrom && !dateTo) return null;
    
    if (dateFrom && dateTo) {
      return `[${dateFrom}+TO+${dateTo}]`;
    } else if (dateFrom) {
      return `[${dateFrom}+TO+*]`;
    } else if (dateTo) {
      return `[*+TO+${dateTo}]`;
    }
    
    return null;
  }
}

export const fdaService = FDAService.getInstance();

class APIError extends Error {
  status?: number;
  code?: string;

  constructor({ message, status, code }: { message: string; status?: number; code?: string }) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}
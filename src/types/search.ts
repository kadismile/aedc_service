import { CustomerDoc } from './customer.js';
import { MeterDoc } from './meter.js';
import { AdvancedQueryResult } from './queryresults.js';
import { VendorDoc } from './vendor.js';

export type SearchRequest = {
  model: 'meters' | 'customers' | 'vendors' | 'staffs';
  searchText: string;
};

export type SearchResult = AdvancedQueryResult<MeterDoc | CustomerDoc | VendorDoc>;

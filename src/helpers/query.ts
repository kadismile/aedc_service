import { Condition, Document, Model } from 'mongoose';
import { parse } from 'url';

import Logger from '../libs/logger.js';
import { AdvancedQueryResult } from '../types/queryresults.js';
import { stringToBoolean } from './application_helper.js';

type AdvancedResult<T> = { [P in keyof T]?: Condition<T[P]> } & {
  createdAt: Date;
  limit: string;
  sort: string;
  page: string;
  totalCount: number;
  filterdDocumentsCount: number;
  state: string;
};

const QUERY_SELECTORS = ['gt', 'gte', 'lt', 'lte', 'eq'];

const BOOLEAN_FIELDS = ['isActive', 'isDiscount'];

export const advancedResults = async <K, T extends Document>(
  url: string,
  model: Model<K>
): Promise<AdvancedQueryResult<T>> => {
  try {
    const { query } = parse(url, true);
    const transformedQuery = Object.entries(query).reduce((acc, [key, value]) => {
      if (QUERY_SELECTORS.includes(key)) {
        if (!acc.createdAt) {
          acc.createdAt = {} as Date;
        }
        if (typeof value === 'string') {
          acc.createdAt[`$${key}`] = new Date(value);
        }
      } else {
        if (key === 'state') {
          acc['address.state'] = value;
        }
        acc[key] = value;
        if (BOOLEAN_FIELDS.includes(key)) {
          acc[key] = stringToBoolean(Array.isArray(value) ? value[0] : value);
        }
      }
      return acc;
    }, {} as AdvancedResult<K>);

    delete transformedQuery.state;
    if (!!query.limit || !!query.sort || !!query.page) {
      delete transformedQuery.limit;
      delete transformedQuery.sort;
      delete transformedQuery.page;
    }

    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    if (typeof query.sort === 'string' && (query.sort === 'asc' || query.sort === 'desc')) {
      sortOptions['createdAt'] = query.sort;
    } else if (Array.isArray(query.sort)) {
      for (const sortField of query.sort) {
        sortOptions[sortField] = 'desc';
      }
    } else {
      sortOptions['createdAt'] = 'desc';
    }

    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.limit as string, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments({});
    const filterdDocumentsCount = await model.countDocuments(transformedQuery);

    const results = await model.find<T>(transformedQuery).sort(sortOptions).limit(limit).skip(startIndex);
    const pagination: { prev?: { page: number }; next?: { page: number } } = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1
      };
    }

    return {
      results,
      count: results.length,
      totalCount: total,
      filterdDocumentsCount,
      page: page,
      limit: limit,
      prevPage: pagination.prev?.page || null,
      nextPage: pagination.next?.page || null
    };
  } catch (error) {
    Logger.error(error);
  }
};

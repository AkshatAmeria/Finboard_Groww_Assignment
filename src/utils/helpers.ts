import { FlattenedField } from '../types';

export const formatCurrency = (value: any): string => {
  const num = parseFloat(value);
  if (isNaN(num)) return String(value);
  
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)}B`;
  } else if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(2)}K`;
  } else if (num < 1 && num > 0) {
    return `$${num.toFixed(6)}`;
  }
  
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

export const getValueByPath = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    return acc[part];
  }, obj);
};

export const flattenObject = (
  obj: any,
  prefix: string = '',
  result: FlattenedField[] = []
): FlattenedField[] => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newPath = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        flattenObject(value, newPath, result);
      } else {
        result.push({
          path: newPath,
          value: value,
          type: Array.isArray(value) ? 'array' : typeof value,
        });
      }
    }
  }
  return result;
};

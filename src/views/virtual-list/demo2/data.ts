import { generateEnglishSentence } from '../utils';
import type { Item } from './types';

export const data: Item[] = Array(20)
  .fill(1)
  .map((item, index) => ({ id: item + index, content: generateEnglishSentence() }));

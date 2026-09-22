import filter from 'leo-profanity';

filter.loadDictionary('en');
filter.add(filter.getDictionary('ru'));

export const cleanText = (text) => filter.clean(text);
export const cleanChannelName = (name) => cleanText(name.trim());

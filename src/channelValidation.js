import { hasLength } from '@mantine/form';
import { cleanChannelName } from './profanity.js';

export const validateChannelName = (name, channels, excludedId, t) => {
  const lengthError = hasLength({ min: 3, max: 20 }, t('validation.nameLength'))(name);
  if (lengthError) return lengthError;
  return channels.some((channel) => String(channel.id) !== String(excludedId)
    && cleanChannelName(channel.name).toLowerCase() === cleanChannelName(name).toLowerCase())
    ? t('validation.channelExists') : null;
};

import { hasLength } from '@mantine/form';

export const validateChannelName = (name, channels, excludedId, t) => {
  const lengthError = hasLength({ min: 3, max: 20 }, t('validation.nameLength'))(name);
  if (lengthError) return lengthError;
  return channels.some((channel) => String(channel.id) !== String(excludedId)
    && channel.name.trim().toLowerCase() === name.trim().toLowerCase())
    ? t('validation.channelExists') : null;
};

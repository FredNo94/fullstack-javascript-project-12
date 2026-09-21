import { hasLength } from '@mantine/form';

export const validateChannelName = (name, channels, excludedId = null) => {
  const lengthError = hasLength({ min: 3, max: 20 }, 'От 3 до 20 символов')(name);
  if (lengthError) return lengthError;
  return channels.some((channel) => String(channel.id) !== String(excludedId)
    && channel.name.trim().toLowerCase() === name.trim().toLowerCase())
    ? 'Канал с таким именем уже существует' : null;
};

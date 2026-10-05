const apiPrefix = '/api/v1';

export const appRoutes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  notFound: '*',
};

export const apiRoutes = {
  login: `${apiPrefix}/login`,
  signup: `${apiPrefix}/signup`,
  channels: `${apiPrefix}/channels`,
  messages: `${apiPrefix}/messages`,
  channel: (id) => `${apiPrefix}/channels/${encodeURIComponent(id)}`,
};

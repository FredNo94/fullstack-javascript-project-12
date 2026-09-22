import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createNotificationsStore } from '@mantine/notifications';
import { createAuthStore, selectIsAuthenticated } from '../src/authStore.js';
import { createUiStore } from '../src/uiStore.js';
import createI18n from '../src/i18n.js';
import { showNetworkError, showChannelSuccess } from '../src/toasts.js';

const makeStorage = () => {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
    clear: () => data.clear(),
  };
};

test('fresh app does not inherit the previous token after storage is cleared', () => {
  globalThis.localStorage = makeStorage();
  const first = createAuthStore();
  first.getState().setAuth({ token: 'first-token', username: 'first' });
  localStorage.clear();
  const second = createAuthStore();
  assert.equal(selectIsAuthenticated(second.getState()), false);
  second.getState().setAuth({ token: 'second-token', username: 'second' });
  assert.equal(first.getState().token, 'first-token');
});

test('reload restores persisted session but logout does not resurrect it', () => {
  globalThis.localStorage = makeStorage();
  const first = createAuthStore();
  first.getState().setAuth({ token: 'saved-token', username: 'user' });
  const reloaded = createAuthStore();
  assert.equal(reloaded.getState().token, 'saved-token');
  reloaded.getState().removeAuth();
  assert.equal(selectIsAuthenticated(createAuthStore().getState()), false);
});

test('channel and modal belong to one app instance', () => {
  const first = createUiStore();
  first.getState().setCurrentChannel('42');
  first.getState().openModal('rename', '42');
  const second = createUiStore();
  assert.equal(second.getState().currentChannelId, null);
  assert.equal(second.getState().modal, null);
  first.getState().reset();
  assert.equal(first.getState().modal, null);
});

test('notifications use isolated stores and required Russian texts', async () => {
  const i18n = await createI18n();
  const t = i18n.t.bind(i18n);
  const first = createNotificationsStore();
  const second = createNotificationsStore();
  showNetworkError(t, first);
  showNetworkError(t, first);
  const entries = (store) => [...store.getState().notifications, ...store.getState().queue];
  assert.equal(entries(first).length, 1);
  assert.equal(entries(second).length, 0);
  assert.equal(entries(first)[0].message, 'Ошибка соединения');
  showChannelSuccess('create', t, second);
  assert.equal(entries(second)[0].message, 'Канал создан');
  assert.equal(t('channels.manage'), 'Управление каналом');
  assert.equal(i18n.language, 'ru');
});

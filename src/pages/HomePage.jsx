import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChannels,
  selectChannels,
  selectCurrentChannel,
  selectCurrentChannelId,
  setCurrentChannel,
} from '../slices/channelsSlice';
import { fetchMessages, selectMessages } from '../slices/messagesSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const channels = useSelector(selectChannels);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const currentChannel = useSelector(selectCurrentChannel);
  const messages = useSelector(selectMessages);
  const channelsLoading = useSelector((state) => state.channelsInfo.loading);
  const messagesLoading = useSelector((state) => state.messagesInfo.loading);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  const currentChannelMessages = messages.filter(
    (msg) => String(msg.channelId) === String(currentChannelId),
  );

  const isLoading = channelsLoading || messagesLoading;

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-3 border-end p-0 bg-light">
          <div className="p-3">
            <h5 className="mb-3">Каналы</h5>
            {isLoading && channels.length === 0 ? (
              <p className="text-muted">Загрузка...</p>
            ) : (
              <ul className="list-unstyled mb-0">
                {channels.map((channel) => (
                  <li key={channel.id} className="mb-1">
                    <button
                      type="button"
                      className={`btn w-100 text-start ${
                        String(channel.id) === String(currentChannelId)
                          ? 'btn-primary'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => dispatch(setCurrentChannel(channel.id))}
                    >
                      # {channel.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="col-9 p-3 d-flex flex-column h-100">
          <h4 className="mb-3">
            # {currentChannel?.name || '...'}
          </h4>
          <div className="flex-grow-1 overflow-auto mb-3 border rounded p-2">
            {isLoading && currentChannelMessages.length === 0 ? (
              <p className="text-muted">Загрузка сообщений...</p>
            ) : (
              currentChannelMessages.map((msg) => (
                <div key={msg.id} className="mb-2 text-start">
                  <strong>{msg.username}</strong>: {msg.body}
                </div>
              ))
            )}
          </div>
          <form className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Введите сообщение..."
              aria-label="Новое сообщение"
            />
            <button type="submit" className="btn btn-primary">
              Отправить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

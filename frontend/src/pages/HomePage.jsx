import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChannels,
  selectChannels,
  selectCurrentChannelId,
  setCurrentChannel,
} from '../slices/channelsSlice';
import { fetchMessages, selectMessages } from '../slices/messagesSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const channels = useSelector(selectChannels);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const messages = useSelector(selectMessages);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  const currentChannelMessages = messages.filter(
    (msg) => msg.channelId === currentChannelId,
  );

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-3 border-end p-0">
          <div className="p-3">
            <h5>Каналы</h5>
            <ul className="list-unstyled">
              {channels.map((channel) => (
                <li key={channel.id} className="mb-1">
                  <button
                    type="button"
                    className={`btn w-100 text-start ${
                      channel.id === currentChannelId
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
          </div>
        </div>
        <div className="col-9 p-3 d-flex flex-column">
          <h4># {channels.find((ch) => ch.id === currentChannelId)?.name}</h4>
          <div className="flex-grow-1 overflow-auto mb-3 border rounded p-2">
            {currentChannelMessages.map((msg) => (
              <div key={msg.id} className="mb-2">
                <strong>{msg.username}</strong>: {msg.body}
              </div>
            ))}
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
import MessageList from './messageList';
import ChatInput from './chatInput';

export default function ChatGrid({ 
  color, 
  messages = [],
  inputValue,
  onInputChange,
  onSendMessage,
  onUpvoteChange = null,
  placeholder,
  chatActive= false
}) {

  return (
    <div className="h-full flex flex-col rounded-2xl shadow-2xl overflow-hidden borde">
      <MessageList messages={messages} onUpvoteChange={onUpvoteChange} />
      <ChatInput
        value={inputValue}
        onChange={onInputChange}
        onSend={onSendMessage}
        placeholder={placeholder}
        color={color}
        chatActive={chatActive}
      />
    </div>
  );
}


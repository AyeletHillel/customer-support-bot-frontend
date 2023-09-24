import { useState } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

function transformMessagesToTextFormat(messages) {
  return messages.map(message => message.message).join('\n');
}

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hi! 🛍️ Thank you for visiting us. How can we assist you today? Whether you have questions about our products, need help with your order, or just want some shopping recommendations, we're here to help. Let's make your shopping experience delightful! 💬 ",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    console.log("Before Formatting:", chatMessages);

    const chatHistory = transformMessagesToTextFormat(chatMessages);
    const lastMessage = chatMessages[chatMessages.length - 1].message;
    const requestBody = {
      "query": lastMessage,
      "chat_history": chatHistory
    }

    console.log("Request Body:", requestBody);

    await fetch("http://localhost:3000/ask", 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages([...chatMessages, {
        message: data.answer,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
  }

  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="AI Assistant is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message);
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;

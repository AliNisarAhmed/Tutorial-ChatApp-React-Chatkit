import React, { Component } from 'react';
import Chatkit from '@pusher/chatkit';
import './App.css';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import NewRoomForm from './components/NewRoomForm';

import { tokenUrl, instanceLocator } from './chatkitConfig';

class App extends Component {

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId: "alinisar87",
      tokenProvider: new Chatkit.TokenProvider({
        url: tokenUrl
      })
    });

    chatManager
      .connect()
      .then(currentUser => {
        currentUser.subscribeToRoom({
          roomId: 14656272,
          hooks: {
            onNewMessage: message => {
              console.log('message.text :', message.text);
            }
          }
        })
      })
  }

  render() {
    return (
      <div className="app">
        <RoomList />
        <MessageList />
        <SendMessageForm />
        <NewRoomForm />
      </div>
    );
  }
}

export default App;

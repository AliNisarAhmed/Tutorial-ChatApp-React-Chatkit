import React, { Component } from 'react';
import Chatkit from '@pusher/chatkit';
import './App.css';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import NewRoomForm from './components/NewRoomForm';

import { tokenUrl, instanceLocator } from './chatkitConfig';

class App extends Component {

  state = {
    roomId: null,
    messages: [],
    joinableRooms: [],
    joinedRooms: []
  };

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
        this.currentUser = currentUser;
        this.getRooms();
      })
      .catch(err => console.log('error on connecting: ', err));
  }

  getRooms = () => {
    this.currentUser.getJoinableRooms()
      .then(joinableRooms => {
        this.setState(() => ({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
        }));
      })
      .catch(err => console.log('error on joinableRomms: ', err));
  }

  subscribeToRoom = (roomId) => {
    this.setState(() => ({ messages: [] }));
    this.currentUser.subscribeToRoom({
      roomId: roomId,
      hooks: {
        onNewMessage: message => {
          this.setState((prevState) => ({ 
            messages: [...prevState.messages, message]
          }));
        }
      }
    })
    .then(room => {
      console.log('ROOOM: ', room.id);
      this.setState(() => ({ roomId: room.id }));
      this.getRooms();
    })
    .catch(err => console.log('errpr on subscribing to room: ', err));
  }

  sendMessage = (text) => {
    this.currentUser.sendMessage({
      text,
      roomId: this.state.roomId
    });
  }

  createRoom = (name) => {
    this.currentUser.createRoom({
      name 
    })
    .then(room => this.subscribeToRoom(room.id))
    .catch(err => console.log('error creating room', err));
  }

  render() {
    console.log('this.state.messages :', this.state.messages);
    return (
      <div className="app">
        <RoomList 
          roomId={this.state.roomId}
          rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
          subscribeToRoom={this.subscribeToRoom}  
        />
        <MessageList 
          messages={this.state.messages}
          roomId={this.state.roomId}  
        />
        <SendMessageForm
          disabled={!this.state.roomId} 
          sendMessage={this.sendMessage}
        />
        <NewRoomForm createRoom={this.createRoom}/>
      </div>
    );
  }
}

export default App;

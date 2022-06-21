import { Component } from '@angular/core';
import { HMSReactiveStore, selectPeers, selectIsConnectedToRoom,  selectIsLocalAudioEnabled, selectIsLocalVideoEnabled } from '@100mslive/hms-video-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vc-new';
  hms: any;
  hmsStore: any;
  hmsActions: any;
  peers: any;
  peersContainer: any;
  name = '';
  token = '';
  isConnected: any;
  isPeerConnected: boolean;
  muteAud: any;
  muteVid: any;

  constructor(){
  }

  ngOnInit(){
    this.hms = new HMSReactiveStore();
    this.hmsStore = this.hms.getStore(); //will hold the complete state of the application such as details of all the participants. We can also visualize this state at any time using the devtools extension.
    this.hmsActions = this.hms.getActions(); //will help us perform actions such as joining the room, mute our audio and send messages.
    this.peers = this.hmsStore.getState(selectPeers); // list of peers connected to the room --> other selectors for other details
    window.onbeforeunload = this.hmsActions.leave(); //leave room before leaving window
    this.peersContainer = document.getElementById('peers-container');
    this.hmsStore.subscribe(this.renderPeers, selectPeers);
    this.isConnected = this.hmsStore.getState(selectIsConnectedToRoom);
    this.hmsStore.subscribe(this.onConnection, selectIsConnectedToRoom);
  }
    
  joinVC(){
    console.log('name ', this.name, ' token ', this.token);
    this.hmsActions.join({
      userName: this.name,
      authToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3Nfa2V5IjoiNjJhNjRmZDhiODczNzg3YWEyNzA5YTcwIiwicm9vbV9pZCI6IjYyYTg1MmFjYjg3Mzc4N2FhMjcwYjBmMiIsInVzZXJfaWQiOiJkbWFta3lzbiIsInJvbGUiOiJndWVzdCIsImp0aSI6ImI0NWE5ZTAwLTgyNDMtNDk2Yi1hMjlkLTUwMzRjMGQzNjg3MiIsInR5cGUiOiJhcHAiLCJ2ZXJzaW9uIjoyLCJleHAiOjE2NTU1NDc5ODl9.YoIb37yIZKs3urxo75I5muD6Jju6DBTF1qGVYt9aE1k'
    });
  }
    
  leaveRoom(){
    console.log('leaving room');
    this.hmsActions.leave();
    console.log('peers ',this.peers);
  }

  createTags(tag, attrs, ...children): any {
    const newElement = document.createElement(tag);
    Object.keys(attrs).forEach((key) => {
      newElement.setAttribute(key, attrs[key]);
    });
    children.forEach((child) => {
      newElement.append(child);
    });
    return newElement;
  }

  renderPeers = (peers) => {
    // 1. clear the peersContainer & loop through the peers and render a tile for each peer
    this.peersContainer.innerHTML = "";
    if (!peers) {
      peers = this.hmsStore.getState(selectPeers);
    }
    peers.forEach((peer) => {
      const video = this.createTags("video", {
        class: "peer-video" + (peer.isLocal ? " local" : ""),
        autoplay: true,
        muted: true,
        playsinline: true,
        width: "100%",
        height: "auto",
      });

      this.hmsActions.attachVideo(peer.videoTrack, video);

      const peerContainer = this.createTags("div", {
          class: "peer-container",
          style: "border-style: double; border-width: 5px;"
        },
        video,
        this.createTags("div", {
            class: "peer-name responsive-card",
            style: "text-align: center; border-style: solid; border-width: 1px;"
          },
          peer.name + (peer.isLocal ? " (You)" : "")
        )
      );
  
      this.peersContainer.append(peerContainer);
    });
  }

  onConnection = (isConnected) => {
    console.log('check on connection' , isConnected)
    if (isConnected) {
      this.isPeerConnected = true;
    } else {
      this.isPeerConnected = false;
    }
  }

  muteAudio(){
    console.log('mute is clicked');
    const audioEnabled = !this.hmsStore.getState(selectIsLocalAudioEnabled);
    this.hmsActions.setLocalAudioEnabled(audioEnabled);
    // this.muteAud.textContent = audioEnabled ? "Mute" : "Unmute";
    this.renderPeers(this.hmsStore.getState(selectPeers));
  };
  
  hideVideo(){
    console.log('hide is clicked ');
    const videoEnabled = !this.hmsStore.getState(selectIsLocalVideoEnabled);
    this.hmsActions.setLocalVideoEnabled(videoEnabled);
    // this.muteVid.textContent = videoEnabled ? "Hide" : "Unhide";
    this.renderPeers(this.hmsStore.getState(selectPeers));
  };
  
}

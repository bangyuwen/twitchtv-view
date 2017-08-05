import React, { Component } from 'react';
import './App.css';

const channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "noobs2ninjas"]

class App extends Component {
  constructor() {
    super()
    this.state = {
      fliter: 'all',
      data: []
    }
    this.fetchData = this.fetchData.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  componentDidMount() {
    for (const channel of channels) {
      this.fetchData(channel)
    }
  }

  fetchData(channel) {
    const p1 = fetch(`https://wind-bow.glitch.me/twitch-api/users/${channel}`)
                .then(raw => raw.json())
    const p2 = fetch(`https://wind-bow.glitch.me/twitch-api/channels/${channel}`)
                .then(raw => raw.json())
    const p3 = fetch(`https://wind-bow.glitch.me/twitch-api/streams/${channel}`)
                .then(raw => raw.json())
    Promise.all([p1, p2, p3]).then(([p1, p2, p3]) =>
      {
        // console.log(p1, p2, p3)
        this.setState({
          data: [...this.state.data, {
            logo: p2.logo,
            name: p1.display_name,
            bio: p1.bio,
            banner: p2.video_banner,
            online: p3.stream ? true : false
          }]
        })
        console.log(this.state.data)
      }
    )
  }

  handleClick(state) {
      this.setState({
        fliter: state
      })
  }

  render() {
    let data = this.state.data.filter(obj => {
      switch (this.state.fliter) {
        case 'online':
          return obj.online
        case 'offline':
          return !obj.online
        case 'all':
        default:
          return true

      }
    })
    return (
      <div className="App">
        <div className="state">
          <Button state="all" handleClick={this.handleClick}>All</Button>
          <Button state="online" handleClick={this.handleClick}>Online</Button>
          <Button state="offline" handleClick={this.handleClick}>Offline</Button>
        </div>
        {data.length > 0 ?
          data.map((channelInf) => {
            return <Card key={channelInf.name} channelInf={channelInf}/>
          }) :
          ''
        }
      </div>
    );
  }
}

const Card = ({channelInf}) => {
  return(
    <div className="card">
      <div className="cardbanner">
        <a href="https://api.twitch.tv/kraken/users/freecodecamp">
          <img alt="banner" src={channelInf.banner}></img>
        </a>
      </div>
      <div className="text">
        <h2>
          <img alt="profile" src={channelInf.logo}/>
          <span>{channelInf.name}</span>
        </h2>
        <p>{channelInf.bio}</p>
      </div>
      <div className="stream">
        <div className={channelInf.online ? 'online button' : 'offline button'}>{channelInf.online ? 'Online' : 'Offline'}</div>
      </div>
    </div>
  )
}

const Button = ({state, children, handleClick}) => {
  return(
    <div className="button" onClick={()=>handleClick(state)}>
      {children}
    </div>
  )
}

export default App;

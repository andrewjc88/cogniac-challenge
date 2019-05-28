import React, { Component } from 'react';
import { BeatLoader } from 'react-spinners';
import moment from 'moment';


import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      detections: [],
      isLoading: false,
      tab: 1,
    }
    this._isMounted = true;
    this.url = "https://staging.cogniac.io/1/applications/QBzQ3t1x/detections"
    this.bearer = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWEiOiJmcm9udF9lbmRfY2FuZGlkYXRlc0Bjb2duaWFjLmNvIiwic3ViIjoiU0NVOXZSNTlxRUF4b2Q0cU1xWUo4RiIsImlzcyI6IkNvZ25pYWMiLCJleHAiOjE1NTkyNTg1NjAuNDU3OTA4LCJ0aWQiOiI1aGdyeGVxa3BpejgiLCJpYXQiOjE1NTg2NTM3NjAuNDU3OTA4LCJybHMiOlsidGVuYW50X3VzZXIiXX0.j0NKOF7yaSHYokMLsKQWNHA4VR9ZXxa0N9boge-wG4PEBGlAQ4Y6pbXxctESB-m0MIUlKirzuiEgMGA9BD8gLT0_3e9Eko--xIRpLGPwzuJofjVzWaAgSBggBmoV2cEYqrZSBsluYxdxYR7_DNsO4xov_m8DxlZU7HOmhyBEKsj-hy-drZFSBL2_zEcbZECgsnsGSi1D4FCYZkk--of5Ns8xswer-xjnY18Odz23is5opff9Ej6m0HuUxg_yKh2t7yakBTDvOKQUFFrmbLfQoFTaacEjU44gO9byOK0f8uyAbXYulstJEQE_QXoNZyU6l1LyDqni09qxlr8WNtn2AA";
  }

  componentDidMount() {
    this.fetchDetections();
  }

  async fetchDetections() {
    let { tab } = this.state;

    this.setState({ isLoading: true })

    try {
      let response = await fetch(this.url, {
        method: 'GET',
        t: { tab },
        headers: {
          'Authorization': this.bearer,
          'Content-Type': 'application/json'
        }
      });

      let reponseObj = await response.json();
      let detections = reponseObj.data;

      if (this._isMounted) {
        this.setState({
          isLoading: false,
          detections
        })
      }

    } catch (err) {
      alert('Failed to fetch {err}');
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  renderHeader() {
    return (
      <div className="App-header">
        <h2>Detections ({this.state.detections.length})</h2>
      </div>
    )
  }

  renderLoadingSpinner() {
    if (this.state.isLoading) {
      return (
        <div className="Loading-bar">
          <BeatLoader
            sizeUnit={"px"}
            size={25}
            color={'#70B7F3'}
          />
        </div>
      )
    }
  }

  formatDate(timestr) {
    const date = moment(timestr);

    return `${date.format('ddd, DD MMM YYYY HH:mm:ss')} UTC`;
  }

  async fetchImage(imgUrl) {
    try {
      let response = await fetch(imgUrl, {
        method: 'GET',
        headers: {
          'Authorization': this.bearer,
        }
      });

      console.log(response)

      

    } catch (err) {
      alert('Failed to fetch {err}');
    }
  }

  renderDetectionsSection() {
    const { detections } = this.state;

    return (
      <div className="Detections-section">
        {detections.map(detection =>
          <div 
            className="Detections-card" 
            key={detection.media.media_id}
            onClick={() => this.fetchImage(detection.media.media_url)}
          >
            {/* {console.log(detection)} */}
            <h3>{this.formatDate(detection.media.created_at)}</h3>
            {/* <img src={`${detection.media.media_url}.${detection.media.media_format}`}/> */}
            {/* <img src={detection.media.media_url}/> */}
            {/* {this.fetchImage(detection.media.media_url)} */}
          </div>
        )}
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        {this.renderHeader()}
        {this.renderLoadingSpinner()}
        {this.renderDetectionsSection()}
      </div>
    );
  }
}

export default App;

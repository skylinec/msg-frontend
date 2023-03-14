import { React, Component } from 'react';
import './GraphContainer.css';
// import Checkbox from './Checkbox'
// import MainGraph from './MainGraph';
import { w3cwebsocket as W3CWebSocket } from "websocket";
// import Dropzone from 'react-dropzone'

const client = new W3CWebSocket('ws://localhost:9000');

// const maxSize = 1048576; //1mb
export default class GraphContainer extends Component {
    constructor(props) {
        super();

        this.state = {
            tracksDataIsReturned : false,
            similaritiesDataIsReturned: false,
            showingDescription: false,
            showTempo: true,
            showRMSE: true,
            showContrast: true,
            dragActive: false,
            setDragActive: false,
            locked: false,
        }
        
        console.log("INITIAL STATE",this.state)

        this.handleChange = this.handleChange.bind(this);
        this.toggleDescription = this.toggleDescription.bind(this);
    }

    trackChange(data) {
        console.log("CHANGE",data)
    }

    handleChange(event){
        console.log("values",event.target,event.target.value,event.target.name)

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        })

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "centroidSim": this.state.centroidSim,
                "contrastSim": this.state.contrastSim,
                "bandwidthSim": this.state.bandwidthSim,
                "rolloffSim": this.state.rolloffSim,
                "rmseSim": this.state.rmseSim,
                "zcrSim": this.state.zcrSim,
                "mfccSim": this.state.mfccSim,
                "chromaStftSim": this.state.chromaStftSim
            })
        };
        fetch('http://localhost:6001/api/settings', requestOptions)
            .then(res => res.json())
            .then(async (dataResult) => {
                console.log("SETTINGS RESULT",dataResult)
            });
    }

    fetchData() {
        console.log("FETCHING DATA...")
        this.setState({
            tracksDataIsReturned : false,
            similaritiesDataIsReturned: false
        })

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch('http://localhost:6001/api/settings', requestOptions)
            .then(res => res.json())
            .then(async (dataResult) => {
                console.log("SETTINGS RESULT",dataResult[0])
                console.log("SETTINGS CENTROID",dataResult[0].centroidSim)
                let n_result = dataResult[0]
                this.setState({
                    centroidSim: n_result.centroidSim,
                    contrastSim: n_result.contrastSim,
                    bandwidthSim: n_result.bandwidthSim,
                    rolloffSim: n_result.rolloffSim,
                    rmseSim: n_result.rmseSim,
                    zcrSim: n_result.zcrSim,
                    mfccSim: n_result.mfccSim,
                    chromaStftSim: n_result.chromaStftSim
                })
            });

        

        fetch('http://localhost:6001/api/check_lock')
            .then(res => res.json())
            .then(async (dataResult) => {
                let value = dataResult.val

                console.log("LOCK RESULT",value)
                // console.log("LOCK RESULT DR",dataResult)

                if(value === "LOCKED"){
                    this.state.locked = true
                } else if (value === "UNLOCKED"){
                    this.state.locked = false
                }
            })
        
        fetch('http://localhost:6001/api/tracks')
            .then(res => res.json())
            .then(async (dataResult) => {
                let obj = await import('./MainGraph');
                this.GraphChild = obj.default;
                this.setState(
                    { 
                        tracksDataIsReturned : true,
                        tracksData: dataResult
                    }
                );
            })

        fetch('http://localhost:6001/api/similarities')
            .then(res => res.json())
            .then(async (dataResult) => {
                let obj = await import('./MainGraph');
                this.GraphChild = obj.default;
                this.setState(
                    { 
                        similaritiesDataIsReturned : true,
                        similaritiesData: dataResult
                    }
                );
            })

        console.log("NEW STATE",this.state)
    }

    componentDidMount() {

        this.fetchData();

        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        
        client.onmessage = (message) => {
            console.log("GOT MESSAGE",message)
            console.log(typeof(message))
            if (message.data == "CHANGE") {
                console.log("Database updated")
                this.fetchData();
            } else if (message.data == "LOCK") {
                console.log("Locking UI")
                this.setState(
                    { 
                        locked : true,
                    }
                );
            } else if (message.data == "LOCK OFF") {
                console.log("Unlocking UI")
                this.setState(
                    { 
                        locked : false,
                    }
                );
            } else if (message.data.split("?")[0] === "STATUS") {
                let statusMsgD = message.data.split("?")[1]
                console.log("STATUS MSG",statusMsgD)
                this.setState({
                    statusMsg: statusMsgD
                })
            }
            // this.setState({});
        };
        client.onerror = function() {
            console.log('Connection Error');
        };
    }

    postResetDatabase() {
        console.log("SENDING RESET COMMAND")

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };

        fetch('http://localhost:6001/api/restart_backend', requestOptions)
            .then(res => res.json())
            .then(async (dataResult) => {
                console.log("RESTART RESULT",dataResult)
            })
    }

    toggleDescription(event) {
        event.preventDefault();

        this.setState({
            showingDescription: !this.state.showingDescription
        })

        console.log("Toggled description")
    }

    onDrop(e) {
        console.log(e,"dropped")

        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            this.setDragActive = true;
        } else if (e.type === "dragleave") {
            this.setDragActive = false;
        }
    }

    render() { 

        console.log("Rendering GraphContainer")
        let dText = "";

        if (this.state.showingDescription) {
            dText = 
            <p>
                This project uses spectral features of audio to graph perceived similarity, in the computational sense
                <br></br>
                In theory, the more connections between a file, the more similar it is
                <br></br>
                <button onClick={this.postResetDatabase}>Restart Backend (WIP)</button>
                <br></br>
                The frontend is interacting with an Express API that is communicating with a Python filewatcher backend
                <br></br>
                {/* <div>
                        <p>Genre (WIP) <Checkbox name="genre" /></p>
                        <p>Tempo <Checkbox name="tempo" /></p>
                        <p>RMSE (WIP) <Checkbox name="rmse" /></p>
                        <p>Contrast<Checkbox name="contrast" /></p>
                        <p>Centroid<Checkbox name="centroid" /></p>
                        <p>Bandwidth<Checkbox name="bandwidth"/></p>
                        <p>Rolloff<Checkbox name="rolloff"/></p>
                    </div> */}
                <br></br>
                <i>centroid sim</i>
                <input
                    name="centroidSim"
                    type="number"
                    value={this.state.centroidSim}
                    onChange={this.handleChange}
                />
                <br></br>
                <i>contrast sim</i>
                <input
                    name="contrastSim"
                    type="number"
                    value={this.state.contrastSim}
                    onChange={this.handleChange}
                />
                <br></br>
                <i>bandwidth sim</i>
                <input
                    name="bandwidthSim"
                    type="number"
                    value={this.state.bandwidthSim}
                    onChange={this.handleChange}
                />
                <br></br>
                <i>rolloff sim</i>
                <input
                    name="rolloffSim"
                    type="number"
                    value={this.state.rolloffSim}
                    onChange={this.handleChange}
                />
                <br></br>
                <i>rmse sim</i>
                <input
                    name="rmseSim"
                    type="number"
                    value={this.state.rmseSim}
                    onChange={this.handleChange}
                />
                <br></br>
                <i>zcr sim</i>
                <input
                    name="zcrSim"
                    type="number"
                    value={this.state.zcrSim}
                    onChange={this.handleChange}
                />
                <br></br>
                <i>mfcc sim</i>
                <input
                    name="mfccSim"
                    type="number"
                    value={this.state.mfccSim}
                    onChange={this.handleChange}
                />
                <br></br>
                <i>chroma stft sim</i>
                <input
                    name="chromaStftSim"
                    type="number"
                    value={this.state.chromaStftSim}
                    onChange={this.handleChange}
                />
            </p>
        } else {
            dText = <p>Click above to unfold (will also reset graph position)</p>
        }

        return (
            <div className="GraphContainer">
                <div id='header'>
                    <div onClick={this.toggleDescription}>
                        <h1 className='noClick'>Audio Similarity Graph</h1>
                        <p><il>By Matthew Holloway 2022</il></p>
                        <p>{this.state.statusMsg}</p>
                    </div>
                    {dText}
                </div>
                <div className='cGraphChild'>
                    <form id="form-file-upload" onDragEnter={(e) => this.onDrop(e)} onSubmit={(e) => e.preventDefault()}>
                        <input type="file" id="input-file-upload" multiple={true} />
                        { (this.state.tracksDataIsReturned && this.state.similaritiesDataIsReturned) ? <this.GraphChild tracksData={this.state.tracksData} similaritiesData={this.state.similaritiesData} locked={this.state.locked} statusMsg={this.state.statusMsg}/> : <h1> Loading </h1>}
                    </form>
                </div>
            </div>
        )
    }
}
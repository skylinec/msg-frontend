import { React, Component } from 'react';
import './GraphContainer.css';
import Checkbox from './Checkbox'
// import MainGraph from './MainGraph';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Dropzone from 'react-dropzone'

const client = new W3CWebSocket('ws://localhost:9000');

const maxSize = 1048576; //1mb
export default class GraphContainer extends Component {
    constructor(props) {
        super();

        this.state = {
            dataIsReturned : false,
            showingDescription: false,
            showTempo: true,
            showRMSE: true,
            showContrast: true,
            dragActive: false,
            setDragActive: false
        }

        this.toggleDescription = this.toggleDescription.bind(this);
    }

    trackChange(data) {
        console.log("CHANGE",data)
    }

    fetchData() {
        console.log("FETCHING DATA...")
        this.setState({
            dataIsReturned : false
        })
        
        fetch('http://localhost:6001/api/tracks')
            .then(res => res.json())
            .then(async (dataResult) => {
                let obj = await import('./MainGraph');
                this.GraphChild = obj.default;
                this.setState(
                    { 
                        dataIsReturned : true,
                        data: dataResult
                    }
                );
            })
    }

    componentDidMount() {

        this.fetchData();

        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        
        client.onmessage = (message) => {
            console.log("Database updated")
            this.fetchData();
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

        if (e.type == "dragenter" || e.type == "dragover") {
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
            </p>
        } else {
            dText = <p>Click above to unfold (will also reset graph position)</p>
        }

        return (
            <div className="GraphContainer">
                <div id='header'>
                    <div onClick={this.toggleDescription}>
                        <h1 className='noClick'>Musical Similarity Graph</h1>
                        <p><il>By Matthew Holloway 2022</il></p>
                    </div>
                    {dText}
                </div>
                <div className='cGraphChild'>
                    <form id="form-file-upload" onDragEnter={(e) => this.onDrop(e)} onSubmit={(e) => e.preventDefault()}>
                        <input type="file" id="input-file-upload" multiple={true} />
                        { this.state.dataIsReturned ? <this.GraphChild data={this.state.data}/> : <h1> Loading </h1>}
                    </form>
                </div>
            </div>
        )
    }
}
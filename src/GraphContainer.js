import { React, Component } from 'react';
// import MainGraph from './MainGraph';
import { w3cwebsocket as W3CWebSocket } from "websocket";
export default class GraphContainer extends Component {
    constructor(props) {
        super();

        this.state = {
            dataIsReturned : false
        }
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
        const client = new W3CWebSocket('ws://localhost:9000');

        this.fetchData();

        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        
        client.onmessage = (message) => {
            console.log("Database updated")
            this.fetchData();
            this.setState({});
        };
        client.onerror = function() {
            console.log('Connection Error');
        };
            

    }

    render() { 
        console.log("Rendering GraphContainer")

        return (
            <div className="GraphContainer">
                { this.state.dataIsReturned ? <this.GraphChild data={this.state.data}/> : <h1> Loading </h1>}

                <h1>Refresh database</h1>
            </div>
        )
    }
}
import { React, Component } from 'react';
import MainGraph from './MainGraph';

export default class GraphContainer extends Component {
    constructor(props) {
        super();

        this.state = {
            dataIsReturned : false
        }
    }

    componentDidMount() {
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

    render() { 

        return (
            <div className="GraphContainer">
                { this.state.dataIsReturned ? <this.GraphChild data={this.state.data}/> : <h1> Loading </h1>}
            </div>
        )
    }
}
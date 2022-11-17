import { React, Component } from 'react';
import Cytoscape from 'cytoscape';
import CytoscapeComponent from "react-cytoscapejs";
import avsdf from 'cytoscape-avsdf';
import {roundTo, roundToUp, roundToDown} from 'round-to';

Cytoscape.use(avsdf); 

export default class MainGraph extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            elementsList: []
        };
      }

    initListeners()  {
        this.cy.on('tap', 'node', evt => {
            var node = evt.target;
            console.log('tapped ' + node.id());
        })
    }

    componentWillUnmount() {
        console.log('remove listeners')
        if (this.cy) {
            this.cy.removeAllListeners()
        }
    }

    componentDidMount() {

    }

    buildLinks() {
            
    }

    sigFigs(n, sig) {
        var mult = Math.pow(10, sig - Math.floor(Math.log(n) / Math.LN10) - 1);
        return Math.round(n * mult) / mult;
    }

    roundToNearest(n, s) {
        return Math.floor(n/s) * s;
    }

    render() { 
        console.log("Rendering MainGraph")

        // console.log("data",this.props.data)

        let dataLength = Object.keys(this.props.data).length;
        // console.log(dataLength)

        // Create node list
        for(let i = 0; i < dataLength; i++) {
            // console.log("Data number",i,this.props.data[i])

            this.state.elementsList.push(
                {
                    data: {
                        id: this.props.data[i]._id,
                        label: this.props.data[i].fileName
                    }
                }
            )
        }

        // Centroid comparison
        for(let i=0; i<dataLength; i++){
            for(let j=i + 1; j<dataLength; j++){
               if(this.roundToNearest(this.props.data[i].centroid, 500) == this.roundToNearest(this.props.data[j].centroid, 500)){
                //   console.log(this.props.data[i].fileName,this.roundToNearest(this.props.data[i].centroid, 500))
                //   console.log(this.props.data[j].fileName,this.roundToNearest(this.props.data[j].centroid, 500))

                  this.state.elementsList.push(
                    {
                        data: {
                            id: "centroid "+this.props.data[i].fileName+this.props.data[j].fileName,
                            source: this.props.data[i]._id,
                            target: this.props.data[j]._id,
                            label: "centroid",
                            colour:'#DE3C1A'
                        }
                    }
                )
               }
            }
        }

        // Bandwidth comparison
        for(let i=0; i<dataLength; i++){
            for(let j=i + 1; j<dataLength; j++){
               if(this.roundToNearest(this.props.data[i].bandwidth, 1000) == this.roundToNearest(this.props.data[j].bandwidth, 1000)){
                //   console.log(this.props.data[i].fileName,this.roundToNearest(this.props.data[i].bandwidth, 1000))
                //   console.log(this.props.data[j].fileName,this.roundToNearest(this.props.data[j].bandwidth, 1000))

                  this.state.elementsList.push(
                    {
                        data: {
                            id: "bandwidth "+this.props.data[i].fileName+this.props.data[j].fileName,
                            source: this.props.data[i]._id,
                            target: this.props.data[j]._id,
                            label: "bandwidth",
                            colour:'#36BB2D'
                        }
                    }
                )
               }
            }
        }

        // Rolloff comparison
        for(let i=0; i<dataLength; i++){
            for(let j=i + 1; j<dataLength; j++){
               if(this.roundToNearest(this.props.data[i].rolloff, 1000) == this.roundToNearest(this.props.data[j].rolloff, 1000)){
                //   console.log(this.props.data[i].fileName,this.roundToNearest(this.props.data[i].rolloff, 1000))
                //   console.log(this.props.data[j].fileName,this.roundToNearest(this.props.data[j].rolloff, 1000))

                  this.state.elementsList.push(
                    {
                        data: {
                            id: "rolloff "+this.props.data[i].fileName+this.props.data[j].fileName,
                            source: this.props.data[i]._id,
                            target: this.props.data[j]._id,
                            label: "rolloff",
                            colour:'#14DED2'
                        }
                    }
                )
               }
            }
        }

        // Tempo comparison
        for(let i=0; i<dataLength; i++){
            for(let j=i + 1; j<dataLength; j++){
               if(this.roundToNearest(this.props.data[i].tempo, 50) == this.roundToNearest(this.props.data[j].tempo, 50)){
                //   console.log(this.props.data[i].fileName,this.roundToNearest(this.props.data[i].tempo, 50))
                //   console.log(this.props.data[j].fileName,this.roundToNearest(this.props.data[j].tempo, 50))

                  this.state.elementsList.push(
                    {
                        data: {
                            id: "tempo "+this.props.data[i].fileName+this.props.data[j].fileName,
                            source: this.props.data[i]._id,
                            target: this.props.data[j]._id,
                            label: "tempo",
                            colour:'#DE14CF'
                        }
                    }
                )
               }
            }
        }

        // Contrast comparison
        for(let i=0; i<dataLength; i++){
            for(let j=i + 1; j<dataLength; j++){
               if(this.props.data[i].contrast == this.props.data[j].contrast){
                //   console.log(this.props.data[i].fileName,this.props.data[i].contrast)
                //   console.log(this.props.data[j].fileName,this.props.data[j].contrast)

                  this.state.elementsList.push(
                    {
                        data: {
                            id: "contrast "+this.props.data[i].fileName+this.props.data[j].fileName,
                            source: this.props.data[i]._id,
                            target: this.props.data[j]._id,
                            label: "contrast",
                            colour:'#D5DE14'
                        }
                    }
                )
               }
            }
        }

        const layout = { 
            name: 'avsdf',
            nodeSeparation: 240
        };

        return (
            <div className="MainGraph">
                <CytoscapeComponent
                    elements={this.state.elementsList}
                    layout={layout}
                    cy={cy => {
                        this.cy = cy
                        this.initListeners()
                    }}
                    stylesheet={[
                    {
                        selector: 'node',
                        style: {
                        'background-color': '#282',
                        'label': 'data(label)',
                        //opacity: 0.3
                        }
                    },
                    {
                        selector: 'node[type="comp"]',
                        style: {
                        'background-color': '#822',
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                        'width': 2,
                        // 'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        // 'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier'
                        }
                    },
                    {
                        selector: 'edge[colour]',
                        css: {
                            'line-color': 'data(colour)'
                        }
                    },
                    {
                        selector: "edge[label]",
                        css: {
                          "label": "data(label)",
                          "text-rotation": "autorotate",
                          "font-size": "7px",
                          "text-margin-x": "0px",
                          "text-margin-y": "20px"
                        }
                      },
                    ]}
                    style={
                        {
                            "width": "100%",
                            "height": "100vh",
                        }
                    }
                />
            </div>
        )
    }
    
}
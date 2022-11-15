import { React, Component } from 'react';
import Cytoscape from 'cytoscape';
import CytoscapeComponent from "react-cytoscapejs";
import { useEffect } from 'react';
import COSEBilkent from 'cytoscape-cose-bilkent';

Cytoscape.use(COSEBilkent); 

let elementsL = [];

export default class MainGraph extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
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

    render() { 

        // console.log("data",this.props.data)

        let elements_list = [];

        let dataLength = Object.keys(this.props.data).length;
        console.log(dataLength)

        for(let i = 0; i < dataLength; i++) {
            console.log("Data number",i,this.props.data[i])

            elements_list.push(
                {
                    data: {
                        id: this.props.data[i]._id,
                        label: this.props.data[i].fileName
                    }
                }
            )
        }

        const layout = { name: 'cose-bilkent' };

        return (
            <div className="MainGraph">
                <CytoscapeComponent
                    elements={elements_list}
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
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier'
                        }
                    }
                    ]}
                    style={{
                    width: "100vw",
                    height: "100vh"
                    }}
                />
            </div>
        )
    }
    
}
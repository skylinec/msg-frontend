import { React, Component } from 'react';
import Cytoscape from 'cytoscape';
import CytoscapeComponent from "react-cytoscapejs";
import COSEBilkent from 'cytoscape-cose-bilkent';

Cytoscape.use(COSEBilkent); 

export default class MainGraph extends Component {
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

    render() { 
        const elements = [
            { data: { id: "one", label: "Comp1", type: 'comp' }, },
            { data: { id: "two", label: "Node 2" }, },
            { data: { id: "three", label: "Node 3" }, },
            { data: { id: "four", label: "Node 3" }, position: { x: 20, y: 200 } },
            {
                data: {
                source: "one",
                target: "two",
                label: "Edge from Node1 to Node2"
                }
            }
        ];

        const layout = { name: 'cose-bilkent' };

        return (
            <div className="MainGraph">
                <CytoscapeComponent
                    elements={elements}
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
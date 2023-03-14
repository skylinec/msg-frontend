import { React, Component } from 'react';
import Cytoscape from 'cytoscape';
import CytoscapeComponent from "react-cytoscapejs";
import avsdf from 'cytoscape-avsdf';
import PacmanLoader from "react-spinners/PacmanLoader";

import './MainGraph.css';
// import cola from 'cytoscape-cola';
// import {roundTo, roundToUp, roundToDown} from 'round-to';

import popper from 'cytoscape-popper';
import cxtmenu from 'cytoscape-cxtmenu';

Cytoscape.use(avsdf); 
Cytoscape.use(popper);
Cytoscape.use(cxtmenu);

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
            let popper = node.popper({
                content: () => {
                  let div = document.createElement('div');
              
                  div.innerHTML = <p style={{color: "white"}}>!!</p>;
              
                  document.body.appendChild( div );
              
                  return div;
                }
            });

            let update = () => {
                popper.update();
            };
            
            node.on('position', update);
            this.cy.on('pan zoom resize', update);
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
        let defaults = {
            menuRadius: function(ele){ return 100; }, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. Can either be a number or function as in the example.
            selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
            commands: [ // an array of commands to list in the menu or a function that returns the array
              /*
              { // example command
                fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
                content: 'a command name', // html/text content to be displayed in the menu
                contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                select: function(ele){ // a function to execute when the command is selected
                  console.log( ele.id() ) // `ele` holds the reference to the active element
                },
                hover: function(ele){ // a function to execute when the command is hovered
                  console.log( ele.id() ) // `ele` holds the reference to the active element
                },
                enabled: true // whether the command is selectable
              }
              */
            ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
            fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
            activeFillColor: 'rgba(1, 105, 217, 0.75)', // the colour used to indicate the selected command
            activePadding: 20, // additional size in pixels for the active command
            indicatorSize: 24, // the size in pixels of the pointer to the active command, will default to the node size if the node size is smaller than the indicator size, 
            separatorWidth: 3, // the empty spacing in pixels between successive commands
            spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
            adaptativeNodeSpotlightRadius: false, // specify whether the spotlight radius should adapt to the node size
            minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
            maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
            openMenuEvents: 'cxttapstart taphold', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
            itemColor: 'white', // the colour of text in the command's content
            itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
            zIndex: 9999, // the z-index of the ui div
            atMouse: false, // draw menu at mouse position
            outsideMenuCancel: false // if set to a number, this will cancel the command if the pointer is released outside of the spotlight, padded by the number given 
        };

        // let menu = this.cy.cxtmenu( defaults );

        console.log("Rendering MainGraph")

        // console.log("data",this.props.data)

        let tracksDataLength = Object.keys(this.props.tracksData).length;
        for(let i = 0; i < tracksDataLength; i++) {
            // console.log("Data number",i,this.props.data[i])

            this.state.elementsList.push(
                {
                    data: {
                        id: this.props.tracksData[i]._id,
                        label: this.props.tracksData[i].fileName
                    }
                }
            )
        }

        let similaritiesDataLength = Object.keys(this.props.similaritiesData).length;
        for(let i = 0; i < similaritiesDataLength; i++) {
            this.state.elementsList.push(
                {
                    data: {
                        id: this.props.similaritiesData[i].id,
                        source: this.props.similaritiesData[i].source,
                        target: this.props.similaritiesData[i].target,
                        label: this.props.similaritiesData[i].label,
                        colour: this.props.similaritiesData[i].colour
                    }
                }
            )
        }

        const layout = { 
            name: "avsdf",
            // Called on `layoutready`
            ready: function () {
            },
            // Called on `layoutstop`
            stop: function () {
            },
            // number of ticks per frame; higher is faster but more jerky
            refresh: 30,
            // Whether to fit the network view after when done
            fit: true,
            // Padding on fit
            padding: 10,
            // Prevent the user grabbing nodes during the layout (usually with animate:true)
            ungrabifyWhileSimulating: false,
            // Type of layout animation. The option set is {'during', 'end', false}
            animate: 'end',
            // Duration for animate:end
            animationDuration: 500,   
            // How apart the nodes are
            nodeSeparation: 300
        };

        const mystyle = {
            position: 'fixed',
            top: '50%',
            left: '50%',
        };

        return (
            <div className="MainGraph">
                <PacmanLoader
                    color={"#DE8214"}
                    loading={this.props.locked}
                    size={50}
                    cssOverride={mystyle}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
                <CytoscapeComponent
                    elements={this.state.elementsList}
                    layout={layout}
                    cy={cy => {
                        this.cy = cy
                        this.initListeners()
                        // cy.zoomingEnabled = true;
                    }}
                    stylesheet={[
                    {
                        selector: 'node',
                        style: {
                        'background-color': 'white',
                        'label': 'data(label)',
                        'color': 'white'
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
                          "color": "white",
                          "text-margin-x": "0px",
                          "text-margin-y": "0px"
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
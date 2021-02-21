import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

// import logo from './logo.svg';
// import './App.css';
import getWeb3 from "./getWeb3";

// const path = require('path');
// var SimpleStorageABI = require(path.join(__dirname, '../build/contracts/SimpleStorage'))
import SimpleStorageContract from "./contracts/SimpleStorage.json";

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      eventHistory: []
    }
    this.addToSimpleStorage = this.addToSimpleStorage.bind(this);
  }
  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        // Instantiate contract once web3 provided.
        this.instantiateContract()
      })
      .catch((error) => {
        console.log(error);
        console.log('Error finding web3.')
      })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('@truffle/contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        this.setState(prevState => ({
          ...prevState,
          accounts,
          simpleStorageInstance
        }));

        return simpleStorageInstance.set(5, { from: accounts[0] })
      }).then((results) => {
        console.log(results)
        return simpleStorageInstance.get()
      }).then((results) => {
        console.log(results.toNumber())
        this.setState({ storageValue: results.toNumber() })
        this.updateEventHistory()
      })
    })
  }

  updateEventHistory = async () => {
    this.state.simpleStorageInstance.getPastEvents('ValueChanged', { fromBlock: 0, toBlock: 'latest' }).then(events => {
      console.log(JSON.stringify(events))
      let history = []
      for (let e of events) {
        let t = {}
        t.transactionHash = e.transactionHash
        t.oldValue = e.returnValues.oldValue
        t.newValue = e.returnValues.newValue
        history.push(t)
      }
      this.setState({ eventHistory: history })
    })
  }

  addToSimpleStorage = () => {
    if (this.state.simpleStorageInstance && this.state.accounts) {
      const value = this.storageAmountInput.value;
      console.log('value to be stored is');
      console.log(value);
      this.state.simpleStorageInstance.set(value, { from: this.state.accounts[0] })
        .then((results) => {
          return this.state.simpleStorageInstance.get()
        }).then((results) => {
          this.setState(prevState => ({
            ...prevState,
            storageValue: results.toNumber()
          }));
          this.updateEventHistory()
        }).catch((err) => {
          console.log('error');
          console.log(err);
        });
    } else {
      this.setState(prevState => ({
        ...prevState,
        error: new Error('simple storage instance not loaded')
      }))
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1 class="d-flex justify-content-center">Good to Go!</h1>
        <p class="d-flex justify-content-center">Your Truffle Box is installed and ready.</p>
        <h2 class="d-flex justify-content-center">Smart Contract Example</h2>
        <p class="d-flex justify-content-center">
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        {/* <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p> */}
        <div class="d-flex justify-content-center">The stored value is: {this.state.storageValue}</div>
        <div class="d-flex justify-content-center">
          <Form inline>

            <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">Storage Value</Form.Label>
            <Form.Control className="my-1 mr-sm-2" id="storageAmountInput" type="number" ref={c => { this.storageAmountInput = c }} />

            <Button variant="primary" onClick={(e) => {
              e.preventDefault();
              this.addToSimpleStorage()
            }}
            >Set Storage
              </Button>
          </Form>
        </div>
        <br></br>
        <div class="d-flex justify-content-center">Transaction History: </div>
        <div class="d-flex justify-content-center">
          <EventHistory events={this.state.eventHistory} />
        </div>
      </div>

    );
  }
}
class EventHistory extends React.Component {
  render() {
    let listItems = this.props.events.map((e) => <li key={e.transactionHash}>Value: {e.newValue} (was {e.oldValue})</li>)
    return <ol>{listItems}</ol>
  }
}
/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/
export default App;

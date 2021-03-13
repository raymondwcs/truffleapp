import React from 'react';
// import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';

// import logo from './logo.svg';
// import './App.css';
import getWeb3 from "./getWeb3";

// const path = require('path');
// var SimpleStorageABI = require(path.join(__dirname, '../build/contracts/SimpleStorage'))
import SimpleStorageContract from "./build/contracts/SimpleStorage.json";

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      eventHistory: []
    }
  }

  componentDidMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3,
          accounts: results.accounts,
          network: results.network
        })

        // Instantiate contract once web3 provided.
        this.instantiateContract()
      })
      .catch((error) => {
        console.log(error)
        alert(error.message)
      })
  }


  instantiateContract() {
    const contract = require('@truffle/contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    simpleStorage.deployed().then(instance => {
      simpleStorageInstance = instance
      this.setState({ simpleStorageInstance: instance })
      return simpleStorageInstance.get()
    }).then(results => {
      console.log(`get() returns: ${results.toNumber()}`)
      this.setState({ storageValue: results.toNumber() })
      this.updateEventHistory()
    }).catch(error => {
      alert(error.message)
    })
  }

  updateEventHistory = async () => {
    this.state.simpleStorageInstance.getPastEvents('ValueChanged', { fromBlock: 0, toBlock: 'latest' }).then(events => {
      console.log(JSON.stringify(events))
      let history = events.map(e => {
        return ({
          address: e.address,
          transactionHash: e.transactionHash,
          oldValue: e.returnValues.oldValue,
          newValue: e.returnValues.newValue
        })
      })
      this.setState({ eventHistory: history })
    })
  }

  addToSimpleStorage = (value) => {
    if (this.state.simpleStorageInstance && this.state.accounts) {
      console.log(`value to be stored is = ${value}`);
      console.log(`account: ${this.state.accounts}`)
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
      <Container>
        <h2 className="d-flex justify-content-center">Smart Contract Example</h2>
        <Provider network={this.state.network} />
        <div className="d-flex justify-content-center">
          <p>Current stored value is: <span className="h3 text-success font-weight-bolder">{this.state.storageValue}</span></p>
        </div>
        <div className="d-flex justify-content-center">
          <Form inline>
            <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">New stored Value</Form.Label>
            <Form.Control className="my-1 mr-sm-2" id="storageAmountInput" type="number"></Form.Control>
            <Button variant="primary" onClick={(e) => {
              e.preventDefault();
              this.addToSimpleStorage(document.getElementById("storageAmountInput").value)
            }}
            >Change
            </Button>
          </Form>
        </div>
        <br></br>
        <div className="d-flex flex-row justify-content-center">
          <EventHistory className="d-flex" events={this.state.eventHistory} />
        </div>
      </Container>
    );
  }
}

class EventHistory extends React.Component {

  render() {
    if (this.props.events.length === 0) {
      return < div ></div >
    }
    // let listItems = this.props.events.map((e) => <li key={e.transactionHash}>Value: {e.newValue} (was {e.oldValue})</li>)
    // return <ol>{listItems}</ol>
    let listItems = this.props.events.map((e) =>
      <tr key={e.transactionHash}>
        <td>{e.address}</td>
        <td className="text-success">{e.newValue}</td>
        <td>{e.oldValue}</td>
      </tr>
    )
    return (
      <div >
        <div className="d-flex justify-content-center">Transaction History</div>
        <div className="d-flex justify-content-center">
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th className="col-auto">Address</th>
                <th className="bg-success text-white col-auto">New Value</th>
                <th className="col-auto">Old Value</th>
              </tr>
            </thead>
            <tbody>
              {listItems}
            </tbody>
          </Table>
        </div>
      </div>
    )
  }
}

class Provider extends React.Component {
  render() {
    return (
      <div className="d-flex justify-content-center">
        <h6>Connected to network: <code>{this.props.network.name}</code></h6>
      </div >
    )
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

import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import getWeb3 from "./getWeb3";
import SimpleStorageContract from "./build/contracts/SimpleStorage.json";

const App = () => {
  const [storedData, setStoredData] = React.useState('?')
  const [web3, setWeb3] = React.useState(null)
  const [eventHistory, setEventHistory] = React.useState(null)
  const [accounts, setAccounts] = React.useState(null)
  const [network, setNetwork] = React.useState(null)
  const [simpleStorageInstance, setSimpleStorageInstance] = React.useState(null)

  React.useEffect(() => {
    getWeb3().then(results => {
      setWeb3(results.web3)
      setAccounts(results.accounts)
      setNetwork(results.network)
      return results
    }).then(results => {
      const contract = require('@truffle/contract')
      const simpleStorage = contract(SimpleStorageContract)
      simpleStorage.setProvider(results.web3.currentProvider)
      return simpleStorage.deployed()
    }).then(instance => {
      setSimpleStorageInstance(instance)
    }).catch(error => {
      console.error(error)
    })
  }, [])

  React.useEffect(() => {
    if (simpleStorageInstance) {
      simpleStorageInstance.storedData().then(results => {
        setStoredData(results.toNumber())
        return simpleStorageInstance.getPastEvents('valueChanged', { fromBlock: 0, toBlock: 'latest' })
      }).then(events => {
        let history = events.map(e => {
          return {
            address: e.address,
            changedBy: e.returnValues.changedBy,
            transactionHash: e.transactionHash,
            oldValue: e.returnValues.oldValue,
            newValue: e.returnValues.newValue
          }
        })
        return history
      }).then(history => {
        setEventHistory(history)
      })
    }
  }, [simpleStorageInstance, storedData])

  const addToSimpleStorage = async (value) => {
    if (simpleStorageInstance && accounts) {
      console.log(`value to be stored is = ${value}`);
      console.log(`account: ${accounts}`)

      try {
        let tx = await simpleStorageInstance.set(parseInt(value), { from: accounts[0] })
        console.log(`tx receipt: ${JSON.stringify(tx)}`)
        let results = await simpleStorageInstance.storedData()
        let currentStoredData = results.toNumber()
        console.log(`addToSimpleStorage(${value}) returns ${currentStoredData}`)
        if (currentStoredData === parseInt(value)) {
          setStoredData(value)
        } else {
          alert(`Error updating!`)
        }
      } catch (error) {
        console.error(error)
        alert(error)
        return
      }
    }
  }


  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <Container>
      <h2 className="d-flex justify-content-center">Smart Contract Example</h2>
      <Provider network={network} />
      <Metamask ethereum={window.ethereum} />
      <Account accounts={accounts} />
      <ContractAddress contractInstance={simpleStorageInstance} />
      <div className="d-flex justify-content-center mt-4">
        <h4>Current stored data: <span className="h3 text-success font-weight-bolder">{storedData}</span></h4>
      </div>
      <div className="d-flex justify-content-center">
        <Form inline>
          <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">New stored data</Form.Label>
          <Form.Control className="my-1 mr-sm-2" id="storageAmountInput" type="number" step="1" min="0"></Form.Control>
          <Button id="changeButton" variant="primary" onClick={(event) => {
            if (event.target.key === 'Enter') {
              event.preventDefault();
            }
            // disable the button until we're done
            event.target.value = "Changing..."
            event.target.disabled = true
            let newValue = parseInt(document.getElementById("storageAmountInput").value)
            if (newValue >= 0)
              addToSimpleStorage(newValue)
            document.getElementById("storageAmountInput").value = ""
            document.getElementById("changeButton").value = "Change"
            document.getElementById("changeButton").disabled = false
          }}
          >Change
            </Button>
        </Form>
      </div>
      <br></br>
      <div className="d-flex flex-row justify-content-center">
        <EventHistory className="d-flex" events={eventHistory} />
      </div>
    </Container>
  );
}

const EventHistory = (props) => {
  if (props.events === null || props.events === undefined) {
    return < div ></div >
  }
  // let listItems = props.events.map((e) => <li key={e.transactionHash}>Value: {e.newValue} (was {e.oldValue})</li>)
  // return <ol>{listItems}</ol>
  let listItems = props.events.map((e) =>
    <tr key={e.transactionHash}>
      <td>{e.changedBy}</td>
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
              <th className="col-auto">Modified by</th>
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

const Provider = (props) => {
  if (props.network) {
    return (
      <div className="d-flex justify-content-center">
        <small>Connected to network: <code className="text-info">{props.network.name}</code></small>
      </div >
    )
  } else {
    return (<div></div>)
  }
}

const ContractAddress = (props) => {
  if (props.contractInstance) {
    return (
      (props.contractInstance !== undefined && props.contractInstance !== null) ?
        <div className="d-flex justify-content-center">
          <small>Contract address: <code className="text-info">{props.contractInstance.address}</code></small>
        </div>
        :
        <div className="d-flex justify-content-center">
          <small className="text-danger">Contract not deployed</small>
        </div>
    )
  } else {
    return (<div></div>)
  }
}

const Account = (props) => {
  if (props.accounts) {
    return (
      <div className="d-flex justify-content-center">
        <small>Account: <code className="text-info">{props.accounts[0]}</code></small>
      </div >
    )
  } else {
    return (<div></div>)
  }
}

const connect2MetaMask = async (event) => {
  try {
    // Will open the MetaMask UI
    // You should disable this button while the request is pending!
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    event.target.disabled = true
    console.log(accounts)
  } catch (error) {
    console.error(error);
  }
}

const Metamask = (props) => {
  return (
    (typeof props.ethereum != 'undefined' && props.ethereum.isMetaMask) ?
      <div className="d-flex justify-content-center">
        <Button variant="info" onClick={connect2MetaMask}>
          Connect to MetaMask
          </Button>
      </div>
      :
      <div></div>
  )
}

export default App;

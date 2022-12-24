import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import Pic from '../abis/Pic.json'
import { create } from "ipfs-http-client"

const { Buffer } = require('buffer')
const projectId = '2EwXF5EKhKVGyiZPC7UkOQxi8e3';
const projectSecret = 'abba390662d3e7ddb36045310fd0aac0';
const auth =
'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({ 
  host: 'ipfs.infura.io',  
  port: 5001, 
  protocol: 'https',
  headers: { authorization: auth, },

});


class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  constructor(props) {
    super(props);
    this.state = {
      buffer : null,
      picHash : 'sample',
      account : '',
      contract : null
    }
  }
 
  async loadWeb3(){
   if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
}

async loadBlockchainData() {
    //this function loads the current data of the user from the blockchain
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]})

   //loads the pic contract
    // const networkId = await web3.eth.net.getId()
    // const picData = Pic.networks[networkId]
      const pic = new web3.eth.Contract(Pic.abi, "0x1Dd1c89C6E9894AaaF493Ce94853365cf3627891")
      this.setState({contract: pic})
      const picHash = await pic.methods.get().call()
      this.setState({picHash})

}


  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {    
      this.setState({buffer : Buffer(reader.result)})
    }
  }

//example hash: QmeaEomjTNp6KZ5kvBPeiotp548aS2kcpPqB6zP1UJP5Ga
  //example url: https://icommunity.infura-ipfs.io/ipfs/
   onSubmit = async (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    let result = await client.add(this.state.buffer)
      console.log(result)
      const newPicHash = await result.path
      this.setState({ picHash: newPicHash})
      await this.state.contract.methods.set(newPicHash).send({from : this.state.account}).then((receipt)=> {
        this.setState({picHash: newPicHash})
      })}

  


  render() {
    return (
      <div>
        <nav className="text-white navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0" 
            target="_blank"
            rel="noopener noreferrer"
          >
            Picture of the day
          </a>
          <ul className = 'navbar-nav px-3'>
            <li className = 'nav-item text-nowrap d-none d-sm-none d-sm-block'>
              <small className = 'text-white'> {this.state.account} </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  
                  target="_blank"
                  rel="noopener noreferrer"
                >
                <img 
                src={`https://icommunity.infura-ipfs.io/ipfs/${this.state.picHash}`}
                className = "App-logo"
                />

                </a>
                 
                <p>&nbsp;</p>
                <h2> Change Picture </h2>
                <form onSubmit ={this.onSubmit}>
                  <input type ='file' onChange={this.captureFile} />
                  <input type ='submit'/>
                </form>
             
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

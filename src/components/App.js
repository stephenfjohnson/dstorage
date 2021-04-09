import DStorage from '../abis/DStorage.json';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Main from './Main';
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
console.log(ipfs);

const App = () => {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [dstorage, setDStorage] = useState(null);
  const [filesCount, setFilesCount] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileBuffer, setFileBuffer] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileName, setFileName] = useState(null);

  // console.log({ fileBuffer, fileType, fileName });

  useEffect(() => {
    const runFunc = async () => {
      await loadWeb3();
      await loadBlockchainData();
    };
    runFunc();
  }, []);

  // useEffect(() => {
  //   const runFunc = async () => {
  //     for (let i = 0; i < filesCount; i++) {
  //       // for (var i = filesCount; i >= 1; i--) {
  //       const file = await dstorage.methods.files(i).call();
  //       console.log(file);
  //       // console.log(file);
  //       // console.log(files);
  //       setFiles([...files, file]);
  //       // console.log(file);
  //     }
  //   };
  //   runFunc();
  // }, [files]);

  const loadWeb3 = async () => {
    //Setting up Web3
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(`Non Eth browser detected use Meta Mask`);
    }
  };

  const loadBlockchainData = async () => {
    //Declare Web3
    const web3 = window.web3;
    console.log(web3);
    //Load account
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    setAccount(accounts[0]);
    //Network ID
    const networkId = await web3.eth.net.getId();
    const networkData = DStorage.networks[networkId];
    if (networkData) {
      //Assign contract
      const dstorage = new web3.eth.Contract(DStorage.abi, networkData.address);
      setDStorage(dstorage);
      console.log(dstorage);
      //Get files amount
      const filesCount = await dstorage.methods.fileCount().call();
      setFilesCount(filesCount);
      console.log(filesCount);
      //Load files&sort by the newest

      // // for (let i = 0; i < filesCount; i++) {
      for (var i = filesCount; i >= 1; i--) {
        const file = await dstorage.methods.files(i).call();
        //

        // if (accounts[0] === file.uploader) {
        setFiles((files) => [...files, file]);
        // }

        // console.log(file);
        // console.log(files);
        // console.log(file);
      }
    } else {
      window.alert(`DStorage not ditected on your network`);
    }
    console.log(`Loading False`);
    setLoading(false);
    // const balance = await web3.eth.getBalance();
    // console.log(balance);
    //IF got connection, get data from contracts
    //Else
    //alert Error
  };

  // Get file from user
  const captureFile = (event) => {
    console.log(event);
    event.preventDefault();

    const file = event.target.files[0];
    const reader = new window.FileReader();

    console.log(file);

    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setFileBuffer(Buffer(reader.result));
      setFileType(file.type);
      setFileName(file.name);
    };
  };

  //Upload File
  const uploadFile = (description) => {
    console.log(description);
    //Add file to the IPFS
    console.log(`Uploading File to IPFS`);
    ipfs.add(fileBuffer, (error, result) => {
      console.log(`IPFS result ${{ result }}`);
      console.log(result);

      if (error) {
        console.error(error);
        return;
      }

      setLoading(true);

      if (fileType === '') {
        setFileType('none');
      }

      dstorage.methods
        .uploadFile(result[0].hash, result[0].size, fileType, fileName, description)
        .send({ from: account })
        .on('transactionHash', (hash) => {
          console.log(hash);
          setLoading(false);
          setFileType(null);
          setFileName(null);
          window.location.reload();
        })
        .on('error', (e) => {
          window.alert(`Error`);
          console.log(e);
          setLoading(false);
        });
    });
    //Check If error

    //Return error
    //Set state to loading
    //Assign value for the file without extension
    //Call smart contract uploadFile function
  };

  return (
    <>
      <Navbar account={account} />
      {loading ? (
        <div id="loader" className="text-center mt-5">
          <p>Loading...</p>
        </div>
      ) : (
        <Main files={files} account={account} captureFile={captureFile} uploadFile={uploadFile} />
      )}
    </>
  );
};

export default App;

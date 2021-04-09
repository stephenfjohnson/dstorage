import React, { useState } from 'react';
import { convertBytes } from './helpers';
import moment from 'moment';

const Main = ({ captureFile, uploadFile, account, files }) => {
  const [fileDescriptionInput, setFileDescriptionInput] = useState('');

  console.log(files);

  const FileList = (allFiles) => {
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Type</th>
            <th scope="col">Size</th>
            <th scope="col">Date</th>
            <th scope="col">Uploader / View</th>
            <th scope="col">Hash / View / Get</th>
            <th scope="col">Thumbnail</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, key) => {
            console.log(file);

            if (account === file.uploader) {
              return (
                <tr key={key}>
                  <th scope="row">{key + 1}</th>
                  <td>{file.fileName}</td>
                  <td>{file.fileDescription}</td>
                  <td>{file.fileType}</td>
                  <td>{convertBytes(file.fileSize)}</td>
                  <td>{moment.unix(file.uploadTime).format('h:mm:ss A M/D/Y')}</td>
                  <td>
                    <a href={`https://etherscan.io/address/${file.uploader}`} rel="noopener noreferrer" target="_blank">
                      {file.uploader.substring(0, 10)}
                    </a>
                  </td>
                  <td>
                    <a href={`https://ipfs.infura.io/ipfs/${file.fileHash}`} rel="noopener noreferrer" target="_blank">
                      {file.fileHash.substring(0, 10)}
                    </a>
                  </td>
                  <td>
                    <a href={`https://ipfs.infura.io/ipfs/${file.fileHash}`} rel="noopener noreferrer" target="_blank">
                      <img alt={file.fileName} style={{ width: '40px' }} src={`https://ipfs.infura.io/ipfs/${file.fileHash}`} />
                    </a>
                  </td>
                </tr>
              );
            }

            return null;
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1200px' }}>
          <div className="content ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <h2>Add a File to the Blockchain</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(`Run form`);
                uploadFile(fileDescriptionInput);
              }}
            >
              <div className="form-group">
                <label className="form-label" htmlFor="fileDescription">
                  Add a file description
                </label>
                <input className="form-control mb-4" id="fileDescription" type="text" value={fileDescriptionInput} onChange={(e) => setFileDescriptionInput(e.target.value)} placeholder="Description" required />
                <label className="form-label" htmlFor="fileUpload">
                  Upload your file here
                </label>
                <input className="form-control mb-4" onChange={captureFile} id="fileUpload" type="file" />
                <button className="btn-primary btn-block">Upload!</button>
              </div>
            </form>
          </div>
          <div className="content">
            <h2>Your Files</h2>
            <FileList allFiles={files} />
            <h2>All Blockchain Files</h2>
            <FileList allFiles={files} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Main;

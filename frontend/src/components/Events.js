import React from "react";
const { spawn } = require('child_process');

class Events extends React.Component {
  render() {
    function calpy()
    {
      var startTime=document.getElementById("strt").value;
      var endTime=document.getElementById("end").value;
      var desc=document.getElementById("desc").value;
      console.log(startTime);
      console.log(endTime);
      console.log(desc);
      if(startTime==="" || endTime==="" || desc==="")
      {
        alert("Enter complete details");
      }
      else
      {
        var dataToSend;
        // spawn new child process to call the python script
        const python = spawn('python3', ['EventsAdder.py','Hello Buddy', '','python']);
        // collect data from script
        python.stdout.on('data', function (data) {
            console.log('Pipe data from python script ...');
            dataToSend = data.toString();
            // console.log(dataToSend);
        });
        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
        })
      }
    } 
    return (
      <div>
        <div className="header">
          Dassi
        </div>
        <div className="Page">
          <div className="row">
            <label className="col-sm-2 col-form-label">start</label><div className="col-sm-4">
              <input type="datetime-local" name="start" className="form-control startTime" id="strt" required/>
            </div>
            <label className="col-sm-2 col-form-label">end</label><div className="col-sm-4">
              <input type="datetime-local" name="end" className="form-control endTime" id="end" required/>
            </div>
          </div> <br/>
          <div className="form-group row">
            <label for="inputPassword" className="col-sm-2 col-form-label description">Description</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="desc" placeholder="Text"/>
            </div>
          </div>
          <button className="btn btn-primary btn-block eventform"
            onClick={calpy}
          >
            Add
          </button>
        </div>
        </div>
    )
  }
}

export default Events;
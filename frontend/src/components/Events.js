import React from "react";

class Events extends React.Component {
  render() {
    async function calpy()
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
        await fetch(`http://localhost:8080/update`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          p1:desc,
          p2:startTime,
          p3:endTime
        }),
      });
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
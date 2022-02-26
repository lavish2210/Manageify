import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";

class Dashboard extends React.Component {
  componentDidMount() {
    const modle = document.querySelector('.modle');
    const overlay = document.querySelector('.overlay');
    const btnClosemodle = document.querySelector('.close-modle');
    const btnsOpenmodle = document.querySelectorAll('.show-modle');

    const openmodle = function () {
      console.log('button was pressed');
      modle.classList.remove('hidden');
      overlay.classList.remove('hidden');
    };

    const closemodle = function () {
      modle.classList.add('hidden');
      overlay.classList.add('hidden');
    };

    for (let i = 0; i < btnsOpenmodle.length; i++)
      btnsOpenmodle[i].addEventListener('click', openmodle);

    btnClosemodle.addEventListener('click', closemodle);
    overlay.addEventListener('click', closemodle);

    document.addEventListener('keydown', function (e) {
      // console.log(e.key);

      if (e.key === 'Escape' && !modle.classList.contains('hidden')) {
        closemodle();
      }
    });

  }
  render() {

    return (
      <div>
        <div className="header">
          Dassi
          <span className="alignment-right display">
            <button type="button" className="btn btn-dark show-modle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-person-circle"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fill-rule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
            </button>
          </span>
        </div>
        <div className="buttonalignment">
          <button className="btn btn-primary btn-large btn-block button-properties">
            Create TimeTable
          </button>
          <button className="btn btn-primary btn-large btn-block button-properties">
            <Link to="/notes" style={{color:"white"}}>Create Notes</Link>
          </button>
        </div>

        <div className="modle hidden">
          <button className="close-modle">&times;</button>
          <h1>Sign Up with Google</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            rj,breakinsvw foiew jfioew evnwv hwaionview hf ewhuvhiuvnskvir hver husr
            hv r kuvs vewvvhiwrnviwr vir viubrv nrkvhew wvnwrjvnoiwrv
          </p>
        </div>
        <div className="overlay hidden"></div>
      </div>
    )
  };
}

export default Dashboard;

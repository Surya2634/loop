import React from "react";
import { useHistory } from "react-router-dom";
import Logo from "../../images/Loop1.webp";
import HOD from "../../images/hod.webp";
import Vasuki from "../../images/vasuki.webp";
import Nivodhini from "../../images/nivodhini.webp";

import Gokul from "../../images/gokul.webp";
import Dhanush from "../../images/dhanush.webp";
import Dhusandhan from "../../images/dhus.webp";
import Gaju from "../../images/gaju.webp";
import Gobinath from "../../images/gobi.webp";
import Nandha from "../../images/nandha.webp";
import Vasanth from "../../images/vasanth.webp";
import GoBack from "../Reducer/GoBack/GoBack";
import { TeamCard } from "../Reducer/TeamCard/TeamCard";
import "./AboutUs.css";
export const AboutUs = () => {
  const history = useHistory();
  return (
    <div className="container-fluid team-page d-flex flex-column py-3">
      <div className="position-absolute go-back my-3">
        <GoBack onClickHandler={() => history.push("/login")} />
      </div>
      <div className="d-flex align-items-center justify-content-center flex-column my-4">
        <img src={Logo} className="img-fluid my-2" height={100} width={100} />
        <span className="team mt-2">Meet the Team</span>
      </div>
      <div className="d-flex flex-wrap my-4">
        <div className="col-md-3 border-right d-flex flex-column align-items-center justify-content-center">
          <span className="team my-3">Head</span>
          <TeamCard
            src={HOD}
            name="Dr. A. Rajiv Kannan Ph.D.,"
            designation="Prof & Head CSE"
          />
        </div>
        <div className="col-md-3 border-right d-flex flex-column align-items-center justify-content-center">
          <span className="team text-center my-3">GUIDES</span>
          <div className="d-flex flex-wrap align-items-center justify-content-center col-md-12">
            <div className="col-md-12 my-2">
              <TeamCard
                src={Nivodhini}
                name="Mrs. M.K. Nivodhini M.E.,"
                designation="AP CSE"
              />
            </div>
            <div className="col-md-12 my-2">
              <TeamCard
                src={Vasuki}
                name="Mrs. P. Vasuki M.E.,"
                designation="AP CSE"
              />
            </div>
          </div>
        </div>
        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
          <span className="team my-3">DEVELOPERS COMMUNITY</span>
          <div className="col-md-12 d-flex flex-wrap align-items-center justify-content-center">
            <div className="col-md-4 d-flex align-items-center justify-content-center flex-column">
              <TeamCard
                src={Dhusandhan}
                name="Dhusanthan R"
                designation="UI/UX Developer"
              />
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-center flex-column">
              <TeamCard
                src={Dhanush}
                name="Dhanush Karthick S"
                designation="Front End Developer"
              />
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-center flex-column">
              <TeamCard
                src={Gobinath}
                name="Gobinath S"
                designation="Back End Developer"
              />
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-center flex-column">
              <TeamCard
                src={Gaju}
                name="Gajendhiran M"
                designation="UI/UX Developer"
              />
            </div>

            <div className="col-md-4 d-flex align-items-center justify-content-center flex-column">
              <TeamCard
                src={Nandha}
                name="Nandha Kumar B"
                designation="Front End Developer"
              />
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-center flex-column">
              <TeamCard
                src={Vasanth}
                name="Vasanthan P"
                designation="Back End Developer"
              />
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-center flex-column">
              <TeamCard
                src={Gokul}
                name="Gokul S"
                designation="Full Stack Developer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

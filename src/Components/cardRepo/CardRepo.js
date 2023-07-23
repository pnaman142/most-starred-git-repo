import React, { useEffect, useState, useRef } from "react";
import { AiFillStar } from "react-icons/ai";
import { VscIssues } from "react-icons/vsc";
import { Select } from "antd";
import "./cardRepo.css";
import RepoChart from "../repoChart/RepoChart";

const { Option } = Select;

const Cardrepo = ({ repo }) => {
  const [todayDate, setTodayDate] = useState("");
  const [SubmittedOn, setSubmittedOn] = useState("");
  const createdon = repo.created_at.substring(0, 10);
  const [selectedOption, setSelectedOption] = useState(null);
  const cardRef = useRef(null);
  const [showChart, setShowChart] = useState(false);

  function setDate() {
    const date = new Date();
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month =
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth();
    const year = date.getFullYear();
    const today = [year, month, day].join("-");
    setTodayDate(today);
  }

  useEffect(() => {
    setDate();
    if (todayDate) {
      const date1 = new Date(createdon);
      const date2 = new Date(todayDate);
      const differnce_time = date2 - date1;
      setSubmittedOn(differnce_time / (1000 * 3600 * 24));
    }
    return () => {};
  }, [todayDate, createdon]);

  const handleSelectChange = (value) => {
    setSelectedOption(value);
    setShowChart(true);
  };

  const handleBlur = () => {
    setSelectedOption(null);
    setShowChart(false);
  };

  return (
    <div ref={cardRef} className="card_container" onBlur={handleBlur}>
      <img src={repo.owner.avatar_url} className="avatar_pic" alt="avatarpic" />
      <div className="content">
        <h4>
          <a target="_blank" href={repo.html_url} rel="noreferrer">
            {repo.name}{" "}
          </a>
        </h4>
        <h5>
          UserName -{" "}
          <a target="_blank" href={repo.owner.login} rel="noreferrer">
            {repo.owner.login}{" "}
          </a>
        </h5>
        <p>{repo.description}</p>

        <div className="container_moreinfo">
          <div className="container_star_issue">
            <div className="container">
              <AiFillStar /> {repo.stargazers_count}
            </div>
            <div className="container">
              <VscIssues /> {repo.open_issues}
            </div>
          </div>
          <div>Submitted {SubmittedOn} days ago</div>

          <Select
            value={selectedOption}
            style={{ width: 120, marginTop: 10 }}
            onChange={handleSelectChange}
          >
            <Option value={null} disabled>
              Visualize
            </Option>
            <Option value="Commits">Commits</Option>
            <Option value="Additions">Additions</Option>
            <Option value="Deletions">Deletions</Option>
          </Select>
        </div>
      </div>
      {selectedOption && showChart && (
        <RepoChart
          owner={repo.owner.login}
          repo={repo.name}
          selectedOption={selectedOption}
          resetSelectedOption={() => setSelectedOption(null)}
        />
      )}
    </div>
  );
};

export default Cardrepo;

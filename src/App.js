import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Result, Skeleton, Select } from "antd";
import { listReposaction } from "./redux/actions/RepoActions";
import CardRepo from "./Components/cardRepo/CardRepo";

const { Option } = Select;

export default function App() {
  const [selectedDate, setSelectedDate] = useState("last-Month");
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const listRepos = useSelector((state) => state.listRepos);
  const { loading, repos, error } = listRepos;

  const observer = useRef();
  const lastRepoRef = useRef(null);

  useEffect(() => {
    let startDate = "";
    switch (selectedDate) {
      case "last-week":
        const lastWeek = new Date(
          new Date().getTime() - 7 * 24 * 60 * 60 * 1000
        );
        startDate = lastWeek.toISOString().slice(0, 10);
        break;
      case "last-2nd-week":
        const twoWeeksAgo = new Date(
          new Date().getTime() - 14 * 24 * 60 * 60 * 1000
        );
        startDate = twoWeeksAgo.toISOString().slice(0, 10);
        break;
      default:
        const lastMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          1
        );
        startDate = lastMonth.toISOString().slice(0, 10);
        break;
    }
    dispatch(listReposaction(startDate, page));
  }, [dispatch, selectedDate, page]);

  useEffect(() => {
    // Intersection Observer for infinite scrolling
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(handleObserver, options);

    if (lastRepoRef.current) {
      observer.current.observe(lastRepoRef.current);
    }

    return () => {
      observer.current.disconnect();
    };
  }, [repos, loading]);

  // Callback function for Intersection Observer
  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Function to handle the selection change in the dropdown
  function handleTimeFrameChange(value) {
    setSelectedDate(value);
    setPage(1); // Reset page to 1 when the time frame is changed
  }

  return (
    <>
      <nav>
        <h3>Trending Repos</h3>
        <Select
          defaultValue={selectedDate}
          style={{ width: 250 }}
          onChange={handleTimeFrameChange}
        >
          <Option value="last-week">Last Week</Option>
          <Option value="last-2nd-week">Last 2nd Week</Option>
          <Option value="last-month">Last Month</Option>
        </Select>
      </nav>
      <>
        {loading ? (
          <Skeleton active />
        ) : error ? (
          <Result
            status="warning"
            title="We are having a problem making the request."
          />
        ) : (
          <div className="cards">
            {repos.items.map((repo, index) => {
              if (repos.items.length === index + 1) {
                // If last repository, create a ref to observe for infinite scrolling
                return (
                  <div key={index} ref={lastRepoRef}>
                    <CardRepo repo={repo} />
                  </div>
                );
              } else {
                return <CardRepo key={index} repo={repo} />;
              }
            })}
          </div>
        )}
      </>
    </>
  );
}

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";

const RepoChart = ({ owner, repo, selectedOption, resetSelectedOption }) => {
  const [chartData, setChartData] = useState([]);
  const [chartDataForCont, setChartDataForCont] = useState([]);

  useEffect(() => {
    fetchData();
  }, [owner, repo, selectedOption]);

  const fetchData = async () => {
    try {
      if (selectedOption) {
        let url = "";
        if (selectedOption === "Commits") {
          url = `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`;
        } else if (selectedOption === "Additions") {
          url = `https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`;
        } else if (selectedOption === "Deletions") {
          url = `https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`;
        }
        let urlForCont = `https://api.github.com/repos/${owner}/${repo}/stats/contributors`;

        const { data } = await axios.get(url);
        setChartData(data);
        const { data: dataForCont } = await axios.get(urlForCont);
        if (dataForCont && dataForCont.length > 0) {
          const seriesData = dataForCont.map((contributor) => {
            const name = contributor.author.login;
            const weeklyChanges = contributor.weeks.map((week) => {
              const timestamp = week.w * 1000;
              const count =
                selectedOption === "Commits"
                  ? week.c
                  : selectedOption === "Additions"
                  ? week.a
                  : week.d;
              return [timestamp, count];
            });

            return { name, dataForCont: weeklyChanges };
          });

          setChartDataForCont(seriesData);
        } else {
          setChartDataForCont([]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setChartData([]);
      setChartDataForCont([]);
    }
  };

  const getDataByOption = (dataPoint) => {
    if (selectedOption === "Commits") {
      return dataPoint.total;
    } else if (selectedOption === "Additions") {
      return dataPoint[1];
    } else if (selectedOption === "Deletions") {
      return dataPoint[2];
    } else {
      return 0;
    }
  };

  const options = {
    title: {
      text: `Weekly ${selectedOption} Activity for ${repo}`,
    },
    chart: {
      height: 300,
      width: 400,
      type: "line",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Week",
      },
      labels: {
        formatter: function () {
          return Highcharts.dateFormat("%b %d, %Y", this.value);
        },
      },
    },
    yAxis: {
      title: {
        text: "Count",
      },
    },
    series:
      chartData.length > 0
        ? [
            {
              name: `${selectedOption} Count`,
              data: chartData.map((dataPoint) => [
                dataPoint.week * 1000,
                getDataByOption(dataPoint),
              ]),
            },
          ]
        : [],
  };

  const optionsForCont = {
    title: {
      text: `Weekly ${selectedOption} Activity for ${repo}`,
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Week",
      },
      labels: {
        formatter: function () {
          return Highcharts.dateFormat("%b %d, %Y", this.value);
        },
      },
    },
    yAxis: {
      title: {
        text: "Count",
      },
    },
    series: chartDataForCont.length > 0 ? chartDataForCont : [],
  };

  const handleCardBlur = () => {
    resetSelectedOption();
  };

  return (
    <>
      {chartData.length > 0 && (
        <div
          onBlur={handleCardBlur}
          style={{
            marginTop: "5px",
            marginLeft: "80px",
            height: "320px",
            width: "400px",
          }}
        >
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      )}

      {chartDataForCont.length > 0 && (
        <div
          onBlur={handleCardBlur}
          style={{
            marginTop: "5px",
            marginLeft: "80px",
            height: "320px",
            width: "400px",
          }}
        >
          <HighchartsReact highcharts={Highcharts} options={optionsForCont} />
        </div>
      )}

      {chartData.length === 0 && chartDataForCont.length === 0 && (
        <div>No data available for selected option.</div>
      )}
    </>
  );
};

export default RepoChart;

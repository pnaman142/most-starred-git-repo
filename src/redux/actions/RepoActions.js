import {
  REPOS_LIST_FAIL,
  REPOS_LIST_REQUEST,
  REPOS_LIST_SUCCESS,
} from "../repoConstants";
import axios from "axios";
export const listReposaction = (date, page) => async (dispatch) => {
  try {
    console.log(
      `https://api.github.com/search/repositories?q=created:>${date}&sort=stars&order=desc&page=${page}`
    );
    dispatch({ type: REPOS_LIST_REQUEST });

    // Fetching the repos from GitHub API with the specified page
    const { data } = await axios.get(
      `https://api.github.com/search/repositories?q=created:>${date}&sort=stars&order=desc&page=${page}`
    );
    // Setting the payload to data so it will be received by the component
    dispatch({ type: REPOS_LIST_SUCCESS, payload: data });
  } catch (error) {
    // In case the request failed, we are gonna send the error to the component.
    dispatch({
      type: REPOS_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

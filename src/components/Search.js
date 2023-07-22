import React, { useEffect, useState } from "react";

/**
 * Don't touch these imports!
 */
import {
  fetchAllCenturies,
  fetchAllClassifications,
  fetchQueryResults,
} from "../api";

const Search = ({ setIsLoading, setSearchResults }) => {
  // Make sure to destructure setIsLoading and setSearchResults from the props

  //const { setIsLoading, setSearchResults } = props;

  /**
   * We are at the Search component, a child of app. This has a form, so we need to use useState
   * for our controlled inputs:
   */
  /* centuryList, setCenturyList (default should be an empty array, [])*/
  const [centuryList, setCenturyList] = useState([]);
  /* classificationList, setClassificationList (default should be an empty array, [])*/
  const [classificationList, setClassificationList] = useState([]);
  /* queryString, setQueryString (default should be an empty string, '')*/
  const [queryString, setQueryString] = useState("");
  /* century, setCentury (default should be the string 'any')*/
  const [century, setCentury] = useState("any");
  /* classification, setClassification (default should be the string 'any')*/
  const [classification, setClassification] = useState("any");
  /**
   * Inside of useEffect, use Promise.all([]) with fetchAllCenturies and fetchAllClassifications
   *
   * In the .then() callback pass the returned lists to setCenturyList and setClassificationList
   *
   * Make sure to console.error on caught errors from the API methods.
   */
  useEffect(() => {
    try {
      const loadCenturyList = async () => {
        const centuries = await fetchAllCenturies();
        setCenturyList(centuries);
        console.log(centuryList);
      };
      loadCenturyList();

      const loadClassificationList = async () => {
        const classifications = await fetchAllClassifications();
        setClassificationList(classifications);
      };
      loadClassificationList();
    } catch (error) {
      console.error(error);
    }
  }, []);

  /* function to map over century and classification*/
  const CenturyOptions = () => {
    const mapped = centuryList.map((item) => {
      return (
        <option key={item.id} value={item.name}>
          {item.name}
        </option>
      );
    });
    return mapped;
  };

  const ClassificationOptions = () => {
    const mapped = classificationList.map((item) => {
      return (
        <option key={item.id} value={item.name}>
          {item.name}
        </option>
      );
    });
    return mapped;
  };

  /**
   * This is a form element, so we need to bind an onSubmit handler to it which:
   *
   * calls event.preventDefault()
   * calls setIsLoading, set it to true
   *
   * then, in a try/catch/finally block:
   *
   * try to:
   * - get the results from fetchQueryResults({ century, classification, queryString })
   * - pass them to setSearchResults
   *
   * catch: error to console.error
   *
   * finally: call setIsLoading, set it to false
   */
  return (
    <form
      id="search"
      onSubmit={async (event) => {
        // write code here
        event.preventDefault();
        setIsLoading(true);
        try {
          const data = await fetchQueryResults({
            century,
            classification,
            queryString,
          });
          setSearchResults(data);
          console.log(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <fieldset>
        <label htmlFor="keywords">Query</label>
        <input
          id="keywords"
          type="text"
          placeholder="enter keywords..."
          value={/* this should be the query string */ queryString}
          onChange={
            /* this should update the value of the query string */ (event) =>
              setQueryString(event.target.value)
          }
        />
      </fieldset>
      <fieldset>
        <label htmlFor="select-classification">
          Classification{" "}
          <span className="classification-count">
            ({classificationList.length})
          </span>
        </label>
        <select
          name="classification"
          id="select-classification"
          value={/* this should be the classification */ classification}
          onChange={
            /* this should update the value of the classification */ (event) =>
              setClassification(event.target.value)
          }
        >
          <option value="any">Any</option>
          <ClassificationOptions />
          {/* map over the classificationList, return an <option /> */}
        </select>
      </fieldset>
      <fieldset>
        <label htmlFor="select-century">
          Century <span className="century-count">({centuryList.length})</span>
        </label>
        <select
          name="century"
          id="select-century"
          value={/* this should be the century */ century}
          onChange={
            /* this should update the value of the century */ (event) =>
              setCentury(event.target.value)
          }
        >
          <option value="any">Any</option>
          <CenturyOptions />
          {/* map over the centuryList, return an <option /> */}
        </select>
      </fieldset>
      <button>SEARCH</button>
    </form>
  );
};

export default Search;

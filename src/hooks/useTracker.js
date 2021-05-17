import React, { useEffect, useState } from "react";
import axios from "axios";

const API_HOST = "https://corona.lmao.ninja/v2";

const ENDPOINTS = [
  {
    id: "all",
    path: "/all",
    isDefault: true,
  },
  {
    id: "countries",
    path: "/countries",
  },
];

const defaultState = {
  data: null,
  state: "ready",
};

const useTracker = ({ api = "all" }) => {
  const [tracker = {}, updateTracker] = useState(defaultState);

  useEffect(() => {
    updateTracker(tracker);
  }, [tracker]);

  const fetchTracker = React.useCallback(async () => {
    let route = ENDPOINTS.find(({ id } = {}) => id === api);
    let response;

    if (!route) {
      route = ENDPOINTS.find(({ isDefault } = {}) => !!isDefault);
    }

    try {
      updateTracker((prev) => {
        return {
          ...prev,
          state: "loading",
        };
      });
      response = await axios.get(`${API_HOST}${route.path}`);
    } catch (e) {
      updateTracker((prev) => {
        return {
          ...prev,
          state: "error",
          error: e,
        };
      });
      return;
    }

    const { data } = response;

    updateTracker((prev) => {
      return {
        ...prev,
        state: "ready",
        data,
      };
    });
  }, [api]);

  useEffect(() => {
    fetchTracker();
  }, [api, fetchTracker]);

  return {
    fetchTracker,
    ...tracker,
  };
};

export default useTracker;

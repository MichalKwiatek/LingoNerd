import React, { useEffect, useState } from "react";
import styles from "./loader.module.css";
import CircularProgress from "@mui/material/CircularProgress";

function Loader() {
  const [isLoaderShown, setIsLoaderShown] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoaderShown(true);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return <div className="loader">{isLoaderShown && <CircularProgress />}</div>;
}

export default Loader;

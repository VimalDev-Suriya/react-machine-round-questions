import { useRef, useState } from 'react';

const AbortApiCalls = () => {
  const [data, setData] = useState([]);
  const abortRef = useRef();

  const fetchApi = async (controller) => {
    // If API takes more than 5sec, then automatically this abort will be called
    const timerRef = setTimeout(() => {
      controller.abort();
    }, 5000);

    try {
      const rawdata = await fetch(`https://dummyjson.com/quotes`, {
        signal: controller.signal,
      });
      const data = await rawdata.json();

      clearTimeout(timerRef);

      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleButtonClick = () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    abortRef.current = new AbortController();

    fetchApi(abortRef.current);
  };

  return (
    <div>
      <p>
        Old API calls will be aborted if the fetch button was called multiple
        times
      </p>
      <p>Open Network tab to view</p>
      <button onClick={handleButtonClick}>Fetch API</button>

      {data.length !== 0 && <div>Data loaded successfully</div>}
    </div>
  );
};

export default AbortApiCalls;

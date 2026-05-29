import { useEffect, useRef, useState } from 'react';
import { useThrottle } from '../../hooks/useThrottle';

// * Using throtlle in this scenario is only for learning about thritlle, but in Realtime we should be using Mutation oberver
const InfiniteScroll = () => {
  const [data, setData] = useState({
    loading: false,
    values: [],
    error: null,
  });
  const currentPageRef = useRef(1);

  const getData = async (page) => {
    setData((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      const rawdata = await fetch(
        `https://picsum.photos/v2/list?page=${page}&limit=10`,
      );

      const result = await rawdata.json();

      setData((prev) => ({
        ...prev,
        loading: false,
        values: [...prev.values, ...result],
      }));
    } catch (error) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error,
      }));
    }
  };

  const handleScroll = useThrottle(() => {
    const documentHeight = document.documentElement.scrollHeight;
    const currentHeight =
      window.innerHeight + document.documentElement.scrollTop;

    if (currentHeight + 200 >= documentHeight && !data.loading) {
      currentPageRef.current += 1;
      getData(currentPageRef.current);
    }
  }, 3000);

  useEffect(() => {
    getData(currentPageRef.current);

    document.addEventListener('scroll', handleScroll);

    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <h1>Infinite Scrolling</h1>
      <p>Using Throttling</p>

      {data.loading && <div>Loading ....</div>}
      {data.values.length === 0 ? (
        <div>No Data to show</div>
      ) : (
        <div className="wrapper">
          {data.values.map((item) => {
            return (
              <div key={item.id} className="card">
                <img srcSet={item.download_url} width="300px" height="300px" />
                <p>{item.author}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;

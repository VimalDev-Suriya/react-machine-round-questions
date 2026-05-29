import { useEffect, useRef, useState } from 'react';

// * Using throtlle in this scenario is only for learning about thritlle, but in Realtime we should be using Mutation oberver
const InfiniteScrollV2 = () => {
  const [data, setData] = useState({
    loading: false,
    values: [],
    error: null,
  });
  const currentPageRef = useRef(0);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        if (entries[0].isIntersecting) {
          currentPageRef.current += 1;
          getData(currentPageRef.current);
        }
      },
      {
        threshold: 0.1, // Visibility in %, even 10%, triggers the cb
      },
    );

    observer.observe(document.getElementById('trigger'));

    return () => observer.unobserve(document.getElementById('trigger'));
  }, []);

  return (
    <div>
      <h1>Infinite Scrolling</h1>
      <p>Using Throttling</p>

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

      <div id="trigger"></div>
      {data.loading && <div>Loading ....</div>}
    </div>
  );
};

export default InfiniteScrollV2;

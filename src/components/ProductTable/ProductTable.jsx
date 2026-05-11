import { Fragment, useEffect, useMemo, useState } from 'react';
import { ProductService } from '../../services/ProductService';

const rowsPerPage = 3;

const ProductTable = () => {
  const [products, setProducts] = useState({
    loading: false,
    data: [],
    error: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState([]); // [{key, dir}]

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return products.data.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, products]);

  const sortedProducts = useMemo(() => {
    let clonedProducts = [...paginatedProducts];

    if (sortConfig.length > 0) {
      clonedProducts.sort((a, b) => {
        for (let { key, direction } of sortConfig) {
          if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
          if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        }

        return 0;
      });
    }

    return clonedProducts;
  }, [sortConfig, paginatedProducts]);

  const totalPages = Math.ceil(products.data.length / rowsPerPage);

  useEffect(() => {
    if (!products.data || !products.data.length) {
      const getProducts = async () => {
        try {
          setProducts((prev) => ({
            ...prev,
            loading: true,
          }));

          const data = await new ProductService().getProducts();

          setProducts((prev) => ({
            ...prev,
            data,
          }));
        } catch (error) {
          setProducts((prev) => ({
            ...prev,
            error: error,
          }));
        } finally {
          setProducts((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      };

      getProducts();
    }
  }, [products.data]);

  const handleSort = (key) => {
    let direction = 'asc';
    const existing = sortConfig.find((s) => s.key === key);
    if (existing && existing.direction === 'asc') direction = 'desc';
    setSortConfig((prev) => {
      const except = prev.filter((p) => p.key !== key);
      return [...except, { key, direction }];
    });
  };

  if (products.loading) {
    return <div>Loading...</div>;
  }

  if (products.error) {
    return <div>Something went wrong....</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('title')}>Title</th>
            <th>Descripton</th>
            <th onClick={() => handleSort('price')}>Price</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product) => {
            const { title, description, price } = product;

            return (
              <tr key={title}>
                <td>{title}</td>
                <td>{description}</td>
                <td>{price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
      >
        Prev
      </button>
      <p>
        current page{currentPage} /{totalPages}
      </p>
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default ProductTable;

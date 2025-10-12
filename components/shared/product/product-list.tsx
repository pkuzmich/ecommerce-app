type ProductListProps = {
  data: Product[];
  title?: string;
  limit?: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

const ProductList = ({ data, title, limit = 4 }: ProductListProps) => {
  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {limitedData.map((product) => (
            <div key={product.id}>
              <h4>{product.name}</h4>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductList;

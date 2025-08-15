interface ProductInfoProps {
  name: string;
  description: string;
  price: number;
}

const ProductInfo = ({ name, description, price }: ProductInfoProps) => (
  <div className="flex flex-col mb-8">
    <h2 className="text-4xl font-bold text-gray-800 mb-4">{name}</h2>
    <p className="text-lg text-gray-600 mb-8">{description}</p>
    <p className="text-indigo-700 font-semibold text-3xl">₹{price}</p>
  </div>
);

export default ProductInfo;
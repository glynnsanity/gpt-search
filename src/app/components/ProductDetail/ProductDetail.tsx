
export interface ProductAnswerType {
  text: string;
  title: string;
  image: string | null;
  price: number;
  tags?: string[];
  productUrl?: string;
}

interface ProductDetailProps extends ProductAnswerType {}

export const ProductDetail = ({
  image,
  title,
  price,
  text,
  tags,
  productUrl
}: ProductDetailProps) => {
  return (
    <div className="mt-6">
      <img
        src={image || "/placeholder.jpg"}
        alt={title}
        className="w-full h-auto rounded-md"
      />
      <div className="font-bold text-2xl text-gray-800 mt-4">{title}</div>
      <div className="mt-2 text-xl font-semibold">${(price / 100).toFixed(2)}</div>
      <div className="text-gray-700 mt-2">{text}</div>
      {tags && tags.length > 0 && (
        <div className="mt-2 flex space-x-2">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      )}
      {productUrl && (
        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Buy Now
        </a>
      )}
    </div>
  );
};
import React from "react";
import styles from "./answer.module.css";
import DOMPurify from 'dompurify';

interface ProductResultProps {
  descriptionHtml: string;
  title: string;
  image: string;
  price: number;
}

export const ProductResult: React.FC<ProductResultProps> = ({ descriptionHtml, title, image, price }) => {
  // Sanitize the HTML content
  const sanitizedHtml = DOMPurify.sanitize(descriptionHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });

  return (
    <div className="flex items-start space-x-4">
      <img src={image} alt={title} className={styles.productImage} />
      <div>
        <h3 className="font-bold text-xl">{title}</h3>
        <div className="text-green-600 font-semibold mb-2">${(price / 100).toFixed(2)}</div>
        <div 
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
          className="prose prose-sm max-w-none"
        />
      </div>
    </div>
  );
};

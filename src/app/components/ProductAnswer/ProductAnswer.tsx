import React, { useEffect, useState } from "react";
import styles from "./answer.module.css";

interface ProductAnswerProps {
  text: string;
  title: string;
  image: string;
  price: number;
}

export const ProductAnswer: React.FC<ProductAnswerProps> = ({ text, title, image, price }) => {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    setWords(text.split(" "));
  }, [text]);

  return (
    <div className="flex items-start space-x-4">
      <img src={image} alt={title} className={styles.productImage} />
      <div>
        <h3 className="font-bold text-xl">{title}</h3>
        <div className="text-green-600 font-semibold mb-2">${(price / 100).toFixed(2)}</div>
        <p>
          {words.map((word, index) => (
            <span
              key={index}
              className={styles.fadeIn}
              style={{ animationDelay: `${index * 0.01}s` }}
            >
              {word}{" "}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

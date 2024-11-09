import { Github, Twitter } from "lucide-react"; // Lucide icons
import { FC } from "react";

export const Footer: FC = () => {
  return (
    <div className="flex h-[50px] border-t border-gray-300 py-2 px-8 items-center sm:justify-between justify-center">
      <div className="hidden sm:flex italic text-sm">
        Powered by
        <a
          className="hover:opacity-50 mx-1"
          href="https://madetrade.com"
          target="_blank"
          rel="noreferrer"
        >
          MadeTrade
        </a>
        – ethical and sustainable products for every lifestyle.
      </div>

      <div className="flex space-x-4">
        <a
          className="flex items-center hover:opacity-50"
          href="https://twitter.com/madetrade"
          target="_blank"
          rel="noreferrer"
        >
          <Twitter size={24} />
        </a>

        <a
          className="flex items-center hover:opacity-50"
          href="https://github.com/your-github-repo" // Update this to your project's GitHub repository
          target="_blank"
          rel="noreferrer"
        >
          <Github size={24} />
        </a>
      </div>
    </div>
  );
};

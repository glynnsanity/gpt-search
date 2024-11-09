import { Dispatch, SetStateAction } from 'react';

interface SettingsProps {
  apiKey: string;
  setApiKey: Dispatch<SetStateAction<string>>;
  matchCount: number;
  setMatchCount: Dispatch<SetStateAction<number>>;
  mode: "search" | "chat";
  setMode: Dispatch<SetStateAction<"search" | "chat">>;
  onSave: () => void;
  onClear: () => void;
}

export const Settings = ({
  apiKey,
  setApiKey,
  matchCount,
  setMatchCount,
  mode,
  setMode,
  onSave,
  onClear
}: SettingsProps) => {
  return (
    <div className="mt-4">
      <div>
        <label className="block">API Key:</label>
        <input 
          type="text" 
          value={apiKey} 
          onChange={(e) => setApiKey(e.target.value)} 
          className="border border-gray-300 rounded p-2"
        />
      </div>
      <button 
        onClick={onSave} 
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
      <button 
        onClick={onClear} 
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
      >
        Clear
      </button>
    </div>
  );
};
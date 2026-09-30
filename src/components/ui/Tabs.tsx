import React from "react";

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex border-b border-gray-100 mb-7 gap-2 relative">
      {tabs.map(t => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            className={`relative px-6 py-3 text-sm font-semibold cursor-pointer transition-all duration-200 outline-none select-none border-b-[3px] ${
              isActive ? "text-primary border-primary" : "text-muted border-transparent hover:text-darkbg"
            }`}
            onClick={() => onChange(t.id)}
            type="button"
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;

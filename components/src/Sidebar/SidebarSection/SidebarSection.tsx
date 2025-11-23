import { useState } from "react";

export interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarSection = ({ title, children }: SidebarSectionProps) => {
  const [sectionOpen, setSectionOpen] = useState(true);
  const toggleSection = () => {
    setSectionOpen(!sectionOpen);
  };
  return (
    <div className="mb-4">
      <div className="cursor-pointer" onClick={() => toggleSection()}>
        <h3 className="text-lg font-semibold text-white mb-2 border-b border-gray-700 pb-2">
          {title}
        </h3>
      </div>
      {sectionOpen && <div className="space-y-2">{children}</div>}
    </div>
  );
};

export default SidebarSection;

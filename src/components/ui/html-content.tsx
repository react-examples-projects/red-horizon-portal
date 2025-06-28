import React from "react";

interface HtmlContentProps {
  content: string;
  className?: string;
}

export const HtmlContent: React.FC<HtmlContentProps> = ({ content, className = "" }) => {
  return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default HtmlContent;

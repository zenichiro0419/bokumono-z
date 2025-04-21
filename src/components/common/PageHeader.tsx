
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  backTo: string;
  backLabel?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  backTo,
  backLabel = "戻る",
  actions,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Link to={backTo}>
        <Button variant="outline" size="sm">
          {backLabel}
        </Button>
      </Link>
      {actions && <div className="flex space-x-3">{actions}</div>}
    </div>
  );
};

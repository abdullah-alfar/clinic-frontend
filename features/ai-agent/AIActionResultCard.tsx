"use client";

import React from "react";
import { CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIActionResultCardProps {
  message: string;
  resultData?: any;
  onDismiss: () => void;
}

export function AIActionResultCard({ message, resultData, onDismiss }: AIActionResultCardProps) {
  return (
    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4 my-2 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
        <CheckCircle className="w-5 h-5" />
        <span>Action Successful</span>
      </div>
      
      <p className="text-sm text-green-800 dark:text-green-300">
        {message}
      </p>

      {/* Dynamic Link generation based on result message/data could go here */}
      {/* For now, just a generic "View Details" if applicable or just Dismiss */}
      
      <div className="flex justify-end mt-2">
        <Button variant="outline" size="sm" onClick={onDismiss} className="text-green-700 border-green-300 hover:bg-green-100 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900">
          Dismiss
        </Button>
      </div>
    </div>
  );
}

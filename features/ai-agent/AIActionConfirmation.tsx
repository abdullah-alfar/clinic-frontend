"use client";

import React, { useState } from "react";
import { AlertCircle, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PendingAction {
  token: string;
  type: string;
  payload: any;
  summary: string;
}

interface AIActionConfirmationProps {
  action: PendingAction;
  onConfirm: (token: string) => Promise<void>;
  onCancel: () => void;
}

export function AIActionConfirmation({ action, onConfirm, onCancel }: AIActionConfirmationProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(action.token);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4 my-2 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500 font-medium">
        <AlertCircle className="w-5 h-5" />
        <span>Confirmation Required</span>
      </div>
      
      <div className="text-sm text-amber-900 dark:text-amber-200 space-y-2">
        <p className="font-semibold">{action.summary}</p>
        <div className="bg-white/50 dark:bg-black/20 p-2 rounded text-xs font-mono break-all max-h-32 overflow-y-auto">
          {JSON.stringify(action.payload, null, 2)}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={loading} className="text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900">
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
        <Button variant="default" size="sm" onClick={handleConfirm} disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-600">
          {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
          Confirm Action
        </Button>
      </div>
    </div>
  );
}

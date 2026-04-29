"use client";

import React, { useState } from "react";
import { BotMessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClinicAIAssistant } from "./ClinicAIAssistant";

export function AIAgentLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen ? (
        <ClinicAIAssistant onClose={() => setIsOpen(false)} />
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl flex items-center justify-center p-0 z-50 bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-transform"
        >
          <BotMessageSquare className="w-6 h-6" />
        </Button>
      )}
    </>
  );
}

"use client";

import ChatInterface from "@/components/ChatInterface";
import DocumentUpload from "@/components/DocumentUpload";
import { useState } from "react";
import { MessageSquare, FileText, Sparkles } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"chat" | "upload">("chat");

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="h-3 w-3" /> New: BNS Support
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
          Your Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">Legal Companion</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Navigate Indian Law with confidence. Get instant answers from IPC, BNS, and Supreme Court judgments using advanced AI.
        </p>
      </div>

      {/* Feature Tabs */}
      <div className="w-full">
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-slate-200/50 rounded-xl">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === "chat"
                  ? "bg-white text-blue-900 shadow-sm scale-100"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                }`}
            >
              <MessageSquare className="h-4 w-4" />
              Legal Chat
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === "upload"
                  ? "bg-white text-blue-900 shadow-sm scale-100"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                }`}
            >
              <FileText className="h-4 w-4" />
              Summarize Docs
            </button>
          </div>
        </div>

        <div className="transition-all duration-500 ease-in-out">
          {activeTab === "chat" && (
            <div className="animate-in-up">
              <ChatInterface />
            </div>
          )}
          {activeTab === "upload" && (
            <div className="max-w-2xl mx-auto animate-in-up">
              <DocumentUpload />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

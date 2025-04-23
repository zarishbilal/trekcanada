"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function AIInsights({ trail, reviews }) {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        setLoading(true);
        const response = await fetch("/api/ai/insights", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trail, reviews }),
        });
        if (!response.ok) {
          throw new Error(`Failed to get insights: ${response.statusText}`);
        }
        const data = await response.json();
        setInsights(data.insights || "");
      } catch (err) {
        console.error("Error fetching AI insights:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, [trail, reviews]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
      {loading && <p className="text-gray-600">Generating insights...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <div className="prose max-w-none text-gray-700">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-xl font-semibold mt-4 mb-2" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-semibold mt-3 mb-1" {...props} />
              ),
              p: ({ node, ...props }) => <p className="mb-2" {...props} />,
              ul: ({ node, ...props }) => (
                <ul className="list-disc ml-6 mb-2" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal ml-6 mb-2" {...props} />
              ),
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              strong: ({ node, ...props }) => (
                <strong className="font-semibold" {...props} />
              ),
            }}
          >
            {insights}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

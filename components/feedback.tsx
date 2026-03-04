"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import posthog from "posthog-js";

export function Feedback() {
  const [isVisible, setIsVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    accurateInfo: false,
    solvedMyProblem: false,
    easyToUnderstand: false,
    somethingElse: false,
    inaccurate: false,
    couldntFind: false,
    difficultToUnderstand: false,
    codeSampleError: false,
    other: false,
    comments: "",
    email: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleYes = () => {
    posthog.capture("docs-feedback", { helpful: true });
    setIsHelpful(true);
    setShowForm(true);
  };

  const handleNo = () => {
    posthog.capture("docs-feedback", { helpful: false });
    setIsHelpful(false);
    setShowForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.email) {
      posthog.identify(formData.email);
    }

    posthog.capture("docs-feedback", {
      helpful: isHelpful,
      details: formData,
    });

    // If negative feedback, create GitHub issue
    if (!isHelpful) {
      const pageUrl = window.location.href;
      const pageTitle = document.title;

      // Build issue body
      const issues: string[] = [];
      if (formData.inaccurate) issues.push("Inaccurate");
      if (formData.couldntFind) issues.push("Couldn't find what I was looking for");
      if (formData.difficultToUnderstand) issues.push("Difficult to understand");
      if (formData.codeSampleError) issues.push("Code sample error");
      if (formData.other) issues.push("Other");

      const issueBody = `**Page:** ${pageUrl}

**What went wrong:**
${issues.map((issue) => `- ${issue}`).join("\n")}

**How can we improve this page:**
${formData.comments || "No additional comments provided"}`;

      const issueTitle = `Feedback: ${pageTitle}`;

      // Construct GitHub issue URL
      const githubUrl = new URL("https://github.com/authzed/docs/issues/new");
      githubUrl.searchParams.set("title", issueTitle);
      githubUrl.searchParams.set("body", issueBody);
      githubUrl.searchParams.set("labels", "suggestion/requested");

      // Open in new tab
      window.open(githubUrl.toString(), "_blank");
    }

    setShowForm(false);
    setShowThankYou(true);
  };

  const handleDismiss = () => {
    setShowForm(false);
    setShowThankYou(true);
  };

  if (showThankYou) {
    return (
      <div
        className={`border-t border-neutral-200 dark:border-neutral-800 py-8 transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
          Thank you for your feedback!
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div
        className={`border-t border-neutral-200 dark:border-neutral-800 py-8 transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <div className="text-sm mb-3 font-semibold text-gray-900 dark:text-gray-100">
              {isHelpful ? "What did you find helpful?" : "What went wrong?"}
            </div>
            <div className="space-y-2">
              {isHelpful ? (
                <>
                  <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accurateInfo}
                      onChange={(e) => setFormData({ ...formData, accurateInfo: e.target.checked })}
                      className="cursor-pointer"
                    />
                    Accurate info
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.solvedMyProblem}
                      onChange={(e) =>
                        setFormData({ ...formData, solvedMyProblem: e.target.checked })
                      }
                      className="cursor-pointer"
                    />
                    Solved my problem
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.easyToUnderstand}
                      onChange={(e) =>
                        setFormData({ ...formData, easyToUnderstand: e.target.checked })
                      }
                      className="cursor-pointer"
                    />
                    Easy to understand
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.somethingElse}
                      onChange={(e) =>
                        setFormData({ ...formData, somethingElse: e.target.checked })
                      }
                      className="cursor-pointer"
                    />
                    Something else
                  </label>
                </>
              ) : (
                <>
                  <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.inaccurate}
                      onChange={(e) => setFormData({ ...formData, inaccurate: e.target.checked })}
                      className="cursor-pointer"
                    />
                    Inaccurate
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.couldntFind}
                      onChange={(e) => setFormData({ ...formData, couldntFind: e.target.checked })}
                      className="cursor-pointer"
                    />
                    Couldn&apos;t find what I was looking for
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.difficultToUnderstand}
                      onChange={(e) =>
                        setFormData({ ...formData, difficultToUnderstand: e.target.checked })
                      }
                      className="cursor-pointer"
                    />
                    Difficult to understand
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.codeSampleError}
                      onChange={(e) =>
                        setFormData({ ...formData, codeSampleError: e.target.checked })
                      }
                      className="cursor-pointer"
                    />
                    Code sample error
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.other}
                      onChange={(e) => setFormData({ ...formData, other: e.target.checked })}
                      className="cursor-pointer"
                    />
                    Other
                  </label>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-2 text-gray-900 dark:text-gray-100">
              {isHelpful ? "Comments" : "How can we improve this page?"}
            </label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              placeholder={
                isHelpful ? "Tell us more about your experience" : "Share your suggestions..."
              }
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1 text-gray-900 dark:text-gray-100">
              Email <span className="font-normal text-gray-400 dark:text-gray-500">(optional)</span>
            </label>
            {!isHelpful && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                We&apos;ll notify you when changes are made in response to your feedback.
              </p>
            )}
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
            />
          </div>

          <div className={`flex gap-2 ${!isHelpful ? "flex-col" : ""}`}>
            <button
              type="submit"
              className={`flex ${isHelpful ? "flex-1" : ""} items-center justify-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200`}
            >
              {!isHelpful && <FontAwesomeIcon className="h-4 w-4" icon={faGithub} />}
              {isHelpful ? "Submit" : "Create Issue"}
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`border-t border-neutral-200 dark:border-neutral-800 py-8 transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="text-sm mb-4 font-semibold text-gray-900 dark:text-gray-100">
        Was this page helpful?
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleYes}
          className="flex flex-1 items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <FontAwesomeIcon className="h-4 w-4 mr-2" icon={faThumbsUp} />
          Yes
        </button>
        <button
          onClick={handleNo}
          className="flex flex-1 items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          No
          <FontAwesomeIcon className="h-4 w-4 ml-2" icon={faThumbsDown} />
        </button>
      </div>
    </div>
  );
}

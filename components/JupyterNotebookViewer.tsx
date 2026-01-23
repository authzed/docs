import React from "react";

interface JupyterNotebookViewerProps {
  fileUrl: string;
}

const JupyterNotebookViewer: React.FC<JupyterNotebookViewerProps> = ({ fileUrl }) => {
  const nbviewerUrl = `https://nbviewer.org/github/${encodeURIComponent(fileUrl)}`;

  return (
    <div className="p-4">
      <iframe src={nbviewerUrl} width="100%" height="800px" style={{ border: "none" }} />
    </div>
  );
};

export default JupyterNotebookViewer;

import React from 'react';

const HowItWorksPage: React.FC = () => {
  return (
    <div>
      <h1>How It Works</h1>
      <h2>Summarize PDF</h2>
      <ol>
        <li>Navigate to the Summarize page.</li>
        <li>Click the "Upload PDF" button to select the PDF file you want to summarize.</li>
        <li>Wait for the PDF to upload and be processed.</li>
        <li>A summary of the PDF content will be displayed on the page.</li>
      </ol>

      <h2>Merge PDFs</h2>
      <ol>
        <li>Navigate to the Merge page.</li>
        <li>Click the "Upload PDFs" button to select the PDF files you want to merge. You can select multiple files.</li>
        <li>Arrange the uploaded PDFs in the desired order by dragging and dropping them.</li>
        <li>Click the "Merge PDFs" button to combine the files.</li>
        <li>Download the merged PDF file.</li>
      </ol>

      <h2>Split PDF</h2>
      <ol>
        <li>Navigate to the Split page.</li>
        <li>Click the "Upload PDF" button to select the PDF file you want to split.</li>
        <li>Choose how you want to split the PDF (e.g., by page range, by individual pages).</li>
        <li>Specify the desired pages or ranges.</li>
        <li>Click the "Split PDF" button.</li>
        <li>Download the resulting split PDF file(s).</li>
      </ol>

      <h2>Compare PDFs</h2>
      <ol>
        <li>Navigate to the Compare page.</li>
        <li>Click the "Upload PDF" buttons to select the two PDF files you want to compare.</li>
        <li>The tool will highlight the differences between the two documents.</li>
      </ol>
    </div>
  );
};

export default HowItWorksPage;
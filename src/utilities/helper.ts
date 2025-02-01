export const generateAIResponseText = (
  options: any,
  refinement: any,
  summary: any,
  sentiment: any,
  selected: any,
) => {
  let { refine, summ, sentim } = options;
  let r = "";
  if (refinement.length > 0) {
    r = filterObjectsWithFileName(refinement, selected);
    refine = formatUnstructuredTextToHTML(r[selected]);
  }

  if (sentiment.length > 0) {
    const st = filterObjectsWithFileName(sentiment, selected);
    sentim = formatUnstructuredTextToHTML(st[selected]);
  }

  if (summary.length > 0) {
    const s = filterObjectsWithFileName(summary, selected);
    summ = formatUnstructuredTextToHTML(s[selected]);
  }
  options = {refine, summ, sentim, rawRefinement: r[selected]};
  return options;
};

export function filterObjectsWithFileName(arr, fileName) {
  return arr.filter((obj) => obj.hasOwnProperty(fileName))[0];
}

export function formatUnstructuredTextToHTML(text) {
  // Basic Styles
  const styles = `
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background: 'transparent'; color: #333333; }
          .survey-container { max-width: 600px; margin: auto; background: 'transparent'; padding: 2px; }
          h2, h3 { color: #333333; }
          .question { font-weight: bold; margin-top: 15px; }
          .options { margin: 10px 0; }
          .option-label { display: block; padding: 5px; cursor: pointer; }
          .comment-box { width: 100%; height: 80px; border: 1px solid #ccc; padding: 5px; border-radius: 5px; }
          .thank-you { font-weight: bold; color: #28a745; text-align: center; margin-top: 20px; }
      </style>
  `;

  // Split text into paragraphs
  const paragraphs = text.split(/\n\s*\n/);

  let htmlContent = `<div class="survey-container">`;

  paragraphs.forEach((para, index) => {
    const trimmedPara = para.trim();

    // Detect Headings (General Keywords)
    if (
      /thank you|customer satisfaction|survey|feedback|experience|evaluation/i.test(
        trimmedPara,
      )
    ) {
      htmlContent += `<h2>${trimmedPara}</h2>`;
    }
    // Detect Questions (Sentences ending in ? or containing key phrases)
    else if (
      /\?$|how|what|why|do you|did you|rate|please respond/i.test(trimmedPara)
    ) {
      htmlContent += `<div class="question">${trimmedPara}</div>`;
    }
    // Detect Yes/No Response
    else if (
      /yes|no/i.test(trimmedPara) &&
      /\byes\b.*?\bno\b/i.test(trimmedPara)
    ) {
      htmlContent += `
              <div class="options">
                  <label class="option-label"><input type="radio" name="yes-no-${index}" value="Yes"> Yes</label>
                  <label class="option-label"><input type="radio" name="yes-no-${index}" value="No"> No</label>
              </div>
          `;
    }
    // Detect Rating Scales (Common Patterns)
    else if (
      /\b[1-5]\b/.test(trimmedPara) &&
      /\b[1-5]\b.*?\b[1-5]\b/.test(trimmedPara)
    ) {
      const options = [1, 2, 3, 4, 5]
        .map(
          (num) =>
            `<label class="option-label"><input type="radio" name="rating-${index}" value="${num}"> ${num}</label>`,
        )
        .join("");
      htmlContent += `<div class="options">${options}</div>`;
    }
    // Detect Additional Comments Section
    else if (/comments|suggestions|share your thoughts/i.test(trimmedPara)) {
      htmlContent += `<textarea class="comment-box" placeholder="Enter your comments here..."></textarea>`;
    }
    // Standard Paragraphs
    else {
      htmlContent += `<p>${trimmedPara}</p>`;
    }
  });

  htmlContent += `<div class="thank-you">Thank you for your feedback!</div>`;
  htmlContent += `</div>`;

  return styles + htmlContent;
}

export function buildSurvey(text) {
  const startKeyword = "DOCTYPE html>\n";
  const endKeyword = "```";

  const startIndex = text.indexOf(startKeyword);
  const endIndex = text.indexOf(endKeyword);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return ""; // Return entire text if keywords are not found or in wrong order
  }

  const middleText = text
    .substring(startIndex + startKeyword.length, endIndex)
    .trim();

  const data = [middleText].filter(Boolean);
  try {
    return formatUnstructuredTextToHTML(data[0]);
  } catch {
    return null;
  }
}

export const log = (type) => console.log.bind(console, type);

export const generateAIResponseText = (
  options: any,
  refinement: any,
  summary: any,
  sentiment: any,
  actionPlan: any,
  generalAIResponse: any,
  selected: any,
) => {
  let { refine, summ, sentim, action, general } = options;
  let s = "",
    st = "",
    a = "",
    r = "",
    g = "";
  if (generalAIResponse.length > 0) {
    const obj = filterObjectsWithFileName(generalAIResponse, selected);
    const key = Object.keys(obj)[0];
    general = formatUnstructuredTextToHTML(obj[key]);
    g = obj;
  }

  if (refinement.length > 0) {
    const obj = filterObjectsWithFileName(refinement, selected);
    const key = Object.keys(obj)[0];
    refine = formatUnstructuredTextToHTML(obj[key]);
    r = obj;
  }

  if (sentiment.length > 0) {
    const obj = filterObjectsWithFileName(sentiment, selected);
    const key = Object.keys(obj)[0];
    sentim = formatUnstructuredTextToHTML(obj[key]);
    st = obj;
  }

  if (summary.length > 0) {
    const obj = filterObjectsWithFileName(summary, selected);
    const key = Object.keys(obj)[0];
    summ = formatUnstructuredTextToHTML(obj[key]);
    s = obj;
  }

  if (actionPlan.length > 0) {
    const obj = filterObjectsWithFileName(actionPlan, selected);
    const key = Object.keys(obj)[0];
    action = formatUnstructuredTextToHTML(obj[key]);
    a = obj;
  }
  options = {
    refine,
    summ,
    sentim,
    action,
    general,
    rawRefinement: r[selected],
    rawSummary: s[selected],
    rawSentiment: st[selected],
    rawActionPlan: a[selected],
    rawAIQuery: g[selected],
  };
  return options;
};

export function filterObjectsWithFileName(arr, fileName) {
  return arr.filter((obj) => obj.hasOwnProperty(fileName))[0];
}

export function formatUnstructuredTextToHTML(text) {
  const styles = `
      <style>
          .container {
              max-width: 100%;
              margin: auto;
              padding: 2px;
              font-size: 16px;
          }
          h2, h3 {
              color: #333;
              margin-bottom: 10px;
          }
          .question {
              font-weight: bold;
              margin-top: 15px;
          }
          .options {
              margin: 10px 0;
          }
          .option-label {
              display: block;
              padding: 5px;
              cursor: pointer;
          }
          .comment-box {
              width: 100%;
              height: 80px;
              border: 1px solid #ccc;
              padding: 5px;
              border-radius: 5px;
          }
          .thank-you {
              font-weight: bold;
              color: #28a745;
              text-align: center;
              margin-top: 20px;
          }
      </style>
  `;

  const paragraphs = text.split(/\n\s*\n/);
  let htmlContent = `<div class="container">`;

  paragraphs.forEach((para, index) => {
    const trimmedPara = para.trim();

    if (
      /thank you|customer satisfaction|survey|feedback|experience|evaluation/i.test(
        trimmedPara,
      )
    ) {
      htmlContent += `<p>${trimmedPara}</p>`;
    } else if (
      /\?$|how|what|why|do you|did you|rate|please respond/i.test(trimmedPara)
    ) {
      htmlContent += `<div class="question">${trimmedPara}</div>`;
    } else if (
      /yes|no/i.test(trimmedPara) &&
      /\byes\b.*?\bno\b/i.test(trimmedPara)
    ) {
      htmlContent += `
              <div class="options">
                  <label class="option-label"><input type="radio" name="yes-no-${index}" value="Yes"> Yes</label>
                  <label class="option-label"><input type="radio" name="yes-no-${index}" value="No"> No</label>
              </div>
          `;
    } else if (
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
    } else if (/comments|suggestions|share your thoughts/i.test(trimmedPara)) {
      htmlContent += `<textarea class="comment-box" placeholder="Enter your comments here..."></textarea>`;
    } else {
      htmlContent += `<p>${trimmedPara}</p>`;
    }
  });

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

export const generateStripeCustomerId = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";

  for (let i = 0; i < 14; i++) {
    // Stripe customer IDs typically have 14 random characters
    randomPart += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }

  return `cus_${randomPart}`;
};

export const log = (type) => console.log.bind(console, type);

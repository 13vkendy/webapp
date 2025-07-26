const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user');

const questions = [
  {
    question: "What is CDI's focus?",
    options: ["Medicine", "Technology", "Digital Learning", "Music"],
    correct: 2
  },
  {
    question: "Why is this passage written?",
    options: ["To confuse", "For entertainment", "IELTS Practice", "News"],
    correct: 2
  }
];

// Render questions
function renderQuestions() {
  const container = document.getElementById("questions");
  questions.forEach((q, i) => {
    const block = document.createElement("div");
    block.className = "mb-4";
    block.innerHTML = `
      <p class="font-semibold mb-1">${i + 1}. ${q.question}</p>
      ${q.options.map((opt, idx) => `
        <label class="block">
          <input type="radio" name="q${i}" value="${idx}" class="mr-1"> ${opt}
        </label>
      `).join('')}
      <p id="result${i}" class="mt-1 font-medium"></p>
    `;
    container.appendChild(block);
  });
}
renderQuestions();

// Check answers
function checkAnswers() {
  let correctCount = 0;

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const result = document.getElementById(`result${i}`);
    if (selected) {
      if (parseInt(selected.value) === q.correct) {
        result.textContent = "✅ Correct";
        result.className = "text-green-600";
        correctCount++;
      } else {
        result.textContent = `❌ Incorrect. Answer: ${q.options[q.correct]}`;
        result.className = "text-red-600";
      }
    } else {
      result.textContent = "⚠️ No answer selected";
      result.className = "text-yellow-600";
    }
  });

  if (userId) {
    fetch('https://tgbot-production-010b.up.railway.app/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        correct: correctCount,
        total: questions.length
      })
    }).then(() => {
      alert(`✅ Natija botga yuborildi! Siz ${correctCount}/${questions.length} to‘g‘ri topdingiz.`);
    });
  } else {
    alert(`Siz ${correctCount}/${questions.length} to‘g‘ri topdingiz.`);
  }
}

// Highlight feature
const passage = document.getElementById('passage');
const toolbar = document.getElementById('toolbar');
const highlightBtn = document.getElementById('highlightBtn');
const removeBtn = document.getElementById('removeBtn');
const clearBtn = document.getElementById('clearBtn');

let currentRange = null;

// Show toolbar on text select
passage.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (!selection.rangeCount || selection.toString().trim() === '') {
    toolbar.style.display = 'none';
    return;
  }

  currentRange = selection.getRangeAt(0);
  const rect = currentRange.getBoundingClientRect();
  toolbar.style.top = `${rect.top + window.scrollY - 40}px`;
  toolbar.style.left = `${rect.left + (rect.width / 2) - 50}px`;
  toolbar.style.display = 'flex';
});

// Highlight
highlightBtn.addEventListener('click', () => {
  if (!currentRange) return;

  const span = document.createElement('span');
  span.className = 'bg-yellow-300 px-1 rounded';
  currentRange.surroundContents(span);

  toolbar.style.display = 'none';
  window.getSelection().removeAllRanges();
});

// Remove single highlight
removeBtn.addEventListener('click', () => {
  const selection = window.getSelection();
  if (selection.rangeCount) {
    const range = selection.getRangeAt(0);
    const parent = range.commonAncestorContainer.parentNode;
    if (parent.tagName === 'SPAN' && parent.classList.contains('bg-yellow-300')) {
      const text = document.createTextNode(parent.textContent);
      parent.replaceWith(text);
    }
  }
  toolbar.style.display = 'none';
});

// Clear all highlights
clearBtn.addEventListener('click', () => {
  const highlights = passage.querySelectorAll('span.bg-yellow-300');
  highlights.forEach(span => {
    const text = document.createTextNode(span.textContent);
    span.replaceWith(text);
  });
  toolbar.style.display = 'none';
});

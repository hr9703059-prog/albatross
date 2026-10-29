
"use strict";

// ALBATROSS ACADEMY — Academic Session 2026–27
// Edit the dates and subjects below to match the academy's official plan.

const testPlans = {
  "9": [
    ["02 Nov 2026", "Mathematics", "Chapter Test"],
    ["05 Nov 2026", "English", "Written Test"],
    ["09 Nov 2026", "Physics", "Chapter Test"],
    ["12 Nov 2026", "Chemistry", "Chapter Test"],
    ["16 Nov 2026", "Biology / Computer", "Subject Test"],
    ["19 Nov 2026", "Urdu", "Written Test"],
    ["23 Nov 2026", "Mathematics", "Practice Test"],
    ["26 Nov 2026", "English Grammar", "Grammar Test"],
    ["30 Nov 2026", "Physics + Chemistry", "Combined Test"],
    ["03 Dec 2026", "Mathematics", "Revision Test"],
    ["07 Dec 2026", "Science / Computer", "Revision Test"],
    ["10 Dec 2026", "English + Urdu", "Combined Test"]
  ],
  "10": [
    ["02 Nov 2026", "Mathematics", "Chapter Test"],
    ["05 Nov 2026", "English", "Written Test"],
    ["09 Nov 2026", "Physics", "Chapter Test"],
    ["12 Nov 2026", "Chemistry", "Chapter Test"],
    ["16 Nov 2026", "Biology / Computer", "Subject Test"],
    ["19 Nov 2026", "Urdu", "Written Test"],
    ["23 Nov 2026", "Mathematics", "Practice Test"],
    ["26 Nov 2026", "English Grammar", "Grammar Test"],
    ["30 Nov 2026", "Physics + Chemistry", "Combined Test"],
    ["03 Dec 2026", "Mathematics", "Revision Test"],
    ["07 Dec 2026", "Science / Computer", "Revision Test"],
    ["10 Dec 2026", "English + Urdu", "Combined Test"]
  ]
};

const streams = {
  science: [
    ["M", "Mathematics", "Equations, concepts and problem-solving"],
    ["P", "Physics", "Numerical problems and key concepts"],
    ["C", "Chemistry", "Chemical concepts and equations"],
    ["B", "Biology", "Diagrams, terminology and concepts"],
    ["E", "English", "Grammar, writing and comprehension"],
    ["U", "Urdu", "Grammar, writing and literature"],
    ["I", "Islamiat", "Important topics and written practice"],
    ["P", "Pakistan Studies", "History, geography and key topics"]
  ],
  computer: [
    ["M", "Mathematics", "Concepts and numerical practice"],
    ["P", "Physics", "Numerical problems and concepts"],
    ["C", "Computer Science", "Programming and theory"],
    ["E", "English", "Grammar and comprehension"],
    ["U", "Urdu", "Writing and literature"],
    ["I", "Islamiat", "Important topics and practice"],
    ["P", "Pakistan Studies", "Key topics and written answers"],
    ["S", "Chemistry / Science", "Relevant board syllabus"]
  ],
  arts: [
    ["E", "English", "Grammar, writing and comprehension"],
    ["U", "Urdu", "Grammar and literature"],
    ["I", "Islamiat", "Concepts and written practice"],
    ["P", "Pakistan Studies", "History and geography"],
    ["S", "General Science", "Core concepts and revision"],
    ["M", "Mathematics", "If included in your syllabus"],
    ["O", "Elective Subjects", "According to your board"],
    ["R", "Revision Practice", "Past papers and short questions"]
  ]
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

let selectedClass = "9";
let selectedMonth = "all";
let selectedStream = "science";

const scheduleBody = $("#scheduleBody");
const monthFilter = $("#monthFilter");

// Schedule renderer
function renderSchedule() {
  const plans = testPlans[selectedClass] || [];
  const filtered = plans.filter((row) => {
    if (selectedMonth === "all") return true;
    return row[0].startsWith(selectedMonth);
  });

  $("#selectedClass").textContent = `Class ${selectedClass}th`;
  $("#testCount").textContent = filtered.length;

  if (!filtered.length) {
    scheduleBody.innerHTML =
      '<tr><td colspan="5">No tests found for this month.</td></tr>';
    return;
  }

  scheduleBody.innerHTML = filtered.map((row, index) => {
    const month = row[0].startsWith("November") ? "November" : "";
    const weekNumber = Math.floor(
      (new Date(row[0]).getDate() - 1) / 7
    ) + 1;

    return `
      <tr>
        <td><span class="week-tag">WEEK ${weekNumber}</span></td>
        <td>${row[0]}</td>
        <td><span class="subject-name">${row[1]}</span></td>
        <td><span class="type-tag">${row[2]}</span></td>
        <td><span class="status-tag">Planned</span></td>
      </tr>
    `;
  }).join("");
}

$$(".class-btn").forEach((button) => {
  button.addEventListener("click", () => {
    selectedClass = button.dataset.class;

    $$(".class-btn").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    renderSchedule();
  });
});

monthFilter.addEventListener("change", () => {
  selectedMonth = monthFilter.value;
  renderSchedule();
});

// Subject cards
function renderSubjects() {
  const subjects = streams[selectedStream] || streams.science;
  const grid = $("#subjectGrid");

  grid.innerHTML = subjects.map(([symbol, name, description]) => `
    <article class="subject-card">
      <div class="subject-symbol">${symbol}</div>
      <h3>${name}</h3>
      <p>${description}</p>
      <small>FOCUS · PRACTICE · IMPROVE</small>
    </article>
  `).join("");
}

$$(".subject-tab").forEach((button) => {
  button.addEventListener("click", () => {
    selectedStream = button.dataset.stream;

    $$(".subject-tab").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    renderSubjects();
  });
});

// Personal revision tracker
const trackerSubjects = [
  "Mathematics",
  "Physics / General Science",
  "Chemistry",
  "Biology / Computer",
  "English",
  "Urdu",
  "Islamiat",
  "Pakistan Studies"
];

const storageKey = "albatross-revision-2026";

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveProgress(items) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // Tracker remains usable for the current page session.
  }
}

function renderTracker() {
  const checked = readProgress();

  $("#revisionList").innerHTML = trackerSubjects.map((subject, index) => {
    const isChecked = checked.includes(subject);

    return `
      <label class="revision-item">
        <input type="checkbox"
          data-subject="${index}"
          ${isChecked ? "checked" : ""}>
        <span>${subject}</span>
      </label>
    `;
  }).join("");

  updateProgress();
}

function updateProgress() {
  const checked = readProgress();
  const percent = Math.round(
    (checked.length / trackerSubjects.length) * 100
  );

  $("#progressFill").style.width = `${percent}%`;
  $("#progressPercent").textContent = `${percent}%`;
}

$("#revisionList").addEventListener("change", (event) => {
  if (event.target.type !== "checkbox") return;

  const subject = trackerSubjects[Number(event.target.dataset.subject)];
  let checked = readProgress();

  if (event.target.checked && !checked.includes(subject)) {
    checked.push(subject);
  } else {
    checked = checked.filter((item) => item !== subject);
  }

  saveProgress(checked);
  updateProgress();
});

$("#resetProgress").addEventListener("click", () => {
  saveProgress([]);
  renderTracker();
});

// Mobile navigation
$("#menuToggle").addEventListener("click", () => {
  const nav = $("#navLinks");
  const isOpen = nav.classList.toggle("open");

  $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
  $("#menuToggle").setAttribute(
    "aria-label",
    isOpen ? "Close menu" : "Open menu"
  );
});

$$('#navLinks a').forEach((link) => {
  link.addEventListener("click", () => {
    $("#navLinks").classList.remove("open");
    $("#menuToggle").setAttribute("aria-expanded", "false");
  });
});

// Admission enquiry
$("#admissionForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = $("#studentName").value.trim();
  const parent = $("#parentName").value.trim();
  const studentClass = $("#studentClass").value;
  const group = $("#studentGroup").value;
  const phone = $("#studentPhone").value.trim();
  const message = $("#studentMessage").value.trim();

  const enquiry = [
    "ALBATROSS ACADEMY — ADMISSION ENQUIRY",
    "",
    `Student Name: ${name}`,
    `Parent / Guardian: ${parent || "Not provided"}`,
    `Class: ${studentClass}`,
    `Study Group: ${group}`,
    `Contact: ${phone}`,
    `Message: ${message || "Please share admission details and test schedule."}`,
    "",
    "Enquiry for the November 2026 test session."
  ].join("\n");

  const output = $("#formMessage");

  try {
    await navigator.clipboard.writeText(enquiry);
    output.textContent =
      "Enquiry copied! Paste it into a message to the academy.";
  } catch {
    output.textContent =
      "Your enquiry is ready. Copy the details below and send them to the academy.";
  }

  let preview = $("#enquiryPreview");

  if (!preview) {
    preview = document.createElement("textarea");
    preview.id = "enquiryPreview";
    preview.readOnly = true;
    preview.rows = 8;
    preview.style.width = "100%";
    preview.style.marginTop = "12px";
    preview.style.color = "#f7f5ef";
    preview.style.background = "#111114";
    preview.style.border = "1px solid #e7bd64";
    output.insertAdjacentElement("afterend", preview);
  }

  preview.value = enquiry;

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "btn btn-outline";
  copyButton.textContent = "Copy Enquiry Again";

  const oldCopyButton = $("#copyEnquiry");
  if (oldCopyButton) oldCopyButton.remove();

  copyButton.id = "copyEnquiry";
  copyButton.style.marginTop = "10px";
  preview.insertAdjacentElement("afterend", copyButton);

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(preview.value);
      output.textContent = "Enquiry copied successfully.";
    } catch {
      preview.focus();
      preview.select();
      output.textContent = "Select and copy the enquiry text above.";
    }
  });
});

// Initial page setup
$("#year").textContent = new Date().getFullYear();

renderSchedule();
renderSubjects();
renderTracker();

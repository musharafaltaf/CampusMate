/* CampusMate - client-side logic
   - Local FAQ fallback
   - Message persistence (localStorage)
   - Typing animation and simple keyword matching
   - Quick question buttons
*/

/* --- Configuration & FAQ data --- */
const FAQ = [
  { q: "library timing", a: "The library is open from 9:00 AM to 8:00 PM on Monday To Saturday and closed on Sunday." },
  { q: "exam schedule", a: "End-Term exams begin on 24th November. Check the noticeboard for course-wise dates." },
  { q: "sports complex", a: "The sports complex is open from 8:00 AM to 8:00 PM daily. Membership required for some facilities." },
  { q: "hostel office", a: "Hostel office is located on the Ground Floor of every hostel. Office hours: 9:00 AM - 5:00 PM." },
  { q: "canteen timing", a: "Canteen is open for breakfast (7:30am–9:00am), lunch (12:00pm–2:00pm), evening tea (5:00pm–6:00pm), and dinner (7:30pm–9:00pm)." },
  { q: "about yourself", a: "Ohh, good question! I’m the Campus Chatbot of Mewar University, created by Musharaf..." },
  { q: "hello,hii,hi,hey,buddy", a: "👋 Hello! I’m <b>CampusMate</b> — your smart assistant from <b>Mewar University</b>.<br>Ask me anything about campus life — library hours, exams, hostels, or events!"},
  { 
  q: "mewar university", 
  a: "🏛️ Mewar University is a private university located in Chittorgarh, Rajasthan, India. It offers a wide range of programs in engineering, management, law, pharmacy, science, and arts. The campus is known for its lush greenery, modern infrastructure, and commitment to quality education." 
},
{ 
  q: "contact information", 
  a: "📞 You can reach Mewar University through the following:\n\n📍 Address: Gangrar, Chittorgarh, Rajasthan – 312901, India.\n📧 Email: info@mewaruniversity.org\n☎️ Phone: +91-1471-291148 / 291149\n🌐 Website: www.mewaruniversity.org\n\nFor admissions, you can also visit the Admission Cell during working hours (9:00 AM – 5:00 PM, Monday to Saturday)." 
},
{
  q: "upcoming events",
  a: "🎓 <b>Upcoming Events at Mewar University:</b><br><br>📅 <b>TechFest 2025:</b> Scheduled for 7 November — includes hackathon, coding challenge, and robotics exhibition.<br>🎭 <b>some good events:</b> From  December — featuring dance, drama, and music competitions.<br>⚽ <b>Sports Meet 2025:</b> 15–18 January — inter-department tournaments in cricket, football, and athletics.<br><br>Stay tuned to the official noticeboard and <b>www.mewaruniversity.org</b> for updates and registrations!"
}



  
];
// === Quick Questions (appear in the left panel) ===
const QUICK_QUESTIONS = [
  "Library timing",
  "Exam schedule",
  "Sports complex",
  "Hostel office",
  "Canteen timing",
  "Tell me about Mewar University",
  "Contact information",
  "Upcoming events",
  
];


const BACKEND_URL = null;

/* --- Utility functions --- */
function sanitize(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function findFaqAnswer(question) {
  const q = question.toLowerCase().trim();

  // remove punctuation & extra spaces
  const cleanQ = q.replace(/[^\w\s]/gi, "").replace(/\s+/g, " ");

  let bestMatch = null;
  let bestScore = 0;

  for (const item of FAQ) {
    const faqQ = item.q.toLowerCase();
    const words = faqQ.split(" ");

    // count matching words
    let score = 0;
    for (const w of words) {
      if (cleanQ.includes(w)) score++;
    }

    // pick the answer with highest word overlap
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item.a;
    }
  }

  // direct fallback if nothing found
  if (bestScore === 0) {
    for (const item of FAQ) {
      if (cleanQ.includes(item.q) || item.q.includes(cleanQ)) return item.a;
    }
    // Common short replies
if (["ok", "okay", "thanks", "thank you", "thx","thnks"].includes(q.trim())) {
  const replies = [
    "You're welcome! 😊",
    "Glad to help! 💫",
    "Anytime! Need more info?",
    "No problem! 👍",
    "You're most welcome! 🎓"
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

    return null;
  }

  return bestMatch;
}


/* --- DOM Ready --- */
document.addEventListener("DOMContentLoaded", () => {
  // === DOM References ===
  const messages = document.querySelector("#messages");  // your HTML uses id="messages"
const input = document.querySelector("#input");         // your input has id="input"
const sendBtn = document.querySelector(".btn");         // your button has class="btn"

  const clearBtn = document.querySelector("#clear-btn");
  const themeToggle = document.querySelector("#theme-toggle");
  const menuBtn = document.querySelector("#menu-btn");
  const panel = document.querySelector(".panel");
  const overlay = document.getElementById("overlay");
  // === Render Quick Question Buttons ===
const quickList = document.getElementById("quick-list");
if (quickList) {
  QUICK_QUESTIONS.forEach((q) => {
    const btn = document.createElement("button");
    btn.classList.add("quick-btn");
    btn.textContent = q;
    btn.addEventListener("click", () => {
      input.value = q;
      sendBtn.click();
    });
    quickList.appendChild(btn);
  });
}


  // === Messaging Functions ===
  function addMessage(text, sender = "bot") {
    const msg = document.createElement("div");
    msg.classList.add("msg", sender);
    msg.innerHTML = text;
    messages.appendChild(msg);
    messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
  }

  function simulateTyping(callback) {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("typing");
    typingDiv.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    messages.appendChild(typingDiv);
    messages.scrollTo({ top: messages.scrollHeight });
    setTimeout(() => {
      typingDiv.remove();
      callback();
    }, 1000);

  }

  // === Welcome Message ===
  setTimeout(() => {
    addMessage("👋 Hi! I’m <b>CampusMate</b> — your campus chat assistant.<br>Ask me anything about university, library, or events!");
  }, 500);

  // === Send Message ===
  const chatForm = document.querySelector("#chat-form");

chatForm?.addEventListener("submit", (e) => {
  e.preventDefault(); // stop page reload

  const text = input.value.trim();
  if (!text) return;

  addMessage(sanitize(text), "user");
  input.value = "";

  simulateTyping(() => {
    const answer = findFaqAnswer(text);
    if (answer) addMessage(answer);
    else addMessage(`I'm still learning. You said: "${sanitize(text)}" 🙂`);
  });
});


  // ENTER key
  input?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });

  // === Clear Chat ===
  clearBtn?.addEventListener("click", () => {
    messages.innerHTML = "";
    addMessage("🧹 Chat cleared!");
  });

  // === Theme Toggle ===
  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️ Light" : "🌙 Dark";
  });

  // === MENU (Mobile) ===
  if (menuBtn && panel && overlay) {
    menuBtn.addEventListener("click", () => {
      panel.classList.toggle("open");
      overlay.classList.toggle("active");

      // Change icon for better UX
      menuBtn.textContent = panel.classList.contains("open") ? "✕" : "☰";
    });

    overlay.addEventListener("click", () => {
      panel.classList.remove("open");
      overlay.classList.remove("active");
      menuBtn.textContent = "☰";
    });

    // Auto close menu when resizing back to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        panel.classList.remove("open");
        overlay.classList.remove("active");
        menuBtn.textContent = "☰";
      }
    });
  }
});

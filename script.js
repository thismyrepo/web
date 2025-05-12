const input = document.getElementById('cmd-input');
const output = document.getElementById('output');
let resume = {};

// load resume data
fetch('resume.json')
  .then(res => res.json())
  .then(data => resume = data)
  .catch(() => {
    appendLine("Could not load resume data.", 'error');
  });

// helper to append a line
function appendLine(text = '', cls = 'line') {
  const p = document.createElement('p');
  p.className = cls;
  p.innerHTML = text;
  output.insertBefore(p, document.getElementById('cursor-line'));
  scrollToBottom();
}

// scroll terminal down
function scrollToBottom() {
  output.parentNode.scrollTop = output.parentNode.scrollHeight;
}

// handlers
const commands = {
  help: () => {
    appendLine('<span class="command">help</span> — show this help');
    appendLine('<span class="command">about</span> — who you are');
    appendLine('<span class="command">skills</span> — list your skills');
    appendLine('<span class="command">experience</span> — work history');
    appendLine('<span class="command">education</span> — academic background');
    appendLine('<span class="command">contact</span> — how to reach you');
    appendLine('<span class="command">clear</span> — clear the screen');
  },
  about: () => appendLine(resume.about),
  skills: () => resume.skills.forEach(s => appendLine('– ' + s)),
  experience: () => {
    resume.experience.forEach(job => {
      appendLine(`<span class="highlight">${job.role}</span> @ ${job.company} (${job.period})`);
      job.details.forEach(d => appendLine('   • ' + d));
    });
  },
  education: () => {
    resume.education.forEach(edu => {
      appendLine(`<span class="highlight">${edu.degree}</span>, ${edu.institution} (${edu.period})`);
      edu.details.forEach(d => appendLine('   • ' + d));
    });
  },
  contact: () => {
    const c = resume.contact;
    appendLine(`Email: <a href="mailto:${c.email}">${c.email}</a>`);
    appendLine(`GitHub: <a href="${c.github}" target="_blank">${c.github}</a>`);
    appendLine(`LinkedIn: <a href="${c.linkedin}" target="_blank">${c.linkedin}</a>`);
  },
  clear: () => {
  [...output.querySelectorAll('p')].forEach(p => {
    if (!p.classList.contains('persistent')) p.remove();
  });
}
  
};

// handle input
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const cmd = input.value.trim().toLowerCase();
    appendLine(`<span class="prompt">➜</span> ${cmd}`, 'line');
    input.value = '';
    if (commands[cmd]) {
      commands[cmd]();
    } else {
      appendLine(`Command not found: ${cmd}`, 'error');
    }
  }
});

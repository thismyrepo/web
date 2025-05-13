const input = document.getElementById('cmd-input');
const output = document.getElementById('output');

let resume = {};
let history = [];
let historyIndex = -1;

// Load resume data from JSON
fetch('resume.json')
  .then(res => res.json())
  .then(data => resume = data)
  .catch(() => {
    appendLine("Could not load resume data.", 'error');
  });

// Append a line to the terminal
function appendLine(text = '', cls = 'line') {
  const p = document.createElement('p');
  p.className = cls;
  p.innerHTML = text;
  output.insertBefore(p, document.getElementById('cursor-line'));
  scrollToBottom();
}

// Scroll terminal to bottom
function scrollToBottom() {
  output.parentNode.scrollTop = output.parentNode.scrollHeight;
}

// Define commands
const commands = {
  help: () => {
    appendLine('<span class="command">help</span> — show this help');
    appendLine('<span class="command">about</span> — who you are');
    appendLine('<span class="command">skills</span> — list your skills');
    appendLine('<span class="command">experience</span> — work history');
    appendLine('<span class="command">education</span> — academic background');
    appendLine('<span class="command">contact</span> — how to reach you');
    appendLine('<span class="command">clear</span> — clear screen but keep welcome');
    appendLine('<span class="command">reset</span> — full wipe of all output');
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
    document.querySelectorAll('#output p').forEach(p => {
      if (!p.classList.contains('persistent')) p.remove();
    });
  },

  reset: () => {
    document.querySelectorAll('#output p').forEach(p => p.remove());
  }
};

const commandList = Object.keys(commands);

// Handle input and key events
input.addEventListener('keydown', e => {
  const currentValue = input.value.trim();

  if (e.key === 'Enter') {
    const cmd = currentValue.toLowerCase();
    if (cmd) {
      history.push(cmd);
      historyIndex = history.length;
    }
    appendLine(`<span class="prompt">➜</span> ${cmd}`, 'line');
    input.value = '';
    if (commands[cmd]) {
      commands[cmd]();
    } else {
      appendLine(`Command not found: ${cmd}`, 'error');
    }
  }

  // Navigate history
  else if (e.key === 'ArrowUp') {
    if (historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    }
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    } else {
      historyIndex = history.length;
      input.value = '';
    }
    e.preventDefault();
  }

  // Tab autocomplete
  else if (e.key === 'Tab') {
    e.preventDefault();
    const matches = commandList.filter(cmd => cmd.startsWith(currentValue.toLowerCase()));
    if (matches.length === 1) {
      input.value = matches[0];
    } else if (matches.length > 1) {
      appendLine(matches.join('  '), 'line');
    }
  }
});

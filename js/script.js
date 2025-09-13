// Full restored front-end behavior adapted from the original inline script.
// Handles header scroll, mobile menu, anchors, process observer, accordion,
// planner popup, and assistant chat UI. Uses proxy wrapper for Gemini calls.

/* Helper: Sanitize user input to prevent XSS attacks */
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove script tags and other potentially dangerous HTML
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
}

/* Helper: callProxyWithBackoff calls the server proxy at /api/chat */
async function callProxyWithBackoff(endpoint, payload, maxRetries = 5) {
    let attempt = 0;
    let delay = 500; // ms
    while (attempt <= maxRetries) {
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Non-200 response');
            const data = await res.json();
            return data;
        } catch (err) {
            if (attempt === maxRetries) throw err;
            await new Promise(r => setTimeout(r, delay));
            delay *= 1.6 + Math.random() * 0.3;
            attempt++;
        }
    }
}

// Compatibility wrapper used by existing inline code: calls the server proxy at `/api/chat`
async function callGeminiWithBackoff(payload, maxRetries = 5) {
    // Read from meta tag, fallback to localhost for development
    const apiBaseMeta = document.querySelector('meta[name="fusion4o-api-base"]');
    const apiBase = apiBaseMeta?.content || 'http://localhost:3000';
    return await callProxyWithBackoff(`${apiBase}/api/chat`, payload, maxRetries);
}

document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.getElementById('header');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            if (mobileMenu) {
                const isOpen = mobileMenu.classList.contains('translate-x-0');
                mobileMenu.classList.toggle('translate-x-full');
                mobileMenu.classList.toggle('translate-x-0');
                
                // Update ARIA attributes
                menuBtn.setAttribute('aria-expanded', !isOpen);
                mobileMenu.setAttribute('aria-hidden', isOpen);
                // Lock background scroll when menu open on mobile
                document.body.classList.toggle('menu-open', !isOpen);
                // Ensure menu overlay captures taps above FABs
                if (!isOpen) mobileMenu.classList.add('open'); else mobileMenu.classList.remove('open');
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
                if (mobileMenu && mobileMenu.classList.contains('translate-x-0')) {
                    mobileMenu.classList.remove('translate-x-0');
                    mobileMenu.classList.add('translate-x-full');
                    document.body.classList.remove('menu-open');
                    mobileMenu.classList.remove('open');
                }
            }
        });
    });

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { header.classList.add('scrolled'); }
            else { header.classList.remove('scrolled'); }
        });
    }

    // Process items reveal on scroll
    const processItems = document.querySelectorAll('.process-item');
    if (processItems.length) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); }
                });
            }, { threshold: 0.1 });
            processItems.forEach(item => observer.observe(item));
        } else {
            processItems.forEach(el => el.classList.add('is-visible'));
        }
    }

    // Accordion for mobile
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(clickedItem => {
        if (clickedItem) {
            const toggle = clickedItem.querySelector('.accordion-toggle');
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    accordionItems.forEach(item => {
                        if (item !== clickedItem) { item.classList.remove('active'); }
                    });
                    clickedItem.classList.toggle('active');
                });
            }
        }
    });

    // Planner popup
    const startPlannerBtn = document.getElementById('startPlannerBtn');
    if (startPlannerBtn) {
        startPlannerBtn.addEventListener('click', () => {
            const isSmall = window.matchMedia('(max-width: 768px)').matches;
            try {
                if (isSmall) { window.location.href = 'planner.html'; return; }
                const plannerWindow = window.open('planner.html', 'BusinessPlanner', 'width=400,height=600,resizable=yes,scrollbars=yes,top=50,left=50');
                if (plannerWindow) plannerWindow.focus();
                else window.location.href = 'planner.html';
            } catch (error) {
                console.error('Error opening planner window:', error);
                window.location.href = 'planner.html';
            }
        });
    }

    // Chat widget
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatMessages = document.getElementById('chat-messages');

    let assistantConversationHistory = [];

    if (chatBubble && chatWindow) {
        chatBubble.addEventListener('click', () => {
            chatWindow.classList.remove('hidden', 'scale-95', 'opacity-0');
            chatWindow.classList.add('scale-100', 'opacity-100');
        });
    }

    if (closeChatBtn && chatWindow) {
        closeChatBtn.addEventListener('click', () => {
            chatWindow.classList.remove('scale-100', 'opacity-100');
            chatWindow.classList.add('scale-95', 'opacity-0');
            setTimeout(() => chatWindow.classList.add('hidden'), 300);
        });
    }

    const addAssistantMessage = (text, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.innerHTML = text;
        if (chatMessages) {
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    };

    const addAssistantTypingIndicator = () => {
        const typingElement = document.createElement('div');
        typingElement.classList.add('bot-message', 'typing-indicator');
        typingElement.innerHTML = `<span></span><span></span><span></span>`;
        if (chatMessages) {
            chatMessages.appendChild(typingElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        return typingElement;
    };

    const handleAssistantChatSubmit = async () => {
        if (!chatInput) return;
        const userText = sanitizeInput(chatInput.value.trim());
        if (!userText) return;

        addAssistantMessage(userText, 'user');
        chatInput.value = '';

        const typingIndicator = addAssistantTypingIndicator();

        const systemPrompt = "You are FusionBot, a friendly and helpful AI assistant for Fusion4o. Fusion4o specializes in AI-powered marketing, learning solutions, white-label software, and a Skill Development Program for youngsters (courses in AI, Digital Marketing, HR, Graphic Designing). Answer questions concisely. If asked how to contact, provide this WhatsApp link: <a href='https://wa.me/923070057308' target='_blank' class='text-cyan-400 underline'>Contact us on WhatsApp</a>. For pricing or project specifics, politely guide them to the contact options.";

        assistantConversationHistory.push({ role: "user", parts: [{ text: userText }] });

        const payload = { contents: assistantConversationHistory, systemInstruction: { parts: [{ text: systemPrompt }] } };

        try {
            const result = await callGeminiWithBackoff(payload);
            const candidate = result.candidates?.[0];
            if (candidate && (candidate.content?.parts?.[0]?.text || candidate.content?.[0]?.text)) {
                const botText = candidate.content.parts?.[0]?.text || candidate.content[0].text;
                assistantConversationHistory.push({ role: "model", parts: [{ text: botText }] });
                if (typingIndicator && typingIndicator.parentNode === chatMessages) chatMessages.removeChild(typingIndicator);
                addAssistantMessage(botText, 'bot');
            } else {
                throw new Error('No content in response');
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            if (typingIndicator && typingIndicator.parentNode === chatMessages) chatMessages.removeChild(typingIndicator);
            
            // Provide more specific error messages
            let errorMessage = "I'm having trouble connecting. Please try again.";
            if (error.message.includes('Failed to fetch')) {
                errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
            } else if (error.message.includes('403')) {
                errorMessage = "Access denied. Please refresh the page and try again.";
            } else if (error.message.includes('429')) {
                errorMessage = "Too many requests. Please wait a moment and try again.";
            } else if (error.message.includes('500')) {
                errorMessage = "Server error. Please try again in a few moments.";
            }
            
            addAssistantMessage(errorMessage, 'bot');
        }
    };

    if (sendChatBtn) sendChatBtn.addEventListener('click', handleAssistantChatSubmit);
    if (chatInput) chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleAssistantChatSubmit(); });

    // Ensure email floating button always triggers mail client (guard against overlap/preventDefault)
    const emailFloat = document.getElementById('email-float');
    if (emailFloat) {
        emailFloat.addEventListener('click', (e) => {
            // Always prefer native anchor behavior
            const href = 'mailto:hello@fusion4o.com';
            try {
                // Some browsers require preventing default if another overlay catches the click
                e.preventDefault();
            } catch (_) {}

            // Attempt several fallback navigation methods
            try { window.location.href = href; } catch (_) {}
            try { window.open(href, '_self'); } catch (_) {}

            // As a final fallback, create a temporary anchor and click it
            try {
                const a = document.createElement('a');
                a.href = href;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch (_) {}
        }, { passive: false });
    }

    // Expose handler for backward compatibility (inline callers)
    window.handleAssistantChatSubmit = handleAssistantChatSubmit;
});

// Also provide the older name many pages used
window.submitChatMessage = async function () { if (window.handleAssistantChatSubmit) return await window.handleAssistantChatSubmit(); };

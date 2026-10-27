// Quản lý giao diện trò chuyện và trao đổi câu hỏi với trợ lý của website.
(function () {
  const MAX_MESSAGE_LENGTH = 1000;
  const MAX_HISTORY_ITEMS = 8;
  const history = [];

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function initializeChat() {
    if (document.getElementById("siteChat")) return;

    const widget = createElement("section", "site-chat");
    widget.id = "siteChat";
    widget.setAttribute("aria-label", "Trợ lý AI VolunteerLink");
    widget.innerHTML = `
      <button class="site-chat-toggle" type="button" aria-expanded="false" aria-controls="siteChatPanel" aria-label="Mở trợ lý AI">
        <span class="site-chat-toggle-icon" aria-hidden="true">✦</span>
        <span class="site-chat-toggle-label">Hỏi AI</span>
      </button>
      <section class="site-chat-panel" id="siteChatPanel" aria-label="Trò chuyện với trợ lý AI" hidden>
        <header class="site-chat-header">
          <div class="site-chat-avatar" aria-hidden="true">✦</div>
          <div class="site-chat-heading">
            <strong>Trợ lý VolunteerLink</strong>
            <span><i aria-hidden="true"></i> Hỏi về cách sử dụng website</span>
          </div>
          <button class="site-chat-close" type="button" aria-label="Đóng trợ lý">×</button>
        </header>
        <div class="site-chat-messages" id="siteChatMessages" role="log" aria-live="polite" aria-relevant="additions"></div>
        <div class="site-chat-suggestions" id="siteChatSuggestions" aria-label="Câu hỏi gợi ý">
          <button type="button">Làm sao để đăng ký hoạt động?</button>
          <button type="button">Các vai trò trong website là gì?</button>
          <button type="button">Tôi xem lịch tình nguyện ở đâu?</button>
        </div>
        <form class="site-chat-form" id="siteChatForm">
          <label class="sr-only" for="siteChatInput">Nhập câu hỏi cho trợ lý AI</label>
          <textarea id="siteChatInput" rows="1" maxlength="${MAX_MESSAGE_LENGTH}" placeholder="Nhập câu hỏi của bạn..." required></textarea>
          <button class="site-chat-send" type="submit" aria-label="Gửi câu hỏi">➤</button>
        </form>
        <p class="site-chat-note">Câu trả lời do AI tạo; không gửi mật khẩu hoặc thông tin nhạy cảm.</p>
      </section>
    `;
    document.body.appendChild(widget);

    const panel = widget.querySelector("#siteChatPanel");
    const toggle = widget.querySelector(".site-chat-toggle");
    const close = widget.querySelector(".site-chat-close");
    const messages = widget.querySelector("#siteChatMessages");
    const suggestions = widget.querySelector("#siteChatSuggestions");
    const form = widget.querySelector("#siteChatForm");
    const input = widget.querySelector("#siteChatInput");
    const sendButton = widget.querySelector(".site-chat-send");

    function setOpen(isOpen) {
      panel.hidden = !isOpen;
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute(
        "aria-label",
        isOpen ? "Đóng trợ lý AI" : "Mở trợ lý AI",
      );
      if (isOpen) input.focus();
    }

    function addMessage(role, text, isPending) {
      const message = createElement(
        "div",
        "site-chat-message site-chat-message-" + role,
      );
      message.setAttribute("data-role", role);
      const bubble = createElement(
        "p",
        "site-chat-bubble" + (isPending ? " is-pending" : ""),
        text,
      );
      message.appendChild(bubble);
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
      return bubble;
    }

    async function sendMessage(rawMessage) {
      const question = rawMessage.trim();
      if (!question || sendButton.disabled) return;

      suggestions.hidden = true;
      addMessage("user", question);
      input.value = "";
      input.style.height = "";
      sendButton.disabled = true;
      input.disabled = true;
      const pending = addMessage("assistant", "Đang tìm câu trả lời...", true);

      const nextHistory = history
        .concat([{ role: "user", content: question }])
        .slice(-MAX_HISTORY_ITEMS);
      if (nextHistory[0]?.role === "assistant") nextHistory.shift();

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextHistory }),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            result.error || "Không gửi được câu hỏi. Vui lòng thử lại.",
          );
        }
        if (typeof result.answer !== "string" || !result.answer.trim()) {
          throw new Error("AI chưa tạo được câu trả lời. Vui lòng thử lại.");
        }

        pending.textContent = result.answer;
        pending.classList.remove("is-pending");
        history.push(
          { role: "user", content: question },
          { role: "assistant", content: result.answer },
        );
        if (history.length > MAX_HISTORY_ITEMS)
          history.splice(0, history.length - MAX_HISTORY_ITEMS);
      } catch (error) {
        pending.textContent =
          error.message === "Failed to fetch"
            ? "Không kết nối được máy chủ chatbot. Hãy chạy website bằng npm start rồi thử lại."
            : error.message;
        pending.classList.remove("is-pending");
        pending.classList.add("is-error");
      } finally {
        sendButton.disabled = false;
        input.disabled = false;
        input.focus();
        messages.scrollTop = messages.scrollHeight;
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(panel.hidden);
    });
    close.addEventListener("click", function () {
      setOpen(false);
      toggle.focus();
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      sendMessage(input.value);
    });
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });
    input.addEventListener("input", function () {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 120) + "px";
    });
    suggestions.addEventListener("click", function (event) {
      const button = event.target.closest("button");
      if (button) sendMessage(button.textContent);
    });

    addMessage(
      "assistant",
      "Xin chào! Mình có thể hướng dẫn bạn tìm hoạt động, đăng ký ca hoặc sử dụng các tính năng VolunteerLink. Bạn cần trợ giúp gì?",
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeChat, {
      once: true,
    });
  } else {
    initializeChat();
  }
})();

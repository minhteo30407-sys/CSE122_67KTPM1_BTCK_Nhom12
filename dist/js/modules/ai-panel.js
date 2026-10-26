// VolunteerLink: Shared ai panel feature module.
const AIPanel = {
  create: function (options) {
    const container = document.getElementById(options.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="ai-panel">
        <div class="ai-panel-header">
          <span class="ai-icon">🤖</span>
          <span>${options.title || "Trợ lý AI"}</span>
          <span class="badge badge-ai">AI</span>
        </div>
        <div class="ai-panel-body">
          <div id="${options.containerId}-input">
            <p style="margin-bottom:12px; color:var(--text-secondary); font-size:14px;">
              ${options.description || "Nhấn nút bên dưới để AI phân tích dữ liệu."}
            </p>
            <button class="btn btn-ai" onclick="AIPanel.run('${options.containerId}')">
              🤖 Chạy AI phân tích
            </button>
          </div>

          <div id="${options.containerId}-loading" class="hidden">
            <div class="ai-loading">
              <div class="spinner"></div>
              <p>AI đang xử lý dữ liệu...</p>
              <p style="font-size:12px; margin-top:4px;">Vui lòng đợi trong giây lát</p>
            </div>
          </div>

          <div id="${options.containerId}-result" class="hidden"></div>

          <div id="${options.containerId}-error" class="hidden">
            <div class="ai-error">
              <p style="font-weight:600; margin-bottom:8px;">⚠️ AI không thể xử lý</p>
              <p id="${options.containerId}-error-msg">Không đủ dữ liệu để đưa ra đề xuất.</p>
            </div>
            <div class="ai-actions">
              <button class="btn btn-ai btn-sm" onclick="AIPanel.run('${options.containerId}')">🔄 Thử lại</button>
              <button class="btn btn-secondary btn-sm" onclick="AIPanel.reset('${options.containerId}')">Làm thủ công</button>
            </div>
          </div>
        </div>
      </div>
    `;

    AIPanel._callbacks[options.containerId] = options;
  },

  _callbacks: {},

  run: function (containerId) {
    const options = this._callbacks[containerId];
    if (!options) return;

    this._show(containerId, "loading");

    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      if (options.onRun) {
        try {
          const result = options.onRun();
          if (result && result.error) {
            this.showError(containerId, result.error);
          } else {
            this.showResult(containerId, result);
          }
        } catch (e) {
          this.showError(containerId, "Không thể xử lý yêu cầu lúc này.");
        }
      }
    }, delay);
  },

  showResult: function (containerId, result) {
    const options = this._callbacks[containerId];
    const resultEl = document.getElementById(containerId + "-result");
    if (!resultEl) return;

    let html = "";

    if (result.items && result.items.length > 0) {
      html += '<div class="ai-result">';
      result.items.forEach((item) => {
        html += `<div class="ai-result-item">
          <div>
            <strong>${item.title}</strong>
            <div style="font-size:13px; color:var(--text-secondary);">${item.subtitle || ""}</div>
          </div>
          <div>${item.badge || ""}</div>
        </div>`;
      });
      html += "</div>";
    }

    if (result.explain) {
      html += `<div class="ai-explain">
        <strong>💡 Vì sao có kết quả này?</strong><br>
        ${result.explain}
      </div>`;
    }

    html += `<div class="ai-actions">
      <button class="btn btn-primary btn-sm" onclick="AIPanel.accept('${containerId}')">✅ Chấp nhận</button>
      <button class="btn btn-secondary btn-sm" onclick="AIPanel.reset('${containerId}')">✏️ Sửa</button>
      <button class="btn btn-danger btn-sm" onclick="AIPanel.reset('${containerId}')">❌ Từ chối</button>
      <button class="btn btn-ai btn-sm" onclick="AIPanel.run('${containerId}')">🔄 Tạo lại</button>
    </div>`;

    resultEl.innerHTML = html;
    this._show(containerId, "result");
  },

  showError: function (containerId, message) {
    const errorMsg = document.getElementById(containerId + "-error-msg");
    if (errorMsg) {
      errorMsg.textContent = message;
    }
    this._show(containerId, "error");
  },

  accept: function (containerId) {
    const options = this._callbacks[containerId];
    if (options && options.onAccept) {
      options.onAccept();
    }
    showToast("Đã chấp nhận kết quả AI!", "success");
  },

  reset: function (containerId) {
    this._show(containerId, "input");
  },

  _show: function (containerId, state) {
    const states = ["input", "loading", "result", "error"];
    states.forEach((s) => {
      const el = document.getElementById(containerId + "-" + s);
      if (el) {
        if (s === state) {
          el.classList.remove("hidden");
        } else {
          el.classList.add("hidden");
        }
      }
    });
  },
};

// Mã xử lý giao diện và thao tác trên trang đăng nhập.
document.addEventListener("DOMContentLoaded", function () {
  if (
    new URLSearchParams(window.location.search).get("error") === "data-init"
  ) {
    showToast(
      "Không thể tải dữ liệu để xác minh quyền truy cập. Hãy thử tải lại trang.",
      "error",
    );
  }
});

function fillDemoAccount() {
  document.getElementById("loginEmail").value = Auth.demoEmail;
  document.getElementById("loginPassword").value = Auth.demoPassword;
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email) {
    showToast("Vui lòng nhập email!", "error");
    return;
  }

  let user;
  try {
    await DataStore.init();
    user = await Auth.login(
      email,
      password,
      document.getElementById("rememberMe").checked,
    );
  } catch (error) {
    showToast(error.message, "error");
    return;
  }
  if (!user) {
    showToast(
      "Email hoặc mật khẩu không đúng, hoặc tài khoản chưa được đăng ký.",
      "error",
    );
    return;
  }

  showToast("Đăng nhập thành công. Đang chuyển đến trang chủ...", "success");
  setTimeout(() => {
    window.location.href = getPageUrl("index");
  }, 500);
}

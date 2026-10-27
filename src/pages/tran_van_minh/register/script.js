// Mã xử lý giao diện và thao tác trên trang đăng ký tài khoản.
document.addEventListener("DOMContentLoaded", async function () {
  await DataStore.init();
});

async function handleRegister(e) {
  e.preventDefault();

  const nameInput = document.getElementById("regName");
  const emailInput = document.getElementById("regEmail");
  const phoneInput = document.getElementById("regPhone");
  const passInput = document.getElementById("regPassword");
  const confirmPassInput = document.getElementById("regConfirmPassword");
  const role = document.getElementById("regRole").value;

  if (!validateField(nameInput, { required: true, minLength: 2 })) return;
  if (!validateField(emailInput, { required: true, email: true })) return;
  if (!validateField(phoneInput, { required: true, phone: true })) return;
  if (!validateField(passInput, { required: true, minLength: 6 })) return;

  if (passInput.value !== confirmPassInput.value) {
    showToast("Mật khẩu xác nhận không trùng khớp!", "error");
    confirmPassInput.focus();
    return;
  }

  const account =
    role === "volunteer"
      ? {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          skills: [],
          availability: [],
          totalHours: 0,
          status: "active",
          role: "volunteer",
        }
      : {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          address: "TP. Hồ Chí Minh",
          description: "Tổ chức thiện nguyện vì cộng đồng",
          status: "active",
          role: "organization",
        };

  let user;
  try {
    await DataStore.init();
    user = await Auth.createAccount(
      role === "volunteer" ? "volunteers" : "organizations",
      account,
      passInput.value,
    );
  } catch (error) {
    showToast(error.message, "error");
    return;
  }
  if (!user) {
    showToast(
      "Email này đã được sử dụng. Hãy đăng nhập hoặc dùng một email khác.",
      "error",
    );
    return;
  }

  showToast("Đăng ký tài khoản thành công! Đang chuyển hướng...", "success");

  setTimeout(() => {
    if (role === "volunteer") {
      window.location.href = getPageUrl("volunteer-profile");
    } else {
      window.location.href = getPageUrl("organization-opportunity-management");
    }
  }, 800);
}

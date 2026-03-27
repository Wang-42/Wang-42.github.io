document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.querySelector(".register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const userName = document.getElementById("userName").value.trim();
      const fullName = document.getElementById("fullName").value.trim();
      const dob = document.getElementById("dob").value;
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const rePassword = document.getElementById("re-password").value;
      const agree = document.getElementById("agree").checked;

      const passRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passRegex.test(password)) {
        alert(
          "Mật khẩu sai quy tắc! (Tối đa 8 ký tự, gồm ít nhất: 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt)",
        );
        return;
      }

      if (password !== rePassword) {
        alert("Nhập lại mật khẩu không khớp!");
        return;
      }

      if (!dob || new Date(dob) > new Date()) {
        alert("Ngày sinh không hợp lệ!");
        return;
      }

      if (!agree) {
        alert("Bạn phải đồng ý với điều khoản!");
        return;
      }
      let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

      if (accounts.some((acc) => acc.userName === userName)) {
        alert("Tên người dùng đã tồn tại!");
        return;
      }

      const newUser = { userName, fullName, dob, email, password };
      accounts.push(newUser);
      localStorage.setItem("accounts", JSON.stringify(accounts));

      alert("Đăng ký thành công!");
      window.location.href = "./dang-nhap.html";
    });
  }
});

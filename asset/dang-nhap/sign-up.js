document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.querySelector(".register-form");

  if (!registerForm) {
    return;
  }

  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fields = {
    userName: {
      input: document.getElementById("userName"),
      error: document.getElementById("userNameError"),
      validate: function (value) {
        return value ? "" : this.defaultMessage;
      },
    },
    fullName: {
      input: document.getElementById("fullName"),
      error: document.getElementById("fullNameError"),
      validate: function (value) {
        return value ? "" : this.defaultMessage;
      },
    },
    dob: {
      input: document.getElementById("dob"),
      error: document.getElementById("dobError"),
      validate: function (value) {
        return value ? "" : this.defaultMessage;
      },
    },
    phone: {
      input: document.getElementById("phone"),
      error: document.getElementById("phoneNumberError"),
      validate: function (value) {
        return value ? "" : this.defaultMessage;
      },
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("emailError"),
      validate: function (value) {
        if (!value) {
          return this.defaultMessage;
        }

        return emailRegex.test(value)
          ? ""
          : "Email không đúng định dạng! Vui lòng nhập lại.";
      },
    },
    password: {
      input: document.getElementById("password"),
      error: document.getElementById("passwordError"),
      validate: function (value) {
        if (!value) {
          return this.defaultMessage;
        }

        return passRegex.test(value) ? "" : "Sai quy tắc! vui lòng nhập lại.";
      },
    },
    rePassword: {
      input: document.getElementById("re-password"),
      error: document.getElementById("rePasswordError"),
      validate: function (value) {
        if (!value) {
          return this.defaultMessage;
        }

        return value === fields.password.input.value
          ? ""
          : "Mật khẩu không khớp! Vui lòng nhập lại!";
      },
    },
    agree: {
      input: document.getElementById("agree"),
      error: document.getElementById("agreeError"),
      validate: function (value) {
        return value ? "" : this.defaultMessage;
      },
    },
  };

  const touchedFields = {};

  Object.keys(fields).forEach(function (fieldId) {
    fields[fieldId].defaultMessage = fields[fieldId].error.textContent.trim();
  });

  function getFieldValue(fieldId) {
    const input = fields[fieldId].input;

    if (input.type === "checkbox") {
      return input.checked;
    }

    return input.value.trim();
  }

  function showError(fieldId, message) {
    const field = fields[fieldId];
    field.error.textContent = message;
    field.error.style.display = "block";
  }

  function hideError(fieldId) {
    fields[fieldId].error.style.display = "none";
  }

  function validateField(fieldId, shouldShowError) {
    const field = fields[fieldId];
    const message = field.validate(getFieldValue(fieldId));

    if (shouldShowError && message) {
      showError(fieldId, message);
      return false;
    }

    hideError(fieldId);
    return true;
  }

  function markTouched(fieldId) {
    touchedFields[fieldId] = true;
  }

  function bindFieldEvents(fieldId) {
    const field = fields[fieldId];
    const isCheckbox = field.input.type === "checkbox";

    hideError(fieldId);

    if (isCheckbox) {
      field.input.addEventListener("change", function () {
        markTouched(fieldId);
        validateField(fieldId, true);
      });
      return;
    }

    field.input.addEventListener("blur", function () {
      markTouched(fieldId);
      validateField(fieldId, true);

      if (fieldId === "password" && touchedFields.rePassword) {
        validateField("rePassword", true);
      }
    });

    field.input.addEventListener("input", function () {
      if (!touchedFields[fieldId]) {
        return;
      }

      validateField(fieldId, true);

      if (fieldId === "password" && touchedFields.rePassword) {
        validateField("rePassword", true);
      }
    });
  }

  Object.keys(fields).forEach(bindFieldEvents);

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let isFormValid = true;

    Object.keys(fields).forEach(function (fieldId) {
      markTouched(fieldId);

      if (!validateField(fieldId, true)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      return;
    }

    const userName = getFieldValue("userName");
    const fullName = getFieldValue("fullName");
    const dob = fields.dob.input.value;
    const phone = getFieldValue("phone");
    const email = getFieldValue("email");
    const password = fields.password.input.value;

    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

    if (
      accounts.some(function (acc) {
        return acc.userName === userName;
      })
    ) {
      showError("userName", "Tên người dùng đã tồn tại!");
      fields.userName.input.focus();
      return;
    }

    const newUser = { userName, fullName, dob, phone, email, password };
    accounts.push(newUser);
    localStorage.setItem("accounts", JSON.stringify(accounts));

    alert("Đăng ký thành công!");
    window.location.href = "./dang-nhap.html";
  });
});

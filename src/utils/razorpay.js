export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = ({ 
  amount = 69900, 
  name = "RepoLink", 
  description = "Subscription Fee",
  prefill = {},
  onSuccess,
  onCancel 
}) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY,
    amount: amount, 
    currency: "INR",
    name,
    description,
    image: "https://repolink.dev/logo.png", // Fallback logo
    handler: function (response) {
      if (onSuccess) onSuccess(response);
    },
    prefill: {
      name: prefill.name || "User Name",
      email: prefill.email || "user@example.com",
      contact: prefill.contact || "9999999999",
      ...prefill
    },
    theme: {
      color: "#22c55e", // Pixel green to match RepoLink
    },
    modal: {
      ondismiss: function() {
        if (onCancel) onCancel();
      }
    }
  };

  if (!window.Razorpay) {
    alert("Razorpay SDK not loaded.");
    return;
  }

  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", function (response) {
    alert("Payment failed: " + response.error.description);
  });
  rzp.open();
};

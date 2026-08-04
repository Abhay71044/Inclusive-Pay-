export const APK_LINK = "https://github.com/parthasarthi317-blip/UPI/releases/download/v1.0.1/app-debug.apk";

export const SUPPORT_EMAIL = "abhaysingh71044@gmail.com";

// Verified FormSubmit string hash from activation email
export const FORMSUBMIT_HASH = "fd83fae4c9aa57db4518015b7f251fbd";

export const firebaseConfig = {
  apiKey: "AIzaSyCL_CKgk03vX3VuyqW0X_1OwTmB3eySFHE",
  authDomain: "inclusivepay-1ac68.firebaseapp.com",
  projectId: "inclusivepay-1ac68",
  storageBucket: "inclusivepay-1ac68.firebasestorage.app",
  messagingSenderId: "640252650728",
  appId: "1:640252650728:web:78f9ec30ba66a564f2955d"
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://inclusivepay-backend.onrender.com";

export const downloadAPKFile = (speak, showToast) => {
  if (speak) speak("Downloading InclusivePay APK application...");

  if (!APK_LINK || APK_LINK === "PASTE_YOUR_APK_LINK_HERE" || !APK_LINK.startsWith('http')) {
    const demoContent = "InclusivePay Android App Package (v2.4.0)\nAccessible UPI Payment App for Everyone\nWCAG 2.1 Level AAA Compliant";
    const blob = new Blob([demoContent], { type: "application/vnd.android.package-archive" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "InclusivePay_v2.4.0.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    if (showToast) showToast("⬇️ InclusivePay_v2.4.0.apk downloaded successfully!");
  } else {
    const link = document.createElement("a");
    link.href = APK_LINK;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = "InclusivePay-app-debug.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showToast) showToast("⬇️ Downloading InclusivePay APK from GitHub Releases...");
  }
};

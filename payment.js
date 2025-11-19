// payment.js
import { auth, db } from "./firebase.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Put the public key id you gave me here:
const RAZORPAY_KEY = "rzp_live_RhXM2yASrfI7Mk";

// Expose startPayment to global scope so inline onclick can call it
window.startPayment = async function(subjectId, price) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login first.");
    return;
  }

  const options = {
    key: RAZORPAY_KEY,
    amount: price * 100, // paise
    currency: "INR",
    name: "MedStudyEasy",
    description: `Unlock notes for ${subjectId}`,
    handler: async function (response) {
      try {
        // Mark the subject premium flag true
        await updateDoc(doc(db, "users", user.uid), {
          ["premium_" + subjectId]: true
        });

        // Update UI
        applyUnlockToUI(subjectId);
        alert("Payment successful — " + subjectId + " unlocked!");
      } catch (err) {
        console.error("Firestore update failed:", err);
        alert("Payment succeeded but failed to unlock. Contact admin.");
      }
    },
    modal: {
      ondismiss: function() {
        // optional: do nothing or show msg
      }
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
};

// On auth change or page load, check if surgery is unlocked and update UI
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    // user not logged in — show locked UI
    lockSubjectUI("surgery1");
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) {
      lockSubjectUI("surgery1");
      return;
    }
    const data = snap.data();
    if (data && data["premium_surgery1"] === true) {
      applyUnlockToUI("surgery1");
    } else {
      lockSubjectUI("surgery1");
    }
  } catch (err) {
    console.error("Error reading user doc:", err);
    lockSubjectUI("surgery1");
  }
});

// helper: unlock visuals & enable link
function applyUnlockToUI(sub) {
  const link = document.getElementById(sub + "-link");
  const btn = document.getElementById("unlock-" + sub);
  if (link) {
    link.classList.remove("locked");
    link.classList.add("unlocked");
    link.removeAttribute("disabled");
  }
  if (btn) {
    btn.innerText = "Unlocked ✔";
    btn.disabled = true;
  }
}

// helper: show locked visuals
function lockSubjectUI(sub) {
  const link = document.getElementById(sub + "-link");
  const btn = document.getElementById("unlock-" + sub);
  if (link) {
    link.classList.add("locked");
    link.classList.remove("unlocked");
    link.setAttribute("aria-disabled", "true");
  }
  if (btn) {
    btn.innerText = "Unlock for ₹49";
    btn.disabled = false; // allow login to proceed then pay
  }
}

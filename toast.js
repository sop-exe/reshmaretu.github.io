function showToast(message = "Coming soon!") {
    let toastBox = document.querySelector(".toastBox");

    // If toastBox doesn’t exist, create one automatically
    if (!toastBox) {
        toastBox = document.createElement("div");
        toastBox.classList.add("toastBox");
        document.body.appendChild(toastBox);
    }

    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;

    toastBox.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

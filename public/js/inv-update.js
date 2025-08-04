
const form = document.querySelector("#updateForm")
form.addEventListener("change", function () {
    const updateBtn = document.getElementById("update-submit")
    updateBtn.removeAttribute("disabled")
})
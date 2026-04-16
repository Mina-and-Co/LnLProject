async function runWithAuth(message, authorizedAction) {
    const passwordEntered = prompt(message);
    if (!passwordEntered) {
        return;
    }

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password: passwordEntered })
        });

        if (response.ok) {
            await authorizedAction();
        } else if (response.status === 401) {
            alert("Password Incorrect.");
        } else {
            alert("Something went wrong with the server.");
        }
    } catch (err) {
        console.error("Auth network error:", err);
        alert("Could not connect to validate auth.");
    }
}

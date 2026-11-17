import { useState, type FormEvent } from "react";

export type User = {
                id: string | number;
                name: string;
                email: string;
};

type UserFormProps = {
                onUserAdded: (user: User) => void;
};

function UserForm({ onUserAdded }: UserFormProps) {
                const [name, setName] = useState("");
                const [email, setEmail] = useState("");
                const [error, setError] = useState("");
                const [isSubmitting, setIsSubmitting] = useState(false);

                async function handleSubmit(event: FormEvent<HTMLFormElement>) {
                                event.preventDefault();
                                setError("");
                                setIsSubmitting(true);

                                try {
                                                const response = await fetch("http://localhost:3000/users", {
                                                                method: "POST",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({ name, email }),
                                                });

                                                if (!response.ok) {
                                                                throw new Error("Failed to add user");
                                                }

                                                const user: User = await response.json();
                                                onUserAdded(user);
                                                setName("");
                                                setEmail("");
                                } catch {
                                                setError("Could not add user. Make sure JSON Server is running.");
                                } finally {
                                                setIsSubmitting(false);
                                }
                }

                return (
                                <form className="user-form" onSubmit={handleSubmit}>
                                                <label>
                                                                Name
                                                                <input
                                                                                value={name}
                                                                                onChange={(event) => setName(event.target.value)}
                                                                                required
                                                                />
                                                </label>
                                                <label>
                                                                Email
                                                                <input
                                                                                type="email"
                                                                                value={email}
                                                                                onChange={(event) => setEmail(event.target.value)}
                                                                                required
                                                                />
                                                </label>
                                                <button className="add-button" type="submit" disabled={isSubmitting}>
                                                                {isSubmitting ? "Adding..." : "Add user"}
                                                </button>
                                                {error && <p className="users-message" role="alert">{error}</p>}
                                </form>
                );
}

export default UserForm;

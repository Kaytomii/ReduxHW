import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserForm from "./components/UserForm";
import type { User } from "./components/UserForm";
import {
                addToCart,
                clearCart,
                decreaseQuantity,
                increaseQuantity,
                removeFromCart,
} from "./redux/slices/cartSlice";
import type { Product } from "./redux/slices/cartSlice";
import type { AppDispatch, RootState } from "./redux/store";
import "./App.css";

const products: Product[] = [
                {
                                id: 1,
                                name: "Навушники Wave",
                                description: "Бездротові навушники з чистим і насиченим звуком.",
                                category: "Аудіо",
                                price: 2499,
                                image: "🎧",
                },
                {
                                id: 2,
                                name: "Смартгодинник Pulse",
                                description: "Стежить за активністю та допомагає залишатися на зв'язку.",
                                category: "Гаджети",
                                price: 3899,
                                image: "⌚",
                },
                {
                                id: 3,
                                name: "Портативна колонка Boom",
                                description: "Компактна колонка для музики вдома та в дорозі.",
                                category: "Аудіо",
                                price: 1799,
                                image: "🔊",
                },
                {
                                id: 4,
                                name: "Механічна клавіатура Key",
                                description: "Зручна клавіатура з приємним тактильним відгуком.",
                                category: "Аксесуари",
                                price: 3299,
                                image: "⌨️",
                },
                {
                                id: 5,
                                name: "Вебкамера Focus",
                                description: "Чітке зображення для дзвінків, стримів і навчання.",
                                category: "Аксесуари",
                                price: 2199,
                                image: "📷",
                },
                {
                                id: 6,
                                name: "Павербанк Energy",
                                description: "Додатковий заряд для смартфона в будь-якій ситуації.",
                                category: "Гаджети",
                                price: 1499,
                                image: "🔋",
                },
];

const formatPrice = (price: number) =>
                new Intl.NumberFormat("uk-UA", {
                                style: "currency",
                                currency: "UAH",
                                maximumFractionDigits: 0,
                }).format(price);

function App() {
                const [search, setSearch] = useState("");
                const [users, setUsers] = useState<User[]>([]);
                const [usersLoading, setUsersLoading] = useState(true);
                const [usersError, setUsersError] = useState("");
                const dispatch = useDispatch<AppDispatch>();
                const cartItems = useSelector((state: RootState) => state.cart.items);
                const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
                const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
                useEffect(() => {
                                const controller = new AbortController();

                                fetch("http://localhost:3000/users", { signal: controller.signal })
                                                .then((response) => {
                                                                if (!response.ok) {
                                                                                throw new Error("Failed to load users");
                                                                }

                                                                return response.json() as Promise<User[]>;
                                                })
                                                .then(setUsers)
                                                .catch((error: unknown) => {
                                                                if (error instanceof Error && error.name === "AbortError") {
                                                                                return;
                                                                }

                                                                setUsersError("Could not load users. Make sure JSON Server is running.");
                                                })
                                                .finally(() => setUsersLoading(false));

                                return () => controller.abort();
                }, []);
                const filteredProducts = useMemo(() => {
                                const query = search.trim().toLocaleLowerCase("uk-UA");

                                if (!query) {
                                                return products;
                                }

                                return products.filter((product) =>
                                                `${product.name} ${product.description} ${product.category}`
                                                                .toLocaleLowerCase("uk-UA")
                                                                .includes(query),
                                );
                }, [search]);

                return (
                                <main className="shop">
                                                <header className="shop-header">
                                                                <a className="brand" href="#" aria-label="Головна сторінка">
                                                                                <span className="brand-mark">S</span>
                                                                                <span>Shop<span className="brand-accent">ly</span></span>
                                                                </a>
                                                                <div className="header-cart" aria-live="polite">
                                                                                <span aria-hidden="true">🛒</span>
                                                                                <span>У кошику: {totalItems}</span>
                                                                </div>
                                                </header>

                                                <section className="users-section">
                                                                <div className="users-heading">
                                                                                <h2>Users</h2>
                                                                                <p>Users loaded from db.json</p>
                                                                </div>
                                                                <UserForm onUserAdded={(user) => setUsers((currentUsers) => [...currentUsers, user])} />
                                                                {usersError && <p className="users-message" role="alert">{usersError}</p>}
                                                                {usersLoading ? (
                                                                                <p className="users-message">Loading users...</p>
                                                                ) : users.length > 0 ? (
                                                                                <ul className="users-list">
                                                                                                {users.map((user) => (
                                                                                                                <li key={user.id}>
                                                                                                                                <strong>{user.name}</strong>
                                                                                                                                <span>{user.email}</span>
                                                                                                                </li>
                                                                                                ))}
                                                                                </ul>
                                                                ) : (
                                                                                !usersError && <p className="users-message">No users yet.</p>
                                                                )}
                                                </section>

                                                <section className="catalog">
                                                                <div className="catalog-heading">
                                                                                <p className="eyebrow">ПІДБІРКА ДЛЯ ВАС</p>
                                                                                <h1>Знайдіть свої нові улюблені речі</h1>
                                                                                <p className="catalog-subtitle">
                                                                                                Обирайте потрібне та додавайте до кошика.
                                                                                </p>
                                                                </div>

                                                                <label className="search-box">
                                                                                <span aria-hidden="true">⌕</span>
                                                                                <input
                                                                                                type="search"
                                                                                                value={search}
                                                                                                onChange={(event) => setSearch(event.target.value)}
                                                                                                placeholder="Пошук товарів..."
                                                                                                aria-label="Пошук товарів"
                                                                                />
                                                                                {search && (
                                                                                                <button
                                                                                                                className="clear-search"
                                                                                                                type="button"
                                                                                                                onClick={() => setSearch("")}
                                                                                                                aria-label="Очистити пошук"
                                                                                                >
                                                                                                                ×
                                                                                                </button>
                                                                                )}
                                                                </label>

                                                                <div className="catalog-layout">
                                                                                <section className="product-section" aria-label="Каталог товарів">
                                                                                                <div className="section-heading">
                                                                                                                <h2>Популярні товари</h2>
                                                                                                                <span>{filteredProducts.length} товарів</span>
                                                                                                </div>
                                                                                                {filteredProducts.length > 0 ? (
                                                                                                                <div className="product-grid">
                                                                                                                                {filteredProducts.map((product) => (
                                                                                                                                                <article className="product-card" key={product.id}>
                                                                                                                                                                <div className="product-image" aria-hidden="true">
                                                                                                                                                                                {product.image}
                                                                                                                                                                </div>
                                                                                                                                                                <div className="product-info">
                                                                                                                                                                                <span className="product-category">{product.category}</span>
                                                                                                                                                                                <h3>{product.name}</h3>
                                                                                                                                                                                <p>{product.description}</p>
                                                                                                                                                                                <div className="product-footer">
                                                                                                                                                                                                <strong>{formatPrice(product.price)}</strong>
                                                                                                                                                                                                <button
                                                                                                                                                                                                                className="add-button"
                                                                                                                                                                                                                type="button"
                                                                                                                                                                                                                onClick={() => dispatch(addToCart(product))}
                                                                                                                                                                                                >
                                                                                                                                                                                                                Додати
                                                                                                                                                                                                </button>
                                                                                                                                                                                </div>
                                                                                                                                                                </div>
                                                                                                                                                </article>
                                                                                                                                ))}
                                                                                                                </div>
                                                                                                ) : (
                                                                                                                <div className="empty-search">
                                                                                                                                <span aria-hidden="true">🔎</span>
                                                                                                                                <h3>Нічого не знайдено</h3>
                                                                                                                                <p>Спробуйте змінити пошуковий запит.</p>
                                                                                                                </div>
                                                                                                )}
                                                                                </section>

                                                                                <aside className="cart-panel" aria-label="Кошик">
                                                                                                <div className="cart-heading">
                                                                                                                <h2>Ваш кошик</h2>
                                                                                                                <span className="cart-count">{totalItems}</span>
                                                                                                </div>
                                                                                                {cartItems.length > 0 ? (
                                                                                                                <>
                                                                                                                                <ul className="cart-list">
                                                                                                                                                {cartItems.map((item) => (
                                                                                                                                                                <li className="cart-item" key={item.id}>
                                                                                                                                                                                <span className="cart-item-image" aria-hidden="true">
                                                                                                                                                                                                {item.image}
                                                                                                                                                                                </span>
                                                                                                                                                                                <div className="cart-item-details">
                                                                                                                                                                                                <strong>{item.name}</strong>
                                                                                                                                                                                                <span>{formatPrice(item.price)}</span>
                                                                                                                                                                                                <div className="quantity-control" aria-label={`Кількість: ${item.quantity}`}>
                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                type="button"
                                                                                                                                                                                                                                onClick={() => dispatch(decreaseQuantity(item.id))}
                                                                                                                                                                                                                                aria-label={`Зменшити кількість: ${item.name}`}
                                                                                                                                                                                                                >
                                                                                                                                                                                                                                −
                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                <span>{item.quantity}</span>
                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                type="button"
                                                                                                                                                                                                                                onClick={() => dispatch(increaseQuantity(item.id))}
                                                                                                                                                                                                                                aria-label={`Збільшити кількість: ${item.name}`}
                                                                                                                                                                                                                >
                                                                                                                                                                                                                                +
                                                                                                                                                                                                                </button>
                                                                                                                                                                                                </div>
                                                                                                                                                                                </div>
                                                                                                                                                                                <button
                                                                                                                                                                                                className="remove-button"
                                                                                                                                                                                                type="button"
                                                                                                                                                                                                onClick={() => dispatch(removeFromCart(item.id))}
                                                                                                                                                                                                aria-label={`Видалити: ${item.name}`}
                                                                                                                                                                                >
                                                                                                                                                                                                ×
                                                                                                                                                                                </button>
                                                                                                                                                                </li>
                                                                                                                                                ))}
                                                                                                                                </ul>
                                                                                                                                <div className="cart-total">
                                                                                                                                                <span>Разом</span>
                                                                                                                                                <strong>{formatPrice(totalPrice)}</strong>
                                                                                                                                </div>
                                                                                                                                <button
                                                                                                                                                className="clear-cart-button"
                                                                                                                                                type="button"
                                                                                                                                                onClick={() => dispatch(clearCart())}
                                                                                                                                >
                                                                                                                                                Очистити кошик
                                                                                                                                </button>
                                                                                                                </>
                                                                                                ) : (
                                                                                                                <div className="empty-cart">
                                                                                                                                <span aria-hidden="true">🛍️</span>
                                                                                                                                <p>Кошик поки порожній</p>
                                                                                                                                <span>Додайте товари з каталогу</span>
                                                                                                                </div>
                                                                                                )}
                                                                                </aside>
                                                                </div>
                                                </section>
                                </main>
                );
}

export default App;

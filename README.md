# 🛒 ShopSeeker

**ShopSeeker** is an online grocery delivery mobile application built with **React Native**. It provides services for **common users**, **delivery personnel**, and **merchants**, enabling seamless ordering, delivery tracking, and product management. ShopSeeker also includes an admin portal for delivery drivers and merchants to manage orders, products, and logistics efficiently.

---

## 📦 Features

* 👥 Multi-role support: User, Delivery, Merchant
* 📍 Real-time grocery ordering and delivery
* 📤 Order and delivery management via merchant/delivery portal
* 🔔 In-time notifications using Socket
* 💳 Secure payment integration with **Stripe**
* 🌐 GraphQL-powered backend communication
* 🗃️ Robust state management with **Redux** and **Redux-Saga**
* ☁️ Backend integration with **Parse Server**

---

## 🛠 Tech Stack

| Tech                    | Description                               |
| ----------------------- | ----------------------------------------- |
| React Native            | Cross-platform mobile development         |
| Redux + Redux-Saga      | State management and side-effects         |
| GraphQL                 | Data fetching and mutations               |
| Parse                   | Backend as a service for user & data mgmt |
| Stripe                  | Secure online payments                    |
| Socket               | Real-time updates & notifications         |
| React Navigation        | App navigation and routing                |
| TypeScript / JavaScript | Primary development language              |

---

## 🚀 Getting Started

### Prerequisites

* Node.js >= 14
* Yarn or npm
* Xcode / Android Studio
* Watchman (macOS)

### Installation

```bash
git clone https://github.com/daddyauden/shopseeker-app.git
cd shopseeker-app
npm install
```

### iOS

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### Android

```bash
npx react-native run-android
```

---

## 🔐 Environment Variables

update `.env.development` file in the project root with the following:

```env
PARSE_HOST=***
PARSE_APP_ID=***
PARSE_JS_KEY=***
PARSE_MT_KEY=***

GOOGLE_CLIENT_ID=***

STRIPE_PUBLISHABLE_KEY=***
```

---

## 💳 Payments

**Stripe** is integrated for secure payment processing. The mobile app uses the Stripe SDK and securely communicates with backend services via GraphQL and Parse for creating payment intents and handling transactions.

---

## 🔔 Real-time Notifications

WebSocket is used for push-like, real-time order and delivery updates. This keeps users, merchants, and delivery personnel synced during the order lifecycle.

---

## 🧪 Running Tests

```bash
yarn test
# or with Jest directly
npx jest
```

---

## 🌐 Management Portal

A web-based management portal (not in this repo) is available for:

* **Merchants**: Product listing, inventory control, order management
* **Delivery personnel**: Delivery status tracking, task management

> Portal is built separately and interacts with the same backend.

---

## 🙌 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repo
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Make changes and commit: `git commit -m 'Add some feature'`
4. Push your branch: `git push origin feature/YourFeature`
5. Submit a pull request

---

## 📄 License

This project is licensed under the [GNU License](LICENSE).


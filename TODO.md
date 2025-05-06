# SweetTalker

## What to do when Expo is ejected

When you eject from Expo (to Bare workflow or a Custom Dev Client), you unlock access to native modules and can enable features not available in Expo Go. Here are the key steps and recommendations:

---

### 1. Install Native Firebase Modules

Switch from the Firebase Web SDK to the native modules for better performance and full feature support:

```sh
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
```

---

### 2. Enable Firebase Auth Persistence

With `@react-native-firebase/auth`, user authentication is persisted across app restarts by default using native storage (AsyncStorage). No extra setup is required, but you can explicitly set persistence if needed:

```js
import auth from "@react-native-firebase/auth";

// This is the default, but you can set it explicitly:
auth().setPersistence(auth.Auth.Persistence.LOCAL);
```

---

### 3. Update Firebase Initialization

Replace your Web SDK initialization with the native module:

```js
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// Use these instances throughout your app
```

---

### 4. Update Imports and Usage

- Replace all imports from `firebase/app`, `firebase/auth`, and `firebase/firestore` with the native modules.
- Update your service and hook files to use the new APIs.

---

### 5. Update Permissions and Native Config

- Follow the [react-native-firebase setup guide](https://rnfirebase.io/) for iOS and Android native configuration.
- Update your `android/app/build.gradle`, `ios/Podfile`, and add any required permissions to `AndroidManifest.xml` and `Info.plist`.

---

### 6. Remove Web SDK Packages (Optional)

If you no longer need the Web SDK:

```sh
npm uninstall firebase
```

---

### 7. Other Common Migration Tasks

- Update any other libraries that require native modules (e.g., push notifications, camera, etc.).
- Test all features on both iOS and Android.
- Update your README and documentation to reflect the new setup.

---

## References

- [React Native Firebase Docs](https://rnfirebase.io/)
- [Expo Eject Guide](https://docs.expo.dev/bare/using-expo-client/)
- [Firebase Auth Persistence](https://rnfirebase.io/auth/usage#persisting-authentication)

---

**After ejecting, you can take full advantage of native capabilities and robust authentication persistence!**

- **TODO:** Persisting user messages along with translations introduces a data dependency/race condition; this needs to be addressed in the stores.

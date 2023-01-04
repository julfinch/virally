# Jul Danreb Lactao Portfolio Website
  -Live Site URL: [https://jul-lactao.netlify.app/](https://jul-lactao.netlify.app/)

  -This website is a showcase portfolio that exhibits my web development skills in using React. For this project, I used Gatsby and applied Javascript animations for the interactions using Greensock(GSAP) and Framer Motion. As for my CSS styling, I used Sass and to achieve a more professional-looking portfolio website, I also applied Locomotive-Scroll and Smooth-Scroll.
  
## Table of contents

- [Overview](#overview)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My Process](#process)
  - [Install Dependencies](#dependencies)
  - [Additional Info](#additional-info)
  - [Errors](#errors)
  - [Built With](#built-with)
- [Author](#author)

## Overview

### Screenshot

![](./_readme_img/portfolio.png)

### Links

  -Live Site URL: [https://jul-lactao.netlify.app/](https://jul-lactao.netlify.app/)

## My Process

### Download and Set-Up

1.  **Create the client folder.**

    ```shell
    npx create-react-app client
    ```

1.  **Install dependencies**

    ```shell
    npm i react-redux @reduxjs/toolkit redux-persist react-dropzone dotenv formik yup react-router-dom@6 @mui/material @emotion/react @emotion/styled @mui/icons-material
    ```

1.  **Create a new file called jsconfig.json to the root directory**

    The code will let us make the **src** folder to be the root directory when we import modules.
    ```shell
    {
        "compilerOptions": {
            "baseUrl": "src"
        },
        "include": ["src"]
    }
    ```

1.  **Paste the following inside index.css**

    ```shell
    @import url("https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap");

    html,
    body,
    #root,
    .app {
    height: 100%;
    width: 100%;
    font-family: "Rubik", sans-serif;
    }
    ```

### Setting up Redux and themes

1.  **Create a scenes folder under src folder and then create 5 new folders. Inside them, create index.jsx**

    ```shell
    --src
        --scenes
            --homePage
                --index.jsx
            --loginPage
                --index.jsx
                --Form.jsx
            --navbar
                --index.jsx
            --profilePage
                --index.jsx
            --widgets
                --index.jsx
    ```
1.  **Create 2 another folders under src folder called components and state.**

    ```shell
    --src
        --components
        --state
    ```

1.  **Go to App.js and paste the codes.**

    ```shell
    import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
    import HomePage from 'scenes/homePage'
    import LoginPage from 'scenes/loginPage'
    import ProfilePage from 'scenes/profilePage'


    function App() {
    return (
        <div className="app">
            <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
            </Routes>
            </BrowserRouter>
        </div>
    );
    }

    export default App;
    ```

1.  **Under state folder, create index.js and set all the states for the app**

    ```shell
    import { createSlice } from "@reduxjs/toolkit";

    const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
    };

    export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
        state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        },
        setLogout: (state) => {
        state.user = null;
        state.token = null;
        },
        setFriends: (state, action) => {
        if (state.user) {
            state.user.friends = action.payload.friends;
        } else {
            console.error("user friends non-existent :(");
        }
        },
        setPosts: (state, action) => {
        state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
        const updatedPosts = state.posts.map((post) => {
            if (post._id === action.payload.post._id) return action.payload.post;
            return post;
        });
        state.posts = updatedPosts;
        },
    },
    });

    export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
    authSlice.actions;
    export default authSlice.reducer;
    ```

1.  **Under the src folder, open index.js and update the code by importing redux**

    ```shell
    import React from "react";
    import ReactDOM from "react-dom/client";
    import "./index.css";
    import App from "./App";
    import authReducer from "./state";
    import { configureStore } from "@reduxjs/toolkit";
    import { Provider } from "react-redux";
    import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    } from "redux-persist";
    import storage from "redux-persist/lib/storage";
    import { PersistGate } from "redux-persist/integration/react";

    const persistConfig = { key: "root", storage, version: 1 };
    const persistedReducer = persistReducer(persistConfig, authReducer);
    const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
        }),
    });

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
    <React.StrictMode>
        <Provider store={store}>
        <PersistGate loading={null} persistor={persistStore(store)}>
            <App />
        </PersistGate>
        </Provider>
    </React.StrictMode>
    );
    ```

1.  **Under the src directory, create the theme.js.**

    ```shell
    // color design tokens export
    export const colorTokens = {
    grey: {
        0: "#FFFFFF",
        10: "#F6F6F6",
        50: "#F0F0F0",
        100: "#E0E0E0",
        200: "#C2C2C2",
        300: "#A3A3A3",
        400: "#858585",
        500: "#666666",
        600: "#4D4D4D",
        700: "#333333",
        800: "#1A1A1A",
        900: "#0A0A0A",
        1000: "#000000",
    },
    primary: {
        50: "#E6FBFF",
        100: "#CCF7FE",
        200: "#99EEFD",
        300: "#66E6FC",
        400: "#33DDFB",
        500: "#00D5FA",
        600: "#00A0BC",
        700: "#006B7D",
        800: "#00353F",
        900: "#001519",
    },
    };

    // mui theme settings
    export const themeSettings = (mode) => {
    return {
        palette: {
        mode: mode,
        ...(mode === "dark"
            ? {
                // palette values for dark mode
                primary: {
                dark: colorTokens.primary[200],
                main: colorTokens.primary[500],
                light: colorTokens.primary[800],
                },
                neutral: {
                dark: colorTokens.grey[100],
                main: colorTokens.grey[200],
                mediumMain: colorTokens.grey[300],
                medium: colorTokens.grey[400],
                light: colorTokens.grey[700],
                },
                background: {
                default: colorTokens.grey[900],
                alt: colorTokens.grey[800],
                },
            }
            : {
                // palette values for light mode
                primary: {
                dark: colorTokens.primary[700],
                main: colorTokens.primary[500],
                light: colorTokens.primary[50],
                },
                neutral: {
                dark: colorTokens.grey[700],
                main: colorTokens.grey[500],
                mediumMain: colorTokens.grey[400],
                medium: colorTokens.grey[300],
                light: colorTokens.grey[50],
                },
                background: {
                default: colorTokens.grey[10],
                alt: colorTokens.grey[0],
                },
            }),
        },
        typography: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 12,
        h1: {
            fontFamily: ["Rubik", "sans-serif"].join(","),
            fontSize: 40,
        },
        h2: {
            fontFamily: ["Rubik", "sans-serif"].join(","),
            fontSize: 32,
        },
        h3: {
            fontFamily: ["Rubik", "sans-serif"].join(","),
            fontSize: 24,
        },
        h4: {
            fontFamily: ["Rubik", "sans-serif"].join(","),
            fontSize: 20,
        },
        h5: {
            fontFamily: ["Rubik", "sans-serif"].join(","),
            fontSize: 16,
        },
        h6: {
            fontFamily: ["Rubik", "sans-serif"].join(","),
            fontSize: 14,
        },
        },
    };
    };
    ```

1.  **Go to App.js and update the code with our new state and MUI them.**

    ```shell
    import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
    import HomePage from "scenes/homePage";
    import LoginPage from "scenes/loginPage";
    import ProfilePage from "scenes/profilePage";
    import { useMemo } from "react";
    import { useSelector } from "react-redux";
    import { CssBaseline, ThemeProvider } from "@mui/material";
    import { createTheme } from "@mui/material/styles";
    import { themeSettings } from "./theme";

    function App() {
    const mode = useSelector((state) => state.mode);
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    return (
        <div className="app">
        <BrowserRouter>
            <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
            </Routes>
            </ThemeProvider>
        </BrowserRouter>
        </div>
    );
    }

    export default App;
    ```

1.  **NPM RUN START to check if there's any error**

    ```shell
    npm run start
    ```

### Setting up the pages and components

1.  **Go to components folder and create a file called FlexBetween.jsx**

    ```shell
    import { Box } from "@mui/material";
    import { styled } from "@mui/system";

    const FlexBetween = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    });

    export default FlexBetween;
    ```

1.  **Navbar**

    ```shell
    npx create-react-app client
    ```

1.  **LoginPage**

    ```shell
    npx create-react-app client
    ```

1.  **Add authorization on the pages, update the App.js by adding isAuth.**

    ```shell
    import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
    import HomePage from "scenes/homePage";
    import LoginPage from "scenes/loginPage";
    import ProfilePage from "scenes/profilePage";
    import { useMemo } from "react";
    import { useSelector } from "react-redux";
    import { CssBaseline, ThemeProvider } from "@mui/material";
    import { createTheme } from "@mui/material/styles";
    import { themeSettings } from "./theme";

    function App() {
    const mode = useSelector((state) => state.mode);
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    const isAuth = Boolean(useSelector((state) => state.token));

    return (
        <div className="app">
        <BrowserRouter>
            <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                path="/home"
                element={isAuth ? <HomePage /> : <Navigate to="/" />}
                />
                <Route
                path="/profile/:userId"
                element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
                />
            </Routes>
            </ThemeProvider>
        </BrowserRouter>
        </div>
    );
    }

    export default App;
    ```

1.  **Create the client folder.**

    ```shell
    npx create-react-app client
    ```




### Install Dependencies

```js
"dependencies": {
    "classnames": "^2.3.1",
    "eslint": "^8.20.0",
    "framer-motion": "^6.5.1",
    "gatsby": "^4.19.2",
    "gatsby-plugin-gatsby-cloud": "^4.19.0",
    "gatsby-plugin-image": "^2.19.0",
    "gatsby-plugin-less": "^6.19.0",
    "gatsby-plugin-manifest": "^4.19.0",
    "gatsby-plugin-offline": "^5.19.0",
    "gatsby-plugin-react-helmet": "^5.19.0",
    "gatsby-plugin-sass": "^5.19.0",
    "gatsby-plugin-sharp": "^4.19.0",
    "gatsby-source-filesystem": "^4.19.0",
    "gatsby-transformer-sharp": "^4.19.0",
    "gsap": "^3.10.4",
    "less": "^4.1.3",
    "less-loader": "^11.0.0",
    "locomotive-scroll": "^4.1.4",
    "prop-types": "^15.8.1",
    "react": "^18.1.0",
    "react-dom": "^18.1.0",
    "react-helmet": "^6.1.0",
    "react-icons": "^4.4.0",
    "react-loadable": "^5.5.0",
    "sass": "^1.54.0",
    "sharp": "0.30.7",
    "smooth-scrollbar": "^8.7.5"
  },
```

### Additional Info

**GATSBY-CONFIG.JS**
```js
	module.exports = {
  /* Your site config here */
  siteMetadata: {
    title: `Jul Danreb Lactao`,
    description: `React Portfolio Website of Jul Danreb Lactao`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
    resolve: "gatsby-plugin-less",
    options: {
      javascriptEnabled: true,
    },
  },
    `gatsby-plugin-less`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-less`,
      options: {
        loaderOptions: {
          appendData: `@env: ${process.env.NODE_ENV};`,
        },
        javascriptEnabled: true,
        modifyVars: {
          "primary-color": "#00BFA6",
        },
      },
    },
  ],
}
```
---

### Errors

- ** [remote rejected] main -> main (shallow update not allowed) error: failed to push some refs t**
![](./_readme_img/prob_a.png)
![](./_readme_img/prob_b.png)

- **Removing Gastby-Starter as old repo then adding my own portfolio-2022 repo as new **
![](./_readme_img/prob_c.png)

- **Continuos development: creating new branch**
![](./_readme_img/github_continuos_dev.png)

---

### Built with

- Semantic HTML5 markup
- SASS
- ReactJS
- Gatsby
- GSAP
- Framer Motion

---
 
## Author

- Twitter - [@julfinch](https://www.twitter.com/julfinch)

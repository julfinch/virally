# Finch Pro 2 - Fullstack
  -Live Site URL: [https://finch-pro-fullstack.vercel.app/](https://finch-pro-fullstack.vercel.app/)
  -Backup Site URL: [https://finch-pro-frontend.onrender.com/](https://finch-pro-frontend.onrender.com/)
  
  
## Table of contents

- [Overview](#overview)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [Creating a Github Repository](#repo)
- [Author](#author)

## Overview

### Screenshot

![](./_readme_img/portfolio.png)

### Links

  -Live Site URL: [https://finch-pro-fullstack.vercel.app/](https://finch-pro-fullstack.vercel.app/)
  -Backup Site URL: [https://finch-pro-frontend.onrender.com/](https://finch-pro-frontend.onrender.com/)

## Creating a Github Repository
1.  **Delete .git inside client folder to avoid errors during pushing**
1.  **Create .gitignore inside client folder and make sure to include /node_modules and .env.local**

    ```shell
    # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

    # dependencies
    /node_modules
    /.pnp
    .pnp.js

    # testing
    /coverage

    # production
    /build

    # misc
    .DS_Store
    .env.local
    .env.development.local
    .env.test.local
    .env.production.local

    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    ```

1.  **Create .gitignore inside server folder and paste the code below**

    ```shell
    /node_modules
    .env
    ```

1.  **Git init**

    Navigate into your new site’s main directory and then git init.

    ```shell
    cd ..
    git init
    ```

1.  **Create a new repository in the github website**
1.  **Go back to VScode and start pushing**

    ```shell
    git add .
    git commit -m "first commit"
    git remote add origin
    git remote add origin https://github.com/julfinch/finch-pro-fullstack.git
    git push origin master
    ```

---
 
## Author

- Twitter - [@julfinch](https://www.twitter.com/julfinch)

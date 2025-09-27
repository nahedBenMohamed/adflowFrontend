# Amwork Frontend

## Prepare the environment

### Clone the repo

```bash
# Create project directory
mkdir amwork

# Go to project directory
cd amwork

# Clone the repo
git clone https://gitlab.com/amwork/amwork-frontend.git .

# Install dependencies
npm install
```

### Start dev server

```bash
npm start
```

### Start the dev server in production mode

```bash
npm run serve
```

### Build for production

```bash
npm run build
```

## Proxy and reverse proxy

### Run reverse proxy

```bash
docker-compose up -d
```

### Rebuild reverse proxy

```bash
docker-compose stop $@ && docker-compose rm -f $@ && docker-compose build $@ && docker-compose up -d $@
```

## Documentation and storybook

Storybook deployment is available at [https://amwork.dev/storybook/](https://amwork.dev/storybook/).

### Run storybook

```bash
npm run storybook
```

### Build storybook

```bash
npm run storybook:build
```

### Code and exports analysis

More about [knip](https://github.com/webpro/knip).

```bash
npm run knip
```

### Storybook credentials

```text
login: admin
password: amwork
```

You can as well see them in `.storybook/preview.ts` file.

### Finale

This piece of software was made with soul and love.
Unfortunately, the project was suspended on 24 of September 2025. 
I was the last engineer to maintain it. 
Please contact me if you have any questions.

— Egor Kondratev, kondratevegor04@gmail.com
# UniSign Docs

## Commands
**Install**
```shell
npm install
```

**Local Development**
```shell
npm run dev
```

**Build**
```shell
npm run build
```

## Add document
If you want to add a document, please do the following things:
1. Add a new `.md` file in this repo.
2. Add the corresponding other language version of the doc, if necessary.
3. Update sidebar manu in [./.vuepress/locales/en.ts](./.vuepress/locales/en.ts)

## GitHub actions
We are using GitHub actions to build & publish docs.
Once the `main` branch is pushed to GitHub, `deploy` action will do the following things:

1. Fetch the latest version of code
2. Install dependencies
3. Build docs
4. Deploy docs under `.vuepress/dist` to GitHub pages, with target branch `gh-pages`

## Redirect
If we moved a doc to a more proper place and want to keep the old route working, then we need `<Redirect>`.
`<Redirect>` is a component registered locally, you can simply put it in the old doc, and users visiting the old doc will be redirected to the new doc.
```jsx
// /path-to/legacy-doc.md
<Redirect to="/path-to/new-doc.md"/>
```
In the example above, when users enter `/path-to/legacy-doc`, they will be redirected to `/path-to/new-doc` automatically.
In this way, we can keep the legacy path work.

<Redirect to="/zh/guide"/>

import { uppercaseFirstLetter } from "../../helpers/uppercaseFirstLetter"

const RouterV6 = (routes: string[], name?: string, withTabs?: boolean, main?: boolean) => {
  if(name === 'index')
    name = ''
  const generateRoutes = () => {
    return routes.map(route => {
      return (`        <Route element={<div>${route} component here</div>} path="${route}" />`)
    })
}
  const generateTabs = () => {
    return routes.map(route => {
      return `      <NavLink className={({ isActive }) => \`nav-link \${isActive ? 'active' : ''}\`} to="${route}">${uppercaseFirstLetter(route)}</NavLink>`
     })
  }
 
  return [
    `import React from 'react';`,
    `import { Navigate, Route, Routes } from 'react-router';`,
    ...(main || withTabs ? [`import { ${main ? 'BrowserRouter' : ''}${main && withTabs ? ', ' : ''}${withTabs ? `NavLink` : ``} } from 'react-router-dom';`] : []),
    ``,
    `const ${name??''}Router = () => {`,
    `  return (`,
    `    <${main ? 'BrowserRouter' : ''}>`,
    ...(withTabs ? [`      <NavLink className={({ isActive }) => \`nav-link \${isActive ? 'active' : ''}\`} to=".">Root</NavLink>`, ...generateTabs()] : []),
    `      <Routes>`,
    ...(main ? [`        <Route path="*" element={<Navigate to="/" />} />`] : []),
    `        <Route path="/" element={<div>root</div>} />`,
    ...generateRoutes(),
    ...(!main ? [`        <Route path="*" element={<Navigate to="../${routes[0]}" />} />`] : []),
    `      </Routes>`,
    `    </${main ? 'BrowserRouter' : ''}>`,
    `  );`,
    `}`,
    ``,
    `export { ${name??''}Router };`,
    ``

  ].join('\n')
}
export { RouterV6 };
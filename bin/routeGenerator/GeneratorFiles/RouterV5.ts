import { uppercaseFirstLetter } from "../../helpers/uppercaseFirstLetter"

const RouterV5 = (routes: string[], name?: string, withTabs?: boolean, main?: boolean, ts?: boolean) => {
  if(name === 'index')
  name = '';
  const generateTabs = () => {
    return routes.map(route => {
      return (`
    {
      name: "${uppercaseFirstLetter(route)}",
      url: "${route}",
      selected: history.location.pathname.includes("${route}")
    }`)
    }).join(',')
  }
  const generateRoutes = () => {
      return routes.map(route => {
        return (`<Route exact component={() => <div>component here</div>} path={\`\${path}/${route}\`} />`)
      }).join('\n        ')
  }
  return `
import React${ts ? ', { FC }' : ''} from "react"
import {${main ? ' BrowserRouter as MainRouter,' : ''} useRouteMatch, Switch, Route, Redirect${withTabs ? ', useHistory' : ''} } from "react-router"
${withTabs && ts ? `
interface Tab {
  name: string
  selected: boolean
  url: string
}
` :''}
const ${name}Router${ts ? ': FC' : ''} = () => {
  const { path } = useRouteMatch() ${withTabs ? `
  const history = useHistory()`: ''}
  ${withTabs ? `
  const tabs${ts ? ': Tab[]': ''} = [${generateTabs()}
  ]
  ` : ''}
  return (
    <${main ? 'MainRouter': ''}>${withTabs ? `
      <div className="Tabs">
        {tabs.map(tab => (
          <div onClick={() => history.push(tab.url)} key={tab.url} className={\`Tab \${tab.selected ? 'selected' : ''}\`}>
            {tab.name}
          </div>
        ))}
      </div>` : ''}
      <Switch>
        ${generateRoutes()}
        <Redirect to={\`\${path}/${routes[0]}\`} />
      </Switch>
    </${main ? 'MainRouter': ''}>
  )
}

export { ${name}Router }`
}

export { RouterV5 }
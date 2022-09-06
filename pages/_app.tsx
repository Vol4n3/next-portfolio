import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {TemplateProvider} from '../features/template/template-provider';

function MyApp({Component, pageProps}: AppProps) {
  return <TemplateProvider><Component {...pageProps}></Component></TemplateProvider>
}

export default MyApp

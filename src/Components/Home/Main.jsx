import React from 'react'
import Footer from '../Footer/Footer';
import { Sidebar } from '../Sidebar/Sidebar'
import { Header } from '../Header/Header'
import '../../scss/styletheme.scss'
import {Dashboard} from '../../Components/Home/Dashboard'

export const Index = () => {
  return (
    <div>
        <Sidebar/>
        <div className="wrapper d-flex flex-column min-vh-100">
       <Header/>
      <Dashboard/>
      <Footer/>
    </div>
       
    </div>
  )
}

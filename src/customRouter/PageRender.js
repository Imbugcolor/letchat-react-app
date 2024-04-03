import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import NotFound from '../pages/NotFound';

const generatePage = (slug) =>{
    const component = () => require(`../pages/${slug}`).default;
    try {
        return React.createElement(component())
    } catch (error) {
        return <NotFound/>
    }
}

const PageRender = () => {
    const {page, id} = useParams()
    const { auth } = useSelector(state => state)
   let slug = "";
   if (auth.token) {
    if(id){
        slug = `${page}/[id]`;
       }
       else{
        slug = `${page}`;
       }
   }

  return generatePage(slug)
}

export default PageRender
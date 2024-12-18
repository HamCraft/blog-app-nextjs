


import BlogList from "./components/BlogList";
import ViewBlogs from "./components/ViewBlogs";





export default function Home() {
  return (
    <div className="bg-slate-900 min-h-screen">
      
      <ViewBlogs/>
      <BlogList/>

    </div>
  
  );
}

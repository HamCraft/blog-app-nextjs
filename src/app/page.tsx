
import { BeforeSignedIn } from "./components/BeforeSignedIn";
import BlogList from "./components/BlogList";
import { Navigation } from "./components/Navigation";



export default function Home() {
  return (
    <div className="bg-slate-900 min-h-screen">
      <Navigation/>
      <BeforeSignedIn/>
      <BlogList/>

    </div>
  
  );
}

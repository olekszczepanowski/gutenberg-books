import "./socials.css";
import githubLogo from "../assets/github-mark-white.png"
import linkedinLogo from "../assets/linkedin.png"

function Socials(){
    
    return(<div id="socials">
        <a href="https://github.com/olekszczepanowski">
            <img className="socials-logo" src={githubLogo} alt="GitHub Logo"/>
            </a>
        <a href="https://www.linkedin.com/in/aleksander-szczepanowski-a8bab7291/">
            <img className="socials-logo" src={linkedinLogo} alt="Linkedin Logo"/>
            </a>
        </div>)
}

export default Socials
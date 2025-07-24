import React, { useState } from 'react';
// Import the images directly
import aaronImage from './photos/team/GAaronKibbie.jpeg';
import danielImage from './photos/team/DanielPeckham.jpeg';
import anthonyImage from './photos/team/AnthonyHart.jpeg';
import aidenImage from './photos/team/GAidenKibbie.jpeg';
import corinneImage from './photos/team/ECorinneKibbie.jpg';

import './css/team.css';

const Team = () => {
  const [activeCard, setActiveCard] = useState(null);
  
  const teamMembers = [
    {
      id: 1,
      name: "G. Aaron Kibbie",
      title: "Principle Engineer, Architect",
      // Use the imported image instead of path
      photo: aaronImage,
      bio: "With expertise in cloud development and microservice architecture, Aaron leads TitanTech's architectural vision and implementation. His experience spans .NET, Azure, AWS, and modern development practices.",
      specialties: ["Cloud Architecture", "MicroService Design", "Azure DevOps", "Enterprise Software"],
      experience: "25+ years in software engineering with leadership roles as Principal Engineer, Software Architect, and Technical Lead for enterprise applications.",
      linkedin: "https://www.linkedin.com/in/aaron-kibbie-b72a401/",
      technologies: ["Azure", "AWS", "CI/CD", ".NET Core", "Cloud Migration", ".NET Framework", "C#", "microservices", "javascript", "typescript", "tsql", "sql", "vb.net", "vb", "WCF", "WPF", "REST", "SOAP", "agile", "scrum", "kanban", "docker", "kubernetes", "git", "github", "azure devops", "jira", "confluence", "lucid", "and more..."]
    },
    {
      id: 2,
      name: "Daniel Peckham",
      title: "Full Stack Developer",
      // Use the imported image instead of path
      photo: danielImage,
      bio: "Daniel brings extensive experience in modern web technologies and .NET development, specializing in creating seamless user experiences with React and Angular.",
      specialties: ["Full Stack Development", "React/TypeScript", ".NET Applications", "Clean Architecture"],
      experience: "6+ years as a Full Stack Developer specializing in .NET, React, and TypeScript. Experience in financial technology, aerospace, and healthcare sectors.",
      linkedin: "https://www.linkedin.com/in/daniel-peckham/",
      technologies: [".NET", "React", "TypeScript", "Vue", "Vue.js", "Azure DevOps", "Microservices", "Docker", "entity framework", "sql", "git", "HTML", "CSS", "C#", "and more..."]
    },
    {
      id: 3,
      name: "Anthony Hart",
      title: "Senior Software Engineer / Technical Lead",
      // Use the imported image instead of path
      photo: anthonyImage,
      bio: "With 25+ years of experience, Anthony specializes in developing and architecting enterprise-grade solutions, with deep expertise in .NET, Angular, and REST services.",
      specialties: ["Software Architecture", "REST Services", "SQL Server", "Mobile Development"],
      experience: "25+ years as a Senior Software Engineer and Technical Lead, guiding teams in implementing microservice architectures and enterprise solutions.",
      linkedin: "https://www.linkedin.com/in/anthony-hart-1a69154",
      technologies: ["C#", "ASP.NET", "Angular", "REST Services", "SQL Server", "XML", "SQL", "agile methodologies", "docker", "kubernetes", "jira", "confluence", "lucid", "and more..."]
    },
    {
      id: 4,
      name: "G. Aiden Kibbie",
      title: "Junior Software Engineer",
      // Use the imported image instead of path
      photo: aidenImage,
      bio: "Aiden is a passionate software engineer with a focus on web development and a keen interest in cloud technologies.",
      specialties: ["Web Development", "Cloud Technologies", "Agile Methodologies"],
      experience: "Junior Software Engineer focused on front-end development and cloud-based application development.",
      linkedin: "https://www.linkedin.com/in/george-kibbie-957b83314/",
      technologies: ["html", "css", "javascript", "react", "node.js", "lua"]
    },
    {
      id: 5,
      name: "E. Corinne Kibbie",
      title: "Sales and Marketing Director",
      // Use the imported image instead of path
      photo: corinneImage,
      bio: "Corinne is a results-driven marketing professional with a passion for technology and innovation.",
      specialties: ["Digital Marketing", "Content Strategy", "SEO", "Social Media Management"],
      experience: "7+ years in marketing roles, with a focus on technology companies and startups.",
      linkedin: null,
      technologies: ["SEO", "Content Marketing", "Social Media", "Email Marketing", "Marketing Automation"]
    }
  ];

  const handleTeamMemberClick = (id) => {
    setActiveCard(activeCard === id ? null : id);
  };

  return (
    <div className="team-page">
      <h1>Our Expert Team</h1>
      <p className="team-intro">
        At Titan Tech Solutions, our team combines decades of experience in software 
        architecture, development, and testing to deliver exceptional results for our clients.
      </p>

      <div className="team-grid">
        {teamMembers.map(member => (
          <div 
            key={member.id} 
            className={`team-card ${activeCard === member.id ? 'active' : ''}`}
            onClick={() => handleTeamMemberClick(member.id)}
          >
            <div className="team-card-front">
              <div className="team-photo" style={{ backgroundImage: `url(${member.photo})` }}>
                <div className="team-overlay"></div>
              </div>
              <h3>{member.name}</h3>
              <p className="team-title">{member.title}</p>
            </div>
            
            <div className="team-card-back">
              <h3>{member.name}</h3>
              <p className="team-bio">{member.bio}</p>
              <h4>Specialties</h4>
              <ul className="team-specialties">
                {member.specialties.map((specialty, index) => (
                  <li key={index}>{specialty}</li>
                ))}
              </ul>
              <h4>Experience</h4>
              <p>{member.experience}</p>
              <div className="technology-tags">
                {member.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div className="team-social">
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
import React, { useState } from 'react';
import './css/team.css';

const Team = () => {
  const [activeTeamMember, setActiveTeamMember] = useState(null);
  
  const teamMembers = [
    {
      id: 1,
      name: "G. Aaron Kibbie",
      title: "Principle Engineer, Architect",
      photo: "/photos/team/aaron.jpg", // Add team photos to this directory
      bio: "With expertise in cloud development and microservice architecture, Aaron leads TitanTech's architectural vision and implementation. His experience spans .NET, Azure, AWS, and modern development practices.",
      specialties: ["Cloud Architecture", "MicroService Design", "Azure DevOps", "Enterprise Software"],
      experience: "25+ years in software engineering with leadership roles as Principal Engineer, Software Architect, and Technical Lead for enterprise applications.",
      github: "https://github.com/yourusername", // Replace with actual links
      linkedin: "https://www.linkedin.com/in/aaron-kibbie-b72a401/",
      technologies: ["Azure", "AWS", "CI/CD", ".NET Core", "Cloud Migration", ".NET Framework", "C#", "microservices", "javascript", "typescript", "tsql", "sql", "vb.net", "vb", "WCF", "WPF", "REST", "SOAP", "agile", "scrum", "kanban", "docker", "kubernetes", "git", "github", "azure devops", "jira", "confluence", "lucid", "and more..."]
    },
    {
      id: 2,
      name: "Daniel Peckham",
      title: "Full Stack Developer",
      photo: "/photos/team/daniel.jpg", // Add team photos to this directory
      bio: "Daniel brings extensive experience in modern web technologies and .NET development, specializing in creating seamless user experiences with React and Angular.",
      specialties: ["Full Stack Development", "React/TypeScript", ".NET Applications", "Clean Architecture"],
      experience: "6+ years as a Full Stack Developer specializing in .NET, React, and TypeScript. Experience in financial technology, aerospace, and healthcare sectors.",
      github: "https://github.com/yourusername", // Replace with actual links
      linkedin: "https://www.linkedin.com/in/daniel-peckham/", // Replace with actual links
      technologies: [".NET", "React", "TypeScript", "Vue", "Vue.js", "Azure DevOps", "Microservices", "Docker", "entity framework", "sql", "git", "HTML", "CSS", "C#", "and more..."]
    },
    {
      id: 3,
      name: "Anthony Hart",
      title: "Senior Software Engineer / Technical Lead",
      photo: "/photos/team/anthony.jpg", // Add team photos to this directory
      bio: "With 25+ years of experience, Anthony specializes in developing and architecting enterprise-grade solutions, with deep expertise in .NET, Angular, and REST services.",
      specialties: ["Software Architecture", "REST Services", "SQL Server", "Mobile Development"],
      experience: "25+ years as a Senior Software Engineer and Technical Lead, guiding teams in implementing microservice architectures and enterprise solutions.",
      github: "https://github.com/yourusername", // Replace with actual links
      linkedin: "https://www.linkedin.com/in/anthony-hart-1a69154",
      technologies: ["C#", "ASP.NET", "Angular", "REST Services", "SQL Server", "XML", "SQL", "agile methodologies", "docker", "kubernetes", "jira", "confluence", "lucid", "and more..."]
    },
    {
      id: 4,
      name: "G. Aiden Kibbie",
      title: "Junior Software Engineer",
      photo: "/photos/team/megan.jpg", // Add team photos to this directory
      bio: "Aiden is a passionate software engineer with a focus on web development and a keen interest in cloud technologies.",
      specialties: ["Web Development", "Cloud Technologies", "Agile Methodologies"],
      experience: "1+ year as a Junior Software Engineer focused on front-end development and cloud-based application development.",
      github: "https://github.com/yourusername", // Replace with actual links
      linkedin: "https://www.linkedin.com/in/george-kibbie-957b83314/",
      technologies: ["html", "css", "javascript", "react", "node.js", "lua"]
    }
  ];

  const handleTeamMemberClick = (id) => {
    setActiveTeamMember(activeTeamMember === id ? null : id);
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
            className={`team-card ${activeTeamMember === member.id ? 'active' : ''}`}
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
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                {/* <a href={member.github} target="_blank" rel="noopener noreferrer">GitHub</a> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;